import React, { useState } from 'react';
import {
  AlertTriangle,
  Heart,
  ShieldAlert,
  Phone,
  QrCode,
  Lock,
  CheckCircle2,
  Share2,
  Printer,
  Eye,
  UserCheck,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../components/common/Toast';
import { formatDate } from '../../utils/formatters';
import { AarogyamLogo } from '../../components/common/AarogyamLogo';

export const EmergencyCardPage: React.FC = () => {
  const { emergencyProfile, patient, triggerEmergencyAccess } = useApp();
  const { showToast } = useToast();

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [unlockedMode, setUnlockedMode] = useState(false);

  const handleBreakGlassConfirm = () => {
    triggerEmergencyAccess('Dr. Triage Duty Medical Officer', 'City Care Hospital Trauma Unit');
    setUnlockedMode(true);
    setIsConfirmModalOpen(false);
    showToast('Emergency access verified & recorded in security audit log.', 'warning');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-surface rounded-md border border-border p-4 sm:p-5 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-rose-600" />
            <h1 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">
              Emergency Health Card
            </h1>
          </div>
          <p className="text-xs text-muted-foreground">
            Life-critical medical profile for trauma triaging, critical allergies, and verified emergency contacts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsQrModalOpen(true)}
            leftIcon={<QrCode className="h-4 w-4" />}
          >
            Generate Emergency QR
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => window.print()}
            leftIcon={<Printer className="h-4 w-4" />}
          >
            Print Card
          </Button>
        </div>
      </div>

      {/* Emergency Status Notice */}
      <div className="p-3.5 rounded-md border border-rose-200 dark:border-rose-900 bg-rose-50/50 dark:bg-rose-950/20 text-rose-950 dark:text-rose-200 text-xs flex items-start gap-2.5">
        <ShieldAlert className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-bold">Break-Glass Security Architecture</span>
          <p className="text-[11px] leading-relaxed">
            Emergency access bypasses regular OTP to save lives during acute trauma. Every break-glass access event is permanently logged into the institutional immutable audit trail with timestamp and practitioner credentials.
          </p>
        </div>
      </div>

      {/* The Physical-Style Emergency Health Card */}
      <div className="rounded-lg border-2 border-rose-500 bg-surface shadow-elevated overflow-hidden">
        {/* Card Top Red Header */}
        <div className="bg-rose-700 text-white p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <AarogyamLogo size="md" imgClassName="ring-2 ring-white/60 bg-white" />
            <div>
              <span className="text-[11px] uppercase tracking-widest font-semibold opacity-90 block">
                AAROGYAM NATIONAL HEALTH NETWORK • EMERGENCY MEDICAL CARD
              </span>
              <h2 className="text-lg font-bold tracking-tight">{emergencyProfile.name}</h2>
            </div>
          </div>

          <div className="text-left sm:text-right text-xs">
            <span className="font-mono font-bold text-sm bg-rose-800/80 px-2 py-1 rounded">
              ID: {emergencyProfile.patientId}
            </span>
            <span className="text-[10px] block opacity-80 mt-1">
              DOB: 14 Apr 2005 ({emergencyProfile.age} Yrs / {emergencyProfile.gender})
            </span>
          </div>
        </div>

        {/* Card Body Grid */}
        <div className="p-5 sm:p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Blood Group Large Badge */}
            <div className="p-4 rounded-md border border-border bg-surface-alt/50 flex flex-col items-center justify-center text-center">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Blood Group
              </span>
              <span className="text-3xl font-black text-rose-600 font-mono mt-1">
                {emergencyProfile.bloodGroup}
              </span>
              <span className="text-[10px] text-muted-foreground mt-1">Rh Factor: Positive</span>
            </div>

            {/* Critical Allergies Box */}
            <div className="p-4 rounded-md border border-rose-300 dark:border-rose-900 bg-rose-50/70 dark:bg-rose-950/30 sm:col-span-2 space-y-1.5">
              <span className="text-xs font-bold text-rose-800 dark:text-rose-300 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4 text-rose-600" /> Life-Threatening Allergies
              </span>
              <div className="space-y-1">
                {emergencyProfile.allergies.map((alg, idx) => (
                  <div key={idx} className="font-bold text-rose-900 dark:text-rose-100 text-xs flex items-center gap-1.5">
                    <span>• {alg}</span>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-rose-800 dark:text-rose-300 pt-1">
                STRICT CONTRAINDICATION: Do NOT administer Penicillin or Amoxicillin formulations under any circumstances.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Critical Conditions */}
            <div className="p-4 rounded-md border border-border bg-surface-alt/40 space-y-2">
              <span className="font-bold text-foreground block uppercase text-[11px] tracking-wider">
                Critical Chronic Conditions
              </span>
              <ul className="space-y-1 text-muted-foreground">
                {emergencyProfile.criticalConditions.map((cond, idx) => (
                  <li key={idx} className="flex items-center gap-2 font-medium text-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <span>{cond}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Current Medications */}
            <div className="p-4 rounded-md border border-border bg-surface-alt/40 space-y-2">
              <span className="font-bold text-foreground block uppercase text-[11px] tracking-wider">
                Current Active Medications
              </span>
              <ul className="space-y-1 text-muted-foreground">
                {emergencyProfile.currentMedications.map((med, idx) => (
                  <li key={idx} className="flex items-center gap-2 font-medium text-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <span>{med}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Emergency Contact & Organ Donor */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-md bg-surface-alt border border-border text-xs">
            <div className="space-y-1">
              <span className="font-bold text-foreground block uppercase text-[11px] tracking-wider flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-primary" /> Emergency Family Contact
              </span>
              <p className="font-semibold text-foreground">{emergencyProfile.emergencyContact.name}</p>
              <p className="text-muted-foreground font-mono text-sm font-bold text-primary">
                {emergencyProfile.emergencyContact.phone}
              </p>
            </div>

            <div className="space-y-1">
              <span className="font-bold text-foreground block uppercase text-[11px] tracking-wider">
                Organ Donor Registration
              </span>
              <p className="text-muted-foreground">{emergencyProfile.organDonorStatus}</p>
              <p className="text-[10px] text-muted-foreground">Verified by National Organ & Tissue Transplant Registry</p>
            </div>
          </div>

          {/* Action Trigger Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border">
            <span className="text-[11px] text-muted-foreground">
              Last Verified: {formatDate(emergencyProfile.lastUpdated)} • City Care Hospital
            </span>
            <Button
              variant="danger"
              size="md"
              onClick={() => setIsConfirmModalOpen(true)}
              leftIcon={<ShieldAlert className="h-4 w-4" />}
            >
              Simulate Emergency Access (Break-Glass)
            </Button>
          </div>
        </div>
      </div>

      {/* Break-Glass Confirmation Modal */}
      {isConfirmModalOpen && (
        <Modal
          isOpen={isConfirmModalOpen}
          onClose={() => setIsConfirmModalOpen(false)}
          title="Emergency Break-Glass Access Confirmation"
          description="Institutional Critical Care Verification"
          footer={
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={() => setIsConfirmModalOpen(false)}>
                Cancel
              </Button>
              <Button size="sm" variant="danger" onClick={handleBreakGlassConfirm}>
                Confirm Emergency Access
              </Button>
            </div>
          }
        >
          <div className="space-y-3 text-xs">
            <div className="p-3 rounded bg-rose-50 dark:bg-rose-950/40 border border-rose-300 text-rose-900 dark:text-rose-200">
              <p className="font-bold mb-1">WARNING: Break-Glass Protocol Invocation</p>
              <p className="text-[11px] leading-relaxed">
                Emergency access provides authorized medical personnel with immediate access to critical health information. The access is permanently recorded in the security audit log with your clinical ID, timestamp, and facility network address.
              </p>
            </div>

            <div className="space-y-2">
              <label className="font-semibold text-foreground block">Attending Clinician / Triage Unit</label>
              <input
                type="text"
                readOnly
                value="Dr. Triage Duty Medical Officer — City Care Hospital Emergency Trauma Desk"
                className="w-full h-8 px-3 rounded border border-input bg-surface-alt text-muted-foreground"
              />
            </div>
          </div>
        </Modal>
      )}

      {/* Emergency Demo QR Modal */}
      {isQrModalOpen && (
        <Modal
          isOpen={isQrModalOpen}
          onClose={() => setIsQrModalOpen(false)}
          title="Emergency Health QR (Demo Prototype)"
          description="Scan to simulate first-responder emergency retrieval"
          maxWidth="sm"
          footer={
            <Button size="sm" variant="primary" onClick={() => setIsQrModalOpen(false)} className="w-full">
              Close QR
            </Button>
          }
        >
          <div className="flex flex-col items-center text-center space-y-4 py-4">
            {/* Synthetic Institutional QR Representation */}
            <div className="p-4 rounded-lg bg-white border-2 border-slate-900 shadow-md">
              <div className="h-44 w-44 bg-slate-950 p-2 rounded flex flex-col justify-between items-center text-white font-mono text-[9px] text-center select-none">
                <div className="flex justify-between w-full">
                  <div className="h-8 w-8 bg-white" />
                  <div className="h-8 w-8 bg-white" />
                </div>
                <div className="p-1 bg-white text-black font-bold rounded">
                  AAROGYAM • P-10001
                </div>
                <div className="flex justify-between w-full">
                  <div className="h-8 w-8 bg-white" />
                  <div className="h-8 w-8 bg-white" />
                </div>
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <span className="font-bold text-foreground block">Demo Emergency QR Code</span>
              <p className="text-[11px] text-muted-foreground">
                Connects to the limited emergency profile for Aditya Verma (B+, Penicillin allergy, Asthma).
              </p>
              <span className="text-[10px] text-primary font-mono block">Token: EM-QR-9901-SEC</span>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
