import React from 'react';
import {
  calculateAccumulatedEfficacy,
  analyzeAutonomicCorrelation,
  evaluateAdaptiveCycles,
  analyzeHormoneCorrelation
} from '../utils/decayEngine';

export default function InsightsEngine({
  injections = [],
  vitamins = [],
  dailyLogs = [],
  biometrics = [],
  subjectiveWellness = [],
  cycleData = null,
  customPeptides = []
}) {
  const efficacy = calculateAccumulatedEfficacy(dailyLogs, Date.now(), customPeptides);
  const autonomicCorrelation = analyzeAutonomicCorrelation(biometrics, subjectiveWellness);
  const { cycleAlerts, cycleLifecycles } = evaluateAdaptiveCycles(injections);
  const hormoneInsights = analyzeHormoneCorrelation(subjectiveWellness, cycleData, injections);

  return (
    <div style={{ animation: 'popIn 0.3s ease-out' }}>
      <div className="section-header" style={{ borderBottom: '1px solid rgba(255, 182, 193, 0.2)' }}>
        <div>
          <h2 style={{ color: 'var(--text-main)', fontSize: '24px', fontWeight: '500' }}>The Insights Engine</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '6px' }}>
            Advanced analytical synthesis correlating cycle day, protocol lifecycle durations, skin telemetry, and sexual vitality.
          </p>
        </div>
      </div>

      {/* EXPANDED METRICS: SEXUAL VITALITY & LIBIDO DYNAMICS */}
      <div className="card" style={{ padding: '24px', marginBottom: '24px', background: 'linear-gradient(135deg, rgba(255, 182, 193, 0.08) 0%, rgba(157, 78, 221, 0.05) 100%)', border: '1px solid rgba(255, 182, 193, 0.3)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '14px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🔥</span> Sexual Vitality, Libido & Orgasm Intensity
          </h3>
          <span className="badge badge-pink" style={{ fontSize: '11px' }}>
            Cycle Day {cycleData?.currentDay || 14} Telemetry
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '16px' }}>
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Average Libido</div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--accent-purple)', marginTop: '4px' }}>
              {hormoneInsights.libidoTrend.avg} <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>/ 10</span>
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--text-main)', marginTop: '4px', fontWeight: '500' }}>
              {hormoneInsights.libidoTrend.status}
            </div>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Orgasm Strength & Response</div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--accent-pink)', marginTop: '4px' }}>
              {hormoneInsights.orgasmTrend.avg} <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>/ 10</span>
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--text-main)', marginTop: '4px', fontWeight: '500' }}>
              {hormoneInsights.orgasmTrend.status}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ fontSize: '13px', color: 'var(--text-main)', lineHeight: '1.5', background: 'rgba(255,255,255,0.02)', padding: '12px 14px', borderRadius: '8px' }}>
            <strong>Hormonal Phase Correlation:</strong> {hormoneInsights.libidoTrend.insight}
          </div>
          <div style={{ fontSize: '13px', color: 'var(--text-main)', lineHeight: '1.5', background: 'rgba(255,255,255,0.02)', padding: '12px 14px', borderRadius: '8px' }}>
            <strong>Protocol Neuro-Activation:</strong> {hormoneInsights.orgasmTrend.insight}
          </div>
        </div>
      </div>

      {/* SKIN SENSITIVITY & INJECTION SITE TELEMETRY */}
      {hormoneInsights.skinReactionAlert && (
        <div className="card" style={{ padding: '20px 24px', marginBottom: '24px', background: 'rgba(255, 183, 3, 0.06)', border: '1px solid rgba(255, 183, 3, 0.3)' }}>
          <h3 style={{ fontSize: '17px', fontWeight: '600', color: 'var(--accent-amber)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>💉</span> Skin Sensitivity & Injection Site Telemetry Alert
          </h3>
          <p style={{ fontSize: '13.5px', color: 'var(--text-main)', lineHeight: '1.6', margin: 0 }}>
            {hormoneInsights.skinReactionAlert.recommendation}
          </p>
        </div>
      )}

      {/* PROTOCOL CYCLE TRACKING & LIFECYCLE MANAGEMENT */}
      <div className="card" style={{ padding: '24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🔄</span> Protocol Cycle Lifecycle Tracking
            </h3>
            <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
              Active compound duration tracking, receptor sensitivity monitor, and planned cycle washouts.
            </p>
          </div>
          <span className="badge badge-cyan" style={{ fontSize: '11px' }}>
            {cycleLifecycles.length} Active Cycles Monitored
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px', marginBottom: '16px' }}>
          {cycleLifecycles.map((cycle) => (
            <div
              key={cycle.id}
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: `1px solid ${cycle.isNearCompletion ? 'var(--accent-amber)' : 'var(--border)'}`,
                padding: '16px',
                borderRadius: '10px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#fff', margin: 0 }}>{cycle.name}</h4>
                  <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                    Started: {cycle.startDate} • {cycle.cycleDaysOn}d ON / {cycle.cycleDaysOff}d OFF
                  </span>
                </div>
                <span className={`badge ${cycle.isNearCompletion ? 'badge-amber' : 'badge-green'}`} style={{ fontSize: '10.5px' }}>
                  {cycle.daysRemaining > 0 ? `${cycle.daysRemaining}d Left` : 'Cycle Complete'}
                </span>
              </div>

              {/* Progress Bar */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  <span>Progress ({cycle.daysElapsed} of {cycle.durationDays} days)</span>
                  <span style={{ fontWeight: '700', color: 'var(--accent-cyan)' }}>{cycle.progressPct}%</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${cycle.progressPct}%`,
                      height: '100%',
                      background: cycle.isNearCompletion ? 'var(--accent-amber)' : 'linear-gradient(90deg, var(--accent-cyan), var(--accent-green))',
                      borderRadius: '3px',
                      transition: 'width 0.3s ease'
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Adaptive Alerts */}
        {cycleAlerts.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '12px' }}>
            {cycleAlerts.map((alert, idx) => (
              <div key={idx} style={{ padding: '14px', background: 'rgba(255, 42, 109, 0.06)', borderRadius: '8px', borderLeft: '3px solid var(--accent-pink)' }}>
                <strong style={{ color: '#fff', fontSize: '14px', display: 'block', marginBottom: '2px' }}>{alert.compound} — {alert.type}</strong>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                  {alert.recommendation}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* HORMONAL RHYTHM INSIGHT */}
      <div className="card" style={{ padding: '24px', marginBottom: '24px', background: 'rgba(255, 182, 193, 0.03)', border: '1px solid rgba(255, 182, 193, 0.2)' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '400', color: '#fff', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>🌸</span> Hormonal Rhythm Analysis
        </h3>
        <p style={{ fontSize: '14px', color: 'var(--text-main)', lineHeight: '1.6', margin: 0 }}>
          {hormoneInsights.suggestion}
        </p>
      </div>

      {/* PLAIN ENGLISH AUTONOMIC INSIGHT */}
      <div className="card" style={{ padding: '24px', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '400', color: '#fff', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>🧠</span> Nervous System & Rest
        </h3>
        {autonomicCorrelation.alertTriggered ? (
           <p style={{ fontSize: '14px', color: 'var(--accent-pink)', lineHeight: '1.6', margin: 0 }}>
             Your body is currently under increased stress. We've noticed your resting heart rate variability (HRV) has dropped alongside your daily energy levels. This is a great time to listen to your body: we recommend a 48-hour pause from your more intense protocols, focusing instead on deep rest, magnesium, and gentle movement.
           </p>
        ) : (
          <p style={{ fontSize: '14px', color: 'var(--text-main)', lineHeight: '1.6', margin: 0 }}>
             Your nervous system is in a beautiful state of balance. Your wearable data (HRV) matches your subjective energy perfectly, indicating that your current protocol and lifestyle are supporting your cellular recovery optimally. Keep it up!
          </p>
        )}
      </div>

      {/* SIMPLIFIED BIOAVAILABILITY & PHARMACOKINETICS */}
      <div className="card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '400', color: '#fff', margin: 0 }}>
            Active Cellular Support & Pharmacokinetic Bioavailability
          </h3>
          <span style={{ fontSize: '24px', fontWeight: '300', color: 'var(--accent-cyan)' }}>
            {efficacy.totalEfficacyScore} <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>score</span>
          </span>
        </div>
        
        <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '16px' }}>
          This score represents the continuous biological support your body is receiving right now, calculating how your active compounds are working in the background according to pharmacokinetic decay integrals \(E(t)\).
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
           {Object.entries(efficacy.compoundBreakdowns).map(([name, data]) => (
              <span key={name} className="badge" style={{ background: 'rgba(255,255,255,0.05)', color: '#fff', padding: '8px 12px' }}>
                {name} <span style={{ color: 'var(--accent-cyan)', marginLeft: '6px' }}>{data.currentActiveMcg.toFixed(0)} μg active</span>
              </span>
           ))}
        </div>
      </div>
    </div>
  );
}
