
// #ifndef VUE3
import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import App from './App.vue'
import request, { get, post, put } from './utils/request.js'
import * as api from './utils/api.js'

export function createApp() {
  const app = createSSRApp(App)
  // 挂载到全局，方便各页面使用
  app.config.globalProperties.$request = request
  app.config.globalProperties.$get = get
  app.config.globalProperties.$post = post
  app.config.globalProperties.$put = put
  return {
    app
  }
}
// #endif