import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardHome from './pages/dashboard/DashboardHome';
import ProductsPage from './pages/dashboard/ProductsPage';
import OrdersPage from './pages/dashboard/OrdersPage';
import MoveHistoryPage from './pages/dashboard/MoveHistoryPage';
import PeoplePage from './pages/dashboard/PeoplePage';
import AnalyticsPage from './pages/dashboard/AnalyticsPage';
import InvoicePage from './pages/dashboard/InvoicePage';
import WarehousePage from './pages/dashboard/WarehousePage';
import ProfilePage from './pages/dashboard/ProfilePage';

const Placeholder = ({ title }: { title: string }) => (
  <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-3xl border-2 border-dashed border-slate-100 p-12">
    <div className="text-4xl font-bold text-slate-200 mb-4 tracking-tighter uppercase">{title} Coming Soon</div>
    <p className="text-slate-400 font-medium">We're working hard to bring you this feature.</p>
  </div>
);

function App() {
  console.log('App component rendering...');
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route 
          path="/" 
          element={<DashboardLayout />}
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardHome />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="history" element={<MoveHistoryPage />} />
          <Route path="people" element={<PeoplePage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="invoice" element={<InvoicePage />} />
          <Route path="setting" element={<WarehousePage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="message" element={<Placeholder title="Message" />} />
          <Route path="help" element={<Placeholder title="Help" />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
