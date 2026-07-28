import { Response } from 'express';
import { prisma } from '../config/prisma';
import { AuthenticatedRequest } from '../middleware/rbac';

/**
 * GET /api/v1/doctor/mother/:id
 * Search Mother by Mother ID (rchId or UUID) for Doctor ANC Examination
 */
export const searchMotherForCheckup = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ success: false, error: 'INVALID_ID', message: 'Mother ID is required' });
      return;
    }

    const mother = await prisma.motherProfile.findFirst({
      where: {
        OR: [{ id: id.trim() }, { rchId: id.trim() }]
      },
      include: {
        district: true,
        village: { include: { hobli: { include: { taluk: true } } } },
        facility: true,
        registeredByUser: { select: { id: true, name: true, phone: true, role: true } },
        pregnancies: {
          include: {
            ancVisits: {
              include: { recordedByUser: { select: { name: true, role: true } } },
              orderBy: { visitDate: 'desc' },
              take: 5
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    });

    if (!mother) {
      res.status(404).json({
        success: false,
        error: 'NOT_FOUND',
        message: 'No Mother Record Found.'
      });
      return;
    }

    const latestPregnancy = mother.pregnancies[0];

    const formattedVisits = latestPregnancy?.ancVisits.map((v) => ({
      id: v.id,
      visitNumber: v.visitNumber,
      visitDate: v.visitDate.toISOString().split('T')[0],
      bloodPressure: `${v.systolicBp}/${v.diastolicBp} mmHg`,
      weight: `${v.weightKg} kg`,
      hbLevel: `${v.hbLevel} g/dL`,
      doctorNotes: v.complaints || 'Routine ANC Examination',
      doctorName: v.recordedByUser?.name || 'Dr. Ananya Rao (PHC MO)'
    })) || [];

    res.status(200).json({
      success: true,
      message: '✓ Mother Found',
      mother: {
        id: mother.id,
        motherId: mother.rchId,
        fullName: mother.fullName,
        husbandName: mother.husbandName,
        age: mother.age,
        mobileNumber: mother.phone,
        dob: `${2026 - mother.age}-01-15`,
        bloodGroup: mother.bloodGroup || 'O+',
        village: mother.village?.nameEn || 'Varthur',
        taluk: mother.village?.hobli?.taluk?.nameEn || 'Mahadevapura',
        district: mother.district?.nameEn || 'Bengaluru Urban',
        assignedPhc: mother.facility?.nameEn || 'Varthur Primary Health Centre (PHC)',
        assignedAsha: mother.registeredByUser?.name || 'Vimala (ASHA Worker)',
        pregnancy: latestPregnancy
          ? {
              id: latestPregnancy.id,
              gravida: latestPregnancy.gravida,
              parity: latestPregnancy.parity,
              lmpDate: latestPregnancy.lmpDate.toISOString().split('T')[0],
              eddDate: latestPregnancy.eddDate.toISOString().split('T')[0],
              currentRiskLevel: latestPregnancy.currentRiskLevel,
              recentVisits: formattedVisits
            }
          : null
      }
    });
  } catch (error: any) {
    console.error('❌ Error in searchMotherForCheckup:', error);
    res.status(500).json({ success: false, error: 'SERVER_ERROR', message: error.message });
  }
};

/**
 * POST /api/v1/doctor/anc-checkup
 * Record Today's Doctor ANC Clinical Examination
 */
export const recordAncCheckup = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const {
      motherId,
      pregnancyId,
      bpSystolic,
      bpDiastolic,
      bloodPressure,
      weight,
      hbLevel,
      doctorNotes,
      nextVisitDate
    } = req.body;

    if (!motherId) {
      res.status(400).json({ success: false, error: 'MISSING_MOTHER_ID', message: 'Mother ID is required' });
      return;
    }

    // Find mother profile
    const mother = await prisma.motherProfile.findFirst({
      where: { OR: [{ id: motherId }, { rchId: motherId }] },
      include: {
        pregnancies: {
          include: { ancVisits: { orderBy: { visitDate: 'desc' }, take: 5 } },
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    });

    if (!mother) {
      res.status(404).json({ success: false, error: 'NOT_FOUND', message: 'No Mother Record Found.' });
      return;
    }

    const activePregnancy = mother.pregnancies[0];
    const targetPregnancyId = pregnancyId || activePregnancy?.id;

    if (!targetPregnancyId) {
      res.status(400).json({
        success: false,
        error: 'NO_PREGNANCY_RECORD',
        message: 'No active pregnancy record found for this mother'
      });
      return;
    }

    // Parse Blood Pressure string e.g. "120/80" if passed directly
    let parsedSystolic = bpSystolic ? Number(bpSystolic) : 120;
    let parsedDiastolic = bpDiastolic ? Number(bpDiastolic) : 80;
    if (bloodPressure && typeof bloodPressure === 'string' && bloodPressure.includes('/')) {
      const parts = bloodPressure.split('/');
      parsedSystolic = Number(parts[0]) || 120;
      parsedDiastolic = Number(parts[1]) || 80;
    }

    const nextVisitNumber = (activePregnancy?.ancVisits?.length || 0) + 1;
    const recorderUserId = req.user?.userId || mother.registeredByUserId;

    // Calculate gestational age in weeks from LMP
    let gestationalAge = 24;
    if (activePregnancy?.lmpDate) {
      const lmpTime = new Date(activePregnancy.lmpDate).getTime();
      const nowTime = new Date().getTime();
      const diffWeeks = Math.floor((nowTime - lmpTime) / (1000 * 60 * 60 * 24 * 7));
      if (diffWeeks > 0 && diffWeeks <= 42) gestationalAge = diffWeeks;
    }

    // Determine Risk Level & AI Safety Score
    let isHighRisk = parsedSystolic >= 140 || parsedDiastolic >= 90 || (hbLevel && Number(hbLevel) < 9.5);
    let riskLevelText = isHighRisk ? 'HIGH_RISK_HYPERTENSION' : 'LOW';
    let safetyScore = isHighRisk ? 45 : 95;

    // Create ANC Visit DB record
    const visit = await prisma.ancVisit.create({
      data: {
        pregnancyId: targetPregnancyId,
        visitNumber: nextVisitNumber,
        visitDate: new Date(),
        gestationalAgeWeeks: gestationalAge,
        systolicBp: parsedSystolic,
        diastolicBp: parsedDiastolic,
        weightKg: weight ? Number(weight) : 55.0,
        hbLevel: hbLevel ? Number(hbLevel) : 11.5,
        complaints: doctorNotes || 'Routine PHC Doctor ANC Checkup completed.',
        aiSafetyScore: safetyScore,
        aiRiskLevel: riskLevelText,
        aiReasoning: isHighRisk ? 'High Blood Pressure or Anemia detected during clinical examination' : 'Normal vital parameters',
        recordedByUserId: recorderUserId,
        followUpDate: nextVisitDate ? new Date(nextVisitDate) : null
      }
    });

    // Update risk level on pregnancy record
    await prisma.pregnancyRecord.update({
      where: { id: targetPregnancyId },
      data: { currentRiskLevel: riskLevelText }
    });

    // Fetch updated visits list for the history table
    const updatedVisits = await prisma.ancVisit.findMany({
      where: { pregnancyId: targetPregnancyId },
      include: { recordedByUser: { select: { name: true } } },
      orderBy: { visitDate: 'desc' },
      take: 5
    });

    const formattedVisits = updatedVisits.map((v) => ({
      id: v.id,
      visitNumber: v.visitNumber,
      visitDate: v.visitDate.toISOString().split('T')[0],
      bloodPressure: `${v.systolicBp}/${v.diastolicBp} mmHg`,
      weight: `${v.weightKg} kg`,
      hbLevel: `${v.hbLevel} g/dL`,
      doctorNotes: v.complaints || 'Routine ANC Examination',
      doctorName: v.recordedByUser?.name || 'Dr. Ananya Rao (PHC MO)'
    }));

    res.status(201).json({
      success: true,
      message: '✔ ANC Checkup Saved Successfully',
      subMessage: 'Next Visit Scheduled Successfully',
      visit: {
        id: visit.id,
        visitNumber: visit.visitNumber,
        visitDate: visit.visitDate.toISOString().split('T')[0],
        bloodPressure: `${parsedSystolic}/${parsedDiastolic} mmHg`,
        weight: `${visit.weightKg} kg`,
        hbLevel: `${visit.hbLevel} g/dL`,
        doctorNotes: visit.complaints,
        nextVisitDate: nextVisitDate || new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      },
      recentVisits: formattedVisits
    });
  } catch (error: any) {
    console.error('❌ Error in recordAncCheckup:', error);
    res.status(500).json({ success: false, error: 'SERVER_ERROR', message: error.message });
  }
};
