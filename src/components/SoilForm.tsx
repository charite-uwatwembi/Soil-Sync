import { Beaker, Loader } from 'lucide-react';
import React, { useState } from 'react';

interface SoilFormProps {
  isDarkMode: boolean;
  onSubmit: (data: SoilModelInput) => void;
  loading?: boolean;
}

// Match backend model's expected input
export interface SoilModelInput {
  Temparature: number;
  Humidity: number;
  Moisture: number;
  Soil_Type: string;
  Crop_Type: string;
  Nitrogen: number;
  Potassium: number;
  Phosphorous: number;
}

const soilTypeOptions = [
  { value: 'Sandy', label: 'Sandy' },
  { value: 'Loamy', label: 'Loamy' },
  { value: 'Clay', label: 'Clay' },
  { value: 'Silty', label: 'Silty' },
  { value: 'Peaty', label: 'Peaty' },
  { value: 'Chalky', label: 'Chalky' },
  { value: 'Saline', label: 'Saline' },
];

const cropTypeOptions = [
  { value: 'maize', label: 'Maize' },
  { value: 'rice', label: 'Rice' },
  { value: 'beans', label: 'Beans' },
  { value: 'potato', label: 'Potato' },
  { value: 'cassava', label: 'Cassava' },
  { value: 'banana', label: 'Banana' },
];

const SoilForm: React.FC<SoilFormProps> = ({ isDarkMode, onSubmit, loading = false }) => {
  const [formData, setFormData] = useState<SoilModelInput>({
    Temparature: 25,
    Humidity: 60,
    Moisture: 30,
    Soil_Type: 'Loamy',
    Crop_Type: 'maize',
    Nitrogen: 0.2,
    Potassium: 100,
    Phosphorous: 15,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleInputChange = (field: keyof SoilModelInput, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: typeof value === 'string' && (field === 'Soil_Type' || field === 'Crop_Type') ? value : Number(value)
    }));
  };

  return (
    <div className={`p-6 rounded-xl border transition-all duration-200 hover:shadow-lg ${
      isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
          <Beaker className="h-5 w-5 text-green-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">New Soil Analysis</h3>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Enter soil parameters for fertilizer recommendation</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Temparature (°C)</label>
            <input type="number" step="0.1" value={formData.Temparature} onChange={e => handleInputChange('Temparature', e.target.value)} className={`w-full px-3 py-2 rounded-lg border transition-colors ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-green-500' : 'bg-white border-gray-300 text-gray-900 focus:border-green-500'} focus:outline-none focus:ring-2 focus:ring-green-500/20`} />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Humidity (%)</label>
            <input type="number" step="0.1" value={formData.Humidity} onChange={e => handleInputChange('Humidity', e.target.value)} className={`w-full px-3 py-2 rounded-lg border transition-colors ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-green-500' : 'bg-white border-gray-300 text-gray-900 focus:border-green-500'} focus:outline-none focus:ring-2 focus:ring-green-500/20`} />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Moisture (%)</label>
            <input type="number" step="0.1" value={formData.Moisture} onChange={e => handleInputChange('Moisture', e.target.value)} className={`w-full px-3 py-2 rounded-lg border transition-colors ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-green-500' : 'bg-white border-gray-300 text-gray-900 focus:border-green-500'} focus:outline-none focus:ring-2 focus:ring-green-500/20`} />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Soil Type</label>
            <select value={formData.Soil_Type} onChange={e => handleInputChange('Soil_Type', e.target.value)} className={`w-full px-3 py-2 rounded-lg border transition-colors ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-green-500' : 'bg-white border-gray-300 text-gray-900 focus:border-green-500'} focus:outline-none focus:ring-2 focus:ring-green-500/20`}>
              {soilTypeOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Crop Type</label>
            <select value={formData.Crop_Type} onChange={e => handleInputChange('Crop_Type', e.target.value)} className={`w-full px-3 py-2 rounded-lg border transition-colors ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-green-500' : 'bg-white border-gray-300 text-gray-900 focus:border-green-500'} focus:outline-none focus:ring-2 focus:ring-green-500/20`}>
              {cropTypeOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Nitrogen (%)</label>
            <input type="number" step="0.01" value={formData.Nitrogen} onChange={e => handleInputChange('Nitrogen', e.target.value)} className={`w-full px-3 py-2 rounded-lg border transition-colors ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-green-500' : 'bg-white border-gray-300 text-gray-900 focus:border-green-500'} focus:outline-none focus:ring-2 focus:ring-green-500/20`} />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Potassium (ppm)</label>
            <input type="number" step="0.1" value={formData.Potassium} onChange={e => handleInputChange('Potassium', e.target.value)} className={`w-full px-3 py-2 rounded-lg border transition-colors ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-green-500' : 'bg-white border-gray-300 text-gray-900 focus:border-green-500'} focus:outline-none focus:ring-2 focus:ring-green-500/20`} />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Phosphorous (ppm)</label>
            <input type="number" step="0.1" value={formData.Phosphorous} onChange={e => handleInputChange('Phosphorous', e.target.value)} className={`w-full px-3 py-2 rounded-lg border transition-colors ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-green-500' : 'bg-white border-gray-300 text-gray-900 focus:border-green-500'} focus:outline-none focus:ring-2 focus:ring-green-500/20`} />
          </div>
        </div>
        <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500/20 flex items-center justify-center space-x-2">
          {loading ? (
            <>
              <Loader className="h-4 w-4 animate-spin" />
              <span>Analyzing Soil...</span>
            </>
          ) : (
            <span>Get Fertilizer Recommendation</span>
          )}
        </button>
      </form>
    </div>
  );
};

export default SoilForm;