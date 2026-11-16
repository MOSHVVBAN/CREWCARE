// ================================
// REAL-TIME OVERVIEW STATUS & TRENDS
// ================================
let cachedMeasurements = [];
let cachedWellness = [];
let cachedDailyChecks = [];
let cachedAlerts = [];

function updateHealthOverviewPanel() {
    const latestCheck = cachedDailyChecks[0] || null;
    const latestSleep = cachedWellness[0] || null;

    let measuredCount = 0;
    if (latestCheck) {
        if (latestCheck.heart_rate !== null) measuredCount++;
        if (latestCheck.spo2 !== null) measuredCount++;
        if (latestCheck.temperature !== null) measuredCount++;
        if (latestCheck.radiation_level !== null) measuredCount++;
    } else {
        if (cachedMeasurements.some(m => m.type === "Heart Rate")) measuredCount++;
        if (cachedMeasurements.some(m => m.type === "SpO2")) measuredCount++;
        if (cachedMeasurements.some(m => m.type === "Temperature")) measuredCount++;
        if (cachedMeasurements.some(m => m.type === "Radiation")) measuredCount++;
    }
    if (latestSleep && latestSleep.sleep_hours !== null) measuredCount++;

    let sectionsDone = 0;
    if (latestCheck && (latestCheck.heart_rate !== null || latestCheck.spo2 !== null)) sectionsDone++;
    if (latestCheck && (latestCheck.radiation_level !== null || latestCheck.cabin_co2 !== null)) sectionsDone++;
    if (latestSleep && latestSleep.sleep_hours !== null) sectionsDone++;

    const percent = Math.round((sectionsDone / 3) * 100);

    const progressValueEl = document.getElementById("progressValue");
    if (progressValueEl) progressValueEl.textContent = `${percent}%`;

    const progressCircle = document.querySelector("#overview-health-status .progress-circle");
    if (progressCircle) {
        progressCircle.style.background = `conic-gradient(var(--primary) ${percent}%, var(--border-color) ${percent}%)`;
    }

    const statusBadge = document.querySelector("#overview-health-status .status");
    if (statusBadge) {
        if (percent === 100) {
            statusBadge.className = "status recorded";
            statusBadge.textContent = "Completed";
        } else if (percent > 0) {
            statusBadge.className = "status review";
            statusBadge.textContent = "In progress";
        } else {
            statusBadge.className = "status review";
            statusBadge.textContent = "Not started";
        }
    }

    const progressSubText = document.querySelector("#overview-health-status .progress-text p");
    if (progressSubText) {
        progressSubText.textContent = `${sectionsDone} of 3 sections completed today.`;
    }

    const coreStatStrong = document.querySelector("#overview-health-status .overview-stat strong");
    if (coreStatStrong) {
        coreStatStrong.textContent = `${measuredCount} of 5`;
    }
}

function renderOverviewChart(metric = "heart") {
    if (!healthChart) return;
    const chartValEl = document.getElementById("chartValue");
    const chartUnitEl = document.getElementById("chartUnit");

    if (metric === "heart") {
        const items = cachedMeasurements.filter(m => m.type === "Heart Rate").slice(0, 7).reverse();
        if (items.length === 0) {
            healthChart.data.labels = ["No Data"];
            healthChart.data.datasets[0].data = [0];
            if (chartValEl) chartValEl.textContent = "--";
            if (chartUnitEl) chartUnitEl.textContent = "bpm · no entries";
        } else {
            healthChart.data.labels = items.map(m => m.created_at ? m.created_at.slice(5, 16) : "Entry");
            healthChart.data.datasets[0].data = items.map(m => Number(m.value));
            if (chartValEl) chartValEl.textContent = Number(items[items.length - 1].value);
            if (chartUnitEl) chartUnitEl.textContent = "bpm · latest";
        }
    } else if (metric === "temperature") {
        const items = cachedMeasurements.filter(m => m.type === "Temperature").slice(0, 7).reverse();
        if (items.length === 0) {
            healthChart.data.labels = ["No Data"];
            healthChart.data.datasets[0].data = [0];
            if (chartValEl) chartValEl.textContent = "--";
            if (chartUnitEl) chartUnitEl.textContent = "°C · no entries";
        } else {
            healthChart.data.labels = items.map(m => m.created_at ? m.created_at.slice(5, 16) : "Entry");
            healthChart.data.datasets[0].data = items.map(m => Number(m.value));
            if (chartValEl) chartValEl.textContent = Number(items[items.length - 1].value);
            if (chartUnitEl) chartUnitEl.textContent = "°C · latest";
        }
    } else if (metric === "sleep") {
        const items = cachedWellness.slice(0, 7).reverse();
        if (items.length === 0) {
            healthChart.data.labels = ["No Data"];
            healthChart.data.datasets[0].data = [0];
            if (chartValEl) chartValEl.textContent = "--";
            if (chartUnitEl) chartUnitEl.textContent = "hours · no entries";
        } else {
            healthChart.data.labels = items.map(w => w.created_at ? w.created_at.slice(5, 16) : "Entry");
            healthChart.data.datasets[0].data = items.map(w => Number(w.sleep_hours || 0));
            if (chartValEl) chartValEl.textContent = Number(items[items.length - 1].sleep_hours || 0);
            if (chartUnitEl) chartUnitEl.textContent = "hours · latest";
        }
    }
    healthChart.update();
}

