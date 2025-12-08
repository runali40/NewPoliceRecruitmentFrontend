import React, { useState, useEffect } from 'react'
import { Table, Modal, Button, Form, Row, Col } from "react-bootstrap";
import { Add, Delete, Edit, Height } from "@material-ui/icons";
import { useNavigate } from "react-router-dom";
import { Pagination } from '../../Components/Utils/Pagination';
import { getAllRejectedData, getRejectedData, updateRejected } from '../../Components/Api/RejectedCandidateApi';
import { toast } from "react-toastify";

const RejectedCandidate = () => {
    const navigate = useNavigate();
    const [allRejectedCandidate, setAllRejectedCandidate] = useState([]);
    const [searchData, setSearchData] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [selectedItemsPerPage, setSelectedItemsPerPage] = useState(10);
    const [showModal, setShowModal] = useState(false);

    const [appealcount, setAppealCount] = useState("");
    const [candidateId, setCandidateId] = useState("");
    const [approvedData, setApprovedData] = useState("")
    const [remark, setRemark] = useState("")
    const [active, setActive] = useState(true);
    const [toggleActive, setToggleActive] = useState(true);
    const [parameterId, setParameterId] = useState("");
    const [pId, setPId] = useState("")
    const headerCellStyle = {
        backgroundColor: "rgb(27, 90, 144)",
        color: "#fff",
    };
    const handleShow = () => {
        setShowModal(true);
    };

    const handleClose = () => setShowModal(false);
    const handleChange = (e) => {
        setSelectedItemsPerPage(parseInt(e.target.value));
        setItemsPerPage(parseInt(e.target.value));
        setCurrentPage(1);
    };
    // const handleSearch = (e) => {
    //     const searchDataValue = e.target.value.toLowerCase();
    //     setSearchData(searchDataValue);

    //     if (searchDataValue.trim() === "") {
    //         // If search input is empty, fetch all data
    //         //   getAllData();
    //     } else {
    //         // Filter data based on search input value
    //         const filteredData = allRejectedCandidate.filter(
    //             (rejected) =>
    //                 rejected.FatherName_English.toLowerCase().includes(searchDataValue) ||
    //                 rejected.ChestNo.toLowerCase().includes(searchDataValue)
    //         );
    //         setAllRejectedCandidate(filteredData);
    //         setCurrentPage(1);
    //     }
    // };

    const handleSearch = (e) => {
        const searchDataValue = e.target.value.trim(); // Trim spaces
        setSearchData(searchDataValue);

        if (searchDataValue === "") {
            // Restore original data when search is cleared
            getAllData()
            setCurrentPage(1);
        } else {
            // Convert search term to lowercase for case-insensitive search
            const lowerCaseSearch = searchDataValue.toLowerCase();

            // Filter data based on search input value
            const filteredData = allRejectedCandidate.filter((rejected) => {
                const firstName = rejected.FirstName_English ? rejected.FirstName_English.toLowerCase() : "";
                const surname = rejected.Surname_English ? rejected.Surname_English.toLowerCase() : "";
                const chestNo = rejected.ChestNo ? rejected.ChestNo.toLowerCase() : "";
                const applicationNo = rejected.ApplicationNo ? rejected.ApplicationNo.toLowerCase() : "";

                return (
                    firstName.includes(lowerCaseSearch) ||
                    chestNo.includes(lowerCaseSearch) ||
                    applicationNo.includes(lowerCaseSearch) ||
                    surname.includes(lowerCaseSearch)
                );
            });

            setAllRejectedCandidate(filteredData);
            setCurrentPage(1);
        }
    };


    useEffect(() => {
        getAllData();
    }, [currentPage, itemsPerPage]);

    const getAllData = () => {
        getAllRejectedData(active).then((data) => {
            setAllRejectedCandidate(data)
        }).catch((error) => {
            console.log(error);
        })
    };


    const getRejected = (Id) => {
        handleShow();
        getRejectedData(Id).then((data) => {
            if (Array.isArray(data) && data.length > 0) { // Ensure data is an array and not empty
                const rejectedLog = data[0]; // Access the first item in the array
                if (rejectedLog) {
                    // const formattedDate = schedule.ScheduleDate.split("T")[0]; // Safely split the date
                    setCandidateId(rejectedLog.CandidateId);
                    setRemark(rejectedLog.Remark);
                    setApprovedData(rejectedLog.Status)
                    setAppealCount(rejectedLog.appealcount)
                    // console.log("Schedule date:", formattedDate);
                    // setSId(schedule.Id)
                    // console.log(sId, "sid")
                } else {
                    console.error("ScheduleDate is missing in the first item:", rejectedLog);
                }
            } else {
                console.error("Invalid data or data array is empty:", data);
            }
        }).catch((error) => {
            console.error("Error fetching schedule data:", error);
        });
    };

    const handleRadioChange = (event) => {
        setApprovedData(event.target.value); // Update state with selected value
    };

    const updateRejectedCandidate = async () => {
        const UserId = localStorage.getItem('userId');
        const recruitId = localStorage.getItem("recruitId");
        if (!approvedData) {
            toast.warning("Approval status is required!");
            return;
        }
        // Validation: If approvedData is "Rejected", remark must not be empty
        if (approvedData === "Rejected" && (!remark || remark.trim() === "")) {
            toast.warning("Remark is mandatory when rejecting a candidate!");
            return; // Stop execution if remark is empty
        }

        const data = {
            userId: UserId,
            recruitId: recruitId,
            candidateID: candidateId,
            approvedBy: null,
            date: null,
            remark: remark,
            status: approvedData,
            cast: null
        };

        try {
            await updateRejected(data);
            await getAllData();

            setRemark("");
            setApprovedData("");
            handleClose();
        } catch (error) {
            console.error("Error adding parameter:", error);
            // Handle error appropriately
        }
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = allRejectedCandidate.slice(indexOfFirstItem, indexOfLastItem);
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
                                        <h4 className="card-title fw-bold py-2">Rejected Candidate</h4>
                                    </div>
                                    {/* <div className="col-auto d-flex flex-wrap">
                                        <div className="btn btn-add" title="Add New">
                                            <Button
                                                // onClick={handleShow}
                                                onClick={() => {
                                                    setParameterCode("");
                                                    setParameterName("");
                                                    setParameterId("");
                                                    handleShow();
                                                }}
                                                style={{ backgroundColor: "#1B5A90" }}
                                            >
                                                <Add />
                                            </Button>
                                        </div>
                                    </div> */}
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
                                            <option value="500">500</option>
                                            <option value="1000">1000</option>
                                        </select>
                                        &nbsp;&nbsp;
                                        <h6 className="mt-2">entries</h6>
                                    </div>
                                    <div className="col-lg-6 col-md-6 d-flex justify-content-center justify-content-lg-end"></div>
                                    <div className="col-lg-3 col-md-3 d-flex justify-content-center justify-content-lg-end mt-lg-0 mt-md-0 mt-3">
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
                                                Application No
                                            </th>
                                            <th scope="col" style={headerCellStyle}>
                                                Chest No
                                            </th>
                                            <th scope="col" style={headerCellStyle}>
                                                Candidate Name
                                            </th>

                                            <th scope="col" style={headerCellStyle}>No of Counts</th>
                                            <th scope="col" style={headerCellStyle}>
                                                Approved by/Rejected by
                                            </th>
                                            <th scope="col" style={headerCellStyle}>
                                                Reason
                                            </th>
                                            <th scope="col" style={headerCellStyle}>
                                                Reason for reject
                                            </th>
                                            <th scope="col" style={headerCellStyle}>
                                                Status
                                            </th>
                                            {/* <th scope="col" style={headerCellStyle}>
                                                Action
                                            </th> */}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            currentItems.map((data, index) => {
                                                return (
                                                    <tr key={data.CandidateId}>
                                                        <td>   {(currentPage - 1) * itemsPerPage + index + 1}</td>
                                                        <td>{data.ApplicationNo}</td>
                                                        <td>{data.ChestNo}</td>
                                                        <td style={{ cursor: "pointer" }} >{data.FirstName_English + " " + data.FatherName_English + " " + data.Surname_English}</td>
                                                        <td>{data.appealcount}</td>
                                                        <td>{data.ApprovedBy}</td>
                                                        <td>{data.stages}</td>
                                                        <td>{data.ReasonofReject}</td>
                                                        <td>{data.Status}</td>
                                                        {/* <td>
                                                            <div className="d-flex ms-2">
                                                                <button
                                                                    className="btn btn-sm btn-success  mr-2"
                                                                    type="button"
                                                                    onClick={() => getRejected(data.CandidateId)}
                                                                    disabled={(data.appealcount).toString() === "3"}>Apply for Appeal</button>
                                                            </div>
                                                        </td> */}
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </Table>
                                <div className="row mt-4 mt-xl-3">
                                    <div className="col-lg-4 col-md-4 col-12 ">
                                        <h6 className="text-lg-start text-center">
                                            Showing {indexOfFirstItem + 1} to{" "}
                                            {Math.min(indexOfLastItem, allRejectedCandidate.length)} of{" "}
                                            {allRejectedCandidate.length} entries
                                        </h6>
                                    </div>
                                    <div className="col-lg-4 col-md-4 col-12"></div>
                                    <div className="col-lg-4 col-md-4 col-12 mt-3 mt-lg-0 mt-md-0">
                                        <Pagination
                                            currentPage={currentPage}
                                            setCurrentPage={setCurrentPage}
                                            allData={allRejectedCandidate}
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
                        <h5 className="fw-bold">Apply for Appeal</h5>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Row>
                            <Col xs={12} sm={12} md={4} lg={4} className="mt-2 mt-lg-0">
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="flexRadioDefault"
                                        id="flexRadioDefault1"
                                        value="Approved" // Set value for this radio button
                                        checked={approvedData === "Approved"} // Bind checked state
                                        onChange={handleRadioChange} // Handle change event
                                    />
                                    <label className="form-check-label fw-bold" htmlFor="flexRadioDefault1">
                                        Approved
                                    </label>
                                </div>
                                <div className="form-check mt-2">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="flexRadioDefault"
                                        id="flexRadioDefault2"
                                        value="Rejected" // Set value for this radio button
                                        checked={approvedData === "Rejected"} // Bind checked state
                                        onChange={handleRadioChange} // Handle change event
                                    />
                                    <label className="form-check-label fw-bold" htmlFor="flexRadioDefault2">
                                        Rejected
                                    </label>
                                </div>
                            </Col>
                            <Col xs={12} sm={12} md={8} lg={8} className="mt-2 mt-lg-0">
                                <Row>
                                    <Col xs={12} sm={12} md={6} lg={6} className="mt-2 mt-lg-0">
                                        <Form.Group className="mb-3" controlId="parameterCode">
                                            <Form.Label className="fw-bold text-end">Remark:</Form.Label>{" "}
                                            <span className="text-danger text-end fw-bold">
                                                {approvedData === "Rejected" ? "*" : ""}
                                            </span>
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} sm={12} md={6} lg={6} className="mt-2 mt-lg-0">
                                        <Form.Group className="mb-3" controlId="parameterName">

                                            <Form.Control
                                                type="text "
                                                placeholder="Enter Remark"
                                                value={remark || ""}
                                                onChange={(e) => setRemark(e.target.value)}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>

                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        style={{ backgroundColor: "#1B5A90" }}
                        onClick={() => {
                            updateRejectedCandidate();
                        }}
                    >
                        Save
                    </Button>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default RejectedCandidate