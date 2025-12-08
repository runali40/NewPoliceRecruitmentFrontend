import React from "react";
import { Modal, Button, Row, Col, Form, Table } from "react-bootstrap";
import { PlusCircleFill } from "react-bootstrap-icons";
import {
  CancelRounded,
  Delete,
  DeleteForeverRounded,
} from "@material-ui/icons";
import AddMeasurementModal from "./ConfigMeasurementModal";
import {
  toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddCategoryModal = ({
  eventModal,
  handleClose1,
  eventName,
  setEventName,
  eventUnit,
  minvalue,
  setMinValue,
  setEventUnit,
  allEventUnit,
  rows,
  handleInputChange,
  handleMeasurementChange,
  addRow,
  deleteRow,
  AddConfigEvent,
  allGender,
  allCategory,
  DeleteCategoryData,
  GetConfigEvent,
  headerCellStyle,
  allMeasurement,
  AddMeasurement,
  GetMeasurement,
  readable,
  setReadable,
  title,
}) => {
  return (
    <>
      <Modal
        show={eventModal}
        onHide={handleClose1}
        size="lg"
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <h5 className="fw-bold">Add Category</h5>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table striped bordered hover className="mt-4">
            <thead>
              <tr>
                <th style={headerCellStyle} className="text-white">
                  Category Name
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={index}>
                  <td>
                    <Form.Group className="form-group-sm">
                      <Form.Control
                        type="text"
                        name="CategoryName"
                        placeholder="Enter Category"
                        value={row.CategoryName}
                        onChange={(e) => handleInputChange(index, e)}
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
        </Modal.Body>
        <Modal.Footer>
          <div className="col-lg-12 text-end">
            <Button
              className="text-light"
              style={{ backgroundColor: "#1B5A90" }}
              onClick={
                eventUnit === "4efe01a7-7a98-417a-ae17-15e394de7163"
                  ? AddMeasurement
                  : AddConfigEvent
              }
            >
              Save
            </Button>
            <Button variant="secondary" className="mx-2" onClick={handleClose1}>
              Close
            </Button>
          </div>
        </Modal.Footer>
        <Modal.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th style={headerCellStyle} className="text-white">
                  Category Name
                </th>
                <th style={headerCellStyle} className="text-white">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {allCategory.map((data, index) => (
                <tr key={data.Id}>
                  <td>{data.CategoryName}</td>

                  <td>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm ms-2"
                      onClick={() => GetConfigEvent(data.Id, data.CategoryName)}
                    >
                      Add Event
                    </button>
                    <Delete
                      className="text-danger mr-2"
                      type="button"
                      style={{ marginLeft: "0.5rem" }}
                      onClick={() => DeleteCategoryData(data.Id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>
      </Modal>


    </>
  );
};

export default AddCategoryModal;
