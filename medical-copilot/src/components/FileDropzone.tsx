import React, { useState } from 'react';
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
  multiple = true
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (allowedTypes) {
      const validFiles = droppedFiles.filter(file => 
        allowedTypes.some(type => 
          type.startsWith('.') 
            ? file.name.toLowerCase().endsWith(type.substring(1).toLowerCase())
            : file.type.startsWith(type.replace('/*', ''))
        )
      );
      setFiles(prev => multiple ? [...prev, ...validFiles] : [validFiles[0]]);
      onFilesAdded(multiple ? [...files, ...validFiles] : [validFiles[0]]);
    } else {
      setFiles(prev => multiple ? [...prev, ...droppedFiles] : [droppedFiles[0]]);
      onFilesAdded(multiple ? [...files, ...droppedFiles] : [droppedFiles[0]]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(prev => multiple ? [...prev, ...selectedFiles] : [selectedFiles[0]]);
      onFilesAdded(multiple ? [...files, ...selectedFiles] : [selectedFiles[0]]);
    }
  };

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all ${
          isDragging
            ? 'border-[#283618] bg-[#283618]/10'
            : 'border-[#B7B7A4] hover:border-[#283618]'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-upload')?.click()}
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex flex-col items-center justify-center space-y-4"
        >
          <Upload className="h-12 w-12 text-[#283618]" />
          <div>
            <p className="text-xl font-medium">Arraste e solte arquivos aqui</p>
            <p className="text-gray-400 mt-2">ou clique para selecionar</p>
          </div>
          <p className="text-sm text-gray-500">Imagens, PDFs e documentos aceitos</p>
        </motion.div>
        <input
          id="file-upload"
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
              <div key={index} className="flex items-center bg-[#D4D4D4] rounded-xl p-3">
                <FileText className="h-5 w-5 mr-3 text-[#283618]" />
                <span className="truncate">{file.name}</span>
                <span className="text-[#283618]/70 ml-2 text-sm">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileDropzone;