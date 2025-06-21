# SoilSync - Smart Fertilizer Recommendation System

A comprehensive agricultural platform that combines IoT sensors, machine learning, and SMS notifications to provide intelligent fertilizer recommendations to farmers.

## 🌟 Features

- **Smart Soil Analysis**: AI-powered fertilizer recommendations using your trained ML models
- **IoT Integration**: Real-time sensor data collection and processing
- **SMS Service**: Real SMS-based recommendations for farmers without internet
- **Interactive Dashboard**: Real-time data visualization and analytics
- **User Management**: Secure authentication and data storage
- **Mobile Responsive**: Works on all devices

## 🤖 ML Model Integration

### Your Joblib Model
SoilSync is designed to work with your pre-trained machine learning models stored in the `ML_Models` folder.

**Supported Model Types:**
- Scikit-learn models (joblib format)
- Classification and regression models
- Custom feature engineering pipelines

**Model Requirements:**
- Input features: phosphorus, potassium, nitrogen, organic_carbon, cation_exchange, sand_percent, clay_percent, silt_percent, rainfall, elevation, crop_type
- Output: fertilizer recommendation, application rate, confidence score

### Quick ML Model Deployment

1. **Place your model**: Put your `.joblib` files in the `ML_Models` folder
2. **Deploy the server**: Run `./deployment/deploy-ml-model.sh`
3. **Test integration**: Use the ML Model Management interface in the dashboard

```bash
# Deploy your ML model
cd deployment
chmod +x deploy-ml-model.sh
./deploy-ml-model.sh
```

## 📱 SMS Service for Farmers

### How It Works
Farmers can send SMS messages to get instant fertilizer recommendations without needing internet access.

**SMS Number**: `+250 788 SOIL RW` (when deployed with MTN Rwanda)

### SMS Formats

#### Standard Format:
```
SOIL [Phosphorus] [Potassium] [Nitrogen] [Crop]
```
**Example**: `SOIL 15 120 0.25 MAIZE`

#### Labeled Format:
```
SOIL P[value] K[value] N[value] [Crop]
```
**Example**: `SOIL P15 K120 N0.25 MAIZE`

### Parameters:
- **Phosphorus**: 0-200 ppm
- **Potassium**: 0-1000 ppm  
- **Nitrogen**: 0-2% (use decimal, e.g., 0.25 for 0.25%)
- **Crop**: maize, rice, beans, potato, cassava, banana

### Sample SMS Interactions:

**Farmer sends**: `SOIL 15 120 0.25 MAIZE`

**System responds**:
```
SoilSync Recommendation:
Crop: MAIZE
Fertilizer: NPK 17-17-17
Rate: 165kg/ha
Expected yield increase: +20%
Confidence: 87%

For help: Reply HELP
For more info: Call 0788-SOIL-RW
```

## 🚀 Quick Start Guide

### Prerequisites

- Node.js 18+ installed
- Docker and Docker Compose (for ML model deployment)
- Git installed
- Visual Studio Code (recommended)
- Supabase account (free)
- MTN Rwanda API access (for SMS)

### Step 1: Clone and Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd soilsync-dashboard

# Install dependencies
npm install

# Copy environment file
cp .env.example .env
```

### Step 2: Configure Environment Variables

Edit `.env` file with your credentials:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# ML Model Configuration
VITE_ML_MODEL_ENDPOINT=http://localhost:8000/predict
VITE_ML_MODEL_API_KEY=your_ml_api_key

# SMS Configuration (MTN Rwanda)
VITE_MTN_API_KEY=your_mtn_api_key
VITE_MTN_API_SECRET=your_mtn_api_secret
```

### Step 3: Deploy Your ML Model

```bash
# Make sure your .joblib model files are in ML_Models folder
ls ML_Models/

# Deploy the ML model server
cd deployment
chmod +x deploy-ml-model.sh
./deploy-ml-model.sh
```

### Step 4: Database Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Run the migration files in your Supabase SQL editor
3. Deploy the Edge Functions

### Step 5: Run the Application

```bash
# Start development server
npm run dev

# Build for production
npm run build
```

## 🤖 ML Model Architecture

### Model Server Components

