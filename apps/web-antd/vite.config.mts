import { defineConfig } from '@vben/vite-config';

export default defineConfig(async () => {
  return {
    application: {},
    vite: {
      server: {
        allowedHosts: true,
        proxy: {
          '/app-api': {
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/app-api/, ''),
            target: 'http://localhost:8080',
            ws: true,
          },
        },
      },
    },
  };
});
