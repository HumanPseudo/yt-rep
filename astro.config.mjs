import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

export default defineConfig({
  vite: {
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:4321',
          changeOrigin: true,
        },
      },
    },
  },

  integrations: [react()],
});