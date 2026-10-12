import React, { useState } from 'react';
import {
  TrendingUp,
  Search,
  Filter,
  Phone,
  MessageSquare,
  Truck,
  CheckCircle,
  Clock,
  MapPin,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { OrderStatus } from '../../types';

export const VendorOrders: React.FC = () => {
  const { orders, currentUser, stores, updateOrderStatus, setFlashBanner } = useApp();
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const vendorStore =
    stores.find((s) => s.vendorId === currentUser?.id || s.vendorId === 'user_vendor_1') || stores[0];

  const vendorOrders = orders.filter(
    (o) => o.vendorIds.includes(currentUser?.id || 'user_vendor_1') || o.vendorIds.includes(vendorStore.id)
  );

  const filtered = vendorOrders.filter((o) => {
    const matchesStatus = statusFilter === 'ALL' || o.status === statusFilter;
    const matchesSearch =
      !searchTerm ||
      o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerPhone.includes(searchTerm);
    return matchesStatus && matchesSearch;
  });

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus);
    setFlashBanner({
      message: `Status do pedido atualizado para ${newStatus}`,
      type: 'success'
    });
  };

  return (
    <div className="space-y-6 text-[#0F0F0F]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#0F0F0F] flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-[#337418]" />
            Gestão de Pedidos & Vendas ({vendorOrders.length})
          </h1>
          <p className="text-xs text-gray-500">
            Acompanhe pedidos recebidos, contacte clientes e despache entregas para Maputo e Matola.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Buscar por cliente, telefone ou Nº do pedido..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#F8F8F8] border border-gray-300 focus:border-[#5DD62C] text-xs text-[#0F0F0F] rounded-xl py-2 pl-9 pr-3 focus:outline-none"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-gray-500 font-semibold">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#F8F8F8] border border-gray-300 text-xs text-[#0F0F0F] font-semibold rounded-xl py-2 px-3 focus:outline-none"
          >
            <option value="ALL">Todos os Pedidos</option>
            <option value="PENDING">Pendentes</option>
            <option value="PREPARING">Em Preparação</option>
            <option value="SHIPPED">A Caminho (Estafeta)</option>
            <option value="DELIVERED">Entregues com Sucesso</option>
            <option value="CANCELLED">Cancelados</option>
          </select>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-3xl p-12 text-center shadow-xs">
            <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-[#0F0F0F] mb-1">Nenhum pedido neste filtro</h3>
            <p className="text-xs text-gray-500">
              Novos pedidos aparecerão aqui imediatamente após a confirmação do cliente.
            </p>
          </div>
        ) : (
          filtered.map((order) => (
            <div
              key={order.id}
              className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs space-y-4"
            >
              {/* Top Row: Order Number, Date & UTM */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-black text-[#0F0F0F]">#{order.orderNumber}</span>
                  <span className="text-[11px] text-gray-500">
                    {new Date(order.createdAt).toLocaleString('pt-PT')}
                  </span>
                  {order.utmSource && (
                    <span className="text-[10px] bg-[#5DD62C]/20 text-[#337418] px-2 py-0.5 rounded font-mono font-bold">
                      UTM: {order.utmSource} / {order.utmCampaign || 'campanha'}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 font-semibold">Alterar Status:</span>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                    className="bg-[#F8F8F8] border border-gray-300 text-xs font-bold text-[#0F0F0F] rounded-xl py-1.5 px-3 focus:outline-none"
                  >
                    <option value="PENDING">Pendente</option>
                    <option value="PREPARING">Em Preparação</option>
                    <option value="SHIPPED">Enviado com Estafeta</option>
                    <option value="DELIVERED">Entregue (Concluído)</option>
                    <option value="CANCELLED">Cancelado</option>
                  </select>
                </div>
              </div>

              {/* Middle Row: Items & Customer details */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                {/* Items */}
                <div className="md:col-span-7 space-y-2">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    Itens da Encomenda
                  </span>
                  {order.items.map((it, idx) => (
                    <div
                      key={idx}
                      className="bg-[#F8F8F8] p-2.5 rounded-xl flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={it.productImage}
                          alt={it.productName}
                          className="w-10 h-10 rounded-lg object-cover border border-gray-200"
                        />
                        <div>
                          <p className="font-semibold text-[#0F0F0F]">{it.productName}</p>
                          <p className="text-[10px] text-gray-500">
                            Qtd: {it.quantity} {it.variantName ? `(${it.variantName})` : ''}
                          </p>
                        </div>
                      </div>
                      <span className="font-bold text-[#0F0F0F]">
                        {(it.price * it.quantity).toLocaleString()} MT
                      </span>
                    </div>
                  ))}
                  <div className="text-right pt-1">
                    <span className="text-xs text-gray-500">Valor Total do Pedido: </span>
                    <strong className="text-sm font-black text-[#337418]">
                      {order.totalAmount.toLocaleString()} MT
                    </strong>
                  </div>
                </div>

                {/* Customer and Delivery Location */}
                <div className="md:col-span-5 bg-[#F8F8F8] border border-gray-200 rounded-xl p-3.5 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#337418]">Dados de Entrega</span>
                    <span className="text-[10px] text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full font-semibold">Pagamento na Entrega</span>
                  </div>

                  <p className="text-[#0F0F0F] font-bold">{order.customerName}</p>

                  <div className="flex items-center gap-2 pt-1">
                    <a
                      href={`tel:${order.customerPhone}`}
                      className="bg-white hover:bg-gray-100 border border-gray-300 text-[#0F0F0F] px-2.5 py-1 rounded-lg text-[11px] flex items-center gap-1 transition shadow-xs"
                    >
                      <Phone className="w-3 h-3 text-[#337418]" />
                      Ligar ({order.customerPhone})
                    </a>
                    <a
                      href={`https://wa.me/258${order.customerPhone.replace(/\D/g, '')}?text=Olá%20${encodeURIComponent(order.customerName)},%20somos%20da%20ALMAS-SHOP%20a%20respeito%20da%20sua%20encomenda%20%23${order.orderNumber}`}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-[#5DD62C] hover:bg-[#337418] text-[#0F0F0F] hover:text-white px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition shadow-xs"
                    >
                      <MessageSquare className="w-3 h-3" />
                      WhatsApp
                    </a>
                  </div>

                  <div className="text-[11px] text-gray-600 pt-1 border-t border-gray-200">
                    <p className="flex items-center gap-1 text-gray-700 font-medium">
                      <MapPin className="w-3 h-3 text-[#337418]" />
                      {order.shippingAddress.city} - {order.shippingAddress.neighborhood}
                    </p>
                    {order.shippingAddress.street && (
                      <p className="text-gray-500 pl-4">{order.shippingAddress.street}</p>
                    )}
                    {order.shippingAddress.referencePoint && (
                      <p className="text-amber-700 pl-4 font-medium">Ref: {order.shippingAddress.referencePoint}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
