import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import confetti from 'canvas-confetti';
import { FileDropzone } from '../../common/FileDropzone';
import { Download, Trash2, ArrowUp, ArrowDown, FileText, CheckCircle2, RefreshCw, AlertCircle } from 'lucide-react';

interface PdfFileItem {
  id: string;
  file: File;
  name: string;
  sizeFormatted: string;
  pageCount: number;
}

export const PdfMerger: React.FC = () => {
  const [pdfFiles, setPdfFiles] = useState<PdfFileItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mergedBlobUrl, setMergedBlobUrl] = useState<string | null>(null);
  const [outputFileName, setOutputFileName] = useState('ToolNova_Merged.pdf');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFilesSelected = async (files: File[]) => {
    setErrorMessage(null);
    const newItems: PdfFileItem[] = [];

    for (const file of files) {
      try {
        const buffer = await file.arrayBuffer();
        const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
        newItems.push({
          id: Math.random().toString(36).substring(2, 9),
          file,
          name: file.name,
          sizeFormatted: (file.size / 1024).toFixed(1) + ' KB',
          pageCount: doc.getPageCount()
        });
      } catch (err: any) {
        console.error('Error reading PDF file:', err);
        setErrorMessage(`Could not read "${file.name}". Ensure it is a valid, unencrypted PDF.`);
      }
    }

    setPdfFiles((prev) => [...prev, ...newItems]);
    setMergedBlobUrl(null);
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= pdfFiles.length) return;
    const list = [...pdfFiles];
    const [item] = list.splice(index, 1);
    list.splice(target, 0, item);
    setPdfFiles(list);
    setMergedBlobUrl(null);
  };

  const removeItem = (id: string) => {
    setPdfFiles((prev) => prev.filter((f) => f.id !== id));
    setMergedBlobUrl(null);
  };

  const totalPages = pdfFiles.reduce((acc, f) => acc + f.pageCount, 0);

  const mergePdfs = async () => {
    if (pdfFiles.length < 2) {
      setErrorMessage('Please upload at least 2 PDF files to merge.');
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const mergedDoc = await PDFDocument.create();

      for (const item of pdfFiles) {
        const bytes = await item.file.arrayBuffer();
        const srcDoc = await PDFDocument.load(bytes);
        const copiedPages = await mergedDoc.copyPages(srcDoc, srcDoc.getPageIndices());
        copiedPages.forEach((page) => mergedDoc.addPage(page));
      }

      const mergedBytes = await mergedDoc.save();
      const blob = new Blob([mergedBytes as any], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setMergedBlobUrl(url);
      confetti({ particleCount: 75, spread: 70, origin: { y: 0.6 } });
    } catch (err: any) {
      console.error('Failed to merge PDFs:', err);
      setErrorMessage(err.message || 'Error merging documents. Please verify files are intact.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8">
      <FileDropzone
        accept="application/pdf"
        multiple={true}
        onFilesSelected={handleFilesSelected}
        title="Upload 2 or more PDF documents"
        subtitle="Combine contracts, reports, or chapters into a single file with genuine client-side speed."
      />

      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-400 text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {pdfFiles.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                  Documents to Merge ({pdfFiles.length})
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Total pages: <span className="font-semibold text-blue-600 dark:text-blue-400">{totalPages}</span>
                </p>
              </div>
              <button
                onClick={() => setPdfFiles([])}
                className="text-xs text-rose-600 dark:text-rose-400 hover:underline"
              >
                Clear all
              </button>
            </div>

            <div className="space-y-3">
              {pdfFiles.map((item, idx) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-slate-300 transition-all"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <span className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 text-xs font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <div className="w-9 h-9 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="truncate">
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {item.name}
                      </p>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400">
                        <span>{item.sizeFormatted}</span>
                        <span>&bull;</span>
                        <span className="text-slate-600 dark:text-slate-300 font-medium">
                          {item.pageCount} {item.pageCount === 1 ? 'page' : 'pages'}
                        </span>
                      </div>
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
                      disabled={idx === pdfFiles.length - 1}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30"
                      title="Move Down"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => removeItem(item.id)}
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

          {/* Merge Configuration & Action */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
              Output Options
            </h4>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Merged File Name
              </label>
              <input
                type="text"
                value={outputFileName}
                onChange={(e) => setOutputFileName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-blue-500"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 space-y-1">
              <p className="flex justify-between">
                <span>Total Documents:</span>
                <span className="font-semibold text-slate-700 dark:text-slate-200">{pdfFiles.length}</span>
              </p>
              <p className="flex justify-between">
                <span>Combined Pages:</span>
                <span className="font-semibold text-slate-700 dark:text-slate-200">{totalPages}</span>
              </p>
            </div>

            <div className="pt-2">
              {mergedBlobUrl ? (
                <div className="space-y-3">
                  <a
                    href={mergedBlobUrl}
                    download={outputFileName.endsWith('.pdf') ? outputFileName : `${outputFileName}.pdf`}
                    className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Merged PDF</span>
                  </a>
                  <button
                    onClick={() => setMergedBlobUrl(null)}
                    className="w-full py-2 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center justify-center gap-1"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Re-merge</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={mergePdfs}
                  disabled={isProcessing || pdfFiles.length < 2}
                  className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 dark:disabled:bg-blue-900/40 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Merging Documents...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Merge {pdfFiles.length} PDFs Now</span>
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
