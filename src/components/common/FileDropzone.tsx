import React, { useRef, useState } from 'react';
import { UploadCloud, ShieldCheck, AlertCircle } from 'lucide-react';

interface FileDropzoneProps {
  accept: string;
  multiple?: boolean;
  maxSizeMB?: number;
  onFilesSelected: (files: File[]) => void;
  title?: string;
  subtitle?: string;
  className?: string;
}

export const FileDropzone: React.FC<FileDropzoneProps> = ({
  accept,
  multiple = false,
  maxSizeMB = 50,
  onFilesSelected,
  title = 'Choose files or drag & drop here',
  subtitle,
  className = ''
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAndPassFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setErrorMsg(null);

    const validFiles: File[] = [];
    const maxBytes = maxSizeMB * 1024 * 1024;

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      if (file.size > maxBytes) {
        setErrorMsg(`File "${file.name}" exceeds the ${maxSizeMB}MB safety limit.`);
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length > 0) {
      onFilesSelected(validFiles);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    validateAndPassFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  return (
    <div className={`w-full ${className}`}>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-200 group ${
          isDragOver
            ? 'border-blue-500 bg-blue-50/80 dark:bg-blue-950/30 scale-[1.01]'
            : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/60 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-slate-50/60 dark:hover:bg-slate-900/80 shadow-xs'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={(e) => validateAndPassFiles(e.target.files)}
        />

        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600/10 via-indigo-600/10 to-violet-600/10 dark:from-blue-500/20 dark:to-violet-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
          <UploadCloud className="w-8 h-8" />
        </div>

        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-1">
          {title}
        </h3>
        
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mb-4">
          {subtitle || (multiple ? 'Select multiple files or folders' : 'Click to browse from your computer or phone')}
        </p>

        <button
          type="button"
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm shadow-sm transition-colors flex items-center gap-2 pointer-events-none"
        >
          Select {multiple ? 'Files' : 'File'}
        </button>

        <div className="mt-5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-xs font-medium border border-emerald-200/60 dark:border-emerald-800/40">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>100% Private &bull; Client-side local processing</span>
        </div>
      </div>

      {errorMsg && (
        <div className="mt-3 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-400 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
};
