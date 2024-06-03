import React from 'react';
import Header from './componentes/Header';
import MainContent from './componentes/MainContent';
import Footer from './componentes/Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <div className="App">
      <Header />
      <MainContent />
      <Footer />
    </div>
  );
}

export default App;
