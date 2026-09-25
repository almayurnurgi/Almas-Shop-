import React, { useState } from 'react';
import {
  Package,
  PlusCircle,
  Search,
  ExternalLink,
  Copy,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';

interface Props {
  onEditProduct: (product: Product) => void;
  onNewProduct: () => void;
}

export const VendorProducts: React.FC<Props> = ({ onEditProduct, onNewProduct }) => {
  const { products, currentUser, stores, deleteProduct, updateProduct, navigate, setFlashBanner } =
    useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const vendorStore =
    stores.find((s) => s.vendorId === currentUser?.id || s.vendorId === 'user_vendor_1') || stores[0];

  const vendorProducts = products.filter(
    (p) => p.vendorId === currentUser?.id || p.storeName === vendorStore.name || p.storeId === vendorStore.id
  );

  const filtered = vendorProducts.filter((p) => {
    const matchesSearch =
      !searchTerm ||
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCopyLink = (slug: string) => {
    const url = `${window.location.origin}/produto/${slug}`;
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(url);
      setFlashBanner({ message: 'Link de venda copiado com sucesso!', type: 'success' });
    }
  };

  const handleToggleStatus = (p: Product) => {
    const newStatus = p.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    updateProduct(p.id, { status: newStatus });
    setFlashBanner({
      message: `Status do produto alterado para ${newStatus === 'ACTIVE' ? 'Activo' : 'Inactivo'}`,
      type: 'info'
    });
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Tem certeza que deseja apagar o produto "${name}"?`)) {
      deleteProduct(id);
      setFlashBanner({ message: 'Produto removido com sucesso.', type: 'warning' });
    }
  };

  return (
    <div className="space-y-6 text-[#0F0F0F]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#0F0F0F] flex items-center gap-2">
            <Package className="w-6 h-6 text-[#337418]" />
            Catálogo de Produtos ({vendorProducts.length})
          </h1>
          <p className="text-xs text-gray-500">
            Gerencie preços, estoque, variantes e landing pages de venda dos seus produtos.
          </p>
        </div>

        <button
          onClick={onNewProduct}
          className="bg-[#5DD62C] hover:bg-[#337418] text-[#0F0F0F] hover:text-white font-black text-xs py-2.5 px-4 rounded-xl transition shadow-xs flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          Adicionar Novo Produto
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Pesquisar por nome ou categoria..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#F8F8F8] border border-gray-300 focus:border-[#5DD62C] text-xs text-[#0F0F0F] rounded-xl py-2 pl-9 pr-3 focus:outline-none"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-gray-500 font-semibold">Filtrar:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#F8F8F8] border border-gray-300 text-xs text-[#0F0F0F] font-semibold rounded-xl py-2 px-3 focus:outline-none"
          >
            <option value="ALL">Todos os Status</option>
            <option value="ACTIVE">Activo no Marketplace</option>
            <option value="INACTIVE">Inactivo / Pausado</option>
            <option value="DRAFT">Rascunho</option>
            <option value="OUT_OF_STOCK">Esgotado</option>
          </select>
        </div>
      </div>

      {/* Products Table/Cards */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-3xl p-12 text-center shadow-xs">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-[#0F0F0F] mb-1">Nenhum produto encontrado</h3>
            <p className="text-xs text-gray-500 mb-4">
              Crie o seu primeiro produto para começar a vender na ALMAS-SHOP.
            </p>
            <button
              onClick={onNewProduct}
              className="bg-[#5DD62C] hover:bg-[#337418] text-[#0F0F0F] hover:text-white font-black text-xs py-2.5 px-5 rounded-xl shadow-xs transition"
            >
              Criar Produto
            </button>
          </div>
        ) : (
          filtered.map((prod) => (
            <div
              key={prod.id}
              className="bg-white border border-gray-200 hover:border-gray-300 rounded-2xl p-4 shadow-xs transition flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4 min-w-0">
                <img
                  src={prod.images[0] || '/logo.svg'}
                  alt={prod.name}
                  className="w-16 h-16 rounded-xl object-cover border border-gray-200 flex-shrink-0 bg-gray-50"
                />

                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded font-semibold">
                      {prod.category}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        prod.status === 'ACTIVE'
                          ? 'bg-emerald-100 text-emerald-800'
                          : prod.status === 'INACTIVE'
                          ? 'bg-gray-100 text-gray-600'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {prod.status === 'ACTIVE'
                        ? 'Activo'
                        : prod.status === 'INACTIVE'
                        ? 'Inactivo'
                        : prod.status}
                    </span>
                    {prod.type === 'DIGITAL' && (
                      <span className="text-[10px] bg-sky-100 text-sky-800 px-2 py-0.5 rounded font-bold">
                        Digital
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-sm text-[#0F0F0F] truncate max-w-md">{prod.name}</h3>

                  <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                    <span className="font-black text-[#0F0F0F]">
                      {prod.salePrice.toLocaleString()} MT
                    </span>
                    {prod.regularPrice > prod.salePrice && (
                      <span className="line-through text-gray-400 text-[11px]">
                        {prod.regularPrice.toLocaleString()} MT
                      </span>
                    )}
                    <span className="text-gray-400 text-[11px]">Estoque: {prod.stock} un.</span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center gap-2 self-stretch md:self-auto justify-end border-t md:border-t-0 pt-3 md:pt-0 border-gray-100">
                <button
                  onClick={() => navigate(`/produto/${prod.slug}`)}
                  className="p-2 bg-white hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition border border-gray-200"
                  title="Pré-visualizar / Abrir página de vendas"
                >
                  <Eye className="w-3.5 h-3.5 text-[#337418]" />
                  <span>Página de Vendas</span>
                </button>

                <button
                  onClick={() => handleCopyLink(prod.slug)}
                  className="p-2 bg-white hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition border border-gray-200"
                  title="Copiar link de venda"
                >
                  <Copy className="w-3.5 h-3.5 text-[#337418]" />
                  <span className="hidden sm:inline">Copiar Link</span>
                </button>

                <button
                  onClick={() => onEditProduct(prod)}
                  className="p-2 bg-[#5DD62C] hover:bg-[#337418] text-[#0F0F0F] hover:text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                  title="Editar dados do produto"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Editar</span>
                </button>

                <button
                  onClick={() => handleToggleStatus(prod)}
                  className={`p-2 rounded-xl text-xs font-semibold transition border ${
                    prod.status === 'ACTIVE'
                      ? 'bg-gray-100 border-gray-200 text-gray-700 hover:text-amber-700'
                      : 'bg-emerald-50 border-emerald-300 text-emerald-800'
                  }`}
                  title="Pausar / Activar"
                >
                  {prod.status === 'ACTIVE' ? 'Pausar' : 'Activar'}
                </button>

                <button
                  onClick={() => handleDelete(prod.id, prod.name)}
                  className="p-2 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 rounded-xl text-xs transition"
                  title="Apagar produto"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
