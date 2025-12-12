// import $ from 'jquery';

//  var uri = "https://localhost:8003/mfs100/"; 
// // var uri = "https://localhost:8003/mfs100/";   //Secure
// // var uri = "http://127.0.0.1/mfs100/"; //Non-Secure

// function GetMFS100Info() {
//     return GetMFS100Client("info");
// }

// function GetMFS100KeyInfo(key) {
//     var MFS100Request = {
//         "Key": key,
//     };
//     var jsondata = JSON.stringify(MFS100Request);
//     return PostMFS100Client("keyinfo", jsondata);
// }

// function CaptureFinger(quality, timeout) {
//     var MFS100Request = {
//         "Quality": 1,
//         "TimeOut": 5000
//     };
//     var jsondata = JSON.stringify(MFS100Request);
//     return PostMFS100Client("capture", jsondata);
// }
// function CaptureMultiFinger(quality, timeout, nooffinger) {
//     var MFS100Request = {
//         "Quality": 1,
//         "TimeOut": timeout,
//         "NoofFinger": nooffinger
//     };
//     var jsondata = JSON.stringify(MFS100Request);
//     return PostMFS100Client("capturewithduplicate", jsondata);
// }
// function VerifyFinger(ProbFMR, GalleryFMR) {
//     var MFS100Request = {
//         "ProbTemplate": ProbFMR,
//         "GalleryTemplate": GalleryFMR,
//         "BioType": "ANSI" // you can paas here BioType as "ANSI" if you are using ANSI Template
//     };
//     var jsondata = JSON.stringify(MFS100Request);
//     return PostMFS100Client("verify", jsondata);
// }
// function MatchFinger(quality, timeout, GalleryFMR) {
//     var MFS100Request = {
//         "Quality": quality,
//         "TimeOut": timeout,
//         "GalleryTemplate": GalleryFMR,
//         "BioType": "ANSI" // you can paas here BioType as "ANSI" if you are using ANSI Template
//     };
//     var jsondata = JSON.stringify(MFS100Request);
//     return PostMFS100Client("match", jsondata);
// }
// function GetPidData(BiometricArray) {
//     var req = new MFS100Request(BiometricArray);
//     var jsondata = JSON.stringify(req);
//     return PostMFS100Client("getpiddata", jsondata);
// }
// function GetRbdData(BiometricArray) {
//     var req = new MFS100Request(BiometricArray);
//     var jsondata = JSON.stringify(req);
//     return PostMFS100Client("getrbddata", jsondata);
// }
// function PostMFS100Client(method, jsonData) {
//     var res;
//     $.support.cors = true;
//     var httpStaus = false;
//     $.ajax({
//         type: "POST",
//         async: false,
//         crossDomain: true,
//         url: uri + method,
//         contentType: "application/json; charset=utf-8",
//         data: jsonData,
//         dataType: "json",
//         processData: false,
//         success: function (data) {
//             httpStaus = true;
//             res = { httpStaus: httpStaus, data: data };
//         },
//         error: function (jqXHR, ajaxOptions, thrownError) {
//             res = { httpStaus: httpStaus, err: getHttpError(jqXHR) };
//         },
//     });
//     return res;
// }

// function GetMFS100Client(method) {
//     var res;
//     $.support.cors = true;
//     var httpStaus = false;
//     $.ajax({
//         type: "GET",
//         async: false,
//         crossDomain: true,
//         url: uri + method,
//         contentType: "application/json; charset=utf-8",
//         processData: false,
//         success: function (data) {
//             httpStaus = true;
//             res = { httpStaus: httpStaus, data: data };
//         },
//         error: function (jqXHR, ajaxOptions, thrownError) {
//             res = { httpStaus: httpStaus, err: getHttpError(jqXHR) };
//         },
//     });
//     return res;
// }
// function getHttpError(jqXHR) {
//     var err = "Unhandled Exception";
//     if (jqXHR.status === 0) {
//         err = 'Service Unavailable';
//     } else if (jqXHR.status == 404) {
//         err = 'Requested page not found';
//     } else if (jqXHR.status == 500) {
//         err = 'Internal Server Error';
//     }  else {
//         err = 'Unhandled Error';
//     }
//     return err;
// }
// function testConnection() {
//     const result = GetMFS100Info();
//     console.log("Connection test result:", result);
//     return result;
// }

// function Biometric(BioType, BiometricData, Pos, Nfiq, Na) {
//     this.BioType = BioType;
//     this.BiometricData = BiometricData;
//     this.Pos = Pos;
//     this.Nfiq = Nfiq;
//     this.Na = Na;
// }

