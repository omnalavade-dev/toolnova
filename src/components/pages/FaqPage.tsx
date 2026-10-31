import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Search, Lock, Zap, FileText } from 'lucide-react';
import { SEOHead } from '../common/SEOHead';

interface FaqItem {
  q: string;
  a: string;
  category: 'Security' | 'PDF Tools' | 'Image Tools' | 'Calculators' | 'General';
}

const FAQ_LIST: FaqItem[] = [
  {
    category: 'Security',
    q: 'Are my files uploaded or stored on any server?',
    a: 'No. ToolNova operates on a 100% client-side model. When you compress an image or merge PDFs, the JavaScript code runs exclusively in your device’s browser memory. Your documents never travel across the internet or touch our servers.'
  },
  {
    category: 'Security',
    q: 'Can I use ToolNova offline?',
    a: 'Yes! Once the webpage is loaded in your browser tab, all PDF tools, image compressors, and mathematical calculators function completely offline without an active internet connection.'
  },
  {
    category: 'General',
    q: 'Is ToolNova really free? Are there any hidden fees or limits?',
    a: 'ToolNova is 100% free with unlimited usage. There are no paywalls, subscriptions, mandatory signups, or artificial file limits. Our platform is supported by non-intrusive sponsor advertisements.'
  },
  {
    category: 'PDF Tools',
    q: 'What is the maximum PDF file size supported?',
    a: 'Because processing happens on your local device, file size is limited only by your computer or phone’s available RAM memory. In standard modern browsers, you can comfortably process documents up to 100MB or several hundred pages.'
  },
  {
    category: 'PDF Tools',
    q: 'Will compressing my PDF ruin the text sharpness?',
    a: 'No. Our PDF Compressor targets structural stream redundancy and heavy embedded image downscaling. Vector text, fonts, and hyperlinks remain razor-sharp.'
  },
  {
    category: 'Image Tools',
    q: 'How does the Passport Photo Maker print 4x6 inch sheets?',
    a: 'Our tool arranges 6 or 8 correctly sized biometric photos onto a standard 1200x1800 pixel canvas at 300 DPI, which corresponds exactly to a 4x6 inch print. You can send this file to any local photo printing kiosk (e.g., Walgreens, CVS, Boots) to print for pennies instead of paying $15+ at an ID studio.'
  },
  {
    category: 'Image Tools',
    q: 'What does the Signature Resizer do for government forms?',
    a: 'Recruitment portals (like UPSC, SSC, Banking exams) strictly enforce file size limits between 10KB and 20KB and specific pixel ratios (like 140x60). Our Signature Resizer adjusts the dimensions, cleans up camera paper shadow and yellow tint, and compresses the JPEG to fit under the target KB cap.'
  },
  {
    category: 'Calculators',
    q: 'How accurate is the Indian GST Calculator?',
    a: 'Our GST calculator uses the official mathematical formulas for both forward GST (Exclusive) and reverse GST (Inclusive), properly splitting tax into CGST and SGST for intra-state billing.'
  },
  {
    category: 'Calculators',
    q: 'How is the EMI calculated in the Loan Calculator?',
    a: 'It uses the standard reducing-balance amortization formula: [P x R x (1+R)^N]/[(1+R)^N-1], which matches the exact calculation used by commercial retail banks worldwide.'
  }
];

export const FaqPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [search, setSearch] = useState<string>('');

  const filteredFaqs = FAQ_LIST.filter(
    (item) =>
      item.q.toLowerCase().includes(search.toLowerCase()) ||
      item.a.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <SEOHead
        title="Frequently Asked Questions (FAQ) - ToolNova"
        description="Find answers to common questions about ToolNova's client-side security, file limits, passport maker, and calculation accuracy."
        canonicalPath="/#/faq"
        schemaData={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: FAQ_LIST.map((item) => ({
            '@type': 'Question',
            name: item.q,
            acceptedAnswer: {
              '@type': 'Answer',
              text: item.a
            }
          }))
        }}
      />

      <div className="text-center space-y-3 py-4">
        <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
          Knowledge Base
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          Frequently Asked Questions
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
          Everything you need to know about our browser tools, privacy architecture, and format guidelines.
        </p>
      </div>

      {/* Search Input */}
      <div className="relative max-w-xl mx-auto">
        <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter questions (e.g. 'security', 'passport', 'limits')..."
          className="w-full pl-10 pr-4 py-3 rounded-2xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 shadow-xs focus:outline-hidden focus:border-blue-500"
        />
      </div>

      {/* Accordion List */}
      <div className="space-y-3">
        {filteredFaqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden transition-all"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
                    {faq.category}
                  </span>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {faq.q}
                  </span>
                </div>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-blue-600 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                )}
              </button>

              {isOpen && (
                <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
