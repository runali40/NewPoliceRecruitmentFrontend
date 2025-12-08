import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import ErrorHandler from "../ErrorHandler";
import { apiClient } from "../../apiClient";
import Cookies from 'js-cookie';
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import LanguageSelector from "../../Pages/Master/LanguageSelector";


const HomePage = () => {
  const location = useLocation();
  const length = location.state?.from;
  console.log("length", length)
  const [roleId, setRoleId] = useState("");
  const [allDashboard, setAllDashboard] = useState([]);
  const [allCandidate, setAllCandidate] = useState("");
  const [selectedGround, setSelectedGround] = useState("");
  const [selectedWritten, setSelectedWritten] = useState("");
  const [finalSelected, setFinalSelected] = useState("");
  const [passInDocVerification, setPassInDocVerification] = useState("");
  const [failInDocVerification, setFailInDocVerification] = useState("")
  const [passInHeightChest, setPassInHeightChest] = useState("")
  const [failInHeightChest, setFailInHeightChest] = useState("")
  const [selectedLanguage, setSelectedLanguage] = useState('en'); // Default to English
  const [translatedText, setTranslatedText] = useState({ dashboard: 'Dashboard' });
  const isCandidateAvailable = localStorage.getItem("isCandidateAvailable");
  useEffect(() => {
    const storedRoleId = localStorage.getItem("RoleId");
    if (storedRoleId) {
      setRoleId(storedRoleId);
    }
  }, []);

  useEffect(() => {
    GetAllDashboard();
  }, []);

  const getLocalIP = () => {
    return new Promise((resolve, reject) => {
      const peerConnection = new RTCPeerConnection();
      peerConnection.createDataChannel("");
      peerConnection.createOffer().then((offer) => {
        return peerConnection.setLocalDescription(offer);
      }).then(() => {
        peerConnection.onicecandidate = (event) => {
          if (!event || !event.candidate) {
            return;
          }
          const ipAddress = /([0-9]{1,3}[.]){3}[0-9]{1,3}/.exec(event.candidate.candidate);
          if (ipAddress) {
            resolve(ipAddress[0]);
          }
          peerConnection.close();
        };
      }).catch((error) => {
        reject(error);
      });
    });
  };

  const GetAllDashboard = async () => {
    // let ipAddress = "";
    // try {
    //   ipAddress = await getLocalIP();
    // } catch (error) {
    //   console.error("Error fetching local IP address:", error);
    //   toast.error("Could not retrieve local IP address");
    //   return; // Exit if there's an error fetching the IP address
    // }
    const recruitId = localStorage.getItem("recruitId");
    const UserId = localStorage.getItem("userId");
    const sessionId = localStorage.getItem("sessionid")
    const params = {
      UserId: UserId, RecruitId: recruitId,
    };

    apiClient({
      method: "get",
      params: params,
      url: `Dashboard/Get`,
    })
      .then((response) => {
        const token1 = response.data.outcome.tokens;
        Cookies.set("UserCredential", token1, { expires: 7 });
        setAllCandidate(response.data.data[0].AllCandidate);
        setSelectedGround(response.data.data[0].ForGround);
        setSelectedWritten(response.data.data[0].ForWriiten);
        setFinalSelected(response.data.data[0].Pass);
        setPassInDocVerification(response.data.data[0].DocumentPass);
        setFailInDocVerification(response.data.data[0].DocumentFail);
        setPassInHeightChest(response.data.data[0].Heichestpass);
        setFailInHeightChest(response.data.data[0].HeichestFail);
        setAllDashboard(response.data.data);
      })
      .catch((error) => {
        if (error.response && error.response.data && error.response.data.outcome) {
          const token1 = error.response.data.outcome.tokens;
          Cookies.set("UserCredential", token1, { expires: 7 });
        }
        const errors = ErrorHandler(error);
        toast.error(errors);
      });
  };

  // const translateText = async (text, targetLanguage) => {
  //   const translateUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLanguage}`;
  //   try {
  //     const response = await axios.get(translateUrl);
  //     return response.data.responseData.translatedText; // Accessing the translated text from the response
  //   } catch (error) {
  //     console.error('Translation Error:', error);
  //     return text; // Return original text if translation fails
  //   }
  // };

  // const handleLanguageChange = async (selectedOption) => {
  //   setSelectedLanguage(selectedOption.value);
  //   const dashboardText = 'Dashboard';

  //   if (selectedOption.value === 'en') {
  //     // If English is selected, set default value
  //     setTranslatedText({ dashboard: dashboardText });
  //   } else {
  //     // Translate the text for other languages
  //     const translatedDashboard = await translateText(dashboardText, selectedOption.value);
  //     setTranslatedText({ dashboard: translatedDashboard });
  //   }
  // };

  return (
    <>
      <div className="content container-fluid">
        {/* Language Selector */}
        {/* <LanguageSelector 
        selectedLanguage={selectedLanguage} 
        onLanguageChange={handleLanguageChange} 
      /> */}

        {/* Displaying dynamic text based on selected language */}
        <div className="page-header">
          <div className="row">
            <div className="col-sm-12 mt-5">
              <h3 className="page-title text-dark">{translatedText.dashboard}</h3>
            </div>
          </div>
        </div>

        <div className="row mt-4">
          {/* Your existing dashboard content */}
          <Widget value={allCandidate} label="Total Candidates" />
          <Widget value={selectedGround} label="Selected for Ground" />
          <Widget value={selectedWritten} label="Selected for Written" />
          <Widget value={finalSelected} label="Final Selected" />
        </div>
        {/* {(allCandidate !== 0 && isCandidateAvailable === "true") && (
          <div className="row mt-5 justify-content-center">
            <div className="col-lg-4 col-md-4 mt-lg-0 mt-3">
              <NavLink to="/candidate">
                <button className="btn btn-primary btn-block p-3 w-100">Verify Candidate Documents</button>
              </NavLink>
            </div>
            <div className="col-lg-4 col-md-4 mt-lg-0 mt-3">
              <NavLink to="/candidate">
                <button className="btn btn-primary btn-block p-3 w-100">Assign Chest Number</button>
              </NavLink>
            </div>
            <div className="col-lg-4 col-md-4 mt-lg-0 mt-3">
              <NavLink to="/candidate">
                <button className="btn btn-primary btn-block p-3 w-100">Create Admission Card</button>
              </NavLink>
            </div>
          </div>
        )} */}
        <div className="row mt-5 justify-content-center">
          <div className="col-lg-3 col-md-3 mt-lg-0 mt-3">

            <button className="btn btn-success btn-block p-3 w-100 h-100"><h4 className="fw-bold">{passInDocVerification}</h4> Passed in Document Verification</button>

          </div>
          <div className="col-lg-3 col-md-3 mt-lg-0 mt-3">

            <button className="btn btn-danger btn-block p-3 w-100 h-100"><h4 className="fw-bold">{failInDocVerification}</h4>Failed in Document Verification</button>

          </div>
          <div className="col-lg-3 col-md-3 mt-lg-0 mt-3">

            <button className="btn btn-success btn-block p-3 w-100 h-100"><h4 className="fw-bold">{passInHeightChest}</h4>Passed in Height & Chest</button>

          </div>
          <div className="col-lg-3 col-md-3 mt-lg-0 mt-3">

            <button className="btn btn-danger btn-block p-3 w-100 h-100"><h4 className="fw-bold">{failInHeightChest}</h4>Failed in Height & Chest</button>

          </div>
        </div>
      </div>

    </>

  );
};

function Widget({ icon, value, label }) {
  return (
    <div className="col-md-6 col-sm-6 col-lg-6 col-xl-3 mt-3 mt-lg-3 mt-xl-0 mt-md-3">
      <div className="card dash-widget">
        <div className="card-body rounded-4 shadow">
          <span className="dash-widget-icon">
            <i className={icon}></i>
          </span>
          <div className="dash-widget-info text-center">
            <h3 className="text-center fw-bold">{value}</h3>
            <span className="text-center">{label}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
