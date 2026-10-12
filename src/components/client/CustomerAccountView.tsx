import React, { useState } from 'react';
import {
  Package,
  Clock,
  CheckCircle,
  Truck,
  Download,
  Phone,
  Mail,
  MessageSquare,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CustomerAccountView: React.FC = () => {
  const { orders, currentUser, settings, navigate, openAuthModal, logoutUser } = useApp();
  const [activeTab, setActiveTab] = useState<'pedidos' | 'downloads' | 'suporte'>('pedidos');

  // Customer's orders
  const myOrders = orders.filter(
    (o) => o.customerId === currentUser?.id || o.customerEmail === currentUser?.email
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return (
          <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1">
            <CheckCircle className="w-3 h-3" /> Entregue
          </span>
        );
      case 'SHIPPED':
        return (
          <span className="bg-sky-100 text-sky-800 border border-sky-300 px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1">
            <Truck className="w-3 h-3" /> A Caminho (Estafeta)
          </span>
        );
      case 'PREPARING':
        return (
          <span className="bg-amber-100 text-amber-800 border border-amber-300 px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1">
            <Clock className="w-3 h-3" /> Em Preparação
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="bg-rose-100 text-rose-800 border border-rose-300 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
            Cancelado
          </span>
        );
      default:
        return (
          <span className="bg-amber-100 text-amber-800 border border-amber-300 px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1">
            <Clock className="w-3 h-3" /> Pendente
          </span>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-28 space-y-6 text-[#0F0F0F]">
      {/* Profile Header */}
      <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-xs flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <img
            src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'}
            alt={currentUser?.name || 'Cliente'}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-[#5DD62C]"
          />
          <div>
            <h1 className="text-xl font-bold text-[#0F0F0F]">{currentUser?.name || 'Cliente ALMAS-SHOP'}</h1>
            <p className="text-xs text-[#337418] font-semibold">{currentUser?.email}</p>
            <p className="text-[11px] text-gray-500 mt-0.5">
              Contacto registado: {currentUser?.phone || '84 345 6786'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap justify-end">
          <span className="text-[11px] bg-[#5DD62C]/20 text-[#337418] font-bold px-3 py-1.5 rounded-full border border-[#5DD62C]/40">
            Cliente Verificado Moçambique
          </span>
          {currentUser ? (
            <button
              onClick={logoutUser}
              className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-3 py-1.5 rounded-full border border-gray-300 transition"
            >
              Terminar Sessão
            </button>
          ) : (
            <button
              onClick={() => openAuthModal('CUSTOMER', 'LOGIN')}
              className="text-xs bg-[#5DD62C] hover:bg-[#337418] text-[#0F0F0F] hover:text-white font-black px-4 py-1.5 rounded-full transition shadow-xs"
            >
              Entrar ou Registar
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-3 text-xs font-bold">
        <button
          onClick={() => setActiveTab('pedidos')}
          className={`py-2 px-4 rounded-xl transition ${
            activeTab === 'pedidos'
              ? 'bg-[#5DD62C] text-[#0F0F0F] shadow-xs'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Meus Pedidos ({myOrders.length})
        </button>
        <button
          onClick={() => setActiveTab('downloads')}
          className={`py-2 px-4 rounded-xl transition ${
            activeTab === 'downloads'
              ? 'bg-[#5DD62C] text-[#0F0F0F] shadow-xs'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Downloads Digitais
        </button>
        <button
          onClick={() => setActiveTab('suporte')}
          className={`py-2 px-4 rounded-xl transition ${
            activeTab === 'suporte'
              ? 'bg-[#5DD62C] text-[#0F0F0F] shadow-xs'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Apoio ao Cliente
        </button>
      </div>

      {/* Content */}
      {activeTab === 'pedidos' && (
        <div className="space-y-4">
          {myOrders.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-3xl p-8 text-center shadow-xs">
              <Package className="w-10 h-10 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-bold text-[#0F0F0F] mb-1">Ainda não realizou nenhum pedido</p>
              <p className="text-xs text-gray-500 mb-4">
                Explore o catálogo de produtos e faça a sua primeira compra com entrega grátis.
              </p>
              <button
                onClick={() => navigate('/')}
                className="bg-[#5DD62C] hover:bg-[#337418] text-[#0F0F0F] hover:text-white font-black text-xs py-2.5 px-5 rounded-xl shadow-xs transition"
              >
                Ver Produtos
              </button>
            </div>
          ) : (
            myOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-gray-100">
                  <div>
                    <span className="text-xs font-bold text-[#0F0F0F]">Pedido #{order.orderNumber}</span>
                    <span className="text-[11px] text-gray-500 ml-2">
                      {new Date(order.createdAt).toLocaleDateString('pt-PT')}
                    </span>
                  </div>
                  <div>{getStatusBadge(order.status)}</div>
                </div>

                {/* Items */}
                <div className="space-y-2">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.productImage}
                          alt={item.productName}
                          className="w-12 h-12 rounded-xl object-cover border border-gray-200"
                        />
                        <div>
                          <p className="font-semibold text-[#0F0F0F]">{item.productName}</p>
                          <p className="text-[11px] text-[#337418] font-bold">{item.storeName}</p>
                          <p className="text-[10px] text-gray-500">Qtd: {item.quantity}</p>
                        </div>
                      </div>
                      <span className="font-bold text-[#0F0F0F]">
                        {(item.price * item.quantity).toLocaleString()} MT
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between text-xs text-gray-600">
                  <div>
                    <span>Destino: </span>
                    <strong className="text-[#0F0F0F]">
                      {order.shippingAddress.city}, {order.shippingAddress.neighborhood}
                    </strong>
                  </div>
                  <div>
                    <span>Total: </span>
                    <strong className="text-base font-black text-[#337418]">
                      {order.totalAmount.toLocaleString()} MT
                    </strong>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'downloads' && (
        <div className="bg-white border border-gray-200 rounded-3xl p-6 space-y-4 shadow-xs">
          <h3 className="text-sm font-bold text-[#0F0F0F] flex items-center gap-2">
            <Download className="w-4 h-4 text-[#337418]" />
            Seus Produtos Digitais Adquiridos
          </h3>
          <div className="p-4 bg-[#F8F8F8] border border-gray-200 rounded-2xl flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-[#0F0F0F]">
                Guia Completo de Negócios e Vendas Online em Moçambique
              </h4>
              <p className="text-[10px] text-[#337418] font-semibold">Formato PDF + Modelos de Contratos e Anúncios</p>
            </div>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                alert('Iniciando download seguro do Guia de Negócios ALMAS-SHOP (PDF).');
              }}
              className="bg-[#5DD62C] hover:bg-[#337418] text-[#0F0F0F] hover:text-white font-bold text-xs py-2 px-3 rounded-xl transition flex items-center gap-1.5 shadow-xs"
            >
              <Download className="w-3.5 h-3.5" /> Baixar
            </a>
          </div>
        </div>
      )}

      {activeTab === 'suporte' && (
        <div className="bg-white border border-gray-200 rounded-3xl p-6 space-y-4 shadow-xs">
          <h3 className="text-sm font-bold text-[#0F0F0F] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#337418]" />
            Canais Oficiais de Atendimento em Moçambique
          </h3>
          <p className="text-xs text-gray-500">
            Tem dúvidas sobre o seu pedido, troca, devolução ou entregas em Maputo e Matola? Estamos à sua disposição.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
            <a
              href="https://wa.me/258835466322"
              target="_blank"
              rel="noreferrer"
              className="p-4 bg-[#F8F8F8] border border-gray-200 hover:border-[#5DD62C] rounded-2xl flex flex-col items-center text-center gap-2 text-emerald-700 transition"
            >
              <MessageSquare className="w-6 h-6 text-emerald-600" />
              <div>
                <p className="font-bold text-[#0F0F0F]">WhatsApp Suporte</p>
                <p className="text-[11px] text-gray-500">+258 83 546 6322</p>
              </div>
            </a>

            <a
              href={`tel:${settings.supportPhone}`}
              className="p-4 bg-[#F8F8F8] border border-gray-200 hover:border-[#5DD62C] rounded-2xl flex flex-col items-center text-center gap-2 text-[#337418] transition"
            >
              <Phone className="w-6 h-6" />
              <div>
                <p className="font-bold text-[#0F0F0F]">Linha Telefónica / M-Pesa</p>
                <p className="text-[11px] text-gray-500">{settings.supportPhone}</p>
              </div>
            </a>

            <a
              href={`mailto:${settings.supportEmail}`}
              className="p-4 bg-[#F8F8F8] border border-gray-200 hover:border-[#5DD62C] rounded-2xl flex flex-col items-center text-center gap-2 text-gray-700 transition"
            >
              <Mail className="w-6 h-6 text-[#337418]" />
              <div>
                <p className="font-bold text-[#0F0F0F]">Email</p>
                <p className="text-[11px] text-gray-500">{settings.supportEmail}</p>
              </div>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
