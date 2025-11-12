

import React, { useState } from 'react';
// FIX: Import the 'User' type to resolve a TypeScript error.
import { Plan, User } from '../types';
import Spinner from './Spinner';
import { InfoCircleIcon, UploadIcon, CheckIcon } from './Icons';

interface PaymentModalProps {
  plan: Plan | null;
  onClose: () => void;
  onConfirm: (plan: Plan, details: {
    fullName: string;
    phoneNumber: string;
    transactionId: string;
    proofFileName: string;
  }) => void;
  user: User | null;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ plan, onClose, onConfirm, user }) => {
  const [view, setView] = useState<'instructions' | 'form' | 'submitted'>('instructions');
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    phoneNumber: '',
    transactionId: '',
  });
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!plan) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProofFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!formData.fullName || !formData.phoneNumber || !formData.transactionId || !proofFile) {
      setError('Please fill out all fields and upload proof of payment.');
      return;
    }
    
    setIsSubmitting(true);
    // Simulate submission
    setTimeout(() => {
        onConfirm(plan, {
            ...formData,
            proofFileName: proofFile.name,
        });
        setIsSubmitting(false);
        setView('submitted');
    }, 1500);
  };

  const renderContent = () => {
    switch(view) {
        case 'instructions':
            return (
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-light-text mb-2">Step 1: Send Payment</h3>
                        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg space-y-2 text-gray-700 dark:text-gray-300">
                            <p><strong>Pay via Mobile Money to:</strong></p>
                            <p className="font-mono text-lg font-bold text-primary-light dark:text-primary">+256 704699385</p>
                            <p><strong>Account Name:</strong> AI Fitness Coach</p>
                            <p><strong>Amount:</strong> ${plan.price}</p>
                            <p><strong>Reference / Reason:</strong> <br/> <code className="bg-gray-200 dark:bg-gray-700 p-1 rounded text-sm">{user?.email?.split('@')[0] || 'YOUR_USERNAME'} + {plan.tier}</code></p>
                        </div>
                    </div>
                     <button onClick={() => setView('form')} className="w-full bg-primary-light dark:bg-primary text-white dark:text-secondary font-bold py-3 rounded-md hover:bg-opacity-90 transition-colors">
                        I've Paid, Submit My Details
                    </button>
                </div>
            );
        case 'form':
            return (
                <form onSubmit={handleSubmit} className="space-y-4">
                     <h3 className="text-lg font-semibold text-gray-800 dark:text-light-text">Step 2: Submit for Verification</h3>
                     <div>
                        <label htmlFor="fullName" className="block text-sm font-medium text-gray-600 dark:text-gray-text">Full Name</label>
                        <input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleInputChange} className="mt-1 w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-gray-900 dark:text-light-text" placeholder="e.g., Jane Doe" required />
                     </div>
                     <div>
                        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-600 dark:text-gray-text">Phone Number Used</label>
                        <input type="tel" id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} className="mt-1 w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-gray-900 dark:text-light-text" placeholder="e.g., +256704699385" required />
                     </div>
                     <div>
                        <label htmlFor="transactionId" className="block text-sm font-medium text-gray-600 dark:text-gray-text">Transaction Reference ID</label>
                        <input type="text" id="transactionId" name="transactionId" value={formData.transactionId} onChange={handleInputChange} className="mt-1 w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-gray-900 dark:text-light-text" placeholder="e.g., 123456789" required />
                     </div>
                     <div>
                         <label htmlFor="proof" className="block text-sm font-medium text-gray-600 dark:text-gray-text">Upload Screenshot/Proof</label>
                         <label htmlFor="proof" className="mt-1 w-full bg-gray-100 dark:bg-gray-800 border border-dashed border-gray-300 dark:border-gray-600 rounded-md px-3 py-4 text-gray-500 dark:text-gray-400 flex items-center justify-center cursor-pointer hover:border-primary-light dark:hover:border-primary">
                             <UploadIcon className="w-6 h-6 mr-2" />
                             <span>{proofFile ? proofFile.name : 'Click to upload proof'}</span>
                         </label>
                         <input type="file" id="proof" onChange={handleFileChange} className="hidden" accept="image/*,.pdf" required />
                     </div>
                     {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                     <div className="flex gap-4 pt-2">
                        <button type="button" onClick={() => setView('instructions')} className="w-full px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-light-text font-bold rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                            &larr; Back
                        </button>
                        <button type="submit" disabled={isSubmitting} className="w-full bg-primary-light dark:bg-primary text-white dark:text-secondary font-bold py-3 rounded-md hover:bg-opacity-90 transition-colors flex justify-center items-center">
                            {isSubmitting ? <Spinner size="sm"/> : 'Submit for Verification'}
                        </button>
                    </div>
                </form>
            );
        case 'submitted':
            return (
                 <div className="text-center space-y-4 py-8">
                    <CheckIcon className="w-16 h-16 text-green-500 mx-auto" />
                    <p className="text-xl font-bold text-gray-800 dark:text-light-text">Submission Received!</p>
                    <p className="text-gray-600 dark:text-gray-text">Your payment is now pending verification. An admin will review it shortly. You can check your account dashboard for status updates.</p>
                    <div className="pt-4">
                    <button onClick={onClose} className="w-full bg-primary-light dark:bg-primary text-white dark:text-secondary font-bold py-3 rounded-md">
                        Done
                    </button>
                    </div>
                </div>
            )
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-light-bg rounded-lg shadow-xl w-full max-w-lg p-6 sm:p-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-light-text">Manual Payment</h2>
          {view !== 'submitted' && <button onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white">&times;</button>}
        </div>
        <div>
          <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg mb-6 text-center">
             <p className="text-lg">You are subscribing to the <span className="font-bold text-primary-light dark:text-primary">{plan.tier}</span> plan.</p>
             <p className="text-3xl font-bold text-gray-900 dark:text-light-text mt-1">${plan.price.toLocaleString('en-US')}</p>
          </div>
          { view !== 'submitted' && (
            <div className="bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300 p-3 rounded-lg text-sm text-center mb-6 flex items-center justify-center gap-2">
                <InfoCircleIcon className="w-5 h-5 flex-shrink-0" />
                <p><strong>Payment Simulation:</strong> This is a manual payment simulation.</p>
            </div>
          )}
          
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;