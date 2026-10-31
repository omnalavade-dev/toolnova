import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import confetti from 'canvas-confetti';
import { FileDropzone } from '../../common/FileDropzone';
import { Download, Scissors, CheckCircle2, RefreshCw, AlertCircle, FileText, FileCheck } from 'lucide-react';

interface SplitResult {
  id: string;
  name: string;
  pagesLabel: string;
  blobUrl: string;
}

export const PdfSplitter: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [splitMode, setSplitMode] = useState<'range' | 'all' | 'even_odd'>('range');
  const [pageRange, setPageRange] = useState<string>('1-2');
  const [isProcessing, setIsProcessing] = useState(false);
  const [splitResults, setSplitResults] = useState<SplitResult[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFilesSelected = async (files: File[]) => {
    if (files.length === 0) return;
    const selected = files[0];
    setErrorMessage(null);
    setSplitResults([]);

    try {
      const buffer = await selected.arrayBuffer();
      const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const pages = doc.getPageCount();
      setFile(selected);
      setTotalPages(pages);
      setPageRange(pages > 1 ? `1-${Math.min(pages, 2)}` : '1');
    } catch (err: any) {
      console.error(err);
      setErrorMessage('Failed to load PDF. Please make sure the file is not corrupted or password-protected.');
    }
  };

  const parseRanges = (input: string, maxPages: number): number[] => {
    const pagesToExtract = new Set<number>();
    const parts = input.split(',').map((s) => s.trim());

    for (const part of parts) {
      if (part.includes('-')) {
        const [startStr, endStr] = part.split('-');
        const start = parseInt(startStr, 10);
        const end = parseInt(endStr, 10);
        if (!isNaN(start) && !isNaN(end)) {
          const lower = Math.max(1, Math.min(start, end));
          const upper = Math.min(maxPages, Math.max(start, end));
          for (let p = lower; p <= upper; p++) {
            pagesToExtract.add(p);
          }
        }
      } else {
        const p = parseInt(part, 10);
        if (!isNaN(p) && p >= 1 && p <= maxPages) {
          pagesToExtract.add(p);
        }
      }
    }

    return Array.from(pagesToExtract).sort((a, b) => a - b);
  };

  const handleSplit = async () => {
    if (!file || totalPages === 0) return;
    setIsProcessing(true);
    setErrorMessage(null);
    setSplitResults([]);

    try {
      const buffer = await file.arrayBuffer();
      const srcDoc = await PDFDocument.load(buffer);
      const results: SplitResult[] = [];

      if (splitMode === 'range') {
        const indices = parseRanges(pageRange, totalPages).map((p) => p - 1);
        if (indices.length === 0) {
          throw new Error('Please enter a valid page range (e.g. 1-3, 5).');
        }

        const newDoc = await PDFDocument.create();
        const copied = await newDoc.copyPages(srcDoc, indices);
        copied.forEach((p) => newDoc.addPage(p));

        const bytes = await newDoc.save();
        const blob = new Blob([bytes as any], { type: 'application/pdf' });
        results.push({
          id: 'range-1',
          name: `${file.name.replace('.pdf', '')}_extracted_pages.pdf`,
          pagesLabel: `Pages: ${indices.map((i) => i + 1).join(', ')}`,
          blobUrl: URL.createObjectURL(blob)
        });
      } else if (splitMode === 'all') {
        // Extract each page as a standalone PDF
        for (let i = 0; i < totalPages; i++) {
          const newDoc = await PDFDocument.create();
          const [copiedPage] = await newDoc.copyPages(srcDoc, [i]);
          newDoc.addPage(copiedPage);

          const bytes = await newDoc.save();
          const blob = new Blob([bytes as any], { type: 'application/pdf' });
          results.push({
            id: `page-${i + 1}`,
            name: `${file.name.replace('.pdf', '')}_page_${i + 1}.pdf`,
            pagesLabel: `Page ${i + 1}`,
            blobUrl: URL.createObjectURL(blob)
          });
        }
      } else if (splitMode === 'even_odd') {
        // Odd pages doc
        const oddIndices = [];
        const evenIndices = [];
        for (let i = 0; i < totalPages; i++) {
          if ((i + 1) % 2 !== 0) oddIndices.push(i);
          else evenIndices.push(i);
        }

        if (oddIndices.length > 0) {
          const oddDoc = await PDFDocument.create();
          const copiedOdds = await oddDoc.copyPages(srcDoc, oddIndices);
          copiedOdds.forEach((p) => oddDoc.addPage(p));
          const oddBytes = await oddDoc.save();
          results.push({
            id: 'odd-pages',
            name: `${file.name.replace('.pdf', '')}_odd_pages.pdf`,
            pagesLabel: `Odd Pages (${oddIndices.map((i) => i + 1).join(', ')})`,
            blobUrl: URL.createObjectURL(new Blob([oddBytes as any], { type: 'application/pdf' }))
          });
        }

        if (evenIndices.length > 0) {
          const evenDoc = await PDFDocument.create();
          const copiedEvens = await evenDoc.copyPages(srcDoc, evenIndices);
          copiedEvens.forEach((p) => evenDoc.addPage(p));
          const evenBytes = await evenDoc.save();
          results.push({
            id: 'even-pages',
            name: `${file.name.replace('.pdf', '')}_even_pages.pdf`,
            pagesLabel: `Even Pages (${evenIndices.map((i) => i + 1).join(', ')})`,
            blobUrl: URL.createObjectURL(new Blob([evenBytes as any], { type: 'application/pdf' }))
          });
        }
      }

      setSplitResults(results);
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Error occurred while splitting PDF.');
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
          title="Upload a PDF document to split"
          subtitle="Extract single pages, ranges (e.g. 1-5, 8), or divide each page into its own file."
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* File summary & settings */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">{file.name}</h4>
                  <p className="text-xs text-slate-400">
                    {(file.size / 1024).toFixed(1)} KB &bull;{' '}
                    <span className="font-semibold text-blue-600 dark:text-blue-400">{totalPages} total pages</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => { setFile(null); setSplitResults([]); }}
                className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Change file
              </button>
            </div>

            {/* Split Mode Options */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                Choose Split Method
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'range', label: 'Custom Range', desc: 'e.g. 1-3, 5, 7' },
                  { id: 'all', label: 'All Pages', desc: 'Separate PDF for each page' },
                  { id: 'even_odd', label: 'Even / Odd', desc: '2 separate documents' }
                ].map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setSplitMode(mode.id as any)}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      splitMode === mode.id
                        ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 ring-1 ring-blue-600'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200">{mode.label}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{mode.desc}</div>
                  </button>
                ))}
              </div>

              {splitMode === 'range' && (
                <div className="space-y-1.5 pt-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex justify-between">
                    <span>Page Numbers or Ranges</span>
                    <span className="text-slate-400 font-normal">Valid pages: 1 to {totalPages}</span>
                  </label>
                  <input
                    type="text"
                    value={pageRange}
                    onChange={(e) => setPageRange(e.target.value)}
                    placeholder="e.g. 1-3, 5, 8"
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-blue-500"
                  />
                  <p className="text-[11px] text-slate-400">
                    Use commas to separate single pages and hyphens for intervals (e.g. 1-4, 7, 9).
                  </p>
                </div>
              )}

              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <button
                onClick={handleSplit}
                disabled={isProcessing}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Extracting Pages...</span>
                  </>
                ) : (
                  <>
                    <Scissors className="w-4 h-4" />
                    <span>Split & Extract PDF</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results column */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-emerald-500" />
              <span>Extracted Files ({splitResults.length})</span>
            </h4>

            {splitResults.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                Choose your split configuration and click &quot;Split & Extract PDF&quot; to generate files.
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {splitResults.map((res) => (
                  <div
                    key={res.id}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2"
                  >
                    <div className="truncate">
                      <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {res.name}
                      </div>
                      <div className="text-[10px] text-blue-600 dark:text-blue-400 font-medium">
                        {res.pagesLabel}
                      </div>
                    </div>
                    <a
                      href={res.blobUrl}
                      download={res.name}
                      className="p-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1 shrink-0"
                      title="Download this file"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
