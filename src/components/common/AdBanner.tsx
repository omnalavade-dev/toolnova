import React from 'react';

interface AdBannerProps {
  slotId: string;
  format?: 'horizontal' | 'rectangle' | 'vertical';
  className?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({
  slotId,
  format = 'horizontal',
  className = ''
}) => {
  // Format configurations with reserved heights to prevent Cumulative Layout Shift (CLS)
  const formatStyles = {
    horizontal: 'w-full min-h-[90px] sm:min-h-[100px] max-w-4xl mx-auto py-3',
    rectangle: 'w-full max-w-sm min-h-[250px] mx-auto py-3',
    vertical: 'w-full max-w-[280px] min-h-[500px] py-4'
  };

  return (
    <aside
      className={`my-6 text-center overflow-hidden transition-all duration-200 ${formatStyles[format]} ${className}`}
      aria-label="Advertisement Space"
    >
      <div className="relative w-full h-full rounded-xl border border-dashed border-slate-300 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40 p-4 flex flex-col items-center justify-center">
        {/* Ad identification header - Mandatory for Google AdSense compliance */}
        <div className="flex items-center justify-between w-full mb-2 px-2 text-[10px] tracking-wider uppercase font-semibold text-slate-600 dark:text-slate-400">
          <span>Advertisement</span>
          <span className="text-[10px] lowercase text-slate-600 dark:text-slate-400 font-normal">Slot: {slotId}</span>
        </div>

        {/* Ad Container Box */}
        <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-xs font-medium mb-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
            Sponsored Partner Placement
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-300 max-w-md">
            ToolNova remains 100% free and private through non-intrusive advertisements. Your files never touch these servers.
          </p>
        </div>
      </div>
    </aside>
  );
};
