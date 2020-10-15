import { login, logout, getInfo } from '@/api/permission/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const state = {
  token: getToken(),
  userinfo: null,
  roles: [],
  menus: [],
  permissions: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_USER: (state, userinfo) => {
    state.userinfo = userinfo
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_MENUS: (state, menus) => {
    state.menus = menus
  },
  SET_PERMISSIONS: (state, permissions) => {
    state.permissions = permissions
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        commit('SET_TOKEN', response.result)
        setToken(response.result)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        if (!response) {
          reject('Verification failed, please Login again.')
        }
        const userinfo = response.result
        if (!userinfo || userinfo == null) {
          reject('getInfo: userinfo must be a non-null object!')
        }
        const { roles, menus, permissions } = userinfo
        // roles must be a non-empty array
        if (!roles || roles.length <= 0) {
          reject('getInfo: roles must be a non-null array!')
        }
        if (!menus || menus.length <= 0) {
          reject('getInfo: menus must be a non-null array!')
        }
        const rolesName = []
        for (var rname of roles) {
          rolesName.push(rname.name)
        }

        commit('SET_USER', userinfo)
        commit('SET_ROLES', rolesName)
        commit('SET_MENUS', menus)
        commit('SET_PERMISSIONS', permissions)
        // resolve(response.result)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_USER', null)
        commit('SET_ROLES', [])
        commit('SET_MENUS', [])
        commit('SET_PERMISSIONS', [])
        removeToken()
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      removeToken()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
