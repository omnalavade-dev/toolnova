import React, { useState } from 'react';
import { Receipt, Copy, Check } from 'lucide-react';

export const GstCalculator: React.FC = () => {
  const [amount, setAmount] = useState<number>(10000);
  const [gstRate, setGstRate] = useState<number>(18);
  const [calculationType, setCalculationType] = useState<'exclusive' | 'inclusive'>('exclusive');
  const [copied, setCopied] = useState<boolean>(false);

  // Calculations
  let netAmount = 0;
  let gstAmount = 0;
  let totalAmount = 0;

  if (calculationType === 'exclusive') {
    netAmount = amount;
    gstAmount = (amount * gstRate) / 100;
    totalAmount = netAmount + gstAmount;
  } else {
    // Reverse calculation: Amount / (1 + rate / 100)
    netAmount = amount / (1 + gstRate / 100);
    gstAmount = amount - netAmount;
    totalAmount = amount;
  }

  const cgst = gstAmount / 2;
  const sgst = gstAmount / 2;

  const copyBreakdown = () => {
    const text = `GST Invoice Breakdown:
Base Net Amount: ₹${netAmount.toFixed(2)}
GST Slab: ${gstRate}% (${calculationType === 'exclusive' ? 'Exclusive' : 'Inclusive'})
CGST (Central): ₹${cgst.toFixed(2)}
SGST (State): ₹${sgst.toFixed(2)}
Total GST: ₹${gstAmount.toFixed(2)}
Gross Total: ₹${totalAmount.toFixed(2)}
Calculated on ToolNova.app`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Inputs */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Receipt className="w-5 h-5 text-blue-600" />
            <span>GST Parameters</span>
          </h3>

          {/* Amount input */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Amount (₹ INR)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-3 text-sm font-bold text-slate-400">₹</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Math.max(0, Number(e.target.value)))}
                className="w-full pl-8 pr-4 py-3 rounded-xl text-base bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-bold focus:outline-hidden focus:border-blue-500"
              />
            </div>
          </div>

          {/* Exclusive vs Inclusive toggle */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Calculation Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setCalculationType('exclusive')}
                className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all ${
                  calculationType === 'exclusive'
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                GST Exclusive (+ Add GST)
              </button>
              <button
                type="button"
                onClick={() => setCalculationType('inclusive')}
                className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all ${
                  calculationType === 'inclusive'
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                GST Inclusive (Extract GST)
              </button>
            </div>
          </div>

          {/* GST Slabs */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Select GST Rate Slab
            </label>
            <div className="grid grid-cols-5 gap-2">
              {[0, 5, 12, 18, 28].map((rate) => (
                <button
                  key={rate}
                  type="button"
                  onClick={() => setGstRate(rate)}
                  className={`py-2.5 rounded-xl border text-xs font-bold transition-all ${
                    gstRate === rate
                      ? 'border-blue-600 bg-blue-600 text-white shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  {rate}%
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-6">
          <div>
            <div className="flex justify-between items-center mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Tax Invoice Breakdown
              </span>
              <button
                onClick={copyBreakdown}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-semibold"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Summary'}</span>
              </button>
            </div>

            <div className="space-y-3.5 text-sm">
              <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">Base Net Amount:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">
                  ₹{netAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">CGST ({(gstRate / 2)}% Central Tax):</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300 font-mono">
                  ₹{cgst.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">SGST ({(gstRate / 2)}% State Tax):</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300 font-mono">
                  ₹{sgst.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">Total GST ({gstRate}%):</span>
                <span className="font-bold text-blue-600 dark:text-blue-400 font-mono">
                  ₹{gstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-tr from-slate-900 to-blue-950 text-white shadow-md">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-300">
              Total Amount Payable
            </span>
            <p className="text-3xl font-extrabold font-mono mt-1">
              ₹{totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