document.querySelectorAll("#overview-trends .chart-tab").forEach(tab => {
    tab.addEventListener("click", () => {
        document.querySelectorAll("#overview-trends .chart-tab").forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
        renderOverviewChart(tab.dataset.chart || "heart");
    });
});

// ================================
// HEALTH ANALYTICS TABS & CHART LOGIC
// ================================
let activeAnalyticsMetric = "Heart Rate";
let activeAnalyticsDays = 7;

const analyticsMeta = {
    "Heart Rate": {
        subtitle: "Beats per minute (bpm)",
        unit: "bpm",
        baseline: "Personal baseline: 70-74 bpm",
        icon: "fa-solid fa-heart-pulse"
    },
    "Blood Pressure": {
        subtitle: "Systolic / Diastolic (mmHg)",
        unit: "mmHg",
        baseline: "Personal baseline: 115-122 / 74-80 mmHg",
        icon: "fa-solid fa-wave-square"
    },
    "Temperature": {
        subtitle: "Core body temperature (°C)",
        unit: "°C",
        baseline: "Personal baseline: 36.5-37.0 °C",
        icon: "fa-solid fa-temperature-half"
    },
    "Blood Glucose": {
        subtitle: "Fasting / post-meal glucose (mg/dL)",
        unit: "mg/dL",
        baseline: "Personal baseline: 85-100 mg/dL",
        icon: "fa-solid fa-droplet"
    },
    "Sleep": {
        subtitle: "Sleep duration (hours)",
        unit: "hours",
        baseline: "Personal baseline: 7.0-8.0 hours",
        icon: "fa-solid fa-moon"
    }
};

