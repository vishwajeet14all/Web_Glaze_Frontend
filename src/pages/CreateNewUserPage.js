import React, { useState, useContext } from "react";
import axios from "axios";
import AuthContext from "../context/AuthContext";

export const CreateNewUserPage = () => {
  const { token } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "User",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const { data } = await axios.post(
        "https://web-glaze-backend.onrender.com/api/users",
        formData,
        config
      );
      setMessage(`User created successfully: ${data.name}`);
      setFormData({ name: "", email: "", password: "", role: "User" }); 
    } catch (error) {
      setMessage("Error creating user");
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Create User</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="User">User</option>
          <option value="Admin">Admin</option>
        </select>
        <button type="submit">Create</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};
