import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  Search,
  Menu,
  X,
  Phone,
  Mail,
  ShieldCheck,
  Building2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  User,
  HeartHandshake,
  Activity,
  Award,
} from 'lucide-react';
import { InstitutionalTopBar } from '../common/InstitutionalHeader';
import { Button } from '../common/Button';
import { useAuth } from '../../context/AuthContext';
import { BhashiniLanguageSelector } from '../common/BhashiniLanguageSelector';
import { AarogyamLogo } from '../common/AarogyamLogo';

export const PublicLayout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) setShowScrollTop(true);
      else setShowScrollTop(false);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const nihNavLinks = [
    { label: 'Health Timeline', path: '/patient/timeline', hasDropdown: true },
    { label: 'Doctor Case-Taking', path: '/doctor/case/new', hasDropdown: true },
    { label: 'Vaccines & Immunization', path: '/patient/vaccinations', hasDropdown: true },
    { label: 'Hospital OPD Network', path: '/patient/book-appointment', hasDropdown: true },
    { label: 'Consent & Privacy', path: '/patient/consent', hasDropdown: true },
    { label: 'About Aarogyam', path: '/about', hasDropdown: true },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white text-foreground">
      {/* 1. Top Government & Brand Header */}
      <InstitutionalTopBar />

      {/* 2. NIH Royal Blue Main Navigation Bar */}
      <nav className="nih-nav-bar text-white shadow-xs hidden md:block text-xs font-medium">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-3 sm:px-6">
          <div className="flex items-center space-x-1">
            {nihNavLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3.5 py-3 hover:bg-black/15 transition-colors flex items-center gap-1 text-white text-xs ${isActive ? 'bg-black/20 font-semibold' : ''
                    }`}
                >
                  <span>{link.label}</span>
                  {link.hasDropdown && <ChevronDown className="h-3 w-3 text-white/70" />}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-2.5 py-2 text-[11px]">
            {/* Language Selector to the side of Sign In */}
            <BhashiniLanguageSelector compact={true} />

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  to={
                    user?.role === 'patient'
                      ? '/patient/dashboard'
                      : user?.role === 'doctor'
                        ? '/doctor/dashboard'
                        : '/admin/dashboard'
                  }
                  className="px-2.5 py-1 rounded-xs bg-white/20 hover:bg-white/30 text-white font-semibold"
                >
                  Dashboard ({user?.role})
                </Link>
                <button onClick={logout} className="hover:text-white/80 underline text-[11px]">
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="hover:text-white/80 underline text-[11px] px-1 font-semibold">
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-1 rounded-xs bg-white text-[#004b87] font-bold text-[11px] hover:bg-white/90"
                >
                  Create Health ID
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div className="md:hidden bg-[#004b87] text-white px-4 py-2 flex items-center justify-between">
        <AarogyamLogo size="sm" showText title="Aarogyam" theme="light" />
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-1">
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-[#003d6e] text-white p-4 space-y-2 text-xs">
          {nihNavLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 px-3 rounded hover:bg-white/10"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-white/20 flex flex-col gap-2">
            <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
              <Button size="sm" variant="outline" className="w-full bg-white/10 text-white border-white/30">
                Sign In
              </Button>
            </Link>
            <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
              <Button size="sm" variant="primary" className="w-full bg-white text-[#004b87]">
                Create Health ID
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Main Viewport */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* 3. NIH Multi-Tier Institutional Footer */}
      <footer className="border-t border-border mt-12 text-xs">
        {/* Tier 1: Light Gray Utility Navigation Links */}
        <div className="bg-[#f0f2f5] border-b border-border py-2.5 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center sm:justify-start gap-x-6 gap-y-2 text-[11px] text-[#005ea2]">
            <Link to="/" className="hover:underline">Aarogyam Home</Link>
            <Link to="/help" className="hover:underline">Contact Us</Link>
            <Link to="/about" className="hover:underline">En Español / हिन्दी</Link>
            <Link to="/about" className="hover:underline">Virtual Tour</Link>
            <Link to="/how-it-works" className="hover:underline">Visitor & Citizen Info</Link>
            <Link to="/help" className="hover:underline">FAQs</Link>
            <Link to="/features" className="hover:underline">Clinical Guidelines</Link>
            <Link to="/features" className="hover:underline">Press Room & Archives</Link>
          </div>
        </div>

        {/* Tier 2: Medium Gray Organization Block with Social Icons */}
        <div className="bg-[#e6e8eb] py-8 px-4 sm:px-6 text-[#222222]">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-1 text-xs">
              <h3 className="font-bold text-base text-[#111111] tracking-tight">
                National Institutes of Health & Aarogyam Ecosystem
              </h3>
              <p className="text-muted-foreground text-[11px]">
                New Delhi National Health Gateway • Ministry of Health & Family Welfare
              </p>
              <p className="text-muted-foreground text-[11px] italic pt-1">
                Aarogyam... Turning Discovery & Care Into Long-Term Health®
              </p>
            </div>

            <div className="space-y-2">
              <span className="font-bold text-xs text-foreground uppercase tracking-wider block md:text-right">
                Follow Us
              </span>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-[#333333] text-white flex items-center justify-center font-bold text-xs cursor-pointer hover:bg-[#004b87]">f</div>
                <div className="h-8 w-8 rounded-full bg-[#333333] text-white flex items-center justify-center font-bold text-xs cursor-pointer hover:bg-[#004b87]">𝕏</div>
                <div className="h-8 w-8 rounded-full bg-[#333333] text-white flex items-center justify-center font-bold text-xs cursor-pointer hover:bg-[#004b87]">▶</div>
                <div className="h-8 w-8 rounded-full bg-[#333333] text-white flex items-center justify-center font-bold text-xs cursor-pointer hover:bg-[#004b87]">📷</div>
                <div className="h-8 w-8 rounded-full bg-[#333333] text-white flex items-center justify-center font-bold text-xs cursor-pointer hover:bg-[#004b87]">••</div>
                <div className="h-8 w-8 rounded-full bg-[#333333] text-white flex items-center justify-center font-bold text-xs cursor-pointer hover:bg-[#004b87]">📡</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tier 3: Deep Blue NIH Official Government Strip */}
        <div className="nih-footer-blue py-6 px-4 sm:px-6 text-white text-xs">
          <div className="max-w-7xl mx-auto space-y-4">
            <div className="flex items-center gap-3.5">
              <AarogyamLogo size="md" imgClassName="ring-2 ring-white/30" />
              <div className="text-[11px] text-white/90">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-white">Aarogyam</span>
                  <span className="font-mono text-white/70">www.aarogyam.gov.in</span>
                </div>
                <span className="block text-white/75">Health का Digital साथी • An official digital health mission of the Ministry of Health & Family Welfare</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-white/80 pt-2 border-t border-white/10">
              <Link to="/about" className="hover:underline">Privacy Policy</Link>
              <Link to="/about" className="hover:underline">Accessibility Statement</Link>
              <Link to="/about" className="hover:underline">Freedom of Information</Link>
              <Link to="/about" className="hover:underline">Vulnerability Disclosure</Link>
              <Link to="/about" className="hover:underline">Disclaimers & Safety</Link>
              <Link to="/about" className="hover:underline">Patient Rights Charter</Link>
              <Link to="/about" className="hover:underline">Grievance Officer</Link>
              <Link to="/about" className="hover:underline">Non-Discrimination Notice</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Circular Scroll to Top Button (NIH Exact Pattern in Screenshot) */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="nih-scroll-top"
          aria-label="Scroll to top"
          title="Back to top"
        >
          <ChevronUp className="h-5 w-5" />
        </button>
      )}
    </div>
  );
};
