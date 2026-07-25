import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import {
  districtQuerySchema,
  talukQuerySchema,
  hobliQuerySchema,
  villageQuerySchema,
  facilityQuerySchema,
  subCenterQuerySchema,
  catchmentQuerySchema
} from '../validators/masterDataValidator';

/**
 * GET /api/v1/master/districts
 * Fetches all districts under a state (defaults to Karnataka)
 */
export const getDistricts = async (req: Request, res: Response): Promise<void> => {
  try {
    const validation = districtQuerySchema.safeParse(req.query);
    if (!validation.success) {
      res.status(400).json({
        success: false,
        error: 'INVALID_QUERY_PARAMS',
        details: validation.error.flatten().fieldErrors
      });
      return;
    }

    const { stateId } = validation.data;
    const whereClause = stateId ? { stateId } : {};

    const districts = await prisma.district.findMany({
      where: whereClause,
      select: {
        id: true,
        code: true,
        nameEn: true,
        nameKn: true,
        stateId: true
      },
      orderBy: { nameEn: 'asc' }
    });

    res.status(200).json({
      success: true,
      count: districts.length,
      data: districts
    });
  } catch (error: any) {
    console.error('❌ Error in getDistricts:', error);
    res.status(500).json({
      success: false,
      error: 'SERVER_ERROR',
      message: error.message || 'Failed to fetch districts'
    });
  }
};

/**
 * GET /api/v1/master/taluks?districtId={districtId}
 * Fetches all taluks under a specified district
 */
export const getTaluks = async (req: Request, res: Response): Promise<void> => {
  try {
    const validation = talukQuerySchema.safeParse(req.query);
    if (!validation.success) {
      res.status(400).json({
        success: false,
        error: 'INVALID_QUERY_PARAMS',
        details: validation.error.flatten().fieldErrors
      });
      return;
    }

    const { districtId } = validation.data;

    const taluks = await prisma.taluk.findMany({
      where: { districtId },
      select: {
        id: true,
        code: true,
        nameEn: true,
        nameKn: true,
        districtId: true
      },
      orderBy: { nameEn: 'asc' }
    });

    res.status(200).json({
      success: true,
      districtId,
      count: taluks.length,
      data: taluks
    });
  } catch (error: any) {
    console.error('❌ Error in getTaluks:', error);
    res.status(500).json({
      success: false,
      error: 'SERVER_ERROR',
      message: error.message || 'Failed to fetch taluks'
    });
  }
};

/**
 * GET /api/v1/master/hoblis?talukId={talukId}
 * Fetches all hoblis under a specified taluk
 */
export const getHoblis = async (req: Request, res: Response): Promise<void> => {
  try {
    const validation = hobliQuerySchema.safeParse(req.query);
    if (!validation.success) {
      res.status(400).json({
        success: false,
        error: 'INVALID_QUERY_PARAMS',
        details: validation.error.flatten().fieldErrors
      });
      return;
    }

    const { talukId } = validation.data;

    const hoblis = await prisma.hobli.findMany({
      where: { talukId },
      select: {
        id: true,
        code: true,
        nameEn: true,
        nameKn: true,
        talukId: true
      },
      orderBy: { nameEn: 'asc' }
    });

    res.status(200).json({
      success: true,
      talukId,
      count: hoblis.length,
      data: hoblis
    });
  } catch (error: any) {
    console.error('❌ Error in getHoblis:', error);
    res.status(500).json({
      success: false,
      error: 'SERVER_ERROR',
      message: error.message || 'Failed to fetch hoblis'
    });
  }
};

/**
 * GET /api/v1/master/villages?hobliId={hobliId}
 * Fetches all villages under a specified hobli
 */