function renderAnalyticsPage() {
    const analyticsSection = document.getElementById("analytics");
    if (!analyticsSection) return;

    const meta = analyticsMeta[activeAnalyticsMetric] || analyticsMeta["Heart Rate"];
    const limit = activeAnalyticsDays === 30 ? 30 : 7;

    const headerTitle = analyticsSection.querySelector(".chart-card-header h3");
    const headerSub = analyticsSection.querySelector(".chart-card-header p");
    const baselineSpan = analyticsSection.querySelector(".baseline-info span");
    const baselineSmall = analyticsSection.querySelector(".baseline-info small");
    const bigValH2 = analyticsSection.querySelector(".metric-big-value h2");
    const latestBadge = analyticsSection.querySelector(".latest-recorded-badge");
    const entryIcon = analyticsSection.querySelector(".entry-card-icon i");
    const entryValues = analyticsSection.querySelectorAll(".latest-entry-card .entry-detail-row .value");
    const tbody = analyticsSection.querySelector(".history-table tbody");

    if (headerTitle) headerTitle.textContent = activeAnalyticsMetric;
    if (headerSub) headerSub.textContent = meta.subtitle;
    if (baselineSpan) baselineSpan.innerHTML = `<i class="fa-solid fa-chart-line"></i> ${meta.baseline}`;
    if (entryIcon) entryIcon.className = meta.icon;

    let records = [];

    if (activeAnalyticsMetric === "Heart Rate") {
        records = cachedMeasurements
            .filter(m => m.type === "Heart Rate")
            .map(m => ({
                val: Number(m.value),
                displayVal: `${Number(m.value)} bpm`,
                date: m.created_at || "Just now",
                source: "Manual / Telemetry",
                context: m.notes || "Health check"
            }));
    } else if (activeAnalyticsMetric === "Temperature") {
        records = cachedMeasurements
            .filter(m => m.type === "Temperature")
            .map(m => ({
                val: Number(m.value),
                displayVal: `${Number(m.value)} °C`,
                date: m.created_at || "Just now",
                source: "Tympanic sensor",
                context: m.notes || "Health check"
            }));
    } else if (activeAnalyticsMetric === "Blood Pressure") {
        const fromChecks = cachedDailyChecks
            .filter(c => c.systolic !== null)
            .map(c => ({
                val: Number(c.systolic),
                displayVal: `${Number(c.systolic)}/${Number(c.diastolic || 76)} mmHg`,
                date: c.created_at || "Just now",
                source: "Cuff monitor",
                context: c.notes || "Daily health check"
            }));
        const fromMeas = cachedMeasurements
            .filter(m => m.type === "Blood Pressure")
            .map(m => ({
                val: Number(m.value),
                displayVal: `${Number(m.value)} mmHg`,
                date: m.created_at || "Just now",
                source: "Manual entry",
                context: m.notes || "Quick entry"
            }));
        records = [...fromChecks, ...fromMeas];
    } else if (activeAnalyticsMetric === "Blood Glucose") {
        records = cachedDailyChecks
            .filter(c => c.glucose !== null && Number(c.glucose_not_measured) === 0)
            .map(c => ({
                val: Number(c.glucose),
                displayVal: `${Number(c.glucose)} mg/dL`,
                date: c.created_at || "Just now",
                source: "Glucometer",
                context: c.notes || "Daily health check"
            }));
    } else if (activeAnalyticsMetric === "Sleep") {
        records = cachedWellness
            .filter(w => w.sleep_hours !== null)
            .map(w => ({
                val: Number(w.sleep_hours),
                displayVal: `${Number(w.sleep_hours)} hours`,
                date: w.created_at || "Just now",
                source: "Self-reported / Actigraphy",
                context: w.sleep_quality ? `Quality: ${w.sleep_quality}` : "Wellness log"
            }));
    }

    if (baselineSmall) {
        baselineSmall.textContent = `Based on ${records.length} recorded ${records.length === 1 ? 'entry' : 'entries'}`;
    }

    if (records.length === 0) {
        if (bigValH2) bigValH2.innerHTML = `-- <small>${meta.unit}</small>`;
        if (latestBadge) latestBadge.textContent = "No entries yet";
        if (entryValues.length >= 4) {
            entryValues[0].textContent = "--";
            entryValues[1].textContent = "--";
            entryValues[2].textContent = "--";
            entryValues[3].textContent = "No entries recorded";
        }
        if (tbody) {
            tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 20px;">No ${activeAnalyticsMetric.toLowerCase()} records found yet.</td></tr>`;
        }
        if (detailedHealthChart) {
            detailedHealthChart.data.labels = ["No Data"];
            detailedHealthChart.data.datasets[0].label = activeAnalyticsMetric;
            detailedHealthChart.data.datasets[0].data = [0];
            detailedHealthChart.update();
        }
        return;
    }

    const latest = records[0];
    if (bigValH2) {
        const cleanMainVal = latest.displayVal.replace(` ${meta.unit}`, "");
        bigValH2.innerHTML = `${cleanMainVal} <small>${meta.unit}</small>`;
    }
    if (latestBadge) latestBadge.textContent = "Latest recorded";

    if (entryValues.length >= 4) {
        entryValues[0].textContent = latest.date;
        entryValues[1].textContent = latest.source;
        entryValues[2].textContent = activeAnalyticsMetric;
        entryValues[3].textContent = latest.context;
    }

    if (tbody) {
        tbody.innerHTML = records.slice(0, limit).map(r => `
            <tr>
                <td>${r.date}</td>
                <td><strong>${r.displayVal}</strong></td>
                <td>${r.source}</td>
                <td>${r.context}</td>
                <td><span class="status-recorded">Recorded</span></td>
            </tr>
        `).join('');
    }

    if (detailedHealthChart) {
        const chartSlice = records.slice(0, limit).reverse();
        detailedHealthChart.data.labels = chartSlice.map(r => r.date.length >= 16 ? r.date.slice(5, 16) : r.date);
        detailedHealthChart.data.datasets[0].label = activeAnalyticsMetric;
        detailedHealthChart.data.datasets[0].data = chartSlice.map(r => r.val);
        detailedHealthChart.update();
    }
}

