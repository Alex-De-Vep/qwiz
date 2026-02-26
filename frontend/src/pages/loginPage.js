import { createInputField } from '../components/InputField'
import { createPasswordInput } from '../components/PasswordInput'
import { createButton } from '../components/Button'

export const renderLoginPage = (root, { onLogin }) => {
  const page = document.createElement('section')
  page.className = 'page page--auth'

  const card = document.createElement('form')
  card.className = 'card card--auth'

  const brand = document.createElement('div')
  brand.className = 'auth-brand'

  const brandBadge = document.createElement('span')
  brandBadge.className = 'auth-badge'
  brandBadge.textContent = 'Q'

  const brandText = document.createElement('span')
  brandText.className = 'auth-brand-text'
  brandText.textContent = 'Qwiz ID'

  brand.append(brandBadge, brandText)

  const title = document.createElement('h1')
  title.className = 'title'
  title.textContent = 'Вход'

  const subtitle = document.createElement('p')
  subtitle.className = 'subtitle'
  subtitle.textContent = 'Введите логин и пароль, чтобы продолжить.'

  const loginField = createInputField({
    id: 'login',
    label: 'Логин',
    placeholder: 'Логин',
    autoComplete: 'username'
  })

  const passwordField = createPasswordInput({
    id: 'password',
    label: 'Пароль',
    placeholder: 'Пароль'
  })

  const submitButton = createButton({
    text: 'Войти',
    type: 'submit',
    variant: 'solid',
    fullWidth: true
  })

  card.addEventListener('submit', (event) => {
    event.preventDefault()
    onLogin({
      login: loginField.input.value,
      password: passwordField.input.value
    })
  })

  const legal = document.createElement('p')
  legal.className = 'auth-legal'
  legal.textContent = 'Нажимая «Войти», вы подтверждаете начало сессии.'

  card.append(brand, title, subtitle, loginField.element, passwordField.element, submitButton, legal)
  page.append(card)
  root.append(page)
}
