import React, { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import Tesseract from "tesseract.js";

function Signature() {
    const grpLdrSigRef = useRef();
    const [extractedText, setExtractedText] = useState("");

    const handleConvertToText = async () => {
        if (grpLdrSigRef.current.isEmpty()) {
            alert("Please provide a signature.");
            return;
        }

        // Get the signature as a base64 image
        const signatureDataURL = grpLdrSigRef.current.toDataURL();

        try {
            const { data: { text } } = await Tesseract.recognize(
                signatureDataURL,
                "eng",
                {
                    logger: (info) => console.log(info), // Optional: Logs OCR progress
                }
            );
            setExtractedText(text.trim());
        } catch (error) {
            console.error("OCR error:", error);
        }
    };

    return (
        <div>
            <div className="border border-dark bg-white" style={{ height: "200px", width: "200px" }}> <SignatureCanvas
                ref={grpLdrSigRef}
                penColor="black"
                canvasProps={{
                    width: 400,
                    height: 200,
                    className: "sigCanvas",
                }}
            /></div>

            <button onClick={handleConvertToText}>Convert to Text</button>
            <p>Extracted Text: {extractedText}</p>
        </div>
    );
}

export default Signature;
