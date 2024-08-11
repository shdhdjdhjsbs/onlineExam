import { createApp } from 'vue'

import pinia from './stores/index'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import App from './App.vue'
import router from './router'


const app = createApp(App)
Object.entries(ElementPlusIconsVue).forEach(([key, component]) => {
    app.component(key, component);
  });
app.use(pinia)
app.use(router)

app.mount('#app')
