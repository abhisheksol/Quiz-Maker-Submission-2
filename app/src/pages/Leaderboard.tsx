import React from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const Leaderboard = () => {

    const { isAuthenticated, user, logout } = useAuth();
    //  console.log("this is ",isAuthenticated);
    
      if (!isAuthenticated) {
        // Redirect to home if not logged in
        return <Navigate to="/" replace />;
      }
  const mockLeaderboard = [
    { rank: 1, name: "Alice", score: 95, timeTaken: "5:30" },
    { rank: 2, name: "Bob", score: 90, timeTaken: "6:10" },
    { rank: 3, name: "Charlie", score: 85, timeTaken: "7:00" },
  ];

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Leaderboard</h1>
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2">Rank</th>
            <th className="border border-gray-300 p-2">Name</th>
            <th className="border border-gray-300 p-2">Score</th>
            <th className="border border-gray-300 p-2">Time Taken</th>
          </tr>
        </thead>
        <tbody>
          {mockLeaderboard.map((entry) => (
            <tr key={entry.rank}>
              <td className="border border-gray-300 p-2 text-center">{entry.rank}</td>
              <td className="border border-gray-300 p-2 text-center">{entry.name}</td>
              <td className="border border-gray-300 p-2 text-center">{entry.score}</td>
              <td className="border border-gray-300 p-2 text-center">{entry.timeTaken}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;
