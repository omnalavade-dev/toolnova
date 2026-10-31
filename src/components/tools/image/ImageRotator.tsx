import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { FileDropzone } from '../../common/FileDropzone';
import { Download, RotateCw, RotateCcw, FlipHorizontal, FlipVertical, RefreshCw } from 'lucide-react';

export const ImageRotator: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [rotation, setRotation] = useState<number>(0); // 0, 90, 180, 270
  const [flipH, setFlipH] = useState<boolean>(false);
  const [flipV, setFlipV] = useState<boolean>(false);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);

  const handleFilesSelected = (files: File[]) => {
    if (files.length === 0) return;
    const selected = files[0];
    setFile(selected);
    const url = URL.createObjectURL(selected);
    setImgUrl(url);
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
    renderTransform(url, 0, false, false);
  };

  const renderTransform = (srcUrl: string, rot: number, h: boolean, v: boolean) => {
    const img = new Image();
    img.src = srcUrl;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const isPerpendicular = rot === 90 || rot === 270;
      canvas.width = isPerpendicular ? img.height : img.width;
      canvas.height = isPerpendicular ? img.width : img.height;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Translate to center, rotate, scale for flip, draw
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rot * Math.PI) / 180);
      ctx.scale(h ? -1 : 1, v ? -1 : 1);
      ctx.drawImage(img, -img.width / 2, -img.height / 2);

      canvas.toBlob((blob) => {
        if (blob) {
          if (outputUrl) URL.revokeObjectURL(outputUrl);
          setOutputUrl(URL.createObjectURL(blob));
        }
      }, 'image/jpeg', 0.95);
    };
  };

  const update = (newRot: number, newH: boolean, newV: boolean) => {
    setRotation(newRot);
    setFlipH(newH);
    setFlipV(newV);
    if (imgUrl) renderTransform(imgUrl, newRot, newH, newV);
  };

  return (
    <div className="space-y-8">
      {!file ? (
        <FileDropzone
          accept="image/*"
          multiple={false}
          onFilesSelected={handleFilesSelected}
          title="Upload an image to rotate or flip"
          subtitle="Rotate 90°, 180°, or mirror horizontally and vertically with instant canvas processing."
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <RotateCw className="w-4 h-4 text-blue-600" />
                <span>Orientation Controls</span>
              </h3>
              <button
                onClick={() => { setFile(null); setImgUrl(null); }}
                className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                New image
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Rotate</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => update((rotation + 90) % 360, flipH, flipV)}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center justify-center gap-2"
                >
                  <RotateCw className="w-4 h-4 text-blue-600" />
                  <span>Rotate 90&deg; CW</span>
                </button>
                <button
                  type="button"
                  onClick={() => update((rotation + 270) % 360, flipH, flipV)}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4 text-blue-600" />
                  <span>Rotate 90&deg; CCW</span>
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Mirror Flip</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => update(rotation, !flipH, flipV)}
                  className={`p-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-2 ${
                    flipH ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/50 text-blue-600' : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <FlipHorizontal className="w-4 h-4" />
                  <span>Horizontal Flip</span>
                </button>
                <button
                  type="button"
                  onClick={() => update(rotation, flipH, !flipV)}
                  className={`p-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-2 ${
                    flipV ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/50 text-blue-600' : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <FlipVertical className="w-4 h-4" />
                  <span>Vertical Flip</span>
                </button>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-500 space-y-1">
              <p>Current Rotation: <span className="font-bold text-slate-700 dark:text-slate-300">{rotation}&deg;</span></p>
              <p>Mirror Status: <span className="font-bold text-slate-700 dark:text-slate-300">{flipH ? 'Flipped Horizontally ' : ''}{flipV ? 'Flipped Vertically' : (!flipH && !flipV ? 'Standard' : '')}</span></p>
            </div>

            {outputUrl && (
              <a
                href={outputUrl}
                download={`${file.name.replace(/\.[^/.]+$/, '')}_rotated.jpg`}
                onClick={() => confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } })}
                className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download Rotated Image</span>
              </a>
            )}
          </div>

          <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-center overflow-hidden">
            <div className="max-h-[460px] w-full flex items-center justify-center p-4">
              <img src={outputUrl || imgUrl!} alt="Rotated Preview" className="max-w-full max-h-[420px] object-contain rounded-lg shadow-sm" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
