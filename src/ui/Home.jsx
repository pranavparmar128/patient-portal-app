import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userData } = location.state || {};

  const handleLogout = async () => {
    try {
      // Optionally invalidate the Liferay session
      await axios.get("http://localhost:8080/c/portal/logout", {
        withCredentials: true, // Include cookies for session-based logout
      });
      console.log("Liferay session terminated");
    } catch (err) {
      console.error(
        "Failed to terminate Liferay session:",
        err.response?.data || err.message
      );
    } finally {
      // Clear sessionStorage and redirect to login
      sessionStorage.removeItem("accessToken");
      navigate("/", { replace: true });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Welcome to the Home Page!</h2>
        {userData ? (
          <div>
            <pre className="text-sm">
              {JSON.parse(JSON.stringify(userData, null, 2)).emailAddress}
            </pre>
          </div>
        ) : (
          <p>No user data available.</p>
        )}
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mt-4"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Home;
