import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { TopBar } from './components/layout/TopBar';
import { Header } from './components/layout/Header';
import { BottomNav } from './components/layout/BottomNav';
import { PwaInstallBanner } from './components/common/PwaInstallBanner';
import { BannedAccountNotice } from './components/common/BannedAccountNotice';
import { AuthModal } from './components/common/AuthModal';

// Client Views
import { MarketplaceHome } from './components/client/MarketplaceHome';
import { ProductSalesPage } from './components/client/ProductSalesPage';
import { CartView } from './components/client/CartView';
import { CheckoutView } from './components/client/CheckoutView';
import { CustomerAccountView } from './components/client/CustomerAccountView';
import { StoreFrontView } from './components/client/StoreFrontView';

// Vendor Views
import { VendorLayout } from './components/vendor/VendorLayout';
import { VendorDashboard } from './components/vendor/VendorDashboard';
import { VendorProducts } from './components/vendor/VendorProducts';
import { VendorProductEditor } from './components/vendor/VendorProductEditor';
import { VendorOrders } from './components/vendor/VendorOrders';
import { VendorWallet } from './components/vendor/VendorWallet';
import { VendorStoreCustomizer } from './components/vendor/VendorStoreCustomizer';
import { VendorAnalyticsPixels } from './components/vendor/VendorAnalyticsPixels';

// Admin Views
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminMasterPanel } from './components/admin/AdminMasterPanel';
import { Product } from './types';

