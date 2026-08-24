export type UserRole = 'patient' | 'doctor' | 'admin';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  patientId?: string;
  doctorId?: string;
  hospitalId?: string;
  hospitalName?: string;
  avatar?: string;
}

export interface Patient {
  id: string;
  patientId: string; // e.g. P-10001
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  dob: string;
  bloodGroup: string;
  phone: string;
  email: string;
  address: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  nationalHealthIdDemo: string; // Demo Identity Token
  registeredDate: string;
  primaryCareDoctorId?: string;
  status: 'Active' | 'Inactive';
}

export interface Doctor {
  id: string;
  doctorId: string; // e.g. DOC-301
  name: string;
  specialty: string;
  department: string;
  experienceYears: number;
  hospitalId: string;
  hospitalName: string;
  qualification: string;
  rating: number;
  reviewCount: number;
  consultationFee: number;
  languages: string[];
  availability: string;
  bio: string;
  email: string;
  phone: string;
  registrationNumber: string;
  status: 'Active' | 'On Leave' | 'Inactive';
  availableSlots?: string[];
}

export interface Hospital {
  id: string;
  name: string;
  type: 'Public / Government' | 'Autonomous' | 'Trust Hospital' | 'Private Multi-Specialty';
  city: string;
  state: string;
  address: string;
  phone: string;
  email: string;
  departments: string[];
  totalBeds: number;
  activeDoctorsCount: number;
  code: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  headOfDepartment: string;
  doctorCount: number;
  todayAppointmentsCount: number;
  description: string;
}

export type AppointmentStatus = 'Confirmed' | 'Pending' | 'Completed' | 'Cancelled' | 'In Progress';

export interface Appointment {
  id: string;
  appointmentId: string; // e.g. APT-8901
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  hospitalId: string;
  hospitalName: string;
  department: string;
  date: string; // YYYY-MM-DD
  time: string; // e.g. "11:00 AM"
  type: 'Routine Checkup' | 'Follow-up' | 'Consultation' | 'Emergency' | 'Vaccination';
  reason: string;
  status: AppointmentStatus;
  notes?: string;
  createdAt: string;
}

export type ConditionSeverity = 'Mild' | 'Moderate' | 'Severe' | 'Critical';
export type ConditionStatus = 'Active' | 'Resolved' | 'Under Treatment' | 'Recurrent';

export interface Condition {
  id: string;
  patientId: string;
  name: string; // e.g. "Asthma"
  status: ConditionStatus;
  severity: ConditionSeverity;
  diagnosedDate: string;
  doctorId: string;
  doctorName: string;
  hospitalName: string;
  treatment: string;
  notes?: string;
}

export type MedicationStatus = 'Active' | 'Completed' | 'Discontinued';

export interface Medication {
  id: string;
  patientId: string;
  name: string; // e.g. "Paracetamol 650mg"
  dosage: string; // e.g. "1 tablet"
  frequency: string; // e.g. "Twice daily"
  duration: string; // e.g. "5 days"
  startDate: string;
  endDate: string;
  doctorId: string;
  doctorName: string;
  hospitalName: string;
  status: MedicationStatus;
  instructions: string;
  batchNumber?: string;
  expiryDate?: string;
  reason?: string;
  timing?: 'Morning - Night' | 'After meals' | 'Before meals' | 'As needed';
}

export type VaccinationStatus = 'Completed' | 'Due' | 'Overdue';

export interface VaccinationDose {
  doseNumber: number;
  doseLabel: string; // e.g. "Dose 1", "Booster"
  dateAdministered?: string;
  status: VaccinationStatus;
  batchNumber?: string;
  administeredBy?: string;
  hospital?: string;
  manufacturer?: string;
  expiryDate?: string;
}

