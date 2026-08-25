import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, User, Phone, Mail, MapPin, Calendar, Heart, ArrowRight, Globe } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/common/Card';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../components/common/Toast';
import { BhashiniLanguageSelector, LanguageOption } from '../../components/common/BhashiniLanguageSelector';
import { AarogyamLogo } from '../../components/common/AarogyamLogo';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { updatePatient } = useApp();
  const { showToast } = useToast();
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  const handleLanguageChange = (lang: LanguageOption) => {
    setSelectedLanguage(lang.code);
    showToast(`Form language set to ${lang.name} (${lang.nativeName})`, 'info');
  };

  const [formData, setFormData] = useState({
    fullName: 'Aditya Verma',
    dob: '2005-04-14',
    gender: 'Male',
    bloodGroup: 'B+',
    phone: '+91 98765 43210',
    email: 'aditya@demo.health',
    address: 'Sector 14, New Delhi - 110001',
    emergencyContactName: 'Neha Verma',
    emergencyContactPhone: '+91 98765 01234',
    agreedConsent: true,
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agreedConsent) {
      showToast('Please agree to the digital consent and privacy terms.', 'warning');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      updatePatient({
        name: formData.fullName,
        dob: formData.dob,
        gender: formData.gender as any,
        bloodGroup: formData.bloodGroup,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        emergencyContact: {
          name: formData.emergencyContactName,
          relationship: 'Family Contact',
          phone: formData.emergencyContactPhone,
        },
      });

      login(formData.email, 'patient');
      setLoading(false);
      showToast('Health ID generated successfully! Welcome to Aarogyam.', 'success');
      navigate('/patient/dashboard');
    }, 600);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="space-y-6">
        <div className="text-center space-y-2 flex flex-col items-center">
          <AarogyamLogo size="xl" className="mb-1" />
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
              Create Verified Patient Health ID
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Generate your unified patient identity to connect and synchronize records across healthcare providers.
            </p>
          </div>
        </div>

        {/* Demo Identity Banner */}
        <div className="p-3.5 rounded-md border border-primary/20 bg-primary-muted text-xs text-primary flex items-start gap-2.5">
          <ShieldCheck className="h-4 w-4 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-semibold block">Privacy-First Identity Verification</span>
            <span className="text-[11px] opacity-90 block">
              This demo utilizes synthetic institutional identity tokens (e.g. ABDM-9821-4402-1190). Real biometric identification is not required.
            </span>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between w-full">
              <div>
                <CardTitle>Personal & Medical Demographics</CardTitle>
                <CardDescription>Official citizen identity details for longitudinal timeline indexing</CardDescription>
              </div>

              <BhashiniLanguageSelector
                selectedLang={selectedLanguage}
                onSelectLang={handleLanguageChange}
                compact={true}
              />
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">
                    Full Legal Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="Aditya Verma"
                      className="w-full h-9 pl-9 pr-3 text-xs bg-surface border border-input rounded-md text-foreground focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">
                    Date of Birth *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                      type="date"
                      required
                      value={formData.dob}
                      onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                      className="w-full h-9 pl-9 pr-3 text-xs bg-surface border border-input rounded-md text-foreground focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">
                    Gender *
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full h-9 px-3 text-xs bg-surface border border-input rounded-md text-foreground focus:ring-2 focus:ring-ring"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">
                    Blood Group *
                  </label>
                  <select
                    value={formData.bloodGroup}
                    onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                    className="w-full h-9 px-3 text-xs bg-surface border border-input rounded-md text-foreground focus:ring-2 focus:ring-ring"
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">
                    Mobile Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full h-9 pl-9 pr-3 text-xs bg-surface border border-input rounded-md text-foreground focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="aditya@demo.health"
                      className="w-full h-9 pl-9 pr-3 text-xs bg-surface border border-input rounded-md text-foreground focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  Residential Address
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Street address, City, Pincode"
                    className="w-full h-9 pl-9 pr-3 text-xs bg-surface border border-input rounded-md text-foreground focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="p-3 rounded-md bg-surface-alt/60 border border-border space-y-3">
                <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Heart className="h-3.5 w-3.5 text-rose-600" />
                  Emergency Contact Details
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-muted-foreground mb-1">
                      Contact Name
                    </label>
                    <input
                      type="text"
                      value={formData.emergencyContactName}
                      onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                      placeholder="e.g. Neha Verma (Mother)"
                      className="w-full h-8 px-3 text-xs bg-surface border border-input rounded text-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-muted-foreground mb-1">
                      Contact Phone
                    </label>
                    <input
                      type="tel"
                      value={formData.emergencyContactPhone}
                      onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                      placeholder="+91 98765 01234"
                      className="w-full h-8 px-3 text-xs bg-surface border border-input rounded text-foreground"
                    />
                  </div>
                </div>
              </div>

              {/* Consent check */}
              <div className="pt-2">
                <label className="flex items-start gap-2.5 text-xs text-muted-foreground cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.agreedConsent}
                    onChange={(e) => setFormData({ ...formData, agreedConsent: e.target.checked })}
                    className="mt-0.5 h-3.5 w-3.5 rounded border-input text-primary focus:ring-ring"
                  />
                  <span>
                    I authorize the creation of my digital patient identity and agree to the institutional consent framework. I understand that I retain full control to grant, modify, and revoke doctor record access at any time.
                  </span>
                </label>
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full"
                isLoading={loading}
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                Generate Health ID & Enter Portal
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center text-xs text-muted-foreground">
          Already have a Health ID?{' '}
          <Link to="/login" className="font-semibold text-primary hover:underline">
            Sign In to Existing Profile
          </Link>
        </div>
      </div>
    </div>
  );
};
