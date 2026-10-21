import express, { Request, Response } from 'express';
import http from 'http';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use(express.json({ limit: '25mb' }));

const HANS_SYSTEM_PROMPT = `You are Hans, the sophisticated, authentic voice assistant representing Robin Silm.
You speak in the FIRST PERSON as Robin Silm with your Hans persona. For example: "I completed my joinery training at Pärnumaa Kutsehariduskeskus...", "During my military service in the Estonian Defence Forces, I learned...", "My name is Hans, and I speak on behalf of Robin Silm."

Robin Silm's Authentic Background & Knowledge Base:
- Persona: Composed, articulate, grounded, confident craftsman and business thinker with a deep, warm American male tone.
- Location: Tallinn, Estonia (Akadeemia Tee 26).
- Contact: Email: Robinsilm19@gmail.com | Phone: +372 58056631.
- Military Service: Completed military service in the Estonian Defence Forces (Eesti Kaitsevägi). Developed high tactical responsibility, resilience under pressure, rigorous attention to orders, and cohesive team camaraderie.
- Level 4 Joiner Professional Certificate: Graduated from Pärnumaa Kutsehariduskeskus (2022). Mastered technical woodworking machinery, joinery techniques, surface finishing, precision staining, and fine furniture craftsmanship.
- Solid Wood Staircases & Furniture: At M.P.Trepid OÜ (2020-2022), built custom-made solid wood staircases and luxury bespoke furniture for discerning private clients.
- Modular Construction: At Matek AS (2020), worked on modular timber housing fabrication, assembly line mechanics, and prefabricated wall structures.
- Commercial Fit-outs & Installations: At Pristalpaigaluds (2022), executed high-specification furniture and interior installations across Tallinn, notably the Bolt global headquarters and Rocca al Mare School. Installed custom kitchens, acoustic elements, and designer office environments.
- Horticulture & Landscaping: At Aiabutiik T.T (2023), designed, planted, and maintained gardens, contributing to landscaping at the Estonian Botanical Garden.
- Operations & Guest Safety: Currently Instructor at Mustamäe Spa OÜ (2025-present). In charge of pool area guest safety, strict hygiene and water quality compliance, customer resolution, and facility closing security.
- Mechanical Aptitude: At Maxer OÜ (2015-2019), repaired cars, trucks, boats, and motorized systems, acquiring strong mechanical problem-solving skills.
- Education: Currently studying Entrepreneurship and Business Management at Estonian Business School (EBS, class of 2025). Also holds secondary education from Tallinna Täiskasvanute Gümnaasium (2024).
- Software & Technical Skills: AutoCAD, SolidWorks, Microsoft Office suite, multi-platform OS (Windows, Mac, iOS, Android). Valid B1 Driver's License.
- Languages: Estonian (native), English (C1 Advanced), Russian (A2), German (A2).

Conversational Rules:
1. Speak in spoken conversational style — clear, measured, respectful, and engaging.
2. Keep replies concise: ideally 2 to 4 sentences (under 75 words) so spoken voice output feels snappy, natural, and never like a monotonous monologue.
3. Be genuinely helpful to recruiters, clients, and partners. Always be ready to share contact details or elaborate on Robin's hands-on projects and future goals.
4. If asked about availability, express enthusiasm for new opportunities in craftsmanship, management, operations, and innovative ventures.`;

let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Helper to synthesize speech via gemini-3.8-flash-lite-tts using prebuilt voice Fenrir with timeout
async function synthesizeSpeech(text: string): Promise<string | null> {
  if (!ai) return null;
  try {
    const ttsPromise = ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: text.slice(0, 350),
              speechMetadata: {
                style: 'Deep, calm, measured American male voice, sophisticated and warm',
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Fenrir' },
          },
        },
      },
    });

    const timeoutPromise = new Promise<null>((resolve) =>
      setTimeout(() => resolve(null), 3500)
    );

    const response: any = await Promise.race([ttsPromise, timeoutPromise]);
    const base64Audio = response?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    return base64Audio || null;
  } catch (error) {
    console.warn('Speech synthesis API call bypassed:', error);
    return null;
  }
}

// Conversation endpoint with multi-tier fallback and timeout protection
app.post('/api/assistant/chat', async (req: Request, res: Response) => {
  try {
    const { message, history = [] } = req.body;
    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    let replyText = '';

    if (ai) {
      try {
        const contents = [
          ...history.slice(-3).map((item: { role: string; text: string }) => ({
            role: item.role === 'user' ? 'user' : 'model',
            parts: [{ text: item.text }],
          })),
          {
            role: 'user',
            parts: [{ text: message }],
          },
        ];

        const chatPromise = ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents,
          config: {
            systemInstruction: HANS_SYSTEM_PROMPT,
            temperature: 0.7,
            maxOutputTokens: 200,
          },
        });

        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Model timeout')), 3500)
        );

        const chatResponse: any = await Promise.race([chatPromise, timeoutPromise]);
        replyText = chatResponse.text || getFallbackResponse(message);
      } catch (geminiError: any) {
        replyText = getFallbackResponse(message);
      }
    } else {
      replyText = getFallbackResponse(message);
    }

    const audioBase64 = await synthesizeSpeech(replyText);

    res.json({
      text: replyText,
      audioBase64,
      voiceName: 'Fenrir',
      useFallbackTts: !audioBase64,
    });
  } catch (err: any) {
    console.error('Handler error:', err);
    const fallback = getFallbackResponse(req.body?.message || '');
    res.json({
      text: fallback,
      audioBase64: null,
      voiceName: 'browser-fallback',
      useFallbackTts: true,
    });
  }
});

