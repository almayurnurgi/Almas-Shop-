import React from 'react';
import {
  Store,
  Star,
  ShieldCheck,
  MapPin,
  Phone,
  MessageSquare,
  ArrowLeft,
  Grid
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ProductCard } from './ProductCard';

interface Props {
  slug: string;
}

export const StoreFrontView: React.FC<Props> = ({ slug }) => {
  const { stores, products, navigate } = useApp();

  const store = stores.find((s) => s.slug === slug) || stores[0];

  const storeProducts = products.filter(
    (p) => (p.storeId === store.id || p.storeName === store.name) && p.status === 'ACTIVE'
  );

  return (
    <div className="pb-24 space-y-6 text-[#0F0F0F]">
      {/* Top Breadcrumb */}
      <div className="bg-white border-b border-gray-200 py-2.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-xs font-semibold text-[#337418] hover:text-[#0F0F0F] transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Marketplace
          </button>
          <span className="text-xs text-gray-500 font-medium">Loja Parceira Verificada</span>
        </div>
      </div>

      {/* Store Banner & Info Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-xs">
          {/* Cover Banner */}
          <div className="relative h-44 sm:h-60 w-full bg-gray-100">
            <img
              src={store.banner || store.coverImage || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200'}
              alt={store.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
          </div>

          {/* Details below banner */}
          <div className="p-6 sm:p-8 -mt-16 sm:-mt-20 relative z-10 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
              <img
                src={store.logo || '/logo.svg'}
                alt={store.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-4 border-white bg-white shadow-md"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-[#0F0F0F]">{store.name}</h1>
                  <span className="bg-[#5DD62C]/20 text-[#337418] text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border border-[#5DD62C]/40">
                    <ShieldCheck className="w-3 h-3" /> Verificada
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#337418] font-bold">{store.slogan || 'Sua melhor escolha em Moçambique'}</p>
                <p className="text-xs text-gray-600 max-w-xl">{store.description}</p>
                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 pt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#337418]" /> {store.address || 'Maputo, Moçambique'}
                  </span>
                  <span className="flex items-center gap-1 text-amber-500 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" /> {(store.rating || 4.9).toFixed(1)} (
                    {store.salesCount || 10} vendas)
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Contacts */}
            <div className="flex items-center gap-2">
              <a
                href={`https://wa.me/258${(store.whatsapp || '843456786').replace(/\D/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="bg-[#5DD62C] hover:bg-[#337418] text-[#0F0F0F] hover:text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center gap-1.5 shadow-xs transition"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                WhatsApp
              </a>
              <a
                href={`tel:${store.phone || store.whatsapp || '843456786'}`}
                className="bg-white hover:bg-gray-100 border border-gray-300 text-[#0F0F0F] text-xs font-semibold py-2.5 px-4 rounded-xl flex items-center gap-1.5 transition"
              >
                <Phone className="w-3.5 h-3.5 text-[#337418]" />
                Ligar
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Catalog */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold text-[#0F0F0F] flex items-center gap-2">
            <Grid className="w-4 h-4 text-[#337418]" />
            Produtos Disponíveis ({storeProducts.length})
          </h2>
          <span className="text-xs text-[#337418] font-bold">Entrega Grátis em Maputo e Matola</span>
        </div>

        {storeProducts.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-3xl p-12 text-center shadow-xs">
            <Store className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-[#0F0F0F]">Nenhum produto publicado nesta loja no momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {storeProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
