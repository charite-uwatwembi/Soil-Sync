import {
    CategoryScale,
    Chart as ChartJS,
    Filler,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip
} from 'chart.js';
import { BarChart3, Calendar, TrendingUp } from 'lucide-react';
import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface RecommendationChartProps {
  isDarkMode: boolean;
  data: Array<{
    date: string;
    fertilizer: string;
    rate: number;
    confidence: number;
  }>;
}

const RecommendationChart: React.FC<RecommendationChartProps> = ({ 
  isDarkMode, 
  data 
}) => {
  const [viewMode, setViewMode] = useState<'weekly' | 'monthly'>('weekly');
  const [selectedMetric, setSelectedMetric] = useState<'both' | 'rate' | 'confidence'>('both');

  // Function to aggregate data by time period
  const aggregateData = (data: any[], period: 'weekly' | 'monthly') => {
    if (data.length === 0) return [];
    
    const aggregated = new Map();
    
    data.forEach((item, index) => {
      const date = new Date(item.date);
      let key: string;
      
      if (period === 'weekly') {
        // Group by week
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        key = weekStart.toISOString().split('T')[0];
      } else {
        // Group by month
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      }
      
      // For same-day entries, add sequence number to make them unique
      if (data.filter(d => d.date === item.date).length > 1) {
        key = `${key}-${index}`;
      }
      
      if (!aggregated.has(key)) {
        aggregated.set(key, {
          date: key,
          originalDate: item.date,
          rates: [],
          confidences: [],
          fertilizers: []
        });
      }
      
      aggregated.get(key).rates.push(item.rate);
      aggregated.get(key).confidences.push(item.confidence);
      aggregated.get(key).fertilizers.push(item.fertilizer);
    });
    
    return Array.from(aggregated.values()).map(group => ({
      date: group.date,
      originalDate: group.originalDate,
      avgRate: group.rates.reduce((sum: number, val: number) => sum + val, 0) / group.rates.length,
      avgConfidence: group.confidences.reduce((sum: number, val: number) => sum + val, 0) / group.confidences.length,
      count: group.rates.length,
      fertilizers: [...new Set(group.fertilizers)]
    })).sort((a, b) => new Date(a.originalDate).getTime() - new Date(b.originalDate).getTime());
  };

  // For session data, show all points but limit to last 20 for readability
  const limitedData = data.slice(-20);
  
  // For session data, we often have multiple entries on the same day
  // So we'll show individual points with time-based labels
  const processedData = limitedData.map((item, index) => ({
    date: item.date,
    avgRate: item.rate,
    avgConfidence: item.confidence,
    count: 1,
    fertilizers: [item.fertilizer],
    index: index + 1 // For labeling
  }));
  
  const aggregatedData = viewMode === 'weekly' ? processedData : aggregateData(limitedData, viewMode);

  const formatDate = (dateStr: string, originalDate?: string) => {
    const date = new Date(originalDate || dateStr);
    if (viewMode === 'weekly') {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    }
  };

  const chartData = {
    labels: aggregatedData.map((item, index) => 
      viewMode === 'weekly' ? `Prediction ${item.index || index + 1}` : formatDate(item.date, item.originalDate)
    ),
    datasets: [
      ...(selectedMetric === 'both' || selectedMetric === 'rate' ? [{
        label: `Avg Application Rate (kg/ha)`,
        data: aggregatedData.map(item => Math.round(item.avgRate)),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        fill: selectedMetric === 'rate',
        tension: 0.4,
        pointBackgroundColor: 'rgb(34, 197, 94)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
        yAxisID: 'y',
      }] : []),
      ...(selectedMetric === 'both' || selectedMetric === 'confidence' ? [{
        label: `Avg Confidence (%)`,
        data: aggregatedData.map(item => Math.round(item.avgConfidence)),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: selectedMetric === 'confidence',
        tension: 0.4,
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
        yAxisID: selectedMetric === 'both' ? 'y1' : 'y',
      }] : [])
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: isDarkMode ? '#e5e7eb' : '#374151',
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
        titleColor: isDarkMode ? '#e5e7eb' : '#374151',
        bodyColor: isDarkMode ? '#e5e7eb' : '#374151',
        borderColor: isDarkMode ? '#374151' : '#e5e7eb',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          afterBody: (context: any) => {
            const index = context[0].dataIndex;
            const item = aggregatedData[index];
            return [
              `Samples: ${item.count}`,
              `Fertilizers: ${item.fertilizers.slice(0, 2).join(', ')}${item.fertilizers.length > 2 ? '...' : ''}`
            ];
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: isDarkMode ? '#374151' : '#f3f4f6',
          display: true,
        },
        ticks: {
          color: isDarkMode ? '#9ca3af' : '#6b7280',
          maxRotation: 45,
          font: {
            size: 11
          }
        }
      },
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        grid: {
          color: isDarkMode ? '#374151' : '#f3f4f6',
        },
        ticks: {
          color: isDarkMode ? '#9ca3af' : '#6b7280',
          font: {
            size: 11
          }
        },
        title: {
          display: true,
          text: selectedMetric === 'confidence' ? 'Confidence (%)' : 'Application Rate (kg/ha)',
          color: isDarkMode ? '#9ca3af' : '#6b7280',
          font: {
            size: 12
          }
        }
      },
      ...(selectedMetric === 'both' ? {
        y1: {
          type: 'linear' as const,
          display: true,
          position: 'right' as const,
          grid: {
            drawOnChartArea: false,
          },
          ticks: {
            color: isDarkMode ? '#9ca3af' : '#6b7280',
            font: {
              size: 11
            }
          },
          title: {
            display: true,
            text: 'Confidence (%)',
            color: isDarkMode ? '#9ca3af' : '#6b7280',
            font: {
              size: 12
            }
          }
        }
      } : {})
    },
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
  };

  return (
    <div className={`p-6 rounded-xl border transition-all duration-200 hover:shadow-lg ${
      isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
            <BarChart3 className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Recommendation History</h3>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {viewMode === 'weekly' ? 'Individual predictions' : 'Grouped by date'} • {aggregatedData.length} {viewMode === 'weekly' ? 'predictions' : 'periods'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Time Period Toggle */}
          <div className={`flex rounded-lg border ${
            isDarkMode ? 'border-gray-600' : 'border-gray-300'
          }`}>
            <button
              onClick={() => setViewMode('weekly')}
              className={`px-3 py-1 text-xs rounded-l-lg transition-colors ${
                viewMode === 'weekly'
                  ? 'bg-blue-600 text-white'
                  : isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-700'
              }`}
            >
              Individual
            </button>
            <button
              onClick={() => setViewMode('monthly')}
              className={`px-3 py-1 text-xs rounded-r-lg transition-colors ${
                viewMode === 'monthly'
                  ? 'bg-blue-600 text-white'
                  : isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-700'
              }`}
            >
              Grouped
            </button>
          </div>

          {/* Metric Toggle */}
          <div className={`flex rounded-lg border ${
            isDarkMode ? 'border-gray-600' : 'border-gray-300'
          }`}>
            <button
              onClick={() => setSelectedMetric('both')}
              className={`px-3 py-1 text-xs rounded-l-lg transition-colors ${
                selectedMetric === 'both'
                  ? 'bg-green-600 text-white'
                  : isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-700'
              }`}
            >
              Both
            </button>
            <button
              onClick={() => setSelectedMetric('rate')}
              className={`px-3 py-1 text-xs transition-colors ${
                selectedMetric === 'rate'
                  ? 'bg-green-600 text-white'
                  : isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-700'
              }`}
            >
              Rate
            </button>
            <button
              onClick={() => setSelectedMetric('confidence')}
              className={`px-3 py-1 text-xs rounded-r-lg transition-colors ${
                selectedMetric === 'confidence'
                  ? 'bg-green-600 text-white'
                  : isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-700'
              }`}
            >
              Confidence
            </button>
          </div>
        </div>
      </div>

      <div className="h-80">
        {data.length > 0 ? (
          <Line data={chartData} options={options} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <BarChart3 className={`h-12 w-12 mx-auto mb-4 ${
                isDarkMode ? 'text-gray-600' : 'text-gray-400'
              }`} />
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                No recommendations yet
              </p>
              <p className={`text-sm mt-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                Submit soil data above to see your prediction trends here
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      {aggregatedData.length > 0 && (
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className={`p-3 rounded-lg ${
            isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
          }`}>
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Avg Rate
              </span>
            </div>
            <p className="text-lg font-semibold mt-1">
              {Math.round(aggregatedData.reduce((sum, item) => sum + item.avgRate, 0) / aggregatedData.length)} kg/ha
            </p>
          </div>
          
          <div className={`p-3 rounded-lg ${
            isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
          }`}>
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4 text-blue-600" />
              <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Avg Confidence
              </span>
            </div>
            <p className="text-lg font-semibold mt-1">
              {Math.round(aggregatedData.reduce((sum, item) => sum + item.avgConfidence, 0) / aggregatedData.length)}%
            </p>
          </div>
          
          <div className={`p-3 rounded-lg ${
            isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
          }`}>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-purple-600" />
              <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Total Samples
              </span>
            </div>
            <p className="text-lg font-semibold mt-1">
              {aggregatedData.reduce((sum, item) => sum + item.count, 0)}
            </p>
          </div>
          
          <div className={`p-3 rounded-lg ${
            isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
          }`}>
            <div className="flex items-center space-x-2">
              <div className="h-4 w-4 bg-gradient-to-r from-green-500 to-blue-500 rounded-full"></div>
              <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Periods
              </span>
            </div>
            <p className="text-lg font-semibold mt-1">
              {aggregatedData.length}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecommendationChart;