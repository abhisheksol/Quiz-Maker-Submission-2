import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface QuizData {
  quiz_title: string;
  score: number;
  total_questions: number;
  date_taken: string;
}

const UserResults = () => {
  const [results, setResults] = useState<QuizData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/api/users/14/results')
      .then((response) => {
        setResults(response.data);  // Store quiz results data
        setLoading(false);          // Set loading state to false
      })
      .catch((error) => {
        console.error('Error fetching user results:', error);
        setLoading(false);          // Set loading state to false
      });
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h2 className="text-2xl font-semibold text-center mb-4">User Quiz Results</h2>

      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Quiz Title</th>
            <th className="py-2 px-4 border-b">Score</th>
            <th className="py-2 px-4 border-b">Total Questions</th>
            <th className="py-2 px-4 border-b">Correct Answers</th>
            <th className="py-2 px-4 border-b">Date Taken</th>
          </tr>
        </thead>
        <tbody>
          {results.map((quiz, index) => (
            <tr key={index}>
              <td className="py-2 px-4 border-b">{quiz.quiz_title}</td>
              <td className="py-2 px-4 border-b">{quiz.score}</td>
              <td className="py-2 px-4 border-b">{quiz.total_questions}</td>
              <td className="py-2 px-4 border-b">{quiz.score}</td>
              <td className="py-2 px-4 border-b">{new Date(quiz.date_taken).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserResults;
