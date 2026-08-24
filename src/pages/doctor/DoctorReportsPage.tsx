import React from 'react';
import { FileSpreadsheet, Download, Calendar, CheckCircle2, Stethoscope } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../components/common/Toast';

export const DoctorReportsPage: React.FC = () => {
  const { showToast } = useToast();

  const reports = [
    {
      title: 'Daily Outpatient Department (OPD) Summary',
      date: '24 Aug 2026',
      totalPatients: 8,
      completed: 5,
      pending: 3,
      department: 'General Medicine',
    },
    {
      title: 'Weekly Antibiotic Stewardship & Prescription Log',
      date: '18 Aug 2026 – 24 Aug 2026',
      totalPrescriptions: 34,
      department: 'General Medicine',
    },
    {
      title: 'Monthly Chronic Disease Longitudinal Cohort (Asthma & COPD)',
      date: 'August 2026',
      cohortSize: 28,
      department: 'General Medicine',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-surface rounded-md border border-border p-4 sm:p-5 shadow-card space-y-1">
        <div className="flex items-center gap-2">
          <FileSpreadsheet className="h-5 w-5 text-primary" />
          <h1 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">
            Clinical Summaries & Department Reports
          </h1>
        </div>
        <p className="text-xs text-muted-foreground">
          Aggregated departmental summaries, prescription audits, and patient attendance registers.
        </p>
      </div>

      <div className="space-y-4">
        {reports.map((rep, idx) => (
          <Card key={idx} className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1 text-xs">
              <span className="font-bold text-foreground text-sm block">{rep.title}</span>
              <p className="text-muted-foreground">
                Period: <strong className="text-foreground">{rep.date}</strong> • Department: {rep.department}
              </p>
              <div className="flex items-center gap-2 pt-1">
                {rep.totalPatients && <Badge variant="primary" size="sm">{rep.totalPatients} Total Patients</Badge>}
                {rep.completed && <Badge variant="success" size="sm">{rep.completed} Completed</Badge>}
                {rep.totalPrescriptions && <Badge variant="primary" size="sm">{rep.totalPrescriptions} Prescriptions Logged</Badge>}
              </div>
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={() => showToast(`Exported "${rep.title}" report as CSV/PDF`, 'info')}
              leftIcon={<Download className="h-3.5 w-3.5" />}
            >
              Export Report
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};
