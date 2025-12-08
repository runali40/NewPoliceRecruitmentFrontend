import React from 'react';
import { Form, Table } from 'react-bootstrap';
import { Edit } from "@material-ui/icons";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const AddMeasurementModal = ({
    allMeasurement,
    allGender,
    headerCellStyle,
    handleMeasurementChange,
    GetMeasurement,
    readable,
    setReadable
}) => {
    return (
        <>
            <h5 className="mt-4 text-start fw-bold">Measurement Parameter</h5>
            <Table striped bordered hover className="mt-4">
                <thead>
                    <tr>
                        <th style={headerCellStyle} className='text-white'>Parameter Name</th>
                        <th style={headerCellStyle} className='text-white'>Value</th>
                        <th style={headerCellStyle} className='text-white'>Gender</th>
                        <th style={headerCellStyle} className='text-white'>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {allMeasurement.map((row, index) => {
                        console.log(row.gender, "gender");
                        return (
                            <tr key={row.c_id}>
                                <td>
                                    <Form.Group className="form-group-sm">
                                        <Form.Control
                                            type="text"
                                            name="perticulars"
                                            placeholder="Enter Min"
                                            value={row.perticulars}
                                            onChange={(e) => handleMeasurementChange(index, e)}
                                            disabled
                                        />
                                    </Form.Group>
                                </td>
                                <td>
                                    <Form.Group className="form-group-sm">
                                        <Form.Control
                                            type="text"
                                            name="minvalue"
                                            placeholder="Enter Max"
                                            value={row.minvalue}
                                            onChange={(e) => handleMeasurementChange(index, e)}
                                            disabled={readable !== row.c_id}
                                        />
                                    </Form.Group>
                                </td>
                                <td>
                                    <Form.Group className="form-group-sm">
                                        <select
                                            className="form-select"
                                            name="gender"
                                            value={row.gender}
                                            onChange={(e) => handleMeasurementChange(index, e)}
                                            disabled
                                        >
                                            <option value="" disabled>Select Gender</option>
                                            {allGender.map((data, index) => (
                                                <option key={index} value={data.pv_parametervalue}>{data.pv_parametervalue}</option>
                                            ))}
                                        </select>
                                    </Form.Group>
                                </td>
                                <td>
                                    <Edit
                                        className="text-success mr-2"
                                        type="button"
                                        onClick={() => {
                                            GetMeasurement(row.c_id);
                                            setReadable(row.c_id);
                                        }}
                                    />
                                </td>
                            </tr>
                        )
                    })}
                </tbody>

            </Table>
        
        </>
    );
};

export default AddMeasurementModal;
