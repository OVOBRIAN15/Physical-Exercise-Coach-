
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import PricingSection from './components/PricingSection';
import Footer from './components/Footer';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';
import PaymentModal from './components/PaymentModal';
import ManageSubscriptionModal from './components/ManageSubscriptionModal';
import NotificationToast from './components/NotificationToast';
import { User, Plan, UserRole, PlanHistoryItem, ProgressEntry, Book, PlanTier, PaymentHistoryEntry, PaymentHistoryStatus, PaymentVerificationRequest, VerificationStatus } from './types';
import { PLANS, MOCK_USERS, MOCK_BOOKS } from './constants';
import { sendManualRenewalReminders } from './services/emailService';
import BooksPage from './components/BooksPage';
import BookPaymentModal from './components/BookPaymentModal';
import BookReaderModal from './components/BookReaderModal';
import PlanDetailPage from './components/PlanDetailPage';
import ForgotPasswordModal from './components/ForgotPasswordModal';

interface Notification {
    id: number;
    message: string;
}

type Page = 'home' | 'pricing' | 'generator' | 'progress' | 'admin' | 'books' | 'plan-detail';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [page, setPage] = useState<Page>('home');
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isManageSubscriptionModalOpen, setIsManageSubscriptionModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [detailedPlan, setDetailedPlan] = useState<Plan | null>(null);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [planHistories, setPlanHistories] = useState<{ [userId: string]: PlanHistoryItem[] }>({});
  const [paymentVerificationRequests, setPaymentVerificationRequests] = useState<PaymentVerificationRequest[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isBookPaymentModalOpen, setIsBookPaymentModalOpen] = useState(false);
  const [isBookReaderModalOpen, setIsBookReaderModalOpen] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    const isDark = theme === 'dark';
    
    root.classList.remove(isDark ? 'light' : 'dark');
    root.classList.add(theme);
    
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Custom event listener for navigation from within dashboard
  useEffect(() => {
    const handleNavigate = (event: CustomEvent) => {
      if (event.detail && typeof event.detail === 'string') {
        setPage(event.detail as Page);
      }
    };
    
    window.addEventListener('navigateToPage', handleNavigate as EventListener);
    
    return () => {
      window.removeEventListener('navigateToPage', handleNavigate as EventListener);
    };
  }, []);

  const handleThemeToggle = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };
  
  const addNotification = (message: string) => {
    setNotifications(prev => [...prev, { id: Date.now(), message }]);
  };

  const handleAuth = (email: string, isRegistering: boolean) => {
    const normalizedEmail = email.toLowerCase();
    const existingUser = users.find(u => u.email.toLowerCase() === normalizedEmail);

    let finalUser: User | undefined;

    if (isRegistering) {
      if (existingUser) {
        alert("An account with this email already exists. Please log in.");
        return;
      }
      const newUser: User = {
        id: `user-${Date.now()}`,
        email: email,
        role: UserRole.USER,
      };
      setUsers([...users, newUser]);
      setCurrentUser(newUser);
      finalUser = newUser;
    } else { // Logging in
      if (!existingUser) {
        alert("No account found with this email. Please register first.");
        return;
      }
      setCurrentUser(existingUser);
      finalUser = existingUser;
    }
    
    setIsLoginOpen(false);
    
    // After login, check if a plan was selected before.
    if (selectedPlan) {
        setIsPaymentModalOpen(true);
    } else if (finalUser) {
      if (finalUser.role === UserRole.ADMIN) {
        setPage('admin');
        addNotification("Welcome, Admin! You have full access. ❤️‍🔥");
      } else {
        setPage('generator');
      }
    }
  };


  const handleLogout = () => {
    setCurrentUser(null);
    setPage('home');
  };

  const handleSelectPlan = (plan: Plan) => {
    setDetailedPlan(plan);
    setPage('plan-detail');
  };

  const handleSubscribe = (plan: Plan) => {
    setSelectedPlan(plan); // Set plan before login check
    if (!currentUser) {
      setIsLoginOpen(true);
    } else {
      setIsPaymentModalOpen(true);
    }
  };

  const handlePaymentVerificationSubmit = (plan: Plan, details: { fullName: string; phoneNumber: string; transactionId: string; proofFileName: string; }) => {
    if (!currentUser) return;

    const newRequest: PaymentVerificationRequest = {
        id: `vr-${Date.now()}`,
        userId: currentUser.id,
        userEmail: currentUser.email,
        userName: details.fullName,
        phoneNumber: details.phoneNumber,
        planTier: plan.tier,
        transactionId: details.transactionId,
        screenshotProof: details.proofFileName,
        submissionDate: new Date().toISOString().split('T')[0],
        status: VerificationStatus.PENDING,
    };
    
    setPaymentVerificationRequests(prev => [...prev, newRequest]);
    addNotification('Your payment has been submitted for verification. We will review it shortly. 🫶');
    // The modal will close itself upon successful submission
  };

  const handleApprovePayment = (requestId: string) => {
    const request = paymentVerificationRequests.find(r => r.id === requestId);
    if (!request) return;

    // Update user subscription
    const userToUpdate = users.find(u => u.id === request.userId);
    if (userToUpdate) {
        const plan = PLANS.find(p => p.tier === request.planTier);
        if(plan) {
            const renewalDate = new Date();
            renewalDate.setMonth(renewalDate.getMonth() + 1);

            const newPaymentEntry: PaymentHistoryEntry = {
                id: `pay-${Date.now()}`,
                date: new Date().toISOString().split('T')[0],
                description: `Subscription - ${plan.tier} Plan`,
                amount: plan.price,
                status: PaymentHistoryStatus.PAID,
            };
            
            const updatedUser: User = {
                ...userToUpdate,
                subscription: {
                    plan: plan.tier,
                    status: 'active',
                    renewalDate: plan.tier === 'Lifetime' ? 'Never' : renewalDate.toISOString().split('T')[0],
                },
                paymentHistory: [...(userToUpdate.paymentHistory || []), newPaymentEntry],
            };
            
            if (currentUser?.id === updatedUser.id) {
                setCurrentUser(updatedUser);
            }
            handleUpdateUser(updatedUser);
        }
    }

    // Update request status
    setPaymentVerificationRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: VerificationStatus.APPROVED, actionDate: new Date().toISOString().split('T')[0] } : r));
    addNotification(`✅ Payment from ${request.userEmail} for ${request.planTier} plan approved!`);
  };

  const handleRejectPayment = (requestId: string, reason: string) => {
     const request = paymentVerificationRequests.find(r => r.id === requestId);
     if (!request) return;
     setPaymentVerificationRequests(prev => prev.map(r => 
        r.id === requestId 
        ? { 
            ...r, 
            status: VerificationStatus.REJECTED, 
            actionDate: new Date().toISOString().split('T')[0],
            rejectionReason: reason 
          } 
        : r
    ));
     addNotification(`❌ Payment from ${request.userEmail} rejected.`);
  };

  
  const handleBuyBook = (book: Book) => {
    if (!currentUser) {
        setIsLoginOpen(true);
        addNotification("Please log in to purchase a book.");
    } else {
        setSelectedBook(book);
        setIsBookPaymentModalOpen(true);
    }
  };
    
  const handleReadBook = (book: Book) => {
      setSelectedBook(book);
      setIsBookReaderModalOpen(true);
  };
  
  const handleConfirmBookPayment = (book: Book) => {
      if (!currentUser) return;

      const newPaymentEntry: PaymentHistoryEntry = {
        id: `pay-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        description: `Book Purchase - ${book.title}`,
        amount: book.price,
        status: PaymentHistoryStatus.PAID,
      };
      
      const updatedUser: User = {
          ...currentUser,
          purchasedBookIds: [...(currentUser.purchasedBookIds || []), book.id],
          paymentHistory: [...(currentUser.paymentHistory || []), newPaymentEntry],
      };
      
      setCurrentUser(updatedUser);
      handleUpdateUser(updatedUser);
      
      setIsBookPaymentModalOpen(false);
      addNotification(`You have successfully purchased "${book.title}"! You can read it now. ❤️‍🔥`);
      handleReadBook(book);
  };

  const handleCancelSubscription = () => {
    if (!currentUser || !currentUser.subscription) return;
    
    const updatedUser: User = {
        ...currentUser,
        subscription: {
            ...currentUser.subscription,
            status: 'cancelled',
        }
    };
    setCurrentUser(updatedUser);
    handleUpdateUser(updatedUser);
    setIsManageSubscriptionModalOpen(false);
  };
  
  const handleUpdateUser = (updatedUser: User) => {
    setUsers(users.map(u => (u.id === updatedUser.id ? updatedUser : u)));
  };

  const handleUpdateProfile = (updatedData: Partial<User>) => {
    if (!currentUser) return;

    const updatedUser = { ...currentUser, ...updatedData };
    
    setCurrentUser(updatedUser);
    handleUpdateUser(updatedUser);
    addNotification('Profile updated successfully! ❤️‍🔥');
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter(u => u.id !== userId));
  };

  const handleSavePlanToHistory = (userId: string, prompt: string, plan: string) => {
    const newHistoryItem: PlanHistoryItem = {
      id: `plan-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      prompt,
      plan,
    };
    setPlanHistories(prev => ({
      ...prev,
      [userId]: [newHistoryItem, ...(prev[userId] || [])],
    }));
  };

  const handleUpdatePlanInHistory = (userId: string, planId: string, newPlanContent: string) => {
    setPlanHistories(prev => {
      const userHistory = prev[userId] || [];
      const updatedHistory = userHistory.map(item =>
        item.id === planId ? { ...item, plan: newPlanContent } : item
      );
      return { ...prev, [userId]: updatedHistory };
    });
  };
  
  const handleLogProgress = (userId: string, entry: ProgressEntry) => {
    const updateProgress = (progress: ProgressEntry[] | undefined): ProgressEntry[] => {
      const existingEntries = progress || [];
      const filteredEntries = existingEntries.filter(p => p.date !== entry.date);
      const newProgress = [...filteredEntries, entry];
      return newProgress.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    };

    setUsers(users.map(u => {
      if (u.id === userId) {
        return { ...u, progress: updateProgress(u.progress) };
      }
      return u;
    }));

    if (currentUser?.id === userId) {
      setCurrentUser(prevUser => {
        if (!prevUser) return null;
        return {
          ...prevUser,
          progress: updateProgress(prevUser.progress),
        };
      });
    }
    
    addNotification('Your progress has been successfully logged!');
  };

  const handleSendManualReminders = () => {
    const reminderMessages = sendManualRenewalReminders(users);
    const newNotifications = reminderMessages.map((message, index) => ({
        id: Date.now() + index,
        message,
    }));
    setNotifications(prev => [...prev, ...newNotifications]);
  };
  
  const handleDismissNotification = (id: number) => {
    setNotifications(current => current.filter(n => n.id !== id));
  };

  const handleUpdatePlanFromModal = () => {
    setIsManageSubscriptionModalOpen(false);
    setPage('pricing');
  };

  const handleDashboardClick = () => {
    if (currentUser?.role === UserRole.ADMIN) {
      setPage('admin');
    } else {
      setPage('progress');
    }
  };

  const handleNavigateToBooks = () => {
    if (!currentUser) {
      setIsLoginOpen(true);
      addNotification("Please log in to access the book library.");
      return;
    }
    if (currentUser.subscription?.status !== 'active') {
      addNotification("The book library is a premium feature. Please subscribe to a plan to get access. 🫶");
      setPage('pricing');
      return;
    }
    setPage('books');
  };

  const handleForgotPasswordClick = () => {
    setIsLoginOpen(false);
    setIsForgotPasswordModalOpen(true);
  };
  
  const handleSendResetLink = (email: string) => {
    // Simulate checking if the user exists and sending an email
    addNotification(`If an account exists for ${email}, a password reset link has been sent.`);
    setIsForgotPasswordModalOpen(false);
  };

  const renderContent = () => {
    const lastUserRequest = currentUser ? [...paymentVerificationRequests].reverse().find(r => r.userId === currentUser.id) : null;
    const pendingRequest = lastUserRequest && lastUserRequest.status !== VerificationStatus.APPROVED ? lastUserRequest : null;

    switch (page) {
      case 'home':
        return <HeroSection onGeneratorClick={() => setPage('generator')} />;
      case 'pricing':
        return <PricingSection plans={PLANS} onSelectPlan={handleSelectPlan} />;
      case 'plan-detail':
        if (!detailedPlan) {
            setPage('pricing');
            return null;
        }
        return <PlanDetailPage 
            plan={detailedPlan}
            onSubscribe={handleSubscribe}
            onBack={() => { setPage('pricing'); setDetailedPlan(null); }}
        />;
      case 'books':
        return <BooksPage
            books={MOCK_BOOKS}
            user={currentUser}
            onBuyBook={handleBuyBook}
            onReadBook={handleReadBook}
        />;
      case 'generator':
        return <Dashboard 
          mode="generator"
          user={currentUser} 
          planHistory={currentUser ? (planHistories[currentUser.id] || []) : []}
          pendingRequest={null}
          onSavePlan={(prompt, plan) => currentUser && handleSavePlanToHistory(currentUser.id, prompt, plan)}
          onUpdatePlan={(planId, newContent) => currentUser && handleUpdatePlanInHistory(currentUser.id, planId, newContent)}
          onLogProgress={() => {}} // Not used in generator mode
          onUpdateProfile={() => {}}
          onChoosePlanClick={() => setPage('pricing')} 
          onManageSubscriptionClick={() => setIsManageSubscriptionModalOpen(true)}
          onLoginClick={() => setIsLoginOpen(true)}
        />;
      case 'progress':
          if (!currentUser) {
            // Redirect guest to generator page if trying to access progress
            return <Dashboard 
                mode="progress"
                user={null}
                planHistory={[]}
                pendingRequest={null}
                onSavePlan={() => {}}
                onUpdatePlan={() => {}}
                onLogProgress={() => {}}
                onUpdateProfile={() => {}}
                onChoosePlanClick={() => setPage('pricing')}
                onManageSubscriptionClick={() => {}}
                onLoginClick={() => setIsLoginOpen(true)}
             />;
        }
        return <Dashboard 
          mode="progress"
          user={currentUser} 
          planHistory={[]} // Not used in progress mode
          pendingRequest={pendingRequest}
          onSavePlan={() => {}} // Not used
          onUpdatePlan={() => {}} // Not used
          onLogProgress={(entry) => currentUser && handleLogProgress(currentUser.id, entry)}
          onUpdateProfile={handleUpdateProfile}
          onChoosePlanClick={() => setPage('pricing')} 
          onManageSubscriptionClick={() => setIsManageSubscriptionModalOpen(true)}
          onLoginClick={() => setIsLoginOpen(true)}
        />;
      case 'admin':
        if (currentUser?.role !== UserRole.ADMIN) {
            setPage('home');
            return null;
        }
        return <AdminDashboard 
            users={users.filter(u => u.role !== UserRole.ADMIN)} 
            verificationRequests={paymentVerificationRequests}
            onUpdateUser={handleUpdateUser} 
            onDeleteUser={handleDeleteUser} 
            onSendReminders={handleSendManualReminders}
            onApprovePayment={handleApprovePayment}
            onRejectPayment={handleRejectPayment}
        />;
      default:
        return <HeroSection onGeneratorClick={() => setPage('generator')} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-dark-bg transition-colors duration-300">
      <Header 
        user={currentUser} 
        page={page}
        onLoginClick={() => setIsLoginOpen(true)}
        onLogoutClick={handleLogout}
        onDashboardClick={handleDashboardClick}
        onHomeClick={() => setPage('home')}
        onGeneratorClick={() => setPage('generator')}
        onPricingClick={() => setPage('pricing')}
        onBooksClick={handleNavigateToBooks}
        theme={theme}
        onThemeToggle={handleThemeToggle}
        isAdmin={currentUser?.role === UserRole.ADMIN}
      />
      <main className="flex-grow">
        {renderContent()}
      </main>
      <Footer />
      {isLoginOpen && <Login onAuth={handleAuth} onClose={() => { setIsLoginOpen(false); setSelectedPlan(null); }} onForgotPasswordClick={handleForgotPasswordClick} />}
      {isForgotPasswordModalOpen && <ForgotPasswordModal onClose={() => setIsForgotPasswordModalOpen(false)} onSendResetLink={handleSendResetLink} />}
      {isPaymentModalOpen && (
        <PaymentModal 
          plan={selectedPlan} 
          user={currentUser}
          onClose={() => { setIsPaymentModalOpen(false); setSelectedPlan(null); }} 
          onConfirm={handlePaymentVerificationSubmit}
        />
      )}
      {isManageSubscriptionModalOpen && currentUser?.subscription && (
        <ManageSubscriptionModal
            user={currentUser}
            plan={PLANS.find(p => p.tier === currentUser.subscription?.plan)!}
            onClose={() => setIsManageSubscriptionModalOpen(false)}
            onCancelSubscription={handleCancelSubscription}
            onUpdatePlan={handleUpdatePlanFromModal}
        />
      )}
      {isBookPaymentModalOpen && selectedBook && (
        <BookPaymentModal
            book={selectedBook}
            onClose={() => setIsBookPaymentModalOpen(false)}
            onConfirm={handleConfirmBookPayment}
        />
      )}
      {isBookReaderModalOpen && selectedBook && (
          <BookReaderModal
              book={selectedBook}
              onClose={() => setIsBookReaderModalOpen(false)}
          />
      )}

      {/* Notification Toasts Container */}
      <div className="fixed top-20 right-4 z-[100] w-full max-w-sm space-y-3">
        {notifications.map(notification => (
            <NotificationToast 
                key={notification.id}
                message={notification.message}
                onClose={() => handleDismissNotification(notification.id)}
            />
        ))}
      </div>
    </div>
  );
};

export default App;
