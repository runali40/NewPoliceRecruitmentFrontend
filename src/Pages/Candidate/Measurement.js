import React, { useState, useEffect, useRef } from "react";
import { Table, Button, Modal } from "react-bootstrap";
import { ArrowBack } from "@material-ui/icons";
import { useNavigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import { addChestHeight, getHistory } from "../../Components/Api/MeasurementApi";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import SignatureCanvas from 'react-signature-canvas';

const Measurement = () => {
  const headerCellStyle = {
    backgroundColor: "rgb(27, 90, 144)",
    color: "#fff",
  };
  const navigate = useNavigate();
  const location = useLocation();
  const { fullNameEnglish, gender, candidateId, category } = location.state || {};
  const [verifyData, setverifyData] = useState();
  const [chestInhale, setChestInhale] = useState("");
  const [chestNormal, setChestNormal] = useState("");
  const [height, setHeight] = useState("");
  const [allHistory, setAllHistory] = useState([]);
  const [length, setLength] = useState("");
  const [getSignature, setGetSignature] = useState("")
  const candidateSignRef = useRef();
  const [signModal, setSignModal] = useState(false);
  const [savedSignature, setSavedSignature] = useState(null);
  const modalSignRef = useRef(null);
  const [canvasWidth, setCanvasWidth] = useState(730);
  const handleSignClose = () => setSignModal(false);

  useEffect(() => {
    const updateCanvasSize = () => {
      // Modal body ka width minus padding
      const modalWidth = window.innerWidth < 992 ? window.innerWidth - 80 : 730;
      setCanvasWidth(modalWidth);
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    return () => window.removeEventListener('resize', updateCanvasSize);
  }, []);


  useEffect(() => {
    const recruitId = localStorage.getItem("recruitId");
    const UserId = localStorage.getItem("userId");
    const params = {
      UserId: UserId,
      RecruitId: recruitId,
      candidate_id: candidateId,
      // Category: category
    };
    getHistory(params, setAllHistory, setLength, (token) => {
      // localStorage.setItem("UserCredential", token);
      Cookies.set("UserCredential", token, { expires: 7 });
      // console.log(allHistory[0].Signature, "all history")
      // setGetSignature(allHistory[0].Signature);
    });
  }, [candidateId]);

  const candidateSignature = candidateSignRef.current
    ? candidateSignRef.current.getTrimmedCanvas().toDataURL("image/png")
    : null;

  const AddChestHeight = () => {
    const recruitId = localStorage.getItem("recruitId");
    const UserId = localStorage.getItem("userId");

    // Get signature only when submitting
    // let signature = null;
    // if (candidateSignRef.current && !candidateSignRef.current.isEmpty()) {
    //   signature = candidateSignRef.current.getTrimmedCanvas().toDataURL("image/png");
    // }
    let signature = savedSignature;
    if (height === "" /* || signature === null */) {
      toast.warning("Please fill the details!");
    } else {
      const data = {
        candidate_id: candidateId,
        RecruitId: recruitId,
        height: height,
        chest_normal: chestNormal === "" ? 0 : chestNormal,
        chest_Inhale: chestInhale === "" ? 0 : chestInhale,
        time: "",
        verify_by: "",
        interval: "",
        createdby: "",
        created_date: new Date().toISOString(),
        userId: UserId,
        isactive: "1",
        Signature: signature,
        category: category
      };
      addChestHeight(data, navigate, candidateId, fullNameEnglish);
      // openPrintWindow()
    }
  };

  // const handleSaveSignature = () => {
  //   if (modalSignRef.current) {
  //     const signatureData = modalSignRef.current.toDataURL();
  //     setSavedSignature(signatureData);

  //     // Clear and draw on the small canvas
  //     if (candidateSignRef.current) {
  //       candidateSignRef.current.clear();
  //       const img = new Image();
  //       img.src = signatureData;
  //       img.onload = () => {
  //         const ctx = candidateSignRef.current.getCanvas().getContext('2d');
  //         ctx.drawImage(img, 0, 0, 200, 75);
  //       };
  //     }

  //     setSignModal(false);
  //     handleSignClose()
  //   }
  // };
 const handleSaveSignature = () => {
    if (modalSignRef.current && !modalSignRef.current.isEmpty()) {
      // High quality trimmed signature
      const signatureData = modalSignRef.current
        .getTrimmedCanvas()
        .toDataURL("image/png");

      setSavedSignature(signatureData);

      // Clear and draw on the small canvas with proper scaling
      if (candidateSignRef.current) {
        const canvas = candidateSignRef.current.getCanvas();
        const ctx = canvas.getContext('2d');

        // Clear existing signature
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const img = new Image();
        img.src = signatureData;
        img.onload = () => {
          // Calculate aspect ratio to maintain signature proportions
          const scale = Math.min(
            canvas.width / img.width,
            canvas.height / img.height
          );
          const x = (canvas.width - img.width * scale) / 2;
          const y = (canvas.height - img.height * scale) / 2;

          // Draw with smooth scaling
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
        };
      }

      setSignModal(false);
      handleSignClose();
    } else {
      toast.warning("Please draw signature first!");
    }
  };
  
  const handleClear = () => {
    if (modalSignRef.current) {
      modalSignRef.current.clear();
    }
  };

  const ResetForm = () => {
    setHeight("");
    setChestNormal("");
    setChestInhale("");
  }

  const openPrintWindow = () => {
    let tableHTML = `
      <html>
      <head>
        <title>Measurement</title>
        <style>
          table {
            width: 100%;
            border-collapse: collapse;
            font-family: Arial;
          }
          th, td {
            padding: 8px;
            border: 1px solid #000;
            text-align: left;
            font-size: 14px;
          }
          th {
            background: #f2f2f2;
          }
          .signature-box {
            height: 60px;
            border: 1px solid #000;
          }
          .print-btn {
            margin: 15px 0;
            padding: 6px 12px;
            border: 1px solid #000;
            cursor: pointer;
            background: #ddd;
            font-size: 14px;
          }
          .sigCanvas {
           touch-action: none;
           overscroll-behavior: contain;
          }
        </style>
      </head>
      <body>
  
        <button class="btn btn-success print-btn" onclick="startPrinting()">Print</button>
        <script>
          function startPrinting() {
            const btn = document.querySelector('.print-btn');
            btn.style.display = 'none';      
            setTimeout(() => {
              window.print();
              btn.style.display = 'block';   
            }, 200);
          }
        </script>
  
        <h2>Commissioner of Police Thane City</h2>
        <h3>Candidate: ${fullNameEnglish}</h3>
        <table>
          <thead>
            <tr>
              <th>Sr No</th>      
              <th>Name</th>
              <th>Height</th>
              <th>Chest Normal</th>
              <th>Chest Inhale</th>
              <th>Signarure</th>
            </tr>
          </thead>
          <tbody>
    `;

    allHistory.forEach((row, index) => {
      tableHTML += `
        <tr>
          <td>${index + 1}</td>
          
          <td>${fullNameEnglish || ""}</td>
          <td>${row.Height || ""}</td>
          <td>${row.Chest_normal || ""}</td>
          <td>${row.Chest_Inhale || ""}</td>
          
          <td class="signature-box"></td>
        </tr>
      `;
    });

    tableHTML += `
          </tbody>
        </table>
      </body>
      </html>
    `;

    const printWindow = window.open("", "_blank", "width=900,height=700");
    printWindow.document.open();
    printWindow.document.write(tableHTML);
    printWindow.document.close();
  };

  return (
    <>
      <div className="container-fluid p-3">
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-header py-3">
                <div className="row">
                  <div className="col-lg-10 col-md-10 col-10 my-auto">
                    <h5 className="fw-bold">
                      Add Height & Chest Measurement
                    </h5>
                    <h6 className="mt-3"><span className="fw-bold">Candidate Name:</span> {fullNameEnglish}</h6>
                  </div>
                  <div className="col-lg-2 col-md-2 col-2 d-flex flex-wrap justify-content-end">
                    <div
                      className="btn btn-add"
                      title="Back"
                      onClick={() => navigate(`/candidate/${candidateId}`)}
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
                  <div className="col-lg-8 col-md-8">
                    <div className="row">
                      <div className="col-lg-4 col-md-4 col-xl-3">
                        <label htmlFor="height">Height (cm)</label>
                        <span className="text-danger fw-bold">*</span>
                      </div>
                      <div className="col-lg-8 col-md-8 col-xl-6 mt-lg-0 mt-md-0 mt-3">
                        <div className="form-group">
                          <input
                            name="height"
                            type="text"
                            className="form-control"
                            id="height"
                            aria-describedby="height"
                            placeholder="Enter Height"
                            value={height}
                            // onChange={(e) => setHeight(e.target.value)}
                            maxLength={4}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (/^\d*$/.test(value)) {
                                setHeight(value);
                              }
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  {gender === "Male" ? (
                    <div className=" col-lg-8 col-md-8 mt-4">
                      <div className="row">
                        <div className="col-xl-3 col-lg-4 col-md-4">
                          <label htmlFor="chestNormal">Chest (cm)</label>
                          <span className="text-danger fw-bold">*</span>
                        </div>
                        <div className="col-xl-3 col-lg-4 col-md-4 mt-lg-0 mt-md-0 mt-3">
                          <div className="form-group">
                            <input
                              name="chestNormal"
                              type="text"
                              className="form-control"
                              id="normal"
                              aria-describedby="normal"
                              placeholder="Normal"
                              value={chestNormal}
                              // onChange={(e) => setChestNormal(e.target.value)}
                              maxLength={4}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (/^\d*$/.test(value)) {
                                  setChestNormal(value);
                                }
                              }}
                            />
                          </div>
                        </div>
                        <div className="col-xl-3 col-lg-4 col-md-4 mt-lg-0 mt-md-0 mt-3">
                          <div className="form-group">
                            <input
                              name="chestInhale"
                              type="text"
                              className="form-control"
                              id="afterInhale"
                              aria-describedby="afterInhale"
                              placeholder="After Inhale"
                              value={chestInhale}
                              // onChange={(e) => setChestInhale(e.target.value)}
                              maxLength={4}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (/^\d*$/.test(value)) {
                                  setChestInhale(value);
                                }
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null}
                  <div className="col-lg-8 col-md-8 mt-3">
                    <div className="row align-items-center mb-3">
                      <div className="col-xl-3 col-lg-4 col-md-4">
                        {/* <label htmlFor="height" className="mb-0">
                          Signature
                         
                        </label> */}
                        <button className="btn btn-primary btn-sm" onClick={() => setSignModal(true)}>Signature</button>
                      </div>
                      <div className="col-xl-4 col-lg-5 col-md-5 mt-lg-0 mt-md-0 mt-3">
                        <div className="form-group mb-0">
                          <div
                            className="border border-dark bg-white"
                            style={{ height: "75px", width: "200px", overflow: "hidden" }}
                            onTouchMove={(e) => e.preventDefault()}
                            onWheel={(e) => e.preventDefault()}
                          >
                            <SignatureCanvas
                              ref={candidateSignRef}
                              penColor="black"
                              canvasProps={{
                                width: 200,
                                height: 75,
                                className: "sigCanvas",
                              }}
                            // onEnd={() => handleSignatureEnd(index)}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-xl-2 col-lg-3 col-md-3 mt-lg-0 mt-md-0 mt-3">
                        <Button
                          variant="secondary"

                          onClick={() => candidateSignRef.current && candidateSignRef.current.clear()}
                        >
                          Clear
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-footer py-3">
                <div className="col-lg-8">
                  <div className="row">
                    <div className="row">
                      <div className="col-lg-4"></div>
                      <div className="col-lg-8">
                        <button
                          className="btn btn-primary"
                          type="submit"
                          onClick={AddChestHeight}
                        >
                          Submit
                        </button>
                        <button className="btn btn-secondary mx-4" onClick={
                          ResetForm
                        }>
                          Clear
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="card mt-5"
              style={{ boxShadow: "0px 1px 5px rgba(0, 0, 0, 0.1)" }}
            >
              <div className="row">
                <div className="col-lg-12">
                  <div className="card-header">
                    <div className="row align-items-center">
                      <div className="col-lg-8">
                        <h4 className="card-title fw-bold py-2">
                          Measurement History
                        </h4>

                      </div>
                      {/* <div className="col-lg-8">
                        <h4 className="card-title fw-bold py-2" onClick={openPrintWindow}>
                          Print
                        </h4>

                      </div> */}
                      <div className="col-lg-4">
                        <button className="btn btn-primary d-none" onClick={openPrintWindow}>Print</button>
                      </div>
                    </div>
                  </div>
                  <div className="card-body pt-3">
                    <Table
                      striped
                      hover
                      responsive
                      className="border text-left mt-4"
                    >
                      <thead>
                        <tr>
                          <th scope="col" style={headerCellStyle}>
                            Height
                          </th>
                          <th scope="col" style={headerCellStyle}>
                            Chest Normal
                          </th>
                          <th scope="col" style={headerCellStyle}>
                            Chest Inhale
                          </th>
                          <th scope="col" style={headerCellStyle}>
                            Signature
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {allHistory.map((data, index) => (
                          <tr key={index}>
                            <td>{data.Height}</td>
                            <td>{data.Chest_normal}</td>
                            <td>{data.Chest_Inhale}</td>
                            <td>
                              {data.Signature ? (
                                <img
                                  src={data.Signature.startsWith("data:image") ? data.Signature : `data:image/png;base64,${data.Signature}`}
                                  alt="signature"
                                  style={{ width: "100px", height: "50px", objectFit: "contain" }}
                                />
                              ) : (
                                <span>No signature</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal show={signModal} onHide={handleSignClose} size="lg" backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>
            <h5 className="fw-bold">Draw Signature</h5>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-3">
          <div
            className="border border-dark bg-white mx-auto"
            style={{
              width: "100%",
              maxWidth: "100%",
              height: "300px",
              overflow: "hidden"
            }}
          >
            <SignatureCanvas
              ref={modalSignRef}
              penColor="black"
              canvasProps={{
                width: canvasWidth,
                height: 300,
                style: {
                  width: "100%",
                  height: "100%",
                  display: "block"
                }
              }}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            style={{ backgroundColor: "#1B5A90", border: "none" }}
            onClick={handleSaveSignature}
          >
            Save
          </Button>
          <Button variant="secondary" onClick={handleClear}>
            Clear
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Measurement;
