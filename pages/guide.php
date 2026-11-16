<!-- SPACE HEALTH GUIDE PAGE CONTENT -->
<section class="page-section" id="guide">
    <!-- PAGE HEADER -->
    <div class="guide-header-area">
        <span class="sub-category-tag">SPACE HEALTH GUIDE</span>
        <h1>Mission health library</h1>
        <p>Concise, sourced education about human health and the spaceflight environment.</p>
    </div>

    <!-- SEARCH BAR & FILTER BUTTONS -->
    <div class="guide-search-filter-section">
        <div class="guide-search-box">
            <i class="fa-solid fa-magnifying-glass"></i>
            <input type="text" id="guideSearchInput" placeholder="Search hazards, body systems, or indicators">
        </div>
        <div class="guide-filter-tabs">
            <button class="filter-btn active" data-filter="all">All topics</button>
            <button class="filter-btn" data-filter="environment">Environment</button>
            <button class="filter-btn" data-filter="behavioral">Behavioral health</button>
            <button class="filter-btn" data-filter="physical">Physical health</button>
        </div>
    </div>

    <!-- FOUNDATIONAL READING BANNER CARD -->
    <a href="https://www.nasa.gov/hrp/hazards/" target="_blank" rel="noopener noreferrer" class="foundational-reading-card" style="display: flex; color: inherit; cursor: pointer;">
        <div class="foundational-content">
            <span class="foundational-tag">FOUNDATIONAL READING · NASA HRP</span>
            <h2>Five hazards of human spaceflight</h2>
            <p>Explore the major categories used by NASA's Human Research Program to communicate spaceflight health risks.</p>
        </div>
        <div class="foundational-icon">
            <i class="fa-solid fa-arrow-up-right-from-square"></i>
        </div>
    </a>

    <!-- GUIDE TOPICS GRID -->
    <div class="guide-topics-grid">
        <!-- Topic 1: Space Radiation (CSA + NASA HRP) -->
        <div class="guide-topic-card" data-category="environment">
            <div class="topic-card-top">
                <div class="topic-icon-wrapper environment">
                    <i class="fa-solid fa-radiation"></i>
                </div>
                <span class="topic-category-tag">ENVIRONMENT · CSA / NASA</span>
            </div>
            <h3>Space Radiation</h3>
            <p>How ionizing and neutron radiation beyond Earth's protection affect biological and immune systems.</p>
            <div class="topic-tags-row">
                <span class="mini-tag">radiation</span>
                <span class="mini-tag">immune</span>
                <span class="mini-tag">CSA CANS</span>
            </div>
            <a href="https://www.nasa.gov/wp-content/uploads/2023/12/ochmo-tb-020-radiation-protection.pdf" target="_blank" rel="noopener noreferrer" class="read-overview-link">Read official CSA source <i class="fa-solid fa-arrow-up-right-from-square"></i></a>
        </div>

        <!-- Topic 2: Isolation & Confinement -->
        <div class="guide-topic-card" data-category="behavioral">
            <div class="topic-card-top">
                <div class="topic-icon-wrapper behavioral">
                    <i class="fa-solid fa-users"></i>
                </div>
                <span class="topic-category-tag">BEHAVIORAL HEALTH · NASA HRP</span>
            </div>
            <h3>Isolation & Confinement</h3>
            <p>How long-duration isolation, workload, and limited privacy can influence crew wellbeing.</p>
            <div class="topic-tags-row">
                <span class="mini-tag">mood</span>
                <span class="mini-tag">sleep</span>
            </div>
            <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC8295322/" target="_blank" rel="noopener noreferrer" class="read-overview-link">Read NASA 5 Hazards <i class="fa-solid fa-arrow-up-right-from-square"></i></a>
        </div>

        <!-- Topic 3: Distance from Earth -->
        <div class="guide-topic-card" data-category="environment">
            <div class="topic-card-top">
                <div class="topic-icon-wrapper operations">
                    <i class="fa-solid fa-signal"></i>
                </div>
                <span class="topic-category-tag">MISSION OPERATIONS · NASA HRP</span>
            </div>
            <h3>Distance from Earth</h3>
            <p>How communication delays and autonomous medical decision-making shape distant missions.</p>
            <div class="topic-tags-row">
                <span class="mini-tag">communication</span>
                <span class="mini-tag">protocol</span>
            </div>
            <a href="https://www.nasa.gov/reference/4-0-human-performance/" target="_blank" rel="noopener noreferrer" class="read-overview-link">Read NASA HRP Research <i class="fa-solid fa-arrow-up-right-from-square"></i></a>
        </div>

        <!-- Topic 4: Gravity Fields -->
        <div class="guide-topic-card" data-category="physical">
            <div class="topic-card-top">
                <div class="topic-icon-wrapper physical">
                    <i class="fa-solid fa-heart-pulse"></i>
                </div>
                <span class="topic-category-tag">PHYSICAL HEALTH · NASA HRP</span>
            </div>
            <h3>Gravity Fields</h3>
            <p>How changing gravity environments affect cardiovascular workload, SANS, bone, and muscle.</p>
            <div class="topic-tags-row">
                <span class="mini-tag">cardiovascular</span>
                <span class="mini-tag">SANS</span>
            </div>
            <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC12575774/" target="_blank" rel="noopener noreferrer" class="read-overview-link">Read NASA HRP Risks <i class="fa-solid fa-arrow-up-right-from-square"></i></a>
        </div>

        <!-- Topic 5: Hostile Closed Environments -->
        <div class="guide-topic-card" data-category="environment">
            <div class="topic-card-top">
                <div class="topic-icon-wrapper environment">
                    <i class="fa-solid fa-shield-halved"></i>
                </div>
                <span class="topic-category-tag">ENVIRONMENT · NASA OSDR</span>
            </div>
            <h3>Hostile Closed Environments</h3>
            <p>How cabin atmosphere, CO2 pockets, microbes, and constrained habitat telemetry interact with health.</p>
            <div class="topic-tags-row">
                <span class="mini-tag">CO2</span>
                <span class="mini-tag">ISS telemetry</span>
            </div>
            <a href="https://www.nasa.gov/wp-content/uploads/2023/12/ochmo-tb-004-carbon-dioxide.pdf" target="_blank" rel="noopener noreferrer" class="read-overview-link">Explore NASA OSDR Data <i class="fa-solid fa-arrow-up-right-from-square"></i></a>
        </div>

        <!-- Topic 6: Sleep & Circadian Rhythm -->
        <div class="guide-topic-card" data-category="behavioral">
            <div class="topic-card-top">
                <div class="topic-icon-wrapper behavioral">
                    <i class="fa-solid fa-moon"></i>
                </div>
                <span class="topic-category-tag">BEHAVIORAL HEALTH · NASA HRP</span>
            </div>
            <h3>Sleep & Circadian Rhythm</h3>
            <p>Practical context for sleep timing, light exposure, and Artemis/ISS mission schedules.</p>
            <div class="topic-tags-row">
                <span class="mini-tag">sleep</span>
                <span class="mini-tag">Artemis II</span>
            </div>
            <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC12155433/" target="_blank" rel="noopener noreferrer" class="read-overview-link">Read NASA Ongoing Studies <i class="fa-solid fa-arrow-up-right-from-square"></i></a>
        </div>
    </div>
</section>