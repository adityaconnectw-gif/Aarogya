import React from 'react';
import { Link } from 'react-router-dom';
import {
  UserCheck,
  Clock,
  ShieldCheck,
  Building2,
  Stethoscope,
  ArrowRight,
  CheckCircle2,
  FileText,
  Lock,
  Phone,
  HeartHandshake,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { AarogyamLogo } from '../../components/common/AarogyamLogo';

export const HowItWorksPage: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Create Your Free Citizen Health ID',
      desc: 'Sign up in 2 minutes. Receive your unique Patient ID and secure emergency pass without complicated paperwork.',
      bullets: ['Link your mobile number', 'Add critical allergies (like Penicillin)', 'Add blood group (e.g. B+)'],
    },
    {
      step: '02',
      title: 'All Your Past Records in One Unified Timeline',
      desc: 'Whenever you visit an accredited hospital or clinic, your diagnosis, prescription, lab tests, and vaccines are automatically added to your personal timeline.',
      bullets: ['Chronological record stream', 'Automatic vaccine countdowns', 'Zero lost paper slips'],
    },
    {
      step: '03',
      title: 'Share Temporarily with Doctors When Visiting',
      desc: 'When you walk into an OPD, give your doctor permission to review your past illnesses. Access is strictly time-bound (e.g. 24 hours) and revokes automatically.',
      bullets: ['Granular record category choices', 'Instant 1-click revoke button', 'Real-time security alerts'],
    },
    {
      step: '04',
      title: 'Emergency Life-Saving Protection',
      desc: 'In case of sudden accident or trauma, emergency paramedics can scan your Emergency Pass to know your blood group and critical drug allergies instantly.',
      bullets: ['Break-glass trauma access', 'Tamper-evident audit trail', 'Immediate family SMS alert'],
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 text-xs">
      {/* Top Banner */}
      <div className="bg-surface rounded-md border border-border p-6 shadow-xs text-center space-y-2 flex flex-col items-center">
        <AarogyamLogo size="lg" />
        <span className="text-[11px] font-bold text-secondary uppercase tracking-wider bg-secondary/10 px-3 py-1 rounded-full inline-block">
          Simple Step-by-Step Guide
        </span>
        <h1 className="text-xl sm:text-3xl font-extrabold text-foreground tracking-tight">
          How Aarogyam Works for You and Your Family
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl mx-auto">
          A transparent, public-service digital health ecosystem designed to protect your medical history and give you total ownership over your data.
        </p>
      </div>

      {/* 4 Steps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {steps.map((s, i) => (
          <Card key={i} className="p-5 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="h-8 w-8 rounded bg-primary text-white font-bold flex items-center justify-center text-sm font-mono">
                  {s.step}
                </span>
                <Badge variant="primary" size="sm">Step {i + 1}</Badge>
              </div>

              <h3 className="text-sm sm:text-base font-bold text-foreground">{s.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{s.desc}</p>

              <div className="pt-2 space-y-1">
                {s.bullets.map((b, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-foreground font-medium text-[11px]">
                    <CheckCircle2 className="h-3.5 w-3.5 text-success shrink-0" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Before vs After Table */}
      <Card>
        <CardHeader>
          <CardTitle>Before Aarogyam vs. With Aarogyam</CardTitle>
          <CardDescription>How Aarogyam solves the daily struggles of hospital paperwork in India</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-surface-alt border-y border-border">
                  <th className="p-3 font-bold text-muted-foreground w-1/3">Traditional Healthcare (Before)</th>
                  <th className="p-3 font-bold text-primary w-2/3 bg-primary/5">With Aarogyam (Now)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="p-3 text-muted-foreground">Carrying heavy plastic folders of old paper prescriptions to every OPD visit.</td>
                  <td className="p-3 font-semibold text-foreground bg-primary/5">Everything is organized on your phone in one clean chronological timeline.</td>
                </tr>
                <tr>
                  <td className="p-3 text-muted-foreground">Forgetting when your baby's 3rd Hepatitis B or Polio booster is due.</td>
                  <td className="p-3 font-semibold text-foreground bg-primary/5">Automatic immunization tracker with countdown alerts and nurse verified entries.</td>
                </tr>
                <tr>
                  <td className="p-3 text-muted-foreground">Doctors unaware of severe penicillin allergies during emergency triage.</td>
                  <td className="p-3 font-semibold text-foreground bg-primary/5">Immediate Emergency Health Pass with prominent safety alerts preventing dangerous reactions.</td>
                </tr>
                <tr>
                  <td className="p-3 text-muted-foreground">Zero control over who photocopies or stores your private health documents.</td>
                  <td className="p-3 font-semibold text-foreground bg-primary/5">Sovereign granular consent: you grant 24-hour access and can revoke it with 1 tap.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Action CTA */}
      <div className="bg-[#0b2545] text-white p-6 rounded-md text-center space-y-3">
        <h3 className="text-base font-bold text-white">Ready to Experience Aarogyam?</h3>
        <p className="text-xs text-white/80 max-w-md mx-auto">
          Try the interactive Smart India Hackathon demo with pre-loaded patient and clinician accounts.
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <Link to="/patient/dashboard">
            <Button size="sm" variant="secondary">
              Open Patient Demo (Aditya)
            </Button>
          </Link>
          <Link to="/doctor/case/new">
            <Button size="sm" variant="outline" className="bg-white/10 text-white border-white/30 hover:bg-white/20">
              Open Doctor Case-Taking (Dr. Rohan)
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
