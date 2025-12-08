import React, { useState, useEffect } from "react";
import { Card, Button, Table, Form } from "react-bootstrap";
import { Edit } from "@material-ui/icons";
import {
  addConfigMeasurement,
  getAllHeightChestGender,
  getAllMeasurement,
} from "../../../Components/Api/ConfigurationApi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MeasurementMaster = () => {
  const headerCellStyle = {
    backgroundColor: "rgb(27, 90, 144)",
    color: "#fff",
  };

  const [allGender, setAllGender] = useState([]);
  const [allMeasurement, setAllMeasurement] = useState([]);
  const [measurementId, setMeasurementId] = useState("");
  const [editableRowId, setEditableRowId] = useState(null);

  // useEffect(() => {
  //   // Fetch all measurements and genders
  //   getAllMeasurement()
  //     .then(setAllMeasurement)
  //     .catch((error) => console.error("Error fetching measurements:", error));

  //   getAllHeightChestGender()
  //     .then(setAllGender)
  //     .catch((error) => console.error("Error fetching genders:", error));
  // }, []);
  useEffect(() => {
    // Fetch all genders first, then fetch all measurements
    getAllHeightChestGender()
      .then((genderData) => {
        setAllGender(genderData); // Set genders after fetching
        return getAllMeasurement(); // Call getAllMeasurement after setting genders
      })
      .then((measurementData) => {
        setAllMeasurement(measurementData); // Set measurements after fetching
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);
  const GetMeasurement = (id) => {
    setMeasurementId(id);
  };

  const AddMeasurement = () => {
    const recruitId = localStorage.getItem("recruitId");
    const UserId = localStorage.getItem("userId");
    const selectedMeasurement = allMeasurement.find(
      (data) => data.c_id === measurementId
    );
    const minvalue = selectedMeasurement?.minvalue || "";

    if (minvalue) {
      let data = {
        UserId: UserId,
        c_id: measurementId,
        minvalue: minvalue,
        RecruitId: recruitId,
      };
      addConfigMeasurement(data)
        .then(() => {
          getAllMeasurement().then(setAllMeasurement);
          toast.success("Measurement saved successfully!", { autoClose: 5000 }); // Show success toast
        })
        .catch((error) => {
          console.error("Error saving measurement:", error);
          toast.error("Failed to save measurement!", { autoClose: false }); // Show error toast with no auto-close
        });
    } else {
      console.log("No measurement selected");
      toast.warn("Please select a measurement to save.", { autoClose: false });
    }
  };

  const handleMeasurementChange = (index, event) => {
    const { name, value } = event.target;
    const updatedMeasurements = [...allMeasurement];
    updatedMeasurements[index] = {
      ...updatedMeasurements[index],
      [name]: value,
    };
    setAllMeasurement(updatedMeasurements);
  };

  return (
    <>
      <div className="container-fluid py-4">
        <div className="card">
          <div className="card-header">
            <h4 className="mt-3 text-start fw-bold">Measurement Master</h4>
          </div>
          <div className="card-body">
            <Table striped bordered hover className="mt-4">
              <thead>
                <tr>
                  <th style={headerCellStyle} className="text-white">
                    Parameter Name
                  </th>
                  <th style={headerCellStyle} className="text-white">
                    Value
                  </th>
                  <th style={headerCellStyle} className="text-white">
                    Gender
                  </th>
                  <th style={headerCellStyle} className="text-white">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {allMeasurement.map((row, index) => (
                  <tr key={row.c_id}>
                    <td>
                      <Form.Group className="form-group-sm">
                        <Form.Control
                          type="text"
                          name="perticulars"
                          value={row.perticulars}
                          disabled

                        />
                      </Form.Group>
                    </td>
                    <td>
                      <Form.Group className="form-group-sm">
                        <Form.Control
                          type="text"
                          name="minvalue"
                          value={row.minvalue}
                          // onChange={(e) => handleMeasurementChange(index, e)}
                          onChange={(e) => {
                            const value = e.target.value;
                            // Allow only numbers, limit length to 4
                            if (/^\d{0,4}$/.test(value)) {
                              handleMeasurementChange(index, e);
                            }
                          }}
                          disabled={editableRowId !== row.c_id}
                        />
                      </Form.Group>
                    </td>
                    <td>
                      <Form.Group className="form-group-sm">
                        <Form.Select
                          name="gender"
                          value={row.gender || ""}
                          onChange={(e) => handleMeasurementChange(index, e)}
                          disabled
                        >
                          <option value="" disabled>
                            Select Gender
                          </option>
                          {allGender.map((genderData, genderIndex) => (
                            <option
                              key={genderIndex}
                              value={genderData.pv_parametervalue}
                            >
                              {genderData.pv_parametervalue}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </td>
                    <td>
                      <Edit
                        className="text-success mr-2"
                        type="button"
                        onClick={() => {
                          GetMeasurement(row.c_id);
                          setEditableRowId(row.c_id);
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          <div className="card-footer">
            <div className="col-lg-12 text-end">
              <Button
                className="text-light"
                style={{ backgroundColor: "#1B5A90" }}
                onClick={AddMeasurement}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>

    </>
  );
};

export default MeasurementMaster;
