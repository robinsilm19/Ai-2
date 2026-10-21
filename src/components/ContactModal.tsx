import React, { useState, useEffect } from 'react';
import { X, Mail, Phone, MapPin, Copy, Check, Send } from 'lucide-react';
import { ROBIN_PROFILE } from '../data/robinData';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [senderName, setSenderName] = useState('');
  const [isSent, setIsSent] = useState(false);

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

  const copyToClipboard = (field: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    const mailtoUrl = `mailto:${ROBIN_PROFILE.email}?subject=${encodeURIComponent(
      subject || 'Inquiry for Robin Silm'
    )}&body=${encodeURIComponent(
      `Hello Robin,\n\n${message}\n\nFrom,\n${senderName || 'A prospective collaborator'}`
    )}`;
    window.location.href = mailtoUrl;
    setIsSent(true);
    setTimeout(() => {
      setIsSent(false);
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-[#FAF7F2] rounded-2xl border border-[#E5DFD3] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#EBE4D5] flex items-center justify-between bg-[#F5F1E8]">
          <div>
            <h3 className="text-lg font-serif font-medium text-[#1C1917]">
              Connect with Robin Silm
            </h3>
            <p className="text-xs text-[#78716C]">
              Direct contact coordinates & collaboration inquiries
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#78716C] hover:text-[#1C1917] rounded-md transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Coordinates Block */}
          <div className="space-y-3 bg-[#F4EFE6] border border-[#E8E1D3] rounded-xl p-4 text-xs sm:text-sm">
            {/* Email */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#8C5E35]" />
                <span className="text-[#78716C]">Email:</span>
                <a
                  href={`mailto:${ROBIN_PROFILE.email}`}
                  className="font-medium text-[#1C1917] hover:underline"
                >
                  {ROBIN_PROFILE.email}
                </a>
              </div>
              <button
                onClick={() => copyToClipboard('email', ROBIN_PROFILE.email)}
                className="text-xs text-[#78716C] hover:text-[#1C1917] flex items-center gap-1 cursor-pointer"
              >
                {copiedField === 'email' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            {/* Phone */}
            <div className="flex items-center justify-between pt-2 border-t border-[#E8E1D3]">
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#8C5E35]" />
                <span className="text-[#78716C]">Phone:</span>
                <a
                  href={`tel:${ROBIN_PROFILE.phone}`}
                  className="font-medium text-[#1C1917] hover:underline"
                >
                  {ROBIN_PROFILE.phone}
                </a>
              </div>
              <button
                onClick={() => copyToClipboard('phone', ROBIN_PROFILE.phone)}
                className="text-xs text-[#78716C] hover:text-[#1C1917] flex items-center gap-1 cursor-pointer"
              >
                {copiedField === 'phone' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            {/* Location */}
            <div className="flex items-center gap-2.5 pt-2 border-t border-[#E8E1D3]">
              <MapPin className="w-4 h-4 text-[#8C5E35]" />
              <span className="text-[#78716C]">Address:</span>
              <span className="font-medium text-[#1C1917]">{ROBIN_PROFILE.address}</span>
            </div>
          </div>

          {/* Quick Inquiry Email Form */}
          <form onSubmit={handleSendEmail} className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider font-semibold text-[#8C5E35]">
              Compose Direct Message
            </h4>

            <div>
              <label className="block text-xs text-[#57534E] mb-1">Your Name / Organization</label>
              <input
                type="text"
                required
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="e.g. Elena Vance, Studio Director"
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white border border-[#DDD6C7] rounded-lg text-[#1C1917] focus:outline-none focus:ring-2 focus:ring-[#8C5E35]/30 focus:border-[#8C5E35]"
              />
            </div>

            <div>
              <label className="block text-xs text-[#57534E] mb-1">Subject / Project Topic</label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Joinery project inquiry / Role discussion"
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white border border-[#DDD6C7] rounded-lg text-[#1C1917] focus:outline-none focus:ring-2 focus:ring-[#8C5E35]/30 focus:border-[#8C5E35]"
              />
            </div>

            <div>
              <label className="block text-xs text-[#57534E] mb-1">Message</label>
              <textarea
                required
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Briefly describe your project, timeline, or interview inquiry..."
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white border border-[#DDD6C7] rounded-lg text-[#1C1917] focus:outline-none focus:ring-2 focus:ring-[#8C5E35]/30 focus:border-[#8C5E35] resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSent}
              className="w-full py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#1C1917] hover:bg-[#38332E] rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:bg-emerald-700"
            >
              {isSent ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Email Client Opened</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Open Email with Robin</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
