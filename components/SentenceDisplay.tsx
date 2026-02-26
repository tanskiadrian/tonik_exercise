"use client";

interface Props {
  sentence: string;
  userInput: string;
}

export default function SentenceDisplay({ sentence, userInput }: Props) {
  return (
    <div className="bg-gray-800 rounded p-6 font-mono text-lg leading-relaxed">
      {sentence.split("").map((char, i) => {
        let className = "text-gray-500";

        if (i < userInput.length) {
          if (userInput[i] === char) {
            className = "text-green-400";
          } else {
            className = "text-red-400 bg-red-900 rounded";
          }
        } else if (i === userInput.length) {
          className = "text-white border-b-2 border-green-400";
        }

        return (
          <span key={i} className={className}>
            {char}
          </span>
        );
      })}
    </div>
  );
}