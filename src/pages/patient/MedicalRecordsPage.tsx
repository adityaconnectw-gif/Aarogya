import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Activity,
  Pill,
  Syringe,
  FlaskConical,
  AlertTriangle,
  Building2,
  Calendar,
  Eye,
  Plus,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Tabs } from '../../components/common/Tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/common/Table';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Drawer } from '../../components/common/Drawer';
import { Modal } from '../../components/common/Modal';
import { useApp } from '../../context/AppContext';
import { formatDate } from '../../utils/formatters';

export const MedicalRecordsPage: React.FC = () => {
  const {
    patient,
    conditions,
    medications,
    vaccinations,
    labReports,
    allergies,
    prescriptions,
    timeline,
  } = useApp();

  const [activeTab, setActiveTab] = useState<string>('overview');
  const [selectedCondition, setSelectedCondition] = useState<any | null>(null);
  const [selectedPrescription, setSelectedPrescription] = useState<any | null>(null);

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'conditions', label: 'Conditions', count: conditions.length },
    { id: 'medications', label: 'Medications', count: medications.length },
    { id: 'vaccinations', label: 'Vaccinations', count: vaccinations.length },
    { id: 'labs', label: 'Lab Reports', count: labReports.length },
    { id: 'allergies', label: 'Allergies', count: allergies.length },
    { id: 'prescriptions', label: 'Prescriptions', count: prescriptions.length },
    { id: 'visits', label: 'Hospital Visits', count: timeline.filter(t => t.type === 'Hospital Visit').length },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-surface rounded-md border border-border p-4 sm:p-5 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <h1 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">
              Medical Records Vault
            </h1>
          </div>
          <p className="text-xs text-muted-foreground">
            Complete institutional archive of conditions, medications, labs, allergies, and hospital consultations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/patient/emergency">
            <Button size="sm" variant="outline" className="border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300">
              Emergency Card
            </Button>
          </Link>
        </div>
      </div>

      {/* Tabs bar */}
      <Card>
        <CardContent className="p-2 sm:p-3">
          <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
        </CardContent>
      </Card>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Quick Summary Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Active Conditions summary */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between w-full">
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-primary" /> Active Conditions
                  </CardTitle>
                  <button
                    onClick={() => setActiveTab('conditions')}
                    className="text-xs text-primary hover:underline font-medium"
                  >
                    View All →
                  </button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {conditions.map((cond) => (
                  <div
                    key={cond.id}
                    onClick={() => setSelectedCondition(cond)}
                    className="p-3 rounded-md border border-border bg-surface-alt/50 hover:bg-surface-alt transition-colors cursor-pointer flex items-start justify-between"
                  >
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-foreground block">{cond.name}</span>
                      <span className="text-[11px] text-muted-foreground block">
                        Diagnosed: {formatDate(cond.diagnosedDate)} by {cond.doctorName}
                      </span>
                      <span className="text-[11px] text-muted-foreground block">
                        Treatment: {cond.treatment}
                      </span>
                    </div>
                    <Badge variant="auto" status={cond.status} size="sm" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Severe Allergies summary */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between w-full">
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-rose-600" /> Known Drug Allergies
                  </CardTitle>
                  <button
                    onClick={() => setActiveTab('allergies')}
                    className="text-xs text-primary hover:underline font-medium"
                  >
                    View All →
                  </button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {allergies.map((alg) => (
                  <div
                    key={alg.id}
                    className="p-3 rounded-md border border-rose-200 dark:border-rose-900 bg-rose-50/40 dark:bg-rose-950/20 space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-rose-900 dark:text-rose-200">{alg.allergen}</span>
                      <Badge variant="danger" size="sm">{alg.severity}</Badge>
                    </div>
                    <p className="text-[11px] text-rose-800 dark:text-rose-300 leading-relaxed">
                      Reaction: {alg.reaction}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      Recorded on {formatDate(alg.diagnosedDate)} at {alg.hospitalName}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Active Medications Quick Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between w-full">
                <CardTitle className="flex items-center gap-2">
                  <Pill className="h-4 w-4 text-primary" /> Active Prescription Regimens
                </CardTitle>
                <button
                  onClick={() => setActiveTab('medications')}
                  className="text-xs text-primary hover:underline font-medium"
                >
                  Full Medication Table →
                </button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Medicine</TableHead>
                    <TableHead>Dosage</TableHead>
                    <TableHead>Frequency</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Prescribing Doctor</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {medications.map((med) => (
                    <TableRow key={med.id}>
                      <TableCell className="font-semibold">{med.name}</TableCell>
                      <TableCell>{med.dosage}</TableCell>
                      <TableCell>{med.frequency}</TableCell>
                      <TableCell className="font-mono text-[11px]">
                        {formatDate(med.startDate)} – {formatDate(med.endDate)}
                      </TableCell>
                      <TableCell>{med.doctorName}</TableCell>
                      <TableCell>
                        <Badge variant="auto" status={med.status} size="sm" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB 2: CONDITIONS */}
      {activeTab === 'conditions' && (
        <Card>
          <CardHeader>
            <CardTitle>Diagnosed Medical Conditions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {conditions.map((cond) => (
                <div
                  key={cond.id}
                  className="p-4 rounded-md border border-border bg-card shadow-card space-y-2 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 border-b border-border/60 pb-2 mb-2">
                      <div>
                        <h3 className="text-sm font-bold text-foreground">{cond.name}</h3>
                        <span className="text-[11px] text-muted-foreground">
                          Severity: <span className="font-semibold text-foreground">{cond.severity}</span>
                        </span>
                      </div>
                      <Badge variant="auto" status={cond.status} size="sm" />
                    </div>

                    <div className="space-y-1.5 text-xs text-muted-foreground">
                      <p><span className="font-medium text-foreground">Diagnosed Date:</span> {formatDate(cond.diagnosedDate)}</p>
                      <p><span className="font-medium text-foreground">Doctor:</span> {cond.doctorName}</p>
                      <p><span className="font-medium text-foreground">Hospital:</span> {cond.hospitalName}</p>
                      <p><span className="font-medium text-foreground">Treatment:</span> {cond.treatment}</p>
                      {cond.notes && <p className="pt-1 text-[11px] italic">"{cond.notes}"</p>}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border/60 flex justify-end">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedCondition(cond)}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* TAB 3: MEDICATIONS */}
      {activeTab === 'medications' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between w-full">
              <CardTitle>Medication History & Prescriptions</CardTitle>
              <Link to="/patient/medications">
                <Button size="sm" variant="outline">
                  Detailed View →
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Medicine</TableHead>
                  <TableHead>Dosage</TableHead>
                  <TableHead>Frequency</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {medications.map((med) => (
                  <TableRow key={med.id}>
                    <TableCell className="font-semibold">{med.name}</TableCell>
                    <TableCell>{med.dosage}</TableCell>
                    <TableCell>{med.frequency}</TableCell>
                    <TableCell className="font-mono text-[11px]">{formatDate(med.startDate)}</TableCell>
                    <TableCell className="font-mono text-[11px]">{formatDate(med.endDate)}</TableCell>
                    <TableCell>{med.doctorName}</TableCell>
                    <TableCell>
                      <Badge variant="auto" status={med.status} size="sm" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* TAB 4: VACCINATIONS */}
      {activeTab === 'vaccinations' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between w-full">
              <CardTitle>Immunization Records</CardTitle>
              <Link to="/patient/vaccinations">
                <Button size="sm" variant="primary">
                  Open Vaccine Tracker →
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {vaccinations.map((vac) => (
                <div key={vac.id} className="p-4 rounded-md border border-border bg-card space-y-3">
                  <div className="flex items-center justify-between border-b border-border pb-2">
                    <span className="font-bold text-sm text-foreground">{vac.vaccineName}</span>
                    <Badge variant="auto" status={vac.overallStatus} size="sm" />
                  </div>
                  <div className="space-y-1.5 text-xs text-muted-foreground">
                    {vac.doses.map((d) => (
                      <div key={d.doseNumber} className="flex items-center justify-between py-0.5">
                        <span>{d.doseLabel}</span>
                        <span className="font-medium text-foreground">
                          {d.status === 'Completed' ? `✓ Completed (${d.dateAdministered})` : '! Due'}
                        </span>
                      </div>
                    ))}
                  </div>
                  {vac.nextDoseDate && (
                    <div className="p-2 rounded bg-amber-50 dark:bg-amber-950/30 border border-amber-200 text-amber-800 text-[11px] font-medium">
                      Next dose: {formatDate(vac.nextDoseDate)} ({vac.daysRemaining} days remaining)
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* TAB 5: LAB REPORTS */}
      {activeTab === 'labs' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between w-full">
              <CardTitle>Diagnostic Lab Investigations</CardTitle>
              <Link to="/patient/labs">
                <Button size="sm" variant="outline">
                  Lab Central View →
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Test</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Result</TableHead>
                  <TableHead>Reference Range</TableHead>
                  <TableHead>Hospital</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {labReports.map((lab) => (
                  <TableRow key={lab.id}>
                    <TableCell className="font-semibold">{lab.testName}</TableCell>
                    <TableCell className="font-mono text-[11px]">{formatDate(lab.date)}</TableCell>
                    <TableCell className="font-medium text-foreground">{lab.result}</TableCell>
                    <TableCell className="text-muted-foreground text-[11px]">{lab.referenceRange}</TableCell>
                    <TableCell>{lab.hospitalName}</TableCell>
                    <TableCell>
                      <Badge variant="auto" status={lab.status} size="sm" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* TAB 6: ALLERGIES */}
      {activeTab === 'allergies' && (
        <Card>
          <CardHeader>
            <CardTitle>Allergies & Adverse Sensitivities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {allergies.map((alg) => (
                <div
                  key={alg.id}
                  className={`p-4 rounded-md border space-y-2 ${
                    alg.severity === 'Severe'
                      ? 'border-rose-300 dark:border-rose-900 bg-rose-50/40 dark:bg-rose-950/20'
                      : 'border-border bg-card'
                  }`}
                >
                  <div className="flex items-center justify-between border-b border-border/60 pb-2">
                    <span className="font-bold text-sm text-foreground">{alg.allergen}</span>
                    <Badge variant="auto" status={alg.severity} size="sm" />
                  </div>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <p><span className="font-medium text-foreground">Clinical Reaction:</span> {alg.reaction}</p>
                    <p><span className="font-medium text-foreground">Diagnosed:</span> {formatDate(alg.diagnosedDate)}</p>
                    <p><span className="font-medium text-foreground">Recorded By:</span> {alg.recordedBy} ({alg.hospitalName})</p>
                    {alg.notes && (
                      <p className="p-2 rounded bg-surface border border-border text-[11px] text-rose-800 dark:text-rose-300 mt-2 font-medium">
                        {alg.notes}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* TAB 7: PRESCRIPTIONS */}
      {activeTab === 'prescriptions' && (
        <Card>
          <CardHeader>
            <CardTitle>Digital Prescriptions Issued</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {prescriptions.map((rx) => (
                <div
                  key={rx.id}
                  className="p-4 rounded-md border border-border bg-card shadow-card space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-border pb-2">
                    <div>
                      <span className="font-bold text-xs font-mono text-primary block">{rx.prescriptionId}</span>
                      <span className="text-xs font-semibold text-foreground">{rx.diagnosis}</span>
                    </div>
                    <Badge variant="primary" size="sm">{formatDate(rx.date)}</Badge>
                  </div>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <p><span className="font-medium text-foreground">Doctor:</span> {rx.doctorName} ({rx.doctorSpecialty})</p>
                    <p><span className="font-medium text-foreground">Hospital:</span> {rx.hospitalName}</p>
                    <div className="pt-2">
                      <span className="font-semibold text-foreground block mb-1">Prescribed Medicines:</span>
                      <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                        {rx.medicines.map((m, i) => (
                          <li key={i}>{m.medicineName} ({m.dosage} - {m.frequency})</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-border flex justify-end">
                    <Button size="sm" variant="outline" onClick={() => setSelectedPrescription(rx)}>
                      View Full Prescription
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* TAB 8: HOSPITAL VISITS */}
      {activeTab === 'visits' && (
        <Card>
          <CardHeader>
            <CardTitle>Hospital Admissions & OPD Visits</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {timeline
              .filter((t) => t.type === 'Hospital Visit' || t.type === 'Consultation')
              .map((vis) => (
                <div key={vis.id} className="p-3 rounded-md border border-border bg-surface-alt/40 flex items-start justify-between gap-4">
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-foreground text-sm">{vis.title}</span>
                      <Badge variant="auto" status={vis.type} size="sm" />
                    </div>
                    <p className="text-muted-foreground">{vis.subtitle}</p>
                    <p className="text-[11px] text-muted-foreground font-mono">
                      {formatDate(vis.date)} • {vis.provider} • {vis.facility}
                    </p>
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>
      )}

      {/* Detail Drawer for Condition */}
      {selectedCondition && (
        <Drawer
          isOpen={!!selectedCondition}
          onClose={() => setSelectedCondition(null)}
          title={`Condition: ${selectedCondition.name}`}
          subtitle={`Diagnosed: ${formatDate(selectedCondition.diagnosedDate)} by ${selectedCondition.doctorName}`}
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 rounded bg-surface-alt border border-border space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Status</span>
                <Badge variant="auto" status={selectedCondition.status} size="sm" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Severity Level</span>
                <span className="font-semibold text-foreground">{selectedCondition.severity}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Hospital</span>
                <span className="font-semibold text-foreground">{selectedCondition.hospitalName}</span>
              </div>
            </div>

            <div>
              <label className="font-semibold text-foreground block mb-1">Prescribed Treatment Regimen</label>
              <div className="p-3 rounded bg-surface border border-border text-foreground font-medium">
                {selectedCondition.treatment}
              </div>
            </div>

            {selectedCondition.notes && (
              <div>
                <label className="font-semibold text-foreground block mb-1">Clinical Observations</label>
                <div className="p-3 rounded bg-surface border border-border text-muted-foreground leading-relaxed">
                  {selectedCondition.notes}
                </div>
              </div>
            )}
          </div>
        </Drawer>
      )}

      {/* Prescription Preview Modal */}
      {selectedPrescription && (
        <Modal
          isOpen={!!selectedPrescription}
          onClose={() => setSelectedPrescription(null)}
          title="Digital Prescription Summary"
          maxWidth="lg"
          footer={
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={() => window.print()}>
                Print Prescription
              </Button>
              <Button size="sm" variant="primary" onClick={() => setSelectedPrescription(null)}>
                Close
              </Button>
            </div>
          }
        >
          <div className="p-4 rounded border border-border bg-surface text-xs space-y-4 font-sans">
            <div className="text-center border-b border-border pb-3">
              <h2 className="text-base font-bold uppercase text-foreground">{selectedPrescription.hospitalName}</h2>
              <p className="text-muted-foreground text-[11px]">{selectedPrescription.hospitalAddress} • {selectedPrescription.hospitalPhone}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 border-b border-border pb-3 text-[11px]">
              <div>
                <p><span className="font-semibold">Doctor:</span> {selectedPrescription.doctorName}</p>
                <p><span className="font-semibold">Specialty:</span> {selectedPrescription.doctorSpecialty}</p>
                <p><span className="font-semibold">Reg No:</span> {selectedPrescription.doctorRegNo}</p>
              </div>
              <div>
                <p><span className="font-semibold">Patient:</span> {selectedPrescription.patientName} ({selectedPrescription.patientAge}y/{selectedPrescription.patientGender})</p>
                <p><span className="font-semibold">Patient ID:</span> {selectedPrescription.patientId}</p>
                <p><span className="font-semibold">Date:</span> {formatDate(selectedPrescription.date)}</p>
              </div>
            </div>

            <div>
              <p className="font-bold text-foreground">Diagnosis: <span className="font-normal">{selectedPrescription.diagnosis}</span></p>
            </div>

            <div>
              <h4 className="font-bold text-foreground uppercase tracking-wider text-[11px] mb-2">Rx — Prescribed Medicines</h4>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Medicine</TableHead>
                    <TableHead>Dosage</TableHead>
                    <TableHead>Frequency</TableHead>
                    <TableHead>Duration</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedPrescription.medicines.map((m: any, i: number) => (
                    <TableRow key={i}>
                      <TableCell className="font-semibold">{m.medicineName}</TableCell>
                      <TableCell>{m.dosage}</TableCell>
                      <TableCell>{m.frequency}</TableCell>
                      <TableCell>{m.duration}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="pt-2 text-[11px] text-muted-foreground">
              <p><span className="font-semibold text-foreground">Follow-up:</span> In {selectedPrescription.followUpDays} days ({formatDate(selectedPrescription.followUpDate)})</p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
