import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Mic, MicOff, Send, Volume2, VolumeX, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import { WaveformVisualizer } from './WaveformVisualizer';
import { TranscriptDrawer } from './TranscriptDrawer';
import { TypewriterText } from './TypewriterText';
import { ConversationHistory } from './ConversationHistory';
import { ConversationMessage, ConversationExchange } from '../types';
import { PROMPT_STARTERS } from '../data/robinData';

interface VoiceConsoleProps {
  onSpeakingChange: (isSpeaking: boolean) => void;
  onOpenCv: () => void;
  externalPrompt?: string | null;
  onClearExternalPrompt?: () => void;
}

// Deterministic timestamp formatter immune to browser locale pattern errors
const formatTimestamp = (): string => {
  const d = new Date();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

export const VoiceConsole: React.FC<VoiceConsoleProps> = ({
  onSpeakingChange,
  externalPrompt,
  onClearExternalPrompt,
}) => {
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [exchanges, setExchanges] = useState<ConversationExchange[]>([]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [isTranscriptOpen, setIsTranscriptOpen] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [audioSpeed, setAudioSpeed] = useState<1 | 1.25>(1);
  const [currentUtterance, setCurrentUtterance] = useState<string>(
    "Greetings. I am Hans, speaking directly on behalf of Robin Silm. Ask me anything about Robin's joinery craftsmanship, commercial fit-outs at Bolt, military discipline in the Estonian Defence Forces, or studies at EBS."
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Audio refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const recognitionRef = useRef<any>(null);

  const ensureAudioContext = () => {
    try {
      if (!audioContextRef.current) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          const ctx = new AudioCtx();
          const analyser = ctx.createAnalyser();
          analyser.fftSize = 64;
          audioContextRef.current = ctx;
          analyserRef.current = analyser;
        }
      }
      if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }
    } catch (e) {
      console.warn('AudioContext initialization notice:', e);
    }
  };

  const fallbackBrowserSpeech = useCallback(
    (text: string) => {
      if (!('speechSynthesis' in window)) {
        setIsPlaying(false);
        onSpeakingChange(false);
        return;
      }

      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = audioSpeed;
        utterance.pitch = 0.85; // Deep resonant tone
        utterance.lang = 'en-US';

        const voices = window.speechSynthesis.getVoices();
        const maleVoice = voices.find(
          (v) =>
            v.lang.startsWith('en') &&
            (v.name.includes('Male') ||
              v.name.includes('David') ||
              v.name.includes('Guy') ||
              v.name.includes('Aaron') ||
              v.name.includes('George') ||
              v.name.includes('Natural'))
        );
        if (maleVoice) {
          utterance.voice = maleVoice;
        }

        utterance.onstart = () => {
          setIsPlaying(true);
          onSpeakingChange(true);
        };
        utterance.onend = () => {
          setIsPlaying(false);
          onSpeakingChange(false);
        };
        utterance.onerror = () => {
          setIsPlaying(false);
          onSpeakingChange(false);
        };

        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.warn('Speech synthesis notice:', err);
        setIsPlaying(false);
        onSpeakingChange(false);
      }
    },
    [audioSpeed, onSpeakingChange]
  );

  const playAudio = useCallback(
    async (text: string, base64Audio?: string | null) => {
      ensureAudioContext();

      if (currentAudioRef.current) {
        try {
          currentAudioRef.current.pause();
        } catch {}
        currentAudioRef.current = null;
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }

      if (isMuted) {
        setIsPlaying(false);
        onSpeakingChange(false);
        return;
      }

      if (base64Audio && typeof base64Audio === 'string' && base64Audio.length > 50) {
        try {
          const cleanBase64 = base64Audio.replace(/\s+/g, '');
          const audioUrl = `data:audio/wav;base64,${cleanBase64}`;
          const audio = new Audio(audioUrl);
          audio.playbackRate = audioSpeed;
          currentAudioRef.current = audio;

          audio.onplay = () => {
            setIsPlaying(true);
            onSpeakingChange(true);
          };
          audio.onended = () => {
            setIsPlaying(false);
            onSpeakingChange(false);
          };
          audio.onerror = () => {
            fallbackBrowserSpeech(text);
          };

          await audio.play();
          return;
        } catch (err) {
          console.warn('WAV playback bypassed, using speech synthesis:', err);
        }
      }

      fallbackBrowserSpeech(text);
    },
    [isMuted, audioSpeed, onSpeakingChange, fallbackBrowserSpeech]
  );

  const handleSendMessage = async (queryText: string) => {
    const trimmed = queryText.trim();
    if (!trimmed) return;

    ensureAudioContext();
    setErrorMessage(null);

    const now = formatTimestamp();
    const userMessage: ConversationMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: trimmed,
      timestamp: now,
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInputText('');
    setIsSynthesizing(true);

    try {
      const res = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          history: newHistory.map((m) => ({ role: m.role, text: m.text })),
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      const data = await res.json();
      const assistantText =
        data.text ||
        "I'm Hans, speaking on behalf of Robin Silm. I'd be glad to discuss Robin's craftsmanship and background in detail.";

      const assistantMessage: ConversationMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        text: assistantText,
        audioBase64: data.audioBase64 || null,
        timestamp: formatTimestamp(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setCurrentUtterance(assistantText);
      setIsSynthesizing(false);

      // Record exchange in conversation history
      const newExchange: ConversationExchange = {
        id: `exchange-${Date.now()}`,
        question: trimmed,
        answer: assistantText,
        timestamp: formatTimestamp(),
        audioBase64: data.audioBase64 || null,
      };
      setExchanges((prev) => [...prev, newExchange]);

      await playAudio(assistantText, data.audioBase64);
    } catch (err: any) {
      console.warn('Chat request notice:', err);
      setIsSynthesizing(false);

      const localReply =
        "As Robin Silm, I bring together precision woodworking from my Level 4 Joinery training, rigorous discipline from the Estonian Defence Forces, and ongoing entrepreneurship studies at EBS. I'm always open to discussing new opportunities.";
      const assistantMessage: ConversationMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        text: localReply,
        timestamp: formatTimestamp(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setCurrentUtterance(localReply);

      // Record fallback exchange
      const fallbackExchange: ConversationExchange = {
        id: `exchange-${Date.now()}`,
        question: trimmed,
        answer: localReply,
        timestamp: formatTimestamp(),
        audioBase64: null,
      };
      setExchanges((prev) => [...prev, fallbackExchange]);

      await playAudio(localReply, null);
    }
  };

  // Listen to external prompt changes (e.g. from CareerDossier or SkillTags buttons)
  useEffect(() => {
    if (externalPrompt) {
      handleSendMessage(externalPrompt);
      if (onClearExternalPrompt) {
        onClearExternalPrompt();
      }
    }
  }, [externalPrompt, onClearExternalPrompt]);

  const toggleListening = () => {
    ensureAudioContext();

    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setErrorMessage(
        'Speech recognition is not active in this browser. You can type your query in the box below.'
      );
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
        setErrorMessage(null);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results?.[0]?.[0]?.transcript;
        setIsListening(false);
        if (transcript) {
          handleSendMessage(transcript);
        }
      };

      recognition.onerror = (event: any) => {
        setIsListening(false);
        if (event.error !== 'no-speech') {
          setErrorMessage('Could not capture audio clearly. Please try again or type below.');
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e: any) {
      setIsListening(false);
      setErrorMessage('Microphone access notice. Ensure microphone permissions are allowed.');
    }
  };

  const playInitialGreeting = async () => {
    ensureAudioContext();
    setIsSynthesizing(true);
    try {
      const res = await fetch('/api/assistant/welcome');
      const data = await res.json();
      setCurrentUtterance(data.text);
      setMessages([
        {
          id: 'welcome-0',
          role: 'assistant',
          text: data.text,
          audioBase64: data.audioBase64 || null,
          timestamp: formatTimestamp(),
        },
      ]);
      setIsSynthesizing(false);
      await playAudio(data.text, data.audioBase64);
    } catch {
      setIsSynthesizing(false);
      await playAudio(currentUtterance, null);
    }
  };

  const stopPlayback = () => {
    if (currentAudioRef.current) {
      try {
        currentAudioRef.current.pause();
      } catch {}
      currentAudioRef.current = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    onSpeakingChange(false);
  };

  useEffect(() => {
    setMessages([
      {
        id: 'init-msg',
        role: 'assistant',
        text: currentUtterance,
        timestamp: 'Present',
      },
    ]);
  }, []);

  return (
    <section
      id="voice-studio"
      className="relative w-full bg-[#FAF7F2] py-12 lg:py-20 border-b border-[#EBE4D5]"
    >
      <div className="max-w-4xl mx-auto px-6">
        {/* Header Kicker & Title */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-[#78716C] mb-3">
            <span>Voice Representative</span>
            <span aria-hidden="true">·</span>
            <span>Hans Persona</span>
            <span aria-hidden="true">·</span>
            <span>Deep American Tone</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-normal text-[#1C1917] tracking-tight leading-tight text-balance">
            Speak with Hans, Representing Robin Silm
          </h1>

          <p className="mt-4 text-base sm:text-lg text-[#57534E] max-w-2xl mx-auto font-light leading-relaxed">
            Inquire verbally or in writing about Robin’s craftsmanship, commercial installations
            at Bolt, military discipline in the Estonian Defence Forces, and business leadership.
          </p>
        </div>

        {/* Central Audio Console Card */}
        <div className="bg-[#FAF7F2] border border-[#E5DFD3] rounded-2xl p-6 sm:p-8 shadow-xs relative">
          {/* Spoken Quote / Utterance Window */}
          <div className="min-h-[110px] flex flex-col justify-center items-center text-center px-4 py-3 bg-[#F4EFE6] border border-[#E8E1D3] rounded-xl mb-6">
            <span className="text-[11px] uppercase tracking-wider text-[#8C5E35] font-semibold mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" />
              <span>Hans Spoken Voice</span>
              {isSynthesizing && <span className="text-[#78716C]">(Synthesizing voice...)</span>}
            </span>

            <div className="font-serif italic text-base sm:text-lg text-[#1C1917] max-w-2xl leading-relaxed">
              <span>"</span>
              <TypewriterText
                key={currentUtterance}
                text={currentUtterance}
                isNew={true}
                speedMs={36}
              />
              <span>"</span>
            </div>
          </div>

          {/* Organic Waveform Visualizer */}
          <div className="py-2 mb-6">
            <WaveformVisualizer
              analyser={analyserRef.current}
              isPlaying={isPlaying}
              isListening={isListening}
            />
          </div>

          {/* Primary Voice Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#EBE4D5]">
            {/* Audio Playback Controls */}
            <div className="flex items-center gap-2">
              {isPlaying ? (
                <button
                  onClick={stopPlayback}
                  className="px-4 py-2 bg-[#1C1917] hover:bg-[#38332E] text-white text-xs font-medium rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <VolumeX className="w-3.5 h-3.5" />
                  <span>Pause Hans</span>
                </button>
              ) : (
                <button
                  onClick={() => playAudio(currentUtterance)}
                  className="px-4 py-2 bg-[#EFECE4] hover:bg-[#E5DFD3] text-[#1C1917] text-xs font-medium rounded-lg flex items-center gap-2 transition-colors cursor-pointer border border-[#DDD6C7]"
                >
                  <Volume2 className="w-3.5 h-3.5 text-[#8C5E35]" />
                  <span>Play Hans Voice</span>
                </button>
              )}

              <button
                onClick={() => setAudioSpeed((s) => (s === 1 ? 1.25 : 1))}
                className="px-2.5 py-2 text-xs font-mono tabular-nums text-[#78716C] hover:text-[#1C1917] hover:bg-[#EFECE4] rounded-lg transition-colors cursor-pointer border border-transparent hover:border-[#DDD6C7]"
                title="Toggle playback speed"
              >
                {audioSpeed}x
              </button>

              <button
                onClick={() => setIsMuted((m) => !m)}
                className="p-2 text-[#78716C] hover:text-[#1C1917] hover:bg-[#EFECE4] rounded-lg transition-colors cursor-pointer"
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-red-600" /> : <Volume2 className="w-4 h-4" />}
              </button>

              <button
                onClick={playInitialGreeting}
                className="p-2 text-[#78716C] hover:text-[#1C1917] hover:bg-[#EFECE4] rounded-lg transition-colors cursor-pointer"
                title="Hear initial greeting"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            {/* Microphone Interaction Trigger */}
            <div className="flex items-center gap-3">
              <button
                onClick={toggleListening}
                className={`flex items-center gap-2.5 px-6 py-3 rounded-full font-medium text-sm transition-all shadow-sm cursor-pointer ${
                  isListening
                    ? 'bg-amber-600 hover:bg-amber-700 text-white animate-pulse'
                    : 'bg-[#1C1917] hover:bg-[#38332E] text-white'
                }`}
              >
                {isListening ? (
                  <>
                    <MicOff className="w-4 h-4" />
                    <span>Listening... Tap to finish</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4 text-amber-200" />
                    <span>Speak to Hans</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Text Input Row for Typed Queries */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputText);
            }}
            className="mt-6 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Or type a question for Robin's voice assistant..."
              className="flex-1 px-4 py-2.5 text-sm bg-white border border-[#DDD6C7] rounded-lg text-[#1C1917] placeholder-[#A8A196] focus:outline-none focus:ring-2 focus:ring-[#8C5E35]/30 focus:border-[#8C5E35] transition-all"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isSynthesizing}
              className="px-4 py-2.5 bg-[#1C1917] disabled:bg-[#DDD6C7] hover:bg-[#38332E] text-white text-xs font-medium uppercase tracking-wider rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
            >
              <span>Ask</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Error Banner */}
          {errorMessage && (
            <div className="mt-4 p-3 bg-stone-100 border border-stone-300 rounded-lg text-xs text-stone-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-700" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Curated Prompt Starters */}
          <div className="mt-8 pt-6 border-t border-[#EBE4D5]">
            <p className="text-xs uppercase tracking-wider text-[#78716C] font-semibold mb-3">
              Suggested Conversation Topics:
            </p>
            <div className="flex flex-wrap gap-2">
              {PROMPT_STARTERS.map((starter) => (
                <button
                  key={starter.label}
                  onClick={() => handleSendMessage(starter.query)}
                  className="px-3 py-2 text-xs text-[#38332E] bg-[#F2EDE2] hover:bg-[#E8E1D3] hover:text-[#1C1917] rounded-md border border-[#E0D9CB] transition-colors text-left flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="text-[#8C5E35]">✦</span>
                  <span className="font-medium">{starter.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Conversation Transcript Drawer & Conversation History */}
        <div className="mt-8 space-y-6">
          <TranscriptDrawer
            messages={messages}
            isOpen={isTranscriptOpen}
            onToggle={() => setIsTranscriptOpen(!isTranscriptOpen)}
            onReplayAudio={(msg) => playAudio(msg.text, msg.audioBase64)}
            onClearHistory={() => {
              setMessages([]);
              setExchanges([]);
            }}
          />

          {/* Conversation History (Last 5 Exchanges) */}
          <ConversationHistory
            exchanges={exchanges}
            onReplayAnswer={(answer, audioBase64) => playAudio(answer, audioBase64)}
            onClearHistory={() => setExchanges([])}
            onSelectPrompt={(question) => handleSendMessage(question)}
          />
        </div>
      </div>
    </section>
  );
};
