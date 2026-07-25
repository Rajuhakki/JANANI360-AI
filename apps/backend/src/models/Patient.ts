import mongoose, { Schema, Document } from 'mongoose';

export interface IPatientDocument extends Document {
  rchId: string; // Reproductive & Child Health ID (e.g. KA-RCH-2026-98124)
  abhaNumber?: string; // Ayushman Bharat Health Account (14-digit)
  fullName: string;
  age: number;
  phone: string;
  husbandName?: string;
  village: string;
  taluk: string;
  district: string;
  pinCode: string;
  ashaWorkerId?: mongoose.Types.ObjectId;
  assignedHospitalId?: mongoose.Types.ObjectId;
  bloodGroup?: string;
  status: 'ACTIVE' | 'DELIVERED' | 'TRANSFERRED' | 'HIGH_RISK_ALERT';
}

const PatientSchema = new Schema<IPatientDocument>(
  {
    rchId: { type: String, required: true, unique: true },
    abhaNumber: { type: String },
    fullName: { type: String, required: true, trim: true },
    age: { type: Number, required: true },
    phone: { type: String, required: true },
    husbandName: { type: String },
    village: { type: String, required: true },
    taluk: { type: String, required: true },
    district: { type: String, required: true, default: 'Bengaluru Urban' },
    pinCode: { type: String, required: true },
    ashaWorkerId: { type: Schema.Types.ObjectId, ref: 'User' },
    assignedHospitalId: { type: Schema.Types.ObjectId, ref: 'Hospital' },
    bloodGroup: { type: String, enum: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'] },
    status: { type: String, enum: ['ACTIVE', 'DELIVERED', 'TRANSFERRED', 'HIGH_RISK_ALERT'], default: 'ACTIVE' }
  },
  { timestamps: true }
);

export const Patient = mongoose.model<IPatientDocument>('Patient', PatientSchema);
