import React, { useState } from 'react';
import { Percent, ArrowRight } from 'lucide-react';

export const PercentageCalculator: React.FC = () => {
  // Mode 1: What is X% of Y?
  const [m1X, setM1X] = useState<number>(15);
  const [m1Y, setM1Y] = useState<number>(200);

  // Mode 2: X is what % of Y?
  const [m2X, setM2X] = useState<number>(45);
  const [m2Y, setM2Y] = useState<number>(180);

  // Mode 3: Percentage Change from X to Y
  const [m3X, setM3X] = useState<number>(80);
  const [m3Y, setM3Y] = useState<number>(100);

  // Mode 4: Add or Subtract %
  const [m4X, setM4X] = useState<number>(250);
  const [m4Pct, setM4Pct] = useState<number>(10);
  const [m4Op, setM4Op] = useState<'add' | 'sub'>('add');

  const r1 = (m1X * m1Y) / 100;
  const r2 = m2Y !== 0 ? (m2X / m2Y) * 100 : 0;
  const r3 = m3X !== 0 ? ((m3Y - m3X) / m3X) * 100 : 0;
  const r4 = m4Op === 'add' ? m4X + (m4X * m4Pct) / 100 : m4X - (m4X * m4Pct) / 100;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Mode 1 */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
          <Percent className="w-4 h-4 text-blue-600" />
          <span>What is X% of Y?</span>
        </h3>
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm text-slate-500">What is</span>
          <input
            type="number"
            value={m1X}
            onChange={(e) => setM1X(Number(e.target.value))}
            className="w-24 px-3 py-2 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-bold text-center"
          />
          <span className="text-sm text-slate-500">% of</span>
          <input
            type="number"
            value={m1Y}
            onChange={(e) => setM1Y(Number(e.target.value))}
            className="w-28 px-3 py-2 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-bold text-center"
          />
          <ArrowRight className="w-4 h-4 text-slate-400" />
          <div className="px-4 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800">
            <span className="text-base font-extrabold text-blue-600 dark:text-blue-400 font-mono">
              {r1.toFixed(2)}
            </span>
          </div>
        </div>
        <p className="text-[11px] text-slate-400 mt-3">
          Formula: ({m1X} &times; {m1Y}) &divide; 100 = {r1.toFixed(2)}
        </p>
      </div>

      {/* Mode 2 */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
          <Percent className="w-4 h-4 text-indigo-600" />
          <span>X is what percent of Y?</span>
        </h3>
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="number"
            value={m2X}
            onChange={(e) => setM2X(Number(e.target.value))}
            className="w-28 px-3 py-2 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-bold text-center"
          />
          <span className="text-sm text-slate-500">is what % of</span>
          <input
            type="number"
            value={m2Y}
            onChange={(e) => setM2Y(Number(e.target.value))}
            className="w-28 px-3 py-2 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-bold text-center"
          />
          <ArrowRight className="w-4 h-4 text-slate-400" />
          <div className="px-4 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800">
            <span className="text-base font-extrabold text-indigo-600 dark:text-indigo-400 font-mono">
              {r2.toFixed(2)}%
            </span>
          </div>
        </div>
        <p className="text-[11px] text-slate-400 mt-3">
          Formula: ({m2X} &divide; {m2Y}) &times; 100 = {r2.toFixed(2)}%
        </p>
      </div>

      {/* Mode 3 */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
          <Percent className="w-4 h-4 text-emerald-600" />
          <span>Percentage Increase / Decrease</span>
        </h3>
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm text-slate-500">From</span>
          <input
            type="number"
            value={m3X}
            onChange={(e) => setM3X(Number(e.target.value))}
            className="w-28 px-3 py-2 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-bold text-center"
          />
          <span className="text-sm text-slate-500">to</span>
          <input
            type="number"
            value={m3Y}
            onChange={(e) => setM3Y(Number(e.target.value))}
            className="w-28 px-3 py-2 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-bold text-center"
          />
          <ArrowRight className="w-4 h-4 text-slate-400" />
          <div className={`px-4 py-2 rounded-xl border ${
            r3 >= 0
              ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800 text-emerald-600'
              : 'bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-800 text-rose-600'
          }`}>
            <span className="text-base font-extrabold font-mono">
              {r3 >= 0 ? `+${r3.toFixed(2)}% (Increase)` : `${r3.toFixed(2)}% (Decrease)`}
            </span>
          </div>
        </div>
      </div>

      {/* Mode 4 */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
          <Percent className="w-4 h-4 text-violet-600" />
          <span>Add or Subtract Percentage</span>
        </h3>
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="number"
            value={m4X}
            onChange={(e) => setM4X(Number(e.target.value))}
            className="w-28 px-3 py-2 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-bold text-center"
          />
          <select
            value={m4Op}
            onChange={(e) => setM4Op(e.target.value as any)}
            className="px-3 py-2 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold"
          >
            <option value="add">+ Add</option>
            <option value="sub">- Subtract</option>
          </select>
          <input
            type="number"
            value={m4Pct}
            onChange={(e) => setM4Pct(Number(e.target.value))}
            className="w-20 px-3 py-2 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-bold text-center"
          />
          <span className="text-sm text-slate-500">%</span>
          <ArrowRight className="w-4 h-4 text-slate-400" />
          <div className="px-4 py-2 rounded-xl bg-violet-50 dark:bg-violet-950/50 border border-violet-200 dark:border-violet-800">
            <span className="text-base font-extrabold text-violet-600 dark:text-violet-400 font-mono">
              {r4.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
