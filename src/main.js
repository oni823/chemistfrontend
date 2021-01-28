import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'

Vue.use(ElementUI)

Vue.prototype.axios = axios

Vue.prototype.axios.interceptors.response.use(data => {
  // console.log(data.status);
  return data
})

Vue.prototype.axios.interceptors.request.use(config => {
  return config
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
