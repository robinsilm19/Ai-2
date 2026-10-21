import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { VoiceConsole } from './components/VoiceConsole';
import { CareerDossier } from './components/CareerDossier';
import { CraftsmanshipSection } from './components/CraftsmanshipSection';
import { SkillTags } from './components/SkillTags';
import { ContactModal } from './components/ContactModal';
import { CvModal } from './components/CvModal';
import { Footer } from './components/Footer';

export default function App() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isCvOpen, setIsCvOpen] = useState(false);

  const [externalPrompt, setExternalPrompt] = useState<string | null>(null);

  // Callback to ask Hans a specific question from anywhere on the page
  const handleAskHans = (query: string) => {
    setExternalPrompt(query);
    const voiceElem = document.getElementById('voice-studio');
    if (voiceElem) {
      voiceElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAskAboutRole = (role: string, company: string) => {
    handleAskHans(`Could you tell me more about your work as ${role} at ${company}?`);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C1917] font-sans flex flex-col selection:bg-[#E5DFD3]">
      {/* 3-Zone Navigation Header */}
      <Navbar
        onOpenContact={() => setIsContactOpen(true)}
        onOpenCv={() => setIsCvOpen(true)}
        isSpeaking={isSpeaking}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Voice Studio Console */}
        <VoiceConsole
          onSpeakingChange={setIsSpeaking}
          onOpenCv={() => setIsCvOpen(true)}
          externalPrompt={externalPrompt}
          onClearExternalPrompt={() => setExternalPrompt(null)}
        />

        {/* Verified Career Dossier */}
        <CareerDossier
          onAskAboutRole={handleAskAboutRole}
          onOpenCv={() => setIsCvOpen(true)}
        />

        {/* Craftsmanship Philosophy */}
        <CraftsmanshipSection onAskHans={handleAskHans} />

        {/* Verified Credentials & Skills */}
        <SkillTags onAskHans={handleAskHans} />
      </main>

      {/* Editorial Footer */}
      <Footer
        onOpenContact={() => setIsContactOpen(true)}
        onOpenCv={() => setIsCvOpen(true)}
      />

      {/* Modals */}
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />

      <CvModal
        isOpen={isCvOpen}
        onClose={() => setIsCvOpen(false)}
      />
    </div>
  );
}
