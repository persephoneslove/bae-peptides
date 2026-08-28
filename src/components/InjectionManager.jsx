import React, { useState } from 'react';
import { sound } from '../utils/audio';
import { getStorageData, setStorageData, initialData } from '../utils/storage';

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
  { name: 'KLOW Blend (Klotho / KPV / BPC / GHK Ultimate Repair)', dose: '500 mcg', units: 20, frequency: 'Daily (AM)', timing: 'Morning Fasted', category: 'Cellular Youth & Tissue Regeneration', vialMg: 10, bacWaterMl: 2.0, color: '#00f2fe', halfLifeHours: 12.0 },
  { name: 'SS-31 (Elamipretide Cardiolipin Targeter)', dose: '4.0 mg', units: 40, frequency: 'Daily (AM)', timing: 'Morning', category: 'Mitochondrial Inner Membrane ATP', vialMg: 50, bacWaterMl: 5.0, color: '#05ffa1', halfLifeHours: 4.5 },
  { name: 'MOTS-c (Mitochondrial ORF 12S rRNA)', dose: '5.0 mg', units: 50, frequency: '3x / Week', timing: 'Pre-Workout Fasted', category: 'Metabolic & Mitochondrial Biogenesis', vialMg: 10, bacWaterMl: 2.0, color: '#ffb703', halfLifeHours: 4.0 },
  
  // Weight & Metabolic Next-Gen
  { name: 'Retatrutide (Triple G - GLP-1/GIP/Glucagon)', dose: '2.0 mg', units: 20, frequency: 'Once Weekly', timing: 'Morning Fasted', category: 'Metabolic & Fat Oxidation', vialMg: 10, bacWaterMl: 2.0, color: '#00f2fe', halfLifeHours: 144.0 },
  { name: 'Tirzepatide (Mounjaro / Zepbound GLP-1/GIP)', dose: '2.5 mg', units: 25, frequency: 'Once Weekly', timing: 'Morning Fasted', category: 'Glucose & Satiety', vialMg: 10, bacWaterMl: 2.0, color: '#05ffa1', halfLifeHours: 120.0 },
  { name: 'Semaglutide (Ozempic / Wegovy GLP-1)', dose: '0.25 mg', units: 10, frequency: 'Once Weekly', timing: 'Morning Fasted', category: 'Appetite & Insulin Regulation', vialMg: 5, bacWaterMl: 2.0, color: '#05ffa1', halfLifeHours: 168.0 },
  { name: 'Cagrilintide (Long-Acting Amylin Analog)', dose: '0.3 mg', units: 15, frequency: 'Once Weekly', timing: 'Morning Fasted', category: 'Amylin Satiety Agonist', vialMg: 5, bacWaterMl: 2.5, color: '#ff2a6d', halfLifeHours: 160.0 },
  { name: 'AOD-9604 (Lipolytic GH Fragment 176-191)', dose: '300 mcg', units: 15, frequency: 'Daily Fasted', timing: 'Morning / Pre-Cardio', category: 'Targeted Adipose Lipolysis', vialMg: 5, bacWaterMl: 2.5, color: '#ffb703', halfLifeHours: 1.5 },
  { name: '5-Amino-1MQ (NNMT Inhibitor)', dose: '50 mg', units: 50, frequency: 'Daily (AM)', timing: 'Morning Fasted', category: 'Intracellular NAD+ & Fat Metabolism', vialMg: 500, bacWaterMl: 5.0, color: '#9d4edd', halfLifeHours: 6.0 },

  // Tissue Healing & Regenerative
  { name: 'BPC-157 (Body Protection Compound)', dose: '250 mcg', units: 10, frequency: 'Twice Daily (AM/PM)', timing: 'AM / PM', category: 'Gut, Tendon & Angiogenesis', vialMg: 5, bacWaterMl: 2.0, color: '#00f2fe', halfLifeHours: 4.0 },
  { name: 'TB-500 (Thymosin Beta-4 Systemic)', dose: '2.5 mg', units: 50, frequency: '2x / Week', timing: 'Evening', category: 'Systemic Repair & Actin Cytoskeleton', vialMg: 10, bacWaterMl: 2.0, color: '#ff2a6d', halfLifeHours: 48.0 },
  { name: 'GHK-Cu (Copper Peptide Tripeptide-1)', dose: '2.0 mg', units: 20, frequency: 'Daily (AM)', timing: 'Morning', category: 'Skin, Decorin & Gene Remodeling', vialMg: 50, bacWaterMl: 5.0, color: '#00f2fe', halfLifeHours: 1.0 },
  { name: 'KPV (Alpha-MSH Tripeptide)', dose: '300 mcg', units: 15, frequency: 'Daily (AM/PM)', timing: 'Morning', category: 'Gut Mucosa & Anti-Inflammatory', vialMg: 5, bacWaterMl: 2.5, color: '#05ffa1', halfLifeHours: 2.0 },

  // Longevity & Immune
  { name: 'Epithalon (Epithalamin Pineal Bioregulator)', dose: '10 mg', units: 50, frequency: 'Daily (10-20 Day Cycle)', timing: 'Bedtime', category: 'Telomerase Activation & Circadian Clock', vialMg: 50, bacWaterMl: 5.0, color: '#9d4edd', halfLifeHours: 2.5 },
  { name: 'Thymosin Alpha-1 (TA-1 / Zadaxin)', dose: '1.5 mg', units: 30, frequency: '2x / Week', timing: 'Morning', category: 'Immune Modulation & T-Cell Defense', vialMg: 10, bacWaterMl: 2.0, color: '#05ffa1', halfLifeHours: 2.0 },
  { name: 'NAD+ (Nicotinamide Adenine Dinucleotide)', dose: '50 mg', units: 50, frequency: '3x / Week', timing: 'Morning Fasted', category: 'Cellular ATP & DNA Repair', vialMg: 500, bacWaterMl: 5.0, color: '#00f2fe', halfLifeHours: 3.0 },
  { name: 'FoxO4-DRI (Targeted Senolytic Peptide)', dose: '3.0 mg', units: 30, frequency: '3x / Week (Pulse Cycle)', timing: 'Morning', category: 'Senescent Zombie Cell Clearance', vialMg: 10, bacWaterMl: 1.0, color: '#ff2a6d', halfLifeHours: 4.0 },

  // Growth Hormone & Sleep
  { name: 'CJC-1295 (No DAC) / Ipamorelin Blend', dose: '300 mcg', units: 15, frequency: '5 Days On / 2 Days Off', timing: 'Bedtime (Fasted)', category: 'Natural Pituitary GH Secretagogue', vialMg: 5, bacWaterMl: 2.5, color: '#9d4edd', halfLifeHours: 1.5 },
  { name: 'Tesamorelin (Egrifta GHRH Analog)', dose: '1.0 mg', units: 20, frequency: 'Daily (Bedtime Fasted)', timing: 'Bedtime', category: 'Visceral Fat & IGF-1 Optimization', vialMg: 10, bacWaterMl: 2.0, color: '#ffb703', halfLifeHours: 0.5 },
  { name: 'Sermorelin (GHRH 1-29)', dose: '500 mcg', units: 25, frequency: 'Bedtime Fasted', timing: 'Bedtime', category: 'Slow-Wave Sleep & Collagen Renewal', vialMg: 5, bacWaterMl: 2.5, color: '#9d4edd', halfLifeHours: 0.5 },
  { name: 'Hexarelin (Potent GHRP & Cardioprotective)', dose: '100 mcg', units: 10, frequency: 'Pre-Workout / AM', timing: 'Morning Fasted', category: 'GH Secretion & Cardiac Perfusion', vialMg: 5, bacWaterMl: 5.0, color: '#ff2a6d', halfLifeHours: 1.2 },

  // Brain & Nootropic
  { name: 'Semax (Heptapeptide ACTH 4-10 Analog)', dose: '600 mcg', units: 12, frequency: 'Daily (AM)', timing: 'Morning', category: 'BDNF, TrkB & Cognitive Focus', vialMg: 10, bacWaterMl: 2.0, color: '#00f2fe', halfLifeHours: 0.5 },
  { name: 'Selank (Synthetic Tuftsin Analog)', dose: '500 mcg', units: 10, frequency: 'As Needed (AM/PM)', timing: 'Morning / Afternoon', category: 'GABAergic Anxiolytic & Neuro-Calm', vialMg: 10, bacWaterMl: 2.0, color: '#05ffa1', halfLifeHours: 0.4 },
  { name: 'Dihexa (Potent Synaptogenic Oligopeptide)', dose: '10 mg', units: 20, frequency: 'Daily (AM)', timing: 'Morning', category: 'HGF Mimic & Synaptic Arborization', vialMg: 50, bacWaterMl: 5.0, color: '#ffb703', halfLifeHours: 8.0 },

  // Sexual Health & Melanocortin
  { name: 'PT-141 (Bremelanotide SubQ)', dose: '1.5 mg', units: 30, frequency: 'As Needed (2-4h prior)', timing: 'Evening', category: 'Melanocortin MC3/MC4 Libido Agonist', vialMg: 10, bacWaterMl: 2.0, color: '#ff2a6d', halfLifeHours: 2.7 },
  { name: 'Kisspeptin-10 (GnRH Agonist)', dose: '200 mcg', units: 20, frequency: '2x / Week', timing: 'Bedtime', category: 'Hypothalamic LH/FSH & Testosterone Pulse', vialMg: 5, bacWaterMl: 5.0, color: '#9d4edd', halfLifeHours: 0.8 },
  { name: 'Melanotan II (MT-2 Melanocortin)', dose: '250 mcg', units: 10, frequency: '2-3x / Week', timing: 'Pre-UV / Bedtime', category: 'Melanogenesis & Skin Pigmentation', vialMg: 10, bacWaterMl: 2.0, color: '#ffb703', halfLifeHours: 1.5 }
];

