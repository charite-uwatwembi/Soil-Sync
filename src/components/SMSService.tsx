import { AlertCircle, CheckCircle, Clock, HelpCircle, MessageSquare, Phone, Send } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { smsService, type SMSMessage } from '../services/smsService';

interface SMSServiceProps {
  isDarkMode: boolean;
}

const SMSService: React.FC<SMSServiceProps> = ({ isDarkMode }) => {
  const [testMessage, setTestMessage] = useState('');
  const [testResponse, setTestResponse] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [smsHistory, setSmsHistory] = useState<SMSMessage[]>([]);
  const [testPhone, setTestPhone] = useState('+250788123456');

  // Load SMS history on component mount
  useEffect(() => {
    loadSMSHistory();
  }, []);

  const loadSMSHistory = async () => {
    try {
      const history = await smsService.getSMSHistory(20);
      setSmsHistory(history);
    } catch (error) {
      console.error('Failed to load SMS history:', error);
    }
  };

  const handleTestSMS = async () => {
    if (!testMessage.trim()) return;

    setIsProcessing(true);
    try {
      const response = await smsService.processSMS(testPhone, testMessage);
      setTestResponse(response);
      
      // Reload history to show new interaction
      await loadSMSHistory();
      
      // Clear test message
      setTestMessage('');
    } catch (error) {
      setTestResponse('Error processing SMS. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const quickTestMessages = [
    { label: 'Wheat (Sandy)', message: 'Temp:25,Humidity:60,Moisture:30,Soil_Type:Sandy,Crop_Type:Wheat,N:0.5,P:30,K:20' },
    { label: 'Rice (Clay)', message: 'Temp:28,Humidity:70,Moisture:35,Soil_Type:Clay,Crop_Type:Rice,N:0.4,P:25,K:18' },
    { label: 'Maize (Loamy)', message: 'Temp:26,Humidity:65,Moisture:32,Soil_Type:Loamy,Crop_Type:Maize,N:0.6,P:28,K:22' },
    { label: 'Sugarcane (Black)', message: 'Temp:30,Humidity:75,Moisture:40,Soil_Type:Black,Crop_Type:Sugarcane,N:0.3,P:35,K:25' },
    { label: 'Cotton (Red)', message: 'Temp:27,Humidity:68,Moisture:28,Soil_Type:Red,Crop_Type:Cotton,N:0.4,P:22,K:15' },
    { label: 'Help Request', message: 'HELP' },
    { label: 'Invalid Format', message: 'Temp:25,Humidity:60' }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'recommendation':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'help':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
      case 'error':
        return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  return (
    <div className={`p-6 rounded-xl border transition-all duration-200 hover:shadow-lg ${
      isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
          <MessageSquare className="h-5 w-5 text-green-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">SMS Fertilizer Service</h3>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Test SMS-based soil analysis for farmers
          </p>
        </div>
      </div>

      {/* Service Info */}
      <div className={`mb-6 p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-green-50'}`}>
        <div className="flex items-center space-x-2 mb-2">
          <Phone className="h-4 w-4 text-green-600" />
          <span className="font-medium text-green-600">SMS Number: +1 856 595 3915</span>
        </div>
        <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Farmers can send SMS messages to get instant fertilizer recommendations without internet access.
        </p>
      </div>

      {/* SMS Format Guide */}
      <div className="mb-6">
        <h4 className="font-medium mb-3 flex items-center space-x-2">
          <HelpCircle className="h-4 w-4 text-blue-600" />
          <span>SMS Formats</span>
        </h4>
        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium">Format:</span>
              <code className={`ml-2 px-2 py-1 rounded ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
                Temp:25,Humidity:60,Moisture:30,Soil_Type:Sandy,Crop_Type:Wheat,N:50,P:30,K:20
              </code>
            </div>
            <div>
              <span className="font-medium">Allowed Soil_Type:</span>
              <code className={`ml-2 px-2 py-1 rounded ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
                Sandy, Clay, Loamy
              </code>
            </div>
            <div>
              <span className="font-medium">Allowed Crop_Type:</span>
              <code className={`ml-2 px-2 py-1 rounded ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
                Wheat, Rice, Maize, Sugarcane, Cotton, Tobacco, Paddy, Barley, Millets, Oil Seeds, Pulses, Ground Nuts, Beans, Potato, Cassava, Banana
              </code>
            </div>
            <div>
              <span className="font-medium">Help:</span>
              <code className={`ml-2 px-2 py-1 rounded ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
                HELP
              </code>
            </div>
          </div>
          <div className="mt-3 text-xs text-gray-500">
            All fields are required. Example: Temp:25,Humidity:60,Moisture:30,Soil_Type:Sandy,Crop_Type:Wheat,N:50,P:30,K:20
          </div>
        </div>
      </div>

      {/* SMS Tester */}
      <div className="mb-6">
        <h4 className="font-medium mb-3">SMS Simulator</h4>
        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-1 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Phone Number
            </label>
            <input
              type="text"
              value={testPhone}
              onChange={(e) => setTestPhone(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white focus:border-green-500' 
                  : 'bg-white border-gray-300 text-gray-900 focus:border-green-500'
              } focus:outline-none focus:ring-2 focus:ring-green-500/20`}
              placeholder="+1 856 595 3915"
            />
          </div>
          
          <div>
            <label className={`block text-sm font-medium mb-1 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              SMS Message
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={testMessage}
                onChange={(e) => setTestMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleTestSMS()}
                className={`flex-1 px-3 py-2 rounded-lg border transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white focus:border-green-500' 
                    : 'bg-white border-gray-300 text-gray-900 focus:border-green-500'
                } focus:outline-none focus:ring-2 focus:ring-green-500/20`}
                placeholder="Temp:25,Humidity:60,Moisture:30,Soil_Type:Sandy,Crop_Type:Wheat,N:0.5,P:30,K:20"
              />
              <button
                onClick={handleTestSMS}
                disabled={isProcessing || !testMessage.trim()}
                className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
              >
                {isProcessing ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Send className="h-4 w-4" />
                )}
                <span>{isProcessing ? 'Processing...' : 'Send'}</span>
              </button>
            </div>
          </div>

          {/* Quick Test Buttons */}
          <div>
            <p className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Quick Tests:
            </p>
            <div className="flex flex-wrap gap-2">
              {quickTestMessages.map((test, index) => (
                <button
                  key={index}
                  onClick={() => setTestMessage(test.message)}
                  className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                    isDarkMode 
                      ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  {test.label}
                </button>
              ))}
            </div>
          </div>

          {/* Response Display */}
          {testResponse && (
            <div className={`p-4 rounded-lg border ${
              isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-blue-50 border-blue-200'
            }`}>
              <h5 className="font-medium mb-2">SMS Response:</h5>
              <pre className={`text-sm whitespace-pre-wrap ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {testResponse}
              </pre>
            </div>
          )}
        </div>
      </div>

      {/* SMS History */}
      <div>
        <h4 className="font-medium mb-3">Recent SMS Interactions</h4>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {smsHistory.length > 0 ? (
            smsHistory.map((sms) => (
              <div
                key={sms.id}
                className={`p-3 rounded-lg border transition-all ${
                  isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-sm">{sms.phoneNumber}</span>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getTypeColor(sms.type)}`}>
                      {sms.type.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(sms.status)}
                    <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {new Date(sms.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
                <div className="text-sm">
                  <div className={`mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <span className="font-medium">Sent:</span> {sms.message}
                  </div>
                  <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    <span className="font-medium">Response:</span> {sms.response.substring(0, 100)}
                    {sms.response.length > 100 && '...'}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <MessageSquare className={`h-12 w-12 mx-auto mb-4 ${
                isDarkMode ? 'text-gray-600' : 'text-gray-400'
              }`} />
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                No SMS interactions yet. Try sending a test message above.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SMSService;