import ErrorHandler from "../../Components/ErrorHandler";
import { apiClient } from "../../apiClient";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Fetch all users
export const getAllData = (toggleActive) => {
  const UserId = localStorage.getItem("userId");
  const recruitId = localStorage.getItem("recruitId");
  return apiClient({
    method: "get",
    url: `UserMaster/GetAll`.toString(),
    params: {
      UserId: UserId,
      um_recruitid: recruitId,
      um_isactive: toggleActive ? "1" : "2",
    
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
      if (
        error.response &&
        error.response.data &&
        error.response.data.outcome
      ) {
        const token1 = error.response.data.outcome.tokens;
        Cookies.set("UserCredential", token1, { expires: 7 });
      }
      // console.log(error);
      let errors = ErrorHandler(error);
      toast.error(errors);
      return [];
    });
};

// Fetch all roles
export const getAllRole = (toggleActive) => {
  const UserId = localStorage.getItem("userId");
  const recruitId = localStorage.getItem("recruitId");
  return apiClient({
    method: "get",
    url: `RoleMaster/GetAll`.toString(),
    params: {
      UserId: UserId,
      um_recruitid: recruitId,
      r_isactive: toggleActive ? "1" : "2",
    },
  })
    .then((response) => {
      console.log("response all role", response.data.data);
      const token1 = response.data.outcome.tokens;
      Cookies.set("UserCredential", token1, { expires: 7 });
      return response.data.data.map((item) => ({
        value: item.r_id,
        label: item.r_rolename,
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

export const getAllDuty = (toggleActive) => {
  const UserId = localStorage.getItem("userId");
  const recruitId = localStorage.getItem("recruitId");
  return apiClient({
    method: "get",
    url: `DutyMaster/GetAll`.toString(),
    params: {
      UserId: UserId,
      d_recruitid: recruitId,
      d_isactive: toggleActive ? "1" : "2",
    },
  })
    .then((response) => {
      console.log("response all duty", response.data.data);
      const token1 = response.data.outcome.tokens;
      Cookies.set("UserCredential", token1, { expires: 7 });
      return response.data.data.map((item) => ({
        value: item.d_id,
        label: item.d_dutyname,
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

// Add or update user
export const addUser = (data) => {
  return apiClient({
    method: "post",
    url: `UserMaster`,
    data: data,
  })
    .then((response) => {
      console.log(response, "add User");
      const token1 = response.data.outcome.tokens;
      Cookies.set("UserCredential", token1, { expires: 7 });
      toast.success(
        data.um_id ? "User updated successfully!" : "User added successfully!"
      );
      return response.data;
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
      // alert("Something went wrong");
      let errors = ErrorHandler(error);
      toast.error(errors);
      return null;
    });
};

// Fetch a single user
export const getUser = (umId) => {
  const UserId = localStorage.getItem("userId");
  const recruitId = localStorage.getItem("recruitId");
  return apiClient({
    method: "get",
    url: `UserMaster/Get`.toString(),
    params: {
      UserId: UserId,
      um_recruitid: recruitId,
      um_id: umId,
    },
  })
    .then((response) => {
      console.log(response);
      const token1 = response.data.outcome.tokens;
      Cookies.set("UserCredential", token1, { expires: 7 });
      return response.data.data;
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
      return null;
    });
};

// Delete user
export const deleteUser = (umId) => {
  const UserId = localStorage.getItem("userId");
  const recruitId = localStorage.getItem("recruitId");
  const data = {
    userId: UserId,
    um_recruitid: recruitId,
    um_id: umId,
  };
  return apiClient({
    method: "post",
    url: `UserMaster/Delete`,
    data: data,
  })
    .then((response) => {
      console.log("response", response);
      const token1 = response.data.outcome.tokens;
      Cookies.set("UserCredential", token1, { expires: 7 });
      toast.success("User deleted successfully!");
      return response.data;
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
      let errors = ErrorHandler(error);
      if(error.response.status === 423){
        toast.error("Data already mapped!")
      }
      else{
        toast.error(errors);
        return null;
      }
    });
};

export const getAllPost = (toggleActive) => {
  const UserId = localStorage.getItem("userId");
  const recruitId = localStorage.getItem("recruitId");
  return apiClient({
    method: "get",
    url: `ParameterValueMaster/GetAll`.toString(),
    params: {
      UserId: UserId,
      um_recruitid: recruitId,
      pv_parameterid: "5577f110-dafe-45bd-88b3-c665417af25a",
      pv_isactive: toggleActive ? "1" : "2",
    },
  })
    .then((response) => {
      console.log("response all post", response.data.data);
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
