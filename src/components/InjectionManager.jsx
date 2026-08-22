import React, { useState } from 'react';
import { sound } from '../utils/audio';

const INJECTION_SITES = [
  { id: 'ab-left', name: 'Left Abdomen (SubQ)', area: 'Abdominal', icon: '📍' },
  { id: 'ab-right', name: 'Right Abdomen (SubQ)', area: 'Abdominal', icon: '📍' },
  { id: 'delt-left', name: 'Left Deltoid (IM / SubQ)', area: 'Upper Arm', icon: '📍' },
  { id: 'delt-right', name: 'Right Deltoid (IM / SubQ)', area: 'Upper Arm', icon: '📍' },
  { id: 'glute-left', name: 'Left Ventrogluteal (IM)', area: 'Gluteal', icon: '📍' },
  { id: 'glute-right', name: 'Right Ventrogluteal (IM)', area: 'Gluteal', icon: '📍' },
  { id: 'quad-left', name: 'Left Vastus Lateralis (IM)', area: 'Thigh', icon: '📍' },
  { id: 'quad-right', name: 'Right Vastus Lateralis (IM)', area: 'Thigh', icon: '📍' }
];

export const POPULAR_PEPTIDE_LIBRARY = [
  // User Requested Key Compounds
  { name: 'KLOW Blend (Klotho / KPV / BPC / GHK Ultimate Repair)', dose: '500 mcg', units: 20, frequency: 'Daily (AM)', timing: 'Morning Fasted', category: 'Cellular Youth & Tissue Regeneration', vialMg: 10, bacWaterMl: 2.0, color: '#00f2fe' },
  { name: 'SS-31 (Elamipretide Cardiolipin Targeter)', dose: '4.0 mg', units: 40, frequency: 'Daily (AM)', timing: 'Morning', category: 'Mitochondrial Inner Membrane ATP', vialMg: 50, bacWaterMl: 5.0, color: '#05ffa1' },
  { name: 'MOTS-c (Mitochondrial ORF 12S rRNA)', dose: '5.0 mg', units: 50, frequency: '3x / Week', timing: 'Pre-Workout Fasted', category: 'Metabolic & Mitochondrial Biogenesis', vialMg: 10, bacWaterMl: 2.0, color: '#ffb703' },
  
  // Weight & Metabolic Next-Gen
  { name: 'Retatrutide (Triple G - GLP-1/GIP/Glucagon)', dose: '2.0 mg', units: 20, frequency: 'Once Weekly', timing: 'Morning Fasted', category: 'Metabolic & Fat Oxidation', vialMg: 10, bacWaterMl: 2.0, color: '#00f2fe' },
  { name: 'Tirzepatide (Mounjaro / Zepbound GLP-1/GIP)', dose: '2.5 mg', units: 25, frequency: 'Once Weekly', timing: 'Morning Fasted', category: 'Glucose & Satiety', vialMg: 10, bacWaterMl: 2.0, color: '#05ffa1' },
  { name: 'Semaglutide (Ozempic / Wegovy GLP-1)', dose: '0.25 mg', units: 10, frequency: 'Once Weekly', timing: 'Morning Fasted', category: 'Appetite & Insulin Regulation', vialMg: 5, bacWaterMl: 2.0, color: '#05ffa1' },
  { name: 'Cagrilintide (Long-Acting Amylin Analog)', dose: '0.3 mg', units: 15, frequency: 'Once Weekly', timing: 'Morning Fasted', category: 'Amylin Satiety Agonist', vialMg: 5, bacWaterMl: 2.5, color: '#ff2a6d' },
  { name: 'AOD-9604 (Lipolytic GH Fragment 176-191)', dose: '300 mcg', units: 15, frequency: 'Daily Fasted', timing: 'Morning / Pre-Cardio', category: 'Targeted Adipose Lipolysis', vialMg: 5, bacWaterMl: 2.5, color: '#ffb703' },
  { name: '5-Amino-1MQ (NNMT Inhibitor)', dose: '50 mg', units: 50, frequency: 'Daily (AM)', timing: 'Morning Fasted', category: 'Intracellular NAD+ & Fat Metabolism', vialMg: 500, bacWaterMl: 5.0, color: '#9d4edd' },

  // Tissue Healing & Regenerative
  { name: 'BPC-157 (Body Protection Compound)', dose: '250 mcg', units: 10, frequency: 'Twice Daily (AM/PM)', timing: 'AM / PM', category: 'Gut, Tendon & Angiogenesis', vialMg: 5, bacWaterMl: 2.0, color: '#00f2fe' },
  { name: 'TB-500 (Thymosin Beta-4 Systemic)', dose: '2.5 mg', units: 50, frequency: '2x / Week', timing: 'Evening', category: 'Systemic Repair & Actin Cytoskeleton', vialMg: 10, bacWaterMl: 2.0, color: '#ff2a6d' },
  { name: 'GHK-Cu (Copper Peptide Tripeptide-1)', dose: '2.0 mg', units: 20, frequency: 'Daily (AM)', timing: 'Morning', category: 'Skin, Decorin & Gene Remodeling', vialMg: 50, bacWaterMl: 5.0, color: '#00f2fe' },
  { name: 'KPV (Alpha-MSH Tripeptide)', dose: '300 mcg', units: 15, frequency: 'Daily (AM/PM)', timing: 'Morning', category: 'Gut Mucosa & Anti-Inflammatory', vialMg: 5, bacWaterMl: 2.5, color: '#05ffa1' },

  // Longevity & Immune
  { name: 'Epithalon (Epithalamin Pineal Bioregulator)', dose: '10 mg', units: 50, frequency: 'Daily (10-20 Day Cycle)', timing: 'Bedtime', category: 'Telomerase Activation & Circadian Clock', vialMg: 50, bacWaterMl: 5.0, color: '#9d4edd' },
  { name: 'Thymosin Alpha-1 (TA-1 / Zadaxin)', dose: '1.5 mg', units: 30, frequency: '2x / Week', timing: 'Morning', category: 'Immune Modulation & T-Cell Defense', vialMg: 10, bacWaterMl: 2.0, color: '#05ffa1' },
  { name: 'NAD+ (Nicotinamide Adenine Dinucleotide)', dose: '50 mg', units: 50, frequency: '3x / Week', timing: 'Morning Fasted', category: 'Cellular ATP & DNA Repair', vialMg: 500, bacWaterMl: 5.0, color: '#00f2fe' },
  { name: 'FoxO4-DRI (Targeted Senolytic Peptide)', dose: '3.0 mg', units: 30, frequency: '3x / Week (Pulse Cycle)', timing: 'Morning', category: 'Senescent Zombie Cell Clearance', vialMg: 10, bacWaterMl: 1.0, color: '#ff2a6d' },

  // Growth Hormone & Sleep
  { name: 'CJC-1295 (No DAC) / Ipamorelin Blend', dose: '300 mcg', units: 15, frequency: '5 Days On / 2 Days Off', timing: 'Bedtime (Fasted)', category: 'Natural Pituitary GH Secretagogue', vialMg: 5, bacWaterMl: 2.5, color: '#9d4edd' },
  { name: 'Tesamorelin (Egrifta GHRH Analog)', dose: '1.0 mg', units: 20, frequency: 'Daily (Bedtime Fasted)', timing: 'Bedtime', category: 'Visceral Fat & IGF-1 Optimization', vialMg: 10, bacWaterMl: 2.0, color: '#ffb703' },
  { name: 'Sermorelin (GHRH 1-29)', dose: '500 mcg', units: 25, frequency: 'Bedtime Fasted', timing: 'Bedtime', category: 'Slow-Wave Sleep & Collagen Renewal', vialMg: 5, bacWaterMl: 2.5, color: '#9d4edd' },
  { name: 'Hexarelin (Potent GHRP & Cardioprotective)', dose: '100 mcg', units: 10, frequency: 'Pre-Workout / AM', timing: 'Morning Fasted', category: 'GH Secretion & Cardiac Perfusion', vialMg: 5, bacWaterMl: 5.0, color: '#ff2a6d' },

  // Brain & Nootropic
  { name: 'Semax (Heptapeptide ACTH 4-10 Analog)', dose: '600 mcg', units: 12, frequency: 'Daily (AM)', timing: 'Morning', category: 'BDNF, TrkB & Cognitive Focus', vialMg: 10, bacWaterMl: 2.0, color: '#00f2fe' },
  { name: 'Selank (Synthetic Tuftsin Analog)', dose: '500 mcg', units: 10, frequency: 'As Needed (AM/PM)', timing: 'Morning / Afternoon', category: 'GABAergic Anxiolytic & Neuro-Calm', vialMg: 10, bacWaterMl: 2.0, color: '#05ffa1' },
  { name: 'Dihexa (Potent Synaptogenic Oligopeptide)', dose: '10 mg', units: 20, frequency: 'Daily (AM)', timing: 'Morning', category: 'HGF Mimic & Synaptic Arborization', vialMg: 50, bacWaterMl: 5.0, color: '#ffb703' },

  // Sexual Health & Melanocortin
  { name: 'PT-141 (Bremelanotide SubQ)', dose: '1.5 mg', units: 30, frequency: 'As Needed (2-4h prior)', timing: 'Evening', category: 'Melanocortin MC3/MC4 Libido Agonist', vialMg: 10, bacWaterMl: 2.0, color: '#ff2a6d' },
  { name: 'Kisspeptin-10 (GnRH Agonist)', dose: '200 mcg', units: 20, frequency: '2x / Week', timing: 'Bedtime', category: 'Hypothalamic LH/FSH & Testosterone Pulse', vialMg: 5, bacWaterMl: 5.0, color: '#9d4edd' },
  { name: 'Melanotan II (MT-2 Melanocortin)', dose: '250 mcg', units: 10, frequency: '2-3x / Week', timing: 'Pre-UV / Bedtime', category: 'Melanogenesis & Skin Pigmentation', vialMg: 10, bacWaterMl: 2.0, color: '#ffb703' }
];

