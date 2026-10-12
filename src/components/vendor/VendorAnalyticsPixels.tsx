import React, { useState } from 'react';
import {
  BarChart3,
  Code,
  Calendar,
  Filter,
  Save,
  CheckCircle,
  ExternalLink,
  Sparkles,
  TrendingUp,
  Globe
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const VendorAnalyticsPixels: React.FC = () => {
  const { orders, currentUser, stores, updateStore, setFlashBanner } = useApp();

  const currentStore =
    stores.find((s) => s.vendorId === currentUser?.id || s.vendorId === 'user_vendor_1') || stores[0];

  const [period, setPeriod] = useState<'HOJE' | '7_DIAS' | '30_DIAS' | '90_DIAS' | 'TODOS'>('30_DIAS');

  // Tracking Pixels state
  const [metaPixelId, setMetaPixelId] = useState(currentStore.metaPixelId || '987654321012345');
  const [tiktokPixelId, setTiktokPixelId] = useState(currentStore.tiktokPixelId || 'C987654321MZ');
  const [googleAnalyticsId, setGoogleAnalyticsId] = useState(currentStore.googleAnalyticsId || 'G-ALMAS992MZ');

  const vendorOrders = orders.filter(
    (o) => o.vendorIds.includes(currentUser?.id || 'user_vendor_1') || o.vendorIds.includes(currentStore.id)
  );

  // Group by UTM Source
  const utmStats = vendorOrders.reduce((acc: Record<string, { count: number; total: number }>, o) => {
    const src = o.utmSource || 'direct';
    if (!acc[src]) {
      acc[src] = { count: 0, total: 0 };
    }
    acc[src].count += 1;
    acc[src].total += o.totalAmount;
    return acc;
  }, {});

  const handleSavePixels = (e: React.FormEvent) => {
    e.preventDefault();
    updateStore(currentStore.id, {
      metaPixelId,
      tiktokPixelId,
      googleAnalyticsId
    });
    setFlashBanner({
      message: 'Configurações de Pixels e Rastreio salvas com sucesso!',
      type: 'success'
    });
  };

  return (
    <div className="space-y-6 text-[#0F0F0F]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#0F0F0F] flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-[#337418]" />
            Analytics de Tráfego & Pixels de Rastreio
          </h1>
          <p className="text-xs text-gray-500">
            Acompanhe o retorno das suas campanhas de anúncios em Moçambique e configure tags do Meta, TikTok e GA4.
          </p>
        </div>

        {/* Period Selector */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-gray-200 text-xs shadow-xs">
          <Calendar className="w-3.5 h-3.5 text-[#337418] ml-2" />
          <button
            onClick={() => setPeriod('HOJE')}
            className={`px-2.5 py-1 rounded-lg transition ${
              period === 'HOJE' ? 'bg-[#5DD62C] text-[#0F0F0F] font-bold shadow-xs' : 'text-gray-500 hover:text-[#0F0F0F]'
            }`}
          >
            Hoje
          </button>
          <button
            onClick={() => setPeriod('7_DIAS')}
            className={`px-2.5 py-1 rounded-lg transition ${
              period === '7_DIAS' ? 'bg-[#5DD62C] text-[#0F0F0F] font-bold shadow-xs' : 'text-gray-500 hover:text-[#0F0F0F]'
            }`}
          >
            7 Dias
          </button>
          <button
            onClick={() => setPeriod('30_DIAS')}
            className={`px-2.5 py-1 rounded-lg transition ${
              period === '30_DIAS' ? 'bg-[#5DD62C] text-[#0F0F0F] font-bold shadow-xs' : 'text-gray-500 hover:text-[#0F0F0F]'
            }`}
          >
            30 Dias
          </button>
          <button
            onClick={() => setPeriod('90_DIAS')}
            className={`px-2.5 py-1 rounded-lg transition ${
              period === '90_DIAS' ? 'bg-[#5DD62C] text-[#0F0F0F] font-bold shadow-xs' : 'text-gray-500 hover:text-[#0F0F0F]'
            }`}
          >
            90 Dias
          </button>
        </div>
      </div>

      {/* UTM Sources Breakdown */}
      <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-xs space-y-4">
        <h3 className="text-sm sm:text-base font-bold text-[#0F0F0F] flex items-center gap-2">
          <Globe className="w-4 h-4 text-[#337418]" />
          Desempenho por Canal de Aquisição (UTM Source)
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-700">
            <thead className="bg-[#F8F8F8] text-gray-500 uppercase text-[10px]">
              <tr>
                <th className="p-3 rounded-l-xl">Canal / Fonte (utm_source)</th>
                <th className="p-3">Pedidos Gerados</th>
                <th className="p-3">Volume de Vendas (MT)</th>
                <th className="p-3 rounded-r-xl">Ticket Médio</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {Object.keys(utmStats).map((sourceKey) => {
                const stat = utmStats[sourceKey];
                const avgTicket = stat.count > 0 ? Math.round(stat.total / stat.count) : 0;
                return (
                  <tr key={sourceKey} className="hover:bg-gray-50 transition">
                    <td className="p-3 font-bold text-[#0F0F0F] flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#5DD62C]"></span>
                      {sourceKey}
                    </td>
                    <td className="p-3 font-semibold text-gray-600">{stat.count} pedidos</td>
                    <td className="p-3 font-black text-[#0F0F0F] text-sm">
                      {stat.total.toLocaleString()} MT
                    </td>
                    <td className="p-3 text-gray-600 font-mono">
                      {avgTicket.toLocaleString()} MT
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pixels Configuration Form */}
      <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm sm:text-base font-bold text-[#0F0F0F] flex items-center gap-2">
            <Code className="w-4 h-4 text-[#337418]" />
            Configuração de Pixels de Conversão
          </h3>
          <span className="text-[11px] text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full font-semibold">
            Disparo Automático no Checkout
          </span>
        </div>

        <p className="text-xs text-gray-500">
          Insira os IDs dos seus pixels para rastrear eventos de visualização (PageView), adição ao carrinho (AddToCart) e compra finalizada (Purchase) no Facebook, Instagram e TikTok.
        </p>

        <form onSubmit={handleSavePixels} className="space-y-4 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">
                Meta Pixel ID (Facebook / Instagram)
              </label>
              <input
                type="text"
                placeholder="Ex: 123456789012345"
                value={metaPixelId}
                onChange={(e) => setMetaPixelId(e.target.value)}
                className="w-full bg-[#F8F8F8] border border-gray-300 focus:border-[#5DD62C] text-xs text-[#0F0F0F] rounded-xl p-3 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">
                TikTok Pixel ID
              </label>
              <input
                type="text"
                placeholder="Ex: C8XXXXXXXXXXXXX"
                value={tiktokPixelId}
                onChange={(e) => setTiktokPixelId(e.target.value)}
                className="w-full bg-[#F8F8F8] border border-gray-300 focus:border-[#5DD62C] text-xs text-[#0F0F0F] rounded-xl p-3 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">
                Google Analytics 4 (GA4 ID)
              </label>
              <input
                type="text"
                placeholder="Ex: G-XXXXXXXXXX"
                value={googleAnalyticsId}
                onChange={(e) => setGoogleAnalyticsId(e.target.value)}
                className="w-full bg-[#F8F8F8] border border-gray-300 focus:border-[#5DD62C] text-xs text-[#0F0F0F] rounded-xl p-3 focus:outline-none font-mono"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="bg-[#5DD62C] hover:bg-[#337418] text-[#0F0F0F] hover:text-white font-black text-xs py-2.5 px-6 rounded-xl shadow-xs flex items-center gap-2 transition"
            >
              <Save className="w-4 h-4" />
              Salvar Configurações de Pixels
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
