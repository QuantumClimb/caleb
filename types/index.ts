// Product Types
export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  category: string;
  subcategory: string;
  platform: string[];
  region: string;
  digital: boolean;
  inStock: boolean;
  stockCount: number;
  images: string[];
  tags: string[];
  rating: number;
  reviews: number;
  seller: string;
  deliveryTime: string;
  requirements?: {
    minimum: string;
    recommended: string;
  };
  features: string[];
  createdAt: string;
  updatedAt: string;
}

export interface SystemRequirements {
  minimum: string;
  recommended: string;
}

export type ProductCategory = 'Games' | 'Gift Cards' | 'Top-ups' | 'Subscriptions';
export type Platform = 'PC' | 'PlayStation' | 'Xbox' | 'Nintendo Switch' | 'Mobile';

// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  preferences?: {
    currency: string;
    language: string;
    theme: 'dark' | 'light';
    notifications: {
      email: boolean;
      push: boolean;
      priceAlerts: boolean;
    };
  };
  wishlist: string[];
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferences {
  platform: Platform[];
  categories: ProductCategory[];
  region: string;
  currency: string;
  notifications: NotificationSettings;
}

export interface NotificationSettings {
  email: boolean;
  promotions: boolean;
  orderUpdates: boolean;
}

export interface Address {
  id: string;
  type: 'billing' | 'shipping';
  name: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'crypto';
  last4?: string;
  brand?: string;
  isDefault: boolean;
}

export type UserRole = 'customer' | 'admin' | 'seller';

// Cart Types
export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
  subtotal: number;
  tax: number;
  shipping: number;
}

// Order Types
export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  productId: string;
  title: string;
  quantity: number;
  price: number;
  discount: number;
  subtotal: number;
  digitalCode?: string;
  deliveredAt?: string;
}

export interface OrderPricing {
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
}

export interface CustomerInfo {
  name: string;
  email: string;
}

export interface PaymentInfo {
  method: 'card' | 'paypal' | 'crypto';
  last4?: string;
  brand?: string;
  stripePaymentIntentId?: string;
  paypalOrderId?: string;
}

export interface OrderSummary {
  id: string;
  date: string;
  status: OrderStatus;
  total: number;
  items: {
    productId: string;
    quantity: number;
    price: number;
  }[];
}

export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled' | 'refunded';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type DeliveryStatus = 'pending' | 'processing' | 'delivered' | 'failed';

// Search Types
export interface SearchFilters {
  category?: string;
  subcategory?: string;
  platform?: string[];
  priceRange?: {
    min: number;
    max: number;
  };
  region?: string;
  inStock?: boolean;
  discount?: boolean;
  tags?: string[];
}

export type SortOption = 'price' | 'rating' | 'reviews' | 'date' | 'popularity' | 'discount';

export interface SearchResult {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
  filters: SearchFilters;
}

// Coupon Types
export interface Coupon {
  code: string;
  type: 'percentage' | 'fixed' | 'shipping';
  value: number;
  minimumOrder?: number;
  expiresAt: string;
  usageLimit?: number;
  usedCount: number;
  isActive: boolean;
}

// API Response Types
export interface APIResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Auth Types
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  isVerified: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Stripe Types
export interface StripePaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: string;
  clientSecret: string;
}

// Analytics Types
export interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  conversionRate: number;
  topProducts: Product[];
  recentOrders: Order[];
  userGrowth: number;
  salesGrowth: number;
} 