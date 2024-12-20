import React, { useState, useEffect } from "react";
import { useParams, useLocation, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { RiAiGenerate } from "react-icons/ri";
import { useAuth } from "../../context/AuthContext";

interface QuestionOption {
  option_text: string;
  is_correct: boolean;
}

interface Question {
  question_id: string;
  question_text: string;
  type: string;
  options: QuestionOption[];
  correct_answer: string;
}

interface Quiz {
  title: string;
  description: string;
  questions: Question[];
}

const QuizTakerPage: React.FC = () => {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [score, setScore] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [explanations, setExplanations] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState<number | null>(null); // Timer state
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  const { timer } = location.state || {}; // Timer duration from route state
  const navigate = useNavigate(); // Use the hook for navigation
 
  useEffect(() => {
    axios
      .get<Quiz>(`http://localhost:5000/api/quizzes/${id}`)
      .then((response) => {
        const formattedQuiz = formatQuizData(response.data);
        setQuiz(formattedQuiz);
        const  l=formattedQuiz.questions.length
        setTimeLeft(timer || 300); // Set timer (default: 5 minutes)
      })
      .catch(() => {
        setError("Failed to fetch quiz data.");
      });
  }, [id, timer]);

  // Timer logic
  useEffect(() => {
    if (timeLeft === 0) {
      handleSubmit(); // Automatically submit when time is up
      
      // Use a timeout to ensure the score is processed properly before navigation
      setTimeout(() => {
        alert(`Oops! Time is up. Redirecting to results.`);
        navigate("/user/1/results");
      }, 100); // Small delay to avoid race condition
    }
  
    const interval = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime! > 0 ? prevTime! - 1 : 0));
    }, 1000);
  
    return () => clearInterval(interval); // Cleanup on unmount
  }, [timeLeft, navigate]);
  

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const formatQuizData = (data: Quiz): Quiz => {
    return {
      title: data.title,
      description: data.description,
      questions: data.questions,
    };
  };

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers((prevAnswers) => {
      const currentAnswers = prevAnswers[questionId] || [];
      if (currentAnswers.includes(value)) {
        // Deselect if already selected
        return { ...prevAnswers, [questionId]: currentAnswers.filter(val => val !== value) };
      } else {
        // Select the value
        return { ...prevAnswers, [questionId]: [...currentAnswers, value] };
      }
    });
  };

  const handleAiExplanation = async (questionId: string, questionText: string) => {
    console.log("loading....");

    try {
      const response = await axios({
        url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyAfAoMqKsgh2VPXR7tV3xF2zze4pDd-KB8",
        method: "post",
        data: {
          contents: [
            {
              parts: [
                {
                  text: `Explain this question: "${questionText}" in 2 lines.`,
                },
              ],
            },
          ],
        },
      });

      const explanation =
        response.data?.candidates[0]?.content.parts[0]?.text || "Explanation not available.";

      setExplanations((prevExplanations) => ({
        ...prevExplanations,
        [questionId]: explanation,
      }));
    } catch (error) {
      console.error("Error fetching AI explanation:", error);
    }
  };

  const handleSubmit = () => {
    let calculatedScore = 0;
  
    quiz!.questions.forEach((question) => {
      // Use a fallback for unanswered questions
      const userAnswer = answers[question.question_id] || []; // Default to an empty array if not answered
  
      if (question.type === "multiple-select") {
        if (Array.isArray(userAnswer) && userAnswer.length > 0) {
          const correctAnswers = question.options
            .filter((option) => option.is_correct)
            .map((option) => option.option_text.trim());
          const selectedAnswers = userAnswer.map((ans) => ans.trim());
  
          const isCorrect =
            correctAnswers.length === selectedAnswers.length &&
            correctAnswers.every((answer) => selectedAnswers.includes(answer));
  
          if (isCorrect) calculatedScore += 1;
        }
      } else if (userAnswer.length > 0 && userAnswer[0] === question.correct_answer) {
        calculatedScore += 1;
      }
    });
  
    setScore(calculatedScore);
  
    const submissionData = {
      userId: user?.id,
      quizId: parseInt(id!, 10),
      score: calculatedScore,
      totalQuestions: quiz!.questions.length,
    };
  
    axios
      .post("http://localhost:5000/api/quizzes/submit", submissionData)
      .then((response) => {
        console.log("Score submitted successfully:", response.data);
      })
      .catch((err) => {
        console.error("Error submitting score:", err);
      });
  };
  

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!quiz) {
    return <div>Loading quiz...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">{quiz.title}</h1>
      <p className="text-lg mb-4">{quiz.description}</p>
      <p className="text-lg font-bold text-red-500">Time Left: {formatTime(timeLeft!)}</p>

      <div className="space-y-6 text-black">
        {quiz.questions.map((question) => (
          <div
            key={question.question_id}
            className="bg-slate-100 p-4 border border-gray-200 rounded-lg shadow-md relative"
          >
            {/* AI Button with Tooltip */}
            <div className="absolute top-4 right-4 group">
              <button
                className="bg-yellow-200 text-white p-2 rounded-full shadow hover:bg-blue-600"
                onClick={() => handleAiExplanation(question.question_id, question.question_text)}
              >
                <RiAiGenerate color="black" />
              </button>
              <div className="absolute top-12 right-0 bg-gray-800 text-white text-sm px-3 py-2 rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Explain the question with AI
              </div>
            </div>

            <h2 className="text-xl font-semibold">{question.question_text}</h2>
            {explanations[question.question_id] && (
              <p className="mt-4 text-sm text-gray-700 italic">
                {explanations[question.question_id]}
              </p>
            )}

            {/* Question Options */}
            {question.type === "multiple-choice" && (
              <div className="mt-4">
                {question.options.map((option, idx) => (
                  <div key={idx} className="flex items-center mb-2">
                    <input
                      type="radio"
                      id={`${question.question_id}-option-${idx}`}
                      name={question.question_id}
                      value={option.option_text}
                      onChange={() => handleAnswerChange(question.question_id, option.option_text)}
                      className="mr-2"
                    />
                    <label htmlFor={`${question.question_id}-option-${idx}`}>{option.option_text}</label>
                  </div>
                ))}
              </div>
            )}

            {question.type === "multiple-select" && (
              <div className="mt-4">
                {question.options.map((option, idx) => (
                  <div key={idx} className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id={`${question.question_id}-option-${idx}`}
                      name={question.question_id}
                      value={option.option_text}
                      onChange={(e) => handleAnswerChange(question.question_id, e.target.value)}
                      className="mr-2"
                    />
                    <label htmlFor={`${question.question_id}-option-${idx}`}>{option.option_text}</label>
                  </div>
                ))}
              </div>
            )}

            {question.type === "true-false" && (
              <div className="mt-4">
                <div className="flex items-center mb-2">
                  <input
                    type="radio"
                    id={`${question.question_id}-true`}
                    name={question.question_id}
                    value="True"
                    onChange={() => handleAnswerChange(question.question_id, "True")}
                    className="mr-2"
                  />
                  <label htmlFor={`${question.question_id}-true`}>True</label>
                </div>
                <div className="flex items-center mb-2">
                  <input
                    type="radio"
                    id={`${question.question_id}-false`}
                    name={question.question_id}
                    value="False"
                    onChange={() => handleAnswerChange(question.question_id, "False")}
                    className="mr-2"
                  />
                  <label htmlFor={`${question.question_id}-false`}>False</label>
                </div>
              </div>
            )}

            {question.type === "fill-in-the-blank" && (
              <div className="mt-4">
                <input
                  type="text"
                  placeholder="Your answer..."
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  onChange={(e) => handleAnswerChange(question.question_id, e.target.value)}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6">
        <button
          className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-700"
          onClick={handleSubmit}
        >
          Submit Quiz
        </button>
      </div>

      {score !== null && (
        <div className="mt-6 p-4 bg-green-100 border border-green-300 rounded-md">
          <p>Quiz submitted successfully!</p>
          <p>
            Score: {score} / {quiz.questions.length}
          </p>
        </div>
      )}
    </div>
  );
};

export default QuizTakerPage;

