import React, { useState } from 'react';
import { Users, Plus, Heart, Calendar, ShieldCheck, UserCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../components/common/Toast';
import { FamilyMember } from '../../types';
import { formatDate } from '../../utils/formatters';

export const FamilyPage: React.FC = () => {
  const { familyMembers, addFamilyMember, patient } = useApp();
  const { showToast } = useToast();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newMember, setNewMember] = useState({
    name: '',
    relationship: 'Father' as const,
    age: 50,
    bloodGroup: 'B+',
    conditionsCount: 0,
    activeMedicationsCount: 0,
    lastCheckupDate: new Date().toISOString().substring(0, 10),
    healthSummary: 'Routine health checkup normal.',
  });

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMember.name) return;

    addFamilyMember({
      patientId: patient.patientId,
      name: newMember.name,
      relationship: newMember.relationship,
      age: newMember.age,
      bloodGroup: newMember.bloodGroup,
      conditionsCount: newMember.conditionsCount,
      activeMedicationsCount: newMember.activeMedicationsCount,
      lastCheckupDate: newMember.lastCheckupDate,
      healthSummary: newMember.healthSummary,
    });

    showToast(`Family profile for ${newMember.name} added.`, 'success');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-surface rounded-md border border-border p-4 sm:p-5 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <h1 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">
              Family Health Records & Dependents
            </h1>
          </div>
          <p className="text-xs text-muted-foreground">
            Manage linked healthcare timelines for authorized family members and dependents.
          </p>
        </div>

        <Button
          size="sm"
          variant="primary"
          onClick={() => setIsAddModalOpen(true)}
          leftIcon={<Plus className="h-4 w-4" />}
        >
          Add Family Profile
        </Button>
      </div>

      {/* Grid of Family Members */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {familyMembers.map((member) => (
          <Card key={member.id} className="p-4 sm:p-5 space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between border-b border-border pb-2.5 mb-2.5">
                <div>
                  <h3 className="text-sm font-bold text-foreground">{member.name}</h3>
                  <span className="text-xs text-primary font-medium">{member.relationship}</span>
                </div>
                <Badge variant="primary" size="sm">Blood: {member.bloodGroup}</Badge>
              </div>

              <div className="space-y-2 text-xs text-muted-foreground">
                <p><span className="font-medium text-foreground">Age:</span> {member.age} Years</p>
                <p><span className="font-medium text-foreground">Active Conditions:</span> {member.conditionsCount}</p>
                <p><span className="font-medium text-foreground">Medications:</span> {member.activeMedicationsCount} Active</p>
                <p><span className="font-medium text-foreground">Last Checkup:</span> {formatDate(member.lastCheckupDate)}</p>

                <div className="p-2.5 rounded bg-surface-alt/70 border border-border text-[11px] text-foreground mt-2">
                  <span className="font-semibold text-muted-foreground block mb-0.5">Health Summary:</span>
                  {member.healthSummary}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-border flex justify-end">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  showToast(`Switched view to ${member.name}'s authorized health record summary.`, 'info');
                }}
              >
                View Linked Record
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Add Family Member Record"
          description="Link dependent medical history"
        >
          <form onSubmit={handleAddMember} className="space-y-3 text-xs">
            <div>
              <label className="font-semibold text-foreground block mb-1">Full Legal Name *</label>
              <input
                type="text"
                required
                value={newMember.name}
                onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                className="w-full h-8 px-3 rounded border border-input bg-surface text-foreground"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-foreground block mb-1">Relationship</label>
                <select
                  value={newMember.relationship}
                  onChange={(e) => setNewMember({ ...newMember, relationship: e.target.value as any })}
                  className="w-full h-8 px-3 rounded border border-input bg-surface text-foreground"
                >
                  <option value="Father">Father</option>
                  <option value="Mother">Mother</option>
                  <option value="Spouse">Spouse</option>
                  <option value="Child">Child</option>
                  <option value="Sibling">Sibling</option>
                </select>
              </div>
              <div>
                <label className="font-semibold text-foreground block mb-1">Age</label>
                <input
                  type="number"
                  value={newMember.age}
                  onChange={(e) => setNewMember({ ...newMember, age: parseInt(e.target.value, 10) })}
                  className="w-full h-8 px-3 rounded border border-input bg-surface text-foreground"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-foreground block mb-1">Blood Group</label>
                <select
                  value={newMember.bloodGroup}
                  onChange={(e) => setNewMember({ ...newMember, bloodGroup: e.target.value })}
                  className="w-full h-8 px-3 rounded border border-input bg-surface text-foreground"
                >
                  <option value="A+">A+</option>
                  <option value="B+">B+</option>
                  <option value="O+">O+</option>
                  <option value="AB+">AB+</option>
                </select>
              </div>
              <div>
                <label className="font-semibold text-foreground block mb-1">Last Checkup Date</label>
                <input
                  type="date"
                  value={newMember.lastCheckupDate}
                  onChange={(e) => setNewMember({ ...newMember, lastCheckupDate: e.target.value })}
                  className="w-full h-8 px-3 rounded border border-input bg-surface text-foreground"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-foreground block mb-1">Clinical Summary</label>
              <textarea
                rows={2}
                value={newMember.healthSummary}
                onChange={(e) => setNewMember({ ...newMember, healthSummary: e.target.value })}
                className="w-full p-2 rounded border border-input bg-surface text-foreground"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsAddModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm">
                Save Member
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
