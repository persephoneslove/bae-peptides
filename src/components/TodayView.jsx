import React from 'react';
import { sound } from '../utils/audio';

export default function TodayView({
  injections,
  vitamins,
  wellnessLogs,
  onLogInjection,
  onToggleVitamin,
  onNavigate
}) {
  const totalVits = vitamins.length;
  const takenVits = vitamins.filter(v => v.takenToday).length;
  const vitPct = totalVits > 0 ? Math.round((takenVits / totalVits) * 100) : 0;

  return (
    <div style={{ animation: 'popIn 0.2s ease' }}>
      {/* Top Banner */}
      <div className="section-header">
        <div>
          <h2>Today's Routine</h2>
          <p>Your simple daily checklist for injections, supplements, and recovery.</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-secondary" onClick={() => onNavigate('calculator')}>
            🧮 Syringe Tool
          </button>
          <button className="btn btn-primary" onClick={() => onNavigate('recovery')}>
            ⚡ Start Session
          </button>
        </div>
      </div>

      {/* Progress Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '24px' }}>
        <div className="card" style={{ marginBottom: 0 }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>Daily Supplements</div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--accent-green)', marginTop: '4px' }}>
            {takenVits} / {totalVits} <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>({vitPct}%)</span>
          </div>
        </div>

        <div className="card" style={{ marginBottom: 0 }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>Active Injections</div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--accent-cyan)', marginTop: '4px' }}>
            {injections.length} <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Protocols</span>
          </div>
        </div>

        <div className="card" style={{ marginBottom: 0 }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>Recovery Sessions</div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--accent-pink)', marginTop: '4px' }}>
            {wellnessLogs.length} <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Logged</span>
          </div>
        </div>
      </div>

      {/* SECTION 1: INJECTIONS TO LOG TODAY */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>💉</span> Injections & Dosing
          </h3>
          <button className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: '12px' }} onClick={() => onNavigate('injections')}>
            Manage All →
          </button>
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#fff' }}>{item.name.split(' (')[0]}</h4>
                  <span className="badge badge-cyan">{item.timing || 'Morning'}</span>
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Dose: <strong style={{ color: '#fff' }}>{item.dose}</strong> ({item.units || 10} IU on syringe) • Frequency: {item.frequency}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button
                  className="btn btn-primary"
                  style={{ padding: '8px 16px', fontSize: '13px' }}
                  onClick={() => onLogInjection(item)}
                >
                  ✓ Log Dose
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: DAILY SUPPLEMENTS CHECKLIST */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>💊</span> Daily Vitamins & Supplements
          </h3>
          <button className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: '12px' }} onClick={() => onNavigate('vitamins')}>
            Manage All →
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '10px' }}>
          {vitamins.map((item) => (
            <div
              key={item.id}
              className="card"
              onClick={() => onToggleVitamin(item.id)}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '14px 18px',
                marginBottom: 0,
                cursor: 'pointer',
                background: item.takenToday ? 'rgba(5, 255, 161, 0.06)' : 'var(--bg-card)',
                borderColor: item.takenToday ? 'rgba(5, 255, 161, 0.3)' : 'var(--border)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <input
                  type="checkbox"
                  checked={item.takenToday}
                  onChange={() => {}}
                  style={{ width: '20px', height: '20px', accentColor: 'var(--accent-green)', cursor: 'pointer' }}
                />
                <div>
                  <div style={{ fontSize: '14.5px', fontWeight: '700', color: item.takenToday ? 'var(--text-muted)' : '#fff', textDecoration: item.takenToday ? 'line-through' : 'none' }}>
                    {item.name.split(' (')[0]}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-dim)' }}>
                    {item.dose} • {item.timeOfDay}
                  </div>
                </div>
              </div>

              <span className={`badge ${item.timeOfDay === 'Morning' ? 'badge-amber' : 'badge-cyan'}`}>
                {item.timeOfDay}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 3: QUICK RECOVERY LAUNCHER */}
      <div>
        <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>❄️</span> Quick Recovery Timers
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          <div
            className="card"
            style={{ textAlign: 'center', cursor: 'pointer', marginBottom: 0 }}
            onClick={() => onNavigate('recovery')}
          >
            <div style={{ fontSize: '28px', marginBottom: '6px' }}>🔴</div>
            <div style={{ fontWeight: '700', fontSize: '14px', color: '#fff' }}>Red Light Therapy</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Full Body & No-No Square</div>
          </div>

          <div
            className="card"
            style={{ textAlign: 'center', cursor: 'pointer', marginBottom: 0 }}
            onClick={() => onNavigate('recovery')}
          >
            <div style={{ fontSize: '28px', marginBottom: '6px' }}>🧊</div>
            <div style={{ fontWeight: '700', fontSize: '14px', color: '#fff' }}>Cold Plunge</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Timer & Box Breathing</div>
          </div>

          <div
            className="card"
            style={{ textAlign: 'center', cursor: 'pointer', marginBottom: 0 }}
            onClick={() => onNavigate('recovery')}
          >
            <div style={{ fontSize: '28px', marginBottom: '6px' }}>🔥</div>
            <div style={{ fontWeight: '700', fontSize: '14px', color: '#fff' }}>Sauna Session</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Heat Shock Induction</div>
          </div>
        </div>
      </div>
    </div>
  );
}
