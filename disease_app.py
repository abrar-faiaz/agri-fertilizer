import gradio as gr
import numpy as np
import cv2
import tensorflow as tf
import torch
from PIL import Image

# ============== HF Transformers / ViT Model ==============
from transformers import ViTImageProcessor, ViTForImageClassification

# ----------- 1. Load the ViT model & processor ------------
vit_processor = ViTImageProcessor.from_pretrained('wambugu1738/crop_leaf_diseases_vit')
vit_model = ViTForImageClassification.from_pretrained(
    'wambugu1738/crop_leaf_diseases_vit',
    ignore_mismatched_sizes=True
)

vit_label_treatment = {
    "Corn___Common_rust": "Use recommended fungicides and ensure crop rotation.",
    "Corn___Cercospora_leaf_spot": "Apply foliar fungicides; ensure good field sanitation.",
    "Potato___Early_blight": "Apply preventive fungicides; remove infected debris.",
    "Potato___Late_blight": "Use certified seed tubers; fungicide sprays when conditions favor disease.",
    "Rice___Leaf_blight": "Use resistant rice varieties, maintain field hygiene.",
    "Rice___Brown_spot": "For brown spot of rice, employ integrated disease management practices. Use disease-resistant rice varieties and ensure balanced fertilization to prevent excessive nitrogen application. Maintain optimal irrigation to avoid water stress, and at the first signs of infection, apply fungicides such as carbendazim or validamycin following label recommendations. Remove and destroy infected plant debris to reduce inoculum, and consider crop rotation to mitigate disease recurrence.",
    "Rice___Brown_Spot": "For brown spot of rice, employ integrated disease management practices. Use disease-resistant rice varieties and ensure balanced fertilization to prevent excessive nitrogen application. Maintain optimal irrigation to avoid water stress, and at the first signs of infection, apply fungicides such as carbendazim or validamycin following label recommendations. Remove and destroy infected plant debris to reduce inoculum, and consider crop rotation to mitigate disease recurrence.",
    "Wheat___Leaf_rust": "Plant resistant wheat varieties, apply foliar fungicides if severe.",
    # Fallback
    "Unknown": "No specific treatment available."
}

def classify_image_vit(image):
    if not isinstance(image, Image.Image):
        image = Image.fromarray(image.astype('uint8'), 'RGB')
    inputs = vit_processor(images=image, return_tensors="pt")
    outputs = vit_model(**inputs)
    logits = outputs.logits
    predicted_class_idx = logits.argmax(-1).item()

    # Predicted label
    predicted_label = vit_model.config.id2label.get(predicted_class_idx, "Unknown")
    treatment_text = vit_label_treatment.get(predicted_label, "No specific treatment available.")
    return predicted_label, treatment_text


# ============== TensorFlow Model (plant_model_v5-beta.h5) ==============
# Load the model
keras_model = tf.keras.models.load_model('plant_model_v5-beta.h5')

# Define the class names
class_names = {
    0: 'Apple___Apple_scab',
    1: 'Apple___Black_rot',
    2: 'Apple___Cedar_apple_rust',
    3: 'Apple___healthy',
    4: 'Not a plant',
    5: 'Blueberry___healthy',
    6: 'Cherry___Powdery_mildew',
    7: 'Cherry___healthy',
    8: 'Corn___Cercospora_leaf_spot Gray_leaf_spot',
    9: 'Corn___Common_rust',
    10: 'Corn___Northern_Leaf_Blight',
    11: 'Corn___healthy',
    12: 'Grape___Black_rot',
    13: 'Grape___Esca_(Black_Measles)',
    14: 'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)',
    15: 'Grape___healthy',
    16: 'Orange___Haunglongbing_(Citrus_greening)',
    17: 'Peach___Bacterial_spot',
    18: 'Peach___healthy',
    19: 'Pepper,_bell___Bacterial_spot',
    20: 'Pepper,_bell___healthy',
    21: 'Potato___Early_blight',
    22: 'Potato___Late_blight',
    23: 'Potato___healthy',
    24: 'Raspberry___healthy',
    25: 'Soybean___healthy',
    26: 'Squash___Powdery_mildew',
    27: 'Strawberry___Leaf_scorch',
    28: 'Strawberry___healthy',
    29: 'Tomato___Bacterial_spot',
    30: 'Tomato___Early_blight',
    31: 'Tomato___Late_blight',
    32: 'Tomato___Leaf_Mold',
    33: 'Tomato___Septoria_leaf_spot',
    34: 'Tomato___Spider_mites Two-spotted_spider_mite',
    35: 'Tomato___Target_Spot',
    36: 'Tomato___Tomato_Yellow_Leaf_Curl_Virus',
    37: 'Tomato___Tomato_mosaic_virus',
    38: 'Tomato___healthy'
}

