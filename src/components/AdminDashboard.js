import React, { useEffect, useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import UpdateUserForm from "../components/UpdateUserForm";

const AdminDashboard = () => {
  const { token } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null); // To track which user is being updated
  const navigate = useNavigate();

  // Fetch users data from the backend
  const fetchUsers = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(data);
      setError(null); // Reset error state
    } catch (err) {
      setError("Failed to fetch users");
      console.error(err);
    }
  };

  // Delete user function
  const deleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/users/${userId}`, {
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
  }, [token]);

  // Navigate to create new user page
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
      {/* Render UpdateUserForm if a user is selected for editing */}
      {selectedUserId && (
        <UpdateUserForm
          userId={selectedUserId}
          onSuccess={() => {
            fetchUsers(); // Refresh the user list after updating
            setSelectedUserId(null); // Reset selected user
          }}
          onCancel={() => setSelectedUserId(null)} // Close the form
        />
      )}
    </div>
  );
};

export default AdminDashboard;
