import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";

const UserDashboard = () => {
  const userId = "123"; // Replace with dynamic user ID if available
  const { isAuthenticated, user, logout } = useAuth();
//  console.log("this is ",isAuthenticated);

  if (!isAuthenticated) {
    // Redirect to home if not logged in
    return <Navigate to="/" replace />;
  }
 
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Welcome to Your Dashboard</h1>
        <p className="text-gray-600 mb-8">
          Explore your quizzes, view your results, and manage your account from here.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            to="/user/quizzes"
            className="block p-6 bg-blue-500 text-white font-medium text-lg rounded-lg shadow-md hover:bg-blue-600 transition"
          >
            View Available Quizzes
          </Link>

          <Link
            to={`/user/${userId}/results`}
            className="block p-6 bg-green-500 text-white font-medium text-lg rounded-lg shadow-md hover:bg-green-600 transition"
          >
            View Quiz Results
          </Link>

          <Link
            to="/user/profile"
            className="block p-6 bg-yellow-500 text-white font-medium text-lg rounded-lg shadow-md hover:bg-yellow-600 transition"
          >
            Manage Profile
          </Link>

          <Link
            to="/logout"
            className="block p-6 bg-red-500 text-white font-medium text-lg rounded-lg shadow-md hover:bg-red-600 transition"
          >
            Logout
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
