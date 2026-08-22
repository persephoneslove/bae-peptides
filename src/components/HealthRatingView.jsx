import React from 'react';
import { evaluateProtocol } from '../utils/protocolEvaluator';
import { sound } from '../utils/audio';

export default function HealthRatingView({
  injections,
  vitamins,
  wellnessLogs,
  onAddSuggestedPeptide,
  onAddSuggestedVitamin
}) {
  const evaluation = evaluateProtocol(injections, vitamins, wellnessLogs);

  const getScoreColor = (score) => {
    if (score >= 90) return 'var(--accent-green)';
    if (score >= 75) return 'var(--accent-cyan)';
    if (score >= 60) return 'var(--accent-amber)';
    return 'var(--accent-pink)';
  };

  return (
    <div style={{ animation: 'popIn 0.2s ease' }}>
      <div className="section-header">
        <div>
          <h2>Scientific Protocol Rating & AI Stack Doctor</h2>
          <p>Real-time clinical analysis of your active compounds, biochemical synergies, and protocol gaps.</p>
        </div>
      </div>

      {/* Main Scientific Rating Scorecard */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, rgba(14, 24, 40, 0.95) 0%, rgba(8, 12, 20, 0.98) 100%)',
          borderColor: 'rgba(0, 242, 254, 0.3)',
          padding: '28px',
          marginBottom: '24px'
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span className="badge badge-cyan">🧪 Clinical Synergy Analysis</span>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Synchronized with your active stack</span>
            </div>
            <h3 style={{ fontSize: '24px', fontWeight: '800', color: '#fff', marginBottom: '8px' }}>
              Overall Health Protocol Grade: <span style={{ color: getScoreColor(evaluation.score) }}>{evaluation.grade}</span>
            </h3>
            <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
              Verdict: <strong style={{ color: '#fff' }}>{evaluation.gradeVerdict}</strong>. Evaluates receptor balance, cofactor availability, mitochondrial biogenesis, and recovery pathways.
            </p>
          </div>

          {/* Big Score Gauge */}
          <div style={{ textAlign: 'center', background: 'rgba(0,0,0,0.4)', borderRadius: '16px', padding: '20px', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>
              SCIENTIFIC OPTIMIZATION SCORE
            </div>
            <div
              style={{
                fontSize: '64px',
                fontWeight: '800',
                fontFamily: 'var(--font-mono)',
                color: getScoreColor(evaluation.score),
                textShadow: '0 0 24px rgba(0, 242, 254, 0.3)'
              }}
            >
              {evaluation.score} <span style={{ fontSize: '22px', color: 'var(--text-muted)' }}>/ 100</span>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Based on {injections.length} peptides + {vitamins.length} supplements + {wellnessLogs.length} recovery sessions
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 1: POSITIVE CLINICAL SYNERGIES */}
      {evaluation.positiveSynergies.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#fff', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>✅</span> Active Biochemical Synergies ({evaluation.positiveSynergies.length})
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {evaluation.positiveSynergies.map((syn, idx) => (
              <div
                key={idx}
                className="card"
                style={{
                  padding: '16px 20px',
                  marginBottom: 0,
                  borderLeft: '4px solid var(--accent-green)',
                  background: 'rgba(5, 255, 161, 0.03)'
                }}
              >
                <div style={{ fontSize: '15px', fontWeight: '700', color: '#fff' }}>{syn.title}</div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px', lineHeight: '1.4' }}>
                  {syn.detail}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 2: WARNINGS / BIOLOGICAL FLAGS */}
      {evaluation.warnings.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#fff', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>⚠️</span> Biological Cautions / Imbalances ({evaluation.warnings.length})
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {evaluation.warnings.map((warn, idx) => (
              <div
                key={idx}
                className="card"
                style={{
                  padding: '16px 20px',
                  marginBottom: 0,
                  borderLeft: '4px solid var(--accent-pink)',
                  background: 'rgba(255, 42, 109, 0.04)'
                }}
              >
                <div style={{ fontSize: '15px', fontWeight: '700', color: 'var(--accent-pink)' }}>{warn.title}</div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  {warn.detail}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 3: RECOMMENDATIONS / WHAT TO ADD */}
      {evaluation.suggestions.length > 0 && (
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#fff', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>💡</span> Scientifically Recommended Additions ({evaluation.suggestions.length})
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {evaluation.suggestions.map((sug, idx) => (
              <div
                key={idx}
                className="card"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '18px 20px',
                  marginBottom: 0
                }}
              >
                <div style={{ flex: 1, paddingRight: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="badge badge-amber">+ Recommended Addition</span>
                    <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#fff' }}>{sug.title}</h4>
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px', lineHeight: '1.4' }}>
                    {sug.reason}
                  </div>
                </div>

                <button
                  className="btn btn-secondary"
                  style={{ whiteSpace: 'nowrap', fontSize: '12.5px', padding: '8px 14px', borderColor: 'var(--accent-cyan)', color: 'var(--accent-cyan)' }}
                  onClick={() => {
                    sound.playSuccess();
                    onAddSuggestedVitamin({
                      id: 'vit-' + Date.now(),
                      name: sug.title.replace('Add ', '').replace('Consider ', ''),
                      dose: 'Standard Clinical Dose',
                      timeOfDay: 'Morning',
                      takenToday: false,
                      streak: 0
                    });
                  }}
                >
                  + Add to Stack
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
