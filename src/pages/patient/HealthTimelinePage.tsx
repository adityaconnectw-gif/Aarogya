import React, { useState, useMemo } from 'react';
import {
  Clock,
  Filter,
  Search,
  Calendar,
  Stethoscope,
  Pill,
  Syringe,
  FlaskConical,
  Building2,
  FileText,
  AlertTriangle,
  ArrowUpDown,
  Download,
  Eye,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { SearchBar } from '../../components/common/SearchBar';
import { Modal } from '../../components/common/Modal';
import { EmptyState } from '../../components/common/EmptyState';
import { useApp } from '../../context/AppContext';
import { HealthTimelineEvent } from '../../types';
import { formatDate } from '../../utils/formatters';

export const HealthTimelinePage: React.FC = () => {
  const { timeline, patient } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [selectedEvent, setSelectedEvent] = useState<HealthTimelineEvent | null>(null);

  const categories = [
    'All',
    'Consultations',
    'Medicines',
    'Vaccinations',
    'Labs',
    'Visits',
    'Appointments',
  ];

  const filteredEvents = useMemo(() => {
    return timeline
      .filter((ev) => {
        // Category filter
        if (selectedCategory !== 'All' && ev.category !== selectedCategory) {
          return false;
        }
        // Text Search
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = ev.title.toLowerCase().includes(q);
          const matchSub = ev.subtitle?.toLowerCase().includes(q) || false;
          const matchProv = ev.provider.toLowerCase().includes(q);
          const matchFac = ev.facility.toLowerCase().includes(q);
          const matchDiag = ev.details.diagnosis?.toLowerCase().includes(q) || false;
          const matchSumm = ev.details.summary?.toLowerCase().includes(q) || false;
          if (!matchTitle && !matchSub && !matchProv && !matchFac && !matchDiag && !matchSumm) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
      });
  }, [timeline, selectedCategory, searchQuery, sortOrder]);

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'Consultation':
      case 'Diagnosis':
        return <Stethoscope className="h-4 w-4 text-sky-600" />;
      case 'Medication':
      case 'Prescription':
        return <Pill className="h-4 w-4 text-emerald-600" />;
      case 'Vaccination':
        return <Syringe className="h-4 w-4 text-indigo-600" />;
      case 'Lab Report':
        return <FlaskConical className="h-4 w-4 text-purple-600" />;
      case 'Hospital Visit':
        return <Building2 className="h-4 w-4 text-amber-600" />;
      default:
        return <Calendar className="h-4 w-4 text-primary" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header banner */}
      <div className="bg-surface rounded-md border border-border p-4 sm:p-5 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            <h1 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">
              Longitudinal Health Timeline
            </h1>
          </div>
          <p className="text-xs text-muted-foreground">
            A single chronological history of your healthcare journey across hospitals, diagnostic centres, and consultations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSortOrder((s) => (s === 'desc' ? 'asc' : 'desc'))}
            leftIcon={<ArrowUpDown className="h-3.5 w-3.5" />}
          >
            {sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card>
        <CardContent className="p-3 sm:p-4 space-y-3">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="flex-1 w-full">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search diagnoses, medications, doctors, or hospitals in your timeline..."
              />
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <span className="text-muted-foreground font-semibold text-[11px] uppercase mr-1 flex items-center gap-1">
              <Filter className="h-3 w-3" /> Filter:
            </span>
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors whitespace-nowrap ${
                    isActive
                      ? 'bg-primary text-primary-foreground border-primary font-semibold'
                      : 'bg-surface text-muted-foreground border-border hover:bg-surface-alt hover:text-foreground'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Timeline Stream */}
      {filteredEvents.length === 0 ? (
        <EmptyState
          icon={Clock}
          title="No timeline records found"
          description={`No health events match the selected category "${selectedCategory}" or search query "${searchQuery}".`}
          actionLabel="Clear Filters"
          onAction={() => {
            setSelectedCategory('All');
            setSearchQuery('');
          }}
        />
      ) : (
        <div className="relative pl-6 sm:pl-8 space-y-4 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-border">
          {filteredEvents.map((ev) => (
            <div key={ev.id} className="relative group">
              {/* Node bullet marker */}
              <div className="absolute -left-6 sm:-left-8 top-3.5 h-6 w-6 rounded-full border-2 border-surface bg-surface-alt flex items-center justify-center shadow-xs">
                {getEventIcon(ev.type)}
              </div>

              {/* Event Card */}
              <Card hoverable onClick={() => setSelectedEvent(ev)} className="p-4 sm:p-5 transition-all">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 border-b border-border/60 pb-2.5 mb-2.5">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <Badge variant="auto" status={ev.type} size="sm" />
                      <span className="text-xs font-mono font-semibold text-muted-foreground">
                        {formatDate(ev.date)}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-foreground tracking-tight">
                      {ev.title}
                    </h3>
                  </div>

                  <div className="text-left sm:text-right shrink-0">
                    <span className="text-xs font-medium text-foreground block">
                      {ev.provider}
                    </span>
                    <span className="text-[11px] text-muted-foreground block">
                      {ev.facility}
                    </span>
                  </div>
                </div>

                {ev.subtitle && (
                  <p className="text-xs text-foreground/80 leading-relaxed mb-3">
                    {ev.subtitle}
                  </p>
                )}

                {/* Event Snippet info */}
                {ev.details.summary && (
                  <div className="p-2.5 rounded bg-surface-alt/70 border border-border text-xs text-muted-foreground leading-relaxed">
                    <span className="font-semibold text-foreground">Clinical Note: </span>
                    {ev.details.summary}
                  </div>
                )}

                <div className="mt-3 flex items-center justify-between text-[11px] text-primary font-medium">
                  <span>Click to view full medical details & verification →</span>
                  <span className="text-muted-foreground text-[10px]">ID: {ev.id}</span>
                </div>
              </Card>
            </div>
          ))}
        </div>
      )}

      {/* Detailed Event Modal */}
      {selectedEvent && (
        <Modal
          isOpen={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
          title={selectedEvent.title}
          description={`Recorded on ${formatDate(selectedEvent.date)} • ${selectedEvent.facility}`}
          maxWidth="lg"
          footer={
            <Button size="sm" variant="outline" onClick={() => setSelectedEvent(null)}>
              Close Record
            </Button>
          }
        >
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3 p-3 rounded bg-surface-alt border border-border">
              <div>
                <span className="text-muted-foreground block text-[11px]">Event Type</span>
                <Badge variant="auto" status={selectedEvent.type} size="sm" className="mt-0.5" />
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">Date Administered/Logged</span>
                <span className="font-semibold font-mono text-foreground">{selectedEvent.date}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">Attending Clinician</span>
                <span className="font-semibold text-foreground">{selectedEvent.provider}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">Healthcare Facility</span>
                <span className="font-semibold text-foreground">{selectedEvent.facility}</span>
              </div>
            </div>

            {selectedEvent.details.diagnosis && (
              <div>
                <label className="font-semibold text-foreground block mb-1">Confirmed Diagnosis</label>
                <div className="p-2.5 rounded bg-surface border border-border text-foreground font-medium">
                  {selectedEvent.details.diagnosis}
                </div>
              </div>
            )}

            {selectedEvent.details.dosage && (
              <div>
                <label className="font-semibold text-foreground block mb-1">Medication Regimen</label>
                <div className="p-2.5 rounded bg-surface border border-border text-foreground space-y-1">
                  <p><span className="text-muted-foreground">Dosage:</span> {selectedEvent.details.dosage}</p>
                  <p><span className="text-muted-foreground">Frequency:</span> {selectedEvent.details.frequency}</p>
                </div>
              </div>
            )}

            {selectedEvent.details.summary && (
              <div>
                <label className="font-semibold text-foreground block mb-1">Clinical Findings & Assessment</label>
                <div className="p-3 rounded bg-surface border border-border text-muted-foreground leading-relaxed">
                  {selectedEvent.details.summary}
                </div>
              </div>
            )}

            {selectedEvent.details.consultationId && (
              <div className="p-2 rounded bg-primary-muted/30 border border-primary/20 text-primary text-[11px] flex items-center justify-between">
                <span>Associated Case: {selectedEvent.details.consultationId}</span>
                {selectedEvent.details.prescriptionId && (
                  <span>Rx ID: {selectedEvent.details.prescriptionId}</span>
                )}
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};
