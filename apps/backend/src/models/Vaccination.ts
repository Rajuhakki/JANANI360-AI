import mongoose, { Schema, Document } from 'mongoose';

export interface IVaccinationDocument extends Document {
  childId: mongoose.Types.ObjectId;
  vaccineCode: 'BCG' | 'OPV_0' | 'HEP_B0' | 'OPV_1' | 'PENTAVALENT_1' | 'ROTA_1' | 'MEASLES_RUBELLA_1';
  vaccineName: string;
  scheduledDueDate: Date;
  administeredDate?: Date;
  administeredByUserId?: mongoose.Types.ObjectId;
  status: 'PENDING' | 'ADMINISTERED' | 'OVERDUE';
}

const VaccinationSchema = new Schema<IVaccinationDocument>(
  {
    childId: { type: Schema.Types.ObjectId, ref: 'Child', required: true },
    vaccineCode: { 
      type: String, 
      enum: ['BCG', 'OPV_0', 'HEP_B0', 'OPV_1', 'PENTAVALENT_1', 'ROTA_1', 'MEASLES_RUBELLA_1'],
      required: true 
    },
    vaccineName: { type: String, required: true },
    scheduledDueDate: { type: Date, required: true },
    administeredDate: { type: Date },
    administeredByUserId: { type: Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['PENDING', 'ADMINISTERED', 'OVERDUE'], default: 'PENDING' }
  },
  { timestamps: true }
);

export const Vaccination = mongoose.model<IVaccinationDocument>('Vaccination', VaccinationSchema);
