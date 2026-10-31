import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Health / Status endpoint
app.get('/api/status', (req: Request, res: Response) => {
  const hasKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.length > 5);
  res.json({
    status: 'online',
    appName: 'ToolNova',
    aiEngineAvailable: hasKey,
    timestamp: new Date().toISOString()
  });
});

// AI Processing Proxy Route (Text Summarizer, Paragraph Rewriter, Grammar Checker)
app.post('/api/ai/process', async (req: Request, res: Response): Promise<void> => {
  try {
    const { action, text, options } = req.body;

    if (!text || typeof text !== 'string') {
      res.status(400).json({ error: 'Missing input text.' });
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      res.status(503).json({
        error: 'GEMINI_API_KEY is not configured in the server environment. Please set GEMINI_API_KEY in Settings > Secrets.',
        mode: 'no_key'
      });
      return;
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });

    let systemInstruction = 'You are an expert writing assistant and utility for ToolNova.';
    let prompt = '';

    if (action === 'summarize') {
      const length = options?.length || 'medium'; // short, medium, detailed
      const format = options?.format || 'paragraph'; // bullet, paragraph
      systemInstruction = 'You are a concise, high-precision summarizer. Retain all key facts and quantitative figures.';
      prompt = `Summarize the following text.
Target length: ${length}
Target format: ${format === 'bullet' ? 'Structured bullet points' : 'Cohesive executive summary paragraphs'}

Text to summarize:
"""
${text}
"""`;
    } else if (action === 'rewrite') {
      const tone = options?.tone || 'professional'; // professional, casual, academic, creative, concise, persuasive
      systemInstruction = 'You are a master editor. Rewrite the text preserving exact original meaning while adapting tone seamlessly.';
      prompt = `Rewrite the following text with a ${tone.toUpperCase()} tone. Return only the rewritten text without preambles or chat filler.

Original text:
"""
${text}
"""`;
    } else if (action === 'grammar') {
      systemInstruction = 'You are an eagle-eyed copyeditor. Detect grammatical mistakes, spelling, punctuation, word choice improvements, and provide a corrected version along with clear explanation of improvements.';
      prompt = `Review and correct the grammar, spelling, punctuation, and readability of the following text.
Return a structured JSON with:
{
  "correctedText": "The fully corrected text",
  "issuesCount": 0,
  "corrections": [
    {
      "original": "problematic phrase",
      "replacement": "corrected phrase",
      "reason": "explanation of grammatical rule"
    }
  ],
  "overallScore": 95,
  "readabilityAssessment": "Brief note on tone and clarity"
}

Text to review:
"""
${text}
"""`;
    } else {
      res.status(400).json({ error: `Unsupported AI action: ${action}` });
      return;
    }

    const config: Record<string, any> = {
      systemInstruction
    };

    if (action === 'grammar') {
      config.responseMimeType = 'application/json';
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config
    });

    const outputText = response.text || '';

    if (action === 'grammar') {
      try {
        const parsed = JSON.parse(outputText);
        res.json({ success: true, result: parsed });
        return;
      } catch {
        res.json({
          success: true,
          result: {
            correctedText: outputText,
            issuesCount: 1,
            corrections: [],
            overallScore: 90,
            readabilityAssessment: 'Automated review completed'
          }
        });
        return;
      }
    }

    res.json({
      success: true,
      result: outputText.trim()
    });
  } catch (error: any) {
    console.error('Gemini API execution error:', error);
    res.status(500).json({
      error: error?.message || 'Failed to process AI request. Please verify server API quota or try again.',
      details: error?.status || 'UNKNOWN'
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`ToolNova server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
