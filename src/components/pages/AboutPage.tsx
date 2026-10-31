import React from 'react';
import { Shield, Zap, Lock, Heart, CheckCircle2, Cpu, Globe } from 'lucide-react';
import { SEOHead } from '../common/SEOHead';
import { AdBanner } from '../common/AdBanner';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <SEOHead
        title="About ToolNova - Zero-Server Local Browser Tools"
        description="Learn about ToolNova's privacy-first architecture. Free, instant PDF, image, AI, and calculation tools running directly in your browser."
        canonicalPath="/#/about"
      />

      {/* Hero */}
      <div className="text-center space-y-4 py-4">
        <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
          Our Philosophy & Technology
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          Tools That Respect Your Privacy by Design
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          ToolNova was created to solve a glaring problem on the web: the unnecessary transmission of personal documents, photos, and financial data to remote servers.
        </p>
      </div>

      {/* Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">100% Client-Side</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Your files never leave your device. All PDF manipulations, image cropping, and compressions run entirely inside your browser memory using WebAssembly.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Zap className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Instant Speed</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Without time wasted uploading megabytes over cellular networks or waiting in cloud queues, operations finish in milliseconds.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Globe className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Forever Free & Open</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            No registration barriers, paywalls, or hidden watermarks. ToolNova is funded via non-intrusive, privacy-respecting sponsor banners.
          </p>
        </div>
      </div>

      {/* Deep Dive Story */}
      <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Why Does Local Execution Matter?
        </h2>
        <p>
          Every day, millions of people upload passport photos, signed loan documents, and sensitive medical reports to random online PDF converters. Many of these services write files to unencrypted storage buckets or maintain retention logs.
        </p>
        <p>
          With modern client-side technologies—including HTML5 Canvas, typed arrays, WebAssembly, and modern JavaScript engines—web browsers have the compute power of desktop workstations. ToolNova harnesses this capability so you get desktop-grade power directly in your web tab.
        </p>

        <h3 className="text-base font-bold text-slate-900 dark:text-white pt-2">
          Our Operational Standards
        </h3>
        <ul className="space-y-2 text-xs sm:text-sm">
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Zero file storage: We do not operate temporary document storage databases.</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Zero watermarks: Converted PDFs and resized photos are 100% clean and unbranded.</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>No account required: Use any tool anytime without creating an account or password.</span>
          </li>
        </ul>
      </div>

      <AdBanner slotId="about-page-bottom" format="horizontal" />
    </div>
  );
};
