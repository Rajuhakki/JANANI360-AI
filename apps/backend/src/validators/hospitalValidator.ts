import { z } from 'zod';

export const createHospitalSchema = z.object({
  body: z.object({
    name: z.string().min(3, 'Hospital name required'),
    facilityCode: z.string().min(3, 'Facility code required'),
    type: z.enum(['PHC', 'CHC', 'SDH', 'DISTRICT_HOSPITAL', 'TERTIARY_MEDICAL_COLLEGE']),
    district: z.string().min(2, 'District required'),
    taluk: z.string().min(2, 'Taluk required'),
    totalBeds: z.number().min(1),
    availableIcuBeds: z.number().min(0),
    availableMaternityBeds: z.number().min(0),
    bloodBankAvailable: z.boolean().optional(),
    ventilatorsAvailable: z.number().optional(),
    geoCoordinates: z.object({
      latitude: z.number(),
      longitude: z.number()
    }),
    contactPhone: z.string().min(10)
  })
});

export const updateCapacitySchema = z.object({
  body: z.object({
    availableIcuBeds: z.number().min(0),
    availableMaternityBeds: z.number().min(0),
    ventilatorsAvailable: z.number().min(0).optional()
  })
});
