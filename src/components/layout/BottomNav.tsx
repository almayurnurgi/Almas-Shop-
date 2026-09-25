import React from 'react';
import {
  Home,
  Grid,
  ShoppingCart,
  User,
  LayoutDashboard,
  Package,
  PlusCircle,
  TrendingUp,
  Wallet,
  MoreHorizontal
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const BottomNav: React.FC = () => {
  const { currentPath, navigate, cartItemsCount } = useApp();

  const isSellerArea = currentPath.startsWith('/vendedor');
  const isAdminArea = currentPath.startsWith('/admin');

  // If in Admin area, don't show the marketplace/seller bottom nav
  if (isAdminArea) return null;

  // 1. Seller Mobile Bottom Nav
  if (isSellerArea) {
    const navItems = [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/vendedor' },
      { id: 'produtos', label: 'Produtos', icon: Package, path: '/vendedor/produtos' },
      { id: 'add', label: 'Novo', icon: PlusCircle, path: '/vendedor/produtos/novo', isPrimary: true },
      { id: 'vendas', label: 'Vendas', icon: TrendingUp, path: '/vendedor/vendas' },
      { id: 'carteira', label: 'Carteira', icon: Wallet, path: '/vendedor/carteira' },
      { id: 'menu', label: 'Loja', icon: MoreHorizontal, path: '/vendedor/loja' }
    ];

    return (
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 px-2 py-1.5 shadow-xl safe-bottom">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const isActive =
              item.path === '/vendedor'
                ? currentPath === '/vendedor'
                : currentPath.startsWith(item.path);
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center justify-center p-1 rounded-xl transition ${
                  item.isPrimary
                    ? 'text-[#0F0F0F] font-bold'
                    : isActive
                    ? 'text-[#337418] font-bold'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                <div className={`relative ${item.isPrimary ? 'bg-[#5DD62C] p-1.5 rounded-full border border-gray-900/10 -mt-3 shadow-md' : ''}`}>
                  <Icon className={item.isPrimary ? 'w-5 h-5 text-[#0F0F0F]' : 'w-4 h-4'} />
                </div>
                <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // 2. Customer Mobile Bottom Nav
  const customerNavItems = [
    { id: 'home', label: 'Início', icon: Home, path: '/' },
    { id: 'categorias', label: 'Categorias', icon: Grid, path: '/categorias' },
    { id: 'carrinho', label: 'Carrinho', icon: ShoppingCart, path: '/carrinho', badge: cartItemsCount },
    { id: 'perfil', label: 'Minha Conta', icon: User, path: '/minha-conta' }
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 px-3 py-2 shadow-xl safe-bottom">
      <div className="flex items-center justify-around">
        {customerNavItems.map((item) => {
          const isActive = currentPath === item.path;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center py-0.5 px-3 rounded-xl transition relative ${
                isActive ? 'text-[#337418] font-bold' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {item.badge && item.badge > 0 ? (
                  <span className="absolute -top-1.5 -right-2 bg-[#5DD62C] text-[#0F0F0F] text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                    {item.badge}
                  </span>
                ) : null}
              </div>
              <span className="text-[10px] mt-1">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