export const getVillages = async (req: Request, res: Response): Promise<void> => {
  try {
    const validation = villageQuerySchema.safeParse(req.query);
    if (!validation.success) {
      res.status(400).json({
        success: false,
        error: 'INVALID_QUERY_PARAMS',
        details: validation.error.flatten().fieldErrors
      });
      return;
    }

    const { hobliId } = validation.data;

    const villages = await prisma.village.findMany({
      where: { hobliId },
      select: {
        id: true,
        code: true,
        nameEn: true,
        nameKn: true,
        pincode: true,
        hobliId: true
      },
      orderBy: { nameEn: 'asc' }
    });

    res.status(200).json({
      success: true,
      hobliId,
      count: villages.length,
      data: villages
    });
  } catch (error: any) {
    console.error('❌ Error in getVillages:', error);
    res.status(500).json({
      success: false,
      error: 'SERVER_ERROR',
      message: error.message || 'Failed to fetch villages'
    });
  }
};

/**
 * GET /api/v1/master/facilities?talukId={talukId}&tier={PHC|CHC|DISTRICT_HOSPITAL|...}
 * Fetches health facilities under a taluk
 */
export const getFacilities = async (req: Request, res: Response): Promise<void> => {
  try {
    const validation = facilityQuerySchema.safeParse(req.query);
    if (!validation.success) {
      res.status(400).json({
        success: false,
        error: 'INVALID_QUERY_PARAMS',
        details: validation.error.flatten().fieldErrors
      });
      return;
    }

    const { talukId, tier } = validation.data;
    const whereClause: any = { talukId };
    if (tier) {
      whereClause.tier = tier;
    }

    const facilities = await prisma.healthFacility.findMany({
      where: whereClause,
      select: {
        id: true,
        code: true,
        nameEn: true,
        nameKn: true,
        tier: true,
        latitude: true,
        longitude: true,
        emergencyPhone: true,
        talukId: true
      },
      orderBy: { nameEn: 'asc' }
    });

    res.status(200).json({
      success: true,
      talukId,
      tier: tier || 'ALL',
      count: facilities.length,
      data: facilities
    });
  } catch (error: any) {
    console.error('❌ Error in getFacilities:', error);
    res.status(500).json({
      success: false,
      error: 'SERVER_ERROR',
      message: error.message || 'Failed to fetch health facilities'
    });
  }
};

/**
 * GET /api/v1/master/sub-centers?facilityId={facilityId}
 * Fetches sub-centers under a health facility (PHC)
 */
export const getSubCenters = async (req: Request, res: Response): Promise<void> => {
  try {
    const validation = subCenterQuerySchema.safeParse(req.query);
    if (!validation.success) {
      res.status(400).json({
        success: false,
        error: 'INVALID_QUERY_PARAMS',
        details: validation.error.flatten().fieldErrors
      });
      return;
    }

    const { facilityId } = validation.data;

    const subCenters = await prisma.subCenter.findMany({
      where: { facilityId },
      select: {
        id: true,
        code: true,
        nameEn: true,
        nameKn: true,
        facilityId: true
      },
      orderBy: { nameEn: 'asc' }
    });

    res.status(200).json({
      success: true,
      facilityId,
      count: subCenters.length,
      data: subCenters
    });
  } catch (error: any) {
    console.error('❌ Error in getSubCenters:', error);
    res.status(500).json({
      success: false,
      error: 'SERVER_ERROR',
      message: error.message || 'Failed to fetch sub-centers'
    });
  }
};

/**
 * GET /api/v1/master/catchments?subCenterId={subCenterId}
 * Fetches ASHA catchments under a sub-center
 */
export const getCatchments = async (req: Request, res: Response): Promise<void> => {
  try {
    const validation = catchmentQuerySchema.safeParse(req.query);
    if (!validation.success) {
      res.status(400).json({
        success: false,
        error: 'INVALID_QUERY_PARAMS',
        details: validation.error.flatten().fieldErrors
      });
      return;
    }

    const { subCenterId } = validation.data;

    const catchments = await prisma.ashaCatchment.findMany({
      where: { subCenterId },
      select: {
        id: true,
        code: true,
        name: true,
        population: true,
        subCenterId: true,
        villageId: true
      },
      orderBy: { name: 'asc' }
    });

    res.status(200).json({
      success: true,
      subCenterId,
      count: catchments.length,
      data: catchments
    });
  } catch (error: any) {
    console.error('❌ Error in getCatchments:', error);
    res.status(500).json({
      success: false,
      error: 'SERVER_ERROR',
      message: error.message || 'Failed to fetch ASHA catchments'
    });
  }
};
