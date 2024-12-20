import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
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

const QuizCompletionRates = () => {
  const [chartData, setChartData] = useState<any>(null); // State to store chart data
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data from the API
    axios.get('http://localhost:5000/api/users/14/results')
      .then((response) => {
        const data: QuizData[] = response.data;

        // Step 1: Calculate the number of completed quizzes and total quizzes attempted for each user
        const userCompletionData: { [key: string]: { completed: number; attempted: number } } = {};

        data.forEach((quiz) => {
          if (!userCompletionData[quiz.user_name]) {
            userCompletionData[quiz.user_name] = { completed: 0, attempted: 0 };
          }

          // Increment attempted quizzes
          userCompletionData[quiz.user_name].attempted += 1;

          // Increment completed quizzes if score equals total questions
          if (quiz.score === quiz.total_questions) {
            userCompletionData[quiz.user_name].completed += 1;
          }
        });

        // Step 2: Prepare data for charting
        const chartLabels = Object.keys(userCompletionData); // User names as labels
        const chartCompletionRates = chartLabels.map(userName => {
          const user = userCompletionData[userName];
          return (user.completed / user.attempted) * 100; // Completion rate percentage
        });

        // Step 3: Prepare the chart data
        const chartData = {
          labels: chartLabels,
          datasets: [
            {
              label: 'Quiz Completion Rate',
              data: chartCompletionRates, // Completion rates as percentages
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
          ],
        };

        setChartData(chartData); // Set chart data
        setLoading(false); // Stop loading
      })
      .catch((error) => {
        console.error('Error fetching quiz results:', error);
        setLoading(false); // Handle loading state if error occurs
      });
  }, []);

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
      <h2 className="text-2xl font-semibold text-center mb-4">Quiz Completion Rates</h2>

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
              scales: {
                y: {
                  beginAtZero: true,
                  max: 100, // The maximum value is 100 for percentage
                  title: {
                    display: true,
                    text: 'Completion Rate (%)',
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

export default QuizCompletionRates;
