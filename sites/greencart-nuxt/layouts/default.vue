<template>
  <div class="min-h-screen flex flex-col bg-cream">
    <AppHeader />
    <main class="flex-1">
      <slot />
    </main>
    <AppFooter />
    <CartDrawer />
  </div>
</template>

<script setup lang="ts">
// Default layout — wraps all pages with header, footer, and cart drawer
</script>
