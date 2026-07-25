import { z } from 'zod';

export const createReferralSchema = z.object({
  body: z.object({
    pregnancyId: z.string().min(1),
    patientId: z.string().min(1),
    targetHospitalId: z.string().min(1),
    referralReason: z.string().min(3, 'Referral reason required'),
    urgency: z.enum(['ROUTINE', 'URGENT', 'EMERGENCY']),
    reservedBedType: z.enum(['MATERNITY', 'ICU', 'VENTILATOR']),
    transferTransportRequested: z.boolean().default(true),
    clinicalSummary: z.object({
      motherSafetyScore: z.number(),
      systolicBp: z.number(),
      diastolicBp: z.number(),
      hbLevel: z.number(),
      aiRiskLevel: z.string()
    })
  })
});

export const updateReferralStatusSchema = z.object({
  body: z.object({
    status: z.enum(['PENDING', 'ACCEPTED', 'IN_TRANSIT', 'COMPLETED', 'CANCELLED']),
    ambulanceNumber: z.string().optional()
  })
});

export const createSosBeaconSchema = z.object({
  body: z.object({
    patientId: z.string().min(1),
    distressType: z.enum(['ECLAMPSIA_SEIZURE', 'POSTPARTUM_HEMORRHAGE', 'SEVERE_HYPERTENSION', 'OBSTRUCTED_LABOR', 'GENERAL_DISTRESS']),
    latitude: z.number().default(12.9389),
    longitude: z.number().default(77.7499),
    notes: z.string().optional()
  })
});
