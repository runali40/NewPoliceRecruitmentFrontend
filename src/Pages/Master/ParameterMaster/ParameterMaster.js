import React, { useState, useEffect } from "react";
import { Table, Modal, Button, Form, Row, Col } from "react-bootstrap";
import { Add, Delete, Edit, Height } from "@material-ui/icons";
import { useNavigate } from "react-router-dom";
import { addParameter, deleteParameter, getAllParameterMasterData, getParameterMasterData } from "../../../Components/Api/ParameterMasterApi";
import { Cursor } from "react-bootstrap-icons";
import { Pagination } from "../../../Components/Utils/Pagination";
import {
  toast
} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const ParameterMaster = () => {
  const navigate = useNavigate();
  const [allParameter, setAllParameter] = useState([]);
  const [searchData, setSearchData] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedItemsPerPage, setSelectedItemsPerPage] = useState(10);
  const [showModal, setShowModal] = useState(false);

  const [parameterName, setParameterName] = useState("");
  const [parameterCode, setParameterCode] = useState("");
  const [active, setActive] = useState(true);
  const [toggleActive, setToggleActive] = useState(true);
  const [parameterId, setParameterId] = useState("");
  const [pId, setPId] = useState("")
  const headerCellStyle = {
    backgroundColor: "rgb(27, 90, 144)",
    color: "#fff",
  };

  // const handleClose = () => setShowModal(false);
  // const handleShow = () => setShowModal(true);
  const handleShow = () => {
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);

  useEffect(() => {
    getAllData();
  }, [currentPage, itemsPerPage, toggleActive, active]);

  const getAllData = () => {
    getAllParameterMasterData(active, toggleActive).then((data) => {
      setAllParameter(data)
    }).catch((error) => {
      console.log(error);
    })
  };

  const addParameterMaster = async () => {
    const UserId = localStorage.getItem('userId');
    // const recruitId = localStorage.getItem("recruitId")
    let data;

    if (parameterCode === "") {
      toast.warning(" Please enter parameter code!");
    } else if (parameterName === "") {
      toast.warning(" Please enter parameter name!");
    } else {
      data = {
        UserId: UserId,
        p_parametername: parameterName,
        p_code: parameterCode,
        p_isactive: active ? "1" : "2",
      };

      if (pId !== null && pId !== "") {
        data.p_id = pId;
      }

      try {
        await addParameter(data);
        await getAllData();
        setParameterCode("");
        setParameterName("");
        handleClose();
        resetForm();
      } catch (error) {
        console.error("Error adding parameter:", error);
        // Handle error appropriately
      }
    }
  };


  const handleChange = (e) => {
    setSelectedItemsPerPage(parseInt(e.target.value));
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };


  const getParameter = (pId) => {
    handleShow();
    getParameterMasterData(pId).then((data) => {
      if (data) {
        setParameterCode(
          data.p_code)
        setParameterName(data.
          p_parametername)
        setPId(data.p_id)
      }
    })
  };

  const handleParameterNameClick = (pId, parameterName) => {
    navigate('/parameterValueMaster', { state: { pId, parameterName } });
  }
  const DeleteParameterMaster = (pId) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this parameter?");
    if (!isConfirmed) return;
    deleteParameter(pId).then(() => getAllData().then(setAllParameter));
  }

  const resetForm = () => {
    setParameterCode("");
    setParameterName("");
    setPId("");
  };
  const handleSearch = (e) => {
    const searchDataValue = e.target.value.toLowerCase();
    setSearchData(searchDataValue);

    if (searchDataValue.trim() === "") {
      // If search input is empty, fetch all data
      getAllData();
    } else {
      // Filter data based on search input value
      const filteredData = allParameter.filter(
        (parameter) =>
          parameter.p_code.toLowerCase().includes(searchDataValue) ||
          parameter.p_parametername.toLowerCase().includes(searchDataValue)
      );
      setAllParameter(filteredData);
      setCurrentPage(1);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = allParameter.slice(indexOfFirstItem, indexOfLastItem);

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
                    <h4 className="card-title fw-bold">Parameter Master</h4>
                  </div>
                  <div className="col-auto d-flex flex-wrap">
                    <div className="form-check form-switch mt-2 pt-1">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="flexSwitchCheckDefault"
                        checked={toggleActive}
                        onChange={() => setToggleActive(!toggleActive)}
                      />
                    </div>
                    <div className="btn btn-add" title="Add New">
                      <Button
                        // onClick={handleShow}
                        onClick={() => {
                          setParameterCode("");
                          setParameterName("");
                          setParameterId("");
                          handleShow();
                        }}
                        style={{ backgroundColor: "#1B5A90" }}
                      >
                        <Add />
                      </Button>
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
                      value={selectedItemsPerPage}
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
                      value={searchData}
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
                        Parameter Code
                      </th>
                      <th scope="col" style={headerCellStyle}>
                        Parameter Name
                      </th>
                      <th scope="col" style={headerCellStyle}>
                        Status
                      </th>
                      <th scope="col" className="text-center" style={headerCellStyle}>
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      allParameter.map((data, index) => {
                        return (
                          <tr key={data.p_id}>
                            <td> {(currentPage - 1) * itemsPerPage + index + 1}</td>
                            <td>{data.p_code}</td>
                            <td>
                              <button
                                className="btn btn-link p-0"
                                onClick={() => handleParameterNameClick(data.p_id, data.p_parametername)}
                                style={{ color: "#1B5A90"/* , textDecoration: "underline" */ }}
                              >
                                {data.p_parametername}
                              </button>
                            </td>
                            <td>{data.p_isactive}</td>
                            <td className="text-center">
                              <div className="d-flex justify-content-center align-items-center gap-">
                                <Edit
                                  className="text-success mr-2"
                                  type="button"
                                  // onClick={() => getParameter(data.p_id)}
                                  style={{
                                    // marginLeft: "0.5rem",
                                    ...(data.p_isactive === "Inactive" && {
                                      opacity: 0.5,  // Makes the icon appear faded
                                      cursor: "not-allowed", // Changes cursor to indicate disabled state
                                    }),
                                  }}
                                  onClick={data.p_isactive === "Inactive" ? null : () => getParameter(data.p_id)}
                                />

                                {/* <Delete
                                  className="text-danger"
                                  type="button"
                                  disabled={true}  
                                  style={{ marginLeft: "0.5rem" }}
                                  onClick={() => DeleteParameterMaster(data.p_id)}
                                  
                                /> */}
                                <Delete
                                  className="text-danger"
                                  type="button"
                                  // onClick={() => DeleteParameterMaster(data.p_id)}
                                  style={{
                                    marginLeft: "0.5rem",
                                    opacity: 0.5,  // Makes the icon appear faded
                                    cursor: 'not-allowed'  // Changes cursor to indicate disabled state
                                  }}
                                  disabled={true}  // Disables the icon
                                />
                              </div>
                            </td>
                          </tr>
                        )
                      })
                    }
                  </tbody>
                </Table>
                <div className="row mt-4 mt-xl-3">
                  <div className="col-lg-4 col-md-4 col-12 ">
                    <h6 className="text-lg-start text-center">
                      Showing {indexOfFirstItem + 1} to{" "}
                      {Math.min(indexOfLastItem, allParameter.length)} of{" "}
                      {allParameter.length} entries
                    </h6>
                  </div>
                  <div className="col-lg-4 col-md-4 col-12"></div>
                  <div className="col-lg-4 col-md-4 col-12 mt-3 mt-lg-0 mt-md-0">
                    <Pagination
                      currentPage={currentPage}
                      setCurrentPage={setCurrentPage}
                      allData={allParameter}
                      itemsPerPage={itemsPerPage}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal show={showModal} onHide={handleClose} size="lg" backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>
            <h5 className="fw-bold">Add Parameter</h5>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col xs={12} sm={12} md={6} lg={6} className="mt-2 mt-lg-0">
                <Form.Group className="mb-3" controlId="parameterCode">
                  <Form.Label className="fw-bold">Parameter Code:</Form.Label>{" "}
                  <span className="text-danger fw-bold">*</span>
                  <Form.Control
                    type="text"
                    placeholder="Enter Parameter Code"
                    value={parameterCode}
                    // onChange={(e) => setParameterCode(e.target.value)}
                    maxLength={4} // Restrict input length to 10 characters
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*$/.test(value)) {
                        setParameterCode(value);
                      }
                    }}
                  />
                </Form.Group>
              </Col>
              <Col xs={12} sm={12} md={6} lg={6} className="mt-2 mt-lg-0">
                <Form.Group className="mb-3" controlId="parameterName">
                  <Form.Label className="fw-bold">Parameter Name:</Form.Label>{" "}
                  <span className="text-danger fw-bold">*</span>
                  <Form.Control
                    type="text"
                    placeholder="Enter Parameter Name"
                    value={parameterName}
                    // onChange={(e) => setParameterName(e.target.value)}
                    maxLength={50} // Restrict input to 50 characters
                    onChange={(e) => {
                      const value = e.target.value;
                      // Allow only alphabetic characters (letters and spaces)
                      if (/^[a-zA-Z\s]*$/.test(value)) {
                        setParameterName(value);
                      }
                    }
                    }
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3" controlId="isActive">
              <Form.Check
                type="checkbox"
                label="Is Active"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            style={{ backgroundColor: "#1B5A90" }}
            onClick={() => {
              addParameterMaster();
            }}
          >
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
export default ParameterMaster;