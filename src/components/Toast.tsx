import React, { useEffect } from 'react';

interface ToastProps {
  message: string | null;
  onClose: () => void;
  type?: 'success' | 'warning' | 'error' | 'info';
}

export const Toast: React.FC<ToastProps> = ({ message, onClose, type = 'success' }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, 3200);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 transform transition-all duration-300 flex items-center gap-space-sm bg-inverse-surface text-inverse-on-surface px-space-lg py-space-md rounded-xl shadow-xl font-body-sm text-body-sm animate-in fade-in slide-in-from-bottom-5">
      <span className="material-symbols-outlined text-secondary-fixed text-[20px]">
        {type === 'error' ? 'error' : type === 'warning' ? 'warning' : 'check_circle'}
      </span>
      <span>{message}</span>
      <button
        type="button"
        onClick={onClose}
        className="ml-2 text-surface-dim hover:text-white transition-colors"
      >
        <span className="material-symbols-outlined text-[16px]">close</span>
      </button>
    </div>
  );
};
