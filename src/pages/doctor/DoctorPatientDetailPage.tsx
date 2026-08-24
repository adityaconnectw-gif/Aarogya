import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  User,
  Stethoscope,
  Clock,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Pill,
  Syringe,
  FlaskConical,
  ArrowLeft,
  Calendar,
  Lock,
  Plus,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/common/Table';
import { Tabs } from '../../components/common/Tabs';
import { Modal } from '../../components/common/Modal';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../components/common/Toast';
import { formatDate } from '../../utils/formatters';

export const DoctorPatientDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    patient,
    conditions,
    medications,
    vaccinations,
    labReports,
    allergies,
    prescriptions,
    timeline,
    consents,
    doctorRequestAccess,
  } = useApp();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'case' | 'timeline' | 'meds' | 'labs' | 'vaccines'>('case');
  const [isRequestAccessModalOpen, setIsRequestAccessModalOpen] = useState(false);

  // Request Form
  const [requestRecords, setRequestRecords] = useState({
    diagnoses: true,
    medications: true,
    vaccinations: true,
    labReports: true,
    otherRecords: false,
  });
  const [reqDuration, setReqDuration] = useState<'24 hours' | '7 days' | '30 days'>('24 hours');
  const [reqPurpose, setReqPurpose] = useState('Comprehensive clinical diagnosis & follow-up examination');

  const handleSendAccessRequest = (e: React.FormEvent) => {
    e.preventDefault();
    doctorRequestAccess(
      'doc-001',
      'Dr. Rohan Sharma',
      'General Medicine',
      'City Care Hospital',
      requestRecords,
      reqDuration,
      reqPurpose
    );
    showToast('Access request sent to patient. They will receive a notification to authorize.', 'info');
    setIsRequestAccessModalOpen(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Back button */}
      <div>
        <button
          onClick={() => navigate('/doctor/patients')}
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground font-medium"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Patient Directory</span>
        </button>
      </div>

      {/* Patient Master Summary Card */}
      <Card className="border-primary/30">
        <CardContent className="p-5 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-4">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-full bg-primary/10 text-primary border-2 border-primary/30 flex items-center justify-center font-bold text-xl">
                {patient.name[0]}
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-foreground">{patient.name}</h1>
                  <Badge variant="primary" size="sm">ID: {patient.patientId}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Age: <strong className="text-foreground">{patient.age} Yrs</strong> ({patient.gender}) • Blood Group: <strong className="text-rose-600 font-mono">{patient.bloodGroup}</strong>
                </p>
                <p className="text-xs text-muted-foreground">
                  Phone: {patient.phone} • {patient.email}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:items-end gap-2">
              <Link to="/doctor/case/new">
                <Button size="md" variant="primary" leftIcon={<Stethoscope className="h-4 w-4" />}>
                  Start Digital Case-Taking
                </Button>
              </Link>
            </div>
          </div>

          {/* Access Status Banner */}
          <div className="p-3 rounded-md bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-emerald-950 dark:text-emerald-200">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>
                <strong className="font-bold">Access Status: Authorized.</strong> Valid consent granted until: <span className="font-mono font-semibold">24 Aug 2026, 10:31 PM</span>
              </span>
            </div>
            <button
              onClick={() => setIsRequestAccessModalOpen(true)}
              className="text-[11px] text-emerald-800 dark:text-emerald-300 font-semibold underline hover:no-underline"
            >
              Request Extended Permissions
            </button>
          </div>

          {/* Critical Clinical Alerts Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-md border border-rose-200 dark:border-rose-900 bg-rose-50/50 dark:bg-rose-950/30">
              <span className="font-bold text-rose-800 dark:text-rose-300 block mb-1 flex items-center gap-1">
                <AlertTriangle className="h-3.5 w-3.5" /> Severe Allergies:
              </span>
              <p className="text-rose-950 dark:text-rose-200 font-semibold">
                Penicillin (Skin rash, Angioedema, Bronchospasm)
              </p>
            </div>

            <div className="p-3 rounded-md border border-border bg-surface-alt/60">
              <span className="font-bold text-foreground block mb-1">
                Active Chronic Conditions:
              </span>
              <p className="text-foreground font-semibold">
                Asthma (Moderate — Budecort Inhaler 200mcg Maintenance)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Card>
        <CardContent className="p-2 sm:p-3">
          <Tabs
            tabs={[
              { id: 'case', label: "Today's Clinical Case" },
              { id: 'timeline', label: 'Authorized Health Timeline', count: timeline.length },
              { id: 'meds', label: 'Active Medications', count: medications.length },
              { id: 'labs', label: 'Lab Reports', count: labReports.length },
              { id: 'vaccines', label: 'Vaccines', count: vaccinations.length },
            ]}
            activeTab={activeTab}
            onChange={(t) => setActiveTab(t as any)}
          />
        </CardContent>
      </Card>

      {/* TAB CONTENT */}
      {activeTab === 'case' && (
        <Card>
          <CardHeader>
            <CardTitle>Conduct Digital Case-Taking for Today's Visit</CardTitle>
            <CardDescription>
              Launch the 6-step standardized clinical workflow to record Chief Complaints, Vitals, Assessment, and Digital Prescription.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="p-4 rounded-md border border-border bg-surface-alt/40 space-y-2">
              <h4 className="font-bold text-sm text-foreground">Standardized 6-Step Clinical Recording:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 text-[11px]">
                <div className="p-2 rounded bg-surface border border-border">1. Chief Complaint & Duration</div>
                <div className="p-2 rounded bg-surface border border-border">2. Present & Past Medical History</div>
                <div className="p-2 rounded bg-surface border border-border">3. Vitals Examination (BP/Pulse/SpO2)</div>
                <div className="p-2 rounded bg-surface border border-border">4. Assessment & Diagnosis</div>
                <div className="p-2 rounded bg-surface border border-border">5. Rx Prescription & Follow-up</div>
                <div className="p-2 rounded bg-surface border border-border">6. Consultation Summary Sync</div>
              </div>
            </div>

            <div className="pt-2 flex justify-start">
              <Link to="/doctor/case/new">
                <Button size="md" variant="primary" leftIcon={<Stethoscope className="h-4 w-4" />}>
                  Open Digital Case-Taking Form
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'timeline' && (
        <Card>
          <CardHeader>
            <CardTitle>Authorized Longitudinal Health Timeline</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 p-4 sm:p-5">
            <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border text-xs">
              {timeline.map((ev) => (
                <div key={ev.id} className="relative">
                  <div className="absolute -left-6 top-1 h-3.5 w-3.5 rounded-full border-2 border-surface bg-primary" />
                  <div className="space-y-1 p-3 rounded-md border border-border bg-surface-alt/30">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-foreground">{ev.title}</span>
                      <span className="font-mono text-[11px] text-muted-foreground">{formatDate(ev.date)}</span>
                    </div>
                    {ev.subtitle && <p className="text-muted-foreground">{ev.subtitle}</p>}
                    <span className="text-[10px] text-muted-foreground block">{ev.provider} • {ev.facility}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'meds' && (
        <Card>
          <CardHeader>
            <CardTitle>Active Medications</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Medicine</TableHead>
                  <TableHead>Dosage</TableHead>
                  <TableHead>Frequency</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {medications.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell className="font-semibold text-foreground">{m.name}</TableCell>
                    <TableCell>{m.dosage}</TableCell>
                    <TableCell>{m.frequency}</TableCell>
                    <TableCell className="font-mono text-[11px]">{formatDate(m.startDate)} → {formatDate(m.endDate)}</TableCell>
                    <TableCell><Badge variant="auto" status={m.status} size="sm" /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {activeTab === 'labs' && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Lab Investigations</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Test Name</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Result Value</TableHead>
                  <TableHead>Reference Range</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {labReports.map((lab) => (
                  <TableRow key={lab.id}>
                    <TableCell className="font-semibold text-foreground">{lab.testName}</TableCell>
                    <TableCell className="font-mono text-[11px]">{formatDate(lab.date)}</TableCell>
                    <TableCell className="font-bold text-foreground">{lab.result}</TableCell>
                    <TableCell className="text-muted-foreground text-[11px]">{lab.referenceRange}</TableCell>
                    <TableCell><Badge variant="auto" status={lab.status} size="sm" /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {activeTab === 'vaccines' && (
        <Card>
          <CardHeader>
            <CardTitle>Immunization Schedule</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {vaccinations.map((v) => (
              <div key={v.id} className="p-3 rounded-md border border-border bg-surface-alt/40 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-foreground block">{v.vaccineName}</span>
                  <span className="text-[11px] text-muted-foreground">
                    {v.doses.filter(d => d.status === 'Completed').length}/{v.doses.length} Doses Completed
                  </span>
                </div>
                <Badge variant="auto" status={v.overallStatus} size="sm" />
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Request Extended Permissions Modal */}
      {isRequestAccessModalOpen && (
        <Modal
          isOpen={isRequestAccessModalOpen}
          onClose={() => setIsRequestAccessModalOpen(false)}
          title="Request Extended Patient Permissions"
          description={`Submit access request to ${patient.name}`}
        >
          <form onSubmit={handleSendAccessRequest} className="space-y-3 text-xs">
            <div>
              <label className="font-semibold text-foreground block mb-1">Duration</label>
              <select
                value={reqDuration}
                onChange={(e) => setReqDuration(e.target.value as any)}
                className="w-full h-8 px-3 rounded border border-input bg-surface text-foreground"
              >
                <option value="24 hours">24 Hours</option>
                <option value="7 days">7 Days</option>
                <option value="30 days">30 Days</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-foreground block mb-1">Clinical Purpose</label>
              <textarea
                rows={2}
                value={reqPurpose}
                onChange={(e) => setReqPurpose(e.target.value)}
                className="w-full p-2 rounded border border-input bg-surface text-foreground"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsRequestAccessModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm">
                Send Request
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
