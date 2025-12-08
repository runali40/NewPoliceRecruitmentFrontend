import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import SignatureCanvas from 'react-signature-canvas';

const GroupLeaderSignModal = ({ show, handleClose, handleClear, handleGenerate, grpLdrSigRefs }) => {
    return (
        <Modal show={show} onHide={handleClose} centered size="md">
            <Modal.Header closeButton>
                <Modal.Title><h5 className="fw-bold">Add Group Leader Signature</h5></Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <SignatureCanvas ref={grpLdrSigRefs} canvasProps={{ width: 500, height: 200, className: 'sigCanvas' }} />
            </Modal.Body>
            <Modal.Footer>
                <Button variant="success" onClick={handleGenerate}>Save</Button>
                <Button variant="primary" onClick={handleClear}>Clear</Button>
                <Button variant="secondary" onClick={handleClose}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default GroupLeaderSignModal;
