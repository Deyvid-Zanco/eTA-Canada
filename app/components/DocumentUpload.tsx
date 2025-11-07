"use client";

import React, { useRef, useCallback, useState } from 'react';
import Webcam from "react-webcam";
interface DocumentUploadProps {
  label: string;
  fieldName: string;
  register: (...args: unknown[]) => unknown;
  errors: Record<string, { message?: string }>;
  setValue: (...args: unknown[]) => void;
  watch: (...args: unknown[]) => unknown;
  downloadUrl: string;
  downloadFileName: string;
  buttonColor: string;
  icon: string;
  required?: boolean;
}

const videoConstraints = {
  width: { ideal: 1920 },
  height: { ideal: 1080 },
  facingMode: "environment" // Use back camera for document scanning (flexible fallback)
};

export function DocumentUpload({
  label,
  fieldName,
  register,
  errors,
  setValue,
  watch,
  downloadUrl,
  downloadFileName,
  buttonColor,
  icon,
  required = true
}: DocumentUploadProps) {
  const [showWebcam, setShowWebcam] = useState(false);
  const webcamRef = useRef<Webcam>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const watchedFile = watch(fieldName);

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setValue(fieldName, imageSrc, { shouldValidate: true });
        setShowWebcam(false);
      }
    }
  }, [fieldName, setValue]);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setValue(fieldName, e.target.result, { shouldValidate: true });
        }
      };
      reader.readAsDataURL(file);
    }
  }, [fieldName, setValue]);

  const handleDownload = useCallback(() => {
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = downloadFileName;
    link.click();
  }, [downloadUrl, downloadFileName]);

  const hasFile = watchedFile && (
    (typeof watchedFile === 'string' && watchedFile.length > 0) ||
    (typeof watchedFile === 'object' && 'length' in watchedFile && (watchedFile as { length: number }).length > 0)
  );

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-3">{label} {required && <span className="text-red-500">*</span>}</h3>
      
      {/* Download Button */}
      <div className="mb-4">
        <button 
          type="button"
          onClick={handleDownload}
          className={`flex items-center gap-2 ${buttonColor} text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity`}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          {icon} Download {label}
        </button>
      </div>

      {/* Upload Section */}
      <div className={`border-2 border-dashed rounded-lg p-6 text-center ${hasFile ? 'border-green-300 bg-green-50' : 'border-gray-300'}`}>
        {hasFile ? (
          <div className="mb-4">
            <div className="w-12 h-12 mx-auto mb-2 text-green-600">
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-green-700 font-medium">✅ Document uploaded successfully!</p>
            <p className="text-sm text-green-600 mt-1">You can upload a new file to replace this one</p>
          </div>
        ) : (
          <div className="mb-4">
            <div className="w-12 h-12 mx-auto mb-2 text-gray-400">
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="font-medium mb-2">Upload Completed Form</p>
            <p className="text-sm text-gray-500 mb-4">
              Download the form above, fill it out completely, sign it, then upload as photo or PDF scan
            </p>
          </div>
        )}

        {!showWebcam ? (
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <button 
              type="button"
              onClick={() => setShowWebcam(true)}
              className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586l-.707-.707A1 1 0 0013 4H7a1 1 0 00-.707.293L5.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
              📷 Use Camera
            </button>
            
            <label className="flex items-center justify-center gap-2 border-2 border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              📁 Choose File (Photo or PDF)
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden" 
                accept="image/*,.pdf" 
              />
            </label>
          </div>
        ) : (
          <div className="mt-4">
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/png"
              videoConstraints={videoConstraints}
              className="w-full max-w-md mx-auto rounded-lg"
            />
            <div className="flex justify-center gap-3 mt-4">
              <button
                type="button"
                onClick={capture}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                📸 Capture Photo
              </button>
              <button
                type="button"
                onClick={() => setShowWebcam(false)}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Hidden input for form registration */}
      <input type="hidden" {...(register(fieldName) as Record<string, unknown>)} />
      
      {/* Error message */}
      {errors[fieldName] && (
        <p className="text-red-600 text-sm mt-2 font-medium">
          {errors[fieldName].message}
        </p>
      )}
    </div>
  );
}
