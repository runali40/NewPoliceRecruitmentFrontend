import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { Table } from "react-bootstrap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getAllAppeals, submitAppeal } from "../../Components/Api/AppealApi";
import { ArrowBack } from "@material-ui/icons";

const AppealForm = () => {

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const location = useLocation();
  const { state } = location;
  console.log(state, "state")
  const [appealHistory, setAppealHistory] = useState([]);
  const [approvedData, setApprovedData] = useState("")
  const navigate = useNavigate();

  const headerCellStyle = {
    backgroundColor: "rgb(27, 90, 144)",
    color: "#fff",
  };

  useEffect(() => {
    if (state && state.candidateid) {
      fetchAllAppeals();
    } else {
      console.error("Candidate ID is missing in state");
    }
  }, [state]);

  const fetchAllAppeals = async () => {
    try {
      const appeals = await getAllAppeals(state.candidateid);
      setAppealHistory(appeals);
    } catch (error) {
      console.error("Error fetching appeals:", error);
    }
  };

  const SubmitFun = async (data) => {
    const candId = state.candidateid;
    try {
      const response = await submitAppeal(data, candId, approvedData, state.eventName);
      console.log(approvedData, "approved Data")
      toast.success(response.outcome.outcomeDetail);
      reset();
      await fetchAllAppeals(); // Ensure that appeals are fetched before navigating
      navigate(`/candidate/${state.candidateid}`);
    } catch (error) {
      console.error("Error submitting appeal:", error);
    }
  };
  const handleRadioChange = (event) => {
    setApprovedData(event.target.value); // Update state with selected value
  };
  return (
    <>
      <div className="container-fluid p-3">
        <div className="row">
          <div className="col-lg-12">
            <form onSubmit={handleSubmit(SubmitFun)}>
              <div className="card">
                <div className="card-header py-3">
                  <div className="d-flex justify-content-between">
                    <h4 className="fw-bold">Appeal</h4>
                    <button
                      type="button"
                      className="btn text-white"
                      style={{ backgroundColor: "rgb(27, 90, 144)" }}
                      onClick={() => navigate("/candidate")}
                    >
                      <ArrowBack />
                    </button>
                  </div>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="row">
                        <div className="col-lg-2">
                          <label htmlFor="Date">Date</label>
                        </div>
                        <div className="col-lg-4 mt-lg-0 mt-md-0 mt-3">
                          <div className="form-group">
                            <input
                              type="date"
                              className="form-control"
                              name="Date"
                              id="Date"
                              {...register("Date", { required: true })}
                            />

                          </div>
                        </div>
                        <div className="col-lg-2">
                          <label htmlFor="ApprovedBy">Approved by</label>
                        </div>
                        <div className="col-lg-4 mt-lg-0 mt-md-0 mt-3">
                          <div className="form-group">
                            <input
                              type="text"
                              className="form-control"
                              name="ApprovedBy"
                              id="ApprovedBy"
                              {...register("ApprovedBy", { required: true })}
                            />

                          </div>
                        </div>
                        <div className="col-lg-2 mt-4">
                          <label htmlFor="Remark">Remark</label>
                        </div>
                        <div className="col-lg-4 mt-lg-3 mt-md-0 mt-3">
                          <div className="form-group">
                            <input
                              type="text"
                              className="form-control mt-2"
                              name="Remark"
                              id="Remark"
                              {...register("Remark")}
                            />
                          </div>
                        </div>
                        <div className="col-lg-2 mt-4">
                          <label htmlFor="Status">Status</label>
                        </div>
                        <div className="col-lg-4 col-md-4 mt-2 mt-lg-4">
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
                          <div className="form-check">
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
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-footer py-3">
                  <button
                    type="submit"
                    title="submit"
                    className="btn btn-success"
                    onClick={SubmitFun}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </form>
            <div className="card mt-4">

              <div className="card-header py-3">
                <div className="d-flex justify-content-between">
                  <h4 className="fw-bold">Appeal History</h4>
                  <button
                    type="button"
                    className="btn text-white"
                    style={{ backgroundColor: "rgb(27, 90, 144)" }}
                    onClick={() => navigate("/candidate")}
                  >
                    <ArrowBack />
                  </button>
                </div>
              </div>
              <div className="card-body pt-1">
                <Table
                  striped
                  hover
                  responsive
                  className="border text-left mt-4"
                >
                  <thead>
                    <tr>
                      <th scope="col" style={headerCellStyle}>
                        Date
                      </th>
                      <th scope="col" style={headerCellStyle}>
                        Approved by
                      </th>
                      <th scope="col" style={headerCellStyle}>
                        Remark
                      </th>
                      <th scope="col" style={headerCellStyle}>
                        Status
                      </th>
                      <th scope="col" style={headerCellStyle}>
                        Reason
                      </th>
                      <th scope="col" style={headerCellStyle}>
                        No. of Attempt
                      </th>
                      <th scope="col" style={headerCellStyle}>
                        Created Date
                      </th>
                      <th scope="col" style={headerCellStyle}>
                        Active
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {appealHistory.map((value) => (
                      <tr key={value.id}>
                        <td>{value.date.split("T")[0]}</td>
                        <td>{value.ApprovedBy}</td>
                        <td>{value.Remark}</td>
                        <td>{value.Status}</td>
                        <td>{value.stage}</td>
                        <td>{value.NoOfAttemp}</td>
                        <td>{value.CreatedDate.split("T")[0]}</td>
                        <td>{value.isactive === "1" ? "Yes" : "No"}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      </div>


    </>
  );
};

export default AppealForm;
