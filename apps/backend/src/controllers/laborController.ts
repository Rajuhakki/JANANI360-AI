import { Response } from 'express';
import { prisma } from '../config/prisma';
import { AuthenticatedRequest } from '../middleware/rbac';
import { z } from 'zod';

const admitLaborSchema = z.object({
  motherId: z.string().uuid(),
  pregnancyId: z.string().uuid(),
  facilityId: z.string().uuid(),
  laborRoomNumber: z.string().default('LR-02'),
  referralId: z.string().uuid().optional()
});

const partographSchema = z.object({
  laborCaseId: z.string().uuid(),
  cervicalDilationCm: z.number().min(1).max(10),
  fetalHeartRateBpm: z.number().min(60).max(220),
  maternalPulseBpm: z.number().min(40).max(180),
  systolicBp: z.number().min(60).max(240),
  diastolicBp: z.number().min(40).max(140),
  contractionsPer10Min: z.number().min(0).max(10),
  membraneStatus: z.enum(['INTACT', 'RUPTURED_CLEAR', 'MECONIUM_STAINED']).default('INTACT'),
  dangerSigns: z.string().optional()
});

const recordDeliverySchema = z.object({
  laborCaseId: z.string().uuid(),
  deliveryMode: z.enum(['NORMAL_VAGINAL', 'LSCS_EMERGENCY', 'LSCS_ELECTIVE', 'ASSISTED_VACUUM', 'ASSISTED_FORCEPS']).default('NORMAL_VAGINAL'),
  deliveryIndication: z.string().optional(),
  estimatedBloodLossMl: z.number().default(200),
  child: z.object({
    gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
    birthWeightKg: z.number().min(0.5).max(6.0),
    headCircumferenceCm: z.number().optional().default(34.0),
    apgarScore1Min: z.number().min(0).max(10).default(8),
    apgarScore5Min: z.number().min(0).max(10).default(9),
    vitaminKGiven: z.boolean().default(true),
    bcgVaccineGiven: z.boolean().default(true),
    opv0Given: z.boolean().default(true),
    hepB0Given: z.boolean().default(true)
  })
});

/**
 * POST /api/v1/labor/admit (Admit Mother to Hospital Labor Suite)
 */
export const admitLaborCase = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, error: 'UNAUTHORIZED' });
      return;
    }

    const validation = admitLaborSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({ success: false, error: 'INVALID_INPUT', details: validation.error.flatten().fieldErrors });
      return;
    }

    const { motherId, pregnancyId, facilityId, laborRoomNumber, referralId } = validation.data;

    const laborCase = await prisma.laborCase.create({
      data: {
        motherId,
        pregnancyId,
        referralId: referralId || null,
        facilityId,
        laborRoomNumber,
        laborStatus: 'ADMITTED',
        assignedDoctorId: userId
      }
    });

    await prisma.laborTimeline.create({
      data: {
        laborCaseId: laborCase.id,
        status: 'ADMITTED',
        description: `Patient admitted to Labor Room ${laborRoomNumber} by ${req.user?.name}.`,
        actorName: req.user?.name || 'Doctor',
        actorRole: req.user?.role || 'DOCTOR'
      }
    });

    await prisma.motherProfile.update({
      where: { id: motherId },
      data: { caseStatus: 'ADMITTED_IN_LABOR' }
    });

    res.status(201).json({
      success: true,
      message: `Mother admitted to Labor Room ${laborRoomNumber}`,
      laborCase
    });
  } catch (error: any) {
    console.error('❌ Error in admitLaborCase:', error);
    res.status(500).json({ success: false, error: 'SERVER_ERROR' });
  }
};

/**
 * POST /api/v1/labor/partograph (Record WHO Partograph Observation)
 */
export const addPartographObservation = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, error: 'UNAUTHORIZED' });
      return;
    }

    const validation = partographSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({ success: false, error: 'INVALID_INPUT', details: validation.error.flatten().fieldErrors });
      return;
    }

    const data = validation.data;

    const observation = await prisma.partographObservation.create({
      data: {
        laborCaseId: data.laborCaseId,
        cervicalDilationCm: data.cervicalDilationCm,
        fetalHeartRateBpm: data.fetalHeartRateBpm,
        maternalPulseBpm: data.maternalPulseBpm,
        systolicBp: data.systolicBp,
        diastolicBp: data.diastolicBp,
        contractionsPer10Min: data.contractionsPer10Min,
        membraneStatus: data.membraneStatus,
        dangerSigns: data.dangerSigns || null,
        recordedByUserId: userId
      }
    });

    if (data.cervicalDilationCm >= 4.0) {
      await prisma.laborCase.update({
        where: { id: data.laborCaseId },
        data: { laborStatus: 'ACTIVE_LABOR' }
      });
    }

    res.status(201).json({
      success: true,
      message: 'WHO Partograph observation logged successfully',
      observation
    });
  } catch (error: any) {
    console.error('❌ Error in addPartographObservation:', error);
    res.status(500).json({ success: false, error: 'SERVER_ERROR' });
  }
};

/**
 * POST /api/v1/labor/deliveries (Log Delivery Outcome & Create Child RCH ID)
 */