document.querySelectorAll("#analytics .analytics-tab").forEach(tab => {
    tab.addEventListener("click", () => {
        document.querySelectorAll("#analytics .analytics-tab").forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
        activeAnalyticsMetric = tab.textContent.trim();
        renderAnalyticsPage();
    });
});

document.querySelectorAll("#analytics .range-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll("#analytics .range-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        activeAnalyticsDays = btn.textContent.includes("30") ? 30 : 7;
        renderAnalyticsPage();
    });
});

let activeWellnessTab = "Sleep";

const moodScoreMap = {
    "Excellent": 10,
    "Optimistic": 9,
    "Calm": 8,
    "Steady": 7,
    "Fair": 5,
    "Low": 3,
    "Poor": 2
};

function renderWellnessTrend() {
    if (!wellnessTrendChart) return;
    const bigH2 = document.querySelector("#wellness .trend-big-value h2");
    const recentLogs = cachedWellness.slice(0, 7).reverse();

    if (recentLogs.length === 0) {
        wellnessTrendChart.data.labels = ["No Data"];
        wellnessTrendChart.data.datasets[0].data = [0];
        wellnessTrendChart.update();
        if (bigH2) bigH2.innerHTML = `-- <small>no check-ins logged yet</small>`;
        return;
    }

    const latest = cachedWellness[0];
    const labels = recentLogs.map(l => l.created_at ? l.created_at.slice(5, 16) : "Entry");

    if (activeWellnessTab === "Sleep") {
        wellnessTrendChart.data.labels = labels;
        wellnessTrendChart.data.datasets[0].label = "Sleep Hours";
        wellnessTrendChart.data.datasets[0].backgroundColor = "rgba(54, 214, 231, 0.85)";
        wellnessTrendChart.data.datasets[0].data = recentLogs.map(l => Number(l.sleep_hours || 0));
        wellnessTrendChart.options.scales.y.suggestedMax = 12;
        if (bigH2) {
            const hrs = latest.sleep_hours !== null ? Number(latest.sleep_hours) : "--";
            bigH2.innerHTML = `${hrs} <small>hours · last sleep period</small>`;
        }
    } else if (activeWellnessTab === "Mood") {
        wellnessTrendChart.data.labels = labels;
        wellnessTrendChart.data.datasets[0].label = "Mood Stability Score";
        wellnessTrendChart.data.datasets[0].backgroundColor = "rgba(114, 157, 255, 0.85)";
        wellnessTrendChart.data.datasets[0].data = recentLogs.map(l => moodScoreMap[l.mood] ?? 7);
        wellnessTrendChart.options.scales.y.suggestedMax = 10;
        if (bigH2) {
            bigH2.innerHTML = `${latest.mood || "Steady"} <small>· current reported mood</small>`;
        }
    } else if (activeWellnessTab === "Stress") {
        wellnessTrendChart.data.labels = labels;
        wellnessTrendChart.data.datasets[0].label = "Stress Level (1-10)";
        wellnessTrendChart.data.datasets[0].backgroundColor = "rgba(245, 174, 66, 0.85)";
        wellnessTrendChart.data.datasets[0].data = recentLogs.map(l => Number(l.stress_level || 0));
        wellnessTrendChart.options.scales.y.suggestedMax = 10;
        if (bigH2) {
            const st = latest.stress_level !== null ? `${latest.stress_level}/10` : "--";
            bigH2.innerHTML = `${st} <small>· reported stress index</small>`;
        }
    }

    wellnessTrendChart.update();
}

