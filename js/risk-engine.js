// ================================
// MISSION ENVIRONMENTS & ADAPTIVE THRESHOLDS
// ================================
const MISSION_ENVIRONMENTS = {
    spacecraft: {
        key: "spacecraft",
        label: "Spacecraft (LEO)",
        eyebrowTag: "SPACECRAFT",
        radWarn: 1.0,
        radCrit: 2.5,
        defaultDelay: 0.1,
        bannerIcon: "fa-solid fa-shuttle-space",
        bannerHtml: "<strong>Spacecraft (LEO) Profile.</strong> Telemetry modeled on NASA OCHMO standards · Radiation warning threshold: 1.0 mSv/d · Earth comm delay: ~0.1 min.",
        autonomousNote: "Low-Earth Orbit link active (~0.1 min delay)."
    },
    iss: {
        key: "iss",
        label: "Space Station (ISS)",
        eyebrowTag: "SPACE STATION · ISS",
        radWarn: 1.2,
        radCrit: 2.5,
        defaultDelay: 0.2,
        bannerIcon: "fa-solid fa-satellite",
        bannerHtml: "<strong>Space Station (ISS) Profile.</strong> Microgravity & closed-loop ECLSS monitoring active · Radiation warning threshold: 1.2 mSv/d · Orbital delay: ~0.2 min.",
        autonomousNote: "ISS orbital telemetry link nominal (~0.2 min delay)."
    },
    lunar: {
        key: "lunar",
        label: "Lunar Base (Artemis)",
        eyebrowTag: "LUNAR BASE · ARTEMIS",
        radWarn: 0.8,
        radCrit: 2.0,
        defaultDelay: 0.05,
        bannerIcon: "fa-solid fa-moon",
        bannerHtml: "<strong>Lunar Base (Artemis) Profile.</strong> Partial gravity (1/6g) & surface regolith shielding · Stricter radiation warning threshold: 0.8 mSv/d · Earth delay: ~1.3 sec.",
        autonomousNote: "Surface radiation shielding active (stricter 0.8 mSv/d warning threshold)."
    },
    mars: {
        key: "mars",
        label: "Mars Transit (Deep Space)",
        eyebrowTag: "MARS TRANSIT · AUTONOMOUS MODE",
        radWarn: 0.9,
        radCrit: 2.0,
        defaultDelay: 14.0,
        bannerIcon: "fa-solid fa-planet-ringed",
        bannerHtml: "<strong>Mars Transit (Deep Space) Profile.</strong> Autonomous onboard medical mode active · Radiation warning threshold: 0.9 mSv/d · Earth comm delay: 4–22 min.",
        autonomousNote: "Deep-space comm delay (4–22 min) — Autonomous Medical Mode Active."
    }
};

let currentMissionEnv = localStorage.getItem("crewcare_mission_env") || "spacecraft";
if (!MISSION_ENVIRONMENTS[currentMissionEnv]) currentMissionEnv = "spacecraft";

function getActiveEnvironmentConfig() {
    return MISSION_ENVIRONMENTS[currentMissionEnv] || MISSION_ENVIRONMENTS.spacecraft;
}