export const recordDelivery = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, error: 'UNAUTHORIZED' });
      return;
    }

    const validation = recordDeliverySchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({ success: false, error: 'INVALID_INPUT', details: validation.error.flatten().fieldErrors });
      return;
    }

    const { laborCaseId, deliveryMode, deliveryIndication, estimatedBloodLossMl, child } = validation.data;

    const laborCase = await prisma.laborCase.findUnique({
      where: { id: laborCaseId },
      include: { mother: true, pregnancy: true }
    });

    if (!laborCase) {
      res.status(404).json({ success: false, error: 'LABOR_CASE_NOT_FOUND' });
      return;
    }

    const deliveryRecord = await prisma.deliveryRecord.create({
      data: {
        laborCaseId,
        motherId: laborCase.motherId,
        pregnancyId: laborCase.pregnancyId,
        facilityId: laborCase.facilityId,
        deliveryMode,
        deliveryIndication: deliveryIndication || null,
        estimatedBloodLossMl,
        pphRiskDetected: estimatedBloodLossMl > 500,
        amtslAdministered: true,
        placentaComplete: true,
        deliveredByUserId: userId
      }
    });

    const existingChildCount = await prisma.childProfile.count({ where: { motherId: laborCase.motherId } });
    const childRchId = `${laborCase.mother.rchId}-C${existingChildCount + 1}`;

    const childProfile = await prisma.childProfile.create({
      data: {
        childRchId,
        motherId: laborCase.motherId,
        deliveryRecordId: deliveryRecord.id,
        fullName: `Baby ${child.gender === 'FEMALE' ? 'Girl' : 'Boy'} of ${laborCase.mother.fullName}`,
        gender: child.gender,
        birthWeightKg: child.birthWeightKg,
        headCircumferenceCm: child.headCircumferenceCm,
        apgarScore1Min: child.apgarScore1Min,
        apgarScore5Min: child.apgarScore5Min,
        newbornRiskCategory: child.birthWeightKg < 2.5 ? 'LOW_BIRTH_WEIGHT' : 'HEALTHY',
        vitaminKGiven: child.vitaminKGiven,
        bcgVaccineGiven: child.bcgVaccineGiven,
        opv0Given: child.opv0Given,
        hepB0Given: child.hepB0Given
      }
    });

    // Schedule 6 HBNC Postnatal Visits for ASHA
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;
    await prisma.hbncSchedule.createMany({
      data: [
        { laborCaseId, motherId: laborCase.motherId, visitNumber: 1, scheduledDate: new Date(now + 1 * dayMs) },
        { laborCaseId, motherId: laborCase.motherId, visitNumber: 2, scheduledDate: new Date(now + 3 * dayMs) },
        { laborCaseId, motherId: laborCase.motherId, visitNumber: 3, scheduledDate: new Date(now + 7 * dayMs) },
        { laborCaseId, motherId: laborCase.motherId, visitNumber: 4, scheduledDate: new Date(now + 14 * dayMs) },
        { laborCaseId, motherId: laborCase.motherId, visitNumber: 5, scheduledDate: new Date(now + 21 * dayMs) },
        { laborCaseId, motherId: laborCase.motherId, visitNumber: 6, scheduledDate: new Date(now + 42 * dayMs) }
      ]
    });

    // Update Case Statuses
    await prisma.motherProfile.update({
      where: { id: laborCase.motherId },
      data: { caseStatus: 'DELIVERED_POSTNATAL', status: 'DELIVERED' }
    });

    await prisma.pregnancyRecord.update({
      where: { id: laborCase.pregnancyId },
      data: { status: 'DELIVERED' }
    });

    await prisma.laborCase.update({
      where: { id: laborCaseId },
      data: { laborStatus: 'POSTPARTUM_OBSERVATION' }
    });

    await prisma.laborTimeline.createMany({
      data: [
        {
          laborCaseId,
          status: 'DELIVERED',
          description: `Healthy ${child.gender} (Weight: ${child.birthWeightKg} kg) delivered via ${deliveryMode}. Child RCH ID ${childRchId} assigned. APGAR ${child.apgarScore1Min}/${child.apgarScore5Min}.`,
          actorName: req.user?.name || 'Doctor',
          actorRole: req.user?.role || 'DOCTOR'
        },
        {
          laborCaseId,
          status: 'POSTPARTUM_OBSERVATION',
          description: 'BCG, OPV-0, HepB-0 vaccines administered. 6 HBNC visits scheduled for ASHA.',
          actorName: 'Staff Nurse',
          actorRole: 'STAFF_NURSE'
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: `Delivery logged successfully. Child RCH ID ${childRchId} generated. 6 HBNC visits scheduled.`,
      deliveryRecord,
      childProfile
    });
  } catch (error: any) {
    console.error('❌ Error in recordDelivery:', error);
    res.status(500).json({ success: false, error: 'SERVER_ERROR' });
  }
};

/**
 * GET /api/v1/labor/dashboard/:facilityId (Labor Room Occupancy & Dashboard)
 */
export const getLaborRoomDashboard = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { facilityId } = req.params;

    const activeLaborCases = await prisma.laborCase.findMany({
      where: {
        facilityId,
        laborStatus: { in: ['ADMITTED', 'ACTIVE_LABOR', 'DELIVERY_IN_PROGRESS', 'POSTPARTUM_OBSERVATION'] }
      },
      include: {
        mother: {
          select: {
            id: true,
            fullName: true,
            rchId: true,
            age: true,
            phone: true,
            registeredByUser: { select: { id: true, name: true, phone: true, staffId: true } },
            village: { select: { nameEn: true } }
          }
        },
        partographEntries: { orderBy: { observationDateTime: 'desc' }, take: 5 },
        deliveryRecord: { include: { childProfiles: true } },
        timelineEvents: { orderBy: { createdAt: 'desc' } }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({
      success: true,
      activeLaborCasesCount: activeLaborCases.length,
      activeLaborCases
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'SERVER_ERROR' });
  }
};
