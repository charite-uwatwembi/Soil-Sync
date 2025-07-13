import React, { createContext, useContext, useEffect, useState } from 'react';

// Translation types
export type Language = 'en' | 'rw';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation data
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.analytics': 'Analytics',
    'nav.crops': 'Crops',
    'nav.soilData': 'Soil Data',
    'nav.agricultureNews': 'Agriculture News',
    'nav.history': 'History',
    'nav.alerts': 'Alerts',
    'nav.profile': 'Profile',
    'nav.help': 'Help',
    'nav.signOut': 'Sign Out',

    // Dashboard
    'dashboard.title': 'Soil Analysis Dashboard',
    'dashboard.subtitle': 'Real-time fertilizer recommendations',
    'dashboard.latestRecommendation': 'Latest Recommendation',
    'dashboard.aiPowered': 'AI-powered fertilizer analysis',
    'dashboard.newAnalysis': 'New Soil Analysis',
    'dashboard.enterParameters': 'Enter soil parameters for fertilizer recommendation',
    'dashboard.analysisVisualization': 'Soil Analysis Visualization',
    'dashboard.visualBreakdown': 'Visual breakdown of your soil composition and fertilizer match',
    'dashboard.analysisSummary': 'Analysis Summary',
    'dashboard.batchProcessing': 'Batch processing results and data history from your current session',

    // Soil Form
    'form.temperature': 'Temperature (°C)',
    'form.humidity': 'Humidity (%)',
    'form.moisture': 'Moisture (%)',
    'form.soilType': 'Soil Type',
    'form.cropType': 'Crop Type',
    'form.nitrogen': 'Nitrogen (%)',
    'form.potassium': 'Potassium (ppm)',
    'form.phosphorous': 'Phosphorous (ppm)',
    'form.getRecommendation': 'Get Fertilizer Recommendation',

    // Recommendation Card
    'recommendation.fertilizer': 'Fertilizer',
    'recommendation.rate': 'Rate',
    'recommendation.confidence': 'Confidence',
    'recommendation.expectedYield': 'Expected Yield Increase',
    'recommendation.submitData': 'Submit soil data to get fertilizer recommendations',

    // Table Headers
    'table.date': 'Date',
    'table.crop': 'Crop',
    'table.fertilizer': 'Fertilizer',
    'table.rate': 'Rate (kg/ha)',
    'table.confidence': 'Confidence',
    'table.exportCSV': 'Export CSV',

    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.close': 'Close',

    // Auth
    'auth.signIn': 'Sign In',
    'auth.signUp': 'Sign Up',
    'auth.signOut': 'Sign Out',
    'auth.forgotPassword': 'Forgot Password',
    'auth.createAccount': 'Create Account',
    'auth.welcomeBack': 'Welcome Back',
    'auth.enterDetails': 'Enter your details to create an account.',
    'auth.pleaseEnterDetails': 'Please enter your details.',
    'auth.fullName': 'Full Name',
    'auth.emailAddress': 'Email Address',
    'auth.password': 'Password',
    'auth.rememberMe': 'Remember me',
    'auth.processing': 'Processing...',
    'auth.orContinueWith': 'Or continue with',
    'auth.signInWithGoogle': 'Sign in with Google',
    'auth.signInWithFacebook': 'Facebook',
    'auth.alreadyHaveAccount': 'Already have an account? Sign in',
    'auth.dontHaveAccount': 'Don\'t have an account? Sign up',
    'auth.enterFullName': 'Enter your full name',
    'auth.enterEmail': 'Enter your email',
    'auth.enterPassword': 'Enter your password',

    // Help & Support
    'help.title': 'Help & Support',
    'help.gettingStarted.title': 'Getting Started',
    'help.gettingStarted.description': 'Learn how to use SoilSync for the first time',
    'help.gettingStarted.content': 'Welcome to SoilSync! To get started, first register for an account or sign in. Once logged in, you can explore your dashboard to access features like soil data analysis, crop management, and more. Begin by navigating to the \'Soil Data\' page to input your first sensor readings or manually enter soil parameters.',
    
    'help.soilAnalysis.title': 'Soil Analysis Guide',
    'help.soilAnalysis.description': 'Understanding soil parameters and recommendations',
    'help.soilAnalysis.content': 'Our soil analysis provides insights into key parameters like pH, nitrogen, phosphorus, and potassium (NPK), along with temperature, humidity, and moisture. Based on these readings, SoilSync generates personalized recommendations for crop types and fertilizer application to optimize your yield and promote sustainable farming practices.',
    
    'help.iotSetup.title': 'IoT Sensor Setup',
    'help.iotSetup.description': 'How to connect and configure your sensors',
    'help.iotSetup.content': 'Connecting your IoT sensors to SoilSync is straightforward. Navigate to the \'Soil Data\' page and locate the \'IoT Simulator\' section. Here, you will find instructions and credentials to link your physical sensors. Ensure your sensors are properly calibrated and have stable network connectivity for accurate data transmission.',
    
    'help.smsIntegration.title': 'SMS Integration',
    'help.smsIntegration.description': 'Setting up USSD and SMS notifications',
    'help.smsIntegration.content': 'Stay updated with crucial farm insights through our SMS integration. Go to the \'Soil Data\' page and find the \'SMS Service\' section to configure your preferences. You can set up alerts for low soil moisture, optimal fertilizer application times, or pest warnings directly to your mobile device via SMS or USSD.',
    
    'help.troubleshooting.title': 'Troubleshooting',
    'help.troubleshooting.description': 'Common issues and their solutions',
    'help.troubleshooting.content': 'Experiencing issues? Check our common troubleshooting tips. If your sensor data isn\'t updating, verify its battery and network connection. For login problems, try resetting your password. If you encounter persistent technical difficulties, please utilize the \'Contact Support\' option for direct assistance.',
    
    'help.contactSupport.title': 'Contact Support',
    'help.contactSupport.description': 'Get help from our technical team',
    'help.contactSupport.content': 'Need personalized assistance? Our dedicated technical support team is here to help. You can reach us via email at support@soilsync.com or call our hotline at +250-789-951-064. Our support hours are Monday to Friday, 9 AM to 5 PM local time.',

    // Profile & Account
    'profile.title': 'My Profile',
    'profile.accountInfo': 'Account Information',
    'profile.planDetails': 'Plan Details',
    'profile.currentPlan': 'Current Plan',
    'profile.membershipStatus': 'Membership Status',
    'profile.upgradePlan': 'Upgrade Plan',
    'profile.securitySettings': 'Security Settings',
    'profile.changePassword': 'Change Password',
    'profile.deleteAccount': 'Delete Account',
    'profile.deleteAccountConfirm': 'Are you sure you want to delete your account? This action cannot be undone.',
    'profile.deleteAccountSuccess': 'Account deleted successfully',
    'profile.deleteAccountError': 'Failed to delete account',
    'profile.active': 'Active',
    'profile.freePlan': 'Free Plan',

    // Landing Page
    'landing.getStarted': 'Get Started',
    'landing.features': 'Features',
    'landing.pricing': 'Pricing',
    'landing.contact': 'Contact',
    'landing.about': 'About',

    // Hero Section
    'hero.badge': 'AI-Powered Soil Analysis',
    'hero.headline': 'Optimize Your Crops with',
    'hero.headlineHighlight': 'AI-Driven Soil Analysis',
    'hero.subheadline': 'Transform your farming with intelligent soil insights, personalized fertilizer recommendations, and real-time monitoring that maximizes your harvest potential.',
    'hero.getStarted': 'Get Started',
    'hero.watchDemo': 'Watch Demo',

    // Features Section
    'features.title': 'Powerful Features for',
    'features.titleHighlight': 'Modern Farming',
    'features.subtitle': 'Everything you need to optimize your agricultural operations and maximize your crop yields with cutting-edge technology.',
    'features.aiAnalysis.title': 'AI-Powered Analysis',
    'features.aiAnalysis.description': 'Advanced machine learning algorithms analyze your soil composition and provide actionable insights for optimal crop growth.',
    'features.smsAlerts.title': 'SMS Alerts',
    'features.smsAlerts.description': 'Receive timely alerts and recommendations directly to your phone, ensuring you never miss critical farming moments.',
    'features.dashboard.title': 'Dashboard',
    'features.dashboard.description': 'Comprehensive dashboard with real-time monitoring, historical data, and detailed analytics for informed decision-making.',
    'features.recommendations.title': 'Personalized Recommendations',
    'features.recommendations.description': 'Tailored fertilizer and treatment plans based on your specific soil type, crop requirements, and local conditions.',
    'features.cta.title': 'Ready to transform your farming?',
    'features.cta.description': 'Join thousands of farmers who have already improved their yields with Soil-Sync\'s intelligent analysis platform.',
    'features.cta.button': 'Start Your Free Trial',

    // Pricing Section
    'pricing.title': 'Simple, Transparent',
    'pricing.titleHighlight': 'Pricing',
    'pricing.subtitle': 'Start free and scale as you grow. No hidden fees, no surprises.',
    'pricing.currentlyFree': 'Currently Free Access',
    'pricing.currentlyFreeDescription': 'Currently free. Future pricing plans will be introduced. Get started today and enjoy full access to all features while we\'re in beta. Early users will receive special pricing when we launch our premium plans.',
    'pricing.starter': 'Starter',
    'pricing.free': 'Free',
    'pricing.forever': 'forever',
    'pricing.perfectForSmallFarms': 'Perfect for small farms',
    'pricing.professional': 'Professional',
    'pricing.perMonth': '/month',
    'pricing.idealForMediumFarms': 'Ideal for medium farms',
    'pricing.enterprise': 'Enterprise',
    'pricing.customPricing': 'Custom pricing',
    'pricing.largeOperations': 'Large-scale operations',
    'pricing.basicSoilAnalysis': 'Basic soil analysis',
    'pricing.fertilizerRecommendations': 'Fertilizer recommendations',
    'pricing.mobileAlerts': 'Mobile alerts',
    'pricing.communitySupport': 'Community support',
    'pricing.advancedAnalytics': 'Advanced analytics',
    'pricing.prioritySupport': 'Priority support',
    'pricing.customIntegrations': 'Custom integrations',
    'pricing.multiLocation': 'Multi-location support',
    'pricing.dedicatedSupport': 'Dedicated support',
    'pricing.customSolutions': 'Custom solutions',
    'pricing.apiAccess': 'API access',
    'pricing.sla': 'SLA guarantee',
    'pricing.chooseStarter': 'Choose Starter',
    'pricing.chooseProfessional': 'Choose Professional',
    'pricing.contactSales': 'Contact Sales',
    'pricing.comingSoon': 'Coming Soon',
    'pricing.currentPlan': 'Current Plan',
    'pricing.mostPopular': 'Most Popular',
    'pricing.forGrowingOperations': 'For growing operations',
    'pricing.forLargeOperations': 'For large operations',
    'pricing.upTo5Samples': 'Up to 5 soil samples/month',
    'pricing.basicAI': 'Basic AI analysis',
    'pricing.smsAlerts': 'SMS alerts',
    'pricing.emailSupport': 'Email support',
    'pricing.unlimitedSamples': 'Unlimited soil samples',
    'pricing.advancedAI': 'Advanced AI analysis',
    'pricing.realTimeMonitoring': 'Real-time monitoring',
    'pricing.customRecommendations': 'Custom recommendations',
    'pricing.everythingInProfessional': 'Everything in Professional',
    'pricing.multiFarmManagement': 'Multi-farm management',
    'pricing.custom': 'Custom',

    // Contact Section
    'contact.title': 'Get in',
    'contact.titleHighlight': 'Touch',
    'contact.subtitle': 'Have questions about Soil-Sync? We\'re here to help you optimize your farming operations.',
    'contact.contactInformation': 'Contact Information',
    'contact.email': 'Email',
    'contact.phone': 'Phone',
    'contact.address': 'Address',
    'contact.sendMessage': 'Send us a Message',
    'contact.name': 'Name',
    'contact.subject': 'Subject',
    'contact.message': 'Message',
    'contact.sendButton': 'Send Message',
    'contact.thankYou': 'Thank you for your message! We\'ll get back to you soon.',
    'contact.generalInquiry': 'General Inquiry',
    'contact.technicalSupport': 'Technical Support',
    'contact.salesInquiry': 'Sales Inquiry',
    'contact.partnership': 'Partnership',
    'contact.emailPlaceholder': 'Enter your email',
    'contact.namePlaceholder': 'Enter your name',
    'contact.messagePlaceholder': 'Tell us how we can help you...',
    'contact.supportHours': 'Support Hours',
    'contact.mondayFriday': 'Monday - Friday',
    'contact.saturday': 'Saturday',
    'contact.sunday': 'Sunday',
    'contact.closed': 'Closed',
    'contact.selectSubject': 'Select a subject',
    'contact.feedback': 'Feedback',
    'contact.salesQuestion': 'Sales Question',
    'contact.yourName': 'Your name',
    'contact.yourEmail': 'your@email.com',

    // Footer Section
    'footer.description': 'Transforming agriculture with AI-powered soil analysis and personalized recommendations. Helping farmers optimize their crops and maximize yields.',
    'footer.quickLinks': 'Quick Links',
    'footer.home': 'Home',
    'footer.features': 'Features',
    'footer.pricing': 'Pricing',
    'footer.contact': 'Contact',
    'footer.support': 'Support',
    'footer.helpCenter': 'Help Center',
    'footer.documentation': 'Documentation',
    'footer.apiReference': 'API Reference',
    'footer.legal': 'Legal',
    'footer.privacyPolicy': 'Privacy Policy',
    'footer.termsOfService': 'Terms of Service',
    'footer.cookiePolicy': 'Cookie Policy',
    'footer.dataProtection': 'Data Protection',
    'footer.allRightsReserved': 'All rights reserved.',

    // Agriculture News Page
    'news.title': 'Agriculture News',
    'news.subtitle': 'Latest insights from Rwanda and beyond',
    'news.searchPlaceholder': 'Search news...',
    'news.allNews': 'All News',
    'news.government': 'Government',
    'news.research': 'Research',
    'news.technology': 'Technology',
    'news.sustainability': 'Sustainability',
    'news.education': 'Education',
    'news.viewAll': 'View All',
    'news.search': 'Search',
    'news.noResults': 'No articles found for your search.',
    'news.noArticles': 'No articles available.',
    'news.readMore': 'Read More',
    'news.latestNews': 'Latest News',
    'news.featuredNews': 'Featured News',
  },
  rw: {
    // Navigation
    'nav.dashboard': 'Ikibaho',
    'nav.analytics': 'Isesengura',
    'nav.crops': 'Ibihingwa',
    'nav.soilData': 'Amakuru y\'Ubutaka',
    'nav.agricultureNews': 'Amakuru y\'Ubuhinzi',
    'nav.history': 'Amateka',
    'nav.alerts': 'Iburira',
    'nav.profile': 'Umwirondoro',
    'nav.help': 'Ubufasha',
    'nav.signOut': 'Gusohoka',

    // Dashboard
    'dashboard.title': 'Ikibaho cy\'Isesengura ry\'Ubutaka',
    'dashboard.subtitle': 'Inama z\'ifumbire zigihe nyacyo',
    'dashboard.latestRecommendation': 'Inama z\'Ibanza',
    'dashboard.aiPowered': 'Isesengura ry\'ifumbire rikoresha ubwenge bwubuhanga',
    'dashboard.newAnalysis': 'Isesengura Rishya ry\'Ubutaka',
    'dashboard.enterParameters': 'Injiza ibipimo by\'ubutaka kugirango ubone inama z\'ifumbire',
    'dashboard.analysisVisualization': 'Igaragazwa ry\'Isesengura ry\'Ubutaka',
    'dashboard.visualBreakdown': 'Igaragaza ry\'imiterere y\'ubutaka wawe n\'ifumbire ikwiye',
    'dashboard.analysisSummary': 'Incamake y\'Isesengura',
    'dashboard.batchProcessing': 'Ibisubizo by\'ibikorwa n\'amateka y\'amakuru kuva mu nama yawe y\'ubu',

    // Soil Form
    'form.temperature': 'Ubushyuhe (°C)',
    'form.humidity': 'Ubushuhe (%)',
    'form.moisture': 'Ubushuhe (%)',
    'form.soilType': 'Ubwoko bw\'Ubutaka',
    'form.cropType': 'Ubwoko bw\'Igihingwa',
    'form.nitrogen': 'Azote (%)',
    'form.potassium': 'Potasiyumu (ppm)',
    'form.phosphorous': 'Fosifore (ppm)',
    'form.getRecommendation': 'Bonera Inama z\'Ifumbire',

    // Recommendation Card
    'recommendation.fertilizer': 'Ifumbire',
    'recommendation.rate': 'Igipimo',
    'recommendation.confidence': 'Kwizera',
    'recommendation.expectedYield': 'Inyongera y\'Umusaruro Yitezwe',
    'recommendation.submitData': 'Tanga amakuru y\'ubutaka kugirango ubone inama z\'ifumbire',

    // Table Headers
    'table.date': 'Itariki',
    'table.crop': 'Igihingwa',
    'table.fertilizer': 'Ifumbire',
    'table.rate': 'Igipimo',
    'table.confidence': 'Kwizera',
    'table.exportCSV': 'Kohereza CSV',

    // Common
    'common.loading': 'Birimo gupakira...',
    'common.error': 'Ikosa',
    'common.success': 'Byagenze neza',
    'common.cancel': 'Kureka',
    'common.save': 'Bika',
    'common.delete': 'Gusiba',
    'common.edit': 'Guhindura',
    'common.close': 'Gufunga',

    // Auth
    'auth.signIn': 'Kwinjira',
    'auth.signUp': 'Kwiyandikisha',
    'auth.signOut': 'Gusohoka',
    'auth.forgotPassword': 'Wibagiwe Ijambo ry\'Ibanga',
    'auth.createAccount': 'Kora Konti',
    'auth.welcomeBack': 'Murakaza Neza',
    'auth.enterDetails': 'Injiza amakuru yawe kugirango ukore konti.',
    'auth.pleaseEnterDetails': 'Nyamuneka injiza amakuru yawe.',
    'auth.fullName': 'Izina Ryuzuye',
    'auth.emailAddress': 'Aderesi ya Imeri',
    'auth.password': 'Ijambo ry\'Ibanga',
    'auth.rememberMe': 'Nyibuke',
    'auth.processing': 'Birimo gutunganywa...',
    'auth.orContinueWith': 'Cyangwa komeza na',
    'auth.signInWithGoogle': 'Injira ukoresheje Google',
    'auth.signInWithFacebook': 'Facebook',
    'auth.alreadyHaveAccount': 'Usanzwe ufite konti? Injira',
    'auth.dontHaveAccount': 'Ntufite konti? Yiyandikishe',
    'auth.enterFullName': 'Injiza izina ryawe ryuzuye',
    'auth.enterEmail': 'Injiza imeri yawe',
    'auth.enterPassword': 'Injiza ijambo ryawe ry\'ibanga',

    // Help & Support
    'help.title': 'Ubufasha & Gufasha',
    'help.gettingStarted.title': 'Gutangira',
    'help.gettingStarted.description': 'Wige uburyo bwo gukoresha SoilSync ku nshuro ya mbere',
    'help.gettingStarted.content': 'Murakaza neza kuri SoilSync! Kugirango utangire, mbere yose wiyandikishe cyangwa winjire. Iyo umaze kwinjira, urashobora gukoresha ikibaho cyawe kugirango ubone ibintu nk\'isesengura ry\'amakuru y\'ubutaka, gucunga ibihingwa, n\'ibindi. Tangira unyure ku rupapuro rw\'\'Amakuru y\'Ubutaka\' kugirango winjize amakuru y\'mbere y\'icyuma cyawe cyangwa winjize ibipimo by\'ubutaka ukurikije.',
    
    'help.soilAnalysis.title': 'Ubuyobozi bw\'Isesengura ry\'Ubutaka',
    'help.soilAnalysis.description': 'Gusobanukirwa ibipimo by\'ubutaka n\'inama',
    'help.soilAnalysis.content': 'Isesengura ryacu ry\'ubutaka ritanga ubumenyi ku bipimo by\'ingenzi nka pH, azote, fosifore, na potasiyumu (NPK), hamwe n\'ubushyuhe, ubushuhe, n\'ubushuhe. Ukurikije aya masomo, SoilSync itanga inama z\'umuntu ku bwoko bw\'ibihingwa n\'gukoresha ifumbire kugirango wongerere umusaruro wawe kandi ukurikize uburyo bw\'ubuhinzi budahungabanya ibidukikije.',
    
    'help.iotSetup.title': 'Gushyiraho Icyuma cy\'IoT',
    'help.iotSetup.description': 'Uburyo bwo guhuza no gushyiraho icyuma cyawe',
    'help.iotSetup.content': 'Guhuza icyuma cyawe cy\'IoT na SoilSync ni byoroshye. Nyura ku rupapuro rw\'\'Amakuru y\'Ubutaka\' hanyuma usange igice cy\'\'IoT Simulator\'. Hano, uzasanga amabwiriza n\'ibyangombwa byo guhuza icyuma cyawe cy\'ukuri. Menya neza ko icyuma cyawe gishyizweho neza kandi gifite umuyoboro uhamye kugirango haboneke amakuru y\'ukuri.',
    
    'help.smsIntegration.title': 'Guhuzaguza SMS',
    'help.smsIntegration.description': 'Gushyiraho USSD na SMS z\'amakuru',
    'help.smsIntegration.content': 'Komeza umenye amakuru y\'ingenzi y\'ubuhinzi binyuze mu guhuzaguza SMS. Jya ku rupapuro rw\'\'Amakuru y\'Ubutaka\' hanyuma usange igice cy\'\'SMS Service\' kugirango ushyireho ibyo uhitamo. Urashobora gushyiraho iburira bw\'ubushuhe buke bw\'ubutaka, ibihe byiza byo gukoresha ifumbire, cyangwa iburira ry\'udukoko tukangiza ibihingwa mu gatelefoni yawe binyuze muri SMS cyangwa USSD.',
    
    'help.troubleshooting.title': 'Gukemura Ibibazo',
    'help.troubleshooting.description': 'Ibibazo bisanzwe n\'ibisubizo byabyo',
    'help.troubleshooting.content': 'Ufite ibibazo? Reba inama zacu zo gukemura ibibazo bisanzwe. Niba amakuru y\'icyuma cyawe adashyukirwa, menya neza batiri n\'umuyoboro. Ku bibazo byo kwinjira, gerageza kongera gushyiraho ijambo ryawe ry\'ibanga. Niba uhuye n\'ibibazo bikomeje by\'ikoranabuhanga, nyamuneka koresha amahitamo ya \'Hamagara Ubufasha\' kugirango ubone ubufasha butaziguye.',
    
    'help.contactSupport.title': 'Hamagara Ubufasha',
    'help.contactSupport.description': 'Bonera ubufasha bw\'itsinda ryacu ry\'ikoranabuhanga',
    'help.contactSupport.content': 'Ukeneye ubufasha bw\'umuntu? Itsinda ryacu ryihariye ry\'ubufasha bw\'ikoranabuhanga riri hano gufasha. Urashobora kudusanga kuri imeri kuri support@soilsync.com cyangwa uduhamagare kuri terefoni +250-789-951-064. Amasaha yacu y\'ubufasha ni kuva ku wa mbere kugeza ku wa gatanu, saa 3 z\'igitondo kugeza saa 11 z\'ijoro.',

    // Profile & Account
    'profile.title': 'Umwirondoro Wanjye',
    'profile.accountInfo': 'Amakuru y\'Konti',
    'profile.planDetails': 'Amakuru y\'Gahunda',
    'profile.currentPlan': 'Gahunda y\'Ubu',
    'profile.membershipStatus': 'Uko Unyangombwa',
    'profile.upgradePlan': 'Zamura Gahunda',
    'profile.securitySettings': 'Amahitamo y\'Umutekano',
    'profile.changePassword': 'Hindura Ijambo ry\'Ibanga',
    'profile.deleteAccount': 'Siba Konti',
    'profile.deleteAccountConfirm': 'Uzi neza ko ushaka gusiba konti yawe? Iki gikorwa ntishobora gusubizwa.',
    'profile.deleteAccountSuccess': 'Konti yasibwe neza',
    'profile.deleteAccountError': 'Byanze gusiba konti',
    'profile.active': 'Ikora',
    'profile.freePlan': 'Gahunda y\'Ubuntu',

    // Landing Page
    'landing.getStarted': 'Tangira',
    'landing.features': 'Ibiranga',
    'landing.pricing': 'Ibiciro',
    'landing.contact': 'Vugana',
    'landing.about': 'Ku Bijanye',

    // Hero Section
    'hero.badge': 'Isesengura ry\'Ubutaka rikoresha Ubwenge Bwubuhanga',
    'hero.headline': 'Menya Ibihingwa Byawe Ukoresheje',
    'hero.headlineHighlight': 'Isesengura ry\'Ubutaka rikoresha Ubwenge Bwubuhanga',
    'hero.subheadline': 'Hindura ubuhinzi bwawe ukoresheje ubumenyi bw\'ubutaka bukomeye, inama z\'ifumbire zihariye, no gukurikirana mu gihe nyacyo bizongera umusaruro wawe.',
    'hero.getStarted': 'Tangira',
    'hero.watchDemo': 'Reba Icyitegererezo',

    // Features Section
    'features.title': 'Ibiranga Bikomeye byo',
    'features.titleHighlight': 'Ubuhinzi Bugezweho',
    'features.subtitle': 'Ibintu byose ukeneye kugirango wongerere ibikorwa byawe by\'ubuhinzi kandi wongere umusaruro w\'ibihingwa byawe ukoresheje ikoranabuhanga rigezweho.',
    'features.aiAnalysis.title': 'Isesengura rikoresha Ubwenge Bwubuhanga',
    'features.aiAnalysis.description': 'Uburyo bw\'ubwenge bwubuhanga busesenguye busesengura imiterere y\'ubutaka bwawe bukaguha ubumenyi bwiza bwo gukuza ibihingwa neza.',
    'features.smsAlerts.title': 'Iburira bya SMS',
    'features.smsAlerts.description': 'Bonera iburira n\'inama mu gihe gikwiye kuri terefoni yawe, ukamenya ko utagira icyo utibona mu bihe by\'ingenzi by\'ubuhinzi.',
    'features.dashboard.title': 'Ikibaho',
    'features.dashboard.description': 'Ikibaho cyuzuye gifite gukurikirana mu gihe nyacyo, amakuru y\'amateka, n\'isesengura rirambuye kugirango ufate ibyemezo bishingiye ku bukuri.',
    'features.recommendations.title': 'Inama Zihariye',
    'features.recommendations.description': 'Gahunda z\'ifumbire n\'ubuvuzi zihariye zishingiye ku bwoko bw\'ubutaka bwawe, ibikenewe n\'ibihingwa, n\'ibidukikije by\'aho utuye.',
    'features.cta.title': 'Witeguye guhindura ubuhinzi bwawe?',
    'features.cta.description': 'Jyana n\'ibihumbi by\'abahinzi bamaze kongera umusaruro wabo bakoresheje urubuga rw\'isesengura rukomeye rwa Soil-Sync.',
    'features.cta.button': 'Tangira Ikizamini Cyawe cy\'Ubuntu',

    // Pricing Section
    'pricing.title': 'Ibiciro Byoroshye,',
    'pricing.titleHighlight': 'Bigaragara',
    'pricing.subtitle': 'Tangira ubuntu hanyuma ukure uko ukura. Nta biciro bihishe, nta gitangaje.',
    'pricing.currentlyFree': 'Kugera Ubu ni Ubuntu',
    'pricing.currentlyFreeDescription': 'Kugera ubu ni ubuntu. Gahunda z\'ibiciro bizaza bizatangizwa. Tangira uyu munsi ukishimire kugera ku biranga byose mu gihe turi muri beta. Abakoresha ba mbere bazabona ibiciro bidasanzwe iyo dutangije gahunda zacu za premium.',
    'pricing.starter': 'Uwo Utangira',
    'pricing.free': 'Ubuntu',
    'pricing.forever': 'buhoraho',
    'pricing.perfectForSmallFarms': 'Byiza ku mashyamba mato',
    'pricing.professional': 'Umwuga',
    'pricing.perMonth': '/ukwezi',
    'pricing.idealForMediumFarms': 'Byiza ku mashyamba yo mu rwego rwo hagati',
    'pricing.enterprise': 'Ikigo',
    'pricing.customPricing': 'Ibiciro byihariye',
    'pricing.largeOperations': 'Ibikorwa binini',
    'pricing.basicSoilAnalysis': 'Isesengura ry\'ibanze ry\'ubutaka',
    'pricing.fertilizerRecommendations': 'Inama z\'ifumbire',
    'pricing.mobileAlerts': 'Iburira bya mobile',
    'pricing.communitySupport': 'Ubufasha bw\'abaturage',
    'pricing.advancedAnalytics': 'Isesengura rirambuye',
    'pricing.prioritySupport': 'Ubufasha bw\'ibanze',
    'pricing.customIntegrations': 'Guhuzaguza kwihariye',
    'pricing.multiLocation': 'Gufasha ahantu henshi',
    'pricing.dedicatedSupport': 'Ubufasha bwihariye',
    'pricing.customSolutions': 'Ibisubizo byihariye',
    'pricing.apiAccess': 'Kugera kuri API',
    'pricing.sla': 'Ubwisanzure bwa SLA',
    'pricing.chooseStarter': 'Hitamo Uwo Utangira',
    'pricing.chooseProfessional': 'Hitamo Umwuga',
    'pricing.contactSales': 'Vugana Abacuruzi',
    'pricing.comingSoon': 'Bizaza Vuba',
    'pricing.currentPlan': 'Gahunda y\'Ubu',
    'pricing.mostPopular': 'Ikunzwe Cyane',
    'pricing.forGrowingOperations': 'Ku bikorwa bikura',
    'pricing.forLargeOperations': 'Ku bikorwa binini',
    'pricing.upTo5Samples': 'Kugeza ku ngero 5 z\'ubutaka/ukwezi',
    'pricing.basicAI': 'Isesengura ry\'ibanze ry\'ubwenge bwubuhanga',
    'pricing.smsAlerts': 'Iburira bya SMS',
    'pricing.emailSupport': 'Ubufasha bwa imeri',
    'pricing.unlimitedSamples': 'Ingero z\'ubutaka zidashira',
    'pricing.advancedAI': 'Isesengura rirambuye ry\'ubwenge bwubuhanga',
    'pricing.realTimeMonitoring': 'Gukurikirana mu gihe nyacyo',
    'pricing.customRecommendations': 'Inama zihariye',
    'pricing.everythingInProfessional': 'Ibintu byose biri muri Professional',
    'pricing.multiFarmManagement': 'Gucunga amashyamba menshi',
    'pricing.custom': 'Byihariye',

    // Contact Section
    'contact.title': 'Vugana',
    'contact.titleHighlight': 'Nawe',
    'contact.subtitle': 'Ufite ibibazo ku bijyanye na Soil-Sync? Turi hano gufasha wongerere ibikorwa byawe by\'ubuhinzi.',
    'contact.contactInformation': 'Amakuru yo Kuvugana',
    'contact.email': 'Imeri',
    'contact.phone': 'Terefoni',
    'contact.address': 'Aderesi',
    'contact.sendMessage': 'Twoherere Ubutumwa',
    'contact.name': 'Izina',
    'contact.subject': 'Ingingo',
    'contact.message': 'Ubutumwa',
    'contact.sendButton': 'Kohereza Ubutumwa',
    'contact.thankYou': 'Murakoze ku butumwa bwanyu! Tuzabagarukira vuba.',
    'contact.generalInquiry': 'Ibibazo Rusange',
    'contact.technicalSupport': 'Ubufasha bw\'Ikoranabuhanga',
    'contact.salesInquiry': 'Ibibazo by\'Ubucuruzi',
    'contact.partnership': 'Ubufatanye',
    'contact.emailPlaceholder': 'Injiza imeri yawe',
    'contact.namePlaceholder': 'Injiza izina ryawe',
    'contact.messagePlaceholder': 'Tubwire uburyo dushobora gufasha...',
    'contact.supportHours': 'Amasaha y\'Ubufasha',
    'contact.mondayFriday': 'Kuwa mbere - Kuwa gatanu',
    'contact.saturday': 'Kuwa gatandatu',
    'contact.sunday': 'Ku cyumweru',
    'contact.closed': 'Bifunze',
    'contact.selectSubject': 'Hitamo ingingo',
    'contact.feedback': 'Igitekerezo',
    'contact.salesQuestion': 'Ikibazo cy\'Ubucuruzi',
    'contact.yourName': 'Izina ryawe',
    'contact.yourEmail': 'imeri@yawe.com',

    // Footer Section
    'footer.description': 'Guhindura ubuhinzi ukoresheje isesengura ry\'ubutaka rikoresha ubwenge bwubuhanga n\'inama zihariye. Gufasha abahinzi menya ibihingwa byabo no kongera umusaruro.',
    'footer.quickLinks': 'Amahuza Yihuse',
    'footer.home': 'Urupapuro rw\'Itangiriro',
    'footer.features': 'Ibiranga',
    'footer.pricing': 'Ibiciro',
    'footer.contact': 'Vugana',
    'footer.support': 'Ubufasha',
    'footer.helpCenter': 'Ikigo cy\'Ubufasha',
    'footer.documentation': 'Inyandiko',
    'footer.apiReference': 'Indango ya API',
    'footer.legal': 'Amategeko',
    'footer.privacyPolicy': 'Politiki y\'Ubwigenge',
    'footer.termsOfService': 'Amabwiriza y\'Ubufasha',
    'footer.cookiePolicy': 'Politiki ya Cookie',
    'footer.dataProtection': 'Kurinda Amakuru',
    'footer.allRightsReserved': 'Uburenganzira bwose burarinzwe.',

    // Agriculture News Page
    'news.title': 'Amakuru y\'Ubuhinzi',
    'news.subtitle': 'Amakuru mashya kuva mu Rwanda no hirya no hino',
    'news.searchPlaceholder': 'Shakisha amakuru...',
    'news.allNews': 'Amakuru Yose',
    'news.government': 'Guverinoma',
    'news.research': 'Ubushakashatsi',
    'news.technology': 'Ikoranabuhanga',
    'news.sustainability': 'Kuramba',
    'news.education': 'Uburezi',
    'news.viewAll': 'Reba Byose',
    'news.search': 'Shakisha',
    'news.noResults': 'Nta makuru yabonetse mu bushakashatsi bwawe.',
    'news.noArticles': 'Nta makuru aboneka.',
    'news.readMore': 'Soma Byinshi',
    'news.latestNews': 'Amakuru Mashya',
    'news.featuredNews': 'Amakuru Yibanze',
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('soil-sync-language') as Language;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'rw')) {
      setLanguageState(savedLanguage);
    }
  }, []);

  // Save language to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('soil-sync-language', language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguageState(prev => prev === 'en' ? 'rw' : 'en');
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string, fallback?: string): string => {
    return translations[language][key] || fallback || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}; 