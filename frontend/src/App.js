// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { OrdersProvider }         from './context/OrdersContext';
import { DashboardProvider }      from './context/DashboardContext';
import { ToastProvider }          from './context/ToastContext';
import Sidebar       from './components/layout/Sidebar';
import LandingPage   from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import OrdersPage    from './pages/OrdersPage';
import ProfilePage   from './pages/ProfilePage';

function AppShell() {
  return (
    <OrdersProvider>
      <DashboardProvider>
        <div style={{ display:'flex', minHeight:'100vh' }}>
          <Sidebar />
          <main style={{ flex:1, overflow:'auto', minWidth:0, display:'flex', flexDirection:'column' }}>
            <Routes>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/orders"    element={<OrdersPage    />} />
              <Route path="/profile"   element={<ProfilePage   />} />
              <Route path="*"          element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </main>
        </div>
      </DashboardProvider>
    </OrdersProvider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <Routes>
            <Route path="/"  element={<LandingPage />} />
            <Route path="/*" element={<AppShell    />} />
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
