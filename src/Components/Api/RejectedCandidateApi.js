import ErrorHandler from "../ErrorHandler";
import { apiClient } from "../../apiClient";
import Cookies from 'js-cookie';
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

// Fetch all schedule masters
export const getAllRejectedData = () => {
  const recruitId = localStorage.getItem("recruitId")
  const UserId = localStorage.getItem("userId");
  return apiClient({
    method: "get",
    url: `Appeal/GetAll`.toString(),
    params: {
      UserId: UserId,
      RecruitId: recruitId,
      CandidateID: null,
    },
  })
    .then((response) => {
      console.log("response all rejected log", response.data.data);
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

// export const updateRejected = (data) => {
//   const recruitId = localStorage.getItem("recruitId")
//   return apiClient({
//     method: "post",
//     url: `Appeal/Insert`,
//     data: data,
//   })
//     .then((response) => {
//       console.log(response, "update Schedule");
//       if (data.p_id) {
//         toast.success("Appeal approved successfully!");
//       } else {
//         toast.success("Appeal approved successfully!");
//       }
//       const token1 = response.data.outcome.tokens;
//       Cookies.set("UserCredential", token1, { expires: 7 });
//       return response.data;
//     })
//     .catch((error) => {
//       if (error.response && error.response.data && error.response.data.outcome) {
//         const token1 = error.response.data.outcome.tokens;
//         Cookies.set("UserCredential", token1, { expires: 7 });
//       }
//       console.log(error);
//       const errors = ErrorHandler(error);
//       toast.error(errors);
//       return null;
//     });
// };
export const updateRejected = (data) => {
  return apiClient({
    method: "post",
    url: `Appeal/Insert`,
    data: data,
  })
    .then((response) => {
      console.log(response, "update Schedule");

      // Corrected toast messages based on status
      if (data.status === "Rejected" && data.remark) {
        toast.success("Appeal rejected successfully!");
      } else {
        toast.success("Appeal approved successfully!");
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
export const getRejectedData = (cId) => {
  const recruitId = localStorage.getItem("recruitId")
  const UserId = localStorage.getItem("userId");
  return apiClient({
    method: "get",
    url: `Appeal/Get`.toString(),
    params: {
      UserId: UserId,
      CandidateID: cId,
      RecruitId: recruitId
    },
  })
    .then((response) => {
      console.log("response get rejected candidate", response.data.data);
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

