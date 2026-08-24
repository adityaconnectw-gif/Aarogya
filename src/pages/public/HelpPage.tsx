import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Phone, Mail, FileQuestion } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';

export const HelpPage: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'What is Aarogyam and how does it benefit me?',
      a: 'Aarogyam is a unified digital health ecosystem that compiles your medical records into one longitudinal timeline. Whether you visit a government hospital, private clinic, or diagnostic lab, all authorized records connect to your single patient ID.',
    },
    {
      q: 'Can a doctor see my medical history without my permission?',
      a: 'No. Doctors cannot access your private records without your explicit consent. You can grant selective permission (e.g. only medications, or only lab reports) for a specific duration (such as 24 hours). You can also revoke access anytime.',
    },
    {
      q: 'What is the Emergency Health Card and Break-Glass access?',
      a: 'The Emergency Health Card contains vital triage information: blood group, severe allergies (like Penicillin), and critical conditions. In medical emergencies, certified trauma doctors can access this life-saving profile under a break-glass protocol, which is permanently logged in the audit trail.',
    },
    {
      q: 'How does vaccination tracking work?',
      a: 'When an authorized healthcare provider administers a vaccine dose (such as Hepatitis B or Covid-19), the batch number, manufacturer, and date are logged. The system calculates when your next dose is due and notifies you automatically.',
    },
    {
      q: 'How does Digital Case Taking help doctors?',
      a: 'Doctors use a standardized 6-step form covering Chief Complaints, History, Examination Vitals, Assessment, Treatment, and Summary. Completing the consultation automatically issues a prescription, updates the patient timeline, and logs the encounter.',
    },
    {
      q: 'Is my actual Aadhaar number stored on the platform?',
      a: 'No. Aarogyam utilizes synthetic, privacy-preserving institutional Patient IDs (e.g. P-10001) and demo verification tokens. Biometric or actual national identity numbers are never exposed.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="text-left space-y-2 border-b border-border pb-6">
        <span className="text-xs font-bold uppercase tracking-wider text-primary">
          Help Centre & FAQ
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
          Frequently Asked Questions
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Find answers to common questions about patient consent, doctor case-taking, emergency access, and record security.
        </p>
      </div>

      {/* Accordion FAQ List */}
      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="rounded-md border border-border bg-card shadow-card overflow-hidden transition-all"
            >
              <button
                type="button"
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full p-4 text-left flex items-center justify-between gap-4 font-semibold text-xs sm:text-sm text-foreground hover:bg-surface-alt/60 transition-colors"
              >
                <span className="flex items-center gap-2.5">
                  <HelpCircle className="h-4 w-4 text-primary shrink-0" />
                  <span>{faq.q}</span>
                </span>
                {isOpen ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                )}
              </button>
              {isOpen && (
                <div className="px-4 pb-4 pt-1 text-xs text-muted-foreground border-t border-border/60 bg-surface-alt/20 leading-relaxed pl-10">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Support Box */}
      <Card>
        <CardHeader>
          <CardTitle>Institutional Support & Helpdesk</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-xs">
          <p className="text-muted-foreground">
            For technical inquiries, bug reports, or presentation questions during hackathon reviews:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="p-3 rounded bg-surface-alt border border-border flex items-center gap-3">
              <Phone className="h-5 w-5 text-primary" />
              <div>
                <span className="font-bold text-foreground block">National Toll Free</span>
                <span className="text-muted-foreground">1800-11-2026 (24x7)</span>
              </div>
            </div>
            <div className="p-3 rounded bg-surface-alt border border-border flex items-center gap-3">
              <Mail className="h-5 w-5 text-primary" />
              <div>
                <span className="font-bold text-foreground block">Email Helpdesk</span>
                <span className="text-muted-foreground">support@aarogyam.gov.in</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
