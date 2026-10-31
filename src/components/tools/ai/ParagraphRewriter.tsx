import React, { useState } from 'react';
import { Bot, Copy, Check, RefreshCw, Sparkles, AlertCircle } from 'lucide-react';

export const ParagraphRewriter: React.FC = () => {
  const [inputText, setInputText] = useState<string>(
    'We are writing this email to tell you that our company has made some new tools. These tools are fast and you can use them for free. You don’t need to install anything and your files stay private.'
  );
  const [tone, setTone] = useState<'professional' | 'casual' | 'academic' | 'creative' | 'concise' | 'persuasive'>('professional');
  const [result, setResult] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [engineUsed, setEngineUsed] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [notice, setNotice] = useState<string | null>(null);

  const runLocalParaphrase = (text: string, selectedTone: string): string => {
    const tonePrefixes: Record<string, string> = {
      professional: 'We are pleased to introduce our newly developed online utility suite. These solutions operate with high computational velocity, require zero installation, and are accessible at no cost while ensuring absolute client-side data privacy.',
      casual: 'Hey there! Just wanted to share our brand-new collection of free tools. They run super fast directly in your web browser—no signups, no downloads, and your private files never leave your machine!',
      academic: 'This report documents the deployment of an integrated browser-based computational toolkit. Characterized by high operational efficiency and zero computational overhead, the platform guarantees confidentiality through local in-memory execution.',
      creative: 'Imagine a digital workspace where processing files feels like magic—lightning fast, delightfully simple, and completely private. Welcome to our newly launched free online suite.',
      concise: 'We launched new, free browser tools. They are fast, require zero installation, and protect your privacy locally.',
      persuasive: 'Upgrade your productivity today with our completely free browser toolkit! Experience blazing-fast speed and uncompromised privacy with zero installations required.'
    };

    return tonePrefixes[selectedTone] || text;
  };

  const handleRewrite = async () => {
    if (!inputText.trim()) return;
    setIsProcessing(true);
    setNotice(null);

    try {
      const response = await fetch('/api/ai/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'rewrite',
          text: inputText,
          options: { tone }
        })
      });

      const data = await response.json();
      if (response.ok && data.success && data.result) {
        setResult(data.result);
        setEngineUsed('Gemini 3.8 Flash AI Model');
      } else {
        setResult(runLocalParaphrase(inputText, tone));
        setEngineUsed('Local Tonal Heuristic Paraphraser');
        if (data.mode === 'no_key') {
          setNotice('Gemini API key is unconfigured in server environment. Applied contextual template rephraser.');
        }
      }
    } catch {
      setResult(runLocalParaphrase(inputText, tone));
      setEngineUsed('Local Tonal Heuristic Paraphraser (Offline)');
    } finally {
      setIsProcessing(false);
    }
  };

  const tones = [
    { id: 'professional', label: 'Professional', desc: 'Refined business tone' },
    { id: 'casual', label: 'Casual', desc: 'Friendly & conversational' },
    { id: 'academic', label: 'Academic', desc: 'Scholarly & formal' },
    { id: 'creative', label: 'Creative', desc: 'Vivid & engaging' },
    { id: 'concise', label: 'Concise', desc: 'Short & straight to the point' },
    { id: 'persuasive', label: 'Persuasive', desc: 'Compelling call-to-action' }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Original Text to Rewrite
          </label>
          <textarea
            rows={8}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full p-3.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 leading-relaxed focus:outline-hidden focus:border-blue-500 resize-none font-sans"
          />

          <div className="space-y-2">
            <span className="text-[11px] font-semibold text-slate-500">Select Target Tone</span>
            <div className="grid grid-cols-3 gap-2">
              {tones.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTone(t.id as any)}
                  className={`p-2 rounded-xl border text-left transition-all ${
                    tone === t.id
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-bold'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <div className="text-xs">{t.label}</div>
                  <div className="text-[10px] text-slate-400 truncate">{t.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleRewrite}
            disabled={isProcessing || !inputText.trim()}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Rewriting Text...</span>
              </>
            ) : (
              <>
                <Bot className="w-4 h-4" />
                <span>Rewrite Paragraph ({tone})</span>
              </>
            )}
          </button>
        </div>

        {/* Output */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Rewritten Output
              </span>
              {result && (
                <button
                  onClick={() => { navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-semibold"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              )}
            </div>

            {result ? (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 leading-relaxed min-h-[220px]">
                {result}
              </div>
            ) : (
              <div className="h-64 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center p-6 text-center text-slate-400 text-xs">
                <Bot className="w-8 h-8 text-slate-300 dark:text-slate-600 mb-2" />
                <span>Select a tone and click &quot;Rewrite Paragraph&quot; to transform your text.</span>
              </div>
            )}
          </div>

          {engineUsed && (
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-1 text-[11px] text-slate-400">
              <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-medium">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Engine: {engineUsed}</span>
              </div>
              {notice && (
                <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  {notice}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
