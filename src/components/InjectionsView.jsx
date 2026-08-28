import React, { useState } from 'react';
import { sound } from '../utils/audio';

const COMMON_SITES = [
  'Left Abdomen (SubQ)',
  'Right Abdomen (SubQ)',
  'Left Deltoid (Shoulder)',
  'Right Deltoid (Shoulder)',
  'Left Glute (Ventrogluteal)',
  'Right Glute (Ventrogluteal)',
  'Left Thigh (Quad)',
  'Right Thigh (Quad)'
];

const POPULAR_PEPTIDES = [
  { name: 'KLOW Blend', dose: '500 mcg', units: 20, frequency: 'Daily (AM)', timing: 'Morning Fasted', cycle_duration: 60 },
  { name: 'SS-31 (Cardiolipin)', dose: '4.0 mg', units: 40, frequency: 'Daily (AM)', timing: 'Morning', cycle_duration: 30 },
  { name: 'MOTS-c (Mitochondrial)', dose: '5.0 mg', units: 50, frequency: '3x / Week', timing: 'Pre-Workout Fasted', cycle_duration: 30 },
  { name: 'BPC-157', dose: '250 mcg', units: 10, frequency: 'Twice Daily (AM/PM)', timing: 'Morning / Bedtime', cycle_duration: 30 },
  { name: 'TB-500', dose: '2.5 mg', units: 50, frequency: '2x / Week', timing: 'Evening', cycle_duration: 30 },
  { name: 'Retatrutide (Triple G)', dose: '2.0 mg', units: 20, frequency: 'Once Weekly', timing: 'Morning Fasted', cycle_duration: 90 },
  { name: 'Tirzepatide', dose: '2.5 mg', units: 25, frequency: 'Once Weekly', timing: 'Morning Fasted', cycle_duration: 90 },
  { name: 'Semaglutide', dose: '0.25 mg', units: 10, frequency: 'Once Weekly', timing: 'Morning Fasted', cycle_duration: 90 },
  { name: 'CJC-1295 / Ipamorelin', dose: '300 mcg', units: 15, frequency: '5 Days On / 2 Off', timing: 'Bedtime Fasted', cycle_duration: 60 },
  { name: 'Epithalon (Telomeres)', dose: '10 mg', units: 50, frequency: 'Daily (10-Day Cycle)', timing: 'Bedtime', cycle_duration: 20 },
  { name: 'GHK-Cu (Copper Peptide)', dose: '2.0 mg', units: 20, frequency: 'Daily (AM)', timing: 'Morning', cycle_duration: 30 },
  { name: 'PT-141 (Libido)', dose: '1.5 mg', units: 30, frequency: 'As Needed', timing: 'Evening', cycle_duration: 30 }
];

