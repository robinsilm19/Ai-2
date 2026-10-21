import React from 'react';
import { ROBIN_PROFILE } from '../data/robinData';

interface FooterProps {
  onOpenContact: () => void;
  onOpenCv: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenContact, onOpenCv }) => {
  return (
    <footer className="w-full bg-[#FAF7F2] border-t border-[#EBE4D5] py-12 px-6 lg:px-12">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="text-lg font-serif font-semibold text-[#1C1917] tracking-tight block">
            Robin Silm
          </span>
          {/* Unboxed Metadata with · separator */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-[#78716C] mt-1 font-light">
            <span>Tallinn, Estonia</span>
            <span aria-hidden="true">·</span>
            <span>Level 4 Joiner</span>
            <span aria-hidden="true">·</span>
            <span>Estonian Defence Forces</span>
            <span aria-hidden="true">·</span>
            <span>EBS Entrepreneurship</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-xs text-[#57534E]">
          <a
            href={`mailto:${ROBIN_PROFILE.email}`}
            className="hover:text-[#1C1917] transition-colors"
          >
            {ROBIN_PROFILE.email}
          </a>
          <a
            href={`tel:${ROBIN_PROFILE.phone}`}
            className="hover:text-[#1C1917] transition-colors"
          >
            {ROBIN_PROFILE.phone}
          </a>
          <button
            onClick={onOpenCv}
            className="hover:text-[#1C1917] transition-colors cursor-pointer"
          >
            Certified CV
          </button>
          <button
            onClick={onOpenContact}
            className="font-semibold text-[#8C5E35] hover:text-[#1C1917] transition-colors cursor-pointer"
          >
            Connect
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-[#F2ECE1] text-[11px] text-[#A8A196] flex flex-col sm:flex-row justify-between items-center gap-3">
        <span>© {new Date().getFullYear()} Robin Silm. Voice Assistant Persona: Hans.</span>
        <span>Aesthetic: Minimalist Editorial · Cream & Serif</span>
      </div>
    </footer>
  );
};
