import React from 'react';
import { Link } from 'react-router-dom';
import {
  Clock,
  Stethoscope,
  Pill,
  Syringe,
  FlaskConical,
  LineChart,
  Calendar,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  FolderLock,
  Users,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';

export const FeaturesPage: React.FC = () => {
  const modules = [
    {
      title: 'Unified Health Timeline',
      icon: Clock,
      tag: 'Core Innovation',
      description: 'A continuous, chronological medical log aggregating clinical visits, diagnoses, prescriptions, lab panels, and immunizations.',
      bullets: [
        'Chronological order from present to past',
        'Filtering by Consultations, Medicines, Vaccines, Labs, and Visits',
        'Direct search across all clinical notes and diagnosis strings',
        'Date range selector and sort toggles',
      ],
      link: '/patient/timeline',
    },
    {
      title: 'Digital Clinical Case-Taking',
      icon: Stethoscope,
      tag: 'SIH Core Workflow',
      description: 'A structured 6-step medical recording interface for doctors to conduct consultations efficiently and accurately.',
      bullets: [
        'Step 1: Chief complaint, duration, and severity',
        'Step 2: Present illness, past medical history & surgery history',
        'Step 3: Vitals recording (BP, Pulse, SpO2, Temp, Weight, Height)',
        'Step 4: Clinical assessment and diagnosis severity',
        'Step 5: Drug regimens, test recommendations & follow-up date',
        'Step 6: Consultation summary & digital prescription generation',
      ],
      link: '/doctor/case/new',
    },
    {
      title: 'Vaccination & Immunization Ledger',
      icon: Syringe,
      tag: 'Public Health Tracking',
      description: 'Comprehensive dose-by-dose tracking for multi-shot immunizations with days-remaining countdowns.',
      bullets: [
        'Multi-dose progression tracking (e.g. Hepatitis B Dose 1, 2, 3)',
        'Batch number, manufacturer, and administration nurse recording',
        'Automated notifications when next booster or dose is due',
        'Institutional vaccination verification certificate generation',
      ],
      link: '/patient/vaccinations',
    },
    {
      title: 'Granular Consent & Sharing Engine',
      icon: ShieldCheck,
      tag: 'Privacy Architecture',
      description: 'Complete patient sovereignty over medical records with category-level access control and duration constraints.',
      bullets: [
        'Selectively authorize diagnoses, medicines, vaccines, or labs',
        'Time-bound permissions (24 hours, 7 days, 30 days)',
        'Incoming doctor access requests approval / denial queue',
        'Instant one-click revocation with zero residual access',
      ],
      link: '/patient/consent',
    },
    {
      title: 'Emergency Health Card & Break-Glass Protocol',
      icon: AlertTriangle,
      tag: 'Critical Care Safety',
      description: 'Life-saving critical details available instantly during road trauma or acute unconsciousness.',
      bullets: [
        'Prominent blood group, severe drug allergies & active conditions',
        'Emergency family contact numbers with one-touch calling',
        'Break-glass emergency access logged automatically in audit trail',
        'Demo QR generator for emergency responder verification',
      ],
      link: '/patient/emergency',
    },
    {
      title: 'Immutable Audit Trail',
      icon: ShieldAlert,
      tag: 'Governance & Trust',
      description: 'Full transparency regarding who inspected, modified, or exported patient medical records.',
      bullets: [
        'Detailed logs with user role, name, facility, and IP address',
        'Distinguishes between Authorized View, Revocation, and Emergency Access',
        'Filterable by user, action type, date range, and record category',
        'Accessible to both patient and hospital compliance administrators',
      ],
      link: '/patient/security',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <div className="text-left space-y-2 border-b border-border pb-6">
        <span className="text-xs font-bold uppercase tracking-wider text-primary">
          Platform Capabilities
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
          Aarogyam Feature Specifications
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-3xl leading-relaxed">
          Engineered to institutional public-service standards, Aarogyam combines clinical depth with intuitive citizen access.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((mod, idx) => {
          const Icon = mod.icon;
          return (
            <Card key={idx} className="flex flex-col justify-between">
              <div>
                <CardHeader>
                  <div className="flex items-center justify-between w-full">
                    <div className="h-8 w-8 rounded bg-primary-muted text-primary flex items-center justify-center">
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-surface-alt border border-border text-foreground">
                      {mod.tag}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <h3 className="text-sm font-bold text-foreground">{mod.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {mod.description}
                  </p>
                  <ul className="space-y-1.5 text-xs text-foreground/85 pt-2 border-t border-border/80">
                    {mod.bullets.map((b, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </div>
              <div className="p-4 border-t border-border bg-surface-alt/40">
                <Link to={mod.link}>
                  <Button variant="outline" size="sm" className="w-full justify-between">
                    <span>Explore Feature</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
