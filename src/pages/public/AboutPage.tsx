import React from 'react';
import { ShieldCheck, Layers, Award, FileCode, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <div className="text-left space-y-2 border-b border-border pb-6">
        <span className="text-xs font-bold uppercase tracking-wider text-primary">
          Smart India Hackathon Prototype
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
          About Aarogyam Unified Health Ecosystem
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-3xl leading-relaxed">
          Aarogyam was designed to solve the critical problem of fragmented, lost, and inaccessible healthcare data across Indian medical facilities.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <CardTitle>Institutional Mission</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Empower every citizen with single-point ownership of their health history, while giving attending doctors instant access to critical diagnostic insights under strict consent.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-primary" />
              <CardTitle>Interoperability by Design</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Conceptually mapped to national healthcare interoperability standards (Patient, Practitioner, Encounter, Condition, Medication, Immunization, DiagnosticReport).
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              <CardTitle>Public Service Ethics</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Built using accessible web design principles inspired by institutional government platforms: high contrast, zero dark patterns, no vendor lock-in, and full auditability.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Standards & Mapping */}
      <Card>
        <CardHeader>
          <CardTitle>FHIR / Healthcare Interoperability Alignment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-xs text-muted-foreground">
            <p>
              The frontend data model is structured for seamless bridge integration with future REST / FHIR / ABDM API endpoints:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-2.5 rounded bg-surface-alt border border-border">
                <span className="font-bold text-foreground block">Patient</span>
                <span className="text-[11px]">→ /api/v1/patients</span>
              </div>
              <div className="p-2.5 rounded bg-surface-alt border border-border">
                <span className="font-bold text-foreground block">Encounter</span>
                <span className="text-[11px]">→ /api/v1/consultations</span>
              </div>
              <div className="p-2.5 rounded bg-surface-alt border border-border">
                <span className="font-bold text-foreground block">Immunization</span>
                <span className="text-[11px]">→ /api/v1/vaccinations</span>
              </div>
              <div className="p-2.5 rounded bg-surface-alt border border-border">
                <span className="font-bold text-foreground block">DiagnosticReport</span>
                <span className="text-[11px]">→ /api/v1/labs</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
