// src/App.js
import React from "react";
import { BrowserRouter as Router, useLocation } from "react-router-dom";
import Layout from "./components/layout/index";
import { CurrencyProvider } from "./context/CurrencyContext";
import { MarketDataProvider } from "./context/MarketDataContext";
import { SpotRateProvider } from "./context/SpotRateContext";
import RouterConfig from "./router";
import "./App.css";

const AppContent = () => {
  const location = useLocation();
  const isRootPath = location.pathname === "/";

  return (
    <div className="flex">
      {!isRootPath && <Layout />}
      <div className="flex-1">
        <RouterConfig />
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <CurrencyProvider>
        <MarketDataProvider>
          <SpotRateProvider>
            <AppContent />
          </SpotRateProvider>
        </MarketDataProvider>
      </CurrencyProvider>
    </Router>
  );
};

export default App;