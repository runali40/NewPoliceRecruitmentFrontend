import React, { useRef, useState, useEffect } from 'react';
import Tesseract from 'tesseract.js';
 
const ScanChestNo = () => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isScanning, setIsScanning] = useState(true); // Control scanning
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
 
  // Start the camera when the component mounts
  useEffect(() => {
    const startCamera = async () => {
      try {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
 
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        streamRef.current = stream;
 
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play().catch((err) => {
              console.error('Error starting video playback:', err);
              setError('Error starting video playback. Please try again.');
            });
          };
        }
      } catch (err) {
        console.error('Error accessing the camera:', err);
        setError('Error accessing the camera. Please make sure you have granted camera permissions.');
      }
    };
 
    startCamera();
 
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);
 
  // Automatically capture images when scanning is enabled
  useEffect(() => {
    const captureAndScan = () => {
      if (videoRef.current && !videoRef.current.paused && isScanning) {
        captureImage();
      }
    };
 
    const intervalId = setInterval(captureAndScan, 5000); // Capture image every 5 seconds
 
    return () => {
      clearInterval(intervalId);
    };
  }, [isScanning]);
 
  // Capture an image from the video feed
  const captureImage = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (canvas && video) {
      const ctx = canvas.getContext('2d');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0);
 
      // Enhance image quality for better OCR results
      enhanceImage(canvas);
 
      scanImage(canvas);
    }
  };
 
  // Enhance the image for better OCR results
  const enhanceImage = (canvas) => {
    const ctx = canvas.getContext('2d');
    ctx.filter = 'contrast(150%) brightness(120%)'; // Example enhancement
    ctx.drawImage(canvas, 0, 0);
  };
 
  // Perform OCR on the captured image and stop scanning after detecting digits
  const scanImage = (canvas) => {
    setLoading(true);
    Tesseract.recognize(
      canvas,
      'eng',
      {
        logger: (info) => console.log(info),
      }
    ).then(({ data: { text } }) => {
      const digits = text.match(/\d+/g);
      if (digits) {
        const numbers = digits.join(' ');
        setText(numbers);
        console.log('Detected Numbers:', numbers);
        setIsScanning(false); // Stop scanning once numbers are detected
      } else {
        setText('No digits detected');
        console.log('No digits detected');
      }
      setLoading(false);
    }).catch(error => {
      console.error('Error during OCR:', error);
      setLoading(false);
    });
  };
 
  // Toggle scanning
  const toggleScanning = () => {
    setIsScanning(!isScanning);
    setText(''); // Clear previous results
  };
 
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#f0f0f0',
      padding: '1rem'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}>
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          textAlign: 'center',
          padding: '1rem',
          margin: 0,
          backgroundColor: '#f8f8f8',
          borderBottom: '1px solid #e0e0e0'
        }}>Page Number Scanner</h2>
        <div style={{ padding: '1rem' }}>
          {error ? (
            <p style={{ color: 'red' }}>{error}</p>
          ) : (
            <>
              <div style={{
                position: 'relative',
                width: '100%',
                height: '192px',
                marginBottom: '1rem',
                overflow: 'hidden',
                borderRadius: '4px'
              }}>
                <video
                  ref={videoRef}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
                <canvas ref={canvasRef} style={{ display: 'none' }} />
                {loading && (
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    color: 'white'
                  }}>
                    Scanning...
                  </div>
                )}
              </div>
              <button
                onClick={toggleScanning}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  marginBottom: '1rem',
                  backgroundColor: isScanning ? '#ef4444' : '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s'
                }}
              >
                {isScanning ? 'Stop Scanning' : 'Start Scanning'}
              </button>
              {text && (
                <div style={{
                  backgroundColor: '#f0f0f0',
                  padding: '1rem',
                  borderRadius: '4px'
                }}>
                  <h3 style={{
                    fontWeight: 'bold',
                    marginBottom: '0.5rem'
                  }}>Detected Numbers:</h3>
                  <p>{text}</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
 
export default ScanChestNo;