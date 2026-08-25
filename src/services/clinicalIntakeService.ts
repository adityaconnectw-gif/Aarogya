/**
 * Clinical Intake Service - Question Ontologies & Clinical Logic
 * 
 * Provides guided non-chatbot clinical intake questionnaires, adaptive branching,
 * Review of Systems (ROS), AYUSH Dashavidha Pariksha, and Red-Flag Emergency detection.
 */

export interface TapChoice {
  label: string;
  labelHindi?: string;
  value: string;
  isRedFlagTrigger?: boolean;
}

export interface ReviewOfSystemsCategory {
  id: string;
  title: string;
  iconName: string;
  symptoms: Array<{ id: string; label: string; isRedFlag?: boolean }>;
}

export const REVIEW_OF_SYSTEMS: ReviewOfSystemsCategory[] = [
  {
    id: 'general',
    title: 'General & Constitutional',
    iconName: 'Activity',
    symptoms: [
      { id: 'fever', label: 'Unexplained Fever / Chills' },
      { id: 'fatigue', label: 'Significant Fatigue / Weakness' },
      { id: 'weight-loss', label: 'Unintended Weight Loss' },
      { id: 'night-sweats', label: 'Drenching Night Sweats' },
    ],
  },
  {
    id: 'cardiovascular',
    title: 'Cardiovascular',
    iconName: 'Heart',
    symptoms: [
      { id: 'chest-pain', label: 'Chest Pressure / Tightness', isRedFlag: true },
      { id: 'palpitations', label: 'Rapid / Irregular Heartbeats (Palpitations)' },
      { id: 'ankle-edema', label: 'Swelling in Feet or Ankles' },
      { id: 'orthopnea', label: 'Difficulty Breathing Lying Flat' },
    ],
  },
  {
    id: 'respiratory',
    title: 'Respiratory',
    iconName: 'Thermometer',
    symptoms: [
      { id: 'dyspnea', label: 'Shortness of Breath on Exertion', isRedFlag: true },
      { id: 'cough', label: 'Persistent Cough (> 2 weeks)' },
      { id: 'hemoptysis', label: 'Coughing up Blood', isRedFlag: true },
      { id: 'wheezing', label: 'Audible Wheezing / Stridor' },
    ],
  },
  {
    id: 'gastrointestinal',
    title: 'Gastrointestinal',
    iconName: 'Stethoscope',
    symptoms: [
      { id: 'abd-pain', label: 'Severe Abdominal Pain' },
      { id: 'nausea-vomit', label: 'Persistent Nausea / Vomiting' },
      { id: 'dysphagia', label: 'Difficulty Swallowing Food' },
      { id: 'gi-bleeding', label: 'Dark / Tarry Black Stools', isRedFlag: true },
    ],
  },
  {
    id: 'neurological',
    title: 'Neurological',
    iconName: 'ShieldAlert',
    symptoms: [
      { id: 'weakness', label: 'Sudden Facial or Limb Weakness', isRedFlag: true },
      { id: 'speech-slur', label: 'Slurred Speech / Confusion', isRedFlag: true },
      { id: 'headache', label: 'Severe "Thunderclap" Headache', isRedFlag: true },
      { id: 'syncope', label: 'Fainting / Loss of Consciousness', isRedFlag: true },
    ],
  },
  {
    id: 'musculoskeletal',
    title: 'Musculoskeletal',
    iconName: 'Shield',
    symptoms: [
      { id: 'joint-pain', label: 'Joint Pain & Swelling' },
      { id: 'morning-stiffness', label: 'Morning Stiffness (> 30 mins)' },
      { id: 'back-pain', label: 'Lower Back Pain with Leg Radiation' },
    ],
  },
];

export interface FullIntakeRecord {
  // 1. Identify
  patientId: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  abhaId: string;
  language: string;

  // 2. Consent
  consentGranted: boolean;
  consentTimestamp: string;

