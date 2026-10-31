import React, { useState } from 'react';
import { TOOLS, CATEGORIES } from '../../data/toolsData';
import { BLOG_POSTS } from '../../data/blogsData';
import { ToolItem } from '../../types';
import { Icon } from '../common/Icon';
import { 
  Sparkles, 
  Search, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Lock, 
  Star, 
  Heart, 
  CheckCircle2, 
  Layers, 
  BookOpen, 
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import { AdBanner } from '../common/AdBanner';
import { SEOHead } from '../common/SEOHead';

interface HomePageProps {
  onSelectTool: (route: string) => void;
  onSelectBlog: (slug: string) => void;
  favorites: string[];
  toggleFavorite: (toolId: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onSelectTool,
  onSelectBlog,
  favorites,
  toggleFavorite
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredTools = TOOLS.filter((tool) => {
    const matchesCat = selectedCategory === 'all' || tool.category === selectedCategory;
    const matchesSearch =
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const popularTools = TOOLS.filter((t) => t.popular);
  const featuredTools = TOOLS.filter((t) => t.featured);
  const recentTools = TOOLS.filter((t) => t.badge === 'New' || t.badge === 'Featured');

  return (
    <div className="space-y-16">
      <SEOHead
        title="ToolNova - Free Online Tools. Fast, Simple & Secure."
        description="All-in-one suite of 25+ browser tools for PDF processing, image editing, financial calculators, and AI writing. 100% private with local client-side execution."
        canonicalPath="/"
        schemaData={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'ToolNova',
          url: 'https://toolnova.app/',
          potentialAction: {
            '@type': 'SearchAction',
            target: 'https://toolnova.app/#/?q={search_term_string}',
            'query-input': 'required name=search_term_string'
          }
        }}
      />

      {/* 1. HERO SECTION */}
      <section className="relative pt-6 pb-12 sm:pt-12 sm:pb-16 text-center space-y-6 max-w-4xl mx-auto">
        {/* Subtle Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-tr from-blue-400/10 via-indigo-400/10 to-violet-400/10 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Tagline Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200/80 dark:border-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>Free Online Tools &bull; Fast, Simple &amp; Secure</span>
        </div>

        {/* Main Title */}
        <h1 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.15]">
          All Your Essential Tools In One{' '}
          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
            Fast, Private
          </span>{' '}
          Workspace
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Convert PDFs, compress and crop images, calculate taxes &amp; loans, and polish writing.
          Everything runs 100% inside your browser—your files never leave your device.
        </p>

        {/* Big Search Bar */}
        <div className="relative max-w-2xl mx-auto pt-2">
          <div className="relative flex items-center">
            <Search className="w-5 h-5 text-slate-400 absolute left-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 25 tools... e.g. 'merge pdf', 'image compressor', 'gst', 'passport'"
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 shadow-lg shadow-blue-500/5 focus:outline-hidden focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-sm sm:text-base font-medium transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-semibold"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Quick Highlights / Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            Zero Server Uploads
          </span>
          <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
            <Zap className="w-4 h-4" />
            Instant In-Browser Execution
          </span>
          <span className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
            <Lock className="w-4 h-4" />
            No Watermarks or Signups
          </span>
        </div>
      </section>

      {/* AdSense slot reserved */}
      <AdBanner slotId="homepage-hero-top" format="horizontal" />

      {/* 2. CATEGORY SELECTOR TABS */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => { setSelectedCategory(cat.id); setSearchQuery(''); }}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                  selectedCategory === cat.id
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
                }`}
              >
                <Icon name={cat.icon} className="w-4 h-4" />
                <span>{cat.name}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  selectedCategory === cat.id ? 'bg-blue-700 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                }`}>
                  {cat.count}
                </span>
              </button>
            ))}
          </div>

          <span className="hidden md:block text-xs text-slate-400 font-medium">
            Showing {filteredTools.length} tools
          </span>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTools.map((tool) => {
            const isFav = favorites.includes(tool.id);
            return (
              <div
                key={tool.id}
                onClick={() => onSelectTool(tool.route)}
                className="group relative p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-blue-500/80 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-200 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-50 via-indigo-50 to-violet-50 dark:from-blue-950/40 dark:via-indigo-950/40 dark:to-violet-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-100 dark:border-blue-900/50 group-hover:scale-105 transition-transform">
                      <Icon name={tool.icon} className="w-6 h-6" />
                    </div>

                    <div className="flex items-center gap-2">
                      {tool.badge && (
                        <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          tool.badge === 'Popular'
                            ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400'
                            : tool.badge === 'New'
                            ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400'
                            : 'bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400'
                        }`}>
                          {tool.badge}
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(tool.id);
                        }}
                        className="p-1 rounded-lg text-slate-300 dark:text-slate-600 hover:text-rose-500 transition-colors"
                        title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                      >
                        <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {tool.name}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {tool.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                    {tool.categoryLabel}
                  </span>
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Launch Tool <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {filteredTools.length === 0 && (
          <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              No tools found matching &quot;{searchQuery}&quot;.
            </p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>

      {/* 3. POPULAR TOOLS SPOTLIGHT */}
      <section className="p-8 sm:p-10 rounded-3xl bg-gradient-to-tr from-slate-900 via-slate-900 to-blue-950 text-white shadow-xl space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-wider mb-2">
              <Star className="w-3.5 h-3.5 fill-blue-400" />
              <span>Community Favorites</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Most Used Tools This Week
            </h2>
          </div>
          <p className="text-xs text-slate-400 max-w-sm">
            Proven, high-utility tools used by thousands of professionals, job applicants, and students every day.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { id: 'image-compressor', name: 'Image Compressor', desc: 'Reduce JPG/PNG size by up to 85%', route: '/tools/image-compressor' },
            { id: 'pdf-merger', name: 'PDF Merger', desc: 'Join multi-page PDF documents', route: '/tools/pdf-merger' },
            { id: 'passport-photo-maker', name: 'Passport Photo Maker', desc: 'US 2x2 & Schengen 35x45mm sheets', route: '/tools/passport-photo-maker' },
            { id: 'gst-calculator', name: 'GST Calculator', desc: 'Indian CGST/SGST reverse slabs', route: '/tools/gst-calculator' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => onSelectTool(item.route)}
              className="p-5 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-left transition-all group flex flex-col justify-between"
            >
              <div>
                <h4 className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors">
                  {item.name}
                </h4>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">{item.desc}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-700/40 text-[11px] font-bold text-blue-400 flex items-center justify-between">
                <span>Open Instant</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 4. SECURITY COMPARISON: ToolNova vs Traditional Cloud Converters */}
      <section className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Architecture Comparison
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Why Client-Side Execution Wins
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            See the difference between ToolNova and legacy upload-based services.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ToolNova Box */}
          <div className="p-6 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/60 space-y-4">
            <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>ToolNova (Local Browser Memory)</span>
            </div>
            <ul className="space-y-2.5 text-xs text-emerald-900 dark:text-emerald-200">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                Files remain in local RAM; 0 bytes transmitted over network.
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                Safe for bank statements, tax returns, and ID photos.
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                Works offline once the web page is cached.
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                Instant processing with zero server queues.
              </li>
            </ul>
          </div>

          {/* Cloud Services Box */}
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-bold text-sm">
              <Lock className="w-5 h-5 text-slate-400" />
              <span>Traditional Cloud Converters</span>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-500 dark:text-slate-400">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                Raw documents uploaded to remote third-party servers.
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                Files stored on temporary cache disks subject to breaches.
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                Slow transfer speeds on large 20MB+ files.
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                Frequently enforce daily rate limits or paywalls.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 5. GUIDES AND BLOG SECTION */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 block mb-1">
              Knowledge Base
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Latest Guides &amp; Tutorials
            </h2>
          </div>
          <button
            onClick={() => onSelectTool('/blog')}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <span>View All Guides</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {BLOG_POSTS.slice(0, 3).map((post) => (
            <article
              key={post.id}
              onClick={() => onSelectBlog(post.slug)}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500/60 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
                  {post.category}
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug">
                  {post.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                  {post.summary}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center justify-between">
                <span>{post.readTime}</span>
                <span className="flex items-center gap-1">Read &rarr;</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 6. FAQ PREVIEW */}
      <section className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Common Inquiries
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Quick answers regarding our processing engine and privacy guarantees.
          </p>
        </div>

        <div className="space-y-3 max-w-3xl mx-auto text-xs sm:text-sm">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 space-y-1">
            <h4 className="font-bold text-slate-800 dark:text-slate-100">
              Are my photos or documents uploaded to ToolNova servers?
            </h4>
            <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
              No. All operations run directly in your local browser tab via HTML5 Canvas and WebAssembly. Your files never touch our servers.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 space-y-1">
            <h4 className="font-bold text-slate-800 dark:text-slate-100">
              Is ToolNova really free to use forever?
            </h4>
            <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
              Yes, 100% free with no hidden charges, trial periods, or mandatory account creation.
            </p>
          </div>
        </div>

        <div className="text-center pt-2">
          <button
            onClick={() => onSelectTool('/faq')}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
          >
            View all frequently asked questions &rarr;
          </button>
        </div>
      </section>
    </div>
  );
};
