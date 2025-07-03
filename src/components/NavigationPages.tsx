import {
  BarChart3,
  Bell,
  Database,
  FileText,
  HelpCircle,
  Settings,
  Sprout,
  TrendingUp
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { mlModelService } from '../services/mlModelService';
import DataTable from './DataTable';
import IoTSimulator from './IoTSimulator';
import MLModelIntegration from './MLModelIntegration';
import SMSService from './SMSService';

interface NavigationPagesProps {
  isDarkMode: boolean;
  activePage: string;
  onSensorData?: (data: any) => void;
}

const NavigationPages: React.FC<NavigationPagesProps> = ({ isDarkMode, activePage, onSensorData }) => {
  const renderPage = () => {
    switch (activePage) {
      case 'Analytics':
        return <AnalyticsPage isDarkMode={isDarkMode} />;
      case 'Crops':
        return <CropsPage isDarkMode={isDarkMode} />;
      case 'Soil Data':
        return <SoilDataPage isDarkMode={isDarkMode} onSensorData={onSensorData} />;
      case 'Reports':
        return <ReportsPage isDarkMode={isDarkMode} />;
      case 'History':
        return <HistoryPage isDarkMode={isDarkMode} />;
      case 'Alerts':
        return <AlertsPage isDarkMode={isDarkMode} />;
      case 'Settings':
        return <SettingsPage isDarkMode={isDarkMode} />;
      case 'Help':
        return <HelpPage isDarkMode={isDarkMode} />;
      default:
        return null;
    }
  };

  return renderPage();
};

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
        { title: 'Active Farmers', value: '342', change: '+8%', color: 'orange' }
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
      These are the main crops managed in your region. Monitoring their status helps optimize yield and resource use.
    </p>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[
        { name: 'Maize', area: '45 ha', status: 'Growing', yield: '8.2 t/ha', image: 'https://images.pexels.com/photos/2132227/pexels-photo-2132227.jpeg?auto=compress&cs=tinysrgb&w=400' },
        { name: 'Rice', area: '32 ha', status: 'Harvesting', yield: '6.8 t/ha', image: 'https://images.pexels.com/photos/1595104/pexels-photo-1595104.jpeg?auto=compress&cs=tinysrgb&w=400' },
        { name: 'Beans', area: '28 ha', status: 'Planting', yield: '2.1 t/ha', image: 'https://images.pexels.com/photos/1595108/pexels-photo-1595108.jpeg?auto=compress&cs=tinysrgb&w=400' },
        { name: 'Potato', area: '18 ha', status: 'Growing', yield: '12.5 t/ha', image: 'https://images.pexels.com/photos/2132180/pexels-photo-2132180.jpeg?auto=compress&cs=tinysrgb&w=400' },
        { name: 'Cassava', area: '25 ha', status: 'Mature', yield: '15.2 t/ha', image: 'https://images.pexels.com/photos/1595104/pexels-photo-1595104.jpeg?auto=compress&cs=tinysrgb&w=400' },
        { name: 'Banana', area: '12 ha', status: 'Growing', yield: '18.7 t/ha', image: 'https://images.pexels.com/photos/2132227/pexels-photo-2132227.jpeg?auto=compress&cs=tinysrgb&w=400' }
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
        { title: 'Monthly Soil Analysis Report', date: '2024-01-15', type: 'PDF', size: '2.4 MB' },
        { title: 'Fertilizer Usage Summary', date: '2024-01-10', type: 'Excel', size: '1.8 MB' },
        { title: 'Yield Comparison Report', date: '2024-01-08', type: 'PDF', size: '3.1 MB' },
        { title: 'Cost-Benefit Analysis', date: '2024-01-05', type: 'PDF', size: '1.2 MB' }
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
const HistoryPage: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await mlModelService.getPredictionHistory(50);
        // Map ml_predictions fields to DataTable format
        const mapped = (data || []).map((item: any) => ({
          id: item.id,
          date: item.created_at ? new Date(item.created_at).toLocaleString() : '',
          cropType: item.input_features?.Crop_Type || item.input_features?.cropType || '-',
          fertilizer: item.prediction_result?.fertilizer || '-',
          rate: item.prediction_result?.applicationRate || '-',
          confidence: item.prediction_result?.confidenceScore || '-',
        }));
        setHistory(mapped);
      } catch (err: any) {
        setError('Failed to load prediction history.');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <FileText className="h-6 w-6 text-blue-600" />
        <h2 className="text-2xl font-bold">Analysis History</h2>
      </div>
      {loading ? (
        <div className={`p-6 rounded-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <p className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Loading...</p>
        </div>
      ) : error ? (
        <div className={`p-6 rounded-xl border ${isDarkMode ? 'bg-red-900/10 border-red-700' : 'bg-red-100 border-red-200'}`}>
          <p className="text-center py-8 text-red-600">{error}</p>
        </div>
      ) : (
        <DataTable isDarkMode={isDarkMode} data={history} />
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

// Settings Page
const SettingsPage: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => (
  <div className="space-y-6">
    <div className="flex items-center space-x-3 mb-6">
      <Settings className="h-6 w-6 text-gray-600" />
      <h2 className="text-2xl font-bold">Settings</h2>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className={`p-6 rounded-xl border ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <h3 className="font-semibold mb-4">Account Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input type="email" className={`w-full px-3 py-2 rounded-lg border ${
              isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
            }`} placeholder="user@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input type="text" className={`w-full px-3 py-2 rounded-lg border ${
              isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
            }`} placeholder="John Doe" />
          </div>
        </div>
      </div>
      
      <div className={`p-6 rounded-xl border ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <h3 className="font-semibold mb-4">Notification Preferences</h3>
        <div className="space-y-3">
          {['Email notifications', 'SMS alerts', 'Push notifications', 'Weekly reports'].map((item, index) => (
            <label key={index} className="flex items-center space-x-2">
              <input type="checkbox" className="rounded" defaultChecked />
              <span className="text-sm">{item}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Help Page
const HelpPage: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => (
  <div className="space-y-6">
    <div className="flex items-center space-x-3 mb-6">
      <HelpCircle className="h-6 w-6 text-blue-600" />
      <h2 className="text-2xl font-bold">Help & Support</h2>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[
        { title: 'Getting Started', description: 'Learn how to use SoilSync for the first time' },
        { title: 'Soil Analysis Guide', description: 'Understanding soil parameters and recommendations' },
        { title: 'IoT Sensor Setup', description: 'How to connect and configure your sensors' },
        { title: 'SMS Integration', description: 'Setting up USSD and SMS notifications' },
        { title: 'Troubleshooting', description: 'Common issues and their solutions' },
        { title: 'Contact Support', description: 'Get help from our technical team' }
      ].map((item, index) => (
        <div key={index} className={`p-6 rounded-xl border transition-all hover:shadow-lg cursor-pointer ${
          isDarkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-700' : 'bg-white border-gray-200 hover:bg-gray-50'
        }`}>
          <h3 className="font-semibold mb-2">{item.title}</h3>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {item.description}
          </p>
        </div>
      ))}
    </div>
  </div>
);

export default NavigationPages;