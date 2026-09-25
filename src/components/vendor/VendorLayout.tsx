import React from 'react';
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  TrendingUp,
  Wallet,
  Store,
  Sliders,
  BarChart3,
  Code,
  Settings,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface Props {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  children: React.ReactNode;
}

export const VendorLayout: React.FC<Props> = ({ activeTab, setActiveTab, children }) => {
  const { currentUser, stores, navigate, orders } = useApp();

  const vendorStore = stores.find((s) => s.vendorId === currentUser?.id || s.vendorId === 'user_vendor_1') || stores[0];

  const vendorOrders = orders.filter(
    (o) => o.vendorIds.includes(currentUser?.id || 'user_vendor_1') || o.vendorIds.includes(vendorStore.id)
  );

  const pendingOrdersCount = vendorOrders.filter((o) => o.status === 'PENDING' || o.status === 'PREPARING').length;

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'produtos', label: 'Produtos', icon: Package },
    { id: 'novo-produto', label: 'Adicionar Produto', icon: PlusCircle },
    { id: 'vendas', label: 'Vendas & Pedidos', icon: TrendingUp, badge: pendingOrdersCount > 0 ? pendingOrdersCount : undefined },
    { id: 'carteira', label: 'Carteira & Levantamentos', icon: Wallet },
    { id: 'personalizar', label: 'Personalizar Loja', icon: Sliders },
    { id: 'loja', label: 'Minha Loja (Pública)', icon: Store },
    { id: 'analytics', label: 'Analytics & UTM', icon: BarChart3 },
    { id: 'pixels', label: 'Pixels & Rastreio', icon: Code },
    { id: 'configuracoes', label: 'Configurações', icon: Settings }
  ];

  return (
    <div className="min-h-[calc(100vh-60px)] bg-[#F8F8F8] text-[#0F0F0F] flex flex-col md:flex-row pb-24 md:pb-8">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 p-4 flex-shrink-0 shadow-xs">
        {/* Store Profile Card */}
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-3.5 mb-5 flex items-center gap-3">
          <img
            src={vendorStore.logo}
            alt={vendorStore.name}
            className="w-11 h-11 rounded-xl object-cover border border-gray-200"
          />
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-xs text-[#0F0F0F] truncate">{vendorStore.name}</h3>
            <p className="text-[11px] text-[#337418] font-semibold truncate flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5DD62C]"></span>
              Loja Oficial Verificada
            </p>
          </div>
        </div>

        {/* Navigation items */}
        <nav className="space-y-1 flex-1">
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'loja') {
                    navigate(`/loja/${vendorStore.slug}`);
                  } else {
                    setActiveTab(item.id);
                  }
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                  isActive
                    ? 'bg-[#5DD62C] text-[#0F0F0F] shadow-xs'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-[#0F0F0F]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#0F0F0F]' : 'text-gray-500'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="bg-[#0F0F0F] text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* View public store CTA */}
        <div className="pt-4 border-t border-gray-100 mt-4">
          <button
            onClick={() => navigate(`/loja/${vendorStore.slug}`)}
            className="w-full py-2 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition"
          >
            <span>Ver Loja no Marketplace</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
        {children}
      </main>
    </div>
  );
};
