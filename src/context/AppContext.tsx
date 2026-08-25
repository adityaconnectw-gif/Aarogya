import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Patient,
  Doctor,
  Hospital,
  Department,
  Appointment,
  Consultation,
  Condition,
  Medication,
  Vaccination,
  LabReport,
  Allergy,
  Prescription,
  HealthTimelineEvent,
  ConsentRecord,
  AccessRequest,
  AuditLog,
  Notification,
  EmergencyProfile,
  HealthDocument,
  FamilyMember,
} from '../types';
import { StorageService } from '../services/storageService';

interface AppContextType {
  // State
  patient: Patient;
  doctors: Doctor[];
  hospitals: Hospital[];
  departments: Department[];
  appointments: Appointment[];
  conditions: Condition[];
  medications: Medication[];
  vaccinations: Vaccination[];
  labReports: LabReport[];
  allergies: Allergy[];
  prescriptions: Prescription[];
  timeline: HealthTimelineEvent[];
  consents: ConsentRecord[];
  accessRequests: AccessRequest[];
  auditLogs: AuditLog[];
  notifications: Notification[];
  emergencyProfile: EmergencyProfile;
  documents: HealthDocument[];
  familyMembers: FamilyMember[];
  darkMode: boolean;

  // Actions
  toggleDarkMode: () => void;
  updatePatient: (updated: Partial<Patient>) => void;
  bookAppointment: (apt: Omit<Appointment, 'id' | 'appointmentId' | 'createdAt'>) => Appointment;
  cancelAppointment: (id: string) => void;
  rescheduleAppointment: (id: string, newDate: string, newTime: string) => void;
  
  // Consent & Sharing
  grantConsent: (
    providerId: string,
    providerName: string,
    facilityName: string,
    records: ConsentRecord['authorizedRecords'],
    duration: ConsentRecord['duration']
  ) => void;
  revokeConsent: (consentId: string) => void;
  approveAccessRequest: (requestId: string) => void;
  denyAccessRequest: (requestId: string) => void;
  doctorRequestAccess: (
    doctorId: string,
    doctorName: string,
    specialty: string,
    facilityName: string,
    records: AccessRequest['requestedRecords'],
    duration: AccessRequest['duration'],
    purpose: string
  ) => void;

  // Core Clinical Workflow (Doctor Case-Taking)
  completeConsultationWorkflow: (
    consultationData: Omit<Consultation, 'id' | 'consultationId'>,
    appointmentIdToComplete?: string
  ) => { consultation: Consultation; prescription: Prescription };

  // Records Management
  addMedication: (med: Omit<Medication, 'id'>) => void;
  addVaccination: (vac: Omit<Vaccination, 'id'>) => void;
  recordVaccinationDose: (vaccineId: string, doseNumber: number, batchNumber?: string) => void;
  addLabReport: (report: Omit<LabReport, 'id'>) => void;
  addAllergy: (allergy: Omit<Allergy, 'id'>) => void;
  addDocument: (doc: Omit<HealthDocument, 'id'>) => void;
  addFamilyMember: (member: Omit<FamilyMember, 'id'>) => void;

  // Emergency Profile & Audit
  updateEmergencyProfile: (profile: Partial<EmergencyProfile>) => void;
  triggerEmergencyAccess: (requesterName: string, facility: string) => void;
  logAudit: (
    userId: string,
    userName: string,
    userRole: AuditLog['userRole'],
    action: AuditLog['action'],
    recordType: AuditLog['recordType'],
    notes?: string
  ) => void;

  // Clinical Intake Integration
  clinicalIntakeSummary: any | null;
  saveClinicalIntakeSummary: (summary: any) => void;

