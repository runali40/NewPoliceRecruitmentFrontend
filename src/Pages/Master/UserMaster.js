import React, { useState, useEffect, useRef } from "react";
import { Table, Modal, Form, Row, Col, Button } from "react-bootstrap";
import { Add, Delete, Edit } from "@material-ui/icons";
import Select from "react-select";
import CryptoJS from "crypto-js";
import {
  getAllData,
  getAllRole,
  addUser,
  getUser,
  deleteUser,
  getAllPost,
  getAllDuty,
} from "../../Components/Api/UserMasterApi";
import { Pagination } from "../../Components/Utils/Pagination";
import * as XLSX from "xlsx";
import UrlData from "../../UrlData";
import Storage from "../../Storage";
import { apiClient } from "../../apiClient";
import ErrorHandler from "../../Components/ErrorHandler";
import Cookies from 'js-cookie';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Eye, EyeSlash } from "react-bootstrap-icons";

const UserMaster = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [userName, setUserName] = useState("");
  const [bukkelNo, setBukkelNo] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [post, setPost] = useState("");
  const [allPost, setAllPost] = useState([]);
  const [allRole, setAllRole] = useState([]);
  const [role, setRole] = useState("");
  const [allDuty, setAllDuty] = useState([]);
  const [duty, setDuty] = useState("");
  const [active, setActive] = useState(true);
  const [toggleActive, setToggleActive] = useState(true);
  const [allUsers, setAllUsers] = useState([]);
  const [allStaff, setAllStaff] = useState([]);
  const [staff, setStaff] = useState("");
  const [umId, setUmId] = useState("");
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [file, setFile] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [recruitmentValue, setRecruitmentValue] = useState("");
  const [allRecruitment, setAllRecruitment] = useState([]);
  const RoleName = localStorage.getItem("RoleName");
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false);
  const [secretKey, setSecretKey] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const handleCloseModal = () => setShowErrorModal(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleShow = async () => {
    setShowModal(true);
    try {
      // Fetch data sequentially
      const rolesData = await getAllRole(toggleActive);
      const dutyData = await getAllDuty(toggleActive);
      const postData = await getAllPost(toggleActive);

      // Batch state updates
      setAllRole(rolesData);
      setAllDuty(dutyData);
      setAllPost(postData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }

  };

  const handleClose = () => setShowModal(false);

  const headerCellStyle = {
    backgroundColor: "rgb(27, 90, 144)",
    color: "#fff",
  };
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
          await getAllData(toggleActive).then(setAllUsers);
        }


      } catch (error) {
        console.error("Error fetching data:", error);
      }

    };

    fetchData();
  }, [toggleActive]);
  const STORAGE_KEY = "passowrdEncrytKey";
  // useEffect(() => {
  //   const storedKey = localStorage.getItem(STORAGE_KEY);
  //   if (storedKey) {
  //     setSecretKey(storedKey);
  //     alert("Secret key loaded successfully");
  //   } else {
  //     const newKey = CryptoJS.lib.WordArray.random(32).toString(CryptoJS.enc.Hex);
  //     localStorage.setItem(STORAGE_KEY, newKey);
  //     setSecretKey(newKey);
  //     alert("New secret key generated");
  //   }
  // }, []);

  // // Simplified encryption function
  // const encryptPassword = (plainPassword) => {
  //   if (!plainPassword || !secretKey) {
  //     console.error("Missing password or secret key");
  //     return null;
  //   }

  //   try {
  //     // Use direct string encryption
  //     const encrypted = CryptoJS.AES.encrypt(plainPassword, secretKey).toString();
  //     console.log("Encryption successful");
  //     return encrypted;
  //   } catch (error) {
  //     console.error("Encryption failed:", error);
  //     return null;
  //   }
  // };

  // // Simplified decryption function
  // const decryptPassword = (encryptedData) => {
  //   if (!encryptedData || !secretKey) {
  //     console.error("Missing encrypted data or secret key");
  //     return null;
  //   }

  //   try {
  //     // Use direct string decryption
  //     const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
  //     const decrypted = bytes.toString(CryptoJS.enc.Utf8);

  //     if (!decrypted) {
  //       throw new Error("Decryption produced empty result");
  //     }

  //     console.log("Decryption successful");
  //     return decrypted;
  //   } catch (error) {
  //     console.error("Decryption failed:", error);

  //     // Try alternative decryption for legacy data
  //     try {
  //       const cleanedData = encryptedData.replace(/[\s\n\r]/g, ''); // Remove whitespace/newline
  //       const bytes = CryptoJS.AES.decrypt(cleanedData, secretKey);
  //       const decrypted = bytes.toString(CryptoJS.enc.Utf8);

  //       if (!decrypted) {
  //         throw new Error("Legacy decryption produced empty result");
  //       }

  //       console.log("Legacy decryption successful");
  //       return decrypted;
  //     } catch (legacyError) {
  //       console.error("Legacy decryption failed:", legacyError);
  //       return null;
  //     }
  //   }
  // };
  useEffect(() => {
    const storedKey = localStorage.getItem(STORAGE_KEY);
    if (storedKey) {
      setSecretKey(storedKey);
      console.log("Secret key loaded successfully");
    } else {
      const newKey = CryptoJS.lib.WordArray.random(32).toString(CryptoJS.enc.Hex);
      localStorage.setItem(STORAGE_KEY, newKey);
      setSecretKey(newKey);
      console.log("New secret key generated");
    }
  }, []);

  // Define a constant IV
  const IV = CryptoJS.lib.WordArray.random(16).toString(CryptoJS.enc.Hex);
  //13-12-24
  // Updated encryption function
  // Updated encryption function
  // const encryptPassword = (plainPassword) => {
  //   if (!plainPassword || !secretKey) {
  //     console.error("Missing password or secret key");
  //     return null;
  //   }

  //   try {
  //     // Generate a random IV for encryption
  //     const iv = CryptoJS.lib.WordArray.random(16); // Create an IV
  //     const encrypted = CryptoJS.AES.encrypt(plainPassword, CryptoJS.enc.Hex.parse(secretKey), {
  //       iv: iv
  //     });

  //     // Concatenate IV and encrypted password for storage
  //     const ivAndEncrypted = iv.concat(encrypted.ciphertext).toString(CryptoJS.enc.Base64);
  //     console.log("Encryption successful");
  //     return ivAndEncrypted; // Return the concatenated IV and encrypted password
  //   } catch (error) {
  //     console.error("Encryption failed:", error);
  //     return null;
  //   }
  // };

  // // Updated decryption function
  // const decryptPassword = (encryptedData) => {
  //   if (!encryptedData || !secretKey) {
  //     console.error("Missing encrypted data or secret key");
  //     return null;
  //   }

  //   try {
  //     // Decode the data from Base64
  //     const data = CryptoJS.enc.Base64.parse(encryptedData);
  //     const iv = CryptoJS.lib.WordArray.create(data.words.slice(0, 4), 16); // Get the IV (first 16 bytes)
  //     const ciphertext = CryptoJS.lib.WordArray.create(data.words.slice(4), data.sigBytes - 16); // Get the ciphertext

  //     const decrypted = CryptoJS.AES.decrypt(
  //       { ciphertext: ciphertext },
  //       CryptoJS.enc.Hex.parse(secretKey),
  //       { iv: iv }
  //     ).toString(CryptoJS.enc.Utf8);

  //     if (!decrypted) {
  //       throw new Error("Decryption produced empty result");
  //     }

  //     console.log("Decryption successful");
  //     return decrypted;
  //   } catch (error) {
  //     console.error("Decryption failed:", error);
  //     return null;
  //   }
  // };

  // const plaintext = "1234565434";
  // const encryptedPassword = encryptPassword(plaintext);
  // console.log("180", encryptedPassword);
  // const decryptedPassword = decryptPassword(encryptedPassword);
  // console.log(decryptedPassword, "182")

  // console.log("Decrypted Password:", decryptedPassword);
  // const testEncryption = () => {
  //   const testPass = "testPassword123";
  //   console.log("Testing with password:", testPass);
  //   const encrypted = encryptPassword(testPass);
  //   console.log("Encrypted:", encrypted);
  //   const decrypted = decryptPassword(encrypted);
  //   console.log("Decrypted:", decrypted);
  //   console.log("Test result:", testPass === decrypted ? "SUCCESS" : "FAILED");
  // };
  // const hardcodedEncryptedPassword = "mWuSAUqlKfqicjzkOkK6OtOYIdp66kxQ5JSBLfU4VvM=";

  // const decryptedPassword1 = decryptPassword(hardcodedEncryptedPassword);
  // console.log("Decrypted Password from hardcoded value:", decryptedPassword1);

  // // Run test in development
  // useEffect(() => {
  //   if (process.env.NODE_ENV === 'development' && secretKey) {
  //     testEncryption();
  //   }
  // }, [secretKey]);
  //13-12-24

  const AddUser = () => {
    const recruitId = localStorage.getItem("recruitId");
    const UserId = localStorage.getItem("userId");
    console.log(password)
    // const encryptedPassword = encryptPassword(password);
    let data;
    // if (staff === "") {
    //   alert("Please enter employee code!");
    // } else
    if (userName === "" || staff === "" || bukkelNo === "" || phoneNo === "" || role === "" || post === "" || duty === "") {
      toast.warning("Please fill data in all fields!");
    } else {
      data = {
        userId: UserId,
        um_recruitid: recruitId,
        um_user_name: userName,
        // um_password: encryptedPassword,
        // um_password: password,
        um_staffname: staff,
        um_bukkel_no: bukkelNo,
        um_phone_no: phoneNo,
        um_isactive: active ? "1" : "2",
        um_roleid: role.value,
        um_rolename: role.label,
        um_post: post.value,
        um_duty: duty.value,
      };
      if (umId) {
        data.um_id = umId;
      }
      addUser(data).then(() => {
        getAllData(toggleActive).then(setAllUsers);
        handleClose();
        resetForm();
      });
    }
  };

  const AddUserNavigate = () => {
    const recruitId = localStorage.getItem("recruitId");
    if (recruitId === "null" || RoleName === "Superadmin") {
      if (!recruitmentValue) {
        toast.warning("Please select recruitment!");
        return;
      }
    }
    handleShow();
    resetForm();
  };

  const GetUser = (umId) => {
    getUser(umId).then((data) => {
      console.log("data", data);

      if (data) {
        console.log(data.um_password, "um password");

        console.log("Encrypted password from DB:", data.um_password);

        // const decryptedPassword = decryptPassword(data.um_password);
        // console.log("Decryption attempt result:", decryptedPassword);

        // if (!decryptedPassword) {
        //   toast.error("Failed to decrypt password");
        //   return;
        // }
        // console.log(decryptedPassword, "decrypted password");
        setStaff(data.um_staffname);
        setUserName(data.um_user_name);
        setBukkelNo(data.um_bukkel_no);
        setPhoneNo(data.um_phone_no);
        // setPassword(decryptedPassword);
        setPost({
          value: data.um_post,
          label: data.um_postname,
        });
        setRole({
          value: data.um_roleid,
          label: data.um_rolename,
        });
        setDuty({
          value: data.um_duty_id,
          label: data.um_dutyname,
        });
        setUmId(umId);
        handleShow();
      }
    });
  };

  const DeleteUser = (umId) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this user?");
    if (!isConfirmed) return;
    deleteUser(umId).then(() => getAllData(toggleActive).then(setAllUsers));
  };

  const handleRole = (selected) => {
    setRole(selected);
  };

  const handleDuty = (selected) => {
    setDuty(selected);
  };

  const handlePost = (selected) => {
    setPost(selected);
  };

  const handleSearch = (e) => {
    const searchDataValue = e.target.value.toLowerCase();
    setSearchValue(searchDataValue);
    if (searchDataValue.trim() === "") {
      getAllData(toggleActive).then(setAllUsers);
    } else {
      const filterData = allUsers.filter(
        (users) =>
          users.um_staffname.toLowerCase().includes(searchDataValue) ||
          users.um_user_name.toLowerCase().includes(searchDataValue)
      );
      setAllUsers(filterData);
      setCurrentPage(1);
    }
  };

  const handleChange = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };
  // const handleFileChange = async (e) => {
  //   const recruitId = localStorage.getItem("recruitId");
  //   e.preventDefault();
  //   const selectedFile = e.target.files[0];
  //   console.log(selectedFile, "file change");

  //   // Use a callback to ensure the file is updated before the upload logic runs
  //   setFile(selectedFile);

  //   // Create a new function to handle the upload
  //   const uploadFile = async (fileToUpload) => {
  //     const UserId = localStorage.getItem("userId");
  //     if (!fileToUpload) {
  //       console.error("File field is required");
  //       return;
  //     }

  //     const formData = new FormData();
  //     formData.append("file", fileToUpload);
  //     formData.append("UserId", UserId);
  //     formData.append("um_recruitid", recruitId);

  //     console.log(...formData, "formdata");

  //     try {
  //       const response = await apiClient.post(
  //         `UserMaster/upload`,
  //         formData,
  //         {}
  //       );

  //       if (response.status === 200) {
  //         const result = response.data;
  //         console.log("Success:", result);

  //         const token1 = result.outcome.tokens;
  //         Cookies.set("UserCredential", token1, { expires: 7 });
  //         getAllData().then((data) => {
  //           setAllUsers(data);
  //           toast.success(`Success: User import has completed. ${data.length} records were successfully processed`);
  //         });
  //       } else {
  //         console.error("Error:", response.statusText);
  //       }
  //     } catch (error) {
  //       if (error.response && error.response.data && error.response.data.outcome) {
  //         const token1 = error.response.data.outcome.tokens;
  //         Cookies.set("UserCredential", token1, { expires: 7 });
  //       }
  //       console.error("Error:", error);
  //       const errors = ErrorHandler(error);
  //       toast.error(errors);
  //     }
  //   };

  //   // Call the upload function with the selected file
  //   uploadFile(selectedFile);
  // };
  const handleFileChange = async (e) => {
    e.preventDefault();
    const recruitId = localStorage.getItem("recruitId");
    const selectedFile = e.target.files[0];

    if (!selectedFile) {
      toast.warning("Please select a file to upload.");
      return;
    }

    setFile(selectedFile);

    const uploadFile = async (fileToUpload) => {
      const UserId = localStorage.getItem("userId");

      const formData = new FormData();
      formData.append("file", fileToUpload);
      formData.append("UserId", UserId);
      formData.append("um_recruitid", recruitId);

      try {
        const response = await apiClient.post(`UserMaster/upload`, formData, {});

        if (response.status === 200) {
          console.log("Full API Response:", JSON.stringify(response.data, null, 2));

          const result = response.data;

          if (result.outcome?.tokens) {
            Cookies.set("UserCredential", result.outcome.tokens, { expires: 7 });
          }

          const fileReader = new FileReader();

          fileReader.onload = async (event) => {
            const fileContent = event.target.result;
            const processedRecords = fileContent.split('\n').length - 1;

            toast.success(
              `Success: User import completed.`
            );

            // Refresh the user list
            const updatedData = await getAllData(toggleActive);
            setAllUsers(updatedData);

            // Reset the file input after successful upload
            if (fileInputRef.current) {
              fileInputRef.current.value = '';
            }
          };

          fileReader.onerror = () => {
            toast.error("Error reading file content");
            if (fileInputRef.current) {
              fileInputRef.current.value = '';
            }
          };

          // Read the file as text
          fileReader.readAsText(fileToUpload);

        } else {
          console.error("Error:", response.statusText);
          toast.error("Upload failed. Please try again.");
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        }
      } catch (error) {
        if (error.response?.data?.outcome?.tokens) {
          Cookies.set("UserCredential", error.response.data.outcome.tokens, {
            expires: 7,
          });
        }
        console.error("Error:", error.response?.status);

        if (error.response?.status === 500) {
          toast.error("Excel import failed: Please check and re-upload a valid excel file.");
        }
        else if (error.response?.status === 400) {
          toast.error("Please upload a file of type: .xls, .xlsx, .xlsm, .csv");
        }
        else if (error.response?.status === 422) {
          toast.error("No data in the excel!");
        }
        else if (error.response?.status === 409) {
          // toast.error("Record already exists!");
          console.log(error.response?.data)
          setErrorMessage(error.response?.data);
          setShowErrorModal(true);
        }
        else {
          const errors = ErrorHandler(error);
          toast.error(errors);
        }

        // Reset file input on error
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    };

    await uploadFile(selectedFile);
  };

  const handleCheckboxChange = (um_id) => {
    setSelectedIds((prevSelectedIds) => {
      if (prevSelectedIds.includes(um_id)) {
        return prevSelectedIds.filter((id) => id !== um_id);
      } else {
        return [...prevSelectedIds, um_id];
      }
    });
  };

  const handleSelectAll = () => {
    if (isAllChecked) {
      setSelectedIds([]); // Uncheck all
    } else {
      setSelectedIds(currentItems.map((item) => item.um_id)); // Check all
    }
    setIsAllChecked(!isAllChecked);
  };

  const AddShuffle = () => {
    const recruitId = localStorage.getItem("recruitId");
    const UserId = localStorage.getItem("userId");
    if (!recruitId || recruitId === "null" || RoleName === "Superadmin") {
      if (!recruitmentValue) {
        toast.warning("Please select recruitment!");
        return;
      }
    }
    if (allUsers.length === 0) {
      toast.warning("User not present in the grid!");
      return;
    }

    // Check if at least two users are selected
    if (selectedIds.length < 2) {
      toast.warning("Please select at least two users!");
      return;
    }

    const idsString = selectedIds.join(",");
    // Proceed with API call if all checks pass
    apiClient({
      method: "get",
      url: "UserMaster/Shuffle",
      params: {
        UserId: UserId,
        um_recruitid: recruitId,
        s_umids: idsString,
      },
    })
      .then((response) => {
        console.log("response all shuffle", response.data.data);
        toast.success("User shuffle successfully!");
        const token1 = response.data.outcome.tokens;
        Cookies.set("UserCredential", token1, { expires: 7 });
        getAllData(toggleActive).then(setAllUsers);
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

  // const fileInputRef = useRef(null);

  // const handleUploadClick = () => {
  //   const recruitId = localStorage.getItem("recruitId");
  //   if (recruitId === "null") {
  //     toast.warning("Please select recruitment!")
  //   }
  //   else {
  //     fileInputRef.current.click();
  //   }
  // };
  const fileInputRef = useRef(null);

  // const handleUploadClick = () => {
  //   const recruitId = localStorage.getItem("recruitId");
  //   if (recruitId === "null" || RoleName === "Superadmin") {
  //     if (!recruitmentValue) {
  //       toast.warning("Please select recruitment!");
  //       return;
  //     }
  //   }
  //   else {
  //     // Reset the file input before clicking
  //     if (fileInputRef.current) {
  //       fileInputRef.current.value = '';
  //     }
  //     fileInputRef.current.click();
  //   }
  // };
  const handleUploadClick = () => {
    const recruitId = localStorage.getItem("recruitId");

    if (!recruitId || recruitId === "null" || RoleName === "Superadmin") {
      if (!recruitmentValue) {
        toast.warning("Please select recruitment!");
        return;
      }
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = null; // Reset file input
      fileInputRef.current.click(); // Trigger file input dialog
    }
  };

  const exportData = (data, filename = "User List.xlsx") => {
    if (!data || data.length === 0) {
      alert("No data available to export.");
      return;
    }

    // Format data for Excel
    const formattedData = data.map((item, index) => ({
      "Sr. No": index + 1, // Generate Sr. No based on index
      "Username": item.um_user_name, // Include Application No
      "Bukkel No": `${item.um_bukkel_no}`, // Combine FirstName and Surname
      "Password": `${item.um_password}`,
      "Duty": `${item.um_dutyname}`
      // "Chest No.": `${item.chestno}`
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "UserList");
    XLSX.writeFile(workbook, filename);
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
    apiClient({
      method: "get",
      url: (`UserMaster/GetAll`).toString(),
      params: {
        UserId: UserId,
        um_recruitid: recruitId,
        um_isactive: active ? "1" : "2"
      },
    })
      .then((response) => {
        console.log("get all candidate by recruitment", response.data.data);
        const token1 = response.data.outcome.tokens;
        Cookies.set("UserCredential", token1, { expires: 7 });
        const temp = response.data.data;
        setAllUsers(temp)
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

  const resetForm = () => {
    setStaff("");
    setPost("");
    setUserName("");
    setUmId("");
    setBukkelNo("");
    setPhoneNo("");
    setDuty("");
    setPassword("");
    setRole("")
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = allUsers.slice(indexOfFirstItem, indexOfLastItem);
  const isShuffleDisabled = selectedIds.length > 0 && selectedIds.some((id) => {
    // Log the ID being checked
    console.log("Checking ID:", id);

    // Find the corresponding item
    const item = currentItems.find((itm) => itm.um_id === id);

    // Log the found item (if any)
    console.log("Found item:", item);

    // Return true if item is inactive
    return item && item.um_isactive === "Inactive";
  });

  console.log("isShuffleDisabled:", isShuffleDisabled);
  return (
    <>
      <div className="container-fluid">
        <div
          className="card m-3"
          style={{ boxShadow: "0px 1px 5px rgba(0, 0, 0, 0.1)" }}
        >
          <div className="row">
            <div className="col-lg-12 col-md-12">
              <div className="card-header">
                <div className="row align-items-center">
                  <div className="col-lg-3 col-md-3">
                    <h4 className="card-title fw-bold">User Master</h4>
                  </div>
                  <div className="col-lg-9 col-md-9 d-flex justify-content-end align-items-end">
                    <div className="form-check form-switch mb-3">
                      {/* <input
                        className="form-check-input"
                        type="checkbox"
                        id="flexSwitchCheckDefault"
                        checked={toggleActive}
                        onChange={() => setToggleActive(!toggleActive)}
                      /> */}
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="flexSwitchCheckDefault"
                        checked={toggleActive}
                        onChange={() => setToggleActive(!toggleActive)}
                      />
                    </div>
                    <div className="btn btn-add me-2" title="Add New">
                      <button
                        type="button"
                        className="btn btn-primary"
                        style={{ backgroundColor: "#1B5A90" }}
                        onClick={AddUserNavigate}
                      >
                        <Add />
                      </button>
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

                    <div className="btn btn-add me-1" title="Import">
                      <input
                        className="form-control"
                        type="file"
                        onChange={handleFileChange}
                        ref={fileInputRef}
                        style={{ display: "none" }}
                      />
                      <Button
                        onClick={handleUploadClick}
                        style={{ backgroundColor: "#1B5A90" }}
                      >
                        Import
                      </Button>
                    </div>
                    <div className="btn btn-add me-1" title="Export">
                      {/* <input
                        className="form-control"
                        type="file"
                        onChange={handleFileChange}
                        ref={fileInputRef}
                        style={{ display: "none" }}
                      /> */}
                      <Button
                        // onClick={exportData}
                        onClick={() => exportData(allUsers, "User List.xlsx")}
                        style={{ backgroundColor: "#1B5A90" }}
                      >
                        Export
                      </Button>
                    </div>
                    <div className="btn btn-add" title="Shuffle">
                      {/* <button
                        type="button"
                        className="btn btn-primary"
                        style={{ backgroundColor: "#1B5A90" }}
                        onClick={AddShuffle}
                      >
                        Shuffle
                      </button> */}
                      <button
                        type="button"
                        className="btn btn-primary"
                        style={{
                          backgroundColor: "#1B5A90",
                          opacity: !toggleActive ? 0.5 : 1,    // Fades the button if toggleActive is false
                          cursor: !toggleActive ? "not-allowed" : "pointer",
                        }}
                        onClick={!toggleActive ? null : AddShuffle} // Disables click handler if toggleActive is false
                        disabled={!toggleActive}                    // Actual disabled attribute
                      >
                        Shuffle
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-body pt-3">
                <div className="row">
                  <div className="col-lg-3 col-md-3 d-flex justify-content-center justify-content-lg-start justify-content-md-start">
                    <h6 className="mt-2">Show</h6>&nbsp;&nbsp;
                    <select
                      style={{ height: "35px" }}
                      className="form-select w-auto"
                      aria-label="Default select example"
                      value={itemsPerPage}
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
                      value={searchValue}
                      onChange={handleSearch}
                    />
                  </div>
                </div>
                <br />
                <Table striped hover responsive className="border text-left">
                  <thead>
                    <tr>
                      <th scope="col" style={headerCellStyle}>
                        <input
                          className="form-check-input"
                          type="checkbox"
                          onChange={handleSelectAll}
                          checked={isAllChecked}
                        />
                      </th>
                      <th scope="col" style={headerCellStyle}>
                        Sr.No
                      </th>
                      <th scope="col" style={headerCellStyle}>
                        Username
                      </th>
                      <th scope="col" style={headerCellStyle}>
                        Full Name
                      </th>
                      <th scope="col" style={headerCellStyle}>
                        Bukkel No
                      </th>
                      <th scope="col" style={headerCellStyle}>
                        Phone No
                      </th>
                      <th scope="col" style={headerCellStyle}>
                        Post
                      </th>
                      <th scope="col" style={headerCellStyle}>
                        Role
                      </th>
                      <th scope="col" style={headerCellStyle}>
                        Duty
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
                    {allUsers.map((data, index) => {
                      return (
                        <tr key={data.um_id}>
                          <td>
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value={data.um_id}
                                id={`checkbox-${data.um_id}`}
                                onChange={() =>
                                  handleCheckboxChange(data.um_id)
                                }
                                checked={selectedIds.includes(data.um_id)}
                              />
                            </div>
                          </td>
                          <td>
                            {(currentPage - 1) * itemsPerPage + index + 1}
                          </td>
                          <td>{data.um_user_name}</td>
                          <td>{data.um_staffname}</td>
                          <td>{data.um_bukkel_no}</td>
                          <td>{data.um_phone_no}</td>
                          <td>{data.um_postname}</td>
                          <td>{data.um_rolename}</td>
                          <td>{data.um_dutyname}</td>
                          <td>{data.um_isactive}</td>
                          <td className="text-center">
                            <div className="d-flex justify-content-center align-items-center gap-2">
                              <Edit
                                className="text-success mr-2"
                                type="button"
                                style={{
                                  marginLeft: "0.5rem",
                                  ...(data.um_isactive === "Inactive" && {
                                    opacity: 0.5,  // Makes the icon appear faded
                                    cursor: "not-allowed", // Changes cursor to indicate disabled state
                                  }),
                                }}
                                onClick={data.um_isactive === "Inactive" ? null : () => GetUser(data.um_id)}
                              />
                              <Delete
                                className="text-danger"
                                type="button"
                                style={{
                                  marginLeft: "0.5rem",
                                  ...(data.um_isactive === "Inactive" && {
                                    opacity: 0.5,  // Makes the icon appear faded
                                    cursor: "not-allowed", // Changes cursor to indicate disabled state
                                  }),
                                }}
                                onClick={data.um_isactive === "Inactive" ? null : () => DeleteUser(data.um_id)}
                              />
                            </div>
                          </td>

                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
                <div className="row mt-4 mt-xl-3">
                  <div className="col-lg-4 col-md-4 col-12 ">
                    <h6 className="text-lg-start text-center">
                      Showing {indexOfFirstItem + 1} to{" "}
                      {Math.min(indexOfLastItem, allUsers.length)} of{" "}
                      {allUsers.length} entries
                    </h6>
                  </div>
                  <div className="col-lg-4 col-md-4 col-12"></div>
                  <div className="col-lg-4 col-md-4 col-12 mt-3 mt-lg-0 mt-md-0">
                    <Pagination
                      currentPage={currentPage}
                      setCurrentPage={setCurrentPage}
                      allData={allUsers}
                      itemsPerPage={itemsPerPage}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal show={showModal} onHide={handleClose} size="lg" backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>
            <h5 className="fw-bold">Add User</h5>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="">
            <Col xs={12} sm={12} md={12} lg={6}>
              <Form.Group className="form-group-sm">
                <Form.Label className="control-label fw-bold">
                  Username:
                </Form.Label>
                <span className="text-danger fw-bold">*</span>
                <Form.Control
                  type="text"
                  id="userName"
                  name="userName"
                  placeholder="Enter Username"
                  value={userName}
                  // onChange={(e) => setUserName(e.target.value)}
                  maxLength={50} // Restrict input to 50 characters
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^[a-zA-Z\s]*$/.test(value)) {
                      setUserName(value);
                    }
                  }
                  }
                />
              </Form.Group>
            </Col>
            <Col xs={12} sm={12} md={12} lg={6}>
              <Form.Group className="form-group-sm">
                <Form.Label className="control-label fw-bold mt-lg-0 mt-3">
                  Full Name:
                </Form.Label>
                <span className="text-danger fw-bold">*</span>
                {/* <Select
                  options={allStaff}
                  value={staff}
                  onChange={handleStaff}
                  className=""
                /> */}
                <Form.Control
                  type="text"
                  id="fullName"
                  name="fullName"
                  placeholder="Enter Full Name"
                  value={staff}
                  // onChange={(e) => setStaff(e.target.value)}
                  maxLength={50} // Restrict input to 50 characters
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^[a-zA-Z\s]*$/.test(value)) {
                      setStaff(value);
                    }
                  }
                  }
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="mt-4">
            <Col xs={12} sm={12} md={12} lg={6}>
              <Form.Group className="form-group-sm">
                <Form.Label className="control-label fw-bold">
                  Bukkel No:
                </Form.Label>
                <span className="text-danger fw-bold">*</span>
                <Form.Control
                  type="text"
                  id="bukkelNo"
                  name="bukkelNo"
                  placeholder="Enter Bukkel No."
                  value={bukkelNo}
                  // onChange={(e) => setBukkelNo(e.target.value)}
                  maxLength={6} // Restrict input length to 10 characters
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value)) {
                      setBukkelNo(value);
                    }
                  }}
                />
              </Form.Group>
            </Col>
            <Col xs={12} sm={12} md={12} lg={6}>
              <Form.Group className="form-group-sm">
                <Form.Label className="control-label fw-bold mt-lg-0 mt-3">
                  Phone No:
                </Form.Label>
                <span className="text-danger fw-bold">*</span>
                <Form.Control
                  type="text"
                  id="phoneNo"
                  name="phoneNo"
                  placeholder="Enter Phone No."
                  value={phoneNo}
                  // onChange={(e) => setPhoneNo(e.target.value)}
                  maxLength={10} // Restrict input length to 10 characters
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value)) {
                      setPhoneNo(value);
                    }
                  }}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="mt-4">
            <Col xs={12} sm={12} md={12} lg={6}>
              <Form.Group className="form-group-sm">
                <Form.Label className="control-label fw-bold">Post:</Form.Label>
                <span className="text-danger fw-bold">*</span>
                {/* <Form.Control
                  type="text"
                  id="post"
                  name="post"
                  placeholder="Enter Post"
                  value={post}
                  onChange={(e) => setPost(e.target.value)}
                /> */}
                <Select
                  options={allPost}
                  value={post}
                  onChange={handlePost}
                  className=""
                />
              </Form.Group>
            </Col>
            <Col xs={12} sm={12} md={12} lg={6} className="mt-lg-0 mt-3">
              <Form.Group className="form-group-sm">
                <Form.Label className="control-label fw-bold">Role:</Form.Label>
                <span className="text-danger fw-bold">*</span>
                <Select
                  options={allRole}
                  value={role}
                  onChange={handleRole}
                  className=""
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="mt-4">
            <Col xs={12} sm={12} md={12} lg={6} className="mt-lg-0">
              <Form.Group className="form-group-sm">
                <Form.Label className="control-label fw-bold">Duty:</Form.Label>
                <span className="text-danger fw-bold">*</span>
                <Select
                  options={allDuty}
                  value={duty}
                  onChange={handleDuty}
                  className=""
                />
              </Form.Group>
            </Col>
            <Col xs={12} sm={12} md={12} lg={6} className="mt-lg-4">
              <Form.Group className="mb-3 mt-1" controlId="isActive">
                <Form.Check
                  type="checkbox"
                  label="Is Active"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                />
              </Form.Group>
            </Col>
            {/* <Col xs={12} sm={12} md={12} lg={6} className="mt-lg-0 mt-3">
              <Form.Group className="form-group-sm">
                <Form.Label className="control-label fw-bold">Password:</Form.Label>
              
                <div className="input-group">
                  <Form.Control
                    type={showPassword ? "text" : "text"} 
                    id="password"
                    name="password"
                    placeholder="Enter Password"
                    value={password}
                    autoComplete="new-password"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <span
                    className="input-group-text"
                    onClick={togglePasswordVisibility}
                    style={{ cursor: "pointer" }}
                  >
                    {showPassword ? <EyeSlash /> : <Eye />} 
                  </span>
                </div>

              </Form.Group>
            </Col> */}

          </Row>
          {/* <Row className="mt-4">
            <Col xs={12} sm={12} md={12} lg={6}>
              <Form.Group className="mt-4" controlId="isActive">
                <Form.Check
                  type="checkbox"
                  label="Is Admin"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                />
              </Form.Group>
            </Col>
            <Col xs={12} sm={12} md={12} lg={6} className="mt-lg-0 mt-4">
              <Form.Group className="mb-3" controlId="isActive">
                <Form.Check
                  type="checkbox"
                  label="Is Active"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                />
              </Form.Group>
            </Col>
          </Row> */}
        </Modal.Body>
        <Modal.Footer>
          <div className="col-lg-12 text-end">
            <Button
              className="text-light"
              style={{ backgroundColor: "#1B5A90" }}
              onClick={AddUser}
            >
              Save
            </Button>
            <Button variant="secondary" className="mx-2" onClick={resetForm}>
              Clear
            </Button>
          </div>
        </Modal.Footer>
      </Modal>

      <Modal show={showErrorModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Error Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {errorMessage && (
            <>
              {/* Application Number Errors */}
              {errorMessage.duplicateUsernameErrors?.length > 0 && (
                <>
                  <h5>Duplicate Username Errors</h5>
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th style={{ width: "20%" }}>#</th>
                        <th>Username</th>
                      </tr>
                    </thead>
                    <tbody>
                      {errorMessage.duplicateUsernameErrors.map((appNo, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{appNo.replace("DuplicateUsername: ", "")}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}

              {/* Mobile Number Errors */}
              {errorMessage.duplicateBukkelNoErrors?.length > 0 && (
                <>
                  <h5>Duplicate Bukkel Numbers Errors</h5>
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th style={{ width: "20%" }}>#</th>
                        <th>Bukkel Number</th>
                      </tr>
                    </thead>
                    <tbody>
                      {errorMessage.duplicateBukkelNoErrors.map((mobile, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{mobile.replace("DuplicateBukkelNo: ", "")}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}

              {/* Blank Mobile Number Errors */}
              {errorMessage.blankUserNameErrors?.length > 0 && (
                <>
                  <h5>Blank Username Errors</h5>
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th style={{ width: "20%" }}>#</th>
                        <th>Blank Username Number</th>
                      </tr>
                    </thead>
                    <tbody>
                      {errorMessage.blankUserNameErrors.map((mobile, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{mobile.replace("BlankUserName :", "").trim() || "N/A"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}

              {/* Blank Application Number Errors */}
              {errorMessage.blankBukkelNoErrors?.length > 0 && (
                <>
                  <h5>Blank Bukkel Number Errors</h5>
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th style={{ width: "20%" }}>#</th>
                        <th>Blank Bukkel Number</th>
                      </tr>
                    </thead>
                    <tbody>
                      {errorMessage.blankBukkelNoErrors.map((appNo, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{appNo.replace("BlankBukkelNo:", "").trim() || "N/A"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}
              {errorMessage.dutyNotAvailable?.length > 0 && (
                <>
                  <h5>Duty Not Available Errors</h5>
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th style={{ width: "20%" }}>#</th>
                        <th>Duty Not Available</th>
                      </tr>
                    </thead>
                    <tbody>
                      {errorMessage.dutyNotAvailable.map((appNo, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{appNo.replace("DutyNotAvailable:", "").trim() || "N/A"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UserMaster;
