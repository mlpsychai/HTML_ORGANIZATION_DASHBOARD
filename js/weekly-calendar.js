/* ==============================================
   WEEKLY CALENDAR - Render week view from calendar data
   ============================================== */

import CONFIG from './config.js';

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const START_HOUR = 5;
const END_HOUR = 20;
const TOTAL_HOURS = END_HOUR - START_HOUR;

let weekData = null;
let initialized = false;

/**
 * Initialize weekly calendar when panel becomes visible
 */
function initWeeklyCalendar() {
  // Watch for panel to become active
  const observer = new MutationObserver((mutations) => {
    const panel = document.getElementById('calendar-panel');
    if (panel && panel.classList.contains('active') && !initialized) {
      loadAndRenderWeek();
      startTimeIndicator();
      initialized = true;
    }
  });
  
  // Observe the main content area for class changes
  const mainContent = document.querySelector('.main-content');
  if (mainContent) {
    observer.observe(mainContent, { 
      childList: true, 
      subtree: true, 
      attributes: true, 
      attributeFilter: ['class'] 
    });
  }
  
  // Also check if already active
  const panel = document.getElementById('calendar-panel');
  if (panel && panel.classList.contains('active')) {
    loadAndRenderWeek();
    startTimeIndicator();
    initialized = true;
  }
}

/**
 * Generate time labels for the left column
 */
function renderTimeLabels() {
  const container = document.getElementById('weeklyTimeLabels');
  if (!container) return;
  
  container.innerHTML = '';
  
  for (let hour = START_HOUR; hour <= END_HOUR; hour++) {
    const label = document.createElement('div');
    label.className = 'time-label';
    
    const position = ((hour - START_HOUR) / TOTAL_HOURS) * 100;
    label.style.top = `${position}%`;
    
    const displayHour = hour > 12 ? hour - 12 : hour;
    const ampm = hour >= 12 ? 'PM' : 'AM';
    label.textContent = `${displayHour} ${ampm}`;
    
    container.appendChild(label);
  }
}

/**
 * Fetch calendar data and render the week
 */
async function loadAndRenderWeek() {
  try {
    const response = await fetch(CONFIG.dataUrls.calendar);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const data = await response.json();
    weekData = data.week;
    
    renderTimeLabels();
    renderWeekHeader(data.meta);
    renderAllDays();
    updateTimeIndicator();
    
  } catch (error) {
    console.error('Failed to load weekly calendar:', error);
  }
}

/**
 * Render the week range in header
 */
function renderWeekHeader(meta) {
  const rangeLabel = document.getElementById('weekRangeLabel');
  if (!rangeLabel || !weekData) return;
  
  const monday = weekData.monday?.display_date || '';
  const sunday = weekData.sunday?.display_date || '';
  rangeLabel.textContent = `${monday} - ${sunday}`;
}

/**
 * Render all 7 day columns
 */
function renderAllDays() {
  if (!weekData) return;
  
  DAYS.forEach(day => {
    const dayData = weekData[day];
    if (!dayData) return;
    
    // Update date display
    const dateEl = document.getElementById(`${day}-date`);
    if (dateEl) {
      // Extract just the day number
      const dateParts = dayData.display_date.split(' ');
      dateEl.textContent = dateParts[1] || dayData.display_date;
    }
    
    // Mark today's column
    const column = document.querySelector(`.day-column[data-day="${day}"]`);
    if (column) {
      column.classList.toggle('is-today', dayData.is_today);
    }
    
    // Render events
    renderDayEvents(day, dayData.events);
  });
}

/**
 * Render events for a single day
 */
function renderDayEvents(day, events) {
  const container = document.getElementById(`${day}-events`);
  if (!container) return;
  
  container.innerHTML = '';
  
  if (!events || events.length === 0) return;
  
  events.forEach(event => {
    const eventEl = document.createElement('div');
    eventEl.className = `weekly-event ${event.category || 'default'}`;
    
    // Position and size
    eventEl.style.top = `${event.top_percent}%`;
    eventEl.style.height = `${Math.max(event.height_percent, 4)}%`;
    
    // Apply color
    if (event.color) {
      eventEl.style.borderLeftColor = event.color;
    }
    
    // Determine if we have room for time display
    const showTime = event.height_percent >= 8;
    const canWrap = event.height_percent >= 12;
    
    eventEl.innerHTML = `
      ${showTime ? `<div class="weekly-event-time">${event.start_time}</div>` : ''}
      <div class="weekly-event-title ${canWrap ? 'can-wrap' : ''}">${event.title}</div>
    `;
    
    // Tooltip on hover
    eventEl.title = `${event.title}\n${event.start_time} - ${event.end_time}`;
    
    container.appendChild(eventEl);
  });
}

/**
 * Calculate current time indicator position
 */
function updateTimeIndicator() {
  const indicator = document.getElementById('weeklyTimeIndicator');
  if (!indicator || !weekData) return;
  
  const now = new Date();
  const hour = now.getHours() + now.getMinutes() / 60;
  
  // Hide if outside visible hours
  if (hour < START_HOUR || hour > END_HOUR) {
    indicator.style.display = 'none';
    return;
  }
  
  // Find today's column
  let todayColumn = null;
  let todayIndex = -1;
  
  DAYS.forEach((day, index) => {
    if (weekData[day]?.is_today) {
      todayColumn = document.querySelector(`.day-column[data-day="${day}"]`);
      todayIndex = index;
    }
  });
  
  if (!todayColumn) {
    indicator.style.display = 'none';
    return;
  }
  
  // Calculate vertical position
  const position = ((hour - START_HOUR) / TOTAL_HOURS) * 100;
  
  // Calculate horizontal position based on which column is today
  // Grid: 50px time column + 7 equal day columns
  const gridContainer = document.querySelector('.weekly-grid');
  if (!gridContainer) return;
  
  const gridRect = gridContainer.getBoundingClientRect();
  const timeColumnWidth = 50;
  const dayColumnWidth = (gridRect.width - timeColumnWidth) / 7;
  
  const leftOffset = timeColumnWidth + (todayIndex * dayColumnWidth);
  const rightOffset = gridRect.width - leftOffset - dayColumnWidth;
  
  // Position the indicator
  indicator.style.display = 'flex';
  indicator.style.top = `calc(48px + ${position}% * (100% - 48px - 60px) / 100)`;
  indicator.style.left = `${leftOffset}px`;
  indicator.style.right = `${rightOffset}px`;
  indicator.style.width = `${dayColumnWidth}px`;
}

/**
 * Start updating time indicator every minute
 */
function startTimeIndicator() {
  updateTimeIndicator();
  setInterval(updateTimeIndicator, 60000);
}

/**
 * Refresh the weekly view (call after data update)
 */
function refreshWeeklyCalendar() {
  initialized = false;
  loadAndRenderWeek();
}

export { 
  initWeeklyCalendar, 
  loadAndRenderWeek, 
  refreshWeeklyCalendar 
};
