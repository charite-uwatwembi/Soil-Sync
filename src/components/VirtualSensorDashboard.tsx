import { Activity, MapPin, Pause, Phone, Play, Zap } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { virtualSensorService } from '../services/virtualSensorService';

interface VirtualSensorDashboardProps {
  isDarkMode: boolean;
}

const VirtualSensorDashboard: React.FC<VirtualSensorDashboardProps> = ({ isDarkMode }) => {
  const [simulationStatus, setSimulationStatus] = useState({
    isRunning: false,
    totalSensors: 0,
    activeSensors: 0,
    scenarios: [] as string[]
  });
  
  const [sensors, setSensors] = useState<any[]>([]);
  const [selectedScenario, setSelectedScenario] = useState('optimal_conditions');
  const [isLoading, setIsLoading] = useState(false);
  const [lastSMS, setLastSMS] = useState<string>('');
  const [smsHistory, setSmsHistory] = useState<Array<{
    timestamp: string;
    farmer: string;
    message: string;
    status: string;
  }>>([]);

  // Load initial data
  useEffect(() => {
    loadSimulationData();
  }, []);

  const loadSimulationData = async () => {
    try {
      const status = virtualSensorService.getSimulationStatus();
      setSimulationStatus(status);
      
      const sensorList = virtualSensorService.getSensors();
      setSensors(sensorList);
    } catch (error) {
      console.error('Failed to load simulation data:', error);
    }
  };

  const handleStartSimulation = async () => {
    setIsLoading(true);
    try {
      await virtualSensorService.startSimulation(selectedScenario);
      await loadSimulationData();
      setLastSMS('🌱 Virtual sensor simulation started! SMS notifications enabled.');
    } catch (error) {
      console.error('Failed to start simulation:', error);
      setLastSMS('❌ Failed to start simulation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStopSimulation = () => {
    virtualSensorService.stopSimulation();
    loadSimulationData();
    setLastSMS('🛑 Virtual sensor simulation stopped.');
  };

  const handleScenarioChange = (newScenario: string) => {
    setSelectedScenario(newScenario);
    if (simulationStatus.isRunning) {
      virtualSensorService.changeScenario(newScenario);
      setLastSMS(`🔄 Scenario changed to: ${newScenario}`);
    }
  };

  const handleToggleSensor = (deviceId: string) => {
    virtualSensorService.toggleSensor(deviceId);
    loadSimulationData();
    setLastSMS(`📡 Sensor ${deviceId} toggled`);
  };

  const handleTriggerManualSMS = async (deviceId: string) => {
    setIsLoading(true);
    try {
      await virtualSensorService.triggerManualSMS(deviceId);
      const sensor = sensors.find(s => s.id === deviceId);
      setLastSMS(`📱 Manual SMS sent to ${sensor?.farmer_name}`);
      
      // Add to SMS history
      setSmsHistory(prev => [{
        timestamp: new Date().toLocaleTimeString(),
        farmer: sensor?.farmer_name || 'Unknown',
        message: 'Manual fertilizer recommendation sent',
        status: 'sent'
      }, ...prev.slice(0, 9)]);
    } catch (error) {
      console.error('Failed to trigger manual SMS:', error);
      setLastSMS('❌ Failed to send manual SMS');
    } finally {
      setIsLoading(false);
    }
  };

  const getScenarioDescription = (scenario: string): string => {
    const descriptions: Record<string, string> = {
      'optimal_conditions': 'Ideal growing conditions with balanced nutrients',
      'drought_stress': 'Drought conditions with low moisture and nutrients',
      'nutrient_deficiency': 'Low nutrient levels requiring fertilizer application',
      'rainy_season': 'High moisture conditions with nutrient leaching',
      'early_growth': 'Seedling stage with specific nutrient needs'
    };
    return descriptions[scenario] || scenario;
  };

  const getStatusColor = (enabled: boolean): string => {
    if (enabled) {
      return isDarkMode ? 'text-green-400' : 'text-green-600';
    }
    return isDarkMode ? 'text-red-400' : 'text-red-600';
  };

  const getCropIcon = (cropType: string): string => {
    const icons: Record<string, string> = {
      'maize': '🌽',
      'rice': '🍚',
      'potato': '🥔',
      'beans': '🫘',
      'wheat': '🌾'
    };
    return icons[cropType] || '🌱';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Zap className="h-6 w-6 text-blue-600" />
            Virtual Sensor Network
          </h2>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            IoT-driven proactive SMS system with realistic sensor simulation
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            simulationStatus.isRunning 
              ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
              : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
          }`}>
            {simulationStatus.isRunning ? '🟢 Running' : '🔴 Stopped'}
          </div>
          
          <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {simulationStatus.activeSensors}/{simulationStatus.totalSensors} Active
          </div>
        </div>
      </div>

      {/* Control Panel */}
      <div className={`p-6 rounded-xl border ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <h3 className="text-lg font-semibold mb-4">Simulation Control</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Scenario Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Simulation Scenario</label>
            <select
              value={selectedScenario}
              onChange={(e) => handleScenarioChange(e.target.value)}
              className={`w-full p-3 rounded-lg border ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              {simulationStatus.scenarios.map(scenario => (
                <option key={scenario} value={scenario}>
                  {scenario.replace('_', ' ').toUpperCase()}
                </option>
              ))}
            </select>
            <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {getScenarioDescription(selectedScenario)}
            </p>
          </div>

          {/* Control Buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={simulationStatus.isRunning ? handleStopSimulation : handleStartSimulation}
              disabled={isLoading}
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors ${
                simulationStatus.isRunning
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {simulationStatus.isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {isLoading ? 'Processing...' : simulationStatus.isRunning ? 'Stop Simulation' : 'Start Simulation'}
            </button>

            {lastSMS && (
              <div className={`p-3 rounded-lg text-sm ${
                isDarkMode ? 'bg-blue-900/20 text-blue-400' : 'bg-blue-50 text-blue-700'
              }`}>
                {lastSMS}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Virtual Sensors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sensors.map((sensor) => (
          <div key={sensor.id} className={`p-4 rounded-lg border ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            {/* Sensor Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">{getCropIcon(sensor.crop_type)}</span>
                <div>
                  <h4 className="font-medium">{sensor.name}</h4>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {sensor.farmer_name}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  sensor.enabled ? 'bg-green-500' : 'bg-red-500'
                }`} />
                <span className={`text-xs ${getStatusColor(sensor.enabled)}`}>
                  {sensor.enabled ? 'Active' : 'Disabled'}
                </span>
              </div>
            </div>

            {/* Sensor Details */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-3 w-3" />
                <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                  {sensor.location.city}, {sensor.location.district}
                </span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <Activity className="h-3 w-3" />
                <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                  {sensor.crop_type.toUpperCase()} - {sensor.soil_type}
                </span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-3 w-3" />
                <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                  {sensor.farmer_phone}
                </span>
              </div>
            </div>

            {/* Sensor Controls */}
            <div className="flex gap-2">
              <button
                onClick={() => handleToggleSensor(sensor.id)}
                className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  sensor.enabled
                    ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400'
                    : 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400'
                }`}
              >
                {sensor.enabled ? 'Disable' : 'Enable'}
              </button>
              
              <button
                onClick={() => handleTriggerManualSMS(sensor.id)}
                disabled={!sensor.enabled || isLoading}
                className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  sensor.enabled && !isLoading
                    ? 'bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/20 dark:text-blue-400'
                    : 'bg-gray-100 text-gray-500 cursor-not-allowed dark:bg-gray-900/20 dark:text-gray-600'
                }`}
              >
                <Phone className="h-3 w-3 mx-auto" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* SMS History */}
      {smsHistory.length > 0 && (
        <div className={`p-6 rounded-xl border ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Recent SMS Activity
          </h3>
          
          <div className="space-y-3">
            {smsHistory.map((sms, index) => (
              <div key={index} className={`p-3 rounded-lg border ${
                isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{sms.farmer}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      sms.status === 'sent' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                    }`}>
                      {sms.status}
                    </span>
                  </div>
                  <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {sms.timestamp}
                  </span>
                </div>
                <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {sms.message}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Integration Info */}
      <div className={`p-6 rounded-xl border ${
        isDarkMode ? 'bg-blue-900/20 border-blue-800' : 'bg-blue-50 border-blue-200'
      }`}>
        <h3 className="text-lg font-semibold mb-2 text-blue-600">Twilio Integration</h3>
        <p className={`text-sm ${isDarkMode ? 'text-blue-400' : 'text-blue-700'}`}>
          Virtual sensors automatically trigger proactive SMS via your existing Twilio setup (+1 856 595 3915).
          No farmer input required - the system monitors soil conditions and sends recommendations proactively.
        </p>
        
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-blue-600" />
            <span>Automatic monitoring</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-blue-600" />
            <span>Proactive SMS alerts</span>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-blue-600" />
            <span>ML-powered recommendations</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VirtualSensorDashboard; 