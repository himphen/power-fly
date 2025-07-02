// DOM Elements
const searchInput = document.getElementById('search-input');
const resultsContainer = document.getElementById('results');
const airlineCardTemplate = document.getElementById('airline-card-template');
const capacityRuleTemplate = document.getElementById('capacity-rule-template');
const splashScreen = document.getElementById('splash-screen');

// Calculator Elements
const mahInput = document.getElementById('mah-input');
const voltageInput = document.getElementById('voltage-input');
const whResult = document.getElementById('wh-result');
const whValue = document.getElementById('wh-value');

// State
let airlines = [];
let currentLang = getBrowserLanguage();
let currentWh = null;

// Get browser language
function getBrowserLanguage() {
    const browserLang = navigator.language || navigator.userLanguage;
    // Check if browser language contains 'zh' (e.g., zh-HK, zh-TW, zh-CN)
    return browserLang.toLowerCase().includes('zh') ? 'zh' : 'en';
}

// Set initial language state
function setInitialLanguage() {
    const zhBtn = document.getElementById('lang-zh');
    const enBtn = document.getElementById('lang-en');
    
    if (currentLang === 'zh') {
        zhBtn.classList.add('active');
        enBtn.classList.remove('active');
        searchInput.placeholder = '國泰、Cathay、CX';
    } else {
        enBtn.classList.add('active');
        zhBtn.classList.remove('active');
        searchInput.placeholder = 'Cathay、CX';
    }
    updateLanguageDisplay();
}

// Calculator functionality
function calculateWh() {
    const mah = parseFloat(mahInput.value);
    const voltage = parseFloat(voltageInput.value);

    if (!mah || !voltage || mah <= 0 || voltage <= 0) {
        whValue.textContent = '-';
        currentWh = null;
        renderResults(airlines); // Reset highlights
        return;
    }

    const wh = (mah * voltage) / 1000;
    currentWh = wh;
    whValue.textContent = wh.toFixed(2);
    renderResults(airlines); // Re-render with highlights
}

// Add input event listeners for real-time calculation
mahInput.addEventListener('input', calculateWh);
voltageInput.addEventListener('input', calculateWh);

// Remove splash screen
function removeSplashScreen() {
    splashScreen.classList.add('fade-out');
    setTimeout(() => {
        splashScreen.remove();
    }, 500); // Match the CSS transition duration
}

// Fetch and initialize data
async function initializeApp() {
    try {
        const response = await fetch('data/airlines.json');
        const data = await response.json();
        airlines = data.airlines;
        setInitialLanguage(); // Set initial language before rendering
        renderResults(airlines);
        searchInput.disabled = false;
        searchInput.placeholder = currentLang === 'zh' ? '搜尋航空公司...' : 'Search airlines...';
        removeSplashScreen();
    } catch (error) {
        console.error('Error loading airline data:', error);
        removeSplashScreen();
    }
}

// Check if a Wh value falls within a capacity rule's range
function isWhInRange(wh, rule) {
    if (!wh) return false;
    
    const min = rule.min_wh || 0;
    const max = rule.max_wh;
    
    return wh > min && wh <= max;
}

// Check if a Wh value exceeds a rule's maximum
function isWhExceedingMax(wh, rule) {
    if (!wh) return false;
    return wh > rule.max_wh;
}

