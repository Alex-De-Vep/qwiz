import { createButton } from '../components/Button'
import { createGamePageLayout } from '../components/GamePageLayout'
import { clearNode } from '../utils/dom'
import { quizQuestions } from '../utils/quizQuestions'
import { isTextAnswerCorrect } from '../utils/quizAnswer'
import { saveQuizResult } from '../utils/gameProgress'

export const renderQuizPage = (root, options = {}) => {
  const onBackToGames = typeof options.onBackToGames === 'function' ? options.onBackToGames : null

  let index = 0
  let score = 0

  const layout = createGamePageLayout({
    subtitle: 'Интерактивный мини-тур по линейке продуктов',
    onBackToGames,
    getContextText: () => {
      if (index < quizQuestions.length) {
        return `Сейчас в квизе: ${quizQuestions[index].theme}`
      }
      return 'Квиз завершен. Можно изучить продукты и пройти заново.'
    }
  })

  const content = layout.content

  const updateProgress = (answeredCurrentQuestion = false) => {
    const total = quizQuestions.length
    const current = Math.min(index + 1, total)
    const answeredCount = answeredCurrentQuestion ? index + 1 : index
    const percent = Math.round((answeredCount / total) * 100)

    const label = index < total ? `Вопрос ${current} из ${total}` : 'Квиз завершен'
    const points = `Баллы: ${score}/${total}`

    layout.setProgress({
      label,
      score: points,
      percent
    })
  }

  const renderFeedback = (question, isCorrect) => {
    updateProgress(true)
    layout.renderGuidePanel()
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
    saveQuizResult(score)
    updateProgress(true)
    layout.renderGuidePanel()
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
    layout.renderGuidePanel()
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
  root.append(layout.page)

  return () => {
    layout.destroy()
  }
}
