import './style.css'
import { renderLoginPage } from './pages/loginPage'
import { renderQuizPage } from './pages/quizPage'
import { renderGameSelectPage } from './pages/gameSelectPage'
import { renderMatchingPage } from './pages/matchingPage'
import { renderSnakePage } from './pages/snakePage'
import { clearNode } from './utils/dom'
import { getRoute, navigateTo, onRouteChange } from './utils/router'

const app = document.getElementById('app')
let pageCleanup = null

const cleanupActivePage = () => {
  if (typeof pageCleanup === 'function') {
    pageCleanup()
  }
  pageCleanup = null
}

const render = () => {
  cleanupActivePage()
  clearNode(app)
  const { path } = getRoute()

  if (path === '/quiz') {
    pageCleanup = renderQuizPage(app, {
      onBackToGames: () => navigateTo('/games')
    })
    return
  }

  if (path === '/matching') {
    pageCleanup = renderMatchingPage(app, {
      onBackToGames: () => navigateTo('/games')
    })
    return
  }

  if (path === '/snake') {
    pageCleanup = renderSnakePage(app, {
      onBackToGames: () => navigateTo('/games')
    })
    return
  }

  if (path === '/games') {
    renderGameSelectPage(app, {
      onSelectGame: (route) => navigateTo(route)
    })
    return
  }

  renderLoginPage(app, {
    onLogin: () => navigateTo('/games')
  })
}

onRouteChange(render)

if (!window.location.hash) {
  navigateTo('/login')
}

render()
