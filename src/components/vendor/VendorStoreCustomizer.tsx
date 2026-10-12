import React, { useState } from 'react';
import {
  Sliders,
  Smartphone,
  Tablet,
  Monitor,
  MoveUp,
  MoveDown,
  Eye,
  Save,
  CheckCircle,
  Sparkles,
  Image as ImageIcon,
  Layers,
  Store,
  ExternalLink,
  Plus
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StoreSectionConfig, Store as StoreType } from '../../types';

export const VendorStoreCustomizer: React.FC = () => {
  const { stores, updateStore, currentUser, navigate, setFlashBanner } = useApp();

  const currentStore =
    stores.find((s) => s.vendorId === currentUser?.id || s.vendorId === 'user_vendor_1') || stores[0];

  // Preview device mode: mobile / tablet / desktop
  const [devicePreview, setDevicePreview] = useState<'mobile' | 'tablet' | 'desktop'>('mobile');

  // Store profile fields
  const [name, setName] = useState(currentStore.name);
  const [slogan, setSlogan] = useState(currentStore.slogan || 'Sua melhor escolha');
  const [description, setDescription] = useState(currentStore.description);
  const [logo, setLogo] = useState(currentStore.logo);
  const [banner, setBanner] = useState(currentStore.banner || currentStore.coverImage || '');

  // Sections with ordering & toggle visibility
  const [sections, setSections] = useState<StoreSectionConfig[]>(
    currentStore.sections || [
      { id: 'sec_banner', type: 'BANNER', title: 'Banner Promocional Principal', isVisible: true, order: 1 },
      { id: 'sec_destaques', type: 'HIGHLIGHTS', title: 'Super Ofertas em Destaque', isVisible: true, order: 2 },
      { id: 'sec_mais_vendidos', type: 'BEST_SELLERS', title: 'Mais Vendidos da Semana', isVisible: true, order: 3 },
      { id: 'sec_categorias', type: 'CATEGORIES', title: 'Navegar por Categorias', isVisible: true, order: 4 },
      { id: 'sec_novos', type: 'NEW_ARRIVALS', title: 'Novidades & Lançamentos', isVisible: true, order: 5 },
      { id: 'sec_digitais', type: 'DIGITAL', title: 'Downloads & Produtos Digitais', isVisible: true, order: 6 }
    ]
  );

  // Move section up/down in the visual list
  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;

    const newSections = [...sections];
    const temp = newSections[index];
    newSections[index] = newSections[targetIndex];
    newSections[targetIndex] = temp;

    const reordered = newSections.map((sec, idx) => ({ ...sec, order: idx + 1 }));
    setSections(reordered);
  };

  // Toggle visibility of section
  const handleToggleVisibility = (sectionId: string) => {
    setSections(
      sections.map((sec) => (sec.id === sectionId ? { ...sec, isVisible: !sec.isVisible } : sec))
    );
  };

  const handleUpdateTitle = (sectionId: string, newTitle: string) => {
    setSections(
      sections.map((sec) => (sec.id === sectionId ? { ...sec, title: newTitle } : sec))
    );
  };

  const handlePublish = () => {
    updateStore(currentStore.id, {
      name,
      slogan,
      description,
      logo,
      banner,
      coverImage: banner,
      sections
    });
    setFlashBanner({
      message: 'Layout da loja publicado com sucesso!',
      type: 'success'
    });
  };

  const handleSaveDraft = () => {
    updateStore(currentStore.id, {
      name,
      slogan,
      description,
      logo,
      banner,
      coverImage: banner,
      sections
    });
    setFlashBanner({
      message: 'Rascunho do layout salvo com sucesso.',
      type: 'info'
    });
  };

  return (
    <div className="space-y-6 text-[#0F0F0F]">
      {/* Top Header with Save / Publish and Last Updated */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border border-gray-200 rounded-3xl p-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-[#0F0F0F] flex items-center gap-2">
              <Sliders className="w-6 h-6 text-[#337418]" />
              Editor Visual da Loja
            </h1>
            <span className="text-[10px] bg-[#5DD62C]/20 text-[#337418] px-2 py-0.5 rounded-full font-bold">
              Sem Código
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Reorganize seções, banners, ofertas e promoções com facilidade.
          </p>
          <p className="text-[11px] text-gray-400 mt-1">
            Última atualização: {new Date(currentStore.updatedAt).toLocaleString('pt-PT')} por{' '}
            <strong className="text-[#337418]">{currentUser?.name || 'Vendedor'}</strong>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => navigate(`/loja/${currentStore.slug}`)}
            className="bg-white hover:bg-gray-100 text-[#0F0F0F] font-semibold text-xs py-2.5 px-3.5 rounded-xl border border-gray-300 flex items-center gap-1.5 transition"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#337418]" />
            Ver Loja Pública
          </button>
          <button
            onClick={handleSaveDraft}
            className="bg-gray-100 hover:bg-gray-200 text-[#0F0F0F] font-semibold text-xs py-2.5 px-4 rounded-xl border border-gray-200 transition"
          >
            Salvar Rascunho
          </button>
          <button
            onClick={handlePublish}
            className="bg-[#5DD62C] hover:bg-[#337418] text-[#0F0F0F] hover:text-white font-black text-xs py-2.5 px-5 rounded-xl shadow-xs flex items-center gap-1.5 transition"
          >
            <Save className="w-4 h-4" />
            Publicar Alterações
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Sections List & Organization */}
        <div className="lg:col-span-6 space-y-6">
          {/* Store Branding Form */}
          <div className="bg-white border border-gray-200 rounded-3xl p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[#0F0F0F] flex items-center gap-2">
              <Store className="w-4 h-4 text-[#337418]" />
              Identidade Visual da Loja
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  Nome da Loja
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#F8F8F8] border border-gray-300 text-xs text-[#0F0F0F] rounded-xl p-2.5 focus:outline-none focus:border-[#5DD62C]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  Slogan Comercial
                </label>
                <input
                  type="text"
                  value={slogan}
                  onChange={(e) => setSlogan(e.target.value)}
                  className="w-full bg-[#F8F8F8] border border-gray-300 text-xs text-[#0F0F0F] rounded-xl p-2.5 focus:outline-none focus:border-[#5DD62C]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  URL do Logótipo (ou use /logo.svg)
                </label>
                <input
                  type="url"
                  value={logo}
                  onChange={(e) => setLogo(e.target.value)}
                  className="w-full bg-[#F8F8F8] border border-gray-300 text-xs text-[#0F0F0F] rounded-xl p-2.5 focus:outline-none focus:border-[#5DD62C]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  URL do Banner de Capa
                </label>
                <input
                  type="url"
                  value={banner}
                  onChange={(e) => setBanner(e.target.value)}
                  className="w-full bg-[#F8F8F8] border border-gray-300 text-xs text-[#0F0F0F] rounded-xl p-2.5 focus:outline-none focus:border-[#5DD62C]"
                />
              </div>
            </div>
          </div>

          {/* Sections Reordering List */}
          <div className="bg-white border border-gray-200 rounded-3xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#0F0F0F] flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#337418]" />
                Ordem das Seções da Página
              </h3>
              <span className="text-[11px] text-gray-400">Use as setas para reordenar</span>
            </div>

            <div className="space-y-2">
              {sections.map((sec, idx) => (
                <div
                  key={sec.id}
                  className={`p-3 rounded-2xl border transition flex items-center justify-between gap-3 ${
                    sec.isVisible
                      ? 'bg-[#F8F8F8] border-gray-200'
                      : 'bg-gray-50 border-gray-200 opacity-50'
                  }`}
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="w-6 h-6 rounded-full bg-[#5DD62C] text-[#0F0F0F] text-xs font-bold flex items-center justify-center flex-shrink-0 shadow-xs">
                      {idx + 1}
                    </span>
                    <input
                      type="text"
                      value={sec.title}
                      onChange={(e) => handleUpdateTitle(sec.id, e.target.value)}
                      className="bg-transparent text-xs font-semibold text-[#0F0F0F] truncate focus:outline-none focus:border-b border-[#337418] flex-1"
                    />
                    <span className="text-[10px] bg-white border border-gray-200 text-gray-600 px-1.5 py-0.5 rounded font-mono">
                      {sec.type}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMove(idx, 'up')}
                      className="p-1.5 bg-white hover:bg-gray-100 disabled:opacity-30 rounded-lg text-gray-700 transition border border-gray-200 shadow-xs"
                      title="Mover para cima"
                    >
                      <MoveUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === sections.length - 1}
                      onClick={() => handleMove(idx, 'down')}
                      className="p-1.5 bg-white hover:bg-gray-100 disabled:opacity-30 rounded-lg text-gray-700 transition border border-gray-200 shadow-xs"
                      title="Mover para baixo"
                    >
                      <MoveDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleVisibility(sec.id)}
                      className={`text-[11px] px-2 py-1 rounded-lg font-bold transition ${
                        sec.isVisible
                          ? 'bg-[#5DD62C]/20 text-[#337418]'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {sec.isVisible ? 'Visível' : 'Oculto'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Live Responsive Preview (Focus on Mobile) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white border border-gray-200 rounded-3xl p-5 shadow-xs space-y-4">
            {/* Device Switcher */}
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <span className="text-xs font-bold text-[#0F0F0F] flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-[#337418]" />
                Pré-visualização em Tempo Real
              </span>

              <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl border border-gray-200">
                <button
                  type="button"
                  onClick={() => setDevicePreview('mobile')}
                  className={`p-1.5 rounded-lg text-xs transition flex items-center gap-1 ${
                    devicePreview === 'mobile'
                      ? 'bg-[#5DD62C] text-[#0F0F0F] font-bold shadow-xs'
                      : 'text-gray-500 hover:text-[#0F0F0F]'
                  }`}
                  title="Visão Mobile (Celular)"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span className="text-[10px]">Mobile</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDevicePreview('tablet')}
                  className={`p-1.5 rounded-lg text-xs transition flex items-center gap-1 ${
                    devicePreview === 'tablet'
                      ? 'bg-[#5DD62C] text-[#0F0F0F] font-bold shadow-xs'
                      : 'text-gray-500 hover:text-[#0F0F0F]'
                  }`}
                  title="Visão Tablet"
                >
                  <Tablet className="w-3.5 h-3.5" />
                  <span className="text-[10px]">Tablet</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDevicePreview('desktop')}
                  className={`p-1.5 rounded-lg text-xs transition flex items-center gap-1 ${
                    devicePreview === 'desktop'
                      ? 'bg-[#5DD62C] text-[#0F0F0F] font-bold shadow-xs'
                      : 'text-gray-500 hover:text-[#0F0F0F]'
                  }`}
                  title="Visão Computador"
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span className="text-[10px]">Desktop</span>
                </button>
              </div>
            </div>

            {/* Screen Mockup Container */}
            <div className="flex justify-center p-2 bg-[#F8F8F8] rounded-2xl overflow-hidden border border-gray-200">
              <div
                className={`transition-all duration-300 bg-white border border-gray-300 rounded-3xl overflow-hidden shadow-lg ${
                  devicePreview === 'mobile'
                    ? 'w-[320px] min-h-[500px]'
                    : devicePreview === 'tablet'
                    ? 'w-[480px] min-h-[500px]'
                    : 'w-full min-h-[500px]'
                }`}
              >
                {/* Store mini header */}
                <div className="relative h-28 bg-gray-100 overflow-hidden">
                  <img src={banner || '/logo.svg'} alt="Banner" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-2 left-3 flex items-center gap-2">
                    <img
                      src={logo || '/logo.svg'}
                      alt="Logo"
                      className="w-10 h-10 rounded-xl object-cover border-2 border-white shadow"
                    />
                    <div className="text-white">
                      <p className="font-bold text-xs">{name}</p>
                      <p className="text-[9px] text-gray-200">{slogan}</p>
                    </div>
                  </div>
                </div>

                {/* Simulated ordered sections */}
                <div className="p-3 space-y-3">
                  {sections
                    .filter((s) => s.isVisible)
                    .map((s) => (
                      <div key={s.id} className="border border-gray-200 rounded-xl p-2 bg-[#F8F8F8]">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-bold text-[11px] text-[#0F0F0F]">{s.title}</span>
                          <span className="text-[8px] bg-[#5DD62C]/20 text-[#337418] px-1 py-0.2 rounded font-mono font-bold">
                            {s.type}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-1.5">
                          <div className="h-16 bg-white rounded-lg border border-gray-200 flex items-center justify-center text-[10px] text-gray-400 font-medium">
                            Produto Demo
                          </div>
                          <div className="h-16 bg-white rounded-lg border border-gray-200 flex items-center justify-center text-[10px] text-gray-400 font-medium">
                            Produto Demo
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
