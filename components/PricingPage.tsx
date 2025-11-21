
import React, { useState } from 'react';
import { Check, X } from 'lucide-react';

export const PricingPage: React.FC<{ onStart: () => void }> = ({ onStart }) => {
  const [annual, setAnnual] = useState(true);

  const tiers = [
    {
      name: "Starter",
      price: 0,
      description: "Perfect for freelancers and small sites.",
      features: [
        "1 Project",
        "100 Page Crawls / mo",
        "Basic SEO Audit",
        "Limited Competitor Data",
        "Community Support"
      ],
      cta: "Start Free",
      popular: false
    },
    {
      name: "Pro",
      price: annual ? 49 : 59,
      description: "For growing agencies and businesses.",
      features: [
        "10 Projects",
        "10,000 Page Crawls / mo",
        "Advanced AI Recommendations",
        "Full Competitor Intelligence",
        "White-label PDF Reports",
        "Priority Email Support"
      ],
      cta: "Start Trial",
      popular: true
    },
    {
      name: "Agency",
      price: annual ? 199 : 249,
      description: "Maximum power for large teams.",
      features: [
        "Unlimited Projects",
        "500,000 Page Crawls / mo",
        "API Access",
        "Custom Integrations",
        "Dedicated Account Manager",
        "SSO & Advanced Security"
      ],
      cta: "Contact Sales",
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-24 animate-in fade-in duration-500">
      <div className="container mx-auto px-6 text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">
          Simple, Transparent Pricing
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 mb-10">
          Choose the plan that fits your growth stage.
        </p>

        {/* Toggle */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <span className={`text-sm font-bold ${!annual ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>Monthly</span>
          <button 
            onClick={() => setAnnual(!annual)}
            className="relative w-14 h-8 bg-slate-200 dark:bg-slate-800 rounded-full p-1 transition-colors focus:outline-none"
          >
            <div className={`w-6 h-6 bg-indigo-600 rounded-full shadow-md transform transition-transform ${annual ? 'translate-x-6' : 'translate-x-0'}`}></div>
          </button>
          <span className={`text-sm font-bold ${annual ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>
            Yearly <span className="text-indigo-500 text-xs ml-1">(Save 20%)</span>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {tiers.map((tier, idx) => (
            <div key={idx} className={`relative p-8 rounded-2xl border transition-all duration-300 flex flex-col ${
                tier.popular 
                ? 'bg-white dark:bg-slate-900 border-indigo-500 shadow-2xl scale-105 z-10' 
                : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-indigo-300'
            }`}>
              {tier.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">
                  Most Popular
                </div>
              )}
              <div className="mb-8 text-left">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{tier.name}</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-extrabold text-slate-900 dark:text-white">${tier.price}</span>
                  <span className="text-slate-500">/mo</span>
                </div>
                <p className="text-sm text-slate-500">{tier.description}</p>
              </div>

              <ul className="space-y-4 mb-8 flex-grow text-left">
                {tier.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm font-medium text-slate-700 dark:text-slate-300">
                    <Check className="w-5 h-5 text-green-500 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button 
                onClick={onStart}
                className={`w-full py-4 rounded-xl font-bold transition-all ${
                    tier.popular
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-indigo-500/25'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                {tier.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
