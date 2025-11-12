
import React, { useState, useEffect } from 'react';
import { UserRole } from '../types';

interface LoginProps {
  onAuth: (email: string, isRegistering: boolean) => void;
  onClose: () => void;
  onForgotPasswordClick: () => void;
}

const Login: React.FC<LoginProps> = ({ onAuth, onClose, onForgotPasswordClick }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, label: '', color: '', textColor: '' });

  const getPasswordStrength = (password: string) => {
    let score = 0;
    if (!password) {
        return { score: 0, label: '', color: 'bg-transparent', textColor: '' };
    }
    // Criteria for strength
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++; // Special character check

    if (score < 3) {
        return { score: 1, label: 'Weak', color: 'bg-red-500', textColor: 'text-red-500' };
    } else if (score < 5) {
        return { score: 2, label: 'Medium', color: 'bg-orange-500', textColor: 'text-orange-500' };
    } else {
        return { score: 3, label: 'Strong', color: 'bg-green-500', textColor: 'text-green-500' };
    }
  };

  useEffect(() => {
    if (isRegistering) {
        setPasswordStrength(getPasswordStrength(password));
    }
  }, [password, isRegistering]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (isRegistering) {
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
      if (password.length < 6) {
        setError("Password must be at least 6 characters long.");
        return;
      }
    }
    
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    // Mocking auth logic. The password isn't actually used for login lookup except for admin.
    // In a real app, this would be an API call.
    if (email.toLowerCase() === 'admin@aifitness.com' && password === '24681012pro') {
       onAuth(email, false); // always login for admin
    } else {
       onAuth(email, isRegistering);
    }
  };
  
  const handleToggleMode = () => {
    setIsRegistering(!isRegistering); 
    setError('');
    setPassword('');
    setConfirmPassword('');
    setPasswordStrength({ score: 0, label: '', color: '', textColor: '' });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-light-bg rounded-lg shadow-xl w-full max-w-sm p-8 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white text-2xl">&times;</button>
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-light-text mb-6">
          {isRegistering ? 'Create Your Account' : 'Welcome Back'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-600 dark:text-gray-text">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-gray-900 dark:text-light-text focus:ring-primary-light dark:focus:ring-primary focus:border-primary-light dark:focus:border-primary"
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="block text-sm font-medium text-gray-600 dark:text-gray-text">Password</label>
                {!isRegistering && (
                    <button type="button" onClick={onForgotPasswordClick} className="text-xs font-medium text-primary-light dark:text-primary hover:underline">
                        Forgot Password?
                    </button>
                )}
              </div>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-gray-900 dark:text-light-text focus:ring-primary-light dark:focus:ring-primary focus:border-primary-light dark:focus:border-primary"
                placeholder="••••••••"
                required
              />
              {isRegistering && password.length > 0 && (
                <div className="mt-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-text">Strength</span>
                    <span className={`text-xs font-bold ${passwordStrength.textColor}`}>{passwordStrength.label}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full ${passwordStrength.color} transition-all duration-300`}
                      style={{ width: `${(passwordStrength.score / 3) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
            {isRegistering && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-600 dark:text-gray-text">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1 w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-gray-900 dark:text-light-text focus:ring-primary-light dark:focus:ring-primary focus:border-primary-light dark:focus:border-primary"
                  placeholder="••••••••"
                  required
                />
              </div>
            )}
          </div>
          {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
          <div className="mt-6">
            <button
              type="submit"
              className="w-full bg-primary-light dark:bg-primary text-white dark:text-secondary font-bold py-2 rounded-md transition-opacity hover:bg-opacity-90"
            >
              {isRegistering ? 'Register' : 'Login'}
            </button>
          </div>
          <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-text">
            {isRegistering ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button type="button" onClick={handleToggleMode} className="font-medium text-primary-light dark:text-primary hover:underline">
              {isRegistering ? 'Login' : 'Register'}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;