import variables from '@/styles/element-variables.scss'
import defaultSettings from '@/settings'

const { layout, showSettings, tagsView, fixedHeader, sidebarLogo, size, device, sidebarColor, colorWeak } = defaultSettings

const state = {
  layout: localStorage.getItem('layout') || layout,
  sidebar: {
    opened: localStorage.getItem('sidebarStatus') !== null ? JSON.parse(localStorage.getItem('sidebarStatus')) : true,
    withoutAnimation: false
  },
  device: device,
  size: localStorage.getItem('size') || size,
  theme: variables.theme,
  showSettings: localStorage.getItem('showSettings') !== null ? JSON.parse(localStorage.getItem('showSettings')) : showSettings,
  tagsView: localStorage.getItem('tagsView') !== null ? JSON.parse(localStorage.getItem('tagsView')) : tagsView,
  fixedHeader: localStorage.getItem('fixedHeader') !== null ? JSON.parse(localStorage.getItem('fixedHeader')) : fixedHeader,
  sidebarLogo: localStorage.getItem('sidebarLogo') !== null ? JSON.parse(localStorage.getItem('sidebarLogo')) : sidebarLogo,
  sidebarColor: localStorage.getItem('sidebarColor') || sidebarColor,
  colorWeak: localStorage.getItem('colorWeak') !== null ? JSON.parse(localStorage.getItem('colorWeak')) : colorWeak,
}

const mutations = {
  TOGGLE_SIDEBAR: state => {
    state.sidebar.opened = !state.sidebar.opened
    state.sidebar.withoutAnimation = false
    if (state.sidebar.opened) {
      localStorage.setItem('sidebarStatus', true)
    } else {
      localStorage.setItem('sidebarStatus', false)
    }
  },
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    localStorage.setItem('sidebarStatus', false)
    state.sidebar.opened = false
    state.sidebar.withoutAnimation = withoutAnimation
  },
  TOGGLE_DEVICE: (state, device) => {
    state.device = device
  },
  SET_SIZE: (state, size) => {
    state.size = size
    localStorage.setItem('size', size)
  },
  CHANGE_SETTING: (state, { key, value }) => {
    state[key] = value
    localStorage.setItem(key, value)
  }
}

const actions = {
  toggleSideBar({ commit }) {
    commit('TOGGLE_SIDEBAR')
  },
  closeSideBar({ commit }, { withoutAnimation }) {
    commit('CLOSE_SIDEBAR', withoutAnimation)
  },
  toggleDevice({ commit }, device) {
    commit('TOGGLE_DEVICE', device)
  },
  setSize({ commit }, size) {
    commit('SET_SIZE', size)
  },
  changeSetting({ commit }, data) {
    commit('CHANGE_SETTING', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
