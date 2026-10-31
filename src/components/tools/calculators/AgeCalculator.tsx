import React, { useState } from 'react';
import { Calendar, Cake, Clock, Sparkles } from 'lucide-react';

export const AgeCalculator: React.FC = () => {
  const todayStr = new Date().toISOString().split('T')[0];
  const [birthDate, setBirthDate] = useState<string>('2000-01-15');
  const [targetDate, setTargetDate] = useState<string>(todayStr);

  const calculateAgeDetails = () => {
    const b = new Date(birthDate);
    const t = new Date(targetDate);

    if (isNaN(b.getTime()) || isNaN(t.getTime()) || b > t) {
      return null;
    }

    let years = t.getFullYear() - b.getFullYear();
    let months = t.getMonth() - b.getMonth();
    let days = t.getDate() - b.getDate();

    if (days < 0) {
      months--;
      // Days in previous month of target
      const prevMonth = new Date(t.getFullYear(), t.getMonth(), 0);
      days += prevMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    // Total counts
    const diffMs = t.getTime() - b.getTime();
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = years * 12 + months;
    const totalHours = totalDays * 24;
    const totalMinutes = totalHours * 60;

    // Day of birth
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const bornDayName = dayNames[b.getDay()];

    // Next Birthday calculation
    let nextBday = new Date(t.getFullYear(), b.getMonth(), b.getDate());
    if (nextBday < t) {
      nextBday = new Date(t.getFullYear() + 1, b.getMonth(), b.getDate());
    }
    const daysToNextBday = Math.ceil((nextBday.getTime() - t.getTime()) / (1000 * 60 * 60 * 24));
    const nextBdayDayName = dayNames[nextBday.getDay()];

    // Astrological Zodiac
    const getZodiac = (m: number, d: number) => {
      const dates = [20, 19, 21, 20, 21, 21, 23, 23, 23, 23, 22, 22];
      const signs = ['Capricorn', 'Aquarius', 'Pisces', 'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius'];
      return d < dates[m - 1] ? signs[m - 1] : signs[m % 12];
    };
    const zodiac = getZodiac(b.getMonth() + 1, b.getDate());

    return {
      years,
      months,
      days,
      totalMonths,
      totalWeeks,
      totalDays,
      totalHours,
      totalMinutes,
      bornDayName,
      daysToNextBday,
      nextBdayDayName,
      zodiac
    };
  };

  const results = calculateAgeDetails();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Input Form */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          <span>Enter Dates</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Date of Birth
            </label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-medium focus:outline-hidden focus:border-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Calculate Age As Of
            </label>
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-medium focus:outline-hidden focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Results Display */}
      {results ? (
        <div className="space-y-6">
          {/* Main Age Card */}
          <div className="p-8 rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 text-white shadow-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-200">
              Your Current Exact Age
            </span>
            <div className="mt-2 flex flex-wrap items-baseline gap-x-4 gap-y-2">
              <span className="text-4xl sm:text-6xl font-extrabold tracking-tight">
                {results.years}
              </span>
              <span className="text-xl sm:text-2xl text-blue-100 font-medium">years</span>

              <span className="text-3xl sm:text-4xl font-bold ml-2">
                {results.months}
              </span>
              <span className="text-lg sm:text-xl text-blue-100 font-medium">months</span>

              <span className="text-3xl sm:text-4xl font-bold ml-2">
                {results.days}
              </span>
              <span className="text-lg sm:text-xl text-blue-100 font-medium">days</span>
            </div>

            <p className="mt-4 text-xs sm:text-sm text-blue-100/90">
              You were born on a <strong className="text-white">{results.bornDayName}</strong> &bull; Astrological Sign: <strong className="text-white">{results.zodiac}</strong>
            </p>
          </div>

          {/* Secondary Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-2">
                <Cake className="w-4 h-4" />
                <span>Next Birthday</span>
              </div>
              <p className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">
                {results.daysToNextBday} <span className="text-sm font-medium text-slate-400">days</span>
              </p>
              <p className="text-xs text-slate-400 mt-1">Falls on a {results.nextBdayDayName}</p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
                <Clock className="w-4 h-4" />
                <span>Total Days Lived</span>
              </div>
              <p className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">
                {results.totalDays.toLocaleString()}
              </p>
              <p className="text-xs text-slate-400 mt-1">{results.totalWeeks.toLocaleString()} complete weeks</p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="flex items-center gap-2 text-violet-600 dark:text-violet-400 text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-4 h-4" />
                <span>Total Hours</span>
              </div>
              <p className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">
                {results.totalHours.toLocaleString()}
              </p>
              <p className="text-xs text-slate-400 mt-1">~{results.totalMinutes.toLocaleString()} minutes</p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
                <Calendar className="w-4 h-4" />
                <span>Months Milestone</span>
              </div>
              <p className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">
                {results.totalMonths} <span className="text-sm font-medium text-slate-400">months</span>
              </p>
              <p className="text-xs text-slate-400 mt-1">and {results.days} days</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-6 text-center text-rose-500 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-sm">
          Date of birth cannot be after the reference &quot;As of&quot; date.
        </div>
      )}
    </div>
  );
};
