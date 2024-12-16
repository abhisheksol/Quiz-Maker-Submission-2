import React, { useState, FC } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';

interface Quiz {
    id: number;
    title: string;
    description: string;
    questionsCount: number;
}

const mockQuizzes: Quiz[] = [
    {
        id: 1,
        title: 'JavaScript Basics',
        description: 'A quiz about JavaScript fundamentals.',
        questionsCount: 10,
    },
    {
        id: 2,
        title: 'React Overview',
        description: 'Test your React knowledge.',
        questionsCount: 8,
    },
    {
        id: 3,
        title: 'Node.js Essentials',
        description: 'A quiz on Node.js basics.',
        questionsCount: 12,
    },
];

const ManageQuizzes: FC = () => {
    const [quizzes, setQuizzes] = useState<Quiz[]>(mockQuizzes);
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    const handleDelete = (id: number): void => {
        const updatedQuizzes = quizzes.filter((quiz) => quiz.id !== id);
        setQuizzes(updatedQuizzes);
        console.log(`Quiz with ID ${id} deleted`);
    };

    const handleEdit = (id: number): void => {
        console.log(`Editing quiz with ID ${id}`);
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
                                    {quiz.questionsCount}
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