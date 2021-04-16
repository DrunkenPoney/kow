import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import PrimeVue from 'primevue/config'
import 'primevue/resources/themes/bootstrap4-dark-blue/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.scss'
import '@/assets/styles.scss'
import ToastService from 'primevue/toastservice'

const app = createApp(App)
app.use(store)
app.use(router)
app.use(PrimeVue)
app.use(ToastService)
app.mount('#app')
