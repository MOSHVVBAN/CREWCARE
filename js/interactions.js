// ================================
// MODAL MEASUREMENT GUIDANCE (HOW & WHY)
// ================================
const measurementGuidanceMap = {
    "Heart Rate": {
        how: "Rest quietly for 3 minutes, place the pulse oximeter on a warm fingertip at chest level for 15 seconds.",
        why: "Tracks cardiovascular workload and fluid-shift adaptation in microgravity (normal: 60–90 bpm)."
    },
    "SpO2": {
        how: "Keep your hand still and warm while clipped to the pulse oximeter until the percentage stabilizes.",
        why: "Measures blood oxygen saturation in closed-loop cabin air; below 94% signals hypoxia or scrubber fault."
    },
    "Blood Pressure": {
        how: "Sit upright with your arm supported at heart level and wrap the cuff snugly above the elbow.",
        why: "Detects orthostatic intolerance and cephalad fluid shifts caused by altered gravity fields."
    },
    "Temperature": {
        how: "Take a tympanic (ear) or forehead reading before consuming hot/cold drinks or exercising.",
        why: "Identifies early infection, immune reactivation, or cabin thermal regulation issues (normal: 36.4–37.4 °C)."
    },
    "Radiation": {
        how: "Read the daily cumulative dose (mSv/day) from your personal wearable dosimeter or habitat monitor.",
        why: "Tracks ionizing & neutron exposure beyond Earth's magnetosphere to trigger storm-shelter protocols."
    },
    "Cabin CO2": {
        how: "Check the local Environmental Control & Life Support (ECLSS) scrubber sensor near your workstation.",
        why: "Microgravity prevents natural air convection, creating CO2 pockets that cause headaches and cognitive decline above 0.5%."
    }
};

function updateModalGuidance() {
    const typeSelect = document.getElementById("measurementType");
    const howEl = document.getElementById("modalHowText");
    const whyEl = document.getElementById("modalWhyText");
    if (!typeSelect || !howEl || !whyEl) return;

    const info = measurementGuidanceMap[typeSelect.value] || measurementGuidanceMap["Heart Rate"];
    howEl.textContent = info.how;
    whyEl.textContent = info.why;
}

document.getElementById("measurementType")?.addEventListener("change", updateModalGuidance);
document.addEventListener("DOMContentLoaded", updateModalGuidance);

// ================================
// FORM SUBMISSIONS & ACTIONS
// ================================
document.getElementById('measurementForm')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const type = document.getElementById('measurementType')?.value || '';
    const rawValue = document.getElementById('measurementValue')?.value?.trim() || '';
    const message = document.getElementById('modalMessage');
    const units = {
        'Heart Rate': 'bpm',
        'SpO2': '%',
        'Blood Pressure': 'mmHg',
        'Temperature': '°C',
        'Radiation': 'mSv/d',
        'Cabin CO2': '%'
    };

    if (!rawValue || !/^\d+(\.\d+)?$/.test(rawValue)) {
        if (message) message.textContent = 'Please enter a valid number.';
        return;
    }

    try {
        const result = await SpaceCareAPI.saveMeasurement({
            type,
            value: rawValue,
            unit: units[type] || '',
            notes: 'Manual quick entry'
        });
        if (message) message.textContent = 'Measurement saved to database.';
        document.getElementById('measurementValue').value = '';
        if (result.risk) applyRiskToUI(result.risk);
        await Promise.allSettled([loadMeasurementsAndCards(), loadAlertsData()]);
    } catch (error) {
        if (message) message.textContent = error.message;
    }
});

