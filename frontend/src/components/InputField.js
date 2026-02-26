export const createInputField = ({
  id,
  label,
  type = 'text',
  placeholder = '',
  name = id,
  autoComplete
}) => {
  const field = document.createElement('label')
  field.className = 'field'
  field.setAttribute('for', id)

  const labelElement = document.createElement('span')
  labelElement.className = 'field-label'
  labelElement.textContent = label

  const input = document.createElement('input')
  input.className = 'field-input'
  input.id = id
  input.name = name
  input.type = type
  input.placeholder = placeholder
  if (autoComplete) {
    input.autocomplete = autoComplete
  }

  field.append(labelElement, input)

  return {
    element: field,
    input
  }
}
