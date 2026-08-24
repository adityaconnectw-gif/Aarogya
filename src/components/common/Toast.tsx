import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'warning' | 'error' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3 rounded-md border shadow-elevated bg-surface text-foreground animate-slide-up text-xs sm:text-sm ${
              toast.type === 'success'
                ? 'border-emerald-500/40 bg-emerald-50/90 dark:bg-emerald-950/90 text-emerald-900 dark:text-emerald-100'
                : toast.type === 'warning'
                ? 'border-amber-500/40 bg-amber-50/90 dark:bg-amber-950/90 text-amber-900 dark:text-amber-100'
                : toast.type === 'error'
                ? 'border-rose-500/40 bg-rose-50/90 dark:bg-rose-950/90 text-rose-900 dark:text-rose-100'
                : 'border-sky-500/40 bg-sky-50/90 dark:bg-sky-950/90 text-sky-900 dark:text-sky-100'
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {toast.type === 'success' && <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />}
              {toast.type === 'warning' && <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />}
              {toast.type === 'error' && <AlertCircle className="h-4 w-4 text-rose-600 dark:text-rose-400" />}
              {toast.type === 'info' && <Info className="h-4 w-4 text-sky-600 dark:text-sky-400" />}
            </div>
            <p className="flex-1 font-medium">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 p-0.5 rounded text-current opacity-60 hover:opacity-100 focus:outline-none"
              aria-label="Dismiss toast"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
