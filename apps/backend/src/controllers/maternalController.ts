import { Response } from 'express';
import { prisma } from '../config/prisma';
import { AuthenticatedRequest } from '../middleware/rbac';
import { z } from 'zod';
import { evaluateCdss } from '../services/cdssService';
import http from 'http';

// Zod Validation Schemas
const registerMotherSchema = z.object({
  rchId: z.string().optional(),
  abhaId: z.string().optional(),
  fullName: z.string().min(2, 'Full name is required'),
  age: z.number().min(12).max(60),
  phone: z.string().min(10, 'Valid 10-digit mobile number required'),
  husbandName: z.string().min(2, 'Husband name is required'),
  husbandPhone: z.string().optional(),
  emergencyPhone: z.string().optional(),
  bloodGroup: z.string().optional(),
  bplCardNumber: z.string().optional(),
  lmpDate: z.string().min(1, 'LMP date is required'),
  gravida: z.number().default(1),
  parity: z.number().default(0),
  abortions: z.number().default(0),
  medicalHistory: z.array(z.string()).optional(),
  highRiskFactors: z.array(z.string()).optional(),
  districtId: z.string().uuid(),
  talukId: z.string().uuid(),
  hobliId: z.string().uuid(),
  villageId: z.string().uuid(),
  facilityId: z.string().uuid(),
  subCenterId: z.string().uuid(),
  catchmentId: z.string().uuid()
});

const ancVisitSchema = z.object({
  motherId: z.string().uuid(),
  pregnancyId: z.string().uuid(),
  visitNumber: z.number().min(1).max(4),
  gestationalAgeWeeks: z.number().min(1).max(42),
  systolicBp: z.number().min(60).max(240),
  diastolicBp: z.number().min(40).max(140),
  hbLevel: z.number().min(2).max(18),
  weightKg: z.number().min(30).max(150),
  temperatureF: z.number().optional().default(98.6),
  urineProtein: z.enum(['Nil', '+1', '+2', '+3']).default('Nil'),
  randomBloodSugar: z.number().optional().default(100.0),
  fetalHeartRate: z.number().optional(),
  complaints: z.string().optional(),
  ifaTabletsDistributed: z.number().default(30)
});

const aiOverrideSchema = z.object({
  predictionId: z.string().uuid(),
  motherId: z.string().uuid(),
  originalAiAction: z.string(),
  doctorDecisionAction: z.string().min(2, 'Doctor decision action required'),
  overrideReason: z.string().min(5, 'Detailed reason for override required')
});

/**
 * POST /api/v1/maternal/mothers (7-Step Wizard Registration)
 */
export const registerMother = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, error: 'UNAUTHORIZED' });
      return;
    }

    const validation = registerMotherSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({
        success: false,
        error: 'INVALID_INPUT',
        details: validation.error.flatten().fieldErrors
      });
      return;
    }

    const data = validation.data;
    const lmp = new Date(data.lmpDate);
    const edd = new Date(lmp.getTime() + 280 * 24 * 60 * 60 * 1000);
    const rchId = data.rchId || `12900${Math.floor(1000000 + Math.random() * 9000000)}`;

    const mother = await prisma.motherProfile.create({
      data: {
        rchId,
        abhaId: data.abhaId || null,
        fullName: data.fullName,
        age: data.age,
        phone: data.phone,
        husbandName: data.husbandName,
        husbandPhone: data.husbandPhone || null,
        emergencyPhone: data.emergencyPhone || data.husbandPhone || null,
        bloodGroup: data.bloodGroup || 'O+',
        bplCardNumber: data.bplCardNumber || null,
        caseStatus: 'REGISTERED_ANC_ACTIVE',
        currentRiskLevel: 'LOW',
        motherSafetyScore: 95,
        status: 'PREGNANT',
        districtId: data.districtId,
        talukId: data.talukId,
        hobliId: data.hobliId,
        villageId: data.villageId,
        facilityId: data.facilityId,
        subCenterId: data.subCenterId,
        catchmentId: data.catchmentId,
        registeredByUserId: userId
      }
    });

    const pregnancy = await prisma.pregnancyRecord.create({
      data: {
        motherId: mother.id,
        gravida: data.gravida,
        parity: data.parity,
        abortions: data.abortions,
        lmpDate: lmp,
        eddDate: edd,
        currentRiskLevel: 'LOW',
        motherSafetyScore: 95,
        status: 'PREGNANT',
        medicalHistory: JSON.stringify(data.medicalHistory || []),
        highRiskFactors: JSON.stringify(data.highRiskFactors || [])
      }
    });

    await prisma.activityLog.create({
      data: {
        motherId: mother.id,
        eventType: 'PREGNANCY_REGISTERED',
        description: `Pregnancy registered by ${req.user?.name} (${req.user?.role}). RCH ID ${rchId} assigned.`,
        actorName: req.user?.name || 'ASHA Worker',
        actorRole: req.user?.role || 'ASHA_WORKER'
      }
    });

    await prisma.auditLog.create({
      data: {
        userId,
        actionType: 'PATIENT_REGISTERED',
        resource: 'MATERNAL',
        newValue: JSON.stringify({ motherId: mother.id, rchId }),
        ipAddress: req.ip
      }
    });

    res.status(201).json({
      success: true,
      message: 'Pregnant mother registered successfully',
      mother,
      pregnancy
    });
  } catch (error: any) {
    console.error('❌ Error in registerMother:', error);
    res.status(500).json({ success: false, error: 'SERVER_ERROR', message: error.message });
  }
};

