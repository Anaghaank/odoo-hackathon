import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardHome from './pages/dashboard/DashboardHome';

// Placeholder components for other pages
const Placeholder = ({ title }: { title: string }) => (
  <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-3xl border-2 border-dashed border-slate-100 p-12">
    <div className="text-4xl font-bold text-slate-200 mb-4 tracking-tighter uppercase">{title} Coming Soon</div>
    <p className="text-slate-400 font-medium">We're working hard to bring you this feature.</p>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardHome />} />
          <Route path="products" element={<Placeholder title="Products" />} />
          <Route path="orders" element={<Placeholder title="Orders" />} />
          <Route path="people" element={<Placeholder title="People" />} />
          <Route path="analytics" element={<Placeholder title="Analytics" />} />
          <Route path="invoice" element={<Placeholder title="Invoice" />} />
          <Route path="message" element={<Placeholder title="Message" />} />
          <Route path="help" element={<Placeholder title="Help" />} />
          <Route path="setting" element={<Placeholder title="Setting" />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
