import React from 'react';
import PaginaPresentacion from './pages/PaginaPresentacion';

import './App.css';
import PaginaLogin from './pages/PaginaLogin';

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route exact path="/" component={PaginaPresentacion} />
          <Route path="/login" component={PaginaLogin} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
