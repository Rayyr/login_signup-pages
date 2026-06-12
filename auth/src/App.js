import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Login/Login.jsx';
import Signup from './components/Signup/Signup.jsx';
 import ForgetPassword from "./components/ForgetPassword/ForgetPassword.jsx";
import ResetPassword from "./components/ResetPassword/ResetPassword.jsx";
import Profile from './components/Profile/Profile.jsx';
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/forgetPassword" element={<ForgetPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
   
      </Routes>
    </BrowserRouter>
  );
}

export default App;
