import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/dashboard/Sidebar';
import Header from '../components/dashboard/Header';

const DashboardLayout: React.FC = () => {
    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#020617', color: '#f8fafc' }}>
            {/* Fixed background glow */}
            <div className="bg-mesh"></div>
            
            <Sidebar />
            
            {/* Main content pushed right of sidebar */}
            <div style={{ flex: 1, marginLeft: '18rem', minWidth: 0, overflowX: 'hidden' }}>
                <Header />
                <main style={{ padding: '2rem 3rem', minHeight: 'calc(100vh - 96px)', overflowX: 'hidden' }}>
                    <Outlet />
                </main>
            </div>

            {/* Cinematic Light Sources */}
            <div className="fixed top-0 left-0 w-[600px] h-[600px] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none -z-10 animate-pulse"></div>
            <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 blur-[130px] rounded-full pointer-events-none -z-10 animate-pulse"></div>
        </div>
    );
};

export default DashboardLayout;
