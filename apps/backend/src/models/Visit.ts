import mongoose, { Schema, Document } from 'mongoose';

export interface IVisitDocument extends Document {
  pregnancyId: mongoose.Types.ObjectId;
  patientId: mongoose.Types.ObjectId;
  visitNumber: number; // 1, 2, 3, 4 (ANC Visits)
  visitDate: Date;
  systolicBp: number;
  diastolicBp: number;
  hbLevel: number;
  weightKg: number;
  gestationalAgeWeeks: number;
  urineProtein?: string;
  randomBloodSugar?: number;
  doctorNotes?: string;
  recordedByUserId: mongoose.Types.ObjectId;
  aiRiskPrediction?: {
    motherSafetyScore: number;
    riskLevel: string;
    preeclampsiaRisk: string;
    anemiaSeverity: string;
    malnutritionRisk: string;
    recommendations: string[];
    referralRecommended: boolean;
    targetFacilityType: string;
  };
}

const VisitSchema = new Schema<IVisitDocument>(
  {
    pregnancyId: { type: Schema.Types.ObjectId, ref: 'Pregnancy', required: true },
    patientId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
    visitNumber: { type: Number, required: true },
    visitDate: { type: Date, default: Date.now },
    systolicBp: { type: Number, required: true },
    diastolicBp: { type: Number, required: true },
    hbLevel: { type: Number, required: true },
    weightKg: { type: Number, required: true },
    gestationalAgeWeeks: { type: Number, required: true },
    urineProtein: { type: String, default: 'Nil' },
    randomBloodSugar: { type: Number, default: 100 },
    doctorNotes: { type: String },
    recordedByUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    aiRiskPrediction: {
      motherSafetyScore: { type: Number },
      riskLevel: { type: String },
      preeclampsiaRisk: { type: String },
      anemiaSeverity: { type: String },
      malnutritionRisk: { type: String },
      recommendations: [{ type: String }],
      referralRecommended: { type: Boolean },
      targetFacilityType: { type: String }
    }
  },
  { timestamps: true }
);

export const Visit = mongoose.model<IVisitDocument>('Visit', VisitSchema);
