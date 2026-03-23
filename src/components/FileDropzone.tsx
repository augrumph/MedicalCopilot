import React, { useState, useRef } from 'react';
import { Upload, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

interface FileDropzoneProps {
  onFilesAdded: (files: File[]) => void;
  allowedTypes?: string[];
  multiple?: boolean;
}

const FileDropzone: React.FC<FileDropzoneProps> = ({
  onFilesAdded,
  allowedTypes = ['image/*', '.pdf', '.doc', '.docx'],
  multiple = true,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  // Ref keeps the up-to-date file list accessible inside event callbacks
  // without causing stale closures.
  const filesRef = useRef<File[]>([]);

  // Unique id per instance — prevents collision when multiple dropzones exist.
  const inputId = useRef(`file-upload-${Math.random().toString(36).slice(2)}`).current;

  const isAllowed = (file: File): boolean => {
    if (!allowedTypes) return true;
    return allowedTypes.some(type =>
      type.startsWith('.')
        ? file.name.toLowerCase().endsWith(type.toLowerCase())
        : file.type.startsWith(type.replace('/*', '')),
    );
  };

  const addFiles = (incoming: File[]) => {
    const valid   = incoming.filter(isAllowed);
    const updated = multiple
      ? [...filesRef.current, ...valid]
      : valid.slice(0, 1);
    filesRef.current = updated;
    setFiles(updated);
    onFilesAdded(updated);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    addFiles(Array.from(e.dataTransfer.files));
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    addFiles(Array.from(e.target.files || []));
    e.target.value = ''; // allow re-selecting the same file
  };

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all ${
          isDragging
            ? 'border-[#682bd7] bg-[#682bd7]/10'
            : 'border-[#ddd6d0] hover:border-[#682bd7]/40'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById(inputId)?.click()}
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex flex-col items-center justify-center space-y-4"
        >
          <Upload className="h-12 w-12 text-[#682bd7]" />
          <div>
            <p className="text-xl font-medium">Arraste e solte arquivos aqui</p>
            <p className="text-gray-400 mt-2">ou clique para selecionar</p>
          </div>
          <p className="text-sm text-gray-500">Imagens, PDFs e documentos aceitos</p>
        </motion.div>
        <input
          id={inputId}
          type="file"
          className="hidden"
          multiple={multiple}
          accept={allowedTypes.join(',')}
          onChange={handleFileInput}
        />
      </div>

      {files.length > 0 && (
        <div className="mt-4">
          <h4 className="text-lg font-semibold mb-2">Arquivos selecionados:</h4>
          <div className="space-y-2">
            {files.map((file, index) => (
              <div key={index} className="flex items-center bg-[#e6ddd6] rounded-xl p-3">
                <FileText className="h-5 w-5 mr-3 text-[#682bd7]" />
                <span className="truncate">{file.name}</span>
                <span className="text-[#682bd7]/70 ml-2 text-sm">
                  ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileDropzone;
