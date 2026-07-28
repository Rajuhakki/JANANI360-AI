import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  Camera,
  Upload,
  FileText,
  Sparkles,
  RefreshCw,
  X,
  CheckCircle2,
  AlertCircle,
  Scan,
  FileCheck,
  Trash2,
  Image as ImageIcon
} from 'lucide-react';
import { ashaService, AshaOcrResult } from '../services/ashaService';

interface SmartCardScannerProps {
  onScanComplete: (data: AshaOcrResult, scores: Record<string, number>) => void;
  onScanError?: (msg: string) => void;
}

export const SmartCardScanner: React.FC<SmartCardScannerProps> = ({
  onScanComplete,
  onScanError
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Camera State
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // AI OCR State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState<string>('');
  const [scanSuccess, setScanSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  // Run AI OCR Processing immediately
  const triggerAiAnalysis = async (url?: string, fileObj?: File) => {
    const targetUrl = url || previewUrl;
    const targetFile = fileObj || selectedFile;

    if (!targetUrl && !targetFile) return;

    setIsAnalyzing(true);
    setErrorMessage(null);
    setScanSuccess(false);

    try {
      setAnalysisStep('Analyzing Antenatal Card...');
      await new Promise((r) => setTimeout(r, 600));

      setAnalysisStep('Reading Kannada & English...');
      await new Promise((r) => setTimeout(r, 600));

      setAnalysisStep('Extracting Information...');
      await new Promise((r) => setTimeout(r, 500));

      const res = await ashaService.scanAntenatalCard(
        targetUrl && targetUrl !== 'pdf-placeholder' ? targetUrl : undefined,
        targetFile?.name
      );

      if (res.success && res.data) {
        setScanSuccess(true);
        onScanComplete(res.data, res.confidenceScores || {});
      } else {
        const msg =
          res.message ||
          'Unable to extract all information. Please complete the missing fields manually.';
        setErrorMessage(msg);
        if (onScanError) onScanError(msg);
      }
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        'Unable to extract all information. Please complete the missing fields manually.';
      setErrorMessage(msg);
      if (onScanError) onScanError(msg);
    } finally {
      setIsAnalyzing(false);
      setAnalysisStep('');
    }
  };

  const processFile = (file: File) => {
    setErrorMessage(null);
    setScanSuccess(false);
    setSelectedFile(file);

    let url = 'pdf-placeholder';
    if (file.type.startsWith('image/')) {
      url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else if (file.type === 'application/pdf') {
      setPreviewUrl('pdf-placeholder');
    } else {
      setErrorMessage('Unsupported file format. Please upload JPG, JPEG, PNG, or PDF.');
      return;
    }

    // Automatically trigger AI OCR analysis immediately!
    triggerAiAnalysis(url, file);
  };

  // Drag & Drop Handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  // HTML5 Camera Access
  const startCamera = async () => {
    setCameraError(null);
    setShowCameraModal(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err: any) {
      console.error('Camera access error:', err);
      setCameraError(
        'Unable to access device camera. Please check browser permissions or use the Choose File option.'
      );
    }
  };

  const stopCamera = useCallback(() => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    setShowCameraModal(false);
  }, [cameraStream]);

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg');
      setPreviewUrl(dataUrl);

      const file = new File([dataUrl], 'captured_antenatal_card.jpg', { type: 'image/jpeg' });
      setSelectedFile(file);

      // Automatically close camera modal after capture
      stopCamera();

      // Automatically start AI OCR analysis immediately!
      triggerAiAnalysis(dataUrl, file);
    }
  };

  const handleCancelImage = () => {
    setPreviewUrl(null);
    setSelectedFile(null);
    setScanSuccess(false);
    setErrorMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Run AI OCR Processing with Real Gemini Multimodal Vision
  const runAiAnalysis = async () => {
    if (!previewUrl && !selectedFile) {
      setErrorMessage('Please capture or select an Antenatal Card image first.');
      return;
    }

    setIsAnalyzing(true);
    setErrorMessage(null);
    setScanSuccess(false);

    try {
      setAnalysisStep('Reading file data & preparing AI vision stream...');
      let base64Data: string | undefined = undefined;
      let mimeType: string | undefined = undefined;

      if (selectedFile) {
        mimeType = selectedFile.type || 'image/jpeg';
        base64Data = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = (error) => reject(error);
          reader.readAsDataURL(selectedFile!);
        });
      } else if (previewUrl && previewUrl.startsWith('data:')) {
        base64Data = previewUrl;
        const matches = previewUrl.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,/);
        if (matches && matches[1]) mimeType = matches[1];
      }

      if (!base64Data) {
        throw new Error('Could not convert image to read format. Please try re-uploading the file.');
      }

      setAnalysisStep('Sending document to Google Gemini Multimodal AI...');
      const res = await ashaService.scanAntenatalCard(
        base64Data,
        selectedFile?.name || 'captured_card.jpg',
        mimeType
      );

      setAnalysisStep('Extracting authentic demographic & clinical metrics...');
      if (res.success && res.data) {
        setScanSuccess(true);
        onScanComplete(res.data, res.confidenceScores || {});
      } else {
        const msg =
          res.message ||
          'Unable to extract information from document. Please verify image quality.';
        setErrorMessage(msg);
        if (onScanError) onScanError(msg);
      }
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        'Unable to complete AI extraction. Please verify your GEMINI_API_KEY or complete fields manually.';
      setErrorMessage(msg);
      if (onScanError) onScanError(msg);
    } finally {
      setIsAnalyzing(false);
      setAnalysisStep('');
    }
  };

  const handleResetScan = () => {
    setPreviewUrl(null);
    setSelectedFile(null);
    setScanSuccess(false);
    setErrorMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-[20px] p-5 sm:p-6 shadow-xl space-y-4">
      {/* Top Main Smart Registration Card */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Scan className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-black text-white flex items-center gap-2">
              Smart Registration
              <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                AI Vision OCR
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Scan or upload the Karnataka Antenatal Card to automatically extract &amp; fill mother details.
            </p>
          </div>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/jpg,application/pdf"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Camera Live Stream Modal */}
      {showCameraModal && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-[20px] max-w-lg w-full p-5 space-y-4 shadow-2xl relative">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Camera className="w-4 h-4 text-emerald-400" />
                Scan Karnataka Antenatal Card
              </h4>
              <button
                type="button"
                onClick={stopCamera}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {cameraError ? (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-xs text-red-300 space-y-2">
                <AlertCircle className="w-6 h-6 text-red-400" />
                <p>{cameraError}</p>
                <button
                  type="button"
                  onClick={() => {
                    stopCamera();
                    fileInputRef.current?.click();
                  }}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-bold"
                >
                  Choose Saved File Instead
                </button>
              </div>
            ) : (
              <div className="relative rounded-2xl overflow-hidden bg-black aspect-video border border-emerald-500/30 shadow-inner flex items-center justify-center">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                <div className="absolute inset-4 border-2 border-dashed border-emerald-400/80 rounded-xl pointer-events-none flex items-center justify-center">
                  <span className="bg-slate-950/70 text-emerald-300 text-[10px] font-bold px-2 py-1 rounded-md">
                    Align Antenatal Card Here
                  </span>
                </div>
              </div>
            )}

            {!cameraError && (
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={capturePhoto}
                  className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg flex items-center justify-center gap-2"
                >
                  <Camera className="w-4 h-4" />
                  Capture Photo
                </button>
                <button
                  type="button"
                  onClick={stopCamera}
                  className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl border border-slate-700"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Upload Dropzone or Preview */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-[20px] p-5 transition-all text-center flex flex-col items-center justify-center min-h-[220px] ${
          isDragOver
            ? 'border-emerald-400 bg-emerald-500/10 scale-[1.01]'
            : previewUrl
            ? 'border-emerald-500/40 bg-slate-950/60'
            : 'border-slate-800 hover:border-emerald-500/50 bg-slate-950/40'
        }`}
      >
        {/* Animated Loading Overlay during Automatic AI OCR */}
        {isAnalyzing && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md rounded-[20px] z-30 flex flex-col items-center justify-center p-6 space-y-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-emerald-500/20 border-t-emerald-400 animate-spin" />
              <Sparkles className="w-7 h-7 text-emerald-400 absolute inset-0 m-auto animate-pulse" />
            </div>
            <div className="text-center space-y-1">
              <h4 className="text-base font-black text-white">{analysisStep}</h4>
              <p className="text-xs text-emerald-400 font-semibold">
                Extracting printed &amp; handwritten Kannada &amp; English entries
              </p>
            </div>
          </div>
        )}

        {/* Display Preview if file/camera image selected */}
        {previewUrl ? (
          <div className="w-full space-y-4">
            <div className="relative max-h-56 overflow-hidden rounded-2xl border border-slate-800 bg-black/60 flex items-center justify-center p-2">
              {previewUrl === 'pdf-placeholder' ? (
                <div className="p-8 text-center space-y-2">
                  <FileText className="w-12 h-12 text-emerald-400 mx-auto" />
                  <span className="block text-xs font-bold text-slate-200">{selectedFile?.name}</span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    PDF Document ({formatFileSize(selectedFile?.size)})
                  </span>
                </div>
              ) : (
                <img
                  src={previewUrl}
                  alt="Antenatal Card Preview"
                  className="max-h-52 object-contain rounded-xl"
                />
              )}

              {/* Status Badge */}
              <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur border border-emerald-500/40 rounded-full px-3 py-1 text-[11px] font-bold text-emerald-300 flex items-center gap-1.5">
                <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
                {scanSuccess ? 'AI Extraction Complete' : 'Card Loaded'}
              </div>
            </div>

            {/* Filename & File Size Info */}
            <div className="flex flex-wrap items-center justify-between text-xs bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-slate-400 font-mono">
              <span className="truncate max-w-xs text-slate-200">
                📄 {selectedFile?.name || 'captured_antenatal_card.jpg'}
              </span>
              <span>Size: {formatFileSize(selectedFile?.size || 245000)}</span>
            </div>

            {/* Three Preview Action Buttons */}
            <div className="flex flex-wrap gap-2.5 justify-center">
              {/* Button 1: Analyze Again */}
              <button
                type="button"
                data-ocr-trigger="true"
                onClick={() => triggerAiAnalysis()}
                disabled={isAnalyzing}
                className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-md flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Analyze Again
              </button>

              {/* Button 2: Replace Image */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isAnalyzing}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 flex items-center gap-2"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Replace Image
              </button>

              {/* Button 3: Cancel Image */}
              <button
                type="button"
                onClick={handleCancelImage}
                disabled={isAnalyzing}
                className="px-4 py-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 font-bold text-xs rounded-xl border border-red-500/40 flex items-center gap-2"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-400" />
                Cancel Image
              </button>
            </div>
          </div>
        ) : (
          /* Two Options Side by Side */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full text-left">
            {/* OPTION 1: Scan Antenatal Card */}
            <div className="bg-slate-950/70 border border-slate-800 hover:border-emerald-500/40 rounded-[20px] p-5 space-y-3 transition group flex flex-col justify-between">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-white flex items-center gap-1.5">
                    Scan Antenatal Card
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Use your device camera to scan the Karnataka Antenatal Card.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={startCamera}
                className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-500/20 transition flex items-center justify-center gap-2"
              >
                <Camera className="w-4 h-4" />
                Open Camera
              </button>
            </div>

            {/* OPTION 2: Upload Image / File */}
            <div className="bg-slate-950/70 border border-slate-800 hover:border-teal-500/40 rounded-[20px] p-5 space-y-3 transition group flex flex-col justify-between">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 group-hover:scale-110 transition-transform">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-white flex items-center gap-1.5">
                    Upload Image / File
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Upload an Antenatal Card file from your device.
                  </p>
                  <span className="inline-block mt-1.5 text-[10px] font-mono text-slate-500 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-md">
                    Formats: JPG, JPEG, PNG, PDF
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition flex items-center justify-center gap-2"
              >
                <Upload className="w-4 h-4 text-emerald-400" />
                Choose File
              </button>
            </div>
          </div>
        )}
      </div>

      {/* OCR Failure Warning Banner */}
      {errorMessage && (
        <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-xs text-amber-300 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">OCR Notice: </span>
            <span>{errorMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
};
