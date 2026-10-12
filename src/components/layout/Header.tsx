import React, { useState } from 'react';
import {
  Search,
  ShoppingCart,
  Bell,
  User as UserIcon,
  Store as StoreIcon,
  ShieldCheck,
  Menu,
  X,
  Sparkles,
  ArrowRightLeft,
  Volume2,
  VolumeX,
  LogOut
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Header: React.FC = () => {
  const {
    currentPath,
    navigate,
    currentUser,
    switchUserRole,
    cartItemsCount,
    cartTotal,
    notifications,
    settings,
    updateSettings,
    activeSearchQuery,
    setActiveSearchQuery,
    openAuthModal
  } = useApp();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

  const unreadNotifs = notifications.filter((n) => !n.isRead);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentPath !== '/produtos' && currentPath !== '/') {
      navigate('/produtos');
    }
  };

  const isSellerArea = currentPath.startsWith('/vendedor');
  const isAdminArea = currentPath.startsWith('/admin');

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between gap-3 sm:gap-6">
          {/* Logo & Slogan */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl overflow-hidden shadow border border-gray-200 flex-shrink-0 bg-white p-1">
              <img
                src={settings.platformLogo || '/logo.svg'}
                alt="ALMAS-SHOP Logo"
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/logo.svg';
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-[#0F0F0F] flex items-center">
                  ALMAS<span className="text-[#337418]">-SHOP</span>
                </span>
                <span className="text-[10px] bg-[#5DD62C] text-[#0F0F0F] font-black px-1.5 py-0.5 rounded tracking-wider">
                  MZ
                </span>
              </div>
              <p className="hidden sm:block text-[11px] font-semibold text-gray-600 tracking-wide">
                EASY SOLUTION · Mais que uma loja, é a sua solução!
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 max-w-md relative items-center"
          >
            <input
              type="text"
              placeholder="Pesquisar na ALMAS-SHOP..."
              value={activeSearchQuery}
              onChange={(e) => setActiveSearchQuery(e.target.value)}
              className="w-full bg-[#F8F8F8] border border-gray-300 focus:border-[#5DD62C] focus:bg-white text-sm text-[#0F0F0F] placeholder-gray-400 rounded-full py-2 pl-10 pr-10 focus:outline-none transition"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 pointer-events-none" />
            {activeSearchQuery && (
              <button
                type="button"
                onClick={() => setActiveSearchQuery('')}
                className="absolute right-3 text-gray-400 hover:text-[#0F0F0F]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>

          {/* Actions & Role Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Audio Toggle */}
            <button
              onClick={() => updateSettings({ soundAlertEnabled: !settings.soundAlertEnabled })}
              title={settings.soundAlertEnabled ? 'Som de venda ativado' : 'Som de venda desativado'}
              className={`p-2 rounded-xl border transition ${
                settings.soundAlertEnabled
                  ? 'bg-[#5DD62C]/15 text-[#337418] border-[#5DD62C]/40'
                  : 'bg-gray-100 text-gray-500 border-gray-200'
              }`}
            >
              {settings.soundAlertEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Role Switcher Button */}
            <div className="relative">
              <button
                onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
                className="flex items-center gap-1.5 bg-[#0F0F0F] hover:bg-[#202020] text-white px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold transition shadow-sm"
              >
                <ArrowRightLeft className="w-3.5 h-3.5 text-[#5DD62C]" />
                <span className="hidden sm:inline">
                  {currentUser?.role === 'SUPER_ADMIN'
                    ? 'Chefe (Admin)'
                    : currentUser?.role === 'VENDOR'
                    ? 'Área do Vendedor'
                    : 'Modo Cliente'}
                </span>
                <span className="sm:hidden text-[11px]">
                  {currentUser?.role === 'SUPER_ADMIN' ? 'Admin' : currentUser?.role === 'VENDOR' ? 'Vendedor' : 'Cliente'}
                </span>
              </button>

              {/* Role switch dropdown */}
              {showRoleSwitcher && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-2xl shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-2 border-b border-gray-100 text-xs">
                    <p className="text-[#0F0F0F] font-bold">Trocar Experiência de Usuário</p>
                    <p className="text-[11px] text-gray-500">Ambiente integrado ALMAS-SHOP</p>
                  </div>

                  <div className="space-y-1 mt-1">
                    <button
                      onClick={() => {
                        switchUserRole('CUSTOMER');
                        navigate('/');
                        setShowRoleSwitcher(false);
                      }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-left transition ${
                        currentUser?.role === 'CUSTOMER' && !isSellerArea && !isAdminArea
                          ? 'bg-[#5DD62C]/20 text-[#0F0F0F] font-bold'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <UserIcon className="w-4 h-4 text-[#337418]" />
                      <div>
                        <p className="font-semibold text-[#0F0F0F]">Experiência Cliente</p>
                        <p className="text-[10px] text-gray-500">Marketplace, produtos e checkout</p>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        if (currentUser?.role === 'VENDOR') {
                          switchUserRole('VENDOR');
                          navigate('/vendedor');
                          setShowRoleSwitcher(false);
                        } else {
                          openAuthModal('VENDOR', 'REGISTER');
                          setShowRoleSwitcher(false);
                        }
                      }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-left transition ${
                        currentUser?.role === 'VENDOR' || isSellerArea
                          ? 'bg-[#5DD62C]/20 text-[#0F0F0F] font-bold'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <StoreIcon className="w-4 h-4 text-amber-600" />
                      <div>
                        <p className="font-semibold text-[#0F0F0F]">Área Profissional do Vendedor</p>
                        <p className="text-[10px] text-gray-500">
                          {currentUser?.role === 'VENDOR' ? 'Gerir produtos e carteira' : 'Exige cadastro de vendedor'}
                        </p>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        if (currentUser?.role === 'SUPER_ADMIN' && currentUser?.email === 'almayurnurgi563@gmail.com') {
                          navigate('/admin');
                        } else {
                          navigate('/admin/login');
                        }
                        setShowRoleSwitcher(false);
                      }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-left transition ${
                        currentUser?.role === 'SUPER_ADMIN' || isAdminArea
                          ? 'bg-[#5DD62C]/20 text-[#0F0F0F] font-bold'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <ShieldCheck className="w-4 h-4 text-[#337418]" />
                      <div>
                        <p className="font-semibold text-[#0F0F0F]">Painel Mestre (Super Admin)</p>
                        <p className="text-[10px] text-gray-500">Acesso Restrito · Exclusivo do Chefe</p>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 border border-gray-200 text-gray-700 relative transition"
                title="Notificações"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifs.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#5DD62C] text-[#0F0F0F] text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                    {unreadNotifs.length}
                  </span>
                )}
              </button>

              {showNotifDropdown && (
                <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white border border-gray-200 rounded-2xl shadow-xl p-3 z-50">
                  <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                    <span className="text-xs font-bold text-[#0F0F0F]">Notificações Recentes</span>
                    <span className="text-[11px] text-[#337418] font-bold">{unreadNotifs.length} novas</span>
                  </div>
                  <div className="max-h-60 overflow-y-auto space-y-2 mt-2">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-gray-500 py-4 text-center">Nenhuma notificação</p>
                    ) : (
                      notifications.slice(0, 6).map((n) => (
                        <div
                          key={n.id}
                          className="p-2 bg-gray-50 rounded-xl text-xs border border-gray-200"
                        >
                          <p className="font-semibold text-[#0F0F0F]">{n.title}</p>
                          <p className="text-gray-600 text-[11px] mt-0.5">{n.message}</p>
                          <p className="text-[10px] text-gray-400 mt-1">
                            {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Cart Button */}
            {!isAdminArea && (
              <button
                onClick={() => navigate('/carrinho')}
                className="flex items-center gap-2 bg-[#5DD62C] hover:bg-[#337418] text-[#0F0F0F] hover:text-white font-bold px-3 py-1.5 rounded-xl text-xs transition shadow-sm"
              >
                <div className="relative">
                  <ShoppingCart className="w-4 h-4" />
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-[#0F0F0F] text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center">
                      {cartItemsCount}
                    </span>
                  )}
                </div>
                <span className="hidden sm:inline">
                  {cartTotal > 0 ? `${cartTotal.toLocaleString()} MT` : 'Carrinho'}
                </span>
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-gray-100 text-gray-700 border border-gray-200"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="mt-2.5 md:hidden">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Pesquisar na ALMAS-SHOP..."
              value={activeSearchQuery}
              onChange={(e) => setActiveSearchQuery(e.target.value)}
              className="w-full bg-[#F8F8F8] border border-gray-300 focus:border-[#5DD62C] text-xs text-[#0F0F0F] placeholder-gray-400 rounded-xl py-2 pl-9 pr-8 focus:outline-none"
            />
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5 pointer-events-none" />
          </form>
        </div>

        {/* Mobile Slide-down Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-3 pt-3 border-t border-gray-200 space-y-2 pb-2">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => {
                  navigate('/');
                  setIsMobileMenuOpen(false);
                }}
                className="p-2.5 bg-gray-100 rounded-xl text-left text-[#0F0F0F] font-medium flex items-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#337418]" /> Marketplace Home
              </button>
              <button
                onClick={() => {
                  navigate('/pedidos');
                  setIsMobileMenuOpen(false);
                }}
                className="p-2.5 bg-gray-100 rounded-xl text-left text-[#0F0F0F] font-medium flex items-center gap-2"
              >
                <ShoppingCart className="w-3.5 h-3.5 text-[#337418]" /> Meus Pedidos
              </button>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  if (currentUser?.role === 'VENDOR') {
                    navigate('/vendedor');
                  } else {
                    openAuthModal('VENDOR', 'REGISTER');
                  }
                }}
                className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-left text-amber-900 font-medium flex items-center gap-2"
              >
                <StoreIcon className="w-3.5 h-3.5 text-amber-600" /> Painel do Vendedor
              </button>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  if (currentUser?.role === 'SUPER_ADMIN' && currentUser?.email === 'almayurnurgi563@gmail.com') {
                    navigate('/admin');
                  } else {
                    navigate('/admin/login');
                  }
                }}
                className="p-2.5 bg-gray-900 rounded-xl text-left text-white font-medium flex items-center gap-2"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#5DD62C]" /> Painel Mestre
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
