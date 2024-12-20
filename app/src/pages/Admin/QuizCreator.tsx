import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { RiAiGenerate } from "react-icons/ri";

interface Question {
  questionText: string;
  type: string;
  options: string[];
  correctAnswer: string;
  correctAnswers: string[];
}

interface QuizData {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  timeLimit: string;
  questions: Question[];
}

const AdminCreateQuiz: React.FC = () => {
  const [explanation, setExplanation] = useState<string | undefined>();
  const [liveQuestionText, setLiveQuestionText] = useState<string[]>([]);
  const [quizData, setQuizData] = useState<QuizData>({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    timeLimit: "",
    questions: [
      {
        questionText: "",
        type: "multiple-choice",
        options: ["", "", "", ""],
        correctAnswer: "",
        correctAnswers: [],
      },
    ],
  });
  const [successMessage, setSuccessMessage] = useState<string>("");

  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleAiExplanation = async (questionText: string) => {
    try {
      const response = await axios({
        url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyAfAoMqKsgh2VPXR7tV3xF2zze4pDd-KB8",
        method: "post",
        data: {
          contents: [
            {
              parts: [
                {
                  text: `Generate 4 MCQs for the question: "${questionText}" with one correct and others incorrect.`,
                },
              ],
            },
          ],
        },
      });
      const explanation =
        response.data?.candidates[0]?.content.parts[0]?.text || "Explanation not available.";
      setExplanation(explanation);
    } catch (error) {
      console.error("Error generating AI explanation:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setQuizData({
      ...quizData,
      [name]: value,
    });
  };

  const handleQuestionChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const updatedQuestions = [...quizData.questions];
  
    if (name === 'options') {
      // Update options field
      updatedQuestions[index].options = value.split(',').map(option => option.trim());
    } else if (name === 'questionText' || name === 'type' || name === 'correctAnswer') {
      updatedQuestions[index][name as 'questionText' | 'type' | 'correctAnswer'] = value;
  
      // Update liveQuestionText for AI explanation
      if (name === 'questionText') {
        setLiveQuestionText((prev) => ({
          ...prev,
          [index]: value,
        }));
      }
    }
  
    setQuizData({ ...quizData, questions: updatedQuestions });
  };

  const handleOptionChange = (questionIndex: number, optionIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const updatedQuestions = [...quizData.questions];
    updatedQuestions[questionIndex].options[optionIndex] = value;
    setQuizData({
      ...quizData,
      questions: updatedQuestions,
    });
  };

  const handleCorrectAnswersChange = (questionIndex: number, option: string, isChecked: boolean) => {
    const updatedQuestions = [...quizData.questions];
    const { correctAnswers } = updatedQuestions[questionIndex];

    if (isChecked) {
      updatedQuestions[questionIndex].correctAnswers = [...correctAnswers, option];
    } else {
      updatedQuestions[questionIndex].correctAnswers = correctAnswers.filter(
        (answer) => answer !== option
      );
    }

    setQuizData({
      ...quizData,
      questions: updatedQuestions,
    });
  };

  const addQuestion = () => {
    setExplanation('')
    setQuizData({
      ...quizData,
      questions: [
        ...quizData.questions,
        {
          questionText: "",
          type: "multiple-choice",
          options: ["", "", "", ""],
          correctAnswer: "",
          correctAnswers: [],
        },
      ],
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload = {
      adminId: user?.id,
      title: quizData.title,
      description: quizData.description,
      startDate: quizData.startDate,
      endDate: quizData.endDate,
      timeLimit: quizData.timeLimit,
      questions: quizData.questions.map((question) => ({
        questionText: question.questionText,
        type: question.type,
        correctAnswer: question.type === "multiple-select" ? null : question.correctAnswer,
        options: question.options.map((option) => ({
          optionText: option,
          isCorrect: question.correctAnswers.includes(option),
        })),
      })),
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/api/quizzes/create-with-questions",
        payload
      );
      setSuccessMessage("Quiz created successfully!");
      console.log(response.data);
      console.warn("payload", payload);
    } catch (error) {
      console.error("Error creating quiz:", error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Create a New Quiz</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-lg font-semibold">Quiz Title:</label>
          <input
            type="text"
            name="title"
            value={quizData.title}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-lg font-semibold">Quiz Description:</label>
          <textarea
            id="description"
            name="description"
            value={quizData.description}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
            rows={4}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-lg font-semibold">Start Date:</label>
          <input
            type="datetime-local"
            id="startDate"
            name="startDate"
            value={quizData.startDate}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-lg font-semibold">End Date:</label>
          <input
            type="datetime-local"
            id="endDate"
            name="endDate"
            value={quizData.endDate}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-lg font-semibold">Time Limit (in minutes):</label>
          <input
            type="number"
            id="timeLimit"
            name="timeLimit"
            value={quizData.timeLimit}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Questions</h2>
          {quizData.questions.map((question, index) => (
            <div key={index} className="mb-4">
              <label className="block text-lg font-semibold">Question {index + 1} Text:</label>
              <input
                type="text"
                name="questionText"
                value={question.questionText}
                onChange={(e) => handleQuestionChange(index, e)}
                className="w-full p-2 border border-gray-300 rounded-lg"
                required
              />

              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => handleAiExplanation(liveQuestionText[index])}
                  className="bg-yellow-200 text-black p-2 rounded-lg"
                >
                  <RiAiGenerate color="black" /> Generate Options
                </button>

                <div className="mt-6">
                  {explanation && (
                    <div className="bg-white text-gray-800 p-6 rounded-lg shadow-md max-w-2xl mx-auto">
                      <p className="text-lg leading-relaxed">{explanation}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-2">
                <label className="block text-lg font-semibold">Question Type:</label>
                <select
                  name="type"
                  value={question.type}
                  onChange={(e) => handleQuestionChange(index, e)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                >
                  <option value="multiple-choice">Multiple Choice</option>
                  <option value="multiple-select">Multiple Select</option>
                  <option value="true-false">True/False</option>
                  <option value="fill-in-the-blank">Fill in the Blank</option>
                </select>
              </div>

              {(question.type === "multiple-choice" || question.type === "multiple-select") && (
                <div>
                  {question.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center mb-2">
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => handleOptionChange(index, optionIndex, e)}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        placeholder={`Option ${optionIndex + 1}`}
                        required
                      />
                      {question.type === "multiple-select" && (
                        <input
                          type="checkbox"
                          checked={question.correctAnswers.includes(option)}
                          onChange={(e) =>
                            handleCorrectAnswersChange(index, option, e.target.checked)
                          }
                          className="ml-2"
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}

              {question.type !== "multiple-select" && (
                <div className="mt-4">
                  <label className="block text-lg font-semibold">Correct Answer:</label>
                  <input
                    type="text"
                    name="correctAnswer"
                    value={question.correctAnswer}
                    onChange={(e) => handleQuestionChange(index, e)}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={addQuestion}
            className="bg-blue-500 text-white p-2 rounded-lg mt-4"
          >
            Add Another Question
          </button>
        </div>

        <button
          type="submit"
          className="bg-green-500 text-white p-3 rounded-lg hover:bg-green-700"
        >
          Create Quiz
        </button>
      </form>

      {successMessage && (
        <div className="mt-6 p-4 bg-green-100 border border-green-300 rounded-md">
          <p>{successMessage}</p>
        </div>
      )}
    </div>
  );
};

export default AdminCreateQuiz;

