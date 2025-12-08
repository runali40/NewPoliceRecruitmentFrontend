import React, { useState, useEffect } from "react";
import { Table, Modal, Button, Form, Row, Col } from "react-bootstrap";
import { Add, Delete, Edit, Height, ArrowBack } from "@material-ui/icons";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { addParameterValue, deleteParameterValue, getAllParameterValueMasterData, getParameterValueMasterData } from "../../../Components/Api/ParameterValueMasterApi";
import { Pagination } from "../../../Components/Utils/Pagination";
import {
  toast
} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const ParameterValueMaster = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { pId, parameterName } = location.state || {};
  const [allParameterValue, setAllParameterValue] = useState([]);
  const [searchData, setSearchData] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedItemsPerPage, setSelectedItemsPerPage] = useState(10);
  const [showModal, setShowModal] = useState(false);

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [parameterValueName, setParameterValueName] = useState("");
  const [active, setActive] = useState(true);
  const [toggleActive, setToggleActive] = useState(true);
  const [parameterValueId, setParameterValueId] = useState("");
  const [paraName, setParameterName] = useState("")
  const [pvId, setPvId] = useState("")
  // const { id, parameterId, parameterValueNamee } = useParams();
  const headerCellStyle = {
    backgroundColor: "rgb(27, 90, 144)",
    color: "#fff",
  };

  useEffect(() => {
    getAllData();
  }, [currentPage, itemsPerPage, toggleActive]);

  const getAllData = () => {
    getAllParameterValueMasterData(pId, active, toggleActive).then((data) => {
      setAllParameterValue(data)
    }).catch((error) => {
      console.log(error)
    })
  };

  const handleChange = (e) => {
    setSelectedItemsPerPage(parseInt(e.target.value));
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  const handleClose = () => { setShowModal(false); resetForm() };
  const handleShow = () => setShowModal(true);

  const addParameterValueMaster = async () => {
    const recruitId = localStorage.getItem("recruitId");
    const UserId = localStorage.getItem("userId");
    let data;
    if (code === "") {
      toast.warning(" Please enter code!");
    } else if (parameterValueName === "") {
      toast.warning(" Please enter name!");
    } else {
      data = {
        userId: UserId,
        pv_parameterid: pId,
        pv_parametervalue: parameterValueName,
        pv_code: code,
        pv_parametername: parameterName,
        pv_isactive: active ? "1" : "2",
      };
      if (pvId !== null && pvId !== "") {
        data.pv_id = pvId;
      }

      // addParameterValue(data).then(() => {
      //   getAllData().then(setAllParameterValue);
      //   handleClose();
      // })
      try {
        await addParameterValue(data);
        await getAllData();;
        handleClose();
        resetForm();
      } catch (error) {
        console.error("Error adding parameter value:", error);
        // Handle error appropriately
      }
    }
  }

  const GetParameterValue = (pvId) => {
    handleShow();
    getParameterValueMasterData(pvId).then((data) => {
      if (data) {
        setCode(
          data.pv_code
        )
        setParameterValueName(data.
          pv_parametervalue
        )
        setPvId(data.pv_id
        )
      }
    })
  };


  const DeleteParameterValue = (pvId) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this parameter value?");
    if (!isConfirmed) return;
    deleteParameterValue(pvId).then(() => getAllData().then(setAllParameterValue));
  }

  const handleSearch = (e) => {
    const searchDataValue = e.target.value.toLowerCase();
    setSearchData(searchDataValue);

    if (searchDataValue.trim() === "") {
      // If search input is empty, fetch all data
      getAllData();
    } else {
      // Filter data based on search input value
      const filteredData = allParameterValue.filter(
        (parameterValue) =>
          parameterValue.pv_parametername.toLowerCase().includes(searchDataValue) ||
          parameterValue.pv_code.toLowerCase().includes(searchDataValue) ||
          parameterValue.pv_parametervalue.toLowerCase().includes(searchDataValue)

      );
      setAllParameterValue(filteredData);
      setCurrentPage(1);
    }
  };

  const resetForm = () => {
    setParameterName("");
    setCode("");
    setName("");
    setParameterValueName("");
    setParameterValueId("");
    setPvId("")
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = allParameterValue.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

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
                    <h4 className="card-title fw-bold">
                      Parameter Value Master
                    </h4>
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
                          setCode("");
                          setName("");
                          setParameterValueId("");
                          handleShow();
                        }}
                        style={{ backgroundColor: "#1B5A90" }}
                      >
                        <Add />
                      </Button>
                      <Button
                        // onClick={handleShow}
                        className="mx-2"
                        onClick={() => {
                          navigate(-1);
                        }}
                        style={{ backgroundColor: "#1B5A90" }}
                      >
                        <ArrowBack />
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
                  <div className="col-lg-3 col-md-3 d-flex justify-content-center justify-content-lg-end">
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
                        Code
                      </th>
                      <th scope="col" style={headerCellStyle}>
                        Name
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
                    {allParameterValue &&
                      currentItems
                        .sort((a, b) => a.pv_code.localeCompare(b.pv_code))  // Sorting by pv_parametervalue
                        .map((data, index) => {
                          return (
                            <tr key={data.pv_id}>
                              <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                              <td>{data.pv_code}</td>
                              <td>{data.pv_parametername}</td>
                              <td>{data.pv_parametervalue}</td>
                              <td>{data.pv_isactive}</td>
                              <td className="text-center">
                                <div className="d-flex justify-content-center align-items-center gap-2">
                                  <Edit
                                    className="text-success mr-2"
                                    type="button"
                                    // onClick={() => {
                                    //   GetParameterValue(data.pv_id);

                                    // }}
                                    style={{
                                      // marginLeft: "0.5rem",
                                      ...(data.pv_isactive === "Inactive" && {
                                        opacity: 0.5,  // Makes the icon appear faded
                                        cursor: "not-allowed", // Changes cursor to indicate disabled state
                                      }),
                                    }}
                                    onClick={data.pv_isactive === "Inactive" ? null : () => GetParameterValue(data.pv_id)}
                                  />
                                  {/* <Delete
                                    className="text-danger"
                                    type="button"
                                    style={{ marginLeft: "0.5rem" }}
                                    onClick={() => DeleteParameterValue(data.pv_id)}
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
                          );
                        })
                    }

                  </tbody>
                </Table>
                <div className="row mt-4 mt-xl-3">
                  <div className="col-lg-4 col-md-4 col-12">
                    <h6 className="text-lg-start text-center">
                      Showing {indexOfFirstItem + 1} to{" "}
                      {Math.min(indexOfLastItem, allParameterValue.length)} of{" "}
                      {allParameterValue.length} entries
                    </h6>
                  </div>
                  <div className="col-lg-4 col-md-4 col-12"></div>
                  <div className="col-lg-4 col-md-4 col-12 mt-3 mt-lg-0 mt-md-0">
                    <Pagination
                      currentPage={currentPage}
                      setCurrentPage={setCurrentPage}
                      allData={allParameterValue}
                      itemsPerPage={itemsPerPage}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal show={showModal} onHide={handleClose} size="md" backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>
            <h5 className="fw-bold">Add Parameter Value</h5>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col xs={12} sm={12} md={12} lg={12} className="mt-4 mt-lg-0">
                <Form.Group className="mb-3" controlId="code">
                  <Form.Label className="fw-bold"> Parameter Name:</Form.Label>{" "}
                  <span className="text-danger fw-bold">*</span>
                  <Form.Control
                    type="text"
                    placeholder="Enter Parameter Name"
                    value={parameterName}
                    onChange={(e) => setParameterName(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col xs={12} sm={12} md={6} lg={6} className="mt-4 mt-lg-0">
                <Form.Group className="mb-3" controlId="code">
                  <Form.Label className="fw-bold"> Code:</Form.Label>{" "}
                  <span className="text-danger fw-bold">*</span>
                  <Form.Control
                    type="text"
                    placeholder="Enter Code"
                    value={code}
                    // onChange={(e) => setCode(e.target.value)}
                    maxLength={4} // Restrict input length to 10 characters
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*$/.test(value)) {
                        setCode(value);
                      }
                    }}
                  />
                </Form.Group>
              </Col>
              <Col xs={12} sm={12} md={6} lg={6} className="mt-4 mt-lg-0">
                <Form.Group className="mb-3" controlId="name">
                  <Form.Label className="fw-bold">Name:</Form.Label>{" "}
                  <span className="text-danger fw-bold">*</span>
                  <Form.Control
                    type="text"
                    placeholder="Enter Name"
                    value={parameterValueName}
                    // onChange={(e) => setParameterValueName(e.target.value)}
                    maxLength={50} // Restrict input to 50 characters
                    onChange={(e) => {
                      const value = e.target.value;
                      // Allow only alphabetic characters (letters and spaces)
                      if (/^[a-zA-Z\s]*$/.test(value)) {
                        setParameterValueName(value);
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
              addParameterValueMaster();
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

export default ParameterValueMaster;
