import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { 
  Heart, 
  Calendar, 
  ShieldCheck, 
  ShieldAlert, 
  Phone, 
  Clock, 
  Activity, 
  Sparkles, 
  Pill, 
  User, 
  Building2, 
  AlertTriangle,
  Stethoscope,
  RefreshCw,
  CheckCircle2,
  Ambulance,
  QrCode,
  Download,
  Share2,
  FileText,
  Users,
  CheckSquare,
  Square,
  Zap,
  AlertCircle,
  ExternalLink,
  Radio,
  Award,
  TrendingUp,
  Plus,
  MapPin,
  UserCheck,
  Search,
  MessageSquare,
  Send,
  Bot,
  UserCircle,
  HelpCircle,
  Lightbulb
} from 'lucide-react';
import { MotherSafetyScoreGauge } from '../components/MotherSafetyScoreGauge';
import { SosDistressButton } from '../components/SosDistressButton';
import { QrCodeGenerator } from '../components/QrCodeGenerator';
import { Navbar } from '../components/Navbar';
import { RootState } from '../store';
import api from '../services/api';

interface CitizenProfile {
  id: string;
  fullName: string;
  ancNumber: string;
  rchId: string;
  abhaNumber: string;
  age: number | string;
  bloodGroup: string;
  mobile: string;
  village: string;
  taluk: string;
  eddDate: string;
  gravida: number | string;
  parity: number | string;
  gestationalPhase: string;
  phaseDescription: string;
  allergies: string;
  immunizations: string;
  assignedAsha: {
    name: string;
    phone: string;
  };
  assignedPhc: {
    name: string;
    phone: string;
    doctorName: string;
  };
  motherSafetyScore: number;
  highRiskCategory: string;
  systolicBp: number;
  diastolicBp: number;
  hbLevel: number;
  weightKg: number;
  // Real-time cross-module connection flags
  activePhcReferral?: any;
  activeHospitalTransfer?: any;
  activeDhoEscalation?: any;
}

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  isStreaming?: boolean;
}

const DEFAULT_PROFILES: CitizenProfile[] = [
  {
    id: 'CITIZEN-1003',
    fullName: 'Lakshmi Devi',
    ancNumber: 'RCH-882190',
    rchId: 'KA-RCH-2026-882190',
    abhaNumber: '91-7761-0021-9981',
    age: 24,
    bloodGroup: 'B+',
    mobile: '+91 98451 11200',
    village: 'Shiggaon Agri Sector',
    taluk: 'Shiggaon Taluk Block',
    eddDate: '2026-11-20',
    gravida: 1,
    parity: 0,
    gestationalPhase: '3rd Trimester Gestational Care Phase (Week 28 - Active Fetal Maturation & Pre-Birth Readiness)',
    phaseDescription: 'You have officially entered the crucial 3rd Trimester! Fetal cognitive reflexes and respiratory alveoli are rapidly developing. Maternal iron demand peaks during this stage to accumulate newborn hemoglobin reserves.',
    allergies: 'No Known Drug Allergies (NKDA)',
    immunizations: 'Tetanus Toxoid (TT-1 & TT-2 Boosters Completed)',
    assignedAsha: {
      name: 'Manjula G. (Senior ASHA Supervisor)',
      phone: '+91 98450 11992'
    },
    assignedPhc: {
      name: 'Shiggaon Primary Health Centre (PHC)',
      phone: '+91 83 7822 1100',
      doctorName: 'Dr. Naveen Deshpande (MD Obstetrics)'
    },
    motherSafetyScore: 94,
    highRiskCategory: 'NONE',
    systolicBp: 118,
    diastolicBp: 76,
    hbLevel: 12.4,
    weightKg: 58
  },
  {
    id: 'CITIZEN-1001',
    fullName: 'Meenakshi Sundaram',
    ancNumber: 'RCH-982140',
    rchId: 'KA-RCH-2026-982140',
    abhaNumber: '91-8845-1234-5678',
    age: 26,
    bloodGroup: 'O+',
    mobile: '+91 98450 67123',
    village: 'Somwarpet Village',
    taluk: 'Haveri Block',
    eddDate: '2026-10-15',
    gravida: 2,
    parity: 1,
    gestationalPhase: '3rd Trimester Acute Medical Observation Phase (Week 32 - High-Risk Pre-Eclampsia Monitoring)',
    phaseDescription: 'Active clinical monitoring due to elevated blood pressure (BP 168/112 mmHg). Patient has been prioritized across Haveri District Hospital ER Command suites under acute emergency protocol.',
    allergies: 'Mild Sensitivity to Penicillin',
    immunizations: 'Tetanus Toxoid Boosters Complete · Corticosteroid Fetal Lung Booster Administered',
    assignedAsha: {
      name: 'Sanveeka Gowda (ASHA Facilitator)',
      phone: '+91 98450 77889'
    },
    assignedPhc: {
      name: 'Varthur Primary Health Centre (PHC)',
      phone: '+91 80 2845 2200',
      doctorName: 'Dr. Anoop Kumar S.'
    },
    motherSafetyScore: 45,
    highRiskCategory: 'SEVERE_PRE_ECLAMPSIA',
    systolicBp: 168,
    diastolicBp: 112,
    hbLevel: 9.2,
    weightKg: 64
  },
  {
    id: 'CITIZEN-1002',
    fullName: 'Sunitha M.',
    ancNumber: 'RCH-331209',
    rchId: 'KA-RCH-2026-331209',
    abhaNumber: '91-9921-5544-8890',
    age: 29,
    bloodGroup: 'AB+',
    mobile: '+91 99012 55431',
    village: 'Whitefield Peripheral Outpost',
    taluk: 'Haveri Block',
    eddDate: '2026-08-02',
    gravida: 3,
    parity: 2,
    gestationalPhase: 'Full-Term Delivery Phase (Week 39 - Imminent Partograph & Labor Surveillance)',
    phaseDescription: 'Full-term gestation reached. Fetal head engagement observed with obstructed labor risk crossing WHO partograph alert lines. ICU Ward bed ICU-01 reserved at Haveri District Hospital.',
    allergies: 'None (Clean Pharmacological History)',
    immunizations: 'Complete Routine RCH Vaccination Suite',
    assignedAsha: {
      name: 'Sanveeka Gowda (ASHA Facilitator)',
      phone: '+91 98450 77889'
    },
    assignedPhc: {
      name: 'Varthur Primary Health Centre (PHC)',
      phone: '+91 80 2845 2200',
      doctorName: 'Dr. Anoop Kumar S.'
    },
    motherSafetyScore: 68,
    highRiskCategory: 'OBSTRUCTED_LABOR_RISK',
    systolicBp: 138,
    diastolicBp: 88,
    hbLevel: 11.2,
    weightKg: 70
  }
];

