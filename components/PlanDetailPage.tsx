
import React from 'react';
import { Plan, PlanTier } from '../types';
import { CheckIcon, ArrowRightIcon } from './Icons';

interface PlanDetailPageProps {
  plan: Plan;
  onSubscribe: (plan: Plan) => void;
  onBack: () => void;
}

const PlanDetailPage: React.FC<PlanDetailPageProps> = ({ plan, onSubscribe, onBack }) => {
  const isLifetime = plan.tier === PlanTier.LIFETIME;

  return (
    <div className="bg-gray-50 dark:bg-dark-bg py-20 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <button onClick={onBack} className="mb-8 text-sm font-medium text-primary-light dark:text-primary hover:underline flex items-center gap-2">
            &larr; Back to All Plans
          </button>
          
          <div className="bg-white dark:bg-light-bg rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 p-8 sm:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <span className="inline-block bg-primary-light/10 dark:bg-primary/20 text-primary-light dark:text-primary font-semibold px-3 py-1 rounded-full text-sm">{plan.tier} Plan</span>
                <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-light-text">
                  {plan.tier === 'Basic' && 'Get Started on Your Journey'}
                  {plan.tier === 'Pro' && 'Unlock Your Potential'}
                  {plan.tier === 'Elite' && 'Achieve Peak Performance'}
                  {plan.tier === 'Lifetime' && 'One Plan, For Life'}
                </h1>
                <p className="mt-4 text-lg text-gray-600 dark:text-gray-text">
                  {plan.tier === 'Basic' && 'The perfect starting point for anyone new to fitness. Get access to core features and start building a healthier you.'}
                  {plan.tier === 'Pro' && 'Take your fitness to the next level with personalized advice and advanced tracking to accelerate your results.'}
                  {plan.tier === 'Elite' && 'The ultimate fitness experience with direct coaching and premium features for those who demand the best.'}
                  {plan.tier === 'Lifetime' && 'Get all Elite features forever with a single payment. The ultimate commitment to your long-term health and fitness.'}
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-8 flex flex-col justify-between border border-gray-200 dark:border-gray-700">
                <div>
                    <p className="text-5xl font-bold text-gray-900 dark:text-light-text">
                        ${plan.price}
                    </p>
                    <p className="text-base font-medium text-gray-500 dark:text-gray-text">
                        {isLifetime ? 'One-time payment' : '/month'}
                    </p>
                </div>
                <button
                    onClick={() => onSubscribe(plan)}
                    className="group mt-8 w-full inline-flex items-center justify-center px-6 py-4 border border-transparent text-lg font-medium rounded-md text-white dark:text-secondary bg-primary-light dark:bg-primary hover:bg-opacity-90 transition-transform hover:scale-105"
                >
                    {isLifetime ? 'Get Lifetime Access' : `Subscribe to ${plan.tier}`}
                    <ArrowRightIcon className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            <div className="mt-12 border-t border-gray-200 dark:border-gray-700 pt-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-light-text">What's Included:</h2>
              <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-gray-600 dark:text-gray-text">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <CheckIcon className="w-5 h-5 mr-3 text-green-500 flex-shrink-0 mt-1" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanDetailPage;
