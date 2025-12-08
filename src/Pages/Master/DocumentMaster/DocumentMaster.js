import React, { useState, useEffect } from "react";
import { Table, Button } from "react-bootstrap";
import { Add, Delete, Edit } from "@material-ui/icons";
import { useNavigate } from "react-router-dom";
import { Pagination } from "../../../Components/Utils/Pagination";
import Select from 'react-select'
import { deleteDutyMaster, getAllDutyMasterData } from "../../../Components/Api/DutyMasterApi";
import { deleteCategoryMaster, getAllCategoryMasterData } from "../../../Components/Api/CategoryMasterApi";
import ErrorHandler from "../../../Components/ErrorHandler";
import { v4 as uuidv4 } from 'uuid';
import Cookies from 'js-cookie';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { apiClient } from "../../../apiClient";


const CategoryMaster = () => {
  const navigate = useNavigate();
  const [allCategoryMaster, setAllCategoryMaster] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Initial value
  const [selectedItemsPerPage, setSelectedItemsPerPage] = useState(10);
  const [searchData, setSearchData] = useState("");
  const [active, setActive] = useState(true);
  const [recruitmentValue, setRecruitmentValue] = useState("");
  const [allRecruitment, setAllRecruitment] = useState([]);
  const RoleName = localStorage.getItem("RoleName");
  const recruitId = localStorage.getItem("recruitId");
  const headerCellStyle = {
    backgroundColor: "rgb(27, 90, 144)",
    color: "#fff",
  };

  // useEffect(() => {
  //   getAllData();
  // }, [currentPage, itemsPerPage, active]); // Fetch data when currentPage or itemsPerPage changes

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
          await getAllData()
        }


      } catch (error) {
        console.error("Error fetching data:", error);
      }

    };

    fetchData();
  }, [active]);


  const getAllData = () => {
    getAllCategoryMasterData(active) // Call API function
      .then((data) => {
        const sortedData = data.sort((a, b) => {
          if (a.CategoryName < b.CategoryName) {
            return -1;
          }
          if (a.CategoryName > b.CategoryName) {
            return 1;
          }
          return 0;
        });

        // Set the sorted data
        setAllCategoryMaster(sortedData);
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
    const recruitIdUpperCase = recruitId ? recruitId.toUpperCase() : null;
    apiClient({
      method: "get",
      url: (`CategoryDocPrivilege/GetAll`).toString(),
      params: {
        UserId: UserId,
        RecruitId: recruitIdUpperCase,
        // recConfId:recruitIdUpperCase,
        Isactive: active ? "1" : "2"
      },
    })
      .then((response) => {
        console.log("response all category masters", response.data.data);
        const token1 = response.data.outcome.tokens;
        Cookies.set("UserCredential", token1, { expires: 7 });
        const temp = response.data.data;
        setAllCategoryMaster(temp)
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
  const handleChange = (e) => {
    setSelectedItemsPerPage(parseInt(e.target.value));
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  const GetCategoryMaster = (dId, catId) => {
    navigate('/documentMasterForm', { state: { dId, catId } });
  };

  const handleDelete = (dId) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this document?");
    if (!isConfirmed) return;
    deleteCategoryMaster(dId)
      .then((response) => {
        console.log("Document deleted successfully!", response);
        getAllData(); // Refresh data after deletion
        // toast.success("Document deleted successfully!")
      })
      .catch((error) => {
        console.log(error);
        // Handle delete error
      });
  };
  const AddNavigate = () => {
    const recruitId = localStorage.getItem("recruitId");
    
    if (recruitId === "null" || RoleName === "Superadmin") {
      if (!recruitmentValue) {
        toast.warning("Please select recruitment!");
        return; // Stop further execution if recruitment is not selected
      }
    }
  
    // Navigate only if the above condition is not met
    navigate("/documentMasterForm");
  };
  const handleSearch = (e) => {
    const searchDataValue = e.target.value.toLowerCase();
    setSearchData(searchDataValue);

    if (searchDataValue.trim() === "") {
      getAllData();
    } else {
      const filteredData = allCategoryMaster.filter(
        (category) =>
          category.CategoryName.toLowerCase().includes(searchDataValue)
      );
      setAllCategoryMaster(filteredData);
      setCurrentPage(1);
    }
  };


  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = allCategoryMaster.slice(indexOfFirstItem, indexOfLastItem);

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
                    <h4 className="card-title fw-bold">Document Master</h4>
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
                    {
                      RoleName === "Superadmin" && (
                        <div className="me-2 my-auto">
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
                      )
                    }
                    <div className="btn btn-add" title="Add New">
                      <button
                        className="btn btn-md text-light"
                        type="button"
                        style={{ backgroundColor: "#1B5A90" }}
                        onClick={AddNavigate}

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
                    <h6 className="mt-2 ">Show</h6>&nbsp;&nbsp;
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
                        Category Name
                      </th>
                      <th scope="col" style={headerCellStyle}>
                        Documents Name
                      </th>
                      <th scope="col" style={headerCellStyle}>
                        Status
                      </th>
                      <th scope="col" className="text-center" style={headerCellStyle}>
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((data, index) => (
                      <tr key={index}>
                        {/* <td><div className="form-check">
                          <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
                        </div></td> */}
                        <td>
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </td>
                        <td>{data.SubCategoryName}</td>
                        <td>{data.m_menuname}</td>
                        <td>{data.Isactive}</td>
                        <td className="text-center">
                          <div className="d-flex justify-content-center align-items-center gap-2">
                            <Edit
                            className="text-success mr-2"
                            type="button"
                            // onClick={() => GetCategoryMaster(data.Id, data.CategoryId)}
                            style={{
                              // marginLeft: "0.5rem",
                              ...(data.Isactive === "Inactive" && {
                                opacity: 0.5,  // Makes the icon appear faded
                                cursor: "not-allowed", // Changes cursor to indicate disabled state
                              }),
                            }}
                            onClick={data.Isactive === "Inactive" ? null : () => GetCategoryMaster(data.Id, data.CategoryId)}
                          />
                            <Delete
                              className="text-danger"
                              type="button"
                              // style={{ marginLeft: "0.5rem" }}
                              // onClick={() => handleDelete(data.Id)}
                              style={{
                                marginLeft: "0.5rem",
                                ...(data.Isactive === "Inactive" && {
                                  opacity: 0.5,  // Makes the icon appear faded
                                  cursor: "not-allowed", // Changes cursor to indicate disabled state
                                }),
                              }}
                              onClick={data.Isactive === "Inactive" ? null : () => handleDelete(data.Id)}
                            /> </div>

                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <div className="row mt-4 mt-xl-3">
                  <div className="col-lg-4 col-md-4 col-12 ">
                    <h6 className="text-lg-start text-center">
                      Showing {indexOfFirstItem + 1} to{" "}
                      {Math.min(indexOfLastItem, allCategoryMaster.length)} of{" "}
                      {allCategoryMaster.length} entries
                    </h6>
                  </div>
                  <div className="col-lg-4 col-md-4 col-12"></div>
                  <div className="col-lg-4 col-md-4 col-12 mt-3 mt-lg-0 mt-md-0">
                    <Pagination
                      currentPage={currentPage}
                      setCurrentPage={setCurrentPage}
                      allData={allCategoryMaster}
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

export default CategoryMaster;