  // 3. Clinical Intake
  intakeMode: 'allopathic' | 'ayush';
  chiefComplaint: string;
  chiefComplaintOther?: string;
  severity: number;
  hpi: {
    site: string;
    onset: string;
    character: string;
    radiation: string;
    aggravating: string;
    relieving: string;
    duration: string;
    patientNarrative: string;
  };
  pastMedicalHistory: string[];
  pastSurgicalHistory: string[];
  currentMedications: string[];
  allergies: string[];
  familyHistory: string[];
  lifestyle: {
    smoking: 'Never' | 'Former' | 'Current';
    alcohol: 'Non-drinker' | 'Occasional' | 'Regular';
    exercise: 'Sedentary' | 'Moderate' | 'Active';
    diet: 'Vegetarian' | 'Non-Vegetarian' | 'Vegan' | 'Ayurvedic Sattvic';
  };
  reviewOfSystems: string[];

  // AYUSH Assessment
  ayush?: {
    prakriti: string;
    vikriti: string;
    sara: string;
    samhanana: string;
    pramana: string;
    satmya: string;
    sattva: string;
    aharaShakti: string;
    vyayamaShakti: string;
    vaya: string;
    aharaVihara: string;
  };

  // Red Flags
  isRedFlagTriggered: boolean;
  redFlagDetails: string[];

  // 4. Documents & OCR
  scannedDocuments: any[];

  // Status
  status: 'Draft' | 'Submitted' | 'Reviewed by Doctor';
}

/**
 * Checks clinical red flags based on selected symptoms and vital parameters.
 */
export function evaluateRedFlags(intake: Partial<FullIntakeRecord>): { isRedFlag: boolean; reasons: string[] } {
  const reasons: string[] = [];

  const cc = (intake.chiefComplaint || '').toLowerCase();
  const char = (intake.hpi?.character || '').toLowerCase();
  const rad = (intake.hpi?.radiation || '').toLowerCase();
  const sev = intake.severity || 0;
  const ros = intake.reviewOfSystems || [];

  if (cc.includes('chest') && (rad.includes('arm') || char.includes('crush') || sev >= 8)) {
    reasons.push('Acute Chest Discomfort with radiation/crushing quality (Suspected Acute Coronary Syndrome).');
  }

  if (ros.includes('weakness') || ros.includes('speech-slur')) {
    reasons.push('Sudden neurological weakness or slurred speech (Suspected Cerebrovascular Event / Stroke).');
  }

  if (ros.includes('dyspnea') && sev >= 8) {
    reasons.push('Severe acute breathlessness (Respiratory Compromise).');
  }

  if (ros.includes('hemoptysis')) {
    reasons.push('Active hemoptysis (coughing blood) requires urgent physician review.');
  }

  return {
    isRedFlag: reasons.length > 0,
    reasons,
  };
}

/**
 * Generates an institutional clinical history summary for physician review.
 */
