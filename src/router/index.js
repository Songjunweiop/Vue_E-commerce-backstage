import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () =>
  import(/* webpackChunkName:"login_home_welcome" */ '@/components/Login.vue')
const Home = () =>
  import(/* webpackChunkName:"login_home_welcome" */ '@/components/Home.vue')
const Welcome = () =>
  import(/* webpackChunkName:"login_home_welcome" */ '@/components/Welcome.vue')
const Users = () =>
  import(/* webpackChunkName:"user" */ '@/components/user/Users.vue')
const Rights = () =>
  import(/* webpackChunkName:"power" */ '@/components/power/Rights.vue')
const Roles = () =>
  import(/* webpackChunkName:"power" */ '@/components/power/Roles.vue')
const Cate = () =>
  import(/* webpackChunkName:"goods" */ '@/components/good/Cate.vue')
const Params = () =>
  import(/* webpackChunkName:"goods" */ '@/components/good/Params.vue')
const Goods = () =>
  import(/* webpackChunkName:"goods" */ '@/components/good/Goods.vue')
const Add = () =>
  import(/* webpackChunkName:"goods" */ '@/components/good/Add.vue')
const Order = () =>
  import(/* webpackChunkName:"order" */ '@/components/order/Order.vue')
const Report = () =>
  import(/* webpackChunkName:"report" */ '@/components/reports/Report.vue')
const Vips = () => import('@/components/vip/Vips.vue')

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
        { path: '/reports', component: Report },
        { path: '/vips', component: Vips },
      ],
    },
  ],
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
