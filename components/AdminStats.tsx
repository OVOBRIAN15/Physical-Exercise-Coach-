
import React from 'react';
import { UsersIcon, CreditCardIcon, CurrencyDollarIcon } from './Icons';

interface AdminStatsProps {
    totalUsers: number;
    activeSubscriptions: number;
    monthlyRevenue: number;
}

const StatCard: React.FC<{ icon: React.ReactNode; title: string; value: string; }> = ({ icon, title, value }) => (
    <div className="bg-white dark:bg-gray-800/50 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-transparent flex items-center space-x-4">
        <div className="bg-primary-light/10 dark:bg-primary/20 p-3 rounded-full">
            {icon}
        </div>
        <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-text">{title}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-light-text">{value}</p>
        </div>
    </div>
);


const AdminStats: React.FC<AdminStatsProps> = ({ totalUsers, activeSubscriptions, monthlyRevenue }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard 
                icon={<UsersIcon className="w-6 h-6 text-primary-light dark:text-primary" />}
                title="Total Users"
                value={totalUsers.toString()}
            />
            <StatCard 
                icon={<CreditCardIcon className="w-6 h-6 text-primary-light dark:text-primary" />}
                title="Active Subscriptions"
                value={activeSubscriptions.toString()}
            />
             <StatCard 
                icon={<CurrencyDollarIcon className="w-6 h-6 text-primary-light dark:text-primary" />}
                title="Est. Monthly Revenue"
                value={`$${monthlyRevenue.toLocaleString()}`}
            />
        </div>
    );
};

export default AdminStats;
