import { Fragment, useEffect, useState } from "react";

import Row from "./Row";
import Pagination from "./Pagination";
// import "./CustomStyle.css";

const Table = ({ users, onCheck, onDelete, onSelectedDelete, onEdit }) => {
  const maxUsersPerPage = 10;
  const maxPageNumber = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [check, setCheck] = useState(false);
  const [checkAllOnPage, setCheckAllOnPage] = useState(false);
  const [token, setToken] = useState(null);
  const [totalPages, setTotalPages] = useState(
    Math.ceil(users?.length / maxUsersPerPage)
  );
  const [data, setData] = useState(
    users.slice(
      (currentPage - 1) * maxUsersPerPage,
      (currentPage - 1) * maxUsersPerPage + maxUsersPerPage
    )
  );

  const currentPageUsers = () => {
    const start = (currentPage - 1) * maxUsersPerPage;
    const end = start + maxUsersPerPage;
    setData(users.slice(start, end));
  };

  useEffect(() => {
    currentPageUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users, currentPage]);

  useEffect(() => {
    if (currentPage > totalPages && totalPages !== 0) {
      setCurrentPage(totalPages);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users?.length, totalPages]);

  useEffect(() => {
    setTotalPages(Math.ceil(users?.length / maxUsersPerPage));
    setCheck(users.reduce((i, user) => i || user.isChecked, false));
  }, [users]);

  useEffect(() => {
    setCheckAllOnPage(data.reduce((i, member) => i && member.isChecked, true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, users, data]);

  const handleAllRowsCheck = (e) => {
    if (e.target.checked) data?.map((row) => !row.isChecked && onCheck(row.id));
    else data?.map((row) => row.isChecked && onCheck(row.id));
  };

  const handleRowCheck = (id) => onCheck(id);

  const handleRowDelete = (id) => onDelete(id);

  const handleDelete = () => onSelectedDelete();

  const handleRowEdit = (row) => onEdit(row);

  const handleEditLock = (id) => setToken(id);

  return (
    <Fragment>
      {users?.length > 0 ? (
        <div className="main-container">
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      onChange={handleAllRowsCheck}
                      checked={check ? (checkAllOnPage ? "checked" : "") : ""}
                    />
                  </th>
                  <th>
                    <div className="content">Name</div>
                  </th>
                  <th>
                    <div className="content">Email</div>
                  </th>
                  <th>
                    <div className="content">Role</div>
                  </th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {data?.map((member) => (
                  <Row
                    key={member.id}
                    row={member}
                    onRowCheck={handleRowCheck}
                    onRowDelete={handleRowDelete}
                    onRowEdit={handleRowEdit}
                    onClickEdit={handleEditLock}
                    token={token}
                  />
                ))}
              </tbody>
            </table>
          </div>
          <div className="footer">
            <button
              className={`del-btn${!check ? " disabled" : ""}`}
              disabled={!check ? "disabled" : ""}
              onClick={handleDelete}
            >
              Delete selected
            </button>
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                limit={maxPageNumber}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
              />
            )}
          </div>
        </div>
      ) : (
        <div className="error">No data available for this particular query</div>
      )}
    </Fragment>
  );
};

export default Table;
