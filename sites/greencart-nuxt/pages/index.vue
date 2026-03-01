<template>
  <div class="pt-16">

    <!-- ===== HERO SECTION ===== -->
    <section class="relative bg-forest text-cream overflow-hidden min-h-[600px] flex items-center">
      <!-- Decorative leaf patterns -->
      <div class="absolute inset-0 pointer-events-none select-none overflow-hidden" aria-hidden="true">
        <span class="absolute text-[18rem] opacity-5 -right-16 -top-20 leading-none rotate-12">🌿</span>
        <span class="absolute text-[10rem] opacity-5 left-8 bottom-8 leading-none -rotate-12">🌱</span>
        <div class="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-leaf/20 to-transparent"></div>
      </div>

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 grid lg:grid-cols-2 gap-12 items-center">
        <!-- Text -->
        <div>
          <div class="inline-flex items-center gap-2 bg-leaf/30 text-moss text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
            <span>🌱</span>
            <span>B Corp Certified Partners Only</span>
          </div>
          <h1 class="text-5xl sm:text-6xl font-bold leading-tight mb-6 tracking-tight">
            Good things,<br />
            <span class="text-moss">made right.</span>
          </h1>
          <p class="text-lg text-cream/80 leading-relaxed max-w-lg mb-8">
            Curated everyday goods with transparent sourcing, durable materials, and a minimal footprint. No greenwashing — just products that are genuinely better.
          </p>
          <div class="flex flex-wrap gap-4">
            <NuxtLink
              to="/category/kitchen-home"
              class="inline-flex items-center gap-2 bg-sun text-gc-text font-bold px-6 py-3.5 rounded-lg hover:bg-yellow-300 transition-colors text-base shadow-lg"
            >
              Shop now
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </NuxtLink>
            <a
              href="#impact"
              class="inline-flex items-center gap-2 border-2 border-cream/40 text-cream font-semibold px-6 py-3.5 rounded-lg hover:border-cream hover:bg-cream/10 transition-colors text-base"
            >
              Our impact
            </a>
          </div>
        </div>

        <!-- Hero card cluster -->
        <div class="hidden lg:grid grid-cols-2 gap-4">
          <div class="bg-leaf/20 rounded-2xl p-6 flex flex-col gap-2 border border-leaf/30">
            <span class="text-3xl">♻️</span>
            <p class="font-bold text-lg">Zero Plastic Packaging</p>
            <p class="text-sm text-cream/70">Every order ships in compostable or recycled materials.</p>
          </div>
          <div class="bg-leaf/20 rounded-2xl p-6 flex flex-col gap-2 border border-leaf/30 mt-6">
            <span class="text-3xl">🌱</span>
            <p class="font-bold text-lg">Carbon Neutral Shipping</p>
            <p class="text-sm text-cream/70">100% of emissions offset through verified projects.</p>
          </div>
          <div class="bg-leaf/20 rounded-2xl p-6 flex flex-col gap-2 border border-leaf/30">
            <span class="text-3xl">🤝</span>
            <p class="font-bold text-lg">Fair Trade Partners</p>
            <p class="text-sm text-cream/70">Every supplier audited for fair wages and safe conditions.</p>
          </div>
          <div class="bg-sun/20 rounded-2xl p-6 flex flex-col gap-2 border border-sun/30 mt-6">
            <span class="text-3xl">📦</span>
            <p class="font-bold text-lg">12,847 kg Plastic Avoided</p>
            <p class="text-sm text-cream/70">Since our first order in 2021.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== TRUST BAR ===== -->
    <section class="bg-white border-b border-line">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div
            v-for="trust in trustItems"
            :key="trust.label"
            class="flex items-center gap-3"
          >
            <span class="text-2xl flex-shrink-0">{{ trust.icon }}</span>
            <div>
              <p class="text-sm font-semibold text-forest">{{ trust.label }}</p>
              <p class="text-xs text-gc-text/60">{{ trust.sub }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== FEATURED PRODUCTS ===== -->
    <section class="py-16 bg-cream">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-end justify-between mb-10">
          <div>
            <span class="text-xs font-semibold text-leaf uppercase tracking-widest">Hand-picked</span>
            <h2 class="text-3xl font-bold text-forest mt-1">Featured Products</h2>
          </div>
          <NuxtLink
            to="/category/kitchen-home"
            class="text-sm font-semibold text-leaf hover:text-forest transition-colors hidden sm:flex items-center gap-1"
          >
            View all
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </NuxtLink>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <ProductCard
            v-for="product in featuredProducts"
            :key="product.id"
            :product="product"
            :show-badge="true"
          />
        </div>
      </div>
    </section>

    <!-- ===== CATEGORIES ===== -->
    <section class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="mb-10">
          <span class="text-xs font-semibold text-leaf uppercase tracking-widest">Browse by category</span>
          <h2 class="text-3xl font-bold text-forest mt-1">Shop the Range</h2>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <CategoryCard
            v-for="category in CATEGORIES"
            :key="category.id"
            :category="category"
          />
        </div>
      </div>
    </section>

    <!-- ===== IMPACT SECTION ===== -->
    <section id="impact" class="py-20 bg-forest text-cream">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-14">
          <span class="text-xs font-semibold text-moss uppercase tracking-widest">Measured, not marketed</span>
          <h2 class="text-3xl font-bold mt-2">Our Impact So Far</h2>
          <p class="text-cream/70 mt-3 max-w-xl mx-auto">
            We publish our sustainability numbers every quarter. No estimates, no rounding up — just the real figures from our supply chain.
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-14">
          <div
            v-for="stat in impactStats"
            :key="stat.label"
            class="text-center p-8 bg-leaf/20 rounded-2xl border border-leaf/30"
          >
            <div class="text-4xl mb-3">{{ stat.icon }}</div>
            <div class="text-3xl font-bold text-sun mb-2">{{ stat.value }}</div>
            <p class="text-cream/80 font-semibold">{{ stat.label }}</p>
            <p class="text-sm text-cream/60 mt-1">{{ stat.sub }}</p>
          </div>
        </div>

        <div class="grid sm:grid-cols-3 gap-6">
          <div class="flex items-start gap-4 p-5 bg-leaf/10 rounded-xl border border-leaf/20">
            <span class="text-2xl flex-shrink-0 mt-0.5">🏭</span>
            <div>
              <p class="font-semibold text-cream">100% Renewable Energy</p>
              <p class="text-sm text-cream/70 mt-0.5">Our warehouse runs entirely on solar, with RECs covering the remaining 14%.</p>
            </div>
          </div>
          <div class="flex items-start gap-4 p-5 bg-leaf/10 rounded-xl border border-leaf/20">
            <span class="text-2xl flex-shrink-0 mt-0.5">🌳</span>
            <div>
              <p class="font-semibold text-cream">B Corp Certified Partners Only</p>
              <p class="text-sm text-cream/70 mt-0.5">Every supplier we work with has passed the B Corp or equivalent rigorous assessment.</p>
            </div>
          </div>
          <div class="flex items-start gap-4 p-5 bg-leaf/10 rounded-xl border border-leaf/20">
            <span class="text-2xl flex-shrink-0 mt-0.5">📊</span>
            <div>
              <p class="font-semibold text-cream">Transparent Footprint Scores</p>
              <p class="text-sm text-cream/70 mt-0.5">Every product carries a verified footprint score based on LCA methodology.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== ABOUT TEASER ===== -->
    <section id="about" class="py-20 bg-cream">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span class="text-xs font-semibold text-leaf uppercase tracking-widest">Our story</span>
        <h2 class="text-3xl font-bold text-forest mt-2 mb-6">Why GreenCart exists</h2>
        <p class="text-gc-text/80 leading-relaxed text-lg mb-6">
          We started GreenCart because shopping sustainably was too hard. Every product claimed to be eco-friendly, but most labels were meaningless. We wanted a shop where the work was already done — where every single item had been independently verified to be genuinely better for people and planet.
        </p>
        <p class="text-gc-text/70 leading-relaxed mb-8">
          Today we carry fewer than 200 products — and that is intentional. We would rather curate deeply than scale recklessly. Each product passes our 47-point assessment covering materials, manufacturing conditions, packaging, transport, durability, and end-of-life options before it ever appears on the site.
        </p>
        <NuxtLink
          to="/#impact"
          class="inline-flex items-center gap-2 bg-forest text-cream font-semibold px-6 py-3 rounded-lg hover:bg-leaf transition-colors"
        >
          Read our full impact report
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </NuxtLink>
      </div>
    </section>

    <!-- ===== NEWSLETTER ===== -->
    <section class="py-16 bg-white border-t border-line">
      <div class="max-w-xl mx-auto px-4 sm:px-6 text-center">
        <span class="text-2xl block mb-3">🌿</span>
        <h2 class="text-2xl font-bold text-forest mb-2">Stay in the loop</h2>
        <p class="text-gc-text/70 text-sm mb-6">
          New products, impact updates, and honest guides to living lower-impact. No spam, ever.
        </p>
        <form class="flex gap-3 max-w-sm mx-auto" @submit.prevent>
          <input
            type="email"
            placeholder="your@email.com"
            class="flex-1 border border-line rounded-lg px-4 py-2.5 text-sm bg-cream focus:outline-none focus:ring-2 focus:ring-leaf text-gc-text placeholder:text-gc-text/40"
          />
          <button
            type="submit"
            class="bg-forest text-cream font-semibold px-4 py-2.5 rounded-lg hover:bg-leaf transition-colors text-sm"
          >
            Subscribe
          </button>
        </form>
        <p class="text-xs text-gc-text/40 mt-3">Unsubscribe any time. We never sell data.</p>
      </div>
    </section>

  </div>
</template>

<script setup lang="ts">
import { PRODUCTS } from '~/data/products'
import { CATEGORIES } from '~/data/categories'

const featuredProducts = computed(() => PRODUCTS.filter((p) => p.featured))

const trustItems = [
  { icon: '🌱', label: 'Carbon Neutral', sub: 'All shipments offset' },
  { icon: '♻️', label: 'Plastic-Free Packaging', sub: 'Compostable or recycled' },
  { icon: '🤝', label: 'Fair Trade', sub: 'Audited suppliers only' },
  { icon: '📦', label: 'Free Shipping over $50', sub: 'On all domestic orders' },
]

const impactStats = [
  {
    icon: '♻️',
    value: '12,847 kg',
    label: 'Plastic avoided',
    sub: 'Compared to conventional equivalents since 2021',
  },
  {
    icon: '🌳',
    value: '24,100+',
    label: 'Trees planted',
    sub: 'Via our 1 tree per order programme',
  },
  {
    icon: '💰',
    value: '$341,000',
    label: 'Paid above market rate',
    sub: 'To fair-trade farmers and producers',
  },
]
</script>
