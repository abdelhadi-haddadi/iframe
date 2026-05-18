
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { chromium } from "playwright";
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

// API Routes
app.post("/api/analyze", async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    // 1. Visit URL
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 });
    
    // Give time for any hero animations to complete
    await page.waitForTimeout(3000);

    // 2. Extract Basic Info
    const pageTitle = await page.title();
    const favicon = await page.evaluate(() => {
      const icon = document.querySelector('link[rel="icon"], link[rel="shortcut icon"]');
      return icon ? (icon as HTMLLinkElement).href : "";
    });

    // 3. Extract Colors and Fonts (Simplified Analysis)
    const brandDataRaw = await page.evaluate(() => {
      const styles = getComputedStyle(document.body);
      const h1 = document.querySelector('h1');
      const h1Styles = h1 ? getComputedStyle(h1) : styles;

      // Extract some common colors
      const colors = new Set<string>();
      const elements = Array.from(document.querySelectorAll('*')).slice(0, 500);
      elements.forEach(el => {
        const style = getComputedStyle(el);
        if (style.backgroundColor && style.backgroundColor !== 'transparent' && style.backgroundColor !== 'rgba(0, 0, 0, 0)') {
           colors.add(style.backgroundColor);
        }
        if (style.color) {
           colors.add(style.color);
        }
      });

      return {
        colors: Array.from(colors).slice(0, 5),
        primaryFont: h1Styles.fontFamily,
        secondaryFont: styles.fontFamily,
        text: document.body.innerText.slice(0, 4000) // For AI analysis
      };
    });

    // 4. Capture Screenshots
    // Desktop
    const desktopScreenshot = await page.screenshot({ type: 'png' });

    // Mobile - Switch viewport and wait again briefly
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(2000);
    // Scroll to top just in case
    await page.evaluate(() => window.scrollTo(0, 0));
    const mobileScreenshot = await page.screenshot({ type: 'png' });

    // 5. Use Gemini to refine data
    const prompt = `Analyze this website content and provide a luxury editorial showcase plan.
    Website URL: ${url}
    Website Title: ${pageTitle}
    Content Snippet: ${brandDataRaw.text}
    
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

    const aiResponse = await genAI.models.generateContent({
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
        colors: brandDataRaw.colors,
        typography: {
          primary: "Cormorant Garamond", 
          secondary: "Inter",
        }
      },
      screenshots: {
        desktop: `data:image/png;base64,${desktopScreenshot.toString('base64')}`,
        mobile: `data:image/png;base64,${mobileScreenshot.toString('base64')}`,
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
  } finally {
    if (browser) await browser.close();
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