function setMissionEnvironment(envKey) {
    if (!MISSION_ENVIRONMENTS[envKey]) return;
    currentMissionEnv = envKey;
    localStorage.setItem("crewcare_mission_env", envKey);
const bannerTextEl = document.getElementById("envBannerText");
    if (bannerTextEl) bannerTextEl.innerHTML = cfg.bannerHtml;

    const bannerIconEl = document.getElementById("envBannerIcon");
    if (bannerIconEl) bannerIconEl.className = cfg.bannerIcon;
    const cfg = getActiveEnvironmentConfig();

    const topSelect = document.getElementById("missionEnvironmentSelect");
    if (topSelect && topSelect.value !== envKey) topSelect.value = envKey;

    const settingsSelect = document.getElementById("settingsEnvironmentSelect");
    if (settingsSelect && settingsSelect.value !== envKey) settingsSelect.value = envKey;

    const eyebrowEl = document.querySelector(".welcome-section .eyebrow");
    if (eyebrowEl) {
        const dayMatch = eyebrowEl.textContent.match(/MISSION DAY \d+/i);
        const dayPart = dayMatch ? dayMatch[0].toUpperCase() : "MISSION DAY 001";
        eyebrowEl.textContent = `${dayPart} · ${cfg.eyebrowTag}`;
    }

    const delayInput = document.querySelector('#stepPane1 [data-daily-field="comm_delay"]');
    if (delayInput && delayInput.value.trim() === "") {
        delayInput.placeholder = `e.g. ${cfg.defaultDelay}`;
    }

    const ovDelayEl = document.getElementById("ovDelay");
    if (ovDelayEl && (!cachedDailyChecks || cachedDailyChecks.length === 0)) {
        ovDelayEl.textContent = `${cfg.defaultDelay} min`;
    }

    const pane1 = document.getElementById("stepPane1");
    if (pane1) {
        const inputs = Array.from(pane1.querySelectorAll('input[type="number"]'));
        if (inputs.some(inp => inp.value.trim() !== "")) {
            const t = readStep1Telemetry();
            const risk = computeLocalRisk(t);
            applyRiskToUI(risk, t);
        }
    }

    if (typeof cachedDailyChecks !== "undefined" && cachedDailyChecks.length > 0) {
        const latest = cachedDailyChecks[0];
        const telemetry = {
            heart_rate: latest.heart_rate ?? 72,
            spo2: latest.spo2 ?? 98,
            temperature: latest.temperature ?? 36.8,
            sleep_hours: (typeof cachedWellness !== "undefined" && cachedWellness[0]?.sleep_hours) ? cachedWellness[0].sleep_hours : 7.4,
            radiation_level: latest.radiation_level ?? 0.35,
            cabin_co2: latest.cabin_co2 ?? 0.04,
            comm_delay: latest.comm_delay ?? cfg.defaultDelay
        };
        const risk = computeLocalRisk(telemetry);
        applyRiskToUI(risk, telemetry);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    setMissionEnvironment(currentMissionEnv);

    document.getElementById("missionEnvironmentSelect")?.addEventListener("change", (e) => {
        setMissionEnvironment(e.target.value);
    });

    document.getElementById("settingsEnvironmentSelect")?.addEventListener("change", (e) => {
        setMissionEnvironment(e.target.value);
    });
});

