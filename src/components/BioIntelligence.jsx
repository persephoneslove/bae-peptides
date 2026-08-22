import React, { useState } from 'react';
import { sound } from '../utils/audio';

const PROTOCOL_PRESETS = [
  {
    id: 'klow_mitochondrial',
    title: 'The KLOW & SS-31 / MOTS-c Mitochondrial Supercharge Stack',
    tag: 'Mitochondria / ATP & Klotho',
    color: '#00f2fe',
    description: 'The pinnacle biohack combining cardiolipin repair (SS-31), cellular metabolic signaling (MOTS-c), and the systemic rejuvenation blend (KLOW).',
    compounds: [
      { name: 'KLOW Blend (Klotho/KPV/BPC/GHK)', dose: '500 mcg SubQ Daily AM', purpose: 'Systemic cellular rejuvenation, anti-fibrotic & gene expression' },
      { name: 'SS-31 (Elamipretide)', dose: '4.0 mg SubQ Daily AM', purpose: 'Selectively binds cardiolipin to restore electron transport chain ATP' },
      { name: 'MOTS-c', dose: '5.0 mg SubQ 3x/week fasted', purpose: 'Mitochondrial-derived peptide that activates AMPK and metabolic flexibility' },
      { name: 'Cold Plunge + 660nm Red Light', dose: '3.5 mins @ 44°F + 15m Red Light', purpose: 'Upregulates PGC-1alpha and Cytochrome C Oxidase' }
    ],
    dietNote: 'Take fasted prior to morning zone 2 cardio or phototherapy for maximum mitochondrial biogenesis.'
  },
  {
    id: 'wolverine',
    title: 'The "Wolverine" Rapid Tissue & Tendon Repair Stack',
    tag: 'Healing / Hyper-Recovery',
    color: '#ff2a6d',
    description: 'Gold standard synergistic peptide formulation paired with photobiomodulation for torn tendons, ligaments, and systemic inflammation.',
    compounds: [
      { name: 'BPC-157', dose: '250 mcg SubQ 2x/day', purpose: 'Upregulates Growth Hormone receptors, accelerates tendon-to-bone collagen synthesis' },
      { name: 'TB-500 (Thymosin Beta-4)', dose: '2.5 mg SubQ 2x/week', purpose: 'Promotes actin cell migration and rapid systemic angiogenesis' },
      { name: 'GHK-Cu (Copper Peptide)', dose: '2.0 mg SubQ 1x/day', purpose: 'Stimulates decorin and downregulates TGF-beta fibrotic scar tissue' },
      { name: 'Red Light (850nm NIR)', dose: '15 mins directly on injury', purpose: 'Elevates local ATP synthesis by stimulating cytochrome c oxidase' }
    ],
    dietNote: 'Consume 15g Hydrolyzed Collagen Peptides + 500mg Vitamin C 45 minutes prior to rehab training.'
  },
  {
    id: 'glp_metabolic',
    title: 'The Retatrutide / Tirzepatide & AOD-9604 Fat Oxidation Engine',
    tag: 'Metabolism / Triple Agonist',
    color: '#05ffa1',
    description: 'Next-generation metabolic acceleration utilizing GLP-1/GIP/Glucagon triple agonism paired with lipolytic GH fragment.',
    compounds: [
      { name: 'Retatrutide (or Tirzepatide)', dose: '2.0 mg SubQ once weekly', purpose: 'Triple G receptor agonism, increases basal metabolic rate and lipolysis' },
      { name: 'AOD-9604 (Lipolytic GH Frag)', dose: '300 mcg SubQ Daily Fasted', purpose: 'Stimulates lipolysis in stubborn visceral and subcutaneous fat' },
      { name: '5-Amino-1MQ', dose: '50 mg Oral AM', purpose: 'Blocks NNMT enzyme, boosting intracellular NAD+ and fat oxidation' },
      { name: 'Berberine Dihydroberberine', dose: '500 mg before meals', purpose: 'Potent AMPK activator and insulin sensitizer' }
    ],
    dietNote: 'Maintain high protein (1.0g per lb bodyweight) and resistance training to preserve lean mass during accelerated fat loss.'
  },
  {
    id: 'longevity_nad',
    title: 'The Sirtuin & Epithalon Telomeric Rejuvenation Protocol',
    tag: 'Longevity / Epigenetic Clock',
    color: '#9d4edd',
    description: 'Activates longevity genes (SIRT1-SIRT7), elongates telomeres via pineal peptide bioregulation, and cleanses senescent debris.',
    compounds: [
      { name: 'Epithalon', dose: '10 mg SubQ Daily (10-day pulse cycle)', purpose: 'Upregulates telomerase activity and restores pineal melatonin rhythm' },
      { name: 'NAD+ (SubQ)', dose: '50-100 mg 3x/week', purpose: 'Restores youth-level intracellular NAD+/NADH ratio' },
      { name: 'NMN + TMG', dose: '500 mg each daily AM', purpose: 'Direct metabolic precursors to preserve methylation and NAD+ pools' },
      { name: 'FoxO4-DRI (Optional Pulse)', dose: '3.0 mg 3x/week for 2 weeks', purpose: 'Selectively induces apoptosis in senescent zombie cells' }
    ],
    dietNote: 'Combine with 16:8 time-restricted feeding to maximize cellular autophagy (AMPK activation).'
  },
  {
    id: 'deep_sleep',
    title: 'The Deep-Wave Sleep Architecture Optimizer',
    tag: 'Sleep / GABA & GH',
    color: '#ffb703',
    description: 'Engineered to maximize Slow-Wave (Stage 3/4) deep physical recovery and REM memory consolidation without grogginess.',
    compounds: [
      { name: 'CJC-1295 / Ipamorelin Blend', dose: '300 mcg SubQ at bedtime', purpose: 'Pulses natural pituitary Growth Hormone release during deep sleep' },
      { name: 'Magnesium L-Threonate', dose: '1,500 mg 60m pre-bed', purpose: 'Crosses blood-brain barrier to density synaptic plasticity' },
      { name: 'Apigenin + L-Theanine', dose: '50mg / 200mg 30m pre-bed', purpose: 'GABAergic relaxation, eliminates bedtime ruminating thoughts' },
      { name: 'Red Light / Zero Blue Light', dose: 'Last 2 hours before bed', purpose: 'Unblocks endogenous pineal melatonin secretion' }
    ],
    dietNote: 'Avoid high-glycemic carbohydrates within 2 hours of sleep to prevent insulin blunting nocturnal GH pulses.'
  },
  {
    id: 'leydig_dopamine',
    title: 'Hormonal & Leydig Photobiomodulation Protocol',
    tag: 'Androgen & Dopamine',
    color: '#ff2a6d',
    description: 'Targeted gonadal/perineal red light combined with deliberate cold shock for enhanced Leydig cell bioenergetics and dopamine baseline elevation.',
    compounds: [
      { name: 'Perineal / "No-No Square" Red Light', dose: '8 mins daily (660nm pure red, 12 inches away)', purpose: 'Stimulates Leydig cell mitochondria & micro-vascular perfusion' },
      { name: 'Morning Cold Plunge (45°F)', dose: '3.5 mins fasted upon waking', purpose: 'Induces a sustained 250% dopamine spike lasting 3+ hours' },
      { name: 'Tongkat Ali (200:1) + Fadogia', dose: '400mg / 300mg AM', purpose: 'Increases free testosterone bio-availability by unbinding SHBG' },
      { name: 'Zinc Glycinate + Copper + K2', dose: '25mg / 1mg / 100mcg', purpose: 'Essential enzymatic co-factors for steroidogenesis' }
    ],
    dietNote: 'Ensure adequate dietary cholesterol (whole pasture-raised eggs) to supply the steroid hormone precursor pool.'
  }
];

