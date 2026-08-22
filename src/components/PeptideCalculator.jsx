import React, { useState } from 'react';
import { sound } from '../utils/audio';

export default function PeptideCalculator() {
  const [vialMg, setVialMg] = useState('5'); // string to allow clean backspace/deletion
  const [bacWaterMl, setBacWaterMl] = useState('2.0');
  const [targetDose, setTargetDose] = useState('250');
  const [doseUnit, setDoseUnit] = useState('mcg'); // 'mcg' or 'mg'
  const [syringeType, setSyringeType] = useState('100u'); // '100u' (1ml), '50u' (0.5ml), '30u' (0.3ml)
  const [vialCost, setVialCost] = useState('45');

  // Safe parsed numbers for calculations
  const numVialMg = parseFloat(vialMg) || 0;
  const numBacWaterMl = parseFloat(bacWaterMl) || 0;
  const numTargetDose = parseFloat(targetDose) || 0;
  const numVialCost = parseFloat(vialCost) || 0;

  // Calculations
  const totalVialMcg = numVialMg * 1000;
  const concentrationMcgPerMl = numBacWaterMl > 0 ? totalVialMcg / numBacWaterMl : 0;
  const targetMcg = doseUnit === 'mg' ? numTargetDose * 1000 : numTargetDose;
  const volumeNeededMl = concentrationMcgPerMl > 0 ? targetMcg / concentrationMcgPerMl : 0;
  const syringeUnits = volumeNeededMl * 100;
  const totalDosesInVial = targetMcg > 0 ? Math.floor(totalVialMcg / targetMcg) : 0;
  const costPerDose = totalDosesInVial > 0 ? (numVialCost / totalDosesInVial).toFixed(2) : '0.00';

  const maxUnits = syringeType === '100u' ? 100 : syringeType === '50u' ? 50 : 30;
  const syringeFillPercentage = Math.min(100, (syringeUnits / maxUnits) * 100);

  const handleQuickPreset = (preset) => {
    sound.playClick();
    setVialMg(preset.vialMg.toString());
    setBacWaterMl(preset.bacWaterMl.toString());
    setTargetDose(preset.targetDose.toString());
    setDoseUnit(preset.doseUnit);
    setVialCost((preset.cost || 45).toString());
  };

  const CALC_PRESETS = [
    { name: 'KLOW Blend (10mg / 2ml / 500mcg)', vialMg: 10, bacWaterMl: 2.0, targetDose: 500, doseUnit: 'mcg', cost: 85 },
    { name: 'SS-31 Cardiolipin (50mg / 5ml / 4mg)', vialMg: 50, bacWaterMl: 5.0, targetDose: 4.0, doseUnit: 'mg', cost: 120 },
    { name: 'MOTS-c Mitochondrial (10mg / 2ml / 5mg)', vialMg: 10, bacWaterMl: 2.0, targetDose: 5.0, doseUnit: 'mg', cost: 65 },
    { name: 'BPC-157 (5mg / 2ml / 250mcg)', vialMg: 5, bacWaterMl: 2.0, targetDose: 250, doseUnit: 'mcg', cost: 45 },
    { name: 'TB-500 (10mg / 2ml / 2.5mg)', vialMg: 10, bacWaterMl: 2.0, targetDose: 2.5, doseUnit: 'mg', cost: 65 },
    { name: 'Retatrutide (10mg / 2ml / 2mg)', vialMg: 10, bacWaterMl: 2.0, targetDose: 2.0, doseUnit: 'mg', cost: 95 },
    { name: 'Tirzepatide (10mg / 2ml / 2.5mg)', vialMg: 10, bacWaterMl: 2.0, targetDose: 2.5, doseUnit: 'mg', cost: 85 },
    { name: 'Epithalon (50mg / 5ml / 10mg)', vialMg: 50, bacWaterMl: 5.0, targetDose: 10, doseUnit: 'mg', cost: 75 },
    { name: 'CJC/Ipamorelin (5mg / 2.5ml / 300mcg)', vialMg: 5, bacWaterMl: 2.5, targetDose: 300, doseUnit: 'mcg', cost: 55 },
    { name: 'GHK-Cu (50mg / 5ml / 2mg)', vialMg: 50, bacWaterMl: 5.0, targetDose: 2.0, doseUnit: 'mg', cost: 40 },
    { name: 'NAD+ (500mg / 5ml / 50mg)', vialMg: 500, bacWaterMl: 5.0, targetDose: 50, doseUnit: 'mg', cost: 90 },
    { name: 'PT-141 (10mg / 2ml / 1.5mg)', vialMg: 10, bacWaterMl: 2.0, targetDose: 1.5, doseUnit: 'mg', cost: 45 }
  ];

  return (
    <div className="animate-fade-in">
      <div className="view-header">
        <div className="view-title-group">
          <h2>Peptide & Reconstitution Engine</h2>
          <p>Precision calculation for vial dilution, syringe tick marks, and cost-per-dose metrics.</p>
        </div>
      </div>

      {/* Quick Presets */}
      <div style={{ marginBottom: '24px' }}>
        <div className="bio-label" style={{ marginBottom: '10px' }}>⚡ Instant Protocol Reconstitution Presets</div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {CALC_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              className="btn-secondary"
              style={{ fontSize: '11.5px', padding: '8px 12px' }}
              onClick={() => handleQuickPreset(preset)}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
        {/* Input Parameters Panel */}
        <div className="glass-panel">
          <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: 'var(--neon-cyan)' }}>◈</span> Reconstitution Parameters
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '18px' }}>
            <div>
              <label className="bio-label">Vial Quantity (mg)</label>
              <input
                type="text"
                className="bio-input"
                value={vialMg}
                placeholder="e.g. 5 or 10"
                onChange={(e) => setVialMg(e.target.value)}
              />
              <span style={{ fontSize: '11px', color: 'var(--text-dark)', marginTop: '4px', display: 'block' }}>
                Total: {(numVialMg * 1000).toLocaleString()} mcg
              </span>
            </div>

            <div>
              <label className="bio-label">Bacteriostatic Water Added (mL)</label>
              <input
                type="text"
                className="bio-input"
                value={bacWaterMl}
                placeholder="e.g. 2.0"
                onChange={(e) => setBacWaterMl(e.target.value)}
              />
              <span style={{ fontSize: '11px', color: 'var(--text-dark)', marginTop: '4px', display: 'block' }}>
                Standard: 1.0ml to 5.0ml
              </span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '16px', marginBottom: '18px' }}>
            <div>
              <label className="bio-label">Target Desired Dose</label>
              <input
                type="text"
                className="bio-input"
                value={targetDose}
                placeholder="e.g. 250 or 2.5"
                onChange={(e) => setTargetDose(e.target.value)}
              />
            </div>

            <div>
              <label className="bio-label">Dose Unit</label>
              <select
                className="bio-select"
                value={doseUnit}
                onChange={(e) => setDoseUnit(e.target.value)}
              >
                <option value="mcg">Micrograms (mcg)</option>
                <option value="mg">Milligrams (mg)</option>
              </select>
            </div>

            <div>
              <label className="bio-label">Syringe Size</label>
              <select
                className="bio-select"
                value={syringeType}
                onChange={(e) => setSyringeType(e.target.value)}
              >
                <option value="100u">1.0 mL (100 Units)</option>
                <option value="50u">0.5 mL (50 Units)</option>
                <option value="30u">0.3 mL (30 Units)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="bio-label">Vial Cost ($ USD) - Optional</label>
            <input
              type="text"
              className="bio-input"
              value={vialCost}
              placeholder="e.g. 45"
              onChange={(e) => setVialCost(e.target.value)}
            />
          </div>
        </div>

        {/* Live Graphic Syringe & Dosage readout */}
        <div className="glass-panel" style={{ border: '1px solid rgba(0, 242, 254, 0.3)', background: 'linear-gradient(180deg, rgba(14, 22, 36, 0.9) 0%, rgba(8, 12, 20, 0.95) 100%)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span className="tag-badge tag-cyan">🎯 Exact Syringe Pull</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--neon-cyan)' }}>
              {concentrationMcgPerMl.toFixed(0)} mcg/mL
            </span>
          </div>

          <div style={{ textAlign: 'center', padding: '16px 0 24px 0' }}>
            <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>
              Draw Exactly To:
            </div>
            <div style={{ fontSize: '54px', fontWeight: '800', color: 'var(--neon-cyan)', fontFamily: 'var(--font-mono)', textShadow: '0 0 25px rgba(0, 242, 254, 0.5)' }}>
              {syringeUnits.toFixed(1)} <span style={{ fontSize: '20px', color: 'var(--text-main)' }}>IU / Units</span>
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Volume: <strong style={{ color: '#fff' }}>{volumeNeededMl.toFixed(3)} mL</strong> | Target: <strong style={{ color: 'var(--neon-emerald)' }}>{numTargetDose} {doseUnit}</strong>
            </div>
          </div>

          {/* Interactive Syringe Meter Visualizer */}
          <div style={{ padding: '12px 18px', background: 'rgba(0,0,0,0.4)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-dark)', fontFamily: 'var(--font-mono)', marginBottom: '6px' }}>
              <span>0u (Plunger)</span>
              <span>{(maxUnits / 2).toFixed(0)}u</span>
              <span>{maxUnits}u (Full)</span>
            </div>

            <div style={{ height: '24px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', position: 'relative', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div
                style={{
                  height: '100%',
                  width: `${syringeFillPercentage}%`,
                  background: 'linear-gradient(90deg, #00f2fe 0%, #ff2a6d 100%)',
                  boxShadow: '0 0 15px rgba(0, 242, 254, 0.7)',
                  transition: 'width 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  left: `${syringeFillPercentage}%`,
                  width: '3px',
                  background: '#ffffff',
                  boxShadow: '0 0 8px #ffffff'
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '10px', color: 'var(--text-dark)' }}>
              <span>SubQ Needle 31G 5/16"</span>
              <span>Fill Level: {syringeFillPercentage.toFixed(0)}%</span>
            </div>
          </div>

          {/* Yield & Cost Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-glass)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>TOTAL DOSES IN VIAL</div>
              <div style={{ fontSize: '20px', fontWeight: '800', color: '#fff', marginTop: '4px' }}>
                {totalDosesInVial} <span style={{ fontSize: '12px', color: 'var(--text-dark)' }}>Doses</span>
              </div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-glass)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>COST PER INJECTION</div>
              <div style={{ fontSize: '20px', fontWeight: '800', color: 'var(--neon-emerald)', marginTop: '4px' }}>
                ${costPerDose} <span style={{ fontSize: '12px', color: 'var(--text-dark)' }}>USD</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
