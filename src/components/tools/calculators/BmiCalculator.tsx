import React, { useState } from 'react';
import { Activity, Heart, Info } from 'lucide-react';

export const BmiCalculator: React.FC = () => {
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState<number>(28);

  // Metric
  const [heightCm, setHeightCm] = useState<number>(175);
  const [weightKg, setWeightKg] = useState<number>(70);

  // Imperial
  const [heightFt, setHeightFt] = useState<number>(5);
  const [heightIn, setHeightIn] = useState<number>(9);
  const [weightLbs, setWeightLbs] = useState<number>(155);

  let bmi = 0;
  let idealWeightMin = 0;
  let idealWeightMax = 0;

  if (unit === 'metric') {
    const heightM = heightCm / 100;
    if (heightM > 0) {
      bmi = weightKg / (heightM * heightM);
      idealWeightMin = 18.5 * (heightM * heightM);
      idealWeightMax = 24.9 * (heightM * heightM);
    }
  } else {
    const totalInches = heightFt * 12 + heightIn;
    if (totalInches > 0) {
      bmi = (weightLbs / (totalInches * totalInches)) * 703;
      idealWeightMin = (18.5 * (totalInches * totalInches)) / 703;
      idealWeightMax = (24.9 * (totalInches * totalInches)) / 703;
    }
  }

  const getBmiCategory = (score: number) => {
    if (score < 18.5) {
      return {
        label: 'Underweight',
        color: 'text-amber-500',
        bg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800',
        advice: 'You may benefit from nutrient-dense meals and strength training to build healthy muscle mass.'
      };
    } else if (score < 25) {
      return {
        label: 'Normal / Healthy Weight',
        color: 'text-emerald-500',
        bg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800',
        advice: 'Great job! Your weight is in the optimal range associated with lower risks of metabolic and cardiovascular illness.'
      };
    } else if (score < 30) {
      return {
        label: 'Overweight',
        color: 'text-orange-500',
        bg: 'bg-orange-50 dark:bg-orange-950/40 border-orange-200 dark:border-orange-800',
        advice: 'Adopting consistent aerobic activity and reducing refined sugars can help bring your BMI toward the healthy baseline.'
      };
    } else {
      return {
        label: 'Obese',
        color: 'text-rose-500',
        bg: 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900',
        advice: 'Consulting with a licensed healthcare provider or registered dietitian is recommended to formulate a sustainable wellness strategy.'
      };
    }
  };

  const category = getBmiCategory(bmi);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Inputs */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" />
              <span>Body Metrics</span>
            </h3>

            {/* Metric / Imperial toggle */}
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setUnit('metric')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  unit === 'metric'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs'
                    : 'text-slate-500'
                }`}
              >
                Metric (kg/cm)
              </button>
              <button
                type="button"
                onClick={() => setUnit('imperial')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  unit === 'imperial'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs'
                    : 'text-slate-500'
                }`}
              >
                Imperial (lbs/ft)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Age</label>
              <input
                type="number"
                min="10"
                max="100"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold"
              />
            </div>
          </div>

          {unit === 'metric' ? (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-500">
                  <span>Height: {heightCm} cm</span>
                  <span className="text-slate-400 font-normal">({(heightCm / 100).toFixed(2)} m)</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="230"
                  value={heightCm}
                  onChange={(e) => setHeightCm(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-500">
                  <span>Weight: {weightKg} kg</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="180"
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Feet</span>
                  <input
                    type="number"
                    min="3"
                    max="7"
                    value={heightFt}
                    onChange={(e) => setHeightFt(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold"
                  />
                </div>
                <div className="space-y-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Inches</span>
                  <input
                    type="number"
                    min="0"
                    max="11"
                    value={heightIn}
                    onChange={(e) => setHeightIn(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Weight (lbs)</span>
                <input
                  type="number"
                  min="60"
                  max="400"
                  value={weightLbs}
                  onChange={(e) => setWeightLbs(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold"
                />
              </div>
            </div>
          )}
        </div>

        {/* Results Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Your Body Mass Index (BMI)
            </span>
            <div className="mt-2 text-5xl sm:text-6xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
              {bmi.toFixed(1)}
            </div>

            {/* Category Banner */}
            <div className={`mt-4 p-4 rounded-2xl border ${category.bg} flex items-start gap-3`}>
              <Heart className={`w-5 h-5 shrink-0 mt-0.5 ${category.color}`} />
              <div>
                <span className={`text-sm font-bold block ${category.color}`}>
                  {category.label}
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                  {category.advice}
                </p>
              </div>
            </div>

            {/* Ideal Weight Range */}
            <div className="mt-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-1">
              <span className="font-bold text-slate-700 dark:text-slate-200 block mb-1">
                Healthy Weight Target for Your Height:
              </span>
              <p className="text-blue-600 dark:text-blue-400 font-mono font-bold text-sm">
                {unit === 'metric'
                  ? `${idealWeightMin.toFixed(1)} kg - ${idealWeightMax.toFixed(1)} kg`
                  : `${idealWeightMin.toFixed(1)} lbs - ${idealWeightMax.toFixed(1)} lbs`}
              </p>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 shrink-0" />
            <span>BMI is an anthropometric screening indicator and does not directly measure body fat percentage.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
