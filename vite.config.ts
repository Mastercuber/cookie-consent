import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueI18n from '@intlify/vite-plugin-vue-i18n'
import VueTypeImports from 'vite-plugin-vue-type-imports'
import dts from 'vite-plugin-dts'

import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    include: [resolve('src', 'components', '*.test.js')],
    maxThreads: 32
  },
  plugins: [
    vue(),
    VueTypeImports(),
    vueI18n({
      include: resolve(__dirname, 'src/locales/**'),
      fullInstall: false
    }),
    dts()
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  build: {
    target: 'esnext',
    lib: {
      entry: resolve(__dirname, 'src/entry.ts'),
      name: 'CookieConsent',
      formats: ['es', 'umd'],
      fileName: (format) => `cookie-consent.${format}.js`
    },
    ssr: false,
    minify: true,
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue'
        }
      }
    }
  }
})
