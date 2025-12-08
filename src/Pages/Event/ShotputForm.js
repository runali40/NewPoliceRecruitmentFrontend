import React, { useState, useEffect } from "react";
import SignatureCanvas from "react-signature-canvas";
import { useNavigate } from "react-router-dom";
import Storage from "../../Storage";
import { addShotPut } from "../../Components/Api/EventApi";


const ShotputForm = () => {
  const navigate = useNavigate();
  const [sign, setSign] = useState(null);
  const [chestNo, setChestNo] = useState("");
  const [distance, setDistance] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [url, setUrl] = useState("");
  const storedToken = localStorage.getItem("UserCredential");
  const UserId = localStorage.getItem("userId");

  useEffect(() => {
    console.log(UserId, "userId");
  }, []);

  const AddShotPut = () => {
    const menuId = localStorage.getItem("menuId");
    const recruitId = localStorage.getItem("recruitId");
    const UserId = localStorage.getItem("userId");
    const fullSignatureUrl = sign.getTrimmedCanvas().toDataURL("image/png");
    setUrl(fullSignatureUrl);
    const data = {
      Menuid: menuId,
      userId: UserId,
      RecruitId: recruitId,
      chestNo: chestNo,
      startTime: startTime,
      endTime: endTime,
      groupNo: "",
      duration: distance,
      isActive: "1",
      createdBy: "",
      createdDate: new Date().toISOString(), // Use current date and time
      signature: fullSignatureUrl,
    };
    addShotPut(data, storedToken, navigate, menuId);
  };

  return (
    <>
      <div className="container-fluid p-3">
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-header py-3">
                <h5 className="fw-bold">Shot Put Measurement</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-lg-8">
                    <div className="row">
                      <div className="col-lg-4">
                        <label htmlFor="height">Chest Number</label>
                      </div>
                      <div className="col-lg-8 mt-lg-0 mt-md-0 mt-3">
                        <input
                          name="number"
                          type="text"
                          className="form-control"
                          aria-describedby="number"
                          placeholder="Enter Chest No."
                          value={chestNo}
                          onChange={(e) => setChestNo(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-8 mt-4">
                    <div className="row">
                      <div className="col-lg-4">
                        <label htmlFor="startTime">Start Time</label>
                      </div>
                      <div className="col-lg-8 mt-lg-0 mt-md-0 mt-3">
                        <div className="form-group">
                          <input
                            name="startTime"
                            type="time"
                            className="form-control"
                            aria-describedby="startTime"
                            placeholder="Enter Start Time"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-8 mt-4">
                    <div className="row">
                      <div className="col-lg-4">
                        <label htmlFor="endTime">End Time</label>
                      </div>
                      <div className="col-lg-8 mt-lg-0 mt-md-0 mt-3">
                        <div className="form-group">
                          <input
                            name="endTime"
                            type="time"
                            className="form-control"
                            aria-describedby="endTime"
                            placeholder="Enter End Time"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-8 mt-4">
                    <div className="row">
                      <div className="col-lg-4">
                        <label htmlFor="distance">Distance</label>
                      </div>
                      <div className="col-lg-8 mt-lg-0 mt-md-0 mt-3">
                        <div className="form-group">
                          <input
                            name="distance"
                            type="text"
                            className="form-control"
                            aria-describedby="distance"
                            placeholder="Enter Distance"
                            value={distance}
                            onChange={(e) => setDistance(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-8 mt-4">
                    <div className="row">
                      <div className="col-lg-4">
                        <label htmlFor="signature">Add Signature</label>
                      </div>
                      <div className="col-lg-8 mt-lg-0 mt-md-0 mt-3">
                        <div
                          className="p-0 border border-dark"
                          style={{ width: "500px", height: "13vh" }}
                        >
                          <SignatureCanvas
                            penColor="black"
                            canvasProps={{ className: "sigCanvas" }}
                            ref={(data) => setSign(data)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-footer py-3">
                <div className="col-lg-8">
                  <div className="row">
                    <div className="row">
                      <div className="col-lg-4"></div>
                      <div className="col-lg-8">
                        <button
                          className="btn btn-primary"
                          type="submit"
                          onClick={AddShotPut}
                        >
                          Submit
                        </button>
                        <button className="btn btn-secondary mx-4">
                          Cancel
                        </button>
                      </div>
                    </div>
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

export default ShotputForm;
