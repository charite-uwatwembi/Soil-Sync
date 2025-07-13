import { BarChart3, Brain, MessageSquare, Target } from 'lucide-react';
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface FeaturesProps {
  isDarkMode: boolean;
  onGetStarted: () => void;
}

const Features: React.FC<FeaturesProps> = ({ isDarkMode, onGetStarted }) => {
  const { t } = useLanguage();

  const features = [
    {
      icon: Brain,
      title: t('features.aiAnalysis.title'),
      description: t('features.aiAnalysis.description'),
      color: "from-green-500 to-green-600"
    },
    {
      icon: MessageSquare,
      title: t('features.smsAlerts.title'),
      description: t('features.smsAlerts.description'),
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: BarChart3,
      title: t('features.dashboard.title'),
      description: t('features.dashboard.description'),
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: Target,
      title: t('features.recommendations.title'),
      description: t('features.recommendations.description'),
      color: "from-orange-500 to-orange-600"
    }
  ];

  return (
    <section id="features" className="py-16 sm:py-20 bg-white dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t('features.title')}{' '}
            <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              {t('features.titleHighlight')}
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {t('features.subtitle')}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 hover:shadow-xl hover:border-green-200 dark:hover:border-green-600 transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8 sm:p-12 transition-colors duration-200">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {t('features.cta.title')}
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              {t('features.cta.description')}
            </p>
            <button
              onClick={onGetStarted}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              {t('features.cta.button')}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;