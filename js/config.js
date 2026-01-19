/* ==============================================
   CONFIG - Data URLs, Timezone, Constants
   ============================================== */

const CONFIG = {
  // Data sources
  dataUrls: {
    calendar: 'https://raw.githubusercontent.com/mlpsychai/HTML_ORGANIZATION_DASHBOARD/main/data/calendar_data.json',
    fitbit: 'https://raw.githubusercontent.com/mlpsychai/HTML_ORGANIZATION_DASHBOARD/main/data/fitbit-latest.json',
    hours: 'https://raw.githubusercontent.com/mlpsychai/HTML_ORGANIZATION_DASHBOARD/main/data/hours_data.json'
  },
  
  // Timezone
  timezone: 'America/Phoenix',
  
  // Calendar settings
  calendar: {
    startHour: 5,
    endHour: 20
  },
  
  // Refresh intervals (ms)
  refreshIntervals: {
    timeIndicator: 60000,  // 1 minute
    calendarData: 3600000  // 1 hour
  }
};

export default CONFIG;
