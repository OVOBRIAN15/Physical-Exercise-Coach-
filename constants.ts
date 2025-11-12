

import { Plan, PlanTier, User, UserRole, Book, BookCategory, PaymentHistoryStatus } from './types';

export const PLANS: Plan[] = [
  {
    tier: PlanTier.BASIC,
    price: 5,
    features: [
      'Access to AI Workout Generator',
      'Standard Meal Plans',
      'Community Access',
      'Email Support',
    ],
  },
  {
    tier: PlanTier.PRO,
    price: 10,
    features: [
      'Everything in Basic',
      'Personalized AI Nutrition Advice',
      'Priority Email Support',
      'Monthly Progress Tracking',
    ],
  },
  {
    tier: PlanTier.ELITE,
    price: 15,
    features: [
      'Everything in Pro',
      'Direct Chat with AI Coach',
      'Weekly Video Check-ins (Simulated)',
      'Custom Fitness Challenges',
    ],
  },
  {
    tier: PlanTier.LIFETIME,
    price: 50,
    features: [
        'All Elite Features, Forever',
        'One-time payment, no subscriptions',
        'Priority access to new features',
        'Exclusive "Lifetime Member" badge',
    ],
  }
];

export const MOCK_BOOKS: Book[] = [
  {
    id: 'book-001',
    title: 'The Bodyweight Burn',
    author: 'Alex Vector',
    description: 'Master over 100 exercises using just your bodyweight. Perfect for home workouts and building functional strength.',
    coverImage: 'https://images.unsplash.com/photo-1544716278-e513176f20b5?q=80&w=800',
    price: 5,
    category: BookCategory.STRENGTH_TRAINING,
    content: `
# Chapter 1: The Power of You

Your body is the most advanced piece of gym equipment you will ever own. It's portable, adaptable, and incredibly powerful. This book is your manual. We'll start with the basics...

## The Foundation: Push-ups

The push-up is a classic for a reason. It engages your chest, shoulders, triceps, and core.

**Proper Form:**
- Start in a plank position.
- Lower your body until your chest nearly touches the floor.
- Push back up to the starting position.

Keep your body in a straight line throughout. Don't let your hips sag! ❤️‍🔥

## Next Up: Squats

... content continues ...
`
  },
  {
    id: 'book-002',
    title: 'Nutrition for Peak Performance',
    author: 'Dr. Evelyn Reed',
    description: 'Unlock your potential with science-backed nutrition strategies. Learn what to eat, when to eat, and why it matters.',
    coverImage: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=800',
    price: 5,
    category: BookCategory.NUTRITION,
    content: `
# Chapter 1: Fueling Your Machine

Think of your body as a high-performance engine. You wouldn't put low-grade fuel in a sports car, right? The same applies to you.

## Macronutrients: The Big Three

- **Protein:** The building block of muscle. Essential for repair and growth.
- **Carbohydrates:** Your primary energy source. Don't fear the carbs!
- **Fats:** Crucial for hormone production and overall health.

We will dive deep into each one. Let's make your next meal count. 🫶

... content continues ...
`
  },
  {
    id: 'book-003',
    title: 'Mindful Athlete',
    author: 'Jenna Mori',
    description: 'Connect your mind and body. This guide explores meditation, visualization, and mental resilience for athletes.',
    coverImage: 'https://images.unsplash.com/photo-1588465058802-12349e5b5658?q=80&w=800',
    price: 5,
    category: BookCategory.MINDFULNESS,
    content: `
# Chapter 1: The Unseen Muscle

Your most powerful muscle is your mind. Training it is just as important as training your body.

## The Power of Breath

It starts with your breath. A simple 5-minute breathing exercise can lower cortisol, improve focus, and prepare you for a workout.

**Try this:**
1. Inhale for 4 seconds.
2. Hold for 4 seconds.
3. Exhale for 6 seconds.
4. Repeat for 5 minutes.

You got this. ♥️

... content continues ...
`
  },
  {
    id: 'book-004',
    title: 'Cardio King: Run Faster, Last Longer',
    author: 'Leo Chase',
    description: 'A comprehensive guide to improving your cardiovascular endurance, from HIIT to long-distance running.',
    coverImage: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800',
    price: 5,
    category: BookCategory.CARDIO,
    content: `
# Chapter 1: Your Heart, Your Engine

Cardiovascular fitness is the cornerstone of a healthy life. It's not just about running marathons; it's about having the aenergy to play with your kids, climb stairs without getting winded, and live a vibrant life.

## High-Intensity Interval Training (HIIT)

HIIT is one of the most effective ways to boost your cardio. The principle is simple: short bursts of intense effort followed by brief recovery periods.

**Sample HIIT Workout:**
- 30 seconds of jumping jacks (as fast as you can)
- 15 seconds of rest
- 30 seconds of high knees
- 15 seconds of rest
- Repeat 8 times.

Let's get that heart rate up! ❤️‍🔥

... content continues ...
`
  }
];


