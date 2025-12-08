
import React, { useState, useEffect } from "react";
import { Card, Button, Form, Table } from "react-bootstrap";
import { PlusCircleFill } from "react-bootstrap-icons";
import { CancelRounded } from "@material-ui/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { AddOmrMaster, getAllData } from "../../../Components/Api/OmrMasterApi";
import Cookies from 'js-cookie'; 
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Select from 'react-select'
import { apiClient } from "../../../apiClient";
import ErrorHandler from "../../../Components/ErrorHandler";
import CryptoJS from 'crypto-js';
const OmrMaster = ({ eventUnit, AddMeasurement }) => {
    const headerCellStyle = {
        backgroundColor: "rgb(27, 90, 144)",
        color: "#fff",
    };

    const location = useLocation();
    const navigate = useNavigate();
    const { cId } = location.state || {};
    const [omrRows, setOmrRows] = useState([]);
    const [omrData, setOmrData] = useState([]);
    const [recruitmentValue, setRecruitmentValue] = useState("");
    const [allRecruitment, setAllRecruitment] = useState([]);
    const RoleName = localStorage.getItem("RoleName");
    const [secretKey, setSecretKey] = useState("");

    useEffect(() => {
        const generateSecretKey = () => {
          const key = CryptoJS.lib.WordArray.random(32); // 32 bytes = 256 bits
          return key.toString(CryptoJS.enc.Hex);
        };
        const key = generateSecretKey();
        setSecretKey(key);
        console.log(key, "secret key");
      }, []);

    const handleOmrChange = (rowIndex, answerIndex, event) => {
        const { name, value } = event.target;
        const newRows = [...omrRows];

        if (name === "AnswerData") {
            newRows[rowIndex].AnswerData[answerIndex] = value; // Update the specific answer

        } else {
            newRows[rowIndex][name] = value; // Update the question number

        }
        // newRows[rowIndex][name] = value;
        setOmrRows(newRows); // Update state with the modified row
    };

    // const addOmrRows = () => {
    //     setOmrRows([
    //         ...omrRows,
    //         {
    //             index: "", // New row with empty question number
    //             AnswerData: [""], // Ensure the new row has at least one empty answer
    //         },
    //     ]);
    // };
    const addOmrRows = () => {
        setOmrRows(prevRows => [
            ...prevRows,
            { index: prevRows.length + 1, AnswerData: [""], }
        ]);
    };
    const deleteOmrRows = () => {
        if (omrRows.length > 0) {
            setOmrRows(omrRows.slice(0, -1));
        } else {
            alert("Cannot delete, no rows present.");
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch data from API
                const data = await getAllData();
                console.log(data, "data");
                setOmrData(data);

                if (data.length === 0) {
                    // If no data, clear rows
                    setOmrRows([]);
                } else {
                    // If data exists, map over the response and split AnswerData into arrays
                    const updatedRows = data.map((rowData, index) => ({
                        index: index + 1, // Set index starting from 1
                        AnswerData: rowData.AnswerData ? rowData.AnswerData.split(",") : [""], // Split AnswerData into an array
                    }));
                    setOmrRows(updatedRows);
                }
                if (RoleName === "Superadmin") {
                    await GetAllRecruitment();
                }
                else {
                    // await getAllData().then(setAllUsers);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);
    // const encryptionKey = "your-encryption-key";  // Replace with your actual key
    // const iv = CryptoJS.enc.Utf8.parse('your-initialization-vector');
    const encryptionKey = CryptoJS.enc.Hex.parse(secretKey);
    const iv = CryptoJS.lib.WordArray.random(16); 
    const AddOMr = async () => {
        const UserId = localStorage.getItem("userId");
        const recruitId = localStorage.getItem("recruitId");

        let data = {
            userId: UserId,
            recruitId: recruitId,
            answerData: omrRows.map(row => row.AnswerData).join(","), // Convert array of answers to a semicolon-separated string for each row, then join rows
            isActive: "1",
        };

        try {
            await AddOmrMaster(data);  // Send the data to the server
            const data1 = await getAllData();  // Fetch the updated data
            console.log(data1, "data");

            // Update the OMR rows with the new data
            const updatedRows = data1.map((rowData, index) => ({
                ...rowData,

                AnswerData: rowData.AnswerData ? rowData.AnswerData.split(",") : [], // Convert string to an array
            }));
            setOmrRows(updatedRows);  // Set the state with the updated rows

        } catch (error) {
            console.error("Error adding OMR:", error);
        }
    };
    // const AddOMr = async () => {
    //     const UserId = localStorage.getItem("userId");
    //     const recruitId = localStorage.getItem("recruitId");
    
    //     // Join the answer data into a comma-separated string
    //     let answerDataString = omrRows.map(row => row.AnswerData.join(",")).join(";");
    
    //     // Encrypt the AnswerData
    //     const encryptedAnswerData = CryptoJS.AES.encrypt(answerDataString, CryptoJS.enc.Utf8.parse(encryptionKey), { iv }).toString();
    
    //     let data = {
    //         userId: UserId,
    //         recruitId: recruitId,
    //         answerData: encryptedAnswerData,  // Pass the encrypted data to the server
    //         isActive: "1",
    //     };
    
    //     try {
    //         await AddOmrMaster(data);  // Send the data to the server
    //         const data1 = await getAllData();  // Fetch the updated data
    //         console.log(data1, "data");
    
    //         // Update the OMR rows with the new data
    //         const updatedRows = data1.map((rowData, index) => ({
    //             ...rowData,
    //             AnswerData: rowData.AnswerData ? rowData.AnswerData.split(",") : [], // Convert string to an array
    //         }));
    //         setOmrRows(updatedRows);  // Set the state with the updated rows
    
    //     } catch (error) {
    //         console.error("Error adding OMR:", error);
    //     }
    // };
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
    const handleRecruitmentChange = (selected) => {
        const selectedValue = selected;
        setRecruitmentValue(selectedValue);
        console.log(selectedValue.value, "selected value");
        localStorage.setItem("recruitId", selectedValue.value);
        const recruitId = localStorage.getItem("recruitId");
        const UserId = localStorage.getItem("userId");
        apiClient({
            method: "get",
            url: (`OmrMaster/GetAll`).toString(),
            params: {
                userid: UserId,
                recConfId: recruitId,
            },
        })
            .then((response) => {
                console.log("get all candidate by recruitment", response.data.data);
                const token1 = response.data.outcome.tokens;
                Cookies.set("UserCredential", token1, { expires: 7 });
                const temp = response.data.data;
                setOmrRows(temp)
                if (temp.length === 0) {
                    // If no data, clear rows
                    setOmrRows([]);
                } else {
                    // If data exists, map over the response and split AnswerData into arrays
                    const updatedRows = temp.map((rowData, index) => ({
                        index: index + 1, // Set index starting from 1
                        AnswerData: rowData.AnswerData ? rowData.AnswerData.split(",") : [""], // Split AnswerData into an array
                    }));
                    setOmrRows(updatedRows);
                }
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
        <div className="container-fluid p-3">
            <Card className="mb-4">
                <Card.Header>
                    <div className="row">
                        <div className="col-lg-5">
                            <h5 className="fw-bold">OMR Master</h5>
                        </div>
                        <div className="col-lg-7">
                            {
                                RoleName === "Superadmin" && (
                                    <div className="me-2 my-auto float-end">
                                        <Select
                                            value={recruitmentValue}
                                            onChange={handleRecruitmentChange}
                                            options={allRecruitment}
                                            placeholder="Select Recruitment"
                                            styles={{
                                                control: (provided) => ({
                                                    ...provided,
                                                    width: "100%", // Adjust width as needed
                                                }),
                                            }}
                                        />
                                    </div>
                                )
                            }
                        </div>
                    </div>


                </Card.Header>
                <Card.Body>
                    <Table striped bordered hover className="mt-4">
                        <thead>
                            <tr>
                                <th style={headerCellStyle} className="text-white">
                                    Question No.
                                </th>
                                <th style={headerCellStyle} className="text-white">
                                    Answer
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {omrRows.length === 0 ? (
                                <tr>
                                    <td colSpan="2" className="text-center">No data available, Please add data</td>
                                </tr>
                            ) : (
                                omrRows.map((row, rowIndex) =>
                                    row.AnswerData.map((answer, answerIndex) => (
                                        <tr key={`${rowIndex}-${answerIndex}`}>
                                            <td>
                                                <Form.Group className="form-group-sm">
                                                    <Form.Control
                                                        type="text"
                                                        name="index"
                                                        placeholder="Enter Question No."
                                                        disabled
                                                        value={omrRows.slice(0, rowIndex).reduce((acc, r) => acc + r.AnswerData.length, 0) + answerIndex + 1}
                                                        onChange={(e) => handleOmrChange(rowIndex, answerIndex, e)}
                                                    />
                                                </Form.Group>
                                            </td>

                                            <td>
                                                <Form.Group className="form-group-sm">
                                                    <Form.Control
                                                        type="text"
                                                        name="AnswerData"
                                                        placeholder="Enter Answer"
                                                        value={answer}
                                                        onChange={(e) => handleOmrChange(rowIndex, answerIndex, e)}
                                                    />
                                                </Form.Group>
                                            </td>
                                        </tr>
                                    ))
                                )
                            )}

                            <tr>
                                <td colSpan="2" className="text-end">
                                    <PlusCircleFill
                                        style={{ fontSize: "30px", cursor: "pointer" }}
                                        onClick={addOmrRows}
                                    />
                                    <CancelRounded
                                        style={{ fontSize: "35px", cursor: "pointer" }}
                                        onClick={deleteOmrRows}
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </Table>
                </Card.Body>
                <Card.Footer className="text-end">
                    <Button
                        className="text-light"
                        style={{ backgroundColor: "#1B5A90" }}
                        onClick={AddOMr}
                    >
                        Save
                    </Button>
                </Card.Footer>
            </Card>
        </div>
    );
};

export default OmrMaster;
