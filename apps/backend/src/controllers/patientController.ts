import { Request, Response } from 'express';
import mongoose from 'mongoose';
import http from 'http';
import { Patient, IPatientDocument } from '../models/Patient';
import { Pregnancy, IPregnancyDocument } from '../models/Pregnancy';
import { Visit, IVisitDocument } from '../models/Visit';
import { AuthenticatedRequest } from '../middleware/auth';

// In-Memory Fallback Maternal Registry
const inMemoryPatients: IPatientDocument[] = [
  {
    _id: '66a0f1234567890123456790',
    rchId: 'KA-RCH-2026-98124',
    abhaNumber: '91-8845-1234-5678',
    fullName: 'Lakshmi Devi',
    age: 24,
    phone: '+91 98450 99000',
    husbandName: 'Manjunath Gowda',
    village: 'Varthur Koti',
    taluk: 'Mahadevapura',
    district: 'Bengaluru Urban',
    pinCode: '560087',
    bloodGroup: 'O+',
    status: 'ACTIVE'
  } as any
];

const inMemoryPregnancies: IPregnancyDocument[] = [
  {
    _id: '66a0f1234567890123456791',
    patientId: '66a0f1234567890123456790' as any,
    lmpDate: new Date('2026-01-10'),
    eddDate: new Date('2026-10-17'),
    gravida: 1,
    parity: 0,
    highRiskCategory: 'NONE',
    motherSafetyScore: 92,
    status: 'PREGNANT'
  } as any
];

const inMemoryVisits: IVisitDocument[] = [];

// HTTP Client helper to query Python FastAPI AI Microservice
const callAiRiskService = (payload: any): Promise<any> => {
  return new Promise((resolve) => {
    const data = JSON.stringify(payload);
    const req = http.request({
      hostname: 'localhost',
      port: 8000,
      path: '/api/v1/predict-risk',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      },
      timeout: 3000
    }, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          if (res.statusCode === 200) resolve(JSON.parse(body));
          else resolve(null);
        } catch {
          resolve(null);
        }
      });
    });

    req.on('error', () => resolve(null));
    req.on('timeout', () => { req.destroy(); resolve(null); });
    req.write(data);
    req.end();
  });
};

export const createPatient = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { rchId, abhaNumber, fullName, age, phone, husbandName, village, taluk, district, pinCode, bloodGroup, lmpDate } = req.body;
    const isDbConnected = mongoose.connection.readyState === 1;

    const lmp = new Date(lmpDate);
    const edd = new Date(lmp.getTime() + 280 * 24 * 60 * 60 * 1000); // LMP + 280 days

    if (isDbConnected) {
      const existing = await Patient.findOne({ rchId });
      if (existing) return res.status(409).json({ error: 'Patient with this RCH-ID already registered' });

      const patient = new Patient({
        rchId,
        abhaNumber,
        fullName,
        age,
        phone,
        husbandName,
        village,
        taluk,
        district: district || 'Bengaluru Urban',
        pinCode,
        bloodGroup,
        ashaWorkerId: req.user?.userId
      });
      await patient.save();

      const pregnancy = new Pregnancy({
        patientId: patient._id,
        lmpDate: lmp,
        eddDate: edd,
        motherSafetyScore: 95,
        status: 'PREGNANT'
      });
      await pregnancy.save();

      return res.status(201).json({ message: 'Pregnant mother registered successfully', patient, pregnancy });
    } else {
      const patientId = '66a0f' + Date.now().toString(16);
      const pregnancyId = '66a0f' + (Date.now() + 1).toString(16);

      const memPatient = {
        _id: patientId,
        rchId,
        abhaNumber,
        fullName,
        age,
        phone,
        husbandName,
        village,
        taluk,
        district: district || 'Bengaluru Urban',
        pinCode,
        bloodGroup,
        status: 'ACTIVE'
      } as any;

      const memPregnancy = {
        _id: pregnancyId,
        patientId,
        lmpDate: lmp,
        eddDate: edd,
        gravida: 1,
        parity: 0,
        highRiskCategory: 'NONE',
        motherSafetyScore: 95,
        status: 'PREGNANT'
      } as any;

      inMemoryPatients.push(memPatient);
      inMemoryPregnancies.push(memPregnancy);

      return res.status(201).json({ message: 'Pregnant mother registered successfully', patient: memPatient, pregnancy: memPregnancy });
    }
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to register maternal patient record' });
  }
};

