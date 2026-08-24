import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Stethoscope,
  Star,
  Award,
  Building2,
  Calendar,
  Phone,
  Mail,
  Globe,
  ArrowLeft,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils/formatters';

export const DoctorProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { doctors } = useApp();

  const doctor = doctors.find((d) => d.id === id) || doctors[0];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back button */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground font-medium"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Directory</span>
        </button>
      </div>

      {/* Doctor Header Profile Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b border-border pb-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 text-primary border-2 border-primary/20 flex items-center justify-center font-bold text-2xl shrink-0">
                {doctor.name.replace('Dr. ', '')[0]}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-foreground">{doctor.name}</h1>
                  <Badge variant="success" size="sm">Verified Specialist</Badge>
                </div>
                <p className="text-xs text-primary font-semibold">{doctor.specialty} • {doctor.department}</p>
                <p className="text-xs text-muted-foreground">{doctor.hospitalName}</p>
              </div>
            </div>

            <div className="text-left sm:text-right space-y-1">
              <div className="text-lg font-bold text-foreground font-mono">
                {formatCurrency(doctor.consultationFee)}
              </div>
              <span className="text-[11px] text-muted-foreground block">OPD Consultation Fee</span>
              <Link to="/patient/book-appointment">
                <Button size="sm" variant="primary" className="mt-2">
                  Book Appointment
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 text-xs text-muted-foreground">
            <div>
              <span className="block font-medium text-foreground">Experience</span>
              <span>{doctor.experienceYears} Years Clinical Practice</span>
            </div>
            <div>
              <span className="block font-medium text-foreground">Rating</span>
              <span className="flex items-center gap-1 text-amber-600 font-bold">
                <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" /> {doctor.rating} ({doctor.reviewCount} reviews)
              </span>
            </div>
            <div>
              <span className="block font-medium text-foreground">Medical Reg No</span>
              <span className="font-mono text-foreground">{doctor.registrationNumber}</span>
            </div>
            <div>
              <span className="block font-medium text-foreground">Languages</span>
              <span>{doctor.languages.join(', ')}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
        {/* Left: Biography & Qualifications (2 cols) */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Professional Biography</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {doctor.bio}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Education & Qualifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="p-3 rounded bg-surface-alt/60 border border-border">
                <span className="font-bold text-foreground block">{doctor.qualification}</span>
                <span className="text-muted-foreground text-[11px]">All India Institute of Medical Sciences & National Board of Examinations</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Hospital Info & Available Slots */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Clinical Availability</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-2.5 rounded bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 text-emerald-800 dark:text-emerald-300 font-semibold flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{doctor.availability}</span>
              </div>

              <div className="space-y-1">
                <span className="font-semibold text-foreground block mb-1">Regular OPD Schedule:</span>
                <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
                  {(doctor.availableSlots || ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM']).map((slot) => (
                    <span key={slot} className="px-2 py-1 rounded bg-surface-alt border border-border">
                      {slot}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
