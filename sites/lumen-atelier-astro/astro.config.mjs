import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';

export default defineConfig({
  integrations: [tailwind(), mdx()],
  output: 'static',
  site: 'https://mikamcflurry.github.io',
  base: '/10-Demo_Websites/lumen-atelier',
});