// ================================
// REAL-TIME RISK ENGINE & UI UPDATER
// ================================
function computeLocalRisk(telemetry) {
    const envCfg = getActiveEnvironmentConfig();
    const hr   = Number(telemetry.heart_rate ?? 72);
    const spo2 = Number(telemetry.spo2 ?? 98);
    const slp  = Number(telemetry.sleep_hours ?? 7.4);
    const rad  = Number(telemetry.radiation_level ?? 0.35);
    const co2  = Number(telemetry.cabin_co2 ?? 0.04);
    const temp = Number(telemetry.temperature ?? 36.8);
    const delay = Number(telemetry.comm_delay ?? envCfg.defaultDelay);

    let code = 0;
    const triggers = [];
    const actions = [];

    // 1. Evaluate Severity Code
    if (
        hr >= 115 || hr <= 45 ||
        spo2 < 90 ||
        rad >= envCfg.radCrit ||
        co2 >= 1.0 ||
        temp >= 38.5 ||
        (hr >= 105 && slp <= 4.0 && rad >= envCfg.radWarn)
    ) {
        code = 2;
    } else if (
        hr >= 95 || hr <= 52 ||
        spo2 < 94 ||
        slp < 5.5 ||
        rad >= envCfg.radWarn ||
        co2 >= 0.5 ||
        temp >= 37.6
    ) {
        code = 1;
    }

    // 2. Build Indicator-Specific Triggers & NASA OCHMO Actions
    if (spo2 < 90) {
        triggers.push(`Critical Hypoxia: SpO2 ${spo2}%`);
        actions.push(`Administer 100% supplemental oxygen via emergency mask immediately and verify cabin O2 partial pressure (SpO2: ${spo2}%).`);
    } else if (spo2 < 94) {
        triggers.push(`Low Oxygen: SpO2 ${spo2}%`);
        actions.push(`Check pulse oximeter placement, take deep controlled breaths, and verify cabin O2 generation loop (SpO2: ${spo2}%).`);
    }

    if (co2 >= 1.0) {
        triggers.push(`Severe Hypercapnia Risk: CO2 ${co2}%`);
        actions.push(`Switch ECLSS CO2 scrubbers to high-rate mode, activate local airflow fans to disperse CO2 pockets, and relocate crew member (CO2: ${co2}%).`);
    } else if (co2 >= 0.5) {
        triggers.push(`Elevated Cabin CO2 ${co2}%`);
        actions.push(`Increase module air circulation and inspect CDRA/scrubber beds per OCHMO-TB-004 protocol (CO2: ${co2}%).`);
    }

    if (hr >= 115) {
        triggers.push(`Tachycardia: HR ${hr} bpm`);
        actions.push(`Cease physical exertion immediately, place crew member in resting posture, record 12-lead ECG, and assess for chest pain or dehydration (HR: ${hr} bpm).`);
    } else if (hr >= 95) {
        triggers.push(`Elevated Heart Rate ${hr} bpm`);
        actions.push(`Pause strenuous tasks for 15 minutes, hydrate with 500 ml electrolyte solution, and re-measure resting pulse (HR: ${hr} bpm).`);
    } else if (hr <= 45) {
        triggers.push(`Severe Bradycardia: HR ${hr} bpm`);
        actions.push(`Evaluate consciousness and blood pressure immediately; prepare cardiac monitoring from the onboard medical kit (HR: ${hr} bpm).`);
    } else if (hr <= 52) {
        triggers.push(`Low Heart Rate ${hr} bpm`);
        actions.push(`Verify resting baseline and check for dizziness or orthostatic symptoms before standing/EVA tasks (HR: ${hr} bpm).`);
    }

    if (temp >= 38.5) {
        triggers.push(`High Fever: Temp ${temp}°C`);
        actions.push(`Initiate crew isolation protocol, administer antipyretic from medical kit, maintain fluid intake, and screen for latent viral reactivation (Temp: ${temp}°C).`);
    } else if (temp >= 37.6) {
        triggers.push(`Elevated Temp ${temp}°C`);
        actions.push(`Monitor core temperature every 2 hours, increase hydration, and limit close crew contact until afebrile (Temp: ${temp}°C).`);
    }

    if (rad >= envCfg.radCrit) {
        triggers.push(`Radiation Spike ${rad} mSv/d (${envCfg.label})`);
        actions.push(
            currentMissionEnv === "lunar"
                ? `Abort lunar surface EVA immediately and retreat inside the regolith-shielded habitat per OCHMO-TB-020 (Radiation: ${rad} mSv/d).`
                : `Abort EVA operations immediately and relocate crew to the high-density storm shelter per OCHMO-TB-020 (Radiation: ${rad} mSv/d).`
        );
    } else if (rad >= envCfg.radWarn) {
        triggers.push(`Elevated Radiation ${rad} mSv/d (${envCfg.label})`);
        actions.push(`Defer non-essential EVA tasks, verify wearable dosimeter logs, and maximize time in shielded crew quarters (Radiation: ${rad} mSv/d).`);
    }

    if (slp < 5.5) {
        triggers.push(`Sleep Deficit ${slp}h`);
        actions.push(`Enforce a protected 8-hour recovery sleep block, reduce blue-spectrum cabin lighting prior to rest, and defer high-risk operations (Sleep: ${slp}h).`);
    }

    if (code >= 1 && delay >= 4.0) {
        actions.push(`Earth comm delay is ${delay} min — execute onboard autonomous protocol locally and queue telemetry packet for downlink.`);
    }

    if (code === 2) {
        return {
            status_code: 2,
            status_label: "Critical",
            indicator_color: "red",
            triggers,
            actions: actions.length > 0 ? actions : ["Critical threshold exceeded. Initiate immediate onboard medical stabilization."]
        };
    }
    if (code === 1) {
        return {
            status_code: 1,
            status_label: "Warning",
            indicator_color: "yellow",
            triggers,
            actions: actions.length > 0 ? actions : ["Telemetry outside nominal range. Apply corrective action and re-evaluate."]
        };
    }
    return {
        status_code: 0,
        status_label: "Normal",
        indicator_color: "green",
        triggers: [],
        actions: [`All telemetry nominal in ${envCfg.label}. ${envCfg.autonomousNote}`]
    };
}

