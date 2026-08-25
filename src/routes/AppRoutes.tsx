import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import { PublicLayout } from '../components/layout/PublicLayout';
import { DashboardLayout } from '../components/layout/DashboardLayout';

// Public Pages
import { LandingPage } from '../pages/public/LandingPage';
import { LoginPage } from '../pages/public/LoginPage';
import { RegisterPage } from '../pages/public/RegisterPage';
import { ForgotPasswordPage } from '../pages/public/ForgotPasswordPage';
import { HowItWorksPage } from '../pages/public/HowItWorksPage';
import { FeaturesPage } from '../pages/public/FeaturesPage';
import { AboutPage } from '../pages/public/AboutPage';
import { HelpPage } from '../pages/public/HelpPage';

// Patient Pages
import { PatientDashboard } from '../pages/patient/PatientDashboard';
import { ClinicalIntakePage } from '../pages/patient/ClinicalIntakePage';
import { HealthTimelinePage } from '../pages/patient/HealthTimelinePage';
import { MedicalRecordsPage } from '../pages/patient/MedicalRecordsPage';
import { MedicationsPage } from '../pages/patient/MedicationsPage';
import { VaccinationsPage } from '../pages/patient/VaccinationsPage';
import { LabReportsPage } from '../pages/patient/LabReportsPage';
import { HealthTrendsPage } from '../pages/patient/HealthTrendsPage';
import { AppointmentsPage } from '../pages/patient/AppointmentsPage';
import { BookAppointmentPage } from '../pages/patient/BookAppointmentPage';
import { DoctorDirectoryPage } from '../pages/patient/DoctorDirectoryPage';
import { DoctorProfilePage } from '../pages/patient/DoctorProfilePage';
import { ConsentPage } from '../pages/patient/ConsentPage';
import { SecurityAuditPage } from '../pages/patient/SecurityAuditPage';
import { EmergencyCardPage } from '../pages/patient/EmergencyCardPage';
import { DocumentsPage } from '../pages/patient/DocumentsPage';
import { FamilyPage } from '../pages/patient/FamilyPage';
import { SettingsPage } from '../pages/patient/SettingsPage';

// Doctor Pages
import { DoctorDashboard } from '../pages/doctor/DoctorDashboard';
import { DoctorPatientsPage } from '../pages/doctor/DoctorPatientsPage';
import { DoctorPatientDetailPage } from '../pages/doctor/DoctorPatientDetailPage';
import { DigitalCaseTakingPage } from '../pages/doctor/DigitalCaseTakingPage';
import { PrescriptionsPage } from '../pages/doctor/PrescriptionsPage';
import { DoctorAccessRequestsPage } from '../pages/doctor/DoctorAccessRequestsPage';
import { DoctorReportsPage } from '../pages/doctor/DoctorReportsPage';
import { DoctorAuditPage } from '../pages/doctor/DoctorAuditPage';

// Admin Pages
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { AdminPatientsPage } from '../pages/admin/AdminPatientsPage';
import { AdminDoctorsPage } from '../pages/admin/AdminDoctorsPage';
import { AdminDepartmentsPage } from '../pages/admin/AdminDepartmentsPage';
import { AdminAppointmentsPage } from '../pages/admin/AdminAppointmentsPage';
import { AdminAccessRequestsPage } from '../pages/admin/AdminAccessRequestsPage';
import { AdminAuditPage } from '../pages/admin/AdminAuditPage';
import { AdminSettingsPage } from '../pages/admin/AdminSettingsPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Route>

      {/* Standalone Kiosk Terminal Route */}
      <Route path="/kiosk" element={<ClinicalIntakePage />} />

      {/* Patient Portal */}
      <Route path="/patient" element={<DashboardLayout />}>
        <Route index element={<Navigate to="/patient/dashboard" replace />} />
        <Route path="dashboard" element={<PatientDashboard />} />
        <Route path="intake" element={<ClinicalIntakePage />} />
        <Route path="timeline" element={<HealthTimelinePage />} />
        <Route path="records" element={<MedicalRecordsPage />} />
        <Route path="medications" element={<MedicationsPage />} />
        <Route path="vaccinations" element={<VaccinationsPage />} />
        <Route path="labs" element={<LabReportsPage />} />
        <Route path="trends" element={<HealthTrendsPage />} />
        <Route path="appointments" element={<AppointmentsPage />} />
        <Route path="book-appointment" element={<BookAppointmentPage />} />
        <Route path="doctors" element={<DoctorDirectoryPage />} />
        <Route path="doctors/:id" element={<DoctorProfilePage />} />
        <Route path="consent" element={<ConsentPage />} />
        <Route path="security" element={<SecurityAuditPage />} />
        <Route path="emergency" element={<EmergencyCardPage />} />
        <Route path="documents" element={<DocumentsPage />} />
        <Route path="family" element={<FamilyPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      {/* Doctor Portal */}
      <Route path="/doctor" element={<DashboardLayout />}>
        <Route index element={<Navigate to="/doctor/dashboard" replace />} />
        <Route path="dashboard" element={<DoctorDashboard />} />
        <Route path="appointments" element={<DoctorDashboard />} />
        <Route path="patients" element={<DoctorPatientsPage />} />
        <Route path="patients/:id" element={<DoctorPatientDetailPage />} />
        <Route path="case/new" element={<DigitalCaseTakingPage />} />
        <Route path="prescriptions" element={<PrescriptionsPage />} />
        <Route path="access-requests" element={<DoctorAccessRequestsPage />} />
        <Route path="reports" element={<DoctorReportsPage />} />
        <Route path="audit" element={<DoctorAuditPage />} />
        <Route path="profile" element={<DoctorProfilePage />} />
      </Route>

      {/* Hospital Admin Portal */}
      <Route path="/admin" element={<DashboardLayout />}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="patients" element={<AdminPatientsPage />} />
        <Route path="doctors" element={<AdminDoctorsPage />} />
        <Route path="departments" element={<AdminDepartmentsPage />} />
        <Route path="appointments" element={<AdminAppointmentsPage />} />
        <Route path="access-requests" element={<AdminAccessRequestsPage />} />
        <Route path="audit" element={<AdminAuditPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
