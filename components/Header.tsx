
import React from 'react';
import { User } from '../types';
import { UserCircleIcon, SunIcon, MoonIcon, HomeIcon, SparklesIcon, TagIcon, BookOpenIcon } from './Icons';

interface HeaderProps {
  user: User | null;
  page: string;
  onLoginClick: () => void;
  onLogoutClick: () => void;
  onDashboardClick: () => void;
  onHomeClick: () => void;
  onGeneratorClick: () => void;
  onPricingClick: () => void;
  onBooksClick: () => void;
  theme: string;
  onThemeToggle: () => void;
  isAdmin: boolean;
}

const Header: React.FC<HeaderProps> = ({ user, page, onLoginClick, onLogoutClick, onDashboardClick, onHomeClick, onGeneratorClick, onPricingClick, onBooksClick, theme, onThemeToggle, isAdmin }) => {
  const navLinkClasses = "group px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-light dark:hover:text-primary transition-colors flex items-center gap-2 rounded-md";
  const activeLinkClasses = "bg-gray-100 dark:bg-gray-800 text-primary-light dark:text-primary";
  
  return (
    <header className={`bg-white/80 dark:bg-light-bg/80 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800 ${isAdmin ? 'border-b-4 border-red-500' : ''}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <button onClick={onHomeClick} className="text-2xl font-bold text-primary-light dark:text-primary focus:outline-none">
                AI Fitness Coach {isAdmin && <span className="text-red-500 text-sm font-semibold align-middle">[ADMIN]</span>}
            </button>
            {!isAdmin && (
                <nav className="hidden sm:flex items-center space-x-2">
                    <button onClick={onHomeClick} className={`${navLinkClasses} ${page === 'home' ? activeLinkClasses : ''}`}>
                        <HomeIcon className="w-5 h-5" />
                        Home
                    </button>
                    <button onClick={onGeneratorClick} className={`${navLinkClasses} ${page === 'generator' ? activeLinkClasses : ''}`}>
                        <SparklesIcon className="w-5 h-5" />
                        Generator
                    </button>
                    <button onClick={onPricingClick} className={`${navLinkClasses} ${page === 'pricing' ? activeLinkClasses : ''}`}>
                        <TagIcon className="w-5 h-5" />
                        Pricing
                    </button>
                    <button onClick={onBooksClick} className={`${navLinkClasses} ${page === 'books' ? activeLinkClasses : ''}`}>
                        <BookOpenIcon className="w-5 h-5" />
                        Books
                    </button>
                </nav>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={onThemeToggle}
              className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <SunIcon className="w-6 h-6" /> : <MoonIcon className="w-6 h-6" />}
            </button>
            {user ? (
              <>
                <button onClick={onDashboardClick} className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-light dark:hover:text-primary transition-colors">
                    <UserCircleIcon className="w-5 h-5"/>
                    <span>{isAdmin ? 'Admin Panel' : 'My Account'}</span>
                </button>
                <button onClick={onLogoutClick} className="px-3 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors">
                  Logout
                </button>
              </>
            ) : (
              <button onClick={onLoginClick} className="px-4 py-2 text-sm font-medium text-white dark:text-secondary bg-primary-light dark:bg-primary hover:bg-opacity-90 rounded-md transition-all">
                Login / Register
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
