import React from 'react';
import { Truck, Phone, MessageSquare, Download } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const TopBar: React.FC = () => {
  const { settings, triggerPwaInstall, isPwaInstallable } = useApp();

  return (
    <div className="bg-[#0F0F0F] border-b border-[#202020] text-xs text-gray-200 py-2 px-3 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1.5 sm:gap-4">
        {/* Main message requested: Entrega grátis para Maputo e Matola */}
        <div className="flex items-center gap-2 font-medium flex-wrap">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#5DD62C] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#5DD62C]"></span>
          </span>
          <span className="text-white font-semibold flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-[#5DD62C]" />
            Entrega grátis para Maputo e Matola
          </span>
          <span className="hidden md:inline text-gray-500">·</span>
          <span className="hidden md:inline text-gray-300">Pagamento no acto da entrega em Meticais (MT)</span>
        </div>

        {/* Contacts & PWA quick install button */}
        <div className="flex items-center gap-3 sm:gap-4 text-[11px] text-gray-300 flex-wrap">
          <a
            href={`tel:${settings.supportPhone}`}
            className="hidden sm:flex items-center gap-1 hover:text-[#5DD62C] transition"
          >
            <Phone className="w-3 h-3 text-[#5DD62C]" />
            <span>{settings.supportPhone}</span>
          </a>
          <a
            href={`https://wa.me/258835466322?text=Olá%20ALMAS-SHOP,%20gostaria%20de%20informações`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-[#5DD62C] hover:text-white transition"
          >
            <MessageSquare className="w-3 h-3" />
            <span className="hidden sm:inline">WhatsApp</span>
          </a>

          {isPwaInstallable && (
            <button
              onClick={triggerPwaInstall}
              className="flex items-center gap-1 bg-[#5DD62C] hover:bg-[#337418] text-[#0F0F0F] hover:text-white px-2.5 py-0.5 rounded-full font-bold transition shadow-sm"
            >
              <Download className="w-3 h-3" />
              <span>Instalar App</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
