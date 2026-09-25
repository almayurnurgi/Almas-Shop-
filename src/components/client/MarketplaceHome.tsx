import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ShoppingBag,
  TrendingUp,
  Tag,
  Grid,
  ArrowRight,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Zap,
  CheckCircle2,
  Search
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ProductCard } from './ProductCard';

export const MarketplaceHome: React.FC = () => {
  const {
    products,
    stores,
    navigate,
    selectedCategory,
    setSelectedCategory,
    activeSearchQuery,
    setActiveSearchQuery,
    settings,
    currentUser
  } = useApp();

  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  const banners = settings.heroBanners && settings.heroBanners.length > 0
    ? settings.heroBanners
    : [
        {
          id: 'banner_1',
          badge: 'Marketplace Oficial de Moçambique',
          title: 'ALMAS-SHOP EASY SOLUTION',
          subtitle: '"Mais que uma loja, é a sua solução!" Os melhores produtos físicos e digitais com entrega grátis em Maputo e Matola.',
          ctaText: 'Explorar Ofertas',
          imageUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&auto=format&fit=crop&q=80',
          link: '#catalogo'
        },
        {
          id: 'banner_2',
          badge: 'Novidades Digitais',
          title: 'Livros Digitais & E-books',
          subtitle: 'Compre os melhores e-books com pagamento rápido via EscalePay e download imediato.',
          ctaText: 'Comprar Livros Digitais',
          imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=1200&auto=format&fit=crop&q=80',
          link: 'digital'
        }
      ];

  // Auto slide carousel
  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [banners.length]);

  const categories = [
    'Todas',
    'Informática & Eletrónicos',
    'Moda & Beleza',
    'Casa & Decoração',
    'Produtos Digitais'
  ];

  // Filter products by search & category
  const filteredProducts = products.filter((p) => {
    if (p.status !== 'ACTIVE') return false;
    const matchesCategory =
      selectedCategory === 'Todas' || p.category === selectedCategory;
    const matchesSearch =
      !activeSearchQuery ||
      p.name.toLowerCase().includes(activeSearchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(activeSearchQuery.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(activeSearchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const featuredProducts = products.filter((p) => p.isFeatured && p.status === 'ACTIVE');
  const bestSellers = products.filter((p) => p.isBestSeller && p.status === 'ACTIVE');
  const digitalProducts = products.filter((p) => p.type === 'DIGITAL' && p.status === 'ACTIVE');

  const handleBannerCtaClick = (banner: typeof banners[0]) => {
    if (banner.link === 'digital' || banner.title.toLowerCase().includes('digital') || banner.ctaText.toLowerCase().includes('livro')) {
      setSelectedCategory('Produtos Digitais');
      const el = document.getElementById('livros-digitais');
      el?.scrollIntoView({ behavior: 'smooth' });
    } else {
      const el = document.getElementById('catalogo');
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="pb-16 space-y-6 sm:space-y-10">
      {/* Mobile-friendly Quick Search Bar (When on mobile view) */}
      <div className="sm:hidden px-4 pt-3">
        <div className="relative">
          <input
            type="text"
            value={activeSearchQuery}
            onChange={(e) => setActiveSearchQuery(e.target.value)}
            placeholder="Pesquisar na ALMAS-SHOP..."
            className="w-full bg-white text-[#0F0F0F] placeholder-gray-400 pl-10 pr-4 py-2.5 rounded-full border border-gray-200 shadow-xs text-xs focus:outline-hidden focus:border-[#5DD62C] focus:ring-1 focus:ring-[#5DD62C]"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Hero Showcase Carousel Banner */}
      <section className="px-4 sm:px-6 pt-2 sm:pt-4">
        <div className="max-w-7xl mx-auto relative rounded-3xl overflow-hidden shadow-xl border border-gray-200 bg-[#0F0F0F] min-h-[340px] sm:min-h-[420px] flex items-center">
          {banners.map((banner, index) => {
            const isActive = index === currentBannerIndex;
            return (
              <div
                key={banner.id || index}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out flex items-center ${
                  isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                }`}
              >
                {/* Background Image with Dark Contrast Overlay */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
                  style={{ backgroundImage: `url(${banner.imageUrl})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/75 to-black/40 sm:to-transparent" />
                </div>

                {/* Banner Content */}
                <div className="relative z-20 max-w-2xl p-6 sm:p-12 text-white space-y-3 sm:space-y-4">
                  <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-3.5 py-1 text-xs text-[#5DD62C] font-bold">
                    <Sparkles className="w-3.5 h-3.5 text-[#5DD62C]" />
                    {banner.badge || 'Marketplace Oficial de Moçambique'}
                  </div>

                  <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                    {banner.title}
                  </h1>

                  <p className="text-xs sm:text-sm text-gray-200 leading-relaxed font-medium line-clamp-3 sm:line-clamp-none max-w-xl">
                    {banner.subtitle}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-2 sm:pt-4">
                    <button
                      onClick={() => handleBannerCtaClick(banner)}
                      className="bg-[#5DD62C] hover:bg-[#337418] text-[#0F0F0F] hover:text-white font-extrabold py-3 px-6 rounded-full text-xs sm:text-sm flex items-center gap-2 transition shadow-lg hover:shadow-xl active:scale-95"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      {banner.ctaText || 'Explorar Ofertas'}
                    </button>

                    <button
                      onClick={() => {
                        setSelectedCategory('Produtos Digitais');
                        const el = document.getElementById('livros-digitais');
                        el?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="bg-white/15 hover:bg-white/25 backdrop-blur-md text-white font-bold py-3 px-5 rounded-full text-xs sm:text-sm border border-white/25 transition active:scale-95 flex items-center gap-1.5"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-[#5DD62C]" />
                      Comprar Livros Digitais
                    </button>

                    {currentUser?.role === 'SUPER_ADMIN' && (
                      <button
                        onClick={() => navigate('/admin')}
                        className="bg-black/60 hover:bg-black/80 text-xs text-[#5DD62C] px-3.5 py-2 rounded-full border border-[#5DD62C]/40 flex items-center gap-1 transition ml-auto"
                        title="Trocar fotos ou textos do banner no Painel Mestre"
                      >
                        Gerir Banners (Admin)
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Carousel Arrows */}
          {banners.length > 1 && (
            <>
              <button
                onClick={() =>
                  setCurrentBannerIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1))
                }
                className="absolute left-3 z-30 p-2 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-xs transition"
                aria-label="Banner anterior"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() =>
                  setCurrentBannerIndex((prev) => (prev + 1) % banners.length)
                }
                className="absolute right-3 z-30 p-2 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-xs transition"
                aria-label="Próximo banner"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Slide Indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
                {banners.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentBannerIndex(i)}
                    className={`h-2 rounded-full transition-all ${
                      i === currentBannerIndex ? 'w-6 bg-[#5DD62C]' : 'w-2 bg-white/40'
                    }`}
                    aria-label={`Slide ${i + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Categories Horizontal Bar */}
      <section className="px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition border ${
                    isSelected
                      ? 'bg-[#5DD62C] text-[#0F0F0F] border-[#5DD62C] shadow-sm'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400 hover:bg-gray-50'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* DEDICATED DIGITAL PRODUCTS & E-BOOKS SECTION (EscalePay Integration) */}
      <section id="livros-digitais" className="px-4 sm:px-6">
        <div className="max-w-7xl mx-auto bg-gradient-to-br from-[#0F0F0F] to-[#202020] rounded-3xl p-5 sm:p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#5DD62C]/10 rounded-full blur-2xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-5">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#5DD62C]/20 border border-[#5DD62C]/40 text-[#5DD62C] text-xs font-bold px-3 py-1 rounded-full mb-2">
                <Zap className="w-3.5 h-3.5" />
                Download Imediato com EscalePay
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">Livros Digitais & E-books</h2>
              <p className="text-xs text-gray-300 mt-1">
                Aprenda habilidades práticas, negócios e marketing digital. Receba seu arquivo imediatamente após o checkout via EscalePay.
              </p>
            </div>

            <button
              onClick={() => setSelectedCategory('Produtos Digitais')}
              className="bg-[#5DD62C] hover:bg-[#337418] text-[#0F0F0F] hover:text-white font-extrabold text-xs sm:text-sm py-2.5 px-5 rounded-full transition shadow-md whitespace-nowrap self-start sm:self-auto flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              Comprar Livros Digitais
            </button>
          </div>

          <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 mt-6">
            {digitalProducts.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      {featuredProducts.length > 0 && selectedCategory === 'Todas' && !activeSearchQuery && (
        <section className="px-4 sm:px-6">
          <div className="max-w-7xl mx-auto space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-[#5DD62C]/20 text-[#337418] rounded-lg">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-[#0F0F0F]">Destaques da Semana</h2>
              </div>
              <span className="text-xs text-[#337418] font-bold">Entrega Expressa</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
              {featuredProducts.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Top Best Sellers */}
      {bestSellers.length > 0 && selectedCategory === 'Todas' && !activeSearchQuery && (
        <section className="px-4 sm:px-6">
          <div className="max-w-7xl mx-auto space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-amber-500/20 text-amber-700 rounded-lg">
                  <Tag className="w-4 h-4" />
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-[#0F0F0F]">Mais Vendidos em Maputo</h2>
              </div>
              <span className="text-xs text-gray-500 font-medium">Verificados</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
              {bestSellers.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Verified Partner Stores Showcase */}
      {selectedCategory === 'Todas' && !activeSearchQuery && stores.length > 0 && (
        <section className="px-4 sm:px-6">
          <div className="max-w-7xl mx-auto space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-[#0F0F0F]">Lojas Parceiras Oficiais</h2>
                <p className="text-xs text-gray-500">Vendedores certificados na ALMAS-SHOP</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {stores.map((store) => (
                <div
                  key={store.id}
                  onClick={() => navigate(`/loja/${store.slug}`)}
                  className="bg-white border border-gray-200 hover:border-[#5DD62C] rounded-2xl p-4 flex items-center gap-4 transition shadow-xs hover:shadow-md cursor-pointer"
                >
                  <img
                    src={store.logo}
                    alt={store.name}
                    className="w-14 h-14 rounded-xl object-cover border border-gray-100 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-bold text-sm text-[#0F0F0F] truncate">{store.name}</h3>
                      <ShieldCheck className="w-3.5 h-3.5 text-[#337418] flex-shrink-0" />
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{store.slogan || store.description || 'Loja oficial ALMAS-SHOP'}</p>
                    <div className="flex items-center gap-2 mt-2 text-[11px] text-[#337418] font-bold">
                      <span>Ver Catálogo</span>
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Main Catalog Grid */}
      <section id="catalogo" className="px-4 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex items-center justify-between border-b border-gray-200 pb-3">
            <div className="flex items-center gap-2">
              <Grid className="w-4 h-4 text-[#337418]" />
              <h2 className="text-lg sm:text-xl font-bold text-[#0F0F0F]">
                {selectedCategory === 'Todas' ? 'Todos os Produtos' : selectedCategory}
              </h2>
            </div>
            <span className="text-xs text-gray-500 font-semibold">{filteredProducts.length} itens disponíveis</span>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="py-16 text-center bg-white border border-gray-200 rounded-3xl p-6">
              <p className="text-base font-bold text-[#0F0F0F]">Nenhum produto encontrado</p>
              <p className="text-xs text-gray-500 mt-1">
                Tente selecionar outra categoria ou limpar a sua pesquisa.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('Todas');
                  setActiveSearchQuery('');
                }}
                className="mt-4 bg-[#5DD62C] hover:bg-[#337418] text-[#0F0F0F] hover:text-white font-bold text-xs py-2 px-4 rounded-full transition shadow-xs"
              >
                Ver Todo o Catálogo
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
