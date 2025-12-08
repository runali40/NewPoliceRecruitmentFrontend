import React, { useState, useEffect } from "react";
import { Card, Button, Form, Table } from "react-bootstrap";
import { PlusCircleFill } from "react-bootstrap-icons";
import { CancelRounded } from "@material-ui/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { AddOmrMaster, getAllData, getAllSet } from "../../../Components/Api/OmrMasterApi";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
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
  const [selectedSet, setSelectedSet] = useState(null);
  const [allSet, setAllSet] = useState([]);
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
      localStorage.setItem("encryptionKey", '1d344b12ec61ea98b041e3f5dff189715e30ec3e7dd3478c616f1da6ca7a5cca');
      setSecretKey(newKey);
      setSecretKey('1d344b12ec61ea98b041e3f5dff189715e30ec3e7dd3478c616f1da6ca7a5cca')
    }
  }, []);

  const handleSet = async (selected) => {
    setSelectedSet(selected);
    console.log("Selected Value:", selected);
    const data = await getAllData(selected);
    setOmrData(data);

    if (data.length === 0) {
      setOmrRows([]);
    } else {
      // Store data without decryption for now
      console.log(data, "Fetched Data");
    }

  };

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

  // const handleOmrChange = (rowIndex, answerIndex, event) => {
  //   const { name, value } = event.target;
  //   const newRows = [...omrRows];

  //   if (name === "AnswerData") {
  //     newRows[rowIndex].AnswerData[answerIndex] = value;
  //   } else {
  //     newRows[rowIndex][name] = value;
  //   }
  //   setOmrRows(newRows);
  // };
  const handleOmrChange = (rowIndex, answerIndex, event) => {
    const { name, value } = event.target;
    const newRows = [...omrRows];
  
    if (name === "AnswerData") {
      const filteredValue = value.toUpperCase().replace(/[^A-Z]/g, "");
      newRows[rowIndex].AnswerData[answerIndex] = filteredValue;
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
      // Get the last row
      const lastRow = omrRows[omrRows.length - 1];

      // Check if AnswerData is empty in the last row
      const isAnswerDataEmpty = lastRow.AnswerData.every(answer => answer.trim() === "");

      if (isAnswerDataEmpty) {
        setOmrRows(omrRows.slice(0, -1));
      } else {
        toast.error("Can not delete the row");
      }
    } else {
      toast.error("Can not delete, no rows present.");
    }
  };

  useEffect(() => {
    // Fetch data immediately, without waiting for the secretKey
    const fetchData = async () => {
      try {
        // const data = await getAllData();
        // setOmrData(data);

        // if (data.length === 0) {
        //   setOmrRows([]);
        // } else {
        //   // Store data without decryption for now
        //   console.log(data, "Fetched Data");
        // }

        const quesSet = await getAllSet();
        setAllSet(quesSet)
        if (RoleName === "Superadmin") {
          await GetAllRecruitment();
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [RoleName]);

  // Separate useEffect for decryption once secretKey is available
  useEffect(() => {
    if (secretKey && omrData.length > 0) {
      const updatedRows = omrData.map((rowData, index) => {
        const decryptedAnswers = rowData.AnswerData
          ? rowData.AnswerData.split(",").map((answer) => {
            console.log("Encrypted answer:", answer);
            const decrypted = decryptAnswer(answer);
            console.log(decrypted, "decrypt answer");
            return decrypted;
          })
          : [];

        return {
          index: index + 1,
          AnswerData: decryptedAnswers,
        };
      });

      console.log(updatedRows, "Decrypted updatedRows");
      setOmrRows(updatedRows);
    }
  }, [secretKey, omrData]);

  const handleRecruitmentChange = (selected) => {
    const selectedValue = selected;
    setRecruitmentValue(selectedValue);
    localStorage.setItem("recruitId", selectedValue.value);

    // const recruitId = localStorage.getItem("recruitId");
    // const UserId = localStorage.getItem("userId");

    // apiClient({
    //   method: "get",
    //   url: `OmrMaster/GetAll`,
    //   params: {
    //     userid: UserId,
    //     recConfId: recruitId,
    //   },
    // })
    //   .then((response) => {
    //     const temp = response.data.data;
    //     const updatedRows = temp.map((rowData, index) => {
    //       const decryptedAnswers = rowData.AnswerData
    //         ? rowData.AnswerData.split(",").map((answer) =>
    //           decryptAnswer(answer)
    //         )
    //         : [];

    //       return {
    //         index: index + 1,
    //         AnswerData: decryptedAnswers,
    //       };
    //     });
    //     setOmrRows(updatedRows);
    //   })
    //   .catch((error) => {
    //     const errors = ErrorHandler(error);
    //     toast.error(errors);
    //   });
  };

  const AddOMr = async () => {
    const UserId = localStorage.getItem("userId");
    const recruitId = localStorage.getItem("recruitId");
    if (recruitId === "null" || RoleName === "Superadmin") {
      if (!recruitmentValue) {
        toast.warning("Please select recruitment!");
        return;
      }
    }
    if(selectedSet === null){
      toast.warning("Please select question set");
      return;
    }
    // Check if there are any rows
    if (!omrRows || omrRows.length === 0) {
      toast.warning("Please add at least one row before submitting");
      return;
    }

    // Check if all existing rows have answers filled
    const hasEmptyAnswers = omrRows.some(row => {
      // Skip empty rows (rows without AnswerData)
      if (!row.AnswerData || !Array.isArray(row.AnswerData)) return false;

      // Check if any answer in this row is empty
      return row.AnswerData.some(answer => !answer || answer.trim() === "");
    });

    if (hasEmptyAnswers) {
      toast.warning("Please fill all answers before submitting");
      return;
    }

    try {
      const encryptedOmrRows = omrRows.map((row, rowIndex) => {
        const answers = Array.isArray(row.AnswerData) ? row.AnswerData : [];

        const encryptedAnswers = answers.map((answer, answerIndex) => {
          if (answer && typeof answer === 'string' && answer.trim() !== "") {
            try {
              return encryptAnswer(answer.trim());
            } catch (error) {
              console.error(`Encryption error for row ${rowIndex}, answer ${answerIndex}:`, error);
              return "";
            }
          }
          return "";
        });

        return {
          ...row,
          AnswerData: encryptedAnswers.join(","),
        };
      });

      const data = {
        userId: UserId,
        recruitId: recruitId,
        answerData: encryptedOmrRows.map(row => row.AnswerData).join(","),
        questionSet: selectedSet.value,
        isActive: "1",
      };

      await AddOmrMaster(data);
      const data1 = await getAllData(selectedSet);

      const updatedRows = data1.map((rowData, index) => ({
        index: index + 1,
        AnswerData: rowData.AnswerData
          ? rowData.AnswerData.split(",").map(answer => {
            try {
              return answer ? decryptAnswer(answer) : "";
            } catch (error) {
              console.error("Decryption error:", error);
              return "";
            }
          })
          : [],
      }));

      setOmrRows(updatedRows);
      toast.success("Answers added successfully!");

    } catch (error) {
      console.error("Error adding OMR:", error);
      toast.error("Failed to add OMR Master. Please try again.");
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
    <>
      <div className="container-fluid p-3">
        <Card className="mb-4">
          <Card.Header>
            <div className="row">
              <div className="col-lg-5 mt-2">
                <h4 className="fw-bold">OMR Master</h4>
              </div>
              <div className="col-lg-7">
                {RoleName === "Superadmin" && (
                  <div className="me-2 my-auto float-end">
                    <Select
                      value={recruitmentValue}
                      onChange={handleRecruitmentChange}
                      options={allRecruitment}
                      placeholder="Select Recruitment"
                      styles={{
                        control: (provided) => ({
                          ...provided,
                          // width: "100%", // Adjust width as needed
                          minWidth: "200px", // Set a fixed minimum width
                          maxWidth: "200px",
                        }),
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </Card.Header>
          <Card.Body>
            <div className="row">
              <div className="col-lg-2">
                <label className="fw-bold">Question Set:</label>
              </div>
              <div className="col-lg-4">
                <Select
                  options={allSet}
                  value={selectedSet}  // Bind selected value
                  onChange={handleSet} // Handle change event
                  placeholder="Select an option"
                />
              </div>
            </div>
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
                <tr>
                  <td colSpan="5" className="text-end">
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

          <Card.Footer>
            <Button onClick={AddOMr} className="me-2" style={{ backgroundColor: "rgb(27, 90, 144)" }}>
              Add
            </Button>
          </Card.Footer>
        </Card>
      </div>

    </>

  );
};

export default OmrMaster;
