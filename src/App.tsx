/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { TOOLS } from './data/toolsData';
import { BLOG_POSTS } from './data/blogsData';

// Layout
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './components/home/HomePage';
import { ToolLayout } from './components/tools/ToolLayout';

// PDF Tools
import { JpgToPdf } from './components/tools/pdf/JpgToPdf';
import { PdfMerger } from './components/tools/pdf/PdfMerger';
import { PdfSplitter } from './components/tools/pdf/PdfSplitter';
import { PdfCompressor } from './components/tools/pdf/PdfCompressor';
import { PdfOrganizer } from './components/tools/pdf/PdfOrganizer';

// Image Tools
import { ImageCompressor } from './components/tools/image/ImageCompressor';
import { ImageResizer } from './components/tools/image/ImageResizer';
import { JpgToPng } from './components/tools/image/JpgToPng';
import { PngToJpg } from './components/tools/image/PngToJpg';
import { ImageCropper } from './components/tools/image/ImageCropper';
import { PassportPhotoMaker } from './components/tools/image/PassportPhotoMaker';
import { SignatureResizer } from './components/tools/image/SignatureResizer';
import { ImageDpiUtility } from './components/tools/image/ImageDpiUtility';
import { ImageRotator } from './components/tools/image/ImageRotator';
import { ImageConverter } from './components/tools/image/ImageConverter';

// Calculators
import { AgeCalculator } from './components/tools/calculators/AgeCalculator';
import { PercentageCalculator } from './components/tools/calculators/PercentageCalculator';
import { GstCalculator } from './components/tools/calculators/GstCalculator';
import { EmiCalculator } from './components/tools/calculators/EmiCalculator';
import { DiscountCalculator } from './components/tools/calculators/DiscountCalculator';
import { BmiCalculator } from './components/tools/calculators/BmiCalculator';

// AI Tools
import { TextSummarizer } from './components/tools/ai/TextSummarizer';
import { ParagraphRewriter } from './components/tools/ai/ParagraphRewriter';
import { GrammarChecker } from './components/tools/ai/GrammarChecker';
import { TextCaseConverter } from './components/tools/ai/TextCaseConverter';

// Blog
import { BlogList } from './components/blog/BlogList';
import { BlogPostView } from './components/blog/BlogPostView';

// Important Pages
import { AboutPage } from './components/pages/AboutPage';
import { ContactPage } from './components/pages/ContactPage';
import { PrivacyPolicy } from './components/pages/PrivacyPolicy';
import { TermsConditions } from './components/pages/TermsConditions';
import { DisclaimerPage } from './components/pages/DisclaimerPage';
import { FaqPage } from './components/pages/FaqPage';

export default function App() {
  // Hash-based routing
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.hash.replace(/^#/, '') || '/';
  });

  // Dark mode
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('toolnova_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Favorites
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('toolnova_favorites');
      return saved ? JSON.parse(saved) : ['image-compressor', 'pdf-merger', 'gst-calculator'];
    } catch {
      return ['image-compressor', 'pdf-merger', 'gst-calculator'];
    }
  });

  // Apply dark mode class to root HTML
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('toolnova_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('toolnova_theme', 'light');
    }
  }, [isDarkMode]);

  // Sync hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#/, '') || '/';
      setCurrentPath(hash);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (path: string) => {
    window.location.hash = path;
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const toggleFavorite = (toolId: string) => {
    setFavorites((prev) => {
      const next = prev.includes(toolId) ? prev.filter((id) => id !== toolId) : [...prev, toolId];
      localStorage.setItem('toolnova_favorites', JSON.stringify(next));
      return next;
    });
  };

  // Tool Component Registry
  const renderToolComponent = (toolId: string) => {
    switch (toolId) {
      // PDF
      case 'jpg-to-pdf': return <JpgToPdf />;
      case 'pdf-merger': return <PdfMerger />;
      case 'pdf-splitter': return <PdfSplitter />;
      case 'pdf-compressor': return <PdfCompressor />;
      case 'pdf-organizer': return <PdfOrganizer />;

      // Image
      case 'image-compressor': return <ImageCompressor />;
      case 'image-resizer': return <ImageResizer />;
      case 'jpg-to-png': return <JpgToPng />;
      case 'png-to-jpg': return <PngToJpg />;
      case 'image-cropper': return <ImageCropper />;
      case 'passport-photo-maker': return <PassportPhotoMaker />;
      case 'signature-resizer': return <SignatureResizer />;
      case 'image-dpi-utility': return <ImageDpiUtility />;
      case 'image-rotator': return <ImageRotator />;
      case 'image-converter': return <ImageConverter />;

      // Calculators
      case 'age-calculator': return <AgeCalculator />;
      case 'percentage-calculator': return <PercentageCalculator />;
      case 'gst-calculator': return <GstCalculator />;
      case 'emi-calculator': return <EmiCalculator />;
      case 'discount-calculator': return <DiscountCalculator />;
      case 'bmi-calculator': return <BmiCalculator />;

      // AI & Text
      case 'text-summarizer': return <TextSummarizer />;
      case 'paragraph-rewriter': return <ParagraphRewriter />;
      case 'grammar-checker': return <GrammarChecker />;
      case 'text-case-converter': return <TextCaseConverter />;

      default: return null;
    }
  };

  // Route resolver
  const renderContent = () => {
    // 1. Tool Page
    if (currentPath.startsWith('/tools/')) {
      const toolId = currentPath.replace('/tools/', '').split('?')[0];
      const tool = TOOLS.find((t) => t.id === toolId);
      if (tool) {
        return (
          <ToolLayout
            tool={tool}
            onNavigate={navigate}
            isFavorite={favorites.includes(tool.id)}
            toggleFavorite={() => toggleFavorite(tool.id)}
          >
            {renderToolComponent(tool.id)}
          </ToolLayout>
        );
      }
    }

    // 2. Individual Blog Post
    if (currentPath.startsWith('/blog/')) {
      const slug = currentPath.replace('/blog/', '').split('?')[0];
      const post = BLOG_POSTS.find((p) => p.slug === slug);
      if (post) {
        return (
          <BlogPostView
            post={post}
            onBack={() => navigate('/blog')}
            onNavigate={navigate}
          />
        );
      }
    }

    // 3. Blog Index
    if (currentPath === '/blog') {
      return (
        <BlogList
          onSelectPost={(slug) => navigate(`/blog/${slug}`)}
          onNavigate={navigate}
        />
      );
    }

    // 4. Important Pages
    if (currentPath === '/about') return <AboutPage />;
    if (currentPath === '/contact') return <ContactPage onNavigate={navigate} />;
    if (currentPath === '/privacy-policy') return <PrivacyPolicy />;
    if (currentPath === '/terms') return <TermsConditions />;
    if (currentPath === '/disclaimer') return <DisclaimerPage />;
    if (currentPath === '/faq') return <FaqPage />;

    // 5. Default: Home
    return (
      <HomePage
        onSelectTool={navigate}
        onSelectBlog={(slug) => navigate(`/blog/${slug}`)}
        favorites={favorites}
        toggleFavorite={toggleFavorite}
      />
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans transition-colors duration-200">
      {/* Top Navigation */}
      <Navbar
        currentPath={currentPath}
        onNavigate={navigate}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        favorites={favorites}
      />

      {/* Main Page Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {renderContent()}
      </main>

      {/* Site Footer */}
      <Footer onNavigate={navigate} />
    </div>
  );
}