export const getAllPatients = async (req: Request, res: Response) => {
  try {
    const { search, district, status } = req.query;
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      const query: any = {};
      if (district) query.district = district;
      if (status) query.status = status;
      if (search) {
        query.$or = [
          { fullName: { $regex: search, $options: 'i' } },
          { rchId: { $regex: search, $options: 'i' } },
          { phone: { $regex: search, $options: 'i' } }
        ];
      }

      const patients = await Patient.find(query).sort({ createdAt: -1 });
      return res.json({ count: patients.length, patients });
    } else {
      let filtered = [...inMemoryPatients];
      if (search) {
        const s = (search as string).toLowerCase();
        filtered = filtered.filter(p => p.fullName.toLowerCase().includes(s) || p.rchId.toLowerCase().includes(s));
      }
      return res.json({ count: filtered.length, patients: filtered });
    }
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to fetch maternal patient list' });
  }
};

export const getPatientMe = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const isDbConnected = mongoose.connection.readyState === 1;
    const userEmail = req.user?.email || '';
    const userPhone = userEmail.includes('mother') ? '+91 98450 99000' : '';

    if (isDbConnected) {
      let patient = userPhone ? await Patient.findOne({ phone: userPhone }) : null;
      if (!patient) patient = await Patient.findOne().sort({ createdAt: -1 });
      if (!patient) return res.status(404).json({ error: 'No maternal record found' });

      const pregnancy = await Pregnancy.findOne({ patientId: patient._id });
      const visits = pregnancy ? await Visit.find({ pregnancyId: pregnancy._id }).sort({ visitNumber: 1 }) : [];

      return res.json({ patient, pregnancy, visits });
    } else {
      let patient = userPhone ? inMemoryPatients.find(p => p.phone === userPhone) : null;
      if (!patient) patient = inMemoryPatients[0];

      const pregnancy = inMemoryPregnancies.find(pr => pr.patientId.toString() === patient!._id.toString());
      const visits = inMemoryVisits.filter(v => v.patientId.toString() === patient!._id.toString());

      return res.json({ patient, pregnancy, visits });
    }
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to fetch mother personal profile' });
  }
};

export const getPatientDetails = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      const patient = await Patient.findById(id);
      if (!patient) return res.status(404).json({ error: 'Patient EHR record not found' });

      const pregnancy = await Pregnancy.findOne({ patientId: id, status: 'PREGNANT' });
      const visits = pregnancy ? await Visit.find({ pregnancyId: pregnancy._id }).sort({ visitNumber: 1 }) : [];

      return res.json({ patient, pregnancy, visits });
    } else {
      const patient = inMemoryPatients.find(p => p._id.toString() === id || p.rchId === id);
      if (!patient) return res.status(404).json({ error: 'Patient EHR record not found' });

      const pregnancy = inMemoryPregnancies.find(pr => pr.patientId.toString() === patient._id.toString());
      const visits = inMemoryVisits.filter(v => v.patientId.toString() === patient._id.toString());

      return res.json({ patient, pregnancy, visits });
    }
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to retrieve maternal patient details' });
  }
};

