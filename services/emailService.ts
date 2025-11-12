
import { User } from '../types';

/**
 * Simulates an admin action to send renewal reminders to users whose subscriptions expire in 7 days.
 * @param users - The list of all users.
 * @returns An array of notification message strings for the admin.
 */
export const sendManualRenewalReminders = (users: User[]): string[] => {
  const notifications: string[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize today's date to midnight for accurate comparison

  const expiringUsers = users.filter(user => {
    if (user.subscription && user.subscription.status === 'active') {
      const renewalDate = new Date(user.subscription.renewalDate);
      renewalDate.setHours(0, 0, 0, 0);
      
      const timeDiff = renewalDate.getTime() - today.getTime();
      const daysUntilRenewal = Math.ceil(timeDiff / (1000 * 3600 * 24));
      
      return daysUntilRenewal === 7;
    }
    return false;
  });

  if (expiringUsers.length > 0) {
    expiringUsers.forEach(user => {
        notifications.push(`SIMULATED EMAIL: Renewal reminder sent to ${user.email}.`);
    });
  } else {
    notifications.push("No active subscriptions are due for renewal in 7 days.");
  }

  return notifications;
};