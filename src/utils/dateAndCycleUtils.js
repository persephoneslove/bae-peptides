/**
 * Timezone-Safe Date Utilities and Dynamic Protocol Cycle Day Calculator
 */

/**
 * Extracts YYYY-MM-DD in the user's LOCAL timezone (avoids UTC shifting bugs)
 */
export function getLocalDateKey(dateInput) {
  if (!dateInput) return '';
  const d = typeof dateInput === 'string' || typeof dateInput === 'number' ? new Date(dateInput) : dateInput;
  if (isNaN(d.getTime())) return '';
  
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Constructs an ISO string from local date string (YYYY-MM-DD) and time string (HH:MM)
 */
export function createLocalTimestamp(dateStr, timeStr = '08:30') {
  if (!dateStr) dateStr = getLocalDateKey(new Date());
  const [year, month, day] = dateStr.split('-').map(Number);
  const [hour, minute] = (timeStr || '08:30').split(':').map(Number);
  
  const localDate = new Date(year, month - 1, day, hour || 0, minute || 0, 0);
  return localDate.toISOString();
}

/**
 * Formats a local timestamp for display (e.g. "Today 08:30 AM", "Aug 28 08:30 AM")
 */
export function formatDisplayDateTime(timestamp) {
  if (!timestamp) return '';
  const d = new Date(timestamp);
  if (isNaN(d.getTime())) return '';

  const todayKey = getLocalDateKey(new Date());
  const yestKey = getLocalDateKey(new Date(Date.now() - 86400000));
  const logKey = getLocalDateKey(d);

  const timeFormatted = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (logKey === todayKey) return `Today ${timeFormatted}`;
  if (logKey === yestKey) return `Yesterday ${timeFormatted}`;
  return `${d.toLocaleDateString([], { month: 'short', day: 'numeric' })} ${timeFormatted}`;
}

/**
 * Difference in calendar days between two YYYY-MM-DD strings in local time
 */
export function getDaysBetweenLocalDates(startDateStr, targetDateStr) {
  if (!startDateStr || !targetDateStr) return 0;
  const [y1, m1, d1] = startDateStr.split('-').map(Number);
  const [y2, m2, d2] = targetDateStr.split('-').map(Number);

  const utc1 = Date.UTC(y1, m1 - 1, d1);
  const utc2 = Date.UTC(y2, m2 - 1, d2);

  return Math.floor((utc2 - utc1) / (1000 * 60 * 60 * 24));
}

/**
 * Automatically recalculates Protocol Cycle Days for all logs:
 * - Finds the earliest logged date across the dataset (or per compound).
 * - The earliest logged date is Day 1.
 * - Each successive calendar date is Day 2, Day 3, etc.
 * - If a dose is inserted in-between or before, all cycle days automatically recalibrate accurately.
 */
export function recalculateAllCycleDays(logs = []) {
  if (!Array.isArray(logs) || logs.length === 0) return [];

  // Group logs by compoundKey (or compound name)
  const compoundGroups = {};
  logs.forEach(log => {
    const key = (log.compoundKey || log.name || 'default').toLowerCase().trim();
    if (!compoundGroups[key]) {
      compoundGroups[key] = [];
    }
    compoundGroups[key].push(log);
  });

  const updatedLogsMap = {};

  // For each compound group, find earliest date and calculate day numbers
  Object.keys(compoundGroups).forEach(key => {
    const group = compoundGroups[key];

    // Find earliest local date key
    let earliestDateStr = null;
    group.forEach(l => {
      const dateKey = getLocalDateKey(l.timestamp);
      if (!earliestDateStr || dateKey < earliestDateStr) {
        earliestDateStr = dateKey;
      }
    });

    group.forEach(l => {
      const logDateStr = getLocalDateKey(l.timestamp);
      const diffDays = getDaysBetweenLocalDates(earliestDateStr, logDateStr);
      const cycleDay = Math.max(1, diffDays + 1);

      updatedLogsMap[l.id] = {
        ...l,
        cycle_day: cycleDay,
        displayTime: formatDisplayDateTime(l.timestamp)
      };
    });
  });

  // Preserve original ordering while applying updated cycle_day values
  return logs.map(l => updatedLogsMap[l.id] || l);
}

/**
 * Calculates what cycle day a given dateStr (YYYY-MM-DD) would be, based on existing logs for that compound.
 */
export function calculateDynamicCycleDayForDate(logs = [], targetDateStr, compoundKey = '') {
  if (!targetDateStr) targetDateStr = getLocalDateKey(new Date());
  const cleanKey = (compoundKey || '').toLowerCase().trim();

  // Find relevant logs for this compound (or all logs if key not found)
  let relevantLogs = logs.filter(l => {
    if (!cleanKey) return true;
    const lKey = (l.compoundKey || l.name || '').toLowerCase().trim();
    return lKey.includes(cleanKey) || cleanKey.includes(lKey);
  });

  if (relevantLogs.length === 0) {
    relevantLogs = logs;
  }

  if (relevantLogs.length === 0) {
    return 1; // First dose ever is Day 1
  }

  // Find earliest date
  let earliestDateStr = targetDateStr;
  relevantLogs.forEach(l => {
    const lDateStr = getLocalDateKey(l.timestamp);
    if (lDateStr && lDateStr < earliestDateStr) {
      earliestDateStr = lDateStr;
    }
  });

  const diffDays = getDaysBetweenLocalDates(earliestDateStr, targetDateStr);
  return Math.max(1, diffDays + 1);
}
