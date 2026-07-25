from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List
import math

app = FastAPI(
    title="JANANI360 AI Microservice",
    description="Maternal & Child Clinical Risk Stratification Engine for Karnataka Public Health",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class VitalsPayload(BaseModel):
    systolic_bp: int = Field(..., example=140, description="Systolic Blood Pressure (mmHg)")
    diastolic_bp: int = Field(..., example=90, description="Diastolic Blood Pressure (mmHg)")
    hb_level: float = Field(..., example=9.5, description="Hemoglobin (g/dL)")
    weight_kg: float = Field(..., example=55.0, description="Mother Weight (kg)")
    gestational_age_weeks: int = Field(..., example=28, description="Gestational Age in Weeks")
    random_blood_sugar: Optional[float] = Field(100.0, description="Random Blood Sugar (mg/dL)")
    urine_protein: Optional[str] = Field("Nil", description="Urine Protein (+1, +2, +3, Nil)")
    parity: Optional[int] = Field(1, description="Parity Count")
    age: Optional[int] = Field(26, description="Mother Age")

class RiskAssessmentResponse(BaseModel):
    mother_safety_score: int
    risk_level: str  # LOW, MODERATE, HIGH, CRITICAL
    preeclampsia_risk: str # LOW, MODERATE, HIGH
    anemia_severity: str # NORMAL, MILD, MODERATE, SEVERE
    malnutrition_risk: str # NORMAL, AT_RISK, SEVERE
    clinical_recommendations: List[str]
    referral_recommended: bool
    target_facility_type: str

@app.get("/health")
def health_check():
    return {"status": "HEALTHY", "engine": "JANANI360 FastAPI Risk Predictor", "version": "1.0.0"}

@app.post("/api/v1/predict-risk", response_model=RiskAssessmentResponse)
def predict_risk(payload: VitalsPayload):
    try:
        # 1. Anemia Severity Classification (WHO Guidelines)
        hb = payload.hb_level
        if hb >= 11.0:
            anemia = "NORMAL"
            anemia_deduction = 0
        elif hb >= 10.0:
            anemia = "MILD"
            anemia_deduction = 15
        elif hb >= 7.0:
            anemia = "MODERATE"
            anemia_deduction = 35
        else:
            anemia = "SEVERE"
            anemia_deduction = 60

        # 2. Preeclampsia Risk Engine
        sys = payload.systolic_bp
        dia = payload.diastolic_bp
        protein = payload.urine_protein

        if sys >= 160 or dia >= 110 or protein in ["+2", "+3"]:
            preeclampsia = "HIGH"
            preeclampsia_deduction = 50
        elif sys >= 140 or dia >= 90 or protein == "+1":
            preeclampsia = "MODERATE"
            preeclampsia_deduction = 25
        else:
            preeclampsia = "LOW"
            preeclampsia_deduction = 0

        # 3. Malnutrition & Weight Tracking
        weight = payload.weight_kg
        if weight < 45.0:
            malnutrition = "SEVERE"
            malnutrition_deduction = 20
        elif weight < 50.0:
            malnutrition = "AT_RISK"
            malnutrition_deduction = 10
        else:
            malnutrition = "NORMAL"
            malnutrition_deduction = 0

        # 4. Mother Safety Score Calculation (Base 100)
        total_deduction = anemia_deduction + preeclampsia_deduction + malnutrition_deduction
        safety_score = max(5, 100 - total_deduction)

        # 5. Risk Categorization & Clinical Recommendations
        recommendations = []
        referral_required = False
        facility = "PHC"

        if safety_score >= 80:
            risk_level = "LOW"
            recommendations.append("Continue routine ANC visits at PHC Sub-Center every 4 weeks.")
            recommendations.append("Prescribe standard Iron & Folic Acid (IFA) supplements.")
        elif safety_score >= 60:
            risk_level = "MODERATE"
            recommendations.append("Schedule bi-weekly PHC Doctor consultation.")
            recommendations.append("Monitor blood pressure and urine protein weekly at local PHC.")
            recommendations.append("Administer double-dose IFA supplementation.")
        elif safety_score >= 40:
            risk_level = "HIGH"
            recommendations.append("IMMEDIATE REFERRAL: Transfer patient to District Hospital (CHC/SDH).")
            recommendations.append("Administer initial dose of Labetalol for hypertension control.")
            recommendations.append("Initiate injectable Iron Sucrose therapy for anemia.")
            referral_required = True
            facility = "DISTRICT_HOSPITAL"
        else:
            risk_level = "CRITICAL"
            recommendations.append("EMERGENCY OBSTETRIC REFERRAL: Transfer to Victoria Tertiary Hospital / Medical College.")
            recommendations.append("Administer Magnesium Sulfate prophylactic protocol for Eclampsia.")
            recommendations.append("Alert Emergency Transport Ambulance (108).")
            referral_required = True
            facility = "TERTIARY_MEDICAL_COLLEGE"

        return RiskAssessmentResponse(
            mother_safety_score=safety_score,
            risk_level=risk_level,
            preeclampsia_risk=preeclampsia,
            anemia_severity=anemia,
            malnutrition_risk=malnutrition,
            clinical_recommendations=recommendations,
            referral_recommended=referral_required,
            target_facility_type=facility
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
