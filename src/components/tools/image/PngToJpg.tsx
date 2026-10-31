import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { FileDropzone } from '../../common/FileDropzone';
import { Download, RefreshCw, Palette } from 'lucide-react';

export const PngToJpg: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [jpgUrl, setJpgUrl] = useState<string | null>(null);
  const [jpgSize, setJpgSize] = useState<number>(0);
  const [bgColor, setBgColor] = useState<string>('#ffffff');
  const [quality, setQuality] = useState<number>(90);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const convertPngToJpg = (imgUrl: string, bg: string, q: number) => {
    setIsProcessing(true);
    const img = new Image();
    img.src = imgUrl;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Fill solid background for transparent PNG areas
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            if (jpgUrl) URL.revokeObjectURL(jpgUrl);
            setJpgUrl(URL.createObjectURL(blob));
            setJpgSize(blob.size);
            confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
          }
          setIsProcessing(false);
        },
        'image/jpeg',
        q / 100
      );
    };
  };

  const handleFilesSelected = (files: File[]) => {
    if (files.length === 0) return;
    const selected = files[0];
    setFile(selected);
    const url = URL.createObjectURL(selected);
    setOriginalUrl(url);
    convertPngToJpg(url, bgColor, quality);
  };

  return (
    <div className="space-y-8">
      {!file ? (
        <FileDropzone
          accept="image/png"
          multiple={false}
          onFilesSelected={handleFilesSelected}
          title="Upload a PNG to convert to JPG"
          subtitle="Choose custom background color fill for transparent areas and adjust compression."
        />
      ) : (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6 max-w-2xl mx-auto">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">{file.name}</h3>
              <p className="text-xs text-slate-400">
                Original PNG ({(file.size / 1024).toFixed(1)} KB) &rarr; JPG ({(jpgSize / 1024).toFixed(1)} KB)
              </p>
            </div>
            <button
              onClick={() => { setFile(null); setOriginalUrl(null); setJpgUrl(null); }}
              className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Convert another
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5" />
                <span>Background Fill</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => {
                    setBgColor(e.target.value);
                    if (originalUrl) convertPngToJpg(originalUrl, e.target.value, quality);
                  }}
                  className="w-10 h-9 rounded-lg border border-slate-200 cursor-pointer"
                />
                <span className="text-xs font-mono text-slate-500 uppercase">{bgColor}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                <span>Quality</span>
                <span className="text-blue-600 font-bold">{quality}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="100"
                step="5"
                value={quality}
                onChange={(e) => {
                  const q = Number(e.target.value);
                  setQuality(q);
                  if (originalUrl) convertPngToJpg(originalUrl, bgColor, q);
                }}
                className="w-full accent-blue-600 cursor-pointer mt-2"
              />
            </div>
          </div>

          <div className="w-full h-72 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center p-2 overflow-hidden">
            <img src={jpgUrl || originalUrl!} alt="Preview" className="max-w-full max-h-full object-contain" />
          </div>

          {jpgUrl && (
            <a
              href={jpgUrl}
              download={`${file.name.replace(/\.[^/.]+$/, '')}_converted.jpg`}
              className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download High-Quality JPG</span>
            </a>
          )}
        </div>
      )}
    </div>
  );
};
