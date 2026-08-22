import React, { useState } from 'react';
import { sound } from '../utils/audio';

const PRESETS = [
  { name: 'KLOW Blend', vialMg: 10, bacWaterMl: 2.0, targetDose: 500, doseUnit: 'mcg' },
  { name: 'SS-31', vialMg: 50, bacWaterMl: 5.0, targetDose: 4.0, doseUnit: 'mg' },
  { name: 'MOTS-c', vialMg: 10, bacWaterMl: 2.0, targetDose: 5.0, doseUnit: 'mg' },
  { name: 'BPC-157', vialMg: 5, bacWaterMl: 2.0, targetDose: 250, doseUnit: 'mcg' },
  { name: 'TB-500', vialMg: 10, bacWaterMl: 2.0, targetDose: 2.5, doseUnit: 'mg' },
  { name: 'Retatrutide', vialMg: 10, bacWaterMl: 2.0, targetDose: 2.0, doseUnit: 'mg' },
  { name: 'Tirzepatide', vialMg: 10, bacWaterMl: 2.0, targetDose: 2.5, doseUnit: 'mg' },
  { name: 'Semaglutide', vialMg: 5, bacWaterMl: 2.0, targetDose: 0.25, doseUnit: 'mg' },
  { name: 'CJC / Ipamorelin', vialMg: 5, bacWaterMl: 2.5, targetDose: 300, doseUnit: 'mcg' },
  { name: 'GHK-Cu', vialMg: 50, bacWaterMl: 5.0, targetDose: 2.0, doseUnit: 'mg' },
  { name: 'Epithalon', vialMg: 50, bacWaterMl: 5.0, targetDose: 10, doseUnit: 'mg' }
];

export default function CalculatorView() {
  const [vialMg, setVialMg] = useState('5');
  const [bacWaterMl, setBacWaterMl] = useState('2.0');
  const [targetDose, setTargetDose] = useState('250');
  const [doseUnit, setDoseUnit] = useState('mcg'); // 'mcg' or 'mg'

  const numVialMg = parseFloat(vialMg) || 0;
  const numBacWaterMl = parseFloat(bacWaterMl) || 0;
  const numTargetDose = parseFloat(targetDose) || 0;

  const totalVialMcg = numVialMg * 1000;
  const concentration = numBacWaterMl > 0 ? totalVialMcg / numBacWaterMl : 0;
  const targetMcg = doseUnit === 'mg' ? numTargetDose * 1000 : numTargetDose;
  const volumeMl = concentration > 0 ? targetMcg / concentration : 0;
  const syringeUnits = volumeMl * 100;
  const totalDoses = targetMcg > 0 ? Math.floor(totalVialMcg / targetMcg) : 0;

  const fillPct = Math.min(100, Math.max(0, syringeUnits));

  const handleSelectPreset = (p) => {
    sound.playClick();
    setVialMg(p.vialMg.toString());
    setBacWaterMl(p.bacWaterMl.toString());
    setTargetDose(p.targetDose.toString());
    setDoseUnit(p.doseUnit);
  };

  return (
    <div style={{ animation: 'popIn 0.2s ease' }}>
      <div className="section-header">
        <div>
          <h2>Quick Syringe & Dose Calculator</h2>
          <p>Instantly calculate exactly where to draw the syringe plunger.</p>
        </div>
      </div>

      {/* 1-Click Popular Presets */}
      <div className="card" style={{ padding: '16px', marginBottom: '20px' }}>
        <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '10px', textTransform: 'uppercase' }}>
          ⚡ 1-Click Quick Calculations:
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {PRESETS.map((p, idx) => (
            <button
              key={idx}
              className="btn btn-secondary"
              style={{ fontSize: '11.5px', padding: '6px 12px' }}
              onClick={() => handleSelectPreset(p)}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>
        {/* Left Inputs */}
        <div className="card">
          <h3 style={{ fontSize: '17px', fontWeight: '800', marginBottom: '18px', color: '#fff' }}>
            1. Enter Your Vial & Water
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
            <div>
              <label className="input-label">Vial Powder (mg)</label>
              <input
                type="text"
                className="input-field"
                placeholder="5"
                value={vialMg}
                onChange={(e) => setVialMg(e.target.value)}
              />
            </div>

            <div>
              <label className="input-label">Water Added (mL)</label>
              <input
                type="text"
                className="input-field"
                placeholder="2.0"
                value={bacWaterMl}
                onChange={(e) => setBacWaterMl(e.target.value)}
              />
            </div>
          </div>

          <h3 style={{ fontSize: '17px', fontWeight: '800', margin: '20px 0 14px 0', color: '#fff' }}>
            2. Enter Desired Dose
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '14px' }}>
            <div>
              <label className="input-label">Desired Amount</label>
              <input
                type="text"
                className="input-field"
                placeholder="250"
                value={targetDose}
                onChange={(e) => setTargetDose(e.target.value)}
              />
            </div>

            <div>
              <label className="input-label">Unit</label>
              <select className="select-field" value={doseUnit} onChange={(e) => setDoseUnit(e.target.value)}>
                <option value="mcg">Micrograms (mcg)</option>
                <option value="mg">Milligrams (mg)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right Graphic Syringe Result */}
        <div className="card" style={{ background: 'linear-gradient(180deg, rgba(14, 24, 40, 0.9) 0%, rgba(8, 12, 20, 0.95) 100%)', borderColor: 'rgba(0, 242, 254, 0.3)', textAlign: 'center', padding: '24px' }}>
          <div style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.06em' }}>
            Draw Syringe Plunger Exactly To:
          </div>

          <div style={{ fontSize: '56px', fontWeight: '800', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)', margin: '8px 0' }}>
            {syringeUnits.toFixed(1)} <span style={{ fontSize: '20px', color: '#fff' }}>Units</span>
          </div>

          <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px' }}>
            Volume: <strong style={{ color: '#fff' }}>{volumeMl.toFixed(3)} mL</strong> | Doses in Vial: <strong style={{ color: 'var(--accent-green)' }}>{totalDoses} doses</strong>
          </div>

          {/* Visual Syringe Meter */}
          <div style={{ background: 'rgba(0,0,0,0.5)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-dim)', marginBottom: '6px', fontFamily: 'var(--font-mono)' }}>
              <span>0u</span>
              <span>25u</span>
              <span>50u</span>
              <span>75u</span>
              <span>100u</span>
            </div>

            <div style={{ height: '22px', background: 'rgba(255,255,255,0.06)', borderRadius: '6px', overflow: 'hidden', position: 'relative', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div
                style={{
                  height: '100%',
                  width: `${fillPct}%`,
                  background: 'linear-gradient(90deg, var(--accent-cyan), var(--accent-pink))',
                  boxShadow: '0 0 12px rgba(0, 242, 254, 0.6)',
                  transition: 'width 0.2s ease'
                }}
              />
              <div style={{ position: 'absolute', top: 0, bottom: 0, left: `${fillPct}%`, width: '2px', background: '#fff' }} />
            </div>

            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px' }}>
              Standard U-100 Insulin Syringe (100 units = 1.0 mL)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
