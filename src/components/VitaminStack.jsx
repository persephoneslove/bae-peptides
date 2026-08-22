import React, { useState } from 'react';
import { sound } from '../utils/audio';

const POPULAR_SUPPLEMENT_LIBRARY = [
  { name: 'Tongkat Ali (LJ100 200:1 Extract)', dose: '400 mg', timeOfDay: 'Morning', target: 'Free Testosterone & SHBG Lowering', synergyNote: 'Take with morning fat source; cycles well 5 days on / 2 off.', stockDays: 40 },
  { name: 'Ashwagandha KSM-66', dose: '600 mg', timeOfDay: 'Bedtime', target: 'Cortisol Reduction & Thyroid Regulation', synergyNote: 'Best taken evening to lower evening cortisol curve.', stockDays: 30 },
  { name: 'Creatine Monohydrate (Creapure)', dose: '5 g', timeOfDay: 'Morning', target: 'Brain Phosphocreatine & ATP', synergyNote: 'Take daily without cycling. Boosts cognitive speed.', stockDays: 60 },
  { name: 'CoQ10 (Ubiquinol Formulation)', dose: '200 mg', timeOfDay: 'Morning', target: 'Mitochondrial Electron Transport Chain', synergyNote: 'Critical when taking statins or intense endurance training.', stockDays: 30 },
  { name: 'Berberine HCl / Dihydroberberine', dose: '500 mg', timeOfDay: 'Midday', target: 'AMPK Activator & Blood Glucose Blunting', synergyNote: 'Take 15 minutes before carb-dense meal.', stockDays: 45 },
  { name: 'Lion\'s Mane Mushroom (Dual Extract)', dose: '1,000 mg', timeOfDay: 'Morning', target: 'NGF & Neurogenesis', synergyNote: 'Synergizes with NMN for mental clarity.', stockDays: 30 },
  { name: 'Alpha-GPC (99% Pure)', dose: '300 mg', timeOfDay: 'Morning', target: 'Acetylcholine Neurotransmitter Synthesis', synergyNote: 'Great 45 mins before deep work or weightlifting.', stockDays: 25 },
  { name: 'Zinc Glycinate (25mg) + Copper (1mg)', dose: '1 Capsule', timeOfDay: 'Evening', target: 'Androgen Synthesis & Immunity', synergyNote: 'Always balance Zinc with Copper to prevent deficiency.', stockDays: 50 },
  { name: 'Resveratrol (Trans-Resveratrol Micronized)', dose: '500 mg', timeOfDay: 'Morning', target: 'SIRT1 Sirtuin Gene Activation', synergyNote: 'Take with whole milk, yogurt, or olive oil for micelle absorption.', stockDays: 30 },
  { name: 'L-Theanine (Suntheanine)', dose: '200 mg', timeOfDay: 'Morning', target: 'Smooth Alpha Wave Energy', synergyNote: 'Pairs with morning coffee at 2:1 ratio (200mg Theanine : 100mg Caffeine).', stockDays: 60 }
];