// function MFS100Request(BiometricArray) {
//     this.Biometrics = BiometricArray;
// }
// export {CaptureFinger, VerifyFinger, MatchFinger, GetMFS100KeyInfo, GetMFS100Info}

import $ from 'jquery';

const uri = "https://localhost:8003/mfs100/";
const RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 1000; // 1 second

// Device status cache
let deviceStatus = {
    isConnected: false,
    lastChecked: null,
    deviceInfo: null
};

/**
 * Check if MFS100 device is connected and driver is running
 */
async function checkDeviceStatus() {
    try {
        const result = await GetMFS100InfoAsync();
        if (result.httpStatus && result.data) {
            deviceStatus.isConnected = true;
            deviceStatus.lastChecked = new Date();
            deviceStatus.deviceInfo = result.data;
            return {
                success: true,
                message: "Device connected successfully",
                data: result.data
            };
        }
    } catch (error) {
        deviceStatus.isConnected = false;
    }
    
    return {
        success: false,
        message: "Device not connected. Please ensure:\n" +
                 "1. MFS100 device is connected to USB\n" +
                 "2. Driver is installed\n" +
                 "3. RD Service is running\n" +
                 "4. Try restarting the service or system",
        error: "DEVICE_NOT_FOUND"
    };
}

/**
 * Get MFS100 device information with retry logic
 */
async function GetMFS100InfoAsync() {
    return await retryOperation(() => GetMFS100Client("info"));
}

/**
 * Get key information
 */
function GetMFS100KeyInfo(key) {
    if (!deviceStatus.isConnected) {
        return createErrorResponse("Device not connected. Please check device status first.");
    }
    
    const MFS100Request = { "Key": key };
    const jsondata = JSON.stringify(MFS100Request);
    return PostMFS100Client("keyinfo", jsondata);
}

/**
 * Capture single finger with improved error handling
 */
async function CaptureFinger(quality = 60, timeout = 10000) {
    // Check device before capture
    const status = await checkDeviceStatus();
    if (!status.success) {
        return createErrorResponse(status.message);
    }
    
    const MFS100Request = {
        "Quality": quality,
        "TimeOut": timeout
    };
    const jsondata = JSON.stringify(MFS100Request);
    
    try {
        const result = await retryOperation(() => PostMFS100Client("capture", jsondata));
        
        if (result.httpStatus && result.data) {
            if (result.data.ErrorCode === "0") {
                return {
                    success: true,
                    message: "Fingerprint captured successfully",
                    data: result.data
                };
            } else {
                return {
                    success: false,
                    message: getErrorMessage(result.data.ErrorCode),
                    errorCode: result.data.ErrorCode,
                    data: result.data
                };
            }
        } else {
            return createErrorResponse(result.err || "Capture failed");
        }
    } catch (error) {
        return createErrorResponse("Capture operation failed: " + error);
    }
}

/**
 * Capture multiple fingers
 */
async function CaptureMultiFinger(quality = 60, timeout = 10000, nooffinger = 1) {
    const status = await checkDeviceStatus();
    if (!status.success) {
        return createErrorResponse(status.message);
    }
    
    const MFS100Request = {
        "Quality": quality,
        "TimeOut": timeout,
        "NoofFinger": nooffinger
    };
    const jsondata = JSON.stringify(MFS100Request);
    
    try {
        const result = await retryOperation(() => PostMFS100Client("capturewithduplicate", jsondata));
        
        if (result.httpStatus && result.data) {
            if (result.data.ErrorCode === "0") {
                return {
                    success: true,
                    message: "Fingerprints captured successfully",
                    data: result.data
                };
            } else {
                return {
                    success: false,
                    message: getErrorMessage(result.data.ErrorCode),
                    errorCode: result.data.ErrorCode
                };
            }
        } else {
            return createErrorResponse(result.err || "Multi-capture failed");
        }
    } catch (error) {
        return createErrorResponse("Multi-capture operation failed: " + error);
    }
}

/**
 * Verify fingerprint
 */
function VerifyFinger(ProbFMR, GalleryFMR) {
    if (!deviceStatus.isConnected) {
        return createErrorResponse("Device not connected");
    }
    
    const MFS100Request = {
        "ProbTemplate": ProbFMR,
        "GalleryTemplate": GalleryFMR,
        "BioType": "ANSI"
    };
    const jsondata = JSON.stringify(MFS100Request);
    return PostMFS100Client("verify", jsondata);
}

/**
 * Match fingerprint
 */
function MatchFinger(quality, timeout, GalleryFMR) {
    if (!deviceStatus.isConnected) {
        return createErrorResponse("Device not connected");
    }
    
    const MFS100Request = {
        "Quality": quality,
        "TimeOut": timeout,
        "GalleryTemplate": GalleryFMR,
        "BioType": "ANSI"
    };
    const jsondata = JSON.stringify(MFS100Request);
    return PostMFS100Client("match", jsondata);
}

