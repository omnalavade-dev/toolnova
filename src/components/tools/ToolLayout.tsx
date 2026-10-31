import React from 'react';
import { ToolItem } from '../../types';
import { TOOLS } from '../../data/toolsData';
import { Icon } from '../common/Icon';
import { ChevronRight, ArrowLeft, Heart, ShieldCheck, Zap, Lock, Sparkles, ExternalLink } from 'lucide-react';
import { SEOHead } from '../common/SEOHead';
import { AdBanner } from '../common/AdBanner';

interface ToolLayoutProps {
  tool: ToolItem;
  children: React.ReactNode;
  onNavigate: (path: string) => void;
  isFavorite: boolean;
  toggleFavorite: () => void;
}

export const ToolLayout: React.FC<ToolLayoutProps> = ({
  tool,
  children,
  onNavigate,
  isFavorite,
  toggleFavorite
}) => {
  const relatedTools = TOOLS.filter(
    (t) => t.category === tool.category && t.id !== tool.id
  ).slice(0, 3);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <SEOHead
        title={`${tool.name} - Free Online Tool`}
        description={tool.description}
        canonicalPath={`/#${tool.route}`}
        schemaData={{
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: tool.name,
          applicationCategory: 'UtilityApplication',
          operatingSystem: 'All modern web browsers',
          offers: {
            '@type': 'Offer',
            price: '0.00',
            priceCurrency: 'USD'
          },
          description: tool.description
        }}
      />

      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
        <button
          onClick={() => onNavigate('/')}
          className="hover:text-blue-600 dark:hover:text-blue-400 font-medium"
        >
          Home
        </button>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="font-medium">{tool.categoryLabel}</span>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-800 dark:text-slate-200 font-bold">{tool.name}</span>
      </nav>

      {/* Tool Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600/10 to-indigo-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-200/50 dark:border-blue-900/50">
            <Icon name={tool.icon} className="w-7 h-7" />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
                {tool.categoryLabel}
              </span>
              {tool.badge && (
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
                  {tool.badge}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {tool.name}
            </h1>

            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
              {tool.tagline}
            </p>
          </div>
        </div>

        {/* Favorite & Back actions */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            onClick={toggleFavorite}
            className={`p-2.5 rounded-2xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              isFavorite
                ? 'border-rose-200 bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:border-rose-900'
                : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
            <span>{isFavorite ? 'Starred' : 'Favorite'}</span>
          </button>

          <button
            onClick={() => onNavigate('/')}
            className="p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>All Tools</span>
          </button>
        </div>
      </div>

      {/* Main Working Tool Component */}
      <main className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        {children}
      </main>

      {/* AdSense slot reserved */}
      <AdBanner slotId={`in-tool-${tool.id}`} format="horizontal" />

      {/* How it Works / Instructions Guide */}
      <section className="p-6 sm:p-8 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
          About {tool.name} &bull; Security &amp; Usage Guide
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          {tool.description}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-400">
            <Lock className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span><strong>100% Client-Side:</strong> Files are parsed locally in browser RAM without server transfers.</span>
          </div>
          <div className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-400">
            <Zap className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <span><strong>Zero Latency:</strong> Immediate execution without uploading megabytes across mobile data.</span>
          </div>
          <div className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-400">
            <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <span><strong>No Watermarks:</strong> Clean, uncompromised downloads ready for official submissions.</span>
          </div>
        </div>
      </section>

      {/* Related Tools in same category */}
      {relatedTools.length > 0 && (
        <section className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            More {tool.categoryLabel}
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {relatedTools.map((rel) => (
              <button
                key={rel.id}
                onClick={() => onNavigate(rel.route)}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500/70 text-left transition-all shadow-xs flex items-center justify-between group"
              >
                <div>
                  <h5 className="text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-blue-600">
                    {rel.name}
                  </h5>
                  <p className="text-[11px] text-slate-400 line-clamp-1">{rel.tagline}</p>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 shrink-0" />
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
