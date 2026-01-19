/* ==============================================
   HOURS - Time2Track Data Fetching & Rendering
   Fixed to match hours_data.json structure
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
    const current = hoursData.direct.current || 0;
    const goal = hoursData.direct.goal || 100;
    directHoursEl.textContent = `${current}/${goal}`;
    
    // Update subtext with percentage
    const directCard = directHoursEl.closest('.stat-card');
    const directSubtext = directCard?.querySelector('.stat-subtext');
    if (directSubtext) {
      directSubtext.textContent = `${calculateProgress(current, goal)}% complete`;
    }
  }
  
  // Update total hours
  const totalHoursEl = document.getElementById('totalHoursValue');
  if (totalHoursEl && hoursData.total) {
    const current = hoursData.total.current || 0;
    const goal = hoursData.total.goal || 500;
    totalHoursEl.textContent = `${current}/${goal}`;
    
    // Update subtext with percentage
    const totalCard = totalHoursEl.closest('.stat-card');
    const totalSubtext = totalCard?.querySelector('.stat-subtext');
    if (totalSubtext) {
      totalSubtext.textContent = `${calculateProgress(current, goal)}% complete`;
    }
  }
  
  // Update supervision hours (masters supervision provided)
  const supervisionEl = document.getElementById('supervisionHoursValue');
  if (supervisionEl && hoursData.supervision) {
    // Use provided (masters supervision) for the overview card
    const provided = hoursData.supervision.provided || hoursData.supervision;
    const current = provided.current || 0;
    const goal = provided.goal || 40;
    supervisionEl.textContent = `${current}/${goal}`;
    
    // Update subtext with percentage
    const supCard = supervisionEl.closest('.stat-card');
    const supSubtext = supCard?.querySelector('.stat-subtext');
    if (supSubtext) {
      supSubtext.textContent = `${calculateProgress(current, goal)}% complete`;
    }
  }
}

/**
 * Calculate percentage complete
 */
function calculateProgress(current, goal) {
  if (!goal || goal === 0) return 0;
  return Math.min(100, Math.round((current / goal) * 100 * 10) / 10);
}

/**
 * Get hours data
 */
function getHoursData() {
  return hoursData;
}

/**
 * Get direct hours
 */
function getDirectHours() {
  return hoursData?.direct?.current || 0;
}

/**
 * Get total hours
 */
function getTotalHours() {
  return hoursData?.total?.current || 0;
}

/**
 * Get supervision received hours
 */
function getSupervisionReceived() {
  return hoursData?.supervision?.received?.current || 0;
}

/**
 * Get supervision provided hours
 */
function getSupervisionProvided() {
  return hoursData?.supervision?.provided?.current || 0;
}

/**
 * Get hours by site
 */
function getHoursBySite(siteKey) {
  return hoursData?.sites?.[siteKey]?.hours || 0;
}

export { 
  initHours, 
  loadHoursData, 
  renderHoursSummary,
  calculateProgress,
  getHoursData,
  getDirectHours,
  getTotalHours,
  getSupervisionReceived,
  getSupervisionProvided,
  getHoursBySite
};
