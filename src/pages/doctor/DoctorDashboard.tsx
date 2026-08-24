import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Stethoscope,
  Calendar,
  Users,
  Clock,
  ShieldCheck,
  Plus,
  ArrowRight,
  AlertTriangle,
  FileSpreadsheet,
  CheckCircle2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/common/Table';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { formatDate } from '../../utils/formatters';

export const DoctorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { appointments, consents, accessRequests, patient } = useApp();
  const { user } = useAuth();

  const todaySchedule = [
    {
      time: '09:00 AM',
      patientName: patient.name,
      patientId: patient.patientId,
      department: 'General Medicine',
      type: 'Follow-up Case',
      status: 'Ready',
      isPrimaryDemo: true,
    },
    {
      time: '09:30 AM',
      patientName: 'Rahul Kumar',
      patientId: 'P-10002',
      department: 'General Medicine',
      type: 'Acute Fever',
      status: 'Waiting',
      isPrimaryDemo: false,
    },
    {
      time: '10:15 AM',
      patientName: 'Priya Mukherjee',
      patientId: 'P-10003',
      department: 'General Medicine',
      type: 'Hypertension Follow-up',
      status: 'Waiting',
      isPrimaryDemo: false,
    },
    {
      time: '11:00 AM',
      patientName: 'Suresh Nair',
      patientId: 'P-10004',
      department: 'General Medicine',
      type: 'Respiratory Review',
      status: 'Scheduled',
      isPrimaryDemo: false,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Doctor Header Banner */}
      <div className="bg-surface rounded-md border border-border p-4 sm:p-5 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">
              Good morning, {user?.name || 'Dr. Rohan Sharma'}
            </h1>
            <Badge variant="primary" size="sm">
              City Care Hospital • OPD Block B
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            Here is your clinical schedule, authorized patient queue, and pending access requests.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/doctor/case/new">
            <Button size="sm" variant="primary" leftIcon={<Stethoscope className="h-4 w-4" />}>
              Start Digital Case-Taking
            </Button>
          </Link>
          <Link to="/doctor/patients">
            <Button size="sm" variant="outline" leftIcon={<Users className="h-4 w-4" />}>
              Search Patient
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Clinical Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Today's Appointments</span>
            <Calendar className="h-4 w-4 text-primary" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-foreground font-mono">8</span>
            <span className="text-[11px] text-muted-foreground block">4 OPD + 4 Consults</span>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Patients Seen</span>
            <CheckCircle2 className="h-4 w-4 text-success" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-success font-mono">5</span>
            <span className="text-[11px] text-muted-foreground block">Cases completed</span>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Pending Cases</span>
            <Clock className="h-4 w-4 text-amber-600" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-amber-600 font-mono">3</span>
            <span className="text-[11px] text-muted-foreground block">In OPD waiting queue</span>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Access Requests</span>
            <ShieldCheck className="h-4 w-4 text-primary" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-foreground font-mono">3</span>
            <span className="text-[11px] text-muted-foreground block">Consent status active</span>
          </div>
        </Card>
      </div>

      {/* Today's Schedule & Patient Queue */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between w-full">
            <div>
              <CardTitle>Today's Clinical Appointment Queue</CardTitle>
              <CardDescription>Click "Open Case" to inspect authorized records or record digital case-taking</CardDescription>
            </div>
            <Badge variant="primary" size="sm">Live OPD</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time Slot</TableHead>
                <TableHead>Patient Name / ID</TableHead>
                <TableHead>Department / Unit</TableHead>
                <TableHead>Visit Type</TableHead>
                <TableHead>Access Status</TableHead>
                <TableHead className="text-right">Clinical Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {todaySchedule.map((item, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-mono font-bold text-foreground">{item.time}</TableCell>
                  <TableCell>
                    <div>
                      <span className="font-bold text-foreground block">{item.patientName}</span>
                      <span className="text-[10px] font-mono text-muted-foreground font-semibold">
                        ID: {item.patientId}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs">{item.department}</TableCell>
                  <TableCell>
                    <span className="text-xs text-muted-foreground">{item.type}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="success" size="sm">
                      Access Granted
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link to={`/doctor/patients/${item.patientId}`}>
                      <Button size="sm" variant={item.isPrimaryDemo ? 'primary' : 'outline'}>
                        Open Case
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Quick Clinical Shortcuts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card hoverable onClick={() => navigate('/doctor/case/new')} className="p-4 space-y-2">
          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
            <Stethoscope className="h-4 w-4" /> 1. Digital Case-Taking
          </div>
          <p className="text-xs text-muted-foreground">
            Launch 6-step standardized digital case taking for Aditya Verma (P-10001).
          </p>
        </Card>

        <Card hoverable onClick={() => navigate('/doctor/prescriptions')} className="p-4 space-y-2">
          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
            <FileSpreadsheet className="h-4 w-4" /> 2. Issued Prescriptions
          </div>
          <p className="text-xs text-muted-foreground">
            View signed digital prescriptions and pharmacy dispense logs.
          </p>
        </Card>

        <Card hoverable onClick={() => navigate('/doctor/access-requests')} className="p-4 space-y-2">
          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
            <ShieldCheck className="h-4 w-4" /> 3. Request Patient Access
          </div>
          <p className="text-xs text-muted-foreground">
            Request time-bound consent from new patients before consultations.
          </p>
        </Card>
      </div>
    </div>
  );
};
