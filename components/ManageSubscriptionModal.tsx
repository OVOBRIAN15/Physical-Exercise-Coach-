
import React from 'react';
import { Plan, User, PlanTier } from '../types';
import { CheckIcon } from './Icons';

interface ManageSubscriptionModalProps {
  user: User;
  plan: Plan;
  onClose: () => void;
  onCancelSubscription: () => void;
  onUpdatePlan: () => void;
}

const ManageSubscriptionModal: React.FC<ManageSubscriptionModalProps> = ({ user, plan, onClose, onCancelSubscription, onUpdatePlan }) => {
  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel your subscription? This action cannot be undone.')) {
      onCancelSubscription();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-light-bg rounded-lg shadow-xl w-full max-w-lg p-6 sm:p-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-light-text">Manage Subscription</h2>
            <p className="text-gray-600 dark:text-gray-text mt-1">Plan: <span className="font-semibold text-primary-light dark:text-primary">{plan.tier}</span></p>
          </div>
          <button onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white text-2xl leading-none">&times;</button>
        </div>

        <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-light-text mb-4">Plan Features:</h3>
          <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-text">
            {plan.features.map((feature, i) => (
              <li key={i} className="flex items-start">
                <CheckIcon className="w-5 h-5 mr-3 text-primary-light dark:text-primary flex-shrink-0 mt-0.5" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
        
        {user.subscription?.status === 'active' && user.subscription.plan !== PlanTier.LIFETIME && (
            <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-light-text mb-4">Actions</h3>
            <div className="flex flex-col sm:flex-row gap-4">
                <button
                    onClick={onUpdatePlan}
                    className="w-full px-4 py-2 font-medium bg-primary-light dark:bg-primary text-white dark:text-secondary hover:bg-opacity-90 rounded-md transition-colors text-center"
                >
                    Upgrade/Downgrade Plan
                </button>
                <button
                    onClick={handleCancel}
                    className="w-full px-4 py-2 font-medium bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors text-center"
                >
                    Cancel Subscription
                </button>
            </div>
            </div>
        )}

        {user.subscription?.status === 'active' && user.subscription.plan === PlanTier.LIFETIME && (
             <div className="mt-6 text-center bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 p-4 rounded-lg">
                <p>You have Lifetime access. Enjoy your premium features forever! ✨</p>
            </div>
        )}

        {user.subscription?.status === 'cancelled' && (
            <div className="mt-6 text-center bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300 p-4 rounded-lg">
                <p>Your subscription is cancelled and will not renew on {user.subscription.renewalDate}.</p>
                <button onClick={onUpdatePlan} className="mt-4 font-semibold text-primary-light dark:text-primary hover:underline">Re-subscribe</button>
            </div>
        )}

        <div className="mt-8 text-center">
            <button
                onClick={onClose}
                className="px-6 py-2 text-sm font-medium bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-light-text hover:bg-gray-300 dark:hover:bg-gray-600 rounded-md"
            >
                Done
            </button>
        </div>
      </div>
    </div>
  );
};

export default ManageSubscriptionModal;