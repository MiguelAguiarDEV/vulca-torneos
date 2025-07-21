import React from 'react';
import AdminLayout from '../layouts/AdminLayout';

const Dashboard: React.FC = () => {
    return (
        <AdminLayout title="Dashboard" pageTitle="Dashboard">
            <div className="bg-[#212121] rounded-lg border-2 border-[#f7b134] p-8">
                <h1 className="text-4xl font-bold text-[#f7b134] mb-4">
                    Dashboard
                </h1>
                <p className="text-white text-lg">
                    Bienvenido al panel de administración de Vulca Torneos
                </p>
                <div className="mt-6 p-4 bg-[#f7b134]/10 border border-[#f7b134] rounded">
                    <p className="text-[#f7b134] font-medium">
                        🚀 Sistema listo para gestionar torneos épicos
                    </p>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Dashboard;
