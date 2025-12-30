import React, { useRef, useState, useEffect } from "react";
import { Modal, Table } from "react-bootstrap";
import { ArrowBack, Delete, Edit } from "@material-ui/icons";
import { useNavigate } from "react-router-dom";
import { Pagination } from "../../Components/Utils/Pagination";
import { addTagger, deleteTagger, getAllTagger } from "../../Components/Api/TaggerApi";
import ScanChestNo from "./ScanChestNo";
import Tesseract from "tesseract.js";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import ErrorHandler from "../../Components/ErrorHandler";
import Cookies from "js-cookie";
import * as XLSX from "xlsx";
import { apiClient } from "../../apiClient";
import { Button } from "react-bootstrap";

const Rfid = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [chestNo, setChestNo] = useState("");
  const [tagNo, setTagNo] = useState("");
  const [rfid, setRfid] = useState("");
  const [mappingId, setMappingId] = useState("")
  const [allTagger, setAllTagger] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [chestScan, setChestScan] = useState(false);
  const [selectedItemsPerPage, setSelectedItemsPerPage] = useState(10);
  const [searchData, setSearchData] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [facingMode, setFacingMode] = useState("environment");
  const [isScanning, setIsScanning] = useState(true); // Control scanning
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const [videoDevices, setVideoDevices] = useState([]); // Store available video devices
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [currentDeviceIndex, setCurrentDeviceIndex] = useState(0); // Track the index of the current device
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);


  const headerCellStyle = {
    backgroundColor: "rgb(27, 90, 144)",
    color: "#fff",
  };


  useEffect(() => {
    fetchAllTagger();
  }, []);

  const getRfidTag = async () => {
    const UserId = localStorage.getItem("userId");
    const recruitId = localStorage.getItem("recruitId");
    const params = {
      userId: UserId,
      RecruitId: recruitId,
    };

    try {
      const response = await apiClient({
        method: "get",
        params: params,
        url: `RFID/ReadRFIDtag`.toString(),
      });
      console.log("get rfid tag", response.data.data.result.tag);
      const tag = response.data.data.result.tag;
      setRfid(tag);
      const token1 = response.data.outcome.tokens;
      console.log(token1, "token 1")
      Cookies.set("UserCredential", token1, { expires: 7 });
      return response.data.data;
    } catch (error) {
      if (error.response && error.response.data && error.response.data.outcome) {
        const token1 = error.response.data.outcome.tokens;
        Cookies.set("UserCredential", token1, { expires: 7 });
      }
      console.error(error);
      const errors = ErrorHandler(error);
      toast.error(errors);
    }
  };

  const getRfidMapping = async (CandidateId, chestNo, tagNo) => {
    const UserId = localStorage.getItem("userId");
    const recruitId = localStorage.getItem("recruitId");
    const params = {
      userId: UserId,
      RecruitId: recruitId,
      CandidateID: CandidateId,
      ChestNo: chestNo,
      Barcode: tagNo
    };

    try {
      const response = await apiClient({
        method: "get",
        params: params,
        url: `RFIDChestNoMapping/GetMapCandidate`.toString(),
      });
      console.log("get map candidate", response.data.data);
      const token1 = response.data.outcome.tokens;
      Cookies.set("UserCredential", token1, { expires: 7 });
      console.log(response.data.data[0].ChestNo);
      setChestNo(response.data.data[0].ChestNo);
      setRfid(response.data.data[0].RFID);
      setMappingId(response.data.data[0].id)
      setTagNo(response.data.data[0].Barcode)
    } catch (error) {
      if (error.response && error.response.data && error.response.data.outcome) {
        const token1 = error.response.data.outcome.tokens;
        Cookies.set("UserCredential", token1, { expires: 7 });
      }
      console.error(error);
      const errors = ErrorHandler(error);
      toast.error(errors);
    }
  };

  const fetchAllTagger = async () => {
    const data = await getAllTagger();
    if (data) {
      setAllTagger(data);
    }
  };

  const handleAddTagger = async () => {
    const data = await addTagger(rfid, chestNo, mappingId, tagNo);
    if (data) {
      setChestNo("");
      setRfid("");
      setTagNo("");
      fetchAllTagger();
    }
  };

  const DeleteTagger = async (id) => {
    const data = await deleteTagger(id);
    if (data) {
      setChestNo("");
      setRfid("");
      fetchAllTagger();
    }
  }

  const sortedTagger = [...allTagger].sort(
    (a, b) => Number(a.Barcode) - Number(b.Barcode)
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentItems = sortedTagger.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const checkIfMobile = () => /Mobi|Android/i.test(navigator.userAgent);

  // Function to start the camera
  const startCamera = async () => {
    try {
      // Stop any existing stream before starting a new one
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      const constraints = {
        video: {
          width: { ideal: 1920 }, // High resolution width
          height: { ideal: 1080 }, // High resolution height
        },
      };

      if (isMobileDevice) {
        // For mobile, use facingMode to switch between front and back cameras
        constraints.video.facingMode = facingMode;
      } else if (videoDevices.length > 0) {
        // For laptops/desktops, use deviceId to switch between available cameras
        constraints.video.deviceId = { exact: videoDevices[currentDeviceIndex].deviceId };
      }

      // Request the media stream
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      // Set the stream to the video element
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
        };
      }
    } catch (err) {
      console.error("Error accessing the camera:", err);
      // Handle error state, e.g., setError(err.message);
    }
  };

  // Flip camera functionality
  const handleFlipCamera = () => {
    if (isMobileDevice) {
      // On mobile, toggle between "user" and "environment"
      setFacingMode((prevMode) => (prevMode === "user" ? "environment" : "user"));
    } else if (videoDevices.length > 1) {
      // On laptops/desktops, switch between available video devices
      setCurrentDeviceIndex((prevIndex) => (prevIndex + 1) % videoDevices.length);
    } else {
      console.warn("No multiple cameras found to switch.");
    }
  };

  useEffect(() => {
    // Set mobile flag on component mount
    setIsMobileDevice(checkIfMobile());

    // Fetch available video devices
    const getVideoDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoInputDevices = devices.filter((device) => device.kind === "videoinput");
        setVideoDevices(videoInputDevices);
      } catch (error) {
        console.error("Error fetching video devices:", error);
      }
    };

    getVideoDevices();
  }, []);

  useEffect(() => {
    startCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [chestScan, facingMode, currentDeviceIndex]);

  useEffect(() => {
    const captureAndScan = () => {
      if (videoRef.current && !videoRef.current.paused && isScanning) {
        captureImage();
      }
    };

    const intervalId = setInterval(captureAndScan, 3000); // Capture every 3 seconds

    return () => {
      clearInterval(intervalId);
    };
  }, [isScanning]);

  const captureImage = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (canvas && video) {
      const ctx = canvas.getContext('2d');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0);

      // Enhance the captured image
      enhanceImage(canvas);

      // Perform OCR on the image
      scanImage(canvas);
    }
  };

  const enhanceImage = (canvas) => {
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // Convert the image to grayscale
    for (let i = 0; i < imageData.data.length; i += 4) {
      const avg = (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) / 3;
      imageData.data[i] = imageData.data[i + 1] = imageData.data[i + 2] = avg; // Grayscale
    }

    ctx.putImageData(imageData, 0, 0);

    // Apply contrast and brightness
    ctx.filter = 'contrast(200%) brightness(150%)'; // More intense contrast/brightness for clarity
    ctx.drawImage(canvas, 0, 0);
  };

  const scanImage = (canvas) => {
    setLoading(true);
    Tesseract.recognize(
      canvas,
      'eng',
      {
        // Only allow digits for recognition
        tessedit_char_whitelist: '0123456789',
        logger: (info) => console.log(info),
      }
    ).then(({ data: { text } }) => {
      const digits = text.match(/\d+/g); // Match only digits
      if (digits) {
        const numbers = digits.join(''); // Join digits as a single string
        if (numbers.length === 5) {
          setText(numbers);
          setChestNo(numbers);
          console.log('Detected 5-digit Number:', numbers);
          setIsScanning(false); // Stop scanning after detecting the number
        } else {
          setText('The detected number is not 5 digits.');
          console.log('The detected number is not 5 digits.');
        }
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

  const toggleScanning = () => {
    setIsScanning(!isScanning);
    setChestNo("");
    setText(''); // Clear previous result
  };

  const handleClose = () => {
    setChestScan(false);
  };
  useEffect(() => {
    if (chestNo) {
      // Close modal if chestNo is detected
      handleClose();
    }
  }, [chestNo]);

  const handleSearch = (e) => {
    const searchDataValue = e.target.value.toLowerCase();
    setSearchData(searchDataValue);

    if (searchDataValue.trim() === "") {
      fetchAllTagger();
    } else {
      // const filteredData = allTagger.filter(
      //   (tagger) =>
      //     tagger.ChestNo.toLowerCase().includes(searchDataValue) ||
      //     tagger.FullNameEnglish.toLowerCase().includes(searchDataValue) ||
      //     tagger.Barcode.toLowerCase().includes(searchDataValue)
      // );
      // setAllTagger(filteredData);
      // setCurrentPage(1);
      const filteredData = allTagger.filter((tagger) =>
        (tagger.ChestNo ?? "").toString().toLowerCase().includes(searchDataValue) ||
        (tagger.FullNameEnglish ?? "").toLowerCase().includes(searchDataValue) ||
        (tagger.Barcode ?? "").toLowerCase().includes(searchDataValue)
      );

      setAllTagger(filteredData);
      setCurrentPage(1);
    }
  };

  const handleFileChange = async (e) => {
    e.preventDefault();
    const recruitId = localStorage.getItem("recruitId");
    const selectedFile = e.target.files[0];

    if (!selectedFile) {
      toast.warning("Please select a file to upload.");
      return;
    }

    setFile(selectedFile);

    const uploadFile = async (fileToUpload) => {
      const UserId = localStorage.getItem("userId");

      const formData = new FormData();
      formData.append("file", fileToUpload);
      formData.append("userId", UserId);
      formData.append("RecruitId", recruitId);

      try {
        const response = await apiClient.post(`RFIDChestNoMapping/RFIDupload`, formData, {});

        if (response.status === 200) {
          console.log("Full API Response:", JSON.stringify(response.data, null, 2));

          const result = response.data;

          if (result.outcome?.tokens) {
            Cookies.set("UserCredential", result.outcome.tokens, { expires: 7 });
          }

          const fileReader = new FileReader();

          fileReader.onload = async (event) => {
            const fileContent = event.target.result;
            const processedRecords = fileContent.split('\n').length - 1;

            toast.success(
              `Success: User import completed.`
            );

            // Refresh the user list
            const updatedData = await getAllTagger();
            setAllTagger(updatedData);

            // Reset the file input after successful upload
            if (fileInputRef.current) {
              fileInputRef.current.value = '';
            }
          };

          fileReader.onerror = () => {
            toast.error("Error reading file content");
            if (fileInputRef.current) {
              fileInputRef.current.value = '';
            }
          };

          // Read the file as text
          fileReader.readAsText(fileToUpload);

        } else {
          console.error("Error:", response.statusText);
          toast.error("Upload failed. Please try again.");
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        }
      } catch (error) {
        if (error.response?.data?.outcome?.tokens) {
          Cookies.set("UserCredential", error.response.data.outcome.tokens, {
            expires: 7,
          });
        }
        console.error("Error:", error.response?.status);

        if (error.response?.status === 500) {
          toast.error("Excel import failed: Please check and re-upload a valid excel file.");
        }
        else if (error.response?.status === 400) {
          toast.error("Please upload a file of type: .xls, .xlsx, .xlsm, .csv");
        }
        else if (error.response?.status === 422) {
          toast.error("No data in the excel!");
        }
        else if (error.response?.status === 409) {
          // toast.error("Record already exists!");
          console.log(error.response?.data)
          // setErrorMessage(error.response?.data);
          // setShowErrorModal(true);
        }
        else {
          const errors = ErrorHandler(error);
          toast.error(errors);
        }

        // Reset file input on error
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    };

    await uploadFile(selectedFile);
  };

  const handleUploadClick = () => {
    const recruitId = localStorage.getItem("recruitId");

    // if (!recruitId || recruitId === "null" || RoleName === "Superadmin") {
    //   if (!recruitmentValue) {
    //     toast.warning("Please select recruitment!");
    //     return;
    //   }
    // }

    if (fileInputRef.current) {
      fileInputRef.current.value = null; // Reset file input
      fileInputRef.current.click(); // Trigger file input dialog
    }
  };

  const handleChange = (e) => {
    setSelectedItemsPerPage(parseInt(e.target.value));
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };
  return (
    <>
      <div className="container-fluid p-3">
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-header py-3">
                <div className="row align-items-center">
                  <div className="col-lg-8 col-md-8 col-4">
                    <h4 className="fw-bold">Tagger</h4>
                  </div>
                  <div className="col-lg-4 col-md-4 col-8 d-flex justify-content-end">
                    <div className="btn btn-add me-1" title="Import">
                      <input
                        className="form-control"
                        type="file"
                        onChange={handleFileChange}
                        ref={fileInputRef}
                        style={{ display: "none" }}
                      />
                      <Button
                        onClick={handleUploadClick}
                        style={{ backgroundColor: "#1B5A90" }}
                      >
                        Import
                      </Button>
                    </div>
                    <button
                      className="btn text-white btn-sm float-end"
                      style={{
                        backgroundColor: "rgb(27, 90, 144)",
                        marginLeft: "10px",
                      }}
                      onClick={
                        getRfidTag
                      }
                    >
                      Get RFID Tag
                    </button>
                    <button
                      className="btn text-white btn-sm float-end"
                      style={{
                        backgroundColor: "rgb(27, 90, 144)",
                        marginLeft: "10px",
                      }}
                      onClick={() => {
                        setChestScan(true);
                      }}
                    >
                      Scan Chest No
                    </button>
                    <button
                      className="btn btn-sm text-white float-end"
                      style={{
                        backgroundColor: "rgb(27, 90, 144)",
                        marginLeft: "10px",
                      }} // Added margin-left for spacing
                      onClick={() => {
                        navigate(-1);
                      }}
                    >
                      <ArrowBack />
                    </button>
                  </div>
                </div>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-lg-12 col-md-12">
                    <div className="row">
                      <div className="col-xl-1 col-lg-2 col-md-2">
                        <label htmlFor="chestNo" className="fw-bold">
                          Chest No.:
                        </label>
                        <span className="text-danger fw-bold">*</span>
                      </div>
                      <div className="col-xl-3 col-lg-4 col-md-4 mt-lg-0 mt-3">
                        <div className="form-group">
                          <input
                            type="text"
                            className="form-control"
                            name="chestNo"
                            id="chestNo"
                            aria-describedby="chestNo"
                            placeholder="Enter Chest No."
                            value={chestNo}
                            onChange={(e) => setChestNo(e.target.value.replace(/\s/g, ""))}
                          />
                        </div>
                      </div>
                      <div className="col-xl-1 col-lg-2 col-md-2 mt-lg-0 mt-3">
                        <label htmlFor="rfid" className="fw-bold">
                          RFID:
                        </label>
                        <span className="text-danger fw-bold">*</span>
                      </div>
                      <div className="col-xl-3 col-lg-4 col-md-4 mt-lg-0 mt-3">
                        <div className="form-group">
                          {/*<input
                            type="text"
                            className="form-control"
                            name="rfid"
                            id="rfid"
                            aria-describedby="rfid"
                            placeholder="Enter RFID"
                            value={rfid}
                            onChange={(e) => setRfid(e.target.value)}
                          />*/}
                          <input
                            type="text"
                            className="form-control"
                            name="rfid"
                            id="rfid"
                            aria-describedby="rfid"
                            placeholder="Enter RFID"
                            value={rfid}
                            onChange={(e) => setRfid(e.target.value.replace(/\s/g, ""))}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row mt-3">
                      <div className="col-xl-1 col-lg-2 col-md-2">
                        <label htmlFor="chestNo" className="fw-bold">
                          Barcode No :
                        </label>
                        {/* <span className="text-danger fw-bold">*</span> */}
                      </div>
                      <div className="col-xl-3 col-lg-4 col-md-4 mt-lg-0 mt-3">
                        <div className="form-group">
                          <input
                            type="text"
                            className="form-control"
                            name="tagNo"
                            id="tagNo"
                            aria-describedby="tagNo"
                            placeholder="Enter Barcode No"
                            value={tagNo}
                            onChange={(e) => setTagNo(e.target.value.replace(/\s/g, ""))}
                          />
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
              <div className="card-footer py-3">
                <button
                  title="submit"
                  className="btn btn-success"
                  onClick={handleAddTagger}
                >
                  Submit
                </button>
              </div>
            </div>
            <div className="card mt-4">
              <div className="card-header">
                <div className="row align-items-center">
                  <div className="col">
                    <h4 className="card-title fw-bold p-2">Tagger History</h4>
                  </div>
                </div>
              </div>
              <div className="card-body pt-1">
                <div className="row mt-3">
                  <div className="col-lg-3 col-md-3 d-flex justify-content-center justify-content-lg-start justify-content-md-start">
                    <h6 className="mt-2 ">Show</h6>&nbsp;&nbsp;
                    <select
                      style={{ height: "35px" }}
                      className="form-select w-auto"
                      aria-label="Default select example"
                      value={selectedItemsPerPage}
                      onChange={handleChange}
                    >
                      <option value="10">10</option>
                      <option value="50">50</option>
                      <option value="100">100</option>
                    </select>
                    &nbsp;&nbsp;
                    <h6 className="mt-2">entries</h6>
                  </div>
                  <div className="col-lg-6 col-md-6 d-flex justify-content-center justify-content-lg-end"></div>
                  <div className="col-lg-3 col-md-3 d-flex justify-content-center justify-content-lg-end mt-lg-0 mt-md-0 mt-3">
                    <input
                      className="form-control"
                      placeholder="Search here"
                      value={searchData}
                      onChange={handleSearch}
                    />
                  </div>
                </div>
                <Table
                  striped
                  hover
                  responsive
                  className="border text-left mt-3"
                >
                  <thead>
                    <tr>
                      <th scope="col" style={headerCellStyle}>
                        Sr.No
                      </th>
                      {/* <th scope="col" style={headerCellStyle}>
                        Candidate Name
                      </th> */}
                      <th scope="col" style={headerCellStyle}>
                        Chest No
                      </th>
                      <th scope="col" style={headerCellStyle}>
                        RFID
                      </th>
                      <th scope="col" style={headerCellStyle}>
                        Barcode No
                      </th>
                      <th scope="col" style={headerCellStyle}>
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...currentItems]
                      .sort((a, b) => Number(a.ChestNo) - Number(b.ChestNo))
                      .map((data, index) => (
                        <tr key={data.id}>
                          <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                          <td>{data.ChestNo}</td>
                          <td>{data.RFID}</td>
                          <td>{data.Barcode}</td>
                          <td>
                            <div className="d-flex justify-content-center align-items-center">
                              <Edit
                                className="text-success mr-2"
                                type="button"
                                style={{
                                  ...(data.p_isactive === "Inactive" && {
                                    opacity: 0.5,
                                    cursor: "not-allowed",
                                  }),
                                }}
                                onClick={() => getRfidMapping(data.CandidateID, data.ChestNo, data.Barcode)}
                              />
                              <Delete
                                className="text-danger"
                                type="button"
                                style={{ marginLeft: "0.5rem" }}
                                onClick={() => DeleteTagger(data.id)}
                              />
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>

                </Table>
                <div className="row mt-4 mt-xl-3">
                  <div className="col-lg-4 col-12 ">
                    <h6 className="text-lg-start text-center">
                      Showing {indexOfFirstItem + 1} to{" "}
                      {Math.min(indexOfLastItem, allTagger.length)} of{" "}
                      {allTagger.length} entries
                    </h6>
                  </div>
                  <div className="col-lg-4 col-12"></div>
                  <div className="col-lg-4 col-12 mt-3 mt-lg-0">
                    <Pagination
                      currentPage={currentPage}
                      setCurrentPage={setCurrentPage}
                      allData={allTagger}
                      itemsPerPage={itemsPerPage}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal show={chestScan} onHide={handleClose} size="md" backdrop="static">
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "70vh",
              // backgroundColor: '#f0f0f0',
              // padding: '1rem'
            }}
          >
            <div
              style={{
                width: "100%",
                maxWidth: "400px",
                backgroundColor: "white",
                borderRadius: "8px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                overflow: "hidden",
              }}
            >
              <h2
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  textAlign: "center",
                  padding: "1rem",
                  margin: 0,
                  backgroundColor: "#f8f8f8",
                  borderBottom: "1px solid #e0e0e0",
                }}
              >
                Chest Number Scanner
              </h2>
              <div style={{ padding: "1rem" }}>
                {error ? (
                  <p style={{ color: "red" }}>{error}</p>
                ) : (
                  <>
                    <div
                      style={{
                        position: "relative",
                        width: "100%",
                        height: "192px",
                        marginBottom: "1rem",
                        overflow: "hidden",
                        borderRadius: "4px",
                      }}
                    >
                      <video
                        ref={videoRef}
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                      <canvas ref={canvasRef} style={{ display: "none" }} />
                      {loading && (
                        <div
                          style={{
                            position: "absolute",
                            inset: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "rgba(0, 0, 0, 0.5)",
                            color: "white",
                          }}
                        >
                          Scanning...
                        </div>
                      )}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",  // Centers the button horizontally
                        alignItems: "center",      // Centers the button vertically (if needed)
                      }}
                    >
                      <button
                        className="btn-sm d-md-none d-lg-block d-none"
                        onClick={handleFlipCamera}
                        style={{
                          padding: "0.5rem",
                          marginBottom: "0.2rem",
                          backgroundColor: "#3b82f6",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                          transition: "background-color 0.3s",
                        }}
                      >
                        Flip Camera
                      </button>
                    </div>
                    <br />
                    <button
                      // className="btn-sm mx-auto"
                      onClick={toggleScanning}
                      style={{
                        width: "100%",
                        padding: "0.5rem",
                        marginBottom: "1rem",
                        backgroundColor: isScanning ? "#ef4444" : "#3b82f6",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        transition: "background-color 0.3s",
                      }}
                    >
                      {isScanning ? "Stop Scanning" : "Start Scanning"}
                    </button>

                  </>
                )}
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>

    </>
  );
};
export default Rfid;
