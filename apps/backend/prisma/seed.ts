import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Master Data, Auth RBAC, CDSS, Referral, Labor Room & Child Health Seeding...');

  // Clean existing tables in reverse dependency order
  await prisma.childGrowthRecord.deleteMany();
  await prisma.childImmunizationRecord.deleteMany();
  await prisma.pncVisit.deleteMany();
  await prisma.laborTimeline.deleteMany();
  await prisma.hbncSchedule.deleteMany();
  await prisma.childProfile.deleteMany();
  await prisma.deliveryRecord.deleteMany();
  await prisma.partographObservation.deleteMany();
  await prisma.laborCase.deleteMany();
  await prisma.referralTimeline.deleteMany();
  await prisma.referralCase.deleteMany();
  await prisma.ambulanceUnit.deleteMany();
  await prisma.bloodBankStock.deleteMany();
  await prisma.hospitalBed.deleteMany();
  await prisma.aiOverrideLog.deleteMany();
  await prisma.aiPredictionLog.deleteMany();
  await prisma.activityLog.deleteMany();
  await prisma.motherDocument.deleteMany();
  await prisma.medicationPrescription.deleteMany();
  await prisma.labReport.deleteMany();
  await prisma.ancVisit.deleteMany();
  await prisma.pregnancyRecord.deleteMany();
  await prisma.motherProfile.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.passwordReset.deleteMany();
  await prisma.userSession.deleteMany();
  await prisma.user.deleteMany();
  await prisma.ashaCatchment.deleteMany();
  await prisma.subCenter.deleteMany();
  await prisma.healthFacility.deleteMany();
  await prisma.village.deleteMany();
  await prisma.hobli.deleteMany();
  await prisma.taluk.deleteMany();
  await prisma.district.deleteMany();
  await prisma.state.deleteMany();

  // 1. State
  const karnataka = await prisma.state.create({
    data: { code: 'KA', nameEn: 'Karnataka', nameKn: 'ಕರ್ನಾಟಕ' }
  });

  // 2. Districts
  const haveri = await prisma.district.create({
    data: { stateId: karnataka.id, code: 'DIST-HAV', nameEn: 'Haveri', nameKn: 'ಹಾವೇರಿ' }
  });

  await prisma.district.createMany({
    data: [
      { stateId: karnataka.id, code: 'DIST-MYS', nameEn: 'Mysuru', nameKn: 'ಮೈಸೂರು' },
      { stateId: karnataka.id, code: 'DIST-BEL', nameEn: 'Belagavi', nameKn: 'ಬೆಳಗಾವಿ' },
      { stateId: karnataka.id, code: 'DIST-BLR', nameEn: 'Bengaluru Urban', nameKn: 'ಬೆಂಗಳೂರು ನಗರ' },
      { stateId: karnataka.id, code: 'DIST-KLB', nameEn: 'Kalaburagi', nameKn: 'ಕಲಬುರಗಿ' }
    ]
  });

  // 3. Taluks in Haveri
  const byadgiTaluk = await prisma.taluk.create({
    data: { districtId: haveri.id, code: 'TAL-BYD', nameEn: 'Byadgi', nameKn: 'ಬ್ಯಾಡಗಿ' }
  });

  const haveriTaluk = await prisma.taluk.create({
    data: { districtId: haveri.id, code: 'TAL-HVR', nameEn: 'Haveri', nameKn: 'ಹಾವೇರಿ' }
  });

  // 4. Hoblis & Villages
  const kagineleHobli = await prisma.hobli.create({
    data: { talukId: byadgiTaluk.id, code: 'HOB-KAG', nameEn: 'Kaginele Hobli', nameKn: 'ಕಾಜಿನೆಲೆ ಹೊಬ್ಳಿ' }
  });

  const kagineleVillage = await prisma.village.create({
    data: { hobliId: kagineleHobli.id, code: 'VIL-KAG-01', nameEn: 'Kaginele Village', nameKn: 'ಕಾಜಿನೆಲೆ ಗ್ರಾಮ', pincode: '581106' }
  });

  // 5. Health Facilities
  const byadgiPhc = await prisma.healthFacility.create({
    data: {
      talukId: byadgiTaluk.id,
      code: 'FAC-PHC-BYD',
      nameEn: 'Byadgi Primary Health Center',
      nameKn: 'ಬ್ಯಾಡಗಿ ಪ್ರಾಥಮಿಕ ಆರೋಗ್ಯ ಕೇಂದ್ರ',
      tier: 'PHC',
      latitude: 14.6784,
      longitude: 75.4851,
      emergencyPhone: '+918375222108'
    }
  });

  const haveriDh = await prisma.healthFacility.create({
    data: {
      talukId: haveriTaluk.id,
      code: 'FAC-DH-HAV',
      nameEn: 'Haveri District Hospital',
      nameKn: 'ಹಾವೇರಿ ಜಿಲ್ಲಾ ಆಸ್ಪತ್ರೆ',
      tier: 'DISTRICT_HOSPITAL',
      latitude: 14.7951,
      longitude: 75.3994,
      emergencyPhone: '+918375222999'
    }
  });

  // 6. Sub-Centers & Catchment
  const kagineleSc1 = await prisma.subCenter.create({
    data: { facilityId: byadgiPhc.id, code: 'SC-KAG-01', nameEn: 'Kaginele Sub-Center 1', nameKn: 'ಕಾಜಿನೆಲೆ ಉಪಕೇಂದ್ರ ೧' }
  });

  const catchment1 = await prisma.ashaCatchment.create({
    data: { subCenterId: kagineleSc1.id, villageId: kagineleVillage.id, code: 'CAT-KAG-01', name: 'Kaginele Ward 1-4 Catchment', population: 1050 }
  });

  // 7. Users
  const hashPassword = (pw: string) => bcrypt.hashSync(pw, 10);

  const ashaUser = await prisma.user.create({
    data: {
      name: 'Smt. Manjula Gowda',
      email: 'asha.manjula@karnataka.gov.in',
      phone: '+919845077881',
      passwordHash: hashPassword('Asha@12345'),
      staffId: 'KA-ASHA-581106',
      role: 'ASHA_WORKER',
      districtId: haveri.id,
      talukId: byadgiTaluk.id,
      facilityId: byadgiPhc.id,
      subCenterId: kagineleSc1.id,
      catchmentId: catchment1.id
    }
  });

  await prisma.user.create({
    data: {
      name: 'Smt. Sanveeka Gowda',
      email: 'asha.sanveeka@karnataka.gov.in',
      phone: '+919845077882',
      passwordHash: hashPassword('Asha@12345'),
      staffId: 'KA-ASHA-581107',
      role: 'ASHA_WORKER',
      districtId: haveri.id,
      talukId: byadgiTaluk.id,
      facilityId: byadgiPhc.id,
      subCenterId: kagineleSc1.id,
      catchmentId: catchment1.id
    }
  });

  const doctorUser = await prisma.user.create({
    data: {
      name: 'Dr. Ananth Viswanath',
      email: 'doctor.ananth@karnataka.gov.in',
      phone: '+919845044556',
      passwordHash: hashPassword('Doctor@12345'),
      staffId: 'KA-MO-88412',
      role: 'DOCTOR',
      districtId: haveri.id,
      talukId: byadgiTaluk.id,
      facilityId: byadgiPhc.id
    }
  });

  const adminUser = await prisma.user.create({
    data: {
      name: 'Dr. Suresh Gowda',
      email: 'admin.suresh@karnataka.gov.in',
      phone: '+919845033445',
      passwordHash: hashPassword('Admin@12345'),
      staffId: 'KA-HA-77401',
      role: 'HOSPITAL_ADMIN',
      districtId: haveri.id,
      talukId: haveriTaluk.id,
      facilityId: haveriDh.id
    }
  });

  await prisma.user.create({
    data: {
      name: 'Dr. Mahesh Patil',
      email: 'dho.mahesh@karnataka.gov.in',
      phone: '+919845011223',
      passwordHash: hashPassword('Dho@12345'),
      staffId: 'KA-DHO-00018',
      role: 'DISTRICT_OFFICER',
      districtId: haveri.id
    }
  });

  await prisma.user.create({
    data: {
      name: 'Dr. Ramesh Gowda',
      email: 'dho.ramesh@karnataka.gov.in',
      phone: '+919845011224',
      passwordHash: hashPassword('Dho@12345'),
      staffId: 'KA-DHO-00019',
      role: 'DISTRICT_OFFICER',
      districtId: haveri.id
    }
  });

  await prisma.user.create({
    data: {
      name: 'Lakshmi Devi',
      email: 'mother.lakshmi@gmail.com',
      phone: '+919845099000',
      passwordHash: hashPassword('Mother@12345'),
      role: 'PATIENT',
      districtId: haveri.id
    }
  });

  // 8. Resource Seeding
  const hduBed4 = await prisma.hospitalBed.create({
    data: { facilityId: haveriDh.id, bedNumber: 'HDU-04', bedType: 'HDU', status: 'OCCUPIED' }
  });

  const bloodUnit = await prisma.bloodBankStock.create({
    data: { facilityId: haveriDh.id, bloodGroup: 'O-', availableUnits: 4, reservedUnits: 2 }
  });

  const ambulanceUnit = await prisma.ambulanceUnit.create({
    data: {
      vehicleNumber: 'KA-27-F-1080',
      driverName: 'Ramesh',
      driverPhone: '+919845088108',
      status: 'COMPLETED',
      currentLat: 14.7951,
      currentLng: 75.3994,
      assignedBase: 'Byadgi 108 Station'
    }
  });

  // 9. Lakshmi Devi Mother Profile & Pregnancy Record
  const lmpDate = new Date('2026-01-10');
  const eddDate = new Date(lmpDate.getTime() + 280 * 24 * 60 * 60 * 1000);

  const lakshmiMother = await prisma.motherProfile.create({
    data: {
      rchId: '129004812749',
      abhaId: '91-8845-1234-5678',
      fullName: 'Lakshmi Devi',
      age: 23,
      phone: '+919845099000',
      husbandName: 'Basavaraj Gowda',
      husbandPhone: '+919845099001',
      emergencyPhone: '+919845099001',
      bloodGroup: 'O+',
      bplCardNumber: 'BPL-HAV-581106-992',
      caseStatus: 'DELIVERED_POSTNATAL',
      currentRiskLevel: 'LOW',
      motherSafetyScore: 94,
      status: 'DELIVERED',
      districtId: haveri.id,
      talukId: byadgiTaluk.id,
      hobliId: kagineleHobli.id,
      villageId: kagineleVillage.id,
      facilityId: haveriDh.id,
      subCenterId: kagineleSc1.id,
      catchmentId: catchment1.id,
      registeredByUserId: ashaUser.id
    }
  });

  const pregnancyRecord = await prisma.pregnancyRecord.create({
    data: {
      motherId: lakshmiMother.id,
      gravida: 1,
      parity: 1,
      abortions: 0,
      lmpDate,
      eddDate,
      currentRiskLevel: 'LOW',
      motherSafetyScore: 94,
      status: 'DELIVERED',
      medicalHistory: JSON.stringify(['Normal Vaginal Delivery Executed at Haveri DH']),
      highRiskFactors: JSON.stringify([])
    }
  });

  // 10. Labor Case & Delivery Record
  const laborCase = await prisma.laborCase.create({
    data: {
      motherId: lakshmiMother.id,
      pregnancyId: pregnancyRecord.id,
      facilityId: haveriDh.id,
      laborRoomNumber: 'LR-02',
      laborStatus: 'POSTPARTUM_OBSERVATION',
      assignedDoctorId: doctorUser.id,
      maternalStatus: 'STABLE',
      babyStatus: 'HEALTHY',
      dischargeStatus: 'DISCHARGE_READY'
    }
  });

  const deliveryRecord = await prisma.deliveryRecord.create({
    data: {
      laborCaseId: laborCase.id,
      motherId: lakshmiMother.id,
      pregnancyId: pregnancyRecord.id,
      facilityId: haveriDh.id,
      deliveryMode: 'NORMAL_VAGINAL',
      estimatedBloodLossMl: 220,
      pphRiskDetected: false,
      amtslAdministered: true,
      placentaComplete: true,
      deliveredByUserId: doctorUser.id
    }
  });

  // 11. Child Profile & National Immunization Schedule (Module 7)
  const child = await prisma.childProfile.create({
    data: {
      childRchId: '129004812749-C1',
      motherId: lakshmiMother.id,
      deliveryRecordId: deliveryRecord.id,
      fullName: 'Baby Girl of Lakshmi Devi',
      gender: 'FEMALE',
      birthWeightKg: 2.95,
      headCircumferenceCm: 34.5,
      apgarScore1Min: 8,
      apgarScore5Min: 9,
      newbornRiskCategory: 'HEALTHY',
      vitaminKGiven: true,
      bcgVaccineGiven: true,
      opv0Given: true,
      hepB0Given: true
    }
  });

  // 0-5 Years National Immunization Schedule
  await prisma.childImmunizationRecord.createMany({
    data: [
      { childId: child.id, vaccineCode: 'BCG', vaccineName: 'BCG (Tuberculosis)', dueAgeWeeks: 0, status: 'GIVEN', givenDate: new Date(), batchNumber: 'BCG-2026-88', administeredByUserId: doctorUser.id },
      { childId: child.id, vaccineCode: 'OPV_0', vaccineName: 'Oral Polio Vaccine 0', dueAgeWeeks: 0, status: 'GIVEN', givenDate: new Date(), batchNumber: 'OPV-2026-12', administeredByUserId: doctorUser.id },
      { childId: child.id, vaccineCode: 'HEPB_0', vaccineName: 'Hepatitis B Birth Dose', dueAgeWeeks: 0, status: 'GIVEN', givenDate: new Date(), batchNumber: 'HEP-2026-44', administeredByUserId: doctorUser.id },
      { childId: child.id, vaccineCode: 'PENTA_1', vaccineName: 'Pentavalent 1 (DPT+HepB+Hib)', dueAgeWeeks: 6, status: 'DUE' },
      { childId: child.id, vaccineCode: 'ROTA_1', vaccineName: 'Rotavirus Vaccine 1', dueAgeWeeks: 6, status: 'DUE' },
      { childId: child.id, vaccineCode: 'PCV_1', vaccineName: 'Pneumococcal Conjugate 1', dueAgeWeeks: 6, status: 'DUE' },
      { childId: child.id, vaccineCode: 'PENTA_2', vaccineName: 'Pentavalent 2', dueAgeWeeks: 10, status: 'DUE' },
      { childId: child.id, vaccineCode: 'PENTA_3', vaccineName: 'Pentavalent 3', dueAgeWeeks: 14, status: 'DUE' },
      { childId: child.id, vaccineCode: 'MR_1', vaccineName: 'Measles-Rubella 1st Dose', dueAgeWeeks: 36, status: 'DUE' },
      { childId: child.id, vaccineCode: 'VIT_A_1', vaccineName: 'Vitamin A 1st Dose', dueAgeWeeks: 36, status: 'DUE' }
    ]
  });

  // WHO Child Growth Record
  await prisma.childGrowthRecord.create({
    data: {
      childId: child.id,
      recordDate: new Date(),
      ageMonths: 0,
      weightKg: 2.95,
      heightCm: 49.5,
      muacCm: 11.2,
      whoWeightForAgeZScore: 0.15,
      malnutritionStatus: 'NORMAL',
      recordedByUserId: doctorUser.id
    }
  });

  // PNC 1-4 Visits for Lakshmi Devi
  await prisma.pncVisit.createMany({
    data: [
      {
        motherId: lakshmiMother.id,
        visitNumber: 1,
        visitDate: new Date(),
        maternalPulse: 78,
        systolicBp: 122,
        diastolicBp: 80,
        temperatureF: 98.4,
        excessiveBleeding: false,
        foulLochia: false,
        breastfeedingStatus: 'EXCLUSIVE',
        recordedByUserId: doctorUser.id
      }
    ]
  });

  console.log('✅ Master Seed Completed Successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
