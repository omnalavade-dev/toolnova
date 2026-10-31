import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { FileDropzone } from '../../common/FileDropzone';
import { Download, RefreshCw, CheckCircle2 } from 'lucide-react';

export const JpgToPng: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [pngUrl, setPngUrl] = useState<string | null>(null);
  const [pngSize, setPngSize] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleFilesSelected = (files: File[]) => {
    if (files.length === 0) return;
    const selected = files[0];
    setFile(selected);
    const url = URL.createObjectURL(selected);
    setOriginalUrl(url);
    setPngUrl(null);

    const img = new Image();
    img.src = url;
    img.onload = () => {
      setIsProcessing(true);
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        if (blob) {
          setPngUrl(URL.createObjectURL(blob));
          setPngSize(blob.size);
          confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
        }
        setIsProcessing(false);
      }, 'image/png');
    };
  };

  return (
    <div className="space-y-8">
      {!file ? (
        <FileDropzone
          accept="image/jpeg,image/jpg"
          multiple={false}
          onFilesSelected={handleFilesSelected}
          title="Upload a JPG image to convert to PNG"
          subtitle="Converts JPEG to lossless high-fidelity PNG in your browser."
        />
      ) : (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6 max-w-2xl mx-auto">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">{file.name}</h3>
              <p className="text-xs text-slate-400">
                Original JPG ({(file.size / 1024).toFixed(1)} KB) &rarr; PNG ({(pngSize / 1024).toFixed(1)} KB)
              </p>
            </div>
            <button
              onClick={() => { setFile(null); setOriginalUrl(null); setPngUrl(null); }}
              className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Convert another
            </button>
          </div>

          <div className="w-full h-72 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center p-2 overflow-hidden">
            <img src={pngUrl || originalUrl!} alt="Converted Preview" className="max-w-full max-h-full object-contain" />
          </div>

          {pngUrl && (
            <a
              href={pngUrl}
              download={`${file.name.replace(/\.[^/.]+$/, '')}_converted.png`}
              className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download Lossless PNG</span>
            </a>
          )}
        </div>
      )}
    </div>
  );
};
