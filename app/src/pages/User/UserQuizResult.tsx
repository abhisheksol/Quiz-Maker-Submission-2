import React, { useEffect, useState, FC } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

interface QuizResult {
  quizId: string;
  quizTitle: string;
  score: number;
  totalQuestions: number;
  dateTaken: string;
}

const UserQuizResult: FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [results, setResults] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const mockResults: QuizResult[] = [
    {
      quizId: '1',
      quizTitle: 'General Knowledge Quiz',
      score: 8,
      totalQuestions: 10,
      dateTaken: '2024-11-20T14:30:00Z',
    },
    {
      quizId: '2',
      quizTitle: 'JavaScript Basics',
      score: 5,
      totalQuestions: 5,
      dateTaken: '2024-11-21T10:00:00Z',
    },
  ];
  
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setResults(mockResults);
      setLoading(false);
    }, 1000);
  }, []);
  
//   useEffect(() => {
//     const fetchResults = async () => {
//       try {
//         setLoading(true);
//         const response = await axios.get(`/api/users/${userId}/results`);
//         setResults(response.data);
//       } catch (err) {
//         setError('Failed to fetch quiz results. Please try again.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchResults();
//   }, [userId]);

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
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">User Quiz Results</h2>
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
              <tr key={result.quizId} className="hover:bg-gray-100">
                <td className="border border-gray-300 px-4 py-2">{result.quizTitle}</td>
                <td className="border border-gray-300 px-4 py-2">{result.score}</td>
                <td className="border border-gray-300 px-4 py-2">{result.totalQuestions}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {new Date(result.dateTaken).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-500">No quiz results available.</p>
      )}
    </div>
  );
};

export default UserQuizResult;