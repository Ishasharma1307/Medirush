import React, { useState, useRef } from 'react';
import { UploadCloud, X, File, AlertCircle } from 'lucide-react';

export const FileUpload = ({ label, error, onChange, className = '', maxFiles = 5, maxSizeMB = 2 }) => {
  const [files, setFiles] = useState([]);
  const [localError, setLocalError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    setLocalError(null);
    const selectedFiles = Array.from(e.target.files);
    
    if (files.length + selectedFiles.length > maxFiles) {
      setLocalError(`You can only upload up to ${maxFiles} files.`);
      return;
    }

    const validFiles = [];
    for (let i = 0; i < selectedFiles.length; i++) {
      if (selectedFiles[i].size > maxSizeMB * 1024 * 1024) {
        setLocalError(`File size must be less than ${maxSizeMB}MB.`);
        return;
      }
      validFiles.push(selectedFiles[i]);
    }

    const newFiles = [...files, ...validFiles];
    setFiles(newFiles);
    if (onChange) onChange(newFiles);
  };

  const removeFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    if (onChange) onChange(newFiles);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      const dropEvent = { target: { files: e.dataTransfer.files } };
      handleFileChange(dropEvent);
    }
  };

  const displayError = error || localError;

  return (
    <div className={`w-full ${className}`}>
      {label && <label className="block text-sm font-bold text-gray-700 mb-2">{label}</label>}
      
      <div 
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current.click()}
        className={`w-full p-8 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all bg-gray-50 hover:bg-blue-50 group
          ${displayError ? 'border-danger bg-red-50' : 'border-gray-300 hover:border-primary'}`}
      >
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-soft mb-4 group-hover:scale-110 transition-transform">
          <UploadCloud className={`h-8 w-8 ${displayError ? 'text-danger' : 'text-primary'}`} />
        </div>
        <p className="font-bold text-gray-800 text-center">Click to upload or drag and drop</p>
        <p className="text-sm text-gray-500 mt-1 font-medium">SVG, PNG, JPG or GIF (max. {maxSizeMB}MB)</p>
        
        <input 
          type="file" 
          multiple 
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden" 
          accept="image/*"
        />
      </div>
      
      {displayError && (
        <div className="mt-2 flex items-center text-sm font-bold text-danger animate-fade-in">
          <AlertCircle size={16} className="mr-1.5" /> {displayError}
        </div>
      )}

      {files.length > 0 && (
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {files.map((file, index) => {
            const isImage = file.type.startsWith('image/');
            const objectUrl = isImage ? URL.createObjectURL(file) : null;
            
            return (
              <div key={index} className="relative group rounded-xl border border-gray-200 overflow-hidden bg-white shadow-soft aspect-square">
                {isImage ? (
                  <img src={objectUrl} alt="preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-4">
                    <File size={32} className="text-gray-400 mb-2" />
                    <span className="text-xs text-center truncate w-full font-medium">{file.name}</span>
                  </div>
                )}
                
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button 
                    type="button"
                    onClick={(e) => { e.stopPropagation(); removeFile(index); }}
                    className="p-2 bg-danger text-white rounded-full hover:scale-110 transition-transform shadow-lg"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
