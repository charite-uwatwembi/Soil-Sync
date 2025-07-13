import { AlertCircle, Check } from 'lucide-react';
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const Pricing: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="pricing" className="py-16 sm:py-20 bg-gray-50 dark:bg-gray-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t('pricing.title')}{' '}
            <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              {t('pricing.titleHighlight')}
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {t('pricing.subtitle')}
          </p>
        </div>

        {/* Current Status Notice */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-6 w-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                  {t('pricing.currentlyFree')}
                </h3>
                <p className="text-yellow-700 dark:text-yellow-300 leading-relaxed">
                  {t('pricing.currentlyFreeDescription')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Future Plans Preview */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Starter Plan */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 relative">
            <div className="text-center mb-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{t('pricing.starter')}</h3>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {t('pricing.free')}
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-1">{t('pricing.forever')}</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400">{t('pricing.perfectForSmallFarms')}</p>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-center space-x-3">
                <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-600 dark:text-gray-300">{t('pricing.upTo5Samples')}</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-600 dark:text-gray-300">{t('pricing.basicAI')}</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-600 dark:text-gray-300">{t('pricing.smsAlerts')}</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-600 dark:text-gray-300">{t('pricing.emailSupport')}</span>
              </li>
            </ul>

            <button className="w-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 py-3 rounded-lg font-semibold transition-colors hover:bg-green-200 dark:hover:bg-green-900/40">
              {t('pricing.currentPlan')}
            </button>
          </div>

          {/* Professional Plan */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border-2 border-green-500 p-8 relative transform scale-105">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                {t('pricing.mostPopular')}
              </span>
            </div>

            <div className="text-center mb-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{t('pricing.professional')}</h3>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                $29
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-1">{t('pricing.perMonth')}</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400">{t('pricing.forGrowingOperations')}</p>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-center space-x-3">
                <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-600 dark:text-gray-300">{t('pricing.unlimitedSamples')}</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-600 dark:text-gray-300">{t('pricing.advancedAI')}</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-600 dark:text-gray-300">{t('pricing.realTimeMonitoring')}</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-600 dark:text-gray-300">{t('pricing.prioritySupport')}</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-600 dark:text-gray-300">{t('pricing.customRecommendations')}</span>
              </li>
            </ul>

            <button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl">
              {t('pricing.comingSoon')}
            </button>
          </div>

          {/* Enterprise Plan */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 relative">
            <div className="text-center mb-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{t('pricing.enterprise')}</h3>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {t('pricing.custom')}
              </div>
              <p className="text-gray-600 dark:text-gray-400">{t('pricing.forLargeOperations')}</p>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-center space-x-3">
                <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-600 dark:text-gray-300">{t('pricing.everythingInProfessional')}</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-600 dark:text-gray-300">{t('pricing.multiFarmManagement')}</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-600 dark:text-gray-300">{t('pricing.apiAccess')}</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-600 dark:text-gray-300">{t('pricing.dedicatedSupport')}</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-600 dark:text-gray-300">{t('pricing.customIntegrations')}</span>
              </li>
            </ul>

            <button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl">
              {t('pricing.contactSales')}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;