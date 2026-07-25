import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { AuthenticatedRequest } from '../middleware/rbac';
import { z } from 'zod';

const initiateReferralSchema = z.object({
  motherId: z.string().uuid(),
  destinationFacilityId: z.string().uuid(),
  clinicalReason: z.string().min(5, 'Clinical reason required'),
  priority: z.enum(['ROUTINE', 'URGENT', 'EMERGENCY', 'LIFE_THREATENING']).default('EMERGENCY')
});

const acceptReferralSchema = z.object({
  referralId: z.string().uuid(),
  action: z.enum(['ACCEPT', 'REJECT']),
  rejectionReason: z.string().optional()
});

const telemetrySchema = z.object({
  referralId: z.string().uuid(),
  currentLat: z.number(),
  currentLng: z.number(),
  etaMinutes: z.number().min(0),
  status: z.enum(['EN_ROUTE', 'IN_TRANSIT', 'ARRIVED']).default('IN_TRANSIT')
});

/**
 * POST /api/v1/referrals/initiate (Doctor Initiates Referral Case)
 */
export const initiateReferral = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const originFacilityId = req.user?.facilityId || 'fac-phc-byd';

    if (!userId) {
      res.status(401).json({ success: false, error: 'UNAUTHORIZED' });
      return;
    }

    const validation = initiateReferralSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({ success: false, error: 'INVALID_INPUT', details: validation.error.flatten().fieldErrors });
      return;
    }

    const { motherId, destinationFacilityId, clinicalReason, priority } = validation.data;
    const referralCode = `REF-HAV-${Math.floor(1000 + Math.random() * 9000)}`;

    const referral = await prisma.referralCase.create({
      data: {
        referralCode,
        motherId,
        originFacilityId,
        destinationFacilityId,
        status: 'CREATED',
        priority,
        clinicalReason,
        createdByUserId: userId
      }
    });

    await prisma.referralTimeline.create({
      data: {
        referralCaseId: referral.id,
        status: 'CREATED',
        description: `Referral case ${referralCode} created by ${req.user?.name}. Clinical reason: ${clinicalReason}`,
        actorName: req.user?.name || 'Medical Doctor',
        actorRole: req.user?.role || 'DOCTOR'
      }
    });

    await prisma.auditLog.create({
      data: {
        userId,
        actionType: 'REFERRAL_INITIATED',
        resource: 'REFERRALS',
        newValue: JSON.stringify({ referralCode, motherId }),
        ipAddress: req.ip
      }
    });

    res.status(201).json({
      success: true,
      message: 'Emergency referral case initiated successfully',
      referral
    });
  } catch (error: any) {
    console.error('❌ Error in initiateReferral:', error);
    res.status(500).json({ success: false, error: 'SERVER_ERROR' });
  }
};

/**
 * POST /api/v1/referrals/accept (Receiving Hospital ER Accepts & Locks Bed / Blood)
 */
