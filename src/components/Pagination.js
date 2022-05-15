import React, { useEffect, useState } from "react";
// import "./CustomStyle.css";

const Pagination = ({ currentPage, limit, totalPages, setCurrentPage }) => {
  const range = (start, stop, step) =>
    Array.from(
      { length: (stop - start) / step + 1 },
      (_, i) => start + i * step
    );
  const [start, setStart] = useState(1);
  const [end, setEnd] = useState(Math.min(limit, totalPages));
  const [pageNumbers, setPageNumbers] = useState(range(start, end, 1));

  const checkRange = () => {
    if (currentPage > end) {
      setPageNumbers(
        range(
          Math.max(currentPage - limit + 1, 1),
          Math.min(currentPage, totalPages),
          1
        )
      );
      setStart(Math.max(currentPage - limit + 1, 1));
      setEnd(Math.min(currentPage, totalPages));
    } else if (currentPage < start) {
      setPageNumbers(
        range(
          Math.max(currentPage, 1),
          Math.min(currentPage - 1 + limit, totalPages),
          1
        )
      );
      setStart(Math.max(currentPage, 1));
      setEnd(Math.min(currentPage - 1 + limit, totalPages));
    }

    if ((end - start + 1 < limit && end < totalPages) || end > totalPages) {
      setPageNumbers(range(Math.max(totalPages - limit + 1, 1), totalPages, 1));
      setStart(Math.max(totalPages - limit + 1, 1));
      setEnd(totalPages);
    }
  };

  useEffect(() => {
    checkRange();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, totalPages, limit]);

  const next = () =>
    setCurrentPage((currentPage) => Math.min(currentPage + 1, totalPages));

  const previous = () =>
    setCurrentPage((currentPage) => Math.max(currentPage - 1, 1));

  const jump = (page) => {
    const pageNumber = Math.max(1, page);
    setCurrentPage((currentPage) => Math.min(pageNumber, totalPages));
  };

  const last = () => setCurrentPage(totalPages);

  const first = () => setCurrentPage(1);

  return (
    <ul className="pagination-block">
      <li
        className={`page-no${currentPage === 1 ? " disable" : ""}`}
        onClick={first}
      >
        <div className="content">&lt;&lt;</div>
      </li>
      <li
        className={`page-no${currentPage === 1 ? " disable" : ""}`}
        onClick={previous}
      >
        <div className="content">&lt;</div>
      </li>
      {pageNumbers.map((page) => (
        <li
          className={`page-no${currentPage === page ? " active" : ""}`}
          key={page}
          onClick={() => jump(page)}
        >
          <div className="content">{page}</div>
        </li>
      ))}
      <li
        className={`page-no${currentPage === totalPages ? " disable" : ""}`}
        onClick={next}
      >
        <div className="content">&gt;</div>
      </li>
      <li
        className={`page-no${currentPage === totalPages ? " disable" : ""}`}
        onClick={last}
      >
        <div className="content">&gt;&gt;</div>
      </li>
    </ul>
  );
};

export default Pagination;
