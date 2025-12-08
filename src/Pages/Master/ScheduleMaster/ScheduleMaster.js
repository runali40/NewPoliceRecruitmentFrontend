
import React, { useState, useEffect, useRef } from 'react';
import { Table, Modal, Button, Form, Row, Col, FormControl } from "react-bootstrap";
import { Add, Delete, Edit } from "@material-ui/icons";
import { useNavigate } from "react-router-dom";
import { Pagination } from '../../../Components/Utils/Pagination';
import { getAllScheduleMasterData, getScheduleCandidateApi, getScheduleMasterData, updateSchedule, updateScheduleCandidateApi } from '../../../Components/Api/ScheduleMasterApi';
import { toast } from "react-toastify";
import Select from "react-select";
import ErrorHandler from '../../../Components/ErrorHandler';
import { apiClient } from '../../../apiClient';
import Cookies from "js-cookie";
import "react-datepicker/dist/react-datepicker.css";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

const ScheduleMaster = () => {
    const navigate = useNavigate();
    const printRef = useRef(null);
    const [allSchedule, setAllSchedule] = useState([]);
    const [searchData, setSearchData] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [selectedItemsPerPage, setSelectedItemsPerPage] = useState(10);
    const [showModal, setShowModal] = useState(false);
    const [showModal1, setShowModal1] = useState(false);
    const [showModal2, setShowModal2] = useState(false);
    const [scheduleDate, setScheduleDate] = useState("");
    const [assignNewDate, setAssignNewDate] = useState("");
    const [scheduleDatePerCandidate, setScheduleDatePerCandidate] = useState("");
    const [allScheduleDate, setAllScheduleDate] = useState([]);
    const [sId, setSId] = useState("");
    const [canId1, setCanId1] = useState("");
    const [allScheduleCandidate, setAllScheduleCandidate] = useState([]);
    const [scheduleId, setScheduleId] = useState("");
    const [scheduleId1, setScheduleId1] = useState("");
    // const [active, setActive] = useState(true);


    const headerCellStyle = {
        backgroundColor: "rgb(27, 90, 144)",
        color: "#fff",
    };

    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);
    const handleShow1 = () => setShowModal1(true);
    const handleClose1 = () => {
        setShowModal1(false);
        setAllScheduleCandidate([]);
    };
    const handleShow2 = () => setShowModal2(true);
    const handleClose2 = () => {
        setShowModal2(false);
        setAssignNewDate("");
        setScheduleDate("");
    };

    const handleChange = (e) => {
        setSelectedItemsPerPage(parseInt(e.target.value));
        setItemsPerPage(parseInt(e.target.value));
        setCurrentPage(1);
    };

    // Print functionality


    const handlePrint = (scheduleData) => {
        console.log("Schedule Data:", scheduleData);

        // Group candidates by ScheduleID
        const groupedBySchedule = scheduleData.reduce((acc, candidate) => {
            const scheduleId = candidate.ScheduleID;
            if (!acc[scheduleId]) {
                acc[scheduleId] = {
                    scheduleDate: candidate.ScheduleDate,
                    candidates: []
                };
            }
            acc[scheduleId].candidates.push(candidate);
            return acc;
        }, {});

        // Function to format date in "DD/MM/YY" format
        const formatDate = (dateString) => {
            const date = new Date(dateString);
            const day = date.getDate();
            const month = date.getMonth() + 1;
            const year = date.getFullYear().toString().slice(-2);
            return `${day}/${month}/${year}`;
        };

        // Generate HTML with 2 schedules per page
        let printContent = `
            <html>
            <head>
                <style>
                    @media print {
                        body {
                            font-family: Arial, sans-serif;
                        }
                        h1, h2, p {
                            margin: 0 0 10px;
                        }
                        table {
                            border-collapse: collapse;
                            width: 100%;
                            margin-top: 10px;
                            font-size: 14px;
                        }
                        th, td {
                            border: 1px solid #000;
                            padding: 8px;
                            text-align: left;
                        }
                        th {
                            background-color: #f2f2f2;
                        }
                        tbody tr {
                            height: auto;
                        }
                        tbody tr:last-child td {
                            border-bottom: 2px solid #000;
                        }
                        .page-break {
                            page-break-after: always;
                        }
                    }
                </style>
            </head>
            <body>
                <h1>Schedule Candidates List</h1>
        `;

        const scheduleIds = Object.keys(groupedBySchedule);
        for (let i = 0; i < scheduleIds.length; i += 2) {
            printContent += `<div class="page-break">`;

            for (let j = i; j < i + 2 && j < scheduleIds.length; j++) {
                const scheduleId = scheduleIds[j];
                const { scheduleDate, candidates } = groupedBySchedule[scheduleId];

                printContent += `
                    <div style="padding: 10px; margin-bottom: 20px; margin-top: 10px;">
                        <h2>Schedule ID: ${scheduleId}</h2>
                        <p>Schedule Date: ${formatDate(scheduleDate)}</p>

                        <table>
                            <thead>
                                <tr>
                                    <th>Sr. No</th>
                                    <th>Candidate Name</th>
                                    <th>Mobile No.</th>
                                    <th>Application No</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${candidates
                        .map((candidate, index) => `
                                        <tr>
                                            <td>${index + 1}</td>
                                            <td>${candidate.FirstName_English} ${candidate.FatherName_English} ${candidate.Surname_English}</td>
                                            <td>${candidate.MobileNumber}</td>
                                            <td>${candidate.ApplicationNo}</td>
                                        </tr>
                                    `)
                        .join("")}
                            </tbody>
                        </table>
                    </div>
                `;
            }

            printContent += `</div>`;
        }

        printContent += `
            </body>
            </html>
        `;

        // Create a hidden iframe for printing
        const printFrame = document.createElement('iframe');
        printFrame.style.display = 'none';
        document.body.appendChild(printFrame);

        // Write content to iframe and print
        printFrame.contentWindow.document.write(printContent);
        printFrame.contentWindow.document.close();

        // Wait for content to load before printing
        printFrame.onload = () => {
            printFrame.contentWindow.print();
            // Remove iframe after printing
            setTimeout(() => {
                document.body.removeChild(printFrame);
            }, 100);
        };
    };

    useEffect(() => {
        getAllData();
    }, [currentPage, itemsPerPage]);

    const getAllData = () => {
        getAllScheduleMasterData()
            .then((data) => {
                setAllSchedule(data);
                const temp = data.map((data1) => ({
                    value: data1.ScheduleID,
                    label: data1.ScheduleDate.split("T")[0],
                }));
                setAllScheduleDate(temp);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const getSchedule = (Id) => {
        handleShow();
        getScheduleMasterData(Id)
            .then((data) => {
                if (Array.isArray(data) && data.length > 0) {
                    const schedule = data[0];
                    if (schedule.ScheduleDate) {
                        const formattedDate = schedule.ScheduleDate.split("T")[0];
                        setScheduleDate(formattedDate);
                        setSId(schedule.Id);
                    } else {
                        console.error("ScheduleDate is missing in the first item:", schedule);
                    }
                } else {
                    console.error("Invalid data or data array is empty:", data);
                }
            })
            .catch((error) => {
                console.error("Error fetching schedule data:", error);
            });
    };

    const updateScheduleMaster = async () => {
        const UserId = localStorage.getItem('userId');
        const recruitId = localStorage.getItem("recruitId");

        if (scheduleDate === "") {
            toast.warning("Please enter schedule date!");
            return;
        }

        const data = {
            userId: UserId,
            recruitId: recruitId,
            scheduleDate: scheduleDate,
            candidateId: "",
            id: sId,
        };

        try {
            await updateSchedule(data);
            await getAllData();
            setScheduleDate("");
            setAssignNewDate("");
            handleClose();
        } catch (error) {
            console.error("Error updating schedule:", error);
            toast.error("Error updating schedule");
        }
    };

    const getAllScheduleCandidate = (scheduleId) => {
        const recruitId = localStorage.getItem("recruitId");
        const UserId = localStorage.getItem("userId");

        return apiClient({
            method: "get",
            url: `CandidateScheduleMaster/GetAllScheduleCandidate`,
            params: {
                UserId: UserId,
                RecruitId: recruitId,
                ScheduleDate: null,
                CandidateId: null,
                ScheduleID: scheduleId !== null ? scheduleId : null
            },
        })
            .then((response) => {
                const token1 = response.data.outcome.tokens;
                Cookies.set("UserCredential", token1, { expires: 7 });
                setAllScheduleCandidate(response.data.data);
            })
            .catch((error) => {
                if (error.response?.data?.outcome?.tokens) {
                    Cookies.set("UserCredential", error.response.data.outcome.tokens, { expires: 7 });
                }
                const errors = ErrorHandler(error);
                toast.error(errors);
                return [];
            });
    };

    const getAllScheduleCandidate1 = (scheduleId = null) => {
        const recruitId = localStorage.getItem("recruitId");
        const userId = localStorage.getItem("userId");
        apiClient({
            method: "get",
            url: "CandidateScheduleMaster/GetAllScheduleCandidate",
            params: {
                UserId: userId,
                RecruitId: recruitId,
                // ScheduleID: scheduleId, // Ensure we pass the correct scheduleId here
                ScheduleID: null,
                ScheduleDate: null,
                CandidateId: null
            },
        })
            .then((response) => {
                const token = response.data.outcome.tokens;
                Cookies.set("UserCredential", token, { expires: 7 });

                if (response.data.data.length > 0) {
                    setAllScheduleCandidate(response.data.data); // Set the filtered candidates
                    handlePrint(response.data.data); // Only print filtered candidates
                } else {
                    toast.warning("No schedule data available to print");
                }
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
                toast.error("Error fetching schedule data");
            });
    };

    const getScheduleCandidateList = (Id) => {
        handleShow1();
        getScheduleMasterData(Id)
            .then((data) => {
                if (Array.isArray(data) && data.length > 0) {
                    const schedule = data[0];
                    if (schedule.ScheduleDate) {
                        const ssId = schedule.ScheduleID;
                        setScheduleId(ssId);
                        getAllScheduleCandidate(ssId);
                    }
                }
            })
            .catch((error) => {
                console.error("Error fetching schedule data:", error);
            });
    };

    const getScheduleCandidate = (Id, cId) => {
        handleShow2();
        getScheduleCandidateApi(Id, cId)
            .then((data) => {
                if (Array.isArray(data) && data.length > 0) {
                    const schedule = data[0];
                    if (schedule.ScheduleDate) {
                        const formattedDate = schedule.ScheduleDate.split("T")[0];
                        setScheduleDatePerCandidate({
                            value: schedule.ScheduleID,
                            label: formattedDate
                        });
                        setCanId1(schedule.CandidateID);
                        setScheduleId1(schedule.ScheduleID);
                    }
                }
            })
            .catch((error) => {
                console.error("Error fetching schedule data:", error);
            });
    };

    // const updateScheduleCandidate = async () => {
    //     const UserId = localStorage.getItem('userId');
    //     const recruitId = localStorage.getItem("recruitId");

    //     if (!scheduleDatePerCandidate && !assignNewDate) {
    //         toast.warning("Please enter schedule date!");
    //         return;
    //     }

    //     const data = {
    //         UserId: UserId,
    //         RecruitId: recruitId,
    //         ScheduleDate: scheduleDatePerCandidate.label,
    //         CandidateId: canId1,
    //         Id: null,
    //         scheduleID: scheduleId1.toString(),
    //         NewScheduleDate: assignNewDate || null
    //     };

    //     try {
    //         await updateScheduleCandidateApi(data);
    //         await getAllData();
    //         setScheduleDatePerCandidate("");
    //         handleClose1();
    //         handleClose2();
    //     } catch (error) {
    //         console.error("Error updating candidate schedule:", error);
    //         toast.error("Error updating candidate schedule");
    //     }
    // };
    // console.log(allScheduleDate, "assign date per candidate")
    const updateScheduleCandidate = async () => {
        console.log(assignNewDate, "assign new date");
        console.log(allScheduleDate.label, "assign date per candidate")
        const UserId = localStorage.getItem('userId');
        const recruitId = localStorage.getItem("recruitId");

        if (!scheduleDatePerCandidate && !assignNewDate) {
            toast.warning("Please enter schedule date!");
            return;
        }

        if (allScheduleDate.some(item => item.label === assignNewDate)) {
            toast.warning("Please select a new schedule date!");
            return;
        }
        const data = {
            UserId: UserId,
            RecruitId: recruitId,
            ScheduleDate: scheduleDatePerCandidate.label,
            CandidateId: canId1,
            Id: null,
            scheduleID: scheduleId1.toString(),
            NewScheduleDate: assignNewDate || null
        };

        try {
            await updateScheduleCandidateApi(data);
            await getAllData();
            setScheduleDatePerCandidate("");
            handleClose1();
            handleClose2();
        } catch (error) {
            console.error("Error updating candidate schedule:", error);
            toast.error("Error updating candidate schedule");
        }
    };

    const handleSearch = (e) => {
        const searchDataValue = e.target.value.toLowerCase();
        setSearchData(searchDataValue);

        if (searchDataValue.trim() === "") {
            getAllData();
        } else {
            const filteredData = allSchedule.filter(
                (schedule) =>
                    schedule.ScheduleID.toLowerCase().includes(searchDataValue) ||
                    schedule.ScheduleDate.toLowerCase().includes(searchDataValue)
            );
            setAllSchedule(filteredData);
            setCurrentPage(1);
        }
    };

    const handleScheduleDate = (selected) => {
        setScheduleDatePerCandidate(selected);
        if (selected) {
            setAssignNewDate("");
        }
    };

    const handleNewDateChange = (e) => {
        const selectedDate = e.target.value;
        const disabledDates = allScheduleDate.map(date => date.label);

        if (!disabledDates.includes(selectedDate)) {
            setAssignNewDate(selectedDate);
            setScheduleDatePerCandidate("");
        } else {
            toast.warning("This date already has a schedule");
        }
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = allSchedule.slice(indexOfFirstItem, indexOfLastItem);

    // Print function
    const handlePrint1 = () => {
        const content = printRef.current.innerHTML;
        const printContainer = document.createElement("div");
        printContainer.id = "print-container"; // Assign an ID for easy reference
        printContainer.innerHTML = `
            <style>
                @media print {
                    @page { size: A4; margin-top: 20mm; }
                    body { margin: 0; padding: 0; font-family: Arial, sans-serif; }
                    table { width: 100%; border-collapse: collapse; }
                    th { border: 1px solid black; padding: 10px; text-align: center; color: red; } /* Table heading in red */
                    td { border: 1px solid black; padding: 10px; text-align: center; color: black; } /* Table content in black */
                    .action { display: none; } /* Hide Action Column */
                    body * { visibility: hidden; } /* Hide Everything */
                    #print-content, #print-content * { visibility: visible; } /* Show Only Print Section */
                     #print-content { position: absolute; left: 0; top: 0; width: 99%; text-align: center; }
                h1 { text-align: center; font-weight: bold; font-size: 25px; margin-bottom: 15px; }
                }
            </style>
            <div id="print-content">
             <h1>Candidates</h1>
                ${content}
            </div>
        `;
        document.body.appendChild(printContainer);
        window.print();
        document.body.removeChild(printContainer); // Remove the print container after printing
    };

    return (
        <>

            <div className="container-fluid">
                <div className="card m-3" style={{ boxShadow: "0px 1px 5px rgba(0, 0, 0, 0.1)" }}>
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card-header">
                                <div className="row align-items-center">
                                    <div className="col">
                                        <h4 className="card-title fw-bold py-2">Schedule Master</h4>
                                    </div>
                                    {/* <div className="col-auto d-flex flex-wrap">
                                        <div className="btn btn-add" title="Print All">
                                            <button
                                                className="btn btn-md btn-primary"
                                                style={{ backgroundColor: "rgb(27, 90, 144)" }}
                                                onClick={() => getAllScheduleCandidate1()}
                                            >
                                                Print All
                                            </button>
                                        </div>
                                    </div> */}
                                    <div className="col-auto d-flex flex-wrap">
                                        {/* <div className="form-check form-switch mt-2 pt-1">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id="flexSwitchCheckDefault"
                                                checked={active}
                                                onChange={() => setActive(!active)}
                                            />
                                        </div> */}
                                        <div className="btn btn-add" title="Print All">
                                            <button
                                                className="btn btn-md btn-primary"
                                                style={{ backgroundColor: "rgb(27, 90, 144)" }}
                                                onClick={() => getAllScheduleCandidate1()}
                                            >
                                                Print All
                                            </button>
                                        </div>

                                    </div>
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
                                                Schedule Id
                                            </th>
                                            <th scope="col" style={headerCellStyle}>
                                                Schedule Date
                                            </th>
                                            {/* <th scope="col" style={headerCellStyle}>
                                                Status
                                            </th> */}
                                            <th scope="col" className="text-center" style={headerCellStyle}>
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            currentItems.map((data, index) => {
                                                return (
                                                    <tr key={data.Id}>
                                                        <td> {(currentPage - 1) * itemsPerPage + index + 1}</td>
                                                        <td>{data.ScheduleID}</td>
                                                        <td>{data.ScheduleDate ? data.ScheduleDate.split("T")[0] : ""}</td>
                                                        {/* <td>{data.Isactive}</td> */}
                                                        <td className='text-center'>
                                                            <div className="d-flex justify-content-center align-items-center gap-2">
                                                                <Edit
                                                                    className="text-success me-2"
                                                                    type="button"
                                                                    onClick={() => getSchedule(data.Id)}

                                                                />
                                                                <button className='btn btn-primary btn-sm me-3' onClick={() => getScheduleCandidateList(data.Id)}>Show Candidates</button>
                                                                {/* <Delete
                                                                    className="text-danger"
                                                                    type="button"
                                                                    style={{ marginLeft: "0.5rem" }}
                                                                // onClick={() => DeleteParameterMaster(data.p_id)}
                                                                /> */}
                                                            </div>
                                                        </td>
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
                                            {Math.min(indexOfLastItem, allSchedule.length)} of{" "}
                                            {allSchedule.length} entries
                                        </h6>
                                    </div>
                                    <div className="col-lg-4 col-md-4 col-12"></div>
                                    <div className="col-lg-4 col-md-4 col-12 mt-3 mt-lg-0 mt-md-0">
                                        <Pagination
                                            currentPage={currentPage}
                                            setCurrentPage={setCurrentPage}
                                            allData={allSchedule}
                                            itemsPerPage={itemsPerPage}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
            <Modal show={showModal} onHide={handleClose} size="md" backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title>
                        <h5 className="fw-bold">Schedule Date</h5>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Row>
                            <Col xs={12} sm={12} md={12} lg={12} className="mt-2 mt-lg-0">
                                <Row>
                                    <Col xs={12} sm={12} md={5} lg={5} className="mt-2 mt-lg-0">
                                        <Form.Group className="mb-3" controlId="parameterCode">
                                            <Form.Label className="fw-bold text-end">Schedule Date:</Form.Label>{" "}
                                            <span className="text-danger text-end fw-bold">*</span>
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} sm={12} md={7} lg={7} className="mt-2 mt-lg-0">
                                        <Form.Group className="mb-3" controlId="parameterName">
                                            <Form.Control
                                                type="date"
                                                placeholder="Enter Parameter Name"
                                                value={scheduleDate}
                                                onChange={(e) => setScheduleDate(e.target.value)}
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
                            updateScheduleMaster();
                        }}
                    >
                        Update
                    </Button>
                    <Button variant="secondary" onClick={() => { setScheduleDate("") }}>
                        Clear
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showModal1} onHide={handleClose1} size="xl" backdrop="static" centered >
                <Modal.Header closeButton>
                    <div className="row w-100 align-items-center">
                        <div className="col-6">
                            <h5 className="fw-bold mb-0">Candidates</h5>
                        </div>
                        <div className="col-6 d-flex justify-content-end">
                            <button
                                className="btn btn-md btn-primary"
                                style={{ backgroundColor: "rgb(27, 90, 144)" }}
                                // onClick={() => window.print()}
                                onClick={handlePrint1}
                            >
                                Print
                            </button>
                        </div>
                    </div>
                </Modal.Header>
                <Modal.Body id="candidate-table">
                    <div className="table-responsive" ref={printRef} id="section-to-print" style={{ margin: 0, padding: 0 }}>
                        <Table striped hover responsive className="border text-left" >
                            <thead>
                                <tr>
                                    <th scope="col" style={headerCellStyle}>Sr.No</th>
                                    <th scope="col" style={headerCellStyle}>Candidate Name</th>
                                    <th scope="col" style={headerCellStyle}>Application No</th>
                                    <th scope="col" style={headerCellStyle}>Mobile No</th>
                                    <th scope="col" style={headerCellStyle}>Schedule Date</th>
                                    {/* <th scope="col" style={headerCellStyle}>Status</th> */}
                                    <th className="action" style={headerCellStyle}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allScheduleCandidate.map((data, index) => (
                                    <tr key={data.CandidateID}>
                                        <td>{index + 1}</td>
                                        <td>{data.FirstName_English} {data.FatherName_English} {data.Surname_English}</td>
                                        <td>{data.ApplicationNo}</td>
                                        <td>{data.MobileNumber}</td>
                                        <td>{data.ScheduleDate ? data.ScheduleDate.split("T")[0] : ""}</td>
                                        {/* <td>{data.Isactive}</td> */}
                                        <td className="action">
                                            <div className="d-flex ms-2">
                                                <Edit
                                                    className="text-success mr-2"
                                                    type="button"
                                                    onClick={() => getScheduleCandidate(data.ScheduleID, data.CandidateID)}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                    {/* <div id="section-to-print">
        {allScheduleCandidate.length > 0 ? (
          <>
           
            <h2>Schedule ID: {scheduleId}</h2>
            <h3>Schedule Date: {scheduleDate}</h3>

            <table border="1" width="100%">
              <thead>
                <tr>
                  <th>Candidate Name</th>
                  <th>Application No</th>
                  <th>Chest No</th>
                  <th>Mobile Number</th>
                </tr>
              </thead>
              <tbody>
                {allScheduleCandidate.map((candidate, index) => (
                  <tr key={index}>
                    <td>
                      {candidate.FirstName_English} {candidate.FatherName_English}{" "}
                      {candidate.Surname_English}
                    </td>
                    <td>{candidate.ApplicationNo}</td>
                    <td>{candidate.ChestNo}</td>
                    <td>{candidate.MobileNumber}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : (
          <p>No schedule data available</p>
        )}
      </div> */}
                </Modal.Body>


            </Modal>

            <Modal show={showModal2} onHide={handleClose2} size="md" backdrop="static" centered>
                <Modal.Header closeButton>
                    <Modal.Title>
                        <h5 className="fw-bold">Candidate Schedule Date</h5>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Row>
                            <Col xs={12} sm={12} md={12} lg={12} className="mt-2 mt-lg-0">
                                <Row>
                                    <Col xs={12} sm={12} md={5} lg={5} className="mt-2 mt-lg-0">
                                        <Form.Group className="mb-3" controlId="parameterCode">
                                            <Form.Label className="fw-bold text-end">
                                                Schedule Date:
                                            </Form.Label>{" "}
                                            {(!scheduleDatePerCandidate && !assignNewDate) || (scheduleDatePerCandidate && !assignNewDate) ? (
                                                <span className="text-danger fw-bold">*</span>
                                            ) : null}
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} sm={12} md={7} lg={7} className="mt-2 mt-lg-0">
                                        <Select
                                            className="mt-2"
                                            value={scheduleDatePerCandidate}
                                            onChange={handleScheduleDate}
                                            options={allScheduleDate}
                                            placeholder="Select Schedule Date"
                                        />
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12} sm={12} md={12} lg={12} className="mt-2 mt-lg-3">
                                <Row>
                                    <Col xs={12} sm={12} md={5} lg={5} className="mt-2 mt-lg-0">
                                        <Form.Group className="mb-3" controlId="parameterCode">
                                            <Form.Label className="fw-bold">
                                                Assign New Schedule Date:   {(!scheduleDatePerCandidate && !assignNewDate) || (assignNewDate && !scheduleDatePerCandidate) ? (
                                                    <span className="text-danger fw-bold">*</span>
                                                ) : null}
                                            </Form.Label>{" "}

                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} sm={12} md={7} lg={7} className="mt-2 mt-lg-0">
                                        <FormControl
                                            type="date"
                                            value={assignNewDate}
                                            onChange={(e) => {
                                                setAssignNewDate(e.target.value);
                                                if (e.target.value) {
                                                    setScheduleDatePerCandidate("");
                                                }
                                            }}
                                            className="w-full"
                                        />
                                        {/* <DatePicker
                                            selected={assignNewDate}
                                            onChange={(date) => setAssignNewDate(date)}
                                            excludeDates={allScheduleDate.map(item => new Date(item.label))}
                                            className="w-full"
                                        /> */}
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
                            updateScheduleCandidate();
                        }}
                    >
                        Update
                    </Button>
                    <Button variant="secondary" onClick={() => { setScheduleDatePerCandidate(""); setAssignNewDate("") }}>
                        Clear
                    </Button>
                </Modal.Footer>

            </Modal>
        </>
    )
}

export default ScheduleMaster