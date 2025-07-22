import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';

import DivisionJEE from './components/jee/DivisionJEE.jsx';


import PaperJEE from './components/jee/PaperJEE.jsx';
import QuizJEE from './components/jee/QuizJEE.jsx';
import DoubtsJEE from './components/jee/DoubtsJEE.jsx';
import RevisionJEE from './components/jee/RevisionJEE.jsx';
import Home from './Home/Home.jsx';

// import Login from './components/Login.js';

const App = () => {

  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (window.location.pathname === '/' && token) {
      navigate('/home');
    }
  }, [navigate]);

  return (
      <Routes>
        {/* <Route path="/" element={<Login />} /> */}
        <Route path="/" element={<Home />} />
        <Route path="/demo" element={<DivisionJEE />} />
        <Route path="/demo/paper" element={<PaperJEE />} />
        <Route path="/demo/quiz" element={<QuizJEE />} />
        <Route path="/demo/doubts" element={<DoubtsJEE />} />
        <Route path="/demo/revision" element={<RevisionJEE />} />

      </Routes>
  );
};

export default App;