function applyRiskToUI(risk, telemetry = null) {
    if (!risk) return;
    const code = Number(risk.status_code ?? 0);

    const palette = {
        0: {
            bg: "rgba(34, 197, 139, 0.10)",
            border: "rgba(34, 197, 139, 0.40)",
            badgeBg: "rgba(34, 197, 139, 0.20)",
            color: "#22c58b",
            badgeText: "NORMAL · GREEN",
            icon: "fa-circle-check"
        },
        1: {
            bg: "rgba(245, 174, 66, 0.12)",
            border: "rgba(245, 174, 66, 0.45)",
            badgeBg: "rgba(245, 174, 66, 0.22)",
            color: "#f5ae42",
            badgeText: "WARNING · YELLOW",
            icon: "fa-triangle-exclamation"
        },
        2: {
            bg: "rgba(240, 100, 100, 0.15)",
            border: "rgba(240, 100, 100, 0.55)",
            badgeBg: "rgba(240, 100, 100, 0.25)",
            color: "#f06464",
            badgeText: "CRITICAL · RED",
            icon: "fa-radiation"
        }
    }[code] || {
        bg: "rgba(34, 197, 139, 0.10)",
        border: "rgba(34, 197, 139, 0.40)",
        badgeBg: "rgba(34, 197, 139, 0.20)",
        color: "#22c58b",
        badgeText: "NORMAL · GREEN",
        icon: "fa-circle-check"
    };

    const actions = Array.isArray(risk.actions) && risk.actions.length > 0
        ? risk.actions
        : ["All telemetry nominal. Continue scheduled flight tasks."];

    const triggerSummary = (risk.triggers && risk.triggers.length > 0)
        ? `Flagged indicators: ${risk.triggers.join(" • ")}`
        : "All vital signs and spacecraft cabin parameters are within safe thresholds.";

    // 1. Live Diagnostic Card in Daily Health Check
    const diagCard = document.getElementById("liveDiagnosticCard");
    if (diagCard) {
        diagCard.style.background = palette.bg;
        diagCard.style.borderColor = palette.border;
        const iconEl = document.getElementById("liveDiagIcon");
        if (iconEl) {
            iconEl.className = `fa-solid ${palette.icon}`;
            iconEl.style.color = palette.color;
        }
        const titleEl = document.getElementById("liveDiagTitle");
        if (titleEl) titleEl.textContent = `Diagnostic Status: ${risk.status_label}`;
        const badgeEl = document.getElementById("liveDiagBadge");
        if (badgeEl) {
            badgeEl.textContent = palette.badgeText;
            badgeEl.style.background = palette.badgeBg;
            badgeEl.style.color = palette.color;
        }
        const subEl = document.getElementById("liveDiagSubtitle");
        if (subEl) subEl.textContent = triggerSummary;
        const listEl = document.getElementById("liveProtocolList");
        if (listEl) {
            listEl.innerHTML = actions.map(a => `<li>${a}</li>`).join("");
        }
    }

    // 2. Overview Risk Status Banner
    const ovCard = document.getElementById("overviewRiskCard");
    if (ovCard) {
        ovCard.style.background = palette.bg;
        ovCard.style.borderColor = palette.border;
        const ovIcon = document.getElementById("overviewRiskIcon");
        if (ovIcon) {
            ovIcon.style.background = palette.badgeBg;
            ovIcon.style.color = palette.color;
            ovIcon.innerHTML = `<i class="fa-solid ${palette.icon}"></i>`;
        }
        const ovBadge = document.getElementById("overviewRiskBadge");
        if (ovBadge) {
            ovBadge.textContent = risk.status_label.toUpperCase();
            ovBadge.style.background = palette.badgeBg;
            ovBadge.style.color = palette.color;
        }
        const ovHead = document.getElementById("overviewRiskHeadline");
        if (ovHead) {
            ovHead.textContent = code === 2
                ? "Compound Hazard Alert — Immediate Autonomous Protocol Active"
                : (code === 1 ? "Telemetry Warning — Corrective Action Recommended" : "All telemetry nominal. Continue scheduled flight tasks.");
        }
        const ovList = document.getElementById("overviewProtocolList");
        if (ovList) {
            ovList.innerHTML = actions.map(a => `<li>${a}</li>`).join("");
        }
    }

    if (telemetry) {
        if (telemetry.spo2 != null && document.getElementById("ovSpo2")) {
            document.getElementById("ovSpo2").textContent = `${Number(telemetry.spo2)}%`;
        }
        if (telemetry.radiation_level != null && document.getElementById("ovRad")) {
            document.getElementById("ovRad").textContent = `${Number(telemetry.radiation_level)} mSv/d`;
        }
        if (telemetry.cabin_co2 != null && document.getElementById("ovCo2")) {
            document.getElementById("ovCo2").textContent = `${Number(telemetry.cabin_co2)}%`;
        }
        if (telemetry.comm_delay != null && document.getElementById("ovDelay")) {
            document.getElementById("ovDelay").textContent = `${Number(telemetry.comm_delay)} min`;
        }
    }
}

