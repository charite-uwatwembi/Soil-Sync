import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import SoilForm from './components/SoilForm';
import RecommendationCard from './components/RecommendationCard';
import RecommendationChart from './components/RecommendationChart';
import SoilVisualizationChart from './components/SoilVisualizationChart';
import AgriNews from './components/AgriNews';
import DataTable from './components/DataTable';
import AuthModal from './components/AuthModal';
import NavigationPages from './components/NavigationPages';
import { soilAnalysisService, type SoilData, type Recommendation } from './services/soilAnalysisService';
import { authService, type AuthUser } from './services/authService';
import { isDemoMode } from './lib/supabase';

interface HistoryData {
  id: number;
  date: string;
  cropType: string;
  fertilizer: string;
  rate: number;
  confidence: number;
  phosphorus: number;
  potassium: number;
  nitrogen: number;
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
        if (!isDemoMode) {
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);
        }
        // Always load user data (demo or real)
        loadUserData();
      } catch (error) {
        console.error('Auth initialization error:', error);
        // Load demo data on error
        loadUserData();
      }
    };

    initAuth();

    // Listen for auth changes only if not in demo mode
    if (!isDemoMode) {
      const { data: { subscription } } = authService.onAuthStateChange((user) => {
        setUser(user);
        if (user) {
          loadUserData();
        } else {
          // Clear user data when signed out, but keep demo data
          setHistoryData([]);
          setChartData([]);
        }
      });

      return () => {
        subscription?.unsubscribe();
      };
    }
  }, []);

  // Load user's historical data
  const loadUserData = async () => {
    try {
      const analyses = await soilAnalysisService.getAnalysisHistory(20);
      
      const historyItems: HistoryData[] = analyses.map((analysis, index) => ({
        id: index + 1,
        date: new Date(analysis.createdAt).toLocaleDateString(),
        cropType: analysis.soilData.cropType,
        fertilizer: analysis.fertilizer,
        rate: analysis.rate,
        confidence: Math.round(analysis.confidence),
        phosphorus: analysis.soilData.phosphorus,
        potassium: analysis.soilData.potassium,
        nitrogen: analysis.soilData.nitrogen
      }));

      setHistoryData(historyItems);

      const chartItems = analyses.map(analysis => ({
        date: new Date(analysis.createdAt).toLocaleDateString(),
        fertilizer: analysis.fertilizer,
        rate: analysis.rate,
        confidence: Math.round(analysis.confidence)
      }));

      setChartData(chartItems);
    } catch (error) {
      console.error('Failed to load user data:', error);
      // Don't throw error, just log it - the app should continue working
    }
  };

  const handleSoilSubmit = async (soilData: SoilData) => {
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
        cropType: soilData.cropType,
        fertilizer: recommendation.fertilizer,
        rate: recommendation.rate,
        confidence: Math.round(recommendation.confidence),
        phosphorus: soilData.phosphorus,
        potassium: soilData.potassium,
        nitrogen: soilData.nitrogen
      };

      setHistoryData(prev => [newHistoryItem, ...prev]);

      // Add to chart data
      const newChartItem = {
        date: new Date().toLocaleDateString(),
        fertilizer: recommendation.fertilizer,
        rate: recommendation.rate,
        confidence: Math.round(recommendation.confidence)
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
      if (!isDemoMode) {
        await authService.signOut();
      }
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  const handleSensorData = (sensorData: any) => {
    // Convert sensor data to soil data format
    const soilData: SoilData = {
      phosphorus: sensorData.phosphorus,
      potassium: sensorData.potassium,
      nitrogen: sensorData.nitrogen,
      organicCarbon: 2.5, // Default value
      cationExchange: 15, // Default value
      sandPercent: 40, // Default value
      clayPercent: 30, // Default value
      siltPercent: 30, // Default value
      rainfall: 1200, // Default value
      elevation: 1500, // Default value
      cropType: 'maize' // Default value
    };

    // Auto-submit for analysis
    handleSoilSubmit(soilData);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      {/* Demo Mode Banner */}
      {isDemoMode && (
        <div className="bg-yellow-500 text-black px-4 py-2 text-center text-sm font-medium">
          🚀 Demo Mode - Configure Supabase to enable user accounts and cloud storage
        </div>
      )}
      
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
      } ${isDemoMode ? 'mt-20' : 'mt-16'} p-6`}>
        <div className="max-w-7xl mx-auto">
          {activePage === 'Dashboard' ? (
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

      {/* Auth Modal */}
      {!isDemoMode && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onAuthSuccess={() => {
            setShowAuthModal(false);
            loadUserData();
          }}
          isDarkMode={isDarkMode}
        />
      )}
    </div>
  );
}

export default App;