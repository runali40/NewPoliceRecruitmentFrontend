import React, { useState, useEffect, useRef } from "react";
import { Table, Button, Alert } from "react-bootstrap";
import SignatureCanvas from "react-signature-canvas";
import { useNavigate, useLocation } from "react-router-dom";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";


import {
  getAllChestNumbers,
  getAllGroup,
  addRunningEvent,
  getAllRunningEvents,
  getGroupLeader,
  AddAppeal,
} from "../../Components/Api/EventApi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ArrowBack } from "@material-ui/icons";
import jsPDF from "jspdf";
import "jspdf-autotable";

// import { duration } from "moment";
// import { data } from "jquery";

const Event_Form = () => {
  const location = useLocation();
  const history = useNavigate();
  const { groupId } = location.state || {};

  const [chestNoOptions, setChestNoOptions] = useState([]);
  const [allGroup, setAllGroup] = useState([]);
  const [allGroupLeader, setAllGroupLeader] = useState([]);
  const [groupLeader, setGroupLeader] = useState("")
  const [otherLeader, setOtherLeader] = useState("")
  const [groupValue, setGroupValue] = useState(groupId || "");
  const [rows, setRows] = useState(
    Array(10)
      .fill()
      .map(() => ({
        ChestNo: "",
        StartTime: null,
        EndTime: null,
        group: "",
        duration: "",
        Distance: "",
        distance1: "",
        distance2: "",
        distance3: "",
        stage: "",
        Signature: null, // Initially, no signature
        grpLdrSignature: null,
        inchargeSignature: null,
        Name: "",
        NoOfAttemp: ""
      }))
  );
  console.log(rows.stage, "stage")
  console.log(rows.NoOfAttemp, "NoOfAttemp")
  const headerCellStyle = {
    backgroundColor: "rgb(27, 90, 144)",
    color: "#fff",
  };
  const sigRefs = useRef(rows.map(() => React.createRef()));
  const grpLdrSigRef = useRef();
  const inchargeSigRef = useRef();
  const navigate = useNavigate();
  const title = localStorage.getItem("title");
  const menuId = localStorage.getItem("menuId");
  console.log("menuId", menuId)
  const [alertMessage, setAlertMessage] = useState(null);
  const recruitName = localStorage.getItem("recruitName");

  useEffect(() => {
    if (groupValue) {
      fetchAllChestNumbers(groupValue);
    }
  }, [groupValue]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // if (!groupId) {

        // }
        const groups = await getAllGroup();
        setAllGroup(groups);
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {

        const data = await getGroupLeader();
        console.log(data, "group leader")
        setAllGroupLeader(data);

      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    };
    fetchData();
  }, []);
  // const fetchAllChestNumbers = async (groupId, menuId) => {
  //   try {
  //     const chestNumbers = await getAllChestNumbers(groupId, menuId);
  //     console.log(chestNumbers, "chest numbers");

  //     const options = chestNumbers.map((data) => ({
  //       value: data.ChestNo,
  //       label: `${data.ChestNo}`,
  //     }));
  //     setChestNoOptions(options);

  //     // Create only the rows for which we have chest numbers
  //     const initialRows = chestNumbers.map((data) => ({
  //       ChestNo: data.ChestNo,
  //       StartTime: "",
  //       EndTime: "",
  //       group: groupId,
  //       duration: "",
  //       Distance: "",
  //       distance1: "",
  //       distance2: "",
  //       distance3: "",
  //       Signature: null,
  //       grpLdrSignature: null,
  //       inchargeSignature: null,
  //     }));

  //     // Update refs array to match the number of rows
  //     sigRefs.current = initialRows.map(() => React.createRef());

  //     const runningEvents = await getAllRunningEvents(menuId);
  //     console.log(runningEvents, "running events");

  //     if (runningEvents.length !== 0) {
  //       const runningEventsMap = new Map(
  //         runningEvents.map((event) => [event.ChestNo, event])
  //       );

  //       const updatedRows = initialRows.map((row) => {
  //         const runningEventData = runningEventsMap.get(row.ChestNo);
  //         return runningEventData ? { ...row, ...runningEventData } : row;
  //       });

  //       setRows(updatedRows);
  //     } else {
  //       setRows(initialRows);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching chest numbers or running events:", error);
  //   }
  // };

  const fetchAllChestNumbers = async (groupId) => {
    try {
      // Step 1: Get Chest Numbers for groupId and menuId
      const chestNumbers = await getAllChestNumbers(groupId);
      console.log(chestNumbers, "chest numbers");

      // Step 2: Sort chest numbers numerically (e.g., Group1, Group2, ..., Group10)
      const sortedChestNumbers = [...chestNumbers].sort((a, b) => {
        return parseInt(a.ChestNo.replace(/\D/g, "")) - parseInt(b.ChestNo.replace(/\D/g, ""));
      });

      // Step 3: Prepare dropdown options
      const options = sortedChestNumbers.map((data) => ({
        value: data.ChestNo,
        label: `${data.ChestNo}`,
      }));
      setChestNoOptions(options);

      // Step 4: Prepare initial rows for each chest number
      const initialRows = sortedChestNumbers.map((data) => ({
        ChestNo: data.ChestNo,
        Name: data.FirstName_English + " " + data.Surname_English,
        StartTime: null,
        EndTime: null,
        group: groupId.toString(),
        duration: "",
        Distance: "",
        distance1: "",
        distance2: "",
        distance3: "",
        Signature: null,
        grpLdrSignature: null,
        inchargeSignature: null,
      }));

      // Step 5: Initialize signature refs
      sigRefs.current = initialRows.map(() => React.createRef());

      // Step 6: Fetch running event data for this menu
      const runningEvents = await getAllRunningEvents(menuId, groupId);
      console.log(runningEvents, "running events");
      //   const event = runningEvents.map(data => ({
      //     Score: data.score,
      //     ChestNo: data.ChestNo,

      //   }
      //  setGroupLeader(data.GrpLdrName);
      // ));
      const event = runningEvents.map((data) => {
        // set the group leader from each row (or just first row)
        setGroupLeader(data.GrpLdrName);
        setGroupValue(data.Group);

        return {
          Score: data.score,
          ChestNo: data.ChestNo,
        };
      });
      console.log(event, "176")
      // Step 7: Merge existing rows with event data if any
      if (runningEvents.length > 0) {
        const runningEventsMap = new Map(
          runningEvents.map((event) => [event.ChestNo, event])
        );

        const updatedRows = initialRows.map((row) => {
          const eventData = runningEventsMap.get(row.ChestNo);
          return eventData ? { ...row, ...eventData } : row;
        });

        setRows(updatedRows);
      } else {
        setRows(initialRows);
      }
    } catch (error) {
      console.error("Error fetching chest numbers or running events:", error);
      toast.error("Failed to load chest numbers or running events.");
    }
  };


  const handleGroupChange = (e) => {
    const selectedGroup = e.target.value;
    setGroupValue(selectedGroup);
    setRows([]); // Clear existing rows
    setChestNoOptions([]); // Clear chest number options
  };

  const handleGroupLeader = (e) => {
    const selectedGroup = e.target.value;
    setGroupLeader(selectedGroup);
  };

  // Rest of your handlers remain the same
  const handleInputChange = (index, name, value) => {
    const regex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)\.\d{3}$/;
    if (
      (name === "StartTime" || name === "EndTime") &&
      value.trim() !== "" &&
      !regex.test(value)
    ) {
      toast.warning("Invalid time format. Please use HH:MM:SS.SSS");
      return;
    }

    const newRows = [...rows];
    newRows[index][name] = value;

    if ((name === "StartTime" || name === "EndTime") && value) {
      const StartTime = newRows[index].StartTime;
      const EndTime = newRows[index].EndTime;
      if (StartTime && EndTime) {
        const start = new Date(`1970-01-01T${StartTime}`);
        const end = new Date(`1970-01-01T${EndTime}`);
        let durationInMilliseconds = end - start;

        if (durationInMilliseconds < 0) {
          durationInMilliseconds += 24 * 60 * 60 * 1000;
        }

        const minutes = Math.floor(durationInMilliseconds / 60000);
        const seconds = Math.floor((durationInMilliseconds % 60000) / 1000);
        const milliseconds = durationInMilliseconds % 1000;

        newRows[index].duration = `${minutes
          .toString()
          .padStart(2, "0")}:${seconds
            .toString()
            .padStart(2, "0")}.${milliseconds.toString().padStart(3, "0")}`;
      } else {
        newRows[index].duration = "";
      }
    }

    setRows(newRows);
  };

  const handleClearSignature = (index) => {
    if (sigRefs.current[index].current) {
      sigRefs.current[index].current.clear();
    }

    const newRows = [...rows];
    newRows[index].Signature = null;
    setRows(newRows);
    setAlertMessage("Signature cleared. Please redraw your signature.");
  };

  const handleSignatureEnd = (index) => {
    if (sigRefs.current[index].current) {
      const newSignature = sigRefs.current[index].current
        .getTrimmedCanvas()
        .toDataURL("image/png");

      const newRows = [...rows];
      newRows[index].Signature = newSignature;
      setRows(newRows);
      setAlertMessage("Signature updated successfully!");
    }
  };

  // Your form submission handler
  const addRunningEventData = async () => {
    const filteredRows = rows.filter(row => row.ChestNo);

    // Validate that each row has a signature and required fields filled
    for (const row of filteredRows) {
      // if (!row.Signature) {
      //   toast.warning("Please ensure all entries have a signature before submission.");
      //   return;
      // }
      // if (!row.ChestNo || !row.StartTime || !row.EndTime) {
      //   toast.warning("Please fill in all required fields before submission.");
      //   return;
      // }
      // if (title === "Shot Put" || title.toLowerCase() === "shot put") {
      //   if (!row.ChestNo || !row.distance1 || !row.distance2 || !row.distance3) {
      //     toast.warning("Please fill in all required fields before submission!");
      //     return;
      //   }
      // } else {
      //   if (!row.ChestNo /* || !row.StartTime || !row.EndTime */) {
      //     toast.warning("Please fill in all required fields before submission!");
      //     return;
      //   }
      //   if (
      //     !row.ChestNo ||
      //     (!row.StartTime && !row.EndTime)
      //   ) {
      //     toast.warning("Please fill in all required fields before submission!");
      //     return;
      //   }
      // }
    }

    const groupLeaderSignature = grpLdrSigRef.current
      ? grpLdrSigRef.current.getTrimmedCanvas().toDataURL("image/png")
      : null;
    const inchargeSignature = inchargeSigRef.current
      ? inchargeSigRef.current.getTrimmedCanvas().toDataURL("image/png")
      : null;

    const runningData = filteredRows.map((
      row, index) => ({
        ChestNo: row.ChestNo,
        barcode: row.Barcode,
        Name: row.FirstName_English,
        StartTime: row.StartTime,
        EndTime: row.EndTime,
        group: row.group,
        duration: row.duration,
        distance1: row.distance1,
        distance2: row.distance2,
        distance3: row.distance3,
        Signature: row.Signature ||
          (sigRefs.current[index].current
            ? sigRefs.current[index].current.getTrimmedCanvas().toDataURL("image/png")
            : null),
        grpLdrSignature: groupLeaderSignature,
        inchargeSignature: inchargeSignature,
        eventid: menuId,

      }));

    try {
      await addRunningEvent(runningData, groupLeader, otherLeader);
      // navigate(`/event/${menuId}`);
      navigate(-1);
    } catch (error) {
      console.error("Error submitting event data:", error);
    }
  };

  const handleDateChange = (momentObj, index, fieldName) => {
    const formattedTime = momentObj.format("HH:mm:ss.SSS");
    handleInputChange(index, fieldName, formattedTime);
  };

  const navigateAppeal = (canId, eventName, eventId) => {
    console.log(canId, "candID")
    navigate("/appeal", { state: { candidateid: canId, eventName: eventName, eventId: eventId } });
  };

  const AppealCandidate = async (canId, eventId) => {
    console.log(canId, "candID")
    console.log(eventId, "eventId")
    const data = await AddAppeal(canId, eventId)
    console.log(data, "appeal candidate")
    const runningEvents = await getAllRunningEvents(menuId, groupId);
    console.log(runningEvents, "running events");

  }

  const openPrintWindow = () => {
    const isShotPut = title.toLowerCase() === "shot put";
    const isLapEvent =
      title.toLowerCase() === "1600 meter running" ||
      title.toLowerCase() === "800 meter running";

    let tableHTML = `
    <html>
    <head>
      <title>Events</title>
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

      <h3>Event: ${title}</h3>

      <h3>Group No: ${groupValue}</h3>
      <h4>Group Leader Name: ${groupLeader ? groupLeader : ""}</h4>

      <table>
        <thead>
          <tr>
            <th>Sr No</th>
            <th>Chest No</th>
             <th>Tag No</th>
            <th>Name</th>
            ${!isShotPut ? "<th>Start Time</th>" : ""}
            ${!isShotPut ? "<th>End Time</th>" : ""}
            ${!isShotPut ? "<th>Duration</th>" : ""}
            ${isLapEvent ? "<th>Lap</th>" : ""}
            ${isShotPut ? "<th>Distance 1</th>" : ""}
            ${isShotPut ? "<th>Distance 2</th>" : ""}
            ${isShotPut ? "<th>Distance 3</th>" : ""}
         
            <th>Score</th>
            <th>Signature</th>
            <th>Group Leader Sign</th>
          </tr>
        </thead>
        <tbody>
  `;

    rows.forEach((row, index) => {
      tableHTML += `
    <tr>
      <td>${index + 1}</td>
      <td>${row.ChestNo || ""}</td>
       <td>${row.Barcode || ""}</td>
      <td>${row.Name || ""}</td>     
      ${!isShotPut ? `
      <td>${row.StartTime === "00:00:00.00" || row.StartTime === "00:00:00.000"
            ? ""
            : row.StartTime || ""
          }</td>
` : ""}

${!isShotPut ? `
  <td>${row.EndTime === "00:00:00.00" || row.EndTime === "00:00:00.000"
            ? ""
            : row.EndTime || ""
          }</td>
` : ""}
      ${!isShotPut ? `<td>${row.duration || ""}</td>` : ""}
       ${isLapEvent ? `<td>${row.Lapcount || ""}</td>` : ""}
      ${isShotPut ? `<td>${row.distance1 || ""}</td>` : ""}
      ${isShotPut ? `<td>${row.distance2 || ""}</td>` : ""}
      ${isShotPut ? `<td>${row.distance3 || ""}</td>` : ""}
      <td>${row.score ?? ""}</td>
      <td class="signature-box"></td>
      ${index === 0 ? `<td class="signature-box" rowspan="${rows.length}"></td>` : ""}
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

  const formatRawTime = (value) => {
    // remove all non-digits
    const digits = value.replace(/\D/g, "");

    let hh = digits.substring(0, 2);
    let mm = digits.substring(2, 4);
    let ss = digits.substring(4, 6);
    let ms = digits.substring(6, 8);

    let formatted = "";
    if (hh) formatted = hh;
    if (mm) formatted = `${formatted}:${mm}`;
    if (ss) formatted = `${formatted}:${ss}`;
    if (ms) formatted = `${formatted}.${ms}`;

    return formatted;
  };

  const downloadPdf = () => {
    const doc = new jsPDF("l", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(
      `Commissioner of Police ${recruitName} City`,
      pageWidth / 2,
      15,
      { align: "center" }
    );

    // Report Title
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(title, pageWidth / 2, 23, { align: "center" });

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

      doc.text(
        `Group Leader Name: ${groupLeader || ""}`,
        pageWidth / 2,
        startY,
        { align: "center" }
      );

      startY += 5; // space before table
    }

    const isShotPut = title.toLowerCase() === "shot put";
    const isLapEvent =
      title.toLowerCase() === "1600 meter running" ||
      title.toLowerCase() === "800 meter running";

    const tableColumn = [
      "Sr No",
      "Candidate Name",
      "Chest No",
      "Tag No",
      !isShotPut ? "Start Time" : "",
      !isShotPut ? "End Time" : "",
      !isShotPut ? "Duration" : "",
      isLapEvent ? "Lap" : "",
      isShotPut ? "Distance 1" : "",
      isShotPut ? "Distance 2" : "",
      isShotPut ? "Distance 3" : "",
      "Score"
    ];

    // 🔹 SORT DATA BY CHEST NO (ASC)
    const sortedData = [...rows].sort(
      (a, b) => Number(a.ChestNo) - Number(b.ChestNo)
    );

    const tableRows = sortedData.map((data, index) => ([
      index + 1,
      data.Name,
      data.ChestNo,
      data.Barcode,


      !isShotPut ? `
      ${data.StartTime === "00:00:00.00" || data.StartTime === "00:00:00.000"
          ? ""
          : data.StartTime || ""
        }
` : "",

      !isShotPut ? `
  ${data.EndTime === "00:00:00.00" || data.EndTime === "00:00:00.000"
          ? ""
          : data.EndTime || ""
        }
` : "",
      !isShotPut ? `${data.duration || ""}` : "",
      isLapEvent ? `${data.Lapcount || ""}` : "",
      isShotPut ? `${data.distance1 || ""}` : "",
      isShotPut ? `${data.distance2 || ""}` : "",
      isShotPut ? `${data.distance3 || ""}` : "",
      data.score
    ]));

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: startY + 5,
      styles: { fontSize: 8 },
      headStyles: {
        fillColor: [27, 90, 144],
        textColor: 255,
        fontStyle: "bold",
      },
    });

    doc.save(`${title}.pdf`);
  };
  // const openPrintWindow = () => {
  //   const isShotPut = title.toLowerCase() === "shot put";

  //   let tableHTML = `
  //     <html>
  //     <head>
  //       <title>Print Table</title>
  //       <style>
  //         table {
  //           width: 100%;
  //           border-collapse: collapse;
  //           font-family: Arial;
  //         }
  //         th, td {
  //           padding: 8px;
  //           border: 1px solid #000;
  //           text-align: left;
  //           font-size: 14px;
  //         }
  //         th {
  //           background: #f2f2f2;
  //         }
  //         .signature-box {
  //           height: 60px;
  //         }
  //         .print-btn {
  //           margin: 15px 0;
  //           padding: 6px 12px;
  //           border: 1px solid #000;
  //           cursor: pointer;
  //           background: #ddd;
  //           font-size: 14px;
  //         }

  //       </style>
  //     </head>
  //     <body>
  //       <button class="print-btn" onclick="window.print()">Print</button>

  //       <h3>Event Result</h3>

  //       <table>
  //         <thead>
  //           <tr>
  //             <th>Sr No</th>
  //             <th>Chest Number</th>
  //             <th>Name</th>
  //             ${!isShotPut ? "<th>Start Time</th>" : ""}
  //             ${!isShotPut ? "<th>End Time</th>" : ""}
  //             ${!isShotPut ? "<th>Duration</th>" : ""}
  //             <th>Score</th>
  //             <th>Signature</th>
  //           </tr>
  //         </thead>
  //         <tbody>
  //   `;

  //   rows.forEach((row, index) => {
  //     tableHTML += `
  //       <tr>
  //         <td>${index + 1}</td>
  //         <td>${row.ChestNo || ""}</td>
  //         <td>${row.Name || ""}</td>
  //         ${!isShotPut ? `<td>${row.StartTime || ""}</td>` : ""}
  //         ${!isShotPut ? `<td>${row.EndTime || ""}</td>` : ""}
  //         ${!isShotPut ? `<td>${row.duration || ""}</td>` : ""}
  //         <td>${row.score || ""}</td>

  //         <!-- BLANK SIGNATURE ROW -->
  //         <td class="signature-box"></td>
  //       </tr>
  //     `;
  //   });

  //   tableHTML += `
  //         </tbody>
  //       </table>
  //     </body>
  //     </html>
  //   `;

  //   const printWindow = window.open("", "_blank", "width=900,height=700");
  //   printWindow.document.open();
  //   printWindow.document.write(tableHTML);
  //   printWindow.document.close();
  // };

  return (

    <>

      <style>
        {`
         @media print {
      body * {
        visibility: hidden;
      }

      #section-to-print, #section-to-print * {
        visibility: visible;
      }

      #section-to-print {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
      }

      /* Hide the action column */
      .clear-button {
        display: none !important; /* Hide Clear button */
      }

      .print-section {
        display: none !important; /* Hide Action button */
      }
        .submit-button , .appeal-button{
        display: none !important; /* Hide Submit button */
      }
.table-responsive {
    overflow: visible; /* Remove scrolling for print */
    display: block; /* Ensure table fits properly */
    width: 100%; /* Ensure full width */
  }
     .col-lg-4,
  .col-md-4 {
    width: 60%; /* Adjusted width for signature field */
  }

  .col-lg-1,
  .col-md-1 {
    display: none; /* Hide the Clear button column */
  }
    }
    @media print and (orientation: portrait) {
      body * {
        visibility: hidden;
      }

      #section-to-print, #section-to-print * {
        visibility: visible;
      }

      #section-to-print {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
      }
      .row {
        display: flex;
        flex-wrap: wrap;
      }
     .col-lg-3,
     .col-md-3 {
      width: 25%; /* Smaller width for label */
     }
      .col-lg-4 .col-md-4 {
        width: 100%;
      }
      .col-lg-8 .col-md-8 {
        width: 66.666667%;
        margin-top: 0;
      }
      .col-lg-5 .col-md-5 {
        width: 41.666667%;
      }
      .col-lg-7 .col-md-7 {
        width: 58.333333%;
      }
    }

    @media print and (orientation: landscape) {
      body * {
        visibility: hidden;
      }

      #section-to-print, #section-to-print * {
        visibility: visible;
      }

      #section-to-print {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
      }
 
      .row {
        display: flex;
        flex-wrap: wrap;
      }

      .col-lg-4 .col-md-4 {
        width: 25%;
      }

      .col-lg-8 .col-md-8 {
        width: 75%;
        margin-top: 0;
      }

      .col-lg-5 .col-md-5 {
        width: 45%;
      }

      .col-lg-7 .col-md-7 {
        width: 55%;
      }

      .col-lg-3 .col-md-3 {
        width: 45%;
      }
     
    }
.custom-datetime-picker {
  position: relative;
  z-index: 1050; /* Ensure it's above other elements */
}

.rdtPicker {
  z-index: 9999 !important; /* Ensure it's visible above other elements */
  position: absolute !important;
  top: 100% !important;
  left: 0 !important;
  width: auto !important;
  min-width: 200px; /* Adjust width */
  background: white;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);
  border-radius: 4px;
}
.rdtPicker .rdtTime {
  overflow: visible !important; /* Prevent scrollbar from appearing */
}
  `}
      </style>
      <div className="container-fluid" id="section-to-print">
        <div
          className="card m-3"
          style={{ boxShadow: "0px 1px 5px rgba(0, 0, 0, 0.1)" }}
        >
          <div className="row">
            <div className="col-lg-12">
              <div className="card-header">
                <div className="row align-items-center">
                  <div className="col-lg-8 col-md-8 col-7">
                    <h4 className="card-title fw-bold py-2">{title}</h4>
                  </div>
                  <div className="col-lg-4 col-md-4 col-5 d-flex justify-content-end print-section">
                    <button className="btn me-2" style={headerCellStyle} /* onClick={() => window.print()} */ onClick={downloadPdf}>Pdf</button>
                    <button className="btn me-2" style={headerCellStyle} /* onClick={() => window.print()} */ onClick={openPrintWindow}>Print</button>
                    <button className="btn" style={headerCellStyle} onClick={() => navigate(-1)}>  <ArrowBack /></button>
                  </div>
                </div>
              </div>
              <div className="card-body pt-3">
                {
                  // groupId ? "" : 
                  <div className="row">
                    <div className="col-lg-3">
                      <label htmlFor="group" className="fw-bold">
                        Group
                      </label>
                    </div>
                    <div className="col-lg-3 mt-lg-0 mt-3">
                      <select
                        className="form-select"
                        name="group"
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

                }
                <div className="row mt-3">
                  <div className="col-lg-3">
                    <label htmlFor="group" className="fw-bold">
                      Group Leader
                    </label>
                  </div>
                  <div className="col-lg-3 mt-lg-0 mt-3">
                    <select
                      className="form-select"
                      name="group"
                      value={groupLeader}
                      onChange={handleGroupLeader}
                    >
                      <option value="" disabled>
                        Select Group Leader
                      </option>

                      {allGroupLeader.map((data) => (
                        <option key={data.um_id} value={data.um_staffname}>
                          {data.um_staffname}
                        </option>
                      ))}

                      {/* Add this */}

                    </select>

                  </div>
                  <div className="col-lg-3 mt-lg-0">
                    {groupLeader === "Other" && (
                      <input
                        type="text"
                        className="form-control mt-2"
                        placeholder="Enter group leader name"
                        value={otherLeader}
                        onChange={(e) => setOtherLeader(e.target.value)}
                      />
                    )}


                  </div>
                </div>
                {/* <div className="table-responsive"> */}

                <Table striped hover className="border text-left mt-4" >
                  <thead>
                    <tr>
                      <th style={headerCellStyle}>Chest No</th>
                      <th style={headerCellStyle}>Tag No</th>

                      <th style={headerCellStyle}>Name</th>
                      {/* {title !== "Shot Put" || title.toLowerCase() !== "shot put" && (
                      <th style={headerCellStyle}>Start Time</th>)} */}
                      {title.toLowerCase() !== "shot put" && (
                        <th style={headerCellStyle}>Start Time</th>
                      )}
                      {title.toLowerCase() !== "shot put" && (
                        <th style={headerCellStyle}>End Time</th>)}


                      {title === "Shot Put" || title.toLowerCase() === "shot put" ? (
                        <>
                          <th style={headerCellStyle}>
                            Distance 1
                          </th>
                          <th style={headerCellStyle}>
                            Distance 2
                          </th>
                          <th style={headerCellStyle}>
                            Distance 3
                          </th>
                        </>
                      ) : (
                        <>
                          <th style={headerCellStyle}>
                            Duration
                          </th>

                        </>
                      )
                      }
                      {
                        title === "1600 Meter Running" || title === "800 Meter Running" ? <th style={headerCellStyle}>Lap</th> : null
                      }

                      <th style={headerCellStyle} className="d-none">Signature</th>
                      <th style={headerCellStyle} className="clear-button d-none">Action</th>
                      <th style={headerCellStyle} className="clear-button">Score</th>
                      <th scope="col" className="appeal-button" style={headerCellStyle}>Appeal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, index) => (
                      <tr key={index}>
                        <td className="py-3">
                          <input
                            type="text"
                            value={row.ChestNo || ""}
                            onChange={(e) => handleInputChange(e, index)}
                            placeholder="Enter Chest Number"
                            className="form-control"
                            disabled
                          />
                        </td>
                        <td className="py-4">{row.Barcode}</td>
                        <td className="py-4">{row.Name}</td>
                        {title.toLowerCase() !== "shot put" && (
                          <td className="py-3">
                            {/* <Datetime
                              dateFormat={false}
                              timeFormat="HH:mm:ss.SSS"
                              value={row.StartTime}
                              onChange={(momentObj) => handleDateChange(momentObj, index, "StartTime")}
                              style={{ overflow: "auto" }}
                              inputProps={{
                                disabled: row.Status === "False" || (row.score && row.Status !== "True"),
                                style: { overflow: "auto" }
                              }}
                            /> */}
                            <Datetime
                              dateFormat={false}
                              timeFormat="HH:mm:ss.SSS"
                              // value={row.StartTime}
                              value={row.StartTime === "00:00:00.000" ? null : row.StartTime}
                              onChange={(momentObj) =>
                                handleDateChange(momentObj, index, "StartTime")
                              }
                              // inputProps={{
                              //   readOnly: true,   // ✅ keyboard typing disabled
                              //   disabled:
                              //     row.Status === "False" ||
                              //     (row.score && row.Status !== "True"),
                              //   style: { overflow: "auto" }
                              // }}
                              inputProps={{
                                readOnly: true,   // ✅ no keyboard typing
                                onKeyDown: (e) => e.preventDefault(), // extra safety
                                disabled:
                                  row.Status === "False" ||
                                  (row.score !== null && row.score !== undefined && row.Status !== "True"),
                                style: { overflow: "auto" }
                              }}
                            // inputProps={{
                            //   readOnly: true, // keyboard typing disabled
                            //   disabled: !(
                            //     (!row.StartTime || row.StartTime === "00:00:00.00" || row.StartTime === "00:00:00.000") &&
                            //     (!row.EndTime || row.EndTime === "00:00:00.00" || row.EndTime === "00:00:00.000") &&
                            //     (!row.Duration)
                            //   ) && (
                            //       row.Status === "False" ||
                            //       (row.score && row.Status !== "True")
                            //     ),
                            //   style: { overflow: "auto" }
                            // }}
                            />
                            {/* <Datetime
                              dateFormat={false}
                              timeFormat="HH:mm:ss.SSS"
                              value={row.StartTime}
                              renderInput={(props, openCalendar) => {
                                return (
                                  <input
                                    {...props}
                                    onChange={(e) => {
                                      const formatted = formatRawTime(e.target.value);
                                      props.onChange(formatted); // update input UI
                                      handleDateChange(moment(formatted, "HH:mm:ss.SSS"), index, "StartTime");
                                    }}
                                    disabled={row.Status === "False" || (row.score && row.Status !== "True")}
                                    style={{ width: "100%" }}
                                  />
                                );
                              }}
                            /> */}
                          </td>
                        )}
                        {title.toLowerCase() !== "shot put" && (
                          <td className="py-3">
                            {/* <Datetime
                              dateFormat={false}
                              timeFormat="HH:mm:ss.SSS"
                              value={row.EndTime}
                              onChange={(momentObj) => handleDateChange(momentObj, index, "EndTime")}
                              className="custom-datetime"
                              style={{ overflow: "auto" }}
                              inputProps={{
                                disabled: row.Status === "False" || (row.score && row.Status !== "True"),
                                style: { overflow: "auto" }
                              }}
                            /> */}
                            <Datetime
                              dateFormat={false}
                              timeFormat="HH:mm:ss.SSS"
                              // value={row.EndTime}
                              value={row.EndTime === "00:00:00.000" ? null : row.EndTime}
                              onChange={(momentObj) =>
                                handleDateChange(momentObj, index, "EndTime")
                              }
                              className="custom-datetime"
                              inputProps={{
                                readOnly: true,   // ✅ no keyboard typing
                                onKeyDown: (e) => e.preventDefault(), // extra safety
                                disabled:
                                  row.Status === "False" ||
                                  (row.score !== null && row.score !== undefined && row.Status !== "True"),
                                style: { overflow: "auto" }
                              }}

                            />
                          </td>
                        )}
                        {title === "Shot Put" || title.toLowerCase() === "shot put" ? (
                          <>
                            <td className="py-3">
                              <input
                                name="distance1"
                                type="text"
                                className="form-control"
                                placeholder="Enter Distance"
                                value={row.distance1}
                                // disabled={!!row.distance1}
                                disabled={
                                  row.Status === "False"
                                    ? true
                                    : row.Status === "True"
                                      ? false
                                      : row.score != null
                                }
                                onChange={(e) => {
                                  const inputValue = e.target.value;
                                  if (/^\d*\.?\d*$/.test(inputValue)) { // Allow only numbers and one decimal
                                    handleInputChange(index, "distance1", inputValue);
                                  }
                                }}
                              />
                            </td>
                            <td className="py-3">
                              <input
                                name="distance2"
                                type="text"
                                className="form-control"
                                placeholder="Enter Distance"
                                value={row.distance2}
                                disabled={
                                  row.Status === "False"
                                    ? true
                                    : row.Status === "True"
                                      ? false
                                      : row.score != null
                                }
                                // onChange={(e) => handleInputChange(index, "distance2", e.target.value)}
                                onChange={(e) => {
                                  const inputValue = e.target.value;
                                  if (/^\d*\.?\d*$/.test(inputValue)) { // Allow only numbers and one decimal
                                    handleInputChange(index, "distance2", inputValue);
                                  }
                                }}
                              />
                            </td>
                            <td className="py-3">
                              <input
                                name="distance3"
                                type="text"
                                className="form-control"
                                placeholder="Enter Distance"
                                value={row.distance3}
                                disabled={
                                  row.Status === "False"
                                    ? true
                                    : row.Status === "True"
                                      ? false
                                      : row.score != null
                                }
                                // onChange={(e) => handleInputChange(index, "distance3", e.target.value)}
                                onChange={(e) => {
                                  const inputValue = e.target.value;
                                  if (/^\d*\.?\d*$/.test(inputValue)) { // Allow only numbers and one decimal
                                    handleInputChange(index, "distance3", inputValue);
                                  }
                                }}
                              />
                            </td>
                          </>

                        ) : (
                          <td className="py-3">
                            <input
                              name="duration"
                              type="text"
                              className="form-control"
                              placeholder="Enter Duration"
                              value={row.duration}
                              disabled={
                                row.Status === "False"
                                  ? true
                                  : row.Status === "True"
                                    ? false
                                    : row.score != null
                              }

                              onChange={(e) => handleInputChange(index, "duration", e.target.value)}
                            />
                          </td>
                        )}
                        {/* <td className="">
                            <div className="border border-dark bg-white" style={{ height: "75px", width: "200px" }}>
                              {row.Signature ? (
                                <img src={row.Signature} alt={`Signature ${index}`} style={{ paddingLeft: "40px", paddingTop: "20px" }} />
                              ) : (
                                <SignatureCanvas
                                  ref={sigRefs.current[index]}
                                  penColor="black"
                                  canvasProps={{
                                    width: 200,
                                    height: 100,
                                    className: "sigCanvas",
                                  }}
                                  onEnd={() => handleSignatureEnd(index)}
                                />
                              )}
                            </div>
                          </td> */}
                        {
                          title === "1600 Meter Running" || title === "800 Meter Running" ? <td className="py-4">{row.Lapcount}</td> : null
                        }
                        <td className="d-none">
                          <div
                            className="border border-dark bg-white"
                            style={{ height: "75px", width: "200px", overflow: "hidden" }} // Prevent scrolling
                          >
                            {row.Signature ? (
                              <img
                                src={row.Signature}
                                alt={`Signature ${index}`}
                                style={{ paddingLeft: "40px", paddingTop: "20px" }}
                              />
                            ) : (
                              <SignatureCanvas
                                ref={sigRefs.current[index]}
                                penColor="black"
                                canvasProps={{
                                  width: 200,
                                  height: 100,
                                  className: "sigCanvas",
                                }}
                                onEnd={() => handleSignatureEnd(index)}
                              />
                            )}
                          </div>
                        </td>
                        <td className="py-3 clear-button d-none">
                          <Button variant="secondary" onClick={() => handleClearSignature(index)}>
                            Clear
                          </Button>
                        </td>
                        <td className="py-4">{row.score}</td>
                        <td>
                          {/* <button className="btn btn-success btn-sm mt-2 appeal-button" onClick={() => navigateAppeal(row.CandidateID, row.EventName, row.EventId)}>Appeal</button> */}
                          {/* <button
                            className="btn btn-success btn-sm mt-2 appeal-button"
                            onClick={() =>
                              // navigateAppeal(row.CandidateID, row.EventName, row.EventId)
                              AppealCandidate(row.CandidateID, row.EventId)
                            }
                            disabled={row.NoOfAttemp >= 2}
                          >

                            {
                              row.Status === "True"
                                ? "Appeal Approved"
                                : row.Status === "False" && row.Remark === "Applied"
                                  ? "Appeal Applied"
                                  : "Appeal"
                            }
                          </button> */}
                          <button
                            className={`btn btn-sm mt-2 appeal-button ${row.Status === "True"
                              ? "btn-success"
                              : (row.Status === "False" || row.Status === null) && row.Remark === "Applied"
                                ? "btn-secondary"
                                : "btn-primary"
                              }`}
                            onClick={() => AppealCandidate(row.CandidateID, row.EventId)}
                          // disabled={Number(row.NoOfAttemp) > 1}
                          >
                            {/* {
                              row.Status === "True"
                                ? "Appeal Approved"
                                : row.Status === "False" && row.Remark === "Applied"
                                  ? "Appeal Applied"
                                  : "Appeal"
                            } */}
                            {
                              row.Status === "True"
                                ? "Appeal Approved"
                                : (row.Status === "False" || row.Status === null) &&
                                  row.Remark === "Applied"
                                  ? "Appeal Applied"
                                  : "Appeal"
                            }
                          </button>

                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                {/* </div> */}
                {rows && rows.length > 0 ? (
                  <div className="row mb-3 mt-3 d-none">
                    <div className="col-lg-3 col-md-3">
                      <label className="fw-bold">Group Leader Signature:</label>
                    </div>

                    <div className="col-lg-4 col-md-4">
                      <div
                        className="border border-dark bg-white"
                        style={{ height: "75px", width: "200px" }}
                      >
                        <SignatureCanvas
                          ref={grpLdrSigRef}
                          penColor="black"
                          canvasProps={{
                            width: 200,
                            height: 75,
                            className: "sigCanvas leader-sign",
                          }}
                        />
                      </div>
                    </div>

                    <div className="col-lg-1 col-md-1 clear-button d-none">
                      <Button
                        variant="secondary"
                        onClick={() =>
                          grpLdrSigRef.current && grpLdrSigRef.current.clear()
                        }
                      >
                        Clear
                      </Button>
                    </div>
                  </div>
                ) : null}

                {
                  rows && rows.length > 0 ?
                    <div className="row mb-3 d-none">
                      <div className="col-lg-3 col-md-3">
                        <label className="fw-bold">Event Incharge Signature:</label>
                      </div>
                      <div className="col-lg-4 col-md-4">
                        <div
                          className="border border-dark bg-white"
                          style={{ height: "75px", width: "200px" }}
                        >
                          <SignatureCanvas
                            ref={inchargeSigRef}
                            penColor="black"
                            canvasProps={{
                              width: 200,
                              height: 75,
                              className: "sigCanvas",
                            }}
                          />
                        </div>
                      </div>
                      <div className="col-lg-1 col-md-1 clear-button d-none">
                        <Button
                          variant="secondary"
                          onClick={() =>
                            inchargeSigRef.current && inchargeSigRef.current.clear()
                          }
                        >
                          Clear
                        </Button>
                      </div>
                    </div>
                    : null
                }
                {
                  rows && rows.length > 0 ?
                    <Button
                      style={{ backgroundColor: "rgb(10, 4, 60)" }}
                      onClick={addRunningEventData}
                      className="mt-3 submit-button"
                    >
                      Submit
                    </Button>
                    : null
                }

              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Event_Form;
