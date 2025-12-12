import React, { useState, useEffect, useCallback, useRef } from "react";
import Webcam from "react-webcam";
import { Table, Modal, Button, Form, Row, Col } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { CaptureFinger } from "./Mfs100";
import UrlData from "../../UrlData";
import CryptoJS from "crypto-js";
import Storage from "../../Storage";
import { apiClient } from "../../apiClient";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ErrorHandler from "../../Components/ErrorHandler";
import { ArrowBack } from "@material-ui/icons";
import SignatureCanvas from 'react-signature-canvas';

const Biometric = () => {
  const navigate = useNavigate();
  const [url, setUrl] = useState(null);
  const [devices, setDevices] = useState([]);
  const [deviceId, setDeviceId] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [biometricIv, setBiometricIV] = useState("")
  const webcamRef = useRef(null);
  const location = useLocation();

  const { selectedValue, candidateId, fullNameEnglish, chestNo, category } =
    location.state || {};
  // console.log(fullNameEnglish, "26")
  //   const allData = JSON.parse(localStorage.getItem("allCandidateData")) || [];
  const [fingerImage, setFingerImage] = useState("");
  const [fingerImage1, setFingerImage1] = useState("");
  const [fingerImage2, setFingerImage2] = useState("");
  const [fingerImage3, setFingerImage3] = useState("");
  const [fingerImage4, setFingerImage4] = useState("");
  const [fingerImage5, setFingerImage5] = useState("");
  const [fingerImage6, setFingerImage6] = useState("");
  const [fingerImage7, setFingerImage7] = useState("");
  const [fingerImage8, setFingerImage8] = useState("");
  const [fingerImage9, setFingerImage9] = useState("");
  const [fingerImage10, setFingerImage10] = useState("");
  const [thumbImg, setThumbImg] = useState("");
  const [facingMode, setFacingMode] = useState("environment");
  const [showModal, setShowModal] = useState(false)
  const biometricSignRef = useRef();
  const handleShow = () => {
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);

  const handleFlipCamera = () => {
    if (devices.length === 0) return; // No camera devices available

    if (devices.length > 1) {
      // More than one camera available (like laptop with external webcam)
      setFacingMode((prevMode) => {
        // Toggle facing mode
        const newMode = prevMode === "user" ? "environment" : "user"; // Switch between front and back cameras
        return newMode;
      });

      setDeviceId((prevDeviceId) => {
        // Determine new device ID based on the new facing mode
        const newDeviceId =
          facingMode === "environment" ? devices[1]?.deviceId : devices[0]?.deviceId; // Switch between the two
        return newDeviceId || prevDeviceId; // Fallback to previous if not available
      });
    } else {
      // Handle devices with only front and back camera (like mobile devices)
      const newFacingMode = "environment"; // Always use back camera when there's only one device
      setFacingMode(newFacingMode);
      setDeviceId(devices[0].deviceId); // Use the available camera
    }
  };


  const videoConstraints = {
    width: 540,
    facingMode: facingMode,
    deviceId: deviceId || undefined,
  };
  useEffect(() => {
    const getDevices = async () => {
      try {
        const mediaDevices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = mediaDevices.filter((device) => device.kind === "videoinput");
        setDevices(videoDevices);
        if (videoDevices.length > 0) {
          setDeviceId(videoDevices[0].deviceId); // Set the first device as default
        }
      } catch (error) {
        console.error("Error getting devices: ", error);
      }
    };

    getDevices();
  }, []);


  useEffect(() => {
    const generateSecretKey = () => {
      const key = CryptoJS.lib.WordArray.random(32); // 32 bytes = 256 bits
      return key.toString(CryptoJS.enc.Hex);
    };
    const key = generateSecretKey();
    // const key ="eb7b5de469bed866f1a5360ef7ec87d85d4786a0ea40692a3b7b54e103fc6dd7"
    setSecretKey(key);
    // localStorage.setItem("biometricKey", key)
    console.log(key, "secret key");
  }, []);

  const handleDevices = useCallback((mediaDevices) => {
    const videoDevices = mediaDevices.filter(
      ({ kind }) => kind === "videoinput"
    );
    setDevices(videoDevices);
    if (videoDevices.length > 0) {
      setDeviceId(videoDevices[0].deviceId);
    } else {
      console.error("No video devices found");
    }
  }, []);

  useEffect(() => {
    navigator.mediaDevices
      .enumerateDevices()
      .then(handleDevices)
      .catch((err) => {
        console.error("Error enumerating devices: ", err);
      });
  }, [handleDevices]);

  const capturePhoto = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      try {
        const key = CryptoJS.enc.Hex.parse(secretKey);
        const iv = CryptoJS.lib.WordArray.random(16); // Generate a 16-byte IV
        setBiometricIV(iv.toString(CryptoJS.enc.Hex));
        console.log(typeof biometricIv)
        // Extract the base64 part of the image
        const base64Image = imageSrc.split(",")[1];
        const wordArrayImage = CryptoJS.enc.Base64.parse(base64Image);

        // Encrypt the image
        const encryptedImage = CryptoJS.AES.encrypt(wordArrayImage, key, { iv });

        // Combine IV and encrypted data for storage
        const encryptedImageSrc = `${iv.toString(CryptoJS.enc.Hex)}:${encryptedImage.ciphertext.toString(CryptoJS.enc.Hex)}`;

        // localStorage.setItem("encryptedImage", encryptedImageSrc);
        setUrl(encryptedImageSrc); // Store URL if needed
        toast.success("Photo Capture Successfully!")
      } catch (error) {
        console.error("Error during encryption:", error);
      }
    } else {
      console.error("Webcam ref not found");
    }
  }, [webcamRef, secretKey]);

  // Decrypt the Encrypted Image (Biometric)
  const decryptImage = useCallback((encryptedImage) => {

    try {
      const [ivHex, encryptedHex] = encryptedImage.split(":"); // Split IV and ciphertext
      const key = CryptoJS.enc.Hex.parse(secretKey); // Parse secret key
      const iv = CryptoJS.enc.Hex.parse(ivHex); // Parse IV
      // Decrypt the image
      const decryptedBytes = CryptoJS.AES.decrypt(
        { ciphertext: CryptoJS.enc.Hex.parse(encryptedHex) },
        key,
        { iv, padding: CryptoJS.pad.Pkcs7 } // Use Pkcs7 padding
      );
      // Convert decrypted WordArray back to Base64 string
      const decryptedBase64 = CryptoJS.enc.Base64.stringify(decryptedBytes);
      return `data:image/png;base64,${decryptedBase64}`; // Return image in Base64 format
    } catch (error) {
      console.error("Error during decryption:", error);
      return ""; // Return empty string if error occurs
    }
  }, [secretKey]);


  // Use the decrypted image
  const decryptedImageUrl = url ? decryptImage(url) : null;

  const onUserMedia = (e) => {
    console.log("User media captured: ", e);
  };

  useEffect(() => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.error("getUserMedia not supported on your browser!");
      return;
    }
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        console.log("User media stream: ", stream);
      })
      .catch((err) => {
        console.error("Error accessing user media: ", err);
      });
  }, []);
  //capture 1//
  // const CaptureFingerHere1 = () => {
  //   const fingerData = new CaptureFinger();
  //   const base64Image = fingerData.data.BitmapData;
  //   // setFingerImage(base64Image);
  //   try {
  //     const key = CryptoJS.enc.Hex.parse(secretKey);
  //     const iv = CryptoJS.lib.WordArray.random(16); // AES IV, 16 bytes (128 bits)

  //     // Extract base64 from the data URL
  //     const base64Image1 = base64Image;

  //     const encryptedFinger = CryptoJS.AES.encrypt(base64Image1, key, { iv });
  //     const encryptedFingerSrc = `${iv.toString(
  //       CryptoJS.enc.Hex
  //     )}:${encryptedFinger.toString()}`;

  //     console.log("Encrypted photo:", encryptedFingerSrc);
  //     if (
  //       setFingerImage1(encryptedFingerSrc)
  //     ) {
  //       toast.success("Finger Capture Successfully!")
  //     }

  //     // toast.success("Finger Capture Successfully!")
  //   } catch (error) {
  //     console.error("Error during encryption:", error);
  //   }
  // };
  const CaptureFingerHere1 = async () => {
    try {
      // Show loading toast
      const loadingToast = toast.loading("Capturing fingerprint...");

      // Step 1: Capture finger (this is async now)
      const fingerData = await CaptureFinger(60, 10000);

      // Step 2: Check if capture was successful
      if (!fingerData.success || !fingerData.data) {
        toast.dismiss(loadingToast);
        toast.error(fingerData.message || "Fingerprint capture failed!");
        return null;
      }

      // Step 3: Get base64 image from response
      const base64Image = fingerData.data.BitmapData;

      if (!base64Image) {
        toast.dismiss(loadingToast);
        toast.error("No fingerprint image data received!");
        return null;
      }

      // Step 4: Encrypt the fingerprint data
      const key = CryptoJS.enc.Hex.parse(secretKey);
      const iv = CryptoJS.lib.WordArray.random(16); // 16 bytes IV

      // Encrypt the base64 image
      const encryptedFinger = CryptoJS.AES.encrypt(base64Image, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });

      // Combine IV and encrypted data
      const encryptedFingerSrc = `${iv.toString(CryptoJS.enc.Hex)}:${encryptedFinger.toString()}`;

      console.log("Encrypted photo:", encryptedFingerSrc);

      // Step 5: Set the encrypted finger image in state
      setFingerImage1(encryptedFingerSrc);

      // Dismiss loading and show success
      toast.dismiss(loadingToast);
      toast.success("Finger captured successfully!");

      // Return the encrypted data for further use
      return {
        encrypted: encryptedFingerSrc,
        raw: base64Image,
        template: fingerData.data.IsoTemplate || fingerData.data.AnsiTemplate
      };

    } catch (error) {
      console.error("Error during fingerprint capture:", error);
      toast.error("Error: " + (error.message || "Failed to capture fingerprint"));
      return null;
    }
  };

  //capture 2//
  // const CaptureFingerHere2 = () => {
  //   const fingerData = new CaptureFinger();
  //   const base64Image = fingerData.data.BitmapData;
  //   // setFingerImage(base64Image);
  //   try {
  //     const key = CryptoJS.enc.Hex.parse(secretKey);
  //     const iv = CryptoJS.lib.WordArray.random(16); // AES IV, 16 bytes (128 bits)

  //     // Extract base64 from the data URL
  //     const base64Image1 = base64Image;

  //     const encryptedFinger = CryptoJS.AES.encrypt(base64Image1, key, { iv });
  //     const encryptedFingerSrc = `${iv.toString(
  //       CryptoJS.enc.Hex
  //     )}:${encryptedFinger.toString()}`;

  //     console.log("Encrypted photo:", encryptedFingerSrc);
  //     if (
  //       setFingerImage2(encryptedFingerSrc)
  //     ) {
  //       toast.success("Finger Capture Successfully!")
  //     }

  //     // toast.success("Finger Capture Successfully!")
  //   } catch (error) {
  //     console.error("Error during encryption:", error);
  //   }
  // };

  const CaptureFingerHere2 = async () => {
  try {
    // Show loading toast
    const loadingToast = toast.loading("Capturing fingerprint 2...");
    
    // Step 1: Capture finger (this is async now)
    const fingerData = await CaptureFinger(60, 10000);
    
    // Step 2: Check if capture was successful
    if (!fingerData.success || !fingerData.data) {
      toast.dismiss(loadingToast);
      toast.error(fingerData.message || "Fingerprint capture failed!");
      return null;
    }
    
    // Step 3: Get base64 image from response
    const base64Image = fingerData.data.BitmapData;
    
    if (!base64Image) {
      toast.dismiss(loadingToast);
      toast.error("No fingerprint image data received!");
      return null;
    }
    
    // Step 4: Encrypt the fingerprint data
    const key = CryptoJS.enc.Hex.parse(secretKey);
    const iv = CryptoJS.lib.WordArray.random(16); // 16 bytes IV
    
    // Encrypt the base64 image
    const encryptedFinger = CryptoJS.AES.encrypt(base64Image, key, { 
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    
    // Combine IV and encrypted data
    const encryptedFingerSrc = `${iv.toString(CryptoJS.enc.Hex)}:${encryptedFinger.toString()}`;
    
    console.log("Encrypted photo 2:", encryptedFingerSrc);
    
    // Step 5: Set the encrypted finger image in state
    setFingerImage2(encryptedFingerSrc);
    
    // Dismiss loading and show success
    toast.dismiss(loadingToast);
    toast.success("Finger 2 captured successfully!");
    
    // Return the encrypted data for further use
    return {
      encrypted: encryptedFingerSrc,
      raw: base64Image,
      template: fingerData.data.IsoTemplate || fingerData.data.AnsiTemplate
    };
    
  } catch (error) {
    console.error("Error during fingerprint 2 capture:", error);
    toast.error("Error: " + (error.message || "Failed to capture fingerprint 2"));
    return null;
  }
};

  //capture 3//
  const CaptureFingerHere3 = () => {
    const fingerData = new CaptureFinger();
    const base64Image = fingerData.data.BitmapData;
    // setFingerImage(base64Image);
    try {
      const key = CryptoJS.enc.Hex.parse(secretKey);
      const iv = CryptoJS.lib.WordArray.random(16); // AES IV, 16 bytes (128 bits)

      // Extract base64 from the data URL
      const base64Image1 = base64Image;

      const encryptedFinger = CryptoJS.AES.encrypt(base64Image1, key, { iv });
      const encryptedFingerSrc = `${iv.toString(
        CryptoJS.enc.Hex
      )}:${encryptedFinger.toString()}`;

      console.log("Encrypted photo:", encryptedFingerSrc);
      if (
        setFingerImage3(encryptedFingerSrc)
      ) {
        toast.success("Finger Capture Successfully!")
      }

      // toast.success("Finger Capture Successfully!")
    } catch (error) {
      console.error("Error during encryption:", error);
    }
  };

  //capture 4//
  const CaptureFingerHere4 = () => {
    const fingerData = new CaptureFinger();
    const base64Image = fingerData.data.BitmapData;
    // setFingerImage(base64Image);
    try {
      const key = CryptoJS.enc.Hex.parse(secretKey);
      const iv = CryptoJS.lib.WordArray.random(16); // AES IV, 16 bytes (128 bits)

      // Extract base64 from the data URL
      const base64Image1 = base64Image;

      const encryptedFinger = CryptoJS.AES.encrypt(base64Image1, key, { iv });
      const encryptedFingerSrc = `${iv.toString(
        CryptoJS.enc.Hex
      )}:${encryptedFinger.toString()}`;

      console.log("Encrypted photo:", encryptedFingerSrc);
      if (
        setFingerImage4(encryptedFingerSrc)
      ) {
        toast.success("Finger Capture Successfully!")
      }

      // toast.success("Finger Capture Successfully!")
    } catch (error) {
      console.error("Error during encryption:", error);
    }
  };

  //capture 5//
  const CaptureFingerHere5 = () => {
    const fingerData = new CaptureFinger();
    const base64Image = fingerData.data.BitmapData;
    // setFingerImage(base64Image);
    try {
      const key = CryptoJS.enc.Hex.parse(secretKey);
      const iv = CryptoJS.lib.WordArray.random(16); // AES IV, 16 bytes (128 bits)

      // Extract base64 from the data URL
      const base64Image1 = base64Image;

      const encryptedFinger = CryptoJS.AES.encrypt(base64Image1, key, { iv });
      const encryptedFingerSrc = `${iv.toString(
        CryptoJS.enc.Hex
      )}:${encryptedFinger.toString()}`;

      console.log("Encrypted photo:", encryptedFingerSrc);
      if (
        setFingerImage5(encryptedFingerSrc)
      ) {
        toast.success("Finger Capture Successfully!")
      }

      // toast.success("Finger Capture Successfully!")
    } catch (error) {
      console.error("Error during encryption:", error);
    }
  };

  //capture 6//
  const CaptureFingerHere6 = () => {
    const fingerData = new CaptureFinger();
    const base64Image = fingerData.data.BitmapData;
    // setFingerImage(base64Image);
    try {
      const key = CryptoJS.enc.Hex.parse(secretKey);
      const iv = CryptoJS.lib.WordArray.random(16); // AES IV, 16 bytes (128 bits)

      // Extract base64 from the data URL
      const base64Image1 = base64Image;

      const encryptedFinger = CryptoJS.AES.encrypt(base64Image1, key, { iv });
      const encryptedFingerSrc = `${iv.toString(
        CryptoJS.enc.Hex
      )}:${encryptedFinger.toString()}`;

      console.log("Encrypted photo:", encryptedFingerSrc);
      if (
        setFingerImage6(encryptedFingerSrc)
      ) {
        toast.success("Finger Capture Successfully!")
      }

      // toast.success("Finger Capture Successfully!")
    } catch (error) {
      console.error("Error during encryption:", error);
    }
  };
  //capture 7//
  const CaptureFingerHere7 = () => {
    const fingerData = new CaptureFinger();
    const base64Image = fingerData.data.BitmapData;
    // setFingerImage(base64Image);
    try {
      const key = CryptoJS.enc.Hex.parse(secretKey);
      const iv = CryptoJS.lib.WordArray.random(16); // AES IV, 16 bytes (128 bits)

      // Extract base64 from the data URL
      const base64Image1 = base64Image;

      const encryptedFinger = CryptoJS.AES.encrypt(base64Image1, key, { iv });
      const encryptedFingerSrc = `${iv.toString(
        CryptoJS.enc.Hex
      )}:${encryptedFinger.toString()}`;

      console.log("Encrypted photo:", encryptedFingerSrc);
      if (
        setFingerImage7(encryptedFingerSrc)
      ) {
        toast.success("Finger Capture Successfully!")
      }

      // toast.success("Finger Capture Successfully!")
    } catch (error) {
      console.error("Error during encryption:", error);
    }
  };

  //capture 8//
  const CaptureFingerHere8 = () => {
    const fingerData = new CaptureFinger();
    const base64Image = fingerData.data.BitmapData;
    // setFingerImage(base64Image);
    try {
      const key = CryptoJS.enc.Hex.parse(secretKey);
      const iv = CryptoJS.lib.WordArray.random(16); // AES IV, 16 bytes (128 bits)

      // Extract base64 from the data URL
      const base64Image1 = base64Image;

      const encryptedFinger = CryptoJS.AES.encrypt(base64Image1, key, { iv });
      const encryptedFingerSrc = `${iv.toString(
        CryptoJS.enc.Hex
      )}:${encryptedFinger.toString()}`;

      console.log("Encrypted photo:", encryptedFingerSrc);
      if (
        setFingerImage8(encryptedFingerSrc)
      ) {
        toast.success("Finger Capture Successfully!")
      }

      // toast.success("Finger Capture Successfully!")
    } catch (error) {
      console.error("Error during encryption:", error);
    }
  };

  //capture 9//
  const CaptureFingerHere9 = () => {
    const fingerData = new CaptureFinger();
    const base64Image = fingerData.data.BitmapData;
    // setFingerImage(base64Image);
    try {
      const key = CryptoJS.enc.Hex.parse(secretKey);
      const iv = CryptoJS.lib.WordArray.random(16); // AES IV, 16 bytes (128 bits)

      // Extract base64 from the data URL
      const base64Image1 = base64Image;

      const encryptedFinger = CryptoJS.AES.encrypt(base64Image1, key, { iv });
      const encryptedFingerSrc = `${iv.toString(
        CryptoJS.enc.Hex
      )}:${encryptedFinger.toString()}`;

      console.log("Encrypted photo:", encryptedFingerSrc);
      if (
        setFingerImage9(encryptedFingerSrc)
      ) {
        toast.success("Finger Capture Successfully!")
      }

      // toast.success("Finger Capture Successfully!")
    } catch (error) {
      console.error("Error during encryption:", error);
    }
  };

  //capture 10//
  const CaptureFingerHere10 = () => {
    const fingerData = new CaptureFinger();
    const base64Image = fingerData.data.BitmapData;
    // setFingerImage(base64Image);
    try {
      const key = CryptoJS.enc.Hex.parse(secretKey);
      const iv = CryptoJS.lib.WordArray.random(16); // AES IV, 16 bytes (128 bits)

      // Extract base64 from the data URL
      const base64Image1 = base64Image;

      const encryptedFinger = CryptoJS.AES.encrypt(base64Image1, key, { iv });
      const encryptedFingerSrc = `${iv.toString(
        CryptoJS.enc.Hex
      )}:${encryptedFinger.toString()}`;

      console.log("Encrypted photo:", encryptedFingerSrc);
      if (
        setFingerImage10(encryptedFingerSrc)
      ) {
        toast.success("Finger Capture Successfully!")
      }

      // toast.success("Finger Capture Successfully!")
    } catch (error) {
      console.error("Error during encryption:", error);
    }
  };
  //decrypt finger 1//
  const decryptFinger1 = useCallback(
    (encryptedFinger) => {
      try {
        const [ivHex, encryptedData] = encryptedFinger.split(":");
        const key = CryptoJS.enc.Hex.parse(secretKey);
        const iv = CryptoJS.enc.Hex.parse(ivHex);

        const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, key, { iv });
        const decryptedBase64 = decryptedBytes.toString(CryptoJS.enc.Utf8);
        console.log("Decrypted image:", decryptedBase64);

        return `data:image/png;base64,${decryptedBase64}`;
      } catch (error) {
        console.error("Error during decryption:", error);
        return ""; // Handle the error as per your application's requirement
      }
    },
    [secretKey]
  );
  const decryptedFingerUrl1 = fingerImage1 ? decryptFinger1(fingerImage1) : null;

  //decrypt finger 2//
  const decryptFinger2 = useCallback(
    (encryptedFinger) => {
      try {
        const [ivHex, encryptedData] = encryptedFinger.split(":");
        const key = CryptoJS.enc.Hex.parse(secretKey);
        const iv = CryptoJS.enc.Hex.parse(ivHex);

        const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, key, { iv });
        const decryptedBase64 = decryptedBytes.toString(CryptoJS.enc.Utf8);
        console.log("Decrypted image:", decryptedBase64);

        return `data:image/png;base64,${decryptedBase64}`;
      } catch (error) {
        console.error("Error during decryption:", error);
        return ""; // Handle the error as per your application's requirement
      }
    },
    [secretKey]
  );

  const decryptedFingerUrl2 = fingerImage2
    ? decryptFinger2(fingerImage2)
    : null;

  //decrypt finger 3//
  const decryptFinger3 = useCallback(
    (encryptedFinger) => {
      try {
        const [ivHex, encryptedData] = encryptedFinger.split(":");
        const key = CryptoJS.enc.Hex.parse(secretKey);
        const iv = CryptoJS.enc.Hex.parse(ivHex);

        const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, key, { iv });
        const decryptedBase64 = decryptedBytes.toString(CryptoJS.enc.Utf8);
        console.log("Decrypted image:", decryptedBase64);

        return `data:image/png;base64,${decryptedBase64}`;
      } catch (error) {
        console.error("Error during decryption:", error);
        return ""; // Handle the error as per your application's requirement
      }
    },
    [secretKey]
  );

  const decryptedFingerUrl3 = fingerImage3
    ? decryptFinger3(fingerImage3)
    : null;

  //decrypt finger 4//
  const decryptFinger4 = useCallback(
    (encryptedFinger) => {
      try {
        const [ivHex, encryptedData] = encryptedFinger.split(":");
        const key = CryptoJS.enc.Hex.parse(secretKey);
        const iv = CryptoJS.enc.Hex.parse(ivHex);

        const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, key, { iv });
        const decryptedBase64 = decryptedBytes.toString(CryptoJS.enc.Utf8);
        console.log("Decrypted image:", decryptedBase64);

        return `data:image/png;base64,${decryptedBase64}`;
      } catch (error) {
        console.error("Error during decryption:", error);
        return ""; // Handle the error as per your application's requirement
      }
    },
    [secretKey]
  );

  const decryptedFingerUrl4 = fingerImage4
    ? decryptFinger4(fingerImage4)
    : null;

  //decrypt finger 5//
  const decryptFinger5 = useCallback(
    (encryptedFinger) => {
      try {
        const [ivHex, encryptedData] = encryptedFinger.split(":");
        const key = CryptoJS.enc.Hex.parse(secretKey);
        const iv = CryptoJS.enc.Hex.parse(ivHex);

        const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, key, { iv });
        const decryptedBase64 = decryptedBytes.toString(CryptoJS.enc.Utf8);
        console.log("Decrypted image:", decryptedBase64);

        return `data:image/png;base64,${decryptedBase64}`;
      } catch (error) {
        console.error("Error during decryption:", error);
        return ""; // Handle the error as per your application's requirement
      }
    },
    [secretKey]
  );

  const decryptedFingerUrl5 = fingerImage5
    ? decryptFinger5(fingerImage5)
    : null;

  //decrypt finger 6//
  const decryptFinger6 = useCallback(
    (encryptedFinger) => {
      try {
        const [ivHex, encryptedData] = encryptedFinger.split(":");
        const key = CryptoJS.enc.Hex.parse(secretKey);
        const iv = CryptoJS.enc.Hex.parse(ivHex);

        const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, key, { iv });
        const decryptedBase64 = decryptedBytes.toString(CryptoJS.enc.Utf8);
        console.log("Decrypted image:", decryptedBase64);

        return `data:image/png;base64,${decryptedBase64}`;
      } catch (error) {
        console.error("Error during decryption:", error);
        return ""; // Handle the error as per your application's requirement
      }
    },
    [secretKey]
  );

  const decryptedFingerUrl6 = fingerImage6
    ? decryptFinger6(fingerImage6)
    : null;

  //decrypt finger 7//
  const decryptFinger7 = useCallback(
    (encryptedFinger) => {
      try {
        const [ivHex, encryptedData] = encryptedFinger.split(":");
        const key = CryptoJS.enc.Hex.parse(secretKey);
        const iv = CryptoJS.enc.Hex.parse(ivHex);

        const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, key, { iv });
        const decryptedBase64 = decryptedBytes.toString(CryptoJS.enc.Utf8);
        console.log("Decrypted image:", decryptedBase64);

        return `data:image/png;base64,${decryptedBase64}`;
      } catch (error) {
        console.error("Error during decryption:", error);
        return ""; // Handle the error as per your application's requirement
      }
    },
    [secretKey]
  );

  const decryptedFingerUrl7 = fingerImage7
    ? decryptFinger7(fingerImage7)
    : null;

  //decrypt finger 8//
  const decryptFinger8 = useCallback(
    (encryptedFinger) => {
      try {
        const [ivHex, encryptedData] = encryptedFinger.split(":");
        const key = CryptoJS.enc.Hex.parse(secretKey);
        const iv = CryptoJS.enc.Hex.parse(ivHex);

        const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, key, { iv });
        const decryptedBase64 = decryptedBytes.toString(CryptoJS.enc.Utf8);
        console.log("Decrypted image:", decryptedBase64);

        return `data:image/png;base64,${decryptedBase64}`;
      } catch (error) {
        console.error("Error during decryption:", error);
        return ""; // Handle the error as per your application's requirement
      }
    },
    [secretKey]
  );

  const decryptedFingerUrl8 = fingerImage8
    ? decryptFinger8(fingerImage8)
    : null;

  //decrypt finger 9//
  const decryptFinger9 = useCallback(
    (encryptedFinger) => {
      try {
        const [ivHex, encryptedData] = encryptedFinger.split(":");
        const key = CryptoJS.enc.Hex.parse(secretKey);
        const iv = CryptoJS.enc.Hex.parse(ivHex);

        const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, key, { iv });
        const decryptedBase64 = decryptedBytes.toString(CryptoJS.enc.Utf8);
        console.log("Decrypted image:", decryptedBase64);

        return `data:image/png;base64,${decryptedBase64}`;
      } catch (error) {
        console.error("Error during decryption:", error);
        return ""; // Handle the error as per your application's requirement
      }
    },
    [secretKey]
  );

  const decryptedFingerUrl9 = fingerImage9
    ? decryptFinger9(fingerImage9)
    : null;

  //decrypt finger 10//
  const decryptFinger10 = useCallback(
    (encryptedFinger) => {
      try {
        const [ivHex, encryptedData] = encryptedFinger.split(":");
        const key = CryptoJS.enc.Hex.parse(secretKey);
        const iv = CryptoJS.enc.Hex.parse(ivHex);

        const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, key, { iv });
        const decryptedBase64 = decryptedBytes.toString(CryptoJS.enc.Utf8);
        console.log("Decrypted image:", decryptedBase64);

        return `data:image/png;base64,${decryptedBase64}`;
      } catch (error) {
        console.error("Error during decryption:", error);
        return ""; // Handle the error as per your application's requirement
      }
    },
    [secretKey]
  );

  const decryptedFingerUrl10 = fingerImage10
    ? decryptFinger10(fingerImage10)
    : null;

  const CompleteBiometric = () => {
    const storedToken = localStorage.getItem("UserCredential");
    const recruitId = localStorage.getItem("recruitId");
    const UserId = localStorage.getItem("userId");
    let signature = null;
    if (biometricSignRef.current && !biometricSignRef.current.isEmpty()) {
      signature = biometricSignRef.current.getTrimmedCanvas().toDataURL("image/png");
    }
    console.log(url, "encrypted url");
    if (url === null) {
      toast.warning("Please capture the photo!");
    } else {
      const data = {
        CandidateID: candidateId,
        UserId: UserId,
        RecruitId: recruitId,
        ChestNo: chestNo,
        Date: "2024-06-08",
        CategoryName: category,
        Signature: signature,
        Thumbstring: fingerImage1,
        Thumbstring1: fingerImage2,
        Thumbstring2: fingerImage3,
        Thumbstring3: fingerImage4,
        Thumbstring4: fingerImage5,
        Thumbstring5: fingerImage6,
        Thumbstring6: fingerImage7,
        Thumbstring7: fingerImage8,
        Thumbstring8: fingerImage9,
        Thumbstring9: fingerImage10,
        Imagestring: url, // This should be encrypted
        ivImage: biometricIv,
        secretkeys: secretKey
      };
      apiClient
        .post(`Scanningdoc/Insert`, data)
        .then((response) => {
          console.log("complete biometric", response.data.data);
          const token1 = response.data.outcome.tokens;
          Cookies.set("UserCredential", token1, { expires: 7 });
          toast.success("Biometric added successfully!");
          navigate(`/candidate/${candidateId}`, { state: { fullNameEnglish } });
        })
        .catch((error) => {
          if (
            error.response &&
            error.response.data &&
            error.response.data.outcome
          ) {
            const token1 = error.response.data.outcome.tokens;
            Cookies.set("UserCredential", token1, { expires: 7 });
          }
          console.log(error);
          const errors = ErrorHandler(error);
          toast.error(errors);
        });
    }
  };
  // ----------------- FINGER CAPTURE AND MODAL ---------------------

  // Instead of using two separate finger states, we use an array.
  // Each element holds the encrypted finger scan (or null if not captured yet).
  // const [fingerScans, setFingerScans] = useState([null]);

  // // Function to capture finger at a given row (index)
  // const captureFingerAt = (index) => {
  //   const fingerData = new CaptureFinger();
  //   const base64Image = fingerData.data.BitmapData; // Assume this returns a Base64 string
  //   try {
  //     const key = CryptoJS.enc.Hex.parse(secretKey);
  //     const iv = CryptoJS.lib.WordArray.random(16); // 16 bytes IV
  //     // Encrypt the finger image
  //     const encryptedFinger = CryptoJS.AES.encrypt(base64Image, key, { iv });
  //     const encryptedFingerSrc = `${iv.toString(CryptoJS.enc.Hex)}:${encryptedFinger.toString()}`;
  //     // Update the fingerScans array at the given index
  //     setFingerScans((prevScans) => {
  //       const newScans = [...prevScans];
  //       newScans[index] = encryptedFingerSrc;
  //       return newScans;
  //     });
  //     toast.success("Finger capture successfully!");
  //   } catch (error) {
  //     console.error("Error during encryption:", error);
  //   }
  // };
  // const addNewFingerRow = () => {
  //   setFingerScans((prevScans) => [...prevScans, null]);
  // };
  return (
    <>
      <div className="container-fluid p-3">
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-header py-3">
                <div className="row">
                  <div className="col-lg-10 col-md-10 col-10 my-auto">
                    <h5 className="fw-bold">Add Biometric</h5>

                    <h6 className="mt-3"><span className="fw-bold">Candidate Name:</span> {fullNameEnglish}</h6>
                  </div>
                  <div className="col-lg-2 col-md-2 col-2 d-flex flex-wrap justify-content-end">
                    <div
                      className="btn btn-add"
                      title="Back"
                      onClick={() => {
                        navigate(`/candidate/${candidateId}`, {
                          state: { fullNameEnglish },
                        });
                      }}
                    >
                      <button
                        className="btn btn-md text-light "
                        type="button"
                        style={{ backgroundColor: "#1B5A90" }}
                      >
                        <ArrowBack />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-body">

                <div className="row">
                  <div className="col-lg-12 col-md-12">
                    <div className="card-header bg-white">
                      <div className="row">
                        <div className="col-lg-4 col-md-4 ">
                          <button
                            className="btn btn-primary"
                            type="button"
                            onClick={CaptureFingerHere1}
                          >
                            Capture Finger 1
                          </button>
                        </div>
                        <div className="col-lg-4 col-md-4 mt-lg-0 mt-md-0 mt-2 ">
                          <button
                            className="btn btn-primary"
                            type="button"
                            onClick={CaptureFingerHere2}
                          >
                            Capture Finger 2
                          </button>
                        </div>
                        <div className="col-lg-4 col-md-4 mt-lg-0 mt-md-0 mt-2 ">
                          <button
                            className="btn btn-primary"
                            onClick={capturePhoto}
                          >
                            Capture Photo
                          </button>
                        </div>
                      </div>
                    </div>


                    <div className="row">
                      <div className="col-lg-4 col-md-4 my-3 mt-lg-0 mt-md-0 mt-2 ">
                        {
                          decryptedFingerUrl1 ? <img
                            src={decryptedFingerUrl1}
                            alt=""
                            style={{ height: "100%", width: "50%" }}
                          />
                            : <div
                              style={{
                                height: "75%",
                                width: "50%",
                                border: "1px solid #ccc",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: "#f9f9f9",
                                marginTop: "50px"
                              }}
                            >
                              Capture Finger 1
                            </div>
                        }

                      </div>
                      <div className="col-lg-4 col-md-4 my-3  mt-lg-0 mt-md-0 mt-2">
                        {
                          decryptedFingerUrl2 ?
                            <img
                              src={decryptedFingerUrl2}
                              alt=""
                              style={{ height: "100%", width: "50%" }}
                            /> : <div
                              style={{
                                height: "75%",
                                width: "50%",
                                border: "1px solid #ccc",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: "#f9f9f9",
                                marginTop: "50px"
                              }}
                            >
                              Capture Finger 2
                            </div>
                        }

                      </div>
                      <div className="col-lg-4 col-md-4  mt-lg-0 mt-md-0 mt-2">
                        {url ? (
                          <div className="my-3">
                            <img src={decryptedImageUrl} alt="screenshot" />
                          </div>
                        ) : (
                          <>
                            {/* <Webcam
                              className="my-3"
                              id="clickPhoto"
                              style={{ height: "110%", width: "70%" }}
                              ref={webcamRef}
                              audio={false}
                              screenshotFormat="image/png"
                              videoConstraints={{
                                ...videoConstraints,
                                deviceId: deviceId || undefined,
                              }}
                              onUserMedia={onUserMedia}
                              onUserMediaError={(err) =>
                                console.error("onUserMediaError: ", err)
                              }
                              mirrored={false}
                            /> */}
                            <Webcam
                              className="my-3"
                              id="clickPhoto"
                              style={{ height: "110%", width: "60%" }}
                              ref={webcamRef}
                              audio={false}
                              screenshotFormat="image/png"
                              videoConstraints={videoConstraints}
                              onUserMediaError={(err) => console.error("onUserMediaError: ", err)}
                            />
                            <button
                              className="btn btn-primary mx-3 d-xl-block d-lg-block d-md-none d-none"
                              type="button"
                              onClick={handleFlipCamera}
                            >
                              Flip Camera
                            </button>
                          </>
                        )}
                        {/* <button className="btn btn-primary"
                          type="button" onClick={handleFlipCamera}>Flip Camera</button> */}
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-lg-4 col-md-4 my-3 mt-lg-5 mt-md-0 mt-2 ">
                       {/* <button className="btn btn-primary mt-1" onClick={() => handleShow()}>Add Multiple Finger</button>*/}
                      </div>
                      <div className="col-lg-4 col-md-4 my-3  mt-lg-0 mt-md-0 mt-2">

                      </div>
                      <div className="col-lg-4 col-md-4  mt-lg-0 mt-md-0 mt-2">

                      </div>
                    </div>
                    {!decryptedFingerUrl1 && !decryptedFingerUrl2 && (
                      <div className="row">
                        <div className="col-lg-8 col-md-8 mt-3">
                          <div className="row align-items-center mb-3">
                            <div className="col-xl-3 col-lg-4 col-md-4">
                              <label htmlFor="height" className="mb-0">
                                Signature {/* <span className="text-danger fw-bold">*</span> */}
                              </label>
                            </div>
                            <div className="col-xl-4 col-lg-5 col-md-5 mt-lg-0 mt-md-0 mt-3">
                              <div className="form-group mb-0">
                                <div
                                  className="border border-dark bg-white"
                                  style={{ height: "75px", width: "200px", overflow: "hidden" }}
                                >
                                  <SignatureCanvas
                                    ref={biometricSignRef}
                                    penColor="black"
                                    canvasProps={{
                                      width: 200,
                                      height: 75,
                                      className: "sigCanvas",
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="col-xl-2 col-lg-3 col-md-3 mt-lg-0 mt-md-0 mt-3">
                              <Button
                                variant="secondary"
                                onClick={() => biometricSignRef.current && biometricSignRef.current.clear()}
                              >
                                Clear
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}


                  </div>
                </div>
                <div className="card-footer py-3 mt-5">
                  <div className="row mt-lg-0 mt-md-0 mt-5">
                    <div className="col-lg-9 col-md-9 ">
                      <button
                        className="btn btn-primary"
                        onClick={CompleteBiometric}
                      >
                        Complete Biometric
                      </button>
                      {/* <button
                      className="btn btn-secondary mx-4"
                      onClick={() => navigate(-1)}
                    >
                      Close
                    </button> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal show={showModal} onHide={handleClose} size="lg" backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>
            <h5 className="fw-bold">Add Finger</h5>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table bordered>
            <thead>
              <tr>
                <th className="fw-bold">Action</th>
                <th className="fw-bold">Scan Finger</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><Button
                  variant="primary"
                  onClick={CaptureFingerHere3}
                >
                  Capture Finger 3
                </Button></td>
                <td>  {
                  decryptedFingerUrl3 ? <img
                    src={decryptedFingerUrl3}
                    alt=""
                    style={{ height: "25%", width: "25%" }}
                  />
                    : <div
                      style={{
                        height: "25%",
                        width: "25%",
                        border: "1px solid #ccc",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#f9f9f9",
                        marginTop: "5px"
                      }}
                    >
                      Capture Finger 3
                    </div>
                }</td>
              </tr>
              <tr>
                <td><Button
                  variant="primary"
                  onClick={CaptureFingerHere4}
                >
                  Capture Finger 4
                </Button></td>
                <td>  {
                  decryptedFingerUrl4 ? <img
                    src={decryptedFingerUrl4}
                    alt=""
                    style={{ height: "25%", width: "25%" }}
                  />
                    : <div
                      style={{
                        height: "25%",
                        width: "25%",
                        border: "1px solid #ccc",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#f9f9f9",
                        marginTop: "5px"
                      }}
                    >
                      Capture Finger 4
                    </div>
                }</td>
              </tr>
              <tr>
                <td><Button
                  variant="primary"
                  onClick={CaptureFingerHere5}
                >
                  Capture Finger 5
                </Button></td>
                <td>  {
                  decryptedFingerUrl5 ? <img
                    src={decryptedFingerUrl5}
                    alt=""
                    style={{ height: "25%", width: "25%" }}
                  />
                    : <div
                      style={{
                        height: "25%",
                        width: "25%",
                        border: "1px solid #ccc",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#f9f9f9",
                        marginTop: "5px"
                      }}
                    >
                      Capture Finger 5
                    </div>
                }</td>
              </tr>
              <tr>
                <td><Button
                  variant="primary"
                  onClick={CaptureFingerHere6}
                >
                  Capture Finger 6
                </Button></td>
                <td>  {
                  decryptedFingerUrl6 ? <img
                    src={decryptedFingerUrl6}
                    alt=""
                    style={{ height: "25%", width: "25%" }}
                  />
                    : <div
                      style={{
                        height: "25%",
                        width: "25%",
                        border: "1px solid #ccc",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#f9f9f9",
                        marginTop: "5px"
                      }}
                    >
                      Capture Finger 6
                    </div>
                }</td>
              </tr>
              <tr>
                <td><Button
                  variant="primary"
                  onClick={CaptureFingerHere7}
                >
                  Capture Finger 7
                </Button></td>
                <td>  {
                  decryptedFingerUrl7 ? <img
                    src={decryptedFingerUrl7}
                    alt=""
                    style={{ height: "25%", width: "25%" }}
                  />
                    : <div
                      style={{
                        height: "25%",
                        width: "25%",
                        border: "1px solid #ccc",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#f9f9f9",
                        marginTop: "5px"
                      }}
                    >
                      Capture Finger 7
                    </div>
                }</td>
              </tr>
              <tr>
                <td><Button
                  variant="primary"
                  onClick={CaptureFingerHere8}
                >
                  Capture Finger 8
                </Button></td>
                <td>  {
                  decryptedFingerUrl8 ? <img
                    src={decryptedFingerUrl8}
                    alt=""
                    style={{ height: "25%", width: "25%" }}
                  />
                    : <div
                      style={{
                        height: "25%",
                        width: "25%",
                        border: "1px solid #ccc",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#f9f9f9",
                        marginTop: "5px"
                      }}
                    >
                      Capture Finger 8
                    </div>
                }</td>
              </tr>
              <tr>
                <td><Button
                  variant="primary"
                  onClick={CaptureFingerHere9}
                >
                  Capture Finger 9
                </Button></td>
                <td>  {
                  decryptedFingerUrl9 ? <img
                    src={decryptedFingerUrl9}
                    alt=""
                    style={{ height: "25%", width: "25%" }}
                  />
                    : <div
                      style={{
                        height: "25%",
                        width: "25%",
                        border: "1px solid #ccc",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#f9f9f9",
                        marginTop: "5px"
                      }}
                    >
                      Capture Finger 9
                    </div>
                }</td>
              </tr>
              <tr>
                <td><Button
                  variant="primary"
                  onClick={CaptureFingerHere10}
                >
                  Capture Finger 10
                </Button></td>
                <td>  {
                  decryptedFingerUrl10 ? <img
                    src={decryptedFingerUrl10}
                    alt=""
                    style={{ height: "25%", width: "25%" }}
                  />
                    : <div
                      style={{
                        height: "25%",
                        width: "25%",
                        border: "1px solid #ccc",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#f9f9f9",
                        marginTop: "5px"
                      }}
                    >
                      Capture Finger 10
                    </div>
                }</td>
              </tr>
              {/* {fingerScans.map((scan, index) => (
                <tr key={index}>
                  <td>
                    <Button
                      variant="primary"
                      onClick={() => captureFingerAt(index)}
                    >
                      Capture Finger
                    </Button>
                  </td>
                  <td>
                    {scan ? (
                      <img
                        src={decryptFinger(scan)}
                        alt={`Finger ${index + 1}`}
                        style={{ maxWidth: "100px" }}
                      />
                    ) : (
                      "No image captured"
                    )}
                  </td>
                </tr>
              ))} */}
            </tbody>
          </Table>
          {/* <div className="text-center">
            <Button variant="outline-primary" >
              +
            </Button>
          </div> */}
        </Modal.Body>
        <Modal.Footer>
          <Button
            style={{ backgroundColor: "#1B5A90", border: "none" }}
            onClick={handleClose}
          >
            Save
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Biometric;
