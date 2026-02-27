import { createButton } from '../components/Button'
import { GAME_GOALS, getGameProgress, isAllGamesMaxed } from '../utils/gameProgress'

const gameOptions = [
  {
    id: 'quiz',
    route: '/quiz',
    title: 'Квиз',
    description: 'Классический формат с вопросами, объяснениями и итоговым баллом.'
  },
  {
    id: 'matching',
    route: '/matching',
    title: 'Матчинг',
    description: 'Сопоставьте продукт и функцию через быстрые тапы.'
  },
  {
    id: 'snake',
    route: '/snake',
    title: 'Змейка',
    description: 'Мини-аркада: собирайте квадратики и растите змейку.'
  }
]

export const renderGameSelectPage = (root, { onSelectGame }) => {
  const progress = getGameProgress()
  const allMaxed = isAllGamesMaxed(progress)

  const getStatsByGame = (gameId) => {
    if (gameId === 'quiz') {
      const gameProgress = progress.quiz
      return {
        status: gameProgress.isMax ? 'Максимум' : 'В процессе',
        isMax: gameProgress.isMax,
        resultText: gameProgress.played
          ? `Лучший результат: ${gameProgress.bestScore}/${GAME_GOALS.quizMaxScore}`
          : `Лучший результат: —/${GAME_GOALS.quizMaxScore}`,
        goalText: `Цель: ${GAME_GOALS.quizMaxScore}/${GAME_GOALS.quizMaxScore}`
      }
    }

    if (gameId === 'matching') {
      const gameProgress = progress.matching

      return {
        status: gameProgress.isMax ? 'Максимум' : 'В процессе',
        isMax: gameProgress.isMax,
        resultText: gameProgress.played
          ? `Лучший результат: ${gameProgress.bestMatched}/${GAME_GOALS.matchingTargetPairs} пар`
          : `Лучший результат: 0/${GAME_GOALS.matchingTargetPairs} пар`,
        goalText: `Цель: собрать ${GAME_GOALS.matchingTargetPairs} пар`
      }
    }

    const gameProgress = progress.snake
    return {
      status: gameProgress.isMax ? 'Максимум' : 'В процессе',
      isMax: gameProgress.isMax,
      resultText: gameProgress.played
        ? `Лучший результат: ${gameProgress.bestScore} очков`
        : 'Лучший результат: —',
      goalText: `Цель: ${GAME_GOALS.snakeTargetScore} очков`
    }
  }

  const page = document.createElement('section')
  page.className = 'page page--games'

  const card = document.createElement('div')
  card.className = 'card card--games'

  const title = document.createElement('h1')
  title.className = 'title'
  title.textContent = 'Выбор игры'

  const subtitle = document.createElement('p')
  subtitle.className = 'subtitle'
  subtitle.textContent = 'Выберите режим и переходите к игре.'

  const rules = document.createElement('p')
  rules.className = 'games-rules'
  rules.textContent = 'Задача: набрать максимальное количество очков в каждой игре.'

  const list = document.createElement('div')
  list.className = 'games-list'

  gameOptions.forEach((option) => {
    const stats = getStatsByGame(option.id)

    const item = document.createElement('article')
    item.className = 'game-option'

    const head = document.createElement('div')
    head.className = 'game-option-head'

    const heading = document.createElement('h2')
    heading.className = 'game-option-title'
    heading.textContent = option.title

    const status = document.createElement('span')
    status.className = `game-option-status ${stats.isMax ? 'game-option-status--max' : 'game-option-status--pending'}`
    status.textContent = stats.status

    const description = document.createElement('p')
    description.className = 'game-option-description'
    description.textContent = option.description

    const result = document.createElement('p')
    result.className = 'game-option-meta'
    result.textContent = stats.resultText

    const goal = document.createElement('p')
    goal.className = 'game-option-meta game-option-meta--goal'
    goal.textContent = stats.goalText

    const startButton = createButton({
      text: 'Играть',
      variant: 'solid',
      onClick: () => onSelectGame(option.route)
    })
    startButton.classList.add('game-option-button')

    head.append(heading, status)
    item.append(head, description, result, goal, startButton)
    list.append(item)
  })

  card.append(title, subtitle, rules, list)

  if (allMaxed) {
    const giftCard = document.createElement('section')
    giftCard.className = 'gift-card'

    const giftTitle = document.createElement('h3')
    giftTitle.className = 'gift-title'
    giftTitle.textContent = 'Все игры пройдены идеально!'

    const giftText = document.createElement('p')
    giftText.className = 'gift-text'
    giftText.textContent = 'Отличный результат. Мы подготовили для вас подарок.'

    const giftButton = createButton({
      text: 'Получить подарок',
      variant: 'solid'
    })
    giftButton.classList.add('gift-button')

    const giftHint = document.createElement('p')
    giftHint.className = 'gift-hint'

    giftButton.addEventListener('click', () => {
      giftHint.textContent = 'Отправьте защищенную почту в заявке, и мы вышлем подарок.'
    })

    giftCard.append(giftTitle, giftText, giftButton, giftHint)
    card.append(giftCard)
  }

  page.append(card)
  root.append(page)
}
