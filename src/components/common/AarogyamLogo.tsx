import React from 'react';

const logoImg = '/aarogyam-logo.png';

export interface AarogyamLogoProps {
  /** Size preset for the circular emblem */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'hero';
  /** Whether to show text next to or below the logo */
  showText?: boolean;
  /** Custom title text override (defaults to Aarogyam) */
  title?: string;
  /** Subtitle text (defaults to 'Health का Digital साथी' or institutional tagline) */
  subtitle?: string;
  /** Layout direction when text is shown */
  layout?: 'horizontal' | 'vertical';
  /** Extra container class */
  className?: string;
  /** Extra image class */
  imgClassName?: string;
  /** Color theme for text when rendered on dark or light backgrounds */
  theme?: 'auto' | 'dark' | 'light';
  /** Click handler or link */
  onClick?: () => void;
}

const sizeMap = {
  xs: { img: 'h-6 w-6', title: 'text-xs', subtitle: 'text-[9px]' },
  sm: { img: 'h-8 w-8', title: 'text-sm', subtitle: 'text-[10px]' },
  md: { img: 'h-10 w-10', title: 'text-base', subtitle: 'text-[11px]' },
  lg: { img: 'h-12 w-12', title: 'text-lg', subtitle: 'text-xs' },
  xl: { img: 'h-16 w-16', title: 'text-xl', subtitle: 'text-xs' },
  '2xl': { img: 'h-20 w-20', title: 'text-2xl', subtitle: 'text-sm' },
  hero: { img: 'h-24 w-24 sm:h-28 sm:w-28', title: 'text-2xl sm:text-3xl', subtitle: 'text-sm' },
};

export const AarogyamLogo: React.FC<AarogyamLogoProps> = ({
  size = 'md',
  showText = false,
  title = 'Aarogyam',
  subtitle,
  layout = 'horizontal',
  className = '',
  imgClassName = '',
  theme = 'auto',
  onClick,
}) => {
  const currentSize = sizeMap[size] || sizeMap.md;

  const titleColor =
    theme === 'light'
      ? 'text-white'
      : theme === 'dark'
      ? 'text-slate-900 dark:text-white'
      : 'text-foreground';

  const subtitleColor =
    theme === 'light'
      ? 'text-white/80'
      : theme === 'dark'
      ? 'text-slate-600 dark:text-slate-300'
      : 'text-muted-foreground';

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center select-none ${
        layout === 'vertical' ? 'flex-col text-center gap-2' : 'gap-2.5'
      } ${className}`}
    >
      <div className="relative shrink-0 flex items-center justify-center">
        <img
          src={logoImg}
          alt="Aarogyam Logo - Health का Digital साथी"
          className={`object-contain rounded-full bg-white shadow-xs drop-shadow-xs transition-transform duration-200 hover:scale-105 ${currentSize.img} ${imgClassName}`}
          loading="eager"
        />
      </div>

      {showText && (
        <div className={`flex flex-col leading-tight ${layout === 'vertical' ? 'items-center' : 'text-left'}`}>
          <span className={`font-black tracking-tight ${titleColor} ${currentSize.title}`}>
            {title}
          </span>
          {subtitle && (
            <span className={`font-medium tracking-normal ${subtitleColor} ${currentSize.subtitle}`}>
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
