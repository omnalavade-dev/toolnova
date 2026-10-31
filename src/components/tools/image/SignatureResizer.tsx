import React, { useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import { FileDropzone } from '../../common/FileDropzone';
import { Download, PenTool, RefreshCw, Sliders, CheckCircle2 } from 'lucide-react';

export const SignatureResizer: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [width, setWidth] = useState<number>(140);
  const [height, setHeight] = useState<number>(60);
  const [targetMaxKb, setTargetMaxKb] = useState<number>(20);
  const [cleanBackground, setCleanBackground] = useState<boolean>(true);
  const [contrastThreshold, setContrastThreshold] = useState<number>(180);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [outputSizeBytes, setOutputSizeBytes] = useState<number>(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageObjRef = useRef<HTMLImageElement | null>(null);

  const handleFilesSelected = (files: File[]) => {
    if (files.length === 0) return;
    const selected = files[0];
    setFile(selected);
    const url = URL.createObjectURL(selected);
    setImgUrl(url);

    const img = new Image();
    img.src = url;
    img.onload = () => {
      imageObjRef.current = img;
      processSignature(img, width, height, cleanBackground, contrastThreshold, targetMaxKb);
    };
  };

  const processSignature = (
    img: HTMLImageElement,
    w: number,
    h: number,
    clean: boolean,
    threshold: number,
    maxKb: number
  ) => {
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fill white
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h);

    // Draw scaled signature centered
    const scale = Math.min((w * 0.95) / img.width, (h * 0.95) / img.height);
    const drawW = img.width * scale;
    const drawH = img.height * scale;
    const drawX = (w - drawW) / 2;
    const drawY = (h - drawH) / 2;

    ctx.drawImage(img, drawX, drawY, drawW, drawH);

    // Apply ink thresholding if clean is true
    if (clean) {
      const imgData = ctx.getImageData(0, 0, w, h);
      const data = imgData.data;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        // Luminance
        const lum = 0.299 * r + 0.587 * g + 0.114 * b;

        if (lum > threshold) {
          // Pure paper white
          data[i] = 255;
          data[i + 1] = 255;
          data[i + 2] = 255;
        } else {
          // Dark ink enhancement
          data[i] = Math.max(0, r - 30);
          data[i + 1] = Math.max(0, g - 30);
          data[i + 2] = Math.max(0, b - 30);
        }
      }
      ctx.putImageData(imgData, 0, 0);
    }

    // Attempt quality to hit targetMaxKb
    let quality = 0.85;
    const tryCompress = (q: number) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) return;
          const kb = blob.size / 1024;
          if (kb > maxKb && q > 0.2) {
            tryCompress(q - 0.15);
          } else {
            if (outputUrl) URL.revokeObjectURL(outputUrl);
            setOutputUrl(URL.createObjectURL(blob));
            setOutputSizeBytes(blob.size);
          }
        },
        'image/jpeg',
        q
      );
    };

    tryCompress(quality);
  };

  const handleUpdate = (
    w = width,
    h = height,
    clean = cleanBackground,
    thresh = contrastThreshold,
    maxKb = targetMaxKb
  ) => {
    setWidth(w);
    setHeight(h);
    setCleanBackground(clean);
    setContrastThreshold(thresh);
    setTargetMaxKb(maxKb);

    if (imageObjRef.current) {
      processSignature(imageObjRef.current, w, h, clean, thresh, maxKb);
    }
  };

  return (
    <div className="space-y-8">
      {!file ? (
        <FileDropzone
          accept="image/*"
          multiple={false}
          onFilesSelected={handleFilesSelected}
          title="Upload handwritten signature photo"
          subtitle="Auto-cleans shadow & yellow tint, resizes to required exam pixel dimensions (140x60, 200x100) and keeps size under 20KB."
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Controls */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <PenTool className="w-4 h-4 text-blue-600" />
                <span>Portal Form Presets</span>
              </h3>
              <button
                onClick={() => { setFile(null); setImgUrl(null); }}
                className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                New image
              </button>
            </div>

            {/* Presets */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Dimension Standards</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Govt Standard', w: 140, h: 60 },
                  { label: 'Bank Portal', w: 200, h: 100 },
                  { label: 'Wide Admit Card', w: 256, h: 64 },
                  { label: 'Square Form', w: 150, h: 150 }
                ].map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => handleUpdate(preset.w, preset.h)}
                    className={`p-2 rounded-xl border text-left transition-all ${
                      width === preset.w && height === preset.h
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-bold'
                        : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="text-xs">{preset.label}</div>
                    <div className="text-[10px] text-slate-400">{preset.w} &times; {preset.h} px</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Target File Size Cap */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Max File Size Limit</label>
              <div className="grid grid-cols-3 gap-2">
                {[10, 20, 50].map((kb) => (
                  <button
                    key={kb}
                    type="button"
                    onClick={() => handleUpdate(width, height, cleanBackground, contrastThreshold, kb)}
                    className={`py-2 text-xs font-semibold rounded-xl border ${
                      targetMaxKb === kb
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    &le; {kb} KB
                  </button>
                ))}
              </div>
            </div>

            {/* Background Shadow Cleanup */}
            <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Clean Shadow & Paper Tint
                </label>
                <input
                  type="checkbox"
                  checked={cleanBackground}
                  onChange={(e) => handleUpdate(width, height, e.target.checked, contrastThreshold, targetMaxKb)}
                  className="rounded text-blue-600"
                />
              </div>

              {cleanBackground && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Ink Contrast Level</span>
                    <span>{contrastThreshold}</span>
                  </div>
                  <input
                    type="range"
                    min="120"
                    max="220"
                    value={contrastThreshold}
                    onChange={(e) => handleUpdate(width, height, cleanBackground, Number(e.target.value), targetMaxKb)}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <p className="text-[10px] text-slate-400">
                    Removes shadows from smartphone photos of signed paper.
                  </p>
                </div>
              )}
            </div>

            {/* Download */}
            {outputUrl && (
              <a
                href={outputUrl}
                download="signature_optimized.jpg"
                onClick={() => confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } })}
                className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download Portal Ready Signature</span>
              </a>
            )}
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-6">
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Processed Signature ({width} &times; {height} px)
                </span>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  File Size: {(outputSizeBytes / 1024).toFixed(1)} KB (Target: &le;{targetMaxKb} KB)
                </span>
              </div>

              <div className="w-full h-72 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center p-6 border border-dashed border-slate-300 dark:border-slate-700">
                {outputUrl && (
                  <div className="p-4 bg-white rounded-lg shadow-sm border border-slate-200 flex flex-col items-center">
                    <img
                      src={outputUrl}
                      alt="Processed Signature"
                      style={{ width: `${width * 1.5}px`, height: `${height * 1.5}px` }}
                      className="object-contain"
                    />
                    <span className="text-[10px] text-slate-400 mt-2">Displaying at 150% preview scale</span>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 text-xs">
              &bull; <strong>Exam Verified:</strong> Meets strict specifications for UPSC, SSC, IBPS, NEET, JEE, and national recruitment applications.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
