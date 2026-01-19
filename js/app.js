/* ==============================================
   APP - Initialize All Modules
   Spring 2026 Dashboard
   ============================================== */

import { initNavigation } from './navigation.js';
import { initCalendar } from './calendar.js';
import { initHours } from './hours.js';
import { initBandwidth } from './bandwidth.js';

/**
 * Initialize dashboard when DOM is ready
 */
function initDashboard() {
  console.log('Initializing Spring 2026 Dashboard...');
  
  // Core navigation (always needed)
  initNavigation();
  
  // Data modules
  initCalendar();
  initHours();
  initBandwidth();
  
  console.log('Dashboard initialized');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initDashboard);
} else {
  initDashboard();
}
