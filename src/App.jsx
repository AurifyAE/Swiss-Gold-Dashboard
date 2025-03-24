// src/App.js
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Layout from './components/layout/index';
import RouterConfig from './router';
import "./App.css"

const App = () => {
  return (
    <Router>
      <div className="flex">
        <Layout />
        <div className="flex-1">
          <RouterConfig />
        </div>
      </div>
    </Router>
  );
};

export default App;
