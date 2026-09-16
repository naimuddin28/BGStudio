import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image as ImageIcon } from 'lucide-react';

export default function UploadBox({ onUpload }) {
  const onDrop = useCallback(acceptedFiles => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      onUpload(acceptedFiles[0]);
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024 // 10MB
  });

  return (
    <div 
      {...getRootProps()} 
      className={`border-4 border-dashed rounded-3xl p-16 text-center cursor-pointer transition-colors duration-200 ease-in-out flex flex-col items-center justify-center min-h-[400px] bg-white
        ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}
    >
      <input {...getInputProps()} />
      <div className="bg-blue-100 p-6 rounded-full mb-6">
        <Upload className="h-12 w-12 text-blue-600" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-4">
        {isDragActive ? 'Drop your image here' : 'Drag & Drop Your Image Here'}
      </h3>
      <p className="text-gray-500 mb-8 font-medium">or click to browse from your device</p>
      
      <div className="flex items-center space-x-2 text-sm text-gray-400">
        <ImageIcon className="h-4 w-4" />
        <span>Supports JPG, PNG, WEBP (Max 10MB)</span>
      </div>
    </div>
  );
}
