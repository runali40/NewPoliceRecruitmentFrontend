import React, { useRef, useCallback, useState } from "react";
import Webcam from "react-webcam";
import Tesseract from "tesseract.js";

const videoConstraints = {
  width: 540,
  facingMode: "environment",
};

const ImageScanWithButton = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null); // Reference to the canvas element for drawing
  const [recognizedText, setRecognizedText] = useState(null);
  const [detectedNumber, setDetectedNumber] = useState(null);
  const [processing, setProcessing] = useState(false); // To track whether processing is ongoing

  const preprocessImage = useCallback((imageSrc) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = imageSrc;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        // Convert to grayscale
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
          const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
          data[i] = avg; // Red
          data[i + 1] = avg; // Green
          data[i + 2] = avg; // Blue
        }
        ctx.putImageData(imageData, 0, 0);

        resolve(canvas.toDataURL('image/jpeg', 0.8)); // Adjust quality if needed
      };
    });
  }, []);

  const captureAndDetect = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      setProcessing(true); // Start processing
      preprocessImage(imageSrc).then((processedImageSrc) => {
        Tesseract.recognize(processedImageSrc, 'eng', { logger: m => console.log(m) })
          .then(({ data: { text } }) => {
            console.log("Recognized text:", text);
            setRecognizedText(text);

            // Extract numeric values from recognized text
            const numbers = text.match(/\b\d+\b/g); // Match standalone sequences of digits
            if (numbers && numbers.length > 0) {
              const detectedNumber = numbers[0]; // Take the first detected number
              console.log("Detected number:", detectedNumber);
              setDetectedNumber(detectedNumber);

              // Draw detected number on the canvas
              const canvas = canvasRef.current;
              const ctx = canvas.getContext('2d');
              ctx.clearRect(0, 0, canvas.width, canvas.height);
              ctx.font = "24px Arial";
              ctx.fillStyle = "red";
              ctx.fillText(`Detected number: ${detectedNumber}`, 10, 50);
            } else {
              console.log("No standalone number detected.");
              setDetectedNumber(null);
            }
          })
          .catch(error => {
            console.error("Error recognizing text:", error);
          })
          .finally(() => {
            setProcessing(false); // Finish processing
          });
      });
    }
  }, [preprocessImage]);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setRecognizedText(null);
    setDetectedNumber(null);
  }, []);

  return (
    <div>
      <Webcam
        className="my-3"
        id="clickPhoto"
        style={{ height: "100%", width: "50%" }}
        ref={webcamRef}
        audio={false}
        screenshotFormat="image/png"
        videoConstraints={videoConstraints}
        onUserMedia={e => console.log("User media captured:", e)}
        onUserMediaError={err => console.error("onUserMediaError:", err)}
        mirrored={false}
      />
      <canvas ref={canvasRef} style={{ display: 'block', marginTop: '10px' }}></canvas>
      {recognizedText && <p>Recognized text: {recognizedText}</p>}
      <div>
        <button onClick={captureAndDetect}>Capture and Detect Number</button>
        <button onClick={clearCanvas}>Refresh</button>
      </div>
    </div>
  );
};

export default ImageScanWithButton;
