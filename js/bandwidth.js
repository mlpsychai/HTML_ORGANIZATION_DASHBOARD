/* ==============================================
   BANDWIDTH - Fitbit Data & Self-Care Metrics
   Fixed to match fitbit-latest.json structure
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
 * Render bandwidth metrics on dashboard overview
 */
function renderBandwidthMetrics() {
  if (!bandwidthData) return;
  
  // Calculate bandwidth score from Fitbit data
  const bandwidthScore = calculateBandwidthScore(bandwidthData);
  
  // Update the donut visual on overview
  updateBandwidthVisual(bandwidthScore);
  
  // Update subtext
  const subtextEl = document.querySelector('.stat-card:first-child .stat-subtext');
  if (subtextEl) {
    subtextEl.textContent = getBandwidthStatus(bandwidthScore);
  }
}

/**
 * Calculate bandwidth score (1-10) from Fitbit metrics
 * Higher = better/more bandwidth available
 */
function calculateBandwidthScore(data) {
  let score = 5; // Base score
  let factors = 0;
  
  // Sleep score factor (0-4 points)
  if (data.sleep?.summary?.score) {
    const sleepScore = data.sleep.summary.score;
    if (sleepScore >= 85) score += 2;
    else if (sleepScore >= 70) score += 1;
    else if (sleepScore < 60) score -= 1;
    factors++;
  }
  
  // Sleep duration factor (target: 7-8 hrs)
  if (data.sleep?.summary?.duration_minutes) {
    const hours = data.sleep.summary.duration_minutes / 60;
    if (hours >= 7 && hours <= 9) score += 1.5;
    else if (hours >= 6 && hours < 7) score += 0.5;
    else if (hours < 6) score -= 1;
    factors++;
  }
  
  // Resting HR factor (lower is better, target < 65)
  if (data.heart?.summary?.resting_hr) {
    const rhr = data.heart.summary.resting_hr;
    if (rhr < 60) score += 1;
    else if (rhr < 70) score += 0.5;
    else if (rhr > 80) score -= 1;
    factors++;
  }
  
  // HRV factor (higher is better)
  if (data.hrv?.summary?.daily_rmssd && data.hrv.summary.daily_rmssd > 0) {
    const hrv = data.hrv.summary.daily_rmssd;
    if (hrv > 50) score += 1;
    else if (hrv > 30) score += 0.5;
    else if (hrv < 20) score -= 0.5;
    factors++;
  }
  
  // Clamp to 1-10 range
  return Math.max(1, Math.min(10, Math.round(score)));
}

/**
 * Update bandwidth visual indicator (donut/gauge)
 */
function updateBandwidthVisual(score) {
  const donutFill = document.querySelector('.donut-fill');
  if (!donutFill) return;
  
  // Calculate stroke-dasharray for donut (r=15, circumference ≈ 94.25)
  const circumference = 2 * Math.PI * 15;
  const percentage = (score / 10) * 100;
  const dashArray = `${(percentage / 100) * circumference}, ${circumference}`;
  
  donutFill.style.strokeDasharray = dashArray;
  
  // Update color class based on score
  // Lower score = more stressed = coral
  // Higher score = more bandwidth = sage
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
  if (score <= 3) return 'Protect energy';
  if (score <= 5) return 'Monitor closely';
  if (score <= 7) return 'Stable';
  return 'Thriving';
}

/**
 * Get bandwidth data
 */
function getBandwidthData() {
  return bandwidthData;
}

/**
 * Get sleep hours formatted
 */
function getSleepHours() {
  if (!bandwidthData?.sleep?.summary?.duration_minutes) return null;
  const hours = bandwidthData.sleep.summary.duration_minutes / 60;
  return hours.toFixed(1);
}

/**
 * Get resting heart rate
 */
function getRestingHR() {
  return bandwidthData?.heart?.summary?.resting_hr || null;
}

/**
 * Get sleep score
 */
function getSleepScore() {
  return bandwidthData?.sleep?.summary?.score || null;
}

export { 
  initBandwidth, 
  loadBandwidthData, 
  renderBandwidthMetrics,
  updateBandwidthVisual,
  getBandwidthStatus,
  getBandwidthData,
  calculateBandwidthScore,
  getSleepHours,
  getRestingHR,
  getSleepScore
};
