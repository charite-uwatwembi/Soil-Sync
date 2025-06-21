import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, Zap, Thermometer, Droplets, Activity } from 'lucide-react';

interface IoTSimulatorProps {
  isDarkMode: boolean;
  onDataReceived: (sensorData: SensorData) => void;
}

interface SensorData {
  temperature: number;
  humidity: number;
  soilMoisture: number;
  ph: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  timestamp: string;
  deviceId: string;
}

const IoTSimulator: React.FC<IoTSimulatorProps> = ({ isDarkMode, onDataReceived }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentData, setCurrentData] = useState<SensorData | null>(null);
  const [devices, setDevices] = useState([
    { id: 'SOIL_001', name: 'Field Sensor A', location: 'North Field', status: 'online' },
    { id: 'SOIL_002', name: 'Field Sensor B', location: 'South Field', status: 'online' },
    { id: 'SOIL_003', name: 'Field Sensor C', location: 'East Field', status: 'offline' }
  ]);

  // Simulate sensor data generation
  const generateSensorData = (deviceId: string): SensorData => {
    return {
      temperature: 20 + Math.random() * 15, // 20-35°C
      humidity: 40 + Math.random() * 40, // 40-80%
      soilMoisture: 30 + Math.random() * 40, // 30-70%
      ph: 5.5 + Math.random() * 2, // 5.5-7.5
      nitrogen: 0.1 + Math.random() * 0.4, // 0.1-0.5%
      phosphorus: 5 + Math.random() * 20, // 5-25 ppm
      potassium: 50 + Math.random() * 150, // 50-200 ppm
      timestamp: new Date().toISOString(),
      deviceId
    };
  };

  // Start data streaming
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isStreaming && isConnected) {
      interval = setInterval(() => {
        const activeDevices = devices.filter(d => d.status === 'online');
        if (activeDevices.length > 0) {
          const randomDevice = activeDevices[Math.floor(Math.random() * activeDevices.length)];
          const sensorData = generateSensorData(randomDevice.id);
          setCurrentData(sensorData);
          onDataReceived(sensorData);
        }
      }, 5000); // Update every 5 seconds
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isStreaming, isConnected, devices, onDataReceived]);

  const toggleConnection = () => {
    setIsConnected(!isConnected);
    if (!isConnected) {
      setIsStreaming(false);
    }
  };

  const toggleStreaming = () => {
    if (isConnected) {
      setIsStreaming(!isStreaming);
    }
  };

  const toggleDeviceStatus = (deviceId: string) => {
    setDevices(prev => prev.map(device => 
      device.id === deviceId 
        ? { ...device, status: device.status === 'online' ? 'offline' : 'online' }
        : device
    ));
  };

  return (
    <div className={`p-6 rounded-xl border transition-all duration-200 hover:shadow-lg ${
      isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${
            isConnected ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20'
          }`}>
            {isConnected ? (
              <Wifi className="h-5 w-5 text-green-600" />
            ) : (
              <WifiOff className="h-5 w-5 text-red-600" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold">IoT Sensor Network</h3>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {isConnected ? 'Connected' : 'Disconnected'} • {devices.filter(d => d.status === 'online').length} devices online
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleConnection}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isConnected
                ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400'
                : 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400'
            }`}
          >
            {isConnected ? 'Disconnect' : 'Connect'}
          </button>
          {isConnected && (
            <button
              onClick={toggleStreaming}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isStreaming
                  ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400'
                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/20 dark:text-blue-400'
              }`}
            >
              {isStreaming ? 'Stop Stream' : 'Start Stream'}
            </button>
          )}
        </div>
      </div>

      {/* Device Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {devices.map((device) => (
          <div
            key={device.id}
            className={`p-4 rounded-lg border cursor-pointer transition-all ${
              device.status === 'online'
                ? isDarkMode ? 'bg-green-900/10 border-green-700' : 'bg-green-50 border-green-200'
                : isDarkMode ? 'bg-red-900/10 border-red-700' : 'bg-red-50 border-red-200'
            }`}
            onClick={() => toggleDeviceStatus(device.id)}
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`w-3 h-3 rounded-full ${
                device.status === 'online' ? 'bg-green-500' : 'bg-red-500'
              }`}></div>
              <span className={`text-xs font-medium ${
                device.status === 'online' ? 'text-green-600' : 'text-red-600'
              }`}>
                {device.status.toUpperCase()}
              </span>
            </div>
            <h4 className="font-medium text-sm">{device.name}</h4>
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {device.location}
            </p>
            <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              ID: {device.id}
            </p>
          </div>
        ))}
      </div>

      {/* Current Sensor Data */}
      {currentData && isStreaming && (
        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <div className="flex items-center space-x-2 mb-4">
            <Activity className="h-4 w-4 text-blue-600" />
            <span className="font-medium">Live Sensor Data</span>
            <span className={`text-xs px-2 py-1 rounded-full ${
              isDarkMode ? 'bg-blue-900/20 text-blue-400' : 'bg-blue-100 text-blue-600'
            }`}>
              {currentData.deviceId}
            </span>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <Thermometer className="h-6 w-6 mx-auto mb-1 text-red-500" />
              <p className="text-sm font-medium">{currentData.temperature.toFixed(1)}°C</p>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Temperature</p>
            </div>
            <div className="text-center">
              <Droplets className="h-6 w-6 mx-auto mb-1 text-blue-500" />
              <p className="text-sm font-medium">{currentData.humidity.toFixed(1)}%</p>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Humidity</p>
            </div>
            <div className="text-center">
              <Zap className="h-6 w-6 mx-auto mb-1 text-green-500" />
              <p className="text-sm font-medium">{currentData.soilMoisture.toFixed(1)}%</p>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Soil Moisture</p>
            </div>
            <div className="text-center">
              <Activity className="h-6 w-6 mx-auto mb-1 text-purple-500" />
              <p className="text-sm font-medium">{currentData.ph.toFixed(1)}</p>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>pH Level</p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-300 dark:border-gray-600">
            <h5 className="font-medium mb-2">Nutrient Levels</h5>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm font-medium">{currentData.nitrogen.toFixed(2)}%</p>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Nitrogen</p>
              </div>
              <div>
                <p className="text-sm font-medium">{currentData.phosphorus.toFixed(1)} ppm</p>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Phosphorus</p>
              </div>
              <div>
                <p className="text-sm font-medium">{currentData.potassium.toFixed(1)} ppm</p>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Potassium</p>
              </div>
            </div>
          </div>

          <div className="mt-3 text-center">
            <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              Last updated: {new Date(currentData.timestamp).toLocaleTimeString()}
            </p>
          </div>
        </div>
      )}

      {!isConnected && (
        <div className="text-center py-8">
          <WifiOff className={`h-12 w-12 mx-auto mb-4 ${
            isDarkMode ? 'text-gray-600' : 'text-gray-400'
          }`} />
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Connect to start receiving sensor data
          </p>
        </div>
      )}
    </div>
  );
};

export default IoTSimulator;