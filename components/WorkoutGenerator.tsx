
import React, { useState } from 'react';
import { generateFitnessPlan } from '../services/geminiService';
import Spinner from './Spinner';
import { SparklesIcon } from './Icons';

interface WorkoutGeneratorProps {
  onPlanGenerated: (prompt: string, plan: string) => void;
}

const WorkoutGenerator: React.FC<WorkoutGeneratorProps> = ({ onPlanGenerated }) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please describe your fitness goals.');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const plan = await generateFitnessPlan(prompt);
      onPlanGenerated(prompt, plan); // Pass data to parent
    } catch (e) {
      setError('An error occurred while generating the plan.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800/50 p-6 sm:p-8 rounded-xl shadow-lg border border-gray-200 dark:border-transparent">
      <div className="flex items-center gap-3">
        <SparklesIcon className="w-8 h-8 text-primary-light dark:text-primary" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-light-text">AI Workout & Nutrition Plan Generator</h2>
      </div>
      <p className="mt-2 text-gray-600 dark:text-gray-text">Describe your goals, available equipment, and weekly schedule to get a custom plan.</p>
      <div className="mt-6 space-y-4">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full h-32 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md p-3 text-gray-900 dark:text-light-text focus:ring-primary-light dark:focus:ring-primary focus:border-primary-light dark:focus:border-primary resize-none"
          placeholder="e.g., I want to lose 10kg in 3 months. I have access to dumbbells and a treadmill, and I can work out 4 times a week. I prefer high-intensity workouts."
          disabled={isLoading}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className="w-full sm:w-auto px-6 py-3 bg-primary-light dark:bg-primary text-white dark:text-secondary font-bold rounded-md flex items-center justify-center transition-opacity hover:bg-opacity-90 disabled:opacity-50"
        >
          {isLoading ? <Spinner size="sm" /> : 'Generate My Plan'}
        </button>
      </div>
    </div>
  );
};

export default WorkoutGenerator;
