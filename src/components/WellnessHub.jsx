import React, { useState, useEffect, useRef } from 'react';
import { sound } from '../utils/audio';

export default function WellnessHub({ wellnessLogs, onUpdateWellness }) {
  const [activeTool, setActiveTool] = useState('red_light'); // 'red_light' | 'cold_plunge' | 'sauna'
  
  // Timer States
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(600); // 10 minutes default
  const [initialSeconds, setInitialSeconds] = useState(600);
  const [selectedPreset, setSelectedPreset] = useState('full_body');
  
  // Cold Plunge specific
  const [plungeTempF, setPlungeTempF] = useState(45);
  const [breathingPhase, setBreathingPhase] = useState('Inhale'); // Inhale, Hold, Exhale, Hold
  const [breathingCounter, setBreathingCounter] = useState(4);
  const breathingTimerRef = useRef(null);

  // Red Light Presets
  const RED_LIGHT_PRESETS = [
    {
      id: 'full_body',
      name: 'Full Body Circadian Recharge',
      duration: 15 * 60,
      wavelength: '660nm Red (50%) + 850nm NIR (50%)',
      irradiance: '100 mW/cm² at 6 inches',
      target: 'Mitochondrial Cytochrome C Oxidase & Systemic ATP',
      notes: 'Morning circadian jumpstart. Eye protection recommended for direct gaze.',
      tag: 'Circadian'
    },
    {
      id: 'no_no_square',
      name: 'Perineal & "No-No Square" Leydig Protocol',
      duration: 8 * 60,
      wavelength: '660nm Pure Deep Red (Avoid high heat NIR)',
      irradiance: '40-50 mW/cm² at 10-12 inches',
      target: 'Leydig Cell ATP Synthesis & Local Blood Flow',
      notes: 'Strict 8-minute cap. Keep 12+ inches distance to prevent thermal testicular stress.',
      tag: 'Hormonal / Leydig'
    },
    {
      id: 'face_thyroid',
      name: 'Face, Collagen & Thyroid Phototherapy',
      duration: 10 * 60,
      wavelength: '630nm / 660nm Red LED',
      irradiance: '60 mW/cm² at 8 inches',
      target: 'Fibroblast Procollagen-1 & Thyroid Microcirculation',
      notes: 'Clean dry skin. Enhances skin barrier and thyroid cellular respiration.',
      tag: 'Dermatology'
    },
    {
      id: 'joint_injury',
      name: 'Deep Joint / Tendon Focused NIR',
      duration: 20 * 60,
      wavelength: '850nm Deep Near-Infrared',
      irradiance: '120 mW/cm² direct contact / 2 inches',
      target: 'Deep Connective Tissue & Tendinopathy Repair',
      notes: 'Deep penetration through synovial fluid and tendons.',
      tag: 'Rehab'
    }
  ];

  // Set Timer based on Preset
  const handleSelectPreset = (preset) => {
    sound.playClick();
    setSelectedPreset(preset.id);
    setTimerSeconds(preset.duration);
    setInitialSeconds(preset.duration);
    setTimerRunning(false);
  };

  // Timer Tick Effect
  useEffect(() => {
    let interval = null;
    if (timerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && timerRunning) {
      sound.playSuccess();
      setTimerRunning(false);
      handleLogSession();
    }
    return () => clearInterval(interval);
  }, [timerRunning, timerSeconds]);

  // Box Breathing Guide for Cold Plunge (4s In, 4s Hold, 4s Out, 4s Hold)
  useEffect(() => {
    if (activeTool === 'cold_plunge' && timerRunning) {
      breathingTimerRef.current = setInterval(() => {
        setBreathingCounter((prev) => {
          if (prev <= 1) {
            setBreathingPhase((phase) => {
              if (phase === 'Inhale (4s)') return 'Hold Breath (4s)';
              if (phase === 'Hold Breath (4s)') return 'Exhale Smooth (4s)';
              if (phase === 'Exhale Smooth (4s)') return 'Hold Empty (4s)';
              return 'Inhale (4s)';
            });
            return 4;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(breathingTimerRef.current);
      setBreathingPhase('Inhale (4s)');
      setBreathingCounter(4);
    }
    return () => clearInterval(breathingTimerRef.current);
  }, [activeTool, timerRunning]);

  const handleToggleTimer = () => {
    if (!timerRunning) sound.playClick();
    else sound.playAlert();
    setTimerRunning(!timerRunning);
  };

  const handleResetTimer = () => {
    sound.playClick();
    setTimerRunning(false);
    setTimerSeconds(initialSeconds);
  };

  const handleLogSession = () => {
    const elapsedMinutes = Math.max(1, Math.round((initialSeconds - timerSeconds) / 60));
    let newLog = null;

    if (activeTool === 'red_light') {
      const presetObj = RED_LIGHT_PRESETS.find((p) => p.id === selectedPreset) || RED_LIGHT_PRESETS[0];
      newLog = {
        id: 'w-' + Date.now(),
        type: 'red_light',
        title: presetObj.name,
        durationMinutes: elapsedMinutes || 10,
        wavelength: presetObj.wavelength,
        irradiance: presetObj.irradiance,
        targetArea: presetObj.target,
        timestamp: 'Today ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        notes: presetObj.notes
      };
    } else if (activeTool === 'cold_plunge') {
      newLog = {
        id: 'w-' + Date.now(),
        type: 'cold_plunge',
        title: `Cold Immersion (${plungeTempF}°F)`,
        durationMinutes: (elapsedMinutes || 3.5),
        tempF: plungeTempF,
        breathingMethod: 'Box Breathing Cadence',
        timestamp: 'Today ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        notes: 'Dopamine surge & brown adipose tissue thermogenesis.'
      };
    } else {
      newLog = {
        id: 'w-' + Date.now(),
        type: 'sauna',
        title: 'Infrared Hyperthermia Session',
        durationMinutes: elapsedMinutes || 20,
        tempF: 185,
        timestamp: 'Today ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        notes: 'Heat shock protein induction & cardiovascular flush.'
      };
    }

    if (newLog) {
      onUpdateWellness([newLog, ...wellnessLogs]);
      sound.playSuccess();
    }
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  // Weekly stats
  const coldLogs = wellnessLogs.filter((l) => l.type === 'cold_plunge');
  const coldWeeklyMinutes = coldLogs.reduce((acc, curr) => acc + (parseFloat(curr.durationMinutes) || 0), 0);
  const redLightLogs = wellnessLogs.filter((l) => l.type.includes('red_light'));

  return (
    <div className="animate-fade-in">
      <div className="view-header">
        <div className="view-title-group">
          <h2>Biohacking & Wellness Protocols</h2>
          <p>Photobiomodulation, cold shock therapy, and heat exposure with guided timers and bio-metrics.</p>
        </div>
      </div>

      {/* Tool Navigation Tabs */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '28px' }}>
        {[
          { id: 'red_light', name: '🔴 Photobiomodulation & Red Light', icon: '⚡' },
          { id: 'cold_plunge', name: '❄️ Cold Plunge & Deliberate Cold', icon: '🧊' },
          { id: 'sauna', name: '🔥 Sauna & Heat Shock Proteins', icon: '🌡️' }
        ].map((tool) => (
          <button
            key={tool.id}
            className="btn-secondary"
            style={{
              padding: '12px 20px',
              fontSize: '14px',
              fontWeight: '700',
              background: activeTool === tool.id ? 'linear-gradient(135deg, rgba(0, 242, 254, 0.15) 0%, rgba(255, 42, 109, 0.15) 100%)' : 'rgba(255,255,255,0.03)',
              borderColor: activeTool === tool.id ? 'var(--neon-cyan)' : 'var(--border-glass)',
              color: activeTool === tool.id ? '#fff' : 'var(--text-muted)'
            }}
            onClick={() => { sound.playClick(); setActiveTool(tool.id); setTimerRunning(false); }}
          >
            {tool.name}
          </button>
        ))}
      </div>

      {/* RED LIGHT SECTION */}
      {activeTool === 'red_light' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px', marginBottom: '32px' }}>
          {/* Preset Selector */}
          <div className="glass-panel">
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: 'var(--neon-crimson)' }}>◈</span> Select Target Zone Protocol
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {RED_LIGHT_PRESETS.map((preset) => {
                const isSel = selectedPreset === preset.id;
                return (
                  <div
                    key={preset.id}
                    onClick={() => handleSelectPreset(preset)}
                    style={{
                      background: isSel ? 'rgba(255, 42, 109, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                      border: isSel ? '1px solid var(--neon-crimson)' : '1px solid var(--border-glass)',
                      borderRadius: '12px',
                      padding: '16px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      position: 'relative'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <h4 style={{ fontSize: '15px', fontWeight: '700', color: isSel ? '#fff' : 'var(--text-main)' }}>{preset.name}</h4>
                        <span className={`tag-badge ${preset.id === 'no_no_square' ? 'tag-crimson' : 'tag-cyan'}`}>
                          {preset.tag}
                        </span>
                      </div>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: '700', color: 'var(--neon-crimson)' }}>
                        {preset.duration / 60} mins
                      </span>
                    </div>

                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                      <strong>Wavelength:</strong> {preset.wavelength}
                    </div>
                    <div style={{ fontSize: '11.5px', color: 'var(--text-dark)' }}>
                      {preset.notes}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Live Glowing Red Light HUD Timer */}
          <div
            className="glass-panel"
            style={{
              border: timerRunning ? '1px solid var(--neon-crimson)' : '1px solid rgba(255, 42, 109, 0.3)',
              background: 'radial-gradient(circle at center, rgba(255, 42, 109, 0.15) 0%, rgba(10, 12, 18, 0.95) 75%)',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '36px 20px',
              boxShadow: timerRunning ? '0 0 50px rgba(255, 42, 109, 0.3)' : 'none'
            }}
          >
            <div className="tag-badge tag-crimson" style={{ marginBottom: '16px' }}>
              {timerRunning ? '⚡ PHOTONS EMITTING (660nm / 850nm)' : 'STANDBY MODE'}
            </div>

            <div
              style={{
                fontSize: '68px',
                fontWeight: '800',
                fontFamily: 'var(--font-mono)',
                color: '#fff',
                textShadow: timerRunning ? '0 0 30px #ff2a6d, 0 0 60px #ff2a6d' : 'none',
                letterSpacing: '-0.02em',
                marginBottom: '10px'
              }}
            >
              {formatTime(timerSeconds)}
            </div>

            <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '28px' }}>
              Target: <strong style={{ color: '#fff' }}>{RED_LIGHT_PRESETS.find(p => p.id === selectedPreset)?.name}</strong>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                className={timerRunning ? 'btn-crimson' : 'btn-primary'}
                style={{ padding: '12px 30px', fontSize: '15px' }}
                onClick={handleToggleTimer}
              >
                {timerRunning ? '⏸ Pause Phototherapy' : '▶ Begin Session'}
              </button>
              <button className="btn-secondary" onClick={handleResetTimer}>
                ↺ Reset
              </button>
              <button className="btn-secondary" onClick={handleLogSession}>
                ✓ Log Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* COLD PLUNGE SECTION */}
      {activeTool === 'cold_plunge' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px', marginBottom: '32px' }}>
          {/* Temperature & Huberman Metrics */}
          <div className="glass-panel">
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: 'var(--neon-cyan)' }}>🧊</span> Deliberate Cold Exposure Parameters
            </h3>

            <div style={{ marginBottom: '20px' }}>
              <label className="bio-label">Water Temperature (°F / °C)</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <input
                  type="range"
                  min="34"
                  max="60"
                  value={plungeTempF}
                  onChange={(e) => setPlungeTempF(parseInt(e.target.value))}
                  style={{ flex: 1, accentColor: 'var(--neon-cyan)' }}
                />
                <span style={{ fontSize: '22px', fontWeight: '800', fontFamily: 'var(--font-mono)', color: 'var(--neon-cyan)' }}>
                  {plungeTempF}°F <span style={{ fontSize: '14px', color: 'var(--text-dark)' }}>({Math.round((plungeTempF - 32) * 5 / 9)}°C)</span>
                </span>
              </div>
            </div>

            {/* Huberman 11 min/week target tracker */}
            <div style={{ background: 'rgba(0, 242, 254, 0.05)', border: '1px solid rgba(0, 242, 254, 0.2)', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: '700', color: '#fff' }}>Weekly Protocol Target (Huberman Standard)</span>
                <span style={{ fontSize: '13px', fontFamily: 'var(--font-mono)', color: 'var(--neon-cyan)' }}>
                  {coldWeeklyMinutes.toFixed(1)} / 11.0 mins
                </span>
              </div>
              <div style={{ height: '10px', background: 'rgba(255,255,255,0.08)', borderRadius: '10px', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${Math.min(100, (coldWeeklyMinutes / 11.0) * 100)}%`,
                    background: 'linear-gradient(90deg, #00f2fe 0%, #05ffa1 100%)',
                    boxShadow: '0 0 10px rgba(0, 242, 254, 0.8)'
                  }}
                />
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px' }}>
                ⚡ 11 minutes per week spread across 2-4 sessions maximizes brown adipose tissue and yields sustained 250% dopamine spikes for 3+ hours.
              </div>
            </div>

            {/* Quick Time Selectors */}
            <div>
              <label className="bio-label">Target Duration</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[2, 3, 4, 5].map((mins) => (
                  <button
                    key={mins}
                    className="btn-secondary"
                    style={{ flex: 1, textAlign: 'center', borderColor: initialSeconds === mins * 60 ? 'var(--neon-cyan)' : 'var(--border-glass)' }}
                    onClick={() => {
                      sound.playClick();
                      setTimerSeconds(mins * 60);
                      setInitialSeconds(mins * 60);
                      setTimerRunning(false);
                    }}
                  >
                    {mins} Mins
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Plunge Timer with Live Box Breathing Ring */}
          <div
            className="glass-panel"
            style={{
              border: timerRunning ? '1px solid var(--neon-cyan)' : '1px solid rgba(0, 242, 254, 0.3)',
              background: 'radial-gradient(circle at center, rgba(0, 242, 254, 0.15) 0%, rgba(8, 12, 20, 0.95) 75%)',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '36px 20px',
              boxShadow: timerRunning ? '0 0 50px rgba(0, 242, 254, 0.3)' : 'none'
            }}
          >
            {/* Box Breathing HUD Ring */}
            <div
              style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                border: '3px solid var(--neon-cyan)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
                boxShadow: timerRunning ? '0 0 25px rgba(0, 242, 254, 0.5)' : 'none',
                transition: 'all 0.5s ease',
                transform: breathingPhase.includes('Inhale') ? 'scale(1.15)' : breathingPhase.includes('Exhale') ? 'scale(0.9)' : 'scale(1.0)'
              }}
            >
              <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--neon-cyan)' }}>
                {breathingPhase}
              </span>
              <span style={{ fontSize: '24px', fontWeight: '800', fontFamily: 'var(--font-mono)', color: '#fff' }}>
                {breathingCounter}s
              </span>
            </div>

            <div
              style={{
                fontSize: '56px',
                fontWeight: '800',
                fontFamily: 'var(--font-mono)',
                color: '#fff',
                textShadow: timerRunning ? '0 0 30px #00f2fe' : 'none',
                letterSpacing: '-0.02em',
                marginBottom: '10px'
              }}
            >
              {formatTime(timerSeconds)}
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                className={timerRunning ? 'btn-crimson' : 'btn-primary'}
                style={{ padding: '12px 28px', fontSize: '14px' }}
                onClick={handleToggleTimer}
              >
                {timerRunning ? '⏸ Pause Plunge' : '🧊 Immerse Now'}
              </button>
              <button className="btn-secondary" onClick={handleResetTimer}>↺ Reset</button>
              <button className="btn-secondary" onClick={handleLogSession}>✓ Log</button>
            </div>
          </div>
        </div>
      )}

      {/* SAUNA SECTION */}
      {activeTool === 'sauna' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px', marginBottom: '32px' }}>
          <div className="glass-panel">
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: 'var(--neon-amber)' }}>🔥</span> Heat Shock & Sauna Protocol
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '18px' }}>
              57 minutes of sauna per week divided into 2-3 sessions induces Heat Shock Protein (HSP70) expression, mimicking moderate cardiovascular exercise and dramatically reducing all-cause cardiovascular mortality.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-glass)' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>STANDARD TEMPERATURE</div>
                <div style={{ fontSize: '20px', fontWeight: '800', color: 'var(--neon-amber)', marginTop: '4px' }}>175°F - 200°F</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-glass)' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>WEEKLY GOAL</div>
                <div style={{ fontSize: '20px', fontWeight: '800', color: '#fff', marginTop: '4px' }}>57 Minutes</div>
              </div>
            </div>
          </div>

          <div className="glass-panel" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '36px 20px' }}>
            <div className="tag-badge tag-amber" style={{ marginBottom: '14px' }}>SAUNA TIMER</div>
            <div style={{ fontSize: '56px', fontWeight: '800', fontFamily: 'var(--font-mono)', color: '#fff', marginBottom: '14px' }}>
              {formatTime(timerSeconds)}
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn-primary" onClick={handleToggleTimer}>
                {timerRunning ? '⏸ Pause' : '▶ Start Heat Session'}
              </button>
              <button className="btn-secondary" onClick={handleResetTimer}>↺ Reset</button>
              <button className="btn-secondary" onClick={handleLogSession}>✓ Log Session</button>
            </div>
          </div>
        </div>
      )}

      {/* Wellness Session History Log */}
      <div className="glass-panel">
        <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>Verified Wellness Audit Records</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {wellnessLogs.map((log) => (
            <div
              key={log.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '14px 18px',
                background: 'rgba(255,255,255,0.02)',
                borderRadius: '10px',
                border: '1px solid var(--border-glass)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '20px' }}>
                  {log.type.includes('red_light') ? '🔴' : log.type === 'cold_plunge' ? '🧊' : '🔥'}
                </span>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: '#fff' }}>{log.title}</div>
                  <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>{log.notes}</div>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '14px', fontWeight: '700', fontFamily: 'var(--font-mono)', color: 'var(--neon-cyan)' }}>
                  {log.durationMinutes} Minutes
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-dark)' }}>{log.timestamp}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