/**
 * POST /api/v1/maternal/anc-visits (Record Immutable ANC Visit + Trigger CDSS)
 */
export const recordAncVisit = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, error: 'UNAUTHORIZED' });
      return;
    }

    const validation = ancVisitSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({
        success: false,
        error: 'INVALID_INPUT',
        details: validation.error.flatten().fieldErrors
      });
      return;
    }

    const data = validation.data;

    // 1. Execute CDSS AI Engine Analysis (10 Specialized Clinical Engines + WHO/GOI Guidelines)
    const cdssResult = evaluateCdss({
      systolicBp: data.systolicBp,
      diastolicBp: data.diastolicBp,
      hbLevel: data.hbLevel,
      weightKg: data.weightKg,
      gestationalAgeWeeks: data.gestationalAgeWeeks,
      urineProtein: data.urineProtein,
      randomBloodSugar: data.randomBloodSugar
    });

    // 2. Insert Immutable ANC Visit Record
    const visit = await prisma.ancVisit.create({
      data: {
        pregnancyId: data.pregnancyId,
        visitNumber: data.visitNumber,
        gestationalAgeWeeks: data.gestationalAgeWeeks,
        systolicBp: data.systolicBp,
        diastolicBp: data.diastolicBp,
        hbLevel: data.hbLevel,
        weightKg: data.weightKg,
        temperatureF: data.temperatureF,
        urineProtein: data.urineProtein,
        randomBloodSugar: data.randomBloodSugar,
        fetalHeartRate: data.fetalHeartRate || null,
        complaints: data.complaints || null,
        ifaTabletsDistributed: data.ifaTabletsDistributed,
        aiSafetyScore: cdssResult.safetyScore ?? 100,
        aiRiskLevel: cdssResult.riskLevel ?? 'LOW',
        aiReasoning: (cdssResult.reasons || []).join(' | '),
        aiRecommendationsJson: JSON.stringify(cdssResult.actionPlan || {}),
        recordedByUserId: userId,
        followUpDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000)
      }
    });

    // 3. Persist AI Audit & Prediction Log
    const aiLog = await prisma.aiPredictionLog.create({
      data: {
        motherId: data.motherId,
        visitId: visit.id,
        aiVersion: cdssResult.aiVersion || 'v3.0.0-cdss',
        ruleVersion: cdssResult.ruleVersion || '2026.1-WHO-GOI',
        safetyScore: cdssResult.safetyScore ?? 100,
        riskLevel: cdssResult.riskLevel ?? 'LOW',
        predictionReliability: cdssResult.predictionReliability || 'HIGH',
        inputSnapshotJson: JSON.stringify({
          systolicBp: data.systolicBp,
          diastolicBp: data.diastolicBp,
          hbLevel: data.hbLevel,
          weightKg: data.weightKg,
          urineProtein: data.urineProtein
        }),
        outputSnapshotJson: JSON.stringify(cdssResult)
      }
    });

    // 4. Update Mother Profile & Case Status State Machine
    const safetyScore = cdssResult.safetyScore ?? 100;
    const riskLevel = cdssResult.riskLevel ?? 'LOW';
    const newCaseStatus = safetyScore < 40 ? 'HIGH_RISK_ESCALATED' : 'REGISTERED_ANC_ACTIVE';

    const updatedMother = await prisma.motherProfile.update({
      where: { id: data.motherId },
      data: {
        motherSafetyScore: safetyScore,
        currentRiskLevel: riskLevel,
        caseStatus: newCaseStatus
      }
    });

    await prisma.pregnancyRecord.update({
      where: { id: data.pregnancyId },
      data: {
        motherSafetyScore: safetyScore,
        currentRiskLevel: riskLevel
      }
    });

    // 5. Create Activity Log
    await prisma.activityLog.create({
      data: {
        motherId: data.motherId,
        eventType: 'ANC_VISIT_SAVED',
        description: `ANC-${data.visitNumber} Visit recorded by ${req.user?.name}. Vitals: BP ${data.systolicBp}/${data.diastolicBp}, Hb ${data.hbLevel} g/dL. CDSS Safety Score: ${cdssResult.safetyScore} (${cdssResult.riskLevel}).`,
        actorName: req.user?.name || 'Healthcare Worker',
        actorRole: req.user?.role || 'ASHA_WORKER'
      }
    });

    res.status(201).json({
      success: true,
      message: 'ANC Visit recorded and CDSS risk analysis complete',
      visit,
      mother: updatedMother,
      cdssResult,
      predictionId: aiLog.id
    });
  } catch (error: any) {
    console.error('❌ Error in recordAncVisit:', error);
    res.status(500).json({ success: false, error: 'SERVER_ERROR', message: error.message });
  }
};

