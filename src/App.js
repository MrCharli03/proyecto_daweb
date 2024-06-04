import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PaginaPresentacion from './pages/PaginaPresentacion';
import PaginaLogin from './pages/PaginaLogin';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<PaginaPresentacion />} />
          <Route path="/auth/login" element={<PaginaLogin />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
