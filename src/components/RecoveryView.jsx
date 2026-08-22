import React, { useState, useEffect, useRef } from 'react';
import { sound } from '../utils/audio';

export default function RecoveryView({ wellnessLogs, onUpdateWellness }) {
  const [activeTab, setActiveTab] = useState('red_light'); // 'red_light' | 'cold_plunge' | 'sauna'
  const [timerRunning, setTimerRunning] = useState(false);
  const [seconds, setSeconds] = useState(600); // 10 mins
  const [initialSeconds, setInitialSeconds] = useState(600);
  const [selectedTarget, setSelectedTarget] = useState('Full Body (15m)');

  // Box Breathing State for Cold Plunge
  const [breathPhase, setBreathPhase] = useState('Inhale');
  const [breathCount, setBreathCount] = useState(4);
  const breathTimerRef = useRef(null);

  // Red Light Presets
  const RED_LIGHT_OPTIONS = [
    { name: 'Full Body Circadian', mins: 15, label: 'Full Body (15m)' },
    { name: 'No-No Square & Perineal', mins: 8, label: 'No-No Square (8m)' },
    { name: 'Face & Collagen', mins: 10, label: 'Face / Thyroid (10m)' },
    { name: 'Joint & Tendon', mins: 20, label: 'Deep Joint (20m)' }
  ];

  // Timer Tick
  useEffect(() => {
    let interval = null;
    if (timerRunning && seconds > 0) {
      interval = setInterval(() => setSeconds(prev => prev - 1), 1000);
    } else if (seconds === 0 && timerRunning) {
      sound.playSuccess();
      setTimerRunning(false);
      handleLogSession();
    }
    return () => clearInterval(interval);
  }, [timerRunning, seconds]);

  // Box Breathing Guide (Cold Plunge only)
  useEffect(() => {
    if (activeTab === 'cold_plunge' && timerRunning) {
      breathTimerRef.current = setInterval(() => {
        setBreathCount(prev => {
          if (prev <= 1) {
            setBreathPhase(phase => {
              if (phase === 'Inhale') return 'Hold';
              if (phase === 'Hold') return 'Exhale';
              if (phase === 'Exhale') return 'Hold Empty';
              return 'Inhale';
            });
            return 4;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(breathTimerRef.current);
      setBreathPhase('Inhale');
      setBreathCount(4);
    }
    return () => clearInterval(breathTimerRef.current);
  }, [activeTab, timerRunning]);

  const handleSelectRedLight = (opt) => {
    sound.playClick();
    setSelectedTarget(opt.label);
    setSeconds(opt.mins * 60);
    setInitialSeconds(opt.mins * 60);
    setTimerRunning(false);
  };

  const handleToggleTimer = () => {
    if (!timerRunning) sound.playClick();
    else sound.playAlert();
    setTimerRunning(!timerRunning);
  };

  const handleReset = () => {
    sound.playClick();
    setTimerRunning(false);
    setSeconds(initialSeconds);
  };

  const handleLogSession = () => {
    sound.playSuccess();
    const elapsedMins = Math.max(1, Math.round((initialSeconds - seconds) / 60));
    const newLog = {
      id: 'w-' + Date.now(),
      type: activeTab,
      title: activeTab === 'red_light' ? `Red Light: ${selectedTarget}` : activeTab === 'cold_plunge' ? 'Cold Plunge Session' : 'Sauna Session',
      durationMinutes: elapsedMins || 10,
      timestamp: 'Today ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    onUpdateWellness([newLog, ...wellnessLogs]);
  };

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{ animation: 'popIn 0.2s ease' }}>
      <div className="section-header">
        <div>
          <h2>Wellness & Recovery Hub</h2>
          <p>Simple guided timers for photobiomodulation, deliberate cold, and sauna.</p>
        </div>
      </div>

      {/* Top Simple Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        {[
          { id: 'red_light', label: '🔴 Red Light Therapy', defaultMins: 15 },
          { id: 'cold_plunge', label: '🧊 Cold Plunge', defaultMins: 3 },
          { id: 'sauna', label: '🔥 Sauna', defaultMins: 20 }
        ].map(tab => (
          <button
            key={tab.id}
            className={`btn btn-secondary ${activeTab === tab.id ? 'active' : ''}`}
            style={{
              flex: 1,
              padding: '12px',
              fontSize: '14px',
              background: activeTab === tab.id ? 'rgba(0, 242, 254, 0.12)' : 'var(--bg-card)',
              borderColor: activeTab === tab.id ? 'var(--accent-cyan)' : 'var(--border)',
              color: activeTab === tab.id ? '#fff' : 'var(--text-muted)'
            }}
            onClick={() => {
              sound.playClick();
              setActiveTab(tab.id);
              setSeconds(tab.defaultMins * 60);
              setInitialSeconds(tab.defaultMins * 60);
              setTimerRunning(false);
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Timer Display */}
      <div className="card" style={{ textAlign: 'center', padding: '36px 20px', maxWidth: '600px', margin: '0 auto 24px auto' }}>
        
        {/* Red Light Options Selector */}
        {activeTab === 'red_light' && (
          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '10px', textTransform: 'uppercase' }}>
              Select Target Area:
            </div>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
              {RED_LIGHT_OPTIONS.map(opt => (
                <button
                  key={opt.label}
                  className={`btn btn-secondary ${selectedTarget === opt.label ? 'active' : ''}`}
                  style={{
                    fontSize: '12px',
                    padding: '6px 12px',
                    borderColor: selectedTarget === opt.label ? 'var(--accent-pink)' : 'var(--border)',
                    color: selectedTarget === opt.label ? '#fff' : 'var(--text-muted)'
                  }}
                  onClick={() => handleSelectRedLight(opt)}
                >
                  {opt.name} ({opt.mins}m)
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Cold Plunge Breathing Guide */}
        {activeTab === 'cold_plunge' && (
          <div style={{ marginBottom: '20px' }}>
            <div
              style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                border: '3px solid var(--accent-cyan)',
                margin: '0 auto 12px auto',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: timerRunning ? '0 0 20px rgba(0, 242, 254, 0.4)' : 'none',
                transition: 'transform 0.4s ease',
                transform: breathPhase === 'Inhale' ? 'scale(1.15)' : breathPhase === 'Exhale' ? 'scale(0.9)' : 'scale(1)'
              }}
            >
              <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--accent-cyan)', textTransform: 'uppercase' }}>
                {breathPhase}
              </span>
              <span style={{ fontSize: '20px', fontWeight: '800', fontFamily: 'var(--font-mono)' }}>
                {breathCount}s
              </span>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>4s Box Breathing Cadence</div>
          </div>
        )}

        {/* Big Digital Countdown */}
        <div style={{ fontSize: '64px', fontWeight: '800', fontFamily: 'var(--font-mono)', color: '#fff', margin: '10px 0 24px 0' }}>
          {formatTime(seconds)}
        </div>

        {/* Big Clean Buttons */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button
            className={timerRunning ? 'btn btn-danger' : 'btn btn-primary'}
            style={{ padding: '12px 32px', fontSize: '15px' }}
            onClick={handleToggleTimer}
          >
            {timerRunning ? '⏸ Pause' : '▶ Start Timer'}
          </button>
          <button className="btn btn-secondary" style={{ padding: '12px 20px' }} onClick={handleReset}>
            ↺ Reset
          </button>
          <button className="btn btn-secondary" style={{ padding: '12px 20px' }} onClick={handleLogSession}>
            ✓ Log
          </button>
        </div>
      </div>

      {/* Simple Session History */}
      <div className="card">
        <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '14px', color: '#fff' }}>
          Recent Recovery Logs
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {wellnessLogs.slice(0, 5).map(log => (
            <div
              key={log.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 14px',
                background: 'rgba(255,255,255,0.02)',
                borderRadius: '8px',
                border: '1px solid var(--border)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '18px' }}>
                  {log.type === 'red_light' ? '🔴' : log.type === 'cold_plunge' ? '🧊' : '🔥'}
                </span>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#fff' }}>{log.title}</span>
              </div>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{log.timestamp}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
