import mongoose, { Schema, Document } from 'mongoose';

export interface IChildDocument extends Document {
  pregnancyId: mongoose.Types.ObjectId;
  motherId: mongoose.Types.ObjectId;
  childRchId: string; // e.g. KA-CH-2026-88123
  fullName: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  birthDate: Date;
  birthWeightKg: number;
  gestationalAgeAtBirthWeeks: number;
  deliveryType: 'NORMAL_VAGINAL' | 'ASSISTED_FORCEPS' | 'CESAREAN_SECTION';
  apgarScore: number; // 1 - 10
  bloodGroup?: string;
  status: 'HEALTHY' | 'UNDER_OBSERVATION' | 'SAM_ALERT';
}

const ChildSchema = new Schema<IChildDocument>(
  {
    pregnancyId: { type: Schema.Types.ObjectId, ref: 'Pregnancy', required: true },
    motherId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
    childRchId: { type: String, required: true, unique: true },
    fullName: { type: String, required: true, trim: true },
    gender: { type: String, enum: ['MALE', 'FEMALE', 'OTHER'], required: true },
    birthDate: { type: Date, required: true, default: Date.now },
    birthWeightKg: { type: Number, required: true },
    gestationalAgeAtBirthWeeks: { type: Number, default: 39 },
    deliveryType: { type: String, enum: ['NORMAL_VAGINAL', 'ASSISTED_FORCEPS', 'CESAREAN_SECTION'], default: 'NORMAL_VAGINAL' },
    apgarScore: { type: Number, default: 9 },
    bloodGroup: { type: String },
    status: { type: String, enum: ['HEALTHY', 'UNDER_OBSERVATION', 'SAM_ALERT'], default: 'HEALTHY' }
  },
  { timestamps: true }
);

export const Child = mongoose.model<IChildDocument>('Child', ChildSchema);
