export const createButton = ({ text, type = 'button', variant = 'solid', fullWidth = false, onClick }) => {
  const button = document.createElement('button')
  button.type = type
  button.className = `button button--${variant}`

  if (fullWidth) {
    button.classList.add('button--full')
  }

  button.textContent = text

  if (onClick) {
    button.addEventListener('click', onClick)
  }

  return button
}
