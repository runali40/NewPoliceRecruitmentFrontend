import ErrorHandler from "../ErrorHandler";
import { apiClient } from "../../apiClient";
import Cookies from 'js-cookie';
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


// Fetch all role masters
export const getAllParameterMasterData = (active, toggleActive) => {
  const recruitId = localStorage.getItem("recruitId")
  const UserId = localStorage.getItem("userId");
  return apiClient({
    method: "get",
    url: `ParameterMaster/GetAll`.toString(),
    params: {
      UserId: UserId,
      p_isactive: toggleActive ? "1" : "2",
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

export const addParameter = (data) => {
  const recruitId = localStorage.getItem("recruitId")
  return apiClient({
    method: "post",
    url: `ParameterMaster`,
    data: data,
  })
    .then((response) => {
      console.log(response, "add Parameter");
      if (data.p_id) {
        toast.success("Parameter updated successfully!");
      } else {
        toast.success("Parameter added successfully!");
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

export const getParameterMasterData = (pId) => {
  const recruitId = localStorage.getItem("recruitId")
  const UserId = localStorage.getItem("userId");
  return apiClient({
    method: "get",
    url: `ParameterMaster/Get`.toString(),
    params: {
      UserId: UserId,
      p_id: pId,
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
export const deleteParameter = (pId) => {
  const recruitId = localStorage.getItem("recruitId")
  const UserId = localStorage.getItem("userId");
  const data = {
    userId: UserId,
    p_id: pId,
  };
  return apiClient({
    method: "post",
    url: `parameterMaster/Delete`,
    data: data,
  })
    .then((response) => {
      console.log("response", response);
      const token1 = response.data.outcome.tokens;
      Cookies.set("UserCredential", token1, { expires: 7 });
      toast.success("Parameter deleted successfully!");
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