function resetDiagnosticCardToNeutral() {
    const diagCard = document.getElementById("liveDiagnosticCard");
    if (!diagCard) return;
    diagCard.style.background = "var(--bg-card)";
    diagCard.style.borderColor = "var(--border-color)";
    const iconEl = document.getElementById("liveDiagIcon");
    if (iconEl) {
        iconEl.className = "fa-solid fa-satellite-dish";
        iconEl.style.color = "var(--primary)";
    }
    const titleEl = document.getElementById("liveDiagTitle");
    if (titleEl) titleEl.textContent = "Diagnostic Status: Awaiting Input";
    const badgeEl = document.getElementById("liveDiagBadge");
    if (badgeEl) {
        badgeEl.textContent = "PENDING DATA";
        badgeEl.style.background = "rgba(54, 214, 231, 0.15)";
        badgeEl.style.color = "var(--primary)";
    }
    const subEl = document.getElementById("liveDiagSubtitle");
    if (subEl) subEl.textContent = "Enter vital signs and cabin environment readings below to trigger live risk evaluation.";
    const listEl = document.getElementById("liveProtocolList");
    if (listEl) listEl.innerHTML = "<li>Awaiting telemetry measurements...</li>";
}

function readStep1Telemetry() {
    const pane1 = document.getElementById("stepPane1");
    const envCfg = getActiveEnvironmentConfig();
    if (!pane1) return {};
    const num = (field, fallback) => {
        const raw = pane1.querySelector(`[data-daily-field="${field}"]`)?.value?.trim();
        return raw !== "" && raw !== undefined && !isNaN(Number(raw)) ? Number(raw) : fallback;
    };
    return {
        heart_rate: num("heart_rate", 72),
        spo2: num("spo2", 98),
        temperature: num("temperature", 36.8),
        sleep_hours: num("sleep_hours", 7.4),
        radiation_level: num("radiation_level", 0.35),
        cabin_co2: num("cabin_co2", 0.04),
        comm_delay: num("comm_delay", envCfg.defaultDelay)
    };
}

document.getElementById("stepPane1")?.addEventListener("input", () => {
    const pane1 = document.getElementById("stepPane1");
    const inputs = pane1 ? Array.from(pane1.querySelectorAll('input[type="number"]')) : [];
    const hasAnyValue = inputs.some(inp => inp.value.trim() !== "");

    if (!hasAnyValue) {
        resetDiagnosticCardToNeutral();
        return;
    }

    const t = readStep1Telemetry();
    const risk = computeLocalRisk(t);
    applyRiskToUI(risk, t);
});