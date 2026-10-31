import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { FileDropzone } from '../../common/FileDropzone';
import { Download, Scaling, Lock, Unlock, RefreshCw, CheckCircle2 } from 'lucide-react';

export const ImageResizer: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [origW, setOrigW] = useState<number>(0);
  const [origH, setOrigH] = useState<number>(0);
  const [targetW, setTargetW] = useState<number>(0);
  const [targetH, setTargetH] = useState<number>(0);
  const [lockAspect, setLockAspect] = useState<boolean>(true);
  const [format, setFormat] = useState<'image/jpeg' | 'image/png' | 'image/webp'>('image/jpeg');
  const [resizedUrl, setResizedUrl] = useState<string | null>(null);
  const [resizedSize, setResizedSize] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleFilesSelected = (files: File[]) => {
    if (files.length === 0) return;
    const selected = files[0];
    setFile(selected);
    const url = URL.createObjectURL(selected);
    setOriginalUrl(url);
    setResizedUrl(null);

    const img = new Image();
    img.src = url;
    img.onload = () => {
      setOrigW(img.width);
      setOrigH(img.height);
      setTargetW(img.width);
      setTargetH(img.height);
    };
  };

  const handleWidthChange = (val: number) => {
    setTargetW(val);
    if (lockAspect && origW > 0) {
      setTargetH(Math.round((val / origW) * origH));
    }
  };

  const handleHeightChange = (val: number) => {
    setTargetH(val);
    if (lockAspect && origH > 0) {
      setTargetW(Math.round((val / origH) * origW));
    }
  };

  const applyPercent = (pct: number) => {
    const newW = Math.round((origW * pct) / 100);
    const newH = Math.round((origH * pct) / 100);
    setTargetW(newW);
    setTargetH(newH);
  };

  const handleResize = () => {
    if (!file || targetW <= 0 || targetH <= 0) return;
    setIsProcessing(true);

    const img = new Image();
    img.src = originalUrl!;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, targetW, targetH);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            if (resizedUrl) URL.revokeObjectURL(resizedUrl);
            setResizedUrl(URL.createObjectURL(blob));
            setResizedSize(blob.size);
            confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
          }
          setIsProcessing(false);
        },
        format,
        0.92
      );
    };
  };

  return (
    <div className="space-y-8">
      {!file ? (
        <FileDropzone
          accept="image/*"
          multiple={false}
          onFilesSelected={handleFilesSelected}
          title="Upload an image to resize"
          subtitle="Change pixel dimensions with aspect ratio lock or scale percentages."
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Settings Panel */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Scaling className="w-4 h-4 text-blue-600" />
                <span>Resize Dimensions</span>
              </h3>
              <button
                onClick={() => { setFile(null); setOriginalUrl(null); setResizedUrl(null); }}
                className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Change image
              </button>
            </div>

            {/* Quick Percentage Presets */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Quick Scale</label>
              <div className="grid grid-cols-5 gap-1.5">
                {[25, 50, 75, 150, 200].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => applyPercent(pct)}
                    className="py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-blue-500 text-xs font-medium text-slate-700 dark:text-slate-300"
                  >
                    {pct}%
                  </button>
                ))}
              </div>
            </div>

            {/* Width and Height Inputs with Lock */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Exact Dimensions</span>
                <button
                  type="button"
                  onClick={() => setLockAspect(!lockAspect)}
                  className={`text-xs flex items-center gap-1 px-2 py-0.5 rounded-md ${
                    lockAspect
                      ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400'
                      : 'bg-slate-100 text-slate-500 dark:bg-slate-800'
                  }`}
                >
                  {lockAspect ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                  <span>{lockAspect ? 'Aspect Locked' : 'Unlocked'}</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <span className="text-[11px] text-slate-400">Width (px)</span>
                  <input
                    type="number"
                    value={targetW}
                    onChange={(e) => handleWidthChange(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[11px] text-slate-400">Height (px)</span>
                  <input
                    type="number"
                    value={targetH}
                    onChange={(e) => handleHeightChange(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Output Format */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Target Format</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'image/jpeg', name: 'JPG' },
                  { id: 'image/png', name: 'PNG' },
                  { id: 'image/webp', name: 'WebP' }
                ].map((fmt) => (
                  <button
                    key={fmt.id}
                    type="button"
                    onClick={() => setFormat(fmt.id as any)}
                    className={`py-2 text-xs font-semibold rounded-xl border ${
                      format === fmt.id
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {fmt.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Execute Button */}
            <button
              onClick={handleResize}
              disabled={isProcessing}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Apply Resize ({targetW} &times; {targetH})</span>
            </button>
          </div>

          {/* Preview & Download Area */}
          <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-6">
            <div>
              <div className="flex justify-between items-center mb-4 text-xs font-semibold text-slate-500">
                <span>Original: {origW} &times; {origH} px ({(file.size / 1024).toFixed(1)} KB)</span>
                {resizedUrl && (
                  <span className="text-emerald-600 font-bold">
                    New: {targetW} &times; {targetH} px ({(resizedSize / 1024).toFixed(1)} KB)
                  </span>
                )}
              </div>

              <div className="w-full h-80 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center overflow-hidden p-2">
                <img
                  src={resizedUrl || originalUrl!}
                  alt="Preview"
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            </div>

            {resizedUrl && (
              <a
                href={resizedUrl}
                download={`ToolNova_${targetW}x${targetH}.${format.split('/')[1]}`}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Download Resized Image</span>
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
