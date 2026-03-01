<template>
  <div class="pt-16">
    <!-- Product not found -->
    <div v-if="!product" class="max-w-2xl mx-auto px-4 py-32 text-center">
      <span class="text-5xl block mb-4">🌿</span>
      <h1 class="text-2xl font-bold text-forest mb-3">Product not found</h1>
      <p class="text-gc-text/70 mb-6">We couldn't find that product. Try browsing our categories.</p>
      <NuxtLink to="/" class="btn-primary">Back to home</NuxtLink>
    </div>

    <template v-else>
      <!-- Breadcrumb -->
      <div class="bg-white border-b border-line">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav class="flex items-center gap-2 text-sm text-gc-text/60" aria-label="Breadcrumb">
            <NuxtLink to="/" class="hover:text-forest transition-colors">Home</NuxtLink>
            <span aria-hidden="true">/</span>
            <NuxtLink :to="`/category/${product.category}`" class="hover:text-forest transition-colors capitalize">
              {{ categoryLabel }}
            </NuxtLink>
            <span aria-hidden="true">/</span>
            <span class="text-gc-text font-medium truncate" aria-current="page">{{ product.name }}</span>
          </nav>
        </div>
      </div>

      <!-- Main product section -->
      <section class="py-12 bg-cream">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid lg:grid-cols-2 gap-12 items-start">

            <!-- Left: Product image -->
            <div class="space-y-4">
              <!-- Main image placeholder -->
              <div class="w-full aspect-square rounded-2xl bg-gradient-to-br from-moss to-leaf flex items-center justify-center overflow-hidden shadow-md">
                <span class="text-[8rem] opacity-30 select-none">🌿</span>
              </div>
              <!-- Thumbnail row placeholder -->
              <div class="grid grid-cols-4 gap-3">
                <div
                  v-for="i in 4"
                  :key="i"
                  class="aspect-square rounded-lg bg-gradient-to-br from-leaf to-forest opacity-60 cursor-pointer border-2 transition-all"
                  :class="i === 1 ? 'border-leaf' : 'border-transparent hover:border-moss'"
                ></div>
              </div>
            </div>

            <!-- Right: Product info -->
            <div class="flex flex-col gap-5">
              <!-- Category + badges -->
              <div class="flex flex-wrap items-center gap-2">
                <NuxtLink
                  :to="`/category/${product.category}`"
                  class="text-xs font-semibold text-leaf uppercase tracking-wide hover:text-forest transition-colors"
                >
                  {{ categoryLabel }}
                </NuxtLink>
                <span v-if="product.featured" class="inline-flex items-center gap-1 bg-sun text-gc-text text-xs font-bold px-2.5 py-0.5 rounded-full">
                  ⭐ Featured
                </span>
              </div>

              <!-- Name -->
              <h1 class="text-3xl font-bold text-forest leading-tight">{{ product.name }}</h1>

              <!-- Rating -->
              <div class="flex items-center gap-3">
                <div class="flex items-center gap-0.5" :aria-label="`Rating: ${product.rating} out of 5`">
                  <template v-for="i in 5" :key="i">
                    <svg
                      class="w-4 h-4"
                      :class="i <= Math.round(product.rating) ? 'text-sun fill-sun' : 'text-line fill-line'"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </template>
                </div>
                <span class="text-sm text-gc-text/60 font-medium">
                  {{ product.rating }} ({{ product.reviewCount }} reviews)
                </span>
              </div>

              <!-- Price -->
              <div class="flex items-baseline gap-3">
                <span class="text-3xl font-bold text-forest">${{ selectedVariant.price.toFixed(2) }}</span>
                <span
                  v-if="selectedVariant.comparePrice"
                  class="text-xl text-gc-text/40 line-through"
                >
                  ${{ selectedVariant.comparePrice.toFixed(2) }}
                </span>
                <span
                  v-if="selectedVariant.comparePrice"
                  class="text-sm font-bold text-leaf bg-leaf/10 px-2 py-0.5 rounded-full"
                >
                  Save ${{ (selectedVariant.comparePrice - selectedVariant.price).toFixed(2) }}
                </span>
              </div>

              <!-- Short description -->
              <p class="text-gc-text/80 leading-relaxed text-base">{{ product.description }}</p>

              <!-- Footprint score -->
              <div class="flex items-center gap-3 p-4 bg-white border border-line rounded-xl">
                <div
                  class="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold"
                  :class="footprintColorClass"
                >
                  {{ product.footprintScore }}
                </div>
                <div>
                  <p class="text-sm font-bold text-forest">🌱 Footprint Score</p>
                  <p class="text-xs text-gc-text/60">{{ footprintLabel }} — based on lifecycle assessment of materials, manufacturing, and transport.</p>
                </div>
              </div>

              <!-- Variant selector -->
              <div v-if="product.variants.length > 1">
                <label class="block text-sm font-semibold text-forest mb-2">
                  Option: <span class="font-normal text-gc-text/70">{{ selectedVariant.name }}</span>
                </label>
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="variant in product.variants"
                    :key="variant.id"
                    @click="selectedVariantId = variant.id"
                    class="px-4 py-2 rounded-lg border text-sm font-medium transition-all"
                    :class="selectedVariantId === variant.id
                      ? 'bg-forest text-cream border-forest'
                      : 'bg-white text-gc-text border-line hover:border-forest'"
                    :disabled="variant.stock === 0"
                  >
                    {{ variant.name }}
                    <span v-if="variant.stock === 0" class="text-gc-text/40"> (sold out)</span>
                  </button>
                </div>
              </div>

              <!-- Quantity + Add to cart -->
              <div class="flex gap-3 items-center">
                <!-- Qty -->
                <div class="flex items-center rounded-lg border border-line overflow-hidden bg-white">
                  <button
                    @click="qty = Math.max(1, qty - 1)"
                    class="w-10 h-12 flex items-center justify-center text-forest hover:bg-line transition-colors font-bold text-lg"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span class="w-12 text-center text-base font-semibold text-gc-text select-none">{{ qty }}</span>
                  <button
                    @click="qty = qty + 1"
                    class="w-10 h-12 flex items-center justify-center text-forest hover:bg-line transition-colors font-bold text-lg"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                <!-- Add to cart -->
                <button
                  @click="handleAddToCart"
                  :disabled="selectedVariant.stock === 0"
                  class="flex-1 flex items-center justify-center gap-2 bg-forest text-cream font-bold py-3.5 rounded-xl hover:bg-leaf transition-colors text-base disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  {{ selectedVariant.stock === 0 ? 'Out of Stock' : 'Add to Cart' }}
                </button>
              </div>

              <!-- Added to cart flash -->
              <Transition
                enter-active-class="transition-all duration-300"
                enter-from-class="opacity-0 -translate-y-1"
                enter-to-class="opacity-100 translate-y-0"
                leave-active-class="transition-all duration-200"
                leave-from-class="opacity-100"
                leave-to-class="opacity-0"
              >
                <div
                  v-if="addedFlash"
                  class="flex items-center gap-2 bg-leaf/10 border border-leaf text-leaf font-medium text-sm px-4 py-3 rounded-lg"
                >
                  <span>✅</span>
                  <span>Added to cart!</span>
                  <button @click="cartStore.openCart()" class="ml-auto underline text-forest hover:text-leaf">View cart</button>
                </div>
              </Transition>

              <!-- Sustainability badges -->
              <div>
                <p class="text-sm font-semibold text-forest mb-2">Certifications & badges</p>
                <div class="flex flex-wrap gap-2">
                  <div
                    v-for="badge in product.badges"
                    :key="badge.label"
                    class="group relative flex items-center gap-2 bg-white border border-line text-sm px-3 py-2 rounded-lg cursor-default"
                    :title="badge.description"
                  >
                    <span class="text-base">{{ badge.icon }}</span>
                    <span class="font-medium text-gc-text">{{ badge.label }}</span>
                  </div>
                </div>
              </div>

              <!-- Trust signals -->
              <div class="grid grid-cols-2 gap-3 pt-2 border-t border-line">
                <div class="flex items-center gap-2 text-xs text-gc-text/70">
                  <span>🚚</span>
                  <span>Free shipping over $50</span>
                </div>
                <div class="flex items-center gap-2 text-xs text-gc-text/70">
                  <span>♻️</span>
                  <span>Compostable packaging</span>
                </div>
                <div class="flex items-center gap-2 text-xs text-gc-text/70">
                  <span>🔄</span>
                  <span>30-day returns</span>
                </div>
                <div class="flex items-center gap-2 text-xs text-gc-text/70">
                  <span>🌱</span>
                  <span>Carbon neutral delivery</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Tabs: Description / Materials / Care -->
      <section class="py-12 bg-white border-t border-line">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <!-- Tab nav -->
          <div class="flex border-b border-line mb-8">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              class="px-5 py-3 text-sm font-semibold border-b-2 transition-colors"
              :class="activeTab === tab.id
                ? 'border-forest text-forest'
                : 'border-transparent text-gc-text/60 hover:text-gc-text'"
            >
              {{ tab.label }}
            </button>
          </div>

          <!-- Description tab -->
          <div v-if="activeTab === 'description'" class="prose prose-gc max-w-none">
            <p class="text-gc-text/80 leading-relaxed text-base whitespace-pre-line">{{ product.longDescription }}</p>
          </div>

          <!-- Materials & Origin tab -->
          <div v-else-if="activeTab === 'materials'" class="space-y-6">
            <div>
              <h3 class="font-bold text-forest mb-3">Materials</h3>
              <ul class="space-y-2">
                <li
                  v-for="mat in product.materials"
                  :key="mat"
                  class="flex items-start gap-2 text-gc-text/80 text-sm"
                >
                  <span class="text-leaf mt-0.5">•</span>
                  <span>{{ mat }}</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 class="font-bold text-forest mb-3">Origin</h3>
              <div class="flex items-start gap-3 p-4 bg-cream border border-line rounded-xl">
                <span class="text-xl">📍</span>
                <p class="text-gc-text/80 text-sm leading-relaxed">{{ product.origin }}</p>
              </div>
            </div>
          </div>

          <!-- Care tab -->
          <div v-else-if="activeTab === 'care'">
            <h3 class="font-bold text-forest mb-4">Care instructions</h3>
            <ul class="space-y-3">
              <li
                v-for="(instruction, i) in product.care"
                :key="i"
                class="flex items-start gap-3 p-3 bg-cream rounded-lg border border-line"
              >
                <span class="flex-shrink-0 w-6 h-6 rounded-full bg-leaf text-white text-xs font-bold flex items-center justify-center mt-0.5">
                  {{ i + 1 }}
                </span>
                <span class="text-gc-text/80 text-sm leading-relaxed">{{ instruction }}</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <!-- Reviews -->
      <section v-if="productReviews.length > 0" class="py-12 bg-cream border-t border-line">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-end justify-between mb-8">
            <div>
              <h2 class="text-2xl font-bold text-forest">Customer Reviews</h2>
              <div class="flex items-center gap-2 mt-1">
                <div class="flex gap-0.5">
                  <template v-for="i in 5" :key="i">
                    <svg class="w-4 h-4" :class="i <= Math.round(product.rating) ? 'text-sun fill-sun' : 'text-line fill-line'" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </template>
                </div>
                <span class="text-sm text-gc-text/70">{{ product.rating }} out of 5 · {{ product.reviewCount }} reviews</span>
              </div>
            </div>
          </div>

          <div class="space-y-6">
            <article
              v-for="review in productReviews"
              :key="review.id"
              class="bg-white border border-line rounded-xl p-5"
            >
              <div class="flex items-start justify-between gap-4">
                <div>
                  <div class="flex items-center gap-2 mb-1">
                    <div class="flex gap-0.5">
                      <template v-for="i in 5" :key="i">
                        <svg class="w-3.5 h-3.5" :class="i <= review.rating ? 'text-sun fill-sun' : 'text-line fill-line'" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </template>
                    </div>
                    <span v-if="review.verified" class="text-xs text-leaf font-medium">✅ Verified purchase</span>
                  </div>
                  <h4 class="font-semibold text-forest">{{ review.title }}</h4>
                </div>
                <div class="text-right flex-shrink-0">
                  <p class="text-sm font-medium text-gc-text">{{ review.author }}</p>
                  <p class="text-xs text-gc-text/50">{{ formatDate(review.date) }}</p>
                </div>
              </div>
              <p class="text-gc-text/80 text-sm leading-relaxed mt-3">{{ review.body }}</p>
            </article>
          </div>
        </div>
      </section>

      <!-- Related products -->
      <section v-if="relatedProducts.length > 0" class="py-12 bg-white border-t border-line">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 class="text-2xl font-bold text-forest mb-8">You might also like</h2>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <ProductCard
              v-for="p in relatedProducts"
              :key="p.id"
              :product="p"
              :show-badge="true"
            />
          </div>
        </div>
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
import { PRODUCTS, REVIEWS } from '~/data/products'
import { useCartStore } from '~/stores/cart'

