import React, { useState, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
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
  const [timeLeft, setTimeLeft] = useState<number | null>(300); // Set timer to 5 minutes by default
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();

  // Sample Quiz Data
  const sampleQuiz: Quiz = {
    title: "History GK Test",
    description: "History GK Test created by a@gmail.com",
    questions: [
      {
        question_id: "56",
        question_text: "When was the 'Battle of Tukaroi' fought?",
        type: "multiple-choice",
        correct_answer: "1575",
        options: [
          { option_text: "1532", is_correct: false },
          { option_text: "232", is_correct: false },
          { option_text: "1575", is_correct: true },
          { option_text: "1579", is_correct: false }
        ]
      },
      {
        question_id: "58",
        question_text: "Lion is king of the jungle",
        type: "true-false",
        correct_answer: "True",
        options: [
          { option_text: "", is_correct: false },
          { option_text: "", is_correct: false },
          { option_text: "", is_correct: false },
          { option_text: "", is_correct: false }
        ]
      },
      {
        question_id: "59",
        question_text: "There _____ a cat",
        type: "fill-in-the-blank",
        correct_answer: "was",
        options: [
          { option_text: "", is_correct: false },
          { option_text: "", is_correct: false },
          { option_text: "", is_correct: false },
          { option_text: "", is_correct: false }
        ]
      },
      {
        question_id: "57",
        question_text: "Which of the movies released in 2022?",
        type: "multiple-select",
        correct_answer: "",
        options: [
          { option_text: "ff", is_correct: true },
          { option_text: "ss", is_correct: false },
          { option_text: "ee", is_correct: false },
          { option_text: "ww", is_correct: true }
        ]
      }
    ]
  };

  useEffect(() => {
    // Use the sample data instead of fetching from the backend
    setQuiz(sampleQuiz);
  }, []);

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers((prevAnswers) => {
      const currentAnswers = prevAnswers[questionId] || [];
      if (currentAnswers.includes(value)) {
        return { ...prevAnswers, [questionId]: currentAnswers.filter(val => val !== value) };
      } else {
        return { ...prevAnswers, [questionId]: [...currentAnswers, value] };
      }
    });
  };

  const handleAiExplanation = async (questionId: string, questionText: string) => {
    // Simulate AI explanation for demonstration purposes
    const explanation = `This is a sample explanation for the question: "${questionText}".`;
    setExplanations((prevExplanations) => ({
      ...prevExplanations,
      [questionId]: explanation
    }));
  };

  const handleSubmit = () => {
    let calculatedScore = 0;

    quiz!.questions.forEach((question) => {
      const userAnswer = answers[question.question_id];

      if (question.type === "multiple-select") {
        if (userAnswer && Array.isArray(userAnswer)) {
          const correctAnswers = question.options.filter(option => option.is_correct).map(option => option.option_text.trim());
          const selectedAnswers = userAnswer.map(ans => ans.trim());

          const isCorrect = correctAnswers.length === selectedAnswers.length && correctAnswers.every(answer => selectedAnswers.includes(answer));

          if (isCorrect) calculatedScore += 1;
        }
      }

      if (userAnswer[userAnswer.length - 1] === question.correct_answer) {
        calculatedScore += 1;
      }
    });

    setScore(calculatedScore);
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
          <div key={question.question_id} className="bg-slate-100 p-4 border border-gray-200 rounded-lg shadow-md relative">
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
