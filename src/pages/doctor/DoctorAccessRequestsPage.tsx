import React, { useState } from 'react';
import {
  ShieldCheck,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  User,
  Calendar,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/common/Table';
import { Modal } from '../../components/common/Modal';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../components/common/Toast';
import { formatDate } from '../../utils/formatters';

export const DoctorAccessRequestsPage: React.FC = () => {
  const { accessRequests, doctorRequestAccess, patient } = useApp();
  const { showToast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [patientIdInput, setPatientIdInput] = useState(patient.patientId);
  const [duration, setDuration] = useState<'24 hours' | '7 days' | '30 days'>('24 hours');
  const [purpose, setPurpose] = useState('Comprehensive outpatient examination and longitudinal record inspection');
  const [reqPerms, setReqPerms] = useState({
    diagnoses: true,
    medications: true,
    vaccinations: true,
    labReports: true,
    otherRecords: false,
  });

  const handleSendRequest = (e: React.FormEvent) => {
    e.preventDefault();
    doctorRequestAccess(
      'doc-001',
      'Dr. Rohan Sharma',
      'General Medicine',
      'City Care Hospital',
      reqPerms,
      duration,
      purpose
    );

    showToast('Access request submitted to patient notification queue.', 'success');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-surface rounded-md border border-border p-4 sm:p-5 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <h1 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">
              Patient Record Access Requests
            </h1>
          </div>
          <p className="text-xs text-muted-foreground">
            Manage your time-bound record authorizations and submit new consent requests to patients.
          </p>
        </div>

        <Button
          size="sm"
          variant="primary"
          onClick={() => setIsModalOpen(true)}
          leftIcon={<Plus className="h-4 w-4" />}
        >
          New Access Request
        </Button>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Request ID</TableHead>
                <TableHead>Patient Name / ID</TableHead>
                <TableHead>Requested Records</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Purpose</TableHead>
                <TableHead>Requested On</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accessRequests.map((req) => (
                <TableRow key={req.id}>
                  <TableCell className="font-mono font-bold text-primary">{req.requestId}</TableCell>
                  <TableCell>
                    <div>
                      <span className="font-bold text-foreground block">{req.patientName}</span>
                      <span className="text-[10px] font-mono text-muted-foreground">ID: {req.patientId}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs">
                    <div className="flex flex-wrap gap-1">
                      {req.requestedRecords.diagnoses && <Badge variant="outline" size="sm">Diagnoses</Badge>}
                      {req.requestedRecords.medications && <Badge variant="outline" size="sm">Meds</Badge>}
                      {req.requestedRecords.vaccinations && <Badge variant="outline" size="sm">Vaccines</Badge>}
                      {req.requestedRecords.labReports && <Badge variant="outline" size="sm">Labs</Badge>}
                    </div>
                  </TableCell>
                  <TableCell>{req.duration}</TableCell>
                  <TableCell className="text-xs text-muted-foreground max-w-xs truncate">{req.purpose}</TableCell>
                  <TableCell className="font-mono text-[11px]">{formatDate(req.requestedAt)}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant="auto" status={req.status} size="sm" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Submit Patient Record Access Request"
          description="Send a consent notification to the patient terminal"
        >
          <form onSubmit={handleSendRequest} className="space-y-3 text-xs">
            <div>
              <label className="font-semibold text-foreground block mb-1">Target Patient ID *</label>
              <input
                type="text"
                required
                value={patientIdInput}
                onChange={(e) => setPatientIdInput(e.target.value)}
                placeholder="e.g. P-10001"
                className="w-full h-8 px-3 rounded border border-input bg-surface text-foreground font-mono"
              />
            </div>

            <div>
              <label className="font-semibold text-foreground block mb-2">Requested Record Categories:</label>
              <div className="grid grid-cols-2 gap-2">
                <label className="flex items-center gap-2 p-2 rounded bg-surface-alt border border-border">
                  <input
                    type="checkbox"
                    checked={reqPerms.diagnoses}
                    onChange={(e) => setReqPerms({ ...reqPerms, diagnoses: e.target.checked })}
                  />
                  <span>Diagnoses</span>
                </label>
                <label className="flex items-center gap-2 p-2 rounded bg-surface-alt border border-border">
                  <input
                    type="checkbox"
                    checked={reqPerms.medications}
                    onChange={(e) => setReqPerms({ ...reqPerms, medications: e.target.checked })}
                  />
                  <span>Medication History</span>
                </label>
                <label className="flex items-center gap-2 p-2 rounded bg-surface-alt border border-border">
                  <input
                    type="checkbox"
                    checked={reqPerms.vaccinations}
                    onChange={(e) => setReqPerms({ ...reqPerms, vaccinations: e.target.checked })}
                  />
                  <span>Vaccination Records</span>
                </label>
                <label className="flex items-center gap-2 p-2 rounded bg-surface-alt border border-border">
                  <input
                    type="checkbox"
                    checked={reqPerms.labReports}
                    onChange={(e) => setReqPerms({ ...reqPerms, labReports: e.target.checked })}
                  />
                  <span>Full Lab History</span>
                </label>
              </div>
            </div>

            <div>
              <label className="font-semibold text-foreground block mb-1">Access Duration</label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value as any)}
                className="w-full h-8 px-3 rounded border border-input bg-surface text-foreground"
              >
                <option value="24 hours">24 Hours (OPD Consult)</option>
                <option value="7 days">7 Days</option>
                <option value="30 days">30 Days</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-foreground block mb-1">Clinical Justification / Reason</label>
              <textarea
                rows={2}
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="w-full p-2 rounded border border-input bg-surface text-foreground"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm">
                Submit Request
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
