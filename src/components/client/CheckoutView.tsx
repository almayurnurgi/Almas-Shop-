import React, { useState } from 'react';
import {
  MapPin,
  ClipboardCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Truck,
  ShieldCheck,
  Phone,
  User,
  Building,
  ShoppingBag
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Order, OrderAddress } from '../../types';

export const CheckoutView: React.FC = () => {
  const { cart, cartTotal, placeOrder, navigate } = useApp();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  // Address form
  const [address, setAddress] = useState<OrderAddress>({
    fullName: '',
    phone: '',
    alternativePhone: '',
    province: 'Maputo Cidade',
    city: 'Maputo',
    neighborhood: '',
    street: '',
    referencePoint: ''
  });

  const [notes, setNotes] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  if (cart.length === 0 && step !== 3) {
    return (
      <div className="max-w-md mx-auto py-16 px-4 text-center">
        <h2 className="text-xl font-bold text-[#0F0F0F] mb-2">O seu carrinho está vazio</h2>
        <p className="text-xs text-gray-500 mb-6">Adicione itens antes de avançar para o checkout.</p>
        <button
          onClick={() => navigate('/')}
          className="bg-[#5DD62C] hover:bg-[#337418] text-[#0F0F0F] hover:text-white font-black text-xs py-3 px-6 rounded-xl transition shadow-md"
        >
          Voltar ao Marketplace
        </button>
      </div>
    );
  }

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.fullName.trim()) {
      setErrorMessage('Por favor, informe o seu Nome Completo.');
      return;
    }
    if (!address.phone.trim()) {
      setErrorMessage('Por favor, informe o seu Número de Telefone para contacto do estafeta.');
      return;
    }
    if (!address.neighborhood.trim()) {
      setErrorMessage('Por favor, informe o seu Bairro de entrega.');
      return;
    }

    setErrorMessage('');
    setStep(2); // Review Step
  };

  const handleConfirmOrder = async () => {
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const order = await placeOrder(address, notes);
      setCreatedOrder(order);
      setStep(3); // Success State
    } catch (err: any) {
      setErrorMessage(err?.message || 'Erro ao gerar pedido. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 pb-28 text-[#0F0F0F]">
      {/* Step indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between max-w-sm mx-auto relative">
          <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-0.5 bg-gray-200 z-0"></div>

          {/* Step 1 */}
          <div className="relative z-10 flex flex-col items-center">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition ${
                step >= 1
                  ? 'bg-[#5DD62C] text-[#0F0F0F] shadow-sm'
                  : 'bg-white text-gray-400 border border-gray-300'
              }`}
            >
              1
            </div>
            <span className="text-[10px] mt-1 font-semibold text-gray-700">Endereço</span>
          </div>

          {/* Step 2 */}
          <div className="relative z-10 flex flex-col items-center">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition ${
                step >= 2
                  ? 'bg-[#5DD62C] text-[#0F0F0F] shadow-sm'
                  : 'bg-white text-gray-400 border border-gray-300'
              }`}
            >
              2
            </div>
            <span className="text-[10px] mt-1 font-semibold text-gray-700">Revisão</span>
          </div>

          {/* Step 3 */}
          <div className="relative z-10 flex flex-col items-center">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition ${
                step === 3
                  ? 'bg-[#5DD62C] text-[#0F0F0F] shadow-sm'
                  : 'bg-white text-gray-400 border border-gray-300'
              }`}
            >
              3
            </div>
            <span className="text-[10px] mt-1 font-semibold text-gray-700">Sucesso</span>
          </div>
        </div>
      </div>

      {/* STEP 1: ADDRESS FORM */}
      {step === 1 && (
        <form onSubmit={handleAddressSubmit} className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
              <MapPin className="w-5 h-5 text-[#337418]" />
              <div>
                <h2 className="font-extrabold text-base text-[#0F0F0F]">Onde devemos entregar a sua encomenda?</h2>
                <p className="text-xs text-gray-500">Entrega grátis e imediata em Maputo e Matola.</p>
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
                {errorMessage}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-bold text-[#0F0F0F] flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-gray-500" />
                  Nome Completo de Quem Recebe *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Carlos Ernesto Munguambe"
                  value={address.fullName}
                  onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                  className="w-full bg-[#F8F8F8] border border-gray-300 focus:border-[#5DD62C] focus:bg-white text-xs sm:text-sm text-[#0F0F0F] rounded-xl p-3 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#0F0F0F] flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-gray-500" />
                  Telefone Principal (M-Pesa / Chamadas) *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Ex: +258 84 123 4567"
                  value={address.phone}
                  onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                  className="w-full bg-[#F8F8F8] border border-gray-300 focus:border-[#5DD62C] focus:bg-white text-xs sm:text-sm text-[#0F0F0F] rounded-xl p-3 focus:outline-none font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-gray-400" />
                  Telefone Alternativo (Opcional)
                </label>
                <input
                  type="tel"
                  placeholder="Ex: +258 82 987 6543"
                  value={address.alternativePhone}
                  onChange={(e) => setAddress({ ...address, alternativePhone: e.target.value })}
                  className="w-full bg-[#F8F8F8] border border-gray-300 focus:border-[#5DD62C] focus:bg-white text-xs sm:text-sm text-[#0F0F0F] rounded-xl p-3 focus:outline-none font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#0F0F0F] flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-gray-500" />
                  Província / Região
                </label>
                <select
                  value={address.province}
                  onChange={(e) => setAddress({ ...address, province: e.target.value })}
                  className="w-full bg-[#F8F8F8] border border-gray-300 focus:border-[#5DD62C] focus:bg-white text-xs sm:text-sm text-[#0F0F0F] rounded-xl p-3 focus:outline-none"
                >
                  <option value="Maputo Cidade">Maputo Cidade (Entrega Grátis)</option>
                  <option value="Maputo Província">Maputo Província (Matola Grátis)</option>
                  <option value="Gaza">Gaza</option>
                  <option value="Inhambane">Inhambane</option>
                  <option value="Sofala">Sofala (Beira)</option>
                  <option value="Nampula">Nampula</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#0F0F0F]">Bairro / Zona *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Polana Caniço, Sommerschield, Matola Rio..."
                  value={address.neighborhood}
                  onChange={(e) => setAddress({ ...address, neighborhood: e.target.value })}
                  className="w-full bg-[#F8F8F8] border border-gray-300 focus:border-[#5DD62C] focus:bg-white text-xs sm:text-sm text-[#0F0F0F] rounded-xl p-3 focus:outline-none"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-bold text-gray-700">Avenida, Rua ou Ponto de Referência</label>
                <input
                  type="text"
                  placeholder="Ex: Próximo à bomba da Total, Casa nº 140 portão verde"
                  value={address.referencePoint}
                  onChange={(e) => setAddress({ ...address, referencePoint: e.target.value })}
                  className="w-full bg-[#F8F8F8] border border-gray-300 focus:border-[#5DD62C] focus:bg-white text-xs sm:text-sm text-[#0F0F0F] rounded-xl p-3 focus:outline-none"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-bold text-gray-700">Instruções para o Estafeta (Opcional)</label>
                <textarea
                  rows={2}
                  placeholder="Ex: Entregar após as 14 horas..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-[#F8F8F8] border border-gray-300 focus:border-[#5DD62C] focus:bg-white text-xs sm:text-sm text-[#0F0F0F] rounded-xl p-3 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => navigate('/carrinho')}
              className="p-3 text-gray-600 hover:text-[#0F0F0F] text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Voltar ao Carrinho
            </button>
            <button
              type="submit"
              className="bg-[#5DD62C] hover:bg-[#337418] text-[#0F0F0F] hover:text-white font-black py-3.5 px-6 rounded-full transition text-xs sm:text-sm shadow-md flex items-center gap-2 cursor-pointer"
            >
              <span>Avançar para Revisão</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}

      {/* STEP 2: REVIEW */}
      {step === 2 && (
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <ClipboardCheck className="w-5 h-5 text-[#337418]" />
                <h2 className="font-extrabold text-base text-[#0F0F0F]">Revisão da Encomenda</h2>
              </div>
              <button
                onClick={() => setStep(1)}
                className="text-xs text-[#337418] font-bold hover:underline"
              >
                Editar Endereço
              </button>
            </div>

            {/* Delivery address review */}
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-1.5 text-xs">
              <p className="text-gray-500 font-bold uppercase tracking-wider text-[10px]">
                Endereço de Entrega Selecionado:
              </p>
              <p className="font-extrabold text-sm text-[#0F0F0F]">{address.fullName}</p>
              <p className="text-gray-700">
                {address.neighborhood}, {address.city} - {address.province}
              </p>
              {address.referencePoint && (
                <p className="text-gray-500 italic">Ref: {address.referencePoint}</p>
              )}
              <p className="font-mono text-[#337418] font-bold pt-1">
                Telefone: {address.phone} {address.alternativePhone ? `· ${address.alternativePhone}` : ''}
              </p>
            </div>

            {/* Items review */}
            <div className="space-y-3">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Itens no Pedido:</p>
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between text-xs py-2 border-b border-gray-100 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 rounded-xl object-cover border border-gray-200"
                    />
                    <div>
                      <p className="font-bold text-[#0F0F0F] line-clamp-1">{item.name}</p>
                      <p className="text-gray-500 text-[11px]">
                        {item.quantity}x {item.price.toLocaleString()} MT
                      </p>
                    </div>
                  </div>
                  <span className="font-extrabold text-[#0F0F0F]">
                    {(item.quantity * item.price).toLocaleString()} MT
                  </span>
                </div>
              ))}
            </div>

            {/* Perks banner */}
            <div className="bg-[#5DD62C]/15 border border-[#5DD62C]/40 p-4 rounded-2xl space-y-2 text-xs">
              <div className="flex items-center gap-2 text-[#337418] font-bold">
                <Truck className="w-4 h-4" />
                <span>Entrega Grátis em Maputo e Matola Garantida</span>
              </div>
              <div className="flex items-center gap-2 text-[#0F0F0F] font-semibold">
                <ShieldCheck className="w-4 h-4 text-[#337418]" />
                <span>Pague somente quando receber em mãos (Numerário ou M-Pesa).</span>
              </div>
            </div>

            {/* Total box */}
            <div className="pt-2 flex items-center justify-between text-sm sm:text-base border-t border-gray-100">
              <span className="font-bold text-[#0F0F0F]">Total a Pagar na Entrega:</span>
              <span className="text-2xl font-black text-[#0F0F0F] tracking-tight">
                {cartTotal.toLocaleString()} MT
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="p-3 text-gray-600 hover:text-[#0F0F0F] text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Voltar
            </button>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleConfirmOrder}
              className="bg-[#5DD62C] hover:bg-[#337418] text-[#0F0F0F] hover:text-white font-black py-4 px-8 rounded-full transition text-xs sm:text-sm shadow-md flex items-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <span>A processar encomenda...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirmar Pedido (Pagar na Entrega)</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: ORDER CONFIRMED (Success state) */}
      {step === 3 && createdOrder && (
        <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-10 shadow-sm text-center space-y-6">
          <div className="w-16 h-16 bg-[#5DD62C]/20 text-[#337418] rounded-full flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#0F0F0F]">
              Encomenda Confirmada com Sucesso!
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              Obrigado por comprar na <strong>ALMAS-SHOP EASY SOLUTION</strong>.
            </p>
          </div>

          <div className="max-w-md mx-auto bg-gray-50 border border-gray-200 rounded-2xl p-4 text-xs space-y-2 text-left">
            <div className="flex justify-between border-b border-gray-200 pb-2">
              <span className="text-gray-500">Número do Pedido:</span>
              <span className="font-mono font-bold text-[#0F0F0F]">{createdOrder.id}</span>
            </div>
            <div className="flex justify-between border-b border-gray-200 pb-2">
              <span className="text-gray-500">Destinatário:</span>
              <span className="font-semibold text-[#0F0F0F]">{createdOrder.shippingAddress?.fullName || createdOrder.customerName}</span>
            </div>
            <div className="flex justify-between border-b border-gray-200 pb-2">
              <span className="text-gray-500">Telefone:</span>
              <span className="font-mono font-semibold text-[#0F0F0F]">{createdOrder.shippingAddress?.phone || createdOrder.customerPhone}</span>
            </div>
            <div className="flex justify-between border-b border-gray-200 pb-2">
              <span className="text-gray-500">Local de Entrega:</span>
              <span className="font-semibold text-[#0F0F0F]">
                {createdOrder.shippingAddress?.neighborhood ? `${createdOrder.shippingAddress.neighborhood}, ${createdOrder.shippingAddress.city}` : 'Maputo'}
              </span>
            </div>
            <div className="flex justify-between pt-1">
              <span className="font-bold text-[#0F0F0F]">Valor Total a Pagar:</span>
              <span className="font-black text-sm text-[#0F0F0F]">
                {createdOrder.totalAmount.toLocaleString()} MT
              </span>
            </div>
          </div>

          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            O nosso estafeta entrará em contacto por telefone antes de efetuar a entrega na sua morada.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="w-full sm:w-auto bg-[#5DD62C] hover:bg-[#337418] text-[#0F0F0F] hover:text-white font-black text-xs py-3.5 px-6 rounded-full transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Continuar a Comprar</span>
            </button>
            <button
              onClick={() => navigate('/pedidos')}
              className="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 text-[#0F0F0F] font-bold text-xs py-3.5 px-6 rounded-full border border-gray-200 transition cursor-pointer"
            >
              Ver Meus Pedidos
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