  // Notifications
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  // Reset
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Theme state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('aarogyam_theme') === 'dark';
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('aarogyam_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('aarogyam_theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  // Entities from storage
  const [patient, setPatient] = useState<Patient>(StorageService.getPatient);
  const [doctors, setDoctors] = useState<Doctor[]>(StorageService.getDoctors);
  const [hospitals] = useState<Hospital[]>(StorageService.getHospitals);
  const [departments] = useState<Department[]>(StorageService.getDepartments);
  const [appointments, setAppointments] = useState<Appointment[]>(StorageService.getAppointments);
  const [conditions, setConditions] = useState<Condition[]>(StorageService.getConditions);
  const [medications, setMedications] = useState<Medication[]>(StorageService.getMedications);
  const [vaccinations, setVaccinations] = useState<Vaccination[]>(StorageService.getVaccinations);
  const [labReports, setLabReports] = useState<LabReport[]>(StorageService.getLabReports);
  const [allergies, setAllergies] = useState<Allergy[]>(StorageService.getAllergies);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(StorageService.getPrescriptions);
  const [timeline, setTimeline] = useState<HealthTimelineEvent[]>(StorageService.getTimeline);
  const [consents, setConsents] = useState<ConsentRecord[]>(StorageService.getConsents);
  const [accessRequests, setAccessRequests] = useState<AccessRequest[]>(StorageService.getAccessRequests);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(StorageService.getAuditLogs);
  const [notifications, setNotifications] = useState<Notification[]>(StorageService.getNotifications);
  const [emergencyProfile, setEmergencyProfile] = useState<EmergencyProfile>(StorageService.getEmergencyProfile);
  const [documents, setDocuments] = useState<HealthDocument[]>(StorageService.getDocuments);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(StorageService.getFamilyMembers);
  const [clinicalIntakeSummary, setClinicalIntakeSummary] = useState<any | null>(() => {
    const saved = localStorage.getItem('aarogyam_clinical_intake_summary');
    return saved ? JSON.parse(saved) : null;
  });

  const saveClinicalIntakeSummary = (summary: any) => {
    setClinicalIntakeSummary(summary);
    localStorage.setItem('aarogyam_clinical_intake_summary', JSON.stringify(summary));
  };

  // Helper sync to storage
  const updatePatient = (updated: Partial<Patient>) => {
    const newPat = { ...patient, ...updated };
    setPatient(newPat);
    StorageService.savePatient(newPat);
  };

  const logAudit = (
    userId: string,
    userName: string,
    userRole: AuditLog['userRole'],
    action: AuditLog['action'],
    recordType: AuditLog['recordType'],
    notes?: string
  ) => {
    const now = new Date();
    const newLog: AuditLog = {
      id: `aud-${Date.now()}`,
      timestamp: now.toISOString().replace('T', ' ').substring(0, 19),
      userId,
      userName,
      userRole,
      action,
      recordType,
      patientId: patient.patientId,
      patientName: patient.name,
      facility: userRole === 'Doctor' ? 'City Care Hospital' : 'National Digital Health Portal',
      accessType: action === 'Emergency Access' ? 'Break-Glass Emergency' : action === 'Revoked' ? 'Revocation' : action === 'Shared' ? 'Consent Grant' : 'Authorized',
      ipAddress: '10.128.4.19',
      notes,
    };
    const updated = [newLog, ...auditLogs];
    setAuditLogs(updated);
    StorageService.saveAuditLogs(updated);
  };

  const addNotification = (notif: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const now = new Date();
    const newNotif: Notification = {
      ...notif,
      id: `notif-${Date.now()}`,
      timestamp: now.toISOString().replace('T', ' ').substring(0, 19),
      read: false,
    };
    const updated = [newNotif, ...notifications];
    setNotifications(updated);
    StorageService.saveNotifications(updated);
  };

  const markNotificationRead = (id: string) => {
    const updated = notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
    setNotifications(updated);
    StorageService.saveNotifications(updated);
  };

  const markAllNotificationsRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    setNotifications(updated);
    StorageService.saveNotifications(updated);
  };

