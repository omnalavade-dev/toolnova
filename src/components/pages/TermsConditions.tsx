import React from 'react';
import { FileText, CheckCircle2 } from 'lucide-react';
import { SEOHead } from '../common/SEOHead';

export const TermsConditions: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <SEOHead
        title="Terms and Conditions - ToolNova"
        description="Review the terms of service, acceptable use guidelines, and intellectual property provisions for ToolNova."
        canonicalPath="/#/terms"
      />

      <div className="space-y-3 py-4">
        <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
          Terms of Service &bull; Last Revised October 2026
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Terms and Conditions
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          Please read these Terms and Conditions carefully before using the ToolNova website and tools.
        </p>
      </div>

      <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-8 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">1. Acceptance of Terms</h2>
          <p>
            By accessing or using ToolNova, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. If you do not agree to these terms, you should immediately cease use of the platform.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">2. Permitted Use</h2>
          <p>
            ToolNova provides free browser-based tools for personal, educational, and commercial purposes. You agree not to:
          </p>
          <ul className="list-disc ml-5 space-y-1 text-xs">
            <li>Attempt to reverse-engineer, decompile, or disrupt our web application infrastructure.</li>
            <li>Use automated scrapers, bots, or excessive automated requests to overwhelm the site.</li>
            <li>Process materials that infringe upon the intellectual property, privacy, or legal rights of third parties.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">3. Intellectual Property Rights</h2>
          <p>
            You retain 100% of the intellectual property rights and ownership in any documents, images, text, or data you process through our tools. ToolNova asserts no copyright, license, or claim over your source or converted files.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">4. Disclaimer of Warranties</h2>
          <p>
            ToolNova and its tools are provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis without warranties of any kind, whether express or implied. While we strive for extreme algorithmic precision in our image, PDF, and mathematical calculators, we do not warrant that tools will be uninterrupted or error-free.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">5. Limitation of Liability</h2>
          <p>
            In no event shall ToolNova or its maintainers be liable for any indirect, incidental, special, consequential, or punitive damages arising from the use or inability to use the services or processing results.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">6. Changes to Terms</h2>
          <p>
            We reserve the right to modify or replace these Terms at any time. Continued use of the platform following any modifications constitutes acceptance of the revised Terms.
          </p>
        </section>
      </div>
    </div>
  );
};
