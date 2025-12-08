import React from "react";
import { Modal, Button, Row, Col, Form } from "react-bootstrap";

const AddConfigModal = ({
  showModal,
  handleClose,
  post,
  setPost,
  place,
  setPlace,
  year,
  setYear,
  seat,
  setSeat,
  AddConfig,
  startDate,
  setStartDate,
  noOfCandidate,
  setNoOfCandidate,
  handleUserNameShow,
  resetForm,
}) => {
  return (
    <Modal show={showModal} onHide={handleClose} size="lg" backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>
          <h5 className="fw-bold">Add Recruitment</h5>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col xs={12} sm={12} md={12} lg={6}>
            <Form.Group className="form-group-sm">
              <Form.Label className="control-label fw-bold">Place:</Form.Label>
              <span className="text-danger fw-bold">*</span>
              <Form.Control
                type="text"
                id="place"
                name="place"
                placeholder="Enter Place"
                value={place}
                // onChange={(e) => setPlace(e.target.value)}
                maxLength={50} // Restrict input to 50 characters
                onChange={(e) => {
                  const value = e.target.value;
                  // Allow only alphabetic characters (letters and spaces)
                  if (/^[a-zA-Z\s]*$/.test(value)) {
                    setPlace(value);
                  }
                }
                }

              />
            </Form.Group>
          </Col>
          <Col xs={12} sm={12} md={12} lg={6}>
            <Form.Group className="form-group-sm">
              <Form.Label className="control-label fw-bold">Post:</Form.Label>
              <span className="text-danger fw-bold">*</span>
              <Form.Control
                type="text"
                id="post"
                name="post"
                placeholder="Enter Post"
                value={post}
                // onChange={(e) => setPost(e.target.value)}
                maxLength={50} // Restrict input to 50 characters
                onChange={(e) => {
                  const value = e.target.value;
                  // Allow only alphabetic characters (letters and spaces)
                  if (/^[a-zA-Z\s]*$/.test(value)) {
                    setPost(value);
                  }
                }
                }
              />
            </Form.Group>
          </Col>
        </Row>
        <Row className="mt-4">
          <Col xs={12} sm={12} md={12} lg={6}>
            <Form.Group className="form-group-sm">
              <Form.Label className="control-label fw-bold">No of seats:</Form.Label>
              <span className="text-danger fw-bold">*</span>
              <Form.Control
                type="text"
                id="seats"
                name="seats"
                placeholder="Enter Seats"
                value={seat}
                // onChange={(e) => setSeat(e.target.value)}
                maxLength={10} // Restrict input length to 10 characters
                onChange={(e) => {
                  const value = e.target.value;
                  // Allow only numeric characters
                  if (/^\d*$/.test(value)) {
                    setSeat(value);
                  }
                }}
              />
            </Form.Group>
          </Col>
          <Col xs={12} sm={12} md={12} lg={6}>
            <Form.Group className="form-group-sm">
              <Form.Label className="control-label fw-bold">Year:</Form.Label>
              <span className="text-danger fw-bold">*</span>
              <Form.Control
                type="text"
                id="year"
                name="year"
                placeholder="Enter Year"
                value={year}
                onChange={(e) => {
                  const value = e.target.value;
                  // Allow only numeric characters
                  if (/^\d*$/.test(value)) {
                    setYear(value);
                  }
                }}
                maxLength={4} // Enforce 10 characters length
                
              />
            </Form.Group>
          </Col>
        </Row>
        <Row className="mt-4">
          <Col xs={12} sm={12} md={12} lg={6}>
            <Form.Group className="form-group-sm">
              <Form.Label className="control-label fw-bold">Recruitment Start Date:</Form.Label>
              <span className="text-danger fw-bold">*</span>
              <Form.Control
                type="date"
                id="startDate"
                name="startDate"
                placeholder="Enter Recruitment Start Date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col xs={12} sm={12} md={12} lg={6}>
            <Form.Group className="form-group-sm">
              <Form.Label className="control-label fw-bold">No. of Candidate per date:</Form.Label>
              <span className="text-danger fw-bold">*</span>
              <Form.Control
                type="text"
                id="noOfCandidate"
                name="noOfCandidate"
                placeholder="Enter No. of Candidate per date"
                value={noOfCandidate}
                onChange={(e) => setNoOfCandidate(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <div className="col-lg-12 text-end">
          <Button
            className="text-light"
            style={{ backgroundColor: "#1B5A90" }}
            onClick={() => {
              AddConfig()
            }}
          >
            Save
          </Button>
          <Button variant="secondary" className="mx-2" onClick={resetForm}>
            Clear
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default AddConfigModal;
