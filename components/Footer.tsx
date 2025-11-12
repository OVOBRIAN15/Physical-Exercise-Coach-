
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-light-bg border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm text-gray-500 dark:text-gray-400">&copy; {new Date().getFullYear()} AI Fitness Coach. All rights reserved.</p>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-primary-light dark:hover:text-primary transition-colors">Facebook</a>
            <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-primary-light dark:hover:text-primary transition-colors">Twitter</a>
            <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-primary-light dark:hover:text-primary transition-colors">Instagram</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;