import React, { useState, useEffect, useRef, useCallback } from "react";
import { NavLink, useNavigate, useLocation, useParams } from "react-router-dom";
import { Table, Modal, Button, Form, Row, Col, FormControl } from "react-bootstrap";
import { Refresh, Edit } from "@material-ui/icons";
import Select from "react-select";
import {
  fetchAllRecruitments,
  fetchCandidateDetails,
  fetchAllCandidates,
  uploadFile,
  getAllCast,
  fetchAllSchedule,
  fetchAllCandidatesFilter,
} from "../../Components/Api/CandidateApi";
import { apiClient } from "../../apiClient";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ErrorHandler from "../../Components/ErrorHandler";
import CryptoJS from "crypto-js";
import { getAllScheduleMasterData, getScheduleCandidateApi, updateScheduleCandidateApi } from "../../Components/Api/ScheduleMasterApi";

const Candidate = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { CandidateId } = useParams();
  // const {  CandidateId} = location.state || {};
  const [id, setId] = useState("");
  const [candidateId, setCandidateId] = useState("");
  const [groupId, setGroupId] = useState(null);
  const [allCandidates, setAllCandidates] = useState([]);
  const [filterStatus, setFilterStatus] = useState("");
  const [recruitmentValue, setRecruitmentValue] = useState("");
  const [allRecruitment, setAllRecruitment] = useState([]);
  const [documentUploaded, setDocumentUploaded] = useState("");
  const [recruitmentYear, setRecruitmentYear] = useState("");
  const [officeName, setOfficeName] = useState("");
  const [portName, setPortName] = useState("");
  const [applicationNo, setApplicationNo] = useState("");
  const [applicationDate, setApplicationDate] = useState("");
  const [examinationPort, setExaminationPort] = useState("");
  const [fullNameDevnagari, setFullNameDevnagari] = useState("");
  const [fullNameEnglish, setFullNameEnglish] = useState("");
  const [firstNameEnglish, setFirstNameEnglish] = useState("");
  const [surnameEnglish, setSurnameEnglish] = useState("");
  const [mothersName, setMothersName] = useState("");
  const [mothersNameMarathi, setMothersNameMarathi] = useState("");
  const [gender, setGender] = useState("");
  const [maritalStatus, setMaritalStatus] = useState("");
  const [candidateNo, setCandidateNo] = useState("");
  const [dob, setDob] = useState("");
  const [age, setAge] = useState("");
  const [address, setAddress] = useState("");
  const [address2, setAddress2] = useState("");
  const [address3, setAddress3] = useState("");

  const [village, setVillage] = useState("");
  const [mukkamPost, setMukkamPost] = useState("");
  const [taluka, setTaluka] = useState("");
  const [district, setDistrict] = useState("");
  const [state, setState] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [emailId, setEmailId] = useState("");
  const [permanentAddress, setPermanentAddress] = useState("");
  const [permanentAddress2, setPermanentAddress2] = useState("");
  const [permanentAddress3, setPermanentAddress3] = useState("");
  const [permanentVillage, setPermanentVillage] = useState("");
  const [permanentMukkamPost, setPermanentMukkamPost] = useState("");
  const [permanentTaluka, setPermanentTaluka] = useState("");
  const [permanentDistrict, setPermanentDistrict] = useState("");
  const [permanentState, setPermanentState] = useState("");
  const [permanentPinCode, setPermanentPinCode] = useState("");
  const [nationality, setNationality] = useState("");
  const [religion, setReligion] = useState("");
  const [cast, setCast] = useState("");
  const [allCast, setAllCast] = useState([]);
  const [subCast, setSubCast] = useState("");
  const [partTime, setPartTime] = useState("");
  const [projectSick, setProjectSick] = useState("");
  const [exExamination, setExExamination] = useState("");
  const [earthquakeAttacked, setEarthquakeAttacked] = useState("");
  // const [data, setData] = useState(false);
  const [selectedValue, setSelectedValue] = useState(CandidateId || null);
  // const [selectedCompletedValue, setSelectedCompletedValue] = useState(CandidateId || null);
  // const [selectedPendingValue, setSelectedPendingValue] = useState(CandidateId || null);
  // const [isMeasurementPass, setIsMeasurementPass] = useState(null);
  const [measurementStatus, setMeasurementStatus] = useState();
  const [biometricStatus, setBiometricStatus] = useState();
  const [orphan, setOrphan] = useState("");
  const [ancestral, setAncestral] = useState("");
  const [chestNo, setChestNo] = useState("");
  const [height, setHeight] = useState("");
  const [category, setCategory] = useState("");
  const [chestNormal, setChestNormal] = useState("");
  const [chestInhale, setChestInhale] = useState("");
  const [appealCount, setAppealCount] = useState(0);
  const [unitName, setUnitName] = useState("");
  const [parallelReservation, setParallelReservation] = useState("");
  const [exsolier, setExsolier] = useState("");
  const [homeGuard, setHomeGuard] = useState("");
  const [sportsPerson, setSportsPerson] = useState("");
  const [femaleReservation, setFemaleReservation] = useState("");
  const [parentInPolice, setParentInPolice] = useState("");
  const [policeRank, setPoliceRank] = useState("");
  const [exServiceDependent, setExServiceDependent] = useState("");
  const storedToken = localStorage.getItem("UserCredential");
  const DutyName = localStorage.getItem("DutyName");
  const RoleName = localStorage.getItem("RoleName");
  const UserId = localStorage.getItem("userId");
  const [file, setFile] = useState(null);
  const [secretKey, setSecretKey] = useState("");
  // const [photo, setPhoto] = useState("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEQAAAAYCAYAAABDX1s+AAAAAXNSR0IArs4c6QAAAsxJREFUWEfdmEuIj1EYxn8j2cjGNRsNYWEhl4XsTMZilCYLRORSZIGQhY2M9TRoSCI2LpuxEOVSyixckkuhLNyTSC4bOxTn4Xx1fJ3/dzvfpf6nZjP/77093/s+73O+Dpo/i5wUOgH9fQCeA8N1p9dRd0BgA7AUWAH8AEYl5HAPeAc8BF4DQ1XnWwcgE4D1wGZgZmBB34GDxkdfoJ+W5lUCotbfCqyyY1BmDReB5WU6jHxVAYg4QR2h0ch67gMjgHEWvF/AyBTjj4Zn1pTNM2UBMgboAvozjMUJywkizU/ApBZFCdixwGJgATDfA9BbYGOZoJQBiMhxC9Cd8EZFiqdt4s+ytk3suV2WP3zmZdTx12+Io9UWCHdtxpPV2jxpuuZ8QRB8Zm88nKTts7KMGHkBmWX5YRMwPiGBS8BZ4C7wvoxEHR8ao+N2bbuu5xiifRwaKysgIsj9GbbFbeACcDg0sRT7yVa8uY8dAnaHxk0DZIbhhlvAxJRANwCBUZk+8MRXLL0k96wFzoWAkgSIuOFminOpyD2WLD+HJFLQ9nfM7giwo6CvRFJV++1McKy38KCG0Uir7REwN/bQVKOBtI4LHV+H3AEWerx9NVvpAHANeFEoWjVGr4BpjuugjeMCog2iNam7h3uuAE+BvdXUE+x1uxFwgzEv4r6XRTxHgIic4oSobhBAtV/BcxYy3dOxA5bbcrr6J8xEnK64kqqMiDK3w4YMxGeutP8J9BrJfzUlH9ksAeYZmrgOnHIB0UcZjcWZhooKCTvbI8rU2bpf+Y6uG8uAdbEfe6OR0bgcBb6EZNWwrW8ZiGA1AeoUXSK3GW6RVml1htOEWcM15g4fH528DrraDZAeo6qPZbhixIHSfUuyf6jdAFGhWRR2BMhl+0nhiVG43/TPdgREdU2xItL31U5kKzG3D9BXt/9OuwLiFqmOkdgcbSV9oq76A6mYc2bc5b64AAAAAElFTkSuQmCC")
  const [photo, setPhoto] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState([]);
  const [appealStatus, setAppealStatus] = useState(false);
  const handleCloseModal = () => setShowErrorModal(false);
  const [isEditing, setIsEditing] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleName, setScheduleName] = useState("")

  const [showModal2, setShowModal2] = useState(false);
  const [allScheduleDate, setAllScheduleDate] = useState([])
  const [assignNewDate, setAssignNewDate] = useState("");
  const [scheduleDatePerCandidate, setScheduleDatePerCandidate] = useState("")
  const [canId1, setCanId1] = useState("")

  const [scheduleId1, setScheduleId1] = useState("")
  const handleClose2 = () => {
    setShowModal2(false);
    setAssignNewDate("");
    // setScheduleDate("");
  };
  const handleShow2 = () => {
    setShowModal2(true);
  };
  const handleScheduleDate = (selected) => {
    setScheduleDatePerCandidate(selected)
  }
  const getAllData = () => {
    getAllScheduleMasterData().then((data) => {

      // console.log(data, "all schedule")
      const temp = data.map((data1) => ({
        value: data1.ScheduleID,
        label: data1.ScheduleDate ? data1.ScheduleDate.split("T")[0] : null,
      }));
      console.log("temp", temp);
      setAllScheduleDate(temp);
    }).catch((error) => {
      console.log(error);
    })
  };
  const getScheduleCandidate = (Id, cId) => {
    handleShow2();

    getScheduleCandidateApi(Id, cId)
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const schedule = data[0]; // Access the first item in the array
          if (schedule.ScheduleDate) {
            // Format the first schedule date
            const formattedDate = schedule.ScheduleDate ? schedule.ScheduleDate.split("T")[0] : null; // Safely split the date
            setScheduleDatePerCandidate([{
              value: schedule.ScheduleID,
              label: formattedDate
            }]); // Create an array with the schedule info
            console.log("Formatted Schedule Date:", formattedDate);
            setCanId1(schedule.CandidateID)
            setScheduleId1(schedule.ScheduleID)
            console.log(schedule.CandidateID, "206")
            getAllData()
          } else {
            console.error("ScheduleDate is missing in the first item:", schedule);
          }

          // If you want to handle all schedules in the data array
          const temp = data.map((dataItem) => ({
            value: dataItem.ScheduleID,
            label: dataItem.ScheduleDate ? dataItem.ScheduleDate?.split("T")[0] : null, // Safely split the date if ScheduleDate exists
          }));
          setScheduleDatePerCandidate(temp); // Update state with all schedule options
          console.log("Schedule Date Options:", temp);
        } else {
          console.error("Invalid data or data array is empty:", data);
        }
      })
      .catch((error) => {
        console.error("Error fetching schedule data:", error);
      });
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        // if (!CandidateId) {
        //   fetchAllCandidatesFilter(
        //     {
        //       UserId: UserId,
        //       RecruitId: localStorage.getItem("recruitId"),
        //       Groundtestdata1: "",
        //       Status: "completed"
        //     },
        //     setAllCompletedCandidates
        //   );

        // }
        if (!CandidateId && RoleName === "Superadmin") {
          await fetchAllRecruitments(
            {
              UserId: UserId,
              RecruitId: localStorage.getItem("recruitId"),
              Groundtestdata1: "",

            },
            setAllRecruitment
          );
        } else if (!CandidateId) {
          fetchAllCandidates(
            {
              UserId: UserId,
              RecruitId: localStorage.getItem("recruitId"),
              Groundtestdata1: "",
              Status: null
            },
            setAllCandidates
          );

        }
        // else if (!CandidateId) {
        //   fetchAllCandidatesFilter(
        //     {
        //       UserId: UserId,
        //       RecruitId: localStorage.getItem("recruitId"),
        //       Groundtestdata1: "",
        //       Status : "completed"
        //     },
        //     setAllCandidates
        //   );

        // }
        else {
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [CandidateId]);

  // Fetch candidate details if CandidateId is available
  useEffect(() => {
    const fetchDetails = async () => {
      const UserId = localStorage.getItem("userId");
      if (CandidateId) {
        try {
          await fetchCandidateDetails(
            {
              UserId: UserId,
              RecruitId: localStorage.getItem("recruitId"),
              Groundtestdata1: "",
              CandidateID: CandidateId,
            },
            (data) => {
              console.log(data.groupid, "groupid")
              setRecruitmentYear(data.RecruitmentYear);
              setOfficeName(data.OfficeName);
              setPortName(data.PostName);
              setApplicationNo(data.ApplicationNo);
              setApplicationDate(data["Application Date"] ? data["Application Date"].split("T")[0] : null);
              setExaminationPort(data.ExaminationFee);
              setFullNameDevnagari(
                data.FirstName_Marathi + "  " + data.Surname_Marathi
              );
              setFullNameEnglish(
                data.FirstName_English + "  " + data.Surname_English
              );
              setMothersName(data.MotherName_English);
              setMothersNameMarathi(data.MotherName_Marathi);
              setGender(data.Gender);
              setMaritalStatus(data.MaritalStatus);
              setCandidateNo(data.PassCertificationNo);
              setDob(
                data?.DOB ? new Date(data.DOB).toISOString().split("T")[0] : ""
              );
              setAge(data.Age);
              setAddress(data.Address1);
              setAddress2(data.Address2);
              setAddress3(data.Address3);
              setVillage(data.Village1);
              setMukkamPost(data.Mukkam_Post);
              setDistrict(data.District);
              setTaluka(data.Taluka);
              setState(data.State);
              setPinCode(data.PinCode);
              setNationality(data.Nationality);
              setReligion(data.Religion);
              setCast({ value: data.Cast, label: data.Cast });
              setSubCast(data.SubCast);
              setMobileNumber(data.MobileNumber);
              setEmailId(data.EmailId);
              setPermanentAddress(data.PermanentAddress);
              setPermanentAddress(data.PermanentAddress1);
              setPermanentAddress2(data.PermanentAddress2);
              setPermanentAddress3(data.PermanentAddress3);
              setPermanentVillage(data["Permanant Village"]);
              setPermanentMukkamPost(data["Permanant Mukkam_Post"]);
              setPermanentTaluka(data["Permanant Taluka"]);
              setPermanentDistrict(data["Permanant District"]);
              setPermanentState(data["Permanant State"]);
              setPermanentPinCode(data.PermanentPinCode);
              setParallelReservation(data["Parallel Reservation"]);
              setPartTime(data.PartTime);
              setExsolier(data.ExSoldier);
              setHomeGuard(data.HomeGuard);
              setSportsPerson(data.Sportsperson);
              setFemaleReservation(data["Female Reservation"]);
              setParentInPolice(data["Parent In Police"]);
              setPoliceRank(data.PoliceRank);
              setExServiceDependent(data["Ex-ServiceDependent"]);
              setProjectSick(data.Prakalpgrast);
              setExExamination(data.ExServiceman);
              setEarthquakeAttacked(data.Bhukampgrast);
              setCandidateId(data.CandidateID);
              setDocumentUploaded(data.Candidatestatus);
              setMeasurementStatus(data.MeasurementStatus);
              setBiometricStatus(data.BiometricStatus);
              setChestNo(data.chestno);
              setHeight(data.Height);
              setChestNormal(data.Chest_normal);
              setChestInhale(data.Chest_Inhale);
              setAppealCount(data.appealcount);
              setOrphan(data.ANATH);
              // setCategory(data.Category);
              setCategory(data.PoliceRank);
              setAncestral(data.Ancestral);
              setGroupId(data.groupid);
              setPhoto(data.imagestring);
              setSecretKey(data.Secretkeys);
              setUnitName(data.UnitName);
              setAppealStatus(data.AppealStatus);
              setScheduleName(data.ScheduleID);
              setScheduleDate(data.ScheduleDate ? data.ScheduleDate.split("T")[0] : null)
              console.log(data.ScheduleID, "314")
              localStorage.setItem("cast", data.Cast);
              setSelectedValue({
                value: data.CandidateID,
                label: `${data.ApplicationNo} - ${data.FirstName_English +
                  " " +
                  data.Surname_English +
                  " " +
                  data.Category +
                  " " +
                  data["Parallel Reservation"]
                  }`,
              });
            }
          );

          // Call getAllCast after fetchCandidateDetails is complete
          // const castData = await getAllCast();
          // const castOptions = castData.map((cast) => ({
          //   value: cast.pv_parametervalue,
          //   label: cast.pv_parametervalue,
          // }));
          // setAllCast(castOptions);
          // console.log(castOptions);
        } catch (error) {
          console.error("Error fetching candidate details:", error);
        }
      }
    };

    fetchDetails();
  }, [CandidateId]);

  const updateScheduleCandidate = async () => {
    const UserId = localStorage.getItem('userId');
    const recruitId = localStorage.getItem("recruitId")

    if (!scheduleDatePerCandidate && !assignNewDate) {
      toast.warning("Please enter schedule date!");
      return;
    }

    if (allScheduleDate.some(item => item.label === assignNewDate)) {
      toast.warning("Please select a new schedule date!");
      return;
    }
    let data;
    data = {
      UserId: UserId,
      RecruitId: recruitId,
      ScheduleDate: scheduleDatePerCandidate.label,
      CandidateId: candidateId.toString(),
      Id: null,
      scheduleID: scheduleId1.toString(),
      NewScheduleDate: assignNewDate === "" ? null : assignNewDate
    };

    try {
      await updateScheduleCandidateApi(data);
      handleClose2(false)
      await
        fetchCandidateDetails(
          {
            UserId: UserId,
            RecruitId: localStorage.getItem("recruitId"),
            Groundtestdata1: "",
            CandidateID: selectedValue.value,
          },
          (data) => {
            console.log(data.groupid, "groupid")
            setRecruitmentYear(data.RecruitmentYear);
            setOfficeName(data.OfficeName);
            setPortName(data.PostName);
            setApplicationNo(data.ApplicationNo);
            setApplicationDate(data["Application Date"] ? data["Application Date"].split("T")[0] : null);
            setExaminationPort(data.ExaminationFee);
            setFullNameDevnagari(
              data.FirstName_Marathi + "  " + data.Surname_Marathi
            );
            setFullNameEnglish(
              data.FirstName_English + "  " + data.Surname_English
            );
            setMothersName(data.MotherName_English);
            setMothersNameMarathi(data.MotherName_Marathi);
            setGender(data.Gender);
            setMaritalStatus(data.MaritalStatus);
            setCandidateNo(data.PassCertificationNo);
            setDob(
              data?.DOB ? new Date(data.DOB).toISOString().split("T")[0] : ""
            );
            setAge(data.Age);
            setAddress(data.Address1);
            setAddress2(data.Address2);
            setAddress3(data.Address3);
            setVillage(data.Village1);
            setMukkamPost(data.Mukkam_Post);
            setDistrict(data.District);
            setTaluka(data.Taluka);
            setState(data.State);
            setPinCode(data.PinCode);
            setNationality(data.Nationality);
            setReligion(data.Religion);
            setCast({ value: data.Cast, label: data.Cast });
            setSubCast(data.SubCast);
            setMobileNumber(data.MobileNumber);
            setEmailId(data.EmailId);
            setPermanentAddress(data.PermanentAddress);
            setPermanentAddress(data.PermanentAddress1);
            setPermanentAddress2(data.PermanentAddress2);
            setPermanentAddress3(data.PermanentAddress3);
            setPermanentVillage(data["Permanant Village"]);
            setPermanentMukkamPost(data["Permanant Mukkam_Post"]);
            setPermanentTaluka(data["Permanant Taluka"]);
            setPermanentDistrict(data["Permanant District"]);
            setPermanentState(data["Permanant State"]);
            setPermanentPinCode(data.PermanentPinCode);
            setParallelReservation(data["Parallel Reservation"]);
            setPartTime(data.PartTime);
            setExsolier(data.ExSoldier);
            setHomeGuard(data.HomeGuard);
            setSportsPerson(data.Sportsperson);
            setFemaleReservation(data["Female Reservation"]);
            setParentInPolice(data["Parent In Police"]);
            setPoliceRank(data.PoliceRank);
            setExServiceDependent(data["Ex-ServiceDependent"]);
            setProjectSick(data.Prakalpgrast);
            setExExamination(data.ExServiceman);
            setEarthquakeAttacked(data.Bhukampgrast);
            setCandidateId(data.CandidateID);
            setDocumentUploaded(data.Candidatestatus);
            setMeasurementStatus(data.MeasurementStatus);
            setBiometricStatus(data.BiometricStatus);
            setChestNo(data.chestno);
            setHeight(data.Height);
            setChestNormal(data.Chest_normal);
            setChestInhale(data.Chest_Inhale);
            setAppealCount(data.appealcount);
            setOrphan(data.ANATH);
            // setCategory(data.Category);
            setCategory(data.PoliceRank);
            setAncestral(data.Ancestral);
            setGroupId(data.groupid);
            setPhoto(data.imagestring);
            setSecretKey(data.Secretkeys);
            setUnitName(data.UnitName);
            setAppealStatus(data.AppealStatus);
            setScheduleName(data.ScheduleID);
            setScheduleDate(data.ScheduleDate ? data.ScheduleDate.split("T")[0] : null)
            console.log(data.ScheduleID, "314")
            localStorage.setItem("cast", data.Cast);
            setSelectedValue({
              value: data.CandidateID,
              label: `${data.ApplicationNo} - ${data.FirstName_English +
                " " +
                data.Surname_English +
                " " +
                data.Category +
                " " +
                data["Parallel Reservation"]
                }`,
            });
          })
      // setScheduleDatePerCandidate("");
      // handleClose1();
      // handleClose2();

    } catch (error) {
      console.error("Error adding parameter:", error);
      // Handle error appropriately
    }
    // }
  };
  // const updateCast = async (selectedCast) => {
  //   const recruitId = localStorage.getItem("recruitId");
  //   const body = {
  //     CandidateID: candidateId,
  //     UserId: UserId,
  //     RecruitId: recruitId,
  //     Groundtestdata1: "",
  //     cast: selectedCast.value, // Use the selected value directly
  //   };

  //   try {
  //     const response = await apiClient({
  //       method: "post",
  //       url: `Candidate`,
  //       data: body,
  //     });
  //     const token1 = response.data.outcome.tokens;
  //     Cookies.set("UserCredential", token1, { expires: 7 });
  //     console.log(response.data.data);
  //   } catch (error) {
  //     if (
  //       error.response &&
  //       error.response.data &&
  //       error.response.data.outcome
  //     ) {
  //       const token1 = error.response.data.outcome.tokens;
  //       Cookies.set("UserCredential", token1, { expires: 7 });
  //     }
  //     console.error("Error submitting appeal:", error);
  //     const errors = ErrorHandler(error);
  //     toast.error(errors);
  //     throw error;
  //   }
  // };
  const handleSelectChange = async (selected) => {
    setSelectedValue(selected);

    const setCandidateData = (data) => {
      setRecruitmentYear(data.RecruitmentYear);
      setOfficeName(data.OfficeName);
      setPortName(data.PostName);
      setApplicationNo(data.ApplicationNo);
      setApplicationDate(data["Application Date"] ? data["Application Date"].split("T")[0] : null);
      setExaminationPort(data.ExaminationFee);
      setFullNameDevnagari(
        data.FirstName_Marathi + "  " + data.Surname_Marathi
      );
      setFullNameEnglish(data.FirstName_English + "  " + data.Surname_English);
      setMothersName(data.MotherName_English);
      setMothersNameMarathi(data.MotherName_Marathi);
      setGender(data.Gender);
      setMaritalStatus(data.MaritalStatus);
      setCandidateNo(data.PassCertificationNo);
      setDob(data?.DOB ? new Date(data.DOB).toISOString().split("T")[0] : "");
      setAge(data.Age);
      setAddress(data.Address1);
      setAddress2(data.Address2);
      setAddress3(data.Address3);
      setVillage(data.Village1);
      setMukkamPost(data.Mukkam_Post);
      setDistrict(data.District);
      setTaluka(data.Taluka);
      setState(data.State);
      setPinCode(data.PinCode);
      setNationality(data.Nationality);
      setReligion(data.Religion);
      setCast({ value: data.Cast, label: data.Cast });
      setSubCast(data.SubCast);
      setMobileNumber(data.MobileNumber);
      setEmailId(data.EmailId);
      setPermanentAddress(data.PermanentAddress);
      setPermanentAddress(data.PermanentAddress1);
      setPermanentAddress2(data.PermanentAddress2);
      setPermanentAddress3(data.PermanentAddress3);
      setPermanentVillage(data["Permanant Village"]);
      setPermanentMukkamPost(data["Permanant Mukkam_Post"]);
      setPermanentTaluka(data["Permanant Taluka"]);
      setPermanentDistrict(data["Permanant District"]);
      setPermanentState(data["Permanant State"]);
      setPermanentPinCode(data.PermanentPinCode);
      setParallelReservation(data["Parallel Reservation"]);
      setPartTime(data.PartTime);
      setExsolier(data.ExSoldier);
      setHomeGuard(data.HomeGuard);
      setSportsPerson(data.Sportsperson);
      setFemaleReservation(data["Female Reservation"]);
      setParentInPolice(data["Parent In Police"]);
      setPoliceRank(data.PoliceRank);
      setExServiceDependent(data["Ex-ServiceDependent"]);
      setProjectSick(data.Prakalpgrast);
      setExExamination(data.ExServiceman);
      setEarthquakeAttacked(data.Bhukampgrast);
      setCandidateId(data.CandidateID);
      setDocumentUploaded(data.Candidatestatus);
      setMeasurementStatus(data.MeasurementStatus);
      setBiometricStatus(data.BiometricStatus);
      setChestNo(data.chestno);
      setHeight(data.Height);
      setChestNormal(data.Chest_normal);
      setChestInhale(data.Chest_Inhale);
      setAppealCount(data.appealcount);
      setOrphan(data.ANATH);
      setAppealStatus(data.AppealStatus);
      setScheduleName(data.ScheduleID);
      console.log(data.ScheduleID, "490")
      setScheduleDate(data.ScheduleDate ? data.ScheduleDate.split("T")[0] : null)
      // setCategory(data.Category);
      setCategory(data.PoliceRank);
      setAncestral(data.Ancestral);
      setGroupId(data.groupid);
      setPhoto(data.imagestring);
      setSecretKey(data.Secretkeys);
      setUnitName(data.UnitName);
      localStorage.setItem("cast", data.Cast);
      console.log(data.groupid, "groupid")
    };

    try {
      // First API call
      await fetchCandidateDetails(
        {
          UserId: UserId,
          RecruitId: localStorage.getItem("recruitId"),
          CandidateID: selected.value,
          Groundtestdata1: "",
        },
        setCandidateData
      );

      // Second API call after the first is complete
      const castData = await getAllCast();
      const castOptions = castData.map((cast) => ({
        value: cast.pv_parametervalue,
        label: cast.pv_parametervalue,
      }));
      setAllCast(castOptions);
      console.log(castOptions);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSelectCast = (selected) => {
    setCast(selected);
    console.log(selected, "selected");
    // updateCast(selected); // Pass the selected value directly
  };
  // useEffect(() => {
  //     updateCast();

  // }, [cast])

  const handleRecruitmentChange = (selected) => {
    setRecruitmentValue(selected);
    localStorage.setItem("recruitId", selected.value);
    fetchAllCandidates(
      {
        UserId: UserId,
        RecruitId: selected.value,
        Groundtestdata1: "",
      },
      setAllCandidates
    );
  };

  const fileInputRef = useRef(null);

  const handleUploadClick = () => {
    // Reset the file input value before clicking
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    fileInputRef.current.click();
  };

  // const handleFileChange = async (e) => {
  //   e.preventDefault();
  //   const selectedFile = e.target.files[0];

  //   if (!selectedFile) return;

  //   setFile(selectedFile);

  //   try {
  //     // Upload file and wait for the response
  //     await uploadFile(
  //       selectedFile,
  //       localStorage.getItem("userId"),
  //       localStorage.getItem("recruitId"),
  //       setErrorMessage,
  //       setShowErrorModal
  //     );

  //     console.log("File upload successful. Now fetching schedule...");

  //     // Ensure UserId and RecruitId are valid
  //     if (!UserId || !localStorage.getItem("recruitId")) {
  //       console.error("UserId or RecruitId is missing.");
  //       return;
  //     }

  //     // Call fetchAllSchedule
  //     await fetchAllSchedule({
  //       UserId: UserId,
  //       RecruitId: localStorage.getItem("recruitId"),
  //       Groundtestdata1: "",
  //     });

  //     console.log("fetchAllSchedule API call successful. Now fetching candidates...");

  //     // Call fetchAllCandidates
  //     await fetchAllCandidates(
  //       {
  //         UserId: UserId,
  //         RecruitId: localStorage.getItem("recruitId"),
  //         Groundtestdata1: "",
  //       },
  //       setAllCandidates
  //     );

  //     console.log("fetchAllCandidates API call successful.");

  //     // Reset the file input after successful operations
  //     if (fileInputRef.current) {
  //       fileInputRef.current.value = "";
  //     }
  //   } catch (error) {
  //     console.error("Error in file upload or API calls:", error);
  //   }
  // };

  // const handleFileChange = async (e) => {
  //   e.preventDefault();
  //   const selectedFile = e.target.files[0];

  //   if (!selectedFile) return;

  //   setFile(selectedFile);

  //   try {
  //     // Upload file and get the response
  //     const uploadResponse = await uploadFile(
  //       selectedFile,
  //       localStorage.getItem("userId"),
  //       localStorage.getItem("recruitId"),
  //       setErrorMessage,
  //       setShowErrorModal
  //     );

  //     // Check if upload was successful
  //     if (uploadResponse && uploadResponse.success) {  // Adjust this condition based on your API response structure
  //       console.log("File upload successful. Now fetching schedule...");
  //       getAllData();
  //       // Validate UserId and RecruitId before proceeding
  //       if (!UserId || !localStorage.getItem("recruitId")) {
  //         console.error("UserId or RecruitId is missing.");
  //         return;
  //       }

  //       // Call fetchAllSchedule only after successful upload
  //       await fetchAllSchedule({
  //         UserId: UserId,
  //         RecruitId: localStorage.getItem("recruitId"),
  //         Groundtestdata1: "",
  //       });

  //       console.log("fetchAllSchedule API call successful. Now fetching candidates...");

  //       // Call fetchAllCandidates only after successful schedule fetch
  //       await fetchAllCandidates(
  //         {
  //           UserId: UserId,
  //           RecruitId: localStorage.getItem("recruitId"),
  //           Groundtestdata1: "",
  //         },
  //         setAllCandidates
  //       );

  //       console.log("fetchAllCandidates API call successful.");

  //       // Reset the file input after all operations are successful
  //       if (fileInputRef.current) {
  //         fileInputRef.current.value = "";
  //       }
  //     } else {
  //       console.error("File upload failed");
  //       // Handle upload failure - you might want to show an error message
  //       // setErrorMessage(error);
  //       // setShowErrorModal(true);
  //     }
  //   } catch (error) {
  //     console.error("Error in file upload:", error);
  //     // Handle error - you might want to show an error message
  //     setErrorMessage(error)
  //     // setShowErrorModal(true);
  //   }
  // };
  const handleFileChange = async (e) => {
    e.preventDefault();
    const selectedFile = e.target.files[0];

    if (!selectedFile) return;

    setFile(selectedFile);

    try {
      console.log("Uploading file...");

      // Upload file and get the response
      const uploadResponse = await uploadFile(
        selectedFile,
        localStorage.getItem("userId"),
        localStorage.getItem("recruitId"),
        setErrorMessage,
        setShowErrorModal
      );
      console.log(uploadResponse)
      if (uploadResponse) {
        console.error("File upload failed.");
        await getAllData();

        return;
      }

      console.log("File uploaded successfully. Now fetching schedule...");


      console.log("getAllData API call successful.");

      // Retrieve UserId and RecruitId from localStorage
      const storedUserId = localStorage.getItem("userId");
      const storedRecruitId = localStorage.getItem("recruitId");

      if (!storedUserId || !storedRecruitId) {
        console.error("UserId or RecruitId is missing.");
        return;
      }

      // Call fetchAllSchedule after successful upload
      await fetchAllSchedule({
        UserId: storedUserId,
        RecruitId: storedRecruitId,
        Groundtestdata1: "",
      });

      console.log("fetchAllSchedule API call successful. Now fetching candidates...");

      // Call fetchAllCandidates after successful schedule fetch
      await fetchAllCandidates(
        {
          UserId: storedUserId,
          RecruitId: storedRecruitId,
          Groundtestdata1: "",
        },
        setAllCandidates
      );

      console.log("fetchAllCandidates API call successful.");

      // Reset the file input after all operations are complete
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      console.log("All operations completed successfully.");
    } catch (error) {
      console.error("Error in file upload:", error);
      setErrorMessage(error.message || "An unexpected error occurred");
      setShowErrorModal(true);
    }
  };

  const decryptImage = useCallback(
    (encryptedImage) => {
      try {
        const [ivHex, encryptedHex] = encryptedImage.split(":"); // Split IV and ciphertext
        const key = CryptoJS.enc.Hex.parse(secretKey); // Parse secret key
        const iv = CryptoJS.enc.Hex.parse(ivHex); // Parse IV
        // console.log(typeof iv, "typeof")
        // console.log(iv, "228")
        // Decrypt the image
        const decryptedBytes = CryptoJS.AES.decrypt(
          { ciphertext: CryptoJS.enc.Hex.parse(encryptedHex) },
          key,
          { iv, padding: CryptoJS.pad.Pkcs7 } // Use Pkcs7 padding
        );

        // Convert decrypted WordArray back to Base64 string
        const decryptedBase64 = CryptoJS.enc.Base64.stringify(decryptedBytes);

        // console.log("Decrypted image:", decryptedBase64);
        // console.log("Decrypted image:", `data:image/png;base64,${decryptedBase64}`);
        return `data:image/png;base64,${decryptedBase64}`; // Return image in Base64 format
      } catch (error) {
        console.error("Error during decryption:", error);
        return ""; // Return empty string if error occurs
      }
    },
    [secretKey]
  );

  const ResetForm = () => {
    setRecruitmentYear("");
    setOfficeName("");
    setPortName("");
    setApplicationNo("");
    setApplicationDate("");
    setExaminationPort("");
    setFullNameDevnagari("");
    setFullNameEnglish("");
    setMothersName("");
    setMothersNameMarathi("");
    setGender("");
    setMaritalStatus("");
    setCandidateNo("");
    setDob("");
    setAge("");
    setAddress("");
    setAddress2("");
    setAddress3("");
    setVillage("");
    setMukkamPost("");
    setDistrict("");
    setTaluka("");
    setState("");
    setPinCode("");
    setNationality("");
    setReligion("");
    setCast("");
    setSubCast("");
    setMobileNumber("");
    setEmailId("");
    setPermanentAddress("");
    setPermanentAddress("");
    setPermanentAddress2("");
    setPermanentAddress3("");
    setPermanentVillage("");
    setPermanentMukkamPost("");
    setPermanentTaluka("");
    setPermanentDistrict("");
    setPermanentState("");
    setPermanentPinCode("");
    setParallelReservation("");
    setPartTime("");
    setExsolier("");
    setHomeGuard("");
    setSportsPerson("");
    setFemaleReservation("");
    setParentInPolice("");
    setPoliceRank("");
    setExServiceDependent("");
    setProjectSick("");
    setExExamination("");
    setEarthquakeAttacked("");
    setCandidateId("");
    setDocumentUploaded("");
    setMeasurementStatus("");
    setBiometricStatus("");
    setChestNo("");
    setHeight("");
    setChestNormal("");
    setChestInhale("");
    setAppealCount("");
    setOrphan("");
    // setCategory(data.Category);
    setCategory("");
    setAncestral("");
    setGroupId("");
    setPhoto("");
    setSecretKey("");
    setUnitName("");
    setRecruitmentValue("");
    setSelectedValue("");
    setAppealStatus("");
    setScheduleName("");
    setScheduleDate("");
  };

  // const handleRadioChange = (event) => {
  //   setFilterStatus(event.target.value); // Update state with selected value
  //   fetchAllCandidates(
  //     {
  //       UserId: UserId,
  //       RecruitId: localStorage.getItem("recruitId"),
  //       Groundtestdata1: "",
  //       Status: filterStatus
  //     },
  //     setAllCandidates
  //   );
  // };
  const handleRadioChange = (event) => {
    const selectedValue = event.target.value;
    setFilterStatus(selectedValue); // Update state

    fetchAllCandidates(
      {
        UserId: UserId,
        RecruitId: localStorage.getItem("recruitId"),
        Groundtestdata1: "",
        Status: selectedValue // Use the selected value directly
      },
      setAllCandidates
    );
    setSelectedValue("")
    ResetForm("")
  };
  // Use the decrypted image
  const decryptedImageUrl = photo ? decryptImage(photo) : null;

  // console.log(decryptedImageUrl, "decryptedImageUrl")

  const handleDocValidationClick = () => {
    navigate("/documentVerification", {
      state: { fullNameEnglish, candidateId, category, parallelReservation },
    });
  };

  const handleHeightChestClick = () => {
    navigate(`/measurement`, {
      state: { fullNameEnglish, gender, candidateId, category },
    });
  };

  const handleBiometricClick = () => {
    navigate(`/biometric`, {
      state: { fullNameEnglish, chestNo, candidateId, category },
    });
  };

  const handleRfid = () => {
    navigate(`/rfidMapping`);
  };

  return (
    <>
      <div className="container-fluid">
        <div
          className="card m-3 mb-md-3"
          style={{ boxShadow: "0px 1px 5px rgba(0, 0, 0, 0.1)" }}
        >
          <div className="row">
            <div className="col-lg-12">
              <div className="row">
                <div className="col-xl-10 col-lg-9 col-md-9">
                  <div className="row">
                    {RoleName === "Superadmin" && (
                      <div className="col-xl-4 col-lg-5 col-md-5">
                        <div className="container p-3">
                          <Select
                            value={recruitmentValue}
                            onChange={handleRecruitmentChange}
                            options={allRecruitment}
                            placeholder="Select Recruitment"
                            styles={{
                              control: (provided) => ({
                                ...provided,
                                // width: "100%", // Adjust width as needed
                                minWidth: "200px", // Set a fixed minimum width
                                maxWidth: "200px",
                              }),
                            }}
                          />
                        </div>
                      </div>
                    )}

                    <div className="col-xxl-3 col-xl-4 col-lg-5 col-md-5">
                      <div className="container p-3">
                        <Select
                          value={selectedValue}
                          onChange={handleSelectChange}
                          options={allCandidates}
                          placeholder="Select Candidate"
                          styles={{
                            control: (provided) => ({
                              ...provided,
                              // width: "100%", // Adjust width as needed
                              minWidth: "200px", // Set a fixed minimum width
                              maxWidth: "150px",
                            }),
                          }}
                        />
                      </div>
                    </div>

                    {/* <div className="col-xxl-3 col-xl-4 col-lg-4 col-md-5">
                      <div className="container p-3">
                        <Select
                           value={selectedValue}
                           onChange={handleSelectChange}
                           options={allCandidates}
                          placeholder="Select Candidate"
                          styles={{
                            container: (provided) => ({
                              ...provided,
                              width: '200px',  // Fixed width for the entire component
                            }),
                            control: (provided) => ({
                              ...provided,
                              width: '100%',  // Control takes full width of container
                            }),
                            menu: (provided) => ({
                              ...provided,
                              width: '200px',  // Same width as container
                              minWidth: 'fit-content'  // Ensures menu isn't smaller than content
                            }),
                            option: (provided) => ({
                              ...provided,
                              width: '200px',  // Same width as container
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }),
                            singleValue: (provided) => ({
                              ...provided,
                              width: '180px',  // Slightly smaller to account for dropdown arrow
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            })
                          }}
                        />
                      </div>
                    </div> */}
                    {/* <div className="col-lg-2 col-md-2 mt-2">
                  <div className="btn btn-add" title="Add New">
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
                </div> */}
                    <div className="col-lg-2 col-md-2 mt-1 d-flex align-items-center">
                      <div className="btn btn-add me-2" title="Add New">
                        <input
                          className="form-control"
                          type="file"
                          onChange={handleFileChange}
                          ref={fileInputRef}
                          style={{ display: "none" }}
                        />
                        <Button
                          onClick={handleUploadClick}
                          style={{ backgroundColor: "#1B5A90", color: "white" }}
                        >
                          Import
                        </Button>
                      </div>
                      <Button
                        className="btn-sm"
                        style={{ backgroundColor: "#1B5A90", color: "white" }}
                      >
                        <Refresh
                          onClick={() => {
                            ResetForm();
                            navigate("/candidate");
                          }} // Refresh the page
                          style={{
                            fontSize: 30, // Increase icon size
                            cursor: "pointer",
                            color: "white",
                          }}
                          titleAccess="Refresh Page"
                        />
                      </Button>
                    </div>
                  </div>
                  {/* <div className="row">
                    <div className="col-xxl-3 col-xl-4 col-lg-5 col-md-5">
                      <div className="form-check ">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="flexRadioDefault"
                          id="flexRadioDefault1"
                          value="" // Set value for this radio button
                          checked={filterStatus === ""} // Bind checked state
                          onChange={handleRadioChange} // Handle change event
                        />
                        <label className="form-check-label fw-bold" htmlFor="flexRadioDefault2">
                          All
                        </label>
                      </div>
                      <div className="form-check mt-2">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="flexRadioDefault"
                          id="flexRadioDefault2"
                          value="Completed" // Set value for this radio button
                          checked={filterStatus === "Completed"} // Bind checked state
                          onChange={handleRadioChange} // Handle change event
                        />
                        <label className="form-check-label fw-bold" htmlFor="flexRadioDefault1">
                          Completed
                        </label>
                      </div>
                      <div className="form-check mt-2">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="flexRadioDefault"
                          id="flexRadioDefault3"
                          value="Pending" // Set value for this radio button
                          checked={filterStatus === "Pending"} // Bind checked state
                          onChange={handleRadioChange} // Handle change event
                        />
                        <label className="form-check-label fw-bold" htmlFor="flexRadioDefault2">
                          Pending
                        </label>
                      </div>
                    </div>
                  </div> */}
                  <div className="row">
                    <div className="col-12">
                      <div className="d-flex gap-4 align-items-center px-4">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="flexRadioDefault"
                            id="radioAll"
                            value=""
                            checked={filterStatus === ""}
                            onChange={handleRadioChange}
                          />
                          <label className="form-check-label fw-bold" htmlFor="radioAll">
                            All
                          </label>
                        </div>

                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="flexRadioDefault"
                            id="radioCompleted"
                            value="Completed"
                            checked={filterStatus === "Completed"}
                            onChange={handleRadioChange}
                          />
                          <label className="form-check-label fw-bold" htmlFor="radioCompleted">
                            Completed
                          </label>
                        </div>

                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="flexRadioDefault"
                            id="radioPending"
                            value="Pending"
                            checked={filterStatus === "Pending"}
                            onChange={handleRadioChange}
                          />
                          <label className="form-check-label fw-bold" htmlFor="radioPending">
                            Pending
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border my-md-4">
                    <div
                      className="card-header p-3" /* style={{ backgroundColor: 'white' }} */
                    >
                      <div className="row align-items-center">
                        <div className="col-lg-7">
                          <h4 className="card-title fw-bold text-start">
                            Candidate Details {/* //{selectedValue} */}
                          </h4>
                        </div>
                        {
                          scheduleName &&
                          <div className="col-lg-5">
                            <div className="row">
                              <div className="col-lg-6">
                                <label htmlFor="schedule Name">
                                  Assigned Schedule:
                                </label>
                              </div>
                              <div className="col-lg-6">
                                <label htmlFor="schedule Name">
                                  {scheduleName}
                                </label>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-lg-6">
                                <label htmlFor="schedule Name">
                                  Schedule Date:
                                </label>
                              </div>
                              {/* <div className="col-lg-6"> */}
                              <div className="col-lg-6 d-flex align-items-center gap-2">

                                <>
                                  <label>{scheduleDate ? scheduleDate.split("T")[0] : null}</label>
                                  <Edit
                                    style={{ cursor: "pointer", color: "blue" }}
                                    // onClick={() => setIsEditing(true)}
                                    onClick={() => getScheduleCandidate(scheduleName, candidateId)}
                                  />
                                </>


                                {/* </div> */}
                              </div>
                            </div>
                          </div>
                        }


                      </div>
                    </div>
                    <div className="card-body ">
                      <div className="row">
                        <div className="col-lg-6 col-md-6">
                          <div className="row">
                            <div className="col-lg-4 col-md-4">
                              <label htmlFor="recruitmentYear">
                                Recruitment Year
                              </label>
                            </div>
                            <div className="col-lg-8 col-md-8 mt-3 mt-lg-0">
                              <div className="form-group">
                                <input
                                  type="text"
                                  className="form-control"
                                  id="recruitmentYear"
                                  aria-describedby="recruitmentYear"
                                  value={recruitmentYear}
                                  onChange={() => { }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-6">
                          <div className="row">
                            <div className="col-lg-4 col-md-4 mt-3 mt-lg-0">
                              <label htmlFor="officeName">
                                Selected Constituent Office Name:
                              </label>
                            </div>
                            <div className="col-lg-8 col-md-8 mt-3 mt-lg-0">
                              <div className="form-group">
                                <input
                                  type="text"
                                  className="form-control"
                                  id="officeName"
                                  aria-describedby="officeName"
                                  value={officeName}
                                  onChange={() => { }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row mt-3">
                        <div className="col-lg-6 col-md-6">
                          <div className="row">
                            <div className="col-lg-4 col-md-4">
                              <label htmlFor="portName">Post Name:</label>
                            </div>
                            <div className="col-lg-8 col-md-8 mt-3 mt-lg-0">
                              <div className="form-group">
                                <input
                                  type="text"
                                  className="form-control"
                                  id="portName"
                                  aria-describedby="portName"
                                  // value={portName}
                                  value={category === null ? "" : category}
                                  onChange={() => { }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-6">
                          <div className="row">
                            <div className="col-lg-4 col-md-4 mt-3 mt-lg-0">
                              <label htmlFor="applicationNo">Application no:</label>
                            </div>
                            <div className="col-lg-8 col-md-8 mt-3 mt-lg-0">
                              <div className="form-group">
                                <input
                                  type="text"
                                  className="form-control"
                                  id="applicationNo"
                                  aria-describedby="applicationNo"
                                  value={applicationNo}
                                  onChange={() => { }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row mt-4">
                        <div className="col-lg-6 col-md-6">
                          <div className="row">
                            <div className="col-lg-4 col-md-4 mt-3 mt-lg-0">
                              <label htmlFor="examinationPort">
                                Examination Fee:
                              </label>
                            </div>
                            <div className="col-lg-8 col-md-8 mt-3 mt-lg-0">
                              <div className="form-group">
                                <input
                                  type="text"
                                  className="form-control"
                                  id="examinationPort"
                                  aria-describedby="examinationPort"
                                  value={examinationPort}
                                  onChange={() => { }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-6">
                          <div className="row">
                            <div className="col-lg-4 col-md-4 mt-3 mt-lg-0">
                              <label htmlFor="category">Category:</label>
                            </div>
                            <div className="col-lg-8 col-md-8 mt-3 mt-lg-0">
                              <div className="form-group">
                                <input
                                  type="text"
                                  className="form-control"
                                  id="category"
                                  aria-describedby="category"
                                  value={category === null ? "" : category}
                                  onChange={() => { }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row mt-4">
                        <div className="col-lg-6 col-md-6">
                          <div className="row">
                            <div className="col-lg-4 col-md-4 mt-3 mt-lg-0">
                              <label htmlFor="unitName">Unit Name:</label>
                            </div>
                            <div className="col-lg-8 col-md-8 mt-3 mt-lg-0">
                              <div className="form-group">
                                <input
                                  type="text"
                                  className="form-control"
                                  id="unitName"
                                  aria-describedby="unitName"
                                  value={unitName}
                                  onChange={() => { }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-6">
                          <div className="row">
                            <div className="col-lg-4 col-md-4 mt-3 mt-lg-0">
                              <label htmlFor="applicationDate">
                                Application Date:
                              </label>
                            </div>
                            <div className="col-lg-8 col-md-8 mt-3 mt-lg-0">
                              <div className="form-group">
                                <input
                                  type="text"
                                  className="form-control"
                                  id="applicationDate"
                                  aria-describedby="applicationDate"
                                  value={applicationDate}
                                  onChange={() => { }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        className="card-header mt-3 border bg-light" /* style={{ backgroundColor: 'white' }} */
                      >
                        <div className="row align-items-center ">
                          <div className="col ">
                            <h4 className="card-title fw-bold text-start ">
                              Personal Information
                            </h4>
                          </div>
                        </div>
                      </div>

                      <div className="card-body">
                        <div className="row">
                          <div className="col-lg-10 col-md-10">
                            <div className="row">
                              <div className="col-lg-12 col-md-12">
                                {/* <div className="row">
                                  <div className="col-lg-5 col-md-5">
                                    <label htmlFor="fullNameDevnagari">
                                      Candidate's Full Name <br /> (in Devnagari) :
                                    </label>
                                  </div>
                                  <div className="col-lg-7 col-md-7 mt-3 mt-lg-0">
                                    <div className="form-group">
                                      <input
                                        type="text"
                                        className="form-control"
                                        id="fullNameDevnagari"
                                        aria-describedby="fullNameDevnagari"
                                        value={fullNameDevnagari}
                                        onChange={() => { }}
                                      />
                                    </div>
                                  </div>
                                </div> */}
                              </div>
                              <div className="col-lg-12 col-md-12 mt-2">
                                <div className="row">
                                  <div className="col-lg-5 col-md-5">
                                    <label htmlFor="fullNameEnglish">
                                      Candidate's Full Name <br /> (in English) :
                                    </label>
                                  </div>
                                  <div className="col-lg-7 col-md-7 mt-3 mt-lg-0">
                                    <div className="form-group">
                                      <input
                                        type="text"
                                        className="form-control"
                                        id="fullNameEnglish"
                                        aria-describedby="fullNameEnglish"
                                        value={fullNameEnglish}
                                        onChange={() => { }}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-lg-12 col-md-12 mt-2">
                                <div className="row">
                                  <div className="col-lg-5 col-md-5">
                                    <label htmlFor="mothersName">
                                      Mothers Name <br /> (in English) :
                                    </label>
                                  </div>
                                  <div className="col-lg-7 col-md-7 mt-3 mt-lg-0">
                                    <div className="form-group">
                                      <input
                                        type="text"
                                        className="form-control"
                                        id="mothersName"
                                        aria-describedby="mothersName"
                                        value={mothersName}
                                        onChange={() => { }}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-lg-12 col-md-12 mt-2">
                                {/* <div className="row">
                                  <div className="col-lg-5 col-md-5">
                                    <label htmlFor="mothersNameMarathi">
                                      Mothers Name <br /> (in Devnagari) :
                                    </label>
                                  </div>
                                  <div className="col-lg-7 col-md-7 mt-3 mt-lg-0">
                                    <div className="form-group">
                                      <input
                                        type="text"
                                        className="form-control"
                                        id="mothersNameMarathi"
                                        aria-describedby="mothersNameMarathi"
                                        value={mothersNameMarathi}
                                        onChange={() => { }}
                                      />
                                    </div>
                                  </div>
                                </div> */}
                              </div>
                              <div className="col-lg-12 col-md-12 mt-3">
                                <div className="row">
                                  <div className="col-lg-5 col-md-5">
                                    <label htmlFor="gender">Gender</label>
                                  </div>
                                  <div className="col-lg-7 col-md-7 mt-3 mt-lg-0">
                                    <div className="form-group">
                                      <input
                                        type="text"
                                        className="form-control"
                                        id="gender"
                                        aria-describedby="gender"
                                        value={gender}
                                        onChange={() => { }}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-lg-12 col-md-12 mt-3">
                                <div className="row">
                                  <div className="col-lg-5 col-md-5">
                                    <label htmlFor="maritalStatus">
                                      Marital Status
                                    </label>
                                  </div>
                                  <div className="col-lg-7 col-md-7 mt-3 mt-lg-0">
                                    <div className="form-group">
                                      <input
                                        type="text"
                                        className="form-control"
                                        id="maritalStatus"
                                        aria-describedby="maritalStatus"
                                        value={maritalStatus}
                                        onChange={() => { }}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-lg-12 col-md-12 mt-3">
                                <div className="row">
                                  <div className="col-lg-5 col-md-5">
                                    <label htmlFor="candidateNo">
                                      Pass Certificate No :
                                    </label>
                                  </div>
                                  <div className="col-lg-7 col-md-7 mt-3 mt-lg-0">
                                    <div className="form-group">
                                      <input
                                        type="text"
                                        className="form-control"
                                        id="candidateNo"
                                        aria-describedby="candidateNo"
                                        value={candidateNo}
                                        onChange={() => { }}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-lg-12 col-md-12 mt-3">
                                <div className="row">
                                  <div className="col-lg-5 col-md-5">
                                    <label htmlFor="candidateNo">
                                      Date of Birth :
                                    </label>
                                  </div>
                                  <div className="col-lg-7 col-md-7 mt-3 mt-lg-0">
                                    <div className="form-group">
                                      <input
                                        type="text"
                                        className="form-control"
                                        id="dob"
                                        aria-describedby="dob"
                                        value={dob}
                                        onChange={() => { }}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-lg-12 col-md-12 mt-3">
                                <div className="row">
                                  <div className="col-lg-5 col-md-5">
                                    <label htmlFor="candidateNo">Age On :</label>
                                  </div>
                                  <div className="col-lg-7 col-md-7 mt-3 mt-lg-0">
                                    <div className="form-group">
                                      <input
                                        type="text"
                                        className="form-control"
                                        id="age"
                                        aria-describedby="age"
                                        value={age}
                                        onChange={() => { }}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                              {/* <div className="col-lg-12 col-md-12 mt-3">
                            <div className="row">
                              <div className="col-lg-6 col-md-6">
                                <div className="row">
                                  <div className="col-lg-5 col-md-5">
                                    <label htmlFor="dob">Date of Birth :</label>
                                  </div>
                                  <div className="col-lg-7 col-md-7 mt-3 mt-lg-0">
                                    <div className="form-group">
                                      <input
                                        type="text"
                                        className="form-control"
                                        id="dob"
                                        aria-describedby="dob"
                                        value={dob}
                                        onChange={() => { }}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-lg-6 col-md-6">
                                <div className="row">
                                  <div className="col-lg-5 col-md-5 mt-3 mt-lg-0">
                                    <label htmlFor="dob">Age on :</label>
                                  </div>
                                  <div className="col-lg-7 col-md-7 mt-3 mt-lg-0">
                                    <div className="form-group">
                                      <input
                                        type="text"
                                        className="form-control"
                                        id="age"
                                        aria-describedby="age"
                                        value={age}
                                        onChange={() => { }}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div> */}
                            </div>
                          </div>
                          <div className="col-lg-2 col-md-2">
                            {decryptedImageUrl ? (
                              <img
                                src={decryptedImageUrl}
                                className="img-fluid image-box"
                              />
                            ) : null}
                          </div>
                        </div>
                      </div>
                      <div
                        className="card-header bg-light mt-3 border" /* style={{ backgroundColor: 'white' }} */
                      >
                        <div className="row align-items-center">
                          <div className="col">
                            <h4 className="card-title fw-bold text-start">
                              Address for Contact
                            </h4>
                          </div>
                        </div>
                      </div>

                      <div className="card-body">
                        <div className="row">
                          <div className="col-lg-12 col-md-12">
                            <div className="row">
                              <div className="col-lg-4 col-md-4">
                                <label htmlFor="address">Address 1:</label>
                              </div>
                              <div className="col-lg-8 col-md-8 mt-3 mt-lg-0">
                                <div className="form-group">
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="address"
                                    aria-describedby="address"
                                    value={address}
                                    onChange={() => { }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-12 col-md-12 mt-3">
                            <div className="row">
                              <div className="col-lg-4 col-md-4">
                                <label htmlFor="address2">Address 2:</label>
                              </div>
                              <div className="col-lg-8 col-md-8 mt-3 mt-lg-0">
                                <div className="form-group">
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="address2"
                                    aria-describedby="address2"
                                    value={address2}
                                    onChange={() => { }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-12 col-md-12 mt-3">
                            <div className="row">
                              <div className="col-lg-4 col-md-4">
                                <label htmlFor="address3">Address 3:</label>
                              </div>
                              <div className="col-lg-8 col-md-8 mt-3 mt-lg-0">
                                <div className="form-group">
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="address3"
                                    aria-describedby="address3"
                                    value={address3}
                                    onChange={() => { }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-12 col-md-12 mt-3">
                            <div className="row">
                              <div className="col-lg-4 col-md-4">
                                <label htmlFor="village">Village:</label>
                              </div>
                              <div className="col-lg-8 col-md-8 mt-3 mt-lg-0">
                                <div className="form-group">
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="village"
                                    aria-describedby="village"
                                    value={village}
                                    onChange={() => { }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-12 col-md-12 mt-3">
                            <div className="row">
                              <div className="col-lg-4 col-md-4">
                                <label htmlFor="mukkamPost">Mukkam Post:</label>
                              </div>
                              <div className="col-lg-8 col-md-8 mt-3 mt-lg-0">
                                <div className="form-group">
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="mukkamPost"
                                    aria-describedby="mukkamPost"
                                    value={mukkamPost}
                                    onChange={() => { }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-12 col-md-12 mt-3">
                            <div className="row">
                              <div className="col-lg-4 col-md-4">
                                <label htmlFor="taluka">Taluka:</label>
                              </div>
                              <div className="col-lg-8 col-md-8 mt-3 mt-lg-0">
                                <div className="form-group">
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="taluka"
                                    aria-describedby="taluka"
                                    value={taluka}
                                    onChange={() => { }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-12 col-md-12 mt-3">
                            <div className="row">
                              <div className="col-lg-4 col-md-4">
                                <label htmlFor="district">District:</label>
                              </div>
                              <div className="col-lg-8 col-md-8 mt-3 mt-lg-0">
                                <div className="form-group">
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="district"
                                    aria-describedby="district"
                                    value={district}
                                    onChange={() => { }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-12 col-md-12 mt-3">
                            <div className="row">
                              <div className="col-lg-4 col-md-4">
                                <label htmlFor="state">State:</label>
                              </div>
                              <div className="col-lg-8 col-md-8 mt-3 mt-lg-0">
                                <div className="form-group">
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="state"
                                    aria-describedby="state"
                                    value={state}
                                    onChange={() => { }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-12 col-md-12 mt-2">
                            <div className="row">
                              <div className="col-lg-4 col-md-4">
                                <label htmlFor="pinCode">Pin Code :</label>
                              </div>
                              <div className="col-lg-8 col-md-8 mt-3 mt-lg-0">
                                <div className="form-group">
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="pinCode"
                                    aria-describedby="pinCode"
                                    value={pinCode}
                                    onChange={() => { }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-12 col-md-12 mt-3">
                            <div className="row">
                              <div className="col-lg-4 col-md-4">
                                <label htmlFor="mobileNumber">Mobile Number:</label>
                              </div>
                              <div className="col-lg-8 col-md-8 mt-3 mt-lg-0">
                                <div className="form-group">
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="mobileNumber"
                                    aria-describedby="mobileNumber"
                                    value={mobileNumber}
                                    onChange={() => { }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-12 col-md-12 mt-3">
                            <div className="row">
                              <div className="col-lg-4 col-md-4">
                                <label htmlFor="emailId">Email Id :</label>
                              </div>
                              <div className="col-lg-8 col-md-8 mt-3 mt-lg-0">
                                <div className="form-group">
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="emailId"
                                    aria-describedby="emailId"
                                    value={emailId}
                                    onChange={() => { }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        className="card-header bg-light mt-3 border" /* style={{ backgroundColor: 'white' }} */
                      >
                        <div className="row align-items-center">
                          <div className="col">
                            <h4 className="card-title fw-bold text-start">
                              Permanent Address
                            </h4>
                          </div>
                        </div>
                      </div>
                      <div className="card-body">
                        <div className="row">
                          <div className="col-lg-12 col-md-12">
                            <div className="row">
                              <div className="col-lg-4 col-md-4">
                                <label htmlFor="permanentAddress">Address 1:</label>
                              </div>
                              <div className="col-lg-8 col-md-8 mt-3 mt-lg-0">
                                <div className="form-group">
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="permanentAddress"
                                    aria-describedby="permanentAddress"
                                    value={permanentAddress}
                                    onChange={() => { }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-12 col-md-12 mt-3">
                            <div className="row">
                              <div className="col-lg-4 col-md-4">
                                <label htmlFor="permanentAddress2">
                                  Address 2:
                                </label>
                              </div>
                              <div className="col-lg-8 col-md-8 mt-3 mt-lg-0">
                                <div className="form-group">
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="permanentAddress2"
                                    aria-describedby="permanentAddress2"
                                    value={permanentAddress2}
                                    onChange={() => { }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-12 col-md-12 mt-3">
                            <div className="row">
                              <div className="col-lg-4 col-md-4">
                                <label htmlFor="permanentAddress3">
                                  Address 3:
                                </label>
                              </div>
                              <div className="col-lg-8 col-md-8 mt-3 mt-lg-0">
                                <div className="form-group">
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="permanentAddress3"
                                    aria-describedby="permanentAddress3"
                                    value={permanentAddress3}
                                    onChange={() => { }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-12 col-md-12 mt-3">
                            <div className="row">
                              <div className="col-lg-4 col-md-4">
                                <label htmlFor="permanentVillage">Village :</label>
                              </div>
                              <div className="col-lg-8 col-md-8 mt-3 mt-lg-0">
                                <div className="form-group">
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="permanentVillage"
                                    aria-describedby="permanentVillage"
                                    value={permanentVillage}
                                    onChange={() => { }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-12 col-md-12 mt-3">
                            <div className="row">
                              <div className="col-lg-4 col-md-4">
                                <label htmlFor="permanentMukkamPost">
                                  Mukkam Post :
                                </label>
                              </div>
                              <div className="col-lg-8 col-md-8 mt-3 mt-lg-0">
                                <div className="form-group">
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="permanentMukkamPost"
                                    aria-describedby="permanentMukkamPost"
                                    value={permanentMukkamPost}
                                    onChange={() => { }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-12 col-md-12 mt-3">
                            <div className="row">
                              <div className="col-lg-4 col-md-4">
                                <label htmlFor="permanentTaluka">Taluka :</label>
                              </div>
                              <div className="col-lg-8 col-md-8 mt-3 mt-lg-0">
                                <div className="form-group">
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="permanentTaluka"
                                    aria-describedby="permanentTaluka"
                                    value={permanentTaluka}
                                    onChange={() => { }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-12 col-md-12 mt-3">
                            <div className="row">
                              <div className="col-lg-4 col-md-4">
                                <label htmlFor="permanentDistrict">
                                  District :
                                </label>
                              </div>
                              <div className="col-lg-8 col-md-8 mt-3 mt-lg-0">
                                <div className="form-group">
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="permanentDistrict"
                                    aria-describedby="permanentDistrict"
                                    value={permanentDistrict}
                                    onChange={() => { }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-12 col-md-12 mt-3">
                            <div className="row">
                              <div className="col-lg-4 col-md-4">
                                <label htmlFor="permanentState">State :</label>
                              </div>
                              <div className="col-lg-8 col-md-8 mt-3 mt-lg-0">
                                <div className="form-group">
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="permanentState"
                                    aria-describedby="permanentState"
                                    value={permanentState}
                                    onChange={() => { }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-12 col-md-12 mt-2 mt-3">
                            <div className="row">
                              <div className="col-lg-4 col-md-4">
                                <label htmlFor="permanentPinCode">Pin Code :</label>
                              </div>
                              <div className="col-lg-8 col-md-8 mt-3 mt-lg-0">
                                <div className="form-group">
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="permanentPinCode"
                                    aria-describedby="permanentPinCode"
                                    value={permanentPinCode}
                                    onChange={() => { }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div
                        className="card-header bg-light mt-3 border" /* style={{ backgroundColor: 'white' }} */
                      >
                        <div className="row align-items-center">
                          <div className="col">
                            <h4 className="card-title fw-bold text-start">
                              Measurement
                            </h4>
                          </div>
                        </div>
                      </div>

                      <div className="card-body">
                        <div className="row">
                          <div className="col-lg-12 col-md-12">
                            <div className="row">
                              <div className="col-lg-6 col-md-6">
                                <div className="row">
                                  <div className="col-lg-6 col-md-6">
                                    <label htmlFor="height">Height:</label>
                                  </div>
                                  <div className="col-lg-6 col-md-6 mt-lg-0 mt-3">
                                    <div className="form-group">
                                      <input
                                        type="text"
                                        className="form-control"
                                        id="height"
                                        aria-describedby="height"
                                        value={height}
                                        onChange={() => { }}
                                        readOnly
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-12 col-md-12 mt-2">
                            <div className="row">
                              <div className="col-lg-6 col-md-6">
                                <div className="row">
                                  <div className="col-lg-6 col-md-6">
                                    <label htmlFor="chestNormal">
                                      Chest Normal:
                                    </label>
                                  </div>
                                  <div className="col-lg-6 col-md-6 mt-lg-0 mt-3">
                                    <div className="form-group">
                                      <input
                                        type="text"
                                        className="form-control"
                                        id="chestNormal"
                                        aria-describedby="chestNormal"
                                        value={chestNormal}
                                        onChange={() => { }}
                                        readOnly
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-lg-6 col-md-6">
                                <div className="row">
                                  <div className="col-lg-6 col-md-6 mt-lg-0 mt-3">
                                    <label htmlFor="chestInhale">
                                      Chest Inhale:
                                    </label>
                                  </div>
                                  <div className="col-lg-6 col-md-6 mt-lg-0 mt-3">
                                    <div className="form-group">
                                      <input
                                        type="text"
                                        className="form-control"
                                        id="chestInhale"
                                        aria-describedby="chestInhale"
                                        value={chestInhale}
                                        onChange={() => { }}
                                        readOnly
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        className="card-header bg-light mt-3 border" /* style={{ backgroundColor: 'white' }} */
                      >
                        <div className="row align-items-center">
                          <div className="col">
                            <h4 className="card-title fw-bold text-start">
                              Other Information
                            </h4>
                          </div>
                        </div>
                      </div>

                      <div className="card-body">
                        <div className="row">
                          <div className="col-lg-6 col-md-6">
                            <div className="row">
                              <div className="col-lg-4 col-md-4">
                                <label htmlFor="nationality">Nationality : </label>
                              </div>
                              <div className="col-lg-8 col-md-8 mt-3 mt-lg-0">
                                <div className="form-group">
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="nationality"
                                    aria-describedby="nationality"
                                    value={nationality}
                                    onChange={() => { }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-6 col-md-6">
                            <div className="row">
                              <div className="col-lg-4 col-md-4 mt-3 mt-lg-0">
                                <label htmlFor="religion">Religion:</label>
                              </div>
                              <div className="col-lg-8 col-md-8 mt-3 mt-lg-0">
                                <div className="form-group">
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="religion"
                                    aria-describedby="religion"
                                    value={religion}
                                    onChange={() => { }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row mt-3">
                          <div className="col-lg-6 col-md-6">
                            <div className="row">
                              <div className="col-lg-4 col-md-4 mt-3 mt-lg-0">
                                <label htmlFor="cast">Cast:</label>
                              </div>
                              <div className="col-lg-8 col-md-8 mt-3 mt-lg-0">
                                <div className="form-group">
                                  {/* <input
                                                                type="text"
                                                                className="form-control"
                                                                id="cast"
                                                                aria-describedby="cast"
                                                                value={cast}
                                                                onChange={() => { }}
                                                            /> */}
                                  {/* <Select
                                value={cast}
                                onChange={handleSelectCast}
                                options={allCast}
                                placeholder="Select Cast"
                              /> */}
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="cast"
                                    aria-describedby="cast"
                                    value={cast.label}
                                    onChange={() => { }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-6 col-md-6">
                            <div className="row">
                              <div className="col-lg-4 col-md-4 mt-3 mt-lg-0">
                                <label htmlFor="subCast">Sub Cast:</label>
                              </div>
                              <div className="col-lg-8 col-md-8 mt-3 mt-lg-0">
                                <div className="form-group">
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="subCast"
                                    aria-describedby="subCast"
                                    value={subCast}
                                    onChange={() => { }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row mt-4">
                          <div className="col-lg-6 col-md-6">
                            <div className="row">
                              <div className="col-lg-4 col-md-4">
                                <label htmlFor="Parallel Reservation">
                                  Parallel Reservation :
                                </label>
                              </div>
                              <div className="col-lg-8 col-md-8 mt-3 mt-lg-0">
                                <div className="form-group">
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="Parallel Reservation"
                                    aria-describedby="emailHelp"
                                    value={parallelReservation}
                                    onChange={() => { }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-6 col-md-6">
                            <div className="row">
                              <div className="col-lg-4 col-md-4 mt-3 mt-lg-0">
                                <label htmlFor="ExSoldier	">ExSoldier :</label>
                              </div>
                              <div className="col-lg-8 col-md-8 mt-3 mt-lg-0">
                                <div className="form-group">
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="ExSoldier	"
                                    aria-describedby="ExSoldier	"
                                    value={
                                      exsolier === "0"
                                        ? "no"
                                        : exsolier === "1"
                                          ? "yes"
                                          : ""
                                    }
                                    onChange={() => { }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row mt-4">
                          <div className="col-lg-6 col-md-6">
                            <div className="row">
                              <div className="col-lg-4 col-md-4">
                                <label htmlFor="HomeGuard	">HomeGuard :</label>
                              </div>
                              <div className="col-lg-8 col-md-8 mt-3 mt-lg-0">
                                <div className="form-group">
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="HomeGuard	"
                                    aria-describedby="emailHelp"
                                    value={
                                      homeGuard === "0"
                                        ? "no"
                                        : homeGuard === "1"
                                          ? "yes"
                                          : ""
                                    }
                                    onChange={() => { }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-6 col-md-6">
                            <div className="row">
                              <div className="col-lg-4 col-md-4 mt-3 mt-lg-0">
                                <label htmlFor="Sportsperson	">Sportsperson :</label>
                              </div>
                              <div className="col-lg-8 col-md-8 mt-3 mt-lg-0">
                                <div className="form-group">
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="Sportsperson	"
                                    aria-describedby="Sportsperson	"
                                    value={
                                      sportsPerson === "0"
                                        ? "no"
                                        : sportsPerson === "1"
                                          ? "yes"
                                          : ""
                                    }
                                    onChange={() => { }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row mt-4">
                          <div className="col-lg-6 col-md-6">
                            <div className="row">
                              <div className="col-lg-4 col-md-4">
                                <label htmlFor="FemaleReservation	">
                                  Female Reservation :
                                </label>
                              </div>
                              <div className="col-lg-8 col-md-8 mt-3 mt-lg-0">
                                <div className="form-group">
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="FemaleReservation	"
                                    aria-describedby="emailHelp"
                                    value={
                                      femaleReservation === "0"
                                        ? "no"
                                        : femaleReservation === "1"
                                          ? "yes"
                                          : ""
                                    }
                                    onChange={() => { }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-6 col-md-6">
                            <div className="row">
                              <div className="col-lg-4 col-md-4 mt-3 mt-lg-0">
                                <label htmlFor="ParentInPolice	">
                                  Parent In Police :
                                </label>
                              </div>
                              <div className="col-lg-8 col-md-8 mt-3 mt-lg-0">
                                <div className="form-group">
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="ParentInPolice	"
                                    aria-describedby="ParentInPolice	"
                                    value={
                                      parentInPolice === "0"
                                        ? "no"
                                        : parentInPolice === "1"
                                          ? "yes"
                                          : ""
                                    }
                                    onChange={() => { }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row mt-4">
                          <div className="col-lg-6 col-md-6">
                            <div className="row">
                              <div className="col-lg-4 col-md-4">
                                <label htmlFor="policeRank">Police Rank :</label>
                              </div>
                              <div className="col-lg-8 col-md-8 mt-3 mt-lg-0">
                                <div className="form-group">
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="policeRank	"
                                    aria-describedby="emailHelp"
                                    value={policeRank}
                                    onChange={() => { }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-6 col-md-6">
                            <div className="row">
                              <div className="col-lg-4 col-md-4 mt-3 mt-lg-0">
                                <label htmlFor="Ex-ServiceDependent	">
                                  Ex-ServiceDependent :
                                </label>
                              </div>
                              <div className="col-lg-8 col-md-8 mt-3 mt-lg-0">
                                <div className="form-group">
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="Ex-ServiceDependent	"
                                    aria-describedby="Ex-ServiceDependent	"
                                    value={
                                      exServiceDependent === "0"
                                        ? "no"
                                        : exServiceDependent === "1"
                                          ? "yes"
                                          : ""
                                    }
                                    onChange={() => { }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row mt-4">
                          <div className="col-lg-6 col-md-6">
                            <div className="row">
                              <div className="col-lg-4 col-md-4">
                                <label htmlFor="partTime">Part Time :</label>
                              </div>
                              <div className="col-lg-8 col-md-8 mt-3 mt-lg-0">
                                <div className="form-group">
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="partTime"
                                    aria-describedby="emailHelp"
                                    value={
                                      partTime === "0"
                                        ? "no"
                                        : partTime === "1"
                                          ? "yes"
                                          : ""
                                    }
                                    onChange={() => { }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-6 col-md-6">
                            <div className="row">
                              <div className="col-lg-4 col-md-4 mt-3 mt-lg-0">
                                <label htmlFor="projectSick">
                                  Are you project sick? :
                                </label>
                              </div>
                              <div className="col-lg-8 col-md-8 mt-3 mt-lg-0">
                                <div className="form-group">
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="projectSick"
                                    aria-describedby="projectSick"
                                    value={
                                      projectSick === "0"
                                        ? "no"
                                        : projectSick === "1"
                                          ? "yes"
                                          : ""
                                    }
                                    onChange={() => { }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row mt-4">
                          <div className="col-lg-6 col-md-6">
                            <div className="row">
                              <div className="col-lg-4 col-md-4">
                                <label htmlFor="exExamination">
                                  Are you an ex Serviceman? :
                                </label>
                              </div>
                              <div className="col-lg-8 col-md-8 mt-3 mt-lg-0">
                                <div className="form-group">
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="exExamination"
                                    aria-describedby="exExamination"
                                    value={
                                      exServiceDependent === "0"
                                        ? "no"
                                        : exServiceDependent === "1"
                                          ? "yes"
                                          : ""
                                    }
                                    onChange={() => { }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-6 col-md-6">
                            <div className="row">
                              <div className="col-lg-4 col-md-4 mt-3 mt-lg-0">
                                <label htmlFor="earthquakeAttacked">
                                  Earthquake Affected? :
                                </label>
                              </div>
                              <div className="col-lg-8 col-md-8 mt-3 mt-lg-0">
                                <div className="form-group">
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="earthquakeAttacked"
                                    aria-describedby="earthquakeAttacked"
                                    value={
                                      earthquakeAttacked === "0"
                                        ? "no"
                                        : earthquakeAttacked === "1"
                                          ? "yes"
                                          : ""
                                    }
                                    onChange={() => { }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row mt-4">
                          <div className="col-lg-6 col-md-6">
                            <div className="row">
                              <div className="col-lg-4 col-md-4">
                                <label htmlFor="orphan">Are you an Orphan? :</label>
                              </div>
                              <div className="col-lg-8 col-md-8 mt-3 mt-lg-0">
                                <div className="form-group">
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="orphan"
                                    aria-describedby="orphan"
                                    value={
                                      orphan === "0"
                                        ? "no"
                                        : orphan === "1"
                                          ? "yes"
                                          : ""
                                    }
                                    onChange={() => { }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-6 col-md-6">
                            <div className="row">
                              <div className="col-lg-4 col-md-4 mt-3 mt-lg-0">
                                <label htmlFor="Ancestral">Ancestral? :</label>
                              </div>
                              <div className="col-lg-8 col-md-8 mt-3 mt-lg-0">
                                <div className="form-group">
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="Ancestral"
                                    aria-describedby="Ancestral"
                                    value={
                                      ancestral === "0"
                                        ? "no"
                                        : ancestral === "1"
                                          ? "yes"
                                          : ""
                                    }
                                    onChange={() => { }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-2 col-lg-3 col-md-3 mt-2">
                  <div className="row" style={{ height: "38px" }}>
                    <div className="col-lg-12">
                      <label
                        className="mx-2"
                        style={{
                          display: measurementStatus === true ? "inline" : "none",
                        }}
                      >
                        {chestNo ? <b style={{ fontSize: "14px" }}>Chest Number: {chestNo}</b> : <b></b>}
                      </label>

                      {/* {groupId === null ? (
                        <h6>{ }</h6>
                      ) : (
                        <h6 className="fw-bold mx-2">Group : {groupId}</h6>
                      )} */}
                      {/* <h6 className="fw-bold mx-2">Group : {groupId}</h6> */}
                      <h6 className="fw-bold mx-2" style={{ fontSize: "14px" }}>{groupId ? `Group : ${groupId}` : ""}</h6>
                    </div>
                  </div>
                  {/* <div className="position-fixed top-0 start-0 bg-white p-2 shadow"> */}
                  <div className="d-grid gap-2 d-md-grid gap-md-2 d-lg-grid gap-lg-2" style={{ "marginTop": "75px" }}>
                    {/* <div> */}
                    {/* <label
                      className="mx-2"
                      style={{
                        display: measurementStatus === true ? "inline" : "none",
                      }}
                    >
                      <b>Chest Number: {chestNo}</b>
                    </label>

                    {groupId === null ? (
                      <h6>{ }</h6>
                    ) : (
                      <h6 className="fw-bold mx-2">Group : {groupId}</h6>
                    )} */}
                    {/* </div> */}

                    {/* <div className="mt-4"> */}
                    {(DutyName === "Document Verification" ||
                      DutyName === "All" ||
                      DutyName === "null") && (
                        <button
                          onClick={handleDocValidationClick}
                          // disabled={
                          //   !candidateId ||
                          //   documentUploaded === "True" ||
                          //   (documentUploaded === "False" &&
                          //     appealStatus !== "Approved") ||
                          //   measurementStatus === false
                          // }
                          className={`btn btn-primary btn-sm p-2 rounded-4  mx-3 position-relative ${documentUploaded === "True"
                            ? "btn-success"
                            : documentUploaded === "False"
                              ? "btn-danger"
                              : documentUploaded === "Pending"
                                ? 'btn-warning'
                                : ""
                            }`}
                        >
                          Verify Documents
                        </button>
                      )}

                    {/* </div> */}
                    {DutyName === "Height and Chest Measurement" ||
                      DutyName === "All" ||
                      DutyName === "null" ? (
                      <button
                        onClick={handleHeightChestClick}
                        // disabled={
                        //   !candidateId ||
                        //   documentUploaded === "False" ||
                        //   (measurementStatus === false &&
                        //     appealStatus !== "Approved") ||
                        //   measurementStatus === true
                        // }
                        className={`btn btn-primary btn-sm p-2 rounded-4 mt-3 mx-3 position-relative ${measurementStatus === true
                          ? "btn-success"
                          : measurementStatus === false
                            ? "btn-danger"
                            : ""
                          }`}
                      >
                        Check Height and Chest
                      </button>
                    ) : null}

                    {DutyName === "Biometric" ||
                      DutyName === "All" ||
                      DutyName === "null" ? (
                      <>
                        <button
                          onClick={handleBiometricClick}
                          disabled={!candidateId}
                          className={`btn btn-primary btn-sm p-2 rounded-4 mt-3 mx-3 position-relative ${biometricStatus === true
                            ? "btn-success"
                            : biometricStatus === false
                              ? "btn-danger"
                              : ""
                            }`} /* disabled={!measurementStatus} */
                        >
                          Biometric
                        </button>
                      </>
                    ) : null}
                    {/* </div> */}

                    <button
                      className={`btn btn-primary btn-sm p-2 rounded-4 mt-3 mx-3 position-relative ${measurementStatus === true &&
                        documentUploaded === "True"
                        ? "btn-success d-block"
                        : measurementStatus === false &&
                          documentUploaded === "False"
                          ? "btn-danger d-none"
                          : "d-none"
                        }`}
                      disabled={!measurementStatus || !candidateId}
                      onClick={() => {
                        navigate("/admissionCard", {
                          state: { candidateid: selectedValue },
                        });
                      }}
                    >
                      Get Admission Card
                    </button>
                    {/* <button
                      className={`btn btn-primary btn-sm p-2 rounded-4 mt-3 mx-3 position-relative ${measurementStatus === true &&
                        documentUploaded === "True"
                        ? "btn-success d-block"
                        : measurementStatus === false &&
                          documentUploaded === "False"
                          ? "btn-danger d-none"
                          : "d-none"
                        }`}
                      disabled={!measurementStatus || !candidateId}
                    >
                      Get Chest Number
                    </button> */}
                    {(
                      measurementStatus === false ||
                      documentUploaded === "False"// If either one is false, show the button
                    ) ? (
                      <button
                        className={`btn btn-primary btn-sm p-2 rounded-4 mt-3 mx-3 position-relative ${measurementStatus === false || documentUploaded === "False"
                          ? "btn-danger d-block"
                          : "d-none"
                          }`}
                        disabled={
                          documentUploaded === "true" || measurementStatus === "True" || !candidateId
                        }
                        onClick={() => {
                          navigate("/admissioncardreject", {
                            state: { candidateid: selectedValue },
                          });
                        }}
                      >
                        Reject Slip
                      </button>
                    )
                      : null
                    }
                    {/* {(
                      measurementStatus === null ||
                      measurementStatus === false ||
                      documentUploaded === "False" // If any condition is true, show the button
                    ) && (
                        <button
                          className={`btn btn-primary btn-sm p-2 rounded-4 mt-3 mx-3 position-relative ${measurementStatus === null ||
                              measurementStatus === false ||
                              documentUploaded === "False"
                              ? "btn-danger d-block"
                              : "d-none"
                            }`}
                          disabled={
                            (documentUploaded === "True" && measurementStatus === "True") || !candidateId
                          }
                          onClick={() => {
                            navigate("/admissioncardreject", {
                              state: { candidateid: selectedValue },
                            });
                          }}
                        >
                          Reject Slip
                        </button>
                      )} */}

                    {/* {(measurementStatus === false ||
                      documentUploaded === "False"
                     
                    ) && (
                        <button
                          className={`btn p-4 rounded-4 mt-3 mx-3 position-relative ${measurementStatus === false ||
                            documentUploaded === "False"
                            ? "btn-danger"
                            : "d-none"
                            }`}
                          disabled={appealCount === 4 || !candidateId}
                          onClick={() => {
                            navigate("/appeal", {
                              state: { candidateid: selectedValue.value },
                            });
                          }}
                        >
                          Appeal
                        </button>
                      )} */}

                  </div>
                  {/* </div> */}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
      <Modal show={showErrorModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Error Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {errorMessage && (
            <>
              {/* Application Number Errors */}
              {errorMessage.applicationNoErrors?.length > 0 && (
                <>
                  <h5>Duplicate Application Numbers Errors</h5>
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th style={{ width: "20%" }}>#</th>
                        <th>Application Number</th>
                      </tr>
                    </thead>
                    <tbody>
                      {errorMessage.applicationNoErrors.map((appNo, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{appNo.replace("ApplicationNo: ", "")}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}

              {/* Mobile Number Errors */}
              {errorMessage.mobileNoErrors?.length > 0 && (
                <>
                  <h5>Duplicate Mobile Numbers Errors</h5>
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th style={{ width: "20%" }}>#</th>
                        <th>Mobile Number</th>
                      </tr>
                    </thead>
                    <tbody>
                      {errorMessage.mobileNoErrors.map((mobile, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{mobile.replace("MobileNo: ", "")}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}

              {/* Blank Mobile Number Errors */}
              {errorMessage.blankMobileNoErrors?.length > 0 && (
                <>
                  <h5>Blank Mobile Numbers Errors</h5>
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th style={{ width: "20%" }}>#</th>
                        <th>Blank Mobile Number</th>
                      </tr>
                    </thead>
                    <tbody>
                      {errorMessage.blankMobileNoErrors.map((mobile, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{mobile.replace("MobileNumber :", "").trim() || "N/A"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}

              {/* Blank Application Number Errors */}
              {errorMessage.blankApplicationNoErrors?.length > 0 && (
                <>
                  <h5>Blank Application Number Errors</h5>
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th style={{ width: "20%" }}>#</th>
                        <th>Blank Application Number</th>
                      </tr>
                    </thead>
                    <tbody>
                      {errorMessage.blankApplicationNoErrors.map((appNo, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{appNo.replace("ApplicationNumber:", "").trim() || "N/A"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}

              {/* Blank Gender Errors */}
              {errorMessage.blankGenderErrors?.length > 0 && (
                <>
                  <h5>Blank Gender Errors</h5>
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th style={{ width: "20%" }}>#</th>
                        <th>Blank Gender</th>
                      </tr>
                    </thead>
                    <tbody>
                      {errorMessage.blankGenderErrors.map((gender, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{gender.replace("Gender :", "").trim() || "N/A"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}

              {/* Blank Parallel Reservation Errors */}
              {errorMessage.blankParallelReservationErrors?.length > 0 && (
                <>
                  <h5>Blank Parallel Reservation Errors</h5>
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th style={{ width: "20%" }}>#</th>
                        <th>Blank Parallel Reservation</th>
                      </tr>
                    </thead>
                    <tbody>
                      {errorMessage.blankParallelReservationErrors.map((reservation, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{reservation.replace("ParallelReservation :", "").trim() || "N/A"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showModal2} onHide={handleClose2} size="md" backdrop="static" centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <h5 className="fw-bold">Candidate Schedule Date</h5>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col xs={12} sm={12} md={12} lg={12} className="mt-2 mt-lg-0">
                <Row>
                  <Col xs={12} sm={12} md={5} lg={5} className="mt-2 mt-lg-0">
                    <Form.Group className="mb-3" controlId="parameterCode">
                      <Form.Label className="fw-bold text-end">Schedule Date:</Form.Label>{" "}
                      {(!scheduleDatePerCandidate && !assignNewDate) || (scheduleDatePerCandidate && !assignNewDate) ? (
                        <span className="text-danger fw-bold">*</span>
                      ) : null}
                    </Form.Group>
                  </Col>
                  <Col xs={12} sm={12} md={7} lg={7} className="mt-2 mt-lg-0">
                    <Select
                      className="mt-2"
                      value={scheduleDatePerCandidate}
                      onChange={handleScheduleDate}
                      options={allScheduleDate}
                      placeholder="Select Schedule Date"
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <Col xs={12} sm={12} md={12} lg={12} className="mt-2 mt-lg-2">
                <Row>
                  <Col xs={12} sm={12} md={5} lg={5} className="mt-2 mt-lg-0">
                    <Form.Group className="mb-3" controlId="parameterCode">
                      <Form.Label className="fw-bold">Assign New Schedule Date:   {(!scheduleDatePerCandidate && !assignNewDate) || (assignNewDate && !scheduleDatePerCandidate) ? (
                        <span className="text-danger fw-bold">*</span>
                      ) : null}</Form.Label>{" "}

                    </Form.Group>
                  </Col>
                  <Col xs={12} sm={12} md={7} lg={7} className="mt-2 mt-lg-0">
                    <FormControl
                      type="date"
                      value={assignNewDate}
                      onChange={(e) => {
                        setAssignNewDate(e.target.value);
                        if (e.target.value) {
                          setScheduleDatePerCandidate('');
                        }
                      }}
                      className="w-full"
                    // disabledDates={disabledDates}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            style={{ backgroundColor: "#1B5A90" }}
            onClick={() => {
              updateScheduleCandidate();
            }}
          >
            Update
          </Button>
          <Button variant="secondary" onClick={() => { setScheduleDatePerCandidate(""); setAssignNewDate("") }}>
            Clear
          </Button>
        </Modal.Footer>

      </Modal>
    </>
  );
};

export default Candidate;