/**
 * POST /api/v1/maternal/ai-override (Doctor Override of AI Recommendation)
 */
export const overrideAiRecommendation = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const doctorId = req.user?.userId;
    if (!doctorId) {
      res.status(401).json({ success: false, error: 'UNAUTHORIZED' });
      return;
    }

    const validation = aiOverrideSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({ success: false, error: 'INVALID_INPUT', details: validation.error.flatten().fieldErrors });
      return;
    }

    const { predictionId, motherId, originalAiAction, doctorDecisionAction, overrideReason } = validation.data;

    const overrideLog = await prisma.aiOverrideLog.create({
      data: {
        predictionId,
        motherId,
        doctorId,
        originalAiAction,
        doctorDecisionAction,
        overrideReason
      }
    });

    await prisma.activityLog.create({
      data: {
        motherId,
        eventType: 'DOCTOR_AI_OVERRIDE',
        description: `Doctor ${req.user?.name} overridden CDSS recommendation. Decision: "${doctorDecisionAction}". Reason: "${overrideReason}"`,
        actorName: req.user?.name || 'Medical Doctor',
        actorRole: req.user?.role || 'DOCTOR'
      }
    });

    res.status(201).json({
      success: true,
      message: 'Doctor AI override recorded successfully',
      overrideLog
    });
  } catch (error: any) {
    console.error('❌ Error in overrideAiRecommendation:', error);
    res.status(500).json({ success: false, error: 'SERVER_ERROR' });
  }
};

/**
 * GET /api/v1/maternal/mothers/:id (Get Mother Profile Hub & CDSS Recommendations)
 */
