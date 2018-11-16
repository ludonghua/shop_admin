// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/common.css'
// 把axios封装到Vue 的原型上
import axios from 'axios'
import ElTreeGrid from 'element-tree-grid'
// 导入moment、
import moment from 'moment'
// 定义一个全局时间过滤器
Vue.filter('dateFilter', (input, format = 'YYYY-MM-DD HH:mm:ss') => {
  return moment(input * 1000).format(format)
})
// 创建一个全局组件
Vue.component('el-element-tree-column', ElTreeGrid)
// 富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.use(VueQuillEditor)
Vue.prototype.axios = axios
// 配置axios的全局的默认baseURL
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
// 设置拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  // console.log("拦截到了请求的", config)
  config.headers.Authorization = localStorage.getItem('token')
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})
// 添加响应拦截器
axios.interceptors.response.use(function (res) {
  // 对响应数据做点什么
  // console.log("拦截到了响应时", res)
  return res.data
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error)
})
Vue.use(ElementUI)
Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>'
})
