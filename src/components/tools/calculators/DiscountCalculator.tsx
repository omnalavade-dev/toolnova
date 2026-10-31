import React, { useState } from 'react';
import { Tag, Sparkles } from 'lucide-react';

export const DiscountCalculator: React.FC = () => {
  const [originalPrice, setOriginalPrice] = useState<number>(120);
  const [discountPercent, setDiscountPercent] = useState<number>(25);
  const [couponPercent, setCouponPercent] = useState<number>(10);
  const [taxPercent, setTaxPercent] = useState<number>(8);

  // Math
  const priceAfterDiscount = originalPrice - (originalPrice * discountPercent) / 100;
  const priceAfterCoupon = priceAfterDiscount - (priceAfterDiscount * couponPercent) / 100;
  const taxAmount = (priceAfterCoupon * taxPercent) / 100;
  const finalPrice = priceAfterCoupon + taxAmount;
  const totalSavings = originalPrice - priceAfterCoupon;
  const effectiveDiscountRate = originalPrice > 0 ? (totalSavings / originalPrice) * 100 : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Inputs */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Tag className="w-5 h-5 text-blue-600" />
            <span>Discount Details</span>
          </h3>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Original Retail Price ($ / ₹)
            </label>
            <input
              type="number"
              value={originalPrice}
              onChange={(e) => setOriginalPrice(Math.max(0, Number(e.target.value)))}
              className="w-full px-4 py-3 rounded-xl text-base bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-bold focus:outline-hidden focus:border-blue-500"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-slate-500">
              <span>Primary Store Discount</span>
              <span className="text-blue-600 font-bold">{discountPercent}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="90"
              step="5"
              value={discountPercent}
              onChange={(e) => setDiscountPercent(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Additional Coupon %
              </label>
              <input
                type="number"
                min="0"
                max="50"
                value={couponPercent}
                onChange={(e) => setCouponPercent(Math.max(0, Number(e.target.value)))}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Sales Tax %
              </label>
              <input
                type="number"
                min="0"
                max="30"
                value={taxPercent}
                onChange={(e) => setTaxPercent(Math.max(0, Number(e.target.value)))}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Results Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Final Net Amount You Pay
            </span>
            <div className="mt-2 text-4xl sm:text-5xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
              ${finalPrice.toFixed(2)}
            </div>

            <div className="mt-4 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                Total You Save
              </span>
              <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">
                ${totalSavings.toFixed(2)}
              </p>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                ({effectiveDiscountRate.toFixed(1)}% total effective discount)
              </span>
            </div>

            <div className="mt-6 space-y-2.5 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Original Price:</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300 font-mono">${originalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">After Initial {discountPercent}% Off:</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300 font-mono">${priceAfterDiscount.toFixed(2)}</span>
              </div>
              {couponPercent > 0 && (
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400">After Extra {couponPercent}% Coupon:</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300 font-mono">${priceAfterCoupon.toFixed(2)}</span>
                </div>
              )}
              {taxPercent > 0 && (
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400">Sales Tax ({taxPercent}%):</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300 font-mono">+${taxAmount.toFixed(2)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
