const normalizeRoute = (hash) => {
  if (!hash || hash === '#') {
    return '/login'
  }

  return hash.replace('#', '')
}

export const getRoute = () => normalizeRoute(window.location.hash)

export const navigateTo = (route) => {
  window.location.hash = route
}

export const onRouteChange = (handler) => {
  window.addEventListener('hashchange', handler)
}
