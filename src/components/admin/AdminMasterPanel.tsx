import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldCheck,
  Users,
  ShoppingCart,
  DollarSign,
  Wallet,
  Settings,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Search,
  Upload,
  Clock,
  Key,
  LogOut,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Percent,
  Lock,
  UserX,
  UserCheck,
  Plus,
  Trash2,
  Edit2,
  Image as ImageIcon,
  RotateCcw,
  Package,
  Phone,
  MapPin,
  Sparkles,
  Menu,
  X,
  WifiOff,
  UserPlus,
  ShieldAlert
} from 'lucide-react';
import { playSaleChime } from '../../utils/audio';
import { useApp } from '../../context/AppContext';
import { User, Order, HeroBannerItem, Product } from '../../types';

interface AdminMasterPanelProps {
  onLogout?: () => void;
}

export const AdminMasterPanel: React.FC<AdminMasterPanelProps> = ({ onLogout }) => {
  const {
    currentUser,
    users,
    orders,
    products,
    deleteProduct,
    adminModerateProduct,
    wallets,
    withdrawals,
    settings,
    updateSettings,
    updateUserBanStatus,
    approveVendorApplication,
    rejectVendorApplication,
    updateWithdrawalStatus,
    auditLogs,
    addAuditLog,
    switchUserRole,
    navigate,
    setFlashBanner,
    deleteOrder,
    editOrder,
    adminAddOrder,
    resetProductionData,
    updateOrderStatus,
    registerUser,
    isOnline
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'visao-geral' | 'pedidos' | 'produtos' | 'usuarios' | 'vendedores' | 'levantamentos' | 'comissao' | 'banners' | 'logo' | 'auditoria' | 'admins'
  >('visao-geral');

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Product moderation state
  const [productSearch, setProductSearch] = useState('');
  const [productStatusFilter, setProductStatusFilter] = useState<'ALL' | 'ACTIVE' | 'REJECTED' | 'OUT_OF_STOCK'>('ALL');
  const [productModerationModal, setProductModerationModal] = useState<{
    product: Product;
    action: 'REJECT' | 'APPROVE';
  } | null>(null);
  const [productModerationReason, setProductModerationReason] = useState('');

  // Auto-play sale chime on new orders
  const previousOrdersCount = useRef(orders.length);
  useEffect(() => {
    if (orders.length > previousOrdersCount.current) {
      playSaleChime();
      const latestOrder = orders[0];
      setFlashBanner({
        message: `🎉 Nova venda no ALMAS-SHOP! Pedido #${latestOrder?.orderNumber || 'Confirmado'}`,
        type: 'success'
      });
    }
    previousOrdersCount.current = orders.length;
  }, [orders.length, setFlashBanner]);

  // Ban Modal state
  const [banModalUser, setBanModalUser] = useState<User | null>(null);
  const [banReason, setBanReason] = useState('');

  // Logo upload state
  const [newLogoUrl, setNewLogoUrl] = useState(settings.platformLogo || '/logo.svg');

  // Commission state
  const [newCommissionRate, setNewCommissionRate] = useState(settings.commissionRate || 5);

  // Search filter for users & orders
  const [userSearch, setUserSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('ALL');

  // Order Management Modals
  const [isAddOrderModalOpen, setIsAddOrderModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [showResetConfirmModal, setShowResetConfirmModal] = useState(false);

  // Add Order Form State
  const [newOrderCustomerName, setNewOrderCustomerName] = useState('');
  const [newOrderCustomerPhone, setNewOrderCustomerPhone] = useState('');
  const [newOrderCity, setNewOrderCity] = useState('Maputo');
  const [newOrderNeighborhood, setNewOrderNeighborhood] = useState('Central');
  const [newOrderStreet, setNewOrderStreet] = useState('Av. 24 de Julho');
  const [newOrderProductName, setNewOrderProductName] = useState('');
  const [newOrderAmount, setNewOrderAmount] = useState<number>(1500);
  const [newOrderStatus, setNewOrderStatus] = useState<Order['status']>('DELIVERED');

  // Edit Order Form State
  const [editCustomerName, setEditCustomerName] = useState('');
  const [editCustomerPhone, setEditCustomerPhone] = useState('');
  const [editCity, setEditCity] = useState('');
  const [editNeighborhood, setEditNeighborhood] = useState('');
  const [editStreet, setEditStreet] = useState('');
  const [editAmount, setEditAmount] = useState<number>(0);
  const [editStatus, setEditStatus] = useState<Order['status']>('PENDING');

  // Banner Management State
  const currentBanners: HeroBannerItem[] = settings.heroBanners || [];
  const [editingBannerIndex, setEditingBannerIndex] = useState<number | null>(null);
  const [newBannerTitle, setNewBannerTitle] = useState('');
  const [newBannerSubtitle, setNewBannerSubtitle] = useState('');
  const [newBannerBadge, setNewBannerBadge] = useState('DESTAQUE');
  const [newBannerCtaText, setNewBannerCtaText] = useState('Comprar Agora');
  const [newBannerCtaLink, setNewBannerCtaLink] = useState('/produtos');
  const [newBannerImage, setNewBannerImage] = useState('');

  // Sub-admin creation
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminPhone, setNewAdminPhone] = useState('841234567');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [newAdminRole, setNewAdminRole] = useState<'CEO' | 'SUPPORT'>('CEO');
  const [newAdminPermissions, setNewAdminPermissions] = useState<string[]>([
    'PEDIDOS',
    'PRODUTOS',
    'VENDEDORES',
    'FINANCEIRO',
    'AUDITORIA'
  ]);

  // Filter pending vendors & withdrawals
  const pendingVendors = users.filter((u) => u.role === 'VENDOR' && u.vendorStatus === 'PENDING_APPROVAL');
  const allWithdrawals = withdrawals || [];
  const pendingWithdrawals = allWithdrawals.filter((w) => w.status === 'PENDING');

  // Calculations for KPI
  const totalGmv = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalCommissionEarned = totalGmv * ((settings.commissionRate || 5) / 100);

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      (p.sku && p.sku.toLowerCase().includes(productSearch.toLowerCase())) ||
      (p.storeName && p.storeName.toLowerCase().includes(productSearch.toLowerCase())) ||
      (p.category && p.category.toLowerCase().includes(productSearch.toLowerCase()));

    if (!matchesSearch) return false;

    if (productStatusFilter === 'ACTIVE') return p.status === 'ACTIVE' || (!p.status && p.stock > 0);
    if (productStatusFilter === 'REJECTED') return p.status === 'REJECTED';
    if (productStatusFilter === 'OUT_OF_STOCK') return p.stock === 0;

    return true;
  });

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      navigate('/');
    }
  };

  const handleConfirmProductModeration = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productModerationModal) return;

    const { product, action } = productModerationModal;
    if (action === 'REJECT') {
      if (!productModerationReason.trim()) {
        setFlashBanner({ message: 'Por favor, informe o motivo do bloqueio do produto.', type: 'error' });
        return;
      }
      adminModerateProduct(product.id, 'REJECTED', productModerationReason.trim());
    } else {
      adminModerateProduct(product.id, 'ACTIVE');
    }

    setProductModerationModal(null);
    setProductModerationReason('');
  };

  const filteredOrders = orders.filter((o) => {
    const customer = (o.shippingAddress?.fullName || o.customerName || '').toLowerCase();
    const phone = (o.shippingAddress?.phone || o.customerPhone || '').toLowerCase();
    const id = o.id.toLowerCase();
    const searchMatch = customer.includes(orderSearch.toLowerCase()) || phone.includes(orderSearch.toLowerCase()) || id.includes(orderSearch.toLowerCase());
    const statusMatch = orderStatusFilter === 'ALL' || o.status === orderStatusFilter;
    return searchMatch && statusMatch;
  });

  const handleConfirmBan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!banModalUser) return;

    if (!banReason.trim()) {
      setFlashBanner({ message: 'Por favor, informe o motivo do bloqueio.', type: 'error' });
      return;
    }

    updateUserBanStatus(banModalUser.id, true, banReason);
    addAuditLog('BAN_USER', `Bloqueou o usuário ${banModalUser.email}. Motivo: ${banReason}`);

    setFlashBanner({ message: `Usuário ${banModalUser.name} foi banido com sucesso.`, type: 'warning' });
    setBanModalUser(null);
    setBanReason('');
  };

  const handleUnban = (user: User) => {
    updateUserBanStatus(user.id, false);
    addAuditLog('UNBAN_USER', `Reativou a conta do usuário ${user.email}.`);
    setFlashBanner({ message: `A conta de ${user.name} foi reativada.`, type: 'success' });
  };

  // Gallery photo selection for Logo
  const handleLogoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setNewLogoUrl(result);
        updateSettings({ platformLogo: result });
        addAuditLog('UPDATE_LOGO', 'Logótipo oficial atualizado via foto da galeria do dispositivo.');
        setFlashBanner({ message: 'Logótipo oficial atualizado com sucesso!', type: 'success' });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveLogo = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({ platformLogo: newLogoUrl });
    addAuditLog('UPDATE_LOGO', `Atualizou o logótipo oficial da plataforma.`);
    setFlashBanner({ message: 'Logótipo da ALMAS-SHOP salvo!', type: 'success' });
  };

  // Gallery photo selection for Banner
  const handleBannerFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewBannerImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddOrUpdateBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBannerTitle.trim() || !newBannerImage) {
      setFlashBanner({ message: 'Por favor, selecione uma imagem da galeria e preencha o título.', type: 'error' });
      return;
    }

    let updatedBanners: HeroBannerItem[] = [...currentBanners];
    const bannerItem: HeroBannerItem = {
      id: editingBannerIndex !== null ? updatedBanners[editingBannerIndex]?.id || 'banner_' + Date.now() : 'banner_' + Date.now(),
      title: newBannerTitle.trim(),
      subtitle: newBannerSubtitle.trim(),
      badge: newBannerBadge.trim(),
      badgeText: newBannerBadge.trim(),
      ctaText: newBannerCtaText.trim() || 'Comprar Agora',
      link: newBannerCtaLink.trim() || '/produtos',
      ctaLink: newBannerCtaLink.trim() || '/produtos',
      imageUrl: newBannerImage
    };

    if (editingBannerIndex !== null) {
      updatedBanners[editingBannerIndex] = bannerItem;
      setEditingBannerIndex(null);
    } else {
      updatedBanners.push(bannerItem);
    }

    updateSettings({ heroBanners: updatedBanners });
    addAuditLog('UPDATE_HERO_BANNERS', `Banner salvo pelo administrador: ${bannerItem.title}`);
    setFlashBanner({ message: 'Carrossel de banners atualizado com sucesso!', type: 'success' });

    // Reset banner form
    setNewBannerTitle('');
    setNewBannerSubtitle('');
    setNewBannerBadge('DESTAQUE');
    setNewBannerCtaText('Comprar Agora');
    setNewBannerCtaLink('/produtos');
    setNewBannerImage('');
  };

  const handleDeleteBanner = (index: number) => {
    const updated = currentBanners.filter((_, i) => i !== index);
    updateSettings({ heroBanners: updated });
    addAuditLog('DELETE_HERO_BANNER', `Banner na posição ${index + 1} removido`);
    setFlashBanner({ message: 'Banner removido do carrossel.', type: 'info' });
  };

  const handleSaveCommission = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({ commissionRate: Number(newCommissionRate) });
    addAuditLog('UPDATE_COMMISSION', `Atualizou a taxa de comissão padrão para ${newCommissionRate}%.`);
    setFlashBanner({ message: `Taxa de comissão atualizada para ${newCommissionRate}%!`, type: 'success' });
  };

  const handleWithdrawalAction = (id: string, newStatus: 'PAID' | 'REJECTED') => {
    updateWithdrawalStatus(id, newStatus);
    addAuditLog(newStatus === 'PAID' ? 'APPROVE_WITHDRAWAL' : 'REJECT_WITHDRAWAL', `Levantamento #${id} marcado como ${newStatus}.`);
    setFlashBanner({
      message: `Levantamento #${id} foi ${newStatus === 'PAID' ? 'aprovado e liquidado' : 'recusado'}.`,
      type: newStatus === 'PAID' ? 'success' : 'warning'
    });
  };

  const handleCreateSubAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminName.trim() || !newAdminEmail.trim() || !newAdminPassword.trim()) {
      setFlashBanner({ message: 'Preencha nome, email e palavra-passe para o novo administrador.', type: 'error' });
      return;
    }

    try {
      await registerUser({
        name: newAdminName.trim(),
        email: newAdminEmail.trim().toLowerCase(),
        phone: newAdminPhone.trim() || '843456786',
        role: 'ADMIN',
        password: newAdminPassword.trim(),
        adminLevel: newAdminRole,
        permissions: newAdminPermissions,
        createdByAdminId: currentUser?.id || 'user_admin_1'
      });

      addAuditLog(
        'CREATE_SUB_ADMIN',
        `Super Admin criou novo administrador delegado (${newAdminRole}): ${newAdminName} (${newAdminEmail}) com ${newAdminPermissions.length} permissões.`
      );
      setFlashBanner({
        message: `Administrador delegado (${newAdminRole === 'CEO' ? 'CEO' : 'Suporte'}) ${newAdminName} criado com sucesso! Login liberado.`,
        type: 'success'
      });
      setNewAdminEmail('');
      setNewAdminName('');
      setNewAdminPassword('');
    } catch (err: any) {
      setFlashBanner({ message: err.message || 'Erro ao cadastrar administrador.', type: 'error' });
    }
  };

  // Submit Add Order
  const handleAddOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrderCustomerName.trim()) {
      setFlashBanner({ message: 'Informe o nome do cliente.', type: 'error' });
      return;
    }

    adminAddOrder({
      customerName: newOrderCustomerName.trim(),
      customerPhone: newOrderCustomerPhone.trim() || '84 000 0000',
      shippingAddress: {
        fullName: newOrderCustomerName.trim(),
        phone: newOrderCustomerPhone.trim() || '84 000 0000',
        province: 'Maputo Cidade',
        city: newOrderCity.trim() || 'Maputo',
        neighborhood: newOrderNeighborhood.trim() || 'Central',
        street: newOrderStreet.trim() || 'Av. 24 de Julho',
        referencePoint: 'Próximo ao centro'
      },
      items: [
        {
          productId: 'prod_manual',
          productName: newOrderProductName.trim() || 'Item Lançado pelo Admin',
          productImage: '/logo.svg',
          price: Number(newOrderAmount) || 1000,
          quantity: 1,
          storeId: 'store_almas_official',
          storeName: 'ALMAS-SHOP Oficial'
        }
      ],
      totalAmount: Number(newOrderAmount) || 1000,
      status: newOrderStatus,
      paymentMethod: 'CASH_ON_DELIVERY',
      notes: 'Lançamento manual direto pelo Painel Mestre'
    });

    setIsAddOrderModalOpen(false);
    setNewOrderCustomerName('');
    setNewOrderCustomerPhone('');
    setNewOrderProductName('');
    setNewOrderAmount(1500);
  };

  // Submit Edit Order
  const openEditOrderModal = (order: Order) => {
    setEditingOrder(order);
    setEditCustomerName(order.shippingAddress?.fullName || order.customerName || '');
    setEditCustomerPhone(order.shippingAddress?.phone || order.customerPhone || '');
    setEditCity(order.shippingAddress?.city || 'Maputo');
    setEditNeighborhood(order.shippingAddress?.neighborhood || '');
    setEditStreet(order.shippingAddress?.street || '');
    setEditAmount(order.totalAmount || 0);
    setEditStatus(order.status);
  };

  const handleEditOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrder) return;

    editOrder(editingOrder.id, {
      customerName: editCustomerName.trim(),
      customerPhone: editCustomerPhone.trim(),
      shippingAddress: {
        fullName: editCustomerName.trim(),
        phone: editCustomerPhone.trim(),
        province: editingOrder.shippingAddress?.province || 'Maputo Cidade',
        city: editCity.trim(),
        neighborhood: editNeighborhood.trim(),
        street: editStreet.trim(),
        referencePoint: editingOrder.shippingAddress?.referencePoint || 'Centro'
      },
      totalAmount: Number(editAmount),
      status: editStatus
    });

    setEditingOrder(null);
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8] text-[#0F0F0F] flex flex-col md:flex-row pb-16">
      {/* Mobile Top Header with Hamburger Icon */}
      <div className="md:hidden bg-[#0F0F0F] text-white p-4 flex items-center justify-between border-b border-[#202020] sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 bg-[#202020] rounded-xl text-white hover:text-[#5DD62C] transition cursor-pointer"
            aria-label="Menu Admin"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div>
            <span className="font-extrabold text-sm text-white block leading-tight">Olá Chefe, Painel Mestre</span>
            <span className="text-[10px] text-[#5DD62C] font-mono flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-[#5DD62C] animate-pulse"></span>
              Tempo Real Ativo
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="text-xs bg-[#202020] px-3 py-1.5 rounded-full text-gray-300 hover:text-white border border-gray-700"
          >
            Loja
          </button>
        </div>
      </div>

      {/* Super Admin Dark Sidebar: #0F0F0F and #202020 */}
      <aside
        className={`${
          isMobileMenuOpen ? 'block' : 'hidden'
        } ${isSidebarOpen ? 'md:block' : 'md:hidden'} w-full md:w-64 bg-[#0F0F0F] text-white border-r border-[#202020] p-4 flex-shrink-0 shadow-lg`}
      >
        {/* Admin Badge */}
        <div className="bg-[#202020] border border-gray-700 rounded-2xl p-3.5 mb-5 space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#0F0F0F] rounded-xl text-[#5DD62C] border border-gray-700">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <p className="font-bold text-xs text-white">Olá Chefe, Painel Mestre</p>
              <p className="text-[10px] text-gray-400 truncate font-mono">almayurnurgi563@gmail.com</p>
            </div>
          </div>

          <div className="pt-2 border-t border-gray-700/60 flex items-center justify-between">
            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Modo de Operação:</span>
            {isOnline ? (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#5DD62C]/10 border border-[#5DD62C]/30 text-[10px] text-[#5DD62C] font-semibold font-mono">
                <span className="h-1.5 w-1.5 rounded-full bg-[#5DD62C] animate-pulse"></span>
                Tempo Real Online
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-[10px] text-amber-400 font-semibold font-mono">
                <WifiOff className="w-2.5 h-2.5" />
                Cache Offline Ativo
              </span>
            )}
          </div>
        </div>

        {/* Menu */}
        <nav className="space-y-1 text-xs">
          <button
            onClick={() => {
              setActiveTab('visao-geral');
              setIsMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-semibold transition ${
              activeTab === 'visao-geral' ? 'bg-[#5DD62C] text-[#0F0F0F] font-bold shadow-xs' : 'text-gray-300 hover:bg-[#202020] hover:text-white'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Visão Geral & KPIs</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('pedidos');
              setIsMobileMenuOpen(false);
            }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold transition ${
              activeTab === 'pedidos' ? 'bg-[#5DD62C] text-[#0F0F0F] font-bold shadow-xs' : 'text-gray-300 hover:bg-[#202020] hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <ShoppingCart className="w-4 h-4" />
              <span>Gestão de Pedidos</span>
            </div>
            <span className="text-[10px] bg-black/40 px-1.5 py-0.5 rounded font-bold">
              {orders.length}
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab('produtos');
              setIsMobileMenuOpen(false);
            }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold transition ${
              activeTab === 'produtos' ? 'bg-[#5DD62C] text-[#0F0F0F] font-bold shadow-xs' : 'text-gray-300 hover:bg-[#202020] hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Package className="w-4 h-4" />
              <span>Moderação de Produtos</span>
            </div>
            <span className="text-[10px] bg-black/40 px-1.5 py-0.5 rounded font-bold">
              {products.length}
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab('usuarios');
              setIsMobileMenuOpen(false);
            }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold transition ${
              activeTab === 'usuarios' ? 'bg-[#5DD62C] text-[#0F0F0F] font-bold shadow-xs' : 'text-gray-300 hover:bg-[#202020] hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Users className="w-4 h-4" />
              <span>Usuários & Banimentos</span>
            </div>
            <span className="text-[10px] bg-black/40 px-1.5 py-0.5 rounded font-bold">
              {users.length}
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab('vendedores');
              setIsMobileMenuOpen(false);
            }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold transition ${
              activeTab === 'vendedores' ? 'bg-[#5DD62C] text-[#0F0F0F] font-bold shadow-xs' : 'text-gray-300 hover:bg-[#202020] hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4" />
              <span>Aprovar Vendedores</span>
            </div>
            {pendingVendors.length > 0 && (
              <span className="text-[10px] bg-amber-400 text-[#0F0F0F] px-1.5 py-0.5 rounded font-bold">
                {pendingVendors.length}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              setActiveTab('levantamentos');
              setIsMobileMenuOpen(false);
            }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold transition ${
              activeTab === 'levantamentos' ? 'bg-[#5DD62C] text-[#0F0F0F] font-bold shadow-xs' : 'text-gray-300 hover:bg-[#202020] hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Wallet className="w-4 h-4" />
              <span>Levantamentos</span>
            </div>
            {pendingWithdrawals.length > 0 && (
              <span className="text-[10px] bg-amber-400 text-[#0F0F0F] px-1.5 py-0.5 rounded font-bold">
                {pendingWithdrawals.length}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              setActiveTab('comissao');
              setIsMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-semibold transition ${
              activeTab === 'comissao' ? 'bg-[#5DD62C] text-[#0F0F0F] font-bold shadow-xs' : 'text-gray-300 hover:bg-[#202020] hover:text-white'
            }`}
          >
            <Percent className="w-4 h-4" />
            <span>Taxa de Comissão</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('banners');
              setIsMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-semibold transition ${
              activeTab === 'banners' ? 'bg-[#5DD62C] text-[#0F0F0F] font-bold shadow-xs' : 'text-gray-300 hover:bg-[#202020] hover:text-white'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Banners da Home</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('logo');
              setIsMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-semibold transition ${
              activeTab === 'logo' ? 'bg-[#5DD62C] text-[#0F0F0F] font-bold shadow-xs' : 'text-gray-300 hover:bg-[#202020] hover:text-white'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Logótipo Oficial</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('auditoria');
              setIsMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-semibold transition ${
              activeTab === 'auditoria' ? 'bg-[#5DD62C] text-[#0F0F0F] font-bold shadow-xs' : 'text-gray-300 hover:bg-[#202020] hover:text-white'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Log de Auditoria</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('admins');
              setIsMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-semibold transition ${
              activeTab === 'admins' ? 'bg-[#5DD62C] text-[#0F0F0F] font-bold shadow-xs' : 'text-gray-300 hover:bg-[#202020] hover:text-white'
            }`}
          >
            <Key className="w-4 h-4" />
            <span>Admins Secundários</span>
          </button>
        </nav>

        {/* Exit admin button */}
        <div className="pt-6 mt-6 border-t border-gray-800 space-y-2 text-xs">
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center justify-center gap-2 bg-[#202020] hover:bg-gray-800 text-white py-2.5 px-3 rounded-xl transition"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#5DD62C]" />
            Ir ao Marketplace
          </button>
          <button
            onClick={() => switchUserRole('CUSTOMER')}
            className="w-full flex items-center justify-center gap-2 text-gray-400 hover:text-white py-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sair da Sessão Admin
          </button>
        </div>
      </aside>

      {/* Main Admin Screen */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl overflow-x-hidden space-y-6">
        {/* Universal Top Header: Olá Chefe, Painel Mestre */}
        <header className="bg-white border border-gray-200 rounded-3xl p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="hidden md:flex p-2.5 bg-[#F8F8F8] hover:bg-gray-200 border border-gray-300 rounded-2xl text-[#0F0F0F] hover:text-[#337418] transition cursor-pointer"
              title="Alternar Menu (☰)"
              aria-label="Alternar Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-[#5DD62C] text-[#0F0F0F] text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  {currentUser?.adminLevel === 'CEO' ? 'ADMINISTRADOR DELEGADO (CEO)' : 'SUPER ADMIN'}
                </span>
                {isOnline ? (
                  <span className="text-[11px] font-mono text-[#337418] font-bold flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#5DD62C] animate-pulse"></span>
                    Sincronização em Tempo Real Ativa
                  </span>
                ) : (
                  <span className="text-[11px] font-mono text-amber-600 font-bold flex items-center gap-1 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                    <WifiOff className="w-3 h-3 text-amber-600" />
                    Modo Offline Seguro · Cache Local Ativo
                  </span>
                )}
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-[#0F0F0F] tracking-tight">
                Olá Chefe, Painel Mestre
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">
                Sessão autenticada: almayurnurgi563@gmail.com · Gestão total da plataforma ALMAS-SHOP Moçambique
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => {
                playSaleChime();
                setFlashBanner({ message: '🔔 Notificação sonora de venda reproduzida com sucesso!', type: 'info' });
              }}
              className="flex items-center gap-1.5 text-xs bg-emerald-50 hover:bg-emerald-100 text-[#337418] font-bold px-3.5 py-2 rounded-full border border-emerald-200 shadow-xs transition cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#5DD62C]" />
              Testar Som de Venda
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex items-center gap-1.5 text-xs bg-[#F8F8F8] hover:bg-gray-200 text-[#0F0F0F] font-bold px-3.5 py-2 rounded-full border border-gray-300 shadow-xs transition cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#337418]" />
              Ver Loja
            </button>
            <button
              type="button"
              onClick={() => setShowResetConfirmModal(true)}
              className="flex items-center gap-1.5 text-xs bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold px-3.5 py-2 rounded-full border border-rose-200 shadow-xs transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Zerar Dados
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-3.5 py-2 rounded-full border border-gray-300 shadow-xs transition cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sair do Painel
            </button>
          </div>
        </header>

        {/* Tab 1: Visão Geral & KPIs */}
        {activeTab === 'visao-geral' && (
          <div className="space-y-6">
            <div className="bg-[#0F0F0F] text-white border border-[#202020] rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-[#5DD62C] text-[#0F0F0F] text-[10px] font-black px-2.5 py-0.5 rounded-full">
                    SISTEMA MESTRE
                  </span>
                  <span className="text-emerald-400 text-xs font-mono flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#5DD62C] animate-pulse"></span>
                    Sincronização em Tempo Real
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-white">
                  Olá Chefe, Painel Mestre
                </h1>
                <p className="text-xs text-gray-400 mt-1">
                  Visão em tempo real de vendas, pedidos e controle geral — ALMAS-SHOP EASY SOLUTION.
                </p>
              </div>
              <button
                onClick={() => setShowResetConfirmModal(true)}
                className="flex items-center gap-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 px-3.5 py-2 rounded-full text-xs font-bold transition cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Zerar Dados para Produção
              </button>
            </div>

            {/* Global KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-white border border-gray-200 rounded-3xl p-5 shadow-xs">
                <span className="text-xs text-gray-500 font-semibold block mb-1">Volume Total (GMV)</span>
                <p className="text-xl sm:text-2xl font-black text-[#0F0F0F] tracking-tight">
                  {totalGmv.toLocaleString()} MT
                </p>
                <span className="text-[10px] text-[#337418] font-bold">Vendas totais</span>
              </div>

              <div className="bg-white border border-gray-200 rounded-3xl p-5 shadow-xs">
                <span className="text-xs text-gray-500 font-semibold block mb-1">Comissões da Plataforma</span>
                <p className="text-xl sm:text-2xl font-black text-[#337418] tracking-tight">
                  {Math.round(totalCommissionEarned).toLocaleString()} MT
                </p>
                <span className="text-[10px] text-gray-500">
                  Taxa ativa: {settings.commissionRate || 5}%
                </span>
              </div>

              <div className="bg-white border border-gray-200 rounded-3xl p-5 shadow-xs">
                <span className="text-xs text-gray-500 font-semibold block mb-1">Pedidos Totais</span>
                <p className="text-xl sm:text-2xl font-black text-[#0F0F0F] tracking-tight">{orders.length}</p>
                <span className="text-[10px] text-gray-500">Maputo, Matola e províncias</span>
              </div>

              <div className="bg-white border border-gray-200 rounded-3xl p-5 shadow-xs">
                <span className="text-xs text-gray-500 font-semibold block mb-1">Usuários Registados</span>
                <p className="text-xl sm:text-2xl font-black text-[#0F0F0F] tracking-tight">{users.length}</p>
                <span className="text-[10px] text-gray-500">Controle total de acessos</span>
              </div>
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div
                onClick={() => setActiveTab('pedidos')}
                className="bg-white border border-gray-200 hover:border-[#5DD62C] p-5 rounded-3xl cursor-pointer transition shadow-xs group"
              >
                <h3 className="font-bold text-sm text-[#0F0F0F] flex items-center justify-between">
                  <span>Gestão de Pedidos</span>
                  <span className="bg-[#5DD62C] text-[#0F0F0F] text-xs font-black px-2 py-0.5 rounded-full">
                    {orders.length}
                  </span>
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Adicione, edite ou apague pedidos com sincronização direta.
                </p>
              </div>

              <div
                onClick={() => setActiveTab('produtos')}
                className="bg-white border border-gray-200 hover:border-[#5DD62C] p-5 rounded-3xl cursor-pointer transition shadow-xs group"
              >
                <h3 className="font-bold text-sm text-[#0F0F0F] flex items-center justify-between">
                  <span>Moderação de Produtos</span>
                  <span className="bg-[#5DD62C] text-[#0F0F0F] text-xs font-black px-2 py-0.5 rounded-full">
                    {products.length}
                  </span>
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Bloquear, desbloquear ou remover produtos de qualquer loja.
                </p>
              </div>

              <div
                onClick={() => setActiveTab('vendedores')}
                className="bg-white border border-gray-200 hover:border-[#5DD62C] p-5 rounded-3xl cursor-pointer transition shadow-xs group"
              >
                <h3 className="font-bold text-sm text-[#0F0F0F] flex items-center justify-between">
                  <span>Aprovar Vendedores</span>
                  <span className="bg-[#5DD62C] text-[#0F0F0F] text-xs font-black px-2 py-0.5 rounded-full">
                    {pendingVendors.length}
                  </span>
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Vendedores aguardando autorização para publicar no catálogo.
                </p>
              </div>

              <div
                onClick={() => setActiveTab('banners')}
                className="bg-white border border-gray-200 hover:border-[#5DD62C] p-5 rounded-3xl cursor-pointer transition shadow-xs group"
              >
                <h3 className="font-bold text-sm text-[#0F0F0F] flex items-center justify-between">
                  <span>Banners da Home</span>
                  <ImageIcon className="w-4 h-4 text-[#337418]" />
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Troque fotos e chamadas do carrossel da Home via galeria do aparelho.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Gestão de Pedidos (Add, Edit, Delete, Zero) */}
        {activeTab === 'pedidos' && (
          <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-2 border-b border-gray-100">
              <div>
                <h2 className="text-base font-bold text-[#0F0F0F] flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-[#337418]" />
                  Gestão Direta de Pedidos ({filteredOrders.length})
                </h2>
                <p className="text-xs text-gray-500">
                  O Admin pode adicionar pedidos manuais, editar informações, atualizar status e apagar pedidos.
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => setIsAddOrderModalOpen(true)}
                  className="bg-[#5DD62C] hover:bg-[#337418] text-[#0F0F0F] hover:text-white font-extrabold text-xs py-2 px-3.5 rounded-full transition flex items-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Novo Pedido
                </button>
                <button
                  onClick={() => setShowResetConfirmModal(true)}
                  className="bg-gray-100 hover:bg-rose-50 text-gray-700 hover:text-rose-700 border border-gray-200 text-xs py-2 px-3 rounded-full transition font-semibold flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Zerar Testes
                </button>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Pesquisar pedido por cliente, telefone ou ID..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="w-full bg-[#F8F8F8] border border-gray-200 text-xs text-[#0F0F0F] rounded-full py-2 pl-9 pr-3 focus:outline-hidden focus:border-[#5DD62C]"
                />
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>

              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="bg-[#F8F8F8] border border-gray-200 rounded-full px-3 py-2 text-xs text-gray-700 font-semibold focus:outline-hidden"
              >
                <option value="ALL">Todos os Estados</option>
                <option value="PENDING">PENDING</option>
                <option value="CONFIRMED">CONFIRMED</option>
                <option value="SHIPPED">SHIPPED</option>
                <option value="DELIVERED">DELIVERED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>

            {/* Orders Table */}
            {filteredOrders.length === 0 ? (
              <div className="py-12 text-center text-xs text-gray-500 space-y-2">
                <Package className="w-8 h-8 text-gray-300 mx-auto" />
                <p className="font-semibold text-gray-600">Nenhum pedido encontrado no momento.</p>
                <p className="text-[11px]">A base de dados começa limpa em produção. Novos pedidos aparecerão aqui instantaneamente.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-gray-700">
                  <thead className="bg-[#F8F8F8] text-gray-500 uppercase text-[10px]">
                    <tr>
                      <th className="p-3 rounded-l-xl">Nº Pedido</th>
                      <th className="p-3">Cliente</th>
                      <th className="p-3">Telefone</th>
                      <th className="p-3">Destino</th>
                      <th className="p-3">Valor</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 rounded-r-xl text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredOrders.map((o) => (
                      <tr key={o.id} className="hover:bg-gray-50 transition">
                        <td className="p-3 font-mono font-bold text-[#0F0F0F]">{o.id}</td>
                        <td className="p-3 font-semibold text-[#0F0F0F]">
                          {o.shippingAddress?.fullName || o.customerName || 'Cliente'}
                        </td>
                        <td className="p-3 font-mono text-gray-600">
                          {o.shippingAddress?.phone || o.customerPhone}
                        </td>
                        <td className="p-3 text-[11px]">
                          {o.shippingAddress?.neighborhood}, {o.shippingAddress?.city}
                        </td>
                        <td className="p-3 font-black text-[#0F0F0F]">
                          {o.totalAmount.toLocaleString()} MT
                        </td>
                        <td className="p-3">
                          <select
                            value={o.status}
                            onChange={(e) => updateOrderStatus(o.id, e.target.value as Order['status'])}
                            className={`text-[10px] font-extrabold rounded-full px-2 py-0.5 border cursor-pointer ${
                              o.status === 'DELIVERED'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                : o.status === 'SHIPPED'
                                ? 'bg-sky-50 text-sky-800 border-sky-300'
                                : o.status === 'CANCELLED'
                                ? 'bg-red-50 text-red-800 border-red-300'
                                : 'bg-amber-50 text-amber-800 border-amber-300'
                            }`}
                          >
                            <option value="PENDING">PENDING</option>
                            <option value="CONFIRMED">CONFIRMED</option>
                            <option value="SHIPPED">SHIPPED</option>
                            <option value="DELIVERED">DELIVERED</option>
                            <option value="CANCELLED">CANCELLED</option>
                          </select>
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => openEditOrderModal(o)}
                              title="Editar Pedido"
                              className="p-1.5 rounded-full hover:bg-gray-200 text-gray-600 hover:text-[#0F0F0F] transition"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Tem certeza que deseja apagar o pedido #${o.id}?`)) {
                                  deleteOrder(o.id);
                                }
                              }}
                              title="Apagar Pedido"
                              className="p-1.5 rounded-full hover:bg-red-100 text-red-600 transition"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Moderação e Catálogo de Produtos */}
        {activeTab === 'produtos' && (
          <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-black text-[#0F0F0F] flex items-center gap-2">
                  <Package className="w-5 h-5 text-[#337418]" />
                  Moderação de Produtos & Catálogo ({filteredProducts.length})
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Remover produtos de qualquer loja, bloquear produtos irregulares e auditar preços. Produtos bloqueados pelo Admin Mestre têm status protegido e não voltam a ficar aprovados sozinhos.
                </p>
              </div>

              {/* Status Filters */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => setProductStatusFilter('ALL')}
                  className={`text-xs px-3 py-1.5 rounded-full font-bold transition cursor-pointer ${
                    productStatusFilter === 'ALL'
                      ? 'bg-[#0F0F0F] text-white shadow-xs'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Todos ({products.length})
                </button>
                <button
                  type="button"
                  onClick={() => setProductStatusFilter('ACTIVE')}
                  className={`text-xs px-3 py-1.5 rounded-full font-bold transition cursor-pointer ${
                    productStatusFilter === 'ACTIVE'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                  }`}
                >
                  Ativos ({products.filter((p) => p.status === 'ACTIVE' || (!p.status && p.stock > 0)).length})
                </button>
                <button
                  type="button"
                  onClick={() => setProductStatusFilter('REJECTED')}
                  className={`text-xs px-3 py-1.5 rounded-full font-bold transition cursor-pointer ${
                    productStatusFilter === 'REJECTED'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'bg-rose-50 text-rose-800 hover:bg-rose-100'
                  }`}
                >
                  Bloqueados ({products.filter((p) => p.status === 'REJECTED').length})
                </button>
                <button
                  type="button"
                  onClick={() => setProductStatusFilter('OUT_OF_STOCK')}
                  className={`text-xs px-3 py-1.5 rounded-full font-bold transition cursor-pointer ${
                    productStatusFilter === 'OUT_OF_STOCK'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                  }`}
                >
                  Sem Estoque ({products.filter((p) => p.stock === 0).length})
                </button>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar produto por nome, SKU, loja ou categoria..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="w-full bg-[#F8F8F8] border border-gray-200 focus:border-[#5DD62C] text-sm rounded-2xl py-3 pl-10 pr-4 focus:outline-hidden"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>

            {/* Products Table */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-gray-200 rounded-3xl bg-gray-50/50">
                <Package className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="text-sm font-bold text-gray-600">Nenhum produto encontrado</p>
                <p className="text-xs text-gray-400 mt-1">
                  Tente alterar os termos da busca ou o filtro de status selecionado.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-gray-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0F0F0F] text-white">
                    <tr>
                      <th className="p-3.5">Produto</th>
                      <th className="p-3.5">Loja & Vendedor</th>
                      <th className="p-3.5">Preço Normal / Promo</th>
                      <th className="p-3.5">Estoque</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Ações do Admin</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {filteredProducts.map((prod) => {
                      const isRejected = prod.status === 'REJECTED';
                      return (
                        <tr key={prod.id} className="hover:bg-gray-50 transition">
                          <td className="p-3.5">
                            <div className="flex items-center gap-3">
                              <img
                                src={prod.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&auto=format&fit=crop'}
                                alt={prod.name}
                                className="w-12 h-12 rounded-xl object-cover border border-gray-200"
                              />
                              <div>
                                <p className="font-bold text-[#0F0F0F] line-clamp-1">{prod.name}</p>
                                <div className="flex items-center gap-2 mt-0.5 text-[11px] text-gray-500">
                                  <span className="font-mono">SKU: {prod.sku || 'N/A'}</span>
                                  <span>·</span>
                                  <span>{prod.category}</span>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="p-3.5 font-medium text-gray-700">
                            <span className="font-bold text-[#0F0F0F] block">{prod.storeName || 'Loja Parceira'}</span>
                            <span className="text-[10px] text-gray-500 font-mono">ID: {prod.storeId}</span>
                          </td>
                          <td className="p-3.5 font-mono">
                            <div className="font-bold text-[#0F0F0F]">{prod.salePrice.toLocaleString()} MT</div>
                            {prod.regularPrice > prod.salePrice && (
                              <div className="text-[10px] text-gray-400 line-through">
                                {prod.regularPrice.toLocaleString()} MT
                              </div>
                            )}
                          </td>
                          <td className="p-3.5">
                            <span
                              className={`font-mono font-bold px-2 py-0.5 rounded-full text-[11px] ${
                                prod.stock === 0
                                  ? 'bg-rose-100 text-rose-700'
                                  : prod.stock <= 5
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {prod.stock} un.
                            </span>
                          </td>
                          <td className="p-3.5">
                            {isRejected ? (
                              <span className="inline-flex items-center gap-1 bg-rose-100 text-rose-800 border border-rose-300 font-bold px-2.5 py-1 rounded-full text-[10px]">
                                <ShieldAlert className="w-3 h-3 text-rose-600" />
                                Bloqueado pelo Admin
                              </span>
                            ) : prod.stock === 0 ? (
                              <span className="inline-block bg-amber-100 text-amber-800 font-bold px-2.5 py-0.5 rounded-full text-[10px]">
                                Esgotado
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full text-[10px]">
                                <CheckCircle className="w-3 h-3 text-[#337418]" />
                                Aprovado / Ativo
                              </span>
                            )}
                          </td>
                          <td className="p-3.5 text-right">
                            <div className="flex items-center justify-end gap-1.5 flex-wrap">
                              {isRejected ? (
                                <button
                                  type="button"
                                  onClick={() => adminModerateProduct(prod.id, 'ACTIVE')}
                                  className="text-[11px] bg-emerald-50 hover:bg-emerald-100 text-[#337418] font-bold py-1 px-3 rounded-full border border-emerald-200 transition cursor-pointer"
                                >
                                  Desbloquear
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setProductModerationModal({ product: prod, action: 'REJECT' });
                                    setProductModerationReason('');
                                  }}
                                  className="text-[11px] bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold py-1 px-3 rounded-full border border-amber-200 transition cursor-pointer"
                                >
                                  Bloquear
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => {
                                  if (window.confirm(`Tem a certeza que deseja remover o produto "${prod.name}" de forma definitiva de todo o marketplace?`)) {
                                    deleteProduct(prod.id, 'Remoção direta pelo Chefe no Painel Mestre');
                                  }
                                }}
                                className="text-[11px] bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold py-1 px-2.5 rounded-full border border-rose-200 transition cursor-pointer flex items-center gap-1"
                                title="Remover Produto"
                              >
                                <Trash2 className="w-3 h-3" />
                                Apagar
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Usuários e Banimentos */}
        {activeTab === 'usuarios' && (
          <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-[#0F0F0F] flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#337418]" />
                  Gestão de Usuários & Banimentos ({filteredUsers.length})
                </h2>
                <p className="text-xs text-gray-500">
                  Suspenda ou reative contas com registro obrigatório de motivo e data no log de auditoria.
                </p>
              </div>

              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Pesquisar utilizador..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full bg-[#F8F8F8] border border-gray-200 text-xs text-[#0F0F0F] rounded-full py-2 pl-8 pr-3 focus:outline-hidden focus:border-[#5DD62C]"
                />
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-700">
                <thead className="bg-[#F8F8F8] text-gray-500 uppercase text-[10px]">
                  <tr>
                    <th className="p-3 rounded-l-xl">Nome</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Telefone</th>
                    <th className="p-3">Cargo</th>
                    <th className="p-3">Estado</th>
                    <th className="p-3 rounded-r-xl text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50 transition">
                      <td className="p-3 font-semibold text-[#0F0F0F]">{u.name}</td>
                      <td className="p-3 font-mono text-gray-600">{u.email}</td>
                      <td className="p-3 font-mono text-gray-600">{u.phone}</td>
                      <td className="p-3">
                        <span className="font-bold text-[10px] bg-gray-100 px-2 py-0.5 rounded-full">
                          {u.role}
                        </span>
                      </td>
                      <td className="p-3">
                        {u.isBanned ? (
                          <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            BANIDO
                          </span>
                        ) : (
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            ATIVO
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-right">
                        {u.role !== 'SUPER_ADMIN' && (
                          u.isBanned ? (
                            <button
                              onClick={() => handleUnban(u)}
                              className="text-xs bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold px-3 py-1 rounded-full transition inline-flex items-center gap-1"
                            >
                              <UserCheck className="w-3.5 h-3.5" />
                              Desbanir
                            </button>
                          ) : (
                            <button
                              onClick={() => setBanModalUser(u)}
                              className="text-xs bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold px-3 py-1 rounded-full transition inline-flex items-center gap-1"
                            >
                              <UserX className="w-3.5 h-3.5" />
                              Banir
                            </button>
                          )
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: Aprovação de Vendedores */}
        {activeTab === 'vendedores' && (
          <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-[#0F0F0F] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#337418]" />
              Aprovação de Vendedores ({pendingVendors.length} pendentes)
            </h2>
            <p className="text-xs text-gray-500">
              Novos vendedores que criam conta como loja aguardam autorização prévia para manter a conformidade do catálogo.
            </p>

            {pendingVendors.length === 0 ? (
              <div className="p-8 text-center text-xs text-gray-500">
                Nenhum vendedor aguardando aprovação no momento.
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {pendingVendors.map((v) => (
                  <div key={v.id} className="py-3 flex items-center justify-between gap-4">
                    <div>
                      <p className="font-bold text-xs text-[#0F0F0F]">{v.name}</p>
                      <p className="text-[11px] text-gray-500 font-mono">{v.email} · {v.phone}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => approveVendorApplication(v.id)}
                        className="bg-[#5DD62C] hover:bg-[#337418] text-[#0F0F0F] hover:text-white font-bold text-xs px-3 py-1.5 rounded-full transition"
                      >
                        Aprovar
                      </button>
                      <button
                        onClick={() => rejectVendorApplication(v.id)}
                        className="bg-gray-100 hover:bg-red-50 text-gray-700 hover:text-red-700 font-semibold text-xs px-3 py-1.5 rounded-full transition"
                      >
                        Recusar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 5: Levantamentos */}
        {activeTab === 'levantamentos' && (
          <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-[#0F0F0F] flex items-center gap-2">
              <Wallet className="w-5 h-5 text-[#337418]" />
              Gestão de Levantamentos (M-Pesa / e-Mola / Bancário)
            </h2>
            <p className="text-xs text-gray-500">
              Pedidos de transferência dos vendedores parceiros para levantamento dos seus saldos líquidos.
            </p>

            {allWithdrawals.length === 0 ? (
              <div className="p-8 text-center text-xs text-gray-500">
                Nenhuma solicitação de levantamento registrada.
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {allWithdrawals.map((w) => (
                  <div key={w.id} className="py-3 flex items-center justify-between gap-4">
                    <div>
                      <p className="font-bold text-xs text-[#0F0F0F]">{w.storeName} — {w.amount.toLocaleString()} MT</p>
                      <p className="text-[11px] text-gray-500">
                        Método: {w.method} · Conta: {w.accountDetails?.accountNumber || w.accountDetails?.phoneNumber} ({w.accountDetails?.holderName})
                      </p>
                    </div>
                    <div>
                      {w.status === 'PENDING' ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleWithdrawalAction(w.id, 'PAID')}
                            className="bg-[#5DD62C] hover:bg-[#337418] text-[#0F0F0F] hover:text-white font-bold text-xs px-3 py-1.5 rounded-full transition"
                          >
                            Confirmar Pagamento
                          </button>
                          <button
                            onClick={() => handleWithdrawalAction(w.id, 'REJECTED')}
                            className="bg-gray-100 hover:bg-red-50 text-gray-700 hover:text-red-700 font-semibold text-xs px-3 py-1.5 rounded-full transition"
                          >
                            Rejeitar
                          </button>
                        </div>
                      ) : (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${w.status === 'PAID' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                          {w.status}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 6: Taxa de Comissão */}
        {activeTab === 'comissao' && (
          <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-xs space-y-4 max-w-lg">
            <h2 className="text-base font-bold text-[#0F0F0F] flex items-center gap-2">
              <Percent className="w-5 h-5 text-[#337418]" />
              Definição da Taxa de Comissão da Plataforma
            </h2>
            <p className="text-xs text-gray-500">
              Taxa percentual descontada sobre cada venda confirmada de qualquer vendedor parceiro (padrão oficial: 5%).
            </p>

            <form onSubmit={handleSaveCommission} className="space-y-4 pt-2">
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  Taxa Global (%)
                </label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  step="0.5"
                  required
                  value={newCommissionRate}
                  onChange={(e) => setNewCommissionRate(Number(e.target.value))}
                  className="w-full bg-[#F8F8F8] border border-gray-300 focus:border-[#5DD62C] text-lg font-black text-[#0F0F0F] rounded-full p-3 pl-4 focus:outline-hidden"
                />
              </div>

              <button
                type="submit"
                className="bg-[#5DD62C] hover:bg-[#337418] text-[#0F0F0F] hover:text-white font-black text-xs py-3 px-6 rounded-full shadow-xs transition"
              >
                Atualizar Comissão Global
              </button>
            </form>
          </div>
        )}

        {/* Tab 7: Banners da Home (Exclusivo Admin via Galeria) */}
        {activeTab === 'banners' && (
          <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <div>
                <h2 className="text-base font-bold text-[#0F0F0F] flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-[#337418]" />
                  Banners do Carrossel da Home
                </h2>
                <p className="text-xs text-gray-500">
                  Somente o Painel Mestre tem autorização para trocar as fotos desse banner. Upload direto pela galeria do dispositivo.
                </p>
              </div>
            </div>

            {/* List of active banners */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentBanners.map((b, idx) => (
                <div key={b.id || idx} className="border border-gray-200 rounded-2xl overflow-hidden bg-[#F8F8F8] flex flex-col">
                  <div className="relative h-32 bg-gray-200">
                    <img src={b.imageUrl} alt={b.title} className="w-full h-full object-cover" />
                    <span className="absolute top-2 left-2 bg-[#5DD62C] text-[#0F0F0F] text-[10px] font-black px-2 py-0.5 rounded-full">
                      {b.badgeText || 'SLIDE'}
                    </span>
                  </div>
                  <div className="p-3 flex-1 flex flex-col justify-between">
                    <div>
                      <p className="font-bold text-xs text-[#0F0F0F]">{b.title}</p>
                      <p className="text-[11px] text-gray-500">{b.subtitle}</p>
                      <p className="text-[10px] text-gray-400 mt-1">Botão: {b.ctaText} → {b.ctaLink}</p>
                    </div>
                    <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-200 mt-2">
                      <button
                        onClick={() => {
                          setEditingBannerIndex(idx);
                          setNewBannerTitle(b.title);
                          setNewBannerSubtitle(b.subtitle);
                          setNewBannerBadge(b.badgeText || 'DESTAQUE');
                          setNewBannerCtaText(b.ctaText);
                          setNewBannerCtaLink(b.ctaLink || b.link || '/produtos');
                          setNewBannerImage(b.imageUrl);
                        }}
                        className="text-xs text-gray-700 hover:text-[#0F0F0F] font-semibold py-1 px-3 bg-white rounded-full border border-gray-200"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteBanner(idx)}
                        className="text-xs text-red-600 hover:text-red-800 font-semibold py-1 px-3 bg-red-50 rounded-full border border-red-200"
                      >
                        Apagar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add or Edit Banner Form */}
            <form onSubmit={handleAddOrUpdateBanner} className="p-5 bg-[#F8F8F8] border border-gray-200 rounded-3xl space-y-4">
              <h3 className="font-bold text-xs uppercase tracking-wider text-[#0F0F0F]">
                {editingBannerIndex !== null ? 'Editar Banner Selecionado' : 'Adicionar Novo Banner ao Carrossel'}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-gray-700 block mb-1">Título Principal</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Liquidação de Tecnologia"
                    value={newBannerTitle}
                    onChange={(e) => setNewBannerTitle(e.target.value)}
                    className="w-full bg-white border border-gray-200 text-xs text-[#0F0F0F] rounded-full py-2 px-3 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-700 block mb-1">Subtítulo</label>
                  <input
                    type="text"
                    placeholder="Ex: Smartphones até 40% OFF com entrega grátis"
                    value={newBannerSubtitle}
                    onChange={(e) => setNewBannerSubtitle(e.target.value)}
                    className="w-full bg-white border border-gray-200 text-xs text-[#0F0F0F] rounded-full py-2 px-3 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-700 block mb-1">Selo / Tag</label>
                  <input
                    type="text"
                    placeholder="Ex: PROMOÇÃO EXCLUSIVA"
                    value={newBannerBadge}
                    onChange={(e) => setNewBannerBadge(e.target.value)}
                    className="w-full bg-white border border-gray-200 text-xs text-[#0F0F0F] rounded-full py-2 px-3 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-700 block mb-1">Texto do Botão (CTA)</label>
                  <input
                    type="text"
                    placeholder="Ex: Comprar Agora"
                    value={newBannerCtaText}
                    onChange={(e) => setNewBannerCtaText(e.target.value)}
                    className="w-full bg-white border border-gray-200 text-xs text-[#0F0F0F] rounded-full py-2 px-3 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Upload Foto da Galeria */}
              <div>
                <label className="text-[11px] font-bold text-gray-700 block mb-1">
                  Foto do Banner (Upload via Galeria do Dispositivo)
                </label>
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer flex items-center gap-2 bg-white hover:bg-gray-50 text-[#0F0F0F] px-4 py-2 rounded-full text-xs font-bold border border-gray-300 transition shadow-xs">
                    <Upload className="w-3.5 h-3.5 text-[#337418]" />
                    <span>Escolher da Galeria</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleBannerFileUpload}
                      className="hidden"
                    />
                  </label>
                  {newBannerImage && (
                    <img
                      src={newBannerImage}
                      alt="Banner Preview"
                      className="w-16 h-10 object-cover rounded-lg border border-gray-300"
                    />
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  className="bg-[#5DD62C] hover:bg-[#337418] text-[#0F0F0F] hover:text-white font-extrabold text-xs py-2.5 px-6 rounded-full transition shadow-xs"
                >
                  {editingBannerIndex !== null ? 'Salvar Alterações' : 'Salvar no Carrossel'}
                </button>
                {editingBannerIndex !== null && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingBannerIndex(null);
                      setNewBannerTitle('');
                      setNewBannerSubtitle('');
                      setNewBannerImage('');
                    }}
                    className="text-xs text-gray-500 hover:text-gray-800"
                  >
                    Cancelar Edição
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        {/* Tab 8: Trocar Logótipo Oficial da Plataforma (Via Galeria) */}
        {activeTab === 'logo' && (
          <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-xs space-y-4 max-w-lg">
            <h2 className="text-base font-bold text-[#0F0F0F] flex items-center gap-2">
              <Upload className="w-5 h-5 text-[#337418]" />
              Troca do Logótipo Oficial ALMAS-SHOP
            </h2>
            <p className="text-xs text-gray-500">
              O logótipo configurado reflete instantaneamente em toda a plataforma. O upload é feito diretamente pela galeria de fotos do aparelho.
            </p>

            <div className="flex items-center gap-4 p-4 bg-[#F8F8F8] border border-gray-200 rounded-2xl">
              <img
                src={newLogoUrl}
                alt="Prévia da Logo"
                className="w-16 h-16 rounded-2xl object-contain border border-gray-300 p-1 bg-white"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/logo.svg';
                }}
              />
              <div className="text-xs text-gray-700">
                <p className="font-bold text-[#0F0F0F]">Logótipo Ativo</p>
                <p className="text-[11px] text-gray-500">Recomendado: imagem quadrada PNG/SVG</p>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-2">
                  Carregar Novo Logótipo (Galeria de Fotos)
                </label>
                <label className="cursor-pointer inline-flex items-center gap-2 bg-[#5DD62C] hover:bg-[#337418] text-[#0F0F0F] hover:text-white font-extrabold px-5 py-2.5 rounded-full text-xs transition shadow-xs">
                  <Upload className="w-4 h-4" />
                  <span>Escolher Imagem do Dispositivo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => {
                    setNewLogoUrl('/logo.svg');
                    updateSettings({ platformLogo: '/logo.svg' });
                    setFlashBanner({ message: 'Logótipo padrão restaurado!', type: 'info' });
                  }}
                  className="text-xs text-gray-600 hover:text-[#0F0F0F] py-2 px-3 bg-gray-100 rounded-full"
                >
                  Restaurar Padrão (/logo.svg)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 9: Log de Auditoria */}
        {activeTab === 'auditoria' && (
          <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-[#0F0F0F] flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#337418]" />
              Log de Auditoria em Tempo Real ({auditLogs.length})
            </h2>
            <p className="text-xs text-gray-500">
              Registro cronológico detalhado de quem realizou cada ação, quando e por qual motivo.
            </p>

            <div className="divide-y divide-gray-100 max-h-[550px] overflow-y-auto">
              {auditLogs.map((log) => (
                <div key={log.id} className="py-2.5 text-xs flex items-start justify-between gap-3">
                  <div>
                    <span className="font-bold text-[#0F0F0F]">{log.action}: </span>
                    <span className="text-gray-700">{log.details}</span>
                    {log.reason && (
                      <p className="text-[11px] text-rose-700 font-semibold mt-0.5">
                        Motivo registrado: {log.reason}
                      </p>
                    )}
                    <p className="text-[10px] text-gray-400 mt-0.5 font-mono">
                      Responsável: {log.authorEmail || log.actorEmail} ({log.actorRole})
                    </p>
                  </div>
                  <span className="text-[10px] text-gray-400 whitespace-nowrap font-mono">
                    {new Date(log.timestamp || log.createdAt).toLocaleString('pt-MZ')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 10: Admins Secundários / Nível CEO */}
        {activeTab === 'admins' && (
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-xs space-y-4">
              <div className="flex items-start justify-between flex-wrap gap-3">
                <div>
                  <h2 className="text-base font-bold text-[#0F0F0F] flex items-center gap-2">
                    <Key className="w-5 h-5 text-[#337418]" />
                    Criar Administrador Secundário / Nível "CEO"
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Permissão exclusiva do Super Admin: defina permissões manuais para administradores delegados ou equipa de operações.
                  </p>
                </div>
                <div className="bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-2xl text-[11px] text-amber-800 font-medium max-w-xs">
                  Sem auto-cadastro público: apenas administradores registados manualmente aqui têm acesso ao Painel Mestre.
                </div>
              </div>

              <form onSubmit={handleCreateSubAdmin} className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Nome Completo *</label>
                  <input
                    type="text"
                    required
                    value={newAdminName}
                    onChange={(e) => setNewAdminName(e.target.value)}
                    placeholder="Ex: Carlos Nhabanga"
                    className="w-full bg-[#F8F8F8] border border-gray-200 rounded-full py-2.5 px-4 text-xs focus:outline-hidden focus:border-[#5DD62C]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Email de Login *</label>
                  <input
                    type="email"
                    required
                    value={newAdminEmail}
                    onChange={(e) => setNewAdminEmail(e.target.value)}
                    placeholder="Ex: carlos.ceo@almas-shop.co.mz"
                    className="w-full bg-[#F8F8F8] border border-gray-200 rounded-full py-2.5 px-4 text-xs focus:outline-hidden focus:border-[#5DD62C]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Telemóvel (+258) *</label>
                  <input
                    type="tel"
                    required
                    value={newAdminPhone}
                    onChange={(e) => setNewAdminPhone(e.target.value)}
                    placeholder="84 123 4567"
                    className="w-full bg-[#F8F8F8] border border-gray-200 rounded-full py-2.5 px-4 text-xs focus:outline-hidden focus:border-[#5DD62C]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Palavra-passe de Acesso *</label>
                  <input
                    type="password"
                    required
                    value={newAdminPassword}
                    onChange={(e) => setNewAdminPassword(e.target.value)}
                    placeholder="Defina uma senha segura"
                    className="w-full bg-[#F8F8F8] border border-gray-200 rounded-full py-2.5 px-4 text-xs focus:outline-hidden focus:border-[#5DD62C]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Nível de Autoridade</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label
                      onClick={() => setNewAdminRole('CEO')}
                      className={`p-3 rounded-2xl border cursor-pointer transition flex items-start gap-3 ${
                        newAdminRole === 'CEO'
                          ? 'bg-[#5DD62C]/10 border-[#5DD62C] text-[#0F0F0F]'
                          : 'bg-[#F8F8F8] border-gray-200 text-gray-600'
                      }`}
                    >
                      <input
                        type="radio"
                        name="adminRole"
                        checked={newAdminRole === 'CEO'}
                        onChange={() => setNewAdminRole('CEO')}
                        className="mt-1"
                      />
                      <div>
                        <p className="font-bold text-xs text-[#0F0F0F]">CEO / Administrador Delegado</p>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          Acesso completo a todas as funções executivas, aprovações financeiras e operações do marketplace.
                        </p>
                      </div>
                    </label>

                    <label
                      onClick={() => setNewAdminRole('SUPPORT')}
                      className={`p-3 rounded-2xl border cursor-pointer transition flex items-start gap-3 ${
                        newAdminRole === 'SUPPORT'
                          ? 'bg-[#5DD62C]/10 border-[#5DD62C] text-[#0F0F0F]'
                          : 'bg-[#F8F8F8] border-gray-200 text-gray-600'
                      }`}
                    >
                      <input
                        type="radio"
                        name="adminRole"
                        checked={newAdminRole === 'SUPPORT'}
                        onChange={() => setNewAdminRole('SUPPORT')}
                        className="mt-1"
                      />
                      <div>
                        <p className="font-bold text-xs text-[#0F0F0F]">Suporte & Atendimento Operacional</p>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          Foco em gestão de pedidos, contacto com compradores e verificação básica de entregas.
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-gray-700 block mb-2">Permissões Específicas Concedidas</label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { key: 'PEDIDOS', label: 'Gestão de Pedidos' },
                      { key: 'PRODUTOS', label: 'Moderação de Produtos' },
                      { key: 'VENDEDORES', label: 'Aprovação de Lojas' },
                      { key: 'FINANCEIRO', label: 'Carteiras & Saques' },
                      { key: 'AUDITORIA', label: 'Visualizar Auditoria' }
                    ].map((perm) => {
                      const isChecked = newAdminPermissions.includes(perm.key);
                      return (
                        <button
                          key={perm.key}
                          type="button"
                          onClick={() => {
                            if (isChecked) {
                              setNewAdminPermissions(newAdminPermissions.filter((p) => p !== perm.key));
                            } else {
                              setNewAdminPermissions([...newAdminPermissions, perm.key]);
                            }
                          }}
                          className={`text-xs px-3 py-1.5 rounded-full border transition flex items-center gap-1.5 cursor-pointer ${
                            isChecked
                              ? 'bg-[#0F0F0F] text-white border-[#0F0F0F] font-bold'
                              : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
                          }`}
                        >
                          <CheckCircle className={`w-3.5 h-3.5 ${isChecked ? 'text-[#5DD62C]' : 'text-gray-400'}`} />
                          {perm.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="sm:col-span-2 pt-2">
                  <button
                    type="submit"
                    className="bg-[#5DD62C] hover:bg-[#337418] text-[#0F0F0F] hover:text-white font-black text-xs py-3 px-6 rounded-full transition shadow-xs flex items-center gap-2 cursor-pointer"
                  >
                    <UserPlus className="w-4 h-4" />
                    Criar e Autorizar Administrador
                  </button>
                </div>
              </form>
            </div>

            {/* List of existing Secondary Admins */}
            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-[#0F0F0F] flex items-center gap-2">
                <Users className="w-4 h-4 text-[#337418]" />
                Administradores Ativos na Plataforma ({users.filter((u) => u.role === 'ADMIN' || u.adminLevel === 'CEO' || u.role === 'SUPER_ADMIN').length})
              </h3>

              <div className="space-y-3">
                {/* Fixed Super Admin */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#0F0F0F] text-[#5DD62C] flex items-center justify-center font-black text-sm">
                      SA
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-xs text-[#0F0F0F]">Chefe Almayur Nurgi</p>
                        <span className="text-[10px] bg-[#5DD62C] text-[#0F0F0F] px-2 py-0.5 rounded-full font-black">
                          SUPER ADMIN FIXO
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 font-mono">almayurnurgi563@gmail.com · +258 84 345 6786</p>
                    </div>
                  </div>
                  <span className="text-[11px] text-[#337418] font-bold bg-[#5DD62C]/20 px-3 py-1 rounded-full">
                    Acesso Máximo Irrestrito
                  </span>
                </div>

                {/* Sub-admins / CEOs */}
                {users
                  .filter((u) => (u.role === 'ADMIN' || u.adminLevel === 'CEO') && u.email !== 'almayurnurgi563@gmail.com')
                  .map((subAdmin) => (
                    <div
                      key={subAdmin.id}
                      className="p-4 rounded-2xl bg-white border border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs hover:border-[#5DD62C] transition"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-800 flex items-center justify-center font-bold text-sm border border-gray-200">
                          {subAdmin.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-xs text-[#0F0F0F]">{subAdmin.name}</p>
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                                subAdmin.adminLevel === 'CEO'
                                  ? 'bg-[#0F0F0F] text-white'
                                  : 'bg-blue-100 text-blue-800'
                              }`}
                            >
                              {subAdmin.adminLevel === 'CEO' ? 'CEO / Delegado' : 'Suporte Operacional'}
                            </span>
                            {subAdmin.isBanned && (
                              <span className="text-[10px] bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full font-bold">
                                Suspenso
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-gray-500 font-mono">
                            {subAdmin.email} · {subAdmin.phone || 'Sem telefone'}
                          </p>
                          {subAdmin.permissions && subAdmin.permissions.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1.5">
                              {subAdmin.permissions.map((p) => (
                                <span key={p} className="text-[9px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-md font-mono">
                                  {p}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => updateUserBanStatus(subAdmin.id, !subAdmin.isBanned, 'Ação do Super Admin')}
                          className={`text-xs px-3 py-1.5 rounded-full font-bold transition cursor-pointer ${
                            subAdmin.isBanned
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                              : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                          }`}
                        >
                          {subAdmin.isBanned ? 'Reativar' : 'Suspender'}
                        </button>
                      </div>
                    </div>
                  ))}

                {users.filter((u) => (u.role === 'ADMIN' || u.adminLevel === 'CEO') && u.email !== 'almayurnurgi563@gmail.com').length === 0 && (
                  <p className="text-xs text-gray-500 italic py-2 text-center">
                    Nenhum administrador secundário criado até ao momento. Utilize o formulário acima para cadastrar novos delegados.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modal 1: Ban Confirmation Modal */}
      {banModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-gray-200 shadow-2xl space-y-4">
            <h3 className="font-bold text-base text-rose-700 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Bloquear Conta: {banModalUser.name}
            </h3>
            <p className="text-xs text-gray-600">
              O usuário perderá imediatamente acesso à plataforma. É obrigatório registrar o motivo para constar no Log de Auditoria.
            </p>

            <form onSubmit={handleConfirmBan} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  Motivo da Suspensão *
                </label>
                <textarea
                  required
                  rows={3}
                  value={banReason}
                  onChange={(e) => setBanReason(e.target.value)}
                  placeholder="Ex: Publicação de conteúdo fraudulento ou não cumprimento de entrega"
                  className="w-full bg-[#F8F8F8] border border-gray-300 rounded-2xl p-3 text-xs focus:outline-hidden focus:border-rose-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setBanModalUser(null)}
                  className="text-xs text-gray-600 hover:text-[#0F0F0F] py-2 px-4 rounded-full"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="text-xs bg-rose-600 hover:bg-rose-700 text-white font-bold py-2 px-5 rounded-full transition shadow-xs"
                >
                  Confirmar Bloqueio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Add Manual Order */}
      {isAddOrderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-gray-200 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="font-extrabold text-base text-[#0F0F0F] flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#337418]" />
                Lançar Novo Pedido Manual
              </h3>
              <button onClick={() => setIsAddOrderModalOpen(false)} className="text-gray-400 hover:text-gray-700">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddOrderSubmit} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-gray-700 block mb-1">Nome do Cliente *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Carlos Machel"
                  value={newOrderCustomerName}
                  onChange={(e) => setNewOrderCustomerName(e.target.value)}
                  className="w-full bg-[#F8F8F8] border border-gray-300 rounded-full py-2 px-3 text-xs focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-700 block mb-1">Contacto Telefónico</label>
                <input
                  type="text"
                  placeholder="84 345 6786"
                  value={newOrderCustomerPhone}
                  onChange={(e) => setNewOrderCustomerPhone(e.target.value)}
                  className="w-full bg-[#F8F8F8] border border-gray-300 rounded-full py-2 px-3 text-xs focus:outline-hidden font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-gray-700 block mb-1">Cidade</label>
                  <input
                    type="text"
                    value={newOrderCity}
                    onChange={(e) => setNewOrderCity(e.target.value)}
                    className="w-full bg-[#F8F8F8] border border-gray-300 rounded-full py-2 px-3 text-xs focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-700 block mb-1">Bairro</label>
                  <input
                    type="text"
                    value={newOrderNeighborhood}
                    onChange={(e) => setNewOrderNeighborhood(e.target.value)}
                    className="w-full bg-[#F8F8F8] border border-gray-300 rounded-full py-2 px-3 text-xs focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-700 block mb-1">Produto / Descrição</label>
                <input
                  type="text"
                  placeholder="Ex: Smartwatch Ultra Series"
                  value={newOrderProductName}
                  onChange={(e) => setNewOrderProductName(e.target.value)}
                  className="w-full bg-[#F8F8F8] border border-gray-300 rounded-full py-2 px-3 text-xs focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-gray-700 block mb-1">Valor Total (MT)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newOrderAmount}
                    onChange={(e) => setNewOrderAmount(Number(e.target.value))}
                    className="w-full bg-[#F8F8F8] border border-gray-300 rounded-full py-2 px-3 text-xs focus:outline-hidden font-bold"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-700 block mb-1">Estado</label>
                  <select
                    value={newOrderStatus}
                    onChange={(e) => setNewOrderStatus(e.target.value as Order['status'])}
                    className="w-full bg-[#F8F8F8] border border-gray-300 rounded-full py-2 px-3 text-xs focus:outline-hidden"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="CONFIRMED">CONFIRMED</option>
                    <option value="SHIPPED">SHIPPED</option>
                    <option value="DELIVERED">DELIVERED</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAddOrderModalOpen(false)}
                  className="text-xs text-gray-600 hover:text-[#0F0F0F] py-2 px-4 rounded-full"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-[#5DD62C] hover:bg-[#337418] text-[#0F0F0F] hover:text-white font-extrabold text-xs py-2.5 px-6 rounded-full transition shadow-xs"
                >
                  Criar Pedido
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: Edit Order Modal */}
      {editingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-gray-200 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="font-extrabold text-base text-[#0F0F0F] flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-[#337418]" />
                Editar Pedido #{editingOrder.id}
              </h3>
              <button onClick={() => setEditingOrder(null)} className="text-gray-400 hover:text-gray-700">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditOrderSubmit} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-gray-700 block mb-1">Nome do Cliente</label>
                <input
                  type="text"
                  required
                  value={editCustomerName}
                  onChange={(e) => setEditCustomerName(e.target.value)}
                  className="w-full bg-[#F8F8F8] border border-gray-300 rounded-full py-2 px-3 text-xs focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-700 block mb-1">Telefone</label>
                <input
                  type="text"
                  value={editCustomerPhone}
                  onChange={(e) => setEditCustomerPhone(e.target.value)}
                  className="w-full bg-[#F8F8F8] border border-gray-300 rounded-full py-2 px-3 text-xs focus:outline-hidden font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-gray-700 block mb-1">Cidade</label>
                  <input
                    type="text"
                    value={editCity}
                    onChange={(e) => setEditCity(e.target.value)}
                    className="w-full bg-[#F8F8F8] border border-gray-300 rounded-full py-2 px-3 text-xs focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-700 block mb-1">Bairro</label>
                  <input
                    type="text"
                    value={editNeighborhood}
                    onChange={(e) => setEditNeighborhood(e.target.value)}
                    className="w-full bg-[#F8F8F8] border border-gray-300 rounded-full py-2 px-3 text-xs focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-gray-700 block mb-1">Valor Total (MT)</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={editAmount}
                    onChange={(e) => setEditAmount(Number(e.target.value))}
                    className="w-full bg-[#F8F8F8] border border-gray-300 rounded-full py-2 px-3 text-xs focus:outline-hidden font-bold"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-700 block mb-1">Status</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as Order['status'])}
                    className="w-full bg-[#F8F8F8] border border-gray-300 rounded-full py-2 px-3 text-xs focus:outline-hidden font-semibold"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="CONFIRMED">CONFIRMED</option>
                    <option value="SHIPPED">SHIPPED</option>
                    <option value="DELIVERED">DELIVERED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditingOrder(null)}
                  className="text-xs text-gray-600 hover:text-[#0F0F0F] py-2 px-4 rounded-full"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-[#5DD62C] hover:bg-[#337418] text-[#0F0F0F] hover:text-white font-extrabold text-xs py-2.5 px-6 rounded-full transition shadow-xs"
                >
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 4: Reset Production Confirmation */}
      {showResetConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-gray-200 shadow-2xl space-y-4">
            <h3 className="font-extrabold text-base text-rose-700 flex items-center gap-2">
              <RotateCcw className="w-5 h-5" />
              Zerar Dados para Produção?
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Esta ação atende à diretriz do Painel Mestre: limpa todos os pedidos e cadastros de teste para que a operação real comece rigorosamente do zero.
            </p>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setShowResetConfirmModal(false)}
                className="text-xs text-gray-600 hover:text-[#0F0F0F] py-2 px-4 rounded-full"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  resetProductionData();
                  setShowResetConfirmModal(false);
                }}
                className="text-xs bg-rose-600 hover:bg-rose-700 text-white font-bold py-2.5 px-6 rounded-full transition shadow-xs cursor-pointer"
              >
                Sim, Zerar Dados Agora
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Moderation Modal */}
      {productModerationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-gray-200 shadow-2xl space-y-4">
            <h3 className="font-extrabold text-base text-[#0F0F0F] flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-600" />
              Bloquear Produto no Catálogo
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Você está prestes a bloquear o produto <strong className="text-[#0F0F0F]">"{productModerationModal.product.name}"</strong> da loja {productModerationModal.product.storeName}. Uma vez bloqueado pelo Admin Mestre, o vendedor <strong className="text-rose-600">não poderá reativá-lo sozinho</strong>.
            </p>

            <form onSubmit={handleConfirmProductModeration} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Motivo do Bloqueio *
                </label>
                <textarea
                  required
                  rows={3}
                  value={productModerationReason}
                  onChange={(e) => setProductModerationReason(e.target.value)}
                  placeholder="Ex.: Imagens inadequadas, preço fora do padrão, violação de termos de uso..."
                  className="w-full bg-[#F8F8F8] border border-gray-300 rounded-2xl p-3 text-xs focus:outline-hidden focus:border-rose-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setProductModerationModal(null)}
                  className="text-xs text-gray-600 hover:text-[#0F0F0F] py-2 px-4 rounded-full"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="text-xs bg-rose-600 hover:bg-rose-700 text-white font-bold py-2.5 px-6 rounded-full transition shadow-xs cursor-pointer"
                >
                  Confirmar Bloqueio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
