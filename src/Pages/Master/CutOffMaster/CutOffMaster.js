import React, { useState, useEffect } from "react";
import { Card, Button, Form, Table } from "react-bootstrap";
import { apiClient } from "../../../apiClient";
import ErrorHandler from "../../../Components/ErrorHandler";
import Cookies from "js-cookie";
import InputMask from "react-input-mask";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Select from "react-select";



const CutOffMaster = () => {
  const headerCellStyle = {
    backgroundColor: "rgb(27, 90, 144)",
    color: "#fff",
  };

  const [CutOffData, setCutOffData] = useState([]);
  const [categoryRows, setCategoryRows] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [cutOffData1, setCutOffData1] = useState([]);
  const [allCategoryName, setAllCategoryName] = useState([])
  const [ratio, setRatio] = useState("");
  const [groundCutOff, setGroundCutOff] = useState("");
  const [writtenCutOff, setWrittenCutOff] = useState("");
  const [recruitmentValue, setRecruitmentValue] = useState("");
  const [allRecruitment, setAllRecruitment] = useState([]);
  const [categoryName, setCategoryName] = useState("")
  const RoleName = localStorage.getItem("RoleName");
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Handle changes in cast input fields
  // const handleCastChange = (rowIndex, castIndex, event) => {
  //   const updatedRows = [...categoryRows];
  //   updatedRows[rowIndex].CutOffData[castIndex].inputValue = event.target.value;

  //   // Calculate the sum of all inputValue fields in the CutOffData array for the current row
  //   const total = updatedRows[rowIndex].CutOffData.reduce((sum, cast) => {
  //     return sum + (parseFloat(cast.inputValue) || 0);
  //   }, 0);

  //   // Update the Total field with the calculated sum
  //   updatedRows[rowIndex].Total = total.toFixed(2); // You can choose to round to 2 decimal places

  //   setCategoryRows(updatedRows);
  //   console.log(categoryRows, "rows");
  //   // Update categoryData based on the updatedRows
  //   updateCategoryData(updatedRows);
  // };
  const convertIndicDigitsToWestern = (input) => {
    const indicDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९']; // Covers both Marathi and Hindi
    const westernDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

    return input.replace(/[०-९]/g, (digit) => {
      return westernDigits[indicDigits.indexOf(digit)] || digit;
    });
  };



  const convertWesternToIndicDigits = (input) => {
    const westernDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    const indicDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९']; // Marathi and Hindi digits

    return input.replace(/[0-9]/g, (digit) => {
      return indicDigits[westernDigits.indexOf(digit)] || digit;
    });
  };

  const detectDigitType = (input) => {
    if (/[०-९]/.test(input)) {
      return 'marathi'; // Marathi/Hindi digits detected
    }
    return 'english'; // Default to English digits
  };

  const handleCastChange = (rowIndex, castIndex, event) => {
    const updatedRows = [...categoryRows];

    // Get the input value from the event
    const inputValue = event.target.value;
    updatedRows[rowIndex].CutOffData[castIndex].inputValue = inputValue;

    // Detect the digit type (Marathi/Hindi or English)
    const digitType = detectDigitType(inputValue);

    // Convert the Marathi/Hindi digits to Western digits for calculation
    const convertedInputValue = convertIndicDigitsToWestern(inputValue);

    // Calculate the sum of all inputValue fields in the CutOffData array for the current row
    const total = updatedRows[rowIndex].CutOffData.reduce((sum, cast) => {
      const convertedValue = convertIndicDigitsToWestern(cast.inputValue); // Convert each input before summing
      return sum + (parseFloat(convertedValue) || 0); // Parse after conversion
    }, 0);

    // Convert the Western total back to the detected digit type (Marathi/Hindi or English) for display
    const totalInCorrectDigits = digitType === 'marathi'
      ? convertWesternToIndicDigits(total.toFixed(2))  // Convert to Marathi/Hindi
      : total.toFixed(2); // Keep in English if input was in English

    // Update the Total field with the calculated sum in the correct digit type
    updatedRows[rowIndex].Total = totalInCorrectDigits;

    setCategoryRows(updatedRows);
    console.log(updatedRows, "updated rows");

    // Update categoryData based on the updatedRows
    updateCategoryData(updatedRows);
  };


  // Update categoryData based on the latest categoryRows
  // const updateCategoryData = (updatedRows) => {
  //   console.log(updatedRows, "113")
  //   const newCategoryData = updatedRows.flatMap((row) =>
  //     row.CutOffData.map((cast, index) => ({
  //       total: row.Total,
  //       subCategoryName: row.subCategoryName,
  //       cutOffPosition: cast.inputValue, // Get inputValue from the updated row
  //       parentCastId: cast.value, // Get value from the cast
  //     }))
  //   );
  //   setCategoryData(newCategoryData);
  //   console.log(categoryData, "124")

  // };
  const updateCategoryData = (updatedRows) => {
    // Calculate the vertical totals (sum of each cast's inputValue across rows)
    const castTotals = updatedRows[0]?.CutOffData.map((_, castIndex) =>
      updatedRows.reduce((sum, row) => sum + (parseFloat(row.CutOffData[castIndex]?.inputValue) || 0), 0)
    );

    console.log(castTotals, "Cast Totals"); // Debugging

    // Create new category data with the added castTotal
    const newCategoryData = updatedRows.flatMap((row) =>
      row.CutOffData.map((cast, index) => ({
        total: row.Total,
        subCategoryName: row.subCategoryName,
        cutOffPosition: cast.inputValue, // Get inputValue from the updated row
        parentCastId: cast.value,        // Get value from the cast
        CastTotal: (castTotals[index]).toString()     // Add castTotal for each corresponding cast
      }))
    );

    setCategoryData(newCategoryData);
    console.log(newCategoryData, "Updated Category Data"); // Debugging
  };
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        console.log("RoleName:", RoleName);
        if (RoleName === "Superadmin") {
          await GetAllRecruitment();
        } else {
          console.log("Not Superadmin, skipping GetAllRecruitment call");
        }
        // await getAllData(categoryRows); // Pass categoryRows to fetch related data
        // await getAllRatio(); // Fetch ratio details
        const recruitId = localStorage.getItem("recruitId");
        if (recruitId !== "null") {
          await GetCategoryName();
          await getAllRatio();
        }

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchDetails();
  }, []); // Empty dependency array to ensure this runs once on component mount
  //correct code

  const getAllData = async (selected) => {
    const recruitId = localStorage.getItem("recruitId");
    const userId = localStorage.getItem("userId");

    try {
      const response = await apiClient({
        method: "get",
        url: `CastCutOffService/GetAll`,
        params: { userId, recConfId: recruitId, CategoryId: selected.value },
      });

      const castData = response.data.data.castdata?.value?.data || [];
      const categoryList = response.data.data.categoryList?.value?.data || [];
      const data = response.data.data.data?.value?.data || [];

      console.log(castData, "castData");
      console.log(categoryList, "categoryList");
      console.log(data, "data");

      // Map cast options
      const castOptions = castData.map((cast) => ({
        value: cast.pv_id,
        label: cast.pv_parametervalue,
        inputValue: "",
      }));

      setCutOffData(castOptions);

      // Initialize categoryRows if no data or recruitId mismatch
      // if (!data.length || (data[0]?.RecruitId && data[0].RecruitId !== recruitId)) {
      //   const categoryRows = categoryList.map((category) => ({
      //     CategoryName: category.CategoryName,
      //     subCategoryName: category.Id,
      //     CutOffData: castOptions.map((cast) => ({ ...cast, inputValue: "" })),
      //     Total: "",
      //   }));
      //   console.log(categoryRows, "Initialized categoryRows");
      //   setCategoryRows(categoryRows);
      //   return;
      // }

      // Normalize keys in dataMap
      const dataMap = new Map();
      data.forEach((item) => {
        const key = String(item.SubCategoryName).trim();
        console.log(`Adding to dataMap with key: '${key}'`, item);
        dataMap.set(key, item);
      });

      const isMarathiNumeral = (value) => /^[०-९]+$/.test(value);

      const convertToNumeric = (value) => {
        const marathiDigits = "०१२३४५६७८९";
        const englishDigits = "0123456789";

        if (/^\d+(\.\d+)?$/.test(value)) {
          return parseFloat(value) || 0;
        }

        return parseFloat(
          value
            .split("")
            .map((digit) => englishDigits[marathiDigits.indexOf(digit)] || digit)
            .join("")
        ) || 0;
      };

      const convertTotalToMarathi = (value) => {
        const marathiDigits = "०१२३४५६७८९";
        const englishDigits = "0123456789";

        return value
          .toString()
          .split("")
          .map((digit) => marathiDigits[englishDigits.indexOf(digit)] || digit)
          .join("");
      };

      const categoryRows = categoryList.map((category) => {
        const normalizedCategoryId = String(category.Id).trim();
        console.log(`Looking up dataMap with key: '${normalizedCategoryId}'`);

        // Try both String and Number keys
        const existingData =
          dataMap.get(normalizedCategoryId) ||
          dataMap.get(Number(normalizedCategoryId)) ||
          dataMap.get(String(normalizedCategoryId));

        console.log(existingData, "Existing data for category");

        if (existingData) {
          const cutoffArray = existingData.CutOffData.split(";").map((cutoff) => {
            const [id, label, inputValue] = cutoff.split(":").map((str) => str.trim());
            return { value: id, label, inputValue: inputValue || "" };
          });

          const total = cutoffArray.reduce((sum, current) => sum + convertToNumeric(current.inputValue), 0);
          const hasMarathiInput = cutoffArray.some((item) => isMarathiNumeral(item.inputValue));
          const formattedTotal = hasMarathiInput ? convertTotalToMarathi(total.toFixed(2)) : total.toFixed(2);

          return {
            CategoryName: category.CategoryName,
            subCategoryName: category.Id,
            CutOffData: cutoffArray,
            Total: formattedTotal,
          };
        } else {
          return {
            CategoryName: category.CategoryName,
            subCategoryName: category.Id,
            CutOffData: castOptions.map((cast) => ({ ...cast, inputValue: "" })),
            Total: "",
          };
        }
      });

      setCategoryRows(categoryRows);
      console.log(categoryRows, "Final categoryRows");
      setCutOffData1(categoryRows);
      setCategoryData(categoryRows)

      const token1 = response.data.outcome.tokens;
      Cookies.set("UserCredential", token1, { expires: 7 });

    } catch (error) {
      if (error.response?.data?.outcome) {
        Cookies.set("UserCredential", error.response.data.outcome.tokens, { expires: 7 });
      }
      toast.error(ErrorHandler(error));
    }
  };


  // const AddCutOff = () => {
  //   const recruitId = localStorage.getItem("recruitId");
  //   const UserId = localStorage.getItem("userId");

  //   if (categoryData.length === 0) {
  //     console.error("Category data is empty, nothing to send.");
  //     return;
  //   }

  //   return apiClient({
  //     method: "post",
  //     url: `CastCutOffService/Insert`,
  //     data: {
  //       userId: UserId,
  //       IsActive: "1",
  //       recruitId: recruitId,
  //       categoryId: categoryName.value,
  //       castsdata: categoryData, // Use the populated categoryData here
  //     },
  //   })
  //     .then((response) => {
  //       console.log(response.data.data);
  //       toast.success("Cut-Off added successfully!")
  //       Cookies.set("UserCredential", response.data.outcome.tokens, {
  //         expires: 7,
  //       });
  //       getAllData(categoryName);
  //     })
  //     .catch((error) => {
  //       if (
  //         error.response &&
  //         error.response.data &&
  //         error.response.data.outcome
  //       ) {
  //         Cookies.set("UserCredential", error.response.data.outcome.tokens, {
  //           expires: 7,
  //         });
  //       }
  //       toast.error(ErrorHandler(error));
  //     });
  // };
  // useEffect(() => {
  //   console.log("Category Data Updated: ", categoryData);
  //   setCategoryData([]);
  // }, [categoryData]);
  // const validateData = (categoryData) => {
  //   if (!categoryData.length) {
  //     toast.warning("Please fill data in all fields!");
  //     return false;
  //   }
  //   const hasEmptyFields = categoryData.some(item =>
  //     /* !item.value ||  */ /* item.inputValue === undefined || */
  //     item.inputValue === "");
  //   if (hasEmptyFields) {
  //     toast.warning("Please fill data in all fields!");
  //     return false;
  //   }
  //   return true;
  // };
  // const AddCutOff = async () => {
  //   if (isSubmitting) return;

  //   const recruitId = localStorage.getItem("recruitId");
  //   const userId = localStorage.getItem("userId");

  //   if (recruitId === "null" || !recruitId) {
  //     toast.warning("Please select recruitment");
  //     return;
  //   }

  //   if (!categoryName?.value) {
  //     toast.warning("Please select category");
  //     return;
  //   }

  //   if (!validateData(categoryData)) return;

  //   setIsSubmitting(true);

  //   try {
  //     const response = await apiClient({
  //       method: "post",
  //       url: `CastCutOffService/Insert`,
  //       data: {
  //         userId,
  //         IsActive: "1",
  //         recruitId,
  //         categoryId: categoryName.value,
  //         castsdata: categoryData,
  //       },
  //     });

  //     toast.success("Cut-Off added successfully!");
  //     Cookies.set("UserCredential", response.data.outcome.tokens, { expires: 7 });
  //     await getAllData(categoryName);
  //   } catch (error) {
  //     if (error.response?.data?.outcome) {
  //       Cookies.set("UserCredential", error.response.data.outcome.tokens, { expires: 7 });
  //     }
  //     toast.error(ErrorHandler(error));
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };
  // const AddCutOff = () => {
  //   const recruitId = localStorage.getItem("recruitId");
  //   const UserId = localStorage.getItem("userId");

  //   // Check if recruitment is selected
  //   if (!recruitId || recruitId === "null") {
  //     toast.warning("Please select a recruitment first!");
  //     return;
  //   }

  //   // Check if category is selected
  //   if (!categoryName?.value) {
  //     toast.warning("Please select a category!");
  //     return;
  //   }

  //   // Check if category data exists
  //   if (categoryData.length === 0) {
  //     toast.warning("Please add category data first!");
  //     return;
  //   }

  //   // Check for empty values in categoryData
  //   const hasEmptyValues = categoryData.some(row => {
  //     return Object.values(row).some(value =>
  //       value === "" || value === null || value === undefined
  //     );
  //   });

  //   if (hasEmptyValues) {
  //     toast.warning("Please fill in all cut-off values before submitting!");
  //     return;
  //   }

  //   return apiClient({
  //     method: "post",
  //     url: `CastCutOffService/Insert`,
  //     data: {
  //       userId: UserId,
  //       IsActive: "1",
  //       recruitId: recruitId,
  //       categoryId: categoryName.value,
  //       castsdata: categoryData,
  //     },
  //   })
  //     .then((response) => {
  //       console.log(response.data.data);
  //       toast.success("Cut-Off added successfully!")
  //       if (response.data?.outcome?.tokens) {
  //         Cookies.set("UserCredential", response.data.outcome.tokens, {
  //           expires: 7,
  //         });
  //       }
  //       getAllData(categoryName);
  //     })
  //     .catch((error) => {
  //       if (
  //         error.response?.data?.outcome?.tokens
  //       ) {
  //         Cookies.set("UserCredential", error.response.data.outcome.tokens, {
  //           expires: 7,
  //         });
  //       }
  //       toast.error(ErrorHandler(error));
  //     });
  // };
  const AddCutOff = () => {
    const recruitId = localStorage.getItem("recruitId");
    const UserId = localStorage.getItem("userId");

    if (!recruitId || recruitId === "null" || RoleName === "Superadmin") {
      if (!recruitmentValue) {
        toast.warning("Please select recruitment!");
        return;
      }
    }

    if (!categoryName?.value) {
      toast.warning("Please select a category!");
      return;
    }

    // Refresh categoryData from state before checking
    const updatedCategoryData = [...categoryData];

    if (updatedCategoryData.length === 0) {
      toast.warning("Please add category data first!");
      return;
    }

    const hasEmptyValues = updatedCategoryData.some(row =>
      Object.values(row).some(value => value === "" || value === null || value === undefined)
    );

    if (hasEmptyValues) {
      toast.warning("Please fill in all cut-off values before submitting!");
      return;
    }

    return apiClient({
      method: "post",
      url: `CastCutOffService/Insert`,
      data: {
        userId: UserId,
        IsActive: "1",
        recruitId: recruitId,
        categoryId: categoryName.value,
        castsdata: updatedCategoryData,
      },
    })
      .then((response) => {
        console.log(response.data.data);
        toast.success("Cut-Off added successfully!");
        if (response.data?.outcome?.tokens) {
          Cookies.set("UserCredential", response.data.outcome.tokens, {
            expires: 7,
          });
        }
        getAllData(categoryName);
      })
      .catch((error) => {
        if (error.response?.data?.outcome?.tokens) {
          Cookies.set("UserCredential", error.response.data.outcome.tokens, {
            expires: 7,
          });
        }
        toast.error(ErrorHandler(error));
      });
  };

  const ClearCutOff = () => {
    const clearedCategoryRows = categoryRows.map((row) => ({
      ...row,
      CutOffData: row.CutOffData.map((cast) => ({
        ...cast,
        inputValue: "", // Clear input values
      })),
    }));

    console.log("Cleared categoryRows:", clearedCategoryRows);

    setCategoryRows([...clearedCategoryRows]); // Update categoryRows

    // Ensure categoryData is also cleared to reflect the new empty state
    setCategoryData(prevData =>
      prevData.map(row => ({
        ...row,
        inputValue: "",
      }))
    );
  };

  const getAllRatio = async () => {
    const recruitId = localStorage.getItem("recruitId");
    const UserId = localStorage.getItem("userId");

    try {
      const response = await apiClient({
        method: "get",
        url: `CastCutOffService/GetAllTests`,
        params: {
          userid: UserId,
          recConfId: recruitId,
          // CategoryId: selected.value
        },
      });

      const data = response.data.data;
      console.log(data);
      if (data.length !== 0) {
        setRatio(data[0].Selectionratio);
        setGroundCutOff(data[0].Groundtestcutoff);
        setWrittenCutOff(data[0].Writtentestcutoff);
      }
      else {
        setRatio("");
        setGroundCutOff("");
        setWrittenCutOff("");
      }

      Cookies.set("UserCredential", response.data.outcome.tokens, {
        expires: 7,
      });

      // console.log(data[0]?.RecruitId, "data.RecruitId"); // Check RecruitId if data is not empty

      // Check if data is empty or RecruitId does not match

      // Transform each CutOffData entry
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.outcome
      ) {
        Cookies.set("UserCredential", error.response.data.outcome.tokens, {
          expires: 7,
        });
      }
      toast.error(ErrorHandler(error));
      return [];
    }
  };
  // const AddRatio = () => {
  //   const recruitId = localStorage.getItem("recruitId");
  //   const UserId = localStorage.getItem("userId");

  //   if (ratio === "" || groundCutOff === "" || writtenCutOff === "") {
  //     toast.warning("Please fill data in all fields");
  //     return;
  //   }
  //   if (recruitId === null) {
  //     toast.warning("Please select recruitment");
  //     return;
  //   }
  //   return apiClient({
  //     method: "post",
  //     url: `CastCutOffService/InsertTestCutoff`,
  //     data: {
  //       userId: UserId,
  //       IsActive: "1",
  //       recruitId: recruitId,
  //       selectionratio: ratio,
  //       groundtestcutoff: groundCutOff,
  //       writtentestcutoff: writtenCutOff,
  //       castsdata: [],
  //     },
  //   })
  //     .then((response) => {
  //       console.log(response.data.data);
  //       toast.success("Cut-Off Ratio added successfully!")
  //       Cookies.set("UserCredential", response.data.outcome.tokens, {
  //         expires: 7,
  //       });
  //       // getAllData();
  //     })
  //     .catch((error) => {
  //       if (
  //         error.response &&
  //         error.response.data &&
  //         error.response.data.outcome
  //       ) {
  //         Cookies.set("UserCredential", error.response.data.outcome.tokens, {
  //           expires: 7,
  //         });
  //       }
  //       toast.error(ErrorHandler(error));
  //     });
  // };
  const AddRatio = async () => {
    if (isSubmitting) return;

    const recruitId = localStorage.getItem("recruitId");
    const userId = localStorage.getItem("userId");
    if (!recruitId || recruitId === "null" || RoleName === "Superadmin") {
      if (!recruitmentValue) {
        toast.warning("Please select recruitment!");
        return;
      }
    }
    if (!ratio || !groundCutOff || !writtenCutOff) {
      toast.warning("Please fill data in all fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await apiClient({
        method: "post",
        url: `CastCutOffService/InsertTestCutoff`,
        data: {
          userId,
          IsActive: "1",
          recruitId,
          selectionratio: ratio,
          groundtestcutoff: groundCutOff,
          writtentestcutoff: writtenCutOff,
          castsdata: [],
        },
      });

      toast.success("Cut-Off Ratio added successfully!");
      Cookies.set("UserCredential", response.data.outcome.tokens, { expires: 7 });

      // Reset form
      setRatio('');
      setGroundCutOff('');
      setWrittenCutOff('');

    } catch (error) {
      if (error.response?.data?.outcome) {
        Cookies.set("UserCredential", error.response.data.outcome.tokens, { expires: 7 });
      }
      toast.error(ErrorHandler(error));
    } finally {
      setIsSubmitting(false);
    }
  };
  const ClearRatio = () => {
    setRatio("");
    setGroundCutOff("");
    setWrittenCutOff("");
  }
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

  const GetCategoryName = () => {
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

  const handleCategoryName = (selected) => {
    setCategoryName(selected);
    // getAllRatio(selected)
    getAllData(selected)
  };

  // const handleRecruitmentChange = async (selected, initialCategoryRows) => {
  //   try {
  //     const selectedValue = selected;
  //     setRecruitmentValue(selectedValue);
  //     console.log(selectedValue.value, "selected value");

  //     // Store recruitment ID in localStorage
  //     localStorage.setItem("recruitId", selectedValue.value);
  //     const recruitId = localStorage.getItem("recruitId");
  //     const UserId = localStorage.getItem("userId");

  //     await getAllRatio();
  //     await GetCategoryName();
  //     try {

  //       const response = await apiClient({
  //         method: "get",
  //         url: `CastCutOffService/GetAll`,
  //         params: { userId: UserId, recConfId: recruitId },
  //       });
  //       const castData = response.data.data.castdata?.value?.data || [];
  //       console.log(response.data.data.castdata, "cast data");
  //       const categoryList = response.data.data.categoryList?.value?.data || [];
  //       const data = response.data.data.data?.value?.data || [];

  //       const castOptions = castData.map((cast) => ({
  //         value: cast.pv_id,
  //         label: cast.pv_parametervalue,
  //         inputValue: "",
  //       }));
  //       setCutOffData(castOptions);
  //       console.log(categoryRows, "210");

  //       const isMarathiNumeral = (value) => /^[०-९]+$/.test(value);

  //       const convertToNumeric = (value) => {
  //         const marathiDigits = "०१२३४५६७८९";
  //         const englishDigits = "0123456789";

  //         if (/^\d+(\.\d+)?$/.test(value)) {
  //           return parseFloat(value) || 0;
  //         }

  //         return parseFloat(value
  //           .split("")
  //           .map((digit) => englishDigits[marathiDigits.indexOf(digit)] || digit)
  //           .join("")) || 0;
  //       };

  //       const convertTotalToMarathi = (value) => {
  //         const marathiDigits = "०१२३४५६७८९";
  //         const englishDigits = "0123456789";

  //         return value
  //           .toString()
  //           .split("")
  //           .map((digit) => marathiDigits[englishDigits.indexOf(digit)] || digit)
  //           .join("");
  //       };

  //       const transformedData = data.map((item) => {
  //         const cutoffArray = item.CutOffData.split(";").map((cutoff) => {
  //           const [id, label, inputValue] = cutoff.split(":").map(str => str.trim());
  //           console.log(inputValue, "374");
  //           return { value: id, label, inputValue: inputValue || "" };
  //         });

  //         const total = cutoffArray.reduce((sum, current) => {
  //           return sum + convertToNumeric(current.inputValue);
  //         }, 0);

  //         // Determine if any input is in Marathi
  //         const hasMarathiInput = cutoffArray.some(item => isMarathiNumeral(item.inputValue));

  //         // Format total based on input type
  //         const formattedTotal = hasMarathiInput ? convertTotalToMarathi(total.toFixed(2)) : total.toFixed(2);

  //         return {
  //           ...item,
  //           CutOffData: cutoffArray,
  //           Total: formattedTotal,
  //           categoryId: item.CategoryId,
  //         };
  //       });

  //       setCategoryRows(transformedData);
  //       setCutOffData1(transformedData);
  //       const token1 = response.data.outcome.tokens;
  //       console.log(response.data.outcome.tokens, "102");
  //       Cookies.set("UserCredential", token1, { expires: 7 });
  //     } catch (error) {
  //       if (
  //         error.response &&
  //         error.response.data &&
  //         error.response.data.outcome
  //       ) {
  //         Cookies.set("UserCredential", error.response.data.outcome.tokens, {
  //           expires: 7,
  //         });
  //       }
  //       console.error("Error in API call:", error);
  //       // You might want to add some user-friendly error handling here
  //     }
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //     // Handle errors (e.g., with a message to the user)
  //   }
  // };
  const handleRecruitmentChange = async (selected) => {
    try {
      setRecruitmentValue(selected);
      localStorage.setItem("recruitId", selected.value);

      const recruitId = selected.value;
      const UserId = localStorage.getItem("userId");

      // Sequential API calls
      await GetCategoryName();
      await getAllRatio();

      // const response = await apiClient({
      //   method: "get",
      //   url: `CastCutOffService/GetAll`,
      //   params: { userId: UserId, recConfId: recruitId },
      // });

      // const { data: responseData } = response.data;
      // const castData = responseData.castdata?.value?.data || [];

      // const castOptions = castData.map(cast => ({
      //   value: cast.pv_id,
      //   label: cast.pv_parametervalue,
      //   inputValue: "",
      // }));

      // const transformData = (items) => {
      //   const isMarathiNumeral = value => /^[०-९]+$/.test(value);
      //   const convertToNumeric = value => {
      //     if (/^\d+(\.\d+)?$/.test(value)) return parseFloat(value) || 0;
      //     const marathiToEnglish = str => {
      //       const marathiDigits = "०१२३४५६७८९";
      //       const englishDigits = "0123456789";
      //       return parseFloat(str.split("").map(d => 
      //         englishDigits[marathiDigits.indexOf(d)] || d).join("")) || 0;
      //     };
      //     return marathiToEnglish(value);
      //   };

      //   const toMarathi = value => {
      //     const marathiDigits = "०१२३४५६७८९";
      //     return value.toString().split("").map(d => 
      //       marathiDigits[d] || d).join("");
      //   };

      //   return items.map(item => {
      //     const cutoffArray = item.CutOffData.split(";").map(cutoff => {
      //       const [id, label, inputValue] = cutoff.split(":");
      //       return { value: id.trim(), label: label.trim(), inputValue: inputValue?.trim() || "" };
      //     });

      //     const total = cutoffArray.reduce((sum, curr) => 
      //       sum + convertToNumeric(curr.inputValue), 0);

      //     const hasMarathi = cutoffArray.some(item => isMarathiNumeral(item.inputValue));
      //     const formattedTotal = hasMarathi ? toMarathi(total.toFixed(2)) : total.toFixed(2);

      //     return {
      //       ...item,
      //       CutOffData: cutoffArray,
      //       Total: formattedTotal,
      //       categoryId: item.CategoryId,
      //     };
      //   });
      // };

      // const transformedData = transformData(responseData.data?.value?.data || []);

      // setCutOffData(castOptions);
      // setCategoryRows(transformedData);
      // setCutOffData1(transformedData);

      // Cookies.set("UserCredential", response.data.outcome.tokens, { expires: 7 });

    } catch (error) {
      if (error.response?.data?.outcome) {
        Cookies.set("UserCredential", error.response.data.outcome.tokens, { expires: 7 });
      }
      console.error("Error:", error);
    }
  };
  return (
    <>
      <div className="container-fluid p-3">
        <Card className="mb-4">
          <Card.Header>
            {/* <h5 className="fw-bold">Add Cut Off Master</h5> */}
            <div className="row">
              <div className="col-lg-5 mt-2">
                <h4 className="fw-bold">Cut Off Master</h4>
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
          </Card.Header>
          <Card.Body>
            <div className="row">
              <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 mt-2 mt-lg-0">
                <div className="row">
                  <div className="col-xl-3 col-lg-4 col-md-4">
                    <div className="form-group form-group-sm">
                      <label className="control-label fw-bold">
                        Written test selection ratio:
                      </label>{" "}
                      <span className="text-danger fw-bold">*</span>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-4 mt-lg-0 mt-md-0 mt-3">
                    {/* <input
                    type="text"
                    id="ratio"
                    name="ratio"
                    className="form-control"
                    autoComplete="off"
                    placeholder="Enter Written test selection ratio"
                    value={ratio}
                    onChange={(e) => setRatio(e.target.value)}
                  /> */}
                    <InputMask
                      className="form-control"
                      id="ratio"
                      name="ratio"
                      mask="99:99"
                      value={ratio}
                      onChange={(e) => setRatio(e.target.value)}
                      placeholder="Enter Ratio (e.g., 01:02)"
                      maskChar={null}
                    />
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-xl-3 col-lg-4 col-md-4">
                    <div className="form-group form-group-sm">
                      <label className="control-label fw-bold">
                        Ground test cut-off:
                      </label>{" "}
                      <span className="text-danger fw-bold">*</span>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-4 mt-lg-0 mt-md-0 mt-3">
                    <input
                      type="text"
                      id="groundCutOff"
                      name="groundCutOff"
                      className="form-control"
                      autoComplete="off"
                      placeholder="Enter Ground test cut-off"
                      maxLength={4}
                      value={groundCutOff}
                      // onChange={(e) => setGroundCutOff(e.target.value)}
                      onChange={(e) => {
                        const value = e.target.value;
                        // Allow only numeric characters
                        if (/^\d*$/.test(value)) {
                          setGroundCutOff(value);
                        }
                      }}
                    />
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-xl-3 col-lg-4 col-md-4">
                    <div className="form-group form-group-sm">
                      <label className="control-label fw-bold">
                        Written test cut-off:
                      </label>{" "}
                      <span className="text-danger fw-bold">*</span>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-4 mt-lg-0 mt-md-0 mt-3">
                    <input
                      type="text"
                      id="writtenCutOff"
                      name="writtenCutOff"
                      className="form-control"
                      autoComplete="off"
                      placeholder="Enter Written test cut-off"
                      maxLength={4}
                      value={writtenCutOff}
                      // onChange={(e) => setWrittenCutOff(e.target.value)}
                      onChange={(e) => {
                        const value = e.target.value;
                        // Allow only numeric characters
                        if (/^\d*$/.test(value)) {
                          setWrittenCutOff(value);
                        }
                      }}
                    />
                  </div>
                </div>
                {/* <div className="row mt-3 float-end text-end">
              
                  <div className="col-lg-6  mt-2">
                    <Button
                      className="text-light "
                      style={{ backgroundColor: "#1B5A90" }}
                      onClick={AddRatio}
                    >
                      Save
                    </Button>
                    <Button
                      className="btn-secondary "
                   
                      onClick={ClearRatio}
                    >
                      Clear
                    </Button>
                  </div>
                </div> */}
                <Card.Footer className="text-end mt-3">
                  <Button
                    className="text-light me-3 "
                    style={{ backgroundColor: "#1B5A90" }}
                    onClick={AddRatio}
                  >
                    Save
                  </Button>
                  <Button
                    className="btn-secondary "
                    // style={{ backgroundColor: "#1B5A90" }}
                    onClick={ClearRatio}
                  >
                    Clear
                  </Button>
                </Card.Footer>
              </div>
            </div>
            <hr />
            <div className="row mt-4">
              <div className="col-xl-2 col-lg-4 col-4"><label className="fw-bold">Category Name:</label></div>
              <div className="col-xl-3 col-lg-4 col-4"> <Select
                className=""
                value={categoryName}
                onChange={handleCategoryName}
                options={allCategoryName}
                placeholder="Select Category Name"

              /></div>

            </div>
            <Table striped bordered responsive hover className="mt-5">
              <thead>
                <tr>
                  <th style={headerCellStyle} className="text-white">
                    Category Name
                  </th>
                  {CutOffData.map((cast, index) => (
                    <th
                      key={index}
                      style={headerCellStyle}
                      className="text-white"
                    >
                      {cast.label}
                    </th>
                  ))}
                  <th style={headerCellStyle} className="text-white">
                    Total
                  </th>
                </tr>
              </thead>
              {/* <tbody>
                {categoryRows.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    <td>{row.CategoryName}</td>
                    {row.CutOffData.map((cast, castIndex) => {
                      // console.log(`Rendering cast data: RowIndex = ${rowIndex}, CastIndex = ${castIndex}`, cast);

                      return (
                        <td key={castIndex}>
                          <Form.Group className="form-group-sm">
                            <Form.Control
                              type="text"
                              name={`cast_${cast.value}`}
                              placeholder={cast.label}
                              value={cast.inputValue}
                              onChange={(e) => {
                                console.log(`Input changed: RowIndex = ${rowIndex}, CastIndex = ${castIndex}, Value = ${e.target.value}`);
                                handleCastChange(rowIndex, castIndex, e);
                              }}
                            />
                          </Form.Group>
                        </td>
                      );
                    })}
                    <td>
                      <Form.Group className="form-group-sm">
                        <Form.Control
                          type="text"
                          name="Total"
                          placeholder="Total"
                          value={row.Total}
                          readOnly
                        />
                      </Form.Group>
                    </td>
                  </tr>
                ))}
              </tbody> */}
              <tbody>
                {categoryRows.map((row, rowIndex) => {
                  return (
                    <tr key={rowIndex}>
                      <td>{row.CategoryName}</td>
                      {row.CutOffData.map((cast, castIndex) => (
                        <td key={castIndex}>
                          <Form.Group className="form-group-sm">
                            <Form.Control
                              type="text"
                              name={`cast_${cast.value}`}
                              placeholder={cast.label}
                              value={cast.inputValue}
                              onChange={(e) => handleCastChange(rowIndex, castIndex, e)}
                              maxLength={4}
                              onInput={(e) => (e.target.value = e.target.value.replace(/[^0-9]/g, ""))}
                            />
                          </Form.Group>
                        </td>
                      ))}
                      <td>
                        <Form.Group className="form-group-sm">
                          <Form.Control
                            type="text"
                            name="Total"
                            placeholder="Total"
                            value={row.CutOffData.reduce((sum, cast) => sum + (parseFloat(cast.inputValue) || 0), 0)}
                            readOnly
                          />
                        </Form.Group>
                      </td>
                    </tr>
                  );
                })}

                {/* Add Total row */}
                <tr>
                  <td>Total</td>
                  {categoryRows[0]?.CutOffData.map((_, castIndex) => (
                    <td key={castIndex}>
                      <Form.Group className="form-group-sm">
                        <Form.Control
                          type="text"
                          name={`total_cast_${castIndex}`}
                          placeholder="Total"
                          value={categoryRows.reduce(
                            (sum, row) => sum + (parseFloat(row.CutOffData[castIndex]?.inputValue) || 0),
                            0
                          )}
                          readOnly
                        />
                      </Form.Group>
                    </td>
                  ))}
                  <td>
                    <Form.Group className="form-group-sm">
                      <Form.Control
                        type="text"
                        name="GrandTotal"
                        placeholder="Grand Total"
                        value={categoryRows.reduce((totalSum, row) =>
                          totalSum + row.CutOffData.reduce((sum, cast) => sum + (parseFloat(cast.inputValue) || 0), 0), 0)}
                        readOnly
                      />
                    </Form.Group>
                  </td>
                </tr>
              </tbody>

            </Table>
          </Card.Body>
          <Card.Footer className="text-end">
            <Button
              className="text-light me-3"
              style={{ backgroundColor: "#1B5A90" }}
              onClick={() => {

                AddCutOff();
              }}
            >
              Save
            </Button>
            <Button
              className="btn-secondary"
              // style={{ backgroundColor: "#1B5A90" }}
              onClick={() => {

                ClearCutOff();
              }}
            >
              Clear
            </Button>
          </Card.Footer>
        </Card>
      </div>

    </>

  );
};

export default CutOffMaster;
