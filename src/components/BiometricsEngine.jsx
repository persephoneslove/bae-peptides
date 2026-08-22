import React, { useState } from 'react';
import { sound } from '../utils/audio';

export default function BiometricsEngine({ biometrics, onAddBiometric }) {
  const [hrv, setHrv] = useState('74');
  const [restingHr, setRestingHr] = useState('54');
  const [sleepScore, setSleepScore] = useState('88');
  const [deepSleepPct, setDeepSleepPct] = useState('22.5');
  const [recoveryIndex, setRecoveryIndex] = useState('85');

  const [toast, setToast] = useState('');

  const handleSyncSimulatedWearable = (device) => {
    sound.playSuccess();
    const newEntry = {
      id: 'bio-' + Date.now(),
      date: new Date().toLocaleDateString(),
      hrv: Math.round(68 + Math.random() * 18),
      resting_hr: Math.round(50 + Math.random() * 8),
      sleep_score: Math.round(82 + Math.random() * 14),
      deep_sleep_pct: (20 + Math.random() * 6).toFixed(1),
      recovery_index: Math.round(78 + Math.random() * 18)
    };
    onAddBiometric(newEntry);
    setToast(`Telemetry ingested from ${device}`);
    setTimeout(() => setToast(''), 2500);
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    sound.playSuccess();
    const newEntry = {
      id: 'bio-' + Date.now(),
      date: new Date().toLocaleDateString(),
      hrv: parseInt(hrv) || 70,
      resting_hr: parseInt(restingHr) || 55,
      sleep_score: parseInt(sleepScore) || 85,
      deep_sleep_pct: parseFloat(deepSleepPct) || 20,
      recovery_index: parseInt(recoveryIndex) || 80
    };
    onAddBiometric(newEntry);
    setToast('Wearable Biometrics Recorded');
    setTimeout(() => setToast(''), 2500);
  };

  return (
    <div style={{ animation: 'popIn 0.2s ease' }}>
      <div className="section-header">
        <div>
          <h2>Biometric Telemetry Integrations</h2>
          <p>Continuous passive health stream ingestion (Garmin Lily).</p>
        </div>
        {toast && (
          <span className="badge badge-green" style={{ fontSize: '13px', padding: '6px 14px' }}>
            ✓ {toast}
          </span>
        )}
      </div>

      {/* WEARABLE SYNC BAR */}
      <div className="card" style={{ padding: '20px', marginBottom: '24px', border: '1px solid rgba(0, 242, 254, 0.3)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <div style={{ fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--accent-cyan)' }}>
              ⚡ Real-Time Ingestion Bridge
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
              Pull continuous nocturnal autonomic nervous system data into the correlation matrix.
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button className="btn btn-secondary" style={{ fontSize: '12px', padding: '7px 14px' }} onClick={() => handleSyncSimulatedWearable('Garmin Lily')}>
              ⌚ Sync Garmin Lily
            </button>
          </div>
        </div>
      </div>

      {/* MANUAL INGESTION FORM */}
      <div className="card" style={{ padding: '24px', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#fff', marginBottom: '16px' }}>
          Manual Biometric Calibration
        </h3>

        <form onSubmit={handleManualSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '14px', marginBottom: '18px' }}>
            <div>
              <label className="input-label">Heart Rate Variability (ms)</label>
              <input
                type="text"
                className="input-field"
                value={hrv}
                onChange={(e) => setHrv(e.target.value)}
                placeholder="74"
                required
              />
            </div>

            <div>
              <label className="input-label">Resting Heart Rate (bpm)</label>
              <input
                type="text"
                className="input-field"
                value={restingHr}
                onChange={(e) => setRestingHr(e.target.value)}
                placeholder="54"
                required
              />
            </div>

            <div>
              <label className="input-label">Sleep Score (1-100)</label>
              <input
                type="text"
                className="input-field"
                value={sleepScore}
                onChange={(e) => setSleepScore(e.target.value)}
                placeholder="88"
                required
              />
            </div>

            <div>
              <label className="input-label">Deep Sleep Percentage (%)</label>
              <input
                type="text"
                className="input-field"
                value={deepSleepPct}
                onChange={(e) => setDeepSleepPct(e.target.value)}
                placeholder="22.5"
                required
              />
            </div>

            <div>
              <label className="input-label">Recovery Index (1-100)</label>
              <input
                type="text"
                className="input-field"
                value={recoveryIndex}
                onChange={(e) => setRecoveryIndex(e.target.value)}
                placeholder="85"
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ padding: '10px 24px' }}>
            ✓ Ingest Telemetry Entry
          </button>
        </form>
      </div>

      {/* HISTORICAL TELEMETRY FEED */}
      <div className="card">
        <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#fff', marginBottom: '14px' }}>
          Passive Telemetry History ({biometrics.length} Days)
        </h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '10px 14px' }}>DATE</th>
                <th style={{ padding: '10px 14px' }}>HRV</th>
                <th style={{ padding: '10px 14px' }}>RESTING HR</th>
                <th style={{ padding: '10px 14px' }}>SLEEP SCORE</th>
                <th style={{ padding: '10px 14px' }}>DEEP SLEEP %</th>
                <th style={{ padding: '10px 14px' }}>RECOVERY INDEX</th>
              </tr>
            </thead>
            <tbody>
              {biometrics.map((b) => (
                <tr key={b.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                  <td style={{ padding: '10px 14px', fontWeight: '700', color: '#fff' }}>{b.date}</td>
                  <td style={{ padding: '10px 14px', color: 'var(--accent-green)', fontFamily: 'var(--font-mono)' }}>{b.hrv} ms</td>
                  <td style={{ padding: '10px 14px', color: '#fff', fontFamily: 'var(--font-mono)' }}>{b.resting_hr} bpm</td>
                  <td style={{ padding: '10px 14px', color: 'var(--accent-purple)', fontFamily: 'var(--font-mono)' }}>{b.sleep_score}/100</td>
                  <td style={{ padding: '10px 14px', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>{b.deep_sleep_pct}%</td>
                  <td style={{ padding: '10px 14px' }}>
                    <span className="badge badge-green">{b.recovery_index}%</span>
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
