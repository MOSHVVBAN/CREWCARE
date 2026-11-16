import joblib
import pandas as pd
from starlette.applications import Starlette
from starlette.responses import JSONResponse
from starlette.routing import Route

pipeline = joblib.load("crewcare_best_model.joblib")
features = ['heart_rate', 'sleep_hours', 'spo2', 'radiation_level', 'cabin_co2', 'comm_delay']
status_labels = {0: "Normal", 1: "Warning", 2: "Critical"}
status_colors = {0: "green", 1: "yellow", 2: "red"}

def get_protocol(code: int) -> list:
    if code == 2:
        return [
            "Abort EVA missions immediately and enter the shielded storm shelter.",
            "Enforce mandatory rest protocol and suspend non-critical operations.",
            "Administer radioprotectants and sleep-aid medication from the medical kit."
        ]
    elif code == 1:
        return [
            "Increase cabin ventilation to clear CO2 pockets and inspect scrubbers.",
            "Consume 500 ml electrolyte hydration and wear compression garments.",
            "Schedule a mandatory 30-minute rest break and pause strenuous tasks."
        ]
    return [
        "All telemetry nominal. Continue scheduled flight tasks."
    ]

async def predict(request):
    data = await request.json()
    row = {
        'heart_rate': float(data.get('heart_rate', 72)),
        'sleep_hours': float(data.get('sleep_hours', 7.4)),
        'spo2': float(data.get('spo2', 98)),
        'radiation_level': float(data.get('radiation_level', 0.35)),
        'cabin_co2': float(data.get('cabin_co2', 0.04)),
        'comm_delay': float(data.get('comm_delay', 1.3)),
    }
    df_row = pd.DataFrame([row])[features]
    pred = int(pipeline.predict(df_row)[0])

    return JSONResponse({
        "status_code": pred,
        "status_label": status_labels[pred],
        "indicator_color": status_colors[pred],
        "comm_delay": row['comm_delay'],
        "actions": get_protocol(pred)
    })

app = Starlette(routes=[Route("/predict", predict, methods=["POST"])])