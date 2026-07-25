import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { AuthenticatedRequest } from '../middleware/rbac';
import { z } from 'zod';

const pncVisitSchema = z.object({
  motherId: z.string().uuid(),
  visitNumber: z.number().min(1).max(4),
  maternalPulse: z.number().min(40).max(180),
  systolicBp: z.number().min(60).max(240),
  diastolicBp: z.number().min(40).max(140),
  temperatureF: z.number().default(98.4),
  excessiveBleeding: z.boolean().default(false),
  foulLochia: z.boolean().default(false),
  breastfeedingStatus: z.enum(['EXCLUSIVE', 'PARTIAL', 'NONE']).default('EXCLUSIVE')
});

const vaccineSchema = z.object({
  immunizationRecordId: z.string().uuid(),
  batchNumber: z.string().min(2, 'Batch number required')
});

const growthSchema = z.object({
  childId: z.string().uuid(),
  ageMonths: z.number().min(0).max(60),
  weightKg: z.number().min(1.0).max(35.0),
  heightCm: z.number().min(40.0).max(130.0),
  muacCm: z.number().optional()
});

/**
 * POST /api/v1/children/pnc-visits (Record PNC 1-4 Visit for Mother)
 */
export const recordPncVisit = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, error: 'UNAUTHORIZED' });
      return;
    }

    const validation = pncVisitSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({ success: false, error: 'INVALID_INPUT', details: validation.error.flatten().fieldErrors });
      return;
    }

    const data = validation.data;

    const pncVisit = await prisma.pncVisit.create({
      data: {
        motherId: data.motherId,
        visitNumber: data.visitNumber,
        maternalPulse: data.maternalPulse,
        systolicBp: data.systolicBp,
        diastolicBp: data.diastolicBp,
        temperatureF: data.temperatureF,
        excessiveBleeding: data.excessiveBleeding,
        foulLochia: data.foulLochia,
        breastfeedingStatus: data.breastfeedingStatus,
        pphDangerSigns: data.excessiveBleeding ? 'Warning: Excessive Postpartum Bleeding' : null,
        recordedByUserId: userId
      }
    });

    res.status(201).json({
      success: true,
      message: `PNC-${data.visitNumber} visit recorded successfully`,
      pncVisit
    });
  } catch (error: any) {
    console.error('❌ Error in recordPncVisit:', error);
    res.status(500).json({ success: false, error: 'SERVER_ERROR' });
  }
};

/**
 * POST /api/v1/children/vaccines (Administer Vaccine & Log Batch Number)
 */
export const recordVaccineAdministration = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, error: 'UNAUTHORIZED' });
      return;
    }

    const validation = vaccineSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({ success: false, error: 'INVALID_INPUT', details: validation.error.flatten().fieldErrors });
      return;
    }

    const { immunizationRecordId, batchNumber } = validation.data;

    const vaccineRecord = await prisma.childImmunizationRecord.update({
      where: { id: immunizationRecordId },
      data: {
        status: 'GIVEN',
        givenDate: new Date(),
        batchNumber,
        administeredByUserId: userId
      }
    });

    res.status(200).json({
      success: true,
      message: `Vaccine ${vaccineRecord.vaccineCode} administered successfully`,
      vaccineRecord
    });
  } catch (error: any) {
    console.error('❌ Error in recordVaccineAdministration:', error);
    res.status(500).json({ success: false, error: 'SERVER_ERROR' });
  }
};

/**
 * POST /api/v1/children/growth (Record Child Height/Weight & WHO Z-Score)
 */
export const recordChildGrowth = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, error: 'UNAUTHORIZED' });
      return;
    }

    const validation = growthSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({ success: false, error: 'INVALID_INPUT', details: validation.error.flatten().fieldErrors });
      return;
    }

    const { childId, ageMonths, weightKg, heightCm, muacCm } = validation.data;

    // Standard WHO Median Weight calculation approximation for 0-60 months
    const expectedWeight = 3.3 + ageMonths * 0.5;
    const zScore = parseFloat(((weightKg - expectedWeight) / 1.1).toFixed(2));
    const malnutritionStatus = zScore < -3.0 ? 'SAM' : zScore < -2.0 ? 'MAM' : 'NORMAL';

    const growthRecord = await prisma.childGrowthRecord.create({
      data: {
        childId,
        ageMonths,
        weightKg,
        heightCm,
        muacCm: muacCm || null,
        whoWeightForAgeZScore: zScore,
        malnutritionStatus,
        recordedByUserId: userId
      }
    });

    res.status(201).json({
      success: true,
      message: `Growth record logged. Malnutrition Status: ${malnutritionStatus} (Z-score: ${zScore})`,
      growthRecord
    });
  } catch (error: any) {
    console.error('❌ Error in recordChildGrowth:', error);
    res.status(500).json({ success: false, error: 'SERVER_ERROR' });
  }
};

/**
 * GET /api/v1/children/:id (Child Profile Hub & Immunization Schedule)
 */
export const getChildProfileHub = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const child = await prisma.childProfile.findFirst({
      where: {
        OR: [{ id }, { childRchId: id }]
      },
      include: {
        mother: {
          select: {
            id: true,
            fullName: true,
            phone: true,
            husbandName: true,
            rchId: true,
            village: { select: { nameEn: true } },
            pncVisits: { orderBy: { visitNumber: 'asc' } }
          }
        },
        immunizationRecords: { orderBy: { dueAgeWeeks: 'asc' } },
        growthRecords: { orderBy: { ageMonths: 'asc' } }
      }
    });

    if (!child) {
      res.status(404).json({ success: false, error: 'CHILD_NOT_FOUND' });
      return;
    }

    const givenCount = child.immunizationRecords.filter(i => i.status === 'GIVEN').length;
    const totalCount = child.immunizationRecords.length;
    const immunizationCoveragePercent = Math.round((givenCount / totalCount) * 100);

    res.status(200).json({
      success: true,
      child,
      immunizationCoveragePercent
    });
  } catch (error: any) {
    console.error('❌ Error in getChildProfileHub:', error);
    res.status(500).json({ success: false, error: 'SERVER_ERROR' });
  }
};
