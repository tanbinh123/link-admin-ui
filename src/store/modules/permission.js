
import { constantRoutes } from '@/router'
import store from '@/store'
import Layout from '@/layout'

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }) {
    return new Promise(resolve => {
      const asyncRouter = filterAsyncRouter(store.getters.menus)
      asyncRouter.push({ path: '*', redirect: '/404', hidden: true })
      commit('SET_ROUTES', asyncRouter)
      resolve(asyncRouter)
    })
  }
}

const filterAsyncRouter = (routers) => { // 遍历后台传来的路由字符串，转换为组件对象
  const accessedRouters = routers.filter(router => {
    if (router.component) {
      if (router.component === 'Layout' && router.root) { // Layout组件特殊处理
        router.component = Layout
      } else if (router.component === 'Layout') { // 处理多级菜单
        router.component = routerView()
      } else {
        const component = router.component
        router.component = loadView(component)
      }
    }
    if (router.children && router.children.length) {
      router.children = filterAsyncRouter(router.children)
    }
    return true
  })
  return accessedRouters
}

const routerView = () => {
  return () => import(`@/router/views`)
}
const loadView = (view) => {
  return (resolve) => require([`@/views${view}`], resolve)
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
