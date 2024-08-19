import { createApp } from 'vue'
import { createPinia } from 'pinia'

import pinia from './stores/index'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css';
import App from './App.vue'
import router from './router'
import type { Component } from 'vue'

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }
app.use(pinia)
app.use(router)

app.mount('#app')
