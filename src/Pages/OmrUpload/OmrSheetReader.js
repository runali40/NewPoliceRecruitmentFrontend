import React, { useState, useEffect } from 'react';
import OMRUpload from './OmrUpload';

const OMRSheetReader = () => {
  const [processedImage, setProcessedImage] = useState(null);
  const [result, setResult] = useState(null);
  const [cvReady, setCvReady] = useState(false);

  useEffect(() => {
    // Check if cv (OpenCV) is loaded and ready
    const checkOpenCV = setInterval(() => {
      if (window.cv && window.cv.imread) {
        setCvReady(true);
        clearInterval(checkOpenCV);
      }
    }, 100);

    // Cleanup the interval when the component unmounts
    return () => clearInterval(checkOpenCV);
  }, []);

  const onImageUpload = (imageSrc) => {
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      if (cvReady) {
        processImage(img);
      } else {
        console.error("OpenCV is not ready yet.");
      }
    };
  };

  const processImage = (img) => {
    const cv = window.cv;
    const src = cv.imread(img);
    const dst = new cv.Mat();

    // Convert the image to grayscale
    cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY, 0);

    // Thresholding to convert the image to binary
    cv.threshold(dst, dst, 120, 255, cv.THRESH_BINARY_INV);

    // Use contours to detect marked circles
    const contours = new cv.MatVector();
    const hierarchy = new cv.Mat();
    cv.findContours(dst, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);

    // Analyze the contours to detect the filled bubbles
    const filledCircles = [];
    for (let i = 0; i < contours.size(); i++) {
      const contour = contours.get(i);
      const area = cv.contourArea(contour);
      if (area > 50 && area < 1000) {  // These thresholds can be adjusted
        filledCircles.push(contour);
      }
    }

    setResult(`Detected ${filledCircles.length} filled circles.`);

    cv.imshow('canvasOutput', dst);

    src.delete();
    dst.delete();
    contours.delete();
    hierarchy.delete();
  };

  return (
    <div>
      <h2>OMR Sheet Reader</h2>
      <OMRUpload onImageUpload={onImageUpload} />
      {cvReady ? (
        <canvas id="canvasOutput"></canvas>
      ) : (
        <p>Loading OpenCV, please wait...</p>
      )}
      <div>{result}</div>
    </div>
  );
};

export default OMRSheetReader;
