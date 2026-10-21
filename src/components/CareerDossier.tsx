import React, { useState } from 'react';
import { CAREER_MILESTONES } from '../data/robinData';
import { MilestoneCategory, CareerMilestone } from '../types';
import { MessageSquare, ArrowUpRight } from 'lucide-react';

interface CareerDossierProps {
  onAskAboutRole: (role: string, company: string) => void;
  onOpenCv: () => void;
}

export const CareerDossier: React.FC<CareerDossierProps> = ({
  onAskAboutRole,
  onOpenCv,
}) => {
  const [activeCategory, setActiveCategory] = useState<MilestoneCategory | 'all'>('all');

  const filteredMilestones = CAREER_MILESTONES.filter(
    (m) => activeCategory === 'all' || m.category === activeCategory
  );

  return (
    <section id="dossier" className="w-full bg-[#FAF7F2] py-16 lg:py-24 border-b border-[#EBE4D5]">
      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#78716C] mb-2">
              <span>Curated Dossier</span>
              <span aria-hidden="true">·</span>
              <span>Professional Experience</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif text-[#1C1917] tracking-tight">
              Craftsmanship & Operations
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onOpenCv}
              className="text-xs font-semibold text-[#8C5E35] hover:text-[#1C1917] flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Download Signed Resume</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Interactive Segmented Filter Controls */}
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-[#EFECE4] rounded-xl border border-[#DDD6C7] max-w-fit mb-10">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-2 text-xs font-medium rounded-lg transition-all cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-white text-[#1C1917] shadow-xs'
                : 'text-[#78716C] hover:text-[#1C1917]'
            }`}
          >
            All Milestones ({CAREER_MILESTONES.length})
          </button>
          <button
            onClick={() => setActiveCategory('craft')}
            className={`px-4 py-2 text-xs font-medium rounded-lg transition-all cursor-pointer ${
              activeCategory === 'craft'
                ? 'bg-white text-[#1C1917] shadow-xs'
                : 'text-[#78716C] hover:text-[#1C1917]'
            }`}
          >
            Joinery & Mechanical
          </button>
          <button
            onClick={() => setActiveCategory('installation')}
            className={`px-4 py-2 text-xs font-medium rounded-lg transition-all cursor-pointer ${
              activeCategory === 'installation'
                ? 'bg-white text-[#1C1917] shadow-xs'
                : 'text-[#78716C] hover:text-[#1C1917]'
            }`}
          >
            Commercial Fit-outs
          </button>
          <button
            onClick={() => setActiveCategory('wellness')}
            className={`px-4 py-2 text-xs font-medium rounded-lg transition-all cursor-pointer ${
              activeCategory === 'wellness'
                ? 'bg-white text-[#1C1917] shadow-xs'
                : 'text-[#78716C] hover:text-[#1C1917]'
            }`}
          >
            Horticulture & Wellness
          </button>
        </div>

        {/* Milestone Cards Grid */}
        <div className="space-y-6">
          {filteredMilestones.map((m: CareerMilestone, index: number) => {
            const indexLabel = String(index + 1).padStart(2, '0');
            return (
              <div
                key={m.id}
                className="bg-white border border-[#E5DFD3] rounded-2xl p-6 sm:p-8 hover:border-[#C7BFA8] transition-all group"
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-4">
                  <div>
                    {/* Natural editorial numbering and metadata without pill enclosures */}
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[#78716C] font-mono mb-2">
                      <span className="font-semibold text-[#8C5E35]">{indexLabel}.</span>
                      <span>{m.company}</span>
                      <span aria-hidden="true">·</span>
                      <span className="tabular-nums">{m.period}</span>
                      <span aria-hidden="true">·</span>
                      <span>{m.location}</span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-serif text-[#1C1917] font-medium tracking-tight">
                      {m.role}
                    </h3>
                  </div>

                  {/* Ask Hans Button */}
                  <button
                    onClick={() => onAskAboutRole(m.role, m.company)}
                    className="self-start px-3.5 py-1.5 text-xs text-[#57534E] hover:text-[#1C1917] bg-[#FAF7F2] hover:bg-[#EFECE4] border border-[#DDD6C7] rounded-md transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                    title={`Ask Hans about Robin's time at ${m.company}`}
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-[#8C5E35]" />
                    <span>Ask Hans about this</span>
                  </button>
                </div>

                <p className="text-sm text-[#57534E] mb-4 font-light leading-relaxed">
                  {m.summary}
                </p>

                {/* Bullets */}
                <ul className="space-y-2 mb-4">
                  {m.bullets.map((b, bIdx) => (
                    <li
                      key={bIdx}
                      className="text-xs sm:text-sm text-[#38332E] flex items-start gap-2.5 leading-relaxed"
                    >
                      <span className="text-[#8C5E35] mt-1 shrink-0 text-[10px]">■</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>

                {/* Key Highlight Banner */}
                {m.keyHighlight && (
                  <div className="pt-3 border-t border-[#F2ECE1] text-xs text-[#78716C] flex items-center gap-2">
                    <span className="font-semibold text-[#1C1917]">Key Project:</span>
                    <span>{m.keyHighlight}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
