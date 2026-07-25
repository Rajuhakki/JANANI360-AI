import mongoose, { Schema, Document } from 'mongoose';

export interface IReferralDocument extends Document {
  pregnancyId: mongoose.Types.ObjectId;
  patientId: mongoose.Types.ObjectId;
  sourceHospitalId: mongoose.Types.ObjectId;
  targetHospitalId: mongoose.Types.ObjectId;
  referralReason: string;
  urgency: 'ROUTINE' | 'URGENT' | 'EMERGENCY';
  status: 'PENDING' | 'ACCEPTED' | 'IN_TRANSIT' | 'COMPLETED' | 'CANCELLED';
  reservedBedType: 'MATERNITY' | 'ICU' | 'VENTILATOR';
  transferTransportRequested: boolean; // 108 Ambulance requested
  ambulanceNumber?: string;
  referringDoctorId: mongoose.Types.ObjectId;
  acceptingDoctorId?: mongoose.Types.ObjectId;
  clinicalSummary: {
    motherSafetyScore: number;
    systolicBp: number;
    diastolicBp: number;
    hbLevel: number;
    aiRiskLevel: string;
  };
}

const ReferralSchema = new Schema<IReferralDocument>(
  {
    pregnancyId: { type: Schema.Types.ObjectId, ref: 'Pregnancy', required: true },
    patientId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
    sourceHospitalId: { type: Schema.Types.ObjectId, ref: 'Hospital', required: true },
    targetHospitalId: { type: Schema.Types.ObjectId, ref: 'Hospital', required: true },
    referralReason: { type: String, required: true },
    urgency: { type: String, enum: ['ROUTINE', 'URGENT', 'EMERGENCY'], default: 'EMERGENCY' },
    status: { type: String, enum: ['PENDING', 'ACCEPTED', 'IN_TRANSIT', 'COMPLETED', 'CANCELLED'], default: 'PENDING' },
    reservedBedType: { type: String, enum: ['MATERNITY', 'ICU', 'VENTILATOR'], default: 'MATERNITY' },
    transferTransportRequested: { type: Boolean, default: true },
    ambulanceNumber: { type: String },
    referringDoctorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    acceptingDoctorId: { type: Schema.Types.ObjectId, ref: 'User' },
    clinicalSummary: {
      motherSafetyScore: { type: Number },
      systolicBp: { type: Number },
      diastolicBp: { type: Number },
      hbLevel: { type: Number },
      aiRiskLevel: { type: String }
    }
  },
  { timestamps: true }
);

export const Referral = mongoose.model<IReferralDocument>('Referral', ReferralSchema);
