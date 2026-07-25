import { z } from 'zod';

export const districtQuerySchema = z.object({
  stateId: z.string().uuid({ message: 'stateId must be a valid UUID' }).optional()
});

export const talukQuerySchema = z.object({
  districtId: z.string().uuid({ message: 'districtId must be a valid UUID' })
});

export const hobliQuerySchema = z.object({
  talukId: z.string().uuid({ message: 'talukId must be a valid UUID' })
});

export const villageQuerySchema = z.object({
  hobliId: z.string().uuid({ message: 'hobliId must be a valid UUID' })
});

export const facilityQuerySchema = z.object({
  talukId: z.string().uuid({ message: 'talukId must be a valid UUID' }),
  tier: z.enum(['PHC', 'CHC', 'TALUK_HOSPITAL', 'DISTRICT_HOSPITAL', 'TERTIARY_COLLEGE']).optional()
});

export const subCenterQuerySchema = z.object({
  facilityId: z.string().uuid({ message: 'facilityId must be a valid UUID' })
});

export const catchmentQuerySchema = z.object({
  subCenterId: z.string().uuid({ message: 'subCenterId must be a valid UUID' })
});
