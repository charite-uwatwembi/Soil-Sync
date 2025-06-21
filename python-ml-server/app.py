from flask import Flask, request, jsonify
import joblib
import numpy as np
import pandas as pd
import os
from datetime import datetime
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# The 20 features your model expects (from your pipeline training)
EXPECTED_FEATURES = [
    "Crop_inter_Bean, climbing", "Crop_inter_Maize", "Crop_inter_Pea", "Crop_inter_Potato, Irish",
    "Crop_inter_Potato, sweet", "Crop_inter_Rice, lowand", "Crop_inter_Rice, lowland",
    "Crop_inter_Sorghum", "Crop_inter_Soybean", "Crop_inter_Wheat",
    "phoshorus(ppm)", "K(cmol/kg)", "TN", "OC", "CEC", "Sand", "Silt", "Clay", "MAP", "Elevation"
]

# Default values for one-hot crop features (all 0 except for Maize as fallback)
DEFAULT_CROP_FEATURES = {
    "Crop_inter_Bean, climbing": 0,
    "Crop_inter_Maize": 0,
    "Crop_inter_Pea": 0,
    "Crop_inter_Potato, Irish": 0,
    "Crop_inter_Potato, sweet": 0,
    "Crop_inter_Rice, lowand": 0,
    "Crop_inter_Rice, lowland": 0,
    "Crop_inter_Sorghum": 0,
    "Crop_inter_Soybean": 0,
    "Crop_inter_Wheat": 0
}

CROP_MAP = {
    "bean, climbing": "Crop_inter_Bean, climbing",
    "maize": "Crop_inter_Maize",
    "pea": "Crop_inter_Pea",
    "potato, irish": "Crop_inter_Potato, Irish",
    "potato, sweet": "Crop_inter_Potato, sweet",
    "rice, lowand": "Crop_inter_Rice, lowand",
    "rice, lowland": "Crop_inter_Rice, lowland",
    "sorghum": "Crop_inter_Sorghum",
    "soybean": "Crop_inter_Soybean",
    "wheat": "Crop_inter_Wheat"
}

class MLModelServer:
    def __init__(self):
        self.model = None
        self.model_version = "v1.0.0"
        self.feature_names = EXPECTED_FEATURES
        self.fertilizer_mapping = {
            "Add_Urea": "Urea",
            "Add_SSP": "Single Super Phosphate",
            "Add_Potash": "Potash",
            "Add_NK": "NK Blend",
            "Add_DAP": "DAP (Diammonium Phosphate)",
            "Add_NPK_17_17_17": "NPK 17-17-17",
            "No_Fertilizer_Needed": "No Fertilizer Needed"
        }
        self.load_model()

    def load_model(self):
        """Load the joblib model from ML_Models folder"""
        try:
            ml_models_dir = os.path.join(os.path.dirname(__file__), '..', 'ML_Models')
            if not os.path.exists(ml_models_dir):
                logger.warning(f"ML_Models directory not found at {ml_models_dir}")
                return False
            joblib_files = [f for f in os.listdir(ml_models_dir) if f.endswith('.joblib')]
            if not joblib_files:
                logger.warning("No .joblib files found in ML_Models directory")
                return False
            model_path = os.path.join(ml_models_dir, joblib_files[0])
            self.model = joblib.load(model_path)
            logger.info(f"Successfully loaded model from {model_path}")
            logger.info(f"Model type: {type(self.model)}")
            return True
        except Exception as e:
            logger.error(f"Failed to load model: {str(e)}")
            return False

    def prepare_features(self, input_data):
            """Prepare a DataFrame with the 11 raw features for the pipeline"""
            df = pd.DataFrame([{
                "phoshorus(ppm)": float(input_data.get("phosphorus", 0)),
                "K(cmol/kg)": float(input_data.get("potassium", 0)),
                "TN": float(input_data.get("nitrogen", 0)),
                "OC": float(input_data.get("organic_carbon", 0)),
                "CEC": float(input_data.get("cation_exchange", 0)),
                "Sand": float(input_data.get("sand_percent", 0)),
                "Silt": float(input_data.get("silt_percent", 0)),
                "Clay": float(input_data.get("clay_percent", 0)),
                "MAP": float(input_data.get("rainfall", 0)),
                "Elevation": float(input_data.get("elevation", 0)),
                "Crop_inter": self.map_crop_type(input_data.get("crop_type", "Maize"))
            }])
            return df
    
    def map_crop_type(self, crop_type):
    # Map user input to the exact string used in training
        mapping = {
            "maize": "Maize",
            "wheat": "Wheat",
            "bean, climbing": "Bean, climbing",
            "pea": "Pea",
            "potato, irish": "Potato, Irish",
            "potato, sweet": "Potato, sweet",
            "rice, lowand": "Rice, lowand",
            "rice, lowland": "Rice, lowland",
            "sorghum": "Sorghum",
            "soybean": "Soybean"
        }
        return mapping.get(str(crop_type).strip().lower(), "Maize")

    def predict(self, input_data):
        """Make prediction using the loaded model"""
        try:
            if self.model is None:
                raise Exception("Model not loaded")
            features_df = self.prepare_features(input_data)
            prediction = self.model.predict(features_df)[0]
            # If your model outputs a string label, use as is; else map to fertilizer name
            fertilizer = self.fertilizer_mapping.get(str(prediction), str(prediction))
            # Optionally, add application rate logic here
            return {
                'fertilizer': fertilizer,
                'prediction_raw': str(prediction),
                'model_version': self.model_version
            }
        except Exception as e:
            logger.error(f"Prediction error: {str(e)}")
            raise Exception(f"Prediction failed: {str(e)}")

# Initialize the ML model server
ml_server = MLModelServer()

@app.route('/', methods=['GET'])
def index():
    return "Soil-Sync ML API is running. See /health or /model/info for details."

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy' if ml_server.model is not None else 'unhealthy',
        'model_loaded': ml_server.model is not None,
        'model_version': ml_server.model_version,
        'timestamp': datetime.now().isoformat()
    })

@app.route('/predict', methods=['POST'])
def predict():
    """Prediction endpoint"""
    try:
        input_data = request.get_json()
        if not input_data:
            return jsonify({'error': 'No input data provided'}), 400
        # Accepts 11 features, fills in 9 defaults for the model
        required_fields = [
            'phosphorus', 'potassium', 'nitrogen', 'organic_carbon',
            'cation_exchange', 'sand_percent', 'clay_percent', 'silt_percent',
            'rainfall', 'elevation', 'crop_type'
        ]
        missing_fields = [field for field in required_fields if field not in input_data]
        if missing_fields:
            return jsonify({'error': f'Missing required fields: {missing_fields}'}), 400
        prediction = ml_server.predict(input_data)
        return jsonify(prediction)
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        logger.error(f"Prediction endpoint error: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/model/info', methods=['GET'])
def model_info():
    """Get model information"""
    return jsonify({
        'model_loaded': ml_server.model is not None,
        'model_type': str(type(ml_server.model)) if ml_server.model else None,
        'model_version': ml_server.model_version,
        'feature_names': ml_server.feature_names,
        'fertilizer_options': list(ml_server.fertilizer_mapping.values())
    })

@app.route('/model/reload', methods=['POST'])
def reload_model():
    """Reload the model"""
    try:
        success = ml_server.load_model()
        return jsonify({
            'success': success,
            'message': 'Model reloaded successfully' if success else 'Failed to reload model'
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)