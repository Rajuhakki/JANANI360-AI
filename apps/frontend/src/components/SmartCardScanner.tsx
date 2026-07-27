import React, { useState, useRef, useCallback } from 'react';
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
  Eye,
  Image as ImageIcon,
  Loader2
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
  const [activeMode, setActiveMode] = useState<'scan' | 'photo' | 'document'>('scan');
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

  // Handle Drag & Drop
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

  const processFile = (file: File) => {
    setErrorMessage(null);
    setScanSuccess(false);
    setSelectedFile(file);

    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else if (file.type === 'application/pdf') {
      // PDF placeholder preview
      setPreviewUrl('pdf-placeholder');
    } else {
      setErrorMessage('Unsupported file format. Please upload JPG, JPEG, PNG, or PDF.');
      return;
    }
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
        'Unable to access device camera. Please check browser permissions or use the Upload Photo option.'
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

      // Convert dataUrl to File
      fetch(dataUrl)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], 'captured_antenatal_card.jpg', { type: 'image/jpeg' });
          setSelectedFile(file);
        });

      stopCamera();
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
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Scan className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              Smart Antenatal Card AI OCR
              <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                AI Vision
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Scan or upload the Karnataka Antenatal Card to auto-fill registration fields
            </p>
          </div>
        </div>

        {/* Scan Mode Tabs */}
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setActiveMode('scan')}
            className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg font-semibold transition flex items-center justify-center gap-1.5 ${
              activeMode === 'scan'
                ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            Scan Card
          </button>
          <button
            type="button"
            onClick={() => setActiveMode('photo')}
            className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg font-semibold transition flex items-center justify-center gap-1.5 ${
              activeMode === 'photo'
                ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            Upload Photo
          </button>
          <button
            type="button"
            onClick={() => setActiveMode('document')}
            className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg font-semibold transition flex items-center justify-center gap-1.5 ${
              activeMode === 'document'
                ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Image/PDF
          </button>
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
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-5 space-y-4 shadow-2xl relative">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Camera className="w-4 h-4 text-emerald-400" />
                Capture Karnataka Antenatal Card
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
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-bold"
                >
                  Upload Saved Photo Instead
                </button>
              </div>
            ) : (
              <div className="relative rounded-2xl overflow-hidden bg-black aspect-video border border-emerald-500/30 shadow-inner flex items-center justify-center">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                {/* Antenatal Card Frame Guide Overlay */}
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

      {/* Main Upload & Dropzone Card */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-3xl p-6 transition-all text-center flex flex-col items-center justify-center min-h-[220px] ${
          isDragOver
            ? 'border-emerald-400 bg-emerald-500/10 scale-[1.01]'
            : previewUrl
            ? 'border-emerald-500/40 bg-slate-950/60'
            : 'border-slate-800 hover:border-emerald-500/50 bg-slate-950/40'
        }`}
      >
        {/* Loading Overlay when AI Analyzing */}
        {isAnalyzing && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md rounded-3xl z-30 flex flex-col items-center justify-center p-6 space-y-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-emerald-500/20 border-t-emerald-400 animate-spin" />
              <Sparkles className="w-7 h-7 text-emerald-400 absolute inset-0 m-auto animate-pulse" />
            </div>
            <div className="text-center space-y-1">
              <h4 className="text-base font-black text-white">Analyzing Antenatal Card...</h4>
              <p className="text-xs text-emerald-400 font-semibold">{analysisStep}</p>
              <p className="text-[11px] text-slate-400">
                Detecting handwritten &amp; printed Kannada and English OCR entries
              </p>
            </div>
          </div>
        )}

        {/* Display Preview if available */}
        {previewUrl ? (
          <div className="w-full space-y-4">
            <div className="relative max-h-56 overflow-hidden rounded-2xl border border-slate-800 bg-black/60 flex items-center justify-center">
              {previewUrl === 'pdf-placeholder' ? (
                <div className="p-8 text-center space-y-2">
                  <FileText className="w-12 h-12 text-emerald-400 mx-auto" />
                  <span className="block text-xs font-bold text-slate-200">{selectedFile?.name}</span>
                  <span className="text-[10px] text-slate-400">PDF Document Ready for OCR</span>
                </div>
              ) : (
                <img
                  src={previewUrl}
                  alt="Antenatal Card Preview"
                  className="max-h-56 object-contain rounded-xl"
                />
              )}

              {/* Status Badge */}
              <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur border border-emerald-500/40 rounded-full px-3 py-1 text-[11px] font-bold text-emerald-300 flex items-center gap-1.5">
                <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
                {scanSuccess ? 'OCR Extraction Complete' : 'Card Loaded'}
              </div>
            </div>

            {/* Action Bar inside Preview */}
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                type="button"
                data-ocr-trigger="true"
                onClick={runAiAnalysis}
                disabled={isAnalyzing}
                className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-md flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                {scanSuccess ? 'Re-Analyze Card with AI' : 'Analyze Card with AI'}
              </button>

              <button
                type="button"
                onClick={startCamera}
                disabled={isAnalyzing}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 flex items-center gap-2"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Retake Photo
              </button>

              <button
                type="button"
                onClick={handleResetScan}
                disabled={isAnalyzing}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl border border-slate-700 flex items-center gap-2"
              >
                <Upload className="w-3.5 h-3.5" />
                Upload Another Card
              </button>
            </div>
          </div>
        ) : (
          /* Placeholder state before upload */
          <div className="space-y-4 max-w-sm">
            <div className="flex items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Camera className="w-6 h-6" />
              </div>
              <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
                <Upload className="w-6 h-6" />
              </div>
            </div>

            <div>
              <h4 className="text-base font-black text-white flex items-center justify-center gap-2">
                <span>Scan Antenatal Card</span>
                <span className="text-slate-500 font-normal text-xs">OR</span>
                <span className="text-emerald-400">Upload Card Image</span>
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                AI will automatically read handwritten &amp; printed Kannada/English text and fill the form below.
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Supports Camera Access, JPG, JPEG, PNG, PDF &amp; Drag &amp; Drop
              </p>
            </div>

            {/* Two Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              {/* Button 1: Open Camera */}
              <button
                type="button"
                onClick={startCamera}
                className="flex-1 py-3.5 px-4 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-500/20 transition flex items-center justify-center gap-2"
              >
                <Camera className="w-4 h-4" />
                Open Camera
              </button>

              {/* Button 2: Upload Image */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 py-3.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition flex items-center justify-center gap-2"
              >
                <Upload className="w-4 h-4 text-emerald-400" />
                Upload Image
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
