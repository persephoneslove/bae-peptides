import React, { useState } from 'react';
import { sound } from '../utils/audio';

export default function CycleSyncModule({ cycleData, onUpdateCycleData }) {
  const [lastPeriodStart, setLastPeriodStart] = useState(
    new Date(cycleData.lastPeriodStart).toISOString().split('T')[0]
  );
  const [averageLength, setAverageLength] = useState(cycleData.averageLength);

  const [toastMessage, setToastMessage] = useState('');

  const calculateCurrentDay = (startString) => {
    const start = new Date(startString);
    const today = new Date();
    const diffTime = Math.abs(today - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const currentDay = calculateCurrentDay(lastPeriodStart);

  const getPhaseInfo = (day, length) => {
    if (day >= 1 && day <= 5) {
      return {
        name: 'Menstrual Phase (Winter)',
        color: 'var(--accent-pink)',
        focus: 'Deep rest, iron-rich foods, and gentle protocols. Consider pausing stimulatory peptides.',
        icon: '🩸'
      };
    } else if (day >= 6 && day <= 13) {
      return {
        name: 'Follicular Phase (Spring)',
        color: 'var(--accent-cyan)',
        focus: 'Rising energy and estrogen. Ideal time for NAD+ precursors, high-intensity workouts, and metabolic peptides like MOTS-c.',
        icon: '🌱'
      };
    } else if (day >= 14 && day <= 16) {
      return {
        name: 'Ovulatory Phase (Summer)',
        color: 'var(--accent-amber)',
        focus: 'Peak energy, testosterone, and estrogen. Capitalize on muscle building and mental clarity.',
        icon: '☀️'
      };
    } else {
      return {
        name: 'Luteal Phase (Autumn)',
        color: 'var(--accent-purple)',
        focus: 'Progesterone rises, energy may wane. Focus on magnesium, B6, and calming routines. Taper heavy protocols.',
        icon: '🍂'
      };
    }
  };

  const phase = getPhaseInfo(currentDay, averageLength);

  const handleSave = (e) => {
    e.preventDefault();
    sound.playSuccess();
    
    const newDay = calculateCurrentDay(lastPeriodStart);
    
    onUpdateCycleData({
      lastPeriodStart: new Date(lastPeriodStart).toISOString(),
      averageLength: Number(averageLength),
      currentDay: newDay
    });

    setToastMessage('Cycle data updated. AI logic synced.');
    setTimeout(() => setToastMessage(''), 2500);
  };

  return (
    <div style={{ animation: 'popIn 0.3s ease-out', width: '100%' }}>
      <div className="section-header" style={{ borderBottom: '1px solid rgba(255, 182, 193, 0.2)' }}>
        <div>
          <h2 style={{ color: 'var(--text-main)', fontSize: '24px', fontWeight: '500' }}>Cycle Sync Module</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '6px' }}>
            Harmonize your cellular health protocols with your natural biological rhythms.
          </p>
        </div>
        {toastMessage && (
          <span className="badge" style={{ background: 'rgba(255, 182, 193, 0.1)', color: 'var(--accent-pink)', fontSize: '13px', padding: '6px 14px' }}>
            ✓ {toastMessage}
          </span>
        )}
      </div>

      {/* CURRENT PHASE HUD */}
      <div className="card" style={{ padding: '24px 18px', marginBottom: '20px', textAlign: 'center', background: 'linear-gradient(180deg, rgba(255,255,255,0.02) 0%, rgba(0,0,0,0.2) 100%)', borderTop: `4px solid ${phase.color}` }}>
        <div style={{ fontSize: '40px', marginBottom: '6px' }}>{phase.icon}</div>
        <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>
          Currently In
        </div>
        <h3 style={{ fontSize: '24px', fontWeight: '400', color: '#fff', marginBottom: '8px' }}>
          {phase.name}
        </h3>
        <div style={{ fontSize: '16px', color: phase.color, fontWeight: '600', marginBottom: '16px' }}>
          Cycle Day {currentDay} <span style={{ color: 'var(--text-dim)', fontSize: '13px' }}>of {averageLength}</span>
        </div>
        
        <p style={{ fontSize: '13.5px', color: 'var(--text-main)', maxWidth: '500px', margin: '0 auto', lineHeight: '1.5', background: 'rgba(0,0,0,0.25)', padding: '14px', borderRadius: '10px' }}>
          <strong>Bio-Focus:</strong> {phase.focus}
        </p>
      </div>

      {/* SETTINGS FORM */}
      <div className="card" style={{ padding: '20px 18px' }}>
        <h3 style={{ fontSize: '17px', fontWeight: '500', color: '#fff', marginBottom: '14px' }}>
          Cycle Calibration
        </h3>

        <form onSubmit={handleSave}>
          <div className="responsive-form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '16px' }}>
            <div>
              <label className="input-label" style={{ color: 'var(--text-main)' }}>First Day of Last Period</label>
              <input
                type="date"
                className="input-field"
                value={lastPeriodStart}
                onChange={(e) => setLastPeriodStart(e.target.value)}
                required
                style={{ padding: '11px 14px' }}
              />
            </div>

            <div>
              <label className="input-label" style={{ color: 'var(--text-main)' }}>Average Cycle Length (Days)</label>
              <input
                type="number"
                min="21"
                max="45"
                className="input-field"
                value={averageLength}
                onChange={(e) => setAverageLength(e.target.value)}
                required
                style={{ padding: '11px 14px' }}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-secondary" style={{ width: '100%', padding: '13px', fontSize: '14px', borderRadius: '10px', borderColor: 'var(--accent-pink)', color: 'var(--text-main)' }}>
            ✓ Save & Sync AI Logic
          </button>
        </form>
      </div>
    </div>
  );
}
