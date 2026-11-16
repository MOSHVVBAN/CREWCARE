<!-- HUMAN BODY MAP PAGE CONTENT -->
<section class="page-section" id="body-map">
    <!-- PAGE HEADER -->
    <div class="body-map-header-area">
        <span class="sub-category-tag">HUMAN BODY MAP</span>
        <h1>Explore spaceflight health systems</h1>
        <p>Select a body system to view general educational information and related monitoring indicators.</p>
    </div>

    <!-- EDUCATIONAL VIEW BANNER -->
    <div class="educational-banner">
        <i class="fa-solid fa-book-open"></i>
        <span><strong>Educational view</strong> This information is general and is not based on your personal measurements.</span>
    </div>

    <!-- MAIN INTERACTIVE SECTION -->
    <div class="body-map-content-grid">
        <!-- LEFT SYSTEMS LIST (ANATOMICAL ORDER: HEAD TO WHOLE BODY) -->
        <div class="systems-list-column">
            <button class="system-item-btn" data-system="brain">
                <i class="fa-solid fa-brain"></i>
                <span>Brain & behavioral health</span>
                <i class="fa-solid fa-chevron-right"></i>
            </button>
            <button class="system-item-btn active" data-system="cardiovascular">
                <i class="fa-solid fa-heart-pulse"></i>
                <span>Cardiovascular</span>
                <i class="fa-solid fa-chevron-right"></i>
            </button>
            <button class="system-item-btn" data-system="immune">
                <i class="fa-solid fa-shield-virus"></i>
                <span>Immune system</span>
                <i class="fa-solid fa-chevron-right"></i>
            </button>
            <button class="system-item-btn" data-system="musculoskeletal">
                <i class="fa-solid fa-person-running"></i>
                <span>Musculoskeletal</span>
                <i class="fa-solid fa-chevron-right"></i>
            </button>
            <button class="system-item-btn" data-system="nutrition">
                <i class="fa-solid fa-droplet"></i>
                <span>Nutrition & whole body</span>
                <i class="fa-solid fa-chevron-right"></i>
            </button>
        </div>

        <!-- CENTER BODY GRAPHIC (MEDICAL HOLOGRAM SVG) -->
        <div class="body-graphic-column">
            <div class="body-silhouette-svg" style="position: relative; width: 200px; height: 340px; display: flex; align-items: center; justify-content: center;">
                <svg viewBox="0 0 200 360" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient id="bodyGrad" x1="100" y1="10" x2="100" y2="350" gradientUnits="userSpaceOnUse">
                            <stop offset="0%" stop-color="#36d6e7" stop-opacity="0.28"/>
                            <stop offset="50%" stop-color="#36d6e7" stop-opacity="0.12"/>
                            <stop offset="100%" stop-color="#36d6e7" stop-opacity="0.04"/>
                        </linearGradient>
                    </defs>
                    <!-- Head & Neck -->
                    <path d="M100 14C86 14 77 24 77 38C77 50 84 60 91 63V72L72 79C60 83 53 94 50 108L38 172C36 180 41 186 47 186C52 186 56 182 58 175L68 122L71 182L64 334C64 342 69 348 76 348C83 348 88 342 89 334L98 212H102L111 334C112 342 117 348 124 348C131 348 136 342 136 334L129 182L132 122L142 175C144 182 148 186 153 186C159 186 164 180 162 172L150 108C147 94 140 83 128 79L109 72V63C116 60 123 50 123 38C123 24 114 14 100 14Z"
                          fill="url(#bodyGrad)" stroke="#36d6e7" stroke-opacity="0.55" stroke-width="1.8" stroke-linejoin="round"/>
                    <!-- Subtle Anatomical Grid Lines -->
                    <line x1="100" y1="74" x2="100" y2="205" stroke="#36d6e7" stroke-opacity="0.2" stroke-dasharray="3 3"/>
                    <ellipse cx="100" cy="115" rx="24" ry="14" stroke="#36d6e7" stroke-opacity="0.18"/>
                </svg>

                <!-- Glowing Organ Indicator -->
                <div class="glowing-organ-indicator" id="organIndicator" style="top: 32%; left: 54%;">
                    <i class="fa-solid fa-heart-pulse"></i>
                </div>
            </div>
            <div class="selected-system-label-tag">
                <span id="selectedSystemLabel">Selected: Cardiovascular</span>
            </div>
        </div>

        <!-- RIGHT SIDEBAR (SELECTED SYSTEM DETAILS) -->
        <div class="selected-system-card">
            <div class="system-card-icon">
                <i class="fa-solid fa-heart-pulse"></i>
            </div>
            <span class="selected-system-eyebrow">SELECTED SYSTEM</span>
            <h3>Cardiovascular</h3>
            <div class="info-block">
                <h4>Primary function</h4>
                <p>Moves oxygen and nutrients through the body.</p>
            </div>
            <div class="info-block">
                <h4>Relevant spaceflight factor</h4>
                <p>Altered gravity can change fluid distribution and cardiovascular workload.</p>
            </div>
            <div class="info-block">
                <h4>Possible effects</h4>
                <p>Crew may notice changes in exercise tolerance or postural response.</p>
            </div>
            <div class="indicators-section">
                <h4>Useful monitoring indicators</h4>
                <div class="indicator-link-row">
                    <span>Heart rate</span>
                    <i class="fa-solid fa-chevron-right"></i>
                </div>
                <div class="indicator-link-row">
                    <span>Blood pressure</span>
                    <i class="fa-solid fa-chevron-right"></i>
                </div>
                <div class="indicator-link-row">
                    <span>Exercise recovery</span>
                    <i class="fa-solid fa-chevron-right"></i>
                </div>
            </div>
            <button class="open-guide-btn" onclick="showPage('guide')">
                <i class="fa-solid fa-book-open"></i> Open related health guide
            </button>
        </div>
    </div>
</section>