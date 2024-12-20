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

const TotalScoreByQuiz = () => {
  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/api/users/14/results')
      .then((response) => {
        const data: QuizData[] = response.data;

        // Step 1: Process the data to calculate total score per quiz
        const quizScores: { [key: string]: number } = {};

        data.forEach((quiz) => {
          if (!quizScores[quiz.quiz_title]) {
            quizScores[quiz.quiz_title] = 0;
          }
          quizScores[quiz.quiz_title] += quiz.score;
        });

        // Step 2: Prepare the chart data
        const chartData = {
          labels: Object.keys(quizScores), // Quiz titles
          datasets: [
            {
              label: 'Total Score',
              data: Object.values(quizScores), // Total scores per quiz
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
          ],
        };

        setChartData(chartData);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching quiz results:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto mt-8">
        <h2 className="text-2xl font-semibold text-center mb-4">Loading...</h2>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h2 className="text-2xl font-semibold text-center mb-4">Total Score by Quiz Title</h2>

      <div className="w-full h-[50vh]">
        {chartData && (
          <Bar
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
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

export default TotalScoreByQuiz;
