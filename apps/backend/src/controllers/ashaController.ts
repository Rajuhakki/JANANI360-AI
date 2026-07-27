import { Response } from 'express';
import { prisma } from '../config/prisma';
import { AuthenticatedRequest } from '../middleware/rbac';
import { z } from 'zod';

// Zod Validation Schemas (Simple ASHA Field-Level Data Entry)
const ashaRegisterMotherSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  age: z.number().min(12, 'Age must be at least 12').max(60, 'Age must be at most 60'),
  phone: z.string().min(10, 'Valid 10-digit mobile number required').max(15),
  villageId: z.string().uuid('Village selection is required'),
  facilityId: z.string().uuid('Assigned PHC selection is required'),
  lmpDate: z.string().min(1, 'LMP date is required'),
  gravida: z.number().min(1).max(15).default(1)
});

const ashaHomeVisitSchema = z.object({
  motherId: z.string().uuid('Mother selection is required'),
  visitDate: z.string().min(1, 'Visit date is required'),
  dangerSigns: z.boolean(),
  remarks: z.string().optional(),
  nextVisitDate: z.string().optional()
});

/**
 * GET /api/v1/asha/form-options
 * Villages + PHC facilities for the ASHA data entry dropdowns
 */
export const getFormOptions = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const [villages, facilities] = await Promise.all([
      prisma.village.findMany({
        select: { id: true, nameEn: true, nameKn: true },
        orderBy: { nameEn: 'asc' }
      }),
      prisma.healthFacility.findMany({
        where: { tier: 'PHC' },
        select: { id: true, nameEn: true, nameKn: true, tier: true },
        orderBy: { nameEn: 'asc' }
      })
    ]);

    res.status(200).json({ success: true, villages, facilities });
  } catch (error: any) {
    console.error('❌ Error in getFormOptions:', error);
    res.status(500).json({ success: false, error: 'SERVER_ERROR', message: error.message });
  }
};

/**
 * GET /api/v1/asha/mothers
 * Simple mother list for the Home Visit "Select Mother" dropdown
 */
export const listMothers = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const mothers = await prisma.motherProfile.findMany({
      select: {
        id: true,
        rchId: true,
        fullName: true,
        phone: true,
        village: { select: { nameEn: true } }
      },
      orderBy: { createdAt: 'desc' },
      take: 200
    });

    res.status(200).json({ success: true, count: mothers.length, data: mothers });
  } catch (error: any) {
    console.error('❌ Error in listMothers:', error);
    res.status(500).json({ success: false, error: 'SERVER_ERROR', message: error.message });
  }
};

/**
 * POST /api/v1/asha/mothers (Simple ASHA Mother Registration)
 * Generates a unique Mother ID (RCH ID) and creates the Mother Profile + Pregnancy Record.
 * Location hierarchy (district/taluk/hobli/sub-center/catchment) is resolved server-side.
 */