  // Appointment Actions
  const bookAppointment = (aptData: Omit<Appointment, 'id' | 'appointmentId' | 'createdAt'>): Appointment => {
    const now = new Date();
    const newApt: Appointment = {
      ...aptData,
      id: `apt-${Date.now()}`,
      appointmentId: `APT-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: now.toISOString(),
      status: 'Confirmed',
    };
    const updated = [newApt, ...appointments];
    setAppointments(updated);
    StorageService.saveAppointments(updated);

    // Add timeline event
    const newEvent: HealthTimelineEvent = {
      id: `tl-${Date.now()}`,
      patientId: patient.patientId,
      date: newApt.date,
      type: 'Appointment',
      title: `Appointment Confirmed: ${newApt.specialty}`,
      subtitle: `With ${newApt.doctorName} at ${newApt.hospitalName} (${newApt.time})`,
      provider: newApt.doctorName,
      facility: newApt.hospitalName,
      category: 'Appointments',
      details: {
        summary: `Appointment for ${newApt.reason}. Status: Confirmed.`,
      },
      badgeColor: 'primary',
    };
    const updatedTl = [newEvent, ...timeline];
    setTimeline(updatedTl);
    StorageService.saveTimeline(updatedTl);

    // Notification
    addNotification({
      patientId: patient.patientId,
      type: 'Appointment',
      title: 'Appointment Booked Successfully',
      message: `Your appointment with ${newApt.doctorName} on ${newApt.date} at ${newApt.time} has been confirmed.`,
      actionUrl: '/patient/appointments',
      priority: 'Normal',
    });

    logAudit('P-10001', patient.name, 'Patient', 'Created', 'Access Permissions', `Booked appointment ${newApt.appointmentId}`);

    return newApt;
  };

  const cancelAppointment = (id: string) => {
    const updated = appointments.map((a) => (a.id === id ? { ...a, status: 'Cancelled' as const } : a));
    setAppointments(updated);
    StorageService.saveAppointments(updated);

    addNotification({
      patientId: patient.patientId,
      type: 'Appointment',
      title: 'Appointment Cancelled',
      message: 'Your scheduled appointment was cancelled.',
      actionUrl: '/patient/appointments',
      priority: 'Normal',
    });
  };

  const rescheduleAppointment = (id: string, newDate: string, newTime: string) => {
    const updated = appointments.map((a) => (a.id === id ? { ...a, date: newDate, time: newTime } : a));
    setAppointments(updated);
    StorageService.saveAppointments(updated);

    addNotification({
      patientId: patient.patientId,
      type: 'Appointment',
      title: 'Appointment Rescheduled',
      message: `Appointment rescheduled to ${newDate} at ${newTime}.`,
      actionUrl: '/patient/appointments',
      priority: 'Normal',
    });
  };

  // Consent & Sharing Actions
  const grantConsent = (
    providerId: string,
    providerName: string,
    facilityName: string,
    records: ConsentRecord['authorizedRecords'],
    duration: ConsentRecord['duration']
  ) => {
    const now = new Date();
    const expiry = new Date();
    if (duration === '24 hours') expiry.setDate(expiry.getDate() + 1);
    else if (duration === '7 days') expiry.setDate(expiry.getDate() + 7);
    else if (duration === '30 days') expiry.setDate(expiry.getDate() + 30);
    else expiry.setFullYear(expiry.getFullYear() + 1);

    const newConsent: ConsentRecord = {
      id: `con-${Date.now()}`,
      patientId: patient.patientId,
      providerId,
      providerName,
      providerRole: 'Doctor',
      facilityName,
      authorizedRecords: records,
      duration,
      grantedAt: now.toISOString(),
      expiresAt: expiry.toISOString(),
      status: 'Active',
      purpose: 'Authorized clinical diagnosis and continuous healthcare record management.',
    };

    const updated = [newConsent, ...consents];
    setConsents(updated);
    StorageService.saveConsents(updated);

    logAudit(
      'P-10001',
      patient.name,
      'Patient',
      'Shared',
      'Access Permissions',
      `Granted ${duration} access to ${providerName} (${facilityName})`
    );

    addNotification({
      patientId: patient.patientId,
      type: 'Security',
      title: 'Consent Granted',
      message: `Access successfully granted to ${providerName} for ${duration}.`,
      actionUrl: '/patient/consent',
      priority: 'High',
    });
  };

  const revokeConsent = (consentId: string) => {
    const target = consents.find((c) => c.id === consentId);
    const updated = consents.map((c) => (c.id === consentId ? { ...c, status: 'Revoked' as const } : c));
    setConsents(updated);
    StorageService.saveConsents(updated);

    if (target) {
      logAudit(
        'P-10001',
        patient.name,
        'Patient',
        'Revoked',
        'Access Permissions',
        `Revoked record access from ${target.providerName}`
      );

      addNotification({
        patientId: patient.patientId,
        type: 'Security',
        title: 'Access Revoked',
        message: `Health record access for ${target.providerName} has been revoked.`,
        actionUrl: '/patient/consent',
        priority: 'High',
      });
    }
  };

  const approveAccessRequest = (requestId: string) => {
    const req = accessRequests.find((r) => r.id === requestId);
    if (!req) return;

    // Mark request approved
    const updatedReqs = accessRequests.map((r) => (r.id === requestId ? { ...r, status: 'Approved' as const } : r));
    setAccessRequests(updatedReqs);
    StorageService.saveAccessRequests(updatedReqs);

    // Grant active consent
    grantConsent(req.doctorId, req.doctorName, req.facilityName, req.requestedRecords, req.duration);
  };

  const denyAccessRequest = (requestId: string) => {
    const req = accessRequests.find((r) => r.id === requestId);
    const updatedReqs = accessRequests.map((r) => (r.id === requestId ? { ...r, status: 'Denied' as const } : r));
    setAccessRequests(updatedReqs);
    StorageService.saveAccessRequests(updatedReqs);

    if (req) {
      logAudit('P-10001', patient.name, 'Patient', 'Revoked', 'Access Permissions', `Denied access request from ${req.doctorName}`);
    }
  };

  const doctorRequestAccess = (
    doctorId: string,
    doctorName: string,
    specialty: string,
    facilityName: string,
    records: AccessRequest['requestedRecords'],
    duration: AccessRequest['duration'],
    purpose: string
  ) => {
    const newReq: AccessRequest = {
      id: `req-${Date.now()}`,
      requestId: `REQ-${Math.floor(1000 + Math.random() * 9000)}`,
      patientId: patient.patientId,
      patientName: patient.name,
      doctorId,
      doctorName,
      doctorSpecialty: specialty,
      facilityName,
      requestedRecords: records,
      duration,
      purpose,
      requestedAt: new Date().toISOString(),
      status: 'Pending',
    };
    const updated = [newReq, ...accessRequests];
    setAccessRequests(updated);
    StorageService.saveAccessRequests(updated);

    addNotification({
      patientId: patient.patientId,
      type: 'Access Request',
      title: `Access Request from ${doctorName}`,
      message: `${doctorName} (${specialty}) has requested ${duration} access for: ${purpose}`,
      actionUrl: '/patient/consent',
      priority: 'High',
    });
  };

  // COMPLETE CLINICAL CASE-TAKING WORKFLOW (SIH CORE DIFFERENTIATOR)
  const completeConsultationWorkflow = (
    consultationData: Omit<Consultation, 'id' | 'consultationId'>,
    appointmentIdToComplete?: string
  ) => {
    const now = new Date();
    const dateStr = now.toISOString().substring(0, 10);
    const conId = `CON-${now.getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const rxId = `RX-${now.getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

    // 1. Create Consultation
    const newConsultation: Consultation = {
      ...consultationData,
      id: `con-${Date.now()}`,
      consultationId: conId,
      prescriptionId: rxId,
      status: 'Completed',
    };

    // 2. Create Prescription
    const followUpDate = new Date();
    followUpDate.setDate(followUpDate.getDate() + (consultationData.treatment.followUpInDays || 7));
    
    const newPrescription: Prescription = {
      id: `rx-${Date.now()}`,
      prescriptionId: rxId,
      patientId: consultationData.patientId,
      patientName: consultationData.patientName,
      patientAge: patient.age,
      patientGender: patient.gender,
      patientBloodGroup: patient.bloodGroup,
      doctorId: consultationData.doctorId,
      doctorName: consultationData.doctorName,
      doctorSpecialty: consultationData.specialty,
      doctorRegNo: 'MCI-2018-88341',
      hospitalName: consultationData.hospitalName,
      hospitalAddress: 'Sector 12, RK Puram, New Delhi - 110022',
      hospitalPhone: '+91 11 2618 9000',
      date: dateStr,
      diagnosis: consultationData.assessment.diagnosis,
      clinicalNotes: consultationData.assessment.clinicalNotes,
      medicines: consultationData.treatment.medicines,
      followUpDays: consultationData.treatment.followUpInDays || 7,
      followUpDate: followUpDate.toISOString().substring(0, 10),
      vitals: {
        bp: consultationData.examination.bloodPressure,
        pulse: consultationData.examination.pulse,
        temp: consultationData.examination.temperature,
        weight: consultationData.examination.weight,
      },
    };

    const updatedPrescriptions = [newPrescription, ...prescriptions];
    setPrescriptions(updatedPrescriptions);
    StorageService.savePrescriptions(updatedPrescriptions);

    // 3. Add Condition to Patient's Active Conditions if not already present
    const existingCond = conditions.find(
      (c) => c.name.toLowerCase() === consultationData.assessment.diagnosis.toLowerCase()
    );
    if (!existingCond) {
      const newCondition: Condition = {
        id: `cond-${Date.now()}`,
        patientId: consultationData.patientId,
        name: consultationData.assessment.diagnosis,
        status: 'Active',
        severity: consultationData.assessment.severity,
        diagnosedDate: dateStr,
        doctorId: consultationData.doctorId,
        doctorName: consultationData.doctorName,
        hospitalName: consultationData.hospitalName,
        treatment: consultationData.treatment.medicines.map((m) => m.medicineName).join(', ') || 'Prescribed regimen',
        notes: consultationData.assessment.clinicalNotes,
      };
      const updatedConditions = [newCondition, ...conditions];
      setConditions(updatedConditions);
      StorageService.saveConditions(updatedConditions);
    }

    // 4. Add Prescribed Medicines to Patient's Active Medications
    const newMeds: Medication[] = consultationData.treatment.medicines.map((m, idx) => {
      const endD = new Date();
      const match = m.duration.match(/\d+/);
      const days = match ? parseInt(match[0], 10) : 5;
      endD.setDate(endD.getDate() + days);

      return {
        id: `med-${Date.now()}-${idx}`,
        patientId: consultationData.patientId,
        name: m.medicineName,
        dosage: m.dosage,
        frequency: m.frequency,
        duration: m.duration,
        startDate: dateStr,
        endDate: endD.toISOString().substring(0, 10),
        doctorId: consultationData.doctorId,
        doctorName: consultationData.doctorName,
        hospitalName: consultationData.hospitalName,
        status: 'Active',
        instructions: m.instructions || 'Take as directed by doctor',
        reason: consultationData.assessment.diagnosis,
        batchNumber: `BAT-${Math.floor(1000 + Math.random() * 9000)}`,
        expiryDate: '2028-06',
        timing: 'Morning - Night',
      };
    });

    if (newMeds.length > 0) {
      const updatedMeds = [...newMeds, ...medications];
      setMedications(updatedMeds);
      StorageService.saveMedications(updatedMeds);
    }

    // 5. Add Timeline Event
    const newTimelineEvent: HealthTimelineEvent = {
      id: `tl-${Date.now()}`,
      patientId: consultationData.patientId,
      date: dateStr,
      type: 'Consultation',
      title: `Consultation: ${consultationData.assessment.diagnosis}`,
      subtitle: `Prescription ${rxId} generated by ${consultationData.doctorName}`,
      provider: consultationData.doctorName,
      facility: consultationData.hospitalName,
      category: 'Consultations',
      details: {
        diagnosis: consultationData.assessment.diagnosis,
        summary: `Chief complaint: ${consultationData.chiefComplaint.complaint} (${consultationData.chiefComplaint.duration}). Vitals: BP ${consultationData.examination.bloodPressure}, Pulse ${consultationData.examination.pulse}, Temp ${consultationData.examination.temperature}.`,
        consultationId: conId,
        prescriptionId: rxId,
      },
      badgeColor: 'info',
    };
    const updatedTimeline = [newTimelineEvent, ...timeline];
    setTimeline(updatedTimeline);
    StorageService.saveTimeline(updatedTimeline);

    // 6. Complete Appointment if linked
    if (appointmentIdToComplete) {
      const updatedApts = appointments.map((a) =>
        a.id === appointmentIdToComplete ? { ...a, status: 'Completed' as const } : a
      );
      setAppointments(updatedApts);
      StorageService.saveAppointments(updatedApts);
    }

    // 7. Audit Log
    logAudit(
      consultationData.doctorId,
      consultationData.doctorName,
      'Doctor',
      'Created',
      'Consultation Notes',
      `Recorded case ${conId} and issued digital prescription ${rxId}`
    );

    // 8. Patient Notification
    addNotification({
      patientId: consultationData.patientId,
      type: 'Medication',
      title: 'New Consultation & Prescription Issued',
      message: `${consultationData.doctorName} recorded your consultation (${consultationData.assessment.diagnosis}) and issued prescription ${rxId}.`,
      actionUrl: '/patient/timeline',
      priority: 'High',
    });

    return { consultation: newConsultation, prescription: newPrescription };
  };

  // Records actions
  const addMedication = (med: Omit<Medication, 'id'>) => {
    const newMed: Medication = { ...med, id: `med-${Date.now()}` };
    const updated = [newMed, ...medications];
    setMedications(updated);
    StorageService.saveMedications(updated);
  };

  const addVaccination = (vac: Omit<Vaccination, 'id'>) => {
    const newVac: Vaccination = { ...vac, id: `vac-${Date.now()}` };
    const updated = [newVac, ...vaccinations];
    setVaccinations(updated);
    StorageService.saveVaccinations(updated);
  };

  const recordVaccinationDose = (vaccineId: string, doseNumber: number, batchNumber?: string) => {
    const now = new Date().toISOString().substring(0, 10);
    const updated = vaccinations.map((v) => {
      if (v.id === vaccineId) {
        const doses = v.doses.map((d) =>
          d.doseNumber === doseNumber
            ? {
                ...d,
                status: 'Completed' as const,
                dateAdministered: now,
                batchNumber: batchNumber || `BAT-${Math.floor(1000 + Math.random() * 9000)}`,
                administeredBy: 'Staff Nurse Sunita',
                hospital: 'City Care Hospital',
              }
            : d
        );
        const allCompleted = doses.every((d) => d.status === 'Completed');
        return {
          ...v,
          doses,
          overallStatus: allCompleted ? ('Completed' as const) : ('Due' as const),
        };
      }
      return v;
    });

    setVaccinations(updated);
    StorageService.saveVaccinations(updated);

    const vaccine = vaccinations.find((v) => v.id === vaccineId);
    if (vaccine) {
      // Add timeline event
      const newEvent: HealthTimelineEvent = {
        id: `tl-${Date.now()}`,
        patientId: patient.patientId,
        date: now,
        type: 'Vaccination',
        title: `Vaccination: ${vaccine.vaccineName} — Dose ${doseNumber}`,
        subtitle: 'Administered at City Care Hospital Immunization Desk',
        provider: 'Staff Nurse Sunita / Dr. Rohan Sharma',
        facility: 'City Care Hospital',
        category: 'Vaccinations',
        details: {
          doseInfo: `Dose ${doseNumber} administered successfully.`,
        },
        badgeColor: 'success',
      };
      const updatedTl = [newEvent, ...timeline];
      setTimeline(updatedTl);
      StorageService.saveTimeline(updatedTl);

      logAudit(
        'DOC-301',
        'Dr. Rohan Sharma / Staff Nurse',
        'Doctor',
        'Updated',
        'Vaccination Records',
        `Recorded Dose ${doseNumber} for ${vaccine.vaccineName}`
      );
    }
  };

  const addLabReport = (report: Omit<LabReport, 'id'>) => {
    const newReport: LabReport = { ...report, id: `lab-${Date.now()}` };
    const updated = [newReport, ...labReports];
    setLabReports(updated);
    StorageService.saveLabReports(updated);

    // Add timeline event
    const newEvent: HealthTimelineEvent = {
      id: `tl-${Date.now()}`,
      patientId: patient.patientId,
      date: report.date,
      type: 'Lab Report',
      title: `Lab Investigation: ${report.testName}`,
      subtitle: `Result: ${report.result} (${report.status})`,
      provider: report.hospitalName,
      facility: report.hospitalName,
      category: 'Labs',
      details: {
        testResult: report.result,
        summary: report.summary,
      },
      badgeColor: 'secondary',
    };
    const updatedTl = [newEvent, ...timeline];
    setTimeline(updatedTl);
    StorageService.saveTimeline(updatedTl);

    logAudit('LAB-102', report.labTechnician || 'Senior MLT', 'Hospital Admin', 'Created', 'Lab Reports', `Uploaded test result for ${report.testName}`);
  };

  const addAllergy = (alg: Omit<Allergy, 'id'>) => {
    const newAlg: Allergy = { ...alg, id: `alg-${Date.now()}` };
    const updated = [newAlg, ...allergies];
    setAllergies(updated);
    StorageService.saveAllergies(updated);
  };

  const addDocument = (doc: Omit<HealthDocument, 'id'>) => {
    const newDoc: HealthDocument = { ...doc, id: `doc-${Date.now()}` };
    const updated = [newDoc, ...documents];
    setDocuments(updated);
    StorageService.saveDocuments(updated);
  };

  const addFamilyMember = (mem: Omit<FamilyMember, 'id'>) => {
    const newMem: FamilyMember = { ...mem, id: `fam-${Date.now()}` };
    const updated = [newMem, ...familyMembers];
    setFamilyMembers(updated);
    StorageService.saveFamilyMembers(updated);
  };

  const updateEmergencyProfile = (data: Partial<EmergencyProfile>) => {
    const updated: EmergencyProfile = {
      ...emergencyProfile,
      ...data,
      lastUpdated: new Date().toISOString().substring(0, 10),
    };
    setEmergencyProfile(updated);
    StorageService.saveEmergencyProfile(updated);
  };

  const triggerEmergencyAccess = (requesterName: string, facility: string) => {
    logAudit(
      'EMO-BREAK-GLASS',
      requesterName,
      'Emergency Medical Officer',
      'Emergency Access',
      'Emergency Profile',
      `Break-glass emergency health record accessed at ${facility}. Verification code validated.`
    );

    addNotification({
      patientId: patient.patientId,
      type: 'Security',
      title: 'Emergency Break-Glass Access Alert',
      message: `Emergency Medical Personnel (${requesterName} at ${facility}) accessed your emergency health card.`,
      actionUrl: '/patient/emergency',
      priority: 'Urgent',
    });
  };

  const resetDemoData = () => {
    StorageService.resetAllData();
  };

  return (
    <AppContext.Provider
      value={{
        patient,
        doctors,
        hospitals,
        departments,
        appointments,
        conditions,
        medications,
        vaccinations,
        labReports,
        allergies,
        prescriptions,
        timeline,
        consents,
        accessRequests,
        auditLogs,
        notifications,
        emergencyProfile,
        documents,
        familyMembers,
        darkMode,
        toggleDarkMode,
        updatePatient,
        bookAppointment,
        cancelAppointment,
        rescheduleAppointment,
        grantConsent,
        revokeConsent,
        approveAccessRequest,
        denyAccessRequest,
        doctorRequestAccess,
        completeConsultationWorkflow,
        addMedication,
        addVaccination,
        recordVaccinationDose,
        addLabReport,
        addAllergy,
        addDocument,
        addFamilyMember,
        updateEmergencyProfile,
        triggerEmergencyAccess,
        logAudit,
        clinicalIntakeSummary,
        saveClinicalIntakeSummary,
        markNotificationRead,
        markAllNotificationsRead,
        resetDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
