// api.js
import Storage from "../../Storage";
import {apiClient }from "../../apiClient";
import ErrorHandler from "../ErrorHandler";
import Cookies from 'js-cookie'; 
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

// Fetch all role masters
export const getAllDutyMasterData = (active) => {
  const recruitId = localStorage.getItem("recruitId");
  const UserId = localStorage.getItem("userId");
  return apiClient({
    method: "get",
    url: (`DutyMaster/GetAll`).toString(),
    params: {
      UserId: UserId,
      d_recruitid: recruitId,
      d_isactive : active ? "1" : "2"
      // d_isactive :"2"
    },
  })
    .then((response) => {
      console.log("response all duty masters", response.data.data);
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
export const deleteDutyMaster = (dId) => {
  const recruitId = localStorage.getItem("recruitId");
  const UserId = localStorage.getItem("userId");
  const data = {
    UserId: UserId,
    d_id: dId,
    d_recruitid: recruitId,
  };
  return apiClient({
    method: "post",
    url: (`DutyMaster/DeleteDuty`),
    data: data,
  })
    .then((response) => {
      console.log("response", response);
      toast.success("Duty deleted successfully!")
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
      if(error.response.status === 423){
        toast.error("Duty already mapped to User!")
      }
      else{
        toast.error(errors)
        throw error; // Rethrow the error to handle it in the component
      }  
    });
};
