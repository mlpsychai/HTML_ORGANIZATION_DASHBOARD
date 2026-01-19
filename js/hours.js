/* ==============================================
   HOURS - Time2Track Data Fetching & Rendering
   ============================================== */

import CONFIG from './config.js';

// Cached data
let hoursData = null;

/**
 * Initialize hours module
 */
function initHours() {
  loadHoursData();
}

/**
 * Fetch hours data from JSON
 */
async function loadHoursData() {
  try {
    const response = await fetch(CONFIG.dataUrls.hours);
    
    if (!response.ok) {
      // Hours data may not exist yet - that's okay
      console.log('Hours data not available');
      return null;
    }
    
    hoursData = await response.json();
    renderHoursSummary();
    return hoursData;
  } catch (error) {
    console.log('Hours data not loaded:', error.message);
    return null;
  }
}

/**
 * Render hours summary cards on overview panel
 */
function renderHoursSummary() {
  if (!hoursData) return;
  
  // Update direct hours
  const directHoursEl = document.getElementById('directHoursValue');
  if (directHoursEl && hoursData.direct) {
    directHoursEl.textContent = `${hoursData.direct.current}/${hoursData.direct.goal}`;
  }
  
  // Update total hours
  const totalHoursEl = document.getElementById('totalHoursValue');
  if (totalHoursEl && hoursData.total) {
    totalHoursEl.textContent = `${hoursData.total.current}/${hoursData.total.goal}`;
  }
  
  // Update supervision hours
  const supervisionEl = document.getElementById('supervisionHoursValue');
  if (supervisionEl && hoursData.supervision) {
    supervisionEl.textContent = `${hoursData.supervision.current}/${hoursData.supervision.goal}`;
  }
}

/**
 * Calculate percentage complete
 */
function calculateProgress(current, goal) {
  if (!goal || goal === 0) return 0;
  return Math.min(100, Math.round((current / goal) * 100));
}

/**
 * Get hours data
 */
function getHoursData() {
  return hoursData;
}

export { 
  initHours, 
  loadHoursData, 
  renderHoursSummary,
  calculateProgress,
  getHoursData
};
