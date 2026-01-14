'use client';

import { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface UploadedFile {
  id: string;
  url: string;
  type: 'image' | 'video' | 'audio';
  file?: File;
}

interface MediaUploadProps {
  onFilesChange: (files: UploadedFile[]) => void;
  existingFiles?: UploadedFile[];
  maxFiles?: number;
}

const generateId = () => Math.random().toString(36).substring(2, 15);

export function MediaUpload({
  onFilesChange,
  existingFiles = [],
  maxFiles = 10,
}: MediaUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>(existingFiles);
  const [isUploading, setIsUploading] = useState(false);

  const uploadFiles = async (newFiles: File[]) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      newFiles.forEach((file) => formData.append('files', file));

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      const uploaded: UploadedFile[] = data.files.map((f: { id: string; url: string; type: string }) => ({
        id: f.id || generateId(),
        url: f.url,
        type: f.type as 'image' | 'video' | 'audio',
      }));

      const updatedFiles = [...files, ...uploaded];
      setFiles(updatedFiles);
      onFilesChange(updatedFiles);
    } catch (error) {
      console.error('Erro no upload:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFiles = useCallback(
    (fileList: FileList | null) => {
      if (!fileList) return;
      const remaining = maxFiles - files.length;
      const filesToUpload = Array.from(fileList).slice(0, remaining);
      if (filesToUpload.length > 0) {
        uploadFiles(filesToUpload);
      }
    },
    [files.length, maxFiles]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const removeFile = (id: string) => {
    const updated = files.filter((f) => f.id !== id);
    setFiles(updated);
    onFilesChange(updated);
  };

  return (
    <div className="space-y-4">
      <motion.div
        className={`
          relative border-2 border-dashed p-8 text-center cursor-pointer
          transition-all duration-150
          ${isDragging
            ? 'border-[var(--neon-green)] bg-[var(--neon-green)]/5 shadow-[0_0_20px_var(--neon-green-glow)]'
            : 'border-[var(--surface-elevated)] hover:border-[var(--neon-pink)] hover:shadow-[0_0_10px_var(--neon-pink-glow)]'
          }
        `}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        whileHover={{ scale: 1.01 }}
      >
        <input
          type="file"
          accept="image/*,video/*,audio/*"
          multiple
          onChange={(e) => handleFiles(e.target.files)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isUploading}
        />

        {isUploading ? (
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-2 border-[var(--neon-pink)] border-t-transparent rounded-full spinner-chaos" />
            <span className="text-[var(--neon-pink)] font-[var(--font-display)] uppercase tracking-wider">
              Enviando...
            </span>
          </div>
        ) : (
          <>
            <div className={`
              w-16 h-16 mx-auto mb-4 flex items-center justify-center
              border-2 ${isDragging ? 'border-[var(--neon-green)]' : 'border-[var(--neon-pink)]'}
            `}>
              <svg
                className={`w-8 h-8 ${isDragging ? 'text-[var(--neon-green)]' : 'text-[var(--neon-pink)]'}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <p className="font-[var(--font-display)] text-lg uppercase tracking-wider text-[var(--text-primary)] mb-2">
              Arrasta as provas
            </p>
            <p className="text-sm text-[var(--text-muted)] font-[var(--font-body)]">
              Fotos, videos e audios • {files.length}/{maxFiles}
            </p>
          </>
        )}
      </motion.div>

      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3"
          >
            {files.map((file, index) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: index * 0.05 }}
                className="relative aspect-square group"
              >
                <div className="absolute inset-0 border border-[var(--surface-elevated)] overflow-hidden">
                  {file.type === 'image' ? (
                    <img
                      src={file.url}
                      alt="Upload"
                      className="w-full h-full object-cover"
                    />
                  ) : file.type === 'video' ? (
                    <video src={file.url} className="w-full h-full object-cover" muted />
                  ) : (
                    <div className="w-full h-full bg-[var(--surface-dark)] flex items-center justify-center">
                      <svg className="w-12 h-12 text-[var(--neon-purple)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                      </svg>
                    </div>
                  )}
                </div>

                <motion.button
                  type="button"
                  onClick={() => removeFile(file.id)}
                  className="absolute top-1 right-1 w-6 h-6 bg-[var(--void-black)] border border-[var(--neon-orange)] text-[var(--neon-orange)] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>

                {file.type === 'video' && (
                  <div className="absolute bottom-1 left-1 px-1 text-xs bg-[var(--void-black)] text-[var(--neon-blue)] border border-[var(--neon-blue)] font-[var(--font-body)]">
                    VID
                  </div>
                )}
                {file.type === 'audio' && (
                  <div className="absolute bottom-1 left-1 px-1 text-xs bg-[var(--void-black)] text-[var(--neon-purple)] border border-[var(--neon-purple)] font-[var(--font-body)]">
                    AUD
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
