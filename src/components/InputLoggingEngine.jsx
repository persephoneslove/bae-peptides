import React, { useState } from 'react';
import { sound } from '../utils/audio';
import { POPULAR_PEPTIDE_LIBRARY } from './InjectionManager';
import { getLocalDateKey, createLocalTimestamp, formatDisplayDateTime } from '../utils/dateAndCycleUtils';

const INJECTION_SITES = [
  { id: 'ab-left', name: 'Left Abdomen (SubQ)', area: 'Abdominal', coords: 'Left Umbilicus 2in' },
  { id: 'ab-right', name: 'Right Abdomen (SubQ)', area: 'Abdominal', coords: 'Right Umbilicus 2in' },
  { id: 'delt-left', name: 'Left Deltoid (IM / SubQ)', area: 'Shoulder', coords: 'Acromion Lateral' },
  { id: 'delt-right', name: 'Right Deltoid (IM / SubQ)', area: 'Shoulder', coords: 'Acromion Lateral' },
  { id: 'glute-left', name: 'Left Ventrogluteal (IM)', area: 'Gluteal', coords: 'Upper Outer Quadrant' },
  { id: 'glute-right', name: 'Right Ventrogluteal (IM)', area: 'Gluteal', coords: 'Upper Outer Quadrant' },
  { id: 'quad-left', name: 'Left Vastus Lateralis (IM)', area: 'Thigh', coords: 'Mid-Outer Thigh' },
  { id: 'quad-right', name: 'Right Vastus Lateralis (IM)', area: 'Thigh', coords: 'Mid-Outer Thigh' }
];

const SKIN_SENSITIVITY_OPTIONS = [
  'Normal (No Reaction)',
  'Mild Redness / Transient Erythema',
  'Localized SubQ Wheal / Itch',
  'Heightened Tactile Sensation',
  'Mild Tenderness / Bruising',
  'Other / Custom'
];

