import React, { useState } from 'react';
import {
  Wallet,
  ArrowUpRight,
  TrendingDown,
  Clock,
  CheckCircle,
  AlertCircle,
  Send,
  Building,
  Smartphone
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Withdrawal, WithdrawalStatus } from '../../types';

export const VendorWallet: React.FC = () => {
  const { wallets, withdrawals, currentUser, requestWithdrawal, setFlashBanner, settings } = useApp();
  const vendorId = currentUser?.id || 'user_vendor_1';
  const wallet =
    wallets[vendorId] ||
    Object.values(wallets)[0] || {
      vendorId,
      availableBalance: 0,
      pendingBalance: 0,
      totalSales: 0,
      totalCommissions: 0,
      totalWithdrawn: 0,
      transactions: [],
      updatedAt: new Date().toISOString()
    };

  const vendorWithdrawals = withdrawals.filter(
    (w) => w.vendorId === vendorId || w.vendorId === 'user_vendor_1'
  );

  const [amount, setAmount] = useState<number>(1000);
  const [method, setMethod] = useState<'MPESA' | 'EMOLA' | 'BANK'>('MPESA');
  const [destinationAccount, setDestinationAccount] = useState('843456786');
  const [destinationName, setDestinationName] = useState('Yur Scandarnurgi');
  const [bankName, setBankName] = useState('Millennium BIM');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleWithdrawalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) {
      alert('Insira um valor válido para levantamento.');
      return;
    }
    if (amount > wallet.availableBalance) {
      alert('O valor solicitado é superior ao seu saldo disponível.');
      return;
    }
    if (!destinationAccount.trim()) {
      alert('Informe o número de conta ou telemóvel para envio.');
      return;
    }

    try {
      setIsSubmitting(true);
      requestWithdrawal(
        vendorId,
        amount,
        method,
        {
          accountNumber: destinationAccount,
          phoneNumber: destinationAccount,
          holderName: destinationName,
          bankName: method === 'BANK' ? bankName : undefined
        }
      );

      setFlashBanner({
        message: 'Solicitação de levantamento enviada com sucesso ao Super Administrador!',
        type: 'success'
      });
      setShowModal(false);
    } catch (err) {
      alert('Erro ao solicitar levantamento.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: WithdrawalStatus) => {
    switch (status) {
      case 'PAID':
        return (
          <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1">
            <CheckCircle className="w-3 h-3" /> Pago & Liquidado
          </span>
        );
      case 'REJECTED':
        return (
          <span className="bg-rose-100 text-rose-800 border border-rose-300 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
            Rejeitado
          </span>
        );
      default:
        return (
          <span className="bg-amber-100 text-amber-800 border border-amber-300 px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1">
            <Clock className="w-3 h-3" /> Pendente de Aprovação
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 text-[#0F0F0F]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#0F0F0F] flex items-center gap-2">
            <Wallet className="w-6 h-6 text-[#337418]" />
            Carteira & Levantamentos em Meticais
          </h1>
          <p className="text-xs text-gray-500">
            Acompanhe o saldo das suas vendas, comissões de {settings.commissionRate || 5}% e solicite pagamentos via M-Pesa ou banco.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          disabled={wallet.availableBalance <= 0}
          className="bg-[#5DD62C] hover:bg-[#337418] disabled:opacity-40 text-[#0F0F0F] hover:text-white font-black text-xs py-2.5 px-5 rounded-xl shadow-xs flex items-center gap-2 transition"
        >
          <ArrowUpRight className="w-4 h-4" />
          Solicitar Levantamento
        </button>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-500 font-semibold">
            <span>Saldo Disponível</span>
            <Wallet className="w-5 h-5 text-[#337418]" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-[#0F0F0F]">
            {wallet.availableBalance.toLocaleString()} MT
          </p>
          <p className="text-[11px] text-[#337418] font-bold">
            Livre para saque imediato em Moçambique
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-500 font-semibold">
            <span>Saldo Pendente (A Entregar)</span>
            <Clock className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-amber-600">
            {wallet.pendingBalance.toLocaleString()} MT
          </p>
          <p className="text-[11px] text-gray-400">
            Será liberado assim que o cliente receber a entrega
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-500 font-semibold">
            <span>Comissão da Plataforma</span>
            <TrendingDown className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-gray-700">
            {settings.commissionRate}%
          </p>
          <p className="text-[11px] text-gray-400">
            Total retido: {wallet.totalCommissions.toLocaleString()} MT
          </p>
        </div>
      </div>

      {/* Withdrawals History */}
      <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-[#0F0F0F] flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#337418]" />
          Histórico de Solicitações de Levantamento
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-700">
            <thead className="bg-[#F8F8F8] text-gray-500 uppercase text-[10px]">
              <tr>
                <th className="p-3 rounded-l-xl">Data</th>
                <th className="p-3">Valor Solicitado</th>
                <th className="p-3">Método / Canal</th>
                <th className="p-3">Conta de Destino</th>
                <th className="p-3">Status</th>
                <th className="p-3 rounded-r-xl">Observações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {vendorWithdrawals.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-gray-400">
                    Nenhum levantamento solicitado até o momento.
                  </td>
                </tr>
              ) : (
                vendorWithdrawals.map((req) => (
                  <tr key={req.id} className="hover:bg-gray-50 transition">
                    <td className="p-3 text-gray-500">
                      {new Date(req.requestedAt).toLocaleDateString('pt-PT')}
                    </td>
                    <td className="p-3 font-black text-[#0F0F0F] text-sm">
                      {req.amount.toLocaleString()} MT
                    </td>
                    <td className="p-3 font-semibold text-[#0F0F0F]">
                      {req.method === 'MPESA'
                        ? 'Vodacom M-Pesa'
                        : req.method === 'EMOLA'
                        ? 'Movitel e-Mola'
                        : `Bancário (${req.accountDetails.bankName || 'BIM'})`}
                    </td>
                    <td className="p-3 font-mono text-gray-600">
                      {req.accountDetails.phoneNumber || req.accountDetails.accountNumber} (
                      {req.accountDetails.holderName})
                    </td>
                    <td className="p-3">{getStatusBadge(req.status)}</td>
                    <td className="p-3 text-[11px] text-gray-400">
                      {req.notes || 'A aguardar validação do Super Admin'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Withdrawal Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-[#0F0F0F]/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white border border-gray-200 rounded-3xl p-6 shadow-2xl space-y-4">
            <h2 className="text-lg font-black text-[#0F0F0F] flex items-center gap-2">
              <Send className="w-5 h-5 text-[#337418]" />
              Solicitar Levantamento de Fundos
            </h2>

            <p className="text-xs text-gray-600">
              Saldo disponível atual: <strong className="text-[#337418]">{wallet.availableBalance.toLocaleString()} MT</strong>.
              A aprovação é feita pelo administrador do ALMAS-SHOP antes do depósito.
            </p>

            <form onSubmit={handleWithdrawalSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  Valor a Levantar (MT) *
                </label>
                <input
                  type="number"
                  min="100"
                  max={wallet.availableBalance}
                  required
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full bg-[#F8F8F8] border border-gray-300 focus:border-[#5DD62C] text-sm text-[#0F0F0F] font-bold rounded-xl p-3 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  Canal de Pagamento em Moçambique *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setMethod('MPESA')}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition flex flex-col items-center gap-1 ${
                      method === 'MPESA'
                        ? 'border-[#5DD62C] bg-[#5DD62C]/10 text-[#0F0F0F]'
                        : 'border-gray-200 bg-[#F8F8F8] text-gray-500'
                    }`}
                  >
                    <Smartphone className="w-4 h-4 text-rose-500" />
                    <span>M-Pesa</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMethod('EMOLA')}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition flex flex-col items-center gap-1 ${
                      method === 'EMOLA'
                        ? 'border-[#5DD62C] bg-[#5DD62C]/10 text-[#0F0F0F]'
                        : 'border-gray-200 bg-[#F8F8F8] text-gray-500'
                    }`}
                  >
                    <Smartphone className="w-4 h-4 text-amber-500" />
                    <span>e-Mola</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMethod('BANK')}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition flex flex-col items-center gap-1 ${
                      method === 'BANK'
                        ? 'border-[#5DD62C] bg-[#5DD62C]/10 text-[#0F0F0F]'
                        : 'border-gray-200 bg-[#F8F8F8] text-gray-500'
                    }`}
                  >
                    <Building className="w-4 h-4 text-sky-500" />
                    <span>Bancário</span>
                  </button>
                </div>
              </div>

              {method === 'BANK' && (
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    Nome do Banco *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Millennium BIM, BCI, Standard Bank..."
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full bg-[#F8F8F8] border border-gray-300 text-xs text-[#0F0F0F] rounded-xl p-3 focus:outline-none"
                  />
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  Número de Telemóvel ou NIB/Conta *
                </label>
                <input
                  type="text"
                  required
                  placeholder={method === 'BANK' ? 'Ex: 00010000...' : 'Ex: 84 345 6786'}
                  value={destinationAccount}
                  onChange={(e) => setDestinationAccount(e.target.value)}
                  className="w-full bg-[#F8F8F8] border border-gray-300 text-xs text-[#0F0F0F] rounded-xl p-3 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  Nome do Titular da Conta *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Nome completo igual ao documento"
                  value={destinationName}
                  onChange={(e) => setDestinationName(e.target.value)}
                  className="w-full bg-[#F8F8F8] border border-gray-300 text-xs text-[#0F0F0F] rounded-xl p-3 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="text-xs text-gray-500 hover:text-[#0F0F0F] px-4 py-2"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#5DD62C] hover:bg-[#337418] text-[#0F0F0F] hover:text-white font-black text-xs py-2.5 px-5 rounded-xl shadow-xs transition"
                >
                  {isSubmitting ? 'Enviando...' : 'Confirmar Solicitação'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
