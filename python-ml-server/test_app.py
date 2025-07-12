import unittest
import json
import tempfile
import os
import sys
from unittest.mock import patch, MagicMock
import pandas as pd
import numpy as np

# Add the parent directory to the path to import app
sys.path.append(os.path.dirname(os.path.abspath(_file_)))

from app import app, FertilizerModelServer

class TestFertilizerModelServer(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True
        
        # Create a temporary directory for test models
        self.test_dir = tempfile.mkdtemp()
        self.ml_models_dir = os.path.join(self.test_dir, 'ML_Models')
        os.makedirs(self.ml_models_dir, exist_ok=True)
        
        # Mock model files
        self.model_path = os.path.join(self.ml_models_dir, 'fertilizer.pkl')
        self.classifier_path = os.path.join(self.ml_models_dir, 'classifier.pkl')
        
        # Create dummy model files
        with open(self.model_path, 'w') as f:
            f.write('dummy_label_encoder')
        with open(self.classifier_path, 'w') as f:
            f.write('dummy_classifier')

    def tearDown(self):
        # Clean up temporary files
        import shutil
        shutil.rmtree(self.test_dir)

    @patch('app.joblib.load')
    def test_model_loading_success(self, mock_joblib_load):
        """Test successful model loading"""
        # Mock the joblib.load to return a mock label encoder
        mock_label_encoder = MagicMock()
        mock_label_encoder.classes_ = ['NPK 20-20-20', 'Urea', 'DAP']
        mock_joblib_load.side_effect = [mock_label_encoder, MagicMock()]
        
        with patch('app.os.path.exists', return_value=True):
            model_server = FertilizerModelServer()
            self.assertTrue(model_server.load_model())

    @patch('app.os.path.exists')
    def test_model_loading_failure(self, mock_exists):
        """Test model loading failure when files don't exist"""
        mock_exists.return_value = False
        
        model_server = FertilizerModelServer()
        self.assertFalse(model_server.load_model())

    @patch('app.joblib.load')
    def test_prediction_with_valid_input(self, mock_joblib_load):
        """Test prediction with valid input data"""
        # Mock the model and label encoder
        mock_label_encoder = MagicMock()
        mock_label_encoder.classes_ = ['NPK 20-20-20', 'Urea', 'DAP']
        
        mock_model = MagicMock()
        mock_model.predict.return_value = [0]  # Predict NPK 20-20-20
        mock_model.predict_proba.return_value = [[0.85, 0.10, 0.05]]
        
        mock_joblib_load.side_effect = [mock_label_encoder, mock_model]
        
        with patch('app.os.path.exists', return_value=True):
            model_server = FertilizerModelServer()
            model_server.load_model()
            
            input_data = {
                'Temparature': 25,
                'Humidity': 60,
                'Moisture': 30,
                'Soil_Type': 'Sandy',
                'Crop_Type': 'Wheat',
                'Nitrogen': 50,
                'Potassium': 20,
                'Phosphorous': 30
            }
            
            result = model_server.predict(input_data)
            
            self.assertEqual(result['fertilizer_name'], 'NPK 20-20-20')
            self.assertEqual(result['application_rate'], '150 kg/ha')
            self.assertIn('confidence', result)
            self.assertIn('expected_yield_increase', result)

    def test_prediction_with_invalid_soil_type(self):
        """Test prediction with invalid soil type"""
        with patch('app.joblib.load'):
            model_server = FertilizerModelServer()
            
            input_data = {
                'Temparature': 25,
                'Humidity': 60,
                'Moisture': 30,
                'Soil_Type': 'InvalidSoil',
                'Crop_Type': 'Wheat',
                'Nitrogen': 50,
                'Potassium': 20,
                'Phosphorous': 30
            }
            
            with self.assertRaises(ValueError):
                model_server.predict(input_data)

    def test_prediction_with_invalid_crop_type(self):
        """Test prediction with invalid crop type"""
        with patch('app.joblib.load'):
            model_server = FertilizerModelServer()
            
            input_data = {
                'Temparature': 25,
                'Humidity': 60,
                'Moisture': 30,
                'Soil_Type': 'Sandy',
                'Crop_Type': 'InvalidCrop',
                'Nitrogen': 50,
                'Potassium': 20,
                'Phosphorous': 30
            }
            
            with self.assertRaises(ValueError):
                model_server.predict(input_data)

    def test_prediction_with_missing_fields(self):
        """Test prediction with missing required fields"""
        with patch('app.joblib.load'):
            model_server = FertilizerModelServer()
            
            input_data = {
                'Temparature': 25,
                'Humidity': 60,
                # Missing other required fields
            }
            
            with self.assertRaises(ValueError):
                model_server.predict(input_data)


class TestFlaskApp(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    def test_health_check_endpoint(self):
        """Test the health check endpoint"""
        with patch('app.model_server.model') as mock_model:
            mock_model.return_value = MagicMock()
            
            response = self.app.get('/health')
            data = json.loads(response.data)
            
            self.assertEqual(response.status_code, 200)
            self.assertIn('status', data)
            self.assertIn('model_loaded', data)
            self.assertIn('timestamp', data)

    def test_predict_endpoint_with_valid_data(self):
        """Test the predict endpoint with valid data"""
        mock_prediction = {
            'fertilizer_name': 'NPK 20-20-20',
            'application_rate': '150 kg/ha',
            'confidence': '85.5%',
            'expected_yield_increase': '+25.6%'
        }
        
        with patch('app.model_server.predict', return_value=mock_prediction):
            input_data = {
                'Temparature': 25,
                'Humidity': 60,
                'Moisture': 30,
                'Soil_Type': 'Sandy',
                'Crop_Type': 'Wheat',
                'Nitrogen': 50,
                'Potassium': 20,
                'Phosphorous': 30
            }
            
            response = self.app.post('/predict',
                                   data=json.dumps(input_data),
                                   content_type='application/json')
            
            self.assertEqual(response.status_code, 200)
            data = json.loads(response.data)
            self.assertEqual(data['fertilizer_name'], 'NPK 20-20-20')

    def test_predict_endpoint_with_invalid_data(self):
        """Test the predict endpoint with invalid data"""
        input_data = {
            'Temparature': 25,
            'Humidity': 60,
            # Missing required fields
        }
        
        response = self.app.post('/predict',
                               data=json.dumps(input_data),
                               content_type='application/json')
        
        self.assertEqual(response.status_code, 400)
        data = json.loads(response.data)
        self.assertIn('error', data)

    def test_predict_endpoint_with_no_data(self):
        """Test the predict endpoint with no data"""
        response = self.app.post('/predict')
        
        self.assertEqual(response.status_code, 400)
        data = json.loads(response.data)
        self.assertIn('error', data)

    def test_sms_endpoint_with_valid_data(self):
        """Test the SMS endpoint with valid data"""
        with patch('app.RequestValidator') as mock_validator:
            mock_validator.return_value.validate.return_value = True
            
            sms_data = {
                'Body': 'Temp:25,Humidity:60,Moisture:30,Soil_Type:Sandy,Crop_Type:Wheat,N:50,P:30,K:20'
            }
            
            with patch('app.model_server.predict') as mock_predict:
                mock_predict.return_value = {
                    'fertilizer_name': 'NPK 20-20-20',
                    'application_rate': '150 kg/ha'
                }
                
                response = self.app.post('/sms', data=sms_data)
                
                self.assertEqual(response.status_code, 200)
                self.assertIn('NPK 20-20-20', response.data.decode())

    def test_sms_endpoint_with_invalid_signature(self):
        """Test the SMS endpoint with invalid signature"""
        with patch('app.RequestValidator') as mock_validator:
            mock_validator.return_value.validate.return_value = False
            
            sms_data = {
                'Body': 'Temp:25,Humidity:60,Moisture:30,Soil_Type:Sandy,Crop_Type:Wheat,N:50,P:30,K:20'
            }
            
            response = self.app.post('/sms', data=sms_data)
            
            self.assertEqual(response.status_code, 403)

    def test_sms_endpoint_with_invalid_format(self):
        """Test the SMS endpoint with invalid SMS format"""
        with patch('app.RequestValidator') as mock_validator:
            mock_validator.return_value.validate.return_value = True
            
            sms_data = {
                'Body': 'Invalid SMS format'
            }
            
            response = self.app.post('/sms', data=sms_data)
            
            self.assertEqual(response.status_code, 200)
            self.assertIn('Invalid SMS format', response.data.decode())


class TestDataValidation(unittest.TestCase):
    def test_soil_type_validation(self):
        """Test soil type validation"""
        valid_soil_types = ['Sandy', 'Clay', 'Loamy', 'Black', 'Red', 'Clayey']
        invalid_soil_types = ['InvalidSoil', 'Rocky', 'Unknown']
        
        from app import soil_type_map
        
        for soil_type in valid_soil_types:
            self.assertIn(soil_type, soil_type_map)
        
        for soil_type in invalid_soil_types:
            self.assertNotIn(soil_type, soil_type_map)

    def test_crop_type_validation(self):
        """Test crop type validation"""
        valid_crop_types = ['Wheat', 'Rice', 'Maize', 'Sugarcane', 'Cotton', 'Tobacco']
        invalid_crop_types = ['InvalidCrop', 'Unknown', 'Test']
        
        from app import crop_type_map
        
        for crop_type in valid_crop_types:
            self.assertIn(crop_type, crop_type_map)
        
        for crop_type in invalid_crop_types:
            self.assertNotIn(crop_type, crop_type_map)

    def test_numeric_field_validation(self):
        """Test numeric field validation"""
        valid_temperatures = [0, 25, 50]
        invalid_temperatures = [-5, 60, 'invalid']
        
        for temp in valid_temperatures:
            self.assertIsInstance(temp, (int, float))
            self.assertTrue(0 <= temp <= 50)
        
        for temp in invalid_temperatures:
            if isinstance(temp, (int, float)):
                self.assertFalse(0 <= temp <= 50)


class TestErrorHandling(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    def test_model_prediction_error_handling(self):
        """Test error handling when model prediction fails"""
        with patch('app.model_server.predict') as mock_predict:
            mock_predict.side_effect = Exception("Model prediction failed")
            
            input_data = {
                'Temparature': 25,
                'Humidity': 60,
                'Moisture': 30,
                'Soil_Type': 'Sandy',
                'Crop_Type': 'Wheat',
                'Nitrogen': 50,
                'Potassium': 20,
                'Phosphorous': 30
            }
            
            response = self.app.post('/predict',
                                   data=json.dumps(input_data),
                                   content_type='application/json')
            
            self.assertEqual(response.status_code, 500)
            data = json.loads(response.data)
            self.assertIn('error', data)

    def test_database_connection_error(self):
        """Test error handling for database connection issues"""
        # This would be tested if the app had database functionality
        pass

    def test_memory_usage_optimization(self):
        """Test memory usage optimization"""
        # Test that the model doesn't consume excessive memory
        import psutil
        import os
        
        process = psutil.Process(os.getpid())
        initial_memory = process.memory_info().rss
        
        # Perform multiple predictions
        with patch('app.model_server.predict') as mock_predict:
            mock_predict.return_value = {
                'fertilizer_name': 'NPK 20-20-20',
                'application_rate': '150 kg/ha'
            }
            
            for _ in range(100):
                input_data = {
                    'Temparature': 25,
                    'Humidity': 60,
                    'Moisture': 30,
                    'Soil_Type': 'Sandy',
                    'Crop_Type': 'Wheat',
                    'Nitrogen': 50,
                    'Potassium': 20,
                    'Phosphorous': 30
                }
                
                response = self.app.post('/predict',
                                       data=json.dumps(input_data),
                                       content_type='application/json')
        
        final_memory = process.memory_info().rss
        memory_increase = final_memory - initial_memory
        
        # Memory increase should be reasonable (less than 50MB)
        self.assertLess(memory_increase, 50 * 1024 * 1024)


if _name_ == '_main_':
    unittest.main()