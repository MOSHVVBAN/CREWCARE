// ================================
// CREWCARE PAGE NAVIGATION & ROUTING
// ================================
const pageNames = {
    overview: "Overview",
    "daily-check": "Daily Health Check",
    analytics: "Health Analytics",
    "body-map": "Human Body Map",
    alerts: "Alerts & Actions",
    wellness: "Sleep & Mental Wellness",
    guide: "Space Health Guide",
    routine: "Mission Routine",
    settings: "Settings"
};

function showPage(pageId) {
    const requestedPage = document.getElementById(pageId);
    if (!requestedPage || !requestedPage.classList.contains("page-section")) return;

    document.querySelectorAll(".page-section").forEach((page) => page.classList.remove("active"));
    requestedPage.classList.add("active");

    document.querySelectorAll(".menu-link").forEach((link) => {
        const linkPage = link.getAttribute("href")?.slice(1);
        link.classList.toggle("active", linkPage === pageId);
    });

    const breadcrumb = document.querySelector(".breadcrumb");
    if (breadcrumb) {
        breadcrumb.innerHTML = `CrewCare <i class="fa-solid fa-chevron-right"></i> ${pageNames[pageId] || "Overview"}`;
    }

    document.getElementById("sidebar")?.classList.remove("show");
    window.scrollTo({ top: 0, behavior: "smooth" });
}

document.addEventListener("click", (event) => {
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;
    const pageId = link.getAttribute("href").slice(1);
    if (document.getElementById(pageId)?.classList.contains("page-section")) {
        event.preventDefault();
        showPage(pageId);
    } else if (link.getAttribute("href") === "#") {
        event.preventDefault();
    }
});

document.getElementById("startCheck")?.addEventListener("click", () => showPage("daily-check"));
document.getElementById("notificationBtn")?.addEventListener("click", () => showPage("alerts"));

document.querySelectorAll(".action-button[data-action]").forEach((button) => {
    button.addEventListener("click", () => {
        const destinations = { check: "daily-check", alerts: "alerts", body: "body-map" };
        const action = button.dataset.action;
        if (destinations[action]) showPage(destinations[action]);
        else if (action === "measurement") document.getElementById("modalOverlay")?.classList.add("active");
    });
});

document.getElementById("mobileMenu")?.addEventListener("click", () => {
    document.getElementById("sidebar")?.classList.toggle("show");
});

document.getElementById("closeBanner")?.addEventListener("click", () => {
    document.querySelector(".demo-banner")?.remove();
});

document.getElementById("modalClose")?.addEventListener("click", () => {
    document.getElementById("modalOverlay")?.classList.remove("active");
});

document.getElementById("modalOverlay")?.addEventListener("click", (event) => {
    if (event.target.id === "modalOverlay") event.currentTarget.classList.remove("active");
});

document.querySelector(".record-new-btn")?.addEventListener("click", () => {
    document.getElementById("modalOverlay")?.classList.add("active");
});

// ================================
// DYNAMIC HEALTH CHARTS (Chart.js)
// ================================
let healthChart = null;
let detailedHealthChart = null;
let wellnessTrendChart = null;

function initCharts() {
    const ctxOverview = document.getElementById("healthChart");
    if (ctxOverview && typeof Chart !== "undefined") {
        healthChart = new Chart(ctxOverview, {
            type: "line",
            data: {
                labels: ["No Data"],
                datasets: [{
                    label: "Heart Rate",
                    data: [0],
                    borderColor: "#36D6E7",
                    backgroundColor: "rgba(54, 214, 231, 0.10)",
                    borderWidth: 2.5,
                    tension: 0.4,
                    fill: true,
                    pointRadius: 3,
                    pointHoverRadius: 6,
                    pointBackgroundColor: "#36D6E7"
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { grid: { display: false }, ticks: { color: "#94A3B8" }, border: { display: false } },
                    y: { grid: { color: "rgba(148, 163, 184, 0.10)" }, ticks: { color: "#94A3B8" }, border: { display: false } }
                }
            }
        });
    }

    const ctxDetailed = document.getElementById("detailedHealthChart");
    if (ctxDetailed && typeof Chart !== "undefined") {
        detailedHealthChart = new Chart(ctxDetailed, {
            type: "line",
            data: {
                labels: [],
                datasets: [{
                    label: "Readings",
                    data: [],
                    borderColor: "#38bdf8",
                    backgroundColor: "rgba(56, 189, 248, 0.10)",
                    borderWidth: 2.5,
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { grid: { display: false }, ticks: { color: "#94A3B8" } },
                    y: { grid: { color: "rgba(148, 163, 184, 0.10)" }, ticks: { color: "#94A3B8" } }
                }
            }
        });
    }

    const ctxWellness = document.getElementById("wellnessTrendChart");
    if (ctxWellness && typeof Chart !== "undefined") {
        wellnessTrendChart = new Chart(ctxWellness, {
            type: "bar",
            data: {
                labels: [],
                datasets: [{
                    label: "Sleep Hours",
                    data: [],
                    backgroundColor: "rgba(54, 214, 231, 0.85)",
                    hoverBackgroundColor: "#36D6E7",
                    borderRadius: 8,
                    maxBarThickness: 38,
                    barPercentage: 0.45,
                    categoryPercentage: 0.6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { grid: { display: false }, ticks: { color: "#94A3B8" }, border: { display: false } },
                    y: { beginAtZero: true, grid: { color: "rgba(148, 163, 184, 0.10)" }, ticks: { color: "#94A3B8" }, border: { display: false } }
                }
            }
        });
    
    }
}
// ================================
// OVERVIEW METRIC CARDS NAVIGATION
// ================================
document.querySelectorAll(".health-cards .health-card").forEach((card, index) => {
    card.style.cursor = "pointer";
    card.addEventListener("click", () => {
        if (index === 0) {
            showPage("analytics");
            document.querySelectorAll("#analytics .analytics-tab").forEach(t => {
                if (t.textContent.trim() === "Heart Rate") t.click();
            });
        } else if (index === 1) {
            showPage("daily-check");
        } else if (index === 2) {
            showPage("analytics");
            document.querySelectorAll("#analytics .analytics-tab").forEach(t => {
                if (t.textContent.trim() === "Temperature") t.click();
            });
        } else if (index === 3) {
            showPage("guide");
        } else if (index === 4) {
            showPage("wellness");
        } else if (index === 5) {
            showPage("daily-check");
        }
    });
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