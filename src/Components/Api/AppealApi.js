import moment from "moment/moment";
import { apiClient } from "../../apiClient";
import ErrorHandler from "../ErrorHandler";
import Cookies from 'js-cookie';
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


// export const submitAppeal = async (data, candidateId) => {
//   const recruitId = localStorage.getItem("recruitId");
//   const UserId = localStorage.getItem("userId");
//   if (data.ApprovedBy.trim() === "" || data.Date === "") {
//     toast.warning("Please fill all the required details!");
//   }
//   else{
//     const body = {
//       CandidateID: candidateId,
//       UserId: UserId,
//       RecruitId: recruitId,
//       ApprovedBy: data.ApprovedBy,
//       Date: moment(data.Date).format("YYYY-MM-DD"),
//       Remark: data.Remark,
//     };

//     try {
//       const response = await apiClient({
//         method: "post",
//         url: `Appeal/Insert`,
//         data: body,
//       });
//       const token1 = response.data.outcome.tokens;
//       console.log(response.data.outcome.tokens, "26")
//       Cookies.set("UserCredential", token1, { expires: 7 });
//       return response.data;
//     } catch (error) {
//       if (error.response && error.response.data && error.response.data.outcome) {
//         const token1 = error.response.data.outcome.tokens;
//         toast.success("Appeal added successfully!");
//         Cookies.set("UserCredential", token1, { expires: 7 });
//     }
//       console.error("Error submitting appeal:", error);
//       const errors = ErrorHandler(error);
//       toast.error(errors);
//       throw error;
//     }
//   }
// };
export const submitAppeal = async (data, candId, approvedData, eventName) => {
  const recruitId = localStorage.getItem("recruitId");
  const UserId = localStorage.getItem("userId");

  // Check if ApprovedBy or Date is empty
  if (data.ApprovedBy.trim() === null || data.Date === null) {
    toast.warning("Please fill in all the required details!");
    return; // Return early to prevent the API call
  }

  const body = {
    CandidateID: candId,
    UserId: UserId,
    RecruitId: recruitId,
    ApprovedBy: data.ApprovedBy,
    Date: moment(data.Date).format("YYYY-MM-DD"),
    Remark: data.Remark,
    status: approvedData,
    Stage: eventName
  };

  try {
    const response = await apiClient({
      method: "post",
      url: `Appeal/Insert`,
      data: body,
    });

    const token1 = response.data.outcome.tokens;
    Cookies.set("UserCredential", token1, { expires: 7 });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.outcome) {
      const token1 = error.response.data.outcome.tokens;
      toast.success("Appeal added successfully!");
      Cookies.set("UserCredential", token1, { expires: 7 });
    }

    console.error("Error submitting appeal:", error);
    const errors = ErrorHandler(error);
    toast.error(errors);
    throw error;
  }
};

export const getAllAppeals = async (candidateId) => {
  const recruitId = localStorage.getItem("recruitId");
  const UserId = localStorage.getItem("userId");
  try {
    const response = await apiClient({
      method: "get",
      url: `Appeal/GetAppeal`,
      params: {
        UserId: UserId,
        RecruitId: recruitId,
        CandidateID: candidateId,
      },
    });
    const token1 = response.data.outcome.tokens;
    console.log(response.data.outcome.tokens, "55")
    Cookies.set("UserCredential", token1, { expires: 7 });
    return response.data.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.outcome) {
      const token1 = error.response.data.outcome.tokens;
      Cookies.set("UserCredential", token1, { expires: 7 });
    }
    console.error("Error fetching appeals:", error);
    const errors = ErrorHandler(error);
    toast.error(errors);
    throw error;
  }
};
