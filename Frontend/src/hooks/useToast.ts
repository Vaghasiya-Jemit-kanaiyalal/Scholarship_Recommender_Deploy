import { useState } from 'react';
import { ToastMessage } from '../components/Toast';

export const useToast = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (
    message: string,
    type: 'success' | 'error' | 'info' | 'warning' = 'info',
    emoji?: string
  ) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type, emoji }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const showSuccess = (message: string, emoji: string = '✅') => {
    addToast(message, 'success', emoji);
  };

  const showError = (message: string, emoji: string = '❌') => {
    addToast(message, 'error', emoji);
  };

  const showInfo = (message: string, emoji: string = 'ℹ️') => {
    addToast(message, 'info', emoji);
  };

  const showWarning = (message: string, emoji: string = '⚠️') => {
    addToast(message, 'warning', emoji);
  };

  return {
    toasts,
    removeToast,
    showSuccess,
    showError,
    showInfo,
    showWarning,
  };
};
