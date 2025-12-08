import React, { useState, useEffect } from "react";
import { Card, Button, Row, Col, Form, Table } from "react-bootstrap";
import { PlusCircleFill } from "react-bootstrap-icons";
import { ArrowBack, CancelRounded, Delete, Edit } from "@material-ui/icons";
import {
  AddEventParameterData,
  getAllData,
  getAllGender,
  getAllGenderCategory,
  getAllMeasurement,
  getAllRecruitData,
  getConfig,
} from "../../../Components/Api/ConfigurationApi";
import { useLocation, useNavigate } from "react-router-dom";
import InputMask from "react-input-mask";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddEventParameter = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [eventUnit, setEventUnit] = useState("");
  const [minvalue, setMinvalue] = useState("");
  const [toggleActive, setToggleActive] = useState(true);
  const [cId, setCId] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [allConfig, setAllConfig] = useState([]);
  const [allConfigEvent, setAllConfigEvent] = useState([]);
  const [allGender, setAllGender] = useState([]);
  const [userNameShow, setUserNameShow] = useState(false);

  const handleUserNameClose = () => setUserNameShow(false);
  const handleUserNameShow = () => setUserNameShow(true);
  const location = useLocation();
  const {
    eventId,
    categoryName,
    eventUnitId,
    categoryId,
    eventName,
    eventUnitName,
  } = location.state || {};
  console.log(eventId, "39");
  const [rows, setRows] = useState([
    {
      minValue: "",
      maxValue: "",
      score: "",
      gender: "",
      kilo: "",
      category: categoryName,
    },
  ]);
  const addRow = () => {
    setRows([
      ...rows,
      {
        minValue: "",
        maxValue: "",
        score: "",
        gender: "",
        kilo: "",
        category: categoryName,
      },
    ]);
  };
  const deleteRow = () => {
    // Assuming mixValue is part of each row's data
    const lastRow = rows[rows.length - 1];

    if (rows.length > 1) {
      // Check if mixValue is blank in the last row
      if (lastRow.maxValue.trim() === "" || lastRow.minValue.trim() === "" || lastRow.score.trim() === "" || lastRow.gender.trim() === "") {
        setRows(rows.slice(0, -1));
      } else {
        toast.error("Cannot delete the row");
      }
    } else {
      toast.error("Cannot delete the last row");
    }
  };
  // const isRoleAdmin = RoleName === "Admin";
  // const handleShow = () => {
  //   setShowModal(true);
  // };
  const headerCellStyle = {
    backgroundColor: "rgb(27, 90, 144)",
    color: "#fff",
  };

  // useEffect(() => {
  //     const fetchConfigEventData = async () => {
  //         try {
  //             const configEventData = await getAllRecruitData(rows, eventUnit, eventId, eventUnitId, categoryId);
  //             setAllConfigEvent(configEventData);
  //             setRows(configEventData)

  //             getAllGender()
  //                 .then(setAllGender)
  //         } catch (error) {
  //             console.error("Error fetching config event data:", error);
  //         }
  //     };

  //     fetchConfigEventData();
  // }, [eventUnit]);
  // useEffect(() => {
  //     const fetchData = async () => {
  //         try {
  //             // First fetch the gender data
  //             const genderData = await getAllGender();
  //             setAllGender(genderData);

  //             // Then fetch the recruitment data
  //             const configEventData = await getAllRecruitData(rows, eventUnit, eventId, eventUnitId, categoryId);
  //             setAllConfigEvent(configEventData);
  //             if(configEventData.length === 0){

  //             }
  //             setRows(configEventData); // Update rows with fetched data

  //         } catch (error) {
  //             console.error("Error fetching data:", error);
  //         }
  //     };

  //     fetchData();
  // }, [eventUnit]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        // First fetch the gender data
        const genderData = await getAllGenderCategory();
        setAllGender(genderData);

        // Then fetch the recruitment data
        const configEventData = await getAllRecruitData(
          rows,
          eventUnit,
          eventId,
          eventUnitId,
          categoryId
        );

        // Check if configEventData has valid length
        if (configEventData && configEventData.length > 0) {
          setRows(configEventData); // Bind the fetched data
        } else {
          // If no data is returned, use the default array
          setRows([
            {
              minValue: "",
              maxValue: "",
              score: "",
              gender: "",
              kilo: "",
              category: categoryName,
            },
          ]);
        }

        setAllConfigEvent(configEventData); // Set event data for further usage
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [eventUnit, categoryName]);

  const AddParameterEvent = () => {
    const recruitId = localStorage.getItem("recruitId");
    const UserId = localStorage.getItem("userId");
    const hasBlankParameter = rows.some(
      (row) =>
        row.minValue === "" ||
        row.maxValue === "" ||
        row.score === "" ||
        row.gender === "" ||
        row.kilo === "" ||
        row.category === ""
    );
    if (rows.length === 0 || hasBlankParameter) {
      toast.warning("Please fill the details!");
    } else {
      let data;
      data = {
        UserId: UserId,
        isActive: "1",
        Id: eventId,
        recConfId: recruitId,
        recruitmentConfig: rows,
      };
      AddEventParameterData(data).then(() => {
        getAllRecruitData(
          rows,
          eventUnit,
          eventId,
          eventUnitId,
          categoryId
        ).then(setAllConfigEvent);
        // handleClose1();
        resetForm();
      });
    }
  };
  const GetEventPrameter = (eventId, categoryId) => {
    console.log(categoryId, "category name");
    // setCatName(categoryId);
    navigate("/addEventParameter", { state: { eventId, categoryId } });
  };

  const handleSearch = (e) => {
    const searchDataValue = e.target.value.toLowerCase();
    setSearchValue(searchDataValue);
    if (searchDataValue.trim() === "") {
      getAllData().then(setAllConfig);
    } else {
      const filterData = allConfig.filter(
        (config) =>
          config.post.toLowerCase().includes(searchDataValue) ||
          config.place.toLowerCase().includes(searchDataValue)
      );
      setAllConfig(filterData);
      setCurrentPage(1);
    }
  };

  const handleChange = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  // const handleInputChange = (index, event) => {
  //     const { name, value } = event.target;
  //     const newRows = [...rows];
  //     newRows[index][name] = value;
  //     setRows(newRows);
  //     console.log(newRows, "new rows");
  // };
  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const newRows = [...rows];

    // Update the corresponding row and field (minValue) based on the 'name' attribute
    newRows[index][name] = value;

    setRows(newRows);
    console.log(newRows, "new rows");
  };
  const resetForm = () => {
    setCId("");
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = allConfig.slice(indexOfFirstItem, indexOfLastItem);
  return (
    <>
      <div className="container-fluid p-3">
        <div className="card">
          <div className="card-header">
            <div className="row">
              <div className="col-lg-10 col-10">
                <h4 className="mt-2 text-start fw-bold mt-3">
                  Event Parameter
                </h4>
              </div>
              <div className="col-lg-2 col-2">
                <div
                  className="btn btn-add float-end"
                  title="Back"
                  onClick={() => navigate(-1)}
                >
                  <button
                    className="btn btn-md text-light "
                    type="button"
                    style={{ backgroundColor: "#1B5A90" }}
                  >
                    <ArrowBack />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-lg-6">
                <div className="row">
                  <div className="col-lg-4 col-4">
                    <label htmlFor="eventName" className="fw-bold">
                      Event Name :
                    </label>
                  </div>
                  <div className="col-lg-6 col-6">
                    <label htmlFor="eventName">{eventName}</label>
                  </div>
                </div>
                <div className="row mt-4">
                  <div className="col-lg-4 col-4">
                    <label htmlFor="eventUnit" className="fw-bold">
                      Event Unit :
                    </label>
                  </div>
                  <div className="col-lg-6 col-6">
                    <label htmlFor="eventUnit">{eventUnitName}</label>
                  </div>
                </div>
              </div>
            </div>

            <Table striped bordered hover className="mt-4">
              <thead>
                <tr>
                  <th style={headerCellStyle} className="text-white">
                    Min {eventName === "Shot Put" ? "(Mtr)" : "(Time)"}
                  </th>
                  <th style={headerCellStyle} className="text-white">
                    Max {eventName === "Shot Put" ? "(Mtr)" : "(Time)"}
                  </th>
                  <th style={headerCellStyle} className="text-white">
                    Gender
                  </th>
                  {eventName === "Shot Put" && (
                    <th style={headerCellStyle} className="text-white">
                      Weight(Kilo)
                    </th>
                  )}
                  <th style={headerCellStyle} className="text-white">
                    Score
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr key={index}>
                    <td>
                      <Form.Group className="form-group-sm">
                        {eventUnitName === "Time" ? (
                          <InputMask
                            mask="99:99:99:999"
                            placeholder="HH:MM:SS:MS"
                            alwaysShowMask={false}
                            value={row.minValue}
                            onChange={(e) => handleInputChange(index, e)} // Pass the index and event
                          >
                            {(inputProps) => (
                              <input
                                {...inputProps}
                                type="text"
                                className="form-control"
                                name="minValue" // Ensure 'name' matches the key you want to update
                              />
                            )}
                          </InputMask>
                        ) : (
                          <Form.Control
                            type="text"
                            name="minValue"
                            placeholder="Enter Min"
                            value={row.minValue}
                            onChange={(e) => {
                              const value = e.target.value;
                              // Allow numbers and one dot symbol
                              if (/^\d*\.?\d*$/.test(value)) {
                                handleInputChange(index, e);
                              }
                            }}
                          />
                        )}
                      </Form.Group>
                    </td>
                    <td>
                      <Form.Group className="form-group-sm">
                        {eventUnitName === "Time" ? (
                          <InputMask
                            mask="99:99:99:999"
                            placeholder="HH:MM:SS:MS"
                            alwaysShowMask={false}
                            value={row.maxValue}
                            onChange={(e) => handleInputChange(index, e)} // Pass the index and event
                          >
                            {(inputProps) => (
                              <input
                                {...inputProps}
                                type="text"
                                className="form-control"
                                name="maxValue" // Ensure 'name' matches the key you want to update
                              />
                            )}
                          </InputMask>
                        ) : (
                          <Form.Control
                            type="text"
                            name="maxValue"
                            placeholder="Enter Max"
                            value={row.maxValue}
                            onChange={(e) => {
                              const value = e.target.value;
                              // Allow numbers and one dot symbol
                              if (/^\d*\.?\d*$/.test(value)) {
                                handleInputChange(index, e);
                              }
                            }}
                          />
                        )}
                      </Form.Group>
                    </td>
                    <td>
                      <Form.Group className="form-group-sm">
                        <select
                          className="form-select"
                          name="gender"
                          placeholder="Enter Gender"
                          value={row.gender}
                          onChange={(e) => handleInputChange(index, e)}
                        >
                          <option value="" disabled>
                            Select Gender
                          </option>
                          {allGender.map((data, index) => (
                            <option key={index} value={data.pv_id}>
                              {data.pv_parametervalue}
                            </option>
                          ))}
                        </select>
                      </Form.Group>
                    </td>
                    {eventName === "Shot Put" && (
                      <td>
                        <Form.Group className="form-group-sm">
                          <Form.Control
                            type="text"
                            name="kilo"
                            placeholder="Enter Weight"
                            value={row.kilo} // Always provide a string value
                            onChange={(e) => {
                              const value = e.target.value;
                              // Allow numbers and one dot symbol
                              if (/^\d*\.?\d*$/.test(value)) {
                                handleInputChange(index, e);
                              }
                            }}
                          />
                        </Form.Group>
                      </td>
                    )}
                    <td>
                      <Form.Group className="form-group-sm">
                        <Form.Control
                          type="text"
                          name="score"
                          placeholder="Enter score"
                          value={row.score}
                          onChange={(e) => {
                            let value = e.target.value.replace(/[A-Za-z]/g, ""); // Remove letters only
                            value = value.slice(0, 6); // Limit to 4 characters
                            handleInputChange(index, { target: { name: "score", value } });
                          }}
                        />
                      </Form.Group>
                    </td>
                  </tr>
                ))}
                <tr>
                  <td colSpan="5" className="text-end">
                    <PlusCircleFill
                      style={{ fontSize: "30px", cursor: "pointer" }}
                      onClick={addRow}
                    />
                    <CancelRounded
                      style={{ fontSize: "35px", cursor: "pointer" }}
                      onClick={deleteRow}
                    />
                  </td>
                </tr>
              </tbody>
            </Table>
          </div>
          <div className="card-footer text-end">
            <Button
              className="text-light"
              style={{ backgroundColor: "#1B5A90" }}
              onClick={AddParameterEvent}
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddEventParameter;
