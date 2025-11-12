
import React, { useState } from 'react';
import { Book } from '../types';
import Spinner from './Spinner';
import { CheckIcon, XCircleIcon, InfoCircleIcon } from './Icons';

interface BookPaymentModalProps {
  book: Book;
  onClose: () => void;
  onConfirm: (book: Book) => void;
}

const BookPaymentModal: React.FC<BookPaymentModalProps> = ({ book, onClose, onConfirm }) => {
  const [step, setStep] = useState(0); // 0: confirmation, 1: phone, 2: processing, 3: success, 4: failure
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');

  const handlePay = () => {
    if (!/^\+\d{10,15}$/.test(phoneNumber)) {
      setError('Please enter a valid phone number with country code (e.g., +256701234567).');
      return;
    }
    setError('');
    setStep(2); // Move to processing
    
    // Simulate API call and user action
    setTimeout(() => {
        const isSuccess = Math.random() > 0.1; // 90% success rate
        if (isSuccess) {
            setStep(3); // Success
            setTimeout(() => {
                onConfirm(book);
            }, 1500);
        } else {
            setStep(4); // Failure
        }
    }, 3000);
  };

  const renderContent = () => {
    switch(step) {
        case 0: // Confirmation
            return (
              <div className="text-center space-y-6">
                <p className="text-gray-600 dark:text-gray-text">Please review your purchase before proceeding.</p>
                <div className="flex justify-center gap-4">
                  <button onClick={onClose} className="w-full px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-light-text font-bold rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                    Cancel
                  </button>
                  <button onClick={() => setStep(1)} className="w-full bg-primary-light dark:bg-primary text-white dark:text-secondary font-bold py-3 rounded-md hover:bg-opacity-90 transition-colors">
                    Confirm & Proceed
                  </button>
                </div>
              </div>
            );
        case 1: // Phone number
            return (
                <div className="space-y-4">
                    <p className="text-gray-600 dark:text-gray-text">Enter your mobile money phone number to initiate the payment.</p>
                    <div>
                        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-600 dark:text-gray-text mb-2">Phone Number</label>
                        <input
                            type="tel"
                            id="phoneNumber"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-gray-900 dark:text-light-text focus:ring-primary-light dark:focus:ring-primary focus:border-primary-light dark:focus:border-primary"
                            placeholder="+256701234567"
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <button
                        onClick={handlePay}
                        disabled={step !== 1}
                        className="w-full bg-primary-light dark:bg-primary text-white dark:text-secondary font-bold py-3 rounded-md flex items-center justify-center transition-opacity hover:bg-opacity-90 disabled:opacity-50"
                    >
                       Pay ${book.price}
                    </button>
                </div>
            );
        case 2:
            return (
                <div className="text-center space-y-4 py-8">
                    <Spinner size="lg"/>
                    <p className="font-semibold text-gray-800 dark:text-light-text">Awaiting Payment Confirmation</p>
                    <p className="text-gray-600 dark:text-gray-text">A payment request for <span className="font-bold">${book.price}</span> has been sent to <span className="font-bold">{phoneNumber}</span>. Please approve the transaction on your phone by entering your PIN.</p>
                </div>
            );
        case 3:
            return (
                <div className="text-center space-y-4 py-8">
                    <CheckIcon className="w-16 h-16 text-green-500 mx-auto" />
                    <p className="text-xl font-bold text-gray-800 dark:text-light-text">Purchase Successful!</p>
                    <p className="text-gray-600 dark:text-gray-text">You can now read "{book.title}". Redirecting...</p>
                </div>
            );
        case 4:
            return (
                <div className="text-center space-y-4 py-8">
                    <XCircleIcon className="w-16 h-16 text-red-500 mx-auto" />
                    <p className="text-xl font-bold text-gray-800 dark:text-light-text">Payment Failed</p>
                    <p className="text-gray-600 dark:text-gray-text">The transaction could not be completed. Please check your balance and try again.</p>
                    <div className="pt-4">
                        <button onClick={() => setStep(1)} className="w-full bg-primary-light dark:bg-primary text-white dark:text-secondary font-bold py-3 rounded-md">
                            Try Again
                        </button>
                    </div>
                </div>
            );
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-light-bg rounded-lg shadow-xl w-full max-w-md p-6 sm:p-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-light-text">Purchase Book</h2>
          <button onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white">&times;</button>
        </div>

        <div>
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-6 text-center">
                <p className="text-lg">You are purchasing <span className="font-bold text-primary-light dark:text-primary">"{book.title}"</span></p>
                <p className="text-3xl font-bold text-gray-900 dark:text-light-text mt-1">${book.price.toLocaleString('en-US')}</p>
            </div>
             {step < 2 && (
                <div className="bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300 p-3 rounded-lg text-sm text-center mb-6 flex items-center justify-center gap-2">
                    <InfoCircleIcon className="w-5 h-5 flex-shrink-0" />
                    <p><strong>Payment Simulation:</strong> No real money will be charged.</p>
                </div>
             )}
            {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default BookPaymentModal;
