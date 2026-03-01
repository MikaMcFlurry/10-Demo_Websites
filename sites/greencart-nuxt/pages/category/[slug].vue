<template>
  <div class="pt-16">
    <!-- Category not found -->
    <div v-if="!category" class="max-w-2xl mx-auto px-4 py-32 text-center">
      <span class="text-5xl block mb-4">🌿</span>
      <h1 class="text-2xl font-bold text-forest mb-3">Category not found</h1>
      <p class="text-gc-text/70 mb-6">We couldn't find a category with that name. Try browsing all products.</p>
      <NuxtLink to="/" class="btn-primary">Back to home</NuxtLink>
    </div>

    <template v-else>
      <!-- Category hero -->
      <section class="bg-gradient-to-br from-forest to-leaf text-cream py-14">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <!-- Breadcrumb -->
          <nav class="flex items-center gap-2 text-sm text-cream/60 mb-6" aria-label="Breadcrumb">
            <NuxtLink to="/" class="hover:text-cream transition-colors">Home</NuxtLink>
            <span aria-hidden="true">/</span>
            <span class="text-cream font-medium" aria-current="page">{{ category.name }}</span>
          </nav>

          <div class="flex flex-col sm:flex-row sm:items-end gap-4 justify-between">
            <div>
              <h1 class="text-4xl font-bold leading-tight mb-3">{{ category.name }}</h1>
              <p class="text-cream/80 max-w-xl text-lg leading-relaxed">{{ category.description }}</p>
            </div>
            <div class="flex-shrink-0 bg-white/10 rounded-xl px-5 py-3 text-center border border-white/20">
              <div class="text-3xl font-bold">{{ filteredProducts.length }}</div>
              <div class="text-sm text-cream/70">products</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Filters + Grid -->
      <section class="py-10 bg-cream">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <!-- Filter / sort bar -->
          <div class="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-8 pb-6 border-b border-line">
            <p class="text-sm text-gc-text/60">
              Showing <strong class="text-gc-text">{{ filteredProducts.length }}</strong> products
            </p>
            <div class="flex flex-wrap gap-3">
              <!-- Sort -->
              <div class="flex items-center gap-2">
                <label for="sort" class="text-sm text-gc-text/70 whitespace-nowrap">Sort by:</label>
                <select
                  id="sort"
                  v-model="sortBy"
                  class="text-sm border border-line rounded-lg px-3 py-2 bg-white text-gc-text focus:outline-none focus:ring-2 focus:ring-leaf cursor-pointer"
                >
                  <option value="default">Featured</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                  <option value="footprint">Greenest First</option>
                </select>
              </div>

              <!-- Footprint filter toggle -->
              <button
                @click="onlyHighFootprint = !onlyHighFootprint"
                class="flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors"
                :class="onlyHighFootprint
                  ? 'bg-leaf text-white border-leaf'
                  : 'bg-white text-gc-text border-line hover:border-leaf'"
              >
                <span>🌱</span>
                <span>Greenest only (80+)</span>
              </button>
            </div>
          </div>

          <!-- Product grid -->
          <div v-if="filteredProducts.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <ProductCard
              v-for="product in filteredProducts"
              :key="product.id"
              :product="product"
              :show-badge="true"
            />
          </div>

          <!-- Empty state -->
          <div v-else class="py-20 text-center">
            <span class="text-5xl block mb-4">🌿</span>
            <h3 class="text-xl font-semibold text-forest mb-2">No products found</h3>
            <p class="text-gc-text/60 mb-6">Try adjusting your filters to see more results.</p>
            <button
              @click="resetFilters"
              class="btn-secondary"
            >
              Clear filters
            </button>
          </div>
        </div>
      </section>

      <!-- Other categories -->
      <section class="py-14 bg-white border-t border-line">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 class="text-xl font-bold text-forest mb-6">Explore other categories</h2>
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <NuxtLink
              v-for="cat in otherCategories"
              :key="cat.id"
              :to="`/category/${cat.slug}`"
              class="group p-4 bg-cream rounded-xl border border-line hover:border-leaf hover:bg-leaf/5 transition-all text-center"
            >
              <p class="text-sm font-semibold text-forest group-hover:text-leaf transition-colors">{{ cat.name }}</p>
              <p class="text-xs text-gc-text/50 mt-1">{{ cat.productCount }} products</p>
            </NuxtLink>
          </div>
        </div>
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
import { PRODUCTS } from '~/data/products'
import { CATEGORIES } from '~/data/categories'

const route = useRoute()
const slug = computed(() => route.params.slug as string)

const category = computed(() => CATEGORIES.find((c) => c.slug === slug.value) ?? null)

const sortBy = ref<'default' | 'price-asc' | 'price-desc' | 'rating' | 'footprint'>('default')
const onlyHighFootprint = ref(false)

const categoryProducts = computed(() =>
  PRODUCTS.filter((p) => p.category === slug.value),
)

const filteredProducts = computed(() => {
  let list = [...categoryProducts.value]

  if (onlyHighFootprint.value) {
    list = list.filter((p) => p.footprintScore >= 80)
  }

  switch (sortBy.value) {
    case 'price-asc':
      list.sort((a, b) => a.variants[0].price - b.variants[0].price)
      break
    case 'price-desc':
      list.sort((a, b) => b.variants[0].price - a.variants[0].price)
      break
    case 'rating':
      list.sort((a, b) => b.rating - a.rating)
      break
    case 'footprint':
      list.sort((a, b) => b.footprintScore - a.footprintScore)
      break
    default:
      list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
  }

  return list
})

const otherCategories = computed(() =>
  CATEGORIES.filter((c) => c.slug !== slug.value),
)

function resetFilters() {
  sortBy.value = 'default'
  onlyHighFootprint.value = false
}

// SEO
useHead({
  title: computed(() => category.value ? `${category.value.name} — GreenCart` : 'Category — GreenCart'),
  meta: [
    {
      name: 'description',
      content: computed(() => category.value?.description ?? 'Sustainable products at GreenCart.'),
    },
  ],
})
</script>
