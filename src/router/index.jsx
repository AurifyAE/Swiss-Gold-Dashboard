// src/router/index.jsx
import React from 'react';
import { Route, Routes } from 'react-router-dom';

// Importing all pages for routing
import Dashboard from '../pages/Dashboard';
import Profile from '../pages/Profile';
import SpotRate from '../pages/SpotRate';
import HelpCenter from '../pages/HelpCenter';
import Login from '../pages/Login';
import Customers from '../pages/Customers';
import Orders from '../pages/Orders';
import Shop from '../pages/Shop';
import Bank from '../pages/Bank';
import ProfilePage from '../components/userSession/profile'

const Router = () => {
    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/bank" element={<Bank />} />
            <Route path="/spot-rate" element={<SpotRate />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/help-center" element={<HelpCenter />} />
            <Route path="/profile/:userId" element={<ProfilePage />} />
        </Routes>
    );
};

export default Router;
