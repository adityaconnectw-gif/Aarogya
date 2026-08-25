/**
 * Aarogyam AI Assistant - Frontend Mock Response Service
 * 
 * Provides domain-specific conversational intelligence for the Aarogyam health portal
 * without requiring any external AI API keys or backend servers.
 */

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestions?: string[];
  category?: string;
}

export interface QuickSuggestion {
  label: string;
  query: string;
}

export const INITIAL_QUICK_ACTIONS: QuickSuggestion[] = [
  { label: '📅 Book Appointment', query: 'How do I book a doctor appointment?' },
  { label: '🩺 Find a Doctor', query: 'Help me find a doctor or specialist' },
  { label: '📋 View Health Records', query: 'Where can I see my medical records and timeline?' },
  { label: '💉 Vaccination Tracker', query: 'How does the vaccination tracker work?' },
  { label: '🚨 Emergency Health Pass', query: 'What is the Emergency Health Card and Break-Glass access?' },
  { label: '🔒 Consent & Privacy', query: 'How does patient consent and data privacy work?' },
];

export const WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome-msg',
  sender: 'assistant',
  text: "Namaste! I'm your Aarogyam Virtual Health Assistant. I can help you navigate health records, schedule hospital appointments, track immunization doses, and manage doctor permissions. How can I assist you today?",
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  suggestions: INITIAL_QUICK_ACTIONS.map((a) => a.query),
};

interface ResponseRule {
  keywords: string[];
  reply: string;
  suggestions?: string[];
}

const RESPONSE_RULES: ResponseRule[] = [
  // 1. Appointments & Booking
  {
    keywords: ['book', 'appointment', 'opd', 'schedule', 'slot', 'consultation', 'token'],
    reply: "To book an OPD consultation or doctor visit:\n\n1. Navigate to 'Hospital OPD Network' or 'Book Appointment' from your menu.\n2. Select your hospital department (e.g. Cardiology, General Medicine, Pediatrics).\n3. Choose your preferred practitioner and available date/time slot.\n4. Confirm your slot to generate an instant digital OPD queue token.",
    suggestions: [
      'Help me find a doctor',
      'Where can I view my appointments?',
      'How does the digital token work?',
    ],
  },
  {
    keywords: ['my appointment', 'upcoming appointment', 'check appointment', 'cancel appointment'],
    reply: "You can view, reschedule, or check the status of all your booked OPD sessions in the 'Appointments' tab of your Patient Dashboard.",
    suggestions: ['How do I book a doctor appointment?', 'Where can I see my medical records?'],
  },

  // 2. Doctors & Specialists
  {
    keywords: ['find a doctor', 'doctor', 'specialist', 'physician', 'cardiologist', 'pediatrician', 'ortho', 'surgeon', 'practitioner'],
    reply: "Aarogyam connects you with verified medical practitioners across participating national institutions:\n\n• Dr. Rohan Sharma — Chief Cardiologist (AIIMS New Delhi)\n• Dr. Priya Nair — Senior Pediatrician (Apollo Hospital)\n• Dr. Amit Patel — Orthopedic Specialist (Safdarjung Hospital)\n\nVisit the 'Doctor Directory' to view qualifications, OPD schedules, and direct booking slots.",
    suggestions: ['How do I book a doctor appointment?', 'How does doctor case-taking work?'],
  },

  // 3. Health Timeline & Records
  {
    keywords: ['record', 'timeline', 'history', 'prescription', 'prescription', 'past visit', 'document', 'download record'],
    reply: "Your 'Health Timeline' provides a single chronological medical history that consolidates:\n\n• Doctor OPD diagnoses and clinical case summaries\n• Digital prescriptions with drug dosage schedules\n• Diagnostic radiology and pathology reports\n• Hospital admission & discharge records\n\nAll records are linked securely to your Patient Health ID.",
    suggestions: ['Where can I see my lab reports?', 'How does patient consent work?'],
  },

  // 4. Lab Reports & Diagnostics
  {
    keywords: ['lab', 'test', 'report', 'blood test', 'pathology', 'x-ray', 'mri', 'diagnostic', 'cbc', 'lipid'],
    reply: "Diagnostic lab reports (e.g., Complete Blood Count, Lipid Profile, Thyroid Panel, Chest X-Rays) are automatically uploaded by accredited hospital laboratories and synchronized with your Health Timeline under 'Lab Reports'.",
    suggestions: ['Where can I see my medical records?', 'How do I download my emergency card?'],
  },

  // 5. Vaccinations & Immunization
  {
    keywords: ['vaccine', 'vaccination', 'immunization', 'hepatitis', 'polio', 'booster', 'covid', 'dose', 'child vaccine'],
    reply: "The Aarogyam 'Vaccines & Immunization' module tracks national immunization schedules for adults and infants:\n\n• Visual countdown timers for due doses (e.g. Hepatitis B Dose 2)\n• Digital vaccination certificates with verifiable QR verification\n• Cold-chain batch and administrator logging.",
    suggestions: ['How do I book a vaccination slot?', 'Where can I see my medical records?'],
  },

  // 6. Emergency Health Card & Break-Glass
  {
    keywords: ['emergency', 'health card', 'break-glass', 'allergy', 'allergies', 'penicillin', 'blood group', 'trauma', 'qr code', 'emergency pass'],
    reply: "The 'Emergency Health Card' is life-critical:\n\n• Instantly reveals blood group (e.g. B+ Rh Positive) and severe contraindications (e.g. Penicillin / Amoxicillin).\n• Features an Emergency QR code for first responders.\n• Implements 'Break-Glass Access' allowing emergency trauma teams immediate read-only access while permanently logging the event into the immutable audit trail.",
    suggestions: ['How does patient consent work?', 'Where can I see my medical records?'],
  },

  // 7. Consent & Privacy
  {
    keywords: ['consent', 'privacy', 'permission', 'revoke', 'security', 'abdm', 'data protection', 'share record', 'audit'],
    reply: "Aarogyam follows strict Patient Sovereignty principles:\n\n• You choose which doctors can view your health timeline.\n• Permissions are time-bounded (e.g. 24-hour consultation window).\n• You can revoke access at any moment with a single click.\n• Every data access attempt is logged in your immutable 'Security Audit Log'.",
    suggestions: ['Where can I see my security audit log?', 'How do I generate a Health ID?'],
  },

  // 8. Health ID & Registration
  {
    keywords: ['register', 'health id', 'create account', 'sign up', 'abha', 'identity', 'patient id'],
    reply: "Creating an Aarogyam Health ID takes under 60 seconds:\n\n1. Click 'Create Health ID' on the top navigation.\n2. Enter your basic demographics (Name, Date of Birth, Blood Group, Mobile).\n3. You will immediately receive your verified Patient ID (e.g. P-10001) with zero biometric harvesting.",
    suggestions: ['How do I sign in?', 'How does Aarogyam work?'],
  },

  // 9. Login & Role Switching
  {
    keywords: ['login', 'sign in', 'password', 'demo account', 'role', 'doctor login', 'admin login', 'aditya'],
    reply: "You can sign in using preset demonstration credentials:\n\n• Patient Portal: aditya@demo.health (PW: demo123)\n• Doctor Clinical Portal: doctor@demo.health (PW: demo123)\n• Hospital Administrator: admin@demo.health (PW: demo123)",
    suggestions: ['How do I book a doctor appointment?', 'Where can I see my medical records?'],
  },

  // 10. Greetings & Salutations
  {
    keywords: ['hello', 'hi', 'hey', 'namaste', 'greetings', 'good morning', 'good afternoon', 'good evening'],
    reply: "Namaste! How can I assist you with your health records, appointment bookings, or clinical inquiries today?",
    suggestions: ['How do I book a doctor appointment?', 'Help me find a doctor', 'Where can I see my medical records?'],
  },

  // 11. Thank you & General Acknowledgements
  {
    keywords: ['thank', 'thanks', 'dhanyawad', 'shukriya', 'helpful', 'great', 'awesome', 'good'],
    reply: "You're very welcome! I am always here to assist with your healthcare journey on Aarogyam. Stay healthy!",
    suggestions: ['View Health Records', 'Book an Appointment', 'Emergency Health Pass'],
  },

  // 12. About & How it Works
  {
    keywords: ['about', 'aarogyam', 'how it works', 'what is aarogyam', 'who created', 'system', 'mission'],
    reply: "Aarogyam is a unified National Patient Health Ecosystem engineered to solve fragmented healthcare data across Indian medical facilities. It empowers citizens with longitudinal records while giving authorized clinicians standardized case-taking tools under strict digital consent.",
    suggestions: ['How does patient consent work?', 'How do I book a doctor appointment?', 'Emergency Health Pass'],
  },
];

