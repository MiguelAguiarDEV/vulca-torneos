import React from 'react';
import AdminLayout from '../layouts/AdminLayout';

const Dashboard: React.FC = () => {
    return (
        <AdminLayout title="Dashboard" pageTitle="Dashboard">
            <div className="bg-secondary rounded-lg border-2 border-primary p-8">
                <h1 className="text-4xl font-bold text-primary mb-4">
                    Dashboard
                </h1>
                <p className="text-text-primary text-lg">
                    Bienvenido al panel de administración de Vulca Torneos
                </p>
                <div className="mt-6 p-4 bg-primary-alpha-10 border border-primary rounded">
                    <p className="text-primary font-medium">
                        🚀 Sistema listo para gestionar torneos épicos
                    </p>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Dashboard;
