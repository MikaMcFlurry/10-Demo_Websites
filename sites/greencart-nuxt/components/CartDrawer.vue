<template>
  <!-- Backdrop -->
  <Transition
    enter-active-class="transition-opacity duration-300"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-opacity duration-200"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="cartStore.isOpen"
      class="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm"
      @click="cartStore.closeCart()"
      aria-hidden="true"
    ></div>
  </Transition>

  <!-- Drawer panel -->
  <Transition
    enter-active-class="transition-transform duration-300 ease-out"
    enter-from-class="translate-x-full"
    enter-to-class="translate-x-0"
    leave-active-class="transition-transform duration-200 ease-in"
    leave-from-class="translate-x-0"
    leave-to-class="translate-x-full"
  >
    <div
      v-if="cartStore.isOpen"
      class="fixed right-0 top-0 h-full w-full max-w-md bg-cream shadow-2xl z-50 flex flex-col"
      role="dialog"
      aria-modal="true"
      aria-label="Shopping cart"
    >
      <!-- Header -->
      <div class="flex items-center justify-between px-5 py-4 border-b border-line bg-white">
        <div class="flex items-center gap-2">
          <span class="text-xl">🛒</span>
          <h2 class="text-lg font-bold text-forest">Your Cart</h2>
          <span
            v-if="cartStore.itemCount > 0"
            class="bg-forest text-cream text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
          >
            {{ cartStore.itemCount }}
          </span>
        </div>
        <button
          @click="cartStore.closeCart()"
          class="p-2 rounded-lg text-gc-text/60 hover:text-forest hover:bg-line transition-colors"
          aria-label="Close cart"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Empty state -->
      <div v-if="cartStore.items.length === 0" class="flex-1 flex flex-col items-center justify-center gap-4 px-6 text-center">
        <div class="w-20 h-20 rounded-full bg-line flex items-center justify-center">
          <svg class="w-9 h-9 text-gc-text/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <div>
          <p class="text-lg font-semibold text-forest mb-1">Your cart is empty</p>
          <p class="text-sm text-gc-text/60">Add some sustainable goodies to get started.</p>
        </div>
        <button
          @click="cartStore.closeCart()"
          class="btn-primary mt-2"
        >
          Continue shopping
        </button>
      </div>

      <!-- Cart items -->
      <div v-else class="flex-1 overflow-y-auto">
        <ul class="divide-y divide-line" role="list">
          <li
            v-for="item in cartStore.items"
            :key="item.variantId"
            class="flex gap-4 px-5 py-4"
          >
            <!-- Product image placeholder -->
            <div class="w-16 h-16 rounded-lg bg-gradient-to-br from-moss to-leaf flex-shrink-0 flex items-center justify-center">
              <span class="text-xl opacity-50">🌿</span>
            </div>

            <!-- Item details -->
            <div class="flex-1 min-w-0">
              <NuxtLink
                :to="`/product/${item.slug}`"
                @click="cartStore.closeCart()"
                class="text-sm font-semibold text-gc-text hover:text-forest transition-colors line-clamp-1"
              >
                {{ item.name }}
              </NuxtLink>
              <p v-if="item.variantName" class="text-xs text-gc-text/50 mt-0.5">{{ item.variantName }}</p>

              <!-- Qty controls -->
              <div class="flex items-center gap-3 mt-2">
                <div class="flex items-center rounded-lg border border-line overflow-hidden">
                  <button
                    @click="cartStore.updateQty(item.variantId, item.quantity - 1)"
                    class="w-7 h-7 flex items-center justify-center text-forest hover:bg-line transition-colors text-sm font-bold"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span class="w-8 text-center text-sm font-semibold text-gc-text select-none">
                    {{ item.quantity }}
                  </span>
                  <button
                    @click="cartStore.updateQty(item.variantId, item.quantity + 1)"
                    class="w-7 h-7 flex items-center justify-center text-forest hover:bg-line transition-colors text-sm font-bold"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                <button
                  @click="cartStore.removeItem(item.variantId)"
                  class="text-xs text-gc-text/40 hover:text-clay transition-colors"
                  aria-label="Remove item"
                >
                  Remove
                </button>
              </div>
            </div>

            <!-- Item price -->
            <div class="text-right flex-shrink-0">
              <p class="text-sm font-bold text-forest">${{ (item.price * item.quantity).toFixed(2) }}</p>
              <p class="text-xs text-gc-text/40 mt-0.5">${{ item.price.toFixed(2) }} each</p>
            </div>
          </li>
        </ul>
      </div>

      <!-- Footer with totals + checkout -->
      <div v-if="cartStore.items.length > 0" class="border-t border-line bg-white px-5 py-4 space-y-3">
        <!-- Coupon input -->
        <div class="flex gap-2">
          <input
            v-model="couponInput"
            type="text"
            placeholder="Coupon code"
            class="flex-1 border border-line rounded-lg px-3 py-2 text-sm bg-cream focus:outline-none focus:ring-2 focus:ring-leaf text-gc-text placeholder:text-gc-text/40 uppercase"
            @keyup.enter="applyCode"
            :disabled="!!cartStore.couponApplied"
          />
          <button
            v-if="!cartStore.couponApplied"
            @click="applyCode"
            class="px-3 py-2 bg-forest text-cream text-sm font-semibold rounded-lg hover:bg-leaf transition-colors"
          >
            Apply
          </button>
          <button
            v-else
            @click="removeCoupon"
            class="px-3 py-2 border border-clay text-clay text-sm font-semibold rounded-lg hover:bg-clay hover:text-white transition-colors"
          >
            Remove
          </button>
        </div>

        <div v-if="couponError" class="text-xs text-clay font-medium">{{ couponError }}</div>
        <div v-if="cartStore.couponApplied" class="text-xs text-leaf font-medium flex items-center gap-1">
          <span>✅</span>
          <span>{{ cartStore.couponApplied.description }}</span>
        </div>

        <!-- Totals -->
        <div class="space-y-1.5 text-sm">
          <div class="flex justify-between text-gc-text/70">
            <span>Subtotal</span>
            <span>${{ cartStore.subtotal.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between text-gc-text/70">
            <span>Shipping</span>
            <span>
              <span v-if="cartStore.shippingCost === 0" class="text-leaf font-medium">Free</span>
              <span v-else>${{ cartStore.shippingCost.toFixed(2) }}</span>
            </span>
          </div>
          <div v-if="cartStore.discount > 0" class="flex justify-between text-leaf">
            <span>Discount ({{ cartStore.couponApplied?.code }})</span>
            <span>−${{ cartStore.discount.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between font-bold text-base text-forest border-t border-line pt-2 mt-2">
            <span>Total</span>
            <span>${{ cartStore.total.toFixed(2) }}</span>
          </div>
        </div>

        <!-- Free shipping nudge -->
        <div v-if="cartStore.subtotal < 50 && cartStore.subtotal > 0" class="text-xs text-gc-text/60 bg-cream rounded-lg px-3 py-2">
          Add <strong class="text-forest">${{ (50 - cartStore.subtotal).toFixed(2) }}</strong> more to unlock free shipping 🌱
        </div>

        <!-- Checkout button -->
        <NuxtLink
          to="/orders"
          @click="cartStore.closeCart()"
          class="block w-full text-center bg-forest text-cream font-bold py-3 rounded-lg hover:bg-leaf transition-colors text-base"
        >
          Checkout · ${{ cartStore.total.toFixed(2) }}
        </NuxtLink>

        <p class="text-xs text-center text-gc-text/40">
          Carbon-neutral shipping · Compostable packaging
        </p>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { useCartStore } from '~/stores/cart'

const cartStore = useCartStore()
const couponInput = ref('')
const couponError = ref('')

function applyCode() {
  couponError.value = ''
  const success = cartStore.applyCoupon(couponInput.value)
  if (!success) {
    couponError.value = 'Invalid coupon code. Try GREEN10 or FIRSTORDER.'
  } else {
    couponInput.value = ''
  }
}

function removeCoupon() {
  cartStore.removeCoupon()
  couponInput.value = ''
  couponError.value = ''
}
</script>
