import React, { useState } from 'react';
import { GOAL_OPTIONS, ACTIVITY_LEVELS } from '../utils/userProfile';
import { evaluateProtocol } from '../utils/protocolEvaluator';
import { sound } from '../utils/audio';

export default function ProfileAndRatingView({
  userProfile,
  onUpdateProfile,
  injections,
  vitamins,
  wellnessLogs,
  onAddSuggestedVitamin
}) {
  const [profile, setProfile] = useState(userProfile);
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  const evaluation = evaluateProtocol(injections, vitamins, wellnessLogs, profile);

  const handleProfileChange = (key, value) => {
    const updated = { ...profile, [key]: value };
    setProfile(updated);
    onUpdateProfile(updated);
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 2000);
  };

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
          <h2>Biometrics, Goals & Scientific Rating</h2>
          <p>Configure your age, weight, and health objectives to personalize your scientific stack audit.</p>
        </div>
        {isSavedNotice && (
          <span className="badge badge-green" style={{ fontSize: '12px', padding: '6px 12px' }}>
            ✓ Profile Auto-Saved
          </span>
        )}
      </div>

      {/* BIOMETRIC & GOALS INPUT CARD */}
      <div className="card" style={{ marginBottom: '24px', padding: '24px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>👤</span> Your Biometrics & Lifestyle Baseline
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '14px', marginBottom: '16px' }}>
          <div>
            <label className="input-label">Age</label>
            <input
              type="text"
              className="input-field"
              value={profile.age}
              onChange={(e) => handleProfileChange('age', e.target.value)}
              placeholder="e.g. 32"
            />
          </div>

          <div>
            <label className="input-label">Gender</label>
            <select
              className="select-field"
              value={profile.gender}
              onChange={(e) => handleProfileChange('gender', e.target.value)}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div>
            <label className="input-label">Weight (lbs)</label>
            <input
              type="text"
              className="input-field"
              value={profile.weightLbs}
              onChange={(e) => handleProfileChange('weightLbs', e.target.value)}
              placeholder="e.g. 185"
            />
          </div>

          <div>
            <label className="input-label">Height (Feet / Inches)</label>
            <div style={{ display: 'flex', gap: '6px' }}>
              <input
                type="text"
                className="input-field"
                value={profile.heightFeet}
                onChange={(e) => handleProfileChange('heightFeet', e.target.value)}
                placeholder="5"
              />
              <input
                type="text"
                className="input-field"
                value={profile.heightInches}
                onChange={(e) => handleProfileChange('heightInches', e.target.value)}
                placeholder="10"
              />
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '14px' }}>
          <div>
            <label className="input-label">Primary Health & Biohack Goal</label>
            <select
              className="select-field"
              value={profile.primaryGoal}
              onChange={(e) => handleProfileChange('primaryGoal', e.target.value)}
            >
              {GOAL_OPTIONS.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="input-label">Activity Level</label>
            <select
              className="select-field"
              value={profile.activityLevel}
              onChange={(e) => handleProfileChange('activityLevel', e.target.value)}
            >
              {ACTIVITY_LEVELS.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Calculated Daily Targets */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginTop: '18px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>DAILY PROTEIN TARGET</div>
            <div style={{ fontSize: '18px', fontWeight: '800', color: 'var(--accent-cyan)' }}>
              {evaluation.dailyProteinGrams} g <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>/ day</span>
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>ESTIMATED WATER</div>
            <div style={{ fontSize: '18px', fontWeight: '800', color: 'var(--accent-green)' }}>
              {evaluation.dailyWaterOz} oz <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>/ day</span>
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>BASAL METABOLIC RATE</div>
            <div style={{ fontSize: '18px', fontWeight: '800', color: 'var(--accent-amber)' }}>
              {evaluation.estimatedBMR} kcal
            </div>
          </div>
        </div>
      </div>

      {/* SCIENTIFIC STACK SCORECARD */}
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
              <span className="badge badge-cyan">🧪 Personalized Stack Evaluation</span>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Targeting: {profile.primaryGoal}</span>
            </div>
            <h3 style={{ fontSize: '24px', fontWeight: '800', color: '#fff', marginBottom: '8px' }}>
              Scientific Protocol Grade: <span style={{ color: getScoreColor(evaluation.score) }}>{evaluation.grade}</span>
            </h3>
            <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
              Verdict: <strong style={{ color: '#fff' }}>{evaluation.gradeVerdict}</strong>. Evaluates receptor alignment with your personal biometrics (Age {profile.age}, {profile.weightLbs} lbs) and {profile.primaryGoal}.
            </p>
          </div>

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
              Based on your active compounds & lifestyle baseline
            </div>
          </div>
        </div>
      </div>

      {/* POSITIVE SYNERGIES */}
      {evaluation.positiveSynergies.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#fff', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>✅</span> Active Synergies in Your Stack ({evaluation.positiveSynergies.length})
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

      {/* WARNINGS */}
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

      {/* RECOMMENDATIONS */}
      {evaluation.suggestions.length > 0 && (
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#fff', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>💡</span> Scientifically Recommended for Your Profile ({evaluation.suggestions.length})
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
                    <span className="badge badge-amber">+ Personalized Suggestion</span>
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
                      name: sug.title.replace('Add ', '').replace('Consider ', '').split(' for ')[0],
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
