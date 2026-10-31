import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Search, 
  Moon, 
  Sun, 
  Menu, 
  X, 
  FileText, 
  Image as ImageIcon, 
  Calculator, 
  Bot, 
  BookOpen, 
  Heart,
  ChevronDown,
  ArrowRight
} from 'lucide-react';
import { TOOLS } from '../../data/toolsData';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  favorites: string[];
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPath,
  onNavigate,
  isDarkMode,
  toggleDarkMode,
  favorites
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryDropdown, setCategoryDropdown] = useState<string | null>(null);

  // Close menus on navigation
  const handleNav = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
    setSearchOpen(false);
    setCategoryDropdown(null);
  };

  // Keyboard shortcut Ctrl+K / Cmd+K for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        setSearchOpen(false);
        setCategoryDropdown(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const searchResults = searchQuery.trim()
    ? TOOLS.filter(
        (t) =>
          t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : [];

  return (
    <>
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/90 dark:bg-slate-950/90 border-b border-slate-200/80 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <div className="flex items-center gap-8">
              <button
                onClick={() => handleNav('/')}
                className="flex items-center gap-2.5 text-left group focus:outline-hidden"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent">
                    ToolNova
                  </span>
                  <span className="block text-[10px] uppercase font-bold tracking-wider text-blue-600 dark:text-blue-400 -mt-1">
                    Free Online Tools
                  </span>
                </div>
              </button>

              {/* Desktop Nav Links */}
              <nav className="hidden lg:flex items-center gap-1">
                <button
                  onClick={() => handleNav('/')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    currentPath === '/'
                      ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  Home
                </button>

                {/* PDF Category Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setCategoryDropdown(categoryDropdown === 'pdf' ? null : 'pdf')}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
                  >
                    <FileText className="w-4 h-4 text-rose-500" />
                    <span>PDF Tools</span>
                    <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                  </button>
                  {categoryDropdown === 'pdf' && (
                    <div className="absolute top-full left-0 mt-1 w-64 p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl z-50 animate-in fade-in zoom-in-95">
                      <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2.5 py-1">5 PDF Utilities</div>
                      {TOOLS.filter(t => t.category === 'pdf').map(tool => (
                        <button
                          key={tool.id}
                          onClick={() => handleNav(tool.route)}
                          className="w-full text-left px-2.5 py-2 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-950/50 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center justify-between"
                        >
                          <span>{tool.name}</span>
                          {tool.badge && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                              {tool.badge}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Image Category Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setCategoryDropdown(categoryDropdown === 'image' ? null : 'image')}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
                  >
                    <ImageIcon className="w-4 h-4 text-blue-500" />
                    <span>Image Tools</span>
                    <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                  </button>
                  {categoryDropdown === 'image' && (
                    <div className="absolute top-full left-0 mt-1 w-64 p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl z-50 animate-in fade-in zoom-in-95 max-h-96 overflow-y-auto">
                      <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2.5 py-1">10 Image Tools</div>
                      {TOOLS.filter(t => t.category === 'image').map(tool => (
                        <button
                          key={tool.id}
                          onClick={() => handleNav(tool.route)}
                          className="w-full text-left px-2.5 py-2 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-950/50 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center justify-between"
                        >
                          <span className="truncate pr-2">{tool.name}</span>
                          {tool.badge && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300">
                              {tool.badge}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Calculators Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setCategoryDropdown(categoryDropdown === 'calc' ? null : 'calc')}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
                  >
                    <Calculator className="w-4 h-4 text-emerald-500" />
                    <span>Calculators</span>
                    <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                  </button>
                  {categoryDropdown === 'calc' && (
                    <div className="absolute top-full left-0 mt-1 w-64 p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl z-50 animate-in fade-in zoom-in-95">
                      <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2.5 py-1">6 Calculators</div>
                      {TOOLS.filter(t => t.category === 'calc').map(tool => (
                        <button
                          key={tool.id}
                          onClick={() => handleNav(tool.route)}
                          className="w-full text-left px-2.5 py-2 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center justify-between"
                        >
                          <span>{tool.name}</span>
                          {tool.badge && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300">
                              {tool.badge}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* AI Tools Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setCategoryDropdown(categoryDropdown === 'ai' ? null : 'ai')}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
                  >
                    <Bot className="w-4 h-4 text-violet-500" />
                    <span>AI Utilities</span>
                    <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                  </button>
                  {categoryDropdown === 'ai' && (
                    <div className="absolute top-full left-0 mt-1 w-64 p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl z-50 animate-in fade-in zoom-in-95">
                      <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2.5 py-1">AI & Writing Tools</div>
                      {TOOLS.filter(t => t.category === 'ai').map(tool => (
                        <button
                          key={tool.id}
                          onClick={() => handleNav(tool.route)}
                          className="w-full text-left px-2.5 py-2 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-violet-50 dark:hover:bg-violet-950/50 hover:text-violet-600 dark:hover:text-violet-400 transition-colors flex items-center justify-between"
                        >
                          <span>{tool.name}</span>
                          {tool.badge && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-violet-100 dark:bg-violet-900/60 text-violet-700 dark:text-violet-300">
                              {tool.badge}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Blog Link */}
                <button
                  onClick={() => handleNav('/blog')}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    currentPath.startsWith('/blog')
                      ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <BookOpen className="w-4 h-4 text-amber-500" />
                  <span>Blog & Guides</span>
                </button>
              </nav>
            </div>

            {/* Right Action Buttons */}
            <div className="flex items-center gap-2">
              {/* Search Trigger */}
              <button
                onClick={() => setSearchOpen(true)}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/70 text-slate-500 dark:text-slate-400 text-xs font-medium border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 transition-all cursor-pointer"
                aria-label="Search tools"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Search tools...</span>
                <kbd className="px-1.5 py-0.5 text-[10px] rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400">
                  Ctrl K
                </kbd>
              </button>

              <button
                onClick={() => setSearchOpen(true)}
                className="sm:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label="Search tools"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Favorites badge count if any */}
              {favorites.length > 0 && (
                <button
                  onClick={() => handleNav('/#favorites')}
                  className="relative p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                  title="Starred Favorites"
                >
                  <Heart className="w-5 h-5 fill-rose-500" />
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center">
                    {favorites.length}
                  </span>
                </button>
              )}

              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Toggle dark mode"
              >
                {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label="Open menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 space-y-3">
            <button
              onClick={() => handleNav('/')}
              className="w-full text-left px-3 py-2 rounded-lg font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900"
            >
              All Tools & Home
            </button>
            <div className="space-y-1 pl-2">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider py-1">Popular Categories</div>
              <button onClick={() => handleNav('/#pdf')} className="block w-full text-left py-1.5 px-3 rounded text-sm text-slate-700 dark:text-slate-300">
                PDF Tools (5)
              </button>
              <button onClick={() => handleNav('/#image')} className="block w-full text-left py-1.5 px-3 rounded text-sm text-slate-700 dark:text-slate-300">
                Image Tools (10)
              </button>
              <button onClick={() => handleNav('/#calc')} className="block w-full text-left py-1.5 px-3 rounded text-sm text-slate-700 dark:text-slate-300">
                Calculators (6)
              </button>
              <button onClick={() => handleNav('/#ai')} className="block w-full text-left py-1.5 px-3 rounded text-sm text-slate-700 dark:text-slate-300">
                AI & Writing Tools (4)
              </button>
            </div>
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => handleNav('/blog')}
                className="w-full text-left px-3 py-2 rounded-lg font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 flex items-center justify-between"
              >
                <span>Guides & Blog</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>
              <button
                onClick={() => handleNav('/about')}
                className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900"
              >
                About ToolNova
              </button>
              <button
                onClick={() => handleNav('/contact')}
                className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900"
              >
                Contact Support
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Global Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-start justify-center pt-16 sm:pt-24 p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-xl overflow-hidden">
            <div className="relative p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
              <Search className="w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search PDF tools, image compressors, calculators, AI..."
                className="w-full bg-transparent text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden text-base"
                autoFocus
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto p-2">
              {searchQuery.trim() === '' ? (
                <div className="p-4 text-center">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Suggested Popular Tools</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {TOOLS.filter(t => t.popular).slice(0, 6).map(t => (
                      <button
                        key={t.id}
                        onClick={() => handleNav(t.route)}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-950/60 hover:text-blue-600 transition-colors"
                      >
                        {t.name}
                      </button>
                    ))}
                  </div>
                </div>
              ) : searchResults.length > 0 ? (
                searchResults.map(tool => (
                  <button
                    key={tool.id}
                    onClick={() => handleNav(tool.route)}
                    className="w-full text-left p-3 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors flex items-center justify-between group"
                  >
                    <div>
                      <div className="text-sm font-semibold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                        {tool.name}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-sm">
                        {tool.tagline}
                      </div>
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/60 group-hover:text-blue-600">
                      {tool.categoryLabel}
                    </span>
                  </button>
                ))
              ) : (
                <div className="p-8 text-center text-slate-500 dark:text-slate-400 text-sm">
                  No tools found matching &quot;{searchQuery}&quot;. Try keywords like &quot;pdf&quot;, &quot;crop&quot;, &quot;gst&quot;, &quot;resize&quot;.
                </div>
              )}
            </div>

            <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-950/50 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Press <kbd className="px-1 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 font-mono">ESC</kbd> to exit</span>
              <span>25 Free Browser Utilities</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
