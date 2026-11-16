<!-- DAILY HEALTH CHECK PAGE CONTENT -->
<section class="page-section" id="daily-check">
    <!-- PAGE HEADER & SAVE BUTTON -->
    <div class="health-check-container">
        <div class="health-check-title-area">
            <a href="#overview" class="back-link"><i class="fa-solid fa-arrow-left"></i> Back to overview</a>
            <span class="sub-category-tag">DAILY HEALTH CHECK</span>
            <h1 id="dailyCheckHeading">Record basic measurements</h1>
            <p id="dailyCheckDesc">Your entries stay in this demo until you review and save them.</p>
        </div>
        <button class="save-progress-btn" id="saveProgressBtn">
            <i class="fa-regular fa-floppy-disk"></i> Save progress
        </button>
    </div>

    <!-- REAL-TIME STATUS & AUTONOMOUS ACTION PROTOCOL CARD -->
    <div id="liveDiagnosticCard" style="padding: 20px; margin-bottom: 22px; border-radius: var(--radius-lg); background: var(--bg-card); border: 1px solid var(--border-color); transition: var(--transition);">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; margin-bottom: 10px;">
            <div style="display: flex; align-items: center; gap: 10px;">
                <i id="liveDiagIcon" class="fa-solid fa-satellite-dish" style="color: var(--primary); font-size: 18px;"></i>
                <strong id="liveDiagTitle" style="font-size: 14px; color: var(--text-primary);">Diagnostic Status: Awaiting Input</strong>
            </div>
            <span id="liveDiagBadge" style="padding: 4px 12px; border-radius: 20px; font-size: 10px; font-weight: 700; background: rgba(54, 214, 231, 0.15); color: var(--primary);">PENDING DATA</span>
        </div>
        <p id="liveDiagSubtitle" style="font-size: 11px; color: var(--text-secondary); margin-bottom: 10px;">Enter vital signs and cabin environment readings below to trigger live risk evaluation.</p>
        <div id="liveProtocolBox" style="padding: 12px 14px; border-radius: var(--radius-md); background: rgba(8, 19, 33, 0.55); border: 1px solid var(--border-color);">
            <span style="display: block; font-size: 9px; font-weight: 700; letter-spacing: 1px; color: var(--primary); margin-bottom: 6px;">AUTONOMOUS ACTION PROTOCOL</span>
            <ul id="liveProtocolList" style="margin: 0; padding-left: 18px; font-size: 11px; color: var(--text-secondary); line-height: 1.7;">
                <li>Awaiting telemetry measurements...</li>
            </ul>
        </div>
    </div>

    <!-- STEPS PROGRESS BAR -->
    <div class="steps-indicator">
        <div class="step-item active" id="indicatorStep1">
            <div class="step-number">1</div>
            <div class="step-text">
                <span class="step-label">STEP 1</span>
                <span class="step-name">Vitals & spacecraft telemetry</span>
            </div>
        </div>
        <div class="step-line"></div>
        <div class="step-item" id="indicatorStep2">
            <div class="step-number">2</div>
            <div class="step-text">
                <span class="step-label">STEP 2</span>
                <span class="step-name">Sleep & mood</span>
            </div>
        </div>
        <div class="step-line"></div>
        <div class="step-item" id="indicatorStep3">
            <div class="step-number">3</div>
            <div class="step-text">
                <span class="step-label">STEP 3</span>
                <span class="step-name">Review</span>
            </div>
        </div>
    </div>

    <!-- FORM & GUIDANCE GRID -->
    <div class="check-content-grid">
        <!-- MAIN WIZARD CONTAINER -->
        <div class="measurements-form-card" id="wizardCardContainer">
            <!-- STEP 1: CORE MEASUREMENTS & SPACECRAFT TELEMETRY -->
            <div class="check-step-pane" id="stepPane1">
                <div class="card-section-title">
                    <h3>Core measurements & spacecraft telemetry</h3>
                    <p>Required unless marked unavailable or not scheduled.</p>
                </div>
                <div class="time-badge">
                    <i class="fa-regular fa-clock"></i> Measurement time: <span>Today, 08:10</span>
                </div>

                <!-- Row 1: Heart Rate & SpO2 (Oxygen) -->
                <div class="form-row">
                    <div class="input-group">
                        <label>Heart rate</label>
                        <div class="input-with-unit">
                            <input type="number" step="1" min="0" placeholder="e.g. 72" data-daily-field="heart_rate">
                            <span class="unit">bpm</span>
                        </div>
                    </div>
                    <div class="input-group">
                        <label>Oxygen saturation (SpO2)</label>
                        <div class="input-with-unit">
                            <input type="number" step="0.1" min="0" max="100" placeholder="e.g. 98" data-daily-field="spo2">
                            <span class="unit">%</span>
                        </div>
                    </div>
                </div>

                <!-- Row 2: Body Temperature & Sleep Hours -->
                <div class="form-row">
                    <div class="input-group">
                        <label>Body temperature</label>
                        <div class="input-with-unit">
                            <input type="number" step="0.1" min="0" placeholder="e.g. 36.8" data-daily-field="temperature">
                            <span class="unit">°C</span>
                        </div>
                    </div>
                    <div class="input-group">
                        <label>Sleep hours (last 24h)</label>
                        <div class="input-with-unit">
                            <input type="number" step="0.5" min="0" max="24" placeholder="e.g. 7.5" data-daily-field="sleep_hours">
                            <span class="unit">hours</span>
                        </div>
                    </div>
                </div>

                <!-- Row 3: Radiation Level & Cabin CO2 -->
                <div class="form-row">
                    <div class="input-group">
                        <label>Radiation level</label>
                        <div class="input-with-unit">
                            <input type="number" step="0.01" min="0" placeholder="e.g. 0.35" data-daily-field="radiation_level">
                            <span class="unit">mSv/day</span>
                        </div>
                    </div>
                    <div class="input-group">
                        <label>Cabin CO2 concentration</label>
                        <div class="input-with-unit">
                            <input type="number" step="0.01" min="0" placeholder="e.g. 0.04" data-daily-field="cabin_co2">
                            <span class="unit">%</span>
                        </div>
                    </div>
                </div>

                <!-- Row 4: Earth Comm Delay & Blood Pressure -->
                <div class="form-row">
                    <div class="input-group">
                        <label>Earth communication delay</label>
                        <div class="input-with-unit">
                            <input type="number" step="0.1" min="0" placeholder="e.g. 1.3" data-daily-field="comm_delay">
                            <span class="unit">min</span>
                        </div>
                    </div>
                    <div class="input-group">
                        <label>Systolic pressure</label>
                        <div class="input-with-unit">
                            <input type="number" step="1" min="0" placeholder="e.g. 118" data-daily-field="systolic">
                            <span class="unit">mmHg</span>
                        </div>
                    </div>
                </div>

                <!-- Row 5: Diastolic Pressure & Blood Glucose -->
                <div class="form-row">
                    <div class="input-group">
                        <label>Diastolic pressure</label>
                        <div class="input-with-unit">
                            <input type="number" step="1" min="0" placeholder="e.g. 76" data-daily-field="diastolic">
                            <span class="unit">mmHg</span>
                        </div>
                    </div>
                    <div class="input-group">
                        <label>Blood glucose</label>
                        <div class="input-with-unit">
                            <input type="number" step="1" min="0" placeholder="e.g. 92" data-daily-field="glucose">
                            <span class="unit">mg/dL</span>
                        </div>
                        <label class="checkbox-label" style="margin-top: 8px;">
                            <input type="checkbox" data-daily-field="glucose_not_measured"> Not measured or not scheduled
                        </label>
                    </div>
                </div>

                <!-- Row 6: Measurement Notes -->
                <div class="form-row single-col">
                    <div class="input-group">
                        <label>Measurement notes <span class="optional">Optional</span></label>
                        <textarea placeholder="Add device, context, or anything the medical team should know." data-daily-field="notes"></textarea>
                    </div>
                </div>

                <!-- Form Actions -->
                <div class="form-actions">
                    <button class="btn-cancel" type="button" onclick="location.reload()">Cancel</button>
                    <button class="btn-continue" type="button" id="nextToStep2Btn">Evaluate & Continue <i class="fa-solid fa-chevron-right"></i></button>
                </div>
            </div>

            <!-- STEP 2: SLEEP & MOOD -->
            <div class="check-step-pane" id="stepPane2" style="display: none;">
                <div class="card-section-title">
                    <h3>Sleep & mental wellness</h3>
                    <p>Log your resting hours, quality, and current mood state.</p>
                </div>
                <div class="time-badge">
                    <i class="fa-regular fa-clock"></i> Step 2 of 3
                </div>
                <div class="form-row">
                    <div class="input-group">
                        <label>Sleep hours</label>
                        <div class="input-with-unit">
                            <input type="number" step="0.5" min="0" max="24" id="wellnessSleepInput" placeholder="e.g. 7.5">
                            <span class="unit">hours</span>
                        </div>
                    </div>
                    <div class="input-group">
                        <label>Sleep quality</label>
                        <select id="wellnessQualityInput" class="standard-select" style="width:100%; padding:12px; background:var(--bg-main); color:var(--text-primary); border:1px solid var(--border-color); border-radius:var(--radius-md); outline:none;">
                            <option value="Good">Good</option>
                            <option value="Fair">Fair</option>
                            <option value="Poor">Poor</option>
                            <option value="Excellent">Excellent</option>
                        </select>
                    </div>
                </div>
                <div class="form-row">
                    <div class="input-group">
                        <label>Current mood</label>
                        <select id="wellnessMoodInput" class="standard-select" style="width:100%; padding:12px; background:var(--bg-main); color:var(--text-primary); border:1px solid var(--border-color); border-radius:var(--radius-md); outline:none;">
                            <option value="Steady">Steady</option>
                            <option value="Calm">Calm</option>
                            <option value="Optimistic">Optimistic</option>
                            <option value="Low">Low</option>
                        </select>
                    </div>
                    <div class="input-group">
                        <label>Stress level (1-10)</label>
                        <div class="input-with-unit">
                            <input type="number" min="1" max="10" id="wellnessStressInput" placeholder="e.g. 2">
                            <span class="unit">level</span>
                        </div>
                    </div>
                </div>
                <div class="form-row single-col">
                    <div class="input-group">
                        <label>Wellness notes <span class="optional">Optional</span></label>
                        <textarea id="wellnessNotesInput" placeholder="Any additional context about your rest or mindset."></textarea>
                    </div>
                </div>
                <div class="form-actions">
                    <button class="btn-cancel" type="button" onclick="goToStep(1)">Back</button>
                    <button class="btn-continue" type="button" id="nextToStep3Btn">Continue to Review <i class="fa-solid fa-chevron-right"></i></button>
                </div>
            </div>

            <!-- STEP 3: REVIEW & FINISH -->
            <div class="check-step-pane" id="stepPane3" style="display: none;">
                <div class="card-section-title">
                    <h3>Review your assessment</h3>
                    <p>All sections are recorded and ready for final submission.</p>
                </div>
                <div class="time-badge">
                    <i class="fa-regular fa-circle-check" style="color:var(--success);"></i> Step 3 of 3 · Final Review
                </div>
                <div class="protocol-box" style="margin-bottom: 20px;">
                    <span class="protocol-title">READY TO SUBMIT</span>
                    <p>Your measurements and wellness details are prepared. Click finish to complete today's mission health check.</p>
                </div>
                <div class="form-actions">
                    <button class="btn-cancel" type="button" onclick="goToStep(2)">Back</button>
                    <button class="btn-continue" type="button" id="finishCheckBtn" style="background:var(--success); color:white; border-color:var(--success);">Complete Check <i class="fa-solid fa-check"></i></button>
                </div>
            </div>
        </div>

        <!-- GUIDANCE CARD (NON-MEDICAL CREW EXPLANATION) -->
        <div class="guidance-card">
            <div class="guidance-header">
                <i class="fa-solid fa-user-doctor"></i>
                <h3>Measurement guidance</h3>
            </div>
            <p>Rest quietly for 3 to 5 minutes before taking vitals so physical exertion does not skew baseline readings.</p>
            <div style="margin-top: 14px; display: flex; flex-direction: column; gap: 10px; font-size: 10px; color: var(--text-secondary); line-height: 1.6;">
                <div style="padding: 10px; background: rgba(255,255,255,0.02); border: 1px solid var(--border-color); border-radius: var(--radius-sm);">
                    <strong style="color: var(--primary); display: block; margin-bottom: 2px;">Heart Rate & SpO2 (Pulse Oximeter)</strong>
                    Warm your fingertip and keep your hand steady at chest level for 15 seconds. SpO2 tracks oxygen delivery in closed-loop cabin air; values below 94% require immediate ventilation and oxygen checks.
                </div>
                <div style="padding: 10px; background: rgba(255,255,255,0.02); border: 1px solid var(--border-color); border-radius: var(--radius-sm);">
                    <strong style="color: var(--primary); display: block; margin-bottom: 2px;">Cabin CO2 & Radiation Dosimeter</strong>
                    Read the wall scrubber display for CO2 (%) and your wearable dosimeter for daily radiation (mSv/day). Combined fatigue, elevated pulse, and radiation spikes trigger autonomous shelter protocols when Earth communication is delayed.
                </div>
                <div style="padding: 10px; background: rgba(255,255,255,0.02); border: 1px solid var(--border-color); border-radius: var(--radius-sm);">
                    <strong style="color: var(--primary); display: block; margin-bottom: 2px;">Sleep & Body Temperature</strong>
                    Log total uninterrupted sleep hours and ear/forehead temperature before caffeine intake to detect circadian drift or early infection.
                </div>
            </div>
            <a href="#guide" class="guidance-link">Open Space Health Guide <i class="fa-solid fa-chevron-right"></i></a>
            <div class="protocol-box">
                <span class="protocol-title">FOLLOW MISSION PROTOCOL</span>
                <p>When Earth communication delay exceeds real-time support, follow the on-screen Autonomous Action Protocol immediately and log symptoms for flight surgeon review.</p>
            </div>
        </div>
    </div>
</section>