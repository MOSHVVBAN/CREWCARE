# CrewCare 🚀

A health monitoring and medical support web app built for astronauts during space missions where communication delays with Earth can reach over 20 minutes.

Developed by Team **CrewCare** for the **2026 NASA Space Apps Challenge**

---

## Overview

During long space missions (ISS, Moon, or Mars), astronauts cannot always wait for immediate feedback from doctors on Earth when a health issue happens. **CrewCare** helps crew members track their daily vitals, spot early changes compared to their personal baseline, and get clear step-by-step actions—even when offline.

---

## Features

- **Daily Health Check:** Tracks 6 daily metrics (Heart Rate, SpO2, Sleep Hours, Radiation Level, Cabin CO2, and Communication Delay) across a 9-page dashboard.
- **Personal Health Baseline:** Compares current readings against each astronaut's past readings to detect unusual changes early.
- **AI Medical Assistant & Offline Fallback:** Uses a **Random Forest** model served via **FastAPI** to classify health status (`Normal`, `Warning`, `Critical`) and suggest 3 immediate steps, with a local **Rule-Based Engine** that takes over automatically if the AI service is unavailable.
- **Mission-Aware Thresholds:** Adjusts safety limits and alerts based on the mission environment (Space Station, Moon, or Mars).
- **Wellness, Body Map & Reports:** Includes sleep and mood tracking, an interactive body map showing normal organ metrics, automated alerts, and exportable medical summaries for doctors.

---

## Tech Stack

- **Backend & Database:** PHP, MySQL
- **Frontend:** HTML, CSS, JavaScript, Chart.js
- **AI & API:** Python, FastAPI, Scikit-learn (Random Forest), Pandas, Joblib

---

## Demo

- **Project demo:** [Watch on Google Drive](https://drive.google.com/file/d/1jr5X7AH6sVEFS1RCQoJN2aR9nUi_HeLv/view?usp=drivesdk)

---

## Team

- **Mohamed Shaaban** — Team Lead & Machine learning
- **Maryam saad** - Research
-  **Shimaa Mostafa** - Frontend
- **Habiba Rashwan** - Backend
- **Shahd Konswa** - Frontend
- **Asmaa Moawad** - Ui
