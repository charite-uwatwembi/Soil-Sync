# 🚀 SoilSync Complete Setup Guide

Follow these step-by-step instructions to get your SoilSync application up and running with all features, including the SMS service.

## 📋 Prerequisites

Before starting, make sure you have:
- **Node.js 18+** installed ([Download here](https://nodejs.org/))
- **Git** installed ([Download here](https://git-scm.com/))
- **Visual Studio Code** (recommended) ([Download here](https://code.visualstudio.com/))
- A **GitHub account** for version control
- A **Supabase account** (free) for database and backend
- **MTN Rwanda API access** for SMS functionality

## 🔧 Step 1: Project Setup

### 1.1 Download and Setup Project

1. **Download the project files** from Bolt and extract them to a folder
2. **Open Visual Studio Code**
3. **Open the project folder** in VS Code (File → Open Folder)
4. **Open the integrated terminal** (Terminal → New Terminal)

### 1.2 Install Dependencies

```bash
# Install all required packages
npm install

# Verify installation
npm list
```

## 🗄️ Step 2: Database Setup (Supabase)

### 2.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click **"New Project"**
3. Choose your organization
4. Enter project details:
   - **Name**: `soilsync-production`
   - **Database Password**: Create a strong password
   - **Region**: Choose closest to your location
5. Click **"Create new project"**
6. Wait for project to be ready (2-3 minutes)

### 2.2 Get API Keys

1. In your Supabase dashboard, go to **Settings → API**
2. Copy the following:
   - **Project URL** (starts with `https://`)
   - **Anon public key** (starts with `eyJ`)

### 2.3 Configure Environment Variables

1. In VS Code, rename `.env.example` to `.env`
2. Update the file with your Supabase credentials:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# SMS Configuration (MTN Rwanda)
VITE_MTN_API_KEY=your_mtn_api_key
VITE_MTN_API_SECRET=your_mtn_api_secret

# IoT Configuration (Optional)
VITE_IOT_WEBHOOK_URL=your_iot_webhook_url
```

### 2.4 Run Database Migrations

1. In Supabase dashboard, go to **SQL Editor**
2. Copy and run the first migration file (`supabase/migrations/20250615115701_royal_shore.sql`)
3. Copy and run the second migration file (`supabase/migrations/20250615115707_tiny_summit.sql`)
4. Verify tables are created in **Table Editor**

### 2.5 Deploy Edge Functions

1. In Supabase dashboard, go to **Edge Functions**
2. Create a new function called `predict-fertilizer`
3. Copy the code from `supabase/functions/predict-fertilizer/index.ts`
4. Deploy the function
5. Create another function called `sms-webhook`
6. Copy the code from `supabase/functions/sms-webhook/index.ts`
7. Deploy the SMS webhook function

## 🚀 Step 3: Run the Application

### 3.1 Start Development Server

```bash
# Start the development server
npm run dev
```

The application will open at `http://localhost:5173`

### 3.2 Test Core Features

1. **Soil Analysis**: Fill out the soil form and submit
2. **Data Visualization**: Check charts and graphs
3. **Navigation**: Click sidebar items to test different pages
4. **IoT Simulator**: Go to "Soil Data" page and test sensor simulation
5. **SMS Service**: Test SMS functionality in "Soil Data" page

## 📱 Step 4: SMS Service Setup

### 4.1 Test SMS Service (Development)

The app includes a built-in SMS simulator:
1. Navigate to **Soil Data** page
2. Scroll to **SMS Service** section
3. Test different SMS formats:
   - `SOIL 15 120 0.25 MAIZE`
   - `SOIL P15 K120 N0.25 RICE`
   - `HELP`
4. Use quick test buttons for common scenarios

### 4.2 SMS Service Features

**Supported SMS Formats:**
- Standard: `SOIL 15 120 0.25 MAIZE`
- Labeled: `SOIL P15 K120 N0.25 MAIZE`
- Help: `HELP`

**Parameters:**
- Phosphorus: 0-200 ppm
- Potassium: 0-1000 ppm
- Nitrogen: 0-2% (decimal format)
- Crops: maize, rice, beans, potato, cassava, banana

### 4.3 Production SMS Setup (MTN Rwanda)

For real SMS integration:

1. **Contact MTN Rwanda Business Solutions**
   - Email: business@mtn.co.rw
   - Phone: +250 788 100 100
   - Request SMS gateway partnership

2. **Required Information**
   - Business registration documents
   - Technical specifications
   - Expected SMS volume
   - Use case description (agricultural recommendations)

3. **Technical Setup**
   - Get SMS gateway credentials
   - Configure webhook URL: `https://your-project.supabase.co/functions/v1/sms-webhook`
   - Set up dedicated phone number (e.g., +250 788 SOIL RW)
   - Test SMS sending/receiving

4. **Update Environment Variables**
```env
VITE_MTN_API_KEY=your_actual_mtn_api_key
VITE_MTN_API_SECRET=your_actual_mtn_secret
```

## 📱 Step 5: IoT Integration Setup

### 5.1 Virtual IoT Simulation

The app includes a built-in IoT simulator:
1. Navigate to **Soil Data** page
2. Click **"Connect"** to simulate sensor connection
3. Click **"Start Stream"** to begin receiving data
4. Toggle individual sensors on/off for testing

### 5.2 Real IoT Integration (Optional)

For real sensors, you'll need to:
1. Set up webhook endpoints in your Supabase Edge Functions
2. Configure your IoT devices to send data to these endpoints
3. Update the `VITE_IOT_WEBHOOK_URL` in your `.env` file

## 🤖 Step 6: ML Model Integration

### 6.1 Upload Your Trained Model

1. Navigate to **Analytics** page
2. Scroll to **ML Model Management** section
3. Click **"Select Model File"** to upload from your `ML_Models` folder
4. Activate your model once uploaded

### 6.2 Model Configuration

The system supports multiple model formats:
- **Scikit-learn models** (pickle files)
- **TensorFlow models**
- **Custom prediction APIs**

## 🌐 Step 7: GitHub Setup

### 7.1 Initialize Git Repository

```bash
# Initialize git repository
git init

# Add all files
git add .

# Make initial commit
git commit -m "Initial SoilSync setup with SMS service"
```

### 7.2 Push to GitHub

1. Create a new repository on GitHub
2. Copy the repository URL
3. Add remote and push:

```bash
# Add GitHub remote
git remote add origin https://github.com/yourusername/soilsync-dashboard.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## 🚀 Step 8: Production Deployment

### 8.1 Build for Production

```bash
# Create production build
npm run build

# Test production build locally
npm run preview
```

### 8.2 Deploy to Vercel (Recommended)

1. Install Vercel CLI: `npm i -g vercel`
2. Login: `vercel login`
3. Deploy: `vercel --prod`
4. Add environment variables in Vercel dashboard

### 8.3 Alternative Deployment Options

- **Netlify**: Drag and drop the `dist` folder
- **GitHub Pages**: Use GitHub Actions for deployment
- **Firebase Hosting**: Use Firebase CLI

## 📱 Step 9: SMS Service Production Checklist

### 9.1 MTN Rwanda Integration

- [ ] Contact MTN Rwanda for SMS gateway access
- [ ] Provide business documentation
- [ ] Get dedicated phone number assigned
- [ ] Receive API credentials
- [ ] Configure webhook endpoint
- [ ] Test SMS sending/receiving
- [ ] Set up billing and monitoring

### 9.2 SMS Service Monitoring

- [ ] Set up SMS interaction logging
- [ ] Monitor response times
- [ ] Track farmer usage patterns
- [ ] Monitor SMS delivery rates
- [ ] Set up alerts for service issues

### 9.3 Cost Management

**Expected Costs (MTN Rwanda):**
- Setup fee: ~200,000 RWF
- Monthly gateway fee: ~50,000 RWF
- Per SMS cost: ~50 RWF (incoming + outgoing)
- For 1000 farmers/month: ~150,000 RWF total

## 🔧 Step 10: Advanced Configuration

### 10.1 Custom Domain Setup

1. Purchase a domain (e.g., `soilsync.rw`)
2. Configure DNS settings in your domain provider
3. Add custom domain in your hosting platform
4. Enable SSL certificate

### 10.2 Performance Optimization

```bash
# Analyze bundle size
npm run build -- --analyze

# Run performance tests
npm run test
```

### 10.3 Monitoring Setup

1. Set up error tracking (Sentry)
2. Configure analytics (Google Analytics)
3. Set up uptime monitoring
4. SMS service monitoring

## 🆘 Troubleshooting

### Common Issues:

1. **SMS Not Working**: 
   - Check MTN API credentials
   - Verify webhook URL is accessible
   - Check SMS format validation

2. **Database Connection**: 
   - Verify Supabase credentials
   - Check network connection
   - Ensure migrations are applied

3. **Build Errors**: 
   - Clear node_modules: `rm -rf node_modules && npm install`
   - Check for TypeScript errors

### SMS Service Debugging:

1. **Check SMS Logs**: View recent interactions in dashboard
2. **Test Webhook**: Use tools like Postman to test SMS webhook
3. **Validate Format**: Ensure SMS messages follow correct format
4. **Check Response**: Verify ML model is generating recommendations

## 🎉 Congratulations!

Your SoilSync application with SMS service is now fully set up and ready for production use! 

### Next Steps:

1. **Farmer Onboarding**: Create training materials for SMS usage
2. **Field Testing**: Test with real farmers in pilot areas
3. **Data Collection**: Start collecting real soil and usage data
4. **Model Training**: Improve ML models with real data
5. **Scale Up**: Expand to more regions and crops

## 📞 Support

For technical support or questions:
- Email: support@soilsync.rw
- Phone: +250 788 123 456
- SMS Service: +250 788 SOIL RW
- Documentation: [docs.soilsync.rw](https://docs.soilsync.rw)

---

**Happy Farming with SMS! 🌱📱**