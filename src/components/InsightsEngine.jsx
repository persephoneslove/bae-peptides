import React from 'react';
import {
  calculateAccumulatedEfficacy,
  analyzeAutonomicCorrelation,
  evaluateAdaptiveCycles,
  analyzeHormoneCorrelation
} from '../utils/decayEngine';

export default function InsightsEngine({
  injections,
  vitamins,
  dailyLogs,
  biometrics,
  subjectiveWellness,
  cycleData
}) {
  const efficacy = calculateAccumulatedEfficacy(dailyLogs);
  const autonomicCorrelation = analyzeAutonomicCorrelation(biometrics, subjectiveWellness);
  const cycleAlerts = evaluateAdaptiveCycles(injections);
  const hormoneInsights = analyzeHormoneCorrelation(subjectiveWellness, cycleData);

  return (
    <div style={{ animation: 'popIn 0.3s ease-out' }}>
      <div className="section-header" style={{ borderBottom: '1px solid rgba(255, 182, 193, 0.2)' }}>
        <div>
          <h2 style={{ color: 'var(--text-main)', fontSize: '24px', fontWeight: '500' }}>The Insights Engine</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '6px' }}>
            Plain-English summaries decoding your cellular biology, hormonal rhythms, and protocol efficacy.
          </p>
        </div>
      </div>

      {/* HORMONAL RHYTHM INSIGHT (NEW) */}
      <div className="card" style={{ padding: '24px', marginBottom: '24px', background: 'rgba(255, 182, 193, 0.03)', border: '1px solid rgba(255, 182, 193, 0.2)' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '400', color: '#fff', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>🌸</span> Hormonal Rhythm Analysis
        </h3>
        <p style={{ fontSize: '14px', color: 'var(--text-main)', lineHeight: '1.6' }}>
          {hormoneInsights.suggestion}
        </p>
      </div>

      {/* PLAIN ENGLISH AUTONOMIC INSIGHT */}
      <div className="card" style={{ padding: '24px', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '400', color: '#fff', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>🧠</span> Nervous System & Rest
        </h3>
        {autonomicCorrelation.alertTriggered ? (
           <p style={{ fontSize: '14px', color: 'var(--accent-pink)', lineHeight: '1.6' }}>
             Your body is currently under increased stress. We've noticed your resting heart rate variability (HRV) has dropped alongside your daily energy levels. This is a great time to listen to your body: we recommend a 48-hour pause from your more intense protocols, focusing instead on deep rest, magnesium, and gentle movement.
           </p>
        ) : (
          <p style={{ fontSize: '14px', color: 'var(--text-main)', lineHeight: '1.6' }}>
             Your nervous system is in a beautiful state of balance. Your wearable data (HRV) matches your subjective energy perfectly, indicating that your current protocol and lifestyle are supporting your cellular recovery optimally. Keep it up!
          </p>
        )}
      </div>

      {/* CYCLE SYNCING PROTOCOLS */}
      <div className="card" style={{ padding: '24px', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '400', color: '#fff', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>🔄</span> Adaptive Protocol Suggestions
        </h3>

        {cycleAlerts.length === 0 ? (
          <p style={{ fontSize: '14px', color: 'var(--text-main)', lineHeight: '1.6' }}>
             Your cell receptors are fully sensitized and responding well to your current stack. No adjustments or "cycle breaks" are needed at this time.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {cycleAlerts.map((alert, idx) => (
              <div key={idx} style={{ padding: '14px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                <strong style={{ color: '#fff', fontSize: '14px', display: 'block', marginBottom: '4px' }}>{alert.compound}</strong>
                <span style={{ fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                  {alert.recommendation.replace(/Initiate a 14-day washout cycle or switch to 5-days-on \/ 2-days-off to resensitize somatotroph receptors\./g, "It's time to give your body a gentle break. Taking a 14-day pause will allow your natural receptors to reset, ensuring you continue to get the maximum anti-aging benefits when you resume.")}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SIMPLIFIED BIOAVAILABILITY */}
      <div className="card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '400', color: '#fff' }}>
            Active Cellular Support
          </h3>
          <span style={{ fontSize: '24px', fontWeight: '300', color: 'var(--accent-cyan)' }}>
            {efficacy.totalEfficacyScore} <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>score</span>
          </span>
        </div>
        
        <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '16px' }}>
          This score represents the continuous biological support your body is receiving right now, calculating how your active compounds are working in the background.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
           {Object.entries(efficacy.compoundBreakdowns).map(([name, data]) => (
              <span key={name} className="badge" style={{ background: 'rgba(255,255,255,0.05)', color: '#fff', padding: '8px 12px' }}>
                {name} <span style={{ color: 'var(--accent-cyan)', marginLeft: '6px' }}>{data.currentActiveMcg.toFixed(0)}</span>
              </span>
           ))}
        </div>
      </div>
    </div>
  );
}