document.querySelectorAll("#wellness .trend-tab").forEach(tab => {
    tab.addEventListener("click", () => {
        document.querySelectorAll("#wellness .trend-tab").forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
        activeWellnessTab = tab.textContent.trim();
        renderWellnessTrend();
    });
});

function updateLiveClockUI() {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const timeBadgeSpan = document.querySelector('#stepPane1 .time-badge span');
    if (timeBadgeSpan) {
        timeBadgeSpan.textContent = `Today, ${hh}:${mm}`;
    }

    const welcomeDesc = document.querySelector('.welcome-section p');
    if (welcomeDesc) {
        const formattedDate = now.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' });
        welcomeDesc.textContent = `Here's your health briefing for ${formattedDate}. Real-time crew telemetry and risk assessment active.`;
    }
}

// ================================
// FULL BACKEND DATA SYNC (MYSQL)
// ================================
async function syncAllDashboardData() {
    try {
        await Promise.allSettled([
            loadMeasurementsAndCards(),
            loadDailyChecksData(),
            loadWellnessData(),
            loadTasksData(),
            loadAlertsData(),
            loadUserSettings()
        ]);
        renderAnalyticsPage();
    } catch (e) {
        console.error("Sync error:", e);
    }
}

async function loadMeasurementsAndCards() {
    try {
        const res = await SpaceCareAPI.getMeasurements();
        const list = res.measurements || [];
        cachedMeasurements = list;
        const cards = document.querySelectorAll(".health-cards .health-card");

        if (list.length === 0) {
            if (cards[0]) {
                cards[0].querySelector("h2").innerHTML = `-- <small>bpm</small>`;
                cards[0].querySelector(".status").textContent = "No data";
                cards[0].querySelector(".card-footer span").textContent = "Not recorded yet";
            }
            if (cards[1]) {
                cards[1].querySelector("h2").innerHTML = `-- <small>%</small>`;
                cards[1].querySelector(".status").textContent = "No data";
                cards[1].querySelector(".card-footer span").textContent = "Not recorded yet";
            }
            if (cards[2]) {
                cards[2].querySelector("h2").innerHTML = `-- <small>°C</small>`;
                cards[2].querySelector(".status").textContent = "No data";
                cards[2].querySelector(".card-footer span").textContent = "Not recorded yet";
            }
            const tbody = document.querySelector(".history-table tbody");
            if (tbody) {
                tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 20px;">No measurements recorded for this account yet.</td></tr>`;
            }
            renderOverviewChart("heart");
            updateHealthOverviewPanel();
            return;
        }

        const latestHR = list.find(m => m.type === "Heart Rate");
        const latestSpo2 = list.find(m => m.type === "SpO2");
        const latestTemp = list.find(m => m.type === "Temperature");

        if (latestHR && cards[0]) {
            cards[0].querySelector("h2").innerHTML = `${Number(latestHR.value)} <small>bpm</small>`;
            cards[0].querySelector(".status").textContent = "Recorded";
            cards[0].querySelector(".card-footer span").textContent = latestHR.created_at || "Recorded";
        }
        if (latestSpo2 && cards[1]) {
            cards[1].querySelector("h2").innerHTML = `${Number(latestSpo2.value)} <small>%</small>`;
            cards[1].querySelector(".status").textContent = "Recorded";
            cards[1].querySelector(".card-footer span").textContent = latestSpo2.created_at || "Recorded";
        }
        if (latestTemp && cards[2]) {
            cards[2].querySelector("h2").innerHTML = `${Number(latestTemp.value)} <small>°C</small>`;
            cards[2].querySelector(".status").textContent = "Recorded";
            cards[2].querySelector(".card-footer span").textContent = latestTemp.created_at || "Recorded";
        }

        const activeTab = document.querySelector("#overview-trends .chart-tab.active")?.dataset.chart || "heart";
        renderOverviewChart(activeTab);
        renderAnalyticsPage();
        updateHealthOverviewPanel();
    } catch (e) {
        console.error("Measurements load error:", e);
    }
}

