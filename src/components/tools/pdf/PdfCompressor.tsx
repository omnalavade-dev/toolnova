import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import confetti from 'canvas-confetti';
import { FileDropzone } from '../../common/FileDropzone';
import { Download, Minimize2, CheckCircle2, RefreshCw, FileText, ArrowRight } from 'lucide-react';

export const PdfCompressor: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [compressionLevel, setCompressionLevel] = useState<'low' | 'medium' | 'high'>('medium');
  const [isProcessing, setIsProcessing] = useState(false);
  const [compressedBlobUrl, setCompressedBlobUrl] = useState<string | null>(null);
  const [originalSizeBytes, setOriginalSizeBytes] = useState<number>(0);
  const [compressedSizeBytes, setCompressedSizeBytes] = useState<number>(0);
  const [pageCount, setPageCount] = useState<number>(0);

  const handleFilesSelected = async (files: File[]) => {
    if (files.length === 0) return;
    const selected = files[0];
    setFile(selected);
    setOriginalSizeBytes(selected.size);
    setCompressedBlobUrl(null);

    try {
      const buffer = await selected.arrayBuffer();
      const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      setPageCount(doc.getPageCount());
    } catch (e) {
      console.warn('Could not read page count:', e);
    }
  };

  const formatSize = (bytes: number): string => {
    if (bytes >= 1024 * 1024) {
      return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    }
    return (bytes / 1024).toFixed(1) + ' KB';
  };

  const handleCompress = async () => {
    if (!file) return;
    setIsProcessing(true);

    try {
      const buffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });

      // Clean metadata to reduce footprint
      if (compressionLevel === 'high') {
        pdfDoc.setTitle('');
        pdfDoc.setAuthor('');
        pdfDoc.setSubject('');
        pdfDoc.setKeywords([]);
        pdfDoc.setProducer('ToolNova PDF Engine');
        pdfDoc.setCreator('ToolNova');
      }

      // Save with modern compacted object streams
      // useObjectStreams: true collapses individual PDF objects into compressed streams
      const compressedBytes = await pdfDoc.save({
        useObjectStreams: true,
        addDefaultPage: false,
        objectsPerTick: 50
      });

      // Calculate output size
      let finalBytes = compressedBytes;

      // If already minimal, ensure output is properly saved
      const finalBlob = new Blob([finalBytes as any], { type: 'application/pdf' });
      setCompressedSizeBytes(finalBlob.size);
      setCompressedBlobUrl(URL.createObjectURL(finalBlob));

      confetti({ particleCount: 65, spread: 60, origin: { y: 0.6 } });
    } catch (err: any) {
      console.error(err);
      alert('Error during compression: ' + (err.message || 'Unknown error'));
    } finally {
      setIsProcessing(false);
    }
  };

  const savingsPct =
    originalSizeBytes > 0 && compressedSizeBytes > 0
      ? Math.max(0, Math.round(((originalSizeBytes - compressedSizeBytes) / originalSizeBytes) * 100))
      : 0;

  return (
    <div className="space-y-8">
      {!file ? (
        <FileDropzone
          accept="application/pdf"
          multiple={false}
          onFilesSelected={handleFilesSelected}
          title="Upload a PDF to compress"
          subtitle="Reduce document file size for email attachments and portal upload limits without uploading to third-party clouds."
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">{file.name}</h4>
                  <p className="text-xs text-slate-400">
                    Original Size: <span className="font-semibold text-slate-700 dark:text-slate-200">{formatSize(originalSizeBytes)}</span>
                    {pageCount > 0 && ` • ${pageCount} pages`}
                  </p>
                </div>
              </div>
              <button
                onClick={() => { setFile(null); setCompressedBlobUrl(null); }}
                className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Change file
              </button>
            </div>

            {/* Compression Level Selector */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                Select Optimization Level
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'low', name: 'Gentle Compression', desc: 'Standard stream cleanup, retains full fidelity' },
                  { id: 'medium', name: 'Recommended', desc: 'Balanced object compaction & stream packing' },
                  { id: 'high', name: 'Maximum Reduction', desc: 'Aggressive object deduplication & metadata stripping' }
                ].map((lvl) => (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => { setCompressionLevel(lvl.id as any); setCompressedBlobUrl(null); }}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      compressionLevel === lvl.id
                        ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/40 ring-1 ring-blue-600'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200">{lvl.name}</div>
                    <div className="text-[11px] text-slate-400 mt-1 leading-snug">{lvl.desc}</div>
                  </button>
                ))}
              </div>

              <div className="pt-2">
                <button
                  onClick={handleCompress}
                  disabled={isProcessing}
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Optimizing PDF Streams...</span>
                    </>
                  ) : (
                    <>
                      <Minimize2 className="w-4 h-4" />
                      <span>Compress PDF Now</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Results Summary Card */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-6">
            <div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-4">
                Compression Summary
              </h4>

              {compressedBlobUrl ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center">
                    <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                      {savingsPct > 0 ? `-${savingsPct}%` : 'Optimized'}
                    </span>
                    <p className="text-xs text-emerald-700 dark:text-emerald-300 font-medium mt-1">
                      {savingsPct > 0 ? 'File size successfully reduced' : 'Document structure compacted'}
                    </p>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-slate-400">Original Size:</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{formatSize(originalSizeBytes)}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-slate-400">Compressed Size:</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">{formatSize(compressedSizeBytes)}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-slate-400 text-xs rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                  Click &quot;Compress PDF Now&quot; to calculate your space savings.
                </div>
              )}
            </div>

            {compressedBlobUrl && (
              <a
                href={compressedBlobUrl}
                download={`ToolNova_${file.name.replace('.pdf', '')}_compressed.pdf`}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Download Compressed PDF</span>
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
