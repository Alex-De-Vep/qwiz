export const SNAKE_GRID_SIZE = 18
export const SNAKE_SPEED_MS = 200

export const directionDelta = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 }
}

export const oppositeDirection = {
  up: 'down',
  down: 'up',
  left: 'right',
  right: 'left'
}

const randomSnakeCell = () => ({
  x: Math.floor(Math.random() * SNAKE_GRID_SIZE),
  y: Math.floor(Math.random() * SNAKE_GRID_SIZE)
})

export const createSnakeFood = (snake) => {
  let food = randomSnakeCell()

  while (snake.some((segment) => segment.x === food.x && segment.y === food.y)) {
    food = randomSnakeCell()
  }

  return food
}

export const createSnakeRound = () => {
  const snake = [{ x: 8, y: 8 }]

  return {
    snake,
    direction: 'right',
    nextDirection: 'right',
    food: createSnakeFood(snake),
    score: 0,
    status: 'idle',
    speedMs: SNAKE_SPEED_MS
  }
}
