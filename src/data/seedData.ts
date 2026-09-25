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
    twoFactorEnabled: true,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    createdAt: '2026-01-10T08:00:00Z',
    updatedAt: '2026-09-18T07:00:00Z'
  }
];

export const INITIAL_STORES: Store[] = [
  {
    id: 'store_1',
    vendorId: 'user_vendor_1',
    name: 'Maputo Tech & Gadgets',
    slug: 'maputo-tech-gadgets',
    slogan: 'Tecnologia de ponta com garantia em Moçambique',
    logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&auto=format&fit=crop&q=80',
    phone: '841234567',
    email: 'edson.tech@gmail.com',
    address: 'Av. Eduardo Mondlane, Centro, Maputo',
    isVerified: true,
    commissionRate: 5,
    rating: 4.9,
    salesCount: 184,
    sections: [
      { id: 'sec_1', type: 'banner', title: 'Banner Principal', enabled: true, order: 1 },
      { id: 'sec_2', type: 'deals', title: 'Super Promoções da Semana', enabled: true, order: 2 },
      { id: 'sec_3', type: 'best_sellers', title: 'Mais Vendidos em Maputo', enabled: true, order: 3 },
      { id: 'sec_4', type: 'categories', title: 'Navegue por Categorias', enabled: true, order: 4 }
    ],
    createdAt: '2026-02-15T10:30:00Z',
    updatedAt: '2026-09-17T14:00:00Z'
  },
  {
    id: 'store_2',
    vendorId: 'user_vendor_2',
    name: 'Moda & Essência Maputo',
    slug: 'moda-essencia-maputo',
    slogan: 'Perfumes árabes importados, relógios e estilo premium',
    logo: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=200&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&auto=format&fit=crop&q=80',
    phone: '849876543',
    email: 'fatima.essencia@gmail.com',
    address: 'Bairro Sommerschield, Maputo',
    isVerified: true,
    commissionRate: 5,
    rating: 4.8,
    salesCount: 97,
    sections: [
      { id: 'sec_21', type: 'banner', title: 'Lançamentos Perfumaria', enabled: true, order: 1 },
      { id: 'sec_22', type: 'featured', title: 'Destaques de Luxo', enabled: true, order: 2 },
      { id: 'sec_23', type: 'deals', title: 'Ofertas Imperdíveis', enabled: true, order: 3 }
    ],
    createdAt: '2026-03-01T14:10:00Z',
    updatedAt: '2026-09-16T18:00:00Z'
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod_1',
    vendorId: 'user_vendor_1',
    storeName: 'Maputo Tech & Gadgets',
    name: 'Smartwatch Ultra 2 com Chamadas Bluetooth & Monitor Cardíaco',
    slug: 'smartwatch-ultra-2-pro',
    description: 'O Smartwatch mais vendido em Moçambique! Receba e faça chamadas directas no pulso, notificações de WhatsApp, rastreamento desportivo completo e bateria de até 5 dias. Compatível com Android e iPhone.',
    category: 'Informática & Eletrónicos',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=80'
    ],
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    regularPrice: 3800,
    salePrice: 2650,
    discountPercent: 30,
    stock: 45,
    sku: 'WATCH-ULTRA-01',
    type: 'PHYSICAL',
    status: 'ACTIVE',
    variants: [
      { id: 'var_1', name: 'Preto Titânio (Brinde: Pulseira extra)', sku: 'WATCH-BLK', price: 2650, stock: 25 },
      { id: 'var_2', name: 'Laranja Adventure', sku: 'WATCH-ORG', price: 2750, stock: 20 }
    ],
    tags: ['smartwatch', 'tecnologia', 'moçambique', 'maputo', 'promoção'],
    isFeatured: true,
    isNew: true,
    isBestSeller: true,
    faq: [
      { question: 'Funciona com qualquer telemóvel?', answer: 'Sim, compatível com todos telemóveis Android e iPhone via Bluetooth.' },
      { question: 'A entrega é grátis em Maputo e Matola?', answer: 'Sim! Entregamos gratuitamente no mesmo dia ou em até 24h em Maputo e Matola com pagamento no acto da entrega.' },
      { question: 'Tem garantia?', answer: 'Sim, garantia total de 90 dias com troca imediata pela ALMAS-SHOP.' }
    ],
    rating: 4.9,
    reviewsCount: 38,
    createdAt: '2026-08-01T10:00:00Z',
    updatedAt: '2026-09-17T09:00:00Z'
  },
  {
    id: 'prod_2',
    vendorId: 'user_vendor_1',
    storeName: 'Maputo Tech & Gadgets',
    name: 'Fones de Ouvido Sem Fio Pro ANC Cancelamento Ativo de Ruído',
    slug: 'fones-pro-anc-bluetooth',
    description: 'Som imersivo de alta definição com cancelamento de ruído ativo. Graves potentes, estojo com carregamento rápido e microfones limpos para chamadas de negócios.',
    category: 'Informática & Eletrónicos',
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=800&auto=format&fit=crop&q=80'
    ],
    regularPrice: 2500,
    salePrice: 1750,
    discountPercent: 30,
    stock: 60,
    sku: 'EAR-ANC-02',
    type: 'PHYSICAL',
    status: 'ACTIVE',
    variants: [
      { id: 'var_3', name: 'Branco Pérola', sku: 'EAR-WHT', price: 1750, stock: 35 },
      { id: 'var_4', name: 'Preto Meia-Noite', sku: 'EAR-BLK', price: 1750, stock: 25 }
    ],
    tags: ['audio', 'fones', 'bluetooth', 'musica', 'top'],
    isFeatured: true,
    isNew: false,
    isBestSeller: true,
    faq: [
      { question: 'Quanto tempo dura a bateria?', answer: 'Até 7 horas de reprodução contínua e 28 horas com a caixa de carregamento.' },
      { question: 'Posso pagar na entrega?', answer: 'Com certeza! Paga ao estafeta após receber e testar o produto.' }
    ],
    rating: 4.8,
    reviewsCount: 29,
    createdAt: '2026-08-05T12:00:00Z',
    updatedAt: '2026-09-15T11:00:00Z'
  },
  {
    id: 'prod_3',
    vendorId: 'user_vendor_2',
    storeName: 'Moda & Essência Maputo',
    name: 'Perfume Árabe Imperial Oud 100ml Eau de Parfum Alta Fixação',
    slug: 'perfume-arabe-imperial-oud',
    description: 'Fragrância nobre, envolvente e marcante com notas de âmbar, sândalo e oud autêntico. Fixação superior a 24 horas na pele e roupas.',
    category: 'Moda & Beleza',
    images: [
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=800&auto=format&fit=crop&q=80'
    ],
    regularPrice: 4500,
    salePrice: 3200,
    discountPercent: 29,
    stock: 22,
    sku: 'PERF-OUD-03',
    type: 'PHYSICAL',
    status: 'ACTIVE',
    variants: [
      { id: 'var_5', name: '100ml Edição Ouro', sku: 'OUD-GOLD-100', price: 3200, stock: 15 },
      { id: 'var_6', name: '100ml Edição Silver Black', sku: 'OUD-BLK-100', price: 3400, stock: 7 }
    ],
    tags: ['perfume', 'arabe', 'oud', 'beleza', 'luxo'],
    isFeatured: true,
    isNew: true,
    isBestSeller: true,
    faq: [
      { question: 'É 100% original?', answer: 'Sim, importado directamente de Dubai com selo de autenticidade garantido.' }
    ],
    rating: 5.0,
    reviewsCount: 19,
    createdAt: '2026-08-10T14:00:00Z',
    updatedAt: '2026-09-16T15:00:00Z'
  },
  {
    id: 'prod_4',
    vendorId: 'user_vendor_1',
    storeName: 'Maputo Tech & Gadgets',
    name: 'Guia Completo de Negócios e Vendas Online em Moçambique (E-book + Templates)',
    slug: 'guia-negocios-vendas-online-mocambique',
    description: 'Aprenda como importar produtos, criar anúncios de alta conversão no Facebook/Instagram/TikTok em Moçambique, e automatizar vendas recebendo por M-Pesa e e-Mola. Inclui modelos prontos de copy e fornecedores.',
    category: 'Produtos Digitais',
    images: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80'
    ],
    regularPrice: 1500,
    salePrice: 750,
    discountPercent: 50,
    stock: 999,
    sku: 'DIG-GUIA-04',
    type: 'DIGITAL',
    digitalFileUrl: 'https://almas-shop.co.mz/downloads/guia-vendas-mz.pdf',
    status: 'ACTIVE',
    variants: [],
    tags: ['digital', 'curso', 'ebook', 'empreendedorismo', 'mocambique'],
    isFeatured: false,
    isNew: true,
    isBestSeller: false,
    faq: [
      { question: 'Como recebo o e-book?', answer: 'Acesso imediato para download após a confirmação do pedido na sua área de cliente.' }
    ],
    rating: 4.7,
    reviewsCount: 14,
    createdAt: '2026-08-12T16:00:00Z',
    updatedAt: '2026-09-17T10:00:00Z'
  },
  {
    id: 'prod_digital_2',
    vendorId: 'user_admin_1',
    storeName: 'Livraria Digital ALMAS',
    name: 'E-book: Segredos do Tráfego Pago e Marketing Digital em Moçambique',
    slug: 'ebook-trafego-pago-marketing-mocambique',
    description: 'Manual prático passo a passo para anunciar com sucesso no Facebook Ads, Instagram e TikTok em Moçambique. Métodos comprovados de conversão para e-commerce e serviços locais.',
    category: 'Produtos Digitais',
    images: [
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop&q=80'
    ],
    regularPrice: 1200,
    salePrice: 650,
    discountPercent: 46,
    stock: 9999,
    sku: 'DIG-BOOK-02',
    type: 'DIGITAL',
    digitalFileUrl: 'https://almas-shop.co.mz/downloads/segredos-trafego-pago-mz.pdf',
    status: 'ACTIVE',
    variants: [],
    tags: ['livro digital', 'ebook', 'marketing', 'trafego pago', 'mocambique'],
    isFeatured: true,
    isNew: true,
    isBestSeller: true,
    faq: [
      { question: 'Como recebo o livro?', answer: 'Download imediato via EscalePay e link enviado direto por email e WhatsApp!' }
    ],
    rating: 4.9,
    reviewsCount: 28,
    createdAt: '2026-08-25T10:00:00Z',
    updatedAt: '2026-09-18T12:00:00Z'
  },
  {
    id: 'prod_5',
    vendorId: 'user_vendor_2',
    storeName: 'Moda & Essência Maputo',
    name: 'Kit Barbeador Elétrico Profissional Vintage T9 sem Fio',
    slug: 'barbeador-profissional-vintage-t9',
    description: 'Máquina de cortar cabelo e barba profissional com lâminas de titânio de precisão zero. Bateria recarregável USB com visor digital e 4 pentes de ajuste.',
    category: 'Casa & Decoração',
    images: [
      'https://images.unsplash.com/photo-1621607512214-68297480165e?w=800&auto=format&fit=crop&q=80'
    ],
    regularPrice: 1800,
    salePrice: 1190,
    discountPercent: 34,
    stock: 30,
    sku: 'BARB-T9-05',
    type: 'PHYSICAL',
    status: 'ACTIVE',
    variants: [
      { id: 'var_7', name: 'Dourado Dragão', sku: 'T9-GOLD', price: 1190, stock: 18 },
      { id: 'var_8', name: 'Preto Buda', sku: 'T9-BLK', price: 1190, stock: 12 }
    ],
    tags: ['barba', 'beleza', 'masculino', 'cabelo'],
    isFeatured: false,
    isNew: false,
    isBestSeller: true,
    faq: [
      { question: 'Acompanha carregador?', answer: 'Sim, cabo USB de carregamento rápido e óleo lubrificante para lâminas.' }
    ],
    rating: 4.9,
    reviewsCount: 42,
    createdAt: '2026-08-15T09:00:00Z',
    updatedAt: '2026-09-14T08:00:00Z'
  },
  {
    id: 'prod_6',
    vendorId: 'user_vendor_1',
    storeName: 'Maputo Tech & Gadgets',
    name: 'Lâmpada LED Inteligente RGB com Altifalante Bluetooth',
    slug: 'lampada-led-rgb-bluetooth',
    description: 'Ilumine seu quarto ou sala com 16 milhões de cores enquanto toca suas músicas preferidas directo do telemóvel. Vem com controlo remoto infravermelho.',
    category: 'Casa & Decoração',
    images: [
      'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80'
    ],
    regularPrice: 1200,
    salePrice: 850,
    discountPercent: 29,
    stock: 50,
    sku: 'LAMP-RGB-06',
    type: 'PHYSICAL',
    status: 'ACTIVE',
    variants: [],
    tags: ['casa', 'led', 'musica', 'quarto'],
    isFeatured: false,
    isNew: true,
    isBestSeller: false,
    faq: [
      { question: 'Precisa de aplicativo?', answer: 'Não, conecta-se via Bluetooth padrão e tem controlo remoto incluso.' }
    ],
    rating: 4.6,
    reviewsCount: 16,
    createdAt: '2026-08-20T11:00:00Z',
    updatedAt: '2026-09-15T16:00:00Z'
  }
];

