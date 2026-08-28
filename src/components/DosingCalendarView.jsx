import React, { useState } from 'react';
import { sound } from '../utils/audio';
import {
  getLocalDateKey,
  createLocalTimestamp,
  formatDisplayDateTime,
  calculateDynamicCycleDayForDate
} from '../utils/dateAndCycleUtils';

const INJECTION_SITES = [
  { id: 'ab-left', name: 'Left Abdomen (SubQ)' },
  { id: 'ab-right', name: 'Right Abdomen (SubQ)' },
  { id: 'delt-left', name: 'Left Deltoid (IM / SubQ)' },
  { id: 'delt-right', name: 'Right Deltoid (IM / SubQ)' },
  { id: 'glute-left', name: 'Left Ventrogluteal (IM)' },
  { id: 'glute-right', name: 'Right Ventrogluteal (IM)' },
  { id: 'quad-left', name: 'Left Vastus Lateralis (IM)' },
  { id: 'quad-right', name: 'Right Vastus Lateralis (IM)' }
];

const SKIN_SENSITIVITY_OPTIONS = [
  'Normal (No Reaction)',
  'Mild Redness / Transient Erythema',
  'Localized SubQ Wheal / Itch',
  'Heightened Tactile Sensation',
  'Mild Tenderness / Bruising',
  'Other / Custom'
];

