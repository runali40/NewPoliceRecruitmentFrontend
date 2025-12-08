import React, { useState, useEffect } from "react";
import { Table, Button } from "react-bootstrap";
import { Add, Delete, Edit, } from "@material-ui/icons";
import { useNavigate } from "react-router-dom";
import { Pagination } from "../../../Components/Utils/Pagination";
import { deleteDutyMaster, getAllDutyMasterData } from "../../../Components/Api/DutyMasterApi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DutyMaster = () => {
  const navigate = useNavigate();
  const [allDutyMaster, setAllDutyMaster] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Initial value
  const [selectedItemsPerPage, setSelectedItemsPerPage] = useState(10);
  const [searchData, setSearchData] = useState("");
  const [active, setActive] = useState(true);

  const headerCellStyle = {
    backgroundColor: "rgb(27, 90, 144)",
    color: "#fff",
  };

  useEffect(() => {
    getAllData();
  }, [currentPage, itemsPerPage, active]); // Fetch data when currentPage or itemsPerPage changes

  const getAllData = () => {
    getAllDutyMasterData(active) // Call API function
      .then((data) => {
        const sortedData = data.sort((a, b) => {
          if (a.d_dutyname < b.d_dutyname) {
            return -1;
          }
          if (a.d_dutyname > b.d_dutyname) {
            return 1;
          }
          return 0;
        });

        // Set the sorted data
        setAllDutyMaster(sortedData);
        // const dutyArray = data.map((item) => item.d_dutyname);

        // // Store each duty name with a dynamically generated key in localStorage
        // for (let i = 0; i < dutyArray.length; i++) {
        //   localStorage.setItem(`Duty${i}`, dutyArray[i]);
        // }

        // // Retrieve and log each duty name from localStorage
        // for (let i = 0; i < dutyArray.length; i++) {
        //   const duty = localStorage.getItem(`Duty${i}`);
        //   console.log(`Duty${i}: ${duty}`);
        // }
      })
      .catch((error) => {
        console.log(error);
        // Handle errors as needed, e.g., display an error message
      });
  };

  const handleChange = (e) => {
    setSelectedItemsPerPage(parseInt(e.target.value));
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  const GetDutyMaster = (dId) => {
    navigate('/dutyMasterForm', { state: { dId } });
  };

  const handleDelete = (dId) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this duty?");
    if (!isConfirmed) return;
    deleteDutyMaster(dId)
      .then((response) => {
        // console.log("Duty deleted successfully!", response);
        // toast.success("Duty deleted successfully!")
        getAllData(); // Refresh data after deletion
        // toast.success("Duty deleted successfully!")
      })
      .catch((error) => {
        console.log(error);
        // Handle delete error
      });
  };

  const handleSearch = (e) => {
    const searchDataValue = e.target.value.toLowerCase();
    setSearchData(searchDataValue);

    if (searchDataValue.trim() === "") {
      getAllData();
    } else {
      const filteredData = allDutyMaster.filter(
        (duty) =>
          duty.d_dutyname.toLowerCase().includes(searchDataValue) ||
          duty.d_description.toLowerCase().includes(searchDataValue)
      );
      setAllDutyMaster(filteredData);
      setCurrentPage(1);
    }
  };


  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = allDutyMaster.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <>
      <div className="container-fluid">
        <div
          className="card m-3"
          style={{ boxShadow: "0px 1px 5px rgba(0, 0, 0, 0.1)" }}
        >
          <div className="row">
            <div className="col-lg-12">
              <div className="card-header">
                <div className="row align-items-center">
                  <div className="col">
                    <h4 className="card-title fw-bold">Duty Master</h4>
                  </div>
                  <div className="col-auto d-flex flex-wrap">
                    <div className="form-check form-switch mt-2 pt-1">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="flexSwitchCheckDefault"
                        checked={active}
                        onChange={() => setActive(!active)}
                      />
                    </div>
                    <div className="btn btn-add" title="Add New">
                      <button
                        className="btn btn-md text-light"
                        type="button"
                        style={{ backgroundColor: "#1B5A90" }}
                        onClick={() => navigate("/dutyMasterForm")}
                      >
                        <Add />
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
                        Duty Name
                      </th>
                      <th scope="col" style={headerCellStyle}>
                        Description
                      </th>
                      <th scope="col" style={headerCellStyle}>
                        No of Users
                      </th>
                      {/* <th scope="col" style={headerCellStyle}>
                        Module
                      </th> */}
                      <th scope="col" style={headerCellStyle}>
                        Menu Name
                      </th>
                      <th scope="col" style={headerCellStyle}>
                        Status
                      </th>
                      <th scope="col" style={{ ...headerCellStyle, paddingLeft: "18px" }}>
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((data, index) => (
                      <tr key={data.d_id}>
                        {/* <td><div className="form-check">
                          <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
                        </div></td> */}
                        <td>
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </td>
                        <td>{data.d_dutyname}</td>
                        <td>{data.d_description}</td>
                        <td>{data.d_no_of_user}</td>
                        {/* <td>{data.d_module}</td> */}
                        <td>{data.m_menuname}</td>
                        <td>{data.d_isactive}</td>
                        <td>
                          <div className="d-flex "><Edit
                            className="text-success mr-2"
                            type="button"
                            // onClick={() => GetDutyMaster(data.d_id)}
                            style={{
                              // marginLeft: "0.5rem",
                              ...(data.d_isactive === "Inactive" && {
                                opacity: 0.5,  // Makes the icon appear faded
                                cursor: "not-allowed", // Changes cursor to indicate disabled state
                              }),
                            }}
                            onClick={data.d_isactive === "Inactive" ? null : () => GetDutyMaster(data.d_id)}

                          />
                            <Delete
                              className="text-danger"
                              type="button"
                              // style={{ marginLeft: "0.5rem" }}
                              // onClick={() => handleDelete(data.d_id)}
                              style={{
                                marginLeft: "0.5rem",
                                ...(data.d_isactive === "Inactive" && {
                                  opacity: 0.5,  // Makes the icon appear faded
                                  cursor: "not-allowed", // Changes cursor to indicate disabled state
                                }),
                              }}
                              onClick={data.d_isactive === "Inactive" ? null : () => handleDelete(data.d_id)}
                            /> </div>

                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <div className="row mt-4 mt-xl-3">
                  <div className="col-lg-4 col-md-4 col-12 ">
                    <h6 className="text-lg-start text-md-start text-center">
                      Showing {indexOfFirstItem + 1} to{" "}
                      {Math.min(indexOfLastItem, allDutyMaster.length)} of{" "}
                      {allDutyMaster.length} entries
                    </h6>
                  </div>
                  <div className="col-lg-4 col-md-4 col-12"></div>
                  <div className="col-lg-4 col-md-4 col-12 mt-3 mt-lg-0 mt-md-0">
                    <Pagination
                      currentPage={currentPage}
                      setCurrentPage={setCurrentPage}
                      allData={allDutyMaster}
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

export default DutyMaster;
