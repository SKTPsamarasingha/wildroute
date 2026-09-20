export type PaymentMethod = 'card' | 'mintpay' | 'kokopay' | 'cod' | 'bank_transfer';
export type OrderStatus = 'pending' | 'processing' | 'dispatched' | 'completed' | 'cancelled';

export interface ProductVariant {
  size?: string;
  color?: string;
  sku?: string;
  priceModifier?: number;
  stock: number;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  subCategory?: string;
  images: string[];
  stock: number;
  sizes?: string[];
  colors?: string[];
  weight?: string;
  variants?: ProductVariant[];
  featured?: boolean;
  rating?: number;
  reviewCount?: number;
  createdAt?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image: string;
}

export interface CartItem {
  id: string; // product id or unique cart item id
  productId: string;
  title: string;
  price: number;
  image: string;
  selectedSize?: string;
  selectedColor?: string;
  quantity: number;
  maxStock: number;
}

export interface CustomerDetails {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  postalCode?: string;
  notes?: string;
}

export interface CardDetails {
  cardNumber: string;
  cardHolder: string;
  expiry: string;
  cvv: string;
}

export interface OrderItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
  image: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  customer: CustomerDetails;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'pending' | 'paid' | 'failed';
  orderStatus: OrderStatus;
  createdAt: string;
  fulfillmentNotes?: string;
  cardDetailsPreview?: string; // e.g., "**** 4242"
}
