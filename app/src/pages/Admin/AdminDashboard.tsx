import React, { FC } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";

const AdminDashboard: FC = () => {
    const { isAuthenticated, user, logout }: { isAuthenticated: boolean; user: any; logout: () => void; } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    const mockStats: { totalQuizzes: number; totalUsers: number; averageScore: number; } = {
        totalQuizzes: 12,
        totalUsers: 120,
        averageScore: 75,
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-blue-500 text-white p-4 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold">Total Quizzes</h2>
                    <p className="text-3xl font-semibold">{mockStats.totalQuizzes}</p>
                </div>
                <div className="bg-green-500 text-white p-4 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold">Total Users</h2>
                    <p className="text-3xl font-semibold">{mockStats.totalUsers}</p>
                </div>
                <div className="bg-yellow-500 text-white p-4 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold">Average Score</h2>
                    <p className="text-3xl font-semibold">{mockStats.averageScore}%</p>
                </div>
            </div>

            <div className="space-y-4">
                <Link
                    to="/admin/quizzes"
                    className="block bg-blue-600 text-white text-center p-4 rounded-lg hover:bg-blue-500 transition"
                >
                    Manage Quizzes
                </Link>
                <Link
                    to="/admin/create"
                    className="block bg-green-600 text-white text-center p-4 rounded-lg hover:bg-green-500 transition"
                >
                    Create New Quiz
                </Link>
            </div>
        </div>
    );
};

export default AdminDashboard;