const route = useRoute()
const slug = computed(() => route.params.slug as string)
const cartStore = useCartStore()

const product = computed(() => PRODUCTS.find((p) => p.slug === slug.value) ?? null)

const selectedVariantId = ref<string>('')
const qty = ref(1)
const addedFlash = ref(false)
const activeTab = ref<'description' | 'materials' | 'care'>('description')

const CATEGORY_LABELS: Record<string, string> = {
  'kitchen-home': 'Kitchen & Home',
  'personal-care': 'Personal Care',
  'outdoor-garden': 'Outdoor & Garden',
  'stationery-office': 'Stationery & Office',
  'kids-family': 'Kids & Family',
  'food-pantry': 'Food & Pantry',
}

const tabs = [
  { id: 'description' as const, label: 'Description' },
  { id: 'materials' as const, label: 'Materials & Origin' },
  { id: 'care' as const, label: 'Care Instructions' },
]

const categoryLabel = computed(() =>
  product.value ? (CATEGORY_LABELS[product.value.category] ?? product.value.category) : '',
)

// Init selected variant when product loads
watch(product, (p) => {
  if (p) {
    selectedVariantId.value = p.variants[0].id
  }
}, { immediate: true })

const selectedVariant = computed(() => {
  if (!product.value) return { id: '', name: '', sku: '', price: 0, stock: 0, weight: 0 }
  return (
    product.value.variants.find((v) => v.id === selectedVariantId.value)
    ?? product.value.variants[0]
  )
})

