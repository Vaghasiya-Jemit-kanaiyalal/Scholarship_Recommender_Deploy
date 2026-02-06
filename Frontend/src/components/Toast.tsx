import React, { useEffect } from 'react';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  emoji?: string;
}

interface ToastProps {
  toast: ToastMessage;
  onClose: (id: string) => void;
}

const defaultEmojis: Record<string, string> = {
  success: '✅',
  error: '❌',
  info: 'ℹ️',
  warning: '⚠️',
};

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id);
    }, 3000);

    return () => clearTimeout(timer);
  }, [toast.id, onClose]);

  const emoji = toast.emoji || defaultEmojis[toast.type];

  return (
    <div className={`toast toast-${toast.type}`}>
      <span className="toast-emoji">{emoji}</span>
      <span className="toast-message">{toast.message}</span>
      <button 
        className="toast-close"
        onClick={() => onClose(toast.id)}
        aria-label="Close notification"
      >
        ✕
      </button>
    </div>
  );
};

export const ToastContainer: React.FC<{
  toasts: ToastMessage[];
  onClose: (id: string) => void;
}> = ({ toasts, onClose }) => {
  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onClose={onClose} />
      ))}
    </div>
  );
};
