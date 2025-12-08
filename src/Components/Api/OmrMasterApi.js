import { apiClient } from "../../apiClient";
import Cookies from 'js-cookie';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import ErrorHandler from "../../Components/ErrorHandler";

export const getAllData = (setId) => {
  console.log(setId.value, "setID")
  const UserId = localStorage.getItem('userId');
  const recruitId = localStorage.getItem("recruitId")
  return apiClient({
    method: "get",
    url: (`OmrMaster/GetAll`).toString(),
    params: {
      userid: UserId,
      recConfId: recruitId,
      questionSet: setId.value
    },
  })
    .then((response) => {
      console.log("response all users", response.data.data);
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
      // console.log(error);
      let errors = ErrorHandler(error);
      toast.error(errors);
      return [];
    });
};

export const AddOmrMaster = (data) => {
  const recruitId = localStorage.getItem("recruitId")
  return apiClient({
    method: "post",
    url: `OmrMaster/Insert`,
    data: data,
  })
    .then((response) => {
      console.log(response, "add omr Master");
      // alert(
      //   data.p_id
      //     ? "Parameter updated successfully!"
      //     : "Parameter added successfully!"
      // );
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
export const getAllSet = () => {
  const UserId = localStorage.getItem("userId");
  const recruitId = localStorage.getItem("recruitId");
  return apiClient({
    method: "get",
    url: `ParameterValueMaster/GetAll`.toString(),
    params: {
      UserId: UserId,
      um_recruitid: recruitId,
      pv_parameterid: "289ff1e0-51f9-4b77-9f8e-924de92ba8ed",
      pv_isactive: "1",
    },
  })
    .then((response) => {
      console.log("response all set", response.data.data);
      const token1 = response.data.outcome.tokens;
      Cookies.set("UserCredential", token1, { expires: 7 });
      return response.data.data.map((item) => ({
        value: item.pv_id,
        label: item.pv_parametervalue,
      }));
    })
    .catch((error) => {
      if (
        error.response &&
        error.response.data &&
        error.response.data.outcome
      ) {
        const token1 = error.response.data.outcome.tokens;
        Cookies.set("UserCredential", token1, { expires: 7 });
      }
      console.log(error);
      const errors = ErrorHandler(error);
      toast.error(errors);
      return [];
    });
};