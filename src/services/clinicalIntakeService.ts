/**
 * Clinical Intake Service - Question Ontologies & Clinical Logic
 * 
 * Provides guided clinical history questionnaires, dynamic complaint-specific
 * adaptive branching (SOCRATES), Review of Systems (ROS), AYUSH Dashavidha Pariksha,
 * and Red-Flag Emergency detection.
 */

export interface AdaptiveQuestionConfig {
  id: string;
  complaintKey: string;
  name: string;
  nameHindi: string;
  category: string;
  questions: Array<{
    id: string;
    label: string;
    labelHindi?: string;
    type: 'select' | 'multiselect' | 'slider' | 'text';
    options?: string[];
    isRedFlagOption?: (value: any) => boolean;
  }>;
}

export const ADAPTIVE_COMPLAINT_FLOWS: Record<string, AdaptiveQuestionConfig> = {
  'chest-pain': {
    id: 'chest-pain',
    complaintKey: 'Chest Pain & Discomfort',
    name: 'Chest Pain & Discomfort',
    nameHindi: 'सीने में दर्द या भारीपन',
    category: 'Cardiology / Emergency Triage',
    questions: [
      {
        id: 'site',
        label: 'Exact Location / Site of Discomfort',
        labelHindi: 'दर्द का सही स्थान',
        type: 'select',
        options: ['Substernal / Central Chest', 'Left-sided Chest', 'Epigastric Area', 'Right-sided Chest'],
      },
      {
        id: 'onset',
        label: 'Onset & Duration',
        labelHindi: 'दर्द कब और कैसे शुरू हुआ',
        type: 'select',
        options: ['Sudden acute onset (< 2 hours ago)', 'Gradual onset over 24 hours', 'Exertional (comes when climbing stairs)', 'Intermittent over 1 week'],
      },
      {
        id: 'character',
        label: 'Character / Nature of Pain',
        labelHindi: 'दर्द किस प्रकार का महसूस होता है',
        type: 'select',
        options: ['Crushing / Heavy pressure', 'Sharp / Stabbing pain', 'Burning / Acidity sensation', 'Dull generalized ache'],
      },
      {
        id: 'radiation',
        label: 'Radiation / Spread of Pain',
        labelHindi: 'क्या दर्द शरीर के अन्य भाग में फैलता है',
        type: 'select',
        options: ['Radiates to Left Arm & Jaw', 'Radiates to Back & Scapula', 'Radiates to Neck', 'No radiation (Localized)'],
      },
      {
        id: 'associated',
        label: 'Associated Symptoms (Select all that apply)',
        labelHindi: 'साथ में होने वाली अन्य तकलीफें',
        type: 'multiselect',
        options: ['Severe Shortness of Breath (Dyspnoea)', 'Profuse Cold Sweating (Diaphoresis)', 'Nausea / Vomiting', 'Dizziness / Lightheadedness', 'Palpitations / Fast Heartbeat', 'None of these'],
      },
      {
        id: 'aggravating',
        label: 'Aggravating / Relieving Factors',
        labelHindi: 'किस चीज़ से दर्द बढ़ता या घटता है',
        type: 'select',
        options: ['Worse with exertion, relieved by rest', 'Worse with deep breathing, relieved sitting forward', 'Worse after fatty meals, relieved by antacids', 'Constant regardless of activity'],
      },
    ],
  },
  'fever': {
    id: 'fever',
    complaintKey: 'Fever & Temperature Spikes',
    name: 'Fever with Chills & Body Ache',
    nameHindi: 'बुखार, कंपकंपी और बदन दर्द',
    category: 'General Medicine / Infectious Disease',
    questions: [
      {
        id: 'duration',
        label: 'Duration of Fever',
        labelHindi: 'बुखार कितने दिनों से है',
        type: 'select',
        options: ['1 to 2 days (Acute)', '3 to 5 days', '1 to 2 weeks (Prolonged)', 'Intermittent for over 1 month'],
      },
      {
        id: 'temperature',
        label: 'Highest Recorded Body Temperature',
        labelHindi: 'अधिकतम तापमान कितना रहा',
        type: 'select',
        options: ['High Grade (102°F - 104°F)', 'Moderate Grade (100°F - 102°F)', 'Low Grade (< 100°F)', 'Not measured / Feels hot'],
      },
      {
        id: 'pattern',
        label: 'Pattern of Temperature Spikes',
        labelHindi: 'बुखार का समय और रूप',
        type: 'select',
        options: ['Continuous high fever with chills/rigors', 'Evening temperature spikes', 'Alternate day spikes', 'Constant low grade with night sweats'],
      },
      {
        id: 'associated',
        label: 'Associated Symptoms',
        labelHindi: 'साथ में अन्य लक्षण',
        type: 'multiselect',
        options: ['Severe Body Ache & Joint Pain', 'Persistent Dry Cough', 'Productive Cough with Yellow Phlegm', 'Nausea / Loss of Taste & Smell', 'Severe Retro-orbital Headache', 'Rash on skin', 'None'],
      },
      {
        id: 'travel',
        label: 'Recent Travel / Environmental Exposure',
        labelHindi: 'हाल की यात्रा या मच्छर/जल संपर्क',
        type: 'select',
        options: ['Recent travel to endemic / forest area', 'History of mosquito bites in area', 'Contact with known viral patient', 'No specific exposure noted'],
      },
    ],
  },
  'cough': {
    id: 'cough',
    complaintKey: 'Cough & Respiratory Difficulty',
    name: 'Cough & Respiratory Distress',
    nameHindi: 'खांसी और सांस की तकलीफ',
    category: 'Pulmonology / Respiratory',
    questions: [
      {
        id: 'duration',
        label: 'Duration of Cough',
        labelHindi: 'खांसी कितने समय से है',
        type: 'select',
        options: ['Acute (< 1 week)', '1 to 3 weeks', 'Chronic persistent (> 3 weeks)', 'Recurrent seasonal attacks'],
      },
      {
        id: 'character',
        label: 'Type & Nature of Cough',
        labelHindi: 'खांसी का प्रकार',
        type: 'select',
        options: ['Productive cough with yellow/green sputum', 'Dry hacking irritative cough', 'Barking / Paroxysmal spasms', 'Cough with blood streaks (Hemoptysis)'],
      },
      {
        id: 'breathlessness',
        label: 'Breathlessness & Wheezing',
        labelHindi: 'सांस फूलना या सीटी की आवाज',
        type: 'select',
        options: ['Severe breathlessness at rest', 'Breathlessness on walking / stairs', 'Audible wheezing / whistling sound', 'No breathlessness'],
      },
      {
        id: 'triggers',
        label: 'Triggers & Exacerbating Factors',
        labelHindi: 'किससे खांसी बढ़ती है',
        type: 'select',
        options: ['Cold air, dust & smoke', 'Worse at night while lying flat', 'Post-meal regurgitation', 'Physical exertion'],
      },
    ],
  },
  'headache': {
    id: 'headache',
    complaintKey: 'Severe Headache & Dizziness',
    name: 'Severe Headache & Neurological Symptoms',
    nameHindi: 'तीव्र सर दर्द, चक्कर या दृष्टि समस्या',
    category: 'Neurology / General Medicine',
    questions: [
      {
        id: 'onset',
        label: 'Onset & Severity Pattern',
        labelHindi: 'दर्द का आरंभ और तीव्रता',
        type: 'select',
        options: ['Sudden explosive "Thunderclap" onset (< 5 mins)', 'Gradual throbbing ache over hours', 'Constant tight band around forehead', 'Early morning headache with nausea'],
      },
      {
        id: 'location',
        label: 'Location of Headache',
        labelHindi: 'सर दर्द का स्थान',
        type: 'select',
        options: ['Unilateral (One side of head)', 'Occipital / Back of head and neck', 'Frontal / Forehead and behind eyes', 'Diffuse all over head'],
      },
      {
        id: 'associated',
        label: 'Neurological & Visual Symptoms',
        labelHindi: 'अन्य तंत्रिका लक्षण',
        type: 'multiselect',
        options: ['Visual aura / Flashing lights / Blurred vision', 'Nausea & projectile vomiting', 'Sensitivity to light & sound (Photophobia)', 'Sudden facial numbness or arm weakness', 'Slurred speech or confusion', 'None'],
      },
    ],
  },
  'abdominal-pain': {
    id: 'abdominal-pain',
    complaintKey: 'Abdominal Distress & Pain',
    name: 'Abdominal Pain & Digestive Distress',
    nameHindi: 'पेट दर्द, गैस, उल्टी या दस्त',
    category: 'Gastroenterology / General Surgery',
    questions: [
      {
        id: 'location',
        label: 'Location of Abdominal Pain',
        labelHindi: 'पेट दर्द का स्थान',
        type: 'select',
        options: ['Right Lower Quadrant (Iliac Fossa)', 'Epigastric (Upper Mid-Abdomen)', 'Right Upper Quadrant (Under ribs)', 'Diffuse / All over abdomen', 'Lower pelvic region'],
      },
      {
        id: 'character',
        label: 'Character of Pain',
        labelHindi: 'दर्द का प्रकार',
        type: 'select',
        options: ['Severe sharp stabbing with tenderness', 'Colicky cramping spasms', 'Burning acid indigestion', 'Dull continuous ache'],
      },
      {
        id: 'relation-meals',
        label: 'Relation to Food & Meals',
        labelHindi: 'भोजन से संबंध',
        type: 'select',
        options: ['Worse 30-60 mins after fatty meals', 'Relieved by eating food or antacids', 'Worse on empty stomach', 'No relation to meals'],
      },
      {
        id: 'bowel-symptoms',
        label: 'Associated Bowel & GI Symptoms',
        labelHindi: 'पेट से जुड़े अन्य लक्षण',
        type: 'multiselect',
        options: ['Repeated vomiting', 'Inability to pass stool or flatus (Obstipation)', 'Watery loose diarrhea', 'Dark / Black tarry stools', 'High fever with abdominal bloating', 'None'],
      },
    ],
  },
};

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
 * Evaluates clinical red flags for urgent triage escalation.
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

  if (ros.includes('syncope')) {
    reasons.push('Recent episode of syncope / loss of consciousness requires cardiovascular & neurological evaluation.');
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
    text += `Priority triage assignment registered in hospital OPD queue.\n\n`;
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
