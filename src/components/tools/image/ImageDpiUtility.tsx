import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { FileDropzone } from '../../common/FileDropzone';
import { Download, Maximize, RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react';

export const ImageDpiUtility: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [widthPx, setWidthPx] = useState<number>(0);
  const [heightPx, setHeightPx] = useState<number>(0);
  const [targetDpi, setTargetDpi] = useState<number>(300);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);

  const handleFilesSelected = (files: File[]) => {
    if (files.length === 0) return;
    const selected = files[0];
    setFile(selected);
    const url = URL.createObjectURL(selected);
    setImgUrl(url);

    const img = new Image();
    img.src = url;
    img.onload = () => {
      setWidthPx(img.width);
      setHeightPx(img.height);
      generateDpiImage(img, targetDpi);
    };
  };

  // Embed JFIF APP0 marker with specific DPI density into JPEG bytes
  const insertJfifDpi = (jpegBytes: Uint8Array, dpi: number): Uint8Array => {
    // Standard JFIF header with density unit 1 (dots per inch)
    const jfifHeader = [
      0xff, 0xe0, // APP0 marker
      0x00, 0x10, // Length: 16 bytes
      0x4a, 0x46, 0x49, 0x46, 0x00, // "JFIF\0"
      0x01, 0x02, // Version 1.02
      0x01, // Units: 1 = dots per inch (DPI)
      (dpi >> 8) & 0xff, dpi & 0xff, // Xdensity
      (dpi >> 8) & 0xff, dpi & 0xff, // Ydensity
      0x00, 0x00 // Thumbnail dimensions 0x0
    ];

    // Check if JFIF already present at byte 2
    if (jpegBytes[0] === 0xff && jpegBytes[1] === 0xd8) {
      if (jpegBytes[2] === 0xff && jpegBytes[3] === 0xe0) {
        // Overwrite density units and values directly
        jpegBytes[13] = 1;
        jpegBytes[14] = (dpi >> 8) & 0xff;
        jpegBytes[15] = dpi & 0xff;
        jpegBytes[16] = (dpi >> 8) & 0xff;
        jpegBytes[17] = dpi & 0xff;
        return jpegBytes;
      } else {
        // Insert APP0 marker after SOI (0xFF 0xD8)
        const combined = new Uint8Array(jpegBytes.length + jfifHeader.length);
        combined.set(jpegBytes.subarray(0, 2), 0);
        combined.set(jfifHeader, 2);
        combined.set(jpegBytes.subarray(2), 2 + jfifHeader.length);
        return combined;
      }
    }
    return jpegBytes;
  };

  const generateDpiImage = (img: HTMLImageElement, dpi: number) => {
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(img, 0, 0);

    canvas.toBlob(async (blob) => {
      if (blob) {
        const arrayBuf = await blob.arrayBuffer();
        const rawBytes = new Uint8Array(arrayBuf);
        const dpiInjectedBytes = insertJfifDpi(rawBytes, dpi);

        const finalBlob = new Blob([dpiInjectedBytes as any], { type: 'image/jpeg' });
        if (outputUrl) URL.revokeObjectURL(outputUrl);
        setOutputUrl(URL.createObjectURL(finalBlob));
      }
    }, 'image/jpeg', 0.95);
  };

  const calculatePrintSize = (px: number, dpi: number) => {
    const inches = (px / dpi).toFixed(2);
    const cm = ((px / dpi) * 2.54).toFixed(2);
    return { inches, cm };
  };

  const printW = calculatePrintSize(widthPx, targetDpi);
  const printH = calculatePrintSize(heightPx, targetDpi);

  return (
    <div className="space-y-8">
      {!file ? (
        <FileDropzone
          accept="image/*"
          multiple={false}
          onFilesSelected={handleFilesSelected}
          title="Upload image to analyze and set DPI"
          subtitle="Check print dimensions, verify 300 DPI high-resolution compliance, and export with genuine print density metadata."
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Controls */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Maximize className="w-4 h-4 text-blue-600" />
                <span>Target Print Density</span>
              </h3>
              <button
                onClick={() => { setFile(null); setImgUrl(null); }}
                className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                New image
              </button>
            </div>

            {/* DPI Radio buttons */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Choose DPI Preset</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { dpi: 72, label: '72 DPI', note: 'Standard Screen' },
                  { dpi: 96, label: '96 DPI', note: 'Windows Desktop' },
                  { dpi: 150, label: '150 DPI', note: 'Draft Printing' },
                  { dpi: 300, label: '300 DPI', note: 'Official Fine Art' }
                ].map((item) => (
                  <button
                    key={item.dpi}
                    type="button"
                    onClick={() => {
                      setTargetDpi(item.dpi);
                      const img = new Image();
                      img.src = imgUrl!;
                      img.onload = () => generateDpiImage(img, item.dpi);
                    }}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      targetDpi === item.dpi
                        ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 font-bold'
                        : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="text-xs">{item.label}</div>
                    <div className="text-[10px] text-slate-400">{item.note}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Calculated Physical Print Dimensions */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-200 block mb-1">
                Print Size at {targetDpi} DPI:
              </span>
              <div className="flex justify-between">
                <span className="text-slate-500">Inches:</span>
                <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                  {printW.inches}&quot; &times; {printH.inches}&quot;
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Centimeters:</span>
                <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                  {printW.cm} &times; {printH.cm} cm
                </span>
              </div>
            </div>

            {/* Download */}
            {outputUrl && (
              <a
                href={outputUrl}
                download={`${file.name.replace(/\.[^/.]+$/, '')}_${targetDpi}dpi.jpg`}
                onClick={() => confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } })}
                className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download {targetDpi} DPI JPEG</span>
              </a>
            )}
          </div>

          {/* Details & Compliance assessment */}
          <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-6">
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Image Resolution Overview
                </span>
                <span className="text-xs font-mono text-slate-500">
                  {widthPx} &times; {heightPx} px
                </span>
              </div>

              {/* Compliance Badge */}
              <div className={`p-4 rounded-xl border flex items-start gap-3 ${
                widthPx >= 1800 && heightPx >= 1200
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                  : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300'
              }`}>
                {widthPx >= 1800 && heightPx >= 1200 ? (
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                )}
                <div className="text-xs">
                  <span className="font-bold block mb-0.5">
                    {widthPx >= 1800 && heightPx >= 1200
                      ? 'High-Resolution 300 DPI Print Ready'
                      : 'Moderate Resolution Notice'}
                  </span>
                  <span>
                    {widthPx >= 1800 && heightPx >= 1200
                      ? `This image possesses enough native pixels to print a crisp, razor-sharp ${printW.inches}" x ${printH.inches}" photo without softening.`
                      : `At 300 DPI, this image produces a ${printW.inches}" x ${printH.inches}" physical print. Printing at larger sizes may cause pixelation.`}
                  </span>
                </div>
              </div>

              <div className="mt-6 w-full h-64 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center p-2 overflow-hidden">
                <img src={imgUrl!} alt="Preview" className="max-w-full max-h-full object-contain" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
