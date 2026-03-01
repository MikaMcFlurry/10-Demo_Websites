<template>
  <header
    class="fixed top-0 left-0 right-0 z-50 bg-cream transition-shadow duration-300"
    :class="{ 'shadow-md': scrolled }"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center gap-2 group">
          <span class="text-2xl leading-none select-none">🌿</span>
          <span class="text-xl font-bold text-forest tracking-tight group-hover:text-leaf transition-colors">
            GreenCart
          </span>
        </NuxtLink>

        <!-- Desktop Navigation -->
        <nav class="hidden md:flex items-center gap-8" aria-label="Main navigation">
          <NuxtLink
            to="/"
            class="text-gc-text font-medium hover:text-leaf transition-colors text-sm"
            active-class="text-leaf"
          >
            Home
          </NuxtLink>
          <NuxtLink
            to="/category/kitchen-home"
            class="text-gc-text font-medium hover:text-leaf transition-colors text-sm"
            active-class="text-leaf"
          >
            Shop
          </NuxtLink>
          <NuxtLink
            to="/#about"
            class="text-gc-text font-medium hover:text-leaf transition-colors text-sm"
          >
            About
          </NuxtLink>
        </nav>

        <!-- Right side actions -->
        <div class="flex items-center gap-3">
          <!-- Cart button -->
          <button
            @click="cartStore.openCart()"
            class="relative flex items-center gap-2 bg-forest text-cream px-4 py-2 rounded-lg text-sm font-semibold hover:bg-leaf transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf"
            aria-label="Open cart"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span class="hidden sm:inline">Cart</span>
            <span
              v-if="cartStore.itemCount > 0"
              class="absolute -top-2 -right-2 bg-sun text-gc-text text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center leading-none"
            >
              {{ cartStore.itemCount > 99 ? '99+' : cartStore.itemCount }}
            </span>
          </button>

          <!-- Mobile hamburger -->
          <button
            @click="mobileOpen = !mobileOpen"
            class="md:hidden p-2 rounded-lg text-forest hover:bg-line transition-colors"
            :aria-expanded="mobileOpen"
            aria-label="Toggle mobile menu"
          >
            <svg v-if="!mobileOpen" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile menu -->
    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div v-if="mobileOpen" class="md:hidden border-t border-line bg-cream">
        <nav class="px-4 py-3 flex flex-col gap-1" aria-label="Mobile navigation">
          <NuxtLink
            to="/"
            @click="mobileOpen = false"
            class="block py-2.5 px-3 rounded-lg text-gc-text font-medium hover:bg-line hover:text-forest transition-colors"
            active-class="bg-line text-forest"
          >
            Home
          </NuxtLink>
          <NuxtLink
            to="/category/kitchen-home"
            @click="mobileOpen = false"
            class="block py-2.5 px-3 rounded-lg text-gc-text font-medium hover:bg-line hover:text-forest transition-colors"
            active-class="bg-line text-forest"
          >
            Shop
          </NuxtLink>
          <NuxtLink
            to="/#about"
            @click="mobileOpen = false"
            class="block py-2.5 px-3 rounded-lg text-gc-text font-medium hover:bg-line hover:text-forest transition-colors"
          >
            About
          </NuxtLink>
        </nav>
      </div>
    </Transition>
  </header>
</template>

<script setup lang="ts">
import { useCartStore } from '~/stores/cart'

const cartStore = useCartStore()
const scrolled = ref(false)
const mobileOpen = ref(false)

const handleScroll = () => {
  scrolled.value = window.scrollY > 8
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>