// Multi-Step Wizard
let currentStep = 1;
function goToStep(step) {
    currentStep = step;
    const pane1 = document.getElementById('stepPane1');
    const pane2 = document.getElementById('stepPane2');
    const pane3 = document.getElementById('stepPane3');

    if (pane1) pane1.style.display = (step === 1) ? 'block' : 'none';
    if (pane2) pane2.style.display = (step === 2) ? 'block' : 'none';
    if (pane3) pane3.style.display = (step === 3) ? 'block' : 'none';

    const heading = document.getElementById('dailyCheckHeading');
    const desc = document.getElementById('dailyCheckDesc');
    if (heading && desc) {
        if (step === 1) {
            heading.textContent = "Record basic measurements";
            desc.textContent = "Your entries stay in this demo until you review and save them.";
        } else if (step === 2) {
            heading.textContent = "Sleep & mental wellness";
            desc.textContent = "Log your resting hours and current daily state.";
        } else if (step === 3) {
            heading.textContent = "Final review";
            desc.textContent = "Verify your completed daily health check entries.";
        }
    }

    const ind1 = document.getElementById('indicatorStep1');
    const ind2 = document.getElementById('indicatorStep2');
    const ind3 = document.getElementById('indicatorStep3');
    if (ind1) ind1.className = `step-item ${step === 1 ? 'active' : (step > 1 ? 'completed' : '')}`;
    if (ind2) ind2.className = `step-item ${step === 2 ? 'active' : (step > 2 ? 'completed' : '')}`;
    if (ind3) ind3.className = `step-item ${step === 3 ? 'active' : ''}`;

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.getElementById('nextToStep2Btn')?.addEventListener('click', async () => {
    const pane1 = document.getElementById('stepPane1');
    const envCfg = getActiveEnvironmentConfig();
    const value = (field) => pane1.querySelector(`[data-daily-field="${field}"]`);
    const get = (field) => value(field)?.value?.trim() || null;

    // Clear previous error states
    pane1.querySelectorAll('.input-group').forEach(g => g.classList.remove('has-error'));

    const glucoseSkipped = !!value('glucose_not_measured')?.checked;
    const requiredFields = [
        'heart_rate',
        'spo2',
        'temperature',
        'sleep_hours',
        'radiation_level',
        'cabin_co2',
        'comm_delay',
        'systolic',
        'diastolic'
    ];
    if (!glucoseSkipped) {
        requiredFields.push('glucose');
    }

    let missingCount = 0;

    requiredFields.forEach(field => {
        const inputEl = value(field);
        const raw = inputEl?.value?.trim() || '';
        if (raw === '' || isNaN(Number(raw))) {
            missingCount++;
            const group = inputEl?.closest('.input-group');
            if (group) {
                group.classList.add('has-error');
                let errSpan = group.querySelector('.error-text');
                if (!errSpan) {
                    errSpan = document.createElement('span');
                    errSpan.className = 'error-text';
                    group.appendChild(errSpan);
                }
                errSpan.textContent = 'Required before running risk evaluation.';
            }
        }
    });

    if (missingCount > 0) {
        const firstInvalid = pane1.querySelector('.input-group.has-error input');
        firstInvalid?.focus();
        return;
    }

    const payload = {
        heart_rate: get('heart_rate'),
        spo2: get('spo2'),
        temperature: get('temperature'),
        sleep_hours: get('sleep_hours'),
        radiation_level: get('radiation_level'),
        cabin_co2: get('cabin_co2'),
        comm_delay: get('comm_delay') || String(envCfg.defaultDelay),
        systolic: get('systolic'),
        diastolic: get('diastolic'),
        glucose: glucoseSkipped ? null : get('glucose'),
        glucose_not_measured: glucoseSkipped,
        notes: get('notes')
    };

    try {
        const result = await SpaceCareAPI.saveDailyCheck(payload);
        if (result.risk) {
            applyRiskToUI(result.risk, {
                spo2: payload.spo2 ?? 98,
                radiation_level: payload.radiation_level ?? 0.35,
                cabin_co2: payload.cabin_co2 ?? 0.04,
                comm_delay: payload.comm_delay ?? envCfg.defaultDelay
            });
        }
        if (payload.sleep_hours && document.getElementById('wellnessSleepInput')) {
            document.getElementById('wellnessSleepInput').value = payload.sleep_hours;
        }
        await Promise.allSettled([loadDailyChecksData(), loadMeasurementsAndCards(), loadAlertsData()]);
        goToStep(2);
    } catch (error) {
        alert('Error saving daily check: ' + error.message);
    }
});

document.getElementById('nextToStep3Btn')?.addEventListener('click', async () => {
    const sleep = document.getElementById('wellnessSleepInput')?.value?.trim() || '7';
    const quality = document.getElementById('wellnessQualityInput')?.value || 'Good';
    const mood = document.getElementById('wellnessMoodInput')?.value || 'Steady';
    const stress = document.getElementById('wellnessStressInput')?.value || '2';
    const notes = document.getElementById('wellnessNotesInput')?.value?.trim() || '';

    try {
        const result = await SpaceCareAPI.saveWellness({
            sleep_hours: sleep,
            sleep_quality: quality,
            mood: mood,
            stress_level: stress,
            notes: notes
        });
        if (result.risk) applyRiskToUI(result.risk);
        await Promise.allSettled([loadWellnessData(), loadAlertsData()]);
        goToStep(3);
    } catch (error) {
        alert('Error saving wellness log: ' + error.message);
    }
});

document.getElementById('finishCheckBtn')?.addEventListener('click', async () => {
    await syncAllDashboardData();
    showPage('overview');
    currentStep = 1;
    goToStep(1);
});

document.getElementById('saveProgressBtn')?.addEventListener('click', () => {
    if (currentStep === 1) {
        document.getElementById('nextToStep2Btn')?.click();
    } else if (currentStep === 2) {
        document.getElementById('nextToStep3Btn')?.click();
    } else {
        alert('All steps are ready for final submission.');
    }
});

document.querySelector('.add-checkin-btn')?.addEventListener('click', async () => {
    const sleep = prompt('How many hours did you sleep? (0 - 24)');
    if (sleep === null) return;
    const mood = prompt('Current mood (Steady, Calm, Optimistic, Low):', 'Steady') || 'Steady';
    const stress = prompt('Stress level from 1 to 10:', '2') || '2';
    try {
        const res = await SpaceCareAPI.saveWellness({ sleep_hours: sleep, mood, stress_level: stress });
        if (res.risk) applyRiskToUI(res.risk);
        alert('Sleep and mood data saved successfully.');
        await Promise.allSettled([loadWellnessData(), loadAlertsData()]);
    } catch (error) {
        alert(error.message);
    }
});

document.querySelector('.add-reminder-btn')?.addEventListener('click', async () => {
    const title = prompt('Enter the name of the new task or reminder:');
    if (!title) return;
    const due_at = prompt('Time (e.g., 16:00) - Optional:') || null;
    try {
        await SpaceCareAPI.addTask({ title, due_at });
        alert('Reminder added successfully.');
        await loadTasksData();
    } catch (error) {
        alert(error.message);
    }
});

document.addEventListener('change', async (e) => {
    const cb = e.target.closest('.routine-list input[data-task-id]');
    if (!cb) return;
    try {
        await SpaceCareAPI.updateTask({ id: cb.dataset.taskId, is_done: cb.checked });
        await loadTasksData();
    } catch (error) {
        alert(error.message);
    }
});

// ================================
// PREPARE MEDICAL TELEMETRY SUMMARY
// ================================
document.querySelector('.prepare-summary-btn')?.addEventListener('click', async () => {
    const summaryCard = document.querySelector('.medical-summary-card');
    const checkboxes = summaryCard ? Array.from(summaryCard.querySelectorAll('.summary-checkboxes input[type="checkbox"]')) : [];

    const includeMeasurements = checkboxes[0] ? checkboxes[0].checked : true;
    const includeSymptoms = checkboxes[1] ? checkboxes[1].checked : true;
    const includeOpenAlerts = checkboxes[2] ? checkboxes[2].checked : true;
    const includeNotes = checkboxes[3] ? checkboxes[3].checked : false;

    const envCfg = getActiveEnvironmentConfig();
    const crewName = document.querySelector('.profile-text-details h3')?.textContent?.trim() || 'Crew Member';
    const missionDay = document.querySelector('.crew-card p')?.textContent?.trim() || 'Mission Day 001';
    const latestCheck = cachedDailyChecks[0] || null;
    const latestWellness = cachedWellness[0] || null;
    const commDelay = latestCheck?.comm_delay ?? envCfg.defaultDelay;
    const riskStatus = latestCheck?.risk_status || document.getElementById('overviewRiskBadge')?.textContent?.trim() || 'PENDING';

    const lines = [
        `=== CREWCARE DOWNLINK TELEMETRY PACKET ===`,
        `Crew Member: ${crewName} (${missionDay})`,
        `Mission Environment: ${envCfg.label}`,
        `Generated At: ${new Date().toLocaleString()}`,
        `Earth Comm Delay: ${commDelay} min (Store-and-Forward Ready)`,
        `Overall Risk Status: ${riskStatus}`,
        ``
    ];

    if (includeMeasurements) {
        lines.push(`[LATEST MEASUREMENTS]`);
        if (latestCheck) {
            lines.push(`- Heart Rate: ${latestCheck.heart_rate ?? '--'} bpm`);
            lines.push(`- Oxygen (SpO2): ${latestCheck.spo2 ?? '--'} %`);
            lines.push(`- Body Temp: ${latestCheck.temperature ?? '--'} °C`);
            lines.push(`- Blood Pressure: ${latestCheck.systolic ?? '--'}/${latestCheck.diastolic ?? '--'} mmHg`);
            lines.push(`- Radiation Level: ${latestCheck.radiation_level ?? '--'} mSv/day`);
            lines.push(`- Cabin CO2: ${latestCheck.cabin_co2 ?? '--'} %`);
        } else {
            lines.push(`- No daily health check measurements recorded yet.`);
        }
        if (latestWellness) {
            lines.push(`- Sleep Duration: ${latestWellness.sleep_hours ?? '--'} hours (${latestWellness.sleep_quality || 'N/A'})`);
        }
        lines.push(``);
    }

    if (includeSymptoms) {
        lines.push(`[WELLNESS & BEHAVIORAL STATE]`);
        if (latestWellness) {
            lines.push(`- Mood: ${latestWellness.mood || 'Steady'} | Stress Level: ${latestWellness.stress_level ?? '--'}/10`);
        } else {
            lines.push(`- No wellness symptoms reported.`);
        }
        lines.push(``);
    }

    if (includeOpenAlerts) {
        const openAlerts = cachedAlerts.filter(a => !Number(a.is_reviewed));
        lines.push(`[OPEN ALERTS (${openAlerts.length})]`);
        if (openAlerts.length === 0) {
            lines.push(`- No open alerts pending review.`);
        } else {
            openAlerts.forEach((a, idx) => {
                lines.push(`${idx + 1}. [${(a.severity || 'info').toUpperCase()}] ${a.title}`);
                if (a.description) lines.push(`   Details: ${a.description}`);
                if (a.protocol) lines.push(`   Protocol: ${a.protocol}`);
            });
        }
        lines.push(``);
    }

    if (includeNotes) {
        lines.push(`[ASSESSMENT NOTES]`);
        lines.push(`- Check Notes: ${latestCheck?.notes || 'None'}`);
        lines.push(`- Wellness Notes: ${latestWellness?.notes || 'None'}`);
        lines.push(``);
    }

    const packetText = lines.join('\n');

    if (navigator.clipboard && window.isSecureContext) {
        try {
            await navigator.clipboard.writeText(packetText);
        } catch (_) {}
    }

    let overlay = document.getElementById('telemetrySummaryOverlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'telemetrySummaryOverlay';
        overlay.className = 'modal-overlay active';
        overlay.innerHTML = `
            <div class="modal" style="max-width: 560px;">
                <button class="modal-close" id="closeSummaryModalBtn" type="button">
                    <i class="fa-solid fa-xmark"></i>
                </button>
                <div class="modal-icon">
                    <i class="fa-solid fa-satellite-dish"></i>
                </div>
                <h2>Medical Telemetry Packet</h2>
                <p>Compiled for asynchronous Earth downlink (Comm Delay: <strong id="packetDelayLabel"></strong>).</p>
                <div class="form-group">
                    <textarea id="telemetryPacketBox" readonly style="width:100%; min-height:220px; padding:12px; background:var(--bg-main); color:var(--text-primary); border:1px solid var(--border-color); border-radius:var(--radius-md); font-family:monospace; font-size:11px; line-height:1.5; resize:vertical;"></textarea>
                </div>
                <div style="display:flex; gap:10px;">
                    <button type="button" class="primary-button submit-button" id="copyPacketBtn">
                        <i class="fa-regular fa-copy"></i> Copy Packet
                    </button>
                </div>
                <div class="modal-message" id="packetCopyStatus"></div>
            </div>
        `;
        document.body.appendChild(overlay);

        overlay.addEventListener('click', (ev) => {
            if (ev.target === overlay) overlay.classList.remove('active');
        });
        document.getElementById('closeSummaryModalBtn')?.addEventListener('click', () => {
            overlay.classList.remove('active');
        });
        document.getElementById('copyPacketBtn')?.addEventListener('click', async () => {
            const box = document.getElementById('telemetryPacketBox');
            const statusEl = document.getElementById('packetCopyStatus');
            if (box) {
                box.select();
                try {
                    await navigator.clipboard.writeText(box.value);
                    if (statusEl) statusEl.textContent = 'Telemetry packet copied to clipboard.';
                } catch (_) {
                    document.execCommand('copy');
                    if (statusEl) statusEl.textContent = 'Telemetry packet copied.';
                }
            }
        });
    } else {
        overlay.classList.add('active');
    }

    const box = document.getElementById('telemetryPacketBox');
    const delayLabel = document.getElementById('packetDelayLabel');
    const statusEl = document.getElementById('packetCopyStatus');
    if (box) box.value = packetText;
    if (delayLabel) delayLabel.textContent = `${commDelay} min`;
    if (statusEl) statusEl.textContent = 'Packet compiled and ready for Earth transmission.';
});

// ================================
// SETTINGS & ACCESSIBILITY CONTROLS
// ================================
function applyAccessibilityPreferences(prefs) {
    document.body.style.zoom = prefs.larger_text ? '1.08' : '1';

    let motionStyle = document.getElementById('crewcareReduceMotionStyle');
    if (prefs.reduce_motion) {
        if (!motionStyle) {
            motionStyle = document.createElement('style');
            motionStyle.id = 'crewcareReduceMotionStyle';
            motionStyle.textContent = `*, *::before, *::after { transition: none !important; animation: none !important; scroll-behavior: auto !important; }`;
            document.head.appendChild(motionStyle);
        }
    } else if (motionStyle) {
        motionStyle.remove();
    }

    const notifBadge = document.querySelector('.notification-count');
    if (notifBadge) {
        notifBadge.style.visibility = prefs.review_alerts === false ? 'hidden' : 'visible';
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const settingsSection = document.getElementById('settings');
    if (!settingsSection) return;

    const unitSelect = settingsSection.querySelector('.standard-select');
    const toggles = Array.from(settingsSection.querySelectorAll('.switch-toggle input[type="checkbox"]'));

    try {
        const res = await SpaceCareAPI.getSettings();
        const saved = res.settings || {};
        if (unitSelect && saved.unit_system) unitSelect.value = saved.unit_system;
        if (toggles[0] && typeof saved.larger_text === 'boolean') toggles[0].checked = saved.larger_text;
        if (toggles[1] && typeof saved.reduce_motion === 'boolean') toggles[1].checked = saved.reduce_motion;
        if (toggles[2] && typeof saved.routine_reminders === 'boolean') toggles[2].checked = saved.routine_reminders;
        if (toggles[3] && typeof saved.review_alerts === 'boolean') toggles[3].checked = saved.review_alerts;

        applyAccessibilityPreferences({
            larger_text: !!toggles[0]?.checked,
            reduce_motion: !!toggles[1]?.checked,
            routine_reminders: toggles[2] ? toggles[2].checked : true,
            review_alerts: toggles[3] ? toggles[3].checked : true
        });
    } catch (_) {}

    async function persistAllSettings(notify = false) {
        const payload = {
            unit_system: unitSelect ? unitSelect.value : 'Mission standard',
            larger_text: !!toggles[0]?.checked,
            reduce_motion: !!toggles[1]?.checked,
            routine_reminders: toggles[2] ? toggles[2].checked : true,
            review_alerts: toggles[3] ? toggles[3].checked : true
        };
        applyAccessibilityPreferences(payload);
        try {
            await SpaceCareAPI.saveSettings(payload);
            if (notify) alert('Unit system preference saved.');
        } catch (error) {
            alert(error.message);
        }
    }

    unitSelect?.addEventListener('change', () => persistAllSettings(true));
    toggles.forEach(toggle => {
        toggle.addEventListener('change', () => persistAllSettings(false));
    });
});

// ================================
// LOGOUT HANDLER
// ================================
document.getElementById('logoutBtn')?.addEventListener('click', async () => {
    try {
        await SpaceCareAPI.logout();
        location.href = 'login.php';
    } catch (error) {
        alert('Logout error: ' + error.message);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    initCharts();
    syncAllDashboardData();
    updateLiveClockUI();
    setInterval(updateLiveClockUI, 30000);
});

// ================================
// HUMAN BODY MAP INTERACTIVE LOGIC
// ================================
document.addEventListener("DOMContentLoaded", () => {
    const systemData = {
        brain: {
            title: "Brain & behavioral health",
            icon: "fa-solid fa-brain",
            top: "11%",
            left: "50%",
            function: "Controls cognitive functions, neuro-ocular pressure, mood, and circadian coordination.",
            factor: "Isolation, confinement, and cephalad fluid shifts (SANS) influence neurological and mental wellbeing.",
            effects: "Crew may experience shifts in sleep quality, mood stability, stress levels, or visual acuity.",
            indicators: ["Sleep duration", "Self-reported mood", "Stress level"]
        },
        cardiovascular: {
            title: "Cardiovascular",
            icon: "fa-solid fa-heart-pulse",
            top: "32%",
            left: "54%",
            function: "Moves oxygenated blood and nutrients through the body and regulates orthostatic blood pressure.",
            factor: "Altered gravity shifts blood volume toward the upper body and modifies cardiac workload.",
            effects: "Crew may notice changes in resting heart rate, exercise tolerance, or postural blood pressure.",
            indicators: ["Heart rate", "Blood pressure", "Oxygen saturation (SpO2)"]
        },
        immune: {
            title: "Immune system",
            icon: "fa-solid fa-shield-virus",
            top: "36%",
            left: "45%",
            function: "Defends the body against pathogens, latent viral reactivation, and cellular radiation stress.",
            factor: "Galactic cosmic radiation, neutron exposure, and stress hormones alter immune cell signaling.",
            effects: "Crew may experience heightened sensitivity, slower recovery, or mild inflammatory responses.",
            indicators: ["Body temperature", "Radiation exposure (mSv/day)", "Sleep recovery"]
        },
        musculoskeletal: {
            title: "Musculoskeletal",
            icon: "fa-solid fa-person-running",
            top: "66%",
            left: "41%",
            function: "Provides structural support, posture stability, and mechanical locomotion for the body.",
            factor: "Reduced mechanical loading in microgravity accelerates bone mineral loss and muscle atrophy.",
            effects: "Crew performs daily resistive exercise countermeasures to preserve strength and bone integrity.",
            indicators: ["Resistive exercise load", "Bone density metrics", "Joint mobility"]
        },
        nutrition: {
            title: "Nutrition & whole body",
            icon: "fa-solid fa-droplet",
            top: "47%",
            left: "50%",
            function: "Sustains metabolic energy, electrolyte hydration balance, and cellular nutrient absorption.",
            factor: "Fluid shifts, altered taste perception, and closed-loop cabin air/water affect metabolism.",
            effects: "Inadequate hydration or caloric intake compounds orthostatic intolerance and crew fatigue.",
            indicators: ["Blood glucose", "Electrolyte hydration", "Cabin CO2 & SpO2"]
        }
    };

    const allSystemButtons = document.querySelectorAll(".systems-list-column .system-item-btn, .secondary-systems-column .system-sub-btn");
    const systemCard = document.querySelector(".selected-system-card");
    const organIndicator = document.getElementById("organIndicator");
    const selectedLabel = document.getElementById("selectedSystemLabel");

    if (allSystemButtons.length > 0 && systemCard) {
        allSystemButtons.forEach((btn) => {
            btn.addEventListener("click", () => {
                allSystemButtons.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");

                const selectedKey = btn.dataset.system || "cardiovascular";
                const data = systemData[selectedKey] || systemData.cardiovascular;

                if (organIndicator) {
                    organIndicator.style.top = data.top;
                    organIndicator.style.left = data.left;
                    organIndicator.innerHTML = `<i class="${data.icon}"></i>`;
                }
                if (selectedLabel) {
                    selectedLabel.textContent = `Selected: ${data.title}`;
                }

                systemCard.innerHTML = `
                    <div class="system-card-icon">
                        <i class="${data.icon}"></i>
                    </div>
                    <span class="selected-system-eyebrow">SELECTED SYSTEM</span>
                    <h3>${data.title}</h3>
                    <div class="info-block">
                        <h4>Primary function</h4>
                        <p>${data.function}</p>
                    </div>
                    <div class="info-block">
                        <h4>Relevant spaceflight factor</h4>
                        <p>${data.factor}</p>
                    </div>
                    <div class="info-block">
                        <h4>Possible effects</h4>
                        <p>${data.effects}</p>
                    </div>
                    <div class="indicators-section">
                        <h4>Useful monitoring indicators</h4>
                        ${data.indicators.map(ind => `
                            <div class="indicator-link-row">
                                <span>${ind}</span>
                                <i class="fa-solid fa-chevron-right"></i>
                            </div>
                        `).join('')}
                    </div>
                    <button class="open-guide-btn" onclick="showPage('guide')">
                        <i class="fa-solid fa-book-open"></i> Open related health guide
                    </button>
                `;
            });
        });
    }
});

// ================================
// BODY MAP MONITORING INDICATORS NAVIGATION
// ================================
document.addEventListener("click", (e) => {
    const row = e.target.closest(".selected-system-card .indicator-link-row");
    if (!row) return;

    const label = row.querySelector("span")?.textContent?.trim().toLowerCase() || "";

    if (label.includes("sleep")) {
        showPage("wellness");
        document.querySelectorAll("#wellness .trend-tab").forEach(t => {
            if (t.textContent.trim() === "Sleep") t.click();
        });
    } else if (label.includes("mood")) {
        showPage("wellness");
        document.querySelectorAll("#wellness .trend-tab").forEach(t => {
            if (t.textContent.trim() === "Mood") t.click();
        });
    } else if (label.includes("stress")) {
        showPage("wellness");
        document.querySelectorAll("#wellness .trend-tab").forEach(t => {
            if (t.textContent.trim() === "Stress") t.click();
        });
    } else if (label.includes("heart rate")) {
        showPage("analytics");
        document.querySelectorAll("#analytics .analytics-tab").forEach(t => {
            if (t.textContent.trim() === "Heart Rate") t.click();
        });
    } else if (label.includes("blood pressure")) {
        showPage("analytics");
        document.querySelectorAll("#analytics .analytics-tab").forEach(t => {
            if (t.textContent.trim() === "Blood Pressure") t.click();
        });
    } else if (label.includes("temperature")) {
        showPage("analytics");
        document.querySelectorAll("#analytics .analytics-tab").forEach(t => {
            if (t.textContent.trim() === "Temperature") t.click();
        });
    } else if (label.includes("glucose")) {
        showPage("analytics");
        document.querySelectorAll("#analytics .analytics-tab").forEach(t => {
            if (t.textContent.trim() === "Blood Glucose") t.click();
        });
    } else if (label.includes("oxygen") || label.includes("spo2") || label.includes("radiation") || label.includes("co2") || label.includes("hydration")) {
        showPage("daily-check");
    } else if (label.includes("exercise") || label.includes("resistive") || label.includes("bone") || label.includes("mobility") || label.includes("recovery")) {
        showPage("routine");
    }
});

// ================================
// SPACE HEALTH GUIDE SEARCH & FILTER
// ================================
document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("guideSearchInput");
    const filterBtns = document.querySelectorAll(".guide-filter-tabs .filter-btn");
    const topicCards = document.querySelectorAll(".guide-topics-grid .guide-topic-card");

    let activeCategory = "all";

    function filterGuideCards() {
        const query = (searchInput?.value || "").trim().toLowerCase();
        topicCards.forEach(card => {
            const category = card.dataset.category || "all";
            const text = card.textContent.toLowerCase();
            const matchesCategory = (activeCategory === "all" || category === activeCategory);
            const matchesSearch = (query === "" || text.includes(query));
            card.style.display = (matchesCategory && matchesSearch) ? "flex" : "none";
        });
    }

    filterBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            filterBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            activeCategory = btn.dataset.filter || "all";
            filterGuideCards();
        });
    });

    searchInput?.addEventListener("input", filterGuideCards);
});

