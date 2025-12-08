
// const UserId = localStorage.getItem("userId");
// const storedToken = localStorage.getItem("UserCredential");

// export default { UserId, storedToken };
import Cookies from 'js-cookie'; 
import 'react-toastify/dist/ReactToastify.css';

const UserId = localStorage.getItem("userId");
// const storedToken = localStorage.getItem("UserCredential");
const storedToken = Cookies.get("UserCredential");
const recruitId = localStorage.getItem("recruitId")

const Storage = { UserId, storedToken , recruitId};

export default Storage;
