import variables from '@/styles/element-variables.scss'
import defaultSettings from '@/settings'

const { showSettings, tagsView, fixedHeader, sidebarLogo } = defaultSettings

const state = {
  sidebar: {
    opened: localStorage.getItem('sidebarStatus') !== null ? JSON.parse(localStorage.getItem('sidebarStatus')) : true,
    withoutAnimation: false
  },
  device: 'desktop',
  size: localStorage.getItem('size') || 'medium',
  theme: variables.theme,
  showSettings: localStorage.getItem('showSettings') !== null ? JSON.parse(localStorage.getItem('showSettings')) : showSettings,
  tagsView: localStorage.getItem('tagsView') !== null ? JSON.parse(localStorage.getItem('tagsView')) : tagsView,
  fixedHeader: localStorage.getItem('fixedHeader') !== null ? JSON.parse(localStorage.getItem('fixedHeader')) : fixedHeader,
  sidebarLogo: localStorage.getItem('sidebarLogo') !== null ? JSON.parse(localStorage.getItem('sidebarLogo')) : sidebarLogo
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
    if (state.hasOwnProperty(key)) {
      state[key] = value
      localStorage.setItem(key, value)
    }
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
