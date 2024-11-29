import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("authToken") || null);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      const userData = JSON.parse(atob(token.split(".")[1]));
      console.log(userData)
      setUser({ id: userData.id, role: userData.role, name: userData.name, email: userData.email });
    } else {
      setUser(null);
    }
  }, [token]);

  const login = async (email, password) => {
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );
      setToken(data.token);
      console.log("data", data.token);
      localStorage.setItem("authToken", data.token);
      navigate("/");
    } catch (err) {
      alert("Invalid credentials");
    }
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, token }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
