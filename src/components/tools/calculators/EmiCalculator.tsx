import React, { useState } from 'react';
import { CircleDollarSign, Calendar, ChevronDown, ChevronUp } from 'lucide-react';

export const EmiCalculator: React.FC = () => {
  const [loanAmount, setLoanAmount] = useState<number>(2500000); // 25 Lakhs
  const [annualRate, setAnnualRate] = useState<number>(8.5); // 8.5%
  const [tenureYears, setTenureYears] = useState<number>(15); // 15 years
  const [showSchedule, setShowSchedule] = useState<boolean>(false);

  // EMI Formula
  const r = annualRate / 12 / 100;
  const n = tenureYears * 12;

  let emi = 0;
  let totalPayment = 0;
  let totalInterest = 0;

  if (r > 0 && n > 0 && loanAmount > 0) {
    emi = (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    totalPayment = emi * n;
    totalInterest = totalPayment - loanAmount;
  }

  const principalRatio = totalPayment > 0 ? (loanAmount / totalPayment) * 100 : 50;
  const interestRatio = totalPayment > 0 ? (totalInterest / totalPayment) * 100 : 50;

  // Generate Year-by-Year Amortization Schedule
  const generateSchedule = () => {
    const schedule = [];
    let balance = loanAmount;

    for (let yr = 1; yr <= tenureYears; yr++) {
      let yearlyInterest = 0;
      let yearlyPrincipal = 0;

      for (let m = 1; m <= 12; m++) {
        const interestForMonth = balance * r;
        const principalForMonth = emi - interestForMonth;
        yearlyInterest += interestForMonth;
        yearlyPrincipal += principalForMonth;
        balance -= principalForMonth;
      }

      schedule.push({
        year: yr,
        principal: yearlyPrincipal,
        interest: yearlyInterest,
        totalPaid: yearlyPrincipal + yearlyInterest,
        balance: Math.max(0, balance)
      });
    }

    return schedule;
  };

  const scheduleData = showSchedule ? generateSchedule() : [];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Controls */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <CircleDollarSign className="w-5 h-5 text-blue-600" />
            <span>Loan Details</span>
          </h3>

          {/* Loan Amount */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-slate-500">
              <span>Loan Amount</span>
              <span className="font-mono text-sm text-blue-600 dark:text-blue-400">
                ₹{loanAmount.toLocaleString('en-IN')}
              </span>
            </div>
            <input
              type="range"
              min="50000"
              max="20000000"
              step="50000"
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <input
              type="number"
              value={loanAmount}
              onChange={(e) => setLoanAmount(Math.max(0, Number(e.target.value)))}
              className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-mono"
            />
          </div>

          {/* Interest Rate */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-slate-500">
              <span>Annual Interest Rate (%)</span>
              <span className="font-mono text-sm text-blue-600 dark:text-blue-400">{annualRate}%</span>
            </div>
            <input
              type="range"
              min="4"
              max="22"
              step="0.1"
              value={annualRate}
              onChange={(e) => setAnnualRate(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>

          {/* Tenure */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-slate-500">
              <span>Tenure ({tenureYears} Years / {tenureYears * 12} Months)</span>
              <span className="font-mono text-sm text-blue-600 dark:text-blue-400">{tenureYears} Yrs</span>
            </div>
            <input
              type="range"
              min="1"
              max="30"
              step="1"
              value={tenureYears}
              onChange={(e) => setTenureYears(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>
        </div>

        {/* Calculated Results */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Monthly Equated Installment
            </span>
            <div className="mt-2 text-4xl sm:text-5xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
              ₹{Math.round(emi).toLocaleString('en-IN')}
              <span className="text-base text-slate-400 font-normal"> /mo</span>
            </div>

            {/* Split Visualization Bar */}
            <div className="mt-6 space-y-2">
              <div className="h-4 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex">
                <div style={{ width: `${principalRatio}%` }} className="bg-blue-600 h-full" title="Principal" />
                <div style={{ width: `${interestRatio}%` }} className="bg-violet-500 h-full" title="Interest" />
              </div>
              <div className="flex justify-between text-[11px] font-semibold">
                <span className="text-blue-600 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                  Principal ({principalRatio.toFixed(1)}%)
                </span>
                <span className="text-violet-500 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-violet-500" />
                  Total Interest ({interestRatio.toFixed(1)}%)
                </span>
              </div>
            </div>

            <div className="mt-6 space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Principal Amount:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">
                  ₹{loanAmount.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Total Interest Payable:</span>
                <span className="font-bold text-violet-600 dark:text-violet-400 font-mono">
                  ₹{Math.round(totalInterest).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Total Payment:</span>
                <span className="font-black text-slate-900 dark:text-slate-100 font-mono">
                  ₹{Math.round(totalPayment).toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowSchedule(!showSchedule)}
            className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>{showSchedule ? 'Hide Amortization Schedule' : 'View Full Amortization Schedule'}</span>
            {showSchedule ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Amortization Schedule Table */}
      {showSchedule && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-x-auto">
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-600" />
            <span>Year-by-Year Loan Repayment Breakdown</span>
          </h4>

          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                <th className="py-2.5 pr-4">Year</th>
                <th className="py-2.5 px-4">Principal Repaid</th>
                <th className="py-2.5 px-4">Interest Paid</th>
                <th className="py-2.5 px-4">Total Payment</th>
                <th className="py-2.5 pl-4 text-right">Balance Outstanding</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
              {scheduleData.map((item) => (
                <tr key={item.year} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-2.5 pr-4 font-sans font-bold text-slate-700 dark:text-slate-300">
                    Year {item.year}
                  </td>
                  <td className="py-2.5 px-4 text-blue-600 dark:text-blue-400">
                    ₹{Math.round(item.principal).toLocaleString('en-IN')}
                  </td>
                  <td className="py-2.5 px-4 text-violet-600 dark:text-violet-400">
                    ₹{Math.round(item.interest).toLocaleString('en-IN')}
                  </td>
                  <td className="py-2.5 px-4 text-slate-800 dark:text-slate-200">
                    ₹{Math.round(item.totalPaid).toLocaleString('en-IN')}
                  </td>
                  <td className="py-2.5 pl-4 text-right font-bold text-slate-700 dark:text-slate-300">
                    ₹{Math.round(item.balance).toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
