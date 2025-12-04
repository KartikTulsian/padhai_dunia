import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface TypeWriterProps {
  lines: string[];
  speed?: number;
  className?: string;
}

const TypeWriter = ({ lines, speed = 50, className = '' }: TypeWriterProps) => {
  const [displayedText, setDisplayedText] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (currentLineIndex >= lines.length) {
      setIsComplete(true);
      return;
    }

    const currentLine = lines[currentLineIndex];
    
    if (currentCharIndex < currentLine.length) {
      const timer = setTimeout(() => {
        const newDisplayedText = [...displayedText];
        if (!newDisplayedText[currentLineIndex]) {
          newDisplayedText[currentLineIndex] = '';
        }
        newDisplayedText[currentLineIndex] = currentLine.slice(0, currentCharIndex + 1);
        setDisplayedText(newDisplayedText);
        setCurrentCharIndex(currentCharIndex + 1);
      }, speed);

      return () => clearTimeout(timer);
    } else {
      // Move to next line after a brief pause
      const timer = setTimeout(() => {
        setCurrentLineIndex(currentLineIndex + 1);
        setCurrentCharIndex(0);
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [currentCharIndex, currentLineIndex, lines, speed, displayedText]);

  return (
    <div className={className}>
      {displayedText.map((line, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-inherit leading-tight"
        >
          {line}
          {index === currentLineIndex && !isComplete && (
            <span className="typewriter-cursor" />
          )}
        </motion.div>
      ))}
      {currentLineIndex < lines.length && !displayedText[currentLineIndex] && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-inherit leading-tight"
        >
          <span className="typewriter-cursor" />
        </motion.div>
      )}
    </div>
  );
};

export default TypeWriter;