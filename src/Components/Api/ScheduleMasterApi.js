import ErrorHandler from "../ErrorHandler";
import { apiClient } from "../../apiClient";
import Cookies from 'js-cookie';
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

// Fetch all schedule masters
export const getAllScheduleMasterData = (active) => {
    const recruitId = localStorage.getItem("recruitId")
    const UserId = localStorage.getItem("userId");
    return apiClient({
        method: "get",
        url: `CandidateScheduleMaster/GetAll`.toString(),
        params: {
            UserId: UserId,
            RecruitId: recruitId,
            ScheduleDate: null,
            CandidateId: null,
            // Isactive: active ? "1" : "2",  
        },
    })
        .then((response) => {
            console.log("response all parameter masters", response.data.data);
            const token1 = response.data.outcome.tokens;
            Cookies.set("UserCredential", token1, { expires: 7 });
            return response.data.data;
        })
        .catch((error) => {
            if (error.response && error.response.data && error.response.data.outcome) {
                const token1 = error.response.data.outcome.tokens;
                Cookies.set("UserCredential", token1, { expires: 7 });
            }
            console.log(error);
            const errors = ErrorHandler(error);
            toast.error(errors)
            return [];
        });
};

export const updateSchedule = (data) => {
    const recruitId = localStorage.getItem("recruitId")
    return apiClient({
        method: "post",
        url: `CandidateScheduleMaster/Update`,
        data: data,
    })
        .then((response) => {
            console.log(response, "update Schedule");
            if (data.p_id) {
                toast.success("Schedule date updated successfully!");
            } else {
                toast.success("Schedule date added successfully!");
            }
            const token1 = response.data.outcome.tokens;
            Cookies.set("UserCredential", token1, { expires: 7 });
            return response.data;
        })
        .catch((error) => {
            if (error.response && error.response.data && error.response.data.outcome) {
                const token1 = error.response.data.outcome.tokens;
                Cookies.set("UserCredential", token1, { expires: 7 });
            }
            console.log(error);
            const errors = ErrorHandler(error);
            toast.error(errors);
            return null;
        });
};

export const getScheduleMasterData = (sId) => {
    const recruitId = localStorage.getItem("recruitId")
    const UserId = localStorage.getItem("userId");
    return apiClient({
        method: "get",
        url: `CandidateScheduleMaster/Get`.toString(),
        params: {
            UserId: UserId,
            Id: sId,
            RecruitId: recruitId
        },
    })
        .then((response) => {
            console.log("response get parameter masters", response.data.data);
            const token1 = response.data.outcome.tokens;
            Cookies.set("UserCredential", token1, { expires: 7 });
            return response.data.data;
        })
        .catch((error) => {
            if (error.response && error.response.data && error.response.data.outcome) {
                const token1 = error.response.data.outcome.tokens;
                Cookies.set("UserCredential", token1, { expires: 7 });
            }
            console.log(error);
            const errors = ErrorHandler(error);
            toast.error(errors)
            return [];
        });
};

export const getScheduleCandidateApi = (sId, cId) => {
    const recruitId = localStorage.getItem("recruitId")
    const UserId = localStorage.getItem("userId");
    return apiClient({
        method: "get",
        url: `CandidateScheduleMaster/GetScheduleCandidate`.toString(),
        params: {
            UserId: UserId,
            ScheduleID: sId,
            CandidateID: cId,
            RecruitId: recruitId
        },
    })
        .then((response) => {
            console.log("response get schedule candidate", response.data.data);
            const token1 = response.data.outcome.tokens;
            Cookies.set("UserCredential", token1, { expires: 7 });
            return response.data.data;
        })
        .catch((error) => {
            if (error.response && error.response.data && error.response.data.outcome) {
                const token1 = error.response.data.outcome.tokens;
                Cookies.set("UserCredential", token1, { expires: 7 });
            }
            console.log(error);
            const errors = ErrorHandler(error);
            toast.error(errors)
            return [];
        });
};

export const updateScheduleCandidateApi = (data) => {
    const recruitId = localStorage.getItem("recruitId")
    return apiClient({
      method: "post",
      url: `CandidateScheduleMaster/UpdateScheduleCandidate`,
      data: data,
    })
      .then((response) => {
        console.log(response, "update Schedule Candidate");
        if (data.p_id) {
          toast.success("Schedule date updated successfully!");
        } else {
          toast.success("Schedule date updated successfully!");
        }
        const token1 = response.data.outcome.tokens;
        Cookies.set("UserCredential", token1, { expires: 7 });
        return response.data;
      })
      .catch((error) => {
        if (error.response && error.response.data && error.response.data.outcome) {
          const token1 = error.response.data.outcome.tokens;
          Cookies.set("UserCredential", token1, { expires: 7 });
        }
        console.log(error);
        const errors = ErrorHandler(error);
        toast.error(errors);
        return null;
      });
  };