// ================================
// TWO-MINUTE BREATHING EXERCISE
// ================================
document.addEventListener("DOMContentLoaded", () => {
    const breathingCard = document.querySelector(".breathing-card");
    const beginBtn = breathingCard?.querySelector(".begin-exercise-btn");
    const circleContainer = breathingCard?.querySelector(".breathing-icon-container");
    const descP = breathingCard?.querySelector("p");

    if (!breathingCard || !beginBtn || !circleContainer) return;

    let breathingInterval = null;
    let isRunning = false;
    let secondsRemaining = 120;
    const defaultDesc = descP ? descP.textContent : "";

    circleContainer.style.transition = "transform 4s ease-in-out, box-shadow 1s ease, border-color 1s ease";

    function resetExercise(completed = false) {
        clearInterval(breathingInterval);
        breathingInterval = null;
        isRunning = false;
        secondsRemaining = 120;

        circleContainer.style.transform = "scale(1)";
        circleContainer.style.borderColor = "rgba(54, 214, 231, 0.3)";
        circleContainer.innerHTML = `<i class="fa-solid fa-moon"></i>`;

        beginBtn.innerHTML = `<i class="fa-solid fa-play"></i> Begin exercise`;
        beginBtn.style.background = "var(--primary)";
        beginBtn.style.color = "var(--bg-main)";

        if (descP) {
            descP.textContent = completed
                ? "Exercise complete. Heart rate and focus stabilized."
                : defaultDesc;
        }
    }

    function updateBreathingStep() {
        if (secondsRemaining <= 0) {
            resetExercise(true);
            return;
        }

        const mins = String(Math.floor(secondsRemaining / 60)).padStart(2, "0");
        const secs = String(secondsRemaining % 60).padStart(2, "0");

        const elapsed = 120 - secondsRemaining;
        const cyclePos = elapsed % 12;
        let phaseLabel = "Inhale";

        if (cyclePos < 4) {
            phaseLabel = "Inhale";
            circleContainer.style.transform = "scale(1.18)";
            circleContainer.style.borderColor = "var(--primary)";
        } else if (cyclePos < 8) {
            phaseLabel = "Hold";
            circleContainer.style.transform = "scale(1.18)";
            circleContainer.style.borderColor = "var(--success)";
        } else {
            phaseLabel = "Exhale";
            circleContainer.style.transform = "scale(0.95)";
            circleContainer.style.borderColor = "rgba(54, 214, 231, 0.35)";
        }

        circleContainer.innerHTML = `
            <div style="display:flex; flex-direction:column; align-items:center; line-height:1.2;">
                <strong style="font-size:18px; color:var(--text-primary);">${mins}:${secs}</strong>
                <span style="font-size:10px; font-weight:700; letter-spacing:1px; color:var(--primary); margin-top:4px;">${phaseLabel.toUpperCase()}</span>
            </div>
        `;

        if (descP) {
            descP.textContent = `${phaseLabel} slowly... Follow the 4-4-4 paced breathing rhythm.`;
        }

        secondsRemaining--;
    }

    beginBtn.addEventListener("click", () => {
        if (isRunning) {
            resetExercise(false);
            return;
        }

        isRunning = true;
        secondsRemaining = 120;
        beginBtn.innerHTML = `<i class="fa-solid fa-stop"></i> Stop exercise`;
        beginBtn.style.background = "rgba(240, 100, 100, 0.16)";
        beginBtn.style.color = "#f06464";

        updateBreathingStep();
        breathingInterval = setInterval(updateBreathingStep, 1000);
    });
});

