import React, { useState, useEffect, useRef } from 'react';
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
  RotateCw,
  Layers,
  HelpCircle,
  Eye,
  Info,
  PhoneCall,
  UserCheck,
  UserPlus,
  MapPin,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../components/common/Toast';
import {
  speakText,
  stopSpeaking,
  startSpeechRecognition,
  getLanguageBCP47,
  isSpeechRecognitionSupported,
} from '../../services/speechService';
import { verifyABHAId, generateConsentArtifact } from '../../services/abdmService';
import {
  PRESET_OCR_DOCUMENTS,
  OcrDocumentResult,
  simulateStagedOcrProcessing,
  OCR_PROCESSING_STAGES,
  ScannedPage,
} from '../../services/ocrService';
import {
  REVIEW_OF_SYSTEMS,
  FullIntakeRecord,
  evaluateRedFlags,
  generateClinicalHistorySummary,
  ADAPTIVE_COMPLAINT_FLOWS,
} from '../../services/clinicalIntakeService';

const INDIAN_LANGUAGES = [
  { code: 'en', name: 'English', script: 'English', greeting: 'Hello, welcome to Aarogyam.' },
  { code: 'hi', name: 'हिन्दी', script: 'Hindi', greeting: 'नमस्ते, आरोग्यम में आपका स्वागत है।' },
  { code: 'ta', name: 'தமிழ்', script: 'Tamil', greeting: 'வணக்கம், ஆரோக்கியம் உங்களை வரவேற்கிறது.' },
  { code: 'te', name: 'తెలుగు', script: 'Telugu', greeting: 'నమస్కారం, ఆరోగ్యమ్‌కి స్వాగతం.' },
  { code: 'bn', name: 'বাংলা', script: 'Bengali', greeting: 'নমস্কার, আরোগ্যমে আপনাকে স্বাগতম।' },
  { code: 'mr', name: 'मराठी', script: 'Marathi', greeting: 'नमस्कार, आरोग्यम मध्ये आपले स्वागत आहे.' },
  { code: 'gu', name: 'ગુજરાતી', script: 'Gujarati', greeting: 'નમસ્તે, આરોગ્યમમાં આપનું સ્વાગત છે.' },
  { code: 'kn', name: 'ಕನ್ನಡ', script: 'Kannada', greeting: 'ನಮಸ್ಕಾರ, ಆರೋಗ್ಯಂಗೆ ಸುಸ್ವಾಗತ.' },
  { code: 'ml', name: 'മലയാളം', script: 'Malayalam', greeting: 'നമസ്കാരം, ആരോഗ്യത്തിലേക്ക് സ്വാഗതം.' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ', script: 'Punjabi', greeting: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ, ਆਰੋਗਯਮ ਵਿੱਚ ਜੀ ਆਇਆਂ ਨੂੰ।' },
  { code: 'or', name: 'ଓଡ଼ିଆ', script: 'Odia', greeting: 'ନମସ୍କାର, ଆରୋଗ୍ୟମକୁ ସ୍ୱାଗତ।' },
];

