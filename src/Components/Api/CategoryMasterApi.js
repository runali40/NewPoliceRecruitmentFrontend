// api.js
import { apiClient } from "../../apiClient";
import ErrorHandler from "../ErrorHandler";
import Cookies from 'js-cookie';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


// Fetch all role masters
export const getAllCategoryMasterData = (active) => {
  const recruitId = localStorage.getItem("recruitId");
  const UserId = localStorage.getItem("userId");
  return apiClient({
    method: "get",
    url: (`CategoryDocPrivilege/GetAll`).toString(),
    params: {
      UserId: UserId,
      RecruitId: recruitId,
      Isactive: active ? "1" : "2"
    },
  })
    .then((response) => {
      console.log("response all category masters", response.data.data);
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

// Delete role master by ID
export const deleteCategoryMaster = (dId) => {
  const recruitId = localStorage.getItem("recruitId");
  const UserId = localStorage.getItem("userId");
  const data = {
    UserId: UserId,
    Id: dId,
    RecruitId: recruitId,
  };
  return apiClient({
    method: "post",
    url: (`CategoryDocPrivilege/DeleteCategory`),
    data: data,
  })
    .then((response) => {
      console.log("response", response);
      toast.success("Document deleted successfully!")
      const token1 = response.data.outcome.tokens;
      Cookies.set("UserCredential", token1, { expires: 7 });
      return response.data; // Optionally return data if needed
    })
    .catch((error) => {
      if (error.response && error.response.data && error.response.data.outcome) {
        const token1 = error.response.data.outcome.tokens;
        Cookies.set("UserCredential", token1, { expires: 7 });
      }
      console.log(error);
      if (error.response.status === 423) {
        toast.error("Document mapped to a candidate!")
      }
      else {
        const errors = ErrorHandler(error);
        toast.error(errors)
        throw error;
      }
      // Rethrow the error to handle it in the component
    });
};
