
import React, { useState } from 'react';
import { User, ProgressEntry } from './types';
import ProgressChart from './components/ProgressChart';
import { ChartBarIcon } from './components/Icons';

interface ProgressTrackerProps {
  user: User;
  onLogProgress: (entry: ProgressEntry) => void;
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({ user, onLogProgress }) => {
  const today = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(today);
  const [weight, setWeight] = useState('');
  const [workoutDuration, setWorkoutDuration] = useState('');
  const [error, setError] = useState('');
  
  const progressData = user.progress || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const weightNum = parseFloat(weight);
    const durationNum = parseFloat(workoutDuration);

    if (!weight && !workoutDuration) {
        setError('Please enter at least one metric (weight or duration).');
        return;
    }
    if (weight && (isNaN(weightNum) || weightNum <= 0)) {
        setError('Please enter a valid positive number for weight.');
        return;
    }
    if (workoutDuration && (isNaN(durationNum) || durationNum <= 0)) {
        setError('Please enter a valid positive number for workout duration.');
        return;
    }

    const newEntry: ProgressEntry = { date };
    if (weight) newEntry.weight = weightNum;
    if (workoutDuration) newEntry.workoutDuration = durationNum;
    
    onLogProgress(newEntry);
    
    // Reset form
    setWeight('');
    setWorkoutDuration('');
    setError('');
  };
  
  const getConsistency = () => {
      const thisMonth = new Date().getMonth();
      const thisYear = new Date().getFullYear();
      const workoutsThisMonth = progressData.filter(p => {
          const entryDate = new Date(p.date);
          return p.workoutDuration && entryDate.getMonth() === thisMonth && entryDate.getFullYear() === thisYear;
      }).length;
      return workoutsThisMonth;
  }

  return (
    <div className="space-y-8">
      {/* Log Progress Form */}
      <div className="bg-white dark:bg-gray-800/50 p-6 sm:p-8 rounded-xl shadow-lg border border-gray-200 dark:border-transparent">
        <div className="flex items-center gap-3">
          <ChartBarIcon className="w-8 h-8 text-primary-light dark:text-primary" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-light-text">Log Your Progress</h2>
        </div>
        <p className="mt-2 text-gray-600 dark:text-gray-text">Add your daily stats to track your journey.</p>
        <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-600 dark:text-gray-text">Date</label>
            <input type="date" id="date" value={date} onChange={e => setDate(e.target.value)} max={today} className="mt-1 w-full bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md p-2 text-gray-900 dark:text-light-text focus:ring-primary-light dark:focus:ring-primary focus:border-primary-light dark:focus:border-primary" />
          </div>
          <div>
            <label htmlFor="weight" className="block text-sm font-medium text-gray-600 dark:text-gray-text">Weight (kg)</label>
            <input type="number" id="weight" value={weight} onChange={e => setWeight(e.target.value)} step="0.1" min="0" className="mt-1 w-full bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md p-2 text-gray-900 dark:text-light-text focus:ring-primary-light dark:focus:ring-primary focus:border-primary-light dark:focus:border-primary" placeholder="e.g., 85.5" />
          </div>
          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-600 dark:text-gray-text">Workout (min)</label>
            <input type="number" id="duration" value={workoutDuration} onChange={e => setWorkoutDuration(e.target.value)} min="0" className="mt-1 w-full bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md p-2 text-gray-900 dark:text-light-text focus:ring-primary-light dark:focus:ring-primary focus:border-primary-light dark:focus:border-primary" placeholder="e.g., 45" />
          </div>
          <button type="submit" className="w-full bg-primary-light dark:bg-primary text-white dark:text-secondary font-bold py-2 rounded-md transition-opacity hover:bg-opacity-90 h-10">Log Progress</button>
        </form>
        {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
      </div>
      
      {/* Stats & Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 grid grid-cols-1 gap-8">
            <ProgressChart data={progressData} metric="weight" title="Weight Progress (kg)" color="#4338CA" unit="kg" />
            <ProgressChart data={progressData} metric="workoutDuration" title="Workout Duration (minutes)" color="#10B981" unit="min" />
        </div>
        <div className="space-y-8">
            <div className="bg-white dark:bg-gray-800/50 p-6 rounded-xl shadow-lg text-center border border-gray-200 dark:border-transparent">
                <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-text">Workouts This Month</h3>
                <p className="text-5xl font-bold text-primary-light dark:text-primary mt-2">{getConsistency()}</p>
                <p className="text-gray-600 dark:text-gray-text mt-1">Consistency is key!</p>
            </div>
             <div className="bg-white dark:bg-gray-800/50 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-transparent">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-light-text mb-3">Recent Entries</h3>
                <ul className="space-y-2 max-h-96 overflow-y-auto pr-2">
                    {progressData.slice().reverse().slice(0, 10).map((entry, index) => (
                        <li key={index} className="flex justify-between items-center text-sm p-2 bg-gray-100 dark:bg-gray-900 rounded-md">
                           <span className="font-semibold text-gray-600 dark:text-gray-text">{entry.date}</span>
                           <div className="text-right">
                               {entry.weight && <span className="text-gray-800 dark:text-light-text">{entry.weight.toFixed(1)} kg</span>}
                               {entry.weight && entry.workoutDuration && <span className="text-gray-400 dark:text-gray-500 mx-2">|</span>}
                               {entry.workoutDuration && <span className="text-gray-800 dark:text-light-text">{entry.workoutDuration} min</span>}
                           </div>
                        </li>
                    ))}
                    {progressData.length === 0 && (
                        <p className="text-center text-gray-500 text-sm py-4">No entries yet. Log your first one!</p>
                    )}
                </ul>
            </div>
        </div>
      </div>

    </div>
  );
};
