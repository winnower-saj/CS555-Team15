export const playWordAssocGame = () => {
  // Example logic for Word Association game
  const wordPool = ['apple', 'orange', 'banana', 'grape'];
  const randomWord = wordPool[Math.floor(Math.random() * wordPool.length)];
  return `Word Association Game: Your word is "${randomWord}". Respond with an associated word.`;
};

export const playMemoryCardGame = () => {
  // Example logic for Memory Card game
  const cardSet = ['A', 'B', 'C', 'D'];
  const shuffledCards = cardSet.sort(() => Math.random() - 0.5);
  return `Memory Card Game: Remember the sequence - ${shuffledCards.join(', ')}.`;
};
