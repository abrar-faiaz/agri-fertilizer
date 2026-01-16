import gradio as gr

# ------------------------------------
# 1. DEFINE THE STVI THRESHOLDS
# ------------------------------------
STVI_THRESHOLDS = {
    "N": {
        "Very Low":  (0.00, 0.09),
        "Low":       (0.091, 0.18),
        "Medium":    (0.181, 0.27),
        "Optimum":   (0.271, 0.36),
        "High":      (0.361, 0.45),
        "Very High": (0.451, 999.999),
    },
    "P": {
        # Olsen method (µg/g)
        "Very Low":  (0.00, 6.0),
        "Low":       (6.1, 12.0),
        "Medium":    (12.1, 18.0),
        "Optimum":   (18.1, 24.0),
        "High":      (24.1, 30.0),
        "Very High": (30.1, 999.999),
    },
    "K": {
        # meq/100g
        "Very Low":  (0.00, 0.075),
        "Low":       (0.076, 0.15),
        "Medium":    (0.151, 0.225),
        "Optimum":   (0.226, 0.30),
        "High":      (0.31, 0.375),
        "Very High": (0.376, 999.999),
    },
    "S": {
        # µg/g
        "Very Low":  (0.00, 9.0),
        "Low":       (9.1, 18.0),
        "Medium":    (18.1, 27.0),
        "Optimum":   (27.1, 36.0),
        "High":      (36.1, 45.0),
        "Very High": (45.1, 999.999),
    },
    "Zn": {
        # µg/g
        "Very Low":  (0.00, 0.45),
        "Low":       (0.451, 0.90),
        "Medium":    (0.91, 1.35),
        "Optimum":   (1.351, 1.80),
        "High":      (1.81, 2.25),
        "Very High": (2.251, 999.999),
    },
    "B": {
        # µg/g, as per your table
        "Very Low":  (0.00, 0.15),
        "Low":       (0.151, 0.30),
        "Medium":    (0.31, 0.45),
        "Optimum":   (0.451, 0.60),
        "High":      (0.61, 0.75),
        "Very High": (0.751, 999.999),
    },
}

# ------------------------------------
# 2. RECOMMENDED RANGES PER VARIETY/YIELD

aman_rice = {
    "N": {
        "Optimum":   (0, 12),
        "Medium":    (13, 24),
        "Low":       (25, 36),
        "Very Low":  (37, 48),
        "High":      (0, 0),
        "Very High": (0, 0),
    },
    "P": {
        "Optimum":   (0, 3),
        "Medium":    (4, 6),
        "Low":       (7, 9),
        "Very Low":  (10, 12),
        "High":      (0, 0),
        "Very High": (0, 0),
    },
    "K": {
        "Optimum":   (0, 10),
        "Medium":    (11, 20),
        "Low":       (21, 30),
        "Very Low":  (31, 40),
        "High":      (0, 0),
        "Very High": (0, 0),
    },
    "S": {
        "Optimum":   (0, 2),
        "Medium":    (3, 4),
        "Low":       (5, 6),
        "Very Low":  (7, 8),
        "High":      (0, 0),
        "Very High": (0, 0),
    },
    "Zn": {
        "Optimum":   (0, 0),
        "Medium":    (0, 0.5),
        "Low":       (0.6, 1.0),
        "Very Low":  (1.1, 1.5),
        "High":      (0, 0),
        "Very High": (0, 0),
    },
    "B": {
        "Optimum":   (0, 0),
        "Medium":    (0, 0.5),
        "Low":       (0.6, 1.0),
        "Very Low":  (1.1, 1.5),
        "High":      (0, 0),
        "Very High": (0, 0),
    },
}

