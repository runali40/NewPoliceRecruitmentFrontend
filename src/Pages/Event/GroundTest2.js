import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { Delete } from "@material-ui/icons";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import Select from "react-select";
import { apiClient } from "../../apiClient";
import Cookies from 'js-cookie';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import ErrorHandler from "../../Components/ErrorHandler";
import { getAllCategoryMasterData } from "../../Components/Api/CategoryMasterApi";
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const GroundTest2 = () => {
    const navigate = useNavigate();
    const [AllData, setAllData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [allFilteredData, setAllFilteredData] = useState([]);
    const [filterText, setFilterText] = useState("");
    const [totalRows, setTotalRows] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [eventList, setEventList] = useState([])
    const [allCast, setAllCast] = useState([])
    const RoleName = localStorage.getItem("RoleName");
    const [isOpen, setIsOpen] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);
    const [options, setOptions] = useState([])
    const [categoryName, setCategoryName] = useState("");
    const [allCategoryName, setAllCategoryName] = useState("")
    const recruitName = localStorage.getItem("recruitName");
    const [selectAll, setSelectAll] = useState(false);
    const [catName, setCatName] = useState("");
    const [savedData, setSavedData] = useState([])
    const [actionRow, setActionRow] = useState(false)
    const [castStatus, setCastStatus] = useState(false)
    const [meritWiseLength, setMeritWiseLength] = useState("")
    const [castWiseLength, setCastWiseLength] = useState("")



    useEffect(() => {
        const fetchData = async () => {
            try {
                // Step 1: Await the completion of GetAllDataGround
                console.log("Fetching data from GetAllDataGround...");
                // await GetAllDataGround();
                // await GetAllData();
                await GetAllMeritData();

                console.log("Completed: GetAllDataGround");

                // Step 2: After GetAllDataGround has resolved, call getCategoryName

                // await getAllParameterValueMasterData();    
                // console.log("Completed: getAllParameterValueMasterData");

                console.log("Fetching category name...");
                await getCategoryName();
                console.log("Completed: getCategoryName");

            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);


    const getCategoryName = () => {
        const recruitId = localStorage.getItem("recruitId");
        const UserId = localStorage.getItem("userId");
        return apiClient({
            method: "get",
            url: `CategoryDocPrivilege/GetCategoryName`,
            params: {
                UserId: UserId,
                RecruitId: recruitId,
            },
        })
            .then((response) => {
                console.log("response all category name", response.data.data);
                const temp = response.data.data;
                const options = temp.map((data) => ({
                    value: data.id,
                    label: data.CategoryName,
                }));
                setAllCategoryName(options);
                const token1 = response.data.outcome.tokens;
                Cookies.set("UserCredential", token1, { expires: 7 });
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

    // const handleCategoryName = async (selected) => {
    //   setCategoryName(selected);
    //   console.log(categoryName, "89")
    // };
    const handleCategoryName = async (selected) => {
        try {
            setCategoryName(selected); // Set the selected category early
            const recruitId = localStorage.getItem("recruitId");
            const UserId = localStorage.getItem("userId");
            apiClient({
                method: "get",
                url: `Candidate/GetAllValueGround`.toString(),
                params: {
                    userId: UserId,
                    RecruitId: recruitId,
                    Category: categoryName.value,
                    Groundtestdata1: "",
                },
            })
                .then((response) => {

                    const dataWithAge = response.data.data.data.map((categoryData) => {
                        const formattedItems = categoryData.items.map((item, index) => ({

                            ApplicationNo: item.ApplicationNo || "",
                            CandidateID: item.CandidateID || 0,
                            FullNameDevnagari: item.FullNameDevnagari || "",
                            FullNameEnglish: item.FullNameEnglish || "",
                            DOB: item.DOB || "", // Assuming DOB is mapped from your data structure
                            Cast: item.Cast || "",
                            Category: item.Category || "",
                            gender: item.gender || "",
                            chestno: item.chestno || "",
                            HundredMeterRunning: item["100 Meter Running"] || 0,
                            SixteenHundredMeterRunning: item["1600 Meter Running"] || 0,
                            eightHundredMeterRunning: item["800 Meter Running"] || 0,
                            ShotPut: item["ShotPut"] || 0,
                            age: calculateAge(item.DOB), // Adding age here
                            TotalScore: item.TotalScore,
                            SequenceID: (index + 1).toString() || item.SequenceID,
                        }));

                        // Set saved data if needed (will only set last category's items)
                        setSavedData(formattedItems);

                        return {
                            ...categoryData,
                            items: categoryData.items.map((item) => ({
                                ...item,
                                age: calculateAge(item.DOB),

                            })),
                        };
                    });
                    // setAllData(dataWithAge);
                    setCatName(response.data.data.data[0].category)
                    // console.log(response.data.data.data.value.data, "94")
                    console.log(response.data.data.eventlist.value.data, "94")
                    setEventList(response.data.data.eventlist.value.data)
                    setAllData(dataWithAge);
                    updateFilteredData(dataWithAge, 1, itemsPerPage); // Initialize with first page data
                    setAllFilteredData(dataWithAge); // Initialize all filtered data
                    const token1 = response.data.outcome.tokens;
                    console.log(response.data.outcome.tokens, "102");
                    Cookies.set("UserCredential", token1, { expires: 7 });
                })
                .catch((error) => {
                    if (error.response && error.response.data && error.response.data.outcome) {
                        const token1 = error.response.data.data.value.outcome.tokens;
                        Cookies.set("UserCredential", token1, { expires: 7 });
                    }
                    console.log(error);
                    // const errors = ErrorHandler(error);
                    // toast.error(errors);
                });

        } catch (error) {
            console.error("Error fetching data:", error);

        }
    };


    const GetCastwiseCandidate = (castId) => {
        const recruitId = localStorage.getItem("recruitId");
        const UserId = localStorage.getItem("userId");
        console.log(options, "97");

        const castIdString = Array.isArray(castId) ? castId.join(",") : castId.toString();

        return apiClient({
            method: "get",
            url: `Candidate/GetCastwiseCandidate`,
            params: {
                UserId: UserId,
                RecruitId: recruitId,
                Category: categoryName.value,
                CastId: castIdString,
                Groundtestdata1: ""
            },
        })
            .then((response) => {
                console.log("response all category name", response.data.data);
                // const temp = response.data.data;
                // console.log(temp.length, "122");

                // Clear the eventList before setting new data
                setEventList([]);

                // Set the new data in eventList
                // setEventList(temp);
                setEventList(response.data.data.eventlist.value.data)
                const dataWithAge = response.data.data.data.value.data.map((item) => ({
                    ...item,
                    age: calculateAge(item.DOB),
                }));
                setAllData(dataWithAge);

                updateFilteredData(dataWithAge, 1, itemsPerPage); // Initialize with first page data
                setAllFilteredData(dataWithAge);
                const token1 = response.data.outcome.tokens;
                Cookies.set("UserCredential", token1, { expires: 7 });
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


    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    // const handleDragEnd = (result, droppableId) => {
    //     const { source, destination } = result;

    //     // Check if the item was dropped outside a valid destination
    //     if (!destination) return;

    //     // Clone the data to avoid mutating the original state
    //     const updatedData = [...AllData];
    //     const categoryIndex = parseInt(droppableId, 10);
    //     const items = Array.from(updatedData[categoryIndex].items);

    //     // Reorder the items within the selected category
    //     const [movedItem] = items.splice(source.index, 1);
    //     items.splice(destination.index, 0, movedItem);

    //     // Reset SequenceID to start from 1 in the new order
    //     const reorderedItems = items.map((item, index) => ({
    //         ...item,
    //         SequenceID: (index + 1).toString(), // Set SequenceID starting from 1
    //     }));

    //     // Update the category data in AllData
    //     updatedData[categoryIndex].items = reorderedItems;
    //     setAllData(updatedData); // Update state with reordered data
    //     console.log(AllData, "267")
    //     // Format the items as needed for setSavedData
    //     const formattedItems = reorderedItems.map((item) => ({
    //         ApplicationNo: item.ApplicationNo || "",
    //         CandidateID: item.CandidateID || 0,
    //         FullNameDevnagari: item.FullNameDevnagari || "",
    //         FullNameEnglish: item.FullNameEnglish || "",
    //         DOB: item.DOB || "",
    //         Cast: item.Cast || "",
    //         Category: item.Category || "",
    //         gender: item.gender || "",
    //         chestno: item.chestno || "",
    //         HundredMeterRunning: item["100 Meter Running"] || 0,
    //         SixteenHundredMeterRunning: item["1600 Meter Running"] || 0,
    //         eightHundredMeterRunning: item["800 Meter Running"] || 0,
    //         ShotPut: item.ShotPut || 0,
    //         age: calculateAge(item.DOB),
    //         TotalScore: item.TotalScore,
    //         SequenceID: item.SequenceID,
    //     }));

    //     // Update saved data with formatted items
    //     setSavedData((prevData) => {
    //         const newData = [...prevData];
    //         newData[categoryIndex].items = formattedItems;
    //         return newData;
    //     });
    // };
    // const handleDragEnd = (result, droppableId) => {
    //     const { source, destination } = result;

    //     // Check if the item was dropped outside a valid destination
    //     if (!destination) return;

    //     // Clone the data to avoid mutating the original state
    //     const updatedData = [...AllData];
    //     const categoryIndex = parseInt(droppableId, 10);
    //     const items = Array.from(updatedData[categoryIndex].items);

    //     // Reorder the items within the selected category
    //     const [movedItem] = items.splice(source.index, 1);
    //     items.splice(destination.index, 0, movedItem);

    //     // Reset SequenceID to start from 1 in the new order
    //     const reorderedItems = items.map((item, index) => ({
    //         ...item,
    //         SequenceID: (index + 1).toString(), // Set SequenceID starting from 1
    //     }));

    //     // Update the category data in AllData
    //     updatedData[categoryIndex].items = reorderedItems;
    //     setAllData(updatedData); // Update state with reordered data

    //     // Format the items as needed for setSavedData
    //     const formattedItems = reorderedItems.map((item) => ({
    //         ApplicationNo: item.ApplicationNo || "",
    //         CandidateID: item.CandidateID || 0,
    //         FullNameDevnagari: item.FullNameDevnagari || "",
    //         FullNameEnglish: item.FullNameEnglish || "",
    //         DOB: item.DOB || "",
    //         Cast: item.Cast || "",
    //         Category: item.Category || "",
    //         gender: item.gender || "",
    //         chestno: item.chestno || "",
    //         HundredMeterRunning: item["100 Meter Running"] || 0,
    //         SixteenHundredMeterRunning: item["1600 Meter Running"] || 0,
    //         eightHundredMeterRunning: item["800 Meter Running"] || 0,
    //         ShotPut: item.ShotPut || 0,
    //         age: calculateAge(item.DOB),
    //         TotalScore: item.TotalScore,
    //         SequenceID: item.SequenceID,
    //     }));

    //     // Update saved data with formatted items
    //     setSavedData((prevData) => {
    //         const newData = [...prevData];
    //         newData[categoryIndex].items = formattedItems;
    //         return newData;
    //     });
    // };
    // const handleDragEnd = (result) => {
    //     const { source, destination, draggableId } = result;

    //     // Check if the item was dropped outside a valid destination
    //     if (!destination) return;

    //     // Extract the group index from droppableId
    //     const groupIndex = parseInt(result.source.droppableId.split('-')[1], 10);

    //     if (isNaN(groupIndex)) {
    //         console.error("Invalid droppableId:", result.source.droppableId);
    //         return;
    //     }

    //     const updatedData = [...AllData];
    //     const group = updatedData[groupIndex];

    //     if (!group || !group.items) {
    //         console.error("Invalid group or items:", group);
    //         return;
    //     }

    //     const items = Array.from(group.items);

    //     // Reorder the items within the group
    //     const [movedItem] = items.splice(source.index, 1);
    //     items.splice(destination.index, 0, movedItem);

    //     // Reset SequenceID to start from 1 in the new order
    //     group.items = items.map((item, index) => ({
    //         ...item,
    //         SequenceID: (index + 1).toString(),
    //     }));

    //     setAllData(updatedData); // Update state
    //     // const formattedItems = reorderedItems.map((item) => ({
    //     //     ApplicationNo: item.ApplicationNo || "",
    //     //     CandidateID: item.CandidateID || 0,
    //     //     FullNameDevnagari: item.FullNameDevnagari || "",
    //     //     FullNameEnglish: item.FullNameEnglish || "",
    //     //     DOB: item.DOB || "",
    //     //     Cast: item.Cast || "",
    //     //     Category: item.Category || "",
    //     //     gender: item.gender || "",
    //     //     chestno: item.chestno || "",
    //     //     HundredMeterRunning: item["100 Meter Running"] || 0,
    //     //     SixteenHundredMeterRunning: item["1600 Meter Running"] || 0,
    //     //     eightHundredMeterRunning: item["800 Meter Running"] || 0,
    //     //     ShotPut: item.ShotPut || 0,
    //     //     age: calculateAge(item.DOB),
    //     //     TotalScore: item.TotalScore,
    //     //     SequenceID: item.SequenceID,
    //     // }));

    //     // // Update saved data with formatted items
    //     // setSavedData((prevData) => {
    //     //     const newData = [...prevData];
    //     //     newData[categoryIndex].items = formattedItems;
    //     //     return newData;
    //     // });
    // };
    // const handleDragEnd = (result) => {
    //   const { source, destination } = result;

    //   // If no destination, do nothing
    //   if (!destination) return;

    //   // If source and destination are the same, do nothing
    //   if (
    //     source.droppableId === destination.droppableId &&
    //     source.index === destination.index
    //   ) {
    //     return;
    //   }

    //   // Clone data to avoid mutations
    //   const updatedData = [...AllData];

    //   // Source and destination tables
    //   const sourceTable = updatedData[source.droppableId].items;
    //   const destinationTable = updatedData[destination.droppableId].items;

    //   // Remove the dragged item from the source table
    //   const [movedItem] = sourceTable.splice(source.index, 1);

    //   // Add the dragged item to the destination table at the specified position
    //   destinationTable.splice(destination.index, 0, movedItem);

    //   // Update the state with the new data
    //   setAllData(updatedData);

    // };

    // const handleDragEnd = (result, droppableId) => {
    //     const { source, destination } = result;

    //     // If no destination (dropped outside a droppable area), exit
    //     if (!destination) return;

    //     const updatedData = [...AllData];
    //     console.log(updatedData, "updated data")
    //     const categoryIndex = parseInt(droppableId, 10); // Convert droppableId to number
    //     console.log(categoryIndex, "category index")
    //     const items = Array.from(updatedData[categoryIndex].meritList);
    //     console.log(items, "items")

    //     // Reorder items
    //     const [movedItem] = items.splice(source.index, 1);
    //     console.log( [movedItem],"455")
    //     items.splice(destination.index, 0, movedItem);
    //     console.log(items.splice(destination.index, 0, movedItem), "457")

    //     // Reset SequenceID and reassign indexes
    //     const reorderedItems = items.map((item, index) => ({
    //         ...item,
    //         SequenceID: index + 1, // Set SequenceID starting from 1
    //     }));

    //     // Update the category data
    //     updatedData[categoryIndex].items = reorderedItems;
    //     setAllData(updatedData);

    //     // Update saved data with the reordered structure
    //     setSavedData((prevData) => {
    //         const newData = [...prevData];
    //         newData[categoryIndex].items = reorderedItems.map((item) => ({
    //             ApplicationNo: item.ApplicationNo || "",
    //             CandidateID: item.CandidateID || 0,
    //             FullNameDevnagari: item.FullNameDevnagari || "",
    //             FullNameEnglish: item.FullNameEnglish || "",
    //             DOB: item.DOB || "",
    //             Cast: item.Cast || "",
    //             Category: item.Category || "",
    //             gender: item.gender || "",
    //             chestno: item.chestno || "",
    //             HundredMeterRunning: item["100 Meter Running"] || 0,
    //             SixteenHundredMeterRunning: item["1600 Meter Running"] || 0,
    //             eightHundredMeterRunning: item["800 Meter Running"] || 0,
    //             ShotPut: item.ShotPut || 0,
    //             age: calculateAge(item.DOB),
    //             TotalScore: item.TotalScore,
    //             SequenceID: item.SequenceID,
    //         }));
    //         return newData;
    //     });
    // };

    const handleDragEnd = (result, droppableId) => {
        const { source, destination } = result;

        // Check if the item was dropped outside a valid destination
        if (!destination) return;

        // Clone the data to avoid mutating the original state
        const updatedData = [...AllData];
        const categoryIndex = parseInt(droppableId, 10);
        const items = Array.from(updatedData[categoryIndex].meritList);

        // Reorder the items within the selected category
        const [movedItem] = items.splice(source.index, 1);
        items.splice(destination.index, 0, movedItem);

        // Reset SequenceID to start from 1 in the new order
        const reorderedItems = items.map((item, index) => ({
            ...item,
            SequenceID: (index + 1).toString(), // Set SequenceID starting from 1
        }));

        // Update the category data in AllData
        updatedData[categoryIndex].items = reorderedItems;
        setAllData(updatedData); // Update state with reordered data

        // Format the items as needed for setSavedData
        const formattedItems = reorderedItems.map((item) => ({
            ResulType: item.ResulType || "",
            ApplicationNo: item.ApplicationNo || "",
            CandidateID: item.CandidateID || 0,
            FullNameDevnagari: item.FullNameDevnagari || "",
            FullNameEnglish: item.FullNameEnglish || "",
            DOB: item.DOB || "",
            Cast: item.Cast || "",
            Category: item.Category || "",
            gender: item.gender || "",
            chestno: item.chestno || "",
            HundredMeterRunning: item["100 Meter Running"] || 0,
            SixteenHundredMeterRunning: item["1600 Meter Running"] || 0,
            eightHundredMeterRunning: item["800 Meter Running"] || 0,
            ShotPut: item.ShotPut || 0,
            age: calculateAge(item.DOB),
            TotalScore: item.TotalScore,
            SequenceID: item.SequenceID,
        }));

        // Update saved data with formatted items
        setSavedData((prevData) => {
            const newData = [...prevData];
            newData[categoryIndex].items = formattedItems;
            return newData;
        });
    };

    /* const handleDragEnd = (result) => {
      const { source, destination } = result;
  
      // If the item was dropped outside a valid destination, exit
      if (!destination) return;
  
      // Clone the data to avoid mutating the original state
      const updatedData = [...AllData];
  
      // Get the source and destination tables
      const sourceIndex = parseInt(source.droppableId, 10);
      const destIndex = parseInt(destination.droppableId, 10);
  
      // Extract the items from the source and destination tables
      const sourceItems = Array.from(updatedData[sourceIndex].items);
      const destItems = Array.from(updatedData[destIndex].items);
  
      // Remove the dragged item from the source table
      const [movedItem] = sourceItems.splice(source.index, 1);
  
      // Add the dragged item to the destination table at the specified position
      destItems.splice(destination.index, 0, movedItem);
  
      // Reformat the data for both source and destination tables
      const formatItems = (items) =>
        items.map((item, index) => ({
          ApplicationNo: item.ApplicationNo || "",
          CandidateID: item.CandidateID || 0,
          FullNameDevnagari: item.FullNameDevnagari || "",
          FullNameEnglish: item.FullNameEnglish || "",
          DOB: item.DOB || "",
          Cast: item.Cast || "",
          Category: item.Category || "",
          gender: item.gender || "",
          chestno: item.chestno || "",
          HundredMeterRunning: item["100 Meter Running"] || 0,
          SixteenHundredMeterRunning: item["1600 Meter Running"] || 0,
          eightHundredMeterRunning: item["800 Meter Running"] || 0,
          ShotPut: item.ShotPut || 0,
          age: calculateAge(item.DOB),
          TotalScore: item.TotalScore,
          SequenceID: (index + 1).toString(), // Reset SequenceID starting from 1
        }));
  
      // Update the source and destination tables in the state
      updatedData[sourceIndex].items = formatItems(sourceItems);
      updatedData[destIndex].items = formatItems(destItems);
  
      // Update state with reordered and formatted data
      setAllData(updatedData);
  
      // Update saved data with formatted items for both categories
      setSavedData((prevData) => {
        const newData = [...prevData];
        newData[sourceIndex].items = formatItems(sourceItems);
        newData[destIndex].items = formatItems(destItems);
        return newData;
      });
    }; */

    const handleDeleteRow = (categoryIndex, rowId) => {
        const updatedData = [...AllData];

        // Find and update the relevant category
        const items = updatedData[categoryIndex].items.filter(item => item.Id !== rowId);

        // Reset SequenceID for the remaining items
        const reorderedItems = items.map((item, index) => ({
            ...item,
            SequenceID: (index + 1).toString(),  // Reset SequenceID starting from 1
        }));

        // Update category data with reordered items
        updatedData[categoryIndex].items = reorderedItems;
        setAllData(updatedData); // Update state
        const formattedItems = reorderedItems.map((item, index) => ({
            ResulType: item.ResulType || "",
            ApplicationNo: item.ApplicationNo || "",
            CandidateID: item.CandidateID || 0,
            FullNameDevnagari: item.FullNameDevnagari || "",
            FullNameEnglish: item.FullNameEnglish || "",
            DOB: item.DOB || "", // Assuming DOB is mapped from your data structure
            Cast: item.Cast || "",
            Category: item.Category || "",
            gender: item.gender || "",
            chestno: item.chestno || "",
            HundredMeterRunning: item["100 Meter Running"] || 0,
            SixteenHundredMeterRunning: item["1600 Meter Running"] || 0,
            eightHundredMeterRunning: item["800 Meter Running"] || 0,
            ShotPut: item.ShotPut || 0,
            age: calculateAge(item.DOB), // Adding age here
            TotalScore: item.TotalScore,
            SequenceID: item.SequenceID,
        }));


        // Set saved data if needed (will only set last category's items)
        setSavedData((prevData) => {
            const newData = [...prevData];
            newData[categoryIndex].items = formattedItems;
            return newData;
        });
    };

    const handleCheckboxChange = (id) => {
        setSelectedItems((prev) => {
            let updatedItems;

            if (id === 'selectAll') {
                // If "Select All" is clicked
                if (prev.length === options.length) {
                    // Deselect all if all items are currently selected
                    updatedItems = [];
                } else {
                    // Select all items
                    updatedItems = options.map((option) => option.value);
                }
            } else {
                // Toggle individual item selection
                if (prev.includes(id)) {
                    updatedItems = prev.filter((item) => item !== id);
                } else {
                    updatedItems = [...prev, id];
                }
            }

            console.log(updatedItems, "updatedItems");

            // Call API after updating the selected items
            GetCastwiseCandidate(updatedItems);

            return updatedItems;
        });
    };

    const getSelectedCount = () => {
        return selectedItems.length ? `(${selectedItems.length} selected)` : '';
    };

    const getAllParameterValueMasterData = () => {
        const UserId = localStorage.getItem("userId");
        return apiClient({
            method: "get",
            url: `ParameterValueMaster/GetAll`.toString(),
            params: {
                UserId: UserId,
                pv_parameterid: '562f4f41-1127-4510-968f-08365867759f',
                pv_isactive: "1",
            },
        })
            .then((response) => {
                console.log("response all parameter value masters", response.data.data);
                const token1 = response.data.outcome.tokens;
                Cookies.set("UserCredential", token1, { expires: 7 });
                setOptions(response.data.data.map((item) => ({
                    value: item.pv_id,
                    label: item.pv_parametervalue,
                })))
                console.log(options, "84")
                const temp = response.data.data.map((item) => ({
                    value: item.pv_id,
                    label: item.pv_parametervalue,
                }));
                setAllCast(temp);
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.outcome) {
                    const token1 = error.response.data.outcome.tokens;
                    Cookies.set("UserCredential", token1, { expires: 7 });
                }
                console.log(error);
                const errors = ErrorHandler(error);
                toast.error(errors);
                return [];
            });
    };

    const calculateAge = (birthDate) => {
        const today = new Date();
        const birthDateObj = new Date(birthDate);
        let age = today.getFullYear() - birthDateObj.getFullYear();
        const monthDifference = today.getMonth() - birthDateObj.getMonth();
        const dayDifference = today.getDate() - birthDateObj.getDate();
        if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
            age--;
        }

        return age;
    };

    // const eventNames = [...new Set(eventList.map(item => item.eventName))];
    const eventNames = [...new Set(eventList.map(item => item.eventName))];
    console.log("Event Names:", eventNames);
    // Define base columns
    const baseColumns = [
        {
            name: "Name",
            selector: (row) => row.FullNameEnglish,
            sortable: true,
            // grow: 2,
        },
        {
            name: "Chest No.",
            selector: (row) => row.chestno,
            sortable: true,
        },
        {
            name: "Age",
            selector: (row) => row.age,
            sortable: true,
        },
        {
            name: "Gender",
            selector: (row) => row.gender,
            sortable: true,
        },
        {
            name: "Cast",
            selector: (row) => row.Cast,
            sortable: true,
        },
    ];

    // Dynamically generate event columns
    const eventColumns = eventNames.map((eventName) => ({
        name: eventName,
        selector: (row) => row[eventName],
        sortable: true,
    }));

    // Total column
    const totalColumn = {
        name: "Total",
        selector: (row) => row.TotalScore,
        sortable: true,
    };

    // Combine all columns
    const columns = [...baseColumns, ...eventColumns, totalColumn];

    // console.log(columns);

    const GetAllDataGround = () => {
        const UserId = localStorage.getItem("userId");
        const recruitId = localStorage.getItem("recruitId");
        apiClient({
            method: "get",
            url: `Candidate/GetAllValueGround`.toString(),
            params: {
                userId: UserId,
                RecruitId: recruitId,
                Category: categoryName.value,
                Groundtestdata1: "",
            },
        })
            .then((response) => {

                const dataWithAge = response.data.data.data.map((categoryData) => {
                    const formattedItems = categoryData.items.map((item, index) => ({

                        ApplicationNo: item.ApplicationNo || "",
                        CandidateID: item.CandidateID || 0,
                        FullNameDevnagari: item.FullNameDevnagari || "",
                        FullNameEnglish: item.FullNameEnglish || "",
                        DOB: item.DOB || "", // Assuming DOB is mapped from your data structure
                        Cast: item.Cast || "",
                        Category: item.Category || "",
                        gender: item.gender || "",
                        chestno: item.chestno || "",
                        HundredMeterRunning: item["100 Meter Running"] || 0,
                        SixteenHundredMeterRunning: item["1600 Meter Running"] || 0,
                        eightHundredMeterRunning: item["800 Meter Running"] || 0,
                        ShotPut: item["Shot Put"] || 0,
                        age: calculateAge(item.DOB), // Adding age here
                        TotalScore: item.TotalScore,
                        SequenceID: (index + 1).toString() || item.SequenceID,
                    }));

                    // Set saved data if needed (will only set last category's items)
                    setSavedData(formattedItems);

                    return {
                        ...categoryData,
                        items: categoryData.items.map((item) => ({
                            ...item,
                            age: calculateAge(item.DOB),

                        })),
                    };
                });
                // setAllData(dataWithAge);
                setCatName(response.data.data.data[0].category)
                // console.log(response.data.data.data.value.data, "94")
                console.log(response.data.data.eventlist.value.data, "94")
                setEventList(response.data.data.eventlist.value.data)
                setAllData(dataWithAge);
                updateFilteredData(dataWithAge, 1, itemsPerPage); // Initialize with first page data
                setAllFilteredData(dataWithAge); // Initialize all filtered data
                const token1 = response.data.outcome.tokens;
                console.log(response.data.outcome.tokens, "102");
                Cookies.set("UserCredential", token1, { expires: 7 });

            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.outcome) {
                    const token1 = error.response.data.data.value.outcome.tokens;
                    Cookies.set("UserCredential", token1, { expires: 7 });
                }
                console.log(error);
                // const errors = ErrorHandler(error);
                // toast.error(errors);
            });
    };




    const groupedData = AllData.reduce((groups, categoryData) => {
        if (!categoryData.items) return groups; // Skip categories without items
        categoryData.items.forEach((item) => {
            const caste = item.Cast || "Unknown";
            if (!groups[caste]) groups[caste] = [];
            groups[caste].push(item);
        });
        return groups;
    }, {});



    const GetAllData = () => {
        const UserId = localStorage.getItem("userId");
        const recruitId = localStorage.getItem("recruitId");
        apiClient({
            method: "get",
            url: `Candidate/GetAllValue`.toString(),
            params: {
                userId: UserId,
                RecruitId: recruitId,
                Category: categoryName.value,
                Groundtestdata1: ""
            },
        })
            .then((response) => {
                const dataWithAge = response.data.data.data.map((categoryData) => {
                    // setSavedData(filteredData)
                    const formattedItems = categoryData.items.map((item, index) => ({
                        ApplicationNo: item.ApplicationNo || "",
                        CandidateID: item.CandidateID || 0,
                        FullNameDevnagari: item.FullNameDevnagari || "",
                        FullNameEnglish: item.FullNameEnglish || "",
                        DOB: item.DOB || "", // Assuming DOB is mapped from your data structure
                        Cast: item.Cast || "",
                        Category: item.Category || "",
                        gender: item.gender || "",
                        chestno: item.chestno || "",
                        HundredMeterRunning: item["100 Meter Running"] || 0,
                        SixteenHundredMeterRunning: item["1600 Meter Running"] || 0,
                        eightHundredMeterRunning: item["800 Meter Running"] || 0,
                        ShotPut: item["ShotPut"] || 0,
                        age: calculateAge(item.DOB), // Adding age here
                        TotalScore: item.TotalScore,
                        SequenceID: (index + 1).toString() || item.SequenceID,
                    }));

                    // setSavedData(dataWithAge);
                    // Set saved data if needed (will only set last category's items)
                    // setSavedData(formattedItems);

                    return {
                        ...categoryData,
                        // items: categoryData.items.map((item) => ({
                        //   ...item,
                        items: formattedItems,
                        //   age: calculateAge(item.DOB)
                        // })),
                    };
                });
                setSavedData(dataWithAge);
                const retrievedData = response.data.data.data.map((categoryData) => {
                    return {
                        ...categoryData,
                        items: categoryData.items.map((item) => ({
                            ...item,

                            age: calculateAge(item.DOB)
                        })),
                    };
                });

                // Use `retrievedData` where you need the original names
                console.log(retrievedData);
                setCatName(response.data.data.data[0].category)
                // console.log(response.data.data.data.value.data, "94")
                console.log(response.data.data.eventlist.value.data, "94")
                setEventList(response.data.data.eventlist.value.data)
                setAllData(retrievedData);
                updateFilteredData(retrievedData, 1, itemsPerPage); // Initialize with first page data
                setAllFilteredData(retrievedData); // Initialize all filtered data
                const token1 = response.data.outcome.tokens;
                console.log(response.data.outcome.tokens, "102");
                Cookies.set("UserCredential", token1, { expires: 7 });
                setActionRow(true);
                setCategoryName("");
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.outcome) {
                    const token1 = error.response.data.data.value.outcome.tokens;
                    Cookies.set("UserCredential", token1, { expires: 7 });
                }
                console.log(error);
                // const errors = ErrorHandler(error);
                // toast.error(errors);
            });
    };


    const GetAllMeritData = () => {
        const UserId = localStorage.getItem("userId");
        const recruitId = localStorage.getItem("recruitId");
        apiClient({
            method: "get",
            url: `Candidate/GetMeritnCastwiseCandidate`.toString(),
            params: {
                userId: UserId,
                RecruitId: recruitId,
                Category: categoryName.value,
                Groundtestdata1: ""
            },
        })
            .then((response) => {
                const dataWithAge = response.data.data.data.value.data.map((categoryData) => {
                    const meritList = categoryData.meritList || [];
                    const castWisedata = categoryData.castWisedata || [];

                    // Calculate the merit list length
                    setMeritWiseLength(meritList.length);
                    setCastWiseLength(castWisedata.length);
                    console.log(meritList.length, "982")
                    // setSavedData(filteredData)
                    const formattedItems = categoryData.meritList.map((item, index) => ({
                        ResulType: item.ResulType || "",
                        ApplicationNo: item.ApplicationNo || "",
                        CandidateID: item.CandidateID || 0,
                        FullNameDevnagari: item.FullNameDevnagari || "",
                        FullNameEnglish: item.FullNameEnglish || "",
                        DOB: item.DOB || "", // Assuming DOB is mapped from your data structure
                        Cast: item.Cast || "",
                        Category: item.Category || "",
                        gender: item.gender || "",
                        chestno: item.chestno || "",
                        HundredMeterRunning: item["100 Meter Running"] || '0',
                        SixteenHundredMeterRunning: item["1600 Meter Running"] || '0',
                        eightHundredMeterRunning: item["800 Meter Running"] || '0',
                        ShotPut: item["ShotPut"] || '0',
                        // HundredMeterRunning: item.HundredMeterRunning || 0,
                        // SixteenHundredMeterRunning: item.SixteenHundredMeterRunning || 0,
                        // eightHundredMeterRunning: item.eightHundredMeterRunning || 0,
                        // ShotPut: item.ShotPut || 0,
                        age: calculateAge(item.DOB), // Adding age here
                        TotalScore: item.TotalScore,
                        SequenceID: (index + 1).toString() || item.SequenceID,
                    }));
                    const formattedItems1 = categoryData.castWisedata.map((item, index) => ({
                        ResulType: item.ResulType || "",
                        ApplicationNo: item.ApplicationNo || "",
                        CandidateID: item.CandidateID || 0,
                        FullNameDevnagari: item.FullNameDevnagari || "",
                        FullNameEnglish: item.FullNameEnglish || "",
                        DOB: item.DOB || "", // Assuming DOB is mapped from your data structure
                        Cast: item.Cast || "",
                        Category: item.Category || "",
                        gender: item.gender || "",
                        chestno: item.chestno || "",
                        HundredMeterRunning: item["100 Meter Running"] || '0',
                        SixteenHundredMeterRunning: item["1600 Meter Running"] || '0',
                        eightHundredMeterRunning: item["800 Meter Running"] || '0',
                        ShotPut: item["ShotPut"] || '0',
                        // HundredMeterRunning: item.HundredMeterRunning || 0,
                        // SixteenHundredMeterRunning: item.SixteenHundredMeterRunning || 0,
                        // eightHundredMeterRunning: item.eightHundredMeterRunning || 0,
                        // ShotPut: item.ShotPut || 0,
                        age: calculateAge(item.DOB), // Adding age here
                        TotalScore: item.TotalScore,
                        SequenceID: (index + 1).toString() || item.SequenceID,
                    }));
                    // setSavedData(dataWithAge);
                    // Set saved data if needed (will only set last category's items)
                    // setSavedData(formattedItems);

                    return {
                        // ...categoryData,
                        // items: categoryData.items.map((item) => ({
                        //   ...item,
                        // meritList: formattedItems,
                        // castWisedata : formattedItems1
                        items: [...formattedItems, ...formattedItems1]

                        //   age: calculateAge(item.DOB)
                        // })),
                    };
                });
                setSavedData(dataWithAge);
                console.log(dataWithAge, "920")
                const retrievedData = response.data.data.data.value.data.map((categoryData) => {
                    return {
                        ...categoryData,
                        meritList: categoryData.meritList.map((item) => ({
                            ...item,

                            age: calculateAge(item.DOB),

                        })),
                        castWisedata: categoryData.castWisedata.map((item) => ({
                            ...item,

                            age: calculateAge(item.DOB)
                        })),
                    };
                });

                // Use `retrievedData` where you need the original names
                console.log(retrievedData, "915");
                // setCatName(response.data.data.data[0].category)
                // console.log(response.data.data.data.value.data, "94")
                console.log(response.data.data.eventlist.value.data, "94")
                // console.log(response.data, "94")
                setEventList(response.data.data.eventlist.value.data)
                setAllData(retrievedData);
                updateFilteredData(retrievedData, 1, itemsPerPage); // Initialize with first page data
                setAllFilteredData(retrievedData); // Initialize all filtered data
                // const token1 = response.data.outcome.tokens;
                console.log(response.data.outcome.tokens, "102");
                // Cookies.set("UserCredential", token1, { expires: 7 });
                setActionRow(true);
                setCategoryName("");
            })
            .catch((error) => {
                // if (error.response && error.response.data && error.response.data.outcome) {
                //     const token1 = error.response.data.data.data.value.outcome.tokens;
                //     Cookies.set("UserCredential", token1, { expires: 7 });
                // }
                console.log(error);
                // const errors = ErrorHandler(error);
                // toast.error(errors);
            });
    };
    const CastWiseData = () => {
        setCastStatus(true)
    }

    const AddGroundTestData = () => {
        const recruitId = localStorage.getItem("recruitId");
        const UserId = localStorage.getItem("userId");
        let data = {
            userId: UserId,
            recruitId: recruitId,
            groundtestdata1: savedData
        };

        apiClient({
            method: "post",
            url: `Candidate/InsertGroundtestdata`,
            data: data
        })
            .then((response) => {
                console.log("add ground test report", response.data.data);
                const token1 = response.data.outcome.tokens;
                Cookies.set("UserCredential", token1, { expires: 7 });
                console.log(response.data.data.data, "94")
                GetAllMeritData();
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.outcome) {
                    const token1 = error.response.data.outcome.tokens;
                    Cookies.set("UserCredential", token1, { expires: 7 });
                }
                console.log(error);
                let errors = ErrorHandler(error);
                toast.error(errors);
            });
    };

    const updateFilteredData = (data, page, perPage) => {
        const startIndex = (page - 1) * perPage;
        const endIndex = startIndex + perPage;
        setFilteredData(data.slice(startIndex, endIndex));
        setTotalRows(data.length);
    };

    // const handleAgeChange = (e) => {
    //     const value = e.target.value;
    //     console.log(value, "value");
    //     const filtered = AllData.filter(
    //         (item) => calculateAge(item.DOB) >= Number(value)
    //     );
    //     updateFilteredData(filtered, 1, itemsPerPage); // Reset to first page after filtering
    //     setAllFilteredData(filtered); // Update all filtered data
    //     setFilterText(""); // Clear the filter text
    //     setCurrentPage(1);
    //     console.log("filtered", filtered)
    // };

    const handleAgeChange = (e) => {
        if (e.target.value === "") {
            GetAllMeritData();
            return;
        }
        const value = e.target.value;
        console.log(value, "value");

        const filtered = AllData.map(categoryData => {
            return {
                ...categoryData,
                meritList: categoryData.meritList.filter(item =>
                    calculateAge(item.DOB) >= Number(value)
                ),
                castWisedata: categoryData.castWisedata.filter(item =>
                    calculateAge(item.DOB) >= Number(value)
                )
            };
        });

        // Filter out any categories that have no data after filtering
        const nonEmptyFiltered = filtered.filter(
            category => category.meritList.length > 0 || category.castWisedata.length > 0
        );

        updateFilteredData(nonEmptyFiltered, 1, itemsPerPage);
        setAllData(nonEmptyFiltered);
        setFilterText("");
        setCurrentPage(1);

    };
    const handleFilterChange = (e) => {
        if (e.target.value === "") {
            GetAllMeritData();
            return;
        }
        const value = e.target.value;
        setFilterText(value);

        let filtered = AllData.map(categoryData => {
            if (!isNaN(value)) {
                // Filter by total score if value is a number
                return {
                    ...categoryData,
                    meritList: categoryData.meritList.filter(item =>
                        item.TotalScore >= Number(value)
                    ),
                    castWisedata: categoryData.castWisedata.filter(item =>
                        item.TotalScore >= Number(value)
                    )
                };
            } else {
                // Filter by other fields if value is text
                const lowerCaseFilterText = value.toLowerCase();

                const filteredMeritList = categoryData.meritList.filter(item => {
                    const fullName = item.FullNameEnglish ? item.FullNameEnglish.toLowerCase() : "null";
                    const chestNo = item.chestno ? item.chestno.toString() : "null";
                    const score100 = item["100 Meter Running"] ? item["100 Meter Running"].toString() : "null";
                    const score1600_800 = item.gender === "Female" ?
                        (item["800 Meter Running"] ? item["800 Meter Running"].toString() : "null") :
                        (item["1600 Meter Running"] ? item["1600 Meter Running"].toString() : "null");
                    const shotputScore = item.ShotPut ? item.ShotPut.toString() : "null";
                    const totalScore = item.TotalScore ? item.TotalScore.toString() : "null";

                    return (
                        fullName.includes(lowerCaseFilterText) ||
                        chestNo.includes(lowerCaseFilterText) ||
                        score100.includes(lowerCaseFilterText) ||
                        score1600_800.includes(lowerCaseFilterText) ||
                        shotputScore.includes(lowerCaseFilterText) ||
                        totalScore.includes(lowerCaseFilterText)
                    );
                });

                const filteredCastWisedata = categoryData.castWisedata.filter(item => {
                    const fullName = item.FullNameEnglish ? item.FullNameEnglish.toLowerCase() : "null";
                    const chestNo = item.chestno ? item.chestno.toString() : "null";
                    const score100 = item["100 Meter Running"] ? item["100 Meter Running"].toString() : "null";
                    const score1600_800 = item.gender === "Female" ?
                        (item["800 Meter Running"] ? item["800 Meter Running"].toString() : "null") :
                        (item["1600 Meter Running"] ? item["1600 Meter Running"].toString() : "null");
                    const shotputScore = item.ShotPut ? item.ShotPut.toString() : "null";
                    const totalScore = item.TotalScore ? item.TotalScore.toString() : "null";

                    return (
                        fullName.includes(lowerCaseFilterText) ||
                        chestNo.includes(lowerCaseFilterText) ||
                        score100.includes(lowerCaseFilterText) ||
                        score1600_800.includes(lowerCaseFilterText) ||
                        shotputScore.includes(lowerCaseFilterText) ||
                        totalScore.includes(lowerCaseFilterText)
                    );
                });

                return {
                    ...categoryData,
                    meritList: filteredMeritList,
                    castWisedata: filteredCastWisedata
                };
            }
        });

        // Remove empty categories after filtering
        filtered = filtered.filter(category =>
            category.meritList.length > 0 || category.castWisedata.length > 0
        );

        updateFilteredData(filtered, 1, itemsPerPage);
        setAllData(filtered); // Make sure you're using setAllFilteredData instead of setAllData
        setCurrentPage(1);
    };


    // Call the function where you want to download the file
    const handleDownload = () => {
        if (!savedData || savedData.length === 0) {
            console.error("No data available for download");
            return;
        }

        // Filter and map data for the Merit List
        console.log(savedData, "saved data")
        const meritList = savedData
            .flatMap((category) =>
                category.items.filter((item) => item.ResulType === "MeritList")
            )
            .map((item) => ({
                ResulType: item.ResulType,
                ApplicationNo: item.ApplicationNo,
                CandidateID: item.CandidateID,
                FullNameDevnagari: item.FullNameDevnagari,
                FullNameEnglish: item.FullNameEnglish,
                DOB: item.DOB,
                Cast: item.Cast,
                Category: item.Category,
                Gender: item.gender,
                ChestNo: item.chestno,
                HundredMeterRunning: item.HundredMeterRunning || '0',
                SixteenHundredMeterRunning: item.SixteenHundredMeterRunning || '0',
                eightHundredMeterRunning: item.eightHundredMeterRunning || '0',
                ShotPut: item.ShotPut,
                Age: item.age,
                TotalScore: item.TotalScore,
                SequenceID: item.SequenceID,
            }));

        // Filter and map data for the Cast Wise List
        const castWiseList = savedData
            .flatMap((category) =>
                category.items.filter((item) => item.ResulType === "CastWisedata")
            )
            .map((item) => ({
                ResulType: item.ResulType,
                ApplicationNo: item.ApplicationNo,
                CandidateID: item.CandidateID,
                FullNameDevnagari: item.FullNameDevnagari,
                FullNameEnglish: item.FullNameEnglish,
                DOB: item.DOB,
                Cast: item.Cast,
                Category: item.Category,
                Gender: item.gender,
                ChestNo: item.chestno,
                HundredMeterRunning: item.HundredMeterRunning || '0',
                SixteenHundredMeterRunning: item.SixteenHundredMeterRunning || '0',
                eightHundredMeterRunning: item.eightHundredMeterRunning || '0',
                ShotPut: item.ShotPut,
                Age: item.age,
                TotalScore: item.TotalScore,
                SequenceID: item.SequenceID,
            }));

        console.log(meritList, "Filtered Merit List Data");
        console.log(castWiseList, "Filtered Cast Wise List Data");

        // Pass data to the download function
        downloadExcel(meritList, castWiseList);
    };

    const downloadExcel = (meritList, castWiseList) => {
        if (meritList.length === 0 && castWiseList.length === 0) {
            console.error("Both Merit List and Cast Wise List are empty.");
            return;
        }

        const meritSheetData = [
            [
                "ResulType",
                "ApplicationNo",
                "CandidateID",
                "FullNameDevnagari",
                "FullNameEnglish",
                "DOB",
                "Cast",
                "Category",
                "Gender",
                "ChestNo",
                "100 Meter Running",
                "1600 Meter Running",
                "800 Meter Running",
                "ShotPut",
                "Age",
                "TotalScore",

            ],
            ...meritList.map((item) => [
                item.ResulType,
                item.ApplicationNo,
                item.CandidateID,
                item.FullNameDevnagari,
                item.FullNameEnglish,
                item.DOB,
                item.Cast,
                item.Category,
                item.Gender,
                item.ChestNo,
                item.HundredMeterRunning,
                item.SixteenHundredMeterRunning,
                item.eightHundredMeterRunning,
                item.ShotPut,
                item.Age,
                item.TotalScore,

            ]),
        ];

        const castWiseSheetData = [
            [
                "ResulType",
                "ApplicationNo",
                "CandidateID",
                "FullNameDevnagari",
                "FullNameEnglish",
                "DOB",
                "Cast",
                "Category",
                "Gender",
                "ChestNo",
                "100 Meter Running",
                "1600 Meter Running",
                "800 Meter Running",
                "ShotPut",
                "Age",
                "TotalScore",

            ],
            ...castWiseList.map((item) => [
                item.ResulType,
                item.ApplicationNo,
                item.CandidateID,
                item.FullNameDevnagari,
                item.FullNameEnglish,
                item.DOB,
                item.Cast,
                item.Category,
                item.Gender,
                item.ChestNo,
                item.HundredMeterRunning,
                item.SixteenHundredMeterRunning,
                item.eightHundredMeterRunning,
                item.ShotPut,
                item.Age,
                item.TotalScore,

            ]),
        ];

        const workbook = XLSX.utils.book_new();
        const meritSheet = XLSX.utils.aoa_to_sheet(meritSheetData);
        const castWiseSheet = XLSX.utils.aoa_to_sheet(castWiseSheetData);

        XLSX.utils.book_append_sheet(workbook, meritSheet, "Merit List");
        XLSX.utils.book_append_sheet(workbook, castWiseSheet, "Cast Wise List");

        XLSX.writeFile(workbook, "Merit_and_Cast_Wise_List.xlsx");
    };


    const handlePageChange = (page) => {
        setCurrentPage(page);
        updateFilteredData(allFilteredData, page, itemsPerPage);
    };

    const handlePerRowsChange = (newPerPage, page) => {
        setItemsPerPage(newPerPage);
        updateFilteredData(allFilteredData, page, newPerPage);
    };

    // const GeneratePdfHandler = () => {
    //     const doc = new jsPDF();

    //     // Extract unique event names from eventList
    //     const eventNames = [...new Set(eventList.map((item) => item.eventName))];

    //     // Define static columns, including Sr.no (Index)
    //     const baseColumns = [
    //         { title: "Sr", dataKey: "Index" },
    //         { title: "Name", dataKey: "FullNameEnglish" },
    //         { title: "Chest No.", dataKey: "chestno" },
    //         { title: "Age", dataKey: "age" },
    //     ];

    //     // Dynamically add event columns
    //     const eventColumns = eventNames.map((eventName) => ({
    //         title: eventName,
    //         dataKey: eventName,
    //     }));

    //     // Add the Total column
    //     const totalColumn = { title: "Total", dataKey: "TotalScore" };

    //     // Combine all columns
    //     const columns = [...baseColumns, ...eventColumns, totalColumn];

    //     // Starting Y position for the tables
    //     let currentY = 45;

    //     // Loop through each category in AllData to generate tables
    //     AllData.forEach((categoryData, tableIndex) => {
    //         // Add a category title
    //         doc.setFontSize(12);
    //         doc.setFont("helvetica", "bold");
    //         doc.text(categoryData.category, doc.internal.pageSize.getWidth() / 2, currentY, { align: "center" });

    //         // Increment Y position
    //         currentY += 10;

    //         // Map table data dynamically based on event names, and add index
    //         const tableData = categoryData.items.map((item, index) => {
    //             // Create the base row with static fields
    //             let rowData = {
    //                 Index: index + 1,
    //                 FullNameEnglish: item.FullNameEnglish,
    //                 chestno: item.chestno,
    //                 age: item.age,
    //                 TotalScore: item.TotalScore,
    //             };

    //             // Dynamically add event data based on the event names
    //             eventNames.forEach((eventName) => {
    //                 rowData[eventName] = item[eventName] || "0";
    //             });

    //             return rowData;
    //         });

    //         // Calculate dynamic column widths
    //         const pageWidth = doc.internal.pageSize.getWidth();
    //         const padding = 20;
    //         const tableWidth = pageWidth - padding;
    //         const fixedWidth = 20;
    //         const dynamicColumnWidth = (tableWidth - fixedWidth) / (columns.length - 1);

    //         // Generate the PDF table for the current category
    //         doc.autoTable({
    //             head: [columns.map((col) => col.title)],
    //             body: tableData.map((row) => columns.map((col) => row[col.dataKey])),
    //             startY: currentY,
    //             styles: {
    //                 cellPadding: 4,
    //                 halign: "center",
    //                 valign: "middle",
    //                 lineWidth: 0.1,
    //                 lineColor: [0, 0, 0],
    //                 fontSize: 8,
    //             },
    //             headStyles: {
    //                 fillColor: "white",
    //                 textColor: "black",
    //                 fontSize: 9,
    //                 halign: "center",
    //                 valign: "middle",
    //             },
    //             columnStyles: {
    //                 0: { cellWidth: fixedWidth },
    //                 ...Array.from({ length: columns.length - 1 }, (_, index) => ({
    //                     [index + 1]: { cellWidth: dynamicColumnWidth },
    //                 })).reduce((acc, val) => ({ ...acc, ...val }), {}),
    //             },
    //             margin: { top: 15, bottom: 10 },
    //             theme: "grid",
    //             didDrawPage: function (data) {
    //                 if (doc.internal.getCurrentPageInfo().pageNumber === 1) {
    //                     doc.setFontSize(16);
    //                     doc.setFont("helvetica", "bold");
    //                     doc.text(
    //                         `${recruitName} Police Recruitment 2024-25`,
    //                         doc.internal.pageSize.getWidth() / 2,
    //                         20,
    //                         { align: "center" }
    //                     );
    //                     doc.setFontSize(12);
    //                     doc.text("Physical Test Result Report", doc.internal.pageSize.getWidth() / 2, 30, { align: "center", marginTop: "15px", marginBottom: "50px" });
    //                 }
    //             },
    //             willDrawCell: function (data) {
    //                 if (data.row.index + 1 === tableData.length) {
    //                     data.settings.margin.bottom = 5;
    //                 }
    //             },
    //         });

    //         // Update the Y position for the next table
    //         currentY = doc.lastAutoTable.finalY + 20;

    //         // Add a new page if the next table won't fit on the current page
    //         if (currentY + 50 > doc.internal.pageSize.getHeight()) {
    //             doc.addPage();
    //             currentY = 20;
    //         }
    //     });

    //     // Save the PDF
    //     doc.save("PhysicalTestResult.pdf");
    // };

    const GeneratePdfHandler = () => {
        try {
            // Initialize PDF
            const doc = new jsPDF();

            const pageWidth = doc.internal.pageSize.width;
            const pageHeight = doc.internal.pageSize.height;

            // Configuration
            const config = {
                startY: 20,
                margin: 10,
                spacing: 15
            };

            // Helper function to create table columns
            const createColumns = () => [
                { header: 'Sr', dataKey: 'SequenceID', width: 10 },
                { header: 'Name', dataKey: 'FullNameEnglish', width: 40 },
                { header: 'Chest No.', dataKey: 'chestno', width: 20 },
                { header: 'Age', dataKey: 'age', width: 15 },
                { header: '100M Running', dataKey: 'HundredMeterRunning', width: 20 },
                { header: '1600M Running', dataKey: 'SixteenHundredMeterRunning', width: 20 },
                { header: '800M Running', dataKey: 'eightHundredMeterRunning', width: 20 },
                { header: 'Shot Put', dataKey: 'ShotPut', width: 20 },
                { header: 'Total', dataKey: 'TotalScore', width: 20 }
            ];

            // Draw main header
            doc.setFontSize(16);
            doc.setFont("helvetica", "bold");
            doc.text(`${recruitName} Police Recruitment 2024-25`, pageWidth / 2, config.startY, { align: "center" });

            doc.setFontSize(12);
            doc.text("Physical Test Result Report", pageWidth / 2, config.startY + 10, { align: "center" });

            let yPos = config.startY + 25;

            // Process each category from AllData
            AllData.forEach(categoryData => {
                // Merit List Table
                if (categoryData.meritList && categoryData.meritList.length > 0) {
                    // Merit List Header
                    doc.setFontSize(12);
                    doc.setFont("helvetica", "bold");
                    doc.text("Merit List", pageWidth / 2, yPos, { align: "center" });
                    yPos += 15;

                    const meritTableData = categoryData.meritList.map((item, index) => ({
                        SequenceID: (index + 1).toString(),
                        FullNameEnglish: item.FullNameEnglish || '',
                        chestno: item.chestno || '',
                        age: item.age || '',
                        HundredMeterRunning: item["100 Meter Running"] || '0',
                        SixteenHundredMeterRunning: item["1600 Meter Running"] || '0',
                        eightHundredMeterRunning: item["800 Meter Running"] || '0',
                        ShotPut: item.ShotPut || '0',
                        TotalScore: item.TotalScore || '0'
                    }));

                    const columns = createColumns();

                    doc.autoTable({
                        startY: yPos,
                        head: [columns.map(col => col.header)],
                        body: meritTableData.map(row =>
                            columns.map(col => row[col.dataKey])
                        ),
                        styles: {
                            fontSize: 8,
                            cellPadding: 2
                        },
                        headStyles: {
                            fillColor: [220, 220, 220],
                            textColor: [0, 0, 0],
                            fontSize: 9,
                            fontStyle: 'bold',
                            halign: 'center'
                        },
                        columnStyles: columns.reduce((acc, col, idx) => ({
                            ...acc,
                            [idx]: { halign: 'center', cellWidth: col.width }
                        }), {}),
                        margin: { left: config.margin, right: config.margin }
                    });

                    yPos = doc.lastAutoTable.finalY + config.spacing;
                }

                // Cast-wise Table
                if (categoryData.castWisedata && categoryData.castWisedata.length > 0) {
                    // Add new page if not enough space
                    if (yPos > pageHeight - 100) {
                        doc.addPage();
                        yPos = config.startY;
                    }

                    // Cast-wise Header
                    doc.setFontSize(12);
                    doc.setFont("helvetica", "bold");
                    doc.text("Cast-wise List", pageWidth / 2, yPos, { align: "center" });
                    yPos += 10;

                    const castTableData = categoryData.castWisedata.map((item, index) => ({
                        SequenceID: (index + 1).toString(),
                        FullNameEnglish: item.FullNameEnglish || '',
                        chestno: item.chestno || '',
                        age: item.age || '',
                        HundredMeterRunning: item["100 Meter Running"] || '0',
                        SixteenHundredMeterRunning: item["1600 Meter Running"] || '0',
                        eightHundredMeterRunning: item["800 Meter Running"] || '0',
                        ShotPut: item.ShotPut || '0',
                        TotalScore: item.TotalScore || '0'
                    }));

                    const columns = createColumns();

                    doc.autoTable({
                        startY: yPos,
                        head: [columns.map(col => col.header)],
                        body: castTableData.map(row =>
                            columns.map(col => row[col.dataKey])
                        ),
                        styles: {
                            fontSize: 8,
                            cellPadding: 2
                        },
                        headStyles: {
                            fillColor: [220, 220, 220],
                            textColor: [0, 0, 0],
                            fontSize: 9,
                            fontStyle: 'bold',
                            halign: 'center'
                        },
                        columnStyles: columns.reduce((acc, col, idx) => ({
                            ...acc,
                            [idx]: { halign: 'center', cellWidth: col.width }
                        }), {}),
                        margin: { left: config.margin, right: config.margin }
                    });

                    yPos = doc.lastAutoTable.finalY + config.spacing;
                }
            });

            // Save the PDF
            doc.save("PhysicalTestResult.pdf");

        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Error generating PDF: ' + error.message);
        }
    };

    const handleRefresh = () => {
        // GetAllDataGround();
        setCastStatus(false);
        // GetAllData();
        GetAllMeritData();
        // Optionally, you can keep or reset `selectedItems` here if necessary
        setSelectedItems([]); // Uncomment to clear all selections on refresh
        setActionRow(false)
        setCategoryName("")
    };

    const customStyles = {
        headCells: {
            style: {
                backgroundColor: "#dee2e6",
                color: "black",
                fontFamily: "Arial, sans-serif",
                fontSize: "14px",
                fontWeight: "bold",
                paddingLeft: "8px",
                paddingRight: "8px",
                paddingTop: "0px",
                paddingBottom: "0px",
                borderBottom: "1px solid #ddd",
                borderTop: "1px solid #ddd",
                // Ensure the width is handled by the columns
                whiteSpace: 'nowrap',
            },
        },
        cells: {
            style: {
                color: "#333",
                fontSize: "14px",
                fontFamily: "Arial, sans-serif",
                paddingLeft: "8px",
                paddingRight: "8px",
                borderBottom: "1px solid #ddd",
                whiteSpace: 'nowrap', // Prevent content from wrapping and ensure consistent width
            },
        },
        rows: {
            style: {
                minHeight: "40px", // override the row height
                "&:not(:last-of-type)": {
                    borderBottomStyle: "solid",
                    borderBottomWidth: "1px",
                    borderBottomColor: "#ddd",
                },
            },
        },
        pagination: {
            style: {
                borderTopStyle: "solid",
                borderTopWidth: "1px",
                borderTopColor: "#ddd",
                padding: "8px",
            },
        },
        table: {
            style: {
                width: "100%",
                marginTop: "5px",
                backgroundColor: "#fff",
                borderCollapse: "collapse",
            },
        },

    };
    return (
        <>
            <style>
                {`
    .custom-header {
      padding: 10px;
      background-color: #f8f9fa;
      border-bottom: 1px solid #dee2e6;
    }

    .table {
      width: 100%;
      table-layout: fixed;
      border-collapse: collapse;
    }

    .table-cell {
      padding: 8px;
      text-align: center;
      vertical-align: middle;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      border: 1px solid #dee2e6;
    }

    .draggable-row {
      transition: background-color 0.2s ease;
      background-color: #fff;
    }

    .draggable-row.dragging {
      background-color: #e9ecef; 
      border: 2px dashed #007bff; 
    }
  `}
            </style>
            <div className="container-fluid">
                <div className="card m-3">
                    <div className="card-header">
                        <div className="row align-items-center">
                            <div className="col-lg-3 col-md-3">
                                <h4 className="card-title fw-bold">Ground Test</h4>
                            </div>
                            <div className="col-lg-9 col-md-9 d-flex justify-content-end align-items-end">
                                <div className="btn btn-add" title="Shuffle">
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-primary"
                                        style={{ backgroundColor: "#1B5A90" }}
                                        onClick={GeneratePdfHandler}
                                    >
                                        Download PDF
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-primary ms-2"
                                        style={{ backgroundColor: "#1B5A90" }}
                                        onClick={handleDownload}
                                    >
                                        Download Excel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card-body pt-3">
                        <>
                            <div className="row align-items-center">
                                {/* <div className="col-lg-12 col-md-12 justify-content-start align-items-start">
                    <h4 className="text-start">Filters</h4>
                  </div> */}
                                <div className="col-lg-12 col-md-12 d-flex justify-content-start align-items-start mb-2">
                                    {/* <h4 className="text-start fw-bold">Filters</h4> */}
                                </div>
                            </div>
                            {/* 21/2/2025 */}
                            {/* <div className="custom-header d-flex justify-content-end align-items-end">

                                <div className="row align-items-center">
                                     <div className="col-lg-12 col-md-12 justify-content-start align-items-start">
                    <h4 className="text-start">Filters</h4>
                  </div> 
                                    <div className="col-lg-12 col-md-12 d-flex justify-content-end align-items-end mb-2">
                                        <Select
                                            className="mt-3 me-3"
                                            value={categoryName}
                                            onChange={handleCategoryName}
                                            options={allCategoryName}
                                            placeholder="Category Name"

                                        /> 
                                        <div className="dropdown">
                                             <button
                                                className="btn btn-default dropdown-toggle form-control"
                                                type="button"
                                                onClick={toggleDropdown}
                                                style={{
                                                    backgroundColor: '#fff',
                                                    border: '1px solid #dee2e6',
                                                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                                                 
                                                    width: '120px',
                                                    textAlign: 'center',
                                                    color: '#000'
                                                }}
                                            >
                                                Select Options
                                            </button> 

                                            {isOpen && (
                                                <div
                                                    className="dropdown-menu show"
                                                    style={{
                                                        display: 'block',
                                                        position: 'absolute',
                                                        backgroundColor: '#fff',
                                                        border: '1px solid rgba(0,0,0,.15)',
                                                        borderRadius: '4px',
                                                        boxShadow: '0 2px 4px rgba(0,0,0,.15)',
                                                        padding: '8px 0',
                                                        minWidth: '120px',
                                                        marginTop: '2px',
                                                        zIndex: 1000
                                                    }}
                                                >
                                                 
                                                    <div className="dropdown-item" style={{ padding: '4px 16px' }}>
                                                        <div className="form-check" style={{ margin: 0 }}>
                                                            <input
                                                                type="checkbox"
                                                                className="form-check-input"
                                                                id="selectAll"
                                                                checked={selectAll}
                                                                onChange={() => handleCheckboxChange('selectAll')}
                                                                style={{ marginTop: '2px' }}
                                                            />
                                                            <label
                                                                className="form-check-label"
                                                                htmlFor="selectAll"
                                                                style={{
                                                                    marginLeft: '4px',
                                                                    fontSize: '14px',
                                                                    cursor: 'pointer'
                                                                }}
                                                            >
                                                                Select All
                                                            </label>
                                                        </div>
                                                    </div>

                                                    {options.map((option) => (
                                                        <div key={option.value} className="dropdown-item" style={{ padding: '4px 16px' }}>
                                                            <div className="form-check" style={{ margin: 0 }}>
                                                                <input
                                                                    type="checkbox"
                                                                    className="form-check-input"
                                                                    id={option.value}
                                                                    checked={selectedItems.includes(option.value)}
                                                                    onChange={() => handleCheckboxChange(option.value)}
                                                                    style={{ marginTop: '2px' }}
                                                                />
                                                                <label
                                                                    className="form-check-label"
                                                                    htmlFor={option.value}
                                                                    style={{
                                                                        marginLeft: '4px',
                                                                        fontSize: '14px',
                                                                        cursor: 'pointer'
                                                                    }}
                                                                >
                                                                    {option.label}
                                                                </label>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <div className="btn btn-add" title="Candidate">
                                      
                                            <button
                                                className="btn btn-sm text-white float-end"
                                                style={{
                                                    backgroundColor: "rgb(27, 90, 144)",
                                                    marginLeft: "10px",
                                                }}
                                                onClick={
                                                    GetAllData
                                                }
                                            >
                                                Selected Candidate
                                            </button> 
                                             <button
                                                className="btn btn-sm text-white float-end"
                                                style={{
                                                    backgroundColor: "rgb(27, 90, 144)",
                                                    marginLeft: "10px",
                                                }}
                                                onClick={
                                                    CastWiseData
                                                }
                                            >
                                                Selected Cast Wise
                                            </button> 
                                            <button
                                                className="btn btn-sm text-white float-end"
                                                style={{
                                                    backgroundColor: "rgb(27, 90, 144)",
                                                    marginLeft: "10px",
                                                }}
                                                onClick={
                                                    AddGroundTestData
                                                }
                                            >
                                                Save
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div> */}
                            <div className="custom-header d-flex justify-content-between align-items-center mb-3">
                                <div className="left d-flex">
                                    <div
                                        id="userTable_filter"
                                        className="dataTables_filter d-flex"
                                    >
                                        <label className="d-flex align-items-center mr-2">
                                            <input
                                                type="search"
                                                className="form-control form-control-sm"
                                                placeholder="Search Age"
                                                onChange={handleAgeChange}
                                                aria-controls="userTable"
                                                style={{ marginRight: "10px" }} // Add space between inputs
                                            />
                                        </label>
                                        <label className="d-flex align-items-center">
                                            <input
                                                type="text"
                                                className="form-control form-control-sm"
                                                placeholder="Search Cut Off"
                                                value={filterText}
                                                onChange={handleFilterChange}
                                            />
                                        </label>
                                    </div>
                                </div>
                                <div className="right d-flex align-items-center">
                                    <div className="mr-2">Last Updated On</div>
                                    <button
                                        id="refreshTable"
                                        className="btn btn-outline-secondary btn-sm"
                                        onClick={handleRefresh}
                                    >
                                        <i className="fas fa-sync-alt"></i>
                                    </button>
                                </div>
                            </div>
                        </>
                        {
                            castStatus === true ?
                                <>
                                    <DragDropContext onDragEnd={(result) => handleDragEnd(result, result.source.droppableId)}>
                                        <div>
                                            {Object.keys(groupedData).map((castName, index) => (
                                                <div key={index}>
                                                    <h4 className="my-4 fw-bold">{castName.Category}</h4>
                                                    <h4 className="my-4 fw-bold">{castName}</h4> {/* Display caste name as section header */}
                                                    <Droppable droppableId={`group-${String(index)}`} type="DATA_TABLE">
                                                        {(provided) => (
                                                            <div ref={provided.innerRef} {...provided.droppableProps}>
                                                                <table className="table table-striped table-responsive" style={{ tableLayout: "fixed", width: "100%" }}>
                                                                    <thead>
                                                                        <tr>
                                                                            {columns.map((col, colIndex) => (
                                                                                <th
                                                                                    key={colIndex}
                                                                                    style={{
                                                                                        backgroundColor: "#dee2e6",
                                                                                        width: `${100 / (columns.length + 1)}%`,
                                                                                        overflow: "hidden",
                                                                                        textOverflow: "ellipsis",
                                                                                        whiteSpace: "nowrap",
                                                                                        fontWeight: "bold"
                                                                                    }}
                                                                                >
                                                                                    {col.name}
                                                                                </th>
                                                                            ))}
                                                                            {/* <th
                                                                                style={{
                                                                                    backgroundColor: "#dee2e6",
                                                                                    fontWeight: "bold",
                                                                                    color: "black"
                                                                                }}
                                                                            >
                                                                                Action
                                                                            </th> */}
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {groupedData[castName].map((row, rowIndex) => (
                                                                            <Draggable key={row.CandidateID} draggableId={String(row.CandidateID)} index={rowIndex}>
                                                                                {(provided, snapshot) => (
                                                                                    <tr
                                                                                        // ref={provided.innerRef}
                                                                                        // {...provided.draggableProps}
                                                                                        // {...provided.dragHandleProps}
                                                                                        style={{
                                                                                            backgroundColor: snapshot.isDragging ? "#e9ecef" : "#f4f4f4",
                                                                                            transition: "background-color 0.2s ease",
                                                                                            height: snapshot.isDragging ? "200px" : "50px",
                                                                                            ...provided.draggableProps.style,
                                                                                        }}
                                                                                    >
                                                                                        {columns.map((col, colIndex) => (
                                                                                            <td
                                                                                                key={colIndex}
                                                                                                style={{
                                                                                                    overflow: "hidden",
                                                                                                    textOverflow: "ellipsis",
                                                                                                    whiteSpace: "nowrap",
                                                                                                    padding: snapshot.isDragging ? "8px 46px" : "8px",
                                                                                                    textAlign: "start",
                                                                                                    verticalAlign: "middle",
                                                                                                }}
                                                                                            >
                                                                                                {col.selector(row)}
                                                                                            </td>
                                                                                        ))}
                                                                                        {/* <td>
                                                                                            <button
                                                                                                className="btn btn-sm"
                                                                                                onClick={() => handleDeleteRow(index, row.CandidateID)}
                                                                                            >
                                                                                                <Delete className="text-danger" />
                                                                                            </button>
                                                                                        </td> */}
                                                                                    </tr>
                                                                                )}
                                                                            </Draggable>
                                                                        ))}
                                                                        {provided.placeholder}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        )}
                                                    </Droppable>
                                                </div>
                                            ))}
                                        </div>
                                    </DragDropContext>
                                </>
                                :
                                <>
                                    <DragDropContext onDragEnd={(result) => handleDragEnd(result, result.source.droppableId)}>
                                        <div>
                                            <div className="row">
                                                <div className="col-lg-6">
                                                    <h4 className="fw-bold">Merit List</h4>
                                                </div>
                                                <div className="col-lg-6">
                                                    <h5 className="fw-bold text-end">Total : {meritWiseLength}</h5>
                                                </div>
                                            </div>
                                            {AllData.map((categoryData, index) => (
                                                <div key={index}>
                                                    <h4 className="my-4 fw-bold">{categoryData.category}</h4>
                                                    <Droppable /* droppableId={String(index)} */ type="DATA_TABLE">
                                                        {(provided) => (
                                                            <div ref={provided.innerRef} {...provided.droppableProps}>
                                                                <table className="table table-striped" style={{ tableLayout: "fixed", width: "100%" }}>
                                                                    <thead>
                                                                        <tr>
                                                                            {columns.map((col, colIndex) => (
                                                                                <th
                                                                                    key={colIndex}
                                                                                    style={{
                                                                                        backgroundColor: "#dee2e6",
                                                                                        width: `${100 / (columns.length + 1)}%`,
                                                                                        overflow: "hidden",
                                                                                        textOverflow: "ellipsis",
                                                                                        whiteSpace: "nowrap",
                                                                                        fontWeight: "bold"
                                                                                    }}
                                                                                >
                                                                                    {col.name}
                                                                                </th>
                                                                            ))}
                                                                            {/* {actionRow && (
                                                                                <th
                                                                                    style={{
                                                                                        backgroundColor: "#dee2e6",
                                                                                        width: `${100 / (columns.length + 1)}%`,
                                                                                        overflow: "hidden",
                                                                                        textOverflow: "ellipsis",
                                                                                        whiteSpace: "nowrap",
                                                                                        fontWeight: "bold",
                                                                                        color: "black"
                                                                                    }}
                                                                                >
                                                                                    Action
                                                                                </th>
                                                                            )} */}
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        <>
                                                                            {categoryData.meritList.map((row, rowIndex) => (
                                                                                row.ID ? ( // Only make rows draggable if `Id` is present
                                                                                    <Draggable key={row.ID} draggableId={String(row.ID)} index={rowIndex}>
                                                                                        {(provided, snapshot) => (
                                                                                            <tr
                                                                                                ref={provided.innerRef}
                                                                                                {...provided.draggableProps}
                                                                                                {...provided.dragHandleProps}
                                                                                                style={{
                                                                                                    backgroundColor: snapshot.isDragging ? "#e9ecef" : "#f4f4f4",
                                                                                                    transition: "background-color 0.2s ease",
                                                                                                    height: snapshot.isDragging ? "200px" : "50px",
                                                                                                    ...provided.draggableProps.style,
                                                                                                }}
                                                                                                className="draggable-row"
                                                                                            >
                                                                                                {columns.map((col, colIndex) => (
                                                                                                    <td
                                                                                                        key={colIndex}
                                                                                                        style={{
                                                                                                            overflow: "hidden",
                                                                                                            textOverflow: "ellipsis",
                                                                                                            whiteSpace: "nowrap",
                                                                                                            padding: snapshot.isDragging ? "8px 46px" : "8px",
                                                                                                            textAlign: "start",
                                                                                                            verticalAlign: "middle",
                                                                                                        }}
                                                                                                    >
                                                                                                        {col.selector(row)}
                                                                                                    </td>
                                                                                                ))}
                                                                                                {/* {actionRow && (
                                                                                                    <td>
                                                                                                        <button
                                                                                                            className="btn btn-sm"
                                                                                                            onClick={() => handleDeleteRow(index, row.Id)}
                                                                                                        >
                                                                                                            <Delete className="text-danger" />
                                                                                                        </button>
                                                                                                    </td>
                                                                                                )} */}
                                                                                            </tr>
                                                                                        )}
                                                                                    </Draggable>
                                                                                ) : ( // Render non-draggable row if `Id` is missing
                                                                                    <tr key={rowIndex} style={{ backgroundColor: "#f4f4f4", height: "50px" }}>
                                                                                        {columns.map((col, colIndex) => (
                                                                                            <td
                                                                                                key={colIndex}
                                                                                                style={{
                                                                                                    overflow: "hidden",
                                                                                                    textOverflow: "ellipsis",
                                                                                                    whiteSpace: "nowrap",
                                                                                                    padding: "8px",
                                                                                                    textAlign: "start",
                                                                                                    verticalAlign: "middle",
                                                                                                }}
                                                                                            >
                                                                                                {col.selector(row)}
                                                                                            </td>
                                                                                        ))}
                                                                                        {/* {actionRow && (
                                                                                            <td>
                                                                                                <button
                                                                                                    className="btn btn-sm"
                                                                                                    onClick={() => handleDeleteRow(index, row.Id)}
                                                                                                >
                                                                                                    <Delete className="text-danger" />
                                                                                                </button>
                                                                                            </td>
                                                                                        )} */}
                                                                                    </tr>
                                                                                )
                                                                            ))}
                                                                            {provided.placeholder}
                                                                        </>
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        )}
                                                    </Droppable>
                                                </div>
                                            ))}
                                            <br />
                                        </div>
                                    </DragDropContext>
                                    <DragDropContext onDragEnd={(result) => handleDragEnd(result, result.source.droppableId)}>
                                        <div>
                                            <div className="row">
                                                <div className="col-lg-6">
                                                    <h4 className="fw-bold">Castwise List</h4>
                                                </div>
                                                <div className="col-lg-6">
                                                    <h5 className="fw-bold text-end">Total : {castWiseLength}</h5>
                                                </div>
                                            </div>
                                            {AllData.map((categoryData, index1) => (
                                                <div key={index1}>
                                                    <h4 className="my-4 fw-bold">{categoryData.category}</h4>
                                                    <Droppable droppableId={String(index1)} type="DATA_TABLE">
                                                        {(provided) => (
                                                            <div ref={provided.innerRef} {...provided.droppableProps}>
                                                                <table className="table table-striped" style={{ tableLayout: "fixed", width: "100%" }}>
                                                                    <thead>
                                                                        <tr>
                                                                            {columns.map((col, colIndex) => (
                                                                                <th
                                                                                    key={colIndex}
                                                                                    style={{
                                                                                        backgroundColor: "#dee2e6",
                                                                                        width: `${100 / (columns.length + 1)}%`,
                                                                                        overflow: "hidden",
                                                                                        textOverflow: "ellipsis",
                                                                                        whiteSpace: "nowrap",
                                                                                        fontWeight: "bold"
                                                                                    }}
                                                                                >
                                                                                    {col.name}
                                                                                </th>
                                                                            ))}
                                                                            {/* {actionRow && (
                                                                                <th
                                                                                    style={{
                                                                                        backgroundColor: "#dee2e6",
                                                                                        width: `${100 / (columns.length + 1)}%`,
                                                                                        overflow: "hidden",
                                                                                        textOverflow: "ellipsis",
                                                                                        whiteSpace: "nowrap",
                                                                                        fontWeight: "bold",
                                                                                        color: "black"
                                                                                    }}
                                                                                >
                                                                                    Action
                                                                                </th>
                                                                            )} */}
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        <>
                                                                            {categoryData.castWisedata.map((row, rowIndex) => (
                                                                                row.ID ? ( // Only make rows draggable if `Id` is present
                                                                                    <Draggable key={row.ID} draggableId={String(row.ID)} index={rowIndex}>
                                                                                        {(provided, snapshot) => (
                                                                                            <tr
                                                                                                ref={provided.innerRef}
                                                                                                {...provided.draggableProps}
                                                                                                {...provided.dragHandleProps}
                                                                                                style={{
                                                                                                    backgroundColor: snapshot.isDragging ? "#e9ecef" : "#f4f4f4",
                                                                                                    transition: "background-color 0.2s ease",
                                                                                                    height: snapshot.isDragging ? "200px" : "50px",
                                                                                                    ...provided.draggableProps.style,
                                                                                                }}
                                                                                                className="draggable-row"
                                                                                            >
                                                                                                {columns.map((col, colIndex) => (
                                                                                                    <td
                                                                                                        key={colIndex}
                                                                                                        style={{
                                                                                                            overflow: "hidden",
                                                                                                            textOverflow: "ellipsis",
                                                                                                            whiteSpace: "nowrap",
                                                                                                            padding: snapshot.isDragging ? "8px 46px" : "8px",
                                                                                                            textAlign: "start",
                                                                                                            verticalAlign: "middle",
                                                                                                        }}
                                                                                                    >
                                                                                                        {col.selector(row)}
                                                                                                    </td>
                                                                                                ))}
                                                                                                {/* {actionRow && (
                                                                                                    <td>
                                                                                                        <button
                                                                                                            className="btn btn-sm"
                                                                                                            onClick={() => handleDeleteRow(index1, row.Id)}
                                                                                                        >
                                                                                                            <Delete className="text-danger" />
                                                                                                        </button>
                                                                                                    </td>
                                                                                                )} */}
                                                                                            </tr>
                                                                                        )}
                                                                                    </Draggable>
                                                                                ) : ( // Render non-draggable row if `Id` is missing
                                                                                    <tr key={rowIndex} style={{ backgroundColor: "#f4f4f4", height: "50px" }}>
                                                                                        {columns.map((col, colIndex) => (
                                                                                            <td
                                                                                                key={colIndex}
                                                                                                style={{
                                                                                                    overflow: "hidden",
                                                                                                    textOverflow: "ellipsis",
                                                                                                    whiteSpace: "nowrap",
                                                                                                    padding: "8px",
                                                                                                    textAlign: "start",
                                                                                                    verticalAlign: "middle",
                                                                                                }}
                                                                                            >
                                                                                                {col.selector(row)}
                                                                                            </td>
                                                                                        ))}
                                                                                        {/* {actionRow && (
                                                                                            <td>
                                                                                                <button
                                                                                                    className="btn btn-sm"
                                                                                                    onClick={() => handleDeleteRow(index1, row.Id)}
                                                                                                >
                                                                                                    <Delete className="text-danger" />
                                                                                                </button>
                                                                                            </td>
                                                                                        )} */}
                                                                                    </tr>
                                                                                )
                                                                            ))}
                                                                            {provided.placeholder}
                                                                        </>
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        )}
                                                    </Droppable>
                                                </div>
                                            ))}
                                        </div>
                                    </DragDropContext>
                                </>
                        }
                    </div>
                </div>
            </div>
        </>
    );
};

export default GroundTest2;
