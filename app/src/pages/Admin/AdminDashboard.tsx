import React, { FC, useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

interface Quiz {
  id: number;
  title: string;
  created_by: string;
}

interface Result {
  user_id: number;
  user_name: string;
  score: number;
  quiz_id: number;
  total_questions: number;
}

const AdminDashboard: FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [quizData, setQuizData] = useState<Result[]>([]);
  const [adminQuizzes, setAdminQuizzes] = useState<Quiz[]>([]);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        if (!user) throw new Error("User not authenticated");

        // Step 1: Fetch quizzes created by the admin
        const quizResponse = await axios.get<Quiz[]>("http://localhost:5000/api/quizzes");
        const adminQuizzes = quizResponse.data.filter(
          (quiz) => quiz.created_by === user.name // Match `created_by` with admin's name
        );

        setAdminQuizzes(adminQuizzes);
        const adminQuizIds = adminQuizzes.map((quiz) => quiz.id);

        // Step 2: Fetch quiz results and filter by admin's quiz IDs
        const resultsResponse = await axios.get<Result[]>("http://localhost:5000/api/users/results");
        const filteredResults = resultsResponse.data.filter((result) =>
          adminQuizIds.includes(result.quiz_id)
        );

        setQuizData(filteredResults);
      } catch (err: any) {
        setError(err.message || "An error occurred while fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [user]);

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-medium text-gray-500">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-medium text-red-500">{error}</p>
      </div>
    );
  }

  // Summary Calculations
  const totalQuizzes = adminQuizzes.length;
  const uniqueUsers = new Set(quizData.map((result) => result.user_id)).size;
  const averageScore =
    quizData.length > 0
      ? (quizData.reduce((acc, result) => acc + result.score, 0) / quizData.length).toFixed(2)
      : "0";

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-blue-500 text-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold">Total Quizzes</h2>
          <p className="text-3xl font-semibold">{totalQuizzes}</p>
        </div>
        <div className="bg-green-500 text-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold">Total Users</h2>
          <p className="text-3xl font-semibold">{uniqueUsers}</p>
        </div>
        <div className="bg-yellow-500 text-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold">Average Score</h2>
          <p className="text-3xl font-semibold">{averageScore}%</p>
        </div>
      </div>

      {/* Links to Manage Quizzes */}
      <div className="space-y-4">
        <Link
          to="/admin/quizzes"
          className="block bg-blue-600 text-white text-center p-4 rounded-lg hover:bg-blue-500 transition"
        >
          Manage Quizzes
        </Link>
        <Link
          to="/admin/create"
          className="block bg-green-600 text-white text-center p-4 rounded-lg hover:bg-green-500 transition"
        >
          Create New Quiz
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
