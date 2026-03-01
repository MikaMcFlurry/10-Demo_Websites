<template>
  <article
    class="card group flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
  >
    <!-- Product image placeholder -->
    <NuxtLink :to="`/product/${product.slug}`" class="block relative overflow-hidden" tabindex="-1" aria-hidden="true">
      <div
        class="w-full h-52 bg-gradient-to-br from-moss to-leaf flex items-center justify-center"
        aria-hidden="true"
      >
        <span class="text-5xl opacity-40 select-none">🌿</span>
      </div>

      <!-- Featured badge -->
      <div v-if="product.featured" class="absolute top-3 left-3">
        <span class="inline-flex items-center gap-1 bg-sun text-gc-text text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
          ⭐ Featured
        </span>
      </div>

      <!-- Footprint score badge -->
      <div class="absolute top-3 right-3">
        <span
          class="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm"
          :class="footprintColorClass"
        >
          🌱 {{ product.footprintScore }}
        </span>
      </div>
    </NuxtLink>

    <!-- Card body -->
    <div class="flex flex-col flex-1 p-4 gap-3">
      <!-- Category -->
      <span class="text-xs text-leaf font-semibold uppercase tracking-wide">
        {{ categoryLabel }}
      </span>

      <!-- Name -->
      <NuxtLink :to="`/product/${product.slug}`">
        <h3 class="font-semibold text-gc-text text-base leading-snug group-hover:text-forest transition-colors line-clamp-2">
          {{ product.name }}
        </h3>
      </NuxtLink>

      <!-- Short description -->
      <p class="text-sm text-gc-text/70 line-clamp-2 leading-relaxed">{{ product.description }}</p>

      <!-- Rating -->
      <div class="flex items-center gap-1.5">
        <div class="flex items-center gap-0.5" :aria-label="`Rating: ${product.rating} out of 5`">
          <template v-for="i in 5" :key="i">
            <svg
              class="w-3.5 h-3.5"
              :class="i <= Math.round(product.rating) ? 'text-sun fill-sun' : 'text-line fill-line'"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </template>
        </div>
        <span class="text-xs text-gc-text/60">({{ product.reviewCount }})</span>
      </div>

      <!-- Sustainability badges (first 2) -->
      <div v-if="showBadge && product.badges.length > 0" class="flex flex-wrap gap-1.5">
        <span
          v-for="badge in product.badges.slice(0, 2)"
          :key="badge.label"
          :title="badge.description"
          class="inline-flex items-center gap-1 text-xs bg-cream border border-line text-gc-text/70 px-2 py-0.5 rounded-full"
        >
          <span>{{ badge.icon }}</span>
          <span>{{ badge.label }}</span>
        </span>
      </div>

      <!-- Price + CTA -->
      <div class="flex items-center justify-between mt-auto pt-3 border-t border-line">
        <div>
          <span class="text-lg font-bold text-forest">
            ${{ product.variants[0].price.toFixed(2) }}
          </span>
          <span
            v-if="product.variants[0].comparePrice"
            class="ml-1.5 text-sm line-through text-gc-text/40"
          >
            ${{ product.variants[0].comparePrice.toFixed(2) }}
          </span>
        </div>

        <button
          @click.prevent="handleAddToCart"
          class="flex items-center gap-1.5 bg-forest text-cream text-sm font-semibold px-3 py-2 rounded-lg hover:bg-leaf transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf"
          aria-label="Add to cart"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 4v16m8-8H4" />
          </svg>
          <span class="hidden sm:inline">Add</span>
        </button>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { Product } from '~/data/types'
import { useCartStore } from '~/stores/cart'

const props = withDefaults(defineProps<{
  product: Product
  showBadge?: boolean
}>(), {
  showBadge: true,
})

const cartStore = useCartStore()

const CATEGORY_LABELS: Record<string, string> = {
  'kitchen-home': 'Kitchen & Home',
  'personal-care': 'Personal Care',
  'outdoor-garden': 'Outdoor & Garden',
  'stationery-office': 'Stationery & Office',
  'kids-family': 'Kids & Family',
  'food-pantry': 'Food & Pantry',
}

const categoryLabel = computed(() => CATEGORY_LABELS[props.product.category] ?? props.product.category)

const footprintColorClass = computed(() => {
  const s = props.product.footprintScore
  if (s >= 90) return 'bg-moss text-forest'
  if (s >= 75) return 'bg-leaf/20 text-leaf'
  return 'bg-line text-gc-text'
})

function handleAddToCart() {
  const variant = props.product.variants[0]
  cartStore.addItem(
    props.product.id,
    variant.id,
    props.product.name,
    variant.price,
    1,
    variant.weight,
    props.product.slug,
    variant.name,
  )
  cartStore.openCart()
}
</script>
