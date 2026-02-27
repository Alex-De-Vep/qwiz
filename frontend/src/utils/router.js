const normalizeRoute = (hash) => {
  if (!hash || hash === '#') {
    return '/login'
  }

  return hash.replace('#', '')
}

export const getRoute = () => {
  const normalized = normalizeRoute(window.location.hash)
  const [path, query = ''] = normalized.split('?')
  const params = Object.fromEntries(new URLSearchParams(query))

  return { path, params }
}

export const navigateTo = (route, params = {}) => {
  const query = new URLSearchParams(params).toString()
  window.location.hash = query ? `${route}?${query}` : route
}

export const onRouteChange = (handler) => {
  window.addEventListener('hashchange', handler)
}
