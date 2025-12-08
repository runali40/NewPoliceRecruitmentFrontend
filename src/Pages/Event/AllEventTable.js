import React from 'react';
import { Table } from 'react-bootstrap';
import SignatureCanvas from "react-signature-canvas";

const AllEventTable = ({ allRunning, sigRefs }) => {
    const headerCellStyle = {
        backgroundColor: "rgb(27, 90, 144)",
        color: "#fff",
    };

    return (
        <Table striped hover responsive className="border text-left mt-4">
            <thead>
                <tr>
                    <th scope="col" style={headerCellStyle}>Chest Number</th>
                    <th scope="col" style={headerCellStyle}>Candidate Name</th>
                    <th scope="col" style={headerCellStyle}>100 Meter</th>
                    <th scope="col" style={headerCellStyle}>800 Meter</th>
                    <th scope="col" style={headerCellStyle}>1600 Meter</th>
                    <th scope="col" style={headerCellStyle}>Shot Put</th>
                    <th scope="col" style={headerCellStyle}>Signature</th>
                </tr>
            </thead>
            <tbody>
                {allRunning.map((data, index) => (
                    <tr key={index}>
                        <td>{data.chestno}</td>
                        <td>{data.FullNameEnglish}</td>
                        <td>{data['100 Meter Running'] === null ? 0 : data['100 Meter Running']}</td>
                        <td>{data['800 Meter Running'] === null ? 0 : data['800 Meter Running']}</td>
                        <td>{data['1600 Meter Running'] === null ? 0 : data['1600 Meter Running']}</td>
                        <td>{data['Shot Put'] === null ? 0 : data['Shot Put']}</td>
                        <td>
                            <div
                                className="border border-dark bg-white"
                                style={{ height: "75px", width: "200px" }}
                            >
                                <SignatureCanvas
                                    penColor="black"
                                    canvasProps={{
                                        className: "sigCanvas",
                                        style: { height: "75%", width: "100%" },
                                    }}
                                    ref={sigRefs.current[index]}
                                />
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
};

export default AllEventTable;
