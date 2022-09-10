import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueI18n from '@intlify/vite-plugin-vue-i18n'
import VueTypeImports from 'vite-plugin-vue-type-imports'
import eslint from 'vite-plugin-eslint'
import dts from 'vite-plugin-dts'

import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  test: {
    globals: true,
    environment: 'happy-dom',
    include: [
      resolve('src', 'components', '*.test.ts'),
      resolve('src', 'assets', '*.test.ts')
    ],
    maxThreads: 32,
    coverage:{
      reporter:['text', 'json', 'html']
    }
  },
  plugins: [
    vue(),
    VueTypeImports(),
    vueI18n({
      fullInstall: false,
      compositionOnly: true,
      runtimeOnly: false,
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
