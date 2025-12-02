import React from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from '@/components/admin-sidebar.tsx';

export const MainLayout: React.FC = () => {
    return (
        <div className="flex min-h-screen bg-gray-50">
            <AdminSidebar />

            <div className="flex flex-col flex-1 overflow-hidden w-full sm:w-auto">
                <main className="flex-1 overflow-auto pb-20 sm:pb-0">
                    <div className="container mx-auto p-4 sm:p-6">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