export default function InjectionManager({ injections, onUpdateInjections }) {
  const [selectedSite, setSelectedSite] = useState('ab-left');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCompoundId, setEditingCompoundId] = useState(null);
  const [librarySearch, setLibrarySearch] = useState('');
  
  const [logHistory, setLogHistory] = useState([
    { id: 1, name: 'BPC-157', dose: '250 mcg', site: 'Left Abdomen (SubQ)', time: 'Today 08:30 AM', status: 'Completed' },
    { id: 2, name: 'CJC-1295 / Ipamorelin', dose: '300 mcg', site: 'Right Abdomen (SubQ)', time: 'Yesterday 11:15 PM', status: 'Completed' },
    { id: 3, name: 'TB-500', dose: '2.5 mg', site: 'Right Deltoid (IM / SubQ)', time: 'Aug 11 08:00 PM', status: 'Completed' },
    { id: 4, name: 'MOTS-c', dose: '5.0 mg', site: 'Left Abdomen (SubQ)', time: 'Aug 10 09:00 AM', status: 'Completed' }
  ]);

  // Form State (for both Add and Edit)
  const [formData, setFormData] = useState({
    name: '',
    dose: '',
    units: '10',
    frequency: 'Daily (AM)',
    timing: 'Morning',
    category: 'Regenerative Healing',
    vialMg: '5',
    bacWaterMl: '2.0',
    stockVials: '2',
    color: '#00f2fe'
  });

  const handleLogInjection = (item) => {
    sound.playSuccess();
    const siteObj = INJECTION_SITES.find(s => s.id === selectedSite) || INJECTION_SITES[0];
    const now = new Date();
    const timeStr = `Today ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    const newLog = {
      id: Date.now(),
      name: item.name.split(' (')[0],
      dose: item.dose,
      site: siteObj.name,
      time: timeStr,
      status: 'Completed'
    };

    setLogHistory([newLog, ...logHistory]);

    const updated = injections.map(inj => {
      if (inj.id === item.id) {
        return { ...inj, lastTaken: 'Just Now', site: siteObj.name };
      }
      return inj;
    });
    onUpdateInjections(updated);
  };

  const handleDeleteCompound = (id) => {
    sound.playAlert();
    const updated = injections.filter(inj => inj.id !== id);
    onUpdateInjections(updated);
  };

  const handleOpenEditModal = (item) => {
    sound.playClick();
    setEditingCompoundId(item.id);
    setFormData({
      name: item.name || '',
      dose: item.dose || '',
      units: (item.units !== undefined ? item.units : 10).toString(),
      frequency: item.frequency || 'Daily (AM)',
      timing: item.timing || 'Morning',
      category: item.category || 'Regenerative Healing',
      vialMg: (item.vialMg || 5).toString(),
      bacWaterMl: (item.bacWaterMl || 2.0).toString(),
      stockVials: (item.stockVials || 2).toString(),
      color: item.color || '#00f2fe'
    });
    setIsModalOpen(true);
  };

  const handleOpenAddModal = () => {
    sound.playClick();
    setEditingCompoundId(null);
    setFormData({
      name: '',
      dose: '',
      units: '10',
      frequency: 'Daily (AM)',
      timing: 'Morning',
      category: 'Regenerative Healing',
      vialMg: '5',
      bacWaterMl: '2.0',
      stockVials: '2',
      color: '#00f2fe'
    });
    setIsModalOpen(true);
  };

  const handleQuickAddFromLibrary = (libItem) => {
    sound.playSuccess();
    const created = {
      id: 'inj-' + Date.now(),
      ...libItem,
      active: true,
      lastTaken: 'Never',
      site: 'Left Abdomen (SubQ)',
      stockVials: 3
    };
    onUpdateInjections([...injections, created]);
    setIsModalOpen(false);
  };

  const handleSaveCompoundForm = (e) => {
    e.preventDefault();
    if (!formData.name) return;
    sound.playChime();

    if (editingCompoundId) {
      // Editing existing compound
      const updated = injections.map(inj => {
        if (inj.id === editingCompoundId) {
          return {
            ...inj,
            name: formData.name,
            dose: formData.dose,
            units: parseInt(formData.units) || 0,
            frequency: formData.frequency,
            timing: formData.timing,
            category: formData.category,
            vialMg: parseFloat(formData.vialMg) || 5,
            bacWaterMl: parseFloat(formData.bacWaterMl) || 2.0,
            stockVials: parseInt(formData.stockVials) || 1,
            color: formData.color
          };
        }
        return inj;
      });
      onUpdateInjections(updated);
    } else {
      // Creating new compound
      const created = {
        id: 'inj-' + Date.now(),
        name: formData.name,
        dose: formData.dose,
        units: parseInt(formData.units) || 0,
        frequency: formData.frequency,
        timing: formData.timing,
        category: formData.category,
        vialMg: parseFloat(formData.vialMg) || 5,
        bacWaterMl: parseFloat(formData.bacWaterMl) || 2.0,
        stockVials: parseInt(formData.stockVials) || 2,
        color: formData.color,
        active: true,
        lastTaken: 'Never',
        site: 'Left Abdomen (SubQ)'
      };
      onUpdateInjections([...injections, created]);
    }

    setIsModalOpen(false);
    setEditingCompoundId(null);
  };

  const filteredLibrary = POPULAR_PEPTIDE_LIBRARY.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(librarySearch.toLowerCase()) ||
                          item.category.toLowerCase().includes(librarySearch.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="animate-fade-in">
      <div className="view-header">
        <div className="view-title-group">
          <h2>Peptide & Injection Command</h2>
          <p>Add custom protocols, edit dosages & timings, calculate reconstitution, rotate injection sites, and log doses.</p>
        </div>
        <div className="quick-actions">
          <button className="btn-primary" onClick={handleOpenAddModal}>
            <span>+</span> Add New Peptide Protocol
          </button>
        </div>
      </div>

      {/* Featured 1-Click Library Bar */}
      <div className="glass-panel" style={{ marginBottom: '24px', padding: '16px 20px', border: '1px solid rgba(0, 242, 254, 0.2)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <span style={{ fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--neon-cyan)' }}>
            ⚡ 1-Click Peptide Library (Click any compound to instantly add to your active protocol)
          </span>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{POPULAR_PEPTIDE_LIBRARY.length} compounds ready</span>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {POPULAR_PEPTIDE_LIBRARY.slice(0, 8).map((lib, idx) => (
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
            style={{ fontSize: '11.5px', padding: '7px 14px', borderColor: 'var(--neon-cyan)', color: 'var(--neon-cyan)', fontWeight: '700' }}
            onClick={handleOpenAddModal}
          >
            + Browse All {POPULAR_PEPTIDE_LIBRARY.length} Compounds (KLOW, SS-31, MOTS-c, etc.)...
          </button>
        </div>
      </div>

      {/* Grid Layout: Active Protocols + Site Rotation Map */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '24px', marginBottom: '28px' }}>
        
        {/* Active Protocols List */}
        <div>
          <div className="glass-panel">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700' }}>
                Active Compounds ({injections.length})
              </h3>
              <button
                className="btn-secondary"
                style={{ fontSize: '11px', padding: '4px 10px' }}
                onClick={handleOpenAddModal}
              >
                + Add Another
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {injections.map((item) => (
                <div
                  key={item.id}
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--border-glass)',
                    borderRadius: '12px',
                    padding: '18px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: item.color || '#00f2fe' }} />

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#fff' }}>{item.name}</h4>
                        <span className="tag-badge tag-cyan" style={{ fontSize: '10px' }}>{item.category}</span>
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                        Frequency: <strong style={{ color: 'var(--text-main)' }}>{item.frequency}</strong> | Timing: <strong style={{ color: 'var(--neon-amber)' }}>{item.timing}</strong>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '18px', fontWeight: '800', fontFamily: 'var(--font-mono)', color: item.color || '#00f2fe' }}>
                        {item.dose}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-dark)', fontFamily: 'var(--font-mono)' }}>
                        ({item.units} IU on Syringe)
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid var(--border-glass)' }}>
                    <div style={{ fontSize: '11.5px', color: 'var(--text-dark)' }}>
                      Last Injected: <strong style={{ color: 'var(--text-muted)' }}>{item.lastTaken || 'Recently'}</strong> | Site: <strong style={{ color: 'var(--text-muted)' }}>{item.site || 'Abdomen'}</strong>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        className="btn-primary"
                        style={{ padding: '6px 14px', fontSize: '12px' }}
                        onClick={() => handleLogInjection(item)}
                      >
                        ⚡ Log Dose Now
                      </button>

                      {/* EDIT BUTTON */}
                      <button
                        className="btn-secondary"
                        style={{ padding: '6px 12px', fontSize: '12px', color: 'var(--neon-cyan)', borderColor: 'rgba(0, 242, 254, 0.3)' }}
                        onClick={() => handleOpenEditModal(item)}
                        title="Edit Dosage, Timing & Protocol"
                      >
                        ✏️ Edit
                      </button>

                      {/* DELETE BUTTON */}
                      <button
                        className="btn-secondary"
                        style={{ padding: '6px 10px', fontSize: '12px', color: 'var(--neon-crimson)' }}
                        onClick={() => handleDeleteCompound(item.id)}
                        title="Delete Compound"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Interactive Injection Site Rotation Map */}
        <div className="glass-panel" style={{ border: '1px solid rgba(255, 42, 109, 0.25)' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: 'var(--neon-crimson)' }}>🎯</span> Site Rotation Matrix
          </h3>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '20px' }}>
            Select your target area prior to logging to automatically track injection site history.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
            {INJECTION_SITES.map((site) => {
              const isSelected = selectedSite === site.id;
              return (
                <div
                  key={site.id}
                  onClick={() => { sound.playClick(); setSelectedSite(site.id); }}
                  style={{
                    background: isSelected ? 'rgba(255, 42, 109, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                    border: isSelected ? '1px solid var(--neon-crimson)' : '1px solid var(--border-glass)',
                    borderRadius: '10px',
                    padding: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: isSelected ? '#fff' : 'var(--text-muted)' }}>
                      {site.name}
                    </span>
                    {isSelected && <span style={{ color: 'var(--neon-crimson)', fontSize: '12px' }}>● Active</span>}
                  </div>
                  <span style={{ fontSize: '10px', color: 'var(--text-dark)' }}>{site.area}</span>
                </div>
              );
            })}
          </div>

          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-glass)' }}>
            <div style={{ fontSize: '11px', color: 'var(--neon-amber)', fontWeight: '700', textTransform: 'uppercase', marginBottom: '4px' }}>
              💡 Smart Rotation Tip
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              SubQ injections (KLOW, BPC-157, SS-31, MOTS-c, Semaglutide) absorb best into abdominal fat 2 inches away from the umbilicus. Rotate at least 1 inch away from prior injection spots.
            </div>
          </div>
        </div>
      </div>

      {/* Historical Injection Log */}
      <div className="glass-panel">
        <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>Administration Audit Log</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-glass)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '12px 14px' }}>COMPOUND</th>
                <th style={{ padding: '12px 14px' }}>DOSE</th>
                <th style={{ padding: '12px 14px' }}>TARGET SITE</th>
                <th style={{ padding: '12px 14px' }}>TIMESTAMP</th>
                <th style={{ padding: '12px 14px' }}>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {logHistory.map((log) => (
                <tr key={log.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                  <td style={{ padding: '12px 14px', fontWeight: '600', color: '#fff' }}>{log.name}</td>
                  <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)', color: 'var(--neon-cyan)' }}>{log.dose}</td>
                  <td style={{ padding: '12px 14px', color: 'var(--text-muted)' }}>{log.site}</td>
                  <td style={{ padding: '12px 14px', color: 'var(--text-dark)' }}>{log.time}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <span className="tag-badge tag-emerald">{log.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Full Modal to add OR edit compound */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => { setIsModalOpen(false); setEditingCompoundId(null); }}>
          <div className="modal-card" style={{ maxWidth: '780px', maxHeight: '90vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 style={{ fontSize: '22px', fontWeight: '800' }}>
                  {editingCompoundId ? '✏️ Edit Peptide Protocol' : 'Master Peptide Library & Custom Builder'}
                </h3>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  {editingCompoundId ? 'Update your exact dosage, frequency, injection timing, and syringe units.' : 'Search and 1-click add popular peptides or create custom formulations.'}
                </p>
              </div>
              <button className="modal-close" onClick={() => { setIsModalOpen(false); setEditingCompoundId(null); }}>✕</button>
            </div>

            {/* If adding new, show the search and library selector */}
            {!editingCompoundId && (
              <>
                <div style={{ marginBottom: '16px' }}>
                  <input
                    type="text"
                    placeholder="🔍 Search 25+ popular peptides (KLOW, SS-31, MOTS-c, Retatrutide, Epithalon, etc.)..."
                    className="bio-input"
                    value={librarySearch}
                    onChange={(e) => setLibrarySearch(e.target.value)}
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <div className="bio-label">
                    Popular Pre-Configured Compounds ({filteredLibrary.length})
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', maxHeight: '240px', overflowY: 'auto', paddingRight: '4px' }}>
                    {filteredLibrary.map((item, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleQuickAddFromLibrary(item)}
                        style={{
                          background: 'rgba(255,255,255,0.04)',
                          border: '1px solid var(--border-glass)',
                          borderRadius: '8px',
                          padding: '10px 12px',
                          cursor: 'pointer',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          transition: 'all 0.15s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--neon-cyan)'}
                        onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-glass)'}
                      >
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: '700', color: '#fff' }}>{item.name.split(' (')[0]}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{item.dose} • {item.frequency}</div>
                          <div style={{ fontSize: '10px', color: 'var(--neon-cyan)', marginTop: '2px' }}>{item.category}</div>
                        </div>
                        <span className="tag-badge tag-cyan" style={{ fontSize: '10px' }}>+ Add</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ textAlign: 'center', margin: '14px 0', fontSize: '12px', color: 'var(--text-dark)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  — OR CONFIGURE CUSTOM FORMULATION —
                </div>
              </>
            )}

            <form onSubmit={handleSaveCompoundForm}>
              <div style={{ marginBottom: '14px' }}>
                <label className="bio-label">Compound Name & Formulation</label>
                <input
                  type="text"
                  placeholder="e.g. BPC-157 / TB-500 Blend"
                  className="bio-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                <div>
                  <label className="bio-label">Target Dose (e.g. 500 mcg, 2.5 mg, 10 IU)</label>
                  <input
                    type="text"
                    placeholder="e.g. 500 mcg"
                    className="bio-input"
                    value={formData.dose}
                    onChange={(e) => setFormData({ ...formData, dose: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="bio-label">Syringe Units on U-100 (IU)</label>
                  <input
                    type="text"
                    placeholder="e.g. 20"
                    className="bio-input"
                    value={formData.units}
                    onChange={(e) => setFormData({ ...formData, units: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                <div>
                  <label className="bio-label">Administration Frequency</label>
                  <select
                    className="bio-select"
                    value={formData.frequency}
                    onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                  >
                    <option value="Daily (AM)">Daily (AM)</option>
                    <option value="Daily (PM)">Daily (PM)</option>
                    <option value="Twice Daily (AM/PM)">Twice Daily (AM/PM)</option>
                    <option value="3x / Week">3x / Week (Mon/Wed/Fri)</option>
                    <option value="2x / Week">2x / Week (Mon/Thu)</option>
                    <option value="5 Days On / 2 Days Off">5 Days On / 2 Days Off</option>
                    <option value="Once Weekly">Once Weekly</option>
                    <option value="As Needed / Acute">As Needed / Acute</option>
                  </select>
                </div>

                <div>
                  <label className="bio-label">Circadian Ingestion Timing</label>
                  <select
                    className="bio-select"
                    value={formData.timing}
                    onChange={(e) => setFormData({ ...formData, timing: e.target.value })}
                  >
                    <option value="Morning Fasted">Morning Fasted (upon waking)</option>
                    <option value="Morning with Breakfast">Morning with Breakfast</option>
                    <option value="Midday / Lunch">Midday / Lunch</option>
                    <option value="Pre-Workout Fasted">Pre-Workout Fasted (30-45m prior)</option>
                    <option value="Evening / Dinner">Evening / Dinner</option>
                    <option value="Bedtime (Fasted)">Bedtime Fasted (90m+ post-food)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '14px', marginBottom: '14px' }}>
                <div>
                  <label className="bio-label">Category / Objective</label>
                  <input
                    type="text"
                    placeholder="Tissue Repair / Mitochondrial Longevity"
                    className="bio-input"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  />
                </div>

                <div>
                  <label className="bio-label">Vials in Stock</label>
                  <input
                    type="text"
                    placeholder="e.g. 3"
                    className="bio-input"
                    value={formData.stockVials}
                    onChange={(e) => setFormData({ ...formData, stockVials: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '22px' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => { setIsModalOpen(false); setEditingCompoundId(null); }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingCompoundId ? '✓ Save Changes' : '+ Save to Protocol'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