async function loadDailyChecksData() {
    try {
        const res = await SpaceCareAPI.getDailyChecks();
        const checks = res.checks || [];
        cachedDailyChecks = checks;
        const cards = document.querySelectorAll(".health-cards .health-card");

        if (checks.length === 0) {
            if (cards[3]) {
                cards[3].querySelector("h2").innerHTML = `-- <small>mSv/d</small>`;
                cards[3].querySelector(".status").textContent = "No data";
            }
            if (cards[5]) {
                cards[5].querySelector("h2").innerHTML = `-- <small>%</small>`;
                cards[5].querySelector(".status").textContent = "No data";
            }
            if (document.getElementById("ovSpo2")) document.getElementById("ovSpo2").textContent = "--";
            if (document.getElementById("ovRad")) document.getElementById("ovRad").textContent = "--";
            if (document.getElementById("ovCo2")) document.getElementById("ovCo2").textContent = "--";
            if (document.getElementById("ovDelay")) document.getElementById("ovDelay").textContent = "--";
            updateHealthOverviewPanel();
            return;
        }

        const latest = checks[0];
        if (latest.heart_rate && cards[0]) cards[0].querySelector("h2").innerHTML = `${Number(latest.heart_rate)} <small>bpm</small>`;
        if (latest.spo2 && cards[1]) cards[1].querySelector("h2").innerHTML = `${Number(latest.spo2)} <small>%</small>`;
        if (latest.temperature && cards[2]) cards[2].querySelector("h2").innerHTML = `${Number(latest.temperature)} <small>°C</small>`;
        if (latest.radiation_level && cards[3]) {
            cards[3].querySelector("h2").innerHTML = `${Number(latest.radiation_level)} <small>mSv/d</small>`;
            cards[3].querySelector(".status").textContent = "Monitored";
        }
        if (latest.cabin_co2 && cards[5]) {
            cards[5].querySelector("h2").innerHTML = `${Number(latest.cabin_co2)} <small>%</small>`;
            cards[5].querySelector(".status").textContent = "Monitored";
        }

        const telemetry = {
            heart_rate: latest.heart_rate ?? 72,
            spo2: latest.spo2 ?? 98,
            temperature: latest.temperature ?? 36.8,
            sleep_hours: cachedWellness[0]?.sleep_hours ?? 7.4,
            radiation_level: latest.radiation_level ?? 0.35,
            cabin_co2: latest.cabin_co2 ?? 0.04,
            comm_delay: latest.comm_delay ?? 1.3
        };
        const risk = computeLocalRisk(telemetry);
        applyRiskToUI(risk, telemetry);
        renderAnalyticsPage();
        updateHealthOverviewPanel();
    } catch (e) {
        console.error("Daily check load error:", e);
    }
}

async function loadWellnessData() {
    try {
        const res = await SpaceCareAPI.getWellness();
        const logs = res.wellness || [];
        cachedWellness = logs;
        const cards = document.querySelectorAll(".health-cards .health-card");
        const wCards = document.querySelectorAll(".wellness-metrics-row .metric-card h2");
        const bigH2 = document.querySelector("#wellness .trend-big-value h2");

        if (logs.length === 0) {
            if (cards[4]) {
                cards[4].querySelector("h2").innerHTML = `-- <small>hours</small>`;
                cards[4].querySelector(".status").textContent = "No data";
            }
            if (wCards[0]) wCards[0].innerHTML = `-- <small>hours</small>`;
            if (wCards[1]) wCards[1].textContent = "--";
            if (wCards[2]) wCards[2].textContent = "--";
            if (wCards[3]) wCards[3].textContent = "--";
            if (bigH2) bigH2.innerHTML = `-- <small>no check-ins logged yet</small>`;
            renderWellnessTrend();
            updateHealthOverviewPanel();
            return;
        }

        const latest = logs[0];
        if (latest.sleep_hours && cards[4]) {
            cards[4].querySelector("h2").innerHTML = `${Number(latest.sleep_hours)} <small>hours</small>`;
            cards[4].querySelector(".status").textContent = "Logged";
        }

        if (wCards[0] && latest.sleep_hours) wCards[0].innerHTML = `${Number(latest.sleep_hours)} <small>hours</small>`;
        if (wCards[1] && latest.sleep_quality) wCards[1].textContent = latest.sleep_quality;
        if (wCards[2] && latest.mood) wCards[2].textContent = latest.mood;
        if (wCards[3] && latest.stress_level) wCards[3].textContent = `${latest.stress_level}/10`;

        renderWellnessTrend();
        renderAnalyticsPage();
        updateHealthOverviewPanel();
    } catch (e) {
        console.error("Wellness load error:", e);
    }
}

