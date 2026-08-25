import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Moon,
  Sun,
  Shield,
  User,
  Stethoscope,
  Building2,
  RefreshCw,
  Globe,
  X,
  Search,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';

import { BhashiniLanguageSelector } from './BhashiniLanguageSelector';
import { AarogyamLogo } from './AarogyamLogo';

export const InstitutionalTopBar: React.FC = () => {
  const { darkMode, toggleDarkMode, resetDemoData } = useApp();
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg'>('md');

  useEffect(() => {
    document.documentElement.classList.remove('font-size-sm', 'font-size-md', 'font-size-lg');
    document.documentElement.classList.add(`font-size-${fontSize}`);
  }, [fontSize]);

  return (
    <header className="w-full text-xs select-none">
      {/* 1. Official Government Top Strip (NIH / Official Portal Pattern) */}
      <div className="bg-[#f0f2f5] border-b border-border px-3 sm:px-6 py-1 text-[11px] text-muted-foreground">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground flex items-center gap-1.5">
              <span className="text-xs">🇮🇳</span> An official digital health platform of the Government of India
            </span>
            <span className="text-muted-foreground text-[10px] hidden sm:inline underline cursor-pointer">
              Here's how you know
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/about" className="hover:text-primary hidden sm:inline text-[11px]">
              Virtual Tour
            </Link>

            {/* Bhashini Language Dropdown in Top Bar */}
            <BhashiniLanguageSelector compact={true} />

            <button
              onClick={toggleDarkMode}
              className="hover:text-primary flex items-center gap-1 text-[11px]"
              title="Toggle Dark Theme"
            >
              {darkMode ? <Sun className="h-3 w-3" /> : <Moon className="h-3 w-3" />}
              <span>{darkMode ? 'Light' : 'Dark Mode'}</span>
            </button>
            <button
              onClick={() => {
                if (window.confirm('Reset all demo patient and clinical records to initial state?')) {
                  resetDemoData();
                }
              }}
              className="hover:text-primary flex items-center gap-1 text-[11px]"
              title="Reset Mock Data"
            >
              <RefreshCw className="h-3 w-3" />
              <span>Reset Data</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. NIH Brand Header (Logo on Left, Search on Right) */}
      <div className="bg-white border-b border-border py-4 px-3 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Logo Badge (Official Aarogyam Emblem + Institutional Geometry) */}
          <Link to="/" className="flex items-center gap-3.5 group">
            <AarogyamLogo size="lg" imgClassName="ring-2 ring-[#004b87]/15 group-hover:scale-105 transition-transform" />
            <div className="border-l border-border pl-3 flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-lg font-black text-[#004b87] tracking-tight">
                  Aarogyam
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  National Health Network
                </span>
              </div>
              <span className="text-[11px] text-muted-foreground font-medium">
                Health का Digital साथी • One Patient. One Health Timeline.
              </span>
            </div>
          </Link>

          {/* Right Search Input Box (NIH Style) */}
          <div className="flex items-center gap-2 max-w-sm w-full">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search Aarogyam records, doctors, vaccines..."
                className="w-full h-9 px-3 rounded-xs border border-border text-xs focus:outline-none focus:border-[#004b87]"
              />
            </div>
            <button className="h-9 px-4 bg-[#004b87] hover:bg-[#003d6e] text-white font-semibold text-xs rounded-xs transition-colors">
              Search
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
