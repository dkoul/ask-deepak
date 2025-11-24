
// A collection of cryptic, philosophical, and evasive answers
// used when the user fails to perform the secret trick.
const MYSTIC_RESPONSES = [
  "The spirits are quiet today.",
  "Your energy is clouded with doubt.",
  "I refuse to answer the unfaithful.",
  "Ask again when your mind is clear.",
  "The stars are not aligned for you.",
  "Why do you seek what you cannot understand?",
  "Silence is the only answer you deserve right now.",
  "The universe is indifferent to your curiosity.",
  "Your petition lacks the necessary conviction.",
  "I cannot see through the veil at this moment.",
  "Some truths are better left unspoken.",
  "You are not ready to hear the answer.",
  "The timeline is currently fluctuating.",
  "Look within yourself; the answer is already there.",
  "I am not a toy for your amusement.",
  "The connection to the ether is weak.",
  "Your aura is blocking the signal.",
  "This question does not serve your higher purpose.",
  "The tea leaves are dark and murky.",
  "Do not triffle with forces you do not comprehend.",
  "A shadow passes over the moon; I cannot speak.",
  "Trust your intuition, for I shall say nothing.",
  "The answer lies in the silence between your thoughts.",
  "Chaos reigns in the spiritual realm right now."
];

export const getDeepakRefusal = async (question: string): Promise<string> => {
  // Simulate a brief "thinking" delay to maintain the illusion
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Return a random response
  return MYSTIC_RESPONSES[Math.floor(Math.random() * MYSTIC_RESPONSES.length)];
};
