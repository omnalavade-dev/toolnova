import React from 'react';
import { AlertTriangle, ShieldAlert, CircleDollarSign, Activity } from 'lucide-react';
import { SEOHead } from '../common/SEOHead';

export const DisclaimerPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <SEOHead
        title="Disclaimer - ToolNova"
        description="Legal and professional disclaimer regarding financial, health, and document tools provided on ToolNova."
        canonicalPath="/#/disclaimer"
      />

      <div className="space-y-3 py-4">
        <span className="px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider">
          Legal & Advisory Disclaimer
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Disclaimer
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          The information and utilities provided on ToolNova are for general informational, educational, and computational assistance only.
        </p>
      </div>

      <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-8 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
            <CircleDollarSign className="w-5 h-5 text-blue-600" />
            <span>Financial & Tax Calculations Advisory (GST & EMI)</span>
          </div>
          <p>
            Calculators on this website, including our <strong>GST Calculator</strong> and <strong>EMI Calculator</strong>, are designed as illustrative estimation aids. They do not constitute certified tax advice, financial planning, or binding bank loan offers. Actual tax liabilities and loan schedules may vary based on bank compounding intervals, processing fees, state tax notifications, and round-off rules. Always consult a Certified Chartered Accountant (CA) or certified financial planner for official filings.
          </p>
        </section>

        <section className="space-y-3">
          <div className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
            <Activity className="w-5 h-5 text-emerald-600" />
            <span>Health & Fitness Indicator Advisory (BMI Calculator)</span>
          </div>
          <p>
            The <strong>BMI Calculator</strong> provides a general body mass index score based on World Health Organization (WHO) standard categories. BMI does not directly differentiate between bone density, fluid retention, or lean muscular mass. This tool is not intended to provide medical diagnosis, treatment plans, or dietary prescriptions. Always consult a qualified medical professional for health evaluations.
          </p>
        </section>

        <section className="space-y-3">
          <div className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
            <ShieldAlert className="w-5 h-5 text-amber-600" />
            <span>Passport & Visa Photo Compliance</span>
          </div>
          <p>
            While our <strong>Passport Photo Maker</strong> implements dimensions and guides aligned with official government biometric guidelines (US 2x2&quot;, Schengen 35x45mm, etc.), consular requirements and embassy approvals remain at the absolute discretion of issuing government authorities. Users must verify their local consulate requirements before final submission.
          </p>
        </section>

        <section className="space-y-3">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            External Advertising Links
          </h3>
          <p>
            ToolNova displays advertisements served by third-party ad networks (such as Google AdSense). We do not control or endorse the specific products, claims, or services advertised in sponsored third-party links.
          </p>
        </section>
      </div>
    </div>
  );
};