export default function InjectionsView({ injections, onUpdateInjections, onLogDose }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedSite, setSelectedSite] = useState(COMMON_SITES[0]);

  // Form State
  const [name, setName] = useState('');
  const [dose, setDose] = useState('');
  const [units, setUnits] = useState('10');
  const [frequency, setFrequency] = useState('Daily (AM)');
  const [timing, setTiming] = useState('Morning Fasted');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [cycleDuration, setCycleDuration] = useState('30');
  const [daysOn, setDaysOn] = useState('5');
  const [daysOff, setDaysOff] = useState('2');

  const handleOpenAdd = () => {
    sound.playClick();
    setEditingId(null);
    setName('');
    setDose('');
    setUnits('10');
    setFrequency('Daily (AM)');
    setTiming('Morning Fasted');
    setStartDate(new Date().toISOString().split('T')[0]);
    setCycleDuration('30');
    setDaysOn('5');
    setDaysOff('2');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    sound.playClick();
    setEditingId(item.id);
    setName(item.name || '');
    setDose(item.dose || '');
    setUnits((item.units || 10).toString());
    setFrequency(item.frequency || 'Daily (AM)');
    setTiming(item.timing || 'Morning Fasted');
    setStartDate(item.start_date || new Date().toISOString().split('T')[0]);
    setCycleDuration((item.cycle_duration || 30).toString());
    setDaysOn((item.cycle_days_on || 5).toString());
    setDaysOff((item.cycle_days_off || 2).toString());
    setIsModalOpen(true);
  };

  const handleSelectPreset = (preset) => {
    sound.playClick();
    setName(preset.name);
    setDose(preset.dose);
    setUnits(preset.units.toString());
    setFrequency(preset.frequency);
    setTiming(preset.timing);
    setCycleDuration((preset.cycle_duration || 30).toString());
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    sound.playSuccess();

    if (editingId) {
      // Edit
      const updated = injections.map(inj => {
        if (inj.id === editingId) {
          return {
            ...inj,
            name,
            dose,
            units: parseInt(units) || 10,
            frequency,
            timing,
            start_date: startDate,
            cycle_duration: parseInt(cycleDuration) || 30,
            cycle_days_on: parseInt(daysOn) || 5,
            cycle_days_off: parseInt(daysOff) || 2
          };
        }
        return inj;
      });
      onUpdateInjections(updated);
    } else {
      // Add
      const newItem = {
        id: 'inj-' + Date.now(),
        name,
        dose,
        units: parseInt(units) || 10,
        frequency,
        timing,
        lastTaken: 'Never',
        site: selectedSite,
        start_date: startDate,
        cycle_duration: parseInt(cycleDuration) || 30,
        cycle_days_on: parseInt(daysOn) || 5,
        cycle_days_off: parseInt(daysOff) || 2
      };
      onUpdateInjections([...injections, newItem]);
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    sound.playAlert();
    onUpdateInjections(injections.filter(i => i.id !== id));
  };

  const handleLog = (item) => {
    sound.playSuccess();
    onLogDose(item, selectedSite);
  };

  return (
    <div style={{ animation: 'popIn 0.2s ease' }}>
      <div className="section-header">
        <div>
          <h2>Injections & Dosing</h2>
          <p>Easily manage and edit your active peptides, dosages, cycle tracking durations, and injection sites.</p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenAdd}>
          + Add New Peptide Protocol
        </button>
      </div>

      {/* Selected Injection Site Selector */}
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '20px' }}>📍</span>
          <div>
            <div style={{ fontSize: '13px', fontWeight: '700', color: '#fff' }}>Target Injection Site for Today:</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Rotate sites to prevent tissue irritation</div>
          </div>
        </div>

        <select
          className="select-field"
          style={{ width: 'auto', minWidth: '220px', padding: '8px 12px', fontSize: '13px' }}
          value={selectedSite}
          onChange={(e) => setSelectedSite(e.target.value)}
        >
          {COMMON_SITES.map(site => (
            <option key={site} value={site}>{site}</option>
          ))}
        </select>
      </div>

      {/* Active Compounds List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {injections.map((item) => (
          <div key={item.id} className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#fff' }}>{item.name}</h3>
                  <span className="badge badge-cyan">{item.timing || 'Morning'}</span>
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '6px' }}>
                  Frequency: <strong style={{ color: '#fff' }}>{item.frequency}</strong> | Cycle: <strong style={{ color: 'var(--accent-cyan)' }}>{item.cycle_duration || 30} Days</strong> (Started: {item.start_date || 'Active'})
                </div>
              </div>

              {/* Big Dose Display */}
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '22px', fontWeight: '800', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
                  {item.dose}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-dim)' }}>
                  Draw to <strong>{item.units || 10} IU</strong> on Syringe
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', paddingTop: '14px', borderTop: '1px solid var(--border)' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-dim)' }}>
                Site: {item.site || selectedSite} • Schedule: {item.cycle_days_on || 5}d ON / {item.cycle_days_off || 2}d OFF
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  className="btn btn-primary"
                  style={{ padding: '8px 18px', fontSize: '13px' }}
                  onClick={() => handleLog(item)}
                >
                  ⚡ Log Dose
                </button>
                <button
                  className="btn btn-secondary"
                  style={{ padding: '8px 14px', fontSize: '13px' }}
                  onClick={() => handleOpenEdit(item)}
                >
                  ✏️ Edit Protocol & Cycle
                </button>
                <button
                  className="btn btn-danger"
                  style={{ padding: '8px 12px', fontSize: '13px' }}
                  onClick={() => handleDelete(item.id)}
                  title="Delete"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Clean Add / Edit Modal */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#fff' }}>
                {editingId ? '✏️ Edit Dosage, Schedule & Cycle' : '➕ Add Peptide Protocol'}
              </h3>
              <button style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '18px', cursor: 'pointer' }} onClick={() => setIsModalOpen(false)}>✕</button>
            </div>

            {/* Quick 1-Click Popular Buttons (if adding new) */}
            {!editingId && (
              <div style={{ marginBottom: '18px' }}>
                <label className="input-label">Quick 1-Click Popular Peptides:</label>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', maxHeight: '110px', overflowY: 'auto' }}>
                  {POPULAR_PEPTIDES.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className="btn btn-secondary"
                      style={{ fontSize: '11px', padding: '5px 10px' }}
                      onClick={() => handleSelectPreset(p)}
                    >
                      {p.name} ({p.dose})
                    </button>
                  ))}
                </div>
              </div>
            )}

            <form onSubmit={handleSave}>
              <div style={{ marginBottom: '14px' }}>
                <label className="input-label">Peptide / Medicine Name</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. BPC-157, KLOW, SS-31..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label className="input-label">Target Dosage</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g. 250 mcg, 2.5 mg"
                    value={dose}
                    onChange={(e) => setDose(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="input-label">Syringe Units (IU)</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g. 10"
                    value={units}
                    onChange={(e) => setUnits(e.target.value)}
                  />
                </div>
              </div>

              {/* Cycle Tracking */}
              <div style={{ background: 'rgba(0, 242, 254, 0.05)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(0, 242, 254, 0.2)', marginBottom: '14px' }}>
                <div style={{ fontSize: '11.5px', fontWeight: '700', color: 'var(--accent-cyan)', marginBottom: '8px' }}>
                  🔄 Active Cycle Duration & Tracking
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 1fr', gap: '8px' }}>
                  <div>
                    <label className="input-label" style={{ fontSize: '11px' }}>Start Date</label>
                    <input
                      type="date"
                      className="input-field"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="input-label" style={{ fontSize: '11px' }}>Duration (Days)</label>
                    <input
                      type="number"
                      min="7"
                      max="180"
                      className="input-field"
                      value={cycleDuration}
                      onChange={(e) => setCycleDuration(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="input-label" style={{ fontSize: '11px' }}>Days ON</label>
                    <input
                      type="number"
                      min="1"
                      max="7"
                      className="input-field"
                      value={daysOn}
                      onChange={(e) => setDaysOn(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="input-label" style={{ fontSize: '11px' }}>Days OFF</label>
                    <input
                      type="number"
                      min="0"
                      max="7"
                      className="input-field"
                      value={daysOff}
                      onChange={(e) => setDaysOff(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                <div>
                  <label className="input-label">Frequency & Schedule</label>
                  <select
                    className="select-field"
                    value={frequency}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFrequency(val);
                      if (val.includes('7 Days') || val.includes('Daily Continuous')) {
                        setDaysOn(7);
                        setDaysOff(0);
                      } else if (val.includes('6 Days')) {
                        setDaysOn(6);
                        setDaysOff(1);
                      } else if (val.includes('5 Days')) {
                        setDaysOn(5);
                        setDaysOff(2);
                      }
                    }}
                  >
                    <option value="7 Days On / 0 Days Off (Daily Continuous)">7 Days On / 0 Days Off (Daily Continuous)</option>
                    <option value="Daily (AM)">Daily (AM) - Continuous</option>
                    <option value="Daily (PM)">Daily (PM) - Continuous</option>
                    <option value="Twice Daily (AM/PM)">Twice Daily (AM/PM)</option>
                    <option value="6 Days On / 1 Day Off">6 Days On / 1 Day Off</option>
                    <option value="5 Days On / 2 Off">5 Days On / 2 Off</option>
                    <option value="3x / Week">3x / Week</option>
                    <option value="2x / Week">2x / Week</option>
                    <option value="Once Weekly">Once Weekly</option>
                    <option value="As Needed">As Needed</option>
                  </select>
                </div>

                <div>
                  <label className="input-label">Timing</label>
                  <select className="select-field" value={timing} onChange={(e) => setTiming(e.target.value)}>
                    <option value="Morning Fasted">Morning Fasted</option>
                    <option value="Morning with Food">Morning with Food</option>
                    <option value="Pre-Workout">Pre-Workout</option>
                    <option value="Evening / Dinner">Evening / Dinner</option>
                    <option value="Bedtime Fasted">Bedtime Fasted</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">
                  {editingId ? '✓ Save Changes' : '+ Add to Protocol'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
