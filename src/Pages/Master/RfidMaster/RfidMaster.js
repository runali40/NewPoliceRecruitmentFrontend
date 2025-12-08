import React, { useState, useEffect, useRef } from "react";
import { Table, Modal, Form, Row, Col, Button } from "react-bootstrap";
import Select from "react-select";
import {
    getAllData,
} from "../../../Components/Api/UserMasterApi";
import * as XLSX from "xlsx";
import { apiClient } from "../../../apiClient";
import ErrorHandler from "../../../Components/ErrorHandler";
import Cookies from 'js-cookie';
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const RfidMaster = () => {
    const [allUsers, setAllUsers] = useState([]);
    const [file, setFile] = useState(null);
    const [recruitmentValue, setRecruitmentValue] = useState("");
    const [allRecruitment, setAllRecruitment] = useState([]);
    const RoleName = localStorage.getItem("RoleName");

    const headerCellStyle = {
        backgroundColor: "rgb(27, 90, 144)",
        color: "#fff",
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch data sequentially
                // const usersData = await getAllData();
                // // Batch state updates
                // setAllUsers(usersData);
                if (RoleName === "Superadmin") {
                    await GetAllRecruitment();
                }
                else {
                    await getAllData().then(setAllUsers);
                }


            } catch (error) {
                console.error("Error fetching data:", error);
            }

        };

        fetchData();
    }, []);

    // Run test in development
    const handleFileChange = async (e) => {
        const recruitId = localStorage.getItem("recruitId");
        e.preventDefault();
        const selectedFile = e.target.files[0];
        console.log(selectedFile, "file change");

        // Use a callback to ensure the file is updated before the upload logic runs
        setFile(selectedFile);

        // Create a new function to handle the upload
        const uploadFile = async (fileToUpload) => {
            const UserId = localStorage.getItem("userId");
            if (!fileToUpload) {
                console.error("File field is required");
                return;
            }

            const formData = new FormData();
            formData.append("file", fileToUpload);
            formData.append("userId", UserId);
            formData.append("RecruitId", recruitId);

            console.log(...formData, "formdata");

            try {
                const response = await apiClient.post(
                    `RFIDChestNoMapping/RFIDupload`,
                    formData,
                    {}
                );

                if (response.status === 200) {
                    const result = response.data;
                    console.log("Success:", result);
                    const token1 = result.outcome.tokens;
                    Cookies.set("UserCredential", token1, { expires: 7 });

                } else {
                    console.error("Error:", response.statusText);
                }
            } catch (error) {
                if (error.response && error.response.data && error.response.data.outcome) {
                    const token1 = error.response.data.outcome.tokens;
                    Cookies.set("UserCredential", token1, { expires: 7 });
                }
                console.error("Error:", error);
                const errors = ErrorHandler(error);
                toast.error(errors);
            }
        };

        // Call the upload function with the selected file
        uploadFile(selectedFile);
    };

    const fileInputRef = useRef(null);

    const handleUploadClick = () => {
        fileInputRef.current.click();
    };

    const GetAllRecruitment = () => {
        const recruitId = localStorage.getItem("recruitId");
        const UserId = localStorage.getItem("userId");
        const params = {
            UserId: UserId,
            RecruitId: recruitId
        };
        apiClient({
            method: "get",
            params: params,
            url: (`Recruitment/GetAll`).toString(),
        })
            .then((response) => {
                console.log("get all recruitment", response.data.data);
                const token1 = response.data.outcome.tokens;
                Cookies.set("UserCredential", token1, { expires: 7 });
                // setAllCandidates(response.data.data)
                const temp = response.data.data;
                const options = temp.map((data) => ({
                    value: data.Id,
                    label: `${data.place} / ${data.post}`,
                }));
                setAllRecruitment(options);
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.outcome) {
                    const token1 = error.response.data.outcome.tokens;
                    Cookies.set("UserCredential", token1, { expires: 7 });
                }
                console.log(error);
                const errors = ErrorHandler(error);
                toast.error(errors);
            });
    };

    return (
        <>
            <div className="container-fluid">
                <div
                    className="card m-3"
                    style={{ boxShadow: "0px 1px 5px rgba(0, 0, 0, 0.1)" }}
                >
                    <div className="row">
                        <div className="col-lg-12 col-md-12">
                            <div className="card-header">
                                <div className="row align-items-center">
                                    <div className="col-lg-3 col-md-3">
                                        <h4 className="card-title fw-bold">Rfid Master</h4>
                                    </div>
                                    <div className="col-lg-9 col-md-9 d-flex justify-content-end align-items-end">
                                        <div className="btn btn-add me-2" title="Add New">

                                        </div>

                                    </div>
                                </div>
                            </div>
                            <div className="card-body pt-3">

                                <div className="btn btn-add me-1" title="Import">
                                    <input
                                        className="form-control"
                                        type="file"
                                        onChange={handleFileChange}
                                        ref={fileInputRef}
                                        style={{ display: "none" }}
                                    />
                                    <Button
                                        onClick={handleUploadClick}
                                        style={{ backgroundColor: "#1B5A90" }}
                                    >
                                        Import
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
};

export default RfidMaster;
