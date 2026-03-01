<template>
  <NuxtLink
    :to="`/category/${category.slug}`"
    class="group relative overflow-hidden rounded-xl flex flex-col justify-end min-h-[180px] p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf"
    :class="gradientClass"
  >
    <!-- Decorative leaf pattern -->
    <div class="absolute inset-0 opacity-10 pointer-events-none select-none" aria-hidden="true">
      <span class="absolute text-7xl top-2 right-3 rotate-12 leading-none">🌿</span>
    </div>

    <!-- Overlay for depth -->
    <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent rounded-xl pointer-events-none"></div>

    <!-- Content -->
    <div class="relative z-10">
      <span class="block text-xs font-semibold uppercase tracking-widest text-white/70 mb-1">
        {{ category.productCount }} products
      </span>
      <h3 class="text-lg font-bold text-white leading-tight mb-1 group-hover:underline decoration-white/50 underline-offset-2">
        {{ category.name }}
      </h3>
      <p class="text-sm text-white/80 leading-relaxed line-clamp-2">
        {{ category.description }}
      </p>
      <div class="mt-3 flex items-center gap-1 text-white text-sm font-semibold">
        <span>Shop now</span>
        <svg class="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { Category } from '~/data/types'

const props = defineProps<{
  category: Category
}>()

const GRADIENTS: Record<string, string> = {
  'kitchen-home': 'bg-gradient-to-br from-forest to-leaf',
  'personal-care': 'bg-gradient-to-br from-leaf to-moss',
  'outdoor-garden': 'bg-gradient-to-br from-moss to-leaf',
  'stationery-office': 'bg-gradient-to-br from-forest via-leaf to-moss',
  'kids-family': 'bg-gradient-to-br from-clay to-sun',
  'food-pantry': 'bg-gradient-to-br from-leaf to-forest',
}

const gradientClass = computed(
  () => GRADIENTS[props.category.slug] ?? 'bg-gradient-to-br from-forest to-leaf',
)
</script>
