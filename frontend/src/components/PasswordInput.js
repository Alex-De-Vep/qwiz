import { createInputField } from './InputField'

export const createPasswordInput = ({ id = 'password', label = 'Пароль', placeholder = 'Введите пароль' } = {}) => {
  return createInputField({
    id,
    label,
    type: 'password',
    placeholder,
    name: id,
    autoComplete: 'current-password'
  })
}
