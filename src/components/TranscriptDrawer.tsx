import React, { useRef, useEffect, useState } from 'react';
import { ConversationMessage } from '../types';
import { ChevronDown, ChevronUp, Copy, Check, Play, RotateCcw } from 'lucide-react';
import { TypewriterText } from './TypewriterText';

interface TranscriptDrawerProps {
  messages: ConversationMessage[];
  isOpen: boolean;
  onToggle: () => void;
  onReplayAudio: (msg: ConversationMessage) => void;
  onClearHistory: () => void;
}

export const TranscriptDrawer: React.FC<TranscriptDrawerProps> = ({
  messages,
  isOpen,
  onToggle,
  onReplayAudio,
  onClearHistory,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [animatedMessageIds, setAnimatedMessageIds] = useState<Set<string>>(new Set());
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Automatically scroll as new words appear
  useEffect(() => {
    if (isOpen && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const copyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const handleMessageAnimationFinish = (id: string) => {
    setAnimatedMessageIds((prev) => new Set(prev).add(id));
  };

  return (
    <div className="w-full bg-[#F5F1E8] border border-[#E5DFD3] rounded-xl overflow-hidden transition-all duration-300">
      <div className="px-5 py-3.5 flex items-center justify-between border-b border-[#EBE4D5] bg-[#F1ECE1]">
        <button
          onClick={onToggle}
          className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#1C1917] hover:text-[#8C5E35] transition-colors cursor-pointer"
        >
          <span>Live Conversation Transcript</span>
          <span className="text-[11px] font-normal text-[#78716C]">
            ({messages.length} {messages.length === 1 ? 'entry' : 'entries'})
          </span>
          {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {isOpen && messages.length > 0 && (
          <button
            onClick={onClearHistory}
            className="text-xs text-[#78716C] hover:text-[#1C1917] flex items-center gap-1 transition-colors cursor-pointer"
            title="Reset conversation transcript"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {isOpen && (
        <div
          ref={scrollRef}
          className="max-h-[320px] overflow-y-auto p-5 space-y-4 text-sm"
        >
          {messages.length === 0 ? (
            <p className="text-xs text-[#8C827A] italic text-center py-4">
              Transcript is empty. Speak or type a question above to start the dialogue with Hans.
            </p>
          ) : (
            messages.map((msg, index) => {
              const isAssistant = msg.role === 'assistant';
              const isLatest = index === messages.length - 1;
              const hasAnimated = animatedMessageIds.has(msg.id);
              const shouldAnimate = isLatest && !hasAnimated;

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col gap-1.5 ${
                    isAssistant ? 'items-start' : 'items-end'
                  }`}
                >
                  <div className="flex items-center gap-2 text-[11px] text-[#78716C] tracking-wide">
                    <span className="font-semibold text-[#1C1917]">
                      {isAssistant ? 'Hans (Voice of Robin)' : 'You'}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{msg.timestamp}</span>
                  </div>

                  <div
                    className={`relative group max-w-[85%] rounded-lg p-3.5 leading-relaxed text-[13.5px] transition-all ${
                      isAssistant
                        ? 'bg-white text-[#1C1917] border border-[#E5DFD3] shadow-xs'
                        : 'bg-[#1C1917] text-[#FAF7F2]'
                    }`}
                  >
                    {/* Word-by-word typewriter entrance animation */}
                    <div className="min-h-[1.5em]">
                      <TypewriterText
                        text={msg.text}
                        isNew={shouldAnimate}
                        speedMs={35}
                        onFinish={() => handleMessageAnimationFinish(msg.id)}
                      />
                    </div>

                    <div
                      className={`flex items-center gap-2 mt-2 pt-2 border-t text-[11px] ${
                        isAssistant
                          ? 'border-[#F1ECE1] text-[#78716C]'
                          : 'border-[#38332E] text-[#D6CFBE]'
                      }`}
                    >
                      {isAssistant && (
                        <button
                          onClick={() => {
                            // Re-trigger animation when explicitly replaying
                            setAnimatedMessageIds((prev) => {
                              const next = new Set(prev);
                              next.delete(msg.id);
                              return next;
                            });
                            onReplayAudio(msg);
                          }}
                          className="hover:text-[#1C1917] flex items-center gap-1 transition-colors cursor-pointer"
                          title="Replay spoken audio"
                        >
                          <Play className="w-3 h-3" />
                          <span>Replay audio</span>
                        </button>
                      )}

                      <button
                        onClick={() => copyText(msg.id, msg.text)}
                        className={`flex items-center gap-1 hover:underline transition-colors cursor-pointer ${
                          isAssistant ? 'hover:text-[#1C1917]' : 'hover:text-white'
                        }`}
                        title="Copy text to clipboard"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span className="text-emerald-700">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
