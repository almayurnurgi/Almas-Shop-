import React from 'react';
import { ShieldAlert, Mail, Phone, MessageSquare, LogOut } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const BannedAccountNotice: React.FC = () => {
  const { currentUser, switchUserRole, settings } = useApp();

  if (!currentUser?.isBanned) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#0F0F0F]/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white border border-rose-300 rounded-3xl p-6 shadow-2xl text-center">
        <div className="w-14 h-14 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="w-8 h-8 text-rose-600" />
        </div>

        <h2 className="text-xl font-bold text-[#0F0F0F] mb-1">Acesso à Conta Suspenso</h2>
        <p className="text-xs text-rose-700 font-semibold mb-4">
          Status: CONTA BLOQUEADA PELO ADMINISTRADOR
        </p>

        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-3 text-xs text-left mb-6">
          <p className="text-[#337418] font-bold mb-1">Motivo do Bloqueio:</p>
          <p className="text-gray-700">
            {currentUser.banReason || 'Violação dos termos de uso da plataforma ALMAS-SHOP.'}
          </p>
          {currentUser.bannedAt && (
            <p className="text-[10px] text-gray-400 mt-2">
              Data: {new Date(currentUser.bannedAt).toLocaleString('pt-PT')}
            </p>
          )}
        </div>

        <p className="text-xs text-gray-600 mb-6">
          Para solicitar uma revisão do bloqueio da sua conta, entre em contacto com o suporte oficial de Moçambique:
        </p>

        <div className="space-y-2 mb-6 text-xs">
          <a
            href={`mailto:${settings.supportEmail}`}
            className="flex items-center justify-center gap-2 p-2.5 bg-gray-50 hover:bg-gray-100 rounded-xl text-[#0F0F0F] transition border border-gray-200"
          >
            <Mail className="w-4 h-4 text-[#337418]" />
            {settings.supportEmail}
          </a>
          <a
            href={`https://wa.me/258835466322`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 p-2.5 bg-emerald-50 hover:bg-emerald-100 rounded-xl text-emerald-800 transition border border-emerald-200"
          >
            <MessageSquare className="w-4 h-4 text-emerald-600" />
            WhatsApp: +258 83 546 6322
          </a>
          <div className="flex items-center justify-center gap-2 p-2 text-gray-500 text-[11px]">
            <Phone className="w-3.5 h-3.5" /> Linha direta M-Pesa: {settings.supportPhone}
          </div>
        </div>

        <button
          onClick={() => switchUserRole('CUSTOMER')}
          className="w-full flex items-center justify-center gap-2 bg-[#5DD62C] hover:bg-[#337418] text-[#0F0F0F] hover:text-white py-2.5 px-4 rounded-xl text-xs font-bold transition shadow-xs"
        >
          <LogOut className="w-4 h-4" />
          Mudar para Outro Utilizador de Demonstração
        </button>
      </div>
    </div>
  );
};
