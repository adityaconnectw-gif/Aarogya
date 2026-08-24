import React from 'react';
import { ShieldAlert, User, Clock, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/common/Table';
import { Badge } from '../../components/common/Badge';
import { useApp } from '../../context/AppContext';

export const DoctorAuditPage: React.FC = () => {
  const { auditLogs } = useApp();

  return (
    <div className="space-y-6">
      <div className="bg-surface rounded-md border border-border p-4 sm:p-5 shadow-card space-y-1">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-primary" />
          <h1 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">
            Practitioner Activity Audit Trail
          </h1>
        </div>
        <p className="text-xs text-muted-foreground">
          Traceable institutional log recording clinical consultations, prescriptions issued, and record inspections performed under your practitioner ID (DOC-301).
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Patient Name / ID</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Record Category</TableHead>
                <TableHead>Authorization</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {auditLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-mono text-[11px] text-muted-foreground">{log.timestamp}</TableCell>
                  <TableCell>
                    <span className="font-semibold text-foreground block">{log.patientName}</span>
                    <span className="text-[10px] text-muted-foreground font-mono">ID: {log.patientId}</span>
                  </TableCell>
                  <TableCell><Badge variant="auto" status={log.action} size="sm" /></TableCell>
                  <TableCell className="font-medium text-foreground">{log.recordType}</TableCell>
                  <TableCell><Badge variant="success" size="sm">{log.accessType}</Badge></TableCell>
                  <TableCell className="text-xs text-muted-foreground">{log.notes || 'Routine consult'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
