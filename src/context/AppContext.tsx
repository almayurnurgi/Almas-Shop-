import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  AuditLog,
  CartItem,
  GlobalSettings,
  NotificationItem,
  Order,
  OrderAddress,
  Product,
  ProductStatus,
  Store,
  User,
  UserRole,
  UTMParams,
  Wallet,
  Withdrawal
} from '../types';
import {
  INITIAL_AUDIT_LOGS,
  INITIAL_ORDERS,
  INITIAL_PRODUCTS,
  INITIAL_SETTINGS,
  INITIAL_STORES,
  INITIAL_USERS,
  INITIAL_WALLETS,
  INITIAL_WITHDRAWALS
} from '../data/seedData';
import {
  EmailLog,
  generateAccountBannedEmail,
  generateAccountUnbannedEmail,
  generateNewSaleEmailToVendor,
  generateOrderConfirmationEmailToCustomer,
  generateWithdrawalUpdateEmail,
  generateAdminNewRegistrationEmail,
  generateAdminNewSaleEmail
} from '../utils/emailTemplates';
import { playNotificationPing, playSaleChime } from '../utils/audio';
import { testFirebaseConnection } from '../lib/firebase';
import {
  saveDocToFirestore,
  deleteDocFromFirestore,
  subscribeToFirestoreCollection,
  seedCollectionIfEmpty
} from '../lib/firestoreSync';

interface AppContextType {
  // Navigation & Routing
  currentPath: string;
  navigate: (path: string) => void;

  // Auth & RBAC
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  switchUserRole: (role: 'CUSTOMER' | 'VENDOR' | 'SUPER_ADMIN') => void;
  users: User[];
  banUser: (userId: string, reason: string) => void;
  unbanUser: (userId: string) => void;
  registerUser: (data: {
    name: string;
    email: string;
    phone?: string;
    role: UserRole;
    storeName?: string;
    password?: string;
    adminLevel?: 'SUPER_ADMIN' | 'CEO' | 'SUPPORT';
    permissions?: string[];
    createdByAdminId?: string;
  }) => Promise<User>;
  loginUser: (email: string) => Promise<User | null>;
  logoutUser: () => void;