export default function VitaminStack({ vitamins, onUpdateVitamins }) {
  const [selectedTimeFilter, setSelectedTimeFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVitaminId, setEditingVitaminId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    dose: '',
    timeOfDay: 'Morning',
    target: '',
    synergyNote: '',
    stockDays: '30'
  });

  const toggleTaken = (id) => {
    const updated = vitamins.map((item) => {
      if (item.id === id) {
        const nextState = !item.takenToday;
        if (nextState) sound.playSuccess();
        else sound.playClick();
        return {
          ...item,
          takenToday: nextState,
          streak: nextState ? item.streak + 1 : Math.max(0, item.streak - 1)
        };
      }
      return item;
    });
    onUpdateVitamins(updated);
  };

  const handleDelete = (id) => {
    sound.playAlert();
    const updated = vitamins.filter(v => v.id !== id);
    onUpdateVitamins(updated);
  };

  const handleOpenEditModal = (item) => {
    sound.playClick();
    setEditingVitaminId(item.id);
    setFormData({
      name: item.name || '',
      dose: item.dose || '',
      timeOfDay: item.timeOfDay || 'Morning',
      target: item.target || '',
      synergyNote: item.synergyNote || '',
      stockDays: (item.stockDays !== undefined ? item.stockDays : 30).toString()
    });
    setIsModalOpen(true);
  };

  const handleOpenAddModal = () => {
    sound.playClick();
    setEditingVitaminId(null);
    setFormData({
      name: '',
      dose: '',
      timeOfDay: 'Morning',
      target: '',
      synergyNote: '',
      stockDays: '30'
    });
    setIsModalOpen(true);
  };

  const handleQuickAddFromLibrary = (libItem) => {
    sound.playSuccess();
    const created = {
      id: 'vit-' + Date.now(),
      ...libItem,
      takenToday: false,
      streak: 0
    };
    onUpdateVitamins([...vitamins, created]);
    setIsModalOpen(false);
  };

  const handleSaveVitamin = (e) => {
    e.preventDefault();
    if (!formData.name) return;
    sound.playChime();

    if (editingVitaminId) {
      const updated = vitamins.map(vit => {
        if (vit.id === editingVitaminId) {
          return {
            ...vit,
            name: formData.name,
            dose: formData.dose,
            timeOfDay: formData.timeOfDay,
            target: formData.target,
            synergyNote: formData.synergyNote,
            stockDays: parseInt(formData.stockDays) || 30
          };
        }
        return vit;
      });
      onUpdateVitamins(updated);
    } else {
      const created = {
        id: 'vit-' + Date.now(),
        name: formData.name,
        dose: formData.dose,
        timeOfDay: formData.timeOfDay,
        target: formData.target,
        synergyNote: formData.synergyNote,
        stockDays: parseInt(formData.stockDays) || 30,
        takenToday: false,
        streak: 0
      };
      onUpdateVitamins([...vitamins, created]);
    }

    setIsModalOpen(false);
    setEditingVitaminId(null);
  };

  const filteredVitamins = vitamins.filter((v) => {
    if (selectedTimeFilter === 'ALL') return true;
    return v.timeOfDay.toUpperCase() === selectedTimeFilter;
  });

  const totalVitamins = vitamins.length;
  const takenCount = vitamins.filter((v) => v.takenToday).length;
  const compliancePct = totalVitamins > 0 ? Math.round((takenCount / totalVitamins) * 100) : 0;

  return (
    <div className="animate-fade-in">
      <div className="view-header">
        <div className="view-title-group">
          <h2>Nutraceutical & Vitamin Stack</h2>
          <p>Add custom vitamins, edit dosages & timings, and optimize synergistic bio-absorption.</p>
        </div>
        <div className="quick-actions">
          <button className="btn-primary" onClick={handleOpenAddModal}>
            <span>+</span> Add Custom Supplement
          </button>
        </div>
      </div>

      {/* 1-Click Library Bar */}
      <div className="glass-panel" style={{ marginBottom: '24px', padding: '16px 20px', border: '1px solid rgba(5, 255, 161, 0.2)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <span style={{ fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--neon-emerald)' }}>
            ⚡ 1-Click Supplement Quick Library (Click to add to your active stack)
          </span>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {POPULAR_SUPPLEMENT_LIBRARY.slice(0, 6).map((lib, idx) => (
            <button
              key={idx}
              className="btn-secondary"
              style={{ fontSize: '11.5px', padding: '7px 12px' }}
              onClick={() => handleQuickAddFromLibrary(lib)}
            >
              + {lib.name.split(' (')[0]} ({lib.dose})
            </button>
          ))}
          <button
            className="btn-secondary"
            style={{ fontSize: '11.5px', padding: '7px 12px', borderColor: 'var(--neon-emerald)', color: 'var(--neon-emerald)' }}
            onClick={handleOpenAddModal}
          >
            + Browse All 10+ Supplements...
          </button>
        </div>
      </div>

      {/* Compliance Metric Banner */}
      <div className="stat-banner-grid">
        <div className="stat-card emerald">
          <div className="stat-header">
            <span>Today's Compliance</span>
            <span>🎯</span>
          </div>
          <div className="stat-value">{compliancePct}%</div>
          <div className="stat-subtext highlight-emerald">
            {takenCount} of {totalVitamins} items ingested today
          </div>
        </div>

        <div className="stat-card cyan">
          <div className="stat-header">
            <span>Total Active Compounds</span>
            <span>💊</span>
          </div>
          <div className="stat-value">{totalVitamins} Items</div>
          <div className="stat-subtext highlight-cyan">
            Personalized Daily Stack
          </div>
        </div>

        <div className="stat-card amber">
          <div className="stat-header">
            <span>Absorption Timing</span>
            <span>⚡</span>
          </div>
          <div className="stat-value">AM / PM Phased</div>
          <div className="stat-subtext">
            Prevents receptor saturation
          </div>
        </div>

        <div className="stat-card crimson">
          <div className="stat-header">
            <span>Depletion Warnings</span>
            <span>📦</span>
          </div>
          <div className="stat-value">{vitamins.filter(v => v.stockDays < 20).length} Items Low</div>
          <div className="stat-subtext highlight-crimson">
            Reorder notifications enabled
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['ALL', 'MORNING', 'MIDDAY', 'BEDTIME'].map((tab) => (
            <button
              key={tab}
              className={`btn-secondary ${selectedTimeFilter === tab ? 'active' : ''}`}
              style={{
                fontSize: '12px',
                padding: '8px 16px',
                background: selectedTimeFilter === tab ? 'rgba(0, 242, 254, 0.15)' : 'rgba(255,255,255,0.03)',
                borderColor: selectedTimeFilter === tab ? 'var(--neon-cyan)' : 'var(--border-glass)',
                color: selectedTimeFilter === tab ? '#fff' : 'var(--text-muted)'
              }}
              onClick={() => { sound.playClick(); setSelectedTimeFilter(tab); }}
            >
              {tab === 'ALL' ? '🌟 All Stacks' : tab === 'MORNING' ? '☀️ Morning' : tab === 'MIDDAY' ? '🥪 Midday' : '🌙 Bedtime'}
            </button>
          ))}
        </div>
      </div>

      {/* Supplement Stack Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '18px', marginBottom: '32px' }}>
        {filteredVitamins.map((item) => (
          <div
            key={item.id}
            className="glass-panel glass-panel-interactive"
            style={{
              borderColor: item.takenToday ? 'rgba(5, 255, 161, 0.35)' : 'var(--border-glass)',
              background: item.takenToday ? 'linear-gradient(180deg, rgba(8, 25, 20, 0.8) 0%, rgba(10, 16, 24, 0.9) 100%)' : 'var(--bg-surface-1)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className={`tag-badge ${item.timeOfDay === 'Morning' ? 'tag-amber' : item.timeOfDay === 'Bedtime' ? 'tag-violet' : 'tag-cyan'}`}>
                    {item.timeOfDay}
                  </span>
                  <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-dark)' }}>
                    🔥 {item.streak}d streak
                  </span>
                </div>
                <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#fff', marginTop: '6px' }}>{item.name}</h4>
              </div>

              <input
                type="checkbox"
                checked={item.takenToday}
                onChange={() => toggleTaken(item.id)}
                style={{
                  width: '24px',
                  height: '24px',
                  cursor: 'pointer',
                  accentColor: 'var(--neon-emerald)'
                }}
              />
            </div>

            <div style={{ fontSize: '13px', color: 'var(--neon-cyan)', fontFamily: 'var(--font-mono)', marginBottom: '8px' }}>
              {item.dose}
            </div>

            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px' }}>
              <strong>Bio-Target:</strong> {item.target}
            </div>

            {item.synergyNote && (
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-glass)', fontSize: '11.5px', color: 'var(--text-muted)' }}>
                <span style={{ color: 'var(--neon-emerald)', fontWeight: '700' }}>⚡ Synergy:</span> {item.synergyNote}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px', paddingTop: '10px', borderTop: '1px solid var(--border-glass)', fontSize: '11px', color: 'var(--text-dark)' }}>
              <span>Stock: <strong style={{ color: item.stockDays < 20 ? 'var(--neon-crimson)' : 'var(--text-muted)' }}>{item.stockDays} days</strong></span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  className="btn-secondary"
                  style={{ fontSize: '11px', padding: '4px 10px' }}
                  onClick={() => toggleTaken(item.id)}
                >
                  {item.takenToday ? '✓ Completed' : 'Mark Taken'}
                </button>

                {/* EDIT BUTTON */}
                <button
                  className="btn-secondary"
                  style={{ fontSize: '11px', padding: '4px 8px', color: 'var(--neon-cyan)', borderColor: 'rgba(0, 242, 254, 0.3)' }}
                  onClick={() => handleOpenEditModal(item)}
                  title="Edit Supplement"
                >
                  ✏️
                </button>

                {/* DELETE BUTTON */}
                <button
                  className="btn-secondary"
                  style={{ fontSize: '11px', padding: '4px 8px', color: 'var(--neon-crimson)' }}
                  onClick={() => handleDelete(item.id)}
                  title="Remove supplement"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Supplement Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => { setIsModalOpen(false); setEditingVitaminId(null); }}>
          <div className="modal-card" style={{ maxWidth: '680px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: '800' }}>
                  {editingVitaminId ? '✏️ Edit Supplement Formulation' : 'Add Custom Supplement'}
                </h3>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  {editingVitaminId ? 'Update your dosage, ingestion timing, and absorption notes.' : 'Select from pre-configured formulations or enter your custom item.'}
                </p>
              </div>
              <button className="modal-close" onClick={() => { setIsModalOpen(false); setEditingVitaminId(null); }}>✕</button>
            </div>

            {/* Quick 1-click Presets (Only shown when adding new) */}
            {!editingVitaminId && (
              <>
                <div style={{ marginBottom: '20px' }}>
                  <div className="bio-label">Quick 1-Click Library Formulations</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', maxHeight: '180px', overflowY: 'auto', paddingRight: '4px' }}>
                    {POPULAR_SUPPLEMENT_LIBRARY.map((item, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleQuickAddFromLibrary(item)}
                        style={{
                          background: 'rgba(255,255,255,0.04)',
                          border: '1px solid var(--border-glass)',
                          borderRadius: '8px',
                          padding: '8px 12px',
                          cursor: 'pointer',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                      >
                        <div>
                          <div style={{ fontSize: '12.5px', fontWeight: '700', color: '#fff' }}>{item.name.split(' (')[0]}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{item.dose} • {item.timeOfDay}</div>
                        </div>
                        <span style={{ fontSize: '11px', color: 'var(--neon-emerald)', fontWeight: '700' }}>+ Add</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ textAlign: 'center', margin: '14px 0', fontSize: '12px', color: 'var(--text-dark)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  — OR CUSTOM FORMULATION —
                </div>
              </>
            )}

            <form onSubmit={handleSaveVitamin}>
              <div style={{ marginBottom: '14px' }}>
                <label className="bio-label">Supplement Name & Brand Form</label>
                <input
                  type="text"
                  placeholder="e.g. Zinc Picolinate + Copper Glycinate"
                  className="bio-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                <div>
                  <label className="bio-label">Dosage & Unit</label>
                  <input
                    type="text"
                    placeholder="15mg Zinc / 1mg Copper"
                    className="bio-input"
                    value={formData.dose}
                    onChange={(e) => setFormData({ ...formData, dose: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="bio-label">Ingestion Timing</label>
                  <select
                    className="bio-select"
                    value={formData.timeOfDay}
                    onChange={(e) => setFormData({ ...formData, timeOfDay: e.target.value })}
                  >
                    <option value="Morning">Morning (Fasted / Breakfast)</option>
                    <option value="Midday">Midday (Lunch)</option>
                    <option value="Evening">Evening (Dinner)</option>
                    <option value="Bedtime">Bedtime (Pre-Sleep)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '14px', marginBottom: '14px' }}>
                <div>
                  <label className="bio-label">Primary Bio-Target</label>
                  <input
                    type="text"
                    placeholder="Testosterone, Sleep Latency, Mitochondrial Energy"
                    className="bio-input"
                    value={formData.target}
                    onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                  />
                </div>

                <div>
                  <label className="bio-label">Days of Stock</label>
                  <input
                    type="text"
                    placeholder="30"
                    className="bio-input"
                    value={formData.stockDays}
                    onChange={(e) => setFormData({ ...formData, stockDays: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label className="bio-label">Synergy or Absorption Notes</label>
                <input
                  type="text"
                  placeholder="Take with dietary fat; avoids stomach upset"
                  className="bio-input"
                  value={formData.synergyNote}
                  onChange={(e) => setFormData({ ...formData, synergyNote: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => { setIsModalOpen(false); setEditingVitaminId(null); }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingVitaminId ? '✓ Save Changes' : '+ Save to Stack'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
