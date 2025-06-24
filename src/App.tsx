import { useEffect, useState } from 'react';
import AgriNews from './components/AgriNews';
import AuthModal from './components/AuthModal';
import DataTable from './components/DataTable';
import NavigationPages from './components/NavigationPages';
import RecommendationCard from './components/RecommendationCard';
import RecommendationChart from './components/RecommendationChart';
import Sidebar from './components/Sidebar';
import type { SoilModelInput } from './components/SoilForm';
import SoilForm from './components/SoilForm';
import SoilVisualizationChart from './components/SoilVisualizationChart';
import TopBar from './components/TopBar';
import { authService, type AuthUser } from './services/authService';
import { soilAnalysisService, type Recommendation, type SoilData } from './services/soilAnalysisService';

interface HistoryData {
  id: number;
  date: string;
  cropType: string;
  fertilizer: string;
  rate: number;
  confidence: number;
}

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activePage, setActivePage] = useState('Dashboard');
  const [currentRecommendation, setCurrentRecommendation] = useState<Recommendation | null>(null);
  const [currentSoilData, setCurrentSoilData] = useState<SoilData | null>(null);
  const [historyData, setHistoryData] = useState<HistoryData[]>([]);
  const [chartData, setChartData] = useState<Array<{
    date: string;
    fertilizer: string;
    rate: number;
    confidence: number;
  }>>([]);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
        if (currentUser) {
          loadUserData();
        }
      } catch (error) {
        setUser(null);
      }
    };
    initAuth();
    const { data: { subscription } } = authService.onAuthStateChange((user) => {
      setUser(user);
      if (user) {
        loadUserData();
      } else {
        setHistoryData([]);
        setChartData([]);
      }
    });
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Load user's historical data
  const loadUserData = async () => {
    try {
      const analyses = await soilAnalysisService.getAnalysisHistory(20);
      
      const historyItems: HistoryData[] = analyses.map((analysis, index) => ({
        id: index + 1,
        date: new Date(analysis.createdAt).toLocaleDateString(),
        cropType: analysis.soilData.Crop_Type,
        fertilizer: analysis.fertilizer,
        rate: Number(analysis.rate),
        confidence: Math.round(Number(analysis.confidence))
      }));

      setHistoryData(historyItems);

      const chartItems = analyses.map(analysis => ({
        date: new Date(analysis.createdAt).toLocaleDateString(),
        fertilizer: analysis.fertilizer,
        rate: Number(analysis.rate),
        confidence: Math.round(Number(analysis.confidence))
      }));

      setChartData(chartItems);
    } catch (error) {
      console.error('Failed to load user data:', error);
      // Don't throw error, just log it - the app should continue working
    }
  };

  const handleSoilSubmit = async (soilData: SoilModelInput) => {
    setLoading(true);
    try {
      // Get prediction from the service
      const recommendation = await soilAnalysisService.predictFertilizer(soilData);
      setCurrentRecommendation(recommendation);
      setCurrentSoilData(soilData);

      // Save to database or local storage
      await soilAnalysisService.saveAnalysis(soilData, recommendation);

      // Add to local state for immediate UI update
      const newHistoryItem: HistoryData = {
        id: Date.now(),
        date: new Date().toLocaleDateString(),
        cropType: soilData.Crop_Type,
        fertilizer: recommendation.fertilizer,
        rate: recommendation.rate as number,
        confidence: Math.round(Number(recommendation.confidence))
      };

      setHistoryData(prev => [newHistoryItem, ...prev]);

      // Add to chart data
      const newChartItem = {
        date: new Date().toLocaleDateString(),
        fertilizer: recommendation.fertilizer,
        rate: recommendation.rate as number,
        confidence: Math.round(Number(recommendation.confidence))
      };

      setChartData(prev => [...prev, newChartItem].slice(-10)); // Keep last 10 entries

    } catch (error) {
      console.error('Failed to process soil analysis:', error);
      // You might want to show an error message to the user here
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await authService.signOut();
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  const handleSensorData = (sensorData: any) => {
    // Convert sensor data to soil data format (new model fields)
    const soilData: SoilData = {
      Phosphorous: sensorData.phosphorus ?? 15,
      Potassium: sensorData.potassium ?? 100,
      Nitrogen: sensorData.nitrogen ?? 0.2,
      Soil_Type: 'Loamy',
      Crop_Type: 'maize',
      Temparature: sensorData.temparature ?? 25,
      Humidity: sensorData.humidity ?? 60,
      Moisture: sensorData.moisture ?? 30
    };
    // Auto-submit for analysis
    handleSoilSubmit(soilData);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <Sidebar 
        isCollapsed={isCollapsed} 
        isDarkMode={isDarkMode} 
        user={user}
        activePage={activePage}
        onPageChange={setActivePage}
      />
      <TopBar 
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        user={user}
        onSignIn={() => setShowAuthModal(true)}
        onSignOut={handleSignOut}
      />
      
      <main className={`transition-all duration-300 ${
        isCollapsed ? 'ml-16' : 'ml-64'
      } mt-16 p-6`}>
        <div className="max-w-7xl mx-auto">
          {/* If not authenticated, show only AuthModal */}
          {!user ? (
            <AuthModal
              isOpen={true}
              onClose={() => {}}
              onAuthSuccess={() => {
                setShowAuthModal(false);
                loadUserData();
              }}
              isDarkMode={isDarkMode}
            />
          ) : (
            activePage === 'Dashboard' ? (
              <div className="space-y-6">
                {/* Top Row - Current Recommendation */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <RecommendationCard 
                      isDarkMode={isDarkMode}
                      recommendation={currentRecommendation}
                    />
                  </div>
                  <div>
                    <SoilForm 
                      isDarkMode={isDarkMode}
                      onSubmit={handleSoilSubmit}
                      loading={loading}
                    />
                  </div>
                </div>

                {/* Middle Row - Soil Visualization */}
                <div>
                  <SoilVisualizationChart 
                    isDarkMode={isDarkMode}
                    soilData={currentSoilData}
                    recommendation={currentRecommendation}
                  />
                </div>

                {/* Third Row - Chart and News */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <RecommendationChart 
                      isDarkMode={isDarkMode}
                      data={chartData}
                    />
                  </div>
                  <div>
                    <AgriNews isDarkMode={isDarkMode} />
                  </div>
                </div>

                {/* Bottom Row - Data Table */}
                <div>
                  <DataTable 
                    isDarkMode={isDarkMode}
                    data={historyData}
                  />
                </div>
              </div>
            ) : (
              <NavigationPages 
                isDarkMode={isDarkMode} 
                activePage={activePage}
                onSensorData={handleSensorData}
              />
            )
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className={`${
        isCollapsed ? 'ml-16' : 'ml-64'
      } transition-all duration-300 ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      } border-t mt-12`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                © 2024 SoilSync. Powered by AI for Smart Agriculture.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button className={`text-sm hover:text-green-600 transition-colors ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Privacy Policy
              </button>
              <button className={`text-sm hover:text-green-600 transition-colors ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Terms of Service
              </button>
              <button className={`text-sm hover:text-green-600 transition-colors ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Support
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;