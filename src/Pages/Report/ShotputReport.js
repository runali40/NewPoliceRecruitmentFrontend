import React, { useState, useEffect } from 'react'
import { fetchAll100Meter, fetchAllShotput, getAllCast, getAllGender, GetCategory, getReservationCategory } from '../../Components/Api/DailyReportApi'
import { Table, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import Select from 'react-select'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Pagination } from '../../Components/Utils/Pagination';
import { getAllGroup } from '../../Components/Api/EventApi';
import { ArrowBack, Refresh } from '@material-ui/icons';
import { DateRange } from "react-date-range";
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { enUS } from "date-fns/locale";

const ShotputReport = () => {
    const navigate = useNavigate();
    const eventId = localStorage.getItem("menuId")
    console.log(eventId, "event id")
    const parentId = localStorage.getItem("parentId")
    console.log(parentId, "parent id")
    const recruitName = localStorage.getItem("recruitName");

    const [shotputReport, setShotputReport] = useState([]);
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
    const [fromDate, setFromDate] = useState()
    const [toDate, setToDate] = useState()
    const [allGender, setAllGender] = useState([])
    const [gender, setGender] = useState("")
    const [selectDate, setSelectDate] = useState();
    const [range, setRange] = useState([
        {
            startDate: null,
            endDate: null,
            key: "selection",
        },
    ]);

    const [showPicker, setShowPicker] = useState(false);


    const handleSelect = async (item) => {
        const selection = item.selection;
        setRange([selection]);

        // ⛔ sirf start date select hua → kuch mat karo
        if (!selection.startDate || !selection.endDate) {
            return;
        }

        const formatDate = (date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");
            return `${year}-${month}-${day}`;
        };

        const formattedStart = formatDate(selection.startDate);
        const formattedEnd = formatDate(selection.endDate);

        // ✅ dono dates set karo
        setFromDate(formattedStart);
        setToDate(formattedEnd);
        setSelectDate(`${formattedStart} - ${formattedEnd}`);

        const data = await fetchAllShotput(
            eventId,
            groupId,
            reservationCategory,
            cast,
            formattedStart,
            formattedEnd
        );

        setShotputReport(data);
        setShowPicker(false);
    };


    const headerCellStyle = {
        backgroundColor: "rgb(27, 90, 144)",
        color: "#fff",
    };

    useEffect(() => {
        ShotputReport();
    }, [eventId])

    useEffect(() => {
        AllCategory();
        AllReservationCategory();
        getAllCastData();
        AllGender();
    }, [])

    const ShotputReport = async () => {
        const data = await fetchAllShotput(eventId, groupId, reservationCategory, cast, fromDate, toDate);
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

    // const handleGroup = async (selected) => {
    //     const selectedValue = selected;
    //     setGroup(selectedValue);
    //     console.log(selectedValue.value, "selected value");
    //     setGroupId(selectedValue.value)
    //     const data = await fetchAllShotput(eventId, selectedValue.value, reservationCategory, cast);
    //     console.log(data)
    //     setGroupLeaderName(data[0].GrpLdrName)
    //     console.log(data[0].GrpLdrName, "leader name")
    //     setShotputReport(data)
    // }

    const handleGroup = async (selected) => {
        if (!selected) return;

        const groupIdValue = selected.value;

        // 1️⃣ set dropdown state
        setGroup(selected);
        setGroupId(groupIdValue);

        // 2️⃣ clear old data immediately
        setShotputReport([]);
        setGroupLeaderName("");
        setReservationCategory("")
        setCast("")
        setGender("")

        try {
            const data = await fetchAllShotput(
                eventId,
                groupIdValue,        // ✅ direct value
                null,
                null,
                null,
                null
            );

            console.log(data, "API DATA");

            if (data && data.length > 0) {
                setGroupLeaderName(data[0]?.GrpLdrName || "");
                setShotputReport(data);
            } else {
                // 👇 group selected but no data
                setGroupLeaderName("");
                setShotputReport([]);
            }
        } catch (error) {
            console.error("Error fetching 1600 meter data", error);
            setShotputReport([]);
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
        setReservationCategory("")
        setCast("")
        setGender("")
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
        setCast("")
        setGender("")
        setCategory("")
        setGroup("")

        // setGroupId(selectedValue.value)
        const data = await fetchAllShotput(eventId, null, selectedValue.label, null, null, null);
        console.log(data)
        setShotputReport(data)
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
        setCategory("")
        setGroup("")
        setReservationCategory("")
        setGender("")
        // setGroupId(selectedValue.value)
        const data = await fetchAllShotput(eventId, null, null, selectedValue.label, null, null);
        console.log(data)
        setShotputReport(data)
    }

    const RefreshPage = async () => {
        setReservationCategory("");
        setCast("");
        setGroupId("");
        setGroup("");
        setCategory("")
        setGender("");
        setFromDate("")
        setToDate("")
        setRange([
            {
                startDate: null,
                endDate: null,
                key: "selection",
            },
        ]);
        const data = await fetchAllShotput(eventId, null, null, null, null, null);
        console.log(data)
        setShotputReport(data)
    };

    const AllGender = async () => {
        try {
            const data = await getAllGender();
            console.log("All Gender Response:", data);

            const options = data.map((data) => ({
                value: data.value,
                label: `${data.label} `,
            }));
            setAllGender(options);
        } catch (error) {
            console.log("All Gender Error:", error);
        }
    };

    const handleGender = async (selected) => {
        const selectedValue = selected;
        setGender(selectedValue);
        console.log(selectedValue.value, "selected value");
        setCategory("")
        setGroup("")
        setReservationCategory("")
        setCast("")
        // setGroupId(selectedValue.value)
        const data = await fetchAllShotput(eventId, null, null, selectedValue.label, null, null);
        console.log(data)
        setShotputReport(data)
    }

    const handleSearch = (e) => {
        const searchDataValue = e.target.value.toLowerCase();
        setSearchData(searchDataValue);

        if (searchDataValue.trim() === "") {
            ShotputReport();
        } else {
            const filteredData = shotputReport.filter(
                (report) =>
                    (report.ApplicationNo || "").toLowerCase().includes(searchDataValue) ||
                    (report.ChestNo || "").toLowerCase().includes(searchDataValue) ||
                    (report.CandidateName || "").toLowerCase().includes(searchDataValue) ||
                    (report.Barcode || "").toLowerCase().includes(searchDataValue)
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

    //     const openPrintWindow = () => {
    //         let tableHTML = `
    //       <html>
    //       <head>
    //         <title>Report</title>
    //         <style>
    //           table {
    //             width: 100%;
    //             border-collapse: collapse;
    //             font-family: Arial;
    //           }
    //           th{
    //             padding: 8px;
    //             border: 1px solid #000;
    //             text-align: left;
    //             font-size: 14px;
    //           }
    //           th {
    //             background: #f2f2f2;
    //           }
    //           .signature-box {
    //             height: 60px;
    //             border: 1px solid #000;
    //           }
    //           .print-btn {
    //             margin: 15px 0;
    //             padding: 6px 12px;
    //             border: 1px solid #000;
    //             cursor: pointer;
    //             background: #ddd;
    //             font-size: 14px;
    //           }
    //         </style>
    //       </head>
    //       <body>

    //         <button class="btn btn-success print-btn" onclick="startPrinting()">Print</button>

    //         <script>
    //           function startPrinting() {
    //             const btn = document.querySelector('.print-btn');
    //             btn.style.display = 'none';      
    //             setTimeout(() => {
    //               window.print();
    //               btn.style.display = 'block';   
    //             }, 200);
    //           }
    //         </script>

    //      <h2>Commissioner of Police ${recruitName} City</h2>
    //     <h3>Shot Put Report</h3>
    //    ${groupId ? `
    //   <h3>Group No: ${groupId}</h3>
    //   <h3>Group Leader Name: ${groupLeaderName || ""}</h3>
    // ` : ""}
    //         <table>
    //           <thead>
    //             <tr>
    //               <th>Sr No</th>
    //               <th>Candidate Name</th>
    //               <th>Chest No</th>
    //               <th>Tag No</th>
    //               <th>Cast</th>
    //               <th>ParallelReservation</th>
    //               <th>Distance 1</th>
    //               <th>Distance 2</th>
    //               <th>Distance 3</th>      
    //               <th>Score</th>
    //               <th>Signature</th>
    //                 <th>Group Leader Sign</th>
    //             </tr>
    //           </thead>
    //           <tbody>
    //     `;

    //         // ChestNo ascending sort
    //         const sortedData = [...shotputReport].sort((a, b) => {
    //             const chestA = Number(a.ChestNo) || 0;
    //             const chestB = Number(b.ChestNo) || 0;
    //             return chestA - chestB;
    //         });

    //         sortedData.forEach((row, index) => {
    //             tableHTML += `
    //         <tr>
    //           <td>${index + 1}</td>
    //           <td>${row.CandidateName || ""}</td>
    //           <td>${row.ChestNo || ""}</td>
    //           <td>${row.Barcode || ""}</td>
    //          <td>${row.Cast || ""}</td>    
    //          <td>${row["Parallel Reservation"] || ""}</td>
    //          <td>${row.distance1 || ""}</td>
    //          <td>${row.distance2 || ""}</td>
    //          <td>${row.distance3 || ""}</td>
    //           <td>${row.score ?? ""}</td>
    //           <td class="signature-box"></td>
    //              ${index === 0 ? `<td class="signature-box" rowspan="${shotputReport.length}"></td>` : ""}
    //         </tr>
    //       `;
    //         });

    //         tableHTML += `
    //           </tbody>
    //         </table>
    //       </body>
    //       </html>
    //     `;

    //         const printWindow = window.open("", "_blank", "width=900,height=700");
    //         printWindow.document.open();
    //         printWindow.document.write(tableHTML);
    //         printWindow.document.close();
    //     };

    const openPrintWindow = () => {
        let tableHTML = `
  <html>
  <head>
    <title>Shot Put Report</title>
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
           text-align: center !important;
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
    <h3>Shot Put Report</h3>

   
        ${groupId ? `
          <h3>Group No: ${groupId}</h3>
         
        ` : ""}
           ${groupLeaderName !== "" ? `
         
          <h3>Group Leader Name: ${groupLeaderName || ""}</h3>
        ` : ""}
        ${gender !== "" ? `
  <h3>${gender.label} Candidate</h3>
` : ""}
${reservationCategory !== "" ? `
  <h3>${reservationCategory.label} Candidate</h3>
` : ""}
${cast !== "" ? `
  <h3>${cast.label} Candidate</h3>
` : ""}
</div>
    <table>
      <thead>
        <tr>
          <th>Sr No</th>
          <td>Application No</th>
          <th>Candidate Name</th>
           <th>Gender</th>
          <th>Chest No</th>
          <th>Tag No</th>
          <th>Cast</th>
          <th>Parallel Reservation</th>
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

        // ✅ ChestNo ascending sort
        const sortedData = [...shotputReport].sort((a, b) => {
            const chestA = Number(a.ChestNo) || 0;
            const chestB = Number(b.ChestNo) || 0;
            return chestA - chestB;
        });

        sortedData.forEach((row, index) => {
            tableHTML += `
      <tr>
        <td>${index + 1}</td>
        <td>${row.ApplicationNo || ""}</td>
        <td>${row.CandidateName || ""}</td>
         <td>${row.Gender || ""}</td>
        <td>${row.ChestNo || ""}</td>
        <td>${row.Barcode || ""}</td>
        <td>${row.Cast || ""}</td>
        <td>${row["Parallel Reservation"] || ""}</td>
        <td>${row.distance1 || ""}</td>
        <td>${row.distance2 || ""}</td>
        <td>${row.distance3 || ""}</td>
        <td>${row.score ?? ""}</td>
        <td class="signature-box"></td>
        ${index === 0
                    ? `<td class="signature-box" rowspan="${sortedData.length}"></td>`
                    : ""
                }
      </tr>
    `;
        });

        tableHTML += `
      </tbody>
    </table>

  </body>
  </html>
  `;

        const printWindow = window.open("", "_blank", "width=1000,height=700");
        printWindow.document.open();
        printWindow.document.write(tableHTML);
        printWindow.document.close();

        printWindow.onload = function () {
            printWindow.print();
        };
    };


    const downloadShotPutPDF = () => {
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
        doc.text("Shot Put Report", pageWidth / 2, 23, { align: "center" });
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

        }
        if (groupLeaderName) {
            doc.text(
                `Group Leader Name: ${groupLeaderName || ""}`,
                pageWidth / 2,
                startY,
                { align: "center" }
            );

        }
        if (reservationCategory) {
            doc.text(
                `${reservationCategory.label} Candidates`,
                pageWidth / 2,
                startY,
                { align: "center" }
            );

        }
        if (cast) {
            doc.text(
                `${cast.label} Candidates`,
                pageWidth / 2,
                startY,
                { align: "center" }
            );


        }
        if (gender) {
            doc.text(
                `${gender.label} Candidates`,
                pageWidth / 2,
                startY,
                { align: "center" }
            );

            startY += 5; // space before table
        }
        if (fromDate && toDate) {
            doc.text(
                `Date: ${fromDate} To ${toDate}`,
                pageWidth / 2,
                startY,
                { align: "center" }
            );
            startY += 5;
        }
        const tableColumn = [
            "Sr No",
            "Application No",
            "Candidate Name",
            "Gender",
            "Chest No",
            "Tag No",
            "Cast",
            "Parallel Reservation",
            "Distance 1",
            "Distance 2",
            "Distance 3",
            "Score"
        ];

        const sortedData = [...shotputReport].sort(
            (a, b) => Number(a.ChestNo) - Number(b.ChestNo)
        );
        const tableRows = [];

        shotputReport.forEach((data, index) => {
            tableRows.push([
                index + 1,
                data.ApplicationNo,
                data.CandidateName,
                data.Gender,
                data.ChestNo,
                data.Barcode,
                data.Cast,
                data["Parallel Reservation"],
                data.distance1,
                data.distance2,
                data.distance3,
                data.score
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

        doc.save("Shotput_Report.pdf");
    };

    const downloadShotPutExcel = () => {
        // ✅ Sort by Chest No Ascending
        const sortedData = [...shotputReport].sort(
            (a, b) => Number(a.ChestNo) - Number(b.ChestNo)
        );

        const excelData = sortedData.map((data, index) => ({
            "Sr No": index + 1,
            "Application No": data.ApplicationNo ?? "",
            "Candidate Name": data.CandidateName ?? "",
            "Gender": data.Gender ?? "",
            "Chest No": data.ChestNo ?? "",
            "Tag No": data.Barcode ?? "",
            "Cast": data.Cast ?? "",
            "Parallel Reservation": data["Parallel Reservation"] ?? "",
            "Distance 1": data.distance1 ?? "",
            "Distance 2": data.distance2 ?? "",
            "Distance 3": data.distance3 ?? "",
            "Score": data.score ?? "",   // ✅ 0 will show
        }));

        const worksheet = XLSX.utils.json_to_sheet(excelData);

        // ✅ Auto column width
        worksheet["!cols"] = Object.keys(excelData[0]).map(() => ({ wch: 20 }));

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Shot Put Report");

        const excelBuffer = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array",
        });

        const file = new Blob([excelBuffer], {
            type:
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        saveAs(file, "Shot_Put_Report.xlsx");
    };

    const sortedData = [...shotputReport].sort(
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
                                        <h4 className="card-title fw-bold py-2">Shot put Report</h4>
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
                                            onClick={downloadShotPutPDF}
                                        >
                                            PDF
                                        </button>
                                        <button
                                            className="btn btn-sm me-2"
                                            style={headerCellStyle}
                                            onClick={downloadShotPutExcel}
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

                                    <div className="col-lg-3 col-md-3 col-12 mt-3 mt-md-0">

                                    </div>

                                    <div className="col-lg-3 col-md-3 col-12 mt-3 mt-md-0">

                                        <div title="Date" style={{ width: "250px" }}>
                                            <input
                                                type="text"
                                                readOnly
                                                className="form-control"
                                                placeholder="Start Date - End Date"
                                                value={
                                                    range[0].startDate && range[0].endDate
                                                        ? `${range[0].startDate.toLocaleDateString()} - ${range[0].endDate.toLocaleDateString()}`
                                                        : ""
                                                }
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



                                    <div className="col-lg-2 col-md-2 col-12 mt-3 mt-md-0">
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
                                    <div className="col-lg-2 col-md-2 col-12 mt-3 mt-md-0">
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
                                    <div className="col-lg-2 col-md-2 col-12 mt-3 mt-md-0">
                                        <Select
                                            value={gender}
                                            onChange={handleGender}
                                            options={allGender}
                                            placeholder="Select Gender"
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
                                                Application No
                                            </th>
                                            <th scope="col" style={headerCellStyle}>
                                                Candidate Name
                                            </th>
                                            <th scope="col" style={headerCellStyle}>
                                                Gender
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
                                                Parallel Reservation
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
                                                <td>{data.ApplicationNo}</td>
                                                <td>{data.CandidateName}</td>
                                                <td>{data.Gender}</td>
                                                <td>{data.ChestNo}</td>
                                                <td>{data.Barcode}</td>
                                                <td>{data.Cast}</td>
                                                <td>{data["Parallel Reservation"]}</td>
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