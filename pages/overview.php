<!-- OVERVIEW PAGE -->
<section class="page-section active" id="overview">
    <!-- WELCOME SECTION -->
    <section class="welcome-section">
        <div>
            <span class="eyebrow">MISSION DAY 084 · SPACECRAFT</span>
            <h1>Welcome back, Commander.</h1>
            <p>Here's your health briefing for Tuesday, 18 June. All values shown are simulated demo data.</p>
        </div>
        <button class="primary-button" id="startCheck" type="button">
            <i class="fa-regular fa-clipboard"></i>
            Start Daily Check
        </button>
    </section>

    <!-- TELEMETRY RISK STATUS BANNER (NEUTRAL UNTIL RECORDED) -->
    <div class="risk-status-card" id="overviewRiskCard" style="padding: 18px 20px; margin-bottom: 22px; border-radius: var(--radius-lg); background: var(--bg-card); border: 1px solid var(--border-color); display: flex; align-items: flex-start; justify-content: space-between; gap: 18px; flex-wrap: wrap;">
        <div style="display: flex; align-items: flex-start; gap: 14px; flex: 1; min-width: 240px;">
            <div id="overviewRiskIcon" style="width: 42px; height: 42px; border-radius: var(--radius-md); background: rgba(54, 214, 231, 0.12); color: var(--primary); display: grid; place-items: center; font-size: 18px; flex-shrink: 0;">
                <i class="fa-solid fa-satellite-dish"></i>
            </div>
            <div>
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 4px;">
                    <span style="font-size: 10px; font-weight: 700; letter-spacing: 1px; color: var(--text-secondary);">CREW TELEMETRY & HAZARD STATUS</span>
                    <span id="overviewRiskBadge" style="padding: 3px 10px; border-radius: 20px; font-size: 10px; font-weight: 700; background: rgba(54, 214, 231, 0.15); color: var(--primary);">NO READINGS YET</span>
                </div>
                <h3 id="overviewRiskHeadline" style="font-size: 15px; margin-bottom: 6px; color: var(--text-primary);">No telemetry recorded yet. Complete your Daily Health Check to run hazard assessment.</h3>
                <ul id="overviewProtocolList" style="margin: 0; padding-left: 18px; font-size: 11px; color: var(--text-secondary); line-height: 1.7;">
                    <li>Click "Start Daily Check" to log vital signs and cabin environment parameters.</li>
                </ul>
            </div>
        </div>
        <div style="display: flex; flex-direction: column; gap: 6px; font-size: 10px; color: var(--text-secondary); background: rgba(8, 19, 33, 0.55); padding: 12px 14px; border-radius: var(--radius-md); border: 1px solid var(--border-color); min-width: 200px;">
            <div><span>SpO2 Oxygen:</span> <strong id="ovSpo2" style="color: var(--text-primary);">--</strong></div>
            <div><span>Radiation:</span> <strong id="ovRad" style="color: var(--text-primary);">--</strong></div>
            <div><span>Cabin CO2:</span> <strong id="ovCo2" style="color: var(--text-primary);">--</strong></div>
            <div><span>Earth Comm Delay:</span> <strong id="ovDelay" style="color: var(--text-primary);">--</strong></div>
        </div>
    </div>

    <!-- DEMO BANNER -->
    <div class="demo-banner">
        <i class="fa-solid fa-wand-magic-sparkles"></i>
        <span>
            <strong>Demo environment.</strong>
            Sample readings are fictional and not connected to medical sensors.
        </span>
        <button id="closeBanner">
            <i class="fa-solid fa-xmark"></i>
        </button>
    </div>

    <!-- HEALTH CARDS -->
    <section class="health-cards">
        <div class="health-card">
            <div class="card-top">
                <div class="metric-icon green">
                    <i class="fa-solid fa-heart-pulse"></i>
                </div>
                <span class="status recorded">Recorded</span>
            </div>
            <p>Heart Rate</p>
            <h2>72 <small>bpm</small></h2>
            <div class="card-footer">
                <span>Today, 07:42</span>
                <i class="fa-solid fa-chevron-right"></i>
            </div>
        </div>
        <div class="health-card">
            <div class="card-top">
                <div class="metric-icon cyan">
                    <i class="fa-solid fa-lungs"></i>
                </div>
                <span class="status recorded">Recorded</span>
            </div>
            <p>Oxygen (SpO2)</p>
            <h2>98 <small>%</small></h2>
            <div class="card-footer">
                <span>Today, 07:44</span>
                <i class="fa-solid fa-chevron-right"></i>
            </div>
        </div>
        <div class="health-card">
            <div class="card-top">
                <div class="metric-icon green">
                    <i class="fa-solid fa-temperature-half"></i>
                </div>
                <span class="status recorded">Recorded</span>
            </div>
            <p>Body Temperature</p>
            <h2>36.8 <small>°C</small></h2>
            <div class="card-footer">
                <span>Today, 07:47</span>
                <i class="fa-solid fa-chevron-right"></i>
            </div>
        </div>
        <div class="health-card">
            <div class="card-top">
                <div class="metric-icon orange">
                    <i class="fa-solid fa-radiation"></i>
                </div>
                <span class="status recorded">Monitored</span>
            </div>
            <p>Radiation Level</p>
            <h2>0.35 <small>mSv/d</small></h2>
            <div class="card-footer">
                <span>Cabin dosimeter</span>
                <i class="fa-solid fa-chevron-right"></i>
            </div>
        </div>
        <div class="health-card">
            <div class="card-top">
                <div class="metric-icon purple">
                    <i class="fa-solid fa-moon"></i>
                </div>
                <span class="status logged">Logged</span>
            </div>
            <p>Sleep Duration</p>
            <h2>7.4 <small>hours</small></h2>
            <div class="card-footer">
                <span>Last 24 hours</span>
                <i class="fa-solid fa-chevron-right"></i>
            </div>
        </div>
        <div class="health-card">
            <div class="card-top">
                <div class="metric-icon blue">
                    <i class="fa-solid fa-wind"></i>
                </div>
                <span class="status logged">Nominal</span>
            </div>
            <p>Cabin CO2</p>
            <h2>0.04 <small>%</small></h2>
            <div class="card-footer">
                <span>Scrubber active</span>
                <i class="fa-solid fa-chevron-right"></i>
            </div>
        </div>
    </section>

    <!-- ANALYTICS SECTION -->
    <section class="analytics-grid">
        <!-- HEALTH STATUS -->
        <div class="panel health-overview" id="overview-health-status">
            <div class="panel-heading">
                <div>
                    <h3>Health status overview</h3>
                    <p>Today's self-assessment</p>
                </div>
                <span class="status review">In progress</span>
            </div>
            <div class="progress-content">
                <div class="progress-circle">
                    <div class="progress-inner">
                        <strong id="progressValue">68%</strong>
                    </div>
                </div>
                <div class="progress-text">
                    <h4>Complete today's check</h4>
                    <p>Two of three sections are ready for review.</p>
                    <a href="#routine">Continue assessment <i class="fa-solid fa-chevron-right"></i></a>
                </div>
            </div>
            <div class="overview-stat">
                <span><i class="fa-regular fa-circle-check"></i> Core measurements</span>
                <strong>4 of 5</strong>
            </div>
            <div class="overview-stat">
                <span><i class="fa-solid fa-triangle-exclamation"></i> Simulated alerts</span>
                <strong id="overviewAlertStat">1 to review</strong>
            </div>
        </div>
        <!-- HEALTH TRENDS -->
        <div class="panel trends-panel" id="overview-trends">
            <div class="panel-heading">
                <div>
                    <h3>Health trends</h3>
                    <p>Simulated seven-day view</p>
                </div>
                <a href="#analytics">View analytics <i class="fa-solid fa-chevron-right"></i></a>
            </div>
            <div class="chart-tabs">
                <button class="chart-tab active" data-chart="heart">Heart Rate</button>
                <button class="chart-tab" data-chart="sleep">Sleep</button>
                <button class="chart-tab" data-chart="temperature">Temperature</button>
            </div>
            <div class="chart-info">
                <strong id="chartValue">72</strong>
                <span id="chartUnit">bpm · latest</span>
            </div>
            <div class="chart-container">
                <canvas id="healthChart"></canvas>
            </div>
        </div>
    </section>

    <!-- BOTTOM SECTION -->
    <section class="bottom-grid">
        <!-- DAILY ROUTINE -->
        <div class="panel routine-panel" id="overview-routine">
            <div class="panel-heading">
                <div>
                    <h3>Today's routine</h3>
                    <p><span id="taskCount">3</span> of 5 tasks complete</p>
                </div>
                <a href="#routine">View routine <i class="fa-solid fa-chevron-right"></i></a>
            </div>
            <div class="routine-list">
                <label class="routine-item completed">
                    <input type="checkbox" checked>
                    <span class="custom-check"><i class="fa-solid fa-check"></i></span>
                    <div>
                        <strong>Morning measurements</strong>
                        <small>Completed · 07:30</small>
                    </div>
                    <i class="fa-solid fa-ellipsis"></i>
                </label>
                <label class="routine-item completed">
                    <input type="checkbox" checked>
                    <span class="custom-check"><i class="fa-solid fa-check"></i></span>
                    <div>
                        <strong>Resistance exercise</strong>
                        <small>Completed · 10:00</small>
                    </div>
                    <i class="fa-solid fa-ellipsis"></i>
                </label>
                <label class="routine-item completed">
                    <input type="checkbox" checked>
                    <span class="custom-check"><i class="fa-solid fa-check"></i></span>
                    <div>
                        <strong>Hydration check</strong>
                        <small>Completed · 11:30</small>
                    </div>
                    <i class="fa-solid fa-ellipsis"></i>
                </label>
                <label class="routine-item">
                    <input type="checkbox">
                    <span class="custom-check"><i class="fa-solid fa-check"></i></span>
                    <div>
                        <strong>Afternoon check-in</strong>
                        <small>Scheduled · 14:00</small>
                    </div>
                    <i class="fa-solid fa-ellipsis"></i>
                </label>
                <label class="routine-item">
                    <input type="checkbox">
                    <span class="custom-check"><i class="fa-solid fa-check"></i></span>
                    <div>
                        <strong>Evening wellness review</strong>
                        <small>Scheduled · 20:00</small>
                    </div>
                    <i class="fa-solid fa-ellipsis"></i>
                </label>
            </div>
        </div>
        <!-- QUICK ACTIONS -->
        <div class="panel quick-panel">
            <div class="panel-heading">
                <div>
                    <h3>Quick actions</h3>
                    <p>Common crew health tasks</p>
                </div>
            </div>
            <div class="quick-actions">
                <button class="action-button" data-action="measurement">
                    <span><i class="fa-solid fa-plus"></i></span>
                    Record a measurement
                </button>
                <button class="action-button" data-action="check">
                    <span><i class="fa-regular fa-clipboard"></i></span>
                    Complete health check
                </button>
                <button class="action-button" data-action="alerts">
                    <span><i class="fa-solid fa-triangle-exclamation"></i></span>
                    Review alerts
                </button>
                <button class="action-button" data-action="body">
                    <span><i class="fa-solid fa-person"></i></span>
                    Explore body map
                </button>
            </div>
            <div class="quick-note">
                <i class="fa-solid fa-circle-info"></i>
                All actions use simulated demonstration data.
            </div>
        </div>
    </section>

    <!-- FOOTER -->
    <footer class="footer">
        <span>© 2026 CREWCARE · Crew Health System</span>
        <span>Demo Version 1.0</span>
    </footer>
