import React, { useState, useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { FileDropzone } from '../../common/FileDropzone';
import { Download, UserCheck, RefreshCw, Grid, Image as ImageIcon } from 'lucide-react';

interface PassportPreset {
  id: string;
  name: string;
  country: string;
  widthMm: number;
  heightMm: number;
  widthPx: number;
  heightPx: number;
}

const PRESETS: PassportPreset[] = [
  { id: 'us', name: '2 x 2 inches (51x51 mm)', country: 'United States', widthMm: 51, heightMm: 51, widthPx: 600, heightPx: 600 },
  { id: 'schengen', name: '35 x 45 mm', country: 'Schengen / EU', widthMm: 35, heightMm: 45, widthPx: 413, heightPx: 531 },
  { id: 'india', name: '35 x 45 mm (Visa / Passport)', country: 'India', widthMm: 35, heightMm: 45, widthPx: 413, heightPx: 531 },
  { id: 'uk', name: '35 x 45 mm', country: 'United Kingdom', widthMm: 35, heightMm: 45, widthPx: 413, heightPx: 531 },
  { id: 'canada', name: '50 x 70 mm', country: 'Canada', widthMm: 50, heightMm: 70, widthPx: 590, heightPx: 826 }
];

export const PassportPhotoMaker: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<PassportPreset>(PRESETS[0]);
  const [bgColor, setBgColor] = useState<string>('#ffffff');
  const [showGuidelines, setShowGuidelines] = useState<boolean>(true);
  const [zoom, setZoom] = useState<number>(1);
  const [posY, setPosY] = useState<number>(0);
  const [singlePhotoUrl, setSinglePhotoUrl] = useState<string | null>(null);
  const [printSheetUrl, setPrintSheetUrl] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const loadedImgRef = useRef<HTMLImageElement | null>(null);

  const handleFilesSelected = (files: File[]) => {
    if (files.length === 0) return;
    const selected = files[0];
    setFile(selected);
    const url = URL.createObjectURL(selected);
    setImgUrl(url);

    const img = new Image();
    img.src = url;
    img.onload = () => {
      loadedImgRef.current = img;
      renderPhotos(img, selectedPreset, bgColor, zoom, posY);
    };
  };

  const renderPhotos = (
    img: HTMLImageElement,
    preset: PassportPreset,
    bg: string,
    z: number,
    yOffset: number
  ) => {
    const singleCanvas = document.createElement('canvas');
    singleCanvas.width = preset.widthPx;
    singleCanvas.height = preset.heightPx;
    const sCtx = singleCanvas.getContext('2d');
    if (!sCtx) return;

    // Fill background
    sCtx.fillStyle = bg;
    sCtx.fillRect(0, 0, preset.widthPx, preset.heightPx);

    // Compute center-weighted portrait framing
    const scale = Math.max(preset.widthPx / img.width, preset.heightPx / img.height) * z;
    const drawW = img.width * scale;
    const drawH = img.height * scale;
    const drawX = (preset.widthPx - drawW) / 2;
    const drawY = (preset.heightPx - drawH) / 2 + yOffset;

    sCtx.drawImage(img, drawX, drawY, drawW, drawH);

    // Generate Single Photo Blob
    singleCanvas.toBlob((blob) => {
      if (blob) {
        if (singlePhotoUrl) URL.revokeObjectURL(singlePhotoUrl);
        setSinglePhotoUrl(URL.createObjectURL(blob));
      }
    }, 'image/jpeg', 0.95);

    // Generate Printable 4x6 inch (1200x1800 px @ 300 DPI) sheet
    const sheetCanvas = document.createElement('canvas');
    sheetCanvas.width = 1800; // 6 inches @ 300 DPI
    sheetCanvas.height = 1200; // 4 inches @ 300 DPI
    const shCtx = sheetCanvas.getContext('2d');
    if (!shCtx) return;

    // White paper background
    shCtx.fillStyle = '#ffffff';
    shCtx.fillRect(0, 0, sheetCanvas.width, sheetCanvas.height);

    // Grid layout: 2 rows x 3 columns or 2 rows x 4 columns based on size
    const cols = preset.widthPx > 500 ? 3 : 4;
    const rows = 2;
    const gapX = (sheetCanvas.width - cols * preset.widthPx) / (cols + 1);
    const gapY = (sheetCanvas.height - rows * preset.heightPx) / (rows + 1);

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = gapX + c * (preset.widthPx + gapX);
        const y = gapY + r * (preset.heightPx + gapY);

        // Draw photo
        shCtx.drawImage(singleCanvas, x, y, preset.widthPx, preset.heightPx);

        // Light cutting border guidelines
        shCtx.strokeStyle = '#cbd5e1';
        shCtx.lineWidth = 1;
        shCtx.strokeRect(x, y, preset.widthPx, preset.heightPx);
      }
    }

    sheetCanvas.toBlob((blob) => {
      if (blob) {
        if (printSheetUrl) URL.revokeObjectURL(printSheetUrl);
        setPrintSheetUrl(URL.createObjectURL(blob));
      }
    }, 'image/jpeg', 0.95);

    // Render interactive canvas with optional guideline overlay
    const displayCanvas = canvasRef.current;
    if (displayCanvas) {
      displayCanvas.width = preset.widthPx;
      displayCanvas.height = preset.heightPx;
      const dCtx = displayCanvas.getContext('2d');
      if (dCtx) {
        dCtx.drawImage(singleCanvas, 0, 0);

        if (showGuidelines) {
          // Biometric head oval and eye line overlay
          dCtx.strokeStyle = 'rgba(59, 130, 246, 0.7)';
          dCtx.lineWidth = 2;
          dCtx.setLineDash([6, 6]);

          // Eye level line (~55% from bottom)
          const eyeY = preset.heightPx * 0.42;
          dCtx.beginPath();
          dCtx.moveTo(0, eyeY);
          dCtx.lineTo(preset.widthPx, eyeY);
          dCtx.stroke();

          // Chin level line (~18% from bottom)
          const chinY = preset.heightPx * 0.82;
          dCtx.beginPath();
          dCtx.moveTo(0, chinY);
          dCtx.lineTo(preset.widthPx, chinY);
          dCtx.stroke();

          // Head Oval
          dCtx.beginPath();
          dCtx.ellipse(
            preset.widthPx / 2,
            preset.heightPx * 0.48,
            preset.widthPx * 0.28,
            preset.heightPx * 0.33,
            0,
            0,
            2 * Math.PI
          );
          dCtx.stroke();
          dCtx.setLineDash([]);
        }
      }
    }
  };

  const handleUpdate = (
    p = selectedPreset,
    bg = bgColor,
    z = zoom,
    y = posY
  ) => {
    setSelectedPreset(p);
    setBgColor(bg);
    setZoom(z);
    setPosY(y);
    if (loadedImgRef.current) {
      renderPhotos(loadedImgRef.current, p, bg, z, y);
    }
  };

  useEffect(() => {
    if (loadedImgRef.current) {
      renderPhotos(loadedImgRef.current, selectedPreset, bgColor, zoom, posY);
    }
  }, [showGuidelines]);

  return (
    <div className="space-y-8">
      {!file ? (
        <FileDropzone
          accept="image/*"
          multiple={false}
          onFilesSelected={handleFilesSelected}
          title="Upload photo for Passport / Visa Maker"
          subtitle="Generate US 2x2 inch, Schengen 35x45mm, India, or UK biometric photos and printable 4x6 print sheets."
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Controls */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-blue-600" />
                <span>Passport Specifications</span>
              </h3>
              <button
                onClick={() => { setFile(null); setImgUrl(null); }}
                className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                New photo
              </button>
            </div>

            {/* Presets List */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Country & Size</label>
              <div className="space-y-1.5">
                {PRESETS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleUpdate(p, bgColor, zoom, posY)}
                    className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                      selectedPreset.id === p.id
                        ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 font-semibold'
                        : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <span className="text-xs block font-bold">{p.country}</span>
                      <span className="text-[11px] text-slate-400">{p.name}</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">{p.widthPx}&times;{p.heightPx}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Background Color */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Background Tone</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { name: 'Pure White', hex: '#ffffff' },
                  { name: 'Light Blue', hex: '#dbeafe' },
                  { name: 'Light Gray', hex: '#f1f5f9' }
                ].map((bg) => (
                  <button
                    key={bg.hex}
                    type="button"
                    onClick={() => handleUpdate(selectedPreset, bg.hex, zoom, posY)}
                    className={`py-2 text-xs rounded-xl border font-medium flex items-center justify-center gap-1.5 ${
                      bgColor === bg.hex
                        ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <span className="w-3 h-3 rounded-full border border-slate-300" style={{ backgroundColor: bg.hex }}></span>
                    <span>{bg.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Zoom and Vertical Align */}
            <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span>Zoom / Face Scale</span>
                  <span className="font-mono text-slate-400">{zoom.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min="0.7"
                  max="1.8"
                  step="0.05"
                  value={zoom}
                  onChange={(e) => handleUpdate(selectedPreset, bgColor, Number(e.target.value), posY)}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span>Vertical Position</span>
                  <span className="font-mono text-slate-400">{posY}px</span>
                </div>
                <input
                  type="range"
                  min="-150"
                  max="150"
                  step="5"
                  value={posY}
                  onChange={(e) => handleUpdate(selectedPreset, bgColor, zoom, Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="guide-check"
                  checked={showGuidelines}
                  onChange={(e) => setShowGuidelines(e.target.checked)}
                  className="rounded text-blue-600"
                />
                <label htmlFor="guide-check" className="text-xs text-slate-600 dark:text-slate-300 cursor-pointer">
                  Show Biometric Oval & Eye Level Guides
                </label>
              </div>
            </div>

            {/* Action Downloads */}
            <div className="space-y-2 pt-2">
              {singlePhotoUrl && (
                <a
                  href={singlePhotoUrl}
                  download={`ToolNova_${selectedPreset.country}_Passport_Photo.jpg`}
                  onClick={() => confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } })}
                  className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Single Photo ({selectedPreset.widthMm}&times;{selectedPreset.heightMm}mm)</span>
                </a>
              )}

              {printSheetUrl && (
                <a
                  href={printSheetUrl}
                  download={`ToolNova_${selectedPreset.country}_Print_Sheet_4x6.jpg`}
                  onClick={() => confetti({ particleCount: 65, spread: 70, origin: { y: 0.7 } })}
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Grid className="w-4 h-4" />
                  <span>Download Printable 4x6 Sheet (6-8 Photos)</span>
                </a>
              )}
            </div>
          </div>

          {/* Interactive Preview Canvas */}
          <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col items-center justify-center">
            <div className="w-full flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Official Biometric View ({selectedPreset.country})
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-600 font-semibold">
                300 DPI High-Res Print Ready
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/60 max-h-[460px] flex items-center justify-center overflow-hidden">
              <canvas ref={canvasRef} className="max-h-[380px] object-contain rounded-lg shadow-md" />
            </div>

            <p className="mt-4 text-[11px] text-slate-400 text-center max-w-md">
              Align the subject&apos;s face inside the dashed oval. The top line indicates recommended eye height, and the bottom line marks the chin level.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
