'use client';
import { Sparkle, X } from 'lucide-react';
import { createContext, useCallback, useContext, useState } from 'react';

type ToastType = 'success' | 'info' | 'error';

type ToastState = {
  show: boolean;
  message: string;
  type: ToastType;
};

type ToastContextValue = {
  show: (message: string, type?: ToastType) => void;
};

const ToastCtx = createContext<ToastContextValue>({ show: () => {} });

export const useToast = () => useContext(ToastCtx);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ToastState>({ show: false, message: '', type: 'success' });

  const show = useCallback((message: string, type: ToastType = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast((s) => ({ ...s, show: false })), 4000);
  }, []);

  return (
    <ToastCtx.Provider value={{ show }}>
      {children}
      {toast.show && (
        <div className="fixed bottom-6 right-6 z-50">
          <div
            className={`p-4 rounded-2xl shadow-2xl border flex items-center gap-3 text-sm font-bold ${
              toast.type === 'success'
                ? 'bg-emerald-500 text-white border-emerald-400'
                : toast.type === 'info'
                  ? 'bg-zinc-900 text-white border-zinc-700'
                  : 'bg-red-500 text-white border-red-400'
            }`}
          >
            <Sparkle className="w-4 h-4 text-amber-400" />
            <span>{toast.message}</span>
            <button
              type="button"
              onClick={() => setToast((s) => ({ ...s, show: false }))}
              className="ml-2 hover:opacity-80"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </ToastCtx.Provider>
  );
}
