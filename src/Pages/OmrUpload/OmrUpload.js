// import React, { useState } from 'react';
// import { useDropzone } from 'react-dropzone';

// const OMRUpload = ({ onImageUpload }) => {
//   const [image, setImage] = useState(null);

//   const handleDrop = (acceptedFiles) => {
//     const file = acceptedFiles[0];
//     const reader = new FileReader();
//     reader.onload = (e) => {
//       setImage(e.target.result);
//       onImageUpload(e.target.result);
//     };
//     reader.readAsDataURL(file);
//   };

//   const { getRootProps, getInputProps } = useDropzone({
//     onDrop: handleDrop,
//     accept: 'image/*',
//   });

//   return (
//     <div {...getRootProps({ className: 'dropzone' })}>
//       <input {...getInputProps()} />
//       <p>Drag & drop an OMR sheet image here, or click to select a file</p>
//       {image && <img src={image} alt="OMR Sheet" style={{ width: '100%', marginTop: '20px' }} />}
//     </div>
//   );
// };

// export default OMRUpload;
