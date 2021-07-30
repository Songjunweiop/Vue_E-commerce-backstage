import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// import ElementUI from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';

//导入fas图标
import '@fortawesome/fontawesome-free/js/all.js'
import '@fortawesome/fontawesome-free/css/all.css'

// 导入全局样式表
import './assets/css/global.css'
import TreeTable from 'vue-table-with-tree-grid'

// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

// 导入axios
import axios from 'axios'
// 配置请求的根路径
axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'
// axios.defaults.baseURL = 'http://timemeetyou.com:8889/api/private/v1/'
// axios.defaults.baseURL = 'http://119.23.53.78:8888/api/private/v1/'
// axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

Vue.prototype.$http = axios
axios.defaults.headers.post['Content-Type'] =
  'application/x-www-form-urlencoded'

axios.interceptors.request.use(
  function (config) {
    // 拦截每次请求,携带token
    // console.log(config)
    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error)
    // console.log('wrong')
  }
)

Vue.config.productionTip = false

// 注册组件
Vue.component('tree-table', TreeTable)
Vue.use(VueQuillEditor)
// 注册全局的过滤器
Vue.filter('dateFormat', function (originVal) {
  const dt = new Date(originVal * 1000)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')
  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
// Vue.use(ElementUI)

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
