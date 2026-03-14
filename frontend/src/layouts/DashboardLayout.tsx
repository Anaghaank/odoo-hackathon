import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/dashboard/Sidebar';
import Header from '../components/dashboard/Header';

const DashboardLayout: React.FC = () => {
    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#020617', color: '#f8fafc' }}>
            <div className="bg-mesh"></div>
            <Sidebar />
            <div style={{ flex: 1, marginLeft: '18rem', minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                <Header />
                <main style={{ flex: 1, padding: '1.5rem 2.5rem 3rem', overflowX: 'hidden' }}>
                    <Outlet />
                </main>
            </div>
            <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none -z-10"></div>
            <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 blur-[130px] rounded-full pointer-events-none -z-10"></div>
        </div>
    );
};

export default DashboardLayout;