# Example dictionary of "treatments" for some classes
keras_treatments = {
    'Apple___Apple_scab': "Remove fallen leaves and prune infected branches. Apply fungicides containing captan or myclobutanil.",
    'Apple___Black_rot': "Prune out dead branches. Spray copper-based fungicide during early fruit development.",
    'Apple___Cedar_apple_rust': "Remove nearby juniper trees. Apply fungicides before bud break.",
    'Apple___healthy': "No action required. The plant is healthy.",
    'Blueberry___healthy': "No action required. The plant is healthy.",
    'Cherry___Powdery_mildew': "Apply sulfur-based fungicide. Ensure good air circulation around the plant.",
    'Cherry___healthy': "No action required. The plant is healthy.",
    'Corn___Cercospora_leaf_spot Gray_leaf_spot': "Rotate crops to avoid build-up of pathogens. Use resistant hybrids and apply foliar fungicides.",
    'Corn___Common_rust': "Plant rust-resistant hybrids. Apply fungicides at the first sign of rust.",
    'Corn___Northern_Leaf_Blight': "Use resistant varieties and apply fungicides when lesions are observed.",
    'Corn___healthy': "No action required. The plant is healthy.",
    'Grape___Black_rot': "Remove and destroy infected leaves and fruits. Apply fungicides containing myclobutanil or captan.",
    'Grape___Esca_(Black_Measles)': "Prune and destroy infected wood. Apply fungicides during the growing season.",
    'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)': "Maintain good air circulation. Spray protective fungicides like mancozeb.",
    'Grape___healthy': "No action required. The plant is healthy.",
    'Orange___Haunglongbing_(Citrus_greening)': "Remove and destroy infected trees. Control psyllid vectors with insecticides.",
    'Peach___Bacterial_spot': "Apply copper-based bactericides. Use resistant varieties and avoid overhead irrigation.",
    'Peach___healthy': "No action required. The plant is healthy.",
    'Pepper,_bell___Bacterial_spot': "Apply copper-based sprays. Use certified seeds and avoid overhead irrigation.",
    'Pepper,_bell___healthy': "No action required. The plant is healthy.",
    'Potato___Early_blight': "Use certified seeds and apply preventative fungicides like chlorothalonil.",
    'Potato___Late_blight': "Plant disease-free tubers and use fungicides containing metalaxyl.",
    'Potato___healthy': "No action required. The plant is healthy.",
    'Raspberry___healthy': "No action required. The plant is healthy.",
    'Soybean___healthy': "No action required. The plant is healthy.",
    'Squash___Powdery_mildew': "Use sulfur-based fungicides and ensure good ventilation.",
    'Strawberry___Leaf_scorch': "Remove infected leaves. Apply fungicides containing myclobutanil.",
    'Strawberry___healthy': "No action required. The plant is healthy.",
    'Tomato___Bacterial_spot': "Apply copper-based sprays. Avoid overhead watering.",
    'Tomato___Early_blight': "Prune infected leaves and apply fungicides containing chlorothalonil or mancozeb.",
    'Tomato___Late_blight': "Remove infected plants. Apply fungicides containing chlorothalonil or metalaxyl.",
    'Tomato___Leaf_Mold': "Ensure good ventilation and apply fungicides like mancozeb.",
    'Tomato___Septoria_leaf_spot': "Remove infected leaves and apply fungicides containing chlorothalonil.",
    'Tomato___Spider_mites Two-spotted_spider_mite': "Spray insecticidal soap or neem oil. Maintain humidity levels.",
    'Tomato___Target_Spot': "Use resistant varieties. Apply fungicides containing chlorothalonil.",
    'Tomato___Tomato_Yellow_Leaf_Curl_Virus': "Remove infected plants. Use resistant varieties and control whitefly vectors.",
    'Tomato___Tomato_mosaic_virus': "Remove infected plants and disinfect tools. Use resistant seed varieties.",
    'Tomato___healthy': "No action required. The plant is healthy.",
    'Unknown': "No specific treatment available."
}

