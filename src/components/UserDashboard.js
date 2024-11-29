import React, { useContext } from "react";
import AuthContext from "../context/AuthContext";

const UserDashboard = () => {
  const { user } = useContext(AuthContext);
  console.log(user)

  if (!user) {
    return (
      <div>
        <h1>Error</h1>
        <p>User information could not be loaded. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <h1>Welcome, {user.name} {`User ID: ${user.id}`}</h1>
      <p>Here are your dashboard details:</p>
      <ul>
        <li>Email: {user.email}</li>
        <li>Role: {user.role}</li>
      </ul>
    </div>
  );
};

export default UserDashboard;
