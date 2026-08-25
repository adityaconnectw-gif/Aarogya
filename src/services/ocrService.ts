/**
 * Medical Document OCR & Clinical Entity Extraction Service
 * 
 * Provides mock OCR pipelines for handwritten/printed prescriptions, lab reports,
 * and hospital discharge summaries with entity extraction and out-of-range highlighting.
 */

export interface ExtractedDiagnosis {
  id: string;
  condition: string;
  category: string;
  confidence: number;
  status: 'confirmed' | 'edited' | 'pending';
}

export interface ExtractedMedication {
  id: string;
  medicineName: string;
  dosage: string;
  frequency: string;
  duration: string;
  confidence: number;
  status: 'confirmed' | 'edited' | 'pending';
}

export interface ExtractedInvestigation {
  id: string;
  testName: string;
  resultValue: string;
  unit: string;
  referenceRange: string;
  flag: 'normal' | 'low' | 'high';
  confidence: number;
  status: 'confirmed' | 'edited' | 'pending';
}

export interface OcrDocumentResult {
  id: string;
  documentTitle: string;
  documentType: 'Prescription' | 'Lab Report' | 'Discharge Summary' | 'Imaging Report';
  issuingFacility: string;
  documentDate: string;
  thumbnailUrl: string;
  rawTextPreview: string;
  diagnoses: ExtractedDiagnosis[];
  medications: ExtractedMedication[];
  investigations: ExtractedInvestigation[];
  drugInteractions?: string[];
  processingStatus: 'idle' | 'processing' | 'success' | 'error';
}

export const PRESET_OCR_DOCUMENTS: OcrDocumentResult[] = [
  {
    id: 'doc-aiims-rx',
    documentTitle: 'Physical OPD Prescription — Dept of Medicine',
    documentType: 'Prescription',
    issuingFacility: 'AIIMS New Delhi',
    documentDate: '12 Jan 2025',
    thumbnailUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=400&q=80',
    rawTextPreview: 'Rx: Budecort Inhaler 200mcg (2 puffs BD), Azithromycin 500mg (1 OD x 5d), Paracetamol 650mg SOS. Diagnosis: Acute Bronchitis.',
    diagnoses: [
      { id: 'diag-1', condition: 'Acute Bronchitis', category: 'Respiratory', confidence: 96, status: 'confirmed' },
      { id: 'diag-2', condition: 'Seasonal Rhinitis', category: 'Allergy', confidence: 92, status: 'confirmed' },
    ],
    medications: [
      { id: 'med-1', medicineName: 'Budecort Inhaler 200mcg', dosage: '2 puffs', frequency: 'Twice daily', duration: '30 days', confidence: 98, status: 'confirmed' },
      { id: 'med-2', medicineName: 'Azithromycin 500mg', dosage: '1 tablet', frequency: 'Once daily (OD)', duration: '5 days', confidence: 94, status: 'confirmed' },
      { id: 'med-3', medicineName: 'Paracetamol 650mg', dosage: '1 tablet', frequency: 'SOS (as needed)', duration: '5 days', confidence: 97, status: 'confirmed' },
    ],
    investigations: [],
    drugInteractions: [],
    processingStatus: 'success',
  },
  {
    id: 'doc-nabl-lab',
    documentTitle: 'Biochemistry & Hematology Diagnostic Panel',
    documentType: 'Lab Report',
    issuingFacility: 'City Care NABL Diagnostic Laboratories',
    documentDate: '28 Jan 2025',
    thumbnailUrl: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=400&q=80',
    rawTextPreview: 'Hb: 9.2 g/dL (Low), Fasting Glucose: 142 mg/dL (High), Serum Cholesterol: 245 mg/dL (High), Serum Creatinine: 0.9 mg/dL (Normal).',
    diagnoses: [
      { id: 'diag-3', condition: 'Microcytic Hypochromic Anemia', category: 'Hematology', confidence: 95, status: 'confirmed' },
      { id: 'diag-4', condition: 'Impaired Fasting Glucose', category: 'Endocrine', confidence: 91, status: 'confirmed' },
    ],
    medications: [],
    investigations: [
      { id: 'inv-1', testName: 'Hemoglobin (Hb)', resultValue: '9.2', unit: 'g/dL', referenceRange: '13.0 - 17.0', flag: 'low', confidence: 99, status: 'confirmed' },
      { id: 'inv-2', testName: 'Fasting Blood Glucose', resultValue: '142', unit: 'mg/dL', referenceRange: '70 - 100', flag: 'high', confidence: 98, status: 'confirmed' },
      { id: 'inv-3', testName: 'Serum Total Cholesterol', resultValue: '245', unit: 'mg/dL', referenceRange: '< 200', flag: 'high', confidence: 96, status: 'confirmed' },
      { id: 'inv-4', testName: 'Serum Creatinine', resultValue: '0.9', unit: 'mg/dL', referenceRange: '0.7 - 1.3', flag: 'normal', confidence: 99, status: 'confirmed' },
    ],
    drugInteractions: ['Low Hemoglobin (9.2 g/dL) detected; evaluate for concurrent iron absorption interactions.'],
    processingStatus: 'success',
  },
];

/**
 * Simulates document upload and OCR processing delay.
 */
export async function simulateDocumentProcessing(docIndex = 0): Promise<OcrDocumentResult> {
  await new Promise((resolve) => setTimeout(resolve, 800));
  const doc = PRESET_OCR_DOCUMENTS[docIndex % PRESET_OCR_DOCUMENTS.length];
  return { ...doc, id: `doc-${Date.now()}` };
}