def edge_and_cut(img, threshold1, threshold2):
    emb_img = img.copy()
    edges = cv2.Canny(img, threshold1, threshold2)
    edge_coors = []
    for i in range(edges.shape[0]):
        for j in range(edges.shape[1]):
            if edges[i][j] != 0:
                edge_coors.append((i, j))

    if len(edge_coors) == 0:
        return emb_img

    row_min = edge_coors[np.argsort([coor[0] for coor in edge_coors])[0]][0]
    row_max = edge_coors[np.argsort([coor[0] for coor in edge_coors])[-1]][0]
    col_min = edge_coors[np.argsort([coor[1] for coor in edge_coors])[0]][1]
    col_max = edge_coors[np.argsort([coor[1] for coor in edge_coors])[-1]][1]
    new_img = img[row_min:row_max, col_min:col_max]

    # Simple bounding box in white
    emb_color = np.array([255], dtype=np.uint8)
    emb_img[row_min-10:row_min+10, col_min:col_max] = emb_color
    emb_img[row_max-10:row_max+10, col_min:col_max] = emb_color
    emb_img[row_min:row_max, col_min-10:col_min+10] = emb_color
    emb_img[row_min:row_max, col_max-10:col_max+10] = emb_color

    return emb_img

def classify_and_visualize_keras(image):
    # Preprocess the image
    img_array = tf.image.resize(image, [256, 256])
    img_array = tf.expand_dims(img_array, 0) / 255.0

    # Make a prediction
    prediction = keras_model.predict(img_array)
    predicted_class_idx = tf.argmax(prediction[0], axis=-1).numpy()
    confidence = np.max(prediction[0])
    
    # Obtain the predicted label
    predicted_label = class_names.get(predicted_class_idx, "Unknown")

    if confidence < 0.60:
        class_name = "Uncertain / Not in dataset"
        bounded_image = image
        treatment_text = "No treatment recommendation (uncertain prediction)."
    else:
        class_name = predicted_label
        bounded_image = edge_and_cut(image, 200, 400)
        treatment_text = keras_treatments.get(predicted_label, "No specific treatment available.")
    
    return class_name, float(confidence), bounded_image, treatment_text


# ============== Combined Gradio App ==============
def main_model_selector(model_choice, image):
    """
    Dispatch function based on user choice of model:
      - 'ViT (Corn, Potato, Rice, Wheat)' -> use classify_image_vit
      - 'Keras (Apple, Blueberry, Cherry, etc.)' -> use classify_and_visualize_keras
    """
    if image is None:
        return "No image provided.", None, None, None
    
    if model_choice == "ViT (Corn, Potato, Rice, Wheat)":
        # Return: label, treatment
        predicted_label, treatment_text = classify_image_vit(image)
        # For consistency with the Keras model outputs, 
        # we'll keep placeholders for confidence & bounding box
        return predicted_label, None, image, treatment_text
    
    elif model_choice == "Keras (Apple, Blueberry, Cherry, etc.)":
        # Return: class_name, confidence, bounded_image, treatment_text
        class_name, confidence, bounded_image, treatment_text = classify_and_visualize_keras(image)
        return class_name, confidence, bounded_image, treatment_text
    
    else:
        return "Invalid model choice.", None, None, None


# Create Gradio interface
with gr.Blocks() as demo:
    gr.Markdown("# **Plant Disease Detection**")
    gr.Markdown(
        "Select which model you want to use, then upload an image to see the prediction, "
        "confidence (if applicable), bounding box (if applicable), and a suggested treatment."
    )

    with gr.Row():
        model_choice = gr.Radio(
            choices=["ViT (Corn, Potato, Rice, Wheat)", "Keras (Apple, Blueberry, Cherry, etc.)"],
            value="Keras (Apple, Blueberry, Cherry, etc.)",
            label="Select Model"
        )

    with gr.Row():
        inp_image = gr.Image(type="numpy", label="Upload Leaf Image")

    # Outputs
    with gr.Row():
        out_label = gr.Textbox(label="Predicted Class")
        out_confidence = gr.Textbox(label="Confidence (If Available)")
    out_bounded_image = gr.Image(label="Visualization (If Available)")
    out_treatment = gr.Textbox(label="Treatment Recommendation")

    # Button
    btn = gr.Button("Classify")

    # Function binding
    btn.click(
        fn=main_model_selector, 
        inputs=[model_choice, inp_image], 
        outputs=[out_label, out_confidence, out_bounded_image, out_treatment]
    )

    # Provide some example images
    gr.Examples(
        examples=[
            ["Keras (Apple, Blueberry, Cherry, etc.)", "corn.jpg"],
            ["Keras (Apple, Blueberry, Cherry, etc.)", "grot.jpg"],
            ["Keras (Apple, Blueberry, Cherry, etc.)", "Potato___Early_blight.jpg"],
            ["Keras (Apple, Blueberry, Cherry, etc.)", "Tomato___Target_Spot.jpg"],
            ["ViT (Corn, Potato, Rice, Wheat)", "corn.jpg"],
        ],
        inputs=[model_choice, inp_image]
    )

demo.launch(share=True)
