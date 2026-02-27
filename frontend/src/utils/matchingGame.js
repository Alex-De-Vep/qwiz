export const shuffleArray = (items) => {
  const copied = [...items]
  for (let index = copied.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1))
    ;[copied[index], copied[randomIndex]] = [copied[randomIndex], copied[index]]
  }
  return copied
}

export const createMatchingRound = (pairs) => ({
  productItems: shuffleArray(pairs),
  functionItems: shuffleArray(pairs),
  matchedIds: new Set(),
  selectedProductId: '',
  selectedFunctionId: '',
  attempts: 0,
  tone: 'muted',
  message: 'Тапните продукт и подходящую функцию, чтобы собрать пару.'
})

export const getMatchingById = (pairs, id) => pairs.find((item) => item.id === id)
