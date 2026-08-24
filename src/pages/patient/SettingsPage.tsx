import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  User,
  Shield,
  Bell,
  Sun,
  Moon,
  Lock,
  Smartphone,
  Save,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../components/common/Toast';

export const SettingsPage: React.FC = () => {
  const { patient, updatePatient, darkMode, toggleDarkMode } = useApp();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: patient.name,
    phone: patient.phone,
    email: patient.email,
    address: patient.address,
    bloodGroup: patient.bloodGroup,
  });

  const [mfaEnabled, setMfaEnabled] = useState(true);
  const [notifPreferences, setNotifPreferences] = useState({
    vaccineAlerts: true,
    appointmentReminders: true,
    medicationRefills: true,
    securityAccessAudit: true,
  });

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updatePatient(formData);
    showToast('Personal information updated successfully.', 'success');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-surface rounded-md border border-border p-4 sm:p-5 shadow-card space-y-1">
        <div className="flex items-center gap-2">
          <SettingsIcon className="h-5 w-5 text-primary" />
          <h1 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">
            Profile & Security Settings
          </h1>
        </div>
        <p className="text-xs text-muted-foreground">
          Manage your personal demographics, multi-factor authentication, privacy preferences, and theme appearance.
        </p>
      </div>

      <div className="space-y-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-4 w-4 text-primary" /> Personal Demographics
            </CardTitle>
            <CardDescription>Verified under Patient ID: {patient.patientId}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-foreground block mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full h-8 px-3 rounded border border-input bg-surface text-foreground"
                  />
                </div>
                <div>
                  <label className="font-semibold text-foreground block mb-1">Blood Group</label>
                  <input
                    type="text"
                    value={formData.bloodGroup}
                    onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                    className="w-full h-8 px-3 rounded border border-input bg-surface text-foreground"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-foreground block mb-1">Mobile Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full h-8 px-3 rounded border border-input bg-surface text-foreground"
                  />
                </div>
                <div>
                  <label className="font-semibold text-foreground block mb-1">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full h-8 px-3 rounded border border-input bg-surface text-foreground"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-foreground block mb-1">Residential Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full h-8 px-3 rounded border border-input bg-surface text-foreground"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <Button type="submit" variant="primary" size="sm" leftIcon={<Save className="h-3.5 w-3.5" />}>
                  Save Demographics
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Security & MFA */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" /> Security & Identity Protection
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="p-3 rounded bg-surface-alt border border-border flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="font-bold text-foreground block">Two-Factor Authentication (MFA)</span>
                <span className="text-muted-foreground text-[11px]">Require OTP verification upon terminal login</span>
              </div>
              <Button
                size="sm"
                variant={mfaEnabled ? 'outline' : 'primary'}
                onClick={() => {
                  setMfaEnabled(!mfaEnabled);
                  showToast(mfaEnabled ? 'MFA disabled' : 'MFA enabled', 'info');
                }}
              >
                {mfaEnabled ? 'Enabled' : 'Disabled'}
              </Button>
            </div>

            <div className="p-3 rounded bg-surface-alt border border-border flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="font-bold text-foreground block">Verified National Health ID Token</span>
                <span className="text-muted-foreground font-mono text-[11px]">{patient.nationalHealthIdDemo}</span>
              </div>
              <Badge variant="success" size="sm">Active Token</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Notifications Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-primary" /> Notification Categories
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-2 rounded bg-surface-alt/50 border border-border cursor-pointer">
              <span>Vaccination Due Reminders (e.g. Hepatitis B next dose)</span>
              <input
                type="checkbox"
                checked={notifPreferences.vaccineAlerts}
                onChange={(e) => setNotifPreferences({ ...notifPreferences, vaccineAlerts: e.target.checked })}
                className="h-4 w-4 text-primary rounded"
              />
            </label>
            <label className="flex items-center justify-between p-2 rounded bg-surface-alt/50 border border-border cursor-pointer">
              <span>Appointment Schedule Reminders</span>
              <input
                type="checkbox"
                checked={notifPreferences.appointmentReminders}
                onChange={(e) => setNotifPreferences({ ...notifPreferences, appointmentReminders: e.target.checked })}
                className="h-4 w-4 text-primary rounded"
              />
            </label>
            <label className="flex items-center justify-between p-2 rounded bg-surface-alt/50 border border-border cursor-pointer">
              <span>Prescription & Medication Refill Notifications</span>
              <input
                type="checkbox"
                checked={notifPreferences.medicationRefills}
                onChange={(e) => setNotifPreferences({ ...notifPreferences, medicationRefills: e.target.checked })}
                className="h-4 w-4 text-primary rounded"
              />
            </label>
            <label className="flex items-center justify-between p-2 rounded bg-surface-alt/50 border border-border cursor-pointer">
              <span>Security Access Alerts (When a doctor views private records)</span>
              <input
                type="checkbox"
                checked={notifPreferences.securityAccessAudit}
                onChange={(e) => setNotifPreferences({ ...notifPreferences, securityAccessAudit: e.target.checked })}
                className="h-4 w-4 text-primary rounded"
              />
            </label>
          </CardContent>
        </Card>

        {/* Appearance Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Interface Appearance</CardTitle>
            <CardDescription>Toggle between institutional light theme and dark high-contrast mode</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="space-y-0.5 text-xs">
              <span className="font-bold text-foreground block">Theme Mode</span>
              <span className="text-muted-foreground">Currently: {darkMode ? 'Dark Mode' : 'Light Mode'}</span>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={toggleDarkMode}
              leftIcon={darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            >
              {darkMode ? 'Switch to Light' : 'Switch to Dark'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
