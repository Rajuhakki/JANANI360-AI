import { z } from 'zod';

export const createChildSchema = z.object({
  body: z.object({
    pregnancyId: z.string().min(1),
    motherId: z.string().min(1),
    childRchId: z.string().min(5, 'Child RCH-ID required'),
    fullName: z.string().min(2, 'Child full name required'),
    gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
    birthWeightKg: z.number().min(0.5).max(8.0),
    gestationalAgeAtBirthWeeks: z.number().min(24).max(44).optional(),
    deliveryType: z.enum(['NORMAL_VAGINAL', 'ASSISTED_FORCEPS', 'CESAREAN_SECTION']).optional(),
    apgarScore: z.number().min(1).max(10).optional(),
    bloodGroup: z.string().optional()
  })
});

export const administerVaccineSchema = z.object({
  body: z.object({
    vaccineCode: z.enum(['BCG', 'OPV_0', 'HEP_B0', 'OPV_1', 'PENTAVALENT_1', 'ROTA_1', 'MEASLES_RUBELLA_1'])
  })
});

export const recordGrowthSchema = z.object({
  body: z.object({
    ageInMonths: z.number().min(0).max(60),
    weightKg: z.number().min(1.0).max(35.0),
    heightCm: z.number().min(30.0).max(130.0),
    headCircumferenceCm: z.number().optional()
  })
});
