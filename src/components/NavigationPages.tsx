import {
    BarChart3,
    Bell,
    ChevronDown,
    Database,
    FileText,
    HelpCircle,
    Sprout,
    TrendingUp,
    User
} from 'lucide-react';
import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { authService, type AuthUser } from '../services/authService';
import AgriNews from './AgriNews';
import DataTable from './DataTable';
import IoTSimulator from './IoTSimulator';
import MLModelIntegration from './MLModelIntegration';
import SMSService from './SMSService';

interface NavigationPagesProps {
  isDarkMode: boolean;
  activePage: string;
  onSensorData?: (data: any) => void;
  historyData: HistoryData[];
  user: AuthUser | null;
}

const NavigationPages: React.FC<NavigationPagesProps> = ({ isDarkMode, activePage, onSensorData, historyData, user }) => {
  const renderPage = () => {
    switch (activePage) {
      case 'Dashboard':
        return <DashboardPage isDarkMode={isDarkMode} />;
      case 'Analytics':
        return <AnalyticsPage isDarkMode={isDarkMode} />;
      case 'Crops':
        return <CropsPage isDarkMode={isDarkMode} />;
      case 'Soil Data':
        return <SoilDataPage isDarkMode={isDarkMode} onSensorData={onSensorData} />;
      case 'Agriculture News':
        return <AgricultureNewsPage isDarkMode={isDarkMode} />;
      case 'History':
        return <HistoryPage isDarkMode={isDarkMode} historyData={historyData} />;
      case 'Alerts':
        return <AlertsPage isDarkMode={isDarkMode} />;
      case 'Settings':
        return <ProfilePage isDarkMode={isDarkMode} user={user} />;
      case 'Help':
        return <HelpPage isDarkMode={isDarkMode} />;
      default:
        return null;
    }
  };

  return renderPage();
};

// Dashboard Page (Placeholder - assuming it exists or will be created)
const DashboardPage: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold">Dashboard</h2>
    <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Welcome to your dashboard!</p>
  </div>
);

