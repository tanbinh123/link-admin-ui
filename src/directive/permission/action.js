import store from '@/store'

export default {
  inserted(el, binding, vnode) {
    const { value } = binding
    const permissions = store.getters.permissions
    if (value) {
      const hasPermission = permissions.some(perm => {
        return value == perm.permissionFlag
      })
      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      el.parentNode && el.parentNode.removeChild(el)
    }
  }
}
