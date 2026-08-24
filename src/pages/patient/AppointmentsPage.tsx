import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  Stethoscope,
  Plus,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Eye,
  CalendarCheck,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Tabs } from '../../components/common/Tabs';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { EmptyState } from '../../components/common/EmptyState';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../components/common/Toast';
import { Appointment } from '../../types';
import { formatDate } from '../../utils/formatters';

export const AppointmentsPage: React.FC = () => {
  const { appointments, cancelAppointment, rescheduleAppointment } = useApp();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'Upcoming' | 'Completed' | 'Cancelled'>('Upcoming');
  const [selectedApt, setSelectedApt] = useState<Appointment | null>(null);
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [newDate, setNewDate] = useState('2026-08-28');
  const [newTime, setNewTime] = useState('10:00 AM');

  const upcomingList = appointments.filter((a) => a.status === 'Confirmed' || a.status === 'Pending');
  const completedList = appointments.filter((a) => a.status === 'Completed');
  const cancelledList = appointments.filter((a) => a.status === 'Cancelled');

  const currentList =
    activeTab === 'Upcoming'
      ? upcomingList
      : activeTab === 'Completed'
      ? completedList
      : cancelledList;

  const tabs = [
    { id: 'Upcoming', label: 'Upcoming', count: upcomingList.length },
    { id: 'Completed', label: 'Completed', count: completedList.length },
    { id: 'Cancelled', label: 'Cancelled', count: cancelledList.length },
  ];

  const handleCancel = (id: string) => {
    cancelAppointment(id);
    showToast('Appointment cancelled successfully.', 'info');
  };

  const handleReschedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApt) return;
    rescheduleAppointment(selectedApt.id, newDate, newTime);
    showToast(`Appointment rescheduled to ${formatDate(newDate)} at ${newTime}.`, 'success');
    setIsRescheduleOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-surface rounded-md border border-border p-4 sm:p-5 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            <h1 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">
              Appointments & Consultations
            </h1>
          </div>
          <p className="text-xs text-muted-foreground">
            Manage your hospital bookings, view attending specialist info, reschedule or book new slots.
          </p>
        </div>

        <Link to="/patient/book-appointment">
          <Button size="sm" variant="primary" leftIcon={<Plus className="h-4 w-4" />}>
            Book New Appointment
          </Button>
        </Link>
      </div>

      {/* Tabs */}
      <Card>
        <CardContent className="p-2 sm:p-3">
          <Tabs tabs={tabs} activeTab={activeTab} onChange={(id) => setActiveTab(id as any)} />
        </CardContent>
      </Card>

      {/* Appointments List */}
      {currentList.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title={`No ${activeTab.toLowerCase()} appointments`}
          description={
            activeTab === 'Upcoming'
              ? "You don't have any upcoming doctor appointments scheduled."
              : `No appointments marked as ${activeTab.toLowerCase()}.`
          }
          actionLabel={activeTab === 'Upcoming' ? 'Book Appointment' : undefined}
          onAction={activeTab === 'Upcoming' ? () => {} : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentList.map((apt) => (
            <Card key={apt.id} className="p-4 sm:p-5 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-start justify-between gap-2 border-b border-border/60 pb-3 mb-3">
                  <div>
                    <span className="text-xs font-mono font-bold text-primary block">
                      {apt.appointmentId}
                    </span>
                    <h3 className="text-sm font-bold text-foreground">{apt.doctorName}</h3>
                    <span className="text-xs text-muted-foreground">{apt.specialty}</span>
                  </div>
                  <Badge variant="auto" status={apt.status} size="sm" />
                </div>

                <div className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2 text-foreground font-medium">
                    <CalendarCheck className="h-4 w-4 text-primary shrink-0" />
                    <span>{formatDate(apt.date)} • {apt.time}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span>{apt.hospitalName} ({apt.department})</span>
                  </div>

                  {apt.reason && (
                    <div className="p-2.5 rounded bg-surface-alt/70 border border-border text-[11px] text-foreground mt-2">
                      <span className="font-semibold text-muted-foreground">Reason: </span>
                      {apt.reason}
                    </div>
                  )}
                </div>
              </div>

              {/* Actions footer */}
              {apt.status === 'Confirmed' && (
                <div className="pt-3 border-t border-border flex items-center justify-end gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedApt(apt);
                      setIsRescheduleOpen(true);
                    }}
                  >
                    Reschedule
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-danger hover:bg-danger-muted"
                    onClick={() => handleCancel(apt.id)}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Reschedule Modal */}
      {isRescheduleOpen && selectedApt && (
        <Modal
          isOpen={isRescheduleOpen}
          onClose={() => setIsRescheduleOpen(false)}
          title="Reschedule Appointment"
          description={`With ${selectedApt.doctorName} (${selectedApt.hospitalName})`}
        >
          <form onSubmit={handleReschedule} className="space-y-3 text-xs">
            <div>
              <label className="font-semibold text-foreground block mb-1">New Date</label>
              <input
                type="date"
                required
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full h-8 px-3 rounded border border-input bg-surface text-foreground"
              />
            </div>
            <div>
              <label className="font-semibold text-foreground block mb-1">New Time Slot</label>
              <select
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="w-full h-8 px-3 rounded border border-input bg-surface text-foreground"
              >
                <option value="09:00 AM">09:00 AM</option>
                <option value="10:00 AM">10:00 AM</option>
                <option value="11:30 AM">11:30 AM</option>
                <option value="02:30 PM">02:30 PM</option>
                <option value="04:00 PM">04:00 PM</option>
              </select>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsRescheduleOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm">
                Confirm Reschedule
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
