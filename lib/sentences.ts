//AI GENERATED!!
const SENTENCES = [
  "The quick brown fox jumps over the lazy dog near the riverbank at dawn.",
  "Programming is the art of telling another human what one wants the computer to do.",
  "Every great developer you know got there by solving problems they were unqualified to solve.",
  "The best error message is the one that never shows up on the screen.",
  "Code is like humor. When you have to explain it, it is bad.",
  "First solve the problem. Then write the code to make it work.",
  "Simplicity is the soul of efficiency in software engineering.",
  "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
  "Talk is cheap. Show me the code and let the results speak.",
  "The most disastrous thing that you can ever learn is your first programming language.",
  "Sometimes it pays to stay in bed on Monday rather than spending the rest of the week debugging.",
  "Measuring programming progress by lines of code is like measuring aircraft building progress by weight.",
  "The only way to learn a new programming language is by writing programs in it every single day.",
  "Experience is the name everyone gives to their mistakes when they finally understand them.",
  "Java is to JavaScript what car is to carpet in the world of programming languages.",
  "Before software can be reusable it first has to be usable by real people.",
  "The Internet is becoming the town square for the global village of tomorrow.",
  "Artificial intelligence is no match for natural stupidity in most everyday situations.",
  "In order to be irreplaceable one must always be different from the rest.",
  "The computer was born to solve problems that did not exist before its creation.",
];

let lastIndex = -1;

export function getRandomSentence(): string {
  let index: number;
  do {
    index = Math.floor(Math.random() * SENTENCES.length);
  } while (index === lastIndex && SENTENCES.length > 1);
  lastIndex = index;
  return SENTENCES[index];
}

export function getAllSentences(): string[] {
  return [...SENTENCES];
}