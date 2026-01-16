import gradio as gr
import pandas as pd
from catboost import CatBoostRegressor

# Load the saved CatBoost model
model = CatBoostRegressor()
model.load_model("catboost_yield_model.cbm")

# Define the unique values for dropdown inputs
unique_soil_types = ['Sandy', 'Clay', 'Loam', 'Silt', 'Peaty', 'Chalky']
unique_crops = ['Cotton', 'Rice', 'Barley', 'Soybean', 'Wheat', 'Maize']
unique_irrigation_used = [True, False]
unique_fertilizer_used = [True, False]

# Prediction function
def predict_yield(soil_type, crop, rainfall, temperature, fertilizer_used, irrigation_used):
    input_data = pd.DataFrame({
        'Soil_Type': [soil_type],
        'Crop': [crop],
        'Rainfall_mm': [float(rainfall)],
        'Temperature_Celsius': [float(temperature)],
        'Fertilizer_Used': [fertilizer_used],
        'Irrigation_Used': [irrigation_used]
    })
    prediction = model.predict(input_data)
    return f"Predicted Yield (tons per hectare): {prediction[0]:.2f}"

# Create the Gradio interface
with gr.Blocks() as demo:
    gr.Markdown("# 🌾 Crop Yield Prediction App 🌦️")
    gr.Markdown("Provide the following details to predict the crop yield (tons per hectare):")
    
    with gr.Row():
        soil_type = gr.Dropdown(choices=unique_soil_types, label="Soil Type", value="Sandy")
        crop = gr.Dropdown(choices=unique_crops, label="Type of Crop", value="Cotton")
    
    with gr.Row():
        rainfall = gr.Textbox(label="Average Rainfall (mm)", value="897.077239")
        temperature = gr.Textbox(label="Average Temperature (Celsius)", value="27.676966")
    
    with gr.Row():
        fertilizer_used = gr.Dropdown(choices=unique_fertilizer_used, label="Fertilizer Used?", value=False)
        irrigation_used = gr.Dropdown(choices=unique_irrigation_used, label="Irrigation Used?", value=True)
    
    predict_button = gr.Button("🔮 Predict Yield")
    output = gr.Textbox(label="Prediction Output")
    
    predict_button.click(
        predict_yield, 
        inputs=[soil_type, crop, rainfall, temperature, fertilizer_used, irrigation_used],
        outputs=output
    )
    
    gr.Examples(
        examples=[
            ["Sandy", "Cotton", "897.077239", "27.676966", False, True],
            ["Clay", "Rice", "1200", "30", True, False],
        ],
        inputs=[soil_type, crop, rainfall, temperature, fertilizer_used, irrigation_used]
    )

    gr.Markdown("### 🌟 Thank you for using the Crop Yield Prediction App! 🌱")

# Launch the app
demo.launch()
