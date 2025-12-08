import React, { useState, useEffect } from "react";
import { Card, Button, Row, Col, Form, Table } from "react-bootstrap";
import { PlusCircleFill } from "react-bootstrap-icons";
import { ArrowBack, CancelRounded, Delete, Edit } from "@material-ui/icons";
import AddMeasurementModal from "./ConfigMeasurementModal";
import {
  addConfigEvent,
  addConfigMeasurement,
  deleteEvent,
  getAllEvent,
  getAllEventUnit,
  getAllGender,
  getAllMeasurement,
  getAllRecruitData,
} from "../../Components/Api/ConfigurationApi";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddEventPage = ({ eventModal, handleClose1 }) => {
  const headerCellStyle = {
    backgroundColor: "rgb(27, 90, 144)",
    color: "#fff",
  };
  const navigate = useNavigate();
  const location = useLocation();
  const { catId, categoryName } = location.state || {};
  console.log("category name", categoryName);
  const [eventName, setEventName] = useState("");
  const [eventUnit, setEventUnit] = useState("");
  const [allEventUnit, setAllEventUnit] = useState([]);
  const [allGender, setAllGender] = useState([]);
  const [allConfigEvent, setAllConfigEvent] = useState([]);
  const [measurementId, setMeasurementId] = useState("");
  const [readable, setReadable] = useState(true);
  const [allMeasurement, setAllMeasurement] = useState([
    {
      perticulars: "",
      minvalue: "",
      gender: "",
    },
  ]);
  const [rows, setRows] = useState([
    {
      /* id: uuidv4(), */ minValue: "",
      maxValue: "",
      score: "",
      gender: "",
      category: categoryName,
    },
  ]);

  useEffect(() => {
    if (eventUnit === "4efe01a7-7a98-417a-ae17-15e394de7163") {
      getAllMeasurement()
        .then(setAllMeasurement)
        .catch((error) => {
          console.error("Error fetching measurements:", error);
        });
    }
  }, [eventUnit]);
  useEffect(() => {
    const fetchConfigEventData = async () => {
      try {
        // Check if eventUnit is not empty and not the excluded value
        if (eventUnit && eventUnit !== "4efe01a7-7a98-417a-ae17-15e394de7163") {
          const configEventData = await getAllEvent(catId, eventUnit);
          setAllConfigEvent(configEventData);
        }
      } catch (error) {
        console.error("Error fetching config event data:", error);
      }
    };

    fetchConfigEventData();
  }, [eventUnit]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // First, fetch all genders
        const gender = await getAllGender();
        setAllGender(gender);

        // Then, fetch all event units
        const allEventUnit = await getAllEventUnit();
        setAllEventUnit(allEventUnit);

        // resetForm();
        // setCId("")
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);
  const AddConfigEvent = () => {
    const recruitId = localStorage.getItem("recruitId");
    const UserId = localStorage.getItem("userId");
    let data;
    if (eventName === "" || eventUnit === "") {
      toast.warning("Please fill the details");
    } else {
      data = {
        UserId: UserId,
        isActive: "1",
        eventName: eventName,
        eventUnit: eventUnit,
        RecruitId: recruitId,
        //   gender: eventGender.label,
        recConfId: recruitId,
        categoryId: catId,
        // recConfId: catId,
        recruitmentConfig: [],
      };
      addConfigEvent(data).then(() => {
        getAllEvent(catId, eventUnit).then(setAllConfigEvent);
        // handleClose1();
        // resetForm();
      });
    }
  };

  const DeleteEvent = async (eventId, eventUnit) => {
    try {
      await deleteEvent(eventId);
      const updatedData = await getAllEvent(catId, eventUnit);

      setAllConfigEvent(updatedData);
    } catch (error) {
      console.error("Error deleting event or fetching updated data:", error);
    }
  };
  const GetEventPrameter = (
    eventId,
    categoryName,
    eventUnitId,
    categoryId,
    eventName,
    eventUnitName
  ) => {
    console.log(categoryName, "category name");
    // setCatName(categoryId);
    navigate("/addEventParameter", {
      state: {
        eventId,
        categoryName,
        eventUnitId,
        categoryId,
        eventName,
        eventUnitName,
      },
    });
  };
  return (
    <>
      <div className="container-fluid p-3">
        {" "}
        <Card className="mb-4">
          <Card.Header>
            <div className="row">
              <div className="col-lg-10 col-10">
                <h5 className="fw-bold mt-3">Add Event</h5>
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
          </Card.Header>
          <Card.Body>
            <Row>
              <Col xs={12} sm={12} md={4} lg={4}>
                <Form.Group className="form-group-sm">
                  <Form.Label className="control-label fw-bold">
                    Event Name:
                  </Form.Label>
                </Form.Group>
              </Col>
              <Col xs={12} sm={12} md={4} lg={4}>
                <Form.Group className="form-group-sm">
                  <Form.Control
                    type="text"
                    id="eventName"
                    name="eventName"
                    placeholder="Enter Event Name"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mt-4">
              <Col xs={12} sm={12} md={4} lg={4}>
                <Form.Group className="form-group-sm">
                  <Form.Label className="control-label fw-bold">
                    Event Unit:
                  </Form.Label>
                </Form.Group>
              </Col>
              <Col xs={12} sm={12} md={4} lg={4}>
                <Form.Group className="form-group-sm">
                  <select
                    className="form-select"
                    value={eventUnit}
                    onChange={(e) => {
                      console.log(eventUnit, "eventUnit");
                      setEventUnit(e.target.value);
                    }}
                  >
                    <option value="" disabled>
                      Select Event Unit
                    </option>
                    {allEventUnit.map((data, index) => (
                      <option key={index} value={data.pv_id}>
                        {data.pv_parametervalue}
                      </option>
                    ))}
                  </select>
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
          <Card.Footer className="text-end">
            <Button
              className="text-light"
              style={{ backgroundColor: "#1B5A90" }}
              onClick={AddConfigEvent}
            >
              Save
            </Button>
            {/* <Button variant="secondary" className="mx-2" onClick={handleClose1}>
                        Close
                    </Button> */}
          </Card.Footer>
          <Card.Body>
            {eventUnit === "4efe01a7-7a98-417a-ae17-15e394de7163" ? (
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th style={headerCellStyle} className="text-white">
                      Parameter Name
                    </th>
                    <th style={headerCellStyle} className="text-white">
                      Value
                    </th>
                    <th style={headerCellStyle} className="text-white">
                      Gender
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {allMeasurement.map((data, index) => (
                    <tr key={data.Id}>
                      <td>{data.perticulars}</td>
                      <td>{data.minvalue}</td>
                      <td>{data.gender}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th style={headerCellStyle} className="text-white">
                      Event Parameter
                    </th>
                    <th style={headerCellStyle} className="text-white">
                      Event Unit
                    </th>
                    <th style={headerCellStyle} className="text-white">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {allConfigEvent.map((data, index) => (
                    <tr key={data.Id}>
                      <td>{data.eventName}</td>
                      <td>{data.eventUnit}</td>
                      <td>
                        <div className="d-flex ms-2">
                          <Button
                            type="button"
                            className="btn btn-primary btn-sm ms-2"
                            onClick={() =>
                              GetEventPrameter(
                                data.Id,
                                data.CategoryName,
                                data.eventunitId,
                                data.categoryId,
                                data.eventName,
                                data.eventUnit
                              )
                            }
                          >
                            Add Parameter
                          </Button>
                          <Delete
                            className="text-danger mr-2"
                            type="button"
                            style={{ marginLeft: "0.5rem" }}
                            onClick={() => DeleteEvent(data.Id, eventUnit)}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Card.Body>
        </Card>
      </div>
    </>
  );
};

export default AddEventPage;
