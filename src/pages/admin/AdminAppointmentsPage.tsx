import React, { useState } from 'react';
import { Calendar, Search, Filter, Clock, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/common/Table';
import { Badge } from '../../components/common/Badge';
import { SearchBar } from '../../components/common/SearchBar';
import { useApp } from '../../context/AppContext';
import { formatDate } from '../../utils/formatters';

export const AdminAppointmentsPage: React.FC = () => {
  const { appointments } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = appointments.filter(
    (a) =>
      a.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="bg-surface rounded-md border border-border p-4 sm:p-5 shadow-card space-y-1">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          <h1 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">
            Hospital-Wide Appointment Central Schedule
          </h1>
        </div>
        <p className="text-xs text-muted-foreground">
          Master log of outpatient queues, confirmed bookings, and finished encounters.
        </p>
      </div>

      <Card>
        <CardContent className="p-3 sm:p-4">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by patient, doctor, department..."
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Appointment ID</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Attending Doctor</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((apt) => (
                <TableRow key={apt.id}>
                  <TableCell className="font-mono font-bold text-primary">{apt.appointmentId}</TableCell>
                  <TableCell className="font-mono text-xs">
                    {formatDate(apt.date)} ({apt.time})
                  </TableCell>
                  <TableCell>
                    <div>
                      <span className="font-bold text-foreground block">{apt.patientName}</span>
                      <span className="text-[10px] font-mono text-muted-foreground">ID: {apt.patientId}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs">{apt.doctorName}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{apt.department}</TableCell>
                  <TableCell className="text-xs">{apt.type}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant="auto" status={apt.status} size="sm" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
