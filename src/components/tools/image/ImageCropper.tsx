import React, { useState, useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { FileDropzone } from '../../common/FileDropzone';
import { Download, Crop, RefreshCw, ZoomIn, RotateCw } from 'lucide-react';

export const ImageCropper: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [aspectPreset, setAspectPreset] = useState<string>('1:1');
  const [cropX, setCropX] = useState<number>(10);
  const [cropY, setCropY] = useState<number>(10);
  const [cropSize, setCropSize] = useState<number>(80); // percentage of min dimension
  const [zoom, setZoom] = useState<number>(1);
  const [croppedBlobUrl, setCroppedBlobUrl] = useState<string | null>(null);

  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const handleFilesSelected = (files: File[]) => {
    if (files.length === 0) return;
    const selected = files[0];
    setFile(selected);
    const url = URL.createObjectURL(selected);
    setImgUrl(url);

    const img = new Image();
    img.src = url;
    img.onload = () => {
      imgRef.current = img;
      renderCrop(img, aspectPreset, 10, 10, 80, 1);
    };
  };

  const renderCrop = (
    img: HTMLImageElement,
    aspect: string,
    xPct: number,
    yPct: number,
    sizePct: number,
    zoomVal: number
  ) => {
    const canvas = previewCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let targetAspect = 1;
    if (aspect === '1:1') targetAspect = 1;
    else if (aspect === '4:3') targetAspect = 4 / 3;
    else if (aspect === '16:9') targetAspect = 16 / 9;
    else if (aspect === '9:16') targetAspect = 9 / 16;
    else if (aspect === '3:2') targetAspect = 3 / 2;
    else targetAspect = img.width / img.height;

    // Determine crop window in source image coordinates
    let cropWidth = (img.width * (sizePct / 100)) / zoomVal;
    let cropHeight = cropWidth / targetAspect;

    if (cropHeight > img.height) {
      cropHeight = (img.height * (sizePct / 100)) / zoomVal;
      cropWidth = cropHeight * targetAspect;
    }

    const maxX = Math.max(0, img.width - cropWidth);
    const maxY = Math.max(0, img.height - cropHeight);

    const sx = Math.min(maxX, (maxX * xPct) / 100);
    const sy = Math.min(maxY, (maxY * yPct) / 100);

    // Canvas dimensions
    const maxCanvasDim = 800;
    canvas.width = targetAspect >= 1 ? maxCanvasDim : Math.round(maxCanvasDim * targetAspect);
    canvas.height = targetAspect >= 1 ? Math.round(maxCanvasDim / targetAspect) : maxCanvasDim;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, sx, sy, cropWidth, cropHeight, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (blob) {
        if (croppedBlobUrl) URL.revokeObjectURL(croppedBlobUrl);
        setCroppedBlobUrl(URL.createObjectURL(blob));
      }
    }, 'image/jpeg', 0.92);
  };

  const handleUpdate = (
    newAspect = aspectPreset,
    newX = cropX,
    newY = cropY,
    newSize = cropSize,
    newZoom = zoom
  ) => {
    setAspectPreset(newAspect);
    setCropX(newX);
    setCropY(newY);
    setCropSize(newSize);
    setZoom(newZoom);

    if (imgRef.current) {
      renderCrop(imgRef.current, newAspect, newX, newY, newSize, newZoom);
    }
  };

  return (
    <div className="space-y-8">
      {!file ? (
        <FileDropzone
          accept="image/*"
          multiple={false}
          onFilesSelected={handleFilesSelected}
          title="Upload an image to crop"
          subtitle="Choose aspect ratio presets (1:1, 16:9, 4:3, etc.) with real-time canvas crop."
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Controls */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Crop className="w-4 h-4 text-blue-600" />
                <span>Crop Settings</span>
              </h3>
              <button
                onClick={() => { setFile(null); setImgUrl(null); }}
                className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reset
              </button>
            </div>

            {/* Presets */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Aspect Ratio</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: '1:1', label: '1:1 (Square)' },
                  { id: '4:3', label: '4:3 (Photo)' },
                  { id: '16:9', label: '16:9 (Video)' },
                  { id: '9:16', label: '9:16 (Story)' },
                  { id: '3:2', label: '3:2 (Classic)' },
                  { id: 'free', label: 'Original' }
                ].map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleUpdate(preset.id)}
                    className={`py-2 text-xs font-semibold rounded-xl border transition-all ${
                      aspectPreset === preset.id
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sliders for Position and Size */}
            <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span>Horizontal Position (X)</span>
                  <span className="font-mono text-slate-400">{cropX}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={cropX}
                  onChange={(e) => handleUpdate(aspectPreset, Number(e.target.value), cropY, cropSize, zoom)}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span>Vertical Position (Y)</span>
                  <span className="font-mono text-slate-400">{cropY}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={cropY}
                  onChange={(e) => handleUpdate(aspectPreset, cropX, Number(e.target.value), cropSize, zoom)}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span>Crop Area Size</span>
                  <span className="font-mono text-slate-400">{cropSize}%</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="100"
                  value={cropSize}
                  onChange={(e) => handleUpdate(aspectPreset, cropX, cropY, Number(e.target.value), zoom)}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>
            </div>

            {/* Download Button */}
            {croppedBlobUrl && (
              <a
                href={croppedBlobUrl}
                download={`ToolNova_Cropped_${aspectPreset.replace(':', '_')}.jpg`}
                onClick={() => confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } })}
                className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download Cropped Photo</span>
              </a>
            )}
          </div>

          {/* Canvas Render Preview */}
          <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col items-center justify-center">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 self-start">
              Live Cropped Output
            </h4>
            <div className="w-full max-h-[460px] rounded-xl bg-slate-100 dark:bg-slate-800/60 p-4 flex items-center justify-center overflow-hidden">
              <canvas ref={previewCanvasRef} className="max-w-full max-h-[420px] object-contain rounded-lg shadow-sm" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
