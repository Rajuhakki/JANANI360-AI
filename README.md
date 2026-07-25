# JANANI360-AI

> **Autonomous AI-Driven Public Health Operating System for Maternal, Neonatal & Pediatric Care**

Official repository for **JANANI360 AI**, a government-grade digital health platform engineered to reduce Maternal Mortality Ratio (MMR) and Infant Mortality Rate (IMR) through real-time predictive clinical decision support, WHO partograph intrapartum monitoring, automated 108 emergency referral telemetry, and multilingual frontline accessibility.

---

## 🌟 Key Features

- **🌐 Global Multilingual Architecture**: Full support for 9 languages including English, Kannada (ಕನ್ನಡ), Hindi (हिन्दी), Tamil (தமிழ்), Telugu (తెలుగు), Marathi (मराठी), Arabic (العربية - RTL), Spanish (Español), and French (Français) with instant zero-reload switching and `localStorage` persistence.
- **🏥 Role-Based Persona Portals**: Dedicated dashboards for ASHA Facilitators, PHC Medical Officers, Hospital Administrators, District Health Officers (DHO), and Pregnant Mothers & Families.
- **⚡ Zero-Delay Emergency Protocol**: Automated 108 ambulance dispatch, ICU bed reservation, and casualty emergency room pre-notifications for high-risk maternal cases.
- **🩺 Clinical Decision Support System (CDSS)**: Explainable AI risk stratification for Severe Pre-Eclampsia, Postpartum Hemorrhage (PPH) shock index, and Fetal Heart Rate (FHR) distress based on ICMR & WHO clinical guidelines.
- **👶 Child Health & Immunization Hub**: Vaccination schedule alerts, WHO growth curve tracking, and SAM/MAM malnutrition early detection up to 5 years.
- **🔒 Public Health Security Standards**: ABDM (Ayushman Bharat Digital Mission) compliance, ABHA Health ID generation, and DISHA data privacy encryption.

---

## 📂 Project Architecture

```
JANANI360-AI/
├── apps/
│   ├── frontend/         # React + Vite + Redux Toolkit + i18next + TailwindCSS
│   │   ├── src/
│   │   │   ├── components/   # Government Header, Hero, LanguageSelector, Modals
│   │   │   ├── i18n/         # i18next configuration & 9 locale dictionaries
│   │   │   ├── pages/        # Dashboard, Mother Profile, ER Radar, Labor Ward, DHO
│   │   │   └── store/        # Redux slices (auth, maternal, referrals, labor, child)
│   │   └── public/images/    # High-resolution clinical photography
│   │
│   ├── backend/          # Node.js + Express + Socket.IO + Prisma / MongoDB
│   │   └── src/              # REST API controllers, WebSocket events, seed data
│   │
│   └── ai-service/       # Python + FastAPI / Clinical AI CDSS Engine
│       └── main.py           # Risk calculation & explainable medical rationales
└── README.md
```

---

## 🚀 Quick Start & Installation

### Prerequisites
- **Node.js**: `v18.x` or higher
- **npm**: `v9.x` or higher
- **Python**: `3.10+` (for AI Service)

### 1. Frontend Setup
```bash
cd apps/frontend
npm install
npm run dev
```
Open `http://localhost:5173/` in your browser.

### 2. Backend Setup
```bash
cd apps/backend
npm install
npm run dev
```
Backend server starts on `http://localhost:5000/`.

### 3. AI Service Setup
```bash
cd apps/ai-service
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python main.py
```

---

## 🌐 Supported Languages & i18n

| Language | Native Name | Code | Direction |
| :--- | :--- | :--- | :--- |
| English | English | `en` | LTR |
| Kannada | ಕನ್ನಡ | `kn` | LTR |
| Hindi | हिन्दी | `hi` | LTR |
| Tamil | தமிழ் | `ta` | LTR |
| Telugu | తెలుగు | `te` | LTR |
| Marathi | मराठी | `mr` | LTR |
| Arabic | العربية | `ar` | RTL |
| Spanish | Español | `es` | LTR |
| French | Français | `fr` | LTR |

---

## 📜 License

Copyright © 2026 Government of Karnataka - Department of Health & Family Welfare.  
JANANI360 AI Platform. All rights reserved.
# JANANI360-AI
