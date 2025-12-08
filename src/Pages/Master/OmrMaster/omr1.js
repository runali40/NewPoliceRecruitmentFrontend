import React, { useState, useEffect } from "react";
import { Card, Button, Form, Table } from "react-bootstrap";
import { PlusCircleFill } from "react-bootstrap-icons";
import { CancelRounded } from "@material-ui/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { AddOmrMaster, getAllData } from "../../../Components/Api/OmrMasterApi";
import Cookies from "js-cookie";
import Select from "react-select";
import { apiClient } from "../../../apiClient";
import ErrorHandler from "../../../Components/ErrorHandler";
import CryptoJS from "crypto-js";

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
    const storedKey = localStorage.getItem("encryptionKey");
    if (storedKey) {
      setSecretKey(storedKey);
    } else {
      const newKey = CryptoJS.lib.WordArray.random(32).toString(
        CryptoJS.enc.Hex
      );
      localStorage.setItem("encryptionKey", newKey);
      setSecretKey(newKey);
    }
  }, []);

  const encryptAnswer = (answer) => {
    const key = CryptoJS.enc.Hex.parse(secretKey);
    const iv = CryptoJS.lib.WordArray.random(16);
    const encrypted = CryptoJS.AES.encrypt(answer, key, { iv: iv });
    return iv.concat(encrypted.ciphertext).toString(CryptoJS.enc.Base64);
  };

  const decryptAnswer = (encryptedText) => {
    try {
      const key = CryptoJS.enc.Hex.parse(secretKey);
      const ciphertext = CryptoJS.enc.Base64.parse(encryptedText);
      const iv = ciphertext.clone();
      iv.sigBytes = 16;
      iv.clamp();
      ciphertext.words.splice(0, 4); // Remove IV from ciphertext
      ciphertext.sigBytes -= 16;

      const decrypted = CryptoJS.AES.decrypt({ ciphertext: ciphertext }, key, {
        iv: iv,
      });
      return decrypted.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error("Error decrypting answer:", error);
      return "Error decrypting";
    }
  };

  const handleOmrChange = (rowIndex, answerIndex, event) => {
    const { name, value } = event.target;
    const newRows = [...omrRows];

    if (name === "AnswerData") {
      newRows[rowIndex].AnswerData[answerIndex] = value;
    } else {
      newRows[rowIndex][name] = value;
    }
    setOmrRows(newRows);
  };

  const addOmrRows = () => {
    setOmrRows((prevRows) => [
      ...prevRows,
      { index: prevRows.length + 1, AnswerData: [""] },
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
        const data = await getAllData();
        setOmrData(data);

        if (data.length === 0) {
          setOmrRows([]);
        } else {
          const updatedRows = data.map((rowData, index) => {
            const decryptedAnswers = rowData.AnswerData
              ? rowData.AnswerData.split(",").map((answer) =>
                  decryptAnswer(answer)
                )
              : [];

            return {
              index: index + 1,
              AnswerData: decryptedAnswers,
            };
          });
          console.log(updatedRows, "updatedRows");
          setOmrRows(updatedRows);
        }

        if (RoleName === "Superadmin") {
          await GetAllRecruitment();
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (secretKey) {
      fetchData();
    }
  }, [RoleName, secretKey]);

  const handleRecruitmentChange = (selected) => {
    const selectedValue = selected;
    setRecruitmentValue(selectedValue);
    localStorage.setItem("recruitId", selectedValue.value);

    const recruitId = localStorage.getItem("recruitId");
    const UserId = localStorage.getItem("userId");

    apiClient({
      method: "get",
      url: `OmrMaster/GetAll`,
      params: {
        userid: UserId,
        recConfId: recruitId,
      },
    })
      .then((response) => {
        const temp = response.data.data;
        const updatedRows = temp.map((rowData, index) => {
          const decryptedAnswers = rowData.AnswerData
            ? rowData.AnswerData.split(",").map((answer) =>
                decryptAnswer(answer)
              )
            : [];

          return {
            index: index + 1,
            AnswerData: decryptedAnswers,
          };
        });
        setOmrRows(updatedRows);
      })
      .catch((error) => {
        const errors = ErrorHandler(error);
        toast.error(errors);
      });
  };

  const AddOMr = async () => {
    const UserId = localStorage.getItem("userId");
    const recruitId = localStorage.getItem("recruitId");

    const encryptedOmrRows = omrRows.map((row, rowIndex) => {
        // Encrypt each answer in AnswerData array
        const encryptedAnswers = row.AnswerData.map((answer, answerIndex) => {
            if (answer) {
                const encryptedAnswer = encryptAnswer(answer);
                console.log(`Row ${rowIndex}, Answer ${answerIndex} encrypted: ${encryptedAnswer}`);
                return encryptedAnswer;
            } else {
                console.log(`Row ${rowIndex}, Answer ${answerIndex} is empty or invalid`);
                return ""; // In case of an empty value, return an empty string
            }
        });

        return {
            ...row,
            AnswerData: encryptedAnswers.join(",")
        };
    });

    const data = {
        userId: UserId,
        recruitId: recruitId,
        answerData: encryptedOmrRows
            .map(row => row.AnswerData)
            .join(","),  // Flatten all encrypted answers into a single string
        isActive: "1"
    };

    try {
        await AddOmrMaster(data);  // API call to submit the encrypted data
        const data1 = await getAllData();  // Fetch updated data after saving

        // Decrypt the data for displaying in the table
        const updatedRows = data1.map((rowData, index) => ({
            index: index + 1,
            AnswerData: rowData.AnswerData
                ? rowData.AnswerData.split(",").map(answer => decryptAnswer(answer))
                : [],
        }));
        setOmrRows(updatedRows);  // Update the state with the decrypted answers
    } catch (error) {
        console.error("Error adding OMR:", error);
    }
};

  const GetAllRecruitment = () => {
    const recruitId = localStorage.getItem("recruitId");
    const UserId = localStorage.getItem("userId");
    const params = {
      UserId: UserId,
      RecruitId: recruitId,
    };
    apiClient({
      method: "get",
      params: params,
      url: `Recruitment/GetAll`,
    })
      .then((response) => {
        const temp = response.data.data;
        const options = temp.map((data) => ({
          value: data.Id,
          label: `${data.place} / ${data.post}`,
        }));
        setAllRecruitment(options);
      })
      .catch((error) => {
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
              {RoleName === "Superadmin" && (
                <div className="me-2 my-auto float-end">
                  <Select
                    value={recruitmentValue}
                    onChange={handleRecruitmentChange}
                    options={allRecruitment}
                    placeholder="Select Recruitment"
                  />
                </div>
              )}
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
                  <td colSpan="2" className="text-center">
                    No data available, Please add data
                  </td>
                </tr>
              ) : (
                omrRows.flatMap((row, rowIndex) =>
                  row.AnswerData.map((answer, answerIndex) => (
                    <tr key={`${rowIndex}-${answerIndex}`}>
                      <td>
                        <Form.Group className="form-group-sm">
                          <Form.Control
                            type="text"
                            name="index"
                            placeholder="Enter Question No."
                            disabled
                            value={
                              omrRows
                                .slice(0, rowIndex)
                                .reduce(
                                  (acc, r) => acc + r.AnswerData.length,
                                  0
                                ) +
                              answerIndex +
                              1
                            }
                            onChange={(e) =>
                              handleOmrChange(rowIndex, answerIndex, e)
                            }
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
                            onChange={(e) =>
                              handleOmrChange(rowIndex, answerIndex, e)
                            }
                          />
                        </Form.Group>
                      </td>
                    </tr>
                  ))
                )
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
      <Button variant="primary" onClick={AddOMr} className="me-2">
        Add
      </Button>
      <Button variant="secondary" onClick={addOmrRows} className="me-2">
        <PlusCircleFill /> Add Row
      </Button>
      <Button variant="danger" onClick={deleteOmrRows}>
        <CancelRounded /> Delete Row
      </Button>
    </div>
  );
};

export default OmrMaster;
