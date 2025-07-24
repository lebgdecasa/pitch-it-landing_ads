import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOnboarding } from '../OnboardingProvider';
import { Send, AtSign, Users, CheckCircle, Link } from 'lucide-react';
import { useTranslation } from 'next-i18next';

export const ChatDemoStep: React.FC = () => {
  const { t } = useTranslation('common');
  const { skipOnboarding, previousStep } = useOnboarding();
  const [showDemo, setShowDemo] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const personas = [
    {
      name: t('onboarding_chat_demo_persona1_name'),
      role: t('onboarding_chat_demo_persona1_role'),
      color: 'bg-purple-100 text-purple-700'
    },
    {
      name: t('onboarding_chat_demo_persona2_name'),
      role: t('onboarding_chat_demo_persona2_role'),
      color: 'bg-blue-100 text-blue-700'
    },
    {
      name: t('onboarding_chat_demo_persona3_name'),
      role: t('onboarding_chat_demo_persona3_role'),
      color: 'bg-green-100 text-green-700'
    },
    {
      name: t('onboarding_chat_demo_persona4_name'),
      role: t('onboarding_chat_demo_persona4_role'),
      color: 'bg-orange-100 text-orange-700'
    }
  ];

  const handleTransition = () => {
    setIsTransitioning(true);
    // Small delay to ensure smooth animation
    setTimeout(() => {
      setShowDemo(false);
      setIsTransitioning(false);
    }, 150);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 pt-20">
      <div className="relative max-w-5xl w-full">
        <AnimatePresence mode="wait">
          {showDemo ? (
            <motion.div
              key="demo"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{
                duration: 0.3,
                ease: [0.4, 0.0, 0.2, 1] // Custom easing for smoother animation
              }}
              className="bg-white rounded-2xl shadow-2xl w-full h-[600px] overflow-hidden"
              style={{ willChange: 'transform, opacity' }} // Optimize for animations
            >
              <div className="flex h-full">
                {/* Sidebar */}
                <div className="w-64 bg-gray-50 p-4 border-r">
                  <h3 className="font-semibold mb-4 flex items-center">
                    <Users className="mr-2" size={18} />
                    {t('onboarding_chat_demo_sidebar_title')}
                  </h3>
                  <div className="space-y-2">
                    {personas.map((persona) => (
                      <div
                        key={persona.name}
                        className="p-3 rounded-lg bg-white border hover:shadow-sm cursor-pointer transition-shadow duration-200"
                      >
                        <p className="font-medium text-sm">{persona.name}</p>
                        <p className="text-xs text-gray-600">{persona.role}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 flex flex-col">
                  <div className="p-4 border-b">
                    <h2 className="text-lg font-semibold">{t('onboarding_chat_demo_title')}</h2>
                    <p className="text-sm text-gray-600">{t('onboarding_chat_demo_subtitle')}</p>
                  </div>

                  <div className="flex-1 p-4 overflow-y-auto">
                    {/* Sample messages */}
                    <div className="space-y-4">
                      <div className="flex justify-end">
                        <div className="bg-blue-600 text-white rounded-lg px-4 py-2 max-w-xs">
                          {t('onboarding_chat_demo_message')}
                        </div>
                      </div>

                      {personas.map((persona, idx) => (
                        <motion.div
                          key={persona.name}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            delay: idx * 0.3,
                            duration: 0.4,
                            ease: [0.4, 0.0, 0.2, 1]
                          }}
                          className="flex items-start gap-3"
                        >
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${persona.color}`}>
                            {persona.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700">{persona.name}</p>
                            <div className="bg-gray-100 rounded-lg px-4 py-2 mt-1">
                              <p className="text-sm">
                                {idx === 0 && t('onboarding_chat_demo_persona1_response')}
                                {idx === 1 && t('onboarding_chat_demo_persona2_response')}
                                {idx === 2 && t('onboarding_chat_demo_persona3_response')}
                                {idx === 3 && t('onboarding_chat_demo_persona4_response')}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Input area */}
                  <div className="p-4 border-t">
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                        <AtSign size={20} className="text-gray-600" />
                      </button>
                      <input
                        type="text"
                        className="flex-1 px-3 py-2 border rounded-lg transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder={t('onboarding_chat_demo_input_placeholder')}
                      />
                      <button className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                        <Send size={20} />
                      </button>
                      <button
                        onClick={handleTransition}
                        disabled={isTransitioning}
                        className="bg-green-600 text-white px-10 py-6 rounded-lg hover:bg-green-700
                                 transition-all duration-200 disabled:opacity-70 transform hover:scale-105
                                 active:scale-95 font-medium"
                      >
                        {isTransitioning ? t('onboarding_chat_demo_loading') : t('onboarding_chat_demo_got_it')}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      {t('onboarding_chat_demo_tip')}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="complete"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.3,
                ease: [0.4, 0.0, 0.2, 1]
              }}
              className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-auto p-8 text-center"
              style={{ willChange: 'transform, opacity' }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, duration: 0.4, ease: "backOut" }}
                className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle className="w-10 h-10 text-green-600" />
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="text-3xl font-bold mb-4"
              >
                {t('onboarding_complete_title')}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.3 }}
                className="text-gray-600 mb-8"
              >
                {t('onboarding_complete_subtitle')}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.3 }}
                className="space-y-3"
              >
                <button
                  onClick={() => {
                    skipOnboarding();
                    window.location.href = '/dashboard';
                  }}
                  className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg
                           hover:bg-blue-700 transition-all duration-200 font-medium
                           transform hover:scale-105 active:scale-95"
                >
                  {t('onboarding_complete_cta')}
                </button>

                <button
                  onClick={previousStep}
                  className="w-full text-gray-600 px-6 py-3 rounded-lg
                           hover:bg-gray-100 transition-all duration-200
                           transform hover:scale-105 active:scale-95"
                >
                  {t('onboarding_complete_review')}
                </button>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.3 }}
                className="text-sm text-gray-500 mt-6"
              >
                {t('onboarding_complete_help_text')}
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
