import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PaginaPresentacion from './pages/PaginaPresentacion';
import PaginaLogin from './pages/PaginaLogin';
import './App.css';
import PaginaRegistro from './pages/PaginaRegistro';
import PaginaPrincipal from './pages/PaginaPrincipal';
import GitHubCallback from './pages/GitHubCallBack';


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<PaginaPresentacion />} />
          <Route path="/auth/login" element={<PaginaLogin />} />
          <Route path="/register" element={<PaginaRegistro />} />
          <Route path="/callback/github" element={<GitHubCallback />} />
          <Route path="/principal" element={<PaginaPrincipal />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
