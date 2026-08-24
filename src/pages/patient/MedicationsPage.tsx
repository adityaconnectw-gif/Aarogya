import React, { useState, useMemo } from 'react';
import {
  Pill,
  Search,
  Plus,
  Filter,
  Eye,
  Calendar,
  AlertCircle,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/common/Table';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { SearchBar } from '../../components/common/SearchBar';
import { Drawer } from '../../components/common/Drawer';
import { Modal } from '../../components/common/Modal';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../components/common/Toast';
import { Medication } from '../../types';
import { formatDate } from '../../utils/formatters';

export const MedicationsPage: React.FC = () => {
  const { medications, addMedication, patient } = useApp();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Active' | 'Completed'>('All');
  const [selectedMed, setSelectedMed] = useState<Medication | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form state
  const [newMed, setNewMed] = useState({
    name: '',
    dosage: '1 tablet',
    frequency: 'Twice daily',
    duration: '5 days',
    startDate: new Date().toISOString().substring(0, 10),
    endDate: new Date(Date.now() + 5 * 86400000).toISOString().substring(0, 10),
    doctorName: 'Dr. Rohan Sharma',
    hospitalName: 'City Care Hospital',
    instructions: 'Take after meals with water',
    reason: 'Prescribed treatment',
    batchNumber: 'BAT-2026-901',
    expiryDate: '2028-12',
    timing: 'Morning - Night' as const,
  });

  const filteredMeds = useMemo(() => {
    return medications.filter((m) => {
      if (filterStatus !== 'All' && m.status !== filterStatus) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          m.name.toLowerCase().includes(q) ||
          m.doctorName.toLowerCase().includes(q) ||
          m.reason?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [medications, filterStatus, searchQuery]);

  const handleAddMedication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMed.name) return;

    addMedication({
      patientId: patient.patientId,
      name: newMed.name,
      dosage: newMed.dosage,
      frequency: newMed.frequency,
      duration: newMed.duration,
      startDate: newMed.startDate,
      endDate: newMed.endDate,
      doctorId: 'doc-001',
      doctorName: newMed.doctorName,
      hospitalName: newMed.hospitalName,
      status: 'Active',
      instructions: newMed.instructions,
      reason: newMed.reason,
      batchNumber: newMed.batchNumber,
      expiryDate: newMed.expiryDate,
      timing: newMed.timing,
    });

    showToast(`Medication ${newMed.name} added to active regime.`, 'success');
    setIsAddModalOpen(false);
    setNewMed({
      name: '',
      dosage: '1 tablet',
      frequency: 'Twice daily',
      duration: '5 days',
      startDate: new Date().toISOString().substring(0, 10),
      endDate: new Date(Date.now() + 5 * 86400000).toISOString().substring(0, 10),
      doctorName: 'Dr. Rohan Sharma',
      hospitalName: 'City Care Hospital',
      instructions: 'Take after meals with water',
      reason: 'Prescribed treatment',
      batchNumber: 'BAT-2026-901',
      expiryDate: '2028-12',
      timing: 'Morning - Night',
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-surface rounded-md border border-border p-4 sm:p-5 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Pill className="h-5 w-5 text-primary" />
            <h1 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">
              Medications & Prescription Regimens
            </h1>
          </div>
          <p className="text-xs text-muted-foreground">
            Longitudinal record of prescribed pharmaceuticals, dosages, course durations, and manufacturer batch details.
          </p>
        </div>

        <Button
          size="sm"
          variant="primary"
          onClick={() => setIsAddModalOpen(true)}
          leftIcon={<Plus className="h-4 w-4" />}
        >
          Add Medication Record
        </Button>
      </div>

      {/* Filter & Search */}
      <Card>
        <CardContent className="p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="w-full sm:max-w-xs">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search by medicine name, doctor, reason..."
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto justify-start text-xs">
            <span className="text-muted-foreground font-semibold uppercase text-[11px] mr-1 flex items-center gap-1">
              <Filter className="h-3 w-3" /> Status:
            </span>
            {(['All', 'Active', 'Completed'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                  filterStatus === st
                    ? 'bg-primary text-primary-foreground border-primary font-semibold'
                    : 'bg-surface text-muted-foreground border-border hover:bg-surface-alt'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Medications Professional Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Medicine</TableHead>
                <TableHead>Dosage</TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Prescribing Doctor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMeds.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No medications matching your filters.
                  </TableCell>
                </TableRow>
              ) : (
                filteredMeds.map((med) => (
                  <TableRow key={med.id}>
                    <TableCell className="font-semibold text-foreground">
                      <div>
                        <span>{med.name}</span>
                        {med.reason && (
                          <span className="text-[11px] text-muted-foreground block font-normal">
                            Reason: {med.reason}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{med.dosage}</TableCell>
                    <TableCell>{med.frequency}</TableCell>
                    <TableCell className="font-mono text-[11px]">{formatDate(med.startDate)}</TableCell>
                    <TableCell className="font-mono text-[11px]">{formatDate(med.endDate)}</TableCell>
                    <TableCell>
                      <div>
                        <span className="font-medium text-foreground block">{med.doctorName}</span>
                        <span className="text-[10px] text-muted-foreground">{med.hospitalName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="auto" status={med.status} size="sm" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedMed(med)}
                        leftIcon={<Eye className="h-3 w-3" />}
                      >
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Medication Detail Drawer */}
      {selectedMed && (
        <Drawer
          isOpen={!!selectedMed}
          onClose={() => setSelectedMed(null)}
          title={`Medication Details: ${selectedMed.name}`}
          subtitle={`Prescribed by ${selectedMed.doctorName} (${selectedMed.hospitalName})`}
          footer={
            <Button size="sm" variant="outline" onClick={() => setSelectedMed(null)}>
              Close Drawer
            </Button>
          }
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 rounded bg-surface-alt border border-border space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Status</span>
                <Badge variant="auto" status={selectedMed.status} size="sm" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Course Duration</span>
                <span className="font-semibold text-foreground font-mono">
                  {formatDate(selectedMed.startDate)} → {formatDate(selectedMed.endDate)} ({selectedMed.duration})
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Dosage & Frequency</span>
                <span className="font-semibold text-foreground">
                  {selectedMed.dosage} • {selectedMed.frequency}
                </span>
              </div>
              {selectedMed.batchNumber && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Manufacturer Batch Number</span>
                  <span className="font-mono text-foreground font-semibold">{selectedMed.batchNumber}</span>
                </div>
              )}
              {selectedMed.expiryDate && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Drug Expiry Date</span>
                  <span className="font-mono text-foreground">{selectedMed.expiryDate}</span>
                </div>
              )}
            </div>

            <div>
              <label className="font-semibold text-foreground block mb-1">Clinical Indication / Reason</label>
              <div className="p-2.5 rounded bg-surface border border-border text-foreground">
                {selectedMed.reason || 'General clinical maintenance'}
              </div>
            </div>

            <div>
              <label className="font-semibold text-foreground block mb-1">Patient Instructions</label>
              <div className="p-3 rounded bg-surface border border-border text-muted-foreground leading-relaxed">
                {selectedMed.instructions || 'Take as directed by treating physician.'}
              </div>
            </div>
          </div>
        </Drawer>
      )}

      {/* Add Medication Modal */}
      {isAddModalOpen && (
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Add Medication Record"
          description="Record a current or previous prescription medicine course"
          maxWidth="md"
        >
          <form onSubmit={handleAddMedication} className="space-y-3 text-xs">
            <div>
              <label className="font-semibold text-foreground block mb-1">Medicine Name & Strength *</label>
              <input
                type="text"
                required
                value={newMed.name}
                onChange={(e) => setNewMed({ ...newMed, name: e.target.value })}
                placeholder="e.g. Paracetamol 650mg, Amoxicillin 500mg"
                className="w-full h-8 px-3 rounded border border-input bg-surface text-foreground"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-foreground block mb-1">Dosage</label>
                <input
                  type="text"
                  value={newMed.dosage}
                  onChange={(e) => setNewMed({ ...newMed, dosage: e.target.value })}
                  placeholder="e.g. 1 tablet, 2 puffs, 5ml"
                  className="w-full h-8 px-3 rounded border border-input bg-surface text-foreground"
                />
              </div>
              <div>
                <label className="font-semibold text-foreground block mb-1">Frequency</label>
                <input
                  type="text"
                  value={newMed.frequency}
                  onChange={(e) => setNewMed({ ...newMed, frequency: e.target.value })}
                  placeholder="e.g. Twice daily, Once at bedtime"
                  className="w-full h-8 px-3 rounded border border-input bg-surface text-foreground"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-foreground block mb-1">Start Date</label>
                <input
                  type="date"
                  value={newMed.startDate}
                  onChange={(e) => setNewMed({ ...newMed, startDate: e.target.value })}
                  className="w-full h-8 px-3 rounded border border-input bg-surface text-foreground"
                />
              </div>
              <div>
                <label className="font-semibold text-foreground block mb-1">End Date</label>
                <input
                  type="date"
                  value={newMed.endDate}
                  onChange={(e) => setNewMed({ ...newMed, endDate: e.target.value })}
                  className="w-full h-8 px-3 rounded border border-input bg-surface text-foreground"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-foreground block mb-1">Prescribing Doctor</label>
                <input
                  type="text"
                  value={newMed.doctorName}
                  onChange={(e) => setNewMed({ ...newMed, doctorName: e.target.value })}
                  className="w-full h-8 px-3 rounded border border-input bg-surface text-foreground"
                />
              </div>
              <div>
                <label className="font-semibold text-foreground block mb-1">Hospital / Clinic</label>
                <input
                  type="text"
                  value={newMed.hospitalName}
                  onChange={(e) => setNewMed({ ...newMed, hospitalName: e.target.value })}
                  className="w-full h-8 px-3 rounded border border-input bg-surface text-foreground"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-foreground block mb-1">Instructions / Advisory</label>
              <textarea
                rows={2}
                value={newMed.instructions}
                onChange={(e) => setNewMed({ ...newMed, instructions: e.target.value })}
                className="w-full p-2 rounded border border-input bg-surface text-foreground"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsAddModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm">
                Save Medication
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