big_list_5_0 = {
    "N": {
        "Optimum":   (0, 30),
        "Medium":    (31, 60),
        "Low":       (61, 90),
        "Very Low":  (91, 120),
        "High":      (0, 0),
        "Very High": (0, 0),
    },
    "P": {
        "Optimum":   (0, 5),
        "Medium":    (6, 10),
        "Low":       (11, 15),
        "Very Low":  (16, 20),
        "High":      (0, 0),
        "Very High": (0, 0),
    },
    "K": {
        "Optimum":   (0, 25),
        "Medium":    (26, 50),
        "Low":       (51, 75),
        "Very Low":  (76, 100),
        "High":      (0, 0),
        "Very High": (0, 0),
    },
    "S": {
        "Optimum":   (0, 4),
        "Medium":    (5, 8),
        "Low":       (9, 12),
        "Very Low":  (13, 16),
        "High":      (0, 0),
        "Very High": (0, 0),
    },
    "Zn": {
        "Optimum":   (0, 0),
        "Medium":    (0, 0.8),
        "Low":       (0.9, 1.6),
        "Very Low":  (1.7, 2.4),
        "High":      (0, 0),
        "Very High": (0, 0),
    },
    "B": {
        "Optimum":   (0, 0),
        "Medium":    (0, 0.8),
        "Low":       (0.9, 1.6),
        "Very Low":  (1.7, 2.4),
        "High":      (0, 0),
        "Very High": (0, 0),
    },
}

big_list_4_0 = {
    "N": {
        "Optimum":   (0, 24),
        "Medium":    (25, 48),
        "Low":       (49, 72),
        "Very Low":  (73, 96),
        "High":      (0, 0),
        "Very High": (0, 0),
    },
    "P": {
        "Optimum":   (0, 4),
        "Medium":    (5, 8),
        "Low":       (9, 12),
        "Very Low":  (13, 16),
        "High":      (0, 0),
        "Very High": (0, 0),
    },
    "K": {
        "Optimum":   (0, 20),
        "Medium":    (21, 40),
        "Low":       (41, 60),
        "Very Low":  (61, 80),
        "High":      (0, 0),
        "Very High": (0, 0),
    },
    "S": {
        "Optimum":   (0, 3),
        "Medium":    (4, 6),
        "Low":       (7, 9),
        "Very Low":  (10, 12),
        "High":      (0, 0),
        "Very High": (0, 0),
    },
    "Zn": {
        "Optimum":   (0, 0),
        "Medium":    (0, 0.7),
        "Low":       (0.8, 1.4),
        "Very Low":  (1.5, 2.1),
        "High":      (0, 0),
        "Very High": (0, 0),
    },
    "B": {
        "Optimum":   (0, 0),
        "Medium":    (0, 0.7),
        "Low":       (0.8, 1.4),
        "Very Low":  (1.5, 2.1),
        "High":      (0, 0),
        "Very High": (0, 0),
    },
}

big_list_3_0 = {
    "N": {
        "Optimum":   (0, 18),
        "Medium":    (19, 36),
        "Low":       (37, 54),
        "Very Low":  (55, 72),
        "High":      (0, 0),
        "Very High": (0, 0),
    },
    "P": {
        "Optimum":   (0, 3),
        "Medium":    (4, 6),
        "Low":       (7, 9),
        "Very Low":  (10, 12),
        "High":      (0, 0),
        "Very High": (0, 0),
    },
    "K": {
        "Optimum":   (0, 15),
        "Medium":    (16, 30),
        "Low":       (31, 45),
        "Very Low":  (46, 60),
        "High":      (0, 0),
        "Very High": (0, 0),
    },
    "S": {
        "Optimum":   (0, 3),
        "Medium":    (4, 6),
        "Low":       (7, 9),
        "Very Low":  (10, 12),
        "High":      (0, 0),
        "Very High": (0, 0),
    },
    "Zn": {
        "Optimum":   (0, 0),
        "Medium":    (0, 0.6),
        "Low":       (0.7, 1.2),
        "Very Low":  (1.3, 1.8),
        "High":      (0, 0),
        "Very High": (0, 0),
    },
    "B": {
        "Optimum":   (0, 0),
        "Medium":    (0, 0.6),
        "Low":       (0.7, 1.2),
        "Very Low":  (1.3, 1.8),
        "High":      (0, 0),
        "Very High": (0, 0),
    },
}

