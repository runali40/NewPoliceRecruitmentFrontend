
import React from 'react';
import { Modal, Button, Row, Col, Form, Table } from 'react-bootstrap';
import { PlusCircleFill } from 'react-bootstrap-icons';
import { CancelRounded, Delete, DeleteForeverRounded } from '@material-ui/icons';
import AddMeasurementModal from './ConfigMeasurementModal';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const AddEventModal = ({
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
  allConfigEvent,
  DeleteEvent,
  headerCellStyle,
  allMeasurement,
  AddMeasurement,
  GetMeasurement,
  readable,
  setReadable,
  title
}) => {
  return (
    <>
    <Modal show={eventModal} onHide={handleClose1} size="xl" backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>
          <h5 className="fw-bold">Add Event</h5>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col xs={12} sm={12} md={12} lg={4}>
            <Form.Group className="form-group-sm">
              <Form.Label className="control-label fw-bold">Event Name:</Form.Label>
            </Form.Group>
          </Col>
          <Col xs={12} sm={12} md={12} lg={4}>
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
          <Col xs={12} sm={12} md={12} lg={4}>
            <Form.Group className="form-group-sm">
              <Form.Label className="control-label fw-bold">Event Unit:</Form.Label>
            </Form.Group>
          </Col>
          <Col xs={12} sm={12} md={12} lg={4}>
            <Form.Group className="form-group-sm">
              <select
                className="form-select"
                value={eventUnit}
                onChange={(e) =>{
                  console.log(eventUnit,"eventUnit")
                  setEventUnit(e.target.value)}}
              >
                <option value="" disabled>Select Event Unit</option>
                {allEventUnit.map((data, index) => (
                  <option key={index} value={data.pv_id}>{data.pv_parametervalue}</option>
                ))}
              </select>
            </Form.Group>
          </Col>
        </Row>
        <hr />

        {eventUnit === "4efe01a7-7a98-417a-ae17-15e394de7163" ? (
          <AddMeasurementModal
            eventModal={eventModal}
            handleClose1={handleClose1}
            eventName={eventName}
            setEventName={setEventName}
            eventUnit={eventUnit}
            setEventUnit={setEventUnit}
            allEventUnit={allEventUnit}
            allMeasurement={allMeasurement}
            handleInputChange={handleInputChange}
            handleMeasurementChange={handleMeasurementChange}
            addRow={addRow}
            AddConfigEvent={AddConfigEvent}
            allGender={allGender}
            allConfigEvent={allConfigEvent}
            DeleteEvent={DeleteEvent}
            headerCellStyle={headerCellStyle}
            GetMeasurement={GetMeasurement}
            AddMeasurement={AddMeasurement}
            readable={readable}
            setReadable={setReadable}
          />
        ) : (
          <>
            <h5 className="mt-4 text-start fw-bold">Event Parameter</h5>
            <Table striped bordered hover className="mt-4">
              <thead>
                <tr>
                  <th style={headerCellStyle} className='text-white'>Category</th>
                  <th style={headerCellStyle} className='text-white'>Min</th>
                  <th style={headerCellStyle} className='text-white'>Max</th>
                  <th style={headerCellStyle} className='text-white'>Gender</th>
                  <th style={headerCellStyle} className='text-white'>Score</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr key={index}>
                    <td>
                      <Form.Group className="form-group-sm">
                        <Form.Control
                          type="text"
                          name="category"
                          placeholder="Enter Category"
                          disabled
                          value={row.category}
                          onChange={(e) => handleInputChange(index, e)}
                        />
                      </Form.Group>
                    </td>
                    <td>
                      <Form.Group className="form-group-sm">
                        <Form.Control
                          type="text"
                          name="minValue"
                          placeholder="Enter Min"
                          value={row.min}
                          onChange={(e) => handleInputChange(index, e)}
                        />
                      </Form.Group>
                    </td>
                    <td>
                      <Form.Group className="form-group-sm">
                        <Form.Control
                          type="text"
                          name="maxValue"
                          placeholder="Enter Max"
                          value={row.max}
                          onChange={(e) => handleInputChange(index, e)}
                        />
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
                          <option value="" disabled>Select Gender</option>
                          {allGender.map((data, index) => (
                            <option key={index} value={data.pv_id}>{data.pv_parametervalue}</option>
                          ))}
                        </select>
                      </Form.Group>
                    </td>
                    <td>
                      <Form.Group className="form-group-sm">
                        <Form.Control
                          type="text"
                          name="score"
                          placeholder="Enter score"
                          value={row.score}
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
          </>

        )}
      </Modal.Body>
      <Modal.Footer>
        <div className="col-lg-12 text-end">
          <Button className="text-light" style={{ backgroundColor: "#1B5A90" }} onClick={eventUnit === "4efe01a7-7a98-417a-ae17-15e394de7163" ? AddMeasurement : AddConfigEvent}>
            Save
          </Button>
          <Button variant="secondary" className="mx-2" onClick={handleClose1}>
            Close
          </Button>
        </div>
      </Modal.Footer>
      <Modal.Body>
        {
          eventUnit === "4efe01a7-7a98-417a-ae17-15e394de7163" ?
            (
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th style={headerCellStyle} className='text-white'>Parameter Name</th>
                    <th style={headerCellStyle} className='text-white'>Value</th>
                    <th style={headerCellStyle} className='text-white'>Gender</th>
                    {/* <th style={headerCellStyle} className='text-white'>Action</th> */}
                  </tr>
                </thead>
                <tbody>
                  {allMeasurement.map((data, index) => (
                    <tr key={data.Id}>
                      <td>{data.perticulars}</td>
                      <td>{data.minvalue}</td>
                      <td>{data.gender}</td>
                      {/* <td>
                        <Delete
                          className="text-danger mr-2"
                          type="button"
                          style={{ marginLeft: "0.5rem" }}
                          onClick={() => DeleteEvent(data.Id)}
                        />
                      </td> */}
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) :
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th style={headerCellStyle} className='text-white'>Event Parameter</th>
                  <th style={headerCellStyle} className='text-white'>Event Unit</th>
                  <th style={headerCellStyle} className='text-white'>Min</th>
                  <th style={headerCellStyle} className='text-white'>Max</th>
                  <th style={headerCellStyle} className='text-white'>Gender</th>
                  <th style={headerCellStyle} className='text-white'>category</th>
                  <th style={headerCellStyle} className='text-white'>Score</th>
                  <th style={headerCellStyle} className='text-white'>Action</th>
                </tr>
              </thead>
              <tbody>
                {allConfigEvent.map((data, index) => (
                  <tr key={data.Id}>
                    <td>{data.eventName}</td>
                    <td>{data.eventUnit}</td>
                    <td>{data.minValue}</td>
                    <td>{data.maxValue}</td>
                    <td>{data.gender}</td>
                    <td>{data.category}</td>
                    <td>{data.score}</td>
                    <td>
                      <Delete
                        className="text-danger mr-2"
                        type="button"
                        style={{ marginLeft: "0.5rem" }}
                        onClick={() => DeleteEvent(data.Id, eventUnit)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
        }

      </Modal.Body>
    </Modal>
    </>
    
  );
};

export default AddEventModal;
