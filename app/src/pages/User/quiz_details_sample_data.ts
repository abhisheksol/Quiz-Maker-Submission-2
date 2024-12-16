export const quizDetails: {
  id: string;
  title: string;
  description: string;
  questions: {
    id: string;
    questionText: string;
    type: string;
    options?: string[];
    correctAnswer: string;
  }[];
} = {
  id: "1",
  title: "Challenging General Knowledge Quiz",
  description: "Test your advanced general knowledge with these challenging questions!",
  questions: [
    {
      id: "q1",
      questionText: "Which element has the chemical symbol 'Hg'?",
      type: "multiple-choice",
      options: ["Hydrogen", "Mercury", "Helium", "Magnesium"],
      correctAnswer: "Mercury"
    },
    {
      id: "q2",
      questionText: "The Great Wall of China was primarily built to protect against which group?",
      type: "multiple-choice",
      options: ["The Mongols", "The Romans", "The British", "The French"],
      correctAnswer: "The Mongols"
    },
    {
      id: "q3",
      questionText: "True or False: The Eiffel Tower was originally intended to be a temporary structure.",
      type: "true-false",
      correctAnswer: "True"
    },
    {
      id: "q4",
      questionText: "Fill in the blank: The longest river in Asia is the _____ River.",
      type: "fill-in-the-blank",
      correctAnswer: "Yangtze"
    },
    {
      id: "q5",
      questionText: "True or False: Mount Everest is located in the Himalayas.",
      type: "true-false",
      correctAnswer: "True"
    }
  ]
};