</section>

<!-- MODAL -->
<div class="modal-overlay" id="modalOverlay">
    <div class="modal">
        <button class="modal-close" id="modalClose">
            <i class="fa-solid fa-xmark"></i>
        </button>
        <div class="modal-icon">
            <i class="fa-solid fa-heart-pulse"></i>
        </div>
        <h2 id="modalTitle">Record a measurement</h2>
        <p id="modalDescription">Enter your simulated measurement below.</p>
        <form id="measurementForm">
            <div class="form-group">
                <label for="measurementType">Measurement type</label>
                <select id="measurementType">
                    <option value="Heart Rate">Heart Rate</option>
                    <option value="SpO2">Oxygen Saturation (SpO2)</option>
                    <option value="Blood Pressure">Blood Pressure</option>
                    <option value="Temperature">Temperature</option>
                    <option value="Radiation">Radiation Level</option>
                    <option value="Cabin CO2">Cabin CO2</option>
                </select>
            </div>
            <div id="modalGuidanceBox" style="padding: 11px 13px; margin-bottom: 16px; border-radius: var(--radius-md); background: rgba(54, 214, 231, 0.07); border: 1px solid rgba(54, 214, 231, 0.22); font-size: 10px; color: var(--text-secondary); line-height: 1.6;">
                <div style="margin-bottom: 4px;"><strong style="color: var(--primary);">How to measure:</strong> <span id="modalHowText">Rest quietly for 3 minutes, place the pulse oximeter on a warm fingertip at chest level for 15 seconds.</span></div>
                <div><strong style="color: var(--primary);">Why it matters:</strong> <span id="modalWhyText">Tracks cardiovascular workload and fluid-shift adaptation in microgravity (normal: 60–90 bpm).</span></div>
            </div>
            <div class="form-group">
                <label for="measurementValue">Value</label>
                <input type="text" id="measurementValue" placeholder="Enter a demo value" required>
            </div>
            <button type="submit" class="primary-button submit-button">
                Save Measurement
            </button>
        </form>
        <div class="modal-message" id="modalMessage"></div>
    </div>
</div>