async function loadTasksData() {
    try {
        const res = await SpaceCareAPI.getTasks();
        const tasks = res.tasks || [];

        const html = tasks.map(t => `
            <label class="routine-item ${Number(t.is_done) ? 'completed' : ''}">
                <input type="checkbox" data-task-id="${t.id}" ${Number(t.is_done) ? 'checked' : ''}>
                <span class="custom-check"><i class="fa-solid fa-check"></i></span>
                <div>
                    <strong>${t.title}</strong>
                    <small>${Number(t.is_done) ? 'Completed' : 'Scheduled'} ${t.due_at ? '· ' + t.due_at : ''}</small>
                </div>
                <i class="fa-solid fa-ellipsis"></i>
            </label>
        `).join('');

        document.querySelectorAll(".routine-list").forEach(listEl => {
            listEl.innerHTML = html;
        });

        const doneCount = tasks.filter(t => Number(t.is_done)).length;
        const totalCount = tasks.length;

        const routineSubP = document.querySelector("#overview-routine .panel-heading p");
        if (routineSubP) {
            routineSubP.innerHTML = `<span id="taskCount">${doneCount}</span> of ${totalCount} tasks complete`;
        }

        const percent = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

        const progressRing = document.querySelector("#routine .progress-ring-wrapper");
        if (progressRing) {
            progressRing.style.background = `conic-gradient(var(--primary) ${percent}%, var(--border-color) ${percent}%)`;
        }
        const ringSpan = document.querySelector("#routine .progress-ring-circle span");
        if (ringSpan) ringSpan.textContent = `${percent}%`;

        const compH2 = document.querySelector("#routine .completion-text-info h2");
        if (compH2) compH2.textContent = `${doneCount} of ${totalCount} tasks complete`;

        const nextTask = tasks.find(t => !Number(t.is_done));
        const nextTaskP = document.querySelector("#routine .completion-text-info p");
        if (nextTaskP) {
            nextTaskP.textContent = nextTask
                ? `Next scheduled: ${nextTask.title}${nextTask.due_at ? ' at ' + nextTask.due_at : ''}`
                : 'All scheduled tasks completed for today!';
        }

        const statNums = document.querySelectorAll("#routine .completion-stats-right .stat-number");
        if (statNums[0]) statNums[0].textContent = doneCount;
        if (statNums[1]) statNums[1].textContent = totalCount - doneCount;
    } catch (e) {
        console.error("Tasks load error:", e);
    }
}

