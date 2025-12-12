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
          //           `
          //          @media print {
          //   /* Page setup - A4 with minimal margins */
          //   @page {
          //     margin: 10mm;
          //     size: A4 portrait;
          //   }

          //   /* Reset browser defaults */
          //   html, body {
          //     margin: 0 !important;
          //     padding: 0 !important;
          //     width: 100% !important;
          //     height: 100% !important;
          //   }

          //   /* Hide everything except admit card */
          //   body * {
          //     visibility: hidden !important;
          //   }

          //   #admitCardPrint, 
          //   #admitCardPrint * {
          //     visibility: visible !important;
          //   }

          //   /* Position admit card to fill page */
          //   #admitCardPrint {
          //     position: absolute !important;
          //     top: 0 !important;
          //     left: 0 !important;
          //     width: 100% !important;
          //     margin: 0 !important;
          //     padding: 15px !important;
          //     box-sizing: border-box !important;
          //   }

          //   /* Remove shadows and adjust card spacing */
          //   .card {
          //     margin: 0 !important;
          //     box-shadow: none !important;
          //     border: 1px solid #ddd !important;
          //   }

          //   /* Hide print button and back button */
          //   .btn, button {
          //     display: none !important;
          //   }

          //   /* Ensure proper row display */
          //   .row {
          //     display: flex !important;
          //     flex-wrap: wrap !important;
          //     margin-left: -15px !important;
          //     margin-right: -15px !important;
          //     width: calc(100% + 30px) !important;
          //   }

          //   /* Column widths - maintain Bootstrap grid */
          //   .col-lg-3, .col-lg-4 {
          //     width: 33.333% !important;
          //     flex: 0 0 33.333% !important;
          //   }

          //   .col-lg-5 {
          //     width: 41.666% !important;
          //     flex: 0 0 41.666% !important;
          //   }

          //   .col-lg-7 {
          //     width: 58.333% !important;
          //     flex: 0 0 58.333% !important;
          //   }

          //   .col-lg-8 {
          //     width: 66.666% !important;
          //     flex: 0 0 66.666% !important;
          //   }

          //   /* Fix main layout - left side 70%, right side 30% */
          //   .card-body > .row > .col-lg-9 {
          //     width: 70% !important;
          //     flex: 0 0 70% !important;
          //   }

          //   .card-body > .row > .col-lg-3 {
          //     width: 30% !important;
          //     flex: 0 0 30% !important;
          //     position: relative !important;
          //     top: 0 !important;
          //   }

          //   .col-lg-6 {
          //     width: 50% !important;
          //     flex: 0 0 50% !important;
          //   }

          //   /* Add padding to columns */
          //   [class*="col-"] {
          //     padding-left: 15px !important;
          //     padding-right: 15px !important;
          //   }

          //   /* Image sizing for photos */
          //   .image-box {
          //     width: 100% !important;
          //     max-width: 115px !important;
          //     height: 100px !important;
          //     object-fit: cover !important;
          //     border: 2px solid #333 !important;
          //     display: block !important;
          //     margin: 0 auto !important;
          //   }

          //   /* Right side section - chest no and photos */
          //   .card-body > .row > .col-lg-3 {
          //     display: flex !important;
          //     flex-direction: column !important;
          //     align-items: flex-end !important;
          //   }

          //   .card-body > .row > .col-lg-3 > .row {
          //     width: 100% !important;
          //     margin: 5px 0 !important;
          //   }

          //   /* Photos row side by side */
          //   .card-body > .row > .col-lg-3 > .row .col-lg-6 {
          //     padding: 5px !important;
          //   }

          //   /* Typography - INCREASED FONT SIZES */
          //   label {
          //     font-size: 16px !important;
          //     line-height: 1.6 !important;
          //     color: #000 !important;
          //     font-weight: normal !important;
          //   }

          //   h4 {
          //     font-size: 22px !important;
          //     font-weight: bold !important;
          //     margin: 15px 0 !important;
          //     color: #000 !important;
          //   }

          //   /* Card header styling */
          //   .card-header {
          //     padding: 12px 15px !important;
          //     background-color: #f8f9fa !important;
          //     border-bottom: 2px solid #333 !important;
          //   }

          //   .card-body {
          //     padding: 20px !important;
          //   }

          //   /* Spacing adjustments */
          //   .mt-3 {
          //     margin-top: 15px !important;
          //   }

          //   .mt-4 {
          //     margin-top: 20px !important;
          //   }

          //   /* Text alignment */
          //   .text-center {
          //     text-align: center !important;
          //   }

          //   .text-start {
          //     text-align: left !important;
          //   }

          //   .text-end {
          //     text-align: right !important;
          //   }

          //   /* Border styling */
          //   .border {
          //     border: 1px solid #333 !important;
          //   }

          //   /* Ensure chest number is prominent */
          //   .col-lg-3 label b {
          //     font-weight: bold !important;
          //     font-size: 20px !important;
          //   }

          //   /* TOP SECTION - All 3 items in ONE LINE */
          //   .card-body > .row:first-child {
          //     display: flex !important;
          //     flex-wrap: nowrap !important;
          //     align-items: center !important;
          //     margin-bottom: 0 !important;
          //   }

          //   .card-body > .row:first-child > .col-lg-4 {
          //     width: 33.333% !important;
          //     flex: 0 0 33.333% !important;
          //     margin-top: 0 !important;
          //   }

          //   /* APPLICATION NO ROW - Second row */
          //   .card-body > .row:nth-child(2) {
          //     display: flex !important;
          //     margin-top: 15px !important;
          //     margin-bottom: 15px !important;
          //   }

          //   .card-body > .row:nth-child(2) > .col-lg-4 {
          //     width: 33.333% !important;
          //     flex: 0 0 33.333% !important;
          //   }

          //   /* Background colors */
          //   .bg-white {
          //     background-color: #fff !important;
          //   }

          //   /* Container spacing */
          //   .container, .container-fluid {
          //     width: 100% !important;
          //     padding: 0 !important;
          //     margin: 0 !important;
          //   }

          //   /* Prevent page breaks inside important sections */
          //   .card-body,
          //   .row {
          //     page-break-inside: avoid !important;
          //   }

          //   /* Flex utilities */
          //   .d-flex {
          //     display: flex !important;
          //   }

          //   .gap-3 {
          //     display: none !important; /* Hide button container */
          //   }
          // }
          //          `

          `
                   @media print {
            /* Page setup - A4 with minimal margins */
            @page {
              margin: 10mm;
              size: A4 portrait;
            }

            /* Reset browser defaults */
            html, body {
              margin: 0 !important;
              padding: 0 !important;
              width: 100% !important;
              height: 100% !important;
            }

            /* Hide everything except admit card */
            body * {
              visibility: hidden !important;
            }

            #admitCardPrint, 
            #admitCardPrint * {
              visibility: visible !important;
            }

            /* Position admit card to fill page */
            #admitCardPrint {
              position: absolute !important;
              top: 0 !important;
              left: 0 !important;
              width: 100% !important;
              margin: 0 !important;
              padding: 15px !important;
              box-sizing: border-box !important;
            }

            /* Remove shadows and adjust card spacing */
            .card {
              margin: 0 !important;
              box-shadow: none !important;
              border: 1px solid #ddd !important;
            }

            /* Hide print button and back button */
            .btn, button {
              display: none !important;
            }

            /* Ensure proper row display */
            .row {
              display: flex !important;
              flex-wrap: wrap !important;
              margin-left: -15px !important;
              margin-right: -15px !important;
              width: calc(100% + 30px) !important;
            }

            /* Column widths - maintain Bootstrap grid */
            .col-lg-3, .col-lg-4 {
              width: 33.333% !important;
              flex: 0 0 33.333% !important;
            }

            .col-lg-5 {
              width: 41.666% !important;
              flex: 0 0 41.666% !important;
            }

            .col-lg-7 {
              width: 58.333% !important;
              flex: 0 0 58.333% !important;
            }

            .col-lg-8 {
              width: 66.666% !important;
              flex: 0 0 66.666% !important;
            }

            /* Fix main layout - left side 70%, right side 30% */
            .card-body > .row > .col-lg-9 {
              width: 68% !important;
              flex: 0 0 68% !important;
            }

            .card-body > .row > .col-lg-3 {
              width: 32% !important;
              flex: 0 0 32% !important;
              position: relative !important;
              top: 0 !important;
            }

            /* Personal Information section - proper spacing */
            .card-body > .row > .col-lg-9 > .row {
              margin-bottom: 8px !important;
            }

            .card-body > .row > .col-lg-9 > .row > div {
              display: inline-block !important;
            }

            .col-lg-6 {
              width: 50% !important;
              flex: 0 0 50% !important;
            }

            /* Add padding to columns */
            [class*="col-"] {
              padding-left: 15px !important;
              padding-right: 15px !important;
            }

            /* Image sizing for photos */
            .image-box {
              width: 100% !important;
              max-width: 115px !important;
              height: 100px !important;
              object-fit: cover !important;
              border: 2px solid #333 !important;
              display: block !important;
              margin: 0 auto !important;
            }

            /* Right side section - chest no and photos */
            .card-body > .row > .col-lg-3 {
              display: flex !important;
              flex-direction: column !important;
              align-items: flex-end !important;
            }

            .card-body > .row > .col-lg-3 > .row {
              width: 100% !important;
              margin: 5px 0 !important;
            }

            /* Chest No row - keep in one line */
            .card-body > .row > .col-lg-3 > .row:first-child {
              display: flex !important;
              flex-wrap: nowrap !important;
              align-items: center !important;
              justify-content: flex-end !important;
              margin-top: 0 !important;
            }

            .card-body > .row > .col-lg-3 > .row:first-child > .col-lg-8,
            .card-body > .row > .col-lg-3 > .row:first-child > .col-lg-4 {
              width: auto !important;
              flex: 0 0 auto !important;
              white-space: nowrap !important;
            }

            /* Photos row side by side */
            .card-body > .row > .col-lg-3 > .row .col-lg-6 {
              padding: 5px !important;
            }

            /* Typography - INCREASED FONT SIZES */
            label {
              font-size: 16px !important;
              line-height: 1.6 !important;
              color: #000 !important;
              font-weight: normal !important;
            }

            h4 {
              font-size: 22px !important;
              font-weight: bold !important;
              margin: 15px 0 !important;
              color: #000 !important;
            }

            /* Card header styling */
            .card-header {
              padding: 12px 15px !important;
              background-color: #f8f9fa !important;
              border-bottom: 2px solid #333 !important;
            }

            .card-body {
              padding: 20px !important;
            }

            /* Spacing adjustments */
            .mt-3 {
              margin-top: 15px !important;
            }

            .mt-4 {
              margin-top: 20px !important;
            }

            /* Text alignment */
            .text-center {
              text-align: center !important;
            }

            .text-start {
              text-align: left !important;
            }

            .text-end {
              text-align: right !important;
            }

            /* Border styling */
            .border {
              border: 1px solid #333 !important;
            }

            /* Ensure chest number is prominent */
            .col-lg-3 label b {
              font-weight: bold !important;
              font-size: 20px !important;
            }

            /* TOP SECTION - First 2 items in LINE 1 (Recruitment Year & Port Name) */
            .card-body > .row:first-child {
              display: flex !important;
              flex-wrap: nowrap !important;
              align-items: flex-start !important;
              margin-bottom: 10px !important;
              margin-left: 20px;
            }

            /* Each top section item */
            .card-body > .row:first-child > .col-lg-4 {
              width: 33.333% !important;
              flex: 0 0 33.333% !important;
              margin-top: 0 !important;
            }

            /* Show first 2, hide 3rd */
            .card-body > .row:first-child > .col-lg-4:nth-child(1),
            .card-body > .row:first-child > .col-lg-4:nth-child(2) {
              display: flex !important;
            }

            .card-body > .row:first-child > .col-lg-4:nth-child(3) {
              display: none !important;
            }

            /* Inner rows normal layout */
            .card-body > .row:first-child .row {
              display: flex !important;
              flex-wrap: wrap !important;
              width: 100% !important;
            }

            .card-body > .row:first-child .row > div {
              width: auto !important;
              padding: 0 5px 0 0 !important;
            }

            /* APPLICATION NO ROW - LINE 2 */
            .card-body > .row:nth-child(2) {
              display: flex !important;
              margin-top: 0 !important;
              margin-bottom: 15px !important;
              flex-wrap: wrap !important;
            }

            .card-body > .row:nth-child(2) > .col-lg-4 {
              width: 50% !important;
              flex: 0 0 50% !important;
            }

            .card-body > .row:nth-child(2) .row {
              display: flex !important;
              flex-wrap: wrap !important;
            }

            .card-body > .row:nth-child(2) .row > div {
              width: auto !important;
              padding: 0 5px 0 0 !important;
            }

            /* Background colors */
            .bg-white {
              background-color: #fff !important;
            }

            /* Container spacing */
            .container, .container-fluid {
              width: 100% !important;
              padding: 0 !important;
              margin: 0 !important;
            }

            /* Prevent page breaks inside important sections */
            .card-body,
            .row {
              page-break-inside: avoid !important;
            }

            /* Flex utilities */
            .d-flex {
              display: flex !important;
            }

            .gap-3 {
              display: none !important; /* Hide button container */
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
                        <div className="col-lg-7 col-md-7 col-6 recruitmentYear" >
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
