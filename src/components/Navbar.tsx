import React from 'react';
import { Volume2 } from 'lucide-react';

interface NavbarProps {
  onOpenContact: () => void;
  onOpenCv: () => void;
  isSpeaking: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenContact, onOpenCv, isSpeaking }) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-[#EBE4D5] px-6 lg:px-12 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#"
          className="text-xl font-serif font-bold tracking-tight text-[#1C1917] hover:text-[#8C5E35] transition-colors whitespace-nowrap shrink-0 flex items-center gap-2"
        >
          <span>Robin Silm</span>
          {isSpeaking && (
            <span className="text-[#8C5E35] inline-flex items-center" title="Hans is speaking">
              <Volume2 className="w-4 h-4 animate-pulse" />
            </span>
          )}
        </a>

        {/* Zone 2: 4-5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#57534E]">
          <a
            href="#voice-studio"
            className="hover:text-[#1C1917] transition-colors whitespace-nowrap shrink-0"
          >
            Voice Studio
          </a>
          <a
            href="#dossier"
            className="hover:text-[#1C1917] transition-colors whitespace-nowrap shrink-0"
          >
            Career Dossier
          </a>
          <a
            href="#craftsmanship"
            className="hover:text-[#1C1917] transition-colors whitespace-nowrap shrink-0"
          >
            Craftsmanship
          </a>
          <a
            href="#credentials"
            className="hover:text-[#1C1917] transition-colors whitespace-nowrap shrink-0"
          >
            Credentials
          </a>
          <button
            onClick={onOpenCv}
            className="text-[#78716C] hover:text-[#1C1917] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            View Certified CV
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenContact}
            className="px-5 py-2 text-xs uppercase tracking-wider font-semibold text-white bg-[#1C1917] hover:bg-[#38332E] rounded-md transition-colors whitespace-nowrap shrink-0 shadow-sm cursor-pointer"
          >
            Connect
          </button>
        </div>
      </div>
    </header>
  );
};
