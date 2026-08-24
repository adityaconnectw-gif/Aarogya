import React from 'react';
import { Building2, Users, Calendar, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { useApp } from '../../context/AppContext';

export const AdminDepartmentsPage: React.FC = () => {
  const { departments } = useApp();

  return (
    <div className="space-y-6">
      <div className="bg-surface rounded-md border border-border p-4 sm:p-5 shadow-card space-y-1">
        <div className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-primary" />
          <h1 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">
            Hospital Clinical Departments
          </h1>
        </div>
        <p className="text-xs text-muted-foreground">
          Departmental capacity, staff allocation, and daily OPD appointments load.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {departments.map((dept) => (
          <Card key={dept.id} className="p-4 sm:p-5 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-start justify-between border-b border-border pb-2.5 mb-2.5">
                <div>
                  <h3 className="text-sm font-bold text-foreground">{dept.name}</h3>
                  <span className="text-xs text-muted-foreground">Head: {dept.headOfDepartment}</span>
                </div>
                <Badge variant="primary" size="sm">{dept.code}</Badge>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                {dept.description}
              </p>

              <div className="grid grid-cols-2 gap-2 text-xs p-2.5 rounded bg-surface-alt border border-border">
                <div>
                  <span className="text-muted-foreground block text-[11px]">Doctors Assigned</span>
                  <span className="font-bold text-foreground font-mono">{dept.doctorCount} Doctors</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">Appointments Today</span>
                  <span className="font-bold text-primary font-mono">{dept.todayAppointmentsCount} Scheduled</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-border flex justify-end">
              <Button size="sm" variant="outline">
                Manage Department Rosters
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
