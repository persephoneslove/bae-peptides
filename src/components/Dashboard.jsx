import React from 'react';
import { sound } from '../utils/audio';

export default function Dashboard({
  injections,
  vitamins,
  wellnessLogs,
  onNavigate,
  onLogInjection,
  onToggleVitamin
}) {
  const totalVitamins = vitamins.length;
  const takenVitamins = vitamins.filter((v) => v.takenToday).length;
  const vitaminPct = totalVitamins > 0 ? Math.round((takenVitamins / totalVitamins) * 100) : 0;

  // Cold exposure weekly minutes
  const coldWeeklyMins = wellnessLogs
    .filter((w) => w.type === 'cold_plunge')
    .reduce((acc, curr) => acc + (parseFloat(curr.durationMinutes) || 0), 0);

  const pendingInjections = injections.filter((inj) => inj.active);

  return (
    <div className="animate-fade-in">
      {/* Top Banner */}
      <div className="view-header">
        <div className="view-title-group">
          <h2>BioBae Command Core</h2>
          <p>Real-time telemetry on peptide administrations, micronutrient compliance, and photobiomodulation.</p>
        </div>
        <div className="quick-actions">
          <button className="btn-secondary" onClick={() => { sound.playClick(); onNavigate('calculator'); }}>
            <span>🧮</span> Syringe Calculator
          </button>
          <button className="btn-primary" onClick={() => { sound.playClick(); onNavigate('wellness'); }}>
            <span>⚡</span> Launch Session
          </button>
        </div>
      </div>

      {/* Hero Biometrics Grid */}
      <div className="stat-banner-grid">
        <div className="stat-card cyan">
          <div className="stat-header">
            <span>Next Injection Dose</span>
            <span>💉</span>
          </div>
          <div className="stat-value">BPC-157</div>
          <div className="stat-subtext highlight-cyan">
            250 mcg SubQ (10 IU) • AM Fasted
          </div>
        </div>

        <div className="stat-card emerald">
          <div className="stat-header">
            <span>Vitamin Compliance</span>
            <span>💊</span>
          </div>
          <div className="stat-value">{vitaminPct}%</div>
          <div className="stat-subtext highlight-emerald">
            {takenVitamins} of {totalVitamins} items ingested today
          </div>
        </div>

        <div className="stat-card crimson">
          <div className="stat-header">
            <span>Deliberate Cold Exposure</span>
            <span>❄️</span>
          </div>
          <div className="stat-value">{coldWeeklyMins.toFixed(1)} / 11m</div>
          <div className="stat-subtext highlight-crimson">
            Huberman Target: 86% Reached
          </div>
        </div>

        <div className="stat-card amber">
          <div className="stat-header">
            <span>Bio-Readiness Score</span>
            <span>⚡</span>
          </div>
          <div className="stat-value">94 / 100</div>
          <div className="stat-subtext">
            Mitochondrial & CNS State: Optimal
          </div>
        </div>
      </div>

      {/* Main Grid: Today's Action Checklist + Compound Half-life Telemetry */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '24px', marginBottom: '28px' }}>
        {/* Today's Protocol Execution Panel */}
        <div className="glass-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: 'var(--neon-cyan)' }}>◈</span> Today's Execution Protocol
            </h3>
            <span className="tag-badge tag-cyan">4 Actions Pending</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Injection Item */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-glass)',
                borderRadius: '12px',
                padding: '14px 18px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '20px' }}>💉</span>
                <div>
                  <div style={{ fontSize: '14.5px', fontWeight: '700', color: '#fff' }}>
                    BPC-157 SubQ Injection (250 mcg)
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    Target: Left Abdomen SubQ | Draw to 10 IU
                  </div>
                </div>
              </div>
              <button
                className="btn-primary"
                style={{ padding: '6px 14px', fontSize: '12px' }}
                onClick={() => {
                  sound.playSuccess();
                  onNavigate('injections');
                }}
              >
                Log Injection
              </button>
            </div>

            {/* Red Light / No-No Square Item */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-glass)',
                borderRadius: '12px',
                padding: '14px 18px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '20px' }}>🔴</span>
                <div>
                  <div style={{ fontSize: '14.5px', fontWeight: '700', color: '#fff' }}>
                    Photobiomodulation: Perineal & No-No Square (8 mins)
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    660nm Pure Red Wavelength | Leydig cell ATP protocol
                  </div>
                </div>
              </div>
              <button
                className="btn-crimson"
                style={{ padding: '6px 14px', fontSize: '12px' }}
                onClick={() => {
                  sound.playClick();
                  onNavigate('wellness');
                }}
              >
                Start Timer
              </button>
            </div>

            {/* Cold Plunge Item */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-glass)',
                borderRadius: '12px',
                padding: '14px 18px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '20px' }}>🧊</span>
                <div>
                  <div style={{ fontSize: '14.5px', fontWeight: '700', color: '#fff' }}>
                    Cold Immersion (3.5 mins @ 44°F)
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    Box Breathing Cadence | 250% Dopamine baseline boost
                  </div>
                </div>
              </div>
              <button
                className="btn-secondary"
                style={{ padding: '6px 14px', fontSize: '12px' }}
                onClick={() => {
                  sound.playClick();
                  onNavigate('wellness');
                }}
              >
                Launch Plunge
              </button>
            </div>

            {/* Bedtime Vitamin Item */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-glass)',
                borderRadius: '12px',
                padding: '14px 18px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '20px' }}>💊</span>
                <div>
                  <div style={{ fontSize: '14.5px', fontWeight: '700', color: '#fff' }}>
                    Bedtime Stack: Magnesium L-Threonate + Apigenin
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    Deep Slow-Wave Sleep & GABA-A upregulation
                  </div>
                </div>
              </div>
              <button
                className="btn-secondary"
                style={{ padding: '6px 14px', fontSize: '12px' }}
                onClick={() => {
                  sound.playClick();
                  onNavigate('vitamins');
                }}
              >
                Check Stack
              </button>
            </div>
          </div>
        </div>

        {/* Live Active Compound Half-Life Telemetry */}
        <div className="glass-panel" style={{ border: '1px solid rgba(0, 242, 254, 0.25)' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: 'var(--neon-emerald)' }}>⚡</span> Active Peptide Blood Levels
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {pendingInjections.map((inj) => (
              <div key={inj.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                  <span style={{ fontWeight: '700', color: '#fff' }}>{inj.name.split(' (')[0]}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--neon-cyan)', fontSize: '12px' }}>
                    {inj.dose} • {inj.frequency.split(' ')[0]}
                  </span>
                </div>
                <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '6px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: '78%',
                      background: `linear-gradient(90deg, ${inj.color || '#00f2fe'} 0%, #fff 100%)`,
                      boxShadow: `0 0 10px ${inj.color || '#00f2fe'}`
                    }}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5px', color: 'var(--text-dark)', marginTop: '4px' }}>
                  <span>Last: {inj.lastTaken || '8h ago'}</span>
                  <span>Steady State: 92%</span>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '24px', padding: '12px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: '1px solid var(--border-glass)', fontSize: '11.5px', color: 'var(--text-muted)' }}>
            <strong style={{ color: 'var(--neon-amber)' }}>💡 Bio-Intelligence Insight:</strong> CJC-1295 / Ipamorelin pulse should be taken on an empty stomach at least 90 minutes post-dinner to prevent somatostatin release.
          </div>
        </div>
      </div>
    </div>
  );
}
