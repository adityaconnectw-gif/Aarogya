import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Stethoscope,
  Search,
  Filter,
  Star,
  Building2,
  Calendar,
  DollarSign,
  ArrowRight,
  MapPin,
  Clock,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { SearchBar } from '../../components/common/SearchBar';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils/formatters';

export const DoctorDirectoryPage: React.FC = () => {
  const { doctors, hospitals } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('All');
  const [hospitalFilter, setHospitalFilter] = useState('All');

  const specialties = ['All', 'General Physician', 'Cardiologist', 'Orthopedic Surgeon', 'Pediatrician', 'Neurologist', 'Dermatologist'];
  const hospitalNames = ['All', ...hospitals.map((h) => h.name)];

  const filteredDoctors = useMemo(() => {
    return doctors.filter((doc) => {
      if (specialtyFilter !== 'All' && doc.specialty !== specialtyFilter) return false;
      if (hospitalFilter !== 'All' && doc.hospitalName !== hospitalFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          doc.name.toLowerCase().includes(q) ||
          doc.specialty.toLowerCase().includes(q) ||
          doc.department.toLowerCase().includes(q) ||
          doc.hospitalName.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [doctors, specialtyFilter, hospitalFilter, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-surface rounded-md border border-border p-4 sm:p-5 shadow-card space-y-1">
        <div className="flex items-center gap-2">
          <Stethoscope className="h-5 w-5 text-primary" />
          <h1 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">
            Certified Practitioners & Doctor Directory
          </h1>
        </div>
        <p className="text-xs text-muted-foreground">
          Explore registered clinical specialists across network institutions.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <Card>
        <CardContent className="p-3 sm:p-4 space-y-3">
          <div className="w-full">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search by doctor name, specialty, department..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="font-semibold text-muted-foreground block mb-1">Specialty</label>
              <select
                value={specialtyFilter}
                onChange={(e) => setSpecialtyFilter(e.target.value)}
                className="w-full h-8 px-3 rounded border border-input bg-surface text-foreground"
              >
                {specialties.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-semibold text-muted-foreground block mb-1">Hospital Network</label>
              <select
                value={hospitalFilter}
                onChange={(e) => setHospitalFilter(e.target.value)}
                className="w-full h-8 px-3 rounded border border-input bg-surface text-foreground"
              >
                {hospitalNames.map((h) => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Doctor Cards Grid (Restrained Institutional Style) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDoctors.map((doc) => (
          <Card key={doc.id} className="p-4 sm:p-5 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-start justify-between gap-2 border-b border-border/60 pb-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold text-sm shrink-0">
                    {doc.name.replace('Dr. ', '')[0]}
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-sm">{doc.name}</h3>
                    <span className="text-xs text-primary font-medium">{doc.specialty}</span>
                  </div>
                </div>
                <span className="flex items-center gap-1 text-xs font-bold text-amber-600">
                  <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                  <span>{doc.rating}</span>
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-muted-foreground">
                <p><span className="font-medium text-foreground">Experience:</span> {doc.experienceYears} years</p>
                <p><span className="font-medium text-foreground">Hospital:</span> {doc.hospitalName}</p>
                <p><span className="font-medium text-foreground">Qualification:</span> {doc.qualification}</p>
                <p><span className="font-medium text-foreground">Consultation Fee:</span> <strong className="text-foreground font-mono">{formatCurrency(doc.consultationFee)}</strong></p>
                <div className="pt-2 flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300 font-semibold text-[11px]">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{doc.availability}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-border flex items-center gap-2">
              <Link to={`/patient/doctors/${doc.id}`} className="flex-1">
                <Button size="sm" variant="outline" className="w-full">
                  View Profile
                </Button>
              </Link>
              <Link to="/patient/book-appointment" className="flex-1">
                <Button size="sm" variant="primary" className="w-full">
                  Book Slot
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
