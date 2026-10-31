import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import confetti from 'canvas-confetti';
import { FileDropzone } from '../../common/FileDropzone';
import { Download, Trash2, ArrowUp, ArrowDown, Settings, CheckCircle2, RefreshCw } from 'lucide-react';

interface ImageItem {
  id: string;
  file: File;
  previewUrl: string;
  name: string;
  sizeFormatted: string;
}

export const JpgToPdf: React.FC = () => {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [pageSize, setPageSize] = useState<'A4' | 'Letter' | 'Fit'>('A4');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape' | 'auto'>('auto');
  const [margin, setMargin] = useState<number>(18); // points
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const handleFilesSelected = (files: File[]) => {
    const newItems: ImageItem[] = files.map((file) => ({
      id: Math.random().toString(36).substring(2, 9),
      file,
      previewUrl: URL.createObjectURL(file),
      name: file.name,
      sizeFormatted: (file.size / 1024).toFixed(1) + ' KB'
    }));
    setImages((prev) => [...prev, ...newItems]);
    setDownloadUrl(null);
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= images.length) return;
    const updated = [...images];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);
    setImages(updated);
    setDownloadUrl(null);
  };

  const removeItem = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
    setDownloadUrl(null);
  };

  const generatePdf = async () => {
    if (images.length === 0) return;
    setIsProcessing(true);
    setProgress(10);

    try {
      const pdfDoc = await PDFDocument.create();

      // Page dimensions standard in PDF points (72 points = 1 inch)
      const pageDims = {
        A4: { width: 595.28, height: 841.89 },
        Letter: { width: 612.0, height: 792.0 }
      };

      for (let i = 0; i < images.length; i++) {
        const item = images[i];
        const arrayBuffer = await item.file.arrayBuffer();

        let embeddedImage;
        const isPng = item.file.type === 'image/png' || item.name.toLowerCase().endsWith('.png');

        if (isPng) {
          try {
            embeddedImage = await pdfDoc.embedPng(arrayBuffer);
          } catch {
            embeddedImage = await pdfDoc.embedJpg(arrayBuffer);
          }
        } else {
          try {
            embeddedImage = await pdfDoc.embedJpg(arrayBuffer);
          } catch {
            // fallback canvas conversion for WebP or other formats
            const img = new Image();
            img.src = item.previewUrl;
            await new Promise((resolve) => { img.onload = resolve; });
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0);
            const jpegDataUrl = canvas.toDataURL('image/jpeg', 0.92);
            const rawBytes = Uint8Array.from(atob(jpegDataUrl.split(',')[1]), c => c.charCodeAt(0));
            embeddedImage = await pdfDoc.embedJpg(rawBytes);
          }
        }

        const imgWidth = embeddedImage.width;
        const imgHeight = embeddedImage.height;

        let targetPageWidth = imgWidth;
        let targetPageHeight = imgHeight;

        if (pageSize !== 'Fit') {
          const dims = pageDims[pageSize];
          let isLandscape = orientation === 'landscape';
          if (orientation === 'auto') {
            isLandscape = imgWidth > imgHeight;
          }

          targetPageWidth = isLandscape ? Math.max(dims.width, dims.height) : Math.min(dims.width, dims.height);
          targetPageHeight = isLandscape ? Math.min(dims.width, dims.height) : Math.max(dims.width, dims.height);
        }

        const page = pdfDoc.addPage([targetPageWidth, targetPageHeight]);

        // Calculate fitted image dimensions with margins
        const availableW = targetPageWidth - margin * 2;
        const availableH = targetPageHeight - margin * 2;

        const scale = Math.min(availableW / imgWidth, availableH / imgHeight, 1);
        const drawW = imgWidth * scale;
        const drawH = imgHeight * scale;

        const drawX = margin + (availableW - drawW) / 2;
        const drawY = margin + (availableH - drawH) / 2;

        page.drawImage(embeddedImage, {
          x: drawX,
          y: drawY,
          width: drawW,
          height: drawH
        });

        setProgress(Math.round(((i + 1) / images.length) * 85));
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setProgress(100);
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
    } catch (err: any) {
      console.error('Failed to create PDF:', err);
      alert('Error creating PDF: ' + (err.message || 'Unknown error occurred.'));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Upload Zone */}
      <FileDropzone
        accept="image/jpeg,image/png,image/webp"
        multiple={true}
        onFilesSelected={handleFilesSelected}
        title="Upload JPG, PNG, or WebP images"
        subtitle="You can add multiple photos. Drag to arrange order before converting."
      />

      {images.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Images List and Reordering */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                Selected Images ({images.length})
              </h3>
              <button
                onClick={() => setImages([])}
                className="text-xs text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1"
              >
                Clear all
              </button>
            </div>

            <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
              {images.map((img, idx) => (
                <div
                  key={img.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <span className="w-6 h-6 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <img
                      src={img.previewUrl}
                      alt={img.name}
                      className="w-12 h-12 object-cover rounded-lg border border-slate-200 dark:border-slate-700 shrink-0"
                    />
                    <div className="truncate">
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {img.name}
                      </p>
                      <p className="text-[11px] text-slate-400">{img.sizeFormatted}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => moveItem(idx, 'up')}
                      disabled={idx === 0}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30"
                      title="Move Up"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => moveItem(idx, 'down')}
                      disabled={idx === images.length - 1}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30"
                      title="Move Down"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => removeItem(img.id)}
                      className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Options Panel & Action */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
            <div className="flex items-center gap-2 text-slate-800 dark:text-slate-100 font-bold text-sm">
              <Settings className="w-4 h-4 text-blue-600" />
              <span>PDF Settings</span>
            </div>

            {/* Page Size */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Page Format</label>
              <div className="grid grid-cols-3 gap-2">
                {(['A4', 'Letter', 'Fit'] as const).map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => { setPageSize(size); setDownloadUrl(null); }}
                    className={`py-2 text-xs font-semibold rounded-xl border transition-all ${
                      pageSize === size
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                    }`}
                  >
                    {size === 'Fit' ? 'Fit Image' : size}
                  </button>
                ))}
              </div>
            </div>

            {/* Orientation */}
            {pageSize !== 'Fit' && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Orientation</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['auto', 'portrait', 'landscape'] as const).map((orient) => (
                    <button
                      key={orient}
                      type="button"
                      onClick={() => { setOrientation(orient); setDownloadUrl(null); }}
                      className={`py-2 text-xs font-semibold capitalize rounded-xl border transition-all ${
                        orientation === orient
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400'
                          : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                      }`}
                    >
                      {orient}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Margins */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Margins</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'None', val: 0 },
                  { label: 'Small', val: 18 },
                  { label: 'Standard', val: 36 }
                ].map((m) => (
                  <button
                    key={m.label}
                    type="button"
                    onClick={() => { setMargin(m.val); setDownloadUrl(null); }}
                    className={`py-2 text-xs font-semibold rounded-xl border transition-all ${
                      margin === m.val
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Convert or Download Button */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
              {downloadUrl ? (
                <div className="space-y-3">
                  <a
                    href={downloadUrl}
                    download="ToolNova_Converted.pdf"
                    className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download PDF Document</span>
                  </a>
                  <button
                    onClick={() => setDownloadUrl(null)}
                    className="w-full py-2 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center justify-center gap-1"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Change Settings & Re-generate</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={generatePdf}
                  disabled={isProcessing}
                  className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Creating PDF ({progress}%)...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Generate PDF Now</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
