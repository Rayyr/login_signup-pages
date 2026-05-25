 import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Login/Login.jsx';
import Signup from './components/Signup/Signup.jsx';



function App() {
  return (
    <BrowserRouter>
     <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
     </BrowserRouter>
  );
}

export default App;
