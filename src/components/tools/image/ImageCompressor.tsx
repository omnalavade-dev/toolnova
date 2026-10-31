import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { FileDropzone } from '../../common/FileDropzone';
import { Download, Sliders, CheckCircle2, RefreshCw, ArrowRight } from 'lucide-react';

export const ImageCompressor: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null);
  const [quality, setQuality] = useState<number>(80);
  const [maxWidth, setMaxWidth] = useState<number>(1920);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const [originalDimensions, setOriginalDimensions] = useState<{ w: number; h: number }>({ w: 0, h: 0 });
  const [compressedDimensions, setCompressedDimensions] = useState<{ w: number; h: number }>({ w: 0, h: 0 });
  const [isCompressing, setIsCompressing] = useState<boolean>(false);

  const handleFilesSelected = (files: File[]) => {
    if (files.length === 0) return;
    const selected = files[0];
    setFile(selected);
    setOriginalSize(selected.size);
    const url = URL.createObjectURL(selected);
    setOriginalUrl(url);

    const img = new Image();
    img.src = url;
    img.onload = () => {
      setOriginalDimensions({ w: img.width, h: img.height });
      setMaxWidth(img.width);
      compressImage(selected, quality, img.width);
    };
  };

  const compressImage = async (imgFile: File, q: number, maxW: number) => {
    setIsCompressing(true);
    try {
      const img = new Image();
      img.src = URL.createObjectURL(imgFile);
      await new Promise((res) => { img.onload = res; });

      let targetW = img.width;
      let targetH = img.height;

      if (targetW > maxW) {
        targetH = Math.round((maxW / targetW) * targetH);
        targetW = maxW;
      }

      const canvas = document.createElement('canvas');
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Draw with smooth bicubic scaling
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, targetW, targetH);

      // Determine output mime
      const mime = imgFile.type === 'image/png' ? 'image/png' : 'image/jpeg';
      const outputMime = q < 90 && mime === 'image/png' ? 'image/jpeg' : mime;

      canvas.toBlob(
        (blob) => {
          if (blob) {
            if (compressedUrl) URL.revokeObjectURL(compressedUrl);
            setCompressedUrl(URL.createObjectURL(blob));
            setCompressedSize(blob.size);
            setCompressedDimensions({ w: targetW, h: targetH });
          }
          setIsCompressing(false);
        },
        outputMime,
        q / 100
      );
    } catch (err) {
      console.error(err);
      setIsCompressing(false);
    }
  };

  const handleQualityChange = (newQ: number) => {
    setQuality(newQ);
    if (file) {
      compressImage(file, newQ, maxWidth);
    }
  };

  const formatSize = (bytes: number): string => {
    if (bytes >= 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    return (bytes / 1024).toFixed(1) + ' KB';
  };

  const savedPct =
    originalSize > 0 && compressedSize > 0
      ? Math.max(0, Math.round(((originalSize - compressedSize) / originalSize) * 100))
      : 0;

  return (
    <div className="space-y-8">
      {!file ? (
        <FileDropzone
          accept="image/jpeg,image/png,image/webp"
          multiple={false}
          onFilesSelected={handleFilesSelected}
          title="Upload an image to compress"
          subtitle="Supports JPG, PNG, and WebP. Adjust quality with live side-by-side preview."
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Controls Panel */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-blue-600" />
                <span>Compression Controls</span>
              </h3>
              <button
                onClick={() => { setFile(null); setOriginalUrl(null); setCompressedUrl(null); }}
                className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                New image
              </button>
            </div>

            {/* Quality Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-700 dark:text-slate-300">Image Quality</span>
                <span className="text-blue-600 dark:text-blue-400 font-bold">{quality}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={quality}
                onChange={(e) => handleQualityChange(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Smaller size (10%)</span>
                <span>Best balance (80%)</span>
                <span>Max quality (100%)</span>
              </div>
            </div>

            {/* Max Width Resize Option */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-700 dark:text-slate-300">Max Width (Pixels)</span>
                <span className="text-slate-500 font-mono">{maxWidth}px</span>
              </div>
              <input
                type="range"
                min="400"
                max={Math.max(originalDimensions.w, 800)}
                step="50"
                value={maxWidth}
                onChange={(e) => {
                  setMaxWidth(Number(e.target.value));
                  if (file) compressImage(file, quality, Number(e.target.value));
                }}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

            {/* Stats Box */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Original Size:</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">{formatSize(originalSize)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Compressed Size:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{formatSize(compressedSize)}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-200 dark:border-slate-700">
                <span className="text-slate-500">Space Saved:</span>
                <span className="font-extrabold text-blue-600 dark:text-blue-400">{savedPct}% smaller</span>
              </div>
            </div>

            {/* Download Button */}
            {compressedUrl && (
              <a
                href={compressedUrl}
                download={`ToolNova_${file.name.replace(/\.[^/.]+$/, '')}_compressed.jpg`}
                onClick={() => confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } })}
                className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download Compressed Image</span>
              </a>
            )}
          </div>

          {/* Visual Comparison Area */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
              Live Preview & Comparison
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Original Preview */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col items-center">
                <div className="w-full flex justify-between text-xs font-semibold mb-2 text-slate-500">
                  <span>Original</span>
                  <span>{originalDimensions.w} &times; {originalDimensions.h}</span>
                </div>
                {originalUrl && (
                  <div className="w-full h-64 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    <img src={originalUrl} alt="Original" className="max-w-full max-h-full object-contain" />
                  </div>
                )}
                <span className="mt-2 text-xs font-medium text-slate-600 dark:text-slate-400">
                  {formatSize(originalSize)}
                </span>
              </div>

              {/* Compressed Preview */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col items-center">
                <div className="w-full flex justify-between text-xs font-semibold mb-2 text-emerald-600 dark:text-emerald-400">
                  <span>Compressed ({savedPct}% saved)</span>
                  <span>{compressedDimensions.w} &times; {compressedDimensions.h}</span>
                </div>
                {compressedUrl && (
                  <div className="w-full h-64 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    <img src={compressedUrl} alt="Compressed" className="max-w-full max-h-full object-contain" />
                  </div>
                )}
                <span className="mt-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  {formatSize(compressedSize)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
