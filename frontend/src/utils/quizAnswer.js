const normalizeText = (value) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[.,!?;:]/g, '')
    .replace(/\s+/g, ' ')

export const isTextAnswerCorrect = (value, acceptedAnswers) => {
  const normalized = normalizeText(value)
  return acceptedAnswers.some((answer) => normalizeText(answer) === normalized)
}
