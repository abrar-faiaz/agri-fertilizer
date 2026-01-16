import json
import os
import sys

# Check if catboost is available
try:
    import pandas as pd
    from catboost import CatBoostRegressor
    HAS_CATBOOST = True
except ImportError:
    HAS_CATBOOST = False


def main():
    payload = sys.stdin.read().strip()
    if not payload:
        print(json.dumps({"error": "Missing input payload"}))
        return

    data = json.loads(payload)

    if not HAS_CATBOOST:
        # Simulation mode when packages not installed
        # Return a plausible prediction based on inputs
        base_yield = 3.5
        if data.get("Fertilizer_Used"):
            base_yield += 0.8
        if data.get("Irrigation_Used"):
            base_yield += 0.6
        if data.get("Soil_Type") == "Loam":
            base_yield += 0.4
        elif data.get("Soil_Type") == "Clay":
            base_yield += 0.2
        rainfall = float(data.get("Rainfall_mm", 800))
        if 700 < rainfall < 1200:
            base_yield += 0.3
        print(json.dumps({"prediction": f"{base_yield:.2f} tons per hectare (simulation mode - install catboost for real predictions)"}))
        return

    # Get the directory where this script is located
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(script_dir)
    model_path = os.path.join(project_root, "yield_model.cbm")

    model = CatBoostRegressor()
    model.load_model(model_path)

    input_data = pd.DataFrame(
        {
            "Soil_Type": [data.get("Soil_Type")],
            "Crop": [data.get("Crop")],
            "Rainfall_mm": [float(data.get("Rainfall_mm"))],
            "Temperature_Celsius": [float(data.get("Temperature_Celsius"))],
            "Fertilizer_Used": [bool(data.get("Fertilizer_Used"))],
            "Irrigation_Used": [bool(data.get("Irrigation_Used"))],
        }
    )

    prediction = model.predict(input_data)[0]
    print(json.dumps({"prediction": f"{prediction:.2f} tons per hectare"}))


if __name__ == "__main__":
    main()