export const INITIAL_ORDERS: Order[] = [];

export const INITIAL_WALLETS: Record<string, Wallet> = {
  user_vendor_1: {
    vendorId: 'user_vendor_1',
    availableBalance: 18450,
    pendingBalance: 5300,
    totalSales: 184000,
    totalCommissions: 9200, // 5%
    totalWithdrawn: 160350,
    updatedAt: '2026-09-18T07:00:00Z',
    transactions: [
      {
        id: 'tx_1',
        walletId: 'w_1',
        amount: 2517.50, // 2650 - 5% commission (132.50)
        type: 'SALE',
        description: 'Venda do Pedido ALM-8492 (Smartwatch Ultra 2)',
        orderId: 'ord_101',
        createdAt: '2026-09-15T15:00:00Z'
      },
      {
        id: 'tx_2',
        walletId: 'w_1',
        amount: -15000,
        type: 'WITHDRAWAL',
        description: 'Levantamento M-Pesa aprovado para 841234567',
        createdAt: '2026-09-10T14:00:00Z'
      }
    ]
  },
  user_vendor_2: {
    vendorId: 'user_vendor_2',
    availableBalance: 9680,
    pendingBalance: 3040,
    totalSales: 89000,
    totalCommissions: 4450,
    totalWithdrawn: 76320,
    updatedAt: '2026-09-18T07:00:00Z',
    transactions: [
      {
        id: 'tx_21',
        walletId: 'w_2',
        amount: 3040, // 3200 - 5% commission (160)
        type: 'SALE',
        description: 'Venda do Pedido ALM-8493 (Perfume Imperial Oud)',
        orderId: 'ord_102',
        createdAt: '2026-09-17T18:40:00Z'
      }
    ]
  }
};

