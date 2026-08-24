import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Clock,
  Stethoscope,
  Pill,
  Syringe,
  FlaskConical,
  ShieldCheck,
  Calendar,
  AlertTriangle,
  ArrowRight,
  Check,
  Building2,
  Users,
  Award,
  ChevronRight,
  Activity,
  FileSpreadsheet,
  Lock,
  User,
  KeyRound,
  Shield,
  Sparkles,
  Globe,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/common/Toast';
import { BhashiniLanguageSelector, LanguageOption } from '../../components/common/BhashiniLanguageSelector';

export const LandingPage: React.FC = () => {
  const { login, switchRole, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  // Hero Sign-In / Sign-Up Card State
  const [authTab, setAuthTab] = useState<'signin' | 'signup'>('signin');
  const [selectedRole, setSelectedRole] = useState<'patient' | 'doctor' | 'admin'>('patient');
  const [email, setEmail] = useState('aditya@demo.health');
  const [password, setPassword] = useState('demo123');
  const [activeLanguage, setActiveLanguage] = useState('en');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regAadhaar, setRegAadhaar] = useState('');

  const handleLanguageChange = (lang: LanguageOption) => {
    setActiveLanguage(lang.code);
    showToast(`Language switched to ${lang.name} (${lang.nativeName}) via Bhashini`, 'info');
  };

  const handleRoleSelect = (r: 'patient' | 'doctor' | 'admin') => {
    setSelectedRole(r);
    if (r === 'patient') {
      setEmail('aditya@demo.health');
      setPassword('demo123');
    } else if (r === 'doctor') {
      setEmail('doctor@demo.health');
      setPassword('demo123');
    } else if (r === 'admin') {
      setEmail('admin@demo.health');
      setPassword('demo123');
    }
  };

  const handleHeroLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(email, selectedRole);
    if (success) {
      showToast(`Welcome back! Logged in as ${selectedRole.toUpperCase()}.`, 'success');
      if (selectedRole === 'patient') navigate('/patient/dashboard');
      else if (selectedRole === 'doctor') navigate('/doctor/dashboard');
      else if (selectedRole === 'admin') navigate('/admin/dashboard');
    } else {
      showToast('Invalid credentials. Use demo presets.', 'error');
    }
  };

  const handleHeroRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regPhone) {
      showToast('Please fill all required fields', 'warning');
      return;
    }
    showToast(`Health ID generated successfully for ${regName}! Redirecting to dashboard...`, 'success');
    switchRole('patient');
    navigate('/patient/dashboard');
  };

  const handleRoleQuickDemo = (role: 'patient' | 'doctor' | 'admin') => {
    switchRole(role);
    if (role === 'patient') navigate('/patient/dashboard');
    else if (role === 'doctor') navigate('/doctor/dashboard');
    else if (role === 'admin') navigate('/admin/dashboard');
  };

  return (
    <div className="space-y-12 pb-16">
      {/* 1. NIH Hero Feature Banner with Prominent Big Sign-in / Sign-up Card */}
      <section className="relative w-full min-h-[580px] bg-[#001f3f] overflow-hidden flex items-center py-10 px-4 sm:px-6">
        {/* Real Clinical & Radiology Imagery Background */}
        <img
          src="https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=1600&q=80"
          alt="Aarogyam National Health Ecosystem"
          className="absolute inset-0 w-full h-full object-cover opacity-75"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#00152e]/95 via-[#002244]/80 to-[#00152e]/90" />

        {/* Hero Content Grid (Left: Mission Pitch | Right: Big Interactive Sign In / Register Card) */}
        <div className="relative max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Headline & Value Proposition */}
          <div className="lg:col-span-7 space-y-4 text-white">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-xs bg-[#005ea2] text-white">
                NATIONAL DIGITAL HEALTH ECOSYSTEM
              </span>
              <span className="text-xs text-white/80 font-medium">
                • One Patient. One Health Timeline.
              </span>
            </div>

            <h1 className="nih-serif-title text-2xl sm:text-4xl lg:text-[42px] font-extrabold text-white leading-tight">
              Sovereign Medical Records & Unified Timeline
            </h1>

            <p className="text-xs sm:text-sm text-white/90 leading-relaxed max-w-xl">
              A secure public healthcare platform unifying patient diagnoses, prescriptions, vaccinations, and lab reports across hospitals — protected by granular consent and instant emergency allergy lookup.
            </p>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 max-w-lg text-xs">
              <div className="flex items-start gap-2 p-2.5 rounded-xs bg-white/10 border border-white/15">
                <Check className="h-4 w-4 text-white/90 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white block">Longitudinal Timeline:</strong>
                  Automatic synchronization across OPD visits and prescriptions.
                </span>
              </div>
              <div className="flex items-start gap-2 p-2.5 rounded-xs bg-white/10 border border-white/15">
                <Check className="h-4 w-4 text-white/90 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white block">Doctor Case-Taking:</strong>
                  Standardized 6-step clinical intake for physicians.
                </span>
              </div>
              <div className="flex items-start gap-2 p-2.5 rounded-xs bg-white/10 border border-white/15">
                <Check className="h-4 w-4 text-white/90 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white block">Vaccine Tracker:</strong>
                  Hepatitis B & booster multi-dose countdown schedule.
                </span>
              </div>
              <div className="flex items-start gap-2.5 p-2.5 rounded-xs bg-white/10 border border-white/15">
                <Check className="h-4 w-4 text-white/90 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white block">Patient Sovereignty:</strong>
                  Time-bound doctor permissions with 1-click revoke.
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Big, Prominent, High-Impact Sign In / Register Card */}
          <div className="lg:col-span-5 w-full">
            <div className="bg-white rounded-xs shadow-2xl border-2 border-white/80 overflow-hidden text-foreground">
              {/* Card Header with Sign In / Sign Up tabs and Language Selector right to the side */}
              <div className="bg-[#f0f2f5] border-b border-border p-2 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1 text-xs flex-1">
                  <button
                    type="button"
                    onClick={() => setAuthTab('signin')}
                    className={`px-3 py-1.5 rounded-xs font-bold text-center transition-all ${
                      authTab === 'signin'
                        ? 'bg-white text-[#004b87] shadow-xs border border-border'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthTab('signup')}
                    className={`px-3 py-1.5 rounded-xs font-bold text-center transition-all ${
                      authTab === 'signup'
                        ? 'bg-white text-[#004b87] shadow-xs border border-border'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Create Health ID
                  </button>
                </div>

                {/* Language Selector right to the side of Sign In / Sign Up */}
                <div className="shrink-0">
                  <BhashiniLanguageSelector
                    selectedLang={activeLanguage}
                    onSelectLang={handleLanguageChange}
                    compact={true}
                  />
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 sm:p-6 space-y-4">
                {authTab === 'signin' ? (
                  <form onSubmit={handleHeroLogin} className="space-y-3.5 text-xs">
                    {/* Role Selector Chips */}
                    <div>
                      <label className="font-bold text-foreground block mb-1.5 text-[11px] uppercase tracking-wider">
                        Select Portal Role:
                      </label>
                      <div className="grid grid-cols-3 gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleRoleSelect('patient')}
                          className={`p-2 rounded-xs border text-center transition-all ${
                            selectedRole === 'patient'
                              ? 'bg-[#004b87] text-white border-[#004b87] font-bold shadow-xs'
                              : 'bg-surface-alt border-border text-foreground hover:bg-muted'
                          }`}
                        >
                          <User className="h-3.5 w-3.5 mx-auto mb-0.5" />
                          <span>Patient</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRoleSelect('doctor')}
                          className={`p-2 rounded-xs border text-center transition-all ${
                            selectedRole === 'doctor'
                              ? 'bg-[#004b87] text-white border-[#004b87] font-bold shadow-xs'
                              : 'bg-surface-alt border-border text-foreground hover:bg-muted'
                          }`}
                        >
                          <Stethoscope className="h-3.5 w-3.5 mx-auto mb-0.5" />
                          <span>Doctor</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRoleSelect('admin')}
                          className={`p-2 rounded-xs border text-center transition-all ${
                            selectedRole === 'admin'
                              ? 'bg-[#004b87] text-white border-[#004b87] font-bold shadow-xs'
                              : 'bg-surface-alt border-border text-foreground hover:bg-muted'
                          }`}
                        >
                          <Building2 className="h-3.5 w-3.5 mx-auto mb-0.5" />
                          <span>Admin</span>
                        </button>
                      </div>
                    </div>

                    {/* Email / Health ID Input */}
                    <div>
                      <label className="font-semibold text-foreground block mb-1">
                        {selectedRole === 'patient'
                          ? 'Patient Health ID / Email'
                          : selectedRole === 'doctor'
                          ? 'Doctor Medical Reg No / Email'
                          : 'Hospital Admin User ID'}
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="e.g. aditya@demo.health"
                          className="w-full h-9 px-3 rounded-xs border border-border text-xs bg-surface text-foreground focus:outline-none focus:border-[#004b87]"
                        />
                      </div>
                    </div>

                    {/* Password Input */}
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="font-semibold text-foreground">Password</label>
                        <Link to="/forgot-password" className="text-[11px] text-[#005ea2] hover:underline">
                          Forgot password?
                        </Link>
                      </div>
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full h-9 px-3 rounded-xs border border-border text-xs bg-surface text-foreground focus:outline-none focus:border-[#004b87]"
                      />
                    </div>

                    {/* 1-Click Preset Info Chip */}
                    <div className="p-2 rounded-xs bg-[#f0f2f5] border border-border text-[11px] text-muted-foreground flex items-center justify-between">
                      <span>Preset: <strong className="text-foreground">{email}</strong></span>
                      <span className="font-mono text-[10px] text-[#004b87] font-bold">PW: demo123</span>
                    </div>

                    {/* Submit CTA Button */}
                    <button
                      type="submit"
                      className="w-full py-2.5 bg-[#004b87] hover:bg-[#003d6e] text-white font-bold text-xs rounded-xs shadow-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>Access {selectedRole.toUpperCase()} Dashboard</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleHeroRegister} className="space-y-3.5 text-xs">
                    <div>
                      <label className="font-semibold text-foreground block mb-1">Full Legal Name *</label>
                      <input
                        type="text"
                        required
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder="e.g. Ramesh Kumar Verma"
                        className="w-full h-9 px-3 rounded-xs border border-border text-xs bg-surface text-foreground focus:outline-none focus:border-[#004b87]"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-foreground block mb-1">Mobile Number for OTP *</label>
                      <input
                        type="tel"
                        required
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full h-9 px-3 rounded-xs border border-border text-xs bg-surface text-foreground focus:outline-none focus:border-[#004b87]"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-foreground block mb-1">Simulated Health ID Token (Optional)</label>
                      <input
                        type="text"
                        value={regAadhaar}
                        onChange={(e) => setRegAadhaar(e.target.value)}
                        placeholder="ABDM-9821-4402-1190"
                        className="w-full h-9 px-3 rounded-xs border border-border text-xs bg-surface text-foreground font-mono focus:outline-none focus:border-[#004b87]"
                      />
                    </div>

                    <div className="p-2.5 rounded-xs bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 text-emerald-800 dark:text-emerald-300 text-[11px] flex items-center gap-1.5">
                      <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600" />
                      <span>Zero biometric harvesting. Instant synthetic health token issued.</span>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-[#004b87] hover:bg-[#003d6e] text-white font-bold text-xs rounded-xs shadow-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>Generate Citizen Health ID</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. NIH 3-Column Scientific & Clinical Research Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Clinical Lab Diagnostics */}
          <div className="border border-border rounded-xs overflow-hidden bg-white hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="h-44 w-full bg-slate-100 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80"
                alt="Scientist looking into microscope"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
              <div>
                <Link to="/patient/labs" className="text-base font-bold text-[#005ea2] hover:underline nih-serif-title block leading-snug">
                  Automated Lab Sync: Real-time CBC & Blood Biochemistry
                </Link>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  Hospital diagnostics and biochemistry panels automatically attach to the patient's timeline with immutable security logs.
                </p>
              </div>
              <div className="pt-3 border-t border-border/60">
                <Link to="/patient/labs" className="text-xs font-semibold text-[#005ea2] hover:underline">
                  View Diagnostic Lab Reports →
                </Link>
              </div>
            </div>
          </div>

          {/* Card 2: Vaccine Immunization Protocol */}
          <div className="border border-border rounded-xs overflow-hidden bg-white hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="h-44 w-full bg-slate-100 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=800&q=80"
                alt="Microbiology cellular structure"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
              <div>
                <Link to="/patient/vaccinations" className="text-base font-bold text-[#005ea2] hover:underline nih-serif-title block leading-snug">
                  Universal Hepatitis B Immunization Protocol
                </Link>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  Multi-dose vaccine progression tracking ensuring timely booster countdowns and 98.4% lifelong immunity coverage.
                </p>
              </div>
              <div className="pt-3 border-t border-border/60">
                <Link to="/patient/vaccinations" className="text-xs font-semibold text-[#005ea2] hover:underline">
                  Track Vaccine Schedules →
                </Link>
              </div>
            </div>
          </div>

          {/* Card 3: Maternal & Family Health Care */}
          <div className="border border-border rounded-xs overflow-hidden bg-white hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="h-44 w-full bg-slate-100 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=800&q=80"
                alt="Family and child healthcare clinic"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
              <div>
                <Link to="/patient/family" className="text-base font-bold text-[#005ea2] hover:underline nih-serif-title block leading-snug">
                  Connecting Communities for Universal Family Health
                </Link>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  Empowering rural dispensaries and multi-specialty apex hospitals with instant emergency allergy checks and unified history.
                </p>
              </div>
              <div className="pt-3 border-t border-border/60">
                <Link to="/patient/family" className="text-xs font-semibold text-[#005ea2] hover:underline">
                  Manage Family Health Profiles →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. NIH 2-Column Section: "Aarogyam at a Glance" & "Featured Resources & Initiatives" */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Column 1: Aarogyam at a Glance */}
          <div className="space-y-4">
            <h2 className="nih-serif-title text-xl sm:text-2xl text-[#111111]">
              Aarogyam at a Glance
            </h2>

            <div className="rounded-xs overflow-hidden border border-border h-56 bg-slate-100">
              <img
                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80"
                alt="Doctor listening to senior patient in clinic"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              Aarogyam, an institutional healthcare platform under the National Digital Health Mission, is the country's medical record infrastructure — unifying fragmented clinical records to improve health outcomes and save lives.
            </p>

            {/* Vertical Pill Stack Buttons (Exact NIH Style) */}
            <div className="space-y-2 pt-1">
              <Link to="/how-it-works" className="block">
                <button className="w-full py-2 px-4 rounded-xs border border-border bg-white hover:bg-slate-50 text-[#005ea2] font-semibold text-xs text-center shadow-2xs hover:border-[#005ea2] transition-colors">
                  Take the Interactive Guided Tour
                </button>
              </Link>
              <Link to="/about" className="block">
                <button className="w-full py-2 px-4 rounded-xs border border-border bg-white hover:bg-slate-50 text-[#005ea2] font-semibold text-xs text-center shadow-2xs hover:border-[#005ea2] transition-colors">
                  The National Health Mission & Architecture
                </button>
              </Link>
              <Link to="/patient/timeline" className="block">
                <button className="w-full py-2 px-4 rounded-xs border border-border bg-white hover:bg-slate-50 text-[#005ea2] font-semibold text-xs text-center shadow-2xs hover:border-[#005ea2] transition-colors">
                  Longitudinal Health Record Standards (FHIR R4)
                </button>
              </Link>
              <Link to="/patient/book-appointment" className="block">
                <button className="w-full py-2 px-4 rounded-xs border border-border bg-white hover:bg-slate-50 text-[#005ea2] font-semibold text-xs text-center shadow-2xs hover:border-[#005ea2] transition-colors">
                  Accredited Hospital Network (City Care Hospital)
                </button>
              </Link>
              <Link to="/admin/audit" className="block">
                <button className="w-full py-2 px-4 rounded-xs border border-border bg-white hover:bg-slate-50 text-[#005ea2] font-semibold text-xs text-center shadow-2xs hover:border-[#005ea2] transition-colors">
                  Impact & Security Compliance Audit
                </button>
              </Link>
              <Link to="/register" className="block">
                <button className="w-full py-2 px-4 rounded-xs border border-border bg-white hover:bg-slate-50 text-[#005ea2] font-semibold text-xs text-center shadow-2xs hover:border-[#005ea2] transition-colors">
                  Create Verified Citizen Health ID
                </button>
              </Link>
            </div>
          </div>

          {/* Column 2: Featured Resources & Initiatives */}
          <div className="space-y-4">
            <h2 className="nih-serif-title text-xl sm:text-2xl text-[#111111]">
              Featured Resources & Clinical Tools
            </h2>

            <div className="rounded-xs overflow-hidden border border-border h-56 bg-slate-100">
              <img
                src="https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=800&q=80"
                alt="Brain neural imaging and tractography"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              Explore Aarogyam's standardized clinical case-taking tools and consent management architecture that accelerate diagnosis and ensure patient sovereignty.
            </p>

            {/* Vertical Pill Stack Buttons (Exact NIH Style) */}
            <div className="space-y-2 pt-1">
              <Link to="/doctor/case/new" className="block">
                <button className="w-full py-2 px-4 rounded-xs border border-border bg-white hover:bg-slate-50 text-[#005ea2] font-semibold text-xs text-center shadow-2xs hover:border-[#005ea2] transition-colors">
                  Doctor Digital Case-Taking (6-Step Workflow)
                </button>
              </Link>
              <Link to="/patient/vaccinations" className="block">
                <button className="w-full py-2 px-4 rounded-xs border border-border bg-white hover:bg-slate-50 text-[#005ea2] font-semibold text-xs text-center shadow-2xs hover:border-[#005ea2] transition-colors">
                  Universal Immunization & Vaccine Schedule
                </button>
              </Link>
              <Link to="/patient/emergency" className="block">
                <button className="w-full py-2 px-4 rounded-xs border border-border bg-white hover:bg-slate-50 text-[#005ea2] font-semibold text-xs text-center shadow-2xs hover:border-[#005ea2] transition-colors">
                  Emergency Health Pass & Allergy Alert
                </button>
              </Link>
              <Link to="/patient/consent" className="block">
                <button className="w-full py-2 px-4 rounded-xs border border-border bg-white hover:bg-slate-50 text-[#005ea2] font-semibold text-xs text-center shadow-2xs hover:border-[#005ea2] transition-colors">
                  Granular Consent & Patient Privacy Manager
                </button>
              </Link>
              <Link to="/patient/medications" className="block">
                <button className="w-full py-2 px-4 rounded-xs border border-border bg-white hover:bg-slate-50 text-[#005ea2] font-semibold text-xs text-center shadow-2xs hover:border-[#005ea2] transition-colors">
                  Prescriptions & Medication Vault
                </button>
              </Link>
              <Link to="/admin/dashboard" className="block">
                <button className="w-full py-2 px-4 rounded-xs border border-border bg-white hover:bg-slate-50 text-[#005ea2] font-semibold text-xs text-center shadow-2xs hover:border-[#005ea2] transition-colors">
                  Hospital Admin & Interoperability Center
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SIH Presentation Quick Roles */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-[#f0f2f5] p-5 sm:p-6 rounded-xs border border-border space-y-4">
          <div className="border-b border-border pb-3 flex items-center justify-between">
            <div>
              <h3 className="nih-serif-title text-base sm:text-lg text-[#111111]">
                Smart India Hackathon Presentation Roles
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Launch pre-seeded demonstration accounts with complete real-time clinical data synchronization:
              </p>
            </div>
            <span className="text-xs font-bold text-[#005ea2]">Interactive Demo</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div
              onClick={() => handleRoleQuickDemo('patient')}
              className="p-4 rounded-xs border border-border bg-white hover:border-[#004b87] cursor-pointer shadow-2xs transition-all space-y-1.5"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#004b87]">1. Patient Profile</span>
                <span className="font-mono text-muted-foreground text-[10px]">P-10001</span>
              </div>
              <h4 className="font-bold text-sm text-foreground">Aditya Verma</h4>
              <p className="text-[11px] text-muted-foreground">
                Longitudinal timeline, Hepatitis B doses, active Asthma prescriptions, and consent controls.
              </p>
            </div>

            <div
              onClick={() => handleRoleQuickDemo('doctor')}
              className="p-4 rounded-xs border border-border bg-white hover:border-[#004b87] cursor-pointer shadow-2xs transition-all space-y-1.5"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#004b87]">2. Attending Physician</span>
                <span className="font-mono text-muted-foreground text-[10px]">DOC-301</span>
              </div>
              <h4 className="font-bold text-sm text-foreground">Dr. Rohan Sharma</h4>
              <p className="text-[11px] text-muted-foreground">
                Conduct 6-step case-taking, issue digital Rx, and auto-sync to Aditya's longitudinal record.
              </p>
            </div>

            <div
              onClick={() => handleRoleQuickDemo('admin')}
              className="p-4 rounded-xs border border-border bg-white hover:border-[#004b87] cursor-pointer shadow-2xs transition-all space-y-1.5"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#004b87]">3. Hospital Apex Node</span>
                <span className="font-mono text-muted-foreground text-[10px]">CCH-DEL</span>
              </div>
              <h4 className="font-bold text-sm text-foreground">City Care Hospital</h4>
              <p className="text-[11px] text-muted-foreground">
                12,482 patient master directory, doctor rosters, department quotas, and immutable audit logs.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