export function generateClinicalHistorySummary(data: FullIntakeRecord): string {
  let text = '';
  if (data.isRedFlagTriggered) {
    text += `*** 🚨 URGENT MEDICAL TRIAGE ALERT ***\n`;
    text += `Red Flag Triggers: ${data.redFlagDetails.join(' | ')}\n`;
    text += `Priority status assigned for immediate clinician assessment.\n\n`;
  }

  text += `PATIENT CLINICAL INTAKE SUMMARY (AAROGYAM EMR DRAFT)\n`;
  text += `============================================================\n`;
  text += `Patient: ${data.name} | ID: ${data.patientId} | ABHA: ${data.abhaId}\n`;
  text += `Age/Sex: ${data.age}Y/${data.gender} | Language: ${data.language}\n`;
  text += `Intake Framework: ${data.intakeMode === 'ayush' ? 'AYUSH / Ayurvedic Dashavidha' : 'Standard Allopathic Clinical'}\n`;
  text += `Consent: Verified under DPDP Act 2023 (${data.consentTimestamp})\n\n`;

  text += `1. CHIEF COMPLAINT:\n`;
  text += `• ${data.chiefComplaint}${data.chiefComplaintOther ? ` (${data.chiefComplaintOther})` : ''} — Severity ${data.severity}/10\n\n`;

  text += `2. HISTORY OF PRESENT ILLNESS (HPI):\n`;
  text += `• Site: ${data.hpi.site || 'Not localized'}\n`;
  text += `• Onset / Duration: ${data.hpi.onset || 'Not specified'} (${data.hpi.duration || '3 days'})\n`;
  text += `• Character: ${data.hpi.character || 'Not specified'}\n`;
  text += `• Radiation: ${data.hpi.radiation || 'None'}\n`;
  text += `• Aggravating Factors: ${data.hpi.aggravating || 'None reported'}\n`;
  text += `• Relieving Factors: ${data.hpi.relieving || 'None reported'}\n`;
  if (data.hpi.patientNarrative) {
    text += `• Patient Narration: "${data.hpi.patientNarrative}"\n`;
  }
  text += `\n`;

  text += `3. PAST MEDICAL & SURGICAL HISTORY:\n`;
  text += `• Medical Conditions: ${data.pastMedicalHistory.length > 0 ? data.pastMedicalHistory.join(', ') : 'None reported'}\n`;
  text += `• Surgical Interventions: ${data.pastSurgicalHistory.length > 0 ? data.pastSurgicalHistory.join(', ') : 'No prior surgeries'}\n\n`;

  text += `4. CURRENT MEDICATIONS & DRUG ALLERGIES:\n`;
  text += `• Active Prescriptions: ${data.currentMedications.length > 0 ? data.currentMedications.join('; ') : 'No active drugs'}\n`;
  text += `• Confirmed Allergies: ${data.allergies.length > 0 ? data.allergies.join(', ') : 'No known drug allergies (NKDA)'}\n\n`;

  text += `5. FAMILY & PERSONAL/LIFESTYLE HISTORY:\n`;
  text += `• Family History: ${data.familyHistory.length > 0 ? data.familyHistory.join(', ') : 'Non-contributory'}\n`;
  text += `• Lifestyle: Diet: ${data.lifestyle.diet} | Smoking: ${data.lifestyle.smoking} | Alcohol: ${data.lifestyle.alcohol} | Activity: ${data.lifestyle.exercise}\n\n`;

  text += `6. REVIEW OF SYSTEMS (ROS):\n`;
  text += `• Positive Symptoms: ${data.reviewOfSystems.length > 0 ? data.reviewOfSystems.join(', ') : 'All other systems unremarkable'}\n\n`;

  if (data.intakeMode === 'ayush' && data.ayush) {
    text += `7. AYUSH DASHAVIDHA & ASHTAVIDHA PARIKSHA:\n`;
    text += `• Deha Prakriti: ${data.ayush.prakriti} | Vikriti: ${data.ayush.vikriti}\n`;
    text += `• Jatharagni: ${data.ayush.aharaShakti} | Satmya/Sattva: ${data.ayush.satmya} / ${data.ayush.sattva}\n`;
    text += `• Ahara-Vihara Lifestyle: ${data.ayush.aharaVihara || 'Standard'}\n\n`;
  }

  text += `8. PRIOR MEDICAL DOCUMENTS & OCR RECORD SYNC:\n`;
  if (data.scannedDocuments.length === 0) {
    text += `• No prior physical records uploaded in this session.\n`;
  } else {
    data.scannedDocuments.forEach((doc, idx) => {
      text += `[Record ${idx + 1}] ${doc.documentTitle} (${doc.documentDate}, ${doc.issuingFacility}):\n`;
      if (doc.diagnoses && doc.diagnoses.length > 0) {
        text += `  - Diagnoses: ${doc.diagnoses.map((d: any) => d.condition).join(', ')}\n`;
      }
      if (doc.medications && doc.medications.length > 0) {
        text += `  - Prescriptions: ${doc.medications.map((m: any) => `${m.medicineName} (${m.dosage} ${m.frequency})`).join('; ')}\n`;
      }
      if (doc.investigations && doc.investigations.length > 0) {
        text += `  - Investigations: ${doc.investigations.map((i: any) => `${i.testName}: ${i.resultValue} ${i.unit} [${i.flag.toUpperCase()}]`).join('; ')}\n`;
      }
    });
  }

  return text;
}
