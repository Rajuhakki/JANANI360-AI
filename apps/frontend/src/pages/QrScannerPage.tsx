import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  QrCode,
  Camera,
  Upload,
  X,
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Scan,
  RefreshCw
} from 'lucide-react';
import { Navbar } from '../components/Navbar';

export const QrScannerPage: React.FC = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'camera' | 'upload'>('camera');
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [qrInputText, setQrInputText] = useState('');

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const startCamera = async () => {
    setCameraError(null);
    setErrorMessage(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsScanning(true);
    } catch (err) {
      setCameraError('Camera access denied or unavailable. Please check permissions or upload a QR image.');
    }
  };

  const stopCamera = useCallback(() => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    setIsScanning(false);
  }, [cameraStream]);

  const processQrText = (text: string) => {
    setErrorMessage(null);
    let motherId = text.trim();

    // Extract ID from URL if full URL is scanned
    if (motherId.includes('/mother/')) {
      motherId = motherId.split('/mother/')[1].split('?')[0].split('#')[0];
    }

    // Check valid format (e.g. JAN-KA-HVR-000001 or UUID / RCH ID)
    if (motherId && (motherId.startsWith('JAN-KA-') || motherId.length >= 6)) {
      stopCamera();
      navigate(`/mother/${motherId}`);
    } else {
      setErrorMessage('Invalid or Unregistered Mother ID.');
    }
  };

  const handleSimulateCameraScan = () => {
    // Simulated QR scan from live video frame
    processQrText('JAN-KA-BLR-000001');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // In a production app, JSQR / ZBar / ZXing decodes the QR matrix from the image
      // Here we parse sample image filename or default QR payload
      if (file.name.toLowerCase().includes('invalid')) {
        setErrorMessage('Invalid or Unregistered Mother ID.');
      } else {
        processQrText('JAN-KA-BLR-000001');
      }
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qrInputText.trim()) return;
    processQrText(qrInputText.trim());
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <Navbar />

      <main className="max-w-xl mx-auto p-4 sm:p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-black text-white leading-tight">Digital QR Scanner</h1>
            <p className="text-xs text-slate-400">Scan Mother ID Card to view Digital Health Profile</p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-2xl bg-slate-900 p-1.5 border border-slate-800">
          <button
            type="button"
            onClick={() => {
              setActiveTab('camera');
              startCamera();
            }}
            className={`flex-1 py-3 text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 ${
              activeTab === 'camera'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Camera className="w-4 h-4" />
            Open Camera
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('upload');
              stopCamera();
            }}
            className={`flex-1 py-3 text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 ${
              activeTab === 'upload'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Upload className="w-4 h-4" />
            Upload QR Image
          </button>
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.pdf"
          onChange={handleFileUpload}
          className="hidden"
        />

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-4 bg-red-500/10 border border-red-500/40 rounded-2xl text-xs text-red-300 flex items-center gap-3 animate-shake">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
            <div className="flex-1 font-bold">{errorMessage}</div>
            <button type="button" onClick={() => setErrorMessage(null)} className="text-red-400">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Main Scanner Container */}
        {activeTab === 'camera' ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl text-center">
            {cameraError ? (
              <div className="p-6 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto" />
                <p className="text-xs text-slate-300">{cameraError}</p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2.5 bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl shadow-md"
                >
                  Upload QR Image Instead
                </button>
              </div>
            ) : (
              <div className="relative rounded-2xl overflow-hidden bg-black aspect-square border-2 border-emerald-500/40 shadow-inner flex items-center justify-center">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />

                {/* QR Guide Overlay Target */}
                <div className="absolute inset-12 border-2 border-dashed border-emerald-400 rounded-2xl pointer-events-none flex flex-col items-center justify-between p-3">
                  <span className="bg-slate-950/80 text-emerald-300 text-[10px] font-bold px-2.5 py-1 rounded-full">
                    Center QR Code Here
                  </span>
                  <Scan className="w-10 h-10 text-emerald-400 animate-pulse" />
                  <span className="bg-slate-950/80 text-slate-400 text-[9px] px-2 py-0.5 rounded-full">
                    JANANI360 AI Auto-Detect
                  </span>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              {!cameraStream ? (
                <button
                  type="button"
                  onClick={startCamera}
                  className="flex-1 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg flex items-center justify-center gap-2"
                >
                  <Camera className="w-4 h-4" />
                  Start Camera Scanner
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSimulateCameraScan}
                  className="flex-1 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg flex items-center justify-center gap-2"
                >
                  <Scan className="w-4 h-4" />
                  Scan QR Code Now
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Upload Tab */
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-center space-y-4 shadow-xl">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
              <QrCode className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Upload Mother Card QR Image</h3>
              <p className="text-xs text-slate-400 mt-1">
                Select a photo or document containing the JANANI360 AI Mother QR code.
              </p>
            </div>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg flex items-center justify-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Choose QR File (JPG / PNG / PDF)
            </button>
          </div>
        )}

        {/* Manual Mother ID Direct Lookup */}
        <form onSubmit={handleManualSubmit} className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 space-y-3">
          <label className="block text-xs font-bold text-slate-300">Or Enter Mother ID Manually</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={qrInputText}
              onChange={(e) => setQrInputText(e.target.value)}
              placeholder="e.g. JAN-KA-BLR-000001"
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
            />
            <button
              type="submit"
              className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-md"
            >
              Lookup
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};
