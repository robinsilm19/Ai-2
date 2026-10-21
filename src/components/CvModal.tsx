import React, { useEffect } from 'react';
import { X, Download, ExternalLink, FileText } from 'lucide-react';
import { ROBIN_PROFILE } from '../data/robinData';

interface CvModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CvModal: React.FC<CvModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-xs">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#FAF7F2] rounded-2xl border border-[#E5DFD3] shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#EBE4D5] flex items-center justify-between bg-[#F5F1E8]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white border border-[#DDD6C7] flex items-center justify-center text-[#8C5E35]">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-serif font-medium text-[#1C1917]">
                Robin Silm — Certified Curriculum Vitae
              </h3>
              <p className="text-xs text-[#78716C]">
                Official PDF Document (CV_ENGLISH)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={ROBIN_PROFILE.pdfPath}
              download="Robin_Silm_CV.pdf"
              className="px-3.5 py-1.5 text-xs font-medium text-white bg-[#1C1917] hover:bg-[#38332E] rounded-md transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </a>
            <button
              onClick={onClose}
              className="p-1.5 text-[#78716C] hover:text-[#1C1917] rounded-md transition-colors cursor-pointer"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Embedded PDF or PDF Viewer with Fallback */}
        <div className="flex-1 min-h-[500px] p-4 bg-[#EFECE4]">
          <iframe
            src={`${ROBIN_PROFILE.pdfPath}#toolbar=1`}
            title="Robin Silm CV"
            className="w-full h-full min-h-[500px] rounded-lg border border-[#DDD6C7] bg-white shadow-inner"
          />
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 border-t border-[#EBE4D5] bg-[#FAF7F2] text-xs text-[#78716C] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>Tallinn, Estonia</span>
            <span aria-hidden="true">·</span>
            <span>Level 4 Joiner</span>
            <span aria-hidden="true">·</span>
            <span>Estonian Defence Forces</span>
          </div>
          <a
            href={ROBIN_PROFILE.pdfPath}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#8C5E35] hover:underline flex items-center gap-1"
          >
            <span>Open in new tab</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};
