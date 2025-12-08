import {apiClient }from "../../apiClient";
import ErrorHandler from "../ErrorHandler";
import Cookies from 'js-cookie'; 
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export const getAllCandidates = async () => {
  const recruitId = localStorage.getItem("recruitId");
  const UserId = localStorage.getItem("userId");
  try {
    const response = await apiClient({
      method: "get",
      url: `Candidate/GetAll`.toString(),
      params: {
        UserId: UserId,
        RecruitId: recruitId,
        Groundtestdata1:""
      },
    });
    console.log("get all candidates", response.data.data);
    const token1 = response.data.outcome.tokens;
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

export const getAdmissionCard = async (candidateId) => {
  const recruitId = localStorage.getItem("recruitId");
  const UserId = localStorage.getItem("userId");
  try {
    const response = await apiClient({
      method: "get",
      url: `AdmissionCard/GetCard`.toString(),
      params: {
        UserId: UserId,
        RecruitId: recruitId,
        CandidateID: candidateId,
        Groundtestdata1:""
      },
    });
    console.log(response.data.data, "get admission card");
    const token1 = response.data.outcome.tokens;
    Cookies.set("UserCredential", token1, { expires: 7 });
    return response.data.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.outcome) {
      const token1 = error.response.data.outcome.tokens;
      Cookies.set("UserCredential", token1, { expires: 7 });
  }
    console.error("Error fetching data:", error);
    const errors = ErrorHandler(error);
    toast.error(errors);
  }
};
