import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import { ArrowBack } from "@material-ui/icons";
import { useNavigate, useLocation } from "react-router-dom";
import Storage from "../../../Storage";
import { apiClient } from "../../../apiClient";
import ErrorHandler from "../../../Components/ErrorHandler";
import Select from "react-select";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

// import UserId from "../UserId";

const RoleMasterForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { rId } = location.state || {};
  const [roleName, setRoleName] = useState("");
  const [roleDescription, setRoleDescription] = useState("");
  const [module, setModule] = useState("");
  const [noOfUsers, setNoOfUsers] = useState("");
  const [active, setActive] = useState(true);
  const [allScreens, setAllScreens] = useState([]);
  const [menuDataArray, setMenuDataArray] = useState([]);
  const [allRecruitment, setAllRecruitment] = useState([]);
  const [recruitmentValue, setRecruitmentValue] = useState("");
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [isAllChecked, setIsAllChecked] = useState(false);
  // const storedToken = localStorage.getItem("UserCredential");

  const headerCellStyle = {
    backgroundColor: "rgb(27, 90, 144)",
    color: "#fff",
  };
  useEffect(() => {
    const fetchData = () => {
      // if (roleName === roleName) {
      getAllData()
        .then(() => {
          // Fetch duty names only after getAllData is complete
          return GetAllRecruitment();

        })
        .then(() => {
          // Set data loaded state
          setIsDataLoaded(true);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    };

    fetchData();
  }, []);

  useEffect(() => {
    const recruitId = localStorage.getItem("recruitId");
    const UserId = localStorage.getItem("userId");
    if (isDataLoaded && rId) {
      apiClient({
        method: "get",
        url: `RoleMaster/GetRoleById`.toString(),
        params: {
          UserId: UserId,
          r_recruitid: recruitId,
          r_id: rId,
          r_isactive: active ? "1" : "2",
        },
      })
        .then((response) => {
          console.log(response, "get by id role master");
          const temp = response.data.data;
          // console.log(response.data.data[0].r_rolename);
          if (temp.length !== 0) {
            setRoleName(temp[0].r_rolename);
            setRoleDescription(temp[0].r_description);
            setModule(temp[0].r_module);
            setNoOfUsers(temp[0].r_no_of_user);
            setMenuDataArray(temp);
          }
          else {
            setMenuDataArray([]);
          }
          const token1 = response.data.outcome.tokens;
          Cookies.set("UserCredential", token1, { expires: 7 });
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
    }
  }, [isDataLoaded, rId]);

  const GetAllRecruitment = () => {
    const recruitId = localStorage.getItem("recruitId");
    const UserId = localStorage.getItem("userId");
    const params = {
      UserId: UserId,
      RecruitId: recruitId,
    };
    return apiClient({
      method: "get",
      params: params,
      url: `Recruitment/GetAll`.toString(),
    })
      .then((response) => {
        console.log("get all recruitment", response.data.data);
        const token1 = response.data.outcome.tokens;
        Cookies.set("UserCredential", token1, { expires: 7 });
        // setAllCandidates(response.data.data)
        const temp = response.data.data;
        const options = temp.map((data) => ({
          value: data.Id,
          label: `${data.place} / ${data.post}`,
        }));
        setAllRecruitment(options);
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

  // const getAllData = () => {
  //   const recruitId = localStorage.getItem("recruitId");
  //   const UserId = localStorage.getItem("userId");
  //   return apiClient({
  //     method: "get",
  //     url: `RoleMaster/GetMenu`.toString(),
  //     params: {
  //       UserId: UserId,
  //       r_recruitid: recruitId,
  //     },
  //   })
  //     .then((response) => {
  //       console.log("response screens", response.data.data);
  //       setAllScreens(response.data.data);
  //       const token1 = response.data.outcome.tokens;
  //       Cookies.set("UserCredential", token1, { expires: 7 });
  //     })
  //     .catch((error) => {
  //       if (
  //         error.response &&
  //         error.response.data &&
  //         error.response.data.outcome
  //       ) {
  //         const token1 = error.response.data.outcome.tokens;
  //         Cookies.set("UserCredential", token1, { expires: 7 });
  //       }
  //       console.log(error);
  //       const errors = ErrorHandler(error);
  //       toast.error(errors);
  //     });
  // };
  const getAllData = () => {
    const recruitId = localStorage.getItem("recruitId");
    const UserId = localStorage.getItem("userId");

    // Prevent API call if recruitId is null or empty
    // if (recruitId === "null") {
    //   console.log("recruitId is null or undefined, skipping API call");
    //   return;
    // }

    return apiClient({
      method: "get",
      url: `RoleMaster/GetMenu`,
      params: {
        UserId: UserId,
        r_recruitid: recruitId,
      },
    })
      .then((response) => {
        console.log("response screens", response.data.data);
        if (!recruitId === "null") {
          setAllScreens(response.data.data);

        }

        const token1 = response.data.outcome.tokens;
        Cookies.set("UserCredential", token1, { expires: 7 });
      })
      .catch((error) => {
        if (error.response?.data?.outcome) {
          const token1 = error.response.data.outcome.tokens;
          Cookies.set("UserCredential", token1, { expires: 7 });
        }
        console.log(error);
        const errors = ErrorHandler(error);
        toast.error(errors);
      });
  };

  const handleRecruitmentChange = async (selected) => {
    try {
      const selectedValue = selected;
      setRecruitmentValue(selectedValue);
      console.log(selectedValue.value, "selected value");

      localStorage.setItem("recruitId", selectedValue.value);
      const recruitId = localStorage.getItem("recruitId");
      const UserId = localStorage.getItem("userId");

      const response = await apiClient({
        method: "get",
        url: `GetWebMenu/GetMenu`,
        params: {
          UserId: UserId,
          RecruitId: recruitId,
        },
      });

      console.log("response screens", response.data.data);
      setAllScreens(response.data.data);

      const token1 = response.data.outcome.tokens;
      Cookies.set("UserCredential", token1, { expires: 7 });

      await getIdWithRecruitId(); // Await this function properly
    } catch (error) {
      if (error.response && error.response.data && error.response.data.outcome) {
        const token1 = error.response.data.outcome.tokens;
        Cookies.set("UserCredential", token1, { expires: 7 });
      }
      console.log(error);
      const errors = ErrorHandler(error);
      toast.error(errors);
    }
  };

  const getIdWithRecruitId = () => {
    const recruitId = localStorage.getItem("recruitId");
    const UserId = localStorage.getItem("userId");

    apiClient({
      method: "get",
      url: `RoleMaster/GetRoleById`.toString(),
      params: {
        UserId: UserId,
        r_recruitid: recruitId,
        r_id: rId,
        r_isactive: active ? "1" : "2",
      },
    })
      .then((response) => {
        console.log(response, "get by id role master");
        const temp = response.data.data;
        // console.log(response.data.data[0].r_rolename);
        if (temp.length !== 0) {
          setRoleName(temp[0].r_rolename);
          setRoleDescription(temp[0].r_description);
          setModule(temp[0].r_module);
          setNoOfUsers(temp[0].r_no_of_user);
          setMenuDataArray(temp);
        }
        else {
          setMenuDataArray([]);
        }
        const token1 = response.data.outcome.tokens;
        Cookies.set("UserCredential", token1, { expires: 7 });
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

  }
  const handleCheckboxChange = (event, menuid) => {
    const { checked, id } = event.target;
    let newData = [...menuDataArray];
    let found = false;

    // Check if the menuData object with the specified menuid exists
    let updatedData = newData.map((menuData) => {
      if (menuData.a_menuid === menuid) {
        found = true;
        // Update the checkbox state
        return { ...menuData, [id]: checked ? "1" : "" };
      }
      return menuData;
    });

    // If all five checkboxes are unchecked, remove the menuData object
    if (!checked) {
      const menuData = updatedData.find((data) => data.a_menuid === menuid);
      if (
        menuData &&
        !menuData.a_addaccess &&
        !menuData.a_editaccess &&
        !menuData.a_viewaccess &&
        !menuData.a_deleteaccess &&
        !menuData.a_workflow
      ) {
        updatedData = updatedData.filter((data) => data.a_menuid !== menuid);
      }
    }

    // If the menuData object doesn't exist, create a new one
    if (!found && checked) {
      const newMenuData = {
        a_menuid: menuid,
        [id]: "1",
        a_addaccess: id === "a_addaccess" ? "1" : "",
        a_editaccess: id === "a_editaccess" ? "1" : "",
        a_viewaccess: id === "a_viewaccess" ? "1" : "",
        a_deleteaccess: id === "a_deleteaccess" ? "1" : "",
        a_workflow: id === "a_workflow" ? "1" : "",
      };
      updatedData.push(newMenuData);
    }

    // Set the updated data array
    setMenuDataArray(updatedData);
  };

  const handleCheckboxChange1 = (event, menuid) => {
    const { checked, id } = event.target;
    let newData = [...menuDataArray];
    let found = false;
    newData = newData.map((menuData) => {
      if (menuData.a_menuid === menuid) {
        found = true;
        return {
          ...menuData,
          [id]: checked ? "1" : "",
          // Set other permissions to the same value as the clicked checkbox
          a_addaccess: checked ? "1" : "",
          a_editaccess: checked ? "1" : "",
          a_viewaccess: checked ? "1" : "",
          a_deleteaccess: checked ? "1" : "",
          a_workflow: checked ? "1" : "",
        };
      }
      return menuData;
    });

    // If the checkbox is unchecked and there are no other checkboxes checked for this menuid,
    // then remove the menuData object from newData
    if (
      !checked &&
      !newData.some(
        (data) =>
          data.a_menuid === menuid &&
          data.a_addaccess === "1" &&
          data.a_editaccess === "1" &&
          data.a_viewaccess === "1" &&
          data.a_deleteaccess === "1" &&
          data.a_workflow === "1"
      )
    ) {
      newData = newData.filter((data) => data.a_menuid !== menuid);
    }

    setMenuDataArray(newData);
    if (!found && checked) {
      newData.push({
        a_menuid: menuid,
        [id]: "1",
        a_addaccess: "1",
        a_editaccess: "1",
        a_viewaccess: "1",
        a_deleteaccess: "1",
        a_workflow: "1",
      });
      setMenuDataArray(newData);
    }
  };

  const handleMasterCheckboxChange = (event) => {
    const { checked } = event.target;
    setIsAllChecked(checked);

    let updatedData;
    if (checked) {
      // If master is checked, set all checkboxes to "1"
      updatedData = allScreens.map((item) => ({
        a_menuid: item.a_menuid,
        a_addaccess: "1",
        a_editaccess: "1",
        a_viewaccess: "1",
        a_deleteaccess: "1",
        a_workflow: "1",
      }));
    } else {
      // If master is unchecked, set all checkboxes to ""
      updatedData = allScreens.map((item) => ({
        a_menuid: item.a_menuid,
        a_addaccess: "",
        a_editaccess: "",
        a_viewaccess: "",
        a_deleteaccess: "",
        a_workflow: "",
      }));
    }

    setMenuDataArray(updatedData);
  };

  const addRoleMaster = () => {
    const recruitId = localStorage.getItem("recruitId");
    const UserId = localStorage.getItem("userId");

    if (!recruitmentValue) {
      toast.warning("Please select recruitment!");
      return;

    }
    if (roleName === "" || menuDataArray.length === 0) {
      toast.warning("Please fill data in all fields!");
      return;
    }

    let data = {
      userId: UserId,
      r_recruitid: recruitId,
      r_rolename: roleName,
      r_description: roleDescription,
      r_module: module,
      r_isactive: active ? "1" : "2",
      // r_no_of_user: noOfUsers,
      Privilage: menuDataArray,
    };

    if (rId !== null && rId !== "") {
      data.r_id = rId;
      data.r_recruitid = recruitId;
    }

    // Log data size
    console.log(JSON.stringify(data).length, "Data Size");

    apiClient({
      method: "post",
      url: `RoleMaster/Insert`,
      data: data,
    })
      .then((response) => {
        console.log(response, "add Role Master");
        toast.success(rId ? "Role updated successfully!" : "Role added successfully!");
        Cookies.set("UserCredential", response.data.outcome.tokens, {
          expires: 7,
        });
        navigate("/roleMaster");
        // localStorage.setItem("recruitId", null);
      })
      .catch((error) => {
        if (
          error.response &&
          error.response.data &&
          error.response.data.outcome
        ) {
          Cookies.set("UserCredential", error.response.data.outcome.tokens, {
            expires: 7,
          });
        }
        console.log(error);
        const errors = ErrorHandler(error);
        toast.error(errors);
      });
  };


  return (
    <>
      <div className="container-fluid">
        <div
          className="card m-3"
          style={{ boxShadow: "0px 1px 5px rgba(0, 0, 0, 0.1)" }}
        >
          <div className="row">
            <div className="col-lg-12">
              <div
                className="card-header" /* style={{ backgroundColor: 'white' }} */
              >
                <div className="row align-items-center">
                  <div className="col">
                    <h4 className="card-title fw-bold">Add Role </h4>
                  </div>
                  <div className="col-md-2  justify-content-end d-none">
                    {/* <input
                      type="text"
                      id="custom-search"
                      className="form-control "
                      placeholder="Search"
                    /> */}
                  </div>
                  <div className="col-auto d-flex flex-wrap">
                    <div className="me-2 my-auto">
                      <Select
                        value={recruitmentValue}
                        onChange={handleRecruitmentChange}
                        options={allRecruitment}
                        placeholder="Select Recruitment"
                        styles={{
                          control: (provided) => ({
                            ...provided,
                            // width: "100%", // Adjust width as needed
                            minWidth: "200px", // Set a fixed minimum width
                            maxWidth: "200px",
                          }),
                        }}
                      />
                    </div>

                    <div
                      className="btn btn-add"
                      title="Back"
                      onClick={() => {
                        navigate("/roleMaster");
                        // localStorage.setItem("recruitId", null);
                      }}
                    >
                      <button
                        className="btn btn-md text-light"
                        type="button"
                        style={{ backgroundColor: "#1B5A90" }}
                      >
                        <ArrowBack />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-body pt-3">
                <div className="row">
                  <div className="col-xs-12 col-sm-12 col-md-12 col-lg-6 mt-2 mt-lg-0">
                    <div className="form-group form-group-sm">
                      <label className="control-label fw-bold">
                        Role Name:
                      </label>{" "}
                      <span className="text-danger fw-bold">*</span>
                      <input
                        type="text"
                        id="roleName"
                        name="roleName"
                        className="form-control mt-3"
                        autoComplete="off"
                        placeholder="Enter Role Name"
                        value={roleName}
                        onChange={(e) => setRoleName(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-xs-12 col-sm-12 col-md-12 col-lg-6 mt-lg-0 mt-4">
                    <div className="form-group form-group-sm">
                      <label className="control-label fw-bold">
                        Description:
                      </label>{" "}
                      {/* <span className="text-danger fw-bold">*</span> */}
                      <textarea
                        className="form-control mt-3"
                        id="description"
                        rows="2"
                        placeholder="Enter Description"
                        value={roleDescription}
                        onChange={(e) => setRoleDescription(e.target.value)}
                      ></textarea>
                    </div>
                  </div>
                </div>
                <div className="row mt-2">
                  <div className="col-xs-12 col-sm-12 col-md-12 col-lg-6 mt-0 mt-lg-0 d-none">
                    <div className="form-group form-group-sm">
                      <label className="control-label fw-bold">
                        No of Assign Users:
                      </label>{" "}
                      {/* <span className="text-danger fw-bold">*</span> */}
                      <input
                        type="text"
                        id="noOfUsers"
                        name="noOfUsers"
                        className="form-control mt-3"
                        autoComplete="off"
                        placeholder="Enter No of Assign Users"
                        value={noOfUsers}
                        onChange={(e) => setNoOfUsers(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-xs-12 col-sm-12 col-md-12 col-lg-6">
                    <div className="form-group form-group-sm">
                      <label className="control-label fw-bold">
                        {/* Department Head: */}
                      </label>
                      <div className="form-group form-group-sm ">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={active}
                            onChange={(e) => setActive(e.target.checked)}
                            id="defaultCheck1"
                          />
                          <label
                            className="form-check-label"
                            htmlFor="defaultCheck1"
                          >
                            Is Active
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <br />
                <Table striped hover responsive className="border text-left">
                  <thead>
                    <tr>
                      <th scope="col" style={headerCellStyle}>
                        <input
                          className="form-check-input flexCheckDefault"
                          type="checkbox"
                          checked={isAllChecked}
                          onChange={handleMasterCheckboxChange}
                        />
                      </th>
                      <th scope="col" style={headerCellStyle}>
                        Screen Name
                      </th>
                      <th scope="col" style={headerCellStyle}>
                        Add
                      </th>
                      <th scope="col" style={headerCellStyle}>
                        Update
                      </th>
                      <th scope="col" style={headerCellStyle}>
                        View
                      </th>
                      <th scope="col" style={headerCellStyle}>
                        Delete
                      </th>
                      <th scope="col" style={headerCellStyle}>
                        Workflow
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {allScreens.map((item) => (
                      <tr key={item.a_menuid}>
                        <td className="">
                          <input
                            className="form-check-input flexCheckDefault"
                            type="checkbox"
                            value=""
                            onChange={(e) =>
                              handleCheckboxChange1(e, item.a_menuid)
                            }
                          />
                        </td>
                        <td style={{ display: "none" }} id="a_menuid">
                          {item.a_menuid}
                        </td>
                        <td id="m_menuname">{item.m_menuname}</td>
                        <td className="">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            value=""
                            checked={menuDataArray.some(
                              (data) =>
                                data.a_menuid === item.a_menuid &&
                                data.a_addaccess === "1"
                            )}
                            id="a_addaccess"
                            onChange={(e) =>
                              handleCheckboxChange(e, item.a_menuid)
                            }
                          />
                        </td>

                        <td className="">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            value=""
                            checked={menuDataArray.some(
                              (data) =>
                                data.a_menuid === item.a_menuid &&
                                data.a_editaccess === "1"
                            )}
                            id="a_editaccess"
                            onChange={(e) =>
                              handleCheckboxChange(e, item.a_menuid)
                            }
                          />
                        </td>
                        <td className="">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            value=""
                            checked={menuDataArray.some(
                              (data) =>
                                data.a_menuid === item.a_menuid &&
                                data.a_viewaccess === "1"
                            )}
                            id="a_viewaccess"
                            onChange={(e) =>
                              handleCheckboxChange(e, item.a_menuid)
                            }
                          />
                        </td>
                        <td className="">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            value=""
                            checked={menuDataArray.some(
                              (data) =>
                                data.a_menuid === item.a_menuid &&
                                data.a_deleteaccess === "1"
                            )}
                            id="a_deleteaccess"
                            onChange={(e) =>
                              handleCheckboxChange(e, item.a_menuid)
                            }
                          />
                        </td>
                        <td className="">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            value=""
                            checked={menuDataArray.some(
                              (data) =>
                                data.a_menuid === item.a_menuid &&
                                data.a_workflow === "1"
                            )}
                            id="a_workflow"
                            onChange={(e) =>
                              handleCheckboxChange(e, item.a_menuid)
                            }
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
              <div className="card-footer">
                <div className="row">
                  <div className="col-lg-12 text-end">
                    <button
                      className="btn btn-md text-light"
                      type="button"
                      style={{ backgroundColor: "#1B5A90" }}
                      onClick={() => {
                        addRoleMaster();
                        // editDesignation();
                      }}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </>
  );
};

export default RoleMasterForm;
