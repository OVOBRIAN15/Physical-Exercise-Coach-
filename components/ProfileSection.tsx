
import React, { useState } from 'react';
import { User } from '../types';
import { UserCircleIcon } from './Icons';
import Spinner from './Spinner';

interface ProfileSectionProps {
    user: User;
    onSave: (updatedData: { name?: string; age?: number; fitnessGoals?: string }) => void;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ user, onSave }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: user.name || '',
        age: user.age || '',
        fitnessGoals: user.fitnessGoals || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            onSave({
                name: formData.name,
                age: formData.age ? parseInt(String(formData.age), 10) : undefined,
                fitnessGoals: formData.fitnessGoals,
            });
            setIsLoading(false);
            setIsEditing(false);
        }, 1000);
    };

    const handleCancel = () => {
        setFormData({
            name: user.name || '',
            age: user.age || '',
            fitnessGoals: user.fitnessGoals || '',
        });
        setIsEditing(false);
    };

    return (
        <div className="bg-white dark:bg-gray-800/50 p-6 sm:p-8 rounded-xl shadow-lg border border-gray-200 dark:border-transparent">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <UserCircleIcon className="w-8 h-8 text-primary-light dark:text-primary" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-light-text">Your Profile</h2>
                </div>
                {!isEditing && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 text-sm font-medium bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-md text-gray-800 dark:text-light-text"
                    >
                        Edit Profile
                    </button>
                )}
            </div>

            {isEditing ? (
                <form onSubmit={handleSave} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-600 dark:text-gray-text">Full Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="mt-1 w-full bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md p-2 text-gray-900 dark:text-light-text focus:ring-primary-light dark:focus:ring-primary focus:border-primary-light dark:focus:border-primary"
                            placeholder="e.g., Jane Doe"
                        />
                    </div>
                    <div>
                        <label htmlFor="age" className="block text-sm font-medium text-gray-600 dark:text-gray-text">Age</label>
                        <input
                            type="number"
                            id="age"
                            name="age"
                            value={formData.age}
                            onChange={handleChange}
                            min="1"
                            className="mt-1 w-full bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md p-2 text-gray-900 dark:text-light-text focus:ring-primary-light dark:focus:ring-primary focus:border-primary-light dark:focus:border-primary"
                            placeholder="e.g., 30"
                        />
                    </div>
                    <div>
                        <label htmlFor="fitnessGoals" className="block text-sm font-medium text-gray-600 dark:text-gray-text">Fitness Goals</label>
                        <textarea
                            id="fitnessGoals"
                            name="fitnessGoals"
                            value={formData.fitnessGoals}
                            onChange={handleChange}
                            rows={4}
                            className="mt-1 w-full bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md p-2 text-gray-900 dark:text-light-text focus:ring-primary-light dark:focus:ring-primary focus:border-primary-light dark:focus:border-primary resize-y"
                            placeholder="e.g., Lose 10kg, run a marathon..."
                        />
                    </div>
                    <div className="flex justify-end gap-4 pt-2">
                        <button type="button" onClick={handleCancel} className="px-4 py-2 text-sm font-medium bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-md text-gray-800 dark:text-light-text">Cancel</button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-4 py-2 text-sm font-medium bg-primary-light dark:bg-primary text-white dark:text-secondary hover:bg-opacity-90 rounded-md flex items-center justify-center min-w-[120px]"
                        >
                            {isLoading ? <Spinner size="sm" /> : 'Save Changes'}
                        </button>
                    </div>
                </form>
            ) : (
                <dl className="space-y-4">
                    <div>
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-text">Email</dt>
                        <dd className="mt-1 text-md text-gray-900 dark:text-light-text">{user.email}</dd>
                    </div>
                    <div>
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-text">Full Name</dt>
                        <dd className="mt-1 text-md text-gray-900 dark:text-light-text">{user.name || <span className="italic text-gray-400">Not set</span>}</dd>
                    </div>
                    <div>
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-text">Age</dt>
                        <dd className="mt-1 text-md text-gray-900 dark:text-light-text">{user.age || <span className="italic text-gray-400">Not set</span>}</dd>
                    </div>
                    <div>
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-text">Fitness Goals</dt>
                        <dd className="mt-1 text-md text-gray-900 dark:text-light-text whitespace-pre-wrap">{user.fitnessGoals || <span className="italic text-gray-400">Not set</span>}</dd>
                    </div>
                </dl>
            )}
        </div>
    );
};

export default ProfileSection;