async function loadAlertsData() {
    try {
        const res = await SpaceCareAPI.getAlerts();
        const alerts = res.alerts || [];
        cachedAlerts = alerts;

        const badge = document.querySelector(".notification-count");
        const bellDot = document.querySelector(".bell-dot");
        const openAlerts = alerts.filter(a => !Number(a.is_reviewed));
        if (badge) badge.textContent = openAlerts.length;
        if (bellDot) bellDot.style.display = openAlerts.length > 0 ? "block" : "none";

        const openBadge = document.querySelector(".open-items-badge");
        if (openBadge) {
            openBadge.innerHTML = `<i class="fa-solid fa-circle"></i> ${openAlerts.length} open items`;
        }

        const ovAlertStat = document.getElementById("overviewAlertStat");
        if (ovAlertStat) ovAlertStat.textContent = `${openAlerts.length} to review`;

        const alertsListContainer = document.querySelector(".alerts-list-column");
        if (!alertsListContainer) return;

        if (alerts.length === 0) {
            alertsListContainer.innerHTML = `<p style="color: var(--text-secondary); padding: 20px;">No alerts or pending actions right now.</p>`;
            return;
        }
alertsListContainer.innerHTML = alerts.map(alert => {
            const isReviewed = Number(alert.is_reviewed) === 1;
            const severityClass = alert.severity === 'urgent' ? 'urgent-card' : (alert.severity === 'info' ? 'info-card' : 'review-card');
            const badgeClass = alert.severity === 'urgent' ? 'urgent' : (alert.severity === 'info' ? 'info' : 'review');
            const statusText = alert.severity === 'urgent' ? 'Urgent attention' : (alert.severity === 'info' ? 'Information' : 'Review needed');
            const nextStep = alert.protocol || "Follow the mission's established medical protocol and verify sensor readings.";

            return `
                <div class="alert-card ${severityClass}" style="${isReviewed ? 'opacity: 0.72;' : ''}">
                    <div class="alert-top-info">
                        <div class="alert-icon-title">
                            <i class="fa-solid ${alert.severity === 'info' ? 'fa-circle-info' : 'fa-triangle-exclamation'}"></i>
                            <span class="status-badge ${badgeClass}">${statusText}</span>
                        </div>
                    </div>
                    <h3>${alert.title}</h3>
                    <div class="alert-meta-details">
                        <span><i class="fa-regular fa-clock"></i> ${alert.created_at || 'Just now'}</span>
                    </div>
                    <p class="alert-description">${alert.description || ''}</p>
                    <div class="recommended-step-box">
                        <span class="step-title">RECOMMENDED NEXT STEP</span>
                        <p>${nextStep}</p>
                    </div>
                    <div class="alert-actions" style="align-items: center;">
                        <button class="btn-view-details" data-alert-id="${alert.id}">View details</button>
                        ${!isReviewed ? `<button class="btn-mark-reviewed" data-alert-id="${alert.id}">Mark as reviewed</button>` : '<span style="color: var(--success); font-size: 11px; font-weight: 600; display: inline-flex; align-items: center; gap: 5px;"><i class="fa-solid fa-circle-check"></i> Reviewed</span>'}
                    </div>
                </div>
            `;
        }).join('');
    } catch (e) {
        console.error("Alerts load error:", e);
    }
}

document.addEventListener('click', async (e) => {
    const viewBtn = e.target.closest('.btn-view-details');
    if (viewBtn) {
        const alertId = Number(viewBtn.dataset.alertId);
        const targetAlert = cachedAlerts.find(a => Number(a.id) === alertId);
        if (targetAlert) {
            const delayVal = cachedDailyChecks[0]?.comm_delay ?? 1.3;
            const statusLabel = Number(targetAlert.is_reviewed) === 1 ? 'Reviewed' : 'Open / Active';
            const detailsText = [
                `ALERT: ${targetAlert.title}`,
                `SEVERITY: ${(targetAlert.severity || 'info').toUpperCase()} (${statusLabel})`,
                `TIMESTAMP: ${targetAlert.created_at || 'Just now'}`,
                `EARTH COMM DELAY: ${delayVal} min`,
                ``,
                `TELEMETRY & FLAGGED INDICATORS:`,
                `${targetAlert.description || 'No additional telemetry description.'}`,
                ``,
                `AUTONOMOUS ACTION PROTOCOL:`,
                `${targetAlert.protocol || "Follow the mission's established medical protocol and verify sensor readings."}`
            ].join('\n');
            alert(detailsText);
        }
        return;
    }

    const reviewBtn = e.target.closest('.btn-mark-reviewed');
    if (!reviewBtn) return;

    const alertId = reviewBtn.dataset.alertId;
    if (!alertId) return;

    try {
        await SpaceCareAPI.reviewAlert({ id: alertId, is_reviewed: 1 });
        await loadAlertsData();
    } catch (error) {
        alert('Error updating alert: ' + error.message);
    }
});

async function loadUserSettings() {
    try {
        const res = await SpaceCareAPI.getSettings();
        const s = res.settings || {};
        const select = document.querySelector(".standard-select");
        if (select && s.unit_system) select.value = s.unit_system;
    } catch (e) {
        console.error("Settings load error:", e);
    }
}