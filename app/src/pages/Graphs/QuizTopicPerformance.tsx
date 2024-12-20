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

interface QuizPerformance {
  quiz_title: string;
  totalScore: number;
  totalQuestions: number;
}

const UserQuizPerformance = () => {
  const [chartData, setChartData] = useState<any>(null); // State to store chart data
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data from the API (replace with correct endpoint)
    axios.get('http://localhost:5000/api/users/results')
      .then((response) => {
        const data: QuizData[] = response.data;

        // Step 1: Process the data by quiz title for the specific user
        const quizPerformanceMap: { [key: string]: QuizPerformance } = {};

        data.forEach((quiz) => {
          if (!quizPerformanceMap[quiz.quiz_title]) {
            quizPerformanceMap[quiz.quiz_title] = { quiz_title: quiz.quiz_title, totalScore: 0, totalQuestions: 0 };
          }

          // Accumulate total score and total questions for each quiz
          quizPerformanceMap[quiz.quiz_title].totalScore += quiz.score;
          quizPerformanceMap[quiz.quiz_title].totalQuestions += quiz.total_questions;
        });

        // Step 2: Convert the data to an array
        const quizPerformanceArray = Object.values(quizPerformanceMap);

        // Step 3: Prepare data for charting
        const chartData = {
          labels: quizPerformanceArray.map((item) => item.quiz_title),
          datasets: [
            {
              label: 'Performance by Quiz Title',
              data: quizPerformanceArray.map((item) => {
                // Calculate percentage score for each quiz
                return (item.totalScore / item.totalQuestions) * 100;
              }),
              backgroundColor: [
                'rgba(75, 192, 192, 0.6)',
                'rgba(153, 102, 255, 0.6)',
                'rgba(255, 159, 64, 0.6)',
                'rgba(255, 99, 132, 0.6)',
                'rgba(54, 162, 235, 0.6)',
              ],
              borderColor: [
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
              ],
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
      <h2 className="text-2xl font-semibold text-center mb-4">Quiz Performance by Title</h2>

      <div className="w-full h-[50vh]">
        {chartData && (
          <Bar
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              indexAxis: 'x', // Horizontal bar chart
              aspectRatio: 2,
              plugins: {
                legend: {
                  position: 'top',
                },
              },
            }}
          />
        )}
      </div>
    </div>
  );
};

export default UserQuizPerformance;
