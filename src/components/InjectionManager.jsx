import React, { useState } from 'react';
import { sound } from '../utils/audio';
import { getStorageData, setStorageData, initialData } from '../utils/storage';

export const INJECTION_SITES = [
  { id: 'ab-left', name: 'Left Abdomen (SubQ)', area: 'Abdominal', coords: 'Left Umbilicus 2in', icon: '📍' },
  { id: 'ab-right', name: 'Right Abdomen (SubQ)', area: 'Abdominal', coords: 'Right Umbilicus 2in', icon: '📍' },
  { id: 'flank-left', name: 'Left Love Handle / Flank (SubQ)', area: 'Love Handle / Flank', coords: 'Lateral Iliac Crest Left', icon: '📍' },
  { id: 'flank-right', name: 'Right Love Handle / Flank (SubQ)', area: 'Love Handle / Flank', coords: 'Lateral Iliac Crest Right', icon: '📍' },
  { id: 'thigh-left', name: 'Left Thigh (SubQ)', area: 'Thigh', coords: 'Anterior / Outer Thigh Left', icon: '📍' },
  { id: 'thigh-right', name: 'Right Thigh (SubQ)', area: 'Thigh', coords: 'Anterior / Outer Thigh Right', icon: '📍' },
  { id: 'glute-left', name: 'Left Glute / Buttock (SubQ)', area: 'Gluteal', coords: 'Upper Outer Quadrant Left', icon: '📍' },
  { id: 'glute-right', name: 'Right Glute / Buttock (SubQ)', area: 'Gluteal', coords: 'Upper Outer Quadrant Right', icon: '📍' },
  { id: 'delt-left', name: 'Left Deltoid / Arm (SubQ)', area: 'Upper Arm', coords: 'Tricep / Lateral Deltoid Left', icon: '📍' },
  { id: 'delt-right', name: 'Right Deltoid / Arm (SubQ)', area: 'Upper Arm', coords: 'Tricep / Lateral Deltoid Right', icon: '📍' }
];

