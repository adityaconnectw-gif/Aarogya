import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Stethoscope,
  Activity,
  Heart,
  Thermometer,
  Pill,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Plus,
  Trash2,
  Printer,
  FileCheck2,
  ShieldCheck,
  FileText,
  Check,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/common/Table';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/common/Toast';
import { PrescriptionItem, ConditionSeverity } from '../../types';
import { formatDate } from '../../utils/formatters';
import { generateClinicalHistorySummary } from '../../services/clinicalIntakeService';

export const DigitalCaseTakingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { patient, completeConsultationWorkflow, clinicalIntakeSummary } = useApp();
  const { showToast } = useToast();

  const [step, setStep] = useState<number>(1);
  const [completedResult, setCompletedResult] = useState<any | null>(null);
  const [showIntakeDetails, setShowIntakeDetails] = useState<boolean>(false);

  // STEP 1: Chief Complaint
  const [chiefComplaint, setChiefComplaint] = useState(
    clinicalIntakeSummary?.chiefComplaint || 'Acute fever with productive cough and mild sore throat'
  );
  const [duration, setDuration] = useState('3 days');
  const [complaintSeverity, setComplaintSeverity] = useState<'Mild' | 'Moderate' | 'Severe'>('Moderate');
  const [additionalNotes, setAdditionalNotes] = useState(
    clinicalIntakeSummary?.hpi?.patientNarrative || 'Worse in the evenings. Patient has taken home fluids.'
  );

  // STEP 2: History
  const [presentIllness, setPresentIllness] = useState(
    clinicalIntakeSummary
      ? `Onset: ${clinicalIntakeSummary.hpi.onset}. Site: ${clinicalIntakeSummary.hpi.site}. Character: ${clinicalIntakeSummary.hpi.character}. Radiation: ${clinicalIntakeSummary.hpi.radiation}. Aggravating: ${clinicalIntakeSummary.hpi.aggravating}. Relieving: ${clinicalIntakeSummary.hpi.relieving}.`
      : 'Patient reports sudden onset fever up to 101 F with dry cough progressing to throat irritation.'
  );
  const [previousIllness, setPreviousIllness] = useState(
    clinicalIntakeSummary?.pastMedicalHistory?.join(', ') || 'Bronchial asthma diagnosed in 2024 (moderate, controlled under Budecort).'
  );
  const [familyHistory, setFamilyHistory] = useState(
    clinicalIntakeSummary?.familyHistory?.join(', ') || 'Paternal history of hypertension. No diabetes.'
  );
  const [surgicalHistory, setSurgicalHistory] = useState(
    clinicalIntakeSummary?.pastSurgicalHistory?.join(', ') || 'No prior surgeries.'
  );
  const [currentMedication, setCurrentMedication] = useState(
    clinicalIntakeSummary?.currentMedications?.join('; ') || 'Budecort Inhaler 200mcg as needed.'
  );

  const handleImportIntakeDraft = () => {
    if (clinicalIntakeSummary) {
      setChiefComplaint(clinicalIntakeSummary.chiefComplaint);
      setPresentIllness(
        `SOCRATES Breakdown: Onset: ${clinicalIntakeSummary.hpi.onset}. Site: ${clinicalIntakeSummary.hpi.site}. Character: ${clinicalIntakeSummary.hpi.character}. Radiation: ${clinicalIntakeSummary.hpi.radiation}. Aggravating: ${clinicalIntakeSummary.hpi.aggravating}. Relieving: ${clinicalIntakeSummary.hpi.relieving}. Patient Note: ${clinicalIntakeSummary.hpi.patientNarrative || 'None'}`
      );
      if (clinicalIntakeSummary.pastMedicalHistory?.length > 0) {
        setPreviousIllness(clinicalIntakeSummary.pastMedicalHistory.join(', '));
      }
      if (clinicalIntakeSummary.currentMedications?.length > 0) {
        setCurrentMedication(clinicalIntakeSummary.currentMedications.join('; '));
      }
      if (clinicalIntakeSummary.familyHistory?.length > 0) {
        setFamilyHistory(clinicalIntakeSummary.familyHistory.join(', '));
      }
      showToast('Imported pre-consultation clinical intake data into consultation draft.', 'success');
    }
  };

  // STEP 3: Examination Vitals
  const [temperature, setTemperature] = useState('100.4 °F');
  const [bloodPressure, setBloodPressure] = useState('120/78 mmHg');
  const [pulse, setPulse] = useState('78 bpm');
  const [spO2, setSpO2] = useState('98%');
  const [weight, setWeight] = useState('68 kg');
  const [height, setHeight] = useState('174 cm');
  const [generalExam, setGeneralExam] = useState('Alert, oriented, mild pharyngeal congestion. Chest bilaterally clear.');

  // STEP 4: Assessment
  const [diagnosis, setDiagnosis] = useState('Acute Viral Pharyngitis with Upper Respiratory Infection');
  const [diagSeverity, setDiagSeverity] = useState<ConditionSeverity>('Moderate');
  const [clinicalNotes, setClinicalNotes] = useState('Clinical features consistent with acute viral illness. No focal consolidation on auscultation. Throat swab not indicated at this stage.');

  // STEP 5: Treatment & Medicines
  const [medicines, setMedicines] = useState<PrescriptionItem[]>([
    {
      medicineName: 'Paracetamol 650mg',
      dosage: '1 tablet',
      frequency: 'Twice daily',
      duration: '5 days',
      instructions: 'Take after meals for fever > 99.5°F',
    },
    {
      medicineName: 'Levocetirizine 5mg + Montelukast 10mg',
      dosage: '1 tablet',
      frequency: 'Once daily at bedtime',
      duration: '5 days',
      instructions: 'Take before sleep to alleviate cough and allergic irritation',
    },
    {
      medicineName: 'Warm Saline Gargles',
      dosage: '1 glass',
      frequency: 'Thrice daily',
      duration: '5 days',
      instructions: 'Morning, afternoon, and bedtime',
    },
  ]);
  const [newMedRow, setNewMedRow] = useState<PrescriptionItem>({
    medicineName: '',
    dosage: '1 tablet',
    frequency: 'Twice daily',
    duration: '5 days',
    instructions: 'Take after meals',
  });
  const [testsRecommended, setTestsRecommended] = useState<string>('Complete Blood Count (CBC) if fever persists beyond 5 days');
  const [followUpDays, setFollowUpDays] = useState<number>(5);

  const handleAddMedicine = () => {
    if (!newMedRow.medicineName) return;
    setMedicines([...medicines, newMedRow]);
    setNewMedRow({
      medicineName: '',
      dosage: '1 tablet',
      frequency: 'Twice daily',
      duration: '5 days',
      instructions: 'Take after meals',
    });
  };

  const handleRemoveMedicine = (idx: number) => {
    setMedicines(medicines.filter((_, i) => i !== idx));
  };

  // STEP 6: Complete Consultation
  const handleCompleteConsultation = () => {
    const result = completeConsultationWorkflow({
      patientId: patient.patientId,
      patientName: patient.name,
      doctorId: user?.doctorId || 'doc-001',
      doctorName: user?.name || 'Dr. Rohan Sharma',
      specialty: 'General Medicine',
      hospitalName: 'City Care Hospital',
      date: new Date().toISOString().substring(0, 10),
      chiefComplaint: {
        complaint: chiefComplaint,
        duration,
        severity: complaintSeverity,
        additionalNotes,
      },
      history: {
        presentIllness,
        previousIllness,
        familyHistory,
        surgicalHistory,
        currentMedication,
      },
      examination: {
        temperature,
        bloodPressure,
        pulse,
        spO2,
        weight,
        height,
        generalExamination: generalExam,
      },
      assessment: {
        diagnosis,
        severity: diagSeverity,
        clinicalNotes,
      },
      treatment: {
        medicines,
        testsRecommended: [testsRecommended],
        followUpInDays: followUpDays,
      },
      status: 'Completed',
    });

    setCompletedResult(result);
    setStep(7); // Show success view
    showToast('Consultation successfully recorded & synced across ecosystem!', 'success');
  };

  const stepLabels = [
    '1. Chief Complaint',
    '2. Medical History',
    '3. Vitals Exam',
    '4. Assessment',
    '5. Treatment & Rx',
    '6. Summary Review',
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-surface rounded-md border border-border p-4 sm:p-5 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5 text-primary" />
            <h1 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">
              Digital Case-Taking Workflow
            </h1>
          </div>
          <p className="text-xs text-muted-foreground">
            Patient: <strong className="text-foreground">{patient.name}</strong> ({patient.patientId} • Age: {patient.age}y • Blood Group: {patient.bloodGroup})
          </p>
        </div>

        <Link to={`/doctor/patients/${patient.patientId}`}>
          <Button size="sm" variant="outline">
            View Patient History
          </Button>
        </Link>
      </div>

      {/* Pre-Consultation Clinical Intake Available Banner */}
      <div className="p-4 rounded-md border border-primary/30 bg-primary-muted/20 space-y-2 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <FileText className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs sm:text-sm text-foreground">
                  Pre-Consultation Clinical Intake Available (Completed at Kiosk)
                </span>
                <Badge variant="primary" size="sm">
                  Draft for Review
                </Badge>
                {clinicalIntakeSummary?.isRedFlagTriggered && (
                  <Badge variant="danger" size="sm">
                    🚨 Red-Flag Triage
                  </Badge>
                )}
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                AI-generated draft — Physician verification required. Chief Complaint: <strong>{clinicalIntakeSummary?.chiefComplaint || 'Acute Chest Discomfort'}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowIntakeDetails(!showIntakeDetails)}
            >
              {showIntakeDetails ? 'Hide Details' : 'View Full Summary'}
            </Button>
            <Button
              size="sm"
              variant="primary"
              onClick={handleImportIntakeDraft}
              leftIcon={<Check className="h-3.5 w-3.5" />}
            >
              Import into Draft
            </Button>
          </div>
        </div>

        {/* Collapsible Full Clinical Summary */}
        {showIntakeDetails && (
          <div className="mt-3 p-3 rounded bg-surface border border-border text-xs font-mono whitespace-pre-wrap max-h-64 overflow-y-auto">
            {clinicalIntakeSummary
              ? generateClinicalHistorySummary(clinicalIntakeSummary)
              : 'Chief Complaint: Chest Pain & Discomfort (Severity 8/10)\nSite: Substernal / Central Chest | Onset: Sudden acute onset (< 2 hours)\nRadiation: Radiates to Left Arm & Jaw\nAllergies: Penicillin / Amoxicillin (Severe allergy)'}
          </div>
        )}
      </div>

      {/* 6-Step Indicator Ribbon (when not finished) */}
      {step <= 6 && (
        <div className="p-3 rounded-md border border-border bg-surface overflow-x-auto shadow-xs">
          <div className="flex items-center justify-between gap-2 min-w-[600px]">
            {stepLabels.map((label, idx) => {
              const stepNum = idx + 1;
              const isDone = step > stepNum;
              const isCurrent = step === stepNum;
              return (
                <button
                  key={stepNum}
                  type="button"
                  onClick={() => setStep(stepNum)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                    isDone
                      ? 'bg-primary-muted text-primary'
                      : isCurrent
                      ? 'bg-primary text-white shadow-xs'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <span>{label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* STEP 1: CHIEF COMPLAINT */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Step 1: Chief Complaint & Onset</CardTitle>
            <CardDescription>Document primary symptoms reported by the patient</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-foreground block mb-1">Chief Complaint *</label>
              <textarea
                rows={2}
                required
                value={chiefComplaint}
                onChange={(e) => setChiefComplaint(e.target.value)}
                placeholder="e.g. Fever with cough and sore throat for 3 days"
                className="w-full p-2.5 rounded border border-input bg-surface text-foreground"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-foreground block mb-1">Duration of Symptoms *</label>
                <input
                  type="text"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="e.g. 3 days, 1 week"
                  className="w-full h-8 px-3 rounded border border-input bg-surface text-foreground"
                />
              </div>

              <div>
                <label className="font-semibold text-foreground block mb-1">Perceived Severity</label>
                <select
                  value={complaintSeverity}
                  onChange={(e) => setComplaintSeverity(e.target.value as any)}
                  className="w-full h-8 px-3 rounded border border-input bg-surface text-foreground"
                >
                  <option value="Mild">Mild</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Severe">Severe</option>
                </select>
              </div>
            </div>

            <div>
              <label className="font-semibold text-foreground block mb-1">Additional Symptoms / Context</label>
              <textarea
                rows={2}
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                placeholder="Associated symptoms (e.g. chills, body ache, loss of appetite)"
                className="w-full p-2.5 rounded border border-input bg-surface text-foreground"
              />
            </div>

            <div className="pt-4 flex justify-end">
              <Button size="sm" variant="primary" onClick={() => setStep(2)} rightIcon={<ArrowRight className="h-4 w-4" />}>
                Next: Medical History
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* STEP 2: HISTORY */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Step 2: Medical & Clinical History</CardTitle>
            <CardDescription>Record present illness progression and background history</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-foreground block mb-1">History of Present Illness (HPI)</label>
              <textarea
                rows={2}
                value={presentIllness}
                onChange={(e) => setPresentIllness(e.target.value)}
                className="w-full p-2.5 rounded border border-input bg-surface text-foreground"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-foreground block mb-1">Past Medical History</label>
                <input
                  type="text"
                  value={previousIllness}
                  onChange={(e) => setPreviousIllness(e.target.value)}
                  className="w-full h-8 px-3 rounded border border-input bg-surface text-foreground"
                />
              </div>
              <div>
                <label className="font-semibold text-foreground block mb-1">Current Active Medications</label>
                <input
                  type="text"
                  value={currentMedication}
                  onChange={(e) => setCurrentMedication(e.target.value)}
                  className="w-full h-8 px-3 rounded border border-input bg-surface text-foreground"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-foreground block mb-1">Family Medical History</label>
                <input
                  type="text"
                  value={familyHistory}
                  onChange={(e) => setFamilyHistory(e.target.value)}
                  className="w-full h-8 px-3 rounded border border-input bg-surface text-foreground"
                />
              </div>
              <div>
                <label className="font-semibold text-foreground block mb-1">Surgical / Trauma History</label>
                <input
                  type="text"
                  value={surgicalHistory}
                  onChange={(e) => setSurgicalHistory(e.target.value)}
                  className="w-full h-8 px-3 rounded border border-input bg-surface text-foreground"
                />
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <Button size="sm" variant="outline" onClick={() => setStep(1)} leftIcon={<ArrowLeft className="h-4 w-4" />}>
                Back
              </Button>
              <Button size="sm" variant="primary" onClick={() => setStep(3)} rightIcon={<ArrowRight className="h-4 w-4" />}>
                Next: Vitals Examination
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* STEP 3: EXAMINATION VITALS */}
      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Step 3: Physical Examination & Vitals</CardTitle>
            <CardDescription>Clinical parameter measurements</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <label className="font-semibold text-foreground block mb-1">Body Temperature</label>
                <input
                  type="text"
                  value={temperature}
                  onChange={(e) => setTemperature(e.target.value)}
                  placeholder="e.g. 98.6 °F"
                  className="w-full h-8 px-3 rounded border border-input bg-surface text-foreground"
                />
              </div>
              <div>
                <label className="font-semibold text-foreground block mb-1">Blood Pressure</label>
                <input
                  type="text"
                  value={bloodPressure}
                  onChange={(e) => setBloodPressure(e.target.value)}
                  placeholder="e.g. 120/80 mmHg"
                  className="w-full h-8 px-3 rounded border border-input bg-surface text-foreground"
                />
              </div>
              <div>
                <label className="font-semibold text-foreground block mb-1">Pulse Rate</label>
                <input
                  type="text"
                  value={pulse}
                  onChange={(e) => setPulse(e.target.value)}
                  placeholder="e.g. 72 bpm"
                  className="w-full h-8 px-3 rounded border border-input bg-surface text-foreground"
                />
              </div>
              <div>
                <label className="font-semibold text-foreground block mb-1">Oxygen Saturation (SpO2)</label>
                <input
                  type="text"
                  value={spO2}
                  onChange={(e) => setSpO2(e.target.value)}
                  placeholder="e.g. 99%"
                  className="w-full h-8 px-3 rounded border border-input bg-surface text-foreground"
                />
              </div>
              <div>
                <label className="font-semibold text-foreground block mb-1">Weight</label>
                <input
                  type="text"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="e.g. 68 kg"
                  className="w-full h-8 px-3 rounded border border-input bg-surface text-foreground"
                />
              </div>
              <div>
                <label className="font-semibold text-foreground block mb-1">Height</label>
                <input
                  type="text"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="e.g. 174 cm"
                  className="w-full h-8 px-3 rounded border border-input bg-surface text-foreground"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-foreground block mb-1">Systemic Examination Findings</label>
              <textarea
                rows={2}
                value={generalExam}
                onChange={(e) => setGeneralExam(e.target.value)}
                placeholder="Cardiovascular, Respiratory, Abdominal, Throat/ENT findings"
                className="w-full p-2.5 rounded border border-input bg-surface text-foreground"
              />
            </div>

            <div className="pt-4 flex items-center justify-between">
              <Button size="sm" variant="outline" onClick={() => setStep(2)} leftIcon={<ArrowLeft className="h-4 w-4" />}>
                Back
              </Button>
              <Button size="sm" variant="primary" onClick={() => setStep(4)} rightIcon={<ArrowRight className="h-4 w-4" />}>
                Next: Assessment & Diagnosis
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* STEP 4: ASSESSMENT */}
      {step === 4 && (
        <Card>
          <CardHeader>
            <CardTitle>Step 4: Clinical Assessment & Diagnosis</CardTitle>
            <CardDescription>Specify confirmed or working diagnosis</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-foreground block mb-1">Confirmed Clinical Diagnosis *</label>
              <input
                type="text"
                required
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                placeholder="e.g. Acute Viral Bronchitis, Allergic Rhinitis"
                className="w-full h-8 px-3 rounded border border-input bg-surface text-foreground"
              />
            </div>

            <div>
              <label className="font-semibold text-foreground block mb-1">Diagnosis Severity</label>
              <select
                value={diagSeverity}
                onChange={(e) => setDiagSeverity(e.target.value as any)}
                className="w-full h-8 px-3 rounded border border-input bg-surface text-foreground"
              >
                <option value="Mild">Mild</option>
                <option value="Moderate">Moderate</option>
                <option value="Severe">Severe</option>
                <option value="Critical">Critical</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-foreground block mb-1">Clinical Assessment Notes</label>
              <textarea
                rows={3}
                value={clinicalNotes}
                onChange={(e) => setClinicalNotes(e.target.value)}
                placeholder="Detailed rationale, differential diagnoses ruled out, and prognosis"
                className="w-full p-2.5 rounded border border-input bg-surface text-foreground"
              />
            </div>

            <div className="pt-4 flex items-center justify-between">
              <Button size="sm" variant="outline" onClick={() => setStep(3)} leftIcon={<ArrowLeft className="h-4 w-4" />}>
                Back
              </Button>
              <Button size="sm" variant="primary" onClick={() => setStep(5)} rightIcon={<ArrowRight className="h-4 w-4" />}>
                Next: Treatment & Prescription
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* STEP 5: TREATMENT & PRESCRIPTION */}
      {step === 5 && (
        <Card>
          <CardHeader>
            <CardTitle>Step 5: Treatment & Medication Regimen (Rx)</CardTitle>
            <CardDescription>Prescribe medicines, advise diagnostic tests, and set follow-up</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            {/* Prescribed medicines table */}
            <div>
              <label className="font-semibold text-foreground block mb-2">Prescribed Medicines Table</label>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Medicine Name</TableHead>
                    <TableHead>Dosage</TableHead>
                    <TableHead>Frequency</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Instructions</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {medicines.map((m, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-semibold">{m.medicineName}</TableCell>
                      <TableCell>{m.dosage}</TableCell>
                      <TableCell>{m.frequency}</TableCell>
                      <TableCell>{m.duration}</TableCell>
                      <TableCell className="text-muted-foreground">{m.instructions}</TableCell>
                      <TableCell className="text-right">
                        <button
                          type="button"
                          onClick={() => handleRemoveMedicine(i)}
                          className="text-danger hover:underline font-medium text-xs"
                        >
                          Remove
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Add row */}
            <div className="p-3 rounded bg-surface-alt/70 border border-border space-y-2">
              <span className="font-bold text-foreground block text-[11px]">Add Another Drug:</span>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                <input
                  type="text"
                  placeholder="Medicine name"
                  value={newMedRow.medicineName}
                  onChange={(e) => setNewMedRow({ ...newMedRow, medicineName: e.target.value })}
                  className="h-8 px-2 rounded border border-input bg-surface text-foreground"
                />
                <input
                  type="text"
                  placeholder="Dosage (1 tab)"
                  value={newMedRow.dosage}
                  onChange={(e) => setNewMedRow({ ...newMedRow, dosage: e.target.value })}
                  className="h-8 px-2 rounded border border-input bg-surface text-foreground"
                />
                <input
                  type="text"
                  placeholder="Frequency (Twice daily)"
                  value={newMedRow.frequency}
                  onChange={(e) => setNewMedRow({ ...newMedRow, frequency: e.target.value })}
                  className="h-8 px-2 rounded border border-input bg-surface text-foreground"
                />
                <input
                  type="text"
                  placeholder="Duration (5 days)"
                  value={newMedRow.duration}
                  onChange={(e) => setNewMedRow({ ...newMedRow, duration: e.target.value })}
                  className="h-8 px-2 rounded border border-input bg-surface text-foreground"
                />
                <Button type="button" size="sm" variant="outline" onClick={handleAddMedicine}>
                  Add to Rx
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-foreground block mb-1">Recommended Diagnostic Tests</label>
                <input
                  type="text"
                  value={testsRecommended}
                  onChange={(e) => setTestsRecommended(e.target.value)}
                  placeholder="e.g. CBC, Serum IgE"
                  className="w-full h-8 px-3 rounded border border-input bg-surface text-foreground"
                />
              </div>

              <div>
                <label className="font-semibold text-foreground block mb-1">Follow-up Consultation</label>
                <select
                  value={followUpDays}
                  onChange={(e) => setFollowUpDays(parseInt(e.target.value, 10))}
                  className="w-full h-8 px-3 rounded border border-input bg-surface text-foreground"
                >
                  <option value={3}>In 3 Days</option>
                  <option value={5}>In 5 Days</option>
                  <option value={7}>In 7 Days (1 Week)</option>
                  <option value={14}>In 14 Days (2 Weeks)</option>
                  <option value={30}>In 30 Days (1 Month)</option>
                </select>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <Button size="sm" variant="outline" onClick={() => setStep(4)} leftIcon={<ArrowLeft className="h-4 w-4" />}>
                Back
              </Button>
              <Button size="sm" variant="primary" onClick={() => setStep(6)} rightIcon={<ArrowRight className="h-4 w-4" />}>
                Next: Review & Summary
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* STEP 6: SUMMARY & SUBMIT */}
      {step === 6 && (
        <Card>
          <CardHeader>
            <CardTitle>Step 6: Consultation Summary Review</CardTitle>
            <CardDescription>
              Review recorded clinical data. Upon completion, this consultation will automatically issue a prescription, update active conditions, append to patient health timeline, and log the audit trail.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            {/* Consultation Summary Box */}
            <div className="p-4 rounded-md border border-border bg-surface-alt/60 space-y-3">
              <div className="border-b border-border pb-2 flex justify-between">
                <div>
                  <span className="font-bold text-sm text-foreground">{diagnosis}</span>
                  <span className="text-[11px] text-muted-foreground block">
                    Chief Complaint: {chiefComplaint} ({duration})
                  </span>
                </div>
                <Badge variant="primary" size="sm">Severity: {diagSeverity}</Badge>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-muted-foreground">
                <div><span className="font-medium text-foreground">Temp:</span> {temperature}</div>
                <div><span className="font-medium text-foreground">BP:</span> {bloodPressure}</div>
                <div><span className="font-medium text-foreground">Pulse:</span> {pulse}</div>
                <div><span className="font-medium text-foreground">SpO2:</span> {spO2}</div>
              </div>

              <div>
                <span className="font-semibold text-foreground block mb-1">Prescribed Medicines ({medicines.length}):</span>
                <ul className="list-disc pl-4 space-y-0.5 text-muted-foreground text-[11px]">
                  {medicines.map((m, i) => (
                    <li key={i}>
                      <strong className="text-foreground">{m.medicineName}</strong> — {m.dosage} ({m.frequency} for {m.duration})
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2 text-[11px] text-muted-foreground">
                <span>Follow-up advised in <strong className="text-foreground">{followUpDays} days</strong>.</span>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-border">
              <Button size="sm" variant="outline" onClick={() => setStep(5)} leftIcon={<ArrowLeft className="h-4 w-4" />}>
                Back to Treatment
              </Button>
              <Button size="md" variant="primary" onClick={handleCompleteConsultation} rightIcon={<CheckCircle2 className="h-4 w-4" />}>
                Complete & Finalize Consultation
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* STEP 7: SUCCESS COMPLETION VIEW */}
      {step === 7 && completedResult && (
        <Card className="border-success/40 bg-success-muted/10">
          <CardContent className="p-6 text-center space-y-4">
            <div className="h-12 w-12 rounded-full bg-success text-white flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="h-6 w-6" />
            </div>

            <div className="space-y-1">
              <h2 className="text-lg font-bold text-foreground">Consultation Successfully Recorded!</h2>
              <p className="text-xs text-muted-foreground max-w-md mx-auto">
                Case <strong className="font-mono text-primary">{completedResult.consultation.consultationId}</strong> and Digital Prescription <strong className="font-mono text-primary">{completedResult.prescription.prescriptionId}</strong> have been finalized.
              </p>
            </div>

            {/* Interconnected automatic updates proof */}
            <div className="p-4 rounded-md border border-border bg-surface text-left text-xs space-y-2 max-w-lg mx-auto">
              <span className="font-bold text-foreground block text-[11px] uppercase tracking-wider">
                Automatic Ecosystem Synchronization:
              </span>
              <div className="space-y-1.5 text-muted-foreground text-[11px]">
                <p className="flex items-center gap-1.5 text-success">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Appended consultation to patient's Longitudinal Timeline
                </p>
                <p className="flex items-center gap-1.5 text-success">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Added "{diagnosis}" to active condition registry
                </p>
                <p className="flex items-center gap-1.5 text-success">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Synchronized prescribed medicines to patient medication table
                </p>
                <p className="flex items-center gap-1.5 text-success">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Logged encounter into institutional immutable audit trail
                </p>
                <p className="flex items-center gap-1.5 text-success">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Dispatched instant mobile notification to Aditya Verma
                </p>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
              <Link to={`/doctor/patients/${patient.patientId}`}>
                <Button size="sm" variant="primary">
                  Return to Patient Profile
                </Button>
              </Link>
              <Link to="/patient/timeline">
                <Button size="sm" variant="outline">
                  Inspect Patient Timeline View
                </Button>
              </Link>
              <Link to="/doctor/prescriptions">
                <Button size="sm" variant="outline">
                  View Issued Prescription
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
