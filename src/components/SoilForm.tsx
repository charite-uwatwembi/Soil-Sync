import { Beaker } from 'lucide-react';
import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export interface SoilModelInput {
  Phosphorous: number;
  Potassium: number;
  Nitrogen: number;
  Soil_Type: string;
  Crop_Type: string;
  Temparature: number;
  Humidity: number;
  Moisture: number;
}

interface SoilFormProps {
  isDarkMode: boolean;
  onSubmit: (data: SoilModelInput) => void;
  loading: boolean;
}

export const cropTypeOptions = [
  { value: 'Maize', label: 'Maize' },
  { value: 'Rice', label: 'Rice' },
  { value: 'Wheat', label: 'Wheat' },
  { value: 'Sugarcane', label: 'Sugarcane' },
  { value: 'Cotton', label: 'Cotton' },
  { value: 'Tobacco', label: 'Tobacco' },
  { value: 'Paddy', label: 'Paddy' },
  { value: 'Barley', label: 'Barley' },
  { value: 'Millets', label: 'Millets' },
  { value: 'Oil seeds', label: 'Oil seeds' },
  { value: 'Pulses', label: 'Pulses' },
  { value: 'Ground Nuts', label: 'Ground Nuts' },
  { value: 'Beans', label: 'Beans' },
  { value: 'Potato', label: 'Potato' },
  { value: 'Cassava', label: 'Cassava' },
  { value: 'Banana', label: 'Banana' }
];

const soilTypeOptions = [
  { value: 'Sandy', label: 'Sandy' },
  { value: 'Loamy', label: 'Loamy' },
  { value: 'Clay', label: 'Clay' }
];

const SoilForm: React.FC<SoilFormProps> = ({ isDarkMode, onSubmit, loading }) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState<SoilModelInput>({
    Phosphorous: 0,
    Potassium: 0,
    Nitrogen: 0,
    Soil_Type: 'Loamy',
    Crop_Type: 'Maize',
    Temparature: 25,
    Humidity: 60,
    Moisture: 30
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field: keyof SoilModelInput, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className={`p-6 rounded-xl border ${
      isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
          <Beaker className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">{t('dashboard.newAnalysis')}</h3>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {t('dashboard.enterParameters')}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Temperature and Humidity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="temperature" className={`block text-sm font-medium mb-2 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {t('form.temperature')}
            </label>
            <input
              id="temperature"
              type="number"
              value={formData.Temparature}
              onChange={(e) => handleChange('Temparature', parseFloat(e.target.value))}
              className={`w-full px-3 py-2 rounded-lg border ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              required
            />
          </div>
          <div>
            <label htmlFor="humidity" className={`block text-sm font-medium mb-2 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {t('form.humidity')}
            </label>
            <input
              id="humidity"
              type="number"
              value={formData.Humidity}
              onChange={(e) => handleChange('Humidity', parseFloat(e.target.value))}
              className={`w-full px-3 py-2 rounded-lg border ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              required
            />
          </div>
        </div>

        {/* Moisture and Soil Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {t('form.moisture')}
            </label>
            <input
              type="number"
              value={formData.Moisture}
              onChange={(e) => handleChange('Moisture', parseFloat(e.target.value))}
              className={`w-full px-3 py-2 rounded-lg border ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              required
            />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {t('form.soilType')}
            </label>
            <select
              value={formData.Soil_Type}
              onChange={(e) => handleChange('Soil_Type', e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              required
            >
              {soilTypeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Crop Type and Nitrogen */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {t('form.cropType')}
            </label>
            <select
              value={formData.Crop_Type}
              onChange={(e) => handleChange('Crop_Type', e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              required
            >
              {cropTypeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="nitrogen" className={`block text-sm font-medium mb-2 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {t('form.nitrogen')}
            </label>
            <input
              id="nitrogen"
              type="number"
              step="0.01"
              value={formData.Nitrogen}
              onChange={(e) => handleChange('Nitrogen', parseFloat(e.target.value))}
              className={`w-full px-3 py-2 rounded-lg border ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              required
            />
          </div>
        </div>

        {/* Potassium and Phosphorous */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {t('form.potassium')}
            </label>
            <input
              type="number"
              value={formData.Potassium}
              onChange={(e) => handleChange('Potassium', parseFloat(e.target.value))}
              className={`w-full px-3 py-2 rounded-lg border ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              required
            />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {t('form.phosphorous')}
            </label>
            <input
              type="number"
              value={formData.Phosphorous}
              onChange={(e) => handleChange('Phosphorous', parseFloat(e.target.value))}
              className={`w-full px-3 py-2 rounded-lg border ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
        >
          {loading && (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          )}
          <span>{loading ? t('common.loading') : t('form.getRecommendation')}</span>
        </button>
      </form>
    </div>
  );
};

export default SoilForm;