import Vue from 'vue'
import VueRouter from 'vue-router'
import LoginView from '../views/LoginView.vue'
import OrdersView from '../views/OrdersView.vue'
import ParcelsView from '../views/ParcelsView.vue'
import AboutView from '../views/AboutView.vue'
import store from '../store/index.js'
import orderDetail from '../views/OrderDetailView.vue'

Vue.use(VueRouter)

const routes = [{
    path: '/',
    name: 'orders',
    component: OrdersView,
    meta: {

      // Force authentifaction.
      requiresAuth: true
    }
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/orderDetail/:id',
    name: 'orderDetail',
    component: orderDetail,
    props: true,
    meta: {

      // Force authentifaction.
      requiresAuth: true
    }
  },
  {
    path: '/parcels',
    name: 'parcels',
    component: ParcelsView,
    meta: {

      // Force authentifaction.
      requiresAuth: true
    }
  },
  {
    path: '/about',
    name: 'about',
    component: AboutView
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {

    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (! store.getters.isLoggedIn) {
      next({ name: 'login' })
    } else {

      // Already logged.
      next()
    }
  } else {
    // Does not require auth.
    next() 
  }
})

export default router
