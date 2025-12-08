import React from 'react';
import { Table } from 'react-bootstrap';
import { Edit } from '@material-ui/icons';
import { useNavigate } from 'react-router-dom';

const EventTable = ({ allRunning, getSign, title, getLeaderSign, getInchargeSign }) => {
    const history = useNavigate(); // Use useNavigate instead of useNavigation
    const headerCellStyle = {
        backgroundColor: "rgb(27, 90, 144)",
        color: "#fff",
    };

    const navigateAppeal = (canId) => {
        console.log("canId", canId)
        history.push("/appeal", { state: { candidateid: canId } }); // Pass state with navigate

    }

    return (
        <Table striped hover responsive className="border text-left mt-4">
            <thead>
                <tr>
                    <th scope="col" style={headerCellStyle}>Name</th>
                    <th scope="col" style={headerCellStyle}>Chest Number</th>
                    <th scope="col" style={headerCellStyle}>Start Time</th>
                    <th scope="col" style={headerCellStyle}>End Time</th>
                    {/* {title === "Shot Put" ? null : <th scope="col" style={headerCellStyle}>Group</th>} */}
                    {title === "Shot Put" || title === "Shot put" || title === "shot put" ? null : <th scope="col" style={headerCellStyle}>Group</th>}
                    <th scope="col" style={headerCellStyle}>{title === "Shot Put" || title === "Shot put" || title === "shot put" ? "Distance(meter)" : "Duration(minutes)"}</th>
                    <th scope="col" style={headerCellStyle}>Candidate Signature</th>
                    <th scope="col" style={headerCellStyle}>Group Leader Signature</th>
                    <th scope="col" style={headerCellStyle}>Event Incharge Signature</th>
                    <th scope="col" style={headerCellStyle}>Appeal</th>
                </tr>
            </thead>
            <tbody>
                {allRunning.map((data, index) => (
                    <tr key={index}>
                        <td>{data.fullnameenglish}</td>
                        <td>{data.ChestNo}</td>
                        <td>{data.StartTime}</td>
                        <td>{data.EndTime}</td>
                        {/* {title === "Shot Put" ? null : <td>{data.Group}</td>} */}
                        {title === "Shot Put" || title === "Shot put" || title === "shot put" ? null : <td>{data.Group}</td>}
                        {/* <td>{title === "Shot Put" ? data.duration : data.duration}</td> */}
                        <td>{title === "Shot Put" || title === "Shot put" || title === "shot put" ? data.duration : data.duration}</td>
                        <td>
                            <Edit
                                className="text-success"
                                onClick={() => getSign(data.id, data.candidateid, data.ChestNo)}
                                style={{ cursor: "pointer" }}
                            />
                        </td>
                        <td>
                            <Edit
                                className="text-success"
                                onClick={() => getLeaderSign(data.id, data.candidateid, data.ChestNo)}
                                style={{ cursor: "pointer" }}
                            />
                        </td>
                        <td>
                            <Edit
                                className="text-success"
                                onClick={() => getInchargeSign(data.id, data.candidateid, data.ChestNo)}
                                style={{ cursor: "pointer" }}
                            />
                        </td>
                        <td>
                            <button className="btn btn-success btn-sm" onClick={() => navigateAppeal(data.candidateid)}>Appeal</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
};

export default EventTable;
