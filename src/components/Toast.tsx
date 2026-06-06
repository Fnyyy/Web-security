// eslint-disable-next-line -- Intentional: mixed hook+component module (context pattern)
import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, AlertTriangle, X } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
export interface ToastItem {
  id: string;
  title: string;
  message: string;
  variant?: 'success' | 'warning' | 'info';
}

interface ToastContextValue {
  showToast: (title: string, message: string, variant?: ToastItem['variant']) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}

// ─── Provider + Renderer ──────────────────────────────────────────────────────
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
    const timer = timers.current.get(id);
    if (timer) { clearTimeout(timer); timers.current.delete(id); }
  }, []);

  const showToast = useCallback((title: string, message: string, variant: ToastItem['variant'] = 'success') => {
    const id = Math.random().toString(36).slice(2);
    setToasts(prev => [...prev.slice(-4), { id, title, message, variant }]); // max 5 at once
    const timer = setTimeout(() => dismiss(id), 3000);
    timers.current.set(id, timer);
  }, [dismiss]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Portal-like stack — fixed bottom-right */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none" aria-live="polite">
        <AnimatePresence mode="sync">
          {toasts.map((toast) => {
            const { id, ...rest } = toast;
            return <ToastCard key={id} toast={{ id, ...rest }} onDismiss={dismiss} />;
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

// ─── Single Card ──────────────────────────────────────────────────────────────
interface ToastCardProps {
  key?: React.Key;
  toast: ToastItem;
  onDismiss: (id: string) => void;
}
function ToastCard({ toast, onDismiss }: ToastCardProps) {
  const accent =
    toast.variant === 'warning' ? 'rgba(245,158,11,1)' :
    toast.variant === 'info'    ? 'rgba(99,102,241,1)' :
                                  'rgba(34,211,238,1)';

  const borderColor =
    toast.variant === 'warning' ? 'rgba(245,158,11,0.35)' :
    toast.variant === 'info'    ? 'rgba(99,102,241,0.35)' :
                                  'rgba(34,211,238,0.35)';

  const Icon =
    toast.variant === 'warning' ? AlertTriangle : CheckCircle;

  return (
    <motion.div
      initial={{ opacity: 0, x: 60, scale: 0.9 }}
      animate={{ opacity: 1, x: 0,  scale: 1   }}
      exit={{    opacity: 0, x: 60, scale: 0.9, transition: { duration: 0.2 } }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className="pointer-events-auto w-72 rounded-xl overflow-hidden"
      style={{
        background: 'rgba(8, 15, 35, 0.85)',
        backdropFilter: 'blur(24px)',
        border: `1px solid ${borderColor}`,
        boxShadow: `0 0 24px rgba(0,0,0,0.5), 0 0 0 1px ${borderColor}`,
      }}
    >
      {/* Top accent bar */}
      <div className="h-0.5 w-full" style={{ background: accent, boxShadow: `0 0 8px ${accent}` }} />

      <div className="flex items-start gap-3 p-4">
        <Icon className="w-4 h-4 mt-0.5 shrink-0" style={{ color: accent }} />
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold font-mono tracking-[0.15em] uppercase" style={{ color: accent }}>
            {toast.title}
          </p>
          <p className="text-[11px] text-slate-300 mt-0.5 font-mono leading-snug">
            {toast.message}
          </p>
        </div>
        <button
          onClick={() => onDismiss(toast.id)}
          className="shrink-0 text-slate-500 hover:text-slate-300 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Progress bar */}
      <div className="h-0.5 mx-4 mb-3 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: accent, opacity: 0.6 }}
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: 3, ease: 'linear' }}
        />
      </div>
    </motion.div>
  );
}
