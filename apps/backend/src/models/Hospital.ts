import mongoose, { Schema, Document } from 'mongoose';

export interface IHospitalDocument extends Document {
  name: string;
  facilityCode: string; // e.g. KA-PHC-10492
  type: 'PHC' | 'CHC' | 'SDH' | 'DISTRICT_HOSPITAL' | 'TERTIARY_MEDICAL_COLLEGE';
  district: string;
  taluk: string;
  totalBeds: number;
  availableIcuBeds: number;
  availableMaternityBeds: number;
  bloodBankAvailable: boolean;
  ventilatorsAvailable: number;
  geoCoordinates: {
    latitude: number;
    longitude: number;
  };
  contactPhone: string;
  emergencyHelpline: string;
}

const HospitalSchema = new Schema<IHospitalDocument>(
  {
    name: { type: String, required: true },
    facilityCode: { type: String, required: true, unique: true },
    type: { 
      type: String, 
      enum: ['PHC', 'CHC', 'SDH', 'DISTRICT_HOSPITAL', 'TERTIARY_MEDICAL_COLLEGE'],
      required: true 
    },
    district: { type: String, required: true },
    taluk: { type: String, required: true },
    totalBeds: { type: Number, default: 20 },
    availableIcuBeds: { type: Number, default: 4 },
    availableMaternityBeds: { type: Number, default: 10 },
    bloodBankAvailable: { type: Boolean, default: true },
    ventilatorsAvailable: { type: Number, default: 2 },
    geoCoordinates: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true }
    },
    contactPhone: { type: String, required: true },
    emergencyHelpline: { type: String, default: '108' }
  },
  { timestamps: true }
);

export const Hospital = mongoose.model<IHospitalDocument>('Hospital', HospitalSchema);
