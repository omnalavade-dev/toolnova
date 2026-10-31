import React, { useState } from 'react';
import { Sparkles, Copy, Check, RefreshCw, AlertCircle, Bot } from 'lucide-react';

export const TextSummarizer: React.FC = () => {
  const [inputText, setInputText] = useState<string>(
    'Artificial intelligence and modern browser capabilities have converged to make client-side computing extraordinarily capable. By running algorithms directly inside the user’s web browser via WebAssembly and optimized JavaScript, applications can process files with near-zero latency while offering mathematically guaranteed data privacy. Users no longer need to worry about confidential financial statements or personal photos lingering on remote cloud server disks. In addition, processing workloads locally minimizes server infrastructure costs and eliminates network bottlenecks.'
  );
  const [summaryLength, setSummaryLength] = useState<'short' | 'medium' | 'detailed'>('medium');
  const [format, setFormat] = useState<'paragraph' | 'bullet'>('paragraph');
  const [result, setResult] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [engineUsed, setEngineUsed] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // Client-side extractive heuristic fallback when API key is not connected
  const runOfflineExtractiveSummarizer = (text: string, len: string, fmt: string): string => {
    const sentences = text
      .split(/(?<=[.?!])\s+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 15);

    if (sentences.length <= 2) return text;

    // Word frequency scoring
    const words = text.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
    const stopWords = new Set(['the', 'and', 'that', 'with', 'this', 'from', 'have', 'were', 'which']);
    const freq: Record<string, number> = {};
    for (const w of words) {
      if (!stopWords.has(w)) {
        freq[w] = (freq[w] || 0) + 1;
      }
    }

    const scored = sentences.map((sent, index) => {
      const sentWords = sent.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
      let score = 0;
      for (const sw of sentWords) {
        score += freq[sw] || 0;
      }
      return { sent, score, index };
    });

    // Select top N sentences based on length
    const count = len === 'short' ? 2 : len === 'medium' ? Math.max(2, Math.round(sentences.length * 0.45)) : Math.max(3, Math.round(sentences.length * 0.7));
    const topSentences = scored
      .sort((a, b) => b.score - a.score)
      .slice(0, count)
      .sort((a, b) => a.index - b.index)
      .map((s) => s.sent);

    if (fmt === 'bullet') {
      return topSentences.map((s) => `• ${s}`).join('\n\n');
    }
    return topSentences.join(' ');
  };

  const handleSummarize = async () => {
    if (!inputText.trim()) return;
    setIsProcessing(true);
    setErrorMessage(null);

    try {
      // Call server Gemini endpoint
      const response = await fetch('/api/ai/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'summarize',
          text: inputText,
          options: { length: summaryLength, format }
        })
      });

      const data = await response.json();

      if (response.ok && data.success && data.result) {
        setResult(data.result);
        setEngineUsed('Gemini 3.8 Flash AI Model');
      } else {
        // Fallback transparently
        const fallbackSummary = runOfflineExtractiveSummarizer(inputText, summaryLength, format);
        setResult(fallbackSummary);
        setEngineUsed('Client-Side Extractive Algorithmic Engine (Local Fallback)');
        if (data.mode === 'no_key') {
          setErrorMessage('Note: Gemini API key is unconfigured in server environment. Running local algorithmic summarization.');
        }
      }
    } catch {
      // Local fallback
      const fallbackSummary = runOfflineExtractiveSummarizer(inputText, summaryLength, format);
      setResult(fallbackSummary);
      setEngineUsed('Client-Side Extractive Algorithmic Engine (Offline)');
    } finally {
      setIsProcessing(false);
    }
  };

  const copyResult = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Text Box */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Source Text to Summarize
            </label>
            <span className="text-xs text-slate-400 font-mono">
              {inputText.trim().split(/\s+/).filter(Boolean).length} words
            </span>
          </div>

          <textarea
            rows={10}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste your article, meeting transcript, or notes here..."
            className="w-full p-3.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 leading-relaxed focus:outline-hidden focus:border-blue-500 resize-none font-sans"
          />

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-slate-500">Summary Length</span>
              <div className="grid grid-cols-3 gap-1">
                {(['short', 'medium', 'detailed'] as const).map((len) => (
                  <button
                    key={len}
                    type="button"
                    onClick={() => setSummaryLength(len)}
                    className={`py-1.5 text-xs font-semibold rounded-lg capitalize border ${
                      summaryLength === len
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {len}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-slate-500">Format</span>
              <div className="grid grid-cols-2 gap-1">
                {(['paragraph', 'bullet'] as const).map((fmt) => (
                  <button
                    key={fmt}
                    type="button"
                    onClick={() => setFormat(fmt)}
                    className={`py-1.5 text-xs font-semibold rounded-lg capitalize border ${
                      format === fmt
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {fmt}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={handleSummarize}
            disabled={isProcessing || !inputText.trim()}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Distilling Key Insights...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Summarize Text</span>
              </>
            )}
          </button>
        </div>

        {/* Output Box */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Generated Summary
              </span>
              {result && (
                <button
                  onClick={copyResult}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-semibold"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              )}
            </div>

            {result ? (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap min-h-[220px]">
                {result}
              </div>
            ) : (
              <div className="h-64 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center p-6 text-center text-slate-400 text-xs">
                <Bot className="w-8 h-8 text-slate-300 dark:text-slate-600 mb-2" />
                <span>Click &quot;Summarize Text&quot; to condense the input into key takeaways.</span>
              </div>
            )}
          </div>

          {engineUsed && (
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-1 text-[11px] text-slate-400">
              <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-medium">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Engine: {engineUsed}</span>
              </div>
              {errorMessage && (
                <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  {errorMessage}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
