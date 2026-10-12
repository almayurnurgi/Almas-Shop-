import React, { useState } from 'react';
import { Download, X, Smartphone, CheckCircle, Bell } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const PwaInstallBanner: React.FC = () => {
  const { isPwaInstallable, triggerPwaInstall, flashBanner, setFlashBanner } = useApp();
  const [dismissed, setDismissed] = useState(false);

  // Auto-dismiss toast messages after ~4 seconds
  React.useEffect(() => {
    if (flashBanner) {
      const timer = setTimeout(() => {
        setFlashBanner(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [flashBanner, setFlashBanner]);

  return (
    <>
      {/* Flash Banner for notifications */}
      {flashBanner && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 max-w-md w-full px-4 animate-in slide-in-from-top-4 duration-200">
          <div
            className={`p-3.5 rounded-2xl shadow-xl border flex items-center justify-between gap-3 text-sm ${
              flashBanner.type === 'success'
                ? 'bg-white border-[#5DD62C] text-[#0F0F0F]'
                : flashBanner.type === 'warning'
                ? 'bg-amber-50 border-amber-400 text-amber-900'
                : flashBanner.type === 'error'
                ? 'bg-rose-50 border-rose-400 text-rose-900'
                : 'bg-white border-gray-200 text-[#0F0F0F]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {flashBanner.type === 'success' && <CheckCircle className="w-4 h-4 text-[#337418]" />}
              {flashBanner.type === 'info' && <Bell className="w-4 h-4 text-[#337418]" />}
              <span className="font-semibold text-xs sm:text-sm">{flashBanner.message}</span>
            </div>
            <button
              onClick={() => setFlashBanner(null)}
              className="text-gray-400 hover:text-[#0F0F0F] p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Persistent PWA Install Prompt card if installable and not dismissed */}
      {isPwaInstallable && !dismissed && (
        <div className="fixed bottom-20 md:bottom-6 right-4 z-40 max-w-sm w-[calc(100%-2rem)] sm:w-auto bg-white border border-gray-200 rounded-2xl p-4 shadow-xl animate-in fade-in duration-300">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#5DD62C]/20 rounded-xl border border-[#5DD62C]/40 text-[#337418]">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#0F0F0F]">Instalar ALMAS-SHOP</h4>
                <p className="text-[11px] text-gray-500">
                  Acesso rápido e compras offline no seu celular, tablet ou PC.
                </p>
              </div>
            </div>
            <button
              onClick={() => setDismissed(true)}
              className="text-gray-400 hover:text-[#0F0F0F] p-1 -mr-1 -mt-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={triggerPwaInstall}
              className="flex-1 bg-[#5DD62C] hover:bg-[#337418] text-[#0F0F0F] hover:text-white font-bold text-xs py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              Instalar Agora
            </button>
            <button
              onClick={() => setDismissed(true)}
              className="text-xs text-gray-500 hover:text-[#0F0F0F] py-2 px-3 rounded-xl"
            >
              Depois
            </button>
          </div>
        </div>
      )}
    </>
  );
};
