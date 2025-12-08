// import {apiClient }from "../../apiClient";
import { apiClient } from "../../apiClient";
import ErrorHandler from "../../Components/ErrorHandler";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Get all tagger data
export const getAllTagger = async () => {
  const UserId = localStorage.getItem("userId");
  const recruitId = localStorage.getItem("recruitId");
  const params = {
    userId: UserId,
    RecruitId: recruitId,
  };

  try {
    const response = await apiClient({
      method: "get",
      params: params,
      url: `RFIDChestNoMapping/Get`.toString(),
    });
    console.log("get all tagger", response.data.data);
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

// Add a new tagger
export const addTagger = async (rfid, chestNo, mappingId) => {
  const UserId = localStorage.getItem("userId");
  const recruitId = localStorage.getItem("recruitId");
  if (rfid === "" || chestNo === "") {
    toast.warning("Please enter the details!");
  } else {
    const data = {
      rfid: rfid,
      userId: UserId,
      chestNo: chestNo,
      RecruitId: recruitId,
    };
    if (mappingId !== null && mappingId !== "") {
      data.id = mappingId;
    }
    try {
      const response = await apiClient({
        method: "post",
        data: data,
        url: `RFIDChestNoMapping/Insert`,
      });
      console.log("add tagger", response.data.data);
      const token1 = response.data.outcome.tokens;
      Cookies.set("UserCredential", token1, { expires: 7 });
      if (mappingId !== null && mappingId !== "") {
        toast.success("RFID updated successfully!");
      } else {
        toast.success("RFID added successfully!");
      }
      // toast.success("RFID Added Successfully!");
      return response.data.data;
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.outcome
      ) {
        const token1 = error.response.data.outcome.tokens;
        Cookies.set("UserCredential", token1, { expires: 7 });
      }
      console.error(error);
      const errors = ErrorHandler(error);
      if (error.response.status === 400) {
        toast.error("Chest No is not present!")
      }
      else if (error.response.status === 409) {
        toast.error("Record Already Exits!")
      }
      else {
        toast.error("Something went wrong!")
      }
    }
  }
};

export const deleteTagger = async (id) => {
  const UserId = localStorage.getItem("userId");
  const recruitId = localStorage.getItem("recruitId");
  const data = {
    Id: id,
    userId: UserId,
    RecruitId: recruitId,
  };

  try {
    const response = await apiClient({
      method: "post",
      data: data,
      url: `RFIDChestNoMapping/Delete`,
    });
    console.log("add tagger", response.data.data);
    const token1 = response.data.outcome.tokens;
    Cookies.set("UserCredential", token1, { expires: 7 });
    toast.success("RFID Deleted Successfully!");
    return response.data.data;
  } catch (error) {
    if (
      error.response &&
      error.response.data &&
      error.response.data.outcome
    ) {
      const token1 = error.response.data.outcome.tokens;
      Cookies.set("UserCredential", token1, { expires: 7 });
    }
    console.error(error);
    const errors = ErrorHandler(error);
    toast.error(errors);
  }
}


export const InsertRIFDRunning = async (eventId) => {
  const UserId = localStorage.getItem("userId");
  const recruitId = localStorage.getItem("recruitId");
  const data = {
    userId: UserId,
    recruitId: recruitId,
    eventId: eventId,
  };

  try {
    const response = await apiClient({
      method: "post",
      data: data,
      url: `RFIDChestNoMapping/InsertRIFDRunning`,
    });
    console.log("add rfid data", response.data.data);
    const token1 = response.data.outcome.tokens;
    Cookies.set("UserCredential", token1, { expires: 7 });
    toast.success("RFID Added Successfully!");
    return response.data.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.outcome) {
      const token1 = error.response.data.outcome.tokens;
      Cookies.set("UserCredential", token1, { expires: 7 });
    }
    console.error(error);
    if (error.response.status === 400) {
      toast.error("Data not available in RFID portal")
    }
    else {
      const errors = ErrorHandler(error);
      toast.error(errors);
    }

  }
};
