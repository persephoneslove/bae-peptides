import React, { useState } from 'react';
import { sound } from '../utils/audio';

const POPULAR_VITS = [
  { name: 'Vitamin D3 + K2 (MK-7)', dose: '5,000 IU / 100 mcg', timeOfDay: 'Morning' },
  { name: 'Magnesium L-Threonate', dose: '1,500 mg', timeOfDay: 'Bedtime' },
  { name: 'NMN Sublingual + TMG', dose: '500 mg / 500 mg', timeOfDay: 'Morning' },
  { name: 'Creatine Monohydrate', dose: '5 g', timeOfDay: 'Morning' },
  { name: 'Omega-3 Fish Oil (High EPA/DHA)', dose: '2,000 mg', timeOfDay: 'Morning' },
  { name: 'Tongkat Ali (LJ100)', dose: '400 mg', timeOfDay: 'Morning' },
  { name: 'Ashwagandha KSM-66', dose: '600 mg', timeOfDay: 'Bedtime' },
  { name: 'Zinc + Copper', dose: '25 mg / 1 mg', timeOfDay: 'Evening' },
  { name: 'Apigenin + L-Theanine', dose: '50 mg / 200 mg', timeOfDay: 'Bedtime' },
  { name: 'CoQ10 (Ubiquinol)', dose: '200 mg', timeOfDay: 'Morning' },
  { name: 'Berberine Dihydroberberine', dose: '500 mg', timeOfDay: 'Midday' }
];

export default function VitaminsView({ vitamins, onUpdateVitamins, onToggleVitamin }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [timeFilter, setTimeFilter] = useState('ALL');

  // Form State
  const [name, setName] = useState('');
  const [dose, setDose] = useState('');
  const [timeOfDay, setTimeOfDay] = useState('Morning');

  const handleOpenAdd = () => {
    sound.playClick();
    setEditingId(null);
    setName('');
    setDose('');
    setTimeOfDay('Morning');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    sound.playClick();
    setEditingId(item.id);
    setName(item.name || '');
    setDose(item.dose || '');
    setTimeOfDay(item.timeOfDay || 'Morning');
    setIsModalOpen(true);
  };

  const handleSelectPreset = (p) => {
    sound.playClick();
    setName(p.name);
    setDose(p.dose);
    setTimeOfDay(p.timeOfDay);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    sound.playSuccess();

    if (editingId) {
      const updated = vitamins.map(v => {
        if (v.id === editingId) {
          return { ...v, name, dose, timeOfDay };
        }
        return v;
      });
      onUpdateVitamins(updated);
    } else {
      const newItem = {
        id: 'vit-' + Date.now(),
        name,
        dose,
        timeOfDay,
        takenToday: false,
        streak: 0
      };
      onUpdateVitamins([...vitamins, newItem]);
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    sound.playAlert();
    onUpdateVitamins(vitamins.filter(v => v.id !== id));
  };

  const filteredVits = vitamins.filter(v => {
    if (timeFilter === 'ALL') return true;
    return v.timeOfDay.toUpperCase() === timeFilter;
  });

  return (
    <div style={{ animation: 'popIn 0.2s ease' }}>
      <div className="section-header">
        <div>
          <h2>Nutraceutical & Vitamin Stack</h2>
          <p>Track, organize by time of day, and edit your daily supplement routine.</p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenAdd}>
          + Add Supplement
        </button>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '18px' }}>
        {['ALL', 'MORNING', 'MIDDAY', 'BEDTIME'].map(tab => (
          <button
            key={tab}
            className={`btn btn-secondary ${timeFilter === tab ? 'active' : ''}`}
            style={{
              padding: '6px 14px',
              fontSize: '12.5px',
              background: timeFilter === tab ? 'rgba(0, 242, 254, 0.15)' : 'var(--bg-subtle)',
              borderColor: timeFilter === tab ? 'var(--accent-cyan)' : 'var(--border)',
              color: timeFilter === tab ? '#fff' : 'var(--text-muted)'
            }}
            onClick={() => setTimeFilter(tab)}
          >
            {tab === 'ALL' ? '🌟 All Times' : tab === 'MORNING' ? '☀️ Morning' : tab === 'MIDDAY' ? '🥪 Midday' : '🌙 Bedtime'}
          </button>
        ))}
      </div>

      {/* Supplement List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filteredVits.map((item) => (
          <div
            key={item.id}
            className="card"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px 20px',
              marginBottom: 0,
              background: item.takenToday ? 'rgba(5, 255, 161, 0.05)' : 'var(--bg-card)',
              borderColor: item.takenToday ? 'rgba(5, 255, 161, 0.25)' : 'var(--border)'
            }}
          >
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer', flex: 1 }}
              onClick={() => onToggleVitamin(item.id)}
            >
              <input
                type="checkbox"
                checked={item.takenToday}
                onChange={() => {}}
                style={{ width: '22px', height: '22px', accentColor: 'var(--accent-green)', cursor: 'pointer' }}
              />
              <div>
                <div style={{ fontSize: '16px', fontWeight: '700', color: item.takenToday ? 'var(--text-muted)' : '#fff', textDecoration: item.takenToday ? 'line-through' : 'none' }}>
                  {item.name}
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Dose: <strong style={{ color: 'var(--accent-cyan)' }}>{item.dose}</strong> • Ingestion: {item.timeOfDay}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span className={`badge ${item.timeOfDay === 'Morning' ? 'badge-amber' : item.timeOfDay === 'Bedtime' ? 'badge-pink' : 'badge-cyan'}`}>
                {item.timeOfDay}
              </span>
              <button
                className="btn btn-secondary"
                style={{ padding: '6px 12px', fontSize: '12px' }}
                onClick={() => handleOpenEdit(item)}
              >
                ✏️ Edit
              </button>
              <button
                className="btn btn-danger"
                style={{ padding: '6px 10px', fontSize: '12px' }}
                onClick={() => handleDelete(item.id)}
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#fff' }}>
                {editingId ? '✏️ Edit Supplement' : '➕ Add Supplement'}
              </h3>
              <button style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '18px', cursor: 'pointer' }} onClick={() => setIsModalOpen(false)}>✕</button>
            </div>

            {!editingId && (
              <div style={{ marginBottom: '16px' }}>
                <label className="input-label">Quick 1-Click Supplements:</label>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', maxHeight: '110px', overflowY: 'auto' }}>
                  {POPULAR_VITS.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className="btn btn-secondary"
                      style={{ fontSize: '11px', padding: '5px 10px' }}
                      onClick={() => handleSelectPreset(p)}
                    >
                      {p.name.split(' (')[0]} ({p.timeOfDay})
                    </button>
                  ))}
                </div>
              </div>
            )}

            <form onSubmit={handleSave}>
              <div style={{ marginBottom: '14px' }}>
                <label className="input-label">Supplement Name</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. Magnesium Glycinate, Vitamin D3..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                <div>
                  <label className="input-label">Dosage</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g. 500 mg, 1 Capsule"
                    value={dose}
                    onChange={(e) => setDose(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="input-label">When to take</label>
                  <select className="select-field" value={timeOfDay} onChange={(e) => setTimeOfDay(e.target.value)}>
                    <option value="Morning">Morning</option>
                    <option value="Midday">Midday</option>
                    <option value="Evening">Evening</option>
                    <option value="Bedtime">Bedtime</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">
                  {editingId ? '✓ Save Changes' : '+ Add to Stack'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
