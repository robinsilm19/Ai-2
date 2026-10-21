import React, { useState, useEffect } from 'react';

interface TypewriterTextProps {
  text: string;
  isNew?: boolean;
  speedMs?: number;
  className?: string;
  onFinish?: () => void;
  showCursor?: boolean;
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  isNew = false,
  speedMs = 45,
  className = '',
  onFinish,
  showCursor = true,
}) => {
  // Split into tokens preserving whitespace and words
  const tokens = React.useMemo(() => text.split(/(\s+)/), [text]);
  const [revealedCount, setRevealedCount] = useState<number>(isNew ? 0 : tokens.length);
  const [isTyping, setIsTyping] = useState<boolean>(isNew);

  useEffect(() => {
    if (!isNew) {
      setRevealedCount(tokens.length);
      setIsTyping(false);
      return;
    }

    setRevealedCount(0);
    setIsTyping(true);

    let current = 0;
    const interval = setInterval(() => {
      // Step through words (skip empty tokens fast)
      current += 1;
      setRevealedCount(current);

      if (current >= tokens.length) {
        clearInterval(interval);
        setIsTyping(false);
        if (onFinish) onFinish();
      }
    }, speedMs);

    return () => clearInterval(interval);
  }, [text, isNew, tokens, speedMs, onFinish]);

  return (
    <span className={`inline-block whitespace-pre-wrap leading-relaxed ${className}`}>
      {tokens.slice(0, revealedCount).map((token, idx) => {
        const isWhitespace = /^\s+$/.test(token);
        if (isWhitespace) {
          return token;
        }

        return (
          <span
            key={idx}
            className={
              isTyping && idx === revealedCount - 1
                ? 'inline-block animate-word-entrance'
                : 'inline'
            }
          >
            {token}
          </span>
        );
      })}

      {isTyping && showCursor && (
        <span
          className="inline-block w-[3px] h-[1.05em] ml-1 bg-[#8C5E35] align-baseline animate-typewriter-cursor"
          aria-hidden="true"
        />
      )}
    </span>
  );
};
