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

// Define the type for quiz results
interface QuizData {
  user_id: number;
  user_name: string;
  user_email: string;
  quiz_id: number;
  quiz_title: string;
  score: number;
  total_questions: number;
  date_taken: string;
}

// Chart.js dataset interface
interface ChartDataset {
  user_name: string;
  totalScore: number;
}

// Function to generate random colors for the bars
const generateRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const UserRankingChart = () => {
  const [chartData, setChartData] = useState<any>(null); // State to store chart data
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data from the API
    axios.get('http://localhost:5000/api/users/results')
      .then((response) => {
        const data: QuizData[] = response.data;

        // Step 1: Process and sort the data
        const users = data.reduce((acc: ChartDataset[], quiz) => {
          const existingUser = acc.find(user => user.user_name === quiz.user_name);
          if (existingUser) {
            existingUser.totalScore += quiz.score; // Add scores for the same user
          } else {
            acc.push({ user_name: quiz.user_name, totalScore: quiz.score });
          }
          return acc;
        }, [] as ChartDataset[]);

        // Step 2: Sort users by total score (descending)
        const sortedUsers = users.sort((a, b) => b.totalScore - a.totalScore);

        // Step 3: Prepare data for charting
        const chartData = {
          labels: sortedUsers.map(user => `${user.user_name} (Rank ${sortedUsers.indexOf(user) + 1})`),
          datasets: [
            {
              label: 'User Score',
              data: sortedUsers.map(user => user.totalScore),
              backgroundColor: sortedUsers.map(() => generateRandomColor()), // Generate random colors for each bar
              borderColor: sortedUsers.map(() => 'rgba(75, 192, 192, 1)'),
              borderWidth: 1,
            },
          ],
        };

        setChartData(chartData);  // Update chart data state
        setLoading(false);  // Set loading state to false
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
      <h2 className="text-2xl font-semibold text-center mb-4">User Rankings</h2>

      <div className='w-full h-[50vh]'>
        {chartData && (
          <Bar
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              indexAxis: 'y',
              aspectRatio: 2, // Optional: Adjust aspect ratio for height/width (default is 2)
              plugins: {
                legend: {
                  labels: {
                    font: {
                      size: 20,
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

export default UserRankingChart;
