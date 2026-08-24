import React, { useState } from 'react';
import {
  Syringe,
  CheckCircle2,
  AlertCircle,
  Clock,
  Plus,
  Building2,
  FileCheck2,
  Calendar,
  ShieldCheck,
  AlertTriangle,
  Award,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../components/common/Toast';
import { Vaccination, VaccinationDose } from '../../types';
import { formatDate } from '../../utils/formatters';

export const VaccinationsPage: React.FC = () => {
  const { vaccinations, recordVaccinationDose, addVaccination, patient } = useApp();
  const { showToast } = useToast();

  const [selectedVaccine, setSelectedVaccine] = useState<Vaccination | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedDoseToRecord, setSelectedDoseToRecord] = useState<{ vacId: string; doseNum: number } | null>(null);
  const [doseBatch, setDoseBatch] = useState('HEP-B-99801');

  // New vaccine form
  const [newVac, setNewVac] = useState({
    name: '',
    category: 'Routine Adult' as const,
    targetDisease: '',
    recommendedFor: 'Adult universal schedule',
    totalDoses: 2,
  });

  const handleRecordDose = (vacId: string, doseNum: number) => {
    recordVaccinationDose(vacId, doseNum, doseBatch);
    showToast(`Dose ${doseNum} marked as Completed and logged in Health Timeline!`, 'success');
    setSelectedDoseToRecord(null);
  };

  const handleAddVaccine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVac.name) return;

    const doses: VaccinationDose[] = Array.from({ length: newVac.totalDoses }).map((_, i) => ({
      doseNumber: i + 1,
      doseLabel: `Dose ${i + 1}`,
      status: i === 0 ? 'Due' : 'Due',
      hospital: 'City Care Hospital',
    }));

    addVaccination({
      patientId: patient.patientId,
      vaccineName: newVac.name,
      category: newVac.category,
      targetDisease: newVac.targetDisease || newVac.name,
      recommendedFor: newVac.recommendedFor,
      overallStatus: 'Due',
      doses,
      nextDoseDate: new Date(Date.now() + 30 * 86400000).toISOString().substring(0, 10),
      daysRemaining: 30,
    });

    showToast(`Vaccination schedule for ${newVac.name} created.`, 'success');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-surface rounded-md border border-border p-4 sm:p-5 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Syringe className="h-5 w-5 text-primary" />
            <h1 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">
              Immunization & Vaccination Ledger
            </h1>
          </div>
          <p className="text-xs text-muted-foreground">
            Complete track of doses, batch numbers, administration nurses, and official immunization schedules.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="primary"
            onClick={() => setIsAddModalOpen(true)}
            leftIcon={<Plus className="h-4 w-4" />}
          >
            Add Vaccine Track
          </Button>
        </div>
      </div>

      {/* Standout Prominent Reminder Alert Banner */}
      <div className="p-4 rounded-md border border-amber-300 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 shrink-0">
            <Clock className="h-5 w-5" />
          </div>
          <div className="space-y-0.5 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-foreground">Upcoming Dose Action Required</span>
              <Badge variant="warning" size="sm">18 Days Remaining</Badge>
            </div>
            <p className="text-muted-foreground">
              <strong className="text-foreground">Hepatitis B Dose 3</strong> is scheduled for <strong className="text-foreground">12 September 2026</strong>.
            </p>
            <p className="text-[11px] text-muted-foreground">
              Please visit the Immunization Unit at City Care Hospital or your nearest authorized health center.
            </p>
          </div>
        </div>

        <Button
          size="sm"
          variant="primary"
          onClick={() => {
            const hepB = vaccinations.find((v) => v.vaccineName.includes('Hepatitis'));
            if (hepB) {
              setSelectedDoseToRecord({ vacId: hepB.id, doseNum: 3 });
            }
          }}
        >
          Record Administered Dose
        </Button>
      </div>

      {/* Vaccine Progression Cards (Standout SIH UI) */}
      <div className="space-y-4">
        {vaccinations.map((vac) => (
          <Card key={vac.id} className="overflow-hidden">
            <CardHeader className="bg-surface-alt/40">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 w-full">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded bg-primary-muted text-primary flex items-center justify-center font-bold">
                    <Syringe className="h-4 w-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold uppercase tracking-tight text-foreground">
                      {vac.vaccineName}
                    </h2>
                    <span className="text-[11px] text-muted-foreground font-normal">
                      Target: {vac.targetDisease} • {vac.category}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="auto" status={vac.overallStatus} size="md" />
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-4 sm:p-5 space-y-4">
              {/* Dose Progression Steps */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {vac.doses.map((dose) => {
                  const isCompleted = dose.status === 'Completed';
                  const isDue = dose.status === 'Due';
                  return (
                    <div
                      key={dose.doseNumber}
                      className={`p-3.5 rounded-md border text-xs space-y-2 flex flex-col justify-between ${
                        isCompleted
                          ? 'border-emerald-200 dark:border-emerald-900 bg-emerald-50/40 dark:bg-emerald-950/20'
                          : 'border-amber-200 dark:border-amber-900 bg-amber-50/30 dark:bg-amber-950/20'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-foreground">{dose.doseLabel}</span>
                        {isCompleted ? (
                          <span className="text-emerald-700 dark:text-emerald-300 font-semibold flex items-center gap-1 text-[11px]">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Completed
                          </span>
                        ) : (
                          <span className="text-amber-700 dark:text-amber-300 font-semibold flex items-center gap-1 text-[11px]">
                            <AlertCircle className="h-3.5 w-3.5" /> Due
                          </span>
                        )}
                      </div>

                      {isCompleted ? (
                        <div className="space-y-1 text-[11px] text-muted-foreground">
                          <p><span className="font-medium text-foreground">Date:</span> {formatDate(dose.dateAdministered)}</p>
                          <p><span className="font-medium text-foreground">Batch:</span> <span className="font-mono">{dose.batchNumber}</span></p>
                          <p><span className="font-medium text-foreground">Hospital:</span> {dose.hospital}</p>
                          <p><span className="font-medium text-foreground">Nurse:</span> {dose.administeredBy}</p>
                        </div>
                      ) : (
                        <div className="space-y-2 text-[11px] text-muted-foreground pt-1">
                          <p className="font-semibold text-amber-800 dark:text-amber-300">
                            {vac.nextDoseDate ? `Scheduled for ${formatDate(vac.nextDoseDate)}` : 'Pending scheduling'}
                          </p>
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full text-xs h-7"
                            onClick={() => setSelectedDoseToRecord({ vacId: vac.id, doseNum: dose.doseNumber })}
                          >
                            Mark Completed
                          </Button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Vaccine Notes & Institutional Certificate info */}
              {vac.notes && (
                <div className="p-3 rounded bg-surface-alt/70 border border-border text-xs text-muted-foreground flex items-center justify-between gap-3">
                  <p className="flex-1 text-[11px] leading-relaxed">
                    <strong className="text-foreground">Clinical Advisory:</strong> {vac.notes}
                  </p>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-xs text-primary"
                    onClick={() => {
                      showToast(`Digital immunization certificate for ${vac.vaccineName} verified.`, 'info');
                    }}
                  >
                    View Certificate
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Record Completed Dose Modal */}
      {selectedDoseToRecord && (
        <Modal
          isOpen={!!selectedDoseToRecord}
          onClose={() => setSelectedDoseToRecord(null)}
          title="Record Administered Vaccine Dose"
          description={`Confirm dose ${selectedDoseToRecord.doseNum} administration`}
          footer={
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={() => setSelectedDoseToRecord(null)}>
                Cancel
              </Button>
              <Button
                size="sm"
                variant="primary"
                onClick={() => handleRecordDose(selectedDoseToRecord.vacId, selectedDoseToRecord.doseNum)}
              >
                Confirm Dose Completion
              </Button>
            </div>
          }
        >
          <div className="space-y-3 text-xs">
            <div>
              <label className="font-semibold text-foreground block mb-1">Manufacturer Batch Number *</label>
              <input
                type="text"
                required
                value={doseBatch}
                onChange={(e) => setDoseBatch(e.target.value)}
                placeholder="e.g. HEP-B-99801"
                className="w-full h-8 px-3 rounded border border-input bg-surface text-foreground font-mono"
              />
            </div>
            <div>
              <label className="font-semibold text-foreground block mb-1">Administering Facility</label>
              <input
                type="text"
                readOnly
                value="City Care Hospital (Immunization Unit)"
                className="w-full h-8 px-3 rounded border border-input bg-surface-alt text-muted-foreground"
              />
            </div>
            <p className="text-[11px] text-muted-foreground">
              Confirming this dose will update your vaccine record, recalculate subsequent booster dates, and log an entry in your longitudinal health timeline and audit trail.
            </p>
          </div>
        </Modal>
      )}

      {/* Add New Vaccine Modal */}
      {isAddModalOpen && (
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Add New Vaccine Track"
          description="Register a new immunization schedule for tracking"
        >
          <form onSubmit={handleAddVaccine} className="space-y-3 text-xs">
            <div>
              <label className="font-semibold text-foreground block mb-1">Vaccine Name *</label>
              <input
                type="text"
                required
                value={newVac.name}
                onChange={(e) => setNewVac({ ...newVac, name: e.target.value })}
                placeholder="e.g. Typhoid Conjugate, Influenza Annual, Rabies"
                className="w-full h-8 px-3 rounded border border-input bg-surface text-foreground"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-foreground block mb-1">Target Disease</label>
                <input
                  type="text"
                  value={newVac.targetDisease}
                  onChange={(e) => setNewVac({ ...newVac, targetDisease: e.target.value })}
                  placeholder="e.g. Salmonella Typhi"
                  className="w-full h-8 px-3 rounded border border-input bg-surface text-foreground"
                />
              </div>
              <div>
                <label className="font-semibold text-foreground block mb-1">Total Doses Required</label>
                <select
                  value={newVac.totalDoses}
                  onChange={(e) => setNewVac({ ...newVac, totalDoses: parseInt(e.target.value, 10) })}
                  className="w-full h-8 px-3 rounded border border-input bg-surface text-foreground"
                >
                  <option value={1}>1 Dose (Single Shot / Booster)</option>
                  <option value={2}>2 Doses</option>
                  <option value={3}>3 Doses (Multi-stage)</option>
                </select>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsAddModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm">
                Create Schedule
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
