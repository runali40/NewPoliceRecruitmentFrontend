import React, { useState, useEffect, useRef } from 'react';
import AllEventTable from './AllEventTable';
import { Button } from 'react-bootstrap';
import { getAllGroup } from '../../Components/Api/EventApi';
import Storage from '../../Storage';
import Cookies from "js-cookie";
import ErrorHandler from '../../Components/ErrorHandler';
import {apiClient }from '../../apiClient';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AllEvent = () => {
    const [allGroup, setAllGroup] = useState([]);
    const [groupValue, setGroupValue] = useState("");
    const [allRunning, setAllRunning] = useState([]);

    // Initialize sigRefs with useRef
    const sigRefs = useRef([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const groupValue1 = await getAllGroup();
                setAllGroup(groupValue1);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (groupValue) {
            getAllEvent();
        }
    }, [groupValue]);

    const getAllEvent = async () => {
        const recruitId = localStorage.getItem("recruitId");
        const UserId = localStorage.getItem("userId");
        const params = {
            UserId: UserId,
            RecruitId: recruitId,
            groupid: groupValue,
        };
        try {
            const response = await apiClient({
                method: "get",
                params: params,
                url: `RecruitmentEvent/GetAllEventSignature`.toString(),
            });
            console.log(response.data.data);
            setAllRunning(response.data.data);
            const token = response.data.outcome.tokens;
            
            Cookies.set("UserCredential", token, { expires: 7 });
            // Initialize sigRefs after fetching data
            sigRefs.current = response.data.data.map(() => React.createRef());
        } catch (error) {
            if (error.response && error.response.data && error.response.data.outcome) {
                const token1 = error.response.data.outcome.tokens;
                Cookies.set("UserCredential", token1, { expires: 7 });
            }
            console.error("Error fetching all chest numbers:", error);
            const errors = ErrorHandler(error);
            toast.error(errors);
            throw error;
        }
    };

    const addAllSignature = async () => {
        const recruitId = localStorage.getItem("recruitId");
        const UserId = localStorage.getItem("userId");
        const signatureData = allRunning.map((item, index) => ({
            ChestNo: item.chestno,
            Signature: sigRefs.current[index]?.current?.getTrimmedCanvas().toDataURL("image/png") || null,
        }));

        const params = {
            UserId: UserId,
            recConfId: recruitId,
            runningData: signatureData,
            // chestNo: "1010",
            // signature: "data:image/png;base64,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"
        };

        try {
            const response = await apiClient({
                method: "post",
                data: params,
                url: `RecruitmentEvent/InsertSignatures`.toString(),
            });
            console.log(response.data.data);

            const token = response.data.outcome.tokens;
            
            Cookies.set("UserCredential", token, { expires: 7 });
        } catch (error) {
            if (error.response && error.response.data && error.response.data.outcome) {
                const token1 = error.response.data.outcome.tokens;
                Cookies.set("UserCredential", token1, { expires: 7 });
            }
            console.error("Error submitting signatures:", error);
            const errors = ErrorHandler(error);
            toast.error(errors);
            throw error;
        }
    };

    const handleGroupChange = (e) => {
        const selectedGroup = e.target.value;
        setGroupValue(selectedGroup);
        console.log(selectedGroup);
        console.log("groupValue", groupValue);
    };

    return (
        <>
            <div className="container-fluid">
                <div className="card m-3" style={{ boxShadow: "0px 1px 5px rgba(0, 0, 0, 0.1)" }}>
                    <div className='card-header'>
                        <h4 className="card-title fw-bold py-2">Add All Event</h4>
                    </div>
                    <div className='card-body'>
                        <div className="row">
                            <div className="col-lg-3">
                                <label htmlFor="gender" className="fw-bold">Group</label>
                            </div>
                            <div className="col-lg-3">
                                <select
                                    className="form-select"
                                    name="group"
                                    placeholder="Enter Gender"
                                    value={groupValue}
                                    onChange={handleGroupChange}
                                >
                                    <option value="" disabled>
                                        Select Group
                                    </option>
                                    {allGroup.map((data) => (
                                        <option key={data.groupid} value={data.groupid}>
                                            {data.groupname}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <AllEventTable allRunning={allRunning} sigRefs={sigRefs} />
                    </div>
                    <div className='card-footer'>
                        <Button variant="primary" onClick={addAllSignature}>
                            Submit
                        </Button>
                    </div>
                </div>
            </div>
         
        </>
    );
};

export default AllEvent;
