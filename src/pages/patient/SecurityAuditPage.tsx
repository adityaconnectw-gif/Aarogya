import React, { useState, useMemo } from 'react';
import {
  ShieldAlert,
  Search,
  Filter,
  Lock,
  Eye,
  CheckCircle2,
  AlertTriangle,
  FileText,
  UserCheck,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/common/Table';
import { Badge } from '../../components/common/Badge';
import { SearchBar } from '../../components/common/SearchBar';
import { useApp } from '../../context/AppContext';
import { AuditActionType } from '../../types';

export const SecurityAuditPage: React.FC = () => {
  const { auditLogs } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAction, setSelectedAction] = useState<string>('All');

  const actions: string[] = ['All', 'Viewed', 'Created', 'Updated', 'Shared', 'Revoked', 'Emergency Access'];

  const filteredLogs = useMemo(() => {
    return auditLogs.filter((log) => {
      if (selectedAction !== 'All' && log.action !== selectedAction) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          log.userName.toLowerCase().includes(q) ||
          log.recordType.toLowerCase().includes(q) ||
          log.facility.toLowerCase().includes(q) ||
          log.notes?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [auditLogs, selectedAction, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-surface rounded-md border border-border p-4 sm:p-5 shadow-card space-y-1">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-primary" />
          <h1 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">
            Security & Immutable Audit Trail
          </h1>
        </div>
        <p className="text-xs text-muted-foreground">
          Traceable institutional ledger recording every medical record inspection, consent modification, and emergency break-glass event.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <Card>
        <CardContent className="p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="w-full sm:max-w-xs">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search user, action, hospital..."
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto text-xs">
            <span className="text-muted-foreground font-semibold uppercase text-[11px] mr-1 flex items-center gap-1">
              <Filter className="h-3 w-3" /> Action:
            </span>
            {actions.map((act) => (
              <button
                key={act}
                onClick={() => setSelectedAction(act)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors whitespace-nowrap ${
                  selectedAction === act
                    ? 'bg-primary text-primary-foreground border-primary font-semibold'
                    : 'bg-surface text-muted-foreground border-border hover:bg-surface-alt'
                }`}
              >
                {act}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Audit Log Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>User / Identity</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Record Category</TableHead>
                <TableHead>Facility</TableHead>
                <TableHead>Authorization Status</TableHead>
                <TableHead>Audit Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No audit records matching criteria.
                  </TableCell>
                </TableRow>
              ) : (
                filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-mono text-[11px] text-muted-foreground whitespace-nowrap">
                      {log.timestamp}
                    </TableCell>
                    <TableCell>
                      <div>
                        <span className="font-bold text-foreground block">{log.userName}</span>
                        <span className="text-[10px] text-muted-foreground font-mono">
                          {log.userId} ({log.userRole})
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          log.action === 'Emergency Access'
                            ? 'danger'
                            : log.action === 'Revoked'
                            ? 'warning'
                            : log.action === 'Shared'
                            ? 'primary'
                            : 'auto'
                        }
                        status={log.action}
                        size="sm"
                      />
                    </TableCell>
                    <TableCell className="font-medium text-foreground">{log.recordType}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{log.facility}</TableCell>
                    <TableCell>
                      <Badge
                        variant={log.accessType === 'Break-Glass Emergency' ? 'danger' : 'success'}
                        size="sm"
                      >
                        {log.accessType}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground max-w-xs truncate">
                      {log.notes || 'Routine protocol compliance'}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
