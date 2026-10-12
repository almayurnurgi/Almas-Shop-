import { GlobalSettings, Order, Product, Review, Store, User, Wallet, Withdrawal, AuditLog } from '../types';

export const INITIAL_SETTINGS: GlobalSettings = {
  commissionRate: 5,
  freeShippingCities: ['Maputo', 'Matola'],
  supportPhone: '843456786',
  supportEmail: 'yuriscandarnurgi@gmail.com',
  supportWhatsapp: '+258 83 546 6322',
  mpesaMerchantPhone: '843456786',
  platformLogo: '/logo.svg',
  maintenanceMode: false,
  soundAlertEnabled: true,
  heroBanners: [
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
  ],
  smtpConfig: {
    senderName: 'ALMAS-SHOP Moçambique',
    senderEmail: 'suporte@almas-shop.co.mz',
    supportEmail: 'yuriscandarnurgi@gmail.com',
    smtpHost: 'smtp.sendgrid.net',
    smtpPort: 587,
    username: 'apikey',
    hasPasswordConfigured: true,
    secure: true,
    provider: 'SendGrid / SMTP Pro',
    status: 'ACTIVE'
  }
};

export const INITIAL_USERS: User[] = [
  {
    id: 'user_admin_1',
    name: 'Chefe Almayur Nurgi',
    email: 'almayurnurgi563@gmail.com',
    phone: '843456786',
    role: 'SUPER_ADMIN',
    password: 'Te@momae',
    adminLevel: 'SUPER_ADMIN',
    isBanned: false,
    twoFactorEnabled: false,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    createdAt: '2026-09-01T08:00:00Z',
    updatedAt: '2026-09-24T00:00:00Z'
  }
];

export const INITIAL_STORES: Store[] = [];

export const INITIAL_PRODUCTS: Product[] = [];

export const INITIAL_ORDERS: Order[] = [];

export const INITIAL_WALLETS: Record<string, Wallet> = {};

export const INITIAL_WITHDRAWALS: Withdrawal[] = [];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log_init',
    actorId: 'user_admin_1',
    actorEmail: 'almayurnurgi563@gmail.com',
    actorRole: 'SUPER_ADMIN',
    action: 'PLATFORM_INITIALIZATION',
    targetType: 'SYSTEM',
    targetId: 'almas_shop_mz',
    details: 'Plataforma ALMAS-SHOP inicializada e zerada para produção oficial.',
    createdAt: new Date().toISOString()
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev_1',
    productId: 'prod_1',
    customerName: 'Júlio Cossa',
    customerLocation: 'Maputo Cidade',
    rating: 5,
    comment: 'Recebi no mesmo dia no bairro Central! O relógio é impecável, atendi chamadas de imediato e o estafeta foi muito educado. Recomendo a ALMAS-SHOP.',
    date: '14 de Setembro de 2026',
    verified: true
  },
  {
    id: 'rev_2',
    productId: 'prod_1',
    customerName: 'Inês Mondlane',
    customerLocation: 'Matola Fomento',
    rating: 5,
    comment: 'Excelente qualidade, a bateria dura mesmo dias. Adorei o facto de pagar só na entrega!',
    date: '12 de Setembro de 2026',
    verified: true
  },
  {
    id: 'rev_3',
    productId: 'prod_3',
    customerName: 'Catarina Tembe',
    customerLocation: 'Sommerschield, Maputo',
    rating: 5,
    comment: 'Perfume muito marcante e com fixação absurda! Todos no trabalho perguntaram o nome. Produto 100% original.',
    date: '16 de Setembro de 2026',
    verified: true
  }
];
