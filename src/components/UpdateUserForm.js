import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import AuthContext from "../context/AuthContext";

const UpdateUserForm = ({ userId, onSuccess, onCancel }) => {
  const { token } = useContext(AuthContext);
  const [userData, setUserData] = useState({ name: "", email: "", role: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!token) {
          setError("No token found. Please log in.");
          setLoading(false);
          return;
        }
        const { data } = await axios.get(`https://web-glaze-backend.onrender.com/api/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserData(data);
        setLoading(false); 
      } catch (err) {
        setError("Failed to load user details");
        setLoading(false); 
      }
    };
    fetchUser();
  }, [token,userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate the form before submission
    if (!userData.name || !userData.email || !userData.role) {
      setError("Please fill in all fields");
      return;
    }

    try {
      if (!token) {
        setError("No token found. Please log in.");
        return;
      }
      await axios.put(`https://web-glaze-backend.onrender.com/api/users/${userId}`, userData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      onSuccess();
    } catch (err) {
      setError("Failed to update user");
    }
  };

  if (loading) {
    return <p>Loading...</p>; 
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Update User</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <label>
        Name:
        <input
          type="text"
          value={userData.name}
          onChange={(e) => setUserData({ ...userData, name: e.target.value })}
        />
      </label>
      <label>
        Email:
        <input
          type="email"
          value={userData.email}
          onChange={(e) => setUserData({ ...userData, email: e.target.value })}
        />
      </label>
      <label>
        Role:
        <select
          value={userData.role}
          onChange={(e) => setUserData({ ...userData, role: e.target.value })}
        >
          <option value="Admin">Admin</option>
          <option value="User">User</option>
        </select>
      </label>
      <button type="submit">Update</button>
      <button type="button" onClick={onCancel}>
        Cancel
      </button>
    </form>
  );
};

export default UpdateUserForm;
