import React, { useState } from 'react';
import {
  FileText,
  Search,
  Eye,
  Printer,
  Calendar,
  User,
  Pill,
  Building2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/common/Table';
import { Modal } from '../../components/common/Modal';
import { useApp } from '../../context/AppContext';
import { Prescription } from '../../types';
import { formatDate } from '../../utils/formatters';

export const PrescriptionsPage: React.FC = () => {
  const { prescriptions } = useApp();
  const [selectedRx, setSelectedRx] = useState<Prescription | null>(null);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-surface rounded-md border border-border p-4 sm:p-5 shadow-card space-y-1">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          <h1 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">
            Issued Digital Prescriptions
          </h1>
        </div>
        <p className="text-xs text-muted-foreground">
          Repository of digitally signed outpatient and inpatient prescription records.
        </p>
      </div>

      {/* Prescriptions Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Prescription ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Patient Name / ID</TableHead>
                <TableHead>Diagnosis</TableHead>
                <TableHead>Medicines Count</TableHead>
                <TableHead>Follow-up Date</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {prescriptions.map((rx) => (
                <TableRow key={rx.id}>
                  <TableCell className="font-mono font-bold text-primary">{rx.prescriptionId}</TableCell>
                  <TableCell className="font-mono text-[11px]">{formatDate(rx.date)}</TableCell>
                  <TableCell>
                    <div>
                      <span className="font-semibold text-foreground block">{rx.patientName}</span>
                      <span className="text-[10px] text-muted-foreground font-mono">ID: {rx.patientId}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs font-medium text-foreground">{rx.diagnosis}</TableCell>
                  <TableCell>{rx.medicines.length} Medicines</TableCell>
                  <TableCell className="font-mono text-[11px]">{formatDate(rx.followUpDate)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedRx(rx)}
                      leftIcon={<Eye className="h-3 w-3" />}
                    >
                      View & Print
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Prescription View/Print Modal */}
      {selectedRx && (
        <Modal
          isOpen={!!selectedRx}
          onClose={() => setSelectedRx(null)}
          title="Digital Prescription Details"
          maxWidth="lg"
          footer={
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={() => window.print()} leftIcon={<Printer className="h-3.5 w-3.5" />}>
                Print Signed Rx
              </Button>
              <Button size="sm" variant="primary" onClick={() => setSelectedRx(null)}>
                Close
              </Button>
            </div>
          }
        >
          <div className="p-4 rounded border border-border bg-surface text-xs space-y-4 font-sans">
            <div className="text-center border-b border-border pb-3">
              <h2 className="text-base font-bold uppercase text-foreground">{selectedRx.hospitalName}</h2>
              <p className="text-muted-foreground text-[11px]">{selectedRx.hospitalAddress} • {selectedRx.hospitalPhone}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 border-b border-border pb-3 text-[11px]">
              <div>
                <p><span className="font-semibold">Doctor:</span> {selectedRx.doctorName}</p>
                <p><span className="font-semibold">Specialty:</span> {selectedRx.doctorSpecialty}</p>
                <p><span className="font-semibold">Reg No:</span> {selectedRx.doctorRegNo}</p>
              </div>
              <div>
                <p><span className="font-semibold">Patient:</span> {selectedRx.patientName} ({selectedRx.patientAge}y/{selectedRx.patientGender})</p>
                <p><span className="font-semibold">Patient ID:</span> {selectedRx.patientId}</p>
                <p><span className="font-semibold">Date:</span> {formatDate(selectedRx.date)}</p>
              </div>
            </div>

            <div>
              <p className="font-bold text-foreground">Diagnosis: <span className="font-normal">{selectedRx.diagnosis}</span></p>
              {selectedRx.clinicalNotes && (
                <p className="text-muted-foreground mt-1"><span className="font-medium text-foreground">Notes:</span> {selectedRx.clinicalNotes}</p>
              )}
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
                    <TableHead>Instructions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedRx.medicines.map((m, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-semibold">{m.medicineName}</TableCell>
                      <TableCell>{m.dosage}</TableCell>
                      <TableCell>{m.frequency}</TableCell>
                      <TableCell>{m.duration}</TableCell>
                      <TableCell className="text-muted-foreground">{m.instructions}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="pt-2 flex justify-between text-[11px] text-muted-foreground border-t border-border">
              <span>Follow-up advised in {selectedRx.followUpDays} days ({formatDate(selectedRx.followUpDate)})</span>
              <span className="font-semibold text-foreground">Digitally Signed & Verified</span>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
