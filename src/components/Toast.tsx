import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, X, AlertCircle, Info } from 'lucide-react';

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

let toastId = 0;

const ToastContainer: {
  removeToast(id: number): unknown;
  addToast: (message: string, type: Toast['type']) => void;
  listeners: Array<(toasts: Toast[]) => void>;
  toasts: Toast[];
} = {
  toasts: [],
  listeners: [],
  addToast(message, type) {
    const id = ++toastId;
    this.toasts = [...this.toasts, { id, message, type }];
    this.listeners.forEach(listener => listener(this.toasts));
    
    // Auto remove after 3 seconds
    setTimeout(() => {
      this.removeToast(id);
    }, 3000);
  },
  removeToast(id: number) {
    this.toasts = this.toasts.filter(t => t.id !== id);
    this.listeners.forEach(listener => listener(this.toasts));
  }
};

export const toast = {
  success: (message: string) => ToastContainer.addToast(message, 'success'),
  error: (message: string) => ToastContainer.addToast(message, 'error'),
  warning: (message: string) => ToastContainer.addToast(message, 'warning'),
  info: (message: string) => ToastContainer.addToast(message, 'info'),
};

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    ToastContainer.listeners.push(setToasts);
    return () => {
      ToastContainer.listeners = ToastContainer.listeners.filter(l => l !== setToasts);
    };
  }, []);

  const getIcon = (type: Toast['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getBorderColor = (type: Toast['type']) => {
    switch (type) {
      case 'success':
        return 'border-green-500';
      case 'error':
        return 'border-red-500';
      case 'warning':
        return 'border-yellow-500';
      case 'info':
        return 'border-blue-500';
    }
  };

  return (
    <>
      {children}
      
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-[9999] space-y-3 max-w-md">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`bg-white dark:bg-gray-800 border-l-4 ${getBorderColor(toast.type)} rounded-lg shadow-lg p-4 flex items-start gap-3 animate-slide-in`}
          >
            {getIcon(toast.type)}
            <p className="flex-1 text-sm text-gray-900 dark:text-white">{toast.message}</p>
            <button
              onClick={() => ToastContainer.removeToast(toast.id)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </>
  );
};

export default ToastContainer;