// Analytics Page
const AnalyticsPage: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => (
  <div className="space-y-4 md:space-y-6">
    <div className="flex items-center space-x-3 mb-4 md:mb-6">
      <BarChart3 className="h-6 w-6 text-blue-600" />
      <h2 className="text-xl md:text-2xl font-bold">Analytics Dashboard</h2>
    </div>
    
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {[
        { title: 'Total Analyses', value: '1,247', change: '+12%', color: 'blue' },
        { title: 'Avg Confidence', value: '94.2%', change: '+2.1%', color: 'green' },
        { title: 'Yield Improvement', value: '18.5%', change: '+3.2%', color: 'purple' },
        { title: 'Active Farmers', value: '5', change: '+8%', color: 'orange' }
      ].map((stat, index) => (
        <div key={index} className={`p-4 md:p-6 rounded-xl border ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <h3 className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {stat.title}
          </h3>
          <p className="text-xl md:text-2xl font-bold mt-2">{stat.value}</p>
          <p className={`text-sm mt-1 text-${stat.color}-600`}>{stat.change} from last month</p>
        </div>
      ))}
    </div>

    <MLModelIntegration isDarkMode={isDarkMode} />
  </div>
);

// Crops Page
const CropsPage: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const crops = [
    { name: 'Maize', status: 'Excellent', yield: '5.1 tons/ha', image: '/maize.png' },
    { name: 'Rice', status: 'Needs Attention', yield: '3.8 tons/ha', image: '/rice.png' },
    { name: 'Wheat', status: 'Healthy', yield: '4.2 tons/ha', image: '/wheat.png' },
    { name: 'Sugarcane', status: 'Good', yield: '68 tons/ha', image: '/sugarcane.png' },
    { name: 'Cotton', status: 'Healthy', yield: '2.1 tons/ha', image: '/cotton.png' },
    { name: 'Tobacco', status: 'Good', yield: '1.8 tons/ha', image: '/tobacco.png' },
    { name: 'Paddy', status: 'Excellent', yield: '4.5 tons/ha', image: '/rice.png' },
    { name: 'Barley', status: 'Good', yield: '3.5 tons/ha', image: '/barley.png' },
    { name: 'Millets', status: 'Healthy', yield: '2.8 tons/ha', image: '/millets.png' },
    { name: 'Oil seeds', status: 'Good', yield: '1.9 tons/ha', image: '/oilseed.png' },
    { name: 'Pulses', status: 'Excellent', yield: '2.3 tons/ha', image: '/pulse.png' },
    { name: 'Ground Nuts', status: 'Healthy', yield: '2.1 tons/ha', image: '/nuts.png' },
    { name: 'Beans', status: 'Good', yield: '1.7 tons/ha', image: '/beans.png' },
    { name: 'Potato', status: 'Excellent', yield: '25 tons/ha', image: '/potato.png' },
    { name: 'Cassava', status: 'Healthy', yield: '18 tons/ha', image: '/cassava.png' },
    { name: 'Banana', status: 'Good', yield: '35 tons/ha', image: '/banana.png' }
  ];

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex items-center space-x-3 mb-4 md:mb-6">
        <Sprout className="h-6 w-6 text-green-600" />
        <h2 className="text-xl md:text-2xl font-bold">Crop Management</h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {crops.map((crop, index) => (
          <div key={index} className={`p-4 md:p-6 rounded-xl border transition-all hover:shadow-lg ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-center space-x-4 mb-4">
              <img src={crop.image} alt={crop.name} className="w-12 h-12 rounded-lg" />
              <div>
                <h3 className="font-semibold text-lg">{crop.name}</h3>
                <p className={`text-sm ${
                  crop.status === 'Excellent' ? 'text-green-600' :
                  crop.status === 'Healthy' || crop.status === 'Good' ? 'text-blue-600' :
                  'text-yellow-600'
                }`}>
                  {crop.status}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Expected Yield:
                </span>
                <span className="text-sm font-medium">{crop.yield}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Soil Data Page
const SoilDataPage: React.FC<{ isDarkMode: boolean; onSensorData?: (data: any) => void }> = ({ isDarkMode, onSensorData }) => (
  <div className="space-y-4 md:space-y-6">
    <div className="flex items-center space-x-3 mb-4 md:mb-6">
      <Database className="h-6 w-6 text-purple-600" />
      <h2 className="text-xl md:text-2xl font-bold">Soil Data Management</h2>
    </div>
    
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
      <IoTSimulator isDarkMode={isDarkMode} onDataReceived={onSensorData} />
      <SMSService isDarkMode={isDarkMode} />
    </div>
  </div>
);

// Agriculture News Page
const AgricultureNewsPage: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const { t } = useLanguage();
  
  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <div className="flex items-center space-x-3">
          <TrendingUp className="h-6 w-6 text-green-600" />
          <div>
            <h2 className="text-xl md:text-2xl font-bold">{t('news.title')}</h2>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {t('news.subtitle')}
            </p>
          </div>
        </div>
      </div>
      
      {/* Full-width Agriculture News Component */}
      <div className="w-full">
        <AgriNews isDarkMode={isDarkMode} />
      </div>
    </div>
  );
};

// History Page
const HistoryPage: React.FC<{ isDarkMode: boolean; historyData: HistoryData[] }> = ({ isDarkMode, historyData }) => (
  <div className="space-y-4 md:space-y-6">
    <div className="flex items-center space-x-3 mb-4 md:mb-6">
      <FileText className="h-6 w-6 text-indigo-600" />
      <h2 className="text-xl md:text-2xl font-bold">Analysis History</h2>
    </div>
    
    <DataTable isDarkMode={isDarkMode} data={historyData} />
  </div>
);

// Alerts Page
const AlertsPage: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => (
  <div className="space-y-4 md:space-y-6">
    <div className="flex items-center space-x-3 mb-4 md:mb-6">
      <Bell className="h-6 w-6 text-red-600" />
      <h2 className="text-xl md:text-2xl font-bold">Alerts & Notifications</h2>
    </div>
    
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
      {[
        { type: 'warning', title: 'Low Soil Moisture', message: 'Field A2 requires immediate irrigation', time: '2 hours ago' },
        { type: 'info', title: 'Fertilizer Application Due', message: 'NPK application scheduled for tomorrow', time: '4 hours ago' },
        { type: 'success', title: 'Optimal Growth Conditions', message: 'All monitored fields showing healthy growth', time: '1 day ago' },
        { type: 'warning', title: 'Weather Alert', message: 'Heavy rainfall expected in 48 hours', time: '1 day ago' }
      ].map((alert, index) => (
        <div key={index} className={`p-4 md:p-6 rounded-xl border-l-4 ${
          alert.type === 'warning' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/10' :
          alert.type === 'info' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/10' :
          'border-green-500 bg-green-50 dark:bg-green-900/10'
        } ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold">{alert.title}</h3>
            <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {alert.time}
            </span>
          </div>
          <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {alert.message}
          </p>
        </div>
      ))}
    </div>
  </div>
);

// Profile Page (formerly SettingsPage)
const ProfilePage: React.FC<{ isDarkMode: boolean; user: AuthUser | null }> = ({ isDarkMode, user }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { t } = useLanguage();

  const handleDeleteAccount = async () => {
    if (!user) return;

    setIsDeleting(true);
    try {
      await authService.deleteAccount();
      // Account deletion will trigger auth state change and redirect to landing page
      alert(t('profile.deleteAccountSuccess'));
    } catch (error) {
      console.error('Failed to delete account:', error);
      alert(t('profile.deleteAccountError'));
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <User className="h-6 w-6 text-blue-600" />
        <h2 className="text-2xl font-bold">{t('profile.title')}</h2>
      </div>

      {/* Account Information */}
      <div className={`p-6 rounded-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <h3 className="text-lg font-semibold mb-4">{t('profile.accountInfo')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <p className="mt-1 text-lg text-gray-900 dark:text-white">{user?.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
            <p className="mt-1 text-lg text-gray-900 dark:text-white">{user?.fullName || 'Not provided'}</p>
          </div>
        </div>
      </div>

      {/* Plan Details */}
      <div className={`p-6 rounded-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <h3 className="text-lg font-semibold mb-4">{t('profile.planDetails')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('profile.currentPlan')}</label>
            <p className="mt-1 text-lg text-gray-900 dark:text-white">{user?.planType || t('profile.freePlan')}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('profile.membershipStatus')}</label>
            <p className="mt-1 text-lg text-green-600 dark:text-green-400">{t('profile.active')}</p>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors">
            {t('profile.upgradePlan')}
          </button>
        </div>
      </div>

      {/* Security Settings */}
      <div className={`p-6 rounded-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <h3 className="text-lg font-semibold mb-4">{t('profile.securitySettings')}</h3>
        <div className="flex justify-end space-x-2">
          <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-md font-medium transition-colors">
            {t('profile.changePassword')}
          </button>
          <button 
            onClick={() => setShowDeleteConfirm(true)}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
          >
            {t('profile.deleteAccount')}
          </button>
        </div>
      </div>

      {/* Delete Account Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`max-w-md w-full mx-4 p-6 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h3 className="text-lg font-semibold mb-4 text-red-600">{t('profile.deleteAccount')}</h3>
            <p className={`mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {t('profile.deleteAccountConfirm')}
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-600 hover:bg-gray-700 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                }`}
                disabled={isDeleting}
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={handleDeleteAccount}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
                disabled={isDeleting}
              >
                {isDeleting ? t('common.loading') : t('common.delete')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Help Page
const HelpPage: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const { t } = useLanguage();

  const helpItems = [
    {
      title: t('help.gettingStarted.title'),
      description: t('help.gettingStarted.description'),
      content: (
        <p>
          {t('help.gettingStarted.content')}
        </p>
      ),
    },
    {
      title: t('help.soilAnalysis.title'),
      description: t('help.soilAnalysis.description'),
      content: (
        <p>
          {t('help.soilAnalysis.content')}
        </p>
      ),
    },
    {
      title: t('help.iotSetup.title'),
      description: t('help.iotSetup.description'),
      content: (
        <p>
          {t('help.iotSetup.content')}
        </p>
      ),
    },
    {
      title: t('help.smsIntegration.title'),
      description: t('help.smsIntegration.description'),
      content: (
        <p>
          {t('help.smsIntegration.content')}
        </p>
      ),
    },
    {
      title: t('help.troubleshooting.title'),
      description: t('help.troubleshooting.description'),
      content: (
        <p>
          {t('help.troubleshooting.content')}
        </p>
      ),
    },
    {
      title: t('help.contactSupport.title'),
      description: t('help.contactSupport.description'),
      content: (
        <p>
          {t('help.contactSupport.content')}
        </p>
      ),
    },
  ];

  const toggleItem = (title: string) => {
    setExpandedItem(expandedItem === title ? null : title);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <HelpCircle className="h-6 w-6 text-blue-600" />
        <h2 className="text-2xl font-bold">{t('help.title')}</h2>
      </div>
    
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {helpItems.map((item, index) => (
          <div key={index} className={`rounded-xl border transition-all overflow-hidden ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <button
              onClick={() => toggleItem(item.title)}
              className={`w-full text-left p-6 flex justify-between items-center transition-all duration-200 ${
                isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
              }`}
            >
              <div>
                <h3 className="font-semibold mb-1">{item.title}</h3>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {item.description}
                </p>
              </div>
              <ChevronDown className={`h-5 w-5 transition-transform duration-200 ${
                expandedItem === item.title ? 'rotate-180' : 'rotate-0'
              }`} />
            </button>

            {expandedItem === item.title && (
              <div className={`p-6 pt-0 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {item.content}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

interface HistoryData {
  id: string;
  date: string;
  soilType: string;
  ph: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  temperature: number;
  humidity: number;
  moisture: number;
  cropRecommendation: string;
  fertilizerRecommendation: string;
}

export default NavigationPages;