import Vue, { createApp } from 'vue';
import { createI18n } from 'vue-i18n';
// @ts-ignore
import messages from '@intlify/vite-plugin-vue-i18n/messages';
import App from './App.vue';

const app = createApp(App)
const i18n = createI18n({
    legacy: true,
    locale: 'gb',
    messages
})
app.use(i18n)
app.mount('#app')
