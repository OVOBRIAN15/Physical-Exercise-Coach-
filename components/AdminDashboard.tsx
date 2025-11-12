


import React, { useState } from 'react';
import { User, PlanTier, PaymentVerificationRequest, VerificationStatus } from '../types';
import { PLANS } from '../constants';
import EditUserModal from './EditUserModal';
import { PencilIcon, TrashIcon, EnvelopeIcon, SearchIcon, EyeIcon, CheckIcon, XCircleIcon } from './Icons';
import AdminStats from './AdminStats';

interface AdminDashboardProps {
  users: User[];
  verificationRequests: PaymentVerificationRequest[];
  onUpdateUser: (user: User) => void;
  onDeleteUser: (userId: string) => void;
  onSendReminders: () => void;
  onApprovePayment: (requestId: string) => void;
  onRejectPayment: (requestId: string, reason: string) => void;
}

const ITEMS_PER_PAGE = 8;

const VerificationQueue: React.FC<{
    requests: PaymentVerificationRequest[];
    onApprove: (id: string) => void;
    onReject: (id: string, reason: string) => void;
}> = ({ requests, onApprove, onReject }) => {
    const pendingRequests = requests.filter(r => r.status === VerificationStatus.PENDING);
    
    if (pendingRequests.length === 0) {
        return null;
    }
    
    const handleRejectClick = (requestId: string) => {
        const reason = window.prompt("Please provide a reason for rejecting this payment (this will be shown to the user):");
        if (reason) { // Only proceed if the admin provides a reason (doesn't click cancel or leave it empty)
            onReject(requestId, reason);
        }
    };

    return (
        <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-light-text mb-4">Payment Verification Queue ({pendingRequests.length})</h2>
            <div className="bg-white dark:bg-light-bg rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-800">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">User</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Plan</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Transaction ID</th>
                            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Proof</th>
                            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                        {pendingRequests.map(req => (
                            <tr key={req.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{req.submissionDate}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-light-text">
                                    <div>{req.userName}</div>
                                    <div className="text-xs text-gray-500">{req.userEmail}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{req.planTier}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300 font-mono">{req.transactionId}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                    <button onClick={() => alert(`Showing proof for transaction ${req.transactionId}:\n\nFile: ${req.screenshotProof}\n\n(This is a simulation)`)} className="text-primary-light dark:text-primary hover:opacity-80" aria-label="View proof">
                                        <EyeIcon />
                                    </button>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                    <div className="flex items-center justify-center space-x-2">
                                        <button onClick={() => handleRejectClick(req.id)} className="p-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-full" aria-label="Reject payment"><XCircleIcon className="w-5 h-5"/></button>
                                        <button onClick={() => onApprove(req.id)} className="p-2 bg-green-100 text-green-700 hover:bg-green-200 rounded-full" aria-label="Approve payment"><CheckIcon className="w-5 h-5"/></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const AdminDashboard: React.FC<AdminDashboardProps> = ({ users, verificationRequests, onUpdateUser, onDeleteUser, onSendReminders, onApprovePayment, onRejectPayment }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Calculate stats
  const totalUsers = users.length;
  const activeSubscriptions = users.filter(u => u.subscription?.status === 'active').length;
  
  const monthlyRevenue = users.reduce((total, user) => {
    if (user.subscription?.status === 'active') {
        const planDetails = PLANS.find(p => p.tier === user.subscription!.plan);
        if (planDetails && planDetails.tier !== PlanTier.LIFETIME) {
            return total + planDetails.price;
        }
    }
    return total;
  }, 0);

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentUsers = filteredUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  const handleEditClick = (user: User) => {
    setEditingUser(user);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      onDeleteUser(userId);
    }
  };

  const handleSaveUser = (updatedUser: User) => {
    onUpdateUser(updatedUser);
    setIsEditModalOpen(false);
    setEditingUser(null);
  };

  return (
    <>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-8 gap-4">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-light-text">Admin Dashboard</h1>
            <button
                onClick={onSendReminders}
                className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium bg-white dark:bg-secondary text-primary-light dark:text-primary border border-primary-light dark:border-primary rounded-md hover:bg-gray-100 dark:hover:bg-light-bg transition-colors"
            >
                <EnvelopeIcon />
                Send 7-Day Renewal Reminders
            </button>
        </div>
        
        <VerificationQueue requests={verificationRequests} onApprove={onApprovePayment} onReject={onRejectPayment} />
        
        <AdminStats 
            totalUsers={totalUsers}
            activeSubscriptions={activeSubscriptions}
            monthlyRevenue={monthlyRevenue}
        />

        <div className="mb-6">
            <label htmlFor="user-search" className="sr-only">Search users by email</label>
            <div className="relative w-full max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    id="user-search"
                    placeholder="Search by user email..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md pl-10 pr-4 py-2 text-gray-900 dark:text-light-text focus:ring-primary-light dark:focus:ring-primary focus:border-primary-light dark:focus:border-primary"
                />
            </div>
        </div>

        <div className="bg-white dark:bg-light-bg rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-800">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Plan</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Renewal</th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                {currentUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-light-text">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{user.subscription?.plan || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.subscription ? (
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.subscription.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}`}>
                          {user.subscription.status}
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                          No Subscription
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{user.subscription?.renewalDate || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <div className="flex items-center justify-center space-x-4">
                        <button onClick={() => handleEditClick(user)} className="text-primary-light dark:text-primary hover:opacity-80" aria-label={`Edit user ${user.email}`}>
                          <PencilIcon />
                        </button>
                        <button onClick={() => handleDeleteClick(user.id)} className="text-red-500 hover:text-red-400" aria-label={`Delete user ${user.email}`}>
                          <TrashIcon />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 rounded-md disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-700"
            >
              Previous
            </button>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 rounded-md disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-700"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {isEditModalOpen && editingUser && (
        <EditUserModal
          user={editingUser}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleSaveUser}
        />
      )}
    </>
  );
};

export default AdminDashboard;