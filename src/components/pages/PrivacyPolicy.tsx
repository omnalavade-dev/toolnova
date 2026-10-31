import React from 'react';
import { Shield, Lock, Eye, Server, Cookie, CheckCircle2 } from 'lucide-react';
import { SEOHead } from '../common/SEOHead';

export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <SEOHead
        title="Privacy Policy - ToolNova"
        description="ToolNova's privacy policy: 100% client-side file execution. We do not store, view, or transmit your uploaded files."
        canonicalPath="/#/privacy-policy"
      />

      <div className="space-y-3 py-4">
        <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
          Privacy Policy &bull; Last Updated October 2026
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Your Data and Files Belong to You
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          At ToolNova, user privacy is not an afterthought or marketing slogan—it is the foundational engineering architecture of our website.
        </p>
      </div>

      <div className="p-6 rounded-3xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/40 flex items-start gap-4">
        <Shield className="w-8 h-8 text-emerald-600 shrink-0 mt-1" />
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
            The Zero-Upload Client-Side Guarantee
          </h3>
          <p className="text-xs text-emerald-800 dark:text-emerald-300 leading-relaxed">
            When you select a PDF, image, or document on ToolNova, the file is loaded solely into your local browser&apos;s sandbox memory. It is processed locally by WebAssembly and HTML5 Canvas scripts executing on your device. Your file is NEVER sent to ToolNova servers or stored on remote cloud disks.
          </p>
        </div>
      </div>

      <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-8 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">1. Information We Do Not Collect</h2>
          <p>
            Unlike conventional online tool portals, we do not require account registration, usernames, email addresses, or phone numbers to use any of our standard tools. Because document processing takes place client-side, we have no access to the contents of your PDFs, photographs, passports, financial spreadsheets, or signatures.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">2. Browser Storage & Local Preferences</h2>
          <p>
            We use your browser&apos;s local storage (`localStorage`) solely for benign client preferences:
          </p>
          <ul className="list-disc ml-5 space-y-1 text-xs">
            <li>Your theme preference (Dark Mode or Light Mode toggle).</li>
            <li>Your starred tool favorites list so you can bookmark your frequent utilities.</li>
          </ul>
          <p className="text-xs text-slate-400">
            This data never leaves your device and can be cleared at any time in your browser settings.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">3. Third-Party Advertising & Cookies (Google AdSense)</h2>
          <p>
            ToolNova is supported by advertising partners, including Google AdSense, to keep all utilities 100% free:
          </p>
          <ul className="list-disc ml-5 space-y-1 text-xs">
            <li>Third-party vendors, including Google, use cookies to serve ads based on prior visits to this website or other websites.</li>
            <li>Google&apos;s use of advertising cookies enables it and its partners to serve ads to users based on their visit to our sites and/or other sites on the Internet.</li>
            <li>Users may opt out of personalized advertising by visiting Google Ad Settings (<a href="https://adssettings.google.com" target="_blank" rel="noreferrer" className="text-blue-600 underline">adssettings.google.com</a>).</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">4. External AI Model Interactions</h2>
          <p>
            When utilizing AI text features (such as Text Summarization or Grammar Analysis), prompt text entered into the AI input box is sent securely to the server endpoint to invoke the Gemini API. We never use your submitted text to train models. Do not submit sensitive passwords or API keys into text fields.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">5. Contact Information</h2>
          <p>
            For privacy-related inquiries, data protection questions, or technical audits of our client-side architecture, contact our compliance team at <span className="font-mono text-blue-600">privacy@toolnova.app</span>.
          </p>
        </section>
      </div>
    </div>
  );
};
