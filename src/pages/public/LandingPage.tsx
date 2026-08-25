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
import { AarogyamLogo } from '../../components/common/AarogyamLogo';

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
            <div className="flex items-center gap-3.5">
              <AarogyamLogo size="lg" imgClassName="ring-2 ring-white/50 shadow-xl" />
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-xs bg-[#005ea2] text-white">
                    NATIONAL DIGITAL HEALTH ECOSYSTEM
                  </span>
                  <span className="text-xs text-emerald-300 font-bold hidden sm:inline">
                    • Official Portal
                  </span>
                </div>
                <span className="text-xs text-white/90 font-medium">
                  Health का Digital साथी • One Patient. One Health Timeline.
                </span>
              </div>
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
    </div>
  );
};
