import { createButton } from '../components/Button'
import { createGamePageLayout } from '../components/GamePageLayout'
import { clearNode } from '../utils/dom'
import { matchingPairs } from '../utils/matchingPairs'
import { createMatchingRound, getMatchingById } from '../utils/matchingGame'
import { GAME_GOALS, saveMatchingResult } from '../utils/gameProgress'

export const renderMatchingPage = (root, options = {}) => {
  const onBackToGames = typeof options.onBackToGames === 'function' ? options.onBackToGames : null

  let round = createMatchingRound(matchingPairs)
  let isResultSaved = false
  const attemptLimit = GAME_GOALS.matchingAttemptLimit

  const layout = createGamePageLayout({
    subtitle: 'Мини-игра: сопоставьте продукт и функцию через тапы',
    onBackToGames,
    getContextText: () => 'Сейчас мини-игра: сопоставьте продукт с его функцией.'
  })

  const content = layout.content

  const updateProgress = () => {
    const total = matchingPairs.length
    const matchedCount = round.matchedIds.size
    const percent = Math.round((round.attempts / attemptLimit) * 100)
    const attemptsLeft = Math.max(0, attemptLimit - round.attempts)

    const isFinished = matchedCount === total || round.attempts >= attemptLimit
    const label = isFinished ? 'Матчинг завершен' : `Матчинг: попытка ${round.attempts + 1} из ${attemptLimit}`
    const score = `Собрано пар: ${matchedCount}/${total} • Осталось попыток: ${attemptsLeft}`

    layout.setProgress({ label, score, percent })
  }

  const processPick = () => {
    if (!round.selectedProductId || !round.selectedFunctionId || round.attempts >= attemptLimit) {
      return
    }

    round.attempts += 1

    if (round.selectedProductId === round.selectedFunctionId) {
      const matchedId = round.selectedProductId
      round.matchedIds.add(matchedId)
      round.tone = 'good'
      round.message = `Есть совпадение: ${getMatchingById(matchingPairs, matchedId)?.product || 'Пара собрана'}.`
    } else {
      round.tone = 'warn'
      round.message = 'Пока не совпало. Попробуйте еще раз.'
    }

    if (round.attempts >= attemptLimit && round.matchedIds.size < matchingPairs.length) {
      round.tone = 'warn'
      round.message = `Лимит ${attemptLimit} попыток достигнут.`
    }

    round.selectedProductId = ''
    round.selectedFunctionId = ''
    renderMatching()
  }

  const renderMatching = () => {
    updateProgress()
    layout.renderGuidePanel()
    clearNode(content)

    const totalPairs = matchingPairs.length
    const matchedCount = round.matchedIds.size
    const isFinished = matchedCount === totalPairs || round.attempts >= attemptLimit

    if (isFinished) {
      if (!isResultSaved) {
        saveMatchingResult(round.attempts, matchedCount)
        isResultSaved = true
      }

      const result = document.createElement('p')
      result.className = 'result'
      result.innerHTML = `Результат: <strong>${matchedCount}</strong> из <strong>${totalPairs}</strong> пар`

      const attemptsInfo = document.createElement('p')
      attemptsInfo.className = 'answer-note'
      attemptsInfo.textContent = `Использовано попыток: ${round.attempts} из ${attemptLimit}`

      const grade = document.createElement('p')
      grade.className = 'answer-explanation'
      if (matchedCount === totalPairs) {
        grade.textContent = 'Отлично: все пары собраны в рамках лимита.'
      } else if (matchedCount >= Math.ceil(totalPairs * 0.6)) {
        grade.textContent = 'Хороший результат: вы уже уверенно ориентируетесь в продуктах.'
      } else {
        grade.textContent = 'Неплохой старт. Попробуйте еще раз и доберите больше пар.'
      }

      const restartButton = createButton({
        text: 'Сыграть еще раз',
        variant: 'solid',
        onClick: () => {
          round = createMatchingRound(matchingPairs)
          isResultSaved = false
          renderMatching()
        }
      })
      restartButton.classList.add('quiz-next-button')

      content.append(result, attemptsInfo, grade, restartButton)
      return
    }

    const shell = document.createElement('div')
    shell.className = 'matching-shell'

    const intro = document.createElement('p')
    intro.className = 'matching-intro'
    intro.textContent = `Сопоставьте продукт и его функцию. У вас только ${attemptLimit} попыток на весь раунд.`

    const feedback = document.createElement('p')
    feedback.className = `matching-feedback matching-feedback--${round.tone}`
    feedback.textContent = round.message

    const board = document.createElement('div')
    board.className = 'matching-board'

    const productColumn = document.createElement('section')
    productColumn.className = 'matching-column'

    const productTitle = document.createElement('p')
    productTitle.className = 'matching-column-title'
    productTitle.textContent = 'Продукты'

    const productList = document.createElement('div')
    productList.className = 'matching-list'

    round.productItems.forEach((item) => {
      const button = createButton({
        text: item.product,
        variant: 'outline',
        onClick: () => {
          if (round.matchedIds.has(item.id)) {
            return
          }

          round.selectedProductId = item.id
          if (round.selectedFunctionId) {
            processPick()
            return
          }

          renderMatching()
        }
      })

      button.classList.add('matching-chip')
      if (round.selectedProductId === item.id) {
        button.classList.add('matching-chip--selected')
      }
      if (round.matchedIds.has(item.id)) {
        button.classList.add('matching-chip--matched')
        button.disabled = true
      }

      productList.append(button)
    })

    productColumn.append(productTitle, productList)

    const functionColumn = document.createElement('section')
    functionColumn.className = 'matching-column'

    const functionTitle = document.createElement('p')
    functionTitle.className = 'matching-column-title'
    functionTitle.textContent = 'Функции'

    const functionList = document.createElement('div')
    functionList.className = 'matching-list'

    round.functionItems.forEach((item) => {
      const button = createButton({
        text: item.feature,
        variant: 'outline',
        onClick: () => {
          if (round.matchedIds.has(item.id)) {
            return
          }

          round.selectedFunctionId = item.id
          if (round.selectedProductId) {
            processPick()
            return
          }

          renderMatching()
        }
      })

      button.classList.add('matching-chip')
      if (round.selectedFunctionId === item.id) {
        button.classList.add('matching-chip--selected')
      }
      if (round.matchedIds.has(item.id)) {
        button.classList.add('matching-chip--matched')
        button.disabled = true
      }

      functionList.append(button)
    })

    functionColumn.append(functionTitle, functionList)
    board.append(productColumn, functionColumn)
    shell.append(intro, feedback, board)
    content.append(shell)
  }

  renderMatching()
  root.append(layout.page)

  return () => {
    layout.destroy()
  }
}