VARIETY_OPTIONS = {
    "Aman Rice": aman_rice,
    "BR 11, BR 22, BR 23, BRRI dhan40, BRRI dhan41, BRRI dhan44, BRRI dhan46, BRRI dhan49,\n"
    "BRRI dhan51, BRRI dhan52, BRRI dhan53, BRRI dhan54, BRRI dhan56, BRRI dhan62,\n"
    "BRRI dhan66, BRRI dhan70, BRRI dhan71, BRRI dhan72, BRRI dhan73, BRRI dhan75\n"
    "BRRI dhan76, BRRI dhan78, BRRI dhan79, BRRI dhan80, BRRI hybrid dhan4, BRRI hybrid dhan6\n"
    "and Binadhan-4, Binadhan-7, Binadhan-11, Binadhan-12, Binadhan-15, Binadhan-16, Binadhan-17, Binadhan-20": big_list_5_0,
    "BR25, BRRI dhan33, BRRI dhan34, BRRI dhan37, BRRI dhan38,\nBRRI dhan39, BRRI dhan56, BRRI dhan57 and Binadhan-12, Binadhan-13": big_list_4_0,
    "BR5, Binadhan-9; LIV: Kataribhog, Kalijira, Chinigura etc": big_list_3_0,
}

# ------------------------------------
# 3. FERTILIZER CONVERSIONS
# ------------------------------------
FERTILIZER_CONVERSION = {
    "N":  {
        "product": "Urea",
        "ratio":  2.17,   # e.g., 1 kg N => ~2.17 kg Urea
    },
    "P":  {
        "product": "TSP",
        "ratio":  5.0,    # e.g., 1 kg P => ~5 kg TSP
    },
    "K":  {
        "product": "MoP",
        "ratio":  2.0,    # e.g., 1 kg K => 2 kg MOP
    },
    "S":  {
        "product": "Gypsum",
        "ratio":  5.55,   # e.g., 1 kg S => ~5.55 kg gypsum
    },
    "Zn": {
        "product": "Zinc sulphate (heptahydrate)",
        "ratio":  4.75,
    },
    "B": {
        "product": "Boric acid",
        "ratio":  5.88,   # e.g., 1 kg B => 5.88 kg boric acid
    },
}


def classify_soil_test(nutrient, value):
    """
    Determine the STVI class (Very Low, Low, Medium, etc.) for a given nutrient
    based on the user-supplied soil test 'value'.
    """
    if nutrient not in STVI_THRESHOLDS:
        return None

    thresholds = STVI_THRESHOLDS[nutrient]
    for stvi_class, (lo, hi) in thresholds.items():
        if lo <= value <= hi:
            return stvi_class
    return None

def calculate_F_r(Uf, Ci, Cs, St, Ls):
    """
    Fertilizer requirement formula:
      F_r = U_f - (C_i / C_s) * (S_t - L_s)
    """
    if Cs == 0:  # Avoid division by zero
        return Uf
    return Uf - (Ci / Cs) * (St - Ls)  # Corrected variable name to Ls

