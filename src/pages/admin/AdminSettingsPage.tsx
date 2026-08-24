import React from 'react';
import { Building2, Save, Server, Shield, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { useToast } from '../../components/common/Toast';

export const AdminSettingsPage: React.FC = () => {
  const { showToast } = useToast();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Hospital network configuration saved successfully.', 'success');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-surface rounded-md border border-border p-4 sm:p-5 shadow-card space-y-1">
        <div className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-primary" />
          <h1 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">
            Hospital Institution Configurations
          </h1>
        </div>
        <p className="text-xs text-muted-foreground">
          Apex node settings, FHIR interoperability endpoints, and compliance registry keys.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Facility Identification Profile</CardTitle>
          <CardDescription>Government registry node registration details</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-foreground block mb-1">Hospital Legal Name</label>
                <input
                  type="text"
                  defaultValue="City Care Hospital"
                  className="w-full h-8 px-3 rounded border border-input bg-surface text-foreground"
                />
              </div>
              <div>
                <label className="font-semibold text-foreground block mb-1">Facility Registry Code (FRC)</label>
                <input
                  type="text"
                  defaultValue="CCH-DEL-8801"
                  readOnly
                  className="w-full h-8 px-3 rounded border border-input bg-surface-alt text-muted-foreground font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="font-semibold text-foreground block mb-1">Total Licensed Beds</label>
                <input
                  type="number"
                  defaultValue={450}
                  className="w-full h-8 px-3 rounded border border-input bg-surface text-foreground"
                />
              </div>
              <div>
                <label className="font-semibold text-foreground block mb-1">Contact Phone</label>
                <input
                  type="text"
                  defaultValue="+91 11 2618 9000"
                  className="w-full h-8 px-3 rounded border border-input bg-surface text-foreground"
                />
              </div>
              <div>
                <label className="font-semibold text-foreground block mb-1">Administrative Email</label>
                <input
                  type="email"
                  defaultValue="info@citycare.gov.in"
                  className="w-full h-8 px-3 rounded border border-input bg-surface text-foreground"
                />
              </div>
            </div>

            <div className="p-3 rounded bg-surface-alt border border-border space-y-1">
              <span className="font-bold text-foreground block">Interoperability Bridge Status</span>
              <p className="text-[11px] text-muted-foreground">
                Connected to National Health Token Exchange Gateway. FHIR v4.0.1 compliance mode enabled.
              </p>
            </div>

            <div className="pt-2 flex justify-end">
              <Button type="submit" variant="primary" size="sm" leftIcon={<Save className="h-3.5 w-3.5" />}>
                Save Hospital Settings
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
