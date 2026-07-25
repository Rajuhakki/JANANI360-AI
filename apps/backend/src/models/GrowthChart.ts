import mongoose, { Schema, Document } from 'mongoose';

export interface IGrowthChartDocument extends Document {
  childId: mongoose.Types.ObjectId;
  ageInMonths: number;
  weightKg: number;
  heightCm: number;
  headCircumferenceCm?: number;
  whoZScore: number; // WHO Weight-for-Age Z-Score
  malnutritionStatus: 'NORMAL' | 'MAM_MODERATE' | 'SAM_SEVERE'; // SAM: Severe Acute Malnutrition
  recordedByUserId: mongoose.Types.ObjectId;
}

const GrowthChartSchema = new Schema<IGrowthChartDocument>(
  {
    childId: { type: Schema.Types.ObjectId, ref: 'Child', required: true },
    ageInMonths: { type: Number, required: true },
    weightKg: { type: Number, required: true },
    heightCm: { type: Number, required: true },
    headCircumferenceCm: { type: Number },
    whoZScore: { type: Number, default: 0.0 },
    malnutritionStatus: { type: String, enum: ['NORMAL', 'MAM_MODERATE', 'SAM_SEVERE'], default: 'NORMAL' },
    recordedByUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

export const GrowthChart = mongoose.model<IGrowthChartDocument>('GrowthChart', GrowthChartSchema);
