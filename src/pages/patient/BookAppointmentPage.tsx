import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  Stethoscope,
  User,
  Calendar,
  Clock,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Star,
  MapPin,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../components/common/Toast';
import { Hospital, Doctor, Department } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const BookAppointmentPage: React.FC = () => {
  const navigate = useNavigate();
  const { hospitals, departments, doctors, bookAppointment, patient } = useApp();
  const { showToast } = useToast();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(hospitals[0]);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(departments[0]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(doctors[0]);
  const [selectedDate, setSelectedDate] = useState<string>('2026-08-26');
  const [selectedSlot, setSelectedSlot] = useState<string>('10:00 AM');
  const [appointmentReason, setAppointmentReason] = useState<string>('Routine follow-up and consultation');
  const [appointmentType, setAppointmentType] = useState<'Consultation' | 'Follow-up' | 'Routine Checkup'>('Consultation');

  const steps = [
    { num: 1, label: 'Hospital' },
    { num: 2, label: 'Department' },
    { num: 3, label: 'Doctor' },
    { num: 4, label: 'Date & Time' },
    { num: 5, label: 'Confirm' },
  ];

  // Filter doctors by selected department/hospital
  const filteredDoctors = doctors.filter((doc) => {
    if (selectedDepartment && doc.department !== selectedDepartment.name) return false;
    return true;
  });

  const handleCompleteBooking = () => {
    if (!selectedHospital || !selectedDepartment || !selectedDoctor) return;

    bookAppointment({
      patientId: patient.patientId,
      patientName: patient.name,
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      specialty: selectedDoctor.specialty,
      hospitalId: selectedHospital.id,
      hospitalName: selectedHospital.name,
      department: selectedDepartment.name,
      date: selectedDate,
      time: selectedSlot,
      type: appointmentType,
      reason: appointmentReason,
      status: 'Confirmed',
      notes: `Booked via Patient Portal for OPD Room at ${selectedHospital.name}.`,
    });

    showToast(`Appointment booked successfully with ${selectedDoctor.name}!`, 'success');
    navigate('/patient/appointments');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-surface rounded-md border border-border p-4 sm:p-5 shadow-card space-y-1">
        <h1 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">
          Book Doctor Consultation
        </h1>
        <p className="text-xs text-muted-foreground">
          Step-by-step verified booking through the National Health Provider Directory.
        </p>
      </div>

      {/* Step Indicator Bar */}
      <div className="p-3 sm:p-4 rounded-md border border-border bg-surface shadow-xs">
        <div className="flex items-center justify-between overflow-x-auto gap-2">
          {steps.map((s, idx) => {
            const isDone = currentStep > s.num;
            const isCurrent = currentStep === s.num;
            return (
              <div key={s.num} className="flex items-center gap-2 shrink-0">
                <div
                  className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold font-mono transition-colors ${
                    isDone
                      ? 'bg-primary text-primary-foreground'
                      : isCurrent
                      ? 'bg-primary/10 border-2 border-primary text-primary'
                      : 'bg-surface-alt border border-border text-muted-foreground'
                  }`}
                >
                  {isDone ? <CheckCircle2 className="h-4 w-4" /> : s.num}
                </div>
                <span
                  className={`text-xs font-medium ${
                    isCurrent ? 'text-foreground font-semibold' : 'text-muted-foreground'
                  }`}
                >
                  {s.label}
                </span>
                {idx < steps.length - 1 && <span className="text-muted-foreground mx-1">›</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* STEP 1: SELECT HOSPITAL */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-primary" /> Step 1: Select Healthcare Facility
            </CardTitle>
            <CardDescription>Choose from accredited government or network institutions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {hospitals.map((hosp) => {
                const isSelected = selectedHospital?.id === hosp.id;
                return (
                  <div
                    key={hosp.id}
                    onClick={() => setSelectedHospital(hosp)}
                    className={`p-4 rounded-md border transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                      isSelected
                        ? 'border-primary bg-primary-muted/20 ring-1 ring-primary'
                        : 'border-border bg-card hover:bg-surface-alt/60'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <Badge variant="primary" size="sm">{hosp.type}</Badge>
                        <span className="text-[10px] font-mono text-muted-foreground">{hosp.code}</span>
                      </div>
                      <h3 className="text-sm font-bold text-foreground">{hosp.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1 flex items-start gap-1">
                        <MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                        <span>{hosp.address}</span>
                      </p>
                    </div>

                    <div className="pt-2 border-t border-border/60 text-[11px] text-muted-foreground flex justify-between">
                      <span>Beds: {hosp.totalBeds}</span>
                      <span>Doctors: {hosp.activeDoctorsCount}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 flex justify-end">
              <Button
                variant="primary"
                size="sm"
                onClick={() => setCurrentStep(2)}
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                Proceed to Department
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* STEP 2: SELECT DEPARTMENT */}
      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Stethoscope className="h-4 w-4 text-primary" /> Step 2: Select Medical Department
            </CardTitle>
            <CardDescription>Facility: {selectedHospital?.name}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {departments.map((dept) => {
                const isSelected = selectedDepartment?.id === dept.id;
                return (
                  <div
                    key={dept.id}
                    onClick={() => setSelectedDepartment(dept)}
                    className={`p-3.5 rounded-md border transition-all cursor-pointer space-y-1 ${
                      isSelected
                        ? 'border-primary bg-primary-muted/20 ring-1 ring-primary'
                        : 'border-border bg-card hover:bg-surface-alt/60'
                    }`}
                  >
                    <span className="text-xs font-mono text-muted-foreground font-semibold block">{dept.code}</span>
                    <h3 className="text-sm font-bold text-foreground">{dept.name}</h3>
                    <p className="text-[11px] text-muted-foreground">{dept.doctorCount} Doctors available</p>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 flex items-center justify-between">
              <Button variant="outline" size="sm" onClick={() => setCurrentStep(1)} leftIcon={<ArrowLeft className="h-4 w-4" />}>
                Back
              </Button>
              <Button variant="primary" size="sm" onClick={() => setCurrentStep(3)} rightIcon={<ArrowRight className="h-4 w-4" />}>
                Select Doctor
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* STEP 3: SELECT DOCTOR */}
      {currentStep === 3 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-4 w-4 text-primary" /> Step 3: Choose Specialist Doctor
            </CardTitle>
            <CardDescription>
              {selectedDepartment?.name} • {selectedHospital?.name}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(filteredDoctors.length > 0 ? filteredDoctors : doctors.slice(0, 4)).map((doc) => {
                const isSelected = selectedDoctor?.id === doc.id;
                return (
                  <div
                    key={doc.id}
                    onClick={() => setSelectedDoctor(doc)}
                    className={`p-4 rounded-md border transition-all cursor-pointer flex items-start gap-3.5 ${
                      isSelected
                        ? 'border-primary bg-primary-muted/20 ring-1 ring-primary'
                        : 'border-border bg-card hover:bg-surface-alt/60'
                    }`}
                  >
                    <div className="h-10 w-10 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold text-sm shrink-0">
                      {doc.name.replace('Dr. ', '')[0]}
                    </div>
                    <div className="space-y-1 flex-1 text-xs">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-foreground text-sm">{doc.name}</h3>
                        <span className="flex items-center gap-1 text-[11px] font-bold text-amber-600">
                          <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" /> {doc.rating}
                        </span>
                      </div>
                      <p className="text-muted-foreground">{doc.specialty} • {doc.experienceYears} yrs exp</p>
                      <p className="text-[11px] text-muted-foreground font-mono">{doc.qualification}</p>
                      <div className="flex items-center justify-between pt-1 font-semibold text-foreground">
                        <span>Fee: {formatCurrency(doc.consultationFee)}</span>
                        <span className="text-primary text-[11px]">{doc.availability}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 flex items-center justify-between">
              <Button variant="outline" size="sm" onClick={() => setCurrentStep(2)} leftIcon={<ArrowLeft className="h-4 w-4" />}>
                Back
              </Button>
              <Button variant="primary" size="sm" onClick={() => setCurrentStep(4)} rightIcon={<ArrowRight className="h-4 w-4" />}>
                Pick Date & Slot
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* STEP 4: DATE & TIME SLOTS */}
      {currentStep === 4 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" /> Step 4: Appointment Schedule & Reason
            </CardTitle>
            <CardDescription>
              Booking with {selectedDoctor?.name} ({selectedDoctor?.specialty})
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-foreground block mb-1">Select Date</label>
                <input
                  type="date"
                  required
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full h-9 px-3 rounded border border-input bg-surface text-foreground"
                />
              </div>

              <div>
                <label className="font-semibold text-foreground block mb-1">Consultation Type</label>
                <select
                  value={appointmentType}
                  onChange={(e) => setAppointmentType(e.target.value as any)}
                  className="w-full h-9 px-3 rounded border border-input bg-surface text-foreground"
                >
                  <option value="Consultation">New Consultation</option>
                  <option value="Follow-up">Follow-up Review</option>
                  <option value="Routine Checkup">Routine Wellness Check</option>
                </select>
              </div>
            </div>

            {/* Time Slot Picker */}
            <div>
              <label className="font-semibold text-foreground block mb-2">Available Time Slots</label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {(selectedDoctor?.availableSlots || ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:30 PM', '04:30 PM']).map((slot) => {
                  const isSelected = selectedSlot === slot;
                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedSlot(slot)}
                      className={`py-2 px-2 rounded text-xs font-semibold border transition-all ${
                        isSelected
                          ? 'bg-primary text-white border-primary shadow-xs'
                          : 'bg-surface text-foreground border-border hover:bg-surface-alt'
                      }`}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="font-semibold text-foreground block mb-1">Reason for Visit / Symptoms</label>
              <textarea
                rows={2}
                value={appointmentReason}
                onChange={(e) => setAppointmentReason(e.target.value)}
                placeholder="Briefly describe symptoms (e.g. follow-up for fever, chest check)"
                className="w-full p-2.5 rounded border border-input bg-surface text-foreground"
              />
            </div>

            <div className="pt-4 flex items-center justify-between">
              <Button variant="outline" size="sm" onClick={() => setCurrentStep(3)} leftIcon={<ArrowLeft className="h-4 w-4" />}>
                Back
              </Button>
              <Button variant="primary" size="sm" onClick={() => setCurrentStep(5)} rightIcon={<ArrowRight className="h-4 w-4" />}>
                Review & Confirm
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* STEP 5: REVIEW & CONFIRM */}
      {currentStep === 5 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-success" /> Step 5: Final Review & Confirmation
            </CardTitle>
            <CardDescription>Verify your details before confirming slot</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="p-4 rounded-md bg-surface-alt border border-border space-y-3">
              <div className="grid grid-cols-2 gap-3 pb-3 border-b border-border/80">
                <div>
                  <span className="text-muted-foreground block text-[11px]">Patient Name</span>
                  <span className="font-bold text-foreground text-sm">{patient.name} ({patient.patientId})</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">Scheduled Date & Slot</span>
                  <span className="font-bold font-mono text-primary text-sm">
                    {formatDate(selectedDate)} at {selectedSlot}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-muted-foreground block text-[11px]">Doctor & Specialty</span>
                  <span className="font-semibold text-foreground">{selectedDoctor?.name} ({selectedDoctor?.specialty})</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">Facility & Department</span>
                  <span className="font-semibold text-foreground">{selectedHospital?.name} • {selectedDepartment?.name}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">Consultation Fee</span>
                  <span className="font-bold text-foreground">{formatCurrency(selectedDoctor?.consultationFee || 500)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">Visit Reason</span>
                  <span className="text-foreground">{appointmentReason}</span>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-muted-foreground">
              By confirming, this appointment will be registered under your patient record, added to your upcoming health schedule, and appended to your longitudinal health timeline.
            </p>

            <div className="pt-4 flex items-center justify-between border-t border-border">
              <Button variant="outline" size="sm" onClick={() => setCurrentStep(4)} leftIcon={<ArrowLeft className="h-4 w-4" />}>
                Back
              </Button>
              <Button variant="primary" size="md" onClick={handleCompleteBooking} rightIcon={<CheckCircle2 className="h-4 w-4" />}>
                Confirm & Book Appointment
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
