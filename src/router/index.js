import Vue from 'vue'
import VueRouter from 'vue-router'
// import Login from '@/components/Login.vue'
// import Home from '@/components/Home.vue'
// import Welcome from '@/components/Welcome'
// import Users from '@/components/user/Users'
// import Goods from '@/components/good/Goods'
// import Rights from '@/components/power/Rights'
// import Roles from '@/components/power/Roles'
// import Cate from '@/components/good/Cate'
// import Params from '@/components/good/Params'
// import Add from '@/components/good/Add'
// import Order from '@/components/order/Order'
// import Report from '@/components/reports/Report'

const Login = () =>
  import ( /* webpackChunkName:"login_home_welcome" */ '@/components/Login.vue')
  // import Login from './components/Login.vue'
const Home = () =>
  import ( /* webpackChunkName:"login_home_welcome" */ '@/components/Home.vue')
  // import Home from './components/Home.vue'
const Welcome = () =>
  import ( /* webpackChunkName:"login_home_welcome" */ '@/components/Welcome.vue')
  // import Welcome from './components/Welcome.vue'
const Users = () =>
  import ( /* webpackChunkName:"user" */ '@/components/user/Users.vue')
  // import Users from './components/user/Users.vue'
const Rights = () =>
  import ( /* webpackChunkName:"power" */ '@/components/power/Rights.vue')
  // import Rights from './components/power/Rights.vue'
const Roles = () =>
  import ( /* webpackChunkName:"power" */ '@/components/power/Roles.vue')
  // import Roles from './components/power/Roles.vue'
const Cate = () =>
  import ( /* webpackChunkName:"goods" */ '@/components/good/Cate.vue')
  // import Cate from './components/goods/Cate.vue'
const Params = () =>
  import ( /* webpackChunkName:"goods" */ '@/components/good/Params.vue')
  // import Params from './components/goods/Params.vue'
const Goods = () =>
  import ( /* webpackChunkName:"goods" */ '@/components/good/Goods.vue')
  // import GoodList from './components/goods/List.vue'
const Add = () =>
  import ( /* webpackChunkName:"goods" */ '@/components/good/Add.vue')
  // import GoodAdd from './components/goods/Add.vue'
const Order = () =>
  import ( /* webpackChunkName:"order" */ '@/components/order/Order.vue')
  // import Order from './components/order/Order.vue'
const Report = () =>
  import ( /* webpackChunkName:"report" */ '@/components/reports/Report.vue')
  // import Report from './components/report/Report.vue'



Vue.use(VueRouter)



const router = new VueRouter({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    {
      path: '/home',
      component: Home,
      // redirect: '/welcome', //重定向
      children: [
        { path: '/', redirect: '/welcome' },
        { path: '/welcome', component: Welcome },
        { path: '/users', component: Users },
        { path: '/rights', component: Rights },
        { path: '/roles', component: Roles },
        { path: '/goods', component: Goods },
        { path: '/categories', component: Cate },
        { path: '/params', component: Params },
        { path: '/goods/add', component: Add },
        { path: '/orders', component: Order },
        { path: '/reports', component: Report }
      ]
    },

  ]
})
const routerPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error => error)
}

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 代表从哪个路径跳转而来
  // next 是一个函数，表示放行
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router