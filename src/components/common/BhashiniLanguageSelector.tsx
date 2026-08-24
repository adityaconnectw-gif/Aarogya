import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check, Sparkles } from 'lucide-react';

export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
}

export const INDIAN_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া' },
  { code: 'kok', name: 'Goan Konkani', nativeName: 'गोवा कोंकणी' },
  { code: 'ks', name: 'Kashmiri', nativeName: 'कश्मीरी' },
  { code: 'mai', name: 'Maithili', nativeName: 'मैथिली' },
  { code: 'sa', name: 'Sanskrit', nativeName: 'संस्कृतम्' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو' },
];

interface Props {
  selectedLang?: string;
  onSelectLang?: (lang: LanguageOption) => void;
  compact?: boolean;
}

export const BhashiniLanguageSelector: React.FC<Props> = ({
  selectedLang = 'en',
  onSelectLang,
  compact = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentCode, setCurrentCode] = useState(selectedLang);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentCode(selectedLang);
  }, [selectedLang]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentOption =
    INDIAN_LANGUAGES.find((l) => l.code === currentCode) || INDIAN_LANGUAGES[0];

  const handleSelect = (lang: LanguageOption) => {
    setCurrentCode(lang.code);
    if (onSelectLang) onSelectLang(lang);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Trigger Button with iconic Bhashini 'अ / A' icon */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded border text-xs font-semibold transition-all ${
          compact
            ? 'bg-surface hover:bg-surface-alt border-border text-foreground'
            : 'bg-white hover:bg-slate-50 border-[#004b87]/30 text-[#004b87] shadow-2xs'
        }`}
        aria-label="Select Language"
        title="Select National Language (BHASHINI)"
      >
        <span className="font-hindi font-bold text-xs">अ</span>
        <span className="text-[10px] text-muted-foreground font-mono">/</span>
        <span className="font-bold text-xs">A</span>
        <span className="ml-1 text-[11px] font-medium hidden sm:inline">
          {currentOption.nativeName}
        </span>
        <ChevronDown className="h-3 w-3 text-muted-foreground ml-0.5" />
      </button>

      {/* Dropdown Menu (Exact Bhashini design with native script list & footer) */}
      {isOpen && (
        <div className="absolute right-0 mt-1 w-64 rounded bg-surface border border-border shadow-elevated z-50 animate-slide-up text-xs overflow-hidden">
          {/* Header */}
          <div className="px-3 py-2 bg-surface-alt/70 border-b border-border flex items-center justify-between">
            <span className="font-bold text-foreground text-[11px] uppercase tracking-wider flex items-center gap-1">
              <Globe className="h-3.5 w-3.5 text-primary" /> Select Language / भाषा
            </span>
            <span className="text-[10px] text-muted-foreground">22 Official</span>
          </div>

          {/* Languages Scrollable List */}
          <div className="max-h-60 overflow-y-auto divide-y divide-border/40 py-1">
            {INDIAN_LANGUAGES.map((lang) => {
              const isSelected = lang.code === currentCode;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleSelect(lang)}
                  className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-surface-alt transition-colors ${
                    isSelected ? 'bg-primary-muted text-primary font-bold' : 'text-foreground'
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold leading-tight">
                      {lang.name} ({lang.nativeName})
                    </span>
                  </div>
                  {isSelected && <Check className="h-3.5 w-3.5 text-primary shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Authentic Bhashini Bottom Branding Stamp */}
          <div className="p-2 bg-[#f8f9fa] dark:bg-black/30 border-t border-border flex items-center justify-center gap-2 text-[10px] text-muted-foreground">
            <span>Powered by</span>
            <div className="flex items-center gap-1 font-bold text-foreground">
              <span className="h-2 w-2 rounded-full bg-gradient-to-r from-orange-500 via-white to-green-600 border border-black/20 inline-block" />
              <span className="tracking-wider uppercase text-[#004b87] font-extrabold text-[11px]">
                BHASHINI
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
