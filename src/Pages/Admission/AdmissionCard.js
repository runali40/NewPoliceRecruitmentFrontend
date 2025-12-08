import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getAdmissionCard, getAllCandidates } from "../../Components/Api/AdmissionCardApi";
import { ArrowBack } from "@material-ui/icons";
import 'react-toastify/dist/ReactToastify.css';
import CryptoJS from "crypto-js";

const AdmissionCard = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [selectedValue, setSelectedValue] = useState(state?.candidateid);
  const [allCandidates, setAllCandidates] = useState([]);
  const [documentUploaded, setDocumentUploaded] = useState();
  const [recruitmentYear, setRecruitmentYear] = useState("");
  const [officeName, setOfficeName] = useState("");
  const [portName, setPortName] = useState("");
  const [applicationNo, setApplicationNo] = useState("");
  const [examinationPort, setExaminationPort] = useState("");
  const [fullNameDevnagari, setFullNameDevnagari] = useState("");
  const [fullNameEnglish, setFullNameEnglish] = useState("");
  const [firstNameEnglish, setFirstNameEnglish] = useState("")
  const [surnameEnglish, setSurnameEnglish] = useState("")
  const [firstNameMarathi, setFirstNameMarathi] = useState("")
  const [surnameMarathi, setSurnameMarathi] = useState("")
  const [mothersName, setMothersName] = useState("");
  const [gender, setGender] = useState("");
  const [maritalStatus, setMaritalStatus] = useState("");
  const [candidateNo, setCandidateNo] = useState("");
  const [dob, setDob] = useState("");
  const [age, setAge] = useState("");
  const [address, setAddress] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [emailId, setEmailId] = useState("");
  const [permanentAddress, setPermanentAddress] = useState("");
  const [permanentPinCode, setPermanentPinCode] = useState("");
  const [nationality, setNationality] = useState("");
  const [religion, setReligion] = useState("");
  const [cast, setCast] = useState("");
  const [subCast, setSubCast] = useState("");
  const [partTime, setPartTime] = useState("");
  const [projectSick, setProjectSick] = useState("");
  const [exExamination, setExExamination] = useState("");
  const [earthquakeAttacked, setEarthquakeAttacked] = useState("");
  const [chestNo, setChestNo] = useState("");
  const [secretKey, setSecretKey] = useState("")
  const [photo, setPhoto] = useState("")
  const [candidateId, setCandidateId] = useState("")
  const [height, setHeight] = useState("")
  const [chestNormal, setChestNormal] = useState("")
  const [chestInhale, setChestInhale] = useState("")
  const GenratePdfRef = useRef();

  useEffect(() => {
    const fetchAdmissionCard = async () => {
      if (state?.candidateid?.value) {
        const cardData = await getAdmissionCard(state.candidateid.value);
        if (cardData) {
          setChestNo(cardData?.chestno);
          setRecruitmentYear(cardData?.RecruitmentYear);
          setApplicationNo(cardData?.ApplicationNo);
          setPortName(cardData?.PortName);
          setExaminationPort(cardData?.ExaminationFee);
          setFullNameDevnagari(cardData?.FullNameDevnagari);
          setFullNameEnglish(cardData?.FullNameEnglish);
          setFirstNameMarathi(cardData?.FirstName_Marathi);
          setSurnameMarathi(cardData?.Surname_Marathi);
          setFirstNameEnglish(cardData?.FirstName_English);
          setSurnameEnglish(cardData?.Surname_English);
          setMothersName(cardData?.MotherName_Marathi);
          setGender(cardData?.Gender);
          setCandidateNo(cardData?.CandidateNo);
          setDob(cardData?.DOB);
          setAddress(cardData?.Address1 + " " + cardData?.Address2 + " " + cardData?.Address3);
          setMobileNumber(cardData?.MobileNumber);
          setPortName(cardData?.PostName);
          setOfficeName(cardData?.OfficeName);
          setAge(cardData?.Age);
          setCandidateId(cardData?.CandidateId);
          setPinCode(cardData?.PinCode);
          setEmailId(cardData?.EmailId);
          setPermanentAddress(cardData?.PermanentAddress1);
          setPermanentPinCode(cardData?.["Permanant PinCode"]);
          setCast(cardData?.Cast);
          setSubCast(cardData?.SubCast);
          setPartTime(cardData?.PartTime);
          setProjectSick(cardData?.ProjectSick);
          setExExamination(cardData?.ExServiceman);
          setEarthquakeAttacked(cardData?.EarthquakeAffected);
          setNationality(cardData?.Nationality);
          setReligion(cardData?.Religion);
          setMaritalStatus(cardData?.MaritalStatus);
          setPhoto(cardData?.imagestring)
          setSecretKey(cardData?.Secretkeys)
          setHeight(cardData?.Height)
          setChestNormal(cardData?.Chest_normal)
          setChestInhale(cardData?.Chest_Inhale)
        }
      }
    };

    fetchAdmissionCard();
  }, [state?.candidateid?.value]);

  const decryptImage = useCallback(
    (encryptedImage) => {
      try {
        const [ivHex, encryptedHex] = encryptedImage.split(":"); // Split IV and encrypted data
        const key = CryptoJS.enc.Hex.parse(secretKey); // Parse secret key
        const iv = CryptoJS.enc.Hex.parse(ivHex); // Use the IV from the encrypted image

        // Decrypt the image
        const decryptedBytes = CryptoJS.AES.decrypt(
          { ciphertext: CryptoJS.enc.Hex.parse(encryptedHex) },
          key,
          { iv, padding: CryptoJS.pad.Pkcs7 }
        );

        // Convert decrypted WordArray to Base64
        const decryptedBase64 = CryptoJS.enc.Base64.stringify(decryptedBytes);
        // console.log("Decrypted image:", decryptedBase64);

        return `data:image/png;base64,${decryptedBase64}`; // Return image in base64 format
      } catch (error) {
        console.error("Error during decryption:", error);
        return ""; // Return empty string on error
      }
    },
    [secretKey]
  );

  const decryptedImageUrl1 = photo ? decryptImage(photo) : null;
  // You can use the photo state directly in your component rendering
  // console.log("Decrypted Image URL:", decryptedImageUrl1);


  return (
    <>
      <style>
        {`
@media print and (orientation: portrait) {
  body * {
    visibility: hidden;
  }

  #section-to-print, #section-to-print * {
    visibility: visible;
  }

  #section-to-print {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
  }

  .rejected-stamp {
    position: absolute;
    top: 200px;
    right: 20px;
    width: 300px;
    height: 300px;
    opacity: 0.5;
    transition: opacity 1s ease-in-out;
  }

  .row {
    display: flex;
    flex-wrap: wrap;
  }

  .col-lg-4, .col-md-4 {
    width: 33.333333%;
  }

  .col-lg-8, .col-md-8 {
    width: 66.666667%;
    margin-top: 0;
  }

  .col-lg-5, .col-md-5 {
    width: 41.666667%;
  }

  .col-lg-7, .col-md-7 {
    width: 58.333333%;
  }

  .print-section {
    display: none;
  }
 /* Adjusted .image-box */
  .image-box {
    width: 110%;  /* Decreased the width */
    height: 30%; /* Set a specific height */
    position: relative;
    background-color: #f0f0f0;
    border: 2px solid #ccc;
    border-radius: 8px;
    overflow: hidden;
  }
}

@media print and (orientation: landscape) {
  body * {
    visibility: hidden;
  }

  #section-to-print, #section-to-print * {
    visibility: visible;
  }

  #section-to-print {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
  }

  .rejected-stamp {
    position: absolute;
    top: 150px;
    right: 30px;
    width: 400px;
    height: 400px;
    opacity: 0.5;
    transition: opacity 1s ease-in-out;
  }

  .row {
    display: flex;
    flex-wrap: wrap;
  }

  .col-lg-4, .col-md-4 {
    width: 25%;
  }

  .col-lg-8, .col-md-8 {
    width: 75%;
    margin-top: 0;
  }

  .col-lg-5, .col-md-5 {
    width: 45%;
  }

  .col-lg-7, .col-md-7 {
    width: 55%;
  }

  .print-section {
    display: none;
  }
     /* Adjusted .image-box for landscape mode */
  .image-box {
    width: 130%;  /* Decreased the width */
    height: 30%; /* Set a specific height */
    position: relative;
    background-color: #f0f0f0;
    border: 2px solid #ccc;
    border-radius: 8px;
    overflow: hidden;
  }
}

`}
      </style>
      <style>
        {
          `
 @media print {

  /* Remove ALL default margins */
  @page {
    margin: 0 !important;
    size: A4;
  }

  /* Remove browser top/left spacing */
  html, body {
    margin: 0 !important;
    padding: 0 !important;
    width: 100% !important;
  }

  /* Only admit card visible */
  body * {
    visibility: hidden !important;
  }
  #admitCardPrint, #admitCardPrint * {
    visibility: visible !important;
  }

  /* Full page width */
  #admitCardPrint {
    position: absolute;
    top: 0;
    left: 0;
    width: 100% !important;
    padding: 0 !important;
    margin: 0 !important;

    /* Removed zoom because it was causing shifting */
    transform: scale(1) !important;
  }

  /* Prevent Bootstrap collapse */
  .row {
    display: flex !important;
    flex-wrap: nowrap !important;
    width: 100% !important;
  }

  /* Columns size */
  .col-lg-9 {
    width: 70% !important;
  }
  .col-lg-3 {
    width: 40% !important;
  }

  .col-lg-5, .col-lg-4, .col-lg-7 {
    float: left !important;
    display: block !important;
  }

  /* Photos perfect print */
  .image-box, img {
    width: 200px !important;
    height: 60px !important;
    object-fit: cover !important;
    border: 1px solid #000 !important;
    display: block !important;
  }

  /* Font stabilization */
  * {
    font-size: 15px !important;
    line-height: 20px !important;
  }

  /* Right side values alignment */
  .text-end {
    text-align: right !important;
  }
}

 `
        }
      </style>
      <div className="container-fluid" /* id="section-to-print" */ id="admitCardPrint">
        <div
          className="card m-3"
          style={{ boxShadow: "0px 1px 5px rgba(0, 0, 0, 0.1)" }}
        >
          <div className="row">
            <div className="col-lg-12">
              <div className="container p-3 print-section" >
                <div className="row align-items-center">
                  <div className="col-xl-3 col-lg-3 col-md-3">
                    {/* <h4 className="card-title fw-bold">User Master</h4> */}
                  </div>
                  <div className="col-auto d-flex flex-wrap ms-auto justify-content-end">
                    <div className="d-flex gap-3">
                      <button
                        className="btn btn-md btn-primary"
                        style={{ backgroundColor: "rgb(27, 90, 144)" }}
                        onClick={() => window.print()}
                      >
                        Print
                      </button>
                      <button
                        className="btn btn-md text-light"
                        type="button"
                        style={{ backgroundColor: "#1B5A90" }}
                        onClick={() => {
                          navigate(`/candidate/${candidateId}`, { state: { fullNameEnglish } });
                        }}
                      >
                        <ArrowBack />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="border" ref={GenratePdfRef}>
                <div
                  className="card-header p-3" /* style={{ backgroundColor: 'white' }} */
                >
                  <div className="row align-items-center">
                    <div className="col">
                      <h4 className="card-title fw-bold text-center">
                        Admit Card
                      </h4>
                    </div>
                  </div>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-lg-4 col-md-4 col-md-4">
                      <div className="row">
                        <div className="col-lg-7 col-md-7 col-6">
                          <label htmlFor="recruitmentYear">
                            Recruitment Year:
                          </label>
                        </div>
                        <div className="col-lg-5 col-md-5 col-6 mt-lg-0 mt-md-0 text-start">
                          <label>{recruitmentYear}</label>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-4">
                      <div className="row">
                        <div className="col-lg-4 col-md-4 col-6">
                          <label htmlFor="portName">Port Name:</label>
                        </div>
                        <div className="col-lg-8 col-md-8 col-6 mt-lg-0 mt-md-0">
                          <label>{portName}</label>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-4">
                      <div className="row">
                        <div className="col-lg-7 col-md-7 col-6 mt-3 mt-lg-0 mt-md-0">
                          <label htmlFor="examinationPort">
                            Examination port:
                          </label>
                        </div>
                        <div className="col-lg-4 col-md-4 col-6 mt-3 mt-lg-0 mt-md-0">
                          <label>{examinationPort}</label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row mt-3">
                    <div className="col-lg-4 col-md-4 ">
                      <div className="row">
                        <div className="col-lg-7 col-md-7 col-6 mt-3 mt-lg-0 mt-md-0">
                          <label htmlFor="applicationNo">Application no:</label>
                        </div>
                        <div className="col-lg-4 col-md-4 col-6 mt-3 mt-lg-0 mt-md-0">
                          <label>{applicationNo}</label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="card-header bg-white mt-3 border"
                  >
                    <div className="row align-items-center">
                      <div className="col">
                        <h4 className="card-title fw-bold text-start">
                          Personal Information
                        </h4>
                      </div>
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-lg-9">
                        <div className="row">
                          <div className="col-xl-4 col-lg-5 col-md-5 col-6">
                            <label htmlFor="fullNameDevnagari">
                              Candidate's Full Name <br /> (in Devnagari) :
                            </label>
                          </div>
                          <div className="col-lg-7 col-md-7 col-6 mt-lg-0 mt-md-0">
                            <label>{firstNameMarathi + " " + surnameMarathi}</label>
                          </div>
                        </div>
                        <div className="row mt-3">
                          <div className="col-xl-4 col-lg-5 col-md-5 col-6">
                            <label htmlFor="fullNameEnglish">
                              Candidate's Full Name <br /> (in English) :
                            </label>
                          </div>
                          <div className="col-lg-7 col-md-7 col-6 mt-lg-0 mt-md-0">
                            <label>{firstNameEnglish + " " + surnameEnglish}</label>
                          </div>
                        </div>
                        <div className="row mt-3">
                          <div className="col-xl-4 col-lg-5 col-md-5 col-6">
                            <label htmlFor="gender">Gender:</label>
                          </div>
                          <div className="col-lg-7 col-md-7 col-6 mt-lg-0 mt-md-0">
                            <label>{gender}</label>
                          </div>
                        </div>
                        <div className="row mt-3">
                          <div className="col-xl-4 col-lg-5 col-md-5 col-6">
                            <label htmlFor="candidateNo">Candidate No :</label>
                          </div>
                          <div className="col-lg-7 col-md-7 col-6 mt-lg-0 mt-md-0">
                            <label>{candidateId}</label>
                          </div>
                        </div>
                        <div className="row mt-3">
                          <div className="col-xl-4 col-lg-5 col-md-5 col-6">
                            <label htmlFor="candidateNo">Date of Birth :</label>
                          </div>
                          <div className="col-lg-7 col-md-7 col-6 mt-lg-0 mt-md-0">
                            <label>{dob.split("T")[0]}</label>
                          </div>
                        </div>
                        <div className="row mt-3">
                          <div className="col-xl-4 col-lg-5 col-md-5 col-6">
                            <label htmlFor="candidateNo">Age on :</label>
                          </div>
                          <div className="col-lg-7 col-md-7 col-6 mt-lg-0 mt-md-0">
                            <label>{age.split("T")[0]}</label>
                          </div>
                        </div>
                        <div className="row mt-3">
                          <div className="col-xl-4 col-lg-5 col-md-5 col-6">
                            <label htmlFor="mobileNumber">Mobile Number:</label>
                          </div>
                          <div className="col-lg-7 col-md-7 col-6 mt-lg-0 mt-md-0 d-block">
                            <label>{mobileNumber}</label>
                          </div>
                        </div>
                        <div className="row mt-3">
                          <div className="col-xl-4 col-lg-5 col-md-5 col-6">
                            <label htmlFor="emailId">Email Id :</label>
                          </div>
                          <div className="col-lg-7 col-md-7 col-6 mt-lg-0 mt-md-0 d-block">
                            <label>{emailId}</label>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-3">
                        <div className="row">
                          <div className="col-lg-8 col-md-6 col-8 mt-3 mt-lg-0 mt-md-0 text-end">
                            <label htmlFor="officeName" style={{ fontSize: "20px" }}><b>Chest No:</b></label>
                          </div>
                          <div className="col-lg-4 col-md-4 col-6 mt-3 mt-lg-0 mt-md-0 text-end">
                            <label style={{ fontSize: "20px" }}>
                              <b>{chestNo}</b>
                            </label>
                          </div>

                        </div>
                        <div className="row mt-3">
                          <div className="col-lg-6 col-md-6 col-6 mt-3 mt-lg-0 mt-md-0">
                            {
                              decryptedImageUrl1 ? <img src={decryptedImageUrl1} className="img-fluid image-box" /> : null
                            }
                          </div>
                          <div className="col-lg-6 col-md-6 col-6 mt-3 mt-lg-0 mt-md-0">
                            {
                              decryptedImageUrl1 ? <img src={decryptedImageUrl1} className="img-fluid image-box" /> : null
                            }
                          </div>
                        </div>
                        <div className="row mt-4">
                          <div className="col-lg-8 col-md-8 col-6 mt-3 mt-lg-0 mt-md-0 text-end">
                            <label htmlFor="officeName">Height:</label>
                          </div>
                          <div className="col-lg-4 col-md-4 col-6 mt-3 mt-lg-0 mt-md-0 text-end">
                            <label>{height} cm</label>
                          </div>
                        </div>
                        {
                          gender === "Male" ?
                            (
                              <>
                                <div className="row mt-3">
                                  <div className="col-lg-8 col-md-8 col-6 mt-3 mt-lg-0 mt-md-0 text-end">
                                    <label htmlFor="officeName">Chest Normal:</label>
                                  </div>
                                  <div className="col-lg-4 col-md-4 col-6 mt-3 mt-lg-0 mt-md-0 text-end">
                                    <label>{chestNormal} cm</label>
                                  </div>
                                </div>
                                <div className="row mt-3">
                                  <div className="col-lg-8 col-md-8 col-6 mt-3 mt-lg-0 mt-md-0 text-end">
                                    <label htmlFor="officeName">Chest Inhale:</label>
                                  </div>
                                  <div className="col-lg-4 col-md-4 col-6 mt-3 mt-lg-0 mt-md-0 text-end">
                                    <label>{chestInhale} cm</label>
                                  </div>
                                </div>
                              </>
                            ) : null
                        }
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
export default AdmissionCard;
