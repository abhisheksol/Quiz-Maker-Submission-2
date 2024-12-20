import logo from './logo.svg';
import './App.css';
import Nav from './component/nav';
import QuizTaker from './pages/User/QuizTaker';
// import Button from './component/button';
import QuizCreator from './pages/Admin/QuizCreator';
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import Home from './Home';
import Login from './pages/Login';
import QuizList from './pages/User/Quiz_List';
import UserQuizResult from './pages/User/UserQuizResult';
import UserDashboard from './pages/User/UserDashboard';
// import Settings from './pages/User/Settings';
import Registration from './pages/Register';
import Quiz_Mange from './pages/Admin/Quiz_Mange';
import AdminDashboard from './pages/Admin/AdminDashboard';
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./context/AuthContext";
import Leaderboard from './pages/Leaderboard';
import EditQuiz from './pages/Admin/Edit';

const App: React.FC = () => {
  console.log();
  
  return (
    <AuthProvider>
      <Router>
        <div>
          <header>
            <Nav />
          </header>
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="user/quizzes" element={<QuizList isAdmin={false}/>} />
              <Route path="/quiz/:id" element={<QuizTaker />} />
              <Route path="/admin/create" element={<QuizCreator />} />
              <Route path="/user/:userId/results" element={<UserQuizResult />} />
              <Route path="/user/dashboard" element={<UserDashboard />} />
              {/* <Route path="/settings" element={<Settings />} /> */}
              <Route path="/register" element={<Registration />} />
              <Route path="/admin/quizzes" element={<Quiz_Mange />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/admin/edit/:id" element={<EditQuiz />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;