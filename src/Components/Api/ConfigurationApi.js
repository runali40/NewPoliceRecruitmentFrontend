import ErrorHandler from "../../Components/ErrorHandler";
import { apiClient } from "../../apiClient";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Fetch all users
export const getAllData = (toggleActive) => {
  const recruitId = localStorage.getItem("recruitId");
  const userId = localStorage.getItem("userId");
  return apiClient({
    method: "get",
    url: `Recruitment/GetAll`.toString(),
    params: {
      UserId: userId,
      RecruitId: recruitId,
    },
  })
    .then((response) => {
      console.log("response all recruitmentconfig", response.data.data);
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
      return [];
    });
};
// Add or update user
export const addConfig = (data) => {
  if (data === "") {
    toast.success("Please fill the details!");
  } else {
    return apiClient({
      method: "post",
      url: `Recruitment/Insert`,
      data: data,
    })
      .then((response) => {
        console.log(response, "add Config");
        const token1 = response.data.outcome.tokens;
        Cookies.set("UserCredential", token1, { expires: 7 });
        if (data.id) {
          toast.success("Configuration updated successfully!");
        }

        console.log(response.data.outcome.tokens, "tokens");
        console.log(response.data.data[0].UserNamee);
        return response.data;
      })
      .catch((error) => {
        if (
          error.response &&
          error.response.data &&
          error.response.data.outcome
        ) {
          const token1 = error.response.data.outcome.tokens;
          // toast.success("Recruitment added successfully!");
          Cookies.set("UserCredential", token1, { expires: 7 });
        }
        console.log(error);
        const errors = ErrorHandler(error);
        toast.error(errors);
        return null;
      });
  }
};

