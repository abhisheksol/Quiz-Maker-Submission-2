import React, { FC, useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from "../../context/AuthContext";

interface Quiz {
  id: number;
  title: string;
  description: string;
  questions_count: number;
  time_limit: number;
  created_by: string;
  end_date: string; // Adding end_date to match API response

}

interface QuizListProps {
  isAdmin: boolean;
}

const QuizList: FC<QuizListProps> = ({ isAdmin }) => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuizzes = async (): Promise<void> => {
      try {
        const response = await axios.get<Quiz[]>('http://localhost:5000/api/quizzes/');
        setQuizzes(response.data);
        console.warn(response.data);
        
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  const { isAuthenticated, user, logout } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  if (loading) {
    return <div className="text-center">Loading quizzes...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }


  
  return (
    <div className="container mx-auto p-6 bg-gray-50">
      <h1 className="text-3xl font-extrabold text-indigo-700 mb-8 text-center">Available Quizzes</h1>

      {isAdmin && (
        <div className="text-center mb-6">
          <Link
            to="/admin/create"
            className="bg-indigo-600 text-white py-2 px-6 rounded-md shadow-md hover:bg-indigo-700 transition duration-200"
          >
            Create New Quiz
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {quizzes.map((quiz: Quiz) => (
          <div
            key={quiz.id}
            className="bg-white border border-indigo-200 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <h2 className="text-2xl font-semibold text-gray-800">{quiz.title}</h2>
            <p className="text-gray-500 mt-2">{quiz.description}</p>
            <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
              <span>{quiz.questions_count} questions</span>
              <span>Time Limit: {quiz.time_limit} min</span>
            </div>
            <div className="mt-2 text-sm text-gray-500">
              Created by: <span className="font-medium text-gray-700">{quiz.created_by}</span>
            </div>

            {isAdmin ? (
              <div className="mt-4">
                <Link
                  to={`/admin/quizzes/${quiz.id}`}
                  className="text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  Manage Quiz
                </Link>
              </div>
            ) : (
              <div className="mt-4">
                <Link
                  to={`/quiz/${quiz.id}`}
                  state={{ timer: quiz.time_limit }}
                  className="text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  Take Quiz
                </Link>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuizList;