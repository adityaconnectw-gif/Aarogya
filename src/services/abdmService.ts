/**
 * ABDM (Ayushman Bharat Digital Mission) Service Interface & Mock Implementation
 * 
 * Prepares the frontend for future integration with the National Health Authority (NHA)
 * ABHA APIs, M1/M2/M3 milestones, and the Unified Health Interface (UHI).
 */

export interface ABHAPatient {
  abhaId: string; // e.g. "12-3456-7890-1234"
  abhaAddress: string; // e.g. "aditya.verma@abdm"
  name: string;
  gender: 'M' | 'F' | 'O';
  yearOfBirth: number;
  mobile: string;
  verificationStatus: 'Demo Verified' | 'ABDM Ready' | 'Pending KYC';
  healthNumber: string;
}

export interface ConsentArtifact {
  consentId: string;
  patientAbhaId: string;
  purpose: 'CARETREAT' | 'PUBHLTH' | 'CLINICAL_INTAKE';
  dataClasses: Array<'DiagnosticReport' | 'Prescription' | 'ClinicalHistory' | 'Immunization'>;
  status: 'GRANTED' | 'REVOKED' | 'EXPIRED';
  grantTimestamp: string;
  expiryTimestamp: string;
  hiuId: string; // Health Information User (e.g. AIIMS-OPD-04)
}

/**
 * Mock verification of an ABHA ID or Aadhaar number for frontend demonstration.
 * In production, this will be replaced with NHA OTP/Biometric OAuth2 APIs.
 */
export async function verifyABHAId(input: string): Promise<ABHAPatient> {
  // Simulate network latency (250-400ms)
  await new Promise((resolve) => setTimeout(resolve, 300));

  const cleanInput = input.trim();

  if (cleanInput.includes('10003') || cleanInput.toLowerCase().includes('kamala')) {
    return {
      abhaId: '98-7654-3210-9876',
      abhaAddress: 'kamala.devi@abdm',
      name: 'Kamala Devi',
      gender: 'F',
      yearOfBirth: 1956,
      mobile: '+91 98111 22334',
      verificationStatus: 'ABDM Ready',
      healthNumber: 'ABHA-5621-9988-1003',
    };
  }

  // Default demo persona (Aditya Verma)
  return {
    abhaId: cleanInput || '12-3456-7890-1234',
    abhaAddress: 'aditya.verma@abdm',
    name: 'Aditya Verma',
    gender: 'M',
    yearOfBirth: 2004,
    mobile: '+91 98765 43210',
    verificationStatus: 'ABDM Ready',
    healthNumber: 'ABHA-9821-4402-1190',
  };
}

/**
 * Generates an ABDM Consent Artifact for clinical history capture and EMR sharing.
 */
export function generateConsentArtifact(patientAbhaId: string, durationHours = 24): ConsentArtifact {
  const now = new Date();
  const expiry = new Date(now.getTime() + durationHours * 60 * 60 * 1000);

  return {
    consentId: `ABDM-CONSENT-${Date.now()}`,
    patientAbhaId,
    purpose: 'CLINICAL_INTAKE',
    dataClasses: ['ClinicalHistory', 'Prescription', 'DiagnosticReport'],
    status: 'GRANTED',
    grantTimestamp: now.toISOString(),
    expiryTimestamp: expiry.toISOString(),
    hiuId: 'AIIMS-NEW-DELHI-OPD',
  };
}