const MainRouter: React.FC = () => {
  const { currentPath, navigate, currentUser } = useApp();

  // Vendor inner state
  const [vendorTab, setVendorTab] = useState('dashboard');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Admin authentication state - always requires email and password on every new access
  const [adminAuthenticated, setAdminAuthenticated] = useState(false);

  // Parse path & parameters
  const path = currentPath;

  // 1. ADMIN MASTER PANEL ROUTE
  // Rota protegida /admin/login → /admin, totalmente separada do Marketplace e da navegação normal.
  // Sempre pede email e senha a cada novo acesso
  if (path.startsWith('/admin')) {
    if (!adminAuthenticated) {
      return (
        <AdminLogin
          onSuccess={() => {
            setAdminAuthenticated(true);
            navigate('/admin');
          }}
        />
      );
    }
    return (
      <AdminMasterPanel
        onLogout={() => {
          setAdminAuthenticated(false);
          navigate('/');
        }}
      />
    );
  }

  // 2. VENDOR PROFESSIONAL AREA ROUTE
  // Requested: "Área profissional só depois de autorizado... Bottom nav mobile do vendedor: Dashboard, Produtos, Add Pedido (+), Vendas, Carteira + Menu"
  if (path.startsWith('/vendedor')) {
    return (
      <div className="min-h-screen bg-[#F8F8F8] text-[#0F0F0F] flex flex-col">
        <TopBar />
        <Header />
        <VendorLayout activeTab={vendorTab} setActiveTab={setVendorTab}>
          {vendorTab === 'dashboard' && (
            <VendorDashboard
              onNavigateTab={(tab) => {
                setVendorTab(tab);
                if (tab === 'novo-produto') setEditingProduct(null);
              }}
            />
          )}

          {vendorTab === 'produtos' && (
            <VendorProducts
              onNewProduct={() => {
                setEditingProduct(null);
                setVendorTab('novo-produto');
              }}
              onEditProduct={(prod) => {
                setEditingProduct(prod);
                setVendorTab('novo-produto');
              }}
            />
          )}

          {vendorTab === 'novo-produto' && (
            <VendorProductEditor
              initialProduct={editingProduct}
              onClose={() => {
                setEditingProduct(null);
                setVendorTab('produtos');
              }}
            />
          )}

          {vendorTab === 'vendas' && <VendorOrders />}

          {vendorTab === 'carteira' && <VendorWallet />}

          {vendorTab === 'personalizar' && <VendorStoreCustomizer />}

          {vendorTab === 'analytics' && <VendorAnalyticsPixels />}

          {vendorTab === 'pixels' && <VendorAnalyticsPixels />}

          {vendorTab === 'configuracoes' && (
            <div className="bg-white border border-gray-200 rounded-3xl p-6 space-y-4 shadow-sm">
              <h2 className="text-base font-bold text-[#0F0F0F]">Configurações da Loja e Notificações</h2>
              <p className="text-xs text-gray-600">
                Avisos sonoros em novas vendas estão configurados no cabeçalho superior.
              </p>
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 text-xs space-y-2">
                <p className="font-semibold text-[#0F0F0F]">Canais de Notificação Ativos:</p>
                <ul className="list-disc pl-5 text-gray-600 space-y-1">
                  <li>Alerta sonoro sintetizado em tempo real</li>
                  <li>Notificação no painel do vendedor</li>
                  <li>Registo do pedido com dados de entrega e telefone</li>
                </ul>
              </div>
            </div>
          )}
        </VendorLayout>
        <BottomNav />
      </div>
    );
  }

  // 3. PRODUCT SALES LANDING PAGE ROUTE
  // Requested: "Clique no produto: sempre leva à landing page/página de vendas do produto (galeria, variações, preço 'DE/POR', desconto, descrição, FAQ, avaliações, seleção de kit/quantidade, botão fixo de compra)"
  if (path.startsWith('/produto/')) {
    const slug = path.replace('/produto/', '');
    return (
      <div className="min-h-screen bg-[#F8F8F8] text-[#0F0F0F] flex flex-col">
        <TopBar />
        <Header />
        <main className="flex-1">
          <ProductSalesPage slug={slug} />
        </main>
        <BottomNav />
      </div>
    );
  }

  // 4. PUBLIC PARTNER STORE ROUTE
  if (path.startsWith('/loja/')) {
    const slug = path.replace('/loja/', '');
    return (
      <div className="min-h-screen bg-[#F8F8F8] text-[#0F0F0F] flex flex-col">
        <TopBar />
        <Header />
        <main className="flex-1">
          <StoreFrontView slug={slug} />
        </main>
        <BottomNav />
      </div>
    );
  }

  // 5. CART ROUTE
  if (path === '/carrinho') {
    return (
      <div className="min-h-screen bg-[#F8F8F8] text-[#0F0F0F] flex flex-col">
        <TopBar />
        <Header />
        <main className="flex-1">
          <CartView />
        </main>
        <BottomNav />
      </div>
    );
  }

  // 6. SIMPLIFIED CHECKOUT ROUTE
  // Requested: "Checkout simplificado: Endereço → Revisão → Confirmar, assumindo entrega grátis Maputo/Matola e pagamento na entrega como padrão... Pós-checkout: continuar comprando imediatamente"
  if (path === '/checkout') {
    return (
      <div className="min-h-screen bg-[#F8F8F8] text-[#0F0F0F] flex flex-col">
        <TopBar />
        <Header />
        <main className="flex-1">
          <CheckoutView />
        </main>
        <BottomNav />
      </div>
    );
  }

  // 7. CUSTOMER ORDERS & PROFILE
  // Requested: "Bottom nav do cliente: Home, Categorias, Carrinho, Perfil — cliente não vê nada de gestão."
  if (path === '/pedidos' || path === '/minha-conta') {
    return (
      <div className="min-h-screen bg-[#F8F8F8] text-[#0F0F0F] flex flex-col">
        <TopBar />
        <Header />
        <main className="flex-1">
          <CustomerAccountView />
        </main>
        <BottomNav />
      </div>
    );
  }

  // 8. MARKETPLACE HOME & CATEGORIES CATALOG (Default)
  return (
    <div className="min-h-screen bg-[#F8F8F8] text-[#0F0F0F] flex flex-col">
      <TopBar />
      <Header />
      <main className="flex-1">
        <MarketplaceHome />
      </main>
      <BottomNav />
    </div>
  );
};

const GlobalAuthModal: React.FC = () => {
  const { authModalState, closeAuthModal } = useApp();
  return (
    <AuthModal
      isOpen={authModalState.isOpen}
      onClose={closeAuthModal}
      defaultRole={authModalState.defaultRole}
      initialMode={authModalState.initialMode}
    />
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <BannedAccountNotice />
        <PwaInstallBanner />
        {/* Direct sale notification audio element for immediate chime playback */}
        <audio id="sale-notification-audio" src="/sounds/sale-notification.wav" preload="auto" />
        <GlobalAuthModal />
        <MainRouter />
      </AppProvider>
    </ErrorBoundary>
  );
}
