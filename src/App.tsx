import { useEffect, useState } from 'react';
import AgriNews from './components/AgriNews';
import AuthModal from './components/AuthModal';
import DataTable from './components/DataTable';
import Footer from './components/Footer';
import LandingPage from './components/LandingPage';
import CookiePolicy from './components/Legal/CookiePolicy';
import DataProtection from './components/Legal/DataProtection';
import PrivacyPolicy from './components/Legal/PrivacyPolicy';
import TermsOfService from './components/Legal/TermsOfService';
import NavigationPages from './components/NavigationPages';
import RecommendationCard from './components/RecommendationCard';
import RecommendationChart from './components/RecommendationChart';
import Sidebar from './components/Sidebar';
import type { SoilModelInput } from './components/SoilForm';
import SoilForm, { cropTypeOptions } from './components/SoilForm';
import SoilVisualizationChart from './components/SoilVisualizationChart';
import TopBar from './components/TopBar';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
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
  const { isDark: isDarkMode, toggleTheme: toggleDarkMode } = useTheme();
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
  const [authMode, setAuthMode] = useState<'signIn' | 'signUp' | 'forgotPassword'>('signIn');
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  console.log('App.tsx: Initial user state:', user);

  // Initialize auth state
  useEffect(() => {
    console.log('App.tsx: useEffect - Setting up auth state listener.');
    const { data: { subscription } } = authService.onAuthStateChange((user) => {
      console.log('App.tsx: Auth state changed! User (from listener):', user);
      setUser(user);
      if (user) {
        setShowAuthModal(false); // Hide modal if user signs in
        loadUserData(); // Load history and chart data on login
        setCurrentRecommendation(null); // Clear current summary on login
        setCurrentSoilData(null); // Clear current summary on login
      } else {
        setCurrentRecommendation(null); // Clear current recommendation
        setCurrentSoilData(null); // Clear current soil data
        setChartData([]); // Clear chart data
        setHistoryData([]); // Clear history data explicitly on logout
      }
      console.log('App.tsx: User state AFTER listener update:', user);
    });

    // Initial check (can be combined with onAuthStateChange if it fires immediately)
    authService.getCurrentUser().then(currentUser => {
      console.log('App.tsx: Initial getCurrentUser check. User (from promise):', currentUser);
      setUser(currentUser);
      if (currentUser) {
        setShowAuthModal(false);
        loadUserData(); // Load history and chart data on initial load if user exists
        setCurrentRecommendation(null); // Explicitly clear current summary on initial load if user exists
        setCurrentSoilData(null); // Explicitly clear current summary on initial load if user exists
      } else {
        setCurrentRecommendation(null); // Ensure cleared on initial load if no user
        setCurrentSoilData(null); // Ensure cleared on initial load if no user
        setChartData([]); // Ensure cleared on initial load if no user
        setHistoryData([]); // Ensure cleared on initial load if no user
      }
      setIsLoadingAuth(false); // Set loading to false after initial check
      console.log('App.tsx: User state AFTER initial getCurrentUser check:', currentUser);
    });

    return () => {
      console.log('App.tsx: useEffect cleanup - Unsubscribing auth state listener.');
      subscription.unsubscribe();
    };
  }, []);

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    // Optionally redirect or update UI after successful authentication
  };

  const openAuthModal = (mode: 'signIn' | 'signUp' | 'forgotPassword') => {
    console.log('App.tsx: openAuthModal called with mode:', mode);
    setAuthMode(mode);
    setShowAuthModal(true);
    console.log('App.tsx: showAuthModal set to true.');
  };

  console.log('App.tsx: User state before conditional render:', user);
  console.log('App.tsx: showAuthModal state before rendering AuthModal:', showAuthModal);

  // Load user's historical data
  const loadUserData = async () => {
    try {
      const analyses = await soilAnalysisService.getAnalysisHistory(100);
      const historyItems: HistoryData[] = analyses.map((analysis, index) => ({
        id: index + 1,
        date: new Date(analysis.createdAt).toLocaleDateString(),
        cropType: analysis.soilData.Crop_Type,
        fertilizer: analysis.fertilizer,
        rate: Number(analysis.rate),
        confidence: Math.round(Number(analysis.confidence))
      }));
      setHistoryData(historyItems);
      setChartData(historyItems.map(item => ({
        date: item.date,
        fertilizer: item.fertilizer,
        rate: item.rate,
        confidence: item.confidence
      })));
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  };

  const handleSoilSubmit = async (soilData: SoilModelInput) => {
    setLoading(true);
    try {
      // Get prediction from the service
      const recommendation = await soilAnalysisService.predictFertilizer(soilData);
      setCurrentRecommendation(recommendation);
      setCurrentSoilData(soilData);

      // Save to database
      const newAnalysisId = await soilAnalysisService.saveAnalysis(soilData, recommendation);

      // Refresh history from database to ensure persistence and consistency
      await loadUserData();

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
      // UI state updates (setUser, setShowAuthModal, setHistoryData, setChartData)
      // are now handled by the onAuthStateChange listener in useEffect
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  const handleSensorData = (sensorData: any) => {
    console.log('Received sensor data:', sensorData);
    const randomCropType = cropTypeOptions[Math.floor(Math.random() * cropTypeOptions.length)].value;

    // Convert sensor data to soil data format (new model fields)
    const soilData: SoilData = {
      Phosphorous: sensorData.phosphorus ?? 15,
      Potassium: sensorData.potassium ?? 100,
      Nitrogen: sensorData.nitrogen ?? 0.2,
      Soil_Type: 'Loamy',
      Crop_Type: randomCropType,
      Temparature: sensorData.temparature ?? 25,
      Humidity: sensorData.humidity ?? 60,
      Moisture: sensorData.moisture ?? 30
    };
    // Auto-submit for analysis
    handleSoilSubmit(soilData);
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  if (isLoadingAuth) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <p>Loading authentication state...</p>
      </div>
    );
  }

  return (
    <ThemeProvider>
      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          mode={authMode}
          onAuthSuccess={() => {
            setShowAuthModal(false);
            loadUserData();
          }}
          onModeChange={setAuthMode}
          isDarkMode={isDarkMode}
        />
      )}

      {activePage === 'Privacy Policy' ? (
        <PrivacyPolicy isDarkMode={isDarkMode} onPageChange={setActivePage} />
      ) : activePage === 'Terms of Service' ? (
        <TermsOfService isDarkMode={isDarkMode} onPageChange={setActivePage} />
      ) : activePage === 'Cookie Policy' ? (
        <CookiePolicy isDarkMode={isDarkMode} onPageChange={setActivePage} />
      ) : activePage === 'Data Protection' ? (
        <DataProtection isDarkMode={isDarkMode} onPageChange={setActivePage} />
      ) : !user ? (
        <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
          <LandingPage
            isDarkMode={isDarkMode}
            onGetStarted={() => openAuthModal('signIn')}
            isAuthenticated={!!user}
            user={user}
            onSignOut={handleSignOut}
            toggleDarkMode={toggleDarkMode}
            onPageChange={setActivePage}
          />
        </div>
      ) : (
        <div className={`flex min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
          <Sidebar 
            isCollapsed={isCollapsed} 
            isDarkMode={isDarkMode} 
            user={user}
            activePage={activePage}
            onPageChange={setActivePage}
            onSignOut={handleSignOut}
          />
          <div className={`flex flex-col flex-1 transition-all duration-300 ${isCollapsed ? 'ml-16' : 'ml-64'}`}>
            <TopBar 
              isCollapsed={isCollapsed}
              setIsCollapsed={setIsCollapsed}
              isDarkMode={isDarkMode}
              toggleDarkMode={toggleDarkMode}
              user={user}
              onSignIn={() => openAuthModal('signIn')}
              onSignOut={handleSignOut}
              toggleSidebar={toggleSidebar}
              isSidebarOpen={isCollapsed}
            />
            <main className={`flex-1 transition-all duration-300 p-6 mt-16`}>
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
                    historyData={historyData}
                  />
                )}
              </div>
            </main>
            <Footer onPageChange={setActivePage} />
          </div>
        </div>
      )}
    </ThemeProvider>
  );
}

export default App;