import React, { useState } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  UserCheck,
  Clock,
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Lock,
  Building2,
  FileCheck2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../components/common/Toast';
import { ConsentRecord, AccessRequest } from '../../types';
import { formatDate } from '../../utils/formatters';

export const ConsentPage: React.FC = () => {
  const {
    consents,
    accessRequests,
    doctors,
    grantConsent,
    revokeConsent,
    approveAccessRequest,
    denyAccessRequest,
  } = useApp();
  const { showToast } = useToast();

  const [isGrantModalOpen, setIsGrantModalOpen] = useState(false);
  const [selectedReqForApproval, setSelectedReqForApproval] = useState<AccessRequest | null>(null);

  // Grant Consent Form
  const [selectedDoctorId, setSelectedDoctorId] = useState(doctors[0]?.id || 'doc-001');
  const [recordPerms, setRecordPerms] = useState({
    diagnoses: true,
    medications: true,
    vaccinations: true,
    labReports: false,
    otherRecords: false,
  });
  const [duration, setDuration] = useState<ConsentRecord['duration']>('24 hours');

  const activeConsents = consents.filter((c) => c.status === 'Active');
  const revokedConsents = consents.filter((c) => c.status === 'Revoked');
  const pendingRequests = accessRequests.filter((r) => r.status === 'Pending');

  const handleGrantConsent = (e: React.FormEvent) => {
    e.preventDefault();
    const doc = doctors.find((d) => d.id === selectedDoctorId) || doctors[0];

    grantConsent(doc.id, doc.name, doc.hospitalName, recordPerms, duration);
    showToast(`Access permissions successfully granted to ${doc.name} for ${duration}.`, 'success');
    setIsGrantModalOpen(false);
  };

  const handleRevoke = (id: string, name: string) => {
    revokeConsent(id);
    showToast(`Access revoked from ${name}. Doctor can no longer inspect private records.`, 'info');
  };

  const handleApproveRequest = () => {
    if (!selectedReqForApproval) return;
    approveAccessRequest(selectedReqForApproval.id);
    showToast(`Access request from ${selectedReqForApproval.doctorName} approved!`, 'success');
    setSelectedReqForApproval(null);
  };

  const handleDenyRequest = (id: string, name: string) => {
    denyAccessRequest(id);
    showToast(`Access request from ${name} was denied.`, 'info');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-surface rounded-md border border-border p-4 sm:p-5 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <h1 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">
              Consent & Health Record Sharing
            </h1>
          </div>
          <p className="text-xs text-muted-foreground">
            You retain absolute sovereign control over which healthcare providers can inspect your medical records.
          </p>
        </div>

        <Button
          size="sm"
          variant="primary"
          onClick={() => setIsGrantModalOpen(true)}
          leftIcon={<Plus className="h-4 w-4" />}
        >
          Grant New Provider Access
        </Button>
      </div>

      {/* Institutional Privacy Guarantee Banner */}
      <div className="p-3.5 rounded-md border border-primary/20 bg-primary-muted text-xs text-primary flex items-start gap-2.5">
        <Lock className="h-4 w-4 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-bold">Patient Sovereignty & Ephemeral Data Access</span>
          <p className="text-[11px] opacity-90 leading-relaxed">
            All authorizations are strictly time-bound and automatically expire. Doctors only receive temporary read privileges to the specific categories you tick. You can revoke access immediately with a single click.
          </p>
        </div>
      </div>

      {/* PENDING ACCESS REQUESTS SECTION */}
      {pendingRequests.length > 0 && (
        <Card className="border-amber-300 dark:border-amber-900 bg-amber-50/20">
          <CardHeader className="bg-amber-100/40 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900">
            <div className="flex items-center justify-between w-full">
              <CardTitle className="text-amber-900 dark:text-amber-200 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-600" /> Incoming Doctor Access Requests ({pendingRequests.length})
              </CardTitle>
              <Badge variant="warning" size="sm">Action Required</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 p-4 sm:p-5">
            {pendingRequests.map((req) => (
              <div
                key={req.id}
                className="p-4 rounded-md border border-border bg-surface shadow-xs space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-2.5">
                  <div>
                    <h3 className="text-sm font-bold text-foreground">{req.doctorName}</h3>
                    <span className="text-xs text-muted-foreground">{req.doctorSpecialty} • {req.facilityName}</span>
                  </div>
                  <Badge variant="warning" size="sm">Requested Duration: {req.duration}</Badge>
                </div>

                <div className="space-y-2 text-xs">
                  <p className="text-muted-foreground">
                    <strong className="text-foreground">Clinical Purpose:</strong> {req.purpose}
                  </p>
                  <div>
                    <span className="font-semibold text-foreground block mb-1">Requested Record Categories:</span>
                    <div className="flex flex-wrap gap-2 text-[11px]">
                      {req.requestedRecords.diagnoses && <Badge variant="primary" size="sm">☑ Diagnoses</Badge>}
                      {req.requestedRecords.medications && <Badge variant="primary" size="sm">☑ Medications</Badge>}
                      {req.requestedRecords.vaccinations && <Badge variant="primary" size="sm">☑ Vaccinations</Badge>}
                      {req.requestedRecords.labReports && <Badge variant="primary" size="sm">☑ Lab Reports</Badge>}
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2 border-t border-border">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-danger hover:bg-danger-muted"
                    onClick={() => handleDenyRequest(req.id, req.doctorName)}
                  >
                    Deny Request
                  </Button>
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => setSelectedReqForApproval(req)}
                  >
                    Allow Doctor Access
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* ACTIVE CONSENTS LIST */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between w-full">
            <CardTitle>Currently Active Sharing Permissions</CardTitle>
            <Badge variant="success" size="sm">{activeConsents.length} Active</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {activeConsents.length === 0 ? (
            <div className="p-8 text-center text-xs text-muted-foreground">
              No active doctor sharing records. Click "Grant New Provider Access" to authorize a specialist.
            </div>
          ) : (
            activeConsents.map((con) => (
              <div
                key={con.id}
                className="p-4 rounded-md border border-border bg-surface-alt/40 space-y-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-foreground text-sm">{con.providerName}</h3>
                    <Badge variant="success" size="sm">Active</Badge>
                  </div>
                  <p className="text-muted-foreground">{con.facilityName} ({con.providerRole})</p>
                  
                  <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px]">
                    <span className="font-semibold text-foreground">Authorized:</span>
                    {con.authorizedRecords.diagnoses && <span className="px-1.5 py-0.5 rounded bg-surface border border-border">Diagnoses</span>}
                    {con.authorizedRecords.medications && <span className="px-1.5 py-0.5 rounded bg-surface border border-border">Medications</span>}
                    {con.authorizedRecords.vaccinations && <span className="px-1.5 py-0.5 rounded bg-surface border border-border">Vaccinations</span>}
                    {con.authorizedRecords.labReports && <span className="px-1.5 py-0.5 rounded bg-surface border border-border">Lab Reports</span>}
                  </div>

                  <p className="text-[11px] text-muted-foreground font-mono pt-1">
                    Expires on: {formatDate(con.expiresAt)} ({con.duration})
                  </p>
                </div>

                <div className="shrink-0">
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleRevoke(con.id, con.providerName)}
                    leftIcon={<Trash2 className="h-3.5 w-3.5" />}
                  >
                    Revoke Access
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* REVOKED OR EXPIRED CONSENTS */}
      {revokedConsents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-muted-foreground text-sm">Past Revoked Consents ({revokedConsents.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {revokedConsents.map((con) => (
              <div key={con.id} className="p-3 rounded bg-surface-alt/20 border border-border/60 text-xs flex items-center justify-between opacity-70">
                <div>
                  <span className="font-semibold text-foreground block">{con.providerName}</span>
                  <span className="text-[11px] text-muted-foreground">{con.facilityName} • Revoked</span>
                </div>
                <Badge variant="outline" size="sm">Access Terminated</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Grant New Consent Modal */}
      {isGrantModalOpen && (
        <Modal
          isOpen={isGrantModalOpen}
          onClose={() => setIsGrantModalOpen(false)}
          title="Share Health Records"
          description="Select healthcare provider and authorized record categories"
          maxWidth="md"
        >
          <form onSubmit={handleGrantConsent} className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-foreground block mb-1">Select Healthcare Provider *</label>
              <select
                value={selectedDoctorId}
                onChange={(e) => setSelectedDoctorId(e.target.value)}
                className="w-full h-8 px-3 rounded border border-input bg-surface text-foreground"
              >
                {doctors.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.specialty} — {d.hospitalName})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-semibold text-foreground block mb-2">Choose Authorized Record Categories:</label>
              <div className="grid grid-cols-2 gap-2">
                <label className="flex items-center gap-2 p-2 rounded bg-surface-alt border border-border cursor-pointer">
                  <input
                    type="checkbox"
                    checked={recordPerms.diagnoses}
                    onChange={(e) => setRecordPerms({ ...recordPerms, diagnoses: e.target.checked })}
                    className="h-3.5 w-3.5 text-primary rounded"
                  />
                  <span>Diagnoses</span>
                </label>
                <label className="flex items-center gap-2 p-2 rounded bg-surface-alt border border-border cursor-pointer">
                  <input
                    type="checkbox"
                    checked={recordPerms.medications}
                    onChange={(e) => setRecordPerms({ ...recordPerms, medications: e.target.checked })}
                    className="h-3.5 w-3.5 text-primary rounded"
                  />
                  <span>Medications</span>
                </label>
                <label className="flex items-center gap-2 p-2 rounded bg-surface-alt border border-border cursor-pointer">
                  <input
                    type="checkbox"
                    checked={recordPerms.vaccinations}
                    onChange={(e) => setRecordPerms({ ...recordPerms, vaccinations: e.target.checked })}
                    className="h-3.5 w-3.5 text-primary rounded"
                  />
                  <span>Vaccinations</span>
                </label>
                <label className="flex items-center gap-2 p-2 rounded bg-surface-alt border border-border cursor-pointer">
                  <input
                    type="checkbox"
                    checked={recordPerms.labReports}
                    onChange={(e) => setRecordPerms({ ...recordPerms, labReports: e.target.checked })}
                    className="h-3.5 w-3.5 text-primary rounded"
                  />
                  <span>Lab Reports</span>
                </label>
              </div>
            </div>

            <div>
              <label className="font-semibold text-foreground block mb-1">Access Duration Limit *</label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value as any)}
                className="w-full h-8 px-3 rounded border border-input bg-surface text-foreground"
              >
                <option value="24 hours">24 Hours (Recommended for OPD)</option>
                <option value="7 days">7 Days (Follow-up week)</option>
                <option value="30 days">30 Days (Ongoing treatment)</option>
                <option value="Permanent">Permanent Access</option>
              </select>
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-border">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsGrantModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm">
                Grant Access
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Approve Request Modal */}
      {selectedReqForApproval && (
        <Modal
          isOpen={!!selectedReqForApproval}
          onClose={() => setSelectedReqForApproval(null)}
          title="Authorize Access Request"
          description={`Confirm access permissions for ${selectedReqForApproval.doctorName}`}
          footer={
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={() => setSelectedReqForApproval(null)}>
                Cancel
              </Button>
              <Button size="sm" variant="primary" onClick={handleApproveRequest}>
                Confirm Authorization
              </Button>
            </div>
          }
        >
          <div className="space-y-3 text-xs">
            <p className="text-muted-foreground">
              You are about to allow <strong className="text-foreground">{selectedReqForApproval.doctorName}</strong> ({selectedReqForApproval.facilityName}) to inspect your medical records for a duration of <strong className="text-foreground">{selectedReqForApproval.duration}</strong>.
            </p>
            <div className="p-3 rounded bg-surface-alt border border-border">
              <span className="font-semibold block mb-1">Purpose:</span>
              <span className="text-muted-foreground">{selectedReqForApproval.purpose}</span>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
