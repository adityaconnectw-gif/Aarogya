/**
 * Medical Document OCR & Clinical Entity Extraction Service
 * 
 * Provides mock OCR pipelines for handwritten and printed prescriptions, lab reports,
 * and hospital discharge summaries with staged processing, confidence indicators,
 * and item-by-item verification.
 */

export interface ExtractedDiagnosis {
  id: string;
  condition: string;
  category: string;
  confidenceScore: number;
  confidenceLevel: 'High confidence' | 'Review recommended' | 'Low confidence';
  isHandwritten?: boolean;
  status: 'confirmed' | 'edited' | 'pending';
}

export interface ExtractedMedication {
  id: string;
  medicineName: string;
  dosage: string;
  frequency: string;
  duration: string;
  confidenceScore: number;
  confidenceLevel: 'High confidence' | 'Review recommended' | 'Low confidence';
  isHandwritten?: boolean;
  status: 'confirmed' | 'edited' | 'pending';
}

export interface ExtractedInvestigation {
  id: string;
  testName: string;
  resultValue: string;
  unit: string;
  referenceRange: string;
  flag: 'normal' | 'low' | 'high';
  confidenceScore: number;
  confidenceLevel: 'High confidence' | 'Review recommended' | 'Low confidence';
  status: 'confirmed' | 'edited' | 'pending';
}

export interface ExtractedProcedure {
  id: string;
  procedureName: string;
  date: string;
  facility: string;
  status: 'confirmed' | 'edited' | 'pending';
}

export interface ScannedPage {
  pageNumber: number;
  thumbnailUrl: string;
  rotation: number;
}

export interface OcrDocumentResult {
  id: string;
  documentTitle: string;
  documentType: 'Prescription' | 'Lab Report' | 'Discharge Summary' | 'Imaging Report' | 'Consultation Note' | 'Other';
  issuingFacility: string;
  documentDate: string;
  patientName: string;
  detectedLanguage: string;
  isHandwritten: boolean;
  pageCount: number;
  pages: ScannedPage[];
  thumbnailUrl: string;
  rawTextPreview: string;
  diagnoses: ExtractedDiagnosis[];
  medications: ExtractedMedication[];
  investigations: ExtractedInvestigation[];
  procedures: ExtractedProcedure[];
  importantFindings: string[];
  drugInteractions: string[];
  processingStage: number; // 1 to 6
  processingStatus: 'idle' | 'processing' | 'success' | 'error';
}

export const OCR_PROCESSING_STAGES = [
  { stage: 1, label: 'Receiving document buffer' },
  { stage: 2, label: 'Reading optical characters & handwriting' },
  { stage: 3, label: 'Identifying clinical entities (SNOMED-CT / RxNorm)' },
  { stage: 4, label: 'Structuring diagnoses & dosages' },
  { stage: 5, label: 'Checking biomarker reference ranges & dates' },
  { stage: 6, label: 'Creating verified medical timeline entry' },
];