export default function InputLoggingEngine({
  injections = [],
  onUpdateInjections,
  vitamins = [],
  wellnessLogs = [],
  dailyLogs = [],
  onAddDailyLog,
  onUpdateDailyLogs,
  subjectiveWellness = [],
  onAddWellness,
  onUpdateVitamins,
  onUpdateWellness,
  cycleData
}) {
  const [selectedProtocolId, setSelectedProtocolId] = useState(injections[0]?.id || '');
  const [actualDose, setActualDose] = useState(injections[0]?.dose || '250 mcg');
  const [selectedSite, setSelectedSite] = useState(INJECTION_SITES[0].name);

  // Time-Shifted Historical Timestamp State for Logging
  const [isTimeShifted, setIsTimeShifted] = useState(false);
  const [customDate, setCustomDate] = useState(new Date().toISOString().split('T')[0]);
  const [customTime, setCustomTime] = useState(
    new Date().toTimeString().slice(0, 5) // "HH:MM"
  );
  const [customCycleDay, setCustomCycleDay] = useState(cycleData?.currentDay || 14);

  // Subjective Wellness State (Expanded Physiological Metrics)
  const [energyRating, setEnergyRating] = useState(8);
  const [moodRating, setMoodRating] = useState(8);
  const [brainFog, setBrainFog] = useState(2);
  const [skinSensitivity, setSkinSensitivity] = useState(SKIN_SENSITIVITY_OPTIONS[0]);
  const [customSkinReaction, setCustomSkinReaction] = useState('');
  const [libido, setLibido] = useState(7);
  const [orgasmStrength, setOrgasmStrength] = useState(8);
  const [jointHealth, setJointHealth] = useState(8);
  const [notes, setNotes] = useState('');

  // Dose History Log Filter & Modal States
  const [historyDateFilter, setHistoryDateFilter] = useState('ALL'); // 'ALL' | 'TODAY' | 'YESTERDAY' | 'WEEK' | 'CUSTOM'
  const [customFilterDate, setCustomFilterDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Missed Dose Modal & Edit Modal
  const [isMissedModalOpen, setIsMissedModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingLog, setEditingLog] = useState(null);

  // Add New Compound / Protocol Modal State
  const [isAddPeptideModalOpen, setIsAddPeptideModalOpen] = useState(false);
  const [newPeptideSearch, setNewPeptideSearch] = useState('');
  const [newPeptideForm, setNewPeptideForm] = useState({
    name: '',
    dose: '250 mcg',
    units: 10,
    frequency: 'Daily (AM)',
    timing: 'Morning Fasted',
    category: 'Cellular Longevity & Repair',
    start_date: new Date().toISOString().split('T')[0],
    cycle_duration: 30,
    cycle_days_on: 5,
    cycle_days_off: 2
  });

  // Edit / Missed Form Fields
  const [modalForm, setModalForm] = useState({
    protocolId: '',
    name: '',
    dose: '250 mcg',
    site: INJECTION_SITES[0].name,
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    cycle_day: cycleData?.currentDay || 14
  });

  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2500);
  };

  const handleProtocolSelect = (id) => {
    setSelectedProtocolId(id);
    const item = injections.find(i => i.id === id);
    if (item) setActualDose(item.dose);
  };

  // Build timestamp helper
  const getLogTimestamp = (dateStr, timeStr) => {
    try {
      const combined = new Date(`${dateStr}T${timeStr}:00`);
      if (!isNaN(combined.getTime())) {
        return combined.toISOString();
      }
    } catch (e) {
      console.error('Date parse error', e);
    }
    return new Date().toISOString();
  };

  const formatDisplayTime = (isoString) => {
    const d = new Date(isoString);
    const isToday = d.toDateString() === new Date().toDateString();
    const isYesterday = d.toDateString() === new Date(Date.now() - 86400000).toDateString();
    const timeFormatted = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    if (isToday) return `Today ${timeFormatted}`;
    if (isYesterday) return `Yesterday ${timeFormatted}`;
    return `${d.toLocaleDateString([], { month: 'short', day: 'numeric' })} ${timeFormatted}`;
  };

  // Submit live or time-shifted injection log
  const handleLogInjectionSubmit = (e) => {
    e.preventDefault();
    sound.playSuccess();
    const item = injections.find(i => i.id === selectedProtocolId) || injections[0];

    const timestamp = isTimeShifted
      ? createLocalTimestamp(customDate, customTime)
      : new Date().toISOString();

    const displayTime = formatDisplayDateTime(timestamp);

    const newLog = {
      id: 'log-' + Date.now(),
      protocol_id: selectedProtocolId || item?.id || 'custom',
      compoundKey: (item?.name || 'bpc-157').toLowerCase(),
      name: item?.name || 'Peptide',
      actual_dose_mcg: parseFloat(actualDose) || 250,
      dose: actualDose,
      site: selectedSite,
      timestamp,
      displayTime,
      dose_taken: true,
      cycle_day: isTimeShifted ? parseInt(customCycleDay) || 14 : (cycleData?.currentDay || 14)
    };

    onAddDailyLog(newLog);
    showToast(`Logged ${item?.name || 'Peptide'} (${isTimeShifted ? 'Retroactive' : 'Live'}) into ${selectedSite}`);

    // Reset time-shifted inputs
    if (isTimeShifted) {
      setIsTimeShifted(false);
    }
  };

  // Submit Subjective Wellness Check-in
  const handleWellnessSubmit = (e) => {
    e.preventDefault();
    sound.playSuccess();

    const finalSensitivity = skinSensitivity === 'Other / Custom'
      ? (customSkinReaction.trim() || 'Custom Reaction')
      : skinSensitivity;

    const newWellness = {
      id: 'ass-' + Date.now(),
      date: new Date().toLocaleDateString(),
      timestamp: new Date().toISOString(),
      energy_rating: Number(energyRating),
      mood_rating: Number(moodRating),
      brain_fog: Number(brainFog),
      skin_sensitivity: finalSensitivity,
      libido: Number(libido),
      orgasm_strength: Number(orgasmStrength),
      joint_health: Number(jointHealth),
      notes: notes.trim()
    };

    onAddWellness(newWellness);
    setNotes('');
    showToast('Subjective Wellness Logged with Expanded Telemetry');
  };

  // Toggle Vitamins
  const handleToggleVitamin = (id) => {
    sound.playSuccess();
    if (!onUpdateVitamins) return;
    const updated = vitamins.map(v => v.id === id ? { ...v, takenToday: !v.takenToday } : v);
    onUpdateVitamins(updated);
    showToast('Supplement status updated');
  };

  // Open "Add Past Missed Dose" Modal
  const handleOpenMissedModal = () => {
    sound.playClick();
    const firstInj = injections[0];
    setModalForm({
      protocolId: firstInj?.id || '',
      name: firstInj?.name || 'Peptide',
      dose: firstInj?.dose || '250 mcg',
      site: INJECTION_SITES[0].name,
      date: new Date().toISOString().split('T')[0],
      time: '08:00',
      cycle_day: cycleData?.currentDay || 14
    });
    setIsMissedModalOpen(true);
  };

  // Save Past Missed Dose
  const handleSaveMissedDose = (e) => {
    e.preventDefault();
    sound.playSuccess();
    const item = injections.find(i => i.id === modalForm.protocolId) || { name: modalForm.name };
    const timestamp = getLogTimestamp(modalForm.date, modalForm.time);
    const displayTime = formatDisplayTime(timestamp);

    const newLog = {
      id: 'log-' + Date.now(),
      protocol_id: modalForm.protocolId || 'custom',
      compoundKey: (item.name || modalForm.name || 'peptide').toLowerCase(),
      name: item.name || modalForm.name || 'Peptide',
      actual_dose_mcg: parseFloat(modalForm.dose) || 250,
      dose: modalForm.dose,
      site: modalForm.site,
      timestamp,
      displayTime,
      dose_taken: true,
      cycle_day: parseInt(modalForm.cycle_day) || 14
    };

    onAddDailyLog(newLog);
    setIsMissedModalOpen(false);
    showToast(`Added historical dose for ${modalForm.date}`);
  };

  // Open Edit Modal for a Record
  const handleOpenEditModal = (log) => {
    sound.playClick();
    setEditingLog(log);
    const logDate = new Date(log.timestamp);
    const dateStr = !isNaN(logDate.getTime()) ? logDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
    const timeStr = !isNaN(logDate.getTime()) ? logDate.toTimeString().slice(0, 5) : '08:00';

    setModalForm({
      protocolId: log.protocol_id || '',
      name: log.name || '',
      dose: log.dose || `${log.actual_dose_mcg || 250} mcg`,
      site: log.site || INJECTION_SITES[0].name,
      date: dateStr,
      time: timeStr,
      cycle_day: log.cycle_day || 14
    });
    setIsEditModalOpen(true);
  };

  // Save Edit Log
  const handleSaveEditLog = (e) => {
    e.preventDefault();
    if (!editingLog) return;
    sound.playChime();

    const timestamp = getLogTimestamp(modalForm.date, modalForm.time);
    const displayTime = formatDisplayTime(timestamp);

    const updatedList = dailyLogs.map((item) => {
      if (item.id === editingLog.id) {
        return {
          ...item,
          protocol_id: modalForm.protocolId,
          name: modalForm.name,
          actual_dose_mcg: parseFloat(modalForm.dose) || 250,
          dose: modalForm.dose,
          site: modalForm.site,
          timestamp,
          displayTime,
          cycle_day: parseInt(modalForm.cycle_day) || 14
        };
      }
      return item;
    });

    if (onUpdateDailyLogs) {
      onUpdateDailyLogs(updatedList);
    }
    setIsEditModalOpen(false);
    setEditingLog(null);
    showToast('Dose record updated successfully');
  };

  // Delete Log Record
  const handleDeleteLog = (id) => {
    sound.playAlert();
    if (window.confirm('Delete this historical dose entry? Efficacy calculations will recalculate.')) {
      const updatedList = dailyLogs.filter(item => item.id !== id);
      if (onUpdateDailyLogs) {
        onUpdateDailyLogs(updatedList);
      }
      showToast('Dose record deleted');
    }
  };

  // Quick Add from Library directly in Logging view
  const handleQuickAddPeptide = (libItem) => {
    sound.playSuccess();
    const newId = 'inj-' + Date.now();
    const created = {
      id: newId,
      ...libItem,
      start_date: new Date().toISOString().split('T')[0],
      cycle_duration: 30,
      cycle_days_on: 5,
      cycle_days_off: 2,
      active: true,
      lastTaken: 'Never',
      site: selectedSite
    };

    if (onUpdateInjections) {
      onUpdateInjections([...injections, created]);
    }
    setSelectedProtocolId(newId);
    setActualDose(libItem.dose);
    setIsAddPeptideModalOpen(false);
    showToast(`Added ${libItem.name.split(' (')[0]} to active stack!`);
  };

  // Custom Peptide Form Submit directly in Logging view
  const handleSaveNewCustomPeptide = (e) => {
    e.preventDefault();
    if (!newPeptideForm.name.trim()) return;
    sound.playSuccess();

    const newId = 'inj-' + Date.now();
    const created = {
      id: newId,
      name: newPeptideForm.name,
      dose: newPeptideForm.dose,
      units: parseInt(newPeptideForm.units) || 10,
      frequency: newPeptideForm.frequency,
      timing: newPeptideForm.timing,
      category: newPeptideForm.category,
      start_date: newPeptideForm.start_date,
      cycle_duration: parseInt(newPeptideForm.cycle_duration) || 30,
      cycle_days_on: parseInt(newPeptideForm.cycle_days_on) || 5,
      cycle_days_off: parseInt(newPeptideForm.cycle_days_off) || 2,
      active: true,
      lastTaken: 'Never',
      site: selectedSite,
      color: '#00f2fe'
    };

    if (onUpdateInjections) {
      onUpdateInjections([...injections, created]);
    }
    setSelectedProtocolId(newId);
    setActualDose(newPeptideForm.dose);
    setIsAddPeptideModalOpen(false);
    showToast(`Added ${newPeptideForm.name} to active stack!`);
  };

  // Tooltip Helper
  const getTooltip = (compoundName) => {
    const name = (compoundName || '').toLowerCase();
    if (name.includes('bpc') || name.includes('klow')) return "For a woman in her late 30s, BPC-157 is excellent for supporting collagen synthesis, speeding up recovery from workouts, and maintaining gut barrier integrity.";
    if (name.includes('mots')) return "MOTS-c mimics exercise at the cellular level. As metabolic rates naturally shift in your 30s, this helps support mitochondrial biogenesis and insulin sensitivity.";
    if (name.includes('ss-31')) return "SS-31 targets the inner mitochondrial membrane (cardiolipin), which is crucial for maintaining cellular energy and fighting oxidative stress as we age.";
    if (name.includes('pt-141') || name.includes('kisspeptin')) return "Central melanocortin & GnRH signaling enhances endogenous libido and pelvic neurotransmission safely without hormonal suppression.";
    return "Supports cellular longevity and optimal biological function.";
  };

  const activeCompound = injections.find(i => i.id === selectedProtocolId) || injections[0];

  // Filtered Library for Quick Add Modal
  const filteredPopularLibrary = (POPULAR_PEPTIDE_LIBRARY || []).filter((item) => {
    const matches = item.name.toLowerCase().includes(newPeptideSearch.toLowerCase()) ||
                    item.category.toLowerCase().includes(newPeptideSearch.toLowerCase());
    return matches;
  });

  // Filtered History Records
  const filteredDailyLogs = dailyLogs.filter((log) => {
    if (historyDateFilter === 'ALL') return true;
    const logDateKey = getLocalDateKey(log.timestamp);
    const todayKey = getLocalDateKey(new Date());
    
    if (historyDateFilter === 'TODAY') {
      return logDateKey === todayKey;
    }
    if (historyDateFilter === 'YESTERDAY') {
      const yestKey = getLocalDateKey(new Date(Date.now() - 86400000));
      return logDateKey === yestKey;
    }
    if (historyDateFilter === 'WEEK') {
      const weekAgo = Date.now() - 7 * 86400000;
      return new Date(log.timestamp).getTime() >= weekAgo;
    }
    if (historyDateFilter === 'CUSTOM') {
      return logDateKey === customFilterDate;
    }
    return true;
  });

  return (
    <div style={{ animation: 'popIn 0.2s ease', width: '100%' }}>
      <div className="section-header">
        <div>
          <h2>Input & Logging Engine</h2>
          <p>Capture real-time and retroactive time-shifted doses, site rotation telemetry, and expanded subjective wellness metrics.</p>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {toastMessage && (
            <span className="badge badge-green" style={{ fontSize: '13px', padding: '6px 14px' }}>
              ✓ {toastMessage}
            </span>
          )}
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => { sound.playClick(); setIsAddPeptideModalOpen(true); }}
            style={{ fontSize: '13px', padding: '9px 18px', borderRadius: '8px' }}
          >
            + Add New Peptide
          </button>
        </div>
      </div>

      <div className="responsive-form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '28px' }}>
        
        {/* INJECTION EXECUTION FORM WITH TIME-SHIFTING */}
        <div className="card" style={{ padding: '24px', margin: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
              <span>💉</span> Log Injection Administration
            </h3>
            
            {/* Time-Shift Toggle Button */}
            <button
              type="button"
              onClick={() => { sound.playClick(); setIsTimeShifted(!isTimeShifted); }}
              className={`btn ${isTimeShifted ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '11px', padding: '5px 10px', borderRadius: '6px' }}
            >
              {isTimeShifted ? '⏳ Retroactive Date ON' : '⏱️ Time-Shift Entry'}
            </button>
          </div>

          <form onSubmit={handleLogInjectionSubmit}>
            <div style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <label className="input-label" style={{ margin: 0 }}>Select Active Compound</label>
                <button
                  type="button"
                  onClick={() => { sound.playClick(); setIsAddPeptideModalOpen(true); }}
                  style={{ background: 'transparent', border: 'none', color: 'var(--accent-cyan)', fontSize: '11.5px', fontWeight: '700', cursor: 'pointer' }}
                >
                  + Add New Peptide
                </button>
              </div>
              <select
                className="select-field"
                value={selectedProtocolId}
                onChange={(e) => handleProtocolSelect(e.target.value)}
              >
                {injections.map((inj) => (
                  <option key={inj.id} value={inj.id}>
                    {inj.name} — ({inj.dose}, {inj.frequency})
                  </option>
                ))}
              </select>
            </div>

            <div className="responsive-two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
              <div>
                <label className="input-label">Administered Dose</label>
                <input
                  type="text"
                  className="input-field"
                  value={actualDose}
                  onChange={(e) => setActualDose(e.target.value)}
                  placeholder="e.g. 500 mcg"
                  required
                />
              </div>

              <div>
                <label className="input-label">Target Anatomical Site</label>
                <select
                  className="select-field"
                  value={selectedSite}
                  onChange={(e) => setSelectedSite(e.target.value)}
                >
                  {INJECTION_SITES.map((site) => (
                    <option key={site.id} value={site.name}>
                      {site.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* TIME-SHIFT INPUTS (RETROACTIVE LOGGING) */}
            {isTimeShifted && (
              <div style={{ background: 'rgba(0, 242, 254, 0.05)', border: '1px solid rgba(0, 242, 254, 0.25)', padding: '14px', borderRadius: '10px', marginBottom: '14px' }}>
                <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--accent-cyan)', marginBottom: '8px' }}>
                  ⏳ Retroactive Entry Parameters:
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '10px' }}>
                  <div>
                    <label className="input-label" style={{ fontSize: '11px' }}>Past Date</label>
                    <input
                      type="date"
                      className="input-field"
                      value={customDate}
                      onChange={(e) => setCustomDate(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="input-label" style={{ fontSize: '11px' }}>Timestamp</label>
                    <input
                      type="time"
                      className="input-field"
                      value={customTime}
                      onChange={(e) => setCustomTime(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="input-label" style={{ fontSize: '11px' }}>Cycle Day</label>
                    <input
                      type="number"
                      min="1"
                      max="35"
                      className="input-field"
                      value={customCycleDay}
                      onChange={(e) => setCustomCycleDay(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '13px', fontSize: '14px', borderRadius: '10px' }}>
              ✓ Confirm {isTimeShifted ? 'Retroactive' : 'Live'} Administration
            </button>
          </form>

          {/* Educational Tooltip */}
          <div style={{ background: 'rgba(255, 182, 193, 0.05)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(255, 182, 193, 0.2)', marginTop: '16px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
             <span style={{ fontSize: '18px' }}>💡</span>
             <div>
               <div style={{ fontSize: '12px', color: 'var(--accent-pink)', fontWeight: '600', marginBottom: '2px' }}>Cellular Insight</div>
               <div style={{ fontSize: '12.5px', color: 'var(--text-main)', lineHeight: '1.5' }}>
                 {getTooltip(activeCompound?.name)}
               </div>
             </div>
          </div>

          {/* Site Rotation Guide */}
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px 14px', borderRadius: '10px', border: '1px solid var(--border)', marginTop: '14px' }}>
            <div style={{ fontSize: '11px', color: 'var(--accent-amber)', fontWeight: '700', textTransform: 'uppercase' }}>
              🎯 Tissue Rotation:
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
              Rotate between abdomen, delts, and glutes to keep subcutaneous tissue healthy.
            </div>
          </div>
        </div>

        {/* SUBJECTIVE WELLNESS ASSESSMENTS (EXPANDED PHYSIOLOGICAL METRICS) */}
        <div className="card" style={{ padding: '24px', margin: 0 }}>
          <h3 style={{ fontSize: '18px', fontWeight: '400', color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🌸</span> Daily Wellness & Physiological Check-In
          </h3>

          <form onSubmit={handleWellnessSubmit}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '16px' }}>
              
              {/* Energy */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', fontWeight: '500', color: 'var(--text-main)', marginBottom: '4px' }}>
                  <span>Daytime Energy</span>
                  <span style={{ color: 'var(--accent-cyan)', fontWeight: '700' }}>{energyRating}/10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={energyRating}
                  onChange={(e) => setEnergyRating(e.target.value)}
                  style={{ width: '100%', accentColor: 'var(--accent-cyan)' }}
                />
              </div>

              {/* Mood */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', fontWeight: '500', color: 'var(--text-main)', marginBottom: '4px' }}>
                  <span>Mood & Emotional Balance</span>
                  <span style={{ color: 'var(--accent-pink)', fontWeight: '700' }}>{moodRating}/10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={moodRating}
                  onChange={(e) => setMoodRating(e.target.value)}
                  style={{ width: '100%', accentColor: 'var(--accent-pink)' }}
                />
              </div>

              {/* Brain Fog */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', fontWeight: '500', color: 'var(--text-main)', marginBottom: '4px' }}>
                  <span>Brain Fog (1 = Clear, 10 = Heavy)</span>
                  <span style={{ color: 'var(--accent-amber)', fontWeight: '700' }}>{brainFog}/10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={brainFog}
                  onChange={(e) => setBrainFog(e.target.value)}
                  style={{ width: '100%', accentColor: 'var(--accent-amber)' }}
                />
              </div>

              {/* Skin Sensitivity / Injection Site Reaction */}
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                <label className="input-label" style={{ color: '#fff', fontSize: '12.5px', marginBottom: '6px' }}>
                  💉 Skin & Injection Site Sensitivity
                </label>
                <select
                  className="select-field"
                  value={skinSensitivity}
                  onChange={(e) => setSkinSensitivity(e.target.value)}
                >
                  {SKIN_SENSITIVITY_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                {skinSensitivity === 'Other / Custom' && (
                  <input
                    type="text"
                    className="input-field"
                    style={{ marginTop: '8px' }}
                    placeholder="Describe injection site reaction or tactile shift..."
                    value={customSkinReaction}
                    onChange={(e) => setCustomSkinReaction(e.target.value)}
                  />
                )}
              </div>

              {/* Libido & Orgasm Strength */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '500', color: 'var(--text-main)', marginBottom: '4px' }}>
                    <span>🔥 Libido</span>
                    <span style={{ color: 'var(--accent-purple)', fontWeight: '700' }}>{libido}/10</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={libido}
                    onChange={(e) => setLibido(e.target.value)}
                    style={{ width: '100%', accentColor: 'var(--accent-purple)' }}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '500', color: 'var(--text-main)', marginBottom: '4px' }}>
                    <span>✨ Orgasm Strength</span>
                    <span style={{ color: 'var(--accent-pink)', fontWeight: '700' }}>{orgasmStrength}/10</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={orgasmStrength}
                    onChange={(e) => setOrgasmStrength(e.target.value)}
                    style={{ width: '100%', accentColor: 'var(--accent-pink)' }}
                  />
                </div>
              </div>

              {/* Joint Health */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', fontWeight: '500', color: 'var(--text-main)', marginBottom: '4px' }}>
                  <span>Joint & Tendon Health</span>
                  <span style={{ color: 'var(--accent-green)', fontWeight: '700' }}>{jointHealth}/10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={jointHealth}
                  onChange={(e) => setJointHealth(e.target.value)}
                  style={{ width: '100%', accentColor: 'var(--accent-green)' }}
                />
              </div>

              {/* Notes */}
              <div>
                <label className="input-label" style={{ color: 'var(--text-main)' }}>Notes / Cycle Sensations</label>
                <input
                  type="text"
                  className="input-field"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Heightened sensation post PT-141, no injection redness."
                />
              </div>
            </div>

            <button type="submit" className="btn btn-secondary" style={{ width: '100%', padding: '13px', fontSize: '14px', borderRadius: '10px', borderColor: 'var(--accent-pink)', color: 'var(--text-main)' }}>
              ✓ Save Wellness Check-In
            </button>
          </form>
        </div>
      </div>

      {/* QUICK VITAMIN CHECKLIST */}
      {vitamins.length > 0 && (
        <div className="card" style={{ padding: '20px 24px', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '17px', fontWeight: '600', color: '#fff', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>💊</span> Log Daily Supplements & Vitamins
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '10px' }}>
            {vitamins.map((v) => (
              <div
                key={v.id}
                onClick={() => handleToggleVitamin(v.id)}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 16px',
                  background: v.takenToday ? 'rgba(5, 255, 161, 0.08)' : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${v.takenToday ? 'var(--accent-green)' : 'var(--border)'}`,
                  borderRadius: '10px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#fff' }}>{v.name}</div>
                  <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>{v.dose} • {v.timeOfDay}</div>
                </div>
                <span className={`badge ${v.takenToday ? 'badge-green' : 'badge-amber'}`} style={{ fontSize: '11px' }}>
                  {v.takenToday ? '✓ Taken' : '○ Tap to Log'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* HISTORICAL LOGGING & EDITING: FULL DOSE HISTORY LOG CRUD */}
      <div className="card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>📜</span> Dose History Log & Retroactive Editor ({dailyLogs.length} Records)
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
              View all past administrations, filter by date, log missed doses, or edit and delete existing records.
            </p>
          </div>

          <button
            type="button"
            className="btn btn-primary"
            onClick={handleOpenMissedModal}
            style={{ fontSize: '12.5px', padding: '8px 16px', borderRadius: '8px' }}
          >
            + Add Past / Missed Dose
          </button>
        </div>

        {/* Date Filter Bar */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '16px', background: 'rgba(0,0,0,0.25)', padding: '10px 14px', borderRadius: '8px' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>Filter Date:</span>
          {['ALL', 'TODAY', 'YESTERDAY', 'WEEK'].map((filterKey) => (
            <button
              key={filterKey}
              type="button"
              className={`btn ${historyDateFilter === filterKey ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '11px', padding: '4px 10px', borderRadius: '6px' }}
              onClick={() => { sound.playClick(); setHistoryDateFilter(filterKey); }}
            >
              {filterKey === 'ALL' ? 'All Records' : filterKey === 'TODAY' ? 'Today' : filterKey === 'YESTERDAY' ? 'Yesterday' : 'Last 7 Days'}
            </button>
          ))}

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: 'auto' }}>
            <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>Pick Date:</span>
            <input
              type="date"
              className="input-field"
              style={{ width: '135px', padding: '4px 8px', fontSize: '11.5px' }}
              value={customFilterDate}
              onChange={(e) => {
                setCustomFilterDate(e.target.value);
                setHistoryDateFilter('CUSTOM');
              }}
            />
          </div>
        </div>

        {/* Historical Table */}
        <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left', minWidth: '550px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '10px 12px' }}>COMPOUND</th>
                <th style={{ padding: '10px 12px' }}>DOSE</th>
                <th style={{ padding: '10px 12px' }}>ANATOMICAL SITE</th>
                <th style={{ padding: '10px 12px' }}>TIME / DATE</th>
                <th style={{ padding: '10px 12px' }}>CYCLE DAY</th>
                <th style={{ padding: '10px 12px', textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredDailyLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '24px', textAlign: 'center', color: 'var(--text-dim)' }}>
                    No dose records found for the selected date filter.
                  </td>
                </tr>
              ) : (
                filteredDailyLogs.map((log) => (
                  <tr key={log.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                    <td style={{ padding: '10px 12px', fontWeight: '700', color: '#fff' }}>{log.name}</td>
                    <td style={{ padding: '10px 12px', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>{log.dose || log.actual_dose_mcg + ' mcg'}</td>
                    <td style={{ padding: '10px 12px', color: 'var(--text-muted)' }}>{log.site}</td>
                    <td style={{ padding: '10px 12px', color: 'var(--text-dim)' }}>{log.displayTime || log.timestamp}</td>
                    <td style={{ padding: '10px 12px' }}>
                      <span className="badge badge-pink" style={{ fontSize: '10.5px' }}>Day {log.cycle_day || 14}</span>
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                        <button
                          type="button"
                          className="btn btn-secondary"
                          style={{ padding: '4px 8px', fontSize: '11px', color: 'var(--accent-cyan)', borderColor: 'rgba(0, 242, 254, 0.3)' }}
                          onClick={() => handleOpenEditModal(log)}
                          title="Edit dose record"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger"
                          style={{ padding: '4px 8px', fontSize: '11px' }}
                          onClick={() => handleDeleteLog(log.id)}
                          title="Delete dose record"
                        >
                          ✕
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: ADD NEW PEPTIDE / COMPOUND TO ACTIVE STACK */}
      {isAddPeptideModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAddPeptideModalOpen(false)}>
          <div className="modal-card" style={{ maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: '800', margin: 0 }}>
                  🧬 Add New Peptide to Active Protocols
                </h3>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
                  1-Click select from the pre-configured library or configure a custom compound.
                </p>
              </div>
              <button className="modal-close" onClick={() => setIsAddPeptideModalOpen(false)}>✕</button>
            </div>

            {/* Quick 1-Click Library Search */}
            <div style={{ marginTop: '16px', marginBottom: '14px' }}>
              <input
                type="text"
                className="input-field"
                placeholder="🔍 Search peptide library (KLOW, SS-31, MOTS-c, Retatrutide, PT-141, BPC-157)..."
                value={newPeptideSearch}
                onChange={(e) => setNewPeptideSearch(e.target.value)}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '8px', maxHeight: '180px', overflowY: 'auto', marginBottom: '20px', paddingRight: '4px' }}>
              {filteredPopularLibrary.map((lib, idx) => (
                <div
                  key={idx}
                  onClick={() => handleQuickAddPeptide(lib)}
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    padding: '10px 12px',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent-cyan)'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
                >
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: '#fff' }}>{lib.name.split(' (')[0]}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{lib.dose} • {lib.frequency}</div>
                  </div>
                  <span className="badge badge-cyan" style={{ fontSize: '10.5px' }}>+ Add</span>
                </div>
              ))}
            </div>

            <div style={{ textAlign: 'center', margin: '14px 0', fontSize: '11.5px', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              — OR CONFIGURE CUSTOM FORMULATION & CYCLE —
            </div>

            <form onSubmit={handleSaveNewCustomPeptide}>
              <div style={{ marginBottom: '12px' }}>
                <label className="input-label">Compound Name</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. BPC-157 / TB-500 Custom Blend"
                  value={newPeptideForm.name}
                  onChange={(e) => setNewPeptideForm({ ...newPeptideForm, name: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label className="input-label">Dose</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g. 500 mcg"
                    value={newPeptideForm.dose}
                    onChange={(e) => setNewPeptideForm({ ...newPeptideForm, dose: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="input-label">Units on Syringe (IU)</label>
                  <input
                    type="number"
                    className="input-field"
                    value={newPeptideForm.units}
                    onChange={(e) => setNewPeptideForm({ ...newPeptideForm, units: parseInt(e.target.value) || 10 })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                <div>
                  <label className="input-label">Start Date</label>
                  <input
                    type="date"
                    className="input-field"
                    value={newPeptideForm.start_date}
                    onChange={(e) => setNewPeptideForm({ ...newPeptideForm, start_date: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="input-label">Cycle Days</label>
                  <input
                    type="number"
                    className="input-field"
                    value={newPeptideForm.cycle_duration}
                    onChange={(e) => setNewPeptideForm({ ...newPeptideForm, cycle_duration: parseInt(e.target.value) || 30 })}
                  />
                </div>
                <div>
                  <label className="input-label">Frequency</label>
                  <select
                    className="select-field"
                    value={newPeptideForm.frequency}
                    onChange={(e) => setNewPeptideForm({ ...newPeptideForm, frequency: e.target.value })}
                  >
                    <option value="Daily (AM)">Daily (AM)</option>
                    <option value="Daily (PM)">Daily (PM)</option>
                    <option value="Twice Daily">Twice Daily</option>
                    <option value="3x / Week">3x / Week</option>
                    <option value="Once Weekly">Once Weekly</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsAddPeptideModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  + Add to Active Stack
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD PAST / MISSED DOSE */}
      {isMissedModalOpen && (
        <div className="modal-overlay" onClick={() => setIsMissedModalOpen(false)}>
          <div className="modal-card" style={{ maxWidth: '520px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: '800', margin: 0 }}>
                  + Add Past / Missed Dose
                </h3>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
                  Log an injection with an accurate past date and timestamp.
                </p>
              </div>
              <button className="modal-close" onClick={() => setIsMissedModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleSaveMissedDose} style={{ marginTop: '16px' }}>
              <div style={{ marginBottom: '14px' }}>
                <label className="input-label">Compound Protocol</label>
                <select
                  className="select-field"
                  value={modalForm.protocolId}
                  onChange={(e) => {
                    const sel = injections.find(i => i.id === e.target.value);
                    setModalForm({
                      ...modalForm,
                      protocolId: e.target.value,
                      name: sel?.name || modalForm.name,
                      dose: sel?.dose || modalForm.dose
                    });
                  }}
                >
                  {injections.map((inj) => (
                    <option key={inj.id} value={inj.id}>{inj.name} ({inj.dose})</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label className="input-label">Actual Dose</label>
                  <input
                    type="text"
                    className="input-field"
                    value={modalForm.dose}
                    onChange={(e) => setModalForm({ ...modalForm, dose: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="input-label">Anatomical Site</label>
                  <select
                    className="select-field"
                    value={modalForm.site}
                    onChange={(e) => setModalForm({ ...modalForm, site: e.target.value })}
                  >
                    {INJECTION_SITES.map((s) => (
                      <option key={s.id} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '10px', marginBottom: '18px' }}>
                <div>
                  <label className="input-label">Date Administered</label>
                  <input
                    type="date"
                    className="input-field"
                    value={modalForm.date}
                    onChange={(e) => setModalForm({ ...modalForm, date: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="input-label">Time</label>
                  <input
                    type="time"
                    className="input-field"
                    value={modalForm.time}
                    onChange={(e) => setModalForm({ ...modalForm, time: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="input-label">Cycle Day</label>
                  <input
                    type="number"
                    min="1"
                    max="35"
                    className="input-field"
                    value={modalForm.cycle_day}
                    onChange={(e) => setModalForm({ ...modalForm, cycle_day: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsMissedModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  ✓ Add to History Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT EXISTING LOG RECORD */}
      {isEditModalOpen && editingLog && (
        <div className="modal-overlay" onClick={() => setIsEditModalOpen(false)}>
          <div className="modal-card" style={{ maxWidth: '520px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: '800', margin: 0 }}>
                  ✏️ Edit Dose Record
                </h3>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
                  Update the timestamp, dose quantity, or anatomical site for this entry.
                </p>
              </div>
              <button className="modal-close" onClick={() => setIsEditModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleSaveEditLog} style={{ marginTop: '16px' }}>
              <div style={{ marginBottom: '14px' }}>
                <label className="input-label">Compound Name</label>
                <input
                  type="text"
                  className="input-field"
                  value={modalForm.name}
                  onChange={(e) => setModalForm({ ...modalForm, name: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label className="input-label">Administered Dose</label>
                  <input
                    type="text"
                    className="input-field"
                    value={modalForm.dose}
                    onChange={(e) => setModalForm({ ...modalForm, dose: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="input-label">Injection Site</label>
                  <select
                    className="select-field"
                    value={modalForm.site}
                    onChange={(e) => setModalForm({ ...modalForm, site: e.target.value })}
                  >
                    {INJECTION_SITES.map((s) => (
                      <option key={s.id} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '10px', marginBottom: '18px' }}>
                <div>
                  <label className="input-label">Date</label>
                  <input
                    type="date"
                    className="input-field"
                    value={modalForm.date}
                    onChange={(e) => setModalForm({ ...modalForm, date: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="input-label">Time</label>
                  <input
                    type="time"
                    className="input-field"
                    value={modalForm.time}
                    onChange={(e) => setModalForm({ ...modalForm, time: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="input-label">Cycle Day</label>
                  <input
                    type="number"
                    min="1"
                    max="35"
                    className="input-field"
                    value={modalForm.cycle_day}
                    onChange={(e) => setModalForm({ ...modalForm, cycle_day: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsEditModalOpen(false)}
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
