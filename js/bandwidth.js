/* ==============================================
   BANDWIDTH - Fitbit Data & Self-Care Metrics
   Handles both overview cards and full panel
   ============================================== */

import CONFIG from './config.js';

// Cached data
let bandwidthData = null;

/**
 * Initialize bandwidth module
 */
function initBandwidth() {
  loadBandwidthData();
  
  // Re-render when bandwidth panel becomes visible
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.target.id === 'bandwidth' && mutation.target.classList.contains('active')) {
        renderBandwidthPanel();
      }
    });
  });
  
  const bandwidthPanel = document.getElementById('bandwidth');
  if (bandwidthPanel) {
    observer.observe(bandwidthPanel, { attributes: true, attributeFilter: ['class'] });
  }
}

/**
 * Fetch Fitbit/bandwidth data from JSON
 */
async function loadBandwidthData() {
  try {
    const response = await fetch(CONFIG.dataUrls.fitbit + '?t=' + Date.now());
    
    if (!response.ok) {
      console.log('Fitbit data not available');
      return null;
    }
    
    bandwidthData = await response.json();
    console.log('Fitbit data loaded:', bandwidthData);
    
    renderBandwidthMetrics();
    renderBandwidthPanel();
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
  
  const bandwidthScore = calculateBandwidthScore(bandwidthData);
  updateBandwidthVisual(bandwidthScore);
  
  const subtextEl = document.querySelector('.stat-card:first-child .stat-subtext');
  if (subtextEl) {
    subtextEl.textContent = getBandwidthStatus(bandwidthScore);
  }
}

/**
 * Render full bandwidth panel
 */
function renderBandwidthPanel() {
  if (!bandwidthData) return;
  
  // Check if panel elements exist
  const sleepScoreEl = document.getElementById('bandwidth-sleep-score');
  if (!sleepScoreEl) return; // Panel not loaded yet
  
  // Update timestamp
  if (bandwidthData.updated_at) {
    const fetchDate = new Date(bandwidthData.updated_at);
    const el = document.getElementById('bandwidth-last-updated');
    if (el) {
      el.textContent = `UPDATED: ${fetchDate.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}`;
    }
  }

  // ============ SLEEP DATA ============
  if (bandwidthData.sleep?.summary) {
    const summary = bandwidthData.sleep.summary;
    
    // Sleep score
    const score = summary.score || 0;
    sleepScoreEl.textContent = `${score}%`;
    
    const qualityGauge = document.getElementById('bandwidth-quality-gauge');
    if (qualityGauge) {
      const qualityDeg = (score / 100) * 360;
      qualityGauge.style.background = `conic-gradient(var(--accent-teal) 0deg, var(--accent-teal) ${qualityDeg}deg, var(--bg-secondary) ${qualityDeg}deg)`;
    }
    
    // Total sleep
    const totalSleepEl = document.getElementById('bandwidth-total-sleep');
    if (totalSleepEl) {
      totalSleepEl.textContent = formatDuration(summary.duration_minutes);
    }
    
    // Sleep/wake times
    const sleepTimeEl = document.getElementById('bandwidth-sleep-time');
    const wakeTimeEl = document.getElementById('bandwidth-wake-time');
    if (sleepTimeEl) sleepTimeEl.textContent = formatTime(summary.start_time);
    if (wakeTimeEl) wakeTimeEl.textContent = formatTime(summary.end_time);
    
    // Sleep stages
    if (summary.stages) {
      setTextContent('bandwidth-deep-min', summary.stages.deep || 0);
      setTextContent('bandwidth-light-min', summary.stages.light || 0);
      setTextContent('bandwidth-rem-min', summary.stages.rem || 0);
      setTextContent('bandwidth-wake-min', summary.stages.wake || 0);
    }
    
    // Render hypnogram
    if (bandwidthData.sleep.levels?.length > 0) {
      renderHypnogram(summary.start_time, summary.end_time, bandwidthData.sleep.levels);
    }
  }

  // ============ HEART DATA ============
  if (bandwidthData.heart?.summary) {
    setTextContent('bandwidth-resting-hr', bandwidthData.heart.summary.resting_hr || '--');
  }
  
  if (bandwidthData.hrv?.summary) {
    const hrvVal = bandwidthData.hrv.summary.daily_rmssd;
    setTextContent('bandwidth-hrv', hrvVal > 0 ? hrvVal.toFixed(1) : '--');
  }
  
  if (bandwidthData.respiratory?.summary) {
    const spo2 = bandwidthData.respiratory.summary.spo2_avg;
    const spo2El = document.getElementById('bandwidth-spo2');
    if (spo2El) spo2El.textContent = spo2 > 0 ? `${spo2}%` : '--';
    
    const breathEl = document.getElementById('bandwidth-breathing');
    if (breathEl) {
      const rate = bandwidthData.respiratory.summary.breathing_rate;
      breathEl.textContent = rate > 0 ? rate.toFixed(1) : '--';
    }
  }

  // ============ ACTIVITY DATA ============
  if (bandwidthData.activity?.summary) {
    const activity = bandwidthData.activity.summary;
    
    setTextContent('bandwidth-steps', formatNumber(activity.steps));
    setTextContent('bandwidth-distance', activity.distance_miles?.toFixed(1) || '--');
    
    const activeMin = (activity.minutes?.fairly_active || 0) + (activity.minutes?.very_active || 0);
    setTextContent('bandwidth-active-min', activeMin);
    
    setTextContent('bandwidth-calories', formatNumber(activity.calories?.total));
  }

  // ============ READINESS SCORE ============
  calculateAndRenderReadiness();
}

/**
 * Calculate and render readiness score
 */
function calculateAndRenderReadiness() {
  let score = 0;
  let factors = 0;
  
  // Sleep quality factor (0-40 points)
  if (bandwidthData.sleep?.summary?.score) {
    score += (bandwidthData.sleep.summary.score / 100) * 40;
    factors++;
  }
  
  // HRV factor (0-30 points)
  const hrvVal = bandwidthData.hrv?.summary?.daily_rmssd || 0;
  if (hrvVal > 0) {
    const hrvScore = Math.min(30, Math.max(0, ((hrvVal - 20) / 40) * 30));
    score += hrvScore;
    factors++;
  }
  
  // Resting HR factor (0-30 points) - lower is better
  const rhr = bandwidthData.heart?.summary?.resting_hr || 0;
  if (rhr > 0) {
    const rhrScore = Math.min(30, Math.max(0, ((80 - rhr) / 30) * 30));
    score += rhrScore;
    factors++;
  }
  
  if (factors === 0) {
    score = bandwidthData.sleep?.summary?.score || 70;
  }
  
  score = Math.round(Math.min(100, Math.max(0, score)));
  
  const readinessScoreEl = document.getElementById('bandwidth-readiness-score');
  if (readinessScoreEl) readinessScoreEl.textContent = score;
  
  const readinessGauge = document.getElementById('bandwidth-readiness-gauge');
  if (readinessGauge) {
    const readinessDeg = (score / 100) * 360;
    readinessGauge.style.background = `conic-gradient(var(--accent-sage) 0deg, var(--accent-sage) ${readinessDeg}deg, var(--bg-tertiary) ${readinessDeg}deg)`;
  }
}

/**
 * Render hypnogram SVG
 */
function renderHypnogram(startTime, endTime, levels) {
  const svg = document.getElementById('hypnogram');
  const areaPath = document.getElementById('hypnogram-area');
  const linePath = document.getElementById('hypnogram-line');
  const timeLabels = document.getElementById('bandwidth-time-labels');
  
  if (!svg || !areaPath || !linePath || !levels?.length) return;
  
  const padding = 10;
  const width = 400 - (padding * 2);
  
  const levelY = { 'wake': 15, 'light': 55, 'rem': 95, 'deep': 135 };
  
  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();
  const totalDuration = end - start;
  
  function timeToX(dateTime) {
    const time = new Date(dateTime).getTime();
    const ratio = (time - start) / totalDuration;
    return padding + (ratio * width);
  }
  
  // Clear existing grid lines
  svg.querySelectorAll('line').forEach(l => l.remove());
  
  let pathD = '';
  let areaD = '';
  
  levels.forEach((level, i) => {
    const x = timeToX(level.dateTime);
    const y = levelY[level.level] || 55;
    const endX = timeToX(new Date(new Date(level.dateTime).getTime() + (level.seconds * 1000)).toISOString());
    
    if (i === 0) {
      pathD = `M${x},${y}`;
      areaD = `M${x},${y}`;
    } else {
      pathD += ` L${x},${y}`;
      areaD += ` L${x},${y}`;
    }
    
    pathD += ` L${endX},${y}`;
    areaD += ` L${endX},${y}`;
  });
  
  const lastX = timeToX(endTime);
  areaD += ` L${lastX},150 L${padding},150 Z`;
  
  linePath.setAttribute('d', pathD);
  areaPath.setAttribute('d', areaD);
  
  // Add grid lines
  const gridLines = [80, 160, 240, 320];
  gridLines.forEach(x => {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', x);
    line.setAttribute('y1', 10);
    line.setAttribute('x2', x);
    line.setAttribute('y2', 150);
    line.setAttribute('stroke', '#3a3a38');
    line.setAttribute('stroke-width', '1');
    svg.insertBefore(line, areaPath);
  });
  
  // Time labels
  if (timeLabels) {
    const startDate = new Date(startTime);
    const durationHours = (new Date(endTime) - startDate) / (1000 * 60 * 60);
    const interval = Math.ceil(durationHours / 5);
    const labels = [];
    
    for (let i = 0; i <= 4; i++) {
      const labelTime = new Date(startDate.getTime() + (i * interval * 60 * 60 * 1000));
      let h = labelTime.getHours();
      const ampm = h >= 12 ? 'PM' : 'AM';
      h = h % 12 || 12;
      labels.push(`${h} ${ampm}`);
    }
    
    timeLabels.innerHTML = labels.map(l => `<span>${l}</span>`).join('');
  }
}

// ============ UTILITY FUNCTIONS ============

function formatDuration(minutes) {
  if (!minutes && minutes !== 0) return '--';
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function formatTime(dateTimeStr) {
  if (!dateTimeStr) return '--';
  const date = new Date(dateTimeStr);
  let hours = date.getHours();
  const mins = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${hours}:${mins} ${ampm}`;
}

function formatNumber(num) {
  if (!num && num !== 0) return '--';
  return num.toLocaleString();
}

function setTextContent(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

/**
 * Calculate bandwidth score (1-10) from Fitbit metrics
 */
function calculateBandwidthScore(data) {
  let score = 5;
  
  if (data.sleep?.summary?.score) {
    const sleepScore = data.sleep.summary.score;
    if (sleepScore >= 85) score += 2;
    else if (sleepScore >= 70) score += 1;
    else if (sleepScore < 60) score -= 1;
  }
  
  if (data.sleep?.summary?.duration_minutes) {
    const hours = data.sleep.summary.duration_minutes / 60;
    if (hours >= 7 && hours <= 9) score += 1.5;
    else if (hours >= 6 && hours < 7) score += 0.5;
    else if (hours < 6) score -= 1;
  }
  
  if (data.heart?.summary?.resting_hr) {
    const rhr = data.heart.summary.resting_hr;
    if (rhr < 60) score += 1;
    else if (rhr < 70) score += 0.5;
    else if (rhr > 80) score -= 1;
  }
  
  if (data.hrv?.summary?.daily_rmssd > 0) {
    const hrv = data.hrv.summary.daily_rmssd;
    if (hrv > 50) score += 1;
    else if (hrv > 30) score += 0.5;
    else if (hrv < 20) score -= 0.5;
  }
  
  return Math.max(1, Math.min(10, Math.round(score)));
}

/**
 * Update bandwidth visual indicator (donut/gauge)
 */
function updateBandwidthVisual(score) {
  const donutFill = document.querySelector('.donut-fill');
  if (!donutFill) return;
  
  const circumference = 2 * Math.PI * 15;
  const percentage = (score / 10) * 100;
  const dashArray = `${(percentage / 100) * circumference}, ${circumference}`;
  
  donutFill.style.strokeDasharray = dashArray;
  
  donutFill.classList.remove('low', 'medium', 'high');
  if (score <= 3) donutFill.classList.add('high');
  else if (score <= 6) donutFill.classList.add('medium');
  else donutFill.classList.add('low');
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

function getBandwidthData() {
  return bandwidthData;
}

export { 
  initBandwidth, 
  loadBandwidthData, 
  renderBandwidthMetrics,
  renderBandwidthPanel,
  updateBandwidthVisual,
  getBandwidthStatus,
  getBandwidthData,
  calculateBandwidthScore
};
