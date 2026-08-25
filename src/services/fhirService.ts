/**
 * HL7 FHIR (Fast Healthcare Interoperability Resources) Service Interface
 * 
 * Provides mock standard FHIR R4 Bundle conversion for the Aarogyam clinical intake data.
 */

export interface FHIRResource {
  resourceType: string;
  id: string;
  meta?: { versionId?: string; lastUpdated?: string };
}

export interface FHIRComposition extends FHIRResource {
  resourceType: 'Composition';
  status: 'preliminary' | 'final';
  type: { text: string };
  subject: { reference: string; display: string };
  date: string;
  author: [{ display: string }];
  title: string;
  section: Array<{
    title: string;
    code?: { text: string };
    text: { status: string; div: string };
  }>;
}

export interface FHIRBundle extends FHIRResource {
  resourceType: 'Bundle';
  type: 'document' | 'collection';
  timestamp: string;
  entry: Array<{
    fullUrl: string;
    resource: any;
  }>;
}

/**
 * Transforms structured clinical intake state into a FHIR R4 Document Bundle.
 */
export function generateFHIRBundleFromIntake(intakeData: any): FHIRBundle {
  const timestamp = new Date().toISOString();
  const bundleId = `bundle-intake-${Date.now()}`;

  const composition: FHIRComposition = {
    resourceType: 'Composition',
    id: `comp-${Date.now()}`,
    status: 'preliminary',
    type: { text: 'Clinical Intake Pre-Consultation Summary' },
    subject: {
      reference: `Patient/${intakeData.patientId || 'P-10001'}`,
      display: intakeData.name || 'Aditya Verma',
    },
    date: timestamp,
    author: [{ display: 'Aarogyam MediKiosk Self-Service Intake Engine' }],
    title: 'Pre-Consultation Clinical Intake & History Document',
    section: [
      {
        title: 'Chief Complaint & HPI',
        text: {
          status: 'generated',
          div: `<div><p><strong>Chief Complaint:</strong> ${intakeData.chiefComplaint}</p><p><strong>Severity:</strong> ${intakeData.severity}/10</p></div>`,
        },
      },
      {
        title: 'Review of Systems & Medical History',
        text: {
          status: 'generated',
          div: `<div><p>SOCRATES breakdown and past medical records verified.</p></div>`,
        },
      },
    ],
  };

  return {
    resourceType: 'Bundle',
    id: bundleId,
    type: 'document',
    timestamp,
    entry: [
      {
        fullUrl: `urn:uuid:${composition.id}`,
        resource: composition,
      },
    ],
  };
}
