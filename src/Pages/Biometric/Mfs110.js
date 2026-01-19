import $ from 'jquery';

const uri = "http://127.0.0.1:11100/"; // MFS110 RD Service URI
const RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 1000; // 1 second

let deviceStatus = {
    isConnected: false,
    lastChecked: null,
    deviceInfo: null
};

// -------------------- Device Status --------------------
async function checkDeviceStatus() {
    try {
        const result = await GetMFS110Info();
        if (result.success && result.data) {
            deviceStatus.isConnected = true;
            deviceStatus.lastChecked = new Date();
            deviceStatus.deviceInfo = result.data;
            return { success: true, message: "MFS110 connected successfully", data: result.data };
        }
    } catch (error) {
        deviceStatus.isConnected = false;
    }
    return {
        success: false,
        message: "Device not connected. Ensure:\n1. MFS110 USB connected\n2. Mantra RD Service running\n3. Check http://127.0.0.1:11100/rd/info",
        error: "DEVICE_NOT_FOUND"
    };
}

async function GetMFS110Info() {
    return await retryOperation(() => GetMFS110Client("rd/info"));
}

// -------------------- Capture Finger --------------------
async function CaptureFinger(quality = 60, timeout = 10000) {
    const status = await checkDeviceStatus();
    if (!status.success) return createErrorResponse(status.message);

    const pidOptions = `<?xml version="1.0"?>
<PidOptions ver="1.0">
    <Opts fCount="1" fType="2" iCount="0" iType="" pCount="0" pType="" format="0" pidVer="2.0" timeout="${timeout}" wadh="" posh=""/>
</PidOptions>`;

    try {
        const result = await retryOperation(() => PostMFS110Client("rd/capture", pidOptions));
        if (result.success && result.data) {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(result.data, "text/xml");
            const errCode = xmlDoc.getElementsByTagName("Resp")[0]?.getAttribute("errCode");
            
            if (errCode === "0") {
                return { 
                    success: true, 
                    message: "Fingerprint captured successfully", 
                    data: result.data, 
                    xmlDoc: xmlDoc 
                };
            } else {
                const errInfo = xmlDoc.getElementsByTagName("Resp")[0]?.getAttribute("errInfo");
                return { 
                    success: false, 
                    message: errInfo || getErrorMessage(errCode), 
                    errorCode: errCode, 
                    data: result.data 
                };
            }
        }
        return { success: false, message: "No response from device", data: result.data };
    } catch (error) {
        return createErrorResponse("Capture operation failed: " + error.message);
    }
}

// -------------------- Capture MultiFinger --------------------
async function CaptureMultiFinger(quality = 60, timeout = 10000, noOfFingers = 2) {
    const status = await checkDeviceStatus();
    if (!status.success) return createErrorResponse(status.message);

    const pidOptions = `<?xml version="1.0"?>
<PidOptions ver="1.0">
    <Opts fCount="${noOfFingers}" fType="2" iCount="0" iType="" pCount="0" pType="" format="0" pidVer="2.0" timeout="${timeout}" wadh="" posh=""/>
</PidOptions>`;

    try {
        const result = await retryOperation(() => PostMFS110Client("rd/capture", pidOptions));
        if (result.success && result.data) {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(result.data, "text/xml");
            const errCode = xmlDoc.getElementsByTagName("Resp")[0]?.getAttribute("errCode");
            
            if (errCode === "0") {
                return { 
                    success: true, 
                    message: "Fingerprints captured successfully", 
                    data: result.data, 
                    xmlDoc: xmlDoc 
                };
            } else {
                const errInfo = xmlDoc.getElementsByTagName("Resp")[0]?.getAttribute("errInfo");
                return { 
                    success: false, 
                    message: errInfo || getErrorMessage(errCode), 
                    errorCode: errCode,
                    data: result.data
                };
            }
        }
        return { success: false, message: "No response from device" };
    } catch (error) {
        return createErrorResponse("Multi-capture operation failed: " + error.message);
    }
}

// -------------------- Verify / Match --------------------
async function VerifyFinger(capturedXML, storedTemplate) {
    if (!deviceStatus.isConnected) return createErrorResponse("Device not connected");
    
    try {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(capturedXML, "text/xml");
        const capturedTemplate = xmlDoc.getElementsByTagName("Data")[0]?.textContent;
        
        // Simple string comparison for demo - in production use proper biometric matching
        const match = capturedTemplate === storedTemplate;
        
        return {
            success: true,
            matched: match,
            message: match ? "Fingerprint matched" : "Fingerprint did not match",
            score: match ? 100 : 0
        };
    } catch (error) {
        return createErrorResponse("Verification failed: " + error.message);
    }
}

