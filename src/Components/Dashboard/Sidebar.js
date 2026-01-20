import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';
import {
  ListUl,
  ThreeDotsVertical,
  GearFill,
  PersonFill,
  BellFill,
  ClipboardCheck,
  CheckCircleFill,
  BoxArrowRight,
  BookFill,
  GearWideConnected
} from "react-bootstrap-icons";
import HomeIcon from "@material-ui/icons/Home";
import PersonIcon from "@material-ui/icons/Person";
import Group from "@material-ui/icons/Group";
import MemoryIcon from "@material-ui/icons/Memory";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import "../../Css/Sidebar.css";
import "../../Css/Profile.css";
import { apiClient } from "../../apiClient";
import Cookies from "js-cookie";
import TheContent from "../Layouts/Content";
import routes from "../../Routes";
import Select from 'react-select'
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
// import "../../App.css";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarData, setSidebarData] = useState([]);
  // const [sidebar, setSidebar] = useState(true);
  const [sidebar, setSidebar] = useState(window.innerWidth >= 720);
  const [content, setContent] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [openSubDropdown, setOpenSubDropdown] = useState(null); // For sub-submenu
  const [menuId, setMenuId] = useState("");
  const [token, setToken] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
  const recruitName = localStorage.getItem("recruitName");
  const username = localStorage.getItem("username");
  const RoleName = localStorage.getItem("RoleName");
  const post = localStorage.getItem("post");

  const handleSearch = (e) => {
    e.preventDefault();

    // Find the matching route based on the search term
    const matchedRoute = routes.find(route =>
      route.name.toLowerCase() === searchTerm.toLowerCase()
    );

    if (matchedRoute) {
      // Navigate to the matched route's path
      navigate(matchedRoute.path);
    } else {
      toast.error("Please enter valid page name!");
    }
  };

  const handleResize = () => {
    const width = window.innerWidth;
    setWindowWidth(width);

    if (window.innerWidth >= 768 && window.innerWidth <= 1024) {
      setSidebar(!sidebar); // Toggle the sidebar for iPad portrait (768px - 1024px)
    } else if (window.innerWidth < 768) {
      setSidebar(false); // Automatically close for smaller screens
    }
    else {
      setSidebar(true)
    }
  };
  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const sidebarCollapse = () => {
    setSidebar(!sidebar);
  };

  const MoreButton = () => {
    setSidebar(!sidebar);
  };
  const toggleSidebar = () => {
    setSidebar(!sidebar); // Toggle sidebar state
  };

  const toggleDropdown = (menuId) => {
    setOpenDropdown(openDropdown === menuId ? null : menuId);
  };

  const toggleSubDropdown = (subMenuId) => {
    setOpenSubDropdown(openSubDropdown === subMenuId ? null : subMenuId);
  };

  const toggleSidebarOnSmallDevices = () => {
    // if (window.innerWidth < 720) {
    //   setSidebar(false); // Close the sidebar only on small devices
    // }
    if (window.innerWidth >= 768 && window.innerWidth <= 1024) {
      setSidebar(!sidebar); // Toggle the sidebar for iPad portrait (768px - 1024px)
    } else if (window.innerWidth < 768) {
      setSidebar(false); // Automatically close for smaller screens
    }
    else {
      setSidebar(true)
    }
  };

  useEffect(() => {
    getMenu();
  }, []);



  const getMenu = async () => {

    // Retrieve the session ID (replace this with your actual method to get the session ID)
    // const sessionId = localStorage.getItem("sessionid")
    const RoleId = localStorage.getItem("RoleId");
    const UserId = localStorage.getItem("userId");
    const recruitId = localStorage.getItem("recruitId");

    const params = {
      UserId: UserId,
      RoleId: RoleId,
      recruitId: recruitId,
    };

    apiClient.get(`GetWebMenu/GetAll`, { params: params })
      .then((response) => {
        setSidebarData(response.data.data);
        const length = (response.data.data).length;
        console.log(length, "196")
        const token1 = response.data.outcome.tokens;
        Cookies.set("UserCredential", token1, { expires: 7 });
        setToken(token1);
        setContent(true);
        // if(content === true){
        //   navigate("/dashboard",  { state: { length } })
        // }
      })
      .catch((error) => {
        if (error.response && error.response.data && error.response.data.outcome) {
          const token1 = error.response.data.outcome.tokens;
          Cookies.set("UserCredential", token1, { expires: 7 });
        }
        console.error("Error fetching sidebar menu:", error);
      });
  };

  const getEventById = (mId, parentId) => {
    setMenuId(mId);
    localStorage.setItem("menuId", mId);
    localStorage.setItem("parentId", parentId);
    console.log(mId, "mId")
    console.log(parentId, "parentId")
  };
  const isCandidateAbsent = sidebarData.some(item => item.m_menuname != "Candidate");
  const isCandidatePresent = sidebarData.some(item => item.m_menuname === "Candidate");
  // Update localStorage based on presence of "Candidate"
  if (isCandidateAbsent) {
    localStorage.setItem("isCandidateAvailable", "false");
  }
  if (isCandidatePresent) {
    localStorage.setItem("isCandidateAvailable", "true");
  }
  const Logout = () => {
    localStorage.removeItem("UserCredential");
    localStorage.removeItem("sessionid");
    localStorage.removeItem("menuId");
    localStorage.removeItem("parentId");
    // Cookies.remove("UserCredential");
    Cookies.remove("UserCredential", { path: '/' });
    navigate("/");
  };

  return (
    <>
      <div className="wrapper">
        <div className="body-overlay"></div>
        {sidebar && (
          <nav className="sidebar" id="sidebar">
            <div className="sidebar-header">
              <h3 className="text-light">POLICE RECRUITMENT</h3>
            </div>
            <ul className="list-unstyled components">
              <li className="dropdown">
                <NavLink to="/dashboard">
                  <HomeIcon style={{ fontSize: "22px" }} />
                  <span className="ms-3">Dashboard</span>
                </NavLink>
              </li>

              {/* {sidebarData
                .filter((item) =>
                  ["Candidate", "RFID Mapping", "Events", "Analytics", "Master", "Recruitment"].includes(item.m_menuname)
                )
                .sort((a, b) => {
                  const menuOrder = ["Candidate", "RFID Mapping", "Events", "Analytics", "Master", "Recruitment"];
                  return menuOrder.indexOf(a.m_menuname) - menuOrder.indexOf(b.m_menuname);
                })
                .map((menuItem, index) => (
                  <li className="dropdown" key={index}>
                    {["Candidate", "Recruitment", "RFID Mapping"].includes(menuItem.m_menuname) ? (
                      <NavLink to={menuItem.m_action} onClick={toggleSidebarOnSmallDevices}>
                        {menuItem.m_menuname === "Candidate" ? (
                          <PersonIcon style={{ fontSize: "22px" }} />
                        ) : menuItem.m_menuname === "Recruitment" ? (
                          <Group style={{ fontSize: "22px" }} />
                        ) : (
                          <MemoryIcon style={{ fontSize: "22px" }} /> // Assuming RFID Mapping uses a different icon
                        )}
                        <span className="ms-3">{menuItem.m_menuname}</span>
                      </NavLink>
                    ) : (
                      <>
                        <NavLink
                          to="#"
                          onClick={() => toggleDropdown(menuItem.m_id)}
                          className="dropdown-toggle"
                          aria-expanded={openDropdown === menuItem.m_id}
                        >
                          {menuItem.m_menuname === "Events" ? (
                            <CheckCircleFill style={{ fontSize: "22px" }} />
                          ) : menuItem.m_menuname === "Analytics" ? (
                            <ClipboardCheck style={{ fontSize: "22px" }} />
                          ) : (
                            <GearWideConnected style={{ fontSize: "22px" }} />
                          )}
                          <span className="ms-3">{menuItem.m_menuname}</span>
                        </NavLink>
                        <ul className={`collapse list-unstyled menu ${openDropdown === menuItem.m_id ? "show" : ""}`}>
                          {sidebarData
                            .filter((subMenuItem) => subMenuItem.ParentId && subMenuItem.ParentId.toUpperCase() === menuItem.m_id.toUpperCase())
                            .map((subMenuItem, subIndex) => (
                              <li key={subIndex}>
                                {sidebarData.some(subSubMenuItem => subSubMenuItem.ParentId && subSubMenuItem.ParentId.toUpperCase() === subMenuItem.m_id.toUpperCase()) ? (
                                  <>
                                    <NavLink
                                      to="#"
                                      onClick={() => toggleSubDropdown(subMenuItem.m_id)}
                                      className="dropdown-toggle"
                                      aria-expanded={openSubDropdown === subMenuItem.m_id}
                                    >
                                      {subMenuItem.m_menuname}
                                    </NavLink>
                                    <ul className={`collapse list-unstyled ${openSubDropdown === subMenuItem.m_id ? "show" : ""}`}>
                                      {sidebarData
                                        .filter(subSubMenuItem => subSubMenuItem.ParentId && subSubMenuItem.ParentId.toUpperCase() === subMenuItem.m_id.toUpperCase())
                                        .map((subSubMenuItem, subSubIndex) => (
                                          <li key={subSubIndex}>
                                            {subSubMenuItem.m_action === "event" ? (
                                              <NavLink
                                                to={`/${subSubMenuItem.m_action}/${subSubMenuItem.m_id}`}
                                                onClick={() => { getEventById(subSubMenuItem.m_id); }}
                                              >
                                                {subSubMenuItem.m_menuname}
                                              </NavLink>
                                            ) : null}
                                          </li>
                                        ))}
                                      {sidebarData.filter(subSubMenuItem => subSubMenuItem.ParentId && subSubMenuItem.ParentId.toUpperCase() === subMenuItem.m_id.toUpperCase()).length === 0 && (
                                        <li><span style={{ color: 'red' }}>No sub-submenu available</span></li>
                                      )}
                                    </ul>
                                  </>
                                ) : (
                                  <>
                                    {subMenuItem.m_action ? (
                                      subMenuItem.m_action === "event" ? (
                                        <NavLink
                                          to={`/${subMenuItem.m_action}/${subMenuItem.m_id}`}
                                          onClick={() => getEventById(subMenuItem.m_id)}
                                        >
                                          {subMenuItem.m_menuname}
                                        </NavLink>
                                      ) : (
                                        <NavLink to={subMenuItem.m_action}>
                                          {subMenuItem.m_menuname}
                                        </NavLink>
                                      )
                                    ) : (
                                      <h6 className="text-white mt-3 px-2" style={{ cursor: "pointer" }}>{subMenuItem.m_menuname}</h6>
                                    )}

                                    <ul>
                                      <li><span style={{ color: 'red' }}></span></li>
                                    </ul>
                                  </>
                                )}
                              </li>
                            ))}
                        </ul>
                      </>
                    )}
                  </li>

                ))} */}

              {/* {sidebarData
                .filter((item) =>
                  ["Candidate", "Rejected Candidate", "RFID Mapping", "Events", "Reports", "Master", "Recruitment"].includes(item.m_menuname)
                )
                .sort((a, b) => {
                  const menuOrder = ["Candidate", "Rejected Candidate", "RFID Mapping", "Events", "Reports", "Master", "Recruitment"];
                  return menuOrder.indexOf(a.m_menuname) - menuOrder.indexOf(b.m_menuname);
                })
                .map((menuItem, index) => (
                  <li className="dropdown" key={index}>
                    {["Candidate", "Rejected Candidate", "Recruitment", "RFID Mapping"].includes(menuItem.m_menuname) ? (
                      <NavLink to={menuItem.m_action} onClick={toggleSidebarOnSmallDevices}>
                        {menuItem.m_menuname === "Candidate" ? (
                          <PersonIcon style={{ fontSize: "22px" }} />
                        ) : menuItem.m_menuname === "Recruitment" ? (
                          <Group style={{ fontSize: "22px" }} />
                        ) : (
                          <MemoryIcon style={{ fontSize: "22px" }} />
                        )}
                        <span className="ms-3">{menuItem.m_menuname}</span>
                      </NavLink>
                    ) : (
                      <>
                        <NavLink
                          to="#"
                          onClick={() => toggleDropdown(menuItem.m_id)}
                          className="dropdown-toggle"
                          aria-expanded={openDropdown === menuItem.m_id}
                        >
                          {menuItem.m_menuname === "Events" ? (
                            <CheckCircleFill style={{ fontSize: "22px" }} />
                          ) : menuItem.m_menuname === "Reports" ? (
                            <ClipboardCheck style={{ fontSize: "22px" }} />
                          ) : (
                            <GearWideConnected style={{ fontSize: "22px" }} />
                          )}
                          <span className="ms-3">{menuItem.m_menuname}</span>
                        </NavLink>
                        <ul className={`collapse list-unstyled menu ${openDropdown === menuItem.m_id ? "show" : ""}`}>
                          {sidebarData
                            .filter((subMenuItem) => subMenuItem.ParentId && subMenuItem.ParentId.toUpperCase() === menuItem.m_id.toUpperCase())
                            .map((subMenuItem, subIndex) => (
                              <li key={subIndex}>
                                {sidebarData.some(subSubMenuItem => subSubMenuItem.ParentId && subSubMenuItem.ParentId.toUpperCase() === subMenuItem.m_id.toUpperCase()) ? (
                                  <>
                                    <NavLink
                                      to="#"
                                      onClick={() => toggleSubDropdown(subMenuItem.m_id)}
                                      className="dropdown-toggle"
                                      aria-expanded={openSubDropdown === subMenuItem.m_id}
                                    >
                                      {subMenuItem.m_menuname}
                                    </NavLink>
                                    <ul className={`collapse list-unstyled ${openSubDropdown === subMenuItem.m_id ? "show" : ""}`}>
                                      {sidebarData
                                        .filter(subSubMenuItem => subSubMenuItem.ParentId && subSubMenuItem.ParentId.toUpperCase() === subMenuItem.m_id.toUpperCase())
                                        .map((subSubMenuItem, subSubIndex) => (
                                          <li key={subSubIndex}>
                                            {subSubMenuItem.m_action === "event" ? (
                                              <NavLink
                                                to={`/${subSubMenuItem.m_action}/${subSubMenuItem.ParentId}/${subSubMenuItem.EventId}`}
                                                onClick={() => {
                                                  getEventById(subSubMenuItem?.EventId, subSubMenuItem?.ParentId);
                                                  toggleSidebarOnSmallDevices();
                                                }}
                                              >
                                                {subSubMenuItem.m_menuname}
                                              </NavLink>
                                            )  : null}
                                          </li>

                                        ))}
                                      {sidebarData.filter(subSubMenuItem => subSubMenuItem.ParentId && subSubMenuItem.ParentId.toUpperCase() === subMenuItem.m_id.toUpperCase()).length === 0 && (
                                        <li><span style={{ color: 'red' }}>No sub-submenu available</span></li>
                                      )}
                                    </ul>
                                  </>
                                ) : (
                                  <>
                                    {subMenuItem.m_action ? (
                                      subMenuItem.m_action === "event" ? (
                                        <NavLink
                                          to={`/${subMenuItem.m_action}/${subMenuItem.ParentId}/${subMenuItem.EventId}`}
                                          onClick={() => {
                                            getEventById(subMenuItem?.EventId, subMenuItem?.ParentId);
                                            toggleSidebarOnSmallDevices();
                                          }}
                                        >
                                          {subMenuItem.m_menuname}
                                        </NavLink>
                                      )
                                        : (
                                            <NavLink to={subMenuItem.m_action} onClick={toggleSidebarOnSmallDevices}>
                                              {subMenuItem.m_menuname}
                                            </NavLink>
                                          )
                                    ) : (
                                      <h6 className="text-white mt-3 px-2" style={{ cursor: "pointer" }}>{subMenuItem.m_menuname}</h6>
                                    )}
                                  </>
                                )}
                              </li>
                            ))}
                        </ul>
                      </>
                    )}
                  </li>
                ))} */}
              {sidebarData
                .filter((item) =>
                  [
                    "Candidate",
                    "Rejected Candidate",
                    "Appeal Candidate",
                    "RFID Mapping",
                    "Events",
                    "Reports",
                    "Master",
                    "Recruitment",
                  ].includes(item.m_menuname)
                )
                .sort((a, b) => {
                  const menuOrder = [
                    "Candidate",
                    "Rejected Candidate",
                    "Appeal Candidate",
                    "RFID Mapping",
                    "Events",
                    "Reports",
                    "Master",
                    "Recruitment",
                  ];
                  return menuOrder.indexOf(a.m_menuname) - menuOrder.indexOf(b.m_menuname);
                })
                .map((menuItem, index) => (
                  <li className="dropdown" key={index}>

                    {/* ---------------- TOP LEVEL MENUS (DIRECT LINKS) ---------------- */}
                    {["Candidate", "Rejected Candidate", "Appeal Candidate", "Recruitment", "RFID Mapping"].includes(
                      menuItem.m_menuname
                    ) ? (
                      <NavLink to={menuItem.m_action} onClick={toggleSidebarOnSmallDevices}>
                        {menuItem.m_menuname === "Candidate" ? (
                          <PersonIcon style={{ fontSize: "22px" }} />
                        ) : menuItem.m_menuname === "Recruitment" ? (
                          <Group style={{ fontSize: "22px" }} />
                        ) : (
                          <MemoryIcon style={{ fontSize: "22px" }} />
                        )}
                        <span className="ms-3">{menuItem.m_menuname}</span>
                      </NavLink>
                    ) : (
                      <>
                        {/* ---------------- MAIN DROPDOWN ---------------- */}
                        <NavLink
                          to="#"
                          onClick={() => toggleDropdown(menuItem.m_id)}
                          className="dropdown-toggle"
                          aria-expanded={openDropdown === menuItem.m_id}
                        >
                          {menuItem.m_menuname === "Events" ? (
                            <CheckCircleFill style={{ fontSize: "22px" }} />
                          ) : menuItem.m_menuname === "Reports" ? (
                            <ClipboardCheck style={{ fontSize: "22px" }} />
                          ) : (
                            <GearWideConnected style={{ fontSize: "22px" }} />
                          )}
                          <span className="ms-3">{menuItem.m_menuname}</span>
                        </NavLink>

                        {/* ---------------- SUBMENU LIST ---------------- */}
                        <ul
                          className={`collapse list-unstyled menu ${openDropdown === menuItem.m_id ? "show" : ""
                            }`}
                        >
                          {sidebarData
                            .filter(
                              (subMenuItem) =>
                                subMenuItem.ParentId &&
                                subMenuItem.ParentId.toUpperCase() ===
                                menuItem.m_id.toUpperCase()
                            )
                            .map((subMenuItem, subIndex) => (
                              <li key={subIndex}>

                                {/* Check if sub-sub menus exist */}
                                {sidebarData.some(
                                  (subSubMenuItem) =>
                                    subSubMenuItem.ParentId &&
                                    subSubMenuItem.ParentId.toUpperCase() ===
                                    subMenuItem.m_id.toUpperCase()
                                ) ? (
                                  <>
                                    {/* SUBMENU WITH MORE LEVELS */}
                                    <NavLink
                                      to="#"
                                      onClick={() => toggleSubDropdown(subMenuItem.m_id)}
                                      className="dropdown-toggle"
                                      aria-expanded={openSubDropdown === subMenuItem.m_id}
                                    >
                                      {subMenuItem.m_menuname}
                                    </NavLink>

                                    <ul
                                      className={`collapse list-unstyled ${openSubDropdown === subMenuItem.m_id ? "show" : ""
                                        }`}
                                    >
                                      {sidebarData
                                        .filter(
                                          (subSubMenuItem) =>
                                            subSubMenuItem.ParentId &&
                                            subSubMenuItem.ParentId.toUpperCase() ===
                                            subMenuItem.m_id.toUpperCase()
                                        )
                                        .map((subSubMenuItem, subSubIndex) => (
                                          <li key={subSubIndex}>
                                            {/* EVENT TYPE SUB-SUBMENU */}
                                            {subSubMenuItem.m_action === "event" ? (
                                              <NavLink
                                                to={`/${subSubMenuItem.m_action}/${subSubMenuItem.ParentId}/${subSubMenuItem.EventId}`}
                                                onClick={() => {
                                                  getEventById(
                                                    subSubMenuItem?.EventId,
                                                    subSubMenuItem?.ParentId
                                                  );
                                                  toggleSidebarOnSmallDevices();
                                                }}
                                              >
                                                {subSubMenuItem.m_menuname}
                                              </NavLink>
                                            ) : null}
                                          </li>
                                        ))}
                                    </ul>
                                  </>
                                ) : (
                                  <>
                                    {/* ---------------- CORRECTED LOGIC ---------------- */}
                                    {(() => {
                                      // EVENT REPORTS
                                      if (
                                        [
                                          "100MeterReport",
                                          "1600MeterReport",
                                          "800MeterReport",
                                          "shotputReport",
                                          "heightChestReport",
                                          "allRunningReport",
                                          "dailyReport",
                                          "groundTest",
                                        ].includes(subMenuItem.m_action)
                                      ) {
                                        return (
                                          <NavLink
                                            to={`/${subMenuItem.m_action}`}
                                            onClick={() => {
                                              getEventById(
                                                subMenuItem?.EventId,
                                                subMenuItem?.ParentId
                                              );
                                              toggleSidebarOnSmallDevices();
                                            }}
                                          >
                                            {subMenuItem.m_menuname}
                                          </NavLink>
                                        );
                                      }

                                      // MASTER MODULE → SIMPLE DIRECT ROUTES
                                      if (menuItem.m_menuname === "Master") {
                                        return (
                                          <NavLink
                                            to={`/${subMenuItem.m_action}`}
                                            onClick={toggleSidebarOnSmallDevices}
                                          >
                                            {subMenuItem.m_menuname}
                                          </NavLink>
                                        );
                                      }

                                      // DEFAULT → EVENT SUBMENU
                                      return (
                                        <NavLink
                                          to={`/${subMenuItem.m_action}/${subMenuItem.ParentId}/${subMenuItem.EventId}`}
                                          onClick={toggleSidebarOnSmallDevices}
                                        >
                                          {subMenuItem.m_menuname}
                                        </NavLink>
                                      );
                                    })()}
                                  </>
                                )}
                              </li>
                            ))}
                        </ul>
                      </>
                    )}
                  </li>
                ))}


              <div /* className="sidebar-bottom mt-5 pt-5" */ className="sidebar-bottom">
                <li className="dropdown">
                  <NavLink role="button" aria-controls="#faq">
                    <BoxArrowRight style={{ fontSize: "22px" }} />
                    <span className="ms-3" onClick={Logout}>Log out</span>
                  </NavLink>
                </li>
              </div>
            </ul>
          </nav>
        )}
        <div id="content" style={{ width: sidebar ? content : "100%" }}>
          {content && (
            <div className="top-navbar">
              <nav
                className="navbar navbar-expand-lg sticky-top shadow"

                style={{ backgroundColor: "white" }}
              >
                <button
                  type="button"
                  id="sidebar-collapse"
                  className="d-xl-block d-lg-block d-md-none d-none mx-2"
                >
                  <ListUl
                    style={{
                      fontSize: "24px",
                      marginBottom: "5px",
                      transform: "rotate(180deg)",
                      color: "black",
                    }}
                    onClick={sidebarCollapse}
                  />
                </button>

                <div className="row">
                  <div className="col-lg-5 col-md-5 col-12 d-flex align-items-center">
                    <button
                      id="exnavbar"
                      className={`d-lg-none ${sidebar ? "toggle-shift-right" : "me-2"}`}
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#sidebar"
                      aria-controls="sidebar"
                      aria-expanded={sidebar}
                      onClick={toggleSidebar}
                    >
                      <ListUl style={{ fontSize: "27px", color: "black" }} />
                    </button>

                    <form onSubmit={handleSearch} className="d-flex flex-grow-1">
                      <div className="search mx-lg-0 mx-md-3 mx-3 flex-grow-1">
                        <span className="search-icon material-symbols-outlined text-dark">Search</span>
                        <input
                          className="search-input"
                          type="search"
                          placeholder="Search eg: Role Master"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                    </form>
                  </div>

                  <div className="col-lg-7 col-md-7 col-sm-12 col-12 mt-2">
                    {
                      username === "Superadmin"
                        ? null
                        :
                        <div className="d-flex align-items-center ">
                          <h6 className="text-dark fw-bold mb-0 me-2">
                            Recruit Name:
                          </h6>
                          <select className="form-control fw-bold text-dark" style={{ width: "210px", fontSize: "14px" }} disabled>
                            <option>
                              {recruitName} / {post}
                            </option>
                          </select>
                        </div>
                      // : <h6 className="text-dark fw-bold ms-4 d-lg-block d-md-block d-none">
                      //   Recruit Name: {recruitName} / {post}
                      // </h6>
                    }

                  </div>

                </div>


                <div
                  className="collapse navbar-collapse d-lg-block d-xl-block d-sm-none d-md-none d-none"
                  id="navbarSupportedContent"
                >
                  <ul className="nav navbar-nav ms-auto">

                    <li className="nav-item ">
                      <div
                        className="nav-link"
                        onClick={() => setIsSubMenuOpen(!isSubMenuOpen)}
                        type="button"
                      >
                        <PersonFill
                          style={{ fontSize: "24px", color: "black" }}
                        />
                        <div
                          className={`sub-menu-wrap ${isSubMenuOpen ? "open-menu" : ""
                            }`}
                          id="subMenu"
                          style={{
                            backgroundColor: "white",
                            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                            borderRadius: "8px",

                          }}
                        >
                          <div className="sub-menu">
                            <div className="user-info">
                              <img src="Images/user.png" alt="User" />
                              <h5 className="text-dark fw-bold mt-2">{username}</h5>
                            </div>
                          </div>
                          <hr className="sub-menu-hr" />
                          <div className="sub-menu-link">
                            <h6 className="text-dark mb-0 mx-2 fw-bold">Role Name:</h6>
                            <p className="text-dark mb-2 fw-bold" style={{ marginRight: "10px" }}>{RoleName}</p>
                          </div>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </nav>
            </div>
          )}
          {content === true && <TheContent length={sidebarData.length} />} {/* Render TheContent only after data is fetched */}
        </div>
      </div>

    </>

  );
};

export default Sidebar;
