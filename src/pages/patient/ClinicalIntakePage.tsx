import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Stethoscope,
  Heart,
  Thermometer,
  Activity,
  Shield,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileText,
  FileCheck,
  FileSpreadsheet,
  QrCode,
  Printer,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Camera,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  ScanLine,
  User,
  Phone,
  Building2,
  Clock,
  Languages,
  Upload,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Lock,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../components/common/Toast';
import { speakText, stopSpeaking, startSpeechRecognition } from '../../services/speechService';
import { verifyABHAId, generateConsentArtifact } from '../../services/abdmService';
import { PRESET_OCR_DOCUMENTS, OcrDocumentResult, simulateDocumentProcessing } from '../../services/ocrService';
import {
  REVIEW_OF_SYSTEMS,
  FullIntakeRecord,
  evaluateRedFlags,
  generateClinicalHistorySummary,
} from '../../services/clinicalIntakeService';

export const ClinicalIntakePage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { patient, addDocument, saveClinicalIntakeSummary, logAudit } = useApp();

  // Progress Steps: 1. Identify | 2. Consent | 3. History | 4. Documents | 5. Summary | 6. Handoff
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);

  // Audio Guidance state
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // 1. Identify State
  const [patientType, setPatientType] = useState<'existing' | 'new'>('existing');
  const [abhaInput, setAbhaInput] = useState('12-3456-7890-1234');
  const [patientName, setPatientName] = useState(patient.name || 'Aditya Verma');
  const [patientAge, setPatientAge] = useState(patient.age || 20);
  const [patientGender, setPatientGender] = useState(patient.gender || 'Male');
  const [patientPhone, setPatientPhone] = useState(patient.phone || '+91 98765 43210');
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [abhaVerified, setAbhaVerified] = useState(true);

  // 2. Consent State
  const [consentGranted, setConsentGranted] = useState(true);

  // 3. Clinical History State
  const [intakeMode, setIntakeMode] = useState<'allopathic' | 'ayush'>('allopathic');
  const [chiefComplaint, setChiefComplaint] = useState('Chest Pain & Discomfort');
  const [chiefComplaintOther, setChiefComplaintOther] = useState('');
  const [severity, setSeverity] = useState(7);
  
  // HPI SOCRATES Breakdown
  const [hpiSite, setHpiSite] = useState('Substernal / Central Chest');
  const [hpiOnset, setHpiOnset] = useState('Sudden acute onset (< 2 hours)');
  const [hpiCharacter, setHpiCharacter] = useState('Crushing / Heavy pressure');
  const [hpiRadiation, setHpiRadiation] = useState('Radiates to Left Arm & Jaw');
  const [hpiAggravating, setHpiAggravating] = useState('Worse with physical exertion');
  const [hpiRelieving, setHpiRelieving] = useState('Relieved by rest');
  const [hpiDuration, setHpiDuration] = useState('2 hours');
  const [patientNarrative, setPatientNarrative] = useState(
    'Pain started suddenly while climbing stairs. Feels like a heavy weight pressing on my chest and radiating down my left arm.'
  );

  // Past Medical & Surgical History
  const [pastMedicalHistory, setPastMedicalHistory] = useState<string[]>([
    'Bronchial Asthma (Diagnosed 2024)',
    'Mild Hypertension',
  ]);
  const [pastSurgicalHistory, setPastSurgicalHistory] = useState<string[]>([
    'Appendectomy (2020)',
  ]);
  const [newConditionInput, setNewConditionInput] = useState('');

  // Current Medications & Allergies
  const [currentMedications, setCurrentMedications] = useState<string[]>([
    'Budecort Inhaler 200mcg (Twice daily)',
    'Montelukast 10mg (Nightly)',
  ]);
  const [allergies, setAllergies] = useState<string[]>([
    'Penicillin / Amoxicillin (Severe anaphylactoid rash)',
  ]);
  const [newMedInput, setNewMedInput] = useState('');

  // Family & Lifestyle
  const [familyHistory, setFamilyHistory] = useState<string[]>([
    'Paternal history of Premature Coronary Artery Disease',
  ]);
  const [lifestyle, setLifestyle] = useState({
    smoking: 'Never' as 'Never' | 'Former' | 'Current',
    alcohol: 'Occasional' as 'Non-drinker' | 'Occasional' | 'Regular',
    exercise: 'Moderate' as 'Sedentary' | 'Moderate' | 'Active',
    diet: 'Vegetarian' as 'Vegetarian' | 'Non-Vegetarian' | 'Vegan' | 'Ayurvedic Sattvic',
  });

  // Review of Systems (ROS)
  const [selectedRos, setSelectedRos] = useState<string[]>([
    'chest-pain',
    'dyspnea',
    'fatigue',
  ]);

  // AYUSH Dashavidha Pariksha State
  const [ayushPrakriti, setAyushPrakriti] = useState('Vata-Pitta (वात-पित्त)');
  const [ayushVikriti, setAyushVikriti] = useState('Pitta-Vata Imbalance');
  const [ayushAgni, setAyushAgni] = useState('Tikshnagni (Sharp / Hyperactive)');
  const [ayushKoshtha, setAyushKoshtha] = useState('Krura (Hard / Constipated)');
  const [ayushSatmya, setAyushSatmya] = useState('Sarva Rasa (All tastes adaptable)');
  const [ayushSattva, setAyushSattva] = useState('Pravara (High mental resilience)');
  const [ayushAharaVihara, setAyushAharaVihara] = useState('Late dinner habits, high tea consumption, irregular sleep.');

  // Red Flags
  const [isRedFlag, setIsRedFlag] = useState(true);
  const [redFlagDetails, setRedFlagDetails] = useState<string[]>([
    'Acute Chest Discomfort with radiation to left arm (Suspected Acute Coronary Syndrome).',
  ]);

  // 4. Documents & OCR State
  const [documentsList, setDocumentsList] = useState<OcrDocumentResult[]>([
    PRESET_OCR_DOCUMENTS[0],
    PRESET_OCR_DOCUMENTS[1],
  ]);
  const [isProcessingDoc, setIsProcessingDoc] = useState(false);
  const [editingItem, setEditingItem] = useState<{ docId: string; type: string; itemId: string } | null>(null);

  // 5. OPD Token & Handoff State
  const [tokenNumber] = useState('OPD-MED-402');

  // Re-evaluate Red Flags on symptom changes
  useEffect(() => {
    const evaluation = evaluateRedFlags({
      chiefComplaint,
      hpi: {
        site: hpiSite,
        onset: hpiOnset,
        character: hpiCharacter,
        radiation: hpiRadiation,
        aggravating: hpiAggravating,
        relieving: hpiRelieving,
        duration: hpiDuration,
        patientNarrative,
      },
      severity,
      reviewOfSystems: selectedRos,
    });
    setIsRedFlag(evaluation.isRedFlag);
    setRedFlagDetails(evaluation.reasons);
  }, [chiefComplaint, hpiSite, hpiOnset, hpiCharacter, hpiRadiation, hpiAggravating, hpiRelieving, severity, selectedRos]);

  // Read voice instructions
  const handleAudioGuidance = (text: string) => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      speakText(
        text,
        () => setIsSpeaking(true),
        () => setIsSpeaking(false)
      );
    }
  };

  // Voice recording for patient narrative
  const handleToggleVoiceInput = () => {
    if (isListening) {
      setIsListening(false);
    } else {
      setIsListening(true);
      startSpeechRecognition(
        (transcript) => {
          setPatientNarrative(transcript);
        },
        (err) => {
          showToast(err, 'warning');
          setIsListening(false);
        },
        () => {
          setIsListening(false);
        }
      );
    }
  };

  // Demo Persona Loader
  const handleLoadPersona = async (persona: 'aditya' | 'kamala' | 'ramesh') => {
    if (persona === 'aditya') {
      const res = await verifyABHAId('12-3456-7890-1234');
      setPatientName(res.name);
      setAbhaInput(res.abhaId);
      setPatientAge(20);
      setPatientGender('Male');
      setChiefComplaint('Chest Pain & Discomfort');
      setSeverity(8);
      setIntakeMode('allopathic');
      showToast('Loaded Demo Patient: Aditya Verma (Acute Chest Pain)', 'info');
    } else if (persona === 'kamala') {
      const res = await verifyABHAId('98-7654-3210-9876');
      setPatientName('Kamala Devi');
      setAbhaInput('98-7654-3210-9876');
      setPatientAge(68);
      setPatientGender('Female');
      setChiefComplaint('Joint Pain & Morning Stiffness');
      setSeverity(6);
      setIntakeMode('ayush');
      showToast('Loaded Demo Patient: Kamala Devi (AYUSH Joint & Pariksha Intake)', 'info');
    } else {
      setPatientName('Ramesh Kumar');
      setAbhaInput('44-1122-3344-5566');
      setPatientAge(34);
      setPatientGender('Male');
      setChiefComplaint('Fever with Cough & Breathlessness');
      setSeverity(5);
      setIntakeMode('allopathic');
      showToast('Loaded Demo Patient: Ramesh Kumar (General OPD Walk-In)', 'info');
    }
  };

  // Add Document via simulated scan/upload
  const handleSimulateDocumentUpload = async () => {
    setIsProcessingDoc(true);
    try {
      const newDoc = await simulateDocumentProcessing(documentsList.length);
      setDocumentsList((prev) => [...prev, newDoc]);
      showToast(`Document digitized & OCR entities extracted: ${newDoc.documentTitle}`, 'success');
    } catch {
      showToast('Document processing failed. Please retry.', 'error');
    } finally {
      setIsProcessingDoc(false);
    }
  };

  // Current Intake Record Data
  const fullIntakeData: FullIntakeRecord = {
    patientId: patient.patientId || 'P-10001',
    name: patientName,
    age: patientAge,
    gender: patientGender,
    phone: patientPhone,
    abhaId: abhaInput,
    language: selectedLanguage,
    consentGranted,
    consentTimestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    intakeMode,
    chiefComplaint,
    chiefComplaintOther,
    severity,
    hpi: {
      site: hpiSite,
      onset: hpiOnset,
      character: hpiCharacter,
      radiation: hpiRadiation,
      aggravating: hpiAggravating,
      relieving: hpiRelieving,
      duration: hpiDuration,
      patientNarrative,
    },
    pastMedicalHistory,
    pastSurgicalHistory,
    currentMedications,
    allergies,
    familyHistory,
    lifestyle,
    reviewOfSystems: selectedRos,
    ayush:
      intakeMode === 'ayush'
        ? {
            prakriti: ayushPrakriti,
            vikriti: ayushVikriti,
            sara: 'Madhyama',
            samhanana: 'Compact / Madhyama',
            pramana: 'Standard (Pramana Yukta)',
            satmya: ayushSatmya,
            sattva: ayushSattva,
            aharaShakti: ayushAgni,
            vyayamaShakti: 'Madhyama',
            vaya: `${patientAge} Years (Madhyama Vaya)`,
            aharaVihara: ayushAharaVihara,
          }
        : undefined,
    isRedFlagTriggered: isRedFlag,
    redFlagDetails,
    scannedDocuments: documentsList,
    status: 'Submitted',
  };

  // Submit and Complete Intake
  const handleSubmitIntake = () => {
    // 1. Save to context / local storage
    saveClinicalIntakeSummary(fullIntakeData);

    // 2. Link any extracted documents to the patient's record store
    documentsList.forEach((d) => {
      addDocument({
        patientId: patient.patientId || 'P-10001',
        title: d.documentTitle,
        category: d.documentType === 'Prescription' ? 'Prescriptions' : d.documentType === 'Lab Report' ? 'Lab Reports' : 'Discharge Summaries',
        date: d.documentDate,
        hospitalName: d.issuingFacility,
        doctorName: 'Dr. R. Sharma',
        fileSize: '1.2 MB',
        fileFormat: 'PDF',
        description: 'Digitized & OCR-verified during self-service clinical intake.',
      });
    });

    // 3. Log ABDM audit
    logAudit(
      patient.patientId || 'P-10001',
      patientName,
      'Patient',
      'Shared',
      'Consultation Notes',
      'Clinical intake completed and dispatched to Dr. Rohan Sharma consultation chamber.'
    );

    setStep(6);
    showToast('Clinical history compiled & dispatched to Attending Physician room.', 'success');
  };

  return (
    <div className="space-y-6">
      {/* 1. Official Page Header */}
      <div className="bg-surface rounded-md border border-border p-4 sm:p-5 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-md bg-primary/10 text-primary flex items-center justify-center font-bold">
              <Stethoscope className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">
                Self-Service Clinical Intake
              </h1>
              <p className="text-xs text-muted-foreground">
                Pre-consultation history recording and document digitization for hospital OPD appointments.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Audio Guidance TTS Button */}
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              handleAudioGuidance(
                step === 1
                  ? 'Please confirm your patient identity and select your preferred language.'
                  : step === 2
                  ? 'Please review the digital consent explanation under the Digital Personal Data Protection Act 2023.'
                  : step === 3
                  ? 'Please choose or speak your chief medical complaint and answer the guided questions.'
                  : step === 4
                  ? 'Please review your scanned medical documents and extracted medications.'
                  : step === 5
                  ? 'Please review your complete clinical summary before it is sent to the doctor.'
                  : 'Your clinical intake is complete. Please proceed to the consultation room.'
              )
            }
            leftIcon={isSpeaking ? <VolumeX className="h-3.5 w-3.5 text-danger" /> : <Volume2 className="h-3.5 w-3.5 text-primary" />}
          >
            {isSpeaking ? 'Stop Audio' : 'Listen to Guide'}
          </Button>

          <Badge variant="primary" size="sm">
            Terminal #04 • Central OPD
          </Badge>
        </div>
      </div>

      {/* 2. Structured Progress Indicator */}
      <div className="bg-surface rounded-md border border-border p-3 shadow-card">
        <div className="flex items-center justify-between overflow-x-auto text-xs gap-2 py-1">
          {[
            { num: 1, label: '1. Identify' },
            { num: 2, label: '2. Consent' },
            { num: 3, label: '3. Clinical History' },
            { num: 4, label: '4. Documents & OCR' },
            { num: 5, label: '5. Summary' },
            { num: 6, label: '6. Consultation Ready' },
          ].map((s) => (
            <button
              key={s.num}
              onClick={() => s.num < step && setStep(s.num as any)}
              className={`flex items-center gap-2 font-medium whitespace-nowrap transition-colors ${
                step === s.num
                  ? 'text-primary font-bold'
                  : step > s.num
                  ? 'text-foreground hover:text-primary cursor-pointer'
                  : 'text-muted-foreground opacity-60'
              }`}
            >
              <span
                className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
                  step === s.num
                    ? 'bg-primary text-primary-foreground'
                    : step > s.num
                    ? 'bg-primary/20 text-primary border border-primary/40'
                    : 'bg-surface-alt border border-border text-muted-foreground'
                }`}
              >
                {step > s.num ? '✓' : s.num}
              </span>
              <span>{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ================= STEP 1: IDENTIFY & DEMO PERSONA ================= */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Step 1: Patient Identification & Language Selection</CardTitle>
              <CardDescription>
                Verify Ayushman Bharat Health Account (ABHA ID) or Aadhaar demographic identity.
              </CardDescription>
            </div>
            <Badge variant="success" size="sm">
              ABDM Ready (Demo)
            </Badge>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Quick Demo Persona Shortcuts */}
            <div className="p-3 rounded-md bg-surface-alt border border-border space-y-2 text-xs">
              <span className="font-bold text-foreground block">
                Quick Demonstration Personas (1-Click Fill):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => handleLoadPersona('aditya')}
                  className={`p-2.5 rounded border text-left transition-colors ${
                    patientName === 'Aditya Verma'
                      ? 'bg-primary-muted border-primary/40 text-primary font-semibold'
                      : 'bg-surface border-border text-foreground hover:bg-surface-alt'
                  }`}
                >
                  <span className="font-bold block">Aditya Verma (P-10001)</span>
                  <span className="text-[11px] text-muted-foreground">Acute Chest Pain / Cardiology</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleLoadPersona('kamala')}
                  className={`p-2.5 rounded border text-left transition-colors ${
                    patientName === 'Kamala Devi'
                      ? 'bg-primary-muted border-primary/40 text-primary font-semibold'
                      : 'bg-surface border-border text-foreground hover:bg-surface-alt'
                  }`}
                >
                  <span className="font-bold block">Kamala Devi (Elderly Walk-In)</span>
                  <span className="text-[11px] text-muted-foreground">AYUSH Joint & Pariksha Intake</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleLoadPersona('ramesh')}
                  className={`p-2.5 rounded border text-left transition-colors ${
                    patientName === 'Ramesh Kumar'
                      ? 'bg-primary-muted border-primary/40 text-primary font-semibold'
                      : 'bg-surface border-border text-foreground hover:bg-surface-alt'
                  }`}
                >
                  <span className="font-bold block">Ramesh Kumar (First-Time)</span>
                  <span className="text-[11px] text-muted-foreground">General OPD Viral Fever</span>
                </button>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-foreground mb-1">Patient Full Name *</label>
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full h-9 px-3 rounded-md bg-surface border border-input text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block font-semibold text-foreground mb-1">ABHA ID / Patient Health Number *</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={abhaInput}
                    onChange={(e) => setAbhaInput(e.target.value)}
                    placeholder="12-3456-7890-1234"
                    className="w-full h-9 px-3 rounded-md bg-surface border border-input text-foreground font-mono text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setAbhaVerified(true);
                      showToast('ABHA token verified for demonstration.', 'success');
                    }}
                  >
                    Verify
                  </Button>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-foreground mb-1">Age & Gender</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    value={patientAge}
                    onChange={(e) => setPatientAge(Number(e.target.value))}
                    className="w-full h-9 px-3 rounded-md bg-surface border border-input text-foreground text-xs"
                  />
                  <select
                    value={patientGender}
                    onChange={(e) => setPatientGender(e.target.value as 'Male' | 'Female' | 'Other')}
                    className="w-full h-9 px-3 rounded-md bg-surface border border-input text-foreground text-xs"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-foreground mb-1">Preferred Consultation Language</label>
                <select
                  value={selectedLanguage}
                  onChange={(e) => {
                    setSelectedLanguage(e.target.value);
                    showToast(`Intake language updated to ${e.target.value}`, 'info');
                  }}
                  className="w-full h-9 px-3 rounded-md bg-surface border border-input text-foreground text-xs font-medium"
                >
                  <option value="English">English</option>
                  <option value="Hindi">हिन्दी (Hindi)</option>
                  <option value="Tamil">தமிழ் (Tamil)</option>
                  <option value="Bengali">বাংলা (Bengali)</option>
                  <option value="Telugu">తెలుగు (Telugu)</option>
                  <option value="Marathi">मराठी (Marathi)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-border">
              <Button
                size="md"
                variant="primary"
                onClick={() => setStep(2)}
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                Proceed to Consent Authorization
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ================= STEP 2: CONSENT AUTHORIZATION ================= */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Step 2: Digital Consent & Privacy Agreement</CardTitle>
              <CardDescription>
                Compliance with Digital Personal Data Protection Act 2023 and ABDM consent architecture.
              </CardDescription>
            </div>
            <Badge variant="primary" size="sm">
              DPDP Act 2023
            </Badge>
          </CardHeader>

          <CardContent className="space-y-5 text-xs leading-relaxed">
            <div className="p-4 rounded-md bg-surface-alt border border-border space-y-3">
              <div className="flex items-center justify-between border-b border-border pb-2">
                <span className="font-bold text-foreground text-sm flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  Clinical Data Processing Purpose
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    handleAudioGuidance(
                      'Your medical history, voice answers, and prior records will be securely processed to create a draft summary for your attending doctor. You retain full control to revoke this consent at any time.'
                    )
                  }
                  leftIcon={<Volume2 className="h-3.5 w-3.5 text-primary" />}
                >
                  Listen to Explanation
                </Button>
              </div>

              <ul className="space-y-2 text-muted-foreground list-disc pl-5">
                <li>
                  <strong className="text-foreground">Data Collection Scope:</strong> Chief complaints, history of present illness, past medical/surgical history, drug allergies, lifestyle parameters, and uploaded physical prescriptions.
                </li>
                <li>
                  <strong className="text-foreground">Clinical Purpose:</strong> Compiling a physician-ready pre-consultation draft to optimize consultation time in the outpatient department.
                </li>
                <li>
                  <strong className="text-foreground">Temporary Processing:</strong> Voice audio transcripts and temporary OCR buffers are securely cleared after session compilation.
                </li>
                <li>
                  <strong className="text-foreground">Patient Sovereignty:</strong> You can view, edit, or revoke shared clinical records from your Patient Consent Dashboard at any time.
                </li>
              </ul>
            </div>

            <div className="p-3.5 rounded-md bg-surface border border-border flex items-start gap-3">
              <input
                type="checkbox"
                id="consent-check"
                checked={consentGranted}
                onChange={(e) => setConsentGranted(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-border text-primary focus:ring-primary cursor-pointer"
              />
              <label htmlFor="consent-check" className="cursor-pointer text-foreground">
                <span className="font-semibold block">I grant explicit consent for clinical intake compilation</span>
                <span className="text-muted-foreground text-[11px]">
                  Authorized under Consent Artifact #{generateConsentArtifact(abhaInput).consentId} (Validity: 24 Hours).
                </span>
              </label>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-border">
              <Button size="md" variant="outline" onClick={() => setStep(1)} leftIcon={<ArrowLeft className="h-4 w-4" />}>
                Back: Identity
              </Button>
              <Button
                size="md"
                variant="primary"
                disabled={!consentGranted}
                onClick={() => setStep(3)}
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                Accept & Start Clinical History Interview
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ================= STEP 3: CLINICAL HISTORY INTERVIEW (SPEAK & TAP) ================= */}
      {step === 3 && (
        <div className="space-y-5">
          {/* Intake Framework Mode Switcher */}
          <div className="bg-surface rounded-md border border-border p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-card">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground block">
                Clinical Intake Framework
              </span>
              <h2 className="text-sm sm:text-base font-bold text-foreground">
                {intakeMode === 'allopathic' ? 'Standard Allopathic History Intake' : 'AYUSH / Ayurvedic Dashavidha Pariksha Intake'}
              </h2>
            </div>

            <div className="flex items-center gap-1.5 bg-surface-alt p-1 rounded-md border border-border">
              <button
                type="button"
                onClick={() => setIntakeMode('allopathic')}
                className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
                  intakeMode === 'allopathic'
                    ? 'bg-primary text-primary-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Allopathic Intake
              </button>
              <button
                type="button"
                onClick={() => setIntakeMode('ayush')}
                className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
                  intakeMode === 'ayush'
                    ? 'bg-amber-700 text-white shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                AYUSH / Ayurveda
              </button>
            </div>
          </div>

          {/* Emergency Red Flag Alert Banner */}
          {isRedFlag && (
            <div className="p-4 rounded-md bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200 flex items-start justify-between gap-3 shadow-sm animate-fade-in">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
                <div className="space-y-1 text-xs">
                  <span className="font-bold text-sm block text-rose-800 dark:text-rose-200">
                    Urgent Medical Attention Required
                  </span>
                  <p className="leading-relaxed">
                    Your response may indicate a symptom that needs immediate medical assessment: <strong>{redFlagDetails[0]}</strong>.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => showToast('Hospital triage staff notified for priority assessment.', 'info')}
                >
                  Alert Staff
                </Button>
              </div>
            </div>
          )}

          {/* 1. Chief Complaint (Speak & Tap) */}
          <Card>
            <CardHeader>
              <div>
                <CardTitle className="text-sm sm:text-base">1. Presenting Chief Complaint</CardTitle>
                <CardDescription>Select your primary health reason for this consultation or speak into the microphone.</CardDescription>
              </div>
              <div className="flex items-center gap-1.5">
                <Button
                  size="sm"
                  variant={isListening ? 'danger' : 'outline'}
                  onClick={handleToggleVoiceInput}
                  leftIcon={isListening ? <MicOff className="h-3.5 w-3.5" /> : <Mic className="h-3.5 w-3.5 text-primary" />}
                >
                  {isListening ? 'Stop Recording' : 'Speak Complaint'}
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 text-xs">
              {/* Tap Choice Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { label: 'Chest Pain & Discomfort', hindi: 'सीने में दर्द' },
                  { label: 'Fever & Cough', hindi: 'बुखार और खांसी' },
                  { label: 'Abdominal Distress', hindi: 'पेट दर्द या गैस' },
                  { label: 'Joint Pain & Stiffness', hindi: 'जोड़ों का दर्द' },
                  { label: 'Breathing Difficulty', hindi: 'सांस की तकलीफ' },
                  { label: 'Severe Headache / Dizziness', hindi: 'सर दर्द या चक्कर' },
                  { label: 'Skin Rash / Allergy', hindi: 'त्वचा की एलर्जी' },
                  { label: 'Other Health Concern', hindi: 'अन्य समस्या' },
                ].map((c) => (
                  <button
                    key={c.label}
                    type="button"
                    onClick={() => setChiefComplaint(c.label)}
                    className={`p-3 rounded-md border text-left transition-colors ${
                      chiefComplaint === c.label
                        ? 'bg-primary-muted border-primary text-primary font-bold shadow-xs'
                        : 'bg-surface border-border text-foreground hover:bg-surface-alt'
                    }`}
                  >
                    <span className="font-semibold block">{c.label}</span>
                    <span className="text-[10px] text-muted-foreground">{c.hindi}</span>
                  </button>
                ))}
              </div>

              {/* Severity Slider */}
              <div className="p-3.5 rounded-md bg-surface-alt border border-border space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-foreground">Symptom Severity Rating: {severity}/10</span>
                  <Badge variant={severity >= 8 ? 'danger' : severity >= 5 ? 'warning' : 'success'} size="sm">
                    {severity >= 8 ? 'Severe / Acute' : severity >= 5 ? 'Moderate' : 'Mild'}
                  </Badge>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={severity}
                  onChange={(e) => setSeverity(Number(e.target.value))}
                  className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>

              {/* Spoken Narration Box */}
              <div>
                <label className="block font-semibold text-foreground mb-1">
                  Patient Voice Transcript & Additional Remarks
                </label>
                <textarea
                  rows={2}
                  value={patientNarrative}
                  onChange={(e) => setPatientNarrative(e.target.value)}
                  placeholder="Patient spoken narrative will appear here..."
                  className="w-full p-2.5 rounded-md bg-surface border border-input text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </CardContent>
          </Card>

          {/* 2. Adaptive HPI Breakdown (SOCRATES Framework) */}
          <Card>
            <CardHeader>
              <div>
                <CardTitle className="text-sm sm:text-base">2. History of Present Illness (Adaptive SOCRATES)</CardTitle>
                <CardDescription>Clinical details tailored to {chiefComplaint}.</CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-foreground mb-1">Anatomical Location / Site</label>
                  <input
                    type="text"
                    value={hpiSite}
                    onChange={(e) => setHpiSite(e.target.value)}
                    className="w-full h-9 px-3 rounded-md bg-surface border border-input text-foreground text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-foreground mb-1">Onset & Duration</label>
                  <input
                    type="text"
                    value={hpiOnset}
                    onChange={(e) => setHpiOnset(e.target.value)}
                    className="w-full h-9 px-3 rounded-md bg-surface border border-input text-foreground text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-foreground mb-1">Character & Sensation</label>
                  <input
                    type="text"
                    value={hpiCharacter}
                    onChange={(e) => setHpiCharacter(e.target.value)}
                    className="w-full h-9 px-3 rounded-md bg-surface border border-input text-foreground text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-foreground mb-1">Radiation / Spread</label>
                  <input
                    type="text"
                    value={hpiRadiation}
                    onChange={(e) => setHpiRadiation(e.target.value)}
                    className="w-full h-9 px-3 rounded-md bg-surface border border-input text-foreground text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block font-semibold text-foreground mb-1">Aggravating Factors</label>
                  <input
                    type="text"
                    value={hpiAggravating}
                    onChange={(e) => setHpiAggravating(e.target.value)}
                    className="w-full h-9 px-3 rounded-md bg-surface border border-input text-foreground text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-foreground mb-1">Relieving Factors</label>
                  <input
                    type="text"
                    value={hpiRelieving}
                    onChange={(e) => setHpiRelieving(e.target.value)}
                    className="w-full h-9 px-3 rounded-md bg-surface border border-input text-foreground text-xs"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 3. Review of Systems (ROS) */}
          <Card>
            <CardHeader>
              <div>
                <CardTitle className="text-sm sm:text-base">3. Review of Systems (ROS)</CardTitle>
                <CardDescription>Select any additional constitutional or systemic symptoms you are experiencing.</CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {REVIEW_OF_SYSTEMS.map((cat) => (
                  <div key={cat.id} className="p-3 rounded-md border border-border bg-surface-alt/60 space-y-2">
                    <span className="font-bold text-foreground text-xs block">{cat.title}</span>
                    <div className="space-y-1">
                      {cat.symptoms.map((sym) => {
                        const isChecked = selectedRos.includes(sym.id);
                        return (
                          <label
                            key={sym.id}
                            className={`flex items-center gap-2 p-1.5 rounded cursor-pointer transition-colors ${
                              isChecked ? 'bg-primary-muted text-primary font-semibold' : 'hover:bg-surface'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {
                                if (isChecked) {
                                  setSelectedRos(selectedRos.filter((s) => s !== sym.id));
                                } else {
                                  setSelectedRos([...selectedRos, sym.id]);
                                }
                              }}
                              className="h-3.5 w-3.5 rounded border-border text-primary focus:ring-primary"
                            />
                            <span>{sym.label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 4. AYUSH Dashavidha Pariksha (If selected) */}
          {intakeMode === 'ayush' && (
            <Card>
              <CardHeader>
                <div>
                  <CardTitle className="text-sm sm:text-base flex items-center gap-2 text-amber-800 dark:text-amber-300">
                    <Sparkles className="h-4 w-4" />
                    4. AYUSH Dashavidha & Ashtavidha Pariksha Framework
                  </CardTitle>
                  <CardDescription>Ayurvedic constitution, digestion, and lifestyle parameters.</CardDescription>
                </div>
              </CardHeader>

              <CardContent className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-semibold text-foreground mb-1">Deha Prakriti (Constitution)</label>
                    <select
                      value={ayushPrakriti}
                      onChange={(e) => setAyushPrakriti(e.target.value)}
                      className="w-full h-9 px-3 rounded-md bg-surface border border-input text-foreground text-xs"
                    >
                      <option value="Vata-Pitta (वात-पित्त)">Vata-Pitta (वात-पित्त)</option>
                      <option value="Pitta-Kapha (पित्त-कफ)">Pitta-Kapha (पित्त-कफ)</option>
                      <option value="Vata-Kapha (वात-कफ)">Vata-Kapha (वात-कफ)</option>
                      <option value="Tridosha (त्रिदोष सम)">Tridosha (त्रिदोष सम)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-foreground mb-1">Jatharagni (Digestive Fire)</label>
                    <select
                      value={ayushAgni}
                      onChange={(e) => setAyushAgni(e.target.value)}
                      className="w-full h-9 px-3 rounded-md bg-surface border border-input text-foreground text-xs"
                    >
                      <option value="Samagni (Balanced / सम अग्नि)">Samagni (Balanced / सम अग्नि)</option>
                      <option value="Tikshnagni (Sharp / तीक्ष्णाग्नि)">Tikshnagni (Sharp / तीक्ष्णाग्नि)</option>
                      <option value="Mandagni (Sluggish / मन्दाग्नि)">Mandagni (Sluggish / मन्दाग्नि)</option>
                      <option value="Vishamagni (Irregular / विषमाग्नि)">Vishamagni (Irregular / विषमाग्नि)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-foreground mb-1">Koshtha (Bowel Nature)</label>
                    <select
                      value={ayushKoshtha}
                      onChange={(e) => setAyushKoshtha(e.target.value)}
                      className="w-full h-9 px-3 rounded-md bg-surface border border-input text-foreground text-xs"
                    >
                      <option value="Mridu (Soft / Fast)">Mridu (Soft / Fast)</option>
                      <option value="Madhyama (Moderate / Regular)">Madhyama (Moderate / Regular)</option>
                      <option value="Krura (Hard / Constipated)">Krura (Hard / Constipated)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-foreground mb-1">Ahara-Vihara (Dietary & Daily Routine Factors)</label>
                  <textarea
                    rows={2}
                    value={ayushAharaVihara}
                    onChange={(e) => setAyushAharaVihara(e.target.value)}
                    className="w-full p-2.5 rounded-md bg-surface border border-input text-foreground text-xs"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center pt-3">
            <Button size="md" variant="outline" onClick={() => setStep(2)} leftIcon={<ArrowLeft className="h-4 w-4" />}>
              Back: Consent
            </Button>
            <Button size="md" variant="primary" onClick={() => setStep(4)} rightIcon={<ArrowRight className="h-4 w-4" />}>
              Next: Scan Prior Physical Documents
            </Button>
          </div>
        </div>
      )}

      {/* ================= STEP 4: DOCUMENT UPLOAD & OCR REVIEW ================= */}
      {step === 4 && (
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Step 4: Prior Medical Document Digitization & OCR Review</CardTitle>
              <CardDescription>
                Scan or upload physical paper prescriptions, lab reports, and hospital discharge summaries.
              </CardDescription>
            </div>
            <Button
              size="sm"
              variant="primary"
              onClick={handleSimulateDocumentUpload}
              isLoading={isProcessingDoc}
              leftIcon={<Upload className="h-3.5 w-3.5" />}
            >
              Scan & Process Document
            </Button>
          </CardHeader>

          <CardContent className="space-y-5 text-xs">
            {/* Medication Safety / Interaction Notice */}
            <div className="p-3.5 rounded-md bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
              <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Medication Safety Review:</span>
                <span>Active asthma medications (Budecort Inhaler) noted on prescription. Potential interaction warning flagged for beta-blocker contraindication.</span>
              </div>
            </div>

            {/* Document Extraction List */}
            <div className="space-y-4">
              {documentsList.map((doc, idx) => (
                <div key={doc.id} className="p-4 rounded-md border border-border bg-surface-alt space-y-3">
                  <div className="flex items-center justify-between border-b border-border pb-2">
                    <div className="flex items-center gap-2.5">
                      <FileText className="h-4 w-4 text-primary" />
                      <div>
                        <span className="font-bold text-foreground text-sm block">{doc.documentTitle}</span>
                        <span className="text-[11px] text-muted-foreground">{doc.issuingFacility} • {doc.documentDate}</span>
                      </div>
                    </div>
                    <Badge variant="success" size="sm">
                      AI/OCR Extracted — Verified
                    </Badge>
                  </div>

                  {/* Extracted Diagnoses */}
                  {doc.diagnoses && doc.diagnoses.length > 0 && (
                    <div>
                      <span className="font-bold text-muted-foreground text-[11px] uppercase tracking-wider block mb-1">
                        Extracted Diagnoses:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {doc.diagnoses.map((d) => (
                          <span key={d.id} className="px-2 py-0.5 rounded bg-surface border border-border text-foreground text-xs flex items-center gap-1.5">
                            <span>{d.condition}</span>
                            <span className="text-[10px] text-emerald-600 font-bold">({d.confidence}% match)</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Extracted Prescriptions */}
                  {doc.medications && doc.medications.length > 0 && (
                    <div>
                      <span className="font-bold text-muted-foreground text-[11px] uppercase tracking-wider block mb-1">
                        Extracted Medications & Dosages:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {doc.medications.map((m) => (
                          <div key={m.id} className="p-2 rounded bg-surface border border-border flex items-center justify-between text-xs">
                            <div>
                              <span className="font-semibold text-foreground block">{m.medicineName}</span>
                              <span className="text-[11px] text-muted-foreground">{m.dosage} • {m.frequency} ({m.duration})</span>
                            </div>
                            <Badge variant="outline" size="sm">
                              Confirm
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Extracted Lab Investigations with High/Low flagging */}
                  {doc.investigations && doc.investigations.length > 0 && (
                    <div>
                      <span className="font-bold text-muted-foreground text-[11px] uppercase tracking-wider block mb-1">
                        Parsed Biomarkers & Reference Ranges:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {doc.investigations.map((inv) => (
                          <div key={inv.id} className="p-2 rounded bg-surface border border-border flex items-center justify-between text-xs">
                            <div>
                              <span className="font-semibold text-foreground block">{inv.testName}</span>
                              <span className="text-[11px] text-muted-foreground">Ref: {inv.referenceRange}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold font-mono text-foreground">{inv.resultValue} {inv.unit}</span>
                              <Badge
                                variant={inv.flag === 'low' ? 'danger' : inv.flag === 'high' ? 'warning' : 'success'}
                                size="sm"
                              >
                                {inv.flag.toUpperCase()}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-border">
              <Button size="md" variant="outline" onClick={() => setStep(3)} leftIcon={<ArrowLeft className="h-4 w-4" />}>
                Back: History
              </Button>
              <Button size="md" variant="primary" onClick={() => setStep(5)} rightIcon={<ArrowRight className="h-4 w-4" />}>
                Next: Review Clinical Summary
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ================= STEP 5: CLINICAL HISTORY SUMMARY ================= */}
      {step === 5 && (
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Step 5: Pre-Consultation Structured Clinical Summary</CardTitle>
              <CardDescription>
                AI-generated draft for attending clinician review (HL7 FHIR DocumentReference).
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  handleAudioGuidance(
                    `Clinical intake summary for ${patientName}. Chief complaint is ${chiefComplaint} with severity ${severity} out of 10. ${documentsList.length} medical records have been digitized.`
                  )
                }
                leftIcon={<Volume2 className="h-3.5 w-3.5 text-primary" />}
              >
                Listen to Summary
              </Button>
              <Badge variant="primary" size="sm">
                Physician Draft
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-5 text-xs">
            <div className="p-4 rounded-md bg-surface-alt border border-border font-mono text-xs text-foreground whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto">
              {generateClinicalHistorySummary(fullIntakeData)}
            </div>

            <div className="p-3 rounded-md bg-primary-muted/40 border border-primary/20 text-primary text-xs flex items-center justify-between">
              <span>Ready to submit. This clinical history summary will appear on Dr. Rohan Sharma's consultation screen.</span>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-border">
              <Button size="md" variant="outline" onClick={() => setStep(4)} leftIcon={<ArrowLeft className="h-4 w-4" />}>
                Back: Documents
              </Button>
              <Button
                size="md"
                variant="primary"
                onClick={handleSubmitIntake}
                rightIcon={<Check className="h-4 w-4" />}
              >
                Submit Intake & Generate OPD Token
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ================= STEP 6: CONSULTATION READY / OPD TOKEN ================= */}
      {step === 6 && (
        <Card>
          <CardContent className="py-8 space-y-6 text-center max-w-xl mx-auto">
            <div className="h-16 w-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center mx-auto text-2xl font-bold">
              ✓
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-widest text-primary block">
                Clinical Intake Completed & Synced
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                Your Health Summary is Ready for Consultation
              </h2>
              <p className="text-xs text-muted-foreground">
                Your pre-consultation clinical summary is now instantly visible on Dr. Rohan Sharma's screen.
              </p>
            </div>

            {/* Official OPD Token Card */}
            <div className="p-5 rounded-md border-2 border-primary bg-surface-alt text-center space-y-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                OPD Queue Token Number
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold text-primary font-mono tracking-wider">
                {tokenNumber}
              </div>
              <p className="text-xs text-foreground font-medium">
                Consultation Chamber: <strong>OPD Room 104</strong> • Attending: <strong>Dr. Rohan Sharma</strong>
              </p>
            </div>

            {/* Direct Link to Doctor Consultation View to Demonstrate Full-Circle Handoff */}
            <div className="space-y-2 pt-2">
              <Link to="/doctor/case/new" className="block">
                <Button size="lg" variant="primary" className="w-full" rightIcon={<ExternalLink className="h-4 w-4" />}>
                  Open Attending Doctor Consultation Screen (Dr. Rohan View)
                </Button>
              </Link>
              <div className="flex gap-2">
                <Link to="/patient/timeline" className="w-1/2">
                  <Button size="sm" variant="outline" className="w-full">
                    View Health Timeline
                  </Button>
                </Link>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-1/2"
                  onClick={() => {
                    setStep(1);
                    showToast('Intake form reset for demonstration.', 'info');
                  }}
                >
                  Start New Intake
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
