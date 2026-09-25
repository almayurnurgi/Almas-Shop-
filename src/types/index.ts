export type UserRole = 'CUSTOMER' | 'VENDOR' | 'ADMIN' | 'SUPER_ADMIN';

export type ProductStatus = 'ACTIVE' | 'INACTIVE' | 'DRAFT' | 'PENDING' | 'REJECTED' | 'OUT_OF_STOCK';
export type ProductType = 'PHYSICAL' | 'DIGITAL';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  password?: string;
  adminLevel?: 'SUPER_ADMIN' | 'CEO' | 'SUPPORT';
  permissions?: string[];
  createdByAdminId?: string;
  storeId?: string;
  vendorStatus?: 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED';
  isBanned: boolean;
  banReason?: string;
  bannedAt?: string;
  bannedBy?: string;
  twoFactorEnabled?: boolean;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StoreSection {
  id: string;
  type: string;
  title: string;
  enabled?: boolean;
  isVisible?: boolean;
  order: number;
}

export type StoreSectionConfig = StoreSection;

export interface Store {
  id: string;
  vendorId: string;
  name: string;
  slug: string;
  slogan?: string;
  description?: string;
  logo?: string;
  logoUrl?: string;
  coverImage?: string;
  banner?: string;
  bannerUrl?: string;
  phone: string;
  whatsapp?: string;
  email?: string;
  address?: string;
  city?: string;
  isVerified: boolean;
  commissionRate?: number; // e.g. 5%
  sections?: StoreSection[];
  rating?: number;
  salesCount?: number;
  totalSales?: number;
  metaPixelId?: string;
  tiktokPixelId?: string;
  googleAnalyticsId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductVariant {
  id: string;
  name: string; // e.g. "Preto - 256GB"
  sku: string;
  price: number;
  stock: number;
  imageUrl?: string;
}

export type ProductFaqItem = { question: string; answer: string };

export interface Product {
  id: string;
  vendorId: string;
  storeId?: string;
  storeName: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  images: string[];
  videoUrl?: string;
  regularPrice: number; // Preço DE
  salePrice: number;    // Preço POR
  discountPercent: number;
  stock: number;
  sku: string;
  weight?: string;
  weightKg?: number;
  dimensions?: string;
  type: ProductType;
  digitalFileUrl?: string;
  digitalDownloadUrl?: string;
  status: ProductStatus;
  variants: ProductVariant[];
  tags: string[];
  isFeatured: boolean;
  isNew: boolean;
  isBestSeller: boolean;
  faq: ProductFaqItem[];
  rating: number;
  reviewsCount: number;
  freeShippingLocations?: string[];
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: string;
  productId: string;
  variantId?: string;
  variantName?: string;
  name: string;
  price: number;
  regularPrice: number;
  quantity: number;
  image: string;
  storeId: string;
  storeName: string;
  type: ProductType;
}

export type OrderStatus = 'PENDING' | 'PREPARING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
export type PaymentMethod = 'CASH_ON_DELIVERY' | 'COD_MZN' | 'MPESA' | 'EMOLA' | 'ESCALEPAY';

export interface OrderAddress {
  fullName: string;
  phone: string;
  alternativePhone?: string;
  province: string;
  city: string;
  neighborhood: string; // Bairro
  street: string;
  referencePoint: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  variantName?: string;
  price: number;
  quantity: number;
  storeId: string;
  storeName: string;
  type?: ProductType;
  digitalDownloadUrl?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  shippingAddress: OrderAddress;
  address?: OrderAddress; // Compatibility alias
  items: OrderItem[];
  subtotal: number;
  shippingCost: number; // 0 for Maputo/Matola
  totalAmount: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  vendorIds: string[];
  isDigital?: boolean;
  digitalDownloadUrl?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WalletTransaction {
  id: string;
  walletId: string;
  amount: number;
  type: 'SALE' | 'COMMISSION' | 'WITHDRAWAL' | 'REFUND';
  description: string;
  orderId?: string;
  createdAt: string;
}

export interface Wallet {
  vendorId: string;
  availableBalance: number;
  pendingBalance: number;
  totalSales: number;
  totalCommissions: number;
  totalWithdrawn: number;
  transactions: WalletTransaction[];
  updatedAt: string;
}

export type WithdrawalStatus = 'PENDING' | 'IN_REVIEW' | 'APPROVED' | 'PAID' | 'REJECTED';

export interface Withdrawal {
  id: string;
  vendorId: string;
  storeName: string;
  amount: number;
  method: 'MPESA' | 'EMOLA' | 'BANK';
  accountDetails: {
    holderName: string;
    phoneNumber?: string;
    bankName?: string;
    accountNumber?: string;
    ibanNIB?: string;
  };
  status: WithdrawalStatus;
  requestedAt: string;
  processedAt?: string;
  notes?: string;
  processedBy?: string;
}

export type WithdrawalRequest = Withdrawal;

export interface AuditLog {
  id: string;
  actorId: string;
  actorEmail: string;
  authorEmail?: string;
  actorRole: UserRole;
  action: string;
  targetType: 'USER' | 'PRODUCT' | 'STORE' | 'ORDER' | 'WITHDRAWAL' | 'SYSTEM';
  targetId: string;
  details: string;
  reason?: string;
  timestamp?: string;
  createdAt: string;
}

export interface Review {
  id: string;
  productId: string;
  customerName: string;
  customerLocation: string;
  rating: number;
  comment: string;
  images?: string[];
  date: string;
  verified: boolean;
}

export interface NotificationItem {
  id: string;
  recipientId: string; // user id or 'all' or 'vendors'
  recipientRole?: UserRole;
  title: string;
  message: string;
  type: 'NEW_SALE' | 'ORDER_UPDATE' | 'WITHDRAWAL' | 'ACCOUNT' | 'ACCOUNT_STATUS' | 'SYSTEM' | 'PWA_PROMPT';
  isRead: boolean;
  link?: string;
  createdAt: string;
}

export interface SmtpConfig {
  senderName: string;
  senderEmail: string;
  supportEmail: string;
  smtpHost: string;
  smtpPort: number;
  username: string;
  hasPasswordConfigured: boolean;
  secure: boolean;
  provider: string;
  status: 'ACTIVE' | 'TESTING' | 'DISABLED';
}

export interface HeroBannerItem {
  id: string;
  badge: string;
  badgeText?: string;
  title: string;
  subtitle: string;
  ctaText: string;
  imageUrl: string;
  link?: string;
  ctaLink?: string;
}

export interface GlobalSettings {
  commissionRate: number; // default 5%
  platformCommissionRate?: number;
  freeShippingCities: string[];
  supportPhone: string;
  supportEmail: string;
  supportWhatsapp: string;
  mpesaMerchantPhone: string;
  smtpConfig: SmtpConfig;
  platformLogo: string;
  maintenanceMode: boolean;
  soundAlertEnabled: boolean;
  heroBanners?: HeroBannerItem[];
}

export interface UTMParams {
  source?: string;
  medium?: string;
  campaign?: string;
  content?: string;
  term?: string;
}
