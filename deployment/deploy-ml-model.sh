#!/bin/bash

# ML Model Deployment Script for SoilSync
echo "🚀 Deploying SoilSync ML Model Server..."

# Check if ML_Models directory exists
if [ ! -d "../ML_Models" ]; then
    echo "❌ ML_Models directory not found!"
    echo "Please ensure your joblib model files are in the ML_Models folder"
    exit 1
fi

# Check if joblib files exist
if [ -z "$(ls -A ../ML_Models/*.joblib 2>/dev/null)" ]; then
    echo "❌ No .joblib files found in ML_Models directory!"
    echo "Please add your trained model files (.joblib) to the ML_Models folder"
    exit 1
fi

echo "✅ Found ML model files:"
ls -la ../ML_Models/*.joblib

# Build and start the ML server
echo "🔨 Building ML model server..."
cd python-ml-server

# Build Docker image
docker build -t soilsync-ml-server .

# Start the server
echo "🚀 Starting ML model server..."
docker-compose up -d

# Wait for server to start
echo "⏳ Waiting for server to start..."
sleep 10

# Health check
echo "🔍 Checking server health..."
if curl -f http://localhost:8000/health; then
    echo "✅ ML Model Server is running successfully!"
    echo "📊 Server endpoints:"
    echo "   - Health: http://localhost:8000/health"
    echo "   - Predict: http://localhost:8000/predict"
    echo "   - Model Info: http://localhost:8000/model/info"
    
    # Test prediction
    echo "🧪 Testing prediction..."
    curl -X POST http://localhost:8000/predict \
      -H "Content-Type: application/json" \
      -d '{
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
      }'
    
    echo -e "\n✅ ML Model deployment completed successfully!"
    echo "🔗 Update your Supabase environment variables:"
    echo "   ML_MODEL_ENDPOINT=http://localhost:8000/predict"
    echo "   ML_MODEL_API_KEY=your-api-key-here"
    
else
    echo "❌ ML Model Server failed to start!"
    echo "📋 Checking logs..."
    docker-compose logs
    exit 1
fi