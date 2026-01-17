"""
Vercel Python Serverless Function for Disease Detection
This replaces the Node.js spawn approach that doesn't work on Vercel
"""

from http.server import BaseHTTPRequestHandler
import json
import base64
import tempfile
import os
import sys

# Add scripts directory to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'scripts'))


class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            content_length = int(self.headers.get('Content-Length', 0))
            content_type = self.headers.get('Content-Type', '')
            
            if 'multipart/form-data' in content_type:
                # Parse multipart form data
                body = self.rfile.read(content_length)
                result = self._process_multipart(body, content_type)
            else:
                # Handle JSON body (base64 encoded image)
                body = self.rfile.read(content_length)
                data = json.loads(body.decode('utf-8'))
                result = self._process_json(data)
            
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(result).encode('utf-8'))
            
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            error_response = {"error": str(e)}
            self.wfile.write(json.dumps(error_response).encode('utf-8'))
    
    def _process_json(self, data):
        """Process JSON request with base64 image"""
        image_data = data.get('image')
        model_type = data.get('model', 'keras')
        
        if not image_data:
            return {"error": "Image is required"}
        
        # Decode base64 image
        if ',' in image_data:
            image_data = image_data.split(',')[1]
        
        image_bytes = base64.b64decode(image_data)
        
        return self._predict(image_bytes, model_type)
    
    def _process_multipart(self, body, content_type):
        """Process multipart form data"""
        import cgi
        import io
        
        # Extract boundary
        boundary = content_type.split('boundary=')[1]
        
        # Simple multipart parser
        parts = body.split(f'--{boundary}'.encode())
        
        image_data = None
        model_type = 'keras'
        
        for part in parts:
            if b'name="image"' in part or b'name="file"' in part:
                # Extract file content (after double newline)
                if b'\r\n\r\n' in part:
                    image_data = part.split(b'\r\n\r\n', 1)[1].rstrip(b'\r\n--')
            elif b'name="model"' in part:
                if b'\r\n\r\n' in part:
                    model_type = part.split(b'\r\n\r\n', 1)[1].decode().strip().rstrip('\r\n--')
        
        if not image_data:
            return {"error": "Image is required"}
        
        return self._predict(image_data, model_type)
    
    def _predict(self, image_bytes, model_type='keras'):
        """Run disease prediction"""
        try:
            import numpy as np
            from PIL import Image
            import io
            
            # Load image
            img = Image.open(io.BytesIO(image_bytes))
            if img.mode != 'RGB':
                img = img.convert('RGB')
            
            if model_type == 'keras':
                return self._predict_keras(img)
            else:
                return self._predict_simple(img)
                
        except ImportError as e:
            return {
                "error": f"Missing dependency: {str(e)}",
                "disease": "Unknown",
                "confidence": 0.0,
                "details": "Server configuration error - missing Python packages"
            }
        except Exception as e:
            return {
                "error": str(e),
                "disease": "Unknown",
                "confidence": 0.0
            }
    
    def _predict_keras(self, img):
        """Keras/TensorFlow prediction"""
        try:
            import numpy as np
            
            # Try to load keras model
            try:
                from tensorflow import keras
                model_path = os.path.join(os.path.dirname(__file__), '..', 'plant_disease.h5')
                
                if not os.path.exists(model_path):
                    return {
                        "error": "Model file not found",
                        "disease": "Unknown",
                        "confidence": 0.0
                    }
                
                model = keras.models.load_model(model_path)
                
                # Preprocess image
                img_resized = img.resize((224, 224))
                img_array = np.array(img_resized) / 255.0
                img_array = np.expand_dims(img_array, axis=0)
                
                # Predict
                predictions = model.predict(img_array, verbose=0)
                predicted_class = int(np.argmax(predictions[0]))
                confidence = float(predictions[0][predicted_class])
                
                # Class names (adjust based on your model)
                class_names = [
                    'Apple___Apple_scab', 'Apple___Black_rot', 'Apple___Cedar_apple_rust', 'Apple___healthy',
                    'Blueberry___healthy', 'Cherry___Powdery_mildew', 'Cherry___healthy',
                    'Corn___Cercospora_leaf_spot', 'Corn___Common_rust', 'Corn___Northern_Leaf_Blight', 'Corn___healthy',
                    'Grape___Black_rot', 'Grape___Esca', 'Grape___Leaf_blight', 'Grape___healthy',
                    'Orange___Haunglongbing', 'Peach___Bacterial_spot', 'Peach___healthy',
                    'Pepper___Bacterial_spot', 'Pepper___healthy',
                    'Potato___Early_blight', 'Potato___Late_blight', 'Potato___healthy',
                    'Raspberry___healthy', 'Soybean___healthy',
                    'Squash___Powdery_mildew', 'Strawberry___Leaf_scorch', 'Strawberry___healthy',
                    'Tomato___Bacterial_spot', 'Tomato___Early_blight', 'Tomato___Late_blight',
                    'Tomato___Leaf_Mold', 'Tomato___Septoria_leaf_spot', 'Tomato___Spider_mites',
                    'Tomato___Target_Spot', 'Tomato___Tomato_Yellow_Leaf_Curl_Virus', 'Tomato___Tomato_mosaic_virus',
                    'Tomato___healthy'
                ]
                
                disease_name = class_names[predicted_class] if predicted_class < len(class_names) else f"Class_{predicted_class}"
                
                return {
                    "disease": disease_name,
                    "confidence": confidence,
                    "class_id": predicted_class
                }
                
            except Exception as e:
                return {
                    "error": f"Keras prediction failed: {str(e)}",
                    "disease": "Unknown",
                    "confidence": 0.0
                }
                
        except Exception as e:
            return {"error": str(e), "disease": "Unknown", "confidence": 0.0}
    
    def _predict_simple(self, img):
        """Fallback simple prediction without TensorFlow"""
        return {
            "disease": "Analysis unavailable",
            "confidence": 0.0,
            "details": "Simple model not available on this server"
        }
