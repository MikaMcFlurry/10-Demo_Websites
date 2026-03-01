<template>
  <footer class="bg-forest text-cream">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-10">
        <!-- Brand column -->
        <div class="md:col-span-1">
          <div class="flex items-center gap-2 mb-4">
            <span class="text-2xl leading-none select-none">🌿</span>
            <span class="text-xl font-bold tracking-tight">GreenCart</span>
          </div>
          <p class="text-moss text-sm leading-relaxed max-w-xs">
            Low-impact everyday goods. Transparent sourcing, durable materials, minimal footprint.
          </p>
          <div class="flex items-center gap-4 mt-6">
            <a href="#" aria-label="GreenCart on Instagram" class="text-moss hover:text-cream transition-colors">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a href="#" aria-label="GreenCart on Twitter" class="text-moss hover:text-cream transition-colors">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
          </div>
        </div>

        <!-- Shop links -->
        <div>
          <h3 class="text-sm font-semibold text-sun uppercase tracking-widest mb-4">Shop</h3>
          <ul class="space-y-2.5">
            <li v-for="link in shopLinks" :key="link.to">
              <NuxtLink :to="link.to" class="text-sm text-moss hover:text-cream transition-colors">
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Company links -->
        <div>
          <h3 class="text-sm font-semibold text-sun uppercase tracking-widest mb-4">Company</h3>
          <ul class="space-y-2.5">
            <li v-for="link in companyLinks" :key="link.to">
              <NuxtLink :to="link.to" class="text-sm text-moss hover:text-cream transition-colors">
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Legal links -->
        <div>
          <h3 class="text-sm font-semibold text-sun uppercase tracking-widest mb-4">Legal</h3>
          <ul class="space-y-2.5">
            <li v-for="link in legalLinks" :key="link.to">
              <NuxtLink :to="link.to" class="text-sm text-moss hover:text-cream transition-colors">
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
          <div class="mt-6 p-3 bg-leaf/20 rounded-lg">
            <p class="text-xs text-moss leading-relaxed">
              We offset 100% of shipping emissions and use compostable packaging across all orders.
            </p>
          </div>
        </div>
      </div>

      <!-- Bottom bar -->
      <div class="mt-12 pt-6 border-t border-leaf/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p class="text-xs text-moss">
          &copy; 2025 GreenCart. All rights reserved.
        </p>
        <div class="flex items-center gap-4 text-xs text-moss">
          <span class="flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-moss inline-block"></span>
            Carbon Neutral Shipping
          </span>
          <span class="flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-sun inline-block"></span>
            B Corp Certified Partners
          </span>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const shopLinks = [
  { label: 'Kitchen & Home', to: '/category/kitchen-home' },
  { label: 'Personal Care', to: '/category/personal-care' },
  { label: 'Outdoor & Garden', to: '/category/outdoor-garden' },
  { label: 'Stationery & Office', to: '/category/stationery-office' },
  { label: 'Kids & Family', to: '/category/kids-family' },
  { label: 'Food & Pantry', to: '/category/food-pantry' },
]

const companyLinks = [
  { label: 'About Us', to: '/#about' },
  { label: 'Our Impact', to: '/#impact' },
  { label: 'Sustainability', to: '/#impact' },
  { label: 'Contact', to: '/#contact' },
]

const legalLinks = [
  { label: 'Privacy Policy', to: '/privacy' },
  { label: 'Terms of Service', to: '/terms' },
  { label: 'Shipping Policy', to: '/shipping' },
  { label: 'Returns & Refunds', to: '/returns' },
]
</script>
