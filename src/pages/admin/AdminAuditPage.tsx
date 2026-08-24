import React, { useState, useMemo } from 'react';
import { ShieldAlert, Search, Filter, Download, Lock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/common/Table';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { SearchBar } from '../../components/common/SearchBar';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../components/common/Toast';

export const AdminAuditPage: React.FC = () => {
  const { auditLogs } = useApp();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterAction, setFilterAction] = useState('All');
  const [filterRole, setFilterRole] = useState('All');

  const actions = ['All', 'Viewed', 'Created', 'Updated', 'Shared', 'Revoked', 'Emergency Access'];
  const roles = ['All', 'Doctor', 'Patient', 'Hospital Admin', 'Emergency Medical Officer'];

  const filtered = useMemo(() => {
    return auditLogs.filter((log) => {
      if (filterAction !== 'All' && log.action !== filterAction) return false;
      if (filterRole !== 'All' && log.userRole !== filterRole) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          log.userName.toLowerCase().includes(q) ||
          log.patientName.toLowerCase().includes(q) ||
          log.recordType.toLowerCase().includes(q) ||
          log.facility.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [auditLogs, filterAction, filterRole, searchQuery]);

  return (
    <div className="space-y-6">
      <div className="bg-surface rounded-md border border-border p-4 sm:p-5 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-primary" />
            <h1 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">
              Hospital Compliance & Security Audit Ledger
            </h1>
          </div>
          <p className="text-xs text-muted-foreground">
            Enterprise immutable security ledger for all electronic health record views, transactions, and break-glass overrides.
          </p>
        </div>

        <Button
          size="sm"
          variant="outline"
          onClick={() => showToast('Exported signed audit log package (CSV/JSON)', 'info')}
          leftIcon={<Download className="h-4 w-4" />}
        >
          Export Compliance Audit
        </Button>
      </div>

      <Card>
        <CardContent className="p-3 sm:p-4 space-y-3">
          <div className="w-full">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search by operator, patient, record category..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="font-semibold text-muted-foreground block mb-1">Action Filter</label>
              <select
                value={filterAction}
                onChange={(e) => setFilterAction(e.target.value)}
                className="w-full h-8 px-3 rounded border border-input bg-surface text-foreground"
              >
                {actions.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-semibold text-muted-foreground block mb-1">Operator Role</label>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="w-full h-8 px-3 rounded border border-input bg-surface text-foreground"
              >
                {roles.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>User / Operator</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Record Type</TableHead>
                <TableHead>Facility</TableHead>
                <TableHead className="text-right">Auth Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-mono text-[11px] text-muted-foreground">{log.timestamp}</TableCell>
                  <TableCell>
                    <span className="font-bold text-foreground block">{log.userName}</span>
                    <span className="text-[10px] text-muted-foreground font-mono">{log.userId} ({log.userRole})</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold text-foreground block">{log.patientName}</span>
                    <span className="text-[10px] font-mono text-muted-foreground">ID: {log.patientId}</span>
                  </TableCell>
                  <TableCell><Badge variant="auto" status={log.action} size="sm" /></TableCell>
                  <TableCell className="text-xs font-medium text-foreground">{log.recordType}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{log.facility}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant={log.accessType === 'Break-Glass Emergency' ? 'danger' : 'success'} size="sm">
                      {log.accessType}
                    </Badge>
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
