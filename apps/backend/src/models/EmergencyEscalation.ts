import mongoose, { Schema, Document } from 'mongoose';

export interface IEmergencyEscalationDocument extends Document {
  patientId: mongoose.Types.ObjectId;
  ashaWorkerId?: mongoose.Types.ObjectId;
  distressType: 'ECLAMPSIA_SEIZURE' | 'POSTPARTUM_HEMORRHAGE' | 'SEVERE_HYPERTENSION' | 'OBSTRUCTED_LABOR' | 'GENERAL_DISTRESS';
  status: 'ACTIVE' | 'AMBULANCE_DISPATCHED' | 'ARRIVED_AT_FACILITY' | 'RESOLVED';
  locationCoordinates: {
    latitude: number;
    longitude: number;
  };
  allocatedAmbulanceNumber: string;
  etaMinutes: number;
  notes?: string;
}

const EmergencyEscalationSchema = new Schema<IEmergencyEscalationDocument>(
  {
    patientId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
    ashaWorkerId: { type: Schema.Types.ObjectId, ref: 'User' },
    distressType: { 
      type: String, 
      enum: ['ECLAMPSIA_SEIZURE', 'POSTPARTUM_HEMORRHAGE', 'SEVERE_HYPERTENSION', 'OBSTRUCTED_LABOR', 'GENERAL_DISTRESS'],
      required: true 
    },
    status: { type: String, enum: ['ACTIVE', 'AMBULANCE_DISPATCHED', 'ARRIVED_AT_FACILITY', 'RESOLVED'], default: 'ACTIVE' },
    locationCoordinates: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true }
    },
    allocatedAmbulanceNumber: { type: String, default: 'KA-108-AMB-99' },
    etaMinutes: { type: Number, default: 12 },
    notes: { type: String }
  },
  { timestamps: true }
);

export const EmergencyEscalation = mongoose.model<IEmergencyEscalationDocument>('EmergencyEscalation', EmergencyEscalationSchema);
