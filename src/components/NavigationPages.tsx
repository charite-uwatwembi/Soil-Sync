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
import type { AuthUser } from '../services/authService';
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
      case 'Reports':
        return <ReportsPage isDarkMode={isDarkMode} />;
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
  <div className="space-y-6">
    <div className="flex items-center space-x-3 mb-6">
      <BarChart3 className="h-6 w-6 text-blue-600" />
      <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[
        { title: 'Total Analyses', value: '1,247', change: '+12%', color: 'blue' },
        { title: 'Avg Confidence', value: '94.2%', change: '+2.1%', color: 'green' },
        { title: 'Yield Improvement', value: '18.5%', change: '+3.2%', color: 'purple' },
        { title: 'Active Farmers', value: '5', change: '+8%', color: 'orange' }
      ].map((stat, index) => (
        <div key={index} className={`p-6 rounded-xl border ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <h3 className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {stat.title}
          </h3>
          <p className="text-2xl font-bold mt-2">{stat.value}</p>
          <p className={`text-sm mt-1 text-${stat.color}-600`}>{stat.change} from last month</p>
        </div>
      ))}
    </div>

    <MLModelIntegration isDarkMode={isDarkMode} />
  </div>
);

// Crops Page
const CropsPage: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => (
  <div className="space-y-6">
    <div className="flex items-center space-x-3 mb-6">
      <Sprout className="h-6 w-6 text-green-600" />
      <h2 className="text-2xl font-bold">Crop Management</h2>
    </div>
    
    <p className={`mb-4 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
      These are the main crops managed in your region, including cereals, cash crops, and food crops. Monitoring their status helps optimize yield and resource use across diverse agricultural systems.
    </p>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[
        { name: 'Maize', area: '45 ha', status: 'Growing', yield: '8.2 t/ha', image: '/maize.png' },
        { name: 'Rice', area: '32 ha', status: 'Harvesting', yield: '6.8 t/ha', image: '/rice.png' },
        { name: 'Wheat', area: '28 ha', status: 'Planting', yield: '4.5 t/ha', image: '/wheat.png' },
        { name: 'Sugarcane', area: '18 ha', status: 'Growing', yield: '85.2 t/ha', image: '/sugarcane.png' },
        { name: 'Cotton', area: '25 ha', status: 'Mature', yield: '2.8 t/ha', image: '/cotton.png' },
        { name: 'Tobacco', area: '12 ha', status: 'Growing', yield: '1.5 t/ha', image: '/tobacco.png' },
        { name: 'Barley', area: '20 ha', status: 'Harvesting', yield: '3.8 t/ha', image: '/barley.png' },
        { name: 'Millets', area: '22 ha', status: 'Growing', yield: '1.2 t/ha', image: '/millets.png' },
        { name: 'Oil Seeds', area: '16 ha', status: 'Planting', yield: '1.8 t/ha', image: '/oilseed.png' },
        { name: 'Pulses', area: '14 ha', status: 'Growing', yield: '1.5 t/ha', image: '/pulse.png' },
        { name: 'Ground Nuts', area: '18 ha', status: 'Mature', yield: '2.1 t/ha', image: '/nuts.png' },
        { name: 'Beans', area: '10 ha', status: 'Growing', yield: '1.8 t/ha', image: '/beans.png' },
        { name: 'Potato', area: '12 ha', status: 'Growing', yield: '12.5 t/ha', image: '/potato.png' },
        { name: 'Cassava', area: '8 ha', status: 'Mature', yield: '15.2 t/ha', image: '/cassava.png' },
        { name: 'Banana', area: '6 ha', status: 'Growing', yield: '18.7 t/ha', image: '/banana.png' }
      ].map((crop, index) => (
        <div key={index} className={`p-6 rounded-xl border transition-all hover:shadow-lg ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <img src={crop.image} alt={crop.name} className="w-full h-32 object-cover rounded-lg mb-4" />
          <h3 className="text-lg font-semibold mb-2">{crop.name}</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Area:</span>
              <span className="text-sm font-medium">{crop.area}</span>
            </div>
            <div className="flex justify-between">
              <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Status:</span>
              <span className="text-sm font-medium text-green-600">{crop.status}</span>
            </div>
            <div className="flex justify-between">
              <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Yield:</span>
              <span className="text-sm font-medium">{crop.yield}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Soil Data Page
const SoilDataPage: React.FC<{ isDarkMode: boolean; onSensorData?: (data: any) => void }> = ({ isDarkMode, onSensorData }) => (
  <div className="space-y-6">
    <div className="flex items-center space-x-3 mb-6">
      <Database className="h-6 w-6 text-purple-600" />
      <h2 className="text-2xl font-bold">Soil Data Management</h2>
    </div>
    
    <IoTSimulator isDarkMode={isDarkMode} onDataReceived={onSensorData || (() => {})} />
    <SMSService isDarkMode={isDarkMode} />
  </div>
);

// Reports Page
const ReportsPage: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => (
  <div className="space-y-6">
    <div className="flex items-center space-x-3 mb-6">
      <TrendingUp className="h-6 w-6 text-green-600" />
      <h2 className="text-2xl font-bold">Reports & Analytics</h2>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[
        { title: 'Monthly Soil Analysis Report', date: '2025-01-15', type: 'PDF', size: '2.4 MB' },
        { title: 'Fertilizer Usage Summary', date: '2025-01-10', type: 'Excel', size: '1.8 MB' },
        { title: 'Yield Comparison Report', date: '2025-01-08', type: 'PDF', size: '3.1 MB' },
        { title: 'Cost-Benefit Analysis', date: '2025-01-05', type: 'PDF', size: '1.2 MB' }
      ].map((report, index) => (
        <div key={index} className={`p-6 rounded-xl border transition-all hover:shadow-lg ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <h3 className="font-semibold mb-2">{report.title}</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {report.date} • {report.type} • {report.size}
              </p>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm">
              Download
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// History Page
const HistoryPage: React.FC<{ isDarkMode: boolean; historyData: HistoryData[] }> = ({ isDarkMode, historyData }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <FileText className="h-6 w-6 text-blue-600" />
        <h2 className="text-2xl font-bold">Analysis History</h2>
      </div>
      {historyData.length === 0 ? (
        <div className={`p-6 rounded-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <p className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>No analysis history available yet.</p>
        </div>
      ) : (
        <DataTable isDarkMode={isDarkMode} data={historyData} />
      )}
    </div>
  );
};

// Alerts Page
const AlertsPage: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => (
  <div className="space-y-6">
    <div className="flex items-center space-x-3 mb-6">
      <Bell className="h-6 w-6 text-yellow-600" />
      <h2 className="text-2xl font-bold">Alerts & Notifications</h2>
    </div>
    
    <div className="space-y-4">
      {[
        { type: 'warning', title: 'Low Soil Moisture Detected', message: 'Field A sensors show moisture below optimal levels', time: '2 hours ago' },
        { type: 'info', title: 'Weather Update', message: 'Rain expected in the next 48 hours', time: '4 hours ago' },
        { type: 'success', title: 'Analysis Complete', message: 'Soil analysis for Field B completed successfully', time: '6 hours ago' },
        { type: 'error', title: 'Sensor Offline', message: 'Sensor SOIL_003 has been offline for 12 hours', time: '12 hours ago' }
      ].map((alert, index) => (
        <div key={index} className={`p-4 rounded-xl border-l-4 ${
          alert.type === 'warning' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/10' :
          alert.type === 'info' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/10' :
          alert.type === 'success' ? 'border-green-500 bg-green-50 dark:bg-green-900/10' :
          'border-red-500 bg-red-50 dark:bg-red-900/10'
        } ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold">{alert.title}</h4>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {alert.message}
              </p>
            </div>
            <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              {alert.time}
            </span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Profile Page (formerly SettingsPage)
const ProfilePage: React.FC<{ isDarkMode: boolean; user: AuthUser | null }> = ({ isDarkMode, user }) => (
  <div className="space-y-6">
    <div className="flex items-center space-x-3 mb-6">
      <User className="h-6 w-6 text-blue-600" />
      <h2 className="text-2xl font-bold">My Profile</h2>
    </div>

    

    <div className={`p-6 rounded-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      <h3 className="text-lg font-semibold mb-4">Plan Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Current Plan</label>
          <p className="mt-1 text-lg text-gray-900 dark:text-white">{user?.planType || 'Free Plan'}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Membership Status</label>
          <p className="mt-1 text-lg text-green-600 dark:text-green-400">Active</p>
        </div>
      </div>
      <div className="mt-6 flex justify-end">
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors">
          Upgrade Plan
        </button>
      </div>
    </div>

    <div className={`p-6 rounded-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      <h3 className="text-lg font-semibold mb-4">Security Settings</h3>
      <div className="flex justify-end">
        <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-md font-medium transition-colors mr-2">
          Change Password
        </button>
        <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-medium transition-colors">
          Delete Account
        </button>
      </div>
    </div>
  </div>
);

// Help Page
const HelpPage: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const helpItems = [
    {
      title: 'Getting Started',
      description: 'Learn how to use SoilSync for the first time',
      content: (
        <p>
          Welcome to SoilSync! To get started, first register for an account or sign in. Once logged in, you can explore your dashboard to access features like soil data analysis, crop management, and more. Begin by navigating to the 'Soil Data' page to input your first sensor readings or manually enter soil parameters.
        </p>
      ),
    },
    {
      title: 'Soil Analysis Guide',
      description: 'Understanding soil parameters and recommendations',
      content: (
        <p>
          Our soil analysis provides insights into key parameters like pH, nitrogen, phosphorus, and potassium (NPK), along with temperature, humidity, and moisture. Based on these readings, SoilSync generates personalized recommendations for crop types and fertilizer application to optimize your yield and promote sustainable farming practices.
        </p>
      ),
    },
    {
      title: 'IoT Sensor Setup',
      description: 'How to connect and configure your sensors',
      content: (
        <p>
          Connecting your IoT sensors to SoilSync is straightforward. Navigate to the 'Soil Data' page and locate the 'IoT Simulator' section. Here, you will find instructions and credentials to link your physical sensors. Ensure your sensors are properly calibrated and have stable network connectivity for accurate data transmission.
        </p>
      ),
    },
    {
      title: 'SMS Integration',
      description: 'Setting up USSD and SMS notifications',
      content: (
        <p>
          Stay updated with crucial farm insights through our SMS integration. Go to the 'Soil Data' page and find the 'SMS Service' section to configure your preferences. You can set up alerts for low soil moisture, optimal fertilizer application times, or pest warnings directly to your mobile device via SMS or USSD.
        </p>
      ),
    },
    {
      title: 'Troubleshooting',
      description: 'Common issues and their solutions',
      content: (
        <p>
          Experiencing issues? Check our common troubleshooting tips. If your sensor data isn't updating, verify its battery and network connection. For login problems, try resetting your password. If you encounter persistent technical difficulties, please utilize the 'Contact Support' option for direct assistance.
        </p>
      ),
    },
    {
      title: 'Contact Support',
      description: 'Get help from our technical team',
      content: (
        <p>
          Need personalized assistance? Our dedicated technical support team is here to help. You can reach us via email at support@soilsync.com or call our hotline at +250-789-951-064. Our support hours are Monday to Friday, 9 AM to 5 PM local time.
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
        <h2 className="text-2xl font-bold">Help & Support</h2>
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