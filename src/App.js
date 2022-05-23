import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "./constants";
import Table from "./components/Table";
import "./App.css";

const App = () => {
  const [users, setUsers] = useState(null);
  const [filteredUsers, setFilteredUsers] = useState(null);
  const [query, setQuery] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const fetchMembers = async () => {
    setLoading(true);
    await axios
      .get(API_URL)
      .then((response) => {
        console.log(response);
        setLoading(false);
        setError(false);
        setUsers(response.data.map((row) => ({ ...row, isChecked: false })));
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        setError(true);
      });
  };

  useEffect(() => {
    console.log("useEffect");
    fetchMembers();
  }, []);

  const filterUsers = () => {
    if (query?.length > 0) {
      setFilteredUsers(
        // eslint-disable-next-line array-callback-return
        users?.filter((user) => {
          if (
            user.name?.toLowerCase().includes(query.toLowerCase()) ||
            user.email?.toLowerCase().includes(query.toLowerCase()) ||
            user.role?.toLowerCase().includes(query.toLowerCase())
          ) {
            return user;
          }
        })
      );
    } else {
      setFilteredUsers(users);
    }
  };

  useEffect(() => {
    filterUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, users]);

  const handleCheck = (id) => {
    let temporaryUsers = [...users];
    temporaryUsers.forEach((user) => {
      if (user.id === id) {
        user.isChecked = !user.isChecked;
      }
    });
    setUsers(temporaryUsers);
  };

  const handleDelete = (id) => {
    let temporaryUsers = [...users];
    temporaryUsers = temporaryUsers.filter((user) => user.id !== id);
    setUsers(temporaryUsers);
  };

  const handleSelectedDelete = () => {
    let temporaryUsers = [...users];
    temporaryUsers = temporaryUsers.filter((user) => !user.isChecked);
    setUsers(temporaryUsers);
  };

  const handleEdit = (row) => {
    let temporaryUsers = [...users];
    temporaryUsers = temporaryUsers.map((user) => {
      if (user.id === row.id) {
        return Object.assign(user, row);
      }
      return user;
    });
    setUsers(temporaryUsers);
  };

  return (
    <div className="container">
      <div className="search-bar">
        <input
          className="search-box"
          name="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search"
        />
      </div>
      {isLoading ? (
        <div className="spinner-box">
          <div className="spinner"></div>
        </div>
      ) : error ? (
        <div className="error">Error in fetching data.</div>
      ) : (
        filteredUsers && (
          <Table
            users={filteredUsers}
            onCheck={handleCheck}
            onDelete={handleDelete}
            onSelectedDelete={handleSelectedDelete}
            onEdit={handleEdit}
          />
        )
      )}
    </div>
  );
};

export default App;
