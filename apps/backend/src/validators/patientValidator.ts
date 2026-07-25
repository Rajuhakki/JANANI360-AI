import { z } from 'zod';

export const createPatientSchema = z.object({
  body: z.object({
    rchId: z.string().min(5, 'RCH ID required'),
    fullName: z.string().min(2, 'Full name required'),
    age: z.number().min(14).max(55),
    phone: z.string().min(10),
    husbandName: z.string().optional(),
    village: z.string().min(2),
    taluk: z.string().min(2),
    district: z.string().default('Bengaluru Urban'),
    pinCode: z.string().length(6),
    bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']).optional(),
    lmpDate: z.string().min(10, 'LMP date required')
  })
});

export const recordVisitSchema = z.object({
  body: z.object({
    patientId: z.string().min(1),
    pregnancyId: z.string().min(1),
    visitNumber: z.number().min(1).max(10),
    systolicBp: z.number().min(60).max(240),
    diastolicBp: z.number().min(40).max(160),
    hbLevel: z.number().min(3.0).max(20.0),
    weightKg: z.number().min(30.0).max(150.0),
    gestationalAgeWeeks: z.number().min(4).max(42),
    urineProtein: z.string().optional(),
    randomBloodSugar: z.number().optional(),
    doctorNotes: z.string().optional()
  })
});
