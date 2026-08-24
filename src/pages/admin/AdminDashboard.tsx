import React from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Users,
  Stethoscope,
  Calendar,
  ShieldAlert,
  Activity,
  TrendingUp,
  Layers,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { useApp } from '../../context/AppContext';

export const AdminDashboard: React.FC = () => {
  const { departments, doctors } = useApp();

  const deptActivityData = [
    { department: 'Gen Med', appointments: 84, doctors: 32 },
    { department: 'Cardio', appointments: 42, doctors: 18 },
    { department: 'Ortho', appointments: 38, doctors: 15 },
    { department: 'Pediatrics', appointments: 56, doctors: 22 },
    { department: 'Neuro', appointments: 24, doctors: 12 },
    { department: 'Derm', appointments: 35, doctors: 14 },
    { department: 'ENT', appointments: 29, doctors: 10 },
  ];

  const registrationTrendData = [
    { day: '18 Aug', registrations: 120, consults: 310 },
    { day: '19 Aug', registrations: 145, consults: 325 },
    { day: '20 Aug', registrations: 160, consults: 340 },
    { day: '21 Aug', registrations: 138, consults: 315 },
    { day: '22 Aug', registrations: 172, consults: 355 },
    { day: '23 Aug', registrations: 154, consults: 330 },
    { day: '24 Aug', registrations: 180, consults: 342 },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-surface rounded-md border border-border p-4 sm:p-5 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            <h1 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">
              Hospital Institutional Administrator
            </h1>
            <Badge variant="primary" size="sm">City Care Hospital (Apex Node)</Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            Centralized health registry management, doctor clinical rosters, appointment quotas, and compliance auditing.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/admin/audit">
            <Button size="sm" variant="outline" leftIcon={<ShieldAlert className="h-4 w-4" />}>
              Audit Ledger
            </Button>
          </Link>
          <Link to="/admin/doctors">
            <Button size="sm" variant="primary" leftIcon={<Stethoscope className="h-4 w-4" />}>
              Manage Doctors
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Main Admin Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Total Patients Registered</span>
            <Users className="h-4 w-4 text-primary" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-foreground font-mono">12,482</span>
            <span className="text-[11px] text-emerald-600 font-semibold block">+180 today</span>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Medical Doctors</span>
            <Stethoscope className="h-4 w-4 text-primary" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-foreground font-mono">186</span>
            <span className="text-[11px] text-muted-foreground block">Across 8 departments</span>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Appointments Today</span>
            <Calendar className="h-4 w-4 text-primary" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-foreground font-mono">342</span>
            <span className="text-[11px] text-muted-foreground block">248 completed</span>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Pending Access Requests</span>
            <ShieldAlert className="h-4 w-4 text-amber-600" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-amber-600 font-mono">27</span>
            <span className="text-[11px] text-muted-foreground block">Awaiting patient consent</span>
          </div>
        </Card>
      </div>

      {/* Institutional Activity Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Activity Bar Chart */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Today's OPD Appointments by Department</CardTitle>
              <CardDescription>Clinical workload distribution across units</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="h-64 w-full text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deptActivityData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
                  <XAxis dataKey="department" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderColor: '#cbd5e1',
                      borderRadius: '6px',
                      fontSize: '12px',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="appointments" name="Appointments Today" fill="#0e625d" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="doctors" name="Duty Doctors" fill="#0284c7" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* 7-Day Patient Registrations & Consultations Trend */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle>7-Day Health Network Throughput</CardTitle>
              <CardDescription>Daily patient registrations & finalized consultations</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="h-64 w-full text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={registrationTrendData} margin={{ top: 10, right: 15, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
                  <XAxis dataKey="day" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderColor: '#cbd5e1',
                      borderRadius: '6px',
                      fontSize: '12px',
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="consults" name="Completed Consults" stroke="#0e625d" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="registrations" name="New Health IDs" stroke="#16a34a" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Departments Overview Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-foreground">Hospital Department Units</h3>
          <Link to="/admin/departments" className="text-xs text-primary hover:underline font-medium">
            View All 8 Departments →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {departments.slice(0, 4).map((dept) => (
            <Card key={dept.id} className="p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-foreground">{dept.name}</span>
                <Badge variant="primary" size="sm">{dept.code}</Badge>
              </div>
              <p className="text-[11px] text-muted-foreground">Head: {dept.headOfDepartment}</p>
              <div className="pt-2 border-t border-border flex justify-between text-[11px] font-semibold text-foreground">
                <span>{dept.doctorCount} Doctors</span>
                <span className="text-primary">{dept.todayAppointmentsCount} Today</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