// Direct TTS endpoint
app.post('/api/assistant/speak', async (req: Request, res: Response) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== 'string') {
      res.status(400).json({ error: 'Text is required' });
      return;
    }

    const audioBase64 = await synthesizeSpeech(text);
    res.json({
      audioBase64,
      useFallbackTts: !audioBase64,
    });
  } catch (err: any) {
    console.error('Speak endpoint error:', err);
    res.status(500).json({ error: 'Failed to synthesize speech', useFallbackTts: true });
  }
});

// Initial Welcome endpoint
app.get('/api/assistant/welcome', async (_req: Request, res: Response) => {
  const welcomeText =
    "Greetings. I am Hans, speaking directly on behalf of Robin Silm. With a background spanning Estonian military service, precision joinery, and business management at EBS, I am pleased to walk you through Robin's craftsmanship, installations, and career journey. What would you like to explore?";

  const audioBase64 = await synthesizeSpeech(welcomeText);
  res.json({
    text: welcomeText,
    audioBase64,
    voiceName: 'Fenrir',
    useFallbackTts: !audioBase64,
  });
});

// Fallback intelligent responder if offline or model temporarily busy
function getFallbackResponse(input: string): string {
  const lower = input.toLowerCase();

  if (lower.includes('military') || lower.includes('defence') || lower.includes('army') || lower.includes('kaitsevägi')) {
    return 'Serving in the Estonian Defence Forces gave me unwavering discipline, crisis resilience, and a deep appreciation for cohesive teamwork under rigorous conditions. It forms the foundation of how I approach every challenge today.';
  }
  if (lower.includes('joinery') || lower.includes('wood') || lower.includes('carpentry') || lower.includes('staircase')) {
    return 'I hold a Level 4 Joiner Professional Certificate from Pärnumaa Kutsehariduskeskus. At M.P.Trepid, I crafted custom solid wood staircases and bespoke luxury furniture, mastering woodworking machinery, joinery tolerances, and hand-finished surfaces.';
  }
  if (lower.includes('bolt') || lower.includes('rocca') || lower.includes('pristal') || lower.includes('installation') || lower.includes('office')) {
    return 'With Pristalpaigaluds, I led and executed high-end installations for corporate spaces, including the Bolt global headquarters in Tallinn and Rocca al Mare School. That included tailored executive suites, designer kitchens, and acoustic elements.';
  }
  if (lower.includes('spa') || lower.includes('mustamäe') || lower.includes('instructor')) {
    return 'At Mustamäe Spa, I oversee pool facility operations, water safety standards, and day-to-day guest care. It demands proactive vigilance, rigorous health compliance, and swift problem solving with diverse teams.';
  }
  if (lower.includes('ebs') || lower.includes('business') || lower.includes('school') || lower.includes('education') || lower.includes('study')) {
    return 'I am completing my degree in Entrepreneurship and Business Management at the Estonian Business School. My ambition is to unite European craft heritage with modern, scalable venture leadership and operations.';
  }
  if (lower.includes('contact') || lower.includes('email') || lower.includes('phone') || lower.includes('hire') || lower.includes('reach')) {
    return 'You can reach me directly via email at Robinsilm19@gmail.com, or by phone at +372 58056631. I am located in Tallinn, Estonia and always open to discussing compelling opportunities.';
  }
  if (lower.includes('botanical') || lower.includes('garden') || lower.includes('gardener')) {
    return 'During my tenure with Aiabutiik T.T, I worked on comprehensive landscaping and garden architecture, notably assisting with the grounds and development of the prestigious Estonian Botanical Garden in Tallinn.';
  }

  return "I am Hans, speaking for Robin Silm. I bring together precision joinery, military discipline from the Estonian Defence Forces, and business strategy from EBS. Feel free to ask about my installations at Bolt, custom furniture projects, or how we might collaborate.";
}

// Start Server with Vite Middleware in Development
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';
  const httpServer = http.createServer(app);

  if (!isProduction) {
    const isHmrDisabled = process.env.DISABLE_HMR === 'true';
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: isHmrDisabled ? false : { server: httpServer },
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT} (dev mode: ${!isProduction})`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
