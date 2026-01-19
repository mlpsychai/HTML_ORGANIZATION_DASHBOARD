/* ==============================================
   NAVIGATION - Panel Switching & Lazy Loading
   ============================================== */

// Cache for loaded panels
const loadedPanels = new Set(['overview']); // overview is always loaded

// Panel to file mapping
const panelFiles = {
  hours: 'panels/hours.html',
  calendar: 'panels/calendar.html',
  semester: 'panels/semester.html',
  deadlines: 'panels/deadlines.html',
  bandwidth: 'panels/bandwidth.html'
};

/**
 * Load panel HTML from file
 */
async function loadPanel(panelId) {
  if (loadedPanels.has(panelId)) return true;
  
  const panelEl = document.getElementById(panelId);
  const filePath = panelFiles[panelId];
  
  if (!panelEl || !filePath) {
    console.warn(`Panel not found: ${panelId}`);
    return false;
  }
  
  try {
    const response = await fetch(filePath);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const html = await response.text();
    panelEl.innerHTML = html;
    loadedPanels.add(panelId);
    
    console.log(`Loaded panel: ${panelId}`);
    return true;
  } catch (error) {
    console.error(`Failed to load panel ${panelId}:`, error);
    panelEl.innerHTML = `<section class="section"><p>Failed to load content.</p></section>`;
    return false;
  }
}

/**
 * Switch to a panel (loads if needed)
 */
async function switchPanel(panelId) {
  const panels = document.querySelectorAll('.view-panel');
  
  // Load panel content if not already loaded
  await loadPanel(panelId);
  
  // Switch active panel
  panels.forEach(panel => {
    panel.classList.remove('active');
    if (panel.id === panelId) {
      panel.classList.add('active');
    }
  });
}

/**
 * Initialize navigation
 */
function initNavigation() {
  const menuBtn = document.getElementById('menuBtn');
  const dropdownMenu = document.getElementById('dropdownMenu');
  const dropdownItems = document.querySelectorAll('.dropdown-item');
  const quickLinksBtn = document.getElementById('quickLinksBtn');
  const quickLinksDropdown = document.getElementById('quickLinksDropdown');

  if (!menuBtn || !dropdownMenu) {
    console.warn('Navigation elements not found');
    return;
  }

  // Toggle main dropdown
  menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    menuBtn.classList.toggle('open');
    dropdownMenu.classList.toggle('open');
    if (quickLinksDropdown) {
      quickLinksDropdown.classList.remove('open');
    }
  });

  // Toggle quick links dropdown
  if (quickLinksBtn && quickLinksDropdown) {
    quickLinksBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      quickLinksDropdown.classList.toggle('open');
      menuBtn.classList.remove('open');
      dropdownMenu.classList.remove('open');
    });
  }

  // Close all dropdowns when clicking outside
  document.addEventListener('click', () => {
    menuBtn.classList.remove('open');
    dropdownMenu.classList.remove('open');
    if (quickLinksDropdown) {
      quickLinksDropdown.classList.remove('open');
    }
  });

  // Handle menu item selection
  dropdownItems.forEach(item => {
    item.addEventListener('click', async (e) => {
      e.stopPropagation();
      
      const panelId = item.dataset.view;
      
      // Update active states
      dropdownItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      
      // Switch panel (loads if needed)
      await switchPanel(panelId);
      
      // Close dropdown
      menuBtn.classList.remove('open');
      dropdownMenu.classList.remove('open');
    });
  });
}

export { initNavigation, loadPanel, switchPanel };