export const ClinicalIntakePage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { patient, addDocument, saveClinicalIntakeSummary, logAudit } = useApp();

  // Progress Steps: 1. Identify | 2. Consent | 3. Adaptive History | 4. Documents & Scanner | 5. Summary | 6. Handoff
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);

  // Audio Guidance & Voice Input State
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [activeVoiceTarget, setActiveVoiceTarget] = useState<string | null>(null);

  // 1. Identify State: Existing vs New Patient
  const [patientType, setPatientType] = useState<'existing' | 'new'>('existing');
  const [abhaInput, setAbhaInput] = useState('12-3456-7890-1234');
  const [patientName, setPatientName] = useState(patient.name || 'Aditya Verma');
  const [patientAge, setPatientAge] = useState(patient.age || 20);
  const [patientGender, setPatientGender] = useState<'Male' | 'Female' | 'Other'>(
    (patient.gender as any) || 'Male'
  );
  const [patientPhone, setPatientPhone] = useState(patient.phone || '+91 98765 43210');
  const [emergencyContactName, setEmergencyContactName] = useState('Rajesh Verma (Father)');
  const [patientCity, setPatientCity] = useState('New Delhi (Central District)');
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [abhaVerified, setAbhaVerified] = useState(true);

  // 2. Consent State
  const [consentGranted, setConsentGranted] = useState(true);

  // 3. Clinical History State
  const [intakeMode, setIntakeMode] = useState<'allopathic' | 'ayush'>('allopathic');
  const [selectedComplaintId, setSelectedComplaintId] = useState<string>('chest-pain');
  const [chiefComplaint, setChiefComplaint] = useState('Chest Pain & Discomfort');
  const [chiefComplaintOther, setChiefComplaintOther] = useState('');
  const [severity, setSeverity] = useState(7);

  // Adaptive HPI Answers dictionary
  const [adaptiveAnswers, setAdaptiveAnswers] = useState<Record<string, any>>({
    site: 'Substernal / Central Chest',
    onset: 'Sudden acute onset (< 2 hours ago)',
    character: 'Crushing / Heavy pressure',
    radiation: 'Radiates to Left Arm & Jaw',
    associated: ['Severe Shortness of Breath (Dyspnoea)', 'Profuse Cold Sweating (Diaphoresis)'],
    aggravating: 'Worse with exertion, relieved by rest',
    duration: '2 hours',
  });

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

  // Current Medications & Allergies
  const [currentMedications, setCurrentMedications] = useState<string[]>([
    'Budecort Inhaler 200mcg (Twice daily)',
    'Montelukast 10mg (Nightly)',
  ]);
  const [allergies, setAllergies] = useState<string[]>([
    'Penicillin / Amoxicillin (Severe allergy - Anaphylactoid rash)',
  ]);

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

  // 4. Documents & Scanner State
  const [documentsList, setDocumentsList] = useState<OcrDocumentResult[]>([
    PRESET_OCR_DOCUMENTS[0],
    PRESET_OCR_DOCUMENTS[1],
  ]);
  const [activeDocTab, setActiveDocTab] = useState<'upload' | 'scanner'>('upload');
  const [docTypeSelection, setDocTypeSelection] = useState<OcrDocumentResult['documentType']>('Prescription');
  const [docLanguageSelection, setDocLanguageSelection] = useState('English / Hindi');

  // Scanner State
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [scannedPages, setScannedPages] = useState<ScannedPage[]>([]);
  const [currentRotation, setCurrentRotation] = useState<number>(0);

  // Staged OCR Processing
  const [isOcrProcessing, setIsOcrProcessing] = useState(false);
  const [ocrStage, setOcrStage] = useState<number>(1);

  // Summary View Mode (Structured Cards vs Raw FHIR/EMR Text)
  const [summaryViewMode, setSummaryViewMode] = useState<'structured' | 'raw'>('structured');

  // 5. OPD Token & Handoff State
  const [tokenNumber] = useState('OPD-MED-402');

  // Re-evaluate Red Flags on symptom changes
  useEffect(() => {
    const evaluation = evaluateRedFlags({
      chiefComplaint,
      hpi: {
        site: adaptiveAnswers.site || '',
        onset: adaptiveAnswers.onset || '',
        character: adaptiveAnswers.character || '',
        radiation: adaptiveAnswers.radiation || '',
        aggravating: adaptiveAnswers.aggravating || '',
        relieving: adaptiveAnswers.relieving || '',
        duration: adaptiveAnswers.duration || '2 hours',
        patientNarrative,
      },
      severity,
      reviewOfSystems: selectedRos,
    });
    setIsRedFlag(evaluation.isRedFlag);
    setRedFlagDetails(evaluation.reasons);
  }, [chiefComplaint, adaptiveAnswers, severity, selectedRos, patientNarrative]);

  // Camera Management
  const startCamera = async () => {
    setCameraError(null);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        setIsCameraActive(true);
      } else {
        setCameraError('Camera stream not supported in this browser. You can use standard file upload.');
      }
    } catch (err) {
      setCameraError('Hospital kiosk camera is offline or permission was denied. You can use standard file upload or simulated capture.');
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  // Capture Page in Scanner
  const handleCapturePage = () => {
    const newPageNum = scannedPages.length + 1;
    const placeholderThumbnails = [
      'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=400&q=80',
    ];
    const newPage: ScannedPage = {
      pageNumber: newPageNum,
      thumbnailUrl: placeholderThumbnails[(newPageNum - 1) % placeholderThumbnails.length],
      rotation: currentRotation,
    };
    setScannedPages([...scannedPages, newPage]);
    showToast(`Page ${newPageNum} captured successfully.`, 'success');
  };

  // Rotate Page
  const handleRotatePage = (pageNum: number) => {
    setScannedPages(
      scannedPages.map((p) =>
        p.pageNumber === pageNum ? { ...p, rotation: (p.rotation + 90) % 360 } : p
      )
    );
  };

  // Remove Page
  const handleRemovePage = (pageNum: number) => {
    const filtered = scannedPages.filter((p) => p.pageNumber !== pageNum);
    const renumbered = filtered.map((p, idx) => ({ ...p, pageNumber: idx + 1 }));
    setScannedPages(renumbered);
  };

  // Run Staged OCR Processing
  const handleRunOcrIngestion = async (sourceType: 'upload' | 'scanner') => {
    setIsOcrProcessing(true);
    setOcrStage(1);
    try {
      const newDoc = await simulateStagedOcrProcessing((stage) => {
        setOcrStage(stage);
      }, documentsList.length);

      newDoc.documentType = docTypeSelection;
      if (sourceType === 'scanner' && scannedPages.length > 0) {
        newDoc.pageCount = scannedPages.length;
        newDoc.pages = scannedPages;
      }

      setDocumentsList((prev) => [...prev, newDoc]);
      setScannedPages([]);
      stopCamera();
      showToast(`Document digitized & OCR entities extracted: ${newDoc.documentTitle}`, 'success');
    } catch {
      showToast('Document could not be processed. Please retry or continue without document.', 'error');
    } finally {
      setIsOcrProcessing(false);
    }
  };

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
        () => setIsSpeaking(false),
        selectedLanguage
      );
    }
  };

  // Question Voice Recording
  const handleVoiceInputForTarget = (targetKey: string) => {
    if (isListening && activeVoiceTarget === targetKey) {
      setIsListening(false);
      setActiveVoiceTarget(null);
    } else {
      setActiveVoiceTarget(targetKey);
      setIsListening(true);
      startSpeechRecognition(
        (transcript) => {
          if (targetKey === 'narrative') {
            setPatientNarrative(transcript);
          } else {
            setAdaptiveAnswers((prev) => ({ ...prev, [targetKey]: transcript }));
          }
        },
        (err) => {
          showToast(err, 'warning');
          setIsListening(false);
          setActiveVoiceTarget(null);
        },
        () => {
          setIsListening(false);
          setActiveVoiceTarget(null);
        },
        selectedLanguage
      );
    }
  };

  // Demo Persona Loader
  const handleLoadPersona = async (persona: 'aditya' | 'kamala' | 'ramesh') => {
    if (persona === 'aditya') {
      const res = await verifyABHAId('12-3456-7890-1234');
      setPatientType('existing');
      setPatientName(res.name);
      setAbhaInput(res.abhaId);
      setPatientAge(20);
      setPatientGender('Male');
      setSelectedComplaintId('chest-pain');
      setChiefComplaint('Chest Pain & Discomfort');
      setSeverity(8);
      setIntakeMode('allopathic');
      setAdaptiveAnswers({
        site: 'Substernal / Central Chest',
        onset: 'Sudden acute onset (< 2 hours ago)',
        character: 'Crushing / Heavy pressure',
        radiation: 'Radiates to Left Arm & Jaw',
        associated: ['Severe Shortness of Breath (Dyspnoea)', 'Profuse Cold Sweating (Diaphoresis)'],
        aggravating: 'Worse with exertion, relieved by rest',
      });
      showToast('Loaded Demo Patient: Aditya Verma (Acute Chest Pain / Cardiology)', 'info');
    } else if (persona === 'kamala') {
      const res = await verifyABHAId('98-7654-3210-9876');
      setPatientType('existing');
      setPatientName('Kamala Devi');
      setAbhaInput('98-7654-3210-9876');
      setPatientAge(68);
      setPatientGender('Female');
      setSelectedComplaintId('abdominal-pain');
      setChiefComplaint('Abdominal Distress & Pain');
      setSeverity(6);
      setIntakeMode('ayush');
      showToast('Loaded Demo Patient: Kamala Devi (AYUSH Joint & Pariksha Intake)', 'info');
    } else {
      setPatientType('new');
      setPatientName('Ramesh Kumar');
      setAbhaInput('44-1122-3344-5566');
      setPatientAge(34);
      setPatientGender('Male');
      setSelectedComplaintId('fever');
      setChiefComplaint('Fever & Temperature Spikes');
      setSeverity(5);
      setIntakeMode('allopathic');
      showToast('Loaded Demo Patient: Ramesh Kumar (First-Time Walk-In Registration)', 'info');
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
      site: adaptiveAnswers.site || '',
      onset: adaptiveAnswers.onset || '',
      character: adaptiveAnswers.character || '',
      radiation: adaptiveAnswers.radiation || '',
      aggravating: adaptiveAnswers.aggravating || '',
      relieving: adaptiveAnswers.relieving || '',
      duration: adaptiveAnswers.duration || '2 hours',
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
    saveClinicalIntakeSummary(fullIntakeData);

    documentsList.forEach((d) => {
      addDocument({
        patientId: patient.patientId || 'P-10001',
        title: d.documentTitle,
        category:
          d.documentType === 'Prescription'
            ? 'Prescriptions'
            : d.documentType === 'Lab Report'
            ? 'Lab Reports'
            : 'Discharge Summaries',
        date: d.documentDate,
        hospitalName: d.issuingFacility,
        doctorName: 'Dr. R. Sharma',
        fileSize: '1.2 MB',
        fileFormat: 'PDF',
        description: 'Digitized & OCR-verified during self-service clinical intake.',
      });
    });

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

  // Reset / Clear Session for Shared Kiosk Safety
  const handleResetSession = () => {
    setStep(1);
    setScannedPages([]);
    stopCamera();
    showToast('Kiosk session buffer cleared. Ready for next patient.', 'info');
  };

  const activeComplaintFlow = ADAPTIVE_COMPLAINT_FLOWS[selectedComplaintId] || ADAPTIVE_COMPLAINT_FLOWS['chest-pain'];

  return (
    <div className="space-y-6">
      {/* 1. Official Page Header */}
      <div className="bg-surface rounded-md border border-border p-4 sm:p-5 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-md bg-primary/10 text-primary flex items-center justify-center font-bold">
              <Stethoscope className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">
                Self-Service Clinical Intake Terminal
              </h1>
              <p className="text-xs text-muted-foreground">
                Pre-consultation history recording, document digitization, and triage for OPD appointments.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Audio Guidance TTS Button */}
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              handleAudioGuidance(
                step === 1
                  ? 'Please select your language and choose whether you are an existing patient with ABHA ID or a new patient.'
                  : step === 2
                  ? 'Please review the digital consent explanation under the Digital Personal Data Protection Act 2023.'
                  : step === 3
                  ? 'Please choose or speak your chief medical complaint and answer the guided questions.'
                  : step === 4
                  ? 'Please scan or upload your prior paper prescriptions and lab reports.'
                  : step === 5
                  ? 'Please review your complete clinical summary before it is sent to the doctor.'
                  : 'Your clinical intake is complete. Please proceed to the consultation room.'
              )
            }
            leftIcon={isSpeaking ? <VolumeX className="h-3.5 w-3.5 text-danger" /> : <Volume2 className="h-3.5 w-3.5 text-primary" />}
          >
            {isSpeaking ? 'Stop Audio' : 'Listen to Guide'}
          </Button>

          <Button size="sm" variant="ghost" onClick={handleResetSession} leftIcon={<RefreshCw className="h-3.5 w-3.5" />}>
            Start New Patient
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
            { num: 1, label: '1. Identify & Language' },
            { num: 2, label: '2. Consent & Privacy' },
            { num: 3, label: '3. Clinical History' },
            { num: 4, label: '4. Scan Documents' },
            { num: 5, label: '5. Summary Review' },
            { num: 6, label: '6. Complete' },
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

      {/* ================= STEP 1: IDENTIFY (EXISTING VS NEW PATIENT) & NATIVE LANGUAGE ================= */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Step 1: Patient Identification & Language Selection</CardTitle>
              <CardDescription>
                Choose your consultation language and identify with your Ayushman Bharat Health Account (ABHA ID) or register as a new patient.
              </CardDescription>
            </div>
            <Badge variant="success" size="sm">
              ABDM Ready (Demo)
            </Badge>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Native Indian Language Selector Grid */}
            <div className="space-y-2">
              <label className="block font-bold text-foreground text-xs uppercase tracking-wider">
                Select Language / भाषा चुनें / மொழியைத் தேர்ந்தெடுக்கவும்
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
                {INDIAN_LANGUAGES.map((lang) => {
                  const isSelected = selectedLanguage === lang.name || selectedLanguage.includes(lang.script);
                  return (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => {
                        setSelectedLanguage(lang.name);
                        showToast(`Language set to ${lang.name} (${lang.script})`, 'info');
                        speakText(lang.greeting, undefined, undefined, lang.name);
                      }}
                      className={`p-2.5 rounded-md border text-center transition-colors ${
                        isSelected
                          ? 'bg-primary text-primary-foreground font-bold shadow-xs border-primary'
                          : 'bg-surface border-border text-foreground hover:bg-surface-alt'
                      }`}
                    >
                      <span className="text-sm font-bold block">{lang.name}</span>
                      <span className="text-[10px] opacity-80 block">{lang.script}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Existing Patient vs New Patient Switcher */}
            <div className="p-1 rounded-md bg-surface-alt border border-border flex items-center gap-1.5 max-w-md">
              <button
                type="button"
                onClick={() => setPatientType('existing')}
                className={`w-1/2 py-2 px-3 rounded text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  patientType === 'existing'
                    ? 'bg-primary text-primary-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <UserCheck className="h-4 w-4" />
                Existing Patient (ABHA ID)
              </button>
              <button
                type="button"
                onClick={() => setPatientType('new')}
                className={`w-1/2 py-2 px-3 rounded text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  patientType === 'new'
                    ? 'bg-primary text-primary-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <UserPlus className="h-4 w-4" />
                New Patient Registration
              </button>
            </div>

            {/* Existing Patient Persona Shortcuts */}
            {patientType === 'existing' && (
              <div className="p-3.5 rounded-md bg-surface-alt border border-border space-y-2 text-xs">
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
            )}

            {/* Form Fields: Existing Patient */}
            {patientType === 'existing' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-foreground mb-1">Patient Full Name *</label>
                  <input
                    type="text"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full h-10 px-3 rounded-md bg-surface border border-input text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary"
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
                      className="w-full h-10 px-3 rounded-md bg-surface border border-input text-foreground font-mono text-xs focus:outline-none focus:ring-1 focus:ring-primary"
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
                      className="w-full h-10 px-3 rounded-md bg-surface border border-input text-foreground text-xs"
                    />
                    <select
                      value={patientGender}
                      onChange={(e) => setPatientGender(e.target.value as 'Male' | 'Female' | 'Other')}
                      className="w-full h-10 px-3 rounded-md bg-surface border border-input text-foreground text-xs"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-foreground mb-1">Registered Mobile Number</label>
                  <input
                    type="text"
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    className="w-full h-10 px-3 rounded-md bg-surface border border-input text-foreground text-xs"
                  />
                </div>
              </div>
            )}

            {/* Form Fields: New Patient Registration */}
            {patientType === 'new' && (
              <div className="space-y-4">
                <div className="p-3 rounded-md bg-primary-muted/20 border border-primary/30 text-xs flex items-center gap-2">
                  <UserPlus className="h-4 w-4 text-primary" />
                  <span>First-time patient registration. A temporary Hospital OPD Health ID will be generated upon submission.</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-semibold text-foreground mb-1">Full Legal Name *</label>
                    <input
                      type="text"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      placeholder="Enter patient full name"
                      className="w-full h-10 px-3 rounded-md bg-surface border border-input text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-foreground mb-1">Mobile Phone Number *</label>
                    <input
                      type="text"
                      value={patientPhone}
                      onChange={(e) => setPatientPhone(e.target.value)}
                      placeholder="+91 98765 00000"
                      className="w-full h-10 px-3 rounded-md bg-surface border border-input text-foreground text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-foreground mb-1">Age & Gender *</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        value={patientAge}
                        onChange={(e) => setPatientAge(Number(e.target.value))}
                        className="w-full h-10 px-3 rounded-md bg-surface border border-input text-foreground text-xs"
                      />
                      <select
                        value={patientGender}
                        onChange={(e) => setPatientGender(e.target.value as any)}
                        className="w-full h-10 px-3 rounded-md bg-surface border border-input text-foreground text-xs"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-foreground mb-1">City / District *</label>
                    <input
                      type="text"
                      value={patientCity}
                      onChange={(e) => setPatientCity(e.target.value)}
                      className="w-full h-10 px-3 rounded-md bg-surface border border-input text-foreground text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-foreground mb-1">Emergency Contact / Relative Name</label>
                    <input
                      type="text"
                      value={emergencyContactName}
                      onChange={(e) => setEmergencyContactName(e.target.value)}
                      className="w-full h-10 px-3 rounded-md bg-surface border border-input text-foreground text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-foreground mb-1">Aadhaar (Optional for ABHA creation)</label>
                    <input
                      type="text"
                      placeholder="XXXX-XXXX-XXXX (Optional demo)"
                      className="w-full h-10 px-3 rounded-md bg-surface border border-input text-foreground font-mono text-xs"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end pt-3 border-t border-border">
              <Button
                size="md"
                variant="primary"
                onClick={() => setStep(2)}
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                Proceed to Consent & Privacy Agreement
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ================= STEP 2: CLEAR LOW-LITERACY CONSENT ================= */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Step 2: Digital Consent & Privacy Agreement</CardTitle>
              <CardDescription>
                Compliance with Digital Personal Data Protection Act 2023 and ABDM consent architecture.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  handleAudioGuidance(
                    'What information is collected? Clinical history, prior medical documents, active medicines and lab reports. Why? To prepare your medical history for the doctor before consultation. Who will see it? Authorized hospital staff only.'
                  )
                }
                leftIcon={<Volume2 className="h-3.5 w-3.5 text-primary" />}
              >
                🔊 Listen to Consent Explanation
              </Button>
              <Badge variant="primary" size="sm">
                DPDP Act 2023
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-5 text-xs leading-relaxed">
            {/* 3 Clear Low-Literacy Visual Blocks */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-md bg-surface-alt border border-border space-y-2">
                <span className="font-bold text-foreground text-sm flex items-center gap-1.5">
                  <FileText className="h-4 w-4 text-primary" />
                  What is collected?
                </span>
                <ul className="space-y-1 text-muted-foreground">
                  <li className="flex items-center gap-1.5"><Check className="h-3 w-3 text-emerald-600" /> Current symptoms & pain severity</li>
                  <li className="flex items-center gap-1.5"><Check className="h-3 w-3 text-emerald-600" /> Uploaded prescriptions & lab reports</li>
                  <li className="flex items-center gap-1.5"><Check className="h-3 w-3 text-emerald-600" /> Current medications & allergies</li>
                </ul>
              </div>

              <div className="p-3.5 rounded-md bg-surface-alt border border-border space-y-2">
                <span className="font-bold text-foreground text-sm flex items-center gap-1.5">
                  <Stethoscope className="h-4 w-4 text-primary" />
                  Why is it collected?
                </span>
                <p className="text-muted-foreground leading-relaxed">
                  To prepare your structured clinical summary so your doctor can review prior history immediately during OPD consultation.
                </p>
              </div>

              <div className="p-3.5 rounded-md bg-surface-alt border border-border space-y-2">
                <span className="font-bold text-foreground text-sm flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  Who will see it?
                </span>
                <p className="text-muted-foreground leading-relaxed">
                  Only authorized hospital physicians and triage officers under secure ABDM token (Consent valid for 24 hours).
                </p>
              </div>
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
                Back: Identify
              </Button>
              <Button
                size="md"
                variant="primary"
                disabled={!consentGranted}
                onClick={() => setStep(3)}
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                Accept & Start Clinical Questions
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ================= STEP 3: ADAPTIVE CLINICAL HISTORY (SPEAK & TAP) ================= */}
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
            <div className="p-4 rounded-md bg-rose-50 dark:bg-rose-950/50 border-2 border-rose-400 dark:border-rose-800 text-rose-950 dark:text-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm animate-fade-in">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-6 w-6 text-rose-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5 text-xs">
                  <span className="font-bold text-sm block text-rose-800 dark:text-rose-200 uppercase tracking-wide">
                    🚨 EMERGENCY SYMPTOMS DETECTED: Immediate Clinical Attention May Be Required
                  </span>
                  <p className="leading-relaxed font-medium">
                    Please stop the intake. A healthcare staff member has been alerted: <strong>{redFlagDetails[0]}</strong>. Please remain seated.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => showToast('OPD triage staff notified for immediate priority assessment.', 'info')}
                >
                  Contact Triage Staff
                </Button>
              </div>
            </div>
          )}

          {/* Active Voice Interaction Banner */}
          <div className="p-4 rounded-md border border-primary/40 bg-primary-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-start gap-3">
              <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${isListening ? 'bg-rose-500 text-white animate-pulse' : 'bg-primary/10 text-primary'}`}>
                {isListening ? <Mic className="h-5 w-5 animate-bounce" /> : <Volume2 className="h-5 w-5" />}
              </div>
              <div>
                <span className="font-bold text-sm text-foreground flex items-center gap-2">
                  {isListening ? "🎙️ I'm listening... Tell me what is troubling you" : "🎙️ Speak or Tap to Answer Questions"}
                </span>
                <p className="text-xs text-muted-foreground mt-0.5">
                  You can describe your symptoms naturally in your own words — no medical terminology needed.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {isListening ? (
                <Button size="sm" variant="danger" onClick={() => setIsListening(false)} leftIcon={<MicOff className="h-3.5 w-3.5" />}>
                  Stop Listening
                </Button>
              ) : (
                <Button size="sm" variant="primary" onClick={() => handleVoiceInputForTarget('narrative')} leftIcon={<Mic className="h-3.5 w-3.5" />}>
                  Start Voice Answer
                </Button>
              )}
            </div>
          </div>

          {/* 1. Chief Complaint Selection */}
          <Card>
            <CardHeader>
              <div>
                <CardTitle className="text-sm sm:text-base">1. Presenting Chief Complaint (Tap or Speak)</CardTitle>
                <CardDescription>Select what is bothering you today, or tap the microphone to speak your answer.</CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
                {[
                  { id: 'chest-pain', label: 'Chest Pain & Discomfort', hindi: 'सीने में दर्द या भारीपन', icon: '🫀' },
                  { id: 'fever', label: 'Fever & Chills', hindi: 'बुखार और कंपकंपी', icon: '🌡️' },
                  { id: 'cough', label: 'Cough & Breathlessness', hindi: 'खांसी और सांस की तकलीफ', icon: '🫁' },
                  { id: 'headache', label: 'Severe Headache', hindi: 'तीव्र सर दर्द', icon: '🧠' },
                  { id: 'abdominal-pain', label: 'Abdominal Distress', hindi: 'पेट दर्द या गैस', icon: '🩺' },
                ].map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      setSelectedComplaintId(c.id);
                      setChiefComplaint(c.label);
                    }}
                    className={`p-3.5 rounded-md border text-left transition-colors ${
                      selectedComplaintId === c.id
                        ? 'bg-primary-muted border-primary text-primary font-bold shadow-xs'
                        : 'bg-surface border-border text-foreground hover:bg-surface-alt'
                    }`}
                  >
                    <span className="text-lg block mb-1">{c.icon}</span>
                    <span className="font-semibold block">{c.label}</span>
                    <span className="text-[10px] text-muted-foreground">{c.hindi}</span>
                  </button>
                ))}
              </div>

              {/* Severity Rating */}
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
            </CardContent>
          </Card>

          {/* 2. Adaptive Questions for Selected Complaint */}
          <Card>
            <CardHeader>
              <div>
                <CardTitle className="text-sm sm:text-base">
                  2. Clinical Details: {activeComplaintFlow.name}
                </CardTitle>
                <CardDescription>
                  You mentioned <strong>{chiefComplaint}</strong> — please answer these quick questions. You can tap choices or speak your answers.
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-5 text-xs">
              {activeComplaintFlow.questions.map((q) => {
                const currentVal = adaptiveAnswers[q.id];
                const isListeningThis = isListening && activeVoiceTarget === q.id;

                return (
                  <div key={q.id} className="p-3.5 rounded-md bg-surface-alt border border-border space-y-2.5">
                    <div className="flex items-center justify-between">
                      <label className="font-bold text-foreground block">
                        {q.label} {q.labelHindi && <span className="text-muted-foreground font-normal">({q.labelHindi})</span>}
                      </label>
                      <Button
                        size="sm"
                        variant={isListeningThis ? 'danger' : 'outline'}
                        onClick={() => handleVoiceInputForTarget(q.id)}
                        leftIcon={isListeningThis ? <MicOff className="h-3.5 w-3.5" /> : <Mic className="h-3.5 w-3.5 text-primary" />}
                      >
                        {isListeningThis ? 'Listening...' : 'Speak Answer'}
                      </Button>
                    </div>

                    {q.type === 'select' && q.options && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {q.options.map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setAdaptiveAnswers({ ...adaptiveAnswers, [q.id]: opt })}
                            className={`p-3 rounded border text-left transition-colors ${
                              currentVal === opt
                                ? 'bg-primary-muted border-primary text-primary font-bold shadow-xs'
                                : 'bg-surface border-border text-foreground hover:bg-surface-alt'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}

                    {q.type === 'multiselect' && q.options && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {q.options.map((opt) => {
                          const isChecked = Array.isArray(currentVal) && currentVal.includes(opt);
                          return (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => {
                                const arr = Array.isArray(currentVal) ? [...currentVal] : [];
                                if (isChecked) {
                                  setAdaptiveAnswers({ ...adaptiveAnswers, [q.id]: arr.filter((x) => x !== opt) });
                                } else {
                                  setAdaptiveAnswers({ ...adaptiveAnswers, [q.id]: [...arr, opt] });
                                }
                              }}
                              className={`p-3 rounded border text-left transition-colors flex items-center justify-between ${
                                isChecked
                                  ? 'bg-primary-muted border-primary text-primary font-bold shadow-xs'
                                  : 'bg-surface border-border text-foreground hover:bg-surface-alt'
                              }`}
                            >
                              <span>{opt}</span>
                              {isChecked && <Check className="h-3.5 w-3.5 text-primary" />}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Spoken Narration */}
              <div className="space-y-1.5 pt-2">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-foreground">
                    Additional Remarks / Spoken Narrative
                  </label>
                  <Button
                    size="sm"
                    variant={isListening && activeVoiceTarget === 'narrative' ? 'danger' : 'outline'}
                    onClick={() => handleVoiceInputForTarget('narrative')}
                    leftIcon={
                      isListening && activeVoiceTarget === 'narrative' ? (
                        <MicOff className="h-3.5 w-3.5" />
                      ) : (
                        <Mic className="h-3.5 w-3.5 text-primary" />
                      )
                    }
                  >
                    {isListening && activeVoiceTarget === 'narrative' ? 'Listening...' : 'Speak Narrative'}
                  </Button>
                </div>
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

          {/* 3. Review of Systems (ROS) */}
          <Card>
            <CardHeader>
              <div>
                <CardTitle className="text-sm sm:text-base">3. Review of Systems (ROS)</CardTitle>
                <CardDescription>Select any other constitutional symptoms you are experiencing.</CardDescription>
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
                            className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors ${
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
                              className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
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

          {/* 4. AYUSH Mode Dashavidha Pariksha */}
          {intakeMode === 'ayush' && (
            <Card>
              <CardHeader>
                <div>
                  <CardTitle className="text-sm sm:text-base flex items-center gap-2 text-amber-800 dark:text-amber-300">
                    <Sparkles className="h-4 w-4" />
                    4. AYUSH Dashavidha & Ashtavidha Pariksha
                  </CardTitle>
                  <CardDescription>Ayurvedic constitution, digestion fire, and lifestyle parameters.</CardDescription>
                </div>
              </CardHeader>

              <CardContent className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-semibold text-foreground mb-1">Deha Prakriti (Constitution)</label>
                    <select
                      value={ayushPrakriti}
                      onChange={(e) => setAyushPrakriti(e.target.value)}
                      className="w-full h-10 px-3 rounded-md bg-surface border border-input text-foreground text-xs"
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
                      className="w-full h-10 px-3 rounded-md bg-surface border border-input text-foreground text-xs"
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
                      className="w-full h-10 px-3 rounded-md bg-surface border border-input text-foreground text-xs"
                    >
                      <option value="Mridu (Soft / Fast)">Mridu (Soft / Fast)</option>
                      <option value="Madhyama (Moderate / Regular)">Madhyama (Moderate / Regular)</option>
                      <option value="Krura (Hard / Constipated)">Krura (Hard / Constipated)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-foreground mb-1">Ahara-Vihara (Dietary & Routine Factors)</label>
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
              Next: Scan / Upload Medical Documents
            </Button>
          </div>
        </div>
      )}

      {/* ================= STEP 4: DOCUMENT UPLOAD & MULTI-PAGE KIOSK SCANNER ================= */}
      {step === 4 && (
        <div className="space-y-5">
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Step 4: Upload or Scan Prior Medical Documents</CardTitle>
                <CardDescription>
                  Ingest physical paper prescriptions, lab panels, and discharge summaries into your medical timeline.
                </CardDescription>
              </div>
              <div className="flex items-center gap-1.5 bg-surface-alt p-1 rounded-md border border-border">
                <button
                  type="button"
                  onClick={() => {
                    setActiveDocTab('upload');
                    stopCamera();
                  }}
                  className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
                    activeDocTab === 'upload' ? 'bg-primary text-primary-foreground shadow-xs' : 'text-muted-foreground'
                  }`}
                >
                  Upload File
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveDocTab('scanner');
                    startCamera();
                  }}
                  className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
                    activeDocTab === 'scanner' ? 'bg-primary text-primary-foreground shadow-xs' : 'text-muted-foreground'
                  }`}
                >
                  Hospital Scanner / Camera
                </button>
              </div>
            </CardHeader>

            <CardContent className="space-y-5 text-xs">
              {/* Document Meta Configuration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-md bg-surface-alt border border-border">
                <div>
                  <label className="block font-semibold text-foreground mb-1">Document Category</label>
                  <select
                    value={docTypeSelection}
                    onChange={(e) => setDocTypeSelection(e.target.value as any)}
                    className="w-full h-10 px-3 rounded-md bg-surface border border-input text-foreground text-xs"
                  >
                    <option value="Prescription">Prescription (OPD Slip / Rx)</option>
                    <option value="Lab Report">Laboratory Report (Biochemistry / Blood)</option>
                    <option value="Discharge Summary">Hospital Discharge Summary</option>
                    <option value="Imaging Report">Imaging Report (X-Ray / MRI / USG)</option>
                    <option value="Consultation Note">Consultation Note</option>
                    <option value="Other">Other Medical Record</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-foreground mb-1">Document Language (for OCR)</label>
                  <select
                    value={docLanguageSelection}
                    onChange={(e) => setDocLanguageSelection(e.target.value)}
                    className="w-full h-10 px-3 rounded-md bg-surface border border-input text-foreground text-xs"
                  >
                    <option value="English / Hindi">English / Hindi (Bilingual Rx)</option>
                    <option value="English Only">English Only</option>
                    <option value="Tamil">தமிழ் (Tamil)</option>
                    <option value="Bengali">বাংলা (Bengali)</option>
                    <option value="Telugu">తెలుగు (Telugu)</option>
                    <option value="Marathi">मराठी (Marathi)</option>
                  </select>
                </div>
              </div>

              {/* Option A: File Upload UI */}
              {activeDocTab === 'upload' && (
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center space-y-3 bg-surface hover:bg-surface-alt/50 transition-colors">
                  <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
                    <Upload className="h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                    <span className="font-bold text-foreground block text-sm">
                      Choose physical medical file to ingest
                    </span>
                    <p className="text-muted-foreground text-xs">
                      Supports PDF, JPG, JPEG, PNG, or HEIC (Up to 10 MB per file)
                    </p>
                  </div>
                  <div>
                    <Button
                      size="md"
                      variant="primary"
                      onClick={() => handleRunOcrIngestion('upload')}
                      isLoading={isOcrProcessing}
                      leftIcon={<ScanLine className="h-4 w-4" />}
                    >
                      {isOcrProcessing ? 'Extracting Medical Entities...' : 'Select File & Start OCR Ingestion'}
                    </Button>
                  </div>
                </div>
              )}

              {/* Option B: Multi-Page Kiosk Scanner UI */}
              {activeDocTab === 'scanner' && (
                <div className="space-y-4">
                  <div className="relative rounded-lg overflow-hidden border-2 border-primary/40 bg-black aspect-video max-h-72 flex items-center justify-center">
                    {/* Live Camera Viewfinder or Fallback */}
                    <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />

                    {!isCameraActive && (
                      <div className="absolute inset-0 bg-surface-alt flex flex-col items-center justify-center p-4 text-center space-y-2">
                        <Camera className="h-10 w-10 text-muted-foreground" />
                        <span className="font-bold text-foreground text-sm">
                          Hospital Kiosk Flatbed / Camera Stand Ready
                        </span>
                        <p className="text-muted-foreground text-xs max-w-sm">
                          {cameraError || 'Position the prescription or lab report squarely on the scanner tray.'}
                        </p>
                      </div>
                    )}

                    {/* Overlay Frame Alignment Guide */}
                    <div className="absolute inset-4 border border-dashed border-white/60 pointer-events-none rounded flex items-center justify-center">
                      <span className="text-[11px] bg-black/60 text-white px-2.5 py-1 rounded">
                        Align Paper Document Within Frame
                      </span>
                    </div>
                  </div>

                  {/* Scanner Actions Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-md bg-surface-alt border border-border">
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="primary" onClick={handleCapturePage} leftIcon={<Camera className="h-3.5 w-3.5" />}>
                        Capture Page ({scannedPages.length + 1})
                      </Button>
                      {scannedPages.length > 0 && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRunOcrIngestion('scanner')}
                          isLoading={isOcrProcessing}
                          leftIcon={<Check className="h-3.5 w-3.5" />}
                        >
                          Finish & Process {scannedPages.length} Page(s)
                        </Button>
                      )}
                    </div>

                    <span className="text-xs font-semibold text-muted-foreground">
                      Scanned Pages: <strong className="text-foreground">{scannedPages.length}</strong>
                    </span>
                  </div>

                  {/* Scanned Pages Strip */}
                  {scannedPages.length > 0 && (
                    <div className="space-y-2">
                      <span className="font-bold text-foreground text-xs block">
                        Captured Pages in this Document:
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        {scannedPages.map((pg) => (
                          <div key={pg.pageNumber} className="p-2 rounded border border-border bg-surface space-y-1.5">
                            <div className="aspect-[3/4] bg-surface-alt rounded overflow-hidden relative">
                              <img
                                src={pg.thumbnailUrl}
                                alt={`Page ${pg.pageNumber}`}
                                className="w-full h-full object-cover transition-transform"
                                style={{ transform: `rotate(${pg.rotation}deg)` }}
                              />
                              <span className="absolute top-1 left-1 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded font-mono font-bold">
                                Pg {pg.pageNumber}
                              </span>
                            </div>
                            <div className="flex justify-between items-center pt-1">
                              <button
                                type="button"
                                onClick={() => handleRotatePage(pg.pageNumber)}
                                className="text-[11px] text-primary hover:underline flex items-center gap-1"
                              >
                                <RotateCw className="h-3 w-3" /> Rotate
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRemovePage(pg.pageNumber)}
                                className="text-[11px] text-danger hover:underline flex items-center gap-1"
                              >
                                <Trash2 className="h-3 w-3" /> Remove
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Staged OCR Progressive Tracker */}
              {isOcrProcessing && (
                <div className="p-4 rounded-md border border-primary/40 bg-primary-muted/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground text-sm flex items-center gap-2">
                      <ScanLine className="h-4 w-4 text-primary animate-spin" />
                      OCR Extraction Pipeline in Progress...
                    </span>
                    <span className="text-xs font-mono font-bold text-primary">
                      Stage {ocrStage} of 6
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {OCR_PROCESSING_STAGES.map((stg) => {
                      const isComplete = ocrStage > stg.stage;
                      const isCurrent = ocrStage === stg.stage;
                      return (
                        <div
                          key={stg.stage}
                          className={`flex items-center gap-2.5 text-xs py-1 px-2 rounded ${
                            isCurrent
                              ? 'bg-surface font-bold text-primary'
                              : isComplete
                              ? 'text-foreground opacity-80'
                              : 'text-muted-foreground opacity-40'
                          }`}
                        >
                          <span
                            className={`h-4 w-4 rounded-full flex items-center justify-center text-[10px] font-mono ${
                              isComplete
                                ? 'bg-emerald-600 text-white'
                                : isCurrent
                                ? 'bg-primary text-white animate-pulse'
                                : 'bg-surface-alt border border-border'
                            }`}
                          >
                            {isComplete ? '✓' : stg.stage}
                          </span>
                          <span>{stg.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* OCR Review & Human Verification Strip */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between border-b border-border pb-2">
                  <span className="font-bold text-foreground text-sm">
                    Digitized Documents & Extracted Findings ({documentsList.length})
                  </span>
                  <Badge variant="primary" size="sm">
                    OCR Verified Draft
                  </Badge>
                </div>

                {documentsList.map((doc) => (
                  <div key={doc.id} className="p-4 rounded-md border border-border bg-surface-alt space-y-3.5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-2.5">
                      <div className="flex items-center gap-2.5">
                        <FileText className="h-4 w-4 text-primary shrink-0" />
                        <div>
                          <span className="font-bold text-foreground text-sm block">{doc.documentTitle}</span>
                          <span className="text-[11px] text-muted-foreground">
                            {doc.issuingFacility} • {doc.documentDate} • {doc.detectedLanguage}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {doc.isHandwritten && (
                          <Badge variant="warning" size="sm">
                            ✍️ Handwritten Document Detected
                          </Badge>
                        )}
                        <Badge variant="success" size="sm">
                          Verified
                        </Badge>
                      </div>
                    </div>

                    {/* Extracted Diagnoses */}
                    {doc.diagnoses && doc.diagnoses.length > 0 && (
                      <div>
                        <span className="font-bold text-muted-foreground text-[11px] uppercase tracking-wider block mb-1">
                          Extracted Diagnoses:
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {doc.diagnoses.map((d) => (
                            <div
                              key={d.id}
                              className="px-2.5 py-1 rounded bg-surface border border-border text-foreground text-xs flex items-center gap-2"
                            >
                              <span>{d.condition}</span>
                              <Badge
                                variant={
                                  d.confidenceLevel === 'High confidence'
                                    ? 'success'
                                    : d.confidenceLevel === 'Review recommended'
                                    ? 'warning'
                                    : 'danger'
                                }
                                size="sm"
                              >
                                {d.confidenceLevel} ({d.confidenceScore}%)
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Extracted Medications */}
                    {doc.medications && doc.medications.length > 0 && (
                      <div>
                        <span className="font-bold text-muted-foreground text-[11px] uppercase tracking-wider block mb-1">
                          Extracted Medications:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {doc.medications.map((m) => (
                            <div
                              key={m.id}
                              className="p-2.5 rounded bg-surface border border-border flex items-center justify-between text-xs"
                            >
                              <div>
                                <span className="font-semibold text-foreground block">{m.medicineName}</span>
                                <span className="text-[11px] text-muted-foreground">
                                  {m.dosage} • {m.frequency} ({m.duration})
                                </span>
                              </div>
                              <Badge variant="outline" size="sm">
                                {m.confidenceLevel}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Extracted Investigations with Low/Normal/High */}
                    {doc.investigations && doc.investigations.length > 0 && (
                      <div>
                        <span className="font-bold text-muted-foreground text-[11px] uppercase tracking-wider block mb-1">
                          Biomarkers & Diagnostic Values:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {doc.investigations.map((inv) => (
                            <div
                              key={inv.id}
                              className="p-2.5 rounded bg-surface border border-border flex items-center justify-between text-xs"
                            >
                              <div>
                                <span className="font-semibold text-foreground block">{inv.testName}</span>
                                <span className="text-[11px] text-muted-foreground">Ref: {inv.referenceRange}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold font-mono text-foreground">
                                  {inv.resultValue} {inv.unit}
                                </span>
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
        </div>
      )}

      {/* ================= STEP 5: STRUCTURED CLINICAL SUMMARY (PROFESSIONAL EMR DOCUMENT) ================= */}
      {step === 5 && (
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Step 5: Pre-Consultation Structured Clinical Summary</CardTitle>
              <CardDescription>
                Compiled from patient intake answers and verified document extractions.
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
                🔊 Listen to Summary
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setSummaryViewMode(summaryViewMode === 'structured' ? 'raw' : 'structured')}
              >
                {summaryViewMode === 'structured' ? 'View Raw EMR' : 'View Formatted Cards'}
              </Button>
              <Badge variant="primary" size="sm">
                Physician Draft
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-5 text-xs">
            {/* Physician Verification Disclaimer */}
            <div className="p-3 rounded-md bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
              <Info className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">DRAFT FOR PHYSICIAN REVIEW — Verification Required:</strong>
                <span>This summary has been compiled from patient voice/touch responses and digitized prior records. Attending clinician verification is required prior to finalizing clinical orders.</span>
              </div>
            </div>

            {/* View Mode: Structured Visual Document */}
            {summaryViewMode === 'structured' ? (
              <div className="space-y-4">
                {/* 1. Patient & Intake Header Bar */}
                <div className="p-3.5 rounded-md bg-surface-alt border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-sm font-bold text-foreground block">
                      {patientName} ({patientAge}Y / {patientGender})
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      Health ID: {abhaInput} • Mobile: {patientPhone} • Language: {selectedLanguage}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="success" size="sm">DPDP Act Consent Granted</Badge>
                    <Badge variant="primary" size="sm">{intakeMode === 'ayush' ? 'AYUSH Intake' : 'Allopathic Intake'}</Badge>
                  </div>
                </div>

                {/* 2. Chief Complaint & HPI Card */}
                <div className="p-4 rounded-md border border-border bg-surface space-y-2.5">
                  <div className="flex items-center justify-between border-b border-border pb-2">
                    <span className="font-bold text-foreground text-sm flex items-center gap-2">
                      <Stethoscope className="h-4 w-4 text-primary" />
                      1. Chief Complaint & History of Present Illness (HPI)
                    </span>
                    <Badge variant={severity >= 8 ? 'danger' : severity >= 5 ? 'warning' : 'success'} size="sm">
                      Severity: {severity}/10
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="font-semibold text-muted-foreground block">Chief Complaint:</span>
                      <span className="font-bold text-foreground text-sm">{chiefComplaint}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-muted-foreground block">Site & Radiation:</span>
                      <span className="text-foreground">{adaptiveAnswers.site || 'Substernal'} → {adaptiveAnswers.radiation || 'Left Arm'}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-muted-foreground block">Onset & Character:</span>
                      <span className="text-foreground">{adaptiveAnswers.onset || 'Acute'} ({adaptiveAnswers.character || 'Crushing'})</span>
                    </div>
                    <div>
                      <span className="font-semibold text-muted-foreground block">Aggravating / Relieving:</span>
                      <span className="text-foreground">{adaptiveAnswers.aggravating || 'Exertion'} / {adaptiveAnswers.relieving || 'Rest'}</span>
                    </div>
                  </div>
                  {patientNarrative && (
                    <div className="p-2.5 rounded bg-surface-alt border border-border text-xs">
                      <span className="font-semibold text-foreground block mb-0.5">Patient Spoken Narration:</span>
                      <span className="text-muted-foreground italic">"{patientNarrative}"</span>
                    </div>
                  )}
                </div>

                {/* 3. Past Medical, Surgical & Medications */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-md border border-border bg-surface space-y-2">
                    <span className="font-bold text-foreground block">2. Past Medical & Surgical History</span>
                    <div className="space-y-1">
                      <span className="text-muted-foreground block">
                        • Medical: <strong className="text-foreground">{pastMedicalHistory.join(', ') || 'None reported'}</strong>
                      </span>
                      <span className="text-muted-foreground block">
                        • Surgical: <strong className="text-foreground">{pastSurgicalHistory.join(', ') || 'No prior surgeries'}</strong>
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-md border border-border bg-surface space-y-2">
                    <span className="font-bold text-foreground block">3. Medications & Known Allergies</span>
                    <div className="space-y-1">
                      <span className="text-muted-foreground block">
                        • Active Prescriptions: <strong className="text-foreground">{currentMedications.join('; ') || 'None'}</strong>
                      </span>
                      <div className="flex items-center gap-1.5 text-rose-700 dark:text-rose-300 font-semibold">
                        <AlertTriangle className="h-3.5 w-3.5" />
                        <span>Allergies: {allergies.join(', ') || 'No Known Drug Allergies (NKDA)'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. Family History & Review of Systems */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-md border border-border bg-surface space-y-2">
                    <span className="font-bold text-foreground block">4. Family & Lifestyle History</span>
                    <p className="text-muted-foreground">
                      Family: <strong className="text-foreground">{familyHistory.join(', ') || 'Non-contributory'}</strong><br />
                      Diet: {lifestyle.diet} • Smoking: {lifestyle.smoking} • Alcohol: {lifestyle.alcohol} • Activity: {lifestyle.exercise}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-md border border-border bg-surface space-y-2">
                    <span className="font-bold text-foreground block">5. Review of Systems (ROS)</span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedRos.map((r) => (
                        <span key={r} className="px-2 py-0.5 rounded bg-surface-alt border border-border text-foreground text-[11px]">
                          {r}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 5. Digitized Prior Documents Lineage Strip */}
                <div className="p-3.5 rounded-md border border-border bg-surface space-y-2">
                  <span className="font-bold text-foreground block">6. Ingested Prior Documents ({documentsList.length})</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {documentsList.map((d) => (
                      <div key={d.id} className="p-2 rounded bg-surface-alt border border-border flex items-center justify-between text-xs">
                        <div>
                          <span className="font-semibold text-foreground block">{d.documentTitle}</span>
                          <span className="text-[10px] text-muted-foreground">{d.issuingFacility} ({d.documentDate})</span>
                        </div>
                        <Badge variant="success" size="sm">OCR Synced</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* View Mode: Raw EMR / FHIR Summary Text */
              <div className="p-4 rounded-md bg-surface-alt border border-border font-mono text-xs text-foreground whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto">
                {generateClinicalHistorySummary(fullIntakeData)}
              </div>
            )}

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
                  onClick={handleResetSession}
                >
                  Start New Patient
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
