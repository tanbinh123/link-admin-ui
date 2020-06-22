import store from '@/store'

export default {
  inserted(el, binding, vnode) {
    const { value } = binding
    const permissions = store.getters && store.getters.permissions
    if (value && value instanceof Array) {
      if (value.length > 0) {
        const hasPermission = permissions.some(perm => {
          return value.includes(perm.permissionFlag)
        })
        if (!hasPermission) {
          el.parentNode && el.parentNode.removeChild(el)
        }
      }
    } else {
      el.parentNode && el.parentNode.removeChild(el)
    }
  }
}
