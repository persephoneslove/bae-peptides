import React from 'react';
import { calculateAccumulatedEfficacy } from '../utils/decayEngine';

export default function ProtocolDashboard({
  injections,
  vitamins,
  dailyLogs,
  biometrics,
  assessments,
  onNavigate,
  onLogQuickDose
}) {
  const latestBiometric = biometrics[0] || { hrv: 74, sleep_score: 88, resting_hr: 54 };
  const latestAssessment = assessments[0] || { energy_rating: 8, mental_clarity: 9, joint_health: 8 };

  // Calculate live accumulated pharmacokinetic efficacy E(t)
  const efficacyData = calculateAccumulatedEfficacy(dailyLogs);

  return (
    <div style={{ animation: 'popIn 0.2s ease' }}>
      {/* Top Banner */}
      <div className="section-header">
        <div>
          <h2>Protocol Dashboard</h2>
          <p>Real-time telemetry, active compound administration schedule, and pharmacokinetic load.</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-secondary" onClick={() => onNavigate('analytics')}>
            🧬 AI Analytics Matrix
          </button>
          <button className="btn btn-primary" onClick={() => onNavigate('input_engine')}>
            ⚡ Log Administration
          </button>
        </div>
      </div>

      {/* METRIC TELEMETRY HUD */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '24px' }}>
        <div className="card" style={{ marginBottom: 0 }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>
            ACCUMULATED EFFICACY E(t)
          </div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
            {efficacyData.totalEfficacyScore} <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>μg·equiv</span>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--accent-green)', marginTop: '2px' }}>
            ● Active Bioavailability Steady-State
          </div>
        </div>

        <div className="card" style={{ marginBottom: 0 }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>
            PASSIVE HRV (7-DAY BASELINE)
          </div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--accent-green)', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
            {latestBiometric.hrv} <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>ms</span>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
            Resting Heart Rate: <strong style={{ color: '#fff' }}>{latestBiometric.resting_hr} bpm</strong>
          </div>
        </div>

        <div className="card" style={{ marginBottom: 0 }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>
            SLEEP ARCHITECTURE
          </div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--accent-purple)', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
            {latestBiometric.sleep_score} <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>/ 100</span>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
            Deep / Slow-Wave: <strong style={{ color: '#fff' }}>23.4%</strong>
          </div>
        </div>

        <div className="card" style={{ marginBottom: 0 }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>
            SUBJECTIVE ENERGY INDEX
          </div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--accent-amber)', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
            {latestAssessment.energy_rating} <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>/ 10</span>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
            Clarity: <strong style={{ color: '#fff' }}>{latestAssessment.mental_clarity}/10</strong> | Joint: <strong style={{ color: '#fff' }}>{latestAssessment.joint_health}/10</strong>
          </div>
        </div>
      </div>

      {/* REQUIRED PEPTIDE PROTOCOLS FOR TODAY */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>💉</span> Required Peptide Administrations Today ({injections.length})
          </h3>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Rotation Matrix Active to Prevent Tissue Induration
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {injections.map((item) => (
            <div
              key={item.id}
              className="card"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px 20px',
                marginBottom: 0,
                borderLeft: `4px solid ${item.color || 'var(--accent-cyan)'}`
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#fff' }}>{item.name}</h4>
                  <span className="badge badge-cyan">{item.timing || 'Morning'}</span>
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Dose: <strong style={{ color: '#fff' }}>{item.dose}</strong> ({item.units || 10} IU on syringe) • Frequency: <strong>{item.frequency}</strong> • Target: {item.category || 'Cellular Longevity'}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button
                  className="btn btn-primary"
                  style={{ padding: '8px 16px', fontSize: '13px' }}
                  onClick={() => onLogQuickDose(item)}
                >
                  ✓ Complete & Log Dose
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DAILY NUTRACEUTICAL COFACTOR STACK */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>💊</span> Phased Nutraceutical Stack ({vitamins.length} Items)
          </h3>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Cofactor Protection & Methylation Support
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '12px' }}>
          {vitamins.map((vit) => (
            <div
              key={vit.id}
              className="card"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '14px 18px',
                marginBottom: 0
              }}
            >
              <div>
                <div style={{ fontSize: '14.5px', fontWeight: '700', color: '#fff' }}>{vit.name}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {vit.dose} • <strong style={{ color: 'var(--accent-amber)' }}>{vit.timeOfDay}</strong>
                </div>
              </div>

              <span className={`badge ${vit.timeOfDay === 'Morning' ? 'badge-amber' : vit.timeOfDay === 'Bedtime' ? 'badge-purple' : 'badge-cyan'}`}>
                {vit.timeOfDay}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
