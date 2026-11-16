<!-- SETTINGS PAGE CONTENT -->
<section class="page-section" id="settings">
    <div class="settings-header-area">
        <span class="sub-category-tag">SETTINGS & PROFILE</span>
        <h1>Mission preferences</h1>
        <p>Manage local prototype settings, accessibility, and illustrative device status.</p>
    </div>

    <div class="settings-profile-card">
        <div class="profile-info-left">
            <div class="profile-avatar-large">EC</div>
            <div class="profile-text-details">
                <h3>Commander Elena Cruz</h3>
                <p>Flight Engineer · Crew 04</p>
                <span class="mission-badge">Lunar Exploration Mission</span>
            </div>
        </div>
        <button class="edit-profile-btn">Edit profile</button>
    </div>

    <div class="settings-grid-container" style="display: flex;">
        <div class="settings-row-grid" style="display: grid;">
            <div class="settings-card">
                <h3>Measurement preferences</h3>
                <p class="card-desc">Changes apply to visible prototype values.</p>
                <div class="setting-item-group">
                    <div class="setting-label-text">
                        <strong>Unit system</strong>
                        <span>Choose how measurements are displayed. Values are never silently converted.</span>
                    </div>
                    <div class="setting-control">
                        <select class="standard-select">
                            <option value="Mission standard">Mission standard</option>
                            <option value="Metric">Metric</option>
                            <option value="Imperial">Imperial</option>
                        </select>
                    </div>
                </div>
            </div>

            <div class="settings-card">
                <h3>Accessibility</h3>
                <p class="card-desc">Adjust the interface for your needs.</p>
                <div class="setting-toggle-row">
                    <div class="setting-label-text">
                        <strong>Larger interface text</strong>
                        <span>Increase supporting and body text size.</span>
                    </div>
                    <label class="switch-toggle">
                        <input type="checkbox">
                        <span class="slider"></span>
                    </label>
                </div>
                <div class="setting-toggle-row">
                    <div class="setting-label-text">
                        <strong>Reduce motion</strong>
                        <span>Minimize non-essential transitions.</span>
                    </div>
                    <label class="switch-toggle">
                        <input type="checkbox">
                        <span class="slider"></span>
                    </label>
                </div>
            </div>
        </div>

        <div class="settings-row-grid" style="display: grid;">
            <div class="settings-card">
                <h3>Notifications</h3>
                <p class="card-desc">Visible reminders within this prototype only.</p>
                <div class="setting-toggle-row">
                    <div class="setting-label-text">
                        <strong>Routine reminders</strong>
                        <span>Show scheduled task reminders while CREWCARE is open.</span>
                    </div>
                    <label class="switch-toggle">
                        <input type="checkbox" checked>
                        <span class="slider"></span>
                    </label>
                </div>
                <div class="setting-toggle-row">
                    <div class="setting-label-text">
                        <strong>Review alerts</strong>
                        <span>Show a badge for new simulated review items.</span>
                    </div>
                    <label class="switch-toggle">
                        <input type="checkbox" checked>
                        <span class="slider"></span>
                    </label>
                </div>
            </div>

            <div class="settings-card">
                <h3>Data & connectivity</h3>
                <p class="card-desc">No real medical transmission is configured</p>
            </div>
        </div>
    </div>
</section>