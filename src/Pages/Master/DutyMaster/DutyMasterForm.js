import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import { ArrowBack } from "@material-ui/icons";
import { useNavigate, useLocation } from "react-router-dom";
import Storage from "../../../Storage";
import { apiClient } from "../../../apiClient";
import ErrorHandler from "../../../Components/ErrorHandler";
import Select from "react-select";
import Cookies from 'js-cookie';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const DutyMasterForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { dId } = location.state || {};
  const [dutyName, setDutyName] = useState("");
  const [allDutyName, setAllDutyName] = useState("")
  const [dutyDescription, setDutyDescription] = useState("");
  const [module, setModule] = useState("");
  const [noOfUsers, setNoOfUsers] = useState("");
  const [active, setActive] = useState(true);
  const [allScreens, setAllScreens] = useState([]);
  const [menuDataArray, setMenuDataArray] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [isAllChecked, setIsAllChecked] = useState(false);

  const headerCellStyle = {
    backgroundColor: "rgb(27, 90, 144)",
    color: "#fff",
  };

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       // Fetch all data and set allScreens
  //       await getAllData();

  //       // Fetch duty names and set allDutyName
  //       await getDutyName();

  //       // Set data loaded state
  //       setIsDataLoaded(true);
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //     }
  //   };

  //   fetchData();
  // }, []);
  useEffect(() => {
    const fetchData = () => {
      getAllData()
        .then(() => {
          // Fetch duty names only after getAllData is complete
          return getDutyName();
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
    if (isDataLoaded && dId) {
      const recruitId = localStorage.getItem("recruitId");
      const UserId = localStorage.getItem("userId");
      apiClient({
        method: "get",
        url: `DutyMaster/GetDutyById`,
        params: {
          UserId: UserId,
          d_id: dId,
          d_recruitid: recruitId,
          d_isactive: active === true ? "1" : "2"
        },
      })
        .then((response) => {
          console.log(response, "get by id duty master");
          if (response && response.data && response.data.data && response.data.data.length > 0) {
            const temp = response.data.data;

            // Map the data to options format
            const options = temp.map((item) => ({
              value: item.d_id,
              label: item.d_dutyname,
            }));

            // Set the state with the mapped options
            setDutyName(options[0]);
            setDutyDescription(response.data.data[0].d_description);
            setModule(response.data.data[0].d_module);
            setNoOfUsers(response.data.data[0].d_no_of_user);
            setMenuDataArray(response.data.data);
            const token1 = response.data.outcome.tokens;
            Cookies.set("UserCredential", token1, { expires: 7 });
          } else {
            console.error("No data found in response");
          }
        })
        .catch((error) => {
          if (error.response && error.response.data && error.response.data.outcome) {
            const token1 = error.response.data.outcome.tokens;
            Cookies.set("UserCredential", token1, { expires: 7 });
          }
          console.log(error);
          const errors = ErrorHandler(error);
          toast.error(errors);
        });
    }
  }, [isDataLoaded, dId, active]);

  const getAllData = () => {
    const recruitId = localStorage.getItem("recruitId");
    const UserId = localStorage.getItem("userId");
    return apiClient({
      method: "get",
      url: `GetWebMenu/GetMenu`,
      params: {
        UserId: UserId,
        RecruitId: recruitId,
      },
    })
      .then((response) => {
        console.log("response screens", response.data.data);
        setAllScreens(response.data.data);
        const token1 = response.data.outcome.tokens;
        Cookies.set("UserCredential", token1, { expires: 7 });
      })
      .catch((error) => {
        if (error.response && error.response.data && error.response.data.outcome) {
          const token1 = error.response.data.outcome.tokens;
          Cookies.set("UserCredential", token1, { expires: 7 });
        }
        console.log(error);
        const errors = ErrorHandler(error);
        toast.error(errors);
      });
  };

  const getDutyName = () => {
    const recruitId = localStorage.getItem("recruitId");
    const UserId = localStorage.getItem("userId");
    return apiClient({
      method: "get",
      url: `DutyMaster/GetDutyName`,
      params: {
        UserId: UserId,
        RecruitId: recruitId,
      },
    })
      .then((response) => {
        console.log("response all duty name", response.data.data);
        const temp = response.data.data;
        const options = temp.map((data) => ({
          value: data.id,
          label: data.dutyname,
        }));
        setAllDutyName(options);
        const token1 = response.data.outcome.tokens;
        Cookies.set("UserCredential", token1, { expires: 7 });
      })
      .catch((error) => {
        if (error.response && error.response.data && error.response.data.outcome) {
          const token1 = error.response.data.outcome.tokens;
          Cookies.set("UserCredential", token1, { expires: 7 });
        }
        console.log(error);
        const errors = ErrorHandler(error);
        toast.error(errors);
      });
  };

  const handleDutyName = (selected) => {
    setDutyName(selected);
  };

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
      console.log(menuData, "menuData")
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

  useEffect(() => {
    // console.log(menuDataArray);
  }, [menuDataArray]);

  const addRoleMaster = () => {
    const recruitId = localStorage.getItem("recruitId");
    const UserId = localStorage.getItem("userId");
    // console.log(menuDataArray, "menuDataArray");
    let data;
    if (dutyName === "" || noOfUsers === "" || menuDataArray.length === 0) {
      toast.warning("Please fill data in all fields!");
    } else {
      data = {
        userId: UserId,
        d_recruitid: recruitId,
        d_dutyName: dutyName.label,
        d_description: dutyDescription,
        d_module: module,
        d_isactive: active === true ? "1" : "2",
        d_no_of_user: noOfUsers,
        Privilage: menuDataArray,
      };
      console.log(data.Privilage, "Privilage");
      if (dId !== null && dId !== "") {
        data.d_id = dId;
      }
      apiClient({
        method: "post",
        url: `DutyMaster`,
        data: data, // Make sure to stringify the data object
      })
        .then((response) => {
          console.log(response, "add Duty Master");
          if (dId !== null && dId !== undefined) {
            toast.success("Duty updated successfully!");
          } else {
            toast.success("Duty added successfully!");
          }
          console.log(menuDataArray, "menu data array");
          const token1 = response.data.outcome.tokens;
          Cookies.set("UserCredential", token1, { expires: 7 });
          navigate("/dutyMaster");
        })
        .catch((error) => {
          if (error.response && error.response.data && error.response.data.outcome) {
            const token1 = error.response.data.outcome.tokens;
            Cookies.set("UserCredential", token1, { expires: 7 });
          }
          console.log(error);
          const errors = ErrorHandler(error);
          toast.error(errors);
        });
    }
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
                    <h4 className="card-title fw-bold">Add Duty</h4>
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
                    <div className="form-custom me-1">
                      <div
                        id="tableSearch"
                        className="dataTables_wrapper"
                      ></div>
                    </div>

                    <div
                      className="btn btn-add"
                      title="Back"
                      onClick={() => {
                        navigate("/dutyMaster");
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
                  <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 mt-2 mt-lg-0">
                    <div className="form-group form-group-sm">
                      <label className="control-label fw-bold">
                        Duty Name:
                      </label>{" "}
                      <span className="text-danger fw-bold">*</span>
                      {/* <input
                        type="text"
                        id="dutyName"
                        className="form-control mt-3"
                        placeholder="Enter Duty Name"
                        value={dutyName}
                        onChange={(e) => setDutyName(e.target.value)}
                      /> */}
                      <Select
                        className="mt-3"
                        value={dutyName}
                        onChange={handleDutyName}
                        options={allDutyName}
                        placeholder="Select Duty Name"

                      />
                    </div>
                  </div>
                  <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 mt-lg-0 mt-md-0 mt-4">
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
                        value={dutyDescription}
                        onChange={(e) => setDutyDescription(e.target.value)}
                      ></textarea>
                    </div>
                  </div>
                </div>
                <div className="row mt-4">
                  <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 mt-0 mt-lg-0">
                    <div className="form-group form-group-sm">
                      <label className="control-label fw-bold">
                        No of Assign Users:
                      </label>{" "}
                      <span className="text-danger fw-bold">*</span>
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
                  <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                    <div className="form-group form-group-sm">
                      <label className="control-label fw-bold">
                        {/* Department Head: */}
                      </label>
                      <div className="form-group form-group-sm mt-3">
                        <div className="form-check">

                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={active}
                            onChange={(e) => setActive(e.target.checked)}
                            id="defaultCheck1"
                          />
                          {/* <input
                            className="form-check-input"
                            type="checkbox"
                            checked={active === "1"} // Ensure it's checked when active is "1"
                            onChange={(e) => setActive(e.target.checked ? "1" : "2")} // Convert to "1" or "2"
                            
                            id="defaultCheck1"
                          /> */}
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
                            // checked={menuDataArray.some(
                            //   (data) =>
                            //     data.a_menuid === item.a_menuid &&
                            //     data.a_addaccess === "1"
                            // )}
                            checked={menuDataArray.some((data) => {
                              console.log(data.a_menuid, "data menuid");
                              console.log(item.a_menuid, "item menuid");
                              return data.a_menuid === item.a_menuid &&
                                data.a_addaccess === "1"
                            })}
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

export default DutyMasterForm;
