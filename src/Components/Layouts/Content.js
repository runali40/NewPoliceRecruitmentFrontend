// import React from 'react';
// import { Routes, Route,Navigate  } from "react-router-dom";
// import routes from '../../Routes';
// import Cookies from 'js-cookie'; import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
// // import PrivateRoute from '.Components/PrivateRoute';

// const TheContent = () => {
//   // const storedToken = localStorage.getItem("UserCredential");
//   const storedToken = Cookies.get("UserCredential"); 
//   return (
//     <div>
//       <Routes>
//         {routes.map((route, idx) => {
//           return (
//             route.element && (
//               <Route
//                 key={idx}
//                 path={route.path}
//                 exact={route.exact}
//                 name={route.name}
//                 pageTitle={route.pageTitle}
//                 // element={<route.element />}
//                 element={
//                   storedToken ? <route.element /> : <Navigate to="/*"  />
//                 }
//               />
//             )
//           )
//         })}
//           <Route path="*" element={<Navigate to="/" />} />
//       </Routes>
//     </div>
//   )
// }

// export default TheContent;
import React from 'react';
import { Routes, Route, Navigate, useLocation  } from "react-router-dom";
import routes from '../../Routes';
import Cookies from 'js-cookie';
 import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
// import PrivateRoute from '.Components/PrivateRoute';

const TheContent = ({length}) => {
  const location = useLocation();
  const storedToken = Cookies.get("UserCredential");
  return (
    <div>
      <Routes>
        {routes.map((route, idx) => {
          return (
            route.element && (
              <Route
                key={idx}
                path={route.path}
                exact={route.exact}
                name={route.name}
                pageTitle={route.pageTitle}
                // element={<route.element />}
                element={
                  storedToken ? <route.element /> : <Navigate to="/*"  />
                }
              />
            )
          )
        })}
          <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  )
}

export default TheContent;
