import { defineStore } from 'pinia'
import type { CartItem, Coupon } from '../data/types'
import { COUPONS } from '../data/products'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[],
    couponCode: '',
    couponApplied: null as Coupon | null,
    isOpen: false,
  }),

  getters: {
    itemCount: (state): number => {
      return state.items.reduce((sum, item) => sum + item.quantity, 0)
    },

    subtotal: (state): number => {
      return state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    },

    totalWeight: (state): number => {
      return state.items.reduce((sum, item) => sum + item.weight * item.quantity, 0)
    },

    shippingCost(): number {
      const sub = this.subtotal as number
      return sub >= 50 ? 0 : 4.99
    },

    discount(): number {
      const sub = this.subtotal as number
      if (!this.couponApplied) return 0
      const coupon = this.couponApplied as Coupon
      if (coupon.minOrder && sub < coupon.minOrder) return 0
      if (coupon.type === 'percentage') {
        return Math.round(sub * (coupon.value / 100) * 100) / 100
      }
      if (coupon.type === 'fixed') {
        return Math.min(coupon.value, sub)
      }
      if (coupon.type === 'free_shipping') {
        return this.shippingCost as number
      }
      return 0
    },

    total(): number {
      const sub = this.subtotal as number
      const shipping = this.shippingCost as number
      const disc = this.discount as number
      return Math.max(0, Math.round((sub + shipping - disc) * 100) / 100)
    },
  },

  actions: {
    addItem(
      productId: string,
      variantId: string,
      name: string,
      price: number,
      quantity: number,
      weight: number,
      slug: string,
      variantName?: string,
    ) {
      const existing = this.items.find((i) => i.variantId === variantId)
      if (existing) {
        existing.quantity += quantity
      } else {
        this.items.push({ productId, variantId, name, price, quantity, weight, slug, variantName })
      }
    },

    removeItem(variantId: string) {
      this.items = this.items.filter((i) => i.variantId !== variantId)
    },

    updateQty(variantId: string, qty: number) {
      const item = this.items.find((i) => i.variantId === variantId)
      if (item) {
        if (qty <= 0) {
          this.removeItem(variantId)
        } else {
          item.quantity = qty
        }
      }
    },

    applyCoupon(code: string): boolean {
      const found = COUPONS.find((c) => c.code === code.trim().toUpperCase())
      if (found) {
        this.couponApplied = found
        this.couponCode = found.code
        return true
      }
      return false
    },

    removeCoupon() {
      this.couponApplied = null
      this.couponCode = ''
    },

    clearCart() {
      this.items = []
      this.couponApplied = null
      this.couponCode = ''
    },

    openCart() {
      this.isOpen = true
    },

    closeCart() {
      this.isOpen = false
    },
  },
})