export const INITIAL_WITHDRAWALS: Withdrawal[] = [
  {
    id: 'wdr_1',
    vendorId: 'user_vendor_1',
    storeName: 'Maputo Tech & Gadgets',
    amount: 15000,
    method: 'MPESA',
    accountDetails: {
      holderName: 'Edson Macamo',
      phoneNumber: '841234567'
    },
    status: 'PAID',
    requestedAt: '2026-09-09T10:00:00Z',
    processedAt: '2026-09-10T14:00:00Z',
    processedBy: 'almayurnurgi563@gmail.com',
    notes: 'Transferido com sucesso via M-Pesa'
  },
  {
    id: 'wdr_2',
    vendorId: 'user_vendor_2',
    storeName: 'Moda & Essência Maputo',
    amount: 5000,
    method: 'EMOLA',
    accountDetails: {
      holderName: 'Fátima Nhaduate',
      phoneNumber: '869876543'
    },
    status: 'PENDING',
    requestedAt: '2026-09-17T16:00:00Z',
    notes: 'Aguardando aprovação do Super Admin'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log_1',
    actorId: 'user_admin_1',
    actorEmail: 'almayurnurgi563@gmail.com',
    actorRole: 'SUPER_ADMIN',
    action: 'PLATFORM_INITIALIZATION',
    targetType: 'SYSTEM',
    targetId: 'almas_shop_mz',
    details: 'Configurações do marketplace ALMAS-SHOP inicializadas com sucesso.',
    createdAt: '2026-09-01T08:00:00Z'
  },
  {
    id: 'log_2',
    actorId: 'user_admin_1',
    actorEmail: 'almayurnurgi563@gmail.com',
    actorRole: 'SUPER_ADMIN',
    action: 'WITHDRAWAL_APPROVED',
    targetType: 'WITHDRAWAL',
    targetId: 'wdr_1',
    details: 'Levantamento de 15.000 MT aprovado para o vendedor Edson Macamo (M-Pesa).',
    createdAt: '2026-09-10T14:00:00Z'
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
