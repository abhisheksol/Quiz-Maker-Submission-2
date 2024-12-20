import React, { useEffect, useState, FC } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import axios from "axios";
import QuizAttemptsPerUser from "./Graphs/Quiz_Attempts _per_User";
import UserRankingChart from "./Graphs/Graph";
import TotalScoreByQuiz from "./Graphs/Comparing_quizzes";
import QuizAttemptsPerUser2 from "./Graphs/Quiz_Attempts _per_User copy";
import UserQuizPerformance from "./Graphs/QuizTopicPerformance";

// Interface Definitions
interface Quiz {
  quizTitle: string;
  score: number;
  dateTaken: string;
}

interface LeaderboardEntry {
  name: string;
  score: number;
  quizzes: Quiz[];
}

const Leaderboard: FC = () => {
  const { isAuthenticated }: { isAuthenticated: boolean } = useAuth();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isTableVisible, setIsTableVisible] = useState<boolean>(false); // Track table visibility

  useEffect(() => {
    const fetchLeaderboard = async (): Promise<void> => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5000/api/users/results");

        const groupedResults: { [key: string]: { score: number; quizzes: Quiz[] } } = response.data.reduce((acc: { [key: string]: { score: number; quizzes: Quiz[] } }, result: any) => {
          if (!acc[result.user_name]) {
            acc[result.user_name] = { score: 0, quizzes: [] };
          }
          acc[result.user_name].score += result.score;
          acc[result.user_name].quizzes.push({
            quizTitle: result.quiz_title,
            score: result.score,
            dateTaken: result.date_taken,
          });
          return acc;
        }, {});

        const sortedLeaderboard: LeaderboardEntry[] = Object.keys(groupedResults).map((userName) => ({
          name: userName,
          score: groupedResults[userName].score,
          quizzes: groupedResults[userName].quizzes,
        })).sort((a, b) => b.score - a.score);

        setLeaderboard(sortedLeaderboard);
      } catch (err) {
        setError("Failed to fetch leaderboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-medium text-gray-500">Loading leaderboard...</p>
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

  // Toggle leaderboard table visibility
  const toggleTableVisibility = () => {
    setIsTableVisible(!isTableVisible);
  };

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900">Leaderboard</h1>
        <p className="text-lg text-gray-500">Rankings based on user scores across quizzes.</p>
      </div>

      {/* Graphs Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <UserRankingChart />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <TotalScoreByQuiz />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <QuizAttemptsPerUser />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <UserQuizPerformance />
        </div>
      </div>

      {/* Toggle Button to Show/Hide Leaderboard Table */}
      <div className="text-center mb-4">
        <button
          onClick={toggleTableVisibility}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
        >
          {isTableVisible ? 'Hide Leaderboard' : 'Show Leaderboard'}
        </button>
      </div>

      {/* Leaderboard Table */}
      {isTableVisible && (
        <div className="bg-white p-6 rounded-lg shadow-lg mt-6">
          {leaderboard.length > 0 ? (
            <table className="w-full table-auto border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border px-4 py-2 text-left">Rank</th>
                  <th className="border px-4 py-2 text-left">Name</th>
                  <th className="border px-4 py-2 text-left">Total Score</th>
                  <th className="border px-4 py-2 text-left">Quizzes Taken</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((entry: LeaderboardEntry, index: number) => (
                  <tr key={index} className="hover:bg-gray-100">
                    <td className="border px-4 py-2 text-center">{index + 1}</td>
                    <td className="border px-4 py-2">{entry.name}</td>
                    <td className="border px-4 py-2 text-center">{entry.score}</td>
                    <td className="border px-4 py-2">
                      <ul>
                        {entry.quizzes.map((quiz: Quiz, quizIndex: number) => (
                          <li key={quizIndex}>
                            <strong>{quiz.quizTitle}</strong> - Score: {quiz.score}, Date: {new Date(quiz.dateTaken).toLocaleString()}
                          </li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-gray-500">No leaderboard data available.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