export default function DosingCalendarView({
  injections = [],
  dailyLogs = [],
  onAddDailyLog,
  onUpdateDailyLogs,
  subjectiveWellness = [],
  onAddWellness,
  onUpdateWellness,
  cycleData
}) {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth()); // 0-indexed
  const [selectedDateStr, setSelectedDateStr] = useState(getLocalDateKey(today));

  // Modal / Inline Form States
  const [isMissedModalOpen, setIsMissedModalOpen] = useState(false);
  const [isInlineLogOpen, setIsInlineLogOpen] = useState(false);
  const [isEditingDose, setIsEditingDose] = useState(false);
  const [editingLogItem, setEditingLogItem] = useState(null);
  const [isEditingWellness, setIsEditingWellness] = useState(false);

  // Form State for Missed / Edit Dose
  const [doseForm, setDoseForm] = useState({
    protocolId: injections[0]?.id || 'custom',
    name: injections[0]?.name || 'KLOW Blend',
    dose: injections[0]?.dose || '500 mcg',
    site: INJECTION_SITES[0].name,
    time: '08:30',
    cycle_day: 1
  });

  // Form State for Day Wellness / Insights
  const [wellnessForm, setWellnessForm] = useState({
    energy_rating: 8,
    mood_rating: 8,
    brain_fog: 2,
    skin_sensitivity: 'Normal (No Reaction)',
    libido: 7,
    orgasm_strength: 8,
    joint_health: 8,
    notes: ''
  });

  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 2500);
  };

  // Calendar Helpers
  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay(); // 0 = Sun

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => {
    sound.playClick();
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    sound.playClick();
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleTodayJump = () => {
    sound.playClick();
    const now = new Date();
    setCurrentYear(now.getFullYear());
    setCurrentMonth(now.getMonth());
    setSelectedDateStr(getLocalDateKey(now));
  };

  // Format Helper YYYY-MM-DD
  const formatKey = (year, month, day) => {
    const m = String(month + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${year}-${m}-${d}`;
  };

  // Cycle Phase Estimator based on date
  const getCycleInfoForDate = (dateStr) => {
    if (!cycleData?.lastPeriodStart) return { cycleDay: 14, phase: 'Ovulatory', color: 'var(--accent-pink)' };
    const periodStart = new Date(cycleData.lastPeriodStart);
    const [y, m, d] = dateStr.split('-').map(Number);
    const target = new Date(y, m - 1, d);
    const diffDays = Math.floor((target - periodStart) / (1000 * 60 * 60 * 24));
    const cycleLength = cycleData.averageLength || 28;
    const cycleDay = ((((diffDays % cycleLength) + cycleLength) % cycleLength) + 1);

    let phase = 'Follicular';
    let color = 'var(--accent-cyan)';
    if (cycleDay >= 1 && cycleDay <= 5) {
      phase = 'Menstrual';
      color = 'var(--accent-pink)';
    } else if (cycleDay >= 6 && cycleDay <= 11) {
      phase = 'Follicular';
      color = 'var(--accent-cyan)';
    } else if (cycleDay >= 12 && cycleDay <= 16) {
      phase = 'Ovulatory 🔥';
      color = 'var(--accent-amber)';
    } else {
      phase = 'Luteal';
      color = 'var(--accent-purple)';
    }

    return { cycleDay, phase, color };
  };

  // Get logs for specific date (Timezone-Safe!)
  const getLogsForDate = (dateStr) => {
    return dailyLogs.filter(log => {
      const logDateKey = getLocalDateKey(log.timestamp);
      return logDateKey === dateStr;
    });
  };

  // Get wellness for specific date (Timezone-Safe!)
  const getWellnessForDate = (dateStr) => {
    return subjectiveWellness.find(w => {
      const wDateKey = getLocalDateKey(w.timestamp || w.date);
      return wDateKey === dateStr;
    });
  };

  // Handle Day Selection
  const handleSelectDay = (dateStr) => {
    sound.playClick();
    setSelectedDateStr(dateStr);
    setIsInlineLogOpen(false);

    // Populate Day Wellness Form if exists
    const existingW = getWellnessForDate(dateStr);
    if (existingW) {
      setWellnessForm({
        energy_rating: existingW.energy_rating || 8,
        mood_rating: existingW.mood_rating || 8,
        brain_fog: existingW.brain_fog || 2,
        skin_sensitivity: existingW.skin_sensitivity || 'Normal (No Reaction)',
        libido: existingW.libido || 7,
        orgasm_strength: existingW.orgasm_strength || 8,
        joint_health: existingW.joint_health || 8,
        notes: existingW.notes || ''
      });
    } else {
      setWellnessForm({
        energy_rating: 8,
        mood_rating: 8,
        brain_fog: 2,
        skin_sensitivity: 'Normal (No Reaction)',
        libido: 7,
        orgasm_strength: 8,
        joint_health: 8,
        notes: ''
      });
    }
  };

  // Open Missed Dose Modal for Selected Date
  const handleOpenAddMissedForDate = () => {
    sound.playClick();
    const targetDate = selectedDateStr || getLocalDateKey(new Date());
    const firstInj = injections[0];
    const computedProtocolCycleDay = calculateDynamicCycleDayForDate(
      dailyLogs,
      targetDate,
      firstInj?.name || 'KLOW'
    );

    setDoseForm({
      protocolId: firstInj?.id || 'custom',
      name: firstInj?.name || 'KLOW Blend',
      dose: firstInj?.dose || '500 mcg',
      site: INJECTION_SITES[0].name,
      time: '08:30',
      cycle_day: computedProtocolCycleDay
    });
    setIsMissedModalOpen(true);
  };

  // Save Missed Dose (Timezone-Safe with Auto Cycle Day Recalibration!)
  const handleSaveMissedDose = (e) => {
    e.preventDefault();
    sound.playSuccess();
    const item = injections.find(i => i.id === doseForm.protocolId) || { name: doseForm.name };
    const dateToUse = selectedDateStr || getLocalDateKey(new Date());
    const combinedTimestamp = createLocalTimestamp(dateToUse, doseForm.time || '08:30');
    const displayTime = formatDisplayDateTime(combinedTimestamp);

    // Calculate dynamic cycle day based on earliest logged date
    const computedProtocolDay = calculateDynamicCycleDayForDate(
      dailyLogs,
      dateToUse,
      item.name || doseForm.name
    );

    const newLog = {
      id: 'log-' + Date.now(),
      protocol_id: doseForm.protocolId || 'custom',
      compoundKey: (item.name || doseForm.name || 'peptide').toLowerCase(),
      name: item.name || doseForm.name || 'Peptide',
      actual_dose_mcg: parseFloat(doseForm.dose) || 250,
      dose: doseForm.dose,
      site: doseForm.site,
      timestamp: combinedTimestamp,
      displayTime,
      dose_taken: true,
      cycle_day: computedProtocolDay
    };

    if (onAddDailyLog) {
      onAddDailyLog(newLog);
    }
    setIsMissedModalOpen(false);
    setIsInlineLogOpen(false);
    showToast(`Logged ${newLog.name} for ${dateToUse} (Protocol Day ${computedProtocolDay})`);
  };

  // Edit an Existing Dose from Calendar
  const handleStartEditDose = (log) => {
    sound.playClick();
    setEditingLogItem(log);
    const logDate = new Date(log.timestamp);
    const timeStr = !isNaN(logDate.getTime()) ? logDate.toTimeString().slice(0, 5) : '08:30';

    setDoseForm({
      protocolId: log.protocol_id || '',
      name: log.name,
      dose: log.dose || `${log.actual_dose_mcg || 250} mcg`,
      site: log.site || INJECTION_SITES[0].name,
      time: timeStr,
      cycle_day: log.cycle_day || 1
    });
    setIsEditingDose(true);
  };

  // Save Edited Dose
  const handleSaveEditedDose = (e) => {
    e.preventDefault();
    if (!editingLogItem) return;
    sound.playChime();

    const dateToUse = selectedDateStr || getLocalDateKey(new Date());
    const combinedTimestamp = createLocalTimestamp(dateToUse, doseForm.time || '08:30');
    const displayTime = formatDisplayDateTime(combinedTimestamp);

    const updated = dailyLogs.map(item => {
      if (item.id === editingLogItem.id) {
        return {
          ...item,
          protocol_id: doseForm.protocolId,
          name: doseForm.name,
          actual_dose_mcg: parseFloat(doseForm.dose) || 250,
          dose: doseForm.dose,
          site: doseForm.site,
          timestamp: combinedTimestamp,
          displayTime
        };
      }
      return item;
    });

    if (onUpdateDailyLogs) {
      onUpdateDailyLogs(updated);
    }
    setIsEditingDose(false);
    setEditingLogItem(null);
    showToast('Dose updated successfully');
  };

  // Delete Dose from Calendar
  const handleDeleteDoseFromCalendar = (id) => {
    sound.playAlert();
    if (window.confirm('Delete this dose administration record? Cycle days will automatically recalibrate.')) {
      const updated = dailyLogs.filter(i => i.id !== id);
      if (onUpdateDailyLogs) {
        onUpdateDailyLogs(updated);
      }
      showToast('Dose deleted');
    }
  };

  // Save / Update Daily Insights & Wellness for Selected Date
  const handleSaveDayWellness = (e) => {
    e.preventDefault();
    sound.playSuccess();

    const dateToUse = selectedDateStr || getLocalDateKey(new Date());
    const existingW = getWellnessForDate(dateToUse);
    const combinedTimestamp = createLocalTimestamp(dateToUse, '12:00');

    if (existingW) {
      // Update existing
      const updatedList = subjectiveWellness.map(w => {
        if (w.id === existingW.id) {
          return {
            ...w,
            energy_rating: Number(wellnessForm.energy_rating),
            mood_rating: Number(wellnessForm.mood_rating),
            brain_fog: Number(wellnessForm.brain_fog),
            skin_sensitivity: wellnessForm.skin_sensitivity,
            libido: Number(wellnessForm.libido),
            orgasm_strength: Number(wellnessForm.orgasm_strength),
            joint_health: Number(wellnessForm.joint_health),
            notes: wellnessForm.notes.trim()
          };
        }
        return w;
      });
      if (onUpdateWellness) {
        onUpdateWellness(updatedList);
      }
    } else {
      // Add new for this day
      const newWellness = {
        id: 'ass-' + Date.now(),
        date: dateToUse,
        timestamp: combinedTimestamp,
        energy_rating: Number(wellnessForm.energy_rating),
        mood_rating: Number(wellnessForm.mood_rating),
        brain_fog: Number(wellnessForm.brain_fog),
        skin_sensitivity: wellnessForm.skin_sensitivity,
        libido: Number(wellnessForm.libido),
        orgasm_strength: Number(wellnessForm.orgasm_strength),
        joint_health: Number(wellnessForm.joint_health),
        notes: wellnessForm.notes.trim()
      };
      if (onAddWellness) {
        onAddWellness(newWellness);
      }
    }

    setIsEditingWellness(false);
    showToast(`Insights saved for ${dateToUse}`);
  };

  // Build Calendar Matrix
  const totalDays = daysInMonth(currentYear, currentMonth);
  const startOffset = firstDayOfMonth(currentYear, currentMonth); // blanks before 1st
  const calendarCells = [];
  const todayKey = getLocalDateKey(today);

  for (let i = 0; i < startOffset; i++) {
    calendarCells.push({ type: 'blank', key: `blank-${i}` });
  }

  for (let d = 1; d <= totalDays; d++) {
    const dateKey = formatKey(currentYear, currentMonth, d);
    const dayLogs = getLogsForDate(dateKey);
    const dayWellness = getWellnessForDate(dateKey);
    const cycleInfo = getCycleInfoForDate(dateKey);
    const isSelected = dateKey === selectedDateStr;
    const isTodayCell = dateKey === todayKey;

    // Dynamic protocol day computation for badge display
    let protocolCycleDay = null;
    if (dayLogs.length > 0) {
      protocolCycleDay = dayLogs[0].cycle_day;
    } else if (dailyLogs.length > 0) {
      protocolCycleDay = calculateDynamicCycleDayForDate(dailyLogs, dateKey);
    }

    calendarCells.push({
      type: 'day',
      dayNumber: d,
      dateKey,
      dayLogs,
      dayWellness,
      cycleInfo,
      protocolCycleDay,
      isSelected,
      isTodayCell
    });
  }

  // Selected Day Details
  const selectedDayLogs = getLogsForDate(selectedDateStr);
  const selectedDayWellness = getWellnessForDate(selectedDateStr);
  const selectedCycleInfo = getCycleInfoForDate(selectedDateStr);

  const selectedDynamicProtocolDay = selectedDayLogs.length > 0
    ? selectedDayLogs[0].cycle_day
    : calculateDynamicCycleDayForDate(dailyLogs, selectedDateStr);

  const [selY, selM, selD] = selectedDateStr.split('-').map(Number);
  const selectedDateObj = new Date(selY, selM - 1, selD);
  const selectedFormattedTitle = selectedDateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div style={{ animation: 'popIn 0.25s ease', width: '100%' }}>
      {/* Top Header */}
      <div className="section-header">
        <div>
          <h2>Master Dosing & Insights Calendar</h2>
          <p>Full chronological view of past administrations with automatic protocol cycle day tracking (Day 1 begins at your earliest log). Click any date to edit records or add missed doses.</p>
        </div>
        {toastMsg && (
          <span className="badge badge-green" style={{ fontSize: '13px', padding: '6px 14px' }}>
            ✓ {toastMsg}
          </span>
        )}
      </div>

      {/* Main Grid: Calendar View + Day Detail Inspector Panel */}
      <div className="calendar-view-grid">
        
        {/* CALENDAR VIEW */}
        <div className="card" style={{ minWidth: 0, width: '100%', padding: '20px', margin: 0, boxSizing: 'border-box' }}>
          
          {/* Month Navigation Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <h3 style={{ fontSize: '22px', fontWeight: '800', color: '#fff', margin: 0 }}>
                {monthNames[currentMonth]} {currentYear}
              </h3>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ fontSize: '13px', padding: '6px 14px', minHeight: '38px' }}
                onClick={handleTodayJump}
              >
                Today
              </button>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ fontSize: '14px', padding: '8px 16px', minHeight: '42px' }}
                onClick={handlePrevMonth}
              >
                ◀ Prev
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ fontSize: '14px', padding: '8px 16px', minHeight: '42px' }}
                onClick={handleNextMonth}
              >
                Next ▶
              </button>
            </div>
          </div>

          {/* Weekday Labels (7 Equal Responsive Tracks) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', textAlign: 'center', fontSize: '12px', fontWeight: '800', color: 'var(--text-muted)', marginBottom: '10px', width: '100%' }}>
            <div>SUN</div>
            <div>MON</div>
            <div>TUE</div>
            <div>WED</div>
            <div>THU</div>
            <div>FRI</div>
            <div>SAT</div>
          </div>

          {/* Calendar Grid (7 Equal Responsive Tracks with No Overflow) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', gap: '8px', width: '100%' }}>
            {calendarCells.map((cell) => {
              if (cell.type === 'blank') {
                return <div key={cell.key} style={{ minHeight: '96px', minWidth: 0, background: 'rgba(255,255,255,0.01)', borderRadius: '10px' }} />;
              }

              const hasWellness = !!cell.dayWellness;

              return (
                <div
                  key={cell.dateKey}
                  onClick={() => handleSelectDay(cell.dateKey)}
                  style={{
                    minHeight: '98px',
                    minWidth: 0,
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '8px 6px',
                    borderRadius: '10px',
                    background: cell.isSelected
                      ? 'rgba(56, 189, 248, 0.16)'
                      : cell.isTodayCell
                      ? 'rgba(244, 114, 182, 0.1)'
                      : 'rgba(255,255,255,0.03)',
                    border: cell.isSelected
                      ? '2px solid var(--accent-cyan)'
                      : cell.isTodayCell
                      ? '1.5px solid var(--accent-pink)'
                      : '1px solid var(--border)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'all 0.15s ease',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={(e) => {
                    if (!cell.isSelected) e.currentTarget.style.borderColor = 'rgba(0, 242, 254, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    if (!cell.isSelected && !cell.isTodayCell) e.currentTarget.style.borderColor = 'var(--border)';
                  }}
                >
                  {/* Date number + Protocol Day & Cycle day badges */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <span style={{ fontSize: '13px', fontWeight: cell.isTodayCell ? '800' : '600', color: cell.isTodayCell ? 'var(--accent-pink)' : '#fff' }}>
                      {cell.dayNumber}
                    </span>
                    
                    {/* Auto-Calculated Protocol Cycle Day */}
                    {cell.protocolCycleDay !== null && (
                      <span style={{ fontSize: '8.5px', background: 'rgba(0, 242, 254, 0.15)', color: 'var(--accent-cyan)', padding: '1px 3px', borderRadius: '3px', fontWeight: '700', whiteSpace: 'nowrap' }}>
                        P-D{cell.protocolCycleDay}
                      </span>
                    )}
                  </div>

                  {/* Doses Indicators */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', margin: '3px 0', width: '100%' }}>
                    {cell.dayLogs.slice(0, 2).map((l, lIdx) => (
                      <div
                        key={lIdx}
                        style={{
                          fontSize: '9px',
                          background: 'rgba(0, 242, 254, 0.12)',
                          color: 'var(--accent-cyan)',
                          padding: '1px 3px',
                          borderRadius: '3px',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          fontWeight: '600',
                          width: '100%'
                        }}
                        title={`${l.name} (${l.dose})`}
                      >
                        💉 {l.name.split(' (')[0]}
                      </div>
                    ))}
                    {cell.dayLogs.length > 2 && (
                      <span style={{ fontSize: '8.5px', color: 'var(--text-muted)' }}>+{cell.dayLogs.length - 2} more</span>
                    )}
                  </div>

                  {/* Bottom Indicators (Wellness / Cycle Phase) */}
                  <div style={{ display: 'flex', gap: '2px', alignItems: 'center', justifyContent: 'space-between', fontSize: '9px', width: '100%' }}>
                    <span style={{ color: cell.cycleInfo.color, fontWeight: '600', whiteSpace: 'nowrap' }}>
                      🌸 D{cell.cycleInfo.cycleDay}
                    </span>
                    
                    <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
                      {hasWellness && (
                        <span title={`Energy: ${cell.dayWellness.energy_rating}/10, Libido: ${cell.dayWellness.libido || 7}/10`}>
                          ✨
                        </span>
                      )}
                      {cell.dayWellness?.notes && (
                        <span title={cell.dayWellness.notes}>📝</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* DAY INSPECTOR & EDITING DRAWER */}
        <div className="card" style={{ minWidth: 0, width: '100%', padding: '24px', margin: 0, boxSizing: 'border-box' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border)', paddingBottom: '14px', marginBottom: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="badge badge-cyan" style={{ fontSize: '10.5px' }}>
                  Protocol Day {selectedDynamicProtocolDay}
                </span>
                <span className="badge badge-pink" style={{ fontSize: '10.5px' }}>
                  Cycle Day {selectedCycleInfo.cycleDay} ({selectedCycleInfo.phase})
                </span>
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#fff', margin: '6px 0 0 0' }}>
                {selectedFormattedTitle}
              </h3>
            </div>

            <button
              type="button"
              className="btn btn-primary"
              style={{ fontSize: '13.5px', padding: '10px 18px', minHeight: '44px' }}
              onClick={handleOpenAddMissedForDate}
            >
              + Log Dose for Day
            </button>
          </div>

          {/* INLINE QUICK DOSE FORM */}
          {isInlineLogOpen && (
            <form onSubmit={handleSaveMissedDose} style={{ background: 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.35)', padding: '18px', borderRadius: '12px', marginBottom: '18px' }}>
              <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--accent-cyan)', marginBottom: '12px' }}>
                💉 Record Dose for {selectedDateStr} (Protocol Day {selectedDynamicProtocolDay}):
              </div>
              
              <div style={{ marginBottom: '12px' }}>
                <label className="input-label" style={{ fontSize: '12px' }}>Select Compound</label>
                <select
                  className="select-field"
                  style={{ fontSize: '14.5px', padding: '11px 14px', minHeight: '46px' }}
                  value={doseForm.protocolId}
                  onChange={(e) => {
                    const sel = injections.find(i => i.id === e.target.value);
                    setDoseForm({
                      ...doseForm,
                      protocolId: e.target.value,
                      name: sel?.name || doseForm.name,
                      dose: sel?.dose || doseForm.dose
                    });
                  }}
                >
                  {injections.map((inj) => (
                    <option key={inj.id} value={inj.id}>{inj.name} ({inj.dose})</option>
                  ))}
                  <option value="custom">-- Custom Other Peptide --</option>
                </select>
              </div>

              {doseForm.protocolId === 'custom' && (
                <div style={{ marginBottom: '12px' }}>
                  <label className="input-label" style={{ fontSize: '12px' }}>Custom Name</label>
                  <input
                    type="text"
                    className="input-field"
                    style={{ fontSize: '14.5px', padding: '11px 14px', minHeight: '46px' }}
                    value={doseForm.name}
                    onChange={(e) => setDoseForm({ ...doseForm, name: e.target.value })}
                    placeholder="e.g. BPC-157"
                    required
                  />
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                <div>
                  <label className="input-label" style={{ fontSize: '12px' }}>Dose</label>
                  <input
                    type="text"
                    className="input-field"
                    style={{ fontSize: '14.5px', padding: '11px 14px', minHeight: '46px' }}
                    value={doseForm.dose}
                    onChange={(e) => setDoseForm({ ...doseForm, dose: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="input-label" style={{ fontSize: '12px' }}>Site</label>
                  <select
                    className="select-field"
                    style={{ fontSize: '14.5px', padding: '11px 14px', minHeight: '46px' }}
                    value={doseForm.site}
                    onChange={(e) => setDoseForm({ ...doseForm, site: e.target.value })}
                  >
                    {INJECTION_SITES.map(s => (
                      <option key={s.id} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
                <div>
                  <label className="input-label" style={{ fontSize: '12px' }}>Time</label>
                  <input
                    type="time"
                    className="input-field"
                    style={{ fontSize: '14.5px', padding: '11px 14px', minHeight: '46px' }}
                    value={doseForm.time}
                    onChange={(e) => setDoseForm({ ...doseForm, time: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="input-label" style={{ fontSize: '12px' }}>Auto Protocol Day</label>
                  <input
                    type="text"
                    className="input-field"
                    style={{ fontSize: '14.5px', padding: '11px 14px', minHeight: '46px', background: 'rgba(0,0,0,0.3)', color: 'var(--accent-cyan)', fontWeight: '700' }}
                    value={`Day ${selectedDynamicProtocolDay}`}
                    disabled
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ fontSize: '13px', padding: '8px 14px', minHeight: '40px' }}
                  onClick={() => setIsInlineLogOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ fontSize: '13px', padding: '8px 18px', minHeight: '40px' }}
                >
                  ✓ Save Dose
                </button>
              </div>
            </form>
          )}

          {/* SECTION 1: DOSES LOGGED ON THIS DAY */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '13px', fontWeight: '700', color: '#fff' }}>
                💉 Administrations on this Day ({selectedDayLogs.length})
              </span>
              {!isInlineLogOpen && (
                <button
                  type="button"
                  onClick={() => { sound.playClick(); setIsInlineLogOpen(true); }}
                  style={{ background: 'transparent', border: 'none', color: 'var(--accent-cyan)', fontSize: '11.5px', fontWeight: '700', cursor: 'pointer' }}
                >
                  + Quick Add
                </button>
              )}
            </div>

            {selectedDayLogs.length === 0 ? (
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border)', textAlign: 'center', color: 'var(--text-muted)', fontSize: '12.5px' }}>
                No injections logged for this date. Click <strong>"+ Log Dose for Day"</strong> if you missed logging one.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {selectedDayLogs.map((log) => (
                  <div
                    key={log.id}
                    style={{
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      padding: '10px 14px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '14px', fontWeight: '700', color: '#fff' }}>{log.name}</span>
                        <span className="badge badge-cyan" style={{ fontSize: '9.5px', padding: '1px 5px' }}>
                          Day {log.cycle_day || selectedDynamicProtocolDay}
                        </span>
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                        {log.dose || `${log.actual_dose_mcg} mcg`} • <span style={{ color: 'var(--text-muted)' }}>{log.site}</span>
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '2px' }}>
                        Time: {log.displayTime || log.timestamp}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        style={{ padding: '6px 12px', fontSize: '12px', minHeight: '36px', color: 'var(--accent-cyan)' }}
                        onClick={() => handleStartEditDose(log)}
                        title="Edit dose"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger"
                        style={{ padding: '6px 12px', fontSize: '12px', minHeight: '36px' }}
                        onClick={() => handleDeleteDoseFromCalendar(log.id)}
                        title="Delete dose"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SECTION 2: SUBJECTIVE WELLNESS & INSIGHTS FOR THIS DAY */}
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <span style={{ fontSize: '14px', fontWeight: '800', color: '#fff' }}>
                🌸 Daily Insights & Physiological Wellness
              </span>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ fontSize: '12.5px', padding: '6px 12px', minHeight: '36px' }}
                onClick={() => setIsEditingWellness(!isEditingWellness)}
              >
                {isEditingWellness ? '✕ Cancel' : selectedDayWellness ? '✏️ Edit Insights' : '+ Add Insights'}
              </button>
            </div>

            {!isEditingWellness ? (
              selectedDayWellness ? (
                <div style={{ background: 'rgba(244, 114, 182, 0.06)', border: '1px solid rgba(244, 114, 182, 0.25)', padding: '16px', borderRadius: '12px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '12px' }}>
                    <div style={{ fontSize: '12.5px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Energy: </span>
                      <strong style={{ color: 'var(--accent-cyan)', fontSize: '13.5px' }}>{selectedDayWellness.energy_rating}/10</strong>
                    </div>
                    <div style={{ fontSize: '12.5px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Mood: </span>
                      <strong style={{ color: 'var(--accent-pink)', fontSize: '13.5px' }}>{selectedDayWellness.mood_rating}/10</strong>
                    </div>
                    <div style={{ fontSize: '12.5px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Libido: </span>
                      <strong style={{ color: 'var(--accent-purple)', fontSize: '13.5px' }}>{selectedDayWellness.libido || 7}/10</strong>
                    </div>
                  </div>

                  <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                    Skin / Reaction: <strong style={{ color: '#fff' }}>{selectedDayWellness.skin_sensitivity || 'Normal'}</strong>
                  </div>

                  {selectedDayWellness.notes && (
                    <div style={{ fontSize: '13px', color: 'var(--text-main)', fontStyle: 'italic', background: 'rgba(0,0,0,0.25)', padding: '10px 12px', borderRadius: '8px', marginTop: '8px' }}>
                      "{selectedDayWellness.notes}"
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border)', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                  No wellness telemetry recorded for this day. Click <strong>"+ Add Insights"</strong> to record how you felt.
                </div>
              )
            ) : (
              /* Inline Wellness Form */
              <form onSubmit={handleSaveDayWellness} style={{ background: 'rgba(0,0,0,0.35)', padding: '18px', borderRadius: '12px', border: '1px solid var(--accent-pink)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                  <div>
                    <label className="input-label" style={{ fontSize: '12px' }}>Energy ({wellnessForm.energy_rating}/10)</label>
                    <input
                      type="range" min="1" max="10"
                      value={wellnessForm.energy_rating}
                      onChange={(e) => setWellnessForm({ ...wellnessForm, energy_rating: e.target.value })}
                      style={{ width: '100%', accentColor: 'var(--accent-cyan)', height: '8px' }}
                    />
                  </div>
                  <div>
                    <label className="input-label" style={{ fontSize: '12px' }}>Mood ({wellnessForm.mood_rating}/10)</label>
                    <input
                      type="range" min="1" max="10"
                      value={wellnessForm.mood_rating}
                      onChange={(e) => setWellnessForm({ ...wellnessForm, mood_rating: e.target.value })}
                      style={{ width: '100%', accentColor: 'var(--accent-pink)', height: '8px' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                  <div>
                    <label className="input-label" style={{ fontSize: '12px' }}>Libido ({wellnessForm.libido}/10)</label>
                    <input
                      type="range" min="1" max="10"
                      value={wellnessForm.libido}
                      onChange={(e) => setWellnessForm({ ...wellnessForm, libido: e.target.value })}
                      style={{ width: '100%', accentColor: 'var(--accent-purple)', height: '8px' }}
                    />
                  </div>
                  <div>
                    <label className="input-label" style={{ fontSize: '12px' }}>Orgasm ({wellnessForm.orgasm_strength}/10)</label>
                    <input
                      type="range" min="1" max="10"
                      value={wellnessForm.orgasm_strength}
                      onChange={(e) => setWellnessForm({ ...wellnessForm, orgasm_strength: e.target.value })}
                      style={{ width: '100%', accentColor: 'var(--accent-pink)', height: '8px' }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <label className="input-label" style={{ fontSize: '12px' }}>Skin / Injection Sensitivity</label>
                  <select
                    className="select-field"
                    style={{ fontSize: '14px', padding: '10px 12px', minHeight: '46px' }}
                    value={wellnessForm.skin_sensitivity}
                    onChange={(e) => setWellnessForm({ ...wellnessForm, skin_sensitivity: e.target.value })}
                  >
                    {SKIN_SENSITIVITY_OPTIONS.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label className="input-label" style={{ fontSize: '12px' }}>Day Notes / Sensation Insights</label>
                  <input
                    type="text"
                    className="input-field"
                    style={{ fontSize: '14px', padding: '10px 12px', minHeight: '46px' }}
                    placeholder="e.g. Energy peaked mid-afternoon, optimal recovery."
                    value={wellnessForm.notes}
                    onChange={(e) => setWellnessForm({ ...wellnessForm, notes: e.target.value })}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    style={{ fontSize: '13px', padding: '8px 14px', minHeight: '40px' }}
                    onClick={() => setIsEditingWellness(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" style={{ fontSize: '13px', padding: '8px 18px', minHeight: '40px' }}>
                    ✓ Save Day Insights
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* MODAL: ADD MISSED DOSE FOR SELECTED DATE */}
      {isMissedModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsMissedModalOpen(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 style={{ fontSize: '22px', fontWeight: '800', margin: 0, color: '#fff' }}>
                  + Add Missed Dose for {selectedDateStr}
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
                  Protocol Day {selectedDynamicProtocolDay} automatically calculated from your earliest logged date.
                </p>
              </div>
              <button className="modal-close" onClick={() => setIsMissedModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleSaveMissedDose} style={{ marginTop: '18px' }}>
              <div style={{ marginBottom: '16px' }}>
                <label className="input-label">Select Active Protocol</label>
                <select
                  className="select-field"
                  style={{ minHeight: '48px', fontSize: '15px' }}
                  value={doseForm.protocolId}
                  onChange={(e) => {
                    const sel = injections.find(i => i.id === e.target.value);
                    setDoseForm({
                      ...doseForm,
                      protocolId: e.target.value,
                      name: sel?.name || doseForm.name,
                      dose: sel?.dose || doseForm.dose
                    });
                  }}
                >
                  {injections.map((inj) => (
                    <option key={inj.id} value={inj.id}>{inj.name} ({inj.dose})</option>
                  ))}
                  <option value="custom">-- Custom Other Peptide --</option>
                </select>
              </div>

              {doseForm.protocolId === 'custom' && (
                <div style={{ marginBottom: '16px' }}>
                  <label className="input-label">Custom Compound Name</label>
                  <input
                    type="text"
                    className="input-field"
                    style={{ minHeight: '48px', fontSize: '15px' }}
                    value={doseForm.name}
                    onChange={(e) => setDoseForm({ ...doseForm, name: e.target.value })}
                    placeholder="e.g. BPC-157"
                    required
                  />
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
                <div>
                  <label className="input-label">Dose</label>
                  <input
                    type="text"
                    className="input-field"
                    style={{ minHeight: '48px', fontSize: '15px' }}
                    value={doseForm.dose}
                    onChange={(e) => setDoseForm({ ...doseForm, dose: e.target.value })}
                    placeholder="e.g. 500 mcg"
                    required
                  />
                </div>

                <div>
                  <label className="input-label">Anatomical Site</label>
                  <select
                    className="select-field"
                    style={{ minHeight: '48px', fontSize: '15px' }}
                    value={doseForm.site}
                    onChange={(e) => setDoseForm({ ...doseForm, site: e.target.value })}
                  >
                    {INJECTION_SITES.map((s) => (
                      <option key={s.id} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
                <div>
                  <label className="input-label">Time</label>
                  <input
                    type="time"
                    className="input-field"
                    style={{ minHeight: '48px', fontSize: '15px' }}
                    value={doseForm.time}
                    onChange={(e) => setDoseForm({ ...doseForm, time: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="input-label">Auto Protocol Day</label>
                  <input
                    type="text"
                    className="input-field"
                    style={{ minHeight: '48px', fontSize: '15px', background: 'rgba(0,0,0,0.3)', color: 'var(--accent-cyan)', fontWeight: '700' }}
                    value={`Day ${selectedDynamicProtocolDay}`}
                    disabled
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ minHeight: '46px', padding: '10px 18px', fontSize: '14px' }}
                  onClick={() => setIsMissedModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ minHeight: '46px', padding: '10px 22px', fontSize: '14px' }}>
                  ✓ Add Dose to Calendar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT EXISTING DOSE */}
      {isEditingDose && editingLogItem && (
        <div className="modal-backdrop" onClick={() => setIsEditingDose(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: '800', margin: 0, color: '#fff' }}>
                  ✏️ Edit Calendar Dose Record
                </h3>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
                  Update the dose, injection site, or time for {selectedDateStr}.
                </p>
              </div>
              <button className="modal-close" onClick={() => setIsEditingDose(false)}>✕</button>
            </div>

            <form onSubmit={handleSaveEditedDose} style={{ marginTop: '16px' }}>
              <div style={{ marginBottom: '14px' }}>
                <label className="input-label">Compound Name</label>
                <input
                  type="text"
                  className="input-field"
                  value={doseForm.name}
                  onChange={(e) => setDoseForm({ ...doseForm, name: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label className="input-label">Dose</label>
                  <input
                    type="text"
                    className="input-field"
                    value={doseForm.dose}
                    onChange={(e) => setDoseForm({ ...doseForm, dose: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="input-label">Anatomical Site</label>
                  <select
                    className="select-field"
                    value={doseForm.site}
                    onChange={(e) => setDoseForm({ ...doseForm, site: e.target.value })}
                  >
                    {INJECTION_SITES.map((s) => (
                      <option key={s.id} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '18px' }}>
                <div>
                  <label className="input-label">Time</label>
                  <input
                    type="time"
                    className="input-field"
                    value={doseForm.time}
                    onChange={(e) => setDoseForm({ ...doseForm, time: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="input-label">Auto Protocol Day</label>
                  <input
                    type="text"
                    className="input-field"
                    style={{ background: 'rgba(0,0,0,0.3)', color: 'var(--accent-cyan)' }}
                    value={`Day ${editingLogItem.cycle_day || selectedDynamicProtocolDay}`}
                    disabled
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsEditingDose(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  ✓ Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