export interface Vaccination {
  id: string;
  patientId: string;
  vaccineName: string; // e.g. "Hepatitis B", "COVID-19 (Covishield)", "Tetanus Toxoid"
  category: 'Routine Adult' | 'Travel / Occupational' | 'Seasonal' | 'Childhood';
  targetDisease: string;
  doses: VaccinationDose[];
  nextDoseDate?: string;
  daysRemaining?: number;
  overallStatus: VaccinationStatus;
  recommendedFor: string;
  notes?: string;
}

export type LabResultStatus = 'Normal' | 'Abnormal' | 'Borderline High' | 'Borderline Low' | 'Critical' | 'Reviewed' | 'Pending';

export interface LabReport {
  id: string;
  patientId: string;
  testName: string; // e.g. "Complete Blood Count (CBC)", "Fasting Blood Glucose"
  category: 'Hematology' | 'Biochemistry' | 'Lipid Profile' | 'Endocrinology' | 'Microbiology' | 'Imaging';
  date: string;
  result: string;
  referenceRange: string;
  unit: string;
  status: LabResultStatus;
  hospitalName: string;
  labTechnician?: string;
  doctorName?: string;
  summary: string;
  fileSize?: string;
}

export interface Allergy {
  id: string;
  patientId: string;
  allergen: string; // e.g. "Penicillin", "Peanuts", "Sulfa Drugs"
  severity: 'Mild' | 'Moderate' | 'Severe' | 'Life Threatening';
  reaction: string; // e.g. "Skin rash, Urticaria", "Anaphylaxis"
  diagnosedDate: string;
  recordedBy: string;
  hospitalName: string;
  notes?: string;
}

