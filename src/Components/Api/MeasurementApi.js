// measurementApi.js

import { apiClient } from "../../apiClient";
import ErrorHandler from "../ErrorHandler";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const getHistory = (params, setAllHistory, setLength, setToken) => {
  apiClient({
    method: "get",
    url: `heiCheMeasurement/GetHistory`,
    params: params,
  })
    .then((response) => {
      console.log("get history", response.data.data);
      setAllHistory(response.data.data);
      setLength(response.data.data.length);
      setToken(response.data.outcome.tokens);
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
    });
};

export const addChestHeight = (
  data,
  navigate,
  candidateId,
  fullNameEnglish
) => {
  apiClient({
    method: "post",
    url: `heiCheMeasurement/Insert`,
    data: data,
  })
    .then((response) => {
      console.log("add height chest", response.data.data);
      toast.success("Height and Chest Measurement added Successfully!")
      const token1 = response.data.outcome.tokens;
      Cookies.set("UserCredential", token1, { expires: 7 });
      navigate(`/candidate/${candidateId}`, { state: { fullNameEnglish } });
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
    });
};
