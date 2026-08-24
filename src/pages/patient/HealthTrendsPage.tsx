import React from 'react';
import {
  LineChart as LineChartIcon,
  Activity,
  Heart,
  TrendingUp,
  Scale,
  Info,
  Calendar,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { INITIAL_VITAL_TRENDS } from '../../data/mockData';
import { formatDate } from '../../utils/formatters';

export const HealthTrendsPage: React.FC = () => {
  const data = INITIAL_VITAL_TRENDS.map((pt) => ({
    ...pt,
    formattedDate: formatDate(pt.date),
  }));

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-surface rounded-md border border-border p-4 sm:p-5 shadow-card space-y-1">
        <div className="flex items-center gap-2">
          <LineChartIcon className="h-5 w-5 text-primary" />
          <h1 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">
            Health History & Physiological Trends
          </h1>
        </div>
        <p className="text-xs text-muted-foreground">
          Longitudinal visualization of blood pressure, fasting glucose, body weight, and hemoglobin trends.
        </p>
      </div>

      {/* Institutional Disclaimer Banner */}
      <div className="p-3 rounded-md border border-border bg-surface-alt/70 text-xs text-muted-foreground flex items-center gap-2.5">
        <Info className="h-4 w-4 text-primary shrink-0" />
        <span>
          <strong className="text-foreground">Clinical Notice:</strong> Historical data visualization only. Not medical advice or automated diagnosis. Consult your registered medical practitioner for interpretation.
        </span>
      </div>

      {/* 4 Metric Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <Card className="p-3 sm:p-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Latest BP</span>
            <Heart className="h-4 w-4 text-rose-600" />
          </div>
          <div className="mt-1">
            <span className="text-xl font-bold text-foreground font-mono">118/76</span>
            <span className="text-[11px] text-emerald-600 font-semibold block">Normal physiological</span>
          </div>
        </Card>

        <Card className="p-3 sm:p-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Fasting Glucose</span>
            <Activity className="h-4 w-4 text-sky-600" />
          </div>
          <div className="mt-1">
            <span className="text-xl font-bold text-foreground font-mono">95 mg/dL</span>
            <span className="text-[11px] text-emerald-600 font-semibold block">Euglycemic</span>
          </div>
        </Card>

        <Card className="p-3 sm:p-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Weight</span>
            <Scale className="h-4 w-4 text-amber-600" />
          </div>
          <div className="mt-1">
            <span className="text-xl font-bold text-foreground font-mono">68.0 kg</span>
            <span className="text-[11px] text-muted-foreground block">BMI: 22.4 (Healthy)</span>
          </div>
        </Card>

        <Card className="p-3 sm:p-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Hemoglobin</span>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </div>
          <div className="mt-1">
            <span className="text-xl font-bold text-foreground font-mono">14.8 g/dL</span>
            <span className="text-[11px] text-emerald-600 font-semibold block">Adequate</span>
          </div>
        </Card>
      </div>

      {/* Grid of 2 Recharts Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Blood Pressure Trends */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Blood Pressure Trend (mmHg)</CardTitle>
              <CardDescription>Systolic and Diastolic ambulatory measurements</CardDescription>
            </div>
            <Badge variant="success" size="sm">Optimal</Badge>
          </CardHeader>
          <CardContent className="p-4">
            <div className="h-64 w-full text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
                  <XAxis dataKey="formattedDate" stroke="#64748b" fontSize={11} />
                  <YAxis domain={[60, 140]} stroke="#64748b" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderColor: '#cbd5e1',
                      borderRadius: '6px',
                      fontSize: '12px',
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="systolic"
                    name="Systolic (mmHg)"
                    stroke="#0e625d"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="diastolic"
                    name="Diastolic (mmHg)"
                    stroke="#0284c7"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Chart 2: Fasting Blood Glucose */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Fasting Blood Glucose (mg/dL)</CardTitle>
              <CardDescription>Longitudinal biochemical panel checks</CardDescription>
            </div>
            <Badge variant="primary" size="sm">Euglycemic</Badge>
          </CardHeader>
          <CardContent className="p-4">
            <div className="h-64 w-full text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
                  <XAxis dataKey="formattedDate" stroke="#64748b" fontSize={11} />
                  <YAxis domain={[70, 120]} stroke="#64748b" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderColor: '#cbd5e1',
                      borderRadius: '6px',
                      fontSize: '12px',
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="glucoseFasting"
                    name="Fasting Glucose (mg/dL)"
                    stroke="#16a34a"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Chart 3: Weight Tracking */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Body Weight Trend (kg)</CardTitle>
              <CardDescription>Clinical scale measurements</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="h-64 w-full text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
                  <XAxis dataKey="formattedDate" stroke="#64748b" fontSize={11} />
                  <YAxis domain={[60, 75]} stroke="#64748b" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderColor: '#cbd5e1',
                      borderRadius: '6px',
                      fontSize: '12px',
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="weightKg"
                    name="Weight (kg)"
                    stroke="#d97706"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Chart 4: Hemoglobin Levels */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Hemoglobin Profile (g/dL)</CardTitle>
              <CardDescription>CBC hematological trend</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="h-64 w-full text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
                  <XAxis dataKey="formattedDate" stroke="#64748b" fontSize={11} />
                  <YAxis domain={[12, 17]} stroke="#64748b" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderColor: '#cbd5e1',
                      borderRadius: '6px',
                      fontSize: '12px',
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="hemoglobin"
                    name="Hemoglobin (g/dL)"
                    stroke="#9333ea"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
