import React, { useState, useEffect, FC } from 'react';
import { Link } from 'react-router-dom';
import { sampleQuizzes } from './quiz_list_sample_data'; // Import sample data

interface Quiz {
  id: string;
  title: string;
  description: string;
  questionsCount: number;
  timeLimit: number;
}

interface QuizListProps {
  isAdmin: boolean;
}

const QuizList: FC<QuizListProps> = ({ isAdmin }) => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

  useEffect(() => {
    setQuizzes(sampleQuizzes);
  }, []);

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
        {quizzes.map((quiz) => (
          <div
            key={quiz.id}
            className="bg-white border border-indigo-200 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <h2 className="text-2xl font-semibold text-gray-800">{quiz.title}</h2>
            <p className="text-gray-500 mt-2">{quiz.description}</p>
            <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
              <span>{quiz.questionsCount} questions</span>
              <span>Time Limit: {quiz.timeLimit} min</span>
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