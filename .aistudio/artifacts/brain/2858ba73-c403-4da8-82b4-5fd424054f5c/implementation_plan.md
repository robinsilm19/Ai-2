# Hans — The Voice of Robin Silm: Minimalist Portfolio & Interactive Voice Assistant

An editorial, sophisticated voice assistant and interactive portfolio representing Robin Silm, voiced by "Hans" with a deep, measured American male tone, set against a warm cream canvas with classical serif typography and verified craftsmanship credentials.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> The following architectural and UX specifications have been synthesized from your request and confirmed clarifications:

- **Confirmed Voice & Audio Experience**: Interactive voice conversation interface equipped with an organic Web Audio API waveform visualizer and a collapsible live transcript toggle.
- **Confirmed Representation Persona**: First-person authentic voice persona ("Hans, speaking directly as Robin Silm"), communicating Robin's career journey, craftsmanship, military discipline, and business goals with clarity and warmth.
- **Confirmed Portfolio Highlights**: Verified Estonian Defence Forces military service and Level 4 Joiner credentials presented through editorial unboxed craftsmanship milestones and interactive question prompts.
- **Voice Synthesis Model**: Server-side Gemini 3.8 speech synthesis (`gemini-3.8-flash-lite-tts` with the `Fenrir` deep male prebuilt voice profile) paired with intelligent first-person conversational reasoning via `gemini-3.8-flash`, with seamless client-side Web Audio API streaming playback and speech recognition fallback.

---

### 1. Overview & Core Concept

- **What It Does**: Visitors enter an editorial digital salon where Hans acts as Robin Silm's authentic voice persona. Visitors can speak directly via microphone, type inquiries, or select curated conversational prompts (e.g., about solid wood joinery, commercial furniture installations at Bolt/Rocca al Mare, botanical landscaping, pool facility operations at Mustamäe Spa, or studies at Estonian Business School). Hans responds verbally in a resonant, deep male tone accompanied by fluid acoustic waveform physics and synchronized transcript readouts.
- **Target Audience / Persona**: Recruiters, craft studio patrons, business partners, hiring managers, and collaborators seeking to evaluate Robin Silm’s blend of mechanical problem-solving, craftsmanship, and leadership.
- **Key Value**: Replaces flat, static PDF resumes with an engaging, memorable voice-first interaction while respecting high-end editorial aesthetics and verified career milestones.

---

### 2. User Experience & Visual Design

#### Key User Flows
1. **The Arrival & Greeting**: The visitor lands on a quiet, warm cream stage. Hans welcomes the visitor with a warm audio greeting introducing Robin Silm's background in precision joinery, entrepreneurship, and technical operations.
2. **Interactive Voice Conversation**:
   - The user taps the microphone button or enters a query (or clicks one of the suggested prompts: *"Tell me about your work at Bolt offices"*, *"What was your experience in the Estonian Defence Forces?"*, *"How do you connect aesthetics with joinery?"*).
   - An organic waveform animates as Hans processes and streams his response in a deep, composed American male voice.
   - The transcript panel highlights spoken phrases in real time, with the ability to toggle the transcript view or replay audio.
3. **Verified Credential Dossier**:
   - Below the voice console, visitors explore Robin's career chapters: Joinery & Staircase Craftsmanship (M.P.Trepid OÜ & Matek AS), Commercial Interiors (Pristalpaigaluds at Bolt and Rocca al Mare School), Botanical Landscaping (Aiabutiik T.T), and Facility Leadership (Mustamäe Spa OÜ).
   - Unboxed skill tags showcase verified competencies (AutoCAD, SolidWorks, Level 4 Joinery Certificate, B1 Driver's License, Estonian Defence Forces).
4. **Direct Contact & Dossier Download**: A clean modal allows direct emailing to `Robinsilm19@gmail.com`, calling `+37258056631`, or viewing the original certified CV document.

#### Visual Identity & Theme
- **Aesthetic Direction**: Minimalist Luxury Editorial Monograph. Evokes high-end architectural publications and master craftsman archives (warm paper, generous margins, hairline dividers, zero visual clutter).
- **Color Palette & Discipline (60-30-10)**:
  - *60% Neutral Canvas*: Warm antique cream (`#FBF9F5` / `#F5F2EB`).
  - *30% Structural Surfaces*: Warm travertine card backgrounds (`#EFECE4`), hairline dividers (`rgba(28, 25, 23, 0.08)`), and deep espresso body text (`#1C1917`).
  - *10% Focal Accent*: Cognac brass (`#8C5E35`) and polished charcoal (`#121110`) reserved strictly for interactive states, audio visualizer bars, and active microphone triggers.
- **Typography & Scale**:
  - *Display Headings*: `Playfair Display` or `Cormorant Garamond` serif with balanced line breaks and tight tracking for an intellectual, timeless feel.
  - *Body & Controls*: `Plus Jakarta Sans` for clean legibility at 14px–16px.
  - *Metadata & Numerals*: Tabular numerals (`tabular-nums`) with unboxed text formatting separated by subtle middle dots (`·`).
- **Zero-Pill Compliance**:
  - No static badge capsules or candy pill enclosures.
  - Skills and credentials displayed as quiet, unboxed typographic tags with hairline dividers.
  - Top navigation strictly adheres to the 3-Zone Contract: Brand Wordmark (`Robin Silm`), Nav Links (`Voice Dialogue`, `Dossier`, `Craftsmanship`, `Education`), and 1 Primary Action (`Connect`).

---

### 3. Key Product Decisions & Trade-Offs

#### Decision 1: Deep Voice Persona Architecture (Fenrir Voice Profile)
- **Chosen Approach**: Utilize Gemini 3.8 speech generation with prebuilt voice `Fenrir`—a resonant, deep male tone with an American accent—backed by `gemini-3.8-flash` for contextual dialogue reasoning.
- **Why**: Perfectly fulfills the user's explicit requirement ("Hans", deep male tone, American accent) while providing low-latency, natural pacing and rich prosody.
- **Fallback**: Incorporate client-side Web Speech Synthesis as an instant fallback in case of network interruption so Hans never falls silent.

#### Decision 2: First-Person Persona Grounding with Robin Silm's Exact CV
- **Chosen Approach**: Hans speaks in the first person representing Robin Silm, equipped with Robin's complete curriculum vitae (Estonian Defence Forces service, Level 4 Joiner certificate, EBS business studies, Pristalpaigaluds installations, Mustamäe Spa leadership).
- **Why**: Delivers an authentic, confident conversational partner that accurately represents Robin to recruiters and clients without hallucinating facts.

#### Decision 3: Full-Stack Architecture with Express & Vite Middleware
- **Chosen Approach**: Use a unified Express + Vite dev server (`server.ts`) hosting secure `/api/assistant/chat` and `/api/assistant/speak` routes utilizing `@google/genai` on the backend with `process.env.GEMINI_API_KEY`.
- **Why**: Keeps the API key completely secure on the server while allowing low-latency streaming of synthesized audio buffers and transcripts.

---

### 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Minimalist Browser Client                       │
├────────────────────────────────┬───────────────────────────────────────┤
│ Top Bar: Robin Silm Wordmark   │ Nav: Voice · Dossier · Craft · Contact│
├────────────────────────────────┴───────────────────────────────────────┤
│                                                                        │
│  ┌───────────────────────────┐     ┌────────────────────────────────┐  │
│  │   Hans Voice Studio       │     │   Robin Silm Verified Dossier  │  │
│  │  ┌─────────────────────┐  │     │   • Estonian Defence Forces    │  │
│  │  │ Serif Headline &    │  │     │   • Level 4 Joiner Certificate │  │
│  │  │ First-Person Intro  │  │     │   • Estonian Business School   │  │
│  │  └─────────────────────┘  │     │   • Pristalpaigaluds / Bolt    │  │
│  │  ┌─────────────────────┐  │     │   • M.P.Trepid Solid Wood      │  │
│  │  │ Live Waveform Visual│  │     │   • Mustamäe Spa Operations    │  │
│  │  │ (Web Audio Analyser)│  │     └────────────────────────────────┘  │
│  │  └─────────────────────┘  │                                         │
│  │  ┌─────────────────────┐  │     ┌────────────────────────────────┐  │
│  │  │ Interactive Mic /   │  │     │   Curated Dialogue Starters    │  │
│  │  │ Audio Controls      │  │     │   "Tell me about Bolt office"  │  │
│  │  └─────────────────────┘  │     │   "How do you approach wood?"  │  │
│  │  ┌─────────────────────┐  │     │   "What did military teach?"   │  │
│  │  │ Live Transcript Box │  │     └────────────────────────────────┘  │
│  │  └─────────────────────┘  │                                         │
│  └───────────────────────────┘                                         │
└────────────────────────────────┬───────────────────────────────────────┘
                                 │ HTTP POST /api/assistant/*
                                 ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      Express Backend (server.ts)                       │
├────────────────────────────────────────────────────────────────────────┤
│  • Persona Engine: Robin Silm System Prompt + CV Knowledge Base        │
│  • Gemini SDK Client: @google/genai (User-Agent: aistudio-build)       │
│  • Reasoning Model: gemini-3.8-flash                                   │
│  • Audio Synthesis: gemini-3.8-flash-lite-tts (Voice: Fenrir)          │
└────────────────────────────────────────────────────────────────────────┘
```

#### Component & State Mapping
- `App.tsx`: Main page orchestration, theme baseline, layout structure.
- `VoiceConsole.tsx`: Central interactive audio hub containing microphone capture, audio waveform renderer, speech playback management, and prompt starters.
- `WaveformVisualizer.tsx`: Web Audio API `AnalyserNode` canvas rendering subtle, fluid acoustic bars in warm espresso and brass hues.
- `TranscriptDrawer.tsx`: Collapsible live transcript view displaying Hans's words with auto-scrolling and audio scrub points.
- `CareerDossier.tsx`: Editorial presentation of Robin's career chapters, joinery milestones, and educational achievements.
- `SkillTags.tsx`: Unboxed credential tags highlighting military service, joinery certifications, CAD tools, and multilingual skills.
- `ContactModal.tsx`: Minimalist dialogue modal to send direct messages, copy phone/email, or view the certified resume.
- `server.ts`: Express backend handling Gemini API reasoning and speech synthesis with `Fenrir` voice.
