
import React, { useState } from 'react';
import Spinner from './Spinner';

interface ForgotPasswordModalProps {
  onClose: () => void;
  onSendResetLink: (email: string) => void;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ onClose, onSendResetLink }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      onSendResetLink(email);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-light-bg rounded-lg shadow-xl w-full max-w-sm p-8 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white text-2xl">&times;</button>
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-light-text mb-2">Reset Your Password</h2>
        <p className="text-center text-sm text-gray-600 dark:text-gray-text mb-6">Enter your email and we'll send you a link to get back into your account.</p>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="reset-email" className="block text-sm font-medium text-gray-600 dark:text-gray-text">Email Address</label>
              <input
                type="email"
                id="reset-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-gray-900 dark:text-light-text focus:ring-primary-light dark:focus:ring-primary focus:border-primary-light dark:focus:border-primary"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>
          {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
          <div className="mt-6">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary-light dark:bg-primary text-white dark:text-secondary font-bold py-2 rounded-md transition-opacity hover:bg-opacity-90 flex items-center justify-center"
            >
              {isLoading ? <Spinner size="sm" /> : 'Send Reset Link'}
            </button>
          </div>
           <p className="mt-4 text-center text-sm">
            <button type="button" onClick={onClose} className="font-medium text-gray-600 dark:text-gray-text hover:underline">
              &larr; Back to Login
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
