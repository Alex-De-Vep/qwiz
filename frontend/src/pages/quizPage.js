import { createButton } from '../components/Button'
import { clearNode } from '../utils/dom'
import { quizQuestions } from '../utils/quizQuestions'
import { productGuide } from '../utils/productGuide'

const normalizeText = (value) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[.,!?;:]/g, '')
    .replace(/\s+/g, ' ')

const isTextAnswerCorrect = (value, acceptedAnswers) => {
  const normalized = normalizeText(value)
  return acceptedAnswers.some((answer) => normalizeText(answer) === normalized)
}

export const renderQuizPage = (root) => {
  let index = 0
  let score = 0
  let isGuideOpen = false
  let activeGuideId = productGuide[0]?.id || ''

  const page = document.createElement('section')
  page.className = 'page page--quiz'

  const workspace = document.createElement('div')
  workspace.className = 'quiz-workspace quiz-workspace--single'

  const quizWindow = document.createElement('div')
  quizWindow.className = 'card card--quiz quiz-window'

  const guideWindow = document.createElement('aside')
  guideWindow.className = 'card card--guide guide-window guide-window--hidden'

  const title = document.createElement('h1')
  title.className = 'title'
  title.textContent = 'Qwiz: Экосистема'

  const subtitle = document.createElement('p')
  subtitle.className = 'subtitle'
  subtitle.textContent = 'Интерактивный мини-тур по линейке продуктов'

  const header = document.createElement('div')
  header.className = 'quiz-header'

  const headerText = document.createElement('div')
  headerText.className = 'quiz-header-text'
  headerText.append(title, subtitle)

  const headerActions = document.createElement('div')
  headerActions.className = 'quiz-header-actions'

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

  const renderGuidePanel = () => {
    const selected = productGuide.find((item) => item.id === activeGuideId) || productGuide[0]

    guideWindow.classList.toggle('guide-window--hidden', !isGuideOpen)
    workspace.classList.toggle('quiz-workspace--single', !isGuideOpen)
    workspace.classList.toggle('quiz-workspace--split', isGuideOpen)
    guideToggle.textContent = isGuideOpen ? 'Скрыть базу знаний' : 'Открыть базу знаний'

    if (!isGuideOpen || !selected) {
      clearNode(guideWindow)
      return
    }

    clearNode(guideWindow)

    const panelTitle = document.createElement('h3')
    panelTitle.className = 'knowledge-title'
    panelTitle.textContent = 'База знаний'

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

    panelHead.append(panelTitle, panelDescription, selectLabel, productSelect)

    const panelBody = document.createElement('div')
    panelBody.className = 'knowledge-body'

    const hintCard = document.createElement('div')
    hintCard.className = 'knowledge-hint'

    const hintTitle = document.createElement('p')
    hintTitle.className = 'knowledge-hint-title'
    hintTitle.textContent = 'Подсказка для квиза'

    const hintText = document.createElement('p')
    hintText.className = 'knowledge-hint-text'
    hintText.textContent = selected.quizHint

    hintCard.append(hintTitle, hintText)

    const currentContext = document.createElement('p')
    currentContext.className = 'knowledge-context'
    if (index < quizQuestions.length) {
      currentContext.textContent = `Сейчас в квизе: ${quizQuestions[index].theme}`
    } else {
      currentContext.textContent = 'Квиз завершен. Можно изучить продукты и пройти заново.'
    }

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

  const updateProgress = (answeredCurrentQuestion = false) => {
    const total = quizQuestions.length
    const current = Math.min(index + 1, total)
    const answeredCount = answeredCurrentQuestion ? index + 1 : index
    const width = Math.round((answeredCount / total) * 100)

    if (index < total) {
      progressText.textContent = `Вопрос ${current} из ${total}`
    } else {
      progressText.textContent = 'Квиз завершен'
    }

    progressScore.textContent = `Баллы: ${score}/${total}`
    progressFill.style.width = `${Math.min(width, 100)}%`
  }

  const renderFeedback = (question, isCorrect) => {
    updateProgress(true)
    renderGuidePanel()
    clearNode(content)

    const status = document.createElement('p')
    status.className = `answer-status ${isCorrect ? 'answer-status--good' : 'answer-status--warn'}`
    status.textContent = isCorrect ? 'Верно, отлично!' : 'Почти, но есть куда прокачаться.'

    const correct = document.createElement('p')
    correct.className = 'answer-note'
    if (question.type === 'single') {
      correct.textContent = `Правильный ответ: ${question.options[question.answerIndex]}`
    } else {
      correct.textContent = `Ожидалось: ${question.acceptedAnswers[0]}`
    }

    const explainer = document.createElement('div')
    explainer.className = 'answer-explainer'

    const explainerTitle = document.createElement('p')
    explainerTitle.className = 'answer-explainer-title'
    explainerTitle.textContent = 'Разбор'

    const explanation = document.createElement('p')
    explanation.className = 'answer-explanation'
    explanation.textContent = question.explanation

    explainer.append(explainerTitle, explanation)
    content.append(status, correct, explainer)

    if (question.highlight) {
      const highlight = document.createElement('p')
      highlight.className = 'answer-highlight'
      highlight.textContent = question.highlight
      explainer.append(highlight)
    }

    if (question.showLeadCapture) {
      const leadCard = document.createElement('div')
      leadCard.className = 'lead-capture'

      const leadTitle = document.createElement('p')
      leadTitle.className = 'lead-title'
      leadTitle.textContent =
        question.leadTitle || 'Хотите протестировать такое решение? Оставьте заявку.'

      const leadLabel = document.createElement('label')
      leadLabel.className = 'lead-label'
      leadLabel.textContent = question.leadLabel || 'Напишите вашу защищенную почту'

      const leadInput = document.createElement('input')
      leadInput.className = 'question-text-input'
      leadInput.type = 'email'
      leadInput.placeholder = 'name@secure-mail.ru'

      const leadButton = createButton({
        text: question.leadButtonText || 'Оставить заявку',
        variant: 'solid'
      })

      const leadMessage = document.createElement('p')
      leadMessage.className = 'lead-message'

      leadButton.addEventListener('click', () => {
        const value = leadInput.value.trim()
        if (!value) {
          leadMessage.textContent = 'Добавьте почту, чтобы оставить заявку.'
          return
        }
        leadMessage.textContent = 'Спасибо! Мы сохранили контакт для связи.'
      })

      leadCard.append(leadTitle, leadLabel, leadInput, leadButton, leadMessage)
      content.append(leadCard)
    }

    const nextButton = createButton({
      text: index === quizQuestions.length - 1 ? 'Показать результат' : 'Дальше',
      variant: 'solid',
      onClick: () => {
        index += 1
        renderQuestion()
      }
    })
    nextButton.classList.add('quiz-next-button')
    content.append(nextButton)
  }

  const renderSummary = () => {
    updateProgress(true)
    renderGuidePanel()
    clearNode(content)

    const total = quizQuestions.length
    const percent = Math.round((score / total) * 100)

    const result = document.createElement('p')
    result.className = 'result'
    result.innerHTML = `Результат: <strong>${score}</strong> из <strong>${total}</strong>`

    const grade = document.createElement('p')
    grade.className = 'answer-explanation'
    if (percent >= 85) {
      grade.textContent = 'Сильный результат: экосистема продуктов уже хорошо читается как единая платформа.'
    } else if (percent >= 60) {
      grade.textContent = 'Хорошая база есть. Еще пара проходов — и структура линейки станет полностью прозрачной.'
    } else {
      grade.textContent = 'Неплохой старт. Пройдите квиз еще раз, чтобы уверенно ориентироваться в роли каждого продукта.'
    }

    const restartButton = createButton({
      text: 'Пройти еще раз',
      variant: 'solid',
      onClick: () => {
        index = 0
        score = 0
        renderQuestion()
      }
    })
    restartButton.classList.add('quiz-next-button')

    content.append(result, grade, restartButton)
  }

  const renderQuestion = () => {
    updateProgress(false)
    renderGuidePanel()
    clearNode(content)

    const question = quizQuestions[index]

    if (!question) {
      renderSummary()
      return
    }

    const shell = document.createElement('div')
    shell.className = 'question-shell'

    const theme = document.createElement('span')
    theme.className = 'quiz-theme'
    theme.textContent = question.theme

    const questionTitle = document.createElement('h2')
    questionTitle.className = 'question-title'
    questionTitle.textContent = question.title

    shell.append(theme, questionTitle)

    if (question.type === 'single') {
      const options = document.createElement('div')
      options.className = 'options'

      question.options.forEach((option, optionIndex) => {
        const optionButton = createButton({
          text: option,
          variant: 'outline',
          onClick: () => {
            const isCorrect = optionIndex === question.answerIndex
            if (isCorrect) {
              score += 1
            }
            renderFeedback(question, isCorrect)
          }
        })

        optionButton.classList.add('option-button', 'option-button--choice')
        options.append(optionButton)
      })

      shell.append(options)
      content.append(shell)
      return
    }

    const textForm = document.createElement('form')
    textForm.className = 'text-answer-form'

    const textInput = document.createElement('input')
    textInput.className = 'question-text-input'
    textInput.type = 'text'
    textInput.placeholder = question.placeholder || 'Введите ответ'
    textInput.autocomplete = 'off'

    const inputHint = document.createElement('p')
    inputHint.className = 'input-hint'
    inputHint.textContent = 'Ответ можно написать в свободной форме.'

    const submitButton = createButton({
      text: 'Проверить ответ',
      type: 'submit',
      variant: 'solid'
    })

    textForm.addEventListener('submit', (event) => {
      event.preventDefault()

      const value = textInput.value.trim()
      if (!value) {
        inputHint.textContent = 'Введите ответ, чтобы продолжить.'
        return
      }

      const isCorrect = isTextAnswerCorrect(value, question.acceptedAnswers)
      if (isCorrect) {
        score += 1
      }
      renderFeedback(question, isCorrect)
    })

    textForm.append(textInput, submitButton)
    shell.append(textForm, inputHint)
    content.append(shell)
  }

  renderQuestion()

  quizWindow.append(header, progressMeta, progressBar, content)
  workspace.append(quizWindow, guideWindow)
  page.append(workspace)
  root.append(page)
}
