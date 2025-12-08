import React, { useState, useEffect } from "react";
import { Table, Button } from "react-bootstrap";
import { Add, Delete, Edit, } from "@material-ui/icons";
import { json, useNavigate } from "react-router-dom";
import { getAllRoleMasterData, deleteRoleMaster } from "../../../Components/Api/RoleMasterApi";
import { Pagination } from "../../../Components/Utils/Pagination";
import { apiClient } from "../../../apiClient";
import ErrorHandler from "../../../Components/ErrorHandler";
import Select from "react-select";
import Storage from "../../../Storage";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const RoleMaster = () => {
  const navigate = useNavigate();
  const [allRoleMaster, setAllRoleMaster] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Initial value
  const [selectedItemsPerPage, setSelectedItemsPerPage] = useState(10);
  const [searchData, setSearchData] = useState("");
  const [active, setActive] = useState(true);
  const [allRecruitment, setAllRecruitment] = useState([])
  const [recruitmentValue, setRecruitmentValue] = useState("")

  const headerCellStyle = {
    backgroundColor: "rgb(27, 90, 144)",
    color: "#fff",
  };

  useEffect(() => {
    getAllData();
    // GetAllRecruitment();
  }, [currentPage, itemsPerPage, active]); // Fetch data when currentPage or itemsPerPage changes

  const getAllData = () => {
    getAllRoleMasterData(active) // Call API function
      .then((data) => {
        setAllRoleMaster(data);
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

  const GetRoleMaster = (rId) => {
    navigate('/roleMasterForm', { state: { rId } });
  };

  const handleDelete = (rId) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this role?");
    if (!isConfirmed) return;
    deleteRoleMaster(rId)
      .then((response) => {
        console.log("Role deleted successfully!", response);
        getAllData(); // Refresh data after deletion
        toast.success("Role deleted successfully!")
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
      const filteredData = allRoleMaster.filter(
        (role) =>
          role.r_rolename.toLowerCase().includes(searchDataValue) ||
          role.r_description.toLowerCase().includes(searchDataValue)
      );
      setAllRoleMaster(filteredData);
      setCurrentPage(1);
    }
  };


  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = allRoleMaster.slice(indexOfFirstItem, indexOfLastItem);

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
                    <h4 className="card-title fw-bold">Role Master</h4>
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
                    {/* <div className="me-2 my-auto">
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
                    </div> */}
                    <div className="btn btn-add" title="Add New">
                      <button
                        className="btn btn-md text-light"
                        type="button"
                        style={{ backgroundColor: "#1B5A90" }}
                        onClick={() => navigate("/roleMasterForm")}
                      >
                        <Add />
                      </button>
                    </div>

                  </div>
                </div>
              </div>
              <div className="card-body pt-3">
                <div className="row">
                  <div className="col-lg-3 col-md-3 d-flex justify-content-center justify-content-lg-start">
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
                        Role Name
                      </th>
                      <th scope="col" style={headerCellStyle}>
                        Description
                      </th>
                      {/* <th scope="col" style={headerCellStyle}>
                        No of Users
                      </th> */}
                      {/* <th scope="col" style={headerCellStyle}>
                        Module
                      </th> */}
                      <th scope="col" style={headerCellStyle}>
                        Menu Name
                      </th>
                      <th scope="col" style={headerCellStyle}>
                        Status
                      </th>
                      <th scope="col" style={headerCellStyle}>
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((data, index) => (
                      <tr key={data.r_id}>
                        <td>
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </td>
                        <td>{data.r_rolename}</td>
                        <td>{data.r_description}</td>
                        {/* <td>{data.r_no_of_user}</td> */}
                        {/* <td>{data.r_module}</td> */}
                        <td>{data.m_menuname}</td>
                        <td>{data.r_isactive}</td>
                        <td>
                          <div className="d-flex justify-content-between"><Edit
                            className="text-success mr-2"
                            type="button"
                            // onClick={() => GetRoleMaster(data.r_id)}
                            style={{

                              ...(data.r_isactive === "Inactive" && {
                                opacity: 0.5,  // Makes the icon appear faded
                                cursor: "not-allowed", // Changes cursor to indicate disabled state
                              }),
                            }}
                            onClick={data.r_isactive === "Inactive" ? null : () => GetRoleMaster(data.r_id)}
                          />
                            <Delete
                              className="text-danger"
                              type="button"

                              // onClick={() => handleDelete(data.r_id)}
                              style={{
                                marginLeft: "0.5rem",
                                ...(data.r_isactive === "Inactive" && {
                                  opacity: 0.5,  // Makes the icon appear faded
                                  cursor: "not-allowed", // Changes cursor to indicate disabled state
                                }),
                              }}
                              onClick={data.r_isactive === "Inactive" ? null : () => handleDelete(data.r_id)}
                            /> </div>

                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <div className="row mt-4 mt-xl-3">
                  <div className="col-lg-4 col-12 ">
                    <h6 className="text-lg-start text-center">
                      Showing {indexOfFirstItem + 1} to{" "}
                      {Math.min(indexOfLastItem, allRoleMaster.length)} of{" "}
                      {allRoleMaster.length} entries
                    </h6>
                  </div>
                  <div className="col-lg-4 col-12"></div>
                  <div className="col-lg-4 col-12 mt-3 mt-lg-0">
                    <Pagination
                      currentPage={currentPage}
                      setCurrentPage={setCurrentPage}
                      allData={allRoleMaster}
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

export default RoleMaster;
