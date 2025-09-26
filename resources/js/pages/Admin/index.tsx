import AdminLayout from '@/layouts/AdminLayout';
import { Rocket } from 'lucide-react';
import React from 'react';

const Dashboard: React.FC = () => {
    return (
        <AdminLayout title="Dashboard" pageTitle="Vulca Torneos">
            <div className="rounded-lg border-2 border-primary bg-secondary p-8">
                <h1 className="mb-4 text-4xl font-bold text-primary">Dashboard</h1>
                <p className="text-lg text-text-primary">Bienvenido al panel de administración de Vulca Torneos</p>
                <div className="mt-6 rounded border border-primary bg-primary-alpha-10 p-4">
                    <p className="flex items-center font-medium text-primary">
                        <Rocket className="mr-2 h-5 w-5" />
                        Sistema listo para gestionar torneos épicos
                    </p>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Dashboard;
