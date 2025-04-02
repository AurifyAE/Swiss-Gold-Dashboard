// src/App.js
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Layout from './components/layout/index';
import { CurrencyProvider } from './context/CurrencyContext';
import { MarketDataProvider } from './context/MarketDataContext';
import { SpotRateProvider } from './context/SpotRateContext';
import RouterConfig from './router';
import "./App.css"

const App = () => {
  return (
    <Router>
      <CurrencyProvider>
        <MarketDataProvider>
          <SpotRateProvider>
            <div className="flex">
              <Layout />
              <div className="flex-1">
                <RouterConfig />
              </div>
            </div>
          </SpotRateProvider>
        </MarketDataProvider>
      </CurrencyProvider>
    </Router>
  );
};

export default App;
