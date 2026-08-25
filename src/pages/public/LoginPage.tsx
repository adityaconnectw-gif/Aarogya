import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Stethoscope, Building2, Lock, Mail, ArrowRight, ShieldCheck, Globe } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/common/Card';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/common/Toast';
import { UserRole } from '../../types';
import { BhashiniLanguageSelector, LanguageOption } from '../../components/common/BhashiniLanguageSelector';
import { AarogyamLogo } from '../../components/common/AarogyamLogo';

export const LoginPage: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('patient');
  const [emailOrPhone, setEmailOrPhone] = useState('aditya@demo.health');
  const [password, setPassword] = useState('demo123');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleLanguageChange = (lang: LanguageOption) => {
    setSelectedLanguage(lang.code);
    showToast(`Language switched to ${lang.name} (${lang.nativeName})`, 'info');
  };

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    if (role === 'patient') {
      setEmailOrPhone('aditya@demo.health');
      setPassword('demo123');
    } else if (role === 'doctor') {
      setEmailOrPhone('doctor@demo.health');
      setPassword('demo123');
    } else {
      setEmailOrPhone('admin@demo.health');
      setPassword('demo123');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrPhone || !password) {
      showToast('Please enter your email/phone and password.', 'warning');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      login(emailOrPhone, selectedRole);
      setLoading(false);
      showToast(`Logged in successfully as ${selectedRole.toUpperCase()}`, 'success');

      if (selectedRole === 'patient') navigate('/patient/dashboard');
      else if (selectedRole === 'doctor') navigate('/doctor/dashboard');
      else navigate('/admin/dashboard');
    }, 400);
  };

  return (
    <div className="min-h-[calc(100vh-180px)] flex items-center justify-center px-4 py-12 bg-background">
      <div className="w-full max-w-md space-y-6">
        {/* Header Title */}
        <div className="text-center space-y-2 flex flex-col items-center">
          <AarogyamLogo size="xl" className="mb-1" />
          <div>
            <h1 className="text-xl font-bold text-foreground tracking-tight">
              Institutional Health Access Portal
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Sign in to access your longitudinal health records and clinical ecosystem
            </p>
          </div>
        </div>

        {/* Top Header & Role Picker Strip */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
            Select Role:
          </span>
          <BhashiniLanguageSelector
            selectedLang={selectedLanguage}
            onSelectLang={handleLanguageChange}
            compact={true}
          />
        </div>

        <div className="grid grid-cols-3 gap-1.5 p-1 bg-surface-alt rounded-lg border border-border">
          <button
            type="button"
            onClick={() => handleRoleSelect('patient')}
            className={`py-2 px-3 rounded-md text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
              selectedRole === 'patient'
                ? 'bg-surface text-primary border border-border shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <User className="h-4 w-4" />
            <span>Patient</span>
          </button>
          <button
            type="button"
            onClick={() => handleRoleSelect('doctor')}
            className={`py-2 px-3 rounded-md text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
              selectedRole === 'doctor'
                ? 'bg-surface text-primary border border-border shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Stethoscope className="h-4 w-4" />
            <span>Doctor</span>
          </button>
          <button
            type="button"
            onClick={() => handleRoleSelect('admin')}
            className={`py-2 px-3 rounded-md text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
              selectedRole === 'admin'
                ? 'bg-surface text-primary border border-border shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Building2 className="h-4 w-4" />
            <span>Admin</span>
          </button>
        </div>

        {/* Main Login Card */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle>
                {selectedRole === 'patient'
                  ? 'Patient Login'
                  : selectedRole === 'doctor'
                  ? 'Practitioner Portal Login'
                  : 'Hospital Administration Login'}
              </CardTitle>
              <CardDescription>
                Enter your credentials or click any demo account below
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  Email or Registered Mobile Number
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    placeholder="e.g. aditya@demo.health or +91 98765 43210"
                    required
                    className="w-full h-9 pl-9 pr-3 text-xs bg-surface border border-input rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-medium text-foreground">Password</label>
                  <Link
                    to="/forgot-password"
                    className="text-[11px] text-primary hover:underline font-medium"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full h-9 pl-9 pr-3 text-xs bg-surface border border-input rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-3.5 w-3.5 rounded border-input text-primary focus:ring-ring"
                  />
                  <span>Remember this terminal</span>
                </label>
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full"
                isLoading={loading}
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                Sign In to {selectedRole === 'patient' ? 'Patient Portal' : selectedRole === 'doctor' ? 'Doctor Portal' : 'Admin Portal'}
              </Button>
            </form>

            {/* Quick Demo Credentials helper */}
            <div className="mt-5 pt-4 border-t border-border space-y-2">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                Preset Demo Credentials:
              </span>
              <div className="grid grid-cols-3 gap-1.5 text-[11px]">
                <button
                  type="button"
                  onClick={() => handleRoleSelect('patient')}
                  className="p-1.5 rounded bg-surface-alt border border-border text-left hover:border-primary transition-colors"
                >
                  <span className="font-semibold block text-foreground">Patient</span>
                  <span className="text-[10px] text-muted-foreground truncate block">aditya@demo.health</span>
                  <span className="text-[10px] text-primary font-mono">demo123</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleSelect('doctor')}
                  className="p-1.5 rounded bg-surface-alt border border-border text-left hover:border-primary transition-colors"
                >
                  <span className="font-semibold block text-foreground">Doctor</span>
                  <span className="text-[10px] text-muted-foreground truncate block">doctor@demo.health</span>
                  <span className="text-[10px] text-primary font-mono">demo123</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleSelect('admin')}
                  className="p-1.5 rounded bg-surface-alt border border-border text-left hover:border-primary transition-colors"
                >
                  <span className="font-semibold block text-foreground">Admin</span>
                  <span className="text-[10px] text-muted-foreground truncate block">admin@demo.health</span>
                  <span className="text-[10px] text-primary font-mono">demo123</span>
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bottom register link */}
        <div className="text-center text-xs text-muted-foreground">
          Don't have a verified Health ID yet?{' '}
          <Link to="/register" className="font-semibold text-primary hover:underline">
            Register New Profile
          </Link>
        </div>
      </div>
    </div>
  );
};