export default function BioIntelligence() {
  const [selectedProtocol, setSelectedProtocol] = useState(PROTOCOL_PRESETS[0]);
  const [sleepHours, setSleepHours] = useState('7.8');
  const [soreness, setSoreness] = useState('2');
  const [stress, setStress] = useState('2');
  const [hrv, setHrv] = useState('78');

  const numSleep = parseFloat(sleepHours) || 0;
  const numSoreness = parseFloat(soreness) || 1;
  const numStress = parseFloat(stress) || 1;
  const numHrv = parseFloat(hrv) || 50;

  const sleepFactor = Math.min(100, (numSleep / 8) * 100);
  const sorenessFactor = Math.max(0, (5 - numSoreness) * 20);
  const stressFactor = Math.max(0, (5 - numStress) * 20);
  const hrvFactor = Math.min(100, (numHrv / 85) * 100);

  const readinessScore = Math.round((sleepFactor * 0.35) + (sorenessFactor * 0.25) + (stressFactor * 0.2) + (hrvFactor * 0.2));

  return (
    <div className="animate-fade-in">
      <div className="view-header">
        <div className="view-title-group">
          <h2>Bio-Intelligence & Protocol Architect</h2>
          <p>AI-driven stack recommendations, biological readiness metrics, and pre-engineered elite biohack templates.</p>
        </div>
      </div>

      {/* Dynamic Readiness Engine */}
      <div className="glass-panel" style={{ marginBottom: '28px', border: '1px solid rgba(0, 242, 254, 0.3)', background: 'linear-gradient(135deg, rgba(14, 24, 40, 0.9) 0%, rgba(8, 12, 20, 0.95) 100%)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <span className="tag-badge tag-cyan">🧠 Live Biometric Readiness Calculation</span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Updated real-time</span>
            </div>
            <h3 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '8px' }}>Daily Autonomic & CNS Readiness</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '18px' }}>
              Input your morning vitals to get customized adjustments for today's peptide dosage, cold exposure tolerance, and supplement timing.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px' }}>
              <div>
                <label className="bio-label">Sleep (Hours)</label>
                <input
                  type="text"
                  className="bio-input"
                  value={sleepHours}
                  placeholder="e.g. 7.5"
                  onChange={(e) => setSleepHours(e.target.value)}
                />
              </div>
              <div>
                <label className="bio-label">Soreness (1-5)</label>
                <input
                  type="text"
                  className="bio-input"
                  value={soreness}
                  placeholder="1-5"
                  onChange={(e) => setSoreness(e.target.value)}
                />
              </div>
              <div>
                <label className="bio-label">Stress (1-5)</label>
                <input
                  type="text"
                  className="bio-input"
                  value={stress}
                  placeholder="1-5"
                  onChange={(e) => setStress(e.target.value)}
                />
              </div>
              <div>
                <label className="bio-label">HRV (ms)</label>
                <input
                  type="text"
                  className="bio-input"
                  value={hrv}
                  placeholder="e.g. 75"
                  onChange={(e) => setHrv(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'center', background: 'rgba(0,0,0,0.4)', borderRadius: '16px', padding: '24px', border: '1px solid var(--border-glass)' }}>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>
              BIO-READINESS INDEX
            </div>
            <div
              style={{
                fontSize: '64px',
                fontWeight: '800',
                fontFamily: 'var(--font-mono)',
                color: readinessScore > 80 ? 'var(--neon-emerald)' : readinessScore > 60 ? 'var(--neon-cyan)' : 'var(--neon-amber)',
                textShadow: '0 0 25px rgba(0, 242, 254, 0.4)'
              }}
            >
              {readinessScore} <span style={{ fontSize: '20px', color: 'var(--text-muted)' }}>/ 100</span>
            </div>
            <div style={{ fontSize: '12px', fontWeight: '700', color: '#fff', marginTop: '4px' }}>
              {readinessScore > 80 ? '🔥 Optimal Anabolic State: Peak Performance Day' : readinessScore > 60 ? '⚡ Balanced: Standard Protocol' : '🛡️ High Fatigue: Prioritize Recovery Stacks & Red Light'}
            </div>
          </div>
        </div>
      </div>

      {/* Preset Stack Explorer */}
      <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ color: 'var(--neon-emerald)' }}>⚡</span> Elite Biohacking Stack Library
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '24px' }}>
        {/* Protocol Selector Tabs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {PROTOCOL_PRESETS.map((proto) => {
            const isSel = selectedProtocol.id === proto.id;
            return (
              <div
                key={proto.id}
                onClick={() => { sound.playClick(); setSelectedProtocol(proto); }}
                style={{
                  background: isSel ? 'rgba(0, 242, 254, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                  border: isSel ? `1px solid ${proto.color}` : '1px solid var(--border-glass)',
                  borderRadius: '12px',
                  padding: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <span className="tag-badge tag-cyan" style={{ fontSize: '9px', marginBottom: '6px' }}>{proto.tag}</span>
                <h4 style={{ fontSize: '14.5px', fontWeight: '700', color: isSel ? '#fff' : 'var(--text-main)' }}>{proto.title}</h4>
              </div>
            );
          })}
        </div>

        {/* Protocol Blueprint Display */}
        <div className="glass-panel" style={{ border: `1px solid ${selectedProtocol.color}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
            <div>
              <span className="tag-badge tag-emerald" style={{ marginBottom: '8px' }}>{selectedProtocol.tag}</span>
              <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#fff' }}>{selectedProtocol.title}</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>{selectedProtocol.description}</p>
            </div>
          </div>

          <div style={{ margin: '20px 0' }}>
            <h4 style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--neon-cyan)', marginBottom: '12px' }}>
              Stack Formulation & Timing
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {selectedProtocol.compounds.map((cmp, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-glass)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: '#fff' }}>{cmp.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{cmp.purpose}</div>
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: '700', color: 'var(--neon-emerald)' }}>
                    {cmp.dose}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: 'rgba(255, 183, 3, 0.08)', border: '1px solid rgba(255, 183, 3, 0.3)', padding: '14px', borderRadius: '10px', fontSize: '12px', color: 'var(--text-muted)' }}>
            <strong style={{ color: 'var(--neon-amber)' }}>🥗 Dietary Synergy Requirement:</strong> {selectedProtocol.dietNote}
          </div>
        </div>
      </div>
    </div>
  );
}