// Render airline cards
function renderResults(airlines) {
    resultsContainer.innerHTML = '';
    
    if (airlines.length === 0) {
        const noResults = document.createElement('div');
        noResults.className = 'text-center py-16';
        noResults.innerHTML = `
            <p class="font-bold text-2xl text-slate-500 dark:text-slate-400">
                <span data-lang="zh" class="visible-lang">找不到結果</span>
                <span data-lang="en">No Results Found</span>
            </p>
            <p class="mt-2 text-slate-500 dark:text-slate-400">
                <span data-lang="zh" class="visible-lang">請嘗試其他航空公司名稱。</span>
                <span data-lang="en">Please try another airline name.</span>
            </p>
        `;
        resultsContainer.appendChild(noResults);
        return;
    }

    airlines.forEach(airline => {
        const card = airlineCardTemplate.content.cloneNode(true);
        
        // Basic Info
        card.querySelector('.name-zh').textContent = airline.name_zh;
        card.querySelector('.name-en').textContent = airline.name_en;
        card.querySelector('.iata-code').textContent = airline.iata_code;
        card.querySelector('.summary').textContent = currentLang === 'zh' ? airline.regulations.summary_zh : airline.regulations.summary_en;

        // Source URLs - Show only the current language URL
        const sourceZh = card.querySelector('.source-url-zh');
        const sourceEn = card.querySelector('.source-url-en');
        
        if (currentLang === 'zh') {
            sourceZh.href = airline.source_url_zh;
            sourceZh.classList.remove('hidden');
            sourceEn.classList.add('hidden');
        } else {
            sourceEn.href = airline.source_url_en;
            sourceEn.classList.remove('hidden');
            sourceZh.classList.add('hidden');
        }

        // Capacity Rules
        const capacityRulesContainer = card.querySelector('.capacity-rules');
        const capacityRules = airline.regulations.capacity;
        
        capacityRules.forEach((rule, index) => {
            const ruleElement = capacityRuleTemplate.content.cloneNode(true);
            const ruleDiv = ruleElement.querySelector('.capacity-rule');
            const exceedWarning = ruleElement.querySelector('.exceed-limit-warning');
            const isLastRule = index === capacityRules.length - 1;
            
            // Handle Wh matching and exceeding cases
            if (currentWh) {
                if (isLastRule && isWhExceedingMax(currentWh, rule)) {
                    ruleDiv.classList.add('border', 'border-red-500');
                    exceedWarning.classList.remove('hidden');
                } else if (isWhInRange(currentWh, rule)) {
                    if (rule.approval_required) {
                        ruleDiv.classList.add('border', 'border-amber-500');
                    } else {
                        ruleDiv.classList.add('border', 'border-green-500');
                    }
                }
            }
            
            // Watt-hour range
            const whRange = ruleElement.querySelector('.wh-range');
            if (rule.min_wh) {
                whRange.textContent = `${rule.min_wh}-${rule.max_wh}Wh`;
            } else {
                whRange.textContent = `≤${rule.max_wh}Wh`;
            }

            // Approval badge
            if (rule.approval_required) {
                ruleElement.querySelector('.approval-badge').classList.remove('hidden');
            }

            // Quantity limit
            const quantityLimit = ruleElement.querySelector('.quantity-limit');
            if (rule.quantity_limit) {
                quantityLimit.textContent = currentLang === 'zh' 
                    ? `最多 ${rule.quantity_limit} 件`
                    : `Max ${rule.quantity_limit} units`;
            }

            // Notes
            const notes = ruleElement.querySelector('.notes');
            notes.textContent = currentLang === 'zh' ? rule.notes_zh : rule.notes_en;

            capacityRulesContainer.appendChild(ruleElement);
        });

        // Usage Rules
        const regs = airline.regulations;
        
        // In-flight use
        const inFlightUse = card.querySelector('.in-flight-use');
        toggleIcon(inFlightUse, !regs.in_flight_use_prohibited);

        // In-flight charging
        const inFlightCharging = card.querySelector('.in-flight-charging');
        toggleIcon(inFlightCharging, !regs.in_flight_charging_prohibited);

        // Storage Rules
        const overheadStorage = card.querySelector('.overhead-storage');
        toggleIcon(overheadStorage, !regs.overhead_stowage_prohibited);

        const underSeat = card.querySelector('.under-seat');
        toggleIcon(underSeat, regs.under_seat_stowage_required);

        resultsContainer.appendChild(card);
    });

    // Update language visibility
    updateLanguageDisplay();
}

// Helper function to toggle icons
function toggleIcon(element, isAllowed) {
    const checkIcon = element.querySelector('.text-green-500');
    const crossIcon = element.querySelector('.text-red-500');
    
    if (isAllowed) {
        checkIcon.classList.remove('hidden');
        crossIcon.classList.add('hidden');
    } else {
        checkIcon.classList.add('hidden');
        crossIcon.classList.remove('hidden');
    }
}

// Search functionality
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredAirlines = airlines.filter(airline => 
        airline.name_zh.toLowerCase().includes(searchTerm) ||
        airline.name_en.toLowerCase().includes(searchTerm) ||
        airline.iata_code.toLowerCase().includes(searchTerm)
    );
    renderResults(filteredAirlines);
});

// Language switching
function updateLanguageDisplay() {
    document.querySelectorAll('[data-lang]').forEach(el => {
        el.classList.toggle('visible-lang', el.getAttribute('data-lang') === currentLang);
    });
}

document.getElementById('lang-zh').addEventListener('click', () => {
    currentLang = 'zh';
    document.getElementById('lang-zh').classList.add('active');
    document.getElementById('lang-en').classList.remove('active');
    searchInput.placeholder = '國泰、Cathay、CX';
    renderResults(airlines);
});

document.getElementById('lang-en').addEventListener('click', () => {
    currentLang = 'en';
    document.getElementById('lang-en').classList.add('active');
    document.getElementById('lang-zh').classList.remove('active');
    searchInput.placeholder = 'Cathay、CX';
    renderResults(airlines);
});

// Initialize the app
initializeApp(); 