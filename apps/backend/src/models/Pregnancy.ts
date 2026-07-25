import mongoose, { Schema, Document } from 'mongoose';

export interface IPregnancyDocument extends Document {
  patientId: mongoose.Types.ObjectId;
  lmpDate: Date; // Last Menstrual Period
  eddDate: Date; // Expected Date of Delivery
  gravida: number; // Number of pregnancies
  parity: number; // Number of births
  highRiskCategory: 'NONE' | 'PREECLAMPSIA' | 'SEVERE_ANEMIA' | 'MALNUTRITION' | 'MULTIPLE_RISKS';
  motherSafetyScore: number; // 0 - 100
  status: 'PREGNANT' | 'DELIVERED' | 'COMPLICATED' | 'TRANSFERRED';
}

const PregnancySchema = new Schema<IPregnancyDocument>(
  {
    patientId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
    lmpDate: { type: Date, required: true },
    eddDate: { type: Date, required: true },
    gravida: { type: Number, default: 1 },
    parity: { type: Number, default: 0 },
    highRiskCategory: { 
      type: String, 
      enum: ['NONE', 'PREECLAMPSIA', 'SEVERE_ANEMIA', 'MALNUTRITION', 'MULTIPLE_RISKS'],
      default: 'NONE' 
    },
    motherSafetyScore: { type: Number, default: 95 },
    status: { type: String, enum: ['PREGNANT', 'DELIVERED', 'COMPLICATED', 'TRANSFERRED'], default: 'PREGNANT' }
  },
  { timestamps: true }
);

export const Pregnancy = mongoose.model<IPregnancyDocument>('Pregnancy', PregnancySchema);
