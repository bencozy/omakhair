'use client';

import { useState, useEffect } from 'react';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    // Listen for custom toast events
    const handleToast = (event: CustomEvent) => {
      const { message, type = 'info' } = event.detail;
      const id = Math.random().toString(36).substr(2, 9);
      
      setToasts(prev => [...prev, { id, message, type }]);
      
      // Auto remove after 5 seconds
      setTimeout(() => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
      }, 5000);
    };

    window.addEventListener('toast', handleToast as EventListener);
    return () => window.removeEventListener('toast', handleToast as EventListener);
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`max-w-sm p-4 rounded-lg shadow-lg text-white ${
            toast.type === 'success' ? 'bg-green-600' :
            toast.type === 'error' ? 'bg-red-600' :
            'bg-blue-600'
          }`}
        >
          <p className="text-sm">{toast.message}</p>
        </div>
      ))}
    </div>
  );
}

// Helper function to trigger toasts
export function toast(message: string, type: 'success' | 'error' | 'info' = 'info') {
  window.dispatchEvent(new CustomEvent('toast', { 
    detail: { message, type } 
  }));
}
