import React, { useState } from 'react';
import { ConversationExchange } from '../types';
import { History, ChevronDown, ChevronUp, Play, Copy, Check, Sparkles, RotateCcw } from 'lucide-react';

interface ConversationHistoryProps {
  exchanges: ConversationExchange[];
  onReplayAnswer: (answer: string, audioBase64?: string | null) => void;
  onClearHistory: () => void;
  onSelectPrompt?: (question: string) => void;
}

// Sample archival insights when session is fresh
const SAMPLE_INSIGHTS: ConversationExchange[] = [
  {
    id: 'sample-1',
    question: 'How do you approach tolerances in custom solid wood staircases?',
    answer:
      'At M.P.Trepid, building custom solid wood staircases demanded millimeter precision. Wood breathes with atmospheric moisture, so joint tolerances and finish sealing must anticipate structural movement while preserving immaculate clean lines.',
    timestamp: 'Archive · Craftsmanship',
  },
  {
    id: 'sample-2',
    question: 'What was your primary responsibility during the Bolt headquarters installation?',
    answer:
      'With Pristalpaigaluds at Bolt’s Tallinn offices, we handled executive fit-outs, specialized acoustics, and custom cabinetry on active architectural timelines. Precision alignment and rapid autonomous coordination were essential.',
    timestamp: 'Archive · Commercial Fit-outs',
  },
];

export const ConversationHistory: React.FC<ConversationHistoryProps> = ({
  exchanges,
  onReplayAnswer,
  onClearHistory,
  onSelectPrompt,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Take the last 5 exchanges
  const lastFiveExchanges = exchanges.slice(-5);
  const displayList = lastFiveExchanges.length > 0 ? lastFiveExchanges : SAMPLE_INSIGHTS;
  const isSample = lastFiveExchanges.length === 0;

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  return (
    <div className="w-full bg-[#FAF7F2] border border-[#E5DFD3] rounded-xl overflow-hidden transition-all duration-300 shadow-xs">
      {/* Collapsible Header */}
      <div className="px-5 py-3.5 flex items-center justify-between border-b border-[#EBE4D5] bg-[#F5F1E8]">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-wider text-[#1C1917] hover:text-[#8C5E35] transition-colors cursor-pointer"
        >
          <History className="w-4 h-4 text-[#8C5E35]" />
          <span>Conversation History & Past Insights</span>
          <span className="text-[11px] font-normal text-[#78716C]">
            {isSample
              ? '(2 archived samples)'
              : `(Last ${lastFiveExchanges.length} of 5 exchanges)`}
          </span>
          {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {isOpen && !isSample && (
          <button
            onClick={onClearHistory}
            className="text-xs text-[#78716C] hover:text-[#1C1917] flex items-center gap-1 transition-colors cursor-pointer"
            title="Clear conversation history"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Clear</span>
          </button>
        )}
      </div>

      {/* Collapsible Body */}
      {isOpen && (
        <div className="p-5 max-h-[380px] overflow-y-auto space-y-4">
          {isSample && (
            <div className="p-3 bg-[#F2EDE2] border border-[#E0D9CB] rounded-lg text-xs text-[#57534E] flex items-center gap-2 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#8C5E35] shrink-0" />
              <span>
                Archived career insights shown below. As you dialogue with Hans, your last 5 live exchanges will be recorded here.
              </span>
            </div>
          )}

          {/* List of last 5 exchanges in reverse chronological order */}
          <div className="space-y-4">
            {[...displayList].reverse().map((exchange, index) => {
              const exchangeNumber = displayList.length - index;
              return (
                <div
                  key={exchange.id}
                  className="bg-white border border-[#E5DFD3] rounded-xl p-4.5 hover:border-[#C7BFA8] transition-all"
                >
                  {/* Exchange Header & Question */}
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <div className="flex items-center gap-2 text-[11px] text-[#78716C] font-mono">
                      <span className="font-semibold text-[#8C5E35]">#{exchangeNumber}</span>
                      <span aria-hidden="true">·</span>
                      <span>{exchange.timestamp}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onReplayAnswer(exchange.answer, exchange.audioBase64)}
                        className="text-xs text-[#57534E] hover:text-[#1C1917] flex items-center gap-1 transition-colors cursor-pointer px-2 py-1 rounded bg-[#FAF7F2] hover:bg-[#EFECE4] border border-[#DDD6C7]"
                        title="Replay this insight voice"
                      >
                        <Play className="w-3 h-3 text-[#8C5E35]" />
                        <span>Replay</span>
                      </button>

                      <button
                        onClick={() => handleCopy(exchange.id, exchange.answer)}
                        className="text-xs text-[#78716C] hover:text-[#1C1917] p-1 rounded transition-colors cursor-pointer"
                        title="Copy insight"
                      >
                        {copiedId === exchange.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Question */}
                  <div className="mb-2 text-xs font-medium text-[#38332E]">
                    <span className="text-[#8C5E35] font-semibold">Q: </span>
                    <span>{exchange.question}</span>
                  </div>

                  {/* Hans Spoken Insight */}
                  <div className="bg-[#FAF7F2] border-l-2 border-[#8C5E35] pl-3.5 py-1.5 rounded-r">
                    <p className="font-serif text-sm text-[#1C1917] leading-relaxed italic">
                      "{exchange.answer}"
                    </p>
                  </div>

                  {/* Follow-up / Re-ask affordance */}
                  {onSelectPrompt && (
                    <div className="mt-2.5 pt-2 border-t border-[#F2ECE1] flex items-center justify-between text-[11px]">
                      <span className="text-[#8C827A]">Explore related questions:</span>
                      <button
                        onClick={() => onSelectPrompt(exchange.question)}
                        className="text-[#8C5E35] hover:text-[#1C1917] font-medium transition-colors cursor-pointer"
                      >
                        Ask Hans again →
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
