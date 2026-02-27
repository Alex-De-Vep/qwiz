import { createButton } from '../components/Button'
import { createGamePageLayout } from '../components/GamePageLayout'
import { clearNode } from '../utils/dom'
import {
  SNAKE_GRID_SIZE,
  directionDelta,
  oppositeDirection,
  createSnakeRound,
  createSnakeFood
} from '../utils/snakeGame'
import { saveSnakeResult } from '../utils/gameProgress'

export const renderSnakePage = (root, options = {}) => {
  const onBackToGames = typeof options.onBackToGames === 'function' ? options.onBackToGames : null

  let snakeRound = createSnakeRound()
  let runtimeCleanup = () => {}

  const layout = createGamePageLayout({
    subtitle: 'Мини-игра: растите змейку, собирая квадратики',
    onBackToGames,
    getContextText: () => 'Сейчас мини-игра: растите змейку и собирайте квадратики.'
  })

  const content = layout.content

  const updateProgress = () => {
    const label = snakeRound.status === 'gameover' ? 'Змейка: раунд завершен' : 'Змейка: собирайте квадратики'
    const score = `Очки: ${snakeRound.score}`
    const percent = Math.min(snakeRound.score * 8, 100)

    layout.setProgress({ label, score, percent })
  }

  const cleanupRuntime = () => {
    runtimeCleanup()
    runtimeCleanup = () => {}
  }

  const renderSnake = () => {
    cleanupRuntime()
    updateProgress()
    layout.renderGuidePanel()
    clearNode(content)

    const shell = document.createElement('div')
    shell.className = 'snake-shell'

    const intro = document.createElement('p')
    intro.className = 'snake-intro'
    intro.textContent = 'Ешьте красные квадратики, чтобы змейка росла. Стены и собственный хвост опасны.'

    const status = document.createElement('p')
    status.className = 'snake-status'

    const canvasWrap = document.createElement('div')
    canvasWrap.className = 'snake-canvas-wrap'

    const canvas = document.createElement('canvas')
    canvas.className = 'snake-canvas'
    canvas.width = SNAKE_GRID_SIZE * 20
    canvas.height = SNAKE_GRID_SIZE * 20
    canvasWrap.append(canvas)

    const actions = document.createElement('div')
    actions.className = 'snake-actions'

    const startButton = createButton({
      text: 'Старт',
      variant: 'solid'
    })
    startButton.classList.add('snake-action-button')

    const pauseButton = createButton({
      text: 'Пауза',
      variant: 'outline'
    })
    pauseButton.classList.add('snake-action-button')

    const restartButton = createButton({
      text: 'Новая игра',
      variant: 'outline',
      onClick: () => {
        snakeRound = createSnakeRound()
        renderSnake()
      }
    })
    restartButton.classList.add('snake-action-button')

    actions.append(startButton, pauseButton, restartButton)

    const controlsLabel = document.createElement('p')
    controlsLabel.className = 'snake-controls-label'
    controlsLabel.textContent = 'Управление: стрелки, WASD или тапы по кнопкам ниже.'

    const pad = document.createElement('div')
    pad.className = 'snake-pad'

    const upButton = createButton({ text: '↑', variant: 'outline' })
    upButton.classList.add('snake-pad-button')
    upButton.dataset.direction = 'up'

    const leftButton = createButton({ text: '←', variant: 'outline' })
    leftButton.classList.add('snake-pad-button')
    leftButton.dataset.direction = 'left'

    const rightButton = createButton({ text: '→', variant: 'outline' })
    rightButton.classList.add('snake-pad-button')
    rightButton.dataset.direction = 'right'

    const downButton = createButton({ text: '↓', variant: 'outline' })
    downButton.classList.add('snake-pad-button')
    downButton.dataset.direction = 'down'

    const emptyTopLeft = document.createElement('span')
    const emptyTopRight = document.createElement('span')
    const emptyCenter = document.createElement('span')
    const emptyBottomLeft = document.createElement('span')
    const emptyBottomRight = document.createElement('span')
    ;[emptyTopLeft, emptyTopRight, emptyCenter, emptyBottomLeft, emptyBottomRight].forEach((cell) => {
      cell.className = 'snake-pad-empty'
    })

    pad.append(
      emptyTopLeft,
      upButton,
      emptyTopRight,
      leftButton,
      emptyCenter,
      rightButton,
      emptyBottomLeft,
      downButton,
      emptyBottomRight
    )

    shell.append(intro, status, canvasWrap, actions, controlsLabel, pad)
    content.append(shell)

    const ctx = canvas.getContext('2d')
    let tickerId = null
    let touchStartX = 0
    let touchStartY = 0

    const stopTicker = () => {
      if (!tickerId) {
        return
      }
      clearInterval(tickerId)
      tickerId = null
    }

    const setSnakeDirection = (nextDirection) => {
      if (oppositeDirection[nextDirection] === snakeRound.direction) {
        return
      }
      snakeRound.nextDirection = nextDirection
    }

    const drawSnake = () => {
      if (!ctx) {
        return
      }

      const cell = canvas.width / SNAKE_GRID_SIZE
      ctx.fillStyle = '#f8fafc'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.strokeStyle = '#edf0f4'
      ctx.lineWidth = 1
      for (let line = 0; line <= SNAKE_GRID_SIZE; line += 1) {
        const point = line * cell
        ctx.beginPath()
        ctx.moveTo(point, 0)
        ctx.lineTo(point, canvas.height)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(0, point)
        ctx.lineTo(canvas.width, point)
        ctx.stroke()
      }

      ctx.fillStyle = '#e53935'
      ctx.fillRect(snakeRound.food.x * cell + 2, snakeRound.food.y * cell + 2, cell - 4, cell - 4)

      snakeRound.snake.forEach((segment, segmentIndex) => {
        ctx.fillStyle = segmentIndex === 0 ? '#a11c1c' : '#d32f2f'
        ctx.fillRect(segment.x * cell + 2, segment.y * cell + 2, cell - 4, cell - 4)
      })
    }

    const updateStatus = () => {
      status.classList.remove('snake-status--warn', 'snake-status--good')

      if (snakeRound.status === 'gameover') {
        status.textContent = 'Столкновение. Нажмите «Новая игра», чтобы начать заново.'
        status.classList.add('snake-status--warn')
        startButton.disabled = true
        pauseButton.disabled = true
        return
      }

      if (snakeRound.status === 'running') {
        status.textContent = 'Игра идет. Держите темп.'
        status.classList.add('snake-status--good')
        startButton.disabled = true
        pauseButton.disabled = false
        return
      }

      if (snakeRound.status === 'paused') {
        status.textContent = 'Пауза. Нажмите «Старт», чтобы продолжить.'
        startButton.disabled = false
        pauseButton.disabled = true
        return
      }

      status.textContent = 'Нажмите «Старт», чтобы начать раунд.'
      startButton.disabled = false
      pauseButton.disabled = true
    }

    const refreshView = () => {
      updateProgress()
      updateStatus()
      drawSnake()
    }

    const tick = () => {
      if (snakeRound.status !== 'running') {
        return
      }

      snakeRound.direction = snakeRound.nextDirection
      const nextDelta = directionDelta[snakeRound.direction]
      const head = snakeRound.snake[0]
      const newHead = {
        x: head.x + nextDelta.x,
        y: head.y + nextDelta.y
      }

      const isWallCollision =
        newHead.x < 0 || newHead.y < 0 || newHead.x >= SNAKE_GRID_SIZE || newHead.y >= SNAKE_GRID_SIZE

      const isBodyCollision = snakeRound.snake.some(
        (segment) => segment.x === newHead.x && segment.y === newHead.y
      )

      if (isWallCollision || isBodyCollision) {
        snakeRound.status = 'gameover'
        saveSnakeResult(snakeRound.score)
        stopTicker()
        refreshView()
        return
      }

      snakeRound.snake.unshift(newHead)
      if (newHead.x === snakeRound.food.x && newHead.y === snakeRound.food.y) {
        snakeRound.score += 1
        saveSnakeResult(snakeRound.score)
        snakeRound.food = createSnakeFood(snakeRound.snake)
      } else {
        snakeRound.snake.pop()
      }

      refreshView()
    }

    const startSnake = () => {
      if (snakeRound.status === 'gameover') {
        return
      }

      snakeRound.status = 'running'
      stopTicker()
      tickerId = setInterval(tick, snakeRound.speedMs)
      refreshView()
    }

    const pauseSnake = () => {
      if (snakeRound.status !== 'running') {
        return
      }

      snakeRound.status = 'paused'
      stopTicker()
      refreshView()
    }

    const onPadPress = (event) => {
      const direction = event.currentTarget.dataset.direction
      if (!direction) {
        return
      }
      setSnakeDirection(direction)
      if (snakeRound.status === 'idle' || snakeRound.status === 'paused') {
        startSnake()
      }
    }

    const onKeyDown = (event) => {
      const directionByKey = {
        ArrowUp: 'up',
        ArrowDown: 'down',
        ArrowLeft: 'left',
        ArrowRight: 'right',
        w: 'up',
        s: 'down',
        a: 'left',
        d: 'right'
      }

      const direction = directionByKey[event.key]
      if (!direction) {
        return
      }

      event.preventDefault()
      setSnakeDirection(direction)
      if (snakeRound.status === 'idle' || snakeRound.status === 'paused') {
        startSnake()
      }
    }

    const onTouchStart = (event) => {
      const point = event.changedTouches[0]
      touchStartX = point.clientX
      touchStartY = point.clientY
    }

    const onTouchEnd = (event) => {
      const point = event.changedTouches[0]
      const deltaX = point.clientX - touchStartX
      const deltaY = point.clientY - touchStartY

      if (Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10) {
        return
      }

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        setSnakeDirection(deltaX > 0 ? 'right' : 'left')
      } else {
        setSnakeDirection(deltaY > 0 ? 'down' : 'up')
      }

      if (snakeRound.status === 'idle' || snakeRound.status === 'paused') {
        startSnake()
      }
    }

    startButton.addEventListener('click', startSnake)
    pauseButton.addEventListener('click', pauseSnake)
    upButton.addEventListener('click', onPadPress)
    leftButton.addEventListener('click', onPadPress)
    rightButton.addEventListener('click', onPadPress)
    downButton.addEventListener('click', onPadPress)
    window.addEventListener('keydown', onKeyDown)
    canvas.addEventListener('touchstart', onTouchStart, { passive: true })
    canvas.addEventListener('touchend', onTouchEnd, { passive: true })

    refreshView()

    runtimeCleanup = () => {
      stopTicker()
      window.removeEventListener('keydown', onKeyDown)
      canvas.removeEventListener('touchstart', onTouchStart)
      canvas.removeEventListener('touchend', onTouchEnd)
    }
  }

  renderSnake()
  root.append(layout.page)

  return () => {
    cleanupRuntime()
    layout.destroy()
  }
}
