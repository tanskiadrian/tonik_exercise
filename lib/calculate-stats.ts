export function calculateWPM(
  input: string,
  sentence: string,
  elapsedMs: number
): number {
  if (elapsedMs <= 0) return 0;

  const inputWords = input.trim().split(/\s+/);
  const sentenceWords = sentence.trim().split(/\s+/);

  let correctWords = 0;
  for (let i = 0; i < inputWords.length; i++) {
    if (inputWords[i] === sentenceWords[i]) {
      correctWords++;
    }
  }

  const elapsedMinutes = elapsedMs / 60000;
  return Math.round(correctWords / elapsedMinutes);
}


//Wrote by me
export function calculateAccuracy(input: string, sentence: string): number {
  if (input.length === 0) return 1;

  let correct = 0;
  const len = Math.min(input.length, sentence.length);

  for (let i = 0; i < len; i++) {
    if (input[i] === sentence[i]) {
      correct++;
    }
  }

  return parseFloat((correct / input.length).toFixed(4));
}