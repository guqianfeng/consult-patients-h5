import { createApp } from 'vue'
import { createPinia } from 'pinia'

// 导入根组件
import App from './App.vue'
import router from './router'

import './styles/main.scss'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
