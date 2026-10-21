import React from 'react';
import { ROBIN_PROFILE } from '../data/robinData';
import { Hammer, Building2, Trees, Compass } from 'lucide-react';

interface CraftsmanshipSectionProps {
  onAskHans: (topic: string) => void;
}

export const CraftsmanshipSection: React.FC<CraftsmanshipSectionProps> = ({ onAskHans }) => {
  return (
    <section id="craftsmanship" className="w-full bg-[#FAF7F2] py-16 lg:py-24 border-b border-[#EBE4D5]">
      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#78716C] mb-2">
            <span>Philosophy & Methods</span>
            <span aria-hidden="true">·</span>
            <span>Architectural Integration</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif text-[#1C1917] tracking-tight">
            Connecting Aesthetics with Functionality
          </h2>
          <p className="mt-4 text-base text-[#57534E] font-light leading-relaxed">
            "{ROBIN_PROFILE.summary.split('. ')[1]}." Robin combines hands-on joinery machinery mastery with digital drafting (AutoCAD, SolidWorks) and high-level enterprise operations.
          </p>
        </div>

        {/* 4 Pillars of Craftsmanship */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Pillar 1 */}
          <div className="bg-white border border-[#E5DFD3] rounded-xl p-6 hover:border-[#C7BFA8] transition-all flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded-lg bg-[#FAF7F2] border border-[#E8E1D3] flex items-center justify-center text-[#8C5E35] mb-4">
                <Hammer className="w-4 h-4" />
              </div>
              <h3 className="text-base font-serif font-medium text-[#1C1917] mb-2">
                Solid Wood Craft
              </h3>
              <p className="text-xs text-[#57534E] font-light leading-relaxed mb-4">
                Specialized in custom solid wood staircases, joinery finishing, and bespoke furniture built to millimeters.
              </p>
            </div>
            <button
              onClick={() => onAskHans('How do you craft solid wood staircases?')}
              className="text-xs font-semibold text-[#8C5E35] hover:text-[#1C1917] transition-colors text-left cursor-pointer"
            >
              Ask Hans about this →
            </button>
          </div>

          {/* Pillar 2 */}
          <div className="bg-white border border-[#E5DFD3] rounded-xl p-6 hover:border-[#C7BFA8] transition-all flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded-lg bg-[#FAF7F2] border border-[#E8E1D3] flex items-center justify-center text-[#8C5E35] mb-4">
                <Building2 className="w-4 h-4" />
              </div>
              <h3 className="text-base font-serif font-medium text-[#1C1917] mb-2">
                Commercial Interiors
              </h3>
              <p className="text-xs text-[#57534E] font-light leading-relaxed mb-4">
                Fitted premier corporate spaces like Bolt’s Tallinn HQ and Rocca al Mare School with designer kitchens and office setups.
              </p>
            </div>
            <button
              onClick={() => onAskHans('Tell me about your installations at Bolt offices')}
              className="text-xs font-semibold text-[#8C5E35] hover:text-[#1C1917] transition-colors text-left cursor-pointer"
            >
              Ask Hans about this →
            </button>
          </div>

          {/* Pillar 3 */}
          <div className="bg-white border border-[#E5DFD3] rounded-xl p-6 hover:border-[#C7BFA8] transition-all flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded-lg bg-[#FAF7F2] border border-[#E8E1D3] flex items-center justify-center text-[#8C5E35] mb-4">
                <Trees className="w-4 h-4" />
              </div>
              <h3 className="text-base font-serif font-medium text-[#1C1917] mb-2">
                Horticulture & Landscape
              </h3>
              <p className="text-xs text-[#57534E] font-light leading-relaxed mb-4">
                Botanical garden landscaping and outdoor architecture, blending biological stewardship with spatial harmony.
              </p>
            </div>
            <button
              onClick={() => onAskHans('What was your contribution to the Estonian Botanical Garden?')}
              className="text-xs font-semibold text-[#8C5E35] hover:text-[#1C1917] transition-colors text-left cursor-pointer"
            >
              Ask Hans about this →
            </button>
          </div>

          {/* Pillar 4 */}
          <div className="bg-white border border-[#E5DFD3] rounded-xl p-6 hover:border-[#C7BFA8] transition-all flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded-lg bg-[#FAF7F2] border border-[#E8E1D3] flex items-center justify-center text-[#8C5E35] mb-4">
                <Compass className="w-4 h-4" />
              </div>
              <h3 className="text-base font-serif font-medium text-[#1C1917] mb-2">
                Business & Enterprise
              </h3>
              <p className="text-xs text-[#57534E] font-light leading-relaxed mb-4">
                Estonian Business School studies bridging craftsmanship, operational scalability, and venture leadership.
              </p>
            </div>
            <button
              onClick={() => onAskHans('How does your degree at EBS elevate your craft?')}
              className="text-xs font-semibold text-[#8C5E35] hover:text-[#1C1917] transition-colors text-left cursor-pointer"
            >
              Ask Hans about this →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