export const POPULAR_PEPTIDE_LIBRARY = [
  // User Requested Key Compounds
  { name: 'KLOW Blend (Klotho / KPV / BPC / GHK Ultimate Repair)', dose: '500 mcg', units: 20, frequency: '7 Days On / 0 Days Off (Daily Continuous)', timing: 'Morning Fasted', category: 'Cellular Youth & Tissue Regeneration', vialMg: 10, bacWaterMl: 2.0, color: '#38bdf8', halfLifeHours: 12.0 },
  { name: 'SS-31 (Elamipretide Cardiolipin Targeter)', dose: '4.0 mg', units: 40, frequency: '7 Days On / 0 Days Off (Daily Continuous)', timing: 'Morning', category: 'Mitochondrial Inner Membrane ATP', vialMg: 50, bacWaterMl: 5.0, color: '#6ee7b7', halfLifeHours: 4.5 },
  { name: 'MOTS-c (Mitochondrial ORF 12S rRNA)', dose: '5.0 mg', units: 50, frequency: '3x / Week', timing: 'Pre-Workout Fasted', category: 'Metabolic & Mitochondrial Biogenesis', vialMg: 10, bacWaterMl: 2.0, color: '#fbbf24', halfLifeHours: 4.0 },
  
  // Weight & Metabolic Next-Gen
  { name: 'Retatrutide (Triple G - GLP-1/GIP/Glucagon)', dose: '2.0 mg', units: 20, frequency: 'Once Weekly', timing: 'Morning Fasted', category: 'Metabolic & Fat Oxidation', vialMg: 10, bacWaterMl: 2.0, color: '#38bdf8', halfLifeHours: 144.0 },
  { name: 'Tirzepatide (Mounjaro / Zepbound GLP-1/GIP)', dose: '2.5 mg', units: 25, frequency: 'Once Weekly', timing: 'Morning Fasted', category: 'Glucose & Satiety', vialMg: 10, bacWaterMl: 2.0, color: '#6ee7b7', halfLifeHours: 120.0 },
  { name: 'Semaglutide (Ozempic / Wegovy GLP-1)', dose: '0.25 mg', units: 10, frequency: 'Once Weekly', timing: 'Morning Fasted', category: 'Appetite & Insulin Regulation', vialMg: 5, bacWaterMl: 2.0, color: '#6ee7b7', halfLifeHours: 168.0 },
  { name: 'Cagrilintide (Long-Acting Amylin Analog)', dose: '0.3 mg', units: 15, frequency: 'Once Weekly', timing: 'Morning Fasted', category: 'Amylin Satiety Agonist', vialMg: 5, bacWaterMl: 2.5, color: '#f472b6', halfLifeHours: 160.0 },
  { name: 'AOD-9604 (Lipolytic GH Fragment 176-191)', dose: '300 mcg', units: 15, frequency: '7 Days On / 0 Days Off (Daily Continuous)', timing: 'Morning / Pre-Cardio', category: 'Targeted Adipose Lipolysis', vialMg: 5, bacWaterMl: 2.5, color: '#fbbf24', halfLifeHours: 1.5 },
  { name: '5-Amino-1MQ (NNMT Inhibitor)', dose: '50 mg', units: 50, frequency: '7 Days On / 0 Days Off (Daily Continuous)', timing: 'Morning Fasted', category: 'Intracellular NAD+ & Fat Metabolism', vialMg: 500, bacWaterMl: 5.0, color: '#c084fc', halfLifeHours: 6.0 },

  // Tissue Healing & Regenerative
  { name: 'BPC-157 (Body Protection Compound)', dose: '250 mcg', units: 10, frequency: 'Twice Daily (AM/PM)', timing: 'AM / PM', category: 'Gut, Tendon & Angiogenesis', vialMg: 5, bacWaterMl: 2.0, color: '#38bdf8', halfLifeHours: 4.0 },
  { name: 'TB-500 (Thymosin Beta-4 Systemic)', dose: '2.5 mg', units: 50, frequency: '2x / Week', timing: 'Evening', category: 'Systemic Repair & Actin Cytoskeleton', vialMg: 10, bacWaterMl: 2.0, color: '#f472b6', halfLifeHours: 48.0 },
  { name: 'GHK-Cu (Copper Peptide Tripeptide-1)', dose: '2.0 mg', units: 20, frequency: '7 Days On / 0 Days Off (Daily Continuous)', timing: 'Morning', category: 'Skin, Decorin & Gene Remodeling', vialMg: 50, bacWaterMl: 5.0, color: '#38bdf8', halfLifeHours: 1.0 },
  { name: 'KPV (Alpha-MSH Tripeptide)', dose: '300 mcg', units: 15, frequency: '7 Days On / 0 Days Off (Daily Continuous)', timing: 'Morning', category: 'Gut Mucosa & Anti-Inflammatory', vialMg: 5, bacWaterMl: 2.5, color: '#6ee7b7', halfLifeHours: 2.0 },

  // Longevity & Immune
  { name: 'Epithalon (Epithalamin Pineal Bioregulator)', dose: '10 mg', units: 50, frequency: '7 Days On / 0 Days Off (Daily Continuous)', timing: 'Bedtime', category: 'Telomerase Activation & Circadian Clock', vialMg: 50, bacWaterMl: 5.0, color: '#c084fc', halfLifeHours: 2.5 },
  { name: 'Thymosin Alpha-1 (TA-1 / Zadaxin)', dose: '1.5 mg', units: 30, frequency: '2x / Week', timing: 'Morning', category: 'Immune Modulation & T-Cell Defense', vialMg: 10, bacWaterMl: 2.0, color: '#6ee7b7', halfLifeHours: 2.0 },
  { name: 'NAD+ (Nicotinamide Adenine Dinucleotide)', dose: '50 mg', units: 50, frequency: '3x / Week', timing: 'Morning Fasted', category: 'Cellular ATP & DNA Repair', vialMg: 500, bacWaterMl: 5.0, color: '#38bdf8', halfLifeHours: 3.0 },
  { name: 'FoxO4-DRI (Targeted Senolytic Peptide)', dose: '3.0 mg', units: 30, frequency: '3x / Week (Pulse Cycle)', timing: 'Morning', category: 'Senescent Zombie Cell Clearance', vialMg: 10, bacWaterMl: 1.0, color: '#f472b6', halfLifeHours: 4.0 },

  // Growth Hormone & Sleep
  { name: 'CJC-1295 (No DAC) / Ipamorelin Blend', dose: '300 mcg', units: 15, frequency: '5 Days On / 2 Days Off', timing: 'Bedtime (Fasted)', category: 'Natural Pituitary GH Secretagogue', vialMg: 5, bacWaterMl: 2.5, color: '#c084fc', halfLifeHours: 1.5 },
  { name: 'Tesamorelin (Egrifta GHRH Analog)', dose: '1.0 mg', units: 20, frequency: '7 Days On / 0 Days Off (Daily Continuous)', timing: 'Bedtime', category: 'Visceral Fat & IGF-1 Optimization', vialMg: 10, bacWaterMl: 2.0, color: '#fbbf24', halfLifeHours: 0.5 },
  { name: 'Sermorelin (GHRH 1-29)', dose: '500 mcg', units: 25, frequency: '7 Days On / 0 Days Off (Daily Continuous)', timing: 'Bedtime', category: 'Slow-Wave Sleep & Collagen Renewal', vialMg: 5, bacWaterMl: 2.5, color: '#c084fc', halfLifeHours: 0.5 },
  { name: 'Hexarelin (Potent GHRP & Cardioprotective)', dose: '100 mcg', units: 10, frequency: 'Pre-Workout / AM', timing: 'Morning Fasted', category: 'GH Secretion & Cardiac Perfusion', vialMg: 5, bacWaterMl: 5.0, color: '#f472b6', halfLifeHours: 1.2 },

  // Brain & Nootropic
  { name: 'Semax (Heptapeptide ACTH 4-10 Analog)', dose: '600 mcg', units: 12, frequency: '7 Days On / 0 Days Off (Daily Continuous)', timing: 'Morning', category: 'BDNF, TrkB & Cognitive Focus', vialMg: 10, bacWaterMl: 2.0, color: '#38bdf8', halfLifeHours: 0.5 },
  { name: 'Selank (Synthetic Tuftsin Analog)', dose: '500 mcg', units: 10, frequency: 'As Needed (AM/PM)', timing: 'Morning / Afternoon', category: 'GABAergic Anxiolytic & Neuro-Calm', vialMg: 10, bacWaterMl: 2.0, color: '#6ee7b7', halfLifeHours: 0.4 },
  { name: 'Dihexa (Potent Synaptogenic Oligopeptide)', dose: '10 mg', units: 20, frequency: '7 Days On / 0 Days Off (Daily Continuous)', timing: 'Morning', category: 'HGF Mimic & Synaptic Arborization', vialMg: 50, bacWaterMl: 5.0, color: '#fbbf24', halfLifeHours: 8.0 },

  // Sexual Health & Melanocortin
  { name: 'PT-141 (Bremelanotide SubQ)', dose: '1.5 mg', units: 30, frequency: 'As Needed (2-4h prior)', timing: 'Evening', category: 'Melanocortin MC3/MC4 Libido Agonist', vialMg: 10, bacWaterMl: 2.0, color: '#f472b6', halfLifeHours: 2.7 },
  { name: 'Kisspeptin-10 (GnRH Agonist)', dose: '200 mcg', units: 20, frequency: '2x / Week', timing: 'Bedtime', category: 'Hypothalamic LH/FSH & Testosterone Pulse', vialMg: 5, bacWaterMl: 5.0, color: '#c084fc', halfLifeHours: 0.8 },
  { name: 'Melanotan II (MT-2 Melanocortin)', dose: '250 mcg', units: 10, frequency: '2-3x / Week', timing: 'Pre-UV / Bedtime', category: 'Melanogenesis & Skin Pigmentation', vialMg: 10, bacWaterMl: 2.0, color: '#fbbf24', halfLifeHours: 1.5 }
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
    frequency: '7 Days On / 0 Days Off (Daily Continuous)',
    timing: 'Morning Fasted',
    category: 'Targeted Longevity',
    vialMg: 5,
    bacWaterMl: 2.0,
    halfLifeHours: 4.0,
    color: '#38bdf8'
  });

  // Protocol Add / Edit Form State with Cycle Tracking
  const [formData, setFormData] = useState({
    name: '',
    dose: '',
    units: '10',
    frequency: '7 Days On / 0 Days Off (Daily Continuous)',
    timing: 'Morning',
    category: 'Regenerative Healing',
    vialMg: '5',
    bacWaterMl: '2.0',
    stockVials: '2',
    color: '#38bdf8',
    start_date: new Date().toISOString().split('T')[0],
    cycle_duration: '30',
    cycle_days_on: '7',
    cycle_days_off: '0'
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
    if (window.confirm('Remove this protocol from your active stack?')) {
      const updated = injections.filter(inj => inj.id !== id);
      onUpdateInjections(updated);
    }
  };

  const handleOpenEditModal = (item) => {
    sound.playClick();
    setEditingCompoundId(item.id);
    setFormData({
      name: item.name || '',
      dose: item.dose || '',
      units: (item.units !== undefined ? item.units : 10).toString(),
      frequency: item.frequency || '7 Days On / 0 Days Off (Daily Continuous)',
      timing: item.timing || 'Morning',
      category: item.category || 'Regenerative Healing',
      vialMg: (item.vialMg || 5).toString(),
      bacWaterMl: (item.bacWaterMl || 2.0).toString(),
      stockVials: (item.stockVials || 2).toString(),
      color: item.color || '#38bdf8',
      start_date: item.start_date || new Date().toISOString().split('T')[0],
      cycle_duration: (item.cycle_duration || 30).toString(),
      cycle_days_on: (item.cycle_days_on !== undefined ? item.cycle_days_on : 7).toString(),
      cycle_days_off: (item.cycle_days_off !== undefined ? item.cycle_days_off : 0).toString()
    });
    setIsModalOpen(true);
  };

  const handleOpenAddModal = () => {
    sound.playClick();
    setEditingCompoundId(null);
    setFormData({
      name: '',
      dose: '250 mcg',
      units: '10',
      frequency: '7 Days On / 0 Days Off (Daily Continuous)',
      timing: 'Morning Fasted',
      category: 'Cellular Longevity',
      vialMg: '5',
      bacWaterMl: '2.0',
      stockVials: '2',
      color: '#38bdf8',
      start_date: new Date().toISOString().split('T')[0],
      cycle_duration: '30',
      cycle_days_on: '7',
      cycle_days_off: '0'
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
      cycle_days_on: 7,
      cycle_days_off: 0
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

    // Also add to active stack
    const createdProtocol = {
      id: 'inj-' + Date.now(),
      ...newCustom,
      active: true,
      lastTaken: 'Never',
      site: 'Left Abdomen (SubQ)',
      stockVials: 2,
      start_date: new Date().toISOString().split('T')[0],
      cycle_duration: 30,
      cycle_days_on: 7,
      cycle_days_off: 0
    };
    onUpdateInjections([...injections, createdProtocol]);

    setIsCustomLibModalOpen(false);
    setCustomCompoundData({
      name: '',
      dose: '250 mcg',
      units: 10,
      frequency: '7 Days On / 0 Days Off (Daily Continuous)',
      timing: 'Morning Fasted',
      category: 'Targeted Longevity',
      vialMg: 5,
      bacWaterMl: 2.0,
      halfLifeHours: 4.0,
      color: '#38bdf8'
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
            cycle_days_on: parseInt(formData.cycle_days_on) || 7,
            cycle_days_off: parseInt(formData.cycle_days_off) !== undefined ? parseInt(formData.cycle_days_off) : 0
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
        cycle_days_on: parseInt(formData.cycle_days_on) || 7,
        cycle_days_off: parseInt(formData.cycle_days_off) !== undefined ? parseInt(formData.cycle_days_off) : 0
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
    <div style={{ animation: 'popIn 0.25s ease', width: '100%' }}>
      {/* View Header */}
      <div className="section-header">
        <div>
          <h2>Peptide Protocols & SubQ Command</h2>
          <p>Manage your active stacks, cycle durations (7 on / 0 off continuous or customized), reconstitution parameters, and rotational subcutaneous sites.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            className="btn btn-secondary"
            style={{ fontSize: '14px', padding: '10px 18px', minHeight: '44px' }}
            onClick={() => setIsCustomLibModalOpen(true)}
          >
            🧬 + New Custom Compound
          </button>
          <button
            className="btn btn-primary"
            style={{ fontSize: '14px', padding: '10px 20px', minHeight: '44px' }}
            onClick={handleOpenAddModal}
          >
            + Add Active Protocol
          </button>
        </div>
      </div>

      {/* Featured 1-Click Library Bar */}
      <div className="card" style={{ marginBottom: '24px', padding: '20px', border: '1px solid rgba(56, 189, 248, 0.3)', background: 'rgba(22, 30, 44, 0.85)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
          <span style={{ fontSize: '12.5px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-cyan)' }}>
            ⚡ Master Peptide Library ({combinedLibrary.length} Formulations Ready)
          </span>
          <button
            className="btn btn-secondary"
            style={{ fontSize: '12px', padding: '6px 12px', minHeight: '34px' }}
            onClick={() => setIsCustomLibModalOpen(true)}
          >
            + Create Custom Formulation
          </button>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {combinedLibrary.slice(0, 8).map((lib, idx) => (
            <button
              key={idx}
              className="btn btn-secondary"
              style={{ fontSize: '13px', padding: '9px 14px', borderRadius: '10px', minHeight: '40px' }}
              onClick={() => handleQuickAddFromLibrary(lib)}
            >
              + {lib.name.split(' (')[0]} {lib.is_custom ? '⭐' : ''} ({lib.dose})
            </button>
          ))}
          <button
            className="btn btn-secondary"
            style={{ fontSize: '13px', padding: '9px 16px', borderColor: 'var(--accent-cyan)', color: 'var(--accent-cyan)', fontWeight: '700', minHeight: '40px' }}
            onClick={handleOpenAddModal}
          >
            + Browse All {combinedLibrary.length} Compounds...
          </button>
        </div>
      </div>

      {/* Grid Layout: Active Protocols + Site Rotation Map */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.45fr) minmax(0, 1fr)', gap: '24px', marginBottom: '28px' }}>
        
        {/* Active Protocols List with Cycle Tracking */}
        <div>
          <div className="card" style={{ padding: '22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '19px', fontWeight: '800', color: '#fff' }}>
                Active Protocols ({injections.length})
              </h3>
              <button
                className="btn btn-secondary"
                style={{ fontSize: '12.5px', padding: '6px 12px', minHeight: '36px' }}
                onClick={handleOpenAddModal}
              >
                + Add Another
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {injections.map((item) => (
                <div
                  key={item.id}
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--border)',
                    borderRadius: '14px',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '14px',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: item.color || 'var(--accent-cyan)' }} />

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <h4 style={{ fontSize: '17px', fontWeight: '800', color: '#fff' }}>{item.name}</h4>
                        <span className="badge badge-cyan" style={{ fontSize: '10.5px' }}>{item.category}</span>
                      </div>
                      <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '5px' }}>
                        Frequency: <strong style={{ color: '#fff' }}>{item.frequency}</strong> | Timing: <strong style={{ color: 'var(--accent-amber)' }}>{item.timing}</strong>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '20px', fontWeight: '800', fontFamily: 'var(--font-mono)', color: item.color || 'var(--accent-cyan)' }}>
                        {item.dose}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                        ({item.units} IU on Syringe)
                      </div>
                    </div>
                  </div>

                  {/* Cycle Tracking HUD on Card */}
                  <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px 14px', borderRadius: '10px', fontSize: '12.5px', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
                    <span>🔄 Cycle: <strong style={{ color: 'var(--accent-cyan)' }}>{item.cycle_duration || 30} Days</strong> (Started: {item.start_date || 'Active'})</span>
                    <span>Schedule: <strong style={{ color: 'var(--accent-sage)' }}>{item.cycle_days_on || 7}d ON / {item.cycle_days_off !== undefined ? item.cycle_days_off : 0}d OFF</strong></span>
                  </div>

                  {/* Prominent Action Buttons */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid var(--border)', flexWrap: 'wrap', gap: '10px' }}>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      Last Taken: <strong style={{ color: '#fff' }}>{item.lastTaken || 'Recently'}</strong> | Site: <strong style={{ color: 'var(--accent-cyan)' }}>{item.site || 'Abdomen'}</strong>
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button
                        className="btn btn-primary"
                        style={{ padding: '8px 18px', fontSize: '13.5px', minHeight: '40px' }}
                        onClick={() => handleLogInjection(item)}
                      >
                        ⚡ Log Dose
                      </button>

                      {/* EDIT BUTTON */}
                      <button
                        className="btn btn-secondary"
                        style={{ padding: '8px 16px', fontSize: '13.5px', minHeight: '40px', color: 'var(--accent-cyan)', borderColor: 'rgba(56, 189, 248, 0.4)' }}
                        onClick={() => handleOpenEditModal(item)}
                        title="Edit Dosage, Cycle & Protocol"
                      >
                        ✏️ Edit Protocol & Cycle
                      </button>

                      {/* DELETE BUTTON */}
                      <button
                        className="btn btn-danger"
                        style={{ padding: '8px 14px', fontSize: '13.5px', minHeight: '40px' }}
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

        {/* Subcutaneous Injection Site Rotation Map */}
        <div className="card" style={{ padding: '22px', border: '1px solid rgba(244, 114, 182, 0.3)' }}>
          <h3 style={{ fontSize: '19px', fontWeight: '800', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px', color: '#fff' }}>
            <span>📍</span> Subcutaneous (SubQ) Rotation Matrix
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '18px', lineHeight: '1.4' }}>
            Select your target SubQ area before administering to prevent lipohypertrophy and optimize absorption.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
            {INJECTION_SITES.map((site) => {
              const isSelected = selectedSite === site.id;
              return (
                <div
                  key={site.id}
                  onClick={() => { sound.playClick(); setSelectedSite(site.id); }}
                  style={{
                    background: isSelected ? 'rgba(56, 189, 248, 0.18)' : 'rgba(255, 255, 255, 0.03)',
                    border: isSelected ? '2px solid var(--accent-cyan)' : '1px solid var(--border)',
                    borderRadius: '10px',
                    padding: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px', fontWeight: isSelected ? '800' : '600', color: isSelected ? '#fff' : 'var(--text-muted)' }}>
                      {site.name}
                    </span>
                    {isSelected && <span style={{ color: 'var(--accent-cyan)', fontSize: '11px', fontWeight: '800' }}>● Active</span>}
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>{site.coords}</span>
                </div>
              );
            })}
          </div>

          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '11.5px', color: 'var(--accent-amber)', fontWeight: '800', textTransform: 'uppercase', marginBottom: '4px' }}>
              💡 SubQ Rotation Best Practice
            </div>
            <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', lineHeight: '1.4' }}>
              Rotate between abdominal fat, lateral love handles / flanks, outer thighs, and upper gluteal subcutaneous depots. Maintain at least 1 inch distance from previous injection sites.
            </div>
          </div>
        </div>
      </div>

      {/* FULL MODAL TO ADD OR EDIT PROTOCOL WITH CYCLE TRACKING */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => { setIsModalOpen(false); setEditingCompoundId(null); }}>
          <div className="modal-box" style={{ maxWidth: '780px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 style={{ fontSize: '22px', fontWeight: '800', color: '#fff', margin: 0 }}>
                  {editingCompoundId ? '✏️ Edit Peptide Protocol & Cycle' : 'Master Peptide Library & Protocol Builder'}
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
                  {editingCompoundId ? 'Update your exact dosage, continuous/pulsed cycle schedule, and syringe units.' : 'Search and 1-click add popular peptides or configure custom formulation cycles.'}
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
                    className="input-field"
                    style={{ minHeight: '48px', fontSize: '15px' }}
                    value={librarySearch}
                    onChange={(e) => setLibrarySearch(e.target.value)}
                  />
                </div>

                <div style={{ marginBottom: '22px' }}>
                  <div className="input-label">
                    Pre-Configured Formulations & Custom Additions ({filteredLibrary.length})
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', maxHeight: '240px', overflowY: 'auto', paddingRight: '4px' }}>
                    {filteredLibrary.map((item, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleQuickAddFromLibrary(item)}
                        style={{
                          background: 'rgba(255, 255, 255, 0.04)',
                          border: '1px solid var(--border)',
                          borderRadius: '10px',
                          padding: '12px 14px',
                          cursor: 'pointer',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          transition: 'all 0.15s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent-cyan)'}
                        onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
                      >
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: '700', color: '#fff' }}>
                            {item.name.split(' (')[0]} {item.is_custom ? '⭐' : ''}
                          </div>
                          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{item.dose} • {item.frequency}</div>
                          <div style={{ fontSize: '11px', color: 'var(--accent-cyan)', marginTop: '2px' }}>{item.category}</div>
                        </div>
                        <span className="badge badge-cyan" style={{ fontSize: '11px' }}>+ Add</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '18px', marginBottom: '14px' }}>
                  <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--accent-sage)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Or Build Custom Protocol Details:
                  </span>
                </div>
              </>
            )}

            {/* Add / Edit Form */}
            <form onSubmit={handleSaveCompoundForm}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label className="input-label">Compound Name</label>
                  <input
                    type="text"
                    placeholder="e.g. KLOW Blend"
                    className="input-field"
                    style={{ minHeight: '48px', fontSize: '15px' }}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="input-label">Target Dose</label>
                  <input
                    type="text"
                    placeholder="e.g. 500 mcg"
                    className="input-field"
                    style={{ minHeight: '48px', fontSize: '15px' }}
                    value={formData.dose}
                    onChange={(e) => setFormData({ ...formData, dose: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="input-label">Syringe Units (IU)</label>
                  <input
                    type="number"
                    placeholder="e.g. 20"
                    className="input-field"
                    style={{ minHeight: '48px', fontSize: '15px' }}
                    value={formData.units}
                    onChange={(e) => setFormData({ ...formData, units: e.target.value })}
                  />
                </div>
              </div>

              {/* Cycle & Timing Parameters */}
              <div style={{ background: 'rgba(56, 189, 248, 0.08)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(56, 189, 248, 0.3)', marginBottom: '16px' }}>
                <div style={{ fontSize: '12.5px', fontWeight: '800', color: 'var(--accent-cyan)', marginBottom: '10px' }}>
                  🔄 Lifecycle & Dosing Schedule (7 Days On / 0 Days Off Supported)
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 1fr', gap: '10px' }}>
                  <div>
                    <label className="input-label" style={{ fontSize: '11px' }}>Protocol Start Date</label>
                    <input
                      type="date"
                      className="input-field"
                      style={{ minHeight: '44px', fontSize: '14px' }}
                      value={formData.start_date}
                      onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="input-label" style={{ fontSize: '11px' }}>Total Cycle Duration (Days)</label>
                    <input
                      type="number"
                      min="7"
                      max="180"
                      className="input-field"
                      style={{ minHeight: '44px', fontSize: '14px' }}
                      value={formData.cycle_duration}
                      onChange={(e) => setFormData({ ...formData, cycle_duration: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="input-label" style={{ fontSize: '11px' }}>Days ON</label>
                    <input
                      type="number"
                      min="1"
                      max="7"
                      className="input-field"
                      style={{ minHeight: '44px', fontSize: '14px' }}
                      value={formData.cycle_days_on}
                      onChange={(e) => setFormData({ ...formData, cycle_days_on: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="input-label" style={{ fontSize: '11px' }}>Days OFF</label>
                    <input
                      type="number"
                      min="0"
                      max="7"
                      className="input-field"
                      style={{ minHeight: '44px', fontSize: '14px' }}
                      value={formData.cycle_days_off}
                      onChange={(e) => setFormData({ ...formData, cycle_days_off: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                <div>
                  <label className="input-label">Administration Frequency & Schedule</label>
                  <select
                    className="select-field"
                    style={{ minHeight: '48px', fontSize: '15px' }}
                    value={formData.frequency}
                    onChange={(e) => {
                      const val = e.target.value;
                      let daysOn = formData.cycle_days_on;
                      let daysOff = formData.cycle_days_off;
                      if (val.includes('7 Days') || val.includes('Daily Continuous')) {
                        daysOn = '7';
                        daysOff = '0';
                      } else if (val.includes('6 Days')) {
                        daysOn = '6';
                        daysOff = '1';
                      } else if (val.includes('5 Days')) {
                        daysOn = '5';
                        daysOff = '2';
                      } else if (val.includes('Every Other Day')) {
                        daysOn = '1';
                        daysOff = '1';
                      }
                      setFormData({ ...formData, frequency: val, cycle_days_on: daysOn, cycle_days_off: daysOff });
                    }}
                  >
                    <option value="7 Days On / 0 Days Off (Daily Continuous)">7 Days On / 0 Days Off (Daily Continuous)</option>
                    <option value="Daily (AM)">Daily (AM) - Continuous</option>
                    <option value="Daily (PM)">Daily (PM) - Continuous</option>
                    <option value="Twice Daily (AM/PM)">Twice Daily (AM/PM)</option>
                    <option value="6 Days On / 1 Day Off">6 Days On / 1 Day Off</option>
                    <option value="5 Days On / 2 Days Off">5 Days On / 2 Days Off</option>
                    <option value="Every Other Day (EOD)">Every Other Day (EOD)</option>
                    <option value="3x / Week">3x / Week (Mon/Wed/Fri)</option>
                    <option value="2x / Week">2x / Week (Mon/Thu)</option>
                    <option value="Once Weekly">Once Weekly</option>
                    <option value="As Needed / Acute">As Needed / Acute</option>
                  </select>
                </div>

                <div>
                  <label className="input-label">Circadian Ingestion Timing</label>
                  <select
                    className="select-field"
                    style={{ minHeight: '48px', fontSize: '15px' }}
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
                  <label className="input-label">Category / Objective</label>
                  <input
                    type="text"
                    placeholder="Tissue Repair / Mitochondrial Longevity"
                    className="input-field"
                    style={{ minHeight: '48px', fontSize: '15px' }}
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  />
                </div>

                <div>
                  <label className="input-label">Vials in Stock</label>
                  <input
                    type="text"
                    placeholder="e.g. 3"
                    className="input-field"
                    style={{ minHeight: '48px', fontSize: '15px' }}
                    value={formData.stockVials}
                    onChange={(e) => setFormData({ ...formData, stockVials: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ minHeight: '46px', padding: '10px 20px', fontSize: '14px' }}
                  onClick={() => { setIsModalOpen(false); setEditingCompoundId(null); }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ minHeight: '46px', padding: '10px 24px', fontSize: '14px' }}>
                  {editingCompoundId ? '✓ Save Protocol Changes' : '+ Add Protocol to Stack'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CUSTOM COMPOUND CREATOR MODAL */}
      {isCustomLibModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsCustomLibModalOpen(false)}>
          <div className="modal-box" style={{ maxWidth: '640px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 style={{ fontSize: '22px', fontWeight: '800', color: '#fff', margin: 0 }}>
                  🧬 Create Custom Compound for Library
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
                  Save your custom compound with reconstitution metrics to your persistent database.
                </p>
              </div>
              <button className="modal-close" onClick={() => setIsCustomLibModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleSaveCustomCompoundToLibrary} style={{ marginTop: '16px' }}>
              <div style={{ marginBottom: '14px' }}>
                <label className="input-label">Compound Name</label>
                <input
                  type="text"
                  placeholder="e.g. BPC-157 / TB-500 Blend"
                  className="input-field"
                  style={{ minHeight: '48px', fontSize: '15px' }}
                  value={customCompoundData.name}
                  onChange={(e) => setCustomCompoundData({ ...customCompoundData, name: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label className="input-label">Standard Dose</label>
                  <input
                    type="text"
                    placeholder="e.g. 500 mcg"
                    className="input-field"
                    style={{ minHeight: '48px', fontSize: '15px' }}
                    value={customCompoundData.dose}
                    onChange={(e) => setCustomCompoundData({ ...customCompoundData, dose: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="input-label">Syringe Units (IU)</label>
                  <input
                    type="number"
                    className="input-field"
                    style={{ minHeight: '48px', fontSize: '15px' }}
                    value={customCompoundData.units}
                    onChange={(e) => setCustomCompoundData({ ...customCompoundData, units: parseInt(e.target.value) || 10 })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label className="input-label">Frequency</label>
                  <select
                    className="select-field"
                    style={{ minHeight: '48px', fontSize: '15px' }}
                    value={customCompoundData.frequency}
                    onChange={(e) => setCustomCompoundData({ ...customCompoundData, frequency: e.target.value })}
                  >
                    <option value="7 Days On / 0 Days Off (Daily Continuous)">7 Days On / 0 Days Off (Daily Continuous)</option>
                    <option value="Daily (AM)">Daily (AM)</option>
                    <option value="Daily (PM)">Daily (PM)</option>
                    <option value="Twice Daily (AM/PM)">Twice Daily (AM/PM)</option>
                    <option value="6 Days On / 1 Day Off">6 Days On / 1 Day Off</option>
                    <option value="5 Days On / 2 Days Off">5 Days On / 2 Days Off</option>
                    <option value="Every Other Day (EOD)">Every Other Day (EOD)</option>
                    <option value="3x / Week">3x / Week</option>
                    <option value="Once Weekly">Once Weekly</option>
                  </select>
                </div>
                <div>
                  <label className="input-label">Category</label>
                  <input
                    type="text"
                    placeholder="Regenerative Healing"
                    className="input-field"
                    style={{ minHeight: '48px', fontSize: '15px' }}
                    value={customCompoundData.category}
                    onChange={(e) => setCustomCompoundData({ ...customCompoundData, category: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                <div>
                  <label className="input-label">Vial (mg)</label>
                  <input
                    type="number"
                    step="0.1"
                    className="input-field"
                    style={{ minHeight: '48px', fontSize: '15px' }}
                    value={customCompoundData.vialMg}
                    onChange={(e) => setCustomCompoundData({ ...customCompoundData, vialMg: parseFloat(e.target.value) || 5 })}
                  />
                </div>
                <div>
                  <label className="input-label">BAC Water (mL)</label>
                  <input
                    type="number"
                    step="0.1"
                    className="input-field"
                    style={{ minHeight: '48px', fontSize: '15px' }}
                    value={customCompoundData.bacWaterMl}
                    onChange={(e) => setCustomCompoundData({ ...customCompoundData, bacWaterMl: parseFloat(e.target.value) || 2.0 })}
                  />
                </div>
                <div>
                  <label className="input-label">Half-Life (Hours)</label>
                  <input
                    type="number"
                    step="0.1"
                    className="input-field"
                    style={{ minHeight: '48px', fontSize: '15px' }}
                    value={customCompoundData.halfLifeHours}
                    onChange={(e) => setCustomCompoundData({ ...customCompoundData, halfLifeHours: parseFloat(e.target.value) || 4.0 })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ minHeight: '46px', padding: '10px 18px', fontSize: '14px' }}
                  onClick={() => setIsCustomLibModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ minHeight: '46px', padding: '10px 22px', fontSize: '14px' }}>
                  ✓ Save to Library & Activate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
