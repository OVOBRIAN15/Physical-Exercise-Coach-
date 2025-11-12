
import React from 'react';
import { Plan, PlanTier } from '../types';
import { CheckIcon } from './Icons';

interface PricingSectionProps {
  plans: Plan[];
  onSelectPlan: (plan: Plan) => void;
}

const PricingSection: React.FC<PricingSectionProps> = ({ plans, onSelectPlan }) => {
  const monthlyPlans = plans.filter(p => p.tier !== PlanTier.LIFETIME);
  const lifetimePlan = plans.find(p => p.tier === PlanTier.LIFETIME);
  
  return (
    <section id="pricing" className="py-20 sm:py-24 bg-white dark:bg-light-bg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-light-text">Choose Your Plan</h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-text">Simple, transparent pricing. No hidden fees.</p>
        </div>
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {monthlyPlans.map((plan, index) => (
            <div
              key={plan.tier}
              className={`rounded-xl border p-8 flex flex-col transition-all duration-300 relative ${
                index === 1 ? 'border-primary-light dark:border-primary scale-105 bg-gray-50 dark:bg-gray-900 shadow-xl' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50'
              }`}
            >
              {index === 1 && (
                <div className="absolute top-0 -translate-y-1/2 w-full flex justify-center">
                  <span className="bg-primary-light dark:bg-primary text-white dark:text-secondary text-xs font-bold px-3 py-1 rounded-full uppercase">Most Popular</span>
                </div>
              )}
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-light-text">{plan.tier}</h3>
              <p className="mt-4 text-4xl font-bold text-gray-900 dark:text-light-text">
                ${plan.price} <span className="text-base font-medium text-gray-500 dark:text-gray-text">/month</span>
              </p>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-text">Billed monthly.</p>
              <ul className="mt-8 space-y-4 text-sm text-gray-600 dark:text-gray-text flex-grow">
                {plan.features.slice(0, 4).map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <CheckIcon className="w-5 h-5 mr-3 text-primary-light dark:text-primary flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => onSelectPlan(plan)}
                className={`mt-10 block w-full py-3 px-6 border border-transparent rounded-md text-center font-medium transition-colors ${
                  index === 1
                    ? 'bg-primary-light dark:bg-primary text-white dark:text-secondary hover:bg-opacity-90'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-light-text hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                Choose {plan.tier}
              </button>
            </div>
          ))}
        </div>

        {lifetimePlan && (
            <div className="mt-16 max-w-2xl mx-auto">
                <div className="rounded-xl border border-primary-light dark:border-primary p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-8 bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-light-bg shadow-lg">
                    <div>
                        <h3 className="text-2xl font-semibold text-gray-900 dark:text-light-text">{lifetimePlan.tier}</h3>
                         <p className="mt-2 text-4xl font-bold text-gray-900 dark:text-light-text">
                            ${lifetimePlan.price}
                            <span className="text-base font-medium text-gray-500 dark:text-gray-text"> one-time</span>
                         </p>
                         <p className="mt-2 text-sm text-gray-600 dark:text-gray-text">Get all Elite features, forever.</p>
                    </div>
                    <button
                        onClick={() => onSelectPlan(lifetimePlan)}
                        className="px-6 py-3 bg-primary-light dark:bg-primary text-white dark:text-secondary font-bold rounded-md transition-transform hover:scale-105 flex-shrink-0"
                    >
                        Learn More
                    </button>
                </div>
            </div>
        )}

      </div>
    </section>
  );
};

export default PricingSection;