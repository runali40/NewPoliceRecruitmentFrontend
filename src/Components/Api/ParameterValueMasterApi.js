import ErrorHandler from "../ErrorHandler";
import Storage from "../../Storage";
import {apiClient }from "../../apiClient";
import Cookies from 'js-cookie';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

// Fetch all role masters
export const getAllParameterValueMasterData = (pId, active, toggleActive) => {
  // const recruitId = localStorage.getItem("recruitId")
  const UserId = localStorage.getItem("userId");
  return apiClient({
    method: "get",
    url: `ParameterValueMaster/GetAll`.toString(),
    params: {
      UserId: UserId,
      pv_parameterid: pId,
      pv_isactive: toggleActive ? "1" : "2",
    },
  })
    .then((response) => {
      console.log("response all parameter value masters", response.data.data);
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
      toast.error(errors);
      return [];
    });
};

export const addParameterValue = (data) => {
  // const recruitId = localStorage.getItem("recruitId");
  
  return apiClient({
    method: "post",
    url: `ParameterValueMaster`,
    data: data,
  })
    .then((response) => {
      console.log(response, "add Parameter");
      const token1 = response.data.outcome.tokens;
      Cookies.set("UserCredential", token1, { expires: 7 });
      toast.success(
        data.pv_id
          ? "Parameter value updated successfully!"
          : "Parameter value added successfully!"
      );
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

export const getParameterValueMasterData = (pvId) => {
  // const recruitId = localStorage.getItem("recruitId");
  const UserId = localStorage.getItem("userId");
  return apiClient({
    method: "get",
    url: `ParameterValueMaster/Get`.toString(),
    params: {
      UserId: UserId,
      pv_id: pvId,
    },
  })
    .then((response) => {
      console.log("response get parameter value masters", response.data.data);
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
      toast.error(errors);
      return [];
    });
};

export const deleteParameterValue = (pvId) => {
  // const recruitId = localStorage.getItem("recruitId");
  const UserId = localStorage.getItem("userId");
  const data = {
    userId: UserId,
    pv_id: pvId,
  };
  return apiClient({
    method: "post",
    url: `parameterValueMaster/Delete`,
    data: data,
  })
    .then((response) => {
      console.log("response", response);
      const token1 = response.data.outcome.tokens;
      Cookies.set("UserCredential", token1, { expires: 7 });
      toast.success("Parameter Value deleted successfully!");
      return response.data;
    })
    .catch((error) => {
      if (error.response && error.response.data && error.response.data.outcome) {
        const token1 = error.response.data.outcome.tokens;
        Cookies.set("UserCredential", token1, { expires: 7 });
    }
      console.log(error);
      let errors = ErrorHandler(error);
      toast.error(errors);
      return null;
    });
};
