import React, { useState, useEffect } from "react";
import { Button, Modal, Table } from "react-bootstrap";
import { Add, Delete, Edit } from "@material-ui/icons";
import { Pagination } from "../../Components/Utils/Pagination";
import {
  addConfig,
  addConfigEvent,
  addConfigMeasurement,
  deleteConfig,
  deleteEvent,
  getAllData,
  getAllEventUnit,
  getAllGender,
  getAllMeasurement,
  getAllRecruitData,
  getConfig,
} from "../../Components/Api/ConfigurationApi";
import AddConfigModal from "./ConfigModal";
import AddEventModal from "./ConfigEventModal";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Configuration = () => {
  const navigate = useNavigate();
  const RoleName = localStorage.getItem("RoleName");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [eventModal, setEventModal] = useState(false);
  const [eventName, setEventName] = useState("");
  const [eventUnit, setEventUnit] = useState("");
  const [minvalue, setMinvalue] = useState("");
  const [toggleActive, setToggleActive] = useState(true);
  const [cId, setCId] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [post, setPost] = useState("");
  const [place, setPlace] = useState("");
  const [year, setYear] = useState("");
  const [seat, setSeat] = useState("")
  const [allConfig, setAllConfig] = useState([]);
  const [allConfigEvent, setAllConfigEvent] = useState([]);
  const [allEventUnit, setAllEventUnit] = useState([]);
  const [allGender, setAllGender] = useState([]);
  const [measurementId, setMeasurementId] = useState("");
  const [readable, setReadable] = useState(true);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [startDate, setStartDate] = useState("");
  const [noOfCandidate, setNoOfCandidate] = useState("")
  const [userNameShow, setUserNameShow] = useState(false);
  const [deleteDisable, setDeleteDisable] = useState(false)
  const handleUserNameClose = () => { setUserNameShow(false); resetForm() };
  const handleUserNameShow = () => setUserNameShow(true);

  const [allMeasurement, setAllMeasurement] = useState([
    {
      perticulars: "",
      minvalue: "",
      gender: "",
    },
  ]);
  const isRoleAdmin = RoleName === "Admin";
  const handleShow = () => {
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    resetForm();
  };

  const handleClose1 = () => {
    setEventModal(false);
    setAllConfigEvent([]);
    resetForm();
  };

  const headerCellStyle = {
    backgroundColor: "rgb(27, 90, 144)",
    color: "#fff",
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data in sequence
        const allConfig = await getAllData();
        setAllConfig(allConfig);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (eventUnit === "4efe01a7-7a98-417a-ae17-15e394de7163") {
      getAllMeasurement()
        .then(setAllMeasurement)
        .catch((error) => {
          console.error("Error fetching measurements:", error);
        });
    }
  }, [eventUnit]);

  // useEffect(() => {
  //   getAllRecruitData(cId, rows, eventUnit).then(setAllConfigEvent);
  // }, [eventUnit])

  useEffect(() => {
    const fetchConfigEventData = async () => {
      try {
        // Check if eventUnit is not empty and not the excluded value
        if (eventUnit && eventUnit !== "4efe01a7-7a98-417a-ae17-15e394de7163") {
          const configEventData = await getAllRecruitData(cId, rows, eventUnit);
          setAllConfigEvent(configEventData);
        }
      } catch (error) {
        console.error("Error fetching config event data:", error);
      }
    };

    fetchConfigEventData();
  }, [eventUnit]);

  const AddConfig = () => {
    const recruitId = localStorage.getItem("recruitId");
    const UserId = localStorage.getItem("userId");
    let data;
    data = {
      UserId: UserId,
      RecruitId: recruitId,
      post: post,
      place: place,
      year: year,
      noofseats: seat,
      noOfCandidate: noOfCandidate,
      startDate: startDate
    };
    if (cId) {
      data.id = cId;
    }
    if (post === "" || place === "" || year === "" || seat === "" || noOfCandidate === "" || startDate === "") {
      toast.warning("Please fill data in all fields");
    } else {
      addConfig(data).then((response) => {
        if (response && response.data) {
          const userName = response.data[0].UserNamee;
          const password = response.data[0].DecryptedPass;

          // Set the username and password in the state
          setUserName(userName);
          setPassword(password);
          if (!cId) {
            handleUserNameShow();
          }

          // Display the modal with the credentials
          getAllData().then(setAllConfig);
          handleClose();
          resetForm();
        }
      });
    }
  };
  const GetMeasurement = (id) => {
    setMeasurementId(id);
  };

  const AddMeasurement = () => {
    const recruitId = localStorage.getItem("recruitId");
    const UserId = localStorage.getItem("userId");
    const selectedMeasurement = allMeasurement.find(
      (data) => data.c_id === measurementId
    );
    const minvalue = selectedMeasurement ? selectedMeasurement.minvalue : null;

    if (minvalue) {
      let data = {
        UserId: UserId,
        c_id: measurementId,
        minvalue: minvalue,
        RecruitId: recruitId,
      };
      addConfigMeasurement(data).then(() => {
        getAllMeasurement(measurementId).then(setAllMeasurement);
        resetForm();
      });
    } else {
      console.log("No measurement selected");
    }
  };

  const GetConfig = (cId) => {
    handleShow();
    getConfig(cId).then((data) => {
      console.log(data, "192")
      if (data) {
        setPost(data.post);
        setPlace(data.place);
        setYear(data.year);
        setSeat(data.NoOfSeats);
        setStartDate(data.startDate ? (data.startDate).split("T")[0] || "" : null)
        setNoOfCandidate(data.noOfCandidate !== null ? data.noOfCandidate : null);
        setCId(cId);
      }
    });
  };

  const DeleteConfiguration = (cId) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this recruitment?");
    if (!isConfirmed) return;
    deleteConfig(cId).then(() => getAllData().then(setAllConfig));
  };

  const GetConfigCategory = (cId) => {
    navigate("/addCategoryPage", { state: { cId } });
    // localStorage.setItem("recruitId", cId)
    setCId(cId);
  };

  const AddConfigEvent = () => {
    const recruitId = localStorage.getItem("recruitId");
    const UserId = localStorage.getItem("userId");
    let data;
    data = {
      UserId: UserId,
      isActive: "1",
      eventName: eventName,
      eventUnit: eventUnit,
      // RecruitId: recruitId,
      //   gender: eventGender.label,
      // recConfId: cId,
      recConfId: recruitId,
      recruitmentConfig: rows,
    };
    addConfigEvent(data).then(() => {
      getAllRecruitData(cId, rows, eventUnit).then(setAllConfigEvent);
      // handleClose1();
      resetForm();
    });
  };
  const DeleteEvent = async (eventId, eventUnit) => {
    try {
      await deleteEvent(eventId);
      const updatedData = await getAllRecruitData(cId, rows, eventUnit);
      setAllConfigEvent(updatedData);
    } catch (error) {
      console.error("Error deleting event or fetching updated data:", error);
    }
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

  const [rows, setRows] = useState([
    {
      /* id: uuidv4(), */ minValue: "",
      maxValue: "",
      score: "",
      gender: "",
      category: "",
    },
  ]);

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const newRows = [...rows];
    newRows[index][name] = value;
    setRows(newRows);
    console.log(newRows, "new rows");
  };

  const handleMeasurementChange = (index, event) => {
    const { name, value } = event.target;
    const newRows1 = [...allMeasurement];
    newRows1[index][name] = value;
    setAllMeasurement(newRows1);
    console.log(newRows1, "new rows");
  };

  const resetForm = () => {
    setPost("");
    setPlace("");
    setYear("");
    setEventName("");
    setCId("");
    setEventUnit("");
    setNoOfCandidate("");
    setStartDate("");
    setSeat("");
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = allConfig.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <>
      <div className="container-fluid">
        <div
          className="card m-3"
          style={{ boxShadow: "0px 1px 5px rgba(0, 0, 0, 0.1)" }}
        >
          <div className="row">
            <div className="col-lg-12">
              <div className="card-header">
                <div className="row align-items-center">
                  <div className="col">
                    <h4 className="card-title fw-bold mt-2">Recruitment</h4>
                  </div>
                  <div className="col-auto d-flex flex-wrap">
                    <div className="form-check form-switch mt-2 pt-1">
                      <input
                        className="form-check-input d-none"
                        type="checkbox"
                        id="flexSwitchCheckDefault"
                        checked={toggleActive} // Bind the checked state to the state variable
                        onChange={() => setToggleActive(!toggleActive)}
                      />
                    </div>
                    <div className="btn btn-add" title="Add New">
                      <button
                        type="button"
                        // className="btn btn-primary"
                        style={{ backgroundColor: "#1B5A90" }}
                        onClick={handleShow}
                        // disabled={RoleName === "Admin"}
                        className={`btn btn-primary ${RoleName === "Admin" ? "d-none" : "d-block"
                          }`}
                      >
                        <Add />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-body pt-3">
                <div className="row">
                  <div className="col-lg-3 col-md-3 d-flex justify-content-center justify-content-lg-start justify-content-md-start">
                    <h6 className="mt-2">Show</h6>&nbsp;&nbsp;
                    <select
                      style={{ height: "35px" }}
                      className="form-select w-auto"
                      aria-label="Default select example"
                      value={itemsPerPage}
                      onChange={handleChange}
                    >
                      <option value="10">10</option>
                      <option value="50">50</option>
                      <option value="100">100</option>
                    </select>
                    &nbsp;&nbsp;
                    <h6 className="mt-2">entries</h6>
                  </div>
                  <div className="col-lg-6 col-md-6 d-flex justify-content-center justify-content-lg-end"></div>
                  <div className="col-lg-3 col-md-3 d-flex justify-content-center justify-content-lg-end mt-lg-0 mt-md-0 mt-3">
                    <input
                      className="form-control"
                      placeholder="Search here"
                      value={searchValue}
                      onChange={handleSearch}
                    />
                  </div>
                </div>
                <br />
                <Table striped hover responsive className="border text-left">
                  <thead>
                    <tr>
                      <th scope="col" style={headerCellStyle}>
                        Sr.No
                      </th>
                      <th scope="col" style={headerCellStyle}>
                        Place
                      </th>
                      <th scope="col" style={headerCellStyle}>
                        Post
                      </th>
                      <th scope="col" style={headerCellStyle}>
                        Start Date
                      </th>
                      <th scope="col" style={headerCellStyle}>
                        Year
                      </th>
                      <th scope="col" style={headerCellStyle}>
                        No of Seats
                      </th>
                      <th scope="col" style={headerCellStyle}>
                        No. of Candidates
                      </th>
                      <th scope="col" className="text-center" style={headerCellStyle}>
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((data, index) => {
                      return (
                        <tr key={data.Id}>
                          <td>
                            {" "}
                            {(currentPage - 1) * itemsPerPage + index + 1}
                          </td>
                          <td>{data.place}</td>
                          {/* <td>{data.startDate.split("T")[0]}</td> */}

                          <td>{data.post}</td>
                          <td>{data.startDate != null ? data.startDate.split("T")[0] : data.startDate}</td>
                          <td>{data.year}</td>
                          <td>{data.NoOfSeats}</td>
                          <td>{data.noOfCandidate}</td>
                          <td className="text-center">
                            <div className="d-flex justify-content-center align-items-center gap-2">
                              <Edit
                              type="button"
                                className={`text-success ${isRoleAdmin ? "d-none" : ""}`}
                                style={{ opacity: isRoleAdmin ? 0.5 : 1 }}
                                onClick={() => (isRoleAdmin ? null : GetConfig(data.Id))}
                              />
                              <button
                                type="button"
                                className="btn btn-primary btn-sm"
                                onClick={() => GetConfigCategory(data.Id)}
                              >
                                Add Category
                              </button>
                              <Delete
                               className={`text-danger ${isRoleAdmin ? "d-none" : ""}`}
                                // className="text-danger"
                                type="button"
                                disabled={deleteDisable}
                                style={{ opacity: deleteDisable ? 0.5 : 1, cursor: deleteDisable ? 'not-allowed' : 'pointer' }}
                                onClick={() => DeleteConfiguration(data.Id)}
                              />
                            </div>
                          </td>

                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
                <div className="row mt-4 mt-xl-3">
                  <div className="col-lg-4 col-md-4 col-12 ">
                    <h6 className="text-lg-start text-center">
                      Showing {indexOfFirstItem + 1} to{" "}
                      {Math.min(indexOfLastItem, allConfig.length)} of{" "}
                      {allConfig.length} entries
                    </h6>
                  </div>
                  <div className="col-lg-4 col-md-4 col-12 "></div>
                  <div className="col-lg-4 col-md-4 col-12 mt-3 mt-lg-0 mt-lg-0">
                    <Pagination
                      currentPage={currentPage}
                      setCurrentPage={setCurrentPage}
                      allData={allConfig}
                      itemsPerPage={itemsPerPage}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AddConfigModal
        showModal={showModal}
        handleClose={handleClose}
        post={post}
        setPost={setPost}
        place={place}
        setPlace={setPlace}
        year={year}
        setYear={setYear}
        seat={seat}
        setSeat={setSeat}
        startDate={startDate}
        setStartDate={setStartDate}
        noOfCandidate={noOfCandidate}
        setNoOfCandidate={setNoOfCandidate}
        AddConfig={AddConfig}
        // handleUserNameShow={handleUserNameShow}
        resetForm={resetForm}
      />
      <AddEventModal
        eventModal={eventModal}
        handleClose1={handleClose1}
        eventName={eventName}
        setEventName={setEventName}
        eventUnit={eventUnit}
        setEventUnit={setEventUnit}
        allEventUnit={allEventUnit}
        rows={rows}
        allMeasurement={allMeasurement}
        handleInputChange={handleInputChange}
        handleMeasurementChange={handleMeasurementChange}
        AddConfigEvent={AddConfigEvent}
        allGender={allGender}
        allConfigEvent={allConfigEvent}
        DeleteEvent={DeleteEvent}
        GetMeasurement={GetMeasurement}
        AddMeasurement={AddMeasurement}
        minvalue={minvalue}
        setMinvalue={setMinvalue}
        readable={readable}
        setReadable={setReadable}
        headerCellStyle={{
          textAlign: "start",
          backgroundColor: "rgb(27, 90, 144)",
        }}
      />
      <Modal show={userNameShow} onHide={handleUserNameClose}>
        <Modal.Header closeButton>
          <Modal.Title><h5><b>Credentials</b></h5></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <b>Username</b>: {userName}
          <br />
          <b>Password</b>: {password}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleUserNameClose}>
            Save
          </Button>
          <Button variant="secondary" onClick={resetForm}>
            Clear
          </Button>
        </Modal.Footer>
      </Modal>

    </>
  );
};

export default Configuration;
