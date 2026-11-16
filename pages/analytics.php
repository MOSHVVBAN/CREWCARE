<!-- HEALTH ANALYTICS PAGE CONTENT -->
<section class="page-section" id="analytics">
    <div class="analytics-header-area">
        <div class="analytics-title-area">
            <span class="sub-category-tag">HEALTH ANALYTICS</span>
            <h1>Measurement history</h1>
            <p>Explore simulated entries, source information, and personal trends.</p>
        </div>
        <button class="record-new-btn">
            <i class="fa-solid fa-plus"></i> Record New Measurement
        </button>
    </div>

    <div class="analytics-tabs">
        <button class="analytics-tab active">Heart Rate</button>
        <button class="analytics-tab">Blood Pressure</button>
        <button class="analytics-tab">Temperature</button>
        <button class="analytics-tab">Blood Glucose</button>
        <button class="analytics-tab">Sleep</button>
    </div>

    <div class="analytics-main-grid">
        <div class="analytics-chart-card">
            <div class="chart-card-header">
                <div>
                    <h3>Heart Rate</h3>
                    <p>Beats per minute (bpm)</p>
                </div>
                <div class="time-range-toggle">
                    <button class="range-btn active">7 days</button>
                    <button class="range-btn">30 days</button>
                </div>
            </div>
            <div class="metric-big-value">
                <h2>72 <small>bpm</small></h2>
                <span class="latest-recorded-badge">Latest recorded</span>
            </div>
            <div class="baseline-info">
                <span><i class="fa-solid fa-chart-line"></i> Personal baseline: 70-74 bpm</span>
                <small>Based on 21 simulated entries</small>
            </div>
            <div class="chart-wrapper">
                <canvas id="detailedHealthChart"></canvas>
            </div>
            <div class="chart-legend">
                <span><i class="fa-solid fa-minus" style="color: #38bdf8;"></i> Manually entered</span>
                <span><i class="fa-solid fa-minus" style="color: #64748b;"></i> Personal baseline</span>
                <span><i class="fa-solid fa-minus" style="color: #f43f5e;"></i> Missing data</span>
            </div>
        </div>

        <div class="latest-entry-card">
            <div class="entry-card-icon">
                <i class="fa-solid fa-heart-pulse"></i>
            </div>
            <h3>Latest entry</h3>
            <div class="entry-detail-row">
                <span class="label">Recorded</span>
                <span class="value">Today, 08:10</span>
            </div>
            <div class="entry-detail-row">
                <span class="label">Source</span>
                <span class="value">Manual entry</span>
            </div>
            <div class="entry-detail-row">
                <span class="label">Context</span>
                <span class="value">Morning health check</span>
            </div>
            <div class="entry-detail-row">
                <span class="label">Notes</span>
                <span class="value">No notes added</span>
            </div>
            <button class="learn-more-btn">
                Learn about this indicator
            </button>
        </div>
    </div>

    <div class="measurement-history-section">
        <h3>Measurement history</h3>
        <p class="table-subtitle">Simulated data · most recent first</p>
        <div class="history-table-wrapper">
            <table class="history-table">
                <thead>
                    <tr>
                        <th>DATE & TIME</th>
                        <th>VALUE</th>
                        <th>SOURCE</th>
                        <th>CONTEXT</th>
                        <th>STATUS</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Today, 08:10</td>
                        <td>72 bpm</td>
                        <td>Manual entry</td>
                        <td>Morning check</td>
                        <td><span class="status-recorded">Recorded</span></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</section>