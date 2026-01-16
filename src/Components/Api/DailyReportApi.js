import { apiClient } from "../../apiClient";
import ErrorHandler from "../ErrorHandler";
import Cookies from 'js-cookie';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


export const fetchDailyReports = async (params, setCandidateData) => {

    try {
        const response = await apiClient({
            method: "get",
            params,
            url: `CandidateDailyReport/GetAll`,
        });
        const candidateData = response.data.data;
        setCandidateData(candidateData);
        const token1 = response.data.outcome.tokens;
        Cookies.set("UserCredential", token1, { expires: 7 });
    } catch (error) {
        if (error.response && error.response.data && error.response.data.outcome) {
            const token1 = error.response.data.outcome.tokens;
            Cookies.set("UserCredential", token1, { expires: 7 });
        }
        console.error(error);
        const errors = ErrorHandler(error);
        toast.error(errors);
    }
};

export const fetchAll100Meter = async (eventId, groupId, parallelReservation, cast, gender, fromDate, toDate) => {
    const recruitId = localStorage.getItem("recruitId");
    const UserId = localStorage.getItem("userId");
    const params = {

        UserId: UserId,
        RecruitId: recruitId,
        // Eventid: "1bce2267-2e13-46dd-8ade-2825c79012e1",
        Eventid: eventId,
        Groupid: groupId || "",
        ParallelReservation: parallelReservation || "",
        Cast: cast || "",
        Gender: gender,
        FromDate: fromDate,
        ToDate: toDate
    };
    try {
        const response = await apiClient({
            method: "get",
            params: params,
            url: `CandidateDailyReport/Get100meterAll`,
        });
        const candidateData = response.data.data;
        // setCandidateData(candidateData);

        const token1 = response.data.outcome.tokens;
        Cookies.set("UserCredential", token1, { expires: 7 });
        return candidateData;
    } catch (error) {
        if (error.response && error.response.data && error.response.data.outcome) {
            const token1 = error.response.data.outcome.tokens;
            Cookies.set("UserCredential", token1, { expires: 7 });
        }
        console.error(error);
        const errors = ErrorHandler(error);
        toast.error(errors);
    }
};

export const fetchAll800Meter = async (eventId, groupId, parallelReservation, cast, gender, fromDate, toDate) => {
    const recruitId = localStorage.getItem("recruitId");
    const UserId = localStorage.getItem("userId");
    const params = {

        UserId: UserId,
        RecruitId: recruitId,
        // Eventid: "86b9d4ad-bd1b-4a45-bf58-d921bb358ee5"
        Eventid: eventId,
        Groupid: groupId,
        ParallelReservation: parallelReservation,
        Cast: cast,
        Gender: gender,
        FromDate: fromDate,
        ToDate: toDate
    };
    try {
        const response = await apiClient({
            method: "get",
            params: params,
            url: `CandidateDailyReport/Get800meterAll`,
        });
        const candidateData = response.data.data;

        // setCandidateData(candidateData);
        const token1 = response.data.outcome.tokens;
        Cookies.set("UserCredential", token1, { expires: 7 });
        return candidateData;
    } catch (error) {
        if (error.response && error.response.data && error.response.data.outcome) {
            const token1 = error.response.data.outcome.tokens;
            Cookies.set("UserCredential", token1, { expires: 7 });
        }
        console.error(error);
        const errors = ErrorHandler(error);
        toast.error(errors);
    }
};

export const fetchAll1600Meter = async (eventId, groupId, parallelReservation, cast, gender, fromDate, toDate) => {
    const recruitId = localStorage.getItem("recruitId");
    const UserId = localStorage.getItem("userId");
    const params = {

        UserId: UserId,
        RecruitId: recruitId,
        // Eventid: "9f0177f5-42ff-430e-8ed5-1a48517d2197"
        Eventid: eventId,
        Groupid: groupId,
        ParallelReservation: parallelReservation,
        Cast: cast,
        Gender: gender,
        FromDate: fromDate,
        ToDate: toDate
    };
    try {
        const response = await apiClient({
            method: "get",
            params: params,
            url: `CandidateDailyReport/Get1600meterAll`,
        });
        const candidateData = response.data.data;

        // setCandidateData(candidateData);
        const token1 = response.data.outcome.tokens;
        Cookies.set("UserCredential", token1, { expires: 7 });
        return candidateData;
    } catch (error) {
        if (error.response && error.response.data && error.response.data.outcome) {
            const token1 = error.response.data.outcome.tokens;
            Cookies.set("UserCredential", token1, { expires: 7 });
        }
        console.error(error);
        const errors = ErrorHandler(error);
        toast.error(errors);
    }
};

export const fetchAllShotput = async (eventId, groupId, parallelReservation, cast, gender, fromDate, toDate) => {
    const recruitId = localStorage.getItem("recruitId");
    const UserId = localStorage.getItem("userId");
    const params = {

        UserId: UserId,
        RecruitId: recruitId,
        // Eventid: "a551671a-ec99-4d5f-8231-bab05c679342"
        Eventid: eventId,
        Groupid: groupId,
        ParallelReservation: parallelReservation,
        Cast: cast,
        Gender: gender,
        FromDate: fromDate,
        ToDate: toDate
    };
    try {
        const response = await apiClient({
            method: "get",
            params: params,
            url: `CandidateDailyReport/GetShotPutAll`,
        });
        const candidateData = response.data.data;

        // setCandidateData(candidateData);
        const token1 = response.data.outcome.tokens;
        Cookies.set("UserCredential", token1, { expires: 7 });
        return candidateData;
    } catch (error) {
        if (error.response && error.response.data && error.response.data.outcome) {
            const token1 = error.response.data.outcome.tokens;
            Cookies.set("UserCredential", token1, { expires: 7 });
        }
        console.error(error);
        const errors = ErrorHandler(error);
        toast.error(errors);
    }
};

