<template>
  <div class="pt-16 min-h-screen bg-cream">

    <!-- Success banner -->
    <div class="bg-gradient-to-r from-forest to-leaf text-cream py-10">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 mb-4">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 class="text-3xl font-bold mb-2">Order Delivered!</h1>
        <p class="text-cream/80 text-lg">Thank you for choosing sustainable. Your impact matters.</p>
      </div>
    </div>

    <!-- Order summary -->
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">

      <!-- Order meta header -->
      <div class="bg-white rounded-2xl border border-line p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p class="text-xs font-semibold text-leaf uppercase tracking-widest mb-1">Order reference</p>
          <p class="text-2xl font-bold text-forest font-mono">{{ demoOrder.id }}</p>
        </div>
        <div class="flex flex-wrap gap-6">
          <div>
            <p class="text-xs text-gc-text/50 mb-0.5">Date</p>
            <p class="text-sm font-semibold text-gc-text">{{ formatDate(demoOrder.createdAt) }}</p>
          </div>
          <div>
            <p class="text-xs text-gc-text/50 mb-0.5">Status</p>
            <span class="inline-flex items-center gap-1.5 bg-leaf/10 text-leaf text-sm font-bold px-3 py-1 rounded-full">
              <span class="w-1.5 h-1.5 rounded-full bg-leaf inline-block"></span>
              {{ demoOrder.status }}
            </span>
          </div>
          <div>
            <p class="text-xs text-gc-text/50 mb-0.5">Total</p>
            <p class="text-sm font-bold text-forest">${{ demoOrder.total.toFixed(2) }}</p>
          </div>
        </div>
      </div>

      <!-- Order timeline -->
      <div class="bg-white rounded-2xl border border-line p-6">
        <h2 class="font-bold text-forest text-lg mb-6">Order Timeline</h2>
        <div class="relative">
          <!-- Vertical line -->
          <div class="absolute left-4 top-4 bottom-4 w-0.5 bg-line" aria-hidden="true"></div>

          <div class="space-y-6">
            <div
              v-for="(event, i) in demoOrder.timeline"
              :key="event.status"
              class="relative flex items-start gap-5 pl-12"
            >
              <!-- Step dot -->
              <div
                class="absolute left-0 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-colors"
                :class="i === demoOrder.timeline.length - 1
                  ? 'bg-leaf border-leaf text-white'
                  : 'bg-white border-line'"
              >
                <svg v-if="i < demoOrder.timeline.length - 1" class="w-3.5 h-3.5 text-gc-text/40" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                <svg v-else class="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </div>

              <div>
                <p
                  class="font-semibold"
                  :class="i === demoOrder.timeline.length - 1 ? 'text-forest' : 'text-gc-text/60'"
                >
                  {{ event.status }}
                </p>
                <p class="text-xs text-gc-text/50 mt-0.5">{{ formatDatetime(event.timestamp) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="grid lg:grid-cols-3 gap-6">
        <!-- Items list -->
        <div class="lg:col-span-2 bg-white rounded-2xl border border-line overflow-hidden">
          <div class="px-6 py-4 border-b border-line">
            <h2 class="font-bold text-forest text-lg">Items Ordered</h2>
          </div>
          <ul class="divide-y divide-line" role="list">
            <li
              v-for="item in demoOrder.items"
              :key="item.variantId"
              class="flex items-center gap-4 px-6 py-4"
            >
              <!-- Image placeholder -->
              <div class="w-14 h-14 rounded-lg bg-gradient-to-br from-moss to-leaf flex-shrink-0 flex items-center justify-center">
                <span class="text-xl opacity-50">🌿</span>
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-semibold text-gc-text text-sm leading-snug">{{ item.name }}</p>
                <p class="text-xs text-gc-text/50 mt-0.5">Qty: {{ item.quantity }}</p>
              </div>
              <p class="text-sm font-bold text-forest flex-shrink-0">
                ${{ (item.price * item.quantity).toFixed(2) }}
              </p>
            </li>
          </ul>
        </div>

        <!-- Order totals + shipping -->
        <div class="space-y-4">
          <!-- Totals card -->
          <div class="bg-white rounded-2xl border border-line p-5">
            <h2 class="font-bold text-forest text-base mb-4">Order Summary</h2>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between text-gc-text/70">
                <span>Subtotal</span>
                <span>${{ demoOrder.subtotal.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between text-gc-text/70">
                <span>Shipping</span>
                <span>
                  <span v-if="demoOrder.shipping === 0" class="text-leaf font-medium">Free</span>
                  <span v-else>${{ demoOrder.shipping.toFixed(2) }}</span>
                </span>
              </div>
              <div v-if="demoOrder.discount > 0" class="flex justify-between text-leaf">
                <span>Discount</span>
                <span>−${{ demoOrder.discount.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between font-bold text-forest border-t border-line pt-2 mt-2 text-base">
                <span>Total paid</span>
                <span>${{ demoOrder.total.toFixed(2) }}</span>
              </div>
            </div>
          </div>

          <!-- Delivery address -->
          <div class="bg-white rounded-2xl border border-line p-5">
            <h2 class="font-bold text-forest text-base mb-3">Delivered to</h2>
            <div class="text-sm text-gc-text/80 space-y-0.5">
              <p class="font-semibold text-gc-text">{{ demoOrder.address.firstName }} {{ demoOrder.address.lastName }}</p>
              <p>{{ demoOrder.address.address1 }}</p>
              <p v-if="demoOrder.address.address2">{{ demoOrder.address.address2 }}</p>
              <p>{{ demoOrder.address.city }}, {{ demoOrder.address.state }} {{ demoOrder.address.postalCode }}</p>
              <p>{{ demoOrder.address.country }}</p>
            </div>
          </div>

          <!-- Sustainability summary -->
          <div class="bg-leaf/10 rounded-2xl border border-leaf/30 p-5">
            <h2 class="font-bold text-forest text-sm mb-3 flex items-center gap-2">
              <span>🌱</span> Your impact
            </h2>
            <div class="space-y-2 text-xs text-gc-text/80">
              <div class="flex items-center gap-2">
                <span class="text-leaf">♻️</span>
                <span>Zero plastic packaging used</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-leaf">🌳</span>
                <span>1 tree planted with this order</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-leaf">🌱</span>
                <span>Shipping emissions fully offset</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- CTAs -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center pt-4">
        <NuxtLink to="/" class="btn-primary flex items-center justify-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Continue shopping
        </NuxtLink>
        <button class="btn-secondary flex items-center justify-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download receipt
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Order } from '~/data/types'

const demoOrder: Order = {
  id: 'GC-2025-004821',
  items: [
    {
      productId: 'p5',
      variantId: 'p5-v1',
      name: 'Cast Iron Skillet — 25 cm / 10 inch',
      price: 68,
      quantity: 1,
      weight: 2.5,
    },
    {
      productId: 'p6',
      variantId: 'p6-v1',
      name: 'Stainless Steel Water Bottle — 750 ml Forest Green',
      price: 32,
      quantity: 2,
      weight: 0.32,
    },
    {
      productId: 'p2',
      variantId: 'p2-v1',
      name: 'Beeswax Wraps Pack of 5 — Mixed Pack',
      price: 18,
      quantity: 1,
      weight: 0.15,
    },
  ],
  subtotal: 150,
  shipping: 0,
  discount: 15,
  total: 135,
  status: 'Delivered',
  createdAt: '2025-01-15T09:32:00Z',
  address: {
    firstName: 'Alex',
    lastName: 'Morgan',
    email: 'alex.morgan@example.com',
    phone: '+1 (555) 012-3456',
    address1: '42 Elm Street',
    address2: 'Apt 3B',
    city: 'Portland',
    state: 'OR',
    postalCode: '97201',
    country: 'United States',
  },
  timeline: [
    { status: 'Order placed', timestamp: '2025-01-15T09:32:00Z' },
    { status: 'Payment confirmed', timestamp: '2025-01-15T09:33:11Z' },
    { status: 'Processing at warehouse', timestamp: '2025-01-15T14:05:00Z' },
    { status: 'Shipped — tracking available', timestamp: '2025-01-16T11:20:00Z' },
    { status: 'Delivered', timestamp: '2025-01-20T14:47:00Z' },
  ],
}

function formatDate(isoStr: string): string {
  return new Date(isoStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

function formatDatetime(isoStr: string): string {
  return new Date(isoStr).toLocaleString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: 'numeric', minute: '2-digit',
  })
}

useHead({
  title: 'Order Confirmed — GreenCart',
  meta: [{ name: 'robots', content: 'noindex' }],
})
</script>
