// documentApi.js

import {apiClient }from "../../apiClient";
import ErrorHandler from "../ErrorHandler";
import Cookies from 'js-cookie'; 
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export const uploadDocuments = async (data, navigate, candidateId, setIsDocumentUpload, isDocumentUpload) => {
    try {
        const response = await apiClient({
            method: "post",
            url: `DocumentUpload`,
            data,
        });
        const upload = response.data.data.OutcomeDetail;
        setIsDocumentUpload(upload);
        console.log(isDocumentUpload,"document upload")
        const token1 = response.data.outcome.tokens;
        toast.success("Documents upload successfully!")
        Cookies.set("UserCredential", token1, { expires: 7 });
        navigate(`/candidate/${candidateId}`, {
            state: { documentUpload: upload },
        });
    } catch (error) {
        if (error.response && error.response.data && error.response.data.outcome) {
            const token1 = error.response.data.outcome.tokens;
            Cookies.set("UserCredential", token1, { expires: 7 });
        }
        const errors = ErrorHandler(error);
        toast.error(errors);
    }
};
// export const getAllData = () => {
//     const recruitId = localStorage.getItem("recruitId")
//     const userId = localStorage.getItem("userId")
//     return apiClient({
//       method: "get",
//       url: (`Candidate/GetAllDocument`).toString(),
//       params: {
//         UserId: userId,
//         RecruitId: recruitId
//       },
//     })
//       .then((response) => {
//         console.log("response all recruitmentconfig", response.data.data);
//         const token1 = response.data.outcome.tokens;
//         Cookies.set("UserCredential", token1, { expires: 7 });
  
//         return response.data.data;
//       })
//       .catch((error) => {
//         console.log(error);
//         const errors = ErrorHandler(error);
//         toast.error(errors)
//         return [];
//       });
//   };