export const fetchAllReport = async (groupId, parallelReservation, cast, gender, fromDate, toDate) => {
    const recruitId = localStorage.getItem("recruitId");
    const UserId = localStorage.getItem("userId");
    const params = {

        UserId: UserId,
        RecruitId: recruitId,
        Groupid: groupId,
        ParallelReservation: parallelReservation,
        Cast: cast,
        Gender: gender,
        FromDate: fromDate,
        ToDate: toDate
        // Eventid: "a551671a-ec99-4d5f-8231-bab05c679342"
    };
    try {
        const response = await apiClient({
            method: "get",
            params: params,
            url: `CandidateDailyReport/GetAllEventData`,
        });
        const candidateData = response.data.data;

        // setCandidateData(candidateData);
        const token1 = response.data.outcome.tokens;
        Cookies.set("UserCredential", token1, { expires: 7 });
        return candidateData;
    } catch (error) {
        if (error.response && error.response.data && error.response.data.outcome) {
            const token1 = error.response.data.outcome.tokens;
            Cookies.set("UserCredential", token1, { expires: 7 });
        }
        console.error(error);
        const errors = ErrorHandler(error);
        toast.error(errors);
    }
};

export const fetchAllHeightChest = async (groupId, parallelReservation, cast, gender, fromDate, toDate) => {
    const recruitId = localStorage.getItem("recruitId");
    const UserId = localStorage.getItem("userId");
    const params = {

        UserId: UserId,
        RecruitId: recruitId,
        // Eventid: "9f0177f5-42ff-430e-8ed5-1a48517d2197"
        // Eventid: eventId,
        Groupid: groupId,
        ParallelReservation: parallelReservation,
        Cast: cast,
        Gender: gender,
        // FromDate: null,
        // ToDate : null,
        FromDate: fromDate,
        ToDate: toDate
    };
    try {
        const response = await apiClient({
            method: "get",
            params: params,
            url: `CandidateDailyReport/GetHeightChestDataAll`,
        });
        const candidateData = response.data.data;

        // setCandidateData(candidateData);
        const token1 = response.data.outcome.tokens;
        Cookies.set("UserCredential", token1, { expires: 7 });
        return candidateData;
    } catch (error) {
        if (error.response && error.response.data && error.response.data.outcome) {
            const token1 = error.response.data.outcome.tokens;
            Cookies.set("UserCredential", token1, { expires: 7 });
        }
        console.error(error);
        const errors = ErrorHandler(error);
        toast.error(errors);
    }
};

export const getAllGender = () => {
    const UserId = localStorage.getItem("userId");
    const recruitId = localStorage.getItem("recruitId");
    return apiClient({
        method: "get",
        url: `ParameterValueMaster/GetAll`.toString(),
        params: {
            UserId: UserId,

            pv_parameterid: "a12076dd-f5e5-482a-9672-78995a0924a6",
            pv_isactive: "1"
        },
    })
        .then((response) => {
            console.log("response all gender", response.data.data);
            const token1 = response.data.outcome.tokens;
            Cookies.set("UserCredential", token1, { expires: 7 });
            return response.data.data.map((item) => ({
                value: item.pv_id,
                label: item.pv_parametervalue,
            }));
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
            return [];
        });
};

export const GetCategory = async (groupId) => {
    const recruitId = localStorage.getItem("recruitId");
    const UserId = localStorage.getItem("userId");

    const params = {
        UserId: UserId,
        RecruitId: recruitId,
    }

    try {
        const response = await apiClient({
            method: "get",
            params: params,
            url: `CategoryDocPrivilege/GetCategoryName`,
        });
        const categoryData = response.data.data;

        // setCandidateData(candidateData);
        const token1 = response.data.outcome.tokens;
        Cookies.set("UserCredential", token1, { expires: 7 });
        return categoryData;
    } catch (error) {
        if (error.response && error.response.data && error.response.data.outcome) {
            const token1 = error.response.data.outcome.tokens;
            Cookies.set("UserCredential", token1, { expires: 7 });
        }
        console.error(error);
        const errors = ErrorHandler(error);
        toast.error(errors);
    }
};

export const getReservationCategory = () => {
    const recruitId = localStorage.getItem("recruitId");
    const UserId = localStorage.getItem("userId");
    return apiClient({
        method: "get",
        url: `CastCutOffService/GetSubCategory`,
        params: {
            UserId: UserId,
            RecruitId: recruitId,
            recConfId: recruitId
        },
    })
        .then((response) => {
            console.log("response all sub category name", response.data.data);
            const temp = response.data.data;
            const options = temp.map((data) => ({
                value: data.Id,
                label: data.CategoryName,
            }));

            const token1 = response.data.outcome.tokens;
            Cookies.set("UserCredential", token1, { expires: 7 });
            return options;
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

export const getAllCast = () => {
    const UserId = localStorage.getItem("userId");
    const recruitId = localStorage.getItem("recruitId");
    return apiClient({
        method: "get",
        url: `CandidateDailyReport/GetCasts`.toString(),
        params: {
            UserId: UserId,
            RecruitId: recruitId,

        },
    })
        .then((response) => {
            console.log("response all casts", response.data.data);
            const token1 = response.data.outcome.tokens;
            Cookies.set("UserCredential", token1, { expires: 7 });
            // setOptions(response.data.data.map((item) => ({
            //     value: item.pv_id,
            //     label: item.pv_parametervalue,
            // })))
            // console.log(options, "84")
            const temp = response.data.data.map((item) => ({
                value: item.pv_parametervalue,
                label: item.pv_parametervalue,
            }));
            return temp;

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