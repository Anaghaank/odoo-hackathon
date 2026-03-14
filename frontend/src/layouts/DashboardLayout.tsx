import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/dashboard/Sidebar';
import Header from '../components/dashboard/Header';

const DashboardLayout: React.FC = () => {

    // Dynamic padding based on sidebar state would require context or listener
    // For now we use a standard wide margin that works with the Sidebar's transition
    return (
        <div className="min-h-screen bg-[#f8fafc]">
            <Sidebar />
            
            {/* Main content wrapper with dynamic left margin to match sidebar transition */}
            <div className="transition-all duration-500 ease-in-out pl-72">
                <Header />
                <main className="p-8 lg:p-12 min-h-[calc(100vh-80px)]">
                    <div className="max-w-[1600px] mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>

            {/* Background Aesthetic Elements */}
            <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-blue-100/20 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none -z-10"></div>
            <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-indigo-100/20 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none -z-10"></div>
        </div>
    );
};

export default DashboardLayout;
