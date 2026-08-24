import React, { useState } from 'react';
import { Stethoscope, Plus, Search, Edit2, Ban, CheckCircle2, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/common/Table';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { SearchBar } from '../../components/common/SearchBar';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../components/common/Toast';
import { Doctor } from '../../types';

export const AdminDoctorsPage: React.FC = () => {
  const { doctors } = useApp();
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [doctorList, setDoctorList] = useState<Doctor[]>(doctors);

  const toggleDoctorStatus = (id: string) => {
    setDoctorList(prev =>
      prev.map(d => {
        if (d.id === id) {
          const newStatus = d.status === 'Active' ? 'On Leave' : 'Active';
          showToast(`Status updated for ${d.name} to ${newStatus}`, 'info');
          return { ...d, status: newStatus as any };
        }
        return d;
      })
    );
  };

  const filtered = doctorList.filter(
    d =>
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.specialty.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="bg-surface rounded-md border border-border p-4 sm:p-5 shadow-card space-y-1">
        <div className="flex items-center gap-2">
          <Stethoscope className="h-5 w-5 text-primary" />
          <h1 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">
            Medical Staff & Doctor Roster Management
          </h1>
        </div>
        <p className="text-xs text-muted-foreground">
          Maintain practitioner registry, assign departmental duties, and oversee clinical availability.
        </p>
      </div>

      <Card>
        <CardContent className="p-3 sm:p-4">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search doctors by name, department, or specialty..."
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Doctor Name</TableHead>
                <TableHead>Department / Specialty</TableHead>
                <TableHead>Experience</TableHead>
                <TableHead>Hospital</TableHead>
                <TableHead>Reg No</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell>
                    <div>
                      <span className="font-bold text-foreground block">{doc.name}</span>
                      <span className="text-[10px] font-mono text-muted-foreground">{doc.qualification}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs">
                    <span className="font-semibold text-foreground block">{doc.department}</span>
                    <span className="text-muted-foreground">{doc.specialty}</span>
                  </TableCell>
                  <TableCell className="text-xs">{doc.experienceYears} Years</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{doc.hospitalName}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{doc.registrationNumber}</TableCell>
                  <TableCell>
                    <Badge variant={doc.status === 'Active' ? 'success' : 'warning'} size="sm">
                      {doc.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => showToast(`Opening edit roster for ${doc.name}`, 'info')}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-danger hover:bg-danger-muted"
                      onClick={() => toggleDoctorStatus(doc.id)}
                    >
                      {doc.status === 'Active' ? 'Set Leave' : 'Set Active'}
                    </Button>
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
