import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import { UserRole } from '../types';

export interface IUserDocument extends Document {
  name: string;
  email: string;
  passwordHash: string;
  phone: string;
  role: UserRole;
  hospitalId?: mongoose.Types.ObjectId;
  district?: string;
  taluk?: string;
  abhaId?: string;
  isVerified: boolean;
  otpSecret?: string;
  refreshToken?: string;
  lastLogin?: Date;
  comparePassword(candidate: string): Promise<boolean>;
}

const UserSchema = new Schema<IUserDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    phone: { type: String, required: true },
    role: { 
      type: String, 
      enum: Object.values(UserRole), 
      default: UserRole.ASHA_WORKER,
      required: true 
    },
    hospitalId: { type: Schema.Types.ObjectId, ref: 'Hospital' },
    district: { type: String, default: 'Bengaluru Urban' },
    taluk: { type: String },
    abhaId: { type: String },
    isVerified: { type: Boolean, default: true },
    otpSecret: { type: String },
    refreshToken: { type: String },
    lastLogin: { type: Date }
  },
  { timestamps: true }
);

UserSchema.pre('save', async function (next) {
  if (!this.isModified('passwordHash')) return next();
  const salt = await bcrypt.genSalt(10);
  this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
  next();
});

UserSchema.methods.comparePassword = async function (candidate: string): Promise<boolean> {
  return bcrypt.compare(candidate, this.passwordHash);
};

export const User = mongoose.model<IUserDocument>('User', UserSchema);
