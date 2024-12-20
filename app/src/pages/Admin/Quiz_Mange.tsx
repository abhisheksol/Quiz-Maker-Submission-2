import React, { useState, useEffect, FC } from "react";
import { useAuth } from "../../context/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";

interface Quiz {
  id: number;
  title: string;
  description: string;
  questions_count: number;
  created_by: string;  // Add this property
}

const ManageQuizzes: FC = () => {
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
      const fetchQuizzes = async (): Promise<void> => {
          try {
              const response = await fetch("http://localhost:5000/api/quizzes");
              const data: Quiz[] = await response.json();
              
              console.warn(data);
              if (user) { // Ensure user is not null
                  const filteredQuizzes = data.filter(
                      (quiz) => quiz.created_by === user.name
                  );
                  setQuizzes(filteredQuizzes);
              } else {
                  console.error("User is not authenticated.");
              }
          } catch (error) {
              console.error("Error fetching quizzes:", error);
          }
      };
  
      if (isAuthenticated) {
          fetchQuizzes();
      }
  }, [isAuthenticated, user]);
  

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    const handleDelete = async (id: number): Promise<void> => {
        try {
            const response = await fetch(`http://localhost:5000/api/quizzes/${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                const updatedQuizzes = quizzes.filter((quiz) => quiz.id !== id);
                setQuizzes(updatedQuizzes);
                console.log(`Quiz with ID ${id} deleted`);
            } else {
                console.error("Failed to delete the quiz");
            }
        } catch (error) {
            console.error("Error deleting quiz:", error);
        }
    };

    const handleEdit = (id: number): void => {
        navigate(`/admin/edit/${id}`);
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Manage Quizzes</h1>
            {quizzes.length > 0 ? (
                <table className="table-auto w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border border-gray-300 p-2">ID</th>
                            <th className="border border-gray-300 p-2">Title</th>
                            <th className="border border-gray-300 p-2">Description</th>
                            <th className="border border-gray-300 p-2">Questions</th>
                            <th className="border border-gray-300 p-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {quizzes.map((quiz) => (
                            <tr key={quiz.id}>
                                <td className="border border-gray-300 p-2 text-center">{quiz.id}</td>
                                <td className="border border-gray-300 p-2">{quiz.title}</td>
                                <td className="border border-gray-300 p-2">{quiz.description}</td>
                                <td className="border border-gray-300 p-2 text-center">
                                    {quiz.questions_count}
                                </td>
                                <td className="border border-gray-300 p-2 text-center">
                                    <button
                                        className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
                                        onClick={() => handleEdit(quiz.id)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="bg-red-500 text-white px-3 py-1 rounded"
                                        onClick={() => handleDelete(quiz.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No quizzes available. Add some quizzes to get started!</p>
            )}
        </div>
    );
};

export default ManageQuizzes;