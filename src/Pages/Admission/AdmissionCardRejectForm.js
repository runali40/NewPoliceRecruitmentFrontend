import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getAdmissionCard } from "../../Components/Api/AdmissionCardApi";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const AdmissionCardRejectForm = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const GenratePdfRef = useRef();
  const [candidateData, setCandidateData] = useState({});

  const fetchAdmissionCardData = async () => {
    try {
      const data = await getAdmissionCard(state?.candidateid.value);
      setCandidateData(data);
    } catch (error) {
    }
  };

  useEffect(() => {
    if (state?.candidateid.value) {
      fetchAdmissionCardData();
    }
  }, [state?.candidateid.value]);

  return (
    <>
      <style>
        {/* {`@media print {
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
        left: 100px;
        width: 500px;
        height: 500px;
        opacity: 0.5;
        transition: opacity 1s ease-in-out;
    }
    .row {
        display: flex;
        flex-wrap: wrap;
    }
    .col-lg-4 .col-lg-8  .col-lg-5  .col-lg-7 {
        flex: 0 0 auto;
        width: 33.333333%;
    }
    .col-lg-8  {
        width: 66.666667%;
    }
        .btn{
        display: none;
        }
}`} */}
        {
          `@media print and (orientation: portrait) {
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
    .top-header{
      display: none;
    }
    .btn{
        display: none;
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
    .btn{
        display: none;
        }
           .top-header{
      display: none;
    }
}
`
        }
      </style>
      <div className="container-fluid p-3" id="section-to-print">
        <div className="row">
          <div className="col-lg-12 col-md-12">
            <div className="card">
              <div className="card-header top-header py-3 bg-white">
                <div className="d-flex justify-content-between">
                  <h5 className="fw-bold"></h5>
                  <div className="d-flex justify-content-end">
                    <button
                      className="btn btn-md btn-primary mr-2"
                      style={{
                        marginRight: "10px",
                        backgroundColor: "rgb(27, 90, 144)",
                      }}
                      onClick={() => window.print()}
                    >
                      Print
                    </button>
                  </div>
                </div>
              </div>
              <div className="border" ref={GenratePdfRef} id="btnr">
                <div className="card-header p-3">
                  <div className="row align-items-center">
                    <div className="col">
                      <h4 className="card-title fw-bold text-center">
                        Reject Slip
                      </h4>
                    </div>
                  </div>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-lg-6 col-md-6">
                      <div className="row">
                        <div className="col-lg-4 col-md-4">
                          <label>Recruitment Year:</label>
                        </div>
                        <div className="col-lg-8 col-md-8  mt-lg-0 mt-md-0">
                          <label>{candidateData.RecruitmentYear}</label>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 mt-3 mt-lg-0 mt-md-0">
                      <div className="row">
                        <div className="col-lg-4 col-md-4 mt-3 mt-lg-0 mt-md-0">
                          <label>Application no:</label>
                        </div>
                        <div className="col-lg-8 col-md-8 mt-3 mt-lg-0 mt-md-0">
                          <label>{candidateData.ApplicationNo}</label>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* <div className="card-body"> */}
                  <div className="row mt-3">
                    <div className="col-lg-10 col-md-10">
                      <div className="row">
                        <div className="col-lg-5 col-md-5 mt-3 mt-lg-0 mt-md-0">
                          <label>Candidate's Full Name (in Devnagari):</label>
                        </div>
                        <div className="col-lg-7 col-md-7 mt-3 mt-lg-0 mt-md-0">
                          <label>{candidateData.FirstName_Marathi + " " + candidateData.Surname_Marathi}</label>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-10 col-md-10 mt-3">
                      <div className="row">
                        <div className="col-lg-5 col-md-5  mt-3 mt-lg-0 mt-md-0">
                          <label>Candidate's Full Name (in English):</label>
                        </div>
                        <div className="col-lg-7 col-md-7 mt-3 mt-lg-0 mt-md-0">
                          <label>{candidateData.FirstName_English + " " + candidateData.Surname_English}</label>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-10 col-md-10 mt-3">
                      <div className="row">
                        <div className="col-lg-5 col-md-5  mt-3 mt-lg-0 mt-md-0">
                          <label>Gender:</label>
                        </div>
                        <div className="col-lg-7 col-md-7 mt-3 mt-lg-0 mt-md-0">
                          <label>{candidateData.Gender}</label>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-10 col-md-10 mt-3">
                      <div className="row">
                        <div className="col-lg-5 col-md-5  mt-3 mt-lg-0 mt-md-0">
                          <label>Date of Birth:</label>
                        </div>
                        <div className="col-lg-7 col-md-7 mt-3 mt-lg-0 mt-md-0">
                          <label>{candidateData.DOB != null ? (candidateData.DOB).split("T")[0] : null}</label>
                        </div>
                      </div>
                    </div>
                    {/* <div className="col-lg-10 col-md-10 mt-3">
                      <div className="row">
                        <div className="col-lg-5 col-md-5">
                          <label>Address:</label>
                        </div>
                        <div className="col-lg-7 col-md-7 mt-3 mt-lg-0 mt-md-0">
                          <label>{candidateData.Address1}</label>
                        </div>
                      </div>
                    </div> */}
                    <div className="col-lg-10 col-md-10 mt-3">
                      <div className="row">
                        <div className="col-lg-5 col-md-5  mt-3 mt-lg-0 mt-md-0">
                          <label>Mobile no:</label>
                        </div>
                        <div className="col-lg-7 col-md-7 mt-3 mt-lg-0 mt-md-0">
                          <label>{candidateData.MobileNumber}</label>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-10 col-md-10 mt-3">
                      <div className="row">
                        <div className="col-lg-5 col-md-5  mt-3 mt-lg-0 mt-md-0">
                          <label>Document Verification Status:</label>
                        </div>
                        <div className="col-lg-7 col-md-7 mt-3 mt-lg-0 mt-md-0">
                          <label>{candidateData.documentVerStatus}</label>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-10 col-md-10 mt-3">
                      <div className="row">
                        <div className="col-lg-5 col-md-5  mt-3 mt-lg-0 mt-md-0">
                          <label>Document Date:</label>
                        </div>
                        <div className="col-lg-7 col-md-7 mt-3 mt-lg-0 mt-md-0">
                          <label>{candidateData.documentVerDate != null ? (candidateData.documentVerDate).split("T")[0] : ""}</label>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-10 col-md-10 mt-3">
                      <div className="row">
                        <div className="col-lg-5 col-md-5  mt-3 mt-lg-0 mt-md-0">
                          <label> Physical Test Result (Height/Chest):</label>
                        </div>
                        <div className="col-lg-7 col-md-7 mt-3 mt-lg-0 mt-md-0">
                          <label>{candidateData.MesVerStatus}</label>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-10 col-md-10 mt-3">
                      <div className="row">
                        <div className="col-lg-5 col-md-5  mt-3 mt-lg-0 mt-md-0">
                          <label> Height:</label>
                        </div>
                        <div className="col-lg-7 col-md-7 mt-3 mt-lg-0 mt-md-0">
                          <label>{candidateData.Height} cm</label>
                        </div>
                      </div>
                    </div>
                    {
                      candidateData.Gender === "Male"
                      &&
                      <>
                        <div className="col-lg-10 col-md-10 mt-3">
                          <div className="row">
                            <div className="col-lg-5 col-md-5  mt-3 mt-lg-0 mt-md-0">
                              <label>Chest Normal:</label>
                            </div>
                            <div className="col-lg-7 col-md-7 mt-3 mt-lg-0 mt-md-0">
                              <label>{candidateData.Chest_normal} cm</label>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-10 col-md-10 mt-3">
                          <div className="row">
                            <div className="col-lg-5 col-md-5  mt-3 mt-lg-0 mt-md-0">
                              <label>Chest Inhale:</label>
                            </div>
                            <div className="col-lg-7 col-md-7 mt-3 mt-lg-0 mt-md-0">
                              <label>{candidateData.Chest_Inhale} cm</label>
                            </div>
                          </div>
                        </div>
                      </>
                    }

                    <div className="col-lg-10 col-md-10 mt-3">
                      <div className="row">
                        <div className="col-lg-5 col-md-5  mt-3 mt-lg-0 mt-md-0">
                          <label>Physical Test Date:</label>
                        </div>
                        <div className="col-lg-7 col-md-7 mt-3 mt-lg-0 mt-md-0">
                          <label>{candidateData.MesVerDate != null ? (candidateData.MesVerDate).split("T")[0] : ""}</label>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-10 col-md-10 mt-3">
                      <div className="row">
                        <div className="col-lg-5 col-md-5  mt-3 mt-lg-0 mt-md-0">
                          <label>Rejection Reason:</label>
                        </div>
                        <div className="col-lg-7 col-md-7 mt-3 mt-lg-0 mt-md-0">
                          <label>
                            {candidateData.MesVerStatus === "Fail" || candidateData.documentVerStatus === "Fail" ? (
                              <>
                                {candidateData.MeasurementRemark}
                                <br />
                                {candidateData.DocRemark}
                              </>
                            ) : (
                              candidateData.RejectReason // Display only RejectReason if neither condition is "Fail"
                            )}
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
        <img
          src="Images/rejectedStamp.png"
          alt="Rejected"
          style={{
            position: "absolute",
            top: "200px",
            right: "20px",
            left: "100px",
            width: "500px",
            height: "500px",
            opacity: "0.5",
            transition: "opacity 1s ease-in-out",
          }}
        />
      </div>

    </>
  );
};
export default AdmissionCardRejectForm;
