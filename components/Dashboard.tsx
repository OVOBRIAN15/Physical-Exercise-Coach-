



import React, { useState, useEffect } from 'react';
import { User, PlanHistoryItem, ProgressEntry, PaymentVerificationRequest, VerificationStatus } from '../types';
import WorkoutGenerator from './WorkoutGenerator';
import { ProgressTracker } from '../ProgressTracker';
import { ClockIcon, SparklesIcon, ChartBarIcon, PencilIcon, UserCircleIcon, ShieldCheckIcon, ReceiptIcon, InfoCircleIcon, XCircleIcon } from './Icons';
import MarkdownRenderer from '../services/MarkdownRenderer';
import ProfileSection from './ProfileSection';
import DailyTipCard from './DailyTipCard';
import PaymentHistory from './PaymentHistory';

interface DashboardProps {
  mode: 'generator' | 'progress';
  user: User | null;
  planHistory: PlanHistoryItem[];
  pendingRequest: PaymentVerificationRequest | null;
  onSavePlan: (prompt: string, plan: string) => void;
  onUpdatePlan: (planId: string, newContent: string) => void;
  onLogProgress: (entry: ProgressEntry) => void;
  onUpdateProfile: (updatedData: Partial<User>) => void;
  onChoosePlanClick: () => void;
  onManageSubscriptionClick: () => void;
  onLoginClick: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ mode, user, planHistory, pendingRequest, onSavePlan, onUpdatePlan, onLogProgress, onUpdateProfile, onChoosePlanClick, onManageSubscriptionClick, onLoginClick }) => {
  const [activePlan, setActivePlan] = useState<PlanHistoryItem | null>(null);
  const [isEditingPlan, setIsEditingPlan] = useState(false);
  const [editedPlanContent, setEditedPlanContent] = useState('');
  const [justGenerated, setJustGenerated] = useState(false);
  const [guestPlan, setGuestPlan] = useState<{ prompt: string; plan: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'progress' | 'subscription' | 'profile' | 'payment'>('progress');

  const isGuest = !user;
  const hasSubscription = !!user?.subscription && user.subscription.status === 'active';

  const handlePlanGenerated = (prompt: string, plan: string) => {
    if (isGuest) {
      setGuestPlan({ prompt, plan });
      setActivePlan(null);
    } else {
      onSavePlan(prompt, plan);
      setActivePlan(null);
      setIsEditingPlan(false);
      setJustGenerated(true);
    }
  };
  
  useEffect(() => {
    if (justGenerated && planHistory.length > 0 && planHistory[0].id !== activePlan?.id) {
      setActivePlan(planHistory[0]);
      setJustGenerated(false);
    }
  }, [planHistory, justGenerated, activePlan]);
  
  useEffect(() => {
    // Reset guest plan when user logs in or page changes
    setGuestPlan(null);
  }, [user, mode]);

  const handleSaveChanges = () => {
      if (!activePlan || isGuest) return;
      onUpdatePlan(activePlan.id, editedPlanContent);
      setActivePlan(prev => prev ? { ...prev, plan: editedPlanContent } : null);
      setIsEditingPlan(false);
  };

  const renderActivePlan = () => {
    if (!activePlan) return null;
    return (
        <div className="bg-white dark:bg-gray-800/50 p-6 sm:p-8 rounded-xl shadow-lg border border-gray-200 dark:border-transparent">
            <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
                <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-light-text">Your Personalized Plan:</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-text">Generated on: {activePlan.date}</p>
                </div>
                <div className="flex items-center gap-2 sm:gap-4">
                     {!isEditingPlan && hasSubscription && (
                        <button 
                            onClick={() => { setIsEditingPlan(true); setEditedPlanContent(activePlan.plan); }}
                            className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-md text-gray-800 dark:text-light-text"
                        >
                            <PencilIcon className="w-4 h-4" />
                            <span>Edit Plan</span>
                        </button>
                    )}
                    <button 
                        onClick={() => { setActivePlan(null); setIsEditingPlan(false); }}
                        className="px-4 py-2 text-sm bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-md text-gray-800 dark:text-light-text"
                    >
                        &larr; Back to Generator
                    </button>
                </div>
            </div>
            <p className="text-gray-600 dark:text-gray-text mb-4 italic"><strong>Your goal:</strong> "{activePlan.prompt}"</p>
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md border border-gray-200 dark:border-gray-700">
                {isEditingPlan && hasSubscription ? (
                    <div className="space-y-4">
                        <textarea
                            value={editedPlanContent}
                            onChange={(e) => setEditedPlanContent(e.target.value)}
                            className="w-full h-96 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md p-3 text-gray-900 dark:text-light-text focus:ring-primary-light dark:focus:ring-primary focus:border-primary-light dark:focus:border-primary resize-y"
                        />
                        <div className="flex justify-end gap-4">
                            <button onClick={() => setIsEditingPlan(false)} className="px-4 py-2 text-sm font-medium bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-md text-gray-800 dark:text-light-text">Cancel</button>
                            <button onClick={handleSaveChanges} className="px-4 py-2 text-sm font-medium bg-primary-light dark:bg-primary text-white dark:text-secondary hover:bg-opacity-90 rounded-md">Save Changes</button>
                        </div>
                    </div>
                ) : (
                    <>
                        <MarkdownRenderer content={activePlan.plan} />
                        {!hasSubscription && (
                            <div className="mt-6 p-4 bg-primary-light/10 dark:bg-primary/10 rounded-lg text-center">
                                <h4 className="font-semibold text-primary-light dark:text-primary">Upgrade to Edit</h4>
                                <p className="text-sm text-gray-700 dark:text-gray-200 mt-1">Subscribe to a plan to edit and save changes to your generated plans.</p>
                                <button onClick={onChoosePlanClick} className="mt-3 text-sm font-bold text-primary-light dark:text-primary hover:underline">View Plans</button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
  };
  
  const renderGeneratorHistory = () => (
    <>
      <WorkoutGenerator onPlanGenerated={handlePlanGenerated} />
      {!isGuest && planHistory.length > 0 && (
          <div className="mt-8 bg-white dark:bg-gray-800/50 p-6 sm:p-8 rounded-xl shadow-lg border border-gray-200 dark:border-transparent">
              <div className="flex items-center gap-3 mb-4">
                  <ClockIcon className="w-7 h-7 text-primary-light dark:text-primary" />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-light-text">Plan History</h2>
              </div>
              <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                  {planHistory.map(item => (
                      <button 
                        key={item.id} 
                        onClick={() => { setActivePlan(item); setIsEditingPlan(false); }}
                        className="w-full text-left p-4 bg-gray-100 dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                          <p className="font-semibold text-primary-light dark:text-primary">{item.date}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-text truncate mt-1">
                            {item.prompt}
                          </p>
                      </button>
                  ))}
              </div>
          </div>
      )}
    </>
  );

  const renderGuestGeneratorView = () => (
    guestPlan ? (
        <div className="bg-white dark:bg-gray-800/50 p-6 sm:p-8 rounded-xl shadow-lg border border-gray-200 dark:border-transparent space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-light-text">Your Generated Plan:</h3>
            <p className="text-gray-600 dark:text-gray-text italic"><strong>Your goal:</strong> "{guestPlan.prompt}"</p>
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md border border-gray-200 dark:border-gray-700">
                <MarkdownRenderer content={guestPlan.plan} />
            </div>
            <div className="p-6 bg-primary-light/10 dark:bg-primary/10 rounded-lg text-center">
                <h3 className="text-xl font-bold text-primary-light dark:text-primary">Like This Plan?</h3>
                <p className="mt-2 text-gray-700 dark:text-gray-200">Create a free account to save your plan, track your progress, and unlock more features!</p>
                <button onClick={onLoginClick} className="mt-4 px-6 py-3 bg-primary-light dark:bg-primary text-white dark:text-secondary font-semibold rounded-md hover:bg-opacity-90 transition-colors">
                Sign Up to Save & Track
                </button>
            </div>
            <button onClick={() => setGuestPlan(null)} className="!mt-2 w-full text-center py-2 text-sm text-gray-600 dark:text-gray-400 hover:underline">
                &larr; Generate another plan
            </button>
        </div>
    ) : ( <WorkoutGenerator onPlanGenerated={handlePlanGenerated} /> )
  );

  const renderGeneratorContent = () => {
    return isGuest ? renderGuestGeneratorView() : (activePlan ? renderActivePlan() : renderGeneratorHistory());
  };

  const TabButton: React.FC<{
    label: string;
    isActive: boolean;
    onClick: () => void;
    icon: React.ReactNode;
  }> = ({ label, isActive, onClick, icon }) => (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
        isActive
          ? 'bg-primary-light/10 dark:bg-primary/20 text-primary-light dark:text-primary'
          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
      }`}
      aria-current={isActive ? 'page' : undefined}
    >
      {icon}
      {label}
    </button>
  );

  const renderAccountContent = () => {
    if (!user) return null;

    switch (activeTab) {
      case 'progress':
        return hasSubscription ? (
          <ProgressTracker user={user} onLogProgress={onLogProgress} />
        ) : (
          <div className="bg-white dark:bg-gray-800/50 p-6 sm:p-8 rounded-xl shadow-lg h-full flex flex-col items-center justify-center text-center border border-gray-200 dark:border-transparent">
            <ChartBarIcon className="w-12 h-12 text-primary-light dark:text-primary mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-light-text">Track Your Progress</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-text max-w-sm">Subscribe to a plan to log your weight and workout duration and visualize your fitness journey.</p>
            <button onClick={onChoosePlanClick} className="mt-6 px-6 py-3 bg-primary-light dark:bg-primary text-white dark:text-secondary font-semibold rounded-md hover:bg-opacity-90 transition-colors">
              View Plans
            </button>
          </div>
        );
      case 'subscription':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-8">
                {hasSubscription && <DailyTipCard user={user} />}
                <div className="bg-white dark:bg-gray-800/50 p-6 rounded-xl shadow-lg h-full border border-gray-200 dark:border-transparent">
                    <div className="flex items-center gap-3 mb-4">
                        <ShieldCheckIcon className="w-8 h-8 text-primary-light dark:text-primary" />
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-light-text">Subscription</h2>
                    </div>
                    {pendingRequest?.status === VerificationStatus.PENDING && (
                         <div className="mb-6 p-4 bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300 rounded-lg text-sm flex items-center gap-3">
                            <ClockIcon className="w-5 h-5 flex-shrink-0" />
                            <p>Your request to subscribe to the <strong>{pendingRequest.planTier}</strong> plan is currently under review.</p>
                        </div>
                    )}
                    {pendingRequest?.status === VerificationStatus.REJECTED && (
                         <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300 rounded-lg text-sm flex flex-col items-start gap-2">
                            <div className="flex items-center gap-3">
                                <XCircleIcon className="w-5 h-5 flex-shrink-0" />
                                <strong>Your last payment submission was rejected.</strong>
                            </div>
                             {pendingRequest.rejectionReason && (
                                <p className="pl-8">Admin's reason: "{pendingRequest.rejectionReason}"</p>
                             )}
                             <p className="pl-8">Please try subscribing again with the correct information.</p>
                        </div>
                    )}

                    {user.subscription ? (
                    <div className="space-y-3">
                        <p className="text-gray-600 dark:text-gray-text">
                        Plan: <span className="font-semibold text-primary-light dark:text-primary">{user.subscription.plan}</span>
                        </p>
                        <p className="text-gray-600 dark:text-gray-text">
                        Status: <span className={`font-semibold ${user.subscription.status === 'active' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>{user.subscription.status}</span>
                        </p>
                        <p className="text-gray-600 dark:text-gray-text">
                        Renewal Date: <span className="font-semibold text-gray-800 dark:text-light-text">{user.subscription.renewalDate}</span>
                        </p>
                        <div className="pt-4">
                            <button onClick={onManageSubscriptionClick} className="px-4 py-2 text-sm bg-primary-light dark:bg-primary text-white dark:text-secondary font-semibold rounded-md hover:bg-opacity-90 transition-colors w-full">Manage Subscription</button>
                        </div>
                    </div>
                    ) : (
                    <div>
                        <p className="text-gray-600 dark:text-gray-text">You do not have an active subscription.</p>
                        <button onClick={onChoosePlanClick} className="mt-4 px-4 py-2 bg-primary-light dark:bg-primary text-white dark:text-secondary font-semibold rounded-md hover:bg-opacity-90 transition-colors">
                        Choose a Plan
                        </button>
                    </div>
                    )}
                </div>
            </div>
            <div className="bg-white dark:bg-gray-800/50 p-6 rounded-xl shadow-lg h-full border border-gray-200 dark:border-transparent flex flex-col justify-center items-center text-center">
                 <SparklesIcon className="w-12 h-12 text-primary-light dark:text-primary mb-4" />
                 <h2 className="text-2xl font-bold text-gray-900 dark:text-light-text">Need a New Plan?</h2>
                 <p className="mt-2 text-gray-600 dark:text-gray-text max-w-sm">Head over to our AI generator to create a new personalized fitness and nutrition plan based on your current goals.</p>
                 <button onClick={() => {
                    const event = new CustomEvent('navigateToPage', { detail: 'generator' });
                    window.dispatchEvent(event);
                 }} className="mt-6 px-6 py-3 bg-primary-light dark:bg-primary text-white dark:text-secondary font-semibold rounded-md hover:bg-opacity-90 transition-colors">
                     Go to Generator
                 </button>
            </div>
          </div>
        );
      case 'profile':
        return <ProfileSection user={user} onSave={onUpdateProfile} />;
      case 'payment':
        return <PaymentHistory history={user.paymentHistory || []} />;
      default:
        return null;
    }
  };


  const renderProgressContent = () => (
    <div>
      {/* Tab Navigation */}
      <div className="mb-8 border-b border-gray-200 dark:border-gray-700">
        <nav className="flex flex-wrap gap-2" aria-label="Tabs">
          <TabButton
            label="Progress"
            isActive={activeTab === 'progress'}
            onClick={() => setActiveTab('progress')}
            icon={<ChartBarIcon className="w-5 h-5" />}
          />
          <TabButton
            label="Subscription"
            isActive={activeTab === 'subscription'}
            onClick={() => setActiveTab('subscription')}
            icon={<ShieldCheckIcon className="w-5 h-5" />}
          />
          <TabButton
            label="Profile"
            isActive={activeTab === 'profile'}
            onClick={() => setActiveTab('profile')}
            icon={<UserCircleIcon className="w-5 h-5" />}
          />
          <TabButton
            label="Payment History"
            isActive={activeTab === 'payment'}
            onClick={() => setActiveTab('payment')}
            icon={<ReceiptIcon className="w-5 h-5" />}
          />
        </nav>
      </div>

      {/* Tab Content */}
      {renderAccountContent()}
    </div>
  );


  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-light-text mb-8">
        {mode === 'generator' && 'AI Plan Generator'}
        {mode === 'progress' && (isGuest ? 'Dashboard' : `Welcome, ${user.name || user.email.split('@')[0]}!`)}
      </h1>

      {mode === 'generator' && renderGeneratorContent()}
      {mode === 'progress' && (isGuest ? (
          <div className="bg-white dark:bg-gray-800/50 p-6 rounded-xl shadow-lg h-full border border-gray-200 dark:border-transparent flex flex-col justify-center items-center text-center">
            <SparklesIcon className="w-12 h-12 text-primary-light dark:text-primary mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-light-text mb-2">Get Full Access</h2>
            <p className="text-gray-600 dark:text-gray-text mb-4">Sign up to save your plans, track your progress, and get personalized coaching.</p>
            <button onClick={onLoginClick} className="w-full max-w-xs px-4 py-2 bg-primary-light dark:bg-primary text-white dark:text-secondary font-semibold rounded-md hover:bg-opacity-90 transition-colors">
                Login / Register
            </button>
          </div>
      ) : renderProgressContent())}

    </div>
  );
};

export default Dashboard;