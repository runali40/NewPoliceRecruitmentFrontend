import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie'

const PrivateRoute = ({ element: Component, ...rest }) => {
  // const storedToken = localStorage.getItem("UserCredential");
  const storedToken = Cookies.get("UserCredential");
  return storedToken ? <Component {...rest} /> : <Navigate to="/" />;
};

export default PrivateRoute;