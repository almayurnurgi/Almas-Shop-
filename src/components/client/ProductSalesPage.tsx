import React, { useState } from 'react';
import {
  ArrowLeft,
  Star,
  ShieldCheck,
  Truck,
  CheckCircle,
  HelpCircle,
  Share2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Store
} from 'lucide-react';
import { Product } from '../../types';
import { useApp } from '../../context/AppContext';

interface Props {
  slug: string;
}

export const ProductSalesPage: React.FC<Props> = ({ slug }) => {
  const { products, navigate, addToCart, setFlashBanner } = useApp();

  const product = products.find((p) => p.slug === slug) || products[0];

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    product?.variants && product.variants.length > 0 ? product.variants[0].id : ''
  );
  const [selectedKit, setSelectedKit] = useState<1 | 2 | 3>(1);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [activeTab, setActiveTab] = useState<'detalhes' | 'especificacoes' | 'avaliacoes' | 'garantia'>('detalhes');

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center">
        <h2 className="text-xl font-bold text-[#0F0F0F] mb-4">Produto não encontrado</h2>
        <button
          onClick={() => navigate('/')}
          className="bg-[#5DD62C] hover:bg-[#337418] text-[#0F0F0F] hover:text-white font-bold py-2.5 px-6 rounded-xl transition"
        >
          Voltar ao Marketplace
        </button>
      </div>
    );
  }

  const selectedVariant = product.variants?.find((v) => v.id === selectedVariantId);
  const basePrice = selectedVariant ? selectedVariant.price : product.salePrice;
  const currentImage = selectedVariant?.imageUrl || product.images[selectedImageIndex] || '/logo.svg';

  // Kit discount math
  const getKitPrice = (units: 1 | 2 | 3) => {
    if (units === 1) return basePrice;
    if (units === 2) return Math.round(basePrice * 2 * 0.9); // 10% off
    return Math.round(basePrice * 3 * 0.85); // 15% off
  };

  const handleBuyNow = () => {
    addToCart(product, selectedKit, selectedVariantId || undefined);
    navigate('/checkout');
  };

  const handleAddToCart = () => {
    addToCart(product, selectedKit, selectedVariantId || undefined);
  };

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setFlashBanner({ message: 'Link do produto copiado com sucesso!', type: 'success' });
    }
  };

  return (
    <div className="pb-28 bg-[#F8F8F8] text-[#0F0F0F]">
      {/* Top Breadcrumbs */}
      <div className="bg-white border-b border-gray-200 py-2.5 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-xs font-semibold text-gray-700 hover:text-[#337418] transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Marketplace
          </button>
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-[#337418] transition"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Partilhar</span>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-square w-full bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm">
              <img
                src={currentImage}
                alt={product.name}
                className="w-full h-full object-cover transition duration-200"
              />

              {/* Badges */}
              <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                <span className="bg-[#5DD62C] text-[#0F0F0F] font-black text-xs px-3 py-1 rounded-full shadow-xs">
                  -{product.discountPercent}% DESCONTO
                </span>
                {product.isBestSeller && (
                  <span className="bg-amber-400 text-[#0F0F0F] font-bold text-[11px] px-2.5 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Campeão de Vendas
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedImageIndex(idx);
                      // If the selected variant had its own specific image, resetting variant clears override
                      if (selectedVariant?.imageUrl) {
                        setSelectedVariantId('');
                      }
                    }}
                    className={`w-20 h-20 rounded-2xl overflow-hidden border-2 flex-shrink-0 transition bg-white ${
                      selectedImageIndex === idx && !selectedVariant?.imageUrl
                        ? 'border-[#5DD62C] shadow-sm scale-105'
                        : 'border-gray-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Trust Highlights */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-white border border-gray-200 rounded-2xl p-3 flex items-center gap-3 shadow-xs">
                <div className="p-2 bg-[#5DD62C]/20 rounded-xl text-[#337418]">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#0F0F0F]">Entrega Grátis</p>
                  <p className="text-[10px] text-gray-500">Maputo e Matola em 24h</p>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl p-3 flex items-center gap-3 shadow-xs">
                <div className="p-2 bg-[#5DD62C]/20 rounded-xl text-[#337418]">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#0F0F0F]">Pague na Entrega</p>
                  <p className="text-[10px] text-gray-500">Receba e teste primeiro</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Title, Pricing DE/POR, Variants, Kits & Actions */}
          <div className="lg:col-span-6 space-y-5">
            {/* Store & Rating */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Store className="w-4 h-4 text-[#337418]" />
                <span className="text-xs font-semibold text-[#0F0F0F]">{product.storeName}</span>
                <span className="text-[10px] bg-[#0F0F0F] text-white px-2 py-0.5 rounded-full font-medium">
                  Loja Verificada
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-500">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{product.rating.toFixed(1)}</span>
                <span className="text-gray-400 font-normal">({product.reviewsCount} avaliações)</span>
              </div>
            </div>

            {/* Product Title */}
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#0F0F0F] leading-tight">
              {product.name}
            </h1>

            {/* Price Box DE / POR */}
            <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center gap-3">
                {product.regularPrice > product.salePrice && (
                  <span className="text-sm sm:text-base text-gray-400 line-through font-medium">
                    DE {product.regularPrice.toLocaleString()} MT
                  </span>
                )}
                <span className="text-xs bg-[#5DD62C]/20 text-[#337418] font-bold px-2 py-0.5 rounded-full">
                  Economize {(product.regularPrice - product.salePrice).toLocaleString()} MT
                </span>
              </div>

              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-sm font-bold text-[#337418]">POR APENAS</span>
                <span className="text-2xl sm:text-3xl font-black text-[#0F0F0F] tracking-tight">
                  {getKitPrice(selectedKit).toLocaleString()} MT
                </span>
              </div>

              <p className="text-[11px] text-[#337418] mt-2 flex items-center gap-1.5 font-semibold">
                <CheckCircle className="w-3.5 h-3.5 text-[#337418]" />
                Em stock para envio imediato em Moçambique · Pagamento no acto da entrega
              </p>
            </div>

            {/* Variants Selector */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#0F0F0F] block">
                  Escolha a Opção / Modelo:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setSelectedVariantId(v.id)}
                      className={`p-3 rounded-2xl border text-xs text-left transition flex items-center justify-between cursor-pointer ${
                        selectedVariantId === v.id
                          ? 'border-[#5DD62C] bg-[#5DD62C]/10 text-[#0F0F0F] font-bold shadow-xs'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {v.imageUrl && (
                          <img src={v.imageUrl} alt={v.name} className="w-8 h-8 rounded-xl object-cover border border-gray-200" />
                        )}
                        <span>{v.name}</span>
                      </div>
                      <span className="text-[#337418] font-black">{v.price.toLocaleString()} MT</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Special Kits Offer Selector */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#0F0F0F]">
                  Kits Promocionais com Desconto Progressivo:
                </label>
                <span className="text-[10px] text-amber-700 font-semibold">Oferta por tempo limitado</span>
              </div>

              <div className="space-y-2">
                <div
                  onClick={() => setSelectedKit(1)}
                  className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between text-xs transition ${
                    selectedKit === 1
                      ? 'border-[#5DD62C] bg-[#5DD62C]/10 text-[#0F0F0F] shadow-xs'
                      : 'border-gray-200 bg-white text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      checked={selectedKit === 1}
                      onChange={() => setSelectedKit(1)}
                      className="accent-[#337418]"
                    />
                    <div>
                      <p className="font-bold text-[#0F0F0F]">1 Unidade (Padrão)</p>
                      <p className="text-[10px] text-gray-500">Preço normal de marketplace</p>
                    </div>
                  </div>
                  <span className="font-extrabold text-sm text-[#0F0F0F]">
                    {getKitPrice(1).toLocaleString()} MT
                  </span>
                </div>

                <div
                  onClick={() => setSelectedKit(2)}
                  className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between text-xs transition relative overflow-hidden ${
                    selectedKit === 2
                      ? 'border-[#5DD62C] bg-[#5DD62C]/10 text-[#0F0F0F] shadow-xs'
                      : 'border-gray-200 bg-white text-gray-700'
                  }`}
                >
                  <div className="absolute top-0 right-0 bg-[#5DD62C] text-[#0F0F0F] text-[9px] font-extrabold px-2 py-0.5 rounded-bl-lg">
                    MAIS VENDIDO (10% OFF)
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      checked={selectedKit === 2}
                      onChange={() => setSelectedKit(2)}
                      className="accent-[#337418]"
                    />
                    <div>
                      <p className="font-bold text-[#0F0F0F]">Kit 2 Unidades</p>
                      <p className="text-[10px] text-[#337418] font-medium">Pague menos por unidade</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-sm text-[#0F0F0F]">
                      {getKitPrice(2).toLocaleString()} MT
                    </span>
                    <p className="text-[9px] text-gray-400 line-through">
                      {(basePrice * 2).toLocaleString()} MT
                    </p>
                  </div>
                </div>

                <div
                  onClick={() => setSelectedKit(3)}
                  className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between text-xs transition ${
                    selectedKit === 3
                      ? 'border-[#5DD62C] bg-[#5DD62C]/10 text-[#0F0F0F] shadow-xs'
                      : 'border-gray-200 bg-white text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      checked={selectedKit === 3}
                      onChange={() => setSelectedKit(3)}
                      className="accent-[#337418]"
                    />
                    <div>
                      <p className="font-bold text-[#0F0F0F]">Kit 3 Unidades (Super Pack)</p>
                      <p className="text-[10px] text-amber-700 font-medium">15% de Desconto total</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-sm text-[#0F0F0F]">
                      {getKitPrice(3).toLocaleString()} MT
                    </span>
                    <p className="text-[9px] text-gray-400 line-through">
                      {(basePrice * 3).toLocaleString()} MT
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Action Buttons (Pill style) */}
            <div className="hidden sm:grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={handleAddToCart}
                className="bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-[#5DD62C] text-[#0F0F0F] font-bold py-3.5 px-6 rounded-full transition text-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                Adicionar ao Carrinho
              </button>
              <button
                type="button"
                onClick={handleBuyNow}
                className="bg-[#5DD62C] hover:bg-[#337418] text-[#0F0F0F] hover:text-white font-black py-3.5 px-6 rounded-full transition text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                Comprar Agora
              </button>
            </div>
          </div>
        </div>

        {/* 4 Rich Description Tabs: Detalhes, Especificações, Avaliações, Garantia */}
        <div className="mt-12 bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-3 border-b border-gray-200 pb-3 overflow-x-auto">
            <button
              onClick={() => setActiveTab('detalhes')}
              className={`pb-2 px-4 text-xs sm:text-sm font-black transition border-b-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'detalhes'
                  ? 'border-[#5DD62C] text-[#0F0F0F]'
                  : 'border-transparent text-gray-400 hover:text-gray-700'
              }`}
            >
              Detalhes
            </button>
            <button
              onClick={() => setActiveTab('especificacoes')}
              className={`pb-2 px-4 text-xs sm:text-sm font-black transition border-b-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'especificacoes'
                  ? 'border-[#5DD62C] text-[#0F0F0F]'
                  : 'border-transparent text-gray-400 hover:text-gray-700'
              }`}
            >
              Especificações
            </button>
            <button
              onClick={() => setActiveTab('avaliacoes')}
              className={`pb-2 px-4 text-xs sm:text-sm font-black transition border-b-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'avaliacoes'
                  ? 'border-[#5DD62C] text-[#0F0F0F]'
                  : 'border-transparent text-gray-400 hover:text-gray-700'
              }`}
            >
              Avaliações ({product.reviewsCount})
            </button>
            <button
              onClick={() => setActiveTab('garantia')}
              className={`pb-2 px-4 text-xs sm:text-sm font-black transition border-b-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'garantia'
                  ? 'border-[#5DD62C] text-[#0F0F0F]'
                  : 'border-transparent text-gray-400 hover:text-gray-700'
              }`}
            >
              Garantia & Entrega
            </button>
          </div>

          <div className="pt-6">
            {/* Detalhes Tab */}
            {activeTab === 'detalhes' && (
              <div className="text-gray-700 text-sm leading-relaxed space-y-4">
                <p>{product.description}</p>
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-2 mt-4">
                  <h4 className="font-black text-[#0F0F0F] text-xs uppercase tracking-wider">
                    Informações de Envio & Apoio:
                  </h4>
                  <ul className="text-xs text-gray-600 space-y-1.5 list-disc pl-5">
                    <li>Entrega gratuita nas cidades de <strong>Maputo e Matola</strong> em até 24h.</li>
                    <li>Envio seguro para todas as restantes províncias de Moçambique.</li>
                    <li>Apoio local via WhatsApp: <strong>+258 83 546 6322</strong> e telemóvel: <strong>843456786</strong>.</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Especificações Tab */}
            {activeTab === 'especificacoes' && (
              <div className="max-w-2xl">
                <div className="divide-y divide-gray-200 border border-gray-200 rounded-2xl overflow-hidden bg-white text-xs">
                  <div className="flex justify-between p-3.5 bg-gray-50">
                    <span className="font-bold text-gray-500">Código SKU</span>
                    <span className="font-mono text-[#0F0F0F]">{product.sku}</span>
                  </div>
                  <div className="flex justify-between p-3.5">
                    <span className="font-bold text-gray-500">Categoria</span>
                    <span className="text-[#0F0F0F] font-semibold">{product.category}</span>
                  </div>
                  <div className="flex justify-between p-3.5 bg-gray-50">
                    <span className="font-bold text-gray-500">Tipo de Produto</span>
                    <span className="text-[#0F0F0F]">{product.type === 'DIGITAL' ? 'Produto Digital' : 'Produto Físico'}</span>
                  </div>
                  <div className="flex justify-between p-3.5">
                    <span className="font-bold text-gray-500">Peso Aproximado</span>
                    <span className="text-[#0F0F0F]">{product.weightKg ? `${product.weightKg} kg` : '0.5 kg'}</span>
                  </div>
                  <div className="flex justify-between p-3.5 bg-gray-50">
                    <span className="font-bold text-gray-500">Loja Fornecedora</span>
                    <span className="text-[#0F0F0F] font-semibold">{product.storeName}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Avaliações Tab */}
            {activeTab === 'avaliacoes' && (
              <div className="space-y-4 max-w-3xl">
                <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-200">
                  <div className="text-center">
                    <div className="text-3xl font-black text-[#0F0F0F]">{product.rating.toFixed(1)}</div>
                    <div className="flex text-amber-400 justify-center">
                      <Star className="w-4 h-4 fill-amber-400" />
                      <Star className="w-4 h-4 fill-amber-400" />
                      <Star className="w-4 h-4 fill-amber-400" />
                      <Star className="w-4 h-4 fill-amber-400" />
                      <Star className="w-4 h-4 fill-amber-400" />
                    </div>
                    <p className="text-[10px] text-gray-500 mt-1">Classificação média</p>
                  </div>
                  <div className="border-l border-gray-200 pl-4 text-xs text-gray-600">
                    <p className="font-bold text-[#0F0F0F] mb-1">Compradores Satisfeitos em Moçambique</p>
                    <p>Todos os clientes verificados que encomendaram pela ALMAS-SHOP com entrega porta-a-porta.</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="p-3.5 bg-gray-50 border border-gray-200 rounded-2xl">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-[#0F0F0F]">Orlando Vilanculos (Maputo)</span>
                      <span className="text-[10px] text-gray-400">15 de Setembro de 2026</span>
                    </div>
                    <div className="flex text-amber-400 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400" />
                      ))}
                    </div>
                    <p className="text-xs text-gray-600">
                      Chegou impecável em menos de 24 horas na Sommerschield. Paguei ao motorista com M-Pesa. Excelente serviço!
                    </p>
                  </div>

                  <div className="p-3.5 bg-gray-50 border border-gray-200 rounded-2xl">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-[#0F0F0F]">Sheila Manhiça (Matola 700)</span>
                      <span className="text-[10px] text-gray-400">12 de Setembro de 2026</span>
                    </div>
                    <div className="flex text-amber-400 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400" />
                      ))}
                    </div>
                    <p className="text-xs text-gray-600">
                      Qualidade exatamente como descrita. Muito satisfeita com a facilidade da compra sem burocracia.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Garantia & Entrega Tab */}
            {activeTab === 'garantia' && (
              <div className="space-y-4 max-w-2xl text-xs text-gray-700 leading-relaxed">
                <div className="p-4 bg-emerald-50 border border-[#5DD62C]/40 rounded-2xl">
                  <h4 className="font-black text-[#337418] text-sm mb-2 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" />
                    Garantia Total de Satisfação ALMAS-SHOP
                  </h4>
                  <p>
                    Compre com 100% de tranquilidade. Você confere o produto no acto da entrega e só faz o pagamento após aprovar o item.
                  </p>
                </div>
                <div className="space-y-2">
                  <p><strong>Troca & Devolução:</strong> Até 7 dias corridos para solicitar troca imediata caso identifique qualquer anomalia de fabricação.</p>
                  <p><strong>Suporte Direto:</strong> Email: <code>yuriscandarnurgi@gmail.com</code> | WhatsApp: <code>+258 83 546 6322</code> | Tel: <code>843456786</code></p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fixed / Sticky Bottom Bar on Mobile with Floating Pill CTA */}
      <div className="sm:hidden fixed bottom-14 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-gray-200 p-3 shadow-xl safe-bottom">
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={handleAddToCart}
            className="bg-gray-100 hover:bg-gray-200 text-[#0F0F0F] font-bold text-xs py-3 px-4 rounded-full border border-gray-200 cursor-pointer"
          >
            + Carrinho
          </button>
          <button
            onClick={handleBuyNow}
            className="flex-1 bg-[#5DD62C] hover:bg-[#337418] text-[#0F0F0F] hover:text-white font-black text-xs py-3 px-4 rounded-full shadow-md transition cursor-pointer"
          >
            Comprar Agora — {getKitPrice(selectedKit).toLocaleString()} MT
          </button>
        </div>
      </div>
    </div>
  );
};
