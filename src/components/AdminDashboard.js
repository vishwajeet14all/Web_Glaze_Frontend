import React, { useEffect, useState, useContext, useCallback } from "react";
import AuthContext from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import UpdateUserForm from "../components/UpdateUserForm";

const AdminDashboard = () => {
  const { token } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const navigate = useNavigate();

  // Fetch users data from the backend
  const fetchUsers = useCallback(async () => {
    try {
      const { data } = await axios.get("https://web-glaze-backend.onrender.com/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(data);
      setError(null); // Reset error state
    } catch (err) {
      setError("Failed to fetch users");
      console.error(err);
    }
  }, [token]); // Include token as a dependency

  // Delete user function
  const deleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await axios.delete(`https://web-glaze-backend.onrender.com/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers(); // Refresh the user list
    } catch (err) {
      setError("Failed to delete user");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers(); // Fetch users on page load
  }, [fetchUsers]); // Now fetchUsers is stable due to useCallback

  const navigateToCreateUser = () => {
    navigate("/admin/create");
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <button onClick={navigateToCreateUser}>Create New User</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {users.length === 0 ? (
        <p>No users found</p>
      ) : (
        <ul>
          {users.map((user) => (
            <li key={user._id}>
              {user.name} - {user.email} ({user.role})
              <button onClick={() => deleteUser(user._id)}>Delete</button>
              <button onClick={() => setSelectedUserId(user._id)}>Edit</button>
            </li>
          ))}
        </ul>
      )}
      {selectedUserId && (
        <UpdateUserForm
          userId={selectedUserId}
          onSuccess={() => {
            fetchUsers();
            setSelectedUserId(null);
          }}
          onCancel={() => setSelectedUserId(null)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
