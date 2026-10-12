import React from 'react';
import { Star, ShieldCheck, ShoppingCart, Eye, Sparkles } from 'lucide-react';
import { Product } from '../../types';
import { useApp } from '../../context/AppContext';

interface Props {
  product: Product;
}

export const ProductCard: React.FC<Props> = ({ product }) => {
  const { navigate, addToCart } = useApp();

  const handleCardClick = () => {
    navigate(`/produto/${product.slug}`);
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group bg-white border border-gray-200 hover:border-[#5DD62C] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
    >
      {/* Image container */}
      <div className="relative aspect-square w-full bg-gray-50 overflow-hidden">
        <img
          src={product.images[0] || '/logo.svg'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
          {product.discountPercent > 0 && (
            <span className="bg-[#5DD62C] text-[#0F0F0F] font-extrabold text-[11px] px-2 py-0.5 rounded-full shadow-xs">
              -{product.discountPercent}% OFF
            </span>
          )}
          {product.isBestSeller && (
            <span className="bg-amber-400 text-[#0F0F0F] font-bold text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
              <Sparkles className="w-2.5 h-2.5" /> Top Vendas
            </span>
          )}
          {product.type === 'DIGITAL' && (
            <span className="bg-[#0F0F0F] text-white font-medium text-[10px] px-2 py-0.5 rounded-full">
              Download Digital
            </span>
          )}
        </div>

        {/* Quick view icon on hover */}
        <div className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="p-2 bg-white/90 backdrop-blur-sm rounded-full text-gray-700 shadow flex items-center justify-center">
            <Eye className="w-3.5 h-3.5" />
          </span>
        </div>

        {/* Stock warning */}
        {product.stock <= 5 && product.stock > 0 && (
          <div className="absolute bottom-2 left-2 bg-[#0F0F0F]/90 text-amber-300 text-[10px] px-2 py-0.5 rounded-md">
            Restam apenas {product.stock} un.
          </div>
        )}
      </div>

      {/* Details */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between bg-white">
        <div>
          {/* Store name */}
          <div className="flex items-center justify-between text-[11px] text-gray-500 mb-1 font-medium">
            <span className="truncate">{product.storeName}</span>
            <span className="flex items-center gap-1 text-amber-500 font-semibold">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{product.rating.toFixed(1)}</span>
            </span>
          </div>

          {/* Product title */}
          <h3 className="font-semibold text-[#0F0F0F] text-xs sm:text-sm line-clamp-2 mb-2 group-hover:text-[#337418] transition-colors leading-snug">
            {product.name}
          </h3>
        </div>

        <div>
          {/* Price DE/POR */}
          <div className="mt-2 mb-3">
            {product.regularPrice > product.salePrice && (
              <span className="text-[11px] text-gray-400 line-through mr-1.5 font-medium">
                DE {product.regularPrice.toLocaleString()} MT
              </span>
            )}
            <div className="flex items-baseline gap-1">
              <span className="text-xs text-[#337418] font-bold">POR</span>
              <span className="text-base sm:text-lg font-black text-[#0F0F0F] tracking-tight">
                {product.salePrice.toLocaleString()} MT
              </span>
            </div>
          </div>

          {/* Delivery perk & CTA */}
          <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-2">
            <span className="text-[10px] text-[#337418] font-bold flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-[#337418]" />
              Paga na entrega
            </span>
            <button
              onClick={handleQuickAdd}
              className="p-2 bg-[#5DD62C] hover:bg-[#337418] text-[#0F0F0F] hover:text-white rounded-xl transition shadow-xs"
              title="Adicionar ao carrinho"
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