// -------------------- Retry & AJAX --------------------
async function retryOperation(operation, attempts = RETRY_ATTEMPTS) {
    for (let i = 0; i < attempts; i++) {
        try {
            const result = await operation();
            if (result.success) return result;
            if (i < attempts - 1) await delay(RETRY_DELAY);
        } catch (error) {
            if (i === attempts - 1) throw error;
            await delay(RETRY_DELAY);
        }
    }
    throw new Error("Operation failed after " + attempts + " attempts");
}

function delay(ms) {
    return new Promise(res => setTimeout(res, ms));
}

function PostMFS110Client(method, data) {
    return new Promise((resolve) => {
        $.ajax({
            type: "CAPTURE",
            url: uri + method,
            contentType: "text/xml; charset=utf-8",
            data: data,
            processData: false,
            cache: false,
            crossDomain: true,
            success: function (response) { 
                resolve({ success: true, data: response }); 
            },
            error: function (jqXHR, textStatus, errorThrown) { 
                console.error('MFS110 Capture Error:', {
                    status: jqXHR.status,
                    method: method,
                    error: textStatus,
                    message: errorThrown,
                    response: jqXHR.responseText
                });
                resolve({ 
                    success: false, 
                    message: getHttpError(jqXHR, method), 
                    error: errorThrown,
                    statusCode: jqXHR.status,
                    data: jqXHR.responseText
                }); 
            }
        });
    });
}

function GetMFS110Client(method) {
    return new Promise((resolve) => {
        $.ajax({
            type: "RDSERVICE",
            url: uri + method,
            contentType: "text/xml; charset=utf-8",
            processData: false,
            cache: false,
            crossDomain: true,
            success: function (response) { 
                resolve({ success: true, data: response }); 
            },
            error: function (jqXHR, textStatus, errorThrown) { 
                console.error('MFS110 Info Error:', {
                    status: jqXHR.status,
                    error: textStatus,
                    message: errorThrown,
                    response: jqXHR.responseText
                });
                resolve({ 
                    success: false, 
                    message: getHttpError(jqXHR, method), 
                    error: errorThrown,
                    statusCode: jqXHR.status
                }); 
            }
        });
    });
}

// -------------------- Errors --------------------
function getHttpError(jqXHR, method) {
    if (jqXHR.status === 0) return 'Mantra RD Service not running - Start the service and check http://127.0.0.1:11100';
    if (jqXHR.status === 404) return 'Endpoint "' + method + '" not found - Check RD Service version';
    if (jqXHR.status === 405) return 'Method not allowed - RD Service expects RDSERVICE/CAPTURE methods';
    if (jqXHR.status === 500) return 'Internal Server Error in RD Service';
    if (jqXHR.status === 403) return 'Access denied - Check CORS/permissions';
    return 'Connection error: ' + jqXHR.status;
}

function getErrorMessage(errorCode) {
    const messages = {
        "0": "Success",
        "100": "Finger not detected",
        "110": "Device not found",
        "111": "Device initialization failed",
        "112": "Quality check failed",
        "113": "Device not ready",
        "114": "Timeout",
        "115": "Poor quality image",
        "140": "Invalid parameter value",
        "700": "Capture timeout",
        "720": "Finger not placed properly"
    };
    return messages[errorCode] || "Error code: " + errorCode;
}

function createErrorResponse(message) {
    return { success: false, message, data: null };
}

// -------------------- Helper Functions --------------------
function extractFingerprintData(xmlData) {
    try {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlData, "text/xml");
        
        return {
            template: xmlDoc.getElementsByTagName("Data")[0]?.textContent || "",
            sessionKey: xmlDoc.getElementsByTagName("Skey")[0]?.textContent || "",
            hmac: xmlDoc.getElementsByTagName("Hmac")[0]?.textContent || "",
            deviceInfo: {
                dc: xmlDoc.getElementsByTagName("DeviceInfo")[0]?.getAttribute("dc") || "",
                mi: xmlDoc.getElementsByTagName("DeviceInfo")[0]?.getAttribute("mi") || "",
                mc: xmlDoc.getElementsByTagName("DeviceInfo")[0]?.getAttribute("mc") || ""
            }
        };
    } catch (error) {
        console.error("Error extracting fingerprint data:", error);
        return null;
    }
}

// -------------------- Export --------------------
export {
    CaptureFinger,
    CaptureMultiFinger,
    VerifyFinger,
    GetMFS110Info,
    checkDeviceStatus,
    extractFingerprintData
};