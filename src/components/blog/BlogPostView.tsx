import React from 'react';
import { BlogPost } from '../../types';
import { TOOLS } from '../../data/toolsData';
import { ArrowLeft, Clock, Calendar, CheckCircle2, Sparkles, ExternalLink } from 'lucide-react';
import { AdBanner } from '../common/AdBanner';
import { SEOHead } from '../common/SEOHead';

interface BlogPostViewProps {
  post: BlogPost;
  onBack: () => void;
  onNavigate: (path: string) => void;
}

export const BlogPostView: React.FC<BlogPostViewProps> = ({ post, onBack, onNavigate }) => {
  const relatedTools = TOOLS.filter((t) => post.relatedToolIds.includes(t.id));

  return (
    <article className="max-w-4xl mx-auto space-y-8">
      <SEOHead
        title={post.title}
        description={post.summary}
        canonicalPath={`/#/blog/${post.slug}`}
        type="article"
        schemaData={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: post.title,
          description: post.summary,
          datePublished: post.date,
          author: {
            '@type': 'Person',
            name: post.author.name
          },
          publisher: {
            '@type': 'Organization',
            name: 'ToolNova',
            logo: {
              '@type': 'ImageObject',
              url: 'https://toolnova.app/logo.png'
            }
          }
        }}
      />

      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to all guides</span>
      </button>

      {/* Article Header */}
      <header className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
            {post.category}
          </span>
          <span className="text-xs text-slate-400">&bull;</span>
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {post.readTime}
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
          {post.title}
        </h1>

        <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
          {post.subtitle}
        </p>

        {/* Author info */}
        <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <img
            src={post.author.avatar}
            alt={post.author.name}
            className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
          />
          <div>
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">{post.author.name}</h4>
            <p className="text-[11px] text-slate-400">{post.author.role} &bull; Published {post.date}</p>
          </div>
        </div>
      </header>

      {/* Key Takeaways Box */}
      {post.keyTakeaways.length > 0 && (
        <div className="p-6 rounded-3xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/40 space-y-3">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-blue-900 dark:text-blue-300 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Key Executive Takeaways</span>
          </h3>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
            {post.keyTakeaways.map((takeaway, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{takeaway}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Ad placement reserved */}
      <AdBanner slotId="article-top-leaderboard" format="horizontal" />

      {/* Article Body */}
      <div className="prose dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 space-y-5 text-sm sm:text-base leading-relaxed">
        {post.content.map((paragraph, idx) => {
          if (paragraph.startsWith('### ')) {
            return (
              <h3 key={idx} className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white pt-4">
                {paragraph.replace('### ', '')}
              </h3>
            );
          }
          if (paragraph.startsWith('- ')) {
            return (
              <li key={idx} className="ml-4 list-disc text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                {paragraph.replace('- ', '')}
              </li>
            );
          }
          if (paragraph.startsWith('$$')) {
            return (
              <div key={idx} className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/80 font-mono text-center text-sm font-semibold text-blue-600 dark:text-blue-400 my-4">
                {paragraph.replaceAll('$$', '')}
              </div>
            );
          }
          return (
            <p key={idx} className="text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
              {paragraph}
            </p>
          );
        })}
      </div>

      {/* Contextual Related Tools Callout */}
      {relatedTools.length > 0 && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white space-y-4 my-8">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400">
            <Sparkles className="w-4 h-4" />
            <span>Try Mentioned Utilities on ToolNova</span>
          </div>
          <h3 className="text-lg font-bold">
            Execute these actions right now in your browser
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {relatedTools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => onNavigate(tool.route)}
                className="p-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-left transition-colors flex items-center justify-between group"
              >
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-blue-400">{tool.name}</h4>
                  <p className="text-[11px] text-slate-400 line-clamp-1">{tool.tagline}</p>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-blue-400 shrink-0" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Ad placement reserved */}
      <AdBanner slotId="article-bottom-leaderboard" format="horizontal" />
    </article>
  );
};
