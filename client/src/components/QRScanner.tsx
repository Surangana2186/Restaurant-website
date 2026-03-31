import React, { useState, useEffect, useRef } from 'react';
import './QRScanner.css';

interface QRScannerProps {
  onScanSuccess: (result: string) => void;
  onClose: () => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onScanSuccess, onClose }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string>('');
  const [result, setResult] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    startScanner();
    return () => {
      stopScanner();
    };
  }, []);

  const startScanner = async () => {
    try {
      setIsScanning(true);
      setError('');
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
      
      // Start QR code detection
      detectQRCode();
    } catch (err) {
      setError('Camera access denied. Please allow camera permissions.');
      setIsScanning(false);
    }
  };

  const stopScanner = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  };

  const detectQRCode = () => {
    if (!isScanning || !videoRef.current) return;

    // Simple QR code detection simulation
    // In production, you'd use a proper QR code library
    setTimeout(() => {
      if (Math.random() > 0.7) { // Simulate successful scan
        const mockResults = [
          'TABLE-001',
          'TABLE-002', 
          'MENU-ITEM-001',
          'PAYMENT-QR-12345',
          'RESTAURANT-MENU'
        ];
        const randomResult = mockResults[Math.floor(Math.random() * mockResults.length)];
        setResult(randomResult);
        onScanSuccess(randomResult);
        stopScanner();
      } else {
        detectQRCode(); // Continue scanning
      }
    }, 2000);
  };

  const handleManualInput = (value: string) => {
    setResult(value);
    onScanSuccess(value);
    onClose();
  };

  return (
    <div className="qr-scanner-overlay">
      <div className="qr-scanner-modal">
        <div className="scanner-header">
          <h2>📷 QR Code Scanner</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        
        <div className="scanner-content">
          {error ? (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              <p>{error}</p>
              <button className="retry-btn" onClick={startScanner}>
                🔄 Retry Camera Access
              </button>
            </div>
          ) : (
            <>
              <div className="video-container">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="scanner-video"
                />
                <div className="scan-overlay">
                  <div className="scan-frame"></div>
                  <div className="scan-line"></div>
                </div>
              </div>
              
              {isScanning && (
                <div className="scanning-indicator">
                  <div className="pulse-dot"></div>
                  <p>Scanning QR Code...</p>
                </div>
              )}
              
              {result && (
                <div className="scan-result">
                  <h3>✅ Scan Successful!</h3>
                  <p className="result-text">{result}</p>
                </div>
              )}
            </>
          )}
        </div>
        
        <div className="scanner-footer">
          <div className="manual-input-section">
            <p>Or enter code manually:</p>
            <input
              type="text"
              placeholder="Enter table number or code"
              className="manual-input"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleManualInput((e.target as HTMLInputElement).value);
                }
              }}
            />
            <button 
              className="manual-submit-btn"
              onClick={(e) => {
                const input = document.querySelector('.manual-input') as HTMLInputElement;
                handleManualInput(input.value);
              }}
            >
              Submit
            </button>
          </div>
          
          <div className="scanner-tips">
            <h4>💡 Tips:</h4>
            <ul>
              <li>Point camera at QR code</li>
              <li>Ensure good lighting</li>
              <li>Hold steady for 2-3 seconds</li>
              <li>Works with table QR codes & menu items</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRScanner;
