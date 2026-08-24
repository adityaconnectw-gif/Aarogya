import React, { useState, useMemo } from 'react';
import {
  FlaskConical,
  Search,
  Plus,
  Filter,
  Eye,
  Download,
  FileText,
  Building2,
  Calendar,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/common/Table';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { SearchBar } from '../../components/common/SearchBar';
import { Modal } from '../../components/common/Modal';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../components/common/Toast';
import { LabReport } from '../../types';
import { formatDate } from '../../utils/formatters';

export const LabReportsPage: React.FC = () => {
  const { labReports, addLabReport, patient } = useApp();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [selectedReport, setSelectedReport] = useState<LabReport | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Upload form
  const [newReport, setNewReport] = useState({
    testName: '',
    category: 'Biochemistry' as const,
    date: new Date().toISOString().substring(0, 10),
    result: 'Normal',
    referenceRange: 'Normal physiological range',
    unit: 'Standard unit',
    status: 'Reviewed' as const,
    hospitalName: 'City Care Hospital',
    labTechnician: 'Senior MLT Staff',
    summary: 'Clinical indices evaluated and verified.',
  });

  const categories = ['All', 'Hematology', 'Biochemistry', 'Lipid Profile', 'Endocrinology'];

  const filteredReports = useMemo(() => {
    return labReports.filter((r) => {
      if (categoryFilter !== 'All' && r.category !== categoryFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          r.testName.toLowerCase().includes(q) ||
          r.result.toLowerCase().includes(q) ||
          r.hospitalName.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [labReports, categoryFilter, searchQuery]);

  const handleUploadReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReport.testName) return;

    addLabReport({
      patientId: patient.patientId,
      testName: newReport.testName,
      category: newReport.category,
      date: newReport.date,
      result: newReport.result,
      referenceRange: newReport.referenceRange,
      unit: newReport.unit,
      status: newReport.status,
      hospitalName: newReport.hospitalName,
      labTechnician: newReport.labTechnician,
      summary: newReport.summary,
      fileSize: '1.4 MB (PDF)',
    });

    showToast(`Lab report "${newReport.testName}" uploaded and added to Health Timeline.`, 'success');
    setIsUploadModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-surface rounded-md border border-border p-4 sm:p-5 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <FlaskConical className="h-5 w-5 text-primary" />
            <h1 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">
              Diagnostic Investigations & Lab Reports
            </h1>
          </div>
          <p className="text-xs text-muted-foreground">
            Complete digital repository of hematological, biochemical, and imaging laboratory investigations.
          </p>
        </div>

        <Button
          size="sm"
          variant="primary"
          onClick={() => setIsUploadModalOpen(true)}
          leftIcon={<Plus className="h-4 w-4" />}
        >
          Upload New Lab Report
        </Button>
      </div>

      {/* Filter & Search Bar */}
      <Card>
        <CardContent className="p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="w-full sm:max-w-xs">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search by test name, result..."
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto text-xs">
            <span className="text-muted-foreground font-semibold uppercase text-[11px] mr-1 flex items-center gap-1">
              <Filter className="h-3 w-3" /> Panel:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors whitespace-nowrap ${
                  categoryFilter === cat
                    ? 'bg-primary text-primary-foreground border-primary font-semibold'
                    : 'bg-surface text-muted-foreground border-border hover:bg-surface-alt'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Lab Reports Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Test Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Result Value</TableHead>
                <TableHead>Reference Range</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Diagnostic Facility</TableHead>
                <TableHead className="text-right">Report</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReports.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No lab reports matching criteria.
                  </TableCell>
                </TableRow>
              ) : (
                filteredReports.map((lab) => (
                  <TableRow key={lab.id}>
                    <TableCell className="font-semibold text-foreground">
                      <div>
                        <span>{lab.testName}</span>
                        <span className="text-[10px] text-muted-foreground block font-normal">
                          {lab.category}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-[11px]">{formatDate(lab.date)}</TableCell>
                    <TableCell className="font-semibold text-foreground">{lab.result}</TableCell>
                    <TableCell className="text-muted-foreground text-[11px]">{lab.referenceRange}</TableCell>
                    <TableCell>
                      <Badge variant="auto" status={lab.status} size="sm" />
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{lab.hospitalName}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedReport(lab)}
                        leftIcon={<Eye className="h-3 w-3" />}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Report Modal */}
      {selectedReport && (
        <Modal
          isOpen={!!selectedReport}
          onClose={() => setSelectedReport(null)}
          title={`Diagnostic Report: ${selectedReport.testName}`}
          description={`Sample Collected: ${formatDate(selectedReport.date)} • ${selectedReport.hospitalName}`}
          maxWidth="lg"
          footer={
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  showToast(`Downloading signed report PDF for ${selectedReport.testName}...`, 'info');
                }}
                leftIcon={<Download className="h-3.5 w-3.5" />}
              >
                Download PDF
              </Button>
              <Button size="sm" variant="primary" onClick={() => setSelectedReport(null)}>
                Close
              </Button>
            </div>
          }
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 rounded bg-surface-alt border border-border grid grid-cols-2 gap-3">
              <div>
                <span className="text-muted-foreground block text-[11px]">Patient Name / ID</span>
                <span className="font-semibold text-foreground">{patient.name} ({patient.patientId})</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">Testing Lab</span>
                <span className="font-semibold text-foreground">{selectedReport.hospitalName}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">Evaluating Technician / Pathologist</span>
                <span className="font-semibold text-foreground">{selectedReport.labTechnician || 'Senior MLT'}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">Status</span>
                <Badge variant="auto" status={selectedReport.status} size="sm" className="mt-0.5" />
              </div>
            </div>

            <div className="p-4 rounded border border-border bg-surface space-y-2">
              <div className="flex items-center justify-between border-b border-border pb-2">
                <span className="font-bold text-foreground">Quantitative Result</span>
                <span className="font-bold font-mono text-base text-primary">{selectedReport.result}</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                <span>Standard Biological Reference Interval:</span>
                <span className="font-mono text-foreground font-medium">{selectedReport.referenceRange}</span>
              </div>
            </div>

            <div>
              <label className="font-semibold text-foreground block mb-1">Pathological Interpretation & Summary</label>
              <div className="p-3 rounded bg-surface border border-border text-muted-foreground leading-relaxed">
                {selectedReport.summary}
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Upload Mock Modal */}
      {isUploadModalOpen && (
        <Modal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          title="Upload Lab Investigation"
          description="Register a new laboratory test result into your health records"
        >
          <form onSubmit={handleUploadReport} className="space-y-3 text-xs">
            <div>
              <label className="font-semibold text-foreground block mb-1">Test Name *</label>
              <input
                type="text"
                required
                value={newReport.testName}
                onChange={(e) => setNewReport({ ...newReport, testName: e.target.value })}
                placeholder="e.g. Serum Creatinine, HbA1c, Vitamin D"
                className="w-full h-8 px-3 rounded border border-input bg-surface text-foreground"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-foreground block mb-1">Category</label>
                <select
                  value={newReport.category}
                  onChange={(e) => setNewReport({ ...newReport, category: e.target.value as any })}
                  className="w-full h-8 px-3 rounded border border-input bg-surface text-foreground"
                >
                  <option value="Biochemistry">Biochemistry</option>
                  <option value="Hematology">Hematology</option>
                  <option value="Lipid Profile">Lipid Profile</option>
                  <option value="Endocrinology">Endocrinology</option>
                </select>
              </div>
              <div>
                <label className="font-semibold text-foreground block mb-1">Result Value *</label>
                <input
                  type="text"
                  required
                  value={newReport.result}
                  onChange={(e) => setNewReport({ ...newReport, result: e.target.value })}
                  placeholder="e.g. 1.0 mg/dL or Normal"
                  className="w-full h-8 px-3 rounded border border-input bg-surface text-foreground"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-foreground block mb-1">Reference Range</label>
                <input
                  type="text"
                  value={newReport.referenceRange}
                  onChange={(e) => setNewReport({ ...newReport, referenceRange: e.target.value })}
                  placeholder="e.g. 0.7 - 1.3 mg/dL"
                  className="w-full h-8 px-3 rounded border border-input bg-surface text-foreground"
                />
              </div>
              <div>
                <label className="font-semibold text-foreground block mb-1">Date</label>
                <input
                  type="date"
                  value={newReport.date}
                  onChange={(e) => setNewReport({ ...newReport, date: e.target.value })}
                  className="w-full h-8 px-3 rounded border border-input bg-surface text-foreground"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-foreground block mb-1">Diagnostic Summary / Doctor Notes</label>
              <textarea
                rows={2}
                value={newReport.summary}
                onChange={(e) => setNewReport({ ...newReport, summary: e.target.value })}
                className="w-full p-2 rounded border border-input bg-surface text-foreground"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsUploadModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm">
                Save & Link to Timeline
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
