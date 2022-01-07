/* globals path __dirname */

import * as path from 'path'
import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import vueI18n from '@intlify/vite-plugin-vue-i18n'
import VueTypeImports from 'vite-plugin-vue-type-imports'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VueTypeImports(),
    vueI18n({
      include: path.resolve(__dirname, 'src/locales/**'),
      fullInstall: false
    })
  ],
  build: {
    target: 'esnext',
    lib: {
      entry: path.resolve(__dirname, 'src/components/CookieConsent.vue'),
      name: 'CookieConsent',
      formats: ['es', 'umd'],
      fileName: (format) => `cookie-consent.${format}.js`
    },
    ssr: false,
    minify: false,
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
