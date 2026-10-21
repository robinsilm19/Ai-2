import React from 'react';
import { VERIFIED_CREDENTIALS, LANGUAGES } from '../data/robinData';
import { Shield, Award, BookOpen, Compass } from 'lucide-react';

interface SkillTagsProps {
  onAskHans: (topic: string) => void;
}

export const SkillTags: React.FC<SkillTagsProps> = ({ onAskHans }) => {
  return (
    <section id="credentials" className="w-full bg-[#F5F1E8] py-16 lg:py-24 border-b border-[#EBE4D5]">
      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        <div className="mb-12">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#78716C] mb-2">
            <span>Verified Credentials</span>
            <span aria-hidden="true">·</span>
            <span>Accreditations & Skills</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif text-[#1C1917] tracking-tight">
            Qualifications & Core Competencies
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#57534E] max-w-2xl font-light">
            Verified state certifications, military service record, academic studies, and technical proficiencies.
          </p>
        </div>

        {/* 2-Column Grid: Left Credentials, Right Technical & Languages */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left Column: Verified Accreditations */}
          <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-wider font-semibold text-[#8C5E35] mb-4 flex items-center gap-2">
              <Award className="w-4 h-4" />
              <span>Official Accreditations</span>
            </h3>

            {VERIFIED_CREDENTIALS.map((cred) => (
              <div
                key={cred.title}
                className="bg-white border border-[#E5DFD3] rounded-xl p-5 hover:border-[#C7BFA8] transition-all group"
              >
                <div className="flex items-start justify-between gap-3 mb-1.5">
                  <h4 className="text-base font-serif font-medium text-[#1C1917]">
                    {cred.title}
                  </h4>
                  <span className="text-xs font-mono text-[#8C5E35] shrink-0 font-medium">
                    {cred.year}
                  </span>
                </div>

                {/* Unboxed Metadata with · separator */}
                <div className="flex items-center gap-2 text-xs text-[#78716C] mb-2.5">
                  <span>{cred.issuer}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-[#38332E]">Verified</span>
                </div>

                <p className="text-xs sm:text-sm text-[#57534E] font-light leading-relaxed mb-3">
                  {cred.description}
                </p>

                <button
                  onClick={() => onAskHans(cred.title)}
                  className="text-xs text-[#8C5E35] hover:text-[#1C1917] font-medium flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span>Ask Hans about this qualification →</span>
                </button>
              </div>
            ))}
          </div>

          {/* Right Column: Craftsmanship Skills & Languages */}
          <div className="space-y-6">
            {/* Craft & Technical Skills Matrix */}
            <div className="bg-white border border-[#E5DFD3] rounded-xl p-6">
              <h3 className="text-xs uppercase tracking-wider font-semibold text-[#8C5E35] mb-4 flex items-center gap-2">
                <Compass className="w-4 h-4" />
                <span>Technical & Craftsmanship Mastery</span>
              </h3>

              <div className="space-y-4 text-xs sm:text-sm">
                <div>
                  <span className="font-semibold text-[#1C1917] block mb-1">
                    Woodworking Machinery & Precision Joining
                  </span>
                  <p className="text-[#57534E] font-light">
                    Industrial spindle moulders, thicknessers, routers, CNC cutting, solid wood staircases, bespoke architectural furnishings.
                  </p>
                </div>

                <div className="pt-3 border-t border-[#F2ECE1]">
                  <span className="font-semibold text-[#1C1917] block mb-1">
                    Design & Drafting Software
                  </span>
                  {/* Clean unboxed text with separators */}
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#57534E]">
                    <span>AutoCAD</span>
                    <span aria-hidden="true">·</span>
                    <span>SolidWorks 3D</span>
                    <span aria-hidden="true">·</span>
                    <span>Microsoft Office (Word, Excel, PowerPoint)</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#F2ECE1]">
                  <span className="font-semibold text-[#1C1917] block mb-1">
                    Operational & Site Leadership
                  </span>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#57534E]">
                    <span>Commercial Site Fitting (Bolt HQ)</span>
                    <span aria-hidden="true">·</span>
                    <span>Public Safety Protocols</span>
                    <span aria-hidden="true">·</span>
                    <span>Team Management</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Languages Matrix */}
            <div className="bg-white border border-[#E5DFD3] rounded-xl p-6">
              <h3 className="text-xs uppercase tracking-wider font-semibold text-[#8C5E35] mb-4 flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span>Linguistic Proficiency</span>
              </h3>

              <div className="space-y-3">
                {LANGUAGES.map((lang) => (
                  <div
                    key={lang.language}
                    className="flex items-center justify-between text-xs sm:text-sm py-1.5 border-b border-[#F2ECE1] last:border-0"
                  >
                    <div>
                      <span className="font-medium text-[#1C1917]">{lang.language}</span>
                      <span className="text-xs text-[#78716C] ml-2">({lang.level})</span>
                    </div>
                    <span className="font-mono text-xs text-[#8C5E35]">{lang.code}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Military Service Endorsement Card */}
            <div className="bg-[#EFEAE0] border border-[#DDD6C7] rounded-xl p-6">
              <div className="flex items-center gap-2 mb-2 text-[#8C5E35]">
                <Shield className="w-4 h-4" />
                <span className="text-xs uppercase tracking-wider font-semibold">
                  Estonian Defence Forces
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#38332E] font-light leading-relaxed">
                Service in the Defence Forces provided foundational character training in tactical composure, perseverance through rigorous challenges, and uncompromising accountability.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