// ================================
// EDIT PROFILE WITH PROMPT & ALERT
// ================================
document.addEventListener('DOMContentLoaded', () => {
    const editProfileBtn = document.querySelector('.edit-profile-btn');

    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', async () => {
            try {
                const res = await SpaceCareAPI.me();
                if (!res.success || !res.user) {
                    alert('Failed to retrieve profile data.');
                    return;
                }

                const currentName = res.user.name || '';
                const currentEmail = res.user.email || '';

                const newName = prompt('Edit name:', currentName);
                if (newName === null) return;

                const newEmail = prompt('Edit email:', currentEmail);
                if (newEmail === null) return;

                const newPassword = prompt('New password (leave blank to keep current):', '');
                if (newPassword === null) return;

                const payload = {
                    name: newName.trim(),
                    email: newEmail.trim()
                };

                if (newPassword.trim() !== '') {
                    if (newPassword.trim().length < 8) {
                        alert('Password must be at least 8 characters.');
                        return;
                    }
                    payload.password = newPassword.trim();
                }

                const result = await SpaceCareAPI.updateProfile(payload);

                if (result.success) {
                    alert('Profile updated successfully.');

                    const nameElement = document.querySelector('.profile-text-details h3');
                    if (nameElement) nameElement.textContent = newName.trim();

                    const topbarName = document.querySelector('.profile strong');
                    if (topbarName) topbarName.textContent = newName.trim();

                    const firstName = newName.trim().split(/\s+/)[0];
                    const welcomeHeading = document.querySelector('.welcome-section h1');
                    if (welcomeHeading) welcomeHeading.textContent = `Welcome back, ${firstName}.`;

                    const initials = newName.trim().split(' ')
                        .map(n => n[0])
                        .join('')
                        .toUpperCase()
                        .slice(0, 2);

                    const sidebarCrewName = document.querySelector('.crew-card h4');
                    if (sidebarCrewName) sidebarCrewName.textContent = newName.trim();

                    document.querySelectorAll('.profile-avatar, .profile-avatar-large, .crew-card .avatar').forEach(avatar => {
                        avatar.textContent = initials;
                    });
                }
            } catch (error) {
                alert('Update failed: ' + error.message);
            }
        });
    }
});