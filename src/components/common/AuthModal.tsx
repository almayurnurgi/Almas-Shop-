import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Phone,
  Store,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Upload,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { isValidEmail, isValidMozambiquePhone, formatMozambiquePhone } from '../../utils/validation';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRole?: 'CUSTOMER' | 'VENDOR';
  initialMode?: 'LOGIN' | 'REGISTER';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultRole = 'CUSTOMER',
  initialMode = 'LOGIN'
}) => {
  const { registerUser, loginUser, switchUserRole, navigate, isOnline } = useApp();

  const [mode, setMode] = useState<'LOGIN' | 'REGISTER'>(initialMode);
  const [role, setRole] = useState<'CUSTOMER' | 'VENDOR'>(defaultRole);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Vendor Registration 2-step progress (1 or 2)
  const [vendorStep, setVendorStep] = useState<1 | 2>(1);

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [identifier, setIdentifier] = useState(''); // Usado no Login (Email ou Telefone)
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [storeName, setStoreName] = useState('');
  const [storeLogo, setStoreLogo] = useState<string | null>(null);

  // Field validation error states
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');

  // State flags
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Synchronize internal state whenever modal is opened with new props
  useEffect(() => {
    if (isOpen) {
      setRole(defaultRole);
      setMode(initialMode);
      setVendorStep(1);
      setErrorMessage('');
      setSuccessMessage('');
      setEmailError('');
      setPhoneError('');
      setIsSubmitting(false);
      setName('');
      setEmail('');
      setPhone('');
      setIdentifier('');
      setPassword('');
      setConfirmPassword('');
      setStoreName('');
      setStoreLogo(null);
    }
  }, [isOpen, defaultRole, initialMode]);

  if (!isOpen) return null;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setStoreLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Real-time email validation handler
  const handleEmailChange = (val: string) => {
    setEmail(val);
    if (emailError && isValidEmail(val)) {
      setEmailError('');
    }
  };

  // Real-time phone validation handler
  const handlePhoneChange = (val: string) => {
    setPhone(val);
    if (phoneError && isValidMozambiquePhone(val)) {
      setPhoneError('');
    }
  };

  // Vendor: Advance from Step 1 to Step 2
  const handleVendorNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setEmailError('');
    setPhoneError('');

    // Check internet connection for vendor registration
    if (!isOnline) {
      setErrorMessage('Aviso: O cadastro de Vendedor exige conexão online ativa para sincronização da loja.');
      return;
    }

    if (!name.trim() || name.trim().length < 2) {
      setErrorMessage('Por favor, informe o seu nome completo.');
      return;
    }

    // Validate email format
    if (!isValidEmail(email)) {
      setEmailError('Formato de email inválido. Exemplo: nome@dominio.com');
      setErrorMessage('Por favor, insira um email válido antes de avançar.');
      return;
    }

    // Validate Mozambique phone format
    if (!isValidMozambiquePhone(phone)) {
      setPhoneError('Número de Moçambique inválido (+258 8x... - 9 dígitos)');
      setErrorMessage('O número de telemóvel deve ser de Moçambique com 9 dígitos (ex: 84 123 4567 ou +258 84 123 4567).');
      return;
    }

    setVendorStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setEmailError('');
    setPhoneError('');

    try {
      if (mode === 'LOGIN') {
        if (!identifier.trim() || !password.trim()) {
          setErrorMessage('Por favor, preencha o seu email ou telemóvel e a sua senha.');
          return;
        }

        setIsSubmitting(true);
        const user = await loginUser(identifier.trim());
        if (user) {
          if (role === 'VENDOR' || user.role === 'VENDOR') {
            switchUserRole('VENDOR');
            setSuccessMessage(`Bem-vindo de volta ao Painel do Vendedor, ${user.name}!`);
            setTimeout(() => {
              setIsSubmitting(false);
              onClose();
              navigate('/vendedor');
            }, 600);
          } else {
            switchUserRole('CUSTOMER');
            setSuccessMessage(`Bem-vindo de volta, ${user.name}!`);
            setTimeout(() => {
              setIsSubmitting(false);
              onClose();
            }, 600);
          }
        } else {
          setErrorMessage('Conta não encontrada com estes dados. Crie a sua conta abaixo!');
          setIsSubmitting(false);
        }
      } else {
        // ==========================================
        // REGISTRATION VALIDATIONS
        // ==========================================
        if (!isOnline) {
          setErrorMessage('Conexão necessária: O registo de contas exige conexão à internet.');
          return;
        }

        if (!name.trim() || name.trim().length < 2) {
          setErrorMessage('Por favor, informe o seu nome completo.');
          return;
        }

        // Email validation
        if (!isValidEmail(email)) {
          setEmailError('Email inválido (ex: nome@dominio.com)');
          setErrorMessage('Por favor, preencha um endereço de email válido.');
          return;
        }

        // Mozambique phone validation
        if (!isValidMozambiquePhone(phone)) {
          setPhoneError('Número de Moçambique inválido (+258 8x... - 9 dígitos)');
          setErrorMessage('O número de telemóvel moçambicano deve ter 9 dígitos e iniciar com 82, 83, 84, 85, 86 ou 87.');
          return;
        }

        if (password.length < 4) {
          setErrorMessage('A palavra-passe deve ter pelo menos 4 caracteres.');
          return;
        }

        if (password !== confirmPassword) {
          setErrorMessage('As palavras-passes não coincidem. Confirme a palavra-passe novamente.');
          return;
        }

        if (role === 'VENDOR' && (!storeName.trim() || storeName.trim().length < 2)) {
          setErrorMessage('Por favor, informe o nome oficial da sua loja ou marca.');
          return;
        }

        setIsSubmitting(true);
        const formattedPhone = formatMozambiquePhone(phone.trim());

        const createdUser = await registerUser({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: formattedPhone,
          role: role,
          storeName: storeName.trim() || (role === 'VENDOR' ? `${name.trim()} Store` : undefined),
          password: password.trim()
        });

        if (role === 'VENDOR') {
          switchUserRole('VENDOR');
          setSuccessMessage(`Loja "${storeName.trim() || name.trim()}" criada com sucesso! A entrar no Painel do Vendedor...`);
          setTimeout(() => {
            setIsSubmitting(false);
            onClose();
            navigate('/vendedor');
          }, 700);
        } else {
          switchUserRole('CUSTOMER');
          setSuccessMessage(`Conta criada com sucesso! Olá, ${createdUser.name}.`);
          setTimeout(() => {
            setIsSubmitting(false);
            onClose();
          }, 600);
        }
      }
    } catch (err: any) {
      console.error('Erro na autenticação ALMAS-SHOP:', err);
      setErrorMessage(err?.message || 'Ocorreu um erro ao processar. Verifique os dados e tente novamente.');
      setIsSubmitting(false);
    }
  };

  const handleSocialQuickLogin = async (provider: 'Google' | 'Apple') => {
    setIsSubmitting(true);
    setErrorMessage('');
    const demoEmail = provider === 'Google' ? 'cliente.google@almas-shop.co.mz' : 'cliente.apple@almas-shop.co.mz';
    const demoName = provider === 'Google' ? 'Utilizador Google' : 'Utilizador Apple ID';

    try {
      await registerUser({
        name: demoName,
        email: demoEmail,
        phone: '+258 84 345 6786',
        role: role,
        storeName: role === 'VENDOR' ? 'Loja ' + demoName : undefined
      });
      if (role === 'VENDOR') {
        switchUserRole('VENDOR');
        setSuccessMessage(`Conectado com sucesso via ${provider}! A entrar no Painel do Vendedor...`);
        setTimeout(() => {
          setIsSubmitting(false);
          onClose();
          navigate('/vendedor');
        }, 600);
      } else {
        switchUserRole('CUSTOMER');
        setSuccessMessage(`Conectado com sucesso via ${provider}!`);
        setTimeout(() => {
          setIsSubmitting(false);
          onClose();
        }, 500);
      }
    } catch (e: any) {
      setIsSubmitting(false);
    }
  };

  const modalContent = (
    <div
      id="almas-auth-modal-overlay"
      className="fixed inset-0 z-[99999] overflow-y-auto bg-black/80 backdrop-blur-md flex flex-col justify-start sm:justify-center items-center p-2.5 sm:p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Modal Card - Frutiger Aero Translucent Glass Card with strict vertical scroll containment */}
      <div
        id="almas-auth-modal-card"
        className="relative w-full max-w-lg bg-white/95 backdrop-blur-2xl rounded-3xl sm:rounded-[36px] border border-white/80 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] text-[#0F0F0F] my-auto max-h-[92vh] sm:max-h-[88vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle decorative glow */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-[#5DD62C]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-[#337418]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Sticky Header with Title and Close Button */}
        <div className="p-4 sm:p-5 pb-3 border-b border-gray-100 flex items-center justify-between flex-shrink-0 bg-white/90 backdrop-blur-md z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#5DD62C] to-[#337418] flex items-center justify-center shadow-md shadow-[#5DD62C]/20 flex-shrink-0">
              {role === 'VENDOR' ? (
                <Store className="w-5 h-5 text-white" />
              ) : (
                <Sparkles className="w-5 h-5 text-white" />
              )}
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-[#0F0F0F] tracking-tight leading-tight">
                {mode === 'LOGIN'
                  ? 'Entrar na ALMAS-SHOP'
                  : role === 'VENDOR'
                  ? 'Registo de Vendedor Parceiro'
                  : 'Criar Conta de Cliente'}
              </h2>
              <p className="text-[11px] text-gray-500 font-medium">
                {role === 'VENDOR'
                  ? 'Venda para todo Moçambique sem custos fixos'
                  : 'Compras rápidas com entrega grátis'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            id="btn-close-auth-modal"
            aria-label="Fechar modal"
            className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition cursor-pointer flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Modal Content Container with min-h-0 for reliable native mobile scrolling */}
        <div className="overflow-y-auto flex-1 min-h-0 p-4 sm:p-6 space-y-4 overscroll-contain [scrollbar-width:thin] touch-pan-y">
          {/* Role Toggle: Cliente vs Vendedor */}
          <div className="flex items-center gap-1.5 p-1 bg-gray-100 rounded-full border border-gray-200">
            <button
              type="button"
              id="btn-role-tab-customer"
              onClick={() => {
                setRole('CUSTOMER');
                setVendorStep(1);
                setErrorMessage('');
                setEmailError('');
                setPhoneError('');
              }}
              className={`flex-1 py-1.5 px-3 rounded-full text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                role === 'CUSTOMER'
                  ? 'bg-white text-[#0F0F0F] shadow-sm'
                  : 'text-gray-500 hover:text-[#0F0F0F]'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Cliente</span>
            </button>
            <button
              type="button"
              id="btn-role-tab-vendor"
              onClick={() => {
                setRole('VENDOR');
                setVendorStep(1);
                setErrorMessage('');
                setEmailError('');
                setPhoneError('');
              }}
              className={`flex-1 py-1.5 px-3 rounded-full text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                role === 'VENDOR'
                  ? 'bg-[#5DD62C] text-[#0F0F0F] shadow-sm'
                  : 'text-gray-500 hover:text-[#0F0F0F]'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>Vendedor / Loja</span>
            </button>
          </div>

          {/* VENDOR COMMISSION PROFIT EXAMPLE CARD (Prominent on Vendor Flow) */}
          {role === 'VENDOR' && (
            <div className="p-3.5 bg-gradient-to-r from-emerald-50 via-[#5DD62C]/10 to-teal-50 border border-[#5DD62C]/40 rounded-2xl shadow-xs">
              <div className="flex items-center gap-1.5 text-xs font-black text-[#337418] mb-1.5">
                <TrendingUp className="w-4 h-4" />
                <span>Exemplo Real de Lucro por Venda:</span>
              </div>
              <div className="flex items-center justify-between text-[11px] font-bold text-gray-800 bg-white/95 px-3 py-2 rounded-xl border border-gray-200">
                <div className="text-center">
                  <span className="text-[10px] text-gray-400 block font-normal">Preço Custo</span>
                  <span className="text-gray-700">850 MT</span>
                </div>
                <span className="text-gray-400">→</span>
                <div className="text-center">
                  <span className="text-[10px] text-gray-400 block font-normal">Você Vende</span>
                  <span className="text-[#0F0F0F]">1.450 MT</span>
                </div>
                <span className="text-gray-400">→</span>
                <div className="text-center">
                  <span className="text-[10px] text-[#337418] block font-extrabold">Seu Lucro</span>
                  <span className="text-[#337418] font-black">+600 MT</span>
                  <span className="text-[9px] text-[#337418] block font-bold">(+42% Margem)</span>
                </div>
              </div>
            </div>
          )}

          {/* Alerts: Error or Success */}
          {errorMessage && (
            <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700 font-semibold flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}
          {successMessage && (
            <div className="p-3 rounded-2xl bg-green-50 border border-green-200 text-xs text-green-800 font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#337418] flex-shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* ============================================================ */}
          {/* VENDOR REGISTRATION 2-STEP ONBOARDING */}
          {/* ============================================================ */}
          {role === 'VENDOR' && mode === 'REGISTER' ? (
            <div>
              {/* 2-Step Progress Indicator */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                  <span className={vendorStep === 1 ? 'text-[#337418]' : 'text-gray-500'}>
                    Etapa 1 de 2: Dados Pessoais & Contactos
                  </span>
                  <span className={vendorStep === 2 ? 'text-[#337418]' : 'text-gray-500'}>
                    Etapa 2 de 2: Loja & Senha
                  </span>
                </div>
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#5DD62C] to-[#337418] transition-all duration-300 rounded-full"
                    style={{ width: vendorStep === 1 ? '50%' : '100%' }}
                  />
                </div>
              </div>

              {/* Step 1: Personal Data, Email & Phone */}
              {vendorStep === 1 && (
                <form onSubmit={handleVendorNextStep} className="space-y-3.5">
                  {/* Nome Completo */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Nome Completo *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ex: Carlos Sitoe"
                        className="w-full bg-[#F8F8F8] border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-xs text-[#0F0F0F] placeholder-gray-400 focus:outline-hidden focus:border-[#5DD62C] focus:bg-white transition"
                      />
                    </div>
                  </div>

                  {/* Email with Validator */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider">
                        Email Profissional *
                      </label>
                      {email && isValidEmail(email) && (
                        <span className="text-[10px] text-[#337418] font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Email válido
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => handleEmailChange(e.target.value)}
                        placeholder="exemplo@dominio.com"
                        className={`w-full bg-[#F8F8F8] border rounded-xl py-2.5 pl-10 pr-4 text-xs text-[#0F0F0F] placeholder-gray-400 focus:outline-hidden focus:bg-white transition ${
                          emailError ? 'border-red-400 bg-red-50/40' : 'border-gray-200 focus:border-[#5DD62C]'
                        }`}
                      />
                    </div>
                    {emailError ? (
                      <p className="text-[11px] text-red-600 mt-1 pl-1 font-medium">{emailError}</p>
                    ) : (
                      <p className="text-[10px] text-gray-500 mt-1 pl-1">
                        Formato padrão: utilizador@dominio.com
                      </p>
                    )}
                  </div>

                  {/* Mozambique Phone with Validator */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider">
                        Telemóvel Moçambique (+258) *
                      </label>
                      {phone && isValidMozambiquePhone(phone) && (
                        <span className="text-[10px] text-[#337418] font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Válido (+258)
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => handlePhoneChange(e.target.value)}
                        placeholder="Ex: 84 345 6786 ou +258 84 345 6786"
                        className={`w-full bg-[#F8F8F8] border rounded-xl py-2.5 pl-10 pr-4 text-xs text-[#0F0F0F] placeholder-gray-400 focus:outline-hidden focus:bg-white transition ${
                          phoneError ? 'border-red-400 bg-red-50/40' : 'border-gray-200 focus:border-[#5DD62C]'
                        }`}
                      />
                    </div>
                    {phoneError ? (
                      <p className="text-[11px] text-red-600 mt-1 pl-1 font-medium">{phoneError}</p>
                    ) : (
                      <p className="text-[10px] text-gray-500 mt-1 pl-1">
                        Operadoras aceites: Tmcel (82, 83), Vodacom (84, 85), Movitel (86, 87) - 9 dígitos.
                      </p>
                    )}
                  </div>

                  {/* Next Step Button */}
                  <button
                    type="submit"
                    id="btn-vendor-step1-next"
                    className="w-full mt-4 bg-gradient-to-r from-[#5DD62C] to-[#337418] hover:from-[#4ec023] hover:to-[#285d13] text-white font-extrabold py-3 px-6 rounded-full transition shadow-md hover:shadow-lg text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Avançar para Dados da Loja</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}

              {/* Step 2: Store & Password */}
              {vendorStep === 2 && (
                <form onSubmit={handleSubmit} className="space-y-3.5">
                  {/* Nome da Loja */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Nome Oficial da Loja / Marca *
                    </label>
                    <div className="relative">
                      <Store className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={storeName}
                        onChange={(e) => setStoreName(e.target.value)}
                        placeholder="Ex: Maputo Modas & Acessórios"
                        className="w-full bg-[#F8F8F8] border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-xs text-[#0F0F0F] placeholder-gray-400 focus:outline-hidden focus:border-[#5DD62C] focus:bg-white transition"
                      />
                    </div>
                    <p className="text-[10px] text-gray-500 mt-1 pl-1">
                      Este nome será exibido nos seus produtos e na sua página pública de vendas.
                    </p>
                  </div>

                  {/* Upload Foto da Galeria */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Logótipo ou Foto da Loja (Galeria)
                    </label>
                    <div className="flex items-center gap-3">
                      <label className="cursor-pointer flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-[#0F0F0F] px-4 py-2.5 rounded-xl text-xs font-semibold border border-gray-300 transition shadow-xs">
                        <Upload className="w-3.5 h-3.5 text-[#337418]" />
                        <span>Carregar da Galeria</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                        />
                      </label>
                      {storeLogo && (
                        <div className="flex items-center gap-2">
                          <img
                            src={storeLogo}
                            alt="Logo selecionado"
                            className="w-9 h-9 rounded-full object-cover border-2 border-[#5DD62C]"
                          />
                          <span className="text-[10px] text-[#337418] font-bold">Foto selecionada</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Senha */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Palavra-passe de Acesso (mínimo 4 caracteres) *
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        minLength={4}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-[#F8F8F8] border border-gray-200 rounded-xl py-2.5 pl-10 pr-10 text-xs text-[#0F0F0F] placeholder-gray-400 focus:outline-hidden focus:border-[#5DD62C] focus:bg-white transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirmar Senha */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Confirmar Palavra-passe *
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        minLength={4}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-[#F8F8F8] border border-gray-200 rounded-xl py-2.5 pl-10 pr-10 text-xs text-[#0F0F0F] placeholder-gray-400 focus:outline-hidden focus:border-[#5DD62C] focus:bg-white transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Buttons: Back and Submit */}
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setVendorStep(1)}
                      className="py-3 px-4 rounded-xl border border-gray-300 text-xs font-bold text-gray-600 hover:text-[#0F0F0F] hover:bg-gray-50 transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Voltar</span>
                    </button>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      id="btn-vendor-step2-submit"
                      className="flex-1 bg-gradient-to-r from-[#5DD62C] to-[#337418] hover:from-[#4ec023] hover:to-[#285d13] text-white font-extrabold py-3 px-6 rounded-full transition shadow-md hover:shadow-lg text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <span>A criar a sua loja...</span>
                      ) : (
                        <>
                          <span>Concluir Cadastro & Começar</span>
                          <CheckCircle2 className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : (
            /* ============================================================ */
            /* CUSTOMER REGISTRATION OR LOGIN FORM */
            /* ============================================================ */
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Name for Register */}
              {mode === 'REGISTER' && (
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Nome Completo *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex: Maria Machava"
                      className="w-full bg-[#F8F8F8] border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-xs text-[#0F0F0F] placeholder-gray-400 focus:outline-hidden focus:border-[#5DD62C] focus:bg-white transition"
                    />
                  </div>
                </div>
              )}

              {/* In Register mode: Show explicit Email and Mozambique Phone */}
              {mode === 'REGISTER' ? (
                <>
                  {/* Email with Validator */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider">
                        Email *
                      </label>
                      {email && isValidEmail(email) && (
                        <span className="text-[10px] text-[#337418] font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Email válido
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => handleEmailChange(e.target.value)}
                        placeholder="exemplo@dominio.com"
                        className={`w-full bg-[#F8F8F8] border rounded-xl py-2.5 pl-10 pr-4 text-xs text-[#0F0F0F] placeholder-gray-400 focus:outline-hidden focus:bg-white transition ${
                          emailError ? 'border-red-400 bg-red-50/40' : 'border-gray-200 focus:border-[#5DD62C]'
                        }`}
                      />
                    </div>
                    {emailError && (
                      <p className="text-[11px] text-red-600 mt-1 pl-1 font-medium">{emailError}</p>
                    )}
                  </div>

                  {/* Mozambique Phone with Validator */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider">
                        Telemóvel Moçambique (+258) *
                      </label>
                      {phone && isValidMozambiquePhone(phone) && (
                        <span className="text-[10px] text-[#337418] font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Válido (+258)
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => handlePhoneChange(e.target.value)}
                        placeholder="Ex: 84 345 6786 ou +258 84 345 6786"
                        className={`w-full bg-[#F8F8F8] border rounded-xl py-2.5 pl-10 pr-4 text-xs text-[#0F0F0F] placeholder-gray-400 focus:outline-hidden focus:bg-white transition ${
                          phoneError ? 'border-red-400 bg-red-50/40' : 'border-gray-200 focus:border-[#5DD62C]'
                        }`}
                      />
                    </div>
                    {phoneError ? (
                      <p className="text-[11px] text-red-600 mt-1 pl-1 font-medium">{phoneError}</p>
                    ) : (
                      <p className="text-[10px] text-gray-500 mt-1 pl-1">
                        Tmcel (82, 83), Vodacom (84, 85), Movitel (86, 87) - 9 dígitos.
                      </p>
                    )}
                  </div>
                </>
              ) : (
                /* In Login mode: single identifier field */
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Email ou Telemóvel
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="84 345 6786 ou email@exemplo.com"
                      className="w-full bg-[#F8F8F8] border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-xs text-[#0F0F0F] placeholder-gray-400 focus:outline-hidden focus:border-[#5DD62C] focus:bg-white transition"
                    />
                  </div>
                </div>
              )}

              {/* Password */}
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Palavra-passe
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={4}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#F8F8F8] border border-gray-200 rounded-xl py-2.5 pl-10 pr-10 text-xs text-[#0F0F0F] placeholder-gray-400 focus:outline-hidden focus:border-[#5DD62C] focus:bg-white transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password for Register */}
              {mode === 'REGISTER' && (
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Confirmar Palavra-passe *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      minLength={4}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-[#F8F8F8] border border-gray-200 rounded-xl py-2.5 pl-10 pr-10 text-xs text-[#0F0F0F] placeholder-gray-400 focus:outline-hidden focus:border-[#5DD62C] focus:bg-white transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              {/* Remember Me / Forgot */}
              {mode === 'LOGIN' && (
                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-gray-600">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="accent-[#337418] rounded"
                    />
                    <span>Lembrar-me</span>
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      alert('Para recuperar a sua senha, envie uma mensagem ao apoio via WhatsApp: +258 83 546 6322')
                    }
                    className="text-[#337418] hover:underline font-semibold cursor-pointer"
                  >
                    Esqueci a senha
                  </button>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                id="btn-auth-submit"
                className="w-full mt-2 bg-gradient-to-r from-[#5DD62C] to-[#337418] hover:from-[#4ec023] hover:to-[#285d13] text-white font-extrabold py-3.5 px-6 rounded-full transition shadow-md hover:shadow-lg active:scale-98 text-sm flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>A processar com segurança...</span>
                ) : (
                  <>
                    <span>{mode === 'LOGIN' ? 'Entrar Agora' : 'Concluir Cadastro'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Quick shortcuts with Google and Apple */}
              <div className="relative my-3">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-[10px] uppercase font-bold text-gray-400">
                  <span className="bg-white px-3">Ou continuar com</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleSocialQuickLogin('Google')}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-700 transition shadow-xs cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.94 0 12s.45 3.84 1.25 5.42l4.03-3.15z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                    />
                  </svg>
                  <span>Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSocialQuickLogin('Apple')}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-700 transition shadow-xs cursor-pointer"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.33c.66-.82 1.11-1.96.99-3.1-.96.04-2.12.64-2.8 1.44-.59.69-1.11 1.83-.97 2.94 1.07.08 2.16-.54 2.78-1.28z" />
                  </svg>
                  <span>Apple ID</span>
                </button>
              </div>
            </form>
          )}

          {/* Toggle between Login and Register */}
          <div className="pt-3 text-center text-xs text-gray-600 border-t border-gray-100 mt-2">
            {mode === 'LOGIN' ? (
              <p>
                Ainda não tem conta?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('REGISTER');
                    setVendorStep(1);
                    setErrorMessage('');
                    setEmailError('');
                    setPhoneError('');
                  }}
                  className="text-[#337418] hover:text-[#5DD62C] font-extrabold underline ml-1 cursor-pointer"
                >
                  Criar conta grátis
                </button>
              </p>
            ) : (
              <p>
                Já tem conta registada?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('LOGIN');
                    setVendorStep(1);
                    setErrorMessage('');
                    setEmailError('');
                    setPhoneError('');
                  }}
                  className="text-[#337418] hover:text-[#5DD62C] font-extrabold underline ml-1 cursor-pointer"
                >
                  Fazer Login
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  if (typeof document !== 'undefined') {
    return createPortal(modalContent, document.body);
  }
  return modalContent;
};
