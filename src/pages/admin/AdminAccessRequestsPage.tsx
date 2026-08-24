import React from 'react';
import { ShieldCheck, User, Stethoscope, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/common/Table';
import { Badge } from '../../components/common/Badge';
import { useApp } from '../../context/AppContext';
import { formatDate } from '../../utils/formatters';

export const AdminAccessRequestsPage: React.FC = () => {
  const { accessRequests, consents } = useApp();

  return (
    <div className="space-y-6">
      <div className="bg-surface rounded-md border border-border p-4 sm:p-5 shadow-card space-y-1">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-primary" />
          <h1 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">
            Institutional Consent & Access Request Logs
          </h1>
        </div>
        <p className="text-xs text-muted-foreground">
          Administrative oversight of inter-facility record lookups and patient authorization statuses.
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Request ID</TableHead>
                <TableHead>Practitioner</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Requested Records</TableHead>
                <TableHead>Requested At</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accessRequests.map((req) => (
                <TableRow key={req.id}>
                  <TableCell className="font-mono font-bold text-primary">{req.requestId}</TableCell>
                  <TableCell>
                    <span className="font-semibold text-foreground block">{req.doctorName}</span>
                    <span className="text-[10px] text-muted-foreground">{req.doctorSpecialty}</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold text-foreground block">{req.patientName}</span>
                    <span className="text-[10px] font-mono text-muted-foreground">ID: {req.patientId}</span>
                  </TableCell>
                  <TableCell className="text-xs">
                    <div className="flex flex-wrap gap-1">
                      {req.requestedRecords.diagnoses && <Badge variant="outline" size="sm">Diagnoses</Badge>}
                      {req.requestedRecords.medications && <Badge variant="outline" size="sm">Meds</Badge>}
                      {req.requestedRecords.vaccinations && <Badge variant="outline" size="sm">Vaccines</Badge>}
                      {req.requestedRecords.labReports && <Badge variant="outline" size="sm">Labs</Badge>}
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{formatDate(req.requestedAt)}</TableCell>
                  <TableCell className="text-xs">{req.duration}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant="auto" status={req.status} size="sm" />
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
