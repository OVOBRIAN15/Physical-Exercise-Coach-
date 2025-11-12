
import React, { useState, useEffect } from 'react';
import { User, UserRole, PlanTier } from '../types';

interface EditUserModalProps {
  user: User;
  onClose: () => void;
  onSave: (user: User) => void;
}

const EditUserModal: React.FC<EditUserModalProps> = ({ user, onClose, onSave }) => {
  const [formData, setFormData] = useState<User>(user);
  
  useEffect(() => {
    setFormData(user);
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('subscription.')) {
        const subField = name.split('.')[1];
        setFormData(prev => ({
            ...prev,
            subscription: {
                ...prev.subscription,
                plan: prev.subscription?.plan || PlanTier.BASIC,
                renewalDate: prev.subscription?.renewalDate || '',
                status: prev.subscription?.status || 'active',
                [subField]: value,
            },
        }));
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handlePlanChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    if (value === 'None') {
        const { subscription, ...rest } = formData;
        setFormData(rest);
    } else {
        const isLifetime = value === PlanTier.LIFETIME;
        setFormData(prev => ({
            ...prev,
            subscription: {
                ...prev.subscription,
                plan: value as PlanTier,
                status: 'active',
                renewalDate: isLifetime ? 'Never' : (prev.subscription?.renewalDate || new Date().toISOString().split('T')[0])
            }
        }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-light-bg rounded-lg shadow-xl w-full max-w-md p-6 sm:p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-light-text">Edit User</h2>
          <button onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white text-2xl">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-600 dark:text-gray-text">Email</label>
            <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} className="mt-1 w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-gray-900 dark:text-light-text focus:ring-primary-light dark:focus:ring-primary focus:border-primary-light dark:focus:border-primary" />
          </div>
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-600 dark:text-gray-text">Role</label>
            <select name="role" id="role" value={formData.role} onChange={handleChange} className="mt-1 w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-gray-900 dark:text-light-text focus:ring-primary-light dark:focus:ring-primary focus:border-primary-light dark:focus:border-primary">
              {Object.values(UserRole).map(role => <option key={role} value={role}>{role}</option>)}
            </select>
          </div>
          <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
             <h3 className="text-lg font-semibold text-gray-900 dark:text-light-text mb-2">Subscription</h3>
             <div>
                <label htmlFor="subscription.plan" className="block text-sm font-medium text-gray-600 dark:text-gray-text">Plan</label>
                <select name="subscription.plan" id="subscription.plan" value={formData.subscription?.plan || 'None'} onChange={handlePlanChange} className="mt-1 w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-gray-900 dark:text-light-text focus:ring-primary-light dark:focus:ring-primary focus:border-primary-light dark:focus:border-primary">
                    <option value="None">None</option>
                    {Object.values(PlanTier).map(tier => <option key={tier} value={tier}>{tier}</option>)}
                </select>
             </div>
             {formData.subscription && formData.subscription.plan !== PlanTier.LIFETIME && (
                <>
                    <div className="mt-4">
                        <label htmlFor="subscription.status" className="block text-sm font-medium text-gray-600 dark:text-gray-text">Status</label>
                        <select name="subscription.status" id="subscription.status" value={formData.subscription.status} onChange={handleChange} className="mt-1 w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-gray-900 dark:text-light-text focus:ring-primary-light dark:focus:ring-primary focus:border-primary-light dark:focus:border-primary">
                            <option value="active">Active</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                    <div className="mt-4">
                        <label htmlFor="subscription.renewalDate" className="block text-sm font-medium text-gray-600 dark:text-gray-text">Renewal Date</label>
                        <input type="date" name="subscription.renewalDate" id="subscription.renewalDate" value={formData.subscription.renewalDate} onChange={handleChange} className="mt-1 w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-gray-900 dark:text-light-text focus:ring-primary-light dark:focus:ring-primary focus:border-primary-light dark:focus:border-primary" />
                    </div>
                </>
             )}
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-md text-gray-800 dark:text-light-text">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium bg-primary-light dark:bg-primary text-white dark:text-secondary hover:bg-opacity-90 rounded-md">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;