// const ErrorHandler = (error,props) => {
//     try {
//         if(error.response.status===409)
//         {
//         return "Record already exist!"
//         }
//         else if(error.response.status===404){
//          return "User Not Found"
//         }
//         else if(error.response.status===400){          
//             return "Bad Request"           
//         }
//         else if(error.response.status===402){          
//             return "Allowed only 4 Entries"           
//         }
//         else if(error.response.status===401){          
//             return "Session Time Out"
           
//         }
//         else if(error.response.status===500){
//             alert("Something went wrong,Please try again.")
//         }
//         // else if(error.response.status===200){
//         //     alert("response get successfully")
//         // }
//     } catch (error) {
        
//     }
// }
// export default ErrorHandler

const ErrorHandler = (error, props) => {
    try {
        if (error.response.status === 409) {
            return "Record already exists!";
        } else if (error.response.status === 404) {
            return "User Not Found";
        } else if (error.response.status === 400) {
            return "Bad Request";
        } else if (error.response.status === 402) {
            return "Allowed only 4 Entries";
        } else if (error.response.status === 401) {
            return "Session Time Out";
        } else if (error.response.status === 500) {
            return "Application is not connect to API";
        } else {
            // Default case if status code does not match any condition
            // return "An unexpected error occurred.";
        }
    } catch (e) {
        // Handle the error thrown while processing the error
        // return "An error occurred while handling the error.";
    }
}

export default ErrorHandler;
