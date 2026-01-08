import React, { useState, useEffect } from 'react'
import { fetchAll1600Meter, getAllCast, GetCategory, getReservationCategory } from '../../Components/Api/DailyReportApi'
import { Pagination } from '../../Components/Utils/Pagination';
import { Table, Button } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { getAllGroup } from '../../Components/Api/EventApi';
import { ArrowBack, Refresh } from '@material-ui/icons';
import jsPDF from "jspdf";
import "jspdf-autotable";

const All1600MeterReport = () => {
  const navigate = useNavigate();
  const [all1600MeterReport, setAll1600MeterReport] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Initial value
  const [selectedItemsPerPage, setSelectedItemsPerPage] = useState(10);
  const [searchData, setSearchData] = useState("");
  const [allGroup, setAllGroup] = useState([])
  const [group, setGroup] = useState("")
  const [groupId, setGroupId] = useState("")
  const [groupLeaderName, setGroupLeaderName] = useState("")
  const [allCategory, setAllCategory] = useState([])
  const [category, setCategory] = useState("")
  const [allReservationCategory, setAllReservationCategory] = useState([])
  const [reservationCategory, setReservationCategory] = useState("")
  const [allCast, setAllCast] = useState([])
  const [cast, setCast] = useState("")

  const eventId = localStorage.getItem("menuId")
  console.log(eventId, "event id")
  const parentId = localStorage.getItem("parentId")
  console.log(parentId, "parent id")
  const recruitName = localStorage.getItem("recruitName");

  const headerCellStyle = {
    backgroundColor: "rgb(27, 90, 144)",
    color: "#fff",
  };

  useEffect(() => {
    Get1600MeterData();
  }, [eventId])


  useEffect(() => {
    AllCategory();
    AllReservationCategory();
    getAllCastData();
  }, [])

  const Get1600MeterData = async () => {
    const data = await fetchAll1600Meter(eventId, groupId, reservationCategory, cast);
    console.log(data)
    setAll1600MeterReport(data)
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
    const data = await fetchAll1600Meter(eventId, selectedValue.value, reservationCategory, cast);
    console.log(data)
    setGroupLeaderName(data[0].GrpLdrName)
    console.log(data[0].GrpLdrName, "leader name")
    setAll1600MeterReport(data)
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


  const AllReservationCategory = async () => {
    const data = await getReservationCategory();
    console.log(data)
    setAllReservationCategory(data)
  }

  const handleReservationCategory = async (selected) => {
    const selectedValue = selected;
    setReservationCategory(selectedValue);
    console.log(selectedValue.value, "selected value");
    // setGroupId(selectedValue.value)
    const data = await fetchAll1600Meter(eventId, groupId, selectedValue.label, null);
    console.log(data)
    setAll1600MeterReport(data)
  }

  const getAllCastData = async () => {
    const data = await getAllCast();
    console.log(data)
    setAllCast(data)
  }

  const handleCast = async (selected) => {
    const selectedValue = selected;
    setCast(selectedValue);
    console.log(selectedValue.value, "selected value");
    // setGroupId(selectedValue.value)
    const data = await fetchAll1600Meter(eventId, groupId, null, selectedValue.label);
    console.log(data)
    setAll1600MeterReport(data)
  }

  const RefreshPage = async () => {
    setReservationCategory("");
    setCast("");
    setGroupId("");
    setGroup("");
    setCategory("")

    const data = await fetchAll1600Meter(eventId, "", "", "");
    console.log(data)
    setAll1600MeterReport(data)
  };

  const handleSearch = (e) => {
    const searchDataValue = e.target.value.toLowerCase();
    setSearchData(searchDataValue);

    if (searchDataValue.trim() === "") {
      Get1600MeterData();
    } else {
      const filteredData = all1600MeterReport.filter(
        (report) =>
          report.ChestNo.toLowerCase().includes(searchDataValue) ||
          report.CandidateName.toLowerCase().includes(searchDataValue)
      );
      setAll1600MeterReport(filteredData);
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
          th, td {
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
  

     <h2>Commissioner of Police ${recruitName} City</h2>
    <h3>1600 Meter Running Report</h3>
    ${groupId ? `
  <h3>Group No: ${groupId}</h3>
  <h3>Group Leader Name: ${groupLeaderName || ""}</h3>
` : ""}
        <table>
          <thead>
            <tr>
              <th>Sr No</th>
              <th>Candidate Name</th>
              <th>Chest No</th>
              <th>Tag No</th>
              <th>Cast</th>
              <th>Parellel Reservation</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Duration</th>      
              <th>Score</th>
              <th>Signature</th>
                <th>Group Leader Sign</th>
            </tr>
          </thead>
          <tbody>
    `;

    // ChestNo ascending sort
    const sortedData = [...all1600MeterReport].sort((a, b) => {
      const chestA = Number(a.ChestNo) || 0;
      const chestB = Number(b.ChestNo) || 0;
      return chestA - chestB;
    });

    sortedData.forEach((row, index) => {
      tableHTML += `
        <tr>
          <td>${index + 1}</td>
          <td>${row.CandidateName || ""}</td>
          <td>${row.ChestNo || ""}</td>
          <td>${row.Barcode || ""}</td>
           <td>${row.Cast || ""}</td>    
      <td>${row["Parallel Reservation"] || ""}</td>
        <td>${row.StartTime === "00:00:00.00" || row.StartTime === "00:00:00.000"
          ? ""
          : row.StartTime || ""
        }</td>

      <td>${row.EndTime === "00:00:00.00" || row.EndTime === "00:00:00.000"
          ? ""
          : row.EndTime || ""
        }</td>
         <td>${row.duration || ""}</td>
          <td>${row.score ?? ""}</td>
          <td class="signature-box"></td>
             ${index === 0 ? `<td class="signature-box" rowspan="${all1600MeterReport.length}"></td>` : ""}
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

const download1600MeterPDF = () => {
  const doc = new jsPDF("l", "mm", "a4");
  const pageWidth = doc.internal.pageSize.getWidth();

  // 🔹 Main Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text(
    `Commissioner of Police ${recruitName} City`,
    pageWidth / 2,
    15,
    { align: "center" }
  );

  // 🔹 Sub Title
  doc.setFontSize(12);
  doc.text("1600 Meter Report", pageWidth / 2, 23, { align: "center" });

  let startY = 30; // 👈 dynamic Y position

  // 🔹 Group Details
  if (groupId) {
    doc.setFont("helvetica", "bold");

    doc.text(`Group No: ${groupId}`, pageWidth / 2, startY, {
      align: "center",
    });

    startY += 7;

    doc.text(
      `Group Leader Name: ${groupLeaderName || ""}`,
      pageWidth / 2,
      startY,
      { align: "center" }
    );

    startY += 10; // ✅ EXTRA SPACE BEFORE TABLE
  } else {
    startY += 5; // spacing even if no group
  }

  // 🔹 Table Columns
  const tableColumn = [
    "Sr No",
    "Candidate Name",
    "Chest No",
    "Tag No",
    "Cast",
    "Parallel Reservation",
    "Start Time",
    "End Time",
    "Duration",
    "Lap",
    "Score",
  ];

  // 🔹 SORT BY CHEST NO
  const sortedData = [...all1600MeterReport].sort(
    (a, b) => Number(a.ChestNo) - Number(b.ChestNo)
  );

  const tableRows = [];
  sortedData.forEach((data, index) => {
    tableRows.push([
      index + 1,
      data.CandidateName || "",
      data.ChestNo || "",
      data.Barcode || "",
      data.Cast || "",
      data["Parallel Reservation"] || "",
      data.StartTime === "00:00:00.00" || data.StartTime === "00:00:00.000"
        ? ""
        : data.StartTime || "",
      data.EndTime === "00:00:00.00" || data.EndTime === "00:00:00.000"
        ? ""
        : data.EndTime || "",
      data.duration || "",
      data.Lapcount || "",
      data.score || "",
    ]);
  });

  // 🔹 AutoTable with proper spacing
  doc.autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: startY, // ✅ FIXED HERE
    styles: { fontSize: 8 },
    headStyles: {
      fillColor: [27, 90, 144],
      textColor: 255,
      fontStyle: "bold",
    },
  });

  doc.save("1600_Meter_Report.pdf");
};


  const sortedData = [...all1600MeterReport].sort(
    (a, b) => Number(a.ChestNo) - Number(b.ChestNo)
  );


  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);

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
                    <h4 className="card-title fw-bold">1600 Meter Running Report</h4>
                  </div>

                </div> */}
                <div className="row align-items-center">
                  <div className="col-lg-8 col-md-8 col-7">
                    <h4 className="card-title fw-bold py-2">1600 Meter Running Report</h4>
                  </div>
                  <div className="col-lg-4 col-md-4 col-5 d-flex justify-content-end print-section">
                    <button
                      className="btn btn-sm me-2"
                      style={{ backgroundColor: "#1B5A90", color: "white" }}
                    >
                      <Refresh
                        onClick={() => {
                          RefreshPage()
                        }} // Refresh the page
                        style={{
                          fontSize: 30, // Increase icon size
                          cursor: "pointer",
                          color: "white",
                        }}
                        titleAccess="Refresh Page"
                      />
                    </button>
                    <button
                      className="btn btn-sm me-2"
                      style={headerCellStyle}
                      onClick={download1600MeterPDF}
                    >
                      Download PDF
                    </button>
                    <button className="btn me-2" style={headerCellStyle} /* onClick={() => window.print()} */ onClick={openPrintWindow}>Print</button>
                    <button className="btn" style={headerCellStyle} onClick={() => navigate(-1)}>  <ArrowBack /></button>
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

                  </div>

                  <div className="col-lg-3 col-md-3 col-12 mt-3 mt-md-0">

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
                <div className="row mt-4">

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
                    <Select
                      value={reservationCategory}
                      onChange={handleReservationCategory}
                      options={allReservationCategory}
                      placeholder="Select Reservation"
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
                      value={cast}
                      onChange={handleCast}
                      options={allCast}
                      placeholder="Select Cast"
                      styles={{
                        control: (provided) => ({
                          ...provided,
                          width: "100%",     // FULL WIDTH
                          minHeight: "35px",
                        }),
                      }}
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
                        Tag No
                      </th>
                      <th scope="col" style={headerCellStyle}>
                        Cast
                      </th>
                      <th scope="col" style={headerCellStyle}>
                        Parellel Reservation
                      </th>
                      <th scope="col" style={headerCellStyle}>
                        Start Time
                      </th>
                      <th scope="col" style={headerCellStyle}>
                        End Time
                      </th>
                      <th scope="col" style={headerCellStyle}>
                        Duration
                      </th>
                      <th scope="col" style={headerCellStyle}>
                        Lap
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
                        <td>{data.Barcode}</td>
                        <td>{data.Cast}</td>
                        <td>{data["Parallel Reservation"]}</td>
                        {/* <td>{data.StartTime}</td>
                        <td>{data.EndTime}</td> */}
                        <td>{data.StartTime === "00:00:00.00" || data.StartTime === "00:00:00.000"
                          ? ""
                          : data.StartTime || ""
                        }</td>

                        <td>{data.EndTime === "00:00:00.00" || data.EndTime === "00:00:00.000"
                          ? ""
                          : data.EndTime || ""
                        }</td>
                        <td>{data.duration}</td>
                        <td>{data.Lapcount}</td>
                        <td>{data.score}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <div className="row mt-4 mt-xl-3">
                  <div className="col-lg-4 col-md-4 col-12 ">
                    <h6 className="text-lg-start text-md-start text-center">
                      Showing {indexOfFirstItem + 1} to{" "}
                      {Math.min(indexOfLastItem, all1600MeterReport.length)} of{" "}
                      {all1600MeterReport.length} entries
                    </h6>
                  </div>
                  <div className="col-lg-4 col-md-4 col-12"></div>
                  <div className="col-lg-4 col-md-4 col-12 mt-3 mt-lg-0 mt-md-0">
                    <Pagination
                      currentPage={currentPage}
                      setCurrentPage={setCurrentPage}
                      allData={all1600MeterReport}
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

export default All1600MeterReport