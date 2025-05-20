import { defineRouter } from '#q-app/wrappers'
import { LocalStorage } from 'quasar'
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from 'vue-router'
import routes from './routes'

function isAuthenticated() {
  return !!LocalStorage.getItem('@petcare-token')
}

export default defineRouter(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE),
  })

  Router.beforeEach((to, from, next) => {
    const publicPages = ['/', '/register']
    const isPublic = publicPages.includes(to.path)

    if (!isPublic && !isAuthenticated()) {
      next('/login')
    } else {
      next()
    }
  })

  return Router
})