export interface PrescriptionItem {
  medicineName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export interface Prescription {
  id: string;
  prescriptionId: string; // e.g. RX-2026-092
  patientId: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  patientBloodGroup: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorRegNo: string;
  hospitalName: string;
  hospitalAddress: string;
  hospitalPhone: string;
  date: string;
  diagnosis: string;
  clinicalNotes?: string;
  medicines: PrescriptionItem[];
  followUpDays: number;
  followUpDate: string;
  vitals?: {
    bp?: string;
    pulse?: string;
    temp?: string;
    weight?: string;
  };
}

export interface Consultation {
  id: string;
  consultationId: string; // e.g. CON-2026-441
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  hospitalName: string;
  date: string;
  chiefComplaint: {
    complaint: string;
    duration: string;
    severity: 'Mild' | 'Moderate' | 'Severe';
    additionalNotes?: string;
  };
  history: {
    presentIllness: string;
    previousIllness: string;
    familyHistory?: string;
    surgicalHistory?: string;
    currentMedication?: string;
  };
  examination: {
    temperature: string; // e.g. "98.6 °F"
    bloodPressure: string; // e.g. "120/80 mmHg"
    pulse: string; // e.g. "72 bpm"
    spO2: string; // e.g. "98%"
    weight: string; // e.g. "68 kg"
    height: string; // e.g. "174 cm"
    generalExamination?: string;
  };
  assessment: {
    diagnosis: string;
    severity: ConditionSeverity;
    clinicalNotes: string;
  };
  treatment: {
    medicines: PrescriptionItem[];
    testsRecommended: string[];
    procedures?: string;
    followUpInDays: number;
  };
  prescriptionId?: string;
  status: 'Completed' | 'Draft';
}

export type TimelineEventType =
  | 'Consultation'
  | 'Diagnosis'
  | 'Medication'
  | 'Vaccination'
  | 'Lab Report'
  | 'Hospital Visit'
  | 'Appointment'
  | 'Prescription'
  | 'Procedure'
  | 'Emergency Access';

export interface HealthTimelineEvent {
  id: string;
  patientId: string;
  date: string; // YYYY-MM-DD
  type: TimelineEventType;
  title: string;
  subtitle?: string;
  provider: string; // e.g. "Dr. Rohan Sharma"
  facility: string; // e.g. "City Care Hospital"
  category: 'Consultations' | 'Medicines' | 'Vaccinations' | 'Labs' | 'Visits' | 'Appointments' | 'Procedures';
  details: {
    summary?: string;
    diagnosis?: string;
    prescriptionId?: string;
    consultationId?: string;
    dosage?: string;
    frequency?: string;
    testResult?: string;
    doseInfo?: string;
    vitals?: Record<string, string>;
    notes?: string;
  };
  badgeColor?: string;
}

export interface ConsentRecord {
  id: string;
  patientId: string;
  providerId: string;
  providerName: string;
  providerRole: 'Doctor' | 'Hospital' | 'Diagnostic Lab' | 'Emergency Personnel';
  facilityName: string;
  authorizedRecords: {
    diagnoses: boolean;
    medications: boolean;
    vaccinations: boolean;
    labReports: boolean;
    otherRecords: boolean;
  };
  duration: '24 hours' | '7 days' | '30 days' | 'Permanent' | 'Emergency Session';
  grantedAt: string;
  expiresAt: string;
  status: 'Active' | 'Revoked' | 'Expired';
  purpose: string;
}

export interface AccessRequest {
  id: string;
  requestId: string; // e.g. REQ-9901
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  facilityName: string;
  requestedRecords: {
    diagnoses: boolean;
    medications: boolean;
    vaccinations: boolean;
    labReports: boolean;
    otherRecords: boolean;
  };
  duration: '24 hours' | '7 days' | '30 days';
  purpose: string;
  requestedAt: string;
  status: 'Pending' | 'Approved' | 'Denied';
}

export type AuditActionType =
  | 'Viewed'
  | 'Created'
  | 'Updated'
  | 'Shared'
  | 'Revoked'
  | 'Emergency Access';

export interface AuditLog {
  id: string;
  timestamp: string; // ISO / formatted
  userId: string;
  userName: string;
  userRole: 'Doctor' | 'Patient' | 'Hospital Admin' | 'Emergency Medical Officer';
  action: AuditActionType;
  recordType: 'Medication History' | 'Vaccination Records' | 'Lab Reports' | 'Consultation Notes' | 'Emergency Profile' | 'Access Permissions' | 'Full Patient Chart';
  patientId: string;
  patientName: string;
  facility: string;
  accessType: 'Authorized' | 'Revocation' | 'Consent Grant' | 'Break-Glass Emergency';
  ipAddress?: string;
  notes?: string;
}

export interface Notification {
  id: string;
  patientId?: string;
  doctorId?: string;
  type: 'Vaccination' | 'Appointment' | 'Medication' | 'Security' | 'Access Request' | 'Lab Report';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  priority?: 'High' | 'Normal' | 'Urgent';
}

export interface EmergencyProfile {
  patientId: string;
  name: string;
  age: number;
  gender: string;
  bloodGroup: string;
  allergies: string[];
  criticalConditions: string[];
  currentMedications: string[];
  implantsOrDevices?: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  organDonorStatus?: string;
  emergencyNote: string;
  lastUpdated: string;
}

export interface HealthDocument {
  id: string;
  patientId: string;
  title: string;
  category: 'Lab Reports' | 'Prescriptions' | 'Discharge Summaries' | 'Medical Certificates' | 'Imaging Reports' | 'Other';
  date: string;
  hospitalName: string;
  doctorName?: string;
  fileSize: string;
  fileFormat: string;
  description: string;
}

export interface FamilyMember {
  id: string;
  patientId: string;
  name: string;
  relationship: 'Father' | 'Mother' | 'Spouse' | 'Child' | 'Sibling';
  age: number;
  bloodGroup: string;
  conditionsCount: number;
  activeMedicationsCount: number;
  lastCheckupDate: string;
  healthSummary: string;
}

export interface VitalTrendPoint {
  date: string;
  systolic?: number;
  diastolic?: number;
  glucoseFasting?: number;
  glucosePostMeal?: number;
  weightKg?: number;
  hemoglobin?: number;
  pulseRate?: number;
}
