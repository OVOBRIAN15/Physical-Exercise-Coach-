

export interface ProgressEntry {
  date: string; // YYYY-MM-DD
  weight?: number; // in kg
  workoutDuration?: number; // in minutes
}

export enum PlanTier {
  BASIC = 'Basic',
  PRO = 'Pro',
  ELITE = 'Elite',
  LIFETIME = 'Lifetime',
}

export interface Plan {
  tier: PlanTier;
  price: number;
  features: string[];
}

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export enum BookCategory {
  NUTRITION = 'Nutrition',
  STRENGTH_TRAINING = 'Strength Training',
  MINDFULNESS = 'Mindfulness',
  CARDIO = 'CardIO',
}

export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  coverImage: string;
  content: string; // Markdown or simple text content
  price: number;
  category: BookCategory;
}

export enum PaymentHistoryStatus {
  PAID = 'Paid',
  FAILED = 'Failed',
}

export interface PaymentHistoryEntry {
  id: string;
  date: string; // YYYY-MM-DD
  description: string;
  amount: number;
  status: PaymentHistoryStatus;
}


export interface User {
  id: string;
  name?: string;
  age?: number;
  fitnessGoals?: string;
  email: string;
  role: UserRole;
  subscription?: {
    plan: PlanTier;
    renewalDate: string;
    status: 'active' | 'cancelled';
  };
  progress?: ProgressEntry[];
  purchasedBookIds?: string[];
  paymentHistory?: PaymentHistoryEntry[];
}

export interface PlanHistoryItem {
  id: string;
  date: string;
  prompt: string;
  plan: string;
}

export enum VerificationStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
}

export interface PaymentVerificationRequest {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  phoneNumber: string;
  planTier: PlanTier;
  transactionId: string;
  screenshotProof: string; // Will store file name for simulation
  submissionDate: string; // YYYY-MM-DD
  status: VerificationStatus;
  actionDate?: string;
  rejectionReason?: string;
}