export const MotherPortalPage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useSelector((state: RootState) => state.auth);
  const [activeTab, setActiveTab] = useState<'passbook' | 'ai_chatgpt' | 'anc_schedule' | 'nutrition_ai' | 'smart_id_dbt' | 'family_guardians'>('passbook');
  const [availableProfiles, setAvailableProfiles] = useState<CitizenProfile[]>(DEFAULT_PROFILES);
  // Default to Lakshmi Devi (CITIZEN-1003) immediately as requested by user
  const [selectedProfileId, setSelectedProfileId] = useState<string>('CITIZEN-1003');
  const [currentProfile, setCurrentProfile] = useState<CitizenProfile>(DEFAULT_PROFILES[0]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Interactive Supplement Adherence State
  const [ifaTakenToday, setIfaTakenToday] = useState<boolean>(true);
  const [calciumTakenToday, setCalciumTakenToday] = useState<boolean>(false);
  const [adherenceStreak, setAdherenceStreak] = useState<number>(24);

  // Interactive AI Symptom Checker State
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [aiDiagnosticReport, setAiDiagnosticReport] = useState<{ severity: 'OPTIONAL' | 'MILD' | 'EMERGENCY'; advice: string } | null>(null);

  // ANC Appointment Rescheduling Modal
  const [showBookingModal, setShowBookingModal] = useState<boolean>(false);
  const [selectedHospitalForBooking, setSelectedHospitalForBooking] = useState<string>('Shiggaon Primary Health Centre (PHC)');

  // Family Guardians Roster
  const [guardians, setGuardians] = useState<any[]>([
    { name: 'Rajesh Sundaram', relation: 'Husband (Head of Household)', mobile: '+91 98450 67124', smsAlerts: true },
    { name: 'Manjula Amma', relation: 'Mother-in-Law (Primary Caregiver)', mobile: '+91 98450 88912', smsAlerts: true }
  ]);
  const [newGuardianName, setNewGuardianName] = useState<string>('');
  const [newGuardianRelation, setNewGuardianRelation] = useState<string>('Brother / Relative');
  const [newGuardianPhone, setNewGuardianPhone] = useState<string>('');
  const [showAddGuardian, setShowAddGuardian] = useState<boolean>(false);

  // ChatGPT-style AI Q&A Chatbot State
  const [chatInput, setChatInput] = useState<string>('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init-1',
      sender: 'ai',
      timestamp: 'Just now',
      text: "Namaste **Lakshmi Devi** 🙏! I am your personal **JANANI360 Maternal AI Assistant**, powered by medical-grade Google DeepMind LLM & World Health Organization (WHO) maternal care guidelines.\n\nI have evaluated your active clinical record:\n• **Current Phase**: 3rd Trimester Gestational Care (Week 28)\n• **Hemoglobin**: 12.4 g/dL (Excellent Gold Standard! ✨)\n• **Blood Pressure**: 118/76 mmHg (Optimal Safety)\n\nHow can I support your maternal wellness today? You can tap any quick question chip below or ask anything about pregnancy nutrition, sleeping posture, baby kicks, or childbirth preparation!"
    }
  ]);
  const [isAiTyping, setIsAiTyping] = useState<boolean>(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (activeTab === 'ai_chatgpt') {
      scrollToBottom();
    }
  }, [chatMessages, isAiTyping, activeTab]);

  // Load real-time running data from LocalStorage across all 4 tiers & Backend
  const syncRealTimeEcosystem = async () => {
    setIsLoading(true);
    try {
      const offlineRegsRaw = localStorage.getItem('janani360_offline_registrations');
      const phcRefRaw = localStorage.getItem('janani360_phc_referrals');
      const hospTransRaw = localStorage.getItem('janani360_hospital_transfers');
      const dhoEscRaw = localStorage.getItem('janani360_dho_escalations');

      const phcRefs = phcRefRaw ? JSON.parse(phcRefRaw) : [];
      const hospTrans = hospTransRaw ? JSON.parse(hospTransRaw) : [];
      const dhoEsc = dhoEscRaw ? JSON.parse(dhoEscRaw) : [];

      let mergedProfiles: CitizenProfile[] = [...DEFAULT_PROFILES];

      // Inject newly registered ASHA offline records if present
      if (offlineRegsRaw) {
        const offlineRegs = JSON.parse(offlineRegsRaw);
        offlineRegs.forEach((reg: any, idx: number) => {
          if (!mergedProfiles.some(p => p.fullName.toLowerCase() === (reg.fullName || '').toLowerCase())) {
            mergedProfiles.push({
              id: `CITIZEN-NEW-${idx}`,
              fullName: reg.fullName || `Registered Mother #${idx}`,
              ancNumber: reg.ancNumber || `RCH-${Math.floor(100000 + Math.random() * 900000)}`,
              rchId: `KA-RCH-2026-${reg.ancNumber || idx}`,
              abhaNumber: reg.abhaNumber || '91-4455-8822-1002',
              age: reg.age || 25,
              bloodGroup: reg.bloodGroup || 'O+',
              mobile: reg.mobile || '+91 98450 00000',
              village: reg.village || 'Haveri Rural Block',
              taluk: reg.taluk || 'Haveri HQ',
              eddDate: reg.eddDate || '2026-10-10',
              gravida: reg.gravida || 1,
              parity: reg.parity || 0,
              gestationalPhase: '2nd Trimester Routine ANC Observation (Week 20)',
              phaseDescription: 'Active rural community tracking under National Health Mission guidelines.',
              allergies: 'No Known Drug Allergies',
              immunizations: 'TT-1 Initial Vaccination Completed',
              assignedAsha: {
                name: 'Sanveeka Gowda (ASHA Facilitator)',
                phone: '+91 98450 77889'
              },
              assignedPhc: {
                name: 'Varthur Primary Health Centre (PHC)',
                phone: '+91 80 2845 2200',
                doctorName: 'Dr. Anoop Kumar S.'
              },
              motherSafetyScore: reg.hbLevel && Number(reg.hbLevel) < 9 ? 62 : 91,
              highRiskCategory: reg.hbLevel && Number(reg.hbLevel) < 9 ? 'ANEMIA_RISK' : 'NONE',
              systolicBp: Number(reg.systolicBp) || 120,
              diastolicBp: Number(reg.diastolicBp) || 80,
              hbLevel: Number(reg.hbLevel) || 11.5,
              weightKg: Number(reg.weightKg) || 56
            });
          }
        });
      }

      // Link real-time telemetry from PHC, Hospital ER & DHO commands
      mergedProfiles = mergedProfiles.map(profile => {
        const matchingPhc = phcRefs.find((r: any) => 
          (r.ancNumber && r.ancNumber === profile.ancNumber) || 
          (r.motherName && r.motherName.toLowerCase() === profile.fullName.toLowerCase())
        );
        const matchingHosp = hospTrans.find((h: any) => 
          (h.ancNumber && h.ancNumber === profile.ancNumber) || 
          (h.motherName && h.motherName.toLowerCase() === profile.fullName.toLowerCase())
        );
        const matchingDho = dhoEsc.find((d: any) => 
          (d.ancNumber && d.ancNumber === profile.ancNumber) || 
          (d.motherName && d.motherName.toLowerCase() === profile.fullName.toLowerCase())
        );

        return {
          ...profile,
          activePhcReferral: matchingPhc || null,
          activeHospitalTransfer: matchingHosp || null,
          activeDhoEscalation: matchingDho || null
        };
      });

      setAvailableProfiles(mergedProfiles);
      
      const current = mergedProfiles.find(p => p.id === selectedProfileId) || mergedProfiles[0];
      setCurrentProfile(current);
      setSelectedHospitalForBooking(current.assignedPhc?.name || 'Shiggaon Primary Health Centre (PHC)');

    } catch (err) {
      console.error('Error synchronizing Citizen ecosystem telemetry:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    syncRealTimeEcosystem();
    const timer = setInterval(() => {
      syncRealTimeEcosystem();
    }, 4500);
    return () => clearInterval(timer);
  }, [selectedProfileId]);

  const handleProfileSwitch = (id: string) => {
    setSelectedProfileId(id);
    const found = availableProfiles.find(p => p.id === id) || availableProfiles[0];
    setCurrentProfile(found);
    setAiDiagnosticReport(null);
    setSelectedSymptoms([]);
    
    // Update chatbot introductory message for selected profile
    setChatMessages([
      {
        id: `msg-switch-${Date.now()}`,
        sender: 'ai',
        timestamp: 'Just now',
        text: `Namaste **${found.fullName}** 🙏! I have transitioned my clinical context to your medical profile.\n\n• **Current Gestational Phase**: ${found.gestationalPhase}\n• **Recorded Hemoglobin**: ${found.hbLevel} g/dL\n• **Blood Pressure**: ${found.systolicBp}/${found.diastolicBp} mmHg\n• **Risk Assessment**: ${found.highRiskCategory !== 'NONE' ? `⚠️ **${found.highRiskCategory.replace(/_/g, ' ')}**` : '✓ **Optimal Clinical Safety**'}\n\nHow can I answer your pregnancy questions or assist your family caregivers today?`
      }
    ]);
  };

  // ChatGPT-style Medical Reasoning Response Engine
  const generateAiMedicalResponse = (queryText: string) => {
    const q = queryText.toLowerCase();

    if (q.includes('iron') || q.includes('hemoglobin') || q.includes('hb') || q.includes('food') || q.includes('diet') || q.includes('eat') || q.includes('nutrition')) {
      return `### 🥗 Clinical Nutrition & Hemoglobin Optimization Advisory\n\nFor your current stage (**${currentProfile.gestationalPhase}**), maintaining your hemoglobin level of **${currentProfile.hbLevel} g/dL** requires dedicated dietary fortification:\n\n1. **Iron-Rich Foods to Eat Daily:**\n   • **Green Leafy Vegetables**: Drumstick leaves (Moringa), Spinach (Palak), and Amaranth (Dantu).\n   • **Legumes & Lentils**: Sprouted Bengal gram, Moong dal, and finger millet (Ragi Dosa/Malt).\n   • **Jaggery & Sesame**: Peanut chikki or sesame laddoos made with pure organic jaggery.\n\n2. **The Vitamin C Absorption Secret:**\n   • Always consume your daily Iron-Folic Acid (IFA) tablet or iron meals with a glass of lemon water, amla juice, or orange! Vitamin C increases intestinal iron absorption by up to **300%**.\n\n3. **What to Avoid:**\n   • Strictly avoid drinking tea or coffee within 2 hours of taking your IFA tablets, as tannins block iron absorption in the blood!`;
    } 
    else if (q.includes('sleep') || q.includes('posture') || q.includes('position') || q.includes('back') || q.includes('pain') || q.includes('rest')) {
      return `### 🛏️ 3rd Trimester Gestational Sleeping Posture & Back Care\n\nIn Week 28 and beyond, as fetal weight expands to ~36 cm (size of a papaya), proper sleep mechanics are essential to protect spinal alignment and fetal blood supply:\n\n1. **Sleep on Your Left Side (SOS Posture):**\n   • Sleeping on your **left side (SOS - Sleep On Side)** maximizes blood circulation and oxygen nutrient flow from your heart to the placenta and baby.\n   • It also removes pressure from your liver and renal veins, reducing leg swelling and ankle edema.\n\n2. **Avoid Flat Back Sleeping:**\n   • Do **not** sleep flat on your back during the 3rd trimester! Back sleeping compresses the major vein (inferior vena cava), which can cause maternal dizziness and decrease blood supply to the baby.\n\n3. **Pillow Support Tactics:**\n   • Place a soft pregnancy pillow or blanket cushion **between your knees** and a small cushion under your abdomen to relieve lower lumbar back pain immediately.`;
    }
    else if (q.includes('kick') || q.includes('baby') || q.includes('movement') || q.includes('move') || q.includes('count') || q.includes('fetal')) {
      return `### 👶 Fetal Movement & Daily Kick Count Tracking (Cardiff Rule of 10)\n\nYour baby is now developing strong motor reflexes and sleep-wake cycles! Here is how to scientifically monitor fetal well-being:\n\n1. **The Daily 10-Kick Rule:**\n   • Every morning starting at Week 28, count how long it takes to feel **10 distinct movements or kicks**.\n   • Under healthy gestational conditions, you should easily feel at least 10 kicks within a 12-hour window (and often within 2 hours after breakfast or lunch!).\n\n2. **How to Stimulate a Sleeping Baby:**\n   • If baby feels quiet, drink a cool glass of water or naturally sugared fruit juice, lie down peacefully on your left side in a quiet room, and gently stroke your abdomen. Baby usually responds within 20 minutes!\n\n🚨 **CRITICAL WARNING:** If you ever count **fewer than 10 kicks in 12 hours** or notice a sharp, sudden stop in fetal movement, tap the red **SOS Distress Button** immediately to consult your PHC Medical Officer **${currentProfile.assignedPhc.doctorName}**.`;
    }
    else if (q.includes('labor') || q.includes('birth') || q.includes('delivery') || q.includes('pain') || q.includes('sign') || q.includes('water') || q.includes('start')) {
      return `### 🏥 Recognizing True Labor Signs & Hospital Delivery Readiness\n\nAs you progress toward your Estimated Delivery Date (**${currentProfile.eddDate}**), differentiating false Braxton-Hicks contractions from true childbirth labor is vital:\n\n1. **3 Primary Signs of True Labor:**\n   • **Rhythmic Contractions**: Stomach cramping that tightens regularly, occurring every 5–10 minutes, and lasting longer and stronger (even when you walk or rest).\n   • **Water Breaking (Rupture of Membranes)**: A sudden fluid gush or persistent trickling of warm, odorless fluid from the vagina.\n   • **The "Bloody Show"**: Pinkish or brownish mucous discharge indicating the cervical plug has cleared.\n\n2. **Immediate Action Protocol:**\n   • The moment true labor begins, immediately tap our built-in **Call 108 Emergency Ambulance** trigger! Our integrated GPS system guarantees zero-cost green corridor transport directly to your booked maternity labor room at **${currentProfile.assignedPhc.name}**.`;
    }
    else if (q.includes('bag') || q.includes('pack') || q.includes('hospital') || q.includes('carry') || q.includes('item') || q.includes('prepare')) {
      return `### 🎒 Institutional Childbirth Bag Packing Checklist (NHM Gold Standard)\n\nTo ensure zero stress during emergency transport, pack your hospital delivery bag by **Week 34** with these essential items:\n\n1. **Maternal Medical & Identity Dossier:**\n   • Your physical or downloaded digital **JANANI360 Smart RCH ID Card** (with active QR Code).\n   • Original Aadhaar Card and ABHA account link (${currentProfile.abhaNumber}).\n   • Complete Antenatal Care (ANC 1 to 4) doctor examination passbook and blood test records.\n\n2. **For Lakshmi Devi (The Mother):**\n   • 3 sets of comfortable, front-buttoned cotton gowns for easy breastfeeding.\n   • Sterilized sanitary maternity pads, warm slippers, and an extra cotton shawl.\n\n3. **For the Newborn Baby:**\n   • 4 pairs of clean, pre-washed cotton baby vests, caps, and hand mittens.\n   • 3 soft baby swaddle wrapping blankets and clean cloth diapers.\n   • *Reminder*: BCG and Hepatitis B vaccinations will be administered free of cost before hospital discharge!`;
    }
    else if (q.includes('money') || q.includes('jsy') || q.includes('pmmvy') || q.includes('scheme') || q.includes('dbt') || q.includes('bank') || q.includes('rupee') || q.includes('grant')) {
      return `### 💰 Government Direct Benefit Transfer (DBT) Financial Entitlements\n\nAs a registered beneficiary under the Government of Karnataka and National Health Mission, your Aadhaar-linked SBI bank account is scheduled for automatic cash grants:\n\n1. **Pradhan Mantri Matru Vandana Yojana (PMMVY - ₹5,000 Total):**\n   • **Installment 1 (₹3,000)**: Released upon early 1st-trimester registration at ${currentProfile.assignedPhc.name} *(Status: Credited & Verified)*.\n   • **Installment 2 (₹2,000)**: Disbursed after completing ANC Visit #4 and recording 180 IFA tablets.\n\n2. **Janani Suraksha Yojana (JSY - Institutional Childbirth Bonus):**\n   • **₹1,000 Direct Delivery Bonus**: Disbursed automatically by the Regional Treasury immediately after giving birth inside an approved government medical facility under doctor care!\n\nAll financial transactions are monitored with zero middlemen via your digital passbook locker.`;
    }
    else {
      return `### 🩺 JANANI360 Personalized Clinical AI Evaluation\n\nThank you for sharing your query regarding: *"**${queryText}**"*\n\nBased on your active maternal profile (**${currentProfile.fullName}**, G${currentProfile.gravida} P${currentProfile.parity}, **${currentProfile.gestationalPhase}**):\n\n1. **Clinical Vitals Assessment**: Your current blood pressure (**${currentProfile.systolicBp}/${currentProfile.diastolicBp} mmHg**) and hemoglobin (**${currentProfile.hbLevel} g/dL**) reflect an **Optimal Safety Score (94/100)**.\n2. **Personalized Medical Advice**: During this trimester, gentle body hydration (2.5 to 3 liters daily), routine daily walking for 20 minutes, and strict compliance with daily Iron & Calcium supplements are strongly recommended to support healthy placental circulation and infant neurological maturity.\n\n📞 **Need Human Clinical Validation?**\nIf you are experiencing any acute unusual discomfort, you can immediately speak directly with your assigned Medical Officer **${currentProfile.assignedPhc.doctorName}** (${currentProfile.assignedPhc.phone}) or your Village ASHA Facilitator **${currentProfile.assignedAsha.name}** using the green calling triggers above!`;
    }
  };

  const handleSendChat = (customText?: string) => {
    const textToProcess = customText || chatInput;
    if (!textToProcess.trim() || isAiTyping) return;

    const newUserMsg: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      text: textToProcess.trim(),
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, newUserMsg]);
    if (!customText) setChatInput('');
    setIsAiTyping(true);

    // Simulate DeepMind medical reasoning deliberation delay
    setTimeout(() => {
      const aiResponseText = generateAiMedicalResponse(textToProcess.trim());
      const newAiMsg: ChatMessage = {
        id: `msg-ai-${Date.now()}`,
        sender: 'ai',
        text: aiResponseText,
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, newAiMsg]);
      setIsAiTyping(false);
    }, 850);
  };

  const handleIfaToggle = () => {
    if (!ifaTakenToday) {
      setIfaTakenToday(true);
      setAdherenceStreak(prev => prev + 1);
      alert('🎉 IFA SUPPLEMENT DOSE RECORDED!\n\nYour adherence streak has increased to ' + (adherenceStreak + 1) + ' days.\n+15 NHM Maternal Adherence Reward Points credited to your digital health locker.');
    } else {
      setIfaTakenToday(false);
      setAdherenceStreak(prev => Math.max(0, prev - 1));
    }
  };

  const handleRunAiTriage = () => {
    if (selectedSymptoms.length === 0) {
      alert('Please check at least one symptom from the list to run the JANANI360 Clinical AI Obstetric assessment.');
      return;
    }

    const hasDangerSign = selectedSymptoms.some(s => 
      ['Severe Headache & Blurred Vision', 'Vaginal Bleeding', 'Sudden Swelling of Face & Hands', 'Decreased Fetal Movement'].includes(s)
    );

    if (hasDangerSign) {
      setAiDiagnosticReport({
        severity: 'EMERGENCY',
        advice: '🚨 CRITICAL OBSTETRIC ALERT: You have reported acute danger signs associated with severe pre-eclampsia or fetal stress. IMMEDIATELY tap the red SOS Distress Button above to dispatch a 108 Green-Corridor Ambulance or contact your ASHA facilitator.'
      });
    } else {
      setAiDiagnosticReport({
        severity: 'MILD',
        advice: '✅ MILD SYMPTOMS DETECTED: Mild leg swelling and morning nausea are common during the 2nd and 3rd trimesters. Ensure adequate hydration (2.5L daily water intake), rest with elevated feet, and continue taking daily IFA & Calcium D3 tablets.'
      });
    }
  };

  const handleConfirmAppointment = () => {
    alert(`📅 ANTENATAL CARE (ANC) APPOINTMENT CONFIRMED!\n\nPatient: ${currentProfile.fullName} (${currentProfile.ancNumber})\nSelected Medical Facility: ${selectedHospitalForBooking}\nAppointment Slot: Tomorrow morning at 09:30 AM\n\nAutomated SMS confirmation and digital appointment token transmitted to your mobile (${currentProfile.mobile}) and your assigned ASHA facilitator.`);
    setShowBookingModal(false);
  };

  const handleAddGuardian = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuardianName || !newGuardianPhone) {
      alert('Please provide both guardian name and active mobile number.');
      return;
    }
    setGuardians([...guardians, { name: newGuardianName, relation: newGuardianRelation, mobile: newGuardianPhone, smsAlerts: true }]);
    setNewGuardianName('');
    setNewGuardianPhone('');
    setShowAddGuardian(false);
    alert(`✅ FAMILY GUARDIAN LINKED!\n\n${newGuardianName} has been successfully registered to your ABDM emergency alert network and will receive automated real-time SMS notifications during high-risk medical referrals.`);
  };

  const calculateDaysToEdd = (eddStr?: string) => {
    if (!eddStr) return 90;
    const edd = new Date(eddStr);
    const today = new Date();
    const diffTime = edd.getTime() - today.getTime();
    return Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  };

  const daysLeft = calculateDaysToEdd(currentProfile.eddDate);
  const currentWeek = Math.min(40, Math.max(1, 40 - Math.floor(daysLeft / 7)));
  const hasActiveEmergency = Boolean(currentProfile.activeHospitalTransfer || currentProfile.activeDhoEscalation || currentProfile.highRiskCategory !== 'NONE');

  return (
    <div className="min-h-screen bg-[#070913] text-slate-100 font-sans pb-24">
      <Navbar />
      
      {/* TOP PROMINENT GESTATIONAL PHASE & GOVERNMENT IDENTIFIER BANNER */}
      <div className="bg-gradient-to-r from-rose-950 via-purple-950 to-indigo-950 border-b border-rose-500/50 py-3.5 px-6 shadow-2xl relative overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3 relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 text-white font-extrabold flex items-center justify-center shadow-lg shadow-rose-500/40 animate-pulse shrink-0">
              ✨
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-black text-rose-300 uppercase tracking-wider font-mono">
                  ACTIVE GESTATIONAL CLINICAL PHASE:
                </span>
                <span className="text-sm sm:text-base font-black text-white px-2.5 py-0.5 rounded-lg bg-rose-500/25 border border-rose-500/40 shadow-inner">
                  {currentProfile.gestationalPhase}
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium mt-1 leading-snug">
                {currentProfile.phaseDescription}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end md:self-auto font-mono text-xs font-black">
            <span className="px-3 py-1.5 rounded-xl bg-slate-900 text-emerald-400 border border-slate-750 shadow-md">
              ⏳ {daysLeft} Days to EDD ({currentProfile.eddDate})
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-slate-900 text-cyan-300 border border-slate-750 shadow-md hidden sm:inline-block">
              👶 Fetal Size: Papaya (~36cm)
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Workspace */}
      <main className="max-w-7xl mx-auto px-6 pt-6 space-y-6">
        
        {/* Real-Time Inter-Module Telemetry Alert Bridge (If Patient is in active transit) */}
        {(currentProfile.activeHospitalTransfer || currentProfile.activeDhoEscalation || currentProfile.activePhcReferral) && (
          <div className="p-5 rounded-3xl bg-gradient-to-r from-red-950/70 via-slate-900 to-amber-950/60 border-2 border-red-500/60 shadow-2xl space-y-4 animate-fadeIn">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-red-500/30 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-500 text-white flex items-center justify-center font-black animate-bounce shadow-lg shadow-red-500/40">
                  <Radio className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-sm font-black text-white uppercase tracking-tight flex items-center gap-2">
                    <span>🚨 REAL-TIME GOVERNMENT HOSPITAL &amp; DHO REFERRAL TELEMETRY ACTIVE</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">LIVE RUNNING DATA SYNCED</span>
                  </span>
                  <p className="text-xs text-rose-200 font-medium">
                    Your antenatal emergency profile has been prioritized across regional hospital command dashboards.
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-amber-300 bg-amber-500/20 px-3 py-1 rounded-xl border border-amber-500/40">
                108 Emergency Green Corridor Open
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-medium text-slate-200">
              <div className="bg-slate-950/90 p-3.5 rounded-2xl border border-slate-800 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase text-cyan-400 block">1. PHC Doctor Medical Review</span>
                  <p className="text-sm font-bold text-white mt-1">
                    {currentProfile.activePhcReferral ? `Referred by ${currentProfile.activePhcReferral.doctorName || 'PHC Specialist'}` : 'Triage cleared by Shiggaon PHC'}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1 italic">
                    "{currentProfile.activePhcReferral?.doctorNotes || 'Emergency obstetric triage loading medication completed.'}"
                  </p>
                </div>
                <div className="mt-2.5 pt-2 border-t border-slate-850 text-emerald-400 font-extrabold flex items-center gap-1 text-[11px]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>PHC Medical Triage Finalized</span>
                </div>
              </div>

              <div className="bg-slate-950/90 p-3.5 rounded-2xl border border-indigo-500/40 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase text-indigo-300 block">2. Hospital Admin Ward Bed Lock</span>
                  <p className="text-sm font-bold text-amber-300 mt-1 font-mono">
                    Ward Assigned: {currentProfile.activeHospitalTransfer?.reservedBed?.bedNumber || 'ICU-02 (District Hospital)'}
                  </p>
                  <p className="text-[11px] text-slate-300 mt-1 font-mono">
                    🚑 108 Ambulance: <strong className="text-emerald-400">{currentProfile.activeHospitalTransfer?.ambulanceUnit?.vehicleNumber || 'KA-27-F-1084'}</strong> ({currentProfile.activeHospitalTransfer?.ambulanceUnit?.driverName || 'Ramesh K.'})
                  </p>
                </div>
                <div className="mt-2.5 pt-2 border-t border-slate-850 text-amber-300 font-extrabold flex items-center gap-1 text-[11px]">
                  <Ambulance className="w-4 h-4 text-amber-300 shrink-0 animate-pulse" />
                  <span>Status: {currentProfile.activeHospitalTransfer?.hospitalAdminStatus || 'EN_ROUTE'} (O2 Telemetry Active)</span>
                </div>
              </div>

              <div className="bg-slate-950/90 p-3.5 rounded-2xl border border-amber-500/40 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase text-amber-400 block">3. DHO State Executive Oversight</span>
                  <p className="text-sm font-bold text-white mt-1">
                    {currentProfile.activeDhoEscalation ? 'Escalated to District Health Officer (DHO) Command Suite' : 'Standard Health Mission Tracking'}
                  </p>
                  <p className="text-[11px] text-rose-300 mt-1">
                    Requested Support: {currentProfile.activeDhoEscalation?.requestedSupport || '₹25,000 CM Critical Care Emergency Grant'}
                  </p>
                </div>
                <div className="mt-2.5 pt-2 border-t border-slate-850 text-emerald-400 font-extrabold flex items-center gap-1 text-[11px]">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>DHO Action: {currentProfile.activeDhoEscalation?.dhoActionStatus || 'FUND_APPROVED'}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Comprehensive Profile & Medical History Master Card */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-950 rounded-3xl p-6 sm:p-8 border-2 border-indigo-500/35 shadow-2xl space-y-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 border-b border-slate-800 pb-5">
            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                  Namaste, {currentProfile.fullName} 🙏
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-extrabold font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-sm">
                  RCH ID: {currentProfile.rchId}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500 text-slate-950 shadow-sm">
                  ABDM GOLD VERIFIED
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed max-w-3xl">
                This is your comprehensive National Health Mission health passbook. All medical history, ANC appointments, and obstetric vitals are verified in real-time with your assigned primary care doctors and family caregivers.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                onClick={() => setActiveTab('ai_chatgpt')}
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-black text-xs uppercase tracking-wider shadow-xl shadow-purple-600/30 transition flex items-center gap-2 active:scale-95 animate-bounce"
              >
                <MessageSquare className="w-4 h-4 fill-white shrink-0" />
                <span>Ask AI Maternal ChatGPT</span>
              </button>
              <button
                onClick={() => setShowBookingModal(true)}
                className="px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-emerald-300 font-bold text-xs border border-emerald-500/40 transition flex items-center gap-2 shadow-sm"
              >
                <Calendar className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>Book Doctor Checkup</span>
              </button>
            </div>
          </div>

          {/* Detailed Demographic & Clinical Medical History Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 font-sans text-xs">
            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 shadow-inner">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Age &amp; Parity</span>
              <div className="text-sm font-black text-white mt-1">Age {currentProfile.age}</div>
              <div className="text-[11px] font-mono font-bold text-cyan-300">G{currentProfile.gravida} P{currentProfile.parity} (1st Child)</div>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 shadow-inner">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Blood Group</span>
              <div className="text-sm font-black text-rose-400 font-mono mt-1">{currentProfile.bloodGroup}</div>
              <div className="text-[10px] font-bold text-slate-400">Rh Compatibility Verified</div>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 shadow-inner">
              <span className="text-[10px] font-bold text-slate-400 uppercase">ABHA Digital ID</span>
              <div className="text-xs font-mono font-black text-emerald-400 mt-1 truncate">{currentProfile.abhaNumber}</div>
              <div className="text-[10px] font-bold text-slate-400">Aadhaar Bank Seeded</div>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 shadow-inner">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Village &amp; Taluk</span>
              <div className="text-sm font-black text-white mt-1 truncate">{currentProfile.village}</div>
              <div className="text-[11px] text-slate-400 font-semibold">{currentProfile.taluk}</div>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 shadow-inner">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Drug Allergies</span>
              <div className="text-xs font-extrabold text-amber-300 mt-1">{currentProfile.allergies}</div>
              <div className="text-[10px] text-slate-500">Pharmacology Shield</div>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 shadow-inner">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Immunizations</span>
              <div className="text-xs font-black text-emerald-400 mt-1 truncate">{currentProfile.immunizations}</div>
              <div className="text-[10px] font-bold text-slate-400">TT-1 &amp; TT-2 Complete</div>
            </div>
          </div>
        </div>

        {/* TAB NAVIGATION BAR */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/95 p-2 rounded-2xl border border-slate-800 shadow-xl">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTab('passbook')}
              className={`px-4 py-2.5 rounded-xl font-extrabold text-xs transition flex items-center gap-2 ${
                activeTab === 'passbook' ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white font-black shadow-lg shadow-rose-600/30' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Activity className="w-4 h-4 text-rose-300" />
              <span>1. AI Safety Passbook &amp; Vitals</span>
            </button>
            <button
              onClick={() => setActiveTab('ai_chatgpt')}
              className={`px-4 py-2.5 rounded-xl font-extrabold text-xs transition flex items-center gap-2 ${
                activeTab === 'ai_chatgpt' ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-fuchsia-600 text-white font-black shadow-xl shadow-purple-600/35 animate-pulse' : 'text-purple-300 hover:text-white hover:bg-slate-800/60 border border-purple-500/40'
              }`}
            >
              <MessageSquare className="w-4 h-4 fill-white text-purple-200" />
              <span>2. 💬 AI Maternal ChatGPT (Q&amp;A Box)</span>
            </button>
            <button
              onClick={() => setActiveTab('anc_schedule')}
              className={`px-4 py-2.5 rounded-xl font-extrabold text-xs transition flex items-center gap-2 ${
                activeTab === 'anc_schedule' ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Stethoscope className="w-4 h-4 text-indigo-300" />
              <span>3. ANC Doctor Visits &amp; Booking</span>
            </button>
            <button
              onClick={() => setActiveTab('nutrition_ai')}
              className={`px-4 py-2.5 rounded-xl font-extrabold text-xs transition flex items-center gap-2 ${
                activeTab === 'nutrition_ai' ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 font-black shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Pill className={`w-4 h-4 ${activeTab === 'nutrition_ai' ? 'text-slate-950' : 'text-amber-400'}`} />
              <span>4. Daily Supplements &amp; Symptom Triage</span>
            </button>
            <button
              onClick={() => setActiveTab('smart_id_dbt')}
              className={`px-4 py-2.5 rounded-xl font-extrabold text-xs transition flex items-center gap-2 ${
                activeTab === 'smart_id_dbt' ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <QrCode className="w-4 h-4 text-emerald-300" />
              <span>5. Smart ID Card &amp; Gov DBT Grants</span>
            </button>
            <button
              onClick={() => setActiveTab('family_guardians')}
              className={`px-4 py-2.5 rounded-xl font-extrabold text-xs transition flex items-center gap-2 ${
                activeTab === 'family_guardians' ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Users className="w-4 h-4 text-cyan-300" />
              <span>6. Family Guardians &amp; Birth Plan</span>
            </button>
          </div>
        </div>

        {/* TAB 1: AI SAFETY PASSBOOK & VITALS MONITOR */}
        {activeTab === 'passbook' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            <div className="lg:col-span-7 bg-slate-900/95 p-6 rounded-3xl border border-slate-800 shadow-2xl space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-emerald-400" />
                  <span>AI Maternal Safety &amp; Obstetric Vitals Monitor</span>
                </h3>
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                  currentProfile.highRiskCategory !== 'NONE' ? 'bg-red-500/20 text-red-300 border-red-500/40 animate-pulse' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                }`}>
                  {currentProfile.highRiskCategory !== 'NONE' ? `⚠️ ${currentProfile.highRiskCategory.replace(/_/g, ' ')}` : '✓ Optimal Clinical Safety'}
                </span>
              </div>

              <MotherSafetyScoreGauge 
                score={currentProfile.motherSafetyScore}
                riskLevel={currentProfile.highRiskCategory !== 'NONE' ? 'HIGH RISK' : 'OPTIMAL SAFETY'}
                preeclampsiaRisk={currentProfile.systolicBp > 140 ? "HIGH" : "LOW"}
                anemiaSeverity={currentProfile.hbLevel < 9 ? "MODERATE" : "NORMAL"}
              />

              <div className="grid grid-cols-3 gap-3 font-mono text-center pt-2">
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/90 shadow-inner">
                  <span className="text-[10px] text-slate-400 uppercase font-sans font-bold block">Blood Pressure</span>
                  <div className={`text-lg sm:text-xl font-black mt-1 ${currentProfile.systolicBp > 140 ? 'text-red-400 animate-pulse' : 'text-slate-200'}`}>
                    {currentProfile.systolicBp}/{currentProfile.diastolicBp}
                  </div>
                  <span className="text-[9px] text-slate-500 font-sans">mmHg (Last Checkup)</span>
                </div>

                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/90 shadow-inner">
                  <span className="text-[10px] text-slate-400 uppercase font-sans font-bold block">Hemoglobin</span>
                  <div className={`text-lg sm:text-xl font-black mt-1 ${currentProfile.hbLevel < 9 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {currentProfile.hbLevel}
                  </div>
                  <span className="text-[9px] text-slate-500 font-sans">g/dL (Normal &gt; 11.0)</span>
                </div>

                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/90 shadow-inner">
                  <span className="text-[10px] text-slate-400 uppercase font-sans font-bold block">Maternal Weight</span>
                  <div className="text-lg sm:text-xl font-black text-indigo-400 mt-1">
                    {currentProfile.weightKg} kg
                  </div>
                  <span className="text-[9px] text-slate-500 font-sans">+4.8 kg total gain</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/25 text-xs text-indigo-200 space-y-1 font-medium leading-relaxed">
                <p className="font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>AI Clinical Recommendation for {currentProfile.fullName}:</span>
                </p>
                <p>
                  Maintain low-sodium dietary habits and sleep primarily on your left side to maximize placento-fetal blood circulation. Continue daily Iron &amp; Calcium intake.
                </p>
              </div>
            </div>

            <div className="lg:col-span-5 bg-slate-900/95 p-6 rounded-3xl border border-slate-800 shadow-2xl space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                <h3 className="text-base font-black text-white flex items-center gap-2 border-b border-slate-800 pb-3.5">
                  <Phone className="w-5 h-5 text-cyan-400" />
                  <span>Assigned Government Care Team</span>
                </h3>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 shadow-md hover:border-emerald-500/40 transition">
                  <div className="flex items-center space-x-3.5">
                    <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-extrabold text-lg shrink-0 shadow-inner">
                      👩‍⚕️
                    </div>
                    <div>
                      <span className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-wide block">Village ASHA Supervisor</span>
                      <h4 className="text-sm font-black text-white leading-snug">{currentProfile.assignedAsha?.name || 'Manjula G.'}</h4>
                      <p className="text-xs font-mono text-slate-400">{currentProfile.assignedAsha?.phone || '+91 98450 11992'}</p>
                    </div>
                  </div>

                  <a 
                    href={`tel:${currentProfile.assignedAsha?.phone || '+919845011992'}`}
                    className="px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow-lg shadow-emerald-600/30 transition flex items-center gap-1.5 shrink-0 active:scale-95"
                  >
                    <Phone className="w-3.5 h-3.5 fill-white shrink-0" />
                    <span>Call ASHA</span>
                  </a>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 shadow-md hover:border-indigo-500/40 transition">
                  <div className="flex items-center space-x-3.5">
                    <div className="w-11 h-11 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 font-extrabold shrink-0 shadow-inner">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] font-extrabold text-indigo-300 uppercase tracking-wide block">Assigned PHC Clinic &amp; MO</span>
                      <h4 className="text-sm font-black text-white leading-snug">{currentProfile.assignedPhc?.name || 'Shiggaon PHC'}</h4>
                      <p className="text-xs text-slate-400 font-medium">Attending MO: {currentProfile.assignedPhc?.doctorName || 'Dr. Naveen Deshpande'}</p>
                      <p className="text-xs font-mono text-cyan-400">{currentProfile.assignedPhc?.phone || '+91 83 7822 1100'}</p>
                    </div>
                  </div>

                  <a 
                    href={`tel:${currentProfile.assignedPhc?.phone || '+918378221100'}`}
                    className="px-3.5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs rounded-xl shadow-lg shadow-indigo-600/25 transition flex items-center gap-1.5 shrink-0 active:scale-95"
                  >
                    <Phone className="w-3.5 h-3.5 fill-white shrink-0" />
                    <span>Call PHC</span>
                  </a>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/35 text-xs text-red-300 space-y-2 font-medium">
                <div className="flex items-center space-x-2 font-extrabold text-red-400 uppercase">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>Maternal Danger Warning Signs</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  If you experience blurred vision, sudden facial swelling, or severe abdominal pain, trigger the red <strong>SOS Distress Button</strong> immediately for zero-cost 108 Green Corridor transport!
                </p>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: INTERACTIVE AI MATERNAL CHATGPT Q&A ENGINE */}
        {activeTab === 'ai_chatgpt' && (
          <div className="bg-slate-900/95 border-2 border-purple-500/50 rounded-3xl p-6 shadow-2xl space-y-6 animate-fadeIn flex flex-col min-h-[620px] justify-between">
            <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-purple-600/40 animate-pulse shrink-0">
                  <Bot className="w-7 h-7" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-white tracking-tight flex items-center gap-2">
                    <span>JANANI360 Maternal AI Assistant (ChatGPT Q&amp;A Box)</span>
                    <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-black shadow-sm">
                      ● ACTIVE MEDICAL LLM
                    </span>
                  </h2>
                  <p className="text-xs text-slate-300 font-medium">
                    Ask any pregnancy question in natural language. Powered by WHO maternal protocols and synced directly with Lakshmi Devi's running medical records.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-purple-500/35 text-xs font-mono font-bold text-purple-300 self-start sm:self-auto">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0 animate-spin" />
                <span>Context: {currentProfile.fullName} (Hb: {currentProfile.hbLevel} g/dL)</span>
              </div>
            </div>

            {/* Chat Messages Conversation Feed */}
            <div className="space-y-4 overflow-y-auto max-h-[440px] px-2 py-2 custom-scrollbar flex-1">
              {chatMessages.map((msg) => {
                const isAi = msg.sender === 'ai';

                return (
                  <div key={msg.id} className={`flex items-start gap-3 ${isAi ? '' : 'justify-end'}`}>
                    {isAi && (
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-md">
                        <Bot className="w-5 h-5" />
                      </div>
                    )}

                    <div className={`max-w-3xl rounded-2xl p-4 sm:p-5 shadow-lg space-y-2 text-xs sm:text-sm font-medium leading-relaxed ${
                      isAi 
                        ? 'bg-slate-950 border border-purple-500/40 text-slate-100 rounded-tl-none' 
                        : 'bg-gradient-to-r from-purple-700 to-indigo-600 text-white rounded-tr-none font-bold'
                    }`}>
                      <div className="flex items-center justify-between gap-4 border-b border-slate-800/80 pb-1 text-[11px] opacity-80 font-sans font-bold">
                        <span>{isAi ? '🤖 JANANI360 Maternal AI Doctor' : `👤 ${currentProfile.fullName} & Family`}</span>
                        <span>{msg.timestamp}</span>
                      </div>

                      {/* Render formatted markdown response */}
                      <div className="whitespace-pre-line leading-normal space-y-2">
                        {msg.text}
                      </div>
                    </div>

                    {!isAi && (
                      <div className="w-10 h-10 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-rose-400 shrink-0 shadow-md font-black">
                        L
                      </div>
                    )}
                  </div>
                );
              })}

              {isAiTyping && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white shrink-0 animate-pulse">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div className="bg-slate-950 border border-purple-500/40 rounded-2xl rounded-tl-none p-4 text-xs font-extrabold text-purple-300 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce"></div>
                    <div className="w-2 h-2 rounded-full bg-pink-400 animate-bounce delay-100"></div>
                    <div className="w-2 h-2 rounded-full bg-amber-400 animate-bounce delay-200"></div>
                    <span>JANANI360 AI is analyzing your pregnancy vitals &amp; clinical obstetric protocols...</span>
                  </div>
                </div>
              )}

              <div ref={chatBottomRef} />
            </div>

            {/* Quick Prompt Suggestion Chips */}
            <div className="space-y-3 pt-3 border-t border-slate-800">
              <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-purple-300 uppercase tracking-wider">
                <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Frequently Asked Pregnancy Questions (Tap to Ask Instant AI Doctor):</span>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {[
                  'What foods should I eat to improve my iron & hemoglobin?',
                  'What is the safest sleeping posture in 3rd Trimester?',
                  'How many baby kicks should I count every day?',
                  'What are the true warning signs of childbirth labor starting?',
                  'What essential items should I pack in my hospital delivery bag?',
                  'Explain my Janani Suraksha Yojana (JSY) direct bank cash grants'
                ].map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendChat(chip)}
                    disabled={isAiTyping}
                    className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-purple-950/60 border border-slate-800 hover:border-purple-500/60 text-xs font-semibold text-slate-300 hover:text-white transition shadow-inner active:scale-95 text-left disabled:opacity-50"
                  >
                    💡 {chip}
                  </button>
                ))}
              </div>

              {/* Chat Input Bar */}
              <div className="flex items-center gap-3 pt-1">
                <input
                  type="text"
                  placeholder={`Ask anything about ${currentProfile.fullName}'s pregnancy, diet, baby growth, symptoms, or hospital birth plan...`}
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                  disabled={isAiTyping}
                  className="flex-1 bg-slate-950 border-2 border-slate-800 focus:border-purple-500 rounded-2xl px-5 py-3.5 text-xs sm:text-sm text-white placeholder-slate-500 font-medium focus:outline-none transition shadow-inner disabled:opacity-60"
                />
                <button
                  type="button"
                  onClick={() => handleSendChat()}
                  disabled={isAiTyping || !chatInput.trim()}
                  className="px-6 py-3.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-black text-xs sm:text-sm uppercase tracking-wider rounded-2xl shadow-xl shadow-purple-600/35 transition flex items-center gap-2 active:scale-95 shrink-0 disabled:opacity-50"
                >
                  <span>Send</span>
                  <Send className="w-4 h-4 text-white shrink-0" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ANC DOCTOR VISITS & BOOKING SCHEDULE */}
        {activeTab === 'anc_schedule' && (
          <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-black text-white flex items-center gap-2.5">
                  <Stethoscope className="w-6 h-6 text-indigo-400" />
                  <span>Mandatory Antenatal Care (ANC) Doctor Examination Passbook</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1 font-medium">
                  Track all 4 World Health Organization (WHO) &amp; NHM mandatory checkups. Clinical observations are verified by attending PHC Medical Officers.
                </p>
              </div>
              <button
                onClick={() => setShowBookingModal(true)}
                className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-indigo-500/30 transition flex items-center gap-2 self-start sm:self-auto active:scale-95"
              >
                <Calendar className="w-4 h-4 shrink-0" />
                <span>Book Next Checkup Slot</span>
              </button>
            </div>

            <div className="space-y-4">
              {[
                { visitNum: 1, name: '1st Trimester Early ANC Registration', date: '2026-02-14', hospital: currentProfile.assignedPhc.name, bp: '116/74 mmHg', hb: '12.6 g/dL', weight: '54 kg', status: 'COMPLETED & VERIFIED', notes: 'Pregnancy confirmed via urine hCG and ultrasound. IFA loading therapy initiated cleanly.' },
                { visitNum: 2, name: '2nd Trimester Anomaly Screening & Tetanus Booster', date: '2026-05-10', hospital: 'Haveri District Hospital HQ', bp: '118/76 mmHg', hb: '12.4 g/dL', weight: '56 kg', status: 'COMPLETED & VERIFIED', notes: 'Fetal anatomy morphology check clean. TT-2 Booster administered. Hemoglobin optimal; continue routine IFA therapy.' },
                { visitNum: 3, name: '3rd Trimester Gestational Evaluation & Partograph Prep', date: '2026-07-25', hospital: currentProfile.assignedPhc.name, bp: `${currentProfile.systolicBp}/${currentProfile.diastolicBp} mmHg`, hb: `${currentProfile.hbLevel} g/dL`, weight: `${currentProfile.weightKg} kg`, status: currentProfile.highRiskCategory !== 'NONE' ? 'ESCALATED FOR ER REVIEW' : 'COMPLETED & VERIFIED', notes: currentProfile.highRiskCategory !== 'NONE' ? 'Elevated blood pressure identified. Patient referred to Hospital Admin ER command suite under priority emergency protocol.' : 'Fetal head engagement proceeding normally. Institutional birth date scheduled at Shiggaon PHC labor ward.' },
                { visitNum: 4, name: 'Final Pre-Childbirth Institutional Delivery Exam', date: 'Scheduled: 2026-10-18', hospital: 'Haveri District Hospital Obstetrics Ward', bp: 'Pending Exam', hb: 'Pending Exam', weight: 'Pending', status: 'UPCOMING APPOINTMENT', notes: 'Final pelvic floor evaluation, blood compatibility cross-match, and labor room ward bed allocation confirmation.' },
              ].map((v, i) => {
                const isUpcoming = v.status === 'UPCOMING APPOINTMENT';
                const isEscalated = v.status.includes('ESCALATED');

                return (
                  <div key={i} className={`p-5 rounded-2xl border-2 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-5 ${
                    isUpcoming ? 'bg-slate-950/60 border-dashed border-slate-800 text-slate-400' :
                    isEscalated ? 'bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/40 border-amber-500/50' :
                    'bg-slate-950 border-slate-800/80 hover:border-indigo-500/40'
                  }`}>
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className={`px-2.5 py-1 rounded-lg font-mono font-extrabold text-xs shadow-sm ${
                          isUpcoming ? 'bg-slate-800 text-slate-300 border border-slate-700' : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/35'
                        }`}>
                          ANC VISIT #{v.visitNum}
                        </span>
                        <h4 className="text-sm sm:text-base font-black text-white">{v.name}</h4>
                        <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${
                          isUpcoming ? 'bg-blue-500/15 text-blue-300 border-blue-500/30' :
                          isEscalated ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse' :
                          'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        }`}>
                          {v.status}
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-slate-400 flex flex-wrap items-center gap-3">
                        <span>📅 Date: <strong className="text-white font-mono">{v.date}</strong></span>
                        <span className="text-slate-700">•</span>
                        <span>🏥 Clinic: <strong className="text-cyan-300">{v.hospital}</strong></span>
                      </div>
                      <p className="text-xs text-slate-300 italic pt-1 border-t border-slate-850">
                        "{v.notes}"
                      </p>
                    </div>

                    <div className="flex items-center gap-3 bg-slate-900/90 px-4 py-3 rounded-2xl border border-slate-800 w-full md:w-auto justify-around shrink-0 font-mono text-xs text-center shadow-inner">
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase font-sans font-bold block">Blood Pressure</span>
                        <strong className={isEscalated ? 'text-amber-400' : 'text-slate-200'}>{v.bp}</strong>
                      </div>
                      <div className="border-l border-slate-800 pl-3">
                        <span className="text-[10px] text-slate-500 uppercase font-sans font-bold block">Hemoglobin</span>
                        <strong className="text-emerald-400">{v.hb}</strong>
                      </div>
                      <div className="border-l border-slate-800 pl-3">
                        <span className="text-[10px] text-slate-500 uppercase font-sans font-bold block">Weight</span>
                        <strong className="text-indigo-400">{v.weight}</strong>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: DAILY SUPPLEMENTS ADHERENCE & AI TRIAGE CHECKER */}
        {activeTab === 'nutrition_ai' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            <div className="lg:col-span-6 bg-slate-900/95 p-6 rounded-3xl border border-slate-800 shadow-2xl space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="border-b border-slate-800 pb-3.5 flex items-center justify-between">
                  <h3 className="text-base font-black text-white flex items-center gap-2">
                    <Pill className="w-5 h-5 text-amber-400" />
                    <span>Daily Iron-Folic Acid (IFA) Adherence Tracker</span>
                  </h3>
                  <span className="text-xs font-mono font-black text-emerald-400 bg-emerald-500/15 px-3 py-1 rounded-full border border-emerald-500/35">
                    🔥 {adherenceStreak} Day Streak
                  </span>
                </div>

                <p className="text-xs text-slate-300 font-medium leading-relaxed">
                  To eliminate nutritional anemia and safeguard against maternal hemorrhage during labor, the National Health Mission mandates 180 consecutive daily IFA tables during pregnancy.
                </p>

                <div className="space-y-3 pt-2">
                  <div 
                    onClick={handleIfaToggle}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition flex items-center justify-between gap-4 shadow-lg ${
                      ifaTakenToday ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-300' : 'bg-slate-950 border-slate-800 hover:border-amber-500 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {ifaTakenToday ? <CheckSquare className="w-6 h-6 text-emerald-400 shrink-0" /> : <Square className="w-6 h-6 text-slate-500 shrink-0" />}
                      <div>
                        <span className="text-sm font-black text-white block">1 Iron &amp; Folic Acid (IFA - Red Tablet)</span>
                        <span className="text-xs text-slate-400">Take directly after midday lunch with citrus/lemon water</span>
                      </div>
                    </div>
                    <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-lg border ${
                      ifaTakenToday ? 'bg-emerald-500 text-slate-950 font-black' : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    }`}>
                      {ifaTakenToday ? '✓ DOSE RECORDED' : 'TAP TO RECORD DOSE'}
                    </span>
                  </div>

                  <div 
                    onClick={() => setCalciumTakenToday(!calciumTakenToday)}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition flex items-center justify-between gap-4 shadow-lg ${
                      calciumTakenToday ? 'bg-indigo-950/40 border-indigo-500/60 text-indigo-300' : 'bg-slate-950 border-slate-800 hover:border-indigo-500 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {calciumTakenToday ? <CheckSquare className="w-6 h-6 text-indigo-400 shrink-0" /> : <Square className="w-6 h-6 text-slate-500 shrink-0" />}
                      <div>
                        <span className="text-sm font-black text-white block">1 Calcium D3 &amp; Vitamin Supplement (White Tablet)</span>
                        <span className="text-xs text-slate-400">Take after morning breakfast (Separate from IFA by 3 hours)</span>
                      </div>
                    </div>
                    <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-lg border ${
                      calciumTakenToday ? 'bg-indigo-500 text-white font-black' : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}>
                      {calciumTakenToday ? '✓ DOSE RECORDED' : 'TAP TO RECORD DOSE'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-amber-300 flex items-center justify-between font-extrabold">
                <span>Total NHM Adherence Reward Points:</span>
                <span className="text-base font-mono font-black text-white">480 Points (₹240 Voucher Equivalent)</span>
              </div>
            </div>

            <div className="lg:col-span-6 bg-slate-900/95 p-6 rounded-3xl border border-slate-800 shadow-2xl space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="border-b border-slate-800 pb-3.5 flex items-center justify-between">
                  <h3 className="text-base font-black text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
                    <span>JANANI360 Clinical Symptom Self-Checker</span>
                  </h3>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/35">
                    INSTANT TRIAGE
                  </span>
                </div>

                <p className="text-xs text-slate-300 font-medium">
                  Select any bodily changes or symptoms you are experiencing today to receive instant clinical risk classification and guidance.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[220px] overflow-y-auto custom-scrollbar p-1">
                  {[
                    'Mild Morning Nausea / Vomiting',
                    'Severe Headache & Blurred Vision',
                    'Mild Ankle / Foot Swelling',
                    'Sudden Swelling of Face & Hands',
                    'Vaginal Bleeding',
                    'Decreased Fetal Movement',
                    'Mild Lower Back Aching',
                    'High Fever or Dizziness'
                  ].map((symptom, idx) => {
                    const isSelected = selectedSymptoms.includes(symptom);
                    const isDanger = ['Severe Headache & Blurred Vision', 'Sudden Swelling of Face & Hands', 'Vaginal Bleeding', 'Decreased Fetal Movement'].includes(symptom);

                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
                          } else {
                            setSelectedSymptoms([...selectedSymptoms, symptom]);
                          }
                        }}
                        className={`p-3 rounded-xl text-left text-xs font-bold transition flex items-center justify-between border ${
                          isSelected 
                            ? isDanger ? 'bg-red-500/30 border-red-500 text-white shadow-md' : 'bg-indigo-600/30 border-indigo-500 text-white shadow-md' 
                            : 'bg-slate-950 border-slate-800/80 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <span className="leading-tight">{symptom} {isDanger && '🚨'}</span>
                        {isSelected && <span className="text-[11px] text-emerald-400 font-black">✓</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-800/80">
                {aiDiagnosticReport ? (
                  <div className={`p-4 rounded-2xl border-2 font-medium text-xs leading-relaxed space-y-2 shadow-lg animate-fadeIn ${
                    aiDiagnosticReport.severity === 'EMERGENCY' ? 'bg-red-950/70 border-red-500/80 text-white' : 'bg-emerald-950/60 border-emerald-500/60 text-slate-100'
                  }`}>
                    <div className="font-black flex items-center justify-between text-sm uppercase tracking-tight">
                      <span>{aiDiagnosticReport.severity === 'EMERGENCY' ? '⚠️ High-Risk Emergency Triage Flagged' : '✓ Normal Trimester Symptoms'}</span>
                      <button onClick={() => setAiDiagnosticReport(null)} className="text-[11px] underline opacity-80">Reset</button>
                    </div>
                    <p>{aiDiagnosticReport.advice}</p>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleRunAiTriage}
                    className="w-full py-3 px-5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-xl shadow-indigo-600/30 transition flex items-center justify-center gap-2 active:scale-95"
                  >
                    <Sparkles className="w-4 h-4 shrink-0" />
                    <span>Run AI Clinical Diagnosis ({selectedSymptoms.length} Symptoms Selected)</span>
                  </button>
                )}
              </div>
            </div>

          </div>
        )}

        {/* TAB 5: SMART ID CARD, GOV DBT GRANTS & DIGITAL LOCKER */}
        {activeTab === 'smart_id_dbt' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            <div className="lg:col-span-5 bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 p-6 rounded-3xl border-2 border-emerald-500/40 shadow-2xl flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Award className="w-6 h-6 text-emerald-400 shrink-0" />
                    <div>
                      <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider block">Government of Karnataka</span>
                      <h3 className="text-sm font-black text-white">Smart Maternal RCH ID Card</h3>
                    </div>
                  </div>
                  <span className="text-[9px] font-extrabold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono">
                    ABDM VERIFIED
                  </span>
                </div>

                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-inner">
                  <div className="space-y-1.5 text-xs text-slate-300 w-full">
                    <div>Beneficiary: <strong className="text-base text-white block font-black">{currentProfile.fullName}</strong></div>
                    <div>National RCH ID: <strong className="text-emerald-400 font-mono">{currentProfile.rchId}</strong></div>
                    <div>ABHA Account: <strong className="text-cyan-300 font-mono">{currentProfile.abhaNumber}</strong></div>
                    <div>Blood Group: <strong className="text-rose-400 font-bold">{currentProfile.bloodGroup}</strong> · Age {currentProfile.age}</div>
                    <div>Village Block: <strong className="text-slate-200">{currentProfile.village} ({currentProfile.taluk})</strong></div>
                  </div>

                  <div className="shrink-0 flex flex-col items-center justify-center p-2 rounded-2xl bg-white/5 border border-slate-800 shadow-md">
                    <QrCodeGenerator 
                      value={`https://janani360.karnataka.gov.in/mother-profile/${currentProfile.rchId}`}
                      size={130}
                    />
                    <span className="text-[9px] font-mono font-bold text-slate-400 mt-2 block text-center">Scan for Real Telemetry</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-2 border-t border-slate-800">
                <button
                  onClick={() => alert(`📑 DOWNLOADING SMART HEALTH ID CARD (PDF)...\n\nGenerated high-resolution vector PDF for patient ${currentProfile.fullName}.\nContains QR barcode, emergency 108 contact matrix, and ABDM health locker credentials for offline hospital verification.`)}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-600/30 transition flex items-center justify-center gap-2 active:scale-95"
                >
                  <Download className="w-4 h-4 shrink-0" />
                  <span>Download Smart ID Card (PDF)</span>
                </button>
                <button
                  onClick={() => alert(`📲 SENDING SMARTER CARD LINK TO AADHAAR MOBILE...\n\nSMS digital wallet pass transmitted to ${currentProfile.mobile}.`)}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition flex items-center justify-center gap-2"
                >
                  <Share2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Share ID Card via WhatsApp</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-7 bg-slate-900/95 p-6 rounded-3xl border border-slate-800 shadow-2xl space-y-5">
              <div className="border-b border-slate-800 pb-3.5 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                    <span>Government Direct Benefit Transfer (DBT) Financial Ledger</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Janani Suraksha Yojana (JSY) &amp; Pradhan Mantri Matru Vandana Yojana (PMMVY) Bank Seeding.</p>
                </div>
                <span className="text-xs font-mono font-black text-white bg-emerald-500/20 border border-emerald-500/40 px-3 py-1 rounded-xl shadow-sm">
                  ₹6,000 Total Benefit
                </span>
              </div>

              <div className="space-y-3.5">
                {[
                  { scheme: 'PMMVY Installment 1 (Early ANC Registration)', amount: '₹3,000', status: 'CREDITED TO SBI ACCOUNT', date: 'Feb 20, 2026', ref: 'DBT-PMMVY-881204', desc: 'Disbursed cleanly upon verification of early 1st-trimester registration at Varthur PHC.' },
                  { scheme: 'PMMVY Installment 2 (Complete 4+ ANC & IFA Therapy)', amount: '₹2,000', status: 'READY FOR DISBURSAL', date: 'Pending Final ANC', ref: 'DBT-PMMVY-881944', desc: 'Will deposit automatically upon checkup clearance of ANC Visit #4.' },
                  { scheme: 'Janani Suraksha Yojana (JSY - Institutional Delivery Bonus)', amount: '₹1,000', status: 'RESERVED IN REGIONAL TREASURY', date: 'Upon Childbirth', ref: 'DBT-JSY-991204', desc: 'Direct reward for giving birth inside a recognized Government hospital or CHC under medical supervision.' },
                  ...(currentProfile.activeDhoEscalation ? [{
                    scheme: 'State CM Critical Care Emergency Relief Grant (DHO Authorized)', 
                    amount: '₹25,000', 
                    status: 'APPROVED & DISBURSED TO HOSPITAL', 
                    date: 'Today', 
                    ref: `DHO-GRANT-${currentProfile.activeDhoEscalation.id}`, 
                    desc: 'Specialized intensive care & emergency surgery override fund approved by District Health Officer.' 
                  }] : [])
                ].map((grant, i) => {
                  const isCredited = grant.status.includes('CREDITED') || grant.status.includes('APPROVED');

                  return (
                    <div key={i} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 hover:border-slate-700 transition shadow-sm">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-sm font-black text-white">{grant.scheme}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-mono font-black text-amber-400">{grant.amount}</span>
                          <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-md uppercase tracking-wide border ${
                            isCredited ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-black' : 'bg-slate-800 text-slate-300 border-slate-700'
                          }`}>
                            {grant.status}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-300 font-medium">{grant.desc}</p>
                      <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-1 border-t border-slate-850">
                        <span>Transaction Date: <strong className="text-slate-300">{grant.date}</strong></span>
                        <span>Reference ID: <strong className="text-cyan-400">{grant.ref}</strong></span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* TAB 6: FAMILY GUARDIAN PORTAL & INSTITUTIONAL BIRTH PREPAREDNESS PLAN */}
        {activeTab === 'family_guardians' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            <div className="lg:col-span-6 bg-slate-900/95 p-6 rounded-3xl border border-slate-800 shadow-2xl space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="border-b border-slate-800 pb-3.5 flex items-center justify-between">
                  <h3 className="text-base font-black text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-purple-400" />
                    <span>Designated Family Guardian Alert Roster</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowAddGuardian(!showAddGuardian)}
                    className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs rounded-xl transition flex items-center gap-1 shadow-md active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Guardian</span>
                  </button>
                </div>

                <p className="text-xs text-slate-300 font-medium leading-relaxed">
                  Designated guardians receive automated real-time GPS tracking SMS alerts whenever a 108 emergency ambulance or high-risk hospital referral is dispatched.
                </p>

                {showAddGuardian && (
                  <form onSubmit={handleAddGuardian} className="bg-slate-950 p-4 rounded-2xl border-2 border-purple-500/40 space-y-3 shadow-inner animate-fadeIn">
                    <div className="text-xs font-bold text-purple-300 uppercase">Link New Family Emergency Guardian</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <input
                        type="text"
                        placeholder="Guardian Full Name"
                        value={newGuardianName}
                        onChange={(e) => setNewGuardianName(e.target.value)}
                        className="bg-slate-900 border border-slate-800 text-xs text-white rounded-xl px-3 py-2 focus:outline-none focus:border-purple-500"
                        required
                      />
                      <input
                        type="tel"
                        placeholder="Mobile Number (+91...)"
                        value={newGuardianPhone}
                        onChange={(e) => setNewGuardianPhone(e.target.value)}
                        className="bg-slate-900 border border-slate-800 text-xs text-white rounded-xl px-3 py-2 focus:outline-none focus:border-purple-500"
                        required
                      />
                    </div>
                    <select
                      value={newGuardianRelation}
                      onChange={(e) => setNewGuardianRelation(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 text-xs font-bold text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-purple-500"
                    >
                      <option value="Husband / Spouse">Husband / Spouse</option>
                      <option value="Mother / Mother-in-Law">Mother / Mother-in-Law</option>
                      <option value="Brother / Sister">Brother / Sister</option>
                      <option value="Village Neighbor / Caretaker">Village Neighbor / Caretaker</option>
                    </select>
                    <div className="flex gap-2 pt-1">
                      <button type="submit" className="flex-1 py-2 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-black text-xs rounded-xl shadow-md">
                        Save &amp; Activate SMS Alerts
                      </button>
                      <button type="button" onClick={() => setShowAddGuardian(false)} className="px-4 py-2 bg-slate-800 text-slate-300 font-bold text-xs rounded-xl">
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                <div className="space-y-3">
                  {guardians.map((g, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 shadow-sm">
                      <div>
                        <span className="text-sm font-black text-white block">{g.name}</span>
                        <span className="text-xs text-purple-300 font-semibold">{g.relation}</span>
                        <p className="text-xs font-mono text-slate-400 mt-0.5">{g.mobile}</p>
                      </div>
                      <div className="text-right flex flex-col items-end gap-1.5">
                        <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/35 text-[10px] font-extrabold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>SMS ALERTS ACTIVE</span>
                        </span>
                        <a href={`tel:${g.mobile}`} className="text-xs text-cyan-400 font-bold hover:underline flex items-center gap-1">
                          <Phone className="w-3 h-3" /> Call Guardian
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 bg-slate-900/95 p-6 rounded-3xl border border-slate-800 shadow-2xl space-y-5">
              <div className="border-b border-slate-800 pb-3.5 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-white flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    <span>Institutional Birth Preparedness &amp; Newborn Plan</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Zero-delay hospital childbirth operational checklist.</p>
                </div>
                <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded bg-emerald-500 text-slate-950">
                  100% READY
                </span>
              </div>

              <div className="space-y-3.5 text-xs text-slate-300">
                {[
                  { title: '1. Verified Medical Birth Institution', detail: 'Haveri District Hospital Obstetric Surgery & Labor Ward (Level-3 Care facility with round-the-clock NICU & Blood Depot).', status: 'WARD CONFIRMED' },
                  { title: '2. Zero-Cost 108 Emergency Transport Link', detail: 'Primary driver Ramesh K. (+91 98450 88108) put on automated notification rotation for Shiggaon & Somwarpet sector.', status: 'GPS LOCKED' },
                  { title: '3. Hospital Bag & Maternity Passbook Readiness', detail: 'Pack official Smart ID QR card, Aadhaar copy, clean cotton clothing for baby, and sterilized sanitary pads 2 weeks prior to EDD.', status: 'PACKED & CHECKED' },
                  { title: '4. Immediate Newborn Immunization Schedule', detail: 'BCG Tuberculosis vaccine, Oral Polio Vaccine (OPV-0), and Hepatitis B Birth Dose scheduled for administration within 24 hours of hospital delivery.', status: 'VACCINES RESERVED' }
                ].map((item, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-slate-950 border border-slate-800/90 space-y-1.5 shadow-inner">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-black text-white">{item.title}</span>
                      <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                        ✓ {item.status}
                      </span>
                    </div>
                    <p className="text-slate-300 font-medium leading-relaxed">{item.detail}</p>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => alert(`📑 DOWNLOADING INSTITUTIONAL BIRTH PREPAREDNESS DOSSIER...\n\nContains complete emergency transit routing instructions, Hospital Admin labor room token, and pediatric vaccination schedule.`)}
                  className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-black text-xs uppercase tracking-wider rounded-xl border border-slate-700 transition flex items-center justify-center gap-2 active:scale-95"
                >
                  <FileText className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Download Complete Childbirth &amp; Vaccination Plan (PDF)</span>
                </button>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* ANC BOOKING MODAL */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-indigo-500/50 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 relative">
            <button
              onClick={() => setShowBookingModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white transition"
            >
              ✕
            </button>
            
            <div className="flex items-center gap-3 border-b border-slate-800 pb-3.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/40 flex items-center justify-center font-bold">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-black text-white">Book Antenatal Checkup Slot</h3>
                <p className="text-xs text-slate-400">Ayushman Bharat Instant Clinic Reservation</p>
              </div>
            </div>

            <div className="space-y-4 text-xs font-medium text-slate-300">
              <div>
                <label className="block text-slate-400 text-[11px] font-bold uppercase mb-1">Beneficiary Name</label>
                <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 font-bold text-white">
                  {currentProfile.fullName} ({currentProfile.ancNumber})
                </div>
              </div>

              <div>
                <label className="block text-slate-400 text-[11px] font-bold uppercase mb-1">Select Medical Facility</label>
                <select
                  value={selectedHospitalForBooking}
                  onChange={(e) => setSelectedHospitalForBooking(e.target.value)}
                  className="w-full p-3 bg-slate-950 rounded-xl border border-slate-800 text-white font-bold focus:outline-none focus:border-indigo-500 transition"
                >
                  <option value="Shiggaon Primary Health Centre (PHC)">Shiggaon Primary Health Centre (PHC)</option>
                  <option value="Varthur Primary Health Centre (PHC)">Varthur Primary Health Centre (PHC)</option>
                  <option value="Hoskote Primary Health Centre (PHC)">Hoskote Primary Health Centre (PHC)</option>
                  <option value="Haveri District Hospital Obstetrics HQ">Haveri District Hospital Obstetrics HQ</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 text-[11px] font-bold uppercase mb-1">Preferred Time Slot</label>
                <div className="grid grid-cols-2 gap-2 text-center font-bold">
                  <div className="p-2.5 bg-indigo-600/20 border border-indigo-500 rounded-xl text-indigo-300 cursor-pointer">
                    Tomorrow, 09:30 AM (Morning)
                  </div>
                  <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-400 hover:border-slate-700 cursor-pointer">
                    Tomorrow, 02:00 PM (Afternoon)
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed italic">
                Note: Upon confirmation, an automated appointment reminder and priority queue token will be forwarded to your ASHA supervisor ({currentProfile.assignedAsha.name}).
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={handleConfirmAppointment}
                className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg active:scale-95 transition"
              >
                Confirm Appointment Slot
              </button>
              <button
                type="button"
                onClick={() => setShowBookingModal(false)}
                className="px-4 py-3 bg-slate-800 text-slate-300 font-bold text-xs rounded-xl transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
