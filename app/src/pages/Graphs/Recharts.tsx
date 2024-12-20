import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import 'tailwindcss/tailwind.css';
import { useAuth } from "../../context/AuthContext";

// Define the type for quiz results
interface QuizResult {
  quiz_id: number;
  quiz_title: string;
  score: number;
  total_questions: number;
  date_taken: string;
}

// Define the type for the data in the pie chart
interface ChartData {
  name: string;
  value: number;
}

const COLORS = ['#ff7300', '#00C49F'];

const QuizPieChart = () => {
  const [chartData, setChartData] = useState<ChartData[]>([]); // Explicitly define the type
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const { isAuthenticated, user } = useAuth();

  // Get the userId from the Auth context (e.g. logged-in user)
  const userId = user?.id;

  useEffect(() => {
    if (!userId) {
      // Early return if userId is not available
      console.error('User ID is not available.');
      return;
    }

    // Dynamically pass the userId to the API URL
    axios.get(`http://localhost:5000/api/users/${userId}/results`)
      .then((response) => {
        const results: QuizResult[] = response.data;

        // Calculate the total attempted and correct answers
        let totalQuestions = 0;
        let correctAnswers = 0;

        results.forEach((quiz: QuizResult) => {
          totalQuestions += quiz.total_questions;
          correctAnswers += quiz.score;
        });

        // Set the chart data
        setChartData([
          { name: 'Correct Answers', value: correctAnswers },
          { name: 'Wrong Answer', value: totalQuestions - correctAnswers },
        ]);

        // Set the state for displaying totals
        setTotalQuestions(totalQuestions);
        setCorrectAnswers(correctAnswers);
      })
      .catch((error) => {
        console.error('Error fetching quiz results:', error);
      });
  }, [userId]); // Run the effect whenever userId changes

  return (
    <div className="max-w-xs mx-auto mt-8">
      <h2 className="text-xl font-semibold text-center">Score Distribution</h2>

      {/* Display Total Questions and Correct Answers */}
      <div className="text-center mt-4">
        <p>Total Questions Attempted: {totalQuestions}</p>
        <p>Total Correct Answers: {correctAnswers}</p>
      </div>

      {/* Pie Chart */}
      <PieChart width={400} height={400}>
        <Pie data={chartData} dataKey="value" nameKey="name" outerRadius={120} fill="#8884d8" label>
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
};

export default QuizPieChart;
