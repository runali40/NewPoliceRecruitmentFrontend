import React, { useState, useEffect } from "react";
import "../../Css/Login.css";
import axios from "axios";
import UrlData from "../../UrlData";
import { jwtDecode } from "jwt-decode";
import jwtEncode from "jwt-encode";
import CryptoJS from "crypto-js";
import ErrorHandler from "../../Components/ErrorHandler";
import Cookies from 'js-cookie';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { tokenStorage } from "../../Components/TokenStorage";
import { useNavigate } from "react-router-dom";
import Loading from "../../Components/Utils/Loading";
import HomePage from "../../Components/Dashboard/HomePage";
import { Eye, EyeSlash } from "react-bootstrap-icons";
import { v4 as uuidv4 } from 'uuid';
import Sidebar from "../../Components/Dashboard/Sidebar";


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [jwtToken, setJwtToken] = useState("");
  const [encryptedToken, setEncryptedToken] = useState("");
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const navigate = useNavigate();
  const handleReload = () => {
    const currentUrl = window.location.href;
    window.location.href = currentUrl; // This will reload the page
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const getLocalIP = () => {
    return new Promise((resolve, reject) => {
      const peerConnection = new RTCPeerConnection();
      peerConnection.createDataChannel("");
      peerConnection.createOffer().then((offer) => {
        return peerConnection.setLocalDescription(offer);
      }).then(() => {
        peerConnection.onicecandidate = (event) => {
          if (!event || !event.candidate) {
            return;
          }
          const ipAddress = /([0-9]{1,3}[.]){3}[0-9]{1,3}/.exec(event.candidate.candidate);
          if (ipAddress) {
            resolve(ipAddress[0]);
          }
          peerConnection.close();
        };
      }).catch((error) => {
        reject(error);
      });
    });
  };
  useEffect(() => {
    localStorage.removeItem("sessionId");
    // localStorage.removeItem("UserCredential");
    Cookies.remove("UserCredential", { path: '/' });
    Cookies.remove("UserCredential")
    localStorage.removeItem("recruitId")
    localStorage.removeItem("recConfId")
  }, [])
  
  // useEffect(() => {
  //   // Clear storage and cookies
  //   localStorage.removeItem("sessionId");
  //   Cookies.remove("UserCredential", { path: '/' });
  //   localStorage.removeItem("recruitId");
  //   localStorage.removeItem("recConfId");
    
  //   // Navigate to login page
  //   navigate("/", { replace: true });

  //   // Prevent back navigation
  //   window.history.pushState(null, "", window.location.href);
  //   window.onpopstate = () => {
  //     window.history.pushState(null, "", window.location.href);
  //   };
  // }, [navigate]);

  // const Login = () => {
  //   if (email === "" || password === "") {
  //     toast.warning("Please enter the details");
  //   } else {
  //     const data = {
  //       username: email,
  //       password: password,
  //     };
  //     axios({
  //       method: "post",
  //       url: new URL(UrlData + `Auth`),
  //       data: data,
  //     })
  //       .then((response) => {
  //         console.log("response", response.data.result.data);
  //         const temp = response.data.result.data;
  //         console.log("response", response.data.result.data.RoleId);
  //         const RoleId = response.data.result.data.RoleId;
  //         const DutyId = response.data.result.data.DutyId;
  //         if (RoleId === null) {
  //           localStorage.setItem("RoleId", DutyId);
  //         } else {
  //           localStorage.setItem("RoleId", RoleId);
  //         }
  //         console.log(response.data.result.data.UserId);
  //         const userId = response.data.result.data.UserId;
  //         localStorage.setItem("userId", userId);
  //         const recruitId = response.data.result.data.RecruitId;
  //         localStorage.setItem("recruitId", recruitId);
  //         const DutyName = response.data.result.data.DutyName;
  //         localStorage.setItem("DutyName", DutyName);
  //         const token1 = response.data.result.outcome.tokens;
  //         const RoleName = response.data.result.data.r_rolename;
  //         localStorage.setItem("RoleName", RoleName);
  //         // setEncryptedToken(token1);
  //         // Cookies.set("UserCredential", token1, { expires: 7 });
  //         Cookies.set("UserCredential", token1, { expires: 7 });
  //         const storedToken = Cookies.get("UserCredential");
  //         setJwtToken(storedToken)
  //         console.log(storedToken, "storedToken");

  //         // if (!storedToken) {
  //         //   navigate("/");
  //         // }
  //         // else {
  //         //   navigate("/dashboard");           
  //         // }
  //         if (storedToken) {
  //           navigate("/dashboard");
  //         } else {
  //           navigate("/");
  //         }
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //         if (error.response.status === 400) {
  //           toast.error("Invalid Username and Password!")
  //         }
  //         else {
  //           toast.error("Something went wrong!")
  //         }
  //         // const errors = ErrorHandler(error);
  //         // toast.error(errors);
  //       });
  //   }
  // };
  // const Login = async () => {
  //   if (email === "" || password === "") {
  //     toast.warning("Please Enter Username and Password");
  //     return;
  //   }
  //   // let ipAddress = "";
  //   // try {
  //   //   ipAddress = await getLocalIP();
  //   // } catch (error) {
  //   //   console.error("Error fetching local IP address:", error);
  //   //   toast.error("Could not retrieve local IP address");
  //   //   return; // Exit if there's an error fetching the IP address
  //   // }
  //   // Retrieve the session ID (replace this with your actual method to get the session ID)
  //   const sessionId = uuidv4(); // Replace with your logic
  //   const data = {
  //     username: email,
  //     password: password,
  //     IpAddress: "192.168.1.11", // Add IP address to the data
  //     SessionId: sessionId, // Add session ID to the data
  //   };
  //   axios({
  //     method: "post",
  //     url: new URL(UrlData + `Auth`),
  //     data: data,
  //   })
  //     .then((response) => {
  //       console.log("response", response.data.result.data);
  //       const temp = response.data.result.data;
  //       console.log("response", response.data.result.data.RoleId);
  //       const RoleId = response.data.result.data.RoleId;
  //       const DutyId = response.data.result.data.DutyId;

  //       if (RoleId === null) {
  //         localStorage.setItem("RoleId", DutyId);
  //       } else {
  //         localStorage.setItem("RoleId", RoleId);
  //       }
  //       console.log(response.data.result.data.UserId);
  //       const userId = response.data.result.data.UserId;
  //       console.log(response.data.result.data.UserId);
  //       localStorage.setItem("userId", userId);
  //       const sessionid = response.data.result.outcome.sessionId;
  //       localStorage.setItem("sessionid", sessionid);
  //       const username = response.data.result.data.username;
  //       localStorage.setItem("username", username);
  //       const recruitId = response.data.result.data.RecruitId;
  //       localStorage.setItem("recruitId", recruitId);
  //       const recruitName = response.data.result.data.RecruitName;
  //       localStorage.setItem("recruitName", recruitName);
  //       const DutyName = response.data.result.data.DutyName;
  //       localStorage.setItem("DutyName", DutyName);
  //       const post = response.data.result.data.post;
  //       localStorage.setItem("post", post);
  //       const token1 = response.data.result.outcome.tokens;
  //       const RoleName = response.data.result.data.r_rolename;
  //       localStorage.setItem("RoleName", RoleName);
  //       // Save the token in cookies
  //       Cookies.set("UserCredential", token1, { expires: 7 });
  //       const storedToken = Cookies.get("UserCredential");
  //       setJwtToken(storedToken);
  //       console.log(storedToken, "storedToken");
  //       setDisabled(true);

  //       // Simulate the login process (e.g., API call)
  //       // Replace this with your actual login logic
  //       setTimeout(() => {
  //         console.log("Login function executed");
    
  //         // Optionally re-enable the button after a response
  //         // Uncomment the next line if needed
  //         // setDisabled(false);
  //       }, 5000);

  //       // Navigate based on the token
  //       if (storedToken) {
  //         navigate("/dashboard", { replace: true });
  //         // setTimeout(() => {
  //         //   window.location.reload();
  //         // }, 10);
  //       } else {
  //         navigate("/");
  //       }
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //       if (error.response && error.response.status === 400) {
  //         toast.error("Username and Password both are Invalid!");
  //       } else {
  //         toast.error("Something went wrong!");
  //       }
  //     });
  // };
  const Login = async () => {
    if (disabled) return;
    
    if (!email || !password) {
      toast.warning("Please Enter Username and Password");
      return;
    }

    setDisabled(true);

    const sessionId = uuidv4();
    const data = {
      username: email,
      password: password,
      IpAddress: "192.168.1.4",
      // ipAddress:"192.168.1.2",
      SessionId: sessionId,
    };

    try {
      const response = await axios.post(new URL(UrlData + 'Auth'), data);
      const result = response.data.result;
      
      // Store user data in localStorage
      const roleId = result.data.RoleId ?? result.data.DutyId;
      localStorage.setItem("RoleId", roleId);
      localStorage.setItem("userId", result.data.UserId);
      localStorage.setItem("sessionid", result.outcome.sessionId);
      localStorage.setItem("username", result.data.username);
      localStorage.setItem("recruitId", result.data.RecruitId);
      localStorage.setItem("recruitName", result.data.RecruitName);
      localStorage.setItem("DutyName", result.data.DutyName);
      localStorage.setItem("post", result.data.post);
      localStorage.setItem("RoleName", result.data.r_rolename);

      // Set token in cookies
      Cookies.set("UserCredential", result.outcome.tokens, { expires: 7 });
      // Cookies.remove("UserCredential", { path: '/' });
      navigate("/dashboard", { replace: true });
    } catch (error) {
      const errorMessage = error.response?.status === 400 
        ? "Username and Password both are Invalid!"
        : "Something went wrong!";
      toast.error(errorMessage);
    } finally {
      setDisabled(false);
    }
  };
  return (
    <>
      <div className="container d-flex justify-content-center align-items-center min-vh-100">
        <div className="row border rounder-5 p-3 bg-white shadow box-area">
          <div
            className="col-md-6 rounded-4 d-flex justify-content-center align-items-center flex-column left-box"
            style={{ background: "#103cbe" }}
          >
            <div className="featured-image mb-3">
              <img
                src="https://t4.ftcdn.net/jpg/04/60/71/01/360_F_460710131_YkD6NsivdyYsHupNvO3Y8MPEwxTAhORh.jpg"
                className="img-fluid"
                style={{ width: "250px" }}
                alt=""
              />
            </div>
            <p className="text-white fs-2 fw-bold">Recruitment Software</p>
            {/* <small
              className="text-white text-wrap text-center mt-5"
              style={{ width: "17rem" }}
            >
              Join experienced designers on this platform.
            </small> */}
          </div>
          <div className="col-md-6 right-box">
            <div className="row align-items-center">
              <div className="header-text mb-4">
                <h3 className="fw-bold text-center">Login</h3>
                <p className="fw-bold text-center">Welcome back</p>
              </div>
              <div className="input-group mb-3">
                <input
                  type="text"
                  className="form-control form-control-lg bg-light fs-6"
                  placeholder="Enter Username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="input-group mb-1">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control form-control-lg bg-light fs-6"
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span
                  className="input-group-text"
                  onClick={togglePasswordVisibility}
                  style={{ cursor: "pointer" }}
                  title={showPassword ? "Hide Password" : "Show Password"} // Tooltip added here
                >
                  {showPassword ? <EyeSlash /> : <Eye />}
                </span>
              </div>

              <div className="input-group mb-5 d-flex justify-content-between d-none">
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="formCheck"
                  />
                  <label
                    htmlFor="formCheck"
                    className="form-check-label text-secondary"
                  >
                    <small>Remember me</small>
                  </label>
                </div>
                <div className="forgot">
                  <small className="text-danger fw-bold">
                    Recovery Password
                  </small>
                </div>
              </div>
              <div className="input-group mb-3 ">
                <button
                  className="btn btn-lg btn-primary w-100 fs-6 mt-3"
                  onClick={() => { Login() }}
                  disabled={disabled}
                >
                   {disabled ? "Processing..." : "Login"}
                </button>

              </div>
              <div className="input-group mb-3 d-none">
                <button className="btn btn-lg btn-light w-100 fs-6 text-end">
                  <small>Sign up</small>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </>
  );
};
export default Login;