/**
 * Finds the most relevant mock response for a given user query.
 */
export async function getChatbotResponse(userQuery: string): Promise<ChatMessage> {
  const normalizedQuery = userQuery.toLowerCase().trim();

  // Simulate network / AI processing latency for realistic feel (650ms - 950ms)
  const latency = Math.floor(Math.random() * 300) + 650;
  await new Promise((resolve) => setTimeout(resolve, latency));

  let matchedRule: ResponseRule | null = null;
  let highestMatchCount = 0;

  for (const rule of RESPONSE_RULES) {
    let matchCount = 0;
    for (const kw of rule.keywords) {
      if (normalizedQuery.includes(kw)) {
        matchCount++;
      }
    }
    if (matchCount > highestMatchCount) {
      highestMatchCount = matchCount;
      matchedRule = rule;
    }
  }

  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (matchedRule && highestMatchCount > 0) {
    return {
      id: `msg-${Date.now()}`,
      sender: 'assistant',
      text: matchedRule.reply,
      timestamp,
      suggestions: matchedRule.suggestions || INITIAL_QUICK_ACTIONS.slice(0, 3).map((a) => a.query),
    };
  }

  // Fallback for unknown questions
  return {
    id: `msg-${Date.now()}`,
    sender: 'assistant',
    text: "I am your Aarogyam frontend digital assistant. I can assist you with:\n\n• Booking hospital OPD appointments\n• Locating doctors & clinical specialists\n• Checking your Health Timeline & lab reports\n• Monitoring vaccination schedules & booster countdowns\n• Viewing your Emergency Break-Glass Health Card\n• Managing time-bound consent permissions\n\nPlease select one of the suggested topics below or rephrase your question.",
    timestamp,
    suggestions: [
      'How do I book a doctor appointment?',
      'Help me find a doctor',
      'Where can I see my medical records?',
      'What is the Emergency Health Card?',
    ],
  };
}