1. **Flask API Server** (`python-ml-server/app.py`)
   - Loads your joblib models automatically
   - Provides REST API endpoints
   - Handles feature preprocessing
   - Returns structured predictions

2. **Supabase Edge Function** (`supabase/functions/ml-model-server/`)
   - Proxies requests to your ML server
   - Handles authentication and logging
   - Provides fallback predictions

3. **Frontend Integration** (`src/services/mlModelService.ts`)
   - Seamless integration with your models
   - Automatic fallback to rule-based predictions
   - Real-time health monitoring

### Model Endpoints

- **Health Check**: `GET /health`
- **Prediction**: `POST /predict`
- **Model Info**: `GET /model/info`
- **Reload Model**: `POST /model/reload`

### Example Prediction Request

```json
{
  "phosphorus": 15,
  "potassium": 120,
  "nitrogen": 0.25,
  "organic_carbon": 2.0,
  "cation_exchange": 15,
  "sand_percent": 40,
  "clay_percent": 30,
  "silt_percent": 30,
  "rainfall": 1200,
  "elevation": 1500,
  "crop_type": "maize"
}
```

### Example Prediction Response

```json
{
  "fertilizer": "NPK 17-17-17",
  "application_rate": 165,
  "confidence_score": 87.3,
  "expected_yield_increase": 20,
  "model_version": "v1.0.0"
}
```

## 📱 IoT Integration

The system supports real-time sensor data through:
- Simulated IoT devices for testing
- Webhook endpoints for real sensor integration
- Automatic data processing and recommendations

## 📧 SMS Integration

### Development/Testing
- Built-in SMS simulator for testing
- Mock SMS interactions
- Local message history

### Production Setup
1. **Contact MTN Rwanda**: business@mtn.co.rw
2. **Get SMS Gateway Access**: Request API credentials
3. **Configure Webhook**: Set up SMS receiving endpoint
4. **Deploy Edge Function**: Deploy the SMS webhook function

## 🔧 Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build

# Deploy ML model
./deployment/deploy-ml-model.sh
```

## 📦 Deployment

### Frontend Deployment
The application can be deployed to:
- Vercel (recommended)
- Netlify
- Supabase (for backend functions)

### ML Model Deployment
- Local Docker container (development)
- Cloud platforms (AWS, GCP, Azure)
- Kubernetes clusters
- Serverless functions

### Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

## 🛠️ ML Model Development Workflow

1. **Train Your Model**
   ```python
   # Train your model using scikit-learn
   from sklearn.ensemble import RandomForestClassifier
   import joblib
   
   # Train model
   model = RandomForestClassifier()
   model.fit(X_train, y_train)
   
   # Save model
   joblib.dump(model, 'ML_Models/fertilizer_model.joblib')
   ```

2. **Deploy to SoilSync**
   ```bash
   # Place model in ML_Models folder
   cp your_model.joblib ML_Models/
   
   # Deploy
   ./deployment/deploy-ml-model.sh
   ```

3. **Test Integration**
   - Use the ML Model Management interface
   - Test with sample data
   - Monitor performance metrics

4. **Monitor Performance**
   - View prediction analytics
   - Track model accuracy
   - Monitor response times

## 📊 Analytics & Monitoring

- ML model performance tracking
- SMS interaction logging
- Farmer usage analytics
- Prediction accuracy monitoring
- System health monitoring

## 🔒 Security & Privacy

- Farmer phone numbers are hashed
- Secure API endpoints
- Row Level Security (RLS) on all database tables
- Rate limiting on SMS endpoints
- ML model access controls

## 💰 Cost Considerations

### SMS Costs (MTN Rwanda):
- Incoming SMS: ~50 RWF per message
- Outgoing SMS: ~50 RWF per message
- Monthly gateway fee: ~50,000 RWF
- Setup fee: ~200,000 RWF

### ML Model Hosting:
- Local development: Free
- Cloud hosting: $10-50/month
- Serverless: Pay per prediction

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test ML model integration
5. Submit a pull request

## 📞 Support

For technical support or questions:
- Email: support@soilsync.rw
- Phone: +250 788 123 456
- Documentation: [docs.soilsync.rw](https://docs.soilsync.rw)

## 📄 License

MIT License - see LICENSE file for details

---

**Happy Farming with AI! 🌱🤖**