
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import axios from "axios";
import * as cheerio from "cheerio";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Helper to call Gemini with retry
async function generateContentWithRetry(params: any, retries = 3, delay = 2000) {
  for (let i = 0; i < retries; i++) {
    try {
      return await genAI.models.generateContent(params);
    } catch (error: any) {
      const isUnavailable = error.message?.includes('503') || error.status === 503 || error.code === 503;
      if (isUnavailable && i < retries - 1) {
        console.warn(`Gemini API 503 error, retrying in ${delay}ms... (Attempt ${i + 1}/${retries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2; // Exponential backoff
        continue;
      }
      throw error;
    }
  }
}

// Helper to get screenshots via Microlink
async function getScreenshot(url: string, mode: 'desktop' | 'mobile'): Promise<string> {
  try {
    const isMobile = mode === 'mobile';
    const screenshotUrl = `https://api.microlink.io?url=${encodeURIComponent(url)}&screenshot=true&embed=screenshot.url&meta=false${isMobile ? '&viewport.isMobile=true&viewport.width=390&viewport.height=844' : '&viewport.width=1440&viewport.height=900'}`;
    
    // Microlink returns the image directly in this configuration
    const response = await axios.get(screenshotUrl, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data, 'binary');
    return `data:image/png;base64,${buffer.toString('base64')}`;
  } catch (error) {
    console.error(`Failed to get ${mode} screenshot:`, error);
    // Return a high-quality placeholder if screenshot fails
    return `https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop`;
  }
}

// API Routes
app.post("/api/analyze", async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  try {
    // 1. Fetch HTML Content
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      timeout: 10000
    });
    
    const $ = cheerio.load(response.data);
    
    // 2. Extract Basic Info
    const pageTitle = $('title').text() || $('h1').first().text() || "Untitled";
    let favicon = $('link[rel="icon"], link[rel="shortcut icon"]').attr('href') || "";
    if (favicon && !favicon.startsWith('http')) {
      const urlObj = new URL(url);
      favicon = `${urlObj.origin}${favicon.startsWith('/') ? '' : '/'}${favicon}`;
    }

    const pageText = $('body').text().replace(/\s+/g, ' ').slice(0, 4000);

    // 3. Parallelize Screenshot Capture (Lightweight)
    const [desktopScreenshot, mobileScreenshot] = await Promise.all([
      getScreenshot(url, 'desktop'),
      getScreenshot(url, 'mobile')
    ]);

    // 4. Use Gemini to refine data
    const prompt = `Analyze this website content and provide a luxury editorial showcase plan.
    Website URL: ${url}
    Website Title: ${pageTitle}
    Content Snippet: ${pageText}
    
    Return a JSON object with:
    - title: A premium, minimalist headline (max 5 words)
    - description: A sophisticated subheadline
    - features: 3-5 premium features or selling points
    - brandName: The likely brand name
    - domain: The clean domain name (e.g., apple.com)
    - instagram: A likely instagram handle if found or suitable (e.g., @apple)
    - recommendedLayout: one of ['cinema', 'luxury', 'editorial', 'saas']
    - glowColor: A vibrant accent color from the theme to use for atmospheric glow (hex)
    `;

    const aiResponse = await generateContentWithRetry({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            features: { type: Type.ARRAY, items: { type: Type.STRING } },
            brandName: { type: Type.STRING },
            domain: { type: Type.STRING },
            instagram: { type: Type.STRING },
            recommendedLayout: { type: Type.STRING },
            glowColor: { type: Type.STRING },
          }
        }
      }
    });

    if (!aiResponse) {
      throw new Error("Failed to get response from Gemini after retries.");
    }

    const aiPlan = JSON.parse(aiResponse.text || '{}');

    const composition = {
      title: aiPlan.title || pageTitle,
      description: aiPlan.description || "Premium Digital Experience",
      features: aiPlan.features || ["Elegant Interface", "Modern Design", "High Performance"],
      domain: aiPlan.domain || new URL(url).hostname,
      instagram: aiPlan.instagram || `@${(aiPlan.brandName || pageTitle).toLowerCase().replace(/\s+/g, '')}`,
      brand: {
        name: aiPlan.brandName || pageTitle,
        logoUrl: favicon,
        colors: ["#000000", "#ffffff"], // Simplified colors without Playwright
        typography: {
          primary: "Cormorant Garamond", 
          secondary: "Inter",
        }
      },
      screenshots: {
        desktop: desktopScreenshot,
        mobile: mobileScreenshot,
      },
      layout: aiPlan.recommendedLayout || 'cinema',
      lights: {
        glowColor: aiPlan.glowColor || '#6366f1',
        intensity: 0.5
      }
    };

    res.json({ composition });

  } catch (error: any) {
    console.error("Analysis failed:", error);
    res.status(500).json({ error: error.message });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
