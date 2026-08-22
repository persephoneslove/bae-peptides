import React, { useState } from 'react';
import { sound } from '../utils/audio';

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

export default function InputLoggingEngine({
  injections = [],
  vitamins = [],
  wellnessLogs = [],
  dailyLogs = [],
  onAddDailyLog,
  subjectiveWellness = [],
  onAddWellness,
  onUpdateVitamins,
  onUpdateWellness,
  cycleData
}) {
  const [selectedProtocolId, setSelectedProtocolId] = useState(injections[0]?.id || '');
  const [actualDose, setActualDose] = useState(injections[0]?.dose || '250 mcg');
  const [selectedSite, setSelectedSite] = useState(INJECTION_SITES[0].name);

  // Subjective Wellness State
  const [energyRating, setEnergyRating] = useState(8);
  const [moodRating, setMoodRating] = useState(8);
  const [brainFog, setBrainFog] = useState(2);
  const [libido, setLibido] = useState(7);
  const [jointHealth, setJointHealth] = useState(8);
  const [notes, setNotes] = useState('');

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

  const handleLogInjectionSubmit = (e) => {
    e.preventDefault();
    sound.playSuccess();
    const item = injections.find(i => i.id === selectedProtocolId) || injections[0];

    const newLog = {
      id: 'log-' + Date.now(),
      protocol_id: selectedProtocolId,
      compoundKey: (item?.name || 'bpc-157').toLowerCase(),
      name: item?.name || 'Peptide',
      actual_dose_mcg: parseFloat(actualDose) || 250,
      dose: actualDose,
      site: selectedSite,
      timestamp: new Date().toISOString(),
      displayTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      dose_taken: true,
      cycle_day: cycleData?.currentDay || 14
    };

    onAddDailyLog(newLog);
    showToast(`Logged ${item?.name || 'Peptide'} into ${selectedSite}`);
  };

  const handleWellnessSubmit = (e) => {
    e.preventDefault();
    sound.playSuccess();

    const newWellness = {
      id: 'ass-' + Date.now(),
      date: new Date().toLocaleDateString(),
      timestamp: new Date().toISOString(),
      energy_rating: Number(energyRating),
      mood_rating: Number(moodRating),
      brain_fog: Number(brainFog),
      libido: Number(libido),
      joint_health: Number(jointHealth),
      notes: notes.trim()
    };

    onAddWellness(newWellness);
    setNotes('');
    showToast('Subjective Wellness Logged');
  };

  const handleToggleVitamin = (id) => {
    sound.playSuccess();
    if (!onUpdateVitamins) return;
    const updated = vitamins.map(v => v.id === id ? { ...v, takenToday: !v.takenToday } : v);
    onUpdateVitamins(updated);
    showToast('Supplement status updated');
  };

  // Tooltip Helper
  const getTooltip = (compoundName) => {
    const name = (compoundName || '').toLowerCase();
    if (name.includes('bpc') || name.includes('klow')) return "For a woman in her late 30s, BPC-157 is excellent for supporting collagen synthesis, speeding up recovery from workouts, and maintaining gut barrier integrity.";
    if (name.includes('mots')) return "MOTS-c mimics exercise at the cellular level. As metabolic rates naturally shift in your 30s, this helps support mitochondrial biogenesis and insulin sensitivity.";
    if (name.includes('ss-31')) return "SS-31 targets the inner mitochondrial membrane (cardiolipin), which is crucial for maintaining cellular energy and fighting oxidative stress as we age.";
    return "Supports cellular longevity and optimal biological function.";
  };

  const activeCompound = injections.find(i => i.id === selectedProtocolId) || injections[0];

  return (
    <div style={{ animation: 'popIn 0.2s ease', width: '100%' }}>
      <div className="section-header">
        <div>
          <h2>Input & Logging Engine</h2>
          <p>Capture exact compound microgram dosages, site rotation telemetry, and subjective wellness metrics.</p>
        </div>
        {toastMessage && (
          <span className="badge badge-green" style={{ fontSize: '13px', padding: '6px 14px' }}>
            ✓ {toastMessage}
          </span>
        )}
      </div>

      <div className="responsive-form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '28px' }}>
        
        {/* INJECTION EXECUTION FORM */}
        <div className="card" style={{ padding: '24px', margin: 0 }}>
          <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>💉</span> Log Injection Administration
          </h3>

          <form onSubmit={handleLogInjectionSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label className="input-label">Select Active Compound</label>
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

            <div className="responsive-two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
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

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '13px', fontSize: '14px', borderRadius: '10px' }}>
              ✓ Confirm Administration
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

        {/* SUBJECTIVE WELLNESS ASSESSMENTS */}
        <div className="card" style={{ padding: '24px', margin: 0 }}>
          <h3 style={{ fontSize: '18px', fontWeight: '400', color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🌸</span> Daily Wellness Check-In
          </h3>

          <form onSubmit={handleWellnessSubmit}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '16px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', fontWeight: '500', color: 'var(--text-main)', marginBottom: '6px' }}>
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

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', fontWeight: '500', color: 'var(--text-main)', marginBottom: '6px' }}>
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

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', fontWeight: '500', color: 'var(--text-main)', marginBottom: '6px' }}>
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

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', fontWeight: '500', color: 'var(--text-main)', marginBottom: '6px' }}>
                  <span>Libido & Vitality</span>
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
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', fontWeight: '500', color: 'var(--text-main)', marginBottom: '6px' }}>
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

              <div>
                <label className="input-label" style={{ color: 'var(--text-main)' }}>Notes / Cycle Sensations</label>
                <input
                  type="text"
                  className="input-field"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Felt great post-workout, restful sleep."
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

      {/* ADMINISTRATION AUDIT TABLE (RESPONSIVE CARDS ON MOBILE) */}
      <div className="card" style={{ padding: '20px 24px' }}>
        <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#fff', marginBottom: '14px' }}>
          Historical Administration Audit Log ({dailyLogs.length} Records)
        </h3>

        <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left', minWidth: '450px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '10px 12px' }}>COMPOUND</th>
                <th style={{ padding: '10px 12px' }}>DOSE</th>
                <th style={{ padding: '10px 12px' }}>SITE</th>
                <th style={{ padding: '10px 12px' }}>TIME</th>
                <th style={{ padding: '10px 12px' }}>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {dailyLogs.map((log) => (
                <tr key={log.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                  <td style={{ padding: '10px 12px', fontWeight: '700', color: '#fff' }}>{log.name}</td>
                  <td style={{ padding: '10px 12px', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>{log.dose || log.actual_dose_mcg + ' mcg'}</td>
                  <td style={{ padding: '10px 12px', color: 'var(--text-muted)' }}>{log.site}</td>
                  <td style={{ padding: '10px 12px', color: 'var(--text-dim)' }}>{log.displayTime || log.timestamp}</td>
                  <td style={{ padding: '10px 12px' }}>
                    <span className="badge badge-green">✓ Ingested</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
