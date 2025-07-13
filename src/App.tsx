import { useEffect, useState } from 'react';
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
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
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

function AppContent() {
  const { isDark: isDarkMode, toggleTheme: toggleDarkMode } = useTheme();
  const { t } = useLanguage();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activePage, setActivePage] = useState('Dashboard');
  const [currentRecommendation, setCurrentRecommendation] = useState<Recommendation | null>(null);
  const [currentSoilData, setCurrentSoilData] = useState<SoilData | null>(null);
  
  // Separate session data (temporary - cleared on logout) from permanent data
  const [sessionData, setSessionData] = useState<HistoryData[]>([]); // For Analysis Summary on Dashboard
  const [historyData, setHistoryData] = useState<HistoryData[]>([]); // For Analysis History on History page
  
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
        loadUserData(); // Load permanent history data on login
        setCurrentRecommendation(null); // Clear current recommendation on login
        setCurrentSoilData(null); // Clear current soil data on login
        setSessionData([]); // Clear session data on login (fresh session)
      } else {
        // On logout: clear session data but keep permanent data structure
        setCurrentRecommendation(null);
        setCurrentSoilData(null);
        setSessionData([]); // Clear session data on logout
        setChartData([]);
        setHistoryData([]); // Clear permanent data on logout
      }
      console.log('App.tsx: User state AFTER listener update:', user);
    });

    // Initial check (can be combined with onAuthStateChange if it fires immediately)
    authService.getCurrentUser().then(currentUser => {
      console.log('App.tsx: Initial getCurrentUser check. User (from promise):', currentUser);
      setUser(currentUser);
      if (currentUser) {
        setShowAuthModal(false);
        loadUserData(); // Load permanent history data on initial load if user exists
        setCurrentRecommendation(null);
        setCurrentSoilData(null);
        setSessionData([]); // Start with empty session data
      } else {
        setCurrentRecommendation(null);
        setCurrentSoilData(null);
        setSessionData([]);
        setChartData([]);
        setHistoryData([]);
      }
      setIsLoadingAuth(false);
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
      console.log('loadUserData: Starting to load analysis history...');
      const analyses = await soilAnalysisService.getAnalysisHistory(100);
      console.log('loadUserData: Raw analyses from database:', analyses);
      
      const historyItems: HistoryData[] = analyses.map((analysis, index) => ({
        id: index + 1,
        date: new Date(analysis.createdAt).toLocaleDateString(),
        cropType: analysis.cropName || analysis.soilData.Crop_Type,
        fertilizer: analysis.fertilizer,
        rate: Number(analysis.rate),
        confidence: Math.round(Number(analysis.confidence))
      }));
      
      console.log('loadUserData: Processed history items:', historyItems);
      setHistoryData(historyItems);
      
      setChartData(historyItems.map(item => ({
        date: item.date,
        fertilizer: item.fertilizer,
        rate: item.rate,
        confidence: item.confidence
      })));
      
      console.log('loadUserData: History data and chart data updated');
    } catch (error) {
      console.error('loadUserData: Failed to load user data:', error);
    }
  };

  const handleSoilSubmit = async (soilData: SoilModelInput) => {
    setLoading(true);
    try {
      console.log('handleSoilSubmit: Starting soil analysis for:', soilData);
      
      // Get prediction from the service
      const recommendation = await soilAnalysisService.predictFertilizer(soilData);
      console.log('handleSoilSubmit: Got recommendation:', recommendation);
      
      setCurrentRecommendation(recommendation);
      setCurrentSoilData(soilData);

      // Save to database permanently
      console.log('handleSoilSubmit: Attempting to save to database...');
      const newAnalysisId = await soilAnalysisService.saveAnalysis(soilData, recommendation);
      console.log('handleSoilSubmit: Save completed with ID:', newAnalysisId);

      // Refresh permanent history from database
      console.log('handleSoilSubmit: Refreshing history data...');
      await loadUserData();
      console.log('handleSoilSubmit: History data refreshed');

      // Add to session data for immediate display in Analysis Summary
      const newSessionItem: HistoryData = {
        id: Date.now(), // Use timestamp for unique ID
        date: new Date().toLocaleDateString(),
        cropType: soilData.Crop_Type,
        fertilizer: recommendation.fertilizer,
        rate: Number(recommendation.rate),
        confidence: Math.round(Number(recommendation.confidence))
      };
      console.log('handleSoilSubmit: Adding to session data:', newSessionItem);
      setSessionData(prev => {
        const updated = [newSessionItem, ...prev];
        console.log('handleSoilSubmit: Session data updated:', updated);
        return updated;
      });

    } catch (error) {
      console.error('handleSoilSubmit: Failed to process soil analysis:', error);
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
    console.log('handleSensorData: Received sensor data:', sensorData);
    const randomCropType = cropTypeOptions[Math.floor(Math.random() * cropTypeOptions.length)].value;

    // Map sensor data format to soil data format
    const soilData: SoilData = {
      Phosphorous: sensorData.phosphorus ?? (Math.random() * 40 + 5), // 5-45 ppm
      Potassium: sensorData.potassium ?? (Math.random() * 200 + 50), // 50-250 ppm
      Nitrogen: sensorData.nitrogen ?? (Math.random() * 0.5 + 0.1), // 0.1-0.6%
      Soil_Type: sensorData.soil_type ?? ['Sandy', 'Loamy', 'Clay'][Math.floor(Math.random() * 3)],
      Crop_Type: randomCropType,
      Temparature: sensorData.temperature ?? (Math.random() * 15 + 18), // Fix: use temperature not temparature
      Humidity: sensorData.humidity ?? (Math.random() * 40 + 40), // 40-80%
      Moisture: sensorData.soilMoisture ?? (Math.random() * 50 + 20) // Fix: use soilMoisture not moisture
    };
    
    console.log('handleSensorData: Generated soil data:', soilData);
    
    // Auto-submit for analysis
    handleSoilSubmit(soilData);
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  if (isLoadingAuth) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <p>{t('common.loading')}</p>
      </div>
    );
  }

  return (
    <>
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
        <>
          <PrivacyPolicy isDarkMode={isDarkMode} onPageChange={setActivePage} />
          <Footer onPageChange={setActivePage} />
        </>
      ) : activePage === 'Terms of Service' ? (
        <>
          <TermsOfService isDarkMode={isDarkMode} onPageChange={setActivePage} />
          <Footer onPageChange={setActivePage} />
        </>
      ) : activePage === 'Cookie Policy' ? (
        <>
          <CookiePolicy isDarkMode={isDarkMode} onPageChange={setActivePage} />
          <Footer onPageChange={setActivePage} />
        </>
      ) : activePage === 'Data Protection' ? (
        <>
          <DataProtection isDarkMode={isDarkMode} onPageChange={setActivePage} />
          <Footer onPageChange={setActivePage} />
        </>
      ) : !user ? (
        <>
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
          <Footer onPageChange={setActivePage} />
        </>
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
          <div className={`flex flex-col flex-1 transition-all duration-300 ${isCollapsed ? 'md:ml-16' : 'md:ml-64'}`}>
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
            <main className={`flex-1 transition-all duration-300 p-4 md:p-6 mt-16`}>
              <div className="max-w-7xl mx-auto">
                {activePage === 'Dashboard' ? (
                  <div className="space-y-4 md:space-y-6">
                    {/* Top Row - Current Recommendation */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                      <div className="lg:col-span-2 order-2 lg:order-1">
                        <RecommendationCard 
                          isDarkMode={isDarkMode}
                          recommendation={currentRecommendation}
                        />
                      </div>
                      <div className="order-1 lg:order-2">
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
                    {/* Third Row - Chart */}
                    <div>
                      <RecommendationChart 
                        isDarkMode={isDarkMode}
                        data={sessionData.map(item => ({
                          date: item.date,
                          fertilizer: item.fertilizer,
                          rate: item.rate,
                          confidence: item.confidence
                        }))}
                      />
                    </div>
                    {/* Bottom Row - Analysis Summary (Session Data) */}
                    <div>
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold mb-2">{t('dashboard.analysisSummary')}</h3>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {t('dashboard.batchProcessing')}
                        </p>
                      </div>
                      <DataTable 
                        isDarkMode={isDarkMode}
                        data={sessionData}
                      />
                    </div>
                  </div>
                ) : (
                  <NavigationPages 
                    isDarkMode={isDarkMode} 
                    activePage={activePage}
                    onSensorData={handleSensorData}
                    historyData={historyData}
                    user={user}
                  />
                )}
              </div>
            </main>
            <Footer onPageChange={setActivePage} />
          </div>
        </div>
      )}
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;