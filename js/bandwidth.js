/* ==============================================
   BANDWIDTH - Fitbit Data & Self-Care Metrics
   ============================================== */

import CONFIG from './config.js';

// Cached data
let bandwidthData = null;

/**
 * Initialize bandwidth module
 */
function initBandwidth() {
  loadBandwidthData();
}

/**
 * Fetch Fitbit/bandwidth data from JSON
 */
async function loadBandwidthData() {
  try {
    const response = await fetch(CONFIG.dataUrls.fitbit);
    
    if (!response.ok) {
      console.log('Fitbit data not available');
      return null;
    }
    
    bandwidthData = await response.json();
    renderBandwidthMetrics();
    return bandwidthData;
  } catch (error) {
    console.log('Bandwidth data not loaded:', error.message);
    return null;
  }
}

/**
 * Render bandwidth metrics on dashboard
 */
function renderBandwidthMetrics() {
  if (!bandwidthData) return;
  
  // Update sleep average
  const sleepEl = document.getElementById('avgSleepValue');
  if (sleepEl && bandwidthData.sleep) {
    sleepEl.textContent = `${bandwidthData.sleep.average} hrs`;
  }
  
  // Update exercise days
  const exerciseEl = document.getElementById('exerciseDaysValue');
  if (exerciseEl && bandwidthData.exercise) {
    exerciseEl.textContent = `${bandwidthData.exercise.days} / 7`;
  }
  
  // Update bandwidth score
  const bandwidthEl = document.getElementById('bandwidthScore');
  if (bandwidthEl && bandwidthData.bandwidth) {
    bandwidthEl.textContent = bandwidthData.bandwidth.score;
    updateBandwidthVisual(bandwidthData.bandwidth.score);
  }
}

/**
 * Update bandwidth visual indicator (donut/gauge)
 */
function updateBandwidthVisual(score) {
  const donutFill = document.querySelector('.donut-fill');
  if (!donutFill) return;
  
  // Calculate stroke-dasharray for donut
  const circumference = 2 * Math.PI * 15; // r=15 from SVG
  const percentage = (score / 10) * 100;
  const dashArray = `${(percentage / 100) * circumference}, ${circumference}`;
  
  donutFill.style.strokeDasharray = dashArray;
  
  // Update color class based on score
  donutFill.classList.remove('low', 'medium', 'high');
  if (score <= 3) {
    donutFill.classList.add('high'); // High stress = coral
  } else if (score <= 6) {
    donutFill.classList.add('medium'); // Medium = gold
  } else {
    donutFill.classList.add('low'); // Low stress = sage (good)
  }
}

/**
 * Calculate bandwidth status text
 */
function getBandwidthStatus(score) {
  if (score <= 3) return 'Protect Energy';
  if (score <= 5) return 'Monitor Closely';
  if (score <= 7) return 'Stable';
  return 'Thriving';
}

/**
 * Get bandwidth data
 */
function getBandwidthData() {
  return bandwidthData;
}

export { 
  initBandwidth, 
  loadBandwidthData, 
  renderBandwidthMetrics,
  updateBandwidthVisual,
  getBandwidthStatus,
  getBandwidthData
};