export default function InjectionManager({ injections, onUpdateInjections, onLogQuickDose }) {
  const [selectedSite, setSelectedSite] = useState('ab-left');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCustomLibModalOpen, setIsCustomLibModalOpen] = useState(false);
  const [editingCompoundId, setEditingCompoundId] = useState(null);
  const [librarySearch, setLibrarySearch] = useState('');
  
  // Custom Dynamic Library
  const [customPeptides, setCustomPeptides] = useState(() => 
    getStorageData(initialData.KEYS.CUSTOM_PEPTIDES, [])
  );

  // New Custom Compound Creator Form State
  const [customCompoundData, setCustomCompoundData] = useState({
    name: '',
    dose: '250 mcg',
    units: 10,
    frequency: 'Daily (AM)',
    timing: 'Morning Fasted',
    category: 'Targeted Longevity',
    vialMg: 5,
    bacWaterMl: 2.0,
    halfLifeHours: 4.0,
    color: '#00f2fe'
  });

  // Protocol Add / Edit Form State with Cycle Tracking
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
    color: '#00f2fe',
    start_date: new Date().toISOString().split('T')[0],
    cycle_duration: '30',
    cycle_days_on: '5',
    cycle_days_off: '2'
  });

  const handleLogInjection = (item) => {
    sound.playSuccess();
    const siteObj = INJECTION_SITES.find(s => s.id === selectedSite) || INJECTION_SITES[0];
    if (onLogQuickDose) {
      onLogQuickDose({ ...item, site: siteObj.name });
    }
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
      color: item.color || '#00f2fe',
      start_date: item.start_date || new Date().toISOString().split('T')[0],
      cycle_duration: (item.cycle_duration || 30).toString(),
      cycle_days_on: (item.cycle_days_on || 5).toString(),
      cycle_days_off: (item.cycle_days_off || 2).toString()
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
      color: '#00f2fe',
      start_date: new Date().toISOString().split('T')[0],
      cycle_duration: '30',
      cycle_days_on: '5',
      cycle_days_off: '2'
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
      stockVials: 3,
      start_date: new Date().toISOString().split('T')[0],
      cycle_duration: 30,
      cycle_days_on: 5,
      cycle_days_off: 2
    };
    onUpdateInjections([...injections, created]);
    setIsModalOpen(false);
  };

  // Add custom compound dynamically to user library
  const handleSaveCustomCompoundToLibrary = (e) => {
    e.preventDefault();
    if (!customCompoundData.name.trim()) return;
    sound.playSuccess();

    const newCustom = {
      id: 'custom-pep-' + Date.now(),
      ...customCompoundData,
      is_custom: true
    };

    const updatedLib = [newCustom, ...customPeptides];
    setCustomPeptides(updatedLib);
    setStorageData(initialData.KEYS.CUSTOM_PEPTIDES, updatedLib);

    // Also offer to add to active stack
    const createdProtocol = {
      id: 'inj-' + Date.now(),
      ...newCustom,
      active: true,
      lastTaken: 'Never',
      site: 'Left Abdomen (SubQ)',
      stockVials: 2,
      start_date: new Date().toISOString().split('T')[0],
      cycle_duration: 30,
      cycle_days_on: 5,
      cycle_days_off: 2
    };
    onUpdateInjections([...injections, createdProtocol]);

    setIsCustomLibModalOpen(false);
    setCustomCompoundData({
      name: '',
      dose: '250 mcg',
      units: 10,
      frequency: 'Daily (AM)',
      timing: 'Morning Fasted',
      category: 'Targeted Longevity',
      vialMg: 5,
      bacWaterMl: 2.0,
      halfLifeHours: 4.0,
      color: '#00f2fe'
    });
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
            color: formData.color,
            start_date: formData.start_date,
            cycle_duration: parseInt(formData.cycle_duration) || 30,
            cycle_days_on: parseInt(formData.cycle_days_on) || 5,
            cycle_days_off: parseInt(formData.cycle_days_off) || 2
          };
        }
        return inj;
      });
      onUpdateInjections(updated);
    } else {
      // Creating new compound protocol
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
        site: 'Left Abdomen (SubQ)',
        start_date: formData.start_date || new Date().toISOString().split('T')[0],
        cycle_duration: parseInt(formData.cycle_duration) || 30,
        cycle_days_on: parseInt(formData.cycle_days_on) || 5,
        cycle_days_off: parseInt(formData.cycle_days_off) || 2
      };
      onUpdateInjections([...injections, created]);
    }

    setIsModalOpen(false);
    setEditingCompoundId(null);
  };

  // Combine Popular Library + Dynamic Custom Compounds
  const combinedLibrary = [...customPeptides, ...POPULAR_PEPTIDE_LIBRARY];

  const filteredLibrary = combinedLibrary.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(librarySearch.toLowerCase()) ||
                          item.category.toLowerCase().includes(librarySearch.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="animate-fade-in">
      <div className="view-header">
        <div className="view-title-group">
          <h2>Peptide & Injection Command</h2>
          <p>Add custom protocols, edit dosages & timings, track compound lifecycles (start date & duration), and dynamically manage your compound library.</p>
        </div>
        <div className="quick-actions" style={{ display: 'flex', gap: '8px' }}>
          <button className="btn-secondary" onClick={() => setIsCustomLibModalOpen(true)}>
            <span>🧬</span> + New Compound to Library
          </button>
          <button className="btn-primary" onClick={handleOpenAddModal}>
            <span>+</span> Add Active Protocol
          </button>
        </div>
      </div>

      {/* Featured 1-Click Library Bar */}
      <div className="glass-panel" style={{ marginBottom: '24px', padding: '16px 20px', border: '1px solid rgba(0, 242, 254, 0.2)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <span style={{ fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--neon-cyan)' }}>
            ⚡ Dynamic Peptide Library ({combinedLibrary.length} Compounds Ready)
          </span>
          <button
            className="btn-secondary"
            style={{ fontSize: '11px', padding: '3px 8px' }}
            onClick={() => setIsCustomLibModalOpen(true)}
          >
            + Create New Compound
          </button>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {combinedLibrary.slice(0, 8).map((lib, idx) => (
            <button
              key={idx}
              className="btn-secondary"
              style={{ fontSize: '11.5px', padding: '7px 12px' }}
              onClick={() => handleQuickAddFromLibrary(lib)}
            >
              + {lib.name.split(' (')[0]} {lib.is_custom ? '⭐' : ''} ({lib.dose})
            </button>
          ))}
          <button
            className="btn-secondary"
            style={{ fontSize: '11.5px', padding: '7px 14px', borderColor: 'var(--neon-cyan)', color: 'var(--neon-cyan)', fontWeight: '700' }}
            onClick={handleOpenAddModal}
          >
            + Browse All {combinedLibrary.length} Compounds...
          </button>
        </div>
      </div>

      {/* Grid Layout: Active Protocols + Site Rotation Map */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '24px', marginBottom: '28px' }}>
        
        {/* Active Protocols List with Cycle Tracking */}
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

                  {/* Cycle Tracking HUD on Card */}
                  <div style={{ background: 'rgba(0,0,0,0.25)', padding: '8px 12px', borderRadius: '8px', fontSize: '11.5px', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>🔄 Cycle: <strong style={{ color: 'var(--accent-cyan)' }}>{item.cycle_duration || 30} Days</strong> (Started: {item.start_date || 'Active'})</span>
                    <span>{item.cycle_days_on || 5}d ON / {item.cycle_days_off || 2}d OFF</span>
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
                        ⚡ Log Dose
                      </button>

                      {/* EDIT BUTTON */}
                      <button
                        className="btn-secondary"
                        style={{ padding: '6px 12px', fontSize: '12px', color: 'var(--neon-cyan)', borderColor: 'rgba(0, 242, 254, 0.3)' }}
                        onClick={() => handleOpenEditModal(item)}
                        title="Edit Dosage, Cycle & Protocol"
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
              SubQ injections absorb best into abdominal fat 2 inches away from the umbilicus. Rotate at least 1 inch away from prior injection spots.
            </div>
          </div>
        </div>
      </div>

      {/* FULL MODAL TO ADD OR EDIT PROTOCOL WITH CYCLE TRACKING */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => { setIsModalOpen(false); setEditingCompoundId(null); }}>
          <div className="modal-card" style={{ maxWidth: '780px', maxHeight: '90vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 style={{ fontSize: '22px', fontWeight: '800' }}>
                  {editingCompoundId ? '✏️ Edit Peptide Protocol & Cycle' : 'Master Peptide Library & Custom Builder'}
                </h3>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  {editingCompoundId ? 'Update your exact dosage, frequency, cycle duration, and syringe units.' : 'Search and 1-click add popular peptides or configure custom formulation cycles.'}
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
                    placeholder="🔍 Search compounds (KLOW, SS-31, MOTS-c, Retatrutide, PT-141, etc.)..."
                    className="bio-input"
                    value={librarySearch}
                    onChange={(e) => setLibrarySearch(e.target.value)}
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <div className="bio-label">
                    Pre-Configured Compounds & Custom Additions ({filteredLibrary.length})
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
                          <div style={{ fontSize: '13px', fontWeight: '700', color: '#fff' }}>
                            {item.name.split(' (')[0]} {item.is_custom ? '⭐' : ''}
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{item.dose} • {item.frequency}</div>
                          <div style={{ fontSize: '10px', color: 'var(--neon-cyan)', marginTop: '2px' }}>{item.category}</div>
                        </div>
                        <span className="tag-badge tag-cyan" style={{ fontSize: '10px' }}>+ Add</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ textAlign: 'center', margin: '14px 0', fontSize: '12px', color: 'var(--text-dark)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  — OR CONFIGURE CUSTOM FORMULATION & CYCLE —
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
                  <label className="bio-label">Target Dose (e.g. 500 mcg, 2.5 mg)</label>
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

              {/* CYCLE TRACKING PARAMETERS */}
              <div style={{ background: 'rgba(0, 242, 254, 0.04)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(0, 242, 254, 0.2)', marginBottom: '14px' }}>
                <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--neon-cyan)', marginBottom: '10px', textTransform: 'uppercase' }}>
                  🔄 Active Lifecycle & Cycle Tracking
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 1fr', gap: '10px' }}>
                  <div>
                    <label className="bio-label">Start Date</label>
                    <input
                      type="date"
                      className="bio-input"
                      value={formData.start_date}
                      onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="bio-label">Cycle Duration (Days)</label>
                    <input
                      type="number"
                      min="7"
                      max="180"
                      className="bio-input"
                      value={formData.cycle_duration}
                      onChange={(e) => setFormData({ ...formData, cycle_duration: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="bio-label">Days ON</label>
                    <input
                      type="number"
                      min="1"
                      max="7"
                      className="bio-input"
                      value={formData.cycle_days_on}
                      onChange={(e) => setFormData({ ...formData, cycle_days_on: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="bio-label">Days OFF</label>
                    <input
                      type="number"
                      min="0"
                      max="7"
                      className="bio-input"
                      value={formData.cycle_days_off}
                      onChange={(e) => setFormData({ ...formData, cycle_days_off: e.target.value })}
                    />
                  </div>
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

      {/* DYNAMIC COMPOUND CREATOR MODAL (ADD TO LIBRARY) */}
      {isCustomLibModalOpen && (
        <div className="modal-overlay" onClick={() => setIsCustomLibModalOpen(false)}>
          <div className="modal-card" style={{ maxWidth: '600px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: '800' }}>
                  🧬 Add Custom Peptide to Master Library
                </h3>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Define custom compound parameters, half-life, and reconstitution parameters.
                </p>
              </div>
              <button className="modal-close" onClick={() => setIsCustomLibModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleSaveCustomCompoundToLibrary} style={{ marginTop: '16px' }}>
              <div style={{ marginBottom: '12px' }}>
                <label className="bio-label">Compound Name</label>
                <input
                  type="text"
                  placeholder="e.g. Epitalon + GHK-Cu Hybrid"
                  className="bio-input"
                  value={customCompoundData.name}
                  onChange={(e) => setCustomCompoundData({ ...customCompoundData, name: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label className="bio-label">Standard Dose</label>
                  <input
                    type="text"
                    className="bio-input"
                    value={customCompoundData.dose}
                    onChange={(e) => setCustomCompoundData({ ...customCompoundData, dose: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="bio-label">Category</label>
                  <input
                    type="text"
                    className="bio-input"
                    value={customCompoundData.category}
                    onChange={(e) => setCustomCompoundData({ ...customCompoundData, category: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '16px' }}>
                <div>
                  <label className="bio-label">Vial (mg)</label>
                  <input
                    type="number"
                    step="0.5"
                    className="bio-input"
                    value={customCompoundData.vialMg}
                    onChange={(e) => setCustomCompoundData({ ...customCompoundData, vialMg: parseFloat(e.target.value) || 5 })}
                  />
                </div>
                <div>
                  <label className="bio-label">BAC Water (mL)</label>
                  <input
                    type="number"
                    step="0.1"
                    className="bio-input"
                    value={customCompoundData.bacWaterMl}
                    onChange={(e) => setCustomCompoundData({ ...customCompoundData, bacWaterMl: parseFloat(e.target.value) || 2.0 })}
                  />
                </div>
                <div>
                  <label className="bio-label">Half-Life (Hours)</label>
                  <input
                    type="number"
                    step="0.5"
                    className="bio-input"
                    value={customCompoundData.halfLifeHours}
                    onChange={(e) => setCustomCompoundData({ ...customCompoundData, halfLifeHours: parseFloat(e.target.value) || 4.0 })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setIsCustomLibModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  ✓ Add to Database Library
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