export const acceptReferral = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, error: 'UNAUTHORIZED' });
      return;
    }

    const validation = acceptReferralSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({ success: false, error: 'INVALID_INPUT', details: validation.error.flatten().fieldErrors });
      return;
    }

    const { referralId, action, rejectionReason } = validation.data;

    const referral = await prisma.referralCase.findUnique({
      where: { id: referralId },
      include: { mother: true }
    });

    if (!referral) {
      res.status(404).json({ success: false, error: 'REFERRAL_NOT_FOUND' });
      return;
    }

    if (action === 'REJECT') {
      const updated = await prisma.referralCase.update({
        where: { id: referralId },
        data: {
          status: 'CANCELLED',
          rejectionReason: rejectionReason || 'Capacity full'
        }
      });

      await prisma.referralTimeline.create({
        data: {
          referralCaseId: referralId,
          status: 'CANCELLED',
          description: `Referral rejected by receiving hospital. Reason: ${rejectionReason}`,
          actorName: req.user?.name || 'Hospital Admin',
          actorRole: req.user?.role || 'HOSPITAL_ADMIN'
        }
      });

      res.status(200).json({ success: true, message: 'Referral rejected', referral: updated });
      return;
    }

    // On ACCEPT: Lock HDU Bed, Reserve Blood, Assign 108 Ambulance Unit
    const hduBed = await prisma.hospitalBed.findFirst({
      where: { facilityId: referral.destinationFacilityId, bedType: 'HDU' }
    });

    if (hduBed) {
      await prisma.hospitalBed.update({
        where: { id: hduBed.id },
        data: { status: 'RESERVED', reservedUntil: new Date(Date.now() + 2 * 60 * 60 * 1000) }
      });
    }

    const bloodStock = await prisma.bloodBankStock.findFirst({
      where: { facilityId: referral.destinationFacilityId }
    });

    if (bloodStock) {
      await prisma.bloodBankStock.update({
        where: { id: bloodStock.id },
        data: { reservedUnits: { increment: 1 } }
      });
    }

    const ambulance = await prisma.ambulanceUnit.findFirst({
      where: { vehicleNumber: 'KA-27-F-1080' }
    });

    if (ambulance) {
      await prisma.ambulanceUnit.update({
        where: { id: ambulance.id },
        data: { status: 'ASSIGNED' }
      });
    }

    const updatedReferral = await prisma.referralCase.update({
      where: { id: referralId },
      data: {
        status: 'AMBULANCE_ASSIGNED',
        acceptedByUserId: userId,
        reservedBedId: hduBed?.id || null,
        reservedBloodUnitId: bloodStock?.id || null,
        ambulanceUnitId: ambulance?.id || null,
        familySmsSent: true
      }
    });

    // Update Mother Case Status
    await prisma.motherProfile.update({
      where: { id: referral.motherId },
      data: { caseStatus: 'REFERRAL_DISPATCHED' }
    });

    // Append Timeline Events
    await prisma.referralTimeline.createMany({
      data: [
        {
          referralCaseId: referralId,
          status: 'ACCEPTED',
          description: `Referral accepted by ${req.user?.name} at Haveri District Hospital.`,
          actorName: req.user?.name || 'Hospital Admin',
          actorRole: req.user?.role || 'HOSPITAL_ADMIN'
        },
        {
          referralCaseId: referralId,
          status: 'BED_RESERVED',
          description: `HDU Bed ${hduBed?.bedNumber || 'HDU-04'} locked for 2 hours. O-ve Blood Reserved.`,
          actorName: req.user?.name || 'Hospital Admin',
          actorRole: req.user?.role || 'HOSPITAL_ADMIN'
        },
        {
          referralCaseId: referralId,
          status: 'AMBULANCE_ASSIGNED',
          description: `108 Ambulance KA-27-F-1080 (Driver Ramesh) assigned. Kannada tracking SMS dispatched to family.`,
          actorName: 'System Control Room',
          actorRole: 'SUPER_ADMIN'
        }
      ]
    });

    res.status(200).json({
      success: true,
      message: 'Referral accepted, HDU Bed locked, and 108 Ambulance dispatched',
      referral: updatedReferral
    });
  } catch (error: any) {
    console.error('❌ Error in acceptReferral:', error);
    res.status(500).json({ success: false, error: 'SERVER_ERROR' });
  }
};

/**
 * POST /api/v1/referrals/telemetry (108 Driver Telemetry Stream)
 */
export const updateAmbulanceTelemetry = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const validation = telemetrySchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({ success: false, error: 'INVALID_INPUT', details: validation.error.flatten().fieldErrors });
      return;
    }

    const { referralId, currentLat, currentLng, etaMinutes, status } = validation.data;

    const referral = await prisma.referralCase.update({
      where: { id: referralId },
      data: {
        currentLat,
        currentLng,
        etaMinutes,
        status: status === 'ARRIVED' ? 'ARRIVED' : 'IN_TRANSIT'
      }
    });

    if (referral.ambulanceUnitId) {
      await prisma.ambulanceUnit.update({
        where: { id: referral.ambulanceUnitId },
        data: { currentLat, currentLng, status: status === 'ARRIVED' ? 'REACHED_HOSPITAL' : 'TRANSPORTING' }
      });
    }

    res.status(200).json({
      success: true,
      message: 'Ambulance telemetry updated successfully',
      referral
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'SERVER_ERROR' });
  }
};

