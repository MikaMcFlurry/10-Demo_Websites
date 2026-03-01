export interface Category {
  id: string
  name: string
  slug: string
  description: string
  productCount: number
  image?: string
}

export interface ProductVariant {
  id: string
  name: string
  size?: string
  color?: string
  sku: string
  price: number
  comparePrice?: number
  stock: number
  weight: number
}

export interface SustainabilityBadge {
  label: string
  icon: string
  description: string
}

export interface Product {
  id: string
  name: string
  slug: string
  category: string
  description: string
  longDescription: string
  variants: ProductVariant[]
  images: string[]
  badges: SustainabilityBadge[]
  rating: number
  reviewCount: number
  materials: string[]
  origin: string
  care: string[]
  featured: boolean
  tags: string[]
  footprintScore: number
}

export interface Review {
  id: string
  productId: string
  author: string
  rating: number
  title: string
  body: string
  date: string
  verified: boolean
}

export interface Coupon {
  code: string
  type: 'percentage' | 'fixed' | 'free_shipping'
  value: number
  description: string
  minOrder?: number
}

export interface ShippingZone {
  id: string
  name: string
  countries: string[]
  days: string
  baseRate: number
  perKg: number
  free_threshold: number
}

export interface OrderItem {
  productId: string
  variantId: string
  name: string
  price: number
  quantity: number
  weight: number
}

export interface OrderTimestamp {
  status: string
  timestamp: string
}

export interface Order {
  id: string
  items: OrderItem[]
  subtotal: number
  shipping: number
  discount: number
  total: number
  status: string
  createdAt: string
  address: AddressForm
  timeline: OrderTimestamp[]
}

export interface CartItem {
  productId: string
  variantId: string
  name: string
  price: number
  quantity: number
  weight: number
  slug: string
  variantName?: string
}

export interface AddressForm {
  firstName: string
  lastName: string
  email: string
  phone: string
  address1: string
  address2: string
  city: string
  state: string
  postalCode: string
  country: string
}

export interface PaymentForm {
  cardNumber: string
  expiry: string
  cvc: string
  nameOnCard: string
  sameAsShipping: boolean
}
