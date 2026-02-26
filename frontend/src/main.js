import './style.css'
import { renderLoginPage } from './pages/loginPage'
import { renderQuizPage } from './pages/quizPage'
import { clearNode } from './utils/dom'
import { getRoute, navigateTo, onRouteChange } from './utils/router'

const app = document.getElementById('app')

const render = () => {
  clearNode(app)

  if (getRoute() === '/quiz') {
    renderQuizPage(app)
    return
  }

  renderLoginPage(app, {
    onLogin: () => navigateTo('/quiz')
  })
}

onRouteChange(render)

if (!window.location.hash) {
  navigateTo('/login')
}

render()