/**
 * POST /api/v1/referrals/casualty-handover (Admission Confirmed in Hospital Bed)
 */
export const casualtyHandover = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { referralId } = req.body;

    const referral = await prisma.referralCase.update({
      where: { id: referralId },
      data: { status: 'ADMITTED' }
    });

    if (referral.reservedBedId) {
      await prisma.hospitalBed.update({
        where: { id: referral.reservedBedId },
        data: { status: 'OCCUPIED' }
      });
    }

    await prisma.motherProfile.update({
      where: { id: referral.motherId },
      data: { caseStatus: 'ADMITTED_IN_HOSPITAL' }
    });

    await prisma.referralTimeline.create({
      data: {
        referralCaseId: referralId,
        status: 'ADMITTED',
        description: `Patient admitted to HDU Bed #04 at Haveri District Hospital ER.`,
        actorName: req.user?.name || 'Casualty ER Doctor',
        actorRole: req.user?.role || 'DOCTOR'
      }
    });

    res.status(200).json({
      success: true,
      message: 'Patient casualty handover complete & admitted to HDU Bed',
      referral
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'SERVER_ERROR' });
  }
};

/**
 * GET /api/v1/referrals/casualty-radar/:facilityId (Hospital ER Radar View)
 */
export const getCasualtyRadar = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { facilityId } = req.params;

    const incomingTransfers = await prisma.referralCase.findMany({
      where: {
        destinationFacilityId: facilityId,
        status: { in: ['CREATED', 'ACCEPTED', 'AMBULANCE_ASSIGNED', 'IN_TRANSIT', 'ARRIVED'] }
      },
      include: {
        mother: { select: { fullName: true, phone: true, rchId: true, motherSafetyScore: true, currentRiskLevel: true } },
        originFacility: { select: { nameEn: true } },
        reservedBed: { select: { bedNumber: true, bedType: true } },
        ambulanceUnit: { select: { vehicleNumber: true, driverName: true, driverPhone: true } },
        timelineEvents: { orderBy: { createdAt: 'desc' } }
      },
      orderBy: { createdAt: 'desc' }
    });

    const beds = await prisma.hospitalBed.findMany({
      where: { facilityId }
    });

    res.status(200).json({
      success: true,
      incomingTransfers,
      bedGrid: beds
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'SERVER_ERROR' });
  }
};

/**
 * GET /api/v1/referrals/family-portal/:code (Public 1-Click Family Tracking)
 */
export const getFamilyPortal = async (req: Request, res: Response): Promise<void> => {
  try {
    const { code } = req.params;

    const referral = await prisma.referralCase.findFirst({
      where: {
        OR: [{ referralCode: code }, { id: code }]
      },
      include: {
        mother: { select: { fullName: true, phone: true, husbandName: true, rchId: true } },
        destinationFacility: { select: { nameEn: true, nameKn: true, emergencyPhone: true } },
        reservedBed: { select: { bedNumber: true, bedType: true } },
        ambulanceUnit: { select: { vehicleNumber: true, driverName: true, driverPhone: true } },
        timelineEvents: { orderBy: { createdAt: 'desc' } }
      }
    });

    if (!referral) {
      res.status(404).json({ success: false, error: 'REFERRAL_NOT_FOUND' });
      return;
    }

    res.status(200).json({
      success: true,
      referral,
      kannadaSmsPreview: `ಜನನಿ360 ತುರ್ತು ಮಾಹಿತಿ: ಲಕ್ಷ್ಮಿ ದೇವಿ ಅವರ ಉನ್ನತ ಚಿಕಿತ್ಸೆಗೆ ${referral.destinationFacility.nameKn} ಗೆ 108 ಆಂಬ್ಯುಲೆನ್ಸ್ (${referral.ambulanceUnit?.vehicleNumber || 'KA-27-F-1080'}) ಮೂಲಕ ವರ್ಗಾಯಿಸಲಾಗುತ್ತಿದೆ. HDU ಹಾಸಿಗೆ ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ.`
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'SERVER_ERROR' });
  }
};
