import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Brain, Calendar, Users, ChevronRight, Check } from 'lucide-react';

const ONBOARDING_STEPS = [
  {
    id: 1,
    title: 'Study Smarter',
    subtitle: 'Better focus, balanced lifestyle, and guided study sessions powered by AI.',
    icon: Brain,
    color: 'emerald'
  },
  {
    id: 2,
    title: 'Master Your Schedule',
    subtitle: 'Intelligent study scheduling, daily reminders, and progress tracking.',
    icon: Calendar,
    color: 'violet'
  },
  {
    id: 3,
    title: 'Ace Your Exams',
    subtitle: 'Access authentic past questions, test your knowledge, and connect with peers.',
    icon: GraduationCap,
    color: 'amber'
  }
];

export function PreAuthOnboarding({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);

  const handleNext = () => {
    if (step < ONBOARDING_STEPS.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  const currentStep = ONBOARDING_STEPS[step];
  const Icon = currentStep.icon;

  return (
    <div className="w-full lg:max-w-7xl mx-auto min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-center relative shadow-2xl border-x border-slate-800 overflow-x-hidden">
      
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-sm relative mt-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center w-full"
          >
            <div className={`w-32 h-32 rounded-full mb-12 flex items-center justify-center bg-${currentStep.color}-500/20 text-${currentStep.color}-400 shadow-[0_0_60px_-15px_currentColor]`}>
               <Icon size={64} />
            </div>

            <h1 className="text-3xl font-bold text-white mb-4 tracking-tight">
              {currentStep.title}
            </h1>
            
            <p className="text-slate-400 text-lg leading-relaxed px-4">
              {currentStep.subtitle}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="w-full max-w-sm pb-12">
        {/* Indicators */}
        <div className="flex justify-center gap-2 mb-10">
          {ONBOARDING_STEPS.map((_, i) => (
            <div 
              key={i} 
              className={`h-2 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-white' : 'w-2 bg-slate-700'}`}
            />
          ))}
        </div>

        <button 
          onClick={handleNext}
          className="w-full py-4 text-base font-bold shadow-xl flex items-center justify-center gap-2 bg-emerald-600 text-white rounded-2xl hover:bg-emerald-700 transition-colors"
        >
          {step === ONBOARDING_STEPS.length - 1 ? 'Get Started' : 'Next'}
          {step === ONBOARDING_STEPS.length - 1 ? <Check size={20} /> : <ChevronRight size={20} />}
        </button>

        {step < ONBOARDING_STEPS.length - 1 && (
          <button 
            onClick={onComplete}
            className="mt-6 text-sm font-bold text-slate-500 hover:text-white transition-colors uppercase tracking-widest"
          >
            Skip Intro
          </button>
        )}
      </div>
    </div>
  );
}
