<!-- ALERTS & ACTIONS PAGE CONTENT -->
<section class="page-section" id="alerts">
    <div class="alerts-header-area">
        <div class="alerts-title-area">
            <span class="sub-category-tag">ALERTS & ACTIONS</span>
            <h1>Items that need your attention</h1>
            <p>Simulated workflow alerts explain what was flagged and the appropriate next step.</p>
        </div>
        <div class="open-items-badge">
            <i class="fa-solid fa-circle"></i> 1 open items
        </div>
    </div>

    <div class="alerts-main-grid">
        <div class="alerts-list-column">
            <!-- Populated dynamically from database -->
        </div>

        <div class="medical-summary-card">
            <div class="summary-card-icon">
                <i class="fa-solid fa-file-medical"></i>
            </div>
            <h3>Medical communication summary</h3>
            <p>Compile selected demo readings, symptoms, and timestamps for a concise review.</p>
            <div class="summary-checkboxes">
                <label class="checkbox-row">
                    <input type="checkbox" checked> Latest measurements
                </label>
                <label class="checkbox-row">
                    <input type="checkbox" checked> Reported symptoms
                </label>
                <label class="checkbox-row">
                    <input type="checkbox" checked> Open alerts
                </label>
                <label class="checkbox-row">
                    <input type="checkbox"> Assessment notes
                </label>
            </div>
            <button class="prepare-summary-btn">
                <i class="fa-solid fa-arrow-up-right-from-square"></i> Prepare summary
            </button>
            <div class="summary-footer-note">
                <p>This prototype does not send data or contact a medical team.</p>
                <small>Not a substitute for professional medical evaluation or official mission procedures.</small>
            </div>
        </div>
    </div>
</section>