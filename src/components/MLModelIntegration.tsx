import React, { useState, useEffect } from 'react';
import { Brain, Upload, Download, Settings, TrendingUp, AlertCircle, CheckCircle, Activity, Server } from 'lucide-react';
import { mlModelService } from '../services/mlModelService';

interface MLModelIntegrationProps {
  isDarkMode: boolean;
}

interface ModelHealth {
  status: string;
  latency: number;
  modelVersion: string;
}

interface ModelAnalytics {
  totalPredictions: number;
  averageConfidence: number;
  averageProcessingTime: number;
  cropDistribution: Record<string, number>;
  confidenceDistribution: Record<string, number>;
}

const MLModelIntegration: React.FC<MLModelIntegrationProps> = ({ isDarkMode }) => {
  const [modelHealth, setModelHealth] = useState<ModelHealth | null>(null);
  const [analytics, setAnalytics] = useState<ModelAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);
  const [isTestingModel, setIsTestingModel] = useState(false);

  useEffect(() => {
    loadModelHealth();
    loadAnalytics();
  }, []);

  const loadModelHealth = async () => {
    try {
      const health = await mlModelService.getModelHealth();
      setModelHealth(health);
    } catch (error) {
      console.error('Failed to load model health:', error);
    }
  };

  const loadAnalytics = async () => {
    try {
      const analyticsData = await mlModelService.getPredictionAnalytics(30);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    }
  };

  const testModel = async () => {
    setIsTestingModel(true);
    try {
      const testInput = {
        phosphorus: 15,
        potassium: 120,
        nitrogen: 0.25,
        organicCarbon: 2.0,
        cationExchange: 15,
        sandPercent: 40,
        clayPercent: 30,
        siltPercent: 30,
        rainfall: 1200,
        elevation: 1500,
        cropType: 'maize'
      };

      const result = await mlModelService.predict(testInput);
      setTestResult(result);
    } catch (error) {
      console.error('Model test failed:', error);
      setTestResult({ error: error.message });
    } finally {
      setIsTestingModel(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'unhealthy':
        return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      default:
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'unhealthy':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Activity className="h-4 w-4 text-yellow-600" />;
    }
  };

  return (
    <div className={`p-6 rounded-xl border transition-all duration-200 hover:shadow-lg ${
      isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
          <Brain className="h-5 w-5 text-purple-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">ML Model Management</h3>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Manage and monitor your joblib ML model
          </p>
        </div>
      </div>

      {/* Model Health Status */}
      <div className="mb-6">
        <h4 className="font-medium mb-3 flex items-center space-x-2">
          <Server className="h-4 w-4 text-blue-600" />
          <span>Model Health Status</span>
        </h4>
        
        {modelHealth ? (
          <div className={`p-4 rounded-lg border ${
            modelHealth.status === 'healthy' 
              ? isDarkMode ? 'bg-green-900/10 border-green-700' : 'bg-green-50 border-green-200'
              : isDarkMode ? 'bg-red-900/10 border-red-700' : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                {getStatusIcon(modelHealth.status)}
                <span className={`font-medium ${getStatusColor(modelHealth.status)}`}>
                  {modelHealth.status.toUpperCase()}
                </span>
              </div>
              <button
                onClick={loadModelHealth}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                Refresh
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Response Time
                </p>
                <p className="font-medium">{modelHealth.latency}ms</p>
              </div>
              <div>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Model Version
                </p>
                <p className="font-medium">{modelHealth.modelVersion}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <div className="animate-pulse">
              <div className={`h-4 rounded mb-2 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
              <div className={`h-4 rounded w-3/4 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
            </div>
          </div>
        )}
      </div>

      {/* Model Testing */}
      <div className="mb-6">
        <h4 className="font-medium mb-3 flex items-center space-x-2">
          <Activity className="h-4 w-4 text-green-600" />
          <span>Model Testing</span>
        </h4>
        
        <div className="space-y-3">
          <button
            onClick={testModel}
            disabled={isTestingModel}
            className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
          >
            {isTestingModel ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Testing Model...</span>
              </>
            ) : (
              <>
                <Activity className="h-4 w-4" />
                <span>Test Model Prediction</span>
              </>
            )}
          </button>

          {testResult && (
            <div className={`p-4 rounded-lg border ${
              testResult.error 
                ? isDarkMode ? 'bg-red-900/10 border-red-700' : 'bg-red-50 border-red-200'
                : isDarkMode ? 'bg-blue-900/10 border-blue-700' : 'bg-blue-50 border-blue-200'
            }`}>
              <h5 className="font-medium mb-2">Test Result:</h5>
              {testResult.error ? (
                <p className="text-red-600 text-sm">{testResult.error}</p>
              ) : (
                <div className="space-y-2 text-sm">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="font-medium">Fertilizer:</span> {testResult.fertilizer}
                    </div>
                    <div>
                      <span className="font-medium">Rate:</span> {testResult.applicationRate} kg/ha
                    </div>
                    <div>
                      <span className="font-medium">Confidence:</span> {testResult.confidenceScore}%
                    </div>
                    <div>
                      <span className="font-medium">Processing:</span> {testResult.processingTime}ms
                    </div>
                  </div>
                  <div>
                    <span className="font-medium">Model Version:</span> {testResult.modelVersion}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Model Analytics */}
      {analytics && (
        <div className="mb-6">
          <h4 className="font-medium mb-3 flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 text-purple-600" />
            <span>Model Analytics (Last 30 Days)</span>
          </h4>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <p className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Total Predictions
              </p>
              <p className="text-lg font-bold text-blue-600">{analytics.totalPredictions}</p>
            </div>
            <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <p className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Avg Confidence
              </p>
              <p className="text-lg font-bold text-green-600">{analytics.averageConfidence.toFixed(1)}%</p>
            </div>
            <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <p className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Avg Response Time
              </p>
              <p className="text-lg font-bold text-purple-600">{analytics.averageProcessingTime.toFixed(0)}ms</p>
            </div>
            <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <p className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Model Status
              </p>
              <p className="text-lg font-bold text-green-600">Active</p>
            </div>
          </div>

          {/* Crop Distribution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h5 className="font-medium mb-2">Crop Distribution</h5>
              <div className="space-y-2">
                {Object.entries(analytics.cropDistribution).map(([crop, count]) => (
                  <div key={crop} className="flex justify-between items-center">
                    <span className="text-sm capitalize">{crop}</span>
                    <span className="text-sm font-medium">{count}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h5 className="font-medium mb-2">Confidence Distribution</h5>
              <div className="space-y-2">
                {Object.entries(analytics.confidenceDistribution).map(([range, count]) => (
                  <div key={range} className="flex justify-between items-center">
                    <span className="text-sm">{range}</span>
                    <span className="text-sm font-medium">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Deployment Instructions */}
      <div>
        <h4 className="font-medium mb-3 flex items-center space-x-2">
          <Upload className="h-4 w-4 text-orange-600" />
          <span>Deployment Instructions</span>
        </h4>
        
        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <div className="space-y-3 text-sm">
            <div>
              <p className="font-medium mb-1">1. Prepare Your Model</p>
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Place your trained .joblib model files in the <code className="bg-gray-200 dark:bg-gray-600 px-1 rounded">ML_Models</code> folder
              </p>
            </div>
            
            <div>
              <p className="font-medium mb-1">2. Deploy ML Server</p>
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Run: <code className="bg-gray-200 dark:bg-gray-600 px-1 rounded">./deployment/deploy-ml-model.sh</code>
              </p>
            </div>
            
            <div>
              <p className="font-medium mb-1">3. Update Environment</p>
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Set <code className="bg-gray-200 dark:bg-gray-600 px-1 rounded">ML_MODEL_ENDPOINT</code> in your environment variables
              </p>
            </div>
            
            <div>
              <p className="font-medium mb-1">4. Test Integration</p>
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Use the "Test Model Prediction" button above to verify everything works
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MLModelIntegration;