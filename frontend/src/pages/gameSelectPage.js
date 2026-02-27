import { createButton } from '../components/Button'
import { clearNode } from '../utils/dom'
import { GAME_GOALS, getGameProgress, isAllGamesMaxed } from '../utils/gameProgress'
import { productGuide } from '../utils/productGuide'

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

const isMobileViewport = () => window.matchMedia('(max-width: 960px)').matches

const buildKnowledgeList = (titleText, items) => {
  const section = document.createElement('section')
  section.className = 'knowledge-section'

  const titleElement = document.createElement('p')
  titleElement.className = 'knowledge-section-title'
  titleElement.textContent = titleText

  const list = document.createElement('ul')
  list.className = 'knowledge-list'

  items.forEach((item) => {
    const li = document.createElement('li')
    li.textContent = item
    list.append(li)
  })

  section.append(titleElement, list)
  return section
}

const buildKnowledgeLinks = (links) => {
  const section = document.createElement('section')
  section.className = 'knowledge-section'

  const titleElement = document.createElement('p')
  titleElement.className = 'knowledge-section-title'
  titleElement.textContent = 'Ссылки'

  const list = document.createElement('div')
  list.className = 'knowledge-links'

  links.forEach((link) => {
    const anchor = document.createElement('a')
    anchor.className = 'knowledge-link'
    anchor.href = link.url
    anchor.target = '_blank'
    anchor.rel = 'noopener noreferrer'
    anchor.textContent = link.label
    list.append(anchor)
  })

  section.append(titleElement, list)
  return section
}

export const renderGameSelectPage = (root, { onSelectGame }) => {
  const progress = getGameProgress()
  const allMaxed = isAllGamesMaxed(progress)
  let isGuideOpen = false
  let activeGuideId = productGuide[0]?.id || ''

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

  const workspace = document.createElement('div')
  workspace.className = 'quiz-workspace quiz-workspace--games quiz-workspace--single'

  const card = document.createElement('div')
  card.className = 'card card--games quiz-window'

  const guideWindow = document.createElement('aside')
  guideWindow.className = 'card card--guide guide-window guide-window--hidden'

  const guideOverlay = document.createElement('div')
  guideOverlay.className = 'guide-overlay'

  const title = document.createElement('h1')
  title.className = 'title'
  title.textContent = 'Выбор игры'

  const subtitle = document.createElement('p')
  subtitle.className = 'subtitle'
  subtitle.textContent = 'Выберите режим и переходите к игре.'

  const rules = document.createElement('p')
  rules.className = 'games-rules'
  rules.textContent = 'Задача: набрать максимальное количество очков в каждой игре.'

  const headerActions = document.createElement('div')
  headerActions.className = 'games-header-actions'

  const guideToggle = createButton({
    text: 'Открыть базу знаний',
    variant: 'outline'
  })
  guideToggle.classList.add('guide-toggle-button')
  headerActions.append(guideToggle)

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

  card.append(title, subtitle, rules, headerActions, list)

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

  const closeGuide = () => {
    if (!isGuideOpen) {
      return
    }
    isGuideOpen = false
    renderGuidePanel()
  }

  const onResize = () => {
    if (isGuideOpen) {
      renderGuidePanel()
    }
  }

  const onKeyDown = (event) => {
    if (event.key === 'Escape') {
      closeGuide()
    }
  }

  const renderGuidePanel = () => {
    const selected = productGuide.find((item) => item.id === activeGuideId) || productGuide[0]
    const isMobile = isMobileViewport()
    const shouldSplit = isGuideOpen && !isMobile

    guideWindow.classList.toggle('guide-window--hidden', !isGuideOpen)
    workspace.classList.toggle('quiz-workspace--single', !shouldSplit)
    workspace.classList.toggle('quiz-workspace--split', shouldSplit)
    guideOverlay.classList.toggle('guide-overlay--visible', isGuideOpen && isMobile)
    guideToggle.textContent = isGuideOpen ? 'Скрыть базу знаний' : 'Открыть базу знаний'

    if (!isGuideOpen || !selected) {
      clearNode(guideWindow)
      return
    }

    clearNode(guideWindow)

    const panelTitle = document.createElement('h3')
    panelTitle.className = 'knowledge-title'
    panelTitle.textContent = 'База знаний'

    const closeButton = document.createElement('button')
    closeButton.type = 'button'
    closeButton.className = 'knowledge-close-button'
    closeButton.setAttribute('aria-label', 'Закрыть базу знаний')
    closeButton.textContent = '×'
    closeButton.addEventListener('click', closeGuide)

    const panelDescription = document.createElement('p')
    panelDescription.className = 'knowledge-description'
    panelDescription.textContent =
      'Кратко по каждому продукту: зачем нужен, кому подходит и какие сильные стороны важны клиенту.'

    const selectLabel = document.createElement('label')
    selectLabel.className = 'knowledge-select-label'
    selectLabel.textContent = 'Выберите продукт'

    const productSelect = document.createElement('select')
    productSelect.className = 'knowledge-select'
    productGuide.forEach((product) => {
      const option = document.createElement('option')
      option.value = product.id
      option.textContent = product.name
      if (product.id === activeGuideId) {
        option.selected = true
      }
      productSelect.append(option)
    })

    productSelect.addEventListener('change', (event) => {
      activeGuideId = event.target.value
      renderGuidePanel()
    })

    const productName = document.createElement('p')
    productName.className = 'knowledge-product-name'
    productName.textContent = selected.name

    const productSummary = document.createElement('p')
    productSummary.className = 'knowledge-product-summary'
    productSummary.textContent = selected.clientDescription || selected.summary

    const panelHead = document.createElement('div')
    panelHead.className = 'knowledge-head'

    const panelHeadTop = document.createElement('div')
    panelHeadTop.className = 'knowledge-head-top'
    panelHeadTop.append(panelTitle, closeButton)

    panelHead.append(panelHeadTop, panelDescription, selectLabel, productSelect)

    const panelBody = document.createElement('div')
    panelBody.className = 'knowledge-body'

    const hintCard = document.createElement('div')
    hintCard.className = 'knowledge-hint'

    const hintTitle = document.createElement('p')
    hintTitle.className = 'knowledge-hint-title'
    hintTitle.textContent = 'Подсказка для игр'

    const hintText = document.createElement('p')
    hintText.className = 'knowledge-hint-text'
    hintText.textContent = selected.quizHint

    hintCard.append(hintTitle, hintText)

    const context = document.createElement('p')
    context.className = 'knowledge-context'
    context.textContent = 'На этой странице можно изучить продукты перед запуском любой игры.'

    panelBody.append(
      productName,
      productSummary,
      buildKnowledgeList('Кому подходит', selected.audience),
      buildKnowledgeList('Ключевой функционал', selected.features),
      buildKnowledgeList('Сильные стороны', selected.strengths),
      buildKnowledgeLinks(selected.links),
      hintCard,
      context
    )

    guideWindow.append(panelHead, panelBody)
  }

  guideToggle.addEventListener('click', () => {
    isGuideOpen = !isGuideOpen
    renderGuidePanel()
  })

  guideOverlay.addEventListener('click', closeGuide)
  window.addEventListener('resize', onResize)
  document.addEventListener('keydown', onKeyDown)

  workspace.append(card, guideWindow)
  page.append(workspace, guideOverlay)
  root.append(page)

  return () => {
    window.removeEventListener('resize', onResize)
    document.removeEventListener('keydown', onKeyDown)
    guideOverlay.removeEventListener('click', closeGuide)
  }
}