# ------------------------------------
# 5. MAIN CALCULATION LOGIC
# ------------------------------------
def fertilizer_calculator(
    soilN, soilP, soilK, soilS, soilZn, soilB,
    variety_choice
):
   
    rec_dict = VARIETY_OPTIONS[variety_choice]
    results = []

    def process_nutrient(nutrient_name, soil_value):
        if soil_value is None:
            return None  # user left it blank => skip

        stvi_class = classify_soil_test(nutrient_name, soil_value)
        if stvi_class is None:
            return f"{nutrient_name}: Soil test value {soil_value} out of range or no data."

        if nutrient_name not in rec_dict:
            return f"{nutrient_name}: No recommendation data for {variety_choice}."
        if stvi_class not in rec_dict[nutrient_name]:
            return f"{nutrient_name}: No recommended range for STVI class '{stvi_class}'."

        (range_lo, range_hi) = rec_dict[nutrient_name][stvi_class]
        # U_f = the upper limit of that recommended range
        Uf = range_hi
        Ci = range_hi - range_lo

        # The STVI boundaries for that class
        (class_lo, class_hi) = STVI_THRESHOLDS[nutrient_name][stvi_class]
        Ls = class_lo
        Cs = class_hi - class_lo
        St = soil_value

        # Calculate F_r
        Fr = calculate_F_r(Uf, Ci, Cs, St, Ls)
        Fr = max(0, Fr)  # Ensure no negative

        if nutrient_name in FERTILIZER_CONVERSION:
            fert_prod = FERTILIZER_CONVERSION[nutrient_name]["product"]
            ratio = FERTILIZER_CONVERSION[nutrient_name]["ratio"]
            fert_amount = Fr * ratio
            return (
                f"{nutrient_name} - STVI: {stvi_class} | "
                f"Recommended Nutrient = {Fr:.2f} kg/ha | "
                f"{fert_prod} needed ≈ {fert_amount:.2f} kg/ha"
            )
        else:
            return (
                f"{nutrient_name} - STVI: {stvi_class} | "
                f"Recommended Nutrient = {Fr:.2f} kg/ha | "
                f"No fertilizer product data."
            )

    # Process each nutrient in turn
    for nname, sval in [
        ("N",  soilN),
        ("P",  soilP),
        ("K",  soilK),
        ("S",  soilS),
        ("Zn", soilZn),
        ("B",  soilB),
    ]:
        ans = process_nutrient(nname, sval)
        if ans:
            results.append(ans)

    if not results:
        return "No valid nutrient inputs given."
    return "\n".join(results)

# ------------------------------------
# GRADIO UI
# ------------------------------------
import gradio as gr
import traceback


def on_calculate(soilN, soilP, soilK, soilS, soilZn, soilB, variety_choice):
    try:
        # Attempt the fertilizer calculation
        return fertilizer_calculator(soilN, soilP, soilK, soilS, soilZn, soilB, variety_choice)
    except Exception as e:
        # Catch any errors and return the stack trace to the UI
        error_message = f"An error occurred:\n{traceback.format_exc()}"
        print(error_message)  # Print to the console for debugging
        return error_message  # Return to the Gradio output

# Integrate with the Gradio app
with gr.Blocks(title="Fertilizer Calculator 🌾🚜") as demo:
    gr.Markdown(
        """
        # Fertilizer Calculator 🌾🚜  
        Enter your soil test values below (leave blank if unknown).  
        Then select your rice variety to see recommended fertilizer requirements!
        """
    )

    with gr.Row():
        soilN = gr.Number(label="Nitrogen (%)", value=None, precision=4)
        soilP = gr.Number(label="Phosphorus (µg/g, Olsen)", value=None, precision=4)
        soilK = gr.Number(label="Potassium (meq/100g)", value=None, precision=4)
        soilS = gr.Number(label="Sulfur (µg/g)", value=None, precision=4)
        soilZn = gr.Number(label="Zinc (µg/g)", value=None, precision=4)
        soilB = gr.Number(label="Boron (µg/g)", value=None, precision=4)

    variety = gr.Dropdown(
        label="Select Rice Variety",
        choices=list(VARIETY_OPTIONS.keys()),
        value="Aman Rice"  # default
    )

    calc_button = gr.Button("Calculate Fertilizer Requirements ✅")
    output_text = gr.Textbox(
        label="Results",
        lines=12,
        placeholder="Your fertilizer recommendation will appear here..."
    )

    calc_button.click(
        fn=on_calculate,
        inputs=[soilN, soilP, soilK, soilS, soilZn, soilB, variety],
        outputs=output_text
    )

demo.launch()

