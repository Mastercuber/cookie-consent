import { createApp } from 'vue';
import { createI18n } from 'vue-i18n';
import App from './App.vue';

const app = createApp(App)
const i18n = createI18n({
    locale: 'en'
})
app.use(i18n).mount('#app')
