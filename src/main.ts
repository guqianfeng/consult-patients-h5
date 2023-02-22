import { createApp } from 'vue'
import { createPinia } from 'pinia'

// 导入根组件
import App from './App.vue'
import router from './router'

// 注意引入vant样式必须要在main.scss之前，因为我们的样式是要覆盖vant的样式的
import 'vant/lib/index.css'
import './styles/main.scss'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
