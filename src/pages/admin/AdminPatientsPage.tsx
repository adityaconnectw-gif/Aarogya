import React, { useState, useMemo } from 'react';
import { Users, Search, Plus, Filter, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/common/Table';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { SearchBar } from '../../components/common/SearchBar';
import { useApp } from '../../context/AppContext';

export const AdminPatientsPage: React.FC = () => {
  const { patient, conditions } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const patientList = [
    {
      id: patient.patientId,
      name: patient.name,
      age: patient.age,
      gender: patient.gender,
      bloodGroup: patient.bloodGroup,
      phone: patient.phone,
      lastVisit: '22 Aug 2026',
      conditions: conditions.map(c => c.name).join(', '),
      status: 'Active' as const,
    },
    {
      id: 'P-10002',
      name: 'Rahul Kumar',
      age: 34,
      gender: 'Male',
      bloodGroup: 'O+',
      phone: '+91 98111 00223',
      lastVisit: '10 Aug 2026',
      conditions: 'Hypertension',
      status: 'Active' as const,
    },
    {
      id: 'P-10003',
      name: 'Priya Mukherjee',
      age: 42,
      gender: 'Female',
      bloodGroup: 'A+',
      phone: '+91 98222 11334',
      lastVisit: '15 Jul 2026',
      conditions: 'Type 2 Diabetes, Dyslipidemia',
      status: 'Active' as const,
    },
    {
      id: 'P-10004',
      name: 'Suresh Nair',
      age: 58,
      gender: 'Male',
      bloodGroup: 'B+',
      phone: '+91 98333 22445',
      lastVisit: '01 Jun 2026',
      conditions: 'COPD, Osteoarthritis',
      status: 'Active' as const,
    },
    {
      id: 'P-10005',
      name: 'Anjali Sharma',
      age: 26,
      gender: 'Female',
      bloodGroup: 'AB+',
      phone: '+91 98444 33556',
      lastVisit: '18 May 2026',
      conditions: 'Migraine',
      status: 'Active' as const,
    },
  ];

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return patientList;
    const q = searchQuery.toLowerCase();
    return patientList.filter(
      p => p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q) || p.phone.includes(q)
    );
  }, [searchQuery]);

  return (
    <div className="space-y-6">
      <div className="bg-surface rounded-md border border-border p-4 sm:p-5 shadow-card space-y-1">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          <h1 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">
            Institutional Patient Master Registry
          </h1>
        </div>
        <p className="text-xs text-muted-foreground">
          Central registry of verified citizens holding active patient health identities.
        </p>
      </div>

      <Card>
        <CardContent className="p-3 sm:p-4">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search patient by ID, name, or phone number..."
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient ID</TableHead>
                <TableHead>Citizen Name</TableHead>
                <TableHead>Demographics</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Last Hospital Visit</TableHead>
                <TableHead>Active Conditions</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-mono font-bold text-primary">{p.id}</TableCell>
                  <TableCell className="font-semibold text-foreground">{p.name}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {p.age} Yrs • {p.gender} • <strong className="text-foreground font-mono">{p.bloodGroup}</strong>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{p.phone}</TableCell>
                  <TableCell className="font-mono text-xs">{p.lastVisit}</TableCell>
                  <TableCell className="text-xs max-w-xs truncate">{p.conditions || 'None'}</TableCell>
                  <TableCell><Badge variant="success" size="sm">{p.status}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
