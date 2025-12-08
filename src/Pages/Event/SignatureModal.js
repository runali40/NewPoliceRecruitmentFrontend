// SignatureModal.js
import React from "react";
import { Modal, Button } from "react-bootstrap";
import SignatureCanvas from 'react-signature-canvas';

const SignatureModal = ({ show, handleClose, handleClear, handleGenerate, signRef }) => {
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title><h5 className="fw-bold">Add Candidate Signature</h5></Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <SignatureCanvas ref={signRef} canvasProps={{ width: 500, height: 200, className: 'sigCanvas' }} />
            </Modal.Body>
            {/* <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Close</Button>
                <Button variant="primary" onClick={handleClear}>Clear</Button>
                <Button variant="primary" onClick={handleGenerate}>Generate</Button>
            </Modal.Footer> */}
            <Modal.Footer>
                <Button variant="success" onClick={handleGenerate}>Save</Button>
                <Button variant="primary" onClick={handleClear}>Clear</Button>
                <Button variant="secondary" onClick={handleClose}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default SignatureModal;