// --- Dynamic Date for 7-day Reminder ---
const today = new Date();
const sevenDaysFromNow = new Date();
sevenDaysFromNow.setDate(today.getDate() + 7);
const formatDate = (date: Date) => date.toISOString().split('T')[0];
// ------------------------------------


export const MOCK_USERS: User[] = [
  {
    id: 'admin-001',
    email: 'admin@aifitness.com',
    role: UserRole.ADMIN,
    name: 'Admin User',
  },
  {
    id: 'user-001',
    name: 'John Pro',
    age: 32,
    fitnessGoals: 'My main goal is to lose 5kg in the next 3 months and improve my cardiovascular health by running a 5k race.',
    email: 'subscriber1@example.com',
    role: UserRole.USER,
    subscription: { plan: PlanTier.PRO, renewalDate: '2024-08-15', status: 'active' },
    progress: [
      { date: '2024-07-01', weight: 85, workoutDuration: 45 },
      { date: '2024-07-08', weight: 84.5, workoutDuration: 50 },
      { date: '2024-07-15', weight: 84, workoutDuration: 60 },
      { date: '2024-07-22', weight: 83, workoutDuration: 55 },
    ],
    purchasedBookIds: ['book-001'],
    paymentHistory: [
        { id: 'pay-001', date: '2024-07-15', description: 'Subscription - Pro Plan', amount: 10, status: PaymentHistoryStatus.PAID },
        { id: 'pay-002', date: '2024-06-15', description: 'Subscription - Pro Plan', amount: 10, status: PaymentHistoryStatus.PAID },
        { id: 'pay-003', date: '2024-05-15', description: 'Book Purchase - The Bodyweight Burn', amount: 5, status: PaymentHistoryStatus.PAID },
    ],
  },
  {
    id: 'user-002',
    email: 'subscriber2@example.com',
    role: UserRole.USER,
    subscription: { plan: PlanTier.BASIC, renewalDate: formatDate(sevenDaysFromNow), status: 'active' }, // 7-day reminder
    progress: [
        { date: '2024-07-03', workoutDuration: 30 },
        { date: '2024-07-10', workoutDuration: 35 },
        { date: '2024-07-17', workoutDuration: 30 },
        { date: '2024-07-24', weight: 70 },
    ],
    paymentHistory: [
        { id: 'pay-004', date: '2024-07-28', description: 'Subscription - Basic Plan', amount: 5, status: PaymentHistoryStatus.PAID },
    ],
  },
  {
    id: 'user-003',
    email: 'subscriber3@example.com',
    role: UserRole.USER,
    subscription: { plan: PlanTier.ELITE, renewalDate: '2024-09-01', status: 'cancelled' },
  },
  {
    id: 'user-004',
    email: 'newuser@example.com',
    role: UserRole.USER,
  },
  {
    id: 'user-005',
    email: 'another.user@example.com',
    role: UserRole.USER,
    subscription: { plan: PlanTier.BASIC, renewalDate: '2024-08-28', status: 'active' },
  },
  {
    id: 'user-006',
    email: 'test.user@example.com',
    role: UserRole.USER,
  },
  {
    id: 'user-007',
    email: 'pro.subscriber@example.com',
    role: UserRole.USER,
    subscription: { plan: PlanTier.PRO, renewalDate: '2024-09-10', status: 'active' },
  },
  {
    id: 'user-008',
    email: 'past.subscriber@example.com',
    role: UserRole.USER,
    subscription: { plan: PlanTier.BASIC, renewalDate: '2024-06-30', status: 'cancelled' },
  },
  {
    id: 'user-009',
    email: 'elite.member@example.com',
    role: UserRole.USER,
    subscription: { plan: PlanTier.ELITE, renewalDate: '2024-09-05', status: 'active' },
  },
  {
    id: 'user-010',
    email: 'trial.user@example.com',
    role: UserRole.USER,
  },
  {
    id: 'user-011',
    email: 'gym.lover@example.com',
    role: UserRole.USER,
    subscription: { plan: PlanTier.PRO, renewalDate: '2024-08-18', status: 'active' },
  },
  {
    id: 'user-012',
    email: 'fitness.fan@example.com',
    role: UserRole.USER,
    subscription: { plan: PlanTier.BASIC, renewalDate: '2024-09-20', status: 'active' },
  },
];