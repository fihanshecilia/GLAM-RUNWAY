import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy initialize Gemini client
let genAIClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!genAIClient && process.env.GEMINI_API_KEY) {
    try {
      genAIClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    } catch (err) {
      console.error('Error initializing GoogleGenAI:', err);
    }
  }
  return genAIClient;
}

// API: Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString(),
  });
});

// API: AI Fashion Stylist Advice
app.post('/api/stylist-advice', async (req, res) => {
  const { theme, character, equippedSummary } = req.body;

  try {
    const ai = getGenAI();
    if (ai) {
      const prompt = `You are a high-fashion VIP Runway Stylist for GLAM RUNWAY fashion competition.
The player is styling model "${character?.name || 'Model'}" for the theme: "${theme?.name || 'Fashion Show'}" (${theme?.description || ''}).
Key theme aesthetic: ${theme?.vibe || 'chic and high fashion'}.
Recommended color palette: ${theme?.recommendedColors?.join(', ') || 'elegant tones'}.
Currently equipped items: ${equippedSummary || 'Just getting started'}.

Provide glamorous, concise fashion advice in Indonesian or English (stylist fashion mixed jargon):
1. A catchy VIP stylist reaction (1 sentence).
2. 3 specific fashion tips to ace this theme (color harmony, layering/makeup, accessories).
3. A secret score booster hint.

Respond in JSON format matching:
{
  "greeting": "string",
  "tips": ["string", "string", "string"],
  "secretTip": "string",
  "stylistMood": "excited" | "impressed" | "analytical" | "glamorous"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const text = response.text || '';
      const parsed = JSON.parse(text);
      return res.json({ success: true, advice: parsed });
    }
  } catch (error) {
    console.warn('Gemini API call failed, falling back to smart stylist generator:', error);
  }

  // Fallback smart stylist advice
  const themeName = theme?.name || 'Glam Runway';
  const colors = theme?.recommendedColors?.join(' & ') || 'rose gold & platinum';
  res.json({
    success: true,
    advice: {
      greeting: `Halo superstar! Untuk tema "${themeName}", kuncinya ada pada keharmonisan siluet dan palet ${colors}!`,
      tips: [
        `Harmonisasikan tone makeup terutama lipstick dan eyeshadow dengan aksen warna utama busana.`,
        `Gunakan perhiasan statement seperti kalung atau tiara untuk meningkatkan kemewahan di runway.`,
        `Pastikan sepatu dan outerwear (jacket/coat) senada dengan vibe tema "${themeName}".`,
      ],
      secretTip: `Memakai item langka (Epic/Legendary) yang sesuai tema memberikan bonus poin Runway Star +15%!`,
      stylistMood: 'glamorous',
    },
  });
});

// API: AI Fashion Battle Runway Judge Commentary
app.post('/api/judge-critique', async (req, res) => {
  const { theme, character, totalScore, breakdown, outfitDetails } = req.body;

  try {
    const ai = getGenAI();
    if (ai) {
      const prompt = `You are the chief celebrity judge panel of GLAM RUNWAY.
Theme: "${theme?.name}" (${theme?.description})
Model: ${character?.name}
Total Score: ${totalScore}/100 (Theme match: ${breakdown?.themeMatch}%, Makeup: ${breakdown?.makeupScore}%, Outfit: ${breakdown?.outfitScore}%, Completeness: ${breakdown?.completenessScore}%)
Outfit Details: ${JSON.stringify(outfitDetails || {})}

Provide enthusiastic, authentic high-fashion runway critique for 3 judges:
- Judge Miranda (Strict Haute Couture Critic)
- Judge Leo (Trendy Avant-Garde Designer)
- Judge Chloe (Glamour Pop Icon)

Return valid JSON with:
{
  "title": "A stylish fashion title awarded to the player (e.g. 'Red Carpet Icon', 'Avant-Garde Queen')",
  "overallVerdict": "Summary critique paragraph",
  "judges": [
    { "name": "Miranda Vance", "score": number (7-10), "comment": "string" },
    { "name": "Leo Vanguard", "score": number (7-10), "comment": "string" },
    { "name": "Chloe Sparkle", "score": number (7-10), "comment": "string" }
  ]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const text = response.text || '';
      const parsed = JSON.parse(text);
      return res.json({ success: true, critique: parsed });
    }
  } catch (error) {
    console.warn('Gemini critique API failed, using smart fallback critique:', error);
  }

  // Fallback critique based on score
  const isHigh = (totalScore || 70) >= 80;
  res.json({
    success: true,
    critique: {
      title: isHigh ? 'Runway Visionary of the Season' : 'Rising Fashion Muse',
      overallVerdict: isHigh
        ? `Penampilan yang memukau di panggung runway! Koordinasi warna dan statement aksesoris sangat menjiwai tema ${theme?.name || 'Runway'}. Siluet busananya berpadu sempurna dengan riasan wajah.`
        : `Kreasi yang segar dan berani untuk tema ${theme?.name || 'Runway'}! Sentuhan makeup dan pilihan busananya memiliki potensi besar dengan sedikit eksplorasi aksesoris pelengkap.`,
      judges: [
        {
          name: 'Miranda Vance',
          score: isHigh ? 9.5 : 8.0,
          comment: isHigh
            ? 'Eksekusi siluet haute couture yang sangat tajam dan proporsional. Bravo!'
            : 'Strukturnya menarik, padukan lebih banyak kontras tekstur di runway berikutnya.',
        },
        {
          name: 'Leo Vanguard',
          score: isHigh ? 9.8 : 8.5,
          comment: isHigh
            ? 'Avant-garde dan memikat! Pencahayaan panggung benar-benar menonjolkan detail busana.'
            : 'Vibes yang sangat energik. Pemilihan warna sudah selaras dengan temanya.',
        },
        {
          name: 'Chloe Sparkle',
          score: isHigh ? 10.0 : 8.8,
          comment: isHigh
            ? 'I am obsessed! Kilauan dan karismanya benar-benar mencuri seluruh sorotan runway malam ini!'
            : 'Sangat chic dan fotogenik! Detail makeup di area mata benar-benar pop-up di kamera.',
        },
      ],
    },
  });
});

// Setup Vite middleware in dev or static serving in production
async function setupApp() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`GLAM RUNWAY Server running on http://0.0.0.0:${PORT}`);
  });
}

setupApp();
