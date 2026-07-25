import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Hospital, IHospitalDocument } from '../models/Hospital';
import { User } from '../models/User';
import { AuthenticatedRequest } from '../middleware/auth';

// Seed / In-Memory Karnataka Hospital Registry Fallback
const inMemoryHospitals: IHospitalDocument[] = [
  {
    _id: '66a0f123456789012345678a',
    name: 'Varthur Primary Health Centre (PHC)',
    facilityCode: 'KA-PHC-560087',
    type: 'PHC',
    district: 'Bengaluru Urban',
    taluk: 'Mahadevapura',
    totalBeds: 15,
    availableIcuBeds: 2,
    availableMaternityBeds: 8,
    bloodBankAvailable: false,
    ventilatorsAvailable: 1,
    geoCoordinates: { latitude: 12.9389, longitude: 77.7499 },
    contactPhone: '+91 80 2845 2200',
    emergencyHelpline: '108'
  } as any,
  {
    _id: '66a0f123456789012345678b',
    name: 'Victoria Hospital (BMCRI Tertiary College)',
    facilityCode: 'KA-TER-560002',
    type: 'TERTIARY_MEDICAL_COLLEGE',
    district: 'Bengaluru Urban',
    taluk: 'Fort',
    totalBeds: 500,
    availableIcuBeds: 45,
    availableMaternityBeds: 120,
    bloodBankAvailable: true,
    ventilatorsAvailable: 25,
    geoCoordinates: { latitude: 12.9629, longitude: 77.5752 },
    contactPhone: '+91 80 2670 1150',
    emergencyHelpline: '108'
  } as any,
  {
    _id: '66a0f123456789012345678c',
    name: 'KC General District Hospital Malleshwaram',
    facilityCode: 'KA-DH-560003',
    type: 'DISTRICT_HOSPITAL',
    district: 'Bengaluru Urban',
    taluk: 'Malleshwaram',
    totalBeds: 250,
    availableIcuBeds: 18,
    availableMaternityBeds: 50,
    bloodBankAvailable: true,
    ventilatorsAvailable: 10,
    geoCoordinates: { latitude: 12.9984, longitude: 77.5704 },
    contactPhone: '+91 80 2334 1771',
    emergencyHelpline: '108'
  } as any
];

// Haversine formula for GIS distance calculation (in kilometers)
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Earth radius km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
};

export const getAllHospitals = async (req: Request, res: Response) => {
  try {
    const { district, type, taluk } = req.query;
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      const query: any = {};
      if (district) query.district = district;
      if (type) query.type = type;
      if (taluk) query.taluk = taluk;

      const hospitals = await Hospital.find(query).sort({ name: 1 });
      return res.json({ count: hospitals.length, hospitals });
    } else {
      let filtered = [...inMemoryHospitals];
      if (district) filtered = filtered.filter(h => h.district === district);
      if (type) filtered = filtered.filter(h => h.type === type);
      if (taluk) filtered = filtered.filter(h => h.taluk === taluk);

      return res.json({ count: filtered.length, hospitals: filtered });
    }
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to fetch hospital directory', details: error.message });
  }
};

export const getHospitalById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      const hospital = await Hospital.findById(id);
      if (!hospital) return res.status(404).json({ error: 'Hospital facility record not found' });

      const staff = await User.find({ hospitalId: id }).select('name email role phone');
      return res.json({ hospital, staff });
    } else {
      const hospital = inMemoryHospitals.find(h => h._id.toString() === id || h.facilityCode === id);
      if (!hospital) return res.status(404).json({ error: 'Hospital facility record not found' });

      return res.json({ hospital, staff: [] });
    }
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to retrieve hospital details' });
  }
};

export const createHospital = async (req: Request, res: Response) => {
  try {
    const { name, facilityCode, type, district, taluk, totalBeds, availableIcuBeds, availableMaternityBeds, bloodBankAvailable, ventilatorsAvailable, geoCoordinates, contactPhone } = req.body;
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      const existing = await Hospital.findOne({ facilityCode });
      if (existing) return res.status(409).json({ error: 'Facility code already registered' });

      const hospital = new Hospital({
        name,
        facilityCode,
        type,
        district,
        taluk,
        totalBeds,
        availableIcuBeds,
        availableMaternityBeds,
        bloodBankAvailable: bloodBankAvailable ?? true,
        ventilatorsAvailable: ventilatorsAvailable ?? 2,
        geoCoordinates,
        contactPhone
      });

      await hospital.save();
      return res.status(201).json({ message: 'Hospital facility onboarded successfully', hospital });
    } else {
      const newHospital = {
        _id: '66a0f' + Date.now().toString(16),
        name,
        facilityCode,
        type,
        district,
        taluk,
        totalBeds,
        availableIcuBeds,
        availableMaternityBeds,
        bloodBankAvailable: bloodBankAvailable ?? true,
        ventilatorsAvailable: ventilatorsAvailable ?? 2,
        geoCoordinates,
        contactPhone,
        emergencyHelpline: '108'
      } as any;

      inMemoryHospitals.push(newHospital);
      return res.status(201).json({ message: 'Hospital facility onboarded successfully', hospital: newHospital });
    }
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to create hospital record' });
  }
};

export const updateCapacity = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { availableIcuBeds, availableMaternityBeds, ventilatorsAvailable } = req.body;
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      const hospital = await Hospital.findById(id);
      if (!hospital) return res.status(404).json({ error: 'Hospital not found' });

      hospital.availableIcuBeds = availableIcuBeds;
      hospital.availableMaternityBeds = availableMaternityBeds;
      if (ventilatorsAvailable !== undefined) hospital.ventilatorsAvailable = ventilatorsAvailable;
      await hospital.save();

      return res.json({ message: 'Live capacity metrics updated', hospital });
    } else {
      const hospital = inMemoryHospitals.find(h => h._id.toString() === id || h.facilityCode === id);
      if (!hospital) return res.status(404).json({ error: 'Hospital not found' });

      hospital.availableIcuBeds = availableIcuBeds;
      hospital.availableMaternityBeds = availableMaternityBeds;
      if (ventilatorsAvailable !== undefined) hospital.ventilatorsAvailable = ventilatorsAvailable;

      return res.json({ message: 'Live capacity metrics updated', hospital });
    }
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to update live hospital capacity' });
  }
};

export const getNearbyHospitals = async (req: Request, res: Response) => {
  try {
    const lat = parseFloat(req.query.lat as string) || 12.9389;
    const lng = parseFloat(req.query.lng as string) || 77.7499;
    const maxDistanceKm = parseFloat(req.query.maxDistanceKm as string) || 50;

    const list = mongoose.connection.readyState === 1 
      ? await Hospital.find() 
      : inMemoryHospitals;

    const nearby = list
      .map(h => {
        const distance = calculateDistance(lat, lng, h.geoCoordinates.latitude, h.geoCoordinates.longitude);
        return { hospital: h, distanceKm: distance };
      })
      .filter(item => item.distanceKm <= maxDistanceKm)
      .sort((a, b) => a.distanceKm - b.distanceKm);

    return res.json({ count: nearby.length, origin: { latitude: lat, longitude: lng }, nearby });
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to compute GIS nearby hospital matrix' });
  }
};
