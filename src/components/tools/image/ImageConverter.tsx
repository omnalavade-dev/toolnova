import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { FileDropzone } from '../../common/FileDropzone';
import { Download, RefreshCw, FileCode, CheckCircle2 } from 'lucide-react';

export const ImageConverter: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [targetMime, setTargetMime] = useState<string>('image/webp');
  const [targetExt, setTargetExt] = useState<string>('webp');
  const [quality, setQuality] = useState<number>(90);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [outputSize, setOutputSize] = useState<number>(0);
  const [isConverting, setIsConverting] = useState<boolean>(false);

  const convertImage = (sourceUrl: string, mime: string, q: number) => {
    setIsConverting(true);
    const img = new Image();
    img.src = sourceUrl;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      if (mime === 'image/jpeg') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(img, 0, 0);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            if (outputUrl) URL.revokeObjectURL(outputUrl);
            setOutputUrl(URL.createObjectURL(blob));
            setOutputSize(blob.size);
            confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
          }
          setIsConverting(false);
        },
        mime,
        q / 100
      );
    };
  };

  const handleFilesSelected = (files: File[]) => {
    if (files.length === 0) return;
    const selected = files[0];
    setFile(selected);
    const url = URL.createObjectURL(selected);
    setImgUrl(url);
    convertImage(url, targetMime, quality);
  };

  const formats = [
    { mime: 'image/webp', ext: 'webp', name: 'WebP (Modern Web Standard)' },
    { mime: 'image/jpeg', ext: 'jpg', name: 'JPG / JPEG (Universal Photo)' },
    { mime: 'image/png', ext: 'png', name: 'PNG (Lossless Transparent)' }
  ];

  return (
    <div className="space-y-8">
      {!file ? (
        <FileDropzone
          accept="image/*"
          multiple={false}
          onFilesSelected={handleFilesSelected}
          title="Upload image to convert format"
          subtitle="Batch convert between modern WebP, JPG, and PNG with visual quality control."
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <FileCode className="w-4 h-4 text-blue-600" />
                <span>Conversion Target</span>
              </h3>
              <button
                onClick={() => { setFile(null); setImgUrl(null); }}
                className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Change file
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Choose Output Format</label>
              <div className="space-y-2">
                {formats.map((fmt) => (
                  <button
                    key={fmt.ext}
                    type="button"
                    onClick={() => {
                      setTargetMime(fmt.mime);
                      setTargetExt(fmt.ext);
                      if (imgUrl) convertImage(imgUrl, fmt.mime, quality);
                    }}
                    className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                      targetExt === fmt.ext
                        ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 font-bold'
                        : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <span className="text-xs block">{fmt.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">.{fmt.ext}</span>
                    </div>
                    {targetExt === fmt.ext && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                  </button>
                ))}
              </div>
            </div>

            {targetMime !== 'image/png' && (
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span>Compression Quality</span>
                  <span className="text-blue-600 font-bold">{quality}%</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="100"
                  step="5"
                  value={quality}
                  onChange={(e) => {
                    const q = Number(e.target.value);
                    setQuality(q);
                    if (imgUrl) convertImage(imgUrl, targetMime, q);
                  }}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>
            )}

            {outputUrl && (
              <a
                href={outputUrl}
                download={`${file.name.replace(/\.[^/.]+$/, '')}_converted.${targetExt}`}
                className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download .{targetExt.toUpperCase()} Image</span>
              </a>
            )}
          </div>

          <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-6">
            <div>
              <div className="flex justify-between text-xs text-slate-500 mb-4">
                <span>Original: {(file.size / 1024).toFixed(1)} KB</span>
                <span className="font-bold text-emerald-600">
                  New Format: {(outputSize / 1024).toFixed(1)} KB
                </span>
              </div>
              <div className="w-full h-80 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center overflow-hidden p-2">
                <img src={outputUrl || imgUrl!} alt="Preview" className="max-w-full max-h-full object-contain" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
