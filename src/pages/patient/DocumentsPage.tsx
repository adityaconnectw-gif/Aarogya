import React, { useState, useMemo } from 'react';
import {
  FolderLock,
  Search,
  Plus,
  Filter,
  FileText,
  Download,
  Eye,
  Calendar,
  Building2,
  FileCheck2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { SearchBar } from '../../components/common/SearchBar';
import { Modal } from '../../components/common/Modal';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../components/common/Toast';
import { HealthDocument } from '../../types';
import { formatDate } from '../../utils/formatters';

export const DocumentsPage: React.FC = () => {
  const { documents, addDocument, patient } = useApp();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDoc, setSelectedDoc] = useState<HealthDocument | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form state
  const [newDoc, setNewDoc] = useState({
    title: '',
    category: 'Lab Reports' as const,
    date: new Date().toISOString().substring(0, 10),
    hospitalName: 'City Care Hospital',
    doctorName: 'Dr. Rohan Sharma',
    description: '',
  });

  const categories = [
    'All',
    'Lab Reports',
    'Prescriptions',
    'Discharge Summaries',
    'Medical Certificates',
    'Imaging Reports',
  ];

  const filteredDocs = useMemo(() => {
    return documents.filter((doc) => {
      if (selectedCategory !== 'All' && doc.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          doc.title.toLowerCase().includes(q) ||
          doc.hospitalName.toLowerCase().includes(q) ||
          doc.description.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [documents, selectedCategory, searchQuery]);

  const handleAddDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDoc.title) return;

    addDocument({
      patientId: patient.patientId,
      title: newDoc.title,
      category: newDoc.category,
      date: newDoc.date,
      hospitalName: newDoc.hospitalName,
      doctorName: newDoc.doctorName,
      fileSize: '890 KB',
      fileFormat: 'PDF',
      description: newDoc.description || 'Uploaded document record',
    });

    showToast(`Document "${newDoc.title}" stored in health vault.`, 'success');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-surface rounded-md border border-border p-4 sm:p-5 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <FolderLock className="h-5 w-5 text-primary" />
            <h1 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">
              Health Document Vault
            </h1>
          </div>
          <p className="text-xs text-muted-foreground">
            Encrypted repository for medical certificates, discharge summaries, imaging DICOMs, and signed prescriptions.
          </p>
        </div>

        <Button
          size="sm"
          variant="primary"
          onClick={() => setIsAddModalOpen(true)}
          leftIcon={<Plus className="h-4 w-4" />}
        >
          Upload Document
        </Button>
      </div>

      {/* Search & Filter */}
      <Card>
        <CardContent className="p-3 sm:p-4 space-y-3">
          <div className="w-full">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search by file title, category, hospital..."
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <span className="text-muted-foreground font-semibold uppercase text-[11px] mr-1 flex items-center gap-1">
              <Filter className="h-3 w-3" /> Category:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors whitespace-nowrap ${
                  selectedCategory === cat
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

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocs.map((doc) => (
          <Card key={doc.id} className="p-4 sm:p-5 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-start justify-between gap-2 border-b border-border/60 pb-2 mb-2">
                <Badge variant="primary" size="sm">{doc.category}</Badge>
                <span className="text-[10px] font-mono text-muted-foreground font-semibold">
                  {doc.fileFormat} • {doc.fileSize}
                </span>
              </div>

              <h3 className="text-sm font-bold text-foreground leading-snug">{doc.title}</h3>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                {doc.description}
              </p>

              <div className="pt-2 text-[11px] text-muted-foreground space-y-0.5">
                <p><span className="font-medium text-foreground">Date:</span> {formatDate(doc.date)}</p>
                <p><span className="font-medium text-foreground">Facility:</span> {doc.hospitalName}</p>
                {doc.doctorName && <p><span className="font-medium text-foreground">Clinician:</span> {doc.doctorName}</p>}
              </div>
            </div>

            <div className="pt-3 border-t border-border flex items-center justify-between gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setSelectedDoc(doc)}
                leftIcon={<Eye className="h-3.5 w-3.5" />}
                className="flex-1"
              >
                Inspect
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  showToast(`Downloading file "${doc.title}"...`, 'info');
                }}
                leftIcon={<Download className="h-3.5 w-3.5" />}
              >
                Download
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Inspect Document Modal */}
      {selectedDoc && (
        <Modal
          isOpen={!!selectedDoc}
          onClose={() => setSelectedDoc(null)}
          title={selectedDoc.title}
          description={`${selectedDoc.category} • ${selectedDoc.hospitalName}`}
          maxWidth="md"
          footer={
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="primary"
                onClick={() => {
                  showToast('Downloaded authenticated document file.', 'success');
                  setSelectedDoc(null);
                }}
              >
                Download Verified File
              </Button>
            </div>
          }
        >
          <div className="space-y-3 text-xs">
            <div className="p-3 rounded bg-surface-alt border border-border space-y-1">
              <p><span className="text-muted-foreground font-semibold">Category:</span> {selectedDoc.category}</p>
              <p><span className="text-muted-foreground font-semibold">Logged On:</span> {formatDate(selectedDoc.date)}</p>
              <p><span className="text-muted-foreground font-semibold">Facility:</span> {selectedDoc.hospitalName}</p>
              <p><span className="text-muted-foreground font-semibold">Format & Size:</span> {selectedDoc.fileFormat} ({selectedDoc.fileSize})</p>
            </div>

            <div className="p-3 rounded border border-border bg-surface text-muted-foreground leading-relaxed">
              <span className="font-bold text-foreground block mb-1">Document Abstract:</span>
              {selectedDoc.description}
            </div>
          </div>
        </Modal>
      )}

      {/* Add Document Modal */}
      {isAddModalOpen && (
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Upload Health Document"
          description="Add an existing medical file or certificate to your vault"
        >
          <form onSubmit={handleAddDocument} className="space-y-3 text-xs">
            <div>
              <label className="font-semibold text-foreground block mb-1">Document Title *</label>
              <input
                type="text"
                required
                value={newDoc.title}
                onChange={(e) => setNewDoc({ ...newDoc, title: e.target.value })}
                placeholder="e.g. Ultrasound Abdomen Scan, Discharge Summary"
                className="w-full h-8 px-3 rounded border border-input bg-surface text-foreground"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-foreground block mb-1">Category</label>
                <select
                  value={newDoc.category}
                  onChange={(e) => setNewDoc({ ...newDoc, category: e.target.value as any })}
                  className="w-full h-8 px-3 rounded border border-input bg-surface text-foreground"
                >
                  <option value="Lab Reports">Lab Reports</option>
                  <option value="Prescriptions">Prescriptions</option>
                  <option value="Discharge Summaries">Discharge Summaries</option>
                  <option value="Medical Certificates">Medical Certificates</option>
                  <option value="Imaging Reports">Imaging Reports</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="font-semibold text-foreground block mb-1">Date</label>
                <input
                  type="date"
                  value={newDoc.date}
                  onChange={(e) => setNewDoc({ ...newDoc, date: e.target.value })}
                  className="w-full h-8 px-3 rounded border border-input bg-surface text-foreground"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-foreground block mb-1">Issuing Hospital / Clinic</label>
              <input
                type="text"
                value={newDoc.hospitalName}
                onChange={(e) => setNewDoc({ ...newDoc, hospitalName: e.target.value })}
                className="w-full h-8 px-3 rounded border border-input bg-surface text-foreground"
              />
            </div>

            <div>
              <label className="font-semibold text-foreground block mb-1">Summary / Description</label>
              <textarea
                rows={2}
                value={newDoc.description}
                onChange={(e) => setNewDoc({ ...newDoc, description: e.target.value })}
                className="w-full p-2 rounded border border-input bg-surface text-foreground"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsAddModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm">
                Save to Vault
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
