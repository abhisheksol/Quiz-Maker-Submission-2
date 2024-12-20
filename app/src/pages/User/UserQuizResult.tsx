import React, { FC, useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import UserResults from "../Graphs/UserResults";
import QuizAttemptsPerUser from "../Graphs/Quiz_Attempts _per_User";
import QuizPieChart from "../Graphs/Recharts";
import QuizCompletionRates from "../Graphs/ScoreTrendbyDate";
import QuizAttemptsPerUser2 from "../Graphs/Quiz_Attempts _per_User copy";

interface QuizResult {
  quiz_id: string;
  quiz_title: string;
  score: number;
  total_questions: number;
  date_taken: string;
  user_id: string;
}

const UserQuizResult: FC = () => {
  const [results, setResults] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, user } = useAuth();
  const [show_details, setshow_details] = useState(false)
  useEffect(() => {
    const fetchResults = async (): Promise<void> => {
      try {
        setLoading(true);
        const response = await axios.get<QuizResult[]>("http://localhost:5000/api/users/results");
        const filteredResults = response.data.filter((result) => user?.id && result.user_id === user.id);
        setResults(filteredResults);
      } catch (err) {
        setError("Failed to fetch quiz results. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && user) {
      fetchResults();
    } else {
      setError("You need to be logged in to view quiz results.");
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-medium text-gray-500">Loading quiz results...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-medium text-red-500">{error}</p>
      </div>
    );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Dashboard Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-semibold text-gray-800">Your Quiz Dashboard</h1>
        <p className="text-gray-500">View your quiz statistics, attempts, and results below.</p>
      </div>

      {/* Dashboard Grid Layout for the Graphs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Graph Components */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <QuizAttemptsPerUser2 />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <QuizPieChart />
        </div>
      </div>
      {/* <button onClick={() => setshow_details(!show_details)}>Show details</button> */}

      <button onClick={() => setshow_details(!show_details)} type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
        Show details
        <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
        </svg>
      </button>
      {
        show_details ?
          <>
            <div className="bg-white p-6 rounded-lg shadow-md">

              <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Quiz Results</h2>
              {results.length > 0 ? (
                <table className="table-auto w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="border border-gray-300 px-4 py-2 text-left">Quiz Title</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Score</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Total Questions</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Date Taken</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((result) => (
                      <tr key={result.quiz_id} className="hover:bg-gray-100">
                        <td className="border border-gray-300 px-4 py-2">{result.quiz_title}</td>
                        <td className="border border-gray-300 px-4 py-2">{result.score}</td>
                        <td className="border border-gray-300 px-4 py-2">{result.total_questions}</td>
                        <td className="border border-gray-300 px-4 py-2">
                          {new Date(result.date_taken).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-500">No quiz results available for this user.</p>
              )}
            </div>
          </> : null
      }
      {/* Display Quiz Results */}

    </div>
  );
};

export default UserQuizResult;
