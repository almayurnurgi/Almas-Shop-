import React, { useState } from 'react';
import {
  ArrowLeft,
  Save,
  Eye,
  Copy,
  Plus,
  Trash2,
  Sparkles,
  Image as ImageIcon,
  CheckCircle,
  HelpCircle,
  Video,
  FileText,
  Upload,
  Camera
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Product, ProductVariant, ProductFaqItem } from '../../types';

interface Props {
  initialProduct?: Product | null;
  onClose: () => void;
}

export const VendorProductEditor: React.FC<Props> = ({ initialProduct, onClose }) => {
  const { addProduct, updateProduct, currentUser, stores, navigate, setFlashBanner } = useApp();

  const vendorStore =
    stores.find((s) => s.vendorId === currentUser?.id || s.vendorId === 'user_vendor_1') || stores[0];

  const [name, setName] = useState(initialProduct?.name || '');
  const [slug, setSlug] = useState(
    initialProduct?.slug ||
      initialProduct?.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-') ||
      ''
  );
  const [description, setDescription] = useState(initialProduct?.description || '');
  const [category, setCategory] = useState(initialProduct?.category || 'Informática & Eletrónicos');
  const [type, setType] = useState<'PHYSICAL' | 'DIGITAL'>(initialProduct?.type || 'PHYSICAL');
  const [regularPrice, setRegularPrice] = useState<number>(initialProduct?.regularPrice || 3500);
  const [salePrice, setSalePrice] = useState<number>(initialProduct?.salePrice || 2800);
  const [stock, setStock] = useState<number>(initialProduct?.stock || 25);
  const [sku, setSku] = useState(initialProduct?.sku || 'ALM-' + Math.floor(1000 + Math.random() * 9000));
  const [weightKg, setWeightKg] = useState<number>(initialProduct?.weightKg || 0.5);
  const [videoUrl, setVideoUrl] = useState(initialProduct?.videoUrl || '');
  const [digitalDownloadUrl, setDigitalDownloadUrl] = useState(initialProduct?.digitalDownloadUrl || '');
  const [status, setStatus] = useState(initialProduct?.status || 'ACTIVE');
  const [isFeatured, setIsFeatured] = useState(initialProduct?.isFeatured || false);
  const [isBestSeller, setIsBestSeller] = useState(initialProduct?.isBestSeller || false);
  const [tagsInput, setTagsInput] = useState(initialProduct?.tags?.join(', ') || 'promoção, maputo');

  // Images list
  const [images, setImages] = useState<string[]>(
    initialProduct?.images && initialProduct.images.length > 0
      ? initialProduct.images
      : ['https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800']
  );
  const [newImageUrl, setNewImageUrl] = useState('');

  // Variants list
  const [variants, setVariants] = useState<ProductVariant[]>(
    initialProduct?.variants || [
      { id: 'v1', name: 'Preto 128GB', price: 2800, stock: 15, sku: 'ALM-BLK' },
      { id: 'v2', name: 'Prata 256GB', price: 3400, stock: 10, sku: 'ALM-SLV' }
    ]
  );

  // FAQ list
  const [faq, setFaq] = useState<ProductFaqItem[]>(
    initialProduct?.faq || [
      {
        question: 'O pagamento é feito mesmo no acto da entrega?',
        answer: 'Sim! Em Maputo e Matola o estafeta entrega a encomenda e você pode conferir antes de pagar via M-Pesa ou numerário.'
      },
      {
        question: 'Qual é o prazo de entrega?',
        answer: 'Geralmente entregamos entre 24h a 48h úteis diretamente na sua morada.'
      }
    ]
  );

  const discountPercent =
    regularPrice > salePrice ? Math.round(((regularPrice - salePrice) / regularPrice) * 100) : 0;

  const handleNameChange = (val: string) => {
    setName(val);
    if (!initialProduct) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
    }
  };

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      setImages([...images, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const handleDeviceImagesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (reader.result) {
            setImages((prev) => [...prev, reader.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
      setFlashBanner({ message: 'Fotos adicionadas da galeria!', type: 'success' });
    }
  };

  const handleVariantImageUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          const newV = [...variants];
          newV[index].imageUrl = reader.result as string;
          setVariants(newV);
          setFlashBanner({ message: 'Foto da variação adicionada!', type: 'success' });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleAddVariant = () => {
    if (variants.length >= 5) {
      setFlashBanner({ message: 'Limite máximo de até 5 variações por produto atingido.', type: 'info' });
      return;
    }
    const newId = 'v_' + Date.now();
    setVariants([
      ...variants,
      {
        id: newId,
        name: `Variação ${variants.length + 1}`,
        sku: `SKU-${Date.now().toString().slice(-4)}`,
        price: salePrice,
        stock: 10
      }
    ]);
  };

  const handleRemoveVariant = (id: string) => {
    setVariants(variants.filter((v) => v.id !== id));
  };

  const handleAddFaq = () => {
    setFaq([...faq, { question: '', answer: '' }]);
  };

  const handleCopyLink = () => {
    const fullUrl = `${window.location.origin}/produto/${slug}`;
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(fullUrl);
      setFlashBanner({ message: 'Link de venda copiado para a área de transferência!', type: 'success' });
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setFlashBanner({ message: 'O nome do produto é obrigatório.', type: 'error' });
      return;
    }

    const tagsArray = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const productPayload: Omit<Product, 'id' | 'createdAt' | 'updatedAt'> = {
      name: name.trim(),
      slug: slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description,
      category,
      type,
      regularPrice: Number(regularPrice),
      salePrice: Number(salePrice),
      discountPercent,
      stock: Number(stock),
      sku,
      weightKg: Number(weightKg),
      images: images.length > 0 ? images : ['/logo.svg'],
      videoUrl,
      digitalDownloadUrl: type === 'DIGITAL' ? digitalDownloadUrl : undefined,
      variants,
      faq,
      status: status as any,
      isFeatured,
      isNew: initialProduct ? initialProduct.isNew : true,
      isBestSeller,
      tags: tagsArray,
      vendorId: currentUser?.id || 'user_vendor_1',
      storeId: vendorStore.id,
      storeName: vendorStore.name,
      rating: initialProduct?.rating || 5.0,
      reviewsCount: initialProduct?.reviewsCount || 1
    };

    if (initialProduct) {
      updateProduct(initialProduct.id, productPayload);
      setFlashBanner({ message: 'Produto atualizado com sucesso!', type: 'success' });
    } else {
      addProduct(productPayload);
      setFlashBanner({ message: 'Novo produto cadastrado e pronto para venda!', type: 'success' });
    }

    onClose();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-24 text-[#0F0F0F]">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-gray-200 rounded-3xl p-5 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="p-2 bg-gray-100 text-gray-700 hover:text-[#0F0F0F] rounded-xl border border-gray-200 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-lg sm:text-xl font-black text-[#0F0F0F]">
              {initialProduct ? 'Editar Produto' : 'Cadastrar Novo Produto'}
            </h1>
            <p className="text-xs text-[#337418] font-bold">Loja: {vendorStore.name}</p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {slug && (
            <>
              <button
                type="button"
                onClick={() => navigate(`/produto/${slug}`)}
                className="bg-white hover:bg-gray-100 text-[#0F0F0F] font-semibold text-xs py-2 px-3 rounded-xl border border-gray-200 flex items-center gap-1.5 transition"
              >
                <Eye className="w-3.5 h-3.5 text-[#337418]" />
                <span>Página de Vendas</span>
              </button>
              <button
                type="button"
                onClick={handleCopyLink}
                className="bg-white hover:bg-gray-100 text-[#0F0F0F] font-semibold text-xs py-2 px-3 rounded-xl border border-gray-200 flex items-center gap-1.5 transition"
              >
                <Copy className="w-3.5 h-3.5 text-[#337418]" />
                <span>Copiar Link</span>
              </button>
            </>
          )}
          <button
            type="button"
            onClick={handleSave}
            className="bg-[#5DD62C] hover:bg-[#337418] text-[#0F0F0F] hover:text-white font-black text-xs py-2.5 px-5 rounded-xl shadow-xs transition flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            Salvar Produto
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Basic Information */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-xs space-y-4">
          <h2 className="text-sm sm:text-base font-bold text-[#0F0F0F] flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#337418]" />
            Informações Principais
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">
                Nome do Produto *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Smartwatch Ultra Series 9"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full bg-[#F8F8F8] border border-gray-300 focus:border-[#5DD62C] text-xs text-[#0F0F0F] rounded-xl p-3 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">
                Slug URL (ex: smartwatch-ultra-series-9)
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full bg-[#F8F8F8] border border-gray-300 focus:border-[#5DD62C] text-xs text-[#0F0F0F] rounded-xl p-3 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">Categoria *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#F8F8F8] border border-gray-300 focus:border-[#5DD62C] text-xs text-[#0F0F0F] rounded-xl p-3 focus:outline-none"
              >
                <option value="Informática & Eletrónicos">Informática & Eletrónicos</option>
                <option value="Moda & Beleza">Moda & Beleza</option>
                <option value="Casa & Decoração">Casa & Decoração</option>
                <option value="Produtos Digitais">Produtos Digitais (E-books, Cursos)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">Tipo de Produto *</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full bg-[#F8F8F8] border border-gray-300 focus:border-[#5DD62C] text-xs text-[#0F0F0F] rounded-xl p-3 focus:outline-none"
              >
                <option value="PHYSICAL">Físico (Entrega via Estafeta Maputo/Matola)</option>
                <option value="DIGITAL">Digital (Download Imediato após pagamento)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">
              Descrição de Venda (Copy persuasiva) *
            </label>
            <textarea
              rows={4}
              required
              placeholder="Descreva as vantagens, especificações técnicas e garantias do produto..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#F8F8F8] border border-gray-300 focus:border-[#5DD62C] text-xs text-[#0F0F0F] rounded-xl p-3 focus:outline-none"
            />
          </div>
        </div>

        {/* Section 2: Pricing, Discount & Stock in MT */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-xs space-y-4">
          <h2 className="text-sm sm:text-base font-bold text-[#0F0F0F] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#337418]" />
            Preço 'DE/POR' e Estoque em Meticais (MT)
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">
                Preço Antigo (DE) MT
              </label>
              <input
                type="number"
                min="0"
                value={regularPrice}
                onChange={(e) => setRegularPrice(Number(e.target.value))}
                className="w-full bg-[#F8F8F8] border border-gray-300 focus:border-[#5DD62C] text-xs text-[#0F0F0F] rounded-xl p-3 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">
                Preço Promocional (POR) MT *
              </label>
              <input
                type="number"
                min="0"
                required
                value={salePrice}
                onChange={(e) => setSalePrice(Number(e.target.value))}
                className="w-full bg-[#F8F8F8] border border-gray-300 focus:border-[#5DD62C] text-xs text-[#0F0F0F] rounded-xl p-3 focus:outline-none font-bold"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">
                Desconto Calculado
              </label>
              <div className="p-3 bg-[#5DD62C]/20 rounded-xl text-xs font-bold text-[#337418]">
                {discountPercent}% OFF
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">
                Estoque Disponível *
              </label>
              <input
                type="number"
                min="0"
                required
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                className="w-full bg-[#F8F8F8] border border-gray-300 focus:border-[#5DD62C] text-xs text-[#0F0F0F] rounded-xl p-3 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">Código SKU</label>
              <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="w-full bg-[#F8F8F8] border border-gray-300 focus:border-[#5DD62C] text-xs text-[#0F0F0F] rounded-xl p-3 focus:outline-none font-mono"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">Peso (kg)</label>
              <input
                type="number"
                step="0.1"
                value={weightKg}
                onChange={(e) => setWeightKg(Number(e.target.value))}
                className="w-full bg-[#F8F8F8] border border-gray-300 focus:border-[#5DD62C] text-xs text-[#0F0F0F] rounded-xl p-3 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">Status de Venda</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full bg-[#F8F8F8] border border-gray-300 focus:border-[#5DD62C] text-xs text-[#0F0F0F] rounded-xl p-3 focus:outline-none"
              >
                <option value="ACTIVE">Activo (Publicado)</option>
                <option value="INACTIVE">Inactivo (Pausado)</option>
                <option value="DRAFT">Rascunho</option>
                <option value="OUT_OF_STOCK">Esgotado</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Media (Images & Video) */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-[#0F0F0F] flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#337418]" />
                Fotos do Produto (Galeria do Aparelho)
              </h2>
              <p className="text-xs text-gray-500">
                Selecione fotos diretamente do seu telemóvel ou computador — sem precisar de links externos.
              </p>
            </div>

            {/* Direct Device Upload Button */}
            <label className="cursor-pointer inline-flex items-center gap-2 bg-[#5DD62C] hover:bg-[#337418] text-[#0F0F0F] hover:text-white font-extrabold text-xs py-2.5 px-4 rounded-full transition shadow-xs">
              <Upload className="w-4 h-4" />
              <span>Escolher da Galeria</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleDeviceImagesUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Optional URL input as alternative */}
          <div className="flex gap-2 pt-1">
            <input
              type="url"
              placeholder="Ou cole aqui o URL de uma imagem na web se preferir..."
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              className="flex-1 bg-[#F8F8F8] border border-gray-300 focus:border-[#5DD62C] text-xs text-[#0F0F0F] rounded-full px-4 py-2 focus:outline-none"
            />
            <button
              type="button"
              onClick={handleAddImage}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs px-4 rounded-full border border-gray-300 transition"
            >
              Adicionar URL
            </button>
          </div>

          {/* Image Previews */}
          {images.length > 0 ? (
            <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1">
              {images.map((img, idx) => (
                <div
                  key={idx}
                  className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-gray-200 flex-shrink-0 group bg-gray-50 shadow-xs"
                >
                  <img src={img} alt={`Product ${idx}`} className="w-full h-full object-cover" />
                  {idx === 0 && (
                    <span className="absolute bottom-1 left-1 bg-[#0F0F0F]/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                      Capa
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-1 right-1 bg-rose-600 text-white rounded-full p-1 opacity-90 group-hover:opacity-100 transition shadow"
                    title="Remover foto"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 border-2 border-dashed border-gray-200 rounded-2xl text-center bg-gray-50/50">
              <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-xs font-bold text-gray-700">Nenhuma foto adicionada ainda</p>
              <p className="text-[11px] text-gray-500">
                Clique no botão verde acima para carregar fotos reais do produto a partir da sua galeria.
              </p>
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">
              Link do Vídeo Demonstrativo (YouTube, Vimeo ou MP4)
            </label>
            <input
              type="url"
              placeholder="Ex: https://youtube.com/watch?v=..."
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className="w-full bg-[#F8F8F8] border border-gray-300 focus:border-[#5DD62C] text-xs text-[#0F0F0F] rounded-full px-4 py-2.5 focus:outline-none"
            />
          </div>
        </div>

        {/* Section 4: Variants (up to 5 variations) */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-[#0F0F0F]">
                Variações do Produto (Até 5 variações)
              </h2>
              <p className="text-xs text-gray-500">
                Exemplos: Tamanhos (P, M, G, GG, XG) ou Cores (Preto, Azul, Vermelho). {variants.length}/5 cadastradas.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddVariant}
              disabled={variants.length >= 5}
              className={`text-xs font-extrabold py-1.5 px-3 rounded-full flex items-center gap-1 transition ${
                variants.length >= 5
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-[#5DD62C] hover:bg-[#337418] text-[#0F0F0F] hover:text-white shadow-xs'
              }`}
            >
              <Plus className="w-3.5 h-3.5" /> Adicionar Variação ({variants.length}/5)
            </button>
          </div>

          <div className="space-y-3">
            {variants.map((v, idx) => (
              <div
                key={v.id}
                className="bg-[#F8F8F8] p-3.5 rounded-2xl border border-gray-200 space-y-2.5"
              >
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center">
                  {/* Photo selector for variant */}
                  <div className="sm:col-span-3 flex items-center gap-2">
                    <label className="cursor-pointer relative w-12 h-12 rounded-xl bg-white border border-gray-300 flex items-center justify-center overflow-hidden flex-shrink-0 hover:border-[#5DD62C] transition">
                      {v.imageUrl ? (
                        <img src={v.imageUrl} alt={v.name} className="w-full h-full object-cover" />
                      ) : (
                        <Camera className="w-5 h-5 text-gray-400" />
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleVariantImageUpload(idx, e)}
                        className="hidden"
                      />
                    </label>
                    <span className="text-[10px] text-gray-500 font-semibold leading-tight">
                      Foto da Variação
                    </span>
                  </div>

                  <div className="sm:col-span-4">
                    <input
                      type="text"
                      placeholder="Nome (ex: Preto ou Tamanho M)"
                      value={v.name}
                      onChange={(e) => {
                        const newV = [...variants];
                        newV[idx].name = e.target.value;
                        setVariants(newV);
                      }}
                      className="w-full bg-white border border-gray-300 text-xs text-[#0F0F0F] p-2 rounded-xl focus:border-[#5DD62C] focus:outline-none font-medium"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <input
                      type="number"
                      placeholder="Preço MT"
                      value={v.price}
                      onChange={(e) => {
                        const newV = [...variants];
                        newV[idx].price = Number(e.target.value);
                        setVariants(newV);
                      }}
                      className="w-full bg-white border border-gray-300 text-xs text-[#0F0F0F] p-2 rounded-xl focus:border-[#5DD62C] focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <input
                      type="number"
                      placeholder="Estoque"
                      value={v.stock}
                      onChange={(e) => {
                        const newV = [...variants];
                        newV[idx].stock = Number(e.target.value);
                        setVariants(newV);
                      }}
                      className="w-full bg-white border border-gray-300 text-xs text-[#0F0F0F] p-2 rounded-xl focus:border-[#5DD62C] focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-1 flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleRemoveVariant(v.id)}
                      className="text-rose-500 hover:text-rose-700 p-1.5 rounded-lg hover:bg-rose-50 transition"
                      title="Excluir variação"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 5: Interactive FAQ */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm sm:text-base font-bold text-[#0F0F0F] flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-[#337418]" />
              FAQ (Perguntas Frequentes do Produto)
            </h2>
            <button
              type="button"
              onClick={handleAddFaq}
              className="text-xs text-[#337418] font-bold hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Adicionar Pergunta
            </button>
          </div>

          <div className="space-y-3">
            {faq.map((item, idx) => (
              <div key={idx} className="bg-[#F8F8F8] border border-gray-200 p-3 rounded-2xl space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <input
                    type="text"
                    placeholder="Pergunta do cliente..."
                    value={item.question}
                    onChange={(e) => {
                      const newF = [...faq];
                      newF[idx].question = e.target.value;
                      setFaq(newF);
                    }}
                    className="flex-1 bg-white border border-gray-300 text-xs text-[#0F0F0F] p-2.5 rounded-xl font-semibold"
                  />
                  <button
                    type="button"
                    onClick={() => setFaq(faq.filter((_, i) => i !== idx))}
                    className="text-rose-500 hover:text-rose-700 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <textarea
                  rows={2}
                  placeholder="Resposta convincente e clara..."
                  value={item.answer}
                  onChange={(e) => {
                    const newF = [...faq];
                    newF[idx].answer = e.target.value;
                    setFaq(newF);
                  }}
                  className="w-full bg-white border border-gray-300 text-xs text-gray-700 p-2.5 rounded-xl"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Section 6: Tags & Highlights */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-xs space-y-4">
          <h2 className="text-sm sm:text-base font-bold text-[#0F0F0F]">Destaques e Tags de Busca</h2>

          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-700">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isBestSeller}
                onChange={(e) => setIsBestSeller(e.target.checked)}
                className="rounded accent-[#337418]"
              />
              <span>Marcar como "Mais Vendido"</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="rounded accent-[#337418]"
              />
              <span>Destaque na Página Inicial</span>
            </label>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">
              Tags separadas por vírgula (SEO e pesquisa interna)
            </label>
            <input
              type="text"
              placeholder="Ex: fones, bluetooth, promoção, maputo, entrega rápida"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full bg-[#F8F8F8] border border-gray-300 focus:border-[#5DD62C] text-xs text-[#0F0F0F] rounded-xl p-3 focus:outline-none"
            />
          </div>
        </div>

        {/* Bottom Save Bar */}
        <div className="flex items-center justify-between pt-4">
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-gray-500 hover:text-[#0F0F0F] font-semibold"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="bg-[#5DD62C] hover:bg-[#337418] text-[#0F0F0F] hover:text-white font-black text-xs py-3.5 px-8 rounded-xl transition shadow-md flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Salvar e Publicar Produto
          </button>
        </div>
      </form>
    </div>
  );
};
