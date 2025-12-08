import React, { useState, useEffect } from "react";
import { Table, Modal, Button, Form, Row, Col } from "react-bootstrap";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";
import Select from 'react-select';
import jsPDF from "jspdf";
import "jspdf-autotable";
import { fetchDailyReports } from "../../Components/Api/DailyReportApi";
import { Pagination } from "../../Components/Utils/Pagination";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { apiClient } from "../../apiClient";
import ErrorHandler from "../../Components/ErrorHandler";
import Cookies from "js-cookie";
import { DateRange } from "react-date-range";
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { enUS } from "date-fns/locale";

const DailyReport = () => {
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedItemsPerPage, setSelectedItemsPerPage] = useState(10);
  const [allReport, setAllReport] = useState([]);
  const [doc, setDoc] = useState("");
  const [heightChest, setHeightChest] = useState("");
  const [allStatus, setAllStatus] = useState("")
  const [headerName, setHeaderName] = useState("")
  const [recruitmentValue, setRecruitmentValue] = useState("");
  const [allRecruitment, setAllRecruitment] = useState([]);
  const [fromDate, setFromDate] = useState()
  const [toDate, setToDate] = useState()

  const RoleName = localStorage.getItem("RoleName");
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [selectDate, setSelectDate] = useState(() => formatDate(new Date()));
  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const [showPicker, setShowPicker] = useState(false);
  const headerCellStyle = {
    // backgroundColor: "rgb(27, 90, 144)",
    color: "#fff",
  };

  const handleSelect = (item) => {
    const newRange = [item.selection];
    setRange(newRange);

    // Helper function to format date properly
    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    // 👉 Print selected dates
    console.log("Start Date:", newRange[0].startDate);
    console.log("End Date:", newRange[0].endDate);

    const formattedStart = formatDate(newRange[0].startDate);
    const formattedEnd = formatDate(newRange[0].endDate);

    console.log(formattedStart); // "2025-12-02" ✓
    console.log(formattedEnd);   // "2025-12-30" ✓
    setSelectDate(formattedStart)
    setFromDate(formattedStart)
    setToDate(formattedEnd)
    fetchData(doc, heightChest, allStatus, formattedStart, formattedStart, formattedEnd);
    // 👉 Auto close calendar when both dates are selected
    if (newRange[0].startDate && newRange[0].endDate) {
      setShowPicker(false);
    }
  };

  const handleChange = (e) => {
    setSelectedItemsPerPage(parseInt(e.target.value));
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  const handleDateChange = (event) => {
    const newDate = event.target.value;
    const adjustedDate = new Date(newDate);
    const formattedDate = adjustedDate.toISOString().split("T")[0]; // Ensure UTC format
    setSelectDate(formattedDate);
    fetchData(doc, heightChest, allStatus, formattedDate);
  };

  useEffect(() => {
    console.log(selectDate, "Updated selectDate");
  }, [selectDate]);
  useEffect(() => {
    // fetchData(doc, heightChest, allStatus, selectDate);
    if (RoleName === "Superadmin") {
      GetAllRecruitment();
    } else {
      console.log("Not Superadmin, skipping GetAllRecruitment call");
    }
    handleAllData();
  }, []);

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
      url: `Recruitment/GetAll`.toString(),
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
        if (
          error.response &&
          error.response.data &&
          error.response.data.outcome
        ) {
          const token1 = error.response.data.outcome.tokens;
          Cookies.set("UserCredential", token1, { expires: 7 });
        }
        console.log(error);
        const errors = ErrorHandler(error);
        toast.error(errors);
      });
  };

  const fetchData = async (docStatus, heightChestStatus, allStatus, selectDate, fromDate, toDate) => {
    try {
      const recruitId = localStorage.getItem("recruitId");
      const UserId = localStorage.getItem("userId");
      await fetchDailyReports(
        {
          UserId: UserId,
          RecruitId: recruitId,
          SelectedDate: selectDate,
          FromDate: fromDate,
          ToDate: toDate,
          documentdata: docStatus, // Pass the updated status directly
          heichestdata: heightChestStatus, // Pass the updated status directly
          All: allStatus
        },
        setAllReport
      );
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleAllData = () => {
    const newDocStatus = null;
    const newHeightChestStatus = null;
    const newAllStatus = "All";
    setDoc(newDocStatus);
    setHeightChest(newHeightChestStatus);
    setAllStatus(newAllStatus);
    setHeaderName("Candidates who have arrived today");
    fetchData(newDocStatus, newHeightChestStatus, newAllStatus, selectDate, fromDate, toDate);
  };

  const handlePassedDoc = () => {
    const newDocStatus = "Pass";
    const newHeightChestStatus = null;
    const newAllStatus = null;
    setDoc(newDocStatus);
    setHeightChest(newHeightChestStatus);
    setAllStatus(newAllStatus);
    setHeaderName("Candidates who have passed document verification");
    fetchData(newDocStatus, newHeightChestStatus, newAllStatus, selectDate, fromDate, toDate);
  };

  const handleFailedDoc = () => {
    const newDocStatus = "Fail";
    const newHeightChestStatus = null;
    const newAllStatus = null;
    setDoc(newDocStatus);
    setHeightChest(newHeightChestStatus);
    setAllStatus(newAllStatus);
    setHeaderName("Candidates who have failed document verification");
    fetchData(newDocStatus, newHeightChestStatus, newAllStatus, selectDate, fromDate, toDate);
  };

  const handlePassedHeightChest = () => {
    const newDocStatus = null;
    const newHeightChestStatus = "Pass";
    const newAllStatus = null;
    setDoc(newDocStatus);
    setHeightChest(newHeightChestStatus);
    setAllStatus(newAllStatus);
    setHeaderName("Candidates who have passed height and chest measurement");
    fetchData(newDocStatus, newHeightChestStatus, newAllStatus, selectDate, fromDate, toDate);
  };

  const handleFailedHeightChest = () => {
    const newDocStatus = null;
    const newHeightChestStatus = "Fail";
    const newAllStatus = null;
    setDoc(newDocStatus);
    setHeightChest(newHeightChestStatus);
    setAllStatus(newAllStatus);
    setHeaderName("Candidates who have failed height and chest measurement");
    fetchData(newDocStatus, newHeightChestStatus, newAllStatus, selectDate, fromDate, toDate);
  };

  const handleRecruitmentChange = async (selected, initialCategoryRows) => {
    try {
      const selectedValue = selected;
      setRecruitmentValue(selectedValue);
      console.log(selectedValue.value, "selected value");

      // Store recruitment ID in localStorage
      localStorage.setItem("recruitId", selectedValue.value);
    } catch (error) {
      console.error("Error fetching data:", error);
      // Handle errors (e.g., with a message to the user)
    }
  };


  // const handleSearch = (e) => {
  //   const searchDataValue = e.target.value.toLowerCase();
  //   setSearchData(searchDataValue);

  //   if (searchDataValue.trim() === "") {
  //     // If search input is empty, fetch all data
  //     // getAllData();
  //   } else {
  //     // Filter data based on search input value
  //     const filteredData = allReport.filter((report) => {
  //       const applicationNo = report.ApplicationNo ? report.ApplicationNo.toString().toLowerCase() : '';
  //       const FirstName_English = report.FirstName_English ? report.FirstName_English.toString().toLowerCase() : '';
  //       const Surname_English = report.FirstName_English ? report.Surname_English.toString().toLowerCase() : '';

  //       return (
  //         applicationNo.includes(searchDataValue.toLowerCase()) ||
  //         FirstName_English.includes(searchDataValue.toLowerCase()) ||
  //         Surname_English.includes(searchDataValue.toLowerCase())
  //       );
  //     });

  //     setAllReport(filteredData);
  //     setCurrentPage(1);
  //   }
  // };
  const handleSearch = (e) => {
    const searchDataValue = e.target.value; // Keep raw input value
    setSearchData(searchDataValue);

    if (searchDataValue.trim() === "") {
      // Reset to original dataset when search is cleared
      handleAllData();
      setCurrentPage(1);
    } else {
      // Convert search input to lowercase for case-insensitive search
      const lowerCaseSearch = searchDataValue.toLowerCase();

      // Filter data based on search input
      const filteredData = allReport.filter((report) => {
        const fullName = report.FullNameEnglish ? report.FullNameEnglish.toString().toLowerCase() : "";

        return fullName.includes(lowerCaseSearch);
      });

      setAllReport(filteredData);
      setCurrentPage(1);
    }
  };



  // const handleDownloadPDF = () => {
  //   const doc = new jsPDF();

  //   // Define header and table columns
  //   const tableColumn = ["Sr.No", "Application No", "Candidate Name"];
  //   const tableRows = [];

  //   // Populate table rows
  //   currentItems.forEach((data, index) => {
  //     tableRows.push([
  //       (currentPage - 1) * itemsPerPage + index + 1,
  //       data.ApplicationNo,
  //       data.FirstName_English + " " + data.Surname_English,
  //     ]);
  //   });

  //   // Customize the table with borders
  //   doc.autoTable({
  //     head: [tableColumn],
  //     body: tableRows,
  //     startY: 30,
  //     headStyles: {
  //       fillColor: [255, 255, 255], // White background for header
  //       textColor: [0, 0, 0],       // Black text color
  //       fontStyle: 'bold',          // Bold header text
  //       lineWidth: 0.5,             // Header border thickness
  //       lineColor: [0, 0, 0],       // Black border color
  //     },
  //     bodyStyles: {
  //       lineWidth: 0.2,             // Body border thickness
  //       lineColor: [0, 0, 0],       // Black border color
  //     },
  //     styles: {
  //       font: 'helvetica',
  //       fontSize: 10,
  //       cellPadding: 3,             // Add padding inside cells
  //     },
  //     tableLineColor: [0, 0, 0],    // Table outer border color
  //     tableLineWidth: 0.2,          // Table outer border thickness
  //   });

  //   // Add a bold, centered header text
  //   const headerText = headerName;
  //   doc.setFont("helvetica", "bold"); // Set font to bold
  //   doc.setFontSize(20); // Increase font size
  //   const pageWidth = doc.internal.pageSize.getWidth();
  //   const textWidth = doc.getTextWidth(headerText);
  //   const xPosition = (pageWidth - textWidth) / 2;
  //   doc.text(headerText, xPosition, 15);

  //   // Save the PDF
  //   doc.save("daily_report.pdf");
  // };

  // const handleDownloadPDF = () => {
  //   const doc = new jsPDF();

  //   // Define header and table columns
  //   const tableColumn = ["Sr.No", "Application No", "Candidate Name"];
  //   const tableRows = [];

  //   // Use allItems instead of currentItems to include all 319 entries
  //   allReport.forEach((data, index) => {
  //     tableRows.push([
  //       index + 1,
  //       data.ApplicationNo,
  //       data.FirstName_English + " " + data.Surname_English,
  //     ]);
  //   });

  //   // Customize the table with borders
  //   doc.autoTable({
  //     head: [tableColumn],
  //     body: tableRows,
  //     startY: 30,
  //     headStyles: {
  //       fillColor: [255, 255, 255], // White background for header
  //       textColor: [0, 0, 0],       // Black text color
  //       fontStyle: 'bold',          // Bold header text
  //       lineWidth: 0.5,             // Header border thickness
  //       lineColor: [0, 0, 0],       // Black border color
  //     },
  //     bodyStyles: {
  //       lineWidth: 0.2,             // Body border thickness
  //       lineColor: [0, 0, 0],       // Black border color
  //     },
  //     styles: {
  //       font: 'helvetica',
  //       fontSize: 10,
  //       cellPadding: 3,             // Add padding inside cells
  //     },
  //     tableLineColor: [0, 0, 0],    // Table outer border color
  //     tableLineWidth: 0.2,          // Table outer border thickness
  //   });

  //   // Add a bold, centered header text
  //   const headerText = headerName;
  //   doc.setFont("helvetica", "bold"); // Set font to bold
  //   doc.setFontSize(20); // Increase font size
  //   const pageWidth = doc.internal.pageSize.getWidth();
  //   const textWidth = doc.getTextWidth(headerText);
  //   const xPosition = (pageWidth - textWidth) / 2;
  //   doc.text(headerText, xPosition, 15);

  //   // Save the PDF
  //   doc.save("daily_report.pdf");
  // };
  const handleDownloadPDF = () => {

    if (!allReport || allReport.length === 0) {
      toast.warning("Data is not available"); // Show warning message
      return; // Stop execution
    }

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header Text
    const headerText = headerName;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    const textWidth = doc.getTextWidth(headerText);
    const xPosition = (pageWidth - textWidth) / 2;

    // Function to add header at the top of each new page
    const addHeader = (doc) => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text(headerText, xPosition, 15);
      return 25; // Reserve space below header
    };

    // Define table columns and rows
    const tableColumn = ["Sr.No", "Application No", "Candidate Name"];
    const tableRows = [];

    allReport.forEach((data, index) => {
      tableRows.push([
        index + 1,
        data.ApplicationNo,
        data.FullNameEnglish,
      ]);
    });

    let startY = addHeader(doc) + 10; // Ensure table starts below the header

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: startY,
      margin: { top: 30 }, // Ensure there's space at the top of each page
      didDrawPage: (data) => {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.text(headerText, xPosition, 15);
        data.settings.startY = 30; // Ensure table starts below header
      },
      headStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        fontStyle: 'bold',
        lineWidth: 0.5,
        lineColor: [0, 0, 0],
      },
      bodyStyles: {
        lineWidth: 0.2,
        lineColor: [0, 0, 0],
      },
      styles: {
        font: 'helvetica',
        fontSize: 10,
        cellPadding: 3,
      },
      tableLineColor: [0, 0, 0],
      tableLineWidth: 0.2,
    });

    doc.save("daily_report.pdf");
    toast.success("Pdf generate successfully!")
  };



  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = allReport.slice(indexOfFirstItem, indexOfLastItem);

  // const exportToExcel = (data, filename = "DailyReport.xlsx") => {
  //   if (!data || data.length === 0) {
  //     alert("No data available to export.");
  //     return;
  //   }

  //   const worksheet = XLSX.utils.json_to_sheet(data);
  //   const workbook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
  //   XLSX.writeFile(workbook, filename);
  // };
  const exportToExcel = (data, filename = "DailyReport.xlsx") => {
    if (!data || data.length === 0) {
      alert("No data available to export.");
      return;
    }

    // Format data for Excel
    const formattedData = data.map((item, index) => ({
      "Sr. No": index + 1, // Generate Sr. No based on index
      "Application No": item.ApplicationNo, // Include Application No
      "Candidate Name": `${item.FullNameEnglish}`, // Combine FirstName and Surname
      // "Chest No.": `${item.chestno}`
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
    XLSX.writeFile(workbook, filename);
  };

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
                {/* <div className="row align-items-center">
                  <div className="col">
                    <h4 className="card-title fw-bold py-2">Daily Report</h4>
                  </div>
                </div> */}
                <div className="row">
                  <div className="col-lg-5 mt-2">
                    <h4 className="fw-bold">Daily Report</h4>
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
              </div>
              <div className="card-body pt-5">
                <div className="row justify-content-between">
                  <div className="col-lg-2 col-md-3 col-sm-6 mt-lg-0 mt-md-0 mt-3 d-flex align-items-stretch">
                    <button
                      className="btn btn-sm btn-block p-2 w-100 h-100"
                      style={{ backgroundColor: "rgb(27, 90, 144)", color: "#fff" }}
                      onClick={handleAllData}
                    >
                      Candidates who have arrived today
                    </button>
                  </div>
                  <div className="col-lg-2 col-md-3 col-sm-6 mt-lg-0 mt-md-0 mt-3 d-flex align-items-stretch">
                    <button
                      className="btn btn-sm btn-success btn-block p-2 w-100 h-100"
                      style={headerCellStyle}
                      onClick={handlePassedDoc}
                    >
                      Passed for Document Verification
                    </button>
                  </div>
                  <div className="col-lg-2 col-md-3 col-sm-6 mt-lg-0 mt-md-0 mt-3 d-flex align-items-stretch">
                    <button
                      className="btn btn-sm btn-danger btn-block p-2 w-100 h-100"
                      style={headerCellStyle}
                      onClick={handleFailedDoc}
                    >
                      Failed for Document Verification
                    </button>
                  </div>
                  <div className="col-lg-2 col-md-3 col-sm-6 mt-lg-0 mt-md-0 mt-3 d-flex align-items-stretch">
                    <button
                      className="btn btn-sm btn-success btn-block p-2 w-100 h-100"
                      style={headerCellStyle}
                      onClick={handlePassedHeightChest}
                    >
                      Passed for Height & Chest Measurement
                    </button>
                  </div>
                  <div className="col-lg-2 col-md-3 col-sm-6 mt-lg-0  mt-3 d-flex align-items-stretch">
                    <button
                      className="btn btn-sm btn-danger btn-block p-2 w-100 h-100"
                      style={headerCellStyle}
                      onClick={handleFailedHeightChest}
                    >
                      Failed for Height & Chest Measurement
                    </button>
                  </div>
                </div>

                <div
                  className="card mt-5"
                  style={{ boxShadow: "0px 1px 5px rgba(0, 0, 0, 0.1)" }}
                >
                  <div className="card-header">
                    <div className="row align-items-center">

                      {/* LEFT → Title */}
                      <div className="col">
                        <h5 className="card-title fw-bold py-2">{headerName}</h5>
                      </div>

                      {/* CENTER → Small Date Input */}
                      <div className="col-auto">
                        <div title="Date" style={{ width: "250px" }}>
                          <input
                            type="text"
                            readOnly
                            className="form-control"
                            value={`${range[0].startDate.toLocaleDateString()} - ${range[0].endDate.toLocaleDateString()}`}
                            onClick={() => setShowPicker(!showPicker)}
                          />
                        </div>

                        {showPicker && (
                          <div style={{ position: "absolute", zIndex: 9999 }}>
                            <DateRange
                              ranges={range}
                              locale={enUS}
                              onChange={handleSelect}
                              moveRangeOnFirstSelection={false}
                            />
                          </div>
                        )}
                      </div>

                      {/* RIGHT → Buttons */}
                      <div className="col-auto d-flex gap-2">
                        <Button
                          onClick={handleDownloadPDF}
                          style={{ backgroundColor: "#1B5A90" }}
                        >
                          Download
                        </Button>

                        <Button
                          onClick={() => exportToExcel(allReport, "DailyReport.xlsx")}
                          style={{ backgroundColor: "#1B5A90" }}
                        >
                          Download to Excel
                        </Button>
                      </div>

                    </div>

                  </div>
                  <div className="card-body ">
                    <h5 className="fw-bold">Count of records: {allReport.length}</h5>
                    <div className="row pt-5">
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
                          <option value="500">500</option>
                          <option value="1000">1000</option>
                        </select>
                        &nbsp;&nbsp;
                        <h6 className="mt-2">entries</h6>
                      </div>
                      <div className="col-lg-6 col-md-6 d-flex justify-content-center justify-content-lg-end"></div>
                      <div className="col-lg-3 col-md-3 d-flex justify-content-center justify-content-lg-end mt-lg-0 mt-3">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Search here"
                          value={searchData}
                          onChange={handleSearch}
                        />
                      </div>
                    </div>
                    <br />
                    <Table
                      striped
                      hover
                      responsive
                      className="border text-left "
                    >
                      <thead>
                        <tr>
                          <th scope="col">
                            <b>Sr.No</b>
                          </th>
                          <th scope="col">
                            <b>Application No</b>
                          </th>
                          <th scope="col">
                            <b>Candidate Name</b>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentItems.map((data, index) => {
                          return (
                            <tr key={data.CandidateId}>
                              <td>
                                {" "}
                                {(currentPage - 1) * itemsPerPage + index + 1}
                              </td>
                              <td>{data.ApplicationNo}</td>
                              <td
                              >
                                {data.FullNameEnglish}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>
                    <div className="row my-4 mt-xl-3">
                      <div className="col-lg-4 col-md-4 col-12 ">
                        <h6 className="text-lg-start text-md-start text-center">
                          Showing {indexOfFirstItem + 1} to{" "}
                          {Math.min(indexOfLastItem, allReport.length)} of{" "}
                          {allReport.length} entries
                        </h6>
                      </div>
                      <div className="col-lg-4 col-md-4 col-12"></div>
                      <div className="col-lg-4 col-md-4 col-12 mt-3 mt-lg-0 mt-md-0">
                        <Pagination
                          currentPage={currentPage}
                          setCurrentPage={setCurrentPage}
                          allData={allReport}
                          itemsPerPage={itemsPerPage}
                        />
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

export default DailyReport;
