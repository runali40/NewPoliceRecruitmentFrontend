import React, { useState, useEffect } from "react";
import { Card, Button, Form, Table } from "react-bootstrap";
import { PlusCircleFill } from "react-bootstrap-icons";
import { ArrowBack, CancelRounded, Delete } from "@material-ui/icons";
import Select from 'react-select'
import {
  addCategory,
  deleteCategory,
  getAllCategoryData,
} from "../../Components/Api/ConfigurationApi";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddCategoryPage = ({ eventUnit, AddMeasurement }) => {
  const headerCellStyle = {
    backgroundColor: "rgb(27, 90, 144)",
    color: "#fff",
  };
  const location = useLocation();
  const navigate = useNavigate();
  const { cId } = location.state || {};
  const [allCategory, setAllCategory] = useState([]);
  const [catName, setCatName] = useState("");
  const [categoryRows, setCategoryRows] = useState([
    {
      CategoryName: "",
    },
  ]);
  const handleCategoryChange = (index, event) => {
    const { name, value } = event.target;
    const newRows = [...categoryRows];
    newRows[index][name] = value;
    setCategoryRows(newRows);
    console.log(newRows, "new rows");
  };
  const addCategoryRow = () => {
    setCategoryRows([
      ...categoryRows,
      {
        CategoryName: "",
      },
    ]);
  };

  const deleteCategoryRow = () => {
    if (categoryRows.length > 1) {
      setCategoryRows(categoryRows.slice(0, -1));
    } else {
      // Optionally show an alert or disable the delete button if there's only one row left
      toast.error("Cannot delete the last row");
    }
  };

  const AddCategoryData = () => {
    // Check if any CategoryName is blank
    const hasBlankCategoryName = categoryRows.some(
      (row) => row.CategoryName.trim() === ""
    );
    if (categoryRows.length === 0 || hasBlankCategoryName) {
      toast.warning("Please enter category name!");
    } else {
      const recruitId = localStorage.getItem("recruitId");
      const UserId = localStorage.getItem("userId");
      let data = {
        UserId: UserId,
        isActive: "1",
        eventUnit: eventUnit,
        RecruitId: recruitId,
        recConfId: cId,
        Categoryins: categoryRows,
      };
      addCategory(data).then(() => {
        getAllCategoryData(cId, categoryRows).then(setAllCategory);
        // handleClose1();
        // resetForm();
      });
    }
  };

  const GetConfigEvent = (catId, catName) => {
    console.log(catName, "category name");
    setCatName(catName);
    navigate("/addEventAccess", { state: { catId, catName } });
    // setRows(prevRows => prevRows.map(row => ({ ...row, category: catgoryName })));

    // resetForm();

    // navigate("/addEventModal")

    // getAllRecruitData(cId, rows, eventUnit).then(setAllConfigEvent);
    // setCId(cId);
  };
  // const DeleteCategoryData = async (catId) => {
  //   const isConfirmed = window.confirm("Are you sure you want to delete this category?");
  //   if (!isConfirmed) return;
  //   try {
  //     await deleteCategory(catId);
  //     const updatedData = await getAllCategoryData(cId, categoryRows);
  //     setAllCategory(updatedData);
  //   } catch (error) {
  //     console.error("Error deleting event or fetching updated data:", error);
  //   }
  // };
  const DeleteCategoryData = async (catId) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this category?");
    if (!isConfirmed) return;
  
    try {
      await deleteCategory(catId);
      const updatedData = await getAllCategoryData(cId, categoryRows);
      setAllCategory(updatedData);
    } catch (error) {
      console.error("Error deleting category or fetching updated data:", error);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      const categoryData = await getAllCategoryData(cId, categoryRows);
      setAllCategory(categoryData);
      console.log(categoryData[0].recConfId);
      const recConfId = categoryData[0].recConfId;
      localStorage.setItem("recConfId", recConfId);
      localStorage.setItem("recruitId", recConfId);
    };
    fetchData();
  }, []);

  return (
    <>
      <div className="container-fluid p-3">
        <Card className="mb-4">
          <Card.Header>
            <div className="row">
              <div className="col-lg-10 col-10">
                <h5 className="fw-bold mt-3">Add Category</h5>
              </div>
              <div className="col-lg-2 col-2">
                <div
                  className="btn btn-add float-end"
                  title="Back"
                  onClick={() => navigate(-1)}
                >
                  <button
                    className="btn btn-md text-light "
                    type="button"
                    style={{ backgroundColor: "#1B5A90" }}
                  >
                    <ArrowBack />
                  </button>
                </div>
              </div>
            </div>
          </Card.Header>
          <Card.Body>
            <Table striped bordered hover className="mt-4">
              <thead>
                <tr>
                  <th style={headerCellStyle} className="text-white">
                    Category Name
                  </th>
                </tr>
              </thead>
              <tbody>
                {categoryRows.map((row, index) => (
                  <tr key={index}>
                    <td>
                      <Form.Group className="form-group-sm">
                        <Form.Control
                          type="text"
                          name="CategoryName"
                          placeholder="Enter Category"
                          value={row.CategoryName}
                          onChange={(e) => handleCategoryChange(index, e)}
                        />
                      </Form.Group>
                    </td>
                  </tr>
                ))}

                <tr>
                  <td colSpan="5" className="text-end">
                    <PlusCircleFill
                      style={{ fontSize: "30px", cursor: "pointer" }}
                      onClick={addCategoryRow}
                    />
                    <CancelRounded
                      style={{ fontSize: "35px", cursor: "pointer" }}
                      onClick={deleteCategoryRow}
                    />
                  </td>
                </tr>
              </tbody>
            </Table> 
          </Card.Body>
          <Card.Footer className="text-end">
            <Button
              className="text-light"
              style={{ backgroundColor: "#1B5A90" }}
              onClick={
                eventUnit === "4efe01a7-7a98-417a-ae17-15e394de7163"
                  ? AddMeasurement
                  : AddCategoryData
              }
            >
              Save
            </Button>
          </Card.Footer>
        </Card>

        <Card className="mt-4">
          <Card.Header>
            <h5 className="fw-bold">Existing Categories</h5>
          </Card.Header>
          <Card.Body>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th style={headerCellStyle} className="text-white">
                    Category Name
                  </th>
                  <th style={headerCellStyle} className="text-white">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {allCategory.map((data, index) => (
                  <tr key={data.Id}>
                    <td>{data.CategoryName}</td>

                    <td>
                      <div className="d-flex ms-2">
                        <button
                          type="button"
                          className="btn btn-primary btn-sm ms-2"
                          onClick={() =>
                            GetConfigEvent(data.Id, data.CategoryName)
                          }
                        >
                          Add Event Access
                        </button>
                        <Delete
                          className="text-danger mr-2"
                          type="button"
                          style={{ marginLeft: "0.5rem" }}
                          onClick={() => DeleteCategoryData(data.Id)}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </div>
    </>
  );
};

export default AddCategoryPage;
