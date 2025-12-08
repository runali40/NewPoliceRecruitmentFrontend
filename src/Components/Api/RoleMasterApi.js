// api.js
import {apiClient }from "../../apiClient";
import ErrorHandler from "../ErrorHandler";
import Cookies from 'js-cookie'; 
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

// Fetch all role masters
export const getAllRoleMasterData = (active) => {
  const UserId = localStorage.getItem('userId');
  const recruitId = localStorage.getItem("recruitId")
  return apiClient({
    method: "get",
    url: (`RoleMaster/GetAll`).toString(),
    params: {
      UserId: UserId,
      r_recruitid: recruitId,
      r_isactive: active ? "1" : "2",  
    },
  })
    .then((response) => {
      console.log("response all role masters", response.data.data);
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
export const deleteRoleMaster = (rId) => {
  const recruitId = localStorage.getItem("recruitId");
  const UserId = localStorage.getItem("userId");
  const data = {
    UserId: UserId,
    r_id: rId,
    r_recruitid: recruitId,
  };
  return apiClient({
    method: "post",
    url: (`RoleMaster/DeleteRole`),
    data: data,
  })
    .then((response) => {
      console.log("response", response);
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
      const errors = ErrorHandler(error);
      toast.error(errors)
      throw error; // Rethrow the error to handle it in the component
    });
};
