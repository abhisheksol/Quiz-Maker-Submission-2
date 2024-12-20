import React, { useState, FormEvent } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [role, setRole] = useState<string>(""); // Role state (admin/user)
  const [error, setError] = useState<string>("");

  const handleLogin = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
  
    // Validate input fields
    if (!email || !password || !role) {
      setError("All fields are required.");
      return;
    }
  
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
  
    try {
      // Make API call
      const response = await axios.post("http://localhost:5000/api/users/login", {
        email,
        password,
        role,
      });
  
      // Extract user data from the response
      const userData = response.data.user;
  
      // Update context
      login(userData);
  
      // Navigate to the appropriate dashboard
      if (userData.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/user/dashboard");
      }
  
    } catch (error: any) {
      // Handle errors
      if (axios.isAxiosError(error)) {
        // For Axios-specific errors
        if (error.response?.data?.message) {
          setError(error.response.data.message); // Use server's error message
        } else {
          setError("login is failed due to the wrong credentials");
          alert("login is failed due to the wrong credentials")
        }
      } else {
        // For other errors (e.g., network issues)
        setError("An error occurred. Check your connection and try again.");
      }
    }
  };
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
          Login
        </h2>
        {error && (
          <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">
            {error}
          </div>
        )}
        <form onSubmit={handleLogin}>
          {/* Email Field */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter your email"
            />
          </div>
          {/* Password Field */}
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter your password"
            />
          </div>
          {/* Role Selection */}
          <div className="mb-4">
            <label htmlFor="role" className="block text-gray-700 mb-2">
              Select Role
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">--Select Role--</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>
          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-500 transition duration-300"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;