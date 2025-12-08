import axios from 'axios';
import UrlData from './UrlData';
import Cookies from 'js-cookie';
 import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { v4 as uuidv4 } from 'uuid'; 

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
const getSessionId = () => {
  let sessionId = localStorage.getItem('sessionid');
  // if (!sessionId) {
  //   sessionId = uuidv4(); // Generate a new UUID
  //   localStorage.setItem('sessionId', sessionId);
  // }
  return sessionId;
};

// Create an Axios instance with base URL
const apiClient = axios.create({
  baseURL: UrlData,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor to add the token to the headers
// apiClient.interceptors.request.use(
//   config => {
//     const token = Cookies.get("UserCredential");
//     console.log('Adding token to headers:', token);
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   error => {
//     console.warn('Request interceptor error:', error);
//     return Promise.reject(error);
//   }
// );
apiClient.interceptors.request.use(
  async config => {
    const token = Cookies.get("UserCredential");
    // console.log('Adding token to headers:', token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      // const ipAddress = await getLocalIP();
      config.headers['IpAddress'] = "192.168.1.4";
      // config.headers['IpAddress'] = "192.168.1.2";
      // console.log('Adding local IP to headers:', ipAddress);
    } catch (error) {
      console.warn('Failed to get local IP:', error);
    }

    const sessionId = getSessionId();
    config.headers['SessionId'] = sessionId;
    // console.log('Adding session ID to headers:', sessionId);

    return config;
  },
  error => {
    console.warn('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors and refresh token
apiClient.interceptors.response.use(
  response => {
    const newToken = response.data.outcome?.tokens;
    if (newToken) {
      Cookies.set("UserCredential", newToken, { expires: 7 });
      // console.log('Token refreshed and set in cookies:', newToken);
    }
    return response;
  },
  async error => {
    const originalRequest = error.config;
    const recruitId = localStorage.getItem("recruitId");
    const UserId = localStorage.getItem("userId");
    const userId = UserId;

    // Check if it's a 401 error and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // console.log('Attempting to refresh token...');
        // Attempt to refresh the token
        const refreshResponse = await axios.get(`${UrlData}Dashboard/Get`, {
          params: {
            UserId: userId,
            RecruitId: recruitId
          }
        });
        const newToken = refreshResponse.data.outcome.tokens;

        if (newToken) {
          // Update the token in cookies and original request headers
          Cookies.set("UserCredential", newToken, { expires: 7 });
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
          console.log('Token refreshed successfully:', newToken);

          // Add userId and recruitId to the original request params
          originalRequest.params = {
            ...originalRequest.params,
            UserId: userId,
            RecruitId: recruitId
          };

          // Retry the original request
          return apiClient(originalRequest);
        } else {
          console.warn('Token refresh failed: No new token received');
          Cookies.remove("UserCredential");
          window.location.reload();
          return Promise.reject(error);
        }
      } catch (refreshError) {
        console.warn('Token refresh failed:', refreshError);
        // Cookies.remove("UserCredential");
        // window.location.href = '/';
        return Promise.reject(refreshError);
      }
    }

    // For other errors, reject the promise
    return Promise.reject(error);
  }
);

// Function to fetch paginated data and handle loading state
export const fetchPaginatedData = async (endpoint, params = {}, totalPages) => {
  let loading = true;
  let allData = [];
  let page = 1;

  try {
    console.log('Fetching data for page:', page);
    // Fetch first page
    const response = await apiClient.get(endpoint, {
      params: {
        ...params,
        page,
      },
    });
    allData = response.data.results;

    // Fetch subsequent pages, if any
    while (page < totalPages) {
      page++;
      console.log('Fetching data for page:', page);
      const nextPageResponse = await apiClient.get(endpoint, {
        params: {
          ...params,
          page,
        },
      });
      allData = [...allData, ...nextPageResponse.data.results]; // Accumulate data
    }
  } catch (error) {
    console.error('Error fetching paginated data:', error);
  } finally {
    loading = false; // Loading finished
    console.log('All pages fetched');
  }

  return allData; // Return the combined data from all pages
};

export { apiClient };
