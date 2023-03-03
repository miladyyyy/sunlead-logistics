import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import BaiduMap from 'vue-baidu-map'

import components from './components'

import '@/style/index.scss'
// import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI)
Vue.use(components)
Vue.use(BaiduMap, {
  // ak 是在百度地图开发者平台申请的密钥 详见 http://lbsyun.baidu.com/apiconsole/key */
  ak: 'OgQ0kRXliKaju0UOpTqKTUVjjkxDRnER'
})
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