  // Products
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string, reason?: string) => void;
  adminModerateProduct: (id: string, status: ProductStatus, reason?: string) => void;

  // Stores
  stores: Store[];
  updateStore: (storeId: string, updates: Partial<Store>) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, variantId?: string) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, delta: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartItemsCount: number;

  // Checkout & Orders
  orders: Order[];
  placeOrder: (shippingAddress: OrderAddress, notes?: string) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  deleteOrder: (orderId: string) => void;
  editOrder: (orderId: string, updates: Partial<Order>) => void;
  adminAddOrder: (orderData: Partial<Order>) => Order;
  resetProductionData: () => void;

  // Wallets & Withdrawals
  wallets: Record<string, Wallet>;
  withdrawals: Withdrawal[];
  requestWithdrawal: (vendorId: string, amount: number, method: 'MPESA' | 'EMOLA' | 'BANK', details: Withdrawal['accountDetails']) => void;
  processWithdrawal: (withdrawalId: string, status: 'APPROVED' | 'REJECTED' | 'PAID', notes?: string) => void;
  updateWithdrawalStatus: (withdrawalId: string, status: 'APPROVED' | 'REJECTED' | 'PAID', notes?: string) => void;

  // Audit Logs & Settings
  auditLogs: AuditLog[];
  addAuditLog: (action: string, details: string) => void;
  updateUserBanStatus: (userId: string, isBanned: boolean, reason?: string) => void;
  approveVendorApplication: (userId: string) => void;
  rejectVendorApplication: (userId: string, reason?: string) => void;
  settings: GlobalSettings;
  updateSettings: (updates: Partial<GlobalSettings>) => void;

  // Notifications & Emails
  notifications: NotificationItem[];
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;
  emailLogs: EmailLog[];
  sendReengagementNotification: () => void;

  // UTM Tracking
  utmParams: UTMParams;

  // PWA Install Prompt
  pwaPromptEvent: any;
  triggerPwaInstall: () => void;
  isPwaInstallable: boolean;

  // UI helpers
  activeSearchQuery: string;
  setActiveSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  flashBanner: { message: string; type: 'success' | 'info' | 'warning' | 'error' } | null;
  setFlashBanner: (b: { message: string; type: 'success' | 'info' | 'warning' | 'error' } | null) => void;

  // Connectivity state (Admin works offline, Vendor/Client require online)
  isOnline: boolean;

  // Global Auth Modal Helper
  authModalState: {
    isOpen: boolean;
    defaultRole: 'CUSTOMER' | 'VENDOR';
    initialMode: 'LOGIN' | 'REGISTER';
  };
  openAuthModal: (role?: 'CUSTOMER' | 'VENDOR', mode?: 'LOGIN' | 'REGISTER') => void;
  closeAuthModal: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USERS: 'almas_users_v1',
  CURRENT_USER_ID: 'almas_current_user_id_v1',
  PRODUCTS: 'almas_products_v1',
  STORES: 'almas_stores_v1',
  ORDERS: 'almas_orders_v1',
  CART: 'almas_cart_v1',
  WALLETS: 'almas_wallets_v1',
  WITHDRAWALS: 'almas_withdrawals_v1',
  AUDIT_LOGS: 'almas_audit_logs_v1',
  SETTINGS: 'almas_settings_v1',
  EMAIL_LOGS: 'almas_email_logs_v1',
  NOTIFICATIONS: 'almas_notifications_v1',
  UTM: 'almas_utm_params_v1'
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname + window.location.search || '/';
    }
    return '/';
  });

  const navigate = (path: string) => {
    setCurrentPath(path);
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname + window.location.search);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Flash banner
  const [flashBanner, setFlashBanner] = useState<{ message: string; type: 'success' | 'info' | 'warning' | 'error' } | null>(null);

  // Global Auth Modal state
  const [authModalState, setAuthModalState] = useState<{
    isOpen: boolean;
    defaultRole: 'CUSTOMER' | 'VENDOR';
    initialMode: 'LOGIN' | 'REGISTER';
  }>({
    isOpen: false,
    defaultRole: 'CUSTOMER',
    initialMode: 'LOGIN'
  });

  const openAuthModal = (role: 'CUSTOMER' | 'VENDOR' = 'CUSTOMER', mode: 'LOGIN' | 'REGISTER' = 'LOGIN') => {
    setAuthModalState({
      isOpen: true,
      defaultRole: role,
      initialMode: mode
    });
  };

  const closeAuthModal = () => {
    setAuthModalState((prev) => ({ ...prev, isOpen: false }));
  };

  // Connectivity state: Admin works offline via localStorage cache; Vendors & Customers require online
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  });

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setFlashBanner({ message: 'Conexão restabelecida. Sincronização em tempo real ativa.', type: 'info' });
    };
    const handleOffline = () => {
      setIsOnline(false);
      setFlashBanner({
        message: 'Modo Offline: O Painel Mestre (Admin) continua funcional com cache local seguro.',
        type: 'warning'
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Search & Filter state
  const [activeSearchQuery, setActiveSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');

  // Load or Initialize State
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USERS);
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUserId, setCurrentUserId] = useState<string | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
    return saved || 'user_customer_1';
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [stores, setStores] = useState<Store[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.STORES);
    return saved ? JSON.parse(saved) : INITIAL_STORES;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CART);
    return saved ? JSON.parse(saved) : [];
  });

  const [wallets, setWallets] = useState<Record<string, Wallet>>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.WALLETS);
    return saved ? JSON.parse(saved) : INITIAL_WALLETS;
  });

  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.WITHDRAWALS);
    return saved ? JSON.parse(saved) : INITIAL_WITHDRAWALS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [settings, setSettings] = useState<GlobalSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  const [emailLogs, setEmailLogs] = useState<EmailLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.EMAIL_LOGS);
    return saved ? JSON.parse(saved) : [];
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    return saved ? JSON.parse(saved) : [
      {
        id: 'notif_welcome',
        recipientId: 'all',
        title: 'Bem-vindo à ALMAS-SHOP Moçambique',
        message: 'Entrega grátis para Maputo e Matola em milhares de produtos!',
        type: 'SYSTEM',
        isRead: false,
        createdAt: new Date().toISOString()
      }
    ];
  });

  // UTM Capture
  const [utmParams, setUtmParams] = useState<UTMParams>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const utm: UTMParams = {
        source: params.get('utm_source') || undefined,
        medium: params.get('utm_medium') || undefined,
        campaign: params.get('utm_campaign') || undefined,
        content: params.get('utm_content') || undefined,
        term: params.get('utm_term') || undefined
      };
      if (utm.source) {
        sessionStorage.setItem(STORAGE_KEYS.UTM, JSON.stringify(utm));
        return utm;
      }
      const saved = sessionStorage.getItem(STORAGE_KEYS.UTM);
      if (saved) return JSON.parse(saved);
    }
    return { source: 'direct', medium: 'organic' };
  });

  // PWA Prompt
  const [pwaPromptEvent, setPwaPromptEvent] = useState<any>(null);
  const [isPwaInstallable, setIsPwaInstallable] = useState(false);

  useEffect(() => {
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setPwaPromptEvent(e);
      setIsPwaInstallable(true);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // Register Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch((err) => {
        console.debug('ServiceWorker registration error:', err);
      });
    }

    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const triggerPwaInstall = () => {
    if (pwaPromptEvent) {
      pwaPromptEvent.prompt();
      pwaPromptEvent.userChoice.then((choice: any) => {
        if (choice.outcome === 'accepted') {
          setIsPwaInstallable(false);
          setFlashBanner({ message: 'Obrigado por instalar o ALMAS-SHOP!', type: 'success' });
        }
        setPwaPromptEvent(null);
      });
    } else {
      setFlashBanner({
        message: 'Para instalar o ALMAS-SHOP no seu telemóvel ou PC, toque em "Adicionar ao Ecrã Principal" ou use o menu do navegador.',
        type: 'info'
      });
    }
  };

  // Sync to localStorage
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users)); }, [users]);
  useEffect(() => {
    if (currentUserId) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, currentUserId);
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);
    }
  }, [currentUserId]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.STORES, JSON.stringify(stores)); }, [stores]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.WALLETS, JSON.stringify(wallets)); }, [wallets]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.WITHDRAWALS, JSON.stringify(withdrawals)); }, [withdrawals]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(auditLogs)); }, [auditLogs]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings)); }, [settings]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.EMAIL_LOGS, JSON.stringify(emailLogs)); }, [emailLogs]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications)); }, [notifications]);

  // Connect to Firebase and establish real-time Firestore synchronization
  useEffect(() => {
    testFirebaseConnection();

    // Seed Firestore collections if empty on first boot
    seedCollectionIfEmpty('users', INITIAL_USERS);
    seedCollectionIfEmpty('stores', INITIAL_STORES);
    seedCollectionIfEmpty('products', INITIAL_PRODUCTS);
    seedCollectionIfEmpty('settings', [{ id: 'global', ...INITIAL_SETTINGS }]);
    seedCollectionIfEmpty('auditLogs', INITIAL_AUDIT_LOGS);
    seedCollectionIfEmpty('orders', INITIAL_ORDERS);

    // Real-time synchronization from Firestore
    const unsubProducts = subscribeToFirestoreCollection<Product>('products', (remoteProds) => {
      if (remoteProds && remoteProds.length > 0) {
        setProducts(remoteProds);
      }
    });

    const unsubStores = subscribeToFirestoreCollection<Store>('stores', (remoteStores) => {
      if (remoteStores && remoteStores.length > 0) {
        setStores(remoteStores);
      }
    });

    const unsubUsers = subscribeToFirestoreCollection<User>('users', (remoteUsers) => {
      if (remoteUsers && remoteUsers.length > 0) {
        setUsers(remoteUsers);
      }
    });

    const unsubOrders = subscribeToFirestoreCollection<Order>('orders', (remoteOrders) => {
      if (remoteOrders && remoteOrders.length > 0) {
        setOrders(remoteOrders);
      }
    });

    const unsubWithdrawals = subscribeToFirestoreCollection<Withdrawal>('withdrawals', (remoteWiths) => {
      if (remoteWiths && remoteWiths.length > 0) {
        setWithdrawals(remoteWiths);
      }
    });

    const unsubLogs = subscribeToFirestoreCollection<AuditLog>('auditLogs', (remoteLogs) => {
      if (remoteLogs && remoteLogs.length > 0) {
        setAuditLogs(remoteLogs);
      }
    });

    const unsubSettings = subscribeToFirestoreCollection<any>('settings', (remoteSettings) => {
      if (remoteSettings && remoteSettings.length > 0) {
        const found = remoteSettings.find((s: any) => s.id === 'global') || remoteSettings[0];
        if (found) {
          setSettings(found);
        }
      }
    });

    return () => {
      unsubProducts();
      unsubStores();
      unsubUsers();
      unsubOrders();
      unsubWithdrawals();
      unsubLogs();
      unsubSettings();
    };
  }, []);

  const currentUser = users.find((u) => u.id === currentUserId) || users[0] || null;

  const setCurrentUser = (user: User | null) => {
    if (user) {
      setCurrentUserId(user.id);
    }
  };

  const switchUserRole = (role: 'CUSTOMER' | 'VENDOR' | 'SUPER_ADMIN') => {
    const targetUser = users.find((u) => u.role === role);
    if (targetUser) {
      setCurrentUserId(targetUser.id);
      if (role === 'CUSTOMER') {
        navigate('/');
      } else if (role === 'VENDOR') {
        navigate('/vendedor');
      } else if (role === 'SUPER_ADMIN') {
        navigate('/admin');
      }
      setFlashBanner({
        message: `Modo alterado para: ${role === 'CUSTOMER' ? 'Cliente' : role === 'VENDOR' ? 'Vendedor' : 'Super Admin'}`,
        type: 'info'
      });
    }
  };

  // Ban / Unban
  const banUser = (userId: string, reason: string) => {
    const target = users.find((u) => u.id === userId);
    if (!target) return;

    const now = new Date().toISOString();
    const updatedUser: User = {
      ...target,
      isBanned: true,
      banReason: reason,
      bannedAt: now,
      bannedBy: currentUser?.email || 'almayurnurgi563@gmail.com'
    };

    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? updatedUser : u))
    );
    saveDocToFirestore('users', userId, updatedUser);

    // Audit Log
    const newLog: AuditLog = {
      id: 'log_' + Date.now(),
      actorId: currentUser?.id || 'admin',
      actorEmail: currentUser?.email || 'almayurnurgi563@gmail.com',
      authorEmail: currentUser?.email || 'almayurnurgi563@gmail.com',
      actorRole: 'SUPER_ADMIN',
      action: 'USER_BANNED',
      targetType: 'USER',
      targetId: userId,
      details: `Conta ${target.name} (${target.email}, Cargo: ${target.role}) foi banida.`,
      reason,
      timestamp: now,
      createdAt: now
    };
    setAuditLogs((prev) => [newLog, ...prev]);
    saveDocToFirestore('auditLogs', newLog.id, newLog);

    // Send banned email
    const emailData = generateAccountBannedEmail(target.name, reason);
    const emailLogEntry: EmailLog = {
      id: 'email_' + Date.now(),
      to: target.email,
      subject: emailData.subject,
      templateKey: 'ACCOUNT_BANNED',
      contentHtml: emailData.html,
      sentAt: now,
      status: 'SENT'
    };
    setEmailLogs((prev) => [emailLogEntry, ...prev]);

    setFlashBanner({ message: `Usuário ${target.name} foi banido com sucesso.`, type: 'warning' });
  };

  const unbanUser = (userId: string) => {
    const target = users.find((u) => u.id === userId);
    if (!target) return;

    const now = new Date().toISOString();
    const updatedUser: User = {
      ...target,
      isBanned: false,
      banReason: undefined,
      bannedAt: undefined,
      bannedBy: undefined
    };

    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? updatedUser : u))
    );
    saveDocToFirestore('users', userId, updatedUser);

    const newLog: AuditLog = {
      id: 'log_' + Date.now(),
      actorId: currentUser?.id || 'admin',
      actorEmail: currentUser?.email || 'almayurnurgi563@gmail.com',
      authorEmail: currentUser?.email || 'almayurnurgi563@gmail.com',
      actorRole: 'SUPER_ADMIN',
      action: 'USER_UNBANNED',
      targetType: 'USER',
      targetId: userId,
      details: `Conta ${target.name} (${target.email}) foi reativada.`,
      timestamp: now,
      createdAt: now
    };
    setAuditLogs((prev) => [newLog, ...prev]);
    saveDocToFirestore('auditLogs', newLog.id, newLog);

    const emailData = generateAccountUnbannedEmail(target.name);
    const emailLogEntry: EmailLog = {
      id: 'email_' + Date.now(),
      to: target.email,
      subject: emailData.subject,
      templateKey: 'ACCOUNT_UNBANNED',
      contentHtml: emailData.html,
      sentAt: now,
      status: 'SENT'
    };
    setEmailLogs((prev) => [emailLogEntry, ...prev]);

    setFlashBanner({ message: `Conta de ${target.name} reativada com sucesso!`, type: 'success' });
  };

  // User Registration & Authentication (Reliable, fast, zero white-screens or stuck loaders)
  const registerUser = async (data: {
    name: string;
    email: string;
    phone?: string;
    role: UserRole;
    storeName?: string;
    password?: string;
    adminLevel?: 'SUPER_ADMIN' | 'CEO' | 'SUPPORT';
    permissions?: string[];
    createdByAdminId?: string;
  }): Promise<User> => {
    const now = new Date().toISOString();
    const rawInput = data.email.trim();
    let cleanEmail = rawInput.toLowerCase();
    let cleanPhone = (data.phone || '').trim();

    // If user provided a phone number in the email field
    if (!cleanEmail.includes('@')) {
      cleanPhone = rawInput;
      const digitsOnly = cleanPhone.replace(/[^0-9]/g, '');
      cleanEmail = `${digitsOnly || 'user_' + Date.now()}@cliente.almas-shop.co.mz`;
    }

    // Check if user already exists by email or phone
    const existing = users.find(
      (u) =>
        u.email.toLowerCase() === cleanEmail ||
        (cleanPhone && u.phone && u.phone.replace(/[^0-9]/g, '') === cleanPhone.replace(/[^0-9]/g, ''))
    );
    if (existing) {
      setCurrentUserId(existing.id);
      setFlashBanner({ message: `Sessão iniciada como ${existing.name}!`, type: 'success' });
      return existing;
    }

    const newUserId = 'usr_' + Date.now();
    const vendorStoreId = data.role === 'VENDOR' ? 'store_' + Date.now() : undefined;

    const newUser: User = {
      id: newUserId,
      name: data.name.trim(),
      email: cleanEmail,
      phone: cleanPhone || '84 345 6786',
      role: data.role,
      password: data.password,
      adminLevel: data.adminLevel,
      permissions: data.permissions,
      createdByAdminId: data.createdByAdminId,
      vendorStatus: data.role === 'VENDOR' ? 'APPROVED' : undefined,
      storeId: vendorStoreId,
      isBanned: false,
      createdAt: now,
      updatedAt: now
    };

    setUsers((prev) => [newUser, ...prev]);
    if (data.role !== 'ADMIN' && data.role !== 'SUPER_ADMIN') {
      setCurrentUserId(newUserId);
    }
    saveDocToFirestore('users', newUserId, newUser);

    // If vendor, create their store and wallet
    if (data.role === 'VENDOR' && vendorStoreId) {
      const newStore: Store = {
        id: vendorStoreId,
        vendorId: newUserId,
        name: data.storeName || `${data.name} Store`,
        slug: (data.storeName || data.name).toLowerCase().replace(/\s+/g, '-'),
        description: `Loja oficial de ${data.name} na ALMAS-SHOP`,
        logoUrl: '/logo.svg',
        bannerUrl: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=1200&q=80',
        rating: 5.0,
        totalSales: 0,
        isVerified: true,
        phone: data.phone || '84 345 6786',
        city: 'Maputo',
        createdAt: now,
        updatedAt: now
      };
      setStores((prev) => [newStore, ...prev]);
      saveDocToFirestore('stores', vendorStoreId, newStore);

      const initialWallet: Wallet = {
        vendorId: newUserId,
        availableBalance: 0,
        pendingBalance: 0,
        totalSales: 0,
        totalCommissions: 0,
        totalWithdrawn: 0,
        transactions: [],
        updatedAt: now
      };
      setWallets((prev) => ({ ...prev, [newUserId]: initialWallet }));
      saveDocToFirestore('wallets', newUserId, initialWallet);
    }

    // Send admin notification email as required:
    // "A cada novo registo (cadastro de conta): email para almayurnurgi563@gmail.com com o texto:
    // 'Parabéns, tivestes um novo cadastro com nome: [nome do usuário]'"
    const adminRegEmail = generateAdminNewRegistrationEmail(newUser.name, newUser.email, newUser.role);
    const adminRegEmailLog: EmailLog = {
      id: 'email_reg_' + Date.now(),
      to: 'almayurnurgi563@gmail.com',
      subject: adminRegEmail.subject,
      templateKey: 'ADMIN_NEW_REGISTRATION',
      contentHtml: adminRegEmail.html,
      sentAt: now,
      status: 'SENT'
    };
    setEmailLogs((prev) => [adminRegEmailLog, ...prev]);

    // Admin in-app notification
    const adminRegNotif: NotificationItem = {
      id: 'notif_reg_' + Date.now(),
      recipientId: 'all',
      recipientRole: 'SUPER_ADMIN',
      title: 'Novo Cadastro no ALMAS-SHOP',
      message: `Parabéns, tivestes um novo cadastro com nome: ${newUser.name} (${newUser.email}) - Cargo: ${newUser.role}`,
      type: 'ACCOUNT_STATUS',
      isRead: false,
      link: '/admin',
      createdAt: now
    };
    setNotifications((prev) => [adminRegNotif, ...prev]);

    // Audit log
    const audit: AuditLog = {
      id: 'log_' + Date.now(),
      actorId: newUserId,
      actorEmail: cleanEmail,
      authorEmail: cleanEmail,
      actorRole: data.role,
      action: 'USER_REGISTERED',
      targetType: 'USER',
      targetId: newUserId,
      details: `Novo cadastro: ${newUser.name} (${cleanEmail}) como ${data.role}`,
      timestamp: now,
      createdAt: now
    };
    setAuditLogs((prev) => [audit, ...prev]);
    saveDocToFirestore('auditLogs', audit.id, audit);

    setFlashBanner({
      message: `Conta criada com sucesso! Bem-vindo(a) à ALMAS-SHOP, ${newUser.name}.`,
      type: 'success'
    });

    return newUser;
  };

  const loginUser = async (identifier: string): Promise<User | null> => {
    const raw = identifier.trim().toLowerCase();
    const digitsOnly = raw.replace(/[^0-9]/g, '');
    const found = users.find((u) => {
      if (u.email.toLowerCase() === raw) return true;
      if (digitsOnly.length >= 7 && u.phone && u.phone.replace(/[^0-9]/g, '').includes(digitsOnly)) return true;
      if (digitsOnly.length >= 7 && u.email.includes(digitsOnly)) return true;
      return false;
    });
    if (found) {
      if (found.isBanned) {
        throw new Error(`Esta conta está suspensa. Motivo: ${found.banReason || 'Violação dos termos de uso'}`);
      }
      setCurrentUserId(found.id);
      setFlashBanner({ message: `Sessão iniciada como ${found.name}!`, type: 'success' });
      return found;
    }
    return null;
  };

  const logoutUser = () => {
    setCurrentUserId(null);
    setFlashBanner({ message: 'Sessão encerrada com sucesso.', type: 'info' });
  };

  // Product Management
  const addProduct = (prodData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Product => {
    const now = new Date().toISOString();
    const newProduct: Product = {
      ...prodData,
      id: 'prod_' + Date.now(),
      createdAt: now,
      updatedAt: now
    };
    setProducts((prev) => [newProduct, ...prev]);
    saveDocToFirestore('products', newProduct.id, newProduct);

    // Audit Log
    const newLog: AuditLog = {
      id: 'log_' + Date.now(),
      actorId: currentUser?.id || 'vendor',
      actorEmail: currentUser?.email || 'vendedor@almas-shop.co.mz',
      authorEmail: currentUser?.email || 'vendedor@almas-shop.co.mz',
      actorRole: currentUser?.role || 'VENDOR',
      action: 'PRODUCT_CREATED',
      targetType: 'PRODUCT',
      targetId: newProduct.id,
      details: `Produto criado: "${newProduct.name}" com preço ${newProduct.salePrice} MT`,
      timestamp: now,
      createdAt: now
    };
    setAuditLogs((prev) => [newLog, ...prev]);
    saveDocToFirestore('auditLogs', newLog.id, newLog);

    setFlashBanner({ message: `Produto "${newProduct.name}" cadastrado com sucesso!`, type: 'success' });

    // Notificar Painel Mestre em tempo real com dados reais
    const adminProductNotif: NotificationItem = {
      id: 'notif_prod_' + Date.now(),
      recipientId: 'all',
      recipientRole: 'SUPER_ADMIN',
      title: 'Novo Produto Cadastrado',
      message: `Novo produto cadastrado: "${newProduct.name}" (Loja: ${newProduct.storeName}) por ${currentUser?.name || 'Vendedor'} às ${new Date().toLocaleTimeString('pt-MZ')}`,
      type: 'ACCOUNT_STATUS',
      isRead: false,
      link: '/admin',
      createdAt: now
    };
    setNotifications((prev) => [adminProductNotif, ...prev]);

    return newProduct;
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    const now = new Date().toISOString();
    const target = products.find((p) => p.id === id);
    if (target) {
      // Regra de segurança: Produto rejeitado/bloqueado pelo admin nunca volta a ficar aprovado sozinho
      // Apenas Super Admin ou Admin pode alterar o status de um produto REJECTED
      const isAdmin = currentUser?.role === 'SUPER_ADMIN' || currentUser?.role === 'ADMIN';
      if (target.status === 'REJECTED' && !isAdmin) {
        if (updates.status && updates.status !== 'REJECTED') {
          updates.status = 'REJECTED';
          setFlashBanner({
            message: 'Este produto foi bloqueado pelo Admin Master e só pode ser reativado pelo Chefe.',
            type: 'error'
          });
        }
      }

      const updated = { ...target, ...updates, updatedAt: now };
      setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
      saveDocToFirestore('products', id, updated);
    }
    setFlashBanner({ message: 'Produto atualizado com sucesso!', type: 'success' });
  };

  const adminModerateProduct = (id: string, status: ProductStatus, reason?: string) => {
    const target = products.find((p) => p.id === id);
    if (!target) return;
    const now = new Date().toISOString();
    const updated: Product = {
      ...target,
      status,
      updatedAt: now
    };
    setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
    saveDocToFirestore('products', id, updated);

    const isBlocking = status === 'REJECTED';
    const newLog: AuditLog = {
      id: 'log_' + Date.now(),
      actorId: currentUser?.id || 'admin',
      actorEmail: currentUser?.email || 'almayurnurgi563@gmail.com',
      authorEmail: currentUser?.email || 'almayurnurgi563@gmail.com',
      actorRole: currentUser?.role || 'SUPER_ADMIN',
      action: isBlocking ? 'PRODUCT_REJECTED' : 'PRODUCT_APPROVED',
      targetType: 'PRODUCT',
      targetId: id,
      details: `Produto "${target.name}" da loja "${target.storeName}" foi ${isBlocking ? 'BLOQUEADO/REJEITADO' : 'APROVADO/ATIVADO'} pelo Painel Mestre. Motivo: ${reason || 'Ação da administração'}.`,
      reason: reason || 'Moderação administrativa',
      timestamp: now,
      createdAt: now
    };
    setAuditLogs((prev) => [newLog, ...prev]);
    saveDocToFirestore('auditLogs', newLog.id, newLog);

    setFlashBanner({
      message: `Produto "${target.name}" ${isBlocking ? 'bloqueado com sucesso. Status não pode ser alterado por vendedores.' : 'aprovado e ativado no marketplace!'}`,
      type: isBlocking ? 'info' : 'success'
    });
  };

  const deleteProduct = (id: string, reason?: string) => {
    const target = products.find((p) => p.id === id);
    if (!target) return;
    setProducts((prev) => prev.filter((p) => p.id !== id));
    deleteDocFromFirestore('products', id);

    const newLog: AuditLog = {
      id: 'log_' + Date.now(),
      actorId: currentUser?.id || 'admin',
      actorEmail: currentUser?.email || 'almayurnurgi563@gmail.com',
      actorRole: currentUser?.role || 'SUPER_ADMIN',
      action: 'PRODUCT_REMOVED',
      targetType: 'PRODUCT',
      targetId: id,
      details: `Produto "${target.name}" da loja "${target.storeName}" foi removido do marketplace.`,
      reason: reason || 'Remoção administrativa',
      createdAt: new Date().toISOString()
    };
    setAuditLogs((prev) => [newLog, ...prev]);
    setFlashBanner({ message: `Produto "${target.name}" removido com sucesso.`, type: 'info' });
  };

  // Store Management
  const updateStore = (storeId: string, updates: Partial<Store>) => {
    const now = new Date().toISOString();
    const target = stores.find((s) => s.id === storeId);
    if (target) {
      const updated = { ...target, ...updates, updatedAt: now };
      setStores((prev) =>
        prev.map((s) => (s.id === storeId ? updated : s))
      );
      saveDocToFirestore('stores', storeId, updated);
    }
    setFlashBanner({ message: 'Configurações e visual da loja atualizados!', type: 'success' });
  };

  // Cart
  const addToCart = (product: Product, quantity = 1, variantId?: string) => {
    setCart((prev) => {
      const selectedVariant = variantId ? product.variants.find((v) => v.id === variantId) : undefined;
      const cartItemId = `${product.id}_${variantId || 'default'}`;
      const existing = prev.find((item) => item.id === cartItemId);

      const itemPrice = selectedVariant ? selectedVariant.price : product.salePrice;

      if (existing) {
        return prev.map((item) =>
          item.id === cartItemId ? { ...item, quantity: item.quantity + quantity } : item
        );
      } else {
        const newItem: CartItem = {
          id: cartItemId,
          productId: product.id,
          variantId: variantId,
          variantName: selectedVariant?.name,
          name: product.name,
          price: itemPrice,
          regularPrice: product.regularPrice,
          quantity: quantity,
          image: product.images[0] || '/logo.svg',
          storeId: product.vendorId,
          storeName: product.storeName,
          type: product.type
        };
        return [...prev, newItem];
      }
    });

    playNotificationPing();
    setFlashBanner({ message: `${product.name} adicionado ao carrinho!`, type: 'success' });
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const updateCartQuantity = (cartItemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === cartItemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Place Order (Simplified checkout: Address -> Review -> Confirm)
  const placeOrder = async (shippingAddress: OrderAddress, notes?: string): Promise<Order> => {
    if (cart.length === 0) {
      throw new Error('O carrinho está vazio');
    }

    const now = new Date().toISOString();
    const orderNumber = 'ALM-' + Math.floor(1000 + Math.random() * 9000);
    const subtotal = cartTotal;
    const shippingCost = 0; // Entrega grátis em Maputo e Matola
    const totalAmount = subtotal + shippingCost;

    const vendorIds = Array.from(new Set(cart.map((item) => item.storeId)));

    const orderItems = cart.map((item) => ({
      productId: item.productId,
      productName: item.name,
      productImage: item.image,
      variantName: item.variantName,
      price: item.price,
      quantity: item.quantity,
      storeId: item.storeId,
      storeName: item.storeName
    }));

    const newOrder: Order = {
      id: 'ord_' + Date.now(),
      orderNumber,
      customerId: currentUser?.id || 'guest',
      customerName: shippingAddress.fullName,
      customerPhone: shippingAddress.phone,
      customerEmail: currentUser?.email || 'cliente@almas-shop.co.mz',
      shippingAddress,
      items: orderItems,
      subtotal,
      shippingCost,
      totalAmount,
      paymentMethod: 'CASH_ON_DELIVERY',
      status: 'PENDING',
      vendorIds,
      utmSource: utmParams.source,
      utmMedium: utmParams.medium,
      utmCampaign: utmParams.campaign,
      utmContent: utmParams.content,
      utmTerm: utmParams.term,
      notes,
      createdAt: now,
      updatedAt: now
    };

    // Save order
    setOrders((prev) => [newOrder, ...prev]);
    saveDocToFirestore('orders', newOrder.id, newOrder);

    // Update Wallets for each vendor (5% commission)
    const commissionRate = settings.commissionRate / 100;
    setWallets((prev) => {
      const updated = { ...prev };
      for (const item of cart) {
        const itemTotal = item.price * item.quantity;
        const commission = itemTotal * commissionRate;
        const netVendorAmount = itemTotal - commission;
        const vendorKey = item.storeId;

        const currentWallet: Wallet = updated[vendorKey] || {
          vendorId: vendorKey,
          availableBalance: 0,
          pendingBalance: 0,
          totalSales: 0,
          totalCommissions: 0,
          totalWithdrawn: 0,
          transactions: [],
          updatedAt: now
        };

        const newTx = {
          id: 'tx_' + Math.random().toString(36).substring(2, 9),
          walletId: 'w_' + vendorKey,
          amount: netVendorAmount,
          type: 'SALE' as const,
          description: `Venda do Pedido #${orderNumber} (${item.name})`,
          orderId: newOrder.id,
          createdAt: now
        };

        updated[vendorKey] = {
          ...currentWallet,
          pendingBalance: currentWallet.pendingBalance + netVendorAmount,
          totalSales: currentWallet.totalSales + itemTotal,
          totalCommissions: currentWallet.totalCommissions + commission,
          transactions: [newTx, ...currentWallet.transactions],
          updatedAt: now
        };
      }
      return updated;
    });

    // Decrease Product Stock
    setProducts((prev) =>
      prev.map((p) => {
        const cartItemMatch = cart.find((item) => item.productId === p.id);
        if (cartItemMatch) {
          const newStock = Math.max(0, p.stock - cartItemMatch.quantity);
          const updatedP = {
            ...p,
            stock: newStock,
            status: newStock === 0 ? ('OUT_OF_STOCK' as const) : p.status
          };
          saveDocToFirestore('products', p.id, updatedP);
          return updatedP;
        }
        return p;
      })
    );

    // Send email to vendors
    for (const item of cart) {
      const vendorUser = users.find((u) => u.id === item.storeId || u.storeId === item.storeId);
      const vendorEmail = vendorUser?.email || 'vendedor@almas-shop.co.mz';
      const vendorName = vendorUser?.name || item.storeName;
      const itemTotal = item.price * item.quantity;
      const commission = itemTotal * commissionRate;
      const net = itemTotal - commission;

      const emailData = generateNewSaleEmailToVendor(
        vendorName,
        item.storeName,
        orderNumber,
        item.name,
        itemTotal,
        commission,
        net,
        shippingAddress.fullName,
        shippingAddress.city + ' - ' + shippingAddress.neighborhood,
        shippingAddress.phone
      );

      const emailLogEntry: EmailLog = {
        id: 'email_' + Math.random().toString(36).substring(2, 9),
        to: vendorEmail,
        subject: emailData.subject,
        templateKey: 'VENDOR_NEW_SALE',
        contentHtml: emailData.html,
        sentAt: now,
        status: 'SENT'
      };
      setEmailLogs((prev) => [emailLogEntry, ...prev]);

      // Create in-app notification for vendor
      const newNotif: NotificationItem = {
        id: 'notif_' + Math.random().toString(36).substring(2, 9),
        recipientId: item.storeId,
        recipientRole: 'VENDOR',
        title: `Nova Venda #${orderNumber}!`,
        message: `${shippingAddress.fullName} comprou "${item.name}". Valor líquido: ${net.toLocaleString()} MT`,
        type: 'NEW_SALE',
        isRead: false,
        link: '/vendedor/pedidos',
        createdAt: now
      };
      setNotifications((prev) => [newNotif, ...prev]);
    }

    // Customer confirmation email
    const customerEmailData = generateOrderConfirmationEmailToCustomer(
      shippingAddress.fullName,
      orderNumber,
      totalAmount,
      cart.map((i) => `${i.quantity}x ${i.name}`).join(', '),
      `${shippingAddress.city}, ${shippingAddress.neighborhood}, ${shippingAddress.street}`
    );
    const customerEmailLog: EmailLog = {
      id: 'email_cust_' + Math.random().toString(36).substring(2, 9),
      to: currentUser?.email || 'cliente@almas-shop.co.mz',
      subject: customerEmailData.subject,
      templateKey: 'ORDER_CONFIRMATION',
      contentHtml: customerEmailData.html,
      sentAt: now,
      status: 'SENT'
    };
    setEmailLogs((prev) => [customerEmailLog, ...prev]);

    // Admin notification email as required: almayurnurgi563@gmail.com
    const adminSaleEmail = generateAdminNewSaleEmail(
      orderNumber,
      cart.map((i) => `${i.quantity}x ${i.name}`).join(', '),
      totalAmount,
      shippingAddress.fullName
    );
    const adminEmailLog: EmailLog = {
      id: 'email_admin_' + Date.now(),
      to: 'almayurnurgi563@gmail.com',
      subject: adminSaleEmail.subject,
      templateKey: 'ADMIN_NEW_SALE',
      contentHtml: adminSaleEmail.html,
      sentAt: now,
      status: 'SENT'
    };
    setEmailLogs((prev) => [adminEmailLog, ...prev]);

    // Admin in-app notification
    const adminNotif: NotificationItem = {
      id: 'notif_admin_' + Date.now(),
      recipientId: 'all',
      recipientRole: 'SUPER_ADMIN',
      title: 'Nova Venda no ALMAS-SHOP!',
      message: `Parabéns, uma nova venda na ALMAS-SHOP: Pedido #${orderNumber} por ${shippingAddress.fullName} no valor de ${totalAmount.toLocaleString()} MT`,
      type: 'NEW_SALE',
      isRead: false,
      link: '/admin',
      createdAt: now
    };
    setNotifications((prev) => [adminNotif, ...prev]);

    // Play sale notification chime unconditionally whenever a sale is confirmed
    playSaleChime();

    // Clear cart immediately so customer can continue shopping
    clearCart();

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    const now = new Date().toISOString();
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          const updated = { ...o, status, updatedAt: now };
          saveDocToFirestore('orders', orderId, updated);
          return updated;
        }
        return o;
      })
    );

    // If order delivered, move pending balance to available balance for vendors
    if (status === 'DELIVERED') {
      const order = orders.find((o) => o.id === orderId);
      if (order) {
        setWallets((prev) => {
          const updated = { ...prev };
          const commissionRate = settings.commissionRate / 100;
          for (const item of order.items) {
            const itemTotal = item.price * item.quantity;
            const netVendor = itemTotal - itemTotal * commissionRate;
            const wallet = updated[item.storeId];
            if (wallet) {
              updated[item.storeId] = {
                ...wallet,
                pendingBalance: Math.max(0, wallet.pendingBalance - netVendor),
                availableBalance: wallet.availableBalance + netVendor,
                updatedAt: now
              };
            }
          }
          return updated;
        });
      }
    }

    setFlashBanner({ message: `Estado do pedido atualizado para: ${status}`, type: 'success' });
  };

  // Direct Order Management for Admin (Add, Edit, Delete, Zero)
  const deleteOrder = (orderId: string) => {
    const target = orders.find((o) => o.id === orderId);
    if (!target) return;
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    deleteDocFromFirestore('orders', orderId);

    const now = new Date().toISOString();
    const newLog: AuditLog = {
      id: 'log_' + Date.now(),
      actorId: currentUser?.id || 'admin',
      actorEmail: currentUser?.email || 'almayurnurgi563@gmail.com',
      authorEmail: currentUser?.email || 'almayurnurgi563@gmail.com',
      actorRole: 'SUPER_ADMIN',
      action: 'ORDER_DELETED',
      targetType: 'ORDER',
      targetId: orderId,
      details: `Pedido #${orderId} de ${target.shippingAddress?.fullName || target.customerName || 'Cliente'} (${target.totalAmount} MT) foi apagado pelo administrador.`,
      timestamp: now,
      createdAt: now
    };
    setAuditLogs((prev) => [newLog, ...prev]);
    saveDocToFirestore('auditLogs', newLog.id, newLog);
    setFlashBanner({ message: `Pedido #${orderId} apagado com sucesso.`, type: 'info' });
  };

  const editOrder = (orderId: string, updates: Partial<Order>) => {
    const now = new Date().toISOString();
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          const updated = { ...o, ...updates, updatedAt: now };
          saveDocToFirestore('orders', orderId, updated);
          return updated;
        }
        return o;
      })
    );

    const newLog: AuditLog = {
      id: 'log_' + Date.now(),
      actorId: currentUser?.id || 'admin',
      actorEmail: currentUser?.email || 'almayurnurgi563@gmail.com',
      authorEmail: currentUser?.email || 'almayurnurgi563@gmail.com',
      actorRole: 'SUPER_ADMIN',
      action: 'ORDER_EDITED',
      targetType: 'ORDER',
      targetId: orderId,
      details: `Pedido #${orderId} atualizado: ${Object.keys(updates).join(', ')}`,
      timestamp: now,
      createdAt: now
    };
    setAuditLogs((prev) => [newLog, ...prev]);
    saveDocToFirestore('auditLogs', newLog.id, newLog);
    setFlashBanner({ message: `Pedido #${orderId} atualizado com sucesso.`, type: 'success' });
  };

  const adminAddOrder = (orderData: Partial<Order>): Order => {
    const now = new Date().toISOString();
    const orderNumber = 'MAN_' + Math.floor(100000 + Math.random() * 900000);
    const newOrder: Order = {
      id: orderNumber,
      orderNumber,
      customerId: orderData.customerId || 'cust_admin_direct',
      customerEmail: orderData.customerEmail || 'cliente@almas-shop.co.mz',
      customerName: orderData.customerName || orderData.shippingAddress?.fullName || 'Cliente Manual',
      customerPhone: orderData.customerPhone || orderData.shippingAddress?.phone || '84 000 0000',
      shippingAddress: orderData.shippingAddress || {
        fullName: orderData.customerName || 'Cliente Manual',
        phone: '84 000 0000',
        province: 'Maputo Cidade',
        city: 'Maputo',
        neighborhood: 'Central',
        street: 'Av. 24 de Julho',
        referencePoint: 'Perto do centro'
      },
      items: orderData.items || [],
      subtotal: orderData.totalAmount || 0,
      shippingCost: 0,
      totalAmount: orderData.totalAmount || 0,
      paymentMethod: orderData.paymentMethod || 'CASH_ON_DELIVERY',
      status: orderData.status || 'DELIVERED',
      vendorIds: orderData.vendorIds || ['store_almas_official'],
      notes: orderData.notes || 'Pedido lançado diretamente pelo Painel Mestre',
      utmSource: 'admin_direct',
      createdAt: now,
      updatedAt: now
    };

    setOrders((prev) => [newOrder, ...prev]);
    saveDocToFirestore('orders', newOrder.id, newOrder);

    const newLog: AuditLog = {
      id: 'log_' + Date.now(),
      actorId: currentUser?.id || 'admin',
      actorEmail: currentUser?.email || 'almayurnurgi563@gmail.com',
      authorEmail: currentUser?.email || 'almayurnurgi563@gmail.com',
      actorRole: 'SUPER_ADMIN',
      action: 'ORDER_CREATED_BY_ADMIN',
      targetType: 'ORDER',
      targetId: newOrder.id,
      details: `Pedido manual #${newOrder.id} (${newOrder.totalAmount} MT) adicionado diretamente pelo administrador.`,
      timestamp: now,
      createdAt: now
    };
    setAuditLogs((prev) => [newLog, ...prev]);
    saveDocToFirestore('auditLogs', newLog.id, newLog);
    setFlashBanner({ message: `Pedido manual #${newOrder.id} criado com sucesso!`, type: 'success' });

    // Play sale chime
    playSaleChime();

    return newOrder;
  };

  const resetProductionData = () => {
    // 1. Limpar todos os pedidos
    setOrders([]);
    orders.forEach((o) => deleteDocFromFirestore('orders', o.id));

    // 2. Limpar cadastros de teste - preservar unicamente a conta Mestre do Super Admin
    const superAdminAccount: User = {
      id: 'user_admin_1',
      name: 'Chefe Almayur Nurgi',
      email: 'almayurnurgi563@gmail.com',
      phone: '843456786',
      role: 'SUPER_ADMIN',
      password: 'Te@momae',
      adminLevel: 'SUPER_ADMIN',
      isBanned: false,
      twoFactorEnabled: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setUsers([superAdminAccount]);
    saveDocToFirestore('users', superAdminAccount.id, superAdminAccount);

    // 3. Limpar levantamentos e carteiras de teste
    setWithdrawals([]);
    setWallets({});

    const now = new Date().toISOString();
    const newLog: AuditLog = {
      id: 'log_' + Date.now(),
      actorId: currentUser?.id || 'admin',
      actorEmail: 'almayurnurgi563@gmail.com',
      authorEmail: 'almayurnurgi563@gmail.com',
      actorRole: 'SUPER_ADMIN',
      action: 'PRODUCTION_RESET',
      targetType: 'SYSTEM',
      targetId: 'all',
      details: 'Base de dados zerada para produção limpa: todos os pedidos, levantamentos e usuários de teste foram removidos, mantendo exclusivamente a conta do Super Admin.',
      timestamp: now,
      createdAt: now
    };
    setAuditLogs((prev) => [newLog, ...prev]);
    saveDocToFirestore('auditLogs', newLog.id, newLog);
    setFlashBanner({
      message: 'Painel totalmente zerado para produção! 0 pedidos e 0 contas de teste. Apenas o Super Admin ativo.',
      type: 'success'
    });
  };

  // Withdrawals
  const requestWithdrawal = (
    vendorId: string,
    amount: number,
    method: 'MPESA' | 'EMOLA' | 'BANK',
    details: Withdrawal['accountDetails']
  ) => {
    const currentWallet = wallets[vendorId];
    if (!currentWallet || currentWallet.availableBalance < amount) {
      throw new Error('Saldo disponível insuficiente para este levantamento.');
    }

    const now = new Date().toISOString();
    const vendorStore = stores.find((s) => s.vendorId === vendorId);

    const newWithdrawal: Withdrawal = {
      id: 'wdr_' + Date.now(),
      vendorId,
      storeName: vendorStore?.name || 'Loja Parceira',
      amount,
      method,
      accountDetails: details,
      status: 'PENDING',
      requestedAt: now
    };

    // Deduct available balance
    setWallets((prev) => ({
      ...prev,
      [vendorId]: {
        ...currentWallet,
        availableBalance: currentWallet.availableBalance - amount,
        transactions: [
          {
            id: 'tx_wdr_' + Date.now(),
            walletId: 'w_' + vendorId,
            amount: -amount,
            type: 'WITHDRAWAL',
            description: `Solicitação de levantamento via ${method}`,
            createdAt: now
          },
          ...currentWallet.transactions
        ],
        updatedAt: now
      }
    }));

    setWithdrawals((prev) => [newWithdrawal, ...prev]);
    saveDocToFirestore('withdrawals', newWithdrawal.id, newWithdrawal);

    // Admin Notification
    const adminNotif: NotificationItem = {
      id: 'notif_adm_' + Date.now(),
      recipientId: 'user_admin_1',
      recipientRole: 'SUPER_ADMIN',
      title: 'Nova Solicitação de Levantamento',
      message: `${vendorStore?.name} solicitou ${amount.toLocaleString()} MT via ${method}.`,
      type: 'WITHDRAWAL',
      isRead: false,
      link: '/admin/levantamentos',
      createdAt: now
    };
    setNotifications((prev) => [adminNotif, ...prev]);

    setFlashBanner({
      message: `Solicitação de levantamento de ${amount.toLocaleString()} MT enviada para aprovação do Super Admin.`,
      type: 'success'
    });
  };

  const processWithdrawal = (
    withdrawalId: string,
    status: 'APPROVED' | 'REJECTED' | 'PAID',
    notes?: string
  ) => {
    const now = new Date().toISOString();
    const targetWdr = withdrawals.find((w) => w.id === withdrawalId);
    if (!targetWdr) return;

    // If rejected, refund available balance
    if (status === 'REJECTED' && targetWdr.status !== 'REJECTED') {
      setWallets((prev) => {
        const wallet = prev[targetWdr.vendorId];
        if (!wallet) return prev;
        return {
          ...prev,
          [targetWdr.vendorId]: {
            ...wallet,
            availableBalance: wallet.availableBalance + targetWdr.amount,
            transactions: [
              {
                id: 'tx_ref_' + Date.now(),
                walletId: 'w_' + targetWdr.vendorId,
                amount: targetWdr.amount,
                type: 'REFUND',
                description: `Reembolso de levantamento rejeitado (${notes || 'Rejeitado pelo Admin'})`,
                createdAt: now
              },
              ...wallet.transactions
            ],
            updatedAt: now
          }
        };
      });
    }

    if (status === 'PAID') {
      setWallets((prev) => {
        const wallet = prev[targetWdr.vendorId];
        if (!wallet) return prev;
        return {
          ...prev,
          [targetWdr.vendorId]: {
            ...wallet,
            totalWithdrawn: wallet.totalWithdrawn + targetWdr.amount,
            updatedAt: now
          }
        };
      });
    }

    const updatedWithdrawalItem: Withdrawal = {
      ...targetWdr,
      status,
      processedAt: now,
      processedBy: currentUser?.email || 'almayurnurgi563@gmail.com',
      notes
    };
    saveDocToFirestore('withdrawals', withdrawalId, updatedWithdrawalItem);

    setWithdrawals((prev) =>
      prev.map((w) =>
        w.id === withdrawalId
          ? updatedWithdrawalItem
          : w
      )
    );

    // Audit log
    const newLog: AuditLog = {
      id: 'log_' + Date.now(),
      actorId: currentUser?.id || 'admin',
      actorEmail: currentUser?.email || 'almayurnurgi563@gmail.com',
      authorEmail: currentUser?.email || 'almayurnurgi563@gmail.com',
      actorRole: 'SUPER_ADMIN',
      action: `WITHDRAWAL_${status}`,
      targetType: 'WITHDRAWAL',
      targetId: withdrawalId,
      details: `Levantamento de ${targetWdr.amount} MT para ${targetWdr.storeName} marcado como ${status}.`,
      reason: notes,
      timestamp: now,
      createdAt: now
    };
    setAuditLogs((prev) => [newLog, ...prev]);
    saveDocToFirestore('auditLogs', newLog.id, newLog);

    // Send email notification to vendor
    const vendor = users.find((u) => u.id === targetWdr.vendorId || u.storeId === targetWdr.vendorId);
    if (vendor) {
      const emailData = generateWithdrawalUpdateEmail(
        vendor.name,
        targetWdr.amount,
        status,
        targetWdr.method,
        notes
      );
      setEmailLogs((prev) => [
        {
          id: 'email_wdr_' + Date.now(),
          to: vendor.email,
          subject: emailData.subject,
          templateKey: 'WITHDRAWAL_UPDATE',
          contentHtml: emailData.html,
          sentAt: now,
          status: 'SENT'
        },
        ...prev
      ]);
    }

    setFlashBanner({ message: `Levantamento atualizado para: ${status}`, type: 'success' });
  };

  // Settings
  const updateSettings = (updates: Partial<GlobalSettings>) => {
    const updated = { ...settings, ...updates };
    setSettings(updated);
    saveDocToFirestore('settings', 'global', { id: 'global', ...updated });

    const newLog: AuditLog = {
      id: 'log_' + Date.now(),
      actorId: currentUser?.id || 'admin',
      actorEmail: currentUser?.email || 'almayurnurgi563@gmail.com',
      authorEmail: currentUser?.email || 'almayurnurgi563@gmail.com',
      actorRole: 'SUPER_ADMIN',
      action: 'SETTINGS_UPDATED',
      targetType: 'SYSTEM',
      targetId: 'global_settings',
      details: `Configurações da plataforma atualizadas: ${Object.keys(updates).join(', ')}`,
      timestamp: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };
    setAuditLogs((prev) => [newLog, ...prev]);
    saveDocToFirestore('auditLogs', newLog.id, newLog);
    setFlashBanner({ message: 'Configurações globais salvas!', type: 'success' });
  };

  // Notifications
  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const clearAllNotifications = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const sendReengagementNotification = () => {
    const now = new Date().toISOString();
    const newNotif: NotificationItem = {
      id: 'notif_pwa_' + Date.now(),
      recipientId: 'all',
      title: '📱 Instale a ALMAS-SHOP no seu telemóvel!',
      message: 'Compre com 1 clique, receba avisos de promoções relâmpago e aceda mesmo offline. Toque para instalar.',
      type: 'PWA_PROMPT',
      isRead: false,
      link: '/',
      createdAt: now
    };
    setNotifications((prev) => [newNotif, ...prev]);
    triggerPwaInstall();
    setFlashBanner({
      message: 'Notificação de reengajamento PWA disparada para todos os utilizadores!',
      type: 'success'
    });
  };

  const updateUserBanStatus = (userId: string, isBanned: boolean, reason?: string) => {
    if (isBanned) {
      banUser(userId, reason || 'Suspensão administrativa por segurança.');
    } else {
      unbanUser(userId);
    }
  };

  const approveVendorApplication = (userId: string) => {
    const now = new Date().toISOString();
    const target = users.find((u) => u.id === userId);
    if (target) {
      const updatedUser: User = { ...target, vendorStatus: 'APPROVED', role: 'VENDOR' as const, updatedAt: now };
      setUsers((prev) => prev.map((u) => (u.id === userId ? updatedUser : u)));
      saveDocToFirestore('users', userId, updatedUser);
    }
    addAuditLog('VENDOR_APPROVED', `Vendedor aprovado para publicar produtos: ${userId}`);
  };

  const rejectVendorApplication = (userId: string, reason?: string) => {
    const now = new Date().toISOString();
    const target = users.find((u) => u.id === userId);
    if (target) {
      const updatedUser: User = { ...target, vendorStatus: 'REJECTED', updatedAt: now };
      setUsers((prev) => prev.map((u) => (u.id === userId ? updatedUser : u)));
      saveDocToFirestore('users', userId, updatedUser);
    }
    addAuditLog('VENDOR_REJECTED', `Candidatura de vendedor recusada: ${userId}. Motivo: ${reason || 'Não atendeu aos critérios'}`);
  };

  const updateWithdrawalStatus = (
    withdrawalId: string,
    status: 'APPROVED' | 'REJECTED' | 'PAID',
    notes?: string
  ) => {
    processWithdrawal(withdrawalId, status, notes);
  };

  const addAuditLog = (action: string, details: string) => {
    const now = new Date().toISOString();
    const newLog: AuditLog = {
      id: 'log_' + Date.now(),
      actorId: currentUser?.id || 'admin',
      actorEmail: currentUser?.email || 'almayurnurgi563@gmail.com',
      authorEmail: currentUser?.email || 'almayurnurgi563@gmail.com',
      actorRole: currentUser?.role || 'SUPER_ADMIN',
      action,
      targetType: 'SYSTEM',
      targetId: 'sys',
      details,
      timestamp: now,
      createdAt: now
    };
    setAuditLogs((prev) => [newLog, ...prev]);
    saveDocToFirestore('auditLogs', newLog.id, newLog);
  };

  return (
    <AppContext.Provider
      value={{
        currentPath,
        navigate,
        currentUser,
        setCurrentUser,
        switchUserRole,
        users,
        banUser,
        unbanUser,
        updateUserBanStatus,
        approveVendorApplication,
        rejectVendorApplication,
        registerUser,
        loginUser,
        logoutUser,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        adminModerateProduct,
        stores,
        updateStore,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartTotal,
        cartItemsCount,
        orders,
        placeOrder,
        updateOrderStatus,
        deleteOrder,
        editOrder,
        adminAddOrder,
        resetProductionData,
        wallets,
        withdrawals,
        requestWithdrawal,
        processWithdrawal,
        updateWithdrawalStatus,
        auditLogs,
        addAuditLog,
        settings,
        updateSettings,
        notifications,
        markNotificationAsRead,
        clearAllNotifications,
        emailLogs,
        sendReengagementNotification,
        utmParams,
        pwaPromptEvent,
        triggerPwaInstall,
        isPwaInstallable,
        activeSearchQuery,
        setActiveSearchQuery,
        selectedCategory,
        setSelectedCategory,
        flashBanner,
        setFlashBanner,
        authModalState,
        openAuthModal,
        closeAuthModal,
        isOnline
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
