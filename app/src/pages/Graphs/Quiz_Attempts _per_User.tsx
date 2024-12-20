import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { useAuth } from "../../context/AuthContext";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import 'tailwindcss/tailwind.css';

// Registering necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface QuizData {
  user_id: number;
  user_name: string;
  quiz_id: number;
  quiz_title: string;
  score: number;
  total_questions: number;
  date_taken: string;
}

const QuizAttemptsPerUser = () => {
  const [chartData, setChartData] = useState<any>(null); // State to store chart data
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, user } = useAuth();

  // Make sure user?.id is defined before proceeding
  const userId = user?.id;

  useEffect(() => {
    if (!userId) {
      // If user is not authenticated, or userId is not available, we won't attempt fetching data
      setLoading(false);
      return;
    }

    // Fetch data from the API using userId if available
    axios.get(`http://localhost:5000/api/users/results`)
      .then((response) => {
        const data: QuizData[] = response.data;

        // Step 1: Process the data to count quiz attempts per user
        const userAttempts: { [key: string]: { [quizTitle: string]: number } } = {};

        data.forEach((quiz) => {
          // If the user doesn't exist in the map, create it
          if (!userAttempts[quiz.user_name]) {
            userAttempts[quiz.user_name] = {};
          }

          // If the quiz hasn't been counted yet, initialize it
          if (!userAttempts[quiz.user_name][quiz.quiz_title]) {
            userAttempts[quiz.user_name][quiz.quiz_title] = 0;
          }

          // Increment the attempt count for the quiz
          userAttempts[quiz.user_name][quiz.quiz_title]++;
        });

        // Step 2: Prepare chart data
        const chartLabels = Object.keys(userAttempts); // List of user names
        const datasets = Object.keys(userAttempts).map(userName => {
          const userQuizzes = userAttempts[userName];
          const quizTitles = Object.keys(userQuizzes);
          const attemptCounts = quizTitles.map(quizTitle => userQuizzes[quizTitle]);

          return {
            label: userName, // User's name
            data: attemptCounts, // Attempt counts for each quiz
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          };
        });

        const chartData = {
          labels: Object.keys(userAttempts).flatMap(userName =>
            Object.keys(userAttempts[userName]) // Flatten quiz titles for each user
          ),
          datasets: datasets,
        };

        setChartData(chartData); // Set chart data
        setLoading(false); // Stop loading
      })
      .catch((error) => {
        console.error('Error fetching quiz results:', error);
        setLoading(false); // Handle loading state if error occurs
      });
  }, [userId]); // Trigger effect only when userId changes

  // Display loading indicator until data is fetched
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto mt-8">
        <h2 className="text-2xl font-semibold text-center mb-4">Loading...</h2>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h2 className="text-2xl font-semibold text-center mb-4">Quiz Attempts</h2>

      <div className="w-full h-[50vh]">
        {chartData && (
          <Bar
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              indexAxis: 'x', // Bar chart horizontal
              plugins: {
                legend: {
                  labels: {
                    font: {
                      size: 16,
                    },
                  },
                },
              },
            }}
          />
        )}
      </div>
    </div>
  );
};

export default QuizAttemptsPerUser;
