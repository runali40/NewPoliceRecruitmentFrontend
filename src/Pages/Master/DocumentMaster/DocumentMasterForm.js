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

const CategoryMasterForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const { dId, catId } = location.state || {};
  const [categoryName, setCategoryName] = useState("");
  const [allCategoryName, setAllCategoryName] = useState("")
  const [active, setActive] = useState(true);
  const [allScreens, setAllScreens] = useState([]);
  const [menuDataArray, setMenuDataArray] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [documentDate, setDocumentDate] = useState(() => formatDate(new Date()));

  console.log(dId, "dID")
  const headerCellStyle = {
    backgroundColor: "rgb(27, 90, 144)",
    color: "#fff",
  };

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




  // useEffect(() => {
  //   if (isDataLoaded && dId) {
  //     const recruitId = localStorage.getItem("recruitId");
  //     const UserId = localStorage.getItem("userId");
  //     apiClient({
  //       method: "get",
  //       url: `CategoryDocPrivilege/GetCategoryById`,
  //       params: {
  //         UserId: UserId,
  //         Id: dId,
  //         RecruitId: recruitId,
  //         CategoryId: catId,
  //         Isactive: "1",
  //       },
  //     })
  //       .then((response) => {
  //         console.log(response, "get by id category master");
  //         if (response && response.data && response.data.data && response.data.data.length > 0) {
  //           const temp = response.data.data;

  //           // Map the data to options format
  //           const options = temp.map((item) => ({
  //             value: item.Id,
  //             label: item.CategoryName,
  //           }));

  //           // Set the state with the mapped options
  //           setCategoryName(options[0]);
  //           console.log(response.data.data, "get priviledge data")
  //           const dataArray = response.data.data;
  //           setMenuDataArray(dataArray);
  //           console.log(menuDataArray, "menu array")
  //           const token1 = response.data.outcome.tokens;
  //           Cookies.set("UserCredential", token1, { expires: 7 });

  //         } else {
  //           console.error("No data found in response");
  //         }
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //         const errors = ErrorHandler(error);
  //         toast.error(errors);
  //       });
  //   }
  // }, [isDataLoaded, dId, menuDataArray]);
  useEffect(() => {
    if (isDataLoaded && dId) {
      const recruitId = localStorage.getItem("recruitId");
      const UserId = localStorage.getItem("userId");
      apiClient({
        method: "get",
        url: `CategoryDocPrivilege/GetCategoryById`,
        params: {
          UserId: UserId,
          Id: dId,
          RecruitId: recruitId,
          CategoryId: catId,
          Isactive: active ? "1" : "2"
        },
      })
        .then((response) => {
          console.log(response, "get by id category master");

          if (response && response.data && response.data.data && response.data.data.length > 0) {
            const temp = response.data.data;

            // Map the data to options format
            const options = temp.map((item) => ({
              value: item.Id,
              label: item.SubCategoryName,
            }));

            // Set the state with the mapped options
            setCategoryName(options[0]);
            console.log(categoryName, "135")
            console.log(response.data.data, "get privilege data");
            const dataArray = response.data.data;
            setMenuDataArray(dataArray);

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
  }, [isDataLoaded, dId, catId]);

  useEffect(() => {
    console.log(menuDataArray, "Updated menu array");
  }, [menuDataArray]);

  const getAllData = () => {
    const recruitId = localStorage.getItem("recruitId");
    const UserId = localStorage.getItem("userId");
    return apiClient({
      method: "get",
      url: `CategoryDocPrivilege/GetMenu`,
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
      url: `CastCutOffService/GetSubCategory`,
      params: {
        UserId: UserId,
        RecruitId: recruitId,
        recConfId: recruitId
      },
    })
      .then((response) => {
        console.log("response all sub category name", response.data.data);
        const temp = response.data.data;
        const options = temp.map((data) => ({
          value: data.Id,
          label: data.CategoryName,
        }));
        setAllCategoryName(options);
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

  const handleCategoryName = (selected) => {
    setCategoryName(selected);
    console.log(categoryName, "categoryName")
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
        !menuData.addaccess &&
        !menuData.editaccess &&
        !menuData.viewaccess &&
        !menuData.deleteaccess &&
        !menuData.workflow &&
        !menuData.documentValidateDate
      ) {
        updatedData = updatedData.filter((data) => data.a_menuid !== menuid);
      }
    }

    // If the menuData object doesn't exist, create a new one
    if (!found && checked) {
      const newMenuData = {
        a_menuid: menuid,
        [id]: "1",
        addaccess: id === "addaccess" ? "1" : "",
        editaccess: id === "editaccess" ? "1" : "",
        viewaccess: id === "viewaccess" ? "1" : "",
        deleteaccess: id === "deleteaccess" ? "1" : "",
        workflow: id === "workflow" ? "1" : "",
        documentValidateDate: documentDate.value ? documentDate.value : "",
      };
      updatedData.push(newMenuData);
    }

    // Set the updated data array
    setMenuDataArray(updatedData);
  };

  const hasAnyAccess = (menuItem) => {
    return (
      menuItem.addaccess === "1" ||
      menuItem.editaccess === "1" ||
      menuItem.viewaccess === "1" ||
      menuItem.deleteaccess === "1" ||
      menuItem.workflow === "1"
    );
  };



  const handleCheckboxChange1 = (event, menuid, date = null) => {
    const { checked, id } = event.target;
    let newData = [...menuDataArray];

    // Format the date if provided
    const formattedDate = date ? `${date}T00:00:00` : null;

    // Check if menuid already exists in menuDataArray
    const existingIndex = newData.findIndex((data) => data.a_menuid === menuid);

    if (checked) {
      if (existingIndex > -1) {
        // Update the existing row
        newData[existingIndex] = {
          ...newData[existingIndex],
          [id]: "1",
          addaccess: "1",
          editaccess: "1",
          viewaccess: "1",
          deleteaccess: "1",
          workflow: "1",
          documentValidateDate: formattedDate || newData[existingIndex].documentValidateDate,
        };
      } else {
        // Add a new row
        newData.push({
          a_menuid: menuid,
          [id]: "1",
          addaccess: "1",
          editaccess: "1",
          viewaccess: "1",
          deleteaccess: "1",
          workflow: "1",
          documentValidateDate: formattedDate,
        });
      }
    } else {
      // Uncheck the checkbox - remove or update the row
      if (existingIndex > -1) {
        const updatedRow = {
          ...newData[existingIndex],
          [id]: "0",
          addaccess: "0",
          editaccess: "0",
          viewaccess: "0",
          deleteaccess: "0",
          workflow: "0",
          documentValidateDate: null,
        };
        // Remove the row if all values are "0"
        if (
          updatedRow.addaccess === "0" &&
          updatedRow.editaccess === "0" &&
          updatedRow.viewaccess === "0" &&
          updatedRow.deleteaccess === "0" &&
          updatedRow.workflow === "0"
        ) {
          newData.splice(existingIndex, 1);
        } else {
          newData[existingIndex] = updatedRow;
        }
      }
    }

    setMenuDataArray(newData);
  };


  const handleDateChange = (menuid, date) => {
    const formattedDate = date ? `${date}T00:00:00` : null;
    let newData = [...menuDataArray];

    // Check if the menu ID already exists in the data array
    const existingIndex = newData.findIndex((data) => data.a_menuid === menuid);

    if (existingIndex > -1) {
      // Update the date for the existing entry
      newData[existingIndex] = {
        ...newData[existingIndex],
        documentValidateDate: formattedDate,
      };
    } else {
      // Add a new entry with the date
      newData.push({
        a_menuid: menuid,
        addaccess: "0",
        editaccess: "0",
        viewaccess: "0",
        deleteaccess: "0",
        workflow: "0",
        documentValidateDate: formattedDate,
      });
    }

    setMenuDataArray(newData);
  };

  useEffect(() => {
    console.log(menuDataArray, "254");
  }, [menuDataArray]);

  // const addCategoryMaster = () => {
  //   const recruitId = localStorage.getItem("recruitId");
  //   const UserId = localStorage.getItem("userId");
  //   console.log(menuDataArray, "menuDataArray");
  //   let data;
  //   if (categoryName === "" || menuDataArray.length === 0) {
  //     toast.warning("Please fill data in all fields!!");
  //   } else {
  //     data = {
  //       userId: UserId,
  //       RecruitId: recruitId,
  //       categoryName: categoryName.label,
  //       CategoryId: categoryName.value,

  //       // d_module: module,
  //       isactive: active ? "1" : "2",
  //       privilage: menuDataArray,
  //     };
  //     console.log(menuDataArray, "Privilage");
  //     if (dId !== null && dId !== "") {
  //       data.id = dId;
  //     }
  //     apiClient({
  //       method: "post",
  //       url: `CategoryDocPrivilege`,
  //       data: data, // Make sure to stringify the data object
  //     })
  //       .then((response) => {
  //         console.log(response, "add Category Master");
  //         // if (dId !== null && dId !== undefined) {
  //         //   toast.success("Category updated successfully!");
  //         // } else {
  //         //   toast.success("Category added successfully!");
  //         // }
  //         if (data.id) {
  //           toast.success("Document updated successfully!");
  //         } else {
  //           toast.success("Document added successfully!");
  //         }
  //         console.log(menuDataArray, "menu data array");
  //         const token1 = response.data.outcome.tokens;
  //         Cookies.set("UserCredential", token1, { expires: 7 });
  //         navigate("/documentMaster");
  //       })
  //       .catch((error) => {
  //         if (error.response && error.response.data && error.response.data.outcome) {
  //           const token1 = error.response.data.outcome.tokens;
  //           Cookies.set("UserCredential", token1, { expires: 7 });
  //         }
  //         console.log(error);
  //         const errors = ErrorHandler(error);
  //         toast.error(errors);
  //       });
  //   }
  // };

  const addCategoryMaster = () => {
    const recruitId = localStorage.getItem("recruitId");
    const UserId = localStorage.getItem("userId");

    // Validate that all menu items have at least one access granted
    // const hasInvalidAccess = menuDataArray.some(item => !hasAnyAccess(item));

    if (categoryName === "") {
      toast.warning("Please select a category!");
      return;
    }

    if (menuDataArray.length === 0) {
      toast.warning("Please select atleast one document for category!");
      return;
    }

    // if (hasInvalidAccess) {
    //   // toast.warning("Please grant at least one access privilege for each selected document!");
    //   toast.warning("Please select atleast one document for category!")
    //   return;
    // }

    const data = {
      userId: UserId,
      RecruitId: recruitId,
      categoryName: categoryName.label,
      CategoryId: categoryName.value,
      isactive: active ? "1" : "2",
      privilage: menuDataArray,
    };

    if (dId !== null && dId !== "") {
      data.id = dId;
    }

    apiClient({
      method: "post",
      url: `CategoryDocPrivilege`,
      data: data,
    })
      .then((response) => {
        const token1 = response.data.outcome.tokens;
        Cookies.set("UserCredential", token1, { expires: 7 });

        if (data.id) {
          toast.success("Document updated successfully!");
        } else {
          toast.success("Document added successfully!");
        }

        navigate("/documentMaster");
      })
      .catch((error) => {
        if (error.response?.data?.outcome?.tokens) {
          Cookies.set("UserCredential", error.response.data.outcome.tokens, {
            expires: 7,
          });
        }
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
                    <h4 className="card-title fw-bold">Add Document Master</h4>
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
                        navigate("/documentMaster");
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
                        Category Name:
                      </label>{" "}
                      <span className="text-danger fw-bold">*</span>
                      <Select
                        className="mt-3"
                        value={categoryName}
                        onChange={handleCategoryName}
                        options={allCategoryName}
                        placeholder="Select Category Name"

                      />
                    </div>
                  </div>
                  <div className="col-xs-12 col-sm-12 col-md-12 col-lg-6 mt-3">
                    <div className="form-group form-group-sm">
                      <label className="control-label fw-bold">
                        {/* Department Head: */}
                      </label>
                      <div className="form-group form-group-sm">
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
                      <th scope="col" style={headerCellStyle}>Is Mandatory</th>
                      <th scope="col" style={headerCellStyle}>
                        Documents Name
                      </th>
                      <th scope="col" style={headerCellStyle}>
                        Documents Date
                      </th>
                      {/* <th scope="col" style={headerCellStyle}>
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
                      </th> */}
                    </tr>
                  </thead>
                  {/* <tbody>
                    {allScreens.map((item,index) => (
                      <tr key={item.a_menuid}>
                        <td className="">
                          <input
                            className="form-check-input flexCheckDefault"
                            type="checkbox"
                            value=""
                            onChange={(e) =>
                              handleCheckboxChange1(e, item.a_menuid)
                            }
                            checked={menuDataArray.some(
                              (data) =>
                                data.a_menuid === item.a_menuid &&
                                data.addaccess === "1"
                            )}
                          />
                        </td>
                        <td style={{ display: "none" }} id="a_menuid">
                          {item.a_menuid}
                        </td>
                        <td id="m_menuname">{item.m_menuname}</td>
                        <td>
                        <input
          className="form-control"
          type="date"
          value={index === documentDate.row ? documentDate.value : ""} // Update only for the selected row
          // onChange={(e) => handleDateChange({ row: index, value: e.target.value })}
          onChange={(e) =>
            handleCheckboxChange1({row: index, value: e})
          }
        />
                        </td>
                

                      </tr>
                    ))}
                  </tbody> */}
                  <tbody>
                    {allScreens.map((item, index) => (
                      <tr key={item.a_menuid}>
                        <td className="">
                          <input
                            className="form-check-input flexCheckDefault"
                            type="checkbox"
                            value=""
                            onChange={(e) => handleCheckboxChange1(e, item.a_menuid)}
                            checked={menuDataArray.some((data) => data.a_menuid === item.a_menuid && data.addaccess === "1")}
                          />
                        </td>
                        <td style={{ display: "none" }} id="a_menuid">
                          {item.a_menuid}
                        </td>
                        <td id="m_menuname">{item.m_menuname}</td>
                        <td>
                          {/* <input
                            className="form-control"
                            type="date"
                            value={
                              menuDataArray.find((data) => data.a_menuid === item.a_menuid)?.documentValidateDate
                                ? new Date(
                                  menuDataArray.find((data) => data.a_menuid === item.a_menuid)?.documentValidateDate
                                )
                                  .toISOString()
                                  .slice(0, 10)
                                : ""
                            }
                            onChange={(e) => handleDateChange(item.a_menuid, e.target.value)}
                          /> */}
                          <input
                            className="form-control"
                            type="date"
                            value={
                              menuDataArray.find((data) => data.a_menuid === item.a_menuid)
                                ?.documentValidateDate
                                ? new Date(
                                  menuDataArray.find((data) => data.a_menuid === item.a_menuid)
                                    ?.documentValidateDate
                                )
                                  .toISOString()
                                  .slice(0, 10)
                                : ""
                            }
                            onChange={(e) => handleDateChange(item.a_menuid, e.target.value)}
                            disabled={!menuDataArray.some(
                              (data) => data.a_menuid === item.a_menuid && data.addaccess === "1"
                            )}
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
                        addCategoryMaster();
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

export default CategoryMasterForm;
