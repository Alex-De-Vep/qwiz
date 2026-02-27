import { quizQuestions } from './quizQuestions'
import { matchingPairs } from './matchingPairs'

const STORAGE_KEY = 'qwiz_game_progress_v1'

export const GAME_GOALS = {
  quizMaxScore: quizQuestions.length,
  matchingAttemptLimit: 8,
  matchingTargetPairs: matchingPairs.length,
  snakeTargetScore: 10
}

const createDefaultData = () => ({
  quiz: {
    played: false,
    lastScore: 0,
    bestScore: 0
  },
  matching: {
    played: false,
    lastAttempts: 0,
    bestAttempts: null,
    lastMatched: 0,
    bestMatched: 0
  },
  snake: {
    played: false,
    lastScore: 0,
    bestScore: 0
  }
})

const readStoredData = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return createDefaultData()
    }

    const parsed = JSON.parse(raw)
    const defaults = createDefaultData()

    const normalized = {
      quiz: { ...defaults.quiz, ...(parsed.quiz || {}) },
      matching: { ...defaults.matching, ...(parsed.matching || {}) },
      snake: { ...defaults.snake, ...(parsed.snake || {}) }
    }

    if (typeof normalized.matching.bestMatched !== 'number') {
      normalized.matching.bestMatched =
        typeof normalized.matching.bestAttempts === 'number' ? GAME_GOALS.matchingTargetPairs : 0
    }

    if (typeof normalized.matching.lastMatched !== 'number') {
      normalized.matching.lastMatched = normalized.matching.bestMatched
    }

    return normalized
  } catch {
    return createDefaultData()
  }
}

const writeStoredData = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    // no-op
  }
}

const buildProgressState = (data) => ({
  quiz: {
    ...data.quiz,
    isMax: data.quiz.bestScore >= GAME_GOALS.quizMaxScore
  },
  matching: {
    ...data.matching,
    isMax: data.matching.bestMatched >= GAME_GOALS.matchingTargetPairs
  },
  snake: {
    ...data.snake,
    isMax: data.snake.bestScore >= GAME_GOALS.snakeTargetScore
  }
})

export const getGameProgress = () => buildProgressState(readStoredData())

export const isAllGamesMaxed = (progress = getGameProgress()) =>
  progress.quiz.isMax && progress.matching.isMax && progress.snake.isMax

export const saveQuizResult = (score) => {
  const data = readStoredData()
  const safeScore = Math.max(0, Math.min(Number(score) || 0, GAME_GOALS.quizMaxScore))

  data.quiz.played = true
  data.quiz.lastScore = safeScore
  data.quiz.bestScore = Math.max(data.quiz.bestScore, safeScore)
  writeStoredData(data)

  return buildProgressState(data)
}

export const saveMatchingResult = (attempts, matchedPairs) => {
  const data = readStoredData()
  const safeAttempts = Math.max(1, Math.min(Number(attempts) || 1, GAME_GOALS.matchingAttemptLimit))
  const safeMatched = Math.max(0, Math.min(Number(matchedPairs) || 0, GAME_GOALS.matchingTargetPairs))

  data.matching.played = true
  data.matching.lastAttempts = safeAttempts
  data.matching.lastMatched = safeMatched

  if (safeMatched > data.matching.bestMatched) {
    data.matching.bestMatched = safeMatched
    data.matching.bestAttempts = safeAttempts
  } else if (safeMatched === data.matching.bestMatched) {
    data.matching.bestAttempts =
      typeof data.matching.bestAttempts === 'number'
        ? Math.min(data.matching.bestAttempts, safeAttempts)
        : safeAttempts
  }

  writeStoredData(data)
  return buildProgressState(data)
}

export const saveSnakeResult = (score) => {
  const data = readStoredData()
  const safeScore = Math.max(0, Number(score) || 0)

  data.snake.played = true
  data.snake.lastScore = safeScore
  data.snake.bestScore = Math.max(data.snake.bestScore, safeScore)
  writeStoredData(data)

  return buildProgressState(data)
}
