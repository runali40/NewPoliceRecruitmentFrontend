// candidateApi.js

import { apiClient } from "../../apiClient";
import ErrorHandler from "../ErrorHandler";
import Cookies from 'js-cookie';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


export const fetchCandidateDetails = async (params, setCandidateData) => {
    try {
        const response = await apiClient({
            method: "get",
            params,
            url: `Candidate/GetCandidate`,
        });
        const candidateData = response.data.data;
         setCandidateData(candidateData);
    //    return response.data.data;
        const token1 = response.data.outcome.tokens;
        Cookies.set("UserCredential", token1, { expires: 7 });
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

export const fetchAllSchedule = async (params, setCandidates) => {
    try {
        const response = await apiClient({
            method: "get",
            params,
            url: `CandidateScheduleMaster/CandidateScheduleInsert`,
        });
        // const candidates = response.data.data.map(candidate => ({
        //     value: candidate.CandidateID,
        //     label: `${candidate.ApplicationNo} - ${candidate.FirstName_English + " " + candidate.Surname_English + " " + candidate.Category + " " + candidate['Parallel Reservation']}`,
        // }));
        // setCandidates(candidates);
        const token1 = response.data.outcome.tokens;
        Cookies.set("UserCredential", token1, { expires: 7 });
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

export const fetchAllCandidates = async (params, setCandidates) => {
    try {
        const response = await apiClient({
            method: "get",
            params,
            url: `Candidate/GetAll`,
        });
        const candidates = response.data.data.map(candidate => ({
            value: candidate.CandidateID,
            label: `${candidate.ApplicationNo} - ${candidate.FirstName_English + " " + candidate.Surname_English  }`,
            // label: `${candidate.ApplicationNo} - ${candidate.FirstName_English + " " + candidate.Surname_English + " " + candidate.Category + " " + candidate['Parallel Reservation']}`,
        }));
        setCandidates(candidates);
        const token1 = response.data.outcome.tokens;
        Cookies.set("UserCredential", token1, { expires: 7 });
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

// export const fetchAllCandidatesFilter = async (params, setCandidates) => {
//     try {
//         const response = await apiClient({
//             method: "get",
//             params,
//             url: `Candidate/Canddattefilterdata`,
//         });
//         const candidates = response.data.data.map(candidate => ({
//             value: candidate.CandidateID,
//             label: `${candidate.ApplicationNo} - ${candidate.FirstName_English + " " + candidate.Surname_English + " " + candidate.Category + " " + candidate['Parallel Reservation']}`,
//         }));
//         setCandidates(candidates);
//         const token1 = response.data.outcome.tokens;
//         Cookies.set("UserCredential", token1, { expires: 7 });
//     } catch (error) {
//         if (error.response && error.response.data && error.response.data.outcome) {
//             const token1 = error.response.data.outcome.tokens;
//             Cookies.set("UserCredential", token1, { expires: 7 });
//         }
//         console.error(error);
//         const errors = ErrorHandler(error);
//         toast.error(errors);
//     }
// };

export const fetchAllRecruitments = async (params, setRecruitments) => {
    try {
        const response = await apiClient({
            method: "get",
            params,
            url: `Recruitment/GetAll`,
        });
        const recruitments = response.data.data.map(data => ({
            value: data.Id,
            label: `${data.place} / ${data.post}`,
        }));
        setRecruitments(recruitments);
        const token1 = response.data.outcome.tokens;
        Cookies.set("UserCredential", token1, { expires: 7 });
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

export const uploadFile = async (file, UserId, recruitId, /* setCandidates, */ setErrorMessage,
    setShowErrorModal) => {
    if (!file) {
        console.error("File field is required");
        return;
    }
    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", UserId);
    formData.append("RecruitId", recruitId);
    formData.append("Groundtestdata1", "")

    try {
        const response = await apiClient.post(`Candidate/uploadCandidateNew`, formData);
        if (response.status === 200) {
            const result = response.data;
            const token1 = result.outcome.tokens;
            Cookies.set("UserCredential", token1, { expires: 7 });
            toast.success("Candidates data uploaded successfully!")
           
        } else {
            console.error("Error:", response.statusText);
        }
    } catch (error) {
        if (error.response && error.response.data && error.response.data.outcome) {
            const token1 = error.response.data.outcome.tokens;
            Cookies.set("UserCredential", token1, { expires: 7 });
        }
        console.error("Error:", error);
        if (error.response.status === 500) {
            toast.error("Excel import failed: Please check and re-upload a valid excel file.")
        }
        else if (error.response.status === 400) {
            // toast.error("Please upload a file of type: .xls, .xlsx, .xlsm, .csv");
            toast.error("Please upload a file of type: .csv")
        }
        else if (error.response.status === 422) {
            toast.error("No data in the excel!")
        }
        //         else if (error.response.status === 409) {
        //             toast.error(`Duplicate Username found: user1; Duplicate Username found: user2; Duplicate Username found: user3; Duplicate Username found: user4; Duplicate Username found: user5; Duplicate Username found: user6; Duplicate Username found: user7; Duplicate Username found: user8; Duplicate Username found: user9; Duplicate Username found: user10; Duplicate Username found: user11; Duplicate Username found: user12; Duplicate Username found: user13; Duplicate Username found: user14; Duplicate Username found: user15; Duplicate Username found: user16; Duplicate Username found: user17; Duplicate Username found: user18; Duplicate Username found: user19; Duplicate Username found: user20; Duplicate Username found: user21; Duplicate Username found: user22; Duplicate Username found: user23; Duplicate Username found: user24; Duplicate Username found: user25; Duplicate Username found: user26; Duplicate Username found: user27; Duplicate Username found: user28; Duplicate Username found: user29; Duplicate Username found: user30; Duplicate Username found: user31; Duplicate Username found: user32; Duplicate Username found: user33; Duplicate Username found: user34; Duplicate Username found: user35; Duplicate Username found: user36; Duplicate Username found: user37; Duplicate Username found: user38; Duplicate Username found: user39; Duplicate Username found: user40; Duplicate Username found: user41; Duplicate Username found: user42; Duplicate Username found: user43; Duplicate Username found: user44; Duplicate Username found: user45; Duplicate Username found: user46; Duplicate Username found: user47; Duplicate Username found: user48; Duplicate Username found: user49; Duplicate Username found: user50; Duplicate Username found: user51; Duplicate Username found: user52; Duplicate Username found: user53; Duplicate Username found: user54; Duplicate Username found: user55; Duplicate Username found: user56; Duplicate Username found: user57; Duplicate Username found: user58; Duplicate Username found: user59; Duplicate Username found: user60; Duplicate Username found: user61; Duplicate Username found: user62; Duplicate Username found: user63; Duplicate Username found: user64; Duplicate Username found: user65; Duplicate Username found: user66; Duplicate Username found: user67; Duplicate Username found: user68; Duplicate Username found: user69; Duplicate Username found: user70; Duplicate Username found: user71; Duplicate Username found: user72; Duplicate Username found: user73; Duplicate Username found: user74; Duplicate Username found: user75; Duplicate Username found: user76; Duplicate Username found: user77; Duplicate Username found: user78; Duplicate Username found: user79; Duplicate Username found: user80; Duplicate Username found: user81; Duplicate Username found: user82; Duplicate Username found: user83; Duplicate Username found: user84; Duplicate Username found: user85; Duplicate Username found: user86; Duplicate Username found: user87; Duplicate Username found: user88; Duplicate Username found: user89; Duplicate Username found: user90; Duplicate Username found: user91; Duplicate Username found: user92; Duplicate Username found: user93; Duplicate Username found: user94; Duplicate Username found: user95; Duplicate Username found: user96; Duplicate Username found: user97; Duplicate Username found: user98; Duplicate Username found: user99; Duplicate Username found: user100
        // `)
        //         }
        else if (error.response.status === 409) {
            // toast.error("Record already exists!")
            console.log("126", error.response?.data)
            setErrorMessage(error.response?.data);
            setShowErrorModal(true);
        }
        else {
            const errors = ErrorHandler(error);
            toast.error(errors);
        }

    }
};

export const getAllCast = () => {
    const recruitId = localStorage.getItem("recruitId")
    const UserId = localStorage.getItem("userId")
    return apiClient({
        method: "get",
        url: (`ParameterValueMaster/GetAll`).toString(),
        params: {
            UserId: UserId,
            pv_parameterid: "562f4f41-1127-4510-968f-08365867759f",
            RecruitId: recruitId,
            pv_isactive: "1"
        },
    })
        .then((response) => {
            // console.log("response all cast", response.data.data);
            const token1 = response.data.outcome.tokens;
            // Cookies.set("UserCredential", token1, { expires: 7 });
            Cookies.set("UserCredential", token1, { expires: 7 });
            return response.data.data;
        })
        .catch((error) => {
            if (error.response && error.response.data && error.response.data.outcome) {
                const token1 = error.response.data.outcome.tokens;
                Cookies.set("UserCredential", token1, { expires: 7 });
            }
            console.log(error);
            // const errors = ErrorHandler(error);
            // toast.error(errors)
            return [];
        });
};