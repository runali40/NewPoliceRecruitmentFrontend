// paginationUtils.js
export const handlePageClick = (pageNumber, setCurrentPage) => {
    setCurrentPage(pageNumber);
  };
  
  export const handlePrevious = (currentPage, setCurrentPage) => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  export const handleNext = (currentPage, allDepartment, itemsPerPage, setCurrentPage) => {
    if (currentPage < Math.ceil(allDepartment.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  export const calculatePaginationRange = (currentPage, allDepartment, itemsPerPage) => {
    const numberOfPages = Math.ceil(allDepartment.length / itemsPerPage);
    const startPage = Math.max(1, currentPage - 3);
    const endPage = Math.min(currentPage + 1, numberOfPages);
    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  };
  