import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Search,
  CheckCircle2,
  Lock,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Activity,
  AlertTriangle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { SearchBar } from '../../components/common/SearchBar';
import { useApp } from '../../context/AppContext';
import { formatDate } from '../../utils/formatters';

export const DoctorPatientsPage: React.FC = () => {
  const { patient, conditions, timeline, consents } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const patientList = [
    {
      id: patient.patientId,
      name: patient.name,
      age: patient.age,
      gender: patient.gender,
      phone: patient.phone,
      bloodGroup: patient.bloodGroup,
      lastVisit: '22 Aug 2026',
      activeConditionsCount: conditions.filter(c => c.status === 'Active').length,
      accessStatus: 'Granted' as const,
      accessExpires: '24 Aug 2026, 10:31 PM',
      allergies: 'Penicillin (Severe)',
    },
    {
      id: 'P-10002',
      name: 'Rahul Kumar',
      age: 34,
      gender: 'Male',
      phone: '+91 98111 00223',
      bloodGroup: 'O+',
      lastVisit: '10 Aug 2026',
      activeConditionsCount: 1,
      accessStatus: 'Granted' as const,
      accessExpires: '25 Aug 2026',
      allergies: 'None recorded',
    },
    {
      id: 'P-10003',
      name: 'Priya Mukherjee',
      age: 42,
      gender: 'Female',
      phone: '+91 98222 11334',
      bloodGroup: 'A+',
      lastVisit: '15 Jul 2026',
      activeConditionsCount: 2,
      accessStatus: 'Granted' as const,
      accessExpires: '28 Aug 2026',
      allergies: 'Sulfa Drugs',
    },
    {
      id: 'P-10004',
      name: 'Suresh Nair',
      age: 58,
      gender: 'Male',
      phone: '+91 98333 22445',
      bloodGroup: 'B+',
      lastVisit: '01 Jun 2026',
      activeConditionsCount: 3,
      accessStatus: 'Requires Consent' as const,
      accessExpires: 'Expired',
      allergies: 'Aspirin',
    },
  ];

  const filteredPatients = useMemo(() => {
    if (!searchQuery.trim()) return patientList;
    const q = searchQuery.toLowerCase();
    return patientList.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.phone.includes(q)
    );
  }, [searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-surface rounded-md border border-border p-4 sm:p-5 shadow-card space-y-1">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          <h1 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">
            Patient Registry & Look-up
          </h1>
        </div>
        <p className="text-xs text-muted-foreground">
          Search patient records by Patient ID (e.g. P-10001), full name, or registered mobile number.
        </p>
      </div>

      {/* Search Input */}
      <Card>
        <CardContent className="p-3 sm:p-4">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by Patient ID (P-10001), Name (Aditya Verma), or Phone..."
          />
        </CardContent>
      </Card>

      {/* Patients Result Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPatients.map((p) => (
          <Card key={p.id} className="p-4 sm:p-5 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-start justify-between border-b border-border/60 pb-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold text-sm">
                    {p.name[0]}
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-sm">{p.name}</h3>
                    <span className="text-xs font-mono text-primary font-semibold">ID: {p.id}</span>
                  </div>
                </div>

                <Badge
                  variant={p.accessStatus === 'Granted' ? 'success' : 'warning'}
                  size="sm"
                >
                  {p.accessStatus === 'Granted' ? 'Access: Granted' : 'Requires Consent'}
                </Badge>
              </div>

              <div className="space-y-1.5 text-xs text-muted-foreground">
                <p><span className="font-medium text-foreground">Demographics:</span> {p.age} Yrs • {p.gender} • Blood Group: <strong className="text-foreground">{p.bloodGroup}</strong></p>
                <p><span className="font-medium text-foreground">Last Recorded Visit:</span> {p.lastVisit}</p>
                <p><span className="font-medium text-foreground">Active Conditions:</span> {p.activeConditionsCount}</p>
                <p><span className="font-medium text-foreground">Known Allergies:</span> <strong className="text-rose-700 dark:text-rose-400">{p.allergies}</strong></p>
                {p.accessStatus === 'Granted' && (
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-300 font-semibold pt-1">
                    ✓ Valid access authorized until: {p.accessExpires}
                  </p>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-border flex justify-end">
              <Link to={`/doctor/patients/${p.id}`}>
                <Button
                  size="sm"
                  variant={p.id === 'P-10001' ? 'primary' : 'outline'}
                  rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
                >
                  Open Patient Profile
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