const footprintColorClass = computed(() => {
  const s = product.value?.footprintScore ?? 0
  if (s >= 90) return 'bg-moss text-forest'
  if (s >= 75) return 'bg-leaf/20 text-leaf border border-leaf'
  return 'bg-line text-gc-text'
})

const footprintLabel = computed(() => {
  const s = product.value?.footprintScore ?? 0
  if (s >= 90) return 'Excellent environmental performance'
  if (s >= 80) return 'Very good environmental performance'
  if (s >= 70) return 'Good environmental performance'
  return 'Moderate environmental performance'
})

const productReviews = computed(() =>
  product.value ? REVIEWS.filter((r) => r.productId === product.value!.id) : [],
)

const relatedProducts = computed(() => {
  if (!product.value) return []
  return PRODUCTS
    .filter((p) => p.category === product.value!.category && p.id !== product.value!.id)
    .slice(0, 3)
})

function handleAddToCart() {
  if (!product.value) return
  cartStore.addItem(
    product.value.id,
    selectedVariant.value.id,
    product.value.name,
    selectedVariant.value.price,
    qty.value,
    selectedVariant.value.weight,
    product.value.slug,
    selectedVariant.value.name,
  )
  addedFlash.value = true
  setTimeout(() => { addedFlash.value = false }, 3000)
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

// SEO
useHead({
  title: computed(() => product.value ? `${product.value.name} — GreenCart` : 'Product — GreenCart'),
  meta: [
    {
      name: 'description',
      content: computed(() => product.value?.description ?? 'Sustainable product from GreenCart.'),
    },
  ],
})
</script>
