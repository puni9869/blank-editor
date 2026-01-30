import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/blank-editor/',

  plugins: [
    VitePWA({
      registerType: 'autoUpdate',

      includeAssets: [
        'favicon.ico',
        'icons/icon-192.png',
        'icons/icon-512.png',
      ],

      manifest: {
        name: 'Blank Editor',
        short_name: 'Blank',
        description: 'A minimal, distraction-free text editor',

        // ⚠️ MUST include base path
        start_url: '/blank-editor/',
        scope: '/blank-editor/',

        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#000000',

        icons: [
          {
            src: '/blank-editor/icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/blank-editor/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },

      workbox: {
        cleanupOutdatedCaches: true,
      },
    }),
  ],

  build: {
    outDir: 'docs',

    esbuild: {
      drop: ['console', 'debugger'],
    },

    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
    },

    terserOptions: {
      compress: {
        dead_code: true,
        drop_console: true,
        arrows: true,
      },
      mangle: true,
    },

    minify: 'terser',
    cssMinify: 'lightningcss',
  },
});
