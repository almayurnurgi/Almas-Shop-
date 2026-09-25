import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Mail,
  KeyRound,
  ArrowRight,
  AlertTriangle,
  Eye,
  EyeOff,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  UserCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface Props {
  onSuccess: () => void;
}

export const AdminLogin: React.FC<Props> = ({ onSuccess }) => {
  const { navigate, setFlashBanner, users, loginUser } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const targetEmail = email.trim().toLowerCase();
    const targetPassword = password.trim();

    if (!targetEmail || !targetPassword) {
      setErrorMessage('Por favor preencha o seu e-mail e a sua palavra-passe.');
      return;
    }

    // 1. Check if it's the fixed Super Admin
    if (targetEmail === 'almayurnurgi563@gmail.com') {
      if (targetPassword !== 'Te@momae') {
        setErrorMessage('Palavra-passe mestre incorreta para o Super Admin.');
        return;
      }
    } else {
      // 2. Check if it's a secondary admin / CEO created inside the panel by Super Admin
      const secondaryAdmin = users.find(
        (u) =>
          u.email.toLowerCase() === targetEmail &&
          (u.role === 'ADMIN' || u.role === 'SUPER_ADMIN' || u.adminLevel === 'CEO' || u.adminLevel === 'SUPPORT') &&
          !u.isBanned
      );

      if (!secondaryAdmin) {
        setErrorMessage(
          'Acesso negado. Apenas o Super Admin ou administradores autorizados têm acesso ao Painel Mestre.'
        );
        return;
      }

      // Check password if set on secondary admin
      if (secondaryAdmin.password && secondaryAdmin.password !== targetPassword) {
        setErrorMessage('Palavra-passe incorreta para este administrador.');
        return;
      }
    }

    setLoading(true);
    try {
      await loginUser(targetEmail);
    } catch {
      // safe fallback
    }

    setTimeout(() => {
      setLoading(false);
      setFlashBanner({
        message: 'Acesso autorizado ao Painel Mestre. Olá Chefe!',
        type: 'success'
      });
      onSuccess();
    }, 300);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#0F0F0F] via-[#1a1a1a] to-[#0F0F0F] relative overflow-hidden">
      {/* Decorative ambient orbs */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-[#5DD62C]/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#337418]/25 rounded-full blur-[100px] pointer-events-none" />

      {/* Translucent Frosted Glass Card */}
      <div className="max-w-md w-full bg-white/10 backdrop-blur-2xl border border-white/20 text-white rounded-[36px] p-6 sm:p-10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] relative overflow-hidden z-10">
        {/* Glass reflection highlight */}
        <div className="absolute -top-24 -left-24 w-60 h-60 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="text-center space-y-3 mb-6 relative z-10">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#5DD62C] to-[#337418] flex items-center justify-center mx-auto text-[#0F0F0F] shadow-lg shadow-[#5DD62C]/30">
            <ShieldCheck className="w-9 h-9 text-white" />
          </div>
          <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3.5 py-1 rounded-full text-xs text-[#5DD62C] font-bold border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-[#5DD62C]" />
            Acesso Restrito · Painel Mestre
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            ALMAS-SHOP Chefe
          </h1>
          <p className="text-xs text-gray-300 max-w-xs mx-auto">
            Autoridade máxima e gestão de toda a plataforma Moçambique
          </p>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 bg-rose-500/20 border border-rose-500/40 rounded-2xl text-xs text-rose-200 font-semibold flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 text-rose-400 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleCredentialsSubmit} className="space-y-4">
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-300 block mb-1.5">
              E-mail do Administrador
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/40 border border-white/20 focus:border-[#5DD62C] text-xs text-white placeholder-gray-500 rounded-full py-3.5 pl-10 pr-4 focus:outline-hidden font-mono shadow-inner transition"
                placeholder="Insira o seu e-mail"
                autoComplete="off"
              />
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-300 block mb-1.5">
              Palavra-passe Mestre
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/40 border border-white/20 focus:border-[#5DD62C] text-xs text-white placeholder-gray-500 rounded-full py-3.5 pl-10 pr-10 focus:outline-hidden shadow-inner transition"
                placeholder="Insira a sua palavra-passe"
                autoComplete="new-password"
              />
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            id="btn-admin-login-submit"
            className="w-full bg-gradient-to-r from-[#5DD62C] to-[#337418] hover:from-[#4ec023] hover:to-[#285d13] text-white font-extrabold text-xs py-3.5 px-6 rounded-full shadow-lg shadow-[#5DD62C]/20 transition flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'A validar credenciais...' : 'Aceder ao Painel Mestre'}
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Voltar ao Marketplace
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
