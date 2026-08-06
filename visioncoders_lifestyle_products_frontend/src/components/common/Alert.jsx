import React from 'react';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

export default function Alert({ type = 'info', message, onClose }) {
  if (!message) return null;

  const styles = {
    info: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-300',
    success: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300',
    error: 'bg-rose-500/10 border-rose-500/20 text-rose-300',
    warning: 'bg-amber-500/10 border-amber-500/20 text-amber-300',
  };

  const icons = {
    info: <Info size={18} />,
    success: <CheckCircle size={18} />,
    error: <AlertCircle size={18} />,
    warning: <AlertCircle size={18} />,
  };

  return (
    <div
      className={`flex items-center justify-between gap-3 p-4 rounded-xl border text-sm font-medium animate-fadeIn mb-4 ${styles[type] || styles.info}`}
      role="alert"
    >
      <div className="flex items-center gap-2">
        {icons[type]}
        <span>{message}</span>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="p-1 hover:bg-white/5 rounded-lg transition text-inherit cursor-pointer"
          aria-label="Dismiss"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
