import React, { useState } from 'react';
import { sound } from '../utils/audio';

export default function BiomarkerLogView({ biomarkerLogs, onUpdateBiomarkerLogs }) {
  const [skin, setSkin] = useState(8);
  const [hair, setHair] = useState(8);
  const [energy, setEnergy] = useState(8);
  const [sleep, setSleep] = useState(8);
  const [eyesight, setEyesight] = useState(8);
  const [notes, setNotes] = useState('');
  const [isLoggedNotice, setIsLoggedNotice] = useState(false);

  const handleSaveLog = (e) => {
    e.preventDefault();
    sound.playSuccess();

    const newEntry = {
      id: 'bio-' + Date.now(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      skin: Number(skin),
      hair: Number(hair),
      energy: Number(energy),
      sleep: Number(sleep),
      eyesight: Number(eyesight),
      overallAvg: ((Number(skin) + Number(hair) + Number(energy) + Number(sleep) + Number(eyesight)) / 5).toFixed(1),
      notes: notes.trim()
    };

    onUpdateBiomarkerLogs([newEntry, ...biomarkerLogs]);
    setNotes('');
    setIsLoggedNotice(true);
    setTimeout(() => setIsLoggedNotice(false), 2500);
  };

  const handleDeleteEntry = (id) => {
    sound.playAlert();
    onUpdateBiomarkerLogs(biomarkerLogs.filter(b => b.id !== id));
  };

  // Compute latest averages
  const latestLog = biomarkerLogs[0];

  return (
    <div style={{ animation: 'popIn 0.2s ease' }}>
      <div className="section-header">
        <div>
          <h2>Biomarkers & Phenotype Tracker</h2>
          <p>Track your skin glow, hair density, energy levels, sleep depth, and eyesight clarity over time.</p>
        </div>
        {isLoggedNotice && (
          <span className="badge badge-green" style={{ fontSize: '12px', padding: '6px 12px' }}>
            ✓ Today's Biomarkers Logged!
          </span>
        )}
      </div>

      {/* QUICK SUMMARY CARDS OF LATEST RATINGS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '12px', marginBottom: '24px' }}>
        <div className="card" style={{ marginBottom: 0, textAlign: 'center', padding: '16px' }}>
          <div style={{ fontSize: '24px', marginBottom: '4px' }}>✨</div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>Skin Quality</div>
          <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--accent-pink)', marginTop: '2px' }}>
            {latestLog ? latestLog.skin : '8.0'} <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>/ 10</span>
          </div>
        </div>

        <div className="card" style={{ marginBottom: 0, textAlign: 'center', padding: '16px' }}>
          <div style={{ fontSize: '24px', marginBottom: '4px' }}>💇</div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>Hair Health</div>
          <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--accent-purple)', marginTop: '2px' }}>
            {latestLog ? latestLog.hair : '8.0'} <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>/ 10</span>
          </div>
        </div>

        <div className="card" style={{ marginBottom: 0, textAlign: 'center', padding: '16px' }}>
          <div style={{ fontSize: '24px', marginBottom: '4px' }}>⚡</div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>Energy Levels</div>
          <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--accent-cyan)', marginTop: '2px' }}>
            {latestLog ? latestLog.energy : '8.5'} <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>/ 10</span>
          </div>
        </div>

        <div className="card" style={{ marginBottom: 0, textAlign: 'center', padding: '16px' }}>
          <div style={{ fontSize: '24px', marginBottom: '4px' }}>🌙</div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>Sleep Quality</div>
          <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--accent-green)', marginTop: '2px' }}>
            {latestLog ? latestLog.sleep : '8.0'} <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>/ 10</span>
          </div>
        </div>

        <div className="card" style={{ marginBottom: 0, textAlign: 'center', padding: '16px' }}>
          <div style={{ fontSize: '24px', marginBottom: '4px' }}>👁️</div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>Eyesight & Focus</div>
          <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--accent-amber)', marginTop: '2px' }}>
            {latestLog ? latestLog.eyesight : '8.0'} <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>/ 10</span>
          </div>
        </div>
      </div>

      {/* DAILY BIOMARKER LOGGING FORM */}
      <div className="card" style={{ padding: '24px', marginBottom: '28px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#fff', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>📝</span> Log Today's Biological Markers (Scale of 1 - 10)
        </h3>

        <form onSubmit={handleSaveLog}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '20px' }}>
            {/* Skin */}
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '14px 18px', borderRadius: '10px', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontWeight: '700', fontSize: '14px', color: '#fff' }}>✨ Skin Glow & Elasticity</span>
                <span style={{ fontWeight: '800', color: 'var(--accent-pink)', fontFamily: 'var(--font-mono)' }}>{skin} / 10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={skin}
                onChange={(e) => setSkin(e.target.value)}
                style={{ width: '100%', accentColor: 'var(--accent-pink)', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5px', color: 'var(--text-dim)', marginTop: '4px' }}>
                <span>Dry / Breakouts</span>
                <span>Radiant / Youthful</span>
              </div>
            </div>

            {/* Hair */}
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '14px 18px', borderRadius: '10px', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontWeight: '700', fontSize: '14px', color: '#fff' }}>💇 Hair Density & Texture</span>
                <span style={{ fontWeight: '800', color: 'var(--accent-purple)', fontFamily: 'var(--font-mono)' }}>{hair} / 10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={hair}
                onChange={(e) => setHair(e.target.value)}
                style={{ width: '100%', accentColor: 'var(--accent-purple)', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5px', color: 'var(--text-dim)', marginTop: '4px' }}>
                <span>Shedding / Thinning</span>
                <span>Thick / Root Strength</span>
              </div>
            </div>

            {/* Energy */}
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '14px 18px', borderRadius: '10px', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontWeight: '700', fontSize: '14px', color: '#fff' }}>⚡ Daytime Energy & Drive</span>
                <span style={{ fontWeight: '800', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>{energy} / 10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={energy}
                onChange={(e) => setEnergy(e.target.value)}
                style={{ width: '100%', accentColor: 'var(--accent-cyan)', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5px', color: 'var(--text-dim)', marginTop: '4px' }}>
                <span>Sluggish / Brain Fog</span>
                <span>Surging Clean ATP</span>
              </div>
            </div>

            {/* Sleep */}
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '14px 18px', borderRadius: '10px', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontWeight: '700', fontSize: '14px', color: '#fff' }}>🌙 Sleep Depth & Recovery</span>
                <span style={{ fontWeight: '800', color: 'var(--accent-green)', fontFamily: 'var(--font-mono)' }}>{sleep} / 10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={sleep}
                onChange={(e) => setSleep(e.target.value)}
                style={{ width: '100%', accentColor: 'var(--accent-green)', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5px', color: 'var(--text-dim)', marginTop: '4px' }}>
                <span>Restless / Waking</span>
                <span>Deep Slow-Wave Rest</span>
              </div>
            </div>

            {/* Eyesight */}
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '14px 18px', borderRadius: '10px', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontWeight: '700', fontSize: '14px', color: '#fff' }}>👁️ Eyesight & Visual Acuity</span>
                <span style={{ fontWeight: '800', color: 'var(--accent-amber)', fontFamily: 'var(--font-mono)' }}>{eyesight} / 10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={eyesight}
                onChange={(e) => setEyesight(e.target.value)}
                style={{ width: '100%', accentColor: 'var(--accent-amber)', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5px', color: 'var(--text-dim)', marginTop: '4px' }}>
                <span>Eye Fatigue / Blurry</span>
                <span>Sharp Contrast & Focus</span>
              </div>
            </div>

            {/* Notes */}
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '14px 18px', borderRadius: '10px', border: '1px solid var(--border)' }}>
              <label className="input-label">Daily Biohack Notes & Observations</label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g. Skin clearer 4 days into GHK-Cu, energy up from SS-31..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn btn-primary" style={{ padding: '12px 28px', fontSize: '14px' }}>
              ✓ Save Today's Biomarkers Log
            </button>
          </div>
        </form>
      </div>

      {/* BIOMARKER HISTORICAL TIMELINE */}
      <div className="card">
        <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#fff', marginBottom: '16px' }}>
          Biomarker Progression History ({biomarkerLogs.length} Entries)
        </h3>

        {biomarkerLogs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)', fontSize: '13px' }}>
            No biomarker entries logged yet. Slide the ratings above and click "Save Today's Biomarkers Log"!
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {biomarkerLogs.map((log) => (
              <div
                key={log.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '14px 18px',
                  background: 'rgba(255,255,255,0.02)',
                  borderRadius: '10px',
                  border: '1px solid var(--border)',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '14px', fontWeight: '700', color: '#fff' }}>{log.date}</span>
                    <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>({log.timestamp})</span>
                    <span className="badge badge-cyan">Avg: {log.overallAvg}/10</span>
                  </div>
                  {log.notes && (
                    <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '4px', fontStyle: 'italic' }}>
                      "{log.notes}"
                    </div>
                  )}
                </div>

                {/* Score Badges */}
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span className="badge badge-pink" title="Skin">✨ {log.skin}</span>
                  <span className="badge badge-cyan" title="Hair">💇 {log.hair}</span>
                  <span className="badge badge-cyan" title="Energy">⚡ {log.energy}</span>
                  <span className="badge badge-green" title="Sleep">🌙 {log.sleep}</span>
                  <span className="badge badge-amber" title="Eyesight">👁️ {log.eyesight}</span>
                  
                  <button
                    className="btn btn-danger"
                    style={{ padding: '4px 8px', fontSize: '11px', marginLeft: '6px' }}
                    onClick={() => handleDeleteEntry(log.id)}
                    title="Delete Entry"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
