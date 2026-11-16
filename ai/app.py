import spaces
import joblib
import pandas as pd
import gradio as gr
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

pipeline = joblib.load("crewcare_best_model.joblib")
features = ['heart_rate', 'sleep_hours', 'spo2', 'radiation_level', 'cabin_co2', 'comm_delay']

status_labels = {0: "Normal", 1: "Warning", 2: "Critical"}
status_colors = {0: "green", 1: "yellow", 2: "red"}

def get_dynamic_protocol(code: int, row: dict) -> list:
    actions = []
    spo2 = row['spo2']
    co2 = row['cabin_co2']
    hr = row['heart_rate']
    rad = row['radiation_level']
    slp = row['sleep_hours']
    delay = row['comm_delay']

    if spo2 < 90:
        actions.append(f"Administer 100% supplemental oxygen via emergency mask immediately (SpO2: {spo2}%).")
    elif spo2 < 94:
        actions.append(f"Check pulse oximeter placement and verify cabin O2 generation loop (SpO2: {spo2}%).")

    if co2 >= 1.0:
        actions.append(f"Switch ECLSS CO2 scrubbers to high-rate mode and activate local airflow fans (CO2: {co2}%).")
    elif co2 >= 0.5:
        actions.append(f"Increase module air circulation and inspect CDRA scrubber beds (CO2: {co2}%).")

    if hr >= 115:
        actions.append(f"Cease physical exertion immediately, rest upright, and record 12-lead ECG (HR: {hr} bpm).")
    elif hr >= 95:
        actions.append(f"Pause strenuous tasks for 15 minutes and hydrate with 500 ml electrolytes (HR: {hr} bpm).")
    elif hr <= 45:
        actions.append(f"Evaluate consciousness and blood pressure immediately; prepare cardiac monitoring (HR: {hr} bpm).")

    if rad >= 2.0:
        actions.append(f"Abort EVA operations immediately and enter the shielded storm shelter (Radiation: {rad} mSv/d).")
    elif rad >= 0.8:
        actions.append(f"Defer non-essential EVA tasks and maximize time in shielded quarters (Radiation: {rad} mSv/d).")

    if slp < 5.5:
        actions.append(f"Enforce a protected 8-hour recovery sleep block and adjust circadian lighting (Sleep: {slp}h).")

    if code >= 1 and delay >= 4.0:
        actions.append(f"Earth comm delay is {delay} min — execute autonomous onboard protocol and queue telemetry packet.")

    if not actions:
        if code == 2:
            return ["Critical compound hazard detected. Initiate immediate onboard medical stabilization."]
        elif code == 1:
            return ["Telemetry outside nominal range. Apply corrective action and re-evaluate."]
        return ["All telemetry nominal. Continue scheduled flight tasks."]

    return actions

@spaces.GPU
def run_inference(heart_rate, sleep_hours, spo2, radiation_level, cabin_co2, comm_delay):
    row = {
        'heart_rate': float(heart_rate),
        'sleep_hours': float(sleep_hours),
        'spo2': float(spo2),
        'radiation_level': float(radiation_level),
        'cabin_co2': float(cabin_co2),
        'comm_delay': float(comm_delay),
    }
    df_row = pd.DataFrame([row])[features]
    pred = int(pipeline.predict(df_row)[0])
    return {
        "status_code": pred,
        "status_label": status_labels[pred],
        "indicator_color": status_colors[pred],
        "comm_delay": row['comm_delay'],
        "actions": get_dynamic_protocol(pred, row)
    }

demo = gr.Interface(
    fn=run_inference,
    inputs=[
        gr.Number(value=72, label="Heart Rate (bpm)"),
        gr.Number(value=7.4, label="Sleep Hours"),
        gr.Number(value=98, label="SpO2 (%)"),
        gr.Number(value=0.35, label="Radiation Level (mSv/day)"),
        gr.Number(value=0.04, label="Cabin CO2 (%)"),
        gr.Number(value=0.1, label="Earth Comm Delay (min)"),
    ],
    outputs=gr.JSON(label="CrewCare AI Risk Assessment"),
    title="CrewCare Autonomous Medical AI Engine",
    description="RandomForest telemetry risk classifier trained on NASA OSDR & OCHMO standards.",
    api_name="predict"
)

if __name__ == "__main__":
    demo.launch()