// import { calculatePaginationRange, handleNext, handlePageClick, handlePrevious } from "./PaginationUtils";

// export const Pagination = ({
//     currentPage,
//     setCurrentPage,
//     allData,
//     itemsPerPage,
//   }) => {
//     return (
//       <nav aria-label="Page navigation example">
//         <ul className="pagination justify-content-center justify-content-lg-end">
//           <li className="page-item">
//             <button
//               className="page-link"
//               onClick={() => handlePrevious(currentPage, setCurrentPage)}
//               disabled={currentPage === 1}
//               aria-label="Previous"
//             >
//               <span aria-hidden="true">&laquo;</span>
//             </button>
//           </li>
//           {calculatePaginationRange(currentPage, allData, itemsPerPage).map(
//             (number) => (
//               <li
//                 key={number}
//                 className={`page-item ${
//                   currentPage === number ? "active" : ""
//                 }`}
//               >
//                 <button
//                   className="page-link"
//                   onClick={() => handlePageClick(number, setCurrentPage)}
//                 >
//                   {number}
//                 </button>
//               </li>
//             )
//           )}
//           <li className="page-item">
//             <button
//               className="page-link"
//               onClick={() =>
//                 handleNext(
//                   currentPage,
//                   allData,
//                   itemsPerPage,
//                   setCurrentPage
//                 )
//               }
//               disabled={
//                 currentPage === Math.ceil(allData.length / itemsPerPage)
//               }
//               aria-label="Next"
//             >
//               <span aria-hidden="true">&raquo;</span>
//             </button>
//           </li>
//         </ul>
//       </nav>
//     );
//   };
  // PaginationUtils.js
// export const getPageNumbers = (currentPage, totalPages) => {
//   const delta = 1; // Number of pages to show before and after current page
//   const range = [];
//   const rangeWithDots = [];

//   // Always show first page
//   range.push(1);

//   for (let i = currentPage - delta; i <= currentPage + delta; i++) {
//     if (i > 1 && i < totalPages) {
//       range.push(i);
//     }
//   }

//   // Always show last page
//   if (totalPages > 1) {
//     range.push(totalPages);
//   }

//   // Add the page numbers with dots
//   let l;
//   for (let i of range) {
//     if (l) {
//       if (i - l === 2) {
//         rangeWithDots.push(l + 1);
//       } else if (i - l !== 1) {
//         rangeWithDots.push('...');
//       }
//     }
//     rangeWithDots.push(i);
//     l = i;
//   }

//   return rangeWithDots;
// };

// export const handlePrevious = (currentPage, setCurrentPage) => {
//   setCurrentPage(currentPage - 1);
// };

// export const handleNext = (currentPage, allData, itemsPerPage, setCurrentPage) => {
//   setCurrentPage(currentPage + 1);
// };

// export const handlePageClick = (pageNumber, setCurrentPage) => {
//   setCurrentPage(pageNumber);
// };

// // Pagination Component
// export const Pagination = ({
//   currentPage,
//   setCurrentPage,
//   allData,
//   itemsPerPage,
// }) => {
//   const totalPages = Math.ceil(allData.length / itemsPerPage);
//   const pageNumbers = getPageNumbers(currentPage, totalPages);

//   return (
//     <nav aria-label="Page navigation example">
//       <ul className="pagination justify-content-center justify-content-lg-end">
//         <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
//           <button
//             className="page-link"
//             onClick={() => handlePrevious(currentPage, setCurrentPage)}
//             disabled={currentPage === 1}
//             aria-label="Previous"
//           >
//             <span aria-hidden="true">&laquo;</span>
//           </button>
//         </li>

//         {pageNumbers.map((number, index) => (
//           <li
//             key={index}
//             className={`page-item ${
//               currentPage === number ? 'active' : ''
//             } ${number === '...' ? 'disabled' : ''}`}
//           >
//             <button
//               className="page-link"
//               onClick={() => 
//                 number !== '...' && handlePageClick(number, setCurrentPage)
//               }
//               disabled={number === '...'}
//             >
//               {number}
//             </button>
//           </li>
//         ))}

//         <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
//           <button
//             className="page-link"
//             onClick={() =>
//               handleNext(currentPage, allData, itemsPerPage, setCurrentPage)
//             }
//             disabled={currentPage === totalPages}
//             aria-label="Next"
//           >
//             <span aria-hidden="true">&raquo;</span>
//           </button>
//         </li>
//       </ul>
//     </nav>
//   );
// };
// PaginationUtils.js
export const getPageNumbers = (currentPage, totalPages) => {
  const range = [];
  
  // Always add page 1
  range.push(1);
  
  if (currentPage <= 4) {
    // Near the start
    if (totalPages > 3) {
      range.push(2, 3, 4, '...', totalPages);
    } else {
      for (let i = 2; i <= totalPages; i++) {
        range.push(i);
      }
    }
  } else if (currentPage >= totalPages - 3) {
    // Near the end
    range.push('...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
  } else {
    // In the middle
    range.push('...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
  }
  
  return range;
};

export const handlePrevious = (currentPage, setCurrentPage) => {
  setCurrentPage(currentPage - 1);
};

export const handleNext = (currentPage, allData, itemsPerPage, setCurrentPage) => {
  setCurrentPage(currentPage + 1);
};

export const handlePageClick = (pageNumber, setCurrentPage) => {
  setCurrentPage(pageNumber);
};

// Pagination Component
export const Pagination = ({
  currentPage,
  setCurrentPage,
  allData,
  itemsPerPage,
}) => {
  const totalPages = Math.ceil(allData.length / itemsPerPage);
  const pageNumbers = getPageNumbers(currentPage, totalPages);

  return (
    <nav aria-label="Page navigation" className="mt-3">
      <ul className="pagination pagination-sm flex-wrap justify-content-center justify-content-lg-end gap-1">
        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <button
            className="page-link"
            onClick={() => handlePrevious(currentPage, setCurrentPage)}
            disabled={currentPage === 1}
            aria-label="Previous"
          >
            <span aria-hidden="true">&laquo;</span>
          </button>
        </li>

        {pageNumbers.map((number, index) => (
          <li
            key={index}
            className={`page-item ${
              currentPage === number ? 'active' : ''
            } ${number === '...' ? 'disabled' : ''}`}
          >
            <button
              className="page-link"
              onClick={() => 
                number !== '...' && handlePageClick(number, setCurrentPage)
              }
              disabled={number === '...'}
            >
              {number}
            </button>
          </li>
        ))}

        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
          <button
            className="page-link"
            onClick={() =>
              handleNext(currentPage, allData, itemsPerPage, setCurrentPage)
            }
            disabled={currentPage === totalPages}
            aria-label="Next"
          >
            <span aria-hidden="true">&raquo;</span>
          </button>
        </li>
      </ul>
    </nav>
  );
};