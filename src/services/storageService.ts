import {
  Patient,
  Doctor,
  Hospital,
  Department,
  Appointment,
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

import {
  INITIAL_PATIENT,
  INITIAL_DOCTORS,
  INITIAL_HOSPITALS,
  INITIAL_DEPARTMENTS,
  INITIAL_APPOINTMENTS,
  INITIAL_CONDITIONS,
  INITIAL_MEDICATIONS,
  INITIAL_VACCINATIONS,
  INITIAL_LAB_REPORTS,
  INITIAL_ALLERGIES,
  INITIAL_PRESCRIPTIONS,
  INITIAL_TIMELINE,
  INITIAL_CONSENTS,
  INITIAL_ACCESS_REQUESTS,
  INITIAL_AUDIT_LOGS,
  INITIAL_NOTIFICATIONS,
  INITIAL_EMERGENCY_PROFILE,
  INITIAL_DOCUMENTS,
  INITIAL_FAMILY_MEMBERS,
} from '../data/mockData';

const STORAGE_KEYS = {
  PATIENT: 'aarogyam_patient',
  DOCTORS: 'aarogyam_doctors',
  HOSPITALS: 'aarogyam_hospitals',
  DEPARTMENTS: 'aarogyam_departments',
  APPOINTMENTS: 'aarogyam_appointments',
  CONDITIONS: 'aarogyam_conditions',
  MEDICATIONS: 'aarogyam_medications',
  VACCINATIONS: 'aarogyam_vaccinations',
  LAB_REPORTS: 'aarogyam_lab_reports',
  ALLERGIES: 'aarogyam_allergies',
  PRESCRIPTIONS: 'aarogyam_prescriptions',
  TIMELINE: 'aarogyam_timeline',
  CONSENTS: 'aarogyam_consents',
  ACCESS_REQUESTS: 'aarogyam_access_requests',
  AUDIT_LOGS: 'aarogyam_audit_logs',
  NOTIFICATIONS: 'aarogyam_notifications',
  EMERGENCY_PROFILE: 'aarogyam_emergency_profile',
  DOCUMENTS: 'aarogyam_documents',
  FAMILY_MEMBERS: 'aarogyam_family_members',
  THEME: 'aarogyam_theme',
  AUTH_USER: 'aarogyam_auth_user',
};

function getItem<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(item);
  } catch (error) {
    console.error(`Error reading key ${key} from storage:`, error);
    return fallback;
  }
}

function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving key ${key} to storage:`, error);
  }
}

export const StorageService = {
  getPatient: (): Patient => getItem(STORAGE_KEYS.PATIENT, INITIAL_PATIENT),
  savePatient: (data: Patient) => setItem(STORAGE_KEYS.PATIENT, data),

  getDoctors: (): Doctor[] => getItem(STORAGE_KEYS.DOCTORS, INITIAL_DOCTORS),
  saveDoctors: (data: Doctor[]) => setItem(STORAGE_KEYS.DOCTORS, data),

  getHospitals: (): Hospital[] => getItem(STORAGE_KEYS.HOSPITALS, INITIAL_HOSPITALS),
  getDepartments: (): Department[] => getItem(STORAGE_KEYS.DEPARTMENTS, INITIAL_DEPARTMENTS),

  getAppointments: (): Appointment[] => getItem(STORAGE_KEYS.APPOINTMENTS, INITIAL_APPOINTMENTS),
  saveAppointments: (data: Appointment[]) => setItem(STORAGE_KEYS.APPOINTMENTS, data),

  getConditions: (): Condition[] => getItem(STORAGE_KEYS.CONDITIONS, INITIAL_CONDITIONS),
  saveConditions: (data: Condition[]) => setItem(STORAGE_KEYS.CONDITIONS, data),

  getMedications: (): Medication[] => getItem(STORAGE_KEYS.MEDICATIONS, INITIAL_MEDICATIONS),
  saveMedications: (data: Medication[]) => setItem(STORAGE_KEYS.MEDICATIONS, data),

  getVaccinations: (): Vaccination[] => getItem(STORAGE_KEYS.VACCINATIONS, INITIAL_VACCINATIONS),
  saveVaccinations: (data: Vaccination[]) => setItem(STORAGE_KEYS.VACCINATIONS, data),

  getLabReports: (): LabReport[] => getItem(STORAGE_KEYS.LAB_REPORTS, INITIAL_LAB_REPORTS),
  saveLabReports: (data: LabReport[]) => setItem(STORAGE_KEYS.LAB_REPORTS, data),

  getAllergies: (): Allergy[] => getItem(STORAGE_KEYS.ALLERGIES, INITIAL_ALLERGIES),
  saveAllergies: (data: Allergy[]) => setItem(STORAGE_KEYS.ALLERGIES, data),

  getPrescriptions: (): Prescription[] => getItem(STORAGE_KEYS.PRESCRIPTIONS, INITIAL_PRESCRIPTIONS),
  savePrescriptions: (data: Prescription[]) => setItem(STORAGE_KEYS.PRESCRIPTIONS, data),

  getTimeline: (): HealthTimelineEvent[] => getItem(STORAGE_KEYS.TIMELINE, INITIAL_TIMELINE),
  saveTimeline: (data: HealthTimelineEvent[]) => setItem(STORAGE_KEYS.TIMELINE, data),

  getConsents: (): ConsentRecord[] => getItem(STORAGE_KEYS.CONSENTS, INITIAL_CONSENTS),
  saveConsents: (data: ConsentRecord[]) => setItem(STORAGE_KEYS.CONSENTS, data),

  getAccessRequests: (): AccessRequest[] => getItem(STORAGE_KEYS.ACCESS_REQUESTS, INITIAL_ACCESS_REQUESTS),
  saveAccessRequests: (data: AccessRequest[]) => setItem(STORAGE_KEYS.ACCESS_REQUESTS, data),

  getAuditLogs: (): AuditLog[] => getItem(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS),
  saveAuditLogs: (data: AuditLog[]) => setItem(STORAGE_KEYS.AUDIT_LOGS, data),

  getNotifications: (): Notification[] => getItem(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS),
  saveNotifications: (data: Notification[]) => setItem(STORAGE_KEYS.NOTIFICATIONS, data),

  getEmergencyProfile: (): EmergencyProfile => getItem(STORAGE_KEYS.EMERGENCY_PROFILE, INITIAL_EMERGENCY_PROFILE),
  saveEmergencyProfile: (data: EmergencyProfile) => setItem(STORAGE_KEYS.EMERGENCY_PROFILE, data),

  getDocuments: (): HealthDocument[] => getItem(STORAGE_KEYS.DOCUMENTS, INITIAL_DOCUMENTS),
  saveDocuments: (data: HealthDocument[]) => setItem(STORAGE_KEYS.DOCUMENTS, data),

  getFamilyMembers: (): FamilyMember[] => getItem(STORAGE_KEYS.FAMILY_MEMBERS, INITIAL_FAMILY_MEMBERS),
  saveFamilyMembers: (data: FamilyMember[]) => setItem(STORAGE_KEYS.FAMILY_MEMBERS, data),

  resetAllData: () => {
    localStorage.clear();
    window.location.reload();
  },
};
