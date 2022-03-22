import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueI18n from "@intlify/vite-plugin-vue-i18n"
import VueTypeImports from 'vite-plugin-vue-type-imports'
import dts from 'vite-plugin-dts'

import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VueTypeImports(),
    vueI18n({
      //include: resolve(__dirname, 'src/locales/**'),
      runtimeOnly: true,
      compositionOnly: true,
      fullInstall: false,
      defaultSFCLang: 'json',
      globalSFCScope: true, // dadurch kann mit useI18n({ useScope: 'global', inheritLocale: true }) auch auf die Übersetzungen dieser Komponente zugegriffen werden
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
      entry: resolve(__dirname, 'src/components/CookieConsent.vue'),
      name: 'CookieConsent',
      formats: ['es', 'umd'],
      fileName: (format) => `cookie-consent.${format}.js`
    },
    ssr: false,
    minify: true,
    polyfillModulePreload: true,
    rollupOptions: {
      external: ['vue', 'vue-i18n'],
      output: {
        globals: {
          vue: 'Vue'
        }
      }
    }
  },
  optimizeDeps: {
    esbuildOptions: {
      treeShaking: true,
      minify: true,
      charset: 'utf8',
      sourcemap: false,
      logLevel: 'info',
      color: true,
      incremental: true,
    }
  }
})
