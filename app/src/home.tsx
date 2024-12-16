import React, { FC } from 'react';
import { Link } from 'react-router-dom';

const Home: FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
      <div className="max-w-5xl mx-auto text-center p-6">
        <h1 className="text-5xl font-extrabold text-white mb-6">
          Welcome to <span className="text-yellow-300">QuizMaster</span>
        </h1>
        <p className="text-lg text-gray-200 mb-10">
          Test your knowledge, challenge your friends, and explore exciting quizzes! Whether you're a participant or an admin, we've got you covered.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <Link
            to="/login"
            className="px-6 py-3 bg-yellow-400 text-gray-900 font-semibold rounded-lg shadow-md hover:bg-yellow-300 transition"
          >
            Get Started
          </Link>
          <Link
            to="/user/dashboard"
            className="px-6 py-3 bg-blue-700 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition"
          >
            User Dashboard
          </Link>
          <Link
            to="/admin/create"
            className="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-400 transition"
          >
            Admin Panel
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;