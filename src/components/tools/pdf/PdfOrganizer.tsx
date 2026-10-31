import React, { useState } from 'react';
import { PDFDocument, degrees } from 'pdf-lib';
import confetti from 'canvas-confetti';
import { FileDropzone } from '../../common/FileDropzone';
import { Download, RotateCw, Trash2, ArrowLeft, ArrowRight, CheckCircle2, RefreshCw, FileText } from 'lucide-react';

interface PageItem {
  id: string;
  originalIndex: number;
  rotation: number; // 0, 90, 180, 270
}

export const PdfOrganizer: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<PageItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const handleFilesSelected = async (files: File[]) => {
    if (files.length === 0) return;
    const selected = files[0];
    setFile(selected);
    setDownloadUrl(null);

    try {
      const buffer = await selected.arrayBuffer();
      const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const count = doc.getPageCount();

      const items: PageItem[] = [];
      for (let i = 0; i < count; i++) {
        items.push({
          id: Math.random().toString(36).substring(2, 9),
          originalIndex: i,
          rotation: 0
        });
      }
      setPages(items);
    } catch (err: any) {
      console.error(err);
      alert('Failed to read PDF pages.');
    }
  };

  const rotatePage = (index: number) => {
    const updated = [...pages];
    updated[index].rotation = (updated[index].rotation + 90) % 360;
    setPages(updated);
    setDownloadUrl(null);
  };

  const deletePage = (index: number) => {
    if (pages.length <= 1) {
      alert('A PDF must contain at least 1 page.');
      return;
    }
    const updated = [...pages];
    updated.splice(index, 1);
    setPages(updated);
    setDownloadUrl(null);
  };

  const movePage = (index: number, direction: 'left' | 'right') => {
    const target = direction === 'left' ? index - 1 : index + 1;
    if (target < 0 || target >= pages.length) return;
    const updated = [...pages];
    const [item] = updated.splice(index, 1);
    updated.splice(target, 0, item);
    setPages(updated);
    setDownloadUrl(null);
  };

  const handleExport = async () => {
    if (!file || pages.length === 0) return;
    setIsProcessing(true);

    try {
      const buffer = await file.arrayBuffer();
      const srcDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const newDoc = await PDFDocument.create();

      for (let i = 0; i < pages.length; i++) {
        const item = pages[i];
        const [copiedPage] = await newDoc.copyPages(srcDoc, [item.originalIndex]);

        if (item.rotation !== 0) {
          const currentRotation = copiedPage.getRotation().angle;
          copiedPage.setRotation(degrees((currentRotation + item.rotation) % 360));
        }

        newDoc.addPage(copiedPage);
      }

      const bytes = await newDoc.save();
      const blob = new Blob([bytes as any], { type: 'application/pdf' });
      setDownloadUrl(URL.createObjectURL(blob));
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    } catch (err: any) {
      console.error(err);
      alert('Failed to assemble organized PDF: ' + (err.message || 'Error'));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8">
      {!file ? (
        <FileDropzone
          accept="application/pdf"
          multiple={false}
          onFilesSelected={handleFilesSelected}
          title="Upload a PDF to organize pages"
          subtitle="Visually reorder pages, rotate misaligned scans, and delete unwanted pages."
        />
      ) : (
        <div className="space-y-6">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">{file.name}</h4>
                <p className="text-xs text-slate-400">
                  {pages.length} active pages remaining
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => { setFile(null); setPages([]); setDownloadUrl(null); }}
                className="px-3 py-2 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Change file
              </button>

              {downloadUrl ? (
                <a
                  href={downloadUrl}
                  download="ToolNova_Organized.pdf"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Organized PDF</span>
                </a>
              ) : (
                <button
                  onClick={handleExport}
                  disabled={isProcessing}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Saving PDF...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Save & Export PDF</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Interactive Pages Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {pages.map((p, idx) => (
              <div
                key={p.id}
                className="relative group p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 shadow-xs flex flex-col items-center transition-all"
              >
                {/* Page Number Badge */}
                <span className="absolute top-2 left-2 text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  #{idx + 1}
                </span>

                {/* Simulated / Visual PDF Page Card with rotation preview */}
                <div
                  className="w-24 h-32 my-4 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center p-2 text-center transition-transform"
                  style={{ transform: `rotate(${p.rotation}deg)` }}
                >
                  <FileText className="w-8 h-8 text-slate-400 dark:text-slate-500 mb-1" />
                  <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-300">
                    Orig. p.{p.originalIndex + 1}
                  </span>
                  {p.rotation > 0 && (
                    <span className="text-[9px] text-blue-500 font-bold">{p.rotation}&deg;</span>
                  )}
                </div>

                {/* Controls */}
                <div className="w-full flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-2 text-slate-400">
                  <button
                    onClick={() => movePage(idx, 'left')}
                    disabled={idx === 0}
                    className="p-1 rounded-md hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-20"
                    title="Move Page Left"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => rotatePage(idx)}
                    className="p-1 rounded-md hover:text-blue-600 dark:hover:text-blue-400"
                    title="Rotate 90 degrees"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deletePage(idx)}
                    className="p-1 rounded-md hover:text-rose-600 dark:hover:text-rose-400"
                    title="Delete Page"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => movePage(idx, 'right')}
                    disabled={idx === pages.length - 1}
                    className="p-1 rounded-md hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-20"
                    title="Move Page Right"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
