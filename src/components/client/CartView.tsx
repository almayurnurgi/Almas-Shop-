import React from 'react';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, ShieldCheck, ArrowLeft } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CartView: React.FC = () => {
  const { cart, removeFromCart, updateCartQuantity, cartTotal, navigate } = useApp();

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center">
        <div className="w-20 h-20 bg-white border border-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-4 text-gray-400 shadow-xs">
          <ShoppingCart className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-[#0F0F0F] mb-2">O seu carrinho está vazio</h2>
        <p className="text-xs text-gray-500 mb-6 max-w-sm mx-auto">
          Explore as melhores ofertas de Moçambique com entrega grátis em Maputo e Matola.
        </p>
        <button
          onClick={() => navigate('/')}
          className="bg-[#5DD62C] hover:bg-[#337418] text-[#0F0F0F] hover:text-white font-black text-xs py-3 px-6 rounded-xl transition shadow-md"
        >
          Ir às Compras
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-28">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="p-2 bg-white border border-gray-200 rounded-xl text-gray-700 hover:text-[#0F0F0F] shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h1 className="text-xl sm:text-2xl font-black text-[#0F0F0F]">O Seu Carrinho</h1>
        </div>
        <span className="text-xs text-[#337418] font-bold">{cart.length} itens</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Items List */}
        <div className="lg:col-span-8 space-y-3">
          {cart.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center gap-4 shadow-xs"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 rounded-xl object-cover border border-gray-100 flex-shrink-0"
              />

              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-gray-500 font-semibold truncate">{item.storeName}</p>
                <h3 className="font-bold text-sm text-[#0F0F0F] truncate">{item.name}</h3>
                {item.variantName && (
                  <p className="text-[11px] text-[#337418] font-medium">Opção: {item.variantName}</p>
                )}
                <p className="text-xs font-black text-[#0F0F0F] mt-1">
                  {item.price.toLocaleString()} MT
                </p>
              </div>

              {/* Quantity controls */}
              <div className="flex flex-col items-end gap-2">
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-gray-400 hover:text-rose-600 transition p-1"
                  title="Remover"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-2 bg-[#F8F8F8] border border-gray-200 rounded-xl p-1">
                  <button
                    onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                    className="p-1 rounded-lg hover:bg-white text-gray-700"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-xs font-bold text-[#0F0F0F] px-1.5">{item.quantity}</span>
                  <button
                    onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                    className="p-1 rounded-lg hover:bg-white text-gray-700"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Box */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-gray-200 rounded-3xl p-5 shadow-sm space-y-4">
            <h2 className="font-bold text-base text-[#0F0F0F] border-b border-gray-100 pb-3">
              Resumo da Encomenda
            </h2>

            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal ({cart.length} itens):</span>
                <span className="font-bold text-[#0F0F0F]">{cartTotal.toLocaleString()} MT</span>
              </div>
              <div className="flex justify-between text-[#337418] font-semibold">
                <span>Taxa de Entrega (Maputo & Matola):</span>
                <span className="font-black uppercase">Grátis</span>
              </div>
              <div className="flex justify-between">
                <span>Modalidade de Pagamento:</span>
                <span className="text-[#0F0F0F] font-bold">No acto da entrega</span>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-between items-baseline">
              <span className="text-sm font-bold text-[#0F0F0F]">Total a Pagar:</span>
              <span className="text-xl font-black text-[#0F0F0F] tracking-tight">
                {cartTotal.toLocaleString()} MT
              </span>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full bg-[#5DD62C] hover:bg-[#337418] text-[#0F0F0F] hover:text-white font-black py-3.5 px-4 rounded-xl transition text-xs sm:text-sm shadow-md flex items-center justify-center gap-2"
            >
              <span>Avançar para Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="bg-[#F8F8F8] border border-gray-200 p-3 rounded-xl flex items-center gap-2 text-[11px] text-[#337418] font-semibold">
              <ShieldCheck className="w-4 h-4 flex-shrink-0" />
              <span>Garantia de satisfação ALMAS-SHOP com verificação na porta de sua casa.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
