/* ==============================================
   CALENDAR - Fetch, Render Events, Time Indicator
   ============================================== */

import CONFIG from './config.js';

// DOM element references
let dateLabel = null;
let timeline = null;
let eventsContainer = null;
let timeIndicator = null;

/**
 * Initialize calendar module
 */
function initCalendar() {
  dateLabel = document.getElementById('currentDateLabel');
  timeline = document.getElementById('calendarTimeline');
  eventsContainer = document.getElementById('calendarEvents');
  timeIndicator = document.getElementById('currentTimeIndicator');
  
  if (!timeline) {
    console.warn('Calendar timeline element not found');
    return;
  }
  
  // Initial render
  updateCurrentDate();
  updateTimeIndicator();
  loadCalendarData();
  
  // Set up refresh intervals
  setInterval(updateTimeIndicator, CONFIG.refreshIntervals.timeIndicator);
}

/**
 * Update the date display with current date
 */
function updateCurrentDate() {
  if (!dateLabel) return;
  
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  dateLabel.textContent = `Date: ${month}/${day}`;
}

/**
 * Update the red current time indicator position
 */
function updateTimeIndicator() {
  if (!timeIndicator) return;
  
  const now = new Date();
  const hour = now.getHours() + now.getMinutes() / 60;
  const { startHour, endHour } = CONFIG.calendar;
  
  // Hide if outside visible hours
  if (hour < startHour || hour > endHour) {
    timeIndicator.style.display = 'none';
    return;
  }
  
  const totalHours = endHour - startHour;
  const position = ((hour - startHour) / totalHours) * 100;
  
  timeIndicator.style.display = 'flex';
  timeIndicator.style.top = `${position}%`;
}

/**
 * Render calendar events to the timeline
 */
function renderCalendarEvents(events) {
  if (!eventsContainer) return;
  
  eventsContainer.innerHTML = '';
  
  events.forEach(event => {
    const eventEl = document.createElement('div');
    eventEl.className = `schedule-event ${event.category}`;
    eventEl.style.top = `${event.top_percent}%`;
    eventEl.style.height = `${Math.max(event.height_percent, 4)}%`;
    
    // Use the color from JSON for border
    if (event.color) {
      eventEl.style.borderLeftColor = event.color;
    }
    
    eventEl.innerHTML = `
      <div class="event-time">${event.start_time} - ${event.end_time}</div>
      <div class="event-title">${event.title}</div>
    `;
    
    eventsContainer.appendChild(eventEl);
  });
}

/**
 * Fetch calendar data from JSON and render
 */
async function loadCalendarData() {
  try {
    const response = await fetch(CONFIG.dataUrls.calendar);
    
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.today && data.today.events) {
      renderCalendarEvents(data.today.events);
    }
    
    // Update date display from JSON as fallback
    if (data.today && data.today.display_date && dateLabel) {
      // Keep using live date, but could use: dateLabel.textContent = data.today.display_date;
    }
    
    return data;
  } catch (error) {
    console.error('Failed to load calendar data:', error);
    return null;
  }
}

/**
 * Get week data for weekly view
 */
async function getWeekData() {
  const data = await loadCalendarData();
  return data?.week || null;
}

/**
 * Get upcoming events
 */
async function getUpcomingEvents() {
  const data = await loadCalendarData();
  return data?.upcoming || [];
}

export { 
  initCalendar, 
  updateCurrentDate, 
  updateTimeIndicator, 
  loadCalendarData,
  getWeekData,
  getUpcomingEvents
};