export const PRESET_OCR_DOCUMENTS: OcrDocumentResult[] = [
  {
    id: 'doc-aiims-rx-01',
    documentTitle: 'Physical OPD Prescription — Dr. Rohan Sharma',
    documentType: 'Prescription',
    issuingFacility: 'AIIMS New Delhi — Dept of Medicine',
    documentDate: '12 Jan 2025',
    patientName: 'Aditya Verma',
    detectedLanguage: 'English / Hindi Medical Terminology',
    isHandwritten: true,
    pageCount: 1,
    pages: [
      {
        pageNumber: 1,
        thumbnailUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=400&q=80',
        rotation: 0,
      },
    ],
    thumbnailUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=400&q=80',
    rawTextPreview: 'Rx: Budecort Inhaler 200mcg (2 puffs BD), Azithromycin 500mg (1 OD x 5d), Paracetamol 650mg SOS. Diagnosis: Acute Bronchitis with mild wheezing. Known allergy: Penicillin.',
    diagnoses: [
      {
        id: 'diag-1',
        condition: 'Acute Bronchitis',
        category: 'Respiratory',
        confidenceScore: 94,
        confidenceLevel: 'High confidence',
        isHandwritten: true,
        status: 'confirmed',
      },
      {
        id: 'diag-2',
        condition: 'Seasonal Allergic Rhinitis',
        category: 'Allergy',
        confidenceScore: 78,
        confidenceLevel: 'Review recommended',
        isHandwritten: true,
        status: 'confirmed',
      },
    ],
    medications: [
      {
        id: 'med-1',
        medicineName: 'Budecort Inhaler 200mcg',
        dosage: '2 puffs',
        frequency: 'Twice daily (BD)',
        duration: '30 days',
        confidenceScore: 98,
        confidenceLevel: 'High confidence',
        isHandwritten: true,
        status: 'confirmed',
      },
      {
        id: 'med-2',
        medicineName: 'Azithromycin 500mg',
        dosage: '1 tablet',
        frequency: 'Once daily (OD)',
        duration: '5 days',
        confidenceScore: 91,
        confidenceLevel: 'High confidence',
        isHandwritten: true,
        status: 'confirmed',
      },
      {
        id: 'med-3',
        medicineName: 'Paracetamol 650mg',
        dosage: '1 tablet',
        frequency: 'SOS (as needed for fever)',
        duration: '5 days',
        confidenceScore: 95,
        confidenceLevel: 'High confidence',
        isHandwritten: true,
        status: 'confirmed',
      },
    ],
    investigations: [],
    procedures: [],
    importantFindings: [
      'Handwritten Penicillin contraindication note identified on header margin.',
      'Inhaler technique review recommended during next outpatient visit.',
    ],
    drugInteractions: [
      'Known Penicillin Allergy alert flagged. Ensure no beta-lactam cross-reactivity.',
    ],
    processingStage: 6,
    processingStatus: 'success',
  },
  {
    id: 'doc-nabl-panel-02',
    documentTitle: 'Biochemistry & Hematology Diagnostic Panel',
    documentType: 'Lab Report',
    issuingFacility: 'City Care NABL Diagnostic Laboratories',
    documentDate: '28 Jan 2025',
    patientName: 'Aditya Verma',
    detectedLanguage: 'English (Printed Diagnostic Format)',
    isHandwritten: false,
    pageCount: 2,
    pages: [
      {
        pageNumber: 1,
        thumbnailUrl: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=400&q=80',
        rotation: 0,
      },
      {
        pageNumber: 2,
        thumbnailUrl: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=400&q=80',
        rotation: 0,
      },
    ],
    thumbnailUrl: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=400&q=80',
    rawTextPreview: 'Hb: 9.2 g/dL (Low, Ref 13-17), Fasting Glucose: 142 mg/dL (High, Ref 70-100), Serum Cholesterol: 245 mg/dL (High, Ref <200), Creatinine: 0.9 mg/dL (Normal).',
    diagnoses: [
      {
        id: 'diag-3',
        condition: 'Microcytic Hypochromic Anemia',
        category: 'Hematology',
        confidenceScore: 98,
        confidenceLevel: 'High confidence',
        isHandwritten: false,
        status: 'confirmed',
      },
      {
        id: 'diag-4',
        condition: 'Impaired Fasting Glycemia',
        category: 'Endocrine',
        confidenceScore: 95,
        confidenceLevel: 'High confidence',
        isHandwritten: false,
        status: 'confirmed',
      },
    ],
    medications: [],
    investigations: [
      {
        id: 'inv-1',
        testName: 'Hemoglobin (Hb)',
        resultValue: '9.2',
        unit: 'g/dL',
        referenceRange: '13.0 - 17.0',
        flag: 'low',
        confidenceScore: 99,
        confidenceLevel: 'High confidence',
        status: 'confirmed',
      },
      {
        id: 'inv-2',
        testName: 'Fasting Blood Glucose',
        resultValue: '142',
        unit: 'mg/dL',
        referenceRange: '70 - 100',
        flag: 'high',
        confidenceScore: 99,
        confidenceLevel: 'High confidence',
        status: 'confirmed',
      },
      {
        id: 'inv-3',
        testName: 'Serum Total Cholesterol',
        resultValue: '245',
        unit: 'mg/dL',
        referenceRange: '< 200',
        flag: 'high',
        confidenceScore: 97,
        confidenceLevel: 'High confidence',
        status: 'confirmed',
      },
      {
        id: 'inv-4',
        testName: 'Serum Creatinine',
        resultValue: '0.9',
        unit: 'mg/dL',
        referenceRange: '0.7 - 1.3',
        flag: 'normal',
        confidenceScore: 99,
        confidenceLevel: 'High confidence',
        status: 'confirmed',
      },
    ],
    procedures: [],
    importantFindings: [
      'Hemoglobin (9.2 g/dL) is below adult male reference range (13.0 - 17.0 g/dL).',
      'Elevated fasting glucose (142 mg/dL) requires HbA1c correlation by clinician.',
    ],
    drugInteractions: [
      'Anemia biomarkers detected; check iron supplementation compatibility with other oral medications.',
    ],
    processingStage: 6,
    processingStatus: 'success',
  },
  {
    id: 'doc-discharge-03',
    documentTitle: 'Hospital Daycare Discharge Summary',
    documentType: 'Discharge Summary',
    issuingFacility: 'Safdarjung Apex Trauma Center',
    documentDate: '04 Nov 2024',
    patientName: 'Aditya Verma',
    detectedLanguage: 'English (Clinical Discharge Standard)',
    isHandwritten: false,
    pageCount: 1,
    pages: [
      {
        pageNumber: 1,
        thumbnailUrl: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=400&q=80',
        rotation: 0,
      },
    ],
    thumbnailUrl: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=400&q=80',
    rawTextPreview: 'Patient admitted with acute gastroenteritis & moderate dehydration. Corrected with IV Ringer Lactate. Discharged stable on ORS & Probiotics.',
    diagnoses: [
      {
        id: 'diag-5',
        condition: 'Resolved Viral Gastroenteritis',
        category: 'Infectious / GI',
        confidenceScore: 96,
        confidenceLevel: 'High confidence',
        isHandwritten: false,
        status: 'confirmed',
      },
    ],
    medications: [
      {
        id: 'med-4',
        medicineName: 'ORS Electrolyte Solution',
        dosage: '1 sachet in 1L water',
        frequency: 'Ad libitum',
        duration: '3 days',
        confidenceScore: 99,
        confidenceLevel: 'High confidence',
        isHandwritten: false,
        status: 'confirmed',
      },
      {
        id: 'med-5',
        medicineName: 'Probiotic Spores Capsule',
        dosage: '1 capsule',
        frequency: 'Twice daily',
        duration: '7 days',
        confidenceScore: 94,
        confidenceLevel: 'High confidence',
        isHandwritten: false,
        status: 'confirmed',
      },
    ],
    investigations: [
      {
        id: 'inv-5',
        testName: 'Serum Sodium (Na+)',
        resultValue: '138',
        unit: 'mEq/L',
        referenceRange: '135 - 145',
        flag: 'normal',
        confidenceScore: 99,
        confidenceLevel: 'High confidence',
        status: 'confirmed',
      },
      {
        id: 'inv-6',
        testName: 'Serum Potassium (K+)',
        resultValue: '4.1',
        unit: 'mEq/L',
        referenceRange: '3.5 - 5.0',
        flag: 'normal',
        confidenceScore: 99,
        confidenceLevel: 'High confidence',
        status: 'confirmed',
      },
    ],
    procedures: [
      {
        id: 'proc-1',
        procedureName: 'IV Rehydration & Electrolyte Balancing',
        date: '04 Nov 2024',
        facility: 'Safdarjung Apex Trauma Center',
        status: 'confirmed',
      },
    ],
    importantFindings: [
      'Patient successfully rehydrated and vitals stabilized prior to discharge.',
    ],
    drugInteractions: [],
    processingStage: 6,
    processingStatus: 'success',
  },
];

/**
 * Simulates real OCR extraction with progressive staging (1 to 6).
 */
export async function simulateStagedOcrProcessing(
  onStageUpdate: (stage: number) => void,
  docIndex = 0
): Promise<OcrDocumentResult> {
  const doc = PRESET_OCR_DOCUMENTS[docIndex % PRESET_OCR_DOCUMENTS.length];

  // Stage 1: Receiving document
  onStageUpdate(1);
  await new Promise((resolve) => setTimeout(resolve, 350));

  // Stage 2: Reading text
  onStageUpdate(2);
  await new Promise((resolve) => setTimeout(resolve, 400));

  // Stage 3: Identifying clinical entities
  onStageUpdate(3);
  await new Promise((resolve) => setTimeout(resolve, 400));

  // Stage 4: Structuring diagnoses & dosages
  onStageUpdate(4);
  await new Promise((resolve) => setTimeout(resolve, 350));

  // Stage 5: Checking reference ranges & dates
  onStageUpdate(5);
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Stage 6: Creating verified medical timeline entry
  onStageUpdate(6);
  await new Promise((resolve) => setTimeout(resolve, 250));

  return {
    ...doc,
    id: `doc-${Date.now()}`,
    documentDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
  };
}
