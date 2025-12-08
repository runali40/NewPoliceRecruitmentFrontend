import React, { useState, useEffect } from 'react'
import { fetchAll100Meter, fetchAllShotput, GetCategory } from '../../Components/Api/DailyReportApi'
import { Table, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import Select from 'react-select'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Pagination } from '../../Components/Utils/Pagination';
import { getAllGroup } from '../../Components/Api/EventApi';

const ShotputReport = () => {
    const navigate = useNavigate();
    const eventId = localStorage.getItem("menuId")
    console.log(eventId, "event id")
    const parentId = localStorage.getItem("parentId")
    console.log(parentId, "parent id")
    const [shotputReport, setShotputReport] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10); // Initial value
    const [selectedItemsPerPage, setSelectedItemsPerPage] = useState(10);
    const [searchData, setSearchData] = useState("");
    const [allGroup, setAllGroup] = useState([])
    const [group, setGroup] = useState("")
    const [groupId, setGroupId] = useState("")
  const [allCategory, setAllCategory] = useState([])
  const [category, setCategory] = useState("")

    const headerCellStyle = {
        backgroundColor: "rgb(27, 90, 144)",
        color: "#fff",
    };

    useEffect(() => {
        ShotputReport();
    }, [eventId])

    useEffect(() => {
        AllCategory();
    }, [])

    const ShotputReport = async () => {
        const data = await fetchAllShotput(eventId);
        console.log(data)
        setShotputReport(data)
    }

    const AllGroup = async (categoryId) => {
        try {
            const data = await getAllGroup(categoryId);
            console.log("AllGroup Response:", data);

            const options = data.map((data) => ({
                value: data.groupid,
                label: `${data.groupname} `,
            }));
            setAllGroup(options);
        } catch (error) {
            console.log("AllGroup Error:", error);
        }
    };

    const handleGroup = async (selected) => {
        const selectedValue = selected;
        setGroup(selectedValue);
        console.log(selectedValue.value, "selected value");
        setGroupId(selectedValue.value)
        const data = await fetchAllShotput(eventId, selectedValue.value);
        console.log(data)
        setShotputReport(data)
    }

      const AllCategory = async () => {
        try {
          const data = await GetCategory();
          console.log("AllCategory Response:", data);
    
          const options = data.map((data) => ({
            value: data.id,
            label: `${data.CategoryName} `,
          }));
          setAllCategory(options);
        } catch (error) {
          console.log("AllCategory Error:", error);
        }
      };
    
      const handleCategory = async (selected) => {
        const selectedValue = selected;
        setCategory(selectedValue);
        console.log(selectedValue.value, "selected value");
        // setGroupId(selectedValue.value)
        await AllGroup(selectedValue.value)
      }

    const handleSearch = (e) => {
        const searchDataValue = e.target.value.toLowerCase();
        setSearchData(searchDataValue);

        if (searchDataValue.trim() === "") {
            ShotputReport();
        } else {
            const filteredData = shotputReport.filter(
                (report) =>
                    report.ChestNo.toLowerCase().includes(searchDataValue) ||
                    report.CandidateName.toLowerCase().includes(searchDataValue)
            );
            setShotputReport(filteredData);
            setCurrentPage(1);
        }
    };

    const handleChange = (e) => {
        setSelectedItemsPerPage(parseInt(e.target.value));
        setItemsPerPage(parseInt(e.target.value));
        setCurrentPage(1);
    };

    const openPrintWindow = () => {
        let tableHTML = `
      <html>
      <head>
        <title>Report</title>
        <style>
          table {
            width: 100%;
            border-collapse: collapse;
            font-family: Arial;
          }
          th{
            padding: 8px;
            border: 1px solid #000;
            text-align: left;
            font-size: 14px;
          }
          th {
            background: #f2f2f2;
          }
          .signature-box {
            height: 60px;
            border: 1px solid #000;
          }
          .print-btn {
            margin: 15px 0;
            padding: 6px 12px;
            border: 1px solid #000;
            cursor: pointer;
            background: #ddd;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
  
        <button class="btn btn-success print-btn" onclick="startPrinting()">Print</button>
  
        <script>
          function startPrinting() {
            const btn = document.querySelector('.print-btn');
            btn.style.display = 'none';      
            setTimeout(() => {
              window.print();
              btn.style.display = 'block';   
            }, 200);
          }
        </script>
  
        <h2>Commissioner of Police Thane City</h2>
    <h3>Shot put Report</h3>
        <table>
          <thead>
            <tr>
              <th>Sr No</th>
              <th>Candidate Name</th>
              <th>Chest Number</th>
              <th>Distance 1</th>
              <th>Distance 2</th>
              <th>Distance 3</th>      
              <th>Score</th>
              <th>Signature</th>
                <th>Group Leader Sign</th>
            </tr>
          </thead>
          <tbody>
    `;

        shotputReport.forEach((row, index) => {
            tableHTML += `
        <tr>
          <td>${index + 1}</td>
          <td>${row.CandidateName || ""}</td>
          <td>${row.ChestNo || ""}</td>
         <td>${row.distance1 || ""}</td>
         <td>${row.distance2 || ""}</td>
         <td>${row.distance3 || ""}</td>
          <td>${row.score || ""}</td>
          <td class="signature-box"></td>
             ${index === 0 ? `<td class="signature-box" rowspan="${shotputReport.length}"></td>` : ""}
        </tr>
      `;
        });

        tableHTML += `
          </tbody>
        </table>
      </body>
      </html>
    `;

        const printWindow = window.open("", "_blank", "width=900,height=700");
        printWindow.document.open();
        printWindow.document.write(tableHTML);
        printWindow.document.close();
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = shotputReport.slice(indexOfFirstItem, indexOfLastItem);
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
                    <h4 className="card-title fw-bold">100 Meter Running Report</h4>
                  </div>

                </div> */}
                                <div className="row align-items-center">
                                    <div className="col-lg-8 col-md-8 col-7">
                                        <h4 className="card-title fw-bold py-2">Shot put Report</h4>
                                    </div>
                                    <div className="col-lg-4 col-md-4 col-5 d-flex justify-content-end print-section">
                                        <button className="btn me-2" style={headerCellStyle} /* onClick={() => window.print()} */ onClick={openPrintWindow} >Print</button>
                                        <button className="btn" style={headerCellStyle} onClick={() => navigate(-1)}>Back</button>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body pt-3">
                                <div className="row">
                                    <div className="col-lg-3 col-md-3 col-12 d-flex align-items-center gap-2">
                                        <h6 className="mb-0">Show</h6>
                                        <select
                                            style={{ height: "35px" }}
                                            className="form-select w-auto"
                                            value={selectedItemsPerPage}
                                            onChange={handleChange}
                                        >
                                            <option value="10">10</option>
                                            <option value="50">50</option>
                                            <option value="100">100</option>
                                        </select>
                                        <h6 className="mb-0">entries</h6>
                                    </div>

                                    <div className="col-lg-3 col-md-3 col-12 mt-3 mt-md-0">
                                        <Select
                                            value={category}
                                            onChange={handleCategory}
                                            options={allCategory}
                                            placeholder="Select Category"
                                            styles={{
                                                control: (provided) => ({
                                                    ...provided,
                                                    width: "100%",     // FULL WIDTH
                                                    minHeight: "35px",
                                                }),
                                            }}
                                        />
                                    </div>

                                    <div className="col-lg-3 col-md-3 col-12 mt-3 mt-md-0">
                                        <Select
                                            value={group}
                                            onChange={handleGroup}
                                            options={allGroup}
                                            placeholder="Select Group"
                                            styles={{
                                                control: (provided) => ({
                                                    ...provided,
                                                    width: "100%",     // FULL WIDTH
                                                    minHeight: "35px",
                                                }),
                                            }}
                                        />
                                    </div>

                                    <div className="col-lg-3 col-md-3 col-12 mt-3 mt-md-0">
                                        <input
                                            className="form-control"
                                            placeholder="Search here"
                                            value={searchData}
                                            onChange={handleSearch}
                                            style={{ height: "35px" }} // Same height
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
                                                Candidate Name
                                            </th>
                                            <th scope="col" style={headerCellStyle}>
                                                Chest No
                                            </th>
                                            <th scope="col" style={headerCellStyle}>
                                                Distance 1
                                            </th>
                                            <th scope="col" style={headerCellStyle}>
                                                Distance 2
                                            </th>
                                            <th scope="col" style={headerCellStyle}>
                                                Distance 3
                                            </th>
                                            <th scope="col" style={headerCellStyle}>
                                                Score
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentItems.map((data, index) => (
                                            <tr key={data.CandidateId}>
                                                <td>
                                                    {(currentPage - 1) * itemsPerPage + index + 1}
                                                </td>
                                                <td>{data.CandidateName}</td>
                                                <td>{data.ChestNo}</td>
                                                <td>{data.distance1}</td>
                                                <td>{data.distance2}</td>
                                                <td>{data.distance3}</td>
                                                <td>{data.score}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                                <div className="row mt-4 mt-xl-3">
                                    <div className="col-lg-4 col-md-4 col-12 ">
                                        <h6 className="text-lg-start text-md-start text-center">
                                            Showing {indexOfFirstItem + 1} to{" "}
                                            {Math.min(indexOfLastItem, shotputReport.length)} of{" "}
                                            {shotputReport.length} entries
                                        </h6>
                                    </div>
                                    <div className="col-lg-4 col-md-4 col-12"></div>
                                    <div className="col-lg-4 col-md-4 col-12 mt-3 mt-lg-0 mt-md-0">
                                        <Pagination
                                            currentPage={currentPage}
                                            setCurrentPage={setCurrentPage}
                                            allData={shotputReport}
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
    )
}

export default ShotputReport