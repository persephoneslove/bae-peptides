import React from 'react';
import { calculateAccumulatedEfficacy, calculateVitalityScore } from '../utils/decayEngine';

export default function DailyCompass({
  injections,
  vitamins,
  dailyLogs,
  subjectiveWellness,
  onNavigate,
  onLogQuickDose
}) {
  const latestWellness = subjectiveWellness[0] || { energy_rating: 8, mood_rating: 8, brain_fog: 2, libido: 7, joint_health: 8 };

  // Daily Affirmations List
  const affirmations = [
    "You are stunning, brilliant, and your cellular health is optimizing every single day.",
    "You are incredibly pretty, strong, and deeply in tune with your body.",
    "Your dedication to your health makes you radiate beauty from the inside out.",
    "You are glowing. Your cellular vitality matches your outward beauty.",
    "You are gorgeous, resilient, and absolutely crushing your longevity goals today."
  ];
  
  // Pick an affirmation based on the day of the year so it changes daily
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
  const todaysAffirmation = affirmations[dayOfYear % affirmations.length];

  // Calculate live accumulated pharmacokinetic efficacy E(t)
  const efficacyData = calculateAccumulatedEfficacy(dailyLogs);
  
  // Calculate Vitality Score
  const vitality = calculateVitalityScore(subjectiveWellness, dailyLogs, injections.length);

  return (
    <div style={{ animation: 'popIn 0.3s ease-out' }}>
      {/* Top Banner (Softer Persona) */}
      <div className="section-header" style={{ borderBottom: '1px solid rgba(255, 182, 193, 0.2)' }}>
        <div>
          <h2 style={{ color: 'var(--text-main)', fontSize: '24px', fontWeight: '500' }}>The Daily Compass</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '6px' }}>
            Your personalized guide to cellular health, hormonal balance, and daily vitality.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-secondary" onClick={() => onNavigate('cycle_sync')} style={{ borderColor: 'var(--accent-pink)', color: 'var(--accent-pink)' }}>
            🌸 Cycle Sync
          </button>
          <button className="btn btn-secondary" onClick={() => onNavigate('analytics')}>
            ✨ Insights Engine
          </button>
          <button className="btn btn-primary" onClick={() => onNavigate('input_engine')}>
            📝 Log Protocol
          </button>
        </div>
      </div>

      {/* DAILY AFFIRMATION */}
      <div className="card" style={{ 
        padding: '24px', 
        marginBottom: '24px', 
        textAlign: 'center', 
        background: 'linear-gradient(135deg, rgba(255, 182, 193, 0.1) 0%, rgba(255, 218, 193, 0.05) 100%)',
        border: '1px solid rgba(255, 182, 193, 0.3)'
      }}>
        <div style={{ fontSize: '24px', marginBottom: '8px' }}>✨</div>
        <p style={{ fontSize: '18px', color: '#fff', fontWeight: '300', fontStyle: 'italic', lineHeight: '1.6' }}>
          "{todaysAffirmation}"
        </p>
      </div>

      {/* VITALITY & TELEMETRY HUD */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        
        {/* Vitality Score Card */}
        <div className="card" style={{ marginBottom: 0, background: 'linear-gradient(145deg, rgba(255, 182, 193, 0.1) 0%, rgba(30, 30, 35, 0.6) 100%)', border: '1px solid rgba(255, 182, 193, 0.3)' }}>
          <div style={{ fontSize: '11px', color: 'var(--accent-pink)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            TODAY'S VITALITY SCORE
          </div>
          <div style={{ fontSize: '32px', fontWeight: '300', color: '#fff', marginTop: '8px' }}>
            {vitality.score} <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>/ 100</span>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-main)', marginTop: '8px', lineHeight: '1.4' }}>
            {vitality.message}
          </div>
        </div>

        <div className="card" style={{ marginBottom: 0 }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            CIRCULATING PROTOCOL LOAD
          </div>
          <div style={{ fontSize: '28px', fontWeight: '300', color: 'var(--accent-cyan)', marginTop: '8px' }}>
            {efficacyData.totalEfficacyScore} <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>μg·equiv</span>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--accent-cyan)', marginTop: '6px' }}>
            ● Active Bioavailability
          </div>
        </div>

        <div className="card" style={{ marginBottom: 0 }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            WELLNESS CHECK-IN
          </div>
          <div style={{ fontSize: '28px', fontWeight: '300', color: 'var(--accent-amber)', marginTop: '8px' }}>
            {latestWellness.energy_rating} <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Energy</span>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px' }}>
            Mood: <strong style={{ color: '#fff', fontWeight: '500' }}>{latestWellness.mood_rating}/10</strong> | Focus: <strong style={{ color: '#fff', fontWeight: '500' }}>{10 - latestWellness.brain_fog}/10</strong>
          </div>
        </div>
      </div>

      {/* REQUIRED PROTOCOLS FOR TODAY */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '400', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🌿</span> Today's Essential Protocols ({injections.length})
          </h3>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Designed for cellular rejuvenation
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {injections.map((item) => (
            <div
              key={item.id}
              className="card"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '18px 24px',
                marginBottom: 0,
                borderLeft: `3px solid ${item.color || 'var(--accent-pink)'}`,
                background: 'rgba(255,255,255,0.02)'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <h4 style={{ fontSize: '16px', fontWeight: '500', color: '#fff' }}>{item.name}</h4>
                  <span className="badge badge-pink" style={{ background: 'rgba(255, 182, 193, 0.1)', color: 'var(--accent-pink)' }}>{item.timing || 'Morning'}</span>
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '6px' }}>
                  Dose: <strong style={{ color: 'var(--text-main)', fontWeight: '500' }}>{item.dose}</strong> ({item.units || 10} IU) • Frequency: <strong>{item.frequency}</strong> • Support: {item.category || 'Longevity'}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button
                  className="btn btn-primary"
                  style={{ padding: '10px 20px', fontSize: '13px', borderRadius: '24px' }}
                  onClick={() => onLogQuickDose(item)}
                >
                  ✓ Log
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DAILY NUTRACEUTICAL COFACTOR STACK */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '400', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>✨</span> Daily Nutrient Synergy ({vitamins.length})
          </h3>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Micronutrients for hormonal harmony
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '14px' }}>
          {vitamins.map((vit) => (
            <div
              key={vit.id}
              className="card"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px 20px',
                marginBottom: 0,
                background: 'rgba(255,255,255,0.02)'
              }}
            >
              <div>
                <div style={{ fontSize: '15px', fontWeight: '500', color: '#fff' }}>{vit.name}</div>
                <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  {vit.dose} • <strong style={{ color: 'var(--accent-amber)', fontWeight: '400' }}>{vit.timeOfDay}</strong>
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
