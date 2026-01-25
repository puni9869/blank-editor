import { defineConfig } from 'vite';

export default defineConfig({
  base: '/blank-editor/',
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
        drop_console: true, // Example: Remove console.log statements
        arrows: true,
      },
      mangle: true, // Example: Mangle variable names
    },
    minify: 'terser', // 'esbuild' (default), 'terser', or false to disable
    cssMinify: 'lightningcss', // 'esbuild' (default) or 'lightningcss'
  },
});