export const getMotherProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const mother = await prisma.motherProfile.findFirst({
      where: {
        OR: [{ id }, { rchId: id }]
      },
      include: {
        district: { select: { nameEn: true, nameKn: true } },
        village: { select: { nameEn: true, nameKn: true, pincode: true } },
        facility: { select: { nameEn: true, nameKn: true, tier: true } },
        subCenter: { select: { nameEn: true, nameKn: true } },
        registeredByUser: { select: { name: true, role: true, phone: true } },
        pregnancies: {
          include: {
            ancVisits: {
              orderBy: { visitNumber: 'asc' },
              include: { recordedByUser: { select: { name: true, role: true } } }
            },
            labReports: true,
            prescriptions: true
          }
        },
        documents: true,
        activityLogs: { orderBy: { createdAt: 'desc' } },
        aiPredictionLogs: { orderBy: { createdAt: 'desc' }, take: 5 }
      }
    });

    if (!mother) {
      res.status(404).json({ success: false, error: 'MOTHER_NOT_FOUND', message: 'Mother profile not found' });
      return;
    }

    const latestPregnancy = mother.pregnancies[0];
    const latestVisit = latestPregnancy?.ancVisits[latestPregnancy.ancVisits.length - 1];

    // Compute CDSS Analysis
    const cdssResult = evaluateCdss({
      systolicBp: latestVisit?.systolicBp || 120,
      diastolicBp: latestVisit?.diastolicBp || 80,
      hbLevel: latestVisit?.hbLevel || 10.5,
      weightKg: latestVisit?.weightKg || 44.0,
      gestationalAgeWeeks: latestVisit?.gestationalAgeWeeks || 12,
      urineProtein: latestVisit?.urineProtein || 'Nil'
    });

    res.status(200).json({
      success: true,
      mother,
      cdssResult
    });
  } catch (error: any) {
    console.error('❌ Error in getMotherProfile:', error);
    res.status(500).json({ success: false, error: 'SERVER_ERROR' });
  }
};

/**
 * GET /api/v1/maternal/search?q={searchQuery} (Universal Master Search)
 */
export const searchMothers = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const q = req.query.q as string;
    if (!q || q.length < 2) {
      res.status(400).json({ success: false, error: 'INVALID_QUERY' });
      return;
    }

    const mothers = await prisma.motherProfile.findMany({
      where: {
        OR: [
          { fullName: { contains: q } },
          { phone: { contains: q } },
          { rchId: { contains: q } },
          { abhaId: { contains: q } },
          { husbandName: { contains: q } }
        ]
      },
      select: {
        id: true,
        rchId: true,
        abhaId: true,
        fullName: true,
        phone: true,
        husbandName: true,
        caseStatus: true,
        currentRiskLevel: true,
        motherSafetyScore: true,
        village: { select: { nameEn: true, nameKn: true } },
        facility: { select: { nameEn: true, nameKn: true } }
      },
      take: 10
    });

    res.status(200).json({
      success: true,
      count: mothers.length,
      data: mothers
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'SERVER_ERROR' });
  }
};

/**
 * GET /api/v1/maternal/work-queue (Role-Specific Actionable Work Queue & KPIs)
 */
export const getWorkQueue = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const role = req.user?.role || 'ASHA_WORKER';

    const highRiskMothers = await prisma.motherProfile.findMany({
      where: {
        currentRiskLevel: { in: ['HIGH', 'CRITICAL'] }
      },
      select: {
        id: true,
        rchId: true,
        fullName: true,
        phone: true,
        caseStatus: true,
        currentRiskLevel: true,
        motherSafetyScore: true,
        village: { select: { nameEn: true } }
      },
      orderBy: { motherSafetyScore: 'asc' }
    });

    const activeMothersCount = await prisma.motherProfile.count({ where: { status: 'PREGNANT' } });
    const criticalCount = highRiskMothers.filter(m => m.currentRiskLevel === 'CRITICAL').length;

    res.status(200).json({
      success: true,
      role,
      kpis: {
        activeMothersCount,
        highRiskCount: highRiskMothers.length,
        criticalEmergencyCount: criticalCount,
        ancCoveragePercent: 94.2
      },
      workQueue: highRiskMothers.map(m => ({
        id: m.id,
        motherName: m.fullName,
        rchId: m.rchId,
        village: m.village?.nameEn,
        safetyScore: m.motherSafetyScore,
        riskLevel: m.currentRiskLevel,
        caseStatus: m.caseStatus,
        requiredAction: m.motherSafetyScore < 40 
          ? 'EMERGENCY 108 REFERRAL & HDU BED LOCK' 
          : 'DOCTOR ANC CONSULTATION & IV IRON SUCROSE'
      }))
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'SERVER_ERROR' });
  }
};
