import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueI18n from "@intlify/vite-plugin-vue-i18n"
import VueTypeImports from 'vite-plugin-vue-type-imports'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VueTypeImports(),
    vueI18n({
      // if you want to use Vue I18n Legacy API, you need to set `compositionOnly: false`
      //compositionOnly: false,

      // you need to set i18n resource including paths !
      include: path.resolve(__dirname, 'src/locales/**'),
      fullInstall: false
    })
  ],
  build: {
    target: 'esnext',
    lib: {
      entry: path.resolve(__dirname, 'src/main.ts'),
      name: 'CookieConsent',
      formats: ['es', 'umd'],
      fileName: (format) => `cookie-consent.${format}.js`
    },
    ssr: false,
    minify: true,
    reportCompressedSize: true,
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue'
        }
      }
      /*output: {
        entryFileNames: `[name].js`,
        chunkFileNames: `[name].js`,
        assetFileNames: `[name].[ext]`
      }*/
    }
  },
  assetsInclude: ['src/assets/*', 'src/locales/*'],
})
