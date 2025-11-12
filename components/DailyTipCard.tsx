
import React, { useState, useEffect, useCallback } from 'react';
import { User } from '../types';
import { generateDailyTip } from '../services/geminiService';
import Spinner from './Spinner';
import { LightBulbIcon } from './Icons';

interface DailyTipCardProps {
    user: User;
}

const DailyTipCard: React.FC<DailyTipCardProps> = ({ user }) => {
    const [tip, setTip] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getTip = useCallback(async (forceRefresh = false) => {
        setIsLoading(true);
        setError(null);
        
        const today = new Date().toISOString().split('T')[0];
        const cacheKey = `dailyTip-${user.id}-${today}`;
        
        try {
            if (!forceRefresh) {
                const cachedTip = localStorage.getItem(cacheKey);
                if (cachedTip) {
                    setTip(cachedTip);
                    return;
                }
            }

            const newTip = await generateDailyTip(user);
            setTip(newTip);
            localStorage.setItem(cacheKey, newTip);
        } catch (e) {
            console.error(e);
            setError("Couldn't fetch your tip. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    useEffect(() => {
        getTip();
    }, [getTip]);

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex items-center justify-center h-24">
                    <Spinner size="md" />
                </div>
            );
        }
        if (error) {
            return <p className="text-center text-red-500">{error}</p>;
        }
        if (tip) {
            return <p className="text-gray-700 dark:text-gray-200 text-center italic">"{tip}"</p>;
        }
        return null;
    };

    return (
        <div className="bg-white dark:bg-gray-800/50 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-transparent">
            <div className="flex items-center gap-3 mb-4">
                <LightBulbIcon className="w-7 h-7 text-primary-light dark:text-primary" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-light-text">Your Daily Tip</h2>
            </div>
            <div className="min-h-[6rem] flex items-center justify-center">
                {renderContent()}
            </div>
            <div className="mt-4 text-center">
                 <button 
                    onClick={() => getTip(true)} 
                    disabled={isLoading}
                    className="text-xs text-gray-500 dark:text-gray-400 hover:underline disabled:opacity-50"
                >
                    {isLoading ? 'Generating...' : 'Get a new tip'}
                </button>
            </div>
        </div>
    );
};

export default DailyTipCard;
