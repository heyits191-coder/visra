
import React, { useState } from 'react';
import { X, Check, Zap, Sparkles, Rocket, Crown } from 'lucide-react';

interface PricingModalProps {
  onClose: () => void;
}

export const PricingModal: React.FC<PricingModalProps> = ({ onClose }) => {
  const [billingCycle, setBillingCycle] = useState<'personal' | 'business'>('personal');

  const plans = [
    {
      name: 'Free',
      price: '₹0',
      description: 'Get started with essential AI design assistance.',
      buttonText: 'Your current plan',
      buttonDisabled: true,
      features: ['Standard generation speed', 'Basic design suggestions', 'Unlimited basic chats'],
      icon: <Zap size={20} className="text-zinc-400" />,
    },
    {
      name: 'Go',
      price: '₹0',
      originalPrice: '₹399',
      badge: 'LIMITED TIME',
      description: 'The best value for individual designers.',
      buttonText: 'Claim free offer',
      highlight: true,
      features: [
        'Advanced Interior Vision',
        'Inpainting editor access',
        '2x faster response speed',
        'Larger context window',
      ],
      icon: <Rocket size={20} className="text-indigo-500" />,
    },
    {
      name: 'Plus',
      price: '₹1,999',
      description: 'For professionals needing maximum output.',
      buttonText: 'Get Plus',
      features: [
        'Priority access to new models',
        'Ultra-high fidelity renders',
        'Extended generation limits',
        'Custom design constraints',
      ],
      icon: <Sparkles size={20} className="text-purple-500" />,
    },
    {
      name: 'Pro',
      price: '₹19,900',
      description: 'Full studio capabilities for teams.',
      buttonText: 'Get Pro',
      features: [
        'Unlimited high-speed renders',
        'Team collaboration workspace',
        'API access for studio workflows',
        'Dedicated success manager',
      ],
      icon: <Crown size={20} className="text-amber-500" />,
    },
  ];

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-300 overflow-y-auto">
      <div className="relative w-full max-w-6xl bg-white dark:bg-[#1a1a1a] rounded-[32px] shadow-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 animate-in zoom-in-95 duration-300">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute right-6 top-6 p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 dark:text-zinc-600 transition-all z-10"
        >
          <X size={20} />
        </button>

        <div className="p-8 md:p-12">
          {/* Header */}
          <div className="text-center mb-10">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-zinc-900 dark:text-white mb-4">
              Try Visra Go free for 12 months
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 font-medium">Elevate your creative process with intelligence.</p>
            
            {/* Toggle */}
            <div className="flex justify-center mt-8">
              <div className="bg-zinc-100 dark:bg-zinc-900 p-1 rounded-2xl flex items-center border border-zinc-200 dark:border-zinc-800">
                <button
                  onClick={() => setBillingCycle('personal')}
                  className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${billingCycle === 'personal' ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm' : 'text-zinc-500'}`}
                >
                  Personal
                </button>
                <button
                  onClick={() => setBillingCycle('business')}
                  className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${billingCycle === 'business' ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm' : 'text-zinc-500'}`}
                >
                  Business
                </button>
              </div>
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan, idx) => (
              <div 
                key={idx}
                className={`flex flex-col rounded-3xl p-6 transition-all border ${
                  plan.highlight 
                  ? 'border-indigo-500 dark:border-indigo-500/50 bg-indigo-50/30 dark:bg-indigo-500/5 shadow-[0_0_40px_rgba(79,70,229,0.1)]' 
                  : 'border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900/30'
                }`}
              >
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    {plan.icon}
                    {plan.badge && (
                      <span className="bg-indigo-500 text-white text-[9px] font-black px-2 py-1 rounded-full uppercase tracking-widest">
                        {plan.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-black text-zinc-900 dark:text-white mb-1">{plan.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-zinc-900 dark:text-white">{plan.price}</span>
                    <span className="text-zinc-500 text-sm font-bold">/ month</span>
                    {plan.originalPrice && (
                      <span className="ml-2 text-zinc-400 text-sm line-through decoration-red-500/50">{plan.originalPrice}</span>
                    )}
                  </div>
                  <p className="mt-4 text-xs font-medium text-zinc-500 leading-relaxed min-h-[32px]">
                    {plan.description}
                  </p>
                </div>

                <button
                  disabled={plan.buttonDisabled}
                  className={`w-full py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all mb-8 ${
                    plan.buttonDisabled 
                    ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed'
                    : plan.highlight
                    ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20 hover:scale-[1.02] active:scale-95'
                    : 'bg-zinc-900 dark:bg-white text-white dark:text-black hover:scale-[1.02] active:scale-95'
                  }`}
                >
                  {plan.buttonText}
                </button>

                <div className="space-y-4">
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Features included</p>
                  {plan.features.map((feature, fIdx) => (
                    <div key={fIdx} className="flex gap-3 text-xs">
                      <Check size={14} className="text-zinc-300 dark:text-zinc-600 shrink-0" />
                      <span className="text-zinc-600 dark:text-zinc-400 font-medium leading-tight">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center text-[10px] text-zinc-400 font-bold uppercase tracking-widest opacity-50">
            Terms of service and privacy policy apply • All prices in INR
          </div>
        </div>
      </div>
    </div>
  );
};
