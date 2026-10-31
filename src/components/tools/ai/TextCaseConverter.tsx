import React, { useState } from 'react';
import { Type, Copy, Check, Trash2 } from 'lucide-react';

export const TextCaseConverter: React.FC = () => {
  const [text, setText] = useState<string>(
    'Free Online Tools. Fast, Simple & Secure. ToolNova provides genuine browser-based utilities with 100% client-side privacy.'
  );
  const [copied, setCopied] = useState<boolean>(false);

  // Statistics
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charsWithSpaces = text.length;
  const charsNoSpaces = text.replace(/\s+/g, '').length;
  const lines = text.trim() ? text.split(/\r\n|\r|\n/).length : 0;
  const readingTimeSec = Math.ceil((words / 200) * 60);

  // Transformations
  const toUpper = () => setText(text.toUpperCase());
  const toLower = () => setText(text.toLowerCase());

  const toTitle = () => {
    const minorWords = new Set(['and', 'as', 'but', 'for', 'if', 'nor', 'or', 'so', 'yet', 'a', 'an', 'the', 'at', 'by', 'for', 'in', 'of', 'off', 'on', 'per', 'to', 'up', 'via']);
    const transformed = text.toLowerCase().replace(/\b[a-z]+/g, (word, index) => {
      if (index === 0 || !minorWords.has(word)) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      }
      return word;
    });
    setText(transformed);
  };

  const toSentence = () => {
    const transformed = text
      .toLowerCase()
      .replace(/(^\s*\w|[.?!]\s*\w)/g, (c) => c.toUpperCase());
    setText(transformed);
  };

  const toCamel = () => {
    const cleaned = text
      .replace(/[^a-zA-Z0-9\s]/g, ' ')
      .trim()
      .split(/\s+/)
      .map((w, idx) =>
        idx === 0
          ? w.toLowerCase()
          : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
      )
      .join('');
    setText(cleaned);
  };

  const toPascal = () => {
    const cleaned = text
      .replace(/[^a-zA-Z0-9\s]/g, ' ')
      .trim()
      .split(/\s+/)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join('');
    setText(cleaned);
  };

  const toSnake = () => {
    const cleaned = text
      .replace(/[^a-zA-Z0-9\s]/g, ' ')
      .trim()
      .split(/\s+/)
      .map((w) => w.toLowerCase())
      .join('_');
    setText(cleaned);
  };

  const toKebab = () => {
    const cleaned = text
      .replace(/[^a-zA-Z0-9\s]/g, ' ')
      .trim()
      .split(/\s+/)
      .map((w) => w.toLowerCase())
      .join('-');
    setText(cleaned);
  };

  const toConstant = () => {
    const cleaned = text
      .replace(/[^a-zA-Z0-9\s]/g, ' ')
      .trim()
      .split(/\s+/)
      .map((w) => w.toUpperCase())
      .join('_');
    setText(cleaned);
  };

  const toDot = () => {
    const cleaned = text
      .replace(/[^a-zA-Z0-9\s]/g, ' ')
      .trim()
      .split(/\s+/)
      .map((w) => w.toLowerCase())
      .join('.');
    setText(cleaned);
  };

  const toAlternating = () => {
    let result = '';
    let upper = false;
    for (const char of text) {
      if (/[a-zA-Z]/.test(char)) {
        result += upper ? char.toUpperCase() : char.toLowerCase();
        upper = !upper;
      } else {
        result += char;
      }
    }
    setText(result);
  };

  const toInverse = () => {
    let result = '';
    for (const char of text) {
      if (char === char.toUpperCase()) {
        result += char.toLowerCase();
      } else {
        result += char.toUpperCase();
      }
    }
    setText(result);
  };

  const copyText = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const buttons = [
    { label: 'UPPERCASE', fn: toUpper, desc: 'ALL CAPS' },
    { label: 'lowercase', fn: toLower, desc: 'all small' },
    { label: 'Title Case', fn: toTitle, desc: 'Capitalize Words' },
    { label: 'Sentence case', fn: toSentence, desc: 'Capitalize sentences.' },
    { label: 'camelCase', fn: toCamel, desc: 'codeVariable' },
    { label: 'PascalCase', fn: toPascal, desc: 'ComponentName' },
    { label: 'snake_case', fn: toSnake, desc: 'database_column' },
    { label: 'kebab-case', fn: toKebab, desc: 'url-slug' },
    { label: 'CONSTANT_CASE', fn: toConstant, desc: 'ENV_CONFIG' },
    { label: 'dot.case', fn: toDot, desc: 'package.path' },
    { label: 'aLtErNaTiNg', fn: toAlternating, desc: 'mOcKiNg cAsE' },
    { label: 'InVeRsE cAsE', fn: toInverse, desc: 'iNVERTED' }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Live Statistics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs text-center">
        <div>
          <span className="text-xs text-slate-400 font-medium block">Words</span>
          <span className="text-lg font-black text-slate-800 dark:text-slate-100 font-mono">{words}</span>
        </div>
        <div>
          <span className="text-xs text-slate-400 font-medium block">Characters</span>
          <span className="text-lg font-black text-slate-800 dark:text-slate-100 font-mono">{charsWithSpaces}</span>
        </div>
        <div>
          <span className="text-xs text-slate-400 font-medium block">No Spaces</span>
          <span className="text-lg font-black text-slate-800 dark:text-slate-100 font-mono">{charsNoSpaces}</span>
        </div>
        <div>
          <span className="text-xs text-slate-400 font-medium block">Lines</span>
          <span className="text-lg font-black text-slate-800 dark:text-slate-100 font-mono">{lines}</span>
        </div>
        <div className="col-span-2 sm:col-span-1">
          <span className="text-xs text-slate-400 font-medium block">Reading Time</span>
          <span className="text-lg font-black text-blue-600 dark:text-blue-400 font-mono">{readingTimeSec}s</span>
        </div>
      </div>

      {/* Editor Box */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex justify-between items-center">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
            <Type className="w-4 h-4 text-blue-600" />
            <span>Text Content</span>
          </label>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setText('')}
              className="text-xs text-rose-500 hover:text-rose-700 flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
            <button
              onClick={copyText}
              className="px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 text-xs font-bold hover:bg-blue-100 flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Text'}</span>
            </button>
          </div>
        </div>

        <textarea
          rows={8}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste text here to convert instantly..."
          className="w-full p-4 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-sans leading-relaxed focus:outline-hidden focus:border-blue-500 resize-none"
        />

        {/* Action Buttons Grid */}
        <div className="pt-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-3">
            One-Click Transformations
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {buttons.map((btn) => (
              <button
                key={btn.label}
                type="button"
                onClick={btn.fn}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-950/40 text-left transition-all group"
              >
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  {btn.label}
                </div>
                <div className="text-[10px] text-slate-400 truncate mt-0.5 font-mono">
                  {btn.desc}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