/**
 * Get PID data
 */
function GetPidData(BiometricArray) {
    const req = new MFS100Request(BiometricArray);
    const jsondata = JSON.stringify(req);
    return PostMFS100Client("getpiddata", jsondata);
}

/**
 * Get RBD data
 */
function GetRbdData(BiometricArray) {
    const req = new MFS100Request(BiometricArray);
    const jsondata = JSON.stringify(req);
    return PostMFS100Client("getrbddata", jsondata);
}

/**
 * Retry logic for operations
 */
async function retryOperation(operation, attempts = RETRY_ATTEMPTS) {
    for (let i = 0; i < attempts; i++) {
        try {
            const result = operation();
            if (result.httpStatus) {
                return result;
            }
            
            if (i < attempts - 1) {
                await delay(RETRY_DELAY);
            }
        } catch (error) {
            if (i === attempts - 1) {
                throw error;
            }
            await delay(RETRY_DELAY);
        }
    }
    throw new Error("Operation failed after " + attempts + " attempts");
}

/**
 * Delay helper
 */
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * POST request to MFS100 client
 */
function PostMFS100Client(method, jsonData) {
    let res;
    $.support.cors = true;
    let httpStatus = false;
    
    $.ajax({
        type: "POST",
        async: false,
        crossDomain: true,
        url: uri + method,
        contentType: "application/json; charset=utf-8",
        data: jsonData,
        dataType: "json",
        processData: false,
        success: function (data) {
            httpStatus = true;
            res = { httpStatus: httpStatus, data: data };
        },
        error: function (jqXHR, ajaxOptions, thrownError) {
            res = { httpStatus: httpStatus, err: getHttpError(jqXHR) };
        },
    });
    
    return res;
}

/**
 * GET request to MFS100 client
 */
function GetMFS100Client(method) {
    let res;
    $.support.cors = true;
    let httpStatus = false;
    
    $.ajax({
        type: "GET",
        async: false,
        crossDomain: true,
        url: uri + method,
        contentType: "application/json; charset=utf-8",
        processData: false,
        success: function (data) {
            httpStatus = true;
            res = { httpStatus: httpStatus, data: data };
        },
        error: function (jqXHR, ajaxOptions, thrownError) {
            res = { httpStatus: httpStatus, err: getHttpError(jqXHR) };
        },
    });
    
    return res;
}

/**
 * Get HTTP error message
 */
function getHttpError(jqXHR) {
    let err = "Unhandled Exception";
    
    if (jqXHR.status === 0) {
        err = 'RD Service not running. Please start the service and try again.';
    } else if (jqXHR.status == 404) {
        err = 'Requested endpoint not found. Check if correct driver is installed.';
    } else if (jqXHR.status == 500) {
        err = 'Internal Server Error in RD Service';
    } else if (jqXHR.status == 403) {
        err = 'Access denied. Check permissions.';
    } else {
        err = 'Connection error: ' + jqXHR.status;
    }
    
    return err;
}

/**
 * Get user-friendly error messages
 */
function getErrorMessage(errorCode) {
    const errorMessages = {
        "0": "Success",
        "-1": "Device not found or disconnected",
        "-2": "Invalid parameter",
        "-3": "Capture timeout - Please place finger properly",
        "-4": "Poor quality finger - Please try again",
        "-5": "Driver not found or service not running",
        "710": "Device not ready",
        "720": "Timeout - Finger not detected",
        "721": "Poor quality fingerprint"
    };
    
    return errorMessages[errorCode] || "Error code: " + errorCode;
}

/**
 * Create standardized error response
 */
function createErrorResponse(message) {
    return {
        success: false,
        httpStatus: false,
        message: message,
        data: null
    };
}

/**
 * Test connection and display status
 */
async function testConnection() {
    console.log("Testing MFS100 device connection...");
    const status = await checkDeviceStatus();
    console.log("Connection Status:", status);
    return status;
}

// Helper classes
function Biometric(BioType, BiometricData, Pos, Nfiq, Na) {
    this.BioType = BioType;
    this.BiometricData = BiometricData;
    this.Pos = Pos;
    this.Nfiq = Nfiq;
    this.Na = Na;
}

function MFS100Request(BiometricArray) {
    this.Biometrics = BiometricArray;
}

// Export all functions
export {
    CaptureFinger,
    CaptureMultiFinger,
    VerifyFinger,
    MatchFinger,
    GetMFS100KeyInfo,
    GetMFS100InfoAsync as GetMFS100Info,
    checkDeviceStatus,
    testConnection,
    GetPidData,
    GetRbdData
};