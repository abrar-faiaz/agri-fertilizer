"""
Vercel Python Serverless Function for Disease Detection
Note: TensorFlow and PyTorch are too large for Vercel serverless functions (50MB limit).
This provides a lightweight fallback that explains the limitation.
"""

from http.server import BaseHTTPRequestHandler
import json

# Disease information for reference
VIT_DISEASES = {
    "Corn___Common_rust": "Use recommended fungicides and ensure crop rotation.",
    "Corn___Cercospora_leaf_spot": "Apply foliar fungicides; ensure good field sanitation.",
    "Potato___Early_blight": "Apply preventive fungicides; remove infected debris.",
    "Potato___Late_blight": "Use certified seed tubers; fungicide sprays when conditions favor disease.",
    "Rice___Leaf_blight": "Use resistant rice varieties, maintain field hygiene.",
    "Rice___Brown_spot": "Use disease-resistant varieties, balanced fertilization, apply fungicides.",
    "Wheat___Leaf_rust": "Plant resistant wheat varieties, apply foliar fungicides if severe.",
}

KERAS_DISEASES = {
    "Apple___Apple_scab": "Remove fallen leaves and prune infected branches. Apply fungicides.",
    "Apple___Black_rot": "Prune out dead branches. Spray copper-based fungicide.",
    "Corn___Common_rust": "Plant rust-resistant hybrids. Apply fungicides at first sign of rust.",
    "Potato___Early_blight": "Use certified seeds and apply preventative fungicides.",
    "Potato___Late_blight": "Plant disease-free tubers and use fungicides containing metalaxyl.",
    "Tomato___Early_blight": "Mulch around plants, avoid overhead watering, apply fungicides.",
    "Tomato___Late_blight": "Remove infected plants, apply copper-based fungicides.",
}


class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length)
            
            try:
                data = json.loads(body.decode('utf-8'))
            except:
                data = {}
            
            model_type = data.get('model', 'keras')
            
            result = {
                "error": "ML_MODEL_UNAVAILABLE",
                "message": "Disease detection ML models (TensorFlow/PyTorch) are too large for Vercel serverless functions (50MB limit). Please run this application locally for full disease detection functionality.",
                "suggestion": "For production deployment, consider using a dedicated ML hosting service like Hugging Face Inference API, AWS SageMaker, or Google Cloud AI Platform.",
                "model_requested": model_type,
                "available_diseases": list(VIT_DISEASES.keys() if model_type == "vit" else KERAS_DISEASES.keys()),
                "status": "serverless_limitation"
            }
            
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(result).encode('utf-8'))
            
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            error_response = {"error": str(e)}
            self.wfile.write(json.dumps(error_response).encode('utf-8'))
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
