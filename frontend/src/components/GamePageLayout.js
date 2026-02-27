import { createButton } from './Button'
import { clearNode } from '../utils/dom'
import { productGuide } from '../utils/productGuide'

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

export const createGamePageLayout = ({ subtitle, onBackToGames, getContextText }) => {
  let isGuideOpen = false
  let activeGuideId = productGuide[0]?.id || ''

  const page = document.createElement('section')
  page.className = 'page page--quiz'

  const workspace = document.createElement('div')
  workspace.className = 'quiz-workspace quiz-workspace--single'

  const gameWindow = document.createElement('div')
  gameWindow.className = 'card card--quiz quiz-window'

  const guideWindow = document.createElement('aside')
  guideWindow.className = 'card card--guide guide-window guide-window--hidden'

  const guideOverlay = document.createElement('div')
  guideOverlay.className = 'guide-overlay'

  const title = document.createElement('h1')
  title.className = 'title'
  title.textContent = 'Qwiz: Экосистема'

  const subtitleElement = document.createElement('p')
  subtitleElement.className = 'subtitle'
  subtitleElement.textContent = subtitle

  const header = document.createElement('div')
  header.className = 'quiz-header'

  const headerText = document.createElement('div')
  headerText.className = 'quiz-header-text'
  headerText.append(title, subtitleElement)

  const headerActions = document.createElement('div')
  headerActions.className = 'quiz-header-actions'

  if (onBackToGames) {
    const backButton = createButton({
      text: 'Выбрать игру',
      variant: 'outline',
      onClick: onBackToGames
    })
    backButton.classList.add('change-game-button')
    headerActions.append(backButton)
  }

  const guideToggle = createButton({
    text: 'Открыть базу знаний',
    variant: 'outline'
  })
  guideToggle.classList.add('guide-toggle-button')
  headerActions.append(guideToggle)

  header.append(headerText, headerActions)

  const progressMeta = document.createElement('div')
  progressMeta.className = 'quiz-progress-meta'

  const progressText = document.createElement('p')
  progressText.className = 'quiz-progress-text'

  const progressScore = document.createElement('p')
  progressScore.className = 'quiz-progress-score'

  progressMeta.append(progressText, progressScore)

  const progressBar = document.createElement('div')
  progressBar.className = 'quiz-progress-bar'

  const progressFill = document.createElement('span')
  progressFill.className = 'quiz-progress-fill'
  progressBar.append(progressFill)

  const content = document.createElement('div')

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

  guideOverlay.addEventListener('click', closeGuide)
  window.addEventListener('resize', onResize)
  document.addEventListener('keydown', onKeyDown)

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
      'Выбирайте продукт и смотрите клиентский разбор: что это за решение, в чем сильные стороны и где посмотреть подробнее.'

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
    hintTitle.textContent = 'Подсказка'

    const hintText = document.createElement('p')
    hintText.className = 'knowledge-hint-text'
    hintText.textContent = selected.quizHint

    hintCard.append(hintTitle, hintText)

    const currentContext = document.createElement('p')
    currentContext.className = 'knowledge-context'
    currentContext.textContent = getContextText ? getContextText() : ''

    panelBody.append(
      productName,
      productSummary,
      buildKnowledgeList('Кому подходит', selected.audience),
      buildKnowledgeList('Ключевой функционал', selected.features),
      buildKnowledgeList('Сильные стороны', selected.strengths),
      buildKnowledgeLinks(selected.links),
      hintCard,
      currentContext
    )

    guideWindow.append(panelHead, panelBody)
  }

  guideToggle.addEventListener('click', () => {
    isGuideOpen = !isGuideOpen
    renderGuidePanel()
  })

  gameWindow.append(header, progressMeta, progressBar, content)
  workspace.append(gameWindow, guideWindow)
  page.append(workspace, guideOverlay)

  return {
    page,
    content,
    setProgress: ({ label, score, percent }) => {
      progressText.textContent = label
      progressScore.textContent = score
      progressFill.style.width = `${Math.max(0, Math.min(percent, 100))}%`
    },
    renderGuidePanel,
    destroy: () => {
      window.removeEventListener('resize', onResize)
      document.removeEventListener('keydown', onKeyDown)
      guideOverlay.removeEventListener('click', closeGuide)
    }
  }
}
