import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getAllGroup, getAllRunningEvents, getRunningEvent, updateRunningEventSign } from "../../Components/Api/EventApi";
import EventTable from "./EventTable";
import SignatureModal from "./SignatureModal";
import GroupLeaderSignModal from "./GroupLeaderSignModal";
import EventInchargeSignModal from "./EventInChargeSignModal";
import Storage from "../../Storage";
import { InsertRIFDRunning } from "../../Components/Api/TaggerApi";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Edit } from "@material-ui/icons";
import { Table } from "react-bootstrap";
import { Pagination } from "../../Components/Utils/Pagination";

const Event = () => {
    const navigate = useNavigate();
    const title = localStorage.getItem('title');
    const headerCellStyle = {
        backgroundColor: "rgb(27, 90, 144)",
        color: "#fff",
    };
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10); // Initial value
    const [selectedItemsPerPage, setSelectedItemsPerPage] = useState(10);
    const [chestNo, setChestNo] = useState("");
    const [show, setShow] = useState(false);
    const [grpLeaderShow, setGrpLeaderShow] = useState(false);
    const [eventInchargeShow, setEventInchargeShow] = useState(false);
    const [url, setUrl] = useState("");
    const [allRunning, setAllRunning] = useState([]);
    const [id, setId] = useState("");
    const signRef = useRef(null);
    const grpLdrSigRefs = useRef(null);
    const inchargeSigRefs = useRef(null);
    const menuId = localStorage.getItem("menuId");
    const parentId = localStorage.getItem("parentId").toLowerCase();
    const [candidateSignature, setCandidateSignature] = useState("")
    const [grpLeaderSignature, setGrpLeaderSignature] = useState("")
    const [inchargeSignature, setInchargeSignature] = useState("")
    const [allGroup, setAllGroup] = useState([])
    useEffect(() => {
        const fetchData = async () => {
            try {
                const groups = await getAllGroup();
                setAllGroup(groups);
                console.log(allGroup, "all group")
            } catch (error) {
                console.error("Error fetching groups:", error);
            }
        };
        fetchData();
    }, [menuId, parentId]);

    const InsertRfidData = async () => {
        await InsertRIFDRunning(menuId);
        const runningEvents = await getAllRunningEvents(menuId);
        setAllRunning(runningEvents);

    }
    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

    const handleGrpLeaderShow = () => setGrpLeaderShow(true);
    const handleGrpLeaderClose = () => setGrpLeaderShow(false);

    const handleEventInchargeShow = () => setEventInchargeShow(true);
    const handleEventInchargeClose = () => setEventInchargeShow(false);

    const handleClear = () => {
        if (signRef.current) {
            signRef.current.clear();
            setUrl("");
        }
        if (grpLdrSigRefs.current) {
            grpLdrSigRefs.current.clear();
        }
        if (inchargeSigRefs.current) {
            inchargeSigRefs.current.clear();
        }
    };

    const getSign = async (id, canId) => {
        console.log(id, "id");
        setId(id);
        try {
            const runningEvent = await getRunningEvent(id, canId);
            setChestNo(runningEvent.ChestNo);
            setCandidateSignature(runningEvent.Signature);
            setGrpLeaderSignature(runningEvent.GrpLdrSignature);
            setInchargeSignature(runningEvent.InchargeSignature);
        } catch (error) {
            // Handle error if needed
        }
    };

    const updateSign = async () => {
        const recruitId = localStorage.getItem("recruitId");
        const UserId = localStorage.getItem("userId");

        // Get the trimmed canvas URLs directly
        const trimmedCanvasUrl = signRef.current ? signRef.current.getTrimmedCanvas().toDataURL("image/png") : candidateSignature;
        const trimmedCanvasUrl1 = grpLdrSigRefs.current ? grpLdrSigRefs.current.getTrimmedCanvas().toDataURL("image/png") : grpLeaderSignature;
        const trimmedCanvasUrl2 = inchargeSigRefs.current ? inchargeSigRefs.current.getTrimmedCanvas().toDataURL("image/png") : inchargeSignature;

        // No need to set the state here; use the trimmed URLs directly in the data object
        const data = {
            id: id,
            userId: UserId,
            RecruitId: recruitId,
            chestNo: chestNo,
            signature: trimmedCanvasUrl,           // Candidate signature
            grpLdrSignature: trimmedCanvasUrl1,    // Group leader signature
            inchargeSignature: trimmedCanvasUrl2,  // Incharge signature
            group: ""
        };

        try {
            // Call the API to update the signatures
            await updateRunningEventSign(data);
            handleClose();
            handleGrpLeaderClose();
            handleEventInchargeClose();
        } catch (error) {
            // Handle error if needed
            console.error("Error updating signatures:", error);
        }
    };

    const getGroup = (groupId) => {

        navigate("/event_form", {
            state: { groupId },
        });
    }

    const sortedGroups = [...allGroup].sort((a, b) => {
        const numA = parseInt(a.groupname.replace(/\D/g, ""), 10);
        const numB = parseInt(b.groupname.replace(/\D/g, ""), 10);
        return numA - numB;
    })

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = allGroup.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <>
            <div className="container-fluid">
                <div className="card m-3" style={{ boxShadow: "0px 1px 5px rgba(0, 0, 0, 0.1)" }}>
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card-header">
                                <div className="row align-items-center">
                                    <div className="col-lg-8 col-md-8">
                                        <h4 className="card-title fw-bold py-2">{title}</h4>
                                        {title === "800 Meter Running" ? <p>List of candidates for {title} (for Female)</p> : <p>List of candidates for {title}</p>}
                                    </div>
                                    <div className="col-lg-4 col-md-4 mt-2 mt-lg-0 mt-md-0 d-flex justify-content-end">
                                        {title !== "Shot Put" ? <button className="btn me-3" style={headerCellStyle} onClick={InsertRfidData}>Sync with RFID Portal</button> : null}
                                        <button className="btn" style={headerCellStyle} onClick={() => navigate("/event_form")}>Add</button>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body pt-3">
                                <Table striped hover responsive className="border text-left mt-4">
                                    <thead>
                                        <tr>
                                            <th scope="col" style={headerCellStyle}>Group</th>
                                            <th scope="col" style={headerCellStyle}>Action</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {currentItems.map((data, index) => (
                                            <tr key={index}>
                                                <td>{data.groupname}</td>
                                                <td>
                                                    <Edit
                                                        className="text-success"
                                                        style={{ cursor: "pointer" }}
                                                        onClick={() => getGroup(data.groupid)}
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>

                                </Table>
                                <div className="row mt-4 mt-xl-3">
                                    <div className="col-lg-4 col-md-4 col-12 ">
                                        <h6 className="text-lg-start text-md-start text-center">
                                            Showing {indexOfFirstItem + 1} to{" "}
                                            {Math.min(indexOfLastItem, allGroup.length)} of{" "}
                                            {allGroup.length} entries
                                        </h6>
                                    </div>
                                    <div className="col-lg-4 col-md-4 col-12"></div>
                                    <div className="col-lg-4 col-md-4 col-12 mt-3 mt-lg-0 mt-md-0">
                                        <Pagination
                                            currentPage={currentPage}
                                            setCurrentPage={setCurrentPage}
                                            allData={allGroup}
                                            itemsPerPage={itemsPerPage}
                                        />

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>

    );
};

export default Event;
