import Vue from "vue"
import vuex from 'vuex'

import App from "./App.vue"
import router from "./router"
import store from "./store"
import ElementUI from "element-ui"
import 'element-ui/lib/theme-chalk/index.css'

import "./router/router-config"  // 路由守卫



import axios from 'axios'
import qs from 'qs'
// 对vxe-table的引用
import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'
import md5 from 'js-md5'; // md5加密文件
Vue.prototype.$qs=qs
Vue.prototype.$md5 = md5;

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(VXETable)
Vue.use(vuex)

// 设置v-throttle自定义指令
Vue.directive('throttle', {
  bind: (el,binding) => {
    let throttleTime = binding.value;
    if(!throttleTime) throttleTime = 2000
    let cbFun;
    el.addEventListener('click',event => {
      if(!cbFun) {
        cbFun = setTimeout(() => {
          cbFun = null
        },throttleTime)
      }else {
        event && event.stopImmediatePropagation();
      }
    },true)
  }
})


Vue.prototype.$axios = axios
axios.defaults.baseURL = '/api';
axios.defaults.headers.post['Content-Type'] = 'application/json';

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app")