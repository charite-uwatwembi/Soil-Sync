import { Download } from 'lucide-react';
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface HistoryData {
  id: number;
  date: string;
  cropType: string;
  fertilizer: string;
  rate: number;
  confidence: number;
}

interface DataTableProps {
  isDarkMode: boolean;
  data: HistoryData[];
}

const DataTable: React.FC<DataTableProps> = ({ isDarkMode, data }) => {
  const { t } = useLanguage();

  const exportToCSV = () => {
    if (data.length === 0) return;

    const headers = [
      t('table.date'),
      t('table.crop'),
      t('table.fertilizer'),
      t('table.rate'),
      t('table.confidence')
    ];

    const csvContent = [
      headers.join(','),
      ...data.map(row => [
        row.date,
        row.cropType,
        row.fertilizer,
        `${row.rate} kg/ha`,
        `${row.confidence}%`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'soil_analysis_data.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (data.length === 0) {
    return (
      <div className={`rounded-xl border ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">{t('dashboard.analysisSummary')}</h3>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {t('dashboard.batchProcessing')}
              </p>
            </div>
            <button
              onClick={exportToCSV}
              disabled
              className="flex items-center space-x-2 px-4 py-2 bg-gray-400 text-white rounded-lg text-sm font-medium cursor-not-allowed"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">{t('table.exportCSV')}</span>
            </button>
          </div>
          <div className="text-center py-8">
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              No analysis data available. Submit soil data to see results here.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-xl border ${
      isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <div className="p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 space-y-2 sm:space-y-0">
          <div>
            <h3 className="text-lg font-semibold mb-2">{t('dashboard.analysisSummary')}</h3>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {t('dashboard.batchProcessing')}
            </p>
          </div>
          <button
            onClick={exportToCSV}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">{t('table.exportCSV')}</span>
          </button>
        </div>
        
        {/* Mobile Card View */}
        <div className="block md:hidden space-y-3">
          {data.map((row) => (
            <div key={row.id} className={`p-4 rounded-lg border ${
              isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="flex justify-between items-start mb-2">
                <span className="font-medium">{row.cropType}</span>
                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {row.date}
                </span>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                    {t('table.fertilizer')}:
                  </span>
                  <span>{row.fertilizer}</span>
                </div>
                <div className="flex justify-between">
                  <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                    {t('table.rate')}:
                  </span>
                  <span>{row.rate} kg/ha</span>
                </div>
                <div className="flex justify-between">
                  <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                    {t('table.confidence')}:
                  </span>
                  <span className="text-green-600 font-medium">{row.confidence}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <th className={`text-left py-3 px-4 font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {t('table.date')}
                </th>
                <th className={`text-left py-3 px-4 font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {t('table.crop')}
                </th>
                <th className={`text-left py-3 px-4 font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {t('table.fertilizer')}
                </th>
                <th className={`text-left py-3 px-4 font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {t('table.rate')}
                </th>
                <th className={`text-left py-3 px-4 font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {t('table.confidence')}
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.id} className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} hover:${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} transition-colors`}>
                  <td className="py-3 px-4 text-sm">{row.date}</td>
                  <td className="py-3 px-4 text-sm font-medium">{row.cropType}</td>
                  <td className="py-3 px-4 text-sm">{row.fertilizer}</td>
                  <td className="py-3 px-4 text-sm">{row.rate} kg/ha</td>
                  <td className="py-3 px-4 text-sm">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                      {row.confidence}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DataTable;