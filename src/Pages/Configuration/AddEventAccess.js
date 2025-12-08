import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import { ArrowBack } from "@material-ui/icons";
import { useNavigate, useLocation } from "react-router-dom";
import Storage from "../../Storage";
import { apiClient } from "../../apiClient";
import ErrorHandler from "../../Components/ErrorHandler";
import Select from "react-select";
import Cookies from 'js-cookie';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const AddEventAccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { dId, cId, catName, catId } = location.state || {};
  const [categoryName, setCategoryName] = useState("");
  const [active, setActive] = useState(true);
  const [allScreens, setAllScreens] = useState([]);
  const [menuDataArray, setMenuDataArray] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  console.log(dId, "dID")
  const headerCellStyle = {
    backgroundColor: "rgb(27, 90, 144)",
    color: "#fff",
  };

  useEffect(() => {
    const fetchData = () => {
      getAllData()
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
    if (isDataLoaded) {
      const recruitId = localStorage.getItem("recruitId");
      const UserId = localStorage.getItem("userId");
      apiClient({
        method: "get",
        url: `EventAccessMaster/GetEventById`,
        params: {
          userId: UserId,
          // Id: dId,
          recruitId: recruitId,
          categoryId: catId,
          Isactive: "1",
        },
      })
        .then((response) => {
          console.log(response, "get by id event access");

          if (response && response.data && response.data.data && response.data.data.length > 0) {
            const temp = response.data.data;

            // Map the data to options format
            const options = temp.map((item) => ({
              value: item.Id,
              label: item.CategoryName,
            }));

            // Set the state with the mapped options
            setCategoryName(options[0]);

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
  }, [isDataLoaded]);

  useEffect(() => {
    console.log(menuDataArray, "Updated menu array");
  }, [menuDataArray]);

  const getAllData = () => {
    const recruitId = localStorage.getItem("recruitId");
    const UserId = localStorage.getItem("userId");
    return apiClient({
      method: "get",
      url: `RecruitmentEvent/GetAllRecruitEvent`,
      params: {
        UserId: UserId,
        RecruitId: recruitId,
        categoryid: "null",
        ipaddress: "null",
        sessionid: "null",

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
          addaccess: checked ? "1" : "",
          editaccess: checked ? "1" : "",
          viewaccess: checked ? "1" : "",
          deleteaccess: checked ? "1" : "",
          workflow: checked ? "1" : "",
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
          data.addaccess === "1" &&
          data.wditaccess === "1" &&
          data.viewaccess === "1" &&
          data.deleteaccess === "1" &&
          data.workflow === "1"
      )
    ) {
      newData = newData.filter((data) => data.menuid !== menuid);
    }

    setMenuDataArray(newData);
    if (!found && checked) {
      newData.push({
        a_menuid: menuid,
        [id]: "1",
        addaccess: "1",
        editaccess: "1",
        viewaccess: "1",
        deleteaccess: "1",
        workflow: "1",
      });
      setMenuDataArray(newData);
    }
  };


  useEffect(() => {
    console.log(menuDataArray, "254");
  }, [menuDataArray]);

  const addEventAccess = () => {
    const recruitId = localStorage.getItem("recruitId");
    const UserId = localStorage.getItem("userId");
    console.log(menuDataArray, "menuDataArray");
    let data;
    data = {
      userId: UserId,
      recruitId: recruitId,
      categoryName: catName,
      categoryId: catId,
      isactive: active === true ? "1" : "0",
      privilage: menuDataArray,
    };

    console.log(menuDataArray, "Privilage");
    if (catId !== null && catId !== "") {
      data.id = catId;
    }
    apiClient({
      method: "post",
      url: `EventAccessMaster/InsertEvent`,
      data: data, // Make sure to stringify the data object
    })
      .then((response) => {
        console.log(response, "add Event Access");
        if (data.id) {
          toast.success("Event Access saved successfully!");
        } else {
          toast.success("Event Access saved successfully!");
        }
        console.log(menuDataArray, "menu data array");
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
                    <h4 className="card-title fw-bold">Add Event Access</h4>
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
                      onClick={() => navigate(-1)}
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
                  <div className="col-xs-6 col-sm-6 col-md-3 col-lg-3 mt-2 mt-lg-0">
                    <div className="form-group form-group-sm">
                      <label className="control-label fw-bold">
                        Category Name:
                      </label>{" "}
                    </div>
                  </div>
                  <div className="col-xs-6 col-sm-6 col-md-4 col-lg-4 mt-2 mt-lg-0">
                    <div className="form-group form-group-sm">
                      <label className="control-label fw-bold">
                        {catName}
                      </label>
                    </div>
                  </div>
                </div>

                <br />
                <Table striped hover responsive className="border text-left">
                  <thead>
                    <tr>
                      <th scope="col" style={headerCellStyle}>Is Mandatory</th>
                      <th scope="col" style={headerCellStyle}>
                        Events Name
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {allScreens.map((item) => (
                      <tr key={item.Id}>
                        <td className="">
                          <input
                            className="form-check-input flexCheckDefault"
                            type="checkbox"
                            value=""
                            onChange={(e) =>
                              handleCheckboxChange1(e, item.Id)
                            }
                            checked={menuDataArray.some(
                              (data) =>
                                data.a_menuid === item.Id &&
                                data.addaccess === "1"
                            )}
                          />
                        </td>
                        <td style={{ display: "none" }} id="a_menuid">
                          {item.a_menuid}
                        </td>
                        <td id="m_menuname">{item.eventName}</td>
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
                        addEventAccess();
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

export default AddEventAccess;
