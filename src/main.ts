import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { globalRegister } from '@/global'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(globalRegister)
app.use(createPinia())
app.use(router)

app.mount('#app')
