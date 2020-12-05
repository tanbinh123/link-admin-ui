import defaultSettings from '@/settings'

export function getToken() {
  return localStorage.getItem(defaultSettings.token)
}

export function setToken(token) {
  return localStorage.setItem(defaultSettings.token, token)
}

export function removeToken() {
  return localStorage.removeItem(defaultSettings.token)
}

