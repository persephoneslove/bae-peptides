import React from 'react';
import {
  calculateAccumulatedEfficacy,
  analyzeAutonomicCorrelation,
  evaluateAdaptiveCycles,
  MASTER_PHARMACOKINETICS
} from '../utils/decayEngine';

export default function AIAnalyticsMatrix({
  injections,
  vitamins,
  dailyLogs,
  biometrics,
  assessments
}) {
  // 1. Calculate Pharmacokinetic Decay Integral E(t)
  const efficacy = calculateAccumulatedEfficacy(dailyLogs);

  // 2. Correlate Rolling 3-Day HRV with Subjective Energy
  const autonomicCorrelation = analyzeAutonomicCorrelation(biometrics, assessments);

  // 3. Evaluate Adaptive Cycle Recommendations & Diminishing Returns
  const cycleAlerts = evaluateAdaptiveCycles(injections);

  return (
    <div style={{ animation: 'popIn 0.2s ease' }}>
      <div className="section-header">
        <div>
          <h2>AI Insights & Analytics Matrix</h2>
          <p>Pharmacokinetic half-life decay modeling, autonomic strain correlation, and adaptive cycle logic.</p>
        </div>
      </div>

      {/* AUTONOMIC NERVOUS SYSTEM OVERDRIVE ALERT (CRITICAL SPEC REQUIREMENT) */}
      {autonomicCorrelation.alertTriggered ? (
        <div
          className="card"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 42, 109, 0.15) 0%, rgba(20, 10, 15, 0.95) 100%)',
            borderColor: 'var(--accent-pink)',
            padding: '24px',
            marginBottom: '24px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span className="badge badge-pink" style={{ fontSize: '13px', padding: '6px 12px' }}>
              🚨 CRITICAL OVER-ACTIVATION TRIGGERED
            </span>
            <span style={{ fontSize: '12px', color: 'var(--accent-pink)', fontWeight: '700' }}>
              3-Day Rolling Average Drop Detected
            </span>
          </div>

          <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#fff', marginBottom: '8px' }}>
            Sympathetic Nervous System Over-Activation Alert
          </h3>

          <p style={{ fontSize: '13.5px', color: 'var(--text-main)', lineHeight: '1.5', marginBottom: '14px' }}>
            Telemetry correlates a <strong style={{ color: 'var(--accent-pink)' }}>{autonomicCorrelation.hrvDeltaPct}% drop in HRV</strong> with a concurrent <strong style={{ color: 'var(--accent-pink)' }}>{autonomicCorrelation.energyDelta} point drop</strong> in subjective daytime energy across the last 3 consecutive days.
          </p>

          <div style={{ background: 'rgba(0,0,0,0.4)', padding: '14px 18px', borderRadius: '10px', border: '1px solid var(--accent-pink)', fontSize: '13px' }}>
            <strong style={{ color: 'var(--accent-pink)' }}>Expert Longevity Recommendation:</strong> Initiate an immediate <strong style={{ color: '#fff' }}>48-Hour Protocol Pause</strong>. Suspend all stimulatory secretagogues, administer restorative Magnesium L-Threonate, and prioritize 15 minutes of 660/850nm red light photobiomodulation to restore parasympathetic tone.
          </div>
        </div>
      ) : (
        <div className="card" style={{ padding: '18px 24px', marginBottom: '24px', borderLeft: '4px solid var(--accent-green)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="badge badge-green">✓ Autonomic Correlation Optimal</span>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Rolling 3-Day Telemetry In Sync</span>
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                HRV Baseline: <strong style={{ color: '#fff' }}>{autonomicCorrelation.avgRecentHrv} ms</strong> ({autonomicCorrelation.hrvDeltaPct}%) | Energy Index: <strong style={{ color: '#fff' }}>{autonomicCorrelation.avgRecentEnergy}/10</strong> ({autonomicCorrelation.energyDelta})
              </div>
            </div>
            <span style={{ fontSize: '24px' }}>⚡</span>
          </div>
        </div>
      )}

      {/* PHARMACOKINETIC COMPOUND DECAY INTEGRAL E(t) SECTION */}
      <div className="card" style={{ padding: '24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
          <div>
            <span className="badge badge-cyan" style={{ marginBottom: '6px' }}>Mathematical Decay Model</span>
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#fff' }}>
              Compound Biological Decay & Accumulated Protocol Efficacy E(t)
            </h3>
            <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
              Evaluates continuous systemic bioavailability based on exact compound elimination rate constants: λ = ln(2) / t_half.
            </p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '32px', fontWeight: '800', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
              {efficacy.totalEfficacyScore} <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>μg·eq</span>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Active Cumulative Bioavailability</div>
          </div>
        </div>

        {/* Compound Breakdown Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px', marginTop: '16px' }}>
          {Object.keys(efficacy.compoundBreakdowns).length === 0 ? (
            <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', padding: '12px' }}>
              No recent administrations logged. Log doses in the Input Engine to render live pharmacokinetic decay curves.
            </div>
          ) : (
            Object.entries(efficacy.compoundBreakdowns).map(([name, data]) => (
              <div
                key={name}
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  border: '1px solid var(--border)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: '700', fontSize: '14px', color: '#fff' }}>{name}</span>
                  <span className="badge badge-cyan">{data.category}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '12px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Active Circulating:</span>
                  <strong style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
                    {data.currentActiveMcg.toFixed(1)} μg
                  </strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', fontSize: '11px', color: 'var(--text-dim)' }}>
                  <span>Biological Half-Life (t½):</span>
                  <span>{data.halfLifeHours} hrs</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ADAPTIVE CYCLE RECOMMENDATIONS & DIMINISHING RETURNS */}
      <div className="card" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#fff', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>🔄</span> Adaptive Cycle Suggestions & Receptor Resensitization
        </h3>

        {cycleAlerts.length === 0 ? (
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '14px 18px', borderRadius: '10px', border: '1px solid var(--border)', fontSize: '13px', color: 'var(--text-muted)' }}>
            <strong style={{ color: 'var(--accent-green)' }}>● Receptors Fully Sensitized:</strong> Active compounds are operating within clinical therapeutic windows. No tachyphylaxis or desensitization detected.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {cycleAlerts.map((alert, idx) => (
              <div
                key={idx}
                style={{
                  background: 'rgba(255, 183, 3, 0.05)',
                  border: '1px solid rgba(255, 183, 3, 0.3)',
                  padding: '14px 18px',
                  borderRadius: '10px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span className="badge badge-amber">{alert.type}</span>
                  <strong style={{ color: '#fff', fontSize: '14px' }}>{alert.compound}</strong>
                </div>
                <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                  {alert.recommendation}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
