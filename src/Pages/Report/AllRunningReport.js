import React, { useState, useEffect } from 'react'
import { fetchAllReport, getAllCast, GetCategory, getReservationCategory } from '../../Components/Api/DailyReportApi'
import { Table, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Select from 'react-select'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Pagination } from '../../Components/Utils/Pagination';
import { getAllGroup } from '../../Components/Api/EventApi';
import { ArrowBack, Refresh } from '@material-ui/icons';
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const AllRunningReport = () => {
    const navigate = useNavigate();
    const recruitName = localStorage.getItem("recruitName");
    const [allRunningReport, setAllRunningReport] = useState([]);
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

    const headerCellStyle = {
        backgroundColor: "rgb(27, 90, 144)",
        color: "#fff",
    };

    useEffect(() => {
        AllReport();
        AllCategory();
        AllReservationCategory();
        getAllCastData();
    }, [])

    const AllReport = async () => {
        const data = await fetchAllReport(groupId, reservationCategory, cast);
        console.log(data)
        setAllRunningReport(data)
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

    // const handleGroup = async (selected) => {
    //     const selectedValue = selected;
    //     setGroup(selectedValue);
    //     console.log(selectedValue.value, "selected value");
    //     setGroupId(selectedValue.value)
    //     const data = await fetchAllReport(selectedValue.value, reservationCategory, cast);
    //     console.log(data)
    //     setGroupLeaderName(data[0].GrpLdrName)
    //     console.log(data[0].GrpLdrName, "leader name")
    //     setAllRunningReport(data)
    // }

    const handleGroup = async (selected) => {
        if (!selected) return;

        const groupIdValue = selected.value;

        // 1️⃣ set dropdown state
        setGroup(selected);
        setGroupId(groupIdValue);

        // 2️⃣ clear old data immediately
        setAllRunningReport([]);
        setGroupLeaderName("");

        try {
            const data = await fetchAllReport(
                groupIdValue,        // ✅ direct value
                reservationCategory,
                cast
            );

            console.log(data, "API DATA");

            if (data && data.length > 0) {
                setGroupLeaderName(data[0]?.GrpLdrName || "");
                setAllRunningReport(data);
            } else {
                // 👇 group selected but no data
                setGroupLeaderName("");
                setAllRunningReport([]);
            }
        } catch (error) {
            console.error("Error fetching All running data", error);
            setAllRunningReport([]);
            setGroupLeaderName("");
        }
    };

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
        const data = await fetchAllReport(groupId, selectedValue.label, null);
        console.log(data)
        setAllRunningReport(data)
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

        console.log(reservationCategory, "reservation category")
        const data = await fetchAllReport(groupId, null, selectedValue.label);
        console.log(data)
        setAllRunningReport(data)
    }

    const RefreshPage = async () => {
        setReservationCategory("");
        setCast("");
        setGroupId("");
        setGroup("");
        setCategory("")

        const data = await fetchAllReport("", "", "");
        console.log(data)
        setAllRunningReport(data)
    };

    const handleSearch = (e) => {
        const searchDataValue = e.target.value.toLowerCase();
        setSearchData(searchDataValue);

        if (searchDataValue.trim() === "") {
            AllReport();
        } else {
            const filteredData = allRunningReport.filter(
                (report) =>
                    report.ChestNo.toLowerCase().includes(searchDataValue) ||
                    report.CandidateName.toLowerCase().includes(searchDataValue)
            );
            setAllRunningReport(filteredData);
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
        <title>All Running Report</title>
          <style>
        body {
          margin: 10px;
          font-family: Arial;
        }

        h2 {
          margin: 5px 0;
          font-size: 18px;
        }

        h3 {
          margin: 3px 0;
          font-size: 16px;
        }

        .header-section {
          page-break-inside: avoid;
          page-break-after: avoid;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
          border: 1px solid #000;
        }

        th, td {
          padding: 6px;
          border: 1px solid #000;
          text-align: left;
          font-size: 12px;
        }

        th {
          background: #f2f2f2;
          font-weight: bold;
        }

        tr {
          page-break-inside: avoid;
          break-inside: avoid;
        }

        tbody {
          page-break-inside: auto;
        }

        .signature-box {
          height: 50px;
          border-top: 1px solid #000;
          border-bottom: 1px solid #000;
          border-left: 1px solid #000;
          border-right: 1px solid #000;
        }

        .group-leader-sign {
          height: 50px;
          border-top: 1px solid #000 !important;
          border-bottom: 1px solid #000 !important;
          border-left: 1px solid #000 !important;
          border-right: 1px solid #000 !important;
          vertical-align: top;
        }

        thead {
          display: table-header-group;
        }
      </style>
      </head>
      <body>
            <div class="header-section">
  
     <h2>Commissioner of Police ${recruitName} City</h2>
    <h3> Running Report</h3>
    ${groupId ? `
  <h3>Group No: ${groupId}</h3>

` : ""}
</div>
        <table>
          <thead>
            <tr>
              <th>Sr No</th>
              <th>Candidate Name</th>
              <th>Chest No</th>
              <th>Tag No</th>
              <th>Cast</th>
              <th>Parellel Reservation</th>
              <th>100 Meter</th>
              <th>800 Meter</th>
              <th>1600 Meter</th>      
              <th>Shot Put</th>
              <th>Total</th>
              <th>Signature</th>
              <th>Group Leader Sign</th>
            </tr>
          </thead>
          <tbody>
    `;

        // ChestNo ascending sort
        const sortedData = [...allRunningReport].sort((a, b) => {
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
         <td>${row["100 Meter Running"] ?? ""}</td>
          <td>${row["800 Meter Running"] ?? ""}</td>
         <td>${row["1600 Meter Running"] ?? ""}</td>   
          <td>${row["Shot Put"] ?? ""}</td>
          <td>${row.Total ?? ""}</td>
          <td class="signature-box"></td>
            ${index === 0 ? `<td class="signature-box" rowspan="${allRunningReport.length}"></td>` : ""}
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

        printWindow.onload = function () {
            printWindow.print();
        };
    };

    const downloadAllRunningPDF = () => {
        const doc = new jsPDF("l", "mm", "a4");

        const pageWidth = doc.internal.pageSize.getWidth();

        // Main Title
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);

        doc.text(
            `Commissioner of Police ${recruitName} City`,
            pageWidth / 2,
            15,
            { align: "center" }
        );
        // Sub Title
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.text("All Report", pageWidth / 2, 23, { align: "center" });
        let startY = 30;

        // 🔹 Group details (center aligned)
        if (groupId) {
            doc.setFont("helvetica", "bold");

            doc.text(
                `Group No: ${groupId}`,
                pageWidth / 2,
                startY,
                { align: "center" }
            );

            startY += 7;

            // doc.text(
            //     `Group Leader Name: ${groupLeaderName || ""}`,
            //     pageWidth / 2,
            //     startY,
            //     { align: "center" }
            // );

            startY += 10; // ✅ EXTRA SPACE BEFORE TABLE
        } else {
            startY += 5; // spacing even if no group
        }

        const tableColumn = [
            "Sr No",
            "Candidate Name",
            "Chest No",
            "Tag No",
            "Cast",
            "Parallel Reservation",
            "100 Meter",
            "800 Meter",
            "1600 Meter",
            "Shot Put",
            "Total"
        ];

        // 🔹 SORT DATA BY CHEST NO (ASC)
        const sortedData = [...allRunningReport].sort(
            (a, b) => Number(a.ChestNo) - Number(b.ChestNo)
        );

        const tableRows = [];

        sortedData.forEach((data, index) => {
            tableRows.push([
                index + 1,
                data.CandidateName,
                data.ChestNo,
                data.Barcode,
                data.Cast,
                data["Parallel Reservation"],
                data["100 Meter Running"],
                data["800 Meter Running"],
                data["1600 Meter Running"],
                data["Shot Put"],
                data["Total"]
            ]);
        });

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: startY, // ⬅️ increase this value
            styles: { fontSize: 8 },
            headStyles: {
                fillColor: [27, 90, 144],
                textColor: 255,
                fontStyle: "bold",
            },
        });

        doc.save("All_Report.pdf");
    };

    const downloadAllRunningExcel = () => {
        // ✅ Sort by Chest No (Ascending)
        const sortedData = [...allRunningReport].sort(
            (a, b) => Number(a.ChestNo) - Number(b.ChestNo)
        );

        const excelData = sortedData.map((data, index) => ({
            "Sr No": index + 1,
            "Candidate Name": data.CandidateName ?? "",
            "Chest No": data.ChestNo ?? "",
            "Barcode": data.Barcode ?? "",
            "Cast": data.Cast ?? "",
            "Parallel Reservation": data["Parallel Reservation"] ?? "",
            "100 Meter Running": data["100 Meter Running"] ?? "",   // ✅ 0 shows
            "800 Meter Running": data["800 Meter Running"] ?? "",
            "1600 Meter Running": data["1600 Meter Running"] ?? "",
            "Shot Put": data["Shot Put"] ?? "",
            "Total": data["Total"] ?? "",
        }));

        const worksheet = XLSX.utils.json_to_sheet(excelData);

        // ✅ Auto column width
        worksheet["!cols"] = Object.keys(excelData[0]).map(() => ({ wch: 22 }));

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(
            workbook,
            worksheet,
            "All Running Report"
        );

        const excelBuffer = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array",
        });

        const file = new Blob([excelBuffer], {
            type:
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        saveAs(file, "All_Running_Report.xlsx");
    };

    const sortedData = [...allRunningReport].sort(
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
                    <h4 className="card-title fw-bold">100 Meter Running Report</h4>
                  </div>

                </div> */}
                                <div className="row align-items-center">
                                    <div className="col-lg-8 col-md-8 col-7">
                                        <h4 className="card-title fw-bold py-2">Running Report</h4>
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
                                            onClick={downloadAllRunningPDF}
                                        >
                                            PDF
                                        </button>
                                        <button
                                            className="btn btn-sm me-2"
                                            style={headerCellStyle}
                                            onClick={downloadAllRunningExcel}
                                        >
                                            Excel
                                        </button>
                                        <button className="btn me-2" style={headerCellStyle} /* onClick={() => window.print()} */ onClick={openPrintWindow} >Print</button>
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

                                    <div className="col-lg-3 col-md-3 col-12 mt-3 mt-md-0"></div>
                                    <div className="col-lg-3 col-md-3 col-12 mt-3 mt-md-0"></div>

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
                                                100 Meter
                                            </th>
                                            <th scope="col" style={headerCellStyle}>
                                                800 Meter
                                            </th>
                                            <th scope="col" style={headerCellStyle}>
                                                1600 Meter
                                            </th>
                                            <th scope="col" style={headerCellStyle}>
                                                Shot Put
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
                                                <td>{data["100 Meter Running"]}</td>
                                                <td>{data["800 Meter Running"]}</td>
                                                <td>{data["1600 Meter Running"]}</td>
                                                <td>{data["Shot Put"]}</td>
                                                <td>{data["Total"]}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                                <div className="row mt-4 mt-xl-3">
                                    <div className="col-lg-4 col-md-4 col-12 ">
                                        <h6 className="text-lg-start text-md-start text-center">
                                            Showing {indexOfFirstItem + 1} to{" "}
                                            {Math.min(indexOfLastItem, allRunningReport.length)} of{" "}
                                            {allRunningReport.length} entries
                                        </h6>
                                    </div>
                                    <div className="col-lg-4 col-md-4 col-12"></div>
                                    <div className="col-lg-4 col-md-4 col-12 mt-3 mt-lg-0 mt-md-0">
                                        <Pagination
                                            currentPage={currentPage}
                                            setCurrentPage={setCurrentPage}
                                            allData={allRunningReport}
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

export default AllRunningReport