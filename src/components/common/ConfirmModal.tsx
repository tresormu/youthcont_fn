import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle2, X } from 'lucide-react';
import type { ReactNode } from 'react';

interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'confirm';
  loading?: boolean;
  children?: ReactNode;
}

export function ConfirmModal({
  open, onClose, onConfirm, title, message,
  confirmLabel = 'Confirm', cancelLabel = 'Cancel',
  variant = 'confirm', loading = false, children
}: ConfirmModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-primary/20 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="relative w-full max-w-md bg-white rounded-[2.5rem] p-10 shadow-2xl overflow-hidden"
          >
            <div className={`absolute top-0 left-0 right-0 h-1.5 ${variant === 'danger' ? 'bg-destructive' : 'bg-accent'}`} />

            <button
              onClick={onClose}
              className="absolute top-6 right-6 w-9 h-9 rounded-xl bg-secondary flex items-center justify-center text-primary/30 hover:text-primary transition-colors"
            >
              <X size={16} />
            </button>

            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${variant === 'danger' ? 'bg-destructive/10 text-destructive' : 'bg-accent/10 text-accent'}`}>
              {variant === 'danger' ? <AlertTriangle size={28} /> : <CheckCircle2 size={28} />}
            </div>

            <h2 className="text-2xl font-black text-primary mb-2">{title}</h2>
            <p className="text-sm font-medium text-primary/50 mb-8 leading-relaxed">{message}</p>

            {children ? children : (
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 py-4 rounded-2xl font-black text-sm text-primary/40 hover:bg-secondary transition-all"
                >
                  {cancelLabel}
                </button>
                <button
                  onClick={onConfirm}
                  disabled={loading}
                  className={`flex-[2] py-4 rounded-2xl font-black text-sm text-white transition-all disabled:opacity-50 shadow-lg
                    ${variant === 'danger' ? 'bg-destructive hover:bg-destructive/90 shadow-destructive/20' : 'bg-accent hover:bg-accent/90 shadow-accent/20'}`}
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
                  ) : confirmLabel}
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