export const recordVisit = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { patientId, pregnancyId, visitNumber, systolicBp, diastolicBp, hbLevel, weightKg, gestationalAgeWeeks, urineProtein, randomBloodSugar, doctorNotes } = req.body;

    // 1. Invoke Python FastAPI AI Risk Prediction Engine
    const aiResponse = await callAiRiskService({
      systolic_bp: systolicBp,
      diastolic_bp: diastolicBp,
      hb_level: hbLevel,
      weight_kg: weightKg,
      gestational_age_weeks: gestationalAgeWeeks,
      urine_protein: urineProtein || 'Nil',
      random_blood_sugar: randomBloodSugar || 100
    });

    const aiPrediction = aiResponse || {
      mother_safety_score: Math.max(10, 100 - (systolicBp > 140 ? 30 : 0) - (hbLevel < 9 ? 35 : 0)),
      risk_level: systolicBp > 140 || hbLevel < 9 ? 'HIGH' : 'LOW',
      preeclampsia_risk: systolicBp > 140 ? 'MODERATE' : 'LOW',
      anemia_severity: hbLevel < 9 ? 'MODERATE' : 'NORMAL',
      malnutrition_risk: 'NORMAL',
      clinical_recommendations: ['Monitor vitals regularly.'],
      referral_recommended: systolicBp > 140 || hbLevel < 9,
      target_facility_type: systolicBp > 140 ? 'DISTRICT_HOSPITAL' : 'PHC'
    };

    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      const visit = new Visit({
        pregnancyId,
        patientId,
        visitNumber,
        systolicBp,
        diastolicBp,
        hbLevel,
        weightKg,
        gestationalAgeWeeks,
        urineProtein: urineProtein || 'Nil',
        randomBloodSugar: randomBloodSugar || 100,
        doctorNotes,
        recordedByUserId: req.user?.userId || new mongoose.Types.ObjectId(),
        aiRiskPrediction: {
          motherSafetyScore: aiPrediction.mother_safety_score,
          riskLevel: aiPrediction.risk_level,
          preeclampsiaRisk: aiPrediction.preeclampsia_risk,
          anemiaSeverity: aiPrediction.anemia_severity,
          malnutritionRisk: aiPrediction.malnutrition_risk,
          recommendations: aiPrediction.clinical_recommendations,
          referralRecommended: aiPrediction.referral_recommended,
          targetFacilityType: aiPrediction.target_facility_type
        }
      });
      await visit.save();

      // Update Pregnancy Mother Safety Score & Risk Level
      const pregnancy = await Pregnancy.findById(pregnancyId);
      if (pregnancy) {
        pregnancy.motherSafetyScore = aiPrediction.mother_safety_score;
        if (aiPrediction.risk_level === 'CRITICAL' || aiPrediction.risk_level === 'HIGH') {
          pregnancy.highRiskCategory = aiPrediction.preeclampsia_risk !== 'LOW' ? 'PREECLAMPSIA' : 'SEVERE_ANEMIA';
        }
        await pregnancy.save();
      }

      // Update Patient Status
      if (aiPrediction.mother_safety_score < 50) {
        await Patient.findByIdAndUpdate(patientId, { status: 'HIGH_RISK_ALERT' });
      }

      return res.status(201).json({
        message: 'ANC Visit recorded and analyzed by JANANI360 AI Engine',
        visit,
        aiRiskPrediction: aiPrediction
      });
    } else {
      const visitId = '66a0f' + Date.now().toString(16);
      const memVisit = {
        _id: visitId,
        pregnancyId,
        patientId,
        visitNumber,
        visitDate: new Date(),
        systolicBp,
        diastolicBp,
        hbLevel,
        weightKg,
        gestationalAgeWeeks,
        urineProtein: urineProtein || 'Nil',
        randomBloodSugar: randomBloodSugar || 100,
        doctorNotes,
        aiRiskPrediction: {
          motherSafetyScore: aiPrediction.mother_safety_score,
          riskLevel: aiPrediction.risk_level,
          preeclampsiaRisk: aiPrediction.preeclampsia_risk,
          anemiaSeverity: aiPrediction.anemia_severity,
          malnutritionRisk: aiPrediction.malnutrition_risk,
          recommendations: aiPrediction.clinical_recommendations,
          referralRecommended: aiPrediction.referral_recommended,
          targetFacilityType: aiPrediction.target_facility_type
        }
      } as any;

      inMemoryVisits.push(memVisit);

      const memPregnancy = inMemoryPregnancies.find(p => p._id.toString() === pregnancyId);
      if (memPregnancy) {
        memPregnancy.motherSafetyScore = aiPrediction.mother_safety_score;
        if (aiPrediction.mother_safety_score < 50) {
          memPregnancy.highRiskCategory = 'PREECLAMPSIA';
        }
      }

      const memPatient = inMemoryPatients.find(p => p._id.toString() === patientId);
      if (memPatient && aiPrediction.mother_safety_score < 50) {
        memPatient.status = 'HIGH_RISK_ALERT';
      }

      return res.status(201).json({
        message: 'ANC Visit recorded and analyzed by JANANI360 AI Engine',
        visit: memVisit,
        aiRiskPrediction: aiPrediction
      });
    }
  } catch (error: any) {
    console.error('Visit Recording Error:', error);
    return res.status(500).json({ error: 'Failed to record ANC visit and run AI analysis' });
  }
};