// Fetch a single user
export const getConfig = (cId) => {
  const recruitId = localStorage.getItem("recruitId");
  const UserId = localStorage.getItem("userId");
  return apiClient({
    method: "get",
    url: `Recruitment/Get`.toString(),
    params: {
      UserId: UserId,
      Id: cId,
      RecruitId: recruitId,
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

export const deleteConfig = (cId) => {
  const recruitId = localStorage.getItem("recruitId");
  const UserId = localStorage.getItem("userId");
  const data = {
    UserId: UserId,
    id: cId,
    RecruitId: recruitId,
  };
  return apiClient({
    method: "post",
    url: "Recruitment/Delete",
    data: data,
  })
    .then((response) => {
      console.log(response, "response");
      const token1 = response.data.outcome.tokens;
      Cookies.set("UserCredential", token1, { expires: 7 });
      toast.success("Configuration deleted successfully!");
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
      if (error.response.status === 423) {
        toast.error("Recruitment already mapped!")
      }
      else {
        let errors = ErrorHandler(error);
        toast.error(errors);
        return null;
      }

    });
};

export const getAllRecruitData = (
  rows,
  eventUnit,
  eventId,
  eventUnitId,
  categoryId
) => {
  console.log(eventId, "event id");
  const recruitId = localStorage.getItem("recruitId");
  const UserId = localStorage.getItem("userId");
  return apiClient({
    method: "get",
    url: `RecruitmentEvent/GetAllRecruit`.toString(),
    params: {
      UserId: UserId,
      recConfId: recruitId,
      eventUnit: eventUnitId,
      RecruitId: recruitId,
      Id: eventId,
      categoryId: "null",
      recruitmentConfig: rows,
    },
  })
    .then((response) => {
      console.log("response all recruitment config event", response.data.data);
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
      // const errors = ErrorHandler(error);
      // toast.error(errors);
      // return [];
    });
};
export const getAllEvent = (eventUnit) => {
  const recruitId = localStorage.getItem("recruitId");
  const UserId = localStorage.getItem("userId");
  return apiClient({
    method: "get",
    url: `RecruitmentEvent/GetAllEvent`.toString(),
    params: {
      UserId: UserId,
      recConfId: recruitId,
      eventUnit: eventUnit,
      recruitid: recruitId,
      categoryid: "null",
    },
  })
    .then((response) => {
      console.log("response all recruitment config event", response.data.data);
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
      const errors = ErrorHandler(error);
      toast.error(errors);
      return [];
    });
};
export const addConfigEvent = (data) => {
  return apiClient({
    method: "post",
    url: `RecruitmentEvent/Insert`,
    data: data,
  })
    .then((response) => {
      console.log(response, "add Config event");
      const token1 = response.data.outcome.tokens;
      Cookies.set("UserCredential", token1, { expires: 7 });
      // alert(
      //   data.id ? "Config updated successfully!" : "Config added successfully!"
      // );
      toast.success("Configuration event added successfully!");
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
      const errors = ErrorHandler(error);
      toast.error(errors);
      return null;
    });
};

// export const deleteEvent = (eventId) => {
//   const recruitId = localStorage.getItem("recruitId");
//   const UserId = localStorage.getItem("userId");
//   const data = {
//     UserId: UserId,
//     id: eventId,
//     RecruitId: recruitId,
//     RecruitmentConfig: [],
//   };
//   return apiClient({
//     method: "post",
//     data: data,
//     url: `RecruitmentEvent/Delete`,
//   })
//     .then((response) => {
//       console.log(response, "response");
//       const token1 = response.data.outcome.tokens;
//       Cookies.set("UserCredential", token1, { expires: 7 });
//       alert("Event deleted successfully!");
//       return response.data;
//     })
//     .catch((error) => {
//       if (error.response && error.response.data && error.response.data.outcome) {
//         const token1 = error.response.data.outcome.tokens;
//         Cookies.set("UserCredential", token1, { expires: 7 });
//     }
//       let errors = ErrorHandler(error);
//       toast.error(errors);
//       return null;
//     });
// };

export const deleteEvent = (eventId) => {
  const recruitId = localStorage.getItem("recruitId");
  const UserId = localStorage.getItem("userId");
  const data = {
    UserId: UserId,
    Id: eventId,
    RecruitId: recruitId,
    recConfId: recruitId,
    RecruitmentConfig: [],
  };
  return apiClient({
    method: "post",
    data: data,
    url: `RecruitmentEvent/DeleteEvent`,
  })
    .then((response) => {
      console.log(response, "response");
      const token1 = response.data.outcome.tokens;
      Cookies.set("UserCredential", token1, { expires: 7 });
      toast.success("Event deleted successfully!");
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
      if (error.response.status === 423) {
        toast.error("Event already mapped!")
      }
      else {
        let errors = ErrorHandler(error);
        toast.error(errors);
        return null;
      }
    });
};
export const getAllEventUnit = () => {
  const recruitId = localStorage.getItem("recruitId");
  const UserId = localStorage.getItem("userId");
  return apiClient({
    method: "get",
    url: `ParameterValueMaster/GetAll`.toString(),
    params: {
      UserId: UserId,
      // pv_parameterid: "9976176c-a189-4f9e-9f15-d3ad4328a40f",
      pv_parameterid: "00cfca16-148d-4e3c-a182-9b964a35a887",
      RecruitId: recruitId,
      pv_isactive: "1",
    },
  })
    .then((response) => {
      console.log("response all event unit", response.data.data);
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
      return [];
    });
};

export const getAllGender = () => {
  const recruitId = localStorage.getItem("recruitId");
  const UserId = localStorage.getItem("userId");
  return apiClient({
    method: "get",
    url: `ParameterValueMaster/GetAll`.toString(),
    params: {
      UserId: UserId,
      pv_parameterid: "a12076dd-f5e5-482a-9672-78995a0924a6",
      RecruitId: recruitId,
      pv_isactive: "1",
    },
  })
    .then((response) => {
      console.log("response all gender", response.data.data);
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
      return [];
    });
};
export const getAllGenderCategory = () => {
  const recruitId = localStorage.getItem("recruitId");
  const UserId = localStorage.getItem("userId");
  return apiClient({
    method: "get",
    url: `ParameterValueMaster/GetAll`.toString(),
    params: {
      UserId: UserId,
      pv_parameterid: "d7fd7342-a916-471a-9bc0-72097b4656f6",
      RecruitId: recruitId,
      pv_isactive: "1",
    },
  })
    .then((response) => {
      console.log("response all gender", response.data.data);
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
      return [];
    });
};
export const getAllHeightChestGender = () => {
  const recruitId = localStorage.getItem("recruitId");
  const UserId = localStorage.getItem("userId");
  return apiClient({
    method: "get",
    url: `ParameterValueMaster/GetAll`.toString(),
    params: {
      UserId: UserId,
      pv_parameterid: "d8291c56-9fac-4ca5-8524-41b101185029",
      RecruitId: recruitId,
      pv_isactive: "1",
    },
  })
    .then((response) => {
      console.log("response all gender", response.data.data);
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
      return [];
    });
};

export const getAllMeasurement = () => {
  const recruitId = localStorage.getItem("recruitId");
  const recConfId = localStorage.getItem("recConfId");
  const UserId = localStorage.getItem("userId");
  return apiClient({
    method: "get",
    url: `heiCheMeasurement/GetAllConfig`.toString(),
    params: {
      UserId: UserId,
      RecruitId: recruitId,
      recConfId: recConfId,
    },
  })
    .then((response) => {
      console.log("response all measurement", response.data.data);
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
      return [];
    });
};

export const addConfigMeasurement = (data) => {
  return apiClient({
    method: "post",
    url: `heiCheMeasurement/InsertConfig`,
    data: data,
  })
    .then((response) => {
      console.log(response, "add Config measurement");
      const token1 = response.data.outcome.tokens;
      Cookies.set("UserCredential", token1, { expires: 7 });
      // toast.success(
      //   data.id ? "" : "Measurement updated successfully!"
      // );
      // toast.success("Measurement updated successfully!");
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
      const errors = ErrorHandler(error);
      toast.error(errors);
      return null;
    });
};

export const addCategory = (data) => {
  return apiClient({
    method: "post",
    url: `CategoryMaster/Insert`,
    data: data,
  })
    .then((response) => {
      console.log(response, "add Category");
      const token1 = response.data.outcome.tokens;
      Cookies.set("UserCredential", token1, { expires: 7 });

      // alert(
      //   data.id ? "Config updated successfully!" : "Config added successfully!"
      // );
      toast.success("Category added successfully!");
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
      const errors = ErrorHandler(error);
      toast.error(errors);
      return null;
    });
};
export const getAllCategoryData = (recConfId, categoryRows) => {
  const recruitId = localStorage.getItem("recruitId");
  const UserId = localStorage.getItem("userId");
  return apiClient({
    method: "get",
    url: `CategoryMaster/GetAll`.toString(),
    params: {
      UserId: UserId,
      recConfId: recConfId,
      RecruitId: recruitId,
      Categoryins: categoryRows,
      IsActive: "1",
    },
  })
    .then((response) => {
      console.log("response all category", response.data.data);
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
      const errors = ErrorHandler(error);
      toast.error(errors);
      return [];
    });
};
export const deleteCategory = (catId) => {
  const recruitId = localStorage.getItem("recruitId");
  const UserId = localStorage.getItem("userId");
  const data = {
    UserId: UserId,
    id: catId,
    recConfId: recruitId,
    Categoryins: [],
  };
  return apiClient({
    method: "post",
    data: data,
    url: `CategoryMaster/Delete`,
  })
    .then((response) => {
      console.log(response, "response");
      const token1 = response.data.outcome.tokens;
      Cookies.set("UserCredential", token1, { expires: 7 });
      toast.success("Category deleted successfully!");
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
      if (error.response.status === 423) {
        toast.error("Category already mapped!")
      }
      else {
        let errors = ErrorHandler(error);
        toast.error(errors);
        return null;
      }

    });
};

export const AddEventParameterData = (data) => {
  return apiClient({
    method: "post",
    url: `RecruitmentEvent/InsertEventParameter`,
    data: data,
  })
    .then((response) => {
      console.log(response, "add Config event");
      const token1 = response.data.outcome.tokens;
      Cookies.set("UserCredential", token1, { expires: 7 });
      // alert(
      //   data.id ? "Config updated successfully!" : "Config added successfully!"
      // );
      toast.success("Event Parameter added successfully!");
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
      const errors = ErrorHandler(error);
      toast.error(errors);
      return null;
    });
};
