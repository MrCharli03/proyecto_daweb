import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PaginaPresentacion from './pages/PaginaPresentacion';
import PaginaLogin from './pages/PaginaLogin';
import './App.css';
import PaginaRegistro from './pages/PaginaRegistro';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<PaginaPresentacion />} />
          <Route path="/auth/login" element={<PaginaLogin />} />
          <Route path="/register" element={<PaginaRegistro />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
