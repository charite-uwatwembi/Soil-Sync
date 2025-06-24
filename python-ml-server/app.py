import os
import joblib
import pandas as pd
from flask import Flask, request, jsonify
import logging
import re
from flask_cors import CORS

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # This enables CORS for all routes

MODEL_COLUMNS = [
    'Temparature', 'Humidity', 'Moisture', 'Soil_Type', 'Crop_Type',
    'Nitrogen', 'Potassium', 'Phosphorous'
]

class FertilizerModelServer:
    def __init__(self):
        self.model = None
        self.label_encoder = None
        self.load_model()

    def load_model(self):
        try:
            ml_models_dir = os.path.join(os.path.dirname(__file__), '..', 'ML_Models')
            model_path = os.path.join(ml_models_dir, 'fertilizer.pkl')
            if not os.path.exists(model_path):
                logger.error(f"Model file not found at {model_path}")
                return False
            # The pickle file contains the LabelEncoder
            self.label_encoder = joblib.load(model_path)
            # The classifier is assumed to be in 'classifier.pkl' in the same directory
            classifier_path = os.path.join(ml_models_dir, 'classifier.pkl')
            if not os.path.exists(classifier_path):
                logger.error(f"Classifier file not found at {classifier_path}")
                return False
            self.model = joblib.load(classifier_path)
            logger.info(f"Successfully loaded model and label encoder from {ml_models_dir}")
            return True
        except Exception as e:
            logger.error(f"Failed to load model: {str(e)}")
            return False

    def predict(self, input_data):
        try:
            # Ensure all required fields are present
            for col in MODEL_COLUMNS:
                if col not in input_data:
                    raise ValueError(f"Missing required field: {col}")
            # Prepare DataFrame
            features = [[input_data[col] for col in MODEL_COLUMNS]]
            df = pd.DataFrame(features, columns=MODEL_COLUMNS)
            # Predict
            pred_code = int(self.model.predict(df)[0])
            fert_name = self.label_encoder.classes_[pred_code]
            # If the fertilizer name matches an NPK blend, prepend 'NPK '
            npk_pattern = r'^(\d{2}-\d{2}-\d{2})$'
            if re.match(npk_pattern, fert_name):
                fert_name_display = f"NPK {fert_name}"
            else:
                fert_name_display = fert_name
            # Placeholder for application rate (kg/ha)
            application_rate = 150
            # Get confidence (probability of predicted class)
            if hasattr(self.model, 'predict_proba'):
                proba = self.model.predict_proba(df)[0][pred_code]
                confidence = round(proba * 100, 1)
            else:
                confidence = 90.0  # fallback if model doesn't support predict_proba
            # Crop name from input
            crop_name = input_data.get('Crop_Type', '')
            # Calculate expected yield increase using the formula
            expected_yield_increase = min((confidence / 100) * (application_rate / 150) * 40, 50)
            expected_yield_increase = round(expected_yield_increase, 1)
            return {
                'fertilizer_code': pred_code,
                'fertilizer_name': fert_name_display,
                'application_rate': f"{application_rate} kg/ha",
                'confidence': f"{confidence}%",
                'expected_yield_increase': f"+{expected_yield_increase}%",
                'crop_name': crop_name
            }
        except Exception as e:
            logger.error(f"Prediction error: {str(e)}")
            raise Exception(f"Prediction failed: {str(e)}")

model_server = FertilizerModelServer()

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy' if model_server.model is not None else 'unhealthy',
        'model_loaded': model_server.model is not None,
        'timestamp': pd.Timestamp.now().isoformat()
    })

@app.route('/predict', methods=['POST'])
def predict():
    try:
        input_data = request.get_json()
        if not input_data:
            return jsonify({'error': 'No input data provided'}), 400
        # Validate required fields
        missing_fields = [col for col in MODEL_COLUMNS if col not in input_data]
        if missing_fields:
            return jsonify({'error': f'Missing required fields: {missing_fields}'}), 400
        prediction = model_server.predict(input_data)
        return jsonify(prediction)
    except Exception as e:
        logger.error(f"Prediction endpoint error: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)