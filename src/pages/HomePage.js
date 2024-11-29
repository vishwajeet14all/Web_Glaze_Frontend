import React, { useContext } from "react";
import AuthContext from "../context/AuthContext";
import UserDashboard from "../components/UserDashboard";
import AdminDashboard from "../components/AdminDashboard";
import { Link } from "react-router-dom";

const HomePage = () => {
  const { user } = useContext(AuthContext);

  if (user?.role === "Admin") return <AdminDashboard />;
  if (user?.role === "User") return <UserDashboard />;

  return <p>You Are Not Recognized By Our System Please go to <Link to="/login">login page</Link></p>;
};

export default HomePage;
