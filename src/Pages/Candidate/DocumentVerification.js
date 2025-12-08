import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Storage from "../../Storage";
import { Button } from "react-bootstrap";
import { ArrowBack } from "@material-ui/icons";
import { uploadDocuments } from "../../Components/Api/DocumentVerificationApi";
import { apiClient } from "../../apiClient";
import ErrorHandler from "../../Components/ErrorHandler";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SignatureCanvas from 'react-signature-canvas';
const DocumentVerification = () => {
  const location = useLocation();
  const { fullNameEnglish, candidateId, category, parallelReservation } =
    location.state || {};
  const navigate = useNavigate();
  const candidateKey = candidateId ? candidateId.toString() : "default";
  const documentSignRef = useRef();

  const castValue = localStorage.getItem("cast");

  const documentSubmitLaterKey = `documentSubmitLater_${candidateKey}`;
  const castValueKey = `cast_${candidateKey}`; // added underscore for consistency
  const allowFromOpenKey = `allowFromOpen_${candidateKey}`;

  // Use state variables with values loaded from candidate-specific localStorage keys
  const [isDocumentUpload, setIsDocumentUpload] = useState(null);
  const [getSignature, setGetSignature] = useState("")
  const [catName, setCatName] = useState("");
  // const [castValue, setCastValue] = useState(

  // );
  const [documents, setDocuments] = useState([]);
  const [allowFromOpen, setAllowFromOpen] = useState(
   /*  localStorage.getItem(allowFromOpenKey) || */ ""
  );
  const [submitLater, setSubmitLater] = useState(
   /*  localStorage.getItem(documentSubmitLaterKey) || */ ""
  );
  const [verifyDate, setVerifyDate] = useState("");
  const [dateError, setDateError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getAllDocuments();
        await getAllMandatory();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  const getAllMandatory = async () => {
    const recruitId = localStorage.getItem("recruitId");
    const userId = localStorage.getItem("userId");
    const documentNames =
      JSON.parse(localStorage.getItem("documentNames")) || [];

    try {
      const response = await apiClient({
        method: "get",
        url: `Candidate/GetmandatoryDocuments`,
        params: {
          UserId: userId,
          RecruitId: recruitId,
          Category: parallelReservation,
          Groundtestdata1: "",
        },
      });

      console.log("response all mandatory documents", response.data.data);
      const token1 = response.data.outcome.tokens;
      Cookies.set("UserCredential", token1, { expires: 7 });

      // Filter documents whose DocumentName matches with the first API
      const matchingDocuments = response.data.data.filter((data) =>
        documentNames.includes(data.DocumentName)
      );

      setCatName(matchingDocuments.map((doc) => doc.DocumentName));
      console.log(
        matchingDocuments.map((doc) => doc.DocumentName, "201"),
        "62"
      );
      // console.log(catName, "202")
    } catch (error) {
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
    }
  };

  const getAllDocuments = async () => {
    const recruitId = localStorage.getItem("recruitId");
    const userId = localStorage.getItem("userId");

    try {
      const response = await apiClient({
        method: "get",
        url: `Candidate/GetAllDocuments`,
        params: {
          UserId: userId,
          RecruitId: recruitId,
          Category: parallelReservation,
          CandidateID: candidateId.toString(),
          Groundtestdata1: "",
        },
      });

      console.log("response all documents", response.data.data.data.value.data);
      console.log("response status data", response.data.data.stausData.value.data);
      const statusData = response.data.data.stausData.value.data
      setAllowFromOpen(statusData[0].AllowFromOpen);
      setSubmitLater(statusData[0].DocumentSubmitLater)
      setGetSignature(statusData[0].Signature);
      const token1 = response.data.outcome.tokens;
      Cookies.set("UserCredential", token1, { expires: 7 });

      // Store DocumentName values
      const documentNames = response.data.data.data.value.data.map((doc) => doc.DocumentName);
      localStorage.setItem("documentNames", JSON.stringify(documentNames));

      setDocuments(response.data.data.data.value.data);
    } catch (error) {
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
    }
  };

  const handleCheckboxChange = (id, date) => {
    const formattedDate = date ? `${date}T00:00:00` : null;
    setDocuments((prevDocuments) =>
      prevDocuments.map((doc) =>
        doc.Id === id
          ? {
            ...doc,
            checked: !doc.checked, // Toggle checked
            IsSelected: doc.checked ? 0 : 1, // Update IsSelected based on new checked state
            documentValidateDate: doc.checked
              ? doc.documentValidateDate
              : formattedDate,
          }
          : doc
      )
    );
    console.log(documents, "documents"); // This won't reflect the latest state immediately after setState, but is useful for debugging.
  };

  const handleFileChange = (e, id) => {
    const file = e.target.files[0];

    // If no file is selected, clear existing file data
    if (!file) {
      setDocuments((prevDocuments) => {
        return prevDocuments.map((doc) =>
          doc.Id === id
            ? {
              ...doc,
              file: null,
              fileName: null,
              fileType: null
            }
            : doc
        );
      });
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please upload only JPG, JPEG or PNG files");
      e.target.value = null; // Reset input
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      toast.error("File size should not exceed 5MB");
      e.target.value = null; // Reset input
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      try {
        const base64String = `data:${file.type};charset=utf-8;base64,${reader.result.split(",")[1]}`;

        setDocuments((prevDocuments) => {
          return prevDocuments.map((doc) =>
            doc.Id === id
              ? {
                ...doc,
                file: base64String,
                fileName: file.name,
                fileType: file.type
              }
              : doc
          );
        });

        // Show success message
        toast.success(`${file.name} uploaded successfully`);

      } catch (error) {
        console.error("Error processing file:", error);
        toast.error("Error processing file. Please try again.");
        e.target.value = null;
      }
    };

    reader.onerror = () => {
      console.error("Error reading file");
      toast.error("Error reading file. Please try again.");
      e.target.value = null;
    };

    reader.readAsDataURL(file);
  };

  const CompleteDocumentVerification = () => {
    const recruitId = localStorage.getItem("recruitId");
    const UserId = localStorage.getItem("userId");
    let signature = null;
    if (documentSignRef.current && !documentSignRef.current.isEmpty()) {
      signature = documentSignRef.current.getTrimmedCanvas().toDataURL("image/png");
    }
    // Ensure mandatory fields have values
    if (submitLater === undefined || submitLater === null || submitLater === "") {
      toast.warning("Please specify whether to submit documents later.");
      return;
    }

    if (castValue !== "Open" && (allowFromOpen === undefined || allowFromOpen === null || allowFromOpen === "")) {
      toast.warning("Please select allow from open field!");
      return;
    }

    console.log("Current documents state:", documents); // Check full documents list

    // Filter the checked documents
    const checkedDocuments = documents.filter((doc) => doc.IsSelected);

    console.log("Checked Documents:", checkedDocuments); // Verify selected documents

    if (checkedDocuments.length === 0) {
      toast.warning("Please select at least one document");
      return;
    }

    // Check if 'allow from open' is "1" and 'Caste Certificate' is selected
    const isCasteCertificateSelected = checkedDocuments.some((doc) => doc.DocumentName === "Caste Certificate");

    if (allowFromOpen === "1" && isCasteCertificateSelected) {
      toast.warning("Please select only one: Either 'Allow from Open' or 'Caste Certificate'.");
      return;
    }
    // if (signature === null) {
    //   toast.warning("Please enter a signature");
    //   return;
    // }
    const data = {
      UserId: UserId,
      RecruitId: recruitId,
      CandidateId: candidateId.toString(),
      CategoryName: parallelReservation,
      documentsubmitlater: submitLater, // Always mandatory
      Signature: signature,
      allowFromOpen: castValue === "Open" ? null : allowFromOpen, // Mandatory only if castValue !== "Open"
      DocumentData: checkedDocuments.map((doc) => ({
        DocumentName: doc.DocumentName,
        Document: doc.file || "No File", // Debugging: Show if `file` is missing
        FileName: doc.fileName || doc.DocumentName, // Ensure file name is included
        CategoryName: parallelReservation,
        Status: "1",
        documentValidateDate: doc.documentValidateDate || null,
      })),
    };

    console.log("Final Data Payload:", data); // Verify the final object

    uploadDocuments(data, navigate, candidateId, setIsDocumentUpload, isDocumentUpload);
  };

  const handleViewDocument = (base64String) => {
    if (base64String) {
      // Create a blob from Base64 string
      const byteCharacters = atob(base64String.split(",")[1]);
      const byteNumbers = new Array(byteCharacters.length).fill().map((_, i) => byteCharacters.charCodeAt(i));
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "image/jpeg" });

      // Generate a URL and open it in a new tab
      const imageUrl = URL.createObjectURL(blob);
      window.open(imageUrl, "_blank");
    }
  };

  const handleDateChange = (e, docId) => {
    const selectedDate = e.target.value;
    setDocuments((prevDocuments) =>
      prevDocuments.map((doc) =>
        doc.Id === docId ? { ...doc, documentValidateDate: selectedDate } : doc
      )
    );
  };

  const handleAllowOpen = (event) => {
    setAllowFromOpen(event.target.value); // Update state with selected value
  };

  return (
    <>
      <style>
        {`
        .form-check-input:checked {
            background-color: green;
        }
        `}
      </style>
      <div className="container-fluid p-3">
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-header py-3">
                <div className="row">
                  <div className="col-lg-10 col-md-10 col-9 my-auto">
                    <h5 className="fw-bold">Add Documents Verification</h5>
                    <h6 className="mt-3">
                      <span className="fw-bold">Candidate Name:</span>{" "}
                      {fullNameEnglish}
                    </h6>
                  </div>
                  <div className="col-lg-2 col-md-2 col-3 d-flex flex-wrap justify-content-end">
                    <div
                      className="btn btn-add"
                      title="Back"
                      onClick={
                        () => navigate(`/candidate/${candidateId}`)
                        // navigate("/candidate", {
                        //   state: { candidateId},
                        // })
                      }
                    >
                      <button
                        className="btn btn-md text-light"
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
                  <div className="col-lg-6">
                    {/* Allow from Open */}
                    {castValue !== "Open" && castValue !== "OPEN" ? (
                      <div className="row">
                        <div className="col-lg-5">
                          <label>Allow from Open</label>
                          {castValue !== "Open" && castValue !== "OPEN" ? <span style={{ color: "red" }}> *</span> : null}
                        </div>
                        <div className="col-lg-6 d-flex align-items-center gap-3">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="allowFromOpen"
                              id="allowFromOpenYes"
                              value="1"
                              checked={allowFromOpen === "1"}
                              onChange={(e) => setAllowFromOpen(e.target.value)}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="allowFromOpenYes"
                            >
                              Yes
                            </label>
                          </div>
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="allowFromOpen"
                              id="allowFromOpenNo"
                              value="0"
                              checked={allowFromOpen === "0"}
                              onChange={(e) => setAllowFromOpen(e.target.value)}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="allowFromOpenNo"
                            >
                              No
                            </label>
                          </div>
                        </div>
                      </div>
                    ) : null}

                    {/* Document Submit Later */}
                    <div className="row mt-4">
                      <div className="col-lg-5">
                        <label>Document Submit Later</label>
                        <span style={{ color: "red" }}> *</span>
                      </div>
                      <div className="col-lg-6 d-flex align-items-center gap-3">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="submitLater"
                            id="submitLaterYes"
                            value="1"
                            checked={submitLater === "1"}
                            onChange={(e) => setSubmitLater(e.target.value)}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="submitLaterYes"
                          >
                            Yes
                          </label>
                        </div>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="submitLater"
                            id="submitLaterNo"
                            value="0"
                            checked={submitLater === "0"}
                            onChange={(e) => setSubmitLater(e.target.value)}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="submitLaterNo"
                          >
                            No
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  {documents.map((doc) => (
                    <div className="col-lg-12  mt-4" key={doc.Id}>
                      <div className="row">
                        <div className="col-lg-7">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={doc.IsSelected} // Checkbox is checked if IsSelected is 1
                            onChange={() => handleCheckboxChange(doc.Id)}
                          />
                          &nbsp;
                          {/* <label>
                            {doc.DocumentName}
                            {(doc.DocumentName === "Caste Certificate" &&
                              castValue !== "Open" &&
                              castValue !== "OPEN") ||
                              (catName.includes(doc.DocumentName) &&
                                !(
                                  doc.DocumentName === "Caste Certificate" &&
                                  doc.Addaccess !== "1"
                                )) ? (
                              <span style={{ color: "red" }}> *</span>
                            ) : null}
                            {doc.IsSelected && doc.ExpDocumentDate !== null ? <span style={{ color: "red" }}>Date is required</span> : null}
                          </label> */}

                          <label>
                            {doc.DocumentName}
                            {(doc.DocumentName === "Caste Certificate" &&
                              castValue !== "Open" &&
                              castValue !== "OPEN") ||
                              (catName.includes(doc.DocumentName) &&
                                !(
                                  doc.DocumentName === "Caste Certificate" &&
                                  doc.Addaccess !== "1"
                                ) &&
                                !(
                                  doc.DocumentName === "Non-Creamy Layer Certificate" &&
                                  (castValue === "Open" || castValue === "OPEN" || castValue === "SC" || castValue === "NT-B" || castValue === "NT-C" || castValue === "NT-D")
                                ) &&
                                !(
                                  doc.DocumentName === "Non-Creamy Layer Certificate" &&
                                  doc.Addaccess === "1"
                                )) ? (
                              <span style={{ color: "red" }}> *</span>
                            ) : null}
                            {doc.IsSelected && doc.ExpDocumentDate !== null ? (
                              <span style={{ color: "red" }}>Date is required</span>
                            ) : null}
                          </label>
                        </div>
                        <div className="col-lg-3  mt-lg-0 mt-3">
                          {/* <div className="form-group">
                            <input
                              type="file"
                              className="form-control"
                              onChange={(e) => handleFileChange(e, doc.Id)}
                            />
                          </div> */}
                          <div className="form-group">
                            <input
                              type="file"
                              className="form-control"
                              onChange={(e) => handleFileChange(e, doc.Id)}
                            />
                            {doc.Document && doc.Document.trim() !== "No File" && (
                              <div className="mt-2">
                                <button
                                  className="btn btn-link p-0 text-primary"
                                  onClick={() => handleViewDocument(doc.Document)}
                                >
                                  View Uploaded Image
                                </button>
                              </div>
                            )}
                          </div>

                        </div>
                        <div className="col-lg-2  mt-lg-0 mt-3">
                          {/* <input
                          className="form-control"
                          type="date"
                          value={doc.documentValidateDate || ""}
                          onChange={(e) => handleDateChange(e, doc.Id)}
                        /> */}
                          <input
                            className="form-control"
                            type="date"
                            value={
                              doc.documentValidateDate
                                ? doc.documentValidateDate.split("T")[0]
                                : ""
                            } // Automatically bind existing date
                            onChange={(e) => handleDateChange(e, doc.Id)}
                          />
                          {doc.documentValidateDate > doc.ExpDocumentDate ? (
                            <h6>
                              <span className="text-danger fw-bold">
                                Date should be before{" "}
                                {doc.ExpDocumentDate.split("T")[0]}
                              </span>
                            </h6>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="row mt-3">
                  <div className="col-lg-12">

                    <div className="row">
                      <div className="col-lg-7">
                        <label>Signature</label>
                        {/* <span style={{ color: "red" }}> *</span> */}
                      </div>
                      <div className="col-lg-2">
                        <div className="form-group mb-0">
                          <div
                            className="border border-dark bg-white"
                            style={{ height: "75px", width: "150px", overflow: "hidden" }}
                          >
                            {getSignature ? (
                              <img
                                src={getSignature}
                                alt="Signature"
                                style={{ height: "100%", width: "100%", objectFit: "contain" }}
                              />
                            ) : (
                              <SignatureCanvas
                                ref={documentSignRef}
                                penColor="black"
                                canvasProps={{
                                  width: 200,
                                  height: 150,
                                  className: "sigCanvas",
                                }}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-3">
                        <Button
                          variant="secondary"
                          onClick={() => {
                            if (documentSignRef.current) {
                              documentSignRef.current.clear();
                            }
                            setGetSignature(null); // Clear the image preview as well
                          }}
                        >
                          Clear
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-footer py-3">
                <div className="row">
                  <div className="col-lg-12">
                    <div className="row">
                      <div className="col-lg-3"></div>
                      <div className="col-lg-9">
                        <button
                          className="btn btn-primary"
                          onClick={CompleteDocumentVerification}
                        >
                          Complete Verification
                        </button>
                        <button
                          className="btn btn-secondary mx-4"
                          onClick={() => navigate(-1)}
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DocumentVerification;
