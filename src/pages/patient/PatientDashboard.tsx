import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Pill,
  Syringe,
  FlaskConical,
  Activity,
  Clock,
  ArrowRight,
  AlertTriangle,
  ShieldCheck,
  UserPlus,
  QrCode,
  CheckCircle2,
  FileText,
  Heart,
  ChevronRight,
  Stethoscope,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { useApp } from '../../context/AppContext';
import { formatDate } from '../../utils/formatters';

export const PatientDashboard: React.FC = () => {
  const navigate = useNavigate();
  const {
    patient,
    appointments,
    medications,
    vaccinations,
    labReports,
    conditions,
    timeline,
    allergies,
    consents,
    cancelAppointment,
  } = useApp();

  const upcomingAppointments = appointments.filter((a) => a.status === 'Confirmed');
  const activeMedications = medications.filter((m) => m.status === 'Active');
  const dueVaccinations = vaccinations.filter((v) => v.overallStatus === 'Due');
  const activeConditions = conditions.filter((c) => c.status === 'Active');
  const nextAppointment = upcomingAppointments[0];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-surface rounded-md border border-border p-4 sm:p-5 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">
              Good afternoon, {patient.name}
            </h1>
            <Badge variant="primary" size="sm">
              ID: {patient.patientId}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            Here is your current longitudinal health overview and care schedule.
          </p>
        </div>

        {/* Quick actions top pill */}
        <div className="flex flex-wrap items-center gap-2">
          <Link to="/patient/intake">
            <Button size="sm" variant="primary" leftIcon={<Stethoscope className="h-3.5 w-3.5" />}>
              Start Clinical Intake
            </Button>
          </Link>
          <Link to="/patient/book-appointment">
            <Button size="sm" variant="outline" leftIcon={<UserPlus className="h-3.5 w-3.5" />}>
              Book Appointment
            </Button>
          </Link>
          <Link to="/patient/emergency">
            <Button size="sm" variant="outline" className="border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 hover:bg-rose-50" leftIcon={<AlertTriangle className="h-3.5 w-3.5 text-rose-600" />}>
              Emergency Card
            </Button>
          </Link>
        </div>
      </div>

      {/* Clinical Intake Fast-Track Banner */}
      <div className="p-4 rounded-md border border-primary/30 bg-primary-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-card">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-md bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">
            <Stethoscope className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-foreground">
                Self-Service Clinical Intake & Document Digitization
              </h2>
              <Badge variant="primary" size="sm">
                OPD Fast-Track
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Pre-record your symptoms via voice/tap and digitize prior prescriptions before entering the doctor's consultation room.
            </p>
          </div>
        </div>
        <Link to="/patient/intake" className="shrink-0">
          <Button size="sm" variant="primary" rightIcon={<ArrowRight className="h-3.5 w-3.5" />}>
            Start Intake Now
          </Button>
        </Link>
      </div>

      {/* Row of 5 Institutional Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <Link to="/patient/appointments" className="block">
          <Card hoverable className="p-3 sm:p-4 h-full flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">Upcoming Appointments</span>
              <Calendar className="h-4 w-4 text-primary" />
            </div>
            <div className="mt-2">
              <span className="text-2xl font-bold text-foreground font-mono">
                {upcomingAppointments.length}
              </span>
              <span className="text-[11px] text-muted-foreground block mt-0.5">
                {nextAppointment ? `Next: ${formatDate(nextAppointment.date)}` : 'No upcoming'}
              </span>
            </div>
          </Card>
        </Link>

        <Link to="/patient/medications" className="block">
          <Card hoverable className="p-3 sm:p-4 h-full flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">Active Medications</span>
              <Pill className="h-4 w-4 text-primary" />
            </div>
            <div className="mt-2">
              <span className="text-2xl font-bold text-foreground font-mono">
                {activeMedications.length}
              </span>
              <span className="text-[11px] text-muted-foreground block mt-0.5">
                {activeMedications[0]?.name || 'None active'}
              </span>
            </div>
          </Card>
        </Link>

        <Link to="/patient/vaccinations" className="block">
          <Card hoverable className="p-3 sm:p-4 h-full flex flex-col justify-between border-amber-200 dark:border-amber-900 bg-amber-50/20">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-amber-900 dark:text-amber-200">Vaccinations Due</span>
              <Syringe className="h-4 w-4 text-amber-700 dark:text-amber-400" />
            </div>
            <div className="mt-2">
              <span className="text-2xl font-bold text-amber-900 dark:text-amber-200 font-mono">
                {dueVaccinations.length}
              </span>
              <span className="text-[11px] text-amber-800 dark:text-amber-300 font-medium block mt-0.5">
                Hepatitis B Dose 3 (18d)
              </span>
            </div>
          </Card>
        </Link>

        <Link to="/patient/labs" className="block">
          <Card hoverable className="p-3 sm:p-4 h-full flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">Lab Reports</span>
              <FlaskConical className="h-4 w-4 text-primary" />
            </div>
            <div className="mt-2">
              <span className="text-2xl font-bold text-foreground font-mono">
                {labReports.length}
              </span>
              <span className="text-[11px] text-muted-foreground block mt-0.5">
                Last: CBC (Normal)
              </span>
            </div>
          </Card>
        </Link>

        <Link to="/patient/records" className="block">
          <Card hoverable className="p-3 sm:p-4 h-full flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">Active Conditions</span>
              <Activity className="h-4 w-4 text-primary" />
            </div>
            <div className="mt-2">
              <span className="text-2xl font-bold text-foreground font-mono">
                {activeConditions.length}
              </span>
              <span className="text-[11px] text-muted-foreground block mt-0.5">
                Asthma (Moderate)
              </span>
            </div>
          </Card>
        </Link>
      </div>

      {/* Two-Column Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Recent Health Timeline */}
        <div className="lg:col-span-7 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <CardTitle>Recent Health Timeline</CardTitle>
                </div>
                <Link
                  to="/patient/timeline"
                  className="text-xs font-medium text-primary hover:underline flex items-center gap-1"
                >
                  <span>Full Timeline ({timeline.length})</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 p-4 sm:p-5">
              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
                {timeline.slice(0, 5).map((event) => (
                  <div key={event.id} className="relative group">
                    {/* Bullet marker */}
                    <div className="absolute -left-6 top-0.5 h-3.5 w-3.5 rounded-full border-2 border-surface bg-primary" />
                    
                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-mono font-semibold text-muted-foreground">
                          {formatDate(event.date)}
                        </span>
                        <Badge variant="auto" status={event.type} size="sm" />
                      </div>

                      <h4 className="text-xs sm:text-sm font-semibold text-foreground">
                        {event.title}
                      </h4>
                      {event.subtitle && (
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {event.subtitle}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground pt-1">
                        <span>{event.provider}</span>
                        <span>•</span>
                        <span>{event.facility}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column (5 cols): Next Appointment + Health Alerts + Quick Tools */}
        <div className="lg:col-span-5 space-y-4">
          {/* Next Upcoming Appointment Card */}
          <Card className="border-primary/30">
            <CardHeader className="bg-primary-muted/40">
              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" /> Next Appointment
                </span>
                {nextAppointment && <Badge variant="success" size="sm">Confirmed</Badge>}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {nextAppointment ? (
                <>
                  <div>
                    <div className="text-sm font-bold text-foreground">
                      {formatDate(nextAppointment.date)} at {nextAppointment.time}
                    </div>
                    <div className="text-xs font-semibold text-primary mt-0.5">
                      {nextAppointment.doctorName} ({nextAppointment.specialty})
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {nextAppointment.hospitalName} • {nextAppointment.department}
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground p-2 rounded bg-surface-alt border border-border">
                    <span className="font-medium text-foreground">Reason:</span> {nextAppointment.reason}
                  </p>

                  <div className="flex items-center gap-2 pt-1">
                    <Link to="/patient/appointments" className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        View Details
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-danger hover:bg-danger-muted"
                      onClick={() => cancelAppointment(nextAppointment.id)}
                    >
                      Cancel
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center py-4 space-y-2">
                  <p className="text-xs text-muted-foreground">No upcoming appointments scheduled.</p>
                  <Link to="/patient/book-appointment">
                    <Button variant="primary" size="sm">
                      Book an Appointment
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Important Health Information & Safety Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-rose-600" />
                Critical Health Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5 text-xs">
              {/* Severe Allergy Pill */}
              <div className="p-3 rounded-md border border-rose-200 dark:border-rose-900 bg-rose-50/70 dark:bg-rose-950/30 text-rose-900 dark:text-rose-200 space-y-1">
                <div className="flex items-center justify-between font-semibold">
                  <span className="flex items-center gap-1.5 text-rose-700 dark:text-rose-400 font-bold">
                    <AlertTriangle className="h-3.5 w-3.5" /> Severe Allergy: Penicillin
                  </span>
                  <Badge variant="danger" size="sm">Life Critical</Badge>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Contraindication: Amoxicillin, Ampicillin, Augmentin. Skin rash & angioedema reaction.
                </p>
              </div>

              {/* Vaccine Reminder */}
              <div className="p-3 rounded-md border border-amber-200 dark:border-amber-900 bg-amber-50/70 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200 space-y-1">
                <div className="flex items-center justify-between font-semibold">
                  <span className="flex items-center gap-1.5 text-amber-800 dark:text-amber-300 font-bold">
                    <Syringe className="h-3.5 w-3.5" /> Vaccination Due: Hepatitis B
                  </span>
                  <Badge variant="warning" size="sm">18 Days</Badge>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Hepatitis B Dose 3 is due on 12 Sep 2026. Please schedule at City Care Hospital immunization desk.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Active Consent Summary */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between w-full">
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  Active Provider Consents
                </CardTitle>
                <Link to="/patient/consent" className="text-xs text-primary hover:underline font-medium">
                  Manage ({consents.filter(c => c.status === 'Active').length})
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              {consents.filter(c => c.status === 'Active').slice(0, 2).map((con) => (
                <div key={con.id} className="p-2.5 rounded bg-surface-alt border border-border flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-foreground block">{con.providerName}</span>
                    <span className="text-[11px] text-muted-foreground">{con.facilityName} • {con.duration}</span>
                  </div>
                  <Badge variant="success" size="sm">Authorized</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
