import os
import joblib
import pandas as pd
from flask import Flask, request, jsonify, abort, Response
import logging
import re
from flask_cors import CORS
from dotenv import load_dotenv
from twilio.request_validator import RequestValidator
from twilio.twiml.messaging_response import MessagingResponse

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # This enables CORS for all routes

TWILIO_AUTH_TOKEN = os.environ.get("TWILIO_AUTH_TOKEN")

MODEL_COLUMNS = [
    'Temparature', 'Humidity', 'Moisture', 'Soil_Type', 'Crop_Type',
    'Nitrogen', 'Potassium', 'Phosphorous'
]

soil_type_map = {'Sandy': 0, 'Clay': 1, 'Loamy': 2, 'Black': 3, 'Red': 4, 'Clayey': 5}
crop_type_map = {
    'Wheat': 0, 'Rice': 1, 'Maize': 2, 'Sugarcane': 3, 'Cotton': 4, 
    'Tobacco': 5, 'Paddy': 6, 'Barley': 7, 'Millets': 8, 'Oil seeds': 9, 
    'Pulses': 10, 'Ground Nuts': 11
}

class FertilizerModelServer:
    def __init__(self):
        self.model = None
        self.label_encoder = None
        self.load_model()

    def load_model(self):
        try:
            ml_models_dir = os.path.join(os.path.dirname(__file__), 'ML_Models')
            model_path = os.path.join(ml_models_dir, 'fertilizer.pkl')
            if not os.path.exists(model_path):
                logger.error(f"Model file not found at {model_path}")
                return False
            # The pickle file contains the LabelEncoder
            self.label_encoder = joblib.load(model_path)
            logger.info(f"Fertilizer classes: {self.label_encoder.classes_}")
            # The classifier is assumed to be in 'classifier.pkl' in the same directory
            classifier_path = os.path.join(ml_models_dir, 'classifier.pkl')
            if not os.path.exists(classifier_path):
                logger.error(f"Classifier file not found at {classifier_path}")
                return False
            self.model = joblib.load(classifier_path)
            print("Files in ML_Models:", os.listdir(ml_models_dir))
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
            soil_type_str = input_data['Soil_Type']
            crop_type_str = input_data['Crop_Type']

            if soil_type_str not in soil_type_map:
                raise ValueError(f"Invalid Soil_Type: {soil_type_str}. Allowed: {list(soil_type_map.keys())}")
            if crop_type_str not in crop_type_map:
                raise ValueError(f"Invalid Crop_Type: {crop_type_str}. Allowed: {list(crop_type_map.keys())}")

            soil_type = soil_type_map[soil_type_str]
            crop_type = crop_type_map[crop_type_str]

            features = [[
                input_data['Temparature'],
                input_data['Humidity'],
                input_data['Moisture'],
                soil_type,
                crop_type,
                input_data['Nitrogen'],
                input_data['Potassium'],
                input_data['Phosphorous']
            ]]
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

@app.route("/sms", methods=["POST"])
def sms_reply():
    validator = RequestValidator(TWILIO_AUTH_TOKEN)
    twilio_signature = request.headers.get("X-Twilio-Signature", "")
    url = request.url
    post_vars = request.form.to_dict()

    is_valid = validator.validate(url, post_vars, twilio_signature)
    if not is_valid:
        abort(403)

    incoming_msg = post_vars.get('Body', '').strip()
    resp = MessagingResponse()

    # --- Parse the SMS body for model input ---
    # Example expected format: "Temp:25,Humidity:60,Moisture:30,Soil_Type:Sandy,Crop_Type:Wheat,N:50,P:30,K:20"
    try:
        # Simple parser (adapt as needed)
        data = {}
        for part in incoming_msg.split(','):
            if ':' in part:
                key, value = part.split(':', 1)
                key = key.strip().lower()
                value = value.strip()
                # Map SMS keys to model keys
                key_map = {
                    'temp': 'Temparature',
                    'temperature': 'Temparature',
                    'humidity': 'Humidity',
                    'moisture': 'Moisture',
                    'soil_type': 'Soil_Type',
                    'soil': 'Soil_Type',
                    'crop_type': 'Crop_Type',
                    'crop': 'Crop_Type',
                    'n': 'Nitrogen',
                    'nitrogen': 'Nitrogen',
                    'p': 'Phosphorous',
                    'phosphorous': 'Phosphorous',
                    'k': 'Potassium',
                    'potassium': 'Potassium'
                }
                mapped_key = key_map.get(key, key)
                data[mapped_key] = value

        # Convert numeric fields
        for field in ['Temparature', 'Humidity', 'Moisture', 'Nitrogen', 'Potassium', 'Phosphorous']:
            if field in data:
                data[field] = float(data[field])

        # Check for missing fields
        missing = [col for col in MODEL_COLUMNS if col not in data]
        if missing:
            resp.message(f"Missing fields: {', '.join(missing)}. Please send all required data.")
        else:
            # Predict
            result = model_server.predict(data)
            reply = (
                f"Recommended Fertilizer: {result['fertilizer_name']}\n"
                f"Application Rate: {result['application_rate']}\n"
                f"Confidence: {result['confidence']}\n"
                f"Expected Yield Increase: {result['expected_yield_increase']}"
            )
            resp.message(reply)
    except Exception as e:
        resp.message(f"Error processing your request: {str(e)}")

    return Response(str(resp), mimetype='application/xml')

if __name__ == '__main__':
    load_dotenv()
    app.run(host='0.0.0.0', port=8000, debug=True)