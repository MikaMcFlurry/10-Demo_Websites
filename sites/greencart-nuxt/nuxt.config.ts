export default defineNuxtConfig({
  devtools: { enabled: false },
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@vueuse/nuxt',
  ],
  tailwindcss: {
    cssPath: '~/assets/css/tailwind.css',
    configPath: 'tailwind.config.js',
  },
  typescript: {
    strict: true,
  },
  app: {
    baseURL: '/10-Demo_Websites/greencart',
    head: {
      title: 'GreenCart — Low-Impact Everyday Goods',
      meta: [
        { name: 'description', content: 'Low-impact everyday goods with transparent sourcing and durable materials.' },
        { name: 'theme-color', content: '#1F3D2B' },
      ],
      link: [
        { rel: 'manifest', href: '/manifest.json' },
      ],
    },
  },
  runtimeConfig: {
    public: {},
  },
})
