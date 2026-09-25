import React from 'react';
import {
  DollarSign,
  ShoppingCart,
  TrendingUp,
  Package,
  PlusCircle,
  Eye,
  Sliders,
  Wallet,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface Props {
  onNavigateTab: (tab: string) => void;
}

export const VendorDashboard: React.FC<Props> = ({ onNavigateTab }) => {
  const { orders, products, currentUser, wallets, stores } = useApp();

  const vendorStore = stores.find((s) => s.vendorId === currentUser?.id || s.vendorId === 'user_vendor_1') || stores[0];
  const wallet = wallets[currentUser?.id || ''] || wallets[vendorStore.vendorId] || Object.values(wallets)[0] || {
    vendorId: vendorStore.vendorId,
    availableBalance: 0,
    pendingBalance: 0,
    totalSales: 0,
    totalCommissions: 0,
    totalWithdrawn: 0,
    transactions: [],
    updatedAt: new Date().toISOString()
  };

  const vendorOrders = orders.filter(
    (o) => o.vendorIds.includes(currentUser?.id || 'user_vendor_1') || o.vendorIds.includes(vendorStore.id)
  );

  const vendorProducts = products.filter(
    (p) => p.vendorId === currentUser?.id || p.storeName === vendorStore.name || p.storeId === vendorStore.id
  );

  const totalGrossSales = vendorOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalCompletedOrders = vendorOrders.filter((o) => o.status === 'DELIVERED').length;

  return (
    <div className="space-y-6 text-[#0F0F0F]">
      {/* Welcome Banner */}
      <div className="bg-[#0F0F0F] text-white border border-[#202020] rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-[#202020] text-[#5DD62C] px-3 py-1 rounded-full text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Painel do Vendedor Moçambique
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white">
            Boas-vindas, {vendorStore.name}!
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 mt-1">
            Aqui está o resumo em tempo real das suas vendas, pedidos e saldo para levantamento.
          </p>
        </div>

        <button
          onClick={() => onNavigateTab('novo-produto')}
          className="bg-[#5DD62C] hover:bg-[#337418] text-[#0F0F0F] hover:text-white font-black px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition shadow-xs flex-shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Cadastrar Produto</span>
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Sales */}
        <div className="bg-white border border-gray-200 rounded-3xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500">Vendas Brutas</span>
            <div className="p-2 bg-[#5DD62C]/20 text-[#337418] rounded-xl">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-black text-[#0F0F0F] tracking-tight">
              {totalGrossSales.toLocaleString()} MT
            </p>
            <p className="text-[11px] text-gray-500 mt-1 flex items-center gap-1">
              <span className="text-[#337418] font-bold">100% repasse</span> garantido pela ALMAS-SHOP
            </p>
          </div>
        </div>

        {/* Available for Withdrawal */}
        <div className="bg-white border border-gray-200 rounded-3xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500">Saldo Disponível</span>
            <div className="p-2 bg-[#5DD62C]/20 text-[#337418] rounded-xl">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-black text-[#0F0F0F] tracking-tight">
              {wallet.availableBalance.toLocaleString()} MT
            </p>
            <button
              onClick={() => onNavigateTab('carteira')}
              className="text-[11px] text-[#337418] font-bold mt-1 hover:underline flex items-center gap-1"
            >
              Pedir Levantamento (M-Pesa/BIM) <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Pending Balance */}
        <div className="bg-white border border-gray-200 rounded-3xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500">Saldo a Confirmar</span>
            <div className="p-2 bg-amber-50 text-amber-700 rounded-xl">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-black text-[#0F0F0F] tracking-tight">
              {wallet.pendingBalance.toLocaleString()} MT
            </p>
            <p className="text-[11px] text-gray-500 mt-1">Libertado após entrega ao cliente</p>
          </div>
        </div>

        {/* Orders count */}
        <div className="bg-white border border-gray-200 rounded-3xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500">Total de Pedidos</span>
            <div className="p-2 bg-sky-50 text-sky-700 rounded-xl">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-black text-[#0F0F0F] tracking-tight">{vendorOrders.length}</p>
            <p className="text-[11px] text-gray-500 mt-1">{totalCompletedOrders} entregues com sucesso</p>
          </div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => onNavigateTab('novo-produto')}
          className="p-4 bg-white hover:bg-gray-50 border border-gray-200 rounded-2xl text-left transition shadow-xs group"
        >
          <div className="p-2 bg-[#5DD62C]/20 text-[#337418] rounded-xl w-fit group-hover:scale-110 transition">
            <PlusCircle className="w-4 h-4" />
          </div>
          <p className="font-bold text-xs text-[#0F0F0F] mt-2">Novo Produto</p>
          <p className="text-[10px] text-gray-500">Preço 'DE/POR' e variações</p>
        </button>

        <button
          onClick={() => onNavigateTab('produtos')}
          className="p-4 bg-white hover:bg-gray-50 border border-gray-200 rounded-2xl text-left transition shadow-xs group"
        >
          <div className="p-2 bg-gray-100 text-gray-700 rounded-xl w-fit group-hover:scale-110 transition">
            <Package className="w-4 h-4" />
          </div>
          <p className="font-bold text-xs text-[#0F0F0F] mt-2">Meus Produtos</p>
          <p className="text-[10px] text-gray-500">{vendorProducts.length} ativos no catálogo</p>
        </button>

        <button
          onClick={() => onNavigateTab('carteira')}
          className="p-4 bg-white hover:bg-gray-50 border border-gray-200 rounded-2xl text-left transition shadow-xs group"
        >
          <div className="p-2 bg-[#5DD62C]/20 text-[#337418] rounded-xl w-fit group-hover:scale-110 transition">
            <Wallet className="w-4 h-4" />
          </div>
          <p className="font-bold text-xs text-[#0F0F0F] mt-2">Levantamentos</p>
          <p className="text-[10px] text-gray-500">M-Pesa, e-Mola, BCI, BIM</p>
        </button>

        <button
          onClick={() => onNavigateTab('personalizar')}
          className="p-4 bg-white hover:bg-gray-50 border border-gray-200 rounded-2xl text-left transition shadow-xs group"
        >
          <div className="p-2 bg-gray-100 text-gray-700 rounded-xl w-fit group-hover:scale-110 transition">
            <Sliders className="w-4 h-4" />
          </div>
          <p className="font-bold text-xs text-[#0F0F0F] mt-2">Personalizar Loja</p>
          <p className="text-[10px] text-gray-500">Banner, logo e bio</p>
        </button>
      </div>

      {/* Recent Orders List in Vendor */}
      <div className="bg-white border border-gray-200 rounded-3xl p-5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
          <div>
            <h2 className="text-base font-bold text-[#0F0F0F]">Pedidos Recentes da Loja</h2>
            <p className="text-xs text-gray-500">Acompanhamento e envio</p>
          </div>
          <button
            onClick={() => onNavigateTab('vendas')}
            className="text-xs text-[#337418] font-bold hover:underline"
          >
            Ver todos
          </button>
        </div>

        {vendorOrders.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            <p className="text-xs">Nenhum pedido recebido ainda.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {vendorOrders.slice(0, 5).map((ord) => (
              <div
                key={ord.id}
                className="p-3.5 bg-gray-50 border border-gray-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[#0F0F0F]">{ord.id}</span>
                    <span className="text-gray-400">·</span>
                    <span className="text-gray-600 font-medium">{ord.shippingAddress?.fullName || ord.customerName}</span>
                  </div>
                  <p className="text-gray-500 text-[11px] mt-0.5">
                    {ord.shippingAddress?.neighborhood ? `${ord.shippingAddress.neighborhood}, ${ord.shippingAddress.city}` : 'Digital / Maputo'} · {ord.shippingAddress?.phone || ord.customerPhone}
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3">
                  <span className="font-black text-sm text-[#0F0F0F]">
                    {ord.totalAmount.toLocaleString()} MT
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      ord.status === 'DELIVERED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : ord.status === 'SHIPPED'
                        ? 'bg-sky-100 text-sky-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {ord.status === 'DELIVERED'
                      ? 'Entregue'
                      : ord.status === 'SHIPPED'
                      ? 'Em Rota'
                      : 'Pendente'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