export const registerMother = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, error: 'UNAUTHORIZED' });
      return;
    }

    const validation = ashaRegisterMotherSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({
        success: false,
        error: 'INVALID_INPUT',
        details: validation.error.flatten().fieldErrors
      });
      return;
    }

    const data = validation.data;

    // Resolve location hierarchy upward from the selected village
    const village = await prisma.village.findUnique({
      where: { id: data.villageId },
      include: { hobli: { include: { taluk: true } } }
    });
    if (!village) {
      res.status(400).json({ success: false, error: 'INVALID_INPUT', message: 'Selected village not found' });
      return;
    }

    // Resolve sub-center & catchment: prefer the logged-in ASHA's own assignment
    const subCenter =
      (req.user?.subCenterId
        ? await prisma.subCenter.findUnique({ where: { id: req.user.subCenterId } })
        : null) ||
      (await prisma.subCenter.findFirst({ where: { facilityId: data.facilityId } })) ||
      (await prisma.subCenter.findFirst());
    if (!subCenter) {
      res.status(400).json({ success: false, error: 'NO_SUB_CENTER', message: 'No sub-center configured for this PHC' });
      return;
    }

    const catchment =
      (req.user?.catchmentId
        ? await prisma.ashaCatchment.findUnique({ where: { id: req.user.catchmentId } })
        : null) ||
      (await prisma.ashaCatchment.findFirst({ where: { subCenterId: subCenter.id } })) ||
      (await prisma.ashaCatchment.findFirst());
    if (!catchment) {
      res.status(400).json({ success: false, error: 'NO_CATCHMENT', message: 'No ASHA catchment configured' });
      return;
    }

    // Generate a unique Mother ID (RCH-format)
    let rchId = `12900${Math.floor(1000000 + Math.random() * 9000000)}`;
    while (await prisma.motherProfile.findUnique({ where: { rchId } })) {
      rchId = `12900${Math.floor(1000000 + Math.random() * 9000000)}`;
    }

    const lmp = new Date(data.lmpDate);
    const edd = new Date(lmp.getTime() + 280 * 24 * 60 * 60 * 1000);

    const mother = await prisma.motherProfile.create({
      data: {
        rchId,
        fullName: data.fullName,
        age: data.age,
        phone: data.phone,
        husbandName: 'Not Recorded',
        caseStatus: 'REGISTERED_ANC_ACTIVE',
        currentRiskLevel: 'LOW',
        motherSafetyScore: 95,
        status: 'PREGNANT',
        districtId: village.hobli.taluk.districtId,
        talukId: village.hobli.talukId,
        hobliId: village.hobliId,
        villageId: village.id,
        facilityId: data.facilityId,
        subCenterId: subCenter.id,
        catchmentId: catchment.id,
        registeredByUserId: userId
      }
    });

    const pregnancy = await prisma.pregnancyRecord.create({
      data: {
        motherId: mother.id,
        gravida: data.gravida,
        parity: Math.max(0, data.gravida - 1),
        abortions: 0,
        lmpDate: lmp,
        eddDate: edd,
        currentRiskLevel: 'LOW',
        motherSafetyScore: 95,
        status: 'PREGNANT',
        medicalHistory: JSON.stringify([]),
        highRiskFactors: JSON.stringify([])
      }
    });

    await prisma.activityLog.create({
      data: {
        motherId: mother.id,
        eventType: 'PREGNANCY_REGISTERED',
        description: `Mother registered via ASHA Data Entry by ${req.user?.name}. Mother ID ${rchId} assigned (G${data.gravida}).`,
        actorName: req.user?.name || 'ASHA Worker',
        actorRole: req.user?.role || 'ASHA_WORKER'
      }
    });

    await prisma.auditLog.create({
      data: {
        userId,
        actionType: 'PATIENT_REGISTERED',
        resource: 'ASHA_DATA_ENTRY',
        newValue: JSON.stringify({ motherId: mother.id, rchId }),
        ipAddress: req.ip
      }
    });

    res.status(201).json({
      success: true,
      message: 'Mother registered successfully',
      motherId: rchId,
      mother,
      pregnancy
    });
  } catch (error: any) {
    console.error('❌ Error in ASHA registerMother:', error);
    res.status(500).json({ success: false, error: 'SERVER_ERROR', message: error.message });
  }
};

/**
 * POST /api/v1/asha/home-visits (Simple ASHA Home Visit Record)
 */
export const recordHomeVisit = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, error: 'UNAUTHORIZED' });
      return;
    }

    const validation = ashaHomeVisitSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({
        success: false,
        error: 'INVALID_INPUT',
        details: validation.error.flatten().fieldErrors
      });
      return;
    }

    const data = validation.data;

    const mother = await prisma.motherProfile.findUnique({ where: { id: data.motherId } });
    if (!mother) {
      res.status(404).json({ success: false, error: 'MOTHER_NOT_FOUND', message: 'Mother profile not found' });
      return;
    }

    const visit = await prisma.homeVisit.create({
      data: {
        motherId: data.motherId,
        visitDate: new Date(data.visitDate),
        dangerSigns: data.dangerSigns,
        remarks: data.remarks || null,
        nextVisitDate: data.nextVisitDate ? new Date(data.nextVisitDate) : null,
        recordedByUserId: userId
      }
    });

    await prisma.activityLog.create({
      data: {
        motherId: data.motherId,
        eventType: data.dangerSigns ? 'HOME_VISIT_DANGER_SIGNS' : 'HOME_VISIT_RECORDED',
        description: `Home visit recorded by ${req.user?.name}. Danger signs: ${data.dangerSigns ? 'YES — needs medical attention' : 'No'}.${data.remarks ? ` Remarks: ${data.remarks}` : ''}`,
        actorName: req.user?.name || 'ASHA Worker',
        actorRole: req.user?.role || 'ASHA_WORKER'
      }
    });

    res.status(201).json({
      success: true,
      message: 'Home visit saved successfully',
      visit
    });
  } catch (error: any) {
    console.error('❌ Error in recordHomeVisit:', error);
    res.status(500).json({ success: false, error: 'SERVER_ERROR', message: error.message